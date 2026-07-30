var SubmitterTilemapGPULayer = require('../../../../../src/renderer/webgl/renderNodes/submitter/SubmitterTilemapGPULayer');

describe('SubmitterTilemapGPULayer', function ()
{
    it('should be importable', function ()
    {
        expect(SubmitterTilemapGPULayer).toBeDefined();
    });

    describe('_completeLayout', function ()
    {
        var completeLayout;

        beforeEach(function ()
        {
            completeLayout = SubmitterTilemapGPULayer.prototype._completeLayout;
        });

        it('should populate vertexBufferLayout from layoutSource', function ()
        {
            var config = {
                vertexBufferLayout: {
                    usage: 'DYNAMIC_DRAW',
                    count: 4,
                    layout: [
                        { name: 'inPosition', size: 2 }
                    ]
                }
            };

            completeLayout.call({}, config);

            expect(config.vertexBufferLayout.usage).toBe('DYNAMIC_DRAW');
            expect(config.vertexBufferLayout.count).toBe(4);
            expect(Array.isArray(config.vertexBufferLayout.layout)).toBe(true);
        });

        it('should default count to 4 when not provided', function ()
        {
            var config = {
                vertexBufferLayout: {
                    usage: 'DYNAMIC_DRAW',
                    layout: [
                        { name: 'inPosition', size: 2 }
                    ]
                }
            };

            completeLayout.call({}, config);

            expect(config.vertexBufferLayout.count).toBe(4);
        });

        it('should preserve an explicit count value', function ()
        {
            var config = {
                vertexBufferLayout: {
                    usage: 'DYNAMIC_DRAW',
                    count: 6,
                    layout: []
                }
            };

            completeLayout.call({}, config);

            expect(config.vertexBufferLayout.count).toBe(6);
        });

        it('should set default size to 1 when not provided', function ()
        {
            var config = {
                vertexBufferLayout: {
                    usage: 'DYNAMIC_DRAW',
                    count: 4,
                    layout: [
                        { name: 'inPosition' }
                    ]
                }
            };

            completeLayout.call({}, config);

            expect(config.vertexBufferLayout.layout[0].size).toBe(1);
        });

        it('should preserve an explicit size value', function ()
        {
            var config = {
                vertexBufferLayout: {
                    usage: 'DYNAMIC_DRAW',
                    count: 4,
                    layout: [
                        { name: 'inTexCoord', size: 2 }
                    ]
                }
            };

            completeLayout.call({}, config);

            expect(config.vertexBufferLayout.layout[0].size).toBe(2);
        });

        it('should set default type to FLOAT when not provided', function ()
        {
            var config = {
                vertexBufferLayout: {
                    usage: 'DYNAMIC_DRAW',
                    count: 4,
                    layout: [
                        { name: 'inPosition' }
                    ]
                }
            };

            completeLayout.call({}, config);

            expect(config.vertexBufferLayout.layout[0].type).toBe('FLOAT');
        });

        it('should preserve an explicit type value', function ()
        {
            var config = {
                vertexBufferLayout: {
                    usage: 'DYNAMIC_DRAW',
                    count: 4,
                    layout: [
                        { name: 'inColor', type: 'UNSIGNED_BYTE' }
                    ]
                }
            };

            completeLayout.call({}, config);

            expect(config.vertexBufferLayout.layout[0].type).toBe('UNSIGNED_BYTE');
        });

        it('should set default normalized to false when not provided', function ()
        {
            var config = {
                vertexBufferLayout: {
                    usage: 'DYNAMIC_DRAW',
                    count: 4,
                    layout: [
                        { name: 'inPosition', size: 2 }
                    ]
                }
            };

            completeLayout.call({}, config);

            expect(config.vertexBufferLayout.layout[0].normalized).toBe(false);
        });

        it('should preserve explicit normalized true flag', function ()
        {
            var config = {
                vertexBufferLayout: {
                    usage: 'DYNAMIC_DRAW',
                    count: 4,
                    layout: [
                        { name: 'inColor', type: 'UNSIGNED_BYTE', normalized: true }
                    ]
                }
            };

            completeLayout.call({}, config);

            expect(config.vertexBufferLayout.layout[0].normalized).toBe(true);
        });

        it('should preserve the attribute name', function ()
        {
            var config = {
                vertexBufferLayout: {
                    usage: 'DYNAMIC_DRAW',
                    count: 4,
                    layout: [
                        { name: 'inTexCoord', size: 2 }
                    ]
                }
            };

            completeLayout.call({}, config);

            expect(config.vertexBufferLayout.layout[0].name).toBe('inTexCoord');
        });

        it('should skip attributes listed in vertexBufferLayoutRemove', function ()
        {
            var config = {
                vertexBufferLayout: {
                    usage: 'DYNAMIC_DRAW',
                    count: 4,
                    layout: [
                        { name: 'inPosition', size: 2 },
                        { name: 'inTexCoord', size: 2 }
                    ]
                },
                vertexBufferLayoutRemove: [ 'inTexCoord' ]
            };

            completeLayout.call({}, config);

            var names = config.vertexBufferLayout.layout
                .filter(function (attr) { return attr !== undefined; })
                .map(function (attr) { return attr.name; });

            expect(names.indexOf('inTexCoord')).toBe(-1);
            expect(names.indexOf('inPosition')).not.toBe(-1);
        });

        it('should not remove attributes not in vertexBufferLayoutRemove', function ()
        {
            var config = {
                vertexBufferLayout: {
                    usage: 'DYNAMIC_DRAW',
                    count: 4,
                    layout: [
                        { name: 'inPosition', size: 2 },
                        { name: 'inTexCoord', size: 2 }
                    ]
                },
                vertexBufferLayoutRemove: [ 'inOther' ]
            };

            completeLayout.call({}, config);

            var names = config.vertexBufferLayout.layout
                .filter(function (attr) { return attr !== undefined; })
                .map(function (attr) { return attr.name; });

            expect(names.indexOf('inPosition')).not.toBe(-1);
            expect(names.indexOf('inTexCoord')).not.toBe(-1);
        });

        it('should append extra attributes from vertexBufferLayoutAdd', function ()
        {
            var config = {
                vertexBufferLayout: {
                    usage: 'DYNAMIC_DRAW',
                    count: 4,
                    layout: [
                        { name: 'inPosition', size: 2 }
                    ]
                },
                vertexBufferLayoutAdd: [
                    { name: 'inExtra', size: 3, type: 'FLOAT' }
                ]
            };

            completeLayout.call({}, config);

            var extraAttr = config.vertexBufferLayout.layout.find(function (attr)
            {
                return attr && attr.name === 'inExtra';
            });

            expect(extraAttr).toBeDefined();
            expect(extraAttr.size).toBe(3);
            expect(extraAttr.type).toBe('FLOAT');
        });

        it('should apply default size and type to vertexBufferLayoutAdd entries', function ()
        {
            var config = {
                vertexBufferLayout: {
                    usage: 'DYNAMIC_DRAW',
                    count: 4,
                    layout: []
                },
                vertexBufferLayoutAdd: [
                    { name: 'inCustom' }
                ]
            };

            completeLayout.call({}, config);

            var extraAttr = config.vertexBufferLayout.layout.find(function (attr)
            {
                return attr && attr.name === 'inCustom';
            });

            expect(extraAttr).toBeDefined();
            expect(extraAttr.size).toBe(1);
            expect(extraAttr.type).toBe('FLOAT');
            expect(extraAttr.normalized).toBe(false);
        });

        it('should handle empty layout array without error', function ()
        {
            var config = {
                vertexBufferLayout: {
                    usage: 'DYNAMIC_DRAW',
                    count: 0,
                    layout: []
                }
            };

            expect(function ()
            {
                completeLayout.call({}, config);
            }).not.toThrow();

            expect(config.vertexBufferLayout.layout.length).toBe(0);
        });

        it('should handle missing vertexBufferLayoutRemove gracefully', function ()
        {
            var config = {
                vertexBufferLayout: {
                    usage: 'DYNAMIC_DRAW',
                    count: 4,
                    layout: [
                        { name: 'inPosition', size: 2 }
                    ]
                }
            };

            expect(function ()
            {
                completeLayout.call({}, config);
            }).not.toThrow();

            expect(config.vertexBufferLayout.layout[0].name).toBe('inPosition');
        });

        it('should handle multiple attributes in the layout', function ()
        {
            var config = {
                vertexBufferLayout: {
                    usage: 'DYNAMIC_DRAW',
                    count: 4,
                    layout: [
                        { name: 'inPosition', size: 2 },
                        { name: 'inTexCoord', size: 2 }
                    ]
                }
            };

            completeLayout.call({}, config);

            var names = config.vertexBufferLayout.layout
                .filter(function (attr) { return attr !== undefined; })
                .map(function (attr) { return attr.name; });

            expect(names.length).toBe(2);
            expect(names).toContain('inPosition');
            expect(names).toContain('inTexCoord');
        });
    });

    describe('defaultConfig', function ()
    {
        it('should have a default name of SubmitterTilemapGPULayer', function ()
        {
            expect(SubmitterTilemapGPULayer.prototype.defaultConfig.name).toBe('SubmitterTilemapGPULayer');
        });

        it('should have a shaderName of TilemapGPULayer', function ()
        {
            expect(SubmitterTilemapGPULayer.prototype.defaultConfig.shaderName).toBe('TilemapGPULayer');
        });

        it('should have default vertex and fragment shader sources defined', function ()
        {
            expect(SubmitterTilemapGPULayer.prototype.defaultConfig.vertexSource).toBeDefined();
            expect(SubmitterTilemapGPULayer.prototype.defaultConfig.fragmentSource).toBeDefined();
        });

        it('should have shaderAdditions as an array', function ()
        {
            expect(Array.isArray(SubmitterTilemapGPULayer.prototype.defaultConfig.shaderAdditions)).toBe(true);
        });

        it('should have five shader additions', function ()
        {
            expect(SubmitterTilemapGPULayer.prototype.defaultConfig.shaderAdditions.length).toBe(5);
        });

        it('should have a vertexBufferLayout defined', function ()
        {
            expect(SubmitterTilemapGPULayer.prototype.defaultConfig.vertexBufferLayout).toBeDefined();
        });

        it('should have vertexBufferLayout with DYNAMIC_DRAW usage', function ()
        {
            expect(SubmitterTilemapGPULayer.prototype.defaultConfig.vertexBufferLayout.usage).toBe('DYNAMIC_DRAW');
        });

        it('should have vertexBufferLayout with count of 4', function ()
        {
            expect(SubmitterTilemapGPULayer.prototype.defaultConfig.vertexBufferLayout.count).toBe(4);
        });

        it('should include inPosition attribute in vertexBufferLayout', function ()
        {
            var layout = SubmitterTilemapGPULayer.prototype.defaultConfig.vertexBufferLayout.layout;
            var inPosition = layout.find(function (attr) { return attr.name === 'inPosition'; });
            expect(inPosition).toBeDefined();
            expect(inPosition.size).toBe(2);
        });

        it('should include inTexCoord attribute in vertexBufferLayout', function ()
        {
            var layout = SubmitterTilemapGPULayer.prototype.defaultConfig.vertexBufferLayout.layout;
            var inTexCoord = layout.find(function (attr) { return attr.name === 'inTexCoord'; });
            expect(inTexCoord).toBeDefined();
            expect(inTexCoord.size).toBe(2);
        });

        it('should have exactly two attributes in vertexBufferLayout', function ()
        {
            var layout = SubmitterTilemapGPULayer.prototype.defaultConfig.vertexBufferLayout.layout;
            expect(layout.length).toBe(2);
        });
    });
});
