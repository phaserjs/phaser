var GameObject = require('../../GameObject');

var StaticTilemapLayerCanvasRenderer = function (renderer, gameObject, interpolationPercentage, camera)
{
    if (GameObject.RENDER_MASK !== gameObject.renderFlags || (gameObject.cameraFilter > 0 && (gameObject.cameraFilter & camera._id)))
    {
        return;
    }

    gameObject.cull(camera);


    var renderTiles = gameObject.culledTiles;
    var tileset = this.tileset;
    var ctx = renderer.gameContext;
    var tileCount = renderTiles.length;
    var image = tileset.image.getSourceImage();
    var tx = gameObject.x - camera.scrollX * gameObject.scrollFactorX;
    var ty = gameObject.y - camera.scrollY * gameObject.scrollFactorY;

    ctx.save();
    ctx.translate(tx, ty);
    ctx.rotate(gameObject.rotation);
    ctx.scale(gameObject.scaleX, gameObject.scaleY);
    ctx.scale(gameObject.flipX ? -1 : 1, gameObject.flipY ? -1 : 1);
    ctx.globalAlpha = gameObject.alpha;

    for (var index = 0; index < tileCount; ++index)
    {
        var tile = renderTiles[index];

        var tileTexCoords = tileset.getTileTextureCoordinates(tile.index);
        if (tileTexCoords === null) { continue; }

        ctx.drawImage(
            image,
            tileTexCoords.x, tileTexCoords.y,
            tile.width, tile.height,
            tile.pixelX, tile.pixelY,
            tile.width, tile.height
        );
    }

    ctx.restore();
};

module.exports = StaticTilemapLayerCanvasRenderer;
