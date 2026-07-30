var CONST = require('../../../src/physics/arcade/const');

describe('const', function ()
{
    describe('body type constants', function ()
    {
        it('should define DYNAMIC_BODY as 0', function ()
        {
            expect(CONST.DYNAMIC_BODY).toBe(0);
        });

        it('should define STATIC_BODY as 1', function ()
        {
            expect(CONST.STATIC_BODY).toBe(1);
        });

        it('should define GROUP as 2', function ()
        {
            expect(CONST.GROUP).toBe(2);
        });

        it('should define TILEMAPLAYER as 3', function ()
        {
            expect(CONST.TILEMAPLAYER).toBe(3);
        });

        it('should have unique values for body type constants', function ()
        {
            var bodyTypes = [CONST.DYNAMIC_BODY, CONST.STATIC_BODY, CONST.GROUP, CONST.TILEMAPLAYER];
            var unique = new Set(bodyTypes);
            expect(unique.size).toBe(bodyTypes.length);
        });
    });

    describe('facing direction constants', function ()
    {
        it('should define FACING_NONE as 10', function ()
        {
            expect(CONST.FACING_NONE).toBe(10);
        });

        it('should define FACING_UP as 11', function ()
        {
            expect(CONST.FACING_UP).toBe(11);
        });

        it('should define FACING_DOWN as 12', function ()
        {
            expect(CONST.FACING_DOWN).toBe(12);
        });

        it('should define FACING_LEFT as 13', function ()
        {
            expect(CONST.FACING_LEFT).toBe(13);
        });

        it('should define FACING_RIGHT as 14', function ()
        {
            expect(CONST.FACING_RIGHT).toBe(14);
        });

        it('should have unique values for facing direction constants', function ()
        {
            var facingValues = [CONST.FACING_NONE, CONST.FACING_UP, CONST.FACING_DOWN, CONST.FACING_LEFT, CONST.FACING_RIGHT];
            var unique = new Set(facingValues);
            expect(unique.size).toBe(facingValues.length);
        });

        it('should have facing direction values distinct from body type values', function ()
        {
            var bodyTypes = [CONST.DYNAMIC_BODY, CONST.STATIC_BODY, CONST.GROUP, CONST.TILEMAPLAYER];
            var facingValues = [CONST.FACING_NONE, CONST.FACING_UP, CONST.FACING_DOWN, CONST.FACING_LEFT, CONST.FACING_RIGHT];

            facingValues.forEach(function (facing)
            {
                expect(bodyTypes.indexOf(facing)).toBe(-1);
            });
        });
    });

    describe('constant types', function ()
    {
        it('should export all constants as numbers', function ()
        {
            expect(typeof CONST.DYNAMIC_BODY).toBe('number');
            expect(typeof CONST.STATIC_BODY).toBe('number');
            expect(typeof CONST.GROUP).toBe('number');
            expect(typeof CONST.TILEMAPLAYER).toBe('number');
            expect(typeof CONST.FACING_NONE).toBe('number');
            expect(typeof CONST.FACING_UP).toBe('number');
            expect(typeof CONST.FACING_DOWN).toBe('number');
            expect(typeof CONST.FACING_LEFT).toBe('number');
            expect(typeof CONST.FACING_RIGHT).toBe('number');
        });
    });

    describe('module export', function ()
    {
        it('should export an object', function ()
        {
            expect(typeof CONST).toBe('object');
            expect(CONST).not.toBeNull();
        });

        it('should export exactly the expected properties', function ()
        {
            var keys = Object.keys(CONST).sort();
            var expected = [
                'DYNAMIC_BODY',
                'FACING_DOWN',
                'FACING_LEFT',
                'FACING_NONE',
                'FACING_RIGHT',
                'FACING_UP',
                'GROUP',
                'STATIC_BODY',
                'TILEMAPLAYER'
            ].sort();

            expect(keys).toEqual(expected);
        });
    });
});
