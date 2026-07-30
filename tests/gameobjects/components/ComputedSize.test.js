var ComputedSize = require('../../../src/gameobjects/components/ComputedSize');

function createGameObject ()
{
    var obj = {
        scaleX: 1,
        scaleY: 1
    };

    obj.width = ComputedSize.width;
    obj.height = ComputedSize.height;
    obj.setSize = ComputedSize.setSize;
    obj.setDisplaySize = ComputedSize.setDisplaySize;

    Object.defineProperty(obj, 'displayWidth', ComputedSize.displayWidth);
    Object.defineProperty(obj, 'displayHeight', ComputedSize.displayHeight);

    return obj;
}

describe('ComputedSize', function ()
{
    describe('default values', function ()
    {
        it('should have a default width of zero', function ()
        {
            var obj = createGameObject();

            expect(obj.width).toBe(0);
        });

        it('should have a default height of zero', function ()
        {
            var obj = createGameObject();

            expect(obj.height).toBe(0);
        });
    });

    describe('displayWidth getter', function ()
    {
        it('should return scaleX multiplied by width', function ()
        {
            var obj = createGameObject();
            obj.width = 100;
            obj.scaleX = 2;

            expect(obj.displayWidth).toBe(200);
        });

        it('should return zero when width is zero', function ()
        {
            var obj = createGameObject();
            obj.width = 0;
            obj.scaleX = 5;

            expect(obj.displayWidth).toBe(0);
        });

        it('should return width when scaleX is one', function ()
        {
            var obj = createGameObject();
            obj.width = 64;
            obj.scaleX = 1;

            expect(obj.displayWidth).toBe(64);
        });

        it('should handle fractional scaleX values', function ()
        {
            var obj = createGameObject();
            obj.width = 100;
            obj.scaleX = 0.5;

            expect(obj.displayWidth).toBeCloseTo(50);
        });

        it('should handle negative scaleX values', function ()
        {
            var obj = createGameObject();
            obj.width = 100;
            obj.scaleX = -1;

            expect(obj.displayWidth).toBe(-100);
        });
    });

    describe('displayWidth setter', function ()
    {
        it('should set scaleX to value divided by width', function ()
        {
            var obj = createGameObject();
            obj.width = 100;
            obj.displayWidth = 200;

            expect(obj.scaleX).toBe(2);
        });

        it('should set scaleX to one when displayWidth equals width', function ()
        {
            var obj = createGameObject();
            obj.width = 80;
            obj.displayWidth = 80;

            expect(obj.scaleX).toBe(1);
        });

        it('should set scaleX to fractional value for smaller display size', function ()
        {
            var obj = createGameObject();
            obj.width = 100;
            obj.displayWidth = 50;

            expect(obj.scaleX).toBeCloseTo(0.5);
        });

        it('should handle negative display width', function ()
        {
            var obj = createGameObject();
            obj.width = 100;
            obj.displayWidth = -100;

            expect(obj.scaleX).toBe(-1);
        });
    });

    describe('displayHeight getter', function ()
    {
        it('should return scaleY multiplied by height', function ()
        {
            var obj = createGameObject();
            obj.height = 100;
            obj.scaleY = 3;

            expect(obj.displayHeight).toBe(300);
        });

        it('should return zero when height is zero', function ()
        {
            var obj = createGameObject();
            obj.height = 0;
            obj.scaleY = 5;

            expect(obj.displayHeight).toBe(0);
        });

        it('should return height when scaleY is one', function ()
        {
            var obj = createGameObject();
            obj.height = 48;
            obj.scaleY = 1;

            expect(obj.displayHeight).toBe(48);
        });

        it('should handle fractional scaleY values', function ()
        {
            var obj = createGameObject();
            obj.height = 200;
            obj.scaleY = 0.25;

            expect(obj.displayHeight).toBeCloseTo(50);
        });

        it('should handle negative scaleY values', function ()
        {
            var obj = createGameObject();
            obj.height = 100;
            obj.scaleY = -2;

            expect(obj.displayHeight).toBe(-200);
        });
    });

    describe('displayHeight setter', function ()
    {
        it('should set scaleY to value divided by height', function ()
        {
            var obj = createGameObject();
            obj.height = 100;
            obj.displayHeight = 400;

            expect(obj.scaleY).toBe(4);
        });

        it('should set scaleY to one when displayHeight equals height', function ()
        {
            var obj = createGameObject();
            obj.height = 60;
            obj.displayHeight = 60;

            expect(obj.scaleY).toBe(1);
        });

        it('should set scaleY to fractional value for smaller display size', function ()
        {
            var obj = createGameObject();
            obj.height = 200;
            obj.displayHeight = 100;

            expect(obj.scaleY).toBeCloseTo(0.5);
        });

        it('should handle negative display height', function ()
        {
            var obj = createGameObject();
            obj.height = 100;
            obj.displayHeight = -50;

            expect(obj.scaleY).toBeCloseTo(-0.5);
        });
    });

    describe('setSize', function ()
    {
        it('should set width and height', function ()
        {
            var obj = createGameObject();
            obj.setSize(128, 64);

            expect(obj.width).toBe(128);
            expect(obj.height).toBe(64);
        });

        it('should return the game object instance for chaining', function ()
        {
            var obj = createGameObject();
            var result = obj.setSize(100, 100);

            expect(result).toBe(obj);
        });

        it('should set width and height to zero', function ()
        {
            var obj = createGameObject();
            obj.setSize(50, 50);
            obj.setSize(0, 0);

            expect(obj.width).toBe(0);
            expect(obj.height).toBe(0);
        });

        it('should accept floating point values', function ()
        {
            var obj = createGameObject();
            obj.setSize(10.5, 20.75);

            expect(obj.width).toBeCloseTo(10.5);
            expect(obj.height).toBeCloseTo(20.75);
        });

        it('should accept negative values', function ()
        {
            var obj = createGameObject();
            obj.setSize(-10, -20);

            expect(obj.width).toBe(-10);
            expect(obj.height).toBe(-20);
        });

        it('should accept asymmetric width and height', function ()
        {
            var obj = createGameObject();
            obj.setSize(320, 180);

            expect(obj.width).toBe(320);
            expect(obj.height).toBe(180);
        });

        it('should not affect scaleX or scaleY', function ()
        {
            var obj = createGameObject();
            obj.scaleX = 2;
            obj.scaleY = 3;
            obj.setSize(100, 100);

            expect(obj.scaleX).toBe(2);
            expect(obj.scaleY).toBe(3);
        });
    });

    describe('setDisplaySize', function ()
    {
        it('should adjust scaleX and scaleY based on current width and height', function ()
        {
            var obj = createGameObject();
            obj.setSize(100, 200);
            obj.setDisplaySize(200, 100);

            expect(obj.scaleX).toBeCloseTo(2);
            expect(obj.scaleY).toBeCloseTo(0.5);
        });

        it('should return the game object instance for chaining', function ()
        {
            var obj = createGameObject();
            obj.setSize(100, 100);
            var result = obj.setDisplaySize(50, 50);

            expect(result).toBe(obj);
        });

        it('should set scaleX and scaleY to one when display equals native size', function ()
        {
            var obj = createGameObject();
            obj.setSize(64, 64);
            obj.setDisplaySize(64, 64);

            expect(obj.scaleX).toBe(1);
            expect(obj.scaleY).toBe(1);
        });

        it('should allow chaining with setSize', function ()
        {
            var obj = createGameObject();
            var result = obj.setSize(100, 100).setDisplaySize(200, 200);

            expect(result).toBe(obj);
            expect(obj.scaleX).toBe(2);
            expect(obj.scaleY).toBe(2);
        });

        it('should not change width or height properties', function ()
        {
            var obj = createGameObject();
            obj.setSize(100, 100);
            obj.setDisplaySize(300, 300);

            expect(obj.width).toBe(100);
            expect(obj.height).toBe(100);
        });

        it('should handle fractional display sizes', function ()
        {
            var obj = createGameObject();
            obj.setSize(100, 100);
            obj.setDisplaySize(33.33, 66.66);

            expect(obj.scaleX).toBeCloseTo(0.3333);
            expect(obj.scaleY).toBeCloseTo(0.6666);
        });
    });

    describe('chaining', function ()
    {
        it('should support chaining setSize multiple times', function ()
        {
            var obj = createGameObject();
            obj.setSize(10, 10).setSize(20, 20).setSize(30, 30);

            expect(obj.width).toBe(30);
            expect(obj.height).toBe(30);
        });

        it('should support chaining setSize and setDisplaySize', function ()
        {
            var obj = createGameObject();
            obj.setSize(100, 50).setDisplaySize(50, 100);

            expect(obj.width).toBe(100);
            expect(obj.height).toBe(50);
            expect(obj.scaleX).toBeCloseTo(0.5);
            expect(obj.scaleY).toBeCloseTo(2);
        });
    });
});
