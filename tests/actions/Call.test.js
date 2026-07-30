var Call = require('../../src/actions/Call');

describe('Phaser.Actions.Call', function ()
{
    it('should return the items array', function ()
    {
        var items = [ { x: 1 }, { x: 2 } ];
        var result = Call(items, function () {}, {});

        expect(result).toBe(items);
    });

    it('should invoke the callback once per item', function ()
    {
        var items = [ { x: 1 }, { x: 2 }, { x: 3 } ];
        var count = 0;

        Call(items, function () { count++; }, {});

        expect(count).toBe(3);
    });

    it('should pass each item to the callback', function ()
    {
        var items = [ { id: 'a' }, { id: 'b' }, { id: 'c' } ];
        var received = [];

        Call(items, function (item) { received.push(item); }, {});

        expect(received).toEqual(items);
        expect(received[0]).toBe(items[0]);
        expect(received[1]).toBe(items[1]);
        expect(received[2]).toBe(items[2]);
    });

    it('should invoke the callback with the given context', function ()
    {
        var items = [ { x: 1 } ];
        var context = { multiplier: 2 };
        var capturedContext;

        Call(items, function ()
        {
            capturedContext = this;
        }, context);

        expect(capturedContext).toBe(context);
    });

    it('should allow the callback to mutate each item', function ()
    {
        var items = [ { x: 1 }, { x: 2 }, { x: 3 } ];

        Call(items, function (item) { item.x *= 10; }, {});

        expect(items[0].x).toBe(10);
        expect(items[1].x).toBe(20);
        expect(items[2].x).toBe(30);
    });

    it('should work with an empty array', function ()
    {
        var items = [];
        var count = 0;

        var result = Call(items, function () { count++; }, {});

        expect(result).toBe(items);
        expect(count).toBe(0);
    });

    it('should work with a single item array', function ()
    {
        var items = [ { value: 42 } ];
        var received = [];

        Call(items, function (item) { received.push(item); }, {});

        expect(received.length).toBe(1);
        expect(received[0]).toBe(items[0]);
    });

    it('should use the context when accessing this properties in the callback', function ()
    {
        var items = [ { x: 1 }, { x: 2 } ];
        var context = { offset: 100 };

        Call(items, function (item)
        {
            item.x += this.offset;
        }, context);

        expect(items[0].x).toBe(101);
        expect(items[1].x).toBe(102);
    });

    it('should work with a large array', function ()
    {
        var items = [];
        for (var i = 0; i < 1000; i++)
        {
            items.push({ index: i, visited: false });
        }

        Call(items, function (item) { item.visited = true; }, {});

        for (var j = 0; j < items.length; j++)
        {
            expect(items[j].visited).toBe(true);
        }
    });

    it('should invoke callbacks in order', function ()
    {
        var items = [ { n: 1 }, { n: 2 }, { n: 3 } ];
        var order = [];

        Call(items, function (item) { order.push(item.n); }, {});

        expect(order).toEqual([ 1, 2, 3 ]);
    });
});
