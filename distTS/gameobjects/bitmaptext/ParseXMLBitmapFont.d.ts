/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
/**
 * Read an integer value from an XML Node.
 *
 * @function getValue
 * @since 3.0.0
 * @private
 *
 * @param {Node} node - The XML Node.
 * @param {string} attribute - The attribute to read.
 *
 * @return {integer} The parsed value.
 */
declare function getValue(node: any, attribute: any): number;
/**
 * Parse an XML font to Bitmap Font data for the Bitmap Font cache.
 *
 * @function ParseXMLBitmapFont
 * @since 3.0.0
 * @private
 *
 * @param {XMLDocument} xml - The XML Document to parse the font from.
 * @param {integer} [xSpacing=0] - The x-axis spacing to add between each letter.
 * @param {integer} [ySpacing=0] - The y-axis spacing to add to the line height.
 * @param {Phaser.Textures.Frame} [frame] - The texture frame to take into account while parsing.
 *
 * @return {BitmapFontData} The parsed Bitmap Font data.
 */
declare var ParseXMLBitmapFont: any;
