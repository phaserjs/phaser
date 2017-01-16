var CreateTexture2DImage = function (gl, pixels, filter, mipLevels)
{
    var texture = gl.createTexture();
    mipLevels = mipLevels || 0;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texImage2D(
        gl.TEXTURE_2D,
        mipLevels,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        pixels
    );
    return texture;
};

module.exports = CreateTexture2DImage;
