import { expect } from '@playwright/test';
import { test, defaultMatcher } from 'playwright-advanced-har';

test('has title', async ({ page, advancedRouteFromHAR }) => {
  await advancedRouteFromHAR('./hars/reqs.har', {
    updateMode: 'minimal',
    url: 'https://www.example.com/**',
    update: true,
    updateContent: 'embed',
    matcher: (request, entry) => {
      const reqUrl = new URL(request.url());
      const entryUrl = new URL(entry.request.url);

      reqUrl.search = reqUrl.search.replace(
        /client=[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}&?/,
        ''
      );
      entryUrl.search = entryUrl.search.replace(
        /client=[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}&?/,
        ''
      );

      if (
        reqUrl.toString() === entryUrl.toString() &&
        request.method() === entry.request.method &&
        request.postData() == entry.request.postData?.text
      ) {
        return 1;
      }
      return -1;
    },
  });

  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});
