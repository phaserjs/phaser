var EventDispatcher = require('../../events/EventDispatcher');
var Event = require('./events');
var KeyCodes = require('./KeyCodes');
var Key = require('./Key');
var ProcessKeyDown = require('./ops/ProcessKeyDown');
var ProcessKeyUp = require('./ops/ProcessKeyUp');

var KeyboardManager = function (inputManager)
{
    this.manager = inputManager;

    this.enabled = false;

    this.target;

    this.events = new EventDispatcher();

    this.keys = [];

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

        var keyHandler = function (event)
        {
            if (event.preventDefaulted)
            {
                // Do nothing if event already handled
                return;
            }

            queue.push(event);
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
    * If you need more fine-grained control over a Key you can create a new Phaser.Key object via this method.
    * The Key object can then be polled, have events attached to it, etc.
    *
    * @method Phaser.Keyboard#addKey
    * @param {integer} keycode - The {@link Phaser.KeyCode keycode} of the key.
    * @return {Phaser.Key} The Key object which you can store locally and reference directly.
    */
    addKey: function (keycode, name)
    {
        if (!this.keys[keycode])
        {
            this.keys[keycode] = new Key(this, keycode, name);

            // this.addKeyCapture(keycode);
        }

        return this.keys[keycode];
    },

    /**
    * Removes a Key object from the Keyboard manager.
    *
    * @method Phaser.Keyboard#removeKey
    * @param {integer} keycode - The {@link Phaser.KeyCode keycode} of the key to remove.
    */
    removeKey: function (keycode)
    {
        if (this.keys[keycode])
        {
            this.keys[keycode] = undefined;

            // this.removeKeyCapture(keycode);
        }
    },

    //  https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/KeyboardEvent
    //  type = 'keydown', 'keyup'
    //  keyCode = integer

    update: function ()
    {
        //  Process the event queue, dispatching all of the events that have stored up

        var queue = this.queue;
        var keys = this.keys;

        for (var i = 0; i < queue.length; i++)
        {
            var event = queue[i];

            if (event.type === 'keydown')
            {
                this.events.dispatch(new Event.KEY_DOWN_EVENT(event));

                if (keys[event.keyCode])
                {
                    ProcessKeyDown(keys[event.keyCode], event);
                }
            }
            else
            {
                this.events.dispatch(new Event.KEY_UP_EVENT(event));

                if (keys[event.keyCode])
                {
                    ProcessKeyUp(keys[event.keyCode], event);
                }
            }
        }

        queue.length = 0;
    }

};

module.exports = KeyboardManager;
