const fs = require("fs");
const axios = require("axios");

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

if (!SLACK_WEBHOOK_URL) {
  console.error("❌ SLACK_WEBHOOK_URL tidak ditemukan di environment.");
  process.exit(1);
}

// Tunggu file JSON tersedia
const waitForFile = (filePath, timeout = 5000) => {
  const start = Date.now();
  while (!fs.existsSync(filePath)) {
    if (Date.now() - start > timeout) {
      throw new Error("⏳ Timeout: Report file belum tersedia.");
    }
  }
};

waitForFile("./playwright-report.json");

let report;
try {
  const raw = fs.readFileSync("./playwright-report.json", "utf-8");
  report = JSON.parse(raw);
} catch (err) {
  console.error("❌ Gagal membaca atau mem-parsing JSON:", err);
  process.exit(1);
}

if (!report?.suites || report.suites.length === 0) {
  console.error("❌ Tidak ada data suite ditemukan dalam laporan.");
  process.exit(1);
}

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
let skippedTests = 0;
let details = [];

function extractTests(suite) {
  if (suite.suites?.length) {
    suite.suites.forEach(extractTests);
  }

  if (suite.specs?.length) {
    const suiteTitle = suite.title || "(No Describe)";
    let suiteDetail = `*${suiteTitle}*`;

    for (const spec of suite.specs) {
      for (const test of spec.tests || []) {
        totalTests++;

        // Ambil result terakhir
        const lastResult = test.results?.[test.results.length - 1];
        let icon = "❌ FAILED";
        if (lastResult?.status === "passed") {
          passedTests++;
          icon = "✅ PASSED";
        } else if (lastResult?.status === "skipped") {
          skippedTests++;
          icon = "⚠️ SKIPPED";
        } else {
          failedTests++;
        }

        let resultText = `> ${test.title || spec.title}: ${icon}`;

        // Tambahkan langkah (steps)
        if (Array.isArray(lastResult?.steps)) {
          const stepLines = [];
          for (const step of lastResult.steps) {
            try {
              const stepTitle = step?.title ?? "(no title)";
              const duration = typeof step?.duration === "number" ? step.duration : "N/A";
              stepLines.push(`>> ${stepTitle} (${duration}ms)`);
            } catch (stepErr) {
              stepLines.push(">> [error reading step]");
            }
          }
          if (stepLines.length > 0) {
            resultText += `\n${stepLines.join("\n")}`;
          }
        }

        suiteDetail += `\n${resultText}`;
      }
    }

    details.push(suiteDetail);
  }
}

// Ekstrak semua test
try {
  for (const rootSuite of report.suites) {
    extractTests(rootSuite);
  }
} catch (e) {
  console.error("❌ Error saat memproses suites:", e);
  process.exit(1);
}

// Format pesan Slack
const message = `:performing_arts: *Playwright Test Report from Local* :rocket:

*Summary*
Total Tests: ${totalTests}
:white_check_mark: Passed: ${passedTests}
:x: Failed: ${failedTests}
:warning: Skipped: ${skippedTests}

*Details*
${details.join("\n\n")}
`;

// Kirim ke Slack
axios.post(SLACK_WEBHOOK_URL, { text: message })
  .then(() => console.log("✅ Report sent to Slack!"))
  .catch((err) => {
    console.error("❌ Gagal mengirim ke Slack:", err.response?.data || err.message);
    process.exit(1);
  });
