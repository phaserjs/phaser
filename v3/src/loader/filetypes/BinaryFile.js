
var CONST = require('../const');
var File = require('../File');

var BinaryFile = function (key, url, path, xhrSettings)
{
    if (path === undefined) { path = ''; }

    if (!key)
    {
        throw new Error('Error calling \'Loader.binary\' invalid key provided.');
    }

    if (!url)
    {
        url = path + key + '.bin';
    }
    else
    {
        url = path.concat(url);
    }

    File.call(this, 'binary', key, url, 'arraybuffer', xhrSettings);
};

BinaryFile.prototype = Object.create(File.prototype);
BinaryFile.prototype.constructor = BinaryFile;

BinaryFile.prototype.onProcess = function (callback)
{
    this.state = CONST.FILE_PROCESSING;

    this.data = this.xhrLoader.response;

    this.onComplete();

    callback(this);
};

module.exports = BinaryFile;
