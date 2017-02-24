//  Required, but don't need Phaser level exports
//  (maybe these should be Phaser export level?)

// require('./blitter/BlitterFactory');
// require('./container/ContainerFactory');
require('./image/ImageFactory');
// require('./sprite/SpriteFactory');
// require('./text/BitmapTextFactory');

//  Phaser.GameObjects

module.exports = {

    Factory: require('./FactoryContainer'),

    // Blitter: require('./blitter/Blitter'),
    // Container: require('./container/Container'),
    Image: require('./image/Image'),
    // Sprite: require('./sprite/Sprite')

};
