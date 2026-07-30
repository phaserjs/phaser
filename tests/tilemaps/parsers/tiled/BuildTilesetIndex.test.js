var BuildTilesetIndex = require('../../../../src/tilemaps/parsers/tiled/BuildTilesetIndex');

describe('Phaser.Tilemaps.Parsers.Tiled.BuildTilesetIndex', function ()
{
    function makeTileset (firstgid, total, columns, rows, options)
    {
        options = options || {};
        return {
            firstgid: firstgid,
            total: total,
            columns: columns,
            rows: rows,
            tileWidth: options.tileWidth !== undefined ? options.tileWidth : 32,
            tileHeight: options.tileHeight !== undefined ? options.tileHeight : 32,
            tileMargin: options.tileMargin !== undefined ? options.tileMargin : 0,
            tileSpacing: options.tileSpacing !== undefined ? options.tileSpacing : 0
        };
    }

    function makeMapData (tilesets, imageCollections, tileHeight)
    {
        return {
            tilesets: tilesets || [],
            imageCollections: imageCollections || [],
            tileHeight: tileHeight || 32
        };
    }

    it('should return an empty array when mapData has no tilesets or imageCollections', function ()
    {
        var mapData = makeMapData([], []);
        var result = BuildTilesetIndex(mapData);

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
    });

    it('should return a sparse array entry for a single tile tileset', function ()
    {
        var mapData = makeMapData([ makeTileset(1, 1, 1, 1) ]);
        var result = BuildTilesetIndex(mapData);

        expect(result[1]).toEqual([ 0, 0, 0 ]);
    });

    it('should not define entries before firstgid', function ()
    {
        var mapData = makeMapData([ makeTileset(5, 2, 2, 1) ]);
        var result = BuildTilesetIndex(mapData);

        expect(result[1]).toBeUndefined();
        expect(result[4]).toBeUndefined();
        expect(result[5]).toBeDefined();
        expect(result[6]).toBeDefined();
    });

    it('should assign tilesetIndex 0 for the first tileset', function ()
    {
        var mapData = makeMapData([ makeTileset(1, 4, 2, 2) ]);
        var result = BuildTilesetIndex(mapData);

        expect(result[1][2]).toBe(0);
        expect(result[2][2]).toBe(0);
        expect(result[3][2]).toBe(0);
        expect(result[4][2]).toBe(0);
    });

    it('should lay out tiles in a 2x2 grid with correct pixel positions', function ()
    {
        var mapData = makeMapData([ makeTileset(1, 4, 2, 2) ]);
        var result = BuildTilesetIndex(mapData);

        expect(result[1]).toEqual([ 0, 0, 0 ]);
        expect(result[2]).toEqual([ 32, 0, 0 ]);
        expect(result[3]).toEqual([ 0, 32, 0 ]);
        expect(result[4]).toEqual([ 32, 32, 0 ]);
    });

    it('should lay out tiles in a 3x2 grid with correct pixel positions', function ()
    {
        var mapData = makeMapData([ makeTileset(1, 6, 3, 2) ]);
        var result = BuildTilesetIndex(mapData);

        expect(result[1]).toEqual([ 0, 0, 0 ]);
        expect(result[2]).toEqual([ 32, 0, 0 ]);
        expect(result[3]).toEqual([ 64, 0, 0 ]);
        expect(result[4]).toEqual([ 0, 32, 0 ]);
        expect(result[5]).toEqual([ 32, 32, 0 ]);
        expect(result[6]).toEqual([ 64, 32, 0 ]);
    });

    it('should handle a single-row tileset with multiple columns', function ()
    {
        var mapData = makeMapData([ makeTileset(1, 5, 5, 1) ]);
        var result = BuildTilesetIndex(mapData);

        expect(result[1]).toEqual([ 0, 0, 0 ]);
        expect(result[2]).toEqual([ 32, 0, 0 ]);
        expect(result[3]).toEqual([ 64, 0, 0 ]);
        expect(result[4]).toEqual([ 96, 0, 0 ]);
        expect(result[5]).toEqual([ 128, 0, 0 ]);
    });

    it('should handle a single-column tileset with multiple rows', function ()
    {
        var mapData = makeMapData([ makeTileset(1, 3, 1, 3) ]);
        var result = BuildTilesetIndex(mapData);

        expect(result[1]).toEqual([ 0, 0, 0 ]);
        expect(result[2]).toEqual([ 0, 32, 0 ]);
        expect(result[3]).toEqual([ 0, 64, 0 ]);
    });

    it('should apply tile margin as the starting x and y position', function ()
    {
        var mapData = makeMapData([ makeTileset(1, 1, 1, 1, { tileMargin: 4 }) ]);
        var result = BuildTilesetIndex(mapData);

        expect(result[1]).toEqual([ 4, 4, 0 ]);
    });

    it('should account for tile margin when resetting x at end of each row', function ()
    {
        var mapData = makeMapData([ makeTileset(1, 4, 2, 2, { tileMargin: 4 }) ]);
        var result = BuildTilesetIndex(mapData);

        expect(result[1][0]).toBe(4);
        expect(result[3][0]).toBe(4);
    });

    it('should account for tile spacing when advancing x position', function ()
    {
        var mapData = makeMapData([ makeTileset(1, 2, 2, 1, { tileSpacing: 2 }) ]);
        var result = BuildTilesetIndex(mapData);

        expect(result[1]).toEqual([ 0, 0, 0 ]);
        expect(result[2]).toEqual([ 34, 0, 0 ]);
    });

    it('should account for tile spacing when advancing y position to next row', function ()
    {
        var mapData = makeMapData([ makeTileset(1, 2, 1, 2, { tileSpacing: 2 }) ]);
        var result = BuildTilesetIndex(mapData);

        expect(result[1]).toEqual([ 0, 0, 0 ]);
        expect(result[2]).toEqual([ 0, 34, 0 ]);
    });

    it('should account for both tile margin and spacing together', function ()
    {
        var mapData = makeMapData([ makeTileset(1, 4, 2, 2, { tileMargin: 2, tileSpacing: 1 }) ]);
        var result = BuildTilesetIndex(mapData);

        // x starts at margin=2, advances by tileWidth(32)+spacing(1)=33 each step
        // y starts at margin=2, advances by tileHeight(32)+spacing(1)=33 each row
        expect(result[1]).toEqual([ 2, 2, 0 ]);
        expect(result[2]).toEqual([ 35, 2, 0 ]);
        expect(result[3]).toEqual([ 2, 35, 0 ]);
        expect(result[4]).toEqual([ 35, 35, 0 ]);
    });

    it('should use firstgid as the starting GID offset', function ()
    {
        var mapData = makeMapData([ makeTileset(10, 4, 2, 2) ]);
        var result = BuildTilesetIndex(mapData);

        expect(result[9]).toBeUndefined();
        expect(result[10]).toEqual([ 0, 0, 0 ]);
        expect(result[11]).toEqual([ 32, 0, 0 ]);
        expect(result[12]).toEqual([ 0, 32, 0 ]);
        expect(result[13]).toEqual([ 32, 32, 0 ]);
    });

    it('should assign correct tilesetIndex values for multiple tilesets', function ()
    {
        var ts1 = makeTileset(1, 4, 2, 2);
        var ts2 = makeTileset(5, 4, 2, 2);
        var mapData = makeMapData([ ts1, ts2 ]);
        var result = BuildTilesetIndex(mapData);

        expect(result[1][2]).toBe(0);
        expect(result[4][2]).toBe(0);
        expect(result[5][2]).toBe(1);
        expect(result[8][2]).toBe(1);
    });

    it('should generate independent pixel positions per tileset', function ()
    {
        var ts1 = makeTileset(1, 1, 1, 1);
        var ts2 = makeTileset(2, 4, 2, 2);
        var mapData = makeMapData([ ts1, ts2 ]);
        var result = BuildTilesetIndex(mapData);

        expect(result[2]).toEqual([ 0, 0, 1 ]);
        expect(result[3]).toEqual([ 32, 0, 1 ]);
        expect(result[4]).toEqual([ 0, 32, 1 ]);
        expect(result[5]).toEqual([ 32, 32, 1 ]);
    });

    it('should handle a third tileset with tilesetIndex 2', function ()
    {
        var ts1 = makeTileset(1, 1, 1, 1);
        var ts2 = makeTileset(2, 1, 1, 1);
        var ts3 = makeTileset(3, 1, 1, 1);
        var mapData = makeMapData([ ts1, ts2, ts3 ]);
        var result = BuildTilesetIndex(mapData);

        expect(result[1][2]).toBe(0);
        expect(result[2][2]).toBe(1);
        expect(result[3][2]).toBe(2);
    });

    it('should produce entries for all GIDs in range for a tileset', function ()
    {
        var mapData = makeMapData([ makeTileset(1, 9, 3, 3) ]);
        var result = BuildTilesetIndex(mapData);

        for (var gid = 1; gid <= 9; gid++)
        {
            expect(result[gid]).toBeDefined();
            expect(result[gid].length).toBe(3);
        }
    });

    it('should add imageCollections images to mapData.tilesets', function ()
    {
        var collection = {
            images: [
                { image: 'tile1.png', gid: 1, width: 32, height: 32 },
                { image: 'tile2.png', gid: 2, width: 32, height: 32 }
            ]
        };

        var mapData = {
            tilesets: [],
            imageCollections: [ collection ],
            tileHeight: 32
        };

        BuildTilesetIndex(mapData);

        expect(mapData.tilesets.length).toBe(2);
    });

    it('should include imageCollection-derived tilesets in the returned index', function ()
    {
        var collection = {
            images: [
                { image: 'tile1.png', gid: 1, width: 32, height: 32 }
            ]
        };

        var mapData = {
            tilesets: [],
            imageCollections: [ collection ],
            tileHeight: 32
        };

        var result = BuildTilesetIndex(mapData);

        expect(result[1]).toBeDefined();
        expect(Array.isArray(result[1])).toBe(true);
        expect(result[1].length).toBe(3);
    });

    it('should handle multiple imageCollections each with multiple images', function ()
    {
        var collection1 = {
            images: [
                { image: 'a.png', gid: 1, width: 32, height: 32 },
                { image: 'b.png', gid: 2, width: 32, height: 32 }
            ]
        };
        var collection2 = {
            images: [
                { image: 'c.png', gid: 3, width: 32, height: 32 }
            ]
        };

        var mapData = {
            tilesets: [],
            imageCollections: [ collection1, collection2 ],
            tileHeight: 32
        };

        BuildTilesetIndex(mapData);

        expect(mapData.tilesets.length).toBe(3);
    });

    it('should process pre-existing tilesets alongside imageCollection-derived ones', function ()
    {
        var existingTileset = makeTileset(10, 4, 2, 2);
        var collection = {
            images: [
                { image: 'tile.png', gid: 1, width: 32, height: 32 }
            ]
        };

        var mapData = {
            tilesets: [ existingTileset ],
            imageCollections: [ collection ],
            tileHeight: 32
        };

        var result = BuildTilesetIndex(mapData);

        // existingTileset is at index 0; imageCollection tileset is appended at index 1
        expect(result[10]).toBeDefined();
        expect(result[10][2]).toBe(0);
    });
});
