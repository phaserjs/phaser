var AlignTo = require('../../src/actions/AlignTo');
var ALIGN_CONST = require('../../src/display/align/const');

describe('Phaser.Actions.AlignTo', function ()
{
    function makeObject(x, y, width, height)
    {
        return { x: x, y: y, width: width, height: height, originX: 0, originY: 0 };
    }

    it('should return the items array', function ()
    {
        var items = [ makeObject(0, 0, 100, 50) ];
        var result = AlignTo(items, ALIGN_CONST.RIGHT_CENTER);

        expect(result).toBe(items);
    });

    it('should return an empty array unchanged', function ()
    {
        var items = [];
        var result = AlignTo(items, ALIGN_CONST.RIGHT_CENTER);

        expect(result).toBe(items);
        expect(result.length).toBe(0);
    });

    it('should not move the first item', function ()
    {
        var items = [
            makeObject(50, 100, 100, 50),
            makeObject(0, 0, 80, 40)
        ];

        AlignTo(items, ALIGN_CONST.RIGHT_CENTER);

        expect(items[0].x).toBe(50);
        expect(items[0].y).toBe(100);
    });

    it('should align the second item to the right-center of the first', function ()
    {
        var items = [
            makeObject(0, 0, 100, 50),
            makeObject(0, 0, 80, 40)
        ];

        AlignTo(items, ALIGN_CONST.RIGHT_CENTER);

        // GetRight(first) = 0 + 100 - 0 = 100 -> SetLeft(second, 100) -> second.x = 100
        // GetCenterY(first) = 0 + 25 -> SetCenterY(second, 25) -> second.y = 25 - 20 = 5
        expect(items[1].x).toBe(100);
        expect(items[1].y).toBe(5);
    });

    it('should chain alignment: each item aligns to the previous one', function ()
    {
        var items = [
            makeObject(0, 0, 100, 50),
            makeObject(0, 0, 80, 40),
            makeObject(0, 0, 60, 30)
        ];

        AlignTo(items, ALIGN_CONST.RIGHT_CENTER);

        // second aligns to first: x=100, y=5
        expect(items[1].x).toBe(100);
        expect(items[1].y).toBe(5);

        // third aligns to second (now at x=100, y=5, width=80, height=40):
        // GetRight(second) = 100 + 80 = 180 -> third.x = 180
        // GetCenterY(second) = 5 + 20 = 25 -> SetCenterY(third, 25) -> third.y = 25 - 15 = 10
        expect(items[2].x).toBe(180);
        expect(items[2].y).toBe(10);
    });

    it('should apply a positive horizontal offset', function ()
    {
        var items = [
            makeObject(0, 0, 100, 50),
            makeObject(0, 0, 80, 40)
        ];

        AlignTo(items, ALIGN_CONST.RIGHT_CENTER, 10, 0);

        // GetRight(first) = 100, offsetX=10 -> second.x = 110
        expect(items[1].x).toBe(110);
    });

    it('should apply a negative horizontal offset', function ()
    {
        var items = [
            makeObject(0, 0, 100, 50),
            makeObject(0, 0, 80, 40)
        ];

        AlignTo(items, ALIGN_CONST.RIGHT_CENTER, -10, 0);

        expect(items[1].x).toBe(90);
    });

    it('should apply a positive vertical offset', function ()
    {
        var items = [
            makeObject(0, 0, 100, 50),
            makeObject(0, 0, 80, 40)
        ];

        AlignTo(items, ALIGN_CONST.RIGHT_CENTER, 0, 5);

        // GetCenterY(first) = 25, offsetY=5 -> SetCenterY(second, 30) -> second.y = 30 - 20 = 10
        expect(items[1].y).toBe(10);
    });

    it('should apply a negative vertical offset', function ()
    {
        var items = [
            makeObject(0, 0, 100, 50),
            makeObject(0, 0, 80, 40)
        ];

        AlignTo(items, ALIGN_CONST.RIGHT_CENTER, 0, -5);

        // GetCenterY(first) = 25, offsetY=-5 -> SetCenterY(second, 20) -> second.y = 20 - 20 = 0
        expect(items[1].y).toBe(0);
    });

    it('should work with a single item array without error', function ()
    {
        var items = [ makeObject(10, 20, 100, 50) ];

        expect(function ()
        {
            AlignTo(items, ALIGN_CONST.RIGHT_CENTER);
        }).not.toThrow();

        expect(items[0].x).toBe(10);
        expect(items[0].y).toBe(20);
    });

    it('should align using TOP_LEFT position', function ()
    {
        var items = [
            makeObject(0, 0, 100, 50),
            makeObject(0, 0, 80, 40)
        ];

        AlignTo(items, ALIGN_CONST.TOP_LEFT);

        // TOP_LEFT: SetLeft(child, GetLeft(target)), SetBottom(child, GetTop(target))
        // GetLeft(target) = 0 - 100*0 = 0 -> SetLeft(child, 0) -> child.x = 0 + 80*0 = 0
        // GetTop(target) = 0 - 50*0 = 0 -> SetBottom(child, 0) -> child.y = (0 - 40) + 40*0 = -40
        expect(items[1].x).toBe(0);
        expect(items[1].y).toBe(-40);
    });

    it('should work with non-zero object positions', function ()
    {
        var items = [
            makeObject(200, 150, 100, 50),
            makeObject(0, 0, 80, 40)
        ];

        AlignTo(items, ALIGN_CONST.RIGHT_CENTER);

        // GetRight(first) = 200 + 100 = 300 -> second.x = 300
        // GetCenterY(first) = 150 + 25 = 175 -> second.y = 175 - 20 = 155
        expect(items[1].x).toBe(300);
        expect(items[1].y).toBe(155);
    });

    it('should work with both offsets applied together', function ()
    {
        var items = [
            makeObject(0, 0, 100, 50),
            makeObject(0, 0, 80, 40)
        ];

        AlignTo(items, ALIGN_CONST.RIGHT_CENTER, 5, 10);

        // GetRight(first) = 100, offsetX=5 -> second.x = 105
        // GetCenterY(first) = 25, offsetY=10 -> SetCenterY(second, 35) -> second.y = 35 - 20 = 15
        expect(items[1].x).toBe(105);
        expect(items[1].y).toBe(15);
    });

    it('should handle many items in sequence', function ()
    {
        var items = [];
        var i;

        for (i = 0; i < 5; i++)
        {
            items.push(makeObject(0, 0, 100, 50));
        }

        AlignTo(items, ALIGN_CONST.RIGHT_CENTER);

        // Each item is 100 wide, chained to the right of the previous
        // All have same height=50 so center alignment produces y=0
        for (i = 1; i < items.length; i++)
        {
            expect(items[i].x).toBe(i * 100);
            expect(items[i].y).toBe(0);
        }
    });
});
