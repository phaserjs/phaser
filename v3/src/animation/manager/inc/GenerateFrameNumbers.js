var GetValue = require('../../../utils/object/GetValue');

var GenerateFrameNumbers = function (key, config)
{
    var startFrame = GetValue(config, 'start', 0);
    var endFrame = GetValue(config, 'end', -1);
    var firstFrame = GetValue(config, 'first', false);
    var out = GetValue(config, 'outputArray', []);
    var frames = GetValue(config, 'frames', false);

    var texture = this.textureManager.get(key);

    if (!texture)
    {
        return out;
    }

    if (firstFrame && texture.has(firstFrame))
    {
        out.push({ key: key, frame: firstFrame });
    }

    var i;

    //  Have they provided their own custom frame sequence array?
    if (Array.isArray(frames))
    {
        for (i = 0; i < frames.length; i++)
        {
            if (texture.has(frames[i]))
            {
                out.push({ key: key, frame: frames[i] });
            }
        }
    }
    else
    {
        //  No endFrame then see if we can get it

        if (endFrame === -1)
        {
            endFrame = texture.frameTotal;
        }

        for (i = startFrame; i <= endFrame; i++)
        {
            if (texture.has(i))
            {
                out.push({ key: key, frame: i });
            }
        }
    }

    return out;
};

module.exports = GenerateFrameNumbers;
