/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var CONST = require('./const');
var EventEmitter = require('eventemitter3');
var Events = require('./events');
var GameEvents = require('../core/events');
var Keyboard = require('./keyboard/KeyboardManager');
var Mouse = require('./mouse/MouseManager');
var Pointer = require('./Pointer');
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
 * It then manages the events, pointer creation and general hit test related operations.
 *
 * You rarely need to interact with the Input Manager directly, and as such, all of its properties and methods
 * should be considered private. Instead, you should use the Input Plugin, which is a Scene level system, responsible
 * for dealing with all input events for a Scene.
 *
 * @class InputManager
 * @memberof Phaser.Input
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
         * @readonly
         * @since 3.0.0
         */
        this.game = game;

        /**
         * A reference to the global Game Scale Manager.
         * Used for all bounds checks and pointer scaling.
         *
         * @name Phaser.Input.InputManager#scaleManager
         * @type {Phaser.Scale.ScaleManager}
         * @since 3.16.0
         */
        this.scaleManager;

        /**
         * The Canvas that is used for all DOM event input listeners.
         *
         * @name Phaser.Input.InputManager#canvas
         * @type {HTMLCanvasElement}
         * @since 3.0.0
         */
        this.canvas;

        /**
         * The Game Configuration object, as set during the game boot.
         *
         * @name Phaser.Input.InputManager#config
         * @type {Phaser.Core.Config}
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
         * Are any mouse or touch pointers currently over the game canvas?
         * This is updated automatically by the canvas over and out handlers.
         *
         * @name Phaser.Input.InputManager#isOver
         * @type {boolean}
         * @readonly
         * @since 3.16.0
         */
        this.isOver = true;

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
         * A reference to the Keyboard Manager class, if enabled via the `input.keyboard` Game Config property.
         *
         * @name Phaser.Input.InputManager#keyboard
         * @type {?Phaser.Input.Keyboard.KeyboardManager}
         * @since 3.16.0
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
         * @type {number}
         * @readonly
         * @since 3.10.0
         */
        this.pointersTotal = config.inputActivePointers;

        if (config.inputTouch && this.pointersTotal === 1)
        {
            this.pointersTotal = 2;
        }

        for (var i = 0; i <= this.pointersTotal; i++)
        {
            var pointer = new Pointer(this, i);

            pointer.smoothFactor = config.inputSmoothFactor;

            this.pointers.push(pointer);
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
         * The time this Input Manager was last updated.
         * This value is populated by the Game Step each frame.
         *
         * @name Phaser.Input.InputManager#time
         * @type {number}
         * @readonly
         * @since 3.16.2
         */
        this.time = 0;

        /**
         * A re-cycled point-like object to store hit test values in.
         *
         * @name Phaser.Input.InputManager#_tempPoint
         * @type {{x:number, y:number}}
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

        /**
         * A re-cycled matrix used in hit test calculations.
         *
         * @name Phaser.Input.InputManager#_tempMatrix2
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @private
         * @since 3.12.0
         */
        this._tempMatrix2 = new TransformMatrix();

        /**
         * An internal private var that records Scenes aborting event processing.
         *
         * @name Phaser.Input.InputManager#_tempSkip
         * @type {boolean}
         * @private
         * @since 3.18.0
         */
        this._tempSkip = false;

        /**
         * An internal private array that avoids needing to create a new array on every DOM mouse event.
         *
         * @name Phaser.Input.InputManager#mousePointerContainer
         * @type {Phaser.Input.Pointer[]}
         * @private
         * @since 3.18.0
         */
        this.mousePointerContainer = [ this.mousePointer ];

        game.events.once(GameEvents.BOOT, this.boot, this);
    },

    /**
     * The Boot handler is called by Phaser.Game when it first starts up.
     * The renderer is available by now.
     *
     * @method Phaser.Input.InputManager#boot
     * @protected
     * @fires Phaser.Input.Events#MANAGER_BOOT
     * @since 3.0.0
     */
    boot: function ()
    {
        this.canvas = this.game.canvas;

        this.scaleManager = this.game.scale;

        this.events.emit(Events.MANAGER_BOOT);

        this.game.events.on(GameEvents.PRE_RENDER, this.preRender, this);

        this.game.events.once(GameEvents.DESTROY, this.destroy, this);
    },

    /**
     * Internal canvas state change, called automatically by the Mouse Manager.
     *
     * @method Phaser.Input.InputManager#setCanvasOver
     * @fires Phaser.Input.Events#GAME_OVER
     * @private
     * @since 3.16.0
     *
     * @param {(MouseEvent|TouchEvent)} event - The DOM Event.
     */
    setCanvasOver: function (event)
    {
        this.isOver = true;

        this.events.emit(Events.GAME_OVER, event);
    },

    /**
     * Internal canvas state change, called automatically by the Mouse Manager.
     *
     * @method Phaser.Input.InputManager#setCanvasOut
     * @fires Phaser.Input.Events#GAME_OUT
     * @private
     * @since 3.16.0
     *
     * @param {(MouseEvent|TouchEvent)} event - The DOM Event.
     */
    setCanvasOut: function (event)
    {
        this.isOver = false;

        this.events.emit(Events.GAME_OUT, event);
    },

    /**
     * Internal update, called automatically by the Game Step right at the start.
     *
     * @method Phaser.Input.InputManager#preRender
     * @private
     * @since 3.18.0
     */
    preRender: function ()
    {
        var time = this.game.loop.now;
        var delta = this.game.loop.delta;
        var scenes = this.game.scene.getScenes(true, true);

        this.time = time;

        this.events.emit(Events.MANAGER_UPDATE);

        for (var i = 0; i < scenes.length; i++)
        {
            var scene = scenes[i];

            if (scene.sys.input && scene.sys.input.updatePoll(time, delta) && this.globalTopOnly)
            {
                //  If the Scene returns true, it means it captured some input that no other Scene should get, so we bail out
                return;
            }
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
     * @param {Phaser.Types.Input.InteractiveObject} interactiveObject - The Interactive Object that called this method.
     */
    setCursor: function (interactiveObject)
    {
        if (interactiveObject.cursor)
        {
            this.canvas.style.cursor = interactiveObject.cursor;
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
     * @param {Phaser.Types.Input.InteractiveObject} interactiveObject - The Interactive Object that called this method.
     */
    resetCursor: function (interactiveObject)
    {
        if (interactiveObject.cursor && this.canvas)
        {
            this.canvas.style.cursor = this.defaultCursor;
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
     * @param {number} [quantity=1] The number of new Pointers to create. A maximum of 10 is allowed in total.
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

            pointer.smoothFactor = this.config.inputSmoothFactor;

            this.pointers.push(pointer);

            this.pointersTotal++;

            output.push(pointer);
        }

        return output;
    },

    /**
     * Internal method that gets a list of all the active Input Plugins in the game
     * and updates each of them in turn, in reverse order (top to bottom), to allow
     * for DOM top-level event handling simulation.
     *
     * @method Phaser.Input.InputManager#updateInputPlugins
     * @since 3.16.0
     *
     * @param {number} type - The type of event to process.
     * @param {Phaser.Input.Pointer[]} pointers - An array of Pointers on which the event occurred.
     */
    updateInputPlugins: function (type, pointers)
    {
        var scenes = this.game.scene.getScenes(true, true);

        this._tempSkip = false;

        for (var i = 0; i < scenes.length; i++)
        {
            var scene = scenes[i];

            if (scene.sys.input)
            {
                var capture = scene.sys.input.update(type, pointers);

                if ((capture && this.globalTopOnly) || this._tempSkip)
                {
                    //  If the Scene returns true, or called stopPropagation, it means it captured some input that no other Scene should get, so we bail out
                    return;
                }
            }
        }
    },

    //  event.targetTouches = list of all touches on the TARGET ELEMENT (i.e. game dom element)
    //  event.touches = list of all touches on the ENTIRE DOCUMENT, not just the target element
    //  event.changedTouches = the touches that CHANGED in this event, not the total number of them

    /**
     * Processes a touch start event, as passed in by the TouchManager.
     *
     * @method Phaser.Input.InputManager#onTouchStart
     * @private
     * @since 3.18.0
     *
     * @param {TouchEvent} event - The native DOM Touch event.
     */
    onTouchStart: function (event)
    {
        var pointers = this.pointers;
        var changed = [];

        for (var c = 0; c < event.changedTouches.length; c++)
        {
            var changedTouch = event.changedTouches[c];

            for (var i = 1; i < this.pointersTotal; i++)
            {
                var pointer = pointers[i];

                if (!pointer.active)
                {
                    pointer.touchstart(changedTouch, event);

                    this.activePointer = pointer;

                    changed.push(pointer);

                    break;
                }
            }
        }

        this.updateInputPlugins(CONST.TOUCH_START, changed);
    },

    /**
     * Processes a touch move event, as passed in by the TouchManager.
     *
     * @method Phaser.Input.InputManager#onTouchMove
     * @private
     * @since 3.18.0
     *
     * @param {TouchEvent} event - The native DOM Touch event.
     */
    onTouchMove: function (event)
    {
        var pointers = this.pointers;
        var changed = [];

        for (var c = 0; c < event.changedTouches.length; c++)
        {
            var changedTouch = event.changedTouches[c];

            for (var i = 1; i < this.pointersTotal; i++)
            {
                var pointer = pointers[i];

                if (pointer.active && pointer.identifier === changedTouch.identifier)
                {
                    pointer.touchmove(changedTouch, event);

                    this.activePointer = pointer;

                    changed.push(pointer);

                    break;
                }
            }
        }

        this.updateInputPlugins(CONST.TOUCH_MOVE, changed);
    },

    //  For touch end its a list of the touch points that have been removed from the surface
    //  https://developer.mozilla.org/en-US/docs/DOM/TouchList
    //  event.changedTouches = the touches that CHANGED in this event, not the total number of them

    /**
     * Processes a touch end event, as passed in by the TouchManager.
     *
     * @method Phaser.Input.InputManager#onTouchEnd
     * @private
     * @since 3.18.0
     *
     * @param {TouchEvent} event - The native DOM Touch event.
     */
    onTouchEnd: function (event)
    {
        var pointers = this.pointers;
        var changed = [];

        for (var c = 0; c < event.changedTouches.length; c++)
        {
            var changedTouch = event.changedTouches[c];

            for (var i = 1; i < this.pointersTotal; i++)
            {
                var pointer = pointers[i];

                if (pointer.active && pointer.identifier === changedTouch.identifier)
                {
                    pointer.touchend(changedTouch, event);

                    changed.push(pointer);

                    break;
                }
            }
        }

        this.updateInputPlugins(CONST.TOUCH_END, changed);
    },

    /**
     * Processes a touch cancel event, as passed in by the TouchManager.
     *
     * @method Phaser.Input.InputManager#onTouchCancel
     * @private
     * @since 3.18.0
     *
     * @param {TouchEvent} event - The native DOM Touch event.
     */
    onTouchCancel: function (event)
    {
        var pointers = this.pointers;
        var changed = [];

        for (var c = 0; c < event.changedTouches.length; c++)
        {
            var changedTouch = event.changedTouches[c];

            for (var i = 1; i < this.pointersTotal; i++)
            {
                var pointer = pointers[i];

                if (pointer.active && pointer.identifier === changedTouch.identifier)
                {
                    pointer.touchcancel(changedTouch, event);

                    changed.push(pointer);

                    break;
                }
            }
        }

        this.updateInputPlugins(CONST.TOUCH_CANCEL, changed);
    },

    /**
     * Processes a mouse down event, as passed in by the MouseManager.
     *
     * @method Phaser.Input.InputManager#onMouseDown
     * @private
     * @since 3.18.0
     *
     * @param {MouseEvent} event - The native DOM Mouse event.
     */
    onMouseDown: function (event)
    {
        var mousePointer = this.mousePointer;

        mousePointer.down(event);

        mousePointer.updateMotion();

        this.activePointer = mousePointer;

        this.updateInputPlugins(CONST.MOUSE_DOWN, this.mousePointerContainer);
    },

    /**
     * Processes a mouse move event, as passed in by the MouseManager.
     *
     * @method Phaser.Input.InputManager#onMouseMove
     * @private
     * @since 3.18.0
     *
     * @param {MouseEvent} event - The native DOM Mouse event.
     */
    onMouseMove: function (event)
    {
        var mousePointer = this.mousePointer;

        mousePointer.move(event);

        mousePointer.updateMotion();

        this.activePointer = mousePointer;

        this.updateInputPlugins(CONST.MOUSE_MOVE, this.mousePointerContainer);
    },

    /**
     * Processes a mouse up event, as passed in by the MouseManager.
     *
     * @method Phaser.Input.InputManager#onMouseUp
     * @private
     * @since 3.18.0
     *
     * @param {MouseEvent} event - The native DOM Mouse event.
     */
    onMouseUp: function (event)
    {
        var mousePointer = this.mousePointer;

        mousePointer.up(event);

        mousePointer.updateMotion();

        this.activePointer = mousePointer;

        this.updateInputPlugins(CONST.MOUSE_UP, this.mousePointerContainer);
    },

    /**
     * Processes a mouse wheel event, as passed in by the MouseManager.
     *
     * @method Phaser.Input.InputManager#onMouseWheel
     * @private
     * @since 3.18.0
     *
     * @param {WheelEvent} event - The native DOM Wheel event.
     */
    onMouseWheel: function (event)
    {
        var mousePointer = this.mousePointer;

        mousePointer.wheel(event);

        this.activePointer = mousePointer;

        this.updateInputPlugins(CONST.MOUSE_WHEEL, this.mousePointerContainer);
    },

    /**
     * Processes a pointer lock change event, as passed in by the MouseManager.
     *
     * @method Phaser.Input.InputManager#onPointerLockChange
     * @fires Phaser.Input.Events#POINTERLOCK_CHANGE
     * @private
     * @since 3.19.0
     *
     * @param {MouseEvent} event - The native DOM Mouse event.
     */
    onPointerLockChange: function (event)
    {
        var isLocked = this.mouse.locked;

        this.mousePointer.locked = isLocked;

        this.events.emit(Events.POINTERLOCK_CHANGE, event, isLocked);
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
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera which is being tested against.
     *
     * @return {boolean} `true` if the Game Object should be considered for input, otherwise `false`.
     */
    inputCandidate: function (gameObject, camera)
    {
        var input = gameObject.input;

        if (!input || !input.enabled || (!input.alwaysEnabled && !gameObject.willRender(camera)))
        {
            return false;
        }

        var visible = true;
        var parent = gameObject.parentContainer;

        if (parent)
        {
            do
            {
                if (!parent.willRender(camera))
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

        var csx = camera.scrollX;
        var csy = camera.scrollY;

        output.length = 0;

        var x = pointer.x;
        var y = pointer.y;

        //  Stores the world point inside of tempPoint
        camera.getWorldPoint(x, y, tempPoint);

        pointer.worldX = tempPoint.x;
        pointer.worldY = tempPoint.y;

        var point = { x: 0, y: 0 };

        var matrix = this._tempMatrix;
        var parentMatrix = this._tempMatrix2;

        for (var i = 0; i < gameObjects.length; i++)
        {
            var gameObject = gameObjects[i];

            //  Checks if the Game Object can receive input (isn't being ignored by the camera, invisible, etc)
            //  and also checks all of its parents, if any
            if (!this.inputCandidate(gameObject, camera))
            {
                continue;
            }

            var px = tempPoint.x + (csx * gameObject.scrollFactorX) - csx;
            var py = tempPoint.y + (csy * gameObject.scrollFactorY) - csy;

            if (gameObject.parentContainer)
            {
                gameObject.getWorldTransformMatrix(matrix, parentMatrix);

                matrix.applyInverse(px, py, point);
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
     * @param {Phaser.Types.Input.InteractiveObject} object - The Interactive Object to check against.
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
     * @param {number} pageX - The Page X value.
     * @param {number} pageY - The Page Y value.
     * @param {boolean} wasMove - Are we transforming the Pointer from a move event, or an up / down event?
     */
    transformPointer: function (pointer, pageX, pageY, wasMove)
    {
        var p0 = pointer.position;
        var p1 = pointer.prevPosition;

        //  Store previous position
        p1.x = p0.x;
        p1.y = p0.y;

        //  Translate coordinates
        var x = this.scaleManager.transformX(pageX);
        var y = this.scaleManager.transformY(pageY);

        var a = pointer.smoothFactor;

        if (!wasMove || a === 0)
        {
            //  Set immediately
            p0.x = x;
            p0.y = y;
        }
        else
        {
            //  Apply smoothing
            p0.x = x * a + p1.x * (1 - a);
            p0.y = y * a + p1.y * (1 - a);
        }
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

        this.game.events.off(GameEvents.PRE_RENDER);

        if (this.keyboard)
        {
            this.keyboard.destroy();
        }

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

        this.pointers = [];
        this._tempHitTest = [];
        this._tempMatrix.destroy();
        this.canvas = null;
        this.game = null;
    }

});

module.exports = InputManager;
