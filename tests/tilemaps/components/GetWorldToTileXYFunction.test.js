var GetWorldToTileXYFunction = require('../../../src/tilemaps/components/GetWorldToTileXYFunction');
var CONST = require('../../../src/tilemaps/const/ORIENTATION_CONST');
var WorldToTileXY = require('../../../src/tilemaps/components/WorldToTileXY');
var IsometricWorldToTileXY = require('../../../src/tilemaps/components/IsometricWorldToTileXY');
var HexagonalWorldToTileXY = require('../../../src/tilemaps/components/HexagonalWorldToTileXY');
var StaggeredWorldToTileXY = require('../../../src/tilemaps/components/StaggeredWorldToTileXY');
var NOOP = require('../../../src/utils/NOOP');

describe('Phaser.Tilemaps.Components.GetWorldToTileXYFunction', function ()
{
    it('should return WorldToTileXY for ORTHOGONAL orientation', function ()
    {
        var fn = GetWorldToTileXYFunction(CONST.ORTHOGONAL);
        expect(fn).toBe(WorldToTileXY);
    });

    it('should return IsometricWorldToTileXY for ISOMETRIC orientation', function ()
    {
        var fn = GetWorldToTileXYFunction(CONST.ISOMETRIC);
        expect(fn).toBe(IsometricWorldToTileXY);
    });

    it('should return HexagonalWorldToTileXY for HEXAGONAL orientation', function ()
    {
        var fn = GetWorldToTileXYFunction(CONST.HEXAGONAL);
        expect(fn).toBe(HexagonalWorldToTileXY);
    });

    it('should return StaggeredWorldToTileXY for STAGGERED orientation', function ()
    {
        var fn = GetWorldToTileXYFunction(CONST.STAGGERED);
        expect(fn).toBe(StaggeredWorldToTileXY);
    });

    it('should return NOOP for an unrecognised orientation', function ()
    {
        var fn = GetWorldToTileXYFunction(999);
        expect(fn).toBe(NOOP);
    });

    it('should return NOOP for a negative orientation value', function ()
    {
        var fn = GetWorldToTileXYFunction(-1);
        expect(fn).toBe(NOOP);
    });

    it('should return NOOP for undefined orientation', function ()
    {
        var fn = GetWorldToTileXYFunction(undefined);
        expect(fn).toBe(NOOP);
    });

    it('should return a function for every known orientation constant', function ()
    {
        expect(typeof GetWorldToTileXYFunction(CONST.ORTHOGONAL)).toBe('function');
        expect(typeof GetWorldToTileXYFunction(CONST.ISOMETRIC)).toBe('function');
        expect(typeof GetWorldToTileXYFunction(CONST.HEXAGONAL)).toBe('function');
        expect(typeof GetWorldToTileXYFunction(CONST.STAGGERED)).toBe('function');
    });
});
