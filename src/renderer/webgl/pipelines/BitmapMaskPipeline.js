/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../../utils/Class');
var ShaderSourceFS = require('../shaders/BitmapMask.frag');
var ShaderSourceVS = require('../shaders/BitmapMask.vert');
var WebGLPipeline = require('../WebGLPipeline');

/**
 * @classdesc
 * [description]
 *
 * @class BitmapMaskPipeline
 * @extends Phaser.Renderer.WebGL.WebGLPipeline
 * @memberOf Phaser.Renderer.WebGL
 * @constructor
 * @since 3.0.0
 *
 * @param {object} config - [description]
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
         * [description]
         *
         * @name Phaser.Renderer.WebGL.BitmapMaskPipeline#vertexViewF32
         * @type {Float32Array}
         * @since 3.0.0
         */
        this.vertexViewF32 = new Float32Array(this.vertexData);

        /**
         * [description]
         *
         * @name Phaser.Renderer.WebGL.BitmapMaskPipeline#maxQuads
         * @type {number}
         * @default 1
         * @since 3.0.0
         */
        this.maxQuads = 1;

        /**
         * [description]
         *
         * @name Phaser.Renderer.WebGL.BitmapMaskPipeline#resolutionDirty
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.resolutionDirty = true;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.BitmapMaskPipeline#onBind
     * @since 3.0.0
     *
     * @return {Phaser.Renderer.WebGL.BitmapMaskPipeline} [description]
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
     * @method Phaser.Renderer.WebGL.BitmapMaskPipeline#resize
     * @since 3.0.0
     *
     * @param {number} width - [description]
     * @param {number} height - [description]
     * @param {number} resolution - [description]
     *
     * @return {Phaser.Renderer.WebGL.BitmapMaskPipeline} [description]
     */
    resize: function (width, height, resolution)
    {
        WebGLPipeline.prototype.resize.call(this, width, height, resolution);
        this.resolutionDirty = true;
        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.BitmapMaskPipeline#beginMask
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} mask - [description]
     * @param {Phaser.GameObjects.GameObject} maskedObject - [description]
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

            // We render out mask source
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
     * [description]
     *
     * @method Phaser.Renderer.WebGL.BitmapMaskPipeline#endMask
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} mask - [description]
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
