var SetTileCollision = require('../../../src/tilemaps/components/SetTileCollision');

describe('Phaser.Tilemaps.Components.SetTileCollision', function ()
{
    var tile;

    beforeEach(function ()
    {
        tile = {
            setCollisionCalled: false,
            setCollisionArgs: null,
            resetCollisionCalled: false,
            resetCollisionArgs: null,
            setCollision: function (left, right, up, down, recalc)
            {
                this.setCollisionCalled = true;
                this.setCollisionArgs = { left: left, right: right, up: up, down: down, recalc: recalc };
            },
            resetCollision: function (recalc)
            {
                this.resetCollisionCalled = true;
                this.resetCollisionArgs = { recalc: recalc };
            }
        };
    });

    it('should call setCollision with all sides true and recalc false when collides is true', function ()
    {
        SetTileCollision(tile, true);

        expect(tile.setCollisionCalled).toBe(true);
        expect(tile.setCollisionArgs.left).toBe(true);
        expect(tile.setCollisionArgs.right).toBe(true);
        expect(tile.setCollisionArgs.up).toBe(true);
        expect(tile.setCollisionArgs.down).toBe(true);
        expect(tile.setCollisionArgs.recalc).toBe(false);
    });

    it('should not call resetCollision when collides is true', function ()
    {
        SetTileCollision(tile, true);

        expect(tile.resetCollisionCalled).toBe(false);
    });

    it('should call resetCollision with false when collides is false', function ()
    {
        SetTileCollision(tile, false);

        expect(tile.resetCollisionCalled).toBe(true);
        expect(tile.resetCollisionArgs.recalc).toBe(false);
    });

    it('should not call setCollision when collides is false', function ()
    {
        SetTileCollision(tile, false);

        expect(tile.setCollisionCalled).toBe(false);
    });

    it('should call resetCollision when collides is omitted (defaults to falsy)', function ()
    {
        SetTileCollision(tile);

        expect(tile.resetCollisionCalled).toBe(true);
        expect(tile.setCollisionCalled).toBe(false);
    });

    it('should call setCollision when collides is a truthy non-boolean', function ()
    {
        SetTileCollision(tile, 1);

        expect(tile.setCollisionCalled).toBe(true);
        expect(tile.resetCollisionCalled).toBe(false);
    });

    it('should call resetCollision when collides is 0', function ()
    {
        SetTileCollision(tile, 0);

        expect(tile.resetCollisionCalled).toBe(true);
        expect(tile.setCollisionCalled).toBe(false);
    });

    it('should call resetCollision when collides is null', function ()
    {
        SetTileCollision(tile, null);

        expect(tile.resetCollisionCalled).toBe(true);
        expect(tile.setCollisionCalled).toBe(false);
    });
});
