// RenderPass Will only work with Sprite and Image GameObjects.

var Class = require('../../utils/Class');
var GameObject = require('../GameObject');
var Components = require('../../components');
var Render = require('./RenderPassRender');
var TexturedAndNormalizedTintedShader = require('../../renderer/webgl/shaders/TexturedAndNormalizedTintedShader');

//   RenderPass - the user has a higher control on the rendering since you explicitly
//   indicate what is rendered. RenderPass also has a render target but the difference
//   is that when explicitly rendering an object to the render pass the shader from that
//   render pass is applied. This is useful for additive passes and specific object effects.

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
        var pot = ((width & (width - 1)) == 0 && (height & (height - 1)) == 0);
        var wrap = pot ? gl.REPEAT : gl.CLAMP_TO_EDGE;
        var gl;

        this.renderer = state.game.renderer;
        this.passRenderTarget = null;
        this.renderTexture = null;
        this.passShader = null;
        this.uniforms = {};

        if (resourceManager !== undefined)
        {
            gl = state.game.renderer.gl;
            this.passShader = resourceManager.createShader(shaderName, {vert: TexturedAndNormalizedTintedShader.vert, frag: fragmentShader});
            this.renderTexture = resourceManager.createTexture(0, gl.LINEAR, gl.LINEAR, wrap, wrap, gl.RGBA, null, width, height);
            this.passRenderTarget = resourceManager.createRenderTarget(width, height, this.renderTexture, null);
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
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.passRenderTarget.framebufferObject);
            gl.clearColor(r, g, b, a);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
    },

    clearDepthStencilBuffers: function (depth, stencil)
    {
        var gl = this.renderer.gl;

        if (gl)
        {
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.passRenderTarget.framebufferObject);
            gl.clearDepth(depth);
            gl.clearStencil(stencil);
            gl.clear(gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
    },

    clearAllBuffers: function (r, g, b, a, depth, stencil)
    {
        var gl = this.renderer.gl;

        if (gl)
        {
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.passRenderTarget.framebufferObject);
            gl.clearColor(r, g, b, a);
            gl.clearDepth(depth);
            gl.clearStencil(stencil);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
    },

    render: function (gameObject, camera)
    {
        var gl = this.renderer.gl;

        if (gl)
        {
            this.renderer.setRenderer(this.renderer.spriteBatch, null, null);
            this.renderer.spriteBatch.addSprite(gameObject, camera);
            this.renderer.spriteBatch.flush(this.passShader, this.passRenderTarget.framebufferObject);
        }
    },

    setRenderTextureAt: function (renderTexture, samplerName, unit)
    {
        var gl = this.renderer.gl;

        if (gl)
        {
            /* Texture 1 is reserved for Phasers Main Renderer */
            unit = (unit > 0) ? unit : 1;
            this.setInt(samplerName, unit);
            gl.activeTexture(gl.TEXTURE0 + unit);
            gl.bindTexture(gl.TEXTURE_2D, renderTexture.texture);
            gl.activeTexture(gl.TEXTURE0);
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
        {
            return;
        }

        passShader.setConstantFloat1(this.getUniformLocation(uniformName), x);
    },

    setFloat2: function (uniformName, x, y)
    {
        var passShader = this.passShader;

        if (passShader === null)
        {
            return;
        }

        passShader.setConstantFloat2(this.getUniformLocation(uniformName), x, y);
    },

    setFloat3: function (uniformName, x, y, z)
    {
        var passShader = this.passShader;

        if (passShader === null)
        {
            return;
        }

        passShader.setConstantFloat3(this.getUniformLocation(uniformName), x, y, z);
    },

    setFloat4: function (uniformName, x, y, z, w)
    {
        var passShader = this.passShader;

        if (passShader === null)
        {
            return;
        }

        passShader.setConstantFloat4(this.getUniformLocation(uniformName), x, y, z, w);
    },

    setInt: function (uniformName, x)
    {
        var passShader = this.passShader;

        if (passShader === null)
        {
            return;
        }

        passShader.setConstantInt1(this.getUniformLocation(uniformName), x);
    },

    setInt2: function (uniformName, x, y)
    {
        var passShader = this.passShader;

        if (passShader === null)
        {
            return;
        }

        passShader.setConstantInt2(this.getUniformLocation(uniformName), x, y);
    },

    setInt3: function (uniformName, x, y, z)
    {
        var passShader = this.passShader;

        if (passShader === null)
        {
            return;
        }

        passShader.setConstantInt3(this.getUniformLocation(uniformName), x, y, z);
    },

    setInt4: function (uniformName, x, y, z, w)
    {
        var passShader = this.passShader;

        if (passShader === null)
        {
            return;
        }

        passShader.setConstantInt4(this.getUniformLocation(uniformName), x, y, z, w);
    },

    setMatrix2x2: function (uniformName, matrix)
    {
        var passShader = this.passShader;

        if (passShader === null)
        {
            return;
        }

        passShader.setConstantMatrix2x2(this.getUniformLocation(uniformName), matrix);
    },

    setMatrix3x3: function (uniformName, matrix)
    {
        var passShader = this.passShader;

        if (passShader === null)
        {
            return;
        }

        passShader.setConstantMatrix3x3(this.getUniformLocation(uniformName), matrix);
    },

    setMatrix4x4: function (uniformName, matrix)
    {
        var passShader = this.passShader;

        if (passShader === null)
        {
            return;
        }

        passShader.setConstantMatrix4x4(this.getUniformLocation(uniformName), matrix);
    }

});

module.exports = RenderPass;
