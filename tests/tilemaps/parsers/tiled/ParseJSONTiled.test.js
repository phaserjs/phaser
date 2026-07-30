vi.mock('../../../../src/tilemaps/parsers/tiled/ParseTileLayers', function ()
{
    return function () { return []; };
});

var ParseJSONTiled = require('../../../../src/tilemaps/parsers/tiled/ParseJSONTiled');

describe('Phaser.Tilemaps.Parsers.Tiled.ParseJSONTiled', function ()
{
    var minimalJson;

    beforeEach(function ()
    {
        minimalJson = {
            width: 10,
            height: 8,
            tilewidth: 32,
            tileheight: 32,
            orientation: 'orthogonal',
            version: '1.2',
            layers: [],
            tilesets: [],
            renderorder: 'right-down',
            infinite: false,
            properties: []
        };
    });

    it('should return a MapData object', function ()
    {
        var result = ParseJSONTiled('testmap', minimalJson, false);

        expect(result).not.toBeNull();
        expect(typeof result).toBe('object');
    });

    it('should set the name on the returned MapData', function ()
    {
        var result = ParseJSONTiled('mymap', minimalJson, false);

        expect(result.name).toBe('mymap');
    });

    it('should set the width from the JSON', function ()
    {
        var result = ParseJSONTiled('testmap', minimalJson, false);

        expect(result.width).toBe(10);
    });

    it('should set the height from the JSON', function ()
    {
        var result = ParseJSONTiled('testmap', minimalJson, false);

        expect(result.height).toBe(8);
    });

    it('should set tileWidth from json.tilewidth', function ()
    {
        var result = ParseJSONTiled('testmap', minimalJson, false);

        expect(result.tileWidth).toBe(32);
    });

    it('should set tileHeight from json.tileheight', function ()
    {
        var result = ParseJSONTiled('testmap', minimalJson, false);

        expect(result.tileHeight).toBe(32);
    });

    it('should set format to TILED_JSON (1)', function ()
    {
        var result = ParseJSONTiled('testmap', minimalJson, false);

        expect(result.format).toBe(1);
    });

    it('should set version from the JSON', function ()
    {
        var result = ParseJSONTiled('testmap', minimalJson, false);

        expect(result.version).toBe('1.2');
    });

    it('should set renderOrder from json.renderorder', function ()
    {
        var result = ParseJSONTiled('testmap', minimalJson, false);

        expect(result.renderOrder).toBe('right-down');
    });

    it('should set infinite to false when JSON has infinite: false', function ()
    {
        var result = ParseJSONTiled('testmap', minimalJson, false);

        expect(result.infinite).toBe(false);
    });

    it('should set infinite to true when JSON has infinite: true', function ()
    {
        minimalJson.infinite = true;

        var result = ParseJSONTiled('testmap', minimalJson, false);

        expect(result.infinite).toBe(true);
    });

    it('should set orthogonal orientation (0) when json.orientation is "orthogonal"', function ()
    {
        minimalJson.orientation = 'orthogonal';

        var result = ParseJSONTiled('testmap', minimalJson, false);

        expect(result.orientation).toBe(0);
    });

    it('should set isometric orientation (1) when json.orientation is "isometric"', function ()
    {
        minimalJson.orientation = 'isometric';

        var result = ParseJSONTiled('testmap', minimalJson, false);

        expect(result.orientation).toBe(1);
    });

    it('should set staggered orientation (2) when json.orientation is "staggered"', function ()
    {
        minimalJson.orientation = 'staggered';

        var result = ParseJSONTiled('testmap', minimalJson, false);

        expect(result.orientation).toBe(2);
    });

    it('should set hexagonal orientation (3) when json.orientation is "hexagonal"', function ()
    {
        minimalJson.orientation = 'hexagonal';
        minimalJson.hexsidelength = 16;
        minimalJson.staggeraxis = 'y';
        minimalJson.staggerindex = 'odd';

        var result = ParseJSONTiled('testmap', minimalJson, false);

        expect(result.orientation).toBe(3);
    });

    it('should set hexSideLength for hexagonal maps', function ()
    {
        minimalJson.orientation = 'hexagonal';
        minimalJson.hexsidelength = 16;
        minimalJson.staggeraxis = 'y';
        minimalJson.staggerindex = 'odd';

        var result = ParseJSONTiled('testmap', minimalJson, false);

        expect(result.hexSideLength).toBe(16);
    });

    it('should set staggerAxis for hexagonal maps', function ()
    {
        minimalJson.orientation = 'hexagonal';
        minimalJson.hexsidelength = 16;
        minimalJson.staggeraxis = 'x';
        minimalJson.staggerindex = 'even';

        var result = ParseJSONTiled('testmap', minimalJson, false);

        expect(result.staggerAxis).toBe('x');
    });

    it('should set staggerIndex for hexagonal maps', function ()
    {
        minimalJson.orientation = 'hexagonal';
        minimalJson.hexsidelength = 16;
        minimalJson.staggeraxis = 'y';
        minimalJson.staggerindex = 'odd';

        var result = ParseJSONTiled('testmap', minimalJson, false);

        expect(result.staggerIndex).toBe('odd');
    });

    it('should calculate widthInPixels and heightInPixels for hexagonal maps with staggerAxis "y"', function ()
    {
        // tileWidth=32, tileHeight=32, hexSideLength=16, width=10, height=8
        // triangleHeight = (32 - 16) / 2 = 8
        // widthInPixels = 32 * (10 + 0.5) = 336
        // heightInPixels = 8 * (16 + 8) + 8 = 200
        minimalJson.orientation = 'hexagonal';
        minimalJson.hexsidelength = 16;
        minimalJson.staggeraxis = 'y';
        minimalJson.staggerindex = 'odd';

        var result = ParseJSONTiled('testmap', minimalJson, false);

        expect(result.widthInPixels).toBeCloseTo(336);
        expect(result.heightInPixels).toBeCloseTo(200);
    });

    it('should calculate widthInPixels and heightInPixels for hexagonal maps with staggerAxis "x"', function ()
    {
        // tileWidth=32, tileHeight=32, hexSideLength=16, width=10, height=8
        // triangleWidth = (32 - 16) / 2 = 8
        // widthInPixels = 10 * (16 + 8) + 8 = 248
        // heightInPixels = 32 * (8 + 0.5) = 272
        minimalJson.orientation = 'hexagonal';
        minimalJson.hexsidelength = 16;
        minimalJson.staggeraxis = 'x';
        minimalJson.staggerindex = 'odd';

        var result = ParseJSONTiled('testmap', minimalJson, false);

        expect(result.widthInPixels).toBeCloseTo(248);
        expect(result.heightInPixels).toBeCloseTo(272);
    });

    it('should calculate hexagonal pixel dimensions correctly with different tile and hex sizes', function ()
    {
        // tileWidth=64, tileHeight=64, hexSideLength=32, width=5, height=4, staggerAxis='y'
        // triangleHeight = (64 - 32) / 2 = 16
        // widthInPixels = 64 * (5 + 0.5) = 352
        // heightInPixels = 4 * (32 + 16) + 16 = 208
        minimalJson.tilewidth = 64;
        minimalJson.tileheight = 64;
        minimalJson.width = 5;
        minimalJson.height = 4;
        minimalJson.orientation = 'hexagonal';
        minimalJson.hexsidelength = 32;
        minimalJson.staggeraxis = 'y';
        minimalJson.staggerindex = 'even';

        var result = ParseJSONTiled('testmap', minimalJson, false);

        expect(result.widthInPixels).toBeCloseTo(352);
        expect(result.heightInPixels).toBeCloseTo(208);
    });

    it('should not modify the source object (deep copy)', function ()
    {
        var originalWidth = minimalJson.width;
        var originalHeight = minimalJson.height;
        var originalOrientation = minimalJson.orientation;

        ParseJSONTiled('testmap', minimalJson, false);

        expect(minimalJson.width).toBe(originalWidth);
        expect(minimalJson.height).toBe(originalHeight);
        expect(minimalJson.orientation).toBe(originalOrientation);
    });

    it('should return a layers array on the MapData', function ()
    {
        var result = ParseJSONTiled('testmap', minimalJson, false);

        expect(Array.isArray(result.layers)).toBe(true);
    });

    it('should return an images array on the MapData', function ()
    {
        var result = ParseJSONTiled('testmap', minimalJson, false);

        expect(Array.isArray(result.images)).toBe(true);
    });

    it('should return a tilesets array on the MapData', function ()
    {
        var result = ParseJSONTiled('testmap', minimalJson, false);

        expect(Array.isArray(result.tilesets)).toBe(true);
    });

    it('should return an imageCollections array on the MapData', function ()
    {
        var result = ParseJSONTiled('testmap', minimalJson, false);

        expect(Array.isArray(result.imageCollections)).toBe(true);
    });

    it('should return an objects array on the MapData', function ()
    {
        var result = ParseJSONTiled('testmap', minimalJson, false);

        expect(Array.isArray(result.objects)).toBe(true);
    });

    it('should return a tiles array (tileset index) on the MapData', function ()
    {
        var result = ParseJSONTiled('testmap', minimalJson, false);

        expect(Array.isArray(result.tiles)).toBe(true);
    });

    it('should set properties from the JSON', function ()
    {
        minimalJson.properties = [ { name: 'gravity', type: 'int', value: 10 } ];

        var result = ParseJSONTiled('testmap', minimalJson, false);

        expect(result.properties).toEqual([ { name: 'gravity', type: 'int', value: 10 } ]);
    });

    it('should handle different width and height values', function ()
    {
        minimalJson.width = 20;
        minimalJson.height = 15;

        var result = ParseJSONTiled('testmap', minimalJson, false);

        expect(result.width).toBe(20);
        expect(result.height).toBe(15);
    });

    it('should handle different tile width and height values', function ()
    {
        minimalJson.tilewidth = 16;
        minimalJson.tileheight = 16;

        var result = ParseJSONTiled('testmap', minimalJson, false);

        expect(result.tileWidth).toBe(16);
        expect(result.tileHeight).toBe(16);
    });

    it('should handle case-insensitive orientation strings', function ()
    {
        minimalJson.orientation = 'Isometric';

        var result = ParseJSONTiled('testmap', minimalJson, false);

        expect(result.orientation).toBe(1);
    });

    it('should produce independent MapData instances for separate calls with the same source', function ()
    {
        var result1 = ParseJSONTiled('map1', minimalJson, false);
        var result2 = ParseJSONTiled('map2', minimalJson, false);

        expect(result1).not.toBe(result2);
        expect(result1.name).toBe('map1');
        expect(result2.name).toBe('map2');
    });

    it('should not set hexSideLength on non-hexagonal maps', function ()
    {
        minimalJson.orientation = 'orthogonal';

        var result = ParseJSONTiled('testmap', minimalJson, false);

        expect(result.hexSideLength).toBe(0);
    });

    it('should use numeric version when present', function ()
    {
        minimalJson.version = 1.4;

        var result = ParseJSONTiled('testmap', minimalJson, false);

        expect(result.version).toBe(1.4);
    });
});
