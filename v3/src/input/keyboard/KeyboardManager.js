var Class = require('../../utils/Class');
var Event = require('./events');
var Key = require('./keys/Key');
var KeyCodes = require('./keys/KeyCodes');
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
*/

var KeyboardManager = new Class({

    initialize:

    function KeyboardManager (inputManager)
    {
        this.manager = inputManager;

        this.enabled = false;

        this.target;

        this.keys = [];

        this.combos = [];

        this.captures = [];

        //   Standard FIFO queue
        this.queue = [];

        this.handler;
    },

    /**
    * The Boot handler is called by Phaser.Game when it first starts up.
    * The renderer is available by now.
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

    startListeners: function ()
    {
        var queue = this.queue;
        var captures = this.captures;

        var handler = function (event)
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

        this.handler = handler;

        this.target.addEventListener('keydown', handler, false);
        this.target.addEventListener('keyup', handler, false);
    },

    stopListeners: function ()
    {
        this.target.removeEventListener('keydown', this.handler);
        this.target.removeEventListener('keyup', this.handler);
    },

    /**
    * Creates and returns an object containing 4 hotkeys for Up, Down, Left and Right.
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
        var len = this.queue.length;

        if (!this.enabled || len === 0)
        {
            return;
        }

        //  Clears the queue array, and also means we don't work on array data that could potentially
        //  be modified during the processing phase
        var queue = this.queue.splice(0, len);

        var keys = this.keys;
        var singleKey;

        //  Process the event queue, dispatching all of the events that have stored up
        for (var i = 0; i < len; i++)
        {
            var event = queue[i];

            if (event.type === 'keydown')
            {
                this.manager.events.dispatch(new Event.KEY_DOWN_EVENT(event));

                singleKey = Event._DOWN[event.keyCode];

                if (singleKey)
                {
                    this.manager.events.dispatch(new singleKey(event));
                }

                if (keys[event.keyCode])
                {
                    ProcessKeyDown(keys[event.keyCode], event);
                }
            }
            else
            {
                this.manager.events.dispatch(new Event.KEY_UP_EVENT(event));

                singleKey = Event._UP[event.keyCode];

                if (singleKey)
                {
                    this.manager.events.dispatch(new singleKey(event));
                }

                if (keys[event.keyCode])
                {
                    ProcessKeyUp(keys[event.keyCode], event);
                }
            }
        }
    }

});

module.exports = KeyboardManager;
