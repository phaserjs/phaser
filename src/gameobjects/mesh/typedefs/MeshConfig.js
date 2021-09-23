/**
 * @typedef {object} Phaser.Types.GameObjects.Mesh.MeshConfig
 * @extends Phaser.Types.GameObjects.GameObjectConfig
 * @since 3.0.0
 *
 * @property {string} [key] - The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @property {string|number} [frame] - An optional frame from the Texture this Game Object is rendering with.
 * @property {number[]} [vertices] - The vertices array. Either `xy` pairs, or `xyz` if the `containsZ` parameter is `true`.
 * @property {number[]} [uvs] - The UVs pairs array.
 * @property {number[]} [indicies] - Optional vertex indicies array. If you don't have one, pass `null` or an empty array.
 * @property {boolean} [containsZ=false] - Does the vertices data include a `z` component?
 * @property {number[]} [normals] - Optional vertex normals array. If you don't have one, pass `null` or an empty array.
 * @property {number|number[]} [colors=0xffffff] - An array of colors, one per vertex, or a single color value applied to all vertices.
 * @property {number|number[]} [alphas=1] - An array of alpha values, one per vertex, or a single alpha value applied to all vertices.
 */
