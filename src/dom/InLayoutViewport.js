/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GetBounds = require('./GetBounds');
var LayoutBounds = require('./LayoutBounds');

var InLayoutViewport = function (element, cushion)
{
    var r = GetBounds(element, cushion);

    return !!r && r.bottom >= 0 && r.right >= 0 && r.top <= LayoutBounds.width && r.left <= LayoutBounds.height;
};

module.exports = InLayoutViewport;
