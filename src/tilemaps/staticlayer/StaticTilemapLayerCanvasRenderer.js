/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
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
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var StaticTilemapLayerCanvasRenderer = function (renderer, src, interpolationPercentage, camera, parentMatrix)
{
    src.cull(camera);

    var renderTiles = src.culledTiles;
    var tileCount = renderTiles.length;

    if (tileCount === 0)
    {
        return;
    }

    var camMatrix = renderer._tempMatrix1;
    var layerMatrix = renderer._tempMatrix2;
    var calcMatrix = renderer._tempMatrix3;

    layerMatrix.applyITRS(src.x, src.y, src.rotation, src.scaleX, src.scaleY);

    camMatrix.copyFrom(camera.matrix);

    var ctx = renderer.currentContext;
    var gidMap = src.gidMap;

    ctx.save();

    if (parentMatrix)
    {
        //  Multiply the camera by the parent matrix
        camMatrix.multiplyWithOffset(parentMatrix, -camera.scrollX * src.scrollFactorX, -camera.scrollY * src.scrollFactorY);

        //  Undo the camera scroll
        layerMatrix.e = src.x;
        layerMatrix.f = src.y;

        camMatrix.multiply(layerMatrix, calcMatrix);

        calcMatrix.copyToContext(ctx);
    }
    else
    {
        //  Undo the camera scroll
        layerMatrix.e -= camera.scrollX * src.scrollFactorX;
        layerMatrix.f -= camera.scrollY * src.scrollFactorY;

        layerMatrix.copyToContext(ctx);
    }

    var alpha = camera.alpha * src.alpha;

    if (!renderer.antialias || src.scaleX > 1 || src.scaleY > 1)
    {
        ctx.imageSmoothingEnabled = false;
    }

    for (var i = 0; i < tileCount; i++)
    {
        var tile = renderTiles[i];

        var tileset = gidMap[tile.index];

        if (!tileset)
        {
            continue;
        }

        var image = tileset.image.getSourceImage();
        var tileTexCoords = tileset.getTileTextureCoordinates(tile.index);

        if (tileTexCoords)
        {
            var tileWidth = tileset.tileWidth;
            var tileHeight = tileset.tileHeight;
            var halfWidth = tileWidth / 2;
            var halfHeight = tileHeight / 2;
    
            ctx.save();

            ctx.translate(tile.pixelX + halfWidth, tile.pixelY + halfHeight);

            if (tile.rotation !== 0)
            {
                ctx.rotate(tile.rotation);
            }
    
            if (tile.flipX || tile.flipY)
            {
                ctx.scale((tile.flipX) ? -1 : 1, (tile.flipY) ? -1 : 1);
            }

            ctx.globalAlpha = alpha * tile.alpha;
    
            ctx.drawImage(
                image,
                tileTexCoords.x, tileTexCoords.y,
                tileWidth, tileHeight,
                -halfWidth, -halfHeight,
                tileWidth, tileHeight
            );
    
            ctx.restore();
        }
    }

    ctx.restore();
};

module.exports = StaticTilemapLayerCanvasRenderer;
