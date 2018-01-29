var GameObject = require('../../GameObject');
var Utils = require('../../../renderer/webgl/Utils');

var DynamicTilemapLayerWebGLRenderer = function (renderer, tilemapLayer, interpolationPercentage, camera)
{
    if (GameObject.RENDER_MASK !== tilemapLayer.renderFlags || (tilemapLayer.cameraFilter > 0 && (tilemapLayer.cameraFilter & camera._id)))
    {
        return;
    }

    tilemapLayer.cull(camera);

    var renderTiles = tilemapLayer.culledTiles;
    var length = renderTiles.length;
    var texture = tilemapLayer.tileset.image.get().source.glTexture;
    var tileset = tilemapLayer.tileset;
    var scrollFactorX = tilemapLayer.scrollFactorX;
    var scrollFactorY = tilemapLayer.scrollFactorY;
    var alpha = tilemapLayer.alpha;
    var x = tilemapLayer.x;
    var y = tilemapLayer.y;
    var sx = tilemapLayer.scaleX;
    var sy = tilemapLayer.scaleY;
    var getTint = Utils.getTintAppendFloatAlpha;
    var pipeline = this.pipeline; 

    for (var index = 0; index < length; ++index)
    {
        var tile = renderTiles[index];

        var tileTexCoords = tileset.getTileTextureCoordinates(tile.index);
        if (tileTexCoords === null) { continue; }

        var frameWidth = tile.width * (tile.flipX ? -1 : 1);
        var frameHeight = tile.height * (tile.flipY ? -1 : 1);
        var frameX = tileTexCoords.x + (tile.flipX ? tile.width : 0);
        var frameY = tileTexCoords.y + (tile.flipY ? tile.height : 0);
        var tint = getTint(tile.tint, alpha * tile.alpha);

        pipeline.batchTexture(
            texture,
            texture.width, texture.height,
            x + tile.pixelX * sx, y + tile.pixelY * sy,
            tile.width * sx, tile.height * sy,
            1, 1,
            0,
            false, false,
            scrollFactorX, scrollFactorY,
            0, 0,
            frameX, frameY, frameWidth, frameHeight,
            tint, tint, tint, tint,
            0, 0,
            camera
        );
    }    
};

module.exports = DynamicTilemapLayerWebGLRenderer;
