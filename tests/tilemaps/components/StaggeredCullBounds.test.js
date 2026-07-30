var StaggeredCullBounds = require('../../../src/tilemaps/components/StaggeredCullBounds');

describe('Phaser.Tilemaps.Components.StaggeredCullBounds', function ()
{
    function makeLayer (tileWidth, tileHeight, scaleX, scaleY, layerX, layerY, cullPaddingX, cullPaddingY)
    {
        return {
            tilemapLayer: {
                tilemap: {
                    tileWidth: tileWidth,
                    tileHeight: tileHeight
                },
                scaleX: scaleX,
                scaleY: scaleY,
                x: layerX,
                y: layerY,
                cullPaddingX: cullPaddingX,
                cullPaddingY: cullPaddingY
            }
        };
    }

    function makeCamera (x, right, y, bottom)
    {
        return {
            worldView: {
                x: x,
                right: right,
                y: y,
                bottom: bottom
            }
        };
    }

    it('should return an object with left, right, top and bottom properties', function ()
    {
        var layer = makeLayer(32, 32, 1, 1, 0, 0, 1, 1);
        var camera = makeCamera(0, 800, 0, 600);
        var result = StaggeredCullBounds(layer, camera);

        expect(result).toHaveProperty('left');
        expect(result).toHaveProperty('right');
        expect(result).toHaveProperty('top');
        expect(result).toHaveProperty('bottom');
    });

    it('should compute basic bounds with scale 1 and no layer offset', function ()
    {
        var layer = makeLayer(32, 32, 1, 1, 0, 0, 1, 1);
        var camera = makeCamera(0, 800, 0, 600);
        var result = StaggeredCullBounds(layer, camera);

        // tileW = 32, tileH = 32
        // boundsLeft  = floor(0/32) - 1  = -1
        // boundsRight = ceil(800/32) + 1 = 26
        // boundsTop    = floor(0/16) - 1  = -1
        // boundsBottom = ceil(600/16) + 1 = 39
        expect(result.left).toBe(-1);
        expect(result.right).toBe(26);
        expect(result.top).toBe(-1);
        expect(result.bottom).toBe(39);
    });

    it('should apply cullPaddingX and cullPaddingY to bounds', function ()
    {
        var layer = makeLayer(32, 32, 1, 1, 0, 0, 3, 2);
        var camera = makeCamera(0, 800, 0, 600);
        var result = StaggeredCullBounds(layer, camera);

        // boundsLeft  = floor(0/32) - 3  = -3
        // boundsRight = ceil(800/32) + 3 = 28
        // boundsTop    = floor(0/16) - 2  = -2
        // boundsBottom = ceil(600/16) + 2 = 40
        expect(result.left).toBe(-3);
        expect(result.right).toBe(28);
        expect(result.top).toBe(-2);
        expect(result.bottom).toBe(40);
    });

    it('should return zero padding bounds when cullPadding is 0', function ()
    {
        var layer = makeLayer(32, 32, 1, 1, 0, 0, 0, 0);
        var camera = makeCamera(0, 800, 0, 600);
        var result = StaggeredCullBounds(layer, camera);

        // boundsLeft  = floor(0/32)   = 0
        // boundsRight = ceil(800/32)  = 25
        // boundsTop    = floor(0/16)   = 0
        // boundsBottom = ceil(600/16)  = 38 (600/16 = 37.5, ceil = 38)
        expect(result.left).toBe(0);
        expect(result.right).toBe(25);
        expect(result.top).toBe(0);
        expect(result.bottom).toBe(38);
    });

    it('should account for tilemapLayer position offset', function ()
    {
        var layer = makeLayer(32, 32, 1, 1, 64, 64, 1, 1);
        var camera = makeCamera(64, 864, 64, 664);
        var result = StaggeredCullBounds(layer, camera);

        // camera.worldView.x - tilemapLayer.x = 64 - 64 = 0
        // camera.worldView.right - tilemapLayer.x = 864 - 64 = 800
        // camera.worldView.y - tilemapLayer.y = 64 - 64 = 0
        // camera.worldView.bottom - tilemapLayer.y = 664 - 64 = 600
        // Same result as no-offset case with same padding
        expect(result.left).toBe(-1);
        expect(result.right).toBe(26);
        expect(result.top).toBe(-1);
        expect(result.bottom).toBe(39);
    });

    it('should use tilemap tile size scaled by tilemapLayer scale for tile dimensions', function ()
    {
        var layer = makeLayer(32, 32, 2, 2, 0, 0, 0, 0);
        var camera = makeCamera(0, 800, 0, 600);
        var result = StaggeredCullBounds(layer, camera);

        // tileW = floor(32 * 2) = 64
        // tileH = floor(32 * 2) = 64
        // boundsLeft  = floor(0/64)    = 0
        // boundsRight = ceil(800/64)   = ceil(12.5) = 13
        // boundsTop    = floor(0/32)   = 0
        // boundsBottom = ceil(600/32)  = ceil(18.75) = 19
        expect(result.left).toBe(0);
        expect(result.right).toBe(13);
        expect(result.top).toBe(0);
        expect(result.bottom).toBe(19);
    });

    it('should floor tile dimensions when scale produces a fractional result', function ()
    {
        var layer = makeLayer(32, 32, 1.5, 1.5, 0, 0, 0, 0);
        var camera = makeCamera(0, 800, 0, 600);
        var result = StaggeredCullBounds(layer, camera);

        // tileW = floor(32 * 1.5) = floor(48) = 48
        // tileH = floor(32 * 1.5) = floor(48) = 48
        // boundsLeft  = floor(0/48)    = 0
        // boundsRight = ceil(800/48)   = ceil(16.666) = 17
        // boundsTop    = floor(0/24)   = 0
        // boundsBottom = ceil(600/24)  = ceil(25) = 25
        expect(result.left).toBe(0);
        expect(result.right).toBe(17);
        expect(result.top).toBe(0);
        expect(result.bottom).toBe(25);
    });

    it('should handle camera positioned away from origin', function ()
    {
        var layer = makeLayer(32, 32, 1, 1, 0, 0, 1, 1);
        var camera = makeCamera(320, 1120, 240, 840);
        var result = StaggeredCullBounds(layer, camera);

        // tileW = 32, tileH = 32
        // boundsLeft  = floor(320/32) - 1  = 10 - 1 = 9
        // boundsRight = ceil(1120/32) + 1  = 35 + 1 = 36
        // boundsTop    = floor(240/16) - 1  = 15 - 1 = 14
        // boundsBottom = ceil(840/16) + 1   = ceil(52.5) + 1 = 53 + 1 = 54
        expect(result.left).toBe(9);
        expect(result.right).toBe(36);
        expect(result.top).toBe(14);
        expect(result.bottom).toBe(54);
    });

    it('should handle negative camera worldView position', function ()
    {
        var layer = makeLayer(32, 32, 1, 1, 0, 0, 1, 1);
        var camera = makeCamera(-64, 736, -64, 536);
        var result = StaggeredCullBounds(layer, camera);

        // tileW = 32, tileH = 32
        // boundsLeft  = floor(-64/32) - 1  = -2 - 1 = -3
        // boundsRight = ceil(736/32) + 1   = 23 + 1 = 24
        // boundsTop    = floor(-64/16) - 1  = -4 - 1 = -5
        // boundsBottom = ceil(536/16) + 1   = ceil(33.5) + 1 = 34 + 1 = 35
        expect(result.left).toBe(-3);
        expect(result.right).toBe(24);
        expect(result.top).toBe(-5);
        expect(result.bottom).toBe(35);
    });

    it('should use half tileH for vertical snap calculations', function ()
    {
        var layer = makeLayer(64, 64, 1, 1, 0, 0, 0, 0);
        var camera = makeCamera(0, 640, 0, 480);
        var result = StaggeredCullBounds(layer, camera);

        // tileW = 64, tileH = 64
        // boundsLeft  = floor(0/64)   = 0
        // boundsRight = ceil(640/64)  = 10
        // boundsTop    = floor(0/32)  = 0
        // boundsBottom = ceil(480/32) = 15
        expect(result.left).toBe(0);
        expect(result.right).toBe(10);
        expect(result.top).toBe(0);
        expect(result.bottom).toBe(15);
    });

    it('should produce correct bounds when layer is offset and camera is scrolled', function ()
    {
        var layer = makeLayer(16, 16, 1, 1, 50, 50, 2, 2);
        var camera = makeCamera(150, 950, 150, 750);
        var result = StaggeredCullBounds(layer, camera);

        // tileW = 16, tileH = 16
        // worldView.x - layerX = 150 - 50 = 100
        // worldView.right - layerX = 950 - 50 = 900
        // worldView.y - layerY = 150 - 50 = 100
        // worldView.bottom - layerY = 750 - 50 = 700
        // boundsLeft  = floor(100/16) - 2  = 6 - 2 = 4
        // boundsRight = ceil(900/16) + 2   = ceil(56.25) + 2 = 57 + 2 = 59
        // boundsTop    = floor(100/8) - 2   = 12 - 2 = 10
        // boundsBottom = ceil(700/8) + 2    = ceil(87.5) + 2 = 88 + 2 = 90
        expect(result.left).toBe(4);
        expect(result.right).toBe(59);
        expect(result.top).toBe(10);
        expect(result.bottom).toBe(90);
    });
});
