/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Random = require('../geom/line/Random');

/**
 * [description]
 *
 * @function Phaser.Actions.RandomLine
 * @since 3.0.0
 * 
 * @param {array} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {Phaser.Geom.Line} line - [description]
 *
 * @return {array} The array of Game Objects that was passed to this Action.
 */
var RandomLine = function (items, line)
{
    for (var i = 0; i < items.length; i++)
    {
        Random(line, items[i]);
    }

    return items;
};

module.exports = RandomLine;
