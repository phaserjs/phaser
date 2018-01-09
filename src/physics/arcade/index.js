//  Phaser.Physics.Arcade

//  World updated to run off the Phaser main loop.
//  Body extended to support additional setter functions.

module.exports = {

    Body: require('./Body'),
    Factory: require('./Factory'),
    Group: require('./PhysicsGroup'),
    Image: require('./ArcadeImage'),
    Sprite: require('./ArcadeSprite'),
    World: require('./World')
  
};
