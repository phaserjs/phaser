var FilterGradientMap = require('../../../../../src/renderer/webgl/renderNodes/filters/FilterGradientMap');

describe('FilterGradientMap', function ()
{
    it('should be importable', function ()
    {
        expect(FilterGradientMap).toBeDefined();
    });

    describe('setupTextures', function ()
    {
        it('should assign the ramp glTexture to slot 1 of the textures array', function ()
        {
            var mockGlTexture = { id: 'mock-gl-texture' };
            var controller = {
                ramp: {
                    glTexture: mockGlTexture
                }
            };
            var textures = [];

            FilterGradientMap.prototype.setupTextures.call({}, controller, textures, null);

            expect(textures[1]).toBe(mockGlTexture);
        });

        it('should leave slot 0 untouched', function ()
        {
            var mockSourceTexture = { id: 'source-texture' };
            var controller = {
                ramp: {
                    glTexture: { id: 'ramp-texture' }
                }
            };
            var textures = [mockSourceTexture];

            FilterGradientMap.prototype.setupTextures.call({}, controller, textures, null);

            expect(textures[0]).toBe(mockSourceTexture);
        });

        it('should overwrite any existing value in slot 1', function ()
        {
            var newTexture = { id: 'new-ramp-texture' };
            var controller = {
                ramp: {
                    glTexture: newTexture
                }
            };
            var textures = [null, { id: 'old-texture' }];

            FilterGradientMap.prototype.setupTextures.call({}, controller, textures, null);

            expect(textures[1]).toBe(newTexture);
        });

        it('should ignore the drawingContext parameter', function ()
        {
            var mockGlTexture = { id: 'texture' };
            var controller = { ramp: { glTexture: mockGlTexture } };
            var textures = [];

            expect(function ()
            {
                FilterGradientMap.prototype.setupTextures.call({}, controller, textures, undefined);
            }).not.toThrow();

            expect(textures[1]).toBe(mockGlTexture);
        });
    });

    describe('setupUniforms', function ()
    {
        function makeMockProgramManager ()
        {
            var calls = {};
            return {
                calls: calls,
                setUniform: function (name, value)
                {
                    calls[name] = value;
                }
            };
        }

        function makeController ()
        {
            return {
                ramp: {
                    dataTextureResolution: [256, 1],
                    dataTextureFirstBand: 2
                },
                dither: true,
                unpremultiply: false,
                color: [1, 0.5, 0, 1],
                colorFactor: 0.75,
                alpha: 0.9
            };
        }

        it('should set uRampTexture to 1', function ()
        {
            var programManager = makeMockProgramManager();
            var mockThis = { programManager: programManager };

            FilterGradientMap.prototype.setupUniforms.call(mockThis, makeController(), null);

            expect(programManager.calls['uRampTexture']).toBe(1);
        });

        it('should set uRampResolution from ramp.dataTextureResolution', function ()
        {
            var programManager = makeMockProgramManager();
            var mockThis = { programManager: programManager };
            var controller = makeController();
            controller.ramp.dataTextureResolution = [512, 2];

            FilterGradientMap.prototype.setupUniforms.call(mockThis, controller, null);

            expect(programManager.calls['uRampResolution']).toBe(controller.ramp.dataTextureResolution);
        });

        it('should set uRampBandStart from ramp.dataTextureFirstBand', function ()
        {
            var programManager = makeMockProgramManager();
            var mockThis = { programManager: programManager };
            var controller = makeController();
            controller.ramp.dataTextureFirstBand = 5;

            FilterGradientMap.prototype.setupUniforms.call(mockThis, controller, null);

            expect(programManager.calls['uRampBandStart']).toBe(5);
        });

        it('should set uDither from controller.dither', function ()
        {
            var programManager = makeMockProgramManager();
            var mockThis = { programManager: programManager };
            var controller = makeController();
            controller.dither = false;

            FilterGradientMap.prototype.setupUniforms.call(mockThis, controller, null);

            expect(programManager.calls['uDither']).toBe(false);
        });

        it('should set uUnpremultiply from controller.unpremultiply', function ()
        {
            var programManager = makeMockProgramManager();
            var mockThis = { programManager: programManager };
            var controller = makeController();
            controller.unpremultiply = true;

            FilterGradientMap.prototype.setupUniforms.call(mockThis, controller, null);

            expect(programManager.calls['uUnpremultiply']).toBe(true);
        });

        it('should set uColor from controller.color', function ()
        {
            var programManager = makeMockProgramManager();
            var mockThis = { programManager: programManager };
            var controller = makeController();
            var color = [0.2, 0.4, 0.6, 1.0];
            controller.color = color;

            FilterGradientMap.prototype.setupUniforms.call(mockThis, controller, null);

            expect(programManager.calls['uColor']).toBe(color);
        });

        it('should set uColorFactor from controller.colorFactor', function ()
        {
            var programManager = makeMockProgramManager();
            var mockThis = { programManager: programManager };
            var controller = makeController();
            controller.colorFactor = 0.5;

            FilterGradientMap.prototype.setupUniforms.call(mockThis, controller, null);

            expect(programManager.calls['uColorFactor']).toBe(0.5);
        });

        it('should set uAlpha from controller.alpha', function ()
        {
            var programManager = makeMockProgramManager();
            var mockThis = { programManager: programManager };
            var controller = makeController();
            controller.alpha = 0.3;

            FilterGradientMap.prototype.setupUniforms.call(mockThis, controller, null);

            expect(programManager.calls['uAlpha']).toBe(0.3);
        });

        it('should set all eight uniforms in a single call', function ()
        {
            var programManager = makeMockProgramManager();
            var mockThis = { programManager: programManager };

            FilterGradientMap.prototype.setupUniforms.call(mockThis, makeController(), null);

            var keys = Object.keys(programManager.calls);
            expect(keys.length).toBe(8);
            expect(keys).toContain('uRampTexture');
            expect(keys).toContain('uRampResolution');
            expect(keys).toContain('uRampBandStart');
            expect(keys).toContain('uDither');
            expect(keys).toContain('uUnpremultiply');
            expect(keys).toContain('uColor');
            expect(keys).toContain('uColorFactor');
            expect(keys).toContain('uAlpha');
        });
    });

    describe('updateShaderConfig', function ()
    {
        function makeRampAddition ()
        {
            return {
                name: 'RAMP_0',
                tags: 'RAMP',
                additions: {
                    fragmentHeader: '#define BAND_TREE_DEPTH 0.0\nsome other glsl'
                }
            };
        }

        function makeProgramManager (addition)
        {
            return {
                getAdditionsByTag: function (tag)
                {
                    if (tag === 'RAMP')
                    {
                        return [addition];
                    }
                    return [];
                }
            };
        }

        it('should update the ramp addition name to RAMP_<depth>', function ()
        {
            var addition = makeRampAddition();
            var mockThis = { programManager: makeProgramManager(addition) };
            var controller = { ramp: { bandTreeDepth: 3 } };

            FilterGradientMap.prototype.updateShaderConfig.call(mockThis, controller, null);

            expect(addition.name).toBe('RAMP_3');
        });

        it('should set name to RAMP_0 when depth is 0', function ()
        {
            var addition = makeRampAddition();
            var mockThis = { programManager: makeProgramManager(addition) };
            var controller = { ramp: { bandTreeDepth: 0 } };

            FilterGradientMap.prototype.updateShaderConfig.call(mockThis, controller, null);

            expect(addition.name).toBe('RAMP_0');
        });

        it('should replace BAND_TREE_DEPTH define in fragmentHeader', function ()
        {
            var addition = makeRampAddition();
            var mockThis = { programManager: makeProgramManager(addition) };
            var controller = { ramp: { bandTreeDepth: 4 } };

            FilterGradientMap.prototype.updateShaderConfig.call(mockThis, controller, null);

            expect(addition.additions.fragmentHeader).toContain('#define BAND_TREE_DEPTH 4.0');
        });

        it('should remove the original BAND_TREE_DEPTH 0.0 define', function ()
        {
            var addition = makeRampAddition();
            var mockThis = { programManager: makeProgramManager(addition) };
            var controller = { ramp: { bandTreeDepth: 2 } };

            FilterGradientMap.prototype.updateShaderConfig.call(mockThis, controller, null);

            expect(addition.additions.fragmentHeader).not.toContain('#define BAND_TREE_DEPTH 0.0');
        });

        it('should preserve the rest of the RampGlsl content beyond the replaced define', function ()
        {
            var addition = makeRampAddition();
            var mockThis = { programManager: makeProgramManager(addition) };
            var controller = { ramp: { bandTreeDepth: 1 } };

            FilterGradientMap.prototype.updateShaderConfig.call(mockThis, controller, null);

            // The replacement is done on the RampGlsl source, so other GLSL content survives
            expect(addition.additions.fragmentHeader).toContain('uniform sampler2D uRampTexture');
            expect(addition.additions.fragmentHeader).toContain('vec4 getRampAt');
        });

        it('should update both name and fragmentHeader in one call', function ()
        {
            var addition = makeRampAddition();
            var mockThis = { programManager: makeProgramManager(addition) };
            var controller = { ramp: { bandTreeDepth: 5 } };

            FilterGradientMap.prototype.updateShaderConfig.call(mockThis, controller, null);

            expect(addition.name).toBe('RAMP_5');
            expect(addition.additions.fragmentHeader).toContain('#define BAND_TREE_DEPTH 5.0');
        });

        it('should use the real RampGlsl source string from the shader module', function ()
        {
            var RampGlsl = require('../../../../../src/renderer/webgl/shaders/Ramp-glsl.js');
            var addition = {
                name: 'RAMP_0',
                tags: 'RAMP',
                additions: {
                    fragmentHeader: RampGlsl
                }
            };
            var mockThis = { programManager: makeProgramManager(addition) };
            var controller = { ramp: { bandTreeDepth: 7 } };

            FilterGradientMap.prototype.updateShaderConfig.call(mockThis, controller, null);

            expect(addition.name).toBe('RAMP_7');
            expect(addition.additions.fragmentHeader).toContain('#define BAND_TREE_DEPTH 7.0');
            expect(addition.additions.fragmentHeader).not.toContain('#define BAND_TREE_DEPTH 0.0');
        });

        it('should ignore the drawingContext parameter', function ()
        {
            var addition = makeRampAddition();
            var mockThis = { programManager: makeProgramManager(addition) };
            var controller = { ramp: { bandTreeDepth: 2 } };

            expect(function ()
            {
                FilterGradientMap.prototype.updateShaderConfig.call(mockThis, controller, undefined);
            }).not.toThrow();
        });
    });
});
