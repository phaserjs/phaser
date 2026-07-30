var FilterKey = require('../../../../../src/renderer/webgl/renderNodes/filters/FilterKey');

describe('FilterKey', function ()
{
    describe('setupUniforms', function ()
    {
        var mockProgramManager;
        var mockInstance;
        var mockController;

        beforeEach(function ()
        {
            mockProgramManager = {
                calls: [],
                setUniform: function (name, value)
                {
                    this.calls.push({ name: name, value: value });
                }
            };

            mockInstance = {
                programManager: mockProgramManager
            };

            mockController = {
                color: [ 0, 1, 0, 1 ],
                isolate: 0,
                threshold: 0.4,
                feather: 0.1
            };
        });

        it('should call setUniform twice', function ()
        {
            FilterKey.prototype.setupUniforms.call(mockInstance, mockController, null);

            expect(mockProgramManager.calls.length).toBe(2);
        });

        it('should set uColor uniform with the controller color', function ()
        {
            FilterKey.prototype.setupUniforms.call(mockInstance, mockController, null);

            var colorCall = mockProgramManager.calls.find(function (c) { return c.name === 'uColor'; });

            expect(colorCall).toBeDefined();
            expect(colorCall.value).toBe(mockController.color);
        });

        it('should set uIsolateThresholdFeather uniform as an array', function ()
        {
            FilterKey.prototype.setupUniforms.call(mockInstance, mockController, null);

            var itfCall = mockProgramManager.calls.find(function (c) { return c.name === 'uIsolateThresholdFeather'; });

            expect(itfCall).toBeDefined();
            expect(Array.isArray(itfCall.value)).toBe(true);
        });

        it('should pack isolate into uIsolateThresholdFeather[0]', function ()
        {
            mockController.isolate = 1;

            FilterKey.prototype.setupUniforms.call(mockInstance, mockController, null);

            var itfCall = mockProgramManager.calls.find(function (c) { return c.name === 'uIsolateThresholdFeather'; });

            expect(itfCall.value[0]).toBe(1);
        });

        it('should pack threshold into uIsolateThresholdFeather[1]', function ()
        {
            mockController.threshold = 0.75;

            FilterKey.prototype.setupUniforms.call(mockInstance, mockController, null);

            var itfCall = mockProgramManager.calls.find(function (c) { return c.name === 'uIsolateThresholdFeather'; });

            expect(itfCall.value[1]).toBeCloseTo(0.75);
        });

        it('should pack feather into uIsolateThresholdFeather[2]', function ()
        {
            mockController.feather = 0.25;

            FilterKey.prototype.setupUniforms.call(mockInstance, mockController, null);

            var itfCall = mockProgramManager.calls.find(function (c) { return c.name === 'uIsolateThresholdFeather'; });

            expect(itfCall.value[2]).toBeCloseTo(0.25);
        });

        it('should pack uIsolateThresholdFeather with exactly 3 elements', function ()
        {
            FilterKey.prototype.setupUniforms.call(mockInstance, mockController, null);

            var itfCall = mockProgramManager.calls.find(function (c) { return c.name === 'uIsolateThresholdFeather'; });

            expect(itfCall.value.length).toBe(3);
        });

        it('should work when isolate is 0 (non-isolate mode)', function ()
        {
            mockController.isolate = 0;
            mockController.threshold = 0.3;
            mockController.feather = 0.05;

            FilterKey.prototype.setupUniforms.call(mockInstance, mockController, null);

            var itfCall = mockProgramManager.calls.find(function (c) { return c.name === 'uIsolateThresholdFeather'; });

            expect(itfCall.value[0]).toBe(0);
            expect(itfCall.value[1]).toBeCloseTo(0.3);
            expect(itfCall.value[2]).toBeCloseTo(0.05);
        });

        it('should work when isolate is 1 (isolate mode)', function ()
        {
            mockController.isolate = 1;
            mockController.threshold = 0.5;
            mockController.feather = 0.0;

            FilterKey.prototype.setupUniforms.call(mockInstance, mockController, null);

            var itfCall = mockProgramManager.calls.find(function (c) { return c.name === 'uIsolateThresholdFeather'; });

            expect(itfCall.value[0]).toBe(1);
        });

        it('should work with zero threshold and zero feather', function ()
        {
            mockController.threshold = 0;
            mockController.feather = 0;

            FilterKey.prototype.setupUniforms.call(mockInstance, mockController, null);

            var itfCall = mockProgramManager.calls.find(function (c) { return c.name === 'uIsolateThresholdFeather'; });

            expect(itfCall.value[1]).toBe(0);
            expect(itfCall.value[2]).toBe(0);
        });

        it('should ignore the drawingContext argument', function ()
        {
            var sentinelContext = { marker: 'unused' };

            FilterKey.prototype.setupUniforms.call(mockInstance, mockController, sentinelContext);

            expect(mockProgramManager.calls.length).toBe(2);
        });

        it('should pass color by reference, not by copy', function ()
        {
            var colorArray = [ 1, 0, 0, 1 ];
            mockController.color = colorArray;

            FilterKey.prototype.setupUniforms.call(mockInstance, mockController, null);

            var colorCall = mockProgramManager.calls.find(function (c) { return c.name === 'uColor'; });

            expect(colorCall.value).toBe(colorArray);
        });

        it('should use uColor as the first uniform set', function ()
        {
            FilterKey.prototype.setupUniforms.call(mockInstance, mockController, null);

            expect(mockProgramManager.calls[0].name).toBe('uColor');
        });

        it('should use uIsolateThresholdFeather as the second uniform set', function ()
        {
            FilterKey.prototype.setupUniforms.call(mockInstance, mockController, null);

            expect(mockProgramManager.calls[1].name).toBe('uIsolateThresholdFeather');
        });
    });
});
