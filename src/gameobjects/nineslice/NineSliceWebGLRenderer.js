/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetCalcMatrix = require('../GetCalcMatrix');
var Utils = require('../../renderer/webgl/Utils');

var fixedRenderOptions = { multiTexturing: true };

/**
 * Renders this Game Object with the WebGL Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.NineSlice#renderWebGL
 * @since 3.0.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {Phaser.GameObjects.NineSlice} src - The Game Object being rendered in this call.
 * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var NineSliceWebGLRenderer = function (renderer, src, drawingContext, parentMatrix)
{
    var verts = src.vertices;
    var totalVerts = verts.length;

    if (totalVerts === 0)
    {
        return;
    }

    var camera = drawingContext.camera;

    camera.addToRenderList(src);

    var alpha = src.alpha;
    var batchHandler = src.customRenderNodes.BatchHandler || src.defaultRenderNodes.BatchHandler;
    var calcMatrix = GetCalcMatrix(src, camera, parentMatrix, !drawingContext.useCanvas).calc;
    var color = Utils.getTintAppendFloatAlpha(src.tint, alpha);
    var glTexture = src.frame.source.glTexture;
    var tintEffect = src.tintFill;

    var quad, vtl, vbr;

    for (var i = 0; i < totalVerts; i += 6)
    {
        // Of the 6 vertices, we only need these 2 to define a quad.
        // They are the top-left and bottom-right.
        vtl = verts[i + 1];
        vbr = verts[i + 2];

        quad = calcMatrix.setQuad(
            vtl.vx, vtl.vy,
            vbr.vx, vbr.vy
        );

        batchHandler.batch(
            drawingContext,

            glTexture,

            // Transformed quad in order TL, BL, TR, BR:
            quad[0], quad[1],
            quad[2], quad[3],
            quad[6], quad[7],
            quad[4], quad[5],

            // Texture coordinates in X, Y, Width, Height:
            vtl.u, vtl.v, vbr.u - vtl.u, vbr.v - vtl.v,

            tintEffect,

            // Tint colors in order TL, BL, TR, BR:
            color, color, color, color,

            // Render options:
            fixedRenderOptions
        );
    }
};

module.exports = NineSliceWebGLRenderer;
