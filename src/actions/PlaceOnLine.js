/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetPoints = require('../geom/line/GetPoints');
var GetEasedPoints = require('../geom/line/GetEasedPoints');

/**
 * Positions an array of Game Objects along a Line, setting each object's `x` and `y` coordinates.
 * By default the Game Objects are placed at evenly spaced intervals along the line. If the `ease`
 * parameter is supplied, the spacing between points is controlled by that easing function instead,
 * allowing for clustered or accelerating distributions along the line.
 *
 * @function Phaser.Actions.PlaceOnLine
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {Phaser.Geom.Line} line - The Line to position the Game Objects on.
 * @param {(string|function)} [ease] - An optional ease to apply to the point distribution. This can be either a string key from the EaseMap (e.g. `'Sine.easeInOut'`) or a custom easing function. If omitted, points are evenly spaced.
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of Game Objects that was passed to this Action.
 */
var PlaceOnLine = function (items, line, ease)
{
    var points;

    if (ease)
    {
        points = GetEasedPoints(line, ease, items.length);
    }
    else
    {
        points = GetPoints(line, items.length);
    }

    for (var i = 0; i < items.length; i++)
    {
        var item = items[i];
        var point = points[i];

        item.x = point.x;
        item.y = point.y;
    }

    return items;
};

module.exports = PlaceOnLine;
