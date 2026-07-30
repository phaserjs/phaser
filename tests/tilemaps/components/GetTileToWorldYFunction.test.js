var GetTileToWorldYFunction = require('../../../src/tilemaps/components/GetTileToWorldYFunction');
var TileToWorldY = require('../../../src/tilemaps/components/TileToWorldY');
var StaggeredTileToWorldY = require('../../../src/tilemaps/components/StaggeredTileToWorldY');
var NOOP = require('../../../src/utils/NOOP');
var CONST = require('../../../src/tilemaps/const/ORIENTATION_CONST');

describe('Phaser.Tilemaps.Components.GetTileToWorldYFunction', function ()
{
    it('should return TileToWorldY for ORTHOGONAL orientation', function ()
    {
        var result = GetTileToWorldYFunction(CONST.ORTHOGONAL);
        expect(result).toBe(TileToWorldY);
    });

    it('should return StaggeredTileToWorldY for STAGGERED orientation', function ()
    {
        var result = GetTileToWorldYFunction(CONST.STAGGERED);
        expect(result).toBe(StaggeredTileToWorldY);
    });

    it('should return NOOP for ISOMETRIC orientation', function ()
    {
        var result = GetTileToWorldYFunction(CONST.ISOMETRIC);
        expect(result).toBe(NOOP);
    });

    it('should return NOOP for HEXAGONAL orientation', function ()
    {
        var result = GetTileToWorldYFunction(CONST.HEXAGONAL);
        expect(result).toBe(NOOP);
    });

    it('should return NOOP for an unknown orientation value', function ()
    {
        var result = GetTileToWorldYFunction(999);
        expect(result).toBe(NOOP);
    });

    it('should return NOOP for undefined orientation', function ()
    {
        var result = GetTileToWorldYFunction(undefined);
        expect(result).toBe(NOOP);
    });

    it('should return a callable function for ORTHOGONAL orientation', function ()
    {
        var result = GetTileToWorldYFunction(CONST.ORTHOGONAL);
        expect(typeof result).toBe('function');
    });

    it('should return a callable function for STAGGERED orientation', function ()
    {
        var result = GetTileToWorldYFunction(CONST.STAGGERED);
        expect(typeof result).toBe('function');
    });

    it('should return a callable function for unknown orientations', function ()
    {
        var result = GetTileToWorldYFunction(-1);
        expect(typeof result).toBe('function');
    });

    it('should return ORTHOGONAL constant value 0 as ORTHOGONAL orientation', function ()
    {
        var result = GetTileToWorldYFunction(0);
        expect(result).toBe(TileToWorldY);
    });

    it('should return STAGGERED constant value 2 as STAGGERED orientation', function ()
    {
        var result = GetTileToWorldYFunction(2);
        expect(result).toBe(StaggeredTileToWorldY);
    });
});
