/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = require('../const/ORIENTATION_CONST');
var NULL = require('../../utils/NULL');
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
    else if (orientation === CONST.STAGGERED)
    {
        return StaggeredWorldToTileY;
    }
    else
    {
        return NULL;
    }
};

module.exports = GetWorldToTileYFunction;
