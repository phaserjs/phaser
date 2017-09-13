var UpdateFrameSequence = function ()
{
    var len = this.frames.length;
    var slice = 1 / (len - 1);

    for (var i = 0; i < len; i++)
    {
        var frame = this.frames[i];

        frame.index = i + 1;
        frame.isFirst = false;
        frame.isLast = false;
        frame.progress = i * slice;

        if (i === 0)
        {
            frame.isFirst = true;
            frame.isLast = (len === 1);
            frame.prevFrame = this.frames[len - 1];
            frame.nextFrame = this.frames[i + 1];
        }
        else if (i === len - 1)
        {
            frame.isLast = true;
            frame.prevFrame = this.frames[len - 2];
            frame.nextFrame = this.frames[0];
        }
        else if (len > 1)
        {
            frame.prevFrame = this.frames[i - 1];
            frame.nextFrame = this.frames[i + 1];
        }
    }

    return this;
};

module.exports = UpdateFrameSequence;
