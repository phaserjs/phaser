/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Determines the operating system of the device running this Phaser Game instance.
 * These values are read-only and populated during the boot sequence of the game.
 * They are then referenced by internal game systems and are available for you to access
 * via `this.sys.game.device.os` from within any Scene.
 *
 * @typedef {object} Phaser.Device.OS
 * @since 3.0.0
 *
 * @property {boolean} android - Is running on android?
 * @property {boolean} chromeOS - Is running on chromeOS?
 * @property {boolean} cordova - Is the game running under Apache Cordova?
 * @property {boolean} crosswalk - Is the game running under the Intel Crosswalk XDK?
 * @property {boolean} desktop - Is running on a desktop?
 * @property {boolean} ejecta - Is the game running under Ejecta?
 * @property {boolean} electron - Is the game running under GitHub Electron?
 * @property {boolean} iOS - Is running on iOS?
 * @property {boolean} iPad - Is running on iPad?
 * @property {boolean} iPhone - Is running on iPhone?
 * @property {boolean} kindle - Is running on an Amazon Kindle?
 * @property {boolean} linux - Is running on linux?
 * @property {boolean} macOS - Is running on macOS?
 * @property {boolean} node - Is the game running under Node.js?
 * @property {boolean} nodeWebkit - Is the game running under Node-Webkit?
 * @property {boolean} webApp - Set to true if running as a WebApp, i.e. within a WebView
 * @property {boolean} windows - Is running on windows?
 * @property {boolean} windowsPhone - Is running on a Windows Phone?
 * @property {number} iOSVersion - If running in iOS this will contain the major version number.
 * @property {number} pixelRatio - PixelRatio of the host device?
 */
var OS = {

    android: false,
    chromeOS: false,
    cordova: false,
    crosswalk: false,
    desktop: false,
    ejecta: false,
    electron: false,
    iOS: false,
    iOSVersion: 0,
    iPad: false,
    iPhone: false,
    kindle: false,
    linux: false,
    macOS: false,
    node: false,
    nodeWebkit: false,
    pixelRatio: 1,
    webApp: false,
    windows: false,
    windowsPhone: false

};

function init ()
{
    if (typeof importScripts === 'function')
    {
        return OS;
    }

    var ua = navigator.userAgent;

    if ((/Windows/).test(ua))
    {
        OS.windows = true;
    }
    else if ((/Mac OS/).test(ua) && !((/like Mac OS/).test(ua)))
    {
        //  Because iOS 13 identifies as Mac OS:
        if (navigator.maxTouchPoints && navigator.maxTouchPoints > 2)
        {
            OS.iOS = true;
            OS.iPad = true;

            (navigator.appVersion).match(/Version\/(\d+)/);

            OS.iOSVersion = parseInt(RegExp.$1, 10);
        }
        else
        {
            OS.macOS = true;
        }
    }
    else if ((/Android/).test(ua))
    {
        OS.android = true;
    }
    else if ((/Linux/).test(ua))
    {
        OS.linux = true;
    }
    else if ((/iP[ao]d|iPhone/i).test(ua))
    {
        OS.iOS = true;

        (navigator.appVersion).match(/OS (\d+)/);

        OS.iOSVersion = parseInt(RegExp.$1, 10);

        OS.iPhone = ua.toLowerCase().indexOf('iphone') !== -1;
        OS.iPad = ua.toLowerCase().indexOf('ipad') !== -1;
    }
    else if ((/Kindle/).test(ua) || (/\bKF[A-Z][A-Z]+/).test(ua) || (/Silk.*Mobile Safari/).test(ua))
    {
        OS.kindle = true;

        // This will NOT detect early generations of Kindle Fire, I think there is no reliable way...
        // E.g. "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_3; en-us; Silk/1.1.0-80) AppleWebKit/533.16 (KHTML, like Gecko) Version/5.0 Safari/533.16 Silk-Accelerated=true"
    }
    else if ((/CrOS/).test(ua))
    {
        OS.chromeOS = true;
    }

    if ((/Windows Phone/i).test(ua) || (/IEMobile/i).test(ua))
    {
        OS.android = false;
        OS.iOS = false;
        OS.macOS = false;
        OS.windows = true;
        OS.windowsPhone = true;
    }

    var silk = (/Silk/).test(ua);

    if (OS.windows || OS.macOS || (OS.linux && !silk) || OS.chromeOS)
    {
        OS.desktop = true;
    }

    //  Windows Phone / Table reset
    if (OS.windowsPhone || (((/Windows NT/i).test(ua)) && ((/Touch/i).test(ua))))
    {
        OS.desktop = false;
    }

    //  WebApp mode in iOS
    if (navigator.standalone)
    {
        OS.webApp = true;
    }

    if (typeof importScripts !== 'function')
    {
        if (window.cordova !== undefined)
        {
            OS.cordova = true;
        }

        if (window.ejecta !== undefined)
        {
            OS.ejecta = true;
        }
    }

    if (typeof process !== 'undefined' && process.versions && process.versions.node)
    {
        OS.node = true;
    }

    if (OS.node && typeof process.versions === 'object')
    {
        OS.nodeWebkit = !!process.versions['node-webkit'];

        OS.electron = !!process.versions.electron;
    }

    if ((/Crosswalk/).test(ua))
    {
        OS.crosswalk = true;
    }

    OS.pixelRatio = window['devicePixelRatio'] || 1;

    return OS;
}

module.exports = init();
