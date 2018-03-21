/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Offsets the Ellipse by the values given in the `x` and `y` properties of the Point object.
 *
 * @function Phaser.Geom.Ellipse.OffsetPoint
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Ellipse} ellipse - The Ellipse to be offset (translated.)
 * @param {(Phaser.Geom.Point|object)} point - The Point object containing the values to offset the Ellipse by.
 *
 * @return {Phaser.Geom.Ellipse} The Ellipse that was offset.
 */
var OffsetPoint = function (ellipse, point)
{
    ellipse.x += point.x;
    ellipse.y += point.y;

    return ellipse;
};

module.exports = OffsetPoint;
