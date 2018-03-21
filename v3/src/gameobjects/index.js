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

//  Phaser.GameObjects

module.exports = {

    Factory: require('./FactoryContainer'),

    BitmapText: require('./bitmaptext/static/BitmapText'),
    Blitter: require('./blitter/Blitter'),
    Container: require('./container/Container'),
    DynamicBitmapText: require('./bitmaptext/dynamic/DynamicBitmapText'),
    Graphics: require('./graphics/Graphics.js'),
    Image: require('./image/Image'),
    Layer: require('./layer/Layer'),
    Sprite: require('./sprite/Sprite'),
    Text: require('./text/static/Text'),
    Zone: require('./zone/Zone')

};
