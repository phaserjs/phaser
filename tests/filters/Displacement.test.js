var Displacement = require('../../src/filters/Displacement');

function createMockCamera (width, height, glTexture)
{
    if (width === undefined) { width = 800; }
    if (height === undefined) { height = 600; }
    if (glTexture === undefined) { glTexture = { id: 'mockTexture' }; }

    return {
        width: width,
        height: height,
        scene: {
            sys: {
                textures: {
                    getFrame: function (key)
                    {
                        if (key === '__MISSING') { return null; }
                        return { glTexture: glTexture };
                    }
                }
            }
        }
    };
}

describe('Displacement', function ()
{
    var camera;
    var glTexture;

    beforeEach(function ()
    {
        glTexture = { id: 'mockGLTexture' };
        camera = createMockCamera(800, 600, glTexture);
    });

    describe('constructor', function ()
    {
        it('should set default x and y values', function ()
        {
            var displacement = new Displacement(camera);
            expect(displacement.x).toBeCloseTo(0.005);
            expect(displacement.y).toBeCloseTo(0.005);
        });

        it('should accept custom x and y values', function ()
        {
            var displacement = new Displacement(camera, '__WHITE', 0.02, 0.03);
            expect(displacement.x).toBeCloseTo(0.02);
            expect(displacement.y).toBeCloseTo(0.03);
        });

        it('should set the renderNode to FilterDisplacement', function ()
        {
            var displacement = new Displacement(camera);
            expect(displacement.renderNode).toBe('FilterDisplacement');
        });

        it('should store a reference to the camera', function ()
        {
            var displacement = new Displacement(camera);
            expect(displacement.camera).toBe(camera);
        });

        it('should be active by default', function ()
        {
            var displacement = new Displacement(camera);
            expect(displacement.active).toBe(true);
        });

        it('should set glTexture from the default texture', function ()
        {
            var displacement = new Displacement(camera);
            expect(displacement.glTexture).toBe(glTexture);
        });

        it('should use __WHITE as the default texture key', function ()
        {
            var spy = vi.fn(function (key)
            {
                return { glTexture: { id: key } };
            });
            camera.scene.sys.textures.getFrame = spy;

            new Displacement(camera);

            expect(spy).toHaveBeenCalledWith('__WHITE');
        });

        it('should use a custom texture key when provided', function ()
        {
            var spy = vi.fn(function (key)
            {
                return { glTexture: { id: key } };
            });
            camera.scene.sys.textures.getFrame = spy;

            new Displacement(camera, 'myTexture');

            expect(spy).toHaveBeenCalledWith('myTexture');
        });

        it('should use zero for x when explicitly passed zero', function ()
        {
            var displacement = new Displacement(camera, '__WHITE', 0, 0);
            expect(displacement.x).toBe(0);
            expect(displacement.y).toBe(0);
        });

        it('should accept negative displacement values', function ()
        {
            var displacement = new Displacement(camera, '__WHITE', -0.01, -0.02);
            expect(displacement.x).toBeCloseTo(-0.01);
            expect(displacement.y).toBeCloseTo(-0.02);
        });
    });

    describe('setTexture', function ()
    {
        it('should return this for chaining', function ()
        {
            var displacement = new Displacement(camera);
            var result = displacement.setTexture('__WHITE');
            expect(result).toBe(displacement);
        });

        it('should update glTexture when a valid texture key is given', function ()
        {
            var newGLTexture = { id: 'newTexture' };
            camera.scene.sys.textures.getFrame = function (key)
            {
                return { glTexture: newGLTexture };
            };

            var displacement = new Displacement(camera);
            displacement.setTexture('newTexture');

            expect(displacement.glTexture).toBe(newGLTexture);
        });

        it('should not update glTexture when texture key is not found', function ()
        {
            var displacement = new Displacement(camera);
            var originalGLTexture = displacement.glTexture;

            displacement.setTexture('__MISSING');

            expect(displacement.glTexture).toBe(originalGLTexture);
        });

        it('should update glTexture to the new frame glTexture', function ()
        {
            var firstGLTexture = { id: 'first' };
            var secondGLTexture = { id: 'second' };

            camera.scene.sys.textures.getFrame = function (key)
            {
                if (key === 'first') { return { glTexture: firstGLTexture }; }
                if (key === 'second') { return { glTexture: secondGLTexture }; }
                return null;
            };

            var displacement = new Displacement(camera, 'first');
            expect(displacement.glTexture).toBe(firstGLTexture);

            displacement.setTexture('second');
            expect(displacement.glTexture).toBe(secondGLTexture);
        });
    });

    describe('getPadding', function ()
    {
        it('should return the paddingOverride when it is set', function ()
        {
            var displacement = new Displacement(camera);
            var override = displacement.paddingOverride;

            var result = displacement.getPadding();

            expect(result).toBe(override);
        });

        it('should return currentPadding when paddingOverride is null', function ()
        {
            var displacement = new Displacement(camera);
            displacement.paddingOverride = null;

            var result = displacement.getPadding();

            expect(result).toBe(displacement.currentPadding);
        });

        it('should compute padding based on camera width and x value', function ()
        {
            var displacement = new Displacement(camera, '__WHITE', 0.01, 0.005);
            displacement.paddingOverride = null;

            displacement.getPadding();

            // x = ceil(800 * 0.01 * 0.5) = ceil(4) = 4
            // padding.x should be -4, width should be 8
            expect(displacement.currentPadding.x).toBe(-4);
            expect(displacement.currentPadding.width).toBe(8);
        });

        it('should compute padding based on camera height and y value', function ()
        {
            var displacement = new Displacement(camera, '__WHITE', 0.005, 0.01);
            displacement.paddingOverride = null;

            displacement.getPadding();

            // y = ceil(600 * 0.01 * 0.5) = ceil(3) = 3
            // padding.y should be -3, height should be 6
            expect(displacement.currentPadding.y).toBe(-3);
            expect(displacement.currentPadding.height).toBe(6);
        });

        it('should use Math.ceil on computed padding values', function ()
        {
            // 800 * 0.003 * 0.5 = 1.2, ceil = 2
            var displacement = new Displacement(camera, '__WHITE', 0.003, 0.003);
            displacement.paddingOverride = null;

            displacement.getPadding();

            expect(displacement.currentPadding.x).toBe(-2);
        });

        it('should return zero padding when x and y are zero', function ()
        {
            var displacement = new Displacement(camera, '__WHITE', 0, 0);
            displacement.paddingOverride = null;

            displacement.getPadding();

            expect(displacement.currentPadding.x).toBeCloseTo(0);
            expect(displacement.currentPadding.y).toBeCloseTo(0);
            expect(displacement.currentPadding.width).toBeCloseTo(0);
            expect(displacement.currentPadding.height).toBeCloseTo(0);
        });

        it('should update currentPadding when paddingOverride is active', function ()
        {
            var displacement = new Displacement(camera);
            var override = displacement.paddingOverride;

            // Manually set the override rectangle values
            override.x = 10;
            override.y = 20;
            override.width = 30;
            override.height = 40;

            var result = displacement.getPadding();

            expect(displacement.currentPadding.x).toBe(10);
            expect(displacement.currentPadding.y).toBe(20);
            expect(displacement.currentPadding.width).toBe(30);
            expect(displacement.currentPadding.height).toBe(40);
            expect(result).toBe(override);
        });

        it('should scale padding proportionally to camera size', function ()
        {
            var largeCamera = createMockCamera(1600, 1200, glTexture);
            var displacement = new Displacement(largeCamera, '__WHITE', 0.01, 0.01);
            displacement.paddingOverride = null;

            displacement.getPadding();

            // x = ceil(1600 * 0.01 * 0.5) = ceil(8) = 8
            // y = ceil(1200 * 0.01 * 0.5) = ceil(6) = 6
            expect(displacement.currentPadding.x).toBe(-8);
            expect(displacement.currentPadding.y).toBe(-6);
            expect(displacement.currentPadding.width).toBe(16);
            expect(displacement.currentPadding.height).toBe(12);
        });
    });
});
