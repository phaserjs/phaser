/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var MATH_CONST = {

    /**
     * The value of PI * 2, representing a full circle (360 degrees) in radians.
     *
     * @name Phaser.Math.TAU
     * @type {number}
     * @since 4.0.0
     */
    TAU: Math.PI * 2,

    /**
     * The value of PI / 2, or 90 degrees, in radians.
     *
     * @name Phaser.Math.PI_OVER_2
     * @type {number}
     * @since 3.0.0
     */
    PI_OVER_2: Math.PI / 2,

    /**
     * A small epsilon value (1.0e-6) used for floating-point comparisons and near-zero checks to avoid precision errors.
     *
     * @name Phaser.Math.EPSILON
     * @type {number}
     * @since 3.0.0
     */
    EPSILON: 1.0e-6,

    /**
     * Conversion factor for degrees to radians (PI / 180). Multiply a degree value by this constant to obtain its equivalent in radians.
     *
     * @name Phaser.Math.DEG_TO_RAD
     * @type {number}
     * @since 3.0.0
     */
    DEG_TO_RAD: Math.PI / 180,

    /**
     * Conversion factor for radians to degrees (180 / PI). Multiply a radian value by this constant to obtain its equivalent in degrees.
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
    RND: null,

    /**
     * The minimum safe integer this browser supports.
     * We use a const for backward compatibility with older browsers.
     *
     * @name Phaser.Math.MIN_SAFE_INTEGER
     * @type {number}
     * @since 3.21.0
     */
    MIN_SAFE_INTEGER: Number.MIN_SAFE_INTEGER || -9007199254740991,

    /**
     * The maximum safe integer this browser supports.
     * We use a const for backward compatibility with older browsers.
     *
     * @name Phaser.Math.MAX_SAFE_INTEGER
     * @type {number}
     * @since 3.21.0
     */
    MAX_SAFE_INTEGER: Number.MAX_SAFE_INTEGER || 9007199254740991

};

module.exports = MATH_CONST;
