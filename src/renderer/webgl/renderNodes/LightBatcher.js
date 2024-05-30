/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var TransformMatrix = require('../../../gameobjects/components/TransformMatrix');
var Class = require('../../../utils/Class');
var Utils = require('../Utils.js');
var GameObjectBatcher = require('./GameObjectBatcher');

var getTint = Utils.getTintAppendFloatAlpha;

/**
 * @classdesc
 * A RenderNode which renders a GameObject with a Light Shader.
 *
 * @class LightBatcher
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 3.90.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.GameObjectBatcher
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {Phaser.Types.Renderer.WebGL.RenderNodes.GameObjectBatcherConfig} config - The configuration object for this RenderNode.
 */
var LightBatcher = new Class({
    Extends: GameObjectBatcher,
    initialize: function LightBatcher (manager, config)
    {
        if (config === undefined) { config = {}; }
        if (config.name === undefined)
        {
            config.name = 'LightBatcher';
        }
        if (config.batchHandler === undefined)
        {
            config.batchHandler = 'LightBatchHandler';
        }

        GameObjectBatcher.call(this, manager, config);

        /**
         * A temporary Transform Matrix used for parent Container calculations without them needing their own local copy.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.LightBatcher#_tempMatrix
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @private
         * @since 3.60.0
         */
        this._tempMatrix = new TransformMatrix();

        /**
         * A temporary Transform Matrix used for parent Container calculations without them needing their own local copy.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.LightBatcher#_tempMatrix2
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @private
         * @since 3.60.0
         */
        this._tempMatrix2 = new TransformMatrix();
    },

    /**
     * Renders a GameObject with a Light Shader.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.LightBatcher#run
     * @since 3.90.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The context currently in use.
     * @param {Phaser.GameObjects.Image} gameObject - The GameObject being rendered.
     * @param {Phaser.GameObjects.Components.TransformMatrix} [parentMatrix] - This transform matrix is defined if the game object is nested.
     */
    run: function (drawingContext, gameObject, parentMatrix)
    {
        var lightManager = drawingContext.camera.scene.sys.lights;
        if (!lightManager || !lightManager.active)
        {
            // Skip rendering if the light manager is not active.
            return;
        }

        // This function is copied from GameObjectBatcher.js,
        // except as noted.

        this.onRunBegin();

        var frame = gameObject.frame;
        var frameX = frame.x;
        var frameY = frame.y;
        var frameWidth = frame.cutWidth;
        var frameHeight = frame.cutHeight;
        var customPivot = frame.customPivot;

        var displayOriginX = gameObject.displayOriginX;
        var displayOriginY = gameObject.displayOriginY;

        // Get UVs.
        var uvSource = frame;
        if (gameObject.isCropped)
        {
            var crop = gameObject._crop;
            uvSource = crop;

            if (crop.flipX !== gameObject.flipX || crop.flipY !== gameObject.flipY)
            {
                gameObject.frame.updateCropUVs(crop, gameObject.flipX, gameObject.flipY);
            }

            // Modify the frame dimensions based on the crop.
            frameWidth = crop.width;
            frameHeight = crop.height;

            frameX = crop.x;
            frameY = crop.y;
        }
        var u0 = uvSource.u0;
        var v0 = uvSource.v0;
        var u1 = uvSource.u1;
        var v1 = uvSource.v1;
        var cameraAlpha = drawingContext.camera.alpha;

        // Get tints.
        var tintTL = getTint(gameObject.tintTopLeft, cameraAlpha * gameObject._alphaTL);
        var tintTR = getTint(gameObject.tintTopRight, cameraAlpha * gameObject._alphaTR);
        var tintBL = getTint(gameObject.tintBottomLeft, cameraAlpha * gameObject._alphaBL);
        var tintBR = getTint(gameObject.tintBottomRight, cameraAlpha * gameObject._alphaBR);

        // Get the transformed quad.
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

        var quad = calcMatrix.setQuad(x, y, x + frameWidth, y + frameHeight);

        // The following code is not copied from GameObjectBatcher.js.

        // Get normal map.
        var normalMap;
        if (gameObject.displayTexture)
        {
            normalMap = gameObject.displayTexture.dataSource[gameObject.displayFrame.sourceIndex];
        }
        else if (gameObject.texture)
        {
            normalMap = gameObject.texture.dataSource[gameObject.frame.sourceIndex];
        }
        else if (gameObject.tileset)
        {
            if (Array.isArray(gameObject.tileset))
            {
                normalMap = gameObject.tileset[0].image.dataSource[0];
            }
            else
            {
                normalMap = gameObject.tileset.image.dataSource[0];
            }
        }
        if (!normalMap)
        {
            normalMap = this.manager.renderer.normalTexture;
        }
        else
        {
            normalMap = normalMap.glTexture;
        }

        // Get normal map rotation.
        var normalMapRotation = gameObject.rotation;
        if (gameObject.parentContainer)
        {
            var matrix = gameObject.getWorldTransformMatrix(this._tempMatrix, this._tempMatrix2);
            normalMapRotation = matrix.rotationNormalized;
        }

        // Batch the quad.
        this.batchHandler.batch(
            drawingContext,

            // Use `frame.source.glTexture` instead of `frame.glTexture`
            // to avoid unnecessary getter function calls.
            frame.source.glTexture,
            normalMap,

            // Normal map rotation
            normalMapRotation,

            // Transformed quad in TRIANGLE_STRIP order:
            quad[0], quad[1],
            quad[2], quad[3],
            quad[6], quad[7],
            quad[4], quad[5],
            
            // Texture coordinates in X, Y, Width, Height:
            u0, v0, u1 - u0, v1 - v0,

            gameObject.tintFill,

            // Tint colors in TRIANGLE_STRIP order:
            tintTL, tintTR, tintBL, tintBR
        );

        this.onRunEnd();
    }
});

module.exports = LightBatcher;
