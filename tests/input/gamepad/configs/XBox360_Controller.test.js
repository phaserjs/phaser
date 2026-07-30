var XBOX_360 = require('../../../../src/input/gamepad/configs/XBox360_Controller');

describe('XBox360_Controller', function ()
{
    it('should be importable', function ()
    {
        expect(XBOX_360).toBeDefined();
    });

    it('should export an object', function ()
    {
        expect(typeof XBOX_360).toBe('object');
    });

    describe('D-Pad buttons', function ()
    {
        it('should have UP mapped to index 12', function ()
        {
            expect(XBOX_360.UP).toBe(12);
        });

        it('should have DOWN mapped to index 13', function ()
        {
            expect(XBOX_360.DOWN).toBe(13);
        });

        it('should have LEFT mapped to index 14', function ()
        {
            expect(XBOX_360.LEFT).toBe(14);
        });

        it('should have RIGHT mapped to index 15', function ()
        {
            expect(XBOX_360.RIGHT).toBe(15);
        });
    });

    describe('Face buttons', function ()
    {
        it('should have A mapped to index 0', function ()
        {
            expect(XBOX_360.A).toBe(0);
        });

        it('should have B mapped to index 1', function ()
        {
            expect(XBOX_360.B).toBe(1);
        });

        it('should have X mapped to index 2', function ()
        {
            expect(XBOX_360.X).toBe(2);
        });

        it('should have Y mapped to index 3', function ()
        {
            expect(XBOX_360.Y).toBe(3);
        });
    });

    describe('Shoulder buttons and triggers', function ()
    {
        it('should have LB mapped to index 4', function ()
        {
            expect(XBOX_360.LB).toBe(4);
        });

        it('should have RB mapped to index 5', function ()
        {
            expect(XBOX_360.RB).toBe(5);
        });

        it('should have LT mapped to index 6', function ()
        {
            expect(XBOX_360.LT).toBe(6);
        });

        it('should have RT mapped to index 7', function ()
        {
            expect(XBOX_360.RT).toBe(7);
        });
    });

    describe('System buttons', function ()
    {
        it('should have BACK mapped to index 8', function ()
        {
            expect(XBOX_360.BACK).toBe(8);
        });

        it('should have START mapped to index 9', function ()
        {
            expect(XBOX_360.START).toBe(9);
        });

        it('should have MENU mapped to index 16', function ()
        {
            expect(XBOX_360.MENU).toBe(16);
        });
    });

    describe('Stick press buttons', function ()
    {
        it('should have LS mapped to index 10', function ()
        {
            expect(XBOX_360.LS).toBe(10);
        });

        it('should have RS mapped to index 11', function ()
        {
            expect(XBOX_360.RS).toBe(11);
        });
    });

    describe('Analog stick axes', function ()
    {
        it('should have LEFT_STICK_H mapped to axis 0', function ()
        {
            expect(XBOX_360.LEFT_STICK_H).toBe(0);
        });

        it('should have LEFT_STICK_V mapped to axis 1', function ()
        {
            expect(XBOX_360.LEFT_STICK_V).toBe(1);
        });

        it('should have RIGHT_STICK_H mapped to axis 2', function ()
        {
            expect(XBOX_360.RIGHT_STICK_H).toBe(2);
        });

        it('should have RIGHT_STICK_V mapped to axis 3', function ()
        {
            expect(XBOX_360.RIGHT_STICK_V).toBe(3);
        });
    });

    describe('constant types', function ()
    {
        it('should have all values as numbers', function ()
        {
            var keys = [
                'UP', 'DOWN', 'LEFT', 'RIGHT', 'MENU',
                'A', 'B', 'X', 'Y',
                'LB', 'RB', 'LT', 'RT',
                'BACK', 'START', 'LS', 'RS',
                'LEFT_STICK_H', 'LEFT_STICK_V',
                'RIGHT_STICK_H', 'RIGHT_STICK_V'
            ];

            for (var i = 0; i < keys.length; i++)
            {
                expect(typeof XBOX_360[keys[i]]).toBe('number');
            }
        });

        it('should have all values as non-negative integers', function ()
        {
            var keys = [
                'UP', 'DOWN', 'LEFT', 'RIGHT', 'MENU',
                'A', 'B', 'X', 'Y',
                'LB', 'RB', 'LT', 'RT',
                'BACK', 'START', 'LS', 'RS',
                'LEFT_STICK_H', 'LEFT_STICK_V',
                'RIGHT_STICK_H', 'RIGHT_STICK_V'
            ];

            for (var i = 0; i < keys.length; i++)
            {
                var val = XBOX_360[keys[i]];
                expect(val >= 0).toBe(true);
                expect(Number.isInteger(val)).toBe(true);
            }
        });
    });
});
