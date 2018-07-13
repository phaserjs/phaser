/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GameObject = require('../../GameObject');

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
 * @param {number} interpolationPercentage - Reserved for future use and custom pipelines.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var BitmapTextCanvasRenderer = function (renderer, src, interpolationPercentage, camera, parentMatrix)
{
    var text = src._text;
    var textLength = text.length;

    if (GameObject.RENDER_MASK !== src.renderFlags || textLength === 0 || (src.cameraFilter > 0 && (src.cameraFilter & camera.id)))
    {
        return;
    }
    
    var textureFrame = src.frame;

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

    var ctx = renderer.currentContext;
    var image = src.frame.source.image;

    var textureX = textureFrame.cutX;
    var textureY = textureFrame.cutY;

    var scale = (src._fontSize / src.fontData.size);

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

    //  Alpha

    var alpha = camera.alpha * src.alpha;

    if (alpha === 0)
    {
        //  Nothing to see, so abort early
        return;
    }
    else if (renderer.currentAlpha !== alpha)
    {
        renderer.currentAlpha = alpha;
        ctx.globalAlpha = alpha;
    }

    //  Blend Mode
    if (renderer.currentBlendMode !== src.blendMode)
    {
        renderer.currentBlendMode = src.blendMode;
        ctx.globalCompositeOperation = renderer.blendModes[src.blendMode];
    }

    //  Smoothing
    if (renderer.currentScaleMode !== src.scaleMode)
    {
        renderer.currentScaleMode = src.scaleMode;
    }

    var tx = (src.x - camera.scrollX * src.scrollFactorX) + src.frame.x;
    var ty = (src.y - camera.scrollY * src.scrollFactorY) + src.frame.y;

    var roundPixels = camera.roundPixels;

    if (roundPixels)
    {
        tx |= 0;
        ty |= 0;
    }

    ctx.save();

    if (parentMatrix !== undefined)
    {
        var matrix = parentMatrix.matrix;
        ctx.transform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
    }

    ctx.translate(tx, ty);

    ctx.rotate(src.rotation);

    ctx.translate(-src.displayOriginX, -src.displayOriginY);

    ctx.scale(src.scaleX, src.scaleY);

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
            x |= 0;
            y |= 0;
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
