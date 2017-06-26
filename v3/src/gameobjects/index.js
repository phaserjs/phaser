//  Required, but don't need Phaser level exports
//  (maybe these should be Phaser export level?)

require('./bitmaptext/dynamic/DynamicBitmapTextFactory');
require('./bitmaptext/static/BitmapTextFactory');
require('./blitter/BlitterFactory');
require('./container/ContainerFactory');
require('./effectlayer/EffectLayerFactory');
require('./graphics/GraphicsFactory');
require('./group/GroupFactory');
require('./image/ImageFactory');
require('./mesh/MeshFactory');
require('./quad/QuadFactory');
require('./renderpass/RenderPassFactory');
require('./sprite/SpriteFactory');
require('./text/static/TextFactory');
require('./tilemap/dynamic/TilemapFactory');
require('./tilemap/static/StaticTilemapFactory');
require('./tilesprite/TileSpriteFactory');
require('./zone/ZoneFactory');

//  Phaser.GameObjects

module.exports = {

    Factory: require('./FactoryContainer'),

    BitmapText: require('./bitmaptext/static/BitmapText'),
    Blitter: require('./blitter/Blitter'),
    Container: require('./container/Container'),
    DynamicBitmapText: require('./bitmaptext/dynamic/DynamicBitmapText'),
    EffectLayer: require('./effectlayer/EffectLayer'),
    Graphics: require('./graphics/Graphics.js'),
    Group: require('./group/Group'),
    Image: require('./image/Image'),
    Mesh: require('./mesh/Mesh'),
    Quad: require('./quad/Quad'),
    RenderPass: require('./renderpass/RenderPass.js'),
    Sprite: require('./sprite/Sprite'),
    StaticTilemap: require('./tilemap/static/StaticTilemap'),
    Text: require('./text/static/Text'),
    Tilemap: require('./tilemap/dynamic/Tilemap'),
    TileSprite: require('./tilesprite/TileSprite'),
    Zone: require('./zone/Zone')

};
