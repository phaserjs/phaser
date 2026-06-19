var Utils = require('../../../src/renderer/webgl/Utils');

describe('Phaser.Renderer.WebGL.Utils.getTintFromFloats', function ()
{
    describe('getTintFromFloats', function ()
    {
        it('should return 0 for all zero components', function ()
        {
            expect(Utils.getTintFromFloats(0, 0, 0, 0)).toBe(0);
        });

        it('should return correct packed value for white fully opaque', function ()
        {
            // r=1, g=1, b=1, a=1 => 0xFFFFFFFF
            expect(Utils.getTintFromFloats(1, 1, 1, 1)).toBe(0xFFFFFFFF >>> 0);
        });

        it('should pack red component correctly', function ()
        {
            // r=1, g=0, b=0, a=1 => ua=0xFF, ur=0xFF, ug=0, ub=0 => 0xFFFF0000
            expect(Utils.getTintFromFloats(1, 0, 0, 1)).toBe(0xFFFF0000 >>> 0);
        });

        it('should pack green component correctly', function ()
        {
            // r=0, g=1, b=0, a=1 => 0xFF00FF00
            expect(Utils.getTintFromFloats(0, 1, 0, 1)).toBe(0xFF00FF00 >>> 0);
        });

        it('should pack blue component correctly', function ()
        {
            // r=0, g=0, b=1, a=1 => 0xFF0000FF
            expect(Utils.getTintFromFloats(0, 0, 1, 1)).toBe(0xFF0000FF >>> 0);
        });

        it('should pack alpha component into the high byte', function ()
        {
            // r=0, g=0, b=0, a=1 => 0xFF000000
            expect(Utils.getTintFromFloats(0, 0, 0, 1)).toBe(0xFF000000 >>> 0);
        });

        it('should return an unsigned 32-bit integer', function ()
        {
            var result = Utils.getTintFromFloats(1, 1, 1, 1);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThanOrEqual(0xFFFFFFFF);
        });

        it('should handle mid-range values', function ()
        {
            var r = 0.5, g = 0.25, b = 0.75, a = 0.5;
            var ur = ((r * 255) | 0) & 0xff;
            var ug = ((g * 255) | 0) & 0xff;
            var ub = ((b * 255) | 0) & 0xff;
            var ua = ((a * 255) | 0) & 0xff;
            var expected = ((ua << 24) | (ur << 16) | (ug << 8) | ub) >>> 0;
            expect(Utils.getTintFromFloats(r, g, b, a)).toBe(expected);
        });

        it('should truncate float components via bitwise OR', function ()
        {
            // 0.999 * 255 = 254.745 => 254 => 0xFE
            var result = Utils.getTintFromFloats(0.999, 0, 0, 0);
            var ur = ((0.999 * 255) | 0) & 0xff;
            var expected = ((0 << 24) | (ur << 16) | (0 << 8) | 0) >>> 0;
            expect(result).toBe(expected);
        });
    });

    describe('getTintAppendFloatAlpha', function ()
    {
        it('should return the rgb value when alpha is 0', function ()
        {
            expect(Utils.getTintAppendFloatAlpha(0x00FF0000, 0)).toBe(0x00FF0000 >>> 0);
        });

        it('should pack full alpha into high byte', function ()
        {
            // rgb=0x112233, a=1 => 0xFF112233
            expect(Utils.getTintAppendFloatAlpha(0x112233, 1)).toBe(0xFF112233 >>> 0);
        });

        it('should pack zero alpha into high byte', function ()
        {
            // rgb=0xFF0000, a=0 => 0x00FF0000
            expect(Utils.getTintAppendFloatAlpha(0xFF0000, 0)).toBe(0x00FF0000 >>> 0);
        });

        it('should pack mid-range alpha correctly', function ()
        {
            var rgb = 0xABCDEF;
            var a = 0.5;
            var ua = ((a * 255) | 0) & 0xff;
            var expected = ((ua << 24) | rgb) >>> 0;
            expect(Utils.getTintAppendFloatAlpha(rgb, a)).toBe(expected);
        });

        it('should return an unsigned 32-bit integer', function ()
        {
            var result = Utils.getTintAppendFloatAlpha(0xFFFFFF, 1);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThanOrEqual(0xFFFFFFFF);
        });

        it('should handle zero rgb with full alpha', function ()
        {
            expect(Utils.getTintAppendFloatAlpha(0, 1)).toBe(0xFF000000 >>> 0);
        });
    });

    describe('getTintAppendFloatAlphaAndSwap', function ()
    {
        it('should swap red and blue channels', function ()
        {
            // rgb = 0xFF0000 (red), a=1 => after swap: ub=0xFF at bits 16, ur=0 at bits 0
            // result = (0xFF << 24) | (0xFF << 16) | (0 << 8) | 0 => 0xFFFF0000
            // Wait: ur = (0xFF0000 >> 16) = 0xFF, ug = 0, ub = 0
            // swapped: (ua<<24)|(ub<<16)|(ug<<8)|ur = (0xFF<<24)|(0<<16)|(0<<8)|0xFF = 0xFF0000FF
            expect(Utils.getTintAppendFloatAlphaAndSwap(0xFF0000, 1)).toBe(0xFF0000FF >>> 0);
        });

        it('should leave green channel unchanged', function ()
        {
            // rgb = 0x00FF00 (green), a=1
            // ur=0, ug=0xFF, ub=0
            // swapped: (0xFF<<24)|(0<<16)|(0xFF<<8)|0 => 0xFF00FF00
            expect(Utils.getTintAppendFloatAlphaAndSwap(0x00FF00, 1)).toBe(0xFF00FF00 >>> 0);
        });

        it('should swap blue to red position', function ()
        {
            // rgb = 0x0000FF (blue), a=1
            // ur=0, ug=0, ub=0xFF
            // swapped: (0xFF<<24)|(0xFF<<16)|(0<<8)|0 => 0xFFFF0000
            expect(Utils.getTintAppendFloatAlphaAndSwap(0x0000FF, 1)).toBe(0xFFFF0000 >>> 0);
        });

        it('should return zero for all zero inputs', function ()
        {
            expect(Utils.getTintAppendFloatAlphaAndSwap(0, 0)).toBe(0);
        });

        it('should return an unsigned 32-bit integer', function ()
        {
            var result = Utils.getTintAppendFloatAlphaAndSwap(0xFFFFFF, 1);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThanOrEqual(0xFFFFFFFF);
        });

        it('should produce same result as non-swap when r equals b', function ()
        {
            // If r == b, swap doesn't change the rgb value
            var rgb = 0x884488; // r=0x88, g=0x44, b=0x88
            var a = 0.8;
            var ua = ((a * 255) | 0) & 0xff;
            var ur = (rgb >> 16) & 0xff; // 0x88
            var ug = (rgb >> 8) & 0xff;  // 0x44
            var ub = rgb & 0xff;         // 0x88
            var expected = ((ua << 24) | (ub << 16) | (ug << 8) | ur) >>> 0;
            expect(Utils.getTintAppendFloatAlphaAndSwap(rgb, a)).toBe(expected);
        });
    });

    describe('getFloatsFromUintRGB', function ()
    {
        it('should return [0, 0, 0] for zero input', function ()
        {
            var result = Utils.getFloatsFromUintRGB(0);
            expect(result[0]).toBe(0);
            expect(result[1]).toBe(0);
            expect(result[2]).toBe(0);
        });

        it('should return [1, 1, 1] for 0xFFFFFF', function ()
        {
            var result = Utils.getFloatsFromUintRGB(0xFFFFFF);
            expect(result[0]).toBeCloseTo(1, 5);
            expect(result[1]).toBeCloseTo(1, 5);
            expect(result[2]).toBeCloseTo(1, 5);
        });

        it('should return array of length 3', function ()
        {
            var result = Utils.getFloatsFromUintRGB(0x804020);
            expect(result.length).toBe(3);
        });

        it('should extract red channel correctly', function ()
        {
            // 0xFF0000 => r=255, g=0, b=0
            var result = Utils.getFloatsFromUintRGB(0xFF0000);
            expect(result[0]).toBeCloseTo(1, 5);
            expect(result[1]).toBe(0);
            expect(result[2]).toBe(0);
        });

        it('should extract green channel correctly', function ()
        {
            // 0x00FF00 => r=0, g=255, b=0
            var result = Utils.getFloatsFromUintRGB(0x00FF00);
            expect(result[0]).toBe(0);
            expect(result[1]).toBeCloseTo(1, 5);
            expect(result[2]).toBe(0);
        });

        it('should extract blue channel correctly', function ()
        {
            // 0x0000FF => r=0, g=0, b=255
            var result = Utils.getFloatsFromUintRGB(0x0000FF);
            expect(result[0]).toBe(0);
            expect(result[1]).toBe(0);
            expect(result[2]).toBeCloseTo(1, 5);
        });

        it('should return values in the range 0 to 1', function ()
        {
            var result = Utils.getFloatsFromUintRGB(0x7F3FA0);
            expect(result[0]).toBeGreaterThanOrEqual(0);
            expect(result[0]).toBeLessThanOrEqual(1);
            expect(result[1]).toBeGreaterThanOrEqual(0);
            expect(result[1]).toBeLessThanOrEqual(1);
            expect(result[2]).toBeGreaterThanOrEqual(0);
            expect(result[2]).toBeLessThanOrEqual(1);
        });

        it('should correctly convert mid-range values', function ()
        {
            // 0x804020 => r=128, g=64, b=32
            var result = Utils.getFloatsFromUintRGB(0x804020);
            expect(result[0]).toBeCloseTo(128 / 255, 5);
            expect(result[1]).toBeCloseTo(64 / 255, 5);
            expect(result[2]).toBeCloseTo(32 / 255, 5);
        });

        it('should round-trip via getTintFromFloats approximately', function ()
        {
            var r = 0.5, g = 0.25, b = 0.75;
            var packed = Utils.getTintFromFloats(r, g, b, 0);
            // packed has alpha in high byte, rgb in lower 24 bits
            var rgb = packed & 0xFFFFFF;
            var result = Utils.getFloatsFromUintRGB(rgb);
            expect(result[0]).toBeCloseTo(r, 1);
            expect(result[1]).toBeCloseTo(g, 1);
            expect(result[2]).toBeCloseTo(b, 1);
        });
    });

    describe('checkShaderMax', function ()
    {
        it('should return gpuMax when maxTextures is 0', function ()
        {
            var gl = {
                MAX_TEXTURE_IMAGE_UNITS: 0x8872,
                getParameter: function (param)
                {
                    return 32;
                }
            };
            expect(Utils.checkShaderMax(gl, 0)).toBe(16);
        });

        it('should return gpuMax when maxTextures is -1', function ()
        {
            var gl = {
                MAX_TEXTURE_IMAGE_UNITS: 0x8872,
                getParameter: function (param)
                {
                    return 32;
                }
            };
            expect(Utils.checkShaderMax(gl, -1)).toBe(16);
        });

        it('should clamp gpuMax to 16 even if GPU supports more', function ()
        {
            var gl = {
                MAX_TEXTURE_IMAGE_UNITS: 0x8872,
                getParameter: function (param)
                {
                    return 64;
                }
            };
            expect(Utils.checkShaderMax(gl, -1)).toBe(16);
        });

        it('should return the smaller of gpuMax and maxTextures', function ()
        {
            var gl = {
                MAX_TEXTURE_IMAGE_UNITS: 0x8872,
                getParameter: function (param)
                {
                    return 8;
                }
            };
            expect(Utils.checkShaderMax(gl, 4)).toBe(4);
        });

        it('should return gpuMax when maxTextures exceeds gpuMax', function ()
        {
            var gl = {
                MAX_TEXTURE_IMAGE_UNITS: 0x8872,
                getParameter: function (param)
                {
                    return 8;
                }
            };
            expect(Utils.checkShaderMax(gl, 16)).toBe(8);
        });

        it('should cap at 16 even when gpu reports 32 and maxTextures is 20', function ()
        {
            var gl = {
                MAX_TEXTURE_IMAGE_UNITS: 0x8872,
                getParameter: function (param)
                {
                    return 32;
                }
            };
            expect(Utils.checkShaderMax(gl, 20)).toBe(16);
        });

        it('should return 1 when both gpuMax and maxTextures are 1', function ()
        {
            var gl = {
                MAX_TEXTURE_IMAGE_UNITS: 0x8872,
                getParameter: function (param)
                {
                    return 1;
                }
            };
            expect(Utils.checkShaderMax(gl, 1)).toBe(1);
        });
    });

    describe('updateLightingUniforms', function ()
    {
        it('should return early when lightManager does not exist', function ()
        {
            var programManager = {
                setUniform: vi.fn(),
                removeUniform: vi.fn()
            };

            var drawingContext = {
                camera: {
                    scene: {
                        sys: {
                            lights: null
                        }
                    }
                },
                height: 600
            };

            Utils.updateLightingUniforms(true, drawingContext, programManager, 1, {}, false, 0, 0);

            expect(programManager.setUniform).not.toHaveBeenCalled();
            expect(programManager.removeUniform).not.toHaveBeenCalled();
        });

        it('should return early when lightManager.active is false', function ()
        {
            var programManager = {
                setUniform: vi.fn(),
                removeUniform: vi.fn()
            };

            var drawingContext = {
                camera: {
                    scene: {
                        sys: {
                            lights: {
                                active: false
                            }
                        }
                    }
                },
                height: 600
            };

            Utils.updateLightingUniforms(true, drawingContext, programManager, 1, {}, false, 0, 0);

            expect(programManager.setUniform).not.toHaveBeenCalled();
            expect(programManager.removeUniform).not.toHaveBeenCalled();
        });

        it('should call removeUniform for lighting keys when enable is false', function ()
        {
            var programManager = {
                setUniform: vi.fn(),
                removeUniform: vi.fn()
            };

            var drawingContext = {
                camera: {
                    scene: {
                        sys: {
                            lights: {
                                active: true,
                                getLights: function () { return []; },
                                ambientColor: { r: 1, g: 1, b: 1 }
                            }
                        }
                    },
                    x: 0,
                    y: 0,
                    rotation: 0,
                    zoom: 1
                },
                height: 600
            };

            Utils.updateLightingUniforms(false, drawingContext, programManager, 1, {}, false, 0, 0);

            expect(programManager.removeUniform).toHaveBeenCalledWith('uNormSampler');
            expect(programManager.removeUniform).toHaveBeenCalledWith('uCamera');
            expect(programManager.removeUniform).toHaveBeenCalledWith('uAmbientLightColor');
            expect(programManager.removeUniform).toHaveBeenCalledWith('uLightCount');
            expect(programManager.removeUniform).toHaveBeenCalledWith('uPenumbra');
            expect(programManager.removeUniform).toHaveBeenCalledWith('uDiffuseFlatThreshold');
        });

        it('should call setUniform for base lighting keys when enable is true with no lights', function ()
        {
            var programManager = {
                setUniform: vi.fn(),
                removeUniform: vi.fn()
            };

            var drawingContext = {
                camera: {
                    scene: {
                        sys: {
                            lights: {
                                active: true,
                                getLights: function () { return []; },
                                ambientColor: { r: 0.2, g: 0.2, b: 0.2 }
                            }
                        }
                    },
                    x: 10,
                    y: 20,
                    rotation: 0,
                    zoom: 1
                },
                height: 600
            };

            var vec = { x: 0, y: 0 };

            Utils.updateLightingUniforms(true, drawingContext, programManager, 2, vec, false, 0, 0);

            expect(programManager.setUniform).toHaveBeenCalledWith('uNormSampler', 2);
            expect(programManager.setUniform).toHaveBeenCalledWith('uCamera', [10, 20, 0, 1]);
            expect(programManager.setUniform).toHaveBeenCalledWith('uAmbientLightColor', [0.2, 0.2, 0.2]);
            expect(programManager.setUniform).toHaveBeenCalledWith('uLightCount', 0);
        });

        it('should set self-shadow uniforms when selfShadow is true', function ()
        {
            var programManager = {
                setUniform: vi.fn(),
                removeUniform: vi.fn()
            };

            var drawingContext = {
                camera: {
                    scene: {
                        sys: {
                            lights: {
                                active: true,
                                getLights: function () { return []; },
                                ambientColor: { r: 1, g: 1, b: 1 }
                            }
                        }
                    },
                    x: 0,
                    y: 0,
                    rotation: 0,
                    zoom: 1
                },
                height: 600
            };

            var vec = { x: 0, y: 0 };

            Utils.updateLightingUniforms(true, drawingContext, programManager, 1, vec, true, 0.3, 0.5);

            expect(programManager.setUniform).toHaveBeenCalledWith('uDiffuseFlatThreshold', 0.5 * 3);
            expect(programManager.setUniform).toHaveBeenCalledWith('uPenumbra', 0.3);
        });

        it('should not set self-shadow uniforms when selfShadow is false', function ()
        {
            var programManager = {
                setUniform: vi.fn(),
                removeUniform: vi.fn()
            };

            var drawingContext = {
                camera: {
                    scene: {
                        sys: {
                            lights: {
                                active: true,
                                getLights: function () { return []; },
                                ambientColor: { r: 1, g: 1, b: 1 }
                            }
                        }
                    },
                    x: 0,
                    y: 0,
                    rotation: 0,
                    zoom: 1
                },
                height: 600
            };

            var vec = { x: 0, y: 0 };
            var setUniformCalls = [];

            programManager.setUniform = function (name, val)
            {
                setUniformCalls.push(name);
            };

            Utils.updateLightingUniforms(true, drawingContext, programManager, 1, vec, false, 0, 0);

            expect(setUniformCalls.indexOf('uDiffuseFlatThreshold')).toBe(-1);
            expect(setUniformCalls.indexOf('uPenumbra')).toBe(-1);
        });

        it('should upload disabled cone uniforms for normal radius lights', function ()
        {
            var programManager = {
                setUniform: vi.fn(),
                removeUniform: vi.fn()
            };

            var light = {
                x: 100,
                y: 150,
                z: 10,
                scrollFactorX: 1,
                scrollFactorY: 1,
                color: { r: 1, g: 0.5, b: 0.25 },
                intensity: 2,
                radius: 256,
                coneEnabled: false
            };

            var drawingContext = {
                camera: {
                    scene: {
                        sys: {
                            lights: {
                                active: true,
                                getLights: function () { return [ { light: light } ]; },
                                ambientColor: { r: 0, g: 0, b: 0 }
                            }
                        }
                    },
                    x: 0,
                    y: 0,
                    rotation: 0,
                    zoom: 1,
                    scrollX: 0,
                    scrollY: 0,
                    matrixCombined: { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }
                },
                height: 600
            };

            var vec = { x: 0, y: 0 };

            Utils.updateLightingUniforms(true, drawingContext, programManager, 1, vec, false, 0, 0);

            expect(programManager.setUniform).toHaveBeenCalledWith('uLights[0].position', [100, 450, 10]);
            expect(programManager.setUniform).toHaveBeenCalledWith('uLights[0].direction', [1, 0]);
            expect(programManager.setUniform).toHaveBeenCalledWith('uLights[0].cone', [-1, 1, 0]);
        });

        it('should upload cone direction and cutoffs for cone lights', function ()
        {
            var programManager = {
                setUniform: vi.fn(),
                removeUniform: vi.fn()
            };

            var light = {
                x: 100,
                y: 150,
                z: 10,
                scrollFactorX: 1,
                scrollFactorY: 1,
                color: { r: 1, g: 1, b: 1 },
                intensity: 1,
                radius: 128,
                coneEnabled: true,
                coneRotation: Math.PI / 2,
                coneInnerAngle: Math.PI / 4,
                coneOuterAngle: Math.PI / 2
            };

            var drawingContext = {
                camera: {
                    scene: {
                        sys: {
                            lights: {
                                active: true,
                                getLights: function () { return [ { light: light } ]; },
                                ambientColor: { r: 0, g: 0, b: 0 }
                            }
                        }
                    },
                    x: 0,
                    y: 0,
                    rotation: 0,
                    zoom: 2,
                    scrollX: 0,
                    scrollY: 0,
                    matrixCombined: { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }
                },
                height: 600
            };

            var vec = { x: 0, y: 0 };

            Utils.updateLightingUniforms(true, drawingContext, programManager, 1, vec, false, 0, 0);

            var directionCall = programManager.setUniform.mock.calls.find(function (call)
            {
                return call[0] === 'uLights[0].direction';
            });

            expect(programManager.setUniform).toHaveBeenCalledWith('uLights[0].position', [100, 450, 20]);
            expect(directionCall[1][0]).toBeCloseTo(0);
            expect(directionCall[1][1]).toBeCloseTo(-1);
            expect(programManager.setUniform).toHaveBeenCalledWith(
                'uLights[0].cone',
                [
                    Math.cos(Math.PI / 4),
                    Math.cos(Math.PI / 8),
                    1
                ]
            );
        });
    });
});
