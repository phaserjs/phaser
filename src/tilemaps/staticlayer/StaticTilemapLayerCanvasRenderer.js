/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GameObject = require('../../gameobjects/GameObject');

/**
 * Renders this Game Object with the Canvas Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.Tilemaps.StaticTilemapLayer#renderCanvas
 * @since 3.0.0
 * @private
 *
 * @param {Phaser.Renderer.Canvas.CanvasRenderer} renderer - A reference to the current active Canvas renderer.
 * @param {Phaser.Tilemaps.StaticTilemapLayer} src - The Game Object being rendered in this call.
 * @param {number} interpolationPercentage - Reserved for future use and custom pipelines.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 */
var StaticTilemapLayerCanvasRenderer = function (renderer, src, interpolationPercentage, camera)
{
    if (GameObject.RENDER_MASK !== src.renderFlags || (src.cameraFilter > 0 && (src.cameraFilter & camera._id)))
    {
        return;
    }

    src.cull(camera);

    var renderTiles = src.culledTiles;
    var tileset = this.tileset;
    var ctx = renderer.gameContext;
    var tileCount = renderTiles.length;
    var image = tileset.image.getSourceImage();
    var tx = src.x - camera.scrollX * src.scrollFactorX;
    var ty = src.y - camera.scrollY * src.scrollFactorY;

    ctx.save();
    ctx.translate(tx, ty);
    ctx.rotate(src.rotation);
    ctx.scale(src.scaleX, src.scaleY);
    ctx.scale(src.flipX ? -1 : 1, src.flipY ? -1 : 1);
    ctx.globalAlpha = src.alpha;

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
