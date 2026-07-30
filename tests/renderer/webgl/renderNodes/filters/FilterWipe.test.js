var FilterWipe = require('../../../../../src/renderer/webgl/renderNodes/filters/FilterWipe');

describe('FilterWipe', function ()
{
    it('should be importable', function ()
    {
        expect(FilterWipe).toBeDefined();
    });

    describe('setupTextures', function ()
    {
        it('should set textures[1] to the glTexture from the controller wipeTexture', function ()
        {
            var mockGlTexture = { id: 'mock-gl-texture' };
            var controller = {
                wipeTexture: {
                    get: function ()
                    {
                        return { glTexture: mockGlTexture };
                    }
                }
            };
            var textures = [];
            var mockThis = {};

            FilterWipe.prototype.setupTextures.call(mockThis, controller, textures, null);

            expect(textures[1]).toBe(mockGlTexture);
        });

        it('should leave textures[0] unset', function ()
        {
            var mockGlTexture = { id: 'mock-gl-texture' };
            var controller = {
                wipeTexture: {
                    get: function ()
                    {
                        return { glTexture: mockGlTexture };
                    }
                }
            };
            var textures = [];
            var mockThis = {};

            FilterWipe.prototype.setupTextures.call(mockThis, controller, textures, null);

            expect(textures[0]).toBeUndefined();
        });

        it('should overwrite an existing value at textures[1]', function ()
        {
            var newGlTexture = { id: 'new-texture' };
            var controller = {
                wipeTexture: {
                    get: function ()
                    {
                        return { glTexture: newGlTexture };
                    }
                }
            };
            var textures = [ 'tex0', 'old-texture' ];
            var mockThis = {};

            FilterWipe.prototype.setupTextures.call(mockThis, controller, textures, null);

            expect(textures[1]).toBe(newGlTexture);
        });

        it('should ignore the drawingContext parameter', function ()
        {
            var mockGlTexture = { id: 'tex' };
            var controller = {
                wipeTexture: {
                    get: function ()
                    {
                        return { glTexture: mockGlTexture };
                    }
                }
            };
            var textures = [];
            var mockThis = {};

            expect(function ()
            {
                FilterWipe.prototype.setupTextures.call(mockThis, controller, textures, { someContext: true });
            }).not.toThrow();

            expect(textures[1]).toBe(mockGlTexture);
        });
    });

    describe('setupUniforms', function ()
    {
        it('should call setUniform for uMainSampler2 with value 1', function ()
        {
            var calls = [];
            var mockProgramManager = {
                setUniform: function (name, value)
                {
                    calls.push({ name: name, value: value });
                }
            };
            var mockThis = { programManager: mockProgramManager };
            var controller = {
                progress: 0.5,
                wipeWidth: 0.1,
                direction: 1,
                axis: 0,
                reveal: true
            };

            FilterWipe.prototype.setupUniforms.call(mockThis, controller, null);

            var sampler2Call = calls.find(function (c) { return c.name === 'uMainSampler2'; });
            expect(sampler2Call).toBeDefined();
            expect(sampler2Call.value).toBe(1);
        });

        it('should call setUniform for uProgress_WipeWidth_Direction_Axis with correct vec4', function ()
        {
            var calls = [];
            var mockProgramManager = {
                setUniform: function (name, value)
                {
                    calls.push({ name: name, value: value });
                }
            };
            var mockThis = { programManager: mockProgramManager };
            var controller = {
                progress: 0.75,
                wipeWidth: 0.2,
                direction: -1,
                axis: 1,
                reveal: false
            };

            FilterWipe.prototype.setupUniforms.call(mockThis, controller, null);

            var vec4Call = calls.find(function (c) { return c.name === 'uProgress_WipeWidth_Direction_Axis'; });
            expect(vec4Call).toBeDefined();
            expect(vec4Call.value).toEqual([ 0.75, 0.2, -1, 1 ]);
        });

        it('should call setUniform for uReveal with the controller reveal value', function ()
        {
            var calls = [];
            var mockProgramManager = {
                setUniform: function (name, value)
                {
                    calls.push({ name: name, value: value });
                }
            };
            var mockThis = { programManager: mockProgramManager };
            var controller = {
                progress: 0,
                wipeWidth: 0.05,
                direction: 1,
                axis: 0,
                reveal: true
            };

            FilterWipe.prototype.setupUniforms.call(mockThis, controller, null);

            var revealCall = calls.find(function (c) { return c.name === 'uReveal'; });
            expect(revealCall).toBeDefined();
            expect(revealCall.value).toBe(true);
        });

        it('should call setUniform exactly three times', function ()
        {
            var callCount = 0;
            var mockProgramManager = {
                setUniform: function ()
                {
                    callCount++;
                }
            };
            var mockThis = { programManager: mockProgramManager };
            var controller = {
                progress: 0.5,
                wipeWidth: 0.1,
                direction: 1,
                axis: 0,
                reveal: false
            };

            FilterWipe.prototype.setupUniforms.call(mockThis, controller, null);

            expect(callCount).toBe(3);
        });

        it('should pass progress = 0 correctly at the start of a wipe', function ()
        {
            var calls = [];
            var mockProgramManager = {
                setUniform: function (name, value)
                {
                    calls.push({ name: name, value: value });
                }
            };
            var mockThis = { programManager: mockProgramManager };
            var controller = {
                progress: 0,
                wipeWidth: 0.1,
                direction: 1,
                axis: 0,
                reveal: true
            };

            FilterWipe.prototype.setupUniforms.call(mockThis, controller, null);

            var vec4Call = calls.find(function (c) { return c.name === 'uProgress_WipeWidth_Direction_Axis'; });
            expect(vec4Call.value[0]).toBe(0);
        });

        it('should pass progress = 1 correctly at the end of a wipe', function ()
        {
            var calls = [];
            var mockProgramManager = {
                setUniform: function (name, value)
                {
                    calls.push({ name: name, value: value });
                }
            };
            var mockThis = { programManager: mockProgramManager };
            var controller = {
                progress: 1,
                wipeWidth: 0.1,
                direction: 1,
                axis: 0,
                reveal: true
            };

            FilterWipe.prototype.setupUniforms.call(mockThis, controller, null);

            var vec4Call = calls.find(function (c) { return c.name === 'uProgress_WipeWidth_Direction_Axis'; });
            expect(vec4Call.value[0]).toBe(1);
        });

        it('should pass axis = 1 for vertical wipe', function ()
        {
            var calls = [];
            var mockProgramManager = {
                setUniform: function (name, value)
                {
                    calls.push({ name: name, value: value });
                }
            };
            var mockThis = { programManager: mockProgramManager };
            var controller = {
                progress: 0.5,
                wipeWidth: 0.1,
                direction: 1,
                axis: 1,
                reveal: false
            };

            FilterWipe.prototype.setupUniforms.call(mockThis, controller, null);

            var vec4Call = calls.find(function (c) { return c.name === 'uProgress_WipeWidth_Direction_Axis'; });
            expect(vec4Call.value[3]).toBe(1);
        });

        it('should pass direction = -1 for reverse wipe', function ()
        {
            var calls = [];
            var mockProgramManager = {
                setUniform: function (name, value)
                {
                    calls.push({ name: name, value: value });
                }
            };
            var mockThis = { programManager: mockProgramManager };
            var controller = {
                progress: 0.5,
                wipeWidth: 0.1,
                direction: -1,
                axis: 0,
                reveal: false
            };

            FilterWipe.prototype.setupUniforms.call(mockThis, controller, null);

            var vec4Call = calls.find(function (c) { return c.name === 'uProgress_WipeWidth_Direction_Axis'; });
            expect(vec4Call.value[2]).toBe(-1);
        });

        it('should pass reveal = false for hide mode', function ()
        {
            var calls = [];
            var mockProgramManager = {
                setUniform: function (name, value)
                {
                    calls.push({ name: name, value: value });
                }
            };
            var mockThis = { programManager: mockProgramManager };
            var controller = {
                progress: 0.5,
                wipeWidth: 0.1,
                direction: 1,
                axis: 0,
                reveal: false
            };

            FilterWipe.prototype.setupUniforms.call(mockThis, controller, null);

            var revealCall = calls.find(function (c) { return c.name === 'uReveal'; });
            expect(revealCall.value).toBe(false);
        });

        it('should ignore the drawingContext parameter', function ()
        {
            var callCount = 0;
            var mockProgramManager = {
                setUniform: function ()
                {
                    callCount++;
                }
            };
            var mockThis = { programManager: mockProgramManager };
            var controller = {
                progress: 0.5,
                wipeWidth: 0.1,
                direction: 1,
                axis: 0,
                reveal: true
            };

            expect(function ()
            {
                FilterWipe.prototype.setupUniforms.call(mockThis, controller, { someContext: true });
            }).not.toThrow();

            expect(callCount).toBe(3);
        });
    });
});
