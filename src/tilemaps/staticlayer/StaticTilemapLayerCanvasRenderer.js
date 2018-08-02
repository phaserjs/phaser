/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

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
    src.cull(camera);

    var renderTiles = src.culledTiles;
    var tileset = this.tileset;
    var ctx = renderer.currentContext;
    var tileCount = renderTiles.length;

    var image = tileset.image.getSourceImage();

    var camMatrix = renderer._tempMatrix1;
    var layerMatrix = renderer._tempMatrix2;
    var calcMatrix = renderer._tempMatrix3;

    layerMatrix.applyITRS(src.x, src.y, src.rotation, src.scaleX, src.scaleY);

    ctx.save();

    camMatrix.copyFrom(camera.matrix);

    layerMatrix.e -= camera.scrollX * src.scrollFactorX;
    layerMatrix.f -= camera.scrollY * src.scrollFactorY;

    //  Multiply by the Sprite matrix, store result in calcMatrix
    camMatrix.multiply(layerMatrix, calcMatrix);

    calcMatrix.copyToContext(ctx);

    ctx.globalAlpha = camera.alpha * src.alpha;

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
