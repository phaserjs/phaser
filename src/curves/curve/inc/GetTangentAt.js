/**
 * [description]
 *
 * @method Phaser.Curves.Curve#getTangentAt
 * @since 3.0.0
 *
 * @param {float} u - [description]
 * @param {Phaser.Math.Vector2} [out] - [description]
 *
 * @return {Phaser.Math.Vector2} [description]
 */
var GetTangentAt = function (u, out)
{
    var t = this.getUtoTmapping(u);

    return this.getTangent(t, out);
};

module.exports = GetTangentAt;
