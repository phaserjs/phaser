
var CONST = require('../const');
var File = require('../File');

var SVGFile = function (key, url, path, xhrSettings)
{
    if (path === undefined) { path = ''; }

    if (!key)
    {
        throw new Error('Error calling \'Loader.svg\' invalid key provided.');
    }

    if (!url)
    {
        url = path + key + '.svg';
    }
    else
    {
        url = path.concat(url);
    }

    File.call(this, 'svg', key, url, 'text', xhrSettings);
};

SVGFile.prototype = Object.create(File.prototype);
SVGFile.prototype.constructor = SVGFile;

SVGFile.prototype.onProcess = function (callback)
{
    this.state = CONST.FILE_PROCESSING;

    var svg = [ this.xhrLoader.responseText ];

    try
    {
        var blob = new window.Blob(svg, { type: 'image/svg+xml;charset=utf-8' });
    }
    catch (e)
    {
        _this.state = CONST.FILE_ERRORED;

        callback(_this);

        return;
    }

    this.data = new Image();

    this.data.crossOrigin = this.crossOrigin;

    var _this = this;
    var retry = false;

    this.data.onload = function ()
    {
        URL.revokeObjectURL(_this.data.src);

        _this.onComplete();

        callback(_this);
    };

    this.data.onerror = function ()
    {
        URL.revokeObjectURL(_this.data.src);

        //  Safari 8 re-try
        if (!retry)
        {
            retry = true;

            var url = 'data:image/svg+xml,' + encodeURIComponent(svg.join(''));

            _this.data.src = URL.createObjectURL(url);
        }
        else
        {
            _this.state = CONST.FILE_ERRORED;

            callback(_this);
        }
    };

    this.data.src = URL.createObjectURL(blob);
};

module.exports = SVGFile;
