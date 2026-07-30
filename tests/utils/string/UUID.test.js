var UUID = require('../../../src/utils/string/UUID');

describe('Phaser.Utils.String.UUID', function ()
{
    it('should return a string', function ()
    {
        expect(typeof UUID()).toBe('string');
    });

    it('should return a string of length 36', function ()
    {
        expect(UUID().length).toBe(36);
    });

    it('should match the RFC4122 v4 UUID format', function ()
    {
        var uuid = UUID();
        var pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

        expect(pattern.test(uuid)).toBe(true);
    });

    it('should have hyphens at positions 8, 13, 18, and 23', function ()
    {
        var uuid = UUID();

        expect(uuid[8]).toBe('-');
        expect(uuid[13]).toBe('-');
        expect(uuid[18]).toBe('-');
        expect(uuid[23]).toBe('-');
    });

    it('should have version digit 4 at position 14', function ()
    {
        var uuid = UUID();

        expect(uuid[14]).toBe('4');
    });

    it('should have a variant digit of 8, 9, a, or b at position 19', function ()
    {
        var uuid = UUID();
        var validVariants = ['8', '9', 'a', 'b'];

        expect(validVariants).toContain(uuid[19]);
    });

    it('should return a different value on each call', function ()
    {
        var results = {};
        var iterations = 100;

        for (var i = 0; i < iterations; i++)
        {
            results[UUID()] = true;
        }

        expect(Object.keys(results).length).toBe(iterations);
    });

    it('should only contain valid hexadecimal characters and hyphens', function ()
    {
        var uuid = UUID();
        var pattern = /^[0-9a-f-]+$/;

        expect(pattern.test(uuid)).toBe(true);
    });

    it('should always pass RFC4122 format across many iterations', function ()
    {
        var pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

        for (var i = 0; i < 1000; i++)
        {
            expect(pattern.test(UUID())).toBe(true);
        }
    });

    it('should always have a valid variant nibble across many iterations', function ()
    {
        var validVariants = ['8', '9', 'a', 'b'];

        for (var i = 0; i < 1000; i++)
        {
            expect(validVariants).toContain(UUID()[19]);
        }
    });
});
