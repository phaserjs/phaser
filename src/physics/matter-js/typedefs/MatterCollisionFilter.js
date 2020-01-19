/**
 * An `Object` that specifies the collision filtering properties of this body.
 *
 * Collisions between two bodies will obey the following rules:
 * - If the two bodies have the same non-zero value of `collisionFilter.group`,
 *   they will always collide if the value is positive, and they will never collide
 *   if the value is negative.
 * - If the two bodies have different values of `collisionFilter.group` or if one
 *   (or both) of the bodies has a value of 0, then the category/mask rules apply as follows:
 *
 * Each body belongs to a collision category, given by `collisionFilter.category`. This
 * value is used as a bit field and the category should have only one bit set, meaning that
 * the value of this property is a power of two in the range [1, 2^31]. Thus, there are 32
 * different collision categories available.
 *
 * Each body also defines a collision bitmask, given by `collisionFilter.mask` which specifies
 * the categories it collides with (the value is the bitwise AND value of all these categories).
 *
 * Using the category/mask rules, two bodies `A` and `B` collide if each includes the other's
 * category in its mask, i.e. `(categoryA & maskB) !== 0` and `(categoryB & maskA) !== 0`
 * are both true.
 * 
 * @typedef {object} Phaser.Types.Physics.Matter.MatterCollisionFilter
 * @since 3.22.0
 * 
 * @property {number} [category=0x0001] - A bit field that specifies the collision category this body belongs to. The category value should have only one bit set, for example `0x0001`. This means there are up to 32 unique collision categories available.
 * @property {number} [mask=0xFFFFFFFF] - A bit mask that specifies the collision categories this body may collide with.
 * @property {number} [group=0] - An Integer `Number`, that specifies the collision group this body belongs to.
 */
