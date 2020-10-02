/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Checks if the given tile coordinate is within the isometric layer bounds, or not.
 *
 * @function Phaser.Tilemaps.Components.CheckIsoBounds
 * @since 3.50.0
 *
 * @param {integer} tileX - The x coordinate, in tiles, not pixels.
 * @param {integer} tileY - The y coordinate, in tiles, not pixels.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to check against.
 * @param {Phaser.Cameras.Scene2D.Camera} [camera] - The Camera to run the cull check against.
 *
 * @return {boolean} Returns `true` if the coordinates are within the iso bounds.
 */
var CheckIsoBounds = function (tileX, tileY, layer, camera)
{
    var tilemapLayer = layer.tilemapLayer;
    var cullDistances = tilemapLayer.isoCullDistances;
    var pos = tilemapLayer.tileToWorldXY(tileX,tileY,undefined,camera);

    // we always subtract 1/2 of the tile's height/width to make the culling distance start from the center of the tiles.
    return pos.x > camera.worldView.x + tilemapLayer.scaleX * layer.tileWidth * (- cullDistances.x - 1 / 2)
        && pos.x < camera.worldView.right + tilemapLayer.scaleX * layer.tileWidth * (cullDistances.x - 1 / 2)
        && pos.y > camera.worldView.y + tilemapLayer.scaleY * layer.tileHeight * (- cullDistances.y - 1 / 2)
        && pos.y < camera.worldView.bottom + tilemapLayer.scaleY * layer.tileHeight * (cullDistances.y - 1 / 2);
};

module.exports = CheckIsoBounds;
