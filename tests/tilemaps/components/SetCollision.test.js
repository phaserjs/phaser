var SetCollision = require('../../../src/tilemaps/components/SetCollision');

describe('Phaser.Tilemaps.Components.SetCollision', function ()
{
    function createTile(index, x, y)
    {
        return {
            index: index,
            x: x !== undefined ? x : 0,
            y: y !== undefined ? y : 0,
            collides: false,
            faceTop: false,
            faceBottom: false,
            faceLeft: false,
            faceRight: false,
            hasInterestingFace: false,
            setCollision: vi.fn(function () { this.collides = true; }),
            resetCollision: vi.fn(function () { this.collides = false; }),
            resetFaces: vi.fn()
        };
    }

    function createLayer(width, height, tileRows)
    {
        var data = [];

        for (var ty = 0; ty < height; ty++)
        {
            var row = [];

            for (var tx = 0; tx < width; tx++)
            {
                var tile = (tileRows && tileRows[ty]) ? tileRows[ty][tx] : null;
                row.push(tile !== undefined ? tile : null);
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

    beforeEach(function ()
    {
        vi.clearAllMocks();
    });

    // --- SetLayerCollisionIndex: collideIndexes updates ---

    it('should add a single index to layer.collideIndexes when collides is true', function ()
    {
        var layer = createLayer(1, 1);

        SetCollision(5, true, false, layer, false);

        expect(layer.collideIndexes).toContain(5);
    });

    it('should add all indexes from an array to layer.collideIndexes', function ()
    {
        var layer = createLayer(1, 1);

        SetCollision([2, 3, 15], true, false, layer, false);

        expect(layer.collideIndexes).toContain(2);
        expect(layer.collideIndexes).toContain(3);
        expect(layer.collideIndexes).toContain(15);
    });

    it('should remove an index from layer.collideIndexes when collides is false', function ()
    {
        var layer = createLayer(1, 1);
        layer.collideIndexes = [5, 7];

        SetCollision(5, false, false, layer, false);

        expect(layer.collideIndexes).not.toContain(5);
        expect(layer.collideIndexes).toContain(7);
    });

    it('should default collides to true and add index to layer.collideIndexes', function ()
    {
        var layer = createLayer(1, 1);

        SetCollision(5, undefined, false, layer, false);

        expect(layer.collideIndexes).toContain(5);
    });

    it('should not add the same index to collideIndexes twice', function ()
    {
        var layer = createLayer(1, 1);
        layer.collideIndexes = [5];

        SetCollision(5, true, false, layer, false);

        expect(layer.collideIndexes.length).toBe(1);
    });

    // --- SetTileCollision: tile updates ---

    it('should call setCollision on tiles matching the given index', function ()
    {
        var tile = createTile(5, 0, 0);
        var layer = createLayer(1, 1, [[tile]]);

        SetCollision(5, true, false, layer, true);

        expect(tile.setCollision).toHaveBeenCalledTimes(1);
    });

    it('should not call setCollision on tiles not matching the given index', function ()
    {
        var tile = createTile(7, 0, 0);
        var layer = createLayer(1, 1, [[tile]]);

        SetCollision(5, true, false, layer, true);

        expect(tile.setCollision).not.toHaveBeenCalled();
    });

    it('should call setCollision on all tiles matching any index in the array', function ()
    {
        var tile1 = createTile(2, 0, 0);
        var tile2 = createTile(5, 1, 0);
        var tile3 = createTile(9, 2, 0);
        var layer = createLayer(3, 1, [[tile1, tile2, tile3]]);

        SetCollision([2, 9], true, false, layer, true);

        expect(tile1.setCollision).toHaveBeenCalledTimes(1);
        expect(tile2.setCollision).not.toHaveBeenCalled();
        expect(tile3.setCollision).toHaveBeenCalledTimes(1);
    });

    it('should call resetCollision on matching tiles when collides is false', function ()
    {
        var tile = createTile(5, 0, 0);
        var layer = createLayer(1, 1, [[tile]]);

        SetCollision(5, false, false, layer, true);

        expect(tile.resetCollision).toHaveBeenCalledTimes(1);
        expect(tile.setCollision).not.toHaveBeenCalled();
    });

    it('should iterate all rows and columns of the layer', function ()
    {
        var tile00 = createTile(1, 0, 0);
        var tile01 = createTile(1, 1, 0);
        var tile10 = createTile(1, 0, 1);
        var tile11 = createTile(1, 1, 1);
        var layer = createLayer(2, 2, [[tile00, tile01], [tile10, tile11]]);

        SetCollision(1, true, false, layer, true);

        expect(tile00.setCollision).toHaveBeenCalledTimes(1);
        expect(tile01.setCollision).toHaveBeenCalledTimes(1);
        expect(tile10.setCollision).toHaveBeenCalledTimes(1);
        expect(tile11.setCollision).toHaveBeenCalledTimes(1);
    });

    it('should skip null tiles without throwing', function ()
    {
        var tile = createTile(5, 1, 0);
        var layer = createLayer(2, 1, [[null, tile]]);

        expect(function ()
        {
            SetCollision(5, true, false, layer, true);
        }).not.toThrow();

        expect(tile.setCollision).toHaveBeenCalledTimes(1);
    });

    // --- updateLayer parameter ---

    it('should not update tiles when updateLayer is false', function ()
    {
        var tile = createTile(5, 0, 0);
        var layer = createLayer(1, 1, [[tile]]);

        SetCollision(5, true, false, layer, false);

        expect(tile.setCollision).not.toHaveBeenCalled();
    });

    it('should default updateLayer to true and update matching tiles', function ()
    {
        var tile = createTile(5, 0, 0);
        var layer = createLayer(1, 1, [[tile]]);

        SetCollision(5, true, false, layer);

        expect(tile.setCollision).toHaveBeenCalledTimes(1);
    });

    // --- recalculateFaces parameter ---

    it('should call resetFaces on non-colliding tiles when recalculateFaces is true', function ()
    {
        var tile = createTile(99, 0, 0);
        var layer = createLayer(1, 1, [[tile]]);

        SetCollision(5, true, true, layer, false);

        expect(tile.resetFaces).toHaveBeenCalledTimes(1);
    });

    it('should not call resetFaces when recalculateFaces is false', function ()
    {
        var tile = createTile(99, 0, 0);
        var layer = createLayer(1, 1, [[tile]]);

        SetCollision(5, true, false, layer, false);

        expect(tile.resetFaces).not.toHaveBeenCalled();
    });

    it('should default recalculateFaces to true and process faces', function ()
    {
        var tile = createTile(99, 0, 0);
        var layer = createLayer(1, 1, [[tile]]);

        SetCollision(5, true, undefined, layer, false);

        expect(tile.resetFaces).toHaveBeenCalledTimes(1);
    });

    it('should set face properties on colliding tiles when recalculateFaces is true', function ()
    {
        var tile = createTile(5, 0, 0);
        var layer = createLayer(1, 1, [[tile]]);

        SetCollision(5, true, true, layer, true);

        // The tile's setCollision makes it collide, so CalculateFacesWithin
        // should set all faces to true (no adjacent colliding neighbors)
        expect(tile.faceTop).toBe(true);
        expect(tile.faceBottom).toBe(true);
        expect(tile.faceLeft).toBe(true);
        expect(tile.faceRight).toBe(true);
    });

    // --- Edge cases ---

    it('should handle an empty index array without modifying collideIndexes', function ()
    {
        var layer = createLayer(1, 1);
        layer.collideIndexes = [3];

        SetCollision([], true, false, layer, false);

        expect(layer.collideIndexes).toEqual([3]);
    });

    it('should handle a layer with no tiles (all null) without throwing', function ()
    {
        var layer = createLayer(3, 3);

        expect(function ()
        {
            SetCollision(5, true, true, layer, true);
        }).not.toThrow();
    });
});
