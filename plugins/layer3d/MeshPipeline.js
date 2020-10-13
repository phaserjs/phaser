/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var GetFastValue = require('../../../utils/object/GetFastValue');
var ShaderSourceFS = require('../shaders/Mesh-frag.js');
var ShaderSourceVS = require('../shaders/Mesh-vert.js');
var WebGLPipeline = require('../WebGLPipeline');

/**
 * @classdesc
 * TODO
 *
 * @class MeshPipeline
 * @extends Phaser.Renderer.WebGL.WebGLPipeline
 * @memberof Phaser.Renderer.WebGL.Pipelines
 * @constructor
 * @since 3.50.0
 *
 * @param {Phaser.Types.Renderer.WebGL.WebGLPipelineConfig} config - The configuration options for this pipeline.
 */
var MeshPipeline = new Class({

    Extends: WebGLPipeline,

    initialize:

    function MeshPipeline (config)
    {
        var gl = config.game.renderer.gl;

        config.fragShader = GetFastValue(config, 'fragShader', ShaderSourceFS),
        config.vertShader = GetFastValue(config, 'vertShader', ShaderSourceVS),
        config.vertexCapacity = GetFastValue(config, 'vertexCapacity', 8),
        config.vertexSize = GetFastValue(config, 'vertexSize', 32),
        config.attributes = GetFastValue(config, 'attributes', [
            {
                name: 'aVertexPosition',
                size: 3,
                type: gl.FLOAT,
                normalized: false,
                offset: 0,
                enabled: false,
                location: -1
            },
            {
                name: 'aVertexNormal',
                size: 3,
                type: gl.FLOAT,
                normalized: false,
                offset: 12,
                enabled: false,
                location: -1
            },
            {
                name: 'aTextureCoord',
                size: 2,
                type: gl.FLOAT,
                normalized: false,
                offset: 24,
                enabled: false,
                location: -1
            }
        ]);
        config.uniforms = GetFastValue(config, 'uniforms', [
            'uViewProjectionMatrix',
            'uLightPosition',
            'uLightAmbient',
            'uLightDiffuse',
            'uLightSpecular',
            'uCameraPosition',
            'uFogColor',
            'uFogNear',
            'uFogFar',
            'uModelMatrix',
            'uNormalMatrix',
            'uMaterialAmbient',
            'uMaterialDiffuse',
            'uMaterialSpecular',
            'uMaterialShine',
            'uTexture'
        ]);

        WebGLPipeline.call(this, config);

        this.forceZero = true;

        //  Cache structure:

        //  0 fog near
        //  1 fog far
        //  2, 3, 4 model material ambient
        //  5, 6, 7 model material diffuse
        //  8, 9, 10 model material specular
        //  11 model material shine

        this.dirtyCache = [
            -1,
            -1,
            -1, -1, -1,
            -1, -1, -1,
            -1, -1, -1,
            -1
        ];

        this.cullMode = 1029;
    },

    /**
     * Called every time the pipeline is bound by the renderer.
     * Sets the shader program, vertex buffer and other resources.
     * Should only be called when changing pipeline.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.MeshPipeline#bind
     * @since 3.50.0
     *
     * @param {boolean} [reset=false] - Should the pipeline be fully re-bound after a renderer pipeline clear?
     *
     * @return {this} This WebGLPipeline instance.
     */
    bind: function (reset)
    {
        if (reset === undefined) { reset = false; }

        WebGLPipeline.prototype.bind.call(this, reset);

        var gl = this.gl;

        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);

        return this;
    },

    /**
     * This method is called every time a Game Object asks the Pipeline Manager to use this pipeline.
     *
     * Unlike the `bind` method, which is only called once per frame, this is called for every object
     * that requests it, allowing you to perform per-object GL set-up.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.MeshPipeline#onBind
     * @since 3.50.0
     *
     * @param {Phaser.GameObjects.Mesh} mesh - The Mesh that requested this pipeline.
     *
     * @return {this} This WebGLPipeline instance.
     */
    onBind: function (mesh)
    {
        var camera = mesh.camera;

        if (camera.dirtyView || camera.dirtyProjection)
        {
            this.setMatrix4fv('uViewProjectionMatrix', false, camera.viewProjectionMatrix.val);

            this.set3f('uCameraPosition', camera.x, camera.y, camera.z);
        }

        var light = mesh.light;

        if (light.isDirty())
        {
            this.set3f('uLightPosition', light.x, light.y, light.z);
        }

        var ambient = light.ambient;
        var diffuse = light.diffuse;
        var specular = light.specular;

        if (ambient.dirty)
        {
            this.set3f('uLightAmbient', ambient.r, ambient.g, ambient.b);
        }

        if (diffuse.dirty)
        {
            this.set3f('uLightDiffuse', diffuse.r, diffuse.g, diffuse.b);
        }

        if (specular.dirty)
        {
            this.set3f('uLightSpecular', specular.r, specular.g, specular.b);
        }

        var fogColor = mesh.fogColor;

        if (fogColor.dirty)
        {
            this.set3f('uFogColor', fogColor.r, fogColor.g, fogColor.b);
        }

        var cache = this.dirtyCache;
        var fogNear = mesh.fogNear;
        var fogFar = mesh.fogFar;

        if (cache[0] !== fogNear)
        {
            this.set1f('uFogNear', fogNear);

            cache[0] = fogNear;
        }

        if (cache[1] !== fogFar)
        {
            this.set1f('uFogFar', fogFar);

            cache[1] = fogFar;
        }

        this.set1i('uTexture', 0);
    },

    drawModel: function (mesh, model)
    {
        var cache = this.dirtyCache;

        this.setMatrix4fv('uModelMatrix', false, model.transformMatrix.val);
        this.setMatrix4fv('uNormalMatrix', false, model.normalMatrix.val);

        var ambient = model.ambient;

        if (!ambient.equals(cache[2], cache[3], cache[4]))
        {
            this.set3f('uMaterialAmbient', ambient.r, ambient.g, ambient.b);

            cache[2] = ambient.r;
            cache[3] = ambient.g;
            cache[4] = ambient.b;
        }

        var diffuse = model.diffuse;

        if (!diffuse.equals(cache[5], cache[6], cache[7]))
        {
            this.set3f('uMaterialDiffuse', diffuse.r, diffuse.g, diffuse.b);

            cache[5] = diffuse.r;
            cache[6] = diffuse.g;
            cache[7] = diffuse.b;
        }

        var specular = model.specular;

        if (!specular.equals(cache[8], cache[9], cache[10]))
        {
            this.set3f('uMaterialSpecular', specular.r, specular.g, specular.b);

            cache[8] = specular.r;
            cache[9] = specular.g;
            cache[10] = specular.b;
        }

        var shine = model.shine;

        if (!shine !== cache[11])
        {
            this.set1f('uMaterialShine', shine);

            cache[11] = specular.b;
        }

        this.renderer.setTextureZero(model.frame.glTexture);

        //  All the uniforms are finally bound, so let's buffer our data
        var gl = this.gl;

        var cullMode = model.cullMode;

        if (cullMode !== this.cullMode)
        {
            this.cullMode = cullMode;

            gl.cullFace(cullMode);
        }

        //  STATIC because the buffer data doesn't change, the uniforms do
        gl.bufferData(gl.ARRAY_BUFFER, model.vertexData, gl.STATIC_DRAW);

        gl.drawArrays(this.topology, 0, model.vertexCount);
    }

});

module.exports = MeshPipeline;
