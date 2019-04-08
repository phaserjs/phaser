/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Calculate the speed required to cover a distance in the time given.
 *
 * @function Phaser.Math.GetSpeed
 * @since 3.0.0
 *
 * @param {number} distance - The distance to travel in pixels.
 * @param {integer} time - The time, in ms, to cover the distance in.
 *
 * @return {number} The amount you will need to increment the position by each step in order to cover the distance in the time given.
 */
var GetSpeed = function (distance, time)
{
    return (distance / time) / 1000;
};

module.exports = GetSpeed;
