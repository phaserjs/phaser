var CalculateFacesAt = require('../../../src/tilemaps/components/CalculateFacesAt');

// Helper: create a mock tile
function makeTile(index, collides)
{
    return {
        index: index === undefined ? 1 : index,
        collides: collides === undefined ? false : collides,
        faceTop: false,
        faceBottom: false,
        faceLeft: false,
        faceRight: false,
        resetFaces: function ()
        {
            this.faceTop = false;
            this.faceBottom = false;
            this.faceLeft = false;
            this.faceRight = false;
        }
    };
}

// Helper: create a 3x3 layer with a tile at each position.
// tileAt[row][col] — center tile is at (1, 1) in tile coords.
// Pass null to leave a cell empty (no tile).
function makeLayer(tiles)
{
    // tiles is a 3x3 array (rows x cols), or use defaults
    var data = [
        [ tiles[0][0], tiles[0][1], tiles[0][2] ],
        [ tiles[1][0], tiles[1][1], tiles[1][2] ],
        [ tiles[2][0], tiles[2][1], tiles[2][2] ]
    ];
    return { width: 3, height: 3, data: data };
}

describe('Phaser.Tilemaps.Components.CalculateFacesAt', function ()
{
    describe('return value', function ()
    {
        it('should return the tile at the given coordinates', function ()
        {
            var center = makeTile(1, true);
            var layer = makeLayer([
                [ null, null, null ],
                [ null, center, null ],
                [ null, null, null ]
            ]);

            var result = CalculateFacesAt(1, 1, layer);

            expect(result).toBe(center);
        });

        it('should return null when no tile exists at the coordinates', function ()
        {
            var layer = makeLayer([
                [ null, null, null ],
                [ null, null, null ],
                [ null, null, null ]
            ]);

            var result = CalculateFacesAt(1, 1, layer);

            expect(result).toBeNull();
        });

        it('should return null when coordinates are out of bounds', function ()
        {
            var layer = makeLayer([
                [ null, null, null ],
                [ null, null, null ],
                [ null, null, null ]
            ]);

            var result = CalculateFacesAt(5, 5, layer);

            expect(result).toBeNull();
        });
    });

    describe('colliding tile with no neighbors', function ()
    {
        it('should set all four faces on a colliding tile with no colliding neighbors', function ()
        {
            var center = makeTile(1, true);
            var layer = makeLayer([
                [ null, null, null ],
                [ null, center, null ],
                [ null, null, null ]
            ]);

            CalculateFacesAt(1, 1, layer);

            expect(center.faceTop).toBe(true);
            expect(center.faceBottom).toBe(true);
            expect(center.faceLeft).toBe(true);
            expect(center.faceRight).toBe(true);
        });
    });

    describe('non-colliding tile', function ()
    {
        it('should call resetFaces on a non-colliding tile', function ()
        {
            var center = makeTile(1, false);
            center.faceTop = true;
            center.faceBottom = true;
            center.faceLeft = true;
            center.faceRight = true;

            var layer = makeLayer([
                [ null, null, null ],
                [ null, center, null ],
                [ null, null, null ]
            ]);

            CalculateFacesAt(1, 1, layer);

            expect(center.faceTop).toBe(false);
            expect(center.faceBottom).toBe(false);
            expect(center.faceLeft).toBe(false);
            expect(center.faceRight).toBe(false);
        });
    });

    describe('shared face with colliding above neighbor', function ()
    {
        it('should clear faceTop on the tile and set faceBottom=false on above neighbor when both collide', function ()
        {
            var center = makeTile(1, true);
            var above = makeTile(1, true);
            var layer = makeLayer([
                [ null, above, null ],
                [ null, center, null ],
                [ null, null, null ]
            ]);

            CalculateFacesAt(1, 1, layer);

            expect(center.faceTop).toBe(false);
            expect(above.faceBottom).toBe(false);
        });

        it('should set faceBottom=true on above neighbor when center tile does not collide', function ()
        {
            var center = makeTile(1, false);
            var above = makeTile(1, true);
            var layer = makeLayer([
                [ null, above, null ],
                [ null, center, null ],
                [ null, null, null ]
            ]);

            CalculateFacesAt(1, 1, layer);

            expect(above.faceBottom).toBe(true);
        });
    });

    describe('shared face with colliding below neighbor', function ()
    {
        it('should clear faceBottom on the tile and set faceTop=false on below neighbor when both collide', function ()
        {
            var center = makeTile(1, true);
            var below = makeTile(1, true);
            var layer = makeLayer([
                [ null, null, null ],
                [ null, center, null ],
                [ null, below, null ]
            ]);

            CalculateFacesAt(1, 1, layer);

            expect(center.faceBottom).toBe(false);
            expect(below.faceTop).toBe(false);
        });

        it('should set faceTop=true on below neighbor when center tile does not collide', function ()
        {
            var center = makeTile(1, false);
            var below = makeTile(1, true);
            var layer = makeLayer([
                [ null, null, null ],
                [ null, center, null ],
                [ null, below, null ]
            ]);

            CalculateFacesAt(1, 1, layer);

            expect(below.faceTop).toBe(true);
        });
    });

    describe('shared face with colliding left neighbor', function ()
    {
        it('should clear faceLeft on the tile and set faceRight=false on left neighbor when both collide', function ()
        {
            var center = makeTile(1, true);
            var left = makeTile(1, true);
            var layer = makeLayer([
                [ null, null, null ],
                [ left, center, null ],
                [ null, null, null ]
            ]);

            CalculateFacesAt(1, 1, layer);

            expect(center.faceLeft).toBe(false);
            expect(left.faceRight).toBe(false);
        });

        it('should set faceRight=true on left neighbor when center tile does not collide', function ()
        {
            var center = makeTile(1, false);
            var left = makeTile(1, true);
            var layer = makeLayer([
                [ null, null, null ],
                [ left, center, null ],
                [ null, null, null ]
            ]);

            CalculateFacesAt(1, 1, layer);

            expect(left.faceRight).toBe(true);
        });
    });

    describe('shared face with colliding right neighbor', function ()
    {
        it('should clear faceRight on the tile and set faceLeft=false on right neighbor when both collide', function ()
        {
            var center = makeTile(1, true);
            var right = makeTile(1, true);
            var layer = makeLayer([
                [ null, null, null ],
                [ null, center, right ],
                [ null, null, null ]
            ]);

            CalculateFacesAt(1, 1, layer);

            expect(center.faceRight).toBe(false);
            expect(right.faceLeft).toBe(false);
        });

        it('should set faceLeft=true on right neighbor when center tile does not collide', function ()
        {
            var center = makeTile(1, false);
            var right = makeTile(1, true);
            var layer = makeLayer([
                [ null, null, null ],
                [ null, center, right ],
                [ null, null, null ]
            ]);

            CalculateFacesAt(1, 1, layer);

            expect(right.faceLeft).toBe(true);
        });
    });

    describe('tile surrounded by all colliding neighbors', function ()
    {
        it('should clear all four faces when center collides and all neighbors collide', function ()
        {
            var center = makeTile(1, true);
            var above = makeTile(1, true);
            var below = makeTile(1, true);
            var left = makeTile(1, true);
            var right = makeTile(1, true);
            var layer = makeLayer([
                [ null, above, null ],
                [ left, center, right ],
                [ null, below, null ]
            ]);

            CalculateFacesAt(1, 1, layer);

            expect(center.faceTop).toBe(false);
            expect(center.faceBottom).toBe(false);
            expect(center.faceLeft).toBe(false);
            expect(center.faceRight).toBe(false);
        });

        it('should set faceBottom=false on above, faceTop=false on below, faceRight=false on left, faceLeft=false on right', function ()
        {
            var center = makeTile(1, true);
            var above = makeTile(1, true);
            var below = makeTile(1, true);
            var left = makeTile(1, true);
            var right = makeTile(1, true);
            var layer = makeLayer([
                [ null, above, null ],
                [ left, center, right ],
                [ null, below, null ]
            ]);

            CalculateFacesAt(1, 1, layer);

            expect(above.faceBottom).toBe(false);
            expect(below.faceTop).toBe(false);
            expect(left.faceRight).toBe(false);
            expect(right.faceLeft).toBe(false);
        });
    });

    describe('non-colliding center with all colliding neighbors', function ()
    {
        it('should expose all inner faces of neighbors when center does not collide', function ()
        {
            var center = makeTile(1, false);
            var above = makeTile(1, true);
            var below = makeTile(1, true);
            var left = makeTile(1, true);
            var right = makeTile(1, true);
            var layer = makeLayer([
                [ null, above, null ],
                [ left, center, right ],
                [ null, below, null ]
            ]);

            CalculateFacesAt(1, 1, layer);

            expect(above.faceBottom).toBe(true);
            expect(below.faceTop).toBe(true);
            expect(left.faceRight).toBe(true);
            expect(right.faceLeft).toBe(true);
        });
    });

    describe('edge tiles (at layer boundary)', function ()
    {
        it('should handle a tile at the top-left corner where above and left are out of bounds', function ()
        {
            var corner = makeTile(1, true);
            var layer = makeLayer([
                [ corner, null, null ],
                [ null, null, null ],
                [ null, null, null ]
            ]);

            var result = CalculateFacesAt(0, 0, layer);

            expect(result).toBe(corner);
            expect(corner.faceTop).toBe(true);
            expect(corner.faceLeft).toBe(true);
        });

        it('should handle a tile at the bottom-right corner where below and right are out of bounds', function ()
        {
            var corner = makeTile(1, true);
            var layer = makeLayer([
                [ null, null, null ],
                [ null, null, null ],
                [ null, null, corner ]
            ]);

            var result = CalculateFacesAt(2, 2, layer);

            expect(result).toBe(corner);
            expect(corner.faceBottom).toBe(true);
            expect(corner.faceRight).toBe(true);
        });
    });

    describe('neighbors that do not collide', function ()
    {
        it('should not affect face flags when neighbor exists but does not collide', function ()
        {
            var center = makeTile(1, true);
            var above = makeTile(1, false);
            var layer = makeLayer([
                [ null, above, null ],
                [ null, center, null ],
                [ null, null, null ]
            ]);

            CalculateFacesAt(1, 1, layer);

            // above does not collide, so center.faceTop should remain true
            expect(center.faceTop).toBe(true);
            // above.faceBottom is not touched by the block guarded by above.collides
            expect(above.faceBottom).toBe(false);
        });
    });
});
