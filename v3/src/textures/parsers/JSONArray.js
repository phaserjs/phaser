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
* @param {object} json - The JSON data from the Texture Atlas. Must be in Array format.
* @return {Phaser.FrameData} A FrameData object containing the parsed frames.
*/
var JSONArray = function (texture, sourceIndex, json)
{
    //  Malformed?
    if (!json['frames'])
    {
        console.warn('Invalid Texture Atlas JSON Array given, missing \'frames\' array');
        return;
    }

    //  Add in a __BASE entry (for the entire atlas)
    var source = texture.source[sourceIndex];
    texture.add('__BASE', sourceIndex, 0, 0, source.width, source.height);

    //  By this stage frames is a fully parsed array
    var frames = json['frames'];
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
    }

    return texture;
};

module.exports = JSONArray;
