/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Converts from world X coordinates (pixels) to tile X coordinates (tile units), factoring in the
 * layer's position, scale and scroll.
 *
 * @function Phaser.Tilemaps.Components.WorldToTileX
 * @private
 * @since 3.0.0
 *
 * @param {number} worldX - The x coordinate to be converted, in pixels, not tiles.
 * @param {boolean} [snapToFloor=true] - Whether or not to round the tile coordinate down to the nearest integer.
 * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - The Camera to use when calculating the tile index from the world values.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 * @param {string} orientation - The Tilemap's orientation
 * 
 * @return {number} The X location in tile units.
 */
var WorldToTileX = function (worldX, snapToFloor, camera, layer, orientation)
{


    if (snapToFloor === undefined) { snapToFloor = true; }

    var tileWidth = layer.baseTileWidth;
    var tileHeight = layer.baseTileHeight;
    var tilemapLayer = layer.tilemapLayer;

    if (tilemapLayer)
    {
        if (camera === undefined) { camera = tilemapLayer.scene.cameras.main; }

        // Find the world position relative to the static or dynamic layer's top left origin,
        // factoring in the camera's vertical scroll
        worldY = worldY - (tilemapLayer.y + camera.scrollY * (1 - tilemapLayer.scrollFactorY));

        tileHeight *= tilemapLayer.scaleY;

        // Find the world position relative to the static or dynamic layer's top left origin,
        // factoring in the camera's horizontal scroll
        worldX = worldX - (tilemapLayer.x + camera.scrollX * (1 - tilemapLayer.scrollFactorX));

        tileWidth *= tilemapLayer.scaleX;
    }

    if (orientation === "orthogonal") {
        return snapToFloor
            ? Math.floor(worldX / tileWidth)
            : worldX / tileWidth;
    } else if (orientation === "isometric") {
        return snapToFloor
            ? Math.floor((worldX/(tileWidth/2) + worldY/(tileHeight/2))/2) 
            : ((worldX/(tileWidth/2) + worldY/(tileHeight/2))/2);

    }
   
};

module.exports = WorldToTileX;
