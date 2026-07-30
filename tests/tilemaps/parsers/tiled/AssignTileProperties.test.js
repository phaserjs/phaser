var AssignTileProperties = require('../../../../src/tilemaps/parsers/tiled/AssignTileProperties');

describe('Phaser.Tilemaps.Parsers.Tiled.AssignTileProperties', function ()
{
    function makeTile(index, properties)
    {
        return {
            index: index,
            width: 0,
            height: 0,
            properties: properties || {}
        };
    }

    function makeMapData(layers, tiles, tilesets)
    {
        return {
            layers: layers,
            tiles: tiles,
            tilesets: tilesets
        };
    }

    it('should set tile width and height from its tileset', function ()
    {
        var tile = makeTile(1);
        var mapData = makeMapData(
            [ { data: [ [ tile ] ] } ],
            [ null, [ 0, 0, 0 ] ],
            [ { tileWidth: 32, tileHeight: 64, firstgid: 0, tileProperties: null } ]
        );

        AssignTileProperties(mapData);

        expect(tile.width).toBe(32);
        expect(tile.height).toBe(64);
    });

    it('should merge tileset tileProperties onto the tile', function ()
    {
        var tile = makeTile(1);
        var mapData = makeMapData(
            [ { data: [ [ tile ] ] } ],
            [ null, [ 0, 0, 0 ] ],
            [ {
                tileWidth: 16,
                tileHeight: 16,
                firstgid: 0,
                tileProperties: { 1: { collides: true, damage: 5 } }
            } ]
        );

        AssignTileProperties(mapData);

        expect(tile.properties.collides).toBe(true);
        expect(tile.properties.damage).toBe(5);
    });

    it('should extend existing tile properties rather than replace them', function ()
    {
        var tile = makeTile(1, { existing: 'value' });
        var mapData = makeMapData(
            [ { data: [ [ tile ] ] } ],
            [ null, [ 0, 0, 0 ] ],
            [ {
                tileWidth: 16,
                tileHeight: 16,
                firstgid: 0,
                tileProperties: { 1: { added: 'property' } }
            } ]
        );

        AssignTileProperties(mapData);

        expect(tile.properties.existing).toBe('value');
        expect(tile.properties.added).toBe('property');
    });

    it('should skip null tiles', function ()
    {
        var mapData = makeMapData(
            [ { data: [ [ null ] ] } ],
            [],
            []
        );

        expect(function () { AssignTileProperties(mapData); }).not.toThrow();
    });

    it('should skip tiles with index < 0', function ()
    {
        var tile = makeTile(-1);
        var mapData = makeMapData(
            [ { data: [ [ tile ] ] } ],
            [],
            []
        );

        expect(function () { AssignTileProperties(mapData); }).not.toThrow();
        expect(tile.width).toBe(0);
        expect(tile.height).toBe(0);
    });

    it('should skip tiles with index === 0 when index < 0 check is used (index 0 is valid)', function ()
    {
        var tile = makeTile(0);
        var mapData = makeMapData(
            [ { data: [ [ tile ] ] } ],
            [ [ 0, 0, 0 ] ],
            [ { tileWidth: 8, tileHeight: 8, firstgid: 0, tileProperties: null } ]
        );

        AssignTileProperties(mapData);

        expect(tile.width).toBe(8);
        expect(tile.height).toBe(8);
    });

    it('should process multiple layers', function ()
    {
        var tile1 = makeTile(1);
        var tile2 = makeTile(1);
        var mapData = makeMapData(
            [
                { data: [ [ tile1 ] ] },
                { data: [ [ tile2 ] ] }
            ],
            [ null, [ 0, 0, 0 ] ],
            [ { tileWidth: 32, tileHeight: 32, firstgid: 0, tileProperties: null } ]
        );

        AssignTileProperties(mapData);

        expect(tile1.width).toBe(32);
        expect(tile2.width).toBe(32);
    });

    it('should process multiple rows within a layer', function ()
    {
        var tile1 = makeTile(1);
        var tile2 = makeTile(1);
        var mapData = makeMapData(
            [ { data: [ [ tile1 ], [ tile2 ] ] } ],
            [ null, [ 0, 0, 0 ] ],
            [ { tileWidth: 48, tileHeight: 48, firstgid: 0, tileProperties: null } ]
        );

        AssignTileProperties(mapData);

        expect(tile1.width).toBe(48);
        expect(tile2.width).toBe(48);
    });

    it('should process multiple tiles within a row', function ()
    {
        var tile1 = makeTile(1);
        var tile2 = makeTile(1);
        var mapData = makeMapData(
            [ { data: [ [ tile1, tile2 ] ] } ],
            [ null, [ 0, 0, 0 ] ],
            [ { tileWidth: 16, tileHeight: 16, firstgid: 0, tileProperties: null } ]
        );

        AssignTileProperties(mapData);

        expect(tile1.width).toBe(16);
        expect(tile2.width).toBe(16);
    });

    it('should not add properties when tileProperties is null', function ()
    {
        var tile = makeTile(1, { original: true });
        var mapData = makeMapData(
            [ { data: [ [ tile ] ] } ],
            [ null, [ 0, 0, 0 ] ],
            [ { tileWidth: 16, tileHeight: 16, firstgid: 0, tileProperties: null } ]
        );

        AssignTileProperties(mapData);

        expect(tile.properties.original).toBe(true);
        expect(Object.keys(tile.properties).length).toBe(1);
    });

    it('should not add properties when tileProperties does not contain entry for this tile', function ()
    {
        var tile = makeTile(1, { original: true });
        var mapData = makeMapData(
            [ { data: [ [ tile ] ] } ],
            [ null, [ 0, 0, 0 ] ],
            [ {
                tileWidth: 16,
                tileHeight: 16,
                firstgid: 0,
                tileProperties: { 99: { otherTile: true } }
            } ]
        );

        AssignTileProperties(mapData);

        expect(tile.properties.original).toBe(true);
        expect(tile.properties.otherTile).toBeUndefined();
    });

    it('should use tileset firstgid when looking up tileProperties', function ()
    {
        var tile = makeTile(10);
        var mapData = makeMapData(
            [ { data: [ [ tile ] ] } ],
            new Array(11).fill(null).map(function (_, i) { return i === 10 ? [ 0, 0, 0 ] : null; }),
            [ {
                tileWidth: 32,
                tileHeight: 32,
                firstgid: 5,
                tileProperties: { 5: { special: true } }
            } ]
        );

        AssignTileProperties(mapData);

        expect(tile.properties.special).toBe(true);
    });

    it('should select correct tileset using the sid from mapData.tiles', function ()
    {
        var tile = makeTile(1);
        var mapData = makeMapData(
            [ { data: [ [ tile ] ] } ],
            [ null, [ 0, 0, 1 ] ],
            [
                { tileWidth: 16, tileHeight: 16, firstgid: 0, tileProperties: null },
                { tileWidth: 64, tileHeight: 64, firstgid: 0, tileProperties: null }
            ]
        );

        AssignTileProperties(mapData);

        expect(tile.width).toBe(64);
        expect(tile.height).toBe(64);
    });

    it('should handle empty layers array without throwing', function ()
    {
        var mapData = makeMapData([], [], []);

        expect(function () { AssignTileProperties(mapData); }).not.toThrow();
    });

    it('should handle a mix of null and valid tiles in a row', function ()
    {
        var tile = makeTile(1);
        var mapData = makeMapData(
            [ { data: [ [ null, tile, null ] ] } ],
            [ null, [ 0, 0, 0 ] ],
            [ { tileWidth: 24, tileHeight: 24, firstgid: 0, tileProperties: null } ]
        );

        AssignTileProperties(mapData);

        expect(tile.width).toBe(24);
        expect(tile.height).toBe(24);
    });

    it('should handle a mix of negative-index and valid tiles in a row', function ()
    {
        var invalidTile = makeTile(-1);
        var validTile = makeTile(1);
        var mapData = makeMapData(
            [ { data: [ [ invalidTile, validTile ] ] } ],
            [ null, [ 0, 0, 0 ] ],
            [ { tileWidth: 32, tileHeight: 32, firstgid: 0, tileProperties: null } ]
        );

        AssignTileProperties(mapData);

        expect(invalidTile.width).toBe(0);
        expect(validTile.width).toBe(32);
    });
});
