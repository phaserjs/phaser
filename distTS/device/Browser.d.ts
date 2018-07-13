/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var OS: any;
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
declare var Browser: any;
