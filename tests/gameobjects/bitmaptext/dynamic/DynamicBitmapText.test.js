var DynamicBitmapText = require('../../../../src/gameobjects/bitmaptext/dynamic/DynamicBitmapText');

describe('DynamicBitmapText', function ()
{
    it('should be importable', function ()
    {
        expect(DynamicBitmapText).toBeDefined();
    });

    describe('setSize', function ()
    {
        it('should set cropWidth and cropHeight', function ()
        {
            var mock = { cropWidth: 0, cropHeight: 0 };
            DynamicBitmapText.prototype.setSize.call(mock, 200, 100);
            expect(mock.cropWidth).toBe(200);
            expect(mock.cropHeight).toBe(100);
        });

        it('should return this', function ()
        {
            var mock = { cropWidth: 0, cropHeight: 0 };
            var result = DynamicBitmapText.prototype.setSize.call(mock, 50, 50);
            expect(result).toBe(mock);
        });

        it('should set zero values', function ()
        {
            var mock = { cropWidth: 100, cropHeight: 100 };
            DynamicBitmapText.prototype.setSize.call(mock, 0, 0);
            expect(mock.cropWidth).toBe(0);
            expect(mock.cropHeight).toBe(0);
        });

        it('should set negative values', function ()
        {
            var mock = { cropWidth: 0, cropHeight: 0 };
            DynamicBitmapText.prototype.setSize.call(mock, -10, -20);
            expect(mock.cropWidth).toBe(-10);
            expect(mock.cropHeight).toBe(-20);
        });

        it('should set floating point values', function ()
        {
            var mock = { cropWidth: 0, cropHeight: 0 };
            DynamicBitmapText.prototype.setSize.call(mock, 100.5, 200.75);
            expect(mock.cropWidth).toBeCloseTo(100.5);
            expect(mock.cropHeight).toBeCloseTo(200.75);
        });
    });

    describe('setDisplayCallback', function ()
    {
        it('should set the displayCallback property', function ()
        {
            var mock = { displayCallback: undefined };
            var cb = function () {};
            DynamicBitmapText.prototype.setDisplayCallback.call(mock, cb);
            expect(mock.displayCallback).toBe(cb);
        });

        it('should return this', function ()
        {
            var mock = { displayCallback: undefined };
            var result = DynamicBitmapText.prototype.setDisplayCallback.call(mock, function () {});
            expect(result).toBe(mock);
        });

        it('should overwrite a previously set callback', function ()
        {
            var firstCb = function () { return 1; };
            var secondCb = function () { return 2; };
            var mock = { displayCallback: firstCb };
            DynamicBitmapText.prototype.setDisplayCallback.call(mock, secondCb);
            expect(mock.displayCallback).toBe(secondCb);
        });

        it('should accept null as a callback', function ()
        {
            var mock = { displayCallback: function () {} };
            DynamicBitmapText.prototype.setDisplayCallback.call(mock, null);
            expect(mock.displayCallback).toBeNull();
        });
    });

    describe('setScrollX', function ()
    {
        it('should set the scrollX property', function ()
        {
            var mock = { scrollX: 0 };
            DynamicBitmapText.prototype.setScrollX.call(mock, 150);
            expect(mock.scrollX).toBe(150);
        });

        it('should return this', function ()
        {
            var mock = { scrollX: 0 };
            var result = DynamicBitmapText.prototype.setScrollX.call(mock, 50);
            expect(result).toBe(mock);
        });

        it('should set zero', function ()
        {
            var mock = { scrollX: 100 };
            DynamicBitmapText.prototype.setScrollX.call(mock, 0);
            expect(mock.scrollX).toBe(0);
        });

        it('should set negative values', function ()
        {
            var mock = { scrollX: 0 };
            DynamicBitmapText.prototype.setScrollX.call(mock, -50);
            expect(mock.scrollX).toBe(-50);
        });

        it('should set floating point values', function ()
        {
            var mock = { scrollX: 0 };
            DynamicBitmapText.prototype.setScrollX.call(mock, 3.14);
            expect(mock.scrollX).toBeCloseTo(3.14);
        });
    });

    describe('setScrollY', function ()
    {
        it('should set the scrollY property', function ()
        {
            var mock = { scrollY: 0 };
            DynamicBitmapText.prototype.setScrollY.call(mock, 75);
            expect(mock.scrollY).toBe(75);
        });

        it('should return this', function ()
        {
            var mock = { scrollY: 0 };
            var result = DynamicBitmapText.prototype.setScrollY.call(mock, 75);
            expect(result).toBe(mock);
        });

        it('should set zero', function ()
        {
            var mock = { scrollY: 200 };
            DynamicBitmapText.prototype.setScrollY.call(mock, 0);
            expect(mock.scrollY).toBe(0);
        });

        it('should set negative values', function ()
        {
            var mock = { scrollY: 0 };
            DynamicBitmapText.prototype.setScrollY.call(mock, -100);
            expect(mock.scrollY).toBe(-100);
        });

        it('should set floating point values', function ()
        {
            var mock = { scrollY: 0 };
            DynamicBitmapText.prototype.setScrollY.call(mock, 9.81);
            expect(mock.scrollY).toBeCloseTo(9.81);
        });
    });
});
