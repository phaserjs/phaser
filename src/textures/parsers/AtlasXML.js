/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Parses an XML Texture Atlas object and adds all the Frames into a Texture.
 *
 * @function Phaser.Textures.Parsers.AtlasXML
 * @memberof Phaser.Textures.Parsers
 * @private
 * @since 3.7.0
 *
 * @param {Phaser.Textures.Texture} texture - The Texture to add the Frames to.
 * @param {integer} sourceIndex - The index of the TextureSource.
 * @param {*} xml - The XML data.
 *
 * @return {Phaser.Textures.Texture} The Texture modified by this parser.
 */
var AtlasXML = function (texture, sourceIndex, xml)
{
    //  Malformed?
    if (!xml.getElementsByTagName('TextureAtlas'))
    {
        console.warn('Invalid Texture Atlas XML given');
        return;
    }

    //  Add in a __BASE entry (for the entire atlas)
    var source = texture.source[sourceIndex];

    texture.add('__BASE', sourceIndex, 0, 0, source.width, source.height);

    //  By this stage frames is a fully parsed array
    var frames = xml.getElementsByTagName('SubTexture');

    var newFrame;

    for (var i = 0; i < frames.length; i++)
    {
        var frame = frames[i].attributes;

        var name = frame.name.value;
        var x = parseInt(frame.x.value, 10);
        var y = parseInt(frame.y.value, 10);
        var width = parseInt(frame.width.value, 10);
        var height = parseInt(frame.height.value, 10);

        //  The frame values are the exact coordinates to cut the frame out of the atlas from
        newFrame = texture.add(name, sourceIndex, x, y, width, height);

        //  These are the original (non-trimmed) sprite values
        if (frame.frameX)
        {
            var frameX = Math.abs(parseInt(frame.frameX.value, 10));
            var frameY = Math.abs(parseInt(frame.frameY.value, 10));
            var frameWidth = parseInt(frame.frameWidth.value, 10);
            var frameHeight = parseInt(frame.frameHeight.value, 10);

            newFrame.setTrim(
                width,
                height,
                frameX,
                frameY,
                frameWidth,
                frameHeight
            );
        }
    }

    return texture;
};

module.exports = AtlasXML;
