/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Returns `true` if the Key was pressed down within the `duration` value given, based on the current
 * game clock time. Or `false` if it either isn't down, or was pressed down longer ago than the given duration.
 *
 * @function Phaser.Input.Keyboard.DownDuration
 * @since 3.0.0
 *
 * @param {Phaser.Input.Keyboard.Key} key - The Key object to test.
 * @param {number} [duration=50] - The duration, in ms, within which the key must have been pressed down.
 *
 * @return {boolean} `true` if the Key was pressed down within `duration` ms ago, otherwise `false`.
 */
var DownDuration = function (key, duration)
{
    if (duration === undefined) { duration = 50; }

    var current = key.plugin.game.loop.time - key.timeDown;

    return (key.isDown && current < duration);
};

module.exports = DownDuration;
