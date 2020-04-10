/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Copy the values of one line to a destination line.
 *
 * @function Phaser.Geom.Line.CopyFrom
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Line} O - [dest,$return]
 *
 * @param {Phaser.Geom.Line} source - The source line to copy the values from.
 * @param {Phaser.Geom.Line} dest - The destination line to copy the values to.
 *
 * @return {Phaser.Geom.Line} The destination line.
 */
var CopyFrom = function (source, dest)
{
    return dest.setTo(source.x1, source.y1, source.x2, source.y2);
};

module.exports = CopyFrom;
