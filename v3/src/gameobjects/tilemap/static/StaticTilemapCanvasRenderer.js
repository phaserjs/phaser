var GameObject = require('../../GameObject');

var StaticTilemapCanvasRenderer = function (renderer, gameObject, interpolationPercentage, camera)
{
    if (GameObject.RENDER_MASK !== gameObject.renderFlags || (gameObject.cameraFilter > 0 && (gameObject.cameraFilter & camera._id)))
    {
        return;
    }

    gameObject.upload(camera);

    var tiles = gameObject.tiles;
    var tileWidth = gameObject.tileWidth;
    var tileHeight = gameObject.tileHeight;
    var frame = gameObject.frame;
    var ctx = renderer.gameContext;
    var tileCount = tiles.length;
    var image = frame.source.image;
    var tx = gameObject.x - camera.scrollX * gameObject.scrollFactorX;
    var ty = gameObject.y - camera.scrollY * gameObject.scrollFactorY;

    ctx.save();
    ctx.translate(tx, ty);
    ctx.rotate(gameObject.rotation);
    ctx.scale(gameObject.scaleX, gameObject.scaleY);
    ctx.scale(gameObject.flipX ? -1 : 1, gameObject.flipY ? -1 : 1);

    for (var index = 0; index < tileCount; ++index)
    {
        var tile = tiles[index];

        ctx.drawImage(image, tile.frameX, tile.frameY, tileWidth, tileHeight, tile.x, tile.y, tileWidth, tileHeight);
    }

    ctx.restore();
};

module.exports = StaticTilemapCanvasRenderer;
