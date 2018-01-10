/**
 * [description]
 *
 * @function Phaser.Geom.Triangle.Equals
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Triangle} triangle - [description]
 * @param {Phaser.Geom.Triangle} toCompare - [description]
 *
 * @return {boolean} [description]
 */
var Equals = function (triangle, toCompare)
{
    return (
        triangle.x1 === toCompare.x1 &&
        triangle.y1 === toCompare.y1 &&
        triangle.x2 === toCompare.x2 &&
        triangle.y2 === toCompare.y2 &&
        triangle.x3 === toCompare.x3 &&
        triangle.y3 === toCompare.y3
    );
};

module.exports = Equals;
