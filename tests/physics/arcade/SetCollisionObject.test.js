var SetCollisionObject = require('../../../src/physics/arcade/SetCollisionObject');

describe('Phaser.Physics.Arcade.SetCollisionObject', function ()
{
    it('should return an object', function ()
    {
        var result = SetCollisionObject(false);
        expect(typeof result).toBe('object');
    });

    it('should create a new object when no data argument is given', function ()
    {
        var result = SetCollisionObject(false);
        expect(result).not.toBeNull();
    });

    it('should use the provided data object instead of creating a new one', function ()
    {
        var data = {};
        var result = SetCollisionObject(false, data);
        expect(result).toBe(data);
    });

    it('should set none to false when noneFlip is false', function ()
    {
        var result = SetCollisionObject(false);
        expect(result.none).toBe(false);
    });

    it('should set all directional flags to true when noneFlip is false', function ()
    {
        var result = SetCollisionObject(false);
        expect(result.up).toBe(true);
        expect(result.down).toBe(true);
        expect(result.left).toBe(true);
        expect(result.right).toBe(true);
    });

    it('should set none to true when noneFlip is true', function ()
    {
        var result = SetCollisionObject(true);
        expect(result.none).toBe(true);
    });

    it('should set all directional flags to false when noneFlip is true', function ()
    {
        var result = SetCollisionObject(true);
        expect(result.up).toBe(false);
        expect(result.down).toBe(false);
        expect(result.left).toBe(false);
        expect(result.right).toBe(false);
    });

    it('should overwrite existing properties on the provided data object', function ()
    {
        var data = { none: true, up: true, down: true, left: true, right: true };
        var result = SetCollisionObject(true, data);
        expect(result.none).toBe(true);
        expect(result.up).toBe(false);
        expect(result.down).toBe(false);
        expect(result.left).toBe(false);
        expect(result.right).toBe(false);
    });

    it('should overwrite existing false flags to true when noneFlip is false', function ()
    {
        var data = { none: true, up: false, down: false, left: false, right: false };
        var result = SetCollisionObject(false, data);
        expect(result.none).toBe(false);
        expect(result.up).toBe(true);
        expect(result.down).toBe(true);
        expect(result.left).toBe(true);
        expect(result.right).toBe(true);
    });

    it('should preserve unrelated properties on the provided data object', function ()
    {
        var data = { custom: 'value', extra: 42 };
        var result = SetCollisionObject(false, data);
        expect(result.custom).toBe('value');
        expect(result.extra).toBe(42);
    });

    it('should return the same reference as the provided data object', function ()
    {
        var data = {};
        var result = SetCollisionObject(true, data);
        expect(result).toBe(data);
    });
});
