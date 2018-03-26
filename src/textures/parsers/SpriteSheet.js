/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GetFastValue = require('../../utils/object/GetFastValue');

/**
 * Parses a Sprite Sheet and adds the Frames to the Texture.
 * 
 * In Phaser terminology a Sprite Sheet is a texture containing different frames, but each frame is the exact
 * same size and cannot be trimmed or rotated.
 *
 * @function Phaser.Textures.Parsers.SpriteSheet
 * @memberOf Phaser.Textures.Parsers
 * @since 3.0.0
 *
 * @param {Phaser.Textures.Texture} texture - The Texture to add the Frames to.
 * @param {integer} sourceIndex - The index of the TextureSource.
 * @param {integer} x - [description]
 * @param {integer} y - [description]
 * @param {integer} width - [description]
 * @param {integer} height - [description]
 * @param {object} config - [description]
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

    if (startFrame > total || startFrame < -total)
    {
        startFrame = 0;
    }

    if (startFrame < 0)
    {
        //  Allow negative skipframes.
        startFrame = total + startFrame;
    }

    if (endFrame !== -1)
    {
        total = startFrame + (endFrame + 1);
    }

    var fx = margin;
    var fy = margin;
    var ax = 0;
    var ay = 0;

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

        texture.add(i, sourceIndex, x + fx, y + fy, frameWidth - ax, frameHeight - ay);

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
