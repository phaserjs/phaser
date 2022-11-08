/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var EventEmitter = require('eventemitter3');
var Events = require('./events');
var GameEvents = require('../../core/events');
var GetValue = require('../../utils/object/GetValue');
var InputEvents = require('../events');
var InputPluginCache = require('../InputPluginCache');
var Key = require('./keys/Key');
var KeyCodes = require('./keys/KeyCodes');
var KeyCombo = require('./combo/KeyCombo');
var KeyMap = require('./keys/KeyMap');
var SceneEvents = require('../../scene/events');
var SnapFloor = require('../../math/snap/SnapFloor');

/**
 * @classdesc
 * The Keyboard Plugin is an input plugin that belongs to the Scene-owned Input system.
 *
 * Its role is to listen for native DOM Keyboard Events and then process them.
 *
 * You do not need to create this class directly, the Input system will create an instance of it automatically.
 *
 * You can access it from within a Scene using `this.input.keyboard`. For example, you can do:
 *
 * ```javascript
 * this.input.keyboard.on('keydown', callback, context);
 * ```
 *
 * Or, to listen for a specific key:
 *
 * ```javascript
 * this.input.keyboard.on('keydown-A', callback, context);
 * ```
 *
 * You can also create Key objects, which you can then poll in your game loop:
 *
 * ```javascript
 * var spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
 * ```
 *
 * If you have multiple parallel Scenes, each trying to get keyboard input, be sure to disable capture on them to stop them from
 * stealing input from another Scene in the list. You can do this with `this.input.keyboard.enabled = false` within the
 * Scene to stop all input, or `this.input.keyboard.preventDefault = false` to stop a Scene halting input on another Scene.
 *
 * _Note_: Many keyboards are unable to process certain combinations of keys due to hardware limitations known as ghosting.
 * See http://www.html5gamedevs.com/topic/4876-impossible-to-use-more-than-2-keyboard-input-buttons-at-the-same-time/ for more details
 * and use the site https://w3c.github.io/uievents/tools/key-event-viewer.html to test your n-key support in browser.
 *
 * Also please be aware that certain browser extensions can disable or override Phaser keyboard handling.
 * For example the Chrome extension vimium is known to disable Phaser from using the D key, while EverNote disables the backtick key.
 * And there are others. So, please check your extensions before opening Phaser issues about keys that don't work.
 *
 * @class KeyboardPlugin
 * @extends Phaser.Events.EventEmitter
 * @memberof Phaser.Input.Keyboard
 * @constructor
 * @since 3.10.0
 *
 * @param {Phaser.Input.InputPlugin} sceneInputPlugin - A reference to the Scene Input Plugin that the KeyboardPlugin belongs to.
 */
var KeyboardPlugin = new Class({

    Extends: EventEmitter,

    initialize:

    function KeyboardPlugin (sceneInputPlugin)
    {
        EventEmitter.call(this);

        /**
         * A reference to the core game, so we can listen for visibility events.
         *
         * @name Phaser.Input.Keyboard.KeyboardPlugin#game
         * @type {Phaser.Game}
         * @since 3.16.0
         */
        this.game = sceneInputPlugin.systems.game;

        /**
         * A reference to the Scene that this Input Plugin is responsible for.
         *
         * @name Phaser.Input.Keyboard.KeyboardPlugin#scene
         * @type {Phaser.Scene}
         * @since 3.10.0
         */
        this.scene = sceneInputPlugin.scene;

        /**
         * A reference to the Scene Systems Settings.
         *
         * @name Phaser.Input.Keyboard.KeyboardPlugin#settings
         * @type {Phaser.Types.Scenes.SettingsObject}
         * @since 3.10.0
         */
        this.settings = this.scene.sys.settings;

        /**
         * A reference to the Scene Input Plugin that created this Keyboard Plugin.
         *
         * @name Phaser.Input.Keyboard.KeyboardPlugin#sceneInputPlugin
         * @type {Phaser.Input.InputPlugin}
         * @since 3.10.0
         */
        this.sceneInputPlugin = sceneInputPlugin;

        /**
         * A reference to the global Keyboard Manager.
         *
         * @name Phaser.Input.Keyboard.KeyboardPlugin#manager
         * @type {Phaser.Input.Keyboard.KeyboardManager}
         * @since 3.16.0
         */
        this.manager = sceneInputPlugin.manager.keyboard;

        /**
         * A boolean that controls if this Keyboard Plugin is enabled or not.
         * Can be toggled on the fly.
         *
         * @name Phaser.Input.Keyboard.KeyboardPlugin#enabled
         * @type {boolean}
         * @default true
         * @since 3.10.0
         */
        this.enabled = true;

        /**
         * An array of Key objects to process.
         *
         * @name Phaser.Input.Keyboard.KeyboardPlugin#keys
         * @type {Phaser.Input.Keyboard.Key[]}
         * @since 3.10.0
         */
        this.keys = [];

        /**
         * An array of KeyCombo objects to process.
         *
         * @name Phaser.Input.Keyboard.KeyboardPlugin#combos
         * @type {Phaser.Input.Keyboard.KeyCombo[]}
         * @since 3.10.0
         */
        this.combos = [];

        /**
         * Internal repeat key flag.
         *
         * @name Phaser.Input.Keyboard.KeyboardPlugin#prevCode
         * @type {string}
         * @private
         * @since 3.50.0
         */
        this.prevCode = null;

        /**
         * Internal repeat key flag.
         *
         * @name Phaser.Input.Keyboard.KeyboardPlugin#prevTime
         * @type {number}
         * @private
         * @since 3.50.0
         */
        this.prevTime = 0;

        /**
         * Internal repeat key flag.
         *
         * @name Phaser.Input.Keyboard.KeyboardPlugin#prevType
         * @type {string}
         * @private
         * @since 3.50.1
         */
        this.prevType = null;

        sceneInputPlugin.pluginEvents.once(InputEvents.BOOT, this.boot, this);
        sceneInputPlugin.pluginEvents.on(InputEvents.START, this.start, this);
    },

    /**
     * This method is called automatically, only once, when the Scene is first created.
     * Do not invoke it directly.
     *
     * @method Phaser.Input.Keyboard.KeyboardPlugin#boot
     * @private
     * @since 3.10.0
     */
    boot: function ()
    {
        var settings = this.settings.input;

        this.enabled = GetValue(settings, 'keyboard', true);

        var captures = GetValue(settings, 'keyboard.capture', null);

        if (captures)
        {
            this.addCaptures(captures);
        }

        this.sceneInputPlugin.pluginEvents.once(InputEvents.DESTROY, this.destroy, this);
    },

    /**
     * This method is called automatically by the Scene when it is starting up.
     * It is responsible for creating local systems, properties and listening for Scene events.
     * Do not invoke it directly.
     *
     * @method Phaser.Input.Keyboard.KeyboardPlugin#start
     * @private
     * @since 3.10.0
     */
    start: function ()
    {
        this.sceneInputPlugin.manager.events.on(InputEvents.MANAGER_PROCESS, this.update, this);

        this.sceneInputPlugin.pluginEvents.once(InputEvents.SHUTDOWN, this.shutdown, this);

        this.game.events.on(GameEvents.BLUR, this.resetKeys, this);

        this.scene.sys.events.on(SceneEvents.PAUSE, this.resetKeys, this);
        this.scene.sys.events.on(SceneEvents.SLEEP, this.resetKeys, this);
    },

    /**
     * Checks to see if both this plugin and the Scene to which it belongs is active.
     *
     * @method Phaser.Input.Keyboard.KeyboardPlugin#isActive
     * @since 3.10.0
     *
     * @return {boolean} `true` if the plugin and the Scene it belongs to is active.
     */
    isActive: function ()
    {
        return (this.enabled && this.scene.sys.canInput());
    },

    /**
     * By default when a key is pressed Phaser will not stop the event from propagating up to the browser.
     * There are some keys this can be annoying for, like the arrow keys or space bar, which make the browser window scroll.
     *
     * This `addCapture` method enables consuming keyboard events for specific keys, so they don't bubble up the browser
     * and cause the default behaviors.
     *
     * Please note that keyboard captures are global. This means that if you call this method from within a Scene, to say prevent
     * the SPACE BAR from triggering a page scroll, then it will prevent it for any Scene in your game, not just the calling one.
     *
     * You can pass a single key code value:
     *
     * ```javascript
     * this.input.keyboard.addCapture(62);
     * ```
     *
     * An array of key codes:
     *
     * ```javascript
     * this.input.keyboard.addCapture([ 62, 63, 64 ]);
     * ```
     *
     * Or, a comma-delimited string:
     *
     * ```javascript
     * this.input.keyboard.addCapture('W,S,A,D');
     * ```
     *
     * To use non-alpha numeric keys, use a string, such as 'UP', 'SPACE' or 'LEFT'.
     *
     * You can also provide an array mixing both strings and key code integers.
     *
     * @method Phaser.Input.Keyboard.KeyboardPlugin#addCapture
     * @since 3.16.0
     *
     * @param {(string|number|number[]|any[])} keycode - The Key Codes to enable event capture for.
     *
     * @return {this} This KeyboardPlugin object.
     */
    addCapture: function (keycode)
    {
        this.manager.addCapture(keycode);

        return this;
    },

    /**
     * Removes an existing key capture.
     *
     * Please note that keyboard captures are global. This means that if you call this method from within a Scene, to remove
     * the capture of a key, then it will remove it for any Scene in your game, not just the calling one.
     *
     * You can pass a single key code value:
     *
     * ```javascript
     * this.input.keyboard.removeCapture(62);
     * ```
     *
     * An array of key codes:
     *
     * ```javascript
     * this.input.keyboard.removeCapture([ 62, 63, 64 ]);
     * ```
     *
     * Or, a comma-delimited string:
     *
     * ```javascript
     * this.input.keyboard.removeCapture('W,S,A,D');
     * ```
     *
     * To use non-alpha numeric keys, use a string, such as 'UP', 'SPACE' or 'LEFT'.
     *
     * You can also provide an array mixing both strings and key code integers.
     *
     * @method Phaser.Input.Keyboard.KeyboardPlugin#removeCapture
     * @since 3.16.0
     *
     * @param {(string|number|number[]|any[])} keycode - The Key Codes to disable event capture for.
     *
     * @return {this} This KeyboardPlugin object.
     */
    removeCapture: function (keycode)
    {
        this.manager.removeCapture(keycode);

        return this;
    },

    /**
     * Returns an array that contains all of the keyboard captures currently enabled.
     *
     * @method Phaser.Input.Keyboard.KeyboardPlugin#getCaptures
     * @since 3.16.0
     *
     * @return {number[]} An array of all the currently capturing key codes.
     */
    getCaptures: function ()
    {
        return this.manager.captures;
    },

    /**
     * Allows Phaser to prevent any key captures you may have defined from bubbling up the browser.
     * You can use this to re-enable event capturing if you had paused it via `disableGlobalCapture`.
     *
     * @method Phaser.Input.Keyboard.KeyboardPlugin#enableGlobalCapture
     * @since 3.16.0
     *
     * @return {this} This KeyboardPlugin object.
     */
    enableGlobalCapture: function ()
    {
        this.manager.preventDefault = true;

        return this;
    },

    /**
     * Disables Phaser from preventing any key captures you may have defined, without actually removing them.
     * You can use this to temporarily disable event capturing if, for example, you swap to a DOM element.
     *
     * @method Phaser.Input.Keyboard.KeyboardPlugin#disableGlobalCapture
     * @since 3.16.0
     *
     * @return {this} This KeyboardPlugin object.
     */
    disableGlobalCapture: function ()
    {
        this.manager.preventDefault = false;

        return this;
    },

    /**
     * Removes all keyboard captures.
     *
     * Note that this is a global change. It will clear all event captures across your game, not just for this specific Scene.
     *
     * @method Phaser.Input.Keyboard.KeyboardPlugin#clearCaptures
     * @since 3.16.0
     *
     * @return {this} This KeyboardPlugin object.
     */
    clearCaptures: function ()
    {
        this.manager.clearCaptures();

        return this;
    },

    /**
     * Creates and returns an object containing 4 hotkeys for Up, Down, Left and Right, and also Space Bar and shift.
     *
     * @method Phaser.Input.Keyboard.KeyboardPlugin#createCursorKeys
     * @since 3.10.0
     *
     * @return {Phaser.Types.Input.Keyboard.CursorKeys} An object containing the properties: `up`, `down`, `left`, `right`, `space` and `shift`.
     */
    createCursorKeys: function ()
    {
        return this.addKeys({
            up: KeyCodes.UP,
            down: KeyCodes.DOWN,
            left: KeyCodes.LEFT,
            right: KeyCodes.RIGHT,
            space: KeyCodes.SPACE,
            shift: KeyCodes.SHIFT
        });
    },

    /**
     * A practical way to create an object containing user selected hotkeys.
     *
     * For example:
     *
     * ```javascript
     * this.input.keyboard.addKeys({ 'up': Phaser.Input.Keyboard.KeyCodes.W, 'down': Phaser.Input.Keyboard.KeyCodes.S });
     * ```
     *
     * would return an object containing the properties (`up` and `down`) mapped to W and S {@link Phaser.Input.Keyboard.Key} objects.
     *
     * You can also pass in a comma-separated string:
     *
     * ```javascript
     * this.input.keyboard.addKeys('W,S,A,D');
     * ```
     *
     * Which will return an object with the properties W, S, A and D mapped to the relevant Key objects.
     *
     * To use non-alpha numeric keys, use a string, such as 'UP', 'SPACE' or 'LEFT'.
     *
     * @method Phaser.Input.Keyboard.KeyboardPlugin#addKeys
     * @since 3.10.0
     *
     * @param {(object|string)} keys - An object containing Key Codes, or a comma-separated string.
     * @param {boolean} [enableCapture=true] - Automatically call `preventDefault` on the native DOM browser event for the key codes being added.
     * @param {boolean} [emitOnRepeat=false] - Controls if the Key will continuously emit a 'down' event while being held down (true), or emit the event just once (false, the default).
     *
     * @return {object} An object containing Key objects mapped to the input properties.
     */
    addKeys: function (keys, enableCapture, emitOnRepeat)
    {
        if (enableCapture === undefined) { enableCapture = true; }
        if (emitOnRepeat === undefined) { emitOnRepeat = false; }

        var output = {};

        if (typeof keys === 'string')
        {
            keys = keys.split(',');

            for (var i = 0; i < keys.length; i++)
            {
                var currentKey = keys[i].trim();

                if (currentKey)
                {
                    output[currentKey] = this.addKey(currentKey, enableCapture, emitOnRepeat);
                }
            }
        }
        else
        {
            for (var key in keys)
            {
                output[key] = this.addKey(keys[key], enableCapture, emitOnRepeat);
            }
        }

        return output;
    },

    /**
     * Adds a Key object to this Keyboard Plugin.
     *
     * The given argument can be either an existing Key object, a string, such as `A` or `SPACE`, or a key code value.
     *
     * If a Key object is given, and one already exists matching the same key code, the existing one is replaced with the new one.
     *
     * @method Phaser.Input.Keyboard.KeyboardPlugin#addKey
     * @since 3.10.0
     *
     * @param {(Phaser.Input.Keyboard.Key|string|number)} key - Either a Key object, a string, such as `A` or `SPACE`, or a key code value.
     * @param {boolean} [enableCapture=true] - Automatically call `preventDefault` on the native DOM browser event for the key codes being added.
     * @param {boolean} [emitOnRepeat=false] - Controls if the Key will continuously emit a 'down' event while being held down (true), or emit the event just once (false, the default).
     *
     * @return {Phaser.Input.Keyboard.Key} The newly created Key object, or a reference to it if it already existed in the keys array.
     */
    addKey: function (key, enableCapture, emitOnRepeat)
    {
        if (enableCapture === undefined) { enableCapture = true; }
        if (emitOnRepeat === undefined) { emitOnRepeat = false; }

        var keys = this.keys;

        if (key instanceof Key)
        {
            var idx = keys.indexOf(key);

            if (idx > -1)
            {
                keys[idx] = key;
            }
            else
            {
                keys[key.keyCode] = key;
            }

            if (enableCapture)
            {
                this.addCapture(key.keyCode);
            }

            key.setEmitOnRepeat(emitOnRepeat);

            return key;
        }

        if (typeof key === 'string')
        {
            key = KeyCodes[key.toUpperCase()];
        }

        if (!keys[key])
        {
            keys[key] = new Key(this, key);

            if (enableCapture)
            {
                this.addCapture(key);
            }

            keys[key].setEmitOnRepeat(emitOnRepeat);
        }

        return keys[key];
    },

    /**
     * Removes a Key object from this Keyboard Plugin.
     *
     * The given argument can be either a Key object, a string, such as `A` or `SPACE`, or a key code value.
     *
     * @method Phaser.Input.Keyboard.KeyboardPlugin#removeKey
     * @since 3.10.0
     *
     * @param {(Phaser.Input.Keyboard.Key|string|number)} key - Either a Key object, a string, such as `A` or `SPACE`, or a key code value.
     * @param {boolean} [destroy=false] - Call `Key.destroy` on the removed Key object?
     * @param {boolean} [removeCapture=false] - Remove this Key from being captured? Only applies if set to capture when created.
     *
     * @return {this} This KeyboardPlugin object.
     */
    removeKey: function (key, destroy, removeCapture)
    {
        if (destroy === undefined) { destroy = false; }
        if (removeCapture === undefined) { removeCapture = false; }

        var keys = this.keys;
        var ref;

        if (key instanceof Key)
        {
            var idx = keys.indexOf(key);

            if (idx > -1)
            {
                ref = this.keys[idx];

                this.keys[idx] = undefined;
            }
        }
        else if (typeof key === 'string')
        {
            key = KeyCodes[key.toUpperCase()];
        }

        if (keys[key])
        {
            ref = keys[key];

            keys[key] = undefined;
        }

        if (ref)
        {
            ref.plugin = null;

            if (removeCapture)
            {
                this.removeCapture(ref.keyCode);
            }

            if (destroy)
            {
                ref.destroy();
            }
        }

        return this;
    },

    /**
     * Removes all Key objects created by _this_ Keyboard Plugin.
     *
     * @method Phaser.Input.Keyboard.KeyboardPlugin#removeAllKeys
     * @since 3.24.0
     *
     * @param {boolean} [destroy=false] - Call `Key.destroy` on each removed Key object?
     * @param {boolean} [removeCapture=false] - Remove all key captures for Key objects owened by this plugin?
     *
     * @return {this} This KeyboardPlugin object.
     */
    removeAllKeys: function (destroy, removeCapture)
    {
        if (destroy === undefined) { destroy = false; }
        if (removeCapture === undefined) { removeCapture = false; }

        var keys = this.keys;

        for (var i = 0; i < keys.length; i++)
        {
            var key = keys[i];

            if (key)
            {
                keys[i] = undefined;

                if (removeCapture)
                {
                    this.removeCapture(key.keyCode);
                }

                if (destroy)
                {
                    key.destroy();
                }
            }
        }

        return this;
    },

    /**
     * Creates a new KeyCombo.
     *
     * A KeyCombo will listen for a specific string of keys from the Keyboard, and when it receives them
     * it will emit a `keycombomatch` event from this Keyboard Plugin.
     *
     * The keys to be listened for can be defined as:
     *
     * A string (i.e. 'ATARI')
     * An array of either integers (key codes) or strings, or a mixture of both
     * An array of objects (such as Key objects) with a public 'keyCode' property
     *
     * For example, to listen for the Konami code (up, up, down, down, left, right, left, right, b, a, enter)
     * you could pass the following array of key codes:
     *
     * ```javascript
     * this.input.keyboard.createCombo([ 38, 38, 40, 40, 37, 39, 37, 39, 66, 65, 13 ], { resetOnMatch: true });
     *
     * this.input.keyboard.on('keycombomatch', function (event) {
     *     console.log('Konami Code entered!');
     * });
     * ```
     *
     * Or, to listen for the user entering the word PHASER:
     *
     * ```javascript
     * this.input.keyboard.createCombo('PHASER');
     * ```
     *
     * @method Phaser.Input.Keyboard.KeyboardPlugin#createCombo
     * @since 3.10.0
     *
     * @param {(string|number[]|object[])} keys - The keys that comprise this combo.
     * @param {Phaser.Types.Input.Keyboard.KeyComboConfig} [config] - A Key Combo configuration object.
     *
     * @return {Phaser.Input.Keyboard.KeyCombo} The new KeyCombo object.
     */
    createCombo: function (keys, config)
    {
        return new KeyCombo(this, keys, config);
    },

    /**
     * Checks if the given Key object is currently being held down.
     *
     * The difference between this method and checking the `Key.isDown` property directly is that you can provide
     * a duration to this method. For example, if you wanted a key press to fire a bullet, but you only wanted
     * it to be able to fire every 100ms, then you can call this method with a `duration` of 100 and it
     * will only return `true` every 100ms.
     *
     * If the Keyboard Plugin has been disabled, this method will always return `false`.
     *
     * @method Phaser.Input.Keyboard.KeyboardPlugin#checkDown
     * @since 3.11.0
     *
     * @param {Phaser.Input.Keyboard.Key} key - A Key object.
     * @param {number} [duration=0] - The duration which must have elapsed before this Key is considered as being down.
     *
     * @return {boolean} `true` if the Key is down within the duration specified, otherwise `false`.
     */
    checkDown: function (key, duration)
    {
        if (duration === undefined) { duration = 0; }

        if (this.enabled && key.isDown)
        {
            var t = SnapFloor(this.time - key.timeDown, duration);

            if (t > key._tick)
            {
                key._tick = t;

                return true;
            }
        }

        return false;
    },

    /**
     * Internal update handler called by the Input Plugin, which is in turn invoked by the Game step.
     *
     * @method Phaser.Input.Keyboard.KeyboardPlugin#update
     * @private
     * @since 3.10.0
     */
    update: function ()
    {
        var queue = this.manager.queue;
        var len = queue.length;

        if (!this.isActive() || len === 0)
        {
            return;
        }

        var keys = this.keys;

        //  Process the event queue, dispatching all of the events that have stored up
        for (var i = 0; i < len; i++)
        {
            var event = queue[i];
            var code = event.keyCode;
            var key = keys[code];
            var repeat = false;

            //  Override the default functions (it's too late for the browser to use them anyway, so we may as well)
            if (event.cancelled === undefined)
            {
                //  Event allowed to flow across all handlers in this Scene, and any other Scene in the Scene list
                event.cancelled = 0;

                //  Won't reach any more local (Scene level) handlers
                event.stopImmediatePropagation = function ()
                {
                    event.cancelled = 1;
                };

                //  Won't reach any more handlers in any Scene further down the Scene list
                event.stopPropagation = function ()
                {
                    event.cancelled = -1;
                };
            }

            if (event.cancelled === -1)
            {
                //  This event has been stopped from broadcasting to any other Scene, so abort.
                continue;
            }

            //  Duplicate event bailout
            if (code === this.prevCode && event.timeStamp === this.prevTime && event.type === this.prevType)
            {
                //  On some systems, the exact same event will fire multiple times. This prevents it.
                continue;
            }

            this.prevCode = code;
            this.prevTime = event.timeStamp;
            this.prevType = event.type;

            if (event.type === 'keydown')
            {
                //  Key specific callback first
                if (key)
                {
                    repeat = key.isDown;

                    key.onDown(event);
                }

                if (!event.cancelled && (!key || !repeat))
                {
                    if (KeyMap[code])
                    {
                        this.emit(Events.KEY_DOWN + KeyMap[code], event);
                    }

                    if (!event.cancelled)
                    {
                        this.emit(Events.ANY_KEY_DOWN, event);
                    }
                }
            }
            else
            {
                //  Key specific callback first
                if (key)
                {
                    key.onUp(event);
                }

                if (!event.cancelled)
                {
                    if (KeyMap[code])
                    {
                        this.emit(Events.KEY_UP + KeyMap[code], event);
                    }

                    if (!event.cancelled)
                    {
                        this.emit(Events.ANY_KEY_UP, event);
                    }
                }
            }

            //  Reset the cancel state for other Scenes to use
            if (event.cancelled === 1)
            {
                event.cancelled = 0;
            }
        }
    },

    /**
     * Resets all Key objects created by _this_ Keyboard Plugin back to their default un-pressed states.
     * This can only reset keys created via the `addKey`, `addKeys` or `createCursorKeys` methods.
     * If you have created a Key object directly you'll need to reset it yourself.
     *
     * This method is called automatically when the Keyboard Plugin shuts down, but can be
     * invoked directly at any time you require.
     *
     * @method Phaser.Input.Keyboard.KeyboardPlugin#resetKeys
     * @since 3.15.0
     *
     * @return {this} This KeyboardPlugin object.
     */
    resetKeys: function ()
    {
        var keys = this.keys;

        for (var i = 0; i < keys.length; i++)
        {
            //  Because it's a sparsely populated array
            if (keys[i])
            {
                keys[i].reset();
            }
        }

        return this;
    },

    /**
     * Shuts this Keyboard Plugin down. This performs the following tasks:
     *
     * 1 - Removes all keys created by this Keyboard plugin.
     * 2 - Stops and removes the keyboard event listeners.
     * 3 - Clears out any pending requests in the queue, without processing them.
     *
     * @method Phaser.Input.Keyboard.KeyboardPlugin#shutdown
     * @private
     * @since 3.10.0
     */
    shutdown: function ()
    {
        this.removeAllKeys(true);
        this.removeAllListeners();

        this.sceneInputPlugin.manager.events.off(InputEvents.MANAGER_PROCESS, this.update, this);

        this.game.events.off(GameEvents.BLUR, this.resetKeys);

        this.scene.sys.events.off(SceneEvents.PAUSE, this.resetKeys, this);
        this.scene.sys.events.off(SceneEvents.SLEEP, this.resetKeys, this);

        this.queue = [];
    },

    /**
     * Destroys this Keyboard Plugin instance and all references it holds, plus clears out local arrays.
     *
     * @method Phaser.Input.Keyboard.KeyboardPlugin#destroy
     * @private
     * @since 3.10.0
     */
    destroy: function ()
    {
        this.shutdown();

        var keys = this.keys;

        for (var i = 0; i < keys.length; i++)
        {
            //  Because it's a sparsely populated array
            if (keys[i])
            {
                keys[i].destroy();
            }
        }

        this.keys = [];
        this.combos = [];
        this.queue = [];

        this.scene = null;
        this.settings = null;
        this.sceneInputPlugin = null;
        this.manager = null;
    },

    /**
     * Internal time value.
     *
     * @name Phaser.Input.Keyboard.KeyboardPlugin#time
     * @type {number}
     * @private
     * @since 3.11.0
     */
    time: {

        get: function ()
        {
            return this.sceneInputPlugin.manager.time;
        }

    }

});

/**
 * An instance of the Keyboard Plugin class, if enabled via the `input.keyboard` Scene or Game Config property.
 * Use this to create Key objects and listen for keyboard specific events.
 *
 * @name Phaser.Input.InputPlugin#keyboard
 * @type {?Phaser.Input.Keyboard.KeyboardPlugin}
 * @since 3.10.0
 */
InputPluginCache.register('KeyboardPlugin', KeyboardPlugin, 'keyboard', 'keyboard', 'inputKeyboard');

module.exports = KeyboardPlugin;
