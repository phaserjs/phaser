/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var EventEmitter = require('eventemitter3');
var Gamepad = require('./Gamepad');

// https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API
// https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API
// https://www.smashingmagazine.com/2015/11/gamepad-api-in-web-games/
// http://html5gamepad.com/

/**
 * @typedef {object} Pad
 *
 * @property {string} id - The ID of the Gamepad.
 * @property {integer} index - The index of the Gamepad.
 */

/**
 * @classdesc
 * The Gamepad Manager is a helper class that belongs to the Input Manager.
 * 
 * Its role is to listen for native DOM Gamepad Events and then process them.
 * 
 * You do not need to create this class directly, the Input Manager will create an instance of it automatically.
 * 
 * You can access it from within a Scene using `this.input.gamepad`. For example, you can do:
 *
 * ```javascript
 * ```
 *
 * @class GamepadManager
 * @extends Phaser.Events.EventEmitter
 * @memberOf Phaser.Input.Gamepad
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Input.InputManager} inputManager - A reference to the Input Manager.
 */
var GamepadManager = new Class({

    Extends: EventEmitter,

    initialize:

    function GamepadManager (inputManager)
    {
        EventEmitter.call(this);

        /**
         * A reference to the Input Manager.
         *
         * @name Phaser.Input.Gamepad.GamepadManager#manager
         * @type {Phaser.Input.InputManager}
         * @since 3.0.0
         */
        this.manager = inputManager;

        /**
         * A boolean that controls if the Gamepad Manager is enabled or not.
         * Can be toggled on the fly.
         *
         * @name Phaser.Input.Gamepad.GamepadManager#enabled
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.enabled = true;

        /**
         * The Gamepad Event target, as defined in the Game Config.
         * Typically the browser window, but can be any interactive DOM element.
         *
         * @name Phaser.Input.Gamepad.GamepadManager#target
         * @type {any}
         * @since 3.0.0
         */
        this.target;

        /**
         * An array of the connected Gamepads.
         *
         * @name Phaser.Input.Gamepad.GamepadManager#gamepads
         * @type {Phaser.Input.Gamepad.Gamepad[]}
         * @default []
         * @since 3.0.0
         */
        this.gamepads = [];

        /**
         * An internal event queue.
         *
         * @name Phaser.Input.Gamepad.GamepadManager#queue
         * @type {GamepadEvent[]}
         * @private
         * @since 3.0.0
         */
        this.queue = [];

        this._pad1;
        this._pad2;
        this._pad3;
        this._pad4;

        inputManager.events.once('boot', this.boot, this);
    },

    /**
     * The Boot handler is called by Phaser.Game when it first starts up.
     *
     * @method Phaser.Input.Gamepad.GamepadManager#boot
     * @since 3.0.0
     */
    boot: function ()
    {
        var config = this.manager.config;

        this.enabled = (config.inputGamepad && this.manager.game.device.input.gamepads);
        this.target = config.inputGamepadEventTarget;

        if (this.enabled)
        {
            this.startListeners();
        }
    },

    /**
     * The Gamepad Connected Event Handler.
     *
     * @method Phaser.Input.Gamepad.GamepadManager#onGamepadConnected
     * @since 3.10.0
     *
     * @param {GamepadEvent} event - The native DOM Gamepad Event.
     */
    onGamepadConnected: function (event)
    {
        // console.log(event);

        if (event.defaultPrevented || !this.enabled)
        {
            // Do nothing if event already handled
            return;
        }

        this.refreshPads();

        this.queue.push(event);
    },

    /**
     * The Gamepad Disconnected Event Handler.
     *
     * @method Phaser.Input.Gamepad.GamepadManager#onGamepadDisconnected
     * @since 3.10.0
     *
     * @param {GamepadEvent} event - The native DOM Gamepad Event.
     */
    onGamepadDisconnected: function (event)
    {
        if (event.defaultPrevented || !this.enabled)
        {
            // Do nothing if event already handled
            return;
        }

        this.refreshPads();

        this.queue.push(event);
    },

    /**
     * Starts the Gamepad Event listeners running.
     * This is called automatically and does not need to be manually invoked.
     *
     * @method Phaser.Input.Gamepad.GamepadManager#startListeners
     * @since 3.0.0
     */
    startListeners: function ()
    {
        var target = this.target;

        target.addEventListener('gamepadconnected', this.onGamepadConnected.bind(this), false);
        target.addEventListener('gamepaddisconnected', this.onGamepadDisconnected.bind(this), false);

        //  FF also supports gamepadbuttondown, gamepadbuttonup and gamepadaxismove but
        //  nothing else does, and we can get those values via the gamepads anyway, so we will
        //  until more browsers support this

        //  Finally, listen for an update event from the Input Manager
        this.manager.events.on('update', this.update, this);
    },

    /**
     * Stops the Gamepad Event listeners.
     * This is called automatically and does not need to be manually invoked.
     *
     * @method Phaser.Input.Gamepad.GamepadManager#stopListeners
     * @since 3.0.0
     */
    stopListeners: function ()
    {
        var target = this.target;

        target.removeEventListener('gamepadconnected', this.onGamepadConnected);
        target.removeEventListener('gamepaddisconnected', this.onGamepadDisconnected);

        this.manager.events.off('update', this.update);
    },

    /**
     * Disconnects all current Gamepads.
     *
     * @method Phaser.Input.Gamepad.GamepadManager#disconnectAll
     * @since 3.0.0
     */
    disconnectAll: function ()
    {
        for (var i = 0; i < this.gamepads.length; i++)
        {
            this.gamepads.connected = false;
        }
    },

    /**
     * Refreshes the list of connected Gamepads.
     * 
     * This is called automatically when a gamepad is connected or disconnected,
     * and during the update loop.
     *
     * @method Phaser.Input.Gamepad.GamepadManager#refreshPads
     * @private
     * @since 3.0.0
     */
    refreshPads: function ()
    {
        var connectedPads = navigator.getGamepads();

        if (!connectedPads)
        {
            this.disconnectAll();
        }
        else
        {
            var currentPads = this.gamepads;

            for (var i = 0; i < connectedPads.length; i++)
            {
                var livePad = connectedPads[i];

                //  Because sometimes they're null (yes, really)
                if (!livePad)
                {
                    continue;
                }

                var id = livePad.id;
                var index = livePad.index;
                var currentPad = currentPads[index];

                if (!currentPad)
                {
                    //  A new Gamepad, not currently stored locally
                    var newPad  = new Gamepad(this, livePad);

                    currentPads[index] = newPad;

                    if (!this._pad1)
                    {
                        this._pad1 = newPad;
                    }
                    else if (!this._pad2)
                    {
                        this._pad2 = newPad;
                    }
                    else if (!this._pad3)
                    {
                        this._pad3 = newPad;
                    }
                    else if (!this._pad4)
                    {
                        this._pad4 = newPad;
                    }
                }
                else if (currentPad.id !== id)
                {
                    //  A new Gamepad with a different vendor string, but it has got the same index as an old one
                    currentPad.destroy();

                    currentPads[index] = new Gamepad(this, livePad);
                }
                else
                {
                    //  If neither of these, it's a pad we've already got, so update it
                    currentPad.update(livePad);
                }
            }
        }
    },

    /**
     * Returns an array of all currently connected Gamepads.
     *
     * @method Phaser.Input.Gamepad.GamepadManager#getAll
     * @since 3.0.0
     *
     * @return {Phaser.Input.Gamepad.Gamepad[]} An array of all currently connected Gamepads.
     */
    getAll: function ()
    {
        var out = [];
        var pads = this.gamepads;

        for (var i = 0; i < pads.length; i++)
        {
            if (pads[i])
            {
                out.push(pads[i]);
            }
        }

        return out;
    },

    /**
     * Looks-up a single Gamepad based on the given index value.
     *
     * @method Phaser.Input.Gamepad.GamepadManager#getPad
     * @since 3.0.0
     *
     * @param {number} index - The index of the Gamepad to get.
     *
     * @return {Phaser.Input.Gamepad.Gamepad} The Gamepad matching the given index, or undefined if none were found.
     */
    getPad: function (index)
    {
        var pads = this.gamepads;

        for (var i = 0; i < pads.length; i++)
        {
            if (pads[i] && pads[i].index === index)
            {
                return pads[i];
            }
        }
    },

    /**
     * The internal update loop. Refreshes all connected gamepads and processes their events.
     * 
     * Called automatically by the Input Manager, invoked from the Game step.
     *
     * @method Phaser.Input.Gamepad.GamepadManager#update
     * @private
     * @since 3.0.0
     */
    update: function ()
    {
        if (!this.enabled)
        {
            return;
        }

        this.refreshPads();

        var len = this.queue.length;

        if (len === 0)
        {
            return;
        }

        var queue = this.queue.splice(0, len);

        //  Process the event queue, dispatching all of the events that have stored up
        for (var i = 0; i < len; i++)
        {
            var event = queue[i];
            var pad;

            switch (event.type)
            {
                case 'gamepadconnected':

                    pad = this.getPad(event.gamepad.index);

                    this.emit('connected', pad, event);

                    break;

                case 'gamepaddisconnected':

                    pad = this.getPad(event.gamepad.index);

                    this.emit('disconnected', pad, event);

                    break;
            }
        }
    },

    /**
     * Destroys this Gamepad Manager, disconnecting all Gamepads and releasing internal references.
     *
     * @method Phaser.Input.Gamepad.GamepadManager#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.stopListeners();
        this.disconnectAll();

        this.removeAllListeners();

        for (var i = 0; i < this.gamepads.length; i++)
        {
            if (this.gamepads[i])
            {
                this.gamepads[i].destroy();
            }
        }

        this.gamepads = [];

        this.target = null;
        this.manager = null;
    },

    /**
     * The total number of connected game pads.
     *
     * @name Phaser.Input.Gamepad.GamepadManager#total
     * @type {integer}
     * @since 3.0.0
     */
    total: {

        get: function ()
        {
            return this.gamepads.length;
        }

    },

    /**
     * A reference to the first connected Gamepad.
     * 
     * This will be undefined if either no pads are connected, or the browser
     * has not yet issued a gamepadconnect, which can happen even if a Gamepad
     * is plugged in, but hasn't yet had any buttons pressed on it.
     *
     * @name Phaser.Input.Gamepad.GamepadManager#pad1
     * @type {Phaser.Input.Gamepad.Gamepad}
     * @since 3.10.0
     */
    pad1: {

        get: function ()
        {
            return this._pad1;
        }

    },

    /**
     * A reference to the second connected Gamepad.
     * 
     * This will be undefined if either no pads are connected, or the browser
     * has not yet issued a gamepadconnect, which can happen even if a Gamepad
     * is plugged in, but hasn't yet had any buttons pressed on it.
     *
     * @name Phaser.Input.Gamepad.GamepadManager#pad2
     * @type {Phaser.Input.Gamepad.Gamepad}
     * @since 3.10.0
     */
    pad2: {

        get: function ()
        {
            return this._pad2;
        }

    },

    /**
     * A reference to the third connected Gamepad.
     * 
     * This will be undefined if either no pads are connected, or the browser
     * has not yet issued a gamepadconnect, which can happen even if a Gamepad
     * is plugged in, but hasn't yet had any buttons pressed on it.
     *
     * @name Phaser.Input.Gamepad.GamepadManager#pad3
     * @type {Phaser.Input.Gamepad.Gamepad}
     * @since 3.10.0
     */
    pad3: {

        get: function ()
        {
            return this._pad3;
        }

    },

    /**
     * A reference to the fourth connected Gamepad.
     * 
     * This will be undefined if either no pads are connected, or the browser
     * has not yet issued a gamepadconnect, which can happen even if a Gamepad
     * is plugged in, but hasn't yet had any buttons pressed on it.
     *
     * @name Phaser.Input.Gamepad.GamepadManager#pad4
     * @type {Phaser.Input.Gamepad.Gamepad}
     * @since 3.10.0
     */
    pad4: {

        get: function ()
        {
            return this._pad4;
        }

    }

});

module.exports = GamepadManager;
