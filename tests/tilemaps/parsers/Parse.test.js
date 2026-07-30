var Parse = require('../../../src/tilemaps/parsers/Parse');
var Formats = require('../../../src/tilemaps/Formats');

var minimalTiledJSON = {
    orientation: 'orthogonal',
    width: 2,
    height: 2,
    tilewidth: 32,
    tileheight: 32,
    layers: [],
    tilesets: [],
    version: 1.2,
    infinite: false
};

var minimalWeltmeister = {
    layer: [
        {
            name: 'layer1',
            width: 2,
            height: 2,
            tilesize: 32,
            visible: 1,
            data: [[1, 0], [0, 1]],
            tileset: ''
        }
    ]
};

describe('Phaser.Tilemaps.Parsers.Parse', function ()
{
    it('should return null for an unrecognized format', function ()
    {
        var result = Parse('test', 999, [], 32, 32, false);

        expect(result).toBeNull();
    });

    it('should warn when an unrecognized format is given', function ()
    {
        var warned = false;
        var originalWarn = console.warn;

        console.warn = function ()
        {
            warned = true;
        };

        Parse('test', 999, [], 32, 32, false);

        console.warn = originalWarn;

        expect(warned).toBe(true);
    });

    it('should include the format value in the unrecognized format warning', function ()
    {
        var message = '';
        var originalWarn = console.warn;

        console.warn = function (msg)
        {
            message = msg;
        };

        Parse('test', 42, [], 32, 32, false);

        console.warn = originalWarn;

        expect(message).toContain('42');
    });

    it('should return a result for ARRAY_2D format', function ()
    {
        var result = Parse('testmap', Formats.ARRAY_2D, [[0, 1], [2, 3]], 32, 32, false);

        expect(result).not.toBeNull();
        expect(typeof result).toBe('object');
    });

    it('should pass name through for ARRAY_2D format', function ()
    {
        var result = Parse('mymap', Formats.ARRAY_2D, [[0, 1]], 16, 16, false);

        expect(result.name).toBe('mymap');
    });

    it('should pass tileWidth and tileHeight for ARRAY_2D format', function ()
    {
        var result = Parse('test', Formats.ARRAY_2D, [[0]], 64, 48, false);

        expect(result.tileWidth).toBe(64);
        expect(result.tileHeight).toBe(48);
    });

    it('should pass insertNull for ARRAY_2D format', function ()
    {
        var result = Parse('test', Formats.ARRAY_2D, [[-1]], 32, 32, true);

        expect(result.layers[0].data[0][0]).toBeNull();
    });

    it('should return a result for CSV format', function ()
    {
        var result = Parse('csvmap', Formats.CSV, '0,1\n2,3', 32, 32, false);

        expect(result).not.toBeNull();
        expect(typeof result).toBe('object');
    });

    it('should pass name through for CSV format', function ()
    {
        var result = Parse('mycsv', Formats.CSV, '0,1', 16, 16, false);

        expect(result.name).toBe('mycsv');
    });

    it('should pass tileWidth and tileHeight for CSV format', function ()
    {
        var result = Parse('test', Formats.CSV, '0,1', 64, 48, false);

        expect(result.tileWidth).toBe(64);
        expect(result.tileHeight).toBe(48);
    });

    it('should pass insertNull for CSV format', function ()
    {
        var result = Parse('test', Formats.CSV, '-1', 32, 32, true);

        expect(result.layers[0].data[0][0]).toBeNull();
    });

    it('should return a result for TILED_JSON format', function ()
    {
        var result = Parse('tiledmap', Formats.TILED_JSON, minimalTiledJSON, 32, 32, false);

        expect(result).not.toBeNull();
        expect(typeof result).toBe('object');
    });

    it('should pass name through for TILED_JSON format', function ()
    {
        var result = Parse('mytiled', Formats.TILED_JSON, minimalTiledJSON, 32, 32, false);

        expect(result.name).toBe('mytiled');
    });

    it('should pass insertNull for TILED_JSON format', function ()
    {
        var tiledWithTile = {
            orientation: 'orthogonal',
            width: 1,
            height: 1,
            tilewidth: 32,
            tileheight: 32,
            tilesets: [],
            version: 1.2,
            infinite: false,
            layers: [
                {
                    type: 'tilelayer',
                    name: 'layer1',
                    width: 1,
                    height: 1,
                    visible: true,
                    opacity: 1,
                    x: 0,
                    y: 0,
                    data: [0]
                }
            ]
        };

        var result = Parse('test', Formats.TILED_JSON, tiledWithTile, 32, 32, true);

        expect(result).not.toBeNull();
        expect(result.layers[0].data[0][0]).toBeNull();
    });

    it('should return a result for WELTMEISTER format', function ()
    {
        var result = Parse('wmmap', Formats.WELTMEISTER, minimalWeltmeister, 32, 32, false);

        expect(result).not.toBeNull();
        expect(typeof result).toBe('object');
    });

    it('should pass name through for WELTMEISTER format', function ()
    {
        var result = Parse('mywm', Formats.WELTMEISTER, minimalWeltmeister, 32, 32, false);

        expect(result.name).toBe('mywm');
    });

    it('should pass insertNull for WELTMEISTER format', function ()
    {
        var wmWithEmpty = {
            layer: [
                {
                    name: 'layer1',
                    width: 1,
                    height: 1,
                    tilesize: 32,
                    visible: 1,
                    data: [[0]],
                    tileset: ''
                }
            ]
        };

        var result = Parse('test', Formats.WELTMEISTER, wmWithEmpty, 32, 32, true);

        expect(result.layers[0].data[0][0]).toBeNull();
    });

    it('should return null for undefined format', function ()
    {
        var result = Parse('test', undefined, [], 32, 32, false);

        expect(result).toBeNull();
    });

    it('should return null for null format', function ()
    {
        var result = Parse('test', null, [], 32, 32, false);

        expect(result).toBeNull();
    });

    it('should route ARRAY_2D correctly and not CSV', function ()
    {
        var result = Parse('test', Formats.ARRAY_2D, [[0]], 32, 32, false);

        expect(result.format).toBe(Formats.ARRAY_2D);
    });

    it('should route CSV correctly and not ARRAY_2D', function ()
    {
        var result = Parse('test', Formats.CSV, '0', 32, 32, false);

        expect(result.format).toBe(Formats.CSV);
    });

    it('should route TILED_JSON correctly', function ()
    {
        var result = Parse('test', Formats.TILED_JSON, minimalTiledJSON, 32, 32, false);

        expect(result.format).toBe(Formats.TILED_JSON);
    });

    it('should route WELTMEISTER correctly', function ()
    {
        var result = Parse('test', Formats.WELTMEISTER, minimalWeltmeister, 32, 32, false);

        expect(result.format).toBe(Formats.WELTMEISTER);
    });
});
