vi.mock('../../../../../src/renderer/webgl/renderNodes/filters/BaseFilterShader', function ()
{
    function BaseFilterShader () {}
    BaseFilterShader.prototype = {};
    return BaseFilterShader;
});

vi.mock('../../../../../src/renderer/webgl/shaders/FilterGlow-frag.js', function ()
{
    return 'void main() {}';
});

var FilterGlow = require('../../../../../src/renderer/webgl/renderNodes/filters/FilterGlow');

describe('FilterGlow', function ()
{
    var instance;
    var mockProgramManager;

    beforeEach(function ()
    {
        mockProgramManager = {
            uniforms: {},
            additions: {
                distance: [
                    {
                        name: 'distance_10.0',
                        additions: { fragmentDefine: '#define DISTANCE 10.0' },
                        tags: [ 'distance' ]
                    }
                ],
                quality: [
                    {
                        name: 'quality_0.1',
                        additions: { fragmentDefine: '#define QUALITY 0.1' },
                        tags: [ 'quality' ]
                    }
                ]
            },
            getAdditionsByTag: function (tag)
            {
                return this.additions[tag] || [];
            },
            setUniform: function (name, value)
            {
                this.uniforms[name] = value;
            }
        };

        instance = Object.create(FilterGlow.prototype);
        instance.programManager = mockProgramManager;
    });

    describe('updateShaderConfig', function ()
    {
        it('should update distance addition name with controller distance', function ()
        {
            var controller = { distance: 15, quality: 0.1 };
            var drawingContext = {};

            FilterGlow.prototype.updateShaderConfig.call(instance, controller, drawingContext);

            expect(mockProgramManager.additions.distance[0].name).toBe('distance_15.0');
        });

        it('should update distance fragmentDefine with undef and define', function ()
        {
            var controller = { distance: 20, quality: 0.1 };
            var drawingContext = {};

            FilterGlow.prototype.updateShaderConfig.call(instance, controller, drawingContext);

            expect(mockProgramManager.additions.distance[0].additions.fragmentDefine).toBe('#undef DISTANCE\n#define DISTANCE 20.0');
        });

        it('should update quality addition name with controller quality', function ()
        {
            var controller = { distance: 10, quality: 3 };
            var drawingContext = {};

            FilterGlow.prototype.updateShaderConfig.call(instance, controller, drawingContext);

            expect(mockProgramManager.additions.quality[0].name).toBe('quality_3.0');
        });

        it('should update quality fragmentDefine with undef and define', function ()
        {
            var controller = { distance: 10, quality: 5 };
            var drawingContext = {};

            FilterGlow.prototype.updateShaderConfig.call(instance, controller, drawingContext);

            expect(mockProgramManager.additions.quality[0].additions.fragmentDefine).toBe('#undef QUALITY\n#define QUALITY 5.0');
        });

        it('should use toFixed(0) formatting, truncating decimal part of distance', function ()
        {
            var controller = { distance: 7.9, quality: 1 };
            var drawingContext = {};

            FilterGlow.prototype.updateShaderConfig.call(instance, controller, drawingContext);

            expect(mockProgramManager.additions.distance[0].name).toBe('distance_8.0');
        });

        it('should use toFixed(0) formatting, truncating decimal part of quality', function ()
        {
            var controller = { distance: 10, quality: 2.7 };
            var drawingContext = {};

            FilterGlow.prototype.updateShaderConfig.call(instance, controller, drawingContext);

            expect(mockProgramManager.additions.quality[0].name).toBe('quality_3.0');
        });

        it('should handle distance of zero', function ()
        {
            var controller = { distance: 0, quality: 1 };
            var drawingContext = {};

            FilterGlow.prototype.updateShaderConfig.call(instance, controller, drawingContext);

            expect(mockProgramManager.additions.distance[0].name).toBe('distance_0.0');
            expect(mockProgramManager.additions.distance[0].additions.fragmentDefine).toBe('#undef DISTANCE\n#define DISTANCE 0.0');
        });

        it('should handle large distance values', function ()
        {
            var controller = { distance: 100, quality: 1 };
            var drawingContext = {};

            FilterGlow.prototype.updateShaderConfig.call(instance, controller, drawingContext);

            expect(mockProgramManager.additions.distance[0].name).toBe('distance_100.0');
            expect(mockProgramManager.additions.distance[0].additions.fragmentDefine).toBe('#undef DISTANCE\n#define DISTANCE 100.0');
        });
    });

    describe('setupUniforms', function ()
    {
        it('should set resolution uniform from drawingContext dimensions', function ()
        {
            var controller = { glcolor: [ 1, 0, 0, 1 ], outerStrength: 4, innerStrength: 0, scale: 1, knockout: false };
            var drawingContext = { width: 800, height: 600 };

            FilterGlow.prototype.setupUniforms.call(instance, controller, drawingContext);

            expect(mockProgramManager.uniforms['resolution']).toEqual([ 800, 600 ]);
        });

        it('should set glowColor uniform from controller glcolor', function ()
        {
            var glcolor = [ 0.5, 0.2, 1.0, 1.0 ];
            var controller = { glcolor: glcolor, outerStrength: 4, innerStrength: 0, scale: 1, knockout: false };
            var drawingContext = { width: 100, height: 100 };

            FilterGlow.prototype.setupUniforms.call(instance, controller, drawingContext);

            expect(mockProgramManager.uniforms['glowColor']).toBe(glcolor);
        });

        it('should set outerStrength uniform from controller', function ()
        {
            var controller = { glcolor: [ 1, 1, 1, 1 ], outerStrength: 8, innerStrength: 0, scale: 1, knockout: false };
            var drawingContext = { width: 100, height: 100 };

            FilterGlow.prototype.setupUniforms.call(instance, controller, drawingContext);

            expect(mockProgramManager.uniforms['outerStrength']).toBe(8);
        });

        it('should set innerStrength uniform from controller', function ()
        {
            var controller = { glcolor: [ 1, 1, 1, 1 ], outerStrength: 0, innerStrength: 3, scale: 1, knockout: false };
            var drawingContext = { width: 100, height: 100 };

            FilterGlow.prototype.setupUniforms.call(instance, controller, drawingContext);

            expect(mockProgramManager.uniforms['innerStrength']).toBe(3);
        });

        it('should set scale uniform from controller', function ()
        {
            var controller = { glcolor: [ 1, 1, 1, 1 ], outerStrength: 0, innerStrength: 0, scale: 2.5, knockout: false };
            var drawingContext = { width: 100, height: 100 };

            FilterGlow.prototype.setupUniforms.call(instance, controller, drawingContext);

            expect(mockProgramManager.uniforms['scale']).toBe(2.5);
        });

        it('should set knockout uniform to true when controller knockout is true', function ()
        {
            var controller = { glcolor: [ 1, 1, 1, 1 ], outerStrength: 4, innerStrength: 0, scale: 1, knockout: true };
            var drawingContext = { width: 100, height: 100 };

            FilterGlow.prototype.setupUniforms.call(instance, controller, drawingContext);

            expect(mockProgramManager.uniforms['knockout']).toBe(true);
        });

        it('should set knockout uniform to false when controller knockout is false', function ()
        {
            var controller = { glcolor: [ 1, 1, 1, 1 ], outerStrength: 4, innerStrength: 0, scale: 1, knockout: false };
            var drawingContext = { width: 100, height: 100 };

            FilterGlow.prototype.setupUniforms.call(instance, controller, drawingContext);

            expect(mockProgramManager.uniforms['knockout']).toBe(false);
        });

        it('should set all six uniforms in a single call', function ()
        {
            var controller = { glcolor: [ 0, 1, 0, 1 ], outerStrength: 5, innerStrength: 2, scale: 0.5, knockout: true };
            var drawingContext = { width: 1920, height: 1080 };

            FilterGlow.prototype.setupUniforms.call(instance, controller, drawingContext);

            expect(mockProgramManager.uniforms['resolution']).toEqual([ 1920, 1080 ]);
            expect(mockProgramManager.uniforms['glowColor']).toBe(controller.glcolor);
            expect(mockProgramManager.uniforms['outerStrength']).toBe(5);
            expect(mockProgramManager.uniforms['innerStrength']).toBe(2);
            expect(mockProgramManager.uniforms['scale']).toBe(0.5);
            expect(mockProgramManager.uniforms['knockout']).toBe(true);
        });

        it('should handle zero dimensions in drawingContext', function ()
        {
            var controller = { glcolor: [ 1, 1, 1, 1 ], outerStrength: 4, innerStrength: 0, scale: 1, knockout: false };
            var drawingContext = { width: 0, height: 0 };

            FilterGlow.prototype.setupUniforms.call(instance, controller, drawingContext);

            expect(mockProgramManager.uniforms['resolution']).toEqual([ 0, 0 ]);
        });

        it('should handle outerStrength and innerStrength of zero', function ()
        {
            var controller = { glcolor: [ 1, 1, 1, 1 ], outerStrength: 0, innerStrength: 0, scale: 1, knockout: false };
            var drawingContext = { width: 100, height: 100 };

            FilterGlow.prototype.setupUniforms.call(instance, controller, drawingContext);

            expect(mockProgramManager.uniforms['outerStrength']).toBe(0);
            expect(mockProgramManager.uniforms['innerStrength']).toBe(0);
        });
    });
});
