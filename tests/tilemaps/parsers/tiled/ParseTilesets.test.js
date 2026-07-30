var ParseTilesets = require('../../../../src/tilemaps/parsers/tiled/ParseTilesets');

describe('Phaser.Tilemaps.Parsers.Tiled.ParseTilesets', function ()
{
    var warnSpy;

    beforeEach(function ()
    {
        warnSpy = vi.spyOn(console, 'warn').mockImplementation(function () {});
    });

    afterEach(function ()
    {
        warnSpy.mockRestore();
    });

    // ---------------------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------------------

    function makeImageTilesetJSON(overrides)
    {
        var base = {
            name: 'TestTileset',
            firstgid: 1,
            tilewidth: 32,
            tileheight: 32,
            margin: 0,
            spacing: 0,
            image: 'tileset.png',
            imagewidth: 128,
            imageheight: 128,
            tileoffset: { x: 0, y: 0 }
        };

        return Object.assign({}, base, overrides);
    }

    function makeCollectionTilesetJSON(overrides)
    {
        var base = {
            name: 'TestCollection',
            firstgid: 1,
            tilewidth: 32,
            tileheight: 32,
            margin: 0,
            spacing: 0,
            properties: {},
            tiles: [
                { id: 0, image: 'tile0.png', imagewidth: 32, imageheight: 32 },
                { id: 1, image: 'tile1.png', imagewidth: 64, imageheight: 64 }
            ]
        };

        return Object.assign({}, base, overrides);
    }

    // ---------------------------------------------------------------------------
    // Empty input
    // ---------------------------------------------------------------------------

    it('should return empty arrays when tilesets array is empty', function ()
    {
        var result = ParseTilesets({ tilesets: [], version: 1 });

        expect(result.tilesets).toEqual([]);
        expect(result.imageCollections).toEqual([]);
    });

    it('should return an object with tilesets and imageCollections properties', function ()
    {
        var result = ParseTilesets({ tilesets: [], version: 1 });

        expect(result).toHaveProperty('tilesets');
        expect(result).toHaveProperty('imageCollections');
    });

    // ---------------------------------------------------------------------------
    // External tileset warning
    // ---------------------------------------------------------------------------

    it('should warn when a tileset has a source property (external tileset)', function ()
    {
        var json = {
            version: 1,
            tilesets: [
                { source: 'external.tsx', firstgid: 1 }
            ]
        };

        ParseTilesets(json);

        expect(warnSpy).toHaveBeenCalledWith(
            'External tilesets unsupported. Use Embed Tileset and re-export'
        );
    });

    it('should not add anything to tilesets or imageCollections for an external tileset', function ()
    {
        var json = {
            version: 1,
            tilesets: [
                { source: 'external.tsx', firstgid: 1 }
            ]
        };

        var result = ParseTilesets(json);

        expect(result.tilesets).toHaveLength(0);
        expect(result.imageCollections).toHaveLength(0);
    });

    // ---------------------------------------------------------------------------
    // Image-based tileset (Tileset instances)
    // ---------------------------------------------------------------------------

    it('should create a Tileset instance for an image-based tileset entry', function ()
    {
        var json = {
            version: 1,
            tilesets: [ makeImageTilesetJSON() ]
        };

        var result = ParseTilesets(json);

        expect(result.tilesets).toHaveLength(1);
        expect(result.imageCollections).toHaveLength(0);
    });

    it('should set the correct name on a created Tileset', function ()
    {
        var json = {
            version: 1,
            tilesets: [ makeImageTilesetJSON({ name: 'MyTiles' }) ]
        };

        var result = ParseTilesets(json);

        expect(result.tilesets[0].name).toBe('MyTiles');
    });

    it('should set the correct firstgid on a created Tileset', function ()
    {
        var json = {
            version: 1,
            tilesets: [ makeImageTilesetJSON({ firstgid: 5 }) ]
        };

        var result = ParseTilesets(json);

        expect(result.tilesets[0].firstgid).toBe(5);
    });

    it('should set correct tile dimensions on a created Tileset', function ()
    {
        var json = {
            version: 1,
            tilesets: [ makeImageTilesetJSON({ tilewidth: 16, tileheight: 16 }) ]
        };

        var result = ParseTilesets(json);

        expect(result.tilesets[0].tileWidth).toBe(16);
        expect(result.tilesets[0].tileHeight).toBe(16);
    });

    it('should set correct margin and spacing on a created Tileset', function ()
    {
        var json = {
            version: 1,
            tilesets: [ makeImageTilesetJSON({ margin: 2, spacing: 4 }) ]
        };

        var result = ParseTilesets(json);

        expect(result.tilesets[0].tileMargin).toBe(2);
        expect(result.tilesets[0].tileSpacing).toBe(4);
    });

    it('should call updateTileData with imagewidth and imageheight', function ()
    {
        var json = {
            version: 1,
            tilesets: [ makeImageTilesetJSON({ imagewidth: 64, imageheight: 64, tilewidth: 32, tileheight: 32 }) ]
        };

        var result = ParseTilesets(json);
        var tileset = result.tilesets[0];

        // 64px wide / 32px tile = 2 columns, 2 rows
        expect(tileset.columns).toBe(2);
        expect(tileset.rows).toBe(2);
        expect(tileset.total).toBe(4);
    });

    // ---------------------------------------------------------------------------
    // lastgid propagation
    // ---------------------------------------------------------------------------

    it('should set lastgid on the previous raw set object when multiple tilesets are present', function ()
    {
        var first = makeImageTilesetJSON({ name: 'First', firstgid: 1 });
        var second = makeImageTilesetJSON({ name: 'Second', firstgid: 10 });

        var json = { version: 1, tilesets: [ first, second ] };

        ParseTilesets(json);

        // lastgid is written back onto the raw JSON set objects, not the Tileset instances
        expect(first.lastgid).toBe(9);
    });

    it('should not set lastgid when there is only one tileset', function ()
    {
        var only = makeImageTilesetJSON({ firstgid: 1 });

        var json = { version: 1, tilesets: [ only ] };

        ParseTilesets(json);

        expect(only.lastgid).toBeUndefined();
    });

    it('should set lastgid correctly across three tilesets', function ()
    {
        var setA = makeImageTilesetJSON({ name: 'A', firstgid: 1 });
        var setB = makeImageTilesetJSON({ name: 'B', firstgid: 11 });
        var setC = makeImageTilesetJSON({ name: 'C', firstgid: 21 });

        var json = { version: 1, tilesets: [ setA, setB, setC ] };

        ParseTilesets(json);

        expect(setA.lastgid).toBe(10);
        expect(setB.lastgid).toBe(20);
        expect(setC.lastgid).toBeUndefined();
    });

    // ---------------------------------------------------------------------------
    // Tiled v1 format (json.version <= 1)
    // ---------------------------------------------------------------------------

    it('should assign tileproperties directly in Tiled v1 format', function ()
    {
        var tileProps = { '0': { collides: true }, '1': { damage: 5 } };

        var json = {
            version: 1,
            tilesets: [
                makeImageTilesetJSON({ tileproperties: tileProps })
            ]
        };

        var result = ParseTilesets(json);

        expect(result.tilesets[0].tileProperties).toBe(tileProps);
    });

    it('should assign tiles data directly in Tiled v1 format', function ()
    {
        var tileData = { '0': { terrain: [0, 1, 0, 1] } };

        var json = {
            version: 1,
            tilesets: [
                makeImageTilesetJSON({ tiles: tileData })
            ]
        };

        var result = ParseTilesets(json);

        expect(result.tilesets[0].tileData).toBe(tileData);
    });

    it('should parse objectgroup objects in Tiled v1 tile data', function ()
    {
        var json = {
            version: 1,
            tilesets: [
                makeImageTilesetJSON({
                    tiles: {
                        '0': {
                            objectgroup: {
                                objects: [
                                    { id: 1, name: 'collision', type: '', x: 0, y: 0, width: 32, height: 32, rotation: 0, visible: true, properties: [] }
                                ]
                            }
                        }
                    }
                })
            ]
        };

        var result = ParseTilesets(json);
        var obj = result.tilesets[0].tileData['0'].objectgroup.objects[0];

        expect(obj).toBeDefined();
        expect(obj.id).toBe(1);
        expect(obj.name).toBe('collision');
    });

    it('should not set tileProperties when tileproperties is absent in Tiled v1', function ()
    {
        var json = {
            version: 1,
            tilesets: [ makeImageTilesetJSON() ]
        };

        var result = ParseTilesets(json);

        // Default from Tileset constructor is {}
        expect(result.tilesets[0].tileProperties).toEqual({});
    });

    // ---------------------------------------------------------------------------
    // Tiled v2+ format (json.version > 1)
    // ---------------------------------------------------------------------------

    it('should convert tile properties array to keyed object in Tiled v2 format', function ()
    {
        var json = {
            version: 2,
            tilesets: [
                makeImageTilesetJSON({
                    tiles: [
                        {
                            id: 0,
                            properties: [
                                { name: 'collides', value: true },
                                { name: 'damage', value: 10 }
                            ]
                        }
                    ]
                })
            ]
        };

        var result = ParseTilesets(json);

        expect(result.tilesets[0].tileProperties[0]).toEqual({ collides: true, damage: 10 });
    });

    it('should store animation data on tiles in Tiled v2 format', function ()
    {
        var animation = [
            { tileid: 0, duration: 100 },
            { tileid: 1, duration: 200 }
        ];

        var json = {
            version: 2,
            tilesets: [
                makeImageTilesetJSON({
                    tiles: [
                        { id: 0, animation: animation }
                    ]
                })
            ]
        };

        var result = ParseTilesets(json);

        expect(result.tilesets[0].tileData[0].animation).toBeDefined();
        expect(result.tilesets[0].tileData[0].animation).toHaveLength(2);
    });

    it('should calculate animation startTime and animationDuration in Tiled v2 format', function ()
    {
        var json = {
            version: 2,
            tilesets: [
                makeImageTilesetJSON({
                    tiles: [
                        {
                            id: 0,
                            animation: [
                                { tileid: 0, duration: 100 },
                                { tileid: 1, duration: 200 },
                                { tileid: 2, duration: 150 }
                            ]
                        }
                    ]
                })
            ]
        };

        var result = ParseTilesets(json);
        var tileData = result.tilesets[0].tileData[0];

        expect(tileData.animation[0].startTime).toBe(0);
        expect(tileData.animation[1].startTime).toBe(100);
        expect(tileData.animation[2].startTime).toBe(300);
        expect(tileData.animationDuration).toBe(450);
    });

    it('should store tile type in Tiled v2 format', function ()
    {
        var json = {
            version: 2,
            tilesets: [
                makeImageTilesetJSON({
                    tiles: [
                        { id: 3, type: 'SpawnPoint' }
                    ]
                })
            ]
        };

        var result = ParseTilesets(json);

        expect(result.tilesets[0].tileData[3].type).toBe('SpawnPoint');
    });

    it('should store objectgroup on tile data in Tiled v2 format', function ()
    {
        var json = {
            version: 2,
            tilesets: [
                makeImageTilesetJSON({
                    tiles: [
                        {
                            id: 2,
                            objectgroup: {
                                objects: [
                                    { id: 1, name: 'hit', type: '', x: 0, y: 0, width: 16, height: 16, rotation: 0, visible: true, properties: [] }
                                ]
                            }
                        }
                    ]
                })
            ]
        };

        var result = ParseTilesets(json);

        expect(result.tilesets[0].tileData[2].objectgroup).toBeDefined();
        expect(result.tilesets[0].tileData[2].objectgroup.objects).toHaveLength(1);
    });

    it('should parse objectgroup objects through ParseObject in Tiled v2 format', function ()
    {
        var json = {
            version: 2,
            tilesets: [
                makeImageTilesetJSON({
                    tiles: [
                        {
                            id: 0,
                            objectgroup: {
                                objects: [
                                    { id: 5, name: 'zone', type: '', x: 4, y: 8, width: 20, height: 20, rotation: 0, visible: true, properties: [] }
                                ]
                            }
                        }
                    ]
                })
            ]
        };

        var result = ParseTilesets(json);
        var obj = result.tilesets[0].tileData[0].objectgroup.objects[0];

        expect(obj.id).toBe(5);
        expect(obj.name).toBe('zone');
        expect(obj.x).toBe(4);
        expect(obj.y).toBe(8);
    });

    it('should not set tileData or tileProperties when tiles array is absent in Tiled v2', function ()
    {
        var json = {
            version: 2,
            tilesets: [ makeImageTilesetJSON() ]
        };

        var result = ParseTilesets(json);

        // Should remain at default empty objects from Tileset constructor
        expect(result.tilesets[0].tileData).toEqual({});
        expect(result.tilesets[0].tileProperties).toEqual({});
    });

    it('should handle a tile with multiple data fields simultaneously in Tiled v2', function ()
    {
        var json = {
            version: 2,
            tilesets: [
                makeImageTilesetJSON({
                    tiles: [
                        {
                            id: 0,
                            properties: [{ name: 'key', value: 'val' }],
                            animation: [{ tileid: 0, duration: 50 }],
                            type: 'Door'
                        }
                    ]
                })
            ]
        };

        var result = ParseTilesets(json);
        var td = result.tilesets[0].tileData;
        var tp = result.tilesets[0].tileProperties;

        expect(td[0].animation).toBeDefined();
        expect(td[0].type).toBe('Door');
        expect(tp[0]).toEqual({ key: 'val' });
    });

    // ---------------------------------------------------------------------------
    // ImageCollection
    // ---------------------------------------------------------------------------

    it('should create an ImageCollection for a tileset without an image property', function ()
    {
        var json = {
            version: 1,
            tilesets: [ makeCollectionTilesetJSON() ]
        };

        var result = ParseTilesets(json);

        expect(result.imageCollections).toHaveLength(1);
        expect(result.tilesets).toHaveLength(0);
    });

    it('should set the correct name on an ImageCollection', function ()
    {
        var json = {
            version: 1,
            tilesets: [ makeCollectionTilesetJSON({ name: 'MyCollection' }) ]
        };

        var result = ParseTilesets(json);

        expect(result.imageCollections[0].name).toBe('MyCollection');
    });

    it('should set the correct firstgid on an ImageCollection', function ()
    {
        var json = {
            version: 1,
            tilesets: [ makeCollectionTilesetJSON({ firstgid: 7 }) ]
        };

        var result = ParseTilesets(json);

        expect(result.imageCollections[0].firstgid).toBe(7);
    });

    it('should add all images to an ImageCollection', function ()
    {
        var json = {
            version: 1,
            tilesets: [
                makeCollectionTilesetJSON({
                    firstgid: 1,
                    tiles: [
                        { id: 0, image: 'a.png', imagewidth: 32, imageheight: 32 },
                        { id: 1, image: 'b.png', imagewidth: 64, imageheight: 64 },
                        { id: 2, image: 'c.png', imagewidth: 16, imageheight: 16 }
                    ]
                })
            ]
        };

        var result = ParseTilesets(json);

        expect(result.imageCollections[0].images).toHaveLength(3);
    });

    it('should compute the correct maxId on an ImageCollection', function ()
    {
        var json = {
            version: 1,
            tilesets: [
                makeCollectionTilesetJSON({
                    tiles: [
                        { id: 0, image: 'a.png', imagewidth: 32, imageheight: 32 },
                        { id: 5, image: 'b.png', imagewidth: 32, imageheight: 32 },
                        { id: 3, image: 'c.png', imagewidth: 32, imageheight: 32 }
                    ]
                })
            ]
        };

        var result = ParseTilesets(json);

        expect(result.imageCollections[0].maxId).toBe(5);
    });

    it('should add images with gid equal to firstgid plus tileId', function ()
    {
        var json = {
            version: 1,
            tilesets: [
                makeCollectionTilesetJSON({
                    firstgid: 10,
                    tiles: [
                        { id: 0, image: 'first.png', imagewidth: 32, imageheight: 32 },
                        { id: 2, image: 'third.png', imagewidth: 32, imageheight: 32 }
                    ]
                })
            ]
        };

        var result = ParseTilesets(json);
        var images = result.imageCollections[0].images;

        // GID = firstgid + id
        expect(images[0].gid).toBe(10);
        expect(images[1].gid).toBe(12);
    });

    // ---------------------------------------------------------------------------
    // Mixed tilesets
    // ---------------------------------------------------------------------------

    it('should handle a mix of image tilesets and image collections', function ()
    {
        var json = {
            version: 1,
            tilesets: [
                makeImageTilesetJSON({ name: 'Sheet', firstgid: 1 }),
                makeCollectionTilesetJSON({ name: 'Collection', firstgid: 100 })
            ]
        };

        var result = ParseTilesets(json);

        expect(result.tilesets).toHaveLength(1);
        expect(result.imageCollections).toHaveLength(1);
        expect(result.tilesets[0].name).toBe('Sheet');
        expect(result.imageCollections[0].name).toBe('Collection');
    });

    it('should set lastgid on the raw set object at the image tileset to collection boundary', function ()
    {
        var sheet = makeImageTilesetJSON({ name: 'Sheet', firstgid: 1 });
        var collection = makeCollectionTilesetJSON({ name: 'Collection', firstgid: 50 });

        var json = { version: 1, tilesets: [ sheet, collection ] };

        ParseTilesets(json);

        expect(sheet.lastgid).toBe(49);
    });
});
