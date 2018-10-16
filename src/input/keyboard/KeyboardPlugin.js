/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var EventEmitter = require('eventemitter3');
var GetValue = require('../../utils/object/GetValue');
var InputPluginCache = require('../InputPluginCache');
var Key = require('./keys/Key');
var KeyCodes = require('./keys/KeyCodes');
var KeyCombo = require('./combo/KeyCombo');
var KeyMap = require('./keys/KeyMap');
var ProcessKeyDown = require('./keys/ProcessKeyDown');
var ProcessKeyUp = require('./keys/ProcessKeyUp');
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
 * this.input.keyboard.on('keydown_A', callback, context);
 * ```
 *
 * You can also create Key objects, which you can then poll in your game loop:
 *
 * ```javascript
 * var spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
 * ```
 *
 * _Note_: Many keyboards are unable to process certain combinations of keys due to hardware limitations known as ghosting.
 * See http://www.html5gamedevs.com/topic/4876-impossible-to-use-more-than-2-keyboard-input-buttons-at-the-same-time/ for more details.
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
         * @type {Phaser.Scenes.Settings.Object}
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
         * A boolean that controls if the Keyboard Plugin is enabled or not.
         * Can be toggled on the fly.
         *
         * @name Phaser.Input.Keyboard.KeyboardPlugin#enabled
         * @type {boolean}
         * @default true
         * @since 3.10.0
         */
        this.enabled = true;

        /**
         * The Keyboard Event target, as defined in the Scene or Game Config.
         * Typically the browser window, but can be any interactive DOM element.
         *
         * @name Phaser.Input.Keyboard.KeyboardPlugin#target
         * @type {any}
         * @since 3.10.0
         */
        this.target;

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
         * An internal event queue.
         *
         * @name Phaser.Input.Keyboard.KeyboardPlugin#queue
         * @type {KeyboardEvent[]}
         * @private
         * @since 3.10.0
         */
        this.queue = [];

        /**
         * Internal event handler.
         *
         * @name Phaser.Input.Keyboard.KeyboardPlugin#onKeyHandler
         * @type {function}
         * @private
         * @since 3.10.0
         */
        this.onKeyHandler;

        /**
         * Internal time value.
         *
         * @name Phaser.Input.Keyboard.KeyboardPlugin#time
         * @type {number}
         * @private
         * @since 3.11.0
         */
        this.time = 0;

        sceneInputPlugin.pluginEvents.once('boot', this.boot, this);
        sceneInputPlugin.pluginEvents.on('start', this.start, this);
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
        var config = this.scene.sys.game.config;

        this.enabled = GetValue(settings, 'keyboard', config.inputKeyboard);
        this.target = GetValue(settings, 'keyboard.target', config.inputKeyboardEventTarget);

        this.sceneInputPlugin.pluginEvents.once('destroy', this.destroy, this);
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
        if (this.enabled)
        {
            this.startListeners();
        }

        this.sceneInputPlugin.pluginEvents.once('shutdown', this.shutdown, this);
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
        return (this.enabled && this.scene.sys.isActive());
    },

    /**
     * Starts the Keyboard Event listeners running.
     * This is called automatically and does not need to be manually invoked.
     *
     * @method Phaser.Input.Keyboard.KeyboardPlugin#startListeners
     * @private
     * @since 3.10.0
     */
    startListeners: function ()
    {
        var _this = this;

        var handler = function (event)
        {
            if (event.defaultPrevented || !_this.isActive())
            {
                // Do nothing if event already handled
                return;
            }

            _this.queue.push(event);

            var key = _this.keys[event.keyCode];

            if (key && key.preventDefault)
            {
                event.preventDefault();
            }

        };

        this.onKeyHandler = handler;

        this.target.addEventListener('keydown', handler, false);
        this.target.addEventListener('keyup', handler, false);

        //  Finally, listen for an update event from the Input Plugin
        this.sceneInputPlugin.pluginEvents.on('update', this.update, this);
    },

    /**
     * Stops the Keyboard Event listeners.
     * This is called automatically and does not need to be manually invoked.
     *
     * @method Phaser.Input.Keyboard.KeyboardPlugin#stopListeners
     * @private
     * @since 3.10.0
     */
    stopListeners: function ()
    {
        this.target.removeEventListener('keydown', this.onKeyHandler);
        this.target.removeEventListener('keyup', this.onKeyHandler);

        this.sceneInputPlugin.pluginEvents.off('update', this.update);
    },

    /**
     * @typedef {object} CursorKeys
     * @memberof Phaser.Input.Keyboard
     * 
     * @property {Phaser.Input.Keyboard.Key} [up] - A Key object mapping to the UP arrow key.
     * @property {Phaser.Input.Keyboard.Key} [down] - A Key object mapping to the DOWN arrow key.
     * @property {Phaser.Input.Keyboard.Key} [left] - A Key object mapping to the LEFT arrow key.
     * @property {Phaser.Input.Keyboard.Key} [right] - A Key object mapping to the RIGHT arrow key.
     * @property {Phaser.Input.Keyboard.Key} [space] - A Key object mapping to the SPACE BAR key.
     * @property {Phaser.Input.Keyboard.Key} [shift] - A Key object mapping to the SHIFT key.
     */

    /**
     * Creates and returns an object containing 4 hotkeys for Up, Down, Left and Right, and also Space Bar and shift.
     *
     * @method Phaser.Input.Keyboard.KeyboardPlugin#createCursorKeys
     * @since 3.10.0
     *
     * @return {CursorKeys} An object containing the properties: `up`, `down`, `left`, `right`, `space` and `shift`.
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
     *
     * @return {object} An object containing Key objects mapped to the input properties.
     */
    addKeys: function (keys)
    {
        var output = {};

        if (typeof keys === 'string')
        {
            keys = keys.split(',');

            for (var i = 0; i < keys.length; i++)
            {
                var currentKey = keys[i].trim();

                if (currentKey)
                {
                    output[currentKey] = this.addKey(currentKey);
                }
            }
        }
        else
        {
            for (var key in keys)
            {
                output[key] = this.addKey(keys[key]);
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
     * @param {(Phaser.Input.Keyboard.Key|string|integer)} key - Either a Key object, a string, such as `A` or `SPACE`, or a key code value.
     *
     * @return {Phaser.Input.Keyboard.Key} The newly created Key object, or a reference to it if it already existed in the keys array.
     */
    addKey: function (key)
    {
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

            return key;
        }

        if (typeof key === 'string')
        {
            key = KeyCodes[key.toUpperCase()];
        }

        if (!keys[key])
        {
            keys[key] = new Key(key);
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
     * @param {(Phaser.Input.Keyboard.Key|string|integer)} key - Either a Key object, a string, such as `A` or `SPACE`, or a key code value.
     */
    removeKey: function (key)
    {
        var keys = this.keys;

        if (key instanceof Key)
        {
            var idx = keys.indexOf(key);

            if (idx > -1)
            {
                this.keys[idx] = undefined;
            }
        }
        else if (typeof key === 'string')
        {
            key = KeyCodes[key.toUpperCase()];
        }

        if (keys[key])
        {
            keys[key] = undefined;
        }
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
     * @param {(string|integer[]|object[])} keys - The keys that comprise this combo.
     * @param {KeyComboConfig} [config] - A Key Combo configuration object.
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
     * @return {boolean} `True` if the Key is down within the duration specified, otherwise `false`.
     */
    checkDown: function (key, duration)
    {
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
     * Internal update handler called by the Input Manager, which is in turn invoked by the Game step.
     *
     * @method Phaser.Input.Keyboard.KeyboardPlugin#update
     * @private
     * @since 3.10.0
     * 
     * @param {number} time - The game loop time value.
     */
    update: function (time)
    {
        this.time = time;

        var len = this.queue.length;

        if (!this.enabled || len === 0)
        {
            return;
        }

        //  Clears the queue array, and also means we don't work on array data that could potentially
        //  be modified during the processing phase
        var queue = this.queue.splice(0, len);

        var keys = this.keys;

        //  Process the event queue, dispatching all of the events that have stored up
        for (var i = 0; i < len; i++)
        {
            var event = queue[i];
            var code = event.keyCode;

            if (event.type === 'keydown')
            {
                if (KeyMap[code] && (keys[code] === undefined || keys[code].isDown === false))
                {
                    //  Will emit a keyboard or keyup event
                    this.emit(event.type, event);

                    this.emit('keydown_' + KeyMap[code], event);
                }

                if (keys[code])
                {
                    ProcessKeyDown(keys[code], event);
                }
            }
            else
            {
                //  Will emit a keyboard or keyup event
                this.emit(event.type, event);

                this.emit('keyup_' + KeyMap[code], event);

                if (keys[code])
                {
                    ProcessKeyUp(keys[code], event);
                }
            }
        }
    },

    /**
     * Resets all Key objects created by _this_ Keyboard Plugin back to their default un-pressed states.
     * This can only reset keys created via the `addKey`, `addKeys` or `createCursors` methods.
     * If you have created a Key object directly you'll need to reset it yourself.
     * 
     * This method is called automatically when the Keyboard Plugin shuts down, but can be
     * invoked directly at any time you require.
     *
     * @method Phaser.Input.Keyboard.KeyboardPlugin#resetKeys
     * @since 3.15.0
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
     * 1 - Resets all keys created by this Keyboard plugin.
     * 2 - Stops and removes the keyboard event listeners.
     * 3 - Clears out any pending requests in the queue, without processing them.
     *
     * @method Phaser.Input.Keyboard.KeyboardPlugin#shutdown
     * @private
     * @since 3.10.0
     */
    shutdown: function ()
    {
        this.resetKeys();

        this.stopListeners();

        this.removeAllListeners();

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

        this.keys = [];
        this.combos = [];
        this.queue = [];

        this.scene = null;
        this.settings = null;
        this.sceneInputPlugin = null;
        this.target = null;
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
