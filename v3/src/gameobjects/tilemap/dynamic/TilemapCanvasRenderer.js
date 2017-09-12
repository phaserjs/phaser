var GameObject = require('../../GameObject');

var TilemapCanvasRenderer = function (renderer, gameObject, interpolationPercentage, camera)
{
    if (GameObject.RENDER_MASK !== gameObject.renderFlags || (gameObject.cameraFilter > 0 && (gameObject.cameraFilter & camera._id)))
    {
        return;
    }

    gameObject.cull(camera);

    var tiles = gameObject.culledTiles;
    var tileCount = tiles.length;
    var image = gameObject.frame.source.image;
    var scrollFactorX = gameObject.scrollFactorX;
    var scrollFactorY = gameObject.scrollFactorY;
    var alpha = gameObject.alpha;
    var tx = gameObject.x - camera.scrollX * gameObject.scrollFactorX;
    var ty = gameObject.y - camera.scrollY * gameObject.scrollFactorY;
    var ctx = renderer.gameContext;

    ctx.save();
    ctx.translate(tx, ty);
    ctx.rotate(gameObject.rotation);
    ctx.scale(gameObject.scaleX, gameObject.scaleY);
    ctx.scale(gameObject.flipX ? -1 : 1, gameObject.flipY ? -1 : 1);

    for (var index = 0; index < tileCount; ++index)
    {
        var tile = tiles[index];

        ctx.drawImage(
            image, 
            tile.frameX, tile.frameY, 
            tile.frameWidth, tile.frameHeight, 
            tile.x, tile.y, 
            tile.frameWidth, tile.frameHeight
        );
    }

    ctx.restore();
};

module.exports = TilemapCanvasRenderer;
