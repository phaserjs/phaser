var Vector2 = require('../../../math/Vector2');

/**
 * [description]
 *
 * @method Phaser.Curves.Curve#getRandomPoint
 * @since 3.0.0
 *
 * @param {Phaser.Math.Vector2} [out] - [description]
 *
 * @return {Phaser.Math.Vector2} [description]
 */
var GetRandomPoint = function (out)
{
    if (out === undefined) { out = new Vector2(); }

    return this.getPoint(Math.random(), out);
};

module.exports = GetRandomPoint;
