var FilterColorMatrix = require('../../../../../src/renderer/webgl/renderNodes/filters/FilterColorMatrix');

describe('FilterColorMatrix', function ()
{
    it('should be importable', function ()
    {
        expect(FilterColorMatrix).toBeDefined();
    });

    describe('setupUniforms', function ()
    {
        it('should call setUniform with uColorMatrix[0] and the matrix data', function ()
        {
            var calls = [];
            var mockThis = {
                programManager: {
                    setUniform: function (name, value)
                    {
                        calls.push({ name: name, value: value });
                    }
                }
            };

            var matrixData = new Float32Array(20);
            var mockController = {
                colorMatrix: {
                    getData: function () { return matrixData; },
                    alpha: 1
                }
            };

            FilterColorMatrix.prototype.setupUniforms.call(mockThis, mockController, {});

            expect(calls[0].name).toBe('uColorMatrix[0]');
            expect(calls[0].value).toBe(matrixData);
        });

        it('should call setUniform with uAlpha and the colorMatrix alpha value', function ()
        {
            var calls = [];
            var mockThis = {
                programManager: {
                    setUniform: function (name, value)
                    {
                        calls.push({ name: name, value: value });
                    }
                }
            };

            var mockController = {
                colorMatrix: {
                    getData: function () { return new Float32Array(20); },
                    alpha: 0.75
                }
            };

            FilterColorMatrix.prototype.setupUniforms.call(mockThis, mockController, {});

            expect(calls[1].name).toBe('uAlpha');
            expect(calls[1].value).toBe(0.75);
        });

        it('should call setUniform exactly twice', function ()
        {
            var callCount = 0;
            var mockThis = {
                programManager: {
                    setUniform: function ()
                    {
                        callCount++;
                    }
                }
            };

            var mockController = {
                colorMatrix: {
                    getData: function () { return new Float32Array(20); },
                    alpha: 1
                }
            };

            FilterColorMatrix.prototype.setupUniforms.call(mockThis, mockController, {});

            expect(callCount).toBe(2);
        });

        it('should pass alpha value of zero correctly', function ()
        {
            var calls = [];
            var mockThis = {
                programManager: {
                    setUniform: function (name, value)
                    {
                        calls.push({ name: name, value: value });
                    }
                }
            };

            var mockController = {
                colorMatrix: {
                    getData: function () { return new Float32Array(20); },
                    alpha: 0
                }
            };

            FilterColorMatrix.prototype.setupUniforms.call(mockThis, mockController, {});

            expect(calls[1].value).toBe(0);
        });

        it('should pass the exact data returned by getData', function ()
        {
            var calls = [];
            var mockThis = {
                programManager: {
                    setUniform: function (name, value)
                    {
                        calls.push({ name: name, value: value });
                    }
                }
            };

            var specificData = new Float32Array([
                1, 0, 0, 0, 0,
                0, 1, 0, 0, 0,
                0, 0, 1, 0, 0,
                0, 0, 0, 1, 0
            ]);

            var mockController = {
                colorMatrix: {
                    getData: function () { return specificData; },
                    alpha: 1
                }
            };

            FilterColorMatrix.prototype.setupUniforms.call(mockThis, mockController, {});

            expect(calls[0].value).toBe(specificData);
            expect(calls[0].value.length).toBe(20);
        });

        it('should not use the drawingContext argument', function ()
        {
            var callCount = 0;
            var mockThis = {
                programManager: {
                    setUniform: function ()
                    {
                        callCount++;
                    }
                }
            };

            var mockController = {
                colorMatrix: {
                    getData: function () { return new Float32Array(20); },
                    alpha: 1
                }
            };

            FilterColorMatrix.prototype.setupUniforms.call(mockThis, mockController, null);

            expect(callCount).toBe(2);
        });
    });
});
