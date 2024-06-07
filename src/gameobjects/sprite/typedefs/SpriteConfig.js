/**
 * @typedef {object} Phaser.Types.GameObjects.Sprite.SpriteConfig
 * @extends Phaser.Types.GameObjects.GameObjectConfig
 * @since 3.0.0
 *
 * @property {(string|Phaser.Textures.Texture)} [key] - The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @property {(string|number)} [frame] - An optional frame from the Texture this Game Object is rendering with.
 * @property {(string|Phaser.Animations.Animation|Phaser.Types.Animations.PlayAnimationConfig)} [anims] - The string-based key of the animation to play, or an Animation instance, or a `PlayAnimationConfig` object.
 * @property {(boolean)} [useSpriteSheet] - If set to `true` it uses a tileset loaded as a sprite sheet (not an image), and sets the Sprite key and frame to match the sprite texture and tile index.
 */
