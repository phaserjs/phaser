/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var HexagonalTileToWorldXY = require('./HexagonalTileToWorldXY');
var Vector2 = require('../../math/Vector2');

var tempVec = new Vector2();

/**
 * Calculates and returns the six corner positions of a hexagonal tile as an array of Vector2 objects in world space.
 * The tile is identified by its tile grid coordinates and the corners are computed relative to the tile's world center,
 * taking into account the layer's stagger axis and any scale applied to the tilemap layer.
 *
 * @function Phaser.Tilemaps.Components.HexagonalGetTileCorners
 * @since 3.60.0
 *
 * @param {number} tileX - The x coordinate, in tiles, not pixels.
 * @param {number} tileY - The y coordinate, in tiles, not pixels.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to use when converting tile coordinates to world position.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *
 * @return {Phaser.Math.Vector2[]} An array of Vector2s corresponding to the world XY location of each tile corner.
 */
var HexagonalGetTileCorners = function (tileX, tileY, camera, layer)
{
    var tileWidth = layer.baseTileWidth;
    var tileHeight = layer.baseTileHeight;
    var tilemapLayer = layer.tilemapLayer;

    if (tilemapLayer)
    {
        tileWidth *= tilemapLayer.scaleX;
        tileHeight *= tilemapLayer.scaleY;
    }

    //  Sets the center of the tile into tempVec
    var center = HexagonalTileToWorldXY(tileX, tileY, tempVec, camera, layer);

    var corners = [];

    //  Hard-coded orientation values for Pointy-Top Hexagons only
    var b0 = 0.5773502691896257; // Math.sqrt(3) / 3

    var hexWidth;
    var hexHeight;

    if (layer.staggerAxis === 'y')
    {
        hexWidth = b0 * tileWidth;
        hexHeight = tileHeight / 2;
    }
    else
    {
        hexWidth = tileWidth / 2;
        hexHeight = b0 * tileHeight;
    }

    for (var i = 0; i < 6; i++)
    {
        var angle = 2 * Math.PI * (0.5 - i) / 6;

        corners.push(new Vector2(center.x + (hexWidth * Math.cos(angle)), center.y + (hexHeight * Math.sin(angle))));
    }

    return corners;
};

module.exports = HexagonalGetTileCorners;
