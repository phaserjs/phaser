var CalculateFacesWithin = require('../../../src/tilemaps/components/CalculateFacesWithin');

function makeTile (x, y, collides)
{
    return {
        x: x,
        y: y,
        index: 1,
        collides: collides,
        faceTop: false,
        faceBottom: false,
        faceLeft: false,
        faceRight: false,
        hasInterestingFace: false,
        resetFaces: vi.fn()
    };
}

function makeLayer (width, height, tiles)
{
    var data = [];

    for (var y = 0; y < height; y++)
    {
        data[y] = [];

        for (var x = 0; x < width; x++)
        {
            data[y][x] = null;
        }
    }

    if (tiles)
    {
        tiles.forEach(function (t)
        {
            data[t.y][t.x] = t;
        });
    }

    return { width: width, height: height, data: data };
}

describe('Phaser.Tilemaps.Components.CalculateFacesWithin', function ()
{
    it('should do nothing when the area contains no tiles', function ()
    {
        var layer = makeLayer(4, 4, []);

        expect(function ()
        {
            CalculateFacesWithin(0, 0, 4, 4, layer);
        }).not.toThrow();
    });

    it('should only process tiles within the specified area', function ()
    {
        var insideTile = makeTile(2, 3, false);
        var outsideTile = makeTile(0, 0, false);
        var layer = makeLayer(8, 8, [ insideTile, outsideTile ]);

        CalculateFacesWithin(2, 3, 1, 1, layer);

        expect(insideTile.resetFaces).toHaveBeenCalled();
        expect(outsideTile.resetFaces).not.toHaveBeenCalled();
    });

    it('should call resetFaces on non-colliding tiles', function ()
    {
        var tile = makeTile(1, 1, false);
        var layer = makeLayer(4, 4, [ tile ]);

        CalculateFacesWithin(0, 0, 4, 4, layer);

        expect(tile.resetFaces).toHaveBeenCalled();
    });

    it('should not call resetFaces on colliding tiles', function ()
    {
        var tile = makeTile(1, 1, true);
        var layer = makeLayer(4, 4, [ tile ]);

        CalculateFacesWithin(0, 0, 4, 4, layer);

        expect(tile.resetFaces).not.toHaveBeenCalled();
    });

    it('should set all faces to true when a colliding tile has no neighbors', function ()
    {
        var tile = makeTile(1, 1, true);
        var layer = makeLayer(4, 4, [ tile ]);

        CalculateFacesWithin(0, 0, 4, 4, layer);

        expect(tile.faceTop).toBe(true);
        expect(tile.faceBottom).toBe(true);
        expect(tile.faceLeft).toBe(true);
        expect(tile.faceRight).toBe(true);
    });

    it('should set all faces to true when neighbors exist but do not collide', function ()
    {
        var tile = makeTile(1, 1, true);
        var nonColliding = makeTile(1, 0, false);
        var layer = makeLayer(4, 4, [ tile, nonColliding ]);

        CalculateFacesWithin(0, 0, 4, 4, layer);

        expect(tile.faceTop).toBe(true);
        expect(tile.faceBottom).toBe(true);
        expect(tile.faceLeft).toBe(true);
        expect(tile.faceRight).toBe(true);
    });

    it('should set faceTop to false when the tile above collides', function ()
    {
        var tile = makeTile(1, 1, true);
        var above = makeTile(1, 0, true);
        var layer = makeLayer(4, 4, [ tile, above ]);

        CalculateFacesWithin(0, 0, 4, 4, layer);

        expect(tile.faceTop).toBe(false);
        expect(tile.faceBottom).toBe(true);
        expect(tile.faceLeft).toBe(true);
        expect(tile.faceRight).toBe(true);
    });

    it('should set faceBottom to false when the tile below collides', function ()
    {
        var tile = makeTile(1, 1, true);
        var below = makeTile(1, 2, true);
        var layer = makeLayer(4, 4, [ tile, below ]);

        CalculateFacesWithin(0, 0, 4, 4, layer);

        expect(tile.faceTop).toBe(true);
        expect(tile.faceBottom).toBe(false);
        expect(tile.faceLeft).toBe(true);
        expect(tile.faceRight).toBe(true);
    });

    it('should set faceLeft to false when the tile to the left collides', function ()
    {
        var tile = makeTile(1, 1, true);
        var leftTile = makeTile(0, 1, true);
        var layer = makeLayer(4, 4, [ tile, leftTile ]);

        CalculateFacesWithin(0, 0, 4, 4, layer);

        expect(tile.faceTop).toBe(true);
        expect(tile.faceBottom).toBe(true);
        expect(tile.faceLeft).toBe(false);
        expect(tile.faceRight).toBe(true);
    });

    it('should set faceRight to false when the tile to the right collides', function ()
    {
        var tile = makeTile(1, 1, true);
        var rightTile = makeTile(2, 1, true);
        var layer = makeLayer(4, 4, [ tile, rightTile ]);

        CalculateFacesWithin(0, 0, 4, 4, layer);

        expect(tile.faceTop).toBe(true);
        expect(tile.faceBottom).toBe(true);
        expect(tile.faceLeft).toBe(true);
        expect(tile.faceRight).toBe(false);
    });

    it('should set all faces to false when surrounded by colliding tiles', function ()
    {
        var tile = makeTile(1, 1, true);
        var above = makeTile(1, 0, true);
        var below = makeTile(1, 2, true);
        var leftTile = makeTile(0, 1, true);
        var rightTile = makeTile(2, 1, true);
        var layer = makeLayer(4, 4, [ tile, above, below, leftTile, rightTile ]);

        CalculateFacesWithin(0, 0, 4, 4, layer);

        expect(tile.faceTop).toBe(false);
        expect(tile.faceBottom).toBe(false);
        expect(tile.faceLeft).toBe(false);
        expect(tile.faceRight).toBe(false);
    });

    it('should process multiple tiles independently', function ()
    {
        var tileA = makeTile(0, 0, true);
        var tileB = makeTile(1, 0, true);
        var layer = makeLayer(4, 4, [ tileA, tileB ]);

        CalculateFacesWithin(0, 0, 2, 1, layer);

        expect(tileA.faceRight).toBe(false);
        expect(tileA.faceLeft).toBe(true);
        expect(tileB.faceLeft).toBe(false);
        expect(tileB.faceRight).toBe(true);
    });

    it('should process a mix of colliding and non-colliding tiles', function ()
    {
        var collidingTile = makeTile(0, 0, true);
        var nonCollidingTile = makeTile(1, 0, false);
        var layer = makeLayer(4, 4, [ collidingTile, nonCollidingTile ]);

        CalculateFacesWithin(0, 0, 2, 1, layer);

        expect(collidingTile.resetFaces).not.toHaveBeenCalled();
        expect(nonCollidingTile.resetFaces).toHaveBeenCalled();
    });

    it('should use nonNull=true when looking up neighbors so empty tiles are returned', function ()
    {
        // A tile with index=-1 (empty) is returned when nonNull=true
        // and should NOT count as colliding, so faceTop stays true
        var tile = makeTile(1, 1, true);
        var emptyNeighbor = { x: 1, y: 0, index: -1, collides: false, resetFaces: vi.fn() };
        var layer = makeLayer(4, 4, [ tile ]);
        layer.data[0][1] = emptyNeighbor;

        CalculateFacesWithin(0, 0, 4, 4, layer);

        // empty neighbor doesn't collide, so faceTop should still be true
        expect(tile.faceTop).toBe(true);
    });

    it('should not process tiles that are not colliding when checking neighbors', function ()
    {
        var tile = makeTile(1, 1, false);
        var layer = makeLayer(4, 4, [ tile ]);

        CalculateFacesWithin(0, 0, 4, 4, layer);

        // non-colliding tile only calls resetFaces, doesn't set face properties
        expect(tile.resetFaces).toHaveBeenCalled();
        expect(tile.faceTop).toBe(false);
        expect(tile.faceBottom).toBe(false);
        expect(tile.faceLeft).toBe(false);
        expect(tile.faceRight).toBe(false);
    });

    it('should handle null entries in the layer data gracefully', function ()
    {
        var tile = makeTile(1, 1, true);
        var layer = makeLayer(4, 4, [ tile ]);
        // Place null explicitly (already the default, but being explicit)
        layer.data[1][0] = null;

        expect(function ()
        {
            CalculateFacesWithin(0, 0, 4, 4, layer);
        }).not.toThrow();

        expect(tile.faceTop).toBe(true);
    });
});
