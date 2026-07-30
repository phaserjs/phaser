var ParseTileLayers = require('../../../../src/tilemaps/parsers/impact/ParseTileLayers');

describe('Phaser.Tilemaps.Parsers.Impact.ParseTileLayers', function ()
{
    var singleLayerJson;

    beforeEach(function ()
    {
        singleLayerJson = {
            layer: [
                {
                    name: 'TestLayer',
                    width: 3,
                    height: 2,
                    tilesize: 32,
                    visible: 1,
                    data: [
                        [ 1, 2, 3 ],
                        [ 0, 1, 0 ]
                    ]
                }
            ]
        };
    });

    it('should return an array', function ()
    {
        var result = ParseTileLayers(singleLayerJson, false);

        expect(Array.isArray(result)).toBe(true);
    });

    it('should return one LayerData per layer in json', function ()
    {
        var result = ParseTileLayers(singleLayerJson, false);

        expect(result.length).toBe(1);
    });

    it('should return multiple LayerData objects when json has multiple layers', function ()
    {
        var multiLayerJson = {
            layer: [
                {
                    name: 'Layer1',
                    width: 2,
                    height: 2,
                    tilesize: 16,
                    visible: 1,
                    data: [ [ 1, 2 ], [ 3, 4 ] ]
                },
                {
                    name: 'Layer2',
                    width: 2,
                    height: 2,
                    tilesize: 16,
                    visible: 0,
                    data: [ [ 0, 1 ], [ 2, 0 ] ]
                }
            ]
        };

        var result = ParseTileLayers(multiLayerJson, false);

        expect(result.length).toBe(2);
    });

    it('should return an empty array when json has no layers', function ()
    {
        var result = ParseTileLayers({ layer: [] }, false);

        expect(result.length).toBe(0);
    });

    it('should set the layer name from json', function ()
    {
        var result = ParseTileLayers(singleLayerJson, false);

        expect(result[0].name).toBe('TestLayer');
    });

    it('should set the layer width from json', function ()
    {
        var result = ParseTileLayers(singleLayerJson, false);

        expect(result[0].width).toBe(3);
    });

    it('should set the layer height from json', function ()
    {
        var result = ParseTileLayers(singleLayerJson, false);

        expect(result[0].height).toBe(2);
    });

    it('should set tileWidth from layer tilesize', function ()
    {
        var result = ParseTileLayers(singleLayerJson, false);

        expect(result[0].tileWidth).toBe(32);
    });

    it('should set tileHeight from layer tilesize', function ()
    {
        var result = ParseTileLayers(singleLayerJson, false);

        expect(result[0].tileHeight).toBe(32);
    });

    it('should set visible to true when layer.visible is 1', function ()
    {
        var result = ParseTileLayers(singleLayerJson, false);

        expect(result[0].visible).toBe(true);
    });

    it('should set visible to false when layer.visible is 0', function ()
    {
        singleLayerJson.layer[0].visible = 0;

        var result = ParseTileLayers(singleLayerJson, false);

        expect(result[0].visible).toBe(false);
    });

    it('should populate the data grid with the correct number of rows', function ()
    {
        var result = ParseTileLayers(singleLayerJson, false);

        expect(result[0].data.length).toBe(2);
    });

    it('should populate each row with the correct number of tiles', function ()
    {
        var result = ParseTileLayers(singleLayerJson, false);

        expect(result[0].data[0].length).toBe(3);
        expect(result[0].data[1].length).toBe(3);
    });

    it('should convert Impact index 1 to tile index 0', function ()
    {
        var result = ParseTileLayers(singleLayerJson, false);

        expect(result[0].data[0][0].index).toBe(0);
    });

    it('should convert Impact index 2 to tile index 1', function ()
    {
        var result = ParseTileLayers(singleLayerJson, false);

        expect(result[0].data[0][1].index).toBe(1);
    });

    it('should convert Impact index 0 (no tile) to tile index -1', function ()
    {
        var result = ParseTileLayers(singleLayerJson, false);

        expect(result[0].data[1][0].index).toBe(-1);
    });

    it('should create Tile objects for valid tile indexes when insertNull is false', function ()
    {
        var result = ParseTileLayers(singleLayerJson, false);
        var tile = result[0].data[0][0];

        expect(tile).not.toBeNull();
        expect(typeof tile).toBe('object');
        expect(tile.index).toBe(0);
    });

    it('should create Tile objects for empty tiles when insertNull is false', function ()
    {
        var result = ParseTileLayers(singleLayerJson, false);
        var tile = result[0].data[1][0];

        expect(tile).not.toBeNull();
        expect(typeof tile).toBe('object');
        expect(tile.index).toBe(-1);
    });

    it('should insert null for empty tiles when insertNull is true', function ()
    {
        var result = ParseTileLayers(singleLayerJson, true);

        expect(result[0].data[1][0]).toBeNull();
        expect(result[0].data[1][2]).toBeNull();
    });

    it('should not insert null for valid tiles when insertNull is true', function ()
    {
        var result = ParseTileLayers(singleLayerJson, true);
        var tile = result[0].data[0][0];

        expect(tile).not.toBeNull();
        expect(tile.index).toBe(0);
    });

    it('should set tile x coordinate correctly', function ()
    {
        var result = ParseTileLayers(singleLayerJson, false);

        expect(result[0].data[0][0].x).toBe(0);
        expect(result[0].data[0][1].x).toBe(1);
        expect(result[0].data[0][2].x).toBe(2);
    });

    it('should set tile y coordinate correctly', function ()
    {
        var result = ParseTileLayers(singleLayerJson, false);

        expect(result[0].data[0][0].y).toBe(0);
        expect(result[0].data[1][0].y).toBe(1);
    });

    it('should set tile width from layer tilesize', function ()
    {
        var result = ParseTileLayers(singleLayerJson, false);

        expect(result[0].data[0][0].width).toBe(32);
    });

    it('should set tile height from layer tilesize', function ()
    {
        var result = ParseTileLayers(singleLayerJson, false);

        expect(result[0].data[0][0].height).toBe(32);
    });

    it('should handle a single cell layer', function ()
    {
        var json = {
            layer: [
                {
                    name: 'Single',
                    width: 1,
                    height: 1,
                    tilesize: 8,
                    visible: 1,
                    data: [ [ 5 ] ]
                }
            ]
        };

        var result = ParseTileLayers(json, false);

        expect(result.length).toBe(1);
        expect(result[0].data[0][0].index).toBe(4);
    });

    it('should handle a layer where all tiles are empty with insertNull false', function ()
    {
        var json = {
            layer: [
                {
                    name: 'Empty',
                    width: 2,
                    height: 2,
                    tilesize: 16,
                    visible: 1,
                    data: [ [ 0, 0 ], [ 0, 0 ] ]
                }
            ]
        };

        var result = ParseTileLayers(json, false);

        for (var y = 0; y < 2; y++)
        {
            for (var x = 0; x < 2; x++)
            {
                expect(result[0].data[y][x]).not.toBeNull();
                expect(result[0].data[y][x].index).toBe(-1);
            }
        }
    });

    it('should handle a layer where all tiles are empty with insertNull true', function ()
    {
        var json = {
            layer: [
                {
                    name: 'Empty',
                    width: 2,
                    height: 2,
                    tilesize: 16,
                    visible: 1,
                    data: [ [ 0, 0 ], [ 0, 0 ] ]
                }
            ]
        };

        var result = ParseTileLayers(json, true);

        for (var y = 0; y < 2; y++)
        {
            for (var x = 0; x < 2; x++)
            {
                expect(result[0].data[y][x]).toBeNull();
            }
        }
    });

    it('should correctly name multiple layers', function ()
    {
        var json = {
            layer: [
                {
                    name: 'Ground',
                    width: 1,
                    height: 1,
                    tilesize: 32,
                    visible: 1,
                    data: [ [ 1 ] ]
                },
                {
                    name: 'Objects',
                    width: 1,
                    height: 1,
                    tilesize: 32,
                    visible: 0,
                    data: [ [ 2 ] ]
                }
            ]
        };

        var result = ParseTileLayers(json, false);

        expect(result[0].name).toBe('Ground');
        expect(result[1].name).toBe('Objects');
    });

    it('should set the layerData as the parent on each tile', function ()
    {
        var result = ParseTileLayers(singleLayerJson, false);
        var layerData = result[0];
        var tile = layerData.data[0][0];

        expect(tile.layer).toBe(layerData);
    });
});
