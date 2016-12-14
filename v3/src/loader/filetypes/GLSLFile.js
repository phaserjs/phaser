
var CONST = require('../const');
var File = require('../File');

var GLSLFile = function (key, url, path, xhrSettings)
{
    if (path === undefined) { path = ''; }

    if (!key)
    {
        throw new Error('Error calling \'Loader.text\' invalid key provided.');
    }

    if (!url)
    {
        url = path + key + '.glsl';
    }
    else
    {
        url = path.concat(url);
    }

    File.call(this, 'glsl', key, url, 'text', xhrSettings);
};

GLSLFile.prototype = Object.create(File.prototype);
GLSLFile.prototype.constructor = GLSLFile;

GLSLFile.prototype.onProcess = function (callback)
{
    this.state = CONST.FILE_PROCESSING;

    this.data = this.xhrLoader.responseText;

    this.onComplete();

    callback(this);
};

module.exports = GLSLFile;
