var Axis = require('../../../src/input/gamepad/Axis');

describe('Axis', function ()
{
    var mockPad;

    beforeEach(function ()
    {
        mockPad = {
            events: {}
        };
    });

    describe('constructor', function ()
    {
        it('should set the pad reference', function ()
        {
            var axis = new Axis(mockPad, 0);
            expect(axis.pad).toBe(mockPad);
        });

        it('should set the events reference from pad', function ()
        {
            var axis = new Axis(mockPad, 0);
            expect(axis.events).toBe(mockPad.events);
        });

        it('should set the index', function ()
        {
            var axis = new Axis(mockPad, 3);
            expect(axis.index).toBe(3);
        });

        it('should default value to 0', function ()
        {
            var axis = new Axis(mockPad, 0);
            expect(axis.value).toBe(0);
        });

        it('should default threshold to 0.1', function ()
        {
            var axis = new Axis(mockPad, 0);
            expect(axis.threshold).toBe(0.1);
        });

        it('should set index 0 correctly', function ()
        {
            var axis = new Axis(mockPad, 0);
            expect(axis.index).toBe(0);
        });

        it('should set large index correctly', function ()
        {
            var axis = new Axis(mockPad, 7);
            expect(axis.index).toBe(7);
        });
    });

    describe('getValue', function ()
    {
        it('should return 0 when value is 0', function ()
        {
            var axis = new Axis(mockPad, 0);
            expect(axis.getValue()).toBe(0);
        });

        it('should return 0 when value is below threshold', function ()
        {
            var axis = new Axis(mockPad, 0);
            axis.value = 0.05;
            expect(axis.getValue()).toBe(0);
        });

        it('should return 0 when value is negative but below threshold in absolute terms', function ()
        {
            var axis = new Axis(mockPad, 0);
            axis.value = -0.05;
            expect(axis.getValue()).toBe(0);
        });

        it('should return 0 when value equals threshold exactly', function ()
        {
            var axis = new Axis(mockPad, 0);
            axis.value = 0.1;
            expect(axis.getValue()).toBeCloseTo(0.1);
        });

        it('should return 0 when negative value equals threshold exactly', function ()
        {
            var axis = new Axis(mockPad, 0);
            axis.value = -0.1;
            expect(axis.getValue()).toBeCloseTo(-0.1);
        });

        it('should return raw value when above threshold', function ()
        {
            var axis = new Axis(mockPad, 0);
            axis.value = 0.5;
            expect(axis.getValue()).toBeCloseTo(0.5);
        });

        it('should return raw negative value when above threshold in absolute terms', function ()
        {
            var axis = new Axis(mockPad, 0);
            axis.value = -0.5;
            expect(axis.getValue()).toBeCloseTo(-0.5);
        });

        it('should return 1 at full positive deflection', function ()
        {
            var axis = new Axis(mockPad, 0);
            axis.value = 1;
            expect(axis.getValue()).toBe(1);
        });

        it('should return -1 at full negative deflection', function ()
        {
            var axis = new Axis(mockPad, 0);
            axis.value = -1;
            expect(axis.getValue()).toBe(-1);
        });

        it('should return raw value just above threshold', function ()
        {
            var axis = new Axis(mockPad, 0);
            axis.value = 0.101;
            expect(axis.getValue()).toBeCloseTo(0.101);
        });

        it('should respect a custom threshold of 0', function ()
        {
            var axis = new Axis(mockPad, 0);
            axis.threshold = 0;
            axis.value = 0.01;
            expect(axis.getValue()).toBeCloseTo(0.01);
        });

        it('should respect a custom higher threshold', function ()
        {
            var axis = new Axis(mockPad, 0);
            axis.threshold = 0.5;
            axis.value = 0.4;
            expect(axis.getValue()).toBe(0);
        });

        it('should return value when above custom higher threshold', function ()
        {
            var axis = new Axis(mockPad, 0);
            axis.threshold = 0.5;
            axis.value = 0.6;
            expect(axis.getValue()).toBeCloseTo(0.6);
        });
    });

    describe('destroy', function ()
    {
        it('should set pad to null', function ()
        {
            var axis = new Axis(mockPad, 0);
            axis.destroy();
            expect(axis.pad).toBeNull();
        });

        it('should set events to null', function ()
        {
            var axis = new Axis(mockPad, 0);
            axis.destroy();
            expect(axis.events).toBeNull();
        });

        it('should not affect index after destroy', function ()
        {
            var axis = new Axis(mockPad, 2);
            axis.destroy();
            expect(axis.index).toBe(2);
        });

        it('should not affect value after destroy', function ()
        {
            var axis = new Axis(mockPad, 0);
            axis.value = 0.8;
            axis.destroy();
            expect(axis.value).toBeCloseTo(0.8);
        });
    });
});
