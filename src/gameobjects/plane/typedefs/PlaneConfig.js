/**
 * @typedef {object} Phaser.Types.GameObjects.Plane.PlaneConfig
 * @extends Phaser.Types.GameObjects.GameObjectConfig
 * @since 3.60.0
 *
 * @property {(string|Phaser.Textures.Texture)} [key] - The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @property {(string|number)} [frame] - An optional frame from the Texture this Game Object is rendering with.
 * @property {number} [width=8] - The width of this Plane, in cells, not pixels.
 * @property {number} [height=8] - The height of this Plane, in cells, not pixels.
 * @property {boolean} [tile=false] - Is the texture tiled? I.e. repeated across each cell.
 * @property {Phaser.Types.GameObjects.Plane.PlaneCheckerboardConfig} [checkerboard] - Plane checkerboard configuration object.
 */
