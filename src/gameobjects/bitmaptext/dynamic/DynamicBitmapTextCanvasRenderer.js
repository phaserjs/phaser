/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var SetTransform = require('../../../renderer/canvas/utils/SetTransform');

/**
 * Renders this Game Object with the Canvas Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.DynamicBitmapText#renderCanvas
 * @since 3.0.0
 * @private
 *
 * @param {Phaser.Renderer.Canvas.CanvasRenderer} renderer - A reference to the current active Canvas renderer.
 * @param {Phaser.GameObjects.DynamicBitmapText} src - The Game Object being rendered in this call.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var DynamicBitmapTextCanvasRenderer = function (renderer, src, camera, parentMatrix)
{
    var text = src._text;
    var textLength = text.length;

    var ctx = renderer.currentContext;

    if (textLength === 0 || !SetTransform(renderer, ctx, src, camera, parentMatrix))
    {
        return;
    }

    var textureFrame = src.frame;

    var displayCallback = src.displayCallback;
    var callbackData = src.callbackData;

    var chars = src.fontData.chars;
    var lineHeight = src.fontData.lineHeight;
    var letterSpacing = src._letterSpacing;

    var xAdvance = 0;
    var yAdvance = 0;

    var charCode = 0;

    var glyph = null;
    var glyphX = 0;
    var glyphY = 0;
    var glyphW = 0;
    var glyphH = 0;

    var x = 0;
    var y = 0;

    var lastGlyph = null;
    var lastCharCode = 0;

    var image = src.frame.source.image;

    var textureX = textureFrame.cutX;
    var textureY = textureFrame.cutY;

    var rotation = 0;
    var scale = 0;
    var baseScale = (src._fontSize / src.fontData.size);

    var align = src._align;
    var currentLine = 0;
    var lineOffsetX = 0;

    //  Update the bounds - skipped internally if not dirty
    src.getTextBounds(false);

    var lineData = src._bounds.lines;

    if (align === 1)
    {
        lineOffsetX = (lineData.longest - lineData.lengths[0]) / 2;
    }
    else if (align === 2)
    {
        lineOffsetX = (lineData.longest - lineData.lengths[0]);
    }

    ctx.translate(-src.displayOriginX, -src.displayOriginY);

    var roundPixels = camera.roundPixels;

    if (src.cropWidth > 0 && src.cropHeight > 0)
    {
        ctx.beginPath();
        ctx.rect(0, 0, src.cropWidth, src.cropHeight);
        ctx.clip();
    }

    for (var i = 0; i < textLength; i++)
    {
        //  Reset the scale (in case the callback changed it)
        scale = baseScale;
        rotation = 0;

        charCode = text.charCodeAt(i);

        if (charCode === 10)
        {
            currentLine++;

            if (align === 1)
            {
                lineOffsetX = (lineData.longest - lineData.lengths[currentLine]) / 2;
            }
            else if (align === 2)
            {
                lineOffsetX = (lineData.longest - lineData.lengths[currentLine]);
            }

            xAdvance = 0;
            yAdvance += lineHeight;
            lastGlyph = null;

            continue;
        }

        glyph = chars[charCode];

        if (!glyph)
        {
            continue;
        }

        glyphX = textureX + glyph.x;
        glyphY = textureY + glyph.y;

        glyphW = glyph.width;
        glyphH = glyph.height;

        x = (glyph.xOffset + xAdvance) - src.scrollX;
        y = (glyph.yOffset + yAdvance) - src.scrollY;

        if (lastGlyph !== null)
        {
            var kerningOffset = glyph.kerning[lastCharCode];
            x += (kerningOffset !== undefined) ? kerningOffset : 0;
        }

        if (displayCallback)
        {
            callbackData.index = i;
            callbackData.charCode = charCode;
            callbackData.x = x;
            callbackData.y = y;
            callbackData.scale = scale;
            callbackData.rotation = rotation;
            callbackData.data = glyph.data;

            var output = displayCallback(callbackData);

            x = output.x;
            y = output.y;
            scale = output.scale;
            rotation = output.rotation;
        }

        x *= scale;
        y *= scale;

        x += lineOffsetX;

        xAdvance += glyph.xAdvance + letterSpacing;
        lastGlyph = glyph;
        lastCharCode = charCode;

        //  Nothing to render or a space? Then skip to the next glyph
        if (glyphW === 0 || glyphH === 0 || charCode === 32)
        {
            continue;
        }

        if (roundPixels)
        {
            x = Math.round(x);
            y = Math.round(y);
        }

        ctx.save();

        ctx.translate(x, y);

        ctx.rotate(rotation);

        ctx.scale(scale, scale);

        ctx.drawImage(image, glyphX, glyphY, glyphW, glyphH, 0, 0, glyphW, glyphH);

        ctx.restore();
    }

    ctx.restore();
};

module.exports = DynamicBitmapTextCanvasRenderer;
