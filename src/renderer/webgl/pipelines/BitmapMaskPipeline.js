/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Felipe Alfonso <@bitnenfer>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../../utils/Class');
var ShaderSourceFS = require('../shaders/BitmapMask-frag.js');
var ShaderSourceVS = require('../shaders/BitmapMask-vert.js');
var WebGLPipeline = require('../WebGLPipeline');

/**
 * @classdesc
 * BitmapMaskPipeline handles all bitmap masking rendering in WebGL. It works by using 
 * sampling two texture on the fragment shader and using the fragment's alpha to clip the region.
 * The config properties are:
 * - game: Current game instance.
 * - renderer: Current WebGL renderer.
 * - topology: This indicates how the primitives are rendered. The default value is GL_TRIANGLES.
 *              Here is the full list of rendering primitives (https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants).
 * - vertShader: Source for vertex shader as a string.
 * - fragShader: Source for fragment shader as a string.
 * - vertexCapacity: The amount of vertices that shall be allocated
 * - vertexSize: The size of a single vertex in bytes.
 *
 * @class BitmapMaskPipeline
 * @extends Phaser.Renderer.WebGL.WebGLPipeline
 * @memberOf Phaser.Renderer.WebGL.Pipelines
 * @constructor
 * @since 3.0.0
 *
 * @param {object} config - Used for overriding shader an pipeline properties if extending this pipeline.
 */
var BitmapMaskPipeline = new Class({

    Extends: WebGLPipeline,
    
    initialize:

    function BitmapMaskPipeline (config)
    {
        WebGLPipeline.call(this, {
            game: config.game,
            renderer: config.renderer,
            gl: config.renderer.gl,
            topology: (config.topology ? config.topology : config.renderer.gl.TRIANGLES),
            vertShader: (config.vertShader ? config.vertShader : ShaderSourceVS),
            fragShader: (config.fragShader ? config.fragShader : ShaderSourceFS),
            vertexCapacity: (config.vertexCapacity ? config.vertexCapacity : 3),

            vertexSize: (config.vertexSize ? config.vertexSize :
                Float32Array.BYTES_PER_ELEMENT * 2),

            vertices: new Float32Array([
                -1, +1, -1, -7, +7, +1
            ]).buffer,

            attributes: [
                {
                    name: 'inPosition',
                    size: 2,
                    type: config.renderer.gl.FLOAT,
                    normalized: false,
                    offset: 0
                }
            ]
        });

        /**
         * Float32 view of the array buffer containing the pipeline's vertices.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.BitmapMaskPipeline#vertexViewF32
         * @type {Float32Array}
         * @since 3.0.0
         */
        this.vertexViewF32 = new Float32Array(this.vertexData);

        /**
         * Size of the batch.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.BitmapMaskPipeline#maxQuads
         * @type {number}
         * @default 1
         * @since 3.0.0
         */
        this.maxQuads = 1;

        /**
         * Dirty flag to check if resolution properties need to be updated on the 
         * masking shader.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.BitmapMaskPipeline#resolutionDirty
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.resolutionDirty = true;
    },

    /**
     * Called every time the pipeline needs to be used.
     * It binds all necessary resources.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.BitmapMaskPipeline#onBind
     * @since 3.0.0
     *
     * @return {Phaser.Renderer.WebGL.Pipelines.BitmapMaskPipeline} [description]
     */
    onBind: function ()
    {
        WebGLPipeline.prototype.onBind.call(this);

        var renderer = this.renderer;
        var program = this.program;
        
        if (this.resolutionDirty)
        {
            renderer.setFloat2(program, 'uResolution', this.width, this.height);
            renderer.setInt1(program, 'uMainSampler', 0);
            renderer.setInt1(program, 'uMaskSampler', 1);
            this.resolutionDirty = false;
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.Pipelines.BitmapMaskPipeline#resize
     * @since 3.0.0
     *
     * @param {number} width - [description]
     * @param {number} height - [description]
     * @param {number} resolution - [description]
     *
     * @return {Phaser.Renderer.WebGL.Pipelines.BitmapMaskPipeline} [description]
     */
    resize: function (width, height, resolution)
    {
        WebGLPipeline.prototype.resize.call(this, width, height, resolution);
        this.resolutionDirty = true;
        return this;
    },

    /**
     * Binds necessary resources and renders the mask to a separated framebuffer.
     * The framebuffer for the masked object is also bound for further use.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.BitmapMaskPipeline#beginMask
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} mask - GameObject used as mask.
     * @param {Phaser.GameObjects.GameObject} maskedObject - GameObject masked by the mask GameObject.
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     */
    beginMask: function (mask, maskedObject, camera)
    {
        var bitmapMask = mask.bitmapMask;
        var renderer = this.renderer;
        var gl = this.gl;
        var visible = bitmapMask.visible;

        if (bitmapMask && gl)
        {
            // First we clear the mask framebuffer
            renderer.setFramebuffer(mask.maskFramebuffer);
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            // We render our mask source
            bitmapMask.visible = true;
            bitmapMask.renderWebGL(renderer, bitmapMask, 0.0, camera);
            bitmapMask.visible = visible;
            renderer.flush();

            // Bind and clear our main source (masked object)
            renderer.setFramebuffer(mask.mainFramebuffer);
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
        }
    },

    /**
     * The masked game object's framebuffer is unbound and it's texture 
     * is bound together with the mask texture and the mask shader and 
     * a draw call with a single quad is processed. Here is where the
     * masking effect is applied.  
     *
     * @method Phaser.Renderer.WebGL.Pipelines.BitmapMaskPipeline#endMask
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} mask - GameObject used as a mask.
     */
    endMask: function (mask)
    {
        var bitmapMask = mask.bitmapMask;
        var renderer = this.renderer;
        var gl = this.gl;

        if (bitmapMask)
        {
            // Return to default framebuffer
            renderer.setFramebuffer(null);
            
            // Bind bitmap mask pipeline and draw
            renderer.setPipeline(this);
            
            renderer.setTexture2D(mask.maskTexture, 1);
            renderer.setTexture2D(mask.mainTexture, 0);
            renderer.setInt1(this.program, 'uInvertMaskAlpha', mask.invertAlpha);

            // Finally draw a triangle filling the whole screen
            gl.drawArrays(this.topology, 0, 3);
        }
    }

});

module.exports = BitmapMaskPipeline;
