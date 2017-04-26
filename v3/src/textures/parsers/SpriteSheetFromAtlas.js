/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

var GetValue = require('../../utils/object/GetValue');

/**
* Parse a Sprite Sheet and extracts the frame data from it.
*
* @class Phaser.TextureParser.SpriteSheet
* @static
* @param {Phaser.Texture} texture - The parent Texture.
* @param {string} key - The key of the Frame within the Texture that the Sprite Sheet is stored in.
* @param {number} frameWidth - The fixed width of each frame.
* @param {number} frameHeight - The fixed height of each frame.
* @param {number} [startFrame=0] - Skip a number of frames. Useful when there are multiple sprite sheets in one Texture.
* @param {number} [endFrame=-1] - The total number of frames to extract from the Sprite Sheet. The default value of -1 means "extract all frames".
* @param {number} [margin=0] - If the frames have been drawn with a margin, specify the amount here.
* @param {number} [spacing=0] - If the frames have been drawn with spacing between them, specify the amount here.
* @return {Phaser.FrameData} A FrameData object containing the parsed frames.
*/
var SpriteSheetFromAtlas = function (texture, frame, config)
{
    var frameWidth = GetValue(config, 'frameWidth', null);
    var frameHeight = GetValue(config, 'frameHeight', frameWidth);

    //  If missing we can't proceed
    if (!frameWidth)
    {
        throw new Error('TextureManager.SpriteSheetFromAtlas: Invalid frameWidth given.');
    }

    //  Add in a __BASE entry (for the entire atlas)
    // var source = texture.source[0];
    // texture.add('__BASE', 0, 0, 0, source.width, source.height);

    var startFrame = GetValue(config, 'startFrame', 0);
    var endFrame = GetValue(config, 'endFrame', -1);
    var margin = GetValue(config, 'margin', 0);
    var spacing = GetValue(config, 'spacing', 0);

    var x = frame.cutX;
    var y = frame.cutY;
    var cutWidth = frame.cutWidth;
    var cutHeight = frame.cutHeight;
    var sheetWidth = frame.realWidth;
    var sheetHeight = frame.realHeight;

    var row = Math.floor((sheetWidth - margin) / (frameWidth + spacing));
    var column = Math.floor((sheetHeight - margin) / (frameHeight + spacing));
    var total = row * column;

    console.log('split sheet into rows/cols:', row, column, 'total frames:', total);

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
    var sheetFrame;

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

        sheetFrame = texture.add(i, sourceIndex, x + fx, y + fy, frameWidth - ax, frameHeight - ay);

        // sheetFrame.setTrim(sheetWidth, sheetHeight, )

        // setTrim: function (actualWidth, actualHeight, destX, destY, destWidth, destHeight)


        fx += frameWidth + spacing;

        if (fx + frameWidth > width)
        {
            fx = margin;
            fy += frameHeight + spacing;
        }
    }

    return texture;
};

module.exports = SpriteSheetFromAtlas;
