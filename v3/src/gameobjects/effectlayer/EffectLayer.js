var Class = require('../../utils/Class');
var GameObject = require('../GameObject');
var Components = require('../../components');
var Render = require('./EffectLayerRender');
var TexturedAndNormalizedTintedShader = require('../../renderer/webgl/shaders/TexturedAndNormalizedTintedShader');

//  EffectLayer renders all elements on the layer to an offscreen render target
//  and then when rendering the color buffer of that render target to the main screen
//  it applies the effect layer shader.

var EffectLayer = new Class({

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

    function EffectLayer (state, x, y, width, height, effectName, fragmentShader)
    {
        GameObject.call(this, state, 'EffectLayer');
       
        var pot = ((width & (width - 1)) == 0 && (height & (height - 1)) == 0);
        var resourceManager = state.game.renderer.resourceManager;
        var wrap = pot ? gl.REPEAT : gl.CLAMP_TO_EDGE;
        var gl;

        this.dstRenderTarget = null;
        this.renderTexture = null;
        this.dstShader = null;
        this.uniforms = {};

        if (resourceManager !== undefined)
        {
            gl = state.game.renderer.gl;

            this.dstShader = resourceManager.createShader(effectName, {
                vert: TexturedAndNormalizedTintedShader.vert,
                frag: fragmentShader
            });

            this.renderTexture = resourceManager.createTexture(
                0,
                gl.LINEAR, gl.LINEAR,
                wrap, wrap,
                gl.RGBA,
                null, width, height
            );

            this.dstRenderTarget = resourceManager.createRenderTarget(width, height, this.renderTexture, null);
            state.game.renderer.currentTexture = null; // force rebinding of prev texture
        }

        this.flipY = true;
        this.setPosition(x, y);
        this.setSize(width, height);
        this.setOrigin(0, 0);
    },

    renderOffScreen: function ()
    {
        this.renderTarget = this.dstRenderTarget;
    },

    renderOnScreen: function ()
    {
        this.renderTarget = null;
    },

    add: function (gameObject)
    {
        if (gameObject.renderTarget !== undefined)
        {
            gameObject.renderTarget = this.dstRenderTarget;
        }
    },

    remove: function (gameObject)
    {
        if (gameObject.renderTarget !== undefined)
        {
            gameObject.renderTarget = null;
        }
    },

    getUniformLocation: function (uniformName)
    {
        var dstShader = this.dstShader;
        var uniforms = this.uniforms;
        var location;

        if (uniformName in uniforms)
        {
            location = uniforms[uniformName];
        }
        else
        {
            location = dstShader.getUniformLocation(uniformName);
            uniforms[uniformName] = location;
        }

        return location;
    },

    setFloat: function (uniformName, x)
    {
        var dstShader = this.dstShader;

        if (dstShader === null)
        {
            return;
        }

        dstShader.setConstantFloat1(this.getUniformLocation(uniformName), x);
    },

    setFloat2: function (uniformName, x, y)
    {
        var dstShader = this.dstShader;

        if (dstShader === null)
        {
            return;
        }

        dstShader.setConstantFloat2(this.getUniformLocation(uniformName), x, y);
    },

    setFloat3: function (uniformName, x, y, z)
    {
        var dstShader = this.dstShader;

        if (dstShader === null)
        {
            return;
        }

        dstShader.setConstantFloat3(this.getUniformLocation(uniformName), x, y, z);
    },

    setFloat4: function (uniformName, x, y, z, w)
    {
        var dstShader = this.dstShader;

        if (dstShader === null)
        {
            return;
        }

        dstShader.setConstantFloat4(this.getUniformLocation(uniformName), x, y, z, w);
    },

    setInt: function (uniformName, x)
    {
        var dstShader = this.dstShader;

        if (dstShader === null)
        {
            return;
        }

        dstShader.setConstantInt1(this.getUniformLocation(uniformName), x);
    },

    setInt2: function (uniformName, x, y)
    {
        var dstShader = this.dstShader;

        if (dstShader === null)
        {
            return;
        }

        dstShader.setConstantInt2(this.getUniformLocation(uniformName), x, y);
    },

    setInt3: function (uniformName, x, y, z)
    {
        var dstShader = this.dstShader;

        if (dstShader === null)
        {
            return;
        }

        dstShader.setConstantInt3(this.getUniformLocation(uniformName), x, y, z);
    },

    setInt4: function (uniformName, x, y, z, w)
    {
        var dstShader = this.dstShader;

        if (dstShader === null)
        {
            return;
        }

        dstShader.setConstantInt4(this.getUniformLocation(uniformName), x, y, z, w);
    },

    setMatrix2x2: function (uniformName, matrix)
    {
        var dstShader = this.dstShader;

        if (dstShader === null)
        {
            return;
        }

        dstShader.setConstantMatrix2x2(this.getUniformLocation(uniformName), matrix);
    },

    setMatrix3x3: function (uniformName, matrix)
    {
        var dstShader = this.dstShader;

        if (dstShader === null)
        {
            return;
        }

        dstShader.setConstantMatrix3x3(this.getUniformLocation(uniformName), matrix);
    },

    setMatrix4x4: function (uniformName, matrix)
    {
        var dstShader = this.dstShader;

        if (dstShader === null)
        {
            return;
        }

        dstShader.setConstantMatrix4x4(this.getUniformLocation(uniformName), matrix);
    }

});

module.exports = EffectLayer;
