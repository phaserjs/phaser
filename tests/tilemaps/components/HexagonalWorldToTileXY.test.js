var HexagonalWorldToTileXY = require('../../../src/tilemaps/components/HexagonalWorldToTileXY');
var Vector2 = require('../../../src/math/Vector2');

describe('Phaser.Tilemaps.Components.HexagonalWorldToTileXY', function ()
{
    var layerY;
    var layerX;

    function makeLayer (overrides)
    {
        var defaults = {
            baseTileWidth: 32,
            baseTileHeight: 32,
            tilemapLayer: null,
            staggerAxis: 'y',
            staggerIndex: 'odd'
        };

        if (overrides)
        {
            for (var key in overrides)
            {
                defaults[key] = overrides[key];
            }
        }

        return defaults;
    }

    function makeLayerWithTilemapLayer (overrides)
    {
        var tilemapLayer = {
            x: 0,
            y: 0,
            scrollFactorX: 1,
            scrollFactorY: 1,
            scaleX: 1,
            scaleY: 1,
            scene: {
                cameras: {
                    main: { scrollX: 0, scrollY: 0 }
                }
            }
        };

        if (overrides && overrides.tilemapLayer)
        {
            for (var key in overrides.tilemapLayer)
            {
                tilemapLayer[key] = overrides.tilemapLayer[key];
            }
        }

        var layer = makeLayer(overrides);
        layer.tilemapLayer = tilemapLayer;

        return layer;
    }

    // -------------------------------------------------------------------------
    // Return value and point argument
    // -------------------------------------------------------------------------

    describe('return value', function ()
    {
        it('should return a new Vector2 when no point is provided', function ()
        {
            var layer = makeLayer();
            var result = HexagonalWorldToTileXY(16, 16, true, null, null, layer);

            expect(result).toBeInstanceOf(Vector2);
        });

        it('should return the point object that was passed in', function ()
        {
            var layer = makeLayer();
            var point = new Vector2();
            var result = HexagonalWorldToTileXY(16, 16, true, point, null, layer);

            expect(result).toBe(point);
        });

        it('should update the x and y properties of the provided point', function ()
        {
            var layer = makeLayer();
            var point = new Vector2(99, 99);
            HexagonalWorldToTileXY(16, 16, true, point, null, layer);

            expect(point.x).toBe(0);
            expect(point.y).toBe(0);
        });
    });

    // -------------------------------------------------------------------------
    // staggerAxis 'y' — basic coordinate mapping
    // -------------------------------------------------------------------------

    describe('staggerAxis y', function ()
    {
        it('should return tile (0, 0) when world position is at the tile centre origin', function ()
        {
            // worldX=16, worldY=16 is the centre of tile (0,0) for 32x32 tiles
            var layer = makeLayer({ staggerAxis: 'y' });
            var result = HexagonalWorldToTileXY(16, 16, true, null, null, layer);

            expect(result.x).toBe(0);
            expect(result.y).toBe(0);
        });

        it('should return tile (1, 0) when world position is one tile to the right on even row', function ()
        {
            // worldX=48 is one tile width (32) past the half-width origin at 16
            // py = 0, so r = 0 → y = 0 (even row)
            var layer = makeLayer({ staggerAxis: 'y' });
            var result = HexagonalWorldToTileXY(48, 16, true, null, null, layer);

            expect(result.x).toBe(1);
            expect(result.y).toBe(0);
        });

        it('should produce different results for staggerIndex odd vs even when row is odd', function ()
        {
            // worldX=16, worldY=48 resolves to row y=1 (odd)
            // staggerIndex 'odd':  x = (ri/2) + qi - 0.5
            // staggerIndex 'even': x = (ri/2) + qi + 0.5
            var layerOdd = makeLayer({ staggerAxis: 'y', staggerIndex: 'odd' });
            var layerEven = makeLayer({ staggerAxis: 'y', staggerIndex: 'even' });

            var resultOdd = HexagonalWorldToTileXY(16, 48, true, null, null, layerOdd);
            var resultEven = HexagonalWorldToTileXY(16, 48, true, null, null, layerEven);

            // Both should be on row y=1
            expect(resultOdd.y).toBe(1);
            expect(resultEven.y).toBe(1);

            // x coordinate differs by 1 between staggerIndex modes
            expect(resultEven.x - resultOdd.x).toBeCloseTo(1, 10);
        });

        it('should return the same x result for even rows regardless of staggerIndex', function ()
        {
            // For even rows (y % 2 === 0) the formula is identical for both staggerIndex values
            var layerOdd = makeLayer({ staggerAxis: 'y', staggerIndex: 'odd' });
            var layerEven = makeLayer({ staggerAxis: 'y', staggerIndex: 'even' });

            var resultOdd = HexagonalWorldToTileXY(16, 16, true, null, null, layerOdd);
            var resultEven = HexagonalWorldToTileXY(16, 16, true, null, null, layerEven);

            expect(resultOdd.x).toBe(resultEven.x);
            expect(resultOdd.y).toBe(resultEven.y);
        });
    });

    // -------------------------------------------------------------------------
    // staggerAxis 'x' — basic coordinate mapping
    // -------------------------------------------------------------------------

    describe('staggerAxis x', function ()
    {
        it('should return tile (0, 0) when world position is at the tile centre origin', function ()
        {
            var layer = makeLayer({ staggerAxis: 'x' });
            var result = HexagonalWorldToTileXY(16, 16, true, null, null, layer);

            expect(result.x).toBe(0);
            expect(result.y).toBe(0);
        });

        it('should produce results using the flat-top hexagon formula', function ()
        {
            // staggerAxis 'x' uses different px/py scaling than 'y'
            var layerX = makeLayer({ staggerAxis: 'x' });
            var layerY = makeLayer({ staggerAxis: 'y' });

            // At the origin both axes agree
            var rx = HexagonalWorldToTileXY(16, 16, true, null, null, layerX);
            var ry = HexagonalWorldToTileXY(16, 16, true, null, null, layerY);

            expect(rx.x).toBe(ry.x);
            expect(rx.y).toBe(ry.y);
        });

        it('should produce different tile coordinates off-centre compared to staggerAxis y', function ()
        {
            // worldX=48, worldY=32 produces (1,1) for staggerAxis 'y' and (0,1) for 'x'
            var layerX = makeLayer({ staggerAxis: 'x', staggerIndex: 'odd' });
            var layerY = makeLayer({ staggerAxis: 'y', staggerIndex: 'odd' });

            var rx = HexagonalWorldToTileXY(48, 32, true, null, null, layerX);
            var ry = HexagonalWorldToTileXY(48, 32, true, null, null, layerY);

            // The results should differ because the axis orientation changes the math
            var differ = (rx.x !== ry.x) || (rx.y !== ry.y);
            expect(differ).toBe(true);
        });
    });

    // -------------------------------------------------------------------------
    // snapToFloor — present in signature, not applied in implementation
    // -------------------------------------------------------------------------

    describe('snapToFloor parameter', function ()
    {
        it('should not throw when snapToFloor is true', function ()
        {
            var layer = makeLayer();
            expect(function ()
            {
                HexagonalWorldToTileXY(16, 16, true, null, null, layer);
            }).not.toThrow();
        });

        it('should not throw when snapToFloor is false', function ()
        {
            var layer = makeLayer();
            expect(function ()
            {
                HexagonalWorldToTileXY(16, 16, false, null, null, layer);
            }).not.toThrow();
        });
    });

    // -------------------------------------------------------------------------
    // tilemapLayer — offset, scroll, scale
    // -------------------------------------------------------------------------

    describe('with tilemapLayer', function ()
    {
        it('should offset world coordinates by tilemapLayer position', function ()
        {
            // tilemapLayer at (100, 100) — worldX/Y must shift by that amount to reach origin tile
            var layer = makeLayerWithTilemapLayer({ staggerAxis: 'y' });
            layer.tilemapLayer.x = 100;
            layer.tilemapLayer.y = 100;

            var result = HexagonalWorldToTileXY(116, 116, true, null, null, layer);

            expect(result.x).toBe(0);
            expect(result.y).toBe(0);
        });

        it('should factor in camera scroll when scrollFactor is 0', function ()
        {
            // scrollFactor=0 means layer is fixed, so full camera scroll is subtracted
            var layer = makeLayerWithTilemapLayer({ staggerAxis: 'y' });
            layer.tilemapLayer.scrollFactorX = 0;
            layer.tilemapLayer.scrollFactorY = 0;
            var camera = { scrollX: 50, scrollY: 50 };

            // worldX - (0 + 50 * 1) = worldX - 50; so worldX=66 → 16 → origin
            var result = HexagonalWorldToTileXY(66, 66, true, null, camera, layer);

            expect(result.x).toBe(0);
            expect(result.y).toBe(0);
        });

        it('should not apply camera scroll when scrollFactor is 1', function ()
        {
            // scrollFactor=1 means the layer scrolls with the camera (1 - 1 = 0 contribution)
            var layer = makeLayerWithTilemapLayer({ staggerAxis: 'y' });
            var camera = { scrollX: 999, scrollY: 999 };

            // worldX - (0 + 999 * 0) = worldX — camera scroll has no effect
            var result = HexagonalWorldToTileXY(16, 16, true, null, camera, layer);

            expect(result.x).toBe(0);
            expect(result.y).toBe(0);
        });

        it('should scale tile dimensions by tilemapLayer scale', function ()
        {
            // With scaleX=scaleY=2, effective tile size is 64x64, so origin centre is at (32,32)
            var layer = makeLayerWithTilemapLayer({ staggerAxis: 'y' });
            layer.tilemapLayer.scaleX = 2;
            layer.tilemapLayer.scaleY = 2;

            var result = HexagonalWorldToTileXY(32, 32, true, null, null, layer);

            expect(result.x).toBe(0);
            expect(result.y).toBe(0);
        });

        it('should use scene main camera when camera argument is null', function ()
        {
            // Supplying camera=null should fall back to tilemapLayer.scene.cameras.main
            var layer = makeLayerWithTilemapLayer({ staggerAxis: 'y' });
            layer.tilemapLayer.scene.cameras.main.scrollX = 0;
            layer.tilemapLayer.scene.cameras.main.scrollY = 0;

            expect(function ()
            {
                HexagonalWorldToTileXY(16, 16, true, null, null, layer);
            }).not.toThrow();
        });

        it('should use the provided camera rather than the scene main camera', function ()
        {
            // Use a camera with no scroll — should still map origin to (0,0)
            var layer = makeLayerWithTilemapLayer({ staggerAxis: 'y' });
            // Point scene camera to something that would give wrong result if used
            layer.tilemapLayer.scene.cameras.main.scrollX = 999;
            layer.tilemapLayer.scene.cameras.main.scrollY = 999;

            var camera = { scrollX: 0, scrollY: 0 };
            var result = HexagonalWorldToTileXY(16, 16, true, null, camera, layer);

            expect(result.x).toBe(0);
            expect(result.y).toBe(0);
        });
    });

    // -------------------------------------------------------------------------
    // Edge cases
    // -------------------------------------------------------------------------

    describe('edge cases', function ()
    {
        it('should handle negative world coordinates without throwing', function ()
        {
            var layer = makeLayer();
            expect(function ()
            {
                HexagonalWorldToTileXY(-100, -100, true, null, null, layer);
            }).not.toThrow();
        });

        it('should handle zero world coordinates without throwing', function ()
        {
            var layer = makeLayer();
            expect(function ()
            {
                HexagonalWorldToTileXY(0, 0, true, null, null, layer);
            }).not.toThrow();
        });

        it('should handle large world coordinates without throwing', function ()
        {
            var layer = makeLayer();
            expect(function ()
            {
                HexagonalWorldToTileXY(100000, 100000, true, null, null, layer);
            }).not.toThrow();
        });

        it('should return integer or half-integer x values for staggerIndex odd on odd rows', function ()
        {
            // On odd rows staggerIndex 'odd' produces x = (ri/2) + qi - 0.5 — fractional by 0.5
            var layer = makeLayer({ staggerAxis: 'y', staggerIndex: 'odd' });
            var result = HexagonalWorldToTileXY(16, 48, true, null, null, layer);

            // x should be an integer or n + 0.5
            var frac = Math.abs(result.x - Math.floor(result.x));
            expect(frac === 0 || frac === 0.5).toBe(true);
        });

        it('should return integer or half-integer x values for staggerIndex even on odd rows', function ()
        {
            var layer = makeLayer({ staggerAxis: 'y', staggerIndex: 'even' });
            var result = HexagonalWorldToTileXY(16, 48, true, null, null, layer);

            var frac = Math.abs(result.x - Math.floor(result.x));
            expect(frac === 0 || frac === 0.5).toBe(true);
        });

        it('should return consistent results for identical inputs', function ()
        {
            var layer = makeLayer();
            var r1 = HexagonalWorldToTileXY(64, 64, true, null, null, layer);
            var r2 = HexagonalWorldToTileXY(64, 64, true, null, null, layer);

            expect(r1.x).toBe(r2.x);
            expect(r1.y).toBe(r2.y);
        });

        it('should not mutate the layer object', function ()
        {
            var layer = makeLayer();
            var origWidth = layer.baseTileWidth;
            var origHeight = layer.baseTileHeight;

            HexagonalWorldToTileXY(16, 16, true, null, null, layer);

            expect(layer.baseTileWidth).toBe(origWidth);
            expect(layer.baseTileHeight).toBe(origHeight);
        });
    });
});
