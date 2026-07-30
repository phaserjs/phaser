var ParseToTilemap = require('../../src/tilemaps/ParseToTilemap');
var Formats = require('../../src/tilemaps/Formats');
var Tilemap = require('../../src/tilemaps/Tilemap');

function makeScene (cacheData)
{
    return {
        cache: {
            tilemap: {
                get: function (key)
                {
                    return cacheData ? cacheData[key] : undefined;
                }
            }
        }
    };
}

describe('Phaser.Tilemaps.ParseToTilemap', function ()
{
    describe('return value', function ()
    {
        it('should return a Tilemap instance', function ()
        {
            var scene = makeScene();
            var result = ParseToTilemap(scene);

            expect(result).toBeInstanceOf(Tilemap);
        });

        it('should pass the scene to the Tilemap constructor', function ()
        {
            var scene = makeScene();
            var result = ParseToTilemap(scene);

            expect(result.scene).toBe(scene);
        });
    });

    describe('blank tilemap — no data, no key', function ()
    {
        it('should create a blank map with no layers when no key or data is given', function ()
        {
            var scene = makeScene();
            var result = ParseToTilemap(scene);

            expect(result.layers).toHaveLength(0);
        });

        it('should not call Parse when no key or data is given', function ()
        {
            var scene = makeScene();
            var result = ParseToTilemap(scene);

            // Parse adds layers; blank map has none
            expect(result.layers).toHaveLength(0);
        });

        it('should use default tileWidth of 32 for blank MapData', function ()
        {
            var scene = makeScene();
            var result = ParseToTilemap(scene);

            expect(result.tileWidth).toBe(32);
        });

        it('should use default tileHeight of 32 for blank MapData', function ()
        {
            var scene = makeScene();
            var result = ParseToTilemap(scene);

            expect(result.tileHeight).toBe(32);
        });

        it('should use default width of 10 for blank MapData', function ()
        {
            var scene = makeScene();
            var result = ParseToTilemap(scene);

            expect(result.width).toBe(10);
        });

        it('should use default height of 10 for blank MapData', function ()
        {
            var scene = makeScene();
            var result = ParseToTilemap(scene);

            expect(result.height).toBe(10);
        });

        it('should pass custom tileWidth to blank MapData', function ()
        {
            var scene = makeScene();
            var result = ParseToTilemap(scene, undefined, 64);

            expect(result.tileWidth).toBe(64);
        });

        it('should pass custom tileHeight to blank MapData', function ()
        {
            var scene = makeScene();
            var result = ParseToTilemap(scene, undefined, 32, 64);

            expect(result.tileHeight).toBe(64);
        });

        it('should pass custom width to blank MapData', function ()
        {
            var scene = makeScene();
            var result = ParseToTilemap(scene, undefined, 32, 32, 20);

            expect(result.width).toBe(20);
        });

        it('should pass custom height to blank MapData', function ()
        {
            var scene = makeScene();
            var result = ParseToTilemap(scene, undefined, 32, 32, 10, 20);

            expect(result.height).toBe(20);
        });
    });

    describe('with 2D array data', function ()
    {
        it('should call Parse when a 2D array is provided', function ()
        {
            var scene = makeScene();
            var data = [[0, 1], [2, 3]];
            var result = ParseToTilemap(scene, undefined, 32, 32, 10, 10, data);

            // Parse2DArray creates one layer
            expect(result.layers).toHaveLength(1);
        });

        it('should set ARRAY_2D format on the result', function ()
        {
            var scene = makeScene();
            var data = [[0, 1], [2, 3]];
            var result = ParseToTilemap(scene, undefined, 32, 32, 10, 10, data);

            expect(result.format).toBe(Formats.ARRAY_2D);
        });

        it('should derive width from the 2D array column count', function ()
        {
            var scene = makeScene();
            var data = [[0, 1, 2], [3, 4, 5]];
            var result = ParseToTilemap(scene, undefined, 32, 32, 10, 10, data);

            expect(result.width).toBe(3);
        });

        it('should derive height from the 2D array row count', function ()
        {
            var scene = makeScene();
            var data = [[0, 1], [2, 3], [4, 5]];
            var result = ParseToTilemap(scene, undefined, 32, 32, 10, 10, data);

            expect(result.height).toBe(3);
        });

        it('should pass insertNull true to Parse — -1 tiles become null', function ()
        {
            var scene = makeScene();
            var data = [[-1, 0]];
            var result = ParseToTilemap(scene, undefined, 32, 32, 10, 10, data, true);

            expect(result.layers[0].data[0][0]).toBeNull();
        });

        it('should default insertNull to false — -1 tiles become Tile objects', function ()
        {
            var scene = makeScene();
            var data = [[-1, 0]];
            var result = ParseToTilemap(scene, undefined, 32, 32, 10, 10, data);

            expect(result.layers[0].data[0][0]).not.toBeNull();
            expect(result.layers[0].data[0][0].index).toBe(-1);
        });

        it('should pass custom tileWidth to Parse', function ()
        {
            var scene = makeScene();
            var data = [[0, 1]];
            var result = ParseToTilemap(scene, undefined, 16, 32, 10, 10, data);

            expect(result.tileWidth).toBe(16);
        });

        it('should pass custom tileHeight to Parse', function ()
        {
            var scene = makeScene();
            var data = [[0, 1]];
            var result = ParseToTilemap(scene, undefined, 32, 16, 10, 10, data);

            expect(result.tileHeight).toBe(16);
        });

        it('should use the result of Parse as map data', function ()
        {
            var scene = makeScene();
            var data = [[0, 1]];
            var result = ParseToTilemap(scene, 'myMap', 32, 32, 10, 10, data);

            expect(result.format).toBe(Formats.ARRAY_2D);
            expect(result.layers).toHaveLength(1);
        });

        it('should not create a blank map when data is provided', function ()
        {
            var scene = makeScene();
            var data = [[0, 1]];
            var result = ParseToTilemap(scene, undefined, 32, 32, 10, 10, data);

            // Blank map has 0 layers; parsed map has 1
            expect(result.layers).toHaveLength(1);
        });

        it('should use ARRAY_2D format even when a key also matches the cache', function ()
        {
            var cacheData = { myKey: { format: Formats.CSV, data: '0,1' } };
            var scene = makeScene(cacheData);
            var data = [[0, 1]];
            var result = ParseToTilemap(scene, 'myKey', 32, 32, 10, 10, data);

            expect(result.format).toBe(Formats.ARRAY_2D);
        });
    });

    describe('with cache key', function ()
    {
        it('should call scene.cache.tilemap.get with the given key', function ()
        {
            var getCalled = false;
            var keyUsed = null;
            var scene = {
                cache: {
                    tilemap: {
                        get: function (key)
                        {
                            getCalled = true;
                            keyUsed = key;
                            return null;
                        }
                    }
                }
            };

            ParseToTilemap(scene, 'myKey');

            expect(getCalled).toBe(true);
            expect(keyUsed).toBe('myKey');
        });

        it('should parse data from the cache using the stored format', function ()
        {
            var cachedData = { format: Formats.ARRAY_2D, data: [[0, 1], [2, 3]] };
            var scene = makeScene({ myMap: cachedData });
            var result = ParseToTilemap(scene, 'myMap');

            expect(result.format).toBe(Formats.ARRAY_2D);
            expect(result.layers).toHaveLength(1);
        });

        it('should pass the cache format to Parse — CSV', function ()
        {
            var cachedData = { format: Formats.CSV, data: '0,1\n2,3' };
            var scene = makeScene({ csvMap: cachedData });
            var result = ParseToTilemap(scene, 'csvMap');

            expect(result.format).toBe(Formats.CSV);
        });

        it('should use the result of Parse as map data', function ()
        {
            var cachedData = { format: Formats.ARRAY_2D, data: [[0, 1], [2, 3]] };
            var scene = makeScene({ myMap: cachedData });
            var result = ParseToTilemap(scene, 'myMap');

            expect(result.layers).toHaveLength(1);
            expect(result.tileWidth).toBe(32);
        });

        it('should warn and create blank map when key is not found in cache', function ()
        {
            var scene = makeScene({});
            var warned = false;
            var warnMessage = '';
            var originalWarn = console.warn;

            console.warn = function (msg)
            {
                warned = true;
                warnMessage = msg;
            };

            var result = ParseToTilemap(scene, 'missingKey');

            console.warn = originalWarn;

            expect(warned).toBe(true);
            expect(warnMessage).toContain('missingKey');
            expect(result.layers).toHaveLength(0);
        });

        it('should not call Parse when cache returns falsy', function ()
        {
            var scene = makeScene({});
            var originalWarn = console.warn;
            console.warn = function () {};

            var result = ParseToTilemap(scene, 'missingKey');

            console.warn = originalWarn;

            // Blank map — no layers added by Parse
            expect(result.layers).toHaveLength(0);
        });

        it('should pass custom tileWidth from args to Parse', function ()
        {
            var cachedData = { format: Formats.ARRAY_2D, data: [[0, 1], [2, 3]] };
            var scene = makeScene({ myMap: cachedData });
            var result = ParseToTilemap(scene, 'myMap', 16);

            expect(result.tileWidth).toBe(16);
        });

        it('should pass insertNull from args to Parse when loading from cache', function ()
        {
            var cachedData = { format: Formats.ARRAY_2D, data: [[-1, 0]] };
            var scene = makeScene({ myMap: cachedData });
            var result = ParseToTilemap(scene, 'myMap', 32, 32, 10, 10, undefined, true);

            expect(result.layers[0].data[0][0]).toBeNull();
        });
    });

    describe('Formats constants', function ()
    {
        it('should export ARRAY_2D as 2', function ()
        {
            expect(Formats.ARRAY_2D).toBe(2);
        });

        it('should export TILED_JSON as 1', function ()
        {
            expect(Formats.TILED_JSON).toBe(1);
        });

        it('should export CSV as 0', function ()
        {
            expect(Formats.CSV).toBe(0);
        });

        it('should export WELTMEISTER as 3', function ()
        {
            expect(Formats.WELTMEISTER).toBe(3);
        });
    });
});
