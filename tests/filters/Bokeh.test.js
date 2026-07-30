var Bokeh = require('../../src/filters/Bokeh');

function createCamera (height)
{
    return { height: height !== undefined ? height : 100 };
}

describe('Phaser.Filters.Bokeh', function ()
{
    describe('constructor', function ()
    {
        it('should create with default values', function ()
        {
            var camera = createCamera(100);
            var bokeh = new Bokeh(camera);

            expect(bokeh.radius).toBe(0.5);
            expect(bokeh.amount).toBe(1);
            expect(bokeh.contrast).toBeCloseTo(0.2);
            expect(bokeh.isTiltShift).toBe(false);
            expect(bokeh.blurX).toBe(1);
            expect(bokeh.blurY).toBe(1);
            expect(bokeh.strength).toBe(1);
        });

        it('should create with custom radius', function ()
        {
            var camera = createCamera(100);
            var bokeh = new Bokeh(camera, 2.5);

            expect(bokeh.radius).toBe(2.5);
        });

        it('should create with all custom values', function ()
        {
            var camera = createCamera(200);
            var bokeh = new Bokeh(camera, 1.0, 3, 0.5, true, 2, 4, 0.8);

            expect(bokeh.radius).toBe(1.0);
            expect(bokeh.amount).toBe(3);
            expect(bokeh.contrast).toBe(0.5);
            expect(bokeh.isTiltShift).toBe(true);
            expect(bokeh.blurX).toBe(2);
            expect(bokeh.blurY).toBe(4);
            expect(bokeh.strength).toBeCloseTo(0.8);
        });

        it('should set the renderNode to FilterBokeh', function ()
        {
            var camera = createCamera(100);
            var bokeh = new Bokeh(camera);

            expect(bokeh.renderNode).toBe('FilterBokeh');
        });

        it('should set the camera reference', function ()
        {
            var camera = createCamera(100);
            var bokeh = new Bokeh(camera);

            expect(bokeh.camera).toBe(camera);
        });

        it('should be active by default', function ()
        {
            var camera = createCamera(100);
            var bokeh = new Bokeh(camera);

            expect(bokeh.active).toBe(true);
        });

        it('should have a currentPadding rectangle', function ()
        {
            var camera = createCamera(100);
            var bokeh = new Bokeh(camera);

            expect(bokeh.currentPadding).toBeDefined();
        });

        it('should accept zero radius', function ()
        {
            var camera = createCamera(100);
            var bokeh = new Bokeh(camera, 0);

            expect(bokeh.radius).toBe(0);
        });

        it('should accept negative radius', function ()
        {
            var camera = createCamera(100);
            var bokeh = new Bokeh(camera, -1);

            expect(bokeh.radius).toBe(-1);
        });

        it('should accept zero contrast', function ()
        {
            var camera = createCamera(100);
            var bokeh = new Bokeh(camera, 0.5, 1, 0);

            expect(bokeh.contrast).toBe(0);
        });

        it('should accept isTiltShift as true', function ()
        {
            var camera = createCamera(100);
            var bokeh = new Bokeh(camera, 0.5, 1, 0.2, true);

            expect(bokeh.isTiltShift).toBe(true);
        });
    });

    describe('getPadding', function ()
    {
        it('should return the paddingOverride rectangle when override is set', function ()
        {
            var camera = createCamera(100);
            var bokeh = new Bokeh(camera);
            // By default, Controller sets paddingOverride to a Rectangle()
            // so the override path is taken
            var result = bokeh.getPadding();

            expect(result).toBe(bokeh.paddingOverride);
        });

        it('should update currentPadding from override values when override is set', function ()
        {
            var camera = createCamera(100);
            var bokeh = new Bokeh(camera);
            // Set specific values on the override rectangle
            bokeh.paddingOverride.x = 5;
            bokeh.paddingOverride.y = 10;
            bokeh.paddingOverride.width = 20;
            bokeh.paddingOverride.height = 30;

            bokeh.getPadding();

            expect(bokeh.currentPadding.x).toBe(5);
            expect(bokeh.currentPadding.y).toBe(10);
            expect(bokeh.currentPadding.width).toBe(20);
            expect(bokeh.currentPadding.height).toBe(30);
        });

        it('should calculate padding from camera height and radius when override is null', function ()
        {
            var camera = createCamera(100);
            var bokeh = new Bokeh(camera, 0.5);
            bokeh.paddingOverride = null;

            var result = bokeh.getPadding();
            // padding = Math.ceil(100 * 0.5 * 0.021426096060426905) = Math.ceil(1.0713...) = 2
            var expected = 2;

            expect(result.x).toBe(-expected);
            expect(result.y).toBe(-expected);
            expect(result.width).toBe(expected * 2);
            expect(result.height).toBe(expected * 2);
        });

        it('should return currentPadding when override is null', function ()
        {
            var camera = createCamera(100);
            var bokeh = new Bokeh(camera);
            bokeh.paddingOverride = null;

            var result = bokeh.getPadding();

            expect(result).toBe(bokeh.currentPadding);
        });

        it('should produce zero padding when radius is zero', function ()
        {
            var camera = createCamera(100);
            var bokeh = new Bokeh(camera, 0);
            bokeh.paddingOverride = null;

            var result = bokeh.getPadding();
            // padding = Math.ceil(100 * 0 * 0.021426096060426905) = Math.ceil(0) = 0
            // Use toBeCloseTo to handle JS -0 vs 0 edge case

            expect(result.x).toBeCloseTo(0);
            expect(result.y).toBeCloseTo(0);
            expect(result.width).toBeCloseTo(0);
            expect(result.height).toBeCloseTo(0);
        });

        it('should scale padding with camera height', function ()
        {
            var camera = createCamera(1000);
            var bokeh = new Bokeh(camera, 1.0);
            bokeh.paddingOverride = null;

            var result = bokeh.getPadding();
            // padding = Math.ceil(1000 * 1.0 * 0.021426096060426905) = Math.ceil(21.426...) = 22

            expect(result.x).toBe(-22);
            expect(result.y).toBe(-22);
            expect(result.width).toBe(44);
            expect(result.height).toBe(44);
        });

        it('should scale padding with radius', function ()
        {
            var camera = createCamera(100);
            var bokeh = new Bokeh(camera, 2.0);
            bokeh.paddingOverride = null;

            var result = bokeh.getPadding();
            // padding = Math.ceil(100 * 2.0 * 0.021426096060426905) = Math.ceil(4.285...) = 5

            expect(result.x).toBe(-5);
            expect(result.y).toBe(-5);
            expect(result.width).toBe(10);
            expect(result.height).toBe(10);
        });

        it('should use Math.ceil for padding calculation', function ()
        {
            // Choose values that produce a fractional result before ceiling
            // 200 * 0.5 * 0.021426096060426905 = 2.1426096060426905 => ceil = 3
            var camera = createCamera(200);
            var bokeh = new Bokeh(camera, 0.5);
            bokeh.paddingOverride = null;

            var result = bokeh.getPadding();

            expect(result.x).toBe(-3);
            expect(result.y).toBe(-3);
            expect(result.width).toBe(6);
            expect(result.height).toBe(6);
        });

        it('should produce symmetric x and y padding values', function ()
        {
            var camera = createCamera(500);
            var bokeh = new Bokeh(camera, 0.75);
            bokeh.paddingOverride = null;

            var result = bokeh.getPadding();

            expect(result.x).toBe(result.y);
        });

        it('should produce width and height equal to twice the absolute x padding', function ()
        {
            var camera = createCamera(500);
            var bokeh = new Bokeh(camera, 0.75);
            bokeh.paddingOverride = null;

            var result = bokeh.getPadding();

            expect(result.width).toBe(-result.x * 2);
            expect(result.height).toBe(-result.y * 2);
        });

        it('should handle large radius values', function ()
        {
            var camera = createCamera(100);
            var bokeh = new Bokeh(camera, 10);
            bokeh.paddingOverride = null;

            var result = bokeh.getPadding();
            // padding = Math.ceil(100 * 10 * 0.021426096060426905) = Math.ceil(21.426...) = 22

            expect(result.x).toBe(-22);
            expect(result.y).toBe(-22);
            expect(result.width).toBe(44);
            expect(result.height).toBe(44);
        });

        it('should handle zero camera height', function ()
        {
            var camera = createCamera(0);
            var bokeh = new Bokeh(camera, 0.5);
            bokeh.paddingOverride = null;

            var result = bokeh.getPadding();
            // Use toBeCloseTo to handle JS -0 vs 0 edge case

            expect(result.x).toBeCloseTo(0);
            expect(result.y).toBeCloseTo(0);
            expect(result.width).toBeCloseTo(0);
            expect(result.height).toBeCloseTo(0);
        });
    });
});
