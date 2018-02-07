/**
 * Internally used method to keep track of the tile indexes that collide within a layer. This
 * updates LayerData.collideIndexes to either contain or not contain the given `tileIndex`.
 *
 * @param {integer} tileIndex - [description]
 * @param {boolean} [collides=true] - [description]
 * @param {LayerData} layer - [description]
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
