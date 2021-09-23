/**
 * @typedef {object} Phaser.Types.Tilemaps.CreateFromObjectLayerConfig
 * @since 3.50.0
 *
 * @property {number} [id] - A unique Object ID to convert.
 * @property {number} [gid] - An Object GID to convert.
 * @property {string} [name] - An Object Name to convert.
 * @property {string} [type] - An Object Type to convert.
 * @property {function} [classType=Phaser.GameObjects.Sprite] - A custom class type to convert the objects in to. The default is {@link Phaser.GameObjects.Sprite}.
 * @property {boolean} [ignoreTileset] - By default, gid-based objects copy properties and respect the type of the tile at that gid and treat the object as an override. If this is true, they don't, and use only the fields set on the object itself.
 * @property {Phaser.Scene} [scene] - A Scene reference, passed to the Game Objects constructors.
 * @property {Phaser.GameObjects.Container} [container] - Optional Container to which the Game Objects are added.
 * @property {(string|Phaser.Textures.Texture)} [key] - Optional key of a Texture to be used, as stored in the Texture Manager, or a Texture instance. If omitted, the object's gid's tileset key is used if available.
 * @property {(string|number)} [frame] - Optional name or index of the frame within the Texture. If omitted, the tileset index is used, assuming that spritesheet frames exactly match tileset indices & geometries -- if available.
 */
