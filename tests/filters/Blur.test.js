var Blur = require('../../src/filters/Blur');

describe('Blur', function ()
{
    var mockCamera;

    beforeEach(function ()
    {
        mockCamera = {};
    });

    describe('constructor', function ()
    {
        it('should create a Blur with default values', function ()
        {
            var blur = new Blur(mockCamera);

            expect(blur.quality).toBe(0);
            expect(blur.x).toBe(2);
            expect(blur.y).toBe(2);
            expect(blur.strength).toBe(1);
            expect(blur.steps).toBe(4);
            expect(blur.active).toBe(true);
            expect(blur.renderNode).toBe('FilterBlur');
            expect(blur.camera).toBe(mockCamera);
        });

        it('should create a Blur with custom quality', function ()
        {
            var blur = new Blur(mockCamera, 2);

            expect(blur.quality).toBe(2);
        });

        it('should create a Blur with custom x and y offsets', function ()
        {
            var blur = new Blur(mockCamera, 0, 5, 10);

            expect(blur.x).toBe(5);
            expect(blur.y).toBe(10);
        });

        it('should create a Blur with custom strength', function ()
        {
            var blur = new Blur(mockCamera, 0, 2, 2, 3);

            expect(blur.strength).toBe(3);
        });

        it('should create a Blur with custom steps', function ()
        {
            var blur = new Blur(mockCamera, 0, 2, 2, 1, 0xffffff, 8);

            expect(blur.steps).toBe(8);
        });

        it('should set glcolor to white by default', function ()
        {
            var blur = new Blur(mockCamera);

            expect(blur.glcolor[0]).toBeCloseTo(1, 5);
            expect(blur.glcolor[1]).toBeCloseTo(1, 5);
            expect(blur.glcolor[2]).toBeCloseTo(1, 5);
        });

        it('should set glcolor when color is provided', function ()
        {
            var blur = new Blur(mockCamera, 0, 2, 2, 1, 0xff0000);

            expect(blur.glcolor[0]).toBeCloseTo(1, 5);
            expect(blur.glcolor[1]).toBeCloseTo(0, 5);
            expect(blur.glcolor[2]).toBeCloseTo(0, 5);
        });

        it('should not set color when color is undefined', function ()
        {
            var blur = new Blur(mockCamera, 0, 2, 2, 1, undefined);

            expect(blur.glcolor[0]).toBeCloseTo(1, 5);
            expect(blur.glcolor[1]).toBeCloseTo(1, 5);
            expect(blur.glcolor[2]).toBeCloseTo(1, 5);
        });

        it('should not set color when color is null', function ()
        {
            var blur = new Blur(mockCamera, 0, 2, 2, 1, null);

            expect(blur.glcolor[0]).toBeCloseTo(1, 5);
            expect(blur.glcolor[1]).toBeCloseTo(1, 5);
            expect(blur.glcolor[2]).toBeCloseTo(1, 5);
        });

        it('should initialize currentPadding as a Rectangle', function ()
        {
            var blur = new Blur(mockCamera);

            expect(blur.currentPadding).toBeDefined();
            expect(typeof blur.currentPadding.setTo).toBe('function');
        });
    });

    describe('color getter/setter', function ()
    {
        it('should return white (0xffffff) by default', function ()
        {
            var blur = new Blur(mockCamera);

            expect(blur.color).toBe(0xffffff);
        });

        it('should set and get red color', function ()
        {
            var blur = new Blur(mockCamera);
            blur.color = 0xff0000;

            expect(blur.color).toBe(0xff0000);
        });

        it('should set and get green color', function ()
        {
            var blur = new Blur(mockCamera);
            blur.color = 0x00ff00;

            expect(blur.color).toBe(0x00ff00);
        });

        it('should set and get blue color', function ()
        {
            var blur = new Blur(mockCamera);
            blur.color = 0x0000ff;

            expect(blur.color).toBe(0x0000ff);
        });

        it('should set and get black color', function ()
        {
            var blur = new Blur(mockCamera);
            blur.color = 0x000000;

            expect(blur.color).toBe(0x000000);
        });

        it('should set glcolor components correctly for a custom color', function ()
        {
            var blur = new Blur(mockCamera);
            blur.color = 0x804020;

            expect(blur.glcolor[0]).toBeCloseTo(0x80 / 255, 3);
            expect(blur.glcolor[1]).toBeCloseTo(0x40 / 255, 3);
            expect(blur.glcolor[2]).toBeCloseTo(0x20 / 255, 3);
        });
    });

    describe('getPadding', function ()
    {
        it('should return the paddingOverride rectangle when override is set', function ()
        {
            var blur = new Blur(mockCamera);

            // Controller initializes paddingOverride as a new Rectangle, which is truthy
            var result = blur.getPadding();

            expect(result).toBe(blur.paddingOverride);
        });

        it('should copy override values into currentPadding when override is used', function ()
        {
            var blur = new Blur(mockCamera);
            blur.paddingOverride.setTo(10, 20, 30, 40);

            blur.getPadding();

            expect(blur.currentPadding.x).toBe(10);
            expect(blur.currentPadding.y).toBe(20);
            expect(blur.currentPadding.width).toBe(30);
            expect(blur.currentPadding.height).toBe(40);
        });

        it('should return currentPadding when paddingOverride is null', function ()
        {
            var blur = new Blur(mockCamera);
            blur.paddingOverride = null;

            var result = blur.getPadding();

            expect(result).toBe(blur.currentPadding);
        });

        it('should calculate padding for quality 0 with default values', function ()
        {
            var blur = new Blur(mockCamera);
            blur.paddingOverride = null;

            // quality=0, steps=4, strength=1, x=2, y=2
            // offsetConstant = 1.333
            // offset = 4 * 1 * 1.333 = 5.332
            // x = ceil(2 * 5.332) = ceil(10.664) = 11
            // y = ceil(2 * 5.332) = ceil(10.664) = 11
            blur.getPadding();

            expect(blur.currentPadding.x).toBe(-11);
            expect(blur.currentPadding.y).toBe(-11);
            expect(blur.currentPadding.width).toBe(22);
            expect(blur.currentPadding.height).toBe(22);
        });

        it('should calculate padding for quality 1 with default values', function ()
        {
            var blur = new Blur(mockCamera, 1);
            blur.paddingOverride = null;

            // quality=1, steps=4, strength=1, x=2, y=2
            // offsetConstant = 3.2307692308
            // offset = 4 * 1 * 3.2307692308 = 12.9230769232
            // x = ceil(2 * 12.9230769232) = ceil(25.8461538464) = 26
            blur.getPadding();

            expect(blur.currentPadding.x).toBe(-26);
            expect(blur.currentPadding.y).toBe(-26);
            expect(blur.currentPadding.width).toBe(52);
            expect(blur.currentPadding.height).toBe(52);
        });

        it('should calculate padding for quality 2 with default values', function ()
        {
            var blur = new Blur(mockCamera, 2);
            blur.paddingOverride = null;

            // quality=2, steps=4, strength=1, x=2, y=2
            // offsetConstant = 5.176470588235294
            // offset = 4 * 1 * 5.176470588235294 = 20.705882352941176
            // x = ceil(2 * 20.705882352941176) = ceil(41.411764705882352) = 42
            blur.getPadding();

            expect(blur.currentPadding.x).toBe(-42);
            expect(blur.currentPadding.y).toBe(-42);
            expect(blur.currentPadding.width).toBe(84);
            expect(blur.currentPadding.height).toBe(84);
        });

        it('should scale padding with strength', function ()
        {
            var blur = new Blur(mockCamera, 0, 2, 2, 2, undefined, 4);
            blur.paddingOverride = null;

            // quality=0, steps=4, strength=2, x=2, y=2
            // offsetConstant = 1.333
            // offset = 4 * 2 * 1.333 = 10.664
            // x = ceil(2 * 10.664) = ceil(21.328) = 22
            blur.getPadding();

            expect(blur.currentPadding.x).toBe(-22);
            expect(blur.currentPadding.y).toBe(-22);
            expect(blur.currentPadding.width).toBe(44);
            expect(blur.currentPadding.height).toBe(44);
        });

        it('should scale padding with steps', function ()
        {
            var blur = new Blur(mockCamera, 0, 2, 2, 1, undefined, 8);
            blur.paddingOverride = null;

            // quality=0, steps=8, strength=1, x=2, y=2
            // offsetConstant = 1.333
            // offset = 8 * 1 * 1.333 = 10.664
            // x = ceil(2 * 10.664) = ceil(21.328) = 22
            blur.getPadding();

            expect(blur.currentPadding.x).toBe(-22);
            expect(blur.currentPadding.y).toBe(-22);
            expect(blur.currentPadding.width).toBe(44);
            expect(blur.currentPadding.height).toBe(44);
        });

        it('should produce asymmetric padding when x and y differ', function ()
        {
            var blur = new Blur(mockCamera, 0, 1, 4, 1, undefined, 4);
            blur.paddingOverride = null;

            // quality=0, steps=4, strength=1, x=1, y=4
            // offsetConstant = 1.333
            // offset = 4 * 1 * 1.333 = 5.332
            // px = ceil(1 * 5.332) = ceil(5.332) = 6
            // py = ceil(4 * 5.332) = ceil(21.328) = 22
            blur.getPadding();

            expect(blur.currentPadding.x).toBe(-6);
            expect(blur.currentPadding.y).toBe(-22);
            expect(blur.currentPadding.width).toBe(12);
            expect(blur.currentPadding.height).toBe(44);
        });

        it('should return zero padding when x and y are zero', function ()
        {
            var blur = new Blur(mockCamera, 0, 0, 0, 1, undefined, 4);
            blur.paddingOverride = null;

            blur.getPadding();

            // -0 and 0 are both valid results; use == to treat them equally
            expect(blur.currentPadding.x == 0).toBe(true);
            expect(blur.currentPadding.y == 0).toBe(true);
            expect(blur.currentPadding.width).toBe(0);
            expect(blur.currentPadding.height).toBe(0);
        });

        it('should return zero padding when steps are zero', function ()
        {
            var blur = new Blur(mockCamera, 0, 2, 2, 1, undefined, 0);
            blur.paddingOverride = null;

            blur.getPadding();

            expect(blur.currentPadding.x == 0).toBe(true);
            expect(blur.currentPadding.y == 0).toBe(true);
            expect(blur.currentPadding.width).toBe(0);
            expect(blur.currentPadding.height).toBe(0);
        });

        it('should return zero padding when strength is zero', function ()
        {
            var blur = new Blur(mockCamera, 0, 2, 2, 0, undefined, 4);
            blur.paddingOverride = null;

            blur.getPadding();

            expect(blur.currentPadding.x == 0).toBe(true);
            expect(blur.currentPadding.y == 0).toBe(true);
            expect(blur.currentPadding.width).toBe(0);
            expect(blur.currentPadding.height).toBe(0);
        });

        it('should ceil fractional pixel padding values', function ()
        {
            // x=1, quality=0, steps=1, strength=1 => offset=1.333, x=ceil(1.333)=2
            var blur = new Blur(mockCamera, 0, 1, 1, 1, undefined, 1);
            blur.paddingOverride = null;

            blur.getPadding();

            expect(blur.currentPadding.x).toBe(-2);
            expect(blur.currentPadding.y).toBe(-2);
        });
    });
});
