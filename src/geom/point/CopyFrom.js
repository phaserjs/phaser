/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Copy the values of one Point to a destination Point.
 *
 * @function Phaser.Geom.Point.CopyFrom
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [dest,$return]
 *
 * @param {Phaser.Geom.Point} source - The source Point to copy the values from.
 * @param {Phaser.Geom.Point} dest - The destination Point to copy the values to.
 *
 * @return {Phaser.Geom.Point} The destination Point.
 */
var CopyFrom = function (source, dest)
{
    return dest.setTo(source.x, source.y);
};

module.exports = CopyFrom;
