/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var CONST = require('../scale/const');

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

    if (screen)
    {
        return (screen.height > screen.width) ? CONST.PORTRAIT : CONST.LANDSCAPE;
    }
    else if (typeof window.orientation === 'number')
    {
        //  This may change by device based on "natural" orientation.
        return (window.orientation === 0 || window.orientation === 180) ? CONST.PORTRAIT : CONST.LANDSCAPE;
    }
    else if (window.matchMedia)
    {
        if (window.matchMedia('(orientation: portrait)').matches)
        {
            return CONST.PORTRAIT;
        }
        else if (window.matchMedia('(orientation: landscape)').matches)
        {
            return CONST.LANDSCAPE;
        }
    }
    
    return (height > width) ? CONST.PORTRAIT : CONST.LANDSCAPE;
};

module.exports = GetScreenOrientation;
