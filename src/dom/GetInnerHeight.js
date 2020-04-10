/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Attempts to determine the document inner height across iOS and standard devices.
 * Based on code by @tylerjpeterson
 *
 * @function Phaser.DOM.GetInnerHeight
 * @since 3.16.0
 *
 * @param {boolean} iOS - Is this running on iOS?
 *
 * @return {number} The inner height value.
 */
var GetInnerHeight = function (iOS)
{

    if (!iOS)
    {
        return window.innerHeight;
    }

    var axis = Math.abs(window.orientation);

    var size = { w: 0, h: 0 };
    
    var ruler = document.createElement('div');

    ruler.setAttribute('style', 'position: fixed; height: 100vh; width: 0; top: 0');

    document.documentElement.appendChild(ruler);

    size.w = (axis === 90) ? ruler.offsetHeight : window.innerWidth;
    size.h = (axis === 90) ? window.innerWidth : ruler.offsetHeight;

    document.documentElement.removeChild(ruler);

    ruler = null;

    if (Math.abs(window.orientation) !== 90)
    {
        return size.h;
    }
    else
    {
        return size.w;
    }
};

module.exports = GetInnerHeight;
