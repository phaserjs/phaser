/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Parse a Sprite Sheet and extracts the frame data from it.
*
* @class Phaser.TextureParser.SpriteSheet
* @static
* @param {Phaser.Texture} texture - The parent Texture.
* @param {string} key - The key of the Frame within the Texture that the Sprite Sheet is stored in.
* @param {number} frameWidth - The fixed width of each frame.
* @param {number} frameHeight - The fixed height of each frame.
* @param {number} [frameMax=-1] - The total number of frames to extract from the Sprite Sheet. The default value of -1 means "extract all frames".
* @param {number} [margin=0] - If the frames have been drawn with a margin, specify the amount here.
* @param {number} [spacing=0] - If the frames have been drawn with spacing between them, specify the amount here.
* @param {number} [skipFrames=0] - Skip a number of frames. Useful when there are multiple sprite sheets in one Texture.
* @return {Phaser.FrameData} A FrameData object containing the parsed frames.
*/
Phaser.TextureParser.SpriteSheet = function (texture, frameWidth, frameHeight, frameMax, margin, spacing, skipFrames)
{
    var width = texture.width;
    var height = texture.height;

    if (frameWidth <= 0)
    {
        frameWidth = Math.floor(-width / Math.min(-1, frameWidth));
    }

    if (frameHeight <= 0)
    {
        frameHeight = Math.floor(-height / Math.min(-1, frameHeight));
    }

    var row = Math.floor((width - margin) / (frameWidth + spacing));
    var column = Math.floor((height - margin) / (frameHeight + spacing));
    var total = row * column;

    if (skipFrames > total || skipFrames < -total)
    {
        console.warn(
            'Phaser.AnimationParser.spriteSheet: skipFrames = ' +
            skipFrames.toString() + ' is larger than total sprite number ' +
            total.toString());
        return null;
    }

    if (skipFrames < 0)
    {
        //  Allow negative skipframes.
        skipFrames = total + skipFrames;
    }

    if (frameMax !== -1)
    {
        total = skipFrames + frameMax;
    }

    //  Zero or smaller than frame sizes?
    if (width === 0 || height === 0 || width < frameWidth || height < frameHeight || total === 0)
    {
        // console.warn('Phaser.AnimationParser.spriteSheet: ' + key + ' width / height zero or < given frameWidth / frameHeight');
        return null;
    }

    //  Let's create some frames then
    var x = margin;
    var y = margin;

    for (var i = 0; i < total; i++)
    {
        texture.addFrame(i.toString(), x, y, frameWidth, frameHeight);

        x += frameWidth + spacing;

        if (x + frameWidth > width)
        {
            x = margin;
            y += frameHeight + spacing;
        }
    }

    return texture;
};
