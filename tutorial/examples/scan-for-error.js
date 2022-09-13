const puppeteer = require('puppeteer');
const httpServer = require('http-server');
const fs = require('fs-extra');
const p = require('path');


const maxDepth = 25;
var server = httpServer.createServer();
server.listen(8080, 'localhost', () => {});

let examples = [];
const getExamples = (path, depth = 0) => {
  const files = fs.readdirSync(p.resolve(path));
  if (depth > maxDepth || path.includes('archived')) {
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


getExamples('./public/src');
examples = examples
  .filter(e => !e.url.includes('rbush'))
  .filter(e => e.url.match(/[^\.]+$/)[0].slice(0,2) === 'js')
  .map(e => ({ url: e.url = 'http://localhost:8080/' + (e.url.includes('boot.json') ? 'boot.html?src=' : 'view.html?src=') + e.url.slice(9).replace(/\//g, '\\'), path: e.path.toLowerCase() }));


const scanForError = async (page, example) => {
  return new Promise(async (resolve, reject) => {
    const path = example.path;

    const filename = path.match(/[^\/\\]+$/)[0];
    fs.mkdirp(path.slice(0, -(filename.length + 1)));

    const logError = (e) => {
      console.log('- ' + example.url);
      console.log('  .' + example.path.slice(__dirname.length));
      console.log('');
      console.log('  Script', e.toString().split('\n')[0], '\n\n\n');
    };
    page.on('error', logError);
    page.on('pageerror', logError);

    await page.goto(example.url);

    try {
      await page.waitForSelector('canvas', {
        timeout: 3000,
      });
    } catch (e) {
      console.log('- ' + example.url);
      console.log('  .' + example.path.slice(__dirname.length));
      console.log('');
      console.log('  No canvas on load:', e.toString().split('\n')[0],  '\n\n\n');
      page.removeListener('error', logError);
      page.removeListener('pageerror', logError);
      resolve();
      return;
    }
    await page.waitFor(500);
    page.mouse.click(200, 150);
    await page.waitFor(500);
    const canvas = await page.$('canvas');
    if (!canvas) {
      console.log('- ' + example.url);
      console.log('  .' + example.path.slice(__dirname.length));
      console.log('');
      console.log('  No canvas after click\n\n\n');
    }
    page.removeListener('error', logError);
    page.removeListener('pageerror', logError);
    resolve();
  });
};


async function run() {
  const browser = await puppeteer.launch({ headless: true });
  const [page] = await browser.pages();
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1');

  for (let example of examples) {
    await scanForError(page, example);
  }

  await browser.close();
  server.close();
}

run();
