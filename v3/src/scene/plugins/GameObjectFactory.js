var BlitterFactory = require('../../gameobjects/blitter/BlitterFactory');
var Class = require('../../utils/Class');
var DynamicBitmapTextFactory = require('../../gameobjects/bitmaptext/dynamic/DynamicBitmapTextFactory');
var DynamicTilemapFactory = require('../../gameobjects/tilemap/dynamic/TilemapFactory');
var GraphicsFactory = require('../../gameobjects/graphics/GraphicsFactory');
var GroupFactory = require('../../gameobjects/group/GroupFactory');
var ImageFactory = require('../../gameobjects/image/ImageFactory');
var SpriteFactory = require('../../gameobjects/sprite/SpriteFactory');
var StaticBitmapTextFactory = require('../../gameobjects/bitmaptext/static/BitmapTextFactory');
var StaticTilemapFactory = require('../../gameobjects/tilemap/static/StaticTilemapFactory');
var TextFactory = require('../../gameobjects/text/static/TextFactory');
var TileSpriteFactory = require('../../gameobjects/tilesprite/TileSpriteFactory');
var ZoneFactory = require('../../gameobjects/zone/ZoneFactory');

var factoryDef = {

    initialize:

    function GameObjectFactory (scene)
    {
        this.scene = scene;

        this.displayList;
        this.updateList;
    },

    boot: function ()
    {
        this.displayList = this.scene.sys.displayList;
        this.updateList = this.scene.sys.updateList;
    },

    existing: function (child)
    {
        if (child.renderCanvas || child.renderWebGL)
        {
            this.displayList.add(child);
        }

        if (child.preUpdate)
        {
            this.updateList.add(child);
        }

        return child;
    },

    bitmapText: function (x, y, font, text, size, align)
    {
        return this.displayList.add(StaticBitmapTextFactory(this.scene, x, y, font, text, size, align));
    },

    dynamicBitmapText: function (x, y, font, text, size, align)
    {
        return this.displayList.add(DynamicBitmapTextFactory(this.scene, x, y, font, text, size, align));
    },

    blitter: function (x, y, key, frame)
    {
        return this.displayList.add(BlitterFactory(this.scene, x, y, key, frame));
    },

    graphics: function (config)
    {
        return this.displayList.add(GraphicsFactory(this.scene, config));
    },

    group: function (displayList, config)
    {
        return GroupFactory(this.scene, displayList, config);
    },

    image: function (x, y, key, frame)
    {
        return this.displayList.add(ImageFactory(this.scene, x, y, key, frame));
    },

    sprite: function (x, y, key, frame)
    {
        var sprite = SpriteFactory(this.scene, x, y, key, frame);

        this.displayList.add(sprite);
        this.updateList.add(sprite);

        return sprite;
    },

    text: function (x, y, text, style)
    {
        return this.displayList.add(TextFactory(this.scene, x, y, text, style));
    },

    tilemap: function (mapData, x, y, tileWidth, tileHeight, mapWidth, mapHeight, tileBorder, texture, frame)
    {
        return this.displayList.add(DynamicTilemapFactory(this.scene, mapData, x, y, tileWidth, tileHeight, mapWidth, mapHeight, tileBorder, texture, frame));
    },

    staticTilemap: function (mapData, x, y, tileWidth, tileHeight, mapWidth, mapHeight, tileBorder, texture, frame)
    {
        return this.displayList.add(StaticTilemapFactory(this.scene, mapData, x, y, tileWidth, tileHeight, mapWidth, mapHeight, tileBorder, texture, frame));
    },

    tileSprite: function (x, y, width, height, key, frame)
    {
        return this.displayList.add(TileSpriteFactory(this.scene, x, y, width, height, key, frame));
    },

    zone: function (x, y, width, height)
    {
        return this.displayList.add(ZoneFactory(this.scene, x, y, width, height));
    },

    tween: function (config)
    {
        return this.scene.sys.tweens.add(config);
    }
};

if (WEBGL_RENDERER)
{
    //  WebGL only Game Objects
    var EffectLayerFactory = require('../../gameobjects/effectlayer/EffectLayerFactory');
    var LightLayerFactory = require('../../gameobjects/lightlayer/LightLayerFactory');
    var MeshFactory = require('../../gameobjects/mesh/MeshFactory');
    var QuadFactory = require('../../gameobjects/quad/QuadFactory');
    var RenderPassFactory = require('../../gameobjects/renderpass/RenderPassFactory');

    factoryDef.effectLayer = function (x, y, width, height, effectName, fragmentShader)
    {
        return this.displayList.add(EffectLayerFactory(this.scene, x, y, width, height, effectName, fragmentShader));
    };

    factoryDef.lightLayer = function ()
    {
        return this.displayList.add(LightLayerFactory(this.scene));
    };

    factoryDef.mesh = function (x, y, vertices, uv, key, frame)
    {
        return this.displayList.add(MeshFactory(this.scene, x, y, vertices, uv, key, frame));
    };

    factoryDef.quad = function (x, y, key, frame)
    {
        return this.displayList.add(QuadFactory(this.scene, x, y, key, frame));
    };

    factoryDef.renderPass = function (x, y, width, height, shaderName, fragmentShader)
    {
        return this.displayList.add(RenderPassFactory(this.scene, x, y, width, height, shaderName, fragmentShader));
    };
}

var GameObjectFactory = new Class(factoryDef);

module.exports = GameObjectFactory;
