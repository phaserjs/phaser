var ComponentToHex = require('../../../src/display/color/ComponentToHex');

describe('Phaser.Display.Color.ComponentToHex', function ()
{
    it('should return a two-character string for 255', function ()
    {
        expect(ComponentToHex(255)).toBe('ff');
    });

    it('should return a two-character string for 0', function ()
    {
        expect(ComponentToHex(0)).toBe('00');
    });

    it('should pad single-digit hex values with a leading zero', function ()
    {
        expect(ComponentToHex(1)).toBe('01');
        expect(ComponentToHex(15)).toBe('0f');
    });

    it('should not pad two-digit hex values', function ()
    {
        expect(ComponentToHex(16)).toBe('10');
        expect(ComponentToHex(100)).toBe('64');
    });

    it('should return ff for 255', function ()
    {
        expect(ComponentToHex(255)).toBe('ff');
    });

    it('should return 80 for 128', function ()
    {
        expect(ComponentToHex(128)).toBe('80');
    });

    it('should return a string of length 2 for single hex digit values', function ()
    {
        expect(ComponentToHex(0).length).toBe(2);
        expect(ComponentToHex(9).length).toBe(2);
        expect(ComponentToHex(15).length).toBe(2);
    });

    it('should return a string of length 2 for double hex digit values', function ()
    {
        expect(ComponentToHex(16).length).toBe(2);
        expect(ComponentToHex(127).length).toBe(2);
        expect(ComponentToHex(255).length).toBe(2);
    });

    it('should return correct values for common web colors', function ()
    {
        expect(ComponentToHex(255)).toBe('ff');
        expect(ComponentToHex(0)).toBe('00');
        expect(ComponentToHex(128)).toBe('80');
        expect(ComponentToHex(192)).toBe('c0');
    });

    it('should return 0f for 15', function ()
    {
        expect(ComponentToHex(15)).toBe('0f');
    });

    it('should return 10 for 16', function ()
    {
        expect(ComponentToHex(16)).toBe('10');
    });
});
