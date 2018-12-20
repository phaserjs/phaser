/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Calibrate = require('./Calibrate');

var GetBounds = function (element, cushion)
{
    if (cushion === undefined) { cushion = 0; }

    element = (element && !element.nodeType) ? element[0] : element;

    if (!element || element.nodeType !== 1)
    {
        return false;
    }
    else
    {
        return Calibrate(element.getBoundingClientRect(), cushion);
    }
};

module.exports = GetBounds;
