
var Class = require('../../utils/Class');
var GameObject = require('../GameObject');
var Components = require('../../components');
var StaticTilemapRender = require('./StaticTilemapRender');

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
        StaticTilemapRender
    ],

    initialize:

    function StaticTilemap (state, mapData, x, y, width, height, texture, frame)
    {
        GameObject.call(this, state, 'StaticTilemap');

        this.mapData = mapData;
        this.setTexture(texture, frame);
        this.setPosition(x, y);
        this.setSizeToFrame();
        this.setOrigin();
        this.setSize(width, height);
    }

});

module.exports = StaticTilemap;
