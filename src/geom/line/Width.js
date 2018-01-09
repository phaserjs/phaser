/**
 * [description]
 *
 * @function Phaser.Geom.Line.Width
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} line - [description]
 *
 * @return {number} [description]
 */
var Width = function (line)
{
    return Math.abs(line.x1 - line.x2);
};

module.exports = Width;
