/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Felipe Alfonso <@bitnenfer>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var ShaderSourceFS = require('../shaders/ForwardDiffuse-frag.js');
var TextureTintPipeline = require('./TextureTintPipeline');

var LIGHT_COUNT = 10;

/**
 * @classdesc
 * ForwardDiffuseLightPipeline implements a forward rendering approach for 2D lights.
 * This pipeline extends TextureTintPipeline so it implements all it's rendering functions
 * and batching system.
 *
 * @class ForwardDiffuseLightPipeline
 * @extends Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline
 * @memberof Phaser.Renderer.WebGL.Pipelines
 * @constructor
 * @since 3.0.0
 *
 * @param {object} config - The configuration of the pipeline, same as the {@link Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline}. The fragment shader will be replaced with the lighting shader.
 */
var ForwardDiffuseLightPipeline = new Class({

    Extends: TextureTintPipeline,

    initialize:

    function ForwardDiffuseLightPipeline (config)
    {
        LIGHT_COUNT = config.maxLights;

        config.fragShader = ShaderSourceFS.replace('%LIGHT_COUNT%', LIGHT_COUNT.toString());

        TextureTintPipeline.call(this, config);

        /**
         * Default normal map texture to use.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.ForwardDiffuseLightPipeline#defaultNormalMap
         * @type {Phaser.Texture.Frame}
         * @private
         * @since 3.11.0
         */
        this.defaultNormalMap;

        /**
         * Inverse rotation matrix for normal map rotations.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.ForwardDiffuseLightPipeline#inverseRotationMatrix
         * @type {Float32Array}
         * @private
         * @since 3.16.0
         */
        this.inverseRotationMatrix = new Float32Array([
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ]);
    },

    /**
     * Called when the Game has fully booted and the Renderer has finished setting up.
     * 
     * By this stage all Game level systems are now in place and you can perform any final
     * tasks that the pipeline may need that relied on game systems such as the Texture Manager.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.ForwardDiffuseLightPipeline#boot
     * @override
     * @since 3.11.0
     */
    boot: function ()
    {
        this.defaultNormalMap = this.game.textures.getFrame('__DEFAULT');
    },

    /**
     * This function binds its base class resources and this lights 2D resources.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.ForwardDiffuseLightPipeline#onBind
     * @override
     * @since 3.0.0
     * 
     * @param {Phaser.GameObjects.GameObject} [gameObject] - The Game Object that invoked this pipeline, if any.
     *
     * @return {this} This WebGLPipeline instance.
     */
    onBind: function (gameObject)
    {
        TextureTintPipeline.prototype.onBind.call(this);

        var renderer = this.renderer;
        var program = this.program;

        this.mvpUpdate();

        renderer.setInt1(program, 'uNormSampler', 1);
        renderer.setFloat2(program, 'uResolution', this.width, this.height);

        if (gameObject)
        {
            this.setNormalMap(gameObject);
        }

        return this;
    },

    /**
     * This function sets all the needed resources for each camera pass.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.ForwardDiffuseLightPipeline#onRender
     * @since 3.0.0
     *
     * @param {Phaser.Scene} scene - The Scene being rendered.
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The Scene Camera being rendered with.
     *
     * @return {this} This WebGLPipeline instance.
     */
    onRender: function (scene, camera)
    {
        this.active = false;

        var lightManager = scene.sys.lights;

        if (!lightManager || lightManager.lights.length <= 0 || !lightManager.active)
        {
            //  Passthru
            return this;
        }

        var lights = lightManager.cull(camera);
        var lightCount = Math.min(lights.length, LIGHT_COUNT);

        if (lightCount === 0)
        {
            return this;
        }

        this.active = true;

        var renderer = this.renderer;
        var program = this.program;
        var cameraMatrix = camera.matrix;
        var point = {x: 0, y: 0};
        var height = renderer.height;
        var index;

        for (index = 0; index < LIGHT_COUNT; ++index)
        {
            //  Reset lights
            renderer.setFloat1(program, 'uLights[' + index + '].radius', 0);
        }

        renderer.setFloat4(program, 'uCamera', camera.x, camera.y, camera.rotation, camera.zoom);
        renderer.setFloat3(program, 'uAmbientLightColor', lightManager.ambientColor.r, lightManager.ambientColor.g, lightManager.ambientColor.b);

        for (index = 0; index < lightCount; ++index)
        {
            var light = lights[index];
            var lightName = 'uLights[' + index + '].';

            cameraMatrix.transformPoint(light.x, light.y, point);

            renderer.setFloat2(program, lightName + 'position', point.x - (camera.scrollX * light.scrollFactorX * camera.zoom), height - (point.y - (camera.scrollY * light.scrollFactorY) * camera.zoom));
            renderer.setFloat3(program, lightName + 'color', light.r, light.g, light.b);
            renderer.setFloat1(program, lightName + 'intensity', light.intensity);
            renderer.setFloat1(program, lightName + 'radius', light.radius);
        }
        
        return this;
    },

    /**
     * Generic function for batching a textured quad
     *
     * @method Phaser.Renderer.WebGL.Pipelines.ForwardDiffuseLightPipeline#batchTexture
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} gameObject - Source GameObject
     * @param {WebGLTexture} texture - Raw WebGLTexture associated with the quad
     * @param {integer} textureWidth - Real texture width
     * @param {integer} textureHeight - Real texture height
     * @param {number} srcX - X coordinate of the quad
     * @param {number} srcY - Y coordinate of the quad
     * @param {number} srcWidth - Width of the quad
     * @param {number} srcHeight - Height of the quad
     * @param {number} scaleX - X component of scale
     * @param {number} scaleY - Y component of scale
     * @param {number} rotation - Rotation of the quad
     * @param {boolean} flipX - Indicates if the quad is horizontally flipped
     * @param {boolean} flipY - Indicates if the quad is vertically flipped
     * @param {number} scrollFactorX - By which factor is the quad affected by the camera horizontal scroll
     * @param {number} scrollFactorY - By which factor is the quad effected by the camera vertical scroll
     * @param {number} displayOriginX - Horizontal origin in pixels
     * @param {number} displayOriginY - Vertical origin in pixels
     * @param {number} frameX - X coordinate of the texture frame
     * @param {number} frameY - Y coordinate of the texture frame
     * @param {number} frameWidth - Width of the texture frame
     * @param {number} frameHeight - Height of the texture frame
     * @param {integer} tintTL - Tint for top left
     * @param {integer} tintTR - Tint for top right
     * @param {integer} tintBL - Tint for bottom left
     * @param {integer} tintBR - Tint for bottom right
     * @param {number} tintEffect - The tint effect (0 for additive, 1 for replacement)
     * @param {number} uOffset - Horizontal offset on texture coordinate
     * @param {number} vOffset - Vertical offset on texture coordinate
     * @param {Phaser.Cameras.Scene2D.Camera} camera - Current used camera
     * @param {Phaser.GameObjects.Components.TransformMatrix} parentTransformMatrix - Parent container
     */
    batchTexture: function (
        gameObject,
        texture,
        textureWidth, textureHeight,
        srcX, srcY,
        srcWidth, srcHeight,
        scaleX, scaleY,
        rotation,
        flipX, flipY,
        scrollFactorX, scrollFactorY,
        displayOriginX, displayOriginY,
        frameX, frameY, frameWidth, frameHeight,
        tintTL, tintTR, tintBL, tintBR, tintEffect,
        uOffset, vOffset,
        camera,
        parentTransformMatrix)
    {
        if (!this.active)
        {
            return;
        }

        this.renderer.setPipeline(this);

        var normalTexture;

        if (gameObject.displayTexture)
        {
            normalTexture = gameObject.displayTexture.dataSource[gameObject.displayFrame.sourceIndex];
        }
        else if (gameObject.texture)
        {
            normalTexture = gameObject.texture.dataSource[gameObject.frame.sourceIndex];
        }
        else if (gameObject.tileset)
        {
            normalTexture = gameObject.tileset.image.dataSource[0];
        }

        if (!normalTexture)
        {
            console.warn('Normal map missing or invalid');
            return;
        }

        this.setTexture2D(normalTexture.glTexture, 1);
        this.setNormalMapRotation(rotation);

        var camMatrix = this._tempMatrix1;
        var spriteMatrix = this._tempMatrix2;
        var calcMatrix = this._tempMatrix3;

        var u0 = (frameX / textureWidth) + uOffset;
        var v0 = (frameY / textureHeight) + vOffset;
        var u1 = (frameX + frameWidth) / textureWidth + uOffset;
        var v1 = (frameY + frameHeight) / textureHeight + vOffset;

        var width = srcWidth;
        var height = srcHeight;

        // var x = -displayOriginX + frameX;
        // var y = -displayOriginY + frameY;

        var x = -displayOriginX;
        var y = -displayOriginY;

        if (gameObject.isCropped)
        {
            var crop = gameObject._crop;

            width = crop.width;
            height = crop.height;

            srcWidth = crop.width;
            srcHeight = crop.height;

            frameX = crop.x;
            frameY = crop.y;

            var ox = frameX;
            var oy = frameY;

            if (flipX)
            {
                ox = (frameWidth - crop.x - crop.width);
            }
    
            if (flipY && !texture.isRenderTexture)
            {
                oy = (frameHeight - crop.y - crop.height);
            }

            u0 = (ox / textureWidth) + uOffset;
            v0 = (oy / textureHeight) + vOffset;
            u1 = (ox + crop.width) / textureWidth + uOffset;
            v1 = (oy + crop.height) / textureHeight + vOffset;

            x = -displayOriginX + frameX;
            y = -displayOriginY + frameY;
        }

        //  Invert the flipY if this is a RenderTexture
        flipY = flipY ^ (texture.isRenderTexture ? 1 : 0);

        if (flipX)
        {
            width *= -1;
            x += srcWidth;
        }

        if (flipY)
        {
            height *= -1;
            y += srcHeight;
        }

        //  Do we need this? (doubt it)
        // if (camera.roundPixels)
        // {
        //     x |= 0;
        //     y |= 0;
        // }

        var xw = x + width;
        var yh = y + height;

        spriteMatrix.applyITRS(srcX, srcY, rotation, scaleX, scaleY);

        camMatrix.copyFrom(camera.matrix);

        if (parentTransformMatrix)
        {
            //  Multiply the camera by the parent matrix
            camMatrix.multiplyWithOffset(parentTransformMatrix, -camera.scrollX * scrollFactorX, -camera.scrollY * scrollFactorY);

            //  Undo the camera scroll
            spriteMatrix.e = srcX;
            spriteMatrix.f = srcY;

            //  Multiply by the Sprite matrix, store result in calcMatrix
            camMatrix.multiply(spriteMatrix, calcMatrix);
        }
        else
        {
            spriteMatrix.e -= camera.scrollX * scrollFactorX;
            spriteMatrix.f -= camera.scrollY * scrollFactorY;
    
            //  Multiply by the Sprite matrix, store result in calcMatrix
            camMatrix.multiply(spriteMatrix, calcMatrix);
        }

        var tx0 = calcMatrix.getX(x, y);
        var ty0 = calcMatrix.getY(x, y);

        var tx1 = calcMatrix.getX(x, yh);
        var ty1 = calcMatrix.getY(x, yh);

        var tx2 = calcMatrix.getX(xw, yh);
        var ty2 = calcMatrix.getY(xw, yh);

        var tx3 = calcMatrix.getX(xw, y);
        var ty3 = calcMatrix.getY(xw, y);

        if (camera.roundPixels)
        {
            tx0 = Math.round(tx0);
            ty0 = Math.round(ty0);

            tx1 = Math.round(tx1);
            ty1 = Math.round(ty1);

            tx2 = Math.round(tx2);
            ty2 = Math.round(ty2);

            tx3 = Math.round(tx3);
            ty3 = Math.round(ty3);
        }

        this.setTexture2D(texture, 0);

        this.batchQuad(tx0, ty0, tx1, ty1, tx2, ty2, tx3, ty3, u0, v0, u1, v1, tintTL, tintTR, tintBL, tintBR, tintEffect, texture, 0);
    },

    /**
     * Sets the Game Objects normal map as the active texture.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.ForwardDiffuseLightPipeline#setNormalMap
     * @since 3.11.0
     *
     * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object to update.
     */
    setNormalMap: function (gameObject)
    {
        if (!this.active || !gameObject)
        {
            return;
        }

        var normalTexture;

        if (gameObject.texture)
        {
            normalTexture = gameObject.texture.dataSource[gameObject.frame.sourceIndex];
        }

        if (!normalTexture)
        {
            normalTexture = this.defaultNormalMap;
        }

        this.setTexture2D(normalTexture.glTexture, 1);

        this.renderer.setPipeline(gameObject.defaultPipeline);
    },

    /**
     * Rotates the normal map vectors inversely by the given angle.
     * Only works in 2D space.
     * 
     * @method Phaser.Renderer.WebGL.Pipelines.ForwardDiffuseLightPipeline#setNormalMapRotation
     * @since 3.16.0
     * 
     * @param {number} rotation - The angle of rotation in radians.
     */
    setNormalMapRotation: function (rotation)
    {
        var inverseRotationMatrix = this.inverseRotationMatrix;

        if (rotation)
        {
            var rot = -rotation;
            var c = Math.cos(rot);
            var s = Math.sin(rot);

            inverseRotationMatrix[1] = s;
            inverseRotationMatrix[3] = -s;
            inverseRotationMatrix[0] = inverseRotationMatrix[4] = c;
        }
        else
        {
            inverseRotationMatrix[0] = inverseRotationMatrix[4] = 1;
            inverseRotationMatrix[1] = inverseRotationMatrix[3] = 0;
        }

        this.renderer.setMatrix3(this.program, 'uInverseRotationMatrix', false, inverseRotationMatrix);
    },

    /**
     * Takes a Sprite Game Object, or any object that extends it, which has a normal texture and adds it to the batch.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.ForwardDiffuseLightPipeline#batchSprite
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Sprite} sprite - The texture-based Game Object to add to the batch.
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to use for the rendering transform.
     * @param {Phaser.GameObjects.Components.TransformMatrix} parentTransformMatrix - The transform matrix of the parent container, if set.
     */
    batchSprite: function (sprite, camera, parentTransformMatrix)
    {
        if (!this.active)
        {
            return;
        }

        var normalTexture = sprite.texture.dataSource[sprite.frame.sourceIndex];

        if (normalTexture)
        {
            this.renderer.setPipeline(this);

            this.setTexture2D(normalTexture.glTexture, 1);
            this.setNormalMapRotation(sprite.rotation);

            TextureTintPipeline.prototype.batchSprite.call(this, sprite, camera, parentTransformMatrix);
        }
    }

});

ForwardDiffuseLightPipeline.LIGHT_COUNT = LIGHT_COUNT;

module.exports = ForwardDiffuseLightPipeline;
