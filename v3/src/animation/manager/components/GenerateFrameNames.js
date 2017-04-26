var GetValue = require('../../../utils/object/GetValue');
var Pad = require('../../../utils/string/Pad');

var GenerateFrameNames = function (key, config)
{
    var prefix = GetValue(config, 'prefix', '');
    var start = GetValue(config, 'start', 0);
    var end = GetValue(config, 'end', 0);
    var suffix = GetValue(config, 'suffix', '');
    var zeroPad = GetValue(config, 'zeroPad', 0);
    var out = GetValue(config, 'framesArray', []);

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
