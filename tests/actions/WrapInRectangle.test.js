var WrapInRectangle = require('../../src/actions/WrapInRectangle');

describe('Phaser.Actions.WrapInRectangle', function ()
{
    var rect;

    beforeEach(function ()
    {
        rect = { left: 0, right: 100, top: 0, bottom: 100 };
    });

    it('should return the items array', function ()
    {
        var items = [];
        var result = WrapInRectangle(items, rect);
        expect(result).toBe(items);
    });

    it('should return an empty array unchanged', function ()
    {
        var items = [];
        var result = WrapInRectangle(items, rect);
        expect(result).toEqual([]);
    });

    it('should leave coordinates inside the rectangle unchanged', function ()
    {
        var items = [{ x: 50, y: 50 }];
        WrapInRectangle(items, rect);
        expect(items[0].x).toBe(50);
        expect(items[0].y).toBe(50);
    });

    it('should wrap x when it equals rect.right', function ()
    {
        var items = [{ x: 100, y: 50 }];
        WrapInRectangle(items, rect);
        expect(items[0].x).toBe(0);
    });

    it('should wrap y when it equals rect.bottom', function ()
    {
        var items = [{ x: 50, y: 100 }];
        WrapInRectangle(items, rect);
        expect(items[0].y).toBe(0);
    });

    it('should wrap x when it is less than rect.left', function ()
    {
        var items = [{ x: -10, y: 50 }];
        WrapInRectangle(items, rect);
        expect(items[0].x).toBeCloseTo(90);
    });

    it('should wrap x when it exceeds rect.right', function ()
    {
        var items = [{ x: 110, y: 50 }];
        WrapInRectangle(items, rect);
        expect(items[0].x).toBeCloseTo(10);
    });

    it('should wrap y when it is less than rect.top', function ()
    {
        var items = [{ x: 50, y: -10 }];
        WrapInRectangle(items, rect);
        expect(items[0].y).toBeCloseTo(90);
    });

    it('should wrap y when it exceeds rect.bottom', function ()
    {
        var items = [{ x: 50, y: 110 }];
        WrapInRectangle(items, rect);
        expect(items[0].y).toBeCloseTo(10);
    });

    it('should default padding to 0 when not provided', function ()
    {
        var items = [{ x: 100, y: 100 }];
        WrapInRectangle(items, rect);
        expect(items[0].x).toBe(0);
        expect(items[0].y).toBe(0);
    });

    it('should apply padding to expand the wrap boundary', function ()
    {
        var items = [{ x: -5, y: 50 }];
        WrapInRectangle(items, rect, 10);
        expect(items[0].x).toBe(-5);
        expect(items[0].y).toBe(50);
    });

    it('should wrap x accounting for padding on the left', function ()
    {
        // range is [left-padding, right+padding) = [-10, 110), width = 120
        // Wrap(-15, -10, 110) = -10 + 115 = 105
        var items = [{ x: -15, y: 50 }];
        WrapInRectangle(items, rect, 10);
        expect(items[0].x).toBeCloseTo(105);
    });

    it('should wrap x accounting for padding on the right', function ()
    {
        // Wrap(115, -10, 110) = -10 + 5 = -5
        var items = [{ x: 115, y: 50 }];
        WrapInRectangle(items, rect, 10);
        expect(items[0].x).toBeCloseTo(-5);
    });

    it('should wrap y accounting for padding on the top', function ()
    {
        // Wrap(-15, -10, 110) = 105
        var items = [{ x: 50, y: -15 }];
        WrapInRectangle(items, rect, 10);
        expect(items[0].y).toBeCloseTo(105);
    });

    it('should wrap y accounting for padding on the bottom', function ()
    {
        // Wrap(115, -10, 110) = -5
        var items = [{ x: 50, y: 115 }];
        WrapInRectangle(items, rect, 10);
        expect(items[0].y).toBeCloseTo(-5);
    });

    it('should process all items in the array', function ()
    {
        var items = [
            { x: -10, y: 50 },
            { x: 50, y: -10 },
            { x: 110, y: 110 }
        ];
        WrapInRectangle(items, rect);
        expect(items[0].x).toBeCloseTo(90);
        expect(items[1].y).toBeCloseTo(90);
        expect(items[2].x).toBeCloseTo(10);
        expect(items[2].y).toBeCloseTo(10);
    });

    it('should mutate items in place', function ()
    {
        var item = { x: 150, y: 150 };
        var items = [item];
        WrapInRectangle(items, rect);
        expect(item.x).toBeCloseTo(50);
        expect(item.y).toBeCloseTo(50);
    });

    it('should work with a non-zero-origin rectangle', function ()
    {
        var offsetRect = { left: 50, right: 150, top: 50, bottom: 150 };
        var items = [{ x: 40, y: 160 }];
        WrapInRectangle(items, offsetRect);
        expect(items[0].x).toBeCloseTo(140);
        expect(items[0].y).toBeCloseTo(60);
    });

    it('should handle zero padding explicitly', function ()
    {
        var items = [{ x: 100, y: 100 }];
        WrapInRectangle(items, rect, 0);
        expect(items[0].x).toBe(0);
        expect(items[0].y).toBe(0);
    });
});
