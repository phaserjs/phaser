var BaseShader = require('../../../src/display/shader/BaseShader');

describe('BaseShader', function ()
{
    describe('constructor', function ()
    {
        it('should create a shader with key and glsl', function ()
        {
            var shader = new BaseShader('testKey', 'void main() {}');
            expect(shader.key).toBe('testKey');
            expect(shader.glsl).toBe('void main() {}');
        });

        it('should default metadata to an empty object when not provided', function ()
        {
            var shader = new BaseShader('testKey', 'void main() {}');
            expect(shader.metadata).toBeDefined();
            expect(typeof shader.metadata).toBe('object');
            expect(Object.keys(shader.metadata).length).toBe(0);
        });

        it('should accept custom metadata', function ()
        {
            var meta = { author: 'Test', version: '1.0' };
            var shader = new BaseShader('testKey', 'void main() {}', meta);
            expect(shader.metadata).toBe(meta);
            expect(shader.metadata.author).toBe('Test');
            expect(shader.metadata.version).toBe('1.0');
        });

        it('should store the key exactly as provided', function ()
        {
            var shader = new BaseShader('my-special_shader.123', 'void main() {}');
            expect(shader.key).toBe('my-special_shader.123');
        });

        it('should store the glsl source exactly as provided', function ()
        {
            var glsl = 'precision mediump float;\nuniform float time;\nvoid main() { gl_FragColor = vec4(1.0); }';
            var shader = new BaseShader('fragShader', glsl);
            expect(shader.glsl).toBe(glsl);
        });

        it('should accept an empty string as glsl', function ()
        {
            var shader = new BaseShader('emptyShader', '');
            expect(shader.glsl).toBe('');
        });

        it('should accept an empty string as key', function ()
        {
            var shader = new BaseShader('', 'void main() {}');
            expect(shader.key).toBe('');
        });

        it('should accept null metadata explicitly', function ()
        {
            var shader = new BaseShader('testKey', 'void main() {}', null);
            expect(shader.metadata).toBeNull();
        });

        it('should accept metadata with nested objects', function ()
        {
            var meta = { uniforms: { time: { type: 'float', value: 0 } } };
            var shader = new BaseShader('testKey', 'void main() {}', meta);
            expect(shader.metadata.uniforms.time.type).toBe('float');
            expect(shader.metadata.uniforms.time.value).toBe(0);
        });

        it('should have exactly the expected properties', function ()
        {
            var shader = new BaseShader('testKey', 'void main() {}');
            expect(shader.hasOwnProperty('key')).toBe(true);
            expect(shader.hasOwnProperty('glsl')).toBe(true);
            expect(shader.hasOwnProperty('metadata')).toBe(true);
        });

        it('should allow metadata to be mutated after construction', function ()
        {
            var shader = new BaseShader('testKey', 'void main() {}');
            shader.metadata.author = 'Phaser';
            expect(shader.metadata.author).toBe('Phaser');
        });

        it('should allow key to be mutated after construction', function ()
        {
            var shader = new BaseShader('oldKey', 'void main() {}');
            shader.key = 'newKey';
            expect(shader.key).toBe('newKey');
        });

        it('should allow glsl to be mutated after construction', function ()
        {
            var shader = new BaseShader('testKey', 'void main() {}');
            shader.glsl = 'void main() { gl_FragColor = vec4(0.0); }';
            expect(shader.glsl).toBe('void main() { gl_FragColor = vec4(0.0); }');
        });

        it('should not share default metadata between instances', function ()
        {
            var shader1 = new BaseShader('key1', 'void main() {}');
            var shader2 = new BaseShader('key2', 'void main() {}');
            shader1.metadata.foo = 'bar';
            expect(shader2.metadata.foo).toBeUndefined();
        });
    });
});
