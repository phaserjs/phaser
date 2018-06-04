/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var EventEmitter = require('eventemitter3');
var Key = require('./keys/Key');
var KeyCodes = require('./keys/KeyCodes');
var KeyCombo = require('./combo/KeyCombo');
var KeyMap = require('./keys/KeyMap');
var ProcessKeyDown = require('./keys/ProcessKeyDown');
var ProcessKeyUp = require('./keys/ProcessKeyUp');

/**
 * @classdesc
 * The Keyboard Manager is a helper class that belongs to the Input Manager.
 * 
 * Its role is to listen for native DOM Keyboard Events and then process them.
 * 
 * You do not need to create this class directly, the Input Manager will create an instance of it automatically.
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
 * @class KeyboardManager
 * @extends Phaser.Events.EventEmitter
 * @memberOf Phaser.Input.Keyboard
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Input.InputManager} inputManager - A reference to the Input Manager.
 */
var KeyboardManager = new Class({

    Extends: EventEmitter,

    initialize:

    function KeyboardManager (inputManager)
    {
        EventEmitter.call(this);

        /**
         * A reference to the Input Manager.
         *
         * @name Phaser.Input.Keyboard.KeyboardManager#manager
         * @type {Phaser.Input.InputManager}
         * @since 3.0.0
         */
        this.manager = inputManager;

        /**
         * A boolean that controls if the Keyboard Manager is enabled or not.
         * Can be toggled on the fly.
         *
         * @name Phaser.Input.Keyboard.KeyboardManager#enabled
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.enabled = false;

        /**
         * The Keyboard Event target, as defined in the Game Config.
         * Typically the browser window, but can be any interactive DOM element.
         *
         * @name Phaser.Input.Keyboard.KeyboardManager#target
         * @type {any}
         * @since 3.0.0
         */
        this.target;

        /**
         * An array of Key objects to process.
         *
         * @name Phaser.Input.Keyboard.KeyboardManager#keys
         * @type {Phaser.Input.Keyboard.Key[]}
         * @since 3.0.0
         */
        this.keys = [];

        /**
         * An array of KeyCombo objects to process.
         *
         * @name Phaser.Input.Keyboard.KeyboardManager#combos
         * @type {Phaser.Input.Keyboard.KeyCombo[]}
         * @since 3.0.0
         */
        this.combos = [];

        /**
         * An internal event queue.
         *
         * @name Phaser.Input.Keyboard.KeyboardManager#queue
         * @type {KeyboardEvent[]}
         * @private
         * @since 3.0.0
         */
        this.queue = [];

        inputManager.events.once('boot', this.boot, this);
    },

    /**
     * The Boot handler is called by Phaser.Game when it first starts up.
     *
     * @method Phaser.Input.Keyboard.KeyboardManager#boot
     * @private
     * @since 3.0.0
     */
    boot: function ()
    {
        var config = this.manager.config;

        this.enabled = config.inputKeyboard;
        this.target = config.inputKeyboardEventTarget;

        if (this.enabled)
        {
            this.startListeners();
        }
    },

    /**
     * The Keyboard Down Event Handler.
     *
     * @method Phaser.Input.Keyboard.KeyboardManager#onKeyDown
     * @since 3.10.0
     *
     * @param {KeyboardEvent} event - The native DOM Keyboard Event.
     */
    onKeyDown: function (event)
    {
        if (event.defaultPrevented || !this.enabled)
        {
            // Do nothing if event already handled
            return;
        }

        this.queue.push(event);

        var key = this.keys[event.keyCode];

        if (key && key.preventDefault)
        {
            event.preventDefault();
        }
    },

    /**
     * The Keyboard Up Event Handler.
     *
     * @method Phaser.Input.Keyboard.KeyboardManager#onKeyUp
     * @since 3.10.0
     *
     * @param {KeyboardEvent} event - The native DOM Keyboard Event.
     */
    onKeyUp: function (event)
    {
        if (event.defaultPrevented || !this.enabled)
        {
            // Do nothing if event already handled
            return;
        }

        this.queue.push(event);

        var key = this.keys[event.keyCode];

        if (key && key.preventDefault)
        {
            event.preventDefault();
        }
    },

    /**
     * Starts the Keyboard Event listeners running.
     * This is called automatically and does not need to be manually invoked.
     *
     * @method Phaser.Input.Keyboard.KeyboardManager#startListeners
     * @since 3.0.0
     */
    startListeners: function ()
    {
        this.target.addEventListener('keydown', this.onKeyDown.bind(this), false);
        this.target.addEventListener('keyup', this.onKeyUp.bind(this), false);

        //  Finally, listen for an update event from the Input Manager
        this.manager.events.on('update', this.update, this);
    },

    /**
     * Stops the Keyboard Event listeners.
     * This is called automatically and does not need to be manually invoked.
     *
     * @method Phaser.Input.Keyboard.KeyboardManager#stopListeners
     * @since 3.0.0
     */
    stopListeners: function ()
    {
        this.target.removeEventListener('keydown', this.onKeyDown);
        this.target.removeEventListener('keyup', this.onKeyUp);

        this.manager.events.off('update', this.update);
    },

    /**
     * @typedef {object} CursorKeys
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
     * @method Phaser.Input.Keyboard.KeyboardManager#createCursorKeys
     * @since 3.0.0
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
     * @method Phaser.Input.Keyboard.KeyboardManager#addKeys
     * @since 3.0.0
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
                output[keys[i]] = this.addKey(keys[i]);
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
     * Adds a Key object to the Keyboard Manager.
     *
     * The given argument can be either an existing Key object, a string, such as `A` or `SPACE`, or a key code value.
     *
     * If a Key object is given, and one already exists matching the same key code, the existing one is replaced with the new one.
     *
     * @method Phaser.Input.Keyboard.KeyboardManager#addKey
     * @since 3.0.0
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
     * Removes a Key object from the Keyboard Manager.
     *
     * The given argument can be either a Key object, a string, such as `A` or `SPACE`, or a key code value.
     *
     * @method Phaser.Input.Keyboard.KeyboardManager#removeKey
     * @since 3.0.0
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
     * it will emit a `keycombomatch` event from the Keyboard Manager.
     *
     * The keys to be listened for can be defined as:
     *
     * A string (i.e. 'ATARI')
     * An array of either integers (key codes) or strings, or a mixture of both
     * An array of objects (such as Key objects) with a public 'keyCode' property
     *
     * For example, to listen for the Konami code (up, up, up, down, down, down, left, left, left, right, right, right)
     * you could pass the following array of key codes:
     *
     * ```javascript
     * this.input.keyboard.createCombo([ 38, 38, 38, 40, 40, 40, 37, 37, 37, 39, 39, 39 ], { resetOnMatch: true });
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
     * @method Phaser.Input.Keyboard.KeyboardManager#createCombo
     * @since 3.0.0
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
     * Internal update handler called by the Input Manager, which is in turn invoked by the Game step.
     *
     * @method Phaser.Input.Keyboard.KeyboardManager#update
     * @private
     * @since 3.0.0
     */
    update: function ()
    {
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
     * Shuts the Keyboard Manager down.
     * All this does is remove any listeners bound to it.
     *
     * @method Phaser.Input.Keyboard.KeyboardManager#shutdown
     * @since 3.0.0
     */
    shutdown: function ()
    {
        this.removeAllListeners();
    },

    /**
     * Destroys this Keyboard Manager instance and all references it holds, plus clears out local arrays.
     *
     * @method Phaser.Input.Keyboard.KeyboardManager#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.stopListeners();

        this.removeAllListeners();

        this.keys = [];
        this.combos = [];
        this.queue = [];

        this.manager = null;
    }

});

module.exports = KeyboardManager;
