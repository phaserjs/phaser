var ShaderProgramFactory = require('../../../src/renderer/webgl/ShaderProgramFactory');

describe('ShaderProgramFactory', function ()
{
    var mockRenderer;
    var factory;

    beforeEach(function ()
    {
        mockRenderer = {
            createProgram: function (vertexSource, fragmentSource)
            {
                return { vertexSource: vertexSource, fragmentSource: fragmentSource };
            }
        };

        factory = new ShaderProgramFactory(mockRenderer);
    });

    describe('constructor', function ()
    {
        it('should store the renderer reference', function ()
        {
            expect(factory.renderer).toBe(mockRenderer);
        });

        it('should initialise programs as an empty object', function ()
        {
            expect(factory.programs).toBeDefined();
            expect(Object.keys(factory.programs).length).toBe(0);
        });
    });

    describe('has', function ()
    {
        it('should return false when no programs are cached', function ()
        {
            expect(factory.has('someKey')).toBe(false);
        });

        it('should return true when a program has been cached under the given key', function ()
        {
            factory.programs['someKey'] = { dummy: true };
            expect(factory.has('someKey')).toBe(true);
        });

        it('should return false for a key that does not exist even when other keys do', function ()
        {
            factory.programs['otherKey'] = { dummy: true };
            expect(factory.has('someKey')).toBe(false);
        });

        it('should return false when the key is an empty string and cache is empty', function ()
        {
            expect(factory.has('')).toBe(false);
        });
    });

    describe('getKey', function ()
    {
        it('should return the base name when no additions or features are provided', function ()
        {
            var base = { name: 'myShader', vertexShader: '', fragmentShader: '' };
            expect(factory.getKey(base)).toBe('myShader');
        });

        it('should return the base name when additions and features are empty arrays', function ()
        {
            var base = { name: 'myShader', vertexShader: '', fragmentShader: '' };
            expect(factory.getKey(base, [], [])).toBe('myShader');
        });

        it('should append addition names separated by underscores', function ()
        {
            var base = { name: 'base', vertexShader: '', fragmentShader: '' };
            var additions = [
                { name: 'addA', disable: false, additions: {} },
                { name: 'addB', disable: false, additions: {} }
            ];
            var key = factory.getKey(base, additions);
            expect(key).toBe('base__addA_addB');
        });

        it('should skip disabled additions in the key', function ()
        {
            var base = { name: 'base', vertexShader: '', fragmentShader: '' };
            var additions = [
                { name: 'addA', disable: false, additions: {} },
                { name: 'addB', disable: true, additions: {} },
                { name: 'addC', disable: false, additions: {} }
            ];
            var key = factory.getKey(base, additions);
            expect(key).toBe('base__addA_addC');
        });

        it('should append sorted feature keys after a double underscore separator', function ()
        {
            var base = { name: 'base', vertexShader: '', fragmentShader: '' };
            var features = [ 'zebra', 'apple', 'mango' ];
            var key = factory.getKey(base, undefined, features);
            expect(key).toBe('base__apple_mango_zebra');
        });

        it('should sort features alphabetically regardless of input order', function ()
        {
            var base = { name: 'base', vertexShader: '', fragmentShader: '' };
            var featuresA = [ 'z', 'a', 'm' ];
            var featuresB = [ 'a', 'm', 'z' ];
            expect(factory.getKey(base, undefined, featuresA)).toBe(factory.getKey(base, undefined, featuresB));
        });

        it('should combine additions and features in the key', function ()
        {
            var base = { name: 'base', vertexShader: '', fragmentShader: '' };
            var additions = [ { name: 'addA', disable: false, additions: {} } ];
            var features = [ 'featureB', 'featureA' ];
            var key = factory.getKey(base, additions, features);
            expect(key).toBe('base__addA__featureA_featureB');
        });

        it('should return only the base name when all additions are disabled', function ()
        {
            var base = { name: 'base', vertexShader: '', fragmentShader: '' };
            var additions = [
                { name: 'addA', disable: true, additions: {} },
                { name: 'addB', disable: true, additions: {} }
            ];
            var key = factory.getKey(base, additions);
            expect(key).toBe('base_');
        });
    });

    describe('getShaderProgram', function ()
    {
        it('should compile and return a new program when none is cached', function ()
        {
            var base = { name: 'myShader', vertexShader: 'void main(){}', fragmentShader: 'void main(){}' };
            var program = factory.getShaderProgram(base);
            expect(program).toBeDefined();
        });

        it('should cache the compiled program under the derived key', function ()
        {
            var base = { name: 'myShader', vertexShader: 'void main(){}', fragmentShader: 'void main(){}' };
            factory.getShaderProgram(base);
            var key = factory.getKey(base);
            expect(factory.has(key)).toBe(true);
        });

        it('should return the cached program on subsequent calls with the same config', function ()
        {
            var base = { name: 'myShader', vertexShader: 'void main(){}', fragmentShader: 'void main(){}' };
            var programA = factory.getShaderProgram(base);
            var programB = factory.getShaderProgram(base);
            expect(programA).toBe(programB);
        });

        it('should not call createProgram again if the program is already cached', function ()
        {
            var callCount = 0;
            mockRenderer.createProgram = function (v, f)
            {
                callCount++;
                return { vertexSource: v, fragmentSource: f };
            };

            var base = { name: 'myShader', vertexShader: 'void main(){}', fragmentShader: 'void main(){}' };
            factory.getShaderProgram(base);
            factory.getShaderProgram(base);
            expect(callCount).toBe(1);
        });

        it('should return different programs for different base shader names', function ()
        {
            var baseA = { name: 'shaderA', vertexShader: 'void main(){}', fragmentShader: 'void main(){}' };
            var baseB = { name: 'shaderB', vertexShader: 'void main(){}', fragmentShader: 'void main(){}' };
            var programA = factory.getShaderProgram(baseA);
            var programB = factory.getShaderProgram(baseB);
            expect(programA).not.toBe(programB);
        });
    });

    describe('createShaderProgram', function ()
    {
        it('should store the compiled program in the programs cache under the given name', function ()
        {
            var base = { name: 'test', vertexShader: 'void main(){}', fragmentShader: 'void main(){}' };
            factory.createShaderProgram('test', base);
            expect(factory.programs['test']).toBeDefined();
        });

        it('should return the compiled program', function ()
        {
            var base = { name: 'test', vertexShader: 'void main(){}', fragmentShader: 'void main(){}' };
            var result = factory.createShaderProgram('test', base);
            expect(result).toBe(factory.programs['test']);
        });

        it('should strip carriage return characters from vertex and fragment source', function ()
        {
            var captured = {};
            mockRenderer.createProgram = function (v, f)
            {
                captured.vertex = v;
                captured.fragment = f;
                return {};
            };

            var base = {
                name: 'test',
                vertexShader: 'void\r main\r(){}',
                fragmentShader: 'void\r frag\r(){}'
            };

            factory.createShaderProgram('test', base);
            expect(captured.vertex.indexOf('\r')).toBe(-1);
            expect(captured.fragment.indexOf('\r')).toBe(-1);
            expect(captured.vertex).toBe('void main(){}');
            expect(captured.fragment).toBe('void frag(){}');
        });

        it('should replace a pragma template in vertex source with addition content', function ()
        {
            var captured = {};
            mockRenderer.createProgram = function (v, f)
            {
                captured.vertex = v;
                captured.fragment = f;
                return {};
            };

            var base = {
                name: 'test',
                vertexShader: '#pragma phaserTemplate(mySlot)\nvoid main(){}',
                fragmentShader: 'void main(){}'
            };

            var additions = [
                {
                    name: 'myAddition',
                    disable: false,
                    additions: { mySlot: 'float x = 1.0;' }
                }
            ];

            factory.createShaderProgram('test', base, additions);
            expect(captured.vertex).toContain('float x = 1.0;');
            expect(captured.vertex).not.toContain('#pragma phaserTemplate(mySlot)');
        });

        it('should replace a pragma template in fragment source with addition content', function ()
        {
            var captured = {};
            mockRenderer.createProgram = function (v, f)
            {
                captured.vertex = v;
                captured.fragment = f;
                return {};
            };

            var base = {
                name: 'test',
                vertexShader: 'void main(){}',
                fragmentShader: '#pragma phaserTemplate(mySlot)\nvoid main(){}'
            };

            var additions = [
                {
                    name: 'myAddition',
                    disable: false,
                    additions: { mySlot: 'float y = 2.0;' }
                }
            ];

            factory.createShaderProgram('test', base, additions);
            expect(captured.fragment).toContain('float y = 2.0;');
            expect(captured.fragment).not.toContain('#pragma phaserTemplate(mySlot)');
        });

        it('should concatenate multiple additions for the same slot', function ()
        {
            var captured = {};
            mockRenderer.createProgram = function (v, f)
            {
                captured.vertex = v;
                captured.fragment = f;
                return {};
            };

            var base = {
                name: 'test',
                vertexShader: '#pragma phaserTemplate(slot)\nvoid main(){}',
                fragmentShader: 'void main(){}'
            };

            var additions = [
                { name: 'a1', disable: false, additions: { slot: 'float a = 1.0;' } },
                { name: 'a2', disable: false, additions: { slot: 'float b = 2.0;' } }
            ];

            factory.createShaderProgram('test', base, additions);
            expect(captured.vertex).toContain('float a = 1.0;');
            expect(captured.vertex).toContain('float b = 2.0;');
        });

        it('should skip disabled additions when building shader source', function ()
        {
            var captured = {};
            mockRenderer.createProgram = function (v, f)
            {
                captured.vertex = v;
                captured.fragment = f;
                return {};
            };

            var base = {
                name: 'test',
                vertexShader: '#pragma phaserTemplate(slot)\nvoid main(){}',
                fragmentShader: 'void main(){}'
            };

            var additions = [
                { name: 'enabled', disable: false, additions: { slot: 'float a = 1.0;' } },
                { name: 'disabled', disable: true, additions: { slot: 'float b = 99.0;' } }
            ];

            factory.createShaderProgram('test', base, additions);
            expect(captured.vertex).toContain('float a = 1.0;');
            expect(captured.vertex).not.toContain('float b = 99.0;');
        });

        it('should insert feature defines into the features pragma slot', function ()
        {
            var captured = {};
            mockRenderer.createProgram = function (v, f)
            {
                captured.vertex = v;
                captured.fragment = f;
                return {};
            };

            var base = {
                name: 'test',
                vertexShader: '#pragma phaserTemplate(features)\nvoid main(){}',
                fragmentShader: '#pragma phaserTemplate(features)\nvoid main(){}'
            };

            factory.createShaderProgram('test', base, undefined, [ 'myFeature', 'another' ]);
            expect(captured.vertex).toContain('#define FEATURE_MYFEATURE');
            expect(captured.vertex).toContain('#define FEATURE_ANOTHER');
            expect(captured.fragment).toContain('#define FEATURE_MYFEATURE');
            expect(captured.fragment).toContain('#define FEATURE_ANOTHER');
        });

        it('should convert feature names to upper case for defines', function ()
        {
            var captured = {};
            mockRenderer.createProgram = function (v, f)
            {
                captured.vertex = v;
                captured.fragment = f;
                return {};
            };

            var base = {
                name: 'test',
                vertexShader: '#pragma phaserTemplate(features)\nvoid main(){}',
                fragmentShader: 'void main(){}'
            };

            factory.createShaderProgram('test', base, undefined, [ 'mixedCase' ]);
            expect(captured.vertex).toContain('#define FEATURE_MIXEDCASE');
        });

        it('should replace non-alphanumeric characters in feature names with underscores', function ()
        {
            var captured = {};
            mockRenderer.createProgram = function (v, f)
            {
                captured.vertex = v;
                captured.fragment = f;
                return {};
            };

            var base = {
                name: 'test',
                vertexShader: '#pragma phaserTemplate(features)\nvoid main(){}',
                fragmentShader: 'void main(){}'
            };

            factory.createShaderProgram('test', base, undefined, [ 'my-feature.flag' ]);
            expect(captured.vertex).toContain('#define FEATURE_MY_FEATURE_FLAG');
        });

        it('should insert shader name defines via the shaderName pragma', function ()
        {
            var captured = {};
            mockRenderer.createProgram = function (v, f)
            {
                captured.vertex = v;
                captured.fragment = f;
                return {};
            };

            var base = {
                name: 'test',
                vertexShader: '#pragma phaserTemplate(shaderName)\nvoid main(){}',
                fragmentShader: '#pragma phaserTemplate(shaderName)\nvoid main(){}'
            };

            factory.createShaderProgram('myProgram', base);
            expect(captured.vertex).toContain('#define SHADER_NAME myProgram__VERTEX');
            expect(captured.fragment).toContain('#define SHADER_NAME myProgram__FRAGMENT');
        });

        it('should remove any remaining pragma template directives', function ()
        {
            var captured = {};
            mockRenderer.createProgram = function (v, f)
            {
                captured.vertex = v;
                captured.fragment = f;
                return {};
            };

            var base = {
                name: 'test',
                vertexShader: '#pragma phaserTemplate(unused)\nvoid main(){}',
                fragmentShader: '#pragma phaserTemplate(alsoUnused)\nvoid main(){}'
            };

            factory.createShaderProgram('test', base);
            expect(captured.vertex).not.toContain('#pragma phaserTemplate');
            expect(captured.fragment).not.toContain('#pragma phaserTemplate');
        });

        it('should handle undefined additions without throwing', function ()
        {
            var base = { name: 'test', vertexShader: 'void main(){}', fragmentShader: 'void main(){}' };
            expect(function ()
            {
                factory.createShaderProgram('test', base, undefined, undefined);
            }).not.toThrow();
        });

        it('should handle an empty additions array without throwing', function ()
        {
            var base = { name: 'test', vertexShader: 'void main(){}', fragmentShader: 'void main(){}' };
            expect(function ()
            {
                factory.createShaderProgram('test', base, [], []);
            }).not.toThrow();
        });

        it('should strip carriage returns from addition source strings', function ()
        {
            var captured = {};
            mockRenderer.createProgram = function (v, f)
            {
                captured.vertex = v;
                captured.fragment = f;
                return {};
            };

            var base = {
                name: 'test',
                vertexShader: '#pragma phaserTemplate(slot)\nvoid main(){}',
                fragmentShader: 'void main(){}'
            };

            var additions = [
                { name: 'a', disable: false, additions: { slot: 'float\r x\r = 1.0;' } }
            ];

            factory.createShaderProgram('test', base, additions);
            expect(captured.vertex.indexOf('\r')).toBe(-1);
        });
    });
});
