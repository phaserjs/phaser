/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var OS = require('../device/OS');

/**
 * A callback function to be invoked once the DOM content is fully loaded and the device is ready.
 *
 * @callback ContentLoadedCallback
 */

/**
 * Inspects the readyState of the document. If the document is already complete or interactive, it invokes the given
 * callback immediately. If not, it registers event listeners to detect when the document becomes ready. On Cordova
 * environments it listens for the `deviceready` event; otherwise it listens for `DOMContentLoaded` and the window
 * `load` event, invoking the callback whichever fires first. If the document body is not yet available, it falls
 * back to a short timeout before invoking the callback.
 * Called automatically by the Phaser.Game instance. Should not usually be accessed directly.
 *
 * @function Phaser.DOM.DOMContentLoaded
 * @since 3.0.0
 *
 * @param {ContentLoadedCallback} callback - The callback to be invoked when the device is ready and the DOM content is loaded.
 */
var DOMContentLoaded = function (callback)
{
    if (document.readyState === 'complete' || document.readyState === 'interactive')
    {
        callback();

        return;
    }

    var check = function ()
    {
        document.removeEventListener('deviceready', check, true);
        document.removeEventListener('DOMContentLoaded', check, true);
        window.removeEventListener('load', check, true);

        callback();
    };

    if (!document.body)
    {
        window.setTimeout(check, 20);
    }
    else if (OS.cordova)
    {
        //  Ref. http://docs.phonegap.com/en/3.5.0/cordova_events_events.md.html#deviceready
        document.addEventListener('deviceready', check, false);
    }
    else
    {
        document.addEventListener('DOMContentLoaded', check, true);
        window.addEventListener('load', check, true);
    }
};

module.exports = DOMContentLoaded;
