var SetLayerCollisionIndex = require('../../../src/tilemaps/components/SetLayerCollisionIndex');

describe('Phaser.Tilemaps.Components.SetLayerCollisionIndex', function ()
{
    var layer;

    beforeEach(function ()
    {
        layer = { collideIndexes: [] };
    });

    it('should add a tile index when collides is true and index is not present', function ()
    {
        SetLayerCollisionIndex(5, true, layer);

        expect(layer.collideIndexes).toContain(5);
        expect(layer.collideIndexes.length).toBe(1);
    });

    it('should not duplicate a tile index when collides is true and index already present', function ()
    {
        layer.collideIndexes = [5];

        SetLayerCollisionIndex(5, true, layer);

        expect(layer.collideIndexes.length).toBe(1);
        expect(layer.collideIndexes[0]).toBe(5);
    });

    it('should remove a tile index when collides is false and index is present', function ()
    {
        layer.collideIndexes = [5];

        SetLayerCollisionIndex(5, false, layer);

        expect(layer.collideIndexes).not.toContain(5);
        expect(layer.collideIndexes.length).toBe(0);
    });

    it('should do nothing when collides is false and index is not present', function ()
    {
        SetLayerCollisionIndex(5, false, layer);

        expect(layer.collideIndexes.length).toBe(0);
    });

    it('should add multiple different tile indexes', function ()
    {
        SetLayerCollisionIndex(1, true, layer);
        SetLayerCollisionIndex(2, true, layer);
        SetLayerCollisionIndex(3, true, layer);

        expect(layer.collideIndexes.length).toBe(3);
        expect(layer.collideIndexes).toContain(1);
        expect(layer.collideIndexes).toContain(2);
        expect(layer.collideIndexes).toContain(3);
    });

    it('should only remove the specified tile index, leaving others intact', function ()
    {
        layer.collideIndexes = [1, 2, 3];

        SetLayerCollisionIndex(2, false, layer);

        expect(layer.collideIndexes.length).toBe(2);
        expect(layer.collideIndexes).toContain(1);
        expect(layer.collideIndexes).not.toContain(2);
        expect(layer.collideIndexes).toContain(3);
    });

    it('should handle tile index 0', function ()
    {
        SetLayerCollisionIndex(0, true, layer);

        expect(layer.collideIndexes).toContain(0);

        SetLayerCollisionIndex(0, false, layer);

        expect(layer.collideIndexes).not.toContain(0);
    });

    it('should handle negative tile indexes', function ()
    {
        SetLayerCollisionIndex(-1, true, layer);

        expect(layer.collideIndexes).toContain(-1);

        SetLayerCollisionIndex(-1, false, layer);

        expect(layer.collideIndexes).not.toContain(-1);
    });

    it('should handle large tile indexes', function ()
    {
        SetLayerCollisionIndex(9999, true, layer);

        expect(layer.collideIndexes).toContain(9999);
    });

    it('should add index when collideIndexes already has other entries', function ()
    {
        layer.collideIndexes = [10, 20, 30];

        SetLayerCollisionIndex(40, true, layer);

        expect(layer.collideIndexes.length).toBe(4);
        expect(layer.collideIndexes).toContain(40);
    });

    it('should correctly toggle a tile index on and off', function ()
    {
        SetLayerCollisionIndex(7, true, layer);
        expect(layer.collideIndexes).toContain(7);

        SetLayerCollisionIndex(7, false, layer);
        expect(layer.collideIndexes).not.toContain(7);

        SetLayerCollisionIndex(7, true, layer);
        expect(layer.collideIndexes).toContain(7);
    });
});
