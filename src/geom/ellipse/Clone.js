/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Ellipse = require('./Ellipse');

/**
 * Creates a new Ellipse instance based on the values contained in the given source.
 *
 * @function Phaser.Geom.Ellipse.Clone
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Ellipse} source - The Ellipse to be cloned. Can be an instance of an Ellipse or a ellipse-like object, with x, y, width and height properties.
 *
 * @return {Phaser.Geom.Ellipse} A clone of the source Ellipse.
 */
var Clone = function (source)
{
    return new Ellipse(source.x, source.y, source.width, source.height);
};

module.exports = Clone;
