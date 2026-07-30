var Texture = require('../../../src/gameobjects/components/Texture');
var Frame = require('../../../src/textures/Frame');

function makeMockFrame (cutWidth, cutHeight, customPivot, pivotX, pivotY)
{
    return {
        cutWidth: cutWidth !== undefined ? cutWidth : 64,
        cutHeight: cutHeight !== undefined ? cutHeight : 64,
        customPivot: customPivot || false,
        pivotX: pivotX || 0,
        pivotY: pivotY || 0
    };
}

function makeMockGameObject (frameOverrides)
{
    var mockFrame = makeMockFrame();
    if (frameOverrides)
    {
        Object.assign(mockFrame, frameOverrides);
    }

    var obj = Object.assign({}, Texture, {
        renderFlags: 15,
        _sizeComponent: false,
        _originComponent: false,
        scene: {
            sys: {
                textures: {
                    get: function (key)
                    {
                        return {
                            key: key,
                            get: function (frame)
                            {
                                return mockFrame;
                            }
                        };
                    }
                }
            }
        },
        texture: {
            get: function (frame)
            {
                return mockFrame;
            }
        },
        setSizeToFrame: vi.fn(),
        setOrigin: vi.fn(),
        updateDisplayOrigin: vi.fn()
    });

    obj._mockFrame = mockFrame;
    return obj;
}

function makeRealFrame (cutWidth, cutHeight)
{
    var mockSource = { width: 256, height: 256 };
    var mockTexture = { key: 'mock-texture', source: [ mockSource ] };
    var frame = new Frame(mockTexture, 'frame0', 0, 0, 0, cutWidth || 64, cutHeight || 64);
    return frame;
}

describe('Texture', function ()
{
    describe('default properties', function ()
    {
        it('should have texture as null by default', function ()
        {
            expect(Texture.texture).toBeNull();
        });

        it('should have frame as null by default', function ()
        {
            expect(Texture.frame).toBeNull();
        });

        it('should have isCropped as false by default', function ()
        {
            expect(Texture.isCropped).toBe(false);
        });
    });

    describe('setFrame', function ()
    {
        it('should return this for method chaining', function ()
        {
            var obj = makeMockGameObject();
            var result = obj.setFrame('frame0');
            expect(result).toBe(obj);
        });

        it('should set frame from texture when given a string key', function ()
        {
            var obj = makeMockGameObject();
            obj.setFrame('frame0');
            expect(obj.frame).toBe(obj._mockFrame);
        });

        it('should set frame from texture when given a numeric index', function ()
        {
            var obj = makeMockGameObject();
            obj.setFrame(0);
            expect(obj.frame).toBe(obj._mockFrame);
        });

        it('should set renderFlags bit 8 when frame has cutWidth and cutHeight', function ()
        {
            var obj = makeMockGameObject({ cutWidth: 64, cutHeight: 64 });
            obj.renderFlags = 0;
            obj.setFrame('frame0');
            expect(obj.renderFlags & 8).toBe(8);
        });

        it('should clear renderFlags bit 8 when frame has zero cutWidth', function ()
        {
            var obj = makeMockGameObject({ cutWidth: 0, cutHeight: 64 });
            obj.renderFlags = 15;
            obj.setFrame('frame0');
            expect(obj.renderFlags & 8).toBe(0);
        });

        it('should clear renderFlags bit 8 when frame has zero cutHeight', function ()
        {
            var obj = makeMockGameObject({ cutWidth: 64, cutHeight: 0 });
            obj.renderFlags = 15;
            obj.setFrame('frame0');
            expect(obj.renderFlags & 8).toBe(0);
        });

        it('should clear renderFlags bit 8 when frame has zero cutWidth and cutHeight', function ()
        {
            var obj = makeMockGameObject({ cutWidth: 0, cutHeight: 0 });
            obj.renderFlags = 15;
            obj.setFrame('frame0');
            expect(obj.renderFlags & 8).toBe(0);
        });

        it('should not touch other renderFlags bits when setting bit 8', function ()
        {
            var obj = makeMockGameObject({ cutWidth: 64, cutHeight: 64 });
            obj.renderFlags = 7; // 0111
            obj.setFrame('frame0');
            expect(obj.renderFlags & 7).toBe(7);
        });

        it('should not touch other renderFlags bits when clearing bit 8', function ()
        {
            var obj = makeMockGameObject({ cutWidth: 0, cutHeight: 0 });
            obj.renderFlags = 15; // 1111
            obj.setFrame('frame0');
            expect(obj.renderFlags & 7).toBe(7);
        });

        it('should call setSizeToFrame when _sizeComponent is true and updateSize is true', function ()
        {
            var obj = makeMockGameObject();
            obj._sizeComponent = true;
            obj.setFrame('frame0', true);
            expect(obj.setSizeToFrame).toHaveBeenCalledOnce();
        });

        it('should not call setSizeToFrame when _sizeComponent is false', function ()
        {
            var obj = makeMockGameObject();
            obj._sizeComponent = false;
            obj.setFrame('frame0', true);
            expect(obj.setSizeToFrame).not.toHaveBeenCalled();
        });

        it('should not call setSizeToFrame when updateSize is false', function ()
        {
            var obj = makeMockGameObject();
            obj._sizeComponent = true;
            obj.setFrame('frame0', false);
            expect(obj.setSizeToFrame).not.toHaveBeenCalled();
        });

        it('should default updateSize to true', function ()
        {
            var obj = makeMockGameObject();
            obj._sizeComponent = true;
            obj.setFrame('frame0');
            expect(obj.setSizeToFrame).toHaveBeenCalledOnce();
        });

        it('should call updateDisplayOrigin when _originComponent is true, no custom pivot, updateOrigin is true', function ()
        {
            var obj = makeMockGameObject({ customPivot: false });
            obj._originComponent = true;
            obj.setFrame('frame0', true, true);
            expect(obj.updateDisplayOrigin).toHaveBeenCalledOnce();
            expect(obj.setOrigin).not.toHaveBeenCalled();
        });

        it('should call setOrigin with pivot coords when frame has customPivot', function ()
        {
            var obj = makeMockGameObject({ customPivot: true, pivotX: 0.3, pivotY: 0.7 });
            obj._originComponent = true;
            obj.setFrame('frame0', true, true);
            expect(obj.setOrigin).toHaveBeenCalledWith(0.3, 0.7);
            expect(obj.updateDisplayOrigin).not.toHaveBeenCalled();
        });

        it('should not call updateDisplayOrigin or setOrigin when _originComponent is false', function ()
        {
            var obj = makeMockGameObject();
            obj._originComponent = false;
            obj.setFrame('frame0', true, true);
            expect(obj.updateDisplayOrigin).not.toHaveBeenCalled();
            expect(obj.setOrigin).not.toHaveBeenCalled();
        });

        it('should not call updateDisplayOrigin when updateOrigin is false', function ()
        {
            var obj = makeMockGameObject({ customPivot: false });
            obj._originComponent = true;
            obj.setFrame('frame0', true, false);
            expect(obj.updateDisplayOrigin).not.toHaveBeenCalled();
        });

        it('should default updateOrigin to true', function ()
        {
            var obj = makeMockGameObject({ customPivot: false });
            obj._originComponent = true;
            obj.setFrame('frame0');
            expect(obj.updateDisplayOrigin).toHaveBeenCalledOnce();
        });

        it('should accept a Frame instance and update texture from it', function ()
        {
            var obj = makeMockGameObject();
            var realFrame = makeRealFrame(64, 64);

            var textureFromScene = null;
            obj.scene.sys.textures.get = function (key)
            {
                textureFromScene = key;
                return { key: key, get: function () { return realFrame; } };
            };

            obj.setFrame(realFrame);

            expect(obj.frame).toBe(realFrame);
            expect(textureFromScene).toBe('mock-texture');
        });

        it('should set renderFlags bit 8 when Frame instance has positive cutWidth and cutHeight', function ()
        {
            var obj = makeMockGameObject();
            var realFrame = makeRealFrame(64, 64);

            obj.scene.sys.textures.get = function ()
            {
                return { key: 'mock-texture', get: function () { return realFrame; } };
            };

            obj.renderFlags = 0;
            obj.setFrame(realFrame);
            expect(obj.renderFlags & 8).toBe(8);
        });

        it('should not call texture.get when passed a Frame instance', function ()
        {
            var obj = makeMockGameObject();
            var realFrame = makeRealFrame(64, 64);
            var textureGetCalled = false;

            obj.texture = {
                get: function ()
                {
                    textureGetCalled = true;
                    return obj._mockFrame;
                }
            };

            obj.scene.sys.textures.get = function ()
            {
                return { key: 'mock-texture', get: function () { return realFrame; } };
            };

            obj.setFrame(realFrame);

            expect(textureGetCalled).toBe(false);
            expect(obj.frame).toBe(realFrame);
        });
    });

    describe('setTexture', function ()
    {
        it('should return this for method chaining', function ()
        {
            var obj = makeMockGameObject();
            var result = obj.setTexture('myTexture', 'frame0');
            expect(result).toBe(obj);
        });

        it('should set this.texture via scene.sys.textures.get', function ()
        {
            var obj = makeMockGameObject();
            obj.setTexture('myTexture', 'frame0');
            expect(obj.texture.key).toBe('myTexture');
        });

        it('should set this.frame via setFrame after updating texture', function ()
        {
            var obj = makeMockGameObject();
            obj.setTexture('myTexture', 'frame0');
            expect(obj.frame).toBe(obj._mockFrame);
        });

        it('should pass updateSize and updateOrigin arguments through to setFrame', function ()
        {
            var obj = makeMockGameObject();
            obj._sizeComponent = true;
            obj._originComponent = true;
            obj.setTexture('myTexture', 'frame0', false, false);
            expect(obj.setSizeToFrame).not.toHaveBeenCalled();
            expect(obj.updateDisplayOrigin).not.toHaveBeenCalled();
        });

        it('should update texture before calling setFrame', function ()
        {
            var obj = makeMockGameObject();
            var textureAtCallTime = null;
            var originalGet = obj.texture.get.bind(obj.texture);
            obj.texture = {
                get: function (frame)
                {
                    textureAtCallTime = obj.texture.key;
                    return obj._mockFrame;
                }
            };
            obj.scene.sys.textures.get = function (key)
            {
                return { key: key, get: obj.texture.get };
            };

            obj.setTexture('newTexture', 'frame0');
            expect(textureAtCallTime).toBe('newTexture');
        });

        it('should work without a frame argument', function ()
        {
            var obj = makeMockGameObject();
            expect(function ()
            {
                obj.setTexture('myTexture');
            }).not.toThrow();
        });
    });
});
