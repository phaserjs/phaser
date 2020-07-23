/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Felipe Alfonso <@bitnenfer>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var ShaderSourceFS = require('../shaders/ForwardDiffuse-frag.js');
var TextureTintPipeline = require('./TextureTintPipeline');
var WebGLPipeline = require('../WebGLPipeline');

var LIGHT_COUNT = 10;

/**
 * @classdesc
 * ForwardDiffuseLightPipeline implements a forward rendering approach for 2D lights.
 *
 * It works by using a custom shader, combined with Light Game Objects, that provides an ambient
 * illumination effect in your games.
 *
 * This pipeline extends TextureTintPipeline so it implements all of its rendering functions and batching system.
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

        /**
         * Stores a default normal map, which is an object with a `glTexture` property that
         * maps to a 1x1 texture of the color #7f7fff created in the `boot` method.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.ForwardDiffuseLightPipeline#defaultNormalMap
         * @type {object}
         * @since 3.25.0
         */
        this.defaultNormalMap;

        /**
         * Stores the previous number of lights rendered.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.ForwardDiffuseLightPipeline#lightCount
         * @type {number}
         * @since 3.25.0
         */
        this.lightCount = 0;

        this.forceZero = true;
    },

    /**
     * Called when the Game has fully booted and the Renderer has finished setting up.
     *
     * By this stage all Game level systems are now in place and you can perform any final
     * tasks that the pipeline may need that relied on game systems such as the Texture Manager.
     *
     * @method Phaser.Renderer.WebGL.ForwardDiffuseLightPipeline#boot
     * @since 3.11.0
     */
    boot: function ()
    {
        WebGLPipeline.prototype.boot.call(this);

        var gl = this.gl;

        var tempTexture = gl.createTexture();

        gl.activeTexture(gl.TEXTURE0);

        gl.bindTexture(gl.TEXTURE_2D, tempTexture);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([ 127, 127, 255, 255 ]));

        this.defaultNormalMap = { glTexture: tempTexture };

        return this;
    },

    /**
     * Called every time the pipeline is bound by the renderer.
     * Sets the shader program, vertex buffer and other resources.
     * Should only be called when changing pipeline.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.ForwardDiffuseLightPipeline#bind
     * @since 3.25.0
     *
     * @return {this} This WebGLPipeline instance.
     */
    bind: function ()
    {
        WebGLPipeline.prototype.bind.call(this);

        var renderer = this.renderer;
        var program = this.program;

        renderer.setInt1(program, 'uMainSampler', 0);
        renderer.setInt1(program, 'uNormSampler', 1);
        renderer.setFloat2(program, 'uResolution', this.width, this.height);

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
        var i;

        if (lightCount !== this.lightCount)
        {
            for (i = 0; i < LIGHT_COUNT; i++)
            {
                //  Reset lights
                renderer.setFloat1(program, 'uLights[' + i + '].radius', 0);
            }

            this.lightCount = lightCount;
        }

        if (camera.dirty)
        {
            renderer.setFloat4(program, 'uCamera', camera.x, camera.y, camera.rotation, camera.zoom);
        }

        //  TODO - Only if dirty! and cache the location
        renderer.setFloat3(program, 'uAmbientLightColor', lightManager.ambientColor.r, lightManager.ambientColor.g, lightManager.ambientColor.b);

        for (i = 0; i < lightCount; i++)
        {
            var light = lights[i];
            var lightName = 'uLights[' + i + '].';

            cameraMatrix.transformPoint(light.x, light.y, point);

            //  TODO - Cache the uniform locations!!!
            renderer.setFloat2(program, lightName + 'position', point.x - (camera.scrollX * light.scrollFactorX * camera.zoom), height - (point.y - (camera.scrollY * light.scrollFactorY) * camera.zoom));

            if (light.dirty)
            {
                renderer.setFloat3(program, lightName + 'color', light.r, light.g, light.b);
                renderer.setFloat1(program, lightName + 'intensity', light.intensity);
                renderer.setFloat1(program, lightName + 'radius', light.radius);
                light.dirty = false;
            }
        }

        this.currentNormalMapRotation = null;

        return this;
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
        if (rotation !== this.currentNormalMapRotation || this.vertexCount === 0)
        {
            if (this.vertexCount > 0)
            {
                this.flush();
            }

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

            this.currentNormalMapRotation = rotation;
        }
    },

    /**
     * Assigns a texture to the current batch. If a different texture is already set it creates a new batch object.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.ForwardDiffuseLightPipeline#setTexture2D
     * @since 3.25.0
     *
     * @param {WebGLTexture} [texture] - WebGLTexture that will be assigned to the current batch. If not given uses blankTexture.
     * @param {Phaser.GameObjects.GameObject} [gameObject] - The Game Object being rendered or added to the batch.
     */
    setTexture2D: function (texture, gameObject)
    {
        var renderer = this.renderer;

        if (texture === undefined) { texture = renderer.tempTextures[0]; }

        var normalTexture = this.getNormalMap(gameObject);

        if (renderer.isNewNormalMap())
        {
            this.flush();

            renderer.setTextureZero(texture);
            renderer.setNormalMap(normalTexture);
        }

        var rotation = (gameObject) ? gameObject.rotation : 0;

        this.setNormalMapRotation(rotation);

        this.currentUnit = 0;

        return 0;
    },

    /**
     * Custom pipelines can use this method in order to perform any required pre-batch tasks
     * for the given Game Object. It must return the texture unit the Game Object was assigned.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.ForwardDiffuseLightPipeline#setGameObject
     * @since 3.25.0
     *
     * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object being rendered or added to the batch.
     * @param {Phaser.Textures.Frame} [frame] - Optional frame to use. Can override that of the Game Object.
     *
     * @return {number} The texture unit the Game Object has been assigned.
     */
    setGameObject: function (gameObject, frame)
    {
        if (frame === undefined) { frame = gameObject.frame; }

        var renderer = this.renderer;
        var texture = frame.glTexture;
        var normalTexture = this.getNormalMap(gameObject);

        if (renderer.isNewNormalMap())
        {
            this.flush();

            renderer.setTextureZero(texture);
            renderer.setNormalMap(normalTexture);
        }

        this.setNormalMapRotation(gameObject.rotation);

        this.currentUnit = 0;

        return 0;
    },

    /**
     * Returns the normal map WebGLTexture from the given Game Object.
     * If the Game Object doesn't have one, it returns the default normal map from this pipeline instead.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.ForwardDiffuseLightPipeline#getNormalMap
     * @since 3.25.0
     *
     * @param {Phaser.GameObjects.GameObject} [gameObject] - The Game Object to get the normal map from.
     *
     * @return {WebGLTexture} The normal map texture.
     */
    getNormalMap: function (gameObject)
    {
        var normalTexture;

        if (!gameObject)
        {
            normalTexture = this.defaultNormalMap;
        }
        else if (gameObject.displayTexture)
        {
            normalTexture = gameObject.displayTexture.dataSource[gameObject.displayFrame.sourceIndex];
        }
        else if (gameObject.texture)
        {
            normalTexture = gameObject.texture.dataSource[gameObject.frame.sourceIndex];
        }
        else if (gameObject.tileset)
        {
            if (Array.isArray(gameObject.tileset))
            {
                normalTexture = gameObject.tileset[0].image.dataSource[0];
            }
            else
            {
                normalTexture = gameObject.tileset.image.dataSource[0];
            }
        }

        if (!normalTexture)
        {
            normalTexture = this.defaultNormalMap;
        }

        return normalTexture.glTexture;
    }

});

ForwardDiffuseLightPipeline.LIGHT_COUNT = LIGHT_COUNT;

module.exports = ForwardDiffuseLightPipeline;
