var pw = require('@playwright/test');
var test = pw.test;
var expect = pw.expect;

var renderers = ['webgl', 'canvas'];

renderers.forEach(function (renderer)
{
    test('bitmap-text (' + renderer + ')', async function ({ page })
    {
        await page.goto('http://localhost:8080/visual-tests/bitmap-text/index.html?renderer=' + renderer);

        var canvas = page.locator('#game canvas');
        await canvas.waitFor({ state: 'visible', timeout: 15000 });
        await page.waitForFunction(function () { return window.__READY__; });

        await expect(canvas).toHaveScreenshot('bitmap-text-' + renderer + '.png');
    });
});
