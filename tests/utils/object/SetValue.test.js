var SetValue = require('../../../src/utils/object/SetValue');

describe('Phaser.Utils.Objects.SetValue', function ()
{
    it('should return false when source is null', function ()
    {
        expect(SetValue(null, 'key', 'value')).toBe(false);
    });

    it('should return false when source is undefined', function ()
    {
        expect(SetValue(undefined, 'key', 'value')).toBe(false);
    });

    it('should return false when source is a number', function ()
    {
        expect(SetValue(42, 'key', 'value')).toBe(false);
    });

    it('should return false when source is zero', function ()
    {
        expect(SetValue(0, 'key', 'value')).toBe(false);
    });

    it('should set a top-level property and return true', function ()
    {
        var obj = { x: 1 };
        var result = SetValue(obj, 'x', 99);

        expect(result).toBe(true);
        expect(obj.x).toBe(99);
    });

    it('should set a string property and return true', function ()
    {
        var obj = { name: 'hello' };
        var result = SetValue(obj, 'name', 'world');

        expect(result).toBe(true);
        expect(obj.name).toBe('world');
    });

    it('should set a property to null', function ()
    {
        var obj = { x: 10 };
        var result = SetValue(obj, 'x', null);

        expect(result).toBe(true);
        expect(obj.x).toBeNull();
    });

    it('should set a property to false', function ()
    {
        var obj = { active: true };
        var result = SetValue(obj, 'active', false);

        expect(result).toBe(true);
        expect(obj.active).toBe(false);
    });

    it('should set a property to zero', function ()
    {
        var obj = { count: 5 };
        var result = SetValue(obj, 'count', 0);

        expect(result).toBe(true);
        expect(obj.count).toBe(0);
    });

    it('should return false for a key that does not exist on a flat object', function ()
    {
        var obj = { x: 1 };
        var result = SetValue(obj, 'y', 99);

        expect(result).toBe(false);
        expect(obj.y).toBeUndefined();
    });

    it('should set a nested property using dot notation and return true', function ()
    {
        var obj = { world: { position: { x: 0, y: 0 } } };
        var result = SetValue(obj, 'world.position.y', 300);

        expect(result).toBe(true);
        expect(obj.world.position.y).toBe(300);
    });

    it('should set a two-level nested property using dot notation', function ()
    {
        var obj = { player: { health: 100 } };
        var result = SetValue(obj, 'player.health', 50);

        expect(result).toBe(true);
        expect(obj.player.health).toBe(50);
    });

    it('should return false when intermediate key does not exist in dot notation path', function ()
    {
        var obj = { world: { position: { x: 0 } } };
        var result = SetValue(obj, 'world.velocity.x', 10);

        expect(result).toBe(false);
    });

    it('should return false when top-level key in dot notation path does not exist', function ()
    {
        var obj = { x: 1 };
        var result = SetValue(obj, 'missing.key', 42);

        expect(result).toBe(false);
    });

    it('should not mutate the object when returning false for a missing nested key', function ()
    {
        var obj = { a: { b: 1 } };
        SetValue(obj, 'a.c', 99);

        expect(obj.a.b).toBe(1);
        expect(obj.a.c).toBeUndefined();
    });

    it('should set a deeply nested property three levels deep', function ()
    {
        var obj = { a: { b: { c: 'original' } } };
        var result = SetValue(obj, 'a.b.c', 'updated');

        expect(result).toBe(true);
        expect(obj.a.b.c).toBe('updated');
    });

    it('should set a property to an object value', function ()
    {
        var obj = { data: null };
        var newData = { x: 1, y: 2 };
        var result = SetValue(obj, 'data', newData);

        expect(result).toBe(true);
        expect(obj.data).toBe(newData);
    });

    it('should set a property to an array value', function ()
    {
        var obj = { items: [] };
        var arr = [1, 2, 3];
        var result = SetValue(obj, 'items', arr);

        expect(result).toBe(true);
        expect(obj.items).toBe(arr);
    });

    it('should prefer hasOwnProperty match over dot notation when key exists directly', function ()
    {
        var obj = { 'a.b': 'direct', a: { b: 'nested' } };
        var result = SetValue(obj, 'a.b', 'changed');

        expect(result).toBe(true);
        expect(obj['a.b']).toBe('changed');
        expect(obj.a.b).toBe('nested');
    });

    it('should work with numeric string values', function ()
    {
        var obj = { score: 0 };
        var result = SetValue(obj, 'score', 9999);

        expect(result).toBe(true);
        expect(obj.score).toBe(9999);
    });

    it('should work with floating point values', function ()
    {
        var obj = { speed: 0 };
        var result = SetValue(obj, 'speed', 3.14);

        expect(result).toBe(true);
        expect(obj.speed).toBeCloseTo(3.14);
    });

    it('should return false when source is false', function ()
    {
        expect(SetValue(false, 'key', 'value')).toBe(false);
    });

    it('should return false when source is an empty string', function ()
    {
        expect(SetValue('', 'key', 'value')).toBe(false);
    });
});
