
var CONST = require('../const');
var File = require('../File');

var ImageFile = function (key, url, path)
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

    File.call(this, 'image', key, url, 'blob');
};

ImageFile.prototype = Object.create(File.prototype);
ImageFile.prototype.constructor = ImageFile;

ImageFile.prototype.onProcess = function (callback)
{
    console.log('ImageFile.onProcess');

    this.state = CONST.FILE_PROCESSING;

    this.data = new Image();

    var _this = this;

    this.data.onload = function ()
    {
        window.URL.revokeObjectURL(_this.src);

        callback(_this);

        _this.onComplete();
    };

    this.data.src = window.URL.createObjectURL(this.xhrLoader.response);
};

module.exports = ImageFile;
