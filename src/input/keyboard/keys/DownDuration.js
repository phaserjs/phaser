/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Returns `true` if the Key was pressed down within the `duration` value given, or `false` if it either isn't down,
 * or was pressed down longer ago than then given duration.
 *
 * @function Phaser.Input.Keyboard.DownDuration
 * @since 3.0.0
 *
 * @param {Phaser.Input.Keyboard.Key} key - [description]
 * @param {integer} duration - [description]
 *
 * @return {boolean} [description]
 */
var DownDuration = function (key, duration)
{
    if (duration === undefined) { duration = 50; }

    return (key.isDown && key.duration < duration);
};

module.exports = DownDuration;
