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

    var roundPixels = camera.roundPixels;

    var cameraAlpha = camera.alpha;

    var tintEffect = (src._isTinted && src.tintFill);

    var tintTL = Utils.getTintAppendFloatAlpha(src._tintTL, cameraAlpha * src._alphaTL);
    var tintTR = Utils.getTintAppendFloatAlpha(src._tintTR, cameraAlpha * src._alphaTR);
    var tintBL = Utils.getTintAppendFloatAlpha(src._tintBL, cameraAlpha * src._alphaBL);
    var tintBR = Utils.getTintAppendFloatAlpha(src._tintBR, cameraAlpha * src._alphaBR);

    var texture = src.frame.glTexture;
    var textureUnit = pipeline.setGameObject(src);

    //  Update the bounds - skipped internally if not dirty
    var bounds = src.getTextBounds(false);

    var characters = bounds.characters;

    for (var i = 0; i < characters.length; i++)
    {
        var char = characters[i];
        var glyph = char.glyph;

        if (char.code === 32 || glyph.width === 0 || glyph.height === 0)
        {
            continue;
        }

        var x = char.x - src.displayOriginX;
        var y = char.y - src.displayOriginY;

        var xw = x + char.w;
        var yh = y + char.h;

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

        if (char.isTinted)
        {
            var ctintEffect = char.tintEffect;
            var ctintTL = Utils.getTintAppendFloatAlpha(char.tintTL, cameraAlpha * char.alphaTL);
            var ctintTR = Utils.getTintAppendFloatAlpha(char.tintTR, cameraAlpha * char.alphaTR);
            var ctintBL = Utils.getTintAppendFloatAlpha(char.tintBL, cameraAlpha * char.alphaBL);
            var ctintBR = Utils.getTintAppendFloatAlpha(char.tintBR, cameraAlpha * char.alphaBR);

            pipeline.batchQuad(tx0, ty0, tx1, ty1, tx2, ty2, tx3, ty3, glyph.u0, glyph.v0, glyph.u1, glyph.v1, ctintTL, ctintTR, ctintBL, ctintBR, ctintEffect, texture, textureUnit);
        }
        else
        {
            pipeline.batchQuad(tx0, ty0, tx1, ty1, tx2, ty2, tx3, ty3, glyph.u0, glyph.v0, glyph.u1, glyph.v1, tintTL, tintTR, tintBL, tintBR, tintEffect, texture, textureUnit);
        }

        //  Debug test if the characters are in the correct place when rendered:

        // pipeline.drawFillRect(tx0, ty0, tx2 - tx0, ty2 - ty0, 0x00ff00, 0.5);
    }
};

module.exports = BitmapTextWebGLRenderer;
