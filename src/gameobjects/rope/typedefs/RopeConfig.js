/**
 * @typedef {object} Phaser.Types.GameObjects.Rope.RopeConfig
 * @extends Phaser.Types.GameObjects.GameObjectConfig
 * @since 3.50.0
 *
 * @property {string} [key] - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager. If not given, `__DEFAULT` is used.
 * @property {(string|integer|null)} [frame] - An optional frame from the Texture this Game Object is rendering with.
 * @property {(integer|Phaser.Types.Math.Vector2Like[])} [points=2] - An array containing the vertices data for this Rope, or a number that indicates how many segments to split the texture frame into. If none is provided a simple quad is created. See `setPoints` to set this post-creation.
 * @property {boolean} [horizontal=true] - Should the vertices of this Rope be aligned horizontally (`true`), or vertically (`false`)?
 * @property {number[]} [colors] - An optional array containing the color data for this Rope. You should provide one color value per pair of vertices.
 * @property {number[]} [alphas] - An optional array containing the alpha data for this Rope. You should provide one alpha value per pair of vertices.
 */
