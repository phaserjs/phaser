/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Vec2 = require('../math/Vector2');
var VisualBounds = require('./VisualBounds');

var GetOffset = function (element, point)
{
    if (point === undefined) { point = new Vec2(); }

    var box = element.getBoundingClientRect();

    var scrollTop = VisualBounds.y;
    var scrollLeft = VisualBounds.x;

    var clientTop = document.documentElement.clientTop;
    var clientLeft = document.documentElement.clientLeft;

    point.x = box.left + scrollLeft - clientLeft;
    point.y = box.top + scrollTop - clientTop;

    return point;
};

module.exports = GetOffset;
