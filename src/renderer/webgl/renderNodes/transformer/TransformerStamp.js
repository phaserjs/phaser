/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var TransformMatrix = require('../../../../gameobjects/components/TransformMatrix.js');
var Class = require('../../../../utils/Class');
var Merge = require('../../../../utils/object/Merge');
var RenderNode = require('../RenderNode');

/**
 * @classdesc
 * A RenderNode which handles transformation data for a single Stamp-like GameObject.
 *
 * This is a modified version of the TransformerImage class.
 * It skips the camera matrix.
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
         * The matrix used to store the final quad data for rendering.
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
     * Stores the transform data for rendering.
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
