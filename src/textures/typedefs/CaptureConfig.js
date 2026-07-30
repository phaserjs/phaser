/**
 * Configuration object for the `DynamicTexture.capture` method.
 *
 * @typedef {object} Phaser.Types.Textures.CaptureConfig
 * @since 4.0.0
 *
 * @property {'local'|'world'|Phaser.GameObjects.Components.TransformMatrix} [transform='world'] -  The transform to use, after applying other config settings. 'local' uses the GameObject's own properties. 'world' uses the GameObject's `parentContainer` value to compute a world position. A `TransformMatrix` can also be provided, which will be used directly.
 * @property {Phaser.Cameras.Scene2D.Camera} [camera] - The Camera to use when rendering the GameObject to the DynamicTexture. If not specified, uses the DynamicTexture's own camera.
 * @property {number} [x] - The x position.
 * @property {number} [y] - The y position.
 * @property {number} [alpha] -  The alpha value.
 * @property {number} [tint] -  The tint color value. WebGL only.
 * @property {number} [angle] - The angle in degrees. Rotation takes place around its origin. If `angle` is non-zero, `rotation` is ignored.
 * @property {number} [rotation] - The rotation in radians. Rotation takes place around its origin.
 * @property {number} [scale] - Sets both the horizontal and vertical scale with a single value.
 * @property {number} [scaleX] - Set the horizontal scale. Overrides the scale property, if provided.
 * @property {number} [scaleY] - Set the vertical scale. Overrides the scale property, if provided.
 * @property {number} [originX] - The horizontal origin. 0 is the left, 0.5 is the center and 1 is the right.
 * @property {number} [originY] - The vertical origin. 0 is the top, 0.5 is the center and 1 is the bottom.
 * @property {(string|Phaser.BlendModes|number)} [blendMode] - The blend mode used when drawing.
 */
