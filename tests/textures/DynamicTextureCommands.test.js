var DynamicTextureCommands = require('../../src/textures/DynamicTextureCommands');

describe('DynamicTextureCommands', function ()
{
    it('should be importable', function ()
    {
        expect(DynamicTextureCommands).toBeDefined();
    });

    it('should export CLEAR as 0', function ()
    {
        expect(DynamicTextureCommands.CLEAR).toBe(0);
    });

    it('should export FILL as 1', function ()
    {
        expect(DynamicTextureCommands.FILL).toBe(1);
    });

    it('should export STAMP as 2', function ()
    {
        expect(DynamicTextureCommands.STAMP).toBe(2);
    });

    it('should export REPEAT as 3', function ()
    {
        expect(DynamicTextureCommands.REPEAT).toBe(3);
    });

    it('should export DRAW as 4', function ()
    {
        expect(DynamicTextureCommands.DRAW).toBe(4);
    });

    it('should export SET_ERASE as 5', function ()
    {
        expect(DynamicTextureCommands.SET_ERASE).toBe(5);
    });

    it('should export PRESERVE as 6', function ()
    {
        expect(DynamicTextureCommands.PRESERVE).toBe(6);
    });

    it('should export CALLBACK as 7', function ()
    {
        expect(DynamicTextureCommands.CALLBACK).toBe(7);
    });

    it('should export CAPTURE as 8', function ()
    {
        expect(DynamicTextureCommands.CAPTURE).toBe(8);
    });

    it('should export exactly 9 constants', function ()
    {
        expect(Object.keys(DynamicTextureCommands).length).toBe(9);
    });

    it('should have all constants as unique values', function ()
    {
        var values = Object.values(DynamicTextureCommands);
        var unique = new Set(values);
        expect(unique.size).toBe(values.length);
    });

    it('should have all constants as non-negative integers', function ()
    {
        var values = Object.values(DynamicTextureCommands);
        values.forEach(function (value)
        {
            expect(Number.isInteger(value)).toBe(true);
            expect(value).toBeGreaterThanOrEqual(0);
        });
    });
});
