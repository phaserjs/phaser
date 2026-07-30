var PlaceOnRectangle = require('../../src/actions/PlaceOnRectangle');

describe('Phaser.Actions.PlaceOnRectangle', function ()
{
    var rect;
    var items;

    function makeItems(count)
    {
        var arr = [];
        for (var i = 0; i < count; i++)
        {
            arr.push({ x: 0, y: 0 });
        }
        return arr;
    }

    beforeEach(function ()
    {
        // 100x50 rectangle at origin — perimeter = 300
        rect = { x: 0, y: 0, width: 100, height: 50, left: 0, right: 100, top: 0, bottom: 50 };
        items = makeItems(4);
    });

    it('should return the same array that was passed in', function ()
    {
        var result = PlaceOnRectangle(items, rect);
        expect(result).toBe(items);
    });

    it('should return an empty array unchanged', function ()
    {
        var empty = [];
        var result = PlaceOnRectangle(empty, rect);
        expect(result).toBe(empty);
        expect(result.length).toBe(0);
    });

    it('should assign x and y properties to each item', function ()
    {
        PlaceOnRectangle(items, rect);
        for (var i = 0; i < items.length; i++)
        {
            expect(typeof items[i].x).toBe('number');
            expect(typeof items[i].y).toBe('number');
        }
    });

    it('should place items with coordinates on the rectangle perimeter', function ()
    {
        PlaceOnRectangle(items, rect);
        for (var i = 0; i < items.length; i++)
        {
            var x = items[i].x;
            var y = items[i].y;
            // Each point must lie on one of the four edges
            var onTop = (y === rect.top && x >= rect.left && x <= rect.right);
            var onBottom = (y === rect.bottom && x >= rect.left && x <= rect.right);
            var onLeft = (x === rect.left && y >= rect.top && y <= rect.bottom);
            var onRight = (x === rect.right && y >= rect.top && y <= rect.bottom);
            expect(onTop || onBottom || onLeft || onRight).toBe(true);
        }
    });

    it('should default shift to 0 when not provided', function ()
    {
        var a = makeItems(4);
        var b = makeItems(4);
        PlaceOnRectangle(a, rect);
        PlaceOnRectangle(b, rect, 0);
        for (var i = 0; i < 4; i++)
        {
            expect(a[i].x).toBe(b[i].x);
            expect(a[i].y).toBe(b[i].y);
        }
    });

    it('should shift placement clockwise when shift is positive', function ()
    {
        var unshifted = makeItems(4);
        var shifted = makeItems(4);
        PlaceOnRectangle(unshifted, rect, 0);
        PlaceOnRectangle(shifted, rect, 1);
        // First item of shifted should equal second item of unshifted
        expect(shifted[0].x).toBeCloseTo(unshifted[1].x, 5);
        expect(shifted[0].y).toBeCloseTo(unshifted[1].y, 5);
    });

    it('should shift placement counter-clockwise when shift is negative', function ()
    {
        var unshifted = makeItems(4);
        var shifted = makeItems(4);
        PlaceOnRectangle(unshifted, rect, 0);
        PlaceOnRectangle(shifted, rect, -1);
        // First item of shifted-by-(-1) should equal last item of unshifted
        expect(shifted[0].x).toBeCloseTo(unshifted[3].x, 5);
        expect(shifted[0].y).toBeCloseTo(unshifted[3].y, 5);
    });

    it('should place all items at different positions when count is small', function ()
    {
        PlaceOnRectangle(items, rect); // 4 items, evenly spaced around perimeter
        var positions = items.map(function (item) { return item.x + ',' + item.y; });
        var unique = positions.filter(function (val, idx, arr) { return arr.indexOf(val) === idx; });
        expect(unique.length).toBe(items.length);
    });

    it('should work with a single item', function ()
    {
        var single = [{ x: 0, y: 0 }];
        PlaceOnRectangle(single, rect);
        expect(typeof single[0].x).toBe('number');
        expect(typeof single[0].y).toBe('number');
    });

    it('should work with a larger set of items', function ()
    {
        var many = makeItems(20);
        var result = PlaceOnRectangle(many, rect);
        expect(result.length).toBe(20);
        for (var i = 0; i < many.length; i++)
        {
            expect(typeof many[i].x).toBe('number');
            expect(typeof many[i].y).toBe('number');
        }
    });

    it('should start placement from the top-left corner with no shift', function ()
    {
        // With no shift the first point originates at rect.x, rect.y (top-left)
        PlaceOnRectangle(items, rect, 0);
        expect(items[0].x).toBeCloseTo(rect.x, 5);
        expect(items[0].y).toBeCloseTo(rect.y, 5);
    });

    it('should handle a shift equal to the number of items (full wrap)', function ()
    {
        var base = makeItems(4);
        var wrapped = makeItems(4);
        PlaceOnRectangle(base, rect, 0);
        PlaceOnRectangle(wrapped, rect, 4); // full rotation brings it back to start
        for (var i = 0; i < 4; i++)
        {
            expect(wrapped[i].x).toBeCloseTo(base[i].x, 5);
            expect(wrapped[i].y).toBeCloseTo(base[i].y, 5);
        }
    });

    it('should work with a non-square rectangle', function ()
    {
        var wideRect = { x: 10, y: 20, width: 200, height: 40, left: 10, right: 210, top: 20, bottom: 60 };
        var wideItems = makeItems(8);
        var result = PlaceOnRectangle(wideItems, wideRect);
        expect(result).toBe(wideItems);
        for (var i = 0; i < wideItems.length; i++)
        {
            expect(typeof wideItems[i].x).toBe('number');
            expect(typeof wideItems[i].y).toBe('number');
        }
    });

    it('should work with a rectangle at a non-zero origin', function ()
    {
        var offsetRect = { x: 50, y: 100, width: 80, height: 60, left: 50, right: 130, top: 100, bottom: 160 };
        var offsetItems = makeItems(4);
        PlaceOnRectangle(offsetItems, offsetRect);
        expect(offsetItems[0].x).toBeCloseTo(50, 5);
        expect(offsetItems[0].y).toBeCloseTo(100, 5);
    });
});
