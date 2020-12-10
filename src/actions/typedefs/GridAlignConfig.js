/**
 * @typedef {object} Phaser.Types.Actions.GridAlignConfig
 * @since 3.0.0
 *
 * @property {number} [width=-1] - The width of the grid in items (not pixels). -1 means lay all items out horizontally, regardless of quantity.
 *                                  If both this value and height are set to -1 then this value overrides it and the `height` value is ignored.
 * @property {number} [height=-1] - The height of the grid in items (not pixels). -1 means lay all items out vertically, regardless of quantity.
 *                                   If both this value and `width` are set to -1 then `width` overrides it and this value is ignored.
 * @property {number} [cellWidth=1] - The width of the cell, in pixels, in which the item is positioned.
 * @property {number} [cellHeight=1] - The height of the cell, in pixels, in which the item is positioned.
 * @property {number} [position=0] - The alignment position. One of the Phaser.Display.Align consts such as `TOP_LEFT` or `RIGHT_CENTER`.
 * @property {number} [x=0] - Optionally place the top-left of the final grid at this coordinate.
 * @property {number} [y=0] - Optionally place the top-left of the final grid at this coordinate.
 */
