var Frame = require('./Frame');
var GetValue = require('../../utils/object/GetValue');

var GetFrames = function (textureManager, frames)
{
    //      frames: [
    //          { key: textureKey, frame: textureFrame },
    //          { key: textureKey, frame: textureFrame, duration: float },
    //          { key: textureKey, frame: textureFrame, onUpdate: function }
    //          { key: textureKey, frame: textureFrame, visible: boolean }
    //      ],

    var out = [];
    var prev;
    var animationFrame;
    var index = 1;
    var i;
    var textureKey;

    //  if frames is a string, we'll get all the frames from the texture manager as if it's a sprite sheet
    if (typeof frames === 'string')
    {
        textureKey = frames;

        var texture = textureManager.get(textureKey);
        var frameKeys = texture.getFrameNames();

        frames = [];

        frameKeys.forEach(function (idx, value) {
            frames.push({ key: textureKey, frame: value });
        });
    }

    // console.table(frames);

    if (!Array.isArray(frames) || frames.length === 0)
    {
        return out;
    }

    for (i = 0; i < frames.length; i++)
    {
        var item = frames[i];

        var key = GetValue(item, 'key', null);

        if (!key)
        {
            continue;
        }

        var frame = GetValue(item, 'frame', 0);

        var textureFrame = textureManager.getFrame(key, frame);

        animationFrame = new Frame(key, frame, index, textureFrame);

        animationFrame.duration = GetValue(item, 'duration', 0);
        animationFrame.onUpdate = GetValue(item, 'onUpdate', null);

        var visible = GetValue(item, 'visible', null);

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

    if (out.length > 0)
    {
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
    }

    return out;
};

module.exports = GetFrames;
