/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Used internally by the KeyboardManager.
 *
 * @function Phaser.Input.Keyboard.ProcessKeyUp
 * @since 3.0.0
 *
 * @param {Phaser.Input.Keyboard.Key} key - [description]
 * @param {KeyboardEvent} event - [description]
 *
 * @return {Phaser.Input.Keyboard.Key} [description]
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

    return key;
};

module.exports = ProcessKeyUp;
