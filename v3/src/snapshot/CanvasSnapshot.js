var CanvasSnapshot = function (canvas) 
{
    var src = canvas.toDataURL();
    var image =  new Image();
    image.src = src;
    return image;
};

module.exports = CanvasSnapshot;
