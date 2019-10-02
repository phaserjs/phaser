/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Rectangle = require('./Rectangle');

/**
 * Creates a new Rectangle which is identical to the given one.
 *
 * @function Phaser.Geom.Rectangle.Clone
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} source - The Rectangle to clone.
 *
 * @return {Phaser.Geom.Rectangle} The newly created Rectangle, which is separate from the given one.
 */
var Clone = function (source)
{
    return new Rectangle(source.x, source.y, source.width, source.height);
};

module.exports = Clone;
