const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:8888/');
    // const a = await page.$('a');
    // console.log(await a.asElement().boxModel());
    const imgs = await page.$$('a');
    console.log(imgs);
    // await page.screenshot({ path: 'example.png' });
    // await browser.close();
})();