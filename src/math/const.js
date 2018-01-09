var RND = require('./random-data-generator/RandomDataGenerator');

var MATH_CONST = {

    PI2: Math.PI * 2,
    TAU: Math.PI * 0.5,
    EPSILON: 1.0e-6,
    DEG_TO_RAD: Math.PI / 180,
    RAD_TO_DEG: 180 / Math.PI,

    //  Random Data Generator
    RND: new RND()

};

module.exports = MATH_CONST;
