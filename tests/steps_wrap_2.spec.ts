import { test, expect, Page, TestInfo } from '@playwright/test';

export function step<This, Args extends any[], Return>(
  target: (this: This, ...args: Args) => Promise<Return>,
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Promise<Return>>
) {
  function replacementMethod(this: This, ...args: Args): Promise<Return> {
    // @ts-ignore
    const name = this.constructor.name + '.' + (context.name as string) + '(' + args.map(a => JSON.stringify(a)).join(',') + ')';
    return test.step(name, async () => {
      return await target.call(this, ...args);
    });
  }
  return replacementMethod;
}

class HomePage {
  arg1 = 'arg1'

  constructor(private page: Page) { 

  }
  
  @step
  async testAction(arg2) {
    console.log(this.arg1, arg2);
    return 'testAction'
  }

  @step
  async open() {
    await this.page.goto('https://playwright.dev/');
  }

  @step
  async clickStartedLink() {
    await this.page.getByRole('link', { name: 'Get started' }).click();
  }
}

test('get started link', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.open();
  await homePage.clickStartedLink();
  await homePage.testAction('test2')
  // Expects the URL to contain intro.
  await expect(page).toHaveURL(/.*intro/);
});




