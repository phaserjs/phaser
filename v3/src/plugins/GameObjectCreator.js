var Class = require('../utils/Class');

var BlitterCreator = require('../gameobjects/blitter/BlitterCreator');
var DynamicBitmapTextCreator = require('../gameobjects/bitmaptext/dynamic/DynamicBitmapTextCreator');
var DynamicTilemapCreator = require('../gameobjects/tilemap/dynamic/TilemapCreator');
var EffectLayerCreator = require('../gameobjects/effectlayer/EffectLayerCreator');
var GraphicsCreator = require('../gameobjects/graphics/GraphicsCreator');
var GroupCreator = require('../gameobjects/group/GroupCreator');
var ImageCreator = require('../gameobjects/image/ImageCreator');
var MeshCreator = require('../gameobjects/mesh/MeshCreator');
var QuadCreator = require('../gameobjects/quad/QuadCreator');
var RenderPassCreator = require('../gameobjects/renderpass/RenderPassCreator');
var SpriteCreator = require('../gameobjects/sprite/SpriteCreator');
var StaticBitmapTextCreator = require('../gameobjects/bitmaptext/static/BitmapTextCreator');
var StaticTilemapCreator = require('../gameobjects/tilemap/static/StaticTilemapCreator');
var TextCreator = require('../gameobjects/text/static/TextCreator');
var TileSpriteCreator = require('../gameobjects/tilesprite/TileSpriteCreator');

var GameObjectCreator = new Class({

    initialize:

    function GameObjectCreator (state)
    {
        this.state = state;

        this.children = state.sys.children;
    },

    bitmapText: function (config)
    {
        return StaticBitmapTextCreator(this.state, config);
    },

    dynamicBitmapText: function (config)
    {
        return DynamicBitmapTextCreator(this.state, config);
    },

    blitter: function (config)
    {
        return BlitterCreator(this.state, config);
    },

    effectLayer: function (config)
    {
        return EffectLayerCreator(this.state, config);
    },

    graphics: function (config)
    {
        return GraphicsCreator(this.state, config);
    },

    group: function (config)
    {
        return GroupCreator(this.state, config);
    },

    mesh: function (config)
    {
        return MeshCreator(this.state, config);
    },

    image: function (config)
    {
        return ImageCreator(this.state, config);
    },

    quad: function (config)
    {
        return QuadCreator(this.state, config);
    },

    renderPass: function (config)
    {
        return RenderPassCreator(this.state, config);
    },

    sprite: function (config)
    {
        return SpriteCreator(this.state, config);
    },

    text: function (config)
    {
        return TextCreator(this.state, config);
    },

    tilemap: function (config)
    {
        return DynamicTilemapCreator(this.state, config);
    },

    staticTilemap: function (config)
    {
        return StaticTilemapCreator(this.state, config);
    },

    tileSprite: function (config)
    {
        return TileSpriteCreator(this.state, config);
    }

});

module.exports = GameObjectCreator;
