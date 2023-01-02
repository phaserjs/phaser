/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
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
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.Graphics} graphics - The target Graphics object to draw upon.
 * @param {Phaser.Types.Tilemaps.DebugStyleOptions} styleConfig - An object specifying the colors to use for the debug drawing.
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

    graphics.translateCanvas(layer.tilemapLayer.x, layer.tilemapLayer.y);
    graphics.scaleCanvas(layer.tilemapLayer.scaleX, layer.tilemapLayer.scaleY);

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

/**

function Orientation(f0, f1, f2, f3, b0, b1, b2, b3, start_angle) {
    return {f0: f0, f1: f1, f2: f2, f3: f3, b0: b0, b1: b1, b2: b2, b3: b3, start_angle: start_angle};
}

function Layout(orientation, size, origin) {
    return {orientation: orientation, size: size, origin: origin};
}

function Hex(q, r, s) {
    return {q: q, r: r, s: s};
}

function hex_round(h)
{
    var qi = Math.round(h.q);
    var ri = Math.round(h.r);
    var si = Math.round(h.s);
    var q_diff = Math.abs(qi - h.q);
    var r_diff = Math.abs(ri - h.r);
    var s_diff = Math.abs(si - h.s);
    if (q_diff > r_diff && q_diff > s_diff)
    {
        qi = -ri - si;
    }
    else
        if (r_diff > s_diff)
        {
            ri = -qi - si;
        }
        else
        {
            si = -qi - ri;
        }
    return Hex(qi, ri, si);
}

var layout_pointy = Orientation(Math.sqrt(3.0), Math.sqrt(3.0) / 2.0, 0.0, 3.0 / 2.0, Math.sqrt(3.0) / 3.0, -1.0 / 3.0, 0.0, 2.0 / 3.0, 0.5);

function OffsetCoord(col, row) {
    return {col: col, row: row};
}

var EVEN = 1;
var ODD = -1;

function roffset_from_cube(offset, h)
{
    var col = h.q + (h.r + offset * (h.r & 1)) / 2;
    var row = h.r;
    return OffsetCoord(col, row);
}

function roffset_to_cube(offset, h)
{
    var q = h.col - (h.row + offset * (h.row & 1)) / 2;
    var r = h.row;
    var s = -q - r;
    return Hex(q, r, s);
}

function hex_to_pixel(layout, h)
{
    var M = layout.orientation;
    var size = layout.size;
    var origin = layout.origin;
    var x = (M.f0 * h.q + M.f1 * h.r) * size.x;
    var y = (M.f2 * h.q + M.f3 * h.r) * size.y;
    return new Vector2(x + origin.x, y + origin.y);
}

function hex_corner_offset(layout, corner)
{
    var M = layout.orientation;
    var size = layout.size;
    var angle = 2.0 * Math.PI * (M.start_angle - corner) / 6.0;
    return new Vector2(size.x * Math.cos(angle), size.y * Math.sin(angle));
}

function polygon_corners(layout, h)
{
    var corners = [];
    var center = hex_to_pixel(layout, h);
    for (var i = 0; i < 6; i++)
    {
        var offset = hex_corner_offset(layout, i);
        corners.push(new Vector2(center.x + offset.x, center.y + offset.y));
    }
    return corners;
}

var layout = Layout(layout_pointy, new Vector2(tileHeight/2, tileWidth/2), new Vector2(tileWidth/2, tileWidth/2));

for (var q = 0; q <= 9; q++)
{
    for (var r = 0; r <= 9; r++)
    {
        var h = Hex(q, r, -q - r); // cubed
        // var hr = hex_round(h);
        // var o = roffset_from_cube(ODD, hr);
        // var b = roffset_to_cube(ODD, o);

        var c = polygon_corners(layout, h);

        if (q === 0 && r === 0)
        {
            console.log(c);
        }

        g.beginPath();
        g.moveTo(Math.floor(c[0].x), Math.floor(c[0].y));

        for (var i = 1; i < c.length; i++)
        {
            g.lineTo(Math.floor(c[i].x), Math.floor(c[i].y));
        }

        g.closePath();
        g.strokePath();
    }
}

            var c = polygon_corners(layout, hr);

            g.beginPath();
            g.moveTo(Math.floor(c[0].x), Math.floor(c[0].y));

            for (var i = 1; i < c.length; i++)
            {
                g.lineTo(Math.floor(c[i].x), Math.floor(c[i].y));
            }

            g.closePath();
            g.fillPath();

            // g.scene.add.text(c[3].x + 2, c[3].y + 6, `${hr.q} x ${hr.r}`);
            g.scene.add.text(c[3].x + 2, c[3].y + 6, `${x} x ${y}`);


*/
