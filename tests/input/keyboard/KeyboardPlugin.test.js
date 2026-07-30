var KeyboardPlugin = require('../../../src/input/keyboard/KeyboardPlugin');
var KeyCodes = require('../../../src/input/keyboard/keys/KeyCodes');

function createMockSceneInputPlugin ()
{
    var captures = [];

    var keyboardManager = {
        captures: captures,
        addCapture: function (key) { captures.push(key); },
        removeCapture: function (key)
        {
            var idx = captures.indexOf(key);
            if (idx > -1) { captures.splice(idx, 1); }
        },
        clearCaptures: function () { captures.length = 0; },
        preventDefault: true
    };

    var inputManager = {
        keyboard: keyboardManager,
        events: {
            on: function () {},
            off: function () {}
        },
        time: 1000,
        queue: []
    };

    var scene = {
        sys: {
            settings: { input: {} },
            canInput: function () { return true; },
            events: {
                on: function () {},
                off: function () {}
            }
        }
    };

    var game = {
        events: {
            on: function () {},
            off: function () {}
        }
    };

    return {
        systems: { game: game },
        scene: scene,
        manager: inputManager,
        pluginEvents: {
            once: function () {},
            on: function () {}
        }
    };
}

describe('KeyboardPlugin', function ()
{
    var plugin;
    var mockSIP;

    beforeEach(function ()
    {
        mockSIP = createMockSceneInputPlugin();
        plugin = new KeyboardPlugin(mockSIP);
    });

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    describe('constructor', function ()
    {
        it('should set enabled to true by default', function ()
        {
            expect(plugin.enabled).toBe(true);
        });

        it('should initialise keys as an empty array', function ()
        {
            expect(Array.isArray(plugin.keys)).toBe(true);
            expect(plugin.keys.length).toBe(0);
        });

        it('should initialise combos as an empty array', function ()
        {
            expect(Array.isArray(plugin.combos)).toBe(true);
            expect(plugin.combos.length).toBe(0);
        });

        it('should store a reference to the scene', function ()
        {
            expect(plugin.scene).toBe(mockSIP.scene);
        });

        it('should store a reference to the keyboard manager', function ()
        {
            expect(plugin.manager).toBe(mockSIP.manager.keyboard);
        });

        it('should store a reference to the sceneInputPlugin', function ()
        {
            expect(plugin.sceneInputPlugin).toBe(mockSIP);
        });

        it('should set prevCode to null', function ()
        {
            expect(plugin.prevCode).toBeNull();
        });

        it('should set prevTime to 0', function ()
        {
            expect(plugin.prevTime).toBe(0);
        });

        it('should set prevType to null', function ()
        {
            expect(plugin.prevType).toBeNull();
        });
    });

    // -------------------------------------------------------------------------
    // isActive
    // -------------------------------------------------------------------------

    describe('isActive', function ()
    {
        it('should return true when enabled and scene can accept input', function ()
        {
            plugin.enabled = true;
            mockSIP.scene.sys.canInput = function () { return true; };
            expect(plugin.isActive()).toBe(true);
        });

        it('should return false when plugin is disabled', function ()
        {
            plugin.enabled = false;
            mockSIP.scene.sys.canInput = function () { return true; };
            expect(plugin.isActive()).toBe(false);
        });

        it('should return false when scene cannot accept input', function ()
        {
            plugin.enabled = true;
            mockSIP.scene.sys.canInput = function () { return false; };
            expect(plugin.isActive()).toBe(false);
        });

        it('should return false when both disabled and scene cannot input', function ()
        {
            plugin.enabled = false;
            mockSIP.scene.sys.canInput = function () { return false; };
            expect(plugin.isActive()).toBe(false);
        });
    });

    // -------------------------------------------------------------------------
    // addCapture / removeCapture / getCaptures / clearCaptures
    // -------------------------------------------------------------------------

    describe('addCapture', function ()
    {
        it('should delegate to manager.addCapture', function ()
        {
            plugin.addCapture(65);
            expect(plugin.manager.captures).toContain(65);
        });

        it('should return the plugin instance for chaining', function ()
        {
            expect(plugin.addCapture(65)).toBe(plugin);
        });
    });

    describe('removeCapture', function ()
    {
        it('should delegate to manager.removeCapture', function ()
        {
            plugin.manager.captures.push(65);
            plugin.removeCapture(65);
            expect(plugin.manager.captures).not.toContain(65);
        });

        it('should return the plugin instance for chaining', function ()
        {
            expect(plugin.removeCapture(65)).toBe(plugin);
        });
    });

    describe('getCaptures', function ()
    {
        it('should return the manager captures array', function ()
        {
            plugin.manager.captures.push(38);
            plugin.manager.captures.push(40);
            var result = plugin.getCaptures();
            expect(result).toBe(plugin.manager.captures);
            expect(result.length).toBe(2);
        });
    });

    describe('clearCaptures', function ()
    {
        it('should empty the captures array via the manager', function ()
        {
            plugin.manager.captures.push(65);
            plugin.manager.captures.push(66);
            plugin.clearCaptures();
            expect(plugin.manager.captures.length).toBe(0);
        });

        it('should return the plugin instance for chaining', function ()
        {
            expect(plugin.clearCaptures()).toBe(plugin);
        });
    });

    // -------------------------------------------------------------------------
    // enableGlobalCapture / disableGlobalCapture
    // -------------------------------------------------------------------------

    describe('enableGlobalCapture', function ()
    {
        it('should set manager.preventDefault to true', function ()
        {
            plugin.manager.preventDefault = false;
            plugin.enableGlobalCapture();
            expect(plugin.manager.preventDefault).toBe(true);
        });

        it('should return the plugin instance for chaining', function ()
        {
            expect(plugin.enableGlobalCapture()).toBe(plugin);
        });
    });

    describe('disableGlobalCapture', function ()
    {
        it('should set manager.preventDefault to false', function ()
        {
            plugin.manager.preventDefault = true;
            plugin.disableGlobalCapture();
            expect(plugin.manager.preventDefault).toBe(false);
        });

        it('should return the plugin instance for chaining', function ()
        {
            expect(plugin.disableGlobalCapture()).toBe(plugin);
        });
    });

    // -------------------------------------------------------------------------
    // addKey
    // -------------------------------------------------------------------------

    describe('addKey', function ()
    {
        it('should add a key by numeric key code', function ()
        {
            var key = plugin.addKey(KeyCodes.A);
            expect(key).toBeDefined();
            expect(key.keyCode).toBe(KeyCodes.A);
        });

        it('should add a key by string name', function ()
        {
            var key = plugin.addKey('A');
            expect(key).toBeDefined();
            expect(key.keyCode).toBe(KeyCodes.A);
        });

        it('should store the key in the keys array at the keyCode index', function ()
        {
            var key = plugin.addKey(KeyCodes.SPACE);
            expect(plugin.keys[KeyCodes.SPACE]).toBe(key);
        });

        it('should return the same key object on repeated calls with the same code', function ()
        {
            var key1 = plugin.addKey(KeyCodes.W);
            var key2 = plugin.addKey(KeyCodes.W);
            expect(key1).toBe(key2);
        });

        it('should call addCapture when enableCapture is true (default)', function ()
        {
            plugin.addKey(KeyCodes.UP);
            expect(plugin.manager.captures).toContain(KeyCodes.UP);
        });

        it('should not call addCapture when enableCapture is false', function ()
        {
            plugin.addKey(KeyCodes.DOWN, false);
            expect(plugin.manager.captures).not.toContain(KeyCodes.DOWN);
        });

        it('should set emitOnRepeat on the key', function ()
        {
            var key = plugin.addKey(KeyCodes.LEFT, true, true);
            expect(key.emitOnRepeat).toBe(true);
        });
    });

    // -------------------------------------------------------------------------
    // addKeys
    // -------------------------------------------------------------------------

    describe('addKeys', function ()
    {
        it('should return an object with keys mapped from a string', function ()
        {
            var result = plugin.addKeys('W,A,S,D');
            expect(result).toHaveProperty('W');
            expect(result).toHaveProperty('A');
            expect(result).toHaveProperty('S');
            expect(result).toHaveProperty('D');
        });

        it('should return Key objects for each entry in a string', function ()
        {
            var result = plugin.addKeys('W,S');
            expect(result.W.keyCode).toBe(KeyCodes.W);
            expect(result.S.keyCode).toBe(KeyCodes.S);
        });

        it('should return an object with keys mapped from an object', function ()
        {
            var result = plugin.addKeys({ up: KeyCodes.W, down: KeyCodes.S });
            expect(result).toHaveProperty('up');
            expect(result).toHaveProperty('down');
            expect(result.up.keyCode).toBe(KeyCodes.W);
            expect(result.down.keyCode).toBe(KeyCodes.S);
        });

        it('should ignore empty entries in a comma-separated string', function ()
        {
            var result = plugin.addKeys('W,,D');
            expect(result).toHaveProperty('W');
            expect(result).toHaveProperty('D');
            expect(Object.keys(result).length).toBe(2);
        });
    });

    // -------------------------------------------------------------------------
    // createCursorKeys
    // -------------------------------------------------------------------------

    describe('createCursorKeys', function ()
    {
        it('should return an object with up, down, left, right, space and shift keys', function ()
        {
            var cursors = plugin.createCursorKeys();
            expect(cursors).toHaveProperty('up');
            expect(cursors).toHaveProperty('down');
            expect(cursors).toHaveProperty('left');
            expect(cursors).toHaveProperty('right');
            expect(cursors).toHaveProperty('space');
            expect(cursors).toHaveProperty('shift');
        });

        it('should map cursor keys to the correct key codes', function ()
        {
            var cursors = plugin.createCursorKeys();
            expect(cursors.up.keyCode).toBe(KeyCodes.UP);
            expect(cursors.down.keyCode).toBe(KeyCodes.DOWN);
            expect(cursors.left.keyCode).toBe(KeyCodes.LEFT);
            expect(cursors.right.keyCode).toBe(KeyCodes.RIGHT);
            expect(cursors.space.keyCode).toBe(KeyCodes.SPACE);
            expect(cursors.shift.keyCode).toBe(KeyCodes.SHIFT);
        });
    });

    // -------------------------------------------------------------------------
    // removeKey
    // -------------------------------------------------------------------------

    describe('removeKey', function ()
    {
        it('should remove a key by numeric code and set the slot to undefined', function ()
        {
            plugin.addKey(KeyCodes.A);
            plugin.removeKey(KeyCodes.A);
            expect(plugin.keys[KeyCodes.A]).toBeUndefined();
        });

        it('should remove a key by string name', function ()
        {
            plugin.addKey('B');
            plugin.removeKey('B');
            expect(plugin.keys[KeyCodes.B]).toBeUndefined();
        });

        it('should set plugin reference on the removed key to null', function ()
        {
            var key = plugin.addKey(KeyCodes.C);
            plugin.removeKey(KeyCodes.C);
            expect(key.plugin).toBeNull();
        });

        it('should return the plugin instance for chaining', function ()
        {
            plugin.addKey(KeyCodes.D);
            expect(plugin.removeKey(KeyCodes.D)).toBe(plugin);
        });

        it('should remove the capture when removeCapture is true', function ()
        {
            plugin.addKey(KeyCodes.E, true);
            expect(plugin.manager.captures).toContain(KeyCodes.E);
            plugin.removeKey(KeyCodes.E, false, true);
            expect(plugin.manager.captures).not.toContain(KeyCodes.E);
        });
    });

    // -------------------------------------------------------------------------
    // removeAllKeys
    // -------------------------------------------------------------------------

    describe('removeAllKeys', function ()
    {
        it('should set all key slots to undefined', function ()
        {
            plugin.addKey(KeyCodes.A);
            plugin.addKey(KeyCodes.B);
            plugin.removeAllKeys();
            expect(plugin.keys[KeyCodes.A]).toBeUndefined();
            expect(plugin.keys[KeyCodes.B]).toBeUndefined();
        });

        it('should return the plugin instance for chaining', function ()
        {
            expect(plugin.removeAllKeys()).toBe(plugin);
        });

        it('should remove captures when removeCapture is true', function ()
        {
            plugin.addKey(KeyCodes.W, true);
            plugin.addKey(KeyCodes.S, true);
            plugin.removeAllKeys(false, true);
            expect(plugin.manager.captures).not.toContain(KeyCodes.W);
            expect(plugin.manager.captures).not.toContain(KeyCodes.S);
        });
    });

    // -------------------------------------------------------------------------
    // resetKeys
    // -------------------------------------------------------------------------

    describe('resetKeys', function ()
    {
        it('should reset all registered keys', function ()
        {
            var key = plugin.addKey(KeyCodes.A, false);
            key.isDown = true;
            key.isUp = false;
            plugin.resetKeys();
            expect(key.isDown).toBe(false);
            expect(key.isUp).toBe(true);
        });

        it('should return the plugin instance for chaining', function ()
        {
            expect(plugin.resetKeys()).toBe(plugin);
        });

        it('should handle a sparse keys array without throwing', function ()
        {
            plugin.addKey(KeyCodes.A, false);
            plugin.removeKey(KeyCodes.A);
            expect(function () { plugin.resetKeys(); }).not.toThrow();
        });
    });

    // -------------------------------------------------------------------------
    // checkDown
    // -------------------------------------------------------------------------

    describe('checkDown', function ()
    {
        it('should return false when the key is not down', function ()
        {
            var key = plugin.addKey(KeyCodes.A, false);
            key.isDown = false;
            expect(plugin.checkDown(key)).toBe(false);
        });

        it('should return false when the plugin is disabled', function ()
        {
            var key = plugin.addKey(KeyCodes.A, false);
            key.isDown = true;
            plugin.enabled = false;
            expect(plugin.checkDown(key)).toBe(false);
        });

        it('should return true on first call when key is down and duration is 0', function ()
        {
            var key = plugin.addKey(KeyCodes.A, false);
            key.isDown = true;
            key.timeDown = 0;
            mockSIP.manager.time = 1000;
            expect(plugin.checkDown(key, 0)).toBe(true);
        });

        it('should return true when elapsed time exceeds the duration threshold', function ()
        {
            var key = plugin.addKey(KeyCodes.A, false);
            key.isDown = true;
            key.timeDown = 0;
            mockSIP.manager.time = 500;
            expect(plugin.checkDown(key, 100)).toBe(true);
        });

        it('should return false on second call within the same tick interval', function ()
        {
            var key = plugin.addKey(KeyCodes.A, false);
            key.isDown = true;
            key.timeDown = 0;
            mockSIP.manager.time = 500;
            plugin.checkDown(key, 100);
            expect(plugin.checkDown(key, 100)).toBe(false);
        });

        it('should return true again after another tick interval has elapsed', function ()
        {
            var key = plugin.addKey(KeyCodes.A, false);
            key.isDown = true;
            key.timeDown = 0;
            mockSIP.manager.time = 100;
            plugin.checkDown(key, 100);
            mockSIP.manager.time = 200;
            expect(plugin.checkDown(key, 100)).toBe(true);
        });
    });

    // -------------------------------------------------------------------------
    // createCombo
    // -------------------------------------------------------------------------

    describe('createCombo', function ()
    {
        it('should return a KeyCombo object', function ()
        {
            var combo = plugin.createCombo('PHASER');
            expect(combo).toBeDefined();
            expect(typeof combo).toBe('object');
        });

        it('should create a combo that has a keyCodes property', function ()
        {
            var combo = plugin.createCombo([65, 66, 67]);
            expect(Array.isArray(combo.keyCodes)).toBe(true);
            expect(combo.keyCodes.length).toBe(3);
        });
    });
});
