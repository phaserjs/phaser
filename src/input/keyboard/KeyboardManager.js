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
 * The Keyboard class monitors keyboard input and dispatches keyboard events.
 *
 * _Note_: many keyboards are unable to process certain combinations of keys due to hardware limitations known as ghosting.
 * See http://www.html5gamedevs.com/topic/4876-impossible-to-use-more-than-2-keyboard-input-buttons-at-the-same-time/ for more details.
 *
 * Also please be aware that certain browser extensions can disable or override Phaser keyboard handling.
 * For example the Chrome extension vimium is known to disable Phaser from using the D key. And there are others.
 * So please check your extensions before opening Phaser issues.
 *
 * @class KeyboardManager
 * @extends EventEmitter
 * @memberOf Phaser.Input.Keyboard
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Input.InputManager} inputManager - [description]
 */
var KeyboardManager = new Class({

    Extends: EventEmitter,

    initialize:

    function KeyboardManager (inputManager)
    {
        EventEmitter.call(this);

        /**
         * [description]
         *
         * @name Phaser.Input.Keyboard.KeyboardManager#manager
         * @type {Phaser.Input.InputManager}
         * @since 3.0.0
         */
        this.manager = inputManager;

        /**
         * [description]
         *
         * @name Phaser.Input.Keyboard.KeyboardManager#enabled
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.enabled = false;

        /**
         * [description]
         *
         * @name Phaser.Input.Keyboard.KeyboardManager#target
         * @type {null}
         * @since 3.0.0
         */
        this.target;

        /**
         * [description]
         *
         * @name Phaser.Input.Keyboard.KeyboardManager#keys
         * @type {array}
         * @default []
         * @since 3.0.0
         */
        this.keys = [];

        /**
         * [description]
         *
         * @name Phaser.Input.Keyboard.KeyboardManager#combos
         * @type {array}
         * @default []
         * @since 3.0.0
         */
        this.combos = [];

        /**
         * [description]
         *
         * @name Phaser.Input.Keyboard.KeyboardManager#captures
         * @type {array}
         * @default []
         * @since 3.0.0
         */
        this.captures = [];

        /**
         * [description]
         *
         * @name Phaser.Input.Keyboard.KeyboardManager#queue
         * @type {array}
         * @default []
         * @since 3.0.0
         */
        this.queue = [];

        /**
         * [description]
         *
         * @name Phaser.Input.Keyboard.KeyboardManager#handler
         * @type {any}
         * @since 3.0.0
         */
        this.handler;
    },

    /**
     * The Boot handler is called by Phaser.Game when it first starts up.
     *
     * @method Phaser.Input.Keyboard.KeyboardManager#boot
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
     * [description]
     *
     * @method Phaser.Input.Keyboard.KeyboardManager#startListeners
     * @since 3.0.0
     *
     * @return {[type]} [description]
     */
    startListeners: function ()
    {
        var queue = this.queue;
        var captures = this.captures;

        var handler = function (event)
        {
            if (event.defaultPrevented)
            {
                // Do nothing if event already handled
                return;
            }

            queue.push(event);

            if (captures[event.keyCode])
            {
                event.preventDefault();
            }
        };

        this.handler = handler;

        this.target.addEventListener('keydown', handler, false);
        this.target.addEventListener('keyup', handler, false);
    },

    /**
     * [description]
     *
     * @method Phaser.Input.Keyboard.KeyboardManager#stopListeners
     * @since 3.0.0
     */
    stopListeners: function ()
    {
        this.target.removeEventListener('keydown', this.handler);
        this.target.removeEventListener('keyup', this.handler);
    },

    /**
     * Creates and returns an object containing 4 hotkeys for Up, Down, Left and Right, and also space and shift.
     *
     * @method Phaser.Input.Keyboard.KeyboardManager#createCursorKeys
     * @since 3.0.0
     *
     * @return {[type]} [description]
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
     * For example,
     *
     *     addKeys( { 'up': Phaser.KeyCode.W, 'down': Phaser.KeyCode.S, 'left': Phaser.KeyCode.A, 'right': Phaser.KeyCode.D } );
     *
     * would return an object containing properties (`up`, `down`, `left` and `right`) referring to {@link Phaser.Key} object.
     *
     * @method Phaser.Input.Keyboard.KeyboardManager#addKeys
     * @since 3.0.0
     *
     * @param {[type]} keys - [description]
     *
     * @return {[type]} [description]
     */
    addKeys: function (keys)
    {
        var output = {};

        for (var key in keys)
        {
            output[key] = this.addKey(keys[key]);
        }

        return output;
    },

    /**
     * If you need more fine-grained control over a Key you can create a new Phaser.Key object via this method.
     * The Key object can then be polled, have events attached to it, etc.
     *
     * @method Phaser.Input.Keyboard.KeyboardManager#addKey
     * @since 3.0.0
     *
     * @param {[type]} keyCode - [description]
     *
     * @return {[type]} [description]
     */
    addKey: function (keyCode)
    {
        var keys = this.keys;

        if (!keys[keyCode])
        {
            keys[keyCode] = new Key(keyCode);
            this.captures[keyCode] = true;
        }

        return keys[keyCode];
    },

    /**
     * Removes a Key object from the Keyboard manager.
     *
     * @method Phaser.Input.Keyboard.KeyboardManager#removeKey
     * @since 3.0.0
     *
     * @param {[type]} keyCode - [description]
     */
    removeKey: function (keyCode)
    {
        if (this.keys[keyCode])
        {
            this.keys[keyCode] = undefined;
            this.captures[keyCode] = false;
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Input.Keyboard.KeyboardManager#addKeyCapture
     * @since 3.0.0
     *
     * @param {[type]} keyCodes - [description]
     */
    addKeyCapture: function (keyCodes)
    {
        if (!Array.isArray(keyCodes))
        {
            keyCodes = [ keyCodes ];
        }

        for (var i = 0; i < keyCodes.length; i++)
        {
            this.captures[keyCodes[i]] = true;
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Input.Keyboard.KeyboardManager#removeKeyCapture
     * @since 3.0.0
     *
     * @param {[type]} keyCodes - [description]
     */
    removeKeyCapture: function (keyCodes)
    {
        if (!Array.isArray(keyCodes))
        {
            keyCodes = [ keyCodes ];
        }

        for (var i = 0; i < keyCodes.length; i++)
        {
            this.captures[keyCodes[i]] = false;
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Input.Keyboard.KeyboardManager#createCombo
     * @since 3.0.0
     *
     * @param {[type]} keys - [description]
     * @param {[type]} config - [description]
     *
     * @return {[type]} [description]
     */
    createCombo: function (keys, config)
    {
        return new KeyCombo(this, keys, config);
    },

    /**
     * [description]
     *
     * @method Phaser.Input.Keyboard.KeyboardManager#update
     * @since 3.0.0
     *
     * @return {[type]} [description]
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
     * [description]
     *
     * @method Phaser.Input.Keyboard.KeyboardManager#shutdown
     * @since 3.0.0
     */
    shutdown: function ()
    {
        this.removeAllListeners();
    },

    /**
     * [description]
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
        this.captures = [];
        this.queue = [];
        this.handler = undefined;

        this.manager = null;
    }

});

module.exports = KeyboardManager;
