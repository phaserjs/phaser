var WebGLShaderSetterWrapper = require('../../../../src/renderer/webgl/wrappers/WebGLShaderSetterWrapper');

function createMockRenderer ()
{
    var gl = {
        INT: 0x1404,
        INT_VEC2: 0x8B53,
        INT_VEC3: 0x8B54,
        INT_VEC4: 0x8B55,
        FLOAT: 0x1406,
        FLOAT_VEC2: 0x8B50,
        FLOAT_VEC3: 0x8B51,
        FLOAT_VEC4: 0x8B52,
        UNSIGNED_INT: 0x1405,
        BYTE: 0x1400,
        UNSIGNED_BYTE: 0x1401,
        SHORT: 0x1402,
        UNSIGNED_SHORT: 0x1403,
        BOOL: 0x8B56,
        BOOL_VEC2: 0x8B57,
        BOOL_VEC3: 0x8B58,
        BOOL_VEC4: 0x8B59,
        FLOAT_MAT2: 0x8B5A,
        FLOAT_MAT3: 0x8B5B,
        FLOAT_MAT4: 0x8B5C,
        SAMPLER_2D: 0x8B5E,
        SAMPLER_CUBE: 0x8B60,
        uniform1i: function () {},
        uniform1iv: function () {},
        uniform2i: function () {},
        uniform2iv: function () {},
        uniform3i: function () {},
        uniform3iv: function () {},
        uniform4i: function () {},
        uniform4iv: function () {},
        uniform1f: function () {},
        uniform1fv: function () {},
        uniform2f: function () {},
        uniform2fv: function () {},
        uniform3f: function () {},
        uniform3fv: function () {},
        uniform4f: function () {},
        uniform4fv: function () {},
        uniformMatrix2fv: function () {},
        uniformMatrix3fv: function () {},
        uniformMatrix4fv: function () {}
    };

    return { gl: gl };
}

describe('WebGLShaderSetterWrapper', function ()
{
    var renderer;
    var wrapper;

    beforeEach(function ()
    {
        renderer = createMockRenderer();
        wrapper = new WebGLShaderSetterWrapper(renderer);
    });

    describe('constructor', function ()
    {
        it('should create an instance', function ()
        {
            expect(wrapper).toBeDefined();
        });

        it('should have a constants property', function ()
        {
            expect(wrapper.constants).toBeDefined();
            expect(typeof wrapper.constants).toBe('object');
        });

        it('should contain all expected type keys', function ()
        {
            var gl = renderer.gl;
            expect(wrapper.constants[gl.INT]).toBeDefined();
            expect(wrapper.constants[gl.INT_VEC2]).toBeDefined();
            expect(wrapper.constants[gl.INT_VEC3]).toBeDefined();
            expect(wrapper.constants[gl.INT_VEC4]).toBeDefined();
            expect(wrapper.constants[gl.FLOAT]).toBeDefined();
            expect(wrapper.constants[gl.FLOAT_VEC2]).toBeDefined();
            expect(wrapper.constants[gl.FLOAT_VEC3]).toBeDefined();
            expect(wrapper.constants[gl.FLOAT_VEC4]).toBeDefined();
            expect(wrapper.constants[gl.UNSIGNED_INT]).toBeDefined();
            expect(wrapper.constants[gl.BYTE]).toBeDefined();
            expect(wrapper.constants[gl.UNSIGNED_BYTE]).toBeDefined();
            expect(wrapper.constants[gl.SHORT]).toBeDefined();
            expect(wrapper.constants[gl.UNSIGNED_SHORT]).toBeDefined();
            expect(wrapper.constants[gl.BOOL]).toBeDefined();
            expect(wrapper.constants[gl.BOOL_VEC2]).toBeDefined();
            expect(wrapper.constants[gl.BOOL_VEC3]).toBeDefined();
            expect(wrapper.constants[gl.BOOL_VEC4]).toBeDefined();
            expect(wrapper.constants[gl.FLOAT_MAT2]).toBeDefined();
            expect(wrapper.constants[gl.FLOAT_MAT3]).toBeDefined();
            expect(wrapper.constants[gl.FLOAT_MAT4]).toBeDefined();
            expect(wrapper.constants[gl.SAMPLER_2D]).toBeDefined();
            expect(wrapper.constants[gl.SAMPLER_CUBE]).toBeDefined();
        });
    });

    describe('constants - INT (0x1404)', function ()
    {
        it('should have correct constant value', function ()
        {
            var entry = wrapper.constants[0x1404];
            expect(entry.constant).toBe(renderer.gl.INT);
        });

        it('should have correct baseType', function ()
        {
            var entry = wrapper.constants[0x1404];
            expect(entry.baseType).toBe(renderer.gl.INT);
        });

        it('should have size of 1', function ()
        {
            expect(wrapper.constants[0x1404].size).toBe(1);
        });

        it('should have bytes of 4', function ()
        {
            expect(wrapper.constants[0x1404].bytes).toBe(4);
        });

        it('should have set as uniform1i', function ()
        {
            expect(wrapper.constants[0x1404].set).toBe(renderer.gl.uniform1i);
        });

        it('should have setV as uniform1iv', function ()
        {
            expect(wrapper.constants[0x1404].setV).toBe(renderer.gl.uniform1iv);
        });

        it('should not be a matrix', function ()
        {
            expect(wrapper.constants[0x1404].isMatrix).toBe(false);
        });
    });

    describe('constants - INT_VEC2 (0x8B53)', function ()
    {
        it('should have size of 2', function ()
        {
            expect(wrapper.constants[0x8B53].size).toBe(2);
        });

        it('should have set as uniform2i', function ()
        {
            expect(wrapper.constants[0x8B53].set).toBe(renderer.gl.uniform2i);
        });

        it('should have setV as uniform2iv', function ()
        {
            expect(wrapper.constants[0x8B53].setV).toBe(renderer.gl.uniform2iv);
        });

        it('should have baseType INT', function ()
        {
            expect(wrapper.constants[0x8B53].baseType).toBe(renderer.gl.INT);
        });

        it('should not be a matrix', function ()
        {
            expect(wrapper.constants[0x8B53].isMatrix).toBe(false);
        });
    });

    describe('constants - INT_VEC3 (0x8B54)', function ()
    {
        it('should have size of 3', function ()
        {
            expect(wrapper.constants[0x8B54].size).toBe(3);
        });

        it('should have set as uniform3i', function ()
        {
            expect(wrapper.constants[0x8B54].set).toBe(renderer.gl.uniform3i);
        });

        it('should have setV as uniform3iv', function ()
        {
            expect(wrapper.constants[0x8B54].setV).toBe(renderer.gl.uniform3iv);
        });
    });

    describe('constants - INT_VEC4 (0x8B55)', function ()
    {
        it('should have size of 4', function ()
        {
            expect(wrapper.constants[0x8B55].size).toBe(4);
        });

        it('should have set as uniform4i', function ()
        {
            expect(wrapper.constants[0x8B55].set).toBe(renderer.gl.uniform4i);
        });

        it('should have setV as uniform4iv', function ()
        {
            expect(wrapper.constants[0x8B55].setV).toBe(renderer.gl.uniform4iv);
        });
    });

    describe('constants - FLOAT (0x1406)', function ()
    {
        it('should have correct constant value', function ()
        {
            expect(wrapper.constants[0x1406].constant).toBe(renderer.gl.FLOAT);
        });

        it('should have baseType FLOAT', function ()
        {
            expect(wrapper.constants[0x1406].baseType).toBe(renderer.gl.FLOAT);
        });

        it('should have size of 1', function ()
        {
            expect(wrapper.constants[0x1406].size).toBe(1);
        });

        it('should have bytes of 4', function ()
        {
            expect(wrapper.constants[0x1406].bytes).toBe(4);
        });

        it('should have set as uniform1f', function ()
        {
            expect(wrapper.constants[0x1406].set).toBe(renderer.gl.uniform1f);
        });

        it('should have setV as uniform1fv', function ()
        {
            expect(wrapper.constants[0x1406].setV).toBe(renderer.gl.uniform1fv);
        });

        it('should not be a matrix', function ()
        {
            expect(wrapper.constants[0x1406].isMatrix).toBe(false);
        });
    });

    describe('constants - FLOAT_VEC2 (0x8B50)', function ()
    {
        it('should have size of 2', function ()
        {
            expect(wrapper.constants[0x8B50].size).toBe(2);
        });

        it('should have set as uniform2f', function ()
        {
            expect(wrapper.constants[0x8B50].set).toBe(renderer.gl.uniform2f);
        });

        it('should have setV as uniform2fv', function ()
        {
            expect(wrapper.constants[0x8B50].setV).toBe(renderer.gl.uniform2fv);
        });
    });

    describe('constants - FLOAT_VEC3 (0x8B51)', function ()
    {
        it('should have size of 3', function ()
        {
            expect(wrapper.constants[0x8B51].size).toBe(3);
        });

        it('should have set as uniform3f', function ()
        {
            expect(wrapper.constants[0x8B51].set).toBe(renderer.gl.uniform3f);
        });

        it('should have setV as uniform3fv', function ()
        {
            expect(wrapper.constants[0x8B51].setV).toBe(renderer.gl.uniform3fv);
        });
    });

    describe('constants - FLOAT_VEC4 (0x8B52)', function ()
    {
        it('should have size of 4', function ()
        {
            expect(wrapper.constants[0x8B52].size).toBe(4);
        });

        it('should have set as uniform4f', function ()
        {
            expect(wrapper.constants[0x8B52].set).toBe(renderer.gl.uniform4f);
        });

        it('should have setV as uniform4fv', function ()
        {
            expect(wrapper.constants[0x8B52].setV).toBe(renderer.gl.uniform4fv);
        });
    });

    describe('constants - UNSIGNED_INT (0x1405)', function ()
    {
        it('should have size of 1', function ()
        {
            expect(wrapper.constants[0x1405].size).toBe(1);
        });

        it('should have bytes of 4', function ()
        {
            expect(wrapper.constants[0x1405].bytes).toBe(4);
        });

        it('should have set as uniform1i', function ()
        {
            expect(wrapper.constants[0x1405].set).toBe(renderer.gl.uniform1i);
        });

        it('should not be a matrix', function ()
        {
            expect(wrapper.constants[0x1405].isMatrix).toBe(false);
        });
    });

    describe('constants - BYTE (0x1400)', function ()
    {
        it('should have size of 1', function ()
        {
            expect(wrapper.constants[0x1400].size).toBe(1);
        });

        it('should have bytes of 1', function ()
        {
            expect(wrapper.constants[0x1400].bytes).toBe(1);
        });

        it('should have set as uniform1i', function ()
        {
            expect(wrapper.constants[0x1400].set).toBe(renderer.gl.uniform1i);
        });
    });

    describe('constants - UNSIGNED_BYTE (0x1401)', function ()
    {
        it('should have size of 1', function ()
        {
            expect(wrapper.constants[0x1401].size).toBe(1);
        });

        it('should have bytes of 1', function ()
        {
            expect(wrapper.constants[0x1401].bytes).toBe(1);
        });
    });

    describe('constants - SHORT (0x1402)', function ()
    {
        it('should have size of 1', function ()
        {
            expect(wrapper.constants[0x1402].size).toBe(1);
        });

        it('should have bytes of 2', function ()
        {
            expect(wrapper.constants[0x1402].bytes).toBe(2);
        });
    });

    describe('constants - UNSIGNED_SHORT (0x1403)', function ()
    {
        it('should have size of 1', function ()
        {
            expect(wrapper.constants[0x1403].size).toBe(1);
        });

        it('should have bytes of 2', function ()
        {
            expect(wrapper.constants[0x1403].bytes).toBe(2);
        });
    });

    describe('constants - BOOL (0x8B56)', function ()
    {
        it('should have size of 1', function ()
        {
            expect(wrapper.constants[0x8B56].size).toBe(1);
        });

        it('should have bytes of 4', function ()
        {
            expect(wrapper.constants[0x8B56].bytes).toBe(4);
        });

        it('should have baseType BOOL', function ()
        {
            expect(wrapper.constants[0x8B56].baseType).toBe(renderer.gl.BOOL);
        });

        it('should have set as uniform1i', function ()
        {
            expect(wrapper.constants[0x8B56].set).toBe(renderer.gl.uniform1i);
        });

        it('should not be a matrix', function ()
        {
            expect(wrapper.constants[0x8B56].isMatrix).toBe(false);
        });
    });

    describe('constants - BOOL_VEC2 (0x8B57)', function ()
    {
        it('should have size of 2', function ()
        {
            expect(wrapper.constants[0x8B57].size).toBe(2);
        });

        it('should have set as uniform2i', function ()
        {
            expect(wrapper.constants[0x8B57].set).toBe(renderer.gl.uniform2i);
        });
    });

    describe('constants - BOOL_VEC3 (0x8B58)', function ()
    {
        it('should have size of 3', function ()
        {
            expect(wrapper.constants[0x8B58].size).toBe(3);
        });

        it('should have set as uniform3i', function ()
        {
            expect(wrapper.constants[0x8B58].set).toBe(renderer.gl.uniform3i);
        });
    });

    describe('constants - BOOL_VEC4 (0x8B59)', function ()
    {
        it('should have size of 4', function ()
        {
            expect(wrapper.constants[0x8B59].size).toBe(4);
        });

        it('should have set as uniform4i', function ()
        {
            expect(wrapper.constants[0x8B59].set).toBe(renderer.gl.uniform4i);
        });
    });

    describe('constants - FLOAT_MAT2 (0x8B5A)', function ()
    {
        it('should have size of 4', function ()
        {
            expect(wrapper.constants[0x8B5A].size).toBe(4);
        });

        it('should have bytes of 4', function ()
        {
            expect(wrapper.constants[0x8B5A].bytes).toBe(4);
        });

        it('should have baseType FLOAT', function ()
        {
            expect(wrapper.constants[0x8B5A].baseType).toBe(renderer.gl.FLOAT);
        });

        it('should have set as uniformMatrix2fv', function ()
        {
            expect(wrapper.constants[0x8B5A].set).toBe(renderer.gl.uniformMatrix2fv);
        });

        it('should have setV as uniformMatrix2fv', function ()
        {
            expect(wrapper.constants[0x8B5A].setV).toBe(renderer.gl.uniformMatrix2fv);
        });

        it('should be a matrix', function ()
        {
            expect(wrapper.constants[0x8B5A].isMatrix).toBe(true);
        });
    });

    describe('constants - FLOAT_MAT3 (0x8B5B)', function ()
    {
        it('should have size of 9', function ()
        {
            expect(wrapper.constants[0x8B5B].size).toBe(9);
        });

        it('should have set as uniformMatrix3fv', function ()
        {
            expect(wrapper.constants[0x8B5B].set).toBe(renderer.gl.uniformMatrix3fv);
        });

        it('should have setV as uniformMatrix3fv', function ()
        {
            expect(wrapper.constants[0x8B5B].setV).toBe(renderer.gl.uniformMatrix3fv);
        });

        it('should be a matrix', function ()
        {
            expect(wrapper.constants[0x8B5B].isMatrix).toBe(true);
        });
    });

    describe('constants - FLOAT_MAT4 (0x8B5C)', function ()
    {
        it('should have size of 16', function ()
        {
            expect(wrapper.constants[0x8B5C].size).toBe(16);
        });

        it('should have set as uniformMatrix4fv', function ()
        {
            expect(wrapper.constants[0x8B5C].set).toBe(renderer.gl.uniformMatrix4fv);
        });

        it('should have setV as uniformMatrix4fv', function ()
        {
            expect(wrapper.constants[0x8B5C].setV).toBe(renderer.gl.uniformMatrix4fv);
        });

        it('should be a matrix', function ()
        {
            expect(wrapper.constants[0x8B5C].isMatrix).toBe(true);
        });
    });

    describe('constants - SAMPLER_2D (0x8B5E)', function ()
    {
        it('should have size of 1', function ()
        {
            expect(wrapper.constants[0x8B5E].size).toBe(1);
        });

        it('should have bytes of 4', function ()
        {
            expect(wrapper.constants[0x8B5E].bytes).toBe(4);
        });

        it('should have baseType INT', function ()
        {
            expect(wrapper.constants[0x8B5E].baseType).toBe(renderer.gl.INT);
        });

        it('should have set as uniform1i', function ()
        {
            expect(wrapper.constants[0x8B5E].set).toBe(renderer.gl.uniform1i);
        });

        it('should have setV as uniform1iv', function ()
        {
            expect(wrapper.constants[0x8B5E].setV).toBe(renderer.gl.uniform1iv);
        });

        it('should not be a matrix', function ()
        {
            expect(wrapper.constants[0x8B5E].isMatrix).toBe(false);
        });
    });

    describe('constants - SAMPLER_CUBE (0x8B60)', function ()
    {
        it('should have size of 1', function ()
        {
            expect(wrapper.constants[0x8B60].size).toBe(1);
        });

        it('should have bytes of 4', function ()
        {
            expect(wrapper.constants[0x8B60].bytes).toBe(4);
        });

        it('should have baseType INT', function ()
        {
            expect(wrapper.constants[0x8B60].baseType).toBe(renderer.gl.INT);
        });

        it('should have set as uniform1i', function ()
        {
            expect(wrapper.constants[0x8B60].set).toBe(renderer.gl.uniform1i);
        });

        it('should have setV as uniform1iv', function ()
        {
            expect(wrapper.constants[0x8B60].setV).toBe(renderer.gl.uniform1iv);
        });

        it('should not be a matrix', function ()
        {
            expect(wrapper.constants[0x8B60].isMatrix).toBe(false);
        });
    });

    describe('constants - matrix flag consistency', function ()
    {
        it('should mark only FLOAT_MAT2, FLOAT_MAT3, and FLOAT_MAT4 as matrices', function ()
        {
            var constants = wrapper.constants;
            var matrixKeys = [0x8B5A, 0x8B5B, 0x8B5C];
            var nonMatrixKeys = [
                0x1404, 0x8B53, 0x8B54, 0x8B55,
                0x1406, 0x8B50, 0x8B51, 0x8B52,
                0x1405, 0x1400, 0x1401, 0x1402, 0x1403,
                0x8B56, 0x8B57, 0x8B58, 0x8B59,
                0x8B5E, 0x8B60
            ];

            matrixKeys.forEach(function (key)
            {
                expect(constants[key].isMatrix).toBe(true);
            });

            nonMatrixKeys.forEach(function (key)
            {
                expect(constants[key].isMatrix).toBe(false);
            });
        });
    });

    describe('constants - each entry has required properties', function ()
    {
        it('should have constant, baseType, size, bytes, set, setV, isMatrix on every entry', function ()
        {
            var constants = wrapper.constants;
            var keys = Object.keys(constants);

            expect(keys.length).toBe(22);

            keys.forEach(function (key)
            {
                var entry = constants[key];
                expect(entry.constant).toBeDefined();
                expect(entry.baseType).toBeDefined();
                expect(typeof entry.size).toBe('number');
                expect(typeof entry.bytes).toBe('number');
                expect(typeof entry.set).toBe('function');
                expect(typeof entry.setV).toBe('function');
                expect(typeof entry.isMatrix).toBe('boolean');
            });
        });
    });
});
