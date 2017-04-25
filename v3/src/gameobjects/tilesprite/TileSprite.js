
var Class = require('../../utils/Class');
var GameObject = require('../GameObject');
var Components = require('../../components');
var TileSpriteRender = require('./TileSpriteRender');

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

    function TileSprite (state, x, y, texture, frame)
    {
        GameObject.call(this, state, 'TileSprite');

        this.tilePositionX = 0;
        this.tilePositionY = 0;

        this.setTexture(texture, frame);
        this.setPosition(x, y);
        this.setSizeToFrame();
        this.setOrigin();
    }

});

module.exports = TileSprite;
