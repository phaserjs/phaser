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

    var mapData = tilemapLayer.getTilesWithinWorldXY(
        body.position.x, body.position.y,
        body.width, body.height
    );

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
        tileWorldRect.right = tileWorldRect.left + tile.width * tilemapLayer.scaleX;
        tileWorldRect.bottom = tileWorldRect.top + tile.height * tilemapLayer.scaleY;

        if (TileIntersectsBody(tileWorldRect, body)
            && (!processCallback || processCallback.call(callbackContext, sprite, tile))
            && ProcessTileCallbacks(tile)
            && (overlapOnly || SeparateTile(i, body, tile, tileWorldRect, tilemapLayer, this.TILE_BIAS)))
        {
            this._total++;

            if (collideCallback)
            {
                collideCallback.call(callbackContext, sprite, tile);
            }
        }
    }
};

module.exports = CollideSpriteVsTilemapLayer;
