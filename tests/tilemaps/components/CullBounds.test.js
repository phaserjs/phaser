var CullBounds = require('../../../src/tilemaps/components/CullBounds');

describe('Phaser.Tilemaps.Components.CullBounds', function ()
{
    function makeLayer (options)
    {
        var opts = options || {};

        return {
            tilemapLayer: {
                tilemap: {
                    tileWidth: opts.tileWidth !== undefined ? opts.tileWidth : 32,
                    tileHeight: opts.tileHeight !== undefined ? opts.tileHeight : 32
                },
                scaleX: opts.scaleX !== undefined ? opts.scaleX : 1,
                scaleY: opts.scaleY !== undefined ? opts.scaleY : 1,
                x: opts.x !== undefined ? opts.x : 0,
                y: opts.y !== undefined ? opts.y : 0,
                cullPaddingX: opts.cullPaddingX !== undefined ? opts.cullPaddingX : 1,
                cullPaddingY: opts.cullPaddingY !== undefined ? opts.cullPaddingY : 1
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

    it('should return a Rectangle-like object with x, y, width, height properties', function ()
    {
        var layer = makeLayer();
        var camera = makeCamera(0, 800, 0, 600);
        var result = CullBounds(layer, camera);

        expect(result).toBeDefined();
        expect(typeof result.x).toBe('number');
        expect(typeof result.y).toBe('number');
        expect(typeof result.width).toBe('number');
        expect(typeof result.height).toBe('number');
    });

    it('should calculate correct bounds with no layer offset and default cull padding', function ()
    {
        //  tileW = floor(32 * 1) = 32, tileH = floor(32 * 1) = 32
        //  boundsLeft  = floor((0   - 0) / 32) - 1 = 0  - 1 = -1
        //  boundsRight = ceil((800  - 0) / 32) + 1 = 25 + 1 = 26
        //  boundsTop   = floor((0   - 0) / 32) - 1 = 0  - 1 = -1
        //  boundsBottom= ceil((600  - 0) / 32) + 1 = 19 + 1 = 20
        var layer = makeLayer();
        var camera = makeCamera(0, 800, 0, 600);
        var result = CullBounds(layer, camera);

        expect(result.x).toBe(-1);
        expect(result.y).toBe(-1);
        expect(result.width).toBe(27);
        expect(result.height).toBe(21);
    });

    it('should apply layer position offset to the bounds calculation', function ()
    {
        //  tileW = 32, tileH = 32, layer.x = 100, layer.y = 50
        //  boundsLeft  = floor((0   - 100) / 32) - 1 = floor(-3.125) - 1 = -4 - 1 = -5
        //  boundsRight = ceil((800  - 100) / 32) + 1 = ceil(21.875)  + 1 = 22 + 1 = 23
        //  boundsTop   = floor((0   - 50)  / 32) - 1 = floor(-1.5625)- 1 = -2 - 1 = -3
        //  boundsBottom= ceil((600  - 50)  / 32) + 1 = ceil(17.1875) + 1 = 18 + 1 = 19
        var layer = makeLayer({ x: 100, y: 50 });
        var camera = makeCamera(0, 800, 0, 600);
        var result = CullBounds(layer, camera);

        expect(result.x).toBe(-5);
        expect(result.y).toBe(-3);
        expect(result.width).toBe(28);
        expect(result.height).toBe(22);
    });

    it('should use tilemap tileWidth and tileHeight scaled by layer scale', function ()
    {
        //  tileW = floor(32 * 2) = 64, tileH = floor(32 * 2) = 64
        //  boundsLeft  = floor(0   / 64) - 1 = 0  - 1 = -1
        //  boundsRight = ceil(800  / 64) + 1 = ceil(12.5) + 1 = 13 + 1 = 14
        //  boundsTop   = floor(0   / 64) - 1 = 0  - 1 = -1
        //  boundsBottom= ceil(600  / 64) + 1 = ceil(9.375) + 1 = 10 + 1 = 11
        var layer = makeLayer({ scaleX: 2, scaleY: 2 });
        var camera = makeCamera(0, 800, 0, 600);
        var result = CullBounds(layer, camera);

        expect(result.x).toBe(-1);
        expect(result.y).toBe(-1);
        expect(result.width).toBe(15);
        expect(result.height).toBe(12);
    });

    it('should floor the scaled tile dimensions (integer result)', function ()
    {
        //  tileW = floor(32 * 1.5) = floor(48) = 48
        //  tileH = floor(32 * 0.5) = floor(16) = 16
        //  boundsLeft  = floor(0   / 48) - 0 = 0
        //  boundsRight = ceil(800  / 48) + 0 = ceil(16.666) = 17
        //  boundsTop   = floor(0   / 16) - 0 = 0
        //  boundsBottom= ceil(600  / 16) + 0 = ceil(37.5) = 38
        var layer = makeLayer({ scaleX: 1.5, scaleY: 0.5, cullPaddingX: 0, cullPaddingY: 0 });
        var camera = makeCamera(0, 800, 0, 600);
        var result = CullBounds(layer, camera);

        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
        expect(result.width).toBe(17);
        expect(result.height).toBe(38);
    });

    it('should respect cullPaddingX and cullPaddingY values', function ()
    {
        //  tileW = 32, tileH = 32, cullPaddingX = 3, cullPaddingY = 3
        //  boundsLeft  = floor(0   / 32) - 3 = -3
        //  boundsRight = ceil(800  / 32) + 3 = 25 + 3 = 28
        //  boundsTop   = floor(0   / 32) - 3 = -3
        //  boundsBottom= ceil(600  / 32) + 3 = 19 + 3 = 22
        var layer = makeLayer({ cullPaddingX: 3, cullPaddingY: 3 });
        var camera = makeCamera(0, 800, 0, 600);
        var result = CullBounds(layer, camera);

        expect(result.x).toBe(-3);
        expect(result.y).toBe(-3);
        expect(result.width).toBe(31);
        expect(result.height).toBe(25);
    });

    it('should produce zero cull padding when cullPaddingX and cullPaddingY are 0', function ()
    {
        //  boundsLeft  = floor(0   / 32) - 0 = 0
        //  boundsRight = ceil(800  / 32) + 0 = 25
        //  boundsTop   = floor(0   / 32) - 0 = 0
        //  boundsBottom= ceil(600  / 32) + 0 = 19
        var layer = makeLayer({ cullPaddingX: 0, cullPaddingY: 0 });
        var camera = makeCamera(0, 800, 0, 600);
        var result = CullBounds(layer, camera);

        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
        expect(result.width).toBe(25);
        expect(result.height).toBe(19);
    });

    it('should account for a camera positioned away from the origin', function ()
    {
        //  tileW = 32, tileH = 32, layer.x = 0, layer.y = 0, cullPadX = 1, cullPadY = 1
        //  boundsLeft  = floor(320  / 32) - 1 = 10 - 1 = 9
        //  boundsRight = ceil(1120  / 32) + 1 = 35 + 1 = 36
        //  boundsTop   = floor(240  / 32) - 1 = floor(7.5) - 1 = 7 - 1 = 6
        //  boundsBottom= ceil(840   / 32) + 1 = ceil(26.25) + 1 = 27 + 1 = 28
        var layer = makeLayer();
        var camera = makeCamera(320, 1120, 240, 840);
        var result = CullBounds(layer, camera);

        expect(result.x).toBe(9);
        expect(result.y).toBe(6);
        expect(result.width).toBe(27);
        expect(result.height).toBe(22);
    });

    it('should handle a camera with negative worldView position', function ()
    {
        //  tileW = 32, tileH = 32, layer.x = 0, layer.y = 0, cullPadX = 1, cullPadY = 1
        //  boundsLeft  = floor((-64  - 0) / 32) - 1 = floor(-2) - 1 = -2 - 1 = -3
        //  boundsRight = ceil((736  - 0)  / 32) + 1 = ceil(23) + 1 = 23 + 1 = 24
        //  boundsTop   = floor((-32  - 0) / 32) - 1 = floor(-1) - 1 = -1 - 1 = -2
        //  boundsBottom= ceil((568  - 0)  / 32) + 1 = ceil(17.75) + 1 = 18 + 1 = 19
        var layer = makeLayer();
        var camera = makeCamera(-64, 736, -32, 568);
        var result = CullBounds(layer, camera);

        expect(result.x).toBe(-3);
        expect(result.y).toBe(-2);
        expect(result.width).toBe(27);
        expect(result.height).toBe(21);
    });

    it('should return the same recycled bounds object on successive calls', function ()
    {
        var layer = makeLayer();
        var camera = makeCamera(0, 800, 0, 600);

        var result1 = CullBounds(layer, camera);
        var result2 = CullBounds(layer, camera);

        expect(result1).toBe(result2);
    });

    it('should update the recycled bounds object when called with different arguments', function ()
    {
        var layer = makeLayer();
        var camera1 = makeCamera(0, 800, 0, 600);
        var camera2 = makeCamera(320, 1120, 240, 840);

        var result = CullBounds(layer, camera1);
        expect(result.x).toBe(-1);
        expect(result.y).toBe(-1);

        CullBounds(layer, camera2);
        //  result still points to same object, which is now updated
        expect(result.x).toBe(9);
        expect(result.y).toBe(6);
    });

    it('should produce positive width and height for all normal inputs', function ()
    {
        var layer = makeLayer();
        var camera = makeCamera(0, 800, 0, 600);
        var result = CullBounds(layer, camera);

        expect(result.width).toBeGreaterThan(0);
        expect(result.height).toBeGreaterThan(0);
    });

    it('should handle different tileWidth and tileHeight values independently', function ()
    {
        //  tileWidth=64, tileHeight=16, scale=1, cullPad=0
        //  boundsLeft  = floor(0   / 64) = 0
        //  boundsRight = ceil(800  / 64) = ceil(12.5) = 13
        //  boundsTop   = floor(0   / 16) = 0
        //  boundsBottom= ceil(600  / 16) = ceil(37.5) = 38
        var layer = makeLayer({ tileWidth: 64, tileHeight: 16, cullPaddingX: 0, cullPaddingY: 0 });
        var camera = makeCamera(0, 800, 0, 600);
        var result = CullBounds(layer, camera);

        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
        expect(result.width).toBe(13);
        expect(result.height).toBe(38);
    });

    it('should handle tile-aligned camera edges without double-counting', function ()
    {
        //  tileW = 32, tile-aligned viewport: right = 32*25 = 800, bottom = 32*19 = 608
        //  boundsLeft  = floor(0   / 32) - 1 = -1
        //  boundsRight = ceil(800  / 32) + 1 = 25 + 1 = 26
        //  boundsTop   = floor(0   / 32) - 1 = -1
        //  boundsBottom= ceil(608  / 32) + 1 = 19 + 1 = 20
        var layer = makeLayer();
        var camera = makeCamera(0, 800, 0, 608);
        var result = CullBounds(layer, camera);

        expect(result.x).toBe(-1);
        expect(result.y).toBe(-1);
        expect(result.width).toBe(27);
        expect(result.height).toBe(21);
    });
});
