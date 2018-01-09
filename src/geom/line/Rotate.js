var RotateAroundXY = require('./RotateAroundXY');

/**
 * [description]
 *
 * @function Phaser.Geom.Line.Rotate
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} line - [description]
 * @param {number} angle - [description]
 *
 * @return {Phaser.Geom.Line} [description]
 */
var Rotate = function (line, angle)
{
    var x = (line.x1 + line.x2) / 2;
    var y = (line.y1 + line.y2) / 2;

    return RotateAroundXY(line, x, y, angle);
};

module.exports = Rotate;
