/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GetInnerHeight = function (iOS)
{
    //  Based on code by @tylerjpeterson

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
