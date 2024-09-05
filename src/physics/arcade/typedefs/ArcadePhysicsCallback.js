/**
 * @callback Phaser.Types.Physics.Arcade.ArcadePhysicsCallback
 *
 * A callback receiving two Game Objects.
 *
 * When colliding a single sprite with a Group or TilemapLayer, `object1` is always the sprite.
 *
 * For all other cases, `object1` and `object2` match the same arguments in `collide()` or `overlap()`.
 *
 * Note you can receive back only a body if you passed in a body directly.
 * 
 * You should only do this if the body intentionally has no associated game object (sprite, .etc).
 * 
 * @param {(Phaser.Types.Physics.Arcade.GameObjectWithBody|Phaser.Physics.Arcade.Body|Phaser.Tilemaps.Tile)} object1 - The first Game Object.
 * @param {(Phaser.Types.Physics.Arcade.GameObjectWithBody|Phaser.Physics.Arcade.Body|Phaser.Tilemaps.Tile)} object2 - The second Game Object.
 */
