/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Calculate the width of the given line.
 *
 * @function Phaser.Geom.Line.Width
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} line - The line to calculate the width of.
 *
 * @return {number} The width of the line.
 */
var Width = function (line)
{
    return Math.abs(line.x1 - line.x2);
};

module.exports = Width;
