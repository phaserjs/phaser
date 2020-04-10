/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Compare two lines for strict equality.
 *
 * @function Phaser.Geom.Line.Equals
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} line - The first line to compare.
 * @param {Phaser.Geom.Line} toCompare - The second line to compare.
 *
 * @return {boolean} Whether the two lines are equal.
 */
var Equals = function (line, toCompare)
{
    return (
        line.x1 === toCompare.x1 &&
        line.y1 === toCompare.y1 &&
        line.x2 === toCompare.x2 &&
        line.y2 === toCompare.y2
    );
};

module.exports = Equals;
