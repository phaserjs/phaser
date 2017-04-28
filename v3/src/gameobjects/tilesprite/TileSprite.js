
var Class = require('../../utils/Class');
var GameObject = require('../GameObject');
var Components = require('../../components');
var TileSpriteRender = require('./TileSpriteRender');
var CanvasPool = require('../../dom/CanvasPool')

var TileSprite = new Class({

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
        Components.Texture,
        Components.Transform,
        Components.Visible,
        TileSpriteRender
    ],

    initialize:

    function TileSprite (state, x, y, width, height, texture, frame)
    {
        var resourceManager = state.game.renderer.resourceManager;
        var gl;

        GameObject.call(this, state, 'TileSprite');

        this.tilePositionX = 0;
        this.tilePositionY = 0;
        this.canvasBuffer = CanvasPool.create2D(null, width, height);
        this.canvasBufferCtx = this.canvasBuffer.getContext('2d');
        this.dirty = false;

        this.setTexture(texture, frame);
        this.setPosition(x, y);
        this.setSizeToFrame();
        this.setOrigin();

    },

    updateTileTexture: function () 
    {

    }

});

module.exports = TileSprite;
