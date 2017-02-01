var Bob = function (blitter, x, y, frame, visible)
{
    this.parent = blitter;

    this.x = x;
    this.y = y;
    this.frame = frame;
    this.visible = visible;
    this.data = {};
};

module.exports = Bob;
