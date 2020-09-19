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
        config.vertexCapacity = GetFastValue(config, 'vertexCapacity', 2048 * 8),
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

        WebGLPipeline.call(this, config);

        /**
         * Float32 view of the array buffer containing the pipeline's vertices.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.MeshPipeline#vertexViewF32
         * @type {Float32Array}
         * @since 3.0.0
         */
        this.vertexViewF32 = new Float32Array(this.vertexData);

        this.forceZero = true;
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
        var program = this.program;
        var renderer = this.renderer;

        var camera = mesh.camera;
        var light = mesh.light;

        renderer.setMatrix4(program, 'uViewProjectionMatrix', false, camera.viewProjectionMatrix.val);

        renderer.setFloat3(program, 'uLightPosition', light.x, light.y, light.z);
        renderer.setFloat3(program, 'uLightAmbient', light.ambient.x, light.ambient.y, light.ambient.z);
        renderer.setFloat3(program, 'uLightDiffuse', light.diffuse.x, light.diffuse.y, light.diffuse.z);
        renderer.setFloat3(program, 'uLightSpecular', light.specular.x, light.specular.y, light.specular.z);
        renderer.setFloat3(program, 'uCameraPosition', camera.x, camera.y, camera.z);
    },

    drawModel: function (mesh, model)
    {
        var program = this.program;
        var renderer = this.renderer;

        renderer.setMatrix4(program, 'uModelMatrix', false, model.transformMatrix.val);
        renderer.setMatrix4(program, 'uNormalMatrix', false, model.normalMatrix.val);

        renderer.setFloat3(program, 'uMaterialAmbient', model.ambient.x, model.ambient.y, model.ambient.z);
        renderer.setFloat3(program, 'uMaterialDiffuse', model.diffuse.x, model.diffuse.y, model.diffuse.z);
        renderer.setFloat3(program, 'uMaterialSpecular', model.specular.x, model.specular.y, model.specular.z);
        renderer.setFloat1(program, 'uMaterialShine', model.shine);

        renderer.setTextureZero(model.frame.glTexture);
        renderer.setInt1(program, 'uTexture', 0);

        //  All the uniforms are finally bound, so now lets draw our faces!

        var vertexViewF32 = this.vertexViewF32;

        var vertices = model.vertices;

        for (var i = 0; i < vertices.length; i++)
        {
            if (this.shouldFlush(1))
            {
                this.flush();
            }

            var vertexOffset = (this.vertexCount * this.vertexComponentCount) - 1;

            var vert = vertices[i];

            vertexViewF32[++vertexOffset] = vert.x;
            vertexViewF32[++vertexOffset] = vert.y;
            vertexViewF32[++vertexOffset] = vert.z;
            vertexViewF32[++vertexOffset] = vert.nx;
            vertexViewF32[++vertexOffset] = vert.ny;
            vertexViewF32[++vertexOffset] = vert.nz;
            vertexViewF32[++vertexOffset] = vert.u;
            vertexViewF32[++vertexOffset] = vert.v;

            this.vertexCount++;
        }

        this.flush();
    }

});

module.exports = MeshPipeline;
