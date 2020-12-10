/**
 * @typedef {object} Phaser.Types.Geom.Mesh.GenerateGridConfig
 * @since 3.50.0
 *
 * @property {(string|Phaser.Textures.Texture)} texture - The texture to be used for this Grid. Must be a Texture instance. Can also be a string but only if the `mesh` property is set.
 * @property {(string|number)} [frame] - The name or index of the frame within the Texture.
 * @property {Phaser.GameObjects.Mesh} [mesh] - If specified, the vertices of the generated grid will be added to this Mesh Game Object.
 * @property {number} [width=1] - The width of the grid in 3D units. If you wish to get a pixel accurate grid based on a texture, you can use an Ortho Mesh or the `isOrtho` parameter.
 * @property {number} [height=width] - The height of the grid in 3D units.
 * @property {number} [widthSegments=1] - The number of segments to split the grid horizontally in to.
 * @property {number} [heightSegments=widthSegments] - The number of segments to split the grid vertically in to.
 * @property {number} [x=0] - Offset the grid x position by this amount.
 * @property {number} [y=0] - Offset the grid y position by this amount.
 * @property {number|number[]} [colors=0xffffff] - An array of colors, one per vertex, or a single color value applied to all vertices.
 * @property {number|number[]} [alphas=1] - An array of alpha values, one per vertex, or a single alpha value applied to all vertices.
 * @property {boolean} [tile=false] - Should the texture tile (repeat) across the grid segments, or display as a single texture?
 * @property {boolean} [isOrtho=false] - If set and using a texture with an ortho Mesh, the `width` and `height` parameters will be calculated based on the frame size for you.
 * @property {boolean} [flipY=false] - If set and using a texture, vertically flipping render result.
 */
