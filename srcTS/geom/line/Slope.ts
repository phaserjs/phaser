/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Calculate the slope of the given line.
 *
 * @function Phaser.Geom.Line.Slope
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} line - The line to calculate the slope of.
 *
 * @return {number} The slope of the line.
 */
var Slope = function (line)
{
    return (line.y2 - line.y1) / (line.x2 - line.x1);
};

module.exports = Slope;
