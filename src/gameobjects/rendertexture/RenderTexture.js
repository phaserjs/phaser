var Class = require('../../utils/Class');
var Components = require('../components');
var GameObject = require('../GameObject');
var RenderTextureWebGL = require('./RenderTextureWebGL');
var RenderTextureCanvas = require('./RenderTextureCanvas');
var Render = require('./RenderTextureRender');
var CanvasPool = require('../../display/canvas/CanvasPool');

var RenderTexture = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.Depth,
        Components.Flip,
        Components.GetBounds,
        Components.MatrixStack,
        Components.Origin,
        Components.Pipeline,
        Components.ScaleMode,
        Components.ScrollFactor,
        Components.Size,
        Components.Tint,
        Components.Transform,
        Components.Visible,
        Render
    ],

    initialize:

    function RenderTexture (scene, x, y, width, height)
    {
        GameObject.call(this, scene, 'RenderTexture');
        this.initMatrixStack();

        this.renderer = scene.sys.game.renderer;
        
        if (this.renderer.type === Phaser.WEBGL)
        {
            var gl = this.renderer.gl;
            this.gl = gl;
            this.fill = RenderTextureWebGL.fill;
            this.clear = RenderTextureWebGL.clear;
            this.draw = RenderTextureWebGL.draw;
            this.drawFrame = RenderTextureWebGL.drawFrame;
            this.texture = this.renderer.createTexture2D(0, gl.NEAREST, gl.NEAREST, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.RGBA, null, width, height, false);
            this.framebuffer = this.renderer.createFramebuffer(width, height, this.texture, false);
        }
        else
        {
            this.fill = RenderTextureCanvas.fill;
            this.clear = RenderTextureCanvas.clear;
            this.draw = RenderTextureCanvas.draw;
            this.drawFrame = RenderTextureCanvas.drawFrame;
            this.canvas = CanvasPool.create2D(null, width, height);
            this.context = this.canvas.getContext('2d');
        }

        this.setPosition(x, y);
        this.setSize(width, height);
        this.initPipeline('TextureTintPipeline');
    },

    destroy: function ()
    {
        GameObject.destroy.call(this);
        if (this.renderer.type === Phaser.WEBGL)
        {
            this.renderer.deleteTexture(this.texture);
            this.renderer.deleteFramebuffer(this.framebuffer);
        }
    }

});

module.exports = RenderTexture;
