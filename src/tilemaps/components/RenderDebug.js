/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetTilesWithin = require('./GetTilesWithin');
var Color = require('../../display/color');

var defaultTileColor = new Color(105, 210, 231, 150);
var defaultCollidingTileColor = new Color(243, 134, 48, 200);
var defaultFaceColor = new Color(40, 39, 37, 150);

/**
 * Draws a debug representation of the layer to the given Graphics. This is helpful when you want to
 * get a quick idea of which of your tiles are colliding and which have interesting faces. The tiles
 * are drawn starting at (0, 0) in the Graphics, allowing you to place the debug representation
 * wherever you want on the screen.
 *
 * @function Phaser.Tilemaps.Components.RenderDebug
 * @private
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.Graphics} graphics - The target Graphics object to draw upon.
 * @param {object} styleConfig - An object specifying the colors to use for the debug drawing.
 * @param {?Phaser.Display.Color} [styleConfig.tileColor=blue] - Color to use for drawing a filled rectangle at
 * non-colliding tile locations. If set to null, non-colliding tiles will not be drawn.
 * @param {?Phaser.Display.Color} [styleConfig.collidingTileColor=orange] - Color to use for drawing a filled
 * rectangle at colliding tile locations. If set to null, colliding tiles will not be drawn.
 * @param {?Phaser.Display.Color} [styleConfig.faceColor=grey] - Color to use for drawing a line at interesting
 * tile faces. If set to null, interesting tile faces will not be drawn.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 */
var RenderDebug = function (graphics, styleConfig, layer)
{
    if (styleConfig === undefined) { styleConfig = {}; }

    // Default colors without needlessly creating Color objects
    var tileColor = (styleConfig.tileColor !== undefined) ? styleConfig.tileColor : defaultTileColor;
    var collidingTileColor = (styleConfig.collidingTileColor !== undefined) ? styleConfig.collidingTileColor : defaultCollidingTileColor;
    var faceColor = (styleConfig.faceColor !== undefined) ? styleConfig.faceColor : defaultFaceColor;

    var tiles = GetTilesWithin(0, 0, layer.width, layer.height, null, layer);

    graphics.translate(layer.tilemapLayer.x, layer.tilemapLayer.y);
    graphics.scale(layer.tilemapLayer.scaleX, layer.tilemapLayer.scaleY);

    for (var i = 0; i < tiles.length; i++)
    {
        var tile = tiles[i];

        var tw = tile.width;
        var th = tile.height;
        var x = tile.pixelX;
        var y = tile.pixelY;

        var color = tile.collides ? collidingTileColor : tileColor;

        if (color !== null)
        {
            graphics.fillStyle(color.color, color.alpha / 255);
            graphics.fillRect(x, y, tw, th);
        }

        // Inset the face line to prevent neighboring tile's lines from overlapping
        x += 1;
        y += 1;
        tw -= 2;
        th -= 2;

        if (faceColor !== null)
        {
            graphics.lineStyle(1, faceColor.color, faceColor.alpha / 255);

            if (tile.faceTop) { graphics.lineBetween(x, y, x + tw, y); }
            if (tile.faceRight) { graphics.lineBetween(x + tw, y, x + tw, y + th); }
            if (tile.faceBottom) { graphics.lineBetween(x, y + th, x + tw, y + th); }
            if (tile.faceLeft) { graphics.lineBetween(x, y, x, y + th); }
        }
    }
};

module.exports = RenderDebug;
