var Vector2 = require('../../../math/Vector2');

// Returns a unit vector tangent at t
// In case any sub curve does not implement its tangent derivation,
// 2 points a small delta apart will be used to find its gradient
// which seems to give a reasonable approximation

/**
 * [description]
 *
 * @method Phaser.Curves.Curve#getTangent
 * @since 3.0.0
 *
 * @param {number} t - [description]
 * @param {Phaser.Math.Vector2} [out] - [description]
 *
 * @return {Phaser.Math.Vector2} [description]
 */
var GetTangent = function (t, out)
{
    if (out === undefined) { out = new Vector2(); }

    var delta = 0.0001;
    var t1 = t - delta;
    var t2 = t + delta;

    // Capping in case of danger

    if (t1 < 0)
    {
        t1 = 0;
    }

    if (t2 > 1)
    {
        t2 = 1;
    }

    this.getPoint(t1, this._tmpVec2A);
    this.getPoint(t2, out);

    return out.sub(this._tmpVec2A).normalize();
};

module.exports = GetTangent;
