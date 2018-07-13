/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Felipe Alfonso <@bitnenfer>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
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
 * @memberOf Phaser.Renderer.WebGL.Pipelines
 * @constructor
 * @since 3.0.0
 *
 * @param {object} config - [description]
 */
var ForwardDiffuseLightPipeline = new Class({

    Extends: TextureTintPipeline,

    initialize:

    function ForwardDiffuseLightPipeline (config)
    {
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
     * @return {Phaser.Renderer.WebGL.Pipelines.ForwardDiffuseLightPipeline} [description]
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
     * @param {Phaser.Scene} scene - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     *
     * @return {Phaser.Renderer.WebGL.Pipelines.ForwardDiffuseLightPipeline} [description]
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
     * @method Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline#batchTexture
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

        if (gameObject.texture)
        {
            normalTexture = gameObject.texture.dataSource[gameObject.frame.sourceIndex];
        }
        else if (gameObject.tileset)
        {
            normalTexture = gameObject.tileset.image.dataSource[0];
        }

        if (!normalTexture)
        {
            normalTexture = this.defaultNormalMap;
        }

        this.setTexture2D(normalTexture.glTexture, 1);

        var camMatrix = this._tempMatrix1;
        var spriteMatrix = this._tempMatrix2;
        var calcMatrix = this._tempMatrix3;

        var width = srcWidth;
        var height = srcHeight;

        var x = -displayOriginX;
        var y = -displayOriginY;

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

        if (camera.roundPixels)
        {
            x |= 0;
            y |= 0;
        }

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

        var tx0 = x * calcMatrix.a + y * calcMatrix.c + calcMatrix.e;
        var ty0 = x * calcMatrix.b + y * calcMatrix.d + calcMatrix.f;

        var tx1 = x * calcMatrix.a + yh * calcMatrix.c + calcMatrix.e;
        var ty1 = x * calcMatrix.b + yh * calcMatrix.d + calcMatrix.f;

        var tx2 = xw * calcMatrix.a + yh * calcMatrix.c + calcMatrix.e;
        var ty2 = xw * calcMatrix.b + yh * calcMatrix.d + calcMatrix.f;

        var tx3 = xw * calcMatrix.a + y * calcMatrix.c + calcMatrix.e;
        var ty3 = xw * calcMatrix.b + y * calcMatrix.d + calcMatrix.f;

        if (camera.roundPixels)
        {
            tx0 |= 0;
            ty0 |= 0;

            tx1 |= 0;
            ty1 |= 0;

            tx2 |= 0;
            ty2 |= 0;

            tx3 |= 0;
            ty3 |= 0;
        }

        var u0 = (frameX / textureWidth) + uOffset;
        var v0 = (frameY / textureHeight) + vOffset;
        var u1 = (frameX + frameWidth) / textureWidth + uOffset;
        var v1 = (frameY + frameHeight) / textureHeight + vOffset;

        this.setTexture2D(texture, 0);

        this.batchVertices(tx0, ty0, tx1, ty1, tx2, ty2, tx3, ty3, u0, v0, u1, v1, tintTL, tintTR, tintBL, tintBR, tintEffect);
    },

    /**
     * Sets the Game Objects normal map as the active texture.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.ForwardDiffuseLightPipeline#setNormalMap
     * @since 3.11.0
     *
     * @param {Phaser.GameObjects.GameObject} gameObject - [description]
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
     * [description]
     *
     * @method Phaser.Renderer.WebGL.Pipelines.ForwardDiffuseLightPipeline#batchSprite
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Sprite} sprite - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     * @param {Phaser.GameObjects.Components.TransformMatrix} parentTransformMatrix - [description]
     *
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

            TextureTintPipeline.prototype.batchSprite.call(this, sprite, camera, parentTransformMatrix);
        }
    }

});

ForwardDiffuseLightPipeline.LIGHT_COUNT = LIGHT_COUNT;

module.exports = ForwardDiffuseLightPipeline;
