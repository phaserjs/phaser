/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var OS = require('../device/OS');

/**
 * @callback ContentLoadedCallback
 */

/**
 * Inspects the readyState of the document. If the document is already complete then it invokes the given callback.
 * If not complete it sets up several event listeners such as `deviceready`, and once those fire, it invokes the callback.
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
    else if (OS.cordova && !OS.cocoonJS)
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
