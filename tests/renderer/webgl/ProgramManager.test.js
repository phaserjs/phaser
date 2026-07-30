var ProgramManager = require('../../../src/renderer/webgl/ProgramManager');

describe('ProgramManager', function ()
{
    var manager;
    var mockRenderer;

    function createMockRenderer (programKey, programObj)
    {
        return {
            shaderProgramFactory: {
                getKey: function () { return programKey || 'test-key'; },
                getShaderProgram: function () { return programObj || { compiling: false }; }
            },
            createVAO: function () { return { vao: true }; }
        };
    }

    beforeEach(function ()
    {
        mockRenderer = createMockRenderer();
        manager = new ProgramManager(mockRenderer, [], null);
    });

    describe('constructor', function ()
    {
        it('should store the renderer reference', function ()
        {
            expect(manager.renderer).toBe(mockRenderer);
        });

        it('should store the indexBuffer', function ()
        {
            var buf = { buffer: true };
            var m = new ProgramManager(mockRenderer, [], buf);
            expect(m.indexBuffer).toBe(buf);
        });

        it('should default indexBuffer to null when passed null', function ()
        {
            expect(manager.indexBuffer).toBeNull();
        });

        it('should store the attributeBufferLayouts', function ()
        {
            var layouts = [{ a: 1 }, { b: 2 }];
            var m = new ProgramManager(mockRenderer, layouts, null);
            expect(m.attributeBufferLayouts).toBe(layouts);
        });

        it('should initialize currentProgramKey to null', function ()
        {
            expect(manager.currentProgramKey).toBeNull();
        });

        it('should initialize currentConfig with empty base shaders', function ()
        {
            expect(manager.currentConfig.base.vertexShader).toBe('');
            expect(manager.currentConfig.base.fragmentShader).toBe('');
        });

        it('should initialize currentConfig with empty additions array', function ()
        {
            expect(Array.isArray(manager.currentConfig.additions)).toBe(true);
            expect(manager.currentConfig.additions.length).toBe(0);
        });

        it('should initialize currentConfig with empty features array', function ()
        {
            expect(Array.isArray(manager.currentConfig.features)).toBe(true);
            expect(manager.currentConfig.features.length).toBe(0);
        });

        it('should initialize programs as an empty object', function ()
        {
            expect(typeof manager.programs).toBe('object');
            expect(Object.keys(manager.programs).length).toBe(0);
        });

        it('should initialize uniforms as an empty object', function ()
        {
            expect(typeof manager.uniforms).toBe('object');
            expect(Object.keys(manager.uniforms).length).toBe(0);
        });
    });

    describe('resetCurrentConfig', function ()
    {
        it('should clear the vertexShader', function ()
        {
            manager.currentConfig.base.vertexShader = 'void main() {}';
            manager.resetCurrentConfig();
            expect(manager.currentConfig.base.vertexShader).toBe('');
        });

        it('should clear the fragmentShader', function ()
        {
            manager.currentConfig.base.fragmentShader = 'void main() {}';
            manager.resetCurrentConfig();
            expect(manager.currentConfig.base.fragmentShader).toBe('');
        });

        it('should clear additions', function ()
        {
            manager.currentConfig.additions.push({ name: 'add1' });
            manager.resetCurrentConfig();
            expect(manager.currentConfig.additions.length).toBe(0);
        });

        it('should clear features', function ()
        {
            manager.currentConfig.features.push('featureA');
            manager.resetCurrentConfig();
            expect(manager.currentConfig.features.length).toBe(0);
        });

        it('should preserve the same arrays (not replace them)', function ()
        {
            var additions = manager.currentConfig.additions;
            var features = manager.currentConfig.features;
            additions.push({ name: 'x' });
            features.push('y');
            manager.resetCurrentConfig();
            expect(manager.currentConfig.additions).toBe(additions);
            expect(manager.currentConfig.features).toBe(features);
        });
    });

    describe('setUniform', function ()
    {
        it('should store a uniform value by name', function ()
        {
            manager.setUniform('uTexture', 0);
            expect(manager.uniforms['uTexture']).toBe(0);
        });

        it('should overwrite an existing uniform value', function ()
        {
            manager.setUniform('uAlpha', 0.5);
            manager.setUniform('uAlpha', 1.0);
            expect(manager.uniforms['uAlpha']).toBe(1.0);
        });

        it('should store multiple uniforms', function ()
        {
            manager.setUniform('uA', 1);
            manager.setUniform('uB', 2);
            expect(manager.uniforms['uA']).toBe(1);
            expect(manager.uniforms['uB']).toBe(2);
        });

        it('should store non-numeric values', function ()
        {
            var arr = [1, 0, 0, 1];
            manager.setUniform('uColor', arr);
            expect(manager.uniforms['uColor']).toBe(arr);
        });
    });

    describe('removeUniform', function ()
    {
        it('should remove an existing uniform', function ()
        {
            manager.setUniform('uTexture', 0);
            manager.removeUniform('uTexture');
            expect(manager.uniforms['uTexture']).toBeUndefined();
        });

        it('should not throw when removing a non-existent uniform', function ()
        {
            expect(function () { manager.removeUniform('nonExistent'); }).not.toThrow();
        });

        it('should only remove the specified uniform', function ()
        {
            manager.setUniform('uA', 1);
            manager.setUniform('uB', 2);
            manager.removeUniform('uA');
            expect(manager.uniforms['uB']).toBe(2);
        });
    });

    describe('clearUniforms', function ()
    {
        it('should remove all uniforms', function ()
        {
            manager.setUniform('uA', 1);
            manager.setUniform('uB', 2);
            manager.clearUniforms();
            expect(Object.keys(manager.uniforms).length).toBe(0);
        });

        it('should replace the uniforms object', function ()
        {
            var original = manager.uniforms;
            manager.setUniform('uA', 1);
            manager.clearUniforms();
            expect(manager.uniforms).not.toBe(original);
        });

        it('should work when uniforms are already empty', function ()
        {
            expect(function () { manager.clearUniforms(); }).not.toThrow();
            expect(Object.keys(manager.uniforms).length).toBe(0);
        });
    });

    describe('applyUniforms', function ()
    {
        it('should call setUniform on the program for each stored uniform', function ()
        {
            var calls = [];
            var mockProgram = {
                setUniform: function (name, value) { calls.push({ name: name, value: value }); }
            };

            manager.setUniform('uA', 1);
            manager.setUniform('uB', 2);
            manager.applyUniforms(mockProgram);

            expect(calls.length).toBe(2);

            var names = calls.map(function (c) { return c.name; });
            expect(names).toContain('uA');
            expect(names).toContain('uB');
        });

        it('should pass the correct value to setUniform', function ()
        {
            var calls = [];
            var mockProgram = {
                setUniform: function (name, value) { calls.push({ name: name, value: value }); }
            };

            manager.setUniform('uAlpha', 0.75);
            manager.applyUniforms(mockProgram);

            expect(calls[0].name).toBe('uAlpha');
            expect(calls[0].value).toBe(0.75);
        });

        it('should not call setUniform when there are no uniforms', function ()
        {
            var callCount = 0;
            var mockProgram = {
                setUniform: function () { callCount++; }
            };

            manager.applyUniforms(mockProgram);
            expect(callCount).toBe(0);
        });
    });

    describe('setBaseShader', function ()
    {
        it('should set the name on the base config', function ()
        {
            manager.setBaseShader('MyShader', 'vs', 'fs');
            expect(manager.currentConfig.base.name).toBe('MyShader');
        });

        it('should set the vertexShader on the base config', function ()
        {
            manager.setBaseShader('MyShader', 'void main() { gl_Position = vec4(0); }', 'fs');
            expect(manager.currentConfig.base.vertexShader).toBe('void main() { gl_Position = vec4(0); }');
        });

        it('should set the fragmentShader on the base config', function ()
        {
            manager.setBaseShader('MyShader', 'vs', 'void main() { gl_FragColor = vec4(1); }');
            expect(manager.currentConfig.base.fragmentShader).toBe('void main() { gl_FragColor = vec4(1); }');
        });

        it('should overwrite a previously set base shader', function ()
        {
            manager.setBaseShader('First', 'vs1', 'fs1');
            manager.setBaseShader('Second', 'vs2', 'fs2');
            expect(manager.currentConfig.base.name).toBe('Second');
            expect(manager.currentConfig.base.vertexShader).toBe('vs2');
            expect(manager.currentConfig.base.fragmentShader).toBe('fs2');
        });
    });

    describe('addAddition', function ()
    {
        it('should append an addition to the end when no index is given', function ()
        {
            var add = { name: 'myAddition' };
            manager.addAddition(add);
            expect(manager.currentConfig.additions.length).toBe(1);
            expect(manager.currentConfig.additions[0]).toBe(add);
        });

        it('should insert at the specified index', function ()
        {
            var a = { name: 'a' };
            var b = { name: 'b' };
            var c = { name: 'c' };
            manager.addAddition(a);
            manager.addAddition(c);
            manager.addAddition(b, 1);
            expect(manager.currentConfig.additions[0]).toBe(a);
            expect(manager.currentConfig.additions[1]).toBe(b);
            expect(manager.currentConfig.additions[2]).toBe(c);
        });

        it('should insert at index 0', function ()
        {
            var a = { name: 'a' };
            var b = { name: 'b' };
            manager.addAddition(a);
            manager.addAddition(b, 0);
            expect(manager.currentConfig.additions[0]).toBe(b);
            expect(manager.currentConfig.additions[1]).toBe(a);
        });

        it('should allow multiple additions', function ()
        {
            manager.addAddition({ name: 'x' });
            manager.addAddition({ name: 'y' });
            manager.addAddition({ name: 'z' });
            expect(manager.currentConfig.additions.length).toBe(3);
        });
    });

    describe('getAddition', function ()
    {
        it('should return the addition with the matching name', function ()
        {
            var add = { name: 'target' };
            manager.addAddition({ name: 'other' });
            manager.addAddition(add);
            expect(manager.getAddition('target')).toBe(add);
        });

        it('should return null when no addition matches', function ()
        {
            manager.addAddition({ name: 'other' });
            expect(manager.getAddition('missing')).toBeNull();
        });

        it('should return null when additions list is empty', function ()
        {
            expect(manager.getAddition('anything')).toBeNull();
        });

        it('should return the first match when duplicates exist', function ()
        {
            var first = { name: 'dup' };
            var second = { name: 'dup' };
            manager.addAddition(first);
            manager.addAddition(second);
            expect(manager.getAddition('dup')).toBe(first);
        });
    });

    describe('getAdditionsByTag', function ()
    {
        it('should return additions that include the given tag', function ()
        {
            var a = { name: 'a', tags: ['alpha', 'beta'] };
            var b = { name: 'b', tags: ['beta'] };
            var c = { name: 'c', tags: ['gamma'] };
            manager.addAddition(a);
            manager.addAddition(b);
            manager.addAddition(c);
            var result = manager.getAdditionsByTag('beta');
            expect(result.length).toBe(2);
            expect(result).toContain(a);
            expect(result).toContain(b);
        });

        it('should return an empty array when no additions match the tag', function ()
        {
            manager.addAddition({ name: 'a', tags: ['alpha'] });
            var result = manager.getAdditionsByTag('nonexistent');
            expect(result.length).toBe(0);
        });

        it('should exclude additions with no tags property', function ()
        {
            manager.addAddition({ name: 'noTags' });
            var result = manager.getAdditionsByTag('anything');
            expect(result.length).toBe(0);
        });

        it('should return an empty array when additions list is empty', function ()
        {
            var result = manager.getAdditionsByTag('tag');
            expect(result.length).toBe(0);
        });
    });

    describe('getAdditionIndex', function ()
    {
        it('should return the index of the addition with the matching name', function ()
        {
            manager.addAddition({ name: 'a' });
            manager.addAddition({ name: 'b' });
            manager.addAddition({ name: 'c' });
            expect(manager.getAdditionIndex('b')).toBe(1);
        });

        it('should return 0 for the first addition', function ()
        {
            manager.addAddition({ name: 'first' });
            expect(manager.getAdditionIndex('first')).toBe(0);
        });

        it('should return -1 when the addition is not found', function ()
        {
            manager.addAddition({ name: 'a' });
            expect(manager.getAdditionIndex('missing')).toBe(-1);
        });

        it('should return -1 when the additions list is empty', function ()
        {
            expect(manager.getAdditionIndex('anything')).toBe(-1);
        });
    });

    describe('removeAddition', function ()
    {
        it('should remove the addition with the given name', function ()
        {
            manager.addAddition({ name: 'keep' });
            manager.addAddition({ name: 'remove' });
            manager.removeAddition('remove');
            expect(manager.currentConfig.additions.length).toBe(1);
            expect(manager.currentConfig.additions[0].name).toBe('keep');
        });

        it('should not affect other additions', function ()
        {
            var a = { name: 'a' };
            var b = { name: 'b' };
            var c = { name: 'c' };
            manager.addAddition(a);
            manager.addAddition(b);
            manager.addAddition(c);
            manager.removeAddition('b');
            expect(manager.currentConfig.additions.length).toBe(2);
            expect(manager.currentConfig.additions[0]).toBe(a);
            expect(manager.currentConfig.additions[1]).toBe(c);
        });

        it('should do nothing when name does not exist', function ()
        {
            manager.addAddition({ name: 'a' });
            manager.removeAddition('nonexistent');
            expect(manager.currentConfig.additions.length).toBe(1);
        });

        it('should work on an empty additions list', function ()
        {
            expect(function () { manager.removeAddition('anything'); }).not.toThrow();
        });
    });

    describe('replaceAddition', function ()
    {
        it('should replace the addition at the correct index', function ()
        {
            var original = { name: 'target', data: 'old' };
            var replacement = { name: 'target', data: 'new' };
            manager.addAddition({ name: 'before' });
            manager.addAddition(original);
            manager.addAddition({ name: 'after' });
            manager.replaceAddition('target', replacement);
            expect(manager.currentConfig.additions[1]).toBe(replacement);
        });

        it('should not change the length of the additions array', function ()
        {
            manager.addAddition({ name: 'a' });
            manager.addAddition({ name: 'b' });
            manager.replaceAddition('a', { name: 'a', updated: true });
            expect(manager.currentConfig.additions.length).toBe(2);
        });

        it('should do nothing when the name is not found', function ()
        {
            var original = { name: 'existing' };
            manager.addAddition(original);
            manager.replaceAddition('nonexistent', { name: 'new' });
            expect(manager.currentConfig.additions[0]).toBe(original);
        });

        it('should not affect surrounding additions', function ()
        {
            var before = { name: 'before' };
            var after = { name: 'after' };
            manager.addAddition(before);
            manager.addAddition({ name: 'target' });
            manager.addAddition(after);
            manager.replaceAddition('target', { name: 'target', updated: true });
            expect(manager.currentConfig.additions[0]).toBe(before);
            expect(manager.currentConfig.additions[2]).toBe(after);
        });
    });

    describe('addFeature', function ()
    {
        it('should add a feature string', function ()
        {
            manager.addFeature('SHADOW');
            expect(manager.currentConfig.features).toContain('SHADOW');
        });

        it('should not add a duplicate feature', function ()
        {
            manager.addFeature('SHADOW');
            manager.addFeature('SHADOW');
            expect(manager.currentConfig.features.length).toBe(1);
        });

        it('should add multiple distinct features', function ()
        {
            manager.addFeature('SHADOW');
            manager.addFeature('BLOOM');
            expect(manager.currentConfig.features.length).toBe(2);
            expect(manager.currentConfig.features).toContain('SHADOW');
            expect(manager.currentConfig.features).toContain('BLOOM');
        });
    });

    describe('removeFeature', function ()
    {
        it('should remove the specified feature', function ()
        {
            manager.addFeature('SHADOW');
            manager.addFeature('BLOOM');
            manager.removeFeature('SHADOW');
            expect(manager.currentConfig.features).not.toContain('SHADOW');
            expect(manager.currentConfig.features).toContain('BLOOM');
        });

        it('should do nothing when feature is not present', function ()
        {
            manager.addFeature('BLOOM');
            manager.removeFeature('SHADOW');
            expect(manager.currentConfig.features.length).toBe(1);
        });

        it('should work on an empty features list', function ()
        {
            expect(function () { manager.removeFeature('anything'); }).not.toThrow();
        });
    });

    describe('clearFeatures', function ()
    {
        it('should remove all features', function ()
        {
            manager.addFeature('SHADOW');
            manager.addFeature('BLOOM');
            manager.clearFeatures();
            expect(manager.currentConfig.features.length).toBe(0);
        });

        it('should preserve the same array reference', function ()
        {
            var features = manager.currentConfig.features;
            manager.addFeature('SHADOW');
            manager.clearFeatures();
            expect(manager.currentConfig.features).toBe(features);
        });

        it('should work when features are already empty', function ()
        {
            expect(function () { manager.clearFeatures(); }).not.toThrow();
            expect(manager.currentConfig.features.length).toBe(0);
        });
    });

    describe('getCurrentProgramSuite', function ()
    {
        it('should return null when the program is still compiling', function ()
        {
            var mockProgram = { compiling: true, checkParallelCompile: function () {} };
            var r = createMockRenderer('key1', mockProgram);
            var m = new ProgramManager(r, [], null);
            var result = m.getCurrentProgramSuite();
            expect(result).toBeNull();
        });

        it('should return the program suite when the program is ready', function ()
        {
            var mockProgram = { compiling: false };
            var r = createMockRenderer('key2', mockProgram);
            var m = new ProgramManager(r, [], null);
            var result = m.getCurrentProgramSuite();
            expect(result).not.toBeNull();
            expect(result.program).toBe(mockProgram);
        });

        it('should cache the program suite on subsequent calls', function ()
        {
            var callCount = 0;
            var mockProgram = { compiling: false };
            var r = {
                shaderProgramFactory: {
                    getKey: function () { return 'cached-key'; },
                    getShaderProgram: function () { callCount++; return mockProgram; }
                },
                createVAO: function () { return {}; }
            };
            var m = new ProgramManager(r, [], null);
            m.getCurrentProgramSuite();
            m.getCurrentProgramSuite();
            expect(callCount).toBe(1);
        });

        it('should store a deep copy of the config in the suite', function ()
        {
            var mockProgram = { compiling: false };
            var r = createMockRenderer('key3', mockProgram);
            var m = new ProgramManager(r, [], null);
            m.setBaseShader('Test', 'vs', 'fs');
            var suite = m.getCurrentProgramSuite();
            m.setBaseShader('Changed', 'vs2', 'fs2');
            expect(suite.config.base.vertexShader).toBe('vs');
        });

        it('should call checkParallelCompile when program is compiling', function ()
        {
            var checked = false;
            var mockProgram = {
                compiling: true,
                checkParallelCompile: function () { checked = true; }
            };
            var r = createMockRenderer('key4', mockProgram);
            var m = new ProgramManager(r, [], null);
            m.getCurrentProgramSuite();
            expect(checked).toBe(true);
        });
    });
});
