//  Phaser.Input.Gamepad.GamepadManager

var Class = require('../../utils/Class');
var Gamepad = require('./Gamepad');
var GamepadEvent = require('./events/');

// https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API
// https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API
// https://www.smashingmagazine.com/2015/11/gamepad-api-in-web-games/
// http://html5gamepad.com/

var GamepadManager = new Class({

    initialize:

    function GamepadManager (inputManager)
    {
        this.manager = inputManager;

        this.events = inputManager.events;

        this.enabled = false;

        this.target;

        this.handler;

        this.gamepads = [];

        //   Standard FIFO queue
        this.queue = [];
    },

    boot: function ()
    {
        var config = this.manager.config;

        this.enabled = config.inputGamepad && this.manager.game.device.Input.gamepads;

        this.target = window;

        if (this.enabled)
        {
            this.startListeners();
        }
    },

    startListeners: function ()
    {
        var queue = this.queue;

        var handler = function (event)
        {
            if (event.preventDefaulted)
            {
                // Do nothing if event already handled
                return;
            }

            queue.push(event);
        };

        this.handler = handler;

        this.target.addEventListener('gamepadconnected', handler, false);
        this.target.addEventListener('gamepaddisconnected', handler, false);

        //  FF only for now:
        this.target.addEventListener('gamepadbuttondown', handler, false);
        this.target.addEventListener('gamepadbuttonup', handler, false);
        this.target.addEventListener('gamepadaxismove', handler, false);
    },

    stopListeners: function ()
    {
        this.target.removeEventListener('gamepadconnected', this.handler);
        this.target.removeEventListener('gamepaddisconnected', this.handler);

        this.target.removeEventListener('gamepadbuttondown', this.handler);
        this.target.removeEventListener('gamepadbuttonup', this.handler);
        this.target.removeEventListener('gamepadaxismove', this.handler);
    },

    disconnectAll: function ()
    {
        for (var i = 0; i < this.gamepads.length; i++)
        {
            this.gamepads.connected = false;
        }
    },

    addPad: function (pad)
    {
        var gamepad = new Gamepad(this, pad.id, pad.index);

        this.gamepads[pad.index] = gamepad;

        return gamepad;
    },

    removePad: function (index, pad)
    {
    },

    refreshPads: function (pads)
    {
        if (pads === null)
        {
            this.disconnectAll();
        }
        else
        {
            for (var i = 0; i < pads.length; i++)
            {
                var pad = pads[i];

                if (pad === null)
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

                    this.events.dispatch(new GamepadEvent.CONNECTED(pad, event));

                    break;

                case 'gamepaddisconnected':

                    pad = this.getPad(event.gamepad.index);

                    this.events.dispatch(new GamepadEvent.DISCONNECTED(pad, event));

                    break;
            }
        }
    },

    total: {

        get: function ()
        {
            return this.gamepads.length;
        }

    }

});

module.exports = GamepadManager;
