var GetValue = require('../../../utils/object/GetValue');
var Pad = require('../../../utils/string/Pad');

/**
 * [description]
 *
 * @method Phaser.Animations.AnimationManager#generateFrameNames
 * @since 3.0.0
 * 
 * @param {string} key - [description]
 * @param {object} config - [description]
 * @param {string} [config.prefix=''] - [description]
 * @param {integer} [config.start=0] - [description]
 * @param {integer} [config.end=0] - [description]
 * @param {string} [config.suffix=''] - [description]
 * @param {integer} [config.zeroPad=0] - [description]
 * @param {array} [config.outputArray=[]] - [description]
 * @param {boolean} [config.frames=false] - [description]
 * 
 * @return {object[]} [description]
 */
var GenerateFrameNames = function (key, config)
{
    var prefix = GetValue(config, 'prefix', '');
    var start = GetValue(config, 'start', 0);
    var end = GetValue(config, 'end', 0);
    var suffix = GetValue(config, 'suffix', '');
    var zeroPad = GetValue(config, 'zeroPad', 0);
    var out = GetValue(config, 'outputArray', []);
    var frames = GetValue(config, 'frames', false);

    var texture = this.textureManager.get(key);

    if (!texture)
    {
        return out;
    }

    var diff = (start < end) ? 1 : -1;

    //  Adjust because we use i !== end in the for loop
    end += diff;

    var i;
    var frame;

    //  Have they provided their own custom frame sequence array?
    if (Array.isArray(frames))
    {
        for (i = 0; i < frames.length; i++)
        {
            frame = prefix + Pad(frames[i], zeroPad, '0', 1) + suffix;

            if (texture.has(frame))
            {
                out.push({ key: key, frame: frame });
            }
        }
    }
    else
    {
        for (i = start; i !== end; i += diff)
        {
            frame = prefix + Pad(i, zeroPad, '0', 1) + suffix;

            if (texture.has(frame))
            {
                out.push({ key: key, frame: frame });
            }
        }
    }

    return out;
};

module.exports = GenerateFrameNames;
