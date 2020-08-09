/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BatchChar = require('../BatchChar');
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

    var charColors = src.charColors;

    var tintEffect = (src._isTinted && src.tintFill);

    var tintTL = Utils.getTintAppendFloatAlpha(src._tintTL, cameraAlpha * src._alphaTL);
    var tintTR = Utils.getTintAppendFloatAlpha(src._tintTR, cameraAlpha * src._alphaTR);
    var tintBL = Utils.getTintAppendFloatAlpha(src._tintBL, cameraAlpha * src._alphaBL);
    var tintBR = Utils.getTintAppendFloatAlpha(src._tintBR, cameraAlpha * src._alphaBR);

    var texture = src.frame.glTexture;
    var textureUnit = pipeline.setGameObject(src);

    //  Update the bounds - skipped internally if not dirty
    var bounds = src.getTextBounds(false);

    var i;
    var char;
    var glyph;

    var characters = bounds.characters;

    var dropShadowX = src.dropShadowX;
    var dropShadowY = src.dropShadowY;

    var dropShadow = (dropShadowX !== 0 || dropShadowY !== 0);

    if (dropShadow)
    {
        var srcShadowColor = src._dropShadowColorGL;
        var srcShadowAlpha = src.dropShadowAlpha;

        var blackTL = Utils.getTintAppendFloatAlpha(srcShadowColor, cameraAlpha * srcShadowAlpha * src._alphaTL);
        var blackTR = Utils.getTintAppendFloatAlpha(srcShadowColor, cameraAlpha * srcShadowAlpha * src._alphaTR);
        var blackBL = Utils.getTintAppendFloatAlpha(srcShadowColor, cameraAlpha * srcShadowAlpha * src._alphaBL);
        var blackBR = Utils.getTintAppendFloatAlpha(srcShadowColor, cameraAlpha * srcShadowAlpha * src._alphaBR);

        for (i = 0; i < characters.length; i++)
        {
            char = characters[i];
            glyph = char.glyph;

            if (char.code === 32 || glyph.width === 0 || glyph.height === 0)
            {
                continue;
            }

            BatchChar(pipeline, src, char, glyph, dropShadowX, dropShadowY, calcMatrix, roundPixels, blackTL, blackTR, blackBL, blackBR, 0, texture, textureUnit);
        }
    }

    for (i = 0; i < characters.length; i++)
    {
        char = characters[i];
        glyph = char.glyph;

        if (char.code === 32 || glyph.width === 0 || glyph.height === 0)
        {
            continue;
        }

        if (charColors[char.i])
        {
            var color = charColors[char.i];

            var ctintEffect = color.tintEffect;
            var ctintTL = Utils.getTintAppendFloatAlpha(color.tintTL, cameraAlpha * src._alphaTL);
            var ctintTR = Utils.getTintAppendFloatAlpha(color.tintTR, cameraAlpha * src._alphaTR);
            var ctintBL = Utils.getTintAppendFloatAlpha(color.tintBL, cameraAlpha * src._alphaBL);
            var ctintBR = Utils.getTintAppendFloatAlpha(color.tintBR, cameraAlpha * src._alphaBR);

            BatchChar(pipeline, src, char, glyph, 0, 0, calcMatrix, roundPixels, ctintTL, ctintTR, ctintBL, ctintBR, ctintEffect, texture, textureUnit);
        }
        else
        {
            BatchChar(pipeline, src, char, glyph, 0, 0, calcMatrix, roundPixels, tintTL, tintTR, tintBL, tintBR, tintEffect, texture, textureUnit);
        }

        //  Debug test if the characters are in the correct place when rendered:
        // pipeline.drawFillRect(tx0, ty0, tx2 - tx0, ty2 - ty0, 0x00ff00, 0.5);
    }
};

module.exports = BitmapTextWebGLRenderer;
