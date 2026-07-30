var CullTiles = require('../../../src/tilemaps/components/CullTiles');

function makeTile(index, visible, alpha)
{
    return {
        index: index === undefined ? 1 : index,
        visible: visible === undefined ? true : visible,
        alpha: alpha === undefined ? 1 : alpha
    };
}

function makeLayer(overrides)
{
    var tileWidth = 32;
    var tileHeight = 32;
    var mapWidth = 4;
    var mapHeight = 3;

    var data = [];

    for (var y = 0; y < mapHeight; y++)
    {
        data[y] = [];

        for (var x = 0; x < mapWidth; x++)
        {
            data[y][x] = makeTile(1, true, 1);
        }
    }

    var base = {
        width: mapWidth,
        height: mapHeight,
        data: data,
        tilemapLayer: {
            skipCull: false,
            scrollFactorX: 1,
            scrollFactorY: 1,
            scaleX: 1,
            scaleY: 1,
            x: 0,
            y: 0,
            cullPaddingX: 1,
            cullPaddingY: 1,
            tilesDrawn: 0,
            tilesTotal: 0,
            tilemap: {
                tileWidth: tileWidth,
                tileHeight: tileHeight
            }
        }
    };

    if (overrides)
    {
        for (var key in overrides)
        {
            if (key === 'tilemapLayer')
            {
                for (var tkey in overrides.tilemapLayer)
                {
                    base.tilemapLayer[tkey] = overrides.tilemapLayer[tkey];
                }
            }
            else
            {
                base[key] = overrides[key];
            }
        }
    }

    return base;
}

function makeCamera(x, y, width, height)
{
    if (x === undefined) { x = 0; }
    if (y === undefined) { y = 0; }
    if (width === undefined) { width = 128; }
    if (height === undefined) { height = 96; }

    return {
        worldView: {
            x: x,
            y: y,
            right: x + width,
            bottom: y + height
        }
    };
}

describe('Phaser.Tilemaps.Components.CullTiles', function ()
{
    it('should return an array', function ()
    {
        var layer = makeLayer();
        var camera = makeCamera();
        var result = CullTiles(layer, camera);

        expect(Array.isArray(result)).toBe(true);
    });

    it('should return the outputArray passed in', function ()
    {
        var layer = makeLayer();
        var camera = makeCamera();
        var output = [];
        var result = CullTiles(layer, camera, output);

        expect(result).toBe(output);
    });

    it('should default outputArray to a new empty array when not provided', function ()
    {
        var layer = makeLayer();
        var camera = makeCamera();
        var result = CullTiles(layer, camera, undefined);

        expect(Array.isArray(result)).toBe(true);
    });

    it('should clear the outputArray before populating it', function ()
    {
        var layer = makeLayer();
        var camera = makeCamera();
        var output = [ {}, {}, {} ];

        CullTiles(layer, camera, output);

        // If it was not cleared, the old items would remain alongside new ones
        // After the call the array length reflects only newly culled tiles
        output.forEach(function (item)
        {
            expect(item).not.toBeUndefined();
        });

        // Verify no leftover stale entries: re-running should produce the same length
        var firstLen = output.length;
        CullTiles(layer, camera, output);

        expect(output.length).toBe(firstLen);
    });

    it('should populate the output array with visible tiles in viewport', function ()
    {
        var layer = makeLayer();

        // Camera covers the full 4x3 map (4*32=128, 3*32=96)
        var camera = makeCamera(0, 0, 128, 96);
        var result = CullTiles(layer, camera);

        // All 12 tiles are visible with index=1
        expect(result.length).toBe(12);
    });

    it('should not include tiles with index -1', function ()
    {
        var layer = makeLayer();
        layer.data[0][0].index = -1;
        layer.data[1][1].index = -1;

        var camera = makeCamera(0, 0, 128, 96);
        var result = CullTiles(layer, camera);

        expect(result.length).toBe(10);
    });

    it('should not include tiles with visible set to false', function ()
    {
        var layer = makeLayer();
        layer.data[0][2].visible = false;

        var camera = makeCamera(0, 0, 128, 96);
        var result = CullTiles(layer, camera);

        expect(result.length).toBe(11);
    });

    it('should not include tiles with alpha set to 0', function ()
    {
        var layer = makeLayer();
        layer.data[2][3].alpha = 0;

        var camera = makeCamera(0, 0, 128, 96);
        var result = CullTiles(layer, camera);

        expect(result.length).toBe(11);
    });

    it('should not include null tile entries', function ()
    {
        var layer = makeLayer();
        layer.data[1][2] = null;

        var camera = makeCamera(0, 0, 128, 96);
        var result = CullTiles(layer, camera);

        expect(result.length).toBe(11);
    });

    it('should include all layer tiles when skipCull is true', function ()
    {
        var layer = makeLayer({ tilemapLayer: { skipCull: true } });

        // Camera only sees a small area, but skipCull forces all tiles in
        var camera = makeCamera(500, 500, 32, 32);
        var result = CullTiles(layer, camera);

        expect(result.length).toBe(12);
    });

    it('should include all layer tiles when scrollFactorX differs from 1', function ()
    {
        var layer = makeLayer({ tilemapLayer: { scrollFactorX: 0.5 } });

        // Camera positioned far away, but scroll factor override forces all tiles in
        var camera = makeCamera(5000, 5000, 32, 32);
        var result = CullTiles(layer, camera);

        expect(result.length).toBe(12);
    });

    it('should include all layer tiles when scrollFactorY differs from 1', function ()
    {
        var layer = makeLayer({ tilemapLayer: { scrollFactorY: 2 } });

        var camera = makeCamera(5000, 5000, 32, 32);
        var result = CullTiles(layer, camera);

        expect(result.length).toBe(12);
    });

    it('should include all layer tiles when scrollFactorX is 0', function ()
    {
        var layer = makeLayer({ tilemapLayer: { scrollFactorX: 0 } });

        var camera = makeCamera(5000, 5000, 32, 32);
        var result = CullTiles(layer, camera);

        expect(result.length).toBe(12);
    });

    it('should cull tiles outside the camera viewport when skipCull is false', function ()
    {
        var layer = makeLayer();

        // Camera positioned far outside the map bounds
        var camera = makeCamera(10000, 10000, 128, 96);
        var result = CullTiles(layer, camera);

        // cullPaddingX/Y is 1, so tiles at the edge might be included,
        // but with camera this far away none should appear
        expect(result.length).toBe(0);
    });

    it('should default renderOrder to 0 (right-down) when not provided', function ()
    {
        var layer = makeLayer();
        var camera = makeCamera(0, 0, 128, 96);
        var result = CullTiles(layer, camera, []);

        // With right-down order, tiles should be in row-major order (y then x)
        expect(result.length).toBe(12);

        // First tile should be row 0, col 0
        expect(result[0]).toBe(layer.data[0][0]);
        expect(result[1]).toBe(layer.data[0][1]);
    });

    it('should support renderOrder 0 (right-down)', function ()
    {
        var layer = makeLayer();
        var camera = makeCamera(0, 0, 128, 96);
        var result = CullTiles(layer, camera, [], 0);

        expect(result[0]).toBe(layer.data[0][0]);
        expect(result[3]).toBe(layer.data[0][3]);
        expect(result[4]).toBe(layer.data[1][0]);
    });

    it('should support renderOrder 1 (left-down)', function ()
    {
        var layer = makeLayer();
        var camera = makeCamera(0, 0, 128, 96);
        var result = CullTiles(layer, camera, [], 1);

        expect(result.length).toBe(12);
    });

    it('should support renderOrder 2 (right-up)', function ()
    {
        var layer = makeLayer();
        var camera = makeCamera(0, 0, 128, 96);
        var result = CullTiles(layer, camera, [], 2);

        expect(result.length).toBe(12);
    });

    it('should support renderOrder 3 (left-up)', function ()
    {
        var layer = makeLayer();
        var camera = makeCamera(0, 0, 128, 96);
        var result = CullTiles(layer, camera, [], 3);

        expect(result.length).toBe(12);
    });

    it('should update tilemapLayer.tilesDrawn after culling', function ()
    {
        var layer = makeLayer();
        var camera = makeCamera(0, 0, 128, 96);

        CullTiles(layer, camera);

        expect(layer.tilemapLayer.tilesDrawn).toBe(12);
    });

    it('should update tilemapLayer.tilesTotal after culling', function ()
    {
        var layer = makeLayer();
        var camera = makeCamera(0, 0, 128, 96);

        CullTiles(layer, camera);

        expect(layer.tilemapLayer.tilesTotal).toBe(layer.width * layer.height);
    });

    it('should produce consistent results across multiple calls with the same inputs', function ()
    {
        var layer = makeLayer();
        var camera = makeCamera(0, 0, 128, 96);

        var result1 = CullTiles(layer, camera, []);
        var len1 = result1.length;

        var result2 = CullTiles(layer, camera, []);

        expect(result2.length).toBe(len1);
    });
});
