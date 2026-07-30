var ParseCSV = require('../../../src/tilemaps/parsers/ParseCSV');
var Formats = require('../../../src/tilemaps/Formats');

describe('Phaser.Tilemaps.Parsers.ParseCSV', function ()
{
    var name = 'testMap';
    var tileWidth = 32;
    var tileHeight = 32;

    describe('return value', function ()
    {
        it('should return a MapData object', function ()
        {
            var result = ParseCSV(name, '0,1,2\n3,4,5', tileWidth, tileHeight, false);
            expect(result).toBeDefined();
            expect(result.constructor.name).toBe('MapData');
        });

        it('should set the format to CSV', function ()
        {
            var result = ParseCSV(name, '0,1,2', tileWidth, tileHeight, false);
            expect(result.format).toBe(Formats.CSV);
        });

        it('should set format to 0 (CSV constant value)', function ()
        {
            var result = ParseCSV(name, '0,1,2', tileWidth, tileHeight, false);
            expect(result.format).toBe(0);
        });

        it('should not set format to ARRAY_2D', function ()
        {
            var result = ParseCSV(name, '0,1,2', tileWidth, tileHeight, false);
            expect(result.format).not.toBe(Formats.ARRAY_2D);
        });

        it('should set the name on the MapData', function ()
        {
            var result = ParseCSV('myMap', '0,1', tileWidth, tileHeight, false);
            expect(result.name).toBe('myMap');
        });

        it('should set tileWidth on the MapData', function ()
        {
            var result = ParseCSV(name, '0,1', 16, 32, false);
            expect(result.tileWidth).toBe(16);
        });

        it('should set tileHeight on the MapData', function ()
        {
            var result = ParseCSV(name, '0,1', 32, 16, false);
            expect(result.tileHeight).toBe(16);
        });
    });

    describe('CSV parsing', function ()
    {
        it('should parse a single row CSV into correct width', function ()
        {
            var result = ParseCSV(name, '0,1,2,3,4', tileWidth, tileHeight, false);
            expect(result.width).toBe(5);
            expect(result.height).toBe(1);
        });

        it('should parse a multi-row CSV into correct dimensions', function ()
        {
            var csv = '0,1,2\n3,4,5\n6,7,8';
            var result = ParseCSV(name, csv, tileWidth, tileHeight, false);
            expect(result.width).toBe(3);
            expect(result.height).toBe(3);
        });

        it('should parse tile index values correctly', function ()
        {
            var csv = '0,1,2\n3,4,5';
            var result = ParseCSV(name, csv, tileWidth, tileHeight, false);
            var layerData = result.layers[0].data;
            expect(layerData[0][0].index).toBe(0);
            expect(layerData[0][1].index).toBe(1);
            expect(layerData[0][2].index).toBe(2);
            expect(layerData[1][0].index).toBe(3);
            expect(layerData[1][2].index).toBe(5);
        });

        it('should handle a single-tile CSV', function ()
        {
            var result = ParseCSV(name, '7', tileWidth, tileHeight, false);
            expect(result.width).toBe(1);
            expect(result.height).toBe(1);
            expect(result.layers[0].data[0][0].index).toBe(7);
        });

        it('should trim leading and trailing whitespace from the CSV string', function ()
        {
            var result = ParseCSV(name, '  0,1,2\n3,4,5  ', tileWidth, tileHeight, false);
            expect(result.height).toBe(2);
            expect(result.width).toBe(3);
        });

        it('should trim leading newlines from the CSV string', function ()
        {
            var result = ParseCSV(name, '\n0,1,2\n3,4,5', tileWidth, tileHeight, false);
            expect(result.height).toBe(2);
        });

        it('should trim trailing newlines from the CSV string', function ()
        {
            var result = ParseCSV(name, '0,1,2\n3,4,5\n', tileWidth, tileHeight, false);
            expect(result.height).toBe(2);
        });
    });

    describe('dimensions', function ()
    {
        it('should calculate widthInPixels correctly', function ()
        {
            var result = ParseCSV(name, '0,1,2\n3,4,5', tileWidth, tileHeight, false);
            expect(result.widthInPixels).toBe(3 * tileWidth);
        });

        it('should calculate heightInPixels correctly', function ()
        {
            var result = ParseCSV(name, '0,1,2\n3,4,5', tileWidth, tileHeight, false);
            expect(result.heightInPixels).toBe(2 * tileHeight);
        });

        it('should calculate pixel dimensions with non-square tiles', function ()
        {
            var result = ParseCSV(name, '0,1,2\n3,4,5', 16, 24, false);
            expect(result.widthInPixels).toBe(3 * 16);
            expect(result.heightInPixels).toBe(2 * 24);
        });
    });

    describe('layer data', function ()
    {
        it('should create exactly one layer', function ()
        {
            var result = ParseCSV(name, '0,1,2\n3,4,5', tileWidth, tileHeight, false);
            expect(result.layers.length).toBe(1);
        });

        it('should populate layer.data as a 2D array', function ()
        {
            var result = ParseCSV(name, '0,1,2\n3,4,5', tileWidth, tileHeight, false);
            var layerData = result.layers[0].data;
            expect(Array.isArray(layerData)).toBe(true);
            expect(layerData.length).toBe(2);
            expect(Array.isArray(layerData[0])).toBe(true);
            expect(layerData[0].length).toBe(3);
        });
    });

    describe('insertNull = false', function ()
    {
        it('should create a Tile with index -1 for empty tiles', function ()
        {
            var csv = '1,-1,2';
            var result = ParseCSV(name, csv, tileWidth, tileHeight, false);
            var tile = result.layers[0].data[0][1];
            expect(tile).not.toBeNull();
            expect(tile.index).toBe(-1);
        });

        it('should not insert null for -1 tiles when insertNull is false', function ()
        {
            var csv = '-1,0,1';
            var result = ParseCSV(name, csv, tileWidth, tileHeight, false);
            expect(result.layers[0].data[0][0]).not.toBeNull();
        });
    });

    describe('insertNull = true', function ()
    {
        it('should insert null for empty tiles when insertNull is true', function ()
        {
            var csv = '1,-1,2';
            var result = ParseCSV(name, csv, tileWidth, tileHeight, true);
            expect(result.layers[0].data[0][1]).toBeNull();
        });

        it('should still create Tile objects for valid indexes when insertNull is true', function ()
        {
            var csv = '1,-1,2';
            var result = ParseCSV(name, csv, tileWidth, tileHeight, true);
            expect(result.layers[0].data[0][0]).not.toBeNull();
            expect(result.layers[0].data[0][0].index).toBe(1);
            expect(result.layers[0].data[0][2]).not.toBeNull();
            expect(result.layers[0].data[0][2].index).toBe(2);
        });
    });

    describe('edge cases', function ()
    {
        it('should handle tile index of 0 as a valid tile, not empty', function ()
        {
            var result = ParseCSV(name, '0,1,2', tileWidth, tileHeight, false);
            var tile = result.layers[0].data[0][0];
            expect(tile.index).toBe(0);
        });

        it('should handle large tile index values', function ()
        {
            var result = ParseCSV(name, '999,1000,9999', tileWidth, tileHeight, false);
            var layerData = result.layers[0].data;
            expect(layerData[0][0].index).toBe(999);
            expect(layerData[0][1].index).toBe(1000);
            expect(layerData[0][2].index).toBe(9999);
        });

        it('should handle a wide single-row map', function ()
        {
            var csv = '0,1,2,3,4,5,6,7,8,9';
            var result = ParseCSV(name, csv, tileWidth, tileHeight, false);
            expect(result.width).toBe(10);
            expect(result.height).toBe(1);
        });

        it('should handle a tall single-column map', function ()
        {
            var csv = '0\n1\n2\n3\n4';
            var result = ParseCSV(name, csv, tileWidth, tileHeight, false);
            expect(result.width).toBe(1);
            expect(result.height).toBe(5);
        });
    });
});
