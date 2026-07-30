var ObjectLayer = require('../../../src/tilemaps/mapdata/ObjectLayer');

describe('ObjectLayer', function ()
{
    describe('constructor with no arguments', function ()
    {
        it('should create an object layer with default name', function ()
        {
            var layer = new ObjectLayer();
            expect(layer.name).toBe('object layer');
        });

        it('should create an object layer with default id', function ()
        {
            var layer = new ObjectLayer();
            expect(layer.id).toBe(0);
        });

        it('should create an object layer with default opacity', function ()
        {
            var layer = new ObjectLayer();
            expect(layer.opacity).toBe(1);
        });

        it('should create an object layer with empty properties object', function ()
        {
            var layer = new ObjectLayer();
            expect(layer.properties).toEqual({});
        });

        it('should create an object layer with empty propertyTypes object', function ()
        {
            var layer = new ObjectLayer();
            expect(layer.propertyTypes).toEqual({});
        });

        it('should create an object layer with default type', function ()
        {
            var layer = new ObjectLayer();
            expect(layer.type).toBe('objectgroup');
        });

        it('should create an object layer that is visible by default', function ()
        {
            var layer = new ObjectLayer();
            expect(layer.visible).toBe(true);
        });

        it('should create an object layer with empty objects array', function ()
        {
            var layer = new ObjectLayer();
            expect(Array.isArray(layer.objects)).toBe(true);
            expect(layer.objects.length).toBe(0);
        });
    });

    describe('constructor with config', function ()
    {
        it('should set name from config', function ()
        {
            var layer = new ObjectLayer({ name: 'spawns' });
            expect(layer.name).toBe('spawns');
        });

        it('should set id from config', function ()
        {
            var layer = new ObjectLayer({ id: 42 });
            expect(layer.id).toBe(42);
        });

        it('should set opacity from config', function ()
        {
            var layer = new ObjectLayer({ opacity: 0.5 });
            expect(layer.opacity).toBe(0.5);
        });

        it('should set properties from config', function ()
        {
            var props = { color: 'red', count: 3 };
            var layer = new ObjectLayer({ properties: props });
            expect(layer.properties).toEqual(props);
        });

        it('should set propertyTypes from propertytypes config key', function ()
        {
            var propTypes = { color: 'string', count: 'int' };
            var layer = new ObjectLayer({ propertytypes: propTypes });
            expect(layer.propertyTypes).toEqual(propTypes);
        });

        it('should set type from config', function ()
        {
            var layer = new ObjectLayer({ type: 'customtype' });
            expect(layer.type).toBe('customtype');
        });

        it('should set visible to false from config', function ()
        {
            var layer = new ObjectLayer({ visible: false });
            expect(layer.visible).toBe(false);
        });

        it('should set objects array from config', function ()
        {
            var objects = [
                { id: 1, name: 'spawn', x: 100, y: 200 },
                { id: 2, name: 'trigger', x: 300, y: 400 }
            ];
            var layer = new ObjectLayer({ objects: objects });
            expect(layer.objects).toEqual(objects);
            expect(layer.objects.length).toBe(2);
        });

        it('should accept a full config object', function ()
        {
            var config = {
                name: 'enemies',
                id: 7,
                opacity: 0.8,
                properties: { difficulty: 'hard' },
                propertytypes: { difficulty: 'string' },
                type: 'objectgroup',
                visible: true,
                objects: [{ id: 1, name: 'slime', x: 0, y: 0 }]
            };
            var layer = new ObjectLayer(config);
            expect(layer.name).toBe('enemies');
            expect(layer.id).toBe(7);
            expect(layer.opacity).toBe(0.8);
            expect(layer.properties).toEqual({ difficulty: 'hard' });
            expect(layer.propertyTypes).toEqual({ difficulty: 'string' });
            expect(layer.type).toBe('objectgroup');
            expect(layer.visible).toBe(true);
            expect(layer.objects.length).toBe(1);
        });
    });

    describe('objects coercion', function ()
    {
        it('should convert a non-array objects value to an empty array', function ()
        {
            var layer = new ObjectLayer({ objects: {} });
            expect(Array.isArray(layer.objects)).toBe(true);
            expect(layer.objects.length).toBe(0);
        });

        it('should convert a null objects value to an empty array', function ()
        {
            var layer = new ObjectLayer({ objects: null });
            expect(Array.isArray(layer.objects)).toBe(true);
            expect(layer.objects.length).toBe(0);
        });

        it('should convert a string objects value to an empty array', function ()
        {
            var layer = new ObjectLayer({ objects: 'bad data' });
            expect(Array.isArray(layer.objects)).toBe(true);
            expect(layer.objects.length).toBe(0);
        });

        it('should convert a numeric objects value to an empty array', function ()
        {
            var layer = new ObjectLayer({ objects: 42 });
            expect(Array.isArray(layer.objects)).toBe(true);
            expect(layer.objects.length).toBe(0);
        });

        it('should keep a valid array intact', function ()
        {
            var objs = [{ id: 1 }, { id: 2 }];
            var layer = new ObjectLayer({ objects: objs });
            expect(Array.isArray(layer.objects)).toBe(true);
            expect(layer.objects.length).toBe(2);
        });
    });

    describe('constructor with undefined config', function ()
    {
        it('should handle undefined config the same as no config', function ()
        {
            var layer = new ObjectLayer(undefined);
            expect(layer.name).toBe('object layer');
            expect(layer.id).toBe(0);
            expect(layer.opacity).toBe(1);
            expect(layer.type).toBe('objectgroup');
            expect(layer.visible).toBe(true);
            expect(Array.isArray(layer.objects)).toBe(true);
        });
    });
});
