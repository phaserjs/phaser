/**
 * An object containing the position and color data for a single pixel in a CanvasTexture.
 *
 * @typedef {object} Phaser.Types.Textures.StampConfig
 * @since 3.60.0
 *
 * @property {number} [alpha=1] -  The alpha value used by the stamp.
 * @property {number} [tint=0xffffff] -  The tint color value used by the stamp. WebGL only.
 * @property {number} [angle=0] - The angle of the stamp in degrees. Rotation takes place around its origin.
 * @property {number} [rotation=0] - The rotation of the stamp in radians. Rotation takes place around its origin.
 * @property {number} [scale=1] - Sets both the horizontal and vertical scale of the stamp with a single value.
 * @property {number} [scaleX=1] - Set the horizontal scale of the stamp. Overrides the scale property, if provided.
 * @property {number} [scaleY=1] - Set the vertical scale of the stamp. Overrides the scale property, if provided.
 * @property {number} [originX=0.5] - The horizontal origin of the stamp. 0 is the left, 0.5 is the center and 1 is the right.
 * @property {number} [originY=0.5] - The vertical origin of the stamp. 0 is the top, 0.5 is the center and 1 is the bottom.
 * @property {(string|Phaser.BlendModes|number)} [blendMode=0] - The blend mode used when drawing the stamp. Defaults to 0 (normal).
 * @property {boolean} [erase=false] - Erase this stamp from the texture?
 */
