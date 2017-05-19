//  Required, but don't need Phaser level exports
//  (maybe these should be Phaser export level?)

require('./blitter/BlitterFactory');
require('./container/ContainerFactory');
require('./image/ImageFactory');
require('./sprite/SpriteFactory');
require('./bitmaptext/static/BitmapTextFactory');
require('./bitmaptext/dynamic/DynamicBitmapTextFactory');
require('./graphics/GraphicsFactory');
require('./text/static/TextFactory');
require('./layer/LayerFactory');
require('./zone/ZoneFactory');
require('./effectlayer/EffectLayerFactory');
require('./renderpass/RenderPassFactory');
require('./tilesprite/TileSpriteFactory');
require('./mesh/MeshFactory');
require('./quad/QuadFactory');

//  Phaser.GameObjects

module.exports = {

    Factory: require('./FactoryContainer'),

    BitmapText: require('./bitmaptext/static/BitmapText'),
    Blitter: require('./blitter/Blitter'),
    Container: require('./container/Container'),
    DynamicBitmapText: require('./bitmaptext/dynamic/DynamicBitmapText'),
    Graphics: require('./graphics/Graphics.js'),
    Image: require('./image/Image'),
    TileSprite: require('./tilesprite/TileSprite'),
    Layer: require('./layer/Layer'),
    RenderPass: require('./renderpass/RenderPass.js'),
    Sprite: require('./sprite/Sprite'),
    Text: require('./text/static/Text'),
    Zone: require('./zone/Zone'),
    EffectLayer: require('./effectlayer/EffectLayer'),
    Mesh: require('./mesh/Mesh'),
    Quad: require('./quad/Quad')

};
