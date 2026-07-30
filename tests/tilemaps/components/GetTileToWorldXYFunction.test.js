var GetTileToWorldXYFunction = require('../../../src/tilemaps/components/GetTileToWorldXYFunction');
var CONST = require('../../../src/tilemaps/const/ORIENTATION_CONST');
var TileToWorldXY = require('../../../src/tilemaps/components/TileToWorldXY');
var IsometricTileToWorldXY = require('../../../src/tilemaps/components/IsometricTileToWorldXY');
var HexagonalTileToWorldXY = require('../../../src/tilemaps/components/HexagonalTileToWorldXY');
var StaggeredTileToWorldXY = require('../../../src/tilemaps/components/StaggeredTileToWorldXY');
var NOOP = require('../../../src/utils/NOOP');

describe('Phaser.Tilemaps.Components.GetTileToWorldXYFunction', function ()
{
    it('should return TileToWorldXY for ORTHOGONAL orientation', function ()
    {
        var fn = GetTileToWorldXYFunction(CONST.ORTHOGONAL);
        expect(fn).toBe(TileToWorldXY);
    });

    it('should return IsometricTileToWorldXY for ISOMETRIC orientation', function ()
    {
        var fn = GetTileToWorldXYFunction(CONST.ISOMETRIC);
        expect(fn).toBe(IsometricTileToWorldXY);
    });

    it('should return HexagonalTileToWorldXY for HEXAGONAL orientation', function ()
    {
        var fn = GetTileToWorldXYFunction(CONST.HEXAGONAL);
        expect(fn).toBe(HexagonalTileToWorldXY);
    });

    it('should return StaggeredTileToWorldXY for STAGGERED orientation', function ()
    {
        var fn = GetTileToWorldXYFunction(CONST.STAGGERED);
        expect(fn).toBe(StaggeredTileToWorldXY);
    });

    it('should return NOOP for an unknown orientation', function ()
    {
        var fn = GetTileToWorldXYFunction(999);
        expect(fn).toBe(NOOP);
    });

    it('should return NOOP for undefined orientation', function ()
    {
        var fn = GetTileToWorldXYFunction(undefined);
        expect(fn).toBe(NOOP);
    });

    it('should return NOOP for null orientation', function ()
    {
        var fn = GetTileToWorldXYFunction(null);
        expect(fn).toBe(NOOP);
    });

    it('should return NOOP for negative orientation values', function ()
    {
        var fn = GetTileToWorldXYFunction(-1);
        expect(fn).toBe(NOOP);
    });

    it('should return a function for all valid orientations', function ()
    {
        expect(typeof GetTileToWorldXYFunction(CONST.ORTHOGONAL)).toBe('function');
        expect(typeof GetTileToWorldXYFunction(CONST.ISOMETRIC)).toBe('function');
        expect(typeof GetTileToWorldXYFunction(CONST.HEXAGONAL)).toBe('function');
        expect(typeof GetTileToWorldXYFunction(CONST.STAGGERED)).toBe('function');
    });

    it('should return ORTHOGONAL function for orientation value 0', function ()
    {
        var fn = GetTileToWorldXYFunction(0);
        expect(fn).toBe(TileToWorldXY);
    });

    it('should return ISOMETRIC function for orientation value 1', function ()
    {
        var fn = GetTileToWorldXYFunction(1);
        expect(fn).toBe(IsometricTileToWorldXY);
    });

    it('should return STAGGERED function for orientation value 2', function ()
    {
        var fn = GetTileToWorldXYFunction(2);
        expect(fn).toBe(StaggeredTileToWorldXY);
    });

    it('should return HEXAGONAL function for orientation value 3', function ()
    {
        var fn = GetTileToWorldXYFunction(3);
        expect(fn).toBe(HexagonalTileToWorldXY);
    });
});
