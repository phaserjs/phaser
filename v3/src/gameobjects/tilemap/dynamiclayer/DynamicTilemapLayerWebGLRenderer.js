var GameObject = require('../../GameObject');

var DynamicTilemapLayerWebGLRenderer = function (renderer, gameObject, interpolationPercentage, camera)
{
    if (GameObject.RENDER_MASK !== gameObject.renderFlags || (gameObject.cameraFilter > 0 && (gameObject.cameraFilter & camera._id)))
    {
        return;
    }

    gameObject.cull(camera);

    var renderTiles = gameObject.culledTiles;
    var length = renderTiles.length;
    var batch = renderer.spriteBatch;
    var texture = gameObject.texture.source[0].glTexture;
    var textureWidth = texture.width;
    var textureHeight = texture.height;
    var tileset = this.tileset;
    var renderTarget = gameObject.renderTarget;
    var scrollFactorX = gameObject.scrollFactorX;
    var scrollFactorY = gameObject.scrollFactorY;
    var alpha = gameObject.alpha;
    var x = gameObject.x;
    var y = gameObject.y;

    for (var index = 0; index < length; ++index)
    {
        var tile = renderTiles[index];

        var tileTexCoords = tileset.getTileTextureCoordinates(tile.index);
        if (tileTexCoords === null) { continue; }

        batch.addTileTextureRect(
            texture,
            x + tile.worldX, y + tile.worldY, tile.width, tile.height, alpha * tile.alpha, tile.tint,
            scrollFactorX, scrollFactorY,
            textureWidth, textureHeight,
            tileTexCoords.x, tileTexCoords.y, tile.width, tile.height,
            camera,
            renderTarget
        );
    }
};

module.exports = DynamicTilemapLayerWebGLRenderer;
