var GetWorldToTileXFunction = require('../../../src/tilemaps/components/GetWorldToTileXFunction');
var WorldToTileX = require('../../../src/tilemaps/components/WorldToTileX');
var CONST = require('../../../src/tilemaps/const/ORIENTATION_CONST');

describe('Phaser.Tilemaps.Components.GetWorldToTileXFunction', function ()
{
    it('should return the WorldToTileX function for ORTHOGONAL orientation', function ()
    {
        var result = GetWorldToTileXFunction(CONST.ORTHOGONAL);

        expect(result).toBe(WorldToTileX);
    });

    it('should return the WorldToTileX function when orientation is 0', function ()
    {
        var result = GetWorldToTileXFunction(0);

        expect(result).toBe(WorldToTileX);
    });

    it('should return a function for ORTHOGONAL orientation', function ()
    {
        var result = GetWorldToTileXFunction(CONST.ORTHOGONAL);

        expect(typeof result).toBe('function');
    });

    it('should return a NULL function for ISOMETRIC orientation', function ()
    {
        var result = GetWorldToTileXFunction(CONST.ISOMETRIC);

        expect(typeof result).toBe('function');
        expect(result()).toBeNull();
    });

    it('should return a NULL function for STAGGERED orientation', function ()
    {
        var result = GetWorldToTileXFunction(CONST.STAGGERED);

        expect(typeof result).toBe('function');
        expect(result()).toBeNull();
    });

    it('should return a NULL function for HEXAGONAL orientation', function ()
    {
        var result = GetWorldToTileXFunction(CONST.HEXAGONAL);

        expect(typeof result).toBe('function');
        expect(result()).toBeNull();
    });

    it('should return a NULL function for an unknown orientation', function ()
    {
        var result = GetWorldToTileXFunction(99);

        expect(typeof result).toBe('function');
        expect(result()).toBeNull();
    });

    it('should return a NULL function when orientation is undefined', function ()
    {
        var result = GetWorldToTileXFunction(undefined);

        expect(typeof result).toBe('function');
        expect(result()).toBeNull();
    });

    it('should return a NULL function when orientation is null', function ()
    {
        var result = GetWorldToTileXFunction(null);

        expect(typeof result).toBe('function');
        expect(result()).toBeNull();
    });

    it('should return a NULL function for negative orientation values', function ()
    {
        var result = GetWorldToTileXFunction(-1);

        expect(typeof result).toBe('function');
        expect(result()).toBeNull();
    });

    it('should always return the same WorldToTileX reference for ORTHOGONAL', function ()
    {
        var result1 = GetWorldToTileXFunction(CONST.ORTHOGONAL);
        var result2 = GetWorldToTileXFunction(CONST.ORTHOGONAL);

        expect(result1).toBe(result2);
    });

    it('should always return the same NULL function reference for non-ORTHOGONAL orientations', function ()
    {
        var result1 = GetWorldToTileXFunction(CONST.ISOMETRIC);
        var result2 = GetWorldToTileXFunction(CONST.HEXAGONAL);

        expect(result1).toBe(result2);
    });
});
