var IsometricCullTiles = require('../../../src/tilemaps/components/IsometricCullTiles');

/**
 * Build a minimal tile object.
 */
function makeTile (index, visible, alpha)
{
    return {
        index: index !== undefined ? index : 1,
        visible: visible !== undefined ? visible : true,
        alpha: alpha !== undefined ? alpha : 1
    };
}

/**
 * Build a minimal layer with skipCull=true (bypasses CheckIsoBounds).
 */
function makeLayer (mapData, width, height, skipCull)
{
    return {
        data: mapData,
        width: width,
        height: height,
        tileWidth: 64,
        tileHeight: 32,
        tilemapLayer: {
            skipCull: skipCull !== undefined ? skipCull : true,
            tilesDrawn: 0,
            tilesTotal: 0
        }
    };
}

/**
 * Build a layer where CheckIsoBounds will return true for all tiles —
 * uses a giant camera worldView and a tileToWorldXY that returns the tile
 * coords scaled to pixels.
 */
function makeLayerWithCull (mapData, width, height)
{
    return {
        data: mapData,
        width: width,
        height: height,
        tileWidth: 64,
        tileHeight: 32,
        tilemapLayer: {
            skipCull: false,
            tilesDrawn: 0,
            tilesTotal: 0,
            cullPaddingX: 0,
            cullPaddingY: 0,
            scaleX: 1,
            scaleY: 1,
            tilemap: {
                tileToWorldXY: function (tileX, tileY, point)
                {
                    point.x = tileX * 64;
                    point.y = tileY * 32;
                    return point;
                }
            }
        }
    };
}

/**
 * A camera worldView that encompasses all tile positions in a small map.
 * With 0 cullPadding, a tile at (0,0) maps to world (0,0).
 * The condition checks: pos.x > camX + scaleX*tileWidth*(-0-0.5)
 *                         => 0 > camX - 32  => camX < 32  => use camX=-100
 * etc. A large worldView (-10000 to 10000) covers everything.
 */
function makeCamera ()
{
    return {
        worldView: {
            x: -10000,
            right: 10000,
            y: -10000,
            bottom: 10000
        }
    };
}

/**
 * A camera whose worldView is far away so every tile is outside bounds.
 */
function makeCameraOutOfRange ()
{
    return {
        worldView: {
            x: 999999,
            right: 1000000,
            y: 999999,
            bottom: 1000000
        }
    };
}

describe('Phaser.Tilemaps.Components.IsometricCullTiles', function ()
{
    describe('return value and output array', function ()
    {
        it('should return the outputArray', function ()
        {
            var layer = makeLayer([[makeTile()]], 1, 1);
            var camera = makeCamera();
            var output = [];

            var result = IsometricCullTiles(layer, camera, output, 0);

            expect(result).toBe(output);
        });

        it('should return an array when no outputArray is provided', function ()
        {
            var layer = makeLayer([[makeTile()]], 1, 1);
            var camera = makeCamera();

            var result = IsometricCullTiles(layer, camera, undefined, 0);

            expect(Array.isArray(result)).toBe(true);
        });

        it('should clear the outputArray before filling it', function ()
        {
            var layer = makeLayer([[null]], 1, 1);
            var camera = makeCamera();
            var output = [{ stale: true }, { stale: true }];

            IsometricCullTiles(layer, camera, output, 0);

            expect(output.length).toBe(0);
        });

        it('should use renderOrder 0 by default', function ()
        {
            var t00 = makeTile();
            var t01 = makeTile();
            var layer = makeLayer([[t00, t01]], 2, 1);
            var camera = makeCamera();
            var output = [];

            IsometricCullTiles(layer, camera, output);

            expect(output[0]).toBe(t00);
            expect(output[1]).toBe(t01);
        });
    });

    describe('tile filtering', function ()
    {
        it('should skip null tiles', function ()
        {
            var layer = makeLayer([[null]], 1, 1);
            var camera = makeCamera();
            var output = [];

            IsometricCullTiles(layer, camera, output, 0);

            expect(output.length).toBe(0);
        });

        it('should skip tiles with index -1', function ()
        {
            var layer = makeLayer([[makeTile(-1)]], 1, 1);
            var camera = makeCamera();
            var output = [];

            IsometricCullTiles(layer, camera, output, 0);

            expect(output.length).toBe(0);
        });

        it('should skip tiles where visible is false', function ()
        {
            var layer = makeLayer([[makeTile(1, false)]], 1, 1);
            var camera = makeCamera();
            var output = [];

            IsometricCullTiles(layer, camera, output, 0);

            expect(output.length).toBe(0);
        });

        it('should skip tiles where alpha is 0', function ()
        {
            var layer = makeLayer([[makeTile(1, true, 0)]], 1, 1);
            var camera = makeCamera();
            var output = [];

            IsometricCullTiles(layer, camera, output, 0);

            expect(output.length).toBe(0);
        });

        it('should include tiles with valid index, visible true, and non-zero alpha', function ()
        {
            var tile = makeTile(1, true, 1);
            var layer = makeLayer([[tile]], 1, 1);
            var camera = makeCamera();
            var output = [];

            IsometricCullTiles(layer, camera, output, 0);

            expect(output.length).toBe(1);
            expect(output[0]).toBe(tile);
        });

        it('should include tiles with partial alpha (non-zero)', function ()
        {
            var tile = makeTile(1, true, 0.5);
            var layer = makeLayer([[tile]], 1, 1);
            var camera = makeCamera();
            var output = [];

            IsometricCullTiles(layer, camera, output, 0);

            expect(output.length).toBe(1);
        });

        it('should include only valid tiles among a mix', function ()
        {
            var good = makeTile(1, true, 1);
            var badIndex = makeTile(-1);
            var badVisible = makeTile(1, false);
            var badAlpha = makeTile(1, true, 0);

            var layer = makeLayer([[good, badIndex, badVisible, badAlpha]], 4, 1);
            var camera = makeCamera();
            var output = [];

            IsometricCullTiles(layer, camera, output, 0);

            expect(output.length).toBe(1);
            expect(output[0]).toBe(good);
        });
    });

    describe('cull behaviour (skipCull = true)', function ()
    {
        it('should include all valid tiles when skipCull is true regardless of position', function ()
        {
            var t0 = makeTile();
            var t1 = makeTile();
            var layer = makeLayer([[t0, t1]], 2, 1, true);
            var camera = makeCameraOutOfRange();
            var output = [];

            IsometricCullTiles(layer, camera, output, 0);

            expect(output.length).toBe(2);
        });
    });

    describe('cull behaviour (skipCull = false)', function ()
    {
        it('should include tiles that are within camera bounds', function ()
        {
            var tile = makeTile();
            var layer = makeLayerWithCull([[tile]], 1, 1);
            var camera = makeCamera();
            var output = [];

            IsometricCullTiles(layer, camera, output, 0);

            expect(output.length).toBe(1);
        });

        it('should exclude tiles that are outside camera bounds', function ()
        {
            var tile = makeTile();
            var layer = makeLayerWithCull([[tile]], 1, 1);
            var camera = makeCameraOutOfRange();
            var output = [];

            IsometricCullTiles(layer, camera, output, 0);

            expect(output.length).toBe(0);
        });

        it('should apply culling per tile independently', function ()
        {
            //  tile at (0,0) maps to world (0,0).
            //  The x check: pos.x > camX + scaleX*tileWidth*(-0-0.5)
            //  => 0 > 500 + 64*(-0.5) = 500 - 32 = 468  => FALSE → tile culled.
            var tile = makeTile();
            var layer = makeLayerWithCull([[tile]], 1, 1);

            var narrowCamera = {
                worldView: {
                    x: 500,
                    right: 1000,
                    y: 500,
                    bottom: 1000
                }
            };

            var output = [];

            IsometricCullTiles(layer, narrowCamera, output, 0);

            //  tile at world(0,0) is to the left of camera.worldView.x=500 → culled
            expect(output.length).toBe(0);
        });
    });

    describe('tilemapLayer statistics', function ()
    {
        it('should set tilesDrawn to the count of tiles added to outputArray', function ()
        {
            var t0 = makeTile();
            var t1 = makeTile(-1);
            var layer = makeLayer([[t0, t1]], 2, 1);
            var camera = makeCamera();

            IsometricCullTiles(layer, camera, [], 0);

            expect(layer.tilemapLayer.tilesDrawn).toBe(1);
        });

        it('should set tilesTotal to mapWidth * mapHeight', function ()
        {
            var row0 = [makeTile(), makeTile(), makeTile()];
            var row1 = [makeTile(), makeTile(), makeTile()];
            var layer = makeLayer([row0, row1], 3, 2);
            var camera = makeCamera();

            IsometricCullTiles(layer, camera, [], 0);

            expect(layer.tilemapLayer.tilesTotal).toBe(6);
        });

        it('should set tilesDrawn to 0 when all tiles are filtered', function ()
        {
            var layer = makeLayer([[null, null]], 2, 1);
            var camera = makeCamera();

            IsometricCullTiles(layer, camera, [], 0);

            expect(layer.tilemapLayer.tilesDrawn).toBe(0);
        });

        it('should set tilesDrawn equal to output length', function ()
        {
            var tiles = [makeTile(), makeTile(), makeTile()];
            var layer = makeLayer([tiles], 3, 1);
            var camera = makeCamera();
            var output = [];

            IsometricCullTiles(layer, camera, output, 0);

            expect(layer.tilemapLayer.tilesDrawn).toBe(output.length);
        });
    });

    describe('renderOrder 0 - right-down', function ()
    {
        it('should iterate x left-to-right within each row', function ()
        {
            var t00 = makeTile();
            var t01 = makeTile();
            var t10 = makeTile();
            var t11 = makeTile();
            var layer = makeLayer([[t00, t01], [t10, t11]], 2, 2);
            var camera = makeCamera();
            var output = [];

            IsometricCullTiles(layer, camera, output, 0);

            expect(output[0]).toBe(t00);
            expect(output[1]).toBe(t01);
            expect(output[2]).toBe(t10);
            expect(output[3]).toBe(t11);
        });
    });

    describe('renderOrder 1 - left-down', function ()
    {
        it('should iterate x right-to-left within each row', function ()
        {
            var t00 = makeTile();
            var t01 = makeTile();
            var t10 = makeTile();
            var t11 = makeTile();
            //  x starts at drawRight=mapWidth=2 → mapData[y][2] is undefined (skipped)
            //  then x=1, x=0
            var layer = makeLayer([[t00, t01], [t10, t11]], 2, 2);
            var camera = makeCamera();
            var output = [];

            IsometricCullTiles(layer, camera, output, 1);

            expect(output[0]).toBe(t01);
            expect(output[1]).toBe(t00);
            expect(output[2]).toBe(t11);
            expect(output[3]).toBe(t10);
        });
    });

    describe('renderOrder 2 - right-up', function ()
    {
        it('should iterate rows bottom-to-top, x left-to-right', function ()
        {
            var t00 = makeTile();
            var t01 = makeTile();
            var t10 = makeTile();
            var t11 = makeTile();
            //  The loop starts at y=drawBottom=mapHeight=2.
            //  mapData must have a row at index 2 (null entries are skipped by !tile).
            //  Then y=1, y=0.
            var layer = makeLayer([[t00, t01], [t10, t11], [null, null]], 2, 2);
            var camera = makeCamera();
            var output = [];

            IsometricCullTiles(layer, camera, output, 2);

            expect(output[0]).toBe(t10);
            expect(output[1]).toBe(t11);
            expect(output[2]).toBe(t00);
            expect(output[3]).toBe(t01);
        });
    });

    describe('renderOrder 3 - left-up', function ()
    {
        it('should iterate rows bottom-to-top, x right-to-left', function ()
        {
            var t00 = makeTile();
            var t01 = makeTile();
            var t10 = makeTile();
            var t11 = makeTile();
            //  The loop starts at y=mapHeight=2 (needs a row) and x=mapWidth=2 (needs a column).
            //  Extra null entries at those indices are skipped by !tile.
            var layer = makeLayer([[t00, t01, null], [t10, t11, null], [null, null, null]], 2, 2);
            var camera = makeCamera();
            var output = [];

            IsometricCullTiles(layer, camera, output, 3);

            expect(output[0]).toBe(t11);
            expect(output[1]).toBe(t10);
            expect(output[2]).toBe(t01);
            expect(output[3]).toBe(t00);
        });
    });

    describe('unknown renderOrder', function ()
    {
        it('should return an empty array for an unrecognised render order', function ()
        {
            var tile = makeTile();
            var layer = makeLayer([[tile]], 1, 1);
            var camera = makeCamera();
            var output = [];

            var result = IsometricCullTiles(layer, camera, output, 99);

            expect(result).toBe(output);
            expect(output.length).toBe(0);
        });

        it('should still set tilesTotal correctly for an unrecognised render order', function ()
        {
            var layer = makeLayer([[makeTile(), makeTile()]], 2, 1);
            var camera = makeCamera();

            IsometricCullTiles(layer, camera, [], 99);

            expect(layer.tilemapLayer.tilesTotal).toBe(2);
        });
    });

    describe('empty map', function ()
    {
        it('should return an empty array for a 0x0 map', function ()
        {
            var layer = makeLayer([], 0, 0);
            var camera = makeCamera();
            var output = [];

            var result = IsometricCullTiles(layer, camera, output, 0);

            expect(result.length).toBe(0);
        });

        it('should set tilesTotal to 0 for a 0x0 map', function ()
        {
            var layer = makeLayer([], 0, 0);
            var camera = makeCamera();

            IsometricCullTiles(layer, camera, [], 0);

            expect(layer.tilemapLayer.tilesTotal).toBe(0);
        });
    });
});
