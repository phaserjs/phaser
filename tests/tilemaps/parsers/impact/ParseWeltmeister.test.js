var ParseWeltmeister = require('../../../../src/tilemaps/parsers/impact/ParseWeltmeister');
var Formats = require('../../../../src/tilemaps/Formats');

describe('Phaser.Tilemaps.Parsers.Impact.ParseWeltmeister', function ()
{
    var singleLayerJson;

    beforeEach(function ()
    {
        singleLayerJson = {
            layer: [
                {
                    name: 'Ground',
                    width: 4,
                    height: 3,
                    tilesize: 32,
                    visible: 1,
                    tilesetName: 'tiles.png',
                    data: []
                }
            ]
        };
    });

    it('should return null when the json has no layers', function ()
    {
        var result = ParseWeltmeister('testmap', { layer: [] }, false);

        expect(result).toBeNull();
    });

    it('should emit a console warning when the json has no layers', function ()
    {
        var warnSpy = vi.spyOn(console, 'warn').mockImplementation(function () {});

        ParseWeltmeister('mymap', { layer: [] }, false);

        expect(warnSpy).toHaveBeenCalledWith('No layers found in the Weltmeister map: mymap');

        warnSpy.mockRestore();
    });

    it('should include the map name in the warning message', function ()
    {
        var message = '';
        var originalWarn = console.warn;

        console.warn = function (msg)
        {
            message = msg;
        };

        ParseWeltmeister('uniquename123', { layer: [] }, false);

        console.warn = originalWarn;

        expect(message).toContain('uniquename123');
    });

    it('should return a MapData object when the json has layers', function ()
    {
        var result = ParseWeltmeister('testmap', singleLayerJson, false);

        expect(result).not.toBeNull();
        expect(typeof result).toBe('object');
    });

    it('should set the name on the returned MapData', function ()
    {
        var result = ParseWeltmeister('mymapname', singleLayerJson, false);

        expect(result.name).toBe('mymapname');
    });

    it('should set the width from the single layer', function ()
    {
        var result = ParseWeltmeister('testmap', singleLayerJson, false);

        expect(result.width).toBe(4);
    });

    it('should set the height from the single layer', function ()
    {
        var result = ParseWeltmeister('testmap', singleLayerJson, false);

        expect(result.height).toBe(3);
    });

    it('should set tileWidth from the first layer tilesize', function ()
    {
        var result = ParseWeltmeister('testmap', singleLayerJson, false);

        expect(result.tileWidth).toBe(32);
    });

    it('should set tileHeight from the first layer tilesize', function ()
    {
        var result = ParseWeltmeister('testmap', singleLayerJson, false);

        expect(result.tileHeight).toBe(32);
    });

    it('should set the format to WELTMEISTER', function ()
    {
        var result = ParseWeltmeister('testmap', singleLayerJson, false);

        expect(result.format).toBe(Formats.WELTMEISTER);
        expect(result.format).toBe(3);
    });

    it('should set mapData.layers to the array returned by ParseTileLayers', function ()
    {
        var result = ParseWeltmeister('testmap', singleLayerJson, false);

        expect(Array.isArray(result.layers)).toBe(true);
        expect(result.layers.length).toBe(1);
    });

    it('should set mapData.tilesets to the array returned by ParseTilesets', function ()
    {
        var result = ParseWeltmeister('testmap', singleLayerJson, false);

        expect(Array.isArray(result.tilesets)).toBe(true);
    });

    it('should pick the maximum width across multiple layers', function ()
    {
        var json = {
            layer: [
                { name: 'Small', width: 3, height: 2, tilesize: 16, tilesetName: 'a.png', data: [] },
                { name: 'Wide', width: 10, height: 2, tilesize: 16, tilesetName: 'b.png', data: [] }
            ]
        };

        var result = ParseWeltmeister('testmap', json, false);

        expect(result.width).toBe(10);
    });

    it('should pick the maximum height across multiple layers', function ()
    {
        var json = {
            layer: [
                { name: 'Short', width: 2, height: 2, tilesize: 16, tilesetName: 'a.png', data: [] },
                { name: 'Tall', width: 2, height: 5, tilesize: 16, tilesetName: 'b.png', data: [] }
            ]
        };

        var result = ParseWeltmeister('testmap', json, false);

        expect(result.height).toBe(5);
    });

    it('should use the maximum width and height when layers differ in both dimensions', function ()
    {
        var json = {
            layer: [
                { name: 'LayerA', width: 8, height: 2, tilesize: 32, tilesetName: 'a.png', data: [] },
                { name: 'LayerB', width: 2, height: 6, tilesize: 32, tilesetName: 'b.png', data: [] }
            ]
        };

        var result = ParseWeltmeister('testmap', json, false);

        expect(result.width).toBe(8);
        expect(result.height).toBe(6);
    });

    it('should use tilesize from the first layer even when multiple layers exist', function ()
    {
        var json = {
            layer: [
                { name: 'First', width: 2, height: 1, tilesize: 64, tilesetName: 'big.png', data: [] },
                { name: 'Second', width: 2, height: 1, tilesize: 16, tilesetName: 'small.png', data: [] }
            ]
        };

        var result = ParseWeltmeister('testmap', json, false);

        expect(result.tileWidth).toBe(64);
        expect(result.tileHeight).toBe(64);
    });

    it('should set layers length equal to the number of layers in json', function ()
    {
        var json = {
            layer: [
                { name: 'L1', width: 2, height: 2, tilesize: 16, tilesetName: 'a.png', data: [] },
                { name: 'L2', width: 2, height: 2, tilesize: 16, tilesetName: 'b.png', data: [] },
                { name: 'L3', width: 2, height: 2, tilesize: 16, tilesetName: '', data: [] }
            ]
        };

        var result = ParseWeltmeister('testmap', json, false);

        expect(result.layers.length).toBe(3);
    });

    it('should create a tileset entry for each unique non-empty tilesetName', function ()
    {
        var json = {
            layer: [
                { name: 'L1', width: 1, height: 1, tilesize: 32, tilesetName: 'tiles1.png', data: [] },
                { name: 'L2', width: 1, height: 1, tilesize: 32, tilesetName: 'tiles2.png', data: [] }
            ]
        };

        var result = ParseWeltmeister('testmap', json, false);

        expect(result.tilesets.length).toBe(2);
    });

    it('should not duplicate tilesets when multiple layers share the same tilesetName', function ()
    {
        var json = {
            layer: [
                { name: 'L1', width: 1, height: 1, tilesize: 32, tilesetName: 'shared.png', data: [] },
                { name: 'L2', width: 1, height: 1, tilesize: 32, tilesetName: 'shared.png', data: [] }
            ]
        };

        var result = ParseWeltmeister('testmap', json, false);

        expect(result.tilesets.length).toBe(1);
    });

    it('should not create a tileset for a collision layer with an empty tilesetName', function ()
    {
        var json = {
            layer: [
                { name: 'Ground', width: 1, height: 1, tilesize: 32, tilesetName: 'tiles.png', data: [] },
                { name: 'Collision', width: 1, height: 1, tilesize: 32, tilesetName: '', data: [] }
            ]
        };

        var result = ParseWeltmeister('testmap', json, false);

        expect(result.tilesets.length).toBe(1);
    });

    it('should handle a map with a single 1x1 layer', function ()
    {
        var json = {
            layer: [
                { name: 'Tiny', width: 1, height: 1, tilesize: 8, tilesetName: 'tiny.png', data: [] }
            ]
        };

        var result = ParseWeltmeister('tinymap', json, false);

        expect(result).not.toBeNull();
        expect(result.width).toBe(1);
        expect(result.height).toBe(1);
        expect(result.tileWidth).toBe(8);
        expect(result.tileHeight).toBe(8);
        expect(result.name).toBe('tinymap');
    });

    it('should return width 0 and height 0 only when all layers report 0 dimensions', function ()
    {
        var json = {
            layer: [
                { name: 'Zero', width: 0, height: 0, tilesize: 32, tilesetName: '', data: [] }
            ]
        };

        var result = ParseWeltmeister('testmap', json, false);

        expect(result.width).toBe(0);
        expect(result.height).toBe(0);
    });

});
