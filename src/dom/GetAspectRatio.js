/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GetBounds = require('./GetBounds');
var VisualBounds = require('./VisualBounds');

var GetAspectRatio = function (object)
{
    object = (object === null) ? VisualBounds : (object.nodeType === 1) ? GetBounds(object) : object;

    var w = object.width;
    var h = object.height;

    if (typeof w === 'function')
    {
        w = w.call(object);
    }

    if (typeof h === 'function')
    {
        h = h.call(object);
    }

    return w / h;
};

module.exports = GetAspectRatio;
