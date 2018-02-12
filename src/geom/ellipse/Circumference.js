/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Returns the circumference of the given Ellipse.
 *
 * @function Phaser.Geom.Ellipse.Circumference
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Ellipse} ellipse - The Ellipse to get the circumference of.
 *
 * @return {number} The circumference of th Ellipse.
 */
var Circumference = function (ellipse)
{
    var rx = ellipse.width / 2;
    var ry = ellipse.height / 2;
    var h = Math.pow((rx - ry), 2) / Math.pow((rx + ry), 2);

    return (Math.PI * (rx + ry)) * (1 + ((3 * h) / (10 + Math.sqrt(4 - (3 * h)))));
};

module.exports = Circumference;
