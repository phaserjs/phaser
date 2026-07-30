var SceneFile = require('../../../src/loader/filetypes/SceneFile');
var CONST = require('../../../src/loader/const');

function createMockLoader ()
{
    return {
        prefix: '',
        path: '',
        fileProcessComplete: function () {},
        sceneManager: {
            add: vi.fn()
        }
    };
}

function createSceneFile (key, url, xhrSettings)
{
    var loader = createMockLoader();
    return new SceneFile(loader, key, url, xhrSettings);
}

describe('SceneFile', function ()
{
    describe('constructor', function ()
    {
        it('should create a SceneFile with string key and url', function ()
        {
            var file = createSceneFile('MyScene', 'scenes/MyScene.js');

            expect(file.key).toBe('MyScene');
            expect(file.type).toBe('text');
        });

        it('should default the url to key plus .js extension when url is not provided', function ()
        {
            var file = createSceneFile('MyScene');

            expect(file.url).toBe('MyScene.js');
        });

        it('should set the file type to text', function ()
        {
            var file = createSceneFile('MyScene', 'scenes/MyScene.js');

            expect(file.type).toBe('text');
        });

        it('should accept a plain object config instead of key string', function ()
        {
            var loader = createMockLoader();
            var file = new SceneFile(loader, {
                key: 'ConfigScene',
                url: 'scenes/ConfigScene.js'
            });

            expect(file.key).toBe('ConfigScene');
            expect(file.type).toBe('text');
        });

        it('should use default js extension from config object when extension is not provided', function ()
        {
            var loader = createMockLoader();
            var file = new SceneFile(loader, {
                key: 'MyScene'
            });

            expect(file.url).toBe('MyScene.js');
        });

        it('should use a custom extension from config object', function ()
        {
            var loader = createMockLoader();
            var file = new SceneFile(loader, {
                key: 'MyScene',
                extension: 'mjs'
            });

            expect(file.url).toBe('MyScene.mjs');
        });

        it('should set state to FILE_PENDING on creation', function ()
        {
            var file = createSceneFile('MyScene', 'scenes/MyScene.js');

            expect(file.state).toBe(CONST.FILE_PENDING);
        });

        it('should have complete as falsy on creation', function ()
        {
            var file = createSceneFile('MyScene', 'scenes/MyScene.js');

            expect(file.complete).toBeFalsy();
        });

        it('should apply loader prefix to key when prefix is set', function ()
        {
            var loader = createMockLoader();
            loader.prefix = 'LEVEL1.';
            var file = new SceneFile(loader, 'MyScene', 'scenes/MyScene.js');

            expect(file.key).toBe('LEVEL1.MyScene');
        });
    });

    describe('onProcess', function ()
    {
        it('should set state to FILE_PROCESSING', function ()
        {
            var file = createSceneFile('MyScene', 'scenes/MyScene.js');

            file.xhrLoader = { responseText: 'var x = 1;' };
            file.onProcessComplete = vi.fn();
            file.onProcess();

            expect(file.state).toBe(CONST.FILE_PROCESSING);
        });

        it('should copy responseText into data', function ()
        {
            var file = createSceneFile('MyScene', 'scenes/MyScene.js');
            var source = 'function MyScene() {}';

            file.xhrLoader = { responseText: source };
            file.onProcessComplete = vi.fn();
            file.onProcess();

            expect(file.data).toBe(source);
        });

        it('should call onProcessComplete after processing', function ()
        {
            var file = createSceneFile('MyScene', 'scenes/MyScene.js');
            var spy = vi.fn();

            file.xhrLoader = { responseText: 'var code = true;' };
            file.onProcessComplete = spy;
            file.onProcess();

            expect(spy).toHaveBeenCalledOnce();
        });

        it('should store empty string data when responseText is empty', function ()
        {
            var file = createSceneFile('MyScene', 'scenes/MyScene.js');

            file.xhrLoader = { responseText: '' };
            file.onProcessComplete = vi.fn();
            file.onProcess();

            expect(file.data).toBe('');
        });
    });

    describe('addToCache', function ()
    {
        it('should call sceneManager.add with the file key', function ()
        {
            var loader = createMockLoader();
            var file = new SceneFile(loader, 'TestSceneA', 'scenes/TestSceneA.js');

            file.data = 'function TestSceneA() { this.id = "TestSceneA"; }';
            file.addToCache();

            expect(loader.sceneManager.add).toHaveBeenCalledOnce();
            expect(loader.sceneManager.add.mock.calls[0][0]).toBe('TestSceneA');
        });

        it('should pass an instance of the evaluated class to sceneManager.add', function ()
        {
            var loader = createMockLoader();
            var file = new SceneFile(loader, 'TestSceneB', 'scenes/TestSceneB.js');

            file.data = 'function TestSceneB() { this.id = "TestSceneB"; }';
            file.addToCache();

            var passedInstance = loader.sceneManager.add.mock.calls[0][1];

            expect(passedInstance).toBeDefined();
            expect(passedInstance.id).toBe('TestSceneB');
        });

        it('should set complete to true after adding to cache', function ()
        {
            var loader = createMockLoader();
            var file = new SceneFile(loader, 'TestSceneC', 'scenes/TestSceneC.js');

            file.data = 'function TestSceneC() {}';
            file.addToCache();

            expect(file.complete).toBe(true);
        });

        it('should evaluate code that defines a class using ES6 class syntax', function ()
        {
            var loader = createMockLoader();
            var file = new SceneFile(loader, 'TestSceneD', 'scenes/TestSceneD.js');

            file.data = 'class TestSceneD { constructor() { this.type = "scene-d"; } }';
            file.addToCache();

            var passedInstance = loader.sceneManager.add.mock.calls[0][1];

            expect(passedInstance).toBeDefined();
            expect(passedInstance.type).toBe('scene-d');
        });

        it('should concatenate data with the instantiation wrapper before eval', function ()
        {
            var loader = createMockLoader();
            var file = new SceneFile(loader, 'TestSceneE', 'scenes/TestSceneE.js');
            var addSpy = loader.sceneManager.add;

            file.data = 'function TestSceneE() { this.value = 42; }';
            file.addToCache();

            expect(addSpy).toHaveBeenCalledWith('TestSceneE', expect.objectContaining({ value: 42 }));
        });
    });
});
