var HexagonalTileToWorldXY = require('../../../src/tilemaps/components/HexagonalTileToWorldXY');
var Vector2 = require('../../../src/math/Vector2');

describe('Phaser.Tilemaps.Components.HexagonalTileToWorldXY', function ()
{
    var layerY;
    var layerX;

    function makeLayer (staggerAxis, staggerIndex, tileWidth, tileHeight)
    {
        return {
            baseTileWidth: tileWidth || 64,
            baseTileHeight: tileHeight || 64,
            tilemapLayer: null,
            staggerAxis: staggerAxis,
            staggerIndex: staggerIndex
        };
    }

    function makeLayerWithTilemapLayer (staggerAxis, staggerIndex, layerOptions, cameraOptions)
    {
        var lo = layerOptions || {};
        var co = cameraOptions || {};
        return {
            baseTileWidth: 64,
            baseTileHeight: 64,
            staggerAxis: staggerAxis,
            staggerIndex: staggerIndex,
            tilemapLayer: {
                x: lo.x !== undefined ? lo.x : 0,
                y: lo.y !== undefined ? lo.y : 0,
                scrollFactorX: lo.scrollFactorX !== undefined ? lo.scrollFactorX : 1,
                scrollFactorY: lo.scrollFactorY !== undefined ? lo.scrollFactorY : 1,
                scaleX: lo.scaleX !== undefined ? lo.scaleX : 1,
                scaleY: lo.scaleY !== undefined ? lo.scaleY : 1,
                scene: {
                    cameras: {
                        main: {
                            scrollX: co.scrollX !== undefined ? co.scrollX : 0,
                            scrollY: co.scrollY !== undefined ? co.scrollY : 0
                        }
                    }
                }
            }
        };
    }

    // -------------------------------------------------------------------------
    // Return value
    // -------------------------------------------------------------------------

    describe('return value', function ()
    {
        it('should return a Vector2', function ()
        {
            var layer = makeLayer('y', 'odd');
            var result = HexagonalTileToWorldXY(0, 0, null, null, layer);

            expect(result).toBeInstanceOf(Vector2);
        });

        it('should create a new Vector2 when point is null', function ()
        {
            var layer = makeLayer('y', 'odd');
            var result = HexagonalTileToWorldXY(0, 0, null, null, layer);

            expect(result).not.toBeNull();
            expect(typeof result.x).toBe('number');
            expect(typeof result.y).toBe('number');
        });

        it('should update and return the given point object', function ()
        {
            var layer = makeLayer('y', 'odd');
            var point = new Vector2(0, 0);
            var result = HexagonalTileToWorldXY(0, 0, point, null, layer);

            expect(result).toBe(point);
        });
    });

    // -------------------------------------------------------------------------
    // staggerAxis 'y', staggerIndex 'odd'  (no tilemapLayer)
    // -------------------------------------------------------------------------

    describe('staggerAxis y, staggerIndex odd, no tilemapLayer', function ()
    {
        it('should calculate world position for tile (0, 0) — even row, odd stagger', function ()
        {
            var layer = makeLayer('y', 'odd');
            // tileWidth=64, tileHeight=64
            // tileWidthHalf=32, tileHeightHalf=32
            // x = 0 + (64*0) + 64 = 64
            // y = 0 + (1.5*0*32) + 32 = 32
            // tileY=0 even, odd stagger → x -= 32 → x=32
            var result = HexagonalTileToWorldXY(0, 0, null, null, layer);

            expect(result.x).toBeCloseTo(32);
            expect(result.y).toBeCloseTo(32);
        });

        it('should calculate world position for tile (1, 0) — even row, odd stagger', function ()
        {
            var layer = makeLayer('y', 'odd');
            // x = 0 + (64*1) + 64 = 128; even row odd → x -= 32 → 96
            // y = 32
            var result = HexagonalTileToWorldXY(1, 0, null, null, layer);

            expect(result.x).toBeCloseTo(96);
            expect(result.y).toBeCloseTo(32);
        });

        it('should calculate world position for tile (0, 1) — odd row, no x adjustment', function ()
        {
            var layer = makeLayer('y', 'odd');
            // x = 0 + 0 + 64 = 64  (tileY=1 odd, no adjustment)
            // y = 0 + (1.5*1*32) + 32 = 48 + 32 = 80
            var result = HexagonalTileToWorldXY(0, 1, null, null, layer);

            expect(result.x).toBeCloseTo(64);
            expect(result.y).toBeCloseTo(80);
        });

        it('should calculate world position for tile (2, 2) — even row, odd stagger', function ()
        {
            var layer = makeLayer('y', 'odd');
            // x = 0 + (64*2) + 64 = 192; tileY=2 even, odd → x-=32 → 160
            // y = 0 + (1.5*2*32) + 32 = 96 + 32 = 128
            var result = HexagonalTileToWorldXY(2, 2, null, null, layer);

            expect(result.x).toBeCloseTo(160);
            expect(result.y).toBeCloseTo(128);
        });

        it('should scale correctly with different tile sizes', function ()
        {
            var layer = makeLayer('y', 'odd', 32, 32);
            // tileWidthHalf=16, tileHeightHalf=16
            // tileX=0, tileY=0: x = 0 + 0 + 32 = 32; even,odd → x-=16 → 16
            // y = 0 + 0 + 16 = 16
            var result = HexagonalTileToWorldXY(0, 0, null, null, layer);

            expect(result.x).toBeCloseTo(16);
            expect(result.y).toBeCloseTo(16);
        });
    });

    // -------------------------------------------------------------------------
    // staggerAxis 'y', staggerIndex 'even'  (no tilemapLayer)
    // -------------------------------------------------------------------------

    describe('staggerAxis y, staggerIndex even, no tilemapLayer', function ()
    {
        it('should calculate world position for tile (0, 0) — even row, even stagger', function ()
        {
            var layer = makeLayer('y', 'even');
            // x = 64; tileY=0 even, not odd stagger → x += 32 → 96
            // y = 32
            var result = HexagonalTileToWorldXY(0, 0, null, null, layer);

            expect(result.x).toBeCloseTo(96);
            expect(result.y).toBeCloseTo(32);
        });

        it('should calculate world position for tile (1, 0) — even row, even stagger', function ()
        {
            var layer = makeLayer('y', 'even');
            // x = 128; even, even → x += 32 → 160
            // y = 32
            var result = HexagonalTileToWorldXY(1, 0, null, null, layer);

            expect(result.x).toBeCloseTo(160);
            expect(result.y).toBeCloseTo(32);
        });

        it('should calculate world position for tile (0, 1) — odd row, no x adjustment', function ()
        {
            var layer = makeLayer('y', 'even');
            // x = 64; tileY=1 odd, no adjustment
            // y = 80
            var result = HexagonalTileToWorldXY(0, 1, null, null, layer);

            expect(result.x).toBeCloseTo(64);
            expect(result.y).toBeCloseTo(80);
        });

        it('should produce different x for even rows compared to odd stagger', function ()
        {
            var layerOdd = makeLayer('y', 'odd');
            var layerEven = makeLayer('y', 'even');
            var rOdd = HexagonalTileToWorldXY(0, 0, null, null, layerOdd);
            var rEven = HexagonalTileToWorldXY(0, 0, null, null, layerEven);

            // odd offsets left by half, even offsets right by half — 64px difference
            expect(rEven.x - rOdd.x).toBeCloseTo(64);
            expect(rEven.y).toBeCloseTo(rOdd.y);
        });
    });

    // -------------------------------------------------------------------------
    // staggerAxis 'x', staggerIndex 'odd'  (no tilemapLayer)
    // -------------------------------------------------------------------------

    describe('staggerAxis x, staggerIndex odd, no tilemapLayer', function ()
    {
        it('should calculate world position for tile (0, 0) — even col, odd stagger', function ()
        {
            var layer = makeLayer('x', 'odd');
            // tileWidthHalf=32, tileHeightHalf=32
            // x = 0 + (1.5*0*32) + 32 = 32
            // y = 0 + (64*0) + 64 = 64
            // tileX=0 even, odd stagger → y -= 32 → y=32
            var result = HexagonalTileToWorldXY(0, 0, null, null, layer);

            expect(result.x).toBeCloseTo(32);
            expect(result.y).toBeCloseTo(32);
        });

        it('should calculate world position for tile (1, 0) — odd col, no y adjustment', function ()
        {
            var layer = makeLayer('x', 'odd');
            // x = 0 + (1.5*1*32) + 32 = 48 + 32 = 80
            // y = 0 + (64*1) + 64 = 128; tileX=1 odd, no adjustment
            var result = HexagonalTileToWorldXY(1, 0, null, null, layer);

            expect(result.x).toBeCloseTo(80);
            expect(result.y).toBeCloseTo(128);
        });

        it('should calculate world position for tile (2, 0) — even col, odd stagger', function ()
        {
            var layer = makeLayer('x', 'odd');
            // x = 0 + (1.5*2*32) + 32 = 96 + 32 = 128
            // y = 0 + (64*2) + 64 = 192; tileX=2 even, odd → y-=32 → 160
            var result = HexagonalTileToWorldXY(2, 0, null, null, layer);

            expect(result.x).toBeCloseTo(128);
            expect(result.y).toBeCloseTo(160);
        });
    });

    // -------------------------------------------------------------------------
    // With tilemapLayer — world offset and scroll
    // -------------------------------------------------------------------------

    describe('with tilemapLayer', function ()
    {
        it('should offset by layer position with scrollFactor 1 and no camera scroll', function ()
        {
            var layer = makeLayerWithTilemapLayer('y', 'odd', { x: 100, y: 200 }, { scrollX: 0, scrollY: 0 });
            // worldX = 100 + 0*(1-1) = 100, worldY = 200 + 0*(1-1) = 200
            // tileX=0, tileY=0: x = 100 + 0 + 64 = 164; even,odd → x-=32 → 132
            // y = 200 + 0 + 32 = 232
            var result = HexagonalTileToWorldXY(0, 0, null, { scrollX: 0, scrollY: 0 }, layer);

            expect(result.x).toBeCloseTo(132);
            expect(result.y).toBeCloseTo(232);
        });

        it('should not offset by camera scroll when scrollFactor is 1', function ()
        {
            var layer = makeLayerWithTilemapLayer('y', 'odd', { x: 0, y: 0, scrollFactorX: 1, scrollFactorY: 1 }, { scrollX: 50, scrollY: 100 });
            // worldX = 0 + 50*(1-1) = 0, worldY = 0 + 100*(1-1) = 0
            var result = HexagonalTileToWorldXY(0, 0, null, { scrollX: 50, scrollY: 100 }, layer);
            // Same as no-tilemapLayer result for (0,0) odd
            expect(result.x).toBeCloseTo(32);
            expect(result.y).toBeCloseTo(32);
        });

        it('should fully offset by camera scroll when scrollFactor is 0', function ()
        {
            var layer = makeLayerWithTilemapLayer('y', 'odd', { x: 0, y: 0, scrollFactorX: 0, scrollFactorY: 0 }, { scrollX: 50, scrollY: 100 });
            // worldX = 0 + 50*(1-0) = 50, worldY = 0 + 100*(1-0) = 100
            // tileX=0,tileY=0: x = 50 + 0 + 64 = 114; even,odd → x-=32 → 82
            // y = 100 + 0 + 32 = 132
            var result = HexagonalTileToWorldXY(0, 0, null, { scrollX: 50, scrollY: 100 }, layer);

            expect(result.x).toBeCloseTo(82);
            expect(result.y).toBeCloseTo(132);
        });

        it('should scale tile dimensions by layer scale', function ()
        {
            var layer = makeLayerWithTilemapLayer('y', 'odd', { x: 0, y: 0, scrollFactorX: 1, scrollFactorY: 1, scaleX: 2, scaleY: 2 }, {});
            // tileWidth = 64*2 = 128, tileHeight = 64*2 = 128
            // tileWidthHalf=64, tileHeightHalf=64
            // tileX=0, tileY=0: x = 0 + 0 + 128 = 128; even,odd → x-=64 → 64
            // y = 0 + 0 + 64 = 64
            var result = HexagonalTileToWorldXY(0, 0, null, { scrollX: 0, scrollY: 0 }, layer);

            expect(result.x).toBeCloseTo(64);
            expect(result.y).toBeCloseTo(64);
        });

        it('should use scene main camera when camera argument is null', function ()
        {
            var layer = makeLayerWithTilemapLayer('y', 'odd', { x: 0, y: 0, scrollFactorX: 0, scrollFactorY: 0 }, { scrollX: 20, scrollY: 40 });
            // camera is null so it falls back to scene.cameras.main which has scrollX=20, scrollY=40
            // worldX = 0 + 20*(1-0) = 20, worldY = 0 + 40*(1-0) = 40
            // tileX=0,tileY=0: x = 20 + 0 + 64 = 84; even,odd → x-=32 → 52
            // y = 40 + 0 + 32 = 72
            var result = HexagonalTileToWorldXY(0, 0, null, null, layer);

            expect(result.x).toBeCloseTo(52);
            expect(result.y).toBeCloseTo(72);
        });
    });

    // -------------------------------------------------------------------------
    // Negative and large tile coordinates
    // -------------------------------------------------------------------------

    describe('edge cases', function ()
    {
        it('should handle negative tileX with staggerAxis y', function ()
        {
            var layer = makeLayer('y', 'odd');
            // tileX=-1, tileY=0: x = 0 + (64*-1) + 64 = 0; even,odd → x-=32 → -32
            // y = 32
            var result = HexagonalTileToWorldXY(-1, 0, null, null, layer);

            expect(result.x).toBeCloseTo(-32);
            expect(result.y).toBeCloseTo(32);
        });

        it('should handle negative tileY with staggerAxis y', function ()
        {
            var layer = makeLayer('y', 'odd');
            // tileX=0, tileY=-1: x=64; tileY=-1 odd (% 2 !== 0), no adjustment
            // y = 0 + (1.5*-1*32) + 32 = -48 + 32 = -16
            var result = HexagonalTileToWorldXY(0, -1, null, null, layer);

            expect(result.x).toBeCloseTo(64);
            expect(result.y).toBeCloseTo(-16);
        });

        it('should handle large tile coordinates without overflow', function ()
        {
            var layer = makeLayer('y', 'odd');
            var result = HexagonalTileToWorldXY(100, 100, null, null, layer);

            expect(typeof result.x).toBe('number');
            expect(typeof result.y).toBe('number');
            expect(isFinite(result.x)).toBe(true);
            expect(isFinite(result.y)).toBe(true);
        });

        it('should update the provided point object in-place', function ()
        {
            var layer = makeLayer('y', 'odd');
            var point = new Vector2(999, 999);
            HexagonalTileToWorldXY(0, 0, point, null, layer);

            expect(point.x).toBeCloseTo(32);
            expect(point.y).toBeCloseTo(32);
        });

        it('y axis: x position advances linearly with tileX', function ()
        {
            var layer = makeLayer('y', 'odd');
            // For same odd tileY row, x increments by tileWidth each step
            var r0 = HexagonalTileToWorldXY(0, 1, null, null, layer);
            var r1 = HexagonalTileToWorldXY(1, 1, null, null, layer);
            var r2 = HexagonalTileToWorldXY(2, 1, null, null, layer);

            expect(r1.x - r0.x).toBeCloseTo(64);
            expect(r2.x - r1.x).toBeCloseTo(64);
        });

        it('x axis: x position advances by 1.5 * tileWidthHalf per column', function ()
        {
            var layer = makeLayer('x', 'odd');
            // For odd cols (no y adjustment), x step = 1.5 * tileWidthHalf = 1.5 * 32 = 48
            var r1 = HexagonalTileToWorldXY(1, 0, null, null, layer);
            var r3 = HexagonalTileToWorldXY(3, 0, null, null, layer);

            expect(r3.x - r1.x).toBeCloseTo(48 * 2);
        });
    });
});
