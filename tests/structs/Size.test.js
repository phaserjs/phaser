var Size = require('../../src/structs/Size');

describe('Size', function ()
{
    describe('Constructor', function ()
    {
        it('should create a Size with default values', function ()
        {
            var size = new Size();
            expect(size.width).toBe(0);
            expect(size.height).toBe(0);
            expect(size.aspectMode).toBe(0);
            expect(size.aspectRatio).toBe(1);
            expect(size.minWidth).toBe(0);
            expect(size.minHeight).toBe(0);
            expect(size.maxWidth).toBe(Number.MAX_VALUE);
            expect(size.maxHeight).toBe(Number.MAX_VALUE);
        });

        it('should create a Size with given width', function ()
        {
            var size = new Size(200);
            expect(size.width).toBe(200);
            expect(size.height).toBe(200);
        });

        it('should create a Size with given width and height', function ()
        {
            var size = new Size(800, 600);
            expect(size.width).toBe(800);
            expect(size.height).toBe(600);
        });

        it('should compute aspect ratio from width and height', function ()
        {
            var size = new Size(800, 600);
            expect(size.aspectRatio).toBeCloseTo(800 / 600);
        });

        it('should set aspect ratio to 1 when height is zero', function ()
        {
            var size = new Size(100, 0);
            expect(size.aspectRatio).toBe(1);
        });

        it('should accept an aspect mode', function ()
        {
            var size = new Size(800, 600, Size.WIDTH_CONTROLS_HEIGHT);
            expect(size.aspectMode).toBe(Size.WIDTH_CONTROLS_HEIGHT);
        });

        it('should accept a parent object', function ()
        {
            var parent = { width: 1024, height: 768 };
            var size = new Size(800, 600, 0, parent);
            expect(size._parent).toBe(parent);
        });

        it('should initialize snapTo as a Vector2 with zero values', function ()
        {
            var size = new Size();
            expect(size.snapTo).not.toBeNull();
            expect(size.snapTo.x).toBe(0);
            expect(size.snapTo.y).toBe(0);
        });
    });

    describe('static constants', function ()
    {
        it('should define NONE as 0', function ()
        {
            expect(Size.NONE).toBe(0);
        });

        it('should define WIDTH_CONTROLS_HEIGHT as 1', function ()
        {
            expect(Size.WIDTH_CONTROLS_HEIGHT).toBe(1);
        });

        it('should define HEIGHT_CONTROLS_WIDTH as 2', function ()
        {
            expect(Size.HEIGHT_CONTROLS_WIDTH).toBe(2);
        });

        it('should define FIT as 3', function ()
        {
            expect(Size.FIT).toBe(3);
        });

        it('should define ENVELOP as 4', function ()
        {
            expect(Size.ENVELOP).toBe(4);
        });
    });

    describe('setAspectMode', function ()
    {
        it('should set the aspect mode', function ()
        {
            var size = new Size(800, 600);
            size.setAspectMode(Size.WIDTH_CONTROLS_HEIGHT);
            expect(size.aspectMode).toBe(Size.WIDTH_CONTROLS_HEIGHT);
        });

        it('should default to NONE when called with no arguments', function ()
        {
            var size = new Size(800, 600);
            size.setAspectMode(Size.FIT);
            size.setAspectMode();
            expect(size.aspectMode).toBe(Size.NONE);
        });

        it('should return this for chaining', function ()
        {
            var size = new Size(800, 600);
            var result = size.setAspectMode(Size.NONE);
            expect(result).toBe(size);
        });

        it('should recalculate dimensions after mode change', function ()
        {
            var size = new Size(800, 600);
            size.setAspectRatio(800 / 600);
            size.setAspectMode(Size.WIDTH_CONTROLS_HEIGHT);
            expect(size.width).toBe(800);
            expect(size.height).toBeCloseTo(600);
        });
    });

    describe('setSnap', function ()
    {
        it('should set snap width and height', function ()
        {
            var size = new Size(800, 600);
            size.setSnap(16, 16);
            expect(size.snapTo.x).toBe(16);
            expect(size.snapTo.y).toBe(16);
        });

        it('should use snapWidth for both axes when only one arg given', function ()
        {
            var size = new Size(800, 600);
            size.setSnap(32);
            expect(size.snapTo.x).toBe(32);
            expect(size.snapTo.y).toBe(32);
        });

        it('should reset snap values when called with no arguments', function ()
        {
            var size = new Size(800, 600);
            size.setSnap(16, 16);
            size.setSnap();
            expect(size.snapTo.x).toBe(0);
            expect(size.snapTo.y).toBe(0);
        });

        it('should snap width down to nearest multiple', function ()
        {
            var size = new Size(68, 68);
            size.setSnap(16, 16);
            expect(size.width).toBe(64);
            expect(size.height).toBe(64);
        });

        it('should return this for chaining', function ()
        {
            var size = new Size(800, 600);
            var result = size.setSnap(16, 16);
            expect(result).toBe(size);
        });
    });

    describe('setParent', function ()
    {
        it('should set the parent', function ()
        {
            var size = new Size(800, 600);
            var parent = { width: 1024, height: 768 };
            size.setParent(parent);
            expect(size._parent).toBe(parent);
        });

        it('should clear the parent when called with no arguments', function ()
        {
            var parent = { width: 1024, height: 768 };
            var size = new Size(800, 600, 0, parent);
            size.setParent();
            expect(size._parent).toBeUndefined();
        });

        it('should clamp width to parent width', function ()
        {
            var size = new Size(2000, 600);
            var parent = { width: 1024, height: 768 };
            size.setParent(parent);
            expect(size.width).toBe(1024);
        });

        it('should clamp height to parent height', function ()
        {
            var size = new Size(800, 2000);
            var parent = { width: 1024, height: 768 };
            size.setParent(parent);
            expect(size.height).toBe(768);
        });

        it('should return this for chaining', function ()
        {
            var size = new Size(800, 600);
            var result = size.setParent({ width: 1024, height: 768 });
            expect(result).toBe(size);
        });
    });

    describe('setMin', function ()
    {
        it('should set minimum width and height', function ()
        {
            var size = new Size(800, 600);
            size.setMin(100, 80);
            expect(size.minWidth).toBe(100);
            expect(size.minHeight).toBe(80);
        });

        it('should use width for both when height not given', function ()
        {
            var size = new Size(800, 600);
            size.setMin(50);
            expect(size.minWidth).toBe(50);
            expect(size.minHeight).toBe(50);
        });

        it('should default to zero when called with no arguments', function ()
        {
            var size = new Size(800, 600);
            size.setMin(100, 100);
            size.setMin();
            expect(size.minWidth).toBe(0);
            expect(size.minHeight).toBe(0);
        });

        it('should clamp minimum to zero', function ()
        {
            var size = new Size(800, 600);
            size.setMin(-50, -50);
            expect(size.minWidth).toBe(0);
            expect(size.minHeight).toBe(0);
        });

        it('should not allow min to exceed max', function ()
        {
            var size = new Size(800, 600);
            size.setMax(500, 400);
            size.setMin(1000, 1000);
            expect(size.minWidth).toBe(500);
            expect(size.minHeight).toBe(400);
        });

        it('should enforce minimum on current width and height', function ()
        {
            var size = new Size(50, 30);
            size.setMin(100, 80);
            expect(size.width).toBe(100);
            expect(size.height).toBe(80);
        });

        it('should return this for chaining', function ()
        {
            var size = new Size(800, 600);
            var result = size.setMin(100, 80);
            expect(result).toBe(size);
        });
    });

    describe('setMax', function ()
    {
        it('should set maximum width and height', function ()
        {
            var size = new Size(800, 600);
            size.setMax(1920, 1080);
            expect(size.maxWidth).toBe(1920);
            expect(size.maxHeight).toBe(1080);
        });

        it('should use width for both when height not given', function ()
        {
            var size = new Size(800, 600);
            size.setMax(1000);
            expect(size.maxWidth).toBe(1000);
            expect(size.maxHeight).toBe(1000);
        });

        it('should default to MAX_VALUE when called with no arguments', function ()
        {
            var size = new Size(800, 600);
            size.setMax(1000, 1000);
            size.setMax();
            expect(size.maxWidth).toBe(Number.MAX_VALUE);
            expect(size.maxHeight).toBe(Number.MAX_VALUE);
        });

        it('should clamp max to be at least minWidth', function ()
        {
            var size = new Size(800, 600);
            size.setMin(200, 150);
            size.setMax(50, 50);
            expect(size.maxWidth).toBe(200);
            expect(size.maxHeight).toBe(150);
        });

        it('should enforce maximum on current width and height', function ()
        {
            var size = new Size(800, 600);
            size.setMax(400, 300);
            expect(size.width).toBe(400);
            expect(size.height).toBe(300);
        });

        it('should return this for chaining', function ()
        {
            var size = new Size(800, 600);
            var result = size.setMax(1920, 1080);
            expect(result).toBe(size);
        });
    });

    describe('setSize', function ()
    {
        it('should set width and height in NONE mode', function ()
        {
            var size = new Size(0, 0, Size.NONE);
            size.setSize(800, 600);
            expect(size.width).toBe(800);
            expect(size.height).toBe(600);
        });

        it('should update aspect ratio in NONE mode', function ()
        {
            var size = new Size(0, 0, Size.NONE);
            size.setSize(800, 600);
            expect(size.aspectRatio).toBeCloseTo(800 / 600);
        });

        it('should default height to width when not given', function ()
        {
            var size = new Size(0, 0, Size.NONE);
            size.setSize(500);
            expect(size.width).toBe(500);
            expect(size.height).toBe(500);
        });

        it('should control height by width in WIDTH_CONTROLS_HEIGHT mode', function ()
        {
            var size = new Size(800, 600, Size.WIDTH_CONTROLS_HEIGHT);
            size.setSize(400, 999);
            expect(size.width).toBe(400);
            expect(size.height).toBeCloseTo(300);
        });

        it('should control width by height in HEIGHT_CONTROLS_WIDTH mode', function ()
        {
            var size = new Size(800, 600, Size.HEIGHT_CONTROLS_WIDTH);
            size.setSize(999, 300);
            expect(size.height).toBe(300);
            expect(size.width).toBeCloseTo(400);
        });

        it('should fit within given dimensions in FIT mode', function ()
        {
            var size = new Size(800, 600, Size.FIT);
            size.setSize(400, 400);
            expect(size.width).toBeLessThanOrEqual(400);
            expect(size.height).toBeLessThanOrEqual(400);
        });

        it('should envelop given dimensions in ENVELOP mode', function ()
        {
            var size = new Size(800, 600, Size.ENVELOP);
            size.setSize(400, 400);
            expect(size.width >= 400 || size.height >= 400).toBe(true);
        });

        it('should respect min/max constraints', function ()
        {
            var size = new Size(800, 600, Size.NONE);
            size.setMin(100, 100);
            size.setMax(500, 500);
            size.setSize(50, 50);
            expect(size.width).toBe(100);
            expect(size.height).toBe(100);
            size.setSize(800, 800);
            expect(size.width).toBe(500);
            expect(size.height).toBe(500);
        });

        it('should return this for chaining', function ()
        {
            var size = new Size(800, 600);
            var result = size.setSize(400, 300);
            expect(result).toBe(size);
        });
    });

    describe('setAspectRatio', function ()
    {
        it('should override the aspect ratio', function ()
        {
            var size = new Size(800, 600, Size.WIDTH_CONTROLS_HEIGHT);
            size.setAspectRatio(2);
            expect(size.aspectRatio).toBe(2);
        });

        it('should recalculate dimensions after ratio change', function ()
        {
            var size = new Size(800, 600, Size.WIDTH_CONTROLS_HEIGHT);
            size.setAspectRatio(2);
            expect(size.width).toBe(800);
            expect(size.height).toBeCloseTo(400);
        });

        it('should return this for chaining', function ()
        {
            var size = new Size(800, 600);
            var result = size.setAspectRatio(2);
            expect(result).toBe(size);
        });
    });

    describe('resize', function ()
    {
        it('should set new width and height', function ()
        {
            var size = new Size(800, 600);
            size.resize(400, 300);
            expect(size.width).toBe(400);
            expect(size.height).toBe(300);
        });

        it('should update the aspect ratio', function ()
        {
            var size = new Size(800, 600);
            size.resize(400, 200);
            expect(size.aspectRatio).toBeCloseTo(2);
        });

        it('should set aspect ratio to 1 when height is zero', function ()
        {
            var size = new Size(800, 600);
            size.resize(400, 0);
            expect(size.aspectRatio).toBe(1);
        });

        it('should set both dimensions when same value given', function ()
        {
            var size = new Size(800, 600);
            size.resize(500, 500);
            expect(size.width).toBe(500);
            expect(size.height).toBe(500);
        });

        it('should respect min/max constraints', function ()
        {
            var size = new Size(800, 600);
            size.setMin(100, 100);
            size.setMax(500, 500);
            size.resize(50, 50);
            expect(size.width).toBe(100);
            expect(size.height).toBe(100);
        });

        it('should return this for chaining', function ()
        {
            var size = new Size(800, 600);
            var result = size.resize(400, 300);
            expect(result).toBe(size);
        });
    });

    describe('getNewWidth', function ()
    {
        it('should clamp value to minWidth', function ()
        {
            var size = new Size(800, 600);
            size.setMin(100, 100);
            expect(size.getNewWidth(50)).toBe(100);
        });

        it('should clamp value to maxWidth', function ()
        {
            var size = new Size(800, 600);
            size.setMax(500, 500);
            expect(size.getNewWidth(800)).toBe(500);
        });

        it('should clamp to parent width when checkParent is true', function ()
        {
            var size = new Size(800, 600);
            size.setParent({ width: 400, height: 300 });
            expect(size.getNewWidth(600)).toBe(400);
        });

        it('should not clamp to parent width when checkParent is false', function ()
        {
            var size = new Size(100, 100);
            size.setParent({ width: 400, height: 300 });
            expect(size.getNewWidth(600, false)).toBe(600);
        });

        it('should return value unchanged when within range and no parent', function ()
        {
            var size = new Size(800, 600);
            size.setMin(100, 100);
            size.setMax(1000, 1000);
            expect(size.getNewWidth(500)).toBe(500);
        });
    });

    describe('getNewHeight', function ()
    {
        it('should clamp value to minHeight', function ()
        {
            var size = new Size(800, 600);
            size.setMin(100, 100);
            expect(size.getNewHeight(50)).toBe(100);
        });

        it('should clamp value to maxHeight', function ()
        {
            var size = new Size(800, 600);
            size.setMax(500, 500);
            expect(size.getNewHeight(800)).toBe(500);
        });

        it('should clamp to parent height when checkParent is true', function ()
        {
            var size = new Size(800, 600);
            size.setParent({ width: 1024, height: 300 });
            expect(size.getNewHeight(600)).toBe(300);
        });

        it('should not clamp to parent height when checkParent is false', function ()
        {
            var size = new Size(100, 100);
            size.setParent({ width: 1024, height: 300 });
            expect(size.getNewHeight(600, false)).toBe(600);
        });

        it('should return value unchanged when within range and no parent', function ()
        {
            var size = new Size(800, 600);
            size.setMin(100, 100);
            size.setMax(1000, 1000);
            expect(size.getNewHeight(500)).toBe(500);
        });
    });

    describe('constrain', function ()
    {
        it('should fit within target area preserving aspect ratio (fit=true, wider ratio)', function ()
        {
            var size = new Size(800, 400);
            size.constrain(400, 400, true);
            expect(size.width).toBe(400);
            expect(size.height).toBe(200);
        });

        it('should fit within target area preserving aspect ratio (fit=true, taller ratio)', function ()
        {
            var size = new Size(400, 800);
            size.constrain(400, 400, true);
            expect(size.width).toBe(200);
            expect(size.height).toBe(400);
        });

        it('should envelop target area preserving aspect ratio (fit=false, wider ratio)', function ()
        {
            var size = new Size(800, 400);
            size.constrain(400, 400, false);
            expect(size.width).toBe(800);
            expect(size.height).toBe(400);
        });

        it('should default fit to true when not provided', function ()
        {
            var size = new Size(800, 400);
            size.constrain(400, 400);
            expect(size.width).toBe(400);
            expect(size.height).toBe(200);
        });

        it('should default height to width when not provided', function ()
        {
            var size = new Size(800, 800);
            size.constrain(400);
            expect(size.width).toBe(400);
            expect(size.height).toBe(400);
        });

        it('should return this for chaining', function ()
        {
            var size = new Size(800, 600);
            var result = size.constrain(400, 300, true);
            expect(result).toBe(size);
        });
    });

    describe('fitTo', function ()
    {
        it('should fit width and height into target preserving aspect ratio', function ()
        {
            var size = new Size(800, 600);
            size.fitTo(400, 400);
            expect(size.width).toBeLessThanOrEqual(400);
            expect(size.height).toBeLessThanOrEqual(400);
        });

        it('should maintain aspect ratio after fitting', function ()
        {
            var size = new Size(800, 600);
            size.fitTo(400, 400);
            expect(size.width / size.height).toBeCloseTo(800 / 600);
        });

        it('should return this for chaining', function ()
        {
            var size = new Size(800, 600);
            var result = size.fitTo(400, 300);
            expect(result).toBe(size);
        });
    });

    describe('envelop', function ()
    {
        it('should envelop the target area preserving aspect ratio', function ()
        {
            var size = new Size(800, 600);
            size.envelop(400, 400);
            expect(size.width >= 400 || size.height >= 400).toBe(true);
        });

        it('should maintain aspect ratio after enveloping', function ()
        {
            var size = new Size(800, 600);
            size.envelop(400, 400);
            expect(size.width / size.height).toBeCloseTo(800 / 600);
        });

        it('should return this for chaining', function ()
        {
            var size = new Size(800, 600);
            var result = size.envelop(400, 300);
            expect(result).toBe(size);
        });
    });

    describe('setWidth', function ()
    {
        it('should set the width', function ()
        {
            var size = new Size(800, 600);
            size.setWidth(400);
            expect(size.width).toBe(400);
        });

        it('should not change height in NONE mode', function ()
        {
            var size = new Size(800, 600, Size.NONE);
            size.setWidth(400);
            expect(size.height).toBe(600);
        });

        it('should update height in WIDTH_CONTROLS_HEIGHT mode', function ()
        {
            var size = new Size(800, 600, Size.WIDTH_CONTROLS_HEIGHT);
            size.setWidth(400);
            expect(size.height).toBeCloseTo(300);
        });

        it('should return this for chaining', function ()
        {
            var size = new Size(800, 600);
            var result = size.setWidth(400);
            expect(result).toBe(size);
        });
    });

    describe('setHeight', function ()
    {
        it('should set the height', function ()
        {
            var size = new Size(800, 600);
            size.setHeight(300);
            expect(size.height).toBe(300);
        });

        it('should not change width in NONE mode', function ()
        {
            var size = new Size(800, 600, Size.NONE);
            size.setHeight(300);
            expect(size.width).toBe(800);
        });

        it('should update width in HEIGHT_CONTROLS_WIDTH mode', function ()
        {
            var size = new Size(800, 600, Size.HEIGHT_CONTROLS_WIDTH);
            size.setHeight(300);
            expect(size.width).toBeCloseTo(400);
        });

        it('should return this for chaining', function ()
        {
            var size = new Size(800, 600);
            var result = size.setHeight(300);
            expect(result).toBe(size);
        });
    });

    describe('toString', function ()
    {
        it('should return a string representation', function ()
        {
            var size = new Size(800, 600);
            var result = size.toString();
            expect(typeof result).toBe('string');
        });

        it('should include width in the string', function ()
        {
            var size = new Size(800, 600);
            expect(size.toString()).toContain('800');
        });

        it('should include height in the string', function ()
        {
            var size = new Size(800, 600);
            expect(size.toString()).toContain('600');
        });

        it('should include aspectMode in the string', function ()
        {
            var size = new Size(800, 600, Size.FIT);
            expect(size.toString()).toContain('3');
        });
    });

    describe('setCSS', function ()
    {
        it('should set element style width and height as px values', function ()
        {
            var size = new Size(800, 600);
            var element = { style: {} };
            size.setCSS(element);
            expect(element.style.width).toBe('800px');
            expect(element.style.height).toBe('600px');
        });

        it('should do nothing when element has no style property', function ()
        {
            var size = new Size(800, 600);
            var element = {};
            expect(function () { size.setCSS(element); }).not.toThrow();
        });

        it('should do nothing when element is null', function ()
        {
            var size = new Size(800, 600);
            expect(function () { size.setCSS(null); }).not.toThrow();
        });

        it('should do nothing when element is undefined', function ()
        {
            var size = new Size(800, 600);
            expect(function () { size.setCSS(undefined); }).not.toThrow();
        });
    });

    describe('copy', function ()
    {
        it('should copy width and height to destination', function ()
        {
            var src = new Size(800, 600);
            var dst = new Size();
            src.copy(dst);
            expect(dst.width).toBe(800);
            expect(dst.height).toBe(600);
        });

        it('should copy aspectMode to destination', function ()
        {
            var src = new Size(800, 600, Size.WIDTH_CONTROLS_HEIGHT);
            var dst = new Size();
            src.copy(dst);
            expect(dst.aspectMode).toBe(Size.WIDTH_CONTROLS_HEIGHT);
        });

        it('should copy aspectRatio to destination', function ()
        {
            var src = new Size(800, 600);
            var dst = new Size();
            src.copy(dst);
            expect(dst.aspectRatio).toBeCloseTo(800 / 600);
        });

        it('should return the destination', function ()
        {
            var src = new Size(800, 600);
            var dst = new Size();
            var result = src.copy(dst);
            expect(result).toBe(dst);
        });

        it('should not copy the parent reference', function ()
        {
            var parent = { width: 1024, height: 768 };
            var src = new Size(800, 600, Size.NONE, parent);
            var dst = new Size();
            src.copy(dst);
            expect(dst._parent).toBeNull();
        });
    });

    describe('destroy', function ()
    {
        it('should clear the parent reference', function ()
        {
            var parent = { width: 1024, height: 768 };
            var size = new Size(800, 600, 0, parent);
            size.destroy();
            expect(size._parent).toBeNull();
        });

        it('should clear the snapTo reference', function ()
        {
            var size = new Size(800, 600);
            size.destroy();
            expect(size.snapTo).toBeNull();
        });
    });

    describe('width property', function ()
    {
        it('should get the current width', function ()
        {
            var size = new Size(800, 600);
            expect(size.width).toBe(800);
        });

        it('should set width via property assignment', function ()
        {
            var size = new Size(800, 600, Size.NONE);
            size.width = 400;
            expect(size.width).toBe(400);
        });

        it('should update height via property assignment in WIDTH_CONTROLS_HEIGHT mode', function ()
        {
            var size = new Size(800, 600, Size.WIDTH_CONTROLS_HEIGHT);
            size.width = 400;
            expect(size.height).toBeCloseTo(300);
        });
    });

    describe('height property', function ()
    {
        it('should get the current height', function ()
        {
            var size = new Size(800, 600);
            expect(size.height).toBe(600);
        });

        it('should set height via property assignment', function ()
        {
            var size = new Size(800, 600, Size.NONE);
            size.height = 300;
            expect(size.height).toBe(300);
        });

        it('should update width via property assignment in HEIGHT_CONTROLS_WIDTH mode', function ()
        {
            var size = new Size(800, 600, Size.HEIGHT_CONTROLS_WIDTH);
            size.height = 300;
            expect(size.width).toBeCloseTo(400);
        });
    });
});
