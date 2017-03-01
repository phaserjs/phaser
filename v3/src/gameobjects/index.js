//  Required, but don't need Phaser level exports
//  (maybe these should be Phaser export level?)

require('./blitter/BlitterFactory');
require('./container/ContainerFactory');
require('./image/ImageFactory');
require('./sprite/SpriteFactory');
require('./bitmaptext/BitmapTextFactory');
require('./graphics/GraphicsFactory');

//  Phaser.GameObjects

module.exports = {

    Factory: require('./FactoryContainer'),

    BitmapText: require('./bitmaptext/BitmapText'),
    Blitter: require('./blitter/Blitter'),
    Container: require('./container/Container'),
    Image: require('./image/Image'),
    Sprite: require('./sprite/Sprite'),
    Graphics: require('./graphics/Graphics.js')

};
