var OS = require('./OS');
var Browser = require('./Browser');

var Input = {

    // @property {boolean} touch - Is touch available?
    touch: false,

    // @property {boolean} mspointer - Is mspointer available?
    mspointer: false,

    // @property {?string} wheelType - The newest type of Wheel/Scroll event supported: 'wheel', 'mousewheel', 'DOMMouseScroll'
    wheelEvent: null,

    // @property {boolean} gamepads - Is navigator.getGamepads available?
    gamepads: false
    
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
