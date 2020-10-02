/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = require('../const');
var CullTiles = require('./CullTiles');
var HexagonalCullTiles = require('./HexagonalCullTiles');
var IsometricCullTiles = require('./IsometricCullTiles');
var NOOP = require('../../utils/NOOP');
var StaggeredCullTiles = require('./StaggeredCullTiles');

/**
 * Gets the correct function to use to cull tiles, based on the map orientation.
 *
 * @function Phaser.Tilemaps.Components.GetCullTilesFunction
 * @since 3.50.0
 *
 * @param {number} orientation - The Tilemap orientation constant.
 *
 * @return {(Phaser.Tilemaps.Components.CullTiles|Phaser.Tilemaps.Components.StaggeredCullTiles|Phaser.Tilemaps.Components.HexagonalCullTiles|Phaser.Tilemaps.Components.IsometricCullTiles)} The function to use to cull tiles for the given map type.
 */
var GetCullTilesFunction = function (orientation)
{
    if (orientation === CONST.ORTHOGONAL)
    {
        return CullTiles;
    }
    else if (orientation === CONST.HEXAGONAL)
    {
        return HexagonalCullTiles;
    }
    else if (orientation === CONST.STAGGERED)
    {
        return StaggeredCullTiles;
    }
    else if (orientation === CONST.ISOMETRIC)
    {
        return IsometricCullTiles;
    }
    else
    {
        return NOOP;
    }
};

module.exports = GetCullTilesFunction;
