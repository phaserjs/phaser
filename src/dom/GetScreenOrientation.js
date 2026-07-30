/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = require('../scale/const');

/**
 * Attempts to determine the screen orientation using a series of browser APIs,
 * falling back to comparing the viewport dimensions if none are available.
 *
 * It checks, in order: the Screen Orientation API (`screen.orientation`,
 * `screen.mozOrientation`, `screen.msOrientation`), the legacy `window.orientation`
 * property (used on iOS), the `window.matchMedia` API, and finally a simple
 * width-versus-height comparison as a last resort.
 *
 * @function Phaser.DOM.GetScreenOrientation
 * @since 3.16.0
 *
 * @param {number} width - The width of the viewport.
 * @param {number} height - The height of the viewport.
 *
 * @return {string} Either a `Phaser.Scale.PORTRAIT` or `Phaser.Scale.LANDSCAPE` string constant, or the raw orientation type string returned by the Screen Orientation API.
 */
var GetScreenOrientation = function (width, height)
{
    var screen = window.screen;
    var orientation = (screen) ? screen.orientation || screen.mozOrientation || screen.msOrientation : false;

    if (orientation && typeof orientation.type === 'string')
    {
        //  Screen Orientation API specification
        return orientation.type;
    }
    else if (typeof orientation === 'string')
    {
        //  moz / ms-orientation are strings
        return orientation;
    }

    if (typeof window.orientation === 'number')
    {
        //  Do this check first, as iOS supports this, but also has an incomplete window.screen implementation
        //  This may change by device based on "natural" orientation.
        return (window.orientation === 0 || window.orientation === 180) ? CONST.ORIENTATION.PORTRAIT : CONST.ORIENTATION.LANDSCAPE;
    }
    else if (window.matchMedia)
    {
        if (window.matchMedia('(orientation: portrait)').matches)
        {
            return CONST.ORIENTATION.PORTRAIT;
        }
        else if (window.matchMedia('(orientation: landscape)').matches)
        {
            return CONST.ORIENTATION.LANDSCAPE;
        }
    }
    else
    {
        return (height > width) ? CONST.ORIENTATION.PORTRAIT : CONST.ORIENTATION.LANDSCAPE;
    }
};

module.exports = GetScreenOrientation;
