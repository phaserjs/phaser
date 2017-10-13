/**
 * [description]
 *
 * @function Phaser.Geom.Ellipse.Equals
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Ellipse} ellipse - [description]
 * @param {Phaser.Geom.Ellipse} toCompare - [description]
 *
 * @return {boolean} [description]
 */
var Equals = function (ellipse, toCompare)
{
    return (
        ellipse.x === toCompare.x &&
        ellipse.y === toCompare.y &&
        ellipse.width === toCompare.width &&
        ellipse.height === toCompare.height
    );
};

module.exports = Equals;
