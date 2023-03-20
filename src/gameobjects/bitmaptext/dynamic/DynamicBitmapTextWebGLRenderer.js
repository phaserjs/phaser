/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetCalcMatrix = require('../../GetCalcMatrix');
var TransformMatrix = require('../../components/TransformMatrix');
var Utils = require('../../../renderer/webgl/Utils');

var tempMatrix = new TransformMatrix();

/**
 * Renders this Game Object with the WebGL Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.DynamicBitmapText#renderWebGL
 * @since 3.0.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {Phaser.GameObjects.DynamicBitmapText} src - The Game Object being rendered in this call.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var DynamicBitmapTextWebGLRenderer = function (renderer, src, camera, parentMatrix)
{
    var text = src.text;
    var textLength = text.length;

    if (textLength === 0)
    {
        return;
    }

    camera.addToRenderList(src);

    var pipeline = renderer.pipelines.set(src.pipeline, src);

    var result = GetCalcMatrix(src, camera, parentMatrix);

    //  This causes a flush if the BitmapText has a Post Pipeline
    renderer.pipelines.preBatch(src);

    var spriteMatrix = result.sprite;
    var calcMatrix = result.calc;

    var fontMatrix = tempMatrix;

    var crop = (src.cropWidth > 0 || src.cropHeight > 0);

    if (crop)
    {
        pipeline.flush();

        renderer.pushScissor(
            calcMatrix.tx,
            calcMatrix.ty,
            src.cropWidth * calcMatrix.scaleX,
            src.cropHeight * calcMatrix.scaleY
        );
    }

    var frame = src.frame;
    var texture = frame.glTexture;

    var tintEffect = src.tintFill;
    var tintTL = Utils.getTintAppendFloatAlpha(src.tintTopLeft, camera.alpha * src._alphaTL);
    var tintTR = Utils.getTintAppendFloatAlpha(src.tintTopRight, camera.alpha * src._alphaTR);
    var tintBL = Utils.getTintAppendFloatAlpha(src.tintBottomLeft, camera.alpha * src._alphaBL);
    var tintBR = Utils.getTintAppendFloatAlpha(src.tintBottomRight, camera.alpha * src._alphaBR);

    var textureUnit = pipeline.setGameObject(src);

    var xAdvance = 0;
    var yAdvance = 0;
    var charCode = 0;
    var lastCharCode = 0;
    var letterSpacing = src.letterSpacing;
    var glyph;
    var glyphW = 0;
    var glyphH = 0;
    var lastGlyph;
    var scrollX = src.scrollX;
    var scrollY = src.scrollY;

    var fontData = src.fontData;
    var chars = fontData.chars;
    var lineHeight = fontData.lineHeight;
    var scale = (src.fontSize / fontData.size);
    var rotation = 0;

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
    var displayCallback = src.displayCallback;
    var callbackData = src.callbackData;

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

        glyphW = glyph.width;
        glyphH = glyph.height;

        var x = (glyph.xOffset + xAdvance) - scrollX;
        var y = (glyph.yOffset + yAdvance) - scrollY;

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

        scale = (src.fontSize / src.fontData.size);
        rotation = 0;

        if (displayCallback)
        {
            callbackData.color = 0;
            callbackData.tint.topLeft = tintTL;
            callbackData.tint.topRight = tintTR;
            callbackData.tint.bottomLeft = tintBL;
            callbackData.tint.bottomRight = tintBR;
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

            if (output.color)
            {
                tintTL = output.color;
                tintTR = output.color;
                tintBL = output.color;
                tintBR = output.color;
            }
            else
            {
                tintTL = output.tint.topLeft;
                tintTR = output.tint.topRight;
                tintBL = output.tint.bottomLeft;
                tintBR = output.tint.bottomRight;
            }

            tintTL = Utils.getTintAppendFloatAlpha(tintTL, camera.alpha * src._alphaTL);
            tintTR = Utils.getTintAppendFloatAlpha(tintTR, camera.alpha * src._alphaTR);
            tintBL = Utils.getTintAppendFloatAlpha(tintBL, camera.alpha * src._alphaBL);
            tintBR = Utils.getTintAppendFloatAlpha(tintBR, camera.alpha * src._alphaBR);
        }

        x *= scale;
        y *= scale;

        x -= src.displayOriginX;
        y -= src.displayOriginY;

        x += lineOffsetX;

        fontMatrix.applyITRS(x, y, rotation, scale, scale);

        calcMatrix.multiply(fontMatrix, spriteMatrix);

        var u0 = glyph.u0;
        var v0 = glyph.v0;
        var u1 = glyph.u1;
        var v1 = glyph.v1;

        var xw = glyphW;
        var yh = glyphH;

        var tx0 = spriteMatrix.e;
        var ty0 = spriteMatrix.f;

        var tx1 = yh * spriteMatrix.c + spriteMatrix.e;
        var ty1 = yh * spriteMatrix.d + spriteMatrix.f;

        var tx2 = xw * spriteMatrix.a + yh * spriteMatrix.c + spriteMatrix.e;
        var ty2 = xw * spriteMatrix.b + yh * spriteMatrix.d + spriteMatrix.f;

        var tx3 = xw * spriteMatrix.a + spriteMatrix.e;
        var ty3 = xw * spriteMatrix.b + spriteMatrix.f;

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

        pipeline.batchQuad(src, tx0, ty0, tx1, ty1, tx2, ty2, tx3, ty3, u0, v0, u1, v1, tintTL, tintTR, tintBL, tintBR, tintEffect, texture, textureUnit);
    }

    if (crop)
    {
        pipeline.flush();

        renderer.popScissor();
    }

    renderer.pipelines.postBatch(src);
};

module.exports = DynamicBitmapTextWebGLRenderer;
