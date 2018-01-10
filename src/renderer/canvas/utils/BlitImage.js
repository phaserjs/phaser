
//  No scaling, anchor, rotation or effects, literally draws the frame directly to the canvas
var BlitImage = function (dx, dy, frame, camera)
{
    var ctx = this.currentContext;
    var cd = frame.canvasData;

    ctx.drawImage(
        frame.source.image,
        cd.sx,
        cd.sy,
        cd.sWidth,
        cd.sHeight,
        dx - camera.scrollX,
        dy - camera.scrollY,
        cd.dWidth,
        cd.dHeight
    );
};

module.exports = BlitImage;
