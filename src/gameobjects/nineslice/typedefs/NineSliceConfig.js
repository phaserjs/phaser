/**
 * @typedef {object} Phaser.Types.GameObjects.NineSlice.NineSliceConfig
 * @extends Phaser.Types.GameObjects.GameObjectConfig
 * @since 3.60.0
 *
 * @property {string|Phaser.Textures.Texture} [key] - The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @property {string|number} [frame] - An optional frame from the Texture this Game Object is rendering with.
 * @property {number} [width=256] - The width of the Nine Slice Game Object. You can adjust the width post-creation.
 * @property {number} [height=256] - The height of the Nine Slice Game Object. If this is a 3 slice object the height will be fixed to the height of the texture and cannot be changed.
 * @property {number} [leftWidth=10] - The size of the left vertical column (A).
 * @property {number} [rightWidth=10] - The size of the right vertical column (B).
 * @property {number} [topHeight=0] - The size of the top horiztonal row (C). Set to zero or undefined to create a 3 slice object.
 * @property {number} [bottomHeight=0] - The size of the bottom horiztonal row (D). Set to zero or undefined to create a 3 slice object.
 */
