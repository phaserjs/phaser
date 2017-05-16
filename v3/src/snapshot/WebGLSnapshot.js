var WebGLSnapshot = function (canvas) 
{
    var gl = canvas.getContext('experimental-webgl');
    var pixels = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
    gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var imageData;
    canvas.width = gl.drawingBufferWidth;
    canvas.height = gl.drawingBufferHeight;

    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;
    for (var y = 0; y <  canvas.height; y += 1)
    {
        for (var x = 0; x < canvas.width; x += 1)
        {
            var si = ((canvas.height - y) * canvas.width + x) * 4;
            var di = (y * canvas.width + x) * 4;
            data[di + 0] = pixels[si + 0];
            data[di + 1] = pixels[si + 1];
            data[di + 2] = pixels[si + 2];
            data[di + 3] = pixels[si + 3];
        }
    }
    ctx.putImageData(imageData, 0, 0);

    var src = canvas.toDataURL();
    var image =  new Image();
    image.src = src;

    return image;
};

module.exports = WebGLSnapshot;
