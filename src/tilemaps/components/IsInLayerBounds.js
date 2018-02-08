/**
 * Checks if the given tile coordinates are within the bounds of the layer.
 *
 * @function Phaser.Tilemaps.Components.IsInLayerBounds
 * @since 3.0.0
 *
 * @param {integer} tileX - [description]
 * @param {integer} tileY - [description]
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 * 
 * @return {boolean}
 */
var IsInLayerBounds = function (tileX, tileY, layer)
{
    return (tileX >= 0 && tileX < layer.width && tileY >= 0 && tileY < layer.height);
};

module.exports = IsInLayerBounds;
