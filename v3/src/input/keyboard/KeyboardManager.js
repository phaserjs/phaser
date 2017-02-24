var EventDispatcher = require('../../events/EventDispatcher');
var Event = require('./events');
var KeyCodes = require('./keys/KeyCodes');
var Key = require('./keys/Key');
var KeyCombo = require('./combo/KeyCombo');
var ProcessKeyCombo = require('./combo/ProcessKeyCombo');
var ProcessKeyDown = require('./keys/ProcessKeyDown');
var ProcessKeyUp = require('./keys/ProcessKeyUp');

/**
* The Keyboard class monitors keyboard input and dispatches keyboard events.
*
* _Note_: many keyboards are unable to process certain combinations of keys due to hardware limitations known as ghosting.
* See http://www.html5gamedevs.com/topic/4876-impossible-to-use-more-than-2-keyboard-input-buttons-at-the-same-time/ for more details.
*
* Also please be aware that certain browser extensions can disable or override Phaser keyboard handling.
* For example the Chrome extension vimium is known to disable Phaser from using the D key. And there are others.
* So please check your extensions before opening Phaser issues.
*
* @class Phaser.Keyboard
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
*/
var KeyboardManager = function (inputManager)
{
    this.manager = inputManager;

    this.enabled = false;

    this.target;

    this.events = new EventDispatcher();

    this.keys = [];

    this.combos = [];

    this.captures = [];

    //   Standard FIFO queue
    this.queue = [];

    this.keyHandler;
};

KeyboardManager.prototype.constructor = KeyboardManager;

KeyboardManager.prototype = {

    /**
    * The Boot handler is called by Phaser.Game when it first starts up.
    * The renderer is available by now.
    *
    * @method Phaser.Input.KeyboardManager#boot
    * @private
    */
    boot: function ()
    {
        var config = this.manager.gameConfig;

        this.enabled = config.inputKeyboard;
        this.target = config.inputKeyboardEventTarget;

        if (this.enabled)
        {
            this.startListeners();
        }
    },

    startListeners: function ()
    {
        var queue = this.queue;
        var captures = this.captures;

        var keyHandler = function (event)
        {
            if (event.preventDefaulted)
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

        this.keyHandler = keyHandler;

        this.target.addEventListener('keydown', keyHandler, false);
        this.target.addEventListener('keyup', keyHandler, false);
    },

    stopListeners: function ()
    {
        this.target.removeEventListener('keydown', this.keyHandler);
        this.target.removeEventListener('keyup', this.keyHandler);
    },

    /**
    * Creates and returns an object containing 4 hotkeys for Up, Down, Left and Right.
    *
    * @method Phaser.Keyboard#createCursorKeys
    * @return {object} An object containing properties: `up`, `down`, `left` and `right` of {@link Phaser.Key} objects.
    */
    createCursorKeys: function ()
    {
        return this.addKeys({
            up: KeyCodes.UP,
            down: KeyCodes.DOWN,
            left: KeyCodes.LEFT,
            right: KeyCodes.RIGHT
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
    * @method Phaser.Keyboard#addKeys
    * @param {object} keys - A key mapping object, i.e. `{ 'up': Phaser.KeyCode.W, 'down': Phaser.KeyCode.S }` or `{ 'up': 52, 'down': 53 }`.
    * @return {object} An object containing the properties mapped to {@link Phaser.Key} values.
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
    * @method Phaser.Keyboard#addKey
    * @param {integer} keycode - The {@link Phaser.KeyCode keycode} of the key.
    * @return {Phaser.Key} The Key object which you can store locally and reference directly.
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
    * @method Phaser.Keyboard#removeKey
    * @param {integer} keycode - The {@link Phaser.KeyCode keycode} of the key to remove.
    */
    removeKey: function (keyCode)
    {
        if (this.keys[keyCode])
        {
            this.keys[keyCode] = undefined;
            this.captures[keyCode] = false;
        }
    },

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

    createCombo: function (keys, config)
    {
        return new KeyCombo(this, keys, config);
    },

    //  https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/KeyboardEvent
    //  type = 'keydown', 'keyup'
    //  keyCode = integer

    update: function ()
    {
        if (!this.enabled)
        {
            return;
        }

        //  Clears the queue array, and also means we don't work on array data that could potentially
        //  be modified during the processing phase
        var queue = this.queue.splice(0, this.queue.length);

        var keys = this.keys;
        var singleKey;

        //  Process the event queue, dispatching all of the events that have stored up
        for (var i = 0; i < queue.length; i++)
        {
            var event = queue[i];

            if (event.type === 'keydown')
            {
                this.events.dispatch(new Event.KEY_DOWN_EVENT(event));

                singleKey = Event._DOWN[event.keyCode];

                if (singleKey)
                {
                    this.events.dispatch(new singleKey(event));
                }

                if (keys[event.keyCode])
                {
                    ProcessKeyDown(keys[event.keyCode], event);
                }
            }
            else
            {
                this.events.dispatch(new Event.KEY_UP_EVENT(event));

                singleKey = Event._UP[event.keyCode];

                if (singleKey)
                {
                    this.events.dispatch(new singleKey(event));
                }

                if (keys[event.keyCode])
                {
                    ProcessKeyUp(keys[event.keyCode], event);
                }
            }
        }
    }

};

module.exports = KeyboardManager;
