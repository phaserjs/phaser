var ParseTilesets = require('../../../../src/tilemaps/parsers/impact/ParseTilesets');

describe('Phaser.Tilemaps.Parsers.Impact.ParseTilesets', function ()
{
    it('should return an empty array when there are no layers', function ()
    {
        var json = { layer: [] };
        var result = ParseTilesets(json);

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
    });

    it('should return a single tileset for a single valid layer', function ()
    {
        var json = {
            layer: [
                { tilesetName: 'tiles/grass', tilesize: 32 }
            ]
        };
        var result = ParseTilesets(json);

        expect(result.length).toBe(1);
    });

    it('should set the tileset name from the layer tilesetName', function ()
    {
        var json = {
            layer: [
                { tilesetName: 'tiles/grass', tilesize: 32 }
            ]
        };
        var result = ParseTilesets(json);

        expect(result[0].name).toBe('tiles/grass');
    });

    it('should set tileWidth from the layer tilesize', function ()
    {
        var json = {
            layer: [
                { tilesetName: 'tiles/desert', tilesize: 16 }
            ]
        };
        var result = ParseTilesets(json);

        expect(result[0].tileWidth).toBe(16);
    });

    it('should set tileHeight from the layer tilesize', function ()
    {
        var json = {
            layer: [
                { tilesetName: 'tiles/desert', tilesize: 16 }
            ]
        };
        var result = ParseTilesets(json);

        expect(result[0].tileHeight).toBe(16);
    });

    it('should set tileMargin to zero', function ()
    {
        var json = {
            layer: [
                { tilesetName: 'tiles/forest', tilesize: 32 }
            ]
        };
        var result = ParseTilesets(json);

        expect(result[0].tileMargin).toBe(0);
    });

    it('should set tileSpacing to zero', function ()
    {
        var json = {
            layer: [
                { tilesetName: 'tiles/forest', tilesize: 32 }
            ]
        };
        var result = ParseTilesets(json);

        expect(result[0].tileSpacing).toBe(0);
    });

    it('should skip layers with a blank tilesetName (collision layers)', function ()
    {
        var json = {
            layer: [
                { tilesetName: '', tilesize: 32 },
                { tilesetName: '', tilesize: 16 }
            ]
        };
        var result = ParseTilesets(json);

        expect(result.length).toBe(0);
    });

    it('should skip duplicate tileset names', function ()
    {
        var json = {
            layer: [
                { tilesetName: 'tiles/grass', tilesize: 32 },
                { tilesetName: 'tiles/grass', tilesize: 32 }
            ]
        };
        var result = ParseTilesets(json);

        expect(result.length).toBe(1);
    });

    it('should include each unique tileset name only once', function ()
    {
        var json = {
            layer: [
                { tilesetName: 'tiles/grass', tilesize: 32 },
                { tilesetName: 'tiles/water', tilesize: 32 },
                { tilesetName: 'tiles/grass', tilesize: 32 }
            ]
        };
        var result = ParseTilesets(json);

        expect(result.length).toBe(2);
        expect(result[0].name).toBe('tiles/grass');
        expect(result[1].name).toBe('tiles/water');
    });

    it('should return multiple tilesets for layers with unique names', function ()
    {
        var json = {
            layer: [
                { tilesetName: 'tiles/grass', tilesize: 32 },
                { tilesetName: 'tiles/water', tilesize: 16 },
                { tilesetName: 'tiles/stone', tilesize: 64 }
            ]
        };
        var result = ParseTilesets(json);

        expect(result.length).toBe(3);
    });

    it('should preserve the tilesize per tileset when layers have different tilesizes', function ()
    {
        var json = {
            layer: [
                { tilesetName: 'tiles/small', tilesize: 16 },
                { tilesetName: 'tiles/large', tilesize: 64 }
            ]
        };
        var result = ParseTilesets(json);

        expect(result[0].tileWidth).toBe(16);
        expect(result[0].tileHeight).toBe(16);
        expect(result[1].tileWidth).toBe(64);
        expect(result[1].tileHeight).toBe(64);
    });

    it('should handle a mix of collision layers and valid layers', function ()
    {
        var json = {
            layer: [
                { tilesetName: 'tiles/grass', tilesize: 32 },
                { tilesetName: '', tilesize: 32 },
                { tilesetName: 'tiles/water', tilesize: 32 },
                { tilesetName: '', tilesize: 32 }
            ]
        };
        var result = ParseTilesets(json);

        expect(result.length).toBe(2);
        expect(result[0].name).toBe('tiles/grass');
        expect(result[1].name).toBe('tiles/water');
    });

    it('should return tilesets in the order they are first encountered', function ()
    {
        var json = {
            layer: [
                { tilesetName: 'tiles/c', tilesize: 32 },
                { tilesetName: 'tiles/a', tilesize: 32 },
                { tilesetName: 'tiles/b', tilesize: 32 }
            ]
        };
        var result = ParseTilesets(json);

        expect(result[0].name).toBe('tiles/c');
        expect(result[1].name).toBe('tiles/a');
        expect(result[2].name).toBe('tiles/b');
    });
});
