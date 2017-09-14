//  Phaser.GameObjects

var GameObjects = {

    Components: require('./components'),

    BitmapText: require('./bitmaptext/static/BitmapText'),
    Blitter: require('./blitter/Blitter'),
    DynamicBitmapText: require('./bitmaptext/dynamic/DynamicBitmapText'),
    Graphics: require('./graphics/Graphics.js'),
    Group: require('./group/Group'),
    Image: require('./image/Image'),
    ObjectPool: require('./pool/ObjectPool.js'),
    Sprite: require('./sprite/Sprite'),
    StaticTilemap: require('./tilemap/static/StaticTilemap'),
    Text: require('./text/static/Text'),
    Tilemap: require('./tilemap/dynamic/Tilemap'),
    TileSprite: require('./tilesprite/TileSprite'),
    Zone: require('./zone/Zone'),

    //  Game Object Factories
    BlitterFactory: require('./blitter/BlitterFactory'),
    DynamicBitmapTextFactory: require('./bitmaptext/dynamic/DynamicBitmapTextFactory'),
    DynamicTilemapFactory: require('./tilemap/dynamic/TilemapFactory'),
    GraphicsFactory: require('./graphics/GraphicsFactory'),
    GroupFactory: require('./group/GroupFactory'),
    ImageFactory: require('./image/ImageFactory'),
    SpriteFactory: require('./sprite/SpriteFactory'),
    StaticBitmapTextFactory: require('./bitmaptext/static/BitmapTextFactory'),
    StaticTilemapFactory: require('./tilemap/static/StaticTilemapFactory'),
    TextFactory: require('./text/static/TextFactory'),
    TileSpriteFactory: require('./tilesprite/TileSpriteFactory'),
    ZoneFactory: require('./zone/ZoneFactory'),

};

if (WEBGL_RENDERER)
{
    //  WebGL only Game Objects
    GameObjects.EffectLayer = require('./effectlayer/EffectLayer');
    GameObjects.LightLayer = require('./lightlayer/LightLayer');
    GameObjects.Mesh = require('./mesh/Mesh');
    GameObjects.Quad = require('./quad/Quad');
    GameObjects.RenderPass = require('./renderpass/RenderPass.js');

    GameObjects.EffectLayerFactory = require('./effectlayer/EffectLayerFactory');
    GameObjects.LightLayerFactory = require('./lightlayer/LightLayerFactory');
    GameObjects.MeshFactory = require('./mesh/MeshFactory');
    GameObjects.QuadFactory = require('./quad/QuadFactory');
    GameObjects.RenderPassFactory = require('./renderpass/RenderPassFactory');
}

module.exports = GameObjects;
