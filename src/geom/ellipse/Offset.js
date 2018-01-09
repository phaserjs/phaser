/**
 * [description]
 *
 * @function Phaser.Geom.Ellipse.Offset
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Ellipse} ellipse - [description]
 * @param {number} x - [description]
 * @param {number} y - [description]
 *
 * @return {Phaser.Geom.Ellipse} [description]
 */
var Offset = function (ellipse, x, y)
{
    ellipse.x += x;
    ellipse.y += y;

    return ellipse;
};

module.exports = Offset;
