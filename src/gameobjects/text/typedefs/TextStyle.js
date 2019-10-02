/**
 * A Text Style configuration object as used by the Text Game Object.
 *
 * @typedef {object} Phaser.Types.GameObjects.Text.TextStyle
 * @since 3.0.0
 *
 * @property {string} [fontFamily='Courier'] - The font the Text object will render with. This is a Canvas style font string.
 * @property {string} [fontSize='16px'] - The font size, as a CSS size string.
 * @property {string} [fontStyle] - Any addition font styles, such as 'strong'.
 * @property {string} [backgroundColor] - A solid fill color that is rendered behind the Text object. Given as a CSS string color such as `#ff0`.
 * @property {string} [color='#fff'] - The color the Text is drawn in. Given as a CSS string color such as `#fff` or `rgb()`.
 * @property {string} [stroke='#fff'] - The color used to stroke the Text if the `strokeThickness` property is greater than zero.
 * @property {number} [strokeThickness=0] - The thickness of the stroke around the Text. Set to zero for no stroke.
 * @property {Phaser.Types.GameObjects.Text.TextShadow} [shadow] - The Text shadow configuration object.
 * @property {Phaser.Types.GameObjects.Text.TextPadding} [padding] - A Text Padding object.
 * @property {string} [align='left'] - The alignment of the Text. This only impacts multi-line text. Either `left`, `right`, `center` or `justify`.
 * @property {integer} [maxLines=0] - The maximum number of lines to display within the Text object.
 * @property {number} [fixedWidth=0] - Force the Text object to have the exact width specified in this property. Leave as zero for it to change accordingly to content.
 * @property {number} [fixedHeight=0] - Force the Text object to have the exact height specified in this property. Leave as zero for it to change accordingly to content.
 * @property {number} [resolution=0] - Sets the resolution (DPI setting) of the Text object. Leave at zero for it to use the game resolution.
 * @property {boolean} [rtl=false] - Set to `true` if this Text object should render from right-to-left.
 * @property {string} [testString='|MÃ‰qgy'] - This is the string used to aid Canvas in calculating the height of the font.
 * @property {number} [baselineX=1.2] - The amount of horizontal padding added to the width of the text when calculating the font metrics.
 * @property {number} [baselineY=1.4] - The amount of vertical padding added to the height of the text when calculating the font metrics.
 * @property {Phaser.Types.GameObjects.Text.TextWordWrap} [wordWrap] - The Text Word wrap configuration object.
 * @property {Phaser.Types.GameObjects.Text.TextMetrics} [metrics] - A Text Metrics object. Use this to avoid expensive font size calculations in text heavy games.
 */
