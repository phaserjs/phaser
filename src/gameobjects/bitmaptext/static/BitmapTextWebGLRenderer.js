/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Utils = require('../../../renderer/webgl/Utils');

/**
 * Renders this Game Object with the WebGL Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.BitmapText#renderWebGL
 * @since 3.0.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {Phaser.GameObjects.BitmapText} src - The Game Object being rendered in this call.
 * @param {number} interpolationPercentage - Reserved for future use and custom pipelines.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var BitmapTextWebGLRenderer = function (renderer, src, interpolationPercentage, camera, parentMatrix)
{
    var text = src._text;
    var textLength = text.length;

    if (textLength === 0)
    {
        return;
    }
 
    var pipeline = this.pipeline;

    renderer.setPipeline(pipeline, src);

    var camMatrix = pipeline._tempMatrix1;
    var spriteMatrix = pipeline._tempMatrix2;
    var calcMatrix = pipeline._tempMatrix3;

    spriteMatrix.applyITRS(src.x, src.y, src.rotation, src.scaleX, src.scaleY);

    camMatrix.copyFrom(camera.matrix);

    if (parentMatrix)
    {
        //  Multiply the camera by the parent matrix
        camMatrix.multiplyWithOffset(parentMatrix, -camera.scrollX * src.scrollFactorX, -camera.scrollY * src.scrollFactorY);

        //  Undo the camera scroll
        spriteMatrix.e = src.x;
        spriteMatrix.f = src.y;

        //  Multiply by the Sprite matrix, store result in calcMatrix
        camMatrix.multiply(spriteMatrix, calcMatrix);
    }
    else
    {
        spriteMatrix.e -= camera.scrollX * src.scrollFactorX;
        spriteMatrix.f -= camera.scrollY * src.scrollFactorY;

        //  Multiply by the Sprite matrix, store result in calcMatrix
        camMatrix.multiply(spriteMatrix, calcMatrix);
    }

    var frame = src.frame;
    var texture = frame.glTexture;
    var textureX = frame.cutX;
    var textureY = frame.cutY;
    var textureWidth = texture.width;
    var textureHeight = texture.height;

    var tintEffect = (src._isTinted && src.tintFill);
    var tintTL = Utils.getTintAppendFloatAlpha(src._tintTL, camera.alpha * src._alphaTL);
    var tintTR = Utils.getTintAppendFloatAlpha(src._tintTR, camera.alpha * src._alphaTR);
    var tintBL = Utils.getTintAppendFloatAlpha(src._tintBL, camera.alpha * src._alphaBL);
    var tintBR = Utils.getTintAppendFloatAlpha(src._tintBR, camera.alpha * src._alphaBR);

    pipeline.setTexture2D(texture, 0);

    var xAdvance = 0;
    var yAdvance = 0;
    var charCode = 0;
    var lastCharCode = 0;
    var letterSpacing = src._letterSpacing;
    var glyph;
    var glyphX = 0;
    var glyphY = 0;
    var glyphW = 0;
    var glyphH = 0;
    var lastGlyph;

    var fontData = src.fontData;
    var chars = fontData.chars;
    var lineHeight = fontData.lineHeight;
    var scale = (src._fontSize / fontData.size);

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

    var roundPixels = camera.roundPixels;

    for (var i = 0; i < textLength; i++)
    {
        charCode = text.charCodeAt(i);

        //  Carriage-return
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

        var x = glyph.xOffset + xAdvance;
        var y = glyph.yOffset + yAdvance;

        if (lastGlyph !== null)
        {
            var kerningOffset = glyph.kerning[lastCharCode];
            x += (kerningOffset !== undefined) ? kerningOffset : 0;
        }

        xAdvance += glyph.xAdvance + letterSpacing;
        lastGlyph = glyph;
        lastCharCode = charCode;

        //  Nothing to render or a space? Then skip to the next glyph
        if (glyphW === 0 || glyphH === 0 || charCode === 32)
        {
            continue;
        }

        x *= scale;
        y *= scale;

        x -= src.displayOriginX;
        y -= src.displayOriginY;

        x += lineOffsetX;

        var u0 = glyphX / textureWidth;
        var v0 = glyphY / textureHeight;
        var u1 = (glyphX + glyphW) / textureWidth;
        var v1 = (glyphY + glyphH) / textureHeight;

        var xw = x + (glyphW * scale);
        var yh = y + (glyphH * scale);

        var tx0 = calcMatrix.getX(x, y);
        var ty0 = calcMatrix.getY(x, y);

        var tx1 = calcMatrix.getX(x, yh);
        var ty1 = calcMatrix.getY(x, yh);

        var tx2 = calcMatrix.getX(xw, yh);
        var ty2 = calcMatrix.getY(xw, yh);

        var tx3 = calcMatrix.getX(xw, y);
        var ty3 = calcMatrix.getY(xw, y);

        if (roundPixels)
        {
            tx0 = Math.round(tx0);
            ty0 = Math.round(ty0);

            tx1 = Math.round(tx1);
            ty1 = Math.round(ty1);

            tx2 = Math.round(tx2);
            ty2 = Math.round(ty2);

            tx3 = Math.round(tx3);
            ty3 = Math.round(ty3);
        }

        pipeline.batchQuad(tx0, ty0, tx1, ty1, tx2, ty2, tx3, ty3, u0, v0, u1, v1, tintTL, tintTR, tintBL, tintBR, tintEffect, texture, 0);
    }
};

module.exports = BitmapTextWebGLRenderer;
