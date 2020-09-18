/**
 * @callback ArcadePhysicsCallback
 *
 * A callback receiving two Game Objects.
 *
 * When colliding a single sprite with a Group or TilemapLayer, `object1` is always the sprite.
 *
 * For all other cases, `object1` and `object2` match the same arguments in `collide()` or `overlap()`.
 *
 * @param {Phaser.Types.Physics.Arcade.GameObjectWithBody} object1 - The first Game Object.
 * @param {Phaser.Types.Physics.Arcade.GameObjectWithBody} object2 - The second Game Object.
 */
