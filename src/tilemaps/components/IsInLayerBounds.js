/**
 * Checks if the given tile coordinates are within the bounds of the layer.
 *
 * @param {integer} tileX - [description]
 * @param {integer} tileY - [description]
 * @param {LayerData} layer - [description]
 * @return {boolean}
 */
var IsInLayerBounds = function (tileX, tileY, layer)
{
    return (tileX >= 0 && tileX < layer.width && tileY >= 0 && tileY < layer.height);
};

module.exports = IsInLayerBounds;
