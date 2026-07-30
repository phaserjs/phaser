var GetWorldToTileYFunction = require('../../../src/tilemaps/components/GetWorldToTileYFunction');
var CONST = require('../../../src/tilemaps/const/ORIENTATION_CONST');
var NULL = require('../../../src/utils/NULL');
var StaggeredWorldToTileY = require('../../../src/tilemaps/components/StaggeredWorldToTileY');
var WorldToTileY = require('../../../src/tilemaps/components/WorldToTileY');

describe('Phaser.Tilemaps.Components.GetWorldToTileYFunction', function ()
{
    it('should return WorldToTileY for ORTHOGONAL orientation', function ()
    {
        var result = GetWorldToTileYFunction(CONST.ORTHOGONAL);

        expect(result).toBe(WorldToTileY);
    });

    it('should return StaggeredWorldToTileY for STAGGERED orientation', function ()
    {
        var result = GetWorldToTileYFunction(CONST.STAGGERED);

        expect(result).toBe(StaggeredWorldToTileY);
    });

    it('should return NULL for ISOMETRIC orientation', function ()
    {
        var result = GetWorldToTileYFunction(CONST.ISOMETRIC);

        expect(result).toBe(NULL);
    });

    it('should return NULL for HEXAGONAL orientation', function ()
    {
        var result = GetWorldToTileYFunction(CONST.HEXAGONAL);

        expect(result).toBe(NULL);
    });

    it('should return NULL for an unknown orientation value', function ()
    {
        var result = GetWorldToTileYFunction(99);

        expect(result).toBe(NULL);
    });

    it('should return NULL for undefined orientation', function ()
    {
        var result = GetWorldToTileYFunction(undefined);

        expect(result).toBe(NULL);
    });

    it('should return a function for ORTHOGONAL orientation', function ()
    {
        var result = GetWorldToTileYFunction(CONST.ORTHOGONAL);

        expect(typeof result).toBe('function');
    });

    it('should return a function for STAGGERED orientation', function ()
    {
        var result = GetWorldToTileYFunction(CONST.STAGGERED);

        expect(typeof result).toBe('function');
    });

    it('should return a function for unsupported orientations', function ()
    {
        var result = GetWorldToTileYFunction(CONST.ISOMETRIC);

        expect(typeof result).toBe('function');
    });

    it('should return a NULL function that returns null when called', function ()
    {
        var result = GetWorldToTileYFunction(CONST.ISOMETRIC);

        expect(result()).toBeNull();
    });
});
