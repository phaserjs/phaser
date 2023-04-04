/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
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
     * Yes, we understand that this should actually be PI * 2, but
     * it has been like this for so long we can't change it now.
     * If you need PI * 2, use the PI2 constant instead.
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
    RND: null,

    /**
     * The minimum safe integer this browser supports.
     * We use a const for backward compatibility with Internet Explorer.
     *
     * @name Phaser.Math.MIN_SAFE_INTEGER
     * @type {number}
     * @since 3.21.0
     */
    MIN_SAFE_INTEGER: Number.MIN_SAFE_INTEGER || -9007199254740991,

    /**
     * The maximum safe integer this browser supports.
     * We use a const for backward compatibility with Internet Explorer.
     *
     * @name Phaser.Math.MAX_SAFE_INTEGER
     * @type {number}
     * @since 3.21.0
     */
    MAX_SAFE_INTEGER: Number.MAX_SAFE_INTEGER || 9007199254740991

};

module.exports = MATH_CONST;
