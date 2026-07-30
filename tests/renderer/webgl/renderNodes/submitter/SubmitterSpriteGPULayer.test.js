var SubmitterSpriteGPULayer = require('../../../../../src/renderer/webgl/renderNodes/submitter/SubmitterSpriteGPULayer');

describe('SubmitterSpriteGPULayer', function ()
{
    it('should be importable', function ()
    {
        expect(SubmitterSpriteGPULayer).toBeDefined();
    });

    describe('_completeLayout', function ()
    {
        var completeLayout;

        beforeEach(function ()
        {
            completeLayout = SubmitterSpriteGPULayer.prototype._completeLayout;
        });

        it('should populate vertexBufferLayout from layoutSource', function ()
        {
            var config = {
                vertexBufferLayout: {
                    usage: 'STATIC_DRAW',
                    count: 4,
                    layout: [
                        { name: 'inVertex', type: 'UNSIGNED_BYTE' }
                    ]
                },
                instanceBufferLayout: {
                    usage: 'DYNAMIC_DRAW',
                    instanceDivisor: 1,
                    layout: []
                }
            };

            completeLayout.call({}, config);

            expect(config.vertexBufferLayout.usage).toBe('STATIC_DRAW');
            expect(config.vertexBufferLayout.count).toBe(4);
            expect(Array.isArray(config.vertexBufferLayout.layout)).toBe(true);
        });

        it('should set default size to 1 when not provided', function ()
        {
            var config = {
                vertexBufferLayout: {
                    usage: 'STATIC_DRAW',
                    count: 4,
                    layout: [
                        { name: 'inVertex', type: 'UNSIGNED_BYTE' }
                    ]
                },
                instanceBufferLayout: {
                    usage: 'DYNAMIC_DRAW',
                    instanceDivisor: 1,
                    layout: []
                }
            };

            completeLayout.call({}, config);

            expect(config.vertexBufferLayout.layout[0].size).toBe(1);
        });

        it('should set default type to FLOAT when not provided', function ()
        {
            var config = {
                vertexBufferLayout: {
                    usage: 'STATIC_DRAW',
                    count: 4,
                    layout: [
                        { name: 'inVertex' }
                    ]
                },
                instanceBufferLayout: {
                    usage: 'DYNAMIC_DRAW',
                    instanceDivisor: 1,
                    layout: []
                }
            };

            completeLayout.call({}, config);

            expect(config.vertexBufferLayout.layout[0].type).toBe('FLOAT');
        });

        it('should preserve explicit type in vertex layout', function ()
        {
            var config = {
                vertexBufferLayout: {
                    usage: 'STATIC_DRAW',
                    count: 4,
                    layout: [
                        { name: 'inVertex', type: 'UNSIGNED_BYTE' }
                    ]
                },
                instanceBufferLayout: {
                    usage: 'DYNAMIC_DRAW',
                    instanceDivisor: 1,
                    layout: []
                }
            };

            completeLayout.call({}, config);

            expect(config.vertexBufferLayout.layout[0].type).toBe('UNSIGNED_BYTE');
        });

        it('should set default normalized to false when not provided', function ()
        {
            var config = {
                vertexBufferLayout: {
                    usage: 'STATIC_DRAW',
                    count: 4,
                    layout: [
                        { name: 'inVertex' }
                    ]
                },
                instanceBufferLayout: {
                    usage: 'DYNAMIC_DRAW',
                    instanceDivisor: 1,
                    layout: []
                }
            };

            completeLayout.call({}, config);

            expect(config.vertexBufferLayout.layout[0].normalized).toBe(false);
        });

        it('should preserve explicit normalized flag in vertex layout', function ()
        {
            var config = {
                vertexBufferLayout: {
                    usage: 'STATIC_DRAW',
                    count: 4,
                    layout: [
                        { name: 'inColor', type: 'UNSIGNED_BYTE', normalized: true }
                    ]
                },
                instanceBufferLayout: {
                    usage: 'DYNAMIC_DRAW',
                    instanceDivisor: 1,
                    layout: []
                }
            };

            completeLayout.call({}, config);

            expect(config.vertexBufferLayout.layout[0].normalized).toBe(true);
        });

        it('should skip vertex layout attributes listed in vertexBufferLayoutRemove', function ()
        {
            var config = {
                vertexBufferLayout: {
                    usage: 'STATIC_DRAW',
                    count: 4,
                    layout: [
                        { name: 'inVertex' },
                        { name: 'inRemoved' }
                    ]
                },
                instanceBufferLayout: {
                    usage: 'DYNAMIC_DRAW',
                    instanceDivisor: 1,
                    layout: []
                },
                vertexBufferLayoutRemove: [ 'inRemoved' ]
            };

            completeLayout.call({}, config);

            var names = config.vertexBufferLayout.layout
                .filter(function (attr) { return attr !== undefined; })
                .map(function (attr) { return attr.name; });

            expect(names.indexOf('inRemoved')).toBe(-1);
            expect(names.indexOf('inVertex')).not.toBe(-1);
        });

        it('should append extra vertex layout attributes from vertexBufferLayoutAdd', function ()
        {
            var config = {
                vertexBufferLayout: {
                    usage: 'STATIC_DRAW',
                    count: 4,
                    layout: [
                        { name: 'inVertex' }
                    ]
                },
                instanceBufferLayout: {
                    usage: 'DYNAMIC_DRAW',
                    instanceDivisor: 1,
                    layout: []
                },
                vertexBufferLayoutAdd: [
                    { name: 'inExtra', size: 2, type: 'FLOAT' }
                ]
            };

            completeLayout.call({}, config);

            var extraAttr = config.vertexBufferLayout.layout.find(function (attr)
            {
                return attr && attr.name === 'inExtra';
            });

            expect(extraAttr).toBeDefined();
            expect(extraAttr.size).toBe(2);
            expect(extraAttr.type).toBe('FLOAT');
        });

        it('should populate instanceBufferLayout from layoutSource', function ()
        {
            var config = {
                vertexBufferLayout: {
                    usage: 'STATIC_DRAW',
                    count: 4,
                    layout: []
                },
                instanceBufferLayout: {
                    usage: 'DYNAMIC_DRAW',
                    instanceDivisor: 1,
                    layout: [
                        { name: 'inPositionX', size: 4 },
                        { name: 'inPositionY', size: 4 }
                    ]
                }
            };

            completeLayout.call({}, config);

            expect(config.instanceBufferLayout.usage).toBe('DYNAMIC_DRAW');
            expect(config.instanceBufferLayout.instanceDivisor).toBe(1);
            expect(Array.isArray(config.instanceBufferLayout.layout)).toBe(true);
            expect(config.instanceBufferLayout.layout.length).toBe(2);
        });

        it('should set defaults for instance layout attributes', function ()
        {
            var config = {
                vertexBufferLayout: {
                    usage: 'STATIC_DRAW',
                    count: 4,
                    layout: []
                },
                instanceBufferLayout: {
                    usage: 'DYNAMIC_DRAW',
                    instanceDivisor: 1,
                    layout: [
                        { name: 'inPositionX' }
                    ]
                }
            };

            completeLayout.call({}, config);

            var attr = config.instanceBufferLayout.layout[0];
            expect(attr.name).toBe('inPositionX');
            expect(attr.size).toBe(1);
            expect(attr.type).toBe('FLOAT');
            expect(attr.normalized).toBe(false);
        });

        it('should preserve explicit size, type, and normalized in instance layout', function ()
        {
            var config = {
                vertexBufferLayout: {
                    usage: 'STATIC_DRAW',
                    count: 4,
                    layout: []
                },
                instanceBufferLayout: {
                    usage: 'DYNAMIC_DRAW',
                    instanceDivisor: 1,
                    layout: [
                        { name: 'inTintBL', size: 4, type: 'UNSIGNED_BYTE', normalized: true }
                    ]
                }
            };

            completeLayout.call({}, config);

            var attr = config.instanceBufferLayout.layout[0];
            expect(attr.size).toBe(4);
            expect(attr.type).toBe('UNSIGNED_BYTE');
            expect(attr.normalized).toBe(true);
        });

        it('should skip instance layout attributes listed in instanceBufferLayoutRemove', function ()
        {
            var config = {
                vertexBufferLayout: {
                    usage: 'STATIC_DRAW',
                    count: 4,
                    layout: []
                },
                instanceBufferLayout: {
                    usage: 'DYNAMIC_DRAW',
                    instanceDivisor: 1,
                    layout: [
                        { name: 'inPositionX', size: 4 },
                        { name: 'inRemovable', size: 4 }
                    ]
                },
                instanceBufferLayoutRemove: [ 'inRemovable' ]
            };

            completeLayout.call({}, config);

            var names = config.instanceBufferLayout.layout
                .filter(function (attr) { return attr !== undefined; })
                .map(function (attr) { return attr.name; });

            expect(names.indexOf('inRemovable')).toBe(-1);
            expect(names.indexOf('inPositionX')).not.toBe(-1);
        });

        it('should append extra instance layout attributes from instanceBufferLayoutAdd', function ()
        {
            var config = {
                vertexBufferLayout: {
                    usage: 'STATIC_DRAW',
                    count: 4,
                    layout: []
                },
                instanceBufferLayout: {
                    usage: 'DYNAMIC_DRAW',
                    instanceDivisor: 1,
                    layout: [
                        { name: 'inPositionX', size: 4 }
                    ]
                },
                instanceBufferLayoutAdd: [
                    { name: 'inCustomData', size: 2, type: 'FLOAT', normalized: false }
                ]
            };

            completeLayout.call({}, config);

            var extraAttr = config.instanceBufferLayout.layout.find(function (attr)
            {
                return attr && attr.name === 'inCustomData';
            });

            expect(extraAttr).toBeDefined();
            expect(extraAttr.size).toBe(2);
            expect(extraAttr.type).toBe('FLOAT');
            expect(extraAttr.normalized).toBe(false);
        });

        it('should handle empty layout arrays without error', function ()
        {
            var config = {
                vertexBufferLayout: {
                    usage: 'STATIC_DRAW',
                    count: 0,
                    layout: []
                },
                instanceBufferLayout: {
                    usage: 'DYNAMIC_DRAW',
                    instanceDivisor: 1,
                    layout: []
                }
            };

            expect(function ()
            {
                completeLayout.call({}, config);
            }).not.toThrow();

            expect(config.vertexBufferLayout.layout.length).toBe(0);
            expect(config.instanceBufferLayout.layout.length).toBe(0);
        });

        it('should handle missing vertexBufferLayoutRemove gracefully', function ()
        {
            var config = {
                vertexBufferLayout: {
                    usage: 'STATIC_DRAW',
                    count: 4,
                    layout: [
                        { name: 'inVertex' }
                    ]
                },
                instanceBufferLayout: {
                    usage: 'DYNAMIC_DRAW',
                    instanceDivisor: 1,
                    layout: []
                }
            };

            expect(function ()
            {
                completeLayout.call({}, config);
            }).not.toThrow();

            expect(config.vertexBufferLayout.layout[0].name).toBe('inVertex');
        });

        it('should use default size of 1 for instanceBufferLayoutAdd entries without size', function ()
        {
            var config = {
                vertexBufferLayout: {
                    usage: 'STATIC_DRAW',
                    count: 4,
                    layout: []
                },
                instanceBufferLayout: {
                    usage: 'DYNAMIC_DRAW',
                    instanceDivisor: 1,
                    layout: []
                },
                instanceBufferLayoutAdd: [
                    { name: 'inExtra' }
                ]
            };

            completeLayout.call({}, config);

            var extraAttr = config.instanceBufferLayout.layout.find(function (attr)
            {
                return attr && attr.name === 'inExtra';
            });

            expect(extraAttr.size).toBe(1);
            expect(extraAttr.type).toBe('FLOAT');
            expect(extraAttr.normalized).toBe(false);
        });
    });

    describe('defaultConfig', function ()
    {
        it('should have a default name', function ()
        {
            expect(SubmitterSpriteGPULayer.prototype.defaultConfig.name).toBe('SubmitterSpriteGPULayer');
        });

        it('should have a default shaderName', function ()
        {
            expect(SubmitterSpriteGPULayer.prototype.defaultConfig.shaderName).toBe('SpriteGPULayer');
        });

        it('should have default shader sources defined', function ()
        {
            expect(SubmitterSpriteGPULayer.prototype.defaultConfig.vertexSource).toBeDefined();
            expect(SubmitterSpriteGPULayer.prototype.defaultConfig.fragmentSource).toBeDefined();
        });

        it('should have shaderAdditions as an array', function ()
        {
            expect(Array.isArray(SubmitterSpriteGPULayer.prototype.defaultConfig.shaderAdditions)).toBe(true);
        });

        it('should have a non-empty shaderAdditions list', function ()
        {
            expect(SubmitterSpriteGPULayer.prototype.defaultConfig.shaderAdditions.length).toBeGreaterThan(0);
        });

        it('should have default count of 0', function ()
        {
            expect(SubmitterSpriteGPULayer.prototype.defaultConfig.count).toBe(0);
        });

        it('should define instanceBufferLayout with instanceDivisor of 1', function ()
        {
            expect(SubmitterSpriteGPULayer.prototype.defaultConfig.instanceBufferLayout.instanceDivisor).toBe(1);
        });

        it('should define vertexBufferLayout with count of 4', function ()
        {
            expect(SubmitterSpriteGPULayer.prototype.defaultConfig.vertexBufferLayout.count).toBe(4);
        });

        it('should include inVertex attribute in vertexBufferLayout', function ()
        {
            var layout = SubmitterSpriteGPULayer.prototype.defaultConfig.vertexBufferLayout.layout;
            var inVertex = layout.find(function (attr) { return attr.name === 'inVertex'; });
            expect(inVertex).toBeDefined();
            expect(inVertex.type).toBe('UNSIGNED_BYTE');
        });

        it('should include expected attributes in instanceBufferLayout', function ()
        {
            var layout = SubmitterSpriteGPULayer.prototype.defaultConfig.instanceBufferLayout.layout;
            var names = layout.map(function (attr) { return attr.name; });

            expect(names).toContain('inPositionX');
            expect(names).toContain('inPositionY');
            expect(names).toContain('inRotation');
            expect(names).toContain('inScaleX');
            expect(names).toContain('inScaleY');
            expect(names).toContain('inAlpha');
            expect(names).toContain('inFrame');
        });

        it('should have tint attributes with UNSIGNED_BYTE type and normalized true', function ()
        {
            var layout = SubmitterSpriteGPULayer.prototype.defaultConfig.instanceBufferLayout.layout;
            var tintBL = layout.find(function (attr) { return attr.name === 'inTintBL'; });
            expect(tintBL).toBeDefined();
            expect(tintBL.type).toBe('UNSIGNED_BYTE');
            expect(tintBL.normalized).toBe(true);
        });
    });
});
