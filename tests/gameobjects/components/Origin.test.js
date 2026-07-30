var Origin = require('../../../src/gameobjects/components/Origin');

function createMockObject(width, height)
{
    var obj = {
        width: width !== undefined ? width : 100,
        height: height !== undefined ? height : 100,
        originX: 0.5,
        originY: 0.5,
        _displayOriginX: 0,
        _displayOriginY: 0
    };

    Object.defineProperty(obj, 'displayOriginX',
    {
        get: function ()
        {
            return this._displayOriginX;
        },
        set: function (value)
        {
            this._displayOriginX = value;
            this.originX = value / this.width;
        },
        configurable: true
    });

    Object.defineProperty(obj, 'displayOriginY',
    {
        get: function ()
        {
            return this._displayOriginY;
        },
        set: function (value)
        {
            this._displayOriginY = value;
            this.originY = value / this.height;
        },
        configurable: true
    });

    obj.setOrigin = Origin.setOrigin;
    obj.setOriginFromFrame = Origin.setOriginFromFrame;
    obj.setDisplayOrigin = Origin.setDisplayOrigin;
    obj.updateDisplayOrigin = Origin.updateDisplayOrigin;

    return obj;
}

describe('Origin', function ()
{
    describe('module defaults', function ()
    {
        it('should export an object', function ()
        {
            expect(typeof Origin).toBe('object');
        });

        it('should have originX default of 0.5', function ()
        {
            expect(Origin.originX).toBe(0.5);
        });

        it('should have originY default of 0.5', function ()
        {
            expect(Origin.originY).toBe(0.5);
        });

        it('should have _displayOriginX default of 0', function ()
        {
            expect(Origin._displayOriginX).toBe(0);
        });

        it('should have _displayOriginY default of 0', function ()
        {
            expect(Origin._displayOriginY).toBe(0);
        });

        it('should expose setOrigin as a function', function ()
        {
            expect(typeof Origin.setOrigin).toBe('function');
        });

        it('should expose setOriginFromFrame as a function', function ()
        {
            expect(typeof Origin.setOriginFromFrame).toBe('function');
        });

        it('should expose setDisplayOrigin as a function', function ()
        {
            expect(typeof Origin.setDisplayOrigin).toBe('function');
        });

        it('should expose updateDisplayOrigin as a function', function ()
        {
            expect(typeof Origin.updateDisplayOrigin).toBe('function');
        });
    });

    describe('setOrigin', function ()
    {
        it('should default both axes to 0.5 when called with no arguments', function ()
        {
            var obj = createMockObject(100, 100);
            obj.setOrigin();
            expect(obj.originX).toBe(0.5);
            expect(obj.originY).toBe(0.5);
        });

        it('should set both axes to x when only x is provided', function ()
        {
            var obj = createMockObject(100, 100);
            obj.setOrigin(0.25);
            expect(obj.originX).toBe(0.25);
            expect(obj.originY).toBe(0.25);
        });

        it('should set both axes independently when x and y are provided', function ()
        {
            var obj = createMockObject(100, 100);
            obj.setOrigin(0.2, 0.8);
            expect(obj.originX).toBe(0.2);
            expect(obj.originY).toBe(0.8);
        });

        it('should set origin to 0', function ()
        {
            var obj = createMockObject(100, 100);
            obj.setOrigin(0, 0);
            expect(obj.originX).toBe(0);
            expect(obj.originY).toBe(0);
        });

        it('should set origin to 1', function ()
        {
            var obj = createMockObject(100, 100);
            obj.setOrigin(1, 1);
            expect(obj.originX).toBe(1);
            expect(obj.originY).toBe(1);
        });

        it('should accept values outside the 0-1 range', function ()
        {
            var obj = createMockObject(100, 100);
            obj.setOrigin(2, -0.5);
            expect(obj.originX).toBe(2);
            expect(obj.originY).toBe(-0.5);
        });

        it('should call updateDisplayOrigin and update _displayOriginX', function ()
        {
            var obj = createMockObject(200, 80);
            obj.setOrigin(0.5, 0.25);
            expect(obj._displayOriginX).toBe(100);
            expect(obj._displayOriginY).toBe(20);
        });

        it('should return the game object instance (this)', function ()
        {
            var obj = createMockObject(100, 100);
            var result = obj.setOrigin(0.5, 0.5);
            expect(result).toBe(obj);
        });
    });

    describe('setOriginFromFrame', function ()
    {
        it('should fall back to setOrigin when frame is not defined', function ()
        {
            var obj = createMockObject(100, 100);
            obj.originX = 0.1;
            obj.originY = 0.1;
            obj.setOriginFromFrame();
            expect(obj.originX).toBe(0.5);
            expect(obj.originY).toBe(0.5);
        });

        it('should fall back to setOrigin when frame has no customPivot', function ()
        {
            var obj = createMockObject(100, 100);
            obj.frame = { customPivot: false, pivotX: 0.3, pivotY: 0.7 };
            obj.originX = 0.1;
            obj.originY = 0.1;
            obj.setOriginFromFrame();
            expect(obj.originX).toBe(0.5);
            expect(obj.originY).toBe(0.5);
        });

        it('should set origin from frame pivot values when customPivot is true', function ()
        {
            var obj = createMockObject(100, 100);
            obj.frame = { customPivot: true, pivotX: 0.3, pivotY: 0.7 };
            obj.setOriginFromFrame();
            expect(obj.originX).toBe(0.3);
            expect(obj.originY).toBe(0.7);
        });

        it('should call updateDisplayOrigin after setting from frame pivot', function ()
        {
            var obj = createMockObject(200, 100);
            obj.frame = { customPivot: true, pivotX: 0.5, pivotY: 0.25 };
            obj.setOriginFromFrame();
            expect(obj._displayOriginX).toBe(100);
            expect(obj._displayOriginY).toBe(25);
        });

        it('should call updateDisplayOrigin when falling back to setOrigin', function ()
        {
            var obj = createMockObject(200, 100);
            obj.setOriginFromFrame();
            expect(obj._displayOriginX).toBe(100);
            expect(obj._displayOriginY).toBe(50);
        });

        it('should return the game object instance (this)', function ()
        {
            var obj = createMockObject(100, 100);
            var result = obj.setOriginFromFrame();
            expect(result).toBe(obj);
        });

        it('should return the game object instance when using frame pivot', function ()
        {
            var obj = createMockObject(100, 100);
            obj.frame = { customPivot: true, pivotX: 0.5, pivotY: 0.5 };
            var result = obj.setOriginFromFrame();
            expect(result).toBe(obj);
        });
    });

    describe('setDisplayOrigin', function ()
    {
        it('should default both axes to 0 when called with no arguments', function ()
        {
            var obj = createMockObject(100, 100);
            obj.setDisplayOrigin();
            expect(obj._displayOriginX).toBe(0);
            expect(obj._displayOriginY).toBe(0);
        });

        it('should set both axes to x when only x is provided', function ()
        {
            var obj = createMockObject(100, 100);
            obj.setDisplayOrigin(50);
            expect(obj._displayOriginX).toBe(50);
            expect(obj._displayOriginY).toBe(50);
        });

        it('should set both axes independently when x and y are provided', function ()
        {
            var obj = createMockObject(100, 100);
            obj.setDisplayOrigin(25, 75);
            expect(obj._displayOriginX).toBe(25);
            expect(obj._displayOriginY).toBe(75);
        });

        it('should update originX based on displayOriginX and width', function ()
        {
            var obj = createMockObject(200, 100);
            obj.setDisplayOrigin(100, 50);
            expect(obj.originX).toBe(0.5);
            expect(obj.originY).toBe(0.5);
        });

        it('should update originX correctly with arbitrary pixel values', function ()
        {
            var obj = createMockObject(400, 200);
            obj.setDisplayOrigin(100, 50);
            expect(obj.originX).toBe(0.25);
            expect(obj.originY).toBe(0.25);
        });

        it('should handle zero display origin', function ()
        {
            var obj = createMockObject(100, 100);
            obj.setDisplayOrigin(0, 0);
            expect(obj._displayOriginX).toBe(0);
            expect(obj._displayOriginY).toBe(0);
            expect(obj.originX).toBe(0);
            expect(obj.originY).toBe(0);
        });

        it('should return the game object instance (this)', function ()
        {
            var obj = createMockObject(100, 100);
            var result = obj.setDisplayOrigin(50, 50);
            expect(result).toBe(obj);
        });
    });

    describe('updateDisplayOrigin', function ()
    {
        it('should calculate _displayOriginX as originX * width', function ()
        {
            var obj = createMockObject(200, 100);
            obj.originX = 0.5;
            obj.updateDisplayOrigin();
            expect(obj._displayOriginX).toBe(100);
        });

        it('should calculate _displayOriginY as originY * height', function ()
        {
            var obj = createMockObject(200, 100);
            obj.originY = 0.5;
            obj.updateDisplayOrigin();
            expect(obj._displayOriginY).toBe(50);
        });

        it('should handle origin of 0', function ()
        {
            var obj = createMockObject(200, 100);
            obj.originX = 0;
            obj.originY = 0;
            obj.updateDisplayOrigin();
            expect(obj._displayOriginX).toBe(0);
            expect(obj._displayOriginY).toBe(0);
        });

        it('should handle origin of 1', function ()
        {
            var obj = createMockObject(200, 100);
            obj.originX = 1;
            obj.originY = 1;
            obj.updateDisplayOrigin();
            expect(obj._displayOriginX).toBe(200);
            expect(obj._displayOriginY).toBe(100);
        });

        it('should handle fractional origins and dimensions', function ()
        {
            var obj = createMockObject(300, 150);
            obj.originX = 0.333;
            obj.originY = 0.667;
            obj.updateDisplayOrigin();
            expect(obj._displayOriginX).toBeCloseTo(99.9, 1);
            expect(obj._displayOriginY).toBeCloseTo(100.05, 1);
        });

        it('should return the game object instance (this)', function ()
        {
            var obj = createMockObject(100, 100);
            var result = obj.updateDisplayOrigin();
            expect(result).toBe(obj);
        });
    });

    describe('displayOriginX accessor', function ()
    {
        it('should get the value of _displayOriginX', function ()
        {
            var obj = createMockObject(100, 100);
            obj._displayOriginX = 42;
            expect(obj.displayOriginX).toBe(42);
        });

        it('should set _displayOriginX when assigned', function ()
        {
            var obj = createMockObject(100, 100);
            obj.displayOriginX = 75;
            expect(obj._displayOriginX).toBe(75);
        });

        it('should update originX as value / width when set', function ()
        {
            var obj = createMockObject(200, 100);
            obj.displayOriginX = 50;
            expect(obj.originX).toBe(0.25);
        });

        it('should derive originX of 0.5 when display origin equals half width', function ()
        {
            var obj = createMockObject(100, 100);
            obj.displayOriginX = 50;
            expect(obj.originX).toBe(0.5);
        });

        it('should set originX to 0 when displayOriginX is 0', function ()
        {
            var obj = createMockObject(100, 100);
            obj.displayOriginX = 0;
            expect(obj.originX).toBe(0);
        });
    });

    describe('displayOriginY accessor', function ()
    {
        it('should get the value of _displayOriginY', function ()
        {
            var obj = createMockObject(100, 100);
            obj._displayOriginY = 33;
            expect(obj.displayOriginY).toBe(33);
        });

        it('should set _displayOriginY when assigned', function ()
        {
            var obj = createMockObject(100, 100);
            obj.displayOriginY = 80;
            expect(obj._displayOriginY).toBe(80);
        });

        it('should update originY as value / height when set', function ()
        {
            var obj = createMockObject(100, 200);
            obj.displayOriginY = 50;
            expect(obj.originY).toBe(0.25);
        });

        it('should derive originY of 0.5 when display origin equals half height', function ()
        {
            var obj = createMockObject(100, 100);
            obj.displayOriginY = 50;
            expect(obj.originY).toBe(0.5);
        });

        it('should set originY to 0 when displayOriginY is 0', function ()
        {
            var obj = createMockObject(100, 100);
            obj.displayOriginY = 0;
            expect(obj.originY).toBe(0);
        });
    });
});
