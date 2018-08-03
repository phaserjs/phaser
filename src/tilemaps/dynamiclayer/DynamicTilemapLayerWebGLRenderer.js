/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Utils = require('../../renderer/webgl/Utils');

/**
 * Renders this Game Object with the WebGL Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.Tilemaps.DynamicTilemapLayer#renderWebGL
 * @since 3.0.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {Phaser.Tilemaps.DynamicTilemapLayer} src - The Game Object being rendered in this call.
 * @param {number} interpolationPercentage - Reserved for future use and custom pipelines.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 */
var DynamicTilemapLayerWebGLRenderer = function (renderer, src, interpolationPercentage, camera)
{
    src.cull(camera);

    var renderTiles = src.culledTiles;
    var tileCount = renderTiles.length;
    var alpha = camera.alpha * src.alpha;

    if (tileCount === 0 || alpha <= 0)
    {
        return;
    }

    var pipeline = this.pipeline;

    var getTint = Utils.getTintAppendFloatAlpha;

    var tileset = src.tileset;
    var texture = tileset.glTexture;

    var scrollFactorX = src.scrollFactorX;
    var scrollFactorY = src.scrollFactorY;

    var x = src.x;
    var y = src.y;

    var sx = src.scaleX;
    var sy = src.scaleY;

    for (var i = 0; i < tileCount; i++)
    {
        var tile = renderTiles[i];

        var tileTexCoords = tileset.getTileTextureCoordinates(tile.index);

        if (tileTexCoords === null)
        {
            continue;
        }

        var frameWidth = tile.width;
        var frameHeight = tile.height;

        var frameX = tileTexCoords.x;
        var frameY = tileTexCoords.y;

        var tw = tile.width * 0.5;
        var th = tile.height * 0.5;

        var tint = getTint(tile.tint, alpha * tile.alpha);

        pipeline.batchTexture(
            src,
            texture,
            texture.width, texture.height,
            tw + x + tile.pixelX * sx, th + y + tile.pixelY * sy,
            tile.width * sx, tile.height * sy,
            1, 1,
            tile.rotation,
            tile.flipX, tile.flipY,
            scrollFactorX, scrollFactorY,
            tw, th,
            frameX, frameY, frameWidth, frameHeight,
            tint, tint, tint, tint, false,
            0, 0,
            camera,
            null
        );
    }
};

module.exports = DynamicTilemapLayerWebGLRenderer;
