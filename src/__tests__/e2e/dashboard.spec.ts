import {
  test,
  expect,
  _electron as electron,
  Page,
  ElectronApplication,
} from '@playwright/test';
import path from 'path';

/**
 * For Getting started with Playwright, see here:
 * @see https://playwright.dev/docs/intro
 */

//https://github.com/microsoft/playwright/issues/13288#issuecomment-1324357472 running headlessly

test.describe.serial(() => {
  let page: Page;
  let electronApp: ElectronApplication;
  test.beforeAll(async () => {
    electronApp = await electron.launch({
      args: [
        path.join(__dirname, '..', '..', '..', 'release', 'app', 'dist', 'main', 'main.js'),
      ],
    });
    page = await electronApp.firstWindow();
    // Direct Electron console to Node terminal.
    page.on('console', console.log);
  });

  test.afterAll(async () => {
    await electronApp.close();
  });


  test('Does Homepage have all major compnents', async () => {
    // Evaluation expression in the Electron context.
    const appPath = await electronApp.evaluate(async ({ app }) => {
      // This runs in the main Electron process, parameter here is always
      // the result of the require('electron') in the main app script.
      return app.getAppPath();
    });
    console.log(appPath);

    // Print the title.
    console.log("TITLE " + await page.title());

    await expect(page).toHaveTitle('Multimedia Center');

    await expect(page.locator('text=DEBUG')).toBeVisible();
    await expect(page.locator('text=WELCOME')).toBeVisible();
    //await expect(page.locator('text=MUSIC')).toBeVisible();
  });
});