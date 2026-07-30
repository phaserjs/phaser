var BlendModes = require('../../src/renderer/BlendModes');

describe('BlendModes', function ()
{
    it('should be importable', function ()
    {
        expect(BlendModes).toBeDefined();
    });

    it('should have SKIP_CHECK equal to -1', function ()
    {
        expect(BlendModes.SKIP_CHECK).toBe(-1);
    });

    it('should have NORMAL equal to 0', function ()
    {
        expect(BlendModes.NORMAL).toBe(0);
    });

    it('should have ADD equal to 1', function ()
    {
        expect(BlendModes.ADD).toBe(1);
    });

    it('should have MULTIPLY equal to 2', function ()
    {
        expect(BlendModes.MULTIPLY).toBe(2);
    });

    it('should have SCREEN equal to 3', function ()
    {
        expect(BlendModes.SCREEN).toBe(3);
    });

    it('should have OVERLAY equal to 4', function ()
    {
        expect(BlendModes.OVERLAY).toBe(4);
    });

    it('should have DARKEN equal to 5', function ()
    {
        expect(BlendModes.DARKEN).toBe(5);
    });

    it('should have LIGHTEN equal to 6', function ()
    {
        expect(BlendModes.LIGHTEN).toBe(6);
    });

    it('should have COLOR_DODGE equal to 7', function ()
    {
        expect(BlendModes.COLOR_DODGE).toBe(7);
    });

    it('should have COLOR_BURN equal to 8', function ()
    {
        expect(BlendModes.COLOR_BURN).toBe(8);
    });

    it('should have HARD_LIGHT equal to 9', function ()
    {
        expect(BlendModes.HARD_LIGHT).toBe(9);
    });

    it('should have SOFT_LIGHT equal to 10', function ()
    {
        expect(BlendModes.SOFT_LIGHT).toBe(10);
    });

    it('should have DIFFERENCE equal to 11', function ()
    {
        expect(BlendModes.DIFFERENCE).toBe(11);
    });

    it('should have EXCLUSION equal to 12', function ()
    {
        expect(BlendModes.EXCLUSION).toBe(12);
    });

    it('should have HUE equal to 13', function ()
    {
        expect(BlendModes.HUE).toBe(13);
    });

    it('should have SATURATION equal to 14', function ()
    {
        expect(BlendModes.SATURATION).toBe(14);
    });

    it('should have COLOR equal to 15', function ()
    {
        expect(BlendModes.COLOR).toBe(15);
    });

    it('should have LUMINOSITY equal to 16', function ()
    {
        expect(BlendModes.LUMINOSITY).toBe(16);
    });

    it('should have ERASE equal to 17', function ()
    {
        expect(BlendModes.ERASE).toBe(17);
    });

    it('should have SOURCE_IN equal to 18', function ()
    {
        expect(BlendModes.SOURCE_IN).toBe(18);
    });

    it('should have SOURCE_OUT equal to 19', function ()
    {
        expect(BlendModes.SOURCE_OUT).toBe(19);
    });

    it('should have SOURCE_ATOP equal to 20', function ()
    {
        expect(BlendModes.SOURCE_ATOP).toBe(20);
    });

    it('should have DESTINATION_OVER equal to 21', function ()
    {
        expect(BlendModes.DESTINATION_OVER).toBe(21);
    });

    it('should have DESTINATION_IN equal to 22', function ()
    {
        expect(BlendModes.DESTINATION_IN).toBe(22);
    });

    it('should have DESTINATION_OUT equal to 23', function ()
    {
        expect(BlendModes.DESTINATION_OUT).toBe(23);
    });

    it('should have DESTINATION_ATOP equal to 24', function ()
    {
        expect(BlendModes.DESTINATION_ATOP).toBe(24);
    });

    it('should have LIGHTER equal to 25', function ()
    {
        expect(BlendModes.LIGHTER).toBe(25);
    });

    it('should have COPY equal to 26', function ()
    {
        expect(BlendModes.COPY).toBe(26);
    });

    it('should have XOR equal to 27', function ()
    {
        expect(BlendModes.XOR).toBe(27);
    });

    it('should export exactly 29 blend mode constants', function ()
    {
        expect(Object.keys(BlendModes).length).toBe(29);
    });

    it('should have all values as numbers', function ()
    {
        var keys = Object.keys(BlendModes);

        for (var i = 0; i < keys.length; i++)
        {
            expect(typeof BlendModes[keys[i]]).toBe('number');
        }
    });

    it('should have unique values for all constants except SKIP_CHECK', function ()
    {
        var keys = Object.keys(BlendModes);
        var values = [];

        for (var i = 0; i < keys.length; i++)
        {
            if (keys[i] !== 'SKIP_CHECK')
            {
                values.push(BlendModes[keys[i]]);
            }
        }

        var unique = values.filter(function (val, idx, arr)
        {
            return arr.indexOf(val) === idx;
        });

        expect(unique.length).toBe(values.length);
    });

    it('should have sequential values from NORMAL (0) to XOR (27)', function ()
    {
        var sequential = [
            'NORMAL', 'ADD', 'MULTIPLY', 'SCREEN', 'OVERLAY', 'DARKEN',
            'LIGHTEN', 'COLOR_DODGE', 'COLOR_BURN', 'HARD_LIGHT', 'SOFT_LIGHT',
            'DIFFERENCE', 'EXCLUSION', 'HUE', 'SATURATION', 'COLOR',
            'LUMINOSITY', 'ERASE', 'SOURCE_IN', 'SOURCE_OUT', 'SOURCE_ATOP',
            'DESTINATION_OVER', 'DESTINATION_IN', 'DESTINATION_OUT',
            'DESTINATION_ATOP', 'LIGHTER', 'COPY', 'XOR'
        ];

        for (var i = 0; i < sequential.length; i++)
        {
            expect(BlendModes[sequential[i]]).toBe(i);
        }
    });
});
