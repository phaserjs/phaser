var CONST = require('../../../const');

var CreateEmptyTexture = function (gl, width, height, scaleMode, textureIndex)
{
    var texture = gl.createTexture();
    var glScaleMode = (scaleMode === CONST.scaleModes.LINEAR) ? gl.LINEAR : gl.NEAREST;

    gl.activeTexture(gl.TEXTURE0 + textureIndex);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    //  We'll read from this texture, but it won't have mipmaps, so turn them off:
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, glScaleMode);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, glScaleMode);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    return texture;
};

module.exports = CreateEmptyTexture;
