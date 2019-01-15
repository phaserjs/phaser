/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Rectangle = require('../rectangle/Rectangle');

/**
 * Returns the bounds of the Ellipse object.
 *
 * @function Phaser.Geom.Ellipse.GetBounds
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Rectangle} O - [out,$return]
 *
 * @param {Phaser.Geom.Ellipse} ellipse - The Ellipse to get the bounds from.
 * @param {(Phaser.Geom.Rectangle|object)} [out] - A Rectangle, or rectangle-like object, to store the ellipse bounds in. If not given a new Rectangle will be created.
 *
 * @return {(Phaser.Geom.Rectangle|object)} The Rectangle object containing the Ellipse bounds.
 */
var GetBounds = function (ellipse, out)
{
    if (out === undefined) { out = new Rectangle(); }

    out.x = ellipse.left;
    out.y = ellipse.top;
    out.width = ellipse.width;
    out.height = ellipse.height;

    return out;
};

module.exports = GetBounds;
