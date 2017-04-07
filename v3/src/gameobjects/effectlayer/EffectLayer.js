var Class = require('../../utils/Class');
var GameObject = require('../GameObject');
var Components = require('../../components');
var Render = require('./EffectLayerRender');
var TexturedAndNormalizedTintedShader = require('../../renderer/webgl/shaders/TexturedAndNormalizedTintedShader');

var EffectLayer = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Flip,
        Components.Alpha,
        Components.Transform,
        Components.Visible,
        Components.Size,
        Components.Origin,
        Components.RenderTarget,
        Components.BlendMode,
        Render
    ],

    initialize:

    function EffectLayer(state, x, y, width, height, effectName, fragmentShader)
    {
        var resourceManager = state.game.renderer.resourceManager;
        var gl;

        this.dstRenderTarget = null
        this.dstRenderTexture = null;
        this.dstShader = null;

        if (resourceManager !== undefined)
        {
            gl = state.game.renderer.gl;
            this.dstShader = resourceManager.createShader(effectName, {
                vert: TexturedAndNormalizedTintedShader.vert,
                frag: fragmentShader
            });
            this.dstRenderTexture = resourceManager.createTexture(
                0, 
                gl.LINEAR, gl.LINEAR, 
                gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, 
                gl.RGBA, 
                null, width, height
            );
            this.dstRenderTarget = resourceManager.createRenderTarget(width, height, this.dstRenderTexture, null); 
            //state.game.renderer.currentTexture = null; // force rebinding of prev texture
        }
        this.flipY = true;
        this.setPosition(x, y);
        this.setSize(width, height);
        this.setOrigin(0, 0);
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
    }

});

module.exports = EffectLayer;
