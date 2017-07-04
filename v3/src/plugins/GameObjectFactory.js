var Class = require('../utils/Class');

var BlitterFactory = require('../gameobjects/blitter/BlitterFactory');
var DynamicBitmapTextFactory = require('../gameobjects/bitmaptext/dynamic/DynamicBitmapTextFactory');
var DynamicTilemapFactory = require('../gameobjects/tilemap/dynamic/TilemapFactory');
var EffectLayerFactory = require('../gameobjects/effectlayer/EffectLayerFactory');
var GraphicsFactory = require('../gameobjects/graphics/GraphicsFactory');
var GroupFactory = require('../gameobjects/group/GroupFactory');
var ImageFactory = require('../gameobjects/image/ImageFactory');
var MeshFactory = require('../gameobjects/mesh/MeshFactory');
var QuadFactory = require('../gameobjects/quad/QuadFactory');
var RenderPassFactory = require('../gameobjects/renderpass/RenderPassFactory');
var SpriteFactory = require('../gameobjects/sprite/SpriteFactory');
var StaticBitmapTextFactory = require('../gameobjects/bitmaptext/static/BitmapTextFactory');
var StaticTilemapFactory = require('../gameobjects/tilemap/static/StaticTilemapFactory');
var TextFactory = require('../gameobjects/text/static/TextFactory');
var TileSpriteFactory = require('../gameobjects/tilesprite/TileSpriteFactory');

var GameObjectFactory = new Class({

    initialize:

    function GameObjectFactory (state)
    {
        this.state = state;

        this.children = state.sys.children;
    },

    bitmapText: function (x, y, font, text, size, align)
    {
        return this.children.add(StaticBitmapTextFactory(this.state, x, y, font, text, size, align));
    },

    dynamicBitmapText: function (x, y, font, text, size, align)
    {
        return this.children.add(DynamicBitmapTextFactory(this.state, x, y, font, text, size, align));
    },

    blitter: function (x, y, key, frame)
    {
        return this.children.add(BlitterFactory(this.state, x, y, key, frame));
    },

    effectLayer: function (x, y, width, height, effectName, fragmentShader)
    {
        return this.children.add(EffectLayerFactory(this.state, x, y, width, height, effectName, fragmentShader));
    },

    graphics: function (config)
    {
        return this.children.add(GraphicsFactory(this.state, config));
    },

    group: function (children, config)
    {
        return GroupFactory(this.state, children, config);
    },

    image: function (x, y, key, frame)
    {
        return this.children.add(ImageFactory(this.state, x, y, key, frame));
    },

    mesh: function (x, y, vertices, uv, key, frame)
    {
        return this.children.add(MeshFactory(this.state, x, y, vertices, uv, key, frame));
    },

    quad: function (x, y, key, frame)
    {
        return this.children.add(QuadFactory(this.state, x, y, key, frame));
    },

    renderPass: function (x, y, width, height, shaderName, fragmentShader)
    {
        return this.children.add(RenderPassFactory(this.state, x, y, width, height, shaderName, fragmentShader));
    },

    sprite: function (x, y, key, frame)
    {
        return this.children.add(SpriteFactory(this.state, x, y, key, frame));
    },

    text: function (x, y, text, style)
    {
        return this.children.add(TextFactory(this.state, x, y, text, style));
    },

    tilemap: function (mapData, x, y, tileWidth, tileHeight, mapWidth, mapHeight, tileBorder, texture, frame)
    {
        return this.children.add(DynamicTilemapFactory(this.state, mapData, x, y, tileWidth, tileHeight, mapWidth, mapHeight, tileBorder, texture, frame));
    },

    staticTilemap: function (mapData, x, y, tileWidth, tileHeight, mapWidth, mapHeight, tileBorder, texture, frame)
    {
        return this.children.add(StaticTilemapFactory(this.state, mapData, x, y, tileWidth, tileHeight, mapWidth, mapHeight, tileBorder, texture, frame));
    },    

    tileSprite: function (x, y, width, height, key, frame)
    {
        return this.children.add(TileSpriteFactory(this.state, x, y, width, height, key, frame));
    }

});

module.exports = GameObjectFactory;
