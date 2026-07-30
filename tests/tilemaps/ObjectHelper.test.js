var ObjectHelper = require('../../src/tilemaps/ObjectHelper');

describe('ObjectHelper', function ()
{
    describe('constructor', function ()
    {
        it('should create an instance with an empty gids array when no tilesets provided', function ()
        {
            var helper = new ObjectHelper();
            expect(Array.isArray(helper.gids)).toBe(true);
            expect(helper.gids.length).toBe(0);
        });

        it('should create an instance when undefined is passed as tilesets', function ()
        {
            var helper = new ObjectHelper(undefined);
            expect(Array.isArray(helper.gids)).toBe(true);
        });

        it('should populate gids from a single tileset', function ()
        {
            var tileset = { firstgid: 1, total: 3 };
            var helper = new ObjectHelper([ tileset ]);
            expect(helper.gids[1]).toBe(tileset);
            expect(helper.gids[2]).toBe(tileset);
            expect(helper.gids[3]).toBe(tileset);
        });

        it('should populate gids from multiple tilesets without overlap', function ()
        {
            var tilesetA = { firstgid: 1, total: 2 };
            var tilesetB = { firstgid: 10, total: 2 };
            var helper = new ObjectHelper([ tilesetA, tilesetB ]);
            expect(helper.gids[1]).toBe(tilesetA);
            expect(helper.gids[2]).toBe(tilesetA);
            expect(helper.gids[10]).toBe(tilesetB);
            expect(helper.gids[11]).toBe(tilesetB);
        });

        it('should respect firstgid offset when mapping tileset entries', function ()
        {
            var tileset = { firstgid: 5, total: 2 };
            var helper = new ObjectHelper([ tileset ]);
            expect(helper.gids[4]).toBeUndefined();
            expect(helper.gids[5]).toBe(tileset);
            expect(helper.gids[6]).toBe(tileset);
            expect(helper.gids[7]).toBeUndefined();
        });

        it('should set _gids to the same array as gids', function ()
        {
            var helper = new ObjectHelper();
            expect(helper._gids).toBe(helper.gids);
        });
    });

    describe('enabled', function ()
    {
        it('should return true when gids is a non-empty array', function ()
        {
            var tileset = { firstgid: 1, total: 1 };
            var helper = new ObjectHelper([ tileset ]);
            expect(helper.enabled).toBe(true);
        });

        it('should return true when gids is an empty array (truthy)', function ()
        {
            var helper = new ObjectHelper();
            expect(helper.enabled).toBe(true);
        });

        it('should return false when gids is undefined', function ()
        {
            var helper = new ObjectHelper();
            helper.gids = undefined;
            expect(helper.enabled).toBe(false);
        });

        it('should set gids to undefined when disabled', function ()
        {
            var helper = new ObjectHelper();
            helper.enabled = false;
            expect(helper.gids).toBeUndefined();
        });

        it('should restore gids from _gids when re-enabled', function ()
        {
            var tileset = { firstgid: 1, total: 2 };
            var helper = new ObjectHelper([ tileset ]);
            var original = helper._gids;
            helper.enabled = false;
            helper.enabled = true;
            expect(helper.gids).toBe(original);
        });

        it('should disable then re-enable correctly', function ()
        {
            var helper = new ObjectHelper();
            helper.enabled = false;
            expect(helper.enabled).toBe(false);
            helper.enabled = true;
            expect(helper.enabled).toBe(true);
        });
    });

    describe('getTypeIncludingTile', function ()
    {
        it('should return the object type when it is a non-empty string', function ()
        {
            var helper = new ObjectHelper();
            var obj = { type: 'enemy' };
            expect(helper.getTypeIncludingTile(obj)).toBe('enemy');
        });

        it('should not return the object type when it is an empty string', function ()
        {
            var helper = new ObjectHelper();
            var obj = { type: '', gid: undefined };
            expect(helper.getTypeIncludingTile(obj)).toBeUndefined();
        });

        it('should return undefined when type is undefined and gid is undefined', function ()
        {
            var helper = new ObjectHelper();
            var obj = { type: undefined, gid: undefined };
            expect(helper.getTypeIncludingTile(obj)).toBeUndefined();
        });

        it('should return undefined when gids is disabled', function ()
        {
            var helper = new ObjectHelper();
            helper.enabled = false;
            var obj = { gid: 1 };
            expect(helper.getTypeIncludingTile(obj)).toBeUndefined();
        });

        it('should return undefined when gid has no matching tileset entry', function ()
        {
            var helper = new ObjectHelper();
            var obj = { gid: 99 };
            expect(helper.getTypeIncludingTile(obj)).toBeUndefined();
        });

        it('should return undefined when tileset has no tile data for the gid', function ()
        {
            var tileset = {
                firstgid: 1,
                total: 1,
                getTileData: function () { return null; }
            };
            var helper = new ObjectHelper([ tileset ]);
            var obj = { gid: 1 };
            expect(helper.getTypeIncludingTile(obj)).toBeUndefined();
        });

        it('should return tile type from tileset when obj type is empty', function ()
        {
            var tileset = {
                firstgid: 1,
                total: 1,
                getTileData: function () { return { type: 'tileEnemy' }; }
            };
            var helper = new ObjectHelper([ tileset ]);
            var obj = { type: '', gid: 1 };
            expect(helper.getTypeIncludingTile(obj)).toBe('tileEnemy');
        });

        it('should return tile type from tileset when obj type is undefined', function ()
        {
            var tileset = {
                firstgid: 1,
                total: 1,
                getTileData: function () { return { type: 'platform' }; }
            };
            var helper = new ObjectHelper([ tileset ]);
            var obj = { gid: 1 };
            expect(helper.getTypeIncludingTile(obj)).toBe('platform');
        });

        it('should prefer obj.type over tile type', function ()
        {
            var tileset = {
                firstgid: 1,
                total: 1,
                getTileData: function () { return { type: 'tileType' }; }
            };
            var helper = new ObjectHelper([ tileset ]);
            var obj = { type: 'objectType', gid: 1 };
            expect(helper.getTypeIncludingTile(obj)).toBe('objectType');
        });

        it('should return undefined when tileData exists but has no type', function ()
        {
            var tileset = {
                firstgid: 1,
                total: 1,
                getTileData: function () { return {}; }
            };
            var helper = new ObjectHelper([ tileset ]);
            var obj = { gid: 1 };
            expect(helper.getTypeIncludingTile(obj)).toBeUndefined();
        });
    });

    describe('setTextureAndFrame', function ()
    {
        function makeSpriteWithTexture (frameResult)
        {
            return {
                _key: null,
                _frame: null,
                setTexture: function (k, f)
                {
                    this._key = k;
                    this._frame = f;
                },
                scene: {
                    textures: {
                        getFrame: function () { return frameResult; }
                    }
                }
            };
        }

        it('should call setTexture with the provided key and frame', function ()
        {
            var helper = new ObjectHelper();
            var sprite = makeSpriteWithTexture(true);
            helper.setTextureAndFrame(sprite, 'myTexture', 0, {});
            expect(sprite._key).toBe('myTexture');
            expect(sprite._frame).toBe(0);
        });

        it('should call setTexture with string frame', function ()
        {
            var helper = new ObjectHelper();
            var sprite = makeSpriteWithTexture(true);
            helper.setTextureAndFrame(sprite, 'atlas', 'hero', {});
            expect(sprite._key).toBe('atlas');
            expect(sprite._frame).toBe('hero');
        });

        it('should use tileset image key when key is null and gids is enabled', function ()
        {
            var tileset = {
                firstgid: 1,
                total: 1,
                image: { key: 'tilesetImage' }
            };
            var helper = new ObjectHelper([ tileset ]);
            var sprite = makeSpriteWithTexture({ name: 'valid' });
            helper.setTextureAndFrame(sprite, null, null, { gid: 1 });
            expect(sprite._key).toBe('tilesetImage');
        });

        it('should compute frame as gid minus firstgid when frame is null', function ()
        {
            var tileset = {
                firstgid: 1,
                total: 3,
                image: { key: 'sheet' }
            };
            var helper = new ObjectHelper([ tileset ]);
            var sprite = makeSpriteWithTexture({ name: 'valid' });
            helper.setTextureAndFrame(sprite, null, null, { gid: 3 });
            expect(sprite._frame).toBe(2);
        });

        it('should null out key and frame when frame cannot be found in textures', function ()
        {
            var tileset = {
                firstgid: 1,
                total: 1,
                image: { key: 'sheet' }
            };
            var helper = new ObjectHelper([ tileset ]);
            var sprite = makeSpriteWithTexture(null);
            helper.setTextureAndFrame(sprite, null, null, { gid: 1 });
            expect(sprite._key).toBeNull();
            expect(sprite._frame).toBeNull();
        });

        it('should skip gid fallback when key is not null', function ()
        {
            var tileset = {
                firstgid: 1,
                total: 1,
                image: { key: 'sheet' }
            };
            var helper = new ObjectHelper([ tileset ]);
            var sprite = makeSpriteWithTexture(true);
            helper.setTextureAndFrame(sprite, 'explicitKey', null, { gid: 1 });
            expect(sprite._key).toBe('explicitKey');
        });

        it('should skip gid fallback when gids is disabled', function ()
        {
            var tileset = {
                firstgid: 1,
                total: 1,
                image: { key: 'sheet' }
            };
            var helper = new ObjectHelper([ tileset ]);
            helper.enabled = false;
            var sprite = makeSpriteWithTexture(true);
            helper.setTextureAndFrame(sprite, null, null, { gid: 1 });
            expect(sprite._key).toBeNull();
        });

        it('should skip gid fallback when obj has no gid', function ()
        {
            var tileset = {
                firstgid: 1,
                total: 1,
                image: { key: 'sheet' }
            };
            var helper = new ObjectHelper([ tileset ]);
            var sprite = makeSpriteWithTexture(true);
            helper.setTextureAndFrame(sprite, null, null, {});
            expect(sprite._key).toBeNull();
        });

        it('should skip gid fallback when gid has no matching tileset', function ()
        {
            var helper = new ObjectHelper();
            var sprite = makeSpriteWithTexture(true);
            helper.setTextureAndFrame(sprite, null, null, { gid: 999 });
            expect(sprite._key).toBeNull();
        });
    });

    describe('setPropertiesFromTiledObject', function ()
    {
        function makeSprite ()
        {
            return {
                _data: {},
                setData: function (key, value)
                {
                    this._data[key] = value;
                }
            };
        }

        it('should do nothing when obj has no properties and no gid', function ()
        {
            var helper = new ObjectHelper();
            var sprite = makeSprite();
            helper.setPropertiesFromTiledObject(sprite, {});
            expect(Object.keys(sprite._data).length).toBe(0);
        });

        it('should apply obj.properties as an array of name/value pairs via setData', function ()
        {
            var helper = new ObjectHelper();
            var sprite = makeSprite();
            var obj = {
                properties: [
                    { name: 'speed', value: 100 },
                    { name: 'health', value: 50 }
                ]
            };
            helper.setPropertiesFromTiledObject(sprite, obj);
            expect(sprite._data['speed']).toBe(100);
            expect(sprite._data['health']).toBe(50);
        });

        it('should apply obj.properties as a plain object via setData', function ()
        {
            var helper = new ObjectHelper();
            var sprite = makeSprite();
            var obj = {
                properties: { damage: 25, visible: true }
            };
            helper.setPropertiesFromTiledObject(sprite, obj);
            expect(sprite._data['damage']).toBe(25);
            expect(sprite._data['visible']).toBe(true);
        });

        it('should set sprite property directly when it already exists on the sprite', function ()
        {
            var helper = new ObjectHelper();
            var sprite = makeSprite();
            sprite.speed = 0;
            var obj = {
                properties: [ { name: 'speed', value: 200 } ]
            };
            helper.setPropertiesFromTiledObject(sprite, obj);
            expect(sprite.speed).toBe(200);
            expect(sprite._data['speed']).toBeUndefined();
        });

        it('should apply tile properties from tileset when gid is present', function ()
        {
            var tileset = {
                firstgid: 1,
                total: 1,
                getTileProperties: function () { return [ { name: 'friction', value: 0.5 } ]; }
            };
            var helper = new ObjectHelper([ tileset ]);
            var sprite = makeSprite();
            var obj = { gid: 1 };
            helper.setPropertiesFromTiledObject(sprite, obj);
            expect(sprite._data['friction']).toBeCloseTo(0.5);
        });

        it('should apply both tile properties and obj.properties, with obj.properties last', function ()
        {
            var tileset = {
                firstgid: 1,
                total: 1,
                getTileProperties: function () { return { tileKey: 'tileVal' }; }
            };
            var helper = new ObjectHelper([ tileset ]);
            var sprite = makeSprite();
            var obj = {
                gid: 1,
                properties: { objKey: 'objVal' }
            };
            helper.setPropertiesFromTiledObject(sprite, obj);
            expect(sprite._data['tileKey']).toBe('tileVal');
            expect(sprite._data['objKey']).toBe('objVal');
        });

        it('should skip tileset properties when gids is disabled', function ()
        {
            var tileset = {
                firstgid: 1,
                total: 1,
                getTileProperties: function () { return { tileKey: 'tileVal' }; }
            };
            var helper = new ObjectHelper([ tileset ]);
            helper.enabled = false;
            var sprite = makeSprite();
            var obj = { gid: 1, properties: { objKey: 'objVal' } };
            helper.setPropertiesFromTiledObject(sprite, obj);
            expect(sprite._data['tileKey']).toBeUndefined();
            expect(sprite._data['objKey']).toBe('objVal');
        });

        it('should handle null tile properties gracefully', function ()
        {
            var tileset = {
                firstgid: 1,
                total: 1,
                getTileProperties: function () { return null; }
            };
            var helper = new ObjectHelper([ tileset ]);
            var sprite = makeSprite();
            var obj = { gid: 1 };
            helper.setPropertiesFromTiledObject(sprite, obj);
            expect(Object.keys(sprite._data).length).toBe(0);
        });

        it('should handle null obj.properties gracefully', function ()
        {
            var helper = new ObjectHelper();
            var sprite = makeSprite();
            var obj = { properties: null };
            helper.setPropertiesFromTiledObject(sprite, obj);
            expect(Object.keys(sprite._data).length).toBe(0);
        });

        it('should handle undefined obj.properties gracefully', function ()
        {
            var helper = new ObjectHelper();
            var sprite = makeSprite();
            var obj = {};
            helper.setPropertiesFromTiledObject(sprite, obj);
            expect(Object.keys(sprite._data).length).toBe(0);
        });

        it('should not apply tileset properties when gid has no matching tileset', function ()
        {
            var helper = new ObjectHelper();
            var sprite = makeSprite();
            var obj = { gid: 999 };
            helper.setPropertiesFromTiledObject(sprite, obj);
            expect(Object.keys(sprite._data).length).toBe(0);
        });
    });
});
