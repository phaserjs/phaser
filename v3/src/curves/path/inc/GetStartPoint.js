var Vector2 = require('../../../math/Vector2');

/**
 * [description]
 *
 * @method Phaser.Curves.Path#getStartPoint
 * @since 3.0.0
 *
 * @param {Phaser.Math.Vector2} [out] - [description]
 *
 * @return {Phaser.Math.Vector2} [description]
 */
var GetStartPoint = function (out)
{
    if (out === undefined) { out = new Vector2(); }

    return out.copy(this.startPoint);
};

module.exports = GetStartPoint;
