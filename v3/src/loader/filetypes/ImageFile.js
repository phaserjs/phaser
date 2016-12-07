
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

ImageFile.prototype.process = function ()
{
    this.state = CONST.FILE_PROCESSING;

    this.data = new Image();

    this.data.onload = function ()
    {
        window.URL.revokeObjectURL(this.src);

        this.onComplete();
    };

    this.data.src = window.URL.createObjectURL(this.xhrLoader.response);
};

module.exports = ImageFile;
