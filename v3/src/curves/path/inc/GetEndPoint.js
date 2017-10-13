var Vector2 = require('../../../math/Vector2');

/**
 * [description]
 *
 * @method Phaser.Curves.Path#getEndPoint
 * @since 3.0.0
 *
 * @param {Phaser.Math.Vector2} [out] - [description]
 *
 * @return {Phaser.Math.Vector2} [description]
 */
var GetEndPoint = function (out)
{
    if (out === undefined) { out = new Vector2(); }

    if (this.curves.length > 0)
    {
        this.curves[this.curves.length - 1].getPoint(1, out);
    }
    else
    {
        out.copy(this.startPoint);
    }

    return out;
};

module.exports = GetEndPoint;
