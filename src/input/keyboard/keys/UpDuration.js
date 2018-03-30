/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Returns `true` if the Key was released within the `duration` value given, or `false` if it either isn't up,
 * or was released longer ago than then given duration.
 *
 * @function Phaser.Input.Keyboard.UpDuration
 * @since 3.0.0
 *
 * @param {Phaser.Input.Keyboard.Key} key - [description]
 * @param {integer} [duration=50] - [description]
 *
 * @return {boolean} [description]
 */
var UpDuration = function (key, duration)
{
    if (duration === undefined) { duration = 50; }

    return (key.isUp && key.duration < duration);
};

module.exports = UpDuration;
