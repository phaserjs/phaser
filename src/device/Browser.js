/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var OS = require('./OS');

/**
 * Determines the browser type and version running this Phaser Game instance.
 * These values are read-only and populated during the boot sequence of the game.
 * They are then referenced by internal game systems and are available for you to access
 * via `this.sys.game.device.browser` from within any Scene.
 *
 * @typedef {object} Phaser.Device.Browser
 * @since 3.0.0
 *
 * @property {boolean} chrome - Set to true if running in Chrome.
 * @property {boolean} edge - Set to true if running in Microsoft Edge browser.
 * @property {boolean} firefox - Set to true if running in Firefox.
 * @property {boolean} ie - Set to true if running in Internet Explorer 11 or less (not Edge).
 * @property {boolean} mobileSafari - Set to true if running in Mobile Safari.
 * @property {boolean} opera - Set to true if running in Opera.
 * @property {boolean} safari - Set to true if running in Safari.
 * @property {boolean} silk - Set to true if running in the Silk browser (as used on the Amazon Kindle)
 * @property {boolean} trident - Set to true if running a Trident version of Internet Explorer (IE11+)
 * @property {number} chromeVersion - If running in Chrome this will contain the major version number.
 * @property {number} firefoxVersion - If running in Firefox this will contain the major version number.
 * @property {number} ieVersion - If running in Internet Explorer this will contain the major version number. Beyond IE10 you should use Browser.trident and Browser.tridentVersion.
 * @property {number} safariVersion - If running in Safari this will contain the major version number.
 * @property {number} tridentVersion - If running in Internet Explorer 11 this will contain the major version number. See {@link http://msdn.microsoft.com/en-us/library/ie/ms537503(v=vs.85).aspx}
 */
var Browser = {

    chrome: false,
    chromeVersion: 0,
    edge: false,
    firefox: false,
    firefoxVersion: 0,
    ie: false,
    ieVersion: 0,
    mobileSafari: false,
    opera: false,
    safari: false,
    safariVersion: 0,
    silk: false,
    trident: false,
    tridentVersion: 0,
    es2019: false

};

function init ()
{
    var ua = navigator.userAgent;

    if ((/Edg\/\d+/).test(ua))
    {
        Browser.edge = true;
        Browser.es2019 = true;
    }
    else if ((/OPR/).test(ua))
    {
        Browser.opera = true;
        Browser.es2019 = true;
    }
    else if ((/Chrome\/(\d+)/).test(ua) && !OS.windowsPhone)
    {
        Browser.chrome = true;
        Browser.chromeVersion = parseInt(RegExp.$1, 10);
        Browser.es2019 = (Browser.chromeVersion > 69);
    }
    else if ((/Firefox\D+(\d+)/).test(ua))
    {
        Browser.firefox = true;
        Browser.firefoxVersion = parseInt(RegExp.$1, 10);
        Browser.es2019 = (Browser.firefoxVersion > 10);
    }
    else if ((/AppleWebKit\/(?!.*CriOS)/).test(ua) && OS.iOS)
    {
        Browser.mobileSafari = true;
        Browser.es2019 = true;
    }
    else if ((/MSIE (\d+\.\d+);/).test(ua))
    {
        Browser.ie = true;
        Browser.ieVersion = parseInt(RegExp.$1, 10);
    }
    else if ((/Version\/(\d+\.\d+(\.\d+)?) Safari/).test(ua) && !OS.windowsPhone)
    {
        Browser.safari = true;
        Browser.safariVersion = parseInt(RegExp.$1, 10);
        Browser.es2019 = (Browser.safariVersion > 10);
    }
    else if ((/Trident\/(\d+\.\d+)(.*)rv:(\d+\.\d+)/).test(ua))
    {
        Browser.ie = true;
        Browser.trident = true;
        Browser.tridentVersion = parseInt(RegExp.$1, 10);
        Browser.ieVersion = parseInt(RegExp.$3, 10);
    }

    //  Silk gets its own if clause because its ua also contains 'Safari'
    if ((/Silk/).test(ua))
    {
        Browser.silk = true;
    }

    return Browser;
}

module.exports = init();
