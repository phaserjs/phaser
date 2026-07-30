var ShiftPosition = require('../../src/actions/ShiftPosition');

describe('Phaser.Actions.ShiftPosition', function ()
{
    function makeItem (x, y)
    {
        return { x: x, y: y };
    }

    // -------------------------------------------------------------------------
    // Single-item array
    // -------------------------------------------------------------------------

    describe('single item array', function ()
    {
        it('should set the item position to the given x/y', function ()
        {
            var items = [ makeItem(10, 20) ];

            ShiftPosition(items, 5, 15);

            expect(items[0].x).toBe(5);
            expect(items[0].y).toBe(15);
        });

        it('should return the original item position in the output vector', function ()
        {
            var items = [ makeItem(10, 20) ];

            var result = ShiftPosition(items, 5, 15);

            expect(result.x).toBe(10);
            expect(result.y).toBe(20);
        });

        it('should work when the item starts at the origin', function ()
        {
            var items = [ makeItem(0, 0) ];

            var result = ShiftPosition(items, 99, 88);

            expect(items[0].x).toBe(99);
            expect(items[0].y).toBe(88);
            expect(result.x).toBe(0);
            expect(result.y).toBe(0);
        });
    });

    // -------------------------------------------------------------------------
    // Default direction (0) — head is the LAST element
    // -------------------------------------------------------------------------

    describe('direction 0 (default, head = last item)', function ()
    {
        it('should set the last item to the given x/y', function ()
        {
            var items = [ makeItem(1, 2), makeItem(3, 4) ];

            ShiftPosition(items, 10, 20, 0);

            expect(items[1].x).toBe(10);
            expect(items[1].y).toBe(20);
        });

        it('should shift positions from last to first for two items', function ()
        {
            var items = [ makeItem(1, 2), makeItem(3, 4) ];

            ShiftPosition(items, 10, 20, 0);

            // first item gets old position of the head (last item)
            expect(items[0].x).toBe(3);
            expect(items[0].y).toBe(4);
        });

        it('should return the evicted tail position for two items', function ()
        {
            var items = [ makeItem(1, 2), makeItem(3, 4) ];

            var result = ShiftPosition(items, 10, 20, 0);

            expect(result.x).toBe(1);
            expect(result.y).toBe(2);
        });

        it('should shift positions correctly for three items', function ()
        {
            var items = [ makeItem(1, 2), makeItem(3, 4), makeItem(5, 6) ];

            var result = ShiftPosition(items, 10, 20, 0);

            // head (index 2) gets new coords
            expect(items[2].x).toBe(10);
            expect(items[2].y).toBe(20);
            // index 1 gets old head position
            expect(items[1].x).toBe(5);
            expect(items[1].y).toBe(6);
            // index 0 gets old index 1 position
            expect(items[0].x).toBe(3);
            expect(items[0].y).toBe(4);
            // output holds the evicted position
            expect(result.x).toBe(1);
            expect(result.y).toBe(2);
        });

        it('should shift positions correctly for four items', function ()
        {
            var items = [
                makeItem(1, 2),
                makeItem(3, 4),
                makeItem(5, 6),
                makeItem(7, 8)
            ];

            var result = ShiftPosition(items, 10, 20, 0);

            expect(items[3].x).toBe(10);
            expect(items[3].y).toBe(20);
            expect(items[2].x).toBe(7);
            expect(items[2].y).toBe(8);
            expect(items[1].x).toBe(5);
            expect(items[1].y).toBe(6);
            expect(items[0].x).toBe(3);
            expect(items[0].y).toBe(4);
            expect(result.x).toBe(1);
            expect(result.y).toBe(2);
        });

        it('should use direction 0 when direction is not provided', function ()
        {
            var items = [ makeItem(1, 2), makeItem(3, 4), makeItem(5, 6) ];

            var result = ShiftPosition(items, 10, 20);

            // same as direction 0
            expect(items[2].x).toBe(10);
            expect(items[2].y).toBe(20);
            expect(items[1].x).toBe(5);
            expect(items[1].y).toBe(6);
            expect(items[0].x).toBe(3);
            expect(items[0].y).toBe(4);
            expect(result.x).toBe(1);
            expect(result.y).toBe(2);
        });
    });

    // -------------------------------------------------------------------------
    // Direction 1 — head is the FIRST element
    // -------------------------------------------------------------------------

    describe('direction 1 (head = first item)', function ()
    {
        it('should set the first item to the given x/y', function ()
        {
            var items = [ makeItem(1, 2), makeItem(3, 4) ];

            ShiftPosition(items, 10, 20, 1);

            expect(items[0].x).toBe(10);
            expect(items[0].y).toBe(20);
        });

        it('should shift positions from first to last for two items', function ()
        {
            var items = [ makeItem(1, 2), makeItem(3, 4) ];

            ShiftPosition(items, 10, 20, 1);

            // second item gets old head (first item) position
            expect(items[1].x).toBe(1);
            expect(items[1].y).toBe(2);
        });

        it('should return the evicted tail position for two items', function ()
        {
            var items = [ makeItem(1, 2), makeItem(3, 4) ];

            var result = ShiftPosition(items, 10, 20, 1);

            expect(result.x).toBe(3);
            expect(result.y).toBe(4);
        });

        it('should shift positions correctly for three items', function ()
        {
            var items = [ makeItem(1, 2), makeItem(3, 4), makeItem(5, 6) ];

            var result = ShiftPosition(items, 10, 20, 1);

            // head (index 0) gets new coords
            expect(items[0].x).toBe(10);
            expect(items[0].y).toBe(20);
            // index 1 gets old head position
            expect(items[1].x).toBe(1);
            expect(items[1].y).toBe(2);
            // index 2 gets old index 1 position
            expect(items[2].x).toBe(3);
            expect(items[2].y).toBe(4);
            // output holds the evicted position
            expect(result.x).toBe(5);
            expect(result.y).toBe(6);
        });

        it('should shift positions correctly for four items', function ()
        {
            var items = [
                makeItem(1, 2),
                makeItem(3, 4),
                makeItem(5, 6),
                makeItem(7, 8)
            ];

            var result = ShiftPosition(items, 10, 20, 1);

            expect(items[0].x).toBe(10);
            expect(items[0].y).toBe(20);
            expect(items[1].x).toBe(1);
            expect(items[1].y).toBe(2);
            expect(items[2].x).toBe(3);
            expect(items[2].y).toBe(4);
            expect(items[3].x).toBe(5);
            expect(items[3].y).toBe(6);
            expect(result.x).toBe(7);
            expect(result.y).toBe(8);
        });
    });

    // -------------------------------------------------------------------------
    // Output vector
    // -------------------------------------------------------------------------

    describe('output parameter', function ()
    {
        it('should return a new Vector2-like object when output is not provided', function ()
        {
            var items = [ makeItem(1, 2), makeItem(3, 4) ];

            var result = ShiftPosition(items, 10, 20);

            expect(result).toBeDefined();
            expect(typeof result.x).toBe('number');
            expect(typeof result.y).toBe('number');
        });

        it('should write result into a provided output object', function ()
        {
            var items = [ makeItem(1, 2), makeItem(3, 4) ];
            var output = { x: 0, y: 0 };

            var result = ShiftPosition(items, 10, 20, 0, output);

            expect(result).toBe(output);
            expect(output.x).toBe(1);
            expect(output.y).toBe(2);
        });

        it('should return the same output reference that was passed in', function ()
        {
            var items = [ makeItem(5, 10) ];
            var output = { x: 0, y: 0 };

            var result = ShiftPosition(items, 99, 88, 0, output);

            expect(result).toBe(output);
        });

        it('should overwrite previous values in a reused output object', function ()
        {
            var items = [ makeItem(1, 2), makeItem(3, 4) ];
            var output = { x: 999, y: 999 };

            ShiftPosition(items, 10, 20, 0, output);

            expect(output.x).toBe(1);
            expect(output.y).toBe(2);
        });
    });

    // -------------------------------------------------------------------------
    // Floating point coordinates
    // -------------------------------------------------------------------------

    describe('floating point coordinates', function ()
    {
        it('should handle floating point x/y values', function ()
        {
            var items = [ makeItem(0.5, 1.5), makeItem(2.5, 3.5) ];

            var result = ShiftPosition(items, 10.1, 20.2, 0);

            expect(items[1].x).toBeCloseTo(10.1);
            expect(items[1].y).toBeCloseTo(20.2);
            expect(items[0].x).toBeCloseTo(2.5);
            expect(items[0].y).toBeCloseTo(3.5);
            expect(result.x).toBeCloseTo(0.5);
            expect(result.y).toBeCloseTo(1.5);
        });
    });

    // -------------------------------------------------------------------------
    // Negative coordinates
    // -------------------------------------------------------------------------

    describe('negative coordinates', function ()
    {
        it('should handle negative x/y target values', function ()
        {
            var items = [ makeItem(10, 20), makeItem(30, 40) ];

            var result = ShiftPosition(items, -5, -10, 0);

            expect(items[1].x).toBe(-5);
            expect(items[1].y).toBe(-10);
            expect(items[0].x).toBe(30);
            expect(items[0].y).toBe(40);
            expect(result.x).toBe(10);
            expect(result.y).toBe(20);
        });

        it('should handle items with negative starting positions', function ()
        {
            var items = [ makeItem(-1, -2), makeItem(-3, -4) ];

            var result = ShiftPosition(items, 0, 0, 0);

            expect(items[1].x).toBe(0);
            expect(items[1].y).toBe(0);
            expect(items[0].x).toBe(-3);
            expect(items[0].y).toBe(-4);
            expect(result.x).toBe(-1);
            expect(result.y).toBe(-2);
        });
    });

    // -------------------------------------------------------------------------
    // Zero coordinates
    // -------------------------------------------------------------------------

    describe('zero coordinates', function ()
    {
        it('should handle x=0, y=0 as the target', function ()
        {
            var items = [ makeItem(5, 10), makeItem(15, 20) ];

            var result = ShiftPosition(items, 0, 0, 0);

            expect(items[1].x).toBe(0);
            expect(items[1].y).toBe(0);
            expect(items[0].x).toBe(15);
            expect(items[0].y).toBe(20);
            expect(result.x).toBe(5);
            expect(result.y).toBe(10);
        });
    });
});
