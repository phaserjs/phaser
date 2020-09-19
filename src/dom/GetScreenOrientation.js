/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = require('../scale/const');

/**
 * Attempts to determine the screen orientation using the Orientation API.
 *
 * @function Phaser.DOM.GetScreenOrientation
 * @since 3.16.0
 *
 * @param {number} width - The width of the viewport.
 * @param {number} height - The height of the viewport.
 *
 * @return {string} The orientation.
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
