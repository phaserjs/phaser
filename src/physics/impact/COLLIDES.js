/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Collision Types - Determine if and how entities collide with each other.
 *
 * In ACTIVE vs. LITE or FIXED vs. ANY collisions, only the "weak" entity moves,
 * while the other one stays fixed. In ACTIVE vs. ACTIVE and ACTIVE vs. PASSIVE
 * collisions, both entities are moved. LITE or PASSIVE entities don't collide
 * with other LITE or PASSIVE entities at all. The behavior for FIXED vs.
 * FIXED collisions is undefined.
 *
 * @name Phaser.Physics.Impact.COLLIDES
 * @enum {integer}
 * @memberOf Phaser.Physics.Impact
 * @readOnly
 * @since 3.0.0
 */
module.exports = {

    /**
     * Never collides.
     *
     * @name Phaser.Physics.Impact.COLLIDES.NEVER
     */
    NEVER: 0,

    /**
     * Lite collision.
     *
     * @name Phaser.Physics.Impact.COLLIDES.LITE
     */
    LITE: 1,

    /**
     * Passive collision.
     *
     * @name Phaser.Physics.Impact.COLLIDES.PASSIVE
     */
    PASSIVE: 2,

    /**
     * Active collision.
     *
     * @name Phaser.Physics.Impact.COLLIDES.ACTIVE
     */
    ACTIVE: 4,

    /**
     * Fixed collision.
     *
     * @name Phaser.Physics.Impact.COLLIDES.FIXED
     */
    FIXED: 8

};
