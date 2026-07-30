var GetCullTilesFunction = require('../../../src/tilemaps/components/GetCullTilesFunction');
var CullTiles = require('../../../src/tilemaps/components/CullTiles');
var HexagonalCullTiles = require('../../../src/tilemaps/components/HexagonalCullTiles');
var IsometricCullTiles = require('../../../src/tilemaps/components/IsometricCullTiles');
var StaggeredCullTiles = require('../../../src/tilemaps/components/StaggeredCullTiles');
var NOOP = require('../../../src/utils/NOOP');
var CONST = require('../../../src/tilemaps/const/ORIENTATION_CONST');

describe('Phaser.Tilemaps.Components.GetCullTilesFunction', function ()
{
    it('should return CullTiles for ORTHOGONAL orientation', function ()
    {
        var result = GetCullTilesFunction(CONST.ORTHOGONAL);
        expect(result).toBe(CullTiles);
    });

    it('should return HexagonalCullTiles for HEXAGONAL orientation', function ()
    {
        var result = GetCullTilesFunction(CONST.HEXAGONAL);
        expect(result).toBe(HexagonalCullTiles);
    });

    it('should return StaggeredCullTiles for STAGGERED orientation', function ()
    {
        var result = GetCullTilesFunction(CONST.STAGGERED);
        expect(result).toBe(StaggeredCullTiles);
    });

    it('should return IsometricCullTiles for ISOMETRIC orientation', function ()
    {
        var result = GetCullTilesFunction(CONST.ISOMETRIC);
        expect(result).toBe(IsometricCullTiles);
    });

    it('should return NOOP for an unknown orientation', function ()
    {
        var result = GetCullTilesFunction(999);
        expect(result).toBe(NOOP);
    });

    it('should return NOOP when orientation is undefined', function ()
    {
        var result = GetCullTilesFunction(undefined);
        expect(result).toBe(NOOP);
    });

    it('should return NOOP when orientation is null', function ()
    {
        var result = GetCullTilesFunction(null);
        expect(result).toBe(NOOP);
    });

    it('should return NOOP when orientation is a negative number', function ()
    {
        var result = GetCullTilesFunction(-1);
        expect(result).toBe(NOOP);
    });

    it('should return a function for every known orientation constant', function ()
    {
        expect(typeof GetCullTilesFunction(CONST.ORTHOGONAL)).toBe('function');
        expect(typeof GetCullTilesFunction(CONST.HEXAGONAL)).toBe('function');
        expect(typeof GetCullTilesFunction(CONST.STAGGERED)).toBe('function');
        expect(typeof GetCullTilesFunction(CONST.ISOMETRIC)).toBe('function');
    });

    it('should return a function even for unknown orientations', function ()
    {
        expect(typeof GetCullTilesFunction(42)).toBe('function');
    });

    it('should use numeric constant values (0=ORTHOGONAL, 1=ISOMETRIC, 2=STAGGERED, 3=HEXAGONAL)', function ()
    {
        expect(GetCullTilesFunction(0)).toBe(CullTiles);
        expect(GetCullTilesFunction(1)).toBe(IsometricCullTiles);
        expect(GetCullTilesFunction(2)).toBe(StaggeredCullTiles);
        expect(GetCullTilesFunction(3)).toBe(HexagonalCullTiles);
    });
});
