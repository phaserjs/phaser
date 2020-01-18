/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
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

    var gidMap = src.gidMap;
    var pipeline = src.pipeline;

    var getTint = Utils.getTintAppendFloatAlphaAndSwap;

    var scrollFactorX = src.scrollFactorX;
    var scrollFactorY = src.scrollFactorY;

    var x = src.x;
    var y = src.y;

    var sx = src.scaleX;
    var sy = src.scaleY;

    var tilesets = src.tileset;

    //  Loop through each tileset in this layer, drawing just the tiles that are in that set each time
    //  Doing it this way around allows us to batch tiles using the same tileset
    for (var c = 0; c < tilesets.length; c++)
    {
        var currentSet = tilesets[c];
        var texture = currentSet.glTexture;

        for (var i = 0; i < tileCount; i++)
        {
            var tile = renderTiles[i];

            var tileset = gidMap[tile.index];

            if (tileset !== currentSet)
            {
                //  Skip tiles that aren't in this set
                continue;
            }
       
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
                x + ((tw + tile.pixelX) * sx), y + ((th + tile.pixelY) * sy),
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
                true
            );
        }
    }
};

module.exports = DynamicTilemapLayerWebGLRenderer;
