//  Required, but don't need Phaser level exports
//  (maybe these should be Phaser export level?)

require('./blitter/BlitterFactory');
require('./container/ContainerFactory');
require('./image/ImageFactory');
require('./sprite/SpriteFactory');
require('./bitmaptext/static/BitmapTextFactory');
require('./bitmaptext/dynamic/DynamicBitmapTextFactory');
require('./graphics/GraphicsFactory');

//  Phaser.GameObjects

module.exports = {

    Factory: require('./FactoryContainer'),

    BitmapText: require('./bitmaptext/static/BitmapText'),
    DynamicBitmapText: require('./bitmaptext/dynamic/DynamicBitmapText'),
    Blitter: require('./blitter/Blitter'),
    Container: require('./container/Container'),
    Image: require('./image/Image'),
    Sprite: require('./sprite/Sprite'),
    Graphics: require('./graphics/Graphics.js')

};
