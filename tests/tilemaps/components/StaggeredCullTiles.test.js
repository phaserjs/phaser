var StaggeredCullTiles = require('../../../src/tilemaps/components/StaggeredCullTiles');

describe('Phaser.Tilemaps.Components.StaggeredCullTiles', function ()
{
    var layer;
    var camera;
    var tile1, tile2, tile3, tile4;

    function makeTile (index, visible, alpha)
    {
        return {
            index: index === undefined ? 1 : index,
            visible: visible === undefined ? true : visible,
            alpha: alpha === undefined ? 1 : alpha
        };
    }

    function makeLayer (width, height, data, skipCull, scrollFX, scrollFY)
    {
        var tilemapLayer = {
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
            skipCull: skipCull === undefined ? false : skipCull,
            scrollFactorX: scrollFX === undefined ? 1 : scrollFX,
            scrollFactorY: scrollFY === undefined ? 1 : scrollFY,
            tilesDrawn: 0,
            tilesTotal: 0
        };

        return {
            data: data,
            width: width,
            height: height,
            tilemapLayer: tilemapLayer
        };
    }

    function makeCamera (x, y, width, height)
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
        tile1 = makeTile(1, true, 1);
        tile2 = makeTile(2, true, 1);
        tile3 = makeTile(3, true, 1);
        tile4 = makeTile(4, true, 1);

        var data = [
            [ tile1, tile2 ],
            [ tile3, tile4 ]
        ];

        layer = makeLayer(2, 2, data);
        camera = makeCamera(0, 0, 64, 64);
    });

    it('should return an array', function ()
    {
        var result = StaggeredCullTiles(layer, camera);

        expect(Array.isArray(result)).toBe(true);
    });

    it('should return the outputArray passed in', function ()
    {
        var output = [];
        var result = StaggeredCullTiles(layer, camera, output);

        expect(result).toBe(output);
    });

    it('should default outputArray to an empty array if not provided', function ()
    {
        var result = StaggeredCullTiles(layer, camera);

        expect(Array.isArray(result)).toBe(true);
    });

    it('should clear the outputArray before populating it', function ()
    {
        var output = [ { index: 99 } ];
        var result = StaggeredCullTiles(layer, camera, output);

        expect(result.every(function (t) { return t.index !== 99; })).toBe(true);
    });

    it('should include visible tiles with valid index in the camera view', function ()
    {
        var result = StaggeredCullTiles(layer, camera);

        expect(result.length).toBe(4);
        expect(result).toContain(tile1);
        expect(result).toContain(tile2);
        expect(result).toContain(tile3);
        expect(result).toContain(tile4);
    });

    it('should exclude tiles with index -1', function ()
    {
        tile1.index = -1;

        var result = StaggeredCullTiles(layer, camera);

        expect(result).not.toContain(tile1);
        expect(result.length).toBe(3);
    });

    it('should exclude tiles with visible set to false', function ()
    {
        tile2.visible = false;

        var result = StaggeredCullTiles(layer, camera);

        expect(result).not.toContain(tile2);
        expect(result.length).toBe(3);
    });

    it('should exclude tiles with alpha of 0', function ()
    {
        tile3.alpha = 0;

        var result = StaggeredCullTiles(layer, camera);

        expect(result).not.toContain(tile3);
        expect(result.length).toBe(3);
    });

    it('should exclude null tiles', function ()
    {
        layer.data[0][0] = null;

        var result = StaggeredCullTiles(layer, camera);

        expect(result.length).toBe(3);
    });

    it('should default renderOrder to 0 (right-down) when not provided', function ()
    {
        var result = StaggeredCullTiles(layer, camera);

        // right-down: row 0 left-to-right, then row 1 left-to-right
        expect(result[0]).toBe(tile1);
        expect(result[1]).toBe(tile2);
        expect(result[2]).toBe(tile3);
        expect(result[3]).toBe(tile4);
    });

    it('should traverse right-down when renderOrder is 0', function ()
    {
        var result = StaggeredCullTiles(layer, camera, [], 0);

        expect(result[0]).toBe(tile1);
        expect(result[1]).toBe(tile2);
        expect(result[2]).toBe(tile3);
        expect(result[3]).toBe(tile4);
    });

    it('should traverse left-down when renderOrder is 1', function ()
    {
        var result = StaggeredCullTiles(layer, camera, [], 1);

        // left-down: row 0 right-to-left, then row 1 right-to-left
        expect(result[0]).toBe(tile2);
        expect(result[1]).toBe(tile1);
        expect(result[2]).toBe(tile4);
        expect(result[3]).toBe(tile3);
    });

    it('should traverse right-up when renderOrder is 2', function ()
    {
        var result = StaggeredCullTiles(layer, camera, [], 2);

        // right-up: bottom row left-to-right, then top row left-to-right
        expect(result[0]).toBe(tile3);
        expect(result[1]).toBe(tile4);
        expect(result[2]).toBe(tile1);
        expect(result[3]).toBe(tile2);
    });

    it('should traverse left-up when renderOrder is 3', function ()
    {
        var result = StaggeredCullTiles(layer, camera, [], 3);

        // left-up: bottom row right-to-left, then top row right-to-left
        expect(result[0]).toBe(tile4);
        expect(result[1]).toBe(tile3);
        expect(result[2]).toBe(tile2);
        expect(result[3]).toBe(tile1);
    });

    it('should set tilesDrawn on the tilemapLayer', function ()
    {
        StaggeredCullTiles(layer, camera);

        expect(layer.tilemapLayer.tilesDrawn).toBe(4);
    });

    it('should set tilesTotal on the tilemapLayer', function ()
    {
        StaggeredCullTiles(layer, camera);

        expect(layer.tilemapLayer.tilesTotal).toBe(4);
    });

    it('should override bounds to full layer when skipCull is true and scroll factors are 1', function ()
    {
        // Place the camera far away so without skipCull it would cull everything
        var farCamera = makeCamera(10000, 10000, 64, 64);

        layer.tilemapLayer.skipCull = true;
        layer.tilemapLayer.scrollFactorX = 1;
        layer.tilemapLayer.scrollFactorY = 1;

        var result = StaggeredCullTiles(layer, farCamera);

        // skipCull forces bounds to cover entire layer, so all tiles should be included
        expect(result.length).toBe(4);
    });

    it('should NOT override bounds when skipCull is true but scrollFactorX is not 1', function ()
    {
        var farCamera = makeCamera(10000, 10000, 64, 64);

        layer.tilemapLayer.skipCull = true;
        layer.tilemapLayer.scrollFactorX = 0.5;
        layer.tilemapLayer.scrollFactorY = 1;

        var result = StaggeredCullTiles(layer, farCamera);

        // Without override, the far camera culls all tiles
        expect(result.length).toBe(0);
    });

    it('should NOT override bounds when skipCull is true but scrollFactorY is not 1', function ()
    {
        var farCamera = makeCamera(10000, 10000, 64, 64);

        layer.tilemapLayer.skipCull = true;
        layer.tilemapLayer.scrollFactorX = 1;
        layer.tilemapLayer.scrollFactorY = 2;

        var result = StaggeredCullTiles(layer, farCamera);

        expect(result.length).toBe(0);
    });

    it('should NOT override bounds when skipCull is false even if scroll factors are 1', function ()
    {
        var farCamera = makeCamera(10000, 10000, 64, 64);

        layer.tilemapLayer.skipCull = false;
        layer.tilemapLayer.scrollFactorX = 1;
        layer.tilemapLayer.scrollFactorY = 1;

        var result = StaggeredCullTiles(layer, farCamera);

        expect(result.length).toBe(0);
    });

    it('should return an empty array when the layer has no tiles in the camera view', function ()
    {
        var farCamera = makeCamera(10000, 10000, 64, 64);
        var result = StaggeredCullTiles(layer, farCamera);

        expect(result.length).toBe(0);
    });

    it('should handle an empty layer data array', function ()
    {
        layer.data = [];
        layer.width = 0;
        layer.height = 0;

        var result = StaggeredCullTiles(layer, camera);

        expect(result.length).toBe(0);
    });

    it('should update tilesTotal to reflect width * height', function ()
    {
        var bigData = [];
        for (var r = 0; r < 4; r++)
        {
            bigData[r] = [];
            for (var c = 0; c < 4; c++)
            {
                bigData[r][c] = makeTile(1, true, 1);
            }
        }

        var bigLayer = makeLayer(4, 4, bigData);
        var bigCamera = makeCamera(0, 0, 256, 256);

        StaggeredCullTiles(bigLayer, bigCamera);

        expect(bigLayer.tilemapLayer.tilesTotal).toBe(16);
    });

    it('should reuse the same outputArray across multiple calls, resetting it each time', function ()
    {
        var output = [];

        StaggeredCullTiles(layer, camera, output);
        expect(output.length).toBe(4);

        // Remove all tiles from view and call again
        var farCamera = makeCamera(10000, 10000, 64, 64);
        StaggeredCullTiles(layer, farCamera, output);
        expect(output.length).toBe(0);
    });
});
