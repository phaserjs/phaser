var ScaleModes = require('../../../ScaleModes');
var CreateTexture2DImage = require('./CreateTexture2DImage');

var CreateTexture2DFromSource = function (gl, source)
{
    var filter;

    if (source.scaleMode === ScaleModes.LINEAR)
    {
        filter = gl.LINEAR;
    }
    else if (source.scaleMode === ScaleModes.NEAREST)
    {
        filter = gl.NEAREST;
    }

    source.glTexture = CreateTexture2DImage(gl, source.image, filter, source.mipmapLevel)
};

module.exports = CreateTexture2DFromSource;
