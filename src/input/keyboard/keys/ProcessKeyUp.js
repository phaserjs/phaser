/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Used internally by the Keyboard Plugin.
 *
 * @function Phaser.Input.Keyboard.ProcessKeyUp
 * @private
 * @since 3.0.0
 *
 * @param {Phaser.Input.Keyboard.Key} key - The Key to process the event for.
 * @param {KeyboardEvent} event - The native Keyboard event.
 *
 * @return {Phaser.Input.Keyboard.Key} The Key that was processed.
 */
var ProcessKeyUp = function (key, event)
{
    key.originalEvent = event;

    if (key.preventDefault)
    {
        event.preventDefault();
    }

    if (!key.enabled)
    {
        return;
    }

    key.isDown = false;
    key.isUp = true;
    key.timeUp = event.timeStamp;
    key.duration = key.timeUp - key.timeDown;
    key.repeats = 0;

    key._justDown = false;
    key._justUp = true;
    key._tick = -1;

    return key;
};

module.exports = ProcessKeyUp;
