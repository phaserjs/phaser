/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var TransformMatrix = require('../../../gameobjects/components/TransformMatrix.js');
var Class = require('../../../utils/Class.js');
var RenderNode = require('./RenderNode.js');

/**
 * @classdesc
 * A RenderNode which computes 2D matrix transforms for a quad.
 * 
 * The three matrices returned are:
 *
 * - objectMatrix: The matrix used to transform the object from a 1x1 quad to its screen region.
 * - worldMatrix: The matrix used to transform the object from its local space to world space.
 * - viewMatrix: The matrix used to transform the object from world space to camera space.
 *
 * @class GetSBRQuadMatrices
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 3.90.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The renderer that owns this RenderNode.
 */
var GetSBRQuadMatrices = new Class({
    Extends: RenderNode,

    initialize: function GetSBRQuadMatrices (manager, renderer)
    {
        RenderNode.call(this, 'GetSBRQuadMatrices', manager, renderer);

        /**
         * The matrix used internally to compute camera transforms.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.Single#_camMatrix
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.90.0
         * @private
         */
        this._camMatrix = new TransformMatrix();

        /**
         * The matrix used internally to compute sprite transforms.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.Single#_objectMatrix
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.90.0
         * @private
         */
        this._objectMatrix = new TransformMatrix();

        /**
         * The matrix used internally to compute the final transform.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.Single#_worldMatrix
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.90.0
         * @private
         */
        this._worldMatrix = new TransformMatrix();

        /**
         * The matrices computed by this node. This is a reference to
         * the internal matrices. It is the return value of the run method.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.Single#_matrices
         * @type {{
         *   objectMatrix: Phaser.GameObjects.Components.TransformMatrix,
         *   worldMatrix: Phaser.GameObjects.Components.TransformMatrix,
         *   camMatrix: Phaser.GameObjects.Components.TransformMatrix
         * }}
         * @since 3.90.0
         * @private
         */
        this._matrices = {
            objectMatrix: this._objectMatrix,
            worldMatrix: this._worldMatrix,
            camMatrix: this._camMatrix
        };
    },

    /**
     * Compute the 2D matrix transforms for a quad.
     *
     * The return value is an object held by this node,
     * so be sure to copy it if you need it later.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.GetSBRQuadMatrices#run
     * @since 3.90.0
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera to use for the transformation.
     * @param {Phaser.GameObjects.GameObject} gameObject - The game object to transform.
     * @param {Phaser.GameObjects.Components.TransformMatrix} [parentTransformMatrix] - The parent matrix to apply, if any.
     * @return {{
     *   objectMatrix: Phaser.GameObjects.Components.TransformMatrix,
     *   worldMatrix: Phaser.GameObjects.Components.TransformMatrix,
     *   camMatrix: Phaser.GameObjects.Components.TransformMatrix
     * }} The computed transform matrices.
     */
    run: function (gameObject, camera, parentTransformMatrix)
    {
        var camMatrix = this._camMatrix;
        var objectMatrix = this._objectMatrix;
        var worldMatrix = this._worldMatrix;

        var frame = gameObject.frame;
        var frameX = frame.x;
        var frameY = frame.y;
        var frameWidth = frame.cutWidth;
        var frameHeight = frame.cutHeight;
        var customPivot = frame.customPivot;

        var displayOriginX = gameObject.displayOriginX;
        var displayOriginY = gameObject.displayOriginY;

        if (gameObject.isCropped)
        {
            var crop = gameObject._crop;

            frameWidth = crop.width;
            frameHeight = crop.height;

            frameX = crop.x;
            frameY = crop.y;
        }

        var x = -displayOriginX + frameX;
        var y = -displayOriginY + frameY;

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

        objectMatrix.applyITRS(
            x,
            y,
            0,
            frameWidth,
            frameHeight
        );

        worldMatrix.applyITRS(
            gx,
            gy,
            gameObject.rotation,
            gameObject.scaleX * flipX,
            gameObject.scaleY * flipY
        );

        if (parentTransformMatrix)
        {
            //  Multiply the camera by the parent matrix
            camMatrix.copyFrom(camera.matrix);
            camMatrix.multiplyWithOffset(parentTransformMatrix, -camera.scrollX * gameObject.scrollFactorX, -camera.scrollY * gameObject.scrollFactorY);

            //  Undo the camera scroll
            worldMatrix.e = gx;
            worldMatrix.f = gy;

            return this._matrices;
        }
        else
        {
            // camMatrix will not be mutated after this point, so we just take a reference.
            camMatrix = camera.matrix;
            worldMatrix.e -= camera.scrollX * gameObject.scrollFactorX;
            worldMatrix.f -= camera.scrollY * gameObject.scrollFactorY;

            return {
                objectMatrix: objectMatrix,
                worldMatrix: worldMatrix,
                camMatrix: camMatrix
            };
        }
    }
});

module.exports = GetSBRQuadMatrices;
