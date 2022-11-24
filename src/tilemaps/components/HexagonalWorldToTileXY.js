/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Vector2 = require('../../math/Vector2');

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
var layout_flat = Orientation(3.0 / 2.0, 0.0, Math.sqrt(3.0) / 2.0, Math.sqrt(3.0), 2.0 / 3.0, 0.0, -1.0 / 3.0, Math.sqrt(3.0) / 3.0, 0.0);

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

/**
 * Converts from world XY coordinates (pixels) to hexagonal tile XY coordinates (tile units), factoring in the
 * layer's position, scale and scroll. This will return a new Vector2 object or update the given
 * `point` object.
 *
 * @function Phaser.Tilemaps.Components.HexagonalWorldToTileXY
 * @since 3.50.0
 *
 * @param {number} worldX - The x coordinate to be converted, in pixels, not tiles.
 * @param {number} worldY - The y coordinate to be converted, in pixels, not tiles.
 * @param {boolean} snapToFloor - Whether or not to round the tile coordinates down to the nearest integer.
 * @param {Phaser.Math.Vector2} point - A Vector2 to store the coordinates in. If not given a new Vector2 is created.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to use when calculating the tile index from the world values.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *
 * @return {Phaser.Math.Vector2} The XY location in tile units.
 */
var HexagonalWorldToTileXY = function (worldX, worldY, snapToFloor, point, camera, layer)
{
    if (!point) { point = new Vector2(); }

    var tileWidth = layer.baseTileWidth;
    var tileHeight = layer.baseTileHeight;
    var tilemapLayer = layer.tilemapLayer;

    var drawDebug = (worldX === 0 && worldY === 0);

    if (tilemapLayer)
    {
        if (!camera) { camera = tilemapLayer.scene.cameras.main; }

        // Find the world position relative to the static or dynamic layer's top left origin,
        // factoring in the camera's vertical scroll

        worldX = worldX - (tilemapLayer.x + camera.scrollX * (1 - tilemapLayer.scrollFactorX));
        worldY = worldY - (tilemapLayer.y + camera.scrollY * (1 - tilemapLayer.scrollFactorY));

        tileWidth *= tilemapLayer.scaleX;
        tileHeight *= tilemapLayer.scaleY;
    }

    var layout = Layout(layout_pointy, new Vector2(37, 34), new Vector2(33, 34));

    if (drawDebug)
    {
        if (window.HEX_DEBUG)
        {
            var g = window.HEX_DEBUG;

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
        }
    }
    else
    {
        var M = layout_pointy;
        var size = { x: 37, y: 34 };
        var origin = { x: 33, y: 34 };
        var pt = new Vector2((worldX - origin.x) / size.x, (worldY - origin.y) / size.y);
        var q = M.b0 * pt.x + M.b1 * pt.y;
        var r = M.b2 * pt.x + M.b3 * pt.y;
        var h = Hex(q, r, -q - r); // cubed
        var hr = hex_round(h);

        console.log('xy', worldX, worldY, 'pt', pt);
        console.log('Hex', h);
        console.log('HexRound', hr);

        var y = hr.r;
        var x = (y % 2 === 0) ? (hr.r / 2) + hr.q : (hr.r / 2) + hr.q - 0.5;

        if (window.HEX_DEBUG)
        {
            var g = window.HEX_DEBUG;

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
        }
    }

    /*
    console.log(layout_pointy);


    // Rectangle. Store Hex(q, r) at array[r][q + floor(r/2)].
    // Each row has the same length. This is equivalent to odd-r offset.

    var y = hr.r;
    var x = hr.q + (hr.r + ODD * (hr.r & 1)) / 2;

    console.log('grid', x, y);

    // var offset = rdoubled_from_cube(hr);

    // var x = roundedCube.x;
    // var y = roundedCube.y;

    // var x = hr.q;
    // var y = hr.r;

    // console.log('cube', roundedCube);

    // console.log('Offset', offset);

    // console.log('Cube', roundedCube);

    // var len = layer.hexSideLength;
    // var rowHeight = ((tileHeight - len) / 2 + len);

    //  (68 - 32) = 36
    //  36 / 2 = 18
    //  18 + len (32) = 50
    // console.log('rowH', rowHeight, 'len', len);

    // var y = worldY / rowHeight;
    // var x = (worldX - (y % 2 === 1) * 0.5 * tileWidth) / tileWidth;

    // var y = (snapToFloor) ? Math.floor((worldY / rowHeight)) : (worldY / rowHeight);
    // var x = (snapToFloor) ? Math.floor((worldX - (y % 2) * 0.5 * tileWidth) / tileWidth) : (worldX - (y % 2) * 0.5 * tileWidth) / tileWidth;

    // var x = offset.row;
    // var y = offset.col;
    */

    // var x = 0;
    // var y = 0;

    return point.set(x, y);
};

module.exports = HexagonalWorldToTileXY;
