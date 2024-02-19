/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetFastValue = require('../../utils/object/GetFastValue');

/**
 * Parses a Sprite Sheet and adds the Frames to the Texture.
 *
 * In Phaser terminology a Sprite Sheet is a texture containing different frames, but each frame is the exact
 * same size and cannot be trimmed or rotated.
 *
 * @function Phaser.Textures.Parsers.SpriteSheet
 * @memberof Phaser.Textures.Parsers
 * @private
 * @since 3.0.0
 *
 * @param {Phaser.Textures.Texture} texture - The Texture to add the Frames to.
 * @param {number} sourceIndex - The index of the TextureSource.
 * @param {number} x - The top-left coordinate of the Sprite Sheet. Defaults to zero. Used when extracting sheets from atlases.
 * @param {number} y - The top-left coordinate of the Sprite Sheet. Defaults to zero. Used when extracting sheets from atlases.
 * @param {number} width - The width of the source image.
 * @param {number} height - The height of the source image.
 * @param {object} config - An object describing how to parse the Sprite Sheet.
 * @param {number} config.frameWidth - Width in pixels of a single frame in the sprite sheet.
 * @param {number} [config.frameHeight] - Height in pixels of a single frame in the sprite sheet. Defaults to frameWidth if not provided.
 * @param {number} [config.startFrame=0] - The frame to start extracting from. Defaults to zero.
 * @param {number} [config.endFrame=-1] - The frame to finish extracting at. Defaults to -1, which means 'all frames'.
 * @param {number} [config.margin=0] - If the frames have been drawn with a margin, specify the amount here.
 * @param {number} [config.spacing=0] - If the frames have been drawn with spacing between them, specify the amount here.
 *
 * @return {Phaser.Textures.Texture} The Texture modified by this parser.
 */
var SpriteSheet = function (texture, sourceIndex, x, y, width, height, config)
{
    var frameWidth = GetFastValue(config, 'frameWidth', null);
    var frameHeight = GetFastValue(config, 'frameHeight', frameWidth);

    //  If missing we can't proceed
    if (frameWidth === null)
    {
        throw new Error('TextureManager.SpriteSheet: Invalid frameWidth given.');
    }

    //  Add in a __BASE entry (for the entire atlas)
    var source = texture.source[sourceIndex];

    texture.add('__BASE', sourceIndex, 0, 0, source.width, source.height);

    var startFrame = GetFastValue(config, 'startFrame', 0);
    var endFrame = GetFastValue(config, 'endFrame', -1);
    var margin = GetFastValue(config, 'margin', 0);
    var spacing = GetFastValue(config, 'spacing', 0);

    var row = Math.floor((width - margin + spacing) / (frameWidth + spacing));
    var column = Math.floor((height - margin + spacing) / (frameHeight + spacing));
    var total = row * column;

    if (total === 0)
    {
        console.warn('SpriteSheet frame dimensions will result in zero frames for texture:', texture.key);
    }

    if (startFrame > total || startFrame < -total)
    {
        startFrame = 0;
    }

    if (startFrame < 0)
    {
        //  Allow negative skipframes.
        startFrame = total + startFrame;
    }

    if (endFrame === -1 || endFrame > total || endFrame < startFrame)
    {
        endFrame = total;
    }

    var fx = margin;
    var fy = margin;
    var ax = 0;
    var ay = 0;
    var c = 0;

    for (var i = 0; i < total; i++)
    {
        ax = 0;
        ay = 0;

        var w = fx + frameWidth;
        var h = fy + frameHeight;

        if (w > width)
        {
            ax = w - width;
        }

        if (h > height)
        {
            ay = h - height;
        }

        if (i >= startFrame && i <= endFrame)
        {
            texture.add(c, sourceIndex, x + fx, y + fy, frameWidth - ax, frameHeight - ay);

            c++;
        }

        fx += frameWidth + spacing;

        if (fx + frameWidth > width)
        {
            fx = margin;
            fy += frameHeight + spacing;
        }
    }

    return texture;
};

module.exports = SpriteSheet;
