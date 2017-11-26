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
    var sx = gameObject.scaleX;
    var sy = gameObject.scaleY;

    for (var index = 0; index < length; ++index)
    {
        var tile = renderTiles[index];

        var tileTexCoords = tileset.getTileTextureCoordinates(tile.index);
        if (tileTexCoords === null) { continue; }

        var frameWidth = tile.width * (tile.flipX ? -1 : 1);
        var frameHeight = tile.height * (tile.flipY ? -1 : 1);
        var frameX = tileTexCoords.x + (tile.flipX ? tile.width : 0);
        var frameY = tileTexCoords.y + (tile.flipY ? tile.height : 0);

        batch.addTileTextureRect(
            texture,
            x + tile.worldX * sx, y + tile.worldY * sy,
            tile.width * sx, tile.height * sy,
            alpha * tile.alpha, tile.tint,
            scrollFactorX, scrollFactorY,
            textureWidth, textureHeight,
            frameX, frameY, frameWidth, frameHeight,
            camera,
            renderTarget
        );
    }
};

module.exports = DynamicTilemapLayerWebGLRenderer;
