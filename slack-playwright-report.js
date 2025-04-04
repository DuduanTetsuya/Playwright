const fs = require("fs");
const axios = require("axios");

const SLACK_WEBHOOK_URL = "https://hooks.slack.com/services/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";

// **Baca file laporan JSON**
const report = JSON.parse(fs.readFileSync("playwright-report.json", "utf-8"));

// **Cari eksekusi terakhir berdasarkan `startTime`**
const lastExecutionSuite = report.suites.reduce((latest, suite) => {
  return !latest || suite.startTime > latest.startTime ? suite : latest;
}, null);

if (!lastExecutionSuite) {
  console.error("❌ No test results found.");
  process.exit(1);
}

// **Ambil semua tes dalam eksekusi terakhir**
const lastTests = lastExecutionSuite.specs;

// **Ringkasan hasil tes terakhir**
const totalTests = lastTests.length;
const passedTests = lastTests.filter((spec) => spec.ok).length;
const failedTests = totalTests - passedTests;
const skippedTests = lastTests.filter((spec) => spec.skipped).length;

// **Detail hasil tes terakhir, termasuk langkah-langkah (test.step)**
let testDetails = lastTests
  .map((spec) => {
    let resultText = `*${spec.title}*: ${spec.ok ? "✅ PASSED" : "❌ FAILED"}`;

    // **Loop ke dalam langkah-langkah (test.step)**
    let stepDetails = spec.tests.flatMap((test) =>
      test.results.flatMap((result) =>
        result.steps.map(
          (step) => `  - ${step.title}: ${step.duration}ms`
        )
      )
    );

    return [resultText, ...stepDetails].join("\n");
  })
  .join("\n\n");

// **Buat pesan Slack**
const message = `🎭 *Playwright Test Report from Local* 🚀\n
*Summary (Last Execution Only)*
Total Tests: ${totalTests}
✅ Passed: ${passedTests}
❌ Failed: ${failedTests}
⚠️ Skipped: ${skippedTests}

*Test Details*
${testDetails}`;

// **Kirim ke Slack**
axios.post(SLACK_WEBHOOK_URL, { text: message })
  .then(() => console.log("✅ Report sent to Slack!"))
  .catch((err) => console.error("❌ Failed to send report:", err));
