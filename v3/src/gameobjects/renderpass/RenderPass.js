// RenderPass Will only work with Sprite and Image GameObjects.

var Class = require('../../utils/Class');
var GameObject = require('../GameObject');
var Components = require('../../components');
var Render = require('./RenderPassRender');
var TexturedAndNormalizedTintedShader = require('../../renderer/webgl/shaders/TexturedAndNormalizedTintedShader');

var RenderPass = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.Flip,
        Components.GetBounds,
        Components.Origin,
        Components.RenderTarget,
        Components.ScaleMode,
        Components.Size,
        Components.Transform,
        Components.Visible,
        Render
    ],

    initialize:

    function RenderPass (state, x, y, width, height, shaderName, fragmentShader)
    {
        GameObject.call(this, state, 'RenderPass');
       
        var resourceManager = state.game.renderer.resourceManager;
        var gl;

        this.renderer = state.game.renderer;
        this.passRenderTarget = null
        this.passRenderTexture = null;
        this.passShader = null;
        this.uniforms = {};

        if (resourceManager !== undefined)
        {
            gl = state.game.renderer.gl;
            this.passShader = resourceManager.createShader(shaderName, {vert: TexturedAndNormalizedTintedShader.vert, frag: fragmentShader});
            this.passRenderTexture = resourceManager.createTexture(0, gl.LINEAR, gl.LINEAR, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.RGBA, null, width, height);
            this.passRenderTarget = resourceManager.createRenderTarget(width, height, this.passRenderTexture, null);
            state.game.renderer.currentTexture = null; // force rebinding of prev texture
        }

        this.flipY = true;
        this.setPosition(x, y);
        this.setSize(width, height);
        this.setOrigin(0, 0);

    },

    clearColorBuffer: function (r, g, b, a)
    {
        var gl = this.renderer.gl;
        if (gl)
        {
            gl.bindFramebuffer(gl.FRAMBUFFER, this.passRenderTarget.framebufferObject);
            gl.clearColor(r, g, b, a);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.bindFramebuffer(gl.FRAMBUFFER, null);
        }
    },

    clearDepthStencilBuffers: function (depth, stencil)
    {
        var gl = this.renderer.gl;
        if (gl)
        {
            gl.bindFramebuffer(gl.FRAMBUFFER, this.passRenderTarget.framebufferObject);
            gl.clearDepth(depth);
            gl.clearStencil(stencil);
            gl.clear(gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
            gl.bindFramebuffer(gl.FRAMBUFFER, null);
        }
    },

    clearAllBuffers: function (depth, stencil)
    {
        var gl = this.renderer.gl;
        if (gl)
        {
            gl.bindFramebuffer(gl.FRAMBUFFER, this.passRenderTarget.framebufferObject);
            gl.clearColor(r, g, b, a);
            gl.clearDepth(depth);
            gl.clearStencil(stencil);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
            gl.bindFramebuffer(gl.FRAMBUFFER, null);
        }
    },

    render: function (gameObject, camera)
    {
        var gl = this.renderer.gl;
        if (gl)
        {
            this.renderer.spriteBatch.addSprite(gameObject, camera);
            this.renderer.spriteBatch.flush(this.passShader, this.passRenderTarget.framebufferObject);
            this.renderer.setRenderer(null, null, null);
        }
    },

    getUniformLocation: function (uniformName)
    {
        var passShader = this.passShader;
        var uniforms = this.uniforms;
        var location;

        if (uniformName in uniforms)
        {
            location = uniforms[uniformName];
        }
        else
        {
            location = passShader.getUniformLocation(uniformName);
            uniforms[uniformName] = location;
        }

        return location;
    },

    setFloat: function (uniformName, x)
    {
        var passShader = this.passShader;

        if (passShader === null)
            return;

        passShader.setConstantFloat1(this.getUniformLocation(uniformName), x);
    },

    setFloat2: function (uniformName, x, y)
    {
        var passShader = this.passShader;

        if (passShader === null)
            return;

        passShader.setConstantFloat2(this.getUniformLocation(uniformName), x, y);
    },

    setFloat3: function (uniformName, x, y, z)
    {
        var passShader = this.passShader;

        if (passShader === null)
            return;

        passShader.setConstantFloat3(this.getUniformLocation(uniformName), x, y, z);
    },

    setFloat4: function (uniformName, x, y, z, w)
    {
        var passShader = this.passShader;

        if (passShader === null)
            return;

        passShader.setConstantFloat4(this.getUniformLocation(uniformName), x, y, z, w);
    },

    setInt: function (uniformName, x)
    {
        var passShader = this.passShader;

        if (passShader === null)
            return;

        passShader.setConstantInt1(this.getUniformLocation(uniformName), x);
    },

    setInt2: function (uniformName, x, y)
    {
        var passShader = this.passShader;

        if (passShader === null)
            return;

        passShader.setConstantInt2(this.getUniformLocation(uniformName), x, y);
    },

    setInt3: function (uniformName, x, y, z)
    {
        var passShader = this.passShader;

        if (passShader === null)
            return;

        passShader.setConstantInt3(this.getUniformLocation(uniformName), x, y, z);
    },

    setInt4: function (uniformName, x, y, z, w)
    {
        var passShader = this.passShader;

        if (passShader === null)
            return;

        passShader.setConstantInt4(this.getUniformLocation(uniformName), x, y, z, w);
    },

    setMatrix2x2: function (uniformName, matrix)
    {
        var passShader = this.passShader;

        if (passShader === null)
            return;

        passShader.setConstantMatrix2x2(this.getUniformLocation(uniformName), matrix);
    },

    setMatrix3x3: function (uniformName, matrix)
    {
        var passShader = this.passShader;

        if (passShader === null)
            return;

        passShader.setConstantMatrix3x3(this.getUniformLocation(uniformName), matrix);
    },

    setMatrix4x4: function (uniformName, matrix)
    {
        var passShader = this.passShader;

        if (passShader === null)
            return;

        passShader.setConstantMatrix4x4(this.getUniformLocation(uniformName), matrix);
    }

});

module.exports = RenderPass;
