/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Offsets the Ellipse by the values given.
 *
 * @function Phaser.Geom.Ellipse.Offset
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Ellipse} O - [ellipse,$return]
 *
 * @param {Phaser.Geom.Ellipse} ellipse - The Ellipse to be offset (translated.)
 * @param {number} x - The amount to horizontally offset the Ellipse by.
 * @param {number} y - The amount to vertically offset the Ellipse by.
 *
 * @return {Phaser.Geom.Ellipse} The Ellipse that was offset.
 */
var Offset = function (ellipse, x, y)
{
    ellipse.x += x;
    ellipse.y += y;

    return ellipse;
};

module.exports = Offset;
