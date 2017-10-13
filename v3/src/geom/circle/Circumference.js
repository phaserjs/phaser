/**
 * [description]
 *
 * @function Phaser.Geom.Circle.Circumference
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Circle} circle - The Circle to get the circumference of.
 *
 * @return {number} The circumference of the Circle.
 */
var Circumference = function (circle)
{
    return 2 * (Math.PI * circle.radius);
};

module.exports = Circumference;
