var CanvasSnapshot = function (canvas, type, encoderOptions)
{
    if (type === undefined) { type = 'image/png'; }
    if (encoderOptions === undefined) { encoderOptions = 0.92; }

    var src = canvas.toDataURL(type, encoderOptions);

    var image = new Image();

    image.src = src;

    return image;
};

module.exports = CanvasSnapshot;
