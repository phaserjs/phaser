/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = require('../const/ORIENTATION_CONST');
var NOOP = require('../../utils/NOOP');
var TileToWorldX = require('./TileToWorldX');

/**
 * Gets the correct function to use to translate tiles, based on the map orientation.
 *
 * @function Phaser.Tilemaps.Components.GetTileToWorldXFunction
 * @since 3.50.0
 *
 * @param {number} orientation - The Tilemap orientation constant.
 *
 * @return {function} The function to use to translate tiles for the given map type.
 */
var GetTileToWorldXFunction = function (orientation)
{
    if (orientation === CONST.ORTHOGONAL)
    {
        return TileToWorldX;
    }
    else
    {
        return NOOP;
    }
};

module.exports = GetTileToWorldXFunction;
