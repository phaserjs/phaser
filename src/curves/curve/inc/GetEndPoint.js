var Vector2 = require('../../../math/Vector2');

/**
 * [description]
 *
 * @method Phaser.Curves.Curve#getEndPoint
 * @since 3.0.0
 *
 * @param {Phaser.Math.Vector2} out - [description]
 *
 * @return {Phaser.Math.Vector2} [description]
 */
var GetEndPoint = function (out)
{
    if (out === undefined) { out = new Vector2(); }

    return this.getPointAt(1, out);
};

module.exports = GetEndPoint;
