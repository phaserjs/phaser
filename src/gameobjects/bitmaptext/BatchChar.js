/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var tempTextureData = {
    frame: null,
    uvSource: null
};

var tempTransformData = {
    quad: new Float32Array(8)
};

/**
 * Renders one character of the Bitmap Text to WebGL.
 *
 * @function BatchChar
 * @since 3.50.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
 * @param {Phaser.Renderer.WebGL.RenderNodes.SubmitterQuad} submitterNode - The Submitter Node which handles rendering the character as a quad.
 * @param {Phaser.GameObjects.BitmapText} src - The BitmapText Game Object.
 * @param {Phaser.Types.GameObjects.BitmapText.BitmapTextCharacter} char - The character to render.
 * @param {Phaser.Types.GameObjects.BitmapText.BitmapFontCharacterData} glyph - The character glyph.
 * @param {number} offsetX - The x offset.
 * @param {number} offsetY - The y offset.
 * @param {Phaser.GameObjects.Components.TransformMatrix} calcMatrix - The transform matrix.
 * @param {object} tintData - The tint data to pass to the submitter node.
 * @param {number} tintData.tintFill - The tint effect mode.
 * @param {number} tintData.tintTopLeft - The top-left tint value.
 * @param {number} tintData.tintTopRight - The top-right tint value.
 * @param {number} tintData.tintBottomLeft - The bottom-left tint value.
 * @param {number} tintData.tintBottomRight - The bottom-right tint value.
 */
var BatchChar = function (drawingContext, submitterNode, src, char, glyph, offsetX, offsetY, calcMatrix, tintData)
{
    tempTextureData.frame = src.frame;
    tempTextureData.uvSource = glyph;

    var x = (char.x - src.displayOriginX) + offsetX;
    var y = (char.y - src.displayOriginY) + offsetY;

    var xw = x + char.w;
    var yh = y + char.h;

    var a = calcMatrix.a;
    var b = calcMatrix.b;
    var c = calcMatrix.c;
    var d = calcMatrix.d;
    var e = calcMatrix.e;
    var f = calcMatrix.f;

    var tx0 = x * a + y * c + e;
    var ty0 = x * b + y * d + f;

    var tx1 = x * a + yh * c + e;
    var ty1 = x * b + yh * d + f;

    var tx2 = xw * a + yh * c + e;
    var ty2 = xw * b + yh * d + f;

    var tx3 = xw * a + y * c + e;
    var ty3 = xw * b + y * d + f;

    tempTransformData.quad[0] = tx0;
    tempTransformData.quad[1] = ty0;

    tempTransformData.quad[2] = tx1;
    tempTransformData.quad[3] = ty1;

    tempTransformData.quad[4] = tx2;
    tempTransformData.quad[5] = ty2;

    tempTransformData.quad[6] = tx3;
    tempTransformData.quad[7] = ty3;

    submitterNode.run(
        drawingContext,
        src,
        undefined,
        0,
        tempTextureData,
        tempTransformData,
        tintData
    );
};

module.exports = BatchChar;
