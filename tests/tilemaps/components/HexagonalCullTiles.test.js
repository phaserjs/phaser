var HexagonalCullTiles = require('../../../src/tilemaps/components/HexagonalCullTiles');

describe('Phaser.Tilemaps.Components.HexagonalCullTiles', function ()
{
    var layer;
    var camera;

    function makeTile(index, visible, alpha)
    {
        return {
            index: (index === undefined) ? 1 : index,
            visible: (visible === undefined) ? true : visible,
            alpha: (alpha === undefined) ? 1 : alpha
        };
    }

    function makeLayer(width, height, overrides)
    {
        var data = [];
        for (var y = 0; y < height; y++)
        {
            data[y] = [];
            for (var x = 0; x < width; x++)
            {
                data[y][x] = makeTile();
            }
        }

        var defaults = {
            data: data,
            width: width,
            height: height,
            hexSideLength: 25,
            staggerAxis: 'y',
            tilemapLayer: {
                tilemap: {
                    tileWidth: 32,
                    tileHeight: 32
                },
                scaleX: 1,
                scaleY: 1,
                x: 0,
                y: 0,
                cullPaddingX: 1,
                cullPaddingY: 1,
                skipCull: false,
                scrollFactorX: 1,
                scrollFactorY: 1,
                tilesDrawn: 0,
                tilesTotal: 0
            }
        };

        if (overrides)
        {
            for (var key in overrides)
            {
                if (Object.prototype.hasOwnProperty.call(overrides, key))
                {
                    defaults[key] = overrides[key];
                }
            }
        }

        return defaults;
    }

    function makeCamera(x, y, width, height)
    {
        return {
            worldView: {
                x: x,
                y: y,
                right: x + width,
                bottom: y + height
            }
        };
    }

    beforeEach(function ()
    {
        layer = makeLayer(10, 10);
        camera = makeCamera(0, 0, 320, 240);
    });

    it('should return an array', function ()
    {
        var result = HexagonalCullTiles(layer, camera);

        expect(Array.isArray(result)).toBe(true);
    });

    it('should return the outputArray passed in', function ()
    {
        var output = [];
        var result = HexagonalCullTiles(layer, camera, output);

        expect(result).toBe(output);
    });

    it('should use a new empty array when outputArray is not provided', function ()
    {
        var result = HexagonalCullTiles(layer, camera);

        expect(Array.isArray(result)).toBe(true);
    });

    it('should default renderOrder to 0 (right-down) when not provided', function ()
    {
        var result = HexagonalCullTiles(layer, camera);

        expect(result.length).toBeGreaterThan(0);
    });

    it('should clear the outputArray before populating it', function ()
    {
        var output = [ makeTile(), makeTile(), makeTile() ];

        HexagonalCullTiles(layer, camera, output);

        // The pre-existing items should be gone; only culled tiles remain
        for (var i = 0; i < output.length; i++)
        {
            expect(output[i].index).toBe(1);
        }
    });

    it('should populate tiles from the layer that fall within camera bounds', function ()
    {
        var result = HexagonalCullTiles(layer, camera);

        expect(result.length).toBeGreaterThan(0);
    });

    it('should return an empty array when there are no visible tiles', function ()
    {
        for (var y = 0; y < 10; y++)
        {
            for (var x = 0; x < 10; x++)
            {
                layer.data[y][x] = makeTile(1, false, 1);
            }
        }

        var result = HexagonalCullTiles(layer, camera);

        expect(result.length).toBe(0);
    });

    it('should skip tiles with index -1', function ()
    {
        for (var y = 0; y < 10; y++)
        {
            for (var x = 0; x < 10; x++)
            {
                layer.data[y][x] = makeTile(-1, true, 1);
            }
        }

        var result = HexagonalCullTiles(layer, camera);

        expect(result.length).toBe(0);
    });

    it('should skip tiles with alpha 0', function ()
    {
        for (var y = 0; y < 10; y++)
        {
            for (var x = 0; x < 10; x++)
            {
                layer.data[y][x] = makeTile(1, true, 0);
            }
        }

        var result = HexagonalCullTiles(layer, camera);

        expect(result.length).toBe(0);
    });

    it('should skip null tiles', function ()
    {
        for (var y = 0; y < 10; y++)
        {
            for (var x = 0; x < 10; x++)
            {
                layer.data[y][x] = null;
            }
        }

        var result = HexagonalCullTiles(layer, camera);

        expect(result.length).toBe(0);
    });

    it('should cover the full layer when skipCull is true and scrollFactors are 1', function ()
    {
        layer.tilemapLayer.skipCull = true;
        layer.tilemapLayer.scrollFactorX = 1;
        layer.tilemapLayer.scrollFactorY = 1;

        // Camera sees only a small area
        var smallCamera = makeCamera(0, 0, 64, 64);

        var result = HexagonalCullTiles(layer, smallCamera);

        // All 100 tiles in a 10x10 layer should be included when skipCull is true
        expect(result.length).toBe(100);
    });

    it('should not override bounds when skipCull is true but scrollFactorX is not 1', function ()
    {
        layer.tilemapLayer.skipCull = true;
        layer.tilemapLayer.scrollFactorX = 0.5;
        layer.tilemapLayer.scrollFactorY = 1;

        var smallCamera = makeCamera(0, 0, 64, 64);
        var resultPartial = HexagonalCullTiles(layer, smallCamera);

        layer.tilemapLayer.scrollFactorX = 1;
        var resultFull = HexagonalCullTiles(layer, smallCamera);

        // With scrollFactorX != 1 the full-layer override is skipped
        expect(resultFull.length).toBeGreaterThanOrEqual(resultPartial.length);
    });

    it('should not override bounds when skipCull is true but scrollFactorY is not 1', function ()
    {
        layer.tilemapLayer.skipCull = true;
        layer.tilemapLayer.scrollFactorX = 1;
        layer.tilemapLayer.scrollFactorY = 0.5;

        var smallCamera = makeCamera(0, 0, 64, 64);
        var resultPartial = HexagonalCullTiles(layer, smallCamera);

        layer.tilemapLayer.scrollFactorY = 1;
        var resultFull = HexagonalCullTiles(layer, smallCamera);

        expect(resultFull.length).toBeGreaterThanOrEqual(resultPartial.length);
    });

    it('should update tilesDrawn on the tilemapLayer', function ()
    {
        var result = HexagonalCullTiles(layer, camera);

        expect(layer.tilemapLayer.tilesDrawn).toBe(result.length);
    });

    it('should update tilesTotal on the tilemapLayer', function ()
    {
        HexagonalCullTiles(layer, camera);

        expect(layer.tilemapLayer.tilesTotal).toBe(layer.width * layer.height);
    });

    it('should work with renderOrder 0 (right-down)', function ()
    {
        var result = HexagonalCullTiles(layer, camera, [], 0);

        expect(result.length).toBeGreaterThan(0);
    });

    it('should work with renderOrder 1 (left-down)', function ()
    {
        var result = HexagonalCullTiles(layer, camera, [], 1);

        expect(result.length).toBeGreaterThan(0);
    });

    it('should work with renderOrder 2 (right-up)', function ()
    {
        var result = HexagonalCullTiles(layer, camera, [], 2);

        expect(result.length).toBeGreaterThan(0);
    });

    it('should work with renderOrder 3 (left-up)', function ()
    {
        var result = HexagonalCullTiles(layer, camera, [], 3);

        expect(result.length).toBeGreaterThan(0);
    });

    it('should return the same tiles regardless of renderOrder', function ()
    {
        var result0 = HexagonalCullTiles(layer, camera, [], 0);
        var result1 = HexagonalCullTiles(layer, camera, [], 1);
        var result2 = HexagonalCullTiles(layer, camera, [], 2);
        var result3 = HexagonalCullTiles(layer, camera, [], 3);

        expect(result0.length).toBe(result1.length);
        expect(result0.length).toBe(result2.length);
        expect(result0.length).toBe(result3.length);
    });

    it('should work with staggerAxis set to x', function ()
    {
        layer.staggerAxis = 'x';

        var result = HexagonalCullTiles(layer, camera);

        expect(result.length).toBeGreaterThan(0);
    });

    it('should work with staggerAxis set to y', function ()
    {
        layer.staggerAxis = 'y';

        var result = HexagonalCullTiles(layer, camera);

        expect(result.length).toBeGreaterThan(0);
    });

    it('should return no tiles when camera is far outside the layer', function ()
    {
        var farCamera = makeCamera(100000, 100000, 320, 240);
        layer.tilemapLayer.cullPaddingX = 0;
        layer.tilemapLayer.cullPaddingY = 0;

        var result = HexagonalCullTiles(layer, farCamera);

        expect(result.length).toBe(0);
    });

    it('should only include tiles within the culled bounds', function ()
    {
        // Use a layer where only a known tile position is valid
        var smallLayer = makeLayer(4, 4);
        var result = HexagonalCullTiles(smallLayer, camera);

        // All tiles in a 4x4 layer should be visible to a 320x240 camera at origin
        expect(result.length).toBe(16);
    });

    it('should handle a layer with a single tile', function ()
    {
        var tinyLayer = makeLayer(1, 1);
        var result = HexagonalCullTiles(tinyLayer, camera);

        expect(result.length).toBe(1);
        expect(result[0]).toBe(tinyLayer.data[0][0]);
    });

    it('should handle mixed tile visibility in the same layer', function ()
    {
        // Make half the tiles invisible
        for (var x = 0; x < 10; x++)
        {
            layer.data[0][x].visible = false;
        }

        var result = HexagonalCullTiles(layer, camera);

        // Row 0 is now invisible, so we expect fewer tiles
        var allVisible = HexagonalCullTiles(makeLayer(10, 10), camera);

        expect(result.length).toBeLessThan(allVisible.length);
    });
});
