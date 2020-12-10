/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Clone = require('../../utils/object/Clone');

/**
 * Parses a Texture Atlas JSON Hash and adds the Frames to the Texture.
 * JSON format expected to match that defined by Texture Packer, with the frames property containing an object of Frames.
 *
 * @function Phaser.Textures.Parsers.JSONHash
 * @memberof Phaser.Textures.Parsers
 * @private
 * @since 3.0.0
 *
 * @param {Phaser.Textures.Texture} texture - The Texture to add the Frames to.
 * @param {number} sourceIndex - The index of the TextureSource.
 * @param {object} json - The JSON data.
 *
 * @return {Phaser.Textures.Texture} The Texture modified by this parser.
 */
var JSONHash = function (texture, sourceIndex, json)
{
    //  Malformed?
    if (!json['frames'])
    {
        console.warn('Invalid Texture Atlas JSON Hash given, missing \'frames\' Object');
        return;
    }

    //  Add in a __BASE entry (for the entire atlas)
    var source = texture.source[sourceIndex];

    texture.add('__BASE', sourceIndex, 0, 0, source.width, source.height);

    //  By this stage frames is a fully parsed Object
    var frames = json.frames;
    var newFrame;

    for (var key in frames)
    {
        if (!frames.hasOwnProperty(key))
        {
            continue;
        }

        var src = frames[key];

        //  The frame values are the exact coordinates to cut the frame out of the atlas from
        newFrame = texture.add(key, sourceIndex, src.frame.x, src.frame.y, src.frame.w, src.frame.h);

        //  These are the original (non-trimmed) sprite values
        if (src.trimmed)
        {
            newFrame.setTrim(
                src.sourceSize.w,
                src.sourceSize.h,
                src.spriteSourceSize.x,
                src.spriteSourceSize.y,
                src.spriteSourceSize.w,
                src.spriteSourceSize.h
            );
        }

        if (src.rotated)
        {
            newFrame.rotated = true;
            newFrame.updateUVsInverted();
        }

        var pivot = src.anchor || src.pivot;

        if (pivot)
        {
            newFrame.customPivot = true;
            newFrame.pivotX = pivot.x;
            newFrame.pivotY = pivot.y;
        }

        //  Copy over any extra data
        newFrame.customData = Clone(src);
    }

    //  Copy over any additional data that was in the JSON to Texture.customData
    for (var dataKey in json)
    {
        if (dataKey === 'frames')
        {
            continue;
        }

        if (Array.isArray(json[dataKey]))
        {
            texture.customData[dataKey] = json[dataKey].slice(0);
        }
        else
        {
            texture.customData[dataKey] = json[dataKey];
        }
    }

    return texture;
};

module.exports = JSONHash;
