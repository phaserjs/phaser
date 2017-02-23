//  Required, but don't need Phaser level exports
//  (maybe these should be Phaser export level?)

require('./image/ImageFactory');
require('./sprite/SpriteFactory');
require('./blitter/BlitterFactory');

// require('./gameobjects/container/ContainerFactory');

//  Phaser.GameObjects

module.exports = {

    Factory: require('./FactoryContainer'),

    Image: require('./image/Image'),
    Sprite: require('./sprite/Sprite'),
    Blitter: require('./blitter/Blitter')

};
