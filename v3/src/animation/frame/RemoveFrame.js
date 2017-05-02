//  Remove frame if it matches the given frame
var RemoveFrame = function (frame)
{
    var index = this.frames.indexOf(frame);

    if (index !== -1)
    {
        this.removeFrameAt(index);
    }

    return this;
};

module.exports = RemoveFrame;
