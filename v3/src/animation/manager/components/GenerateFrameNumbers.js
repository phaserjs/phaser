var GetValue = require('../../../utils/object/GetValue');

var GenerateFrameNumbers = function (key, config)
{
    var startFrame = GetValue(config, 'start', 0);
    var endFrame = GetValue(config, 'end', -1);
    var firstFrame = GetValue(config, 'first', false);
    var out = GetValue(config, 'framesArray', []);

    var texture = this.textureManager.get(key);

    if (!texture)
    {
        return out;
    }

    //  No endFrame then see if we can get it

    if (endFrame === -1)
    {
        endFrame = texture.frameTotal;
    }

    if (firstFrame && texture.has(firstFrame))
    {
        out.push({ key: key, frame: firstFrame });
    }

    for (var i = startFrame; i <= endFrame; i++)
    {
        if (texture.has(i))
        {
            out.push({ key: key, frame: i });
        }
    }

    return out;
};

module.exports = GenerateFrameNumbers;
