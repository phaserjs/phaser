/**
 * @typedef {object} Phaser.Types.Geom.Mesh.GenerateGridConfig
 * @since 3.50.0
 *
 * @property {(string|Phaser.Textures.Texture)} key - The key of the texture to be used for this Grid, as stored in the Texture Manager, or a Texture instance.
 * @property {(string|integer)} [frame] - The name or index of the frame within the Texture.
 * @property {Phaser.GameObjects.Mesh} [mesh] - If specified, the vertices of the generated grid will be added to this Mesh Game Object.
 * @property {number} [width=128] - The width of the grid in pixels.
 * @property {number} [height=width] - The height of the grid in pixels.
 * @property {number} [widthSegments=1] - The number of segments to split the grid horizontally in to.
 * @property {number} [heightSegments=widthSegments] - The number of segments to split the grid vertically in to.
 * @property {number} [x=0] - Offset the grid x position by this amount.
 * @property {number} [y=0] - Offset the grid y position by this amount.
 * @property {number|number[]} [colors=0xffffff] - An array of colors, one per vertex, or a single color value applied to all vertices.
 * @property {number|number[]} [alphas=1] - An array of alpha values, one per vertex, or a single alpha value applied to all vertices.
 * @property {boolean} [tile=false] - Should the texture tile (repeat) across the grid segments, or display as a single texture?
 */
