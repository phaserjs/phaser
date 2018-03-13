/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var Gamepad = require('./Gamepad');

// https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API
// https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API
// https://www.smashingmagazine.com/2015/11/gamepad-api-in-web-games/
// http://html5gamepad.com/

/**
 * @classdesc
 * [description]
 *
 * @class GamepadManager
 * @memberOf Phaser.Input.Gamepad
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Input.InputManager} inputManager - [description]
 */
var GamepadManager = new Class({

    initialize:

    function GamepadManager (inputManager)
    {
        /**
         * [description]
         *
         * @name Phaser.Input.Gamepad.GamepadManager#manager
         * @type {Phaser.Input.InputManager}
         * @since 3.0.0
         */
        this.manager = inputManager;

        /**
         * [description]
         *
         * @name Phaser.Input.Gamepad.GamepadManager#events
         * @type {[type]}
         * @since 3.0.0
         */
        this.events = inputManager.events;

        /**
         * [description]
         *
         * @name Phaser.Input.Gamepad.GamepadManager#enabled
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.enabled = false;

        /**
         * [description]
         *
         * @name Phaser.Input.Gamepad.GamepadManager#target
         * @type {null}
         * @since 3.0.0
         */
        this.target;

        /**
         * [description]
         *
         * @name Phaser.Input.Gamepad.GamepadManager#handler
         * @type {null}
         * @since 3.0.0
         */
        this.handler;

        /**
         * [description]
         *
         * @name Phaser.Input.Gamepad.GamepadManager#gamepads
         * @type {array}
         * @default []
         * @since 3.0.0
         */
        this.gamepads = [];

        /**
         * Standard FIFO queue.
         *
         * @name Phaser.Input.Gamepad.GamepadManager#queue
         * @type {array}
         * @default []
         * @since 3.0.0
         */
        this.queue = [];
    },

    /**
     * [description]
     *
     * @method Phaser.Input.Gamepad.GamepadManager#boot
     * @since 3.0.0
     */
    boot: function ()
    {
        var config = this.manager.config;

        this.enabled = config.inputGamepad && this.manager.game.device.input.gamepads;

        this.target = window;

        if (this.enabled)
        {
            this.startListeners();
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Input.Gamepad.GamepadManager#startListeners
     * @since 3.0.0
     *
     * @return {[type]} [description]
     */
    startListeners: function ()
    {
        var queue = this.queue;

        var handler = function handler (event)
        {
            if (event.defaultPrevented)
            {
                // Do nothing if event already handled
                return;
            }

            queue.push(event);
        };

        this.handler = handler;

        var target = this.target;

        target.addEventListener('gamepadconnected', handler, false);
        target.addEventListener('gamepaddisconnected', handler, false);

        //  FF only for now:
        target.addEventListener('gamepadbuttondown', handler, false);
        target.addEventListener('gamepadbuttonup', handler, false);
        target.addEventListener('gamepadaxismove', handler, false);
    },

    /**
     * [description]
     *
     * @method Phaser.Input.Gamepad.GamepadManager#stopListeners
     * @since 3.0.0
     */
    stopListeners: function ()
    {
        var target = this.target;
        var handler = this.handler;

        target.removeEventListener('gamepadconnected', handler);
        target.removeEventListener('gamepaddisconnected', handler);

        target.removeEventListener('gamepadbuttondown', handler);
        target.removeEventListener('gamepadbuttonup', handler);
        target.removeEventListener('gamepadaxismove', handler);
    },

    /**
     * [description]
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
     * [description]
     *
     * @method Phaser.Input.Gamepad.GamepadManager#addPad
     * @since 3.0.0
     *
     * @param {[type]} pad - [description]
     *
     * @return {[type]} [description]
     */
    addPad: function (pad)
    {
        var gamepad = new Gamepad(this, pad.id, pad.index);

        this.gamepads[pad.index] = gamepad;

        return gamepad;
    },

    /**
     * [description]
     *
     * @method Phaser.Input.Gamepad.GamepadManager#removePad
     * @since 3.0.0
     * @todo  Code this feature
     *
     * @param {[type]} index - [description]
     * @param {[type]} pad - [description]
     */
    removePad: function ()
    {
        //  TODO
    },

    /**
     * [description]
     *
     * @method Phaser.Input.Gamepad.GamepadManager#refreshPads
     * @since 3.0.0
     *
     * @param {[type]} pads - [description]
     */
    refreshPads: function (pads)
    {
        if (!pads)
        {
            this.disconnectAll();
        }
        else
        {
            for (var i = 0; i < pads.length; i++)
            {
                var pad = pads[i];

                if (!pad)
                {
                    //  removePad?
                    continue;
                }

                if (this.gamepads[pad.index] === undefined)
                {
                    this.addPad(pad);
                }

                this.gamepads[pad.index].update(pad);
            }
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Input.Gamepad.GamepadManager#getAll
     * @since 3.0.0
     *
     * @return {[type]} [description]
     */
    getAll: function ()
    {
        var out = [];

        for (var i = 0; i < this.gamepads.length; i++)
        {
            if (this.gamepads[i])
            {
                out.push(this.gamepads[i]);
            }
        }

        return out;
    },

    /**
     * [description]
     *
     * @method Phaser.Input.Gamepad.GamepadManager#getPad
     * @since 3.0.0
     *
     * @param {[type]} index - [description]
     *
     * @return {[type]} [description]
     */
    getPad: function (index)
    {
        for (var i = 0; i < this.gamepads.length; i++)
        {
            if (this.gamepads[i].index === index)
            {
                return this.gamepads[i];
            }
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Input.Gamepad.GamepadManager#update
     * @since 3.0.0
     *
     * @return {[type]} [description]
     */
    update: function ()
    {
        if (!this.enabled)
        {
            return;
        }

        this.refreshPads(navigator.getGamepads());

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

                    this.events.emit('connected', pad, event);

                    break;

                case 'gamepaddisconnected':

                    pad = this.getPad(event.gamepad.index);

                    this.events.emit('disconnected', pad, event);

                    break;
            }
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Input.Gamepad.GamepadManager#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.stopListeners();
        this.disconnectAll();

        this.gamepads = [];
    },

    /**
     * The total number of connected game pads.
     * 
     * @name Phaser.Input.Gamepad.GamepadManager#total
     * @type {number}
     * @since 3.0.0
     */
    total: {

        get: function ()
        {
            return this.gamepads.length;
        }

    }

});

module.exports = GamepadManager;
