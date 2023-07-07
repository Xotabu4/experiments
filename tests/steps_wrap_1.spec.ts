// import { test, expect, Page, TestInfo } from '@playwright/test';

// const wrapMethodsToSteps = {
//   get(target, prop) {
//     if (typeof target[prop] === 'function') {
//       return new Proxy(target[prop], {
//         apply: (target, thisArg, argumentsList) => {
//           return test.step(prop, ()=> target.call(thisArg, ...argumentsList));
//         }
//       });
//     } else {
//       return Reflect.get(target, prop);
//     }
//   }
// }

// const HomePage = (page: Page) => new Proxy({
//   arg1: 'arg1',
//   async testAction(arg2) {
//     console.log(this.arg1, arg2);
//   },
//   async open() {
//     await page.goto('https://playwright.dev/');
//   },
//   async clickStartedLink() {
//     await page.getByRole('link', { name: 'Get started' }).click();
//   },
// }, wrapMethodsToSteps);


// test.describe('Experiment', () => {
//   test('get started link', async ({ page }, testInfo) => {
//     console.log('####', testInfo.project.use.baseURL);

//     const response = await request.post(`${testInfo.project.use.baseURL}/app-invitations`, ...)
    
//     const homePage = HomePage(page);
//     await homePage.open();
//     await homePage.clickStartedLink();
//     await homePage.testAction('test2')
//     // Expects the URL to contain intro.
//     await expect(page).toHaveURL(/.*intro/);

//   });
// })


import { expect, test } from "@playwright/test";
import axios from "axios";


test('minisite', async ({page}) => {

    let error = '';
    const dealerIds = await axios.get('https://auto.ria.com/demo/bu/catalogs/company/v2/search/?catalogData={"catalogName":"dealers","companyType":2,"query":{},"catalogIPP":"1000"}')
        .then((res) => Object.values(res.data.items));

    const dealerIdsWithMinisite = [];

    for (const dealerId of dealerIds) {
        const response = await axios.get(https://auto.ria.com/company_api/api/company/${dealerId})
            .then((res) => res.data);

        if (response.minisiteUrl && response.minisiteUrl !== '') {
            const autos = response.autos;
            if (autos && autos.length > 0) {
                const randomAutoId = autos[Math.floor(Math.random() * autos.length)];
                dealerIdsWithMinisite.push({
                    dealerId: dealerId,
                    minisiteUrl: response.minisiteUrl,
                    autoId: randomAutoId
                });
            }
        }
    }

    if (dealerIdsWithMinisite.length > 0) {
        for (const item of dealerIdsWithMinisite) {
            const autoId = item.autoId;
            const minisiteUrl = item.minisiteUrl;
            const url = `https://auto.ria.com/uk/auto___${autoId}.html`;
            // console.log(url);
            await page.goto(url);

            const elements = await page.locator('#userInfoBlock a[href$=".ria.biz"]').all();
            // console.log(elements);
            if (elements.length > 0) {
                const linkHref = await elements[0].getAttribute('href');
                // await page.pause();
                // console.log(linkHref);
                const responsePromise = page.waitForResponse(linkHref);
                await page.goto(linkHref);
                await page.waitForLoadState('domcontentloaded');
                const response = await responsePromise;
                const status = response.status();
                const currentUrl = page.url();
                console.log(status);
                if (status < 200 || status > 299) {
                    error += Неправильний статус відповіді мінісайту: ${status}, minisiteUrl: ${item.minisiteUrl}, currentUrl: ${currentUrl}\n;
                }

