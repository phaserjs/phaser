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

    function GameObjectCreator (scene)
    {
        this.scene = scene;
    },

    bitmapText: function (config)
    {
        return StaticBitmapTextCreator(this.scene, config);
    },

    dynamicBitmapText: function (config)
    {
        return DynamicBitmapTextCreator(this.scene, config);
    },

    blitter: function (config)
    {
        return BlitterCreator(this.scene, config);
    },

    effectLayer: function (config)
    {
        return EffectLayerCreator(this.scene, config);
    },

    graphics: function (config)
    {
        return GraphicsCreator(this.scene, config);
    },

    group: function (config)
    {
        return GroupCreator(this.scene, config);
    },

    mesh: function (config)
    {
        return MeshCreator(this.scene, config);
    },

    image: function (config)
    {
        return ImageCreator(this.scene, config);
    },

    quad: function (config)
    {
        return QuadCreator(this.scene, config);
    },

    renderPass: function (config)
    {
        return RenderPassCreator(this.scene, config);
    },

    sprite: function (config)
    {
        return SpriteCreator(this.scene, config);
    },

    text: function (config)
    {
        return TextCreator(this.scene, config);
    },

    tilemap: function (config)
    {
        return DynamicTilemapCreator(this.scene, config);
    },

    staticTilemap: function (config)
    {
        return StaticTilemapCreator(this.scene, config);
    },

    tileSprite: function (config)
    {
        return TileSpriteCreator(this.scene, config);
    }

});

module.exports = GameObjectCreator;
