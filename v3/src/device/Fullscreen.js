var OS = require('./OS');
var Browser = require('./Browser');

var Fullscreen = {

    /**
    * @property {boolean} available - Does the browser support the Full Screen API?
    * @default
    */
    available: false,

    /**
    * @property {string} request - If the browser supports the Full Screen API this holds the call you need to use to activate it.
    * @default
    */
    request: '',

    /**
    * @property {string} cancel - If the browser supports the Full Screen API this holds the call you need to use to cancel it.
    * @default
    */
    cancel: '',

    /**
    * @property {boolean} keyboard - Does the browser support access to the Keyboard during Full Screen mode?
    * @default
    */
    keyboard: false

};

/**
* Checks for support of the Full Screen API.
*/
function init ()
{
    var fs = [
        'requestFullscreen',
        'requestFullScreen',
        'webkitRequestFullscreen',
        'webkitRequestFullScreen',
        'msRequestFullscreen',
        'msRequestFullScreen',
        'mozRequestFullScreen',
        'mozRequestFullscreen'
    ];

    var element = document.createElement('div');

    for (var i = 0; i < fs.length; i++)
    {
        if (element[fs[i]])
        {
            Fullscreen.available = true;
            Fullscreen.request = fs[i];
            break;
        }
    }

    var cfs = [
        'cancelFullScreen',
        'exitFullscreen',
        'webkitCancelFullScreen',
        'webkitExitFullscreen',
        'msCancelFullScreen',
        'msExitFullscreen',
        'mozCancelFullScreen',
        'mozExitFullscreen'
    ];

    if (Fullscreen.available)
    {
        for (var i = 0; i < cfs.length; i++)
        {
            if (document[cfs[i]])
            {
                Fullscreen.cancel = cfs[i];
                break;
            }
        }
    }

    //  Keyboard Input?
    if (window['Element'] && Element['ALLOW_KEYBOARD_INPUT'])
    {
        Fullscreen.keyboard = true;
    }

    return Fullscreen;
}

module.exports = init();
