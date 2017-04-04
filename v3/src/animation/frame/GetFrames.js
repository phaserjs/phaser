var AnimationFrame = require('../AnimationFrame');
var GetObjectValue = require('../../utils/object/GetObjectValue');

var GetFrames = function (animation, frames, out)
{
    if (out === undefined) { out = []; }

    var textureManager = animation.manager.textureManager;

    //      frames: [
    //          { key: textureKey, frame: textureFrame },
    //          { key: textureKey, frame: textureFrame, duration: float },
    //          { key: textureKey, frame: textureFrame, onUpdate: function }
    //      ],

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

        out.push(new AnimationFrame(textureFrame, duration, onUpdate));
    }

    return out;
};

module.exports = GetFrames;
