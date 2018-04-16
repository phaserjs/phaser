/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Internally used method to keep track of the tile indexes that collide within a layer. This
 * updates LayerData.collideIndexes to either contain or not contain the given `tileIndex`.
 *
 * @function Phaser.Tilemaps.Components.SetLayerCollisionIndex
 * @private
 * @since 3.0.0
 *
 * @param {integer} tileIndex - [description]
 * @param {boolean} [collides=true] - [description]
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
