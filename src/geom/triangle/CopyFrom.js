/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Copy the values of one Triangle to a destination Triangle.
 *
 * @function Phaser.Geom.Triangle.CopyFrom
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Triangle} O - [dest,$return]
 *
 * @param {Phaser.Geom.Triangle} source - The source Triangle to copy the values from.
 * @param {Phaser.Geom.Triangle} dest - The destination Triangle to copy the values to.
 *
 * @return {Phaser.Geom.Triangle} The destination Triangle.
 */
var CopyFrom = function (source, dest)
{
    return dest.setTo(source.x1, source.y1, source.x2, source.y2, source.x3, source.y3);
};

module.exports = CopyFrom;
