/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
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
 * @name Phaser.Physics.Impact.TYPE
 * @enum {integer}
 * @memberof Phaser.Physics.Impact
 * @readonly
 * @since 3.0.0
 */
module.exports = {

    /**
     * Collides with nothing.
     *
     * @name Phaser.Physics.Impact.TYPE.NONE
     */
    NONE: 0,

    /**
     * Type A. Collides with Type B.
     *
     * @name Phaser.Physics.Impact.TYPE.A
     */
    A: 1,

    /**
     * Type B. Collides with Type A.
     *
     * @name Phaser.Physics.Impact.TYPE.B
     */
    B: 2,

    /**
     * Collides with both types A and B.
     *
     * @name Phaser.Physics.Impact.TYPE.BOTH
     */
    BOTH: 3

};
