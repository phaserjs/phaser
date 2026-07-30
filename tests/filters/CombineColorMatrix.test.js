var CombineColorMatrix = require('../../src/filters/CombineColorMatrix');
var ColorMatrix = require('../../src/display/ColorMatrix');

function makeMockCamera (glTexture)
{
    var frame = glTexture !== undefined ? { glTexture: glTexture } : null;
    return {
        scene: {
            sys: {
                textures: {
                    getFrame: function (key)
                    {
                        return frame;
                    }
                }
            }
        }
    };
}

describe('CombineColorMatrix', function ()
{
    describe('constructor', function ()
    {
        it('should set active to true via Controller', function ()
        {
            var camera = makeMockCamera({});
            var filter = new CombineColorMatrix(camera);
            expect(filter.active).toBe(true);
        });

        it('should store the camera reference', function ()
        {
            var camera = makeMockCamera({});
            var filter = new CombineColorMatrix(camera);
            expect(filter.camera).toBe(camera);
        });

        it('should set renderNode to FilterCombineColorMatrix', function ()
        {
            var camera = makeMockCamera({});
            var filter = new CombineColorMatrix(camera);
            expect(filter.renderNode).toBe('FilterCombineColorMatrix');
        });

        it('should create a colorMatrixSelf instance of ColorMatrix', function ()
        {
            var camera = makeMockCamera({});
            var filter = new CombineColorMatrix(camera);
            expect(filter.colorMatrixSelf).toBeInstanceOf(ColorMatrix);
        });

        it('should create a colorMatrixTransfer instance of ColorMatrix', function ()
        {
            var camera = makeMockCamera({});
            var filter = new CombineColorMatrix(camera);
            expect(filter.colorMatrixTransfer).toBeInstanceOf(ColorMatrix);
        });

        it('should initialise additions to [1, 1, 1, 0]', function ()
        {
            var camera = makeMockCamera({});
            var filter = new CombineColorMatrix(camera);
            expect(filter.additions).toEqual([ 1, 1, 1, 0 ]);
        });

        it('should initialise multiplications to [0, 0, 0, 1]', function ()
        {
            var camera = makeMockCamera({});
            var filter = new CombineColorMatrix(camera);
            expect(filter.multiplications).toEqual([ 0, 0, 0, 1 ]);
        });

        it('should resolve the default __WHITE texture key via the camera textures system', function ()
        {
            var mockGlTexture = { id: 'white-gl' };
            var camera = makeMockCamera(mockGlTexture);
            var filter = new CombineColorMatrix(camera);
            expect(filter.glTexture).toBe(mockGlTexture);
        });

        it('should accept a texture key string as the second argument', function ()
        {
            var mockGlTexture = { id: 'custom-gl' };
            var camera = makeMockCamera(mockGlTexture);
            var filter = new CombineColorMatrix(camera, 'myTexture');
            expect(filter.glTexture).toBe(mockGlTexture);
        });

        it.todo('should accept a Phaser.Textures.Texture instance as the second argument', function ()
        {});

        it('should not throw when the camera textures system returns null', function ()
        {
            var camera = makeMockCamera(null);
            expect(function ()
            {
                var filter = new CombineColorMatrix(camera);
                void filter;
            }).not.toThrow();
        });
    });

    describe('setTexture', function ()
    {
        it('should return the filter instance (this)', function ()
        {
            var mockGlTexture = {};
            var camera = makeMockCamera(mockGlTexture);
            var filter = new CombineColorMatrix(camera);
            var result = filter.setTexture('someKey');
            expect(result).toBe(filter);
        });

        it('should update glTexture when called with a string key that resolves', function ()
        {
            var camera = makeMockCamera({});
            var filter = new CombineColorMatrix(camera);

            var newGlTexture = { id: 'new-gl' };
            camera.scene.sys.textures.getFrame = function ()
            {
                return { glTexture: newGlTexture };
            };

            filter.setTexture('newKey');
            expect(filter.glTexture).toBe(newGlTexture);
        });

        it('should not update glTexture when the key resolves to null', function ()
        {
            var originalGlTexture = { id: 'original' };
            var camera = makeMockCamera(originalGlTexture);
            var filter = new CombineColorMatrix(camera);

            camera.scene.sys.textures.getFrame = function ()
            {
                return null;
            };

            filter.setTexture('missing');
            expect(filter.glTexture).toBe(originalGlTexture);
        });

        it.todo('should update glTexture when called with a Phaser.Textures.Texture instance', function ()
        {});
    });

    describe('setupAlphaTransfer', function ()
    {
        it('should reset additions to [1, 1, 1, 0]', function ()
        {
            var camera = makeMockCamera({});
            var filter = new CombineColorMatrix(camera);
            filter.additions = [ 0, 0, 0, 0 ];
            filter.setupAlphaTransfer();
            expect(filter.additions).toEqual([ 1, 1, 1, 0 ]);
        });

        it('should reset multiplications to [0, 0, 0, 1]', function ()
        {
            var camera = makeMockCamera({});
            var filter = new CombineColorMatrix(camera);
            filter.multiplications = [ 1, 1, 1, 0 ];
            filter.setupAlphaTransfer();
            expect(filter.multiplications).toEqual([ 0, 0, 0, 1 ]);
        });

        it('should reset both color matrices', function ()
        {
            var camera = makeMockCamera({});
            var filter = new CombineColorMatrix(camera);
            var spySelf = vi.spyOn(filter.colorMatrixSelf, 'reset');
            var spyTransfer = vi.spyOn(filter.colorMatrixTransfer, 'reset');
            // Pass colorSelf=true and colorTransfer=true so black() is not called
            // (black() also calls reset internally), isolating the explicit reset calls.
            filter.setupAlphaTransfer(true, true);
            expect(spySelf).toHaveBeenCalledOnce();
            expect(spyTransfer).toHaveBeenCalledOnce();
        });

        it('should call black() on colorMatrixSelf when colorSelf is false', function ()
        {
            var camera = makeMockCamera({});
            var filter = new CombineColorMatrix(camera);
            var spy = vi.spyOn(filter.colorMatrixSelf, 'black');
            filter.setupAlphaTransfer(false);
            expect(spy).toHaveBeenCalledOnce();
        });

        it('should not call black() on colorMatrixSelf when colorSelf is true', function ()
        {
            var camera = makeMockCamera({});
            var filter = new CombineColorMatrix(camera);
            var spy = vi.spyOn(filter.colorMatrixSelf, 'black');
            filter.setupAlphaTransfer(true);
            expect(spy).not.toHaveBeenCalled();
        });

        it('should call black() on colorMatrixTransfer when colorTransfer is false', function ()
        {
            var camera = makeMockCamera({});
            var filter = new CombineColorMatrix(camera);
            var spy = vi.spyOn(filter.colorMatrixTransfer, 'black');
            filter.setupAlphaTransfer(true, false);
            expect(spy).toHaveBeenCalledOnce();
        });

        it('should not call black() on colorMatrixTransfer when colorTransfer is true', function ()
        {
            var camera = makeMockCamera({});
            var filter = new CombineColorMatrix(camera);
            var spy = vi.spyOn(filter.colorMatrixTransfer, 'black');
            filter.setupAlphaTransfer(true, true);
            expect(spy).not.toHaveBeenCalled();
        });

        it('should call brightnessToAlpha on colorMatrixSelf when brightnessToAlphaSelf is true', function ()
        {
            var camera = makeMockCamera({});
            var filter = new CombineColorMatrix(camera);
            var spy = vi.spyOn(filter.colorMatrixSelf, 'brightnessToAlpha');
            filter.setupAlphaTransfer(true, true, true);
            expect(spy).toHaveBeenCalledOnce();
        });

        it('should call brightnessToAlphaInverse on colorMatrixSelf when brightnessToAlphaInverseSelf is true', function ()
        {
            var camera = makeMockCamera({});
            var filter = new CombineColorMatrix(camera);
            var spyInverse = vi.spyOn(filter.colorMatrixSelf, 'brightnessToAlphaInverse');
            var spyNormal = vi.spyOn(filter.colorMatrixSelf, 'brightnessToAlpha');
            filter.setupAlphaTransfer(true, true, true, false, true);
            expect(spyInverse).toHaveBeenCalledOnce();
            expect(spyNormal).not.toHaveBeenCalled();
        });

        it('should call brightnessToAlpha on colorMatrixTransfer when brightnessToAlphaTransfer is true', function ()
        {
            var camera = makeMockCamera({});
            var filter = new CombineColorMatrix(camera);
            var spy = vi.spyOn(filter.colorMatrixTransfer, 'brightnessToAlpha');
            filter.setupAlphaTransfer(true, true, false, true);
            expect(spy).toHaveBeenCalledOnce();
        });

        it('should call brightnessToAlphaInverse on colorMatrixTransfer when brightnessToAlphaInverseTransfer is true', function ()
        {
            var camera = makeMockCamera({});
            var filter = new CombineColorMatrix(camera);
            var spyInverse = vi.spyOn(filter.colorMatrixTransfer, 'brightnessToAlphaInverse');
            var spyNormal = vi.spyOn(filter.colorMatrixTransfer, 'brightnessToAlpha');
            filter.setupAlphaTransfer(true, true, false, true, false, true);
            expect(spyInverse).toHaveBeenCalledOnce();
            expect(spyNormal).not.toHaveBeenCalled();
        });

        it('should not call any brightness methods when no flags are set', function ()
        {
            var camera = makeMockCamera({});
            var filter = new CombineColorMatrix(camera);
            var spyS = vi.spyOn(filter.colorMatrixSelf, 'brightnessToAlpha');
            var spySi = vi.spyOn(filter.colorMatrixSelf, 'brightnessToAlphaInverse');
            var spyT = vi.spyOn(filter.colorMatrixTransfer, 'brightnessToAlpha');
            var spyTi = vi.spyOn(filter.colorMatrixTransfer, 'brightnessToAlphaInverse');
            filter.setupAlphaTransfer(true, true, false, false, false, false);
            expect(spyS).not.toHaveBeenCalled();
            expect(spySi).not.toHaveBeenCalled();
            expect(spyT).not.toHaveBeenCalled();
            expect(spyTi).not.toHaveBeenCalled();
        });

        it('should call black on both matrices when all color flags are false', function ()
        {
            var camera = makeMockCamera({});
            var filter = new CombineColorMatrix(camera);
            var spySelf = vi.spyOn(filter.colorMatrixSelf, 'black');
            var spyTransfer = vi.spyOn(filter.colorMatrixTransfer, 'black');
            filter.setupAlphaTransfer(false, false);
            expect(spySelf).toHaveBeenCalledOnce();
            expect(spyTransfer).toHaveBeenCalledOnce();
        });
    });

    describe('destroy', function ()
    {
        it('should set colorMatrixSelf to null', function ()
        {
            var camera = makeMockCamera({});
            var filter = new CombineColorMatrix(camera);
            filter.destroy();
            expect(filter.colorMatrixSelf).toBeNull();
        });

        it('should set colorMatrixTransfer to null', function ()
        {
            var camera = makeMockCamera({});
            var filter = new CombineColorMatrix(camera);
            filter.destroy();
            expect(filter.colorMatrixTransfer).toBeNull();
        });

        it('should set active to false via Controller.destroy', function ()
        {
            var camera = makeMockCamera({});
            var filter = new CombineColorMatrix(camera);
            filter.destroy();
            expect(filter.active).toBe(false);
        });

        it('should set camera to null via Controller.destroy', function ()
        {
            var camera = makeMockCamera({});
            var filter = new CombineColorMatrix(camera);
            filter.destroy();
            expect(filter.camera).toBeNull();
        });

        it('should set renderNode to null via Controller.destroy', function ()
        {
            var camera = makeMockCamera({});
            var filter = new CombineColorMatrix(camera);
            filter.destroy();
            expect(filter.renderNode).toBeNull();
        });
    });
});
