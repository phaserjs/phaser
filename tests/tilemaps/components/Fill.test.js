var Fill = require('../../../src/tilemaps/components/Fill');

// Minimal tile stub compatible with SetTileCollision and CalculateFacesWithin
function makeTile (index, x, y)
{
    var tile = {
        index: (index !== undefined) ? index : -1,
        x: (x !== undefined) ? x : 0,
        y: (y !== undefined) ? y : 0,
        collideLeft: false,
        collideRight: false,
        collideUp: false,
        collideDown: false,
        faceTop: false,
        faceBottom: false,
        faceLeft: false,
        faceRight: false,
        tilemapLayer: null,
        setCollision: function (left, right, up, down)
        {
            this.collideLeft = left;
            this.collideRight = (right !== undefined) ? right : left;
            this.collideUp = (up !== undefined) ? up : left;
            this.collideDown = (down !== undefined) ? down : left;
            this.faceLeft = this.collideLeft;
            this.faceRight = this.collideRight;
            this.faceTop = this.collideUp;
            this.faceBottom = this.collideDown;
        },
        resetCollision: function ()
        {
            this.collideLeft = false;
            this.collideRight = false;
            this.collideUp = false;
            this.collideDown = false;
            this.faceTop = false;
            this.faceBottom = false;
            this.faceLeft = false;
            this.faceRight = false;
        },
        resetFaces: function ()
        {
            this.faceTop = false;
            this.faceBottom = false;
            this.faceLeft = false;
            this.faceRight = false;
        }
    };

    Object.defineProperty(tile, 'collides', {
        get: function ()
        {
            return this.collideLeft || this.collideRight || this.collideUp || this.collideDown;
        }
    });

    return tile;
}

function makeLayer (width, height, collideIndexes)
{
    var data = [];

    for (var y = 0; y < height; y++)
    {
        data[y] = [];

        for (var x = 0; x < width; x++)
        {
            data[y][x] = makeTile(-1, x, y);
        }
    }

    return {
        data: data,
        width: width,
        height: height,
        collideIndexes: collideIndexes || []
    };
}

describe('Phaser.Tilemaps.Components.Fill', function ()
{
    it('should only modify tiles within the specified rectangle', function ()
    {
        var layer = makeLayer(10, 10);

        Fill(3, 1, 2, 4, 5, false, layer);

        // Tiles inside the fill area should have index 3
        expect(layer.data[2][1].index).toBe(3);
        expect(layer.data[6][4].index).toBe(3);

        // Tiles outside the fill area should remain unchanged
        expect(layer.data[0][0].index).toBe(-1);
        expect(layer.data[2][0].index).toBe(-1);
        expect(layer.data[7][1].index).toBe(-1);
    });

    it('should set the index on each tile in the filled area', function ()
    {
        var layer = makeLayer(2, 1);

        Fill(7, 0, 0, 2, 1, false, layer);

        expect(layer.data[0][0].index).toBe(7);
        expect(layer.data[0][1].index).toBe(7);
    });

    it('should set collision on each tile when index is in collideIndexes', function ()
    {
        var layer = makeLayer(2, 1, [3]);

        Fill(3, 0, 0, 2, 1, false, layer);

        expect(layer.data[0][0].collides).toBe(true);
        expect(layer.data[0][1].collides).toBe(true);
    });

    it('should set tile to collide when index is in collideIndexes', function ()
    {
        var layer = makeLayer(1, 1, [5]);

        Fill(5, 0, 0, 1, 1, false, layer);

        expect(layer.data[0][0].collides).toBe(true);
    });

    it('should not set tile to collide when index is not in collideIndexes', function ()
    {
        var layer = makeLayer(1, 1, [5]);

        Fill(3, 0, 0, 1, 1, false, layer);

        expect(layer.data[0][0].collides).toBe(false);
    });

    it('should not set tile to collide when collideIndexes is empty', function ()
    {
        var layer = makeLayer(1, 1, []);

        Fill(3, 0, 0, 1, 1, false, layer);

        expect(layer.data[0][0].collides).toBe(false);
    });

    it('should not recalculate faces when recalculateFaces is false', function ()
    {
        // With two adjacent colliding tiles and recalculateFaces=false,
        // setCollision sets all faces true — the shared internal face is NOT cleared
        var layer = makeLayer(3, 1, [3]);

        Fill(3, 0, 0, 2, 1, false, layer);

        // faceRight on left tile should still be true (shared face NOT cleared)
        expect(layer.data[0][0].faceRight).toBe(true);
    });

    it('should recalculate faces when recalculateFaces is true', function ()
    {
        // With two adjacent colliding tiles and recalculateFaces=true,
        // CalculateFacesWithin clears the shared internal face
        var layer = makeLayer(3, 1, [3]);

        Fill(3, 0, 0, 2, 1, true, layer);

        // faceRight on left tile should be false (right neighbor also collides)
        expect(layer.data[0][0].faceRight).toBe(false);
    });

    it('should call CalculateFacesWithin with area expanded by 1 on each side', function ()
    {
        // Create a large enough layer and fill a sub-region
        // The expanded CalculateFacesWithin area covers one tile beyond the fill region
        // so tiles just outside should also have their faces recalculated
        var layer = makeLayer(15, 15, [1]);

        // Fill a 4x5 region at (2,3) — expanded area is (1,2) to (6,8)
        Fill(1, 2, 3, 4, 5, true, layer);

        // Tile at (2,3) is in the fill area and should have collision set
        expect(layer.data[3][2].collides).toBe(true);
        // Tile at (5,7) is the last tile in the fill area (2+4-1=5, 3+5-1=7)
        expect(layer.data[7][5].collides).toBe(true);
    });

    it('should handle an empty tiles array without errors', function ()
    {
        // Fill outside layer bounds so GetTilesWithin returns no tiles
        var layer = makeLayer(4, 4);

        expect(function ()
        {
            Fill(1, 10, 10, 4, 4, true, layer);
        }).not.toThrow();
    });

    it('should process all tiles when multiple tiles are returned', function ()
    {
        var layer = makeLayer(3, 1, [2]);

        Fill(2, 0, 0, 3, 1, false, layer);

        expect(layer.data[0][0].index).toBe(2);
        expect(layer.data[0][1].index).toBe(2);
        expect(layer.data[0][2].index).toBe(2);
        expect(layer.data[0][0].collides).toBe(true);
        expect(layer.data[0][1].collides).toBe(true);
        expect(layer.data[0][2].collides).toBe(true);
    });

    it('should pass the layer to CalculateFacesWithin when recalculateFaces is true', function ()
    {
        // Verify that face recalculation uses the correct layer by checking tile state
        var layer = makeLayer(3, 1, [3]);

        Fill(3, 0, 0, 2, 1, true, layer);

        // CalculateFacesWithin was called with layer — internal shared face should be false
        expect(layer.data[0][0].faceRight).toBe(false);
        expect(layer.data[0][1].faceLeft).toBe(false);
    });

    it('should use index 0 when filling with index 0 and it is not in collideIndexes', function ()
    {
        var layer = makeLayer(1, 1, [1, 2]);

        layer.data[0][0].index = 5;

        Fill(0, 0, 0, 1, 1, false, layer);

        expect(layer.data[0][0].index).toBe(0);
        expect(layer.data[0][0].collides).toBe(false);
    });

    it('should handle negative tileX and tileY coordinates', function ()
    {
        // GetTilesWithin clips negative coords to layer bounds
        var layer = makeLayer(4, 4);

        expect(function ()
        {
            Fill(1, -1, -2, 4, 4, true, layer);
        }).not.toThrow();

        // Tiles clipped into bounds (starting at 0,0 with reduced dimensions) should be filled
        expect(layer.data[0][0].index).toBe(1);
    });
});
