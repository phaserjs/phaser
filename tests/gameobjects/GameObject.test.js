// Phaser's device detection modules (OS, Browser, Features, Input) access
// browser globals at require-time. Stub the minimum needed for Node.js.

if (typeof window === 'undefined')
{
    global.window = {
        cordova: undefined,
        ejecta: undefined,
        devicePixelRatio: 1,
        Worker: undefined,
        URL: undefined,
        webkitURL: undefined,
        mozURL: undefined,
        msURL: undefined,
        addEventListener: function () {}
    };
}

if (typeof navigator === 'undefined')
{
    global.navigator = {
        userAgent: '',
        appVersion: '',
        maxTouchPoints: 0,
        standalone: false,
        getUserMedia: undefined,
        webkitGetUserMedia: undefined,
        mozGetUserMedia: undefined,
        msGetUserMedia: undefined,
        oGetUserMedia: undefined,
        vibrate: undefined,
        msPointerEnabled: false,
        pointerEnabled: false,
        getGamepads: undefined
    };
}

if (typeof document === 'undefined')
{
    var mockCanvas = {
        getContext: function () { return null; },
        style: {}
    };

    global.document = {
        documentElement: {},
        pointerLockElement: undefined,
        mozPointerLockElement: undefined,
        webkitPointerLockElement: undefined,
        createElement: function (tag)
        {
            if (tag === 'canvas') { return mockCanvas; }

            return { style: {} };
        },
        addEventListener: function () {}
    };
}

var GameObject = require('../../src/gameobjects/GameObject');

function createMockScene ()
{
    return {
        sys: {
            queueDepthSort: function () {},
            displayList: {
                getIndex: function () { return 0; },
                exists: function () { return false; },
                add: function () {},
                remove: function () {},
                queueDepthSort: function () {},
                events: { emit: function () {} },
                active: true,
                willRender: function () { return true; },
                list: []
            },
            updateList: {
                add: function () {},
                remove: function () {}
            },
            input: {
                enable: function () {},
                disable: function () {},
                clear: function () {},
                resetCursor: function () {}
            }
        }
    };
}

function createGameObject (scene)
{
    if (!scene) { scene = createMockScene(); }

    return new GameObject(scene, 'test');
}

describe('Phaser.GameObjects.GameObject', function ()
{
    describe('constructor', function ()
    {
        it('should set the scene reference', function ()
        {
            var scene = createMockScene();
            var go = createGameObject(scene);

            expect(go.scene).toBe(scene);
        });

        it('should set the type', function ()
        {
            var go = createGameObject();

            expect(go.type).toBe('test');
        });

        it('should have default property values', function ()
        {
            var go = createGameObject();

            expect(go.active).toBe(true);
            expect(go.name).toBe('');
            expect(go.state).toBe(0);
            expect(go.tabIndex).toBe(-1);
            expect(go.data).toBeNull();
            expect(go.renderFlags).toBe(15);
            expect(go.cameraFilter).toBe(0);
            expect(go.input).toBeNull();
            expect(go.body).toBeNull();
            expect(go.displayList).toBeNull();
            expect(go.parentContainer).toBeNull();
            expect(go.ignoreDestroy).toBe(false);
            expect(go.isDestroyed).toBe(false);
            expect(go.vertexRoundMode).toBe('safeAuto');
        });
    });

    describe('setActive', function ()
    {
        it('should set active to true', function ()
        {
            var go = createGameObject();
            go.active = false;

            go.setActive(true);

            expect(go.active).toBe(true);
        });

        it('should set active to false', function ()
        {
            var go = createGameObject();

            go.setActive(false);

            expect(go.active).toBe(false);
        });

        it('should return the game object for chaining', function ()
        {
            var go = createGameObject();

            expect(go.setActive(true)).toBe(go);
        });
    });

    describe('setName', function ()
    {
        it('should set the name', function ()
        {
            var go = createGameObject();

            go.setName('hero');

            expect(go.name).toBe('hero');
        });

        it('should return the game object for chaining', function ()
        {
            var go = createGameObject();

            expect(go.setName('test')).toBe(go);
        });
    });

    describe('setState', function ()
    {
        it('should set the state to a number', function ()
        {
            var go = createGameObject();

            go.setState(3);

            expect(go.state).toBe(3);
        });

        it('should set the state to a string', function ()
        {
            var go = createGameObject();

            go.setState('moving');

            expect(go.state).toBe('moving');
        });

        it('should return the game object for chaining', function ()
        {
            var go = createGameObject();

            expect(go.setState(1)).toBe(go);
        });
    });

    describe('setDataEnabled', function ()
    {
        it('should create a DataManager when called', function ()
        {
            var go = createGameObject();

            expect(go.data).toBeNull();

            go.setDataEnabled();

            expect(go.data).not.toBeNull();
        });

        it('should not replace the DataManager if already created', function ()
        {
            var go = createGameObject();

            go.setDataEnabled();

            var firstManager = go.data;

            go.setDataEnabled();

            expect(go.data).toBe(firstManager);
        });

        it('should return the game object for chaining', function ()
        {
            var go = createGameObject();

            expect(go.setDataEnabled()).toBe(go);
        });
    });

    describe('setData / getData', function ()
    {
        it('should store and retrieve a value by key', function ()
        {
            var go = createGameObject();

            go.setData('gold', 100);

            expect(go.getData('gold')).toBe(100);
        });

        it('should auto-create the DataManager on first setData call', function ()
        {
            var go = createGameObject();

            expect(go.data).toBeNull();

            go.setData('key', 'value');

            expect(go.data).not.toBeNull();
        });

        it('should auto-create the DataManager on first getData call', function ()
        {
            var go = createGameObject();

            expect(go.data).toBeNull();

            go.getData('key');

            expect(go.data).not.toBeNull();
        });

        it('should overwrite an existing value', function ()
        {
            var go = createGameObject();

            go.setData('hp', 100);
            go.setData('hp', 50);

            expect(go.getData('hp')).toBe(50);
        });

        it('should accept an object of key-value pairs', function ()
        {
            var go = createGameObject();

            go.setData({ name: 'Link', level: 5 });

            expect(go.getData('name')).toBe('Link');
            expect(go.getData('level')).toBe(5);
        });

        it('should return the game object for chaining', function ()
        {
            var go = createGameObject();

            expect(go.setData('x', 1)).toBe(go);
        });
    });

    describe('incData', function ()
    {
        it('should increment an existing value', function ()
        {
            var go = createGameObject();

            go.setData('score', 10);
            go.incData('score', 5);

            expect(go.getData('score')).toBe(15);
        });

        it('should create the key with 0 then increment if it does not exist', function ()
        {
            var go = createGameObject();

            go.incData('score', 3);

            expect(go.getData('score')).toBe(3);
        });

        it('should return the game object for chaining', function ()
        {
            var go = createGameObject();

            expect(go.incData('score', 1)).toBe(go);
        });
    });

    describe('toggleData', function ()
    {
        it('should create a false key and toggle it to true', function ()
        {
            var go = createGameObject();

            go.toggleData('enabled');

            expect(go.getData('enabled')).toBe(true);
        });

        it('should toggle true to false', function ()
        {
            var go = createGameObject();

            go.setData('enabled', true);
            go.toggleData('enabled');

            expect(go.getData('enabled')).toBe(false);
        });

        it('should return the game object for chaining', function ()
        {
            var go = createGameObject();

            expect(go.toggleData('flag')).toBe(go);
        });
    });

    describe('willRender', function ()
    {
        it('should return true when renderFlags match RENDER_MASK and no camera filter', function ()
        {
            var go = createGameObject();
            var camera = { id: 1, roundPixels: false };

            expect(go.willRender(camera)).toBe(true);
        });

        it('should return false when renderFlags do not match RENDER_MASK', function ()
        {
            var go = createGameObject();
            var camera = { id: 1, roundPixels: false };

            go.renderFlags = 0;

            expect(go.willRender(camera)).toBe(false);
        });

        it('should return false when camera is in the filter list', function ()
        {
            var go = createGameObject();
            var camera = { id: 2, roundPixels: false };

            go.cameraFilter = 2;

            expect(go.willRender(camera)).toBe(false);
        });

        it('should still render when display list is inactive (defaults to true)', function ()
        {
            var go = createGameObject();
            var camera = { id: 1, roundPixels: false };

            go.displayList = { active: false, willRender: function () { return false; } };

            expect(go.willRender(camera)).toBe(true);
        });
    });

    describe('willRoundVertices', function ()
    {
        it('should return false for mode "off"', function ()
        {
            var go = createGameObject();
            var camera = { roundPixels: true };

            go.setVertexRoundMode('off');

            expect(go.willRoundVertices(camera, true)).toBe(false);
        });

        it('should return onlyTranslated for mode "safe"', function ()
        {
            var go = createGameObject();
            var camera = { roundPixels: false };

            go.setVertexRoundMode('safe');

            expect(go.willRoundVertices(camera, true)).toBe(true);
            expect(go.willRoundVertices(camera, false)).toBe(false);
        });

        it('should return onlyTranslated && camera.roundPixels for mode "safeAuto"', function ()
        {
            var go = createGameObject();

            go.setVertexRoundMode('safeAuto');

            expect(go.willRoundVertices({ roundPixels: true }, true)).toBe(true);
            expect(go.willRoundVertices({ roundPixels: false }, true)).toBe(false);
            expect(go.willRoundVertices({ roundPixels: true }, false)).toBe(false);
        });

        it('should always return true for mode "full"', function ()
        {
            var go = createGameObject();
            var camera = { roundPixels: false };

            go.setVertexRoundMode('full');

            expect(go.willRoundVertices(camera, false)).toBe(true);
            expect(go.willRoundVertices(camera, true)).toBe(true);
        });

        it('should return camera.roundPixels for mode "fullAuto"', function ()
        {
            var go = createGameObject();

            go.setVertexRoundMode('fullAuto');

            expect(go.willRoundVertices({ roundPixels: true }, false)).toBe(true);
            expect(go.willRoundVertices({ roundPixels: false }, true)).toBe(false);
        });

        it('should default to false for unknown modes', function ()
        {
            var go = createGameObject();
            var camera = { roundPixels: true };

            go.setVertexRoundMode('unknown');

            expect(go.willRoundVertices(camera, true)).toBe(false);
        });
    });

    describe('setVertexRoundMode', function ()
    {
        it('should set the vertexRoundMode', function ()
        {
            var go = createGameObject();

            go.setVertexRoundMode('full');

            expect(go.vertexRoundMode).toBe('full');
        });

        it('should return the game object for chaining', function ()
        {
            var go = createGameObject();

            expect(go.setVertexRoundMode('off')).toBe(go);
        });
    });

    describe('getDisplayList', function ()
    {
        it('should return null when not in a display list or container', function ()
        {
            var go = createGameObject();

            expect(go.getDisplayList()).toBeNull();
        });

        it('should return the displayList.list when on a display list', function ()
        {
            var go = createGameObject();
            var list = [go];

            go.displayList = { list: list };

            expect(go.getDisplayList()).toBe(list);
        });

        it('should return the parentContainer.list when in a container', function ()
        {
            var go = createGameObject();
            var containerList = [go];

            go.parentContainer = { list: containerList };

            expect(go.getDisplayList()).toBe(containerList);
        });

        it('should prefer parentContainer over displayList', function ()
        {
            var go = createGameObject();
            var containerList = [];
            var displayListArray = [];

            go.parentContainer = { list: containerList };
            go.displayList = { list: displayListArray };

            expect(go.getDisplayList()).toBe(containerList);
        });
    });

    describe('destroy', function ()
    {
        it('should set isDestroyed to true', function ()
        {
            var go = createGameObject();

            go.destroy();

            expect(go.isDestroyed).toBe(true);
        });

        it('should set scene to undefined', function ()
        {
            var go = createGameObject();

            go.destroy();

            expect(go.scene).toBeUndefined();
        });

        it('should set active to false', function ()
        {
            var go = createGameObject();

            go.destroy();

            expect(go.active).toBe(false);
        });

        it('should not destroy if ignoreDestroy is true', function ()
        {
            var go = createGameObject();

            go.ignoreDestroy = true;
            go.destroy();

            expect(go.isDestroyed).toBe(false);
            expect(go.scene).not.toBeUndefined();
        });

        it('should destroy the DataManager if one exists', function ()
        {
            var go = createGameObject();

            go.setData('key', 'value');

            var destroyed = false;
            var originalDestroy = go.data.destroy.bind(go.data);

            go.data.destroy = function ()
            {
                destroyed = true;
                originalDestroy();
            };

            go.destroy();

            expect(destroyed).toBe(true);
            expect(go.data).toBeUndefined();
        });

        it('should do nothing if already destroyed (no scene)', function ()
        {
            var go = createGameObject();

            go.destroy();

            // Should not throw when called a second time
            expect(function () { go.destroy(); }).not.toThrow();
        });
    });

    describe('RENDER_MASK', function ()
    {
        it('should equal 15', function ()
        {
            expect(GameObject.RENDER_MASK).toBe(15);
        });
    });
});
