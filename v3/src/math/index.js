var RND = require('./random-data-generator/RandomDataGenerator');

module.exports = {

    //  CONSTs (makes them visible under Phaser.Math)
    PI2: Math.PI * 2,
    TAU: Math.PI * 0.5,
    EPSILON: 1.0e-6,
    DEG_TO_RAD: Math.PI / 180,
    RAD_TO_DEG: 180 / Math.PI,

    //  Collections of functions
    Angle: require('./angle/'),
    Distance: require('./distance/'),
    Easing: require('./easing/'),
    Fuzzy: require('./fuzzy/'),
    Interpolation: require('./interpolation/'),
    Pow2: require('./pow2/'),
    Snap: require('./snap/'),

    //  Random Data Generator
    RND: new RND(),

    //  Single functions
    Average: require('./Average'),
    Bernstein: require('./Bernstein'),
    Between: require('./Between'),
    CatmullRom: require('./CatmullRom'),
    CeilTo: require('./CeilTo'),
    Clamp: require('./Clamp'),
    DegToRad: require('./DegToRad'),
    Difference: require('./Difference'),
    Factorial: require('./Factorial'),
    FloatBetween: require('./FloatBetween'),
    FloorTo: require('./FloorTo'),
    GetSpeed: require('./GetSpeed'),
    Linear: require('./Linear'),
    MaxAdd: require('./MaxAdd'),
    MinSub: require('./MinSub'),
    Percent: require('./Percent'),
    RadToDeg: require('./RadToDeg'),
    Rotate: require('./Rotate'),
    RotateAround: require('./RotateAround'),
    RotateAroundDistance: require('./RotateAroundDistance'),
    RoundAwayFromZero: require('./RoundAwayFromZero'),
    RoundTo: require('./RoundTo'),
    SinCosTableGenerator: require('./SinCosTableGenerator'),
    SmootherStep: require('./SmootherStep'),
    SmoothStep: require('./SmoothStep'),
    Within: require('./Within'),
    Wrap: require('./Wrap')

};
