/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Internally used method to keep track of the tile indexes that collide within a layer. This
 * updates LayerData.collideIndexes to either contain or not contain the given `tileIndex`.
 *
 * @function Phaser.Tilemaps.Components.SetLayerCollisionIndex
 * @since 3.0.0
 *
 * @param {number} tileIndex - The tile index to set the collision boolean for.
 * @param {boolean} collides - Should the tile index collide or not?
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 */
var SetLayerCollisionIndex = function (tileIndex, collides, layer)
{
    var loc = layer.collideIndexes.indexOf(tileIndex);

    if (collides && loc === -1)
    {
        layer.collideIndexes.push(tileIndex);
    }
    else if (!collides && loc !== -1)
    {
        layer.collideIndexes.splice(loc, 1);
    }
};

module.exports = SetLayerCollisionIndex;
