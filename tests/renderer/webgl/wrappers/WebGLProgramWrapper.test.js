var WebGLProgramWrapper = require('../../../../src/renderer/webgl/wrappers/WebGLProgramWrapper');

// WebGL constants used in mock
var GL_VERTEX_SHADER = 35633;
var GL_FRAGMENT_SHADER = 35632;
var GL_LINK_STATUS = 35714;
var GL_COMPILE_STATUS = 35713;
var GL_ACTIVE_ATTRIBUTES = 35721;
var GL_ACTIVE_UNIFORMS = 35718;
var GL_FLOAT = 5126;
var GL_INT = 5124;

function createMockGl(contextLost, linkStatus)
{
    if (linkStatus === undefined) { linkStatus = true; }

    return {
        VERTEX_SHADER: GL_VERTEX_SHADER,
        FRAGMENT_SHADER: GL_FRAGMENT_SHADER,
        LINK_STATUS: GL_LINK_STATUS,
        COMPILE_STATUS: GL_COMPILE_STATUS,
        ACTIVE_ATTRIBUTES: GL_ACTIVE_ATTRIBUTES,
        ACTIVE_UNIFORMS: GL_ACTIVE_UNIFORMS,
        FLOAT: GL_FLOAT,
        INT: GL_INT,
        isContextLost: function () { return contextLost; },
        createProgram: vi.fn(function () { return { _type: 'WebGLProgram' }; }),
        createShader: vi.fn(function () { return { _type: 'WebGLShader' }; }),
        shaderSource: vi.fn(),
        compileShader: vi.fn(),
        attachShader: vi.fn(),
        linkProgram: vi.fn(),
        deleteShader: vi.fn(),
        deleteProgram: vi.fn(),
        disableVertexAttribArray: vi.fn(),
        getProgramParameter: vi.fn(function (program, pname)
        {
            if (pname === GL_LINK_STATUS) { return linkStatus; }
            if (pname === GL_ACTIVE_ATTRIBUTES) { return 0; }
            if (pname === GL_ACTIVE_UNIFORMS) { return 0; }
            return null;
        }),
        getShaderParameter: vi.fn(function () { return true; }),
        getActiveAttrib: vi.fn(),
        getAttribLocation: vi.fn(function () { return 0; }),
        getActiveUniform: vi.fn(),
        getUniformLocation: vi.fn(function () { return {}; }),
        getProgramInfoLog: vi.fn(function () { return 'link error'; }),
        getShaderInfoLog: vi.fn(function () { return 'shader error'; })
    };
}

function createMockRenderer(contextLost, linkStatus)
{
    var gl = createMockGl(contextLost, linkStatus);
    return {
        gl: gl,
        glWrapper: {
            state: { bindings: { program: null } },
            updateBindingsProgram: vi.fn()
        },
        game: { config: { skipUnreadyShaders: false } },
        parallelShaderCompileExtension: null,
        shaderSetters: { constants: {} }
    };
}

describe('WebGLProgramWrapper', function ()
{
    describe('constructor', function ()
    {
        it('should initialize webGLProgram to null when context is lost', function ()
        {
            var renderer = createMockRenderer(true);
            var wrapper = new WebGLProgramWrapper(renderer, 'void main(){}', 'void main(){}');

            expect(wrapper.webGLProgram).toBeNull();
        });

        it('should store the renderer reference', function ()
        {
            var renderer = createMockRenderer(true);
            var wrapper = new WebGLProgramWrapper(renderer, 'void main(){}', 'void main(){}');

            expect(wrapper.renderer).toBe(renderer);
        });

        it('should store vertexSource and fragmentSource', function ()
        {
            var renderer = createMockRenderer(true);
            var wrapper = new WebGLProgramWrapper(renderer, 'vertex source', 'fragment source');

            expect(wrapper.vertexSource).toBe('vertex source');
            expect(wrapper.fragmentSource).toBe('fragment source');
        });

        it('should initialize compiling to false', function ()
        {
            var renderer = createMockRenderer(true);
            var wrapper = new WebGLProgramWrapper(renderer, 'void main(){}', 'void main(){}');

            expect(wrapper.compiling).toBe(false);
        });

        it('should initialize compileTimeMs to zero', function ()
        {
            var renderer = createMockRenderer(true);
            var wrapper = new WebGLProgramWrapper(renderer, 'void main(){}', 'void main(){}');

            expect(wrapper.compileTimeMs).toBe(0);
        });

        it('should initialize glAttributeBuffer to null', function ()
        {
            var renderer = createMockRenderer(true);
            var wrapper = new WebGLProgramWrapper(renderer, 'void main(){}', 'void main(){}');

            expect(wrapper.glAttributeBuffer).toBeNull();
        });

        it('should initialize glAttributes as an empty array', function ()
        {
            var renderer = createMockRenderer(true);
            var wrapper = new WebGLProgramWrapper(renderer, 'void main(){}', 'void main(){}');

            expect(Array.isArray(wrapper.glAttributes)).toBe(true);
            expect(wrapper.glAttributes.length).toBe(0);
        });

        it('should initialize glAttributeNames as a Map', function ()
        {
            var renderer = createMockRenderer(true);
            var wrapper = new WebGLProgramWrapper(renderer, 'void main(){}', 'void main(){}');

            expect(wrapper.glAttributeNames).toBeDefined();
            expect(typeof wrapper.glAttributeNames.set).toBe('function');
            expect(typeof wrapper.glAttributeNames.get).toBe('function');
        });

        it('should initialize glUniforms as a Map', function ()
        {
            var renderer = createMockRenderer(true);
            var wrapper = new WebGLProgramWrapper(renderer, 'void main(){}', 'void main(){}');

            expect(wrapper.glUniforms).toBeDefined();
            expect(typeof wrapper.glUniforms.set).toBe('function');
        });

        it('should initialize uniformRequests as a Map', function ()
        {
            var renderer = createMockRenderer(true);
            var wrapper = new WebGLProgramWrapper(renderer, 'void main(){}', 'void main(){}');

            expect(wrapper.uniformRequests).toBeDefined();
            expect(typeof wrapper.uniformRequests.set).toBe('function');
        });

        it('should set glState bindings.program to itself', function ()
        {
            var renderer = createMockRenderer(true);
            var wrapper = new WebGLProgramWrapper(renderer, 'void main(){}', 'void main(){}');

            expect(wrapper.glState.bindings.program).toBe(wrapper);
        });
    });

    describe('createResource', function ()
    {
        it('should return early and leave webGLProgram null when context is lost', function ()
        {
            var renderer = createMockRenderer(true);
            var wrapper = new WebGLProgramWrapper(renderer, 'void main(){}', 'void main(){}');

            expect(wrapper.webGLProgram).toBeNull();
            expect(renderer.gl.createProgram).not.toHaveBeenCalled();
        });

        it('should reset glAttributeBuffer to null even when context is lost', function ()
        {
            var renderer = createMockRenderer(true);
            var wrapper = new WebGLProgramWrapper(renderer, 'void main(){}', 'void main(){}');
            wrapper.glAttributeBuffer = { _type: 'WebGLBuffer' };

            wrapper.createResource();

            expect(wrapper.glAttributeBuffer).toBeNull();
        });

        it('should create a WebGLProgram when context is active', function ()
        {
            var renderer = createMockRenderer(false);
            var wrapper = new WebGLProgramWrapper(renderer, 'void main(){}', 'void main(){}');

            expect(wrapper.webGLProgram).not.toBeNull();
            expect(renderer.gl.createProgram).toHaveBeenCalled();
        });

        it('should compile vertex and fragment shaders', function ()
        {
            var renderer = createMockRenderer(false);
            var wrapper = new WebGLProgramWrapper(renderer, 'void main(){}', 'void main(){}');

            expect(renderer.gl.createShader).toHaveBeenCalledWith(GL_VERTEX_SHADER);
            expect(renderer.gl.createShader).toHaveBeenCalledWith(GL_FRAGMENT_SHADER);
            expect(renderer.gl.compileShader).toHaveBeenCalledTimes(2);
        });

        it('should link the program', function ()
        {
            var renderer = createMockRenderer(false);
            var wrapper = new WebGLProgramWrapper(renderer, 'void main(){}', 'void main(){}');

            expect(renderer.gl.linkProgram).toHaveBeenCalled();
        });

        it('should set compiling to false after successful creation', function ()
        {
            var renderer = createMockRenderer(false);
            var wrapper = new WebGLProgramWrapper(renderer, 'void main(){}', 'void main(){}');

            expect(wrapper.compiling).toBe(false);
        });

        it('should set compileTimeMs to a non-negative value after creation', function ()
        {
            var renderer = createMockRenderer(false);
            var wrapper = new WebGLProgramWrapper(renderer, 'void main(){}', 'void main(){}');

            expect(wrapper.compileTimeMs).toBeGreaterThanOrEqual(0);
        });

        it('should unbind current program if it is this wrapper before recreating', function ()
        {
            var renderer = createMockRenderer(false);
            var wrapper = new WebGLProgramWrapper(renderer, 'void main(){}', 'void main(){}');

            renderer.glWrapper.state.bindings.program = wrapper;
            renderer.glWrapper.updateBindingsProgram.mockClear();

            wrapper.createResource();

            expect(renderer.glWrapper.updateBindingsProgram).toHaveBeenCalledWith(
                { bindings: { program: null } }
            );
        });

        it('should throw an error when link fails', function ()
        {
            var renderer = createMockRenderer(false, false);

            expect(function ()
            {
                new WebGLProgramWrapper(renderer, 'void main(){}', 'void main(){}');
            }).toThrow();
        });
    });

    describe('checkParallelCompile', function ()
    {
        it('should do nothing when parallelShaderCompileExtension is null', function ()
        {
            var renderer = createMockRenderer(true);
            var wrapper = new WebGLProgramWrapper(renderer, 'void main(){}', 'void main(){}');

            renderer.parallelShaderCompileExtension = null;

            // Should not throw
            expect(function () { wrapper.checkParallelCompile(); }).not.toThrow();
            expect(wrapper.compiling).toBe(false);
        });

        it('should do nothing when compilation is not complete', function ()
        {
            var renderer = createMockRenderer(true);
            var wrapper = new WebGLProgramWrapper(renderer, 'void main(){}', 'void main(){}');
            var COMPLETION_STATUS_KHR = 37297;

            renderer.parallelShaderCompileExtension = { COMPLETION_STATUS_KHR: COMPLETION_STATUS_KHR };
            renderer.gl.isContextLost = function () { return false; };
            renderer.gl.getProgramParameter = vi.fn(function (program, pname)
            {
                if (pname === COMPLETION_STATUS_KHR) { return false; }
                return true;
            });

            wrapper.checkParallelCompile();

            // _completeProgram should not have been called, compileTimeMs stays 0
            expect(wrapper.compileTimeMs).toBe(0);
        });

        it('should complete the program when compilation status is ready', function ()
        {
            var renderer = createMockRenderer(false);
            var COMPLETION_STATUS_KHR = 37297;

            // Override to skip auto-complete in constructor
            renderer.game.config.skipUnreadyShaders = true;

            var wrapper = new WebGLProgramWrapper(renderer, 'void main(){}', 'void main(){}');

            // Now set up for checkParallelCompile
            renderer.parallelShaderCompileExtension = { COMPLETION_STATUS_KHR: COMPLETION_STATUS_KHR };
            renderer.gl.getProgramParameter = vi.fn(function (program, pname)
            {
                if (pname === COMPLETION_STATUS_KHR) { return true; }
                if (pname === GL_LINK_STATUS) { return true; }
                if (pname === GL_ACTIVE_ATTRIBUTES) { return 0; }
                if (pname === GL_ACTIVE_UNIFORMS) { return 0; }
                return true;
            });

            wrapper.checkParallelCompile();

            expect(wrapper.compiling).toBe(false);
            expect(wrapper.compileTimeMs).toBeGreaterThanOrEqual(0);
        });
    });

    describe('setUniform', function ()
    {
        it('should add a number value to uniformRequests', function ()
        {
            var renderer = createMockRenderer(true);
            var wrapper = new WebGLProgramWrapper(renderer, 'void main(){}', 'void main(){}');

            wrapper.setUniform('uTime', 1.5);

            expect(wrapper.uniformRequests.get('uTime')).toBe(1.5);
        });

        it('should add an array value to uniformRequests', function ()
        {
            var renderer = createMockRenderer(true);
            var wrapper = new WebGLProgramWrapper(renderer, 'void main(){}', 'void main(){}');
            var value = [1, 2, 3, 4];

            wrapper.setUniform('uColor', value);

            expect(wrapper.uniformRequests.get('uColor')).toBe(value);
        });

        it('should overwrite an existing request with the same name', function ()
        {
            var renderer = createMockRenderer(true);
            var wrapper = new WebGLProgramWrapper(renderer, 'void main(){}', 'void main(){}');

            wrapper.setUniform('uAlpha', 0.5);
            wrapper.setUniform('uAlpha', 1.0);

            expect(wrapper.uniformRequests.get('uAlpha')).toBe(1.0);
        });

        it('should store multiple distinct uniforms', function ()
        {
            var renderer = createMockRenderer(true);
            var wrapper = new WebGLProgramWrapper(renderer, 'void main(){}', 'void main(){}');

            wrapper.setUniform('uTime', 10);
            wrapper.setUniform('uResolution', [800, 600]);

            expect(wrapper.uniformRequests.get('uTime')).toBe(10);
            expect(wrapper.uniformRequests.get('uResolution')).toEqual([800, 600]);
        });

        it('should store zero as a valid value', function ()
        {
            var renderer = createMockRenderer(true);
            var wrapper = new WebGLProgramWrapper(renderer, 'void main(){}', 'void main(){}');

            wrapper.setUniform('uZero', 0);

            expect(wrapper.uniformRequests.get('uZero')).toBe(0);
        });

        it('should store negative values', function ()
        {
            var renderer = createMockRenderer(true);
            var wrapper = new WebGLProgramWrapper(renderer, 'void main(){}', 'void main(){}');

            wrapper.setUniform('uNeg', -5.5);

            expect(wrapper.uniformRequests.get('uNeg')).toBe(-5.5);
        });
    });

    describe('bind', function ()
    {
        it('should call updateBindingsProgram with its glState', function ()
        {
            var renderer = createMockRenderer(true);
            var wrapper = new WebGLProgramWrapper(renderer, 'void main(){}', 'void main(){}');

            wrapper.bind();

            expect(renderer.glWrapper.updateBindingsProgram).toHaveBeenCalledWith(wrapper.glState);
        });

        it('should clear uniformRequests after binding', function ()
        {
            var renderer = createMockRenderer(true);
            var wrapper = new WebGLProgramWrapper(renderer, 'void main(){}', 'void main(){}');

            wrapper.setUniform('uTime', 1.0);
            wrapper.bind();

            expect(wrapper.uniformRequests.get('uTime')).toBeUndefined();
        });

        it('should process uniform requests for known uniforms', function ()
        {
            var renderer = createMockRenderer(false);
            var wrapper = new WebGLProgramWrapper(renderer, 'void main(){}', 'void main(){}');

            var mockLocation = {};
            var setter = {
                isMatrix: false,
                size: 1,
                set: vi.fn()
            };

            wrapper.glUniforms.set('uTime', {
                location: mockLocation,
                size: 1,
                type: GL_FLOAT,
                value: 0
            });
            renderer.shaderSetters.constants[GL_FLOAT] = setter;

            wrapper.setUniform('uTime', 2.5);
            wrapper.bind();

            expect(setter.set).toHaveBeenCalled();
        });

        it('should ignore requests for uniforms that do not exist in glUniforms', function ()
        {
            var renderer = createMockRenderer(true);
            var wrapper = new WebGLProgramWrapper(renderer, 'void main(){}', 'void main(){}');

            wrapper.setUniform('uNonExistent', 99);

            // Should not throw when processing a request for an unknown uniform
            expect(function () { wrapper.bind(); }).not.toThrow();
        });
    });

    describe('destroy', function ()
    {
        it('should return early when webGLProgram is null', function ()
        {
            var renderer = createMockRenderer(true);
            var wrapper = new WebGLProgramWrapper(renderer, 'void main(){}', 'void main(){}');

            // webGLProgram is null (context lost in constructor)
            expect(function () { wrapper.destroy(); }).not.toThrow();
            // renderer should still be set since destroy returned early
            expect(wrapper.renderer).toBe(renderer);
        });

        it('should null webGLProgram after destroying with active context', function ()
        {
            var renderer = createMockRenderer(false);
            var wrapper = new WebGLProgramWrapper(renderer, 'void main(){}', 'void main(){}');

            wrapper.destroy();

            expect(wrapper.webGLProgram).toBeNull();
        });

        it('should null renderer reference after destroy', function ()
        {
            var renderer = createMockRenderer(false);
            var wrapper = new WebGLProgramWrapper(renderer, 'void main(){}', 'void main(){}');

            wrapper.destroy();

            expect(wrapper.renderer).toBeNull();
        });

        it('should null _vertexShader and _fragmentShader after destroy', function ()
        {
            var renderer = createMockRenderer(false);
            var wrapper = new WebGLProgramWrapper(renderer, 'void main(){}', 'void main(){}');

            wrapper.destroy();

            expect(wrapper._vertexShader).toBeNull();
            expect(wrapper._fragmentShader).toBeNull();
        });

        it('should null glAttributeBuffer after destroy', function ()
        {
            var renderer = createMockRenderer(false);
            var wrapper = new WebGLProgramWrapper(renderer, 'void main(){}', 'void main(){}');

            wrapper.destroy();

            expect(wrapper.glAttributeBuffer).toBeNull();
        });

        it('should call deleteShader for vertex and fragment shaders', function ()
        {
            var renderer = createMockRenderer(false);
            var wrapper = new WebGLProgramWrapper(renderer, 'void main(){}', 'void main(){}');

            var vs = wrapper._vertexShader;
            var fs = wrapper._fragmentShader;

            wrapper.destroy();

            expect(renderer.gl.deleteShader).toHaveBeenCalledWith(vs);
            expect(renderer.gl.deleteShader).toHaveBeenCalledWith(fs);
        });

        it('should call deleteProgram with the webGLProgram', function ()
        {
            var renderer = createMockRenderer(false);
            var wrapper = new WebGLProgramWrapper(renderer, 'void main(){}', 'void main(){}');

            var program = wrapper.webGLProgram;

            wrapper.destroy();

            expect(renderer.gl.deleteProgram).toHaveBeenCalledWith(program);
        });

        it('should clear uniformRequests after destroy', function ()
        {
            var renderer = createMockRenderer(false);
            var wrapper = new WebGLProgramWrapper(renderer, 'void main(){}', 'void main(){}');

            wrapper.setUniform('uTime', 1.0);
            wrapper.destroy();

            expect(wrapper.uniformRequests.get('uTime')).toBeUndefined();
        });

        it('should clear glAttributeNames after destroy', function ()
        {
            var renderer = createMockRenderer(false);
            var wrapper = new WebGLProgramWrapper(renderer, 'void main(){}', 'void main(){}');

            wrapper.glAttributeNames.set('aPosition', 0);
            wrapper.destroy();

            expect(wrapper.glAttributeNames.get('aPosition')).toBeUndefined();
        });

        it('should skip gl cleanup when context is lost', function ()
        {
            var renderer = createMockRenderer(false);
            var wrapper = new WebGLProgramWrapper(renderer, 'void main(){}', 'void main(){}');

            // Simulate context lost before destroy
            renderer.gl.isContextLost = function () { return true; };
            renderer.gl.deleteShader.mockClear();
            renderer.gl.deleteProgram.mockClear();

            wrapper.destroy();

            expect(renderer.gl.deleteShader).not.toHaveBeenCalled();
            expect(renderer.gl.deleteProgram).not.toHaveBeenCalled();
            expect(wrapper.webGLProgram).toBeNull();
        });
    });
});
