var FilterNormalTools = require('../../../../../src/renderer/webgl/renderNodes/filters/FilterNormalTools');

describe('FilterNormalTools', function ()
{
    it('should be importable', function ()
    {
        expect(FilterNormalTools).toBeDefined();
    });

    describe('updateShaderConfig', function ()
    {
        var mockAddition;
        var mockThis;

        beforeEach(function ()
        {
            mockAddition = {
                name: 'view',
                additions: {
                    fragmentHeader: '#define VIEW_MATRIX'
                }
            };

            mockThis = {
                programManager: {
                    getAdditionsByTag: function (tag)
                    {
                        return [ mockAddition ];
                    }
                }
            };
        });

        it('should reset name to view and header to VIEW_MATRIX define', function ()
        {
            var controller = { facingPower: 1, outputRatio: false };

            FilterNormalTools.prototype.updateShaderConfig.call(mockThis, controller, {});

            expect(mockAddition.name).toBe('view');
            expect(mockAddition.additions.fragmentHeader).toBe('#define VIEW_MATRIX');
        });

        it('should append _facingPower to name when facingPower is not 1', function ()
        {
            var controller = { facingPower: 2, outputRatio: false };

            FilterNormalTools.prototype.updateShaderConfig.call(mockThis, controller, {});

            expect(mockAddition.name).toBe('view_facingPower');
        });

        it('should append FACING_POWER define when facingPower is not 1', function ()
        {
            var controller = { facingPower: 0.5, outputRatio: false };

            FilterNormalTools.prototype.updateShaderConfig.call(mockThis, controller, {});

            expect(mockAddition.additions.fragmentHeader).toBe('#define VIEW_MATRIX\n#define FACING_POWER');
        });

        it('should not append _facingPower to name when facingPower is exactly 1', function ()
        {
            var controller = { facingPower: 1, outputRatio: false };

            FilterNormalTools.prototype.updateShaderConfig.call(mockThis, controller, {});

            expect(mockAddition.name).toBe('view');
            expect(mockAddition.additions.fragmentHeader).toBe('#define VIEW_MATRIX');
        });

        it('should append _ratio to name when outputRatio is true', function ()
        {
            var controller = { facingPower: 1, outputRatio: true };

            FilterNormalTools.prototype.updateShaderConfig.call(mockThis, controller, {});

            expect(mockAddition.name).toBe('view_ratio');
        });

        it('should append OUTPUT_RATIO define when outputRatio is true', function ()
        {
            var controller = { facingPower: 1, outputRatio: true };

            FilterNormalTools.prototype.updateShaderConfig.call(mockThis, controller, {});

            expect(mockAddition.additions.fragmentHeader).toBe('#define VIEW_MATRIX\n#define OUTPUT_RATIO');
        });

        it('should append both _facingPower and _ratio to name when both are active', function ()
        {
            var controller = { facingPower: 3, outputRatio: true };

            FilterNormalTools.prototype.updateShaderConfig.call(mockThis, controller, {});

            expect(mockAddition.name).toBe('view_facingPower_ratio');
        });

        it('should append both FACING_POWER and OUTPUT_RATIO defines when both are active', function ()
        {
            var controller = { facingPower: 3, outputRatio: true };

            FilterNormalTools.prototype.updateShaderConfig.call(mockThis, controller, {});

            expect(mockAddition.additions.fragmentHeader).toBe('#define VIEW_MATRIX\n#define FACING_POWER\n#define OUTPUT_RATIO');
        });

        it('should reset name on repeated calls even when previously modified', function ()
        {
            var controller = { facingPower: 2, outputRatio: true };

            FilterNormalTools.prototype.updateShaderConfig.call(mockThis, controller, {});
            expect(mockAddition.name).toBe('view_facingPower_ratio');

            var controller2 = { facingPower: 1, outputRatio: false };

            FilterNormalTools.prototype.updateShaderConfig.call(mockThis, controller2, {});
            expect(mockAddition.name).toBe('view');
            expect(mockAddition.additions.fragmentHeader).toBe('#define VIEW_MATRIX');
        });

        it('should treat facingPower of 0 as not equal to 1', function ()
        {
            var controller = { facingPower: 0, outputRatio: false };

            FilterNormalTools.prototype.updateShaderConfig.call(mockThis, controller, {});

            expect(mockAddition.name).toBe('view_facingPower');
            expect(mockAddition.additions.fragmentHeader).toBe('#define VIEW_MATRIX\n#define FACING_POWER');
        });

        it('should treat negative facingPower as not equal to 1', function ()
        {
            var controller = { facingPower: -1, outputRatio: false };

            FilterNormalTools.prototype.updateShaderConfig.call(mockThis, controller, {});

            expect(mockAddition.name).toBe('view_facingPower');
        });
    });

    describe('setupUniforms', function ()
    {
        var uniforms;
        var mockThis;

        beforeEach(function ()
        {
            uniforms = {};

            mockThis = {
                programManager: {
                    setUniform: function (name, value)
                    {
                        uniforms[name] = value;
                    }
                }
            };
        });

        it('should always set uViewMatrix uniform', function ()
        {
            var matVal = [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ];
            var controller = {
                viewMatrix: { val: matVal },
                facingPower: 1,
                outputRatio: false
            };

            FilterNormalTools.prototype.setupUniforms.call(mockThis, controller, {});

            expect(uniforms['uViewMatrix']).toBe(matVal);
        });

        it('should not set uFacingPower when facingPower is 1', function ()
        {
            var controller = {
                viewMatrix: { val: [] },
                facingPower: 1,
                outputRatio: false
            };

            FilterNormalTools.prototype.setupUniforms.call(mockThis, controller, {});

            expect(uniforms['uFacingPower']).toBeUndefined();
        });

        it('should set uFacingPower when facingPower is not 1', function ()
        {
            var controller = {
                viewMatrix: { val: [] },
                facingPower: 2.5,
                outputRatio: false
            };

            FilterNormalTools.prototype.setupUniforms.call(mockThis, controller, {});

            expect(uniforms['uFacingPower']).toBe(2.5);
        });

        it('should set uFacingPower when facingPower is 0', function ()
        {
            var controller = {
                viewMatrix: { val: [] },
                facingPower: 0,
                outputRatio: false
            };

            FilterNormalTools.prototype.setupUniforms.call(mockThis, controller, {});

            expect(uniforms['uFacingPower']).toBe(0);
        });

        it('should not set uRatioVector or uRatioRadius when outputRatio is false', function ()
        {
            var controller = {
                viewMatrix: { val: [] },
                facingPower: 1,
                outputRatio: false
            };

            FilterNormalTools.prototype.setupUniforms.call(mockThis, controller, {});

            expect(uniforms['uRatioVector']).toBeUndefined();
            expect(uniforms['uRatioRadius']).toBeUndefined();
        });

        it('should set uRatioVector from ratioVector x, y, z when outputRatio is true', function ()
        {
            var controller = {
                viewMatrix: { val: [] },
                facingPower: 1,
                outputRatio: true,
                ratioVector: { x: 0.5, y: -0.3, z: 0.8 },
                ratioRadius: 10
            };

            FilterNormalTools.prototype.setupUniforms.call(mockThis, controller, {});

            expect(uniforms['uRatioVector']).toEqual([ 0.5, -0.3, 0.8 ]);
        });

        it('should set uRatioRadius when outputRatio is true', function ()
        {
            var controller = {
                viewMatrix: { val: [] },
                facingPower: 1,
                outputRatio: true,
                ratioVector: { x: 0, y: 0, z: 1 },
                ratioRadius: 42
            };

            FilterNormalTools.prototype.setupUniforms.call(mockThis, controller, {});

            expect(uniforms['uRatioRadius']).toBe(42);
        });

        it('should set all uniforms when facingPower is not 1 and outputRatio is true', function ()
        {
            var matVal = [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ];
            var controller = {
                viewMatrix: { val: matVal },
                facingPower: 4,
                outputRatio: true,
                ratioVector: { x: 1, y: 0, z: 0 },
                ratioRadius: 5
            };

            FilterNormalTools.prototype.setupUniforms.call(mockThis, controller, {});

            expect(uniforms['uViewMatrix']).toBe(matVal);
            expect(uniforms['uFacingPower']).toBe(4);
            expect(uniforms['uRatioVector']).toEqual([ 1, 0, 0 ]);
            expect(uniforms['uRatioRadius']).toBe(5);
        });

        it('should build uRatioVector as a new array each call', function ()
        {
            var rv = { x: 0.1, y: 0.2, z: 0.3 };
            var controller = {
                viewMatrix: { val: [] },
                facingPower: 1,
                outputRatio: true,
                ratioVector: rv,
                ratioRadius: 1
            };

            FilterNormalTools.prototype.setupUniforms.call(mockThis, controller, {});
            var first = uniforms['uRatioVector'];

            rv.x = 0.9;
            FilterNormalTools.prototype.setupUniforms.call(mockThis, controller, {});
            var second = uniforms['uRatioVector'];

            expect(first).not.toBe(second);
            expect(second[0]).toBeCloseTo(0.9);
        });
    });
});
