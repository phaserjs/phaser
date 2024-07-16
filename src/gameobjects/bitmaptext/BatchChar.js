/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Renders one character of the Bitmap Text to the WebGL Pipeline.
 *
 * @function BatchChar
 * @since 3.50.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLPipeline} pipeline - The WebGLPipeline. Must have a `batchQuad` method.
 * @param {Phaser.GameObjects.BitmapText} src - The BitmapText Game Object.
 * @param {Phaser.Types.GameObjects.BitmapText.BitmapTextCharacter} char - The character to render.
 * @param {Phaser.Types.GameObjects.BitmapText.BitmapFontCharacterData} glyph - The character glyph.
 * @param {number} offsetX - The x offset.
 * @param {number} offsetY - The y offset.
 * @param {Phaser.GameObjects.Components.TransformMatrix} calcMatrix - The transform matrix.
 * @param {boolean} roundPixels - Round the transform values or not?
 * @param {number} tintTL - Top-left tint value.
 * @param {number} tintTR - Top-right tint value.
 * @param {number} tintBL - Bottom-left tint value.
 * @param {number} tintBR - Bottom-right tint value.
 * @param {number} tintEffect - The tint effect mode.
 * @param {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper} texture - The texture.
 * @param {number} textureUnit - The texture unit.
 */
var BatchChar = function (pipeline, src, char, glyph, offsetX, offsetY, calcMatrix, roundPixels, tintTL, tintTR, tintBL, tintBR, tintEffect, texture, textureUnit)
{
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

    pipeline.batchQuad(src, tx0, ty0, tx1, ty1, tx2, ty2, tx3, ty3, glyph.u0, glyph.v0, glyph.u1, glyph.v1, tintTL, tintTR, tintBL, tintBR, tintEffect, texture, textureUnit);
};

module.exports = BatchChar;
