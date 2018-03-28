/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Geom.Point.CopyFrom
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [dest,$return]
 *
 * @param {Phaser.Geom.Point} source - [description]
 * @param {Phaser.Geom.Point} dest - [description]
 *
 * @return {Phaser.Geom.Point} [description]
 */
var CopyFrom = function (source, dest)
{
    return dest.setTo(source.x, source.y);
};

module.exports = CopyFrom;
