var CanvasPool = require('../../display/canvas/CanvasPool');
var Class = require('../../utils/Class');
var Components = require('../components');
var GameObject = require('../GameObject');
var GetPowerOfTwo = require('../../math/pow2/GetPowerOfTwo');
var TileSpriteRender = require('./TileSpriteRender');

var TileSprite = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.Flip,
        Components.GetBounds,
        Components.Origin,
        Components.ScaleMode,
        Components.ScrollFactor,
        Components.Size,
        Components.Texture,
        Components.Tint,
        Components.Transform,
        Components.Visible,
        TileSpriteRender
    ],

    initialize:

    function TileSprite (scene, x, y, width, height, texture, frame)
    {
        var renderer = scene.sys.game.renderer;

        GameObject.call(this, scene, 'TileSprite');

        this.tilePositionX = 0;
        this.tilePositionY = 0;
        this.dirty = true;
        this.tileTexture = null;
        this.renderer = renderer;

        this.setTexture(texture, frame);
        this.setPosition(x, y);
        this.setSize(width, height);
        this.setOrigin();

        this.potWidth = GetPowerOfTwo(this.frame.width);
        this.potHeight = GetPowerOfTwo(this.frame.height);
        this.canvasPattern = null;
        this.canvasBuffer = CanvasPool.create2D(null, this.potWidth, this.potHeight);
        this.canvasBufferCtx = this.canvasBuffer.getContext('2d');

        this.updateTileTexture();

        scene.sys.game.renderer.onContextRestored(function (renderer) {
            this.tileTexture = null;
            this.dirty = true;
            this.tileTexture = renderer.createTexture2D(0, gl.LINEAR, gl.LINEAR, gl.REPEAT, gl.REPEAT, gl.RGBA, this.canvasBuffer, this.potWidth, this.potHeight);
        }, this);
    },

    updateTileTexture: function ()
    {
        if (!this.dirty)
        {
            return;
        }

        this.canvasBufferCtx.drawImage(
            this.frame.source.image,
            this.frame.cutX, this.frame.cutY,
            this.frame.cutWidth, this.frame.cutHeight,
            0, 0,
            this.potWidth, this.potHeight
        );

        if (this.renderer.gl)
        {
            this.tileTexture = this.renderer.canvasToTexture(this.canvasBuffer, this.tileTexture, (this.tileTexture === null), this.scaleMode);
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
            this.renderer.deleteTexture(this.tileTexture);
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
