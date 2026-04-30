var Line = require('../../../../src/gameobjects/shape/line/Line');
var GeomLine = require('../../../../src/geom/line/Line');

describe('Line', function ()
{
    // Line extends Shape which requires a full Phaser Scene to construct.
    // We test public methods directly via prototype instances to avoid that dependency.

    describe('setLineWidth', function ()
    {
        var obj;

        beforeEach(function ()
        {
            obj = Object.create(Line.prototype);
            obj.lineWidth = 1;
            obj._startWidth = 1;
            obj._endWidth = 1;
        });

        it('should set lineWidth to startWidth', function ()
        {
            Line.prototype.setLineWidth.call(obj, 5, 10);
            expect(obj.lineWidth).toBe(5);
        });

        it('should set _startWidth to the provided startWidth', function ()
        {
            Line.prototype.setLineWidth.call(obj, 5, 10);
            expect(obj._startWidth).toBe(5);
        });

        it('should set _endWidth to the provided endWidth', function ()
        {
            Line.prototype.setLineWidth.call(obj, 5, 10);
            expect(obj._endWidth).toBe(10);
        });

        it('should default endWidth to startWidth when endWidth is omitted', function ()
        {
            Line.prototype.setLineWidth.call(obj, 8);
            expect(obj._startWidth).toBe(8);
            expect(obj._endWidth).toBe(8);
            expect(obj.lineWidth).toBe(8);
        });

        it('should allow start and end widths to differ', function ()
        {
            Line.prototype.setLineWidth.call(obj, 2, 6);
            expect(obj._startWidth).toBe(2);
            expect(obj._endWidth).toBe(6);
        });

        it('should return the instance for chaining', function ()
        {
            var result = Line.prototype.setLineWidth.call(obj, 3);
            expect(result).toBe(obj);
        });

        it('should accept a width of zero', function ()
        {
            Line.prototype.setLineWidth.call(obj, 0);
            expect(obj.lineWidth).toBe(0);
            expect(obj._startWidth).toBe(0);
            expect(obj._endWidth).toBe(0);
        });

        it('should accept floating point widths', function ()
        {
            Line.prototype.setLineWidth.call(obj, 1.5, 3.5);
            expect(obj._startWidth).toBeCloseTo(1.5);
            expect(obj._endWidth).toBeCloseTo(3.5);
        });

        it('should overwrite previously set widths', function ()
        {
            Line.prototype.setLineWidth.call(obj, 10, 20);
            Line.prototype.setLineWidth.call(obj, 1, 2);
            expect(obj._startWidth).toBe(1);
            expect(obj._endWidth).toBe(2);
            expect(obj.lineWidth).toBe(1);
        });
    });

    describe('setTo', function ()
    {
        var obj;
        var geomSetTo;

        beforeEach(function ()
        {
            obj = Object.create(Line.prototype);
            obj.geom = new GeomLine();
            geomSetTo = vi.spyOn(obj.geom, 'setTo');
        });

        it('should delegate to geom.setTo with the provided coordinates', function ()
        {
            Line.prototype.setTo.call(obj, 10, 20, 30, 40);
            expect(geomSetTo).toHaveBeenCalledWith(10, 20, 30, 40);
        });

        it('should pass all four coordinates correctly', function ()
        {
            Line.prototype.setTo.call(obj, -5, -10, 100, 200);
            expect(geomSetTo).toHaveBeenCalledWith(-5, -10, 100, 200);
        });

        it('should pass zero values correctly', function ()
        {
            Line.prototype.setTo.call(obj, 0, 0, 0, 0);
            expect(geomSetTo).toHaveBeenCalledWith(0, 0, 0, 0);
        });

        it('should pass floating point coordinates correctly', function ()
        {
            Line.prototype.setTo.call(obj, 1.5, 2.5, 3.5, 4.5);
            expect(geomSetTo).toHaveBeenCalledWith(1.5, 2.5, 3.5, 4.5);
        });

        it('should return the instance for chaining', function ()
        {
            var result = Line.prototype.setTo.call(obj, 0, 0, 100, 100);
            expect(result).toBe(obj);
        });

        it('should call geom.setTo exactly once per invocation', function ()
        {
            Line.prototype.setTo.call(obj, 0, 0, 50, 50);
            expect(geomSetTo).toHaveBeenCalledTimes(1);
        });

        it('should forward undefined arguments to geom.setTo', function ()
        {
            Line.prototype.setTo.call(obj);
            expect(geomSetTo).toHaveBeenCalledWith(undefined, undefined, undefined, undefined);
        });

        it('should calculate width from the difference of x2 and x1', function ()
        {
            obj.width = 0;
            Line.prototype.setTo.call(obj, 1, 2, 3, 5);
            expect(obj.width).toBe(2);
        });

        it('should calculate height from the difference of y2 and y1', function ()
        {
            obj.height = 0;
            Line.prototype.setTo.call(obj, 1, 2, 3, 5);
            expect(obj.height).toBe(3);
        });

        it('should calculate the correct width when x2 < x1', function ()
        {
            obj.width = 0;
            Line.prototype.setTo.call(obj, 5, 3, 2, 1);
            expect(obj.width).toBe(3);
        });

        it('should calculate the correct height when y2 < y1', function ()
        {
            obj.height = 0;
            Line.prototype.setTo.call(obj, 5, 3, 2, 1);
            expect(obj.height).toBe(2);
        });

        it('should set width to 1 (not 0) when x1 equals x2', function ()
        {
            obj.width = 0;
            Line.prototype.setTo.call(obj, 1, 2, 1, 5);
            expect(obj.width).toBe(1);
        });

        it('should set height to 1 (not 0) when y1 equals y2', function ()
        {
            obj.height = 0;
            Line.prototype.setTo.call(obj, 2, 1, 5, 1);
            expect(obj.height).toBe(1);
        });
    });
});
