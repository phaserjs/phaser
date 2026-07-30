/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Browser = require('./Browser');

/**
 * Determines the input support of the browser running this Phaser Game instance.
 * These values are read-only and populated during the boot sequence of the game.
 * They are then referenced by internal game systems and are available for you to access
 * via `this.sys.game.device.input` from within any Scene.
 *
 * @typedef {object} Phaser.Device.Input
 * @since 3.0.0
 *
 * @property {?string} wheelEvent - The most modern wheel/scroll event type supported by the browser: `'wheel'` (DOM3), `'mousewheel'` (legacy Chrome/IE/Safari), or `'DOMMouseScroll'` (legacy Firefox). `null` if no wheel event is supported.
 * @property {boolean} gamepads - Whether the Gamepad API (`navigator.getGamepads`) is available in this browser, allowing gamepad input to be read.
 * @property {boolean} mspointer - Whether the Microsoft Pointer API (`navigator.msPointerEnabled` or `navigator.pointerEnabled`) is available, used for pointer input on older IE/Edge browsers.
 * @property {boolean} touch - Whether touch input is supported, detected via the `ontouchstart` event or `navigator.maxTouchPoints`.
 */
var Input = {

    gamepads: false,
    mspointer: false,
    touch: false,
    wheelEvent: null

};

function init ()
{
    if (typeof importScripts === 'function')
    {
        return Input;
    }

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

    return Input;
}

module.exports = init();
