var DUALSHOCK_4 = require('../../../../src/input/gamepad/configs/Sony_PlayStation_DualShock_4');

describe('Sony_PlayStation_DualShock_4', function ()
{
    it('should be importable', function ()
    {
        expect(DUALSHOCK_4).toBeDefined();
    });

    it('should be a plain object', function ()
    {
        expect(typeof DUALSHOCK_4).toBe('object');
        expect(DUALSHOCK_4).not.toBeNull();
    });

    describe('D-Pad buttons', function ()
    {
        it('should have UP mapped to index 12', function ()
        {
            expect(DUALSHOCK_4.UP).toBe(12);
        });

        it('should have DOWN mapped to index 13', function ()
        {
            expect(DUALSHOCK_4.DOWN).toBe(13);
        });

        it('should have LEFT mapped to index 14', function ()
        {
            expect(DUALSHOCK_4.LEFT).toBe(14);
        });

        it('should have RIGHT mapped to index 15', function ()
        {
            expect(DUALSHOCK_4.RIGHT).toBe(15);
        });
    });

    describe('System buttons', function ()
    {
        it('should have SHARE mapped to index 8', function ()
        {
            expect(DUALSHOCK_4.SHARE).toBe(8);
        });

        it('should have OPTIONS mapped to index 9', function ()
        {
            expect(DUALSHOCK_4.OPTIONS).toBe(9);
        });

        it('should have PS mapped to index 16', function ()
        {
            expect(DUALSHOCK_4.PS).toBe(16);
        });

        it('should have TOUCHBAR mapped to index 17', function ()
        {
            expect(DUALSHOCK_4.TOUCHBAR).toBe(17);
        });
    });

    describe('Face buttons', function ()
    {
        it('should have X mapped to index 0', function ()
        {
            expect(DUALSHOCK_4.X).toBe(0);
        });

        it('should have CIRCLE mapped to index 1', function ()
        {
            expect(DUALSHOCK_4.CIRCLE).toBe(1);
        });

        it('should have SQUARE mapped to index 2', function ()
        {
            expect(DUALSHOCK_4.SQUARE).toBe(2);
        });

        it('should have TRIANGLE mapped to index 3', function ()
        {
            expect(DUALSHOCK_4.TRIANGLE).toBe(3);
        });
    });

    describe('Shoulder and trigger buttons', function ()
    {
        it('should have L1 mapped to index 4', function ()
        {
            expect(DUALSHOCK_4.L1).toBe(4);
        });

        it('should have R1 mapped to index 5', function ()
        {
            expect(DUALSHOCK_4.R1).toBe(5);
        });

        it('should have L2 mapped to index 6', function ()
        {
            expect(DUALSHOCK_4.L2).toBe(6);
        });

        it('should have R2 mapped to index 7', function ()
        {
            expect(DUALSHOCK_4.R2).toBe(7);
        });
    });

    describe('Stick click buttons', function ()
    {
        it('should have L3 mapped to index 10', function ()
        {
            expect(DUALSHOCK_4.L3).toBe(10);
        });

        it('should have R3 mapped to index 11', function ()
        {
            expect(DUALSHOCK_4.R3).toBe(11);
        });
    });

    describe('Analog stick axes', function ()
    {
        it('should have LEFT_STICK_H mapped to axis 0', function ()
        {
            expect(DUALSHOCK_4.LEFT_STICK_H).toBe(0);
        });

        it('should have LEFT_STICK_V mapped to axis 1', function ()
        {
            expect(DUALSHOCK_4.LEFT_STICK_V).toBe(1);
        });

        it('should have RIGHT_STICK_H mapped to axis 2', function ()
        {
            expect(DUALSHOCK_4.RIGHT_STICK_H).toBe(2);
        });

        it('should have RIGHT_STICK_V mapped to axis 3', function ()
        {
            expect(DUALSHOCK_4.RIGHT_STICK_V).toBe(3);
        });
    });

    describe('value types', function ()
    {
        it('should have all values as numbers', function ()
        {
            var keys = Object.keys(DUALSHOCK_4);

            for (var i = 0; i < keys.length; i++)
            {
                expect(typeof DUALSHOCK_4[keys[i]]).toBe('number');
            }
        });

        it('should have all values as non-negative integers', function ()
        {
            var keys = Object.keys(DUALSHOCK_4);

            for (var i = 0; i < keys.length; i++)
            {
                var value = DUALSHOCK_4[keys[i]];
                expect(value).toBeGreaterThanOrEqual(0);
                expect(Number.isInteger(value)).toBe(true);
            }
        });
    });

    describe('total properties', function ()
    {
        it('should expose exactly 22 named constants', function ()
        {
            expect(Object.keys(DUALSHOCK_4).length).toBe(22);
        });
    });
});
