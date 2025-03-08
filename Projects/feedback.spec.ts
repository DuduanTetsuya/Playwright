import { test } from '@playwright/test';
import { FeedbackPage } from './feedbackpage';

test('Fill and Submit Feedback Form', async ({ page }) => {
  const feedbackPage = new FeedbackPage(page);

  await feedbackPage.visit();
  await feedbackPage.fillForm('Duanestra', 'Febri', 'duanestra@gmail.com', 'Quality Assurance Automation');
  await feedbackPage.submitForm();
  await feedbackPage.verifySubmission();
});
