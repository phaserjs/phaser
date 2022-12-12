/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Circle = require('../geom/circle/Circle');
var CircleContains = require('../geom/circle/Contains');
var Class = require('../utils/Class');
var CONST = require('./const');
var CreateInteractiveObject = require('./CreateInteractiveObject');
var CreatePixelPerfectHandler = require('./CreatePixelPerfectHandler');
var DistanceBetween = require('../math/distance/DistanceBetween');
var Ellipse = require('../geom/ellipse/Ellipse');
var EllipseContains = require('../geom/ellipse/Contains');
var Events = require('./events');
var EventEmitter = require('eventemitter3');
var GetFastValue = require('../utils/object/GetFastValue');
var GEOM_CONST = require('../geom/const');
var InputPluginCache = require('./InputPluginCache');
var IsPlainObject = require('../utils/object/IsPlainObject');
var PluginCache = require('../plugins/PluginCache');
var Rectangle = require('../geom/rectangle/Rectangle');
var RectangleContains = require('../geom/rectangle/Contains');
var SceneEvents = require('../scene/events');
var Triangle = require('../geom/triangle/Triangle');
var TriangleContains = require('../geom/triangle/Contains');

/**
 * @classdesc
 * The Input Plugin belongs to a Scene and handles all input related events and operations for it.
 *
 * You can access it from within a Scene using `this.input`.
 *
 * It emits events directly. For example, you can do:
 *
 * ```javascript
 * this.input.on('pointerdown', callback, context);
 * ```
 *
 * To listen for a pointer down event anywhere on the game canvas.
 *
 * Game Objects can be enabled for input by calling their `setInteractive` method. After which they
 * will directly emit input events:
 *
 * ```javascript
 * var sprite = this.add.sprite(x, y, texture);
 * sprite.setInteractive();
 * sprite.on('pointerdown', callback, context);
 * ```
 *
 * There are lots of game configuration options available relating to input.
 * See the [Input Config object]{@linkcode Phaser.Types.Core.InputConfig} for more details, including how to deal with Phaser
 * listening for input events outside of the canvas, how to set a default number of pointers, input
 * capture settings and more.
 *
 * Please also see the Input examples and tutorials for further information.
 *
 * **Incorrect input coordinates with Angular**
 *
 * If you are using Phaser within Angular, and use nglf or the router, to make the component in which the Phaser game resides
 * change state (i.e. appear or disappear) then you'll need to notify the Scale Manager about this, as Angular will mess with
 * the DOM in a way in which Phaser can't detect directly. Call `this.scale.updateBounds()` as part of your game init in order
 * to refresh the canvas DOM bounds values, which Phaser uses for input point position calculations.
 *
 * @class InputPlugin
 * @extends Phaser.Events.EventEmitter
 * @memberof Phaser.Input
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - A reference to the Scene that this Input Plugin is responsible for.
 */
var InputPlugin = new Class({

    Extends: EventEmitter,

    initialize:

    function InputPlugin (scene)
    {
        EventEmitter.call(this);

        /**
         * A reference to the Scene that this Input Plugin is responsible for.
         *
         * @name Phaser.Input.InputPlugin#scene
         * @type {Phaser.Scene}
         * @since 3.0.0
         */
        this.scene = scene;

        /**
         * A reference to the Scene Systems class.
         *
         * @name Phaser.Input.InputPlugin#systems
         * @type {Phaser.Scenes.Systems}
         * @since 3.0.0
         */
        this.systems = scene.sys;

        /**
         * A reference to the Scene Systems Settings.
         *
         * @name Phaser.Input.InputPlugin#settings
         * @type {Phaser.Types.Scenes.SettingsObject}
         * @since 3.5.0
         */
        this.settings = scene.sys.settings;

        /**
         * A reference to the Game Input Manager.
         *
         * @name Phaser.Input.InputPlugin#manager
         * @type {Phaser.Input.InputManager}
         * @since 3.0.0
         */
        this.manager = scene.sys.game.input;

        /**
         * Internal event queue used for plugins only.
         *
         * @name Phaser.Input.InputPlugin#pluginEvents
         * @type {Phaser.Events.EventEmitter}
         * @private
         * @since 3.10.0
         */
        this.pluginEvents = new EventEmitter();

        /**
         * If `true` this Input Plugin will process DOM input events.
         *
         * @name Phaser.Input.InputPlugin#enabled
         * @type {boolean}
         * @default true
         * @since 3.5.0
         */
        this.enabled = true;

        /**
         * A reference to the Scene Display List. This property is set during the `boot` method.
         *
         * @name Phaser.Input.InputPlugin#displayList
         * @type {Phaser.GameObjects.DisplayList}
         * @since 3.0.0
         */
        this.displayList;

        /**
         * A reference to the Scene Cameras Manager. This property is set during the `boot` method.
         *
         * @name Phaser.Input.InputPlugin#cameras
         * @type {Phaser.Cameras.Scene2D.CameraManager}
         * @since 3.0.0
         */
        this.cameras;

        //  Inject the available input plugins into this class
        InputPluginCache.install(this);

        /**
         * A reference to the Mouse Manager.
         *
         * This property is only set if Mouse support has been enabled in your Game Configuration file.
         *
         * If you just wish to get access to the mouse pointer, use the `mousePointer` property instead.
         *
         * @name Phaser.Input.InputPlugin#mouse
         * @type {?Phaser.Input.Mouse.MouseManager}
         * @since 3.0.0
         */
        this.mouse = this.manager.mouse;

        /**
         * When set to `true` (the default) the Input Plugin will emulate DOM behavior by only emitting events from
         * the top-most Game Objects in the Display List.
         *
         * If set to `false` it will emit events from all Game Objects below a Pointer, not just the top one.
         *
         * @name Phaser.Input.InputPlugin#topOnly
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.topOnly = true;

        /**
         * How often should the Pointers be checked?
         *
         * The value is a time, given in ms, and is the time that must have elapsed between game steps before
         * the Pointers will be polled again. When a pointer is polled it runs a hit test to see which Game
         * Objects are currently below it, or being interacted with it.
         *
         * Pointers will *always* be checked if they have been moved by the user, or press or released.
         *
         * This property only controls how often they will be polled if they have not been updated.
         * You should set this if you want to have Game Objects constantly check against the pointers, even
         * if the pointer didn't itself move.
         *
         * Set to 0 to poll constantly. Set to -1 to only poll on user movement.
         *
         * @name Phaser.Input.InputPlugin#pollRate
         * @type {number}
         * @default -1
         * @since 3.0.0
         */
        this.pollRate = -1;

        /**
         * Internal poll timer value.
         *
         * @name Phaser.Input.InputPlugin#_pollTimer
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._pollTimer = 0;

        var _eventData = { cancelled: false };

        /**
         * Internal event propagation callback container.
         *
         * @name Phaser.Input.InputPlugin#_eventContainer
         * @type {Phaser.Types.Input.EventData}
         * @private
         * @since 3.13.0
         */
        this._eventContainer = {
            stopPropagation: function ()
            {
                _eventData.cancelled = true;
            }
        };

        /**
         * Internal event propagation data object.
         *
         * @name Phaser.Input.InputPlugin#_eventData
         * @type {object}
         * @private
         * @since 3.13.0
         */
        this._eventData = _eventData;

        /**
         * The distance, in pixels, a pointer has to move while being held down, before it thinks it is being dragged.
         *
         * @name Phaser.Input.InputPlugin#dragDistanceThreshold
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.dragDistanceThreshold = 0;

        /**
         * The amount of time, in ms, a pointer has to be held down before it thinks it is dragging.
         *
         * The default polling rate is to poll only on move so once the time threshold is reached the
         * drag event will not start until you move the mouse. If you want it to start immediately
         * when the time threshold is reached, you must increase the polling rate by calling
         * [setPollAlways]{@linkcode Phaser.Input.InputPlugin#setPollAlways} or
         * [setPollRate]{@linkcode Phaser.Input.InputPlugin#setPollRate}.
         *
         * @name Phaser.Input.InputPlugin#dragTimeThreshold
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.dragTimeThreshold = 0;

        /**
         * Used to temporarily store the results of the Hit Test
         *
         * @name Phaser.Input.InputPlugin#_temp
         * @type {array}
         * @private
         * @default []
         * @since 3.0.0
         */
        this._temp = [];

        /**
         * Used to temporarily store the results of the Hit Test dropZones
         *
         * @name Phaser.Input.InputPlugin#_tempZones
         * @type {array}
         * @private
         * @default []
         * @since 3.0.0
         */
        this._tempZones = [];

        /**
         * A list of all Game Objects that have been set to be interactive in the Scene this Input Plugin is managing.
         *
         * @name Phaser.Input.InputPlugin#_list
         * @type {Phaser.GameObjects.GameObject[]}
         * @private
         * @default []
         * @since 3.0.0
         */
        this._list = [];

        /**
         * Objects waiting to be inserted to the list on the next call to 'begin'.
         *
         * @name Phaser.Input.InputPlugin#_pendingInsertion
         * @type {Phaser.GameObjects.GameObject[]}
         * @private
         * @default []
         * @since 3.0.0
         */
        this._pendingInsertion = [];

        /**
         * Objects waiting to be removed from the list on the next call to 'begin'.
         *
         * @name Phaser.Input.InputPlugin#_pendingRemoval
         * @type {Phaser.GameObjects.GameObject[]}
         * @private
         * @default []
         * @since 3.0.0
         */
        this._pendingRemoval = [];

        /**
         * A list of all Game Objects that have been enabled for dragging.
         *
         * @name Phaser.Input.InputPlugin#_draggable
         * @type {Phaser.GameObjects.GameObject[]}
         * @private
         * @default []
         * @since 3.0.0
         */
        this._draggable = [];

        /**
         * A list of all Interactive Objects currently considered as being 'draggable' by any pointer, indexed by pointer ID.
         *
         * @name Phaser.Input.InputPlugin#_drag
         * @type {{0:Array,1:Array,2:Array,3:Array,4:Array,5:Array,6:Array,7:Array,8:Array,9:Array,10:Array}}
         * @private
         * @since 3.0.0
         */
        this._drag = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [] };

        /**
         * A array containing the dragStates, for this Scene, index by the Pointer ID.
         *
         * @name Phaser.Input.InputPlugin#_dragState
         * @type {number[]}
         * @private
         * @since 3.16.0
         */
        this._dragState = [];

        /**
         * A list of all Interactive Objects currently considered as being 'over' by any pointer, indexed by pointer ID.
         *
         * @name Phaser.Input.InputPlugin#_over
         * @type {{0:Array,1:Array,2:Array,3:Array,4:Array,5:Array,6:Array,7:Array,8:Array,9:Array,10:Array}}
         * @private
         * @since 3.0.0
         */
        this._over = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [] };

        /**
         * A list of valid DOM event types.
         *
         * @name Phaser.Input.InputPlugin#_validTypes
         * @type {string[]}
         * @private
         * @since 3.0.0
         */
        this._validTypes = [ 'onDown', 'onUp', 'onOver', 'onOut', 'onMove', 'onDragStart', 'onDrag', 'onDragEnd', 'onDragEnter', 'onDragLeave', 'onDragOver', 'onDrop' ];

        /**
         * Internal property that tracks frame event state.
         *
         * @name Phaser.Input.InputPlugin#_updatedThisFrame
         * @type {boolean}
         * @private
         * @since 3.18.0
         */
        this._updatedThisFrame = false;

        scene.sys.events.once(SceneEvents.BOOT, this.boot, this);
        scene.sys.events.on(SceneEvents.START, this.start, this);
    },

    /**
     * This method is called automatically, only once, when the Scene is first created.
     * Do not invoke it directly.
     *
     * @method Phaser.Input.InputPlugin#boot
     * @fires Phaser.Input.Events#BOOT
     * @private
     * @since 3.5.1
     */
    boot: function ()
    {
        this.cameras = this.systems.cameras;

        this.displayList = this.systems.displayList;

        this.systems.events.once(SceneEvents.DESTROY, this.destroy, this);

        //  Registered input plugins listen for this
        this.pluginEvents.emit(Events.BOOT);
    },

    /**
     * This method is called automatically by the Scene when it is starting up.
     * It is responsible for creating local systems, properties and listening for Scene events.
     * Do not invoke it directly.
     *
     * @method Phaser.Input.InputPlugin#start
     * @fires Phaser.Input.Events#START
     * @private
     * @since 3.5.0
     */
    start: function ()
    {
        var eventEmitter = this.systems.events;

        eventEmitter.on(SceneEvents.TRANSITION_START, this.transitionIn, this);
        eventEmitter.on(SceneEvents.TRANSITION_OUT, this.transitionOut, this);
        eventEmitter.on(SceneEvents.TRANSITION_COMPLETE, this.transitionComplete, this);
        eventEmitter.on(SceneEvents.PRE_UPDATE, this.preUpdate, this);
        eventEmitter.once(SceneEvents.SHUTDOWN, this.shutdown, this);

        this.manager.events.on(Events.GAME_OUT, this.onGameOut, this);
        this.manager.events.on(Events.GAME_OVER, this.onGameOver, this);

        this.enabled = true;

        //  Populate the pointer drag states
        this._dragState = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];

        //  Registered input plugins listen for this
        this.pluginEvents.emit(Events.START);
    },

    /**
     * Game Over handler.
     *
     * @method Phaser.Input.InputPlugin#onGameOver
     * @fires Phaser.Input.Events#GAME_OVER
     * @private
     * @since 3.16.2
     */
    onGameOver: function (event)
    {
        if (this.isActive())
        {
            this.emit(Events.GAME_OVER, event.timeStamp, event);
        }
    },

    /**
     * Game Out handler.
     *
     * @method Phaser.Input.InputPlugin#onGameOut
     * @fires Phaser.Input.Events#GAME_OUT
     * @private
     * @since 3.16.2
     */
    onGameOut: function (event)
    {
        if (this.isActive())
        {
            this.emit(Events.GAME_OUT, event.timeStamp, event);
        }
    },

    /**
     * The pre-update handler is responsible for checking the pending removal and insertion lists and
     * deleting old Game Objects.
     *
     * @method Phaser.Input.InputPlugin#preUpdate
     * @private
     * @fires Phaser.Input.Events#PRE_UPDATE
     * @since 3.0.0
     */
    preUpdate: function ()
    {
        //  Registered input plugins listen for this
        this.pluginEvents.emit(Events.PRE_UPDATE);

        var removeList = this._pendingRemoval;
        var insertList = this._pendingInsertion;

        var toRemove = removeList.length;
        var toInsert = insertList.length;

        if (toRemove === 0 && toInsert === 0)
        {
            //  Quick bail
            return;
        }

        var current = this._list;

        //  Delete old gameObjects
        for (var i = 0; i < toRemove; i++)
        {
            var gameObject = removeList[i];

            var index = current.indexOf(gameObject);

            if (index > -1)
            {
                current.splice(index, 1);

                this.clear(gameObject, true);
            }
        }

        //  Clear the removal list
        this._pendingRemoval.length = 0;

        //  Move pendingInsertion to list (also clears pendingInsertion at the same time)
        this._list = current.concat(insertList.splice(0));
    },

    /**
     * Checks to see if both this plugin and the Scene to which it belongs is active.
     *
     * @method Phaser.Input.InputPlugin#isActive
     * @since 3.10.0
     *
     * @return {boolean} `true` if the plugin and the Scene it belongs to is active.
     */
    isActive: function ()
    {
        return (this.enabled && this.scene.sys.canInput());
    },

    /**
     * This is called automatically by the Input Manager.
     * It emits events for plugins to listen to and also handles polling updates, if enabled.
     *
     * @method Phaser.Input.InputPlugin#updatePoll
     * @since 3.18.0
     *
     * @param {number} time - The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
     * @param {number} delta - The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
     *
     * @return {boolean} `true` if the plugin and the Scene it belongs to is active.
     */
    updatePoll: function (time, delta)
    {
        if (!this.isActive())
        {
            return false;
        }

        //  The plugins should update every frame, regardless if there has been
        //  any DOM input events or not (such as the Gamepad and Keyboard)
        this.pluginEvents.emit(Events.UPDATE, time, delta);

        //  We can leave now if we've already updated once this frame via the immediate DOM event handlers
        if (this._updatedThisFrame)
        {
            this._updatedThisFrame = false;

            return false;
        }

        var i;
        var manager = this.manager;

        var pointers = manager.pointers;
        var pointersTotal = manager.pointersTotal;

        for (i = 0; i < pointersTotal; i++)
        {
            pointers[i].updateMotion();
        }

        //  No point going any further if there aren't any interactive objects
        if (this._list.length === 0)
        {
            return false;
        }

        var rate = this.pollRate;

        if (rate === -1)
        {
            return false;
        }
        else if (rate > 0)
        {
            this._pollTimer -= delta;

            if (this._pollTimer < 0)
            {
                //  Discard timer diff, we're ready to poll again
                this._pollTimer = this.pollRate;
            }
            else
            {
                //  Not enough time has elapsed since the last poll, so abort now
                return false;
            }
        }

        //  We got this far? Then we should poll for movement
        var captured = false;

        for (i = 0; i < pointersTotal; i++)
        {
            var total = 0;

            var pointer = pointers[i];

            //  Always reset this array
            this._tempZones = [];

            //  _temp contains a hit tested and camera culled list of IO objects
            this._temp = this.hitTestPointer(pointer);

            this.sortGameObjects(this._temp, pointer);
            this.sortDropZones(this._tempZones);

            if (this.topOnly)
            {
                //  Only the top-most one counts now, so safely ignore the rest
                if (this._temp.length)
                {
                    this._temp.splice(1);
                }

                if (this._tempZones.length)
                {
                    this._tempZones.splice(1);
                }
            }

            total += this.processOverOutEvents(pointer);

            if (this.getDragState(pointer) === 2)
            {
                this.processDragThresholdEvent(pointer, time);
            }

            if (total > 0)
            {
                //  We interacted with an event in this Scene, so block any Scenes below us from doing the same this frame
                captured = true;
            }
        }

        return captured;
    },

    /**
     * This method is called when a DOM Event is received by the Input Manager. It handles dispatching the events
     * to relevant input enabled Game Objects in this scene.
     *
     * @method Phaser.Input.InputPlugin#update
     * @private
     * @fires Phaser.Input.Events#UPDATE
     * @since 3.0.0
     *
     * @param {number} type - The type of event to process.
     * @param {Phaser.Input.Pointer[]} pointers - An array of Pointers on which the event occurred.
     *
     * @return {boolean} `true` if this Scene has captured the input events from all other Scenes, otherwise `false`.
     */
    update: function (type, pointers)
    {
        if (!this.isActive())
        {
            return false;
        }

        var pointersTotal = pointers.length;
        var captured = false;

        for (var i = 0; i < pointersTotal; i++)
        {
            var total = 0;
            var pointer = pointers[i];

            //  Always reset this array
            this._tempZones = [];

            //  _temp contains a hit tested and camera culled list of IO objects
            this._temp = this.hitTestPointer(pointer);

            this.sortGameObjects(this._temp, pointer);
            this.sortDropZones(this._tempZones);

            if (this.topOnly)
            {
                //  Only the top-most one counts now, so safely ignore the rest
                if (this._temp.length)
                {
                    this._temp.splice(1);
                }

                if (this._tempZones.length)
                {
                    this._tempZones.splice(1);
                }
            }

            switch (type)
            {
                case CONST.MOUSE_DOWN:
                    total += this.processDragDownEvent(pointer);
                    total += this.processDownEvents(pointer);
                    total += this.processOverOutEvents(pointer);
                    break;

                case CONST.MOUSE_UP:
                    total += this.processDragUpEvent(pointer);
                    total += this.processUpEvents(pointer);
                    total += this.processOverOutEvents(pointer);
                    break;

                case CONST.TOUCH_START:
                    total += this.processDragDownEvent(pointer);
                    total += this.processDownEvents(pointer);
                    total += this.processOverEvents(pointer);
                    break;

                case CONST.TOUCH_END:
                case CONST.TOUCH_CANCEL:
                    total += this.processDragUpEvent(pointer);
                    total += this.processUpEvents(pointer);
                    total += this.processOutEvents(pointer);
                    break;

                case CONST.MOUSE_MOVE:
                case CONST.TOUCH_MOVE:
                    total += this.processDragMoveEvent(pointer);
                    total += this.processMoveEvents(pointer);
                    total += this.processOverOutEvents(pointer);
                    break;

                case CONST.MOUSE_WHEEL:
                    total += this.processWheelEvent(pointer);
                    break;
            }

            if (total > 0)
            {
                //  We interacted with an event in this Scene, so block any Scenes below us from doing the same this frame
                captured = true;
            }
        }

        this._updatedThisFrame = true;

        return captured;
    },

    /**
     * Clears a Game Object so it no longer has an Interactive Object associated with it.
     * The Game Object is then queued for removal from the Input Plugin on the next update.
     *
     * @method Phaser.Input.InputPlugin#clear
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object that will have its Interactive Object removed.
     * @param {boolean} [skipQueue=false] - Skip adding this Game Object into the removal queue?
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that had its Interactive Object removed.
     */
    clear: function (gameObject, skipQueue)
    {
        if (skipQueue === undefined) { skipQueue = false; }

        this.disable(gameObject);

        var input = gameObject.input;

        // If GameObject.input already cleared from higher class
        if (input)
        {
            this.removeDebug(gameObject);

            input.gameObject = undefined;
            input.target = undefined;
            input.hitArea = undefined;
            input.hitAreaCallback = undefined;
            input.callbackContext = undefined;

            gameObject.input = null;
        }

        if (!skipQueue)
        {
            this.queueForRemoval(gameObject);
        }

        var index = this._draggable.indexOf(gameObject);

        if (index > -1)
        {
            this._draggable.splice(index, 1);
        }

        return gameObject;
    },

    /**
     * Disables Input on a single Game Object.
     *
     * An input disabled Game Object still retains its Interactive Object component and can be re-enabled
     * at any time, by passing it to `InputPlugin.enable`.
     *
     * @method Phaser.Input.InputPlugin#disable
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object to have its input system disabled.
     *
     * @return {this} This Input Plugin.
     */
    disable: function (gameObject)
    {
        var input = gameObject.input;

        if (input)
        {
            input.enabled = false;
            input.dragState = 0;
        }

        // Clear from _temp, _drag and _over
        var temp = this._temp;
        var drag = this._drag;
        var over = this._over;
        var manager = this.manager;

        var index = temp.indexOf(gameObject);

        if (index > -1)
        {
            temp.splice(index, 1);
        }

        for (var i = 0; i < manager.pointersTotal; i++)
        {
            index = drag[i].indexOf(gameObject);

            if (index > -1)
            {
                drag[i].splice(index, 1);
            }

            index = over[i].indexOf(gameObject);

            if (index > -1)
            {
                over[i].splice(index, 1);

                manager.resetCursor(input);
            }
        }

        return this;
    },

    /**
     * Enable a Game Object for interaction.
     *
     * If the Game Object already has an Interactive Object component, it is enabled and returned.
     *
     * Otherwise, a new Interactive Object component is created and assigned to the Game Object's `input` property.
     *
     * Input works by using hit areas, these are nearly always geometric shapes, such as rectangles or circles, that act as the hit area
     * for the Game Object. However, you can provide your own hit area shape and callback, should you wish to handle some more advanced
     * input detection.
     *
     * If no arguments are provided it will try and create a rectangle hit area based on the texture frame the Game Object is using. If
     * this isn't a texture-bound object, such as a Graphics or BitmapText object, this will fail, and you'll need to provide a specific
     * shape for it to use.
     *
     * You can also provide an Input Configuration Object as the only argument to this method.
     *
     * @method Phaser.Input.InputPlugin#enable
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object to be enabled for input.
     * @param {(Phaser.Types.Input.InputConfiguration|any)} [hitArea] - Either an input configuration object, or a geometric shape that defines the hit area for the Game Object. If not specified a Rectangle will be used.
     * @param {Phaser.Types.Input.HitAreaCallback} [hitAreaCallback] - The 'contains' function to invoke to check if the pointer is within the hit area.
     * @param {boolean} [dropZone=false] - Is this Game Object a drop zone or not?
     *
     * @return {this} This Input Plugin.
     */
    enable: function (gameObject, hitArea, hitAreaCallback, dropZone)
    {
        if (dropZone === undefined) { dropZone = false; }

        if (gameObject.input)
        {
            //  If it is already has an InteractiveObject then just enable it and return
            gameObject.input.enabled = true;
        }
        else
        {
            //  Create an InteractiveObject and enable it
            this.setHitArea(gameObject, hitArea, hitAreaCallback);
        }

        if (gameObject.input && dropZone && !gameObject.input.dropZone)
        {
            gameObject.input.dropZone = dropZone;
        }

        return this;
    },

    /**
     * Takes the given Pointer and performs a hit test against it, to see which interactive Game Objects
     * it is currently above.
     *
     * The hit test is performed against which-ever Camera the Pointer is over. If it is over multiple
     * cameras, it starts checking the camera at the top of the camera list, and if nothing is found, iterates down the list.
     *
     * @method Phaser.Input.InputPlugin#hitTestPointer
     * @since 3.0.0
     *
     * @param {Phaser.Input.Pointer} pointer - The Pointer to check against the Game Objects.
     *
     * @return {Phaser.GameObjects.GameObject[]} An array of all the interactive Game Objects the Pointer was above.
     */
    hitTestPointer: function (pointer)
    {
        var cameras = this.cameras.getCamerasBelowPointer(pointer);

        for (var c = 0; c < cameras.length; c++)
        {
            var camera = cameras[c];

            //  Get a list of all objects that can be seen by the camera below the pointer in the scene and store in 'over' array.
            //  All objects in this array are input enabled, as checked by the hitTest method, so we don't need to check later on as well.
            var over = this.manager.hitTest(pointer, this._list, camera);

            //  Filter out the drop zones
            for (var i = 0; i < over.length; i++)
            {
                var obj = over[i];

                if (obj.input.dropZone)
                {
                    this._tempZones.push(obj);
                }
            }

            if (over.length > 0)
            {
                pointer.camera = camera;

                return over;
            }
        }

        //  If we got this far then there were no Game Objects below the pointer, but it was still over
        //  a camera, so set that the top-most one into the pointer

        pointer.camera = cameras[0];

        return [];
    },

    /**
     * An internal method that handles the Pointer down event.
     *
     * @method Phaser.Input.InputPlugin#processDownEvents
     * @private
     * @fires Phaser.Input.Events#GAMEOBJECT_POINTER_DOWN
     * @fires Phaser.Input.Events#GAMEOBJECT_DOWN
     * @fires Phaser.Input.Events#POINTER_DOWN
     * @fires Phaser.Input.Events#POINTER_DOWN_OUTSIDE
     * @since 3.0.0
     *
     * @param {Phaser.Input.Pointer} pointer - The Pointer being tested.
     *
     * @return {number} The total number of objects interacted with.
     */
    processDownEvents: function (pointer)
    {
        var total = 0;
        var currentlyOver = this._temp;

        var _eventData = this._eventData;
        var _eventContainer = this._eventContainer;

        _eventData.cancelled = false;

        var aborted = false;

        //  Go through all objects the pointer was over and fire their events / callbacks
        for (var i = 0; i < currentlyOver.length; i++)
        {
            var gameObject = currentlyOver[i];

            if (!gameObject.input || !gameObject.input.enabled)
            {
                continue;
            }

            total++;

            gameObject.emit(Events.GAMEOBJECT_POINTER_DOWN, pointer, gameObject.input.localX, gameObject.input.localY, _eventContainer);

            if (_eventData.cancelled || !gameObject.input || !gameObject.input.enabled)
            {
                aborted = true;
                break;
            }

            this.emit(Events.GAMEOBJECT_DOWN, pointer, gameObject, _eventContainer);

            if (_eventData.cancelled || !gameObject.input)
            {
                aborted = true;
                break;
            }
        }

        //  If they released outside the canvas, but pressed down inside it, we'll still dispatch the event.
        if (!aborted && this.manager)
        {
            if (pointer.downElement === this.manager.game.canvas)
            {
                this.emit(Events.POINTER_DOWN, pointer, currentlyOver);
            }
            else
            {
                this.emit(Events.POINTER_DOWN_OUTSIDE, pointer);
            }
        }

        return total;
    },

    /**
     * Returns the drag state of the given Pointer for this Input Plugin.
     *
     * The state will be one of the following:
     *
     * 0 = Not dragging anything
     * 1 = Primary button down and objects below, so collect a draglist
     * 2 = Pointer being checked if meets drag criteria
     * 3 = Pointer meets criteria, notify the draglist
     * 4 = Pointer actively dragging the draglist and has moved
     * 5 = Pointer actively dragging but has been released, notify draglist
     *
     * @method Phaser.Input.InputPlugin#getDragState
     * @since 3.16.0
     *
     * @param {Phaser.Input.Pointer} pointer - The Pointer to get the drag state for.
     *
     * @return {number} The drag state of the given Pointer.
     */
    getDragState: function (pointer)
    {
        return this._dragState[pointer.id];
    },

    /**
     * Sets the drag state of the given Pointer for this Input Plugin.
     *
     * The state must be one of the following values:
     *
     * 0 = Not dragging anything
     * 1 = Primary button down and objects below, so collect a draglist
     * 2 = Pointer being checked if meets drag criteria
     * 3 = Pointer meets criteria, notify the draglist
     * 4 = Pointer actively dragging the draglist and has moved
     * 5 = Pointer actively dragging but has been released, notify draglist
     *
     * @method Phaser.Input.InputPlugin#setDragState
     * @since 3.16.0
     *
     * @param {Phaser.Input.Pointer} pointer - The Pointer to set the drag state for.
     * @param {number} state - The drag state value. An integer between 0 and 5.
     */
    setDragState: function (pointer, state)
    {
        this._dragState[pointer.id] = state;
    },

    /**
     * Checks to see if a Pointer is ready to drag the objects below it, based on either a distance
     * or time threshold.
     *
     * @method Phaser.Input.InputPlugin#processDragThresholdEvent
     * @private
     * @since 3.18.0
     *
     * @param {Phaser.Input.Pointer} pointer - The Pointer to check the drag thresholds on.
     * @param {number} time - The current time.
     */
    processDragThresholdEvent: function (pointer, time)
    {
        var passed = false;
        var timeThreshold = this.dragTimeThreshold;
        var distanceThreshold = this.dragDistanceThreshold;

        if (distanceThreshold > 0 && DistanceBetween(pointer.x, pointer.y, pointer.downX, pointer.downY) >= distanceThreshold)
        {
            //  It has moved far enough to be considered a drag
            passed = true;
        }
        else if (timeThreshold > 0 && (time >= pointer.downTime + timeThreshold))
        {
            //  It has been held down long enough to be considered a drag
            passed = true;
        }

        if (passed)
        {
            this.setDragState(pointer, 3);

            return this.processDragStartList(pointer);
        }
    },

    /**
     * Processes the drag list for the given pointer and dispatches the start events for each object on it.
     *
     * @method Phaser.Input.InputPlugin#processDragStartList
     * @private
     * @fires Phaser.Input.Events#DRAG_START
     * @fires Phaser.Input.Events#GAMEOBJECT_DRAG_START
     * @since 3.18.0
     *
     * @param {Phaser.Input.Pointer} pointer - The Pointer to process the drag event on.
     *
     * @return {number} The number of items that DRAG_START was called on.
     */
    processDragStartList: function (pointer)
    {
        //  3 = Pointer meets criteria and is freshly down, notify the draglist
        if (this.getDragState(pointer) !== 3)
        {
            return 0;
        }

        var list = this._drag[pointer.id];

        for (var i = 0; i < list.length; i++)
        {
            var gameObject = list[i];

            var input = gameObject.input;

            input.dragState = 2;

            input.dragStartX = gameObject.x;
            input.dragStartY = gameObject.y;

            input.dragStartXGlobal = pointer.worldX;
            input.dragStartYGlobal = pointer.worldY;

            input.dragX = input.dragStartXGlobal - input.dragStartX;
            input.dragY = input.dragStartYGlobal - input.dragStartY;

            gameObject.emit(Events.GAMEOBJECT_DRAG_START, pointer, input.dragX, input.dragY);

            this.emit(Events.DRAG_START, pointer, gameObject);
        }

        this.setDragState(pointer, 4);

        return list.length;
    },

    /**
     * Processes a 'drag down' event for the given pointer. Checks the pointer state, builds-up the drag list
     * and prepares them all for interaction.
     *
     * @method Phaser.Input.InputPlugin#processDragDownEvent
     * @private
     * @since 3.18.0
     *
     * @param {Phaser.Input.Pointer} pointer - The Pointer to process the drag event on.
     *
     * @return {number} The number of items that were collected on the drag list.
     */
    processDragDownEvent: function (pointer)
    {
        var currentlyOver = this._temp;

        if (this._draggable.length === 0 || currentlyOver.length === 0 || !pointer.primaryDown || this.getDragState(pointer) !== 0)
        {
            //  There are no draggable items, no over items or the pointer isn't down, so let's not even bother going further
            return 0;
        }

        //  1 = Primary button down and objects below, so collect a draglist
        this.setDragState(pointer, 1);

        //  Get draggable objects, sort them, pick the top (or all) and store them somewhere
        var draglist = [];

        for (var i = 0; i < currentlyOver.length; i++)
        {
            var gameObject = currentlyOver[i];

            if (gameObject.input.draggable && (gameObject.input.dragState === 0))
            {
                draglist.push(gameObject);
            }
        }

        if (draglist.length === 0)
        {
            this.setDragState(pointer, 0);

            return 0;
        }
        else if (draglist.length > 1)
        {
            this.sortGameObjects(draglist, pointer);

            if (this.topOnly)
            {
                draglist.splice(1);
            }
        }

        //  draglist now contains all potential candidates for dragging
        this._drag[pointer.id] = draglist;

        if (this.dragDistanceThreshold === 0 && this.dragTimeThreshold === 0)
        {
            //  No drag criteria, so snap immediately to mode 3
            this.setDragState(pointer, 3);

            return this.processDragStartList(pointer);
        }
        else
        {
            //  Check the distance / time on the next event
            this.setDragState(pointer, 2);

            return 0;
        }
    },

    /**
     * Processes a 'drag move' event for the given pointer.
     *
     * @method Phaser.Input.InputPlugin#processDragMoveEvent
     * @private
     * @fires Phaser.Input.Events#DRAG_ENTER
     * @fires Phaser.Input.Events#DRAG
     * @fires Phaser.Input.Events#DRAG_LEAVE
     * @fires Phaser.Input.Events#DRAG_OVER
     * @fires Phaser.Input.Events#GAMEOBJECT_DRAG_ENTER
     * @fires Phaser.Input.Events#GAMEOBJECT_DRAG
     * @fires Phaser.Input.Events#GAMEOBJECT_DRAG_LEAVE
     * @fires Phaser.Input.Events#GAMEOBJECT_DRAG_OVER
     * @since 3.18.0
     *
     * @param {Phaser.Input.Pointer} pointer - The Pointer to process the drag event on.
     *
     * @return {number} The number of items that were updated by this drag event.
     */
    processDragMoveEvent: function (pointer)
    {
        //  2 = Pointer being checked if meets drag criteria
        if (this.getDragState(pointer) === 2)
        {
            this.processDragThresholdEvent(pointer, this.manager.game.loop.now);
        }

        if (this.getDragState(pointer) !== 4)
        {
            return 0;
        }

        //  4 = Pointer actively dragging the draglist and has moved
        var dropZones = this._tempZones;

        var list = this._drag[pointer.id];

        for (var i = 0; i < list.length; i++)
        {
            var gameObject = list[i];

            var input = gameObject.input;

            var target = input.target;

            //  If this GO has a target then let's check it
            if (target)
            {
                var index = dropZones.indexOf(target);

                //  Got a target, are we still over it?
                if (index === 0)
                {
                    //  We're still over it, and it's still the top of the display list, phew ...
                    gameObject.emit(Events.GAMEOBJECT_DRAG_OVER, pointer, target);

                    this.emit(Events.DRAG_OVER, pointer, gameObject, target);
                }
                else if (index > 0)
                {
                    //  Still over it but it's no longer top of the display list (targets must always be at the top)
                    gameObject.emit(Events.GAMEOBJECT_DRAG_LEAVE, pointer, target);

                    this.emit(Events.DRAG_LEAVE, pointer, gameObject, target);

                    input.target = dropZones[0];

                    target = input.target;

                    gameObject.emit(Events.GAMEOBJECT_DRAG_ENTER, pointer, target);

                    this.emit(Events.DRAG_ENTER, pointer, gameObject, target);
                }
                else
                {
                    //  Nope, we've moved on (or the target has!), leave the old target
                    gameObject.emit(Events.GAMEOBJECT_DRAG_LEAVE, pointer, target);

                    this.emit(Events.DRAG_LEAVE, pointer, gameObject, target);

                    //  Anything new to replace it?
                    //  Yup!
                    if (dropZones[0])
                    {
                        input.target = dropZones[0];

                        target = input.target;

                        gameObject.emit(Events.GAMEOBJECT_DRAG_ENTER, pointer, target);

                        this.emit(Events.DRAG_ENTER, pointer, gameObject, target);
                    }
                    else
                    {
                        //  Nope
                        input.target = null;
                    }
                }
            }
            else if (!target && dropZones[0])
            {
                input.target = dropZones[0];

                target = input.target;

                gameObject.emit(Events.GAMEOBJECT_DRAG_ENTER, pointer, target);

                this.emit(Events.DRAG_ENTER, pointer, gameObject, target);
            }

            var dragX;
            var dragY;

            if (!gameObject.parentContainer)
            {
                dragX = pointer.worldX - input.dragX;
                dragY = pointer.worldY - input.dragY;
            }
            else
            {
                var dx = pointer.worldX - input.dragStartXGlobal;
                var dy = pointer.worldY - input.dragStartYGlobal;

                var rotation = gameObject.getParentRotation();

                var dxRotated = dx * Math.cos(rotation) + dy * Math.sin(rotation);
                var dyRotated = dy * Math.cos(rotation) - dx * Math.sin(rotation);

                dxRotated *= (1 / gameObject.parentContainer.scaleX);
                dyRotated *= (1 / gameObject.parentContainer.scaleY);

                dragX = dxRotated + input.dragStartX;
                dragY = dyRotated + input.dragStartY;
            }

            gameObject.emit(Events.GAMEOBJECT_DRAG, pointer, dragX, dragY);

            this.emit(Events.DRAG, pointer, gameObject, dragX, dragY);
        }

        return list.length;
    },

    /**
     * Processes a 'drag down' event for the given pointer. Checks the pointer state, builds-up the drag list
     * and prepares them all for interaction.
     *
     * @method Phaser.Input.InputPlugin#processDragUpEvent
     * @fires Phaser.Input.Events#DRAG_END
     * @fires Phaser.Input.Events#DROP
     * @fires Phaser.Input.Events#GAMEOBJECT_DRAG_END
     * @fires Phaser.Input.Events#GAMEOBJECT_DROP
     * @private
     * @since 3.18.0
     *
     * @param {Phaser.Input.Pointer} pointer - The Pointer to process the drag event on.
     *
     * @return {number} The number of items that were updated by this drag event.
     */
    processDragUpEvent: function (pointer)
    {
        //  5 = Pointer was actively dragging but has been released, notify draglist
        var list = this._drag[pointer.id];

        for (var i = 0; i < list.length; i++)
        {
            var gameObject = list[i];

            var input = gameObject.input;

            if (input && input.dragState === 2)
            {
                input.dragState = 0;

                input.dragX = input.localX - gameObject.displayOriginX;
                input.dragY = input.localY - gameObject.displayOriginY;

                var dropped = false;

                var target = input.target;

                if (target)
                {
                    gameObject.emit(Events.GAMEOBJECT_DROP, pointer, target);

                    this.emit(Events.DROP, pointer, gameObject, target);

                    input.target = null;

                    dropped = true;
                }

                //  And finally the dragend event

                if (gameObject.input && gameObject.input.enabled)
                {
                    gameObject.emit(Events.GAMEOBJECT_DRAG_END, pointer, input.dragX, input.dragY, dropped);

                    this.emit(Events.DRAG_END, pointer, gameObject, dropped);
                }
            }
        }

        this.setDragState(pointer, 0);

        list.splice(0);

        return 0;
    },

    /**
     * An internal method that handles the Pointer movement event.
     *
     * @method Phaser.Input.InputPlugin#processMoveEvents
     * @private
     * @fires Phaser.Input.Events#GAMEOBJECT_POINTER_MOVE
     * @fires Phaser.Input.Events#GAMEOBJECT_MOVE
     * @fires Phaser.Input.Events#POINTER_MOVE
     * @since 3.0.0
     *
     * @param {Phaser.Input.Pointer} pointer - The pointer to check for events against.
     *
     * @return {number} The total number of objects interacted with.
     */
    processMoveEvents: function (pointer)
    {
        var total = 0;
        var currentlyOver = this._temp;

        var _eventData = this._eventData;
        var _eventContainer = this._eventContainer;

        _eventData.cancelled = false;

        var aborted = false;

        //  Go through all objects the pointer was over and fire their events / callbacks
        for (var i = 0; i < currentlyOver.length; i++)
        {
            var gameObject = currentlyOver[i];

            if (!gameObject.input || !gameObject.input.enabled)
            {
                continue;
            }

            total++;

            gameObject.emit(Events.GAMEOBJECT_POINTER_MOVE, pointer, gameObject.input.localX, gameObject.input.localY, _eventContainer);

            if (_eventData.cancelled || !gameObject.input || !gameObject.input.enabled)
            {
                aborted = true;
                break;
            }

            this.emit(Events.GAMEOBJECT_MOVE, pointer, gameObject, _eventContainer);

            if (_eventData.cancelled || !gameObject.input || !gameObject.input.enabled)
            {
                aborted = true;
                break;
            }

            if (this.topOnly)
            {
                break;
            }
        }

        if (!aborted)
        {
            this.emit(Events.POINTER_MOVE, pointer, currentlyOver);
        }

        return total;
    },

    /**
     * An internal method that handles a mouse wheel event.
     *
     * @method Phaser.Input.InputPlugin#processWheelEvent
     * @private
     * @fires Phaser.Input.Events#GAMEOBJECT_POINTER_WHEEL
     * @fires Phaser.Input.Events#GAMEOBJECT_WHEEL
     * @fires Phaser.Input.Events#POINTER_WHEEL
     * @since 3.18.0
     *
     * @param {Phaser.Input.Pointer} pointer - The pointer to check for events against.
     *
     * @return {number} The total number of objects interacted with.
     */
    processWheelEvent: function (pointer)
    {
        var total = 0;
        var currentlyOver = this._temp;

        var _eventData = this._eventData;
        var _eventContainer = this._eventContainer;

        _eventData.cancelled = false;

        var aborted = false;

        var dx = pointer.deltaX;
        var dy = pointer.deltaY;
        var dz = pointer.deltaZ;

        //  Go through all objects the pointer was over and fire their events / callbacks
        for (var i = 0; i < currentlyOver.length; i++)
        {
            var gameObject = currentlyOver[i];

            if (!gameObject.input || !gameObject.input.enabled)
            {
                continue;
            }

            total++;

            gameObject.emit(Events.GAMEOBJECT_POINTER_WHEEL, pointer, dx, dy, dz, _eventContainer);

            if (_eventData.cancelled || !gameObject.input || !gameObject.input.enabled)
            {
                aborted = true;
                break;
            }

            this.emit(Events.GAMEOBJECT_WHEEL, pointer, gameObject, dx, dy, dz, _eventContainer);

            if (_eventData.cancelled || !gameObject.input || !gameObject.input.enabled)
            {
                aborted = true;
                break;
            }
        }

        if (!aborted)
        {
            this.emit(Events.POINTER_WHEEL, pointer, currentlyOver, dx, dy, dz);
        }

        return total;
    },

    /**
     * An internal method that handles the Pointer over events.
     * This is called when a touch input hits the canvas, having previously been off of it.
     *
     * @method Phaser.Input.InputPlugin#processOverEvents
     * @private
     * @fires Phaser.Input.Events#GAMEOBJECT_POINTER_OVER
     * @fires Phaser.Input.Events#GAMEOBJECT_OVER
     * @fires Phaser.Input.Events#POINTER_OVER
     * @since 3.18.0
     *
     * @param {Phaser.Input.Pointer} pointer - The pointer to check for events against.
     *
     * @return {number} The total number of objects interacted with.
     */
    processOverEvents: function (pointer)
    {
        var currentlyOver = this._temp;

        var totalInteracted = 0;

        var total = currentlyOver.length;

        var justOver = [];

        if (total > 0)
        {
            var manager = this.manager;

            var _eventData = this._eventData;
            var _eventContainer = this._eventContainer;

            _eventData.cancelled = false;

            var aborted = false;

            for (var i = 0; i < total; i++)
            {
                var gameObject = currentlyOver[i];

                if (!gameObject.input || !gameObject.input.enabled)
                {
                    continue;
                }

                justOver.push(gameObject);

                manager.setCursor(gameObject.input);

                gameObject.emit(Events.GAMEOBJECT_POINTER_OVER, pointer, gameObject.input.localX, gameObject.input.localY, _eventContainer);

                totalInteracted++;

                if (_eventData.cancelled || !gameObject.input || !gameObject.input.enabled)
                {
                    aborted = true;
                    break;
                }

                this.emit(Events.GAMEOBJECT_OVER, pointer, gameObject, _eventContainer);

                if (_eventData.cancelled || !gameObject.input || !gameObject.input.enabled)
                {
                    aborted = true;
                    break;
                }
            }

            if (!aborted)
            {
                this.emit(Events.POINTER_OVER, pointer, justOver);
            }
        }

        //  Then sort it into display list order
        this._over[pointer.id] = justOver;

        return totalInteracted;
    },

    /**
     * An internal method that handles the Pointer out events.
     * This is called when a touch input leaves the canvas, as it can never be 'over' in this case.
     *
     * @method Phaser.Input.InputPlugin#processOutEvents
     * @private
     * @fires Phaser.Input.Events#GAMEOBJECT_POINTER_OUT
     * @fires Phaser.Input.Events#GAMEOBJECT_OUT
     * @fires Phaser.Input.Events#POINTER_OUT
     * @since 3.18.0
     *
     * @param {Phaser.Input.Pointer} pointer - The pointer to check for events against.
     *
     * @return {number} The total number of objects interacted with.
     */
    processOutEvents: function (pointer)
    {
        var previouslyOver = this._over[pointer.id];

        var totalInteracted = 0;

        var total = previouslyOver.length;

        if (total > 0)
        {
            var manager = this.manager;

            var _eventData = this._eventData;
            var _eventContainer = this._eventContainer;

            _eventData.cancelled = false;

            var aborted = false;

            this.sortGameObjects(previouslyOver, pointer);

            for (var i = 0; i < total; i++)
            {
                var gameObject = previouslyOver[i];

                //  Call onOut for everything in the previouslyOver array
                gameObject = previouslyOver[i];

                if (!gameObject.input || !gameObject.input.enabled)
                {
                    continue;
                }

                manager.resetCursor(gameObject.input);

                gameObject.emit(Events.GAMEOBJECT_POINTER_OUT, pointer, _eventContainer);

                totalInteracted++;

                if (_eventData.cancelled || !gameObject.input || !gameObject.input.enabled)
                {
                    aborted = true;
                    break;
                }

                this.emit(Events.GAMEOBJECT_OUT, pointer, gameObject, _eventContainer);

                if (_eventData.cancelled || !gameObject.input || !gameObject.input.enabled)
                {
                    aborted = true;
                    break;
                }

                if (!aborted)
                {
                    this.emit(Events.POINTER_OUT, pointer, previouslyOver);
                }
            }

            this._over[pointer.id] = [];
        }

        return totalInteracted;
    },

    /**
     * An internal method that handles the Pointer over and out events.
     *
     * @method Phaser.Input.InputPlugin#processOverOutEvents
     * @private
     * @fires Phaser.Input.Events#GAMEOBJECT_POINTER_OVER
     * @fires Phaser.Input.Events#GAMEOBJECT_OVER
     * @fires Phaser.Input.Events#POINTER_OVER
     * @fires Phaser.Input.Events#GAMEOBJECT_POINTER_OUT
     * @fires Phaser.Input.Events#GAMEOBJECT_OUT
     * @fires Phaser.Input.Events#POINTER_OUT
     * @since 3.0.0
     *
     * @param {Phaser.Input.Pointer} pointer - The pointer to check for events against.
     *
     * @return {number} The total number of objects interacted with.
     */
    processOverOutEvents: function (pointer)
    {
        var currentlyOver = this._temp;

        var i;
        var gameObject;
        var justOut = [];
        var justOver = [];
        var stillOver = [];
        var previouslyOver = this._over[pointer.id];
        var currentlyDragging = this._drag[pointer.id];

        var manager = this.manager;

        //  Go through all objects the pointer was previously over, and see if it still is.
        //  Splits the previouslyOver array into two parts: justOut and stillOver

        for (i = 0; i < previouslyOver.length; i++)
        {
            gameObject = previouslyOver[i];

            if (currentlyOver.indexOf(gameObject) === -1 && currentlyDragging.indexOf(gameObject) === -1)
            {
                //  Not in the currentlyOver array, so must be outside of this object now
                justOut.push(gameObject);
            }
            else
            {
                //  In the currentlyOver array
                stillOver.push(gameObject);
            }
        }

        //  Go through all objects the pointer is currently over (the hit test results)
        //  and if not in the previouslyOver array we know it's a new entry, so add to justOver
        for (i = 0; i < currentlyOver.length; i++)
        {
            gameObject = currentlyOver[i];

            //  Is this newly over?

            if (previouslyOver.indexOf(gameObject) === -1)
            {
                justOver.push(gameObject);
            }
        }

        //  By this point the arrays are filled, so now we can process what happened...

        //  Process the Just Out objects
        var total = justOut.length;

        var totalInteracted = 0;

        var _eventData = this._eventData;
        var _eventContainer = this._eventContainer;

        _eventData.cancelled = false;

        var aborted = false;

        if (total > 0)
        {
            this.sortGameObjects(justOut, pointer);

            //  Call onOut for everything in the justOut array
            for (i = 0; i < total; i++)
            {
                gameObject = justOut[i];

                if (!gameObject.input || !gameObject.input.enabled)
                {
                    continue;
                }

                //  Reset cursor before we emit the event, in case they want to change it during the event
                manager.resetCursor(gameObject.input);

                gameObject.emit(Events.GAMEOBJECT_POINTER_OUT, pointer, _eventContainer);

                totalInteracted++;

                if (_eventData.cancelled || !gameObject.input || !gameObject.input.enabled)
                {
                    aborted = true;
                    break;
                }

                this.emit(Events.GAMEOBJECT_OUT, pointer, gameObject, _eventContainer);

                if (_eventData.cancelled || !gameObject.input || !gameObject.input.enabled)
                {
                    aborted = true;
                    break;
                }
            }

            if (!aborted)
            {
                this.emit(Events.POINTER_OUT, pointer, justOut);
            }
        }

        //  Process the Just Over objects
        total = justOver.length;

        _eventData.cancelled = false;

        aborted = false;

        if (total > 0)
        {
            this.sortGameObjects(justOver, pointer);

            //  Call onOver for everything in the justOver array
            for (i = 0; i < total; i++)
            {
                gameObject = justOver[i];

                if (!gameObject.input || !gameObject.input.enabled)
                {
                    continue;
                }

                //  Set cursor before we emit the event, in case they want to change it during the event
                manager.setCursor(gameObject.input);

                gameObject.emit(Events.GAMEOBJECT_POINTER_OVER, pointer, gameObject.input.localX, gameObject.input.localY, _eventContainer);

                totalInteracted++;

                if (_eventData.cancelled || !gameObject.input || !gameObject.input.enabled)
                {
                    aborted = true;
                    break;
                }

                this.emit(Events.GAMEOBJECT_OVER, pointer, gameObject, _eventContainer);

                if (_eventData.cancelled || !gameObject.input || !gameObject.input.enabled)
                {
                    aborted = true;
                    break;
                }
            }

            if (!aborted)
            {
                this.emit(Events.POINTER_OVER, pointer, justOver);
            }
        }

        //  Add the contents of justOver to the previously over array
        previouslyOver = stillOver.concat(justOver);

        //  Then sort it into display list order
        this._over[pointer.id] = this.sortGameObjects(previouslyOver, pointer);

        return totalInteracted;
    },

    /**
     * An internal method that handles the Pointer up events.
     *
     * @method Phaser.Input.InputPlugin#processUpEvents
     * @private
     * @fires Phaser.Input.Events#GAMEOBJECT_POINTER_UP
     * @fires Phaser.Input.Events#GAMEOBJECT_UP
     * @fires Phaser.Input.Events#POINTER_UP
     * @fires Phaser.Input.Events#POINTER_UP_OUTSIDE
     * @since 3.0.0
     *
     * @param {Phaser.Input.Pointer} pointer - The pointer to check for events against.
     *
     * @return {number} The total number of objects interacted with.
     */
    processUpEvents: function (pointer)
    {
        var currentlyOver = this._temp;

        var _eventData = this._eventData;
        var _eventContainer = this._eventContainer;

        _eventData.cancelled = false;

        var aborted = false;

        //  Go through all objects the pointer was over and fire their events / callbacks
        for (var i = 0; i < currentlyOver.length; i++)
        {
            var gameObject = currentlyOver[i];

            if (!gameObject.input || !gameObject.input.enabled)
            {
                continue;
            }

            gameObject.emit(Events.GAMEOBJECT_POINTER_UP, pointer, gameObject.input.localX, gameObject.input.localY, _eventContainer);

            if (_eventData.cancelled || !gameObject.input || !gameObject.input.enabled)
            {
                aborted = true;
                break;
            }

            this.emit(Events.GAMEOBJECT_UP, pointer, gameObject, _eventContainer);

            if (_eventData.cancelled || !gameObject.input || !gameObject.input.enabled)
            {
                aborted = true;
                break;
            }
        }

        //  If they released outside the canvas, but pressed down inside it, we'll still dispatch the event.
        if (!aborted && this.manager)
        {
            if (pointer.upElement === this.manager.game.canvas)
            {
                this.emit(Events.POINTER_UP, pointer, currentlyOver);
            }
            else
            {
                this.emit(Events.POINTER_UP_OUTSIDE, pointer);
            }
        }

        return currentlyOver.length;
    },

    /**
     * Queues a Game Object for insertion into this Input Plugin on the next update.
     *
     * @method Phaser.Input.InputPlugin#queueForInsertion
     * @private
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} child - The Game Object to add.
     *
     * @return {this} This InputPlugin object.
     */
    queueForInsertion: function (child)
    {
        if (this._pendingInsertion.indexOf(child) === -1 && this._list.indexOf(child) === -1)
        {
            this._pendingInsertion.push(child);
        }

        return this;
    },

    /**
     * Queues a Game Object for removal from this Input Plugin on the next update.
     *
     * @method Phaser.Input.InputPlugin#queueForRemoval
     * @private
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} child - The Game Object to remove.
     *
     * @return {this} This InputPlugin object.
     */
    queueForRemoval: function (child)
    {
        this._pendingRemoval.push(child);

        return this;
    },

    /**
     * Sets the draggable state of the given array of Game Objects.
     *
     * They can either be set to be draggable, or can have their draggable state removed by passing `false`.
     *
     * A Game Object will not fire drag events unless it has been specifically enabled for drag.
     *
     * @method Phaser.Input.InputPlugin#setDraggable
     * @since 3.0.0
     *
     * @param {(Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[])} gameObjects - An array of Game Objects to change the draggable state on.
     * @param {boolean} [value=true] - Set to `true` if the Game Objects should be made draggable, `false` if they should be unset.
     *
     * @return {this} This InputPlugin object.
     */
    setDraggable: function (gameObjects, value)
    {
        if (value === undefined) { value = true; }

        if (!Array.isArray(gameObjects))
        {
            gameObjects = [ gameObjects ];
        }

        for (var i = 0; i < gameObjects.length; i++)
        {
            var gameObject = gameObjects[i];

            gameObject.input.draggable = value;

            var index = this._draggable.indexOf(gameObject);

            if (value && index === -1)
            {
                this._draggable.push(gameObject);
            }
            else if (!value && index > -1)
            {
                this._draggable.splice(index, 1);
            }
        }

        return this;
    },

    /**
     * Creates a function that can be passed to `setInteractive`, `enable` or `setHitArea` that will handle
     * pixel-perfect input detection on an Image or Sprite based Game Object, or any custom class that extends them.
     *
     * The following will create a sprite that is clickable on any pixel that has an alpha value >= 1.
     *
     * ```javascript
     * this.add.sprite(x, y, key).setInteractive(this.input.makePixelPerfect());
     * ```
     *
     * The following will create a sprite that is clickable on any pixel that has an alpha value >= 150.
     *
     * ```javascript
     * this.add.sprite(x, y, key).setInteractive(this.input.makePixelPerfect(150));
     * ```
     *
     * Once you have made an Interactive Object pixel perfect it impacts all input related events for it: down, up,
     * dragstart, drag, etc.
     *
     * As a pointer interacts with the Game Object it will constantly poll the texture, extracting a single pixel from
     * the given coordinates and checking its color values. This is an expensive process, so should only be enabled on
     * Game Objects that really need it.
     *
     * You cannot make non-texture based Game Objects pixel perfect. So this will not work on Graphics, BitmapText,
     * Render Textures, Text, Tilemaps, Containers or Particles.
     *
     * @method Phaser.Input.InputPlugin#makePixelPerfect
     * @since 3.10.0
     *
     * @param {number} [alphaTolerance=1] - The alpha level that the pixel should be above to be included as a successful interaction.
     *
     * @return {function} A Pixel Perfect Handler for use as a hitArea shape callback.
     */
    makePixelPerfect: function (alphaTolerance)
    {
        if (alphaTolerance === undefined) { alphaTolerance = 1; }

        var textureManager = this.systems.textures;

        return CreatePixelPerfectHandler(textureManager, alphaTolerance);
    },

    /**
     * Sets the hit area for the given array of Game Objects.
     *
     * A hit area is typically one of the geometric shapes Phaser provides, such as a `Phaser.Geom.Rectangle`
     * or `Phaser.Geom.Circle`. However, it can be any object as long as it works with the provided callback.
     *
     * If no hit area is provided a Rectangle is created based on the size of the Game Object, if possible
     * to calculate.
     *
     * The hit area callback is the function that takes an `x` and `y` coordinate and returns a boolean if
     * those values fall within the area of the shape or not. All of the Phaser geometry objects provide this,
     * such as `Phaser.Geom.Rectangle.Contains`.
     *
     * @method Phaser.Input.InputPlugin#setHitArea
     * @since 3.0.0
     *
     * @param {(Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[])} gameObjects - An array of Game Objects to set the hit area on.
     * @param {(Phaser.Types.Input.InputConfiguration|any)} [hitArea] - Either an input configuration object, or a geometric shape that defines the hit area for the Game Object. If not specified a Rectangle will be used.
     * @param {Phaser.Types.Input.HitAreaCallback} [hitAreaCallback] - The 'contains' function to invoke to check if the pointer is within the hit area.
     *
     * @return {this} This InputPlugin object.
     */
    setHitArea: function (gameObjects, hitArea, hitAreaCallback)
    {
        if (hitArea === undefined)
        {
            return this.setHitAreaFromTexture(gameObjects);
        }

        if (!Array.isArray(gameObjects))
        {
            gameObjects = [ gameObjects ];
        }

        var draggable = false;
        var dropZone = false;
        var cursor = false;
        var useHandCursor = false;
        var pixelPerfect = false;
        var customHitArea = true;

        //  Config object?
        if (IsPlainObject(hitArea))
        {
            var config = hitArea;

            hitArea = GetFastValue(config, 'hitArea', null);
            hitAreaCallback = GetFastValue(config, 'hitAreaCallback', null);
            draggable = GetFastValue(config, 'draggable', false);
            dropZone = GetFastValue(config, 'dropZone', false);
            cursor = GetFastValue(config, 'cursor', false);
            useHandCursor = GetFastValue(config, 'useHandCursor', false);

            pixelPerfect = GetFastValue(config, 'pixelPerfect', false);
            var alphaTolerance = GetFastValue(config, 'alphaTolerance', 1);

            if (pixelPerfect)
            {
                hitArea = {};
                hitAreaCallback = this.makePixelPerfect(alphaTolerance);
            }

            //  Still no hitArea or callback?
            if (!hitArea || !hitAreaCallback)
            {
                this.setHitAreaFromTexture(gameObjects);
                customHitArea = false;
            }
        }
        else if (typeof hitArea === 'function' && !hitAreaCallback)
        {
            hitAreaCallback = hitArea;
            hitArea = {};
        }

        for (var i = 0; i < gameObjects.length; i++)
        {
            var gameObject = gameObjects[i];

            if (pixelPerfect && gameObject.type === 'Container')
            {
                console.warn('Cannot pixelPerfect test a Container. Use a custom callback.');
                continue;
            }

            var io = (!gameObject.input) ? CreateInteractiveObject(gameObject, hitArea, hitAreaCallback) : gameObject.input;

            io.customHitArea = customHitArea;
            io.dropZone = dropZone;
            io.cursor = (useHandCursor) ? 'pointer' : cursor;

            gameObject.input = io;

            if (draggable)
            {
                this.setDraggable(gameObject);
            }

            this.queueForInsertion(gameObject);
        }

        return this;
    },

    /**
     * Sets the hit area for an array of Game Objects to be a `Phaser.Geom.Circle` shape, using
     * the given coordinates and radius to control its position and size.
     *
     * @method Phaser.Input.InputPlugin#setHitAreaCircle
     * @since 3.0.0
     *
     * @param {(Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[])} gameObjects - An array of Game Objects to set as having a circle hit area.
     * @param {number} x - The center of the circle.
     * @param {number} y - The center of the circle.
     * @param {number} radius - The radius of the circle.
     * @param {Phaser.Types.Input.HitAreaCallback} [callback] - The hit area callback. If undefined it uses Circle.Contains.
     *
     * @return {this} This InputPlugin object.
     */
    setHitAreaCircle: function (gameObjects, x, y, radius, callback)
    {
        if (callback === undefined) { callback = CircleContains; }

        var shape = new Circle(x, y, radius);

        return this.setHitArea(gameObjects, shape, callback);
    },

    /**
     * Sets the hit area for an array of Game Objects to be a `Phaser.Geom.Ellipse` shape, using
     * the given coordinates and dimensions to control its position and size.
     *
     * @method Phaser.Input.InputPlugin#setHitAreaEllipse
     * @since 3.0.0
     *
     * @param {(Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[])} gameObjects - An array of Game Objects to set as having an ellipse hit area.
     * @param {number} x - The center of the ellipse.
     * @param {number} y - The center of the ellipse.
     * @param {number} width - The width of the ellipse.
     * @param {number} height - The height of the ellipse.
     * @param {Phaser.Types.Input.HitAreaCallback} [callback] - The hit area callback. If undefined it uses Ellipse.Contains.
     *
     * @return {this} This InputPlugin object.
     */
    setHitAreaEllipse: function (gameObjects, x, y, width, height, callback)
    {
        if (callback === undefined) { callback = EllipseContains; }

        var shape = new Ellipse(x, y, width, height);

        return this.setHitArea(gameObjects, shape, callback);
    },

    /**
     * Sets the hit area for an array of Game Objects to be a `Phaser.Geom.Rectangle` shape, using
     * the Game Objects texture frame to define the position and size of the hit area.
     *
     * @method Phaser.Input.InputPlugin#setHitAreaFromTexture
     * @since 3.0.0
     *
     * @param {(Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[])} gameObjects - An array of Game Objects to set as having an ellipse hit area.
     * @param {Phaser.Types.Input.HitAreaCallback} [callback] - The hit area callback. If undefined it uses Rectangle.Contains.
     *
     * @return {this} This InputPlugin object.
     */
    setHitAreaFromTexture: function (gameObjects, callback)
    {
        if (callback === undefined) { callback = RectangleContains; }

        if (!Array.isArray(gameObjects))
        {
            gameObjects = [ gameObjects ];
        }

        for (var i = 0; i < gameObjects.length; i++)
        {
            var gameObject = gameObjects[i];

            var frame = gameObject.frame;

            var width = 0;
            var height = 0;

            if (gameObject.width)
            {
                width = gameObject.width;
                height = gameObject.height;
            }
            else if (frame)
            {
                width = frame.realWidth;
                height = frame.realHeight;
            }

            if (gameObject.type === 'Container' && (width === 0 || height === 0))
            {
                console.warn('Container.setInteractive must specify a Shape or call setSize() first');
                continue;
            }

            if (width !== 0 && height !== 0)
            {
                gameObject.input = CreateInteractiveObject(gameObject, new Rectangle(0, 0, width, height), callback);

                this.queueForInsertion(gameObject);
            }
        }

        return this;
    },

    /**
     * Sets the hit area for an array of Game Objects to be a `Phaser.Geom.Rectangle` shape, using
     * the given coordinates and dimensions to control its position and size.
     *
     * @method Phaser.Input.InputPlugin#setHitAreaRectangle
     * @since 3.0.0
     *
     * @param {(Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[])} gameObjects - An array of Game Objects to set as having a rectangular hit area.
     * @param {number} x - The top-left of the rectangle.
     * @param {number} y - The top-left of the rectangle.
     * @param {number} width - The width of the rectangle.
     * @param {number} height - The height of the rectangle.
     * @param {Phaser.Types.Input.HitAreaCallback} [callback] - The hit area callback. If undefined it uses Rectangle.Contains.
     *
     * @return {this} This InputPlugin object.
     */
    setHitAreaRectangle: function (gameObjects, x, y, width, height, callback)
    {
        if (callback === undefined) { callback = RectangleContains; }

        var shape = new Rectangle(x, y, width, height);

        return this.setHitArea(gameObjects, shape, callback);
    },

    /**
     * Sets the hit area for an array of Game Objects to be a `Phaser.Geom.Triangle` shape, using
     * the given coordinates to control the position of its points.
     *
     * @method Phaser.Input.InputPlugin#setHitAreaTriangle
     * @since 3.0.0
     *
     * @param {(Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[])} gameObjects - An array of Game Objects to set as having a  triangular hit area.
     * @param {number} x1 - The x coordinate of the first point of the triangle.
     * @param {number} y1 - The y coordinate of the first point of the triangle.
     * @param {number} x2 - The x coordinate of the second point of the triangle.
     * @param {number} y2 - The y coordinate of the second point of the triangle.
     * @param {number} x3 - The x coordinate of the third point of the triangle.
     * @param {number} y3 - The y coordinate of the third point of the triangle.
     * @param {Phaser.Types.Input.HitAreaCallback} [callback] - The hit area callback. If undefined it uses Triangle.Contains.
     *
     * @return {this} This InputPlugin object.
     */
    setHitAreaTriangle: function (gameObjects, x1, y1, x2, y2, x3, y3, callback)
    {
        if (callback === undefined) { callback = TriangleContains; }

        var shape = new Triangle(x1, y1, x2, y2, x3, y3);

        return this.setHitArea(gameObjects, shape, callback);
    },

    /**
     * Creates an Input Debug Shape for the given Game Object.
     *
     * The Game Object must have _already_ been enabled for input prior to calling this method.
     *
     * This is intended to assist you during development and debugging.
     *
     * Debug Shapes can only be created for Game Objects that are using standard Phaser Geometry for input,
     * including: Circle, Ellipse, Line, Polygon, Rectangle and Triangle.
     *
     * Game Objects that are using their automatic hit areas are using Rectangles by default, so will also work.
     *
     * The Debug Shape is created and added to the display list and is then kept in sync with the Game Object
     * it is connected with. Should you need to modify it yourself, such as to hide it, you can access it via
     * the Game Object property: `GameObject.input.hitAreaDebug`.
     *
     * Calling this method on a Game Object that already has a Debug Shape will first destroy the old shape,
     * before creating a new one. If you wish to remove the Debug Shape entirely, you should call the
     * method `InputPlugin.removeDebug`.
     *
     * Note that the debug shape will only show the outline of the input area. If the input test is using a
     * pixel perfect check, for example, then this is not displayed. If you are using a custom shape, that
     * doesn't extend one of the base Phaser Geometry objects, as your hit area, then this method will not
     * work.
     *
     * @method Phaser.Input.InputPlugin#enableDebug
     * @since 3.19.0
     *
     * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object to create the input debug shape for.
     * @param {number} [color=0x00ff00] - The outline color of the debug shape.
     *
     * @return {this} This Input Plugin.
     */
    enableDebug: function (gameObject, color)
    {
        if (color === undefined) { color = 0x00ff00; }

        var input = gameObject.input;

        if (!input || !input.hitArea)
        {
            return this;
        }

        var shape = input.hitArea;
        var shapeType = shape.type;
        var debug = input.hitAreaDebug;
        var factory = this.systems.add;
        var updateList = this.systems.updateList;

        if (debug)
        {
            updateList.remove(debug);

            debug.destroy();

            debug = null;
        }

        var offsetx = 0;
        var offsety = 0;

        switch (shapeType)
        {
            case GEOM_CONST.CIRCLE:
                debug = factory.arc(0, 0, shape.radius);
                offsetx = shape.x - shape.radius;
                offsety = shape.y - shape.radius;
                break;

            case GEOM_CONST.ELLIPSE:
                debug = factory.ellipse(0, 0, shape.width, shape.height);
                offsetx = shape.x - shape.width / 2;
                offsety = shape.y - shape.height / 2;
                break;

            case GEOM_CONST.LINE:
                debug = factory.line(0, 0, shape.x1, shape.y1, shape.x2, shape.y2);
                break;

            case GEOM_CONST.POLYGON:
                debug = factory.polygon(0, 0, shape.points);
                break;

            case GEOM_CONST.RECTANGLE:
                debug = factory.rectangle(0, 0, shape.width, shape.height);
                offsetx = shape.x;
                offsety = shape.y;
                break;

            case GEOM_CONST.TRIANGLE:
                debug = factory.triangle(0, 0, shape.x1, shape.y1, shape.x2, shape.y2, shape.x3, shape.y3);
                break;
        }

        if (debug)
        {
            debug.isFilled = false;
            debug.strokeColor = color;

            debug.preUpdate = function ()
            {
                debug.setStrokeStyle(1 / gameObject.scale, debug.strokeColor);

                debug.setDisplayOrigin(gameObject.displayOriginX, gameObject.displayOriginY);

                var x = gameObject.x;
                var y = gameObject.y;
                var rotation = gameObject.rotation;
                var scaleX = gameObject.scaleX;
                var scaleY = gameObject.scaleY;

                if (gameObject.parentContainer)
                {
                    var matrix = gameObject.getWorldTransformMatrix();

                    x = matrix.tx;
                    y = matrix.ty;
                    rotation = matrix.rotation;
                    scaleX = matrix.scaleX;
                    scaleY = matrix.scaleY;
                }

                debug.setRotation(rotation);
                debug.setScale(scaleX, scaleY);
                debug.setPosition(x + offsetx * scaleX, y + offsety * scaleY);
                debug.setScrollFactor(gameObject.scrollFactorX, gameObject.scrollFactorY);
                debug.setDepth(gameObject.depth);
            };

            updateList.add(debug);

            input.hitAreaDebug = debug;
        }

        return this;
    },

    /**
     * Removes an Input Debug Shape from the given Game Object.
     *
     * The shape is destroyed immediately and the `hitAreaDebug` property is set to `null`.
     *
     * @method Phaser.Input.InputPlugin#removeDebug
     * @since 3.19.0
     *
     * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object to remove the input debug shape from.
     *
     * @return {this} This Input Plugin.
     */
    removeDebug: function (gameObject)
    {
        var input = gameObject.input;

        if (input && input.hitAreaDebug)
        {
            var debug = input.hitAreaDebug;

            this.systems.updateList.remove(debug);

            debug.destroy();

            input.hitAreaDebug = null;
        }

        return this;
    },

    /**
     * Sets the Pointers to always poll.
     *
     * When a pointer is polled it runs a hit test to see which Game Objects are currently below it,
     * or being interacted with it, regardless if the Pointer has actually moved or not.
     *
     * You should enable this if you want objects in your game to fire over / out events, and the objects
     * are constantly moving, but the pointer may not have. Polling every frame has additional computation
     * costs, especially if there are a large number of interactive objects in your game.
     *
     * @method Phaser.Input.InputPlugin#setPollAlways
     * @since 3.0.0
     *
     * @return {this} This InputPlugin object.
     */
    setPollAlways: function ()
    {
        return this.setPollRate(0);
    },

    /**
     * Sets the Pointers to only poll when they are moved or updated.
     *
     * When a pointer is polled it runs a hit test to see which Game Objects are currently below it,
     * or being interacted with it.
     *
     * @method Phaser.Input.InputPlugin#setPollOnMove
     * @since 3.0.0
     *
     * @return {this} This InputPlugin object.
     */
    setPollOnMove: function ()
    {
        return this.setPollRate(-1);
    },

    /**
     * Sets the poll rate value. This is the amount of time that should have elapsed before a pointer
     * will be polled again. See the `setPollAlways` and `setPollOnMove` methods.
     *
     * @method Phaser.Input.InputPlugin#setPollRate
     * @since 3.0.0
     *
     * @param {number} value - The amount of time, in ms, that should elapsed before re-polling the pointers.
     *
     * @return {this} This InputPlugin object.
     */
    setPollRate: function (value)
    {
        this.pollRate = value;
        this._pollTimer = 0;

        return this;
    },

    /**
     * When set to `true` the global Input Manager will emulate DOM behavior by only emitting events from
     * the top-most Scene in the Scene List. By default, if a Scene receives an input event it will then stop the event
     * from flowing down to any Scenes below it in the Scene list. To disable this behavior call this method with `false`.
     *
     * @method Phaser.Input.InputPlugin#setGlobalTopOnly
     * @since 3.0.0
     *
     * @param {boolean} value - Set to `true` to stop processing input events on the Scene that receives it, or `false` to let the event continue down the Scene list.
     *
     * @return {this} This InputPlugin object.
     */
    setGlobalTopOnly: function (value)
    {
        this.manager.globalTopOnly = value;

        return this;
    },

    /**
     * When set to `true` this Input Plugin will emulate DOM behavior by only emitting events from
     * the top-most Game Objects in the Display List.
     *
     * If set to `false` it will emit events from all Game Objects below a Pointer, not just the top one.
     *
     * @method Phaser.Input.InputPlugin#setTopOnly
     * @since 3.0.0
     *
     * @param {boolean} value - `true` to only include the top-most Game Object, or `false` to include all Game Objects in a hit test.
     *
     * @return {this} This InputPlugin object.
     */
    setTopOnly: function (value)
    {
        this.topOnly = value;

        return this;
    },

    /**
     * Given an array of Game Objects and a Pointer, sort the array and return it,
     * so that the objects are in render order with the lowest at the bottom.
     *
     * @method Phaser.Input.InputPlugin#sortGameObjects
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject[]} gameObjects - An array of Game Objects to be sorted.
     * @param {Phaser.Input.Pointer} pointer - The Pointer to check against the Game Objects.
     *
     * @return {Phaser.GameObjects.GameObject[]} The sorted array of Game Objects.
     */
    sortGameObjects: function (gameObjects, pointer)
    {
        if (gameObjects.length < 2 || !pointer.camera)
        {
            return gameObjects;
        }

        var list = pointer.camera.renderList;

        return gameObjects.sort(function (childA, childB)
        {
            var indexA = Math.max(list.indexOf(childA), 0);
            var indexB = Math.max(list.indexOf(childB), 0);

            return indexB - indexA;
        });
    },

    /**
     * Given an array of Drop Zone Game Objects, sort the array and return it,
     * so that the objects are in depth index order with the lowest at the bottom.
     *
     * @method Phaser.Input.InputPlugin#sortDropZones
     * @since 3.52.0
     *
     * @param {Phaser.GameObjects.GameObject[]} gameObjects - An array of Game Objects to be sorted.
     *
     * @return {Phaser.GameObjects.GameObject[]} The sorted array of Game Objects.
     */
    sortDropZones: function (gameObjects)
    {
        if (gameObjects.length < 2)
        {
            return gameObjects;
        }

        this.scene.sys.depthSort();

        return gameObjects.sort(this.sortDropZoneHandler.bind(this));
    },

    /**
     * Return the child lowest down the display list (with the smallest index)
     * Will iterate through all parent containers, if present.
     *
     * Prior to version 3.52.0 this method was called `sortHandlerGO`.
     *
     * @method Phaser.Input.InputPlugin#sortDropZoneHandler
     * @private
     * @since 3.52.0
     *
     * @param {Phaser.GameObjects.GameObject} childA - The first Game Object to compare.
     * @param {Phaser.GameObjects.GameObject} childB - The second Game Object to compare.
     *
     * @return {number} Returns either a negative or positive integer, or zero if they match.
     */
    sortDropZoneHandler: function (childA, childB)
    {
        if (!childA.parentContainer && !childB.parentContainer)
        {
            //  Quick bail out when neither child has a container
            return this.displayList.getIndex(childB) - this.displayList.getIndex(childA);
        }
        else if (childA.parentContainer === childB.parentContainer)
        {
            //  Quick bail out when both children have the same container
            return childB.parentContainer.getIndex(childB) - childA.parentContainer.getIndex(childA);
        }
        else if (childA.parentContainer === childB)
        {
            //  Quick bail out when childA is a child of childB
            return -1;
        }
        else if (childB.parentContainer === childA)
        {
            //  Quick bail out when childA is a child of childB
            return 1;
        }
        else
        {
            //  Container index check
            var listA = childA.getIndexList();
            var listB = childB.getIndexList();
            var len = Math.min(listA.length, listB.length);

            for (var i = 0; i < len; i++)
            {
                var indexA = listA[i];
                var indexB = listB[i];

                if (indexA === indexB)
                {
                    //  Go to the next level down
                    continue;
                }
                else
                {
                    //  Non-matching parents, so return
                    return indexB - indexA;
                }
            }

            return listB.length - listA.length;
        }

        //  Technically this shouldn't happen, but ...
        // eslint-disable-next-line no-unreachable
        return 0;
    },

    /**
     * This method should be called from within an input event handler, such as `pointerdown`.
     *
     * When called, it stops the Input Manager from allowing _this specific event_ to be processed by any other Scene
     * not yet handled in the scene list.
     *
     * @method Phaser.Input.InputPlugin#stopPropagation
     * @since 3.0.0
     *
     * @return {this} This InputPlugin object.
     */
    stopPropagation: function ()
    {
        this.manager._tempSkip = true;

        return this;
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
     * @method Phaser.Input.InputPlugin#addPointer
     * @since 3.10.0
     *
     * @param {number} [quantity=1] The number of new Pointers to create. A maximum of 10 is allowed in total.
     *
     * @return {Phaser.Input.Pointer[]} An array containing all of the new Pointer objects that were created.
     */
    addPointer: function (quantity)
    {
        return this.manager.addPointer(quantity);
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
     * @method Phaser.Input.InputPlugin#setDefaultCursor
     * @since 3.10.0
     *
     * @param {string} cursor - The CSS to be used when setting the default cursor.
     *
     * @return {this} This Input instance.
     */
    setDefaultCursor: function (cursor)
    {
        this.manager.setDefaultCursor(cursor);

        return this;
    },

    /**
     * The Scene that owns this plugin is transitioning in.
     *
     * @method Phaser.Input.InputPlugin#transitionIn
     * @private
     * @since 3.5.0
     */
    transitionIn: function ()
    {
        this.enabled = this.settings.transitionAllowInput;
    },

    /**
     * The Scene that owns this plugin has finished transitioning in.
     *
     * @method Phaser.Input.InputPlugin#transitionComplete
     * @private
     * @since 3.5.0
     */
    transitionComplete: function ()
    {
        if (!this.settings.transitionAllowInput)
        {
            this.enabled = true;
        }
    },

    /**
     * The Scene that owns this plugin is transitioning out.
     *
     * @method Phaser.Input.InputPlugin#transitionOut
     * @private
     * @since 3.5.0
     */
    transitionOut: function ()
    {
        this.enabled = this.settings.transitionAllowInput;
    },

    /**
     * The Scene that owns this plugin is shutting down.
     * We need to kill and reset all internal properties as well as stop listening to Scene events.
     *
     * @method Phaser.Input.InputPlugin#shutdown
     * @fires Phaser.Input.Events#SHUTDOWN
     * @private
     * @since 3.0.0
     */
    shutdown: function ()
    {
        //  Registered input plugins listen for this
        this.pluginEvents.emit(Events.SHUTDOWN);

        this._temp.length = 0;
        this._list.length = 0;
        this._draggable.length = 0;
        this._pendingRemoval.length = 0;
        this._pendingInsertion.length = 0;
        this._dragState.length = 0;

        for (var i = 0; i < 10; i++)
        {
            this._drag[i] = [];
            this._over[i] = [];
        }

        this.removeAllListeners();

        var manager = this.manager;

        manager.canvas.style.cursor = manager.defaultCursor;

        var eventEmitter = this.systems.events;

        eventEmitter.off(SceneEvents.TRANSITION_START, this.transitionIn, this);
        eventEmitter.off(SceneEvents.TRANSITION_OUT, this.transitionOut, this);
        eventEmitter.off(SceneEvents.TRANSITION_COMPLETE, this.transitionComplete, this);
        eventEmitter.off(SceneEvents.PRE_UPDATE, this.preUpdate, this);

        manager.events.off(Events.GAME_OUT, this.onGameOut, this);
        manager.events.off(Events.GAME_OVER, this.onGameOver, this);

        eventEmitter.off(SceneEvents.SHUTDOWN, this.shutdown, this);
    },

    /**
     * Loops through all of the Input Manager Pointer instances and calls `reset` on them.
     *
     * Use this function if you find that input has been stolen from Phaser via a 3rd
     * party component, such as Vue, and you need to tell Phaser to reset the Pointer states.
     *
     * @method Phaser.Input.InputPlugin#resetPointers
     * @since 3.60.0
     */
    resetPointers: function ()
    {
        var pointers = this.manager.pointers;

        for (var i = 0; i < pointers.length; i++)
        {
            pointers[i].reset();
        }
    },

    /**
     * The Scene that owns this plugin is being destroyed.
     * We need to shutdown and then kill off all external references.
     *
     * @method Phaser.Input.InputPlugin#destroy
     * @fires Phaser.Input.Events#DESTROY
     * @private
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.shutdown();

        //  Registered input plugins listen for this
        this.pluginEvents.emit(Events.DESTROY);

        this.pluginEvents.removeAllListeners();

        this.scene.sys.events.off(SceneEvents.START, this.start, this);

        this.scene = null;
        this.cameras = null;
        this.manager = null;
        this.events = null;
        this.mouse = null;
    },

    /**
     * The x coordinates of the ActivePointer based on the first camera in the camera list.
     * This is only safe to use if your game has just 1 non-transformed camera and doesn't use multi-touch.
     *
     * @name Phaser.Input.InputPlugin#x
     * @type {number}
     * @readonly
     * @since 3.0.0
     */
    x: {

        get: function ()
        {
            return this.manager.activePointer.x;
        }

    },

    /**
     * The y coordinates of the ActivePointer based on the first camera in the camera list.
     * This is only safe to use if your game has just 1 non-transformed camera and doesn't use multi-touch.
     *
     * @name Phaser.Input.InputPlugin#y
     * @type {number}
     * @readonly
     * @since 3.0.0
     */
    y: {

        get: function ()
        {
            return this.manager.activePointer.y;
        }

    },

    /**
     * Are any mouse or touch pointers currently over the game canvas?
     *
     * @name Phaser.Input.InputPlugin#isOver
     * @type {boolean}
     * @readonly
     * @since 3.16.0
     */
    isOver: {

        get: function ()
        {
            return this.manager.isOver;
        }

    },

    /**
     * The mouse has its own unique Pointer object, which you can reference directly if making a _desktop specific game_.
     * If you are supporting both desktop and touch devices then do not use this property, instead use `activePointer`
     * which will always map to the most recently interacted pointer.
     *
     * @name Phaser.Input.InputPlugin#mousePointer
     * @type {Phaser.Input.Pointer}
     * @readonly
     * @since 3.10.0
     */
    mousePointer: {

        get: function ()
        {
            return this.manager.mousePointer;
        }

    },

    /**
     * The current active input Pointer.
     *
     * @name Phaser.Input.InputPlugin#activePointer
     * @type {Phaser.Input.Pointer}
     * @readonly
     * @since 3.0.0
     */
    activePointer: {

        get: function ()
        {
            return this.manager.activePointer;
        }

    },

    /**
     * A touch-based Pointer object.
     * This will be `undefined` by default unless you add a new Pointer using `addPointer`.
     *
     * @name Phaser.Input.InputPlugin#pointer1
     * @type {Phaser.Input.Pointer}
     * @readonly
     * @since 3.10.0
     */
    pointer1: {

        get: function ()
        {
            return this.manager.pointers[1];
        }

    },

    /**
     * A touch-based Pointer object.
     * This will be `undefined` by default unless you add a new Pointer using `addPointer`.
     *
     * @name Phaser.Input.InputPlugin#pointer2
     * @type {Phaser.Input.Pointer}
     * @readonly
     * @since 3.10.0
     */
    pointer2: {

        get: function ()
        {
            return this.manager.pointers[2];
        }

    },

    /**
     * A touch-based Pointer object.
     * This will be `undefined` by default unless you add a new Pointer using `addPointer`.
     *
     * @name Phaser.Input.InputPlugin#pointer3
     * @type {Phaser.Input.Pointer}
     * @readonly
     * @since 3.10.0
     */
    pointer3: {

        get: function ()
        {
            return this.manager.pointers[3];
        }

    },

    /**
     * A touch-based Pointer object.
     * This will be `undefined` by default unless you add a new Pointer using `addPointer`.
     *
     * @name Phaser.Input.InputPlugin#pointer4
     * @type {Phaser.Input.Pointer}
     * @readonly
     * @since 3.10.0
     */
    pointer4: {

        get: function ()
        {
            return this.manager.pointers[4];
        }

    },

    /**
     * A touch-based Pointer object.
     * This will be `undefined` by default unless you add a new Pointer using `addPointer`.
     *
     * @name Phaser.Input.InputPlugin#pointer5
     * @type {Phaser.Input.Pointer}
     * @readonly
     * @since 3.10.0
     */
    pointer5: {

        get: function ()
        {
            return this.manager.pointers[5];
        }

    },

    /**
     * A touch-based Pointer object.
     * This will be `undefined` by default unless you add a new Pointer using `addPointer`.
     *
     * @name Phaser.Input.InputPlugin#pointer6
     * @type {Phaser.Input.Pointer}
     * @readonly
     * @since 3.10.0
     */
    pointer6: {

        get: function ()
        {
            return this.manager.pointers[6];
        }

    },

    /**
     * A touch-based Pointer object.
     * This will be `undefined` by default unless you add a new Pointer using `addPointer`.
     *
     * @name Phaser.Input.InputPlugin#pointer7
     * @type {Phaser.Input.Pointer}
     * @readonly
     * @since 3.10.0
     */
    pointer7: {

        get: function ()
        {
            return this.manager.pointers[7];
        }

    },

    /**
     * A touch-based Pointer object.
     * This will be `undefined` by default unless you add a new Pointer using `addPointer`.
     *
     * @name Phaser.Input.InputPlugin#pointer8
     * @type {Phaser.Input.Pointer}
     * @readonly
     * @since 3.10.0
     */
    pointer8: {

        get: function ()
        {
            return this.manager.pointers[8];
        }

    },

    /**
     * A touch-based Pointer object.
     * This will be `undefined` by default unless you add a new Pointer using `addPointer`.
     *
     * @name Phaser.Input.InputPlugin#pointer9
     * @type {Phaser.Input.Pointer}
     * @readonly
     * @since 3.10.0
     */
    pointer9: {

        get: function ()
        {
            return this.manager.pointers[9];
        }

    },

    /**
     * A touch-based Pointer object.
     * This will be `undefined` by default unless you add a new Pointer using `addPointer`.
     *
     * @name Phaser.Input.InputPlugin#pointer10
     * @type {Phaser.Input.Pointer}
     * @readonly
     * @since 3.10.0
     */
    pointer10: {

        get: function ()
        {
            return this.manager.pointers[10];
        }

    }

});

PluginCache.register('InputPlugin', InputPlugin, 'input');

module.exports = InputPlugin;
