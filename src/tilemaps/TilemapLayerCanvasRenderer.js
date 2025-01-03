/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var TransformMatrix = require('../gameobjects/components/TransformMatrix');

var tempMatrix1 = new TransformMatrix();
var tempMatrix2 = new TransformMatrix();
var tempMatrix3 = new TransformMatrix();

/**
 * Renders this Game Object with the Canvas Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.Tilemaps.TilemapLayer#renderCanvas
 * @since 3.50.0
 * @private
 *
 * @param {Phaser.Renderer.Canvas.CanvasRenderer} renderer - A reference to the current active Canvas renderer.
 * @param {Phaser.Tilemaps.TilemapLayer} src - The Game Object being rendered in this call.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var TilemapLayerCanvasRenderer = function (renderer, src, camera, parentMatrix)
{
    var renderTiles = src.cull(camera);

    var tileCount = renderTiles.length;
    var alpha = camera.alpha * src.alpha;

    if (tileCount === 0 || alpha <= 0)
    {
        return;
    }

    var camMatrix = tempMatrix1;
    var layerMatrix = tempMatrix2;
    var calcMatrix = tempMatrix3;

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

        //  Multiply by the Sprite matrix, store result in calcMatrix
        camMatrix.multiply(layerMatrix, calcMatrix);

        calcMatrix.copyToContext(ctx);
    }
    else
    {
        layerMatrix.e -= camera.scrollX * src.scrollFactorX;
        layerMatrix.f -= camera.scrollY * src.scrollFactorY;

        layerMatrix.copyToContext(ctx);
    }

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
        var tileWidth = tileset.tileWidth;
        var tileHeight = tileset.tileHeight;

        if (tileTexCoords === null || tileWidth === 0 || tileHeight === 0)
        {
            continue;
        }

        var halfWidth = tileWidth * 0.5;
        var halfHeight = tileHeight * 0.5;

        tileTexCoords.x += tileset.tileOffset.x;
        tileTexCoords.y += tileset.tileOffset.y;

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
            tileWidth , tileHeight,
            -halfWidth, -halfHeight,
            tileWidth, tileHeight
        );

        ctx.restore();
    }

    ctx.restore();
};

module.exports = TilemapLayerCanvasRenderer;
