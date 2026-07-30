var ParseObjectLayers = require('../../../../src/tilemaps/parsers/tiled/ParseObjectLayers');
var ObjectLayer = require('../../../../src/tilemaps/mapdata/ObjectLayer');

describe('Phaser.Tilemaps.Parsers.Tiled.ParseObjectLayers', function ()
{
    function makeJson (layers)
    {
        return {
            layers: layers,
            tilewidth: 32,
            tileheight: 32
        };
    }

    function makeObjectLayer (name, objects, overrides)
    {
        var layer = {
            type: 'objectgroup',
            name: name,
            opacity: 1,
            visible: true,
            objects: objects || []
        };
        if (overrides)
        {
            for (var k in overrides)
            {
                layer[k] = overrides[k];
            }
        }
        return layer;
    }

    function makeTileLayer (name)
    {
        return {
            type: 'tilelayer',
            name: name,
            opacity: 1,
            visible: true
        };
    }

    function makeGroupLayer (name, childLayers, overrides)
    {
        var layer = {
            type: 'group',
            name: name,
            opacity: 1,
            visible: true,
            x: 0,
            y: 0,
            layers: childLayers || []
        };
        if (overrides)
        {
            for (var k in overrides)
            {
                layer[k] = overrides[k];
            }
        }
        return layer;
    }

    function makeObject (id, x, y)
    {
        return {
            id: id,
            name: 'obj' + id,
            type: '',
            rotation: 0,
            properties: {},
            visible: true,
            x: x || 0,
            y: y || 0,
            width: 32,
            height: 32
        };
    }

    // ------------------------------------------------------------------
    // Empty / trivial inputs
    // ------------------------------------------------------------------

    it('should return an empty array when there are no layers', function ()
    {
        var result = ParseObjectLayers(makeJson([]));
        expect(result).toEqual([]);
    });

    it('should return an empty array when only tile layers are present', function ()
    {
        var json = makeJson([
            makeTileLayer('tiles1'),
            makeTileLayer('tiles2')
        ]);
        var result = ParseObjectLayers(json);
        expect(result).toEqual([]);
    });

    // ------------------------------------------------------------------
    // Single object layer
    // ------------------------------------------------------------------

    it('should return one ObjectLayer for a single objectgroup layer', function ()
    {
        var json = makeJson([makeObjectLayer('Objects')]);
        var result = ParseObjectLayers(json);
        expect(result.length).toBe(1);
        expect(result[0]).toBeInstanceOf(ObjectLayer);
    });

    it('should set the name of the ObjectLayer from the layer data', function ()
    {
        var json = makeJson([makeObjectLayer('Spawns')]);
        var result = ParseObjectLayers(json);
        expect(result[0].name).toBe('Spawns');
    });

    it('should preserve opacity from the layer', function ()
    {
        var json = makeJson([makeObjectLayer('Objects', [], { opacity: 0.5 })]);
        var result = ParseObjectLayers(json);
        expect(result[0].opacity).toBeCloseTo(0.5);
    });

    it('should preserve visibility from the layer', function ()
    {
        var json = makeJson([makeObjectLayer('Objects', [], { visible: false })]);
        var result = ParseObjectLayers(json);
        expect(result[0].visible).toBe(false);
    });

    // ------------------------------------------------------------------
    // Multiple object layers
    // ------------------------------------------------------------------

    it('should return one entry per objectgroup layer', function ()
    {
        var json = makeJson([
            makeObjectLayer('LayerA'),
            makeTileLayer('Tiles'),
            makeObjectLayer('LayerB')
        ]);
        var result = ParseObjectLayers(json);
        expect(result.length).toBe(2);
    });

    it('should preserve order of object layers as they appear', function ()
    {
        var json = makeJson([
            makeObjectLayer('First'),
            makeObjectLayer('Second'),
            makeObjectLayer('Third')
        ]);
        var result = ParseObjectLayers(json);
        expect(result[0].name).toBe('First');
        expect(result[1].name).toBe('Second');
        expect(result[2].name).toBe('Third');
    });

    // ------------------------------------------------------------------
    // Objects inside layers
    // ------------------------------------------------------------------

    it('should parse objects within an object layer', function ()
    {
        var json = makeJson([makeObjectLayer('Objects', [makeObject(1, 10, 20)])]);
        var result = ParseObjectLayers(json);
        expect(result[0].objects.length).toBe(1);
        expect(result[0].objects[0].id).toBe(1);
    });

    it('should apply no offset to objects when layer has no offset properties', function ()
    {
        var json = makeJson([makeObjectLayer('Objects', [makeObject(1, 10, 20)])]);
        var result = ParseObjectLayers(json);
        var obj = result[0].objects[0];
        expect(obj.x).toBe(10);
        expect(obj.y).toBe(20);
    });

    it('should apply offsetx and offsety to parsed object coordinates', function ()
    {
        var layer = makeObjectLayer('Objects', [makeObject(1, 10, 20)], { offsetx: 5, offsety: 15 });
        var json = makeJson([layer]);
        var result = ParseObjectLayers(json);
        var obj = result[0].objects[0];
        expect(obj.x).toBe(15);
        expect(obj.y).toBe(35);
    });

    it('should parse multiple objects in a single layer', function ()
    {
        var json = makeJson([
            makeObjectLayer('Objects', [makeObject(1, 0, 0), makeObject(2, 50, 50), makeObject(3, 100, 100)])
        ]);
        var result = ParseObjectLayers(json);
        expect(result[0].objects.length).toBe(3);
    });

    // ------------------------------------------------------------------
    // Group layers (nested)
    // ------------------------------------------------------------------

    it('should find an objectgroup nested inside a group layer', function ()
    {
        var json = makeJson([
            makeGroupLayer('Group', [makeObjectLayer('Objects')])
        ]);
        var result = ParseObjectLayers(json);
        expect(result.length).toBe(1);
    });

    it('should prefix the object layer name with the parent group name', function ()
    {
        var json = makeJson([
            makeGroupLayer('Group', [makeObjectLayer('Objects')])
        ]);
        var result = ParseObjectLayers(json);
        expect(result[0].name).toBe('Group/Objects');
    });

    it('should prefix names through multiple levels of nesting', function ()
    {
        var json = makeJson([
            makeGroupLayer('Outer', [
                makeGroupLayer('Inner', [makeObjectLayer('Objects')])
            ])
        ]);
        var result = ParseObjectLayers(json);
        expect(result[0].name).toBe('Outer/Inner/Objects');
    });

    it('should multiply opacity through nested group layers', function ()
    {
        var json = makeJson([
            makeGroupLayer('Group', [makeObjectLayer('Objects', [], { opacity: 0.5 })], { opacity: 0.5 })
        ]);
        var result = ParseObjectLayers(json);
        expect(result[0].opacity).toBeCloseTo(0.25);
    });

    it('should set visibility to false when the parent group is hidden', function ()
    {
        var json = makeJson([
            makeGroupLayer('Group', [makeObjectLayer('Objects', [], { visible: true })], { visible: false })
        ]);
        var result = ParseObjectLayers(json);
        expect(result[0].visible).toBe(false);
    });

    it('should set visibility to false when the child layer is hidden', function ()
    {
        var json = makeJson([
            makeGroupLayer('Group', [makeObjectLayer('Objects', [], { visible: false })], { visible: true })
        ]);
        var result = ParseObjectLayers(json);
        expect(result[0].visible).toBe(false);
    });

    it('should keep visibility true when both group and child are visible', function ()
    {
        var json = makeJson([
            makeGroupLayer('Group', [makeObjectLayer('Objects', [], { visible: true })], { visible: true })
        ]);
        var result = ParseObjectLayers(json);
        expect(result[0].visible).toBe(true);
    });

    it('should collect object layers from multiple groups at the same level', function ()
    {
        var json = makeJson([
            makeGroupLayer('GroupA', [makeObjectLayer('A')]),
            makeGroupLayer('GroupB', [makeObjectLayer('B')])
        ]);
        var result = ParseObjectLayers(json);
        expect(result.length).toBe(2);
        expect(result[0].name).toBe('GroupA/A');
        expect(result[1].name).toBe('GroupB/B');
    });

    it('should skip non-objectgroup layers inside a group', function ()
    {
        var json = makeJson([
            makeGroupLayer('Group', [
                makeTileLayer('Tiles'),
                makeObjectLayer('Objects')
            ])
        ]);
        var result = ParseObjectLayers(json);
        expect(result.length).toBe(1);
        expect(result[0].name).toBe('Group/Objects');
    });

    it('should return empty array when group contains only tile layers', function ()
    {
        var json = makeJson([
            makeGroupLayer('Group', [makeTileLayer('Tiles')])
        ]);
        var result = ParseObjectLayers(json);
        expect(result).toEqual([]);
    });

    it('should handle an empty group layer without error', function ()
    {
        var json = makeJson([makeGroupLayer('EmptyGroup', [])]);
        var result = ParseObjectLayers(json);
        expect(result).toEqual([]);
    });

    // ------------------------------------------------------------------
    // Root-level opacity / visibility inheritance (opacity = 1, visible = true)
    // ------------------------------------------------------------------

    it('should not alter opacity when root group opacity is 1', function ()
    {
        var json = makeJson([makeObjectLayer('Objects', [], { opacity: 0.8 })]);
        var result = ParseObjectLayers(json);
        expect(result[0].opacity).toBeCloseTo(0.8);
    });

    it('should result in zero opacity when layer opacity is 0', function ()
    {
        var json = makeJson([makeObjectLayer('Objects', [], { opacity: 0 })]);
        var result = ParseObjectLayers(json);
        expect(result[0].opacity).toBeCloseTo(0);
    });

    // ------------------------------------------------------------------
    // Return type
    // ------------------------------------------------------------------

    it('should return an array', function ()
    {
        var result = ParseObjectLayers(makeJson([]));
        expect(Array.isArray(result)).toBe(true);
    });

    it('should return ObjectLayer instances', function ()
    {
        var json = makeJson([makeObjectLayer('Objects')]);
        var result = ParseObjectLayers(json);
        expect(result[0]).toBeInstanceOf(ObjectLayer);
    });

    it('should set the objects array on each ObjectLayer', function ()
    {
        var json = makeJson([makeObjectLayer('Objects', [makeObject(1, 0, 0)])]);
        var result = ParseObjectLayers(json);
        expect(Array.isArray(result[0].objects)).toBe(true);
        expect(result[0].objects.length).toBe(1);
    });
});
