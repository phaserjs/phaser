
var CONST = require('../const');
var File = require('../File');

var TextFile = function (key, url, path, xhrSettings)
{
    if (path === undefined) { path = ''; }

    if (!key)
    {
        throw new Error('Error calling \'Loader.text\' invalid key provided.');
    }

    if (!url)
    {
        url = path + key + '.text';
    }
    else
    {
        url = path.concat(url);
    }

    File.call(this, 'text', key, url, 'text', xhrSettings);
};

TextFile.prototype = Object.create(File.prototype);
TextFile.prototype.constructor = TextFile;

TextFile.prototype.onProcess = function (callback)
{
    this.state = CONST.FILE_PROCESSING;

    this.data = this.xhrLoader.responseText;

    this.onComplete();

    callback(this);
};

module.exports = TextFile;
