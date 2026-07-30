var FilterShadow = require('../../../../../src/renderer/webgl/renderNodes/filters/FilterShadow');

describe('FilterShadow', function ()
{
    var setupUniforms = FilterShadow.prototype.setupUniforms;

    function createMockProgramManager ()
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

    function createMockController (overrides)
    {
        var defaults = {
            x: 0.5,
            y: 0.5,
            decay: 0.9,
            power: 2.0,
            samples: 10,
            glcolor: [ 0, 0, 0, 1 ],
            intensity: 1.0
        };

        if (overrides)
        {
            for (var key in overrides)
            {
                defaults[key] = overrides[key];
            }
        }

        return defaults;
    }

    describe('setupUniforms', function ()
    {
        it('should set lightPosition uniform with x and inverted y', function ()
        {
            var programManager = createMockProgramManager();
            var controller = createMockController({ x: 0.25, y: 0.75 });
            var context = { programManager: programManager };

            setupUniforms.call(context, controller, {});

            expect(programManager.calls['lightPosition'][0]).toBeCloseTo(0.25);
            expect(programManager.calls['lightPosition'][1]).toBeCloseTo(0.25);
        });

        it('should invert the y axis for WebGL UV space', function ()
        {
            var programManager = createMockProgramManager();
            var controller = createMockController({ x: 0, y: 0 });
            var context = { programManager: programManager };

            setupUniforms.call(context, controller, {});

            expect(programManager.calls['lightPosition'][0]).toBeCloseTo(0);
            expect(programManager.calls['lightPosition'][1]).toBeCloseTo(1);
        });

        it('should set lightPosition y to 0 when controller y is 1', function ()
        {
            var programManager = createMockProgramManager();
            var controller = createMockController({ x: 1, y: 1 });
            var context = { programManager: programManager };

            setupUniforms.call(context, controller, {});

            expect(programManager.calls['lightPosition'][0]).toBeCloseTo(1);
            expect(programManager.calls['lightPosition'][1]).toBeCloseTo(0);
        });

        it('should set decay uniform from controller', function ()
        {
            var programManager = createMockProgramManager();
            var controller = createMockController({ decay: 0.85 });
            var context = { programManager: programManager };

            setupUniforms.call(context, controller, {});

            expect(programManager.calls['decay']).toBeCloseTo(0.85);
        });

        it('should set power uniform as power divided by samples', function ()
        {
            var programManager = createMockProgramManager();
            var controller = createMockController({ power: 5.0, samples: 10 });
            var context = { programManager: programManager };

            setupUniforms.call(context, controller, {});

            expect(programManager.calls['power']).toBeCloseTo(0.5);
        });

        it('should normalize power by sample count', function ()
        {
            var programManager = createMockProgramManager();
            var controller = createMockController({ power: 3.0, samples: 6 });
            var context = { programManager: programManager };

            setupUniforms.call(context, controller, {});

            expect(programManager.calls['power']).toBeCloseTo(0.5);
        });

        it('should set power to full value when samples is 1', function ()
        {
            var programManager = createMockProgramManager();
            var controller = createMockController({ power: 4.0, samples: 1 });
            var context = { programManager: programManager };

            setupUniforms.call(context, controller, {});

            expect(programManager.calls['power']).toBeCloseTo(4.0);
        });

        it('should set color uniform from controller glcolor', function ()
        {
            var glcolor = [ 0.2, 0.4, 0.6, 1.0 ];
            var programManager = createMockProgramManager();
            var controller = createMockController({ glcolor: glcolor });
            var context = { programManager: programManager };

            setupUniforms.call(context, controller, {});

            expect(programManager.calls['color']).toBe(glcolor);
        });

        it('should set samples uniform from controller', function ()
        {
            var programManager = createMockProgramManager();
            var controller = createMockController({ samples: 32 });
            var context = { programManager: programManager };

            setupUniforms.call(context, controller, {});

            expect(programManager.calls['samples']).toBe(32);
        });

        it('should set intensity uniform from controller', function ()
        {
            var programManager = createMockProgramManager();
            var controller = createMockController({ intensity: 0.75 });
            var context = { programManager: programManager };

            setupUniforms.call(context, controller, {});

            expect(programManager.calls['intensity']).toBeCloseTo(0.75);
        });

        it('should set all uniforms in a single call', function ()
        {
            var programManager = createMockProgramManager();
            var controller = createMockController({
                x: 0.3,
                y: 0.4,
                decay: 0.7,
                power: 6.0,
                samples: 20,
                glcolor: [ 1, 0, 0, 1 ],
                intensity: 0.9
            });
            var context = { programManager: programManager };

            setupUniforms.call(context, controller, {});

            expect(programManager.calls['lightPosition'][0]).toBeCloseTo(0.3);
            expect(programManager.calls['lightPosition'][1]).toBeCloseTo(0.6);
            expect(programManager.calls['decay']).toBeCloseTo(0.7);
            expect(programManager.calls['power']).toBeCloseTo(0.3);
            expect(programManager.calls['samples']).toBe(20);
            expect(programManager.calls['intensity']).toBeCloseTo(0.9);
        });

        it('should handle zero decay', function ()
        {
            var programManager = createMockProgramManager();
            var controller = createMockController({ decay: 0 });
            var context = { programManager: programManager };

            setupUniforms.call(context, controller, {});

            expect(programManager.calls['decay']).toBeCloseTo(0);
        });

        it('should handle zero intensity', function ()
        {
            var programManager = createMockProgramManager();
            var controller = createMockController({ intensity: 0 });
            var context = { programManager: programManager };

            setupUniforms.call(context, controller, {});

            expect(programManager.calls['intensity']).toBeCloseTo(0);
        });

        it('should handle negative x and y positions', function ()
        {
            var programManager = createMockProgramManager();
            var controller = createMockController({ x: -0.5, y: -0.5 });
            var context = { programManager: programManager };

            setupUniforms.call(context, controller, {});

            expect(programManager.calls['lightPosition'][0]).toBeCloseTo(-0.5);
            expect(programManager.calls['lightPosition'][1]).toBeCloseTo(1.5);
        });

        it('should pass drawingContext without error even when unused', function ()
        {
            var programManager = createMockProgramManager();
            var controller = createMockController();
            var context = { programManager: programManager };
            var drawingContext = { someProperty: 'value' };

            expect(function ()
            {
                setupUniforms.call(context, controller, drawingContext);
            }).not.toThrow();
        });
    });
});
