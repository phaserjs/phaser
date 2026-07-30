var FilterMask = require('../../../../../src/renderer/webgl/renderNodes/filters/FilterMask');

describe('FilterMask', function ()
{
    it('should be importable', function ()
    {
        expect(FilterMask).toBeDefined();
    });

    it('should expose setupTextures on its prototype', function ()
    {
        expect(typeof FilterMask.prototype.setupTextures).toBe('function');
    });

    it('should expose setupUniforms on its prototype', function ()
    {
        expect(typeof FilterMask.prototype.setupUniforms).toBe('function');
    });

    describe('setupTextures', function ()
    {
        it('should assign glTexture to textures[1]', function ()
        {
            var mockTexture = { id: 'maskTex' };
            var controller = {
                maskGameObject: null,
                needsUpdate: false,
                autoUpdate: false,
                glTexture: mockTexture,
                updateDynamicTexture: vi.fn()
            };
            var textures = [];
            var drawingContext = { width: 256, height: 256 };

            FilterMask.prototype.setupTextures.call({}, controller, textures, drawingContext);

            expect(textures[1]).toBe(mockTexture);
        });

        it('should not call updateDynamicTexture when maskGameObject is null', function ()
        {
            var controller = {
                maskGameObject: null,
                needsUpdate: true,
                autoUpdate: true,
                glTexture: {},
                updateDynamicTexture: vi.fn()
            };
            var textures = [];
            var drawingContext = { width: 128, height: 128 };

            FilterMask.prototype.setupTextures.call({}, controller, textures, drawingContext);

            expect(controller.updateDynamicTexture).not.toHaveBeenCalled();
        });

        it('should call updateDynamicTexture when maskGameObject exists and autoUpdate is true', function ()
        {
            var controller = {
                maskGameObject: { active: true },
                needsUpdate: false,
                autoUpdate: true,
                glTexture: {},
                updateDynamicTexture: vi.fn()
            };
            var textures = [];
            var drawingContext = { width: 320, height: 240 };

            FilterMask.prototype.setupTextures.call({}, controller, textures, drawingContext);

            expect(controller.updateDynamicTexture).toHaveBeenCalledWith(320, 240);
        });

        it('should call updateDynamicTexture when maskGameObject exists and needsUpdate is true', function ()
        {
            var controller = {
                maskGameObject: { active: true },
                needsUpdate: true,
                autoUpdate: false,
                glTexture: {},
                updateDynamicTexture: vi.fn()
            };
            var textures = [];
            var drawingContext = { width: 800, height: 600 };

            FilterMask.prototype.setupTextures.call({}, controller, textures, drawingContext);

            expect(controller.updateDynamicTexture).toHaveBeenCalledWith(800, 600);
        });

        it('should not call updateDynamicTexture when maskGameObject exists but both flags are false', function ()
        {
            var controller = {
                maskGameObject: { active: true },
                needsUpdate: false,
                autoUpdate: false,
                glTexture: {},
                updateDynamicTexture: vi.fn()
            };
            var textures = [];
            var drawingContext = { width: 512, height: 512 };

            FilterMask.prototype.setupTextures.call({}, controller, textures, drawingContext);

            expect(controller.updateDynamicTexture).not.toHaveBeenCalled();
        });

        it('should call updateDynamicTexture when both autoUpdate and needsUpdate are true', function ()
        {
            var controller = {
                maskGameObject: { active: true },
                needsUpdate: true,
                autoUpdate: true,
                glTexture: {},
                updateDynamicTexture: vi.fn()
            };
            var textures = [];
            var drawingContext = { width: 100, height: 200 };

            FilterMask.prototype.setupTextures.call({}, controller, textures, drawingContext);

            expect(controller.updateDynamicTexture).toHaveBeenCalledWith(100, 200);
        });

        it('should overwrite an existing value at textures[1]', function ()
        {
            var newTexture = { id: 'newMask' };
            var controller = {
                maskGameObject: null,
                needsUpdate: false,
                autoUpdate: false,
                glTexture: newTexture,
                updateDynamicTexture: vi.fn()
            };
            var textures = [ {}, { id: 'oldMask' } ];
            var drawingContext = { width: 64, height: 64 };

            FilterMask.prototype.setupTextures.call({}, controller, textures, drawingContext);

            expect(textures[1]).toBe(newTexture);
        });

        it('should assign null glTexture to textures[1]', function ()
        {
            var controller = {
                maskGameObject: null,
                needsUpdate: false,
                autoUpdate: false,
                glTexture: null,
                updateDynamicTexture: vi.fn()
            };
            var textures = [];
            var drawingContext = { width: 256, height: 256 };

            FilterMask.prototype.setupTextures.call({}, controller, textures, drawingContext);

            expect(textures[1]).toBeNull();
        });
    });

    describe('setupUniforms', function ()
    {
        it('should set uMaskSampler uniform to 1', function ()
        {
            var calls = [];
            var mockProgramManager = {
                setUniform: function (name, value)
                {
                    calls.push({ name: name, value: value });
                }
            };
            var mockThis = { programManager: mockProgramManager };
            var controller = { invert: false };
            var drawingContext = {};

            FilterMask.prototype.setupUniforms.call(mockThis, controller, drawingContext);

            var uMaskCall = calls.find(function (c) { return c.name === 'uMaskSampler'; });
            expect(uMaskCall).toBeDefined();
            expect(uMaskCall.value).toBe(1);
        });

        it('should set invert uniform to false when controller.invert is false', function ()
        {
            var calls = [];
            var mockProgramManager = {
                setUniform: function (name, value)
                {
                    calls.push({ name: name, value: value });
                }
            };
            var mockThis = { programManager: mockProgramManager };
            var controller = { invert: false };
            var drawingContext = {};

            FilterMask.prototype.setupUniforms.call(mockThis, controller, drawingContext);

            var invertCall = calls.find(function (c) { return c.name === 'invert'; });
            expect(invertCall).toBeDefined();
            expect(invertCall.value).toBe(false);
        });

        it('should set invert uniform to true when controller.invert is true', function ()
        {
            var calls = [];
            var mockProgramManager = {
                setUniform: function (name, value)
                {
                    calls.push({ name: name, value: value });
                }
            };
            var mockThis = { programManager: mockProgramManager };
            var controller = { invert: true };
            var drawingContext = {};

            FilterMask.prototype.setupUniforms.call(mockThis, controller, drawingContext);

            var invertCall = calls.find(function (c) { return c.name === 'invert'; });
            expect(invertCall).toBeDefined();
            expect(invertCall.value).toBe(true);
        });

        it('should call setUniform exactly twice', function ()
        {
            var callCount = 0;
            var mockProgramManager = {
                setUniform: function ()
                {
                    callCount++;
                }
            };
            var mockThis = { programManager: mockProgramManager };
            var controller = { invert: false };
            var drawingContext = {};

            FilterMask.prototype.setupUniforms.call(mockThis, controller, drawingContext);

            expect(callCount).toBe(2);
        });

        it('should call setUniform with uMaskSampler before invert', function ()
        {
            var callOrder = [];
            var mockProgramManager = {
                setUniform: function (name)
                {
                    callOrder.push(name);
                }
            };
            var mockThis = { programManager: mockProgramManager };
            var controller = { invert: false };
            var drawingContext = {};

            FilterMask.prototype.setupUniforms.call(mockThis, controller, drawingContext);

            expect(callOrder[0]).toBe('uMaskSampler');
            expect(callOrder[1]).toBe('invert');
        });
    });
});
