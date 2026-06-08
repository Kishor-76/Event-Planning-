const { chromium } = require('playwright');

(async () => {
  console.log('Launching headless browser...');
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
  } catch (err) {
    console.error('Failed to launch chromium via playwright:', err.message);
    process.exit(1);
  }
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`BROWSER CONSOLE [${msg.type()}]:`, msg.text());
  });

  page.on('pageerror', err => {
    console.log('BROWSER PAGE ERROR:', err.message);
  });

  try {
    console.log('Navigating to http://localhost:5174/...');
    await page.goto('http://localhost:5174/', { waitUntil: 'load', timeout: 5000 });
    console.log('Page loaded. Waiting for 3 seconds for React execution...');
    await page.evaluate(async () => {
      await new Promise(resolve => setTimeout(resolve, 3000));
    });
    const content = await page.content();
    console.log('PAGE CONTENT LENGTH:', content.length);
  } catch (err) {
    console.error('NAVIGATION ERROR:', err.message);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
})();
