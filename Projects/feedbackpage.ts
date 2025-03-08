import { Page, expect } from '@playwright/test';

export class FeedbackPage {
    constructor(public page: Page) {}

    async visit(){
        await this.page.goto('https://www.jotform.com/form-templates/preview/21022509285447/classic&nofs&defer=false&disableSmartEmbed=1');
        await expect(this.page.locator('#header_1')).toMatchAriaSnapshot(`- heading "Feedback Form" [level=1]`);
    }

    async fillForm(name: string, lastName: string, email: string, feedback: string) {
        await this.page.getByRole('textbox', { name: 'Describe Your Feedback:*' }).fill(feedback);
        await this.page.getByRole('textbox', { name: 'Name* First Name' }).fill(name);
        await this.page.getByRole('textbox', { name: 'Name* Last Name' }).fill(lastName);
        await this.page.getByRole('textbox', { name: 'E-mail* example@example.com' }).fill(email);
    }

    async submitForm() {
        await this.page.getByRole('button', { name: 'Submit' }).click();
    }
    
    async verifySubmission() {
        await expect(this.page.getByRole('paragraph')).toHaveText('Your submission has been received.');
    }
}