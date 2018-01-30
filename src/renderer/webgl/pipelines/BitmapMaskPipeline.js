var Class = require('../../../utils/Class');
var WebGLPipeline = require('../WebGLPipeline');
var Utils = require('../Utils');
var ShaderSourceVS = require('../shaders/BitmapMask.vert'); 
var ShaderSourceFS = require('../shaders/BitmapMask.frag');

var BitmapMaskPipeline = new Class({

    Extends: WebGLPipeline,
    
    initialize:

    function BitmapMaskPipeline(game, gl, renderer)
    {
        WebGLPipeline.call(this, {
            game: game,
            gl: gl,
            renderer: renderer,
            topology: gl.TRIANGLES,
            vertShader: ShaderSourceVS,
            fragShader: ShaderSourceFS,
            vertexCapacity: 3,

            vertexSize: 
                Float32Array.BYTES_PER_ELEMENT * 2,

            vertices: new Float32Array([
                -1, +1, -1, -7, +7, +1
            ]).buffer,

            attributes: [
                {
                    name: 'inPosition',
                    size: 2,
                    type: gl.FLOAT,
                    normalized: false,
                    offset: 0
                }
            ]
        });

        this.vertexViewF32 = new Float32Array(this.vertexData);
        this.maxQuads = 1;
        this.resolutionDirty = true;
    },

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

    resize: function (width, height, resolution)
    {
        WebGLPipeline.prototype.resize.call(this, width, height, resolution);
        this.resolutionDirty = true;
        return this;
    },

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
            renderer.setTexture2D(mask.mainTexture, 0);
            renderer.setTexture2D(mask.maskTexture, 1);

            // Finally draw a triangle filling the whole screen
            gl.drawArrays(this.topology, 0, 3);
        }
    }

});

module.exports = BitmapMaskPipeline;
