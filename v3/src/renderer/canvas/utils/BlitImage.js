
//  No scaling, anchor, rotation or effects, literally draws the frame directly to the canvas
var BlitImage = function (dx, dy, frame)
{
    var ctx = this.context;
    var cd = frame.canvasData;

    ctx.drawImage(frame.source.image, cd.sx, cd.sy, cd.sWidth, cd.sHeight, dx, dy, cd.dWidth, cd.dHeight);
};

module.exports = BlitImage;
