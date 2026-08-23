var http = require('http');
var fs = require('fs');
var path = require('path');

var ROOT = path.resolve(__dirname, '..');
var PORT = 8080;
var SEP = path.sep;

var TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.xml': 'text/xml; charset=utf-8',
    '.png': 'image/png',
    '.json': 'application/json; charset=utf-8'
};

function serve (req, res)
{
    var urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    var filePath = path.resolve(ROOT, '.' + urlPath);

    // Keep served files inside the repo root.
    if (filePath !== ROOT && filePath.indexOf(ROOT + SEP) !== 0)
    {
        res.statusCode = 403;
        res.end('forbidden');
        return;
    }

    fs.readFile(filePath, function (err, data)
    {
        if (err)
        {
            res.statusCode = 404;
            res.end('not found: ' + urlPath);
            return;
        }

        res.setHeader('Content-Type', TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream');
        res.end(data);
    });
}

http.createServer(serve).listen(PORT, function ()
{
    console.log('visual-tests server on http://localhost:' + PORT + ' (root: ' + ROOT + ')');
});
