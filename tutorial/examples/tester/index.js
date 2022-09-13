var fs = require('fs');
var dirTree = require('directory-tree');
var puppeteer = require('puppeteer');
var os = require('os');
var readline = require('readline');

var rootDir = '../public/src/';
var examplesTestFolder = './';
var examplesScreensFolder = examplesTestFolder + 'screens/';
var examplesTestJson = examplesTestFolder + 'results.json';
var testServer = 'http://localhost:8080/';
var instanceCount = Number.parseInt(process.argv[2]) || os.cpus().length;

var filteredTree = dirTree(rootDir, ['.js', '.json']);
var examples = getExamples(filteredTree.children);
var done = 0;
var index = 0;
var browsers = [];

process.setMaxListeners(instanceCount + 1);// prevent warnings

process.on('SIGINT', function() {
	// shutdown takes some time, inform user
	console.log( "\nShutting down, please wait.");
	process.exit(1);
});

if (!fs.existsSync(examplesTestFolder)) {
	fs.mkdirSync(examplesTestFolder);
}
if (!fs.existsSync(examplesScreensFolder)) {
	fs.mkdirSync(examplesScreensFolder);
}

var startTime = Date.now();

console.log('Launching '+instanceCount+ ' browsers.');
for(var i = 0; i < instanceCount; i++) {
	runTests();
}

function runnerFinished() {
	if(browsers.length == 0) {
		var json = JSON.stringify(examples);
		fs.writeFile(examplesTestJson, json, function (error) {
			if (error) throw error;
			console.log(examplesTestJson+' saved.');
			process.exit();
		});
		console.log('\nFinished ' + examples.length + ' in '+getMMSS(Date.now() - startTime));
	}
}

function updateStatus() {
	readline.clearLine(process.stdout);
	readline.cursorTo(process.stdout, 0);
	var speed = (Date.now() - startTime) / done;
	var estimatedTime = (examples.length - done) * speed;
	process.stdout.write(browsers.length + ' browsers – ' + done + '/' + examples.length + ' tests done – ' + (speed / 1000).toFixed(1) +'s per example – estimated time remaining: '+getMMSS(estimatedTime));
}

function getMMSS(time) {
	time /= 1000;
	var minutes = Math.floor(time / 60);
	var seconds = Math.floor(time % 60);
	return minutes+'\''+seconds+'"';
}

function runTests() {
	puppeteer.launch().then((browser) => {
		browsers.push(browser);
		function processNext() {
			if(index < examples.length) {
				var example = examples[index++];

				example.logs = [];
				example.errors = [];
				browser.newPage().then((page) => {
					page.on('console', msg => {
						example.logs.push(msg.text());
					});
					page.on('pageerror', error => {
						//console.log(error);
						example.errors.push(String(error));
					});
					page.on('response', response => {
						//console.log(response.status() + ': '+response.url());
						if(response.status() == 404) {
							example.errors.push(response.status() + ': '+response.url());
						}
					});
					page.on('requestfailed', request => {
						//console.log(request.failure().errorText, request.url());
						if(request.failure().errorText != "net::ERR_ABORTED") {
							example.errors.push(request.failure().errorText + ': ' + request.url());
						}
					});
					page.goto(example.uri, {timeout:5000})
					.then(() => { return page.waitFor('canvas', {timeout:5000}); })
					.then(() => { return page.waitFor(3500) })
					.then(() => { return page.screenshot({path: examplesScreensFolder+example.screenName})})
					.then(() => { onDone(); })
					.catch((e) => {
						example.errors.push(String(e));
						onDone();
					});
					function onDone() {
						done++;
						updateStatus();
						page.close().then(processNext).catch(function(e) {
							console.log('page close error: ');
							console.log(e);
						});
					}
				}).catch(() => { });
			} else {
				function closed() {
					browsers.splice(browsers.indexOf(browser), 1);
					runnerFinished();
				}
				closed();
				// for some reason closing the browser sometimes caused it to close twice (and error), it gets closed anyway...
				//browser.close().then(() => { closed() }).catch(() => closed());
			}
		}
		processNext();
	});
}

function getExamples(children, examples) {
	if(examples === undefined) examples = [];

	for(var i = 0; i < children.length; i++) {
		if(children[i].extension == ".json") {
			var relativePath = children[i].path.replace('public\\', '');
			examples.push({
				uri: testServer + 'boot.html?src=' + relativePath,
				screenName: relativePath.split('\\').join('_') + '.png',
				name: children[i].name
			});
			return examples;
		}
	}

	for(var i = 0; i < children.length; i++) {
		if(children[i].children) {
			// skip archived and bugs examples
			if(children[i].path.indexOf('archived\\') == -1
				&& children[i].path.indexOf('bugs\\') == -1) {
					getExamples(children[i].children, examples);
				}
		} else {
			// skip archived and bugs examples
			if(children[i].path.indexOf('archived\\') != -1
				|| children[i].path.indexOf('bugs\\') != -1) continue;

			var relativePath = children[i].path.replace('public\\', '');
			examples.push({
				uri: testServer + 'view.html?src=' + relativePath,
				screenName: relativePath.split('\\').join('_') + '.png',
				name: children[i].name
			});
		}
	}


	return examples;
}
