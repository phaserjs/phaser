var HexagonalCullBounds = require('../../../src/tilemaps/components/HexagonalCullBounds');

describe('Phaser.Tilemaps.Components.HexagonalCullBounds', function ()
{
    function makeLayer (options)
    {
        options = options || {};

        var staggerAxis = options.staggerAxis !== undefined ? options.staggerAxis : 'y';
        var hexSideLength = options.hexSideLength !== undefined ? options.hexSideLength : 16;
        var tileWidth = options.tileWidth !== undefined ? options.tileWidth : 32;
        var tileHeight = options.tileHeight !== undefined ? options.tileHeight : 32;
        var scaleX = options.scaleX !== undefined ? options.scaleX : 1;
        var scaleY = options.scaleY !== undefined ? options.scaleY : 1;
        var layerX = options.layerX !== undefined ? options.layerX : 0;
        var layerY = options.layerY !== undefined ? options.layerY : 0;
        var cullPaddingX = options.cullPaddingX !== undefined ? options.cullPaddingX : 1;
        var cullPaddingY = options.cullPaddingY !== undefined ? options.cullPaddingY : 1;

        return {
            staggerAxis: staggerAxis,
            hexSideLength: hexSideLength,
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

    function makeCamera (x, y, right, bottom)
    {
        return {
            worldView: {
                x: x,
                y: y,
                right: right,
                bottom: bottom
            }
        };
    }

    it('should return an object with left, right, top and bottom properties', function ()
    {
        var layer = makeLayer();
        var camera = makeCamera(0, 0, 320, 240);
        var result = HexagonalCullBounds(layer, camera);

        expect(result).toHaveProperty('left');
        expect(result).toHaveProperty('right');
        expect(result).toHaveProperty('top');
        expect(result).toHaveProperty('bottom');
    });

    it('should calculate correct bounds for staggerAxis y with camera at origin', function ()
    {
        // tileW=32, tileH=32, len=16, rowH=((32-16)/2+16)=24
        // boundsLeft = floor(0/32) - 1 = -1
        // boundsRight = ceil(320/32) + 1 = 10 + 1 = 11
        // boundsTop = floor(0/24) - 1 = -1
        // boundsBottom = ceil(240/24) + 1 = 10 + 1 = 11
        var layer = makeLayer({ staggerAxis: 'y' });
        var camera = makeCamera(0, 0, 320, 240);
        var result = HexagonalCullBounds(layer, camera);

        expect(result.left).toBe(-1);
        expect(result.right).toBe(11);
        expect(result.top).toBe(-1);
        expect(result.bottom).toBe(11);
    });

    it('should calculate correct bounds for staggerAxis x with camera at origin', function ()
    {
        // tileW=32, tileH=32, len=16, rowW=((32-16)/2+16)=24
        // boundsLeft = floor(0/24) - 1 = -1
        // boundsRight = ceil(240/24) + 1 = 10 + 1 = 11
        // boundsTop = floor(0/32) - 1 = -1
        // boundsBottom = ceil(320/32) + 1 = 10 + 1 = 11
        var layer = makeLayer({ staggerAxis: 'x' });
        var camera = makeCamera(0, 0, 240, 320);
        var result = HexagonalCullBounds(layer, camera);

        expect(result.left).toBe(-1);
        expect(result.right).toBe(11);
        expect(result.top).toBe(-1);
        expect(result.bottom).toBe(11);
    });

    it('should shift bounds when camera is scrolled (staggerAxis y)', function ()
    {
        // camera offset by 2 tiles in x and y (64px, 48px)
        // boundsLeft = floor(64/32) - 1 = 2 - 1 = 1
        // boundsRight = ceil(384/32) + 1 = 12 + 1 = 13
        // boundsTop = floor(48/24) - 1 = 2 - 1 = 1
        // boundsBottom = ceil(288/24) + 1 = 12 + 1 = 13
        var layer = makeLayer({ staggerAxis: 'y' });
        var camera = makeCamera(64, 48, 384, 288);
        var result = HexagonalCullBounds(layer, camera);

        expect(result.left).toBe(1);
        expect(result.right).toBe(13);
        expect(result.top).toBe(1);
        expect(result.bottom).toBe(13);
    });

    it('should account for layer x/y offset (staggerAxis y)', function ()
    {
        // layer at (64, 32), camera worldView x=64, y=32, right=384, bottom=272
        // boundsLeft = floor((64-64)/32) - 1 = 0 - 1 = -1
        // boundsRight = ceil((384-64)/32) + 1 = 10 + 1 = 11
        // boundsTop = floor((32-32)/24) - 1 = 0 - 1 = -1
        // boundsBottom = ceil((272-32)/24) + 1 = 10 + 1 = 11
        var layer = makeLayer({ staggerAxis: 'y', layerX: 64, layerY: 32 });
        var camera = makeCamera(64, 32, 384, 272);
        var result = HexagonalCullBounds(layer, camera);

        expect(result.left).toBe(-1);
        expect(result.right).toBe(11);
        expect(result.top).toBe(-1);
        expect(result.bottom).toBe(11);
    });

    it('should apply cullPaddingX and cullPaddingY to expand bounds (staggerAxis y)', function ()
    {
        // cullPaddingX=2, cullPaddingY=3
        // boundsLeft = floor(0/32) - 2 = -2
        // boundsRight = ceil(320/32) + 2 = 10 + 2 = 12
        // boundsTop = floor(0/24) - 3 = -3
        // boundsBottom = ceil(240/24) + 3 = 10 + 3 = 13
        var layer = makeLayer({ staggerAxis: 'y', cullPaddingX: 2, cullPaddingY: 3 });
        var camera = makeCamera(0, 0, 320, 240);
        var result = HexagonalCullBounds(layer, camera);

        expect(result.left).toBe(-2);
        expect(result.right).toBe(12);
        expect(result.top).toBe(-3);
        expect(result.bottom).toBe(13);
    });

    it('should apply zero cull padding without expanding bounds', function ()
    {
        // cullPaddingX=0, cullPaddingY=0
        // boundsLeft = floor(0/32) = 0
        // boundsRight = ceil(320/32) = 10
        // boundsTop = floor(0/24) = 0
        // boundsBottom = ceil(240/24) = 10
        var layer = makeLayer({ staggerAxis: 'y', cullPaddingX: 0, cullPaddingY: 0 });
        var camera = makeCamera(0, 0, 320, 240);
        var result = HexagonalCullBounds(layer, camera);

        expect(result.left).toBe(0);
        expect(result.right).toBe(10);
        expect(result.top).toBe(0);
        expect(result.bottom).toBe(10);
    });

    it('should scale tile dimensions using tilemapLayer scale (staggerAxis y)', function ()
    {
        // scaleX=2, scaleY=2: tileW=64, tileH=64
        // rowH = ((64-16)/2+16) = 24+16 = 40
        // cullPaddingX=0, cullPaddingY=0
        // boundsLeft = floor(0/64) = 0
        // boundsRight = ceil(320/64) = 5
        // boundsTop = floor(0/40) = 0
        // boundsBottom = ceil(240/40) = 6
        var layer = makeLayer({ staggerAxis: 'y', scaleX: 2, scaleY: 2, cullPaddingX: 0, cullPaddingY: 0 });
        var camera = makeCamera(0, 0, 320, 240);
        var result = HexagonalCullBounds(layer, camera);

        expect(result.left).toBe(0);
        expect(result.right).toBe(5);
        expect(result.top).toBe(0);
        expect(result.bottom).toBe(6);
    });

    it('should use hexSideLength to compute rowH for staggerAxis y', function ()
    {
        // len=8: rowH=((32-8)/2+8)=12+8=20
        // cullPaddingX=0, cullPaddingY=0
        // boundsTop = floor(0/20) = 0
        // boundsBottom = ceil(200/20) = 10
        var layer = makeLayer({ staggerAxis: 'y', hexSideLength: 8, cullPaddingX: 0, cullPaddingY: 0 });
        var camera = makeCamera(0, 0, 320, 200);
        var result = HexagonalCullBounds(layer, camera);

        expect(result.top).toBe(0);
        expect(result.bottom).toBe(10);
    });

    it('should use hexSideLength to compute rowW for staggerAxis x', function ()
    {
        // len=8: rowW=((32-8)/2+8)=12+8=20
        // cullPaddingX=0, cullPaddingY=0
        // boundsLeft = floor(0/20) = 0
        // boundsRight = ceil(200/20) = 10
        var layer = makeLayer({ staggerAxis: 'x', hexSideLength: 8, cullPaddingX: 0, cullPaddingY: 0 });
        var camera = makeCamera(0, 0, 200, 320);
        var result = HexagonalCullBounds(layer, camera);

        expect(result.left).toBe(0);
        expect(result.right).toBe(10);
    });

    it('should handle non-aligned camera position correctly (staggerAxis y)', function ()
    {
        // camera at x=10, right=330: boundsLeft = floor(10/32)=0, boundsRight = ceil(330/32)=11
        // camera at y=10, bottom=250: boundsTop = floor(10/24)=0, boundsBottom = ceil(250/24)=11
        // cullPaddingX=0, cullPaddingY=0
        var layer = makeLayer({ staggerAxis: 'y', cullPaddingX: 0, cullPaddingY: 0 });
        var camera = makeCamera(10, 10, 330, 250);
        var result = HexagonalCullBounds(layer, camera);

        expect(result.left).toBe(0);
        expect(result.right).toBe(11);
        expect(result.top).toBe(0);
        expect(result.bottom).toBe(11);
    });

    it('should handle negative camera positions (staggerAxis y)', function ()
    {
        // camera at x=-64, right=256: boundsLeft = floor(-64/32)-1 = -2-1 = -3
        //                             boundsRight = ceil(256/32)+1 = 8+1 = 9
        // camera at y=-48, bottom=192: boundsTop = floor(-48/24)-1 = -2-1 = -3
        //                              boundsBottom = ceil(192/24)+1 = 8+1 = 9
        var layer = makeLayer({ staggerAxis: 'y' });
        var camera = makeCamera(-64, -48, 256, 192);
        var result = HexagonalCullBounds(layer, camera);

        expect(result.left).toBe(-3);
        expect(result.right).toBe(9);
        expect(result.top).toBe(-3);
        expect(result.bottom).toBe(9);
    });

    it('should floor tile dimensions using Math.floor on scaled tile sizes', function ()
    {
        // tileWidth=33, scaleX=1 -> tileW = Math.floor(33*1) = 33
        // staggerAxis y, len=16, rowH=((33-16)/2+16)=8.5+16=24.5
        // But tileH=32, scaleY=1 -> tileH=32, rowH=((32-16)/2+16)=24
        // cullPaddingX=0, cullPaddingY=0
        // boundsLeft = floor(0/33) = 0, boundsRight = ceil(330/33) = 10
        var layer = makeLayer({ staggerAxis: 'y', tileWidth: 33, tileHeight: 32, cullPaddingX: 0, cullPaddingY: 0 });
        var camera = makeCamera(0, 0, 330, 240);
        var result = HexagonalCullBounds(layer, camera);

        expect(result.left).toBe(0);
        expect(result.right).toBe(10);
    });

    it('should use staggerAxis x with layer offset and cull padding', function ()
    {
        // tileW=32, tileH=32, len=16, rowW=24
        // layerX=32, layerY=0, cullPaddingX=1, cullPaddingY=1
        // camera x=32, right=272: worldView.x - layerX = 0, right - layerX = 240
        // boundsLeft = floor(0/24) - 1 = -1
        // boundsRight = ceil(240/24) + 1 = 10 + 1 = 11
        // camera y=0, bottom=320: boundsTop = floor(0/32) - 1 = -1, boundsBottom = ceil(320/32) + 1 = 11
        var layer = makeLayer({ staggerAxis: 'x', layerX: 32, layerY: 0 });
        var camera = makeCamera(32, 0, 272, 320);
        var result = HexagonalCullBounds(layer, camera);

        expect(result.left).toBe(-1);
        expect(result.right).toBe(11);
        expect(result.top).toBe(-1);
        expect(result.bottom).toBe(11);
    });
});
