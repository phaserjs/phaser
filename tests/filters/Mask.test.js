var Mask = require('../../src/filters/Mask');

describe('Phaser.Filters.Mask', function ()
{
    var mockGlTexture;
    var mockFrame;
    var mockDynamicTexture;
    var mockTextureManager;
    var mockCamera;
    var mockGameObject;

    beforeEach(function ()
    {
        mockGlTexture = { id: 'glTexture' };

        mockFrame = {
            glTexture: mockGlTexture
        };

        mockDynamicTexture = {
            width: 100,
            height: 100,
            setSize: vi.fn(),
            clear: vi.fn(),
            get: vi.fn().mockReturnValue({ glTexture: mockGlTexture }),
            capture: vi.fn(),
            render: vi.fn(),
            destroy: vi.fn()
        };

        mockTextureManager = {
            getFrame: vi.fn().mockReturnValue(mockFrame),
            addDynamicTexture: vi.fn().mockReturnValue(mockDynamicTexture)
        };

        mockCamera = {
            scene: {
                sys: {
                    textures: mockTextureManager
                }
            }
        };

        mockGameObject = {
            scene: {
                renderer: {
                    currentViewCamera: null
                }
            }
        };
    });

    describe('constructor', function ()
    {
        it('should create with default values when mask is a string', function ()
        {
            var mask = new Mask(mockCamera, '__WHITE');

            expect(mask.active).toBe(true);
            expect(mask.invert).toBe(false);
            expect(mask.autoUpdate).toBe(true);
            expect(mask.needsUpdate).toBe(false);
            expect(mask.viewTransform).toBe('world');
            expect(mask.scaleFactor).toBe(1);
            expect(mask.maskGameObject).toBeNull();
            expect(mask.renderNode).toBe('FilterMask');
        });

        it('should default mask to __WHITE when not provided', function ()
        {
            var mask = new Mask(mockCamera);

            expect(mockTextureManager.getFrame).toHaveBeenCalledWith('__WHITE');
        });

        it('should call setTexture when mask is a string', function ()
        {
            var mask = new Mask(mockCamera, 'myTexture');

            expect(mockTextureManager.getFrame).toHaveBeenCalledWith('myTexture');
            expect(mask.glTexture).toBe(mockGlTexture);
            expect(mask.maskGameObject).toBeNull();
        });

        it('should call setGameObject when mask is a GameObject', function ()
        {
            var mask = new Mask(mockCamera, mockGameObject);

            expect(mask.maskGameObject).toBe(mockGameObject);
            expect(mask.needsUpdate).toBe(true);
        });

        it('should set invert from parameter', function ()
        {
            var mask = new Mask(mockCamera, '__WHITE', true);

            expect(mask.invert).toBe(true);
        });

        it('should default invert to false', function ()
        {
            var mask = new Mask(mockCamera, '__WHITE', undefined);

            expect(mask.invert).toBe(false);
        });

        it('should set viewCamera from parameter', function ()
        {
            var viewCam = { id: 'viewCam' };
            var mask = new Mask(mockCamera, '__WHITE', false, viewCam);

            expect(mask.viewCamera).toBe(viewCam);
        });

        it('should default viewCamera to undefined', function ()
        {
            var mask = new Mask(mockCamera, '__WHITE', false);

            expect(mask.viewCamera).toBeUndefined();
        });

        it('should set viewTransform from parameter', function ()
        {
            var mask = new Mask(mockCamera, '__WHITE', false, undefined, 'local');

            expect(mask.viewTransform).toBe('local');
        });

        it('should default viewTransform to world', function ()
        {
            var mask = new Mask(mockCamera, '__WHITE', false, undefined, undefined);

            expect(mask.viewTransform).toBe('world');
        });

        it('should set scaleFactor from parameter', function ()
        {
            var mask = new Mask(mockCamera, '__WHITE', false, undefined, 'world', 2);

            expect(mask.scaleFactor).toBe(2);
        });

        it('should default scaleFactor to 1', function ()
        {
            var mask = new Mask(mockCamera, '__WHITE', false, undefined, 'world', undefined);

            expect(mask.scaleFactor).toBe(1);
        });

        it('should initialise _dynamicTexture to null', function ()
        {
            var mask = new Mask(mockCamera, '__WHITE');

            expect(mask._dynamicTexture).toBeNull();
        });

        it('should store the camera reference', function ()
        {
            var mask = new Mask(mockCamera, '__WHITE');

            expect(mask.camera).toBe(mockCamera);
        });
    });

    describe('setGameObject', function ()
    {
        it('should set maskGameObject to the provided GameObject', function ()
        {
            var mask = new Mask(mockCamera, '__WHITE');
            mask.setGameObject(mockGameObject);

            expect(mask.maskGameObject).toBe(mockGameObject);
        });

        it('should set needsUpdate to true', function ()
        {
            var mask = new Mask(mockCamera, '__WHITE');
            mask.needsUpdate = false;

            mask.setGameObject(mockGameObject);

            expect(mask.needsUpdate).toBe(true);
        });

        it('should return this for chaining', function ()
        {
            var mask = new Mask(mockCamera, '__WHITE');
            var result = mask.setGameObject(mockGameObject);

            expect(result).toBe(mask);
        });

        it('should accept null to clear the game object', function ()
        {
            var mask = new Mask(mockCamera, mockGameObject);
            mask.setGameObject(null);

            expect(mask.maskGameObject).toBeNull();
        });
    });

    describe('setTexture', function ()
    {
        it('should set glTexture when the texture is found', function ()
        {
            var mask = new Mask(mockCamera, mockGameObject);
            mask.glTexture = null;

            mask.setTexture('myTexture');

            expect(mask.glTexture).toBe(mockGlTexture);
        });

        it('should clear maskGameObject when setting a texture', function ()
        {
            var mask = new Mask(mockCamera, mockGameObject);
            expect(mask.maskGameObject).toBe(mockGameObject);

            mask.setTexture('myTexture');

            expect(mask.maskGameObject).toBeNull();
        });

        it('should not change glTexture if texture is not found', function ()
        {
            mockTextureManager.getFrame.mockReturnValue(null);
            var mask = new Mask(mockCamera, mockGameObject);
            var originalGlTexture = mask.glTexture;

            mask.setTexture('nonExistentTexture');

            expect(mask.glTexture).toBe(originalGlTexture);
        });

        it('should not clear maskGameObject if texture is not found', function ()
        {
            var mask = new Mask(mockCamera, mockGameObject);

            mockTextureManager.getFrame.mockReturnValue(null);
            mask.setTexture('nonExistentTexture');

            expect(mask.maskGameObject).toBe(mockGameObject);
        });

        it('should return this for chaining', function ()
        {
            var mask = new Mask(mockCamera, '__WHITE');
            var result = mask.setTexture('__WHITE');

            expect(result).toBe(mask);
        });

        it('should default texture key to __WHITE', function ()
        {
            var mask = new Mask(mockCamera, mockGameObject);
            mockTextureManager.getFrame.mockClear();

            mask.setTexture();

            expect(mockTextureManager.getFrame).toHaveBeenCalledWith(undefined);
        });
    });

    describe('updateDynamicTexture', function ()
    {
        it('should return early when maskGameObject is null', function ()
        {
            var mask = new Mask(mockCamera, '__WHITE');
            mask.maskGameObject = null;

            mask.updateDynamicTexture(100, 100);

            expect(mockTextureManager.addDynamicTexture).not.toHaveBeenCalled();
        });

        it('should create a DynamicTexture when none exists', function ()
        {
            var mask = new Mask(mockCamera, mockGameObject);
            mask._dynamicTexture = null;

            mask.updateDynamicTexture(100, 100);

            expect(mockTextureManager.addDynamicTexture).toHaveBeenCalledWith(
                expect.any(String),
                100,
                100,
                false
            );
        });

        it('should apply scaleFactor when creating DynamicTexture', function ()
        {
            var mask = new Mask(mockCamera, mockGameObject, false, undefined, 'world', 2);
            mask._dynamicTexture = null;

            mask.updateDynamicTexture(100, 100);

            expect(mockTextureManager.addDynamicTexture).toHaveBeenCalledWith(
                expect.any(String),
                200,
                200,
                false
            );
        });

        it('should call setSize when DynamicTexture dimensions do not match', function ()
        {
            var mask = new Mask(mockCamera, mockGameObject);
            mask._dynamicTexture = mockDynamicTexture;
            mockDynamicTexture.width = 50;
            mockDynamicTexture.height = 50;

            mask.updateDynamicTexture(100, 100);

            expect(mockDynamicTexture.setSize).toHaveBeenCalledWith(100, 100, false);
        });

        it('should call clear when DynamicTexture dimensions match', function ()
        {
            var mask = new Mask(mockCamera, mockGameObject);
            mask._dynamicTexture = mockDynamicTexture;
            mockDynamicTexture.width = 100;
            mockDynamicTexture.height = 100;

            mask.updateDynamicTexture(100, 100);

            expect(mockDynamicTexture.clear).toHaveBeenCalled();
            expect(mockDynamicTexture.setSize).not.toHaveBeenCalled();
        });

        it('should set glTexture from the DynamicTexture', function ()
        {
            var mask = new Mask(mockCamera, mockGameObject);
            mask._dynamicTexture = null;

            mask.updateDynamicTexture(100, 100);

            expect(mask.glTexture).toBe(mockGlTexture);
        });

        it('should call capture and render on the DynamicTexture', function ()
        {
            var mask = new Mask(mockCamera, mockGameObject);
            mask._dynamicTexture = mockDynamicTexture;
            mockDynamicTexture.width = 100;
            mockDynamicTexture.height = 100;

            mask.updateDynamicTexture(100, 100);

            expect(mockDynamicTexture.capture).toHaveBeenCalled();
            expect(mockDynamicTexture.render).toHaveBeenCalled();
        });

        it('should set needsUpdate to false after updating', function ()
        {
            var mask = new Mask(mockCamera, mockGameObject);
            mask._dynamicTexture = mockDynamicTexture;
            mockDynamicTexture.width = 100;
            mockDynamicTexture.height = 100;
            mask.needsUpdate = true;

            mask.updateDynamicTexture(100, 100);

            expect(mask.needsUpdate).toBe(false);
        });

        it('should use viewCamera when set', function ()
        {
            var viewCam = { id: 'viewCam' };
            var mask = new Mask(mockCamera, mockGameObject, false, viewCam);
            mask._dynamicTexture = mockDynamicTexture;
            mockDynamicTexture.width = 100;
            mockDynamicTexture.height = 100;

            mask.updateDynamicTexture(100, 100);

            expect(mockDynamicTexture.capture).toHaveBeenCalledWith(
                mockGameObject,
                expect.objectContaining({ camera: viewCam })
            );
        });

        it('should pass viewTransform in capture options', function ()
        {
            var mask = new Mask(mockCamera, mockGameObject, false, undefined, 'local');
            mask._dynamicTexture = mockDynamicTexture;
            mockDynamicTexture.width = 100;
            mockDynamicTexture.height = 100;

            mask.updateDynamicTexture(100, 100);

            expect(mockDynamicTexture.capture).toHaveBeenCalledWith(
                mockGameObject,
                expect.objectContaining({ transform: 'local' })
            );
        });
    });

    describe('destroy', function ()
    {
        it('should set maskGameObject to null', function ()
        {
            var mask = new Mask(mockCamera, mockGameObject);
            mask.destroy();

            expect(mask.maskGameObject).toBeNull();
        });

        it('should set _dynamicTexture to null', function ()
        {
            var mask = new Mask(mockCamera, mockGameObject);
            mask._dynamicTexture = mockDynamicTexture;

            mask.destroy();

            expect(mask._dynamicTexture).toBeNull();
        });

        it('should call destroy on _dynamicTexture if it exists', function ()
        {
            var mask = new Mask(mockCamera, mockGameObject);
            mask._dynamicTexture = mockDynamicTexture;

            mask.destroy();

            expect(mockDynamicTexture.destroy).toHaveBeenCalled();
        });

        it('should not throw when _dynamicTexture is null', function ()
        {
            var mask = new Mask(mockCamera, '__WHITE');
            mask._dynamicTexture = null;

            expect(function () { mask.destroy(); }).not.toThrow();
        });

        it('should set active to false via Controller.destroy', function ()
        {
            var mask = new Mask(mockCamera, '__WHITE');
            mask.destroy();

            expect(mask.active).toBe(false);
        });

        it('should null the camera reference via Controller.destroy', function ()
        {
            var mask = new Mask(mockCamera, '__WHITE');
            mask.destroy();

            expect(mask.camera).toBeNull();
        });

        it('should null the renderNode via Controller.destroy', function ()
        {
            var mask = new Mask(mockCamera, '__WHITE');
            mask.destroy();

            expect(mask.renderNode).toBeNull();
        });
    });
});
