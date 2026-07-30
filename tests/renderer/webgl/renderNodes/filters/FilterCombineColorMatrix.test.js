/**
 * Tests for FilterCombineColorMatrix render node.
 *
 * The class requires a WebGL context to instantiate, so we test the public
 * methods directly via prototype invocation with mock objects.
 */

var FilterCombineColorMatrix = require('../../../../../src/renderer/webgl/renderNodes/filters/FilterCombineColorMatrix');

describe('FilterCombineColorMatrix', function ()
{
    describe('setupTextures', function ()
    {
        it('should assign the controller glTexture to index 1 of the textures array', function ()
        {
            var mockGLTexture = { id: 'mock-gl-texture' };
            var controller = { glTexture: mockGLTexture };
            var textures = [];
            var drawingContext = {};

            FilterCombineColorMatrix.prototype.setupTextures.call({}, controller, textures, drawingContext);

            expect(textures[1]).toBe(mockGLTexture);
        });

        it('should not modify index 0 of the textures array', function ()
        {
            var existingTexture = { id: 'existing' };
            var controller = { glTexture: { id: 'transfer' } };
            var textures = [ existingTexture ];
            var drawingContext = {};

            FilterCombineColorMatrix.prototype.setupTextures.call({}, controller, textures, drawingContext);

            expect(textures[0]).toBe(existingTexture);
        });

        it('should overwrite index 1 if already set', function ()
        {
            var newTexture = { id: 'new' };
            var controller = { glTexture: newTexture };
            var textures = [ null, { id: 'old' } ];
            var drawingContext = {};

            FilterCombineColorMatrix.prototype.setupTextures.call({}, controller, textures, drawingContext);

            expect(textures[1]).toBe(newTexture);
        });

        it('should assign null if controller glTexture is null', function ()
        {
            var controller = { glTexture: null };
            var textures = [];
            var drawingContext = {};

            FilterCombineColorMatrix.prototype.setupTextures.call({}, controller, textures, drawingContext);

            expect(textures[1]).toBeNull();
        });

        it('should ignore the drawingContext argument', function ()
        {
            var mockGLTexture = { id: 'tex' };
            var controller = { glTexture: mockGLTexture };
            var textures = [];

            FilterCombineColorMatrix.prototype.setupTextures.call({}, controller, textures, undefined);

            expect(textures[1]).toBe(mockGLTexture);
        });
    });

    describe('setupUniforms', function ()
    {
        var mockSelf;
        var mockTransfer;
        var controller;
        var drawingContext;
        var uniforms;

        beforeEach(function ()
        {
            uniforms = {};

            mockSelf = {
                getData: function () { return [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0]; },
                alpha: 0.8
            };

            mockTransfer = {
                getData: function () { return [0.5, 0, 0, 0, 0, 0, 0.5, 0, 0, 0, 0, 0, 0.5, 0, 0, 0, 0, 0, 0.5, 0]; },
                alpha: 0.6
            };

            controller = {
                colorMatrixSelf: mockSelf,
                colorMatrixTransfer: mockTransfer,
                additions: [0.1, 0.2, 0.3, 0.4],
                multiplications: [1.1, 1.2, 1.3, 1.4]
            };

            drawingContext = {};
        });

        it('should set uTransferSampler to 1', function ()
        {
            var mockThis = {
                programManager: {
                    setUniform: function (name, value) { uniforms[name] = value; }
                }
            };

            FilterCombineColorMatrix.prototype.setupUniforms.call(mockThis, controller, drawingContext);

            expect(uniforms['uTransferSampler']).toBe(1);
        });

        it('should set uColorMatrixSelf from colorMatrixSelf.getData()', function ()
        {
            var expectedData = mockSelf.getData();
            var mockThis = {
                programManager: {
                    setUniform: function (name, value) { uniforms[name] = value; }
                }
            };

            FilterCombineColorMatrix.prototype.setupUniforms.call(mockThis, controller, drawingContext);

            expect(uniforms['uColorMatrixSelf[0]']).toStrictEqual(expectedData);
        });

        it('should set uColorMatrixTransfer from colorMatrixTransfer.getData()', function ()
        {
            var expectedData = mockTransfer.getData();
            var mockThis = {
                programManager: {
                    setUniform: function (name, value) { uniforms[name] = value; }
                }
            };

            FilterCombineColorMatrix.prototype.setupUniforms.call(mockThis, controller, drawingContext);

            expect(uniforms['uColorMatrixTransfer[0]']).toStrictEqual(expectedData);
        });

        it('should set uAlphaSelf from colorMatrixSelf.alpha', function ()
        {
            var mockThis = {
                programManager: {
                    setUniform: function (name, value) { uniforms[name] = value; }
                }
            };

            FilterCombineColorMatrix.prototype.setupUniforms.call(mockThis, controller, drawingContext);

            expect(uniforms['uAlphaSelf']).toBe(0.8);
        });

        it('should set uAlphaTransfer from colorMatrixTransfer.alpha', function ()
        {
            var mockThis = {
                programManager: {
                    setUniform: function (name, value) { uniforms[name] = value; }
                }
            };

            FilterCombineColorMatrix.prototype.setupUniforms.call(mockThis, controller, drawingContext);

            expect(uniforms['uAlphaTransfer']).toBe(0.6);
        });

        it('should set uAdditions from controller.additions', function ()
        {
            var mockThis = {
                programManager: {
                    setUniform: function (name, value) { uniforms[name] = value; }
                }
            };

            FilterCombineColorMatrix.prototype.setupUniforms.call(mockThis, controller, drawingContext);

            expect(uniforms['uAdditions']).toBe(controller.additions);
        });

        it('should set uMultiplications from controller.multiplications', function ()
        {
            var mockThis = {
                programManager: {
                    setUniform: function (name, value) { uniforms[name] = value; }
                }
            };

            FilterCombineColorMatrix.prototype.setupUniforms.call(mockThis, controller, drawingContext);

            expect(uniforms['uMultiplications']).toBe(controller.multiplications);
        });

        it('should call setUniform exactly 7 times', function ()
        {
            var callCount = 0;
            var mockThis = {
                programManager: {
                    setUniform: function () { callCount++; }
                }
            };

            FilterCombineColorMatrix.prototype.setupUniforms.call(mockThis, controller, drawingContext);

            expect(callCount).toBe(7);
        });

        it('should reflect alpha values of 0 and 1 correctly', function ()
        {
            controller.colorMatrixSelf.alpha = 0;
            controller.colorMatrixTransfer.alpha = 1;

            var mockThis = {
                programManager: {
                    setUniform: function (name, value) { uniforms[name] = value; }
                }
            };

            FilterCombineColorMatrix.prototype.setupUniforms.call(mockThis, controller, drawingContext);

            expect(uniforms['uAlphaSelf']).toBe(0);
            expect(uniforms['uAlphaTransfer']).toBe(1);
        });

        it('should pass floating point alpha values accurately', function ()
        {
            controller.colorMatrixSelf.alpha = 0.123456789;
            controller.colorMatrixTransfer.alpha = 0.987654321;

            var mockThis = {
                programManager: {
                    setUniform: function (name, value) { uniforms[name] = value; }
                }
            };

            FilterCombineColorMatrix.prototype.setupUniforms.call(mockThis, controller, drawingContext);

            expect(uniforms['uAlphaSelf']).toBeCloseTo(0.123456789, 9);
            expect(uniforms['uAlphaTransfer']).toBeCloseTo(0.987654321, 9);
        });
    });
});
