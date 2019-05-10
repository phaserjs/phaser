/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var EventEmitter = require('eventemitter3');
var Events = require('./events');
var Gamepad = require('./Gamepad');
var GetValue = require('../../utils/object/GetValue');
var InputPluginCache = require('../InputPluginCache');
var InputEvents = require('../events');

/**
 * @classdesc
 * The Gamepad Plugin is an input plugin that belongs to the Scene-owned Input system.
 *
 * Its role is to listen for native DOM Gamepad Events and then process them.
 *
 * You do not need to create this class directly, the Input system will create an instance of it automatically.
 *
 * You can access it from within a Scene using `this.input.gamepad`.
 *
 * To listen for a gamepad being connected:
 *
 * ```javascript
 * this.input.gamepad.once('connected', function (pad) {
 *     //   'pad' is a reference to the gamepad that was just connected
 * });
 * ```
 *
 * Note that the browser may require you to press a button on a gamepad before it will allow you to access it,
 * this is for security reasons. However, it may also trust the page already, in which case you won't get the
 * 'connected' event and instead should check `GamepadPlugin.total` to see if it thinks there are any gamepads
 * already connected.
 *
 * Once you have received the connected event, or polled the gamepads and found them enabled, you can access
 * them via the built-in properties `GamepadPlugin.pad1` to `pad4`, for up to 4 game pads. With a reference
 * to the gamepads you can poll its buttons and axis sticks. See the properties and methods available on
 * the `Gamepad` class for more details.
 *
 * For more information about Gamepad support in browsers see the following resources:
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API
 * https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API
 * https://www.smashingmagazine.com/2015/11/gamepad-api-in-web-games/
 * http://html5gamepad.com/
 *
 * @class GamepadPlugin
 * @extends Phaser.Events.EventEmitter
 * @memberof Phaser.Input.Gamepad
 * @constructor
 * @since 3.10.0
 *
 * @param {Phaser.Input.InputPlugin} sceneInputPlugin - A reference to the Scene Input Plugin that the KeyboardPlugin belongs to.
 */
var GamepadPlugin = new Class({

    Extends: EventEmitter,

    initialize:

    function GamepadPlugin (sceneInputPlugin)
    {
        EventEmitter.call(this);

        /**
         * A reference to the Scene that this Input Plugin is responsible for.
         *
         * @name Phaser.Input.Gamepad.GamepadPlugin#scene
         * @type {Phaser.Scene}
         * @since 3.10.0
         */
        this.scene = sceneInputPlugin.scene;

        /**
         * A reference to the Scene Systems Settings.
         *
         * @name Phaser.Input.Gamepad.GamepadPlugin#settings
         * @type {Phaser.Types.Scenes.SettingsObject}
         * @since 3.10.0
         */
        this.settings = this.scene.sys.settings;

        /**
         * A reference to the Scene Input Plugin that created this Keyboard Plugin.
         *
         * @name Phaser.Input.Gamepad.GamepadPlugin#sceneInputPlugin
         * @type {Phaser.Input.InputPlugin}
         * @since 3.10.0
         */
        this.sceneInputPlugin = sceneInputPlugin;

        /**
         * A boolean that controls if the Gamepad Manager is enabled or not.
         * Can be toggled on the fly.
         *
         * @name Phaser.Input.Gamepad.GamepadPlugin#enabled
         * @type {boolean}
         * @default true
         * @since 3.10.0
         */
        this.enabled = true;

        /**
         * The Gamepad Event target, as defined in the Game Config.
         * Typically the browser window, but can be any interactive DOM element.
         *
         * @name Phaser.Input.Gamepad.GamepadPlugin#target
         * @type {any}
         * @since 3.10.0
         */
        this.target;

        /**
         * An array of the connected Gamepads.
         *
         * @name Phaser.Input.Gamepad.GamepadPlugin#gamepads
         * @type {Phaser.Input.Gamepad.Gamepad[]}
         * @default []
         * @since 3.10.0
         */
        this.gamepads = [];

        /**
         * An internal event queue.
         *
         * @name Phaser.Input.Gamepad.GamepadPlugin#queue
         * @type {GamepadEvent[]}
         * @private
         * @since 3.10.0
         */
        this.queue = [];

        /**
         * Internal event handler.
         *
         * @name Phaser.Input.Gamepad.GamepadPlugin#onGamepadHandler
         * @type {function}
         * @private
         * @since 3.10.0
         */
        this.onGamepadHandler;

        /**
         * Internal Gamepad reference.
         *
         * @name Phaser.Input.Gamepad.GamepadPlugin#_pad1
         * @type {Phaser.Input.Gamepad.Gamepad}
         * @private
         * @since 3.10.0
         */
        this._pad1;

        /**
         * Internal Gamepad reference.
         *
         * @name Phaser.Input.Gamepad.GamepadPlugin#_pad2
         * @type {Phaser.Input.Gamepad.Gamepad}
         * @private
         * @since 3.10.0
         */
        this._pad2;

        /**
         * Internal Gamepad reference.
         *
         * @name Phaser.Input.Gamepad.GamepadPlugin#_pad3
         * @type {Phaser.Input.Gamepad.Gamepad}
         * @private
         * @since 3.10.0
         */
        this._pad3;

        /**
         * Internal Gamepad reference.
         *
         * @name Phaser.Input.Gamepad.GamepadPlugin#_pad4
         * @type {Phaser.Input.Gamepad.Gamepad}
         * @private
         * @since 3.10.0
         */
        this._pad4;

        sceneInputPlugin.pluginEvents.once(InputEvents.BOOT, this.boot, this);
        sceneInputPlugin.pluginEvents.on(InputEvents.START, this.start, this);
    },

    /**
     * This method is called automatically, only once, when the Scene is first created.
     * Do not invoke it directly.
     *
     * @method Phaser.Input.Gamepad.GamepadPlugin#boot
     * @private
     * @since 3.10.0
     */
    boot: function ()
    {
        var game = this.scene.sys.game;
        var settings = this.settings.input;
        var config = game.config;

        this.enabled = GetValue(settings, 'gamepad', config.inputGamepad) && game.device.input.gamepads;
        this.target = GetValue(settings, 'gamepad.target', config.inputGamepadEventTarget);

        this.sceneInputPlugin.pluginEvents.once(InputEvents.DESTROY, this.destroy, this);
    },

    /**
     * This method is called automatically by the Scene when it is starting up.
     * It is responsible for creating local systems, properties and listening for Scene events.
     * Do not invoke it directly.
     *
     * @method Phaser.Input.Gamepad.GamepadPlugin#start
     * @private
     * @since 3.10.0
     */
    start: function ()
    {
        if (this.enabled)
        {
            this.startListeners();
        }

        this.sceneInputPlugin.pluginEvents.once(InputEvents.SHUTDOWN, this.shutdown, this);
    },

    /**
     * Checks to see if both this plugin and the Scene to which it belongs is active.
     *
     * @method Phaser.Input.Gamepad.GamepadPlugin#isActive
     * @since 3.10.0
     *
     * @return {boolean} `true` if the plugin and the Scene it belongs to is active.
     */
    isActive: function ()
    {
        return (this.enabled && this.scene.sys.isActive());
    },

    /**
     * Starts the Gamepad Event listeners running.
     * This is called automatically and does not need to be manually invoked.
     *
     * @method Phaser.Input.Gamepad.GamepadPlugin#startListeners
     * @private
     * @since 3.10.0
     */
    startListeners: function ()
    {
        var _this = this;
        var target = this.target;

        var handler = function (event)
        {
            // console.log(event);

            if (event.defaultPrevented || !_this.isActive())
            {
                // Do nothing if event already handled
                return;
            }

            _this.refreshPads();

            _this.queue.push(event);
        };

        this.onGamepadHandler = handler;

        target.addEventListener('gamepadconnected', handler, false);
        target.addEventListener('gamepaddisconnected', handler, false);

        //  FF also supports gamepadbuttondown, gamepadbuttonup and gamepadaxismove but
        //  nothing else does, and we can get those values via the gamepads anyway, so we will
        //  until more browsers support this

        //  Finally, listen for an update event from the Input Plugin
        this.sceneInputPlugin.pluginEvents.on(InputEvents.UPDATE, this.update, this);
    },

    /**
     * Stops the Gamepad Event listeners.
     * This is called automatically and does not need to be manually invoked.
     *
     * @method Phaser.Input.Gamepad.GamepadPlugin#stopListeners
     * @private
     * @since 3.10.0
     */
    stopListeners: function ()
    {
        this.target.removeEventListener('gamepadconnected', this.onGamepadHandler);
        this.target.removeEventListener('gamepaddisconnected', this.onGamepadHandler);

        this.sceneInputPlugin.pluginEvents.off(InputEvents.UPDATE, this.update);
    },

    /**
     * Disconnects all current Gamepads.
     *
     * @method Phaser.Input.Gamepad.GamepadPlugin#disconnectAll
     * @since 3.10.0
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
     * @method Phaser.Input.Gamepad.GamepadPlugin#refreshPads
     * @private
     * @since 3.10.0
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
                    var newPad = new Gamepad(this, livePad);

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
     * @method Phaser.Input.Gamepad.GamepadPlugin#getAll
     * @since 3.10.0
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
     * @method Phaser.Input.Gamepad.GamepadPlugin#getPad
     * @since 3.10.0
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
     * @method Phaser.Input.Gamepad.GamepadPlugin#update
     * @private
     * @fires Phaser.Input.Gamepad.Events#CONNECTED
     * @fires Phaser.Input.Gamepad.Events#DISCONNECTED
     * @since 3.10.0
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
            var pad = this.getPad(event.gamepad.index);

            if (event.type === 'gamepadconnected')
            {
                this.emit(Events.CONNECTED, pad, event);
            }
            else if (event.type === 'gamepaddisconnected')
            {
                this.emit(Events.DISCONNECTED, pad, event);
            }
        }
    },

    /**
     * Shuts the Gamepad Plugin down.
     * All this does is remove any listeners bound to it.
     *
     * @method Phaser.Input.Gamepad.GamepadPlugin#shutdown
     * @private
     * @since 3.10.0
     */
    shutdown: function ()
    {
        this.stopListeners();

        this.disconnectAll();

        this.removeAllListeners();
    },

    /**
     * Destroys this Gamepad Plugin, disconnecting all Gamepads and releasing internal references.
     *
     * @method Phaser.Input.Gamepad.GamepadPlugin#destroy
     * @private
     * @since 3.10.0
     */
    destroy: function ()
    {
        this.shutdown();

        for (var i = 0; i < this.gamepads.length; i++)
        {
            if (this.gamepads[i])
            {
                this.gamepads[i].destroy();
            }
        }

        this.gamepads = [];

        this.scene = null;
        this.settings = null;
        this.sceneInputPlugin = null;
        this.target = null;
    },

    /**
     * The total number of connected game pads.
     *
     * @name Phaser.Input.Gamepad.GamepadPlugin#total
     * @type {integer}
     * @since 3.10.0
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
     * @name Phaser.Input.Gamepad.GamepadPlugin#pad1
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
     * @name Phaser.Input.Gamepad.GamepadPlugin#pad2
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
     * @name Phaser.Input.Gamepad.GamepadPlugin#pad3
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
     * @name Phaser.Input.Gamepad.GamepadPlugin#pad4
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

/**
 * An instance of the Gamepad Plugin class, if enabled via the `input.gamepad` Scene or Game Config property.
 * Use this to create access Gamepads connected to the browser and respond to gamepad buttons.
 *
 * @name Phaser.Input.InputPlugin#gamepad
 * @type {?Phaser.Input.Gamepad.GamepadPlugin}
 * @since 3.10.0
 */
InputPluginCache.register('GamepadPlugin', GamepadPlugin, 'gamepad', 'gamepad', 'inputGamepad');

module.exports = GamepadPlugin;
