/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
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
 * @param {WebGLTexture} texture - The WebGL texture.
 * @param {number} textureUnit - The texture unit.
 */
var BatchChar = function (pipeline, src, char, glyph, offsetX, offsetY, calcMatrix, roundPixels, tintTL, tintTR, tintBL, tintBR, tintEffect, texture, textureUnit)
{
    var x = (char.x - src.displayOriginX) + offsetX;
    var y = (char.y - src.displayOriginY) + offsetY;

    var xw = x + char.w;
    var yh = y + char.h;

    var tx0 = calcMatrix.getXRound(x, y, roundPixels);
    var ty0 = calcMatrix.getYRound(x, y, roundPixels);

    var tx1 = calcMatrix.getXRound(x, yh, roundPixels);
    var ty1 = calcMatrix.getYRound(x, yh, roundPixels);

    var tx2 = calcMatrix.getXRound(xw, yh, roundPixels);
    var ty2 = calcMatrix.getYRound(xw, yh, roundPixels);

    var tx3 = calcMatrix.getXRound(xw, y, roundPixels);
    var ty3 = calcMatrix.getYRound(xw, y, roundPixels);

    pipeline.batchQuad(src, tx0, ty0, tx1, ty1, tx2, ty2, tx3, ty3, glyph.u0, glyph.v0, glyph.u1, glyph.v1, tintTL, tintTR, tintBL, tintBR, tintEffect, texture, textureUnit);
};

module.exports = BatchChar;
