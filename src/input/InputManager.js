/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var CONST = require('./const');
var EventEmitter = require('eventemitter3');
var Gamepad = require('./gamepad/GamepadManager');
var Keyboard = require('./keyboard/KeyboardManager');
var Mouse = require('./mouse/MouseManager');
var Pointer = require('./Pointer');
var Rectangle = require('../geom/rectangle/Rectangle');
var Touch = require('./touch/TouchManager');
var TransformMatrix = require('../gameobjects/components/TransformMatrix');
var TransformXY = require('../math/TransformXY');

/**
 * @classdesc
 * [description]
 *
 * @class InputManager
 * @memberOf Phaser.Input
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Game} game - [description]
 * @param {object} config - [description]
 */
var InputManager = new Class({

    initialize:

    function InputManager (game, config)
    {
        /**
         * [description]
         *
         * @name Phaser.Input.InputManager#game
         * @type {Phaser.Game}
         * @since 3.0.0
         */
        this.game = game;

        /**
         * [description]
         *
         * @name Phaser.Input.InputManager#canvas
         * @type {HTMLCanvasElement}
         * @since 3.0.0
         */
        this.canvas;

        /**
         * [description]
         *
         * @name Phaser.Input.InputManager#config
         * @type {object}
         * @since 3.0.0
         */
        this.config = config;

        /**
         * [description]
         *
         * @name Phaser.Input.InputManager#enabled
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.enabled = true;

        /**
         * [description]
         *
         * @name Phaser.Input.InputManager#events
         * @type {Phaser.Events.EventEmitter}
         * @since 3.0.0
         */
        this.events = new EventEmitter();

        /**
         * Standard FIFO queue.
         *
         * @name Phaser.Input.InputManager#queue
         * @type {array}
         * @default []
         * @since 3.0.0
         */
        this.queue = [];

        /**
         * DOM Callbacks container.
         *
         * @name Phaser.Input.InputManager#domCallbacks
         * @private
         * @type {object}
         * @since 3.10.0
         */
        this.domCallbacks = { up: [], down: [], move: [], upOnce: [], downOnce: [], moveOnce: [] };

        /**
         * Are there any up callbacks defined?
         *
         * @name Phaser.Input.InputManager#_hasUpCallback
         * @private
         * @type {boolean}
         * @since 3.10.0
         */
        this._hasUpCallback = false;

        /**
         * Are there any down callbacks defined?
         *
         * @name Phaser.Input.InputManager#_hasDownCallback
         * @private
         * @type {boolean}
         * @since 3.10.0
         */
        this._hasDownCallback = false;

        /**
         * Are there any move callbacks defined?
         *
         * @name Phaser.Input.InputManager#_hasMoveCallback
         * @private
         * @type {boolean}
         * @since 3.10.0
         */
        this._hasMoveCallback = false;

        /**
         * A reference to the Keyboard Manager class, if enabled via the `input.keyboard` Game Config property.
         *
         * @name Phaser.Input.InputManager#keyboard
         * @type {?Phaser.Input.Keyboard.KeyboardManager}
         * @since 3.0.0
         */
        this.keyboard = (config.inputKeyboard) ? new Keyboard(this) : null;

        /**
         * A reference to the Mouse Manager class, if enabled via the `input.mouse` Game Config property.
         *
         * @name Phaser.Input.InputManager#mouse
         * @type {?Phaser.Input.Mouse.MouseManager}
         * @since 3.0.0
         */
        this.mouse = (config.inputMouse) ? new Mouse(this) : null;

        /**
         * A reference to the Touch Manager class, if enabled via the `input.touch` Game Config property.
         *
         * @name Phaser.Input.InputManager#touch
         * @type {Phaser.Input.Touch.TouchManager}
         * @since 3.0.0
         */
        this.touch = (config.inputTouch) ? new Touch(this) : null;

        /**
         * A reference to the Gamepad Manager class, if enabled via the `input.gamepad` Game Config property.
         *
         * @name Phaser.Input.InputManager#gamepad
         * @type {Phaser.Input.Gamepad.GamepadManager}
         * @since 3.0.0
         */
        this.gamepad = (config.inputGamepad) ? new Gamepad(this) : null;

        /**
         * An array of Pointers that have been added to the game.
         * The first entry is reserved for the Mouse Pointer, the rest are Touch Pointers.
         * 
         * By default there is 1 touch pointer enabled. If you need more use the `addPointer` method to start them,
         * or set the `input.activePointers` property in the Game Config.
         *
         * @name Phaser.Input.InputManager#pointers
         * @type {Phaser.Input.Pointer[]}
         * @since 3.10.0
         */
        this.pointers = [];

        /**
         * The number of touch objects activated and being processed each update.
         * 
         * You can change this by either calling `addPointer` at run-time, or by
         * setting the `input.activePointers` property in the Game Config.
         *
         * @name Phaser.Input.InputManager#pointersTotal
         * @type {integer}
         * @readOnly
         * @since 3.10.0
         */
        this.pointersTotal = config.inputActivePointers;

        for (var i = 0; i <= this.pointersTotal; i++)
        {
            this.pointers.push(new Pointer(this, i));
        }

        /**
         * The mouse has its own unique Pointer object, which you can reference directly if making a _desktop specific game_.
         * If you are supporting both desktop and touch devices then do not use this property, instead use `activePointer`
         * which will always map to the most recently interacted pointer.
         *
         * @name Phaser.Input.InputManager#mousePointer
         * @type {?Phaser.Input.Pointer}
         * @since 3.10.0
         */
        this.mousePointer = (config.inputMouse) ? this.pointers[0] : null;

        /**
         * The most recently active Pointer object.
         *
         * If you've only 1 Pointer in your game then this will accurately be either the first finger touched, or the mouse.
         *
         * If your game doesn't need to support multi-touch then you can safely use this property in all of your game
         * code and it will adapt to be either the mouse or the touch, based on device.
         *
         * @name Phaser.Input.InputManager#activePointer
         * @type {Phaser.Input.Pointer}
         * @since 3.0.0
         */
        this.activePointer = this.pointers[0];

        /**
         * Reset every frame. Set to `true` if any of the Pointers are dirty this frame.
         *
         * @name Phaser.Input.InputManager#dirty
         * @type {boolean}
         * @since 3.10.0
         */
        this.dirty = false;

        /**
         * [description]
         *
         * @name Phaser.Input.InputManager#scale
         * @type {{x:number,y:number}}
         * @since 3.0.0
         */
        this.scale = { x: 1, y: 1 };

        /**
         * If the top-most Scene in the Scene List receives an input it will stop input from
         * propagating any lower down the scene list, i.e. if you have a UI Scene at the top
         * and click something on it, that click will not then be passed down to any other
         * Scene below. Disable this to have input events passed through all Scenes, all the time.
         *
         * @name Phaser.Input.InputManager#globalTopOnly
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.globalTopOnly = true;

        /**
         * [description]
         *
         * @name Phaser.Input.InputManager#ignoreEvents
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.ignoreEvents = false;

        /**
         * [description]
         *
         * @name Phaser.Input.InputManager#bounds
         * @type {Phaser.Geom.Rectangle}
         * @since 3.0.0
         */
        this.bounds = new Rectangle();

        /**
         * [description]
         *
         * @name Phaser.Input.InputManager#_tempPoint
         * @type {{x:number,y:number}}
         * @private
         * @since 3.0.0
         */
        this._tempPoint = { x: 0, y: 0 };

        /**
         * [description]
         *
         * @name Phaser.Input.InputManager#_tempHitTest
         * @type {array}
         * @private
         * @default []
         * @since 3.0.0
         */
        this._tempHitTest = [];

        /**
         * [description]
         *
         * @name Phaser.Input.InputManager#_tempMatrix
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @private
         * @since 3.4.0
         */
        this._tempMatrix = new TransformMatrix();

        game.events.once('boot', this.boot, this);
    },

    /**
     * The Boot handler is called by Phaser.Game when it first starts up.
     * The renderer is available by now.
     *
     * @method Phaser.Input.InputManager#boot
     * @since 3.0.0
     */
    boot: function ()
    {
        this.canvas = this.game.canvas;

        this.updateBounds();

        this.events.emit('boot');

        this.game.events.on('prestep', this.update, this);
        this.game.events.once('destroy', this.destroy, this);
    },

    /**
     * [description]
     *
     * @method Phaser.Input.InputManager#updateBounds
     * @since 3.0.0
     */
    updateBounds: function ()
    {
        var bounds = this.bounds;

        var clientRect = this.canvas.getBoundingClientRect();

        bounds.x = clientRect.left + window.pageXOffset - document.documentElement.clientLeft;
        bounds.y = clientRect.top + window.pageYOffset - document.documentElement.clientTop;
        bounds.width = clientRect.width;
        bounds.height = clientRect.height;
    },

    /**
     * [description]
     *
     * @method Phaser.Input.InputManager#resize
     * @since 3.2.0
     */
    resize: function ()
    {
        this.updateBounds();

        //  Game config size
        var gw = this.game.config.width;
        var gh = this.game.config.height;

        //  Actual canvas size
        var bw = this.bounds.width;
        var bh = this.bounds.height;

        //  Scale factor
        this.scale.x = gw / bw;
        this.scale.y = gh / bh;
    },

    /**
     * [description]
     *
     * @method Phaser.Input.InputManager#update
     * @private
     * @since 3.0.0
     *
     * @param {number} time - [description]
     */
    update: function (time)
    {
        this.events.emit('update');

        this.ignoreEvents = false;

        this.dirty = false;

        var len = this.queue.length;

        var pointers = this.pointers;

        for (var i = 0; i < this.pointersTotal; i++)
        {
            pointers[i].reset();
        }

        if (!this.enabled || len === 0)
        {
            return;
        }

        this.dirty = true;

        this.updateBounds();

        this.scale.x = this.game.config.width / this.bounds.width;
        this.scale.y = this.game.config.height / this.bounds.height;

        //  Clears the queue array, and also means we don't work on array data that could potentially
        //  be modified during the processing phase
        var queue = this.queue.splice(0, len);
        var mouse = this.mousePointer;

        //  Process the event queue, dispatching all of the events that have stored up
        for (var i = 0; i < len; i += 2)
        {
            var type = queue[i];
            var event = queue[i + 1];

            switch (type)
            {
                case CONST.MOUSE_DOWN:
                    mouse.down(event, time);
                    break;

                case CONST.MOUSE_MOVE:
                    mouse.move(event, time);
                    break;

                case CONST.MOUSE_UP:
                    mouse.up(event, time);
                    break;

                case CONST.TOUCH_START:
                    this.startPointer(event, time);
                    break;

                case CONST.TOUCH_MOVE:
                    this.updatePointer(event, time);
                    break;

                case CONST.TOUCH_END:
                    this.stopPointer(event, time);
                    break;

                case CONST.POINTER_LOCK_CHANGE:
                    this.events.emit('pointerlockchange', event, this.mouse.locked);
                    break;
            }
        }
    },

    //  event.targetTouches = list of all touches on the TARGET ELEMENT (i.e. game dom element)
    //  event.touches = list of all touches on the ENTIRE DOCUMENT, not just the target element
    //  event.changedTouches = the touches that CHANGED in this event, not the total number of them
    startPointer: function (event, time)
    {
        var pointers = this.pointers;

        for (var c = 0; c < event.changedTouches.length; c++)
        {
            var changedTouch = event.changedTouches[c];

            for (var i = 1; i < this.pointersTotal; i++)
            {
                var pointer = pointers[i];

                if (!pointer.active)
                {
                    pointer.touchstart(changedTouch, time);
                    this.activePointer = pointer;
                    break;
                }
            }
        }
    },

    updatePointer: function (event, time)
    {
        var pointers = this.pointers;

        for (var c = 0; c < event.changedTouches.length; c++)
        {
            var changedTouch = event.changedTouches[c];

            for (var i = 1; i < this.pointersTotal; i++)
            {
                var pointer = pointers[i];

                if (pointer.active && pointer.identifier === changedTouch.identifier)
                {
                    pointer.touchmove(changedTouch, time);
                    this.activePointer = pointer;
                    break;
                }
            }
        }
    },

    //  For touch end its a list of the touch points that have been removed from the surface
    //  https://developer.mozilla.org/en-US/docs/DOM/TouchList
    //  event.changedTouches = the touches that CHANGED in this event, not the total number of them
    stopPointer: function (event, time)
    {
        var pointers = this.pointers;

        for (var c = 0; c < event.changedTouches.length; c++)
        {
            var changedTouch = event.changedTouches[c];

            for (var i = 1; i < this.pointersTotal; i++)
            {
                var pointer = pointers[i];

                if (pointer.active && pointer.identifier === changedTouch.identifier)
                {
                    pointer.touchend(changedTouch, time);
                    break;
                }
            }
        }
    },

    /**
     * Adds new Pointer objects to the Input Manager.
     * 
     * By default Phaser creates 2 pointer objects: `mousePointer` and `pointer1`.
     * 
     * You can create more either by calling this method, or by setting the `input.activePointers` property
     * in the Game Config.
     * 
     * The first 10 pointers are available via the `InputPlugin.pointerX` properties.
     *
     * @method Phaser.Input.InputManager#addPointer
     * @since 3.10.0
     *
     * @param {integer} [quantity=1] The number of new Pointers to create.
     * 
     * @return {Phaser.Input.Pointer[]} An array containing all of the new Pointer objects that were created.
     */
    addPointer: function (quantity)
    {
        if (quantity === undefined) { quantity = 1; }

        var output = [];

        for (var i = 0; i < quantity; i++)
        {
            var id = this.pointers.length;

            var pointer = new Pointer(this, id);

            this.pointers.push(pointer);

            this.pointersTotal++;

            output.push(pointer);
        }

        return output;
    },

    /**
     * Process any pending DOM callbacks.
     *
     * @method Phaser.Input.InputManager#processDomCallbacks
     * @private
     * @since 3.10.0
     *
     * @param {array} once - The isOnce callbacks to invoke.
     * @param {array} every - The every frame callbacks to invoke.
     * @param {any} event - The native DOM event that is passed to the callbacks.
     *
     * @return {boolean} `true` if there are callbacks still in the list, otherwise `false`.
     */
    processDomCallbacks: function (once, every, event)
    {
        var i = 0;

        for (i = 0; i < once.length; i++)
        {
            once[i](event);
        }

        for (i = 0; i < every.length; i++)
        {
            every[i](event);
        }

        once = [];

        return (every.length > 0);
    },

    /**
     * Queues a touch start event, as passed in by the TouchManager.
     * Also dispatches any DOM callbacks for this event.
     *
     * @method Phaser.Input.InputManager#queueTouchStart
     * @private
     * @since 3.10.0
     *
     * @param {any} event - The native DOM event.
     */
    queueTouchStart: function (event)
    {
        this.queue.push(CONST.TOUCH_START, event);

        if (this._hasDownCallback)
        {
            var callbacks = this.domCallbacks;

            this._hasDownCallback = this.processDomCallbacks(callbacks.downOnce, callbacks.down, event);
        }
    },

    /**
     * Queues a touch move event, as passed in by the TouchManager.
     * Also dispatches any DOM callbacks for this event.
     *
     * @method Phaser.Input.InputManager#queueTouchMove
     * @private
     * @since 3.10.0
     *
     * @param {any} event - The native DOM event.
     */
    queueTouchMove: function (event)
    {
        this.queue.push(CONST.TOUCH_MOVE, event);

        if (this._hasMoveCallback)
        {
            var callbacks = this.domCallbacks;

            this._hasMoveCallback = this.processDomCallbacks(callbacks.moveOnce, callbacks.move, event);
        }
    },

    /**
     * Queues a touch end event, as passed in by the TouchManager.
     * Also dispatches any DOM callbacks for this event.
     *
     * @method Phaser.Input.InputManager#queueTouchEnd
     * @private
     * @since 3.10.0
     *
     * @param {any} event - The native DOM event.
     */
    queueTouchEnd: function (event)
    {
        this.queue.push(CONST.TOUCH_END, event);

        if (this._hasUpCallback)
        {
            var callbacks = this.domCallbacks;

            this._hasUpCallback = this.processDomCallbacks(callbacks.upOnce, callbacks.up, event);
        }
    },

    /**
     * Queues a mouse down event, as passed in by the MouseManager.
     * Also dispatches any DOM callbacks for this event.
     *
     * @method Phaser.Input.InputManager#queueMouseDown
     * @private
     * @since 3.10.0
     *
     * @param {any} event - The native DOM event.
     */
    queueMouseDown: function (event)
    {
        this.queue.push(CONST.MOUSE_DOWN, event);

        if (this._hasDownCallback)
        {
            var callbacks = this.domCallbacks;

            this._hasDownCallback = this.processDomCallbacks(callbacks.downOnce, callbacks.down, event);
        }
    },

    /**
     * Queues a mouse move event, as passed in by the MouseManager.
     * Also dispatches any DOM callbacks for this event.
     *
     * @method Phaser.Input.InputManager#queueMouseMove
     * @private
     * @since 3.10.0
     *
     * @param {any} event - The native DOM event.
     */
    queueMouseMove: function (event)
    {
        this.queue.push(CONST.MOUSE_MOVE, event);

        if (this._hasMoveCallback)
        {
            var callbacks = this.domCallbacks;

            this._hasMoveCallback = this.processDomCallbacks(callbacks.moveOnce, callbacks.move, event);
        }
    },

    /**
     * Queues a mouse up event, as passed in by the MouseManager.
     * Also dispatches any DOM callbacks for this event.
     *
     * @method Phaser.Input.InputManager#queueMouseUp
     * @private
     * @since 3.10.0
     *
     * @param {any} event - The native DOM event.
     */
    queueMouseUp: function (event)
    {
        this.queue.push(CONST.MOUSE_UP, event);

        if (this._hasUpCallback)
        {
            var callbacks = this.domCallbacks;

            this._hasUpCallback = this.processDomCallbacks(callbacks.upOnce, callbacks.up, event);
        }
    },

    /**
     * Adds a callback to be invoked whenever the native DOM `mouseup` or `touchend` events are received.
     * By setting the `isOnce` argument you can control if the callback is called once,
     * or every time the DOM event occurs.
     *
     * Callbacks passed to this method are invoked _immediately_ when the DOM event happens,
     * within the scope of the DOM event handler. Therefore, they are considered as 'native'
     * from the perspective of the browser. This means they can be used for tasks such as
     * opening new browser windows, or anything which explicitly requires user input to activate.
     * However, as a result of this, they come with their own risks, and as such should not be used
     * for general game input, but instead be reserved for special circumstances.
     *
     * If all you're trying to do is execute a callback when a pointer is released, then
     * please use the internal Input event system instead.
     *
     * Please understand that these callbacks are invoked when the browser feels like doing so,
     * which may be entirely out of the normal flow of the Phaser Game Loop. Therefore, you should absolutely keep
     * Phaser related operations to a minimum in these callbacks. For example, don't destroy Game Objects,
     * change Scenes or manipulate internal systems, otherwise you run a very real risk of creating
     * heisenbugs (https://en.wikipedia.org/wiki/Heisenbug) that prove a challenge to reproduce, never mind
     * solve.
     *
     * @method Phaser.Input.InputManager#addUpCallback
     * @since 3.10.0
     *
     * @param {function} callback - The callback to be invoked on this dom event.
     * @param {boolean} [isOnce=true] - `true` if the callback will only be invoked once, `false` to call every time this event happens.
     *
     * @return {this} The Input Manager.
     */
    addUpCallback: function (callback, isOnce)
    {
        if (isOnce === undefined) { isOnce = true; }

        if (isOnce)
        {
            this.domCallbacks.upOnce.push(callback);
        }
        else
        {
            this.domCallbacks.up.push(callback);
        }

        this._hasUpCallback = true;

        return this;
    },

    /**
     * Adds a callback to be invoked whenever the native DOM `mousedown` or `touchstart` events are received.
     * By setting the `isOnce` argument you can control if the callback is called once,
     * or every time the DOM event occurs.
     *
     * Callbacks passed to this method are invoked _immediately_ when the DOM event happens,
     * within the scope of the DOM event handler. Therefore, they are considered as 'native'
     * from the perspective of the browser. This means they can be used for tasks such as
     * opening new browser windows, or anything which explicitly requires user input to activate.
     * However, as a result of this, they come with their own risks, and as such should not be used
     * for general game input, but instead be reserved for special circumstances.
     *
     * If all you're trying to do is execute a callback when a pointer is down, then
     * please use the internal Input event system instead.
     *
     * Please understand that these callbacks are invoked when the browser feels like doing so,
     * which may be entirely out of the normal flow of the Phaser Game Loop. Therefore, you should absolutely keep
     * Phaser related operations to a minimum in these callbacks. For example, don't destroy Game Objects,
     * change Scenes or manipulate internal systems, otherwise you run a very real risk of creating
     * heisenbugs (https://en.wikipedia.org/wiki/Heisenbug) that prove a challenge to reproduce, never mind
     * solve.
     *
     * @method Phaser.Input.InputManager#addDownCallback
     * @since 3.10.0
     *
     * @param {function} callback - The callback to be invoked on this dom event.
     * @param {boolean} [isOnce=true] - `true` if the callback will only be invoked once, `false` to call every time this event happens.
     *
     * @return {this} The Input Manager.
     */
    addDownCallback: function (callback, isOnce)
    {
        if (isOnce === undefined) { isOnce = true; }

        if (isOnce)
        {
            this.domCallbacks.downOnce.push(callback);
        }
        else
        {
            this.domCallbacks.down.push(callback);
        }

        this._hasDownCallback = true;

        return this;
    },

    /**
     * Adds a callback to be invoked whenever the native DOM `mousemove` or `touchmove` events are received.
     * By setting the `isOnce` argument you can control if the callback is called once,
     * or every time the DOM event occurs.
     *
     * Callbacks passed to this method are invoked _immediately_ when the DOM event happens,
     * within the scope of the DOM event handler. Therefore, they are considered as 'native'
     * from the perspective of the browser. This means they can be used for tasks such as
     * opening new browser windows, or anything which explicitly requires user input to activate.
     * However, as a result of this, they come with their own risks, and as such should not be used
     * for general game input, but instead be reserved for special circumstances.
     *
     * If all you're trying to do is execute a callback when a pointer is moved, then
     * please use the internal Input event system instead.
     *
     * Please understand that these callbacks are invoked when the browser feels like doing so,
     * which may be entirely out of the normal flow of the Phaser Game Loop. Therefore, you should absolutely keep
     * Phaser related operations to a minimum in these callbacks. For example, don't destroy Game Objects,
     * change Scenes or manipulate internal systems, otherwise you run a very real risk of creating
     * heisenbugs (https://en.wikipedia.org/wiki/Heisenbug) that prove a challenge to reproduce, never mind
     * solve.
     *
     * @method Phaser.Input.InputManager#addMoveCallback
     * @since 3.10.0
     *
     * @param {function} callback - The callback to be invoked on this dom event.
     * @param {boolean} [isOnce=false] - `true` if the callback will only be invoked once, `false` to call every time this event happens.
     *
     * @return {this} The Input Manager.
     */
    addMoveCallback: function (callback, isOnce)
    {
        if (isOnce === undefined) { isOnce = false; }

        if (isOnce)
        {
            this.domCallbacks.moveOnce.push(callback);
        }
        else
        {
            this.domCallbacks.move.push(callback);
        }

        this._hasMoveCallback = true;

        return this;
    },

    /**
     * Will always return an array.
     * Array contains matching Interactive Objects.
     * Array will be empty if no objects were matched.
     * x/y = pointer x/y (un-translated)
     *
     * @method Phaser.Input.InputManager#hitTest
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     * @param {array} gameObjects - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     * @param {array} output - [description]
     *
     * @return {array} [description]
     */
    hitTest: function (x, y, gameObjects, camera, output)
    {
        if (output === undefined) { output = this._tempHitTest; }

        var tempPoint = this._tempPoint;
        var cameraW = camera.width;
        var cameraH = camera.height;

        output.length = 0;

        if (!(x >= camera.x && y >= camera.y && x <= camera.x + cameraW && y <= camera.y + cameraH))
        {
            return output;
        }

        //  Stores the world point inside of tempPoint
        camera.getWorldPoint(x, y, tempPoint);

        var culledGameObjects = camera.cull(gameObjects);

        var point = { x: 0, y: 0 };

        var res = this.game.config.resolution;

        var matrix = this._tempMatrix;

        for (var i = 0; i < culledGameObjects.length; i++)
        {
            var gameObject = culledGameObjects[i];

            if (!gameObject.input || !gameObject.input.enabled || !gameObject.willRender())
            {
                continue;
            }

            var px = tempPoint.x * res + (camera.scrollX * gameObject.scrollFactorX) - camera.scrollX;
            var py = tempPoint.y * res + (camera.scrollY * gameObject.scrollFactorY) - camera.scrollY;

            if (gameObject.parentContainer)
            {
                gameObject.getWorldTransformMatrix(matrix);

                TransformXY(px, py, matrix.tx, matrix.ty, matrix.rotation, matrix.scaleX, matrix.scaleY, point);
            }
            else
            {
                TransformXY(px, py, gameObject.x, gameObject.y, gameObject.rotation, gameObject.scaleX, gameObject.scaleY, point);
            }

            if (this.pointWithinHitArea(gameObject, point.x, point.y))
            {
                output.push(gameObject);
            }
        }

        return output;
    },

    /**
     * x/y MUST be translated before being passed to this function,
     * unless the gameObject is guaranteed to not be rotated or scaled in any way.
     *
     * @method Phaser.Input.InputManager#pointWithinHitArea
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} gameObject - [description]
     * @param {number} x - [description]
     * @param {number} y - [description]
     *
     * @return {boolean} [description]
     */
    pointWithinHitArea: function (gameObject, x, y)
    {
        var input = gameObject.input;

        //  Normalize the origin
        x += gameObject.displayOriginX;
        y += gameObject.displayOriginY;

        if (input.hitAreaCallback(input.hitArea, x, y, gameObject))
        {
            input.localX = x;
            input.localY = y;

            return true;
        }
        else
        {
            return false;
        }
    },

    /**
     * x/y MUST be translated before being passed to this function,
     * unless the gameObject is guaranteed to not be rotated or scaled in any way.
     *
     * @method Phaser.Input.InputManager#pointWithinInteractiveObject
     * @since 3.0.0
     *
     * @param {Phaser.Input.InteractiveObject} object - [description]
     * @param {number} x - [description]
     * @param {number} y - [description]
     *
     * @return {boolean} [description]
     */
    pointWithinInteractiveObject: function (object, x, y)
    {
        if (!object.hitArea)
        {
            return false;
        }

        //  Normalize the origin
        x += object.gameObject.displayOriginX;
        y += object.gameObject.displayOriginY;

        object.localX = x;
        object.localY = y;

        return object.hitAreaCallback(object.hitArea, x, y, object);
    },

    /**
     * [description]
     *
     * @method Phaser.Input.InputManager#transformX
     * @since 3.0.0
     *
     * @param {number} pageX - [description]
     *
     * @return {number} [description]
     */
    transformX: function (pageX)
    {
        return (pageX - this.bounds.left) * this.scale.x;
    },

    /**
     * [description]
     *
     * @method Phaser.Input.InputManager#transformY
     * @since 3.0.0
     *
     * @param {number} pageY - [description]
     *
     * @return {number} [description]
     */
    transformY: function (pageY)
    {
        return (pageY - this.bounds.top) * this.scale.y;
    },

    /**
     * [description]
     *
     * @method Phaser.Input.InputManager#getOffsetX
     * @since 3.0.0
     *
     * @return {number} [description]
     */
    getOffsetX: function ()
    {
        return this.bounds.left;
    },

    /**
     * [description]
     *
     * @method Phaser.Input.InputManager#getOffsetY
     * @since 3.0.0
     *
     * @return {number} [description]
     */
    getOffsetY: function ()
    {
        return this.bounds.top;
    },

    /**
     * [description]
     *
     * @method Phaser.Input.InputManager#getScaleX
     * @since 3.0.0
     *
     * @return {number} [description]
     */
    getScaleX: function ()
    {
        return this.game.config.width / this.bounds.width;
    },

    /**
     * [description]
     *
     * @method Phaser.Input.InputManager#getScaleY
     * @since 3.0.0
     *
     * @return {number} [description]
     */
    getScaleY: function ()
    {
        return this.game.config.height / this.bounds.height;
    },

    /**
     * [description]
     *
     * @method Phaser.Input.InputManager#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.events.removeAllListeners();

        this.keyboard.destroy();
        this.mouse.destroy();
        this.touch.destroy();
        this.gamepad.destroy();

        this.activePointer.destroy();

        this.queue = [];

        this.game = null;
    }

});

module.exports = InputManager;
