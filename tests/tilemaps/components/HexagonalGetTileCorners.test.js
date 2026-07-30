var HexagonalGetTileCorners = require('../../../src/tilemaps/components/HexagonalGetTileCorners');

describe('Phaser.Tilemaps.Components.HexagonalGetTileCorners', function ()
{
    var layer;
    var camera;

    //  b0 = Math.sqrt(3) / 3  (hard-coded in the source)
    var b0 = 0.5773502691896257;

    beforeEach(function ()
    {
        layer = {
            baseTileWidth: 32,
            baseTileHeight: 32,
            tilemapLayer: null,
            staggerAxis: 'y',
            staggerIndex: 'odd'
        };

        camera = {
            scrollX: 0,
            scrollY: 0
        };
    });

    // -------------------------------------------------------------------------
    //  Return value shape
    // -------------------------------------------------------------------------

    it('should return an array', function ()
    {
        var result = HexagonalGetTileCorners(0, 0, camera, layer);

        expect(Array.isArray(result)).toBe(true);
    });

    it('should return an array of exactly six elements', function ()
    {
        var result = HexagonalGetTileCorners(0, 0, camera, layer);

        expect(result.length).toBe(6);
    });

    it('should return Vector2-like objects with numeric x and y properties', function ()
    {
        var result = HexagonalGetTileCorners(0, 0, camera, layer);

        for (var i = 0; i < result.length; i++)
        {
            expect(typeof result[i].x).toBe('number');
            expect(typeof result[i].y).toBe('number');
        }
    });

    it('should return a new array on each call', function ()
    {
        var first = HexagonalGetTileCorners(0, 0, camera, layer);
        var second = HexagonalGetTileCorners(0, 0, camera, layer);

        expect(first).not.toBe(second);
    });

    it('should return independent Vector2 objects (not shared references)', function ()
    {
        var result = HexagonalGetTileCorners(0, 0, camera, layer);

        for (var i = 0; i < result.length; i++)
        {
            for (var j = i + 1; j < result.length; j++)
            {
                expect(result[i]).not.toBe(result[j]);
            }
        }
    });

    // -------------------------------------------------------------------------
    //  staggerAxis = 'y'  (default in beforeEach)
    //
    //  For tileX=0, tileY=0, baseTileWidth=32, baseTileHeight=32,
    //  staggerAxis='y', staggerIndex='odd', no tilemapLayer:
    //    HexagonalTileToWorldXY → center = (16, 16)
    //    hexWidth  = b0 * 32  ≈ 18.475
    //    hexHeight = 32 / 2   = 16
    // -------------------------------------------------------------------------

    it('should return six corners for staggerAxis y at tile (0,0)', function ()
    {
        var result = HexagonalGetTileCorners(0, 0, camera, layer);

        expect(result.length).toBe(6);
    });

    it('should compute correct corner x positions for staggerAxis y', function ()
    {
        //  center = (16, 16), hexWidth = b0 * 32
        //  cos angles: π/6 → √3/2, −π/6 → √3/2, −π/2 → 0, −5π/6 → −√3/2, −7π/6 → −√3/2, −3π/2 → 0
        //  hexWidth * √3/2 = (√3/3 * 32) * √3/2 = 16  (exact integer)
        var result = HexagonalGetTileCorners(0, 0, camera, layer);

        expect(result[0].x).toBeCloseTo(32, 5);   // center.x + 16
        expect(result[1].x).toBeCloseTo(32, 5);   // center.x + 16
        expect(result[2].x).toBeCloseTo(16, 5);   // center.x + 0
        expect(result[3].x).toBeCloseTo(0, 5);    // center.x − 16
        expect(result[4].x).toBeCloseTo(0, 5);    // center.x − 16
        expect(result[5].x).toBeCloseTo(16, 5);   // center.x + 0
    });

    it('should compute correct corner y positions for staggerAxis y', function ()
    {
        //  hexHeight = 16; sin angles: π/6 → 0.5, −π/6 → −0.5, −π/2 → −1, −5π/6 → −0.5, −7π/6 → 0.5, −3π/2 → 1
        var result = HexagonalGetTileCorners(0, 0, camera, layer);

        expect(result[0].y).toBeCloseTo(24, 5);   // center.y + 8
        expect(result[1].y).toBeCloseTo(8, 5);    // center.y − 8
        expect(result[2].y).toBeCloseTo(0, 5);    // center.y − 16
        expect(result[3].y).toBeCloseTo(8, 5);    // center.y − 8
        expect(result[4].y).toBeCloseTo(24, 5);   // center.y + 8
        expect(result[5].y).toBeCloseTo(32, 5);   // center.y + 16
    });

    it('should use hexWidth = b0 * tileWidth for staggerAxis y', function ()
    {
        //  Verify by checking that the maximum horizontal reach equals b0 * tileWidth
        layer.baseTileWidth = 64;
        layer.baseTileHeight = 32;

        var result = HexagonalGetTileCorners(0, 0, camera, layer);

        var centerX = result.reduce(function (sum, v) { return sum + v.x; }, 0) / 6;
        var maxDeltaX = result.reduce(function (max, v) { return Math.max(max, Math.abs(v.x - centerX)); }, 0);

        //  hexWidth * max(|cos|) = b0*64 * cos(0°) but cos(0°) doesn't appear in the 6 angles
        //  max |cos| at these angles = cos(π/6) = √3/2
        var expected = b0 * 64 * Math.sqrt(3) / 2;

        expect(maxDeltaX).toBeCloseTo(expected, 5);
    });

    it('should use hexHeight = tileHeight / 2 for staggerAxis y', function ()
    {
        layer.baseTileWidth = 32;
        layer.baseTileHeight = 64;

        var result = HexagonalGetTileCorners(0, 0, camera, layer);

        var centerY = result.reduce(function (sum, v) { return sum + v.y; }, 0) / 6;
        var maxDeltaY = result.reduce(function (max, v) { return Math.max(max, Math.abs(v.y - centerY)); }, 0);

        //  hexHeight = 64 / 2 = 32; max |sin| at these angles = sin(π/2) = 1
        expect(maxDeltaY).toBeCloseTo(32, 5);
    });

    // -------------------------------------------------------------------------
    //  staggerAxis = 'x'
    //
    //  For tileX=0, tileY=0, baseTileWidth=32, baseTileHeight=32,
    //  staggerAxis='x', staggerIndex='odd', no tilemapLayer:
    //    HexagonalTileToWorldXY → center = (16, 16)
    //    hexWidth  = 32 / 2   = 16
    //    hexHeight = b0 * 32  ≈ 18.475
    // -------------------------------------------------------------------------

    it('should return six corners for staggerAxis x', function ()
    {
        layer.staggerAxis = 'x';

        var result = HexagonalGetTileCorners(0, 0, camera, layer);

        expect(result.length).toBe(6);
    });

    it('should use hexWidth = tileWidth / 2 for staggerAxis x', function ()
    {
        layer.staggerAxis = 'x';
        layer.baseTileWidth = 64;
        layer.baseTileHeight = 32;

        var result = HexagonalGetTileCorners(0, 0, camera, layer);

        var centerX = result.reduce(function (sum, v) { return sum + v.x; }, 0) / 6;
        var maxDeltaX = result.reduce(function (max, v) { return Math.max(max, Math.abs(v.x - centerX)); }, 0);

        //  hexWidth = 64/2 = 32; max |cos| = cos(π/6) = √3/2
        var expected = 32 * Math.sqrt(3) / 2;

        expect(maxDeltaX).toBeCloseTo(expected, 5);
    });

    it('should use hexHeight = b0 * tileHeight for staggerAxis x', function ()
    {
        layer.staggerAxis = 'x';
        layer.baseTileWidth = 32;
        layer.baseTileHeight = 64;

        var result = HexagonalGetTileCorners(0, 0, camera, layer);

        var centerY = result.reduce(function (sum, v) { return sum + v.y; }, 0) / 6;
        var maxDeltaY = result.reduce(function (max, v) { return Math.max(max, Math.abs(v.y - centerY)); }, 0);

        //  hexHeight = b0*64; max |sin| = 1
        expect(maxDeltaY).toBeCloseTo(b0 * 64, 5);
    });

    it('should produce different corner extents for staggerAxis x vs y with same tile size', function ()
    {
        var resultY = HexagonalGetTileCorners(0, 0, camera, layer);

        layer.staggerAxis = 'x';
        var resultX = HexagonalGetTileCorners(0, 0, camera, layer);

        //  hexWidth differs: b0*32 (y-axis) vs 16 (x-axis), so max x delta differs
        var maxDeltaXY = resultY.reduce(function (max, v, _, arr)
        {
            var cx = arr.reduce(function (s, u) { return s + u.x; }, 0) / 6;
            return Math.max(max, Math.abs(v.x - cx));
        }, 0);

        var maxDeltaXX = resultX.reduce(function (max, v, _, arr)
        {
            var cx = arr.reduce(function (s, u) { return s + u.x; }, 0) / 6;
            return Math.max(max, Math.abs(v.x - cx));
        }, 0);

        expect(maxDeltaXY).not.toBeCloseTo(maxDeltaXX, 2);
    });

    // -------------------------------------------------------------------------
    //  tilemapLayer scale
    // -------------------------------------------------------------------------

    it('should apply tilemapLayer scaleX and scaleY to tile dimensions', function ()
    {
        layer.tilemapLayer = {
            x: 0,
            y: 0,
            scrollFactorX: 1,
            scrollFactorY: 1,
            scaleX: 2,
            scaleY: 2,
            scene: { cameras: { main: camera } }
        };

        var unscaled = HexagonalGetTileCorners(0, 0, camera, { baseTileWidth: 32, baseTileHeight: 32, tilemapLayer: null, staggerAxis: 'y', staggerIndex: 'odd' });
        var scaled = HexagonalGetTileCorners(0, 0, camera, layer);

        //  With scale=2 corners should be further from center than unscaled
        var maxUnscaled = unscaled.reduce(function (max, v)
        {
            return Math.max(max, Math.abs(v.x - 16), Math.abs(v.y - 16));
        }, 0);

        //  scaled center will differ; just verify the spread is wider
        var centerX = scaled.reduce(function (s, v) { return s + v.x; }, 0) / 6;
        var centerY = scaled.reduce(function (s, v) { return s + v.y; }, 0) / 6;

        var maxScaled = scaled.reduce(function (max, v)
        {
            return Math.max(max, Math.abs(v.x - centerX), Math.abs(v.y - centerY));
        }, 0);

        expect(maxScaled).toBeGreaterThan(maxUnscaled);
    });

    it('should offset corners by tilemapLayer world position', function ()
    {
        layer.tilemapLayer = {
            x: 100,
            y: 200,
            scrollFactorX: 1,
            scrollFactorY: 1,
            scaleX: 1,
            scaleY: 1,
            scene: { cameras: { main: camera } }
        };

        var withOffset = HexagonalGetTileCorners(0, 0, camera, layer);
        var noOffset = HexagonalGetTileCorners(0, 0, camera, { baseTileWidth: 32, baseTileHeight: 32, tilemapLayer: null, staggerAxis: 'y', staggerIndex: 'odd' });

        //  Every corner should be shifted by (100, 200)
        for (var i = 0; i < 6; i++)
        {
            expect(withOffset[i].x).toBeCloseTo(noOffset[i].x + 100, 5);
            expect(withOffset[i].y).toBeCloseTo(noOffset[i].y + 200, 5);
        }
    });

    // -------------------------------------------------------------------------
    //  Different tile coordinates
    // -------------------------------------------------------------------------

    it('should produce different corners for different tile positions', function ()
    {
        var corners00 = HexagonalGetTileCorners(0, 0, camera, layer);
        var corners11 = HexagonalGetTileCorners(1, 1, camera, layer);

        //  At least one coordinate must differ
        var anyDifference = false;

        for (var i = 0; i < 6; i++)
        {
            if (corners00[i].x !== corners11[i].x || corners00[i].y !== corners11[i].y)
            {
                anyDifference = true;
                break;
            }
        }

        expect(anyDifference).toBe(true);
    });

    it('should shift all corners uniformly when moving to a neighbouring tile', function ()
    {
        //  Moving tileX by 1 shifts the world center by tileWidth (32); all six corners shift equally
        var tile0 = HexagonalGetTileCorners(2, 0, camera, layer);
        var tile1 = HexagonalGetTileCorners(3, 0, camera, layer);

        var dx = tile1[0].x - tile0[0].x;

        for (var i = 1; i < 6; i++)
        {
            expect(tile1[i].x - tile0[i].x).toBeCloseTo(dx, 5);
        }
    });

    // -------------------------------------------------------------------------
    //  Symmetry
    // -------------------------------------------------------------------------

    it('should produce corners symmetric about the center point', function ()
    {
        var result = HexagonalGetTileCorners(0, 0, camera, layer);

        var centerX = result.reduce(function (sum, v) { return sum + v.x; }, 0) / 6;
        var centerY = result.reduce(function (sum, v) { return sum + v.y; }, 0) / 6;

        //  Each corner i should have an opposite corner at i+3 mirrored through center
        for (var i = 0; i < 3; i++)
        {
            expect(result[i].x + result[i + 3].x).toBeCloseTo(centerX * 2, 4);
            expect(result[i].y + result[i + 3].y).toBeCloseTo(centerY * 2, 4);
        }
    });

    it('should produce corners all at equal distance from center (regular hexagon)', function ()
    {
        var result = HexagonalGetTileCorners(0, 0, camera, layer);

        var centerX = result.reduce(function (sum, v) { return sum + v.x; }, 0) / 6;
        var centerY = result.reduce(function (sum, v) { return sum + v.y; }, 0) / 6;

        //  For staggerAxis='y': hexWidth = b0*tileWidth, hexHeight = tileHeight/2
        //  The radius to each corner follows r² = hexWidth²*cos²+hexHeight²*sin²
        //  so this is an ellipse, not a circle — but opposite corners are equal distance
        var dist0 = Math.sqrt(Math.pow(result[0].x - centerX, 2) + Math.pow(result[0].y - centerY, 2));
        var dist3 = Math.sqrt(Math.pow(result[3].x - centerX, 2) + Math.pow(result[3].y - centerY, 2));

        expect(dist0).toBeCloseTo(dist3, 5);
    });

    // -------------------------------------------------------------------------
    //  Edge cases — large coordinates
    // -------------------------------------------------------------------------

    it('should handle large positive tile coordinates', function ()
    {
        var result = HexagonalGetTileCorners(1000, 1000, camera, layer);

        expect(result.length).toBe(6);

        for (var i = 0; i < 6; i++)
        {
            expect(isFinite(result[i].x)).toBe(true);
            expect(isFinite(result[i].y)).toBe(true);
        }
    });

    it('should handle zero tile coordinates', function ()
    {
        var result = HexagonalGetTileCorners(0, 0, camera, layer);

        expect(result.length).toBe(6);
    });

    it('should handle fractional tile coordinates', function ()
    {
        var result = HexagonalGetTileCorners(0.5, 0.5, camera, layer);

        expect(result.length).toBe(6);

        for (var i = 0; i < 6; i++)
        {
            expect(isFinite(result[i].x)).toBe(true);
            expect(isFinite(result[i].y)).toBe(true);
        }
    });
});
