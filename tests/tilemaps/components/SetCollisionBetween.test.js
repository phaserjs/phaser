var SetCollisionBetween = require('../../../src/tilemaps/components/SetCollisionBetween');

describe('Phaser.Tilemaps.Components.SetCollisionBetween', function ()
{
    function createTile (index)
    {
        return {
            index: index,
            x: 0,
            y: 0,
            collides: false,
            setCollision: vi.fn(),
            resetCollision: vi.fn(),
            resetFaces: vi.fn()
        };
    }

    function createLayer (width, height, tiles)
    {
        var data = [];

        for (var ty = 0; ty < height; ty++)
        {
            var row = [];

            for (var tx = 0; tx < width; tx++)
            {
                row.push(tiles[ty] ? tiles[ty][tx] : null);
            }

            data.push(row);
        }

        return {
            width: width,
            height: height,
            data: data,
            collideIndexes: []
        };
    }

    function createEmptyLayer (width, height)
    {
        var data = [];

        for (var ty = 0; ty < height; ty++)
        {
            var row = [];

            for (var tx = 0; tx < width; tx++)
            {
                row.push(null);
            }

            data.push(row);
        }

        return {
            width: width,
            height: height,
            data: data,
            collideIndexes: []
        };
    }

    // Creates a layer with a single non-colliding probe tile at (0,0).
    // The real CalculateFacesWithin calls resetFaces() on non-colliding tiles,
    // so checking probe.resetFaces lets us detect whether CalculateFacesWithin ran.
    function createProbeLayer (width, height)
    {
        var layer = createEmptyLayer(width, height);
        var probe = createTile(999); // index outside any test range
        layer.data[0][0] = probe;
        layer._probe = probe;

        return layer;
    }

    it('should return early without doing anything when start is greater than stop', function ()
    {
        var layer = createEmptyLayer(2, 2);

        SetCollisionBetween(10, 5, true, false, layer, false);

        expect(layer.collideIndexes).toHaveLength(0);
    });

    it('should call SetLayerCollisionIndex for a single index when start equals stop', function ()
    {
        var layer = createEmptyLayer(1, 1);

        SetCollisionBetween(5, 5, true, false, layer, false);

        expect(layer.collideIndexes).toHaveLength(1);
        expect(layer.collideIndexes).toContain(5);
    });

    it('should call SetLayerCollisionIndex for each index in the range inclusive', function ()
    {
        var layer = createEmptyLayer(1, 1);

        SetCollisionBetween(10, 14, true, false, layer, false);

        expect(layer.collideIndexes).toHaveLength(5);
        expect(layer.collideIndexes).toContain(10);
        expect(layer.collideIndexes).toContain(11);
        expect(layer.collideIndexes).toContain(12);
        expect(layer.collideIndexes).toContain(13);
        expect(layer.collideIndexes).toContain(14);
    });

    it('should pass collides=false to SetLayerCollisionIndex when disabling collision', function ()
    {
        var layer = createEmptyLayer(1, 1);
        layer.collideIndexes = [ 3, 4, 5 ];

        SetCollisionBetween(3, 5, false, false, layer, false);

        expect(layer.collideIndexes).not.toContain(3);
        expect(layer.collideIndexes).not.toContain(4);
        expect(layer.collideIndexes).not.toContain(5);
    });

    it('should default collides to true when not provided', function ()
    {
        var layer = createEmptyLayer(1, 1);

        SetCollisionBetween(1, 2, undefined, false, layer, false);

        expect(layer.collideIndexes).toContain(1);
        expect(layer.collideIndexes).toContain(2);
    });

    it('should call SetTileCollision for tiles whose index is within the range', function ()
    {
        var tile10 = createTile(10);
        var tile12 = createTile(12);
        var tile14 = createTile(14);
        var layer = createLayer(3, 1, [ [ tile10, tile12, tile14 ] ]);

        SetCollisionBetween(10, 14, true, false, layer, true);

        expect(tile10.setCollision).toHaveBeenCalledWith(true, true, true, true, false);
        expect(tile12.setCollision).toHaveBeenCalledWith(true, true, true, true, false);
        expect(tile14.setCollision).toHaveBeenCalledWith(true, true, true, true, false);
    });

    it('should not call SetTileCollision for tiles whose index is outside the range', function ()
    {
        var tileBelow = createTile(9);
        var tileAbove = createTile(15);
        var layer = createLayer(2, 1, [ [ tileBelow, tileAbove ] ]);

        SetCollisionBetween(10, 14, true, false, layer, true);

        expect(tileBelow.setCollision).not.toHaveBeenCalled();
        expect(tileAbove.setCollision).not.toHaveBeenCalled();
    });

    it('should pass collides=false to SetTileCollision when disabling collision', function ()
    {
        var tile = createTile(5);
        var layer = createLayer(1, 1, [ [ tile ] ]);

        SetCollisionBetween(3, 7, false, false, layer, true);

        expect(tile.resetCollision).toHaveBeenCalledWith(false);
    });

    it('should not call SetTileCollision when updateLayer is false', function ()
    {
        var tile = createTile(5);
        var layer = createLayer(1, 1, [ [ tile ] ]);

        SetCollisionBetween(3, 7, true, false, layer, false);

        expect(tile.setCollision).not.toHaveBeenCalled();
    });

    it('should default updateLayer to true and update tiles', function ()
    {
        var tile = createTile(5);
        var layer = createLayer(1, 1, [ [ tile ] ]);

        SetCollisionBetween(3, 7, true, false, layer);

        expect(tile.setCollision).toHaveBeenCalled();
    });

    it('should skip null tiles when iterating the layer', function ()
    {
        var tile = createTile(5);
        var layer = createLayer(3, 1, [ [ null, tile, null ] ]);

        SetCollisionBetween(3, 7, true, false, layer, true);

        expect(tile.setCollision).toHaveBeenCalledTimes(1);
    });

    it('should iterate all rows and columns of the layer', function ()
    {
        var tile00 = createTile(5);
        var tile01 = createTile(5);
        var tile10 = createTile(5);
        var tile11 = createTile(5);
        var layer = createLayer(2, 2, [ [ tile00, tile01 ], [ tile10, tile11 ] ]);

        SetCollisionBetween(4, 6, true, false, layer, true);

        expect(tile00.setCollision).toHaveBeenCalled();
        expect(tile01.setCollision).toHaveBeenCalled();
        expect(tile10.setCollision).toHaveBeenCalled();
        expect(tile11.setCollision).toHaveBeenCalled();
    });

    it('should call CalculateFacesWithin when recalculateFaces is true', function ()
    {
        var layer = createProbeLayer(5, 4);

        SetCollisionBetween(1, 3, true, true, layer, false);

        expect(layer._probe.resetFaces).toHaveBeenCalled();
    });

    it('should not call CalculateFacesWithin when recalculateFaces is false', function ()
    {
        var layer = createProbeLayer(2, 2);

        SetCollisionBetween(1, 3, true, false, layer, false);

        expect(layer._probe.resetFaces).not.toHaveBeenCalled();
    });

    it('should default recalculateFaces to true and call CalculateFacesWithin', function ()
    {
        var layer = createProbeLayer(3, 3);

        SetCollisionBetween(1, 3, true, undefined, layer, false);

        expect(layer._probe.resetFaces).toHaveBeenCalled();
    });

    it('should pass layer dimensions to CalculateFacesWithin', function ()
    {
        var layer = createProbeLayer(10, 8);

        SetCollisionBetween(1, 5, true, true, layer, false);

        expect(layer._probe.resetFaces).toHaveBeenCalled();
    });

    it('should not call CalculateFacesWithin when start is greater than stop', function ()
    {
        var layer = createProbeLayer(2, 2);

        SetCollisionBetween(10, 5, true, true, layer, false);

        expect(layer._probe.resetFaces).not.toHaveBeenCalled();
    });

    it('should handle an empty layer without errors', function ()
    {
        var layer = createEmptyLayer(3, 3);

        expect(function ()
        {
            SetCollisionBetween(1, 5, true, true, layer, true);
        }).not.toThrow();
    });

    it('should only affect tiles whose index is exactly at the start boundary', function ()
    {
        var tileAtStart = createTile(10);
        var tileBefore = createTile(9);
        var layer = createLayer(2, 1, [ [ tileBefore, tileAtStart ] ]);

        SetCollisionBetween(10, 12, true, false, layer, true);

        expect(tileAtStart.setCollision).toHaveBeenCalled();
        expect(tileBefore.setCollision).not.toHaveBeenCalled();
    });

    it('should only affect tiles whose index is exactly at the stop boundary', function ()
    {
        var tileAtStop = createTile(12);
        var tileAfter = createTile(13);
        var layer = createLayer(2, 1, [ [ tileAtStop, tileAfter ] ]);

        SetCollisionBetween(10, 12, true, false, layer, true);

        expect(tileAtStop.setCollision).toHaveBeenCalled();
        expect(tileAfter.setCollision).not.toHaveBeenCalled();
    });

    it('should process all indexes in range even when no tiles match', function ()
    {
        var layer = createEmptyLayer(2, 2);

        SetCollisionBetween(5, 8, true, false, layer, true);

        expect(layer.collideIndexes).toHaveLength(4);
        expect(layer.collideIndexes).toContain(5);
        expect(layer.collideIndexes).toContain(6);
        expect(layer.collideIndexes).toContain(7);
        expect(layer.collideIndexes).toContain(8);
    });

    it('should handle a large range of indexes correctly', function ()
    {
        var layer = createEmptyLayer(1, 1);

        SetCollisionBetween(0, 99, true, false, layer, false);

        expect(layer.collideIndexes).toHaveLength(100);
    });
});
