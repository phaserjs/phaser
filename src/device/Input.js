/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var OS = require('./OS');
var Browser = require('./Browser');

/**
 * Determines the input support of the browser running this Phaser Game instance.
 * These values are read-only and populated during the boot sequence of the game.
 * They are then referenced by internal game systems and are available for you to access
 * via `this.sys.game.device.input` from within any Scene.
 * 
 * @name Phaser.Device.Input
 * @since 3.0.0
 *
 * @type {object}
 * @property {?string} wheelType - The newest type of Wheel/Scroll event supported: 'wheel', 'mousewheel', 'DOMMouseScroll'
 * @property {boolean} gamepads - Is navigator.getGamepads available?
 * @property {boolean} mspointer - Is mspointer available?
 * @property {boolean} touch - Is touch available?
 */
var Input = {

    gamepads: false,
    mspointer: false,
    touch: false,
    wheelEvent: null
    
};

function init ()
{
    if ('ontouchstart' in document.documentElement || (navigator.maxTouchPoints && navigator.maxTouchPoints >= 1))
    {
        Input.touch = true;
    }

    if (navigator.msPointerEnabled || navigator.pointerEnabled)
    {
        Input.mspointer = true;
    }

    if (navigator.getGamepads)
    {
        Input.gamepads = true;
    }

    if (!OS.cocoonJS)
    {
        // See https://developer.mozilla.org/en-US/docs/Web/Events/wheel
        if ('onwheel' in window || (Browser.ie && 'WheelEvent' in window))
        {
            // DOM3 Wheel Event: FF 17+, IE 9+, Chrome 31+, Safari 7+
            Input.wheelEvent = 'wheel';
        }
        else if ('onmousewheel' in window)
        {
            // Non-FF legacy: IE 6-9, Chrome 1-31, Safari 5-7.
            Input.wheelEvent = 'mousewheel';
        }
        else if (Browser.firefox && 'MouseScrollEvent' in window)
        {
            // FF prior to 17. This should probably be scrubbed.
            Input.wheelEvent = 'DOMMouseScroll';
        }
    }

    return Input;
}

module.exports = init();
