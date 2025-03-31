/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BatchChar = require('../BatchChar');
var GetCalcMatrix = require('../../GetCalcMatrix');
var Utils = require('../../../renderer/webgl/Utils');

var tempTintData1 = {
    tintEffect: 0,
    tintTopLeft: 0,
    tintTopRight: 0,
    tintBottomLeft: 0,
    tintBottomRight: 0
};

var tempTintData2 = {
    tintEffect: 0,
    tintTopLeft: 0,
    tintTopRight: 0,
    tintBottomLeft: 0,
    tintBottomRight: 0
};

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
 * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var BitmapTextWebGLRenderer = function (renderer, src, drawingContext, parentMatrix)
{
    var text = src._text;
    var textLength = text.length;

    if (textLength === 0)
    {
        return;
    }

    var camera = drawingContext.camera;
    camera.addToRenderList(src);

    var submitterNode = src.customRenderNodes.Submitter || src.defaultRenderNodes.Submitter;

    var calcMatrix = GetCalcMatrix(src, camera, parentMatrix, !drawingContext.useCanvas).calc;

    var charColors = src.charColors;

    var getTint = Utils.getTintAppendFloatAlpha;

    tempTintData1.tintFill = src.tintFill;
    tempTintData1.tintTopLeft = getTint(src.tintTopLeft, src._alphaTL);
    tempTintData1.tintTopRight = getTint(src.tintTopRight, src._alphaTR);
    tempTintData1.tintBottomLeft = getTint(src.tintBottomLeft, src._alphaBL);
    tempTintData1.tintBottomRight = getTint(src.tintBottomRight, src._alphaBR);

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
        var srcShadowColor = src.dropShadowColor;
        var srcShadowAlpha = src.dropShadowAlpha;

        tempTintData2.tintFill = 1;
        tempTintData2.tintTopLeft = getTint(srcShadowColor, srcShadowAlpha * src._alphaTL);
        tempTintData2.tintTopRight = getTint(srcShadowColor, srcShadowAlpha * src._alphaTR);
        tempTintData2.tintBottomLeft = getTint(srcShadowColor, srcShadowAlpha * src._alphaBL);
        tempTintData2.tintBottomRight = getTint(srcShadowColor, srcShadowAlpha * src._alphaBR);

        for (i = 0; i < characters.length; i++)
        {
            char = characters[i];
            glyph = char.glyph;

            if (char.code === 32 || glyph.width === 0 || glyph.height === 0)
            {
                continue;
            }

            BatchChar(drawingContext, submitterNode, src, char, glyph, dropShadowX, dropShadowY, calcMatrix, tempTintData2);
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

            tempTintData2.tintFill = color.tintEffect;
            tempTintData2.tintTopLeft = getTint(color.tintTL, src._alphaTL);
            tempTintData2.tintTopRight = getTint(color.tintTR, src._alphaTR);
            tempTintData2.tintBottomLeft = getTint(color.tintBL, src._alphaBL);
            tempTintData2.tintBottomRight = getTint(color.tintBR, src._alphaBR);

            BatchChar(drawingContext, submitterNode, src, char, glyph, 0, 0, calcMatrix, tempTintData2);
        }
        else
        {
            BatchChar(drawingContext, submitterNode, src, char, glyph, 0, 0, calcMatrix, tempTintData1);
        }
    }
};

module.exports = BitmapTextWebGLRenderer;
