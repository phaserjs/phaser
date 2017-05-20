
var Class = require('../../utils/Class');
var GameObject = require('../GameObject');
var Components = require('../../components');
var TileSpriteRender = require('./TileSpriteRender');
var CanvasPool = require('../../dom/CanvasPool');

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

        GameObject.call(this, state, 'TileSprite');

        this.tilePositionX = 0;
        this.tilePositionY = 0;
        this.dirty = true;
        this.tileTexture = null;
        this.renderer = null;

        this.setTexture(texture, frame);
        this.setPosition(x, y);
        this.setSizeToFrame();
        this.setOrigin();
        this.setSize(width, height);

        this.potWidth = this.frame.width;
        this.potHeight = this.frame.height; 
        this.canvasPattern = null;

        if (resourceManager) 
        {
            this.potWidth--;
            this.potWidth |= this.potWidth >> 1;
            this.potWidth |= this.potWidth >> 2;
            this.potWidth |= this.potWidth >> 4;
            this.potWidth |= this.potWidth >> 8;
            this.potWidth |= this.potWidth >> 16;
            this.potWidth++;

            this.potHeight--;
            this.potHeight |= this.potHeight >> 1;
            this.potHeight |= this.potHeight >> 2;
            this.potHeight |= this.potHeight >> 4;
            this.potHeight |= this.potHeight >> 8;
            this.potHeight |= this.potHeight >> 16;
            this.potHeight++;

            this.renderer = state.game.renderer;
            gl = state.game.renderer.gl;

            this.tileTexture = resourceManager.createTexture(0, gl.LINEAR, gl.LINEAR, gl.REPEAT, gl.REPEAT, gl.RGBA, this.canvasBuffer, this.potWidth, this.potHeight);

        } 

        this.canvasBuffer = CanvasPool.create2D(null, this.potWidth, this.potHeight);
        this.canvasBufferCtx = this.canvasBuffer.getContext('2d');

        this.updateTileTexture();
    },

    updateTileTexture: function () 
    {
        if (!this.dirty)
            return;

        this.canvasBuffer.width = this.canvasBuffer.width;
        this.canvasBufferCtx.drawImage(
            this.frame.source.image, 
            this.frame.cutX, this.frame.cutY,
            this.frame.cutWidth, this.frame.cutHeight,
            0, 0,
            this.potWidth, this.potHeight
        );

        if (this.renderer) 
        {
            this.renderer.uploadCanvasToGPU(this.canvasBuffer, this.tileTexture, true);
        }
        else
        {
            this.canvasPattern = this.canvasBufferCtx.createPattern(this.canvasBuffer, 'repeat');
        }
        this.dirty = false;
    },

    destroy: function () 
    {
        if (this.renderer) 
        {
            this.renderer.gl.deleteTexture(this.tileTexture);
        }
        CanvasPool.remove(this.canvasBuffer);
        this.canvasPattern = null;
        this.canvasBufferCtx = null;
        this.canvasBuffer = null;
        this.renderer = null;
        this.visible = false;
    }

});

module.exports = TileSprite;
