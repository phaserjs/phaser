/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var TransformMatrix = require('../../../../gameobjects/components/TransformMatrix.js');
var Class = require('../../../../utils/Class');
var Merge = require('../../../../utils/object/Merge');
var RenderNode = require('../RenderNode');

/**
 * @classdesc
 * A RenderNode which computes and stores the world-space quad vertices for a
 * single Stamp-like GameObject, such as a Stamp or similar object that renders
 * directly into world space without being affected by the camera transform.
 *
 * This is a modified version of the `TransformerImage` RenderNode. Unlike
 * `TransformerImage`, this node skips the camera matrix multiplication entirely,
 * meaning the resulting quad coordinates are in world space rather than
 * camera-projected screen space. This makes it suitable for objects that manage
 * their own world-to-screen positioning, such as the Stamp Game Object.
 *
 * During the `run` call, the node applies the GameObject's position, rotation,
 * scale, flip, and display origin to compute the final four corner vertices of
 * the rendered quad, storing them in the `quad` Float32Array. Vertex rounding
 * is also applied when appropriate to prevent sub-pixel rendering artefacts.
 *
 * @class TransformerStamp
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {object} [config] - The configuration object for this RenderNode.
 */
var TransformerStamp = new Class({

    Extends: RenderNode,

    initialize: function TransformerStamp (manager, config)
    {
        config = Merge(config || {}, this.defaultConfig);

        RenderNode.call(this, config.name, manager);

        /**
         * The matrix used internally to compute sprite transforms.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.TransformerStamp#_spriteMatrix
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 4.0.0
         * @private
         */
        this._spriteMatrix = new TransformMatrix();

        /**
         * A Float32Array containing the eight vertex coordinates (x, y pairs for
         * each of the four corners) of the transformed quad, written during `run`
         * and consumed by subsequent renderer nodes to draw the GameObject.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.TransformerStamp#quad
         * @type {Float32Array}
         * @since 4.0.0
         */
        this.quad = this._spriteMatrix.quad;
    },

    defaultConfig: {
        name: 'TransformerStamp',
        role: 'Transformer'
    },

    /**
     * Computes the world-space quad vertices for the given Stamp-like GameObject
     * and stores them in the `quad` Float32Array for use by subsequent render
     * nodes. The camera matrix is intentionally excluded from this calculation.
     *
     * The method resolves the frame offset and display origin into local-space
     * corner coordinates, applies horizontal and vertical flipping (adjusting
     * the offset when no custom pivot is set), then builds the sprite transform
     * matrix from the GameObject's position, rotation, and scale. The four
     * corner vertices are projected through that matrix via `setQuad` and,
     * when vertex rounding is required, each coordinate is rounded to the
     * nearest integer to avoid sub-pixel rendering artefacts.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.TransformerStamp#run
     * @since 4.0.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     * @param {Phaser.GameObjects.GameObject} gameObject - The GameObject being rendered.
     * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNode} texturerNode - The texturer node used to texture the GameObject. This contains relevant data on the dimensions of the object.
     * @param {Phaser.GameObjects.Components.TransformMatrix} [parentMatrix] - This transform matrix is defined if the game object is nested. It is unused here.
     * @param {object} [element] - The specific element within the game object. This is used for objects that consist of multiple quads. It is unused here.
     */
    run: function (drawingContext, gameObject, texturerNode, parentMatrix, element)
    {
        this.onRunBegin(drawingContext);

        var frame = texturerNode.frame;
        var uvSource = texturerNode.uvSource;

        var frameX = uvSource.x;
        var frameY = uvSource.y;

        var displayOriginX = gameObject.displayOriginX;
        var displayOriginY = gameObject.displayOriginY;

        var x = -displayOriginX + frameX;
        var y = -displayOriginY + frameY;

        var customPivot = frame.customPivot;

        var flipX = 1;
        var flipY = 1;

        if (gameObject.flipX)
        {
            if (!customPivot)
            {
                x += (-frame.realWidth + (displayOriginX * 2));
            }

            flipX = -1;
        }

        if (gameObject.flipY)
        {
            if (!customPivot)
            {
                y += (-frame.realHeight + (displayOriginY * 2));
            }

            flipY = -1;
        }

        var gx = gameObject.x;
        var gy = gameObject.y;

        var spriteMatrix = this._spriteMatrix;

        spriteMatrix.applyITRS(gx, gy, gameObject.rotation, gameObject.scaleX * flipX, gameObject.scaleY * flipY);

        // Determine whether the matrix does not rotate, scale, or skew.
        var m = spriteMatrix.matrix;
        this.onlyTranslate = m[0] === 1 && m[1] === 0 && m[2] === 0 && m[3] === 1;

        // Store the output quad.
        spriteMatrix.setQuad(
            x,
            y,
            x + texturerNode.frameWidth,
            y + texturerNode.frameHeight
        );

        // Determine whether the matrix does not rotate, scale, or skew.
        // Keyword: #OnlyTranslate
        var cmm = spriteMatrix.matrix;
        var onlyTranslate = cmm[0] === 1 && cmm[1] === 0 && cmm[2] === 0 && cmm[3] === 1;

        // Handle vertex rounding.
        if (gameObject.willRoundVertices(drawingContext.camera, onlyTranslate))
        {
            var quad = this.quad;
            quad[0] = Math.round(quad[0]);
            quad[1] = Math.round(quad[1]);
            quad[2] = Math.round(quad[2]);
            quad[3] = Math.round(quad[3]);
            quad[4] = Math.round(quad[4]);
            quad[5] = Math.round(quad[5]);
            quad[6] = Math.round(quad[6]);
            quad[7] = Math.round(quad[7]);
        }

        this.onRunEnd(drawingContext);
    }
});

module.exports = TransformerStamp;
