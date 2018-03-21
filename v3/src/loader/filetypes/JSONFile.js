
var CONST = require('../const');
var File = require('../File');

var JSONFile = function (key, url, path, xhrSettings)
{
    if (path === undefined) { path = ''; }

    if (!key)
    {
        throw new Error('Error calling \'Loader.json\' invalid key provided.');
    }

    if (!url)
    {
        url = path + key + '.json';
    }
    else
    {
        url = path.concat(url);
    }

    File.call(this, 'json', key, url, 'text', xhrSettings);
};

JSONFile.prototype = Object.create(File.prototype);
JSONFile.prototype.constructor = JSONFile;

JSONFile.prototype.onProcess = function (callback)
{
    this.state = CONST.FILE_PROCESSING;

    this.data = JSON.parse(this.xhrLoader.responseText);

    this.onComplete();

    callback(this);
};

module.exports = JSONFile;
