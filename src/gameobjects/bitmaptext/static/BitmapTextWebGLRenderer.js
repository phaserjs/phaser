/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BatchChar = require('../BatchChar');
var GetCalcMatrix = require('../../GetCalcMatrix');
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
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var BitmapTextWebGLRenderer = function (renderer, src, camera, parentMatrix)
{
    var text = src._text;
    var textLength = text.length;

    if (textLength === 0)
    {
        return;
    }

    camera.addToRenderList(src);

    var pipeline = renderer.pipelines.set(src.pipeline, src);

    var calcMatrix = GetCalcMatrix(src, camera, parentMatrix).calc;

    var roundPixels = camera.roundPixels;

    var cameraAlpha = camera.alpha;

    var charColors = src.charColors;

    var tintEffect = src.tintFill;

    var getTint = Utils.getTintAppendFloatAlpha;

    var tintTL = getTint(src.tintTopLeft, cameraAlpha * src._alphaTL);
    var tintTR = getTint(src.tintTopRight, cameraAlpha * src._alphaTR);
    var tintBL = getTint(src.tintBottomLeft, cameraAlpha * src._alphaBL);
    var tintBR = getTint(src.tintBottomRight, cameraAlpha * src._alphaBR);

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

    renderer.pipelines.preBatch(src);

    if (dropShadow)
    {
        var srcShadowColor = src.dropShadowColor;
        var srcShadowAlpha = src.dropShadowAlpha;

        var shadowTL = getTint(srcShadowColor, cameraAlpha * srcShadowAlpha * src._alphaTL);
        var shadowTR = getTint(srcShadowColor, cameraAlpha * srcShadowAlpha * src._alphaTR);
        var shadowBL = getTint(srcShadowColor, cameraAlpha * srcShadowAlpha * src._alphaBL);
        var shadowBR = getTint(srcShadowColor, cameraAlpha * srcShadowAlpha * src._alphaBR);

        for (i = 0; i < characters.length; i++)
        {
            char = characters[i];
            glyph = char.glyph;

            if (char.code === 32 || glyph.width === 0 || glyph.height === 0)
            {
                continue;
            }

            BatchChar(pipeline, src, char, glyph, dropShadowX, dropShadowY, calcMatrix, roundPixels, shadowTL, shadowTR, shadowBL, shadowBR, 1, texture, textureUnit);
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

            var charTintEffect = color.tintEffect;
            var charTintTL = getTint(color.tintTL, cameraAlpha * src._alphaTL);
            var charTintTR = getTint(color.tintTR, cameraAlpha * src._alphaTR);
            var charTintBL = getTint(color.tintBL, cameraAlpha * src._alphaBL);
            var charTintBR = getTint(color.tintBR, cameraAlpha * src._alphaBR);

            BatchChar(pipeline, src, char, glyph, 0, 0, calcMatrix, roundPixels, charTintTL, charTintTR, charTintBL, charTintBR, charTintEffect, texture, textureUnit);
        }
        else
        {
            BatchChar(pipeline, src, char, glyph, 0, 0, calcMatrix, roundPixels, tintTL, tintTR, tintBL, tintBR, tintEffect, texture, textureUnit);
        }

        //  Debug test if the characters are in the correct place when rendered:
        // pipeline.drawFillRect(tx0, ty0, tx2 - tx0, ty2 - ty0, 0x00ff00, 0.5);
    }

    renderer.pipelines.postBatch(src);
};

module.exports = BitmapTextWebGLRenderer;
