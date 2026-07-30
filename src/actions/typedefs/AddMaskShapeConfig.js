/**
 * @typedef {object} Phaser.Types.Actions.AddMaskShapeConfig
 * @since 4.0.0
 *
 * @property {string} [shape='circle'] - The type of shape to create. This can be 'circle', 'ellipse', 'square' or 'rectangle'.
 * @property {number} [aspectRatio=1] - The aspect ratio of width to height for ellipse and rectangle shapes.
 * @property {boolean} [invert] - Whether to invert the mask, typically for creating borders.
 * @property {boolean} [useInternal] - Whether to use the internal or external filter list. Internal masks follow game objects, and are executed before external filters.
 * @property {number} [blurRadius=0] - The radius of blur to apply to the mask. If 0, no blur is applied. A good value is 2.
 * @property {number} [blurSteps=4] - The number of steps to run blur on the mask. This value should always be an integer.
 * @property {number} [blurQuality=0] - The quality of any blur: 0 (low), 1 (medium) or 2 (high).
 * @property {number} [scaleMode=0] - The scale mode to use when fitting the shape. 0 sets each axis to fill the region independently. -1 scales both axes uniformly so the shape touches the _inside_ of the region. 1 scales both axes uniformly so the shape touches the _outside_ of the region.
 * @property {number} [padding=0] - Padding applies an inset around the edge of the masked region. This provides space for blur to soften the edges of a mask.
 * @property {Phaser.Geom.Rectangle} [region] - The region to fit. If not defined, it will be inferred from the target's scene scale.
 */
