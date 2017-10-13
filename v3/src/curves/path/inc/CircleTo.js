/**
 * [description]
 *
 * @method Phaser.Curves.Path#circleTo
 * @since 3.0.0
 *
 * @param {number} radius - [description]
 * @param {boolean} [clockwise] - [description]
 * @param {number} [rotation] - [description]
 *
 * @return {Phaser.Curves.Path} [description]
 */
var CircleTo = function (radius, clockwise, rotation)
{
    if (clockwise === undefined) { clockwise = false; }

    return this.ellipseTo(radius, radius, 0, 360, clockwise, rotation);
};

module.exports = CircleTo;
