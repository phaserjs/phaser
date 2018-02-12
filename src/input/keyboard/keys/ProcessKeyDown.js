/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Used internally by the KeyboardManager.
 *
 * @function Phaser.Input.Keyboard.Keys.ProcessKeyDown
 * @since 3.0.0
 *
 * @param {Phaser.Input.Keyboard.Key} key - [description]
 * @param {[type]} event - [description]
 *
 * @return {Phaser.Input.Keyboard.Key} [description]
 */
var ProcessKeyDown = function (key, event)
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

    key.altKey = event.altKey;
    key.ctrlKey = event.ctrlKey;
    key.shiftKey = event.shiftKey;
    key.location = event.location;

    key.isDown = true;
    key.isUp = false;
    key.timeDown = event.timeStamp;
    key.duration = 0;
    key.repeats++;

    key._justDown = true;
    key._justUp = false;

    return key;
};

module.exports = ProcessKeyDown;
