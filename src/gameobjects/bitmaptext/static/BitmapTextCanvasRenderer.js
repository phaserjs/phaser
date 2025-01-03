/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var SetTransform = require('../../../renderer/canvas/utils/SetTransform');

/**
 * Renders this Game Object with the Canvas Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.BitmapText#renderCanvas
 * @since 3.0.0
 * @private
 *
 * @param {Phaser.Renderer.Canvas.CanvasRenderer} renderer - A reference to the current active Canvas renderer.
 * @param {Phaser.GameObjects.BitmapText} src - The Game Object being rendered in this call.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var BitmapTextCanvasRenderer = function (renderer, src, camera, parentMatrix)
{
    var text = src._text;
    var textLength = text.length;

    var ctx = renderer.currentContext;

    if (textLength === 0 || !SetTransform(renderer, ctx, src, camera, parentMatrix))
    {
        return;
    }

    camera.addToRenderList(src);

    var textureFrame = src.fromAtlas
        ? src.frame
        : src.texture.frames['__BASE'];

    var chars = src.fontData.chars;
    var lineHeight = src.fontData.lineHeight;
    var letterSpacing = src._letterSpacing;
    var lineSpacing = src._lineSpacing;

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

    var image = textureFrame.source.image;

    var textureX = textureFrame.cutX;
    var textureY = textureFrame.cutY;

    var scale = (src._fontSize / src.fontData.size);

    var align = src._align;
    var currentLine = 0;
    var lineOffsetX = 0;

    //  Update the bounds - skipped internally if not dirty
    var bounds = src.getTextBounds(false);

    //  In case the method above changed it (word wrapping)
    if (src.maxWidth > 0)
    {
        text = bounds.wrappedText;
        textLength = text.length;
    }

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

    for (var i = 0; i < textLength; i++)
    {
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
            yAdvance += lineHeight + lineSpacing;

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

        x = glyph.xOffset + xAdvance;
        y = glyph.yOffset + yAdvance;

        if (lastGlyph !== null)
        {
            var kerningOffset = glyph.kerning[lastCharCode];
            x += (kerningOffset !== undefined) ? kerningOffset : 0;
        }

        x *= scale;
        y *= scale;

        x += lineOffsetX;

        xAdvance += glyph.xAdvance + letterSpacing + ((kerningOffset !== undefined) ? kerningOffset : 0);
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

        ctx.scale(scale, scale);

        ctx.drawImage(image, glyphX, glyphY, glyphW, glyphH, 0, 0, glyphW, glyphH);

        ctx.restore();
    }

    ctx.restore();
};

module.exports = BitmapTextCanvasRenderer;
