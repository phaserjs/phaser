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
    ParticleEmitter: require('./emitter/ParticleEmitter'),
    Sprite: require('./sprite/Sprite'),
    Sprite3D: require('./sprite3d/Sprite3D'),
    StaticTilemap: require('./tilemap/static/StaticTilemap'),
    Text: require('./text/static/Text'),
    Tilemap: require('./tilemap/dynamic/Tilemap'),
    TileSprite: require('./tilesprite/TileSprite'),
    Zone: require('./zone/Zone'),

    //  Game Object Factories

    Factories: {
        Blitter: require('./blitter/BlitterFactory'),
        DynamicBitmapText: require('./bitmaptext/dynamic/DynamicBitmapTextFactory'),
        DynamicTilemap: require('./tilemap/dynamic/TilemapFactory'),
        Graphics: require('./graphics/GraphicsFactory'),
        Group: require('./group/GroupFactory'),
        Image: require('./image/ImageFactory'),
        ParticleEmitter: require('./emitter/ParticleEmitterFactory'),
        Sprite: require('./sprite/SpriteFactory'),
        Sprite3D: require('./sprite3d/Sprite3DFactory'),
        StaticBitmapText: require('./bitmaptext/static/BitmapTextFactory'),
        StaticTilemap: require('./tilemap/static/StaticTilemapFactory'),
        Text: require('./text/static/TextFactory'),
        TileSprite: require('./tilesprite/TileSpriteFactory'),
        Zone: require('./zone/ZoneFactory'),
    },

    Creators: {
        Blitter: require('./blitter/BlitterCreator'),
        DynamicBitmapText: require('./bitmaptext/dynamic/DynamicBitmapTextCreator'),
        DynamicTilemap: require('./tilemap/dynamic/TilemapCreator'),
        Graphics: require('./graphics/GraphicsCreator'),
        Group: require('./group/GroupCreator'),
        Image: require('./image/ImageCreator'),
        ParticleEmitter: require('./emitter/ParticleEmitterCreator'),
        Sprite: require('./sprite/SpriteCreator'),
        Sprite3D: require('./sprite3d/Sprite3DCreator'),
        StaticBitmapText: require('./bitmaptext/static/BitmapTextCreator'),
        StaticTilemap: require('./tilemap/static/StaticTilemapCreator'),
        Text: require('./text/static/TextCreator'),
        TileSprite: require('./tilesprite/TileSpriteCreator'),
        Zone: require('./zone/ZoneCreator'),
    }

};

if (WEBGL_RENDERER)
{
    //  WebGL only Game Objects
    GameObjects.EffectLayer = require('./effectlayer/EffectLayer');
    GameObjects.LightLayer = require('./lightlayer/LightLayer');
    GameObjects.Mesh = require('./mesh/Mesh');
    GameObjects.Quad = require('./quad/Quad');
    GameObjects.RenderPass = require('./renderpass/RenderPass.js');

    GameObjects.Factories.EffectLayer = require('./effectlayer/EffectLayerFactory');
    GameObjects.Factories.LightLayer = require('./lightlayer/LightLayerFactory');
    GameObjects.Factories.Mesh = require('./mesh/MeshFactory');
    GameObjects.Factories.Quad = require('./quad/QuadFactory');
    GameObjects.Factories.RenderPass = require('./renderpass/RenderPassFactory');

    GameObjects.Creators.EffectLayer = require('./effectlayer/EffectLayerCreator');
    GameObjects.Creators.LightLayer = require('./lightlayer/LightLayerCreator');
    GameObjects.Creators.Mesh = require('./mesh/MeshCreator');
    GameObjects.Creators.Quad = require('./quad/QuadCreator');
    GameObjects.Creators.RenderPass = require('./renderpass/RenderPassCreator');
}

module.exports = GameObjects;
