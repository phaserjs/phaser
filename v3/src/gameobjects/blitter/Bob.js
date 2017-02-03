var Bob = function (blitter, x, y, frame, visible)
{
    this.parent = blitter;

    this.x = x;
    this.y = y;
    this.frame = frame;
    this.visible = visible;
    this.data = {};
};

Bob.prototype = {
    reset: function (x, y, frame)
    {
        this.x = x;
        this.y = y;
        this.frame = frame;
    }
};

module.exports = Bob;
