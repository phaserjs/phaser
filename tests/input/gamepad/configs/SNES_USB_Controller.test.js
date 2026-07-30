var SNES_USB = require('../../../../src/input/gamepad/configs/SNES_USB_Controller');

describe('SNES_USB_Controller', function ()
{
    it('should be importable', function ()
    {
        expect(SNES_USB).toBeDefined();
    });

    it('should have UP as 12', function ()
    {
        expect(SNES_USB.UP).toBe(12);
    });

    it('should have DOWN as 13', function ()
    {
        expect(SNES_USB.DOWN).toBe(13);
    });

    it('should have LEFT as 14', function ()
    {
        expect(SNES_USB.LEFT).toBe(14);
    });

    it('should have RIGHT as 15', function ()
    {
        expect(SNES_USB.RIGHT).toBe(15);
    });

    it('should have SELECT as 8', function ()
    {
        expect(SNES_USB.SELECT).toBe(8);
    });

    it('should have START as 9', function ()
    {
        expect(SNES_USB.START).toBe(9);
    });

    it('should have B as 0', function ()
    {
        expect(SNES_USB.B).toBe(0);
    });

    it('should have A as 1', function ()
    {
        expect(SNES_USB.A).toBe(1);
    });

    it('should have Y as 2', function ()
    {
        expect(SNES_USB.Y).toBe(2);
    });

    it('should have X as 3', function ()
    {
        expect(SNES_USB.X).toBe(3);
    });

    it('should have LEFT_SHOULDER as 4', function ()
    {
        expect(SNES_USB.LEFT_SHOULDER).toBe(4);
    });

    it('should have RIGHT_SHOULDER as 5', function ()
    {
        expect(SNES_USB.RIGHT_SHOULDER).toBe(5);
    });

    it('should have all constants as numbers', function ()
    {
        expect(typeof SNES_USB.UP).toBe('number');
        expect(typeof SNES_USB.DOWN).toBe('number');
        expect(typeof SNES_USB.LEFT).toBe('number');
        expect(typeof SNES_USB.RIGHT).toBe('number');
        expect(typeof SNES_USB.SELECT).toBe('number');
        expect(typeof SNES_USB.START).toBe('number');
        expect(typeof SNES_USB.B).toBe('number');
        expect(typeof SNES_USB.A).toBe('number');
        expect(typeof SNES_USB.Y).toBe('number');
        expect(typeof SNES_USB.X).toBe('number');
        expect(typeof SNES_USB.LEFT_SHOULDER).toBe('number');
        expect(typeof SNES_USB.RIGHT_SHOULDER).toBe('number');
    });

    it('should have unique values for all constants', function ()
    {
        var values = [
            SNES_USB.UP,
            SNES_USB.DOWN,
            SNES_USB.LEFT,
            SNES_USB.RIGHT,
            SNES_USB.SELECT,
            SNES_USB.START,
            SNES_USB.B,
            SNES_USB.A,
            SNES_USB.Y,
            SNES_USB.X,
            SNES_USB.LEFT_SHOULDER,
            SNES_USB.RIGHT_SHOULDER
        ];

        var unique = values.filter(function (value, index, self)
        {
            return self.indexOf(value) === index;
        });

        expect(unique.length).toBe(values.length);
    });

    it('should have exactly 12 properties', function ()
    {
        expect(Object.keys(SNES_USB).length).toBe(12);
    });

    it('should have D-Pad indices in the range 12-15', function ()
    {
        expect(SNES_USB.UP).toBeGreaterThanOrEqual(12);
        expect(SNES_USB.UP).toBeLessThanOrEqual(15);
        expect(SNES_USB.DOWN).toBeGreaterThanOrEqual(12);
        expect(SNES_USB.DOWN).toBeLessThanOrEqual(15);
        expect(SNES_USB.LEFT).toBeGreaterThanOrEqual(12);
        expect(SNES_USB.LEFT).toBeLessThanOrEqual(15);
        expect(SNES_USB.RIGHT).toBeGreaterThanOrEqual(12);
        expect(SNES_USB.RIGHT).toBeLessThanOrEqual(15);
    });

    it('should have face button indices in the range 0-3', function ()
    {
        expect(SNES_USB.B).toBeGreaterThanOrEqual(0);
        expect(SNES_USB.B).toBeLessThanOrEqual(3);
        expect(SNES_USB.A).toBeGreaterThanOrEqual(0);
        expect(SNES_USB.A).toBeLessThanOrEqual(3);
        expect(SNES_USB.Y).toBeGreaterThanOrEqual(0);
        expect(SNES_USB.Y).toBeLessThanOrEqual(3);
        expect(SNES_USB.X).toBeGreaterThanOrEqual(0);
        expect(SNES_USB.X).toBeLessThanOrEqual(3);
    });

    it('should have shoulder button indices in the range 4-5', function ()
    {
        expect(SNES_USB.LEFT_SHOULDER).toBeGreaterThanOrEqual(4);
        expect(SNES_USB.LEFT_SHOULDER).toBeLessThanOrEqual(5);
        expect(SNES_USB.RIGHT_SHOULDER).toBeGreaterThanOrEqual(4);
        expect(SNES_USB.RIGHT_SHOULDER).toBeLessThanOrEqual(5);
    });
});
