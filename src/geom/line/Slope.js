/**
 * [description]
 *
 * @function Phaser.Geom.Line.Slope
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} line - [description]
 *
 * @return {number} [description]
 */
var Slope = function (line)
{
    return (line.y2 - line.y1) / (line.x2 - line.x1);
};

module.exports = Slope;
