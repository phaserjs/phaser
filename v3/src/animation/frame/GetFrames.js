var AnimationFrame = require('../AnimationFrame');
var GetObjectValue = require('../../utils/object/GetObjectValue');

var GetFrames = function (textureManager, frames)
{
    //      frames: [
    //          { key: textureKey, frame: textureFrame },
    //          { key: textureKey, frame: textureFrame, duration: float },
    //          { key: textureKey, frame: textureFrame, onUpdate: function }
    //          { key: textureKey, frame: textureFrame, visible: boolean }
    //      ],

    // console.table(frames);

    var out = [];
    var prev;
    var animationFrame;
    var index = 1;
    var i;

    for (i = 0; i < frames.length; i++)
    {
        var item = frames[i];

        var key = GetObjectValue(item, 'key', null);

        if (!key)
        {
            continue;
        }

        var frame = GetObjectValue(item, 'frame', 0);

        var textureFrame = textureManager.getFrame(key, frame);

        animationFrame = new AnimationFrame(key, frame, index, textureFrame);

        animationFrame.duration = GetObjectValue(item, 'duration', 0);
        animationFrame.onUpdate = GetObjectValue(item, 'onUpdate', null);

        var visible = GetObjectValue(item, 'visible', null);

        if (visible !== null)
        {
            animationFrame.setVisible = true;
            animationFrame.visible = visible;
        }

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

    //  Generate the progress data

    var slice = 1 / (out.length - 1);

    for (i = 0; i < out.length; i++)
    {
        out[i].progress = i * slice;
    }

    return out;
};

module.exports = GetFrames;
