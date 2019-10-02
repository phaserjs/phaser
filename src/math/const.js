/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var MATH_CONST = {

    /**
     * The value of PI * 2.
     * 
     * @name Phaser.Math.PI2
     * @type {number}
     * @since 3.0.0
     */
    PI2: Math.PI * 2,

    /**
     * The value of PI * 0.5.
     * 
     * @name Phaser.Math.TAU
     * @type {number}
     * @since 3.0.0
     */
    TAU: Math.PI * 0.5,

    /**
     * An epsilon value (1.0e-6)
     * 
     * @name Phaser.Math.EPSILON
     * @type {number}
     * @since 3.0.0
     */
    EPSILON: 1.0e-6,

    /**
     * For converting degrees to radians (PI / 180)
     * 
     * @name Phaser.Math.DEG_TO_RAD
     * @type {number}
     * @since 3.0.0
     */
    DEG_TO_RAD: Math.PI / 180,

    /**
     * For converting radians to degrees (180 / PI)
     * 
     * @name Phaser.Math.RAD_TO_DEG
     * @type {number}
     * @since 3.0.0
     */
    RAD_TO_DEG: 180 / Math.PI,

    /**
     * An instance of the Random Number Generator.
     * This is not set until the Game boots.
     * 
     * @name Phaser.Math.RND
     * @type {Phaser.Math.RandomDataGenerator}
     * @since 3.0.0
     */
    RND: null

};

module.exports = MATH_CONST;
