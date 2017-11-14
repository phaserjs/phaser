var GameObject = require('../../GameObject');

var DynamicTilemapLayerCanvasRenderer = function (renderer, gameObject, interpolationPercentage, camera)
{
    if (GameObject.RENDER_MASK !== gameObject.renderFlags || (gameObject.cameraFilter > 0 && (gameObject.cameraFilter & camera._id)))
    {
        return;
    }

    gameObject.cull(camera);

    var renderTiles = gameObject.culledTiles;
    var length = renderTiles.length;
    var image = gameObject.frame.source.image;
    var tileset = this.tileset;

    var tx = gameObject.x - camera.scrollX * gameObject.scrollFactorX;
    var ty = gameObject.y - camera.scrollY * gameObject.scrollFactorY;
    var ctx = renderer.gameContext;

    ctx.save();
    ctx.translate(tx, ty);
    ctx.rotate(gameObject.rotation);
    ctx.scale(gameObject.scaleX, gameObject.scaleY);
    ctx.scale(gameObject.flipX ? -1 : 1, gameObject.flipY ? -1 : 1);

    for (var index = 0; index < length; ++index)
    {
        var tile = renderTiles[index];

        var tileTexCoords = tileset.getTileTextureCoordinates(tile.index);
        if (tileTexCoords === null) { continue; }

        renderer.setAlpha(gameObject.alpha * tile.alpha);

        ctx.drawImage(
            image,
            tileTexCoords.x, tileTexCoords.y,
            tile.width, tile.height,
            tile.worldX, tile.worldY,
            tile.width, tile.height
        );
    }

    ctx.restore();
};

module.exports = DynamicTilemapLayerCanvasRenderer;
