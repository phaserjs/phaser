/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Math.RandomXY
 * @since 3.0.0
 *
 * @param {Phaser.Math.Vector2} vector - [description]
 * @param {float} scale - [description]
 *
 * @return {Phaser.Math.Vector2} [description]
 */
var RandomXY = function (vector, scale)
{
    if (scale === undefined) { scale = 1; }

    var r = Math.random() * 2 * Math.PI;

    vector.x = Math.cos(r) * scale;
    vector.y = Math.sin(r) * scale;

    return vector;
};

module.exports = RandomXY;
