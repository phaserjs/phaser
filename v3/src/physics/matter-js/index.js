//  Phaser.Physics.Matter

var Matter = require('./lib/module/main');

//  Add Phaser specific helpers to the Matter global

// Matter.Phaser.

module.exports = Matter;

/*
module.exports = {

    Body: require('./Body'),
    Factory: require('./Factory'),
    // Group: require('./PhysicsGroup'),
    // Image: require('./MatterImage'),
    // Sprite: require('./MatterSprite'),
    World: require('./World'),

    Global: {

        Body: require('./body/Body'),
        Composite: require('./body/Composite'),
        World: require('./body/World'),

        Contact: require('./collision/Contact'),
        Detector: require('./collision/Detector'),
        Grid: require('./collision/Grid'),
        Pairs: require('./collision/Pairs'),
        Pair: require('./collision/Pair'),
        Query: require('./collision/Query'),
        Resolver: require('./collision/Resolver'),
        SAT: require('./collision/SAT'),

        Constraint: require('./constraint/Constraint'),
        MouseConstraint: require('./constraint/MouseConstraint'),

        Common: require('./core/Common'),
        Engine: require('./core/Engine'),
        Events: require('./core/Events'),
        Mouse: require('./core/Mouse'),
        Sleeping: require('./core/Sleeping'),
        Plugin: require('./core/Plugin'),

        Bodies: require('./factory/Bodies'),
        Composites: require('./factory/Composites'),

        Axes: require('./geometry/Axes'),
        Bounds: require('./geometry/Bounds'),
        Svg: require('./geometry/Svg'),
        Vector: require('./geometry/Vector'),
        Vertices: require('./geometry/Vertices')

    }
  
};
*/
