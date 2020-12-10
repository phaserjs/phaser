/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = require('../const/ORIENTATION_CONST');
var HexagonalWorldToTileY = require('./HexagonalWorldToTileY');
var NOOP = require('../../utils/NOOP');
var StaggeredWorldToTileY = require('./StaggeredWorldToTileY');
var WorldToTileY = require('./WorldToTileY');

/**
 * Gets the correct function to use to translate tiles, based on the map orientation.
 *
 * @function Phaser.Tilemaps.Components.GetWorldToTileYFunction
 * @since 3.50.0
 *
 * @param {number} orientation - The Tilemap orientation constant.
 *
 * @return {function} The function to use to translate tiles for the given map type.
 */
var GetWorldToTileYFunction = function (orientation)
{
    if (orientation === CONST.ORTHOGONAL)
    {
        return WorldToTileY;
    }
    else if (orientation === CONST.HEXAGONAL)
    {
        return HexagonalWorldToTileY;
    }
    else if (orientation === CONST.STAGGERED)
    {
        return StaggeredWorldToTileY;
    }
    else
    {
        return NOOP;
    }
};

module.exports = GetWorldToTileYFunction;
