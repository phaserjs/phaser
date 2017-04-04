
var CONST = require('../const');
var File = require('../File');

var ImageFile = function (key, url, path, xhrSettings, config)
{
    if (path === undefined) { path = ''; }

    if (!key)
    {
        throw new Error('Error calling \'Loader.image\' invalid key provided.');
    }

    if (!url)
    {
        url = path + key + '.png';
    }
    else
    {
        url = path.concat(url);
    }

    File.call(this, 'image', key, url, 'blob', xhrSettings, config);
};

ImageFile.prototype = Object.create(File.prototype);
ImageFile.prototype.constructor = ImageFile;

ImageFile.prototype.onProcess = function (callback)
{
    this.state = CONST.FILE_PROCESSING;

    this.data = new Image();

    this.data.crossOrigin = this.crossOrigin;

    var _this = this;

    this.data.onload = function ()
    {
        URL.revokeObjectURL(_this.data.src);

        _this.onComplete();

        callback(_this);
    };

    this.data.onerror = function ()
    {
        URL.revokeObjectURL(_this.data.src);

        _this.state = CONST.FILE_ERRORED;

        callback(_this);
    };

    this.data.src = URL.createObjectURL(this.xhrLoader.response);
};

module.exports = ImageFile;
