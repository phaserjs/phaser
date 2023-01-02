/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = require('../const/ORIENTATION_CONST');
var HexagonalTileToWorldXY = require('./HexagonalTileToWorldXY');
var IsometricTileToWorldXY = require('./IsometricTileToWorldXY');
var NOOP = require('../../utils/NOOP');
var StaggeredTileToWorldXY = require('./StaggeredTileToWorldXY');
var TileToWorldXY = require('./TileToWorldXY');

/**
 * Gets the correct function to use to translate tiles, based on the map orientation.
 *
 * @function Phaser.Tilemaps.Components.GetTileToWorldXYFunction
 * @since 3.50.0
 *
 * @param {number} orientation - The Tilemap orientation constant.
 *
 * @return {function} The function to use to translate tiles for the given map type.
 */
var GetTileToWorldXYFunction = function (orientation)
{
    if (orientation === CONST.ORTHOGONAL)
    {
        return TileToWorldXY;
    }
    else if (orientation === CONST.ISOMETRIC)
    {
        return IsometricTileToWorldXY;
    }
    else if (orientation === CONST.HEXAGONAL)
    {
        return HexagonalTileToWorldXY;
    }
    else if (orientation === CONST.STAGGERED)
    {
        return StaggeredTileToWorldXY;
    }
    else
    {
        return NOOP;
    }
};

module.exports = GetTileToWorldXYFunction;
