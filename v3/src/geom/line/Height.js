/**
 * [description]
 *
 * @function Phaser.Geom.Line.Height
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} line - [description]
 *
 * @return {number} [description]
 */
var Height = function (line)
{
    return Math.abs(line.y1 - line.y2);
};

module.exports = Height;
