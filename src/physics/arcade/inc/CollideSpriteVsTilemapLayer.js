var SeparateTile = require('./tilemap/SeparateTile');
var TileIntersectsBody = require('./tilemap/TileIntersectsBody');
var ProcessTileCallbacks = require('./tilemap/ProcessTileCallbacks');

var CollideSpriteVsTilemapLayer = function (sprite, tilemapLayer, collideCallback, processCallback, callbackContext, overlapOnly)
{
    var body = sprite.body;

    if (!body.enable)
    {
        return false;
    }

    var x = body.position.x;
    var y = body.position.y;
    var w = body.width;
    var h = body.height;

    // TODO: this logic should be encapsulated within the Tilemap API at some point.
    // If the map's base tile size differs from the layer's tile size, we need to adjust the
    // selection area by the difference between the two.
    var layerData = tilemapLayer.layer;
    if (layerData.tileWidth > layerData.baseTileWidth)
    {
        // The x origin of a tile is the left side, so x and width need to be adjusted.
        var xDiff = (layerData.tileWidth - layerData.baseTileWidth) * tilemapLayer.scaleX;
        x -= xDiff;
        w += xDiff;
    }
    if (layerData.tileHeight > layerData.baseTileHeight)
    {
        // The y origin of a tile is the bottom side, so just the height needs to be adjusted.
        var yDiff = (layerData.tileHeight - layerData.baseTileHeight) * tilemapLayer.scaleY;
        h += yDiff;
    }

    var mapData = tilemapLayer.getTilesWithinWorldXY(x, y, w, h);

    if (mapData.length === 0)
    {
        return false;
    }

    var tile;
    var tileWorldRect = { left: 0, right: 0, top: 0, bottom: 0 };

    for (var i = 0; i < mapData.length; i++)
    {
        tile = mapData[i];
        tileWorldRect.left = tilemapLayer.tileToWorldX(tile.x);
        tileWorldRect.top = tilemapLayer.tileToWorldY(tile.y);

        // If the map's base tile size differs from the layer's tile size, only the top of the rect
        // needs to be adjusted since it's origin is (0, 1).
        if (tile.baseHeight !== tile.height)
        {
            tileWorldRect.top -= (tile.height - tile.baseHeight) * tilemapLayer.scaleY;
        }

        tileWorldRect.right = tileWorldRect.left + tile.width * tilemapLayer.scaleX;
        tileWorldRect.bottom = tileWorldRect.top + tile.height * tilemapLayer.scaleY;

        if (TileIntersectsBody(tileWorldRect, body)
            && (!processCallback || processCallback.call(callbackContext, sprite, tile))
            && ProcessTileCallbacks(tile, sprite)
            && (overlapOnly || SeparateTile(i, body, tile, tileWorldRect, tilemapLayer, this.TILE_BIAS)))
        {
            this._total++;

            if (collideCallback)
            {
                collideCallback.call(callbackContext, sprite, tile);
            }

            if (overlapOnly && body.onOverlap)
            {
                sprite.emit('overlap', body.gameObject, tile, body, null);
            }
            else if (body.onCollide)
            {
                sprite.emit('collide', body.gameObject, tile, body, null);
            }
        }
    }
};

module.exports = CollideSpriteVsTilemapLayer;
