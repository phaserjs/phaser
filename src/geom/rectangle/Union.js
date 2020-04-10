/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Rectangle = require('./Rectangle');

/**
 * Creates a new Rectangle or repositions and/or resizes an existing Rectangle so that it encompasses the two given Rectangles, i.e. calculates their union.
 *
 * @function Phaser.Geom.Rectangle.Union
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Rectangle} O - [out,$return]
 *
 * @param {Phaser.Geom.Rectangle} rectA - The first Rectangle to use.
 * @param {Phaser.Geom.Rectangle} rectB - The second Rectangle to use.
 * @param {Phaser.Geom.Rectangle} [out] - The Rectangle to store the union in.
 *
 * @return {Phaser.Geom.Rectangle} The modified `out` Rectangle, or a new Rectangle if none was provided.
 */
var Union = function (rectA, rectB, out)
{
    if (out === undefined) { out = new Rectangle(); }

    //  Cache vars so we can use one of the input rects as the output rect
    var x = Math.min(rectA.x, rectB.x);
    var y = Math.min(rectA.y, rectB.y);
    var w = Math.max(rectA.right, rectB.right) - x;
    var h = Math.max(rectA.bottom, rectB.bottom) - y;

    return out.setTo(x, y, w, h);
};

module.exports = Union;
