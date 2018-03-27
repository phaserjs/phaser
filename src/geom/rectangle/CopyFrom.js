/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Geom.Rectangle.CopyFrom
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Rectangle} O - [dest,$return]
 *
 * @param {Phaser.Geom.Rectangle} source - [description]
 * @param {Phaser.Geom.Rectangle} dest - [description]
 *
 * @return {Phaser.Geom.Rectangle} [description]
 */
var CopyFrom = function (source, dest)
{
    return dest.setTo(source.x, source.y, source.width, source.height);
};

module.exports = CopyFrom;
