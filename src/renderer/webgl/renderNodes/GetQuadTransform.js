/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var TransformMatrix = require('../../../gameobjects/components/TransformMatrix.js');
var Class = require('../../../utils/Class');
var RenderNode = require('./RenderNode');

/**
 * @classdesc
 * A RenderNode which computes a 2D matrix transform for a quad.
 * This matrix will transform a base quad covering ((0,0), (1,1))
 * to cover the game object's screen region.
 *
 * @class GetQuadTransform
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 3.90.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The renderer that owns this RenderNode.
 */
var GetQuadTransform = new Class({
    Extends: RenderNode,

    initialize: function GetQuadTransform (manager, renderer)
    {
        RenderNode.call(this, 'GetQuadTransform', manager, renderer);

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
         * @name Phaser.Renderer.WebGL.RenderNodes.Single#_spriteMatrix
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.90.0
         * @private
         */
        this._spriteMatrix = new TransformMatrix();

        /**
         * The matrix used internally to compute the final transform.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.Single#_calcMatrix
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.90.0
         * @private
         */
        this._calcMatrix = new TransformMatrix();
    },

    /**
     * Compute a 2D matrix transform for a quad.
     *
     * The return value is an object held by this node,
     * so be sure to copy it if you need it later.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.GetQuadTransform#run
     * @since 3.90.0
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera to use for the transformation.
     * @param {Phaser.GameObjects.GameObject} gameObject - The game object to transform.
     * @param {Phaser.GameObjects.Components.TransformMatrix} [parentTransformMatrix] - The parent matrix to apply, if any.
     * @return {Phaser.GameObjects.Components.TransformMatrix} The computed transform matrix.
     */
    run: function (gameObject, camera, parentTransformMatrix)
    {
        var camMatrix = this._camMatrix;
        var spriteMatrix = this._spriteMatrix;
        var calcMatrix = this._calcMatrix;

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

            // // TODO: This is repeated in Single; can it be eliminated?
            // // I think so: I've put it in the GameObject renderWebGL method.
            // if (crop.flipX !== gameObject.flipX || crop.flipY !== gameObject.flipY)
            // {
            //     frame.updateCropUVs(crop, gameObject.flipX, gameObject.flipY);
            // }

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

        // spriteMatrix.applyITRS(gx, gy, gameObject.rotation, gameObject.scaleX * flipX, gameObject.scaleY * flipY);
        // spriteMatrix.applyITRS(
        //     gx + x,
        //     gy + y,
        //     gameObject.rotation,
        //     frameWidth * gameObject.scaleX * flipX,
        //     frameHeight * gameObject.scaleY * flipY
        // );
        spriteMatrix.applyITRS(
            x,
            y,
            0,
            frameWidth,
            frameHeight
        );

        var newMatrix = new TransformMatrix();
        newMatrix.applyITRS(gx, gy, gameObject.rotation, gameObject.scaleX * flipX, gameObject.scaleY * flipY);
        newMatrix.multiply(spriteMatrix);
        spriteMatrix.copyFrom(newMatrix);
        // TODO: That's very complex, but it gets the right result. Can we simplify the matrix concatenation?

        if (parentTransformMatrix)
        {
            //  Multiply the camera by the parent matrix
            camMatrix.copyFrom(camera.matrix);
            camMatrix.multiplyWithOffset(parentTransformMatrix, -camera.scrollX * gameObject.scrollFactorX, -camera.scrollY * gameObject.scrollFactorY);

            //  Undo the camera scroll
            spriteMatrix.e = gx;
            spriteMatrix.f = gy;
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

        return calcMatrix;

        // var quad = calcMatrix.setQuad(x, y, x + frameWidth, y + frameHeight);

        // return quad;
    }
});

module.exports = GetQuadTransform;
