/**
 * [description]
 *
 * @function Phaser.Geom.Ellipse.Circumference
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Ellipse} ellipse - [description]
 *
 * @return {number} [description]
 */
var Circumference = function (ellipse)
{
    var rx = ellipse.width / 2;
    var ry = ellipse.height / 2;
    var h = Math.pow((rx - ry), 2) / Math.pow((rx + ry), 2);

    return (Math.PI * (rx + ry)) * (1 + ((3 * h) / (10 + Math.sqrt(4 - (3 * h)))));
};

module.exports = Circumference;
