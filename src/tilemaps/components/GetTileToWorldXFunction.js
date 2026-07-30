/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = require('../const/ORIENTATION_CONST');
var NOOP = require('../../utils/NOOP');
var TileToWorldX = require('./TileToWorldX');

/**
 * Returns the correct function to use for converting a tile X coordinate to a world X pixel
 * coordinate, based on the map orientation. For orthogonal maps, this returns the `TileToWorldX`
 * function. For all other orientations, a NOOP function is returned, as non-orthogonal maps
 * do not support this conversion.
 *
 * @function Phaser.Tilemaps.Components.GetTileToWorldXFunction
 * @since 3.50.0
 *
 * @param {number} orientation - The Tilemap orientation constant.
 *
 * @return {function} The function to use to convert tile X coordinates to world X pixel coordinates for the given map orientation.
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
