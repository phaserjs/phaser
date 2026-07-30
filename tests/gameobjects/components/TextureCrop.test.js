var TextureCrop = require('../../../src/gameobjects/components/TextureCrop');

describe('TextureCrop', function ()
{
    var gameObject;
    var mockFrame;
    var mockTexture;

    beforeEach(function ()
    {
        mockFrame = {
            cutWidth: 100,
            cutHeight: 100,
            customPivot: false,
            pivotX: 0.5,
            pivotY: 0.5,
            setCropUVs: vi.fn(),
            updateCropUVs: vi.fn(),
            texture: { key: 'mockTexture' }
        };

        mockTexture = {
            get: vi.fn().mockReturnValue(mockFrame),
            key: 'mockTexture'
        };

        gameObject = Object.assign({}, TextureCrop);
        gameObject.texture = mockTexture;
        gameObject.frame = mockFrame;
        gameObject.isCropped = false;
        gameObject.flipX = false;
        gameObject.flipY = false;
        gameObject.renderFlags = 15;
        gameObject._sizeComponent = false;
        gameObject._originComponent = false;
        gameObject._crop = { u0: 0, v0: 0, u1: 0, v1: 0, width: 0, height: 0, x: 0, y: 0, flipX: false, flipY: false, cx: 0, cy: 0, cw: 0, ch: 0 };
        gameObject.scene = {
            sys: {
                textures: {
                    get: vi.fn().mockReturnValue(mockTexture)
                }
            }
        };
        gameObject.setSizeToFrame = vi.fn();
        gameObject.setOrigin = vi.fn();
        gameObject.updateDisplayOrigin = vi.fn();
    });

    describe('default mixin properties', function ()
    {
        it('should have texture set to null by default', function ()
        {
            expect(TextureCrop.texture).toBeNull();
        });

        it('should have frame set to null by default', function ()
        {
            expect(TextureCrop.frame).toBeNull();
        });

        it('should have isCropped set to false by default', function ()
        {
            expect(TextureCrop.isCropped).toBe(false);
        });
    });

    describe('setCrop', function ()
    {
        it('should set isCropped to false when called with no arguments', function ()
        {
            gameObject.isCropped = true;
            gameObject.setCrop();
            expect(gameObject.isCropped).toBe(false);
        });

        it('should return this when called with no arguments', function ()
        {
            var result = gameObject.setCrop();
            expect(result).toBe(gameObject);
        });

        it('should set isCropped to true when called with numeric coordinates and a frame exists', function ()
        {
            gameObject.setCrop(0, 0, 100, 100);
            expect(gameObject.isCropped).toBe(true);
        });

        it('should call frame.setCropUVs with numeric coordinates', function ()
        {
            gameObject.setCrop(10, 20, 50, 60);
            expect(mockFrame.setCropUVs).toHaveBeenCalledWith(
                gameObject._crop, 10, 20, 50, 60, false, false
            );
        });

        it('should pass flipX and flipY state to frame.setCropUVs', function ()
        {
            gameObject.flipX = true;
            gameObject.flipY = true;
            gameObject.setCrop(5, 5, 80, 80);
            expect(mockFrame.setCropUVs).toHaveBeenCalledWith(
                gameObject._crop, 5, 5, 80, 80, true, true
            );
        });

        it('should return this when called with numeric coordinates', function ()
        {
            var result = gameObject.setCrop(0, 0, 100, 100);
            expect(result).toBe(gameObject);
        });

        it('should accept a rectangle object as the first argument', function ()
        {
            var rect = { x: 5, y: 10, width: 80, height: 90 };
            gameObject.setCrop(rect);
            expect(mockFrame.setCropUVs).toHaveBeenCalledWith(
                gameObject._crop, 5, 10, 80, 90, false, false
            );
        });

        it('should set isCropped to true when called with a rectangle object', function ()
        {
            var rect = { x: 0, y: 0, width: 100, height: 100 };
            gameObject.setCrop(rect);
            expect(gameObject.isCropped).toBe(true);
        });

        it('should return this when called with a rectangle object', function ()
        {
            var rect = { x: 0, y: 0, width: 100, height: 100 };
            var result = gameObject.setCrop(rect);
            expect(result).toBe(gameObject);
        });

        it('should not set isCropped to true when frame is null', function ()
        {
            gameObject.frame = null;
            gameObject.setCrop(0, 0, 100, 100);
            expect(gameObject.isCropped).toBe(false);
        });

        it('should not call frame.setCropUVs when frame is null', function ()
        {
            gameObject.frame = null;
            gameObject.setCrop(0, 0, 100, 100);
            expect(mockFrame.setCropUVs).not.toHaveBeenCalled();
        });

        it('should return this when frame is null and x is provided', function ()
        {
            gameObject.frame = null;
            var result = gameObject.setCrop(0, 0, 100, 100);
            expect(result).toBe(gameObject);
        });

        it('should not modify isCropped when frame is null and x is provided', function ()
        {
            gameObject.frame = null;
            gameObject.isCropped = true;
            gameObject.setCrop(0, 0, 100, 100);
            expect(gameObject.isCropped).toBe(true);
        });
    });

    describe('setTexture', function ()
    {
        beforeEach(function ()
        {
            gameObject.setFrame = vi.fn().mockReturnValue(gameObject);
        });

        it('should call scene.sys.textures.get with the provided key', function ()
        {
            gameObject.setTexture('myTexture');
            expect(gameObject.scene.sys.textures.get).toHaveBeenCalledWith('myTexture');
        });

        it('should set texture to the result of textures.get', function ()
        {
            gameObject.setTexture('myTexture');
            expect(gameObject.texture).toBe(mockTexture);
        });

        it('should call setFrame with the provided frame argument', function ()
        {
            gameObject.setTexture('myTexture', 'frame1');
            expect(gameObject.setFrame).toHaveBeenCalledWith('frame1');
        });

        it('should call setFrame with undefined when no frame is provided', function ()
        {
            gameObject.setTexture('myTexture');
            expect(gameObject.setFrame).toHaveBeenCalledWith(undefined);
        });

        it('should return the result of setFrame', function ()
        {
            var result = gameObject.setTexture('myTexture');
            expect(result).toBe(gameObject);
        });
    });

    describe('setFrame', function ()
    {
        it('should get the frame from texture when passed a string key', function ()
        {
            gameObject.setFrame('frame1');
            expect(mockTexture.get).toHaveBeenCalledWith('frame1');
        });

        it('should set frame to the result of texture.get', function ()
        {
            gameObject.setFrame('frame1');
            expect(gameObject.frame).toBe(mockFrame);
        });

        it('should get the frame from texture when passed a numeric index', function ()
        {
            gameObject.setFrame(2);
            expect(mockTexture.get).toHaveBeenCalledWith(2);
        });

        it('should return this', function ()
        {
            var result = gameObject.setFrame('frame1');
            expect(result).toBe(gameObject);
        });

        it('should set renderFlags bit 8 when cutWidth and cutHeight are non-zero', function ()
        {
            mockFrame.cutWidth = 100;
            mockFrame.cutHeight = 100;
            gameObject.renderFlags = 0;
            gameObject.setFrame('frame1');
            expect(gameObject.renderFlags & 8).toBe(8);
        });

        it('should clear renderFlags bit 8 when cutWidth is zero', function ()
        {
            mockFrame.cutWidth = 0;
            mockFrame.cutHeight = 100;
            gameObject.renderFlags = 15;
            gameObject.setFrame('frame1');
            expect(gameObject.renderFlags & 8).toBe(0);
        });

        it('should clear renderFlags bit 8 when cutHeight is zero', function ()
        {
            mockFrame.cutWidth = 100;
            mockFrame.cutHeight = 0;
            gameObject.renderFlags = 15;
            gameObject.setFrame('frame1');
            expect(gameObject.renderFlags & 8).toBe(0);
        });

        it('should clear renderFlags bit 8 when both cutWidth and cutHeight are zero', function ()
        {
            mockFrame.cutWidth = 0;
            mockFrame.cutHeight = 0;
            gameObject.renderFlags = 15;
            gameObject.setFrame('frame1');
            expect(gameObject.renderFlags & 8).toBe(0);
        });

        it('should call setSizeToFrame when _sizeComponent is true and updateSize defaults to true', function ()
        {
            gameObject._sizeComponent = true;
            gameObject.setFrame('frame1');
            expect(gameObject.setSizeToFrame).toHaveBeenCalled();
        });

        it('should not call setSizeToFrame when updateSize is false', function ()
        {
            gameObject._sizeComponent = true;
            gameObject.setFrame('frame1', false);
            expect(gameObject.setSizeToFrame).not.toHaveBeenCalled();
        });

        it('should not call setSizeToFrame when _sizeComponent is false', function ()
        {
            gameObject._sizeComponent = false;
            gameObject.setFrame('frame1', true);
            expect(gameObject.setSizeToFrame).not.toHaveBeenCalled();
        });

        it('should call setOrigin with pivot values when _originComponent is true and frame has customPivot', function ()
        {
            gameObject._originComponent = true;
            mockFrame.customPivot = true;
            mockFrame.pivotX = 0.3;
            mockFrame.pivotY = 0.7;
            gameObject.setFrame('frame1');
            expect(gameObject.setOrigin).toHaveBeenCalledWith(0.3, 0.7);
        });

        it('should call updateDisplayOrigin when _originComponent is true and frame has no customPivot', function ()
        {
            gameObject._originComponent = true;
            mockFrame.customPivot = false;
            gameObject.setFrame('frame1');
            expect(gameObject.updateDisplayOrigin).toHaveBeenCalled();
        });

        it('should not call setOrigin or updateDisplayOrigin when _originComponent is false', function ()
        {
            gameObject._originComponent = false;
            gameObject.setFrame('frame1');
            expect(gameObject.setOrigin).not.toHaveBeenCalled();
            expect(gameObject.updateDisplayOrigin).not.toHaveBeenCalled();
        });

        it('should not call setOrigin or updateDisplayOrigin when updateOrigin is false', function ()
        {
            gameObject._originComponent = true;
            gameObject.setFrame('frame1', true, false);
            expect(gameObject.setOrigin).not.toHaveBeenCalled();
            expect(gameObject.updateDisplayOrigin).not.toHaveBeenCalled();
        });

        it('should call frame.updateCropUVs when isCropped is true', function ()
        {
            gameObject.isCropped = true;
            gameObject.setFrame('frame1');
            expect(mockFrame.updateCropUVs).toHaveBeenCalledWith(gameObject._crop, false, false);
        });

        it('should pass flipX and flipY to frame.updateCropUVs', function ()
        {
            gameObject.isCropped = true;
            gameObject.flipX = true;
            gameObject.flipY = true;
            gameObject.setFrame('frame1');
            expect(mockFrame.updateCropUVs).toHaveBeenCalledWith(gameObject._crop, true, true);
        });

        it('should not call frame.updateCropUVs when isCropped is false', function ()
        {
            gameObject.isCropped = false;
            gameObject.setFrame('frame1');
            expect(mockFrame.updateCropUVs).not.toHaveBeenCalled();
        });
    });
});
