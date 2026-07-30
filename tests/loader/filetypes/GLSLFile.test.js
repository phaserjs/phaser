var GLSLFile = require('../../../src/loader/filetypes/GLSLFile');
var CONST = require('../../../src/loader/const');
var FileTypesManager = require('../../../src/loader/FileTypesManager');

function createMockLoader ()
{
    return {
        prefix: '',
        path: '',
        cacheManager: {
            shader: {}
        },
        fileProcessComplete: vi.fn()
    };
}

describe('GLSLFile', function ()
{
    describe('Constructor', function ()
    {
        it('should create a GLSLFile with key, url and xhrSettings arguments', function ()
        {
            var loader = createMockLoader();
            var file = new GLSLFile(loader, 'plasma', 'shaders/Plasma.glsl');

            expect(file.key).toBe('plasma');
            expect(file.type).toBe('glsl');
        });

        it('should set the default extension to glsl', function ()
        {
            var loader = createMockLoader();
            var file = new GLSLFile(loader, 'plasma', 'shaders/Plasma.glsl');

            expect(file.xhrSettings.responseType).toBe('text');
        });

        it('should use the loader cacheManager.shader as cache', function ()
        {
            var loader = createMockLoader();
            var file = new GLSLFile(loader, 'plasma', 'shaders/Plasma.glsl');

            expect(file.cache).toBe(loader.cacheManager.shader);
        });

        it('should prepend loader.path to a relative url', function ()
        {
            var loader = createMockLoader();
            loader.path = 'assets/';
            var file = new GLSLFile(loader, 'plasma', 'Plasma.glsl');

            expect(file.url).toBe('assets/Plasma.glsl');
        });

        it('should not prepend loader.path to an absolute http url', function ()
        {
            var loader = createMockLoader();
            loader.path = 'assets/';
            var file = new GLSLFile(loader, 'plasma', 'http://example.com/Plasma.glsl');

            expect(file.url).toBe('http://example.com/Plasma.glsl');
        });

        it('should not prepend loader.path to an absolute https url', function ()
        {
            var loader = createMockLoader();
            loader.path = 'assets/';
            var file = new GLSLFile(loader, 'plasma', 'https://example.com/Plasma.glsl');

            expect(file.url).toBe('https://example.com/Plasma.glsl');
        });

        it('should build a default url from the key and extension when url is undefined', function ()
        {
            var loader = createMockLoader();
            var file = new GLSLFile(loader, 'plasma', undefined);

            expect(file.url).toBe('plasma.glsl');
        });

        it('should accept a plain config object as the key argument', function ()
        {
            var loader = createMockLoader();
            var file = new GLSLFile(loader, {
                key: 'plasma',
                url: 'shaders/Plasma.glsl'
            });

            expect(file.key).toBe('plasma');
            expect(file.type).toBe('glsl');
        });

        it('should read xhrSettings from the config object', function ()
        {
            var loader = createMockLoader();
            var customXhr = { timeout: 5000 };
            var file = new GLSLFile(loader, {
                key: 'plasma',
                url: 'shaders/Plasma.glsl',
                xhrSettings: customXhr
            });

            expect(file.xhrSettings.timeout).toBe(5000);
        });

        it('should read a custom extension from the config object', function ()
        {
            var loader = createMockLoader();
            var file = new GLSLFile(loader, {
                key: 'plasma',
                url: 'shaders/Plasma.frag',
                extension: 'frag'
            });

            // The URL was explicitly provided so it is used as-is (with path prepended)
            expect(file.url).toBe('shaders/Plasma.frag');
        });

        it('should prepend loader.prefix to the key when prefix is set', function ()
        {
            var loader = createMockLoader();
            loader.prefix = 'FX.';
            var file = new GLSLFile(loader, 'plasma', 'shaders/Plasma.glsl');

            expect(file.key).toBe('FX.plasma');
        });

        it('should start in the FILE_PENDING state', function ()
        {
            var loader = createMockLoader();
            var file = new GLSLFile(loader, 'plasma', 'shaders/Plasma.glsl');

            expect(file.state).toBe(CONST.FILE_PENDING);
        });

        it('should throw when no key is provided', function ()
        {
            var loader = createMockLoader();

            expect(function ()
            {
                new GLSLFile(loader, '', 'shaders/Plasma.glsl');
            }).toThrow();
        });
    });

    describe('onProcess', function ()
    {
        it('should set state to FILE_PROCESSING before calling onProcessComplete', function ()
        {
            var loader = createMockLoader();
            var file = new GLSLFile(loader, 'plasma', 'shaders/Plasma.glsl');
            var stateAtCallTime = null;

            file.xhrLoader = { responseText: 'void main() {}' };
            file.onProcessComplete = vi.fn(function ()
            {
                stateAtCallTime = file.state;
            });

            file.onProcess();

            expect(stateAtCallTime).toBe(CONST.FILE_PROCESSING);
        });

        it('should copy responseText into this.data', function ()
        {
            var loader = createMockLoader();
            var file = new GLSLFile(loader, 'plasma', 'shaders/Plasma.glsl');
            var src = 'precision mediump float; void main() { gl_FragColor = vec4(1.0); }';

            file.xhrLoader = { responseText: src };

            file.onProcess();

            expect(file.data).toBe(src);
        });

        it('should call onProcessComplete', function ()
        {
            var loader = createMockLoader();
            var file = new GLSLFile(loader, 'plasma', 'shaders/Plasma.glsl');

            file.xhrLoader = { responseText: 'void main() {}' };
            file.onProcessComplete = vi.fn();

            file.onProcess();

            expect(file.onProcessComplete).toHaveBeenCalledOnce();
        });

        it('should store an empty string when responseText is empty', function ()
        {
            var loader = createMockLoader();
            var file = new GLSLFile(loader, 'plasma', 'shaders/Plasma.glsl');

            file.xhrLoader = { responseText: '' };
            file.onProcessComplete = vi.fn();

            file.onProcess();

            expect(file.data).toBe('');
        });

        it('should store multi-line GLSL source verbatim', function ()
        {
            var loader = createMockLoader();
            var file = new GLSLFile(loader, 'plasma', 'shaders/Plasma.glsl');
            var src = 'uniform vec2 resolution;\nvoid main() {\n  gl_FragColor = vec4(1.0);\n}';

            file.xhrLoader = { responseText: src };
            file.onProcessComplete = vi.fn();

            file.onProcess();

            expect(file.data).toBe(src);
        });
    });

    describe('addToCache', function ()
    {
        it('should call cache.add with the file key and a Shader instance', function ()
        {
            var loader = createMockLoader();
            var file = new GLSLFile(loader, 'plasma', 'shaders/Plasma.glsl');
            var addedKey = null;
            var addedShader = null;

            file.cache = {
                add: function (key, shader)
                {
                    addedKey = key;
                    addedShader = shader;
                }
            };
            file.data = 'void main() {}';

            file.addToCache();

            expect(addedKey).toBe('plasma');
            expect(addedShader).not.toBeNull();
        });

        it('should pass the glsl source to the Shader instance', function ()
        {
            var loader = createMockLoader();
            var file = new GLSLFile(loader, 'plasma', 'shaders/Plasma.glsl');
            var src = 'precision mediump float; void main() { gl_FragColor = vec4(0.0); }';
            var addedShader = null;

            file.cache = {
                add: function (key, shader)
                {
                    addedShader = shader;
                }
            };
            file.data = src;

            file.addToCache();

            expect(addedShader.glsl).toBe(src);
        });

        it('should create a Shader with the file key', function ()
        {
            var loader = createMockLoader();
            var file = new GLSLFile(loader, 'plasma', 'shaders/Plasma.glsl');
            var addedShader = null;

            file.cache = {
                add: function (key, shader)
                {
                    addedShader = shader;
                }
            };
            file.data = 'void main() {}';

            file.addToCache();

            expect(addedShader.key).toBe('plasma');
        });

        it('should use the prefixed key when a prefix is set', function ()
        {
            var loader = createMockLoader();
            loader.prefix = 'FX.';
            var file = new GLSLFile(loader, 'plasma', 'shaders/Plasma.glsl');
            var addedKey = null;
            var addedShader = null;

            file.cache = {
                add: function (key, shader)
                {
                    addedKey = key;
                    addedShader = shader;
                }
            };
            file.data = 'void main() {}';

            file.addToCache();

            expect(addedKey).toBe('FX.plasma');
            expect(addedShader.key).toBe('FX.plasma');
        });
    });

    describe('glsl FileTypesManager registration', function ()
    {
        it('should register a glsl method on the loader via FileTypesManager.install', function ()
        {
            var loader = createMockLoader();
            loader.addFile = vi.fn();

            FileTypesManager.install(loader);

            expect(typeof loader.glsl).toBe('function');
        });

        it('should call addFile with a GLSLFile instance when invoked with a key and url', function ()
        {
            var loader = createMockLoader();
            loader.addFile = vi.fn();

            FileTypesManager.install(loader);
            loader.glsl('plasma', 'shaders/Plasma.glsl');

            expect(loader.addFile).toHaveBeenCalledOnce();
            var fileArg = loader.addFile.mock.calls[0][0];
            expect(fileArg).toBeInstanceOf(GLSLFile);
            expect(fileArg.key).toBe('plasma');
        });

        it('should call addFile for each entry when passed an array of config objects', function ()
        {
            var loader = createMockLoader();
            loader.addFile = vi.fn();

            FileTypesManager.install(loader);
            loader.glsl([
                { key: 'plasma', url: 'shaders/Plasma.glsl' },
                { key: 'fire', url: 'shaders/Fire.glsl' }
            ]);

            expect(loader.addFile).toHaveBeenCalledTimes(2);
        });

        it('should return the loader instance for chaining', function ()
        {
            var loader = createMockLoader();
            loader.addFile = vi.fn();

            FileTypesManager.install(loader);
            var result = loader.glsl('plasma', 'shaders/Plasma.glsl');

            expect(result).toBe(loader);
        });
    });
});
