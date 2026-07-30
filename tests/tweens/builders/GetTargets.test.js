var GetTargets = require('../../../src/tweens/builders/GetTargets');

describe('Phaser.Tweens.Builders.GetTargets', function ()
{
    it('should return null when no targets property is specified', function ()
    {
        expect(GetTargets({})).toBeNull();
    });

    it('should return null when targets is explicitly null', function ()
    {
        expect(GetTargets({ targets: null })).toBeNull();
    });

    it('should return an array when targets is a single object', function ()
    {
        var obj = { x: 0, y: 0 };
        var result = GetTargets({ targets: obj });

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(1);
        expect(result[0]).toBe(obj);
    });

    it('should return the same array when targets is already an array', function ()
    {
        var obj1 = { x: 0 };
        var obj2 = { x: 1 };
        var arr = [ obj1, obj2 ];
        var result = GetTargets({ targets: arr });

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(2);
        expect(result[0]).toBe(obj1);
        expect(result[1]).toBe(obj2);
    });

    it('should call the function and use its return value when targets is a function returning an array', function ()
    {
        var obj = { x: 10 };
        var result = GetTargets({
            targets: function ()
            {
                return [ obj ];
            }
        });

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(1);
        expect(result[0]).toBe(obj);
    });

    it('should call the function and wrap its return value in an array when it returns a non-array', function ()
    {
        var obj = { x: 10 };
        var result = GetTargets({
            targets: function ()
            {
                return obj;
            }
        });

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(1);
        expect(result[0]).toBe(obj);
    });

    it('should wrap a string target in an array', function ()
    {
        var result = GetTargets({ targets: 'someTarget' });

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(1);
        expect(result[0]).toBe('someTarget');
    });

    it('should wrap a number target in an array', function ()
    {
        var result = GetTargets({ targets: 42 });

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(1);
        expect(result[0]).toBe(42);
    });

    it('should return an empty array when targets is an empty array', function ()
    {
        var result = GetTargets({ targets: [] });

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
    });

    it('should return null when targets function returns null', function ()
    {
        var result = GetTargets({
            targets: function ()
            {
                return null;
            }
        });

        expect(Array.isArray(result)).toBe(true);
        expect(result[0]).toBeNull();
    });

    it('should handle multiple targets in an array', function ()
    {
        var targets = [ { id: 1 }, { id: 2 }, { id: 3 } ];
        var result = GetTargets({ targets: targets });

        expect(result.length).toBe(3);
        expect(result[0].id).toBe(1);
        expect(result[1].id).toBe(2);
        expect(result[2].id).toBe(3);
    });
});
