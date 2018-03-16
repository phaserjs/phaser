/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Clone = require('../../utils/object/Clone');

/**
 * Parses a Texture Atlas JSON Array and adds the Frames to the Texture.
 * JSON format expected to match that defined by Texture Packer, with the frames property containing an array of Frames.
 *
 * @function Phaser.Textures.Parsers.JSONArray
 * @memberOf Phaser.Textures.Parsers
 * @since 3.0.0
 *
 * @param {Phaser.Textures.Texture} texture - The Texture to add the Frames to.
 * @param {integer} sourceIndex - The index of the TextureSource.
 * @param {object} json - The JSON data.
 *
 * @return {Phaser.Textures.Texture} The Texture modified by this parser.
 */
var JSONArray = function (texture, sourceIndex, json)
{
    //  Malformed?
    if (!json['frames'] && !json['textures'])
    {
        console.warn('Invalid Texture Atlas JSON Array given, missing \'frames\' and \'textures\' array');
        return;
    }

    //  Add in a __BASE entry (for the entire atlas)
    var source = texture.source[sourceIndex];

    texture.add('__BASE', sourceIndex, 0, 0, source.width, source.height);

    //  By this stage frames is a fully parsed array
    var frames = (Array.isArray(json.textures)) ? json.textures[sourceIndex].frames : json.frames;

    var newFrame;

    for (var i = 0; i < frames.length; i++)
    {
        var src = frames[i];

        //  The frame values are the exact coordinates to cut the frame out of the atlas from
        newFrame = texture.add(src.filename, sourceIndex, src.frame.x, src.frame.y, src.frame.w, src.frame.h);

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

        if (src.anchor)
        {
            newFrame.customPivot = true;
            newFrame.pivotX = src.anchor.x;
            newFrame.pivotY = src.anchor.y;
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

module.exports = JSONArray;
