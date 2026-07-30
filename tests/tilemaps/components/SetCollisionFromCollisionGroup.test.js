var SetCollisionFromCollisionGroup = require('../../../src/tilemaps/components/SetCollisionFromCollisionGroup');

function makeTile(collisionGroup, tx, ty)
{
    return {
        x: tx !== undefined ? tx : 0,
        y: ty !== undefined ? ty : 0,
        index: 1,
        collides: false,
        hasInterestingFace: false,
        faceTop: false,
        faceBottom: false,
        faceLeft: false,
        faceRight: false,
        getCollisionGroup: function () { return collisionGroup; },
        setCollision: vi.fn(function () { this.collides = true; }),
        resetCollision: vi.fn(function () { this.collides = false; }),
        resetFaces: vi.fn()
    };
}

function makeLayer(tiles)
{
    var height = tiles.length;
    var width = height > 0 ? tiles[0].length : 0;
    return {
        width: width,
        height: height,
        data: tiles
    };
}

describe('Phaser.Tilemaps.Components.SetCollisionFromCollisionGroup', function ()
{
    it('should be a function', function ()
    {
        expect(typeof SetCollisionFromCollisionGroup).toBe('function');
    });

    it('should call setCollision on tiles with non-empty collision group objects', function ()
    {
        var tile = makeTile({ objects: [{}] }, 0, 0);
        var layer = makeLayer([[tile]]);

        SetCollisionFromCollisionGroup(true, false, layer);

        expect(tile.setCollision).toHaveBeenCalledOnce();
    });

    it('should not call setCollision on tiles with no collision group', function ()
    {
        var tile = makeTile(null, 0, 0);
        var layer = makeLayer([[tile]]);

        SetCollisionFromCollisionGroup(true, false, layer);

        expect(tile.setCollision).not.toHaveBeenCalled();
    });

    it('should not call setCollision on tiles with collision group but no objects property', function ()
    {
        var tile = makeTile({}, 0, 0);
        var layer = makeLayer([[tile]]);

        SetCollisionFromCollisionGroup(true, false, layer);

        expect(tile.setCollision).not.toHaveBeenCalled();
    });

    it('should not call setCollision on tiles with empty collision group objects array', function ()
    {
        var tile = makeTile({ objects: [] }, 0, 0);
        var layer = makeLayer([[tile]]);

        SetCollisionFromCollisionGroup(true, false, layer);

        expect(tile.setCollision).not.toHaveBeenCalled();
    });

    it('should skip null tiles without throwing', function ()
    {
        var layer = makeLayer([[null]]);

        expect(function ()
        {
            SetCollisionFromCollisionGroup(true, false, layer);
        }).not.toThrow();
    });

    it('should call resetCollision when collides is false and tile has collision group', function ()
    {
        var tile = makeTile({ objects: [{}] }, 0, 0);
        var layer = makeLayer([[tile]]);

        SetCollisionFromCollisionGroup(false, false, layer);

        expect(tile.resetCollision).toHaveBeenCalledOnce();
        expect(tile.setCollision).not.toHaveBeenCalled();
    });

    it('should default collides to true when undefined', function ()
    {
        var tile = makeTile({ objects: [{}] }, 0, 0);
        var layer = makeLayer([[tile]]);

        SetCollisionFromCollisionGroup(undefined, false, layer);

        expect(tile.setCollision).toHaveBeenCalledOnce();
        expect(tile.resetCollision).not.toHaveBeenCalled();
    });

    it('should call resetFaces via CalculateFacesWithin when recalculateFaces is true', function ()
    {
        var tile = makeTile(null, 0, 0);
        var layer = makeLayer([[tile]]);

        SetCollisionFromCollisionGroup(true, true, layer);

        // tile does not collide, so CalculateFacesWithin calls resetFaces on it
        expect(tile.resetFaces).toHaveBeenCalled();
    });

    it('should not call resetFaces when recalculateFaces is false', function ()
    {
        var tile = makeTile(null, 0, 0);
        var layer = makeLayer([[tile]]);

        SetCollisionFromCollisionGroup(true, false, layer);

        expect(tile.resetFaces).not.toHaveBeenCalled();
    });

    it('should default recalculateFaces to true when undefined', function ()
    {
        var tile = makeTile(null, 0, 0);
        var layer = makeLayer([[tile]]);

        SetCollisionFromCollisionGroup(true, undefined, layer);

        expect(tile.resetFaces).toHaveBeenCalled();
    });

    it('should process all tiles in a multi-row multi-column layer', function ()
    {
        var tileA = makeTile({ objects: [{}] }, 0, 0);
        var tileB = makeTile(null, 1, 0);
        var tileC = makeTile(null, 0, 1);
        var tileD = makeTile({ objects: [{}] }, 1, 1);
        var layer = makeLayer([
            [tileA, tileB],
            [tileC, tileD]
        ]);

        SetCollisionFromCollisionGroup(true, false, layer);

        expect(tileA.setCollision).toHaveBeenCalledOnce();
        expect(tileB.setCollision).not.toHaveBeenCalled();
        expect(tileC.setCollision).not.toHaveBeenCalled();
        expect(tileD.setCollision).toHaveBeenCalledOnce();
    });

    it('should handle an empty layer (zero width and height) without throwing', function ()
    {
        var layer = { width: 0, height: 0, data: [] };

        expect(function ()
        {
            SetCollisionFromCollisionGroup(true, false, layer);
        }).not.toThrow();
    });

    it('should process a tile with multiple collision group objects the same as one', function ()
    {
        var tile = makeTile({ objects: [{}, {}, {}] }, 0, 0);
        var layer = makeLayer([[tile]]);

        SetCollisionFromCollisionGroup(true, false, layer);

        expect(tile.setCollision).toHaveBeenCalledOnce();
    });

    it('should apply collides=false to all eligible tiles across the layer', function ()
    {
        var tileA = makeTile({ objects: [{}] }, 0, 0);
        var tileB = makeTile({ objects: [{}] }, 1, 0);
        var layer = makeLayer([[tileA, tileB]]);

        SetCollisionFromCollisionGroup(false, false, layer);

        expect(tileA.resetCollision).toHaveBeenCalledOnce();
        expect(tileB.resetCollision).toHaveBeenCalledOnce();
        expect(tileA.setCollision).not.toHaveBeenCalled();
        expect(tileB.setCollision).not.toHaveBeenCalled();
    });
});
