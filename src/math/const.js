var RND = require('./random-data-generator/RandomDataGenerator');

var MATH_CONST = {

    /**
    * The value of PI * 2.
    * 
    * @constant
    * @name Phaser.Math.PI2
    * @since 3.0.0
    * @type {number}
    */
    PI2: Math.PI * 2,

    /**
    * The value of PI * 0.5.
    * 
    * @constant
    * @name Phaser.Math.TAU
    * @since 3.0.0
    * @type {number}
    */
    TAU: Math.PI * 0.5,

    /**
    * An epsilon value (1.0e-6)
    * 
    * @constant
    * @name Phaser.Math.EPSILON
    * @since 3.0.0
    * @type {number}
    */
    EPSILON: 1.0e-6,

    /**
    * For converting degrees to radians (PI / 180)
    * 
    * @constant
    * @name Phaser.Math.DEG_TO_RAD
    * @since 3.0.0
    * @type {number}
    */
    DEG_TO_RAD: Math.PI / 180,

    /**
    * For converting radians to degrees (180 / PI)
    * 
    * @constant
    * @name Phaser.Math.RAD_TO_DEG
    * @since 3.0.0
    * @type {number}
    */
    RAD_TO_DEG: 180 / Math.PI,

    /**
    * An instance of the Random Number Generator.
    * 
    * @constant
    * @name Phaser.Math.RND
    * @since 3.0.0
    * @type {Phaser.Math.RandomDataGenerator}
    */
    RND: new RND()

};

module.exports = MATH_CONST;
