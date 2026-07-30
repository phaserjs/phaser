var Commands = require('../../../src/gameobjects/graphics/Commands');

describe('Commands', function ()
{
    it('should export ARC as 0', function ()
    {
        expect(Commands.ARC).toBe(0);
    });

    it('should export BEGIN_PATH as 1', function ()
    {
        expect(Commands.BEGIN_PATH).toBe(1);
    });

    it('should export CLOSE_PATH as 2', function ()
    {
        expect(Commands.CLOSE_PATH).toBe(2);
    });

    it('should export FILL_RECT as 3', function ()
    {
        expect(Commands.FILL_RECT).toBe(3);
    });

    it('should export LINE_TO as 4', function ()
    {
        expect(Commands.LINE_TO).toBe(4);
    });

    it('should export MOVE_TO as 5', function ()
    {
        expect(Commands.MOVE_TO).toBe(5);
    });

    it('should export LINE_STYLE as 6', function ()
    {
        expect(Commands.LINE_STYLE).toBe(6);
    });

    it('should export FILL_STYLE as 7', function ()
    {
        expect(Commands.FILL_STYLE).toBe(7);
    });

    it('should export FILL_PATH as 8', function ()
    {
        expect(Commands.FILL_PATH).toBe(8);
    });

    it('should export STROKE_PATH as 9', function ()
    {
        expect(Commands.STROKE_PATH).toBe(9);
    });

    it('should export FILL_TRIANGLE as 10', function ()
    {
        expect(Commands.FILL_TRIANGLE).toBe(10);
    });

    it('should export STROKE_TRIANGLE as 11', function ()
    {
        expect(Commands.STROKE_TRIANGLE).toBe(11);
    });

    it('should export SAVE as 14', function ()
    {
        expect(Commands.SAVE).toBe(14);
    });

    it('should export RESTORE as 15', function ()
    {
        expect(Commands.RESTORE).toBe(15);
    });

    it('should export TRANSLATE as 16', function ()
    {
        expect(Commands.TRANSLATE).toBe(16);
    });

    it('should export SCALE as 17', function ()
    {
        expect(Commands.SCALE).toBe(17);
    });

    it('should export ROTATE as 18', function ()
    {
        expect(Commands.ROTATE).toBe(18);
    });

    it('should export GRADIENT_FILL_STYLE as 21', function ()
    {
        expect(Commands.GRADIENT_FILL_STYLE).toBe(21);
    });

    it('should export GRADIENT_LINE_STYLE as 22', function ()
    {
        expect(Commands.GRADIENT_LINE_STYLE).toBe(22);
    });

    it('should have no duplicate values', function ()
    {
        var values = Object.values(Commands);
        var unique = new Set(values);

        expect(unique.size).toBe(values.length);
    });

    it('should export exactly 19 constants', function ()
    {
        expect(Object.keys(Commands).length).toBe(19);
    });

    it('should have all values as integers', function ()
    {
        Object.values(Commands).forEach(function (value)
        {
            expect(Number.isInteger(value)).toBe(true);
        });
    });
});
