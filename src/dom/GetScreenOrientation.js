/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
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

    var PORTRAIT = 'portrait-primary';
    var LANDSCAPE = 'landscape-primary';
    
    if (screen)
    {
        return (screen.height > screen.width) ? PORTRAIT : LANDSCAPE;
    }
    else if (typeof window.orientation === 'number')
    {
        //  This may change by device based on "natural" orientation.
        return (window.orientation === 0 || window.orientation === 180) ? PORTRAIT : LANDSCAPE;
    }
    else if (window.matchMedia)
    {
        if (window.matchMedia('(orientation: portrait)').matches)
        {
            return PORTRAIT;
        }
        else if (window.matchMedia('(orientation: landscape)').matches)
        {
            return LANDSCAPE;
        }
    }
    
    return (height > width) ? PORTRAIT : LANDSCAPE;
};

module.exports = GetScreenOrientation;
