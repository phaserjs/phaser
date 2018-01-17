//  Phaser.Physics.Impact

//  An Impact.js compatible physics world, body and solver, for those who are used
//  to the Impact way of defining and controlling physics bodies. Also works with
//  the new Loader support for Weltmeister map data.
//
//  World updated to run off the Phaser main loop.
//  Body extended to support additional setter functions.
//
//  To create the map data you'll need Weltmeister, which comes with Impact
//  and can be purchased from http://impactjs.com
//
//  My thanks to Dominic Szablewski for his permission to support Impact in Phaser.

module.exports = {

    Body: require('./Body'),
    Body: require('./ImpactBody'),
    COLLIDES: require('./COLLIDES'),
    CollisionMap: require('./CollisionMap'),
    Factory: require('./Factory'),
    Image: require('./ImpactImage'),
    ImpactPhysics: require('./ImpactPhysics'),
    Sprite: require('./ImpactSprite'),
    TYPE: require('./TYPE'),
    World: require('./World')
  
};
