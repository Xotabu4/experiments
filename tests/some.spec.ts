import { test, expect, Page } from '@playwright/test'
import { Application } from '../pages/app'

export const baseTest = test.extend<{ app: Application }>({
  app: async ({ page }, use) => {
    await use(new Application(page));
  },
});

test.describe('Org Administrator', () => {
  baseTest('[26765] Verify Org Administrator has full access to Recurring Donors report in classy manager @Smoke', async ({ app }) => {
    
    // Login to the application
    await app.login.loginWithCredentials(testData.login, testData.password)

    // Navigating to campaign overview page
    await app.overview.visit(testData.campaignId)

    // Validating access to Reports > Recurring Donors
    await app.overview.button.reports.click()

    // Validating user navigates to Recurring Giving Plan in classy Manager
    const popup = await app.overview.button.openRecurringDonorsPopup();
    await expect(popup).toHaveURL(new RegExp('([^\\/]+)\\/admin\\/(\\d+)\\/recurring-plans'))
    await expect(popup).toHaveTitle('Recurring Giving Plans', { timeout: 20000 })

    const app2 = new App(popup)

    //Assertion of UI elements
    await app2.recurringGivingPlans.expectLoaded()

    // Validate rows in report
    await app2.recurringGivingPlans.list.recurringPlanId.expectCountGreaterThan(1)
  
    // Validate report shows one campaign name in
    await app2.recurringGivingPlans.expectCampaignNameListText(testData.reportCampaignName);
  })
})




