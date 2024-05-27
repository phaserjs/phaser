/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var TransformMatrix = require('../../../gameobjects/components/TransformMatrix');
var Class = require('../../../utils/Class');
var RenderNode = require('./RenderNode');

/**
 * @classdesc
 * A RenderNode which renders a filled rectangle.
 * This is useful for full-screen effects and rectangle geometry.
 *
 * It works by drawing a tinted white texture. This can take advantage of
 * the WebGL renderer's batching capabilities.
 *
 * @class FillRect
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 3.90.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The renderer that owns this RenderNode.
 */
var FillRect = new Class({
    Extends: RenderNode,

    initialize: function FillRect (manager, renderer)
    {
        RenderNode.call(this, 'FillRect', manager, renderer);

        /**
         * The QuadBatchHandler that handles the rendering of quads.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.FillRect#quadBatchHandlerNode
         * @type {Phaser.Renderer.WebGL.RenderNodes.QuadBatchHandler}
         * @since 3.90.0
         */
        this.quadBatchHandlerNode = this.manager.getNode('QuadBatchHandler');

        /**
         * An unchanging identity matrix.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.FillRect#_identityMatrix
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @private
         */
        this._identityMatrix = new TransformMatrix();

        /**
         * Temporary matrix for calculating the screen space.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.FillRect#_calcMatrix
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         */
        this._calcMatrix = new TransformMatrix();
    },

    /**
     * Render the rectangle.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.FillRect#run
     * @since 3.90.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The context currently in use.
     * @param {Phaser.GameObjects.Components.TransformMatrix} [parentMatrix] - This transform matrix is defined if the game object is nested.
     * @param {number} x - The x-coordinate of the rectangle.
     * @param {number} y - The y-coordinate of the rectangle.
     * @param {number} width - The width of the rectangle.
     * @param {number} height - The height of the rectangle.
     * @param {number} tintTL - The top-left tint color.
     * @param {number} tintTR - The top-right tint color.
     * @param {number} tintBL - The bottom-left tint color.
     * @param {number} tintBR - The bottom-right tint color.
     * @param {number|boolean} tintFill - The tint effect for the shader to use.
     * @param {boolean} [inWorldSpace] - Is this in world space? By default, it's in screen space.
     */
    run: function (drawingContext, parentMatrix, x, y, width, height, tintTL, tintTR, tintBL, tintBR, tintFill, inWorldSpace)
    {
        var currentMatrix = this._identityMatrix;

        if (inWorldSpace)
        {
            currentMatrix = drawingContext.camera.matrix;
        }

        if (parentMatrix)
        {
            parentMatrix.multiply(currentMatrix, this._calcMatrix);
            currentMatrix = this._calcMatrix;
        }

        var quad = currentMatrix.setQuad(x, y, x + width, y + height);

        this.quadBatchHandlerNode.batch(
            drawingContext,
            this.renderer.whiteTexture,

            // Quad vertices in TRIANGLE_STRIP order:
            quad[0], quad[1],
            quad[2], quad[3],
            quad[6], quad[7],
            quad[4], quad[5],
            
            // Texture coordinates in X, Y, Width, Height:
            0, 0, 1, 1,

            tintFill,

            // Tint colors in TRIANGLE_STRIP order:
            tintTL, tintTR, tintBL, tintBR
        );
    }
});

module.exports = FillRect;
