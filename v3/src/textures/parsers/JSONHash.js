/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Parses a JSON Array and extracts the frame data from it.
*
* @class Phaser.TextureParser.JSONArray
* @static
* @param {Phaser.Texture} texture - The parent Texture.
* @param {object} json - The JSON data from the Texture Atlas. Must be in JSON Hash format.
* @return {Phaser.FrameData} A FrameData object containing the parsed frames.
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
    var frames = json['frames'];
    var newFrame;

    for (var key in frames)
    {
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
    }

    return texture;
};

module.exports = JSONHash;
