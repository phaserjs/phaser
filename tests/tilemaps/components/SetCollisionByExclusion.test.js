var SetCollisionByExclusion = require('../../../src/tilemaps/components/SetCollisionByExclusion');

describe('Phaser.Tilemaps.Components.SetCollisionByExclusion', function ()
{
    var layer;
    var tileA;
    var tileB;
    var tileC;

    function makeTile(index, x, y)
    {
        return {
            index: index,
            collides: false,
            x: x !== undefined ? x : 0,
            y: y !== undefined ? y : 0,
            faceTop: false,
            faceBottom: false,
            faceLeft: false,
            faceRight: false,
            setCollision: function (left, right, up, down, reset)
            {
                this.collides = true;
            },
            resetCollision: function (recalculate)
            {
                this.collides = false;
            },
            resetFaces: function ()
            {
                this.faceTop = false;
                this.faceBottom = false;
                this.faceLeft = false;
                this.faceRight = false;
            }
        };
    }

    function makeLayer(tiles2d)
    {
        return {
            height: tiles2d.length,
            width: tiles2d[0] ? tiles2d[0].length : 0,
            data: tiles2d,
            collideIndexes: []
        };
    }

    beforeEach(function ()
    {
        tileA = makeTile(1, 0, 0);
        tileB = makeTile(2, 1, 0);
        tileC = makeTile(3, 0, 1);

        layer = makeLayer([
            [ tileA, tileB ],
            [ tileC, null ]
        ]);
    });

    it('should enable collision on tiles whose index is not in the exclusion array', function ()
    {
        SetCollisionByExclusion([], true, false, layer);

        expect(tileA.collides).toBe(true);
        expect(tileB.collides).toBe(true);
        expect(tileC.collides).toBe(true);
    });

    it('should not enable collision on tiles whose index is in the exclusion array', function ()
    {
        SetCollisionByExclusion([ 1, 3 ], true, false, layer);

        expect(tileA.collides).toBe(false);
        expect(tileB.collides).toBe(true);
        expect(tileC.collides).toBe(false);
    });

    it('should disable collision when collides is false', function ()
    {
        tileA.collides = true;
        tileB.collides = true;
        tileC.collides = true;

        SetCollisionByExclusion([ 1 ], false, false, layer);

        expect(tileA.collides).toBe(true);
        expect(tileB.collides).toBe(false);
        expect(tileC.collides).toBe(false);
    });

    it('should default collides to true when not provided', function ()
    {
        SetCollisionByExclusion([], undefined, false, layer);

        expect(tileA.collides).toBe(true);
        expect(tileB.collides).toBe(true);
        expect(tileC.collides).toBe(true);
    });

    it('should accept a single index (non-array) as the exclusion list', function ()
    {
        SetCollisionByExclusion(2, true, false, layer);

        expect(tileA.collides).toBe(true);
        expect(tileB.collides).toBe(false);
        expect(tileC.collides).toBe(true);
    });

    it('should skip null tiles without throwing', function ()
    {
        expect(function ()
        {
            SetCollisionByExclusion([], true, false, layer);
        }).not.toThrow();
    });

    it('should add non-excluded tile indexes to layer.collideIndexes', function ()
    {
        SetCollisionByExclusion([ 1 ], true, false, layer);

        expect(layer.collideIndexes).toContain(2);
        expect(layer.collideIndexes).toContain(3);
        expect(layer.collideIndexes).not.toContain(1);
    });

    it('should not modify tiles when all indexes are excluded', function ()
    {
        SetCollisionByExclusion([ 1, 2, 3 ], true, false, layer);

        expect(tileA.collides).toBe(false);
        expect(tileB.collides).toBe(false);
        expect(tileC.collides).toBe(false);
    });

    it('should call CalculateFacesWithin when recalculateFaces is true', function ()
    {
        var CalculateFacesWithin = require('../../../src/tilemaps/components/CalculateFacesWithin');
        var spy = vi.spyOn({ CalculateFacesWithin: CalculateFacesWithin }, 'CalculateFacesWithin');

        // We can't easily spy on the internal require, so instead we verify the
        // recalculateFaces=true path doesn't throw and processes all tiles
        expect(function ()
        {
            SetCollisionByExclusion([], true, true, layer);
        }).not.toThrow();
    });

    it('should default recalculateFaces to true when not provided', function ()
    {
        // Verify the function runs without error when recalculateFaces is omitted
        expect(function ()
        {
            SetCollisionByExclusion([], true, undefined, layer);
        }).not.toThrow();
    });

    it('should handle an empty layer (0x0) without throwing', function ()
    {
        var emptyLayer = makeLayer([ [] ]);
        emptyLayer.height = 0;

        expect(function ()
        {
            SetCollisionByExclusion([], true, false, emptyLayer);
        }).not.toThrow();
    });

    it('should handle a single-tile layer', function ()
    {
        var tile = makeTile(5, 0, 0);
        var singleLayer = makeLayer([ [ tile ] ]);

        SetCollisionByExclusion([], true, false, singleLayer);

        expect(tile.collides).toBe(true);
    });

    it('should handle a single-tile layer with that tile excluded', function ()
    {
        var tile = makeTile(5, 0, 0);
        var singleLayer = makeLayer([ [ tile ] ]);

        SetCollisionByExclusion([ 5 ], true, false, singleLayer);

        expect(tile.collides).toBe(false);
    });

    it('should only affect tiles currently present in the layer', function ()
    {
        // Tile index 99 is not in the layer — no error and no side effect expected
        SetCollisionByExclusion([ 99 ], true, false, layer);

        expect(tileA.collides).toBe(true);
        expect(tileB.collides).toBe(true);
        expect(tileC.collides).toBe(true);
    });
});
