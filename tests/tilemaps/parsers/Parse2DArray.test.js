var Parse2DArray = require('../../../src/tilemaps/parsers/Parse2DArray');
var Formats = require('../../../src/tilemaps/Formats');

describe('Phaser.Tilemaps.Parsers.Parse2DArray', function ()
{
    var name = 'testMap';
    var tileWidth = 32;
    var tileHeight = 32;
    var data;

    beforeEach(function ()
    {
        data = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8]
        ];
    });

    describe('return value', function ()
    {
        it('should return a MapData object', function ()
        {
            var result = Parse2DArray(name, data, tileWidth, tileHeight, false);
            expect(result).toBeDefined();
            expect(result.constructor.name).toBe('MapData');
        });

        it('should set the name on the MapData', function ()
        {
            var result = Parse2DArray(name, data, tileWidth, tileHeight, false);
            expect(result.name).toBe(name);
        });

        it('should set the format to ARRAY_2D', function ()
        {
            var result = Parse2DArray(name, data, tileWidth, tileHeight, false);
            expect(result.format).toBe(Formats.ARRAY_2D);
        });

        it('should set tileWidth on the MapData', function ()
        {
            var result = Parse2DArray(name, data, tileWidth, tileHeight, false);
            expect(result.tileWidth).toBe(tileWidth);
        });

        it('should set tileHeight on the MapData', function ()
        {
            var result = Parse2DArray(name, data, tileWidth, tileHeight, false);
            expect(result.tileHeight).toBe(tileHeight);
        });
    });

    describe('dimensions', function ()
    {
        it('should set width to the number of columns in the first row', function ()
        {
            var result = Parse2DArray(name, data, tileWidth, tileHeight, false);
            expect(result.width).toBe(3);
        });

        it('should set height to the number of rows', function ()
        {
            var result = Parse2DArray(name, data, tileWidth, tileHeight, false);
            expect(result.height).toBe(3);
        });

        it('should calculate widthInPixels correctly', function ()
        {
            var result = Parse2DArray(name, data, tileWidth, tileHeight, false);
            expect(result.widthInPixels).toBe(3 * tileWidth);
        });

        it('should calculate heightInPixels correctly', function ()
        {
            var result = Parse2DArray(name, data, tileWidth, tileHeight, false);
            expect(result.heightInPixels).toBe(3 * tileHeight);
        });

        it('should handle non-square tile sizes', function ()
        {
            var result = Parse2DArray(name, data, 16, 24, false);
            expect(result.widthInPixels).toBe(3 * 16);
            expect(result.heightInPixels).toBe(3 * 24);
        });

        it('should handle rectangular maps wider than tall', function ()
        {
            var wideData = [
                [0, 1, 2, 3, 4]
            ];
            var result = Parse2DArray(name, wideData, tileWidth, tileHeight, false);
            expect(result.width).toBe(5);
            expect(result.height).toBe(1);
        });

        it('should handle rectangular maps taller than wide', function ()
        {
            var tallData = [[0], [1], [2], [3], [4]];
            var result = Parse2DArray(name, tallData, tileWidth, tileHeight, false);
            expect(result.width).toBe(1);
            expect(result.height).toBe(5);
        });
    });

    describe('layer data', function ()
    {
        it('should create exactly one layer', function ()
        {
            var result = Parse2DArray(name, data, tileWidth, tileHeight, false);
            expect(result.layers.length).toBe(1);
        });

        it('should set tileWidth on the layer', function ()
        {
            var result = Parse2DArray(name, data, tileWidth, tileHeight, false);
            expect(result.layers[0].tileWidth).toBe(tileWidth);
        });

        it('should set tileHeight on the layer', function ()
        {
            var result = Parse2DArray(name, data, tileWidth, tileHeight, false);
            expect(result.layers[0].tileHeight).toBe(tileHeight);
        });

        it('should set width on the layer to match MapData width', function ()
        {
            var result = Parse2DArray(name, data, tileWidth, tileHeight, false);
            expect(result.layers[0].width).toBe(result.width);
        });

        it('should set height on the layer to match MapData height', function ()
        {
            var result = Parse2DArray(name, data, tileWidth, tileHeight, false);
            expect(result.layers[0].height).toBe(result.height);
        });

        it('should set widthInPixels on the layer to match MapData', function ()
        {
            var result = Parse2DArray(name, data, tileWidth, tileHeight, false);
            expect(result.layers[0].widthInPixels).toBe(result.widthInPixels);
        });

        it('should set heightInPixels on the layer to match MapData', function ()
        {
            var result = Parse2DArray(name, data, tileWidth, tileHeight, false);
            expect(result.layers[0].heightInPixels).toBe(result.heightInPixels);
        });

        it('should populate layer.data as a 2D array', function ()
        {
            var result = Parse2DArray(name, data, tileWidth, tileHeight, false);
            var layerData = result.layers[0].data;
            expect(Array.isArray(layerData)).toBe(true);
            expect(layerData.length).toBe(3);
            expect(Array.isArray(layerData[0])).toBe(true);
            expect(layerData[0].length).toBe(3);
        });
    });

    describe('tile creation', function ()
    {
        it('should create Tile objects for positive tile indexes', function ()
        {
            var result = Parse2DArray(name, data, tileWidth, tileHeight, false);
            var tile = result.layers[0].data[0][0];
            expect(tile).not.toBeNull();
            expect(tile.index).toBe(0);
        });

        it('should set correct tile index values', function ()
        {
            var result = Parse2DArray(name, data, tileWidth, tileHeight, false);
            var layerData = result.layers[0].data;
            expect(layerData[0][0].index).toBe(0);
            expect(layerData[0][1].index).toBe(1);
            expect(layerData[0][2].index).toBe(2);
            expect(layerData[1][0].index).toBe(3);
            expect(layerData[2][2].index).toBe(8);
        });

        it('should set correct x and y positions on tiles', function ()
        {
            var result = Parse2DArray(name, data, tileWidth, tileHeight, false);
            var layerData = result.layers[0].data;
            expect(layerData[0][0].x).toBe(0);
            expect(layerData[0][0].y).toBe(0);
            expect(layerData[1][2].x).toBe(2);
            expect(layerData[1][2].y).toBe(1);
            expect(layerData[2][1].x).toBe(1);
            expect(layerData[2][1].y).toBe(2);
        });

        it('should set tileWidth and tileHeight on each Tile', function ()
        {
            var result = Parse2DArray(name, data, tileWidth, tileHeight, false);
            var tile = result.layers[0].data[0][0];
            expect(tile.width).toBe(tileWidth);
            expect(tile.height).toBe(tileHeight);
        });
    });

    describe('insertNull = false (default)', function ()
    {
        it('should create a Tile with index -1 for empty tiles when insertNull is false', function ()
        {
            var sparseData = [
                [1, -1, 2]
            ];
            var result = Parse2DArray(name, sparseData, tileWidth, tileHeight, false);
            var tile = result.layers[0].data[0][1];
            expect(tile).not.toBeNull();
            expect(tile.index).toBe(-1);
        });

        it('should create a Tile with index -1 for NaN values when insertNull is false', function ()
        {
            var nanData = [
                [1, NaN, 2]
            ];
            var result = Parse2DArray(name, nanData, tileWidth, tileHeight, false);
            var tile = result.layers[0].data[0][1];
            expect(tile).not.toBeNull();
            expect(tile.index).toBe(-1);
        });
    });

    describe('insertNull = true', function ()
    {
        it('should insert null for empty tiles when insertNull is true', function ()
        {
            var sparseData = [
                [1, -1, 2]
            ];
            var result = Parse2DArray(name, sparseData, tileWidth, tileHeight, true);
            expect(result.layers[0].data[0][1]).toBeNull();
        });

        it('should insert null for NaN values when insertNull is true', function ()
        {
            var nanData = [
                [1, NaN, 2]
            ];
            var result = Parse2DArray(name, nanData, tileWidth, tileHeight, true);
            expect(result.layers[0].data[0][1]).toBeNull();
        });

        it('should still create Tile objects for valid indexes when insertNull is true', function ()
        {
            var sparseData = [
                [1, -1, 2]
            ];
            var result = Parse2DArray(name, sparseData, tileWidth, tileHeight, true);
            expect(result.layers[0].data[0][0]).not.toBeNull();
            expect(result.layers[0].data[0][0].index).toBe(1);
            expect(result.layers[0].data[0][2]).not.toBeNull();
            expect(result.layers[0].data[0][2].index).toBe(2);
        });
    });

    describe('edge cases', function ()
    {
        it('should handle string tile index values by parsing them as integers', function ()
        {
            var stringData = [
                ['3', '7', '0']
            ];
            var result = Parse2DArray(name, stringData, tileWidth, tileHeight, false);
            var layerData = result.layers[0].data;
            expect(layerData[0][0].index).toBe(3);
            expect(layerData[0][1].index).toBe(7);
            expect(layerData[0][2].index).toBe(0);
        });

        it('should handle a single-tile map', function ()
        {
            var singleData = [[5]];
            var result = Parse2DArray(name, singleData, tileWidth, tileHeight, false);
            expect(result.width).toBe(1);
            expect(result.height).toBe(1);
            expect(result.layers[0].data[0][0].index).toBe(5);
        });

        it('should handle tile index of 0 as a valid tile, not empty', function ()
        {
            var zeroData = [[0, 1]];
            var result = Parse2DArray(name, zeroData, tileWidth, tileHeight, false);
            var tile = result.layers[0].data[0][0];
            expect(tile.index).toBe(0);
        });

        it('should handle large tile indexes', function ()
        {
            var largeData = [[999, 1000, 9999]];
            var result = Parse2DArray(name, largeData, tileWidth, tileHeight, false);
            var layerData = result.layers[0].data;
            expect(layerData[0][0].index).toBe(999);
            expect(layerData[0][1].index).toBe(1000);
            expect(layerData[0][2].index).toBe(9999);
        });

        it('should use the width of the first row only', function ()
        {
            var unevenData = [
                [0, 1, 2, 3],
                [4, 5]
            ];
            var result = Parse2DArray(name, unevenData, tileWidth, tileHeight, false);
            expect(result.width).toBe(4);
        });

        it('should handle different tileWidth and tileHeight values', function ()
        {
            var result = Parse2DArray(name, data, 8, 16, false);
            expect(result.tileWidth).toBe(8);
            expect(result.tileHeight).toBe(16);
            expect(result.widthInPixels).toBe(3 * 8);
            expect(result.heightInPixels).toBe(3 * 16);
        });
    });
});
