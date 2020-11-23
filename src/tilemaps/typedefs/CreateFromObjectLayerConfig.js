/**
 * @typedef {object} Phaser.Types.Tilemaps.CreateFromObjectLayerConfig
 * @since 3.50.0
 *
 * @property {number} [id] - A unique Object ID to convert.
 * @property {number} [gid] - An Object GID to convert.
 * @property {string} [name] - An Object Name to convert.
 * @property {Phaser.GameObjects.GameObject} [classType=Phaser.GameObjects.Sprite] - A custom class type to convert the objects in to.
 * @property {Phaser.Scene} [scene] - A Scene reference, passed to the Game Objects constructors.
 * @property {Phaser.GameObjects.Container} [container] - Optional Container to which the Game Objects are added.
 * @property {(string|Phaser.Textures.Texture)} [key] - Optional key of a Texture to be used, as stored in the Texture Manager, or a Texture instance.
 * @property {(string|number)} [frame] - Optional name or index of the frame within the Texture.
 */
