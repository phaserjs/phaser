/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Between = require('../../math/Between');
var ContainsRect = require('./ContainsRect');
var Point = require('../point/Point');

/**
 * Calculates a random point that lies within the `outer` Rectangle, but outside of the `inner` Rectangle.
 * The inner Rectangle must be fully contained within the outer rectangle.
 *
 * @function Phaser.Geom.Rectangle.RandomOutside
 * @since 3.10.0
 *
 * @generic {Phaser.Geom.Point} O - [out,$return]
 *
 * @param {Phaser.Geom.Rectangle} outer - The outer Rectangle to get the random point within.
 * @param {Phaser.Geom.Rectangle} inner - The inner Rectangle to exclude from the returned point.
 * @param {Phaser.Geom.Point} [out] - A Point, or Point-like object to store the result in. If not specified, a new Point will be created.
 *
 * @return {Phaser.Geom.Point} A Point object containing the random values in its `x` and `y` properties.
 */
var RandomOutside = function (outer, inner, out)
{
    if (out === undefined) { out = new Point(); }

    if (ContainsRect(outer, inner))
    {
        //  Pick a random quadrant
        //  
        //  The quadrants don't extend the full widths / heights of the outer rect to give
        //  us a better uniformed distribution, otherwise you get clumping in the corners where
        //  the 4 quads would overlap

        switch (Between(0, 3))
        {
            //  Top
            case 0:
                out.x = outer.x + (Math.random() * (inner.right - outer.x));
                out.y = outer.y + (Math.random() * (inner.top - outer.y));
                break;

            //  Bottom
            case 1:
                out.x = inner.x + (Math.random() * (outer.right - inner.x));
                out.y = inner.bottom + (Math.random() * (outer.bottom - inner.bottom));
                break;

            //  Left
            case 2:
                out.x = outer.x + (Math.random() * (inner.x - outer.x));
                out.y = inner.y + (Math.random() * (outer.bottom - inner.y));
                break;

            //  Right
            case 3:
                out.x = inner.right + (Math.random() * (outer.right - inner.right));
                out.y = outer.y + (Math.random() * (inner.bottom - outer.y));
                break;
        }
    }

    return out;
};

module.exports = RandomOutside;
