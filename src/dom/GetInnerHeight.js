/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Attempts to determine the document inner height across iOS and standard devices.
 * On non-iOS devices this simply returns `window.innerHeight`. On iOS, Safari's dynamic
 * browser chrome (such as the address bar appearing or hiding on scroll) can cause
 * `window.innerHeight` to report an inaccurate value. To work around this, a temporary
 * fixed-position element sized to `100vh` is injected into the DOM, its measured height
 * is used instead, and the element is immediately removed. The result is also adjusted
 * for landscape orientation using `window.orientation`.
 * Based on code by @tylerjpeterson
 *
 * @function Phaser.DOM.GetInnerHeight
 * @since 3.16.0
 *
 * @param {boolean} iOS - Is this running on iOS?
 *
 * @return {number} The inner height of the viewport, in pixels.
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
