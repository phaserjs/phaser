var GetObjectValue = require('../../utils/object/GetObjectValue');
var Pad = require('../../utils/string/Pad');

var GenerateFrameNames = function (key, config)
{
    var prefix = GetObjectValue(config, 'prefix', '');
    var start = GetObjectValue(config, 'start', 0);
    var end = GetObjectValue(config, 'end', 0);
    var suffix = GetObjectValue(config, 'suffix', '');
    var zeroPad = GetObjectValue(config, 'zeroPad', 0);
    var out = GetObjectValue(config, 'framesArray', []);

    var diff = (start < end) ? 1 : -1;

    //  Adjust because we use i !== end in the for loop
    end += diff;

    var texture = this.textureManager.get(key);

    if (!texture)
    {
        return out;
    }

    for (var i = start; i !== end; i += diff)
    {
        var frame = prefix + Pad(i, zeroPad, '0', 1) + suffix;

        if (texture.has(frame))
        {
            out.push({ key: key, frame: frame });
        }
    }

    return out;
};

module.exports = GenerateFrameNames;
