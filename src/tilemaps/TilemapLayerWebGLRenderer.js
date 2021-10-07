/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Utils = require('../renderer/webgl/Utils');

/**
 * Renders this Game Object with the WebGL Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.Tilemaps.TilemapLayer#renderWebGL
 * @since 3.0.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {Phaser.Tilemaps.TilemapLayer} src - The Game Object being rendered in this call.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 */
var TilemapLayerWebGLRenderer = function (renderer, src, camera)
{
    var renderTiles = src.cull(camera);

    var tileCount = renderTiles.length;
    var alpha = camera.alpha * src.alpha;

    if (tileCount === 0 || alpha <= 0)
    {
        return;
    }

    var gidMap = src.gidMap;
    var pipeline = renderer.pipelines.set(src.pipeline, src);

    var getTint = Utils.getTintAppendFloatAlpha;

    var scrollFactorX = src.scrollFactorX;
    var scrollFactorY = src.scrollFactorY;

    var x = src.x;
    var y = src.y;

    var sx = src.scaleX;
    var sy = src.scaleY;

    renderer.pipelines.preBatch(src);

    for (var i = 0; i < tileCount; i++)
    {
        var tile = renderTiles[i];

        var tileset = gidMap[tile.index];

        if (!tileset)
        {
            continue;
        }

        var tileTexCoords = tileset.getTileTextureCoordinates(tile.index);

        if (tileTexCoords === null)
        {
            continue;
        }

        var texture = tileset.glTexture;

        var textureUnit = pipeline.setTexture2D(texture, src);

        var frameWidth = tileset.tileWidth;
        var frameHeight = tileset.tileHeight;

        var frameX = tileTexCoords.x;
        var frameY = tileTexCoords.y;

        var tw = tileset.tileWidth * 0.5;
        var th = tileset.tileHeight * 0.5;

        var tOffsetX = tileset.tileOffset.x;
        var tOffsetY = tileset.tileOffset.y;

        var tint = getTint(tile.tint, alpha * tile.alpha);

        pipeline.batchTexture(
            src,
            texture,
            texture.width, texture.height,
            x + tile.pixelX * sx + (tw * sx - tOffsetX), y + tile.pixelY * sy + (th * sy - tOffsetY),
            tile.width, tile.height,
            sx, sy,
            tile.rotation,
            tile.flipX, tile.flipY,
            scrollFactorX, scrollFactorY,
            tw, th,
            frameX, frameY, frameWidth, frameHeight,
            tint, tint, tint, tint, false,
            0, 0,
            camera,
            null,
            true,
            textureUnit
        );
    }

    renderer.pipelines.postBatch(src);
};

module.exports = TilemapLayerWebGLRenderer;
