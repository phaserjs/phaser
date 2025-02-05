/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var TransformMatrix = require('../../../../gameobjects/components/TransformMatrix.js');
var Class = require('../../../../utils/Class');
var Merge = require('../../../../utils/object/Merge');
var RenderNode = require('../RenderNode');

/**
 * @classdesc
 * A RenderNode which handles transformation data for a single Image-like GameObject.
 *
 * @class TransformerImage
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {object} [config] - The configuration object for this RenderNode.
 */
var TransformerImage = new Class({
    Extends: RenderNode,

    initialize: function TransformerImage (manager, config)
    {
        config = Merge(config || {}, this.defaultConfig);

        RenderNode.call(this, config.name, manager);

        /**
         * The matrix used to store the final quad data for rendering.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.TransformerImage#quad
         * @type {Float32Array}
         * @since 4.0.0
         */
        this.quad = new Float32Array(8);

        /**
         * Whether the transform only translates.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.TransformerImage#onlyTranslate
         * @type {boolean}
         * @since 4.0.0
         */
        this.onlyTranslate = false;

        /**
         * The matrix used internally to compute camera transforms.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.TransformerImage#_camMatrix
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 4.0.0
         * @private
         */
        this._camMatrix = new TransformMatrix();

        /**
         * The matrix used internally to compute sprite transforms.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.TransformerImage#_spriteMatrix
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 4.0.0
         * @private
         */
        this._spriteMatrix = new TransformMatrix();

        /**
         * The matrix used internally to compute the final transform.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.TransformerImage#_calcMatrix
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 4.0.0
         * @private
         */
        this._calcMatrix = new TransformMatrix();
    },

    defaultConfig: {
        name: 'TransformerImage',
        role: 'Transformer'
    },

    /**
     * Stores the transform data for rendering.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.TransformerImage#run
     * @since 4.0.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     * @param {Phaser.GameObjects.GameObject} gameObject - The GameObject being rendered.
     * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNode} texturerNode - The texturer node used to texture the GameObject. This contains relevant data on the dimensions of the object.
     * @param {Phaser.GameObjects.Components.TransformMatrix} [parentMatrix] - This transform matrix is defined if the game object is nested.
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

        var camera = drawingContext.camera;
        var calcMatrix = this._calcMatrix;
        var camMatrix = this._camMatrix;
        var spriteMatrix = this._spriteMatrix;

        spriteMatrix.applyITRS(gx, gy, gameObject.rotation, gameObject.scaleX * flipX, gameObject.scaleY * flipY);

        if (parentMatrix)
        {
            //  Multiply the camera by the parent matrix
            camMatrix.copyFrom(camera.matrix);
            camMatrix.multiplyWithOffset(parentMatrix, -camera.scrollX * gameObject.scrollFactorX, -camera.scrollY * gameObject.scrollFactorY);
        }
        else
        {
            // camMatrix will not be mutated after this point, so we just take a reference.
            camMatrix = camera.matrix;
            spriteMatrix.e -= camera.scrollX * gameObject.scrollFactorX;
            spriteMatrix.f -= camera.scrollY * gameObject.scrollFactorY;
        }

        // Multiply by the Sprite matrix, store result in calcMatrix
        camMatrix.multiply(spriteMatrix, calcMatrix);

        // Determine whether the matrix does not rotate, scale, or skew.
        var cmm = calcMatrix.matrix;
        this.onlyTranslate = cmm[0] === 1 && cmm[1] === 0 && cmm[2] === 0 && cmm[3] === 1;

        // Store the output quad.
        calcMatrix.setQuad(
            x,
            y,
            x + texturerNode.frameWidth,
            y + texturerNode.frameHeight,
            this.quad
        );

        this.onRunEnd(drawingContext);
    }
});

module.exports = TransformerImage;
