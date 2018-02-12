/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GetPoints = require('../geom/line/GetPoints');

/**
 * [description]
 *
 * @function Phaser.Actions.PlaceOnLine
 * @since 3.0.0
 * 
 * @param {array} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {Phaser.Geom.Line} line - [description]
 *
 * @return {array} The array of Game Objects that was passed to this Action.
 */
var PlaceOnLine = function (items, line)
{
    var points = GetPoints(line, items.length);

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
