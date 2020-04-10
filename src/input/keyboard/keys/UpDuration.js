/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Returns `true` if the Key was released within the `duration` value given, based on the current
 * game clock time. Or returns `false` if it either isn't up, or was released longer ago than the given duration.
 *
 * @function Phaser.Input.Keyboard.UpDuration
 * @since 3.0.0
 *
 * @param {Phaser.Input.Keyboard.Key} key - The Key object to test.
 * @param {integer} [duration=50] - The duration, in ms, within which the key must have been released.
 *
 * @return {boolean} `true` if the Key was released within `duration` ms ago, otherwise `false`.
 */
var UpDuration = function (key, duration)
{
    if (duration === undefined) { duration = 50; }

    var current = key.plugin.game.loop.time - key.timeUp;

    return (key.isUp && current < duration);
};

module.exports = UpDuration;
