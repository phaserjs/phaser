var Crop = require('../../../src/gameobjects/components/Crop');

describe('Crop', function ()
{
    var gameObject;

    beforeEach(function ()
    {
        gameObject = Object.assign({}, Crop, {
            texture: null,
            frame: null,
            isCropped: false,
            flipX: false,
            flipY: false,
            _crop: { u0: 0, v0: 0, u1: 0, v1: 0, width: 0, height: 0, x: 0, y: 0, flipX: false, flipY: false, cx: 0, cy: 0, cw: 0, ch: 0 }
        });
    });

    describe('default properties', function ()
    {
        it('should have texture defaulting to null', function ()
        {
            expect(Crop.texture).toBeNull();
        });

        it('should have frame defaulting to null', function ()
        {
            expect(Crop.frame).toBeNull();
        });

        it('should have isCropped defaulting to false', function ()
        {
            expect(Crop.isCropped).toBe(false);
        });
    });

    describe('setCrop', function ()
    {
        it('should return this for method chaining when called with no arguments', function ()
        {
            var result = gameObject.setCrop();

            expect(result).toBe(gameObject);
        });

        it('should set isCropped to false when called with no arguments', function ()
        {
            gameObject.isCropped = true;

            gameObject.setCrop();

            expect(gameObject.isCropped).toBe(false);
        });

        it('should return this for method chaining when called with numeric arguments and a frame', function ()
        {
            gameObject.frame = {
                setCropUVs: vi.fn()
            };

            var result = gameObject.setCrop(0, 0, 100, 100);

            expect(result).toBe(gameObject);
        });

        it('should set isCropped to true when called with numeric arguments and a frame exists', function ()
        {
            gameObject.frame = {
                setCropUVs: vi.fn()
            };

            gameObject.setCrop(10, 20, 100, 50);

            expect(gameObject.isCropped).toBe(true);
        });

        it('should call frame.setCropUVs with numeric arguments', function ()
        {
            var mockSetCropUVs = vi.fn();

            gameObject.frame = { setCropUVs: mockSetCropUVs };
            gameObject.flipX = false;
            gameObject.flipY = false;

            gameObject.setCrop(10, 20, 100, 50);

            expect(mockSetCropUVs).toHaveBeenCalledWith(
                gameObject._crop,
                10,
                20,
                100,
                50,
                false,
                false
            );
        });

        it('should pass flipX and flipY values to frame.setCropUVs', function ()
        {
            var mockSetCropUVs = vi.fn();

            gameObject.frame = { setCropUVs: mockSetCropUVs };
            gameObject.flipX = true;
            gameObject.flipY = true;

            gameObject.setCrop(0, 0, 64, 64);

            expect(mockSetCropUVs).toHaveBeenCalledWith(
                gameObject._crop,
                0,
                0,
                64,
                64,
                true,
                true
            );
        });

        it('should accept a Rectangle object as the first argument', function ()
        {
            var mockSetCropUVs = vi.fn();

            gameObject.frame = { setCropUVs: mockSetCropUVs };

            var rect = { x: 5, y: 10, width: 200, height: 100 };

            gameObject.setCrop(rect);

            expect(mockSetCropUVs).toHaveBeenCalledWith(
                gameObject._crop,
                rect.x,
                rect.y,
                rect.width,
                rect.height,
                gameObject.flipX,
                gameObject.flipY
            );
        });

        it('should set isCropped to true when a Rectangle object is passed and a frame exists', function ()
        {
            gameObject.frame = { setCropUVs: vi.fn() };

            var rect = { x: 0, y: 0, width: 100, height: 100 };

            gameObject.setCrop(rect);

            expect(gameObject.isCropped).toBe(true);
        });

        it('should not set isCropped to true when called with arguments but no frame', function ()
        {
            gameObject.frame = null;

            gameObject.setCrop(0, 0, 100, 100);

            expect(gameObject.isCropped).toBe(false);
        });

        it('should not call setCropUVs when frame is null', function ()
        {
            gameObject.frame = null;

            expect(function ()
            {
                gameObject.setCrop(0, 0, 100, 100);
            }).not.toThrow();
        });

        it('should return this when called with a Rectangle but no frame', function ()
        {
            gameObject.frame = null;

            var rect = { x: 0, y: 0, width: 100, height: 100 };
            var result = gameObject.setCrop(rect);

            expect(result).toBe(gameObject);
        });

        it('should pass the _crop object to frame.setCropUVs', function ()
        {
            var mockSetCropUVs = vi.fn();

            gameObject.frame = { setCropUVs: mockSetCropUVs };

            gameObject.setCrop(0, 0, 50, 50);

            expect(mockSetCropUVs.mock.calls[0][0]).toBe(gameObject._crop);
        });

        it('should handle zero crop coordinates', function ()
        {
            var mockSetCropUVs = vi.fn();

            gameObject.frame = { setCropUVs: mockSetCropUVs };

            gameObject.setCrop(0, 0, 0, 0);

            expect(mockSetCropUVs).toHaveBeenCalledWith(
                gameObject._crop,
                0,
                0,
                0,
                0,
                gameObject.flipX,
                gameObject.flipY
            );

            expect(gameObject.isCropped).toBe(true);
        });

        it('should allow toggling isCropped off after being set', function ()
        {
            gameObject.frame = { setCropUVs: vi.fn() };

            gameObject.setCrop(0, 0, 100, 100);

            expect(gameObject.isCropped).toBe(true);

            gameObject.setCrop();

            expect(gameObject.isCropped).toBe(false);
        });
    });
});
