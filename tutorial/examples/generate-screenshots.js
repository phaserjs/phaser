const puppeteer = require('puppeteer');
const httpServer = require('http-server');
const fs = require('fs-extra');
const p = require('path');


var server = httpServer.createServer();
server.listen(8080, 'localhost', () => {});

let examples = [];
const getExamples = (path, depth = 0) => {
  const files = fs.readdirSync(p.resolve(path));
  if (depth > maxDepth || path.includes('archived') || path.includes('3.24')) {
    return;
  }

  if (files.includes('boot.json')){
    examples.push({
      url: path + '/' + 'boot.json',
      path: p.resolve(path, 'boot.json'),
    });
  } else {
    for(let file of files) {
      const fileInfo = fs.statSync(p.resolve(path, file));
      if (fileInfo.isDirectory() && file[0] !== '_') {
        getExamples(path + '/' + file, depth + 1);
      } else if (file[0] !== '_' && file[0] !== '.') {
        examples.push({
          url: path + '/' +  file,
          path: p.resolve(path, file),
        });
      }
    }
  }
}

let screenshots = [];
const maxDepth = 25;
const getScreenshots = (path, depth = 0) => {
  const files = fs.readdirSync(path);
  if (depth > maxDepth) {
    return;
  }
  for(let file of files) {
    const fileInfo = fs.statSync(p.resolve(path, file));
    if (fileInfo.isDirectory()) {
      getScreenshots(p.resolve(path, file), depth + 1);
    }
    screenshots.push(p.resolve(path, file));
  }
}

getExamples('./public/src');
examples = examples
  .filter(e => !e.url.includes('rbush'))
  .filter(e => e.url.match(/[^\.]+$/)[0].slice(0,2) === 'js')
  .map(e => ({ url: e.url = 'http://localhost:8080/' + (e.url.includes('boot.json') ? 'boot.html?src=' : 'view.html?src=') + e.url.slice(9).replace(/\//g, '\\'), path: e.path.toLowerCase().replace(/src/, 'screenshots').replace(/\.json/, '').replace(/\.js/, '') + '.png' }));

getScreenshots('./public/screenshots');
screenshots = screenshots
  .map(s => s.toLowerCase());

const saveCanvas = async (page, example) => {
  return new Promise(async (resolve, reject) => {
    const path = example.path;

    console.log('- ' + example.url);
    console.log('  Screenshot to path:', path);
    const filename = path.match(/[^\/\\]+$/)[0];
    fs.mkdirp(path.slice(0, -(filename.length + 1)));
    await page.goto(example.url);
    try {
      await page.waitForSelector('canvas', {
        timeout: 5000,
      });
    } catch (e) {
      fs.copyFileSync(p.resolve('public/images/doc.png'), p.resolve(path));
      resolve();
      return;
    }
    await page.evaluate(() => {
      const c = document.querySelector('canvas');
      c.style.width = 800 + 'px';
      c.style.height = 600 + 'px';
    });
    page.mouse.click(200, 150);
    await page.waitFor(1000);
    const canvas = await page.$('canvas');
    if (canvas) {
      await canvas.screenshot({
        path: p.resolve(path),
      });
    }
    else {
      fs.copyFileSync(p.resolve('public/images/doc.png'), p.resolve(path));
    }
    resolve();
  });
};

async function run() {
  const browser = await puppeteer.launch({ headless: true });
  const [page] = await browser.pages();
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1');

  for (let example of examples.filter(e => !screenshots.includes(e.path))) {
    await saveCanvas(page, example);
  }

  await browser.close();
  server.close();
}

run();
