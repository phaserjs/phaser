var AnimationFrame = require('../AnimationFrame');
var GetObjectValue = require('../../utils/object/GetObjectValue');

var GetFrames = function (textureManager, frames)
{
    //      frames: [
    //          { key: textureKey, frame: textureFrame },
    //          { key: textureKey, frame: textureFrame, duration: float },
    //          { key: textureKey, frame: textureFrame, onUpdate: function }
    //      ],

    // console.table(frames);

    var out = [];
    var prev;
    var animationFrame;
    var index = 1;

    for (var i = 0; i < frames.length; i++)
    {
        var item = frames[i];

        var key = GetObjectValue(item, 'key', null);

        if (!key)
        {
            continue;
        }

        var frame = GetObjectValue(item, 'frame', 0);
        var duration = GetObjectValue(item, 'duration', 0);
        var onUpdate = GetObjectValue(item, 'onUpdate', null);

        var textureFrame = textureManager.getFrame(key, frame);

        animationFrame = new AnimationFrame(index, textureFrame, duration, onUpdate);

        animationFrame.isFirst = (!prev);

        //  The previously created animationFrame
        if (prev)
        {
            prev.nextFrame = animationFrame;

            animationFrame.prevFrame = prev;
        }

        out.push(animationFrame);

        prev = animationFrame;

        index++;
    }

    animationFrame.isLast = true;

    //  Link them end-to-end, so they loop
    animationFrame.nextFrame = out[0];

    out[0].prevFrame = animationFrame;

    return out;
};

module.exports = GetFrames;
