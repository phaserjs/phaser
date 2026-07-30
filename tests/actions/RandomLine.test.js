var RandomLine = require('../../src/actions/RandomLine');

describe('Phaser.Actions.RandomLine', function ()
{
    var line;

    beforeEach(function ()
    {
        line = { x1: 0, y1: 0, x2: 100, y2: 100 };
    });

    it('should return the items array', function ()
    {
        var items = [ { x: 0, y: 0 } ];

        var result = RandomLine(items, line);

        expect(result).toBe(items);
    });

    it('should return an empty array unchanged when passed an empty array', function ()
    {
        var items = [];

        var result = RandomLine(items, line);

        expect(result).toBe(items);
        expect(result.length).toBe(0);
    });

    it('should set x and y on each item', function ()
    {
        var items = [ { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 } ];

        RandomLine(items, line);

        for (var i = 0; i < items.length; i++)
        {
            expect(typeof items[i].x).toBe('number');
            expect(typeof items[i].y).toBe('number');
        }
    });

    it('should position items within the bounds of the line', function ()
    {
        var items = [];

        for (var i = 0; i < 50; i++)
        {
            items.push({ x: 0, y: 0 });
        }

        RandomLine(items, line);

        for (var j = 0; j < items.length; j++)
        {
            expect(items[j].x).toBeGreaterThanOrEqual(0);
            expect(items[j].x).toBeLessThanOrEqual(100);
            expect(items[j].y).toBeGreaterThanOrEqual(0);
            expect(items[j].y).toBeLessThanOrEqual(100);
        }
    });

    it('should place items on a horizontal line', function ()
    {
        var hline = { x1: 0, y1: 50, x2: 200, y2: 50 };
        var items = [];

        for (var i = 0; i < 20; i++)
        {
            items.push({ x: 0, y: 0 });
        }

        RandomLine(items, hline);

        for (var j = 0; j < items.length; j++)
        {
            expect(items[j].x).toBeGreaterThanOrEqual(0);
            expect(items[j].x).toBeLessThanOrEqual(200);
            expect(items[j].y).toBeCloseTo(50);
        }
    });

    it('should place items on a vertical line', function ()
    {
        var vline = { x1: 75, y1: 0, x2: 75, y2: 300 };
        var items = [];

        for (var i = 0; i < 20; i++)
        {
            items.push({ x: 0, y: 0 });
        }

        RandomLine(items, vline);

        for (var j = 0; j < items.length; j++)
        {
            expect(items[j].x).toBeCloseTo(75);
            expect(items[j].y).toBeGreaterThanOrEqual(0);
            expect(items[j].y).toBeLessThanOrEqual(300);
        }
    });

    it('should place items exactly on a zero-length line (point)', function ()
    {
        var point = { x1: 42, y1: 17, x2: 42, y2: 17 };
        var items = [ { x: 0, y: 0 }, { x: 0, y: 0 } ];

        RandomLine(items, point);

        expect(items[0].x).toBeCloseTo(42);
        expect(items[0].y).toBeCloseTo(17);
        expect(items[1].x).toBeCloseTo(42);
        expect(items[1].y).toBeCloseTo(17);
    });

    it('should handle a line with negative coordinates', function ()
    {
        var nline = { x1: -100, y1: -100, x2: -50, y2: -50 };
        var items = [];

        for (var i = 0; i < 20; i++)
        {
            items.push({ x: 0, y: 0 });
        }

        RandomLine(items, nline);

        for (var j = 0; j < items.length; j++)
        {
            expect(items[j].x).toBeGreaterThanOrEqual(-100);
            expect(items[j].x).toBeLessThanOrEqual(-50);
            expect(items[j].y).toBeGreaterThanOrEqual(-100);
            expect(items[j].y).toBeLessThanOrEqual(-50);
        }
    });

    it('should handle a line spanning negative to positive coordinates', function ()
    {
        var mixedLine = { x1: -50, y1: -50, x2: 50, y2: 50 };
        var items = [];

        for (var i = 0; i < 20; i++)
        {
            items.push({ x: 0, y: 0 });
        }

        RandomLine(items, mixedLine);

        for (var j = 0; j < items.length; j++)
        {
            expect(items[j].x).toBeGreaterThanOrEqual(-50);
            expect(items[j].x).toBeLessThanOrEqual(50);
            expect(items[j].y).toBeGreaterThanOrEqual(-50);
            expect(items[j].y).toBeLessThanOrEqual(50);
        }
    });

    it('should overwrite existing x and y values on items', function ()
    {
        var items = [ { x: 999, y: 999 } ];

        RandomLine(items, line);

        expect(items[0].x).not.toBe(999);
        expect(items[0].y).not.toBe(999);
    });

    it('should process each item independently', function ()
    {
        var items = [];

        for (var i = 0; i < 100; i++)
        {
            items.push({ x: 0, y: 0 });
        }

        RandomLine(items, line);

        var allSame = true;

        for (var j = 1; j < items.length; j++)
        {
            if (items[j].x !== items[0].x || items[j].y !== items[0].y)
            {
                allSame = false;
                break;
            }
        }

        expect(allSame).toBe(false);
    });

    it('should not modify the line object', function ()
    {
        var items = [ { x: 0, y: 0 }, { x: 0, y: 0 } ];

        RandomLine(items, line);

        expect(line.x1).toBe(0);
        expect(line.y1).toBe(0);
        expect(line.x2).toBe(100);
        expect(line.y2).toBe(100);
    });
});
