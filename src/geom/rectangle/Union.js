/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Rectangle = require('./Rectangle');

/**
 * [description]
 *
 * @function Phaser.Geom.Rectangle.Union
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Rectangle} O - [out,$return]
 *
 * @param {Phaser.Geom.Rectangle} rectA - [description]
 * @param {Phaser.Geom.Rectangle} rectB - [description]
 * @param {Phaser.Geom.Rectangle} [out] - [description]
 *
 * @return {Phaser.Geom.Rectangle} [description]
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
