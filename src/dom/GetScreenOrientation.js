/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var VisualBounds = require('./VisualBounds');

var GetScreenOrientation = function (primaryFallback)
{
    var screen = window.screen;
    var orientation = screen.orientation || screen.mozOrientation || screen.msOrientation;

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
    
    if (primaryFallback === 'screen')
    {
        return (screen.height > screen.width) ? PORTRAIT : LANDSCAPE;
    }
    else if (primaryFallback === 'viewport')
    {
        return (VisualBounds.height > VisualBounds.width) ? PORTRAIT : LANDSCAPE;
    }
    else if (primaryFallback === 'window.orientation' && typeof window.orientation === 'number')
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

    return (VisualBounds.height > VisualBounds.width) ? PORTRAIT : LANDSCAPE;
};

module.exports = GetScreenOrientation;
