/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var CONST = require('./const');
var EventEmitter = require('eventemitter3');
var Mouse = require('./mouse/MouseManager');
var Pointer = require('./Pointer');
var Rectangle = require('../geom/rectangle/Rectangle');
var Touch = require('./touch/TouchManager');
var TransformMatrix = require('../gameobjects/components/TransformMatrix');
var TransformXY = require('../math/TransformXY');

/**
 * @classdesc
 * The Input Manager is responsible for handling the pointer related systems in a single Phaser Game instance.
 *
 * Based on the Game Config it will create handlers for mouse and touch support.
 *
 * Keyboard and Gamepad are plugins, handled directly by the InputPlugin class.
 *
 * It then manages the event queue, pointer creation and general hit test related operations.
 *
 * You rarely need to interact with the Input Manager directly, and as such, all of its properties and methods
 * should be considered private. Instead, you should use the Input Plugin, which is a Scene level system, responsible
 * for dealing with all input events for a Scene.
 *
 * @class InputManager
 * @memberOf Phaser.Input
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Game} game - The Game instance that owns the Input Manager.
 * @param {object} config - The Input Configuration object, as set in the Game Config.
 */
var InputManager = new Class({

    initialize:

    function InputManager (game, config)
    {
        /**
         * The Game instance that owns the Input Manager.
         * A Game only maintains on instance of the Input Manager at any time.
         *
         * @name Phaser.Input.InputManager#game
         * @type {Phaser.Game}
         * @readOnly
         * @since 3.0.0
         */
        this.game = game;

        /**
         * The Canvas that is used for all DOM event input listeners.
         *
         * @name Phaser.Input.InputManager#canvas
         * @type {HTMLCanvasElement}
         * @since 3.0.0
         */
        this.canvas;

        /**
         * The Input Configuration object, as set in the Game Config.
         *
         * @name Phaser.Input.InputManager#config
         * @type {object}
         * @since 3.0.0
         */
        this.config = config;

        /**
         * If set, the Input Manager will run its update loop every frame.
         *
         * @name Phaser.Input.InputManager#enabled
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.enabled = true;

        /**
         * The Event Emitter instance that the Input Manager uses to emit events from.
         *
         * @name Phaser.Input.InputManager#events
         * @type {Phaser.Events.EventEmitter}
         * @since 3.0.0
         */
        this.events = new EventEmitter();

        /**
         * A standard FIFO queue for the native DOM events waiting to be handled by the Input Manager.
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
         * Is a custom cursor currently set? (desktop only)
         *
         * @name Phaser.Input.InputManager#_customCursor
         * @private
         * @type {string}
         * @since 3.10.0
         */
        this._customCursor = '';

        /**
         * Custom cursor tracking value.
         *
         * 0 - No change.
         * 1 - Set new cursor.
         * 2 - Reset cursor.
         *
         * @name Phaser.Input.InputManager#_setCursor
         * @private
         * @type {integer}
         * @since 3.10.0
         */
        this._setCursor = 0;

        /**
         * The default CSS cursor to be used when interacting with your game.
         *
         * See the `setDefaultCursor` method for more details.
         *
         * @name Phaser.Input.InputManager#defaultCursor
         * @type {string}
         * @since 3.10.0
         */
        this.defaultCursor = '';

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

        if (config.inputTouch && this.pointersTotal === 1)
        {
            this.pointersTotal = 2;
        }

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
         * The Scale factor being applied to input coordinates.
         *
         * @name Phaser.Input.InputManager#scale
         * @type { { x:number, y:number } }
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
         * An internal flag that controls if the Input Manager will ignore or process native DOM events this frame.
         * Set via the InputPlugin.stopPropagation method.
         *
         * @name Phaser.Input.InputManager#ignoreEvents
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.ignoreEvents = false;

        /**
         * The bounds of the Input Manager, used for pointer hit test calculations.
         *
         * @name Phaser.Input.InputManager#bounds
         * @type {Phaser.Geom.Rectangle}
         * @since 3.0.0
         */
        this.bounds = new Rectangle();

        /**
         * A re-cycled point-like object to store hit test values in.
         *
         * @name Phaser.Input.InputManager#_tempPoint
         * @type {{x:number,y:number}}
         * @private
         * @since 3.0.0
         */
        this._tempPoint = { x: 0, y: 0 };

        /**
         * A re-cycled array to store hit results in.
         *
         * @name Phaser.Input.InputManager#_tempHitTest
         * @type {array}
         * @private
         * @default []
         * @since 3.0.0
         */
        this._tempHitTest = [];

        /**
         * A re-cycled matrix used in hit test calculations.
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
     * @protected
     * @since 3.0.0
     */
    boot: function ()
    {
        this.canvas = this.game.canvas;

        this.updateBounds();

        this.events.emit('boot');

        this.game.events.on('prestep', this.update, this);
        this.game.events.on('poststep', this.postUpdate, this);
        this.game.events.once('destroy', this.destroy, this);
    },

    /**
     * Updates the Input Manager bounds rectangle to match the bounding client rectangle of the
     * canvas element being used to track input events.
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
     * Resizes the Input Manager internal values, including the bounds and scale factor.
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
     * Internal update loop, called automatically by the Game Step.
     *
     * @method Phaser.Input.InputManager#update
     * @private
     * @since 3.0.0
     *
     * @param {number} time - The time stamp value of this game step.
     */
    update: function (time)
    {
        var i;

        this._setCursor = 0;

        this.events.emit('update');

        this.ignoreEvents = false;

        this.dirty = false;

        var len = this.queue.length;

        var pointers = this.pointers;

        for (i = 0; i < this.pointersTotal; i++)
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
        for (i = 0; i < len; i += 2)
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

    /**
     * Internal post-update, called automatically by the Game step.
     *
     * @method Phaser.Input.InputManager#postUpdate
     * @private
     * @since 3.10.0
     */
    postUpdate: function ()
    {
        if (this._setCursor === 1)
        {
            this.canvas.style.cursor = this._customCursor;
        }
        else if (this._setCursor === 2)
        {
            this.canvas.style.cursor = this.defaultCursor;
        }
    },

    /**
     * Tells the Input system to set a custom cursor.
     * 
     * This cursor will be the default cursor used when interacting with the game canvas.
     *
     * If an Interactive Object also sets a custom cursor, this is the cursor that is reset after its use.
     *
     * Any valid CSS cursor value is allowed, including paths to image files, i.e.:
     *
     * ```javascript
     * this.input.setDefaultCursor('url(assets/cursors/sword.cur), pointer');
     * ```
     * 
     * Please read about the differences between browsers when it comes to the file formats and sizes they support:
     *
     * https://developer.mozilla.org/en-US/docs/Web/CSS/cursor
     * https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_User_Interface/Using_URL_values_for_the_cursor_property
     *
     * It's up to you to pick a suitable cursor format that works across the range of browsers you need to support.
     *
     * @method Phaser.Input.InputManager#setDefaultCursor
     * @since 3.10.0
     * 
     * @param {string} cursor - The CSS to be used when setting the default cursor.
     */
    setDefaultCursor: function (cursor)
    {
        this.defaultCursor = cursor;

        if (this.canvas.style.cursor !== cursor)
        {
            this.canvas.style.cursor = cursor;
        }
    },

    /**
     * Called by the InputPlugin when processing over and out events.
     * 
     * Tells the Input Manager to set a custom cursor during its postUpdate step.
     *
     * https://developer.mozilla.org/en-US/docs/Web/CSS/cursor
     *
     * @method Phaser.Input.InputManager#setCursor
     * @private
     * @since 3.10.0
     * 
     * @param {Phaser.Input.InteractiveObject} interactiveObject - The Interactive Object that called this method.
     */
    setCursor: function (interactiveObject)
    {
        if (interactiveObject.cursor)
        {
            this._setCursor = 1;
            this._customCursor = interactiveObject.cursor;
        }
    },

    /**
     * Called by the InputPlugin when processing over and out events.
     * 
     * Tells the Input Manager to clear the hand cursor, if set, during its postUpdate step.
     *
     * @method Phaser.Input.InputManager#resetCursor
     * @private
     * @since 3.10.0
     * 
     * @param {Phaser.Input.InteractiveObject} interactiveObject - The Interactive Object that called this method.
     */
    resetCursor: function (interactiveObject)
    {
        if (interactiveObject.cursor)
        {
            this._setCursor = 2;
        }
    },

    //  event.targetTouches = list of all touches on the TARGET ELEMENT (i.e. game dom element)
    //  event.touches = list of all touches on the ENTIRE DOCUMENT, not just the target element
    //  event.changedTouches = the touches that CHANGED in this event, not the total number of them

    /**
     * Called by the main update loop when a Touch Start Event is received.
     *
     * @method Phaser.Input.InputManager#startPointer
     * @private
     * @since 3.10.0
     *
     * @param {TouchEvent} event - The native DOM event to be processed.
     * @param {number} time - The time stamp value of this game step.
     */
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

    /**
     * Called by the main update loop when a Touch Move Event is received.
     *
     * @method Phaser.Input.InputManager#updatePointer
     * @private
     * @since 3.10.0
     *
     * @param {TouchEvent} event - The native DOM event to be processed.
     * @param {number} time - The time stamp value of this game step.
     */
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

    /**
     * Called by the main update loop when a Touch End Event is received.
     *
     * @method Phaser.Input.InputManager#stopPointer
     * @private
     * @since 3.10.0
     *
     * @param {TouchEvent} event - The native DOM event to be processed.
     * @param {number} time - The time stamp value of this game step.
     */
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
     * in the Game Config, up to a maximum of 10 pointers.
     *
     * The first 10 pointers are available via the `InputPlugin.pointerX` properties, once they have been added
     * via this method.
     *
     * @method Phaser.Input.InputManager#addPointer
     * @since 3.10.0
     *
     * @param {integer} [quantity=1] The number of new Pointers to create. A maximum of 10 is allowed in total.
     *
     * @return {Phaser.Input.Pointer[]} An array containing all of the new Pointer objects that were created.
     */
    addPointer: function (quantity)
    {
        if (quantity === undefined) { quantity = 1; }

        var output = [];

        if (this.pointersTotal + quantity > 10)
        {
            quantity = 10 - this.pointersTotal;
        }

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
     * @param {TouchEvent} event - The native DOM Touch event.
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
     * @param {TouchEvent} event - The native DOM Touch event.
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
     * @param {TouchEvent} event - The native DOM Touch event.
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
     * @param {MouseEvent} event - The native DOM Mouse event.
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
     * @param {MouseEvent} event - The native DOM Mouse event.
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
     * @param {MouseEvent} event - The native DOM Mouse event.
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
     * Checks if the given Game Object should be considered as a candidate for input or not.
     *
     * Checks if the Game Object has an input component that is enabled, that it will render,
     * and finally, if it has a parent, that the parent parent, or any ancestor, is visible or not.
     *
     * @method Phaser.Input.InputManager#inputCandidate
     * @private
     * @since 3.10.0
     *
     * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object to test.
     *
     * @return {boolean} `true` if the Game Object should be considered for input, otherwise `false`.
     */
    inputCandidate: function (gameObject)
    {
        var input = gameObject.input;

        if (!input || !input.enabled || !gameObject.willRender())
        {
            return false;
        }

        var visible = true;
        var parent = gameObject.parentContainer;

        if (parent)
        {
            do
            {
                if (!parent.visible)
                {
                    visible = false;
                    break;
                }

                parent = parent.parentContainer;

            } while (parent);
        }

        return visible;
    },

    /**
     * Performs a hit test using the given Pointer and camera, against an array of interactive Game Objects.
     *
     * The Game Objects are culled against the camera, and then the coordinates are translated into the local camera space
     * and used to determine if they fall within the remaining Game Objects hit areas or not.
     *
     * If nothing is matched an empty array is returned.
     *
     * This method is called automatically by InputPlugin.hitTestPointer and doesn't usually need to be invoked directly.
     *
     * @method Phaser.Input.InputManager#hitTest
     * @since 3.0.0
     *
     * @param {Phaser.Input.Pointer} pointer - The Pointer to test against.
     * @param {array} gameObjects - An array of interactive Game Objects to check.
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera which is being tested against.
     * @param {array} [output] - An array to store the results in. If not given, a new empty array is created.
     *
     * @return {array} An array of the Game Objects that were hit during this hit test.
     */
    hitTest: function (pointer, gameObjects, camera, output)
    {
        if (output === undefined) { output = this._tempHitTest; }

        var tempPoint = this._tempPoint;
        var cameraW = camera.width;
        var cameraH = camera.height;

        output.length = 0;

        var x = pointer.x;
        var y = pointer.y;

        if (!(x >= camera.x && y >= camera.y && x <= camera.x + cameraW && y <= camera.y + cameraH))
        {
            return output;
        }

        //  Stores the world point inside of tempPoint
        camera.getWorldPoint(x, y, tempPoint);

        pointer.worldX = tempPoint.x;
        pointer.worldY = tempPoint.y;

        //  Disable until fixed.
        // var culledGameObjects = camera.cull(gameObjects);

        var point = { x: 0, y: 0 };

        var res = this.game.config.resolution;

        var matrix = this._tempMatrix;

        for (var i = 0; i < gameObjects.length; i++)
        {
            var gameObject = gameObjects[i];

            if (!this.inputCandidate(gameObject))
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
     * Checks if the given x and y coordinate are within the hit area of the Game Object.
     *
     * This method assumes that the coordinate values have already been translated into the space of the Game Object.
     *
     * If the coordinates are within the hit area they are set into the Game Objects Input `localX` and `localY` properties.
     *
     * @method Phaser.Input.InputManager#pointWithinHitArea
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} gameObject - The interactive Game Object to check against.
     * @param {number} x - The translated x coordinate for the hit test.
     * @param {number} y - The translated y coordinate for the hit test.
     *
     * @return {boolean} `true` if the coordinates were inside the Game Objects hit area, otherwise `false`.
     */
    pointWithinHitArea: function (gameObject, x, y)
    {
        //  Normalize the origin
        x += gameObject.displayOriginX;
        y += gameObject.displayOriginY;

        var input = gameObject.input;

        if (input && input.hitAreaCallback(input.hitArea, x, y, gameObject))
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
     * Checks if the given x and y coordinate are within the hit area of the Interactive Object.
     *
     * This method assumes that the coordinate values have already been translated into the space of the Interactive Object.
     *
     * If the coordinates are within the hit area they are set into the Interactive Objects Input `localX` and `localY` properties.
     *
     * @method Phaser.Input.InputManager#pointWithinInteractiveObject
     * @since 3.0.0
     *
     * @param {Phaser.Input.InteractiveObject} object - The Interactive Object to check against.
     * @param {number} x - The translated x coordinate for the hit test.
     * @param {number} y - The translated y coordinate for the hit test.
     *
     * @return {boolean} `true` if the coordinates were inside the Game Objects hit area, otherwise `false`.
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
     * Transforms the pageX and pageY values of a Pointer into the scaled coordinate space of the Input Manager.
     *
     * @method Phaser.Input.InputManager#transformPointer
     * @since 3.10.0
     *
     * @param {Phaser.Input.Pointer} pointer - The Pointer to transform the values for.
     *
     * @return {number} The translated value.
     */
    transformPointer: function (pointer, pageX, pageY)
    {
        pointer.x = (pageX - this.bounds.left) * this.scale.x;
        pointer.y = (pageY - this.bounds.top) * this.scale.y;
    },

    /**
     * Transforms the pageX value into the scaled coordinate space of the Input Manager.
     *
     * @method Phaser.Input.InputManager#transformX
     * @since 3.0.0
     *
     * @param {number} pageX - The DOM pageX value.
     *
     * @return {number} The translated value.
     */
    transformX: function (pageX)
    {
        return (pageX - this.bounds.left) * this.scale.x;
    },

    /**
     * Transforms the pageY value into the scaled coordinate space of the Input Manager.
     *
     * @method Phaser.Input.InputManager#transformY
     * @since 3.0.0
     *
     * @param {number} pageY - The DOM pageY value.
     *
     * @return {number} The translated value.
     */
    transformY: function (pageY)
    {
        return (pageY - this.bounds.top) * this.scale.y;
    },

    /**
     * Returns the left offset of the Input bounds.
     *
     * @method Phaser.Input.InputManager#getOffsetX
     * @since 3.0.0
     *
     * @return {number} The left bounds value.
     */
    getOffsetX: function ()
    {
        return this.bounds.left;
    },

    /**
     * Returns the top offset of the Input bounds.
     *
     * @method Phaser.Input.InputManager#getOffsetY
     * @since 3.0.0
     *
     * @return {number} The top bounds value.
     */
    getOffsetY: function ()
    {
        return this.bounds.top;
    },

    /**
     * Returns the horizontal Input Scale value.
     *
     * @method Phaser.Input.InputManager#getScaleX
     * @since 3.0.0
     *
     * @return {number} The horizontal scale factor of the input.
     */
    getScaleX: function ()
    {
        return this.game.config.width / this.bounds.width;
    },

    /**
     * Returns the vertical Input Scale value.
     *
     * @method Phaser.Input.InputManager#getScaleY
     * @since 3.0.0
     *
     * @return {number} The vertical scale factor of the input.
     */
    getScaleY: function ()
    {
        return this.game.config.height / this.bounds.height;
    },

    /**
     * Destroys the Input Manager and all of its systems.
     *
     * There is no way to recover from doing this.
     *
     * @method Phaser.Input.InputManager#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.events.removeAllListeners();

        if (this.mouse)
        {
            this.mouse.destroy();
        }

        if (this.touch)
        {
            this.touch.destroy();
        }

        for (var i = 0; i < this.pointers.length; i++)
        {
            this.pointers[i].destroy();
        }

        this.domCallbacks = {};
        this.pointers = [];
        this.queue = [];
        this._tempHitTest = [];
        this._tempMatrix.destroy();
        this.canvas = null;
        this.game = null;
    }

});

module.exports = InputManager;
