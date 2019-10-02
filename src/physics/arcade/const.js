/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Arcade Physics consts.
 *
 * @ignore
 */

var CONST = {

    /**
     * Dynamic Body.
     *
     * @name Phaser.Physics.Arcade.DYNAMIC_BODY
     * @readonly
     * @type {number}
     * @since 3.0.0
     *
     * @see Phaser.Physics.Arcade.Body#physicsType
     * @see Phaser.Physics.Arcade.Group#physicsType
     */
    DYNAMIC_BODY: 0,

    /**
     * Static Body.
     *
     * @name Phaser.Physics.Arcade.STATIC_BODY
     * @readonly
     * @type {number}
     * @since 3.0.0
     *
     * @see Phaser.Physics.Arcade.Body#physicsType
     * @see Phaser.Physics.Arcade.StaticBody#physicsType
     */
    STATIC_BODY: 1,

    /**
     * Arcade Physics Group containing Dynamic Bodies.
     *
     * @name Phaser.Physics.Arcade.GROUP
     * @readonly
     * @type {number}
     * @since 3.0.0
     */
    GROUP: 2,

    /**
     * A Tilemap Layer.
     *
     * @name Phaser.Physics.Arcade.TILEMAPLAYER
     * @readonly
     * @type {number}
     * @since 3.0.0
     */
    TILEMAPLAYER: 3,

    /**
     * Facing no direction (initial value).
     *
     * @name Phaser.Physics.Arcade.FACING_NONE
     * @readonly
     * @type {number}
     * @since 3.0.0
     *
     * @see Phaser.Physics.Arcade.Body#facing
     */
    FACING_NONE: 10,

    /**
     * Facing up.
     *
     * @name Phaser.Physics.Arcade.FACING_UP
     * @readonly
     * @type {number}
     * @since 3.0.0
     *
     * @see Phaser.Physics.Arcade.Body#facing
     */
    FACING_UP: 11,

    /**
     * Facing down.
     *
     * @name Phaser.Physics.Arcade.FACING_DOWN
     * @readonly
     * @type {number}
     * @since 3.0.0
     *
     * @see Phaser.Physics.Arcade.Body#facing
     */
    FACING_DOWN: 12,

    /**
     * Facing left.
     *
     * @name Phaser.Physics.Arcade.FACING_LEFT
     * @readonly
     * @type {number}
     * @since 3.0.0
     *
     * @see Phaser.Physics.Arcade.Body#facing
     */
    FACING_LEFT: 13,

    /**
     * Facing right.
     *
     * @name Phaser.Physics.Arcade.FACING_RIGHT
     * @readonly
     * @type {number}
     * @since 3.0.0
     *
     * @see Phaser.Physics.Arcade.Body#facing
     */
    FACING_RIGHT: 14

};

module.exports = CONST;
