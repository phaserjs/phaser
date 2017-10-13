// Get point at relative position in curve according to arc length

// - u [0 .. 1]

/**
 * [description]
 *
 * @method Phaser.Curves.Curve#getPointAt
 * @since 3.0.0
 *
 * @param {float} u - [description]
 * @param {Phaser.Math.Vector2} [out] - [description]
 *
 * @return {Phaser.Math.Vector2} [description]
 */
var GetPointAt = function (u, out)
{
    var t = this.getUtoTmapping(u);

    return this.getPoint(t, out);
};

module.exports = GetPointAt;
