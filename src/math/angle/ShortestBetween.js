/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Gets the shortest angle between `angle1` and `angle2`.
 * Both angles must be in the range -180 to 180, which is the same clamped
 * range that `sprite.angle` uses, so you can pass in two sprite angles to
 * this method and get the shortest angle back between the two of them.
 *
 * The angle returned will be in the same range. If the returned angle is
 * greater than 0 then it's a counter-clockwise rotation, if < 0 then it's
 * a clockwise rotation.
 *
 * @function Phaser.Math.Angle.ShortestBetween
 * @since 3.0.0
 *
 * @param {number} angle1 - The first angle in the range -180 to 180.
 * @param {number} angle2 - The second angle in the range -180 to 180.
 *
 * @return {number} The shortest angle, in degrees. If greater than zero it's a counter-clockwise rotation.
 */
var ShortestBetween = function (angle1, angle2)
{
    var difference = angle2 - angle1;

    if (difference === 0)
    {
        return 0;
    }

    var times = Math.floor((difference - (-180)) / 360);

    return difference - (times * 360);

};

module.exports = ShortestBetween;
