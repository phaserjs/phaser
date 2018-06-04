/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var Vector2 = require('../math/Vector2');

/**
 * @classdesc
 * A Pointer object encapsulates both mouse and touch input within Phaser.
 *
 * By default, Phaser will create 2 pointers for your game to use. If you require more, i.e. for a multi-touch
 * game, then use the `InputPlugin.addPointer` method to do so, rather than instantiating this class directly,
 * otherwise it won't be managed by the input system.
 *
 * You can reference the current active pointer via `InputPlugin.activePointer`. You can also use the properties
 * `InputPlugin.pointer1` through to `pointer10`, for each pointer you have enabled in your game.
 *
 * The properties of this object are set by the Input Plugin during processing. This object is then sent in all
 * input related events that the Input Plugin emits, so you can reference properties from it directly in your
 * callbacks.
 *
 * @class Pointer
 * @memberOf Phaser.Input
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Input.InputManager} manager - A reference to the Input Manager.
 * @param {integer} id - The internal ID of this Pointer.
 */
var Pointer = new Class({

    initialize:

    function Pointer (manager, id)
    {
        /**
         * A reference to the Input Manager.
         *
         * @name Phaser.Input.Pointer#manager
         * @type {Phaser.Input.InputManager}
         * @since 3.0.0
         */
        this.manager = manager;

        /**
         * The internal ID of this Pointer.
         *
         * @name Phaser.Input.Pointer#id
         * @type {integer}
         * @readOnly
         * @since 3.0.0
         */
        this.id = id;

        /**
         * The most recent native DOM Event this Pointer has processed.
         *
         * @name Phaser.Input.Pointer#event
         * @type {(TouchEvent|MouseEvent)}
         * @since 3.0.0
         */
        this.event;

        /**
         * The camera the Pointer interacted with during its last update.
         * 
         * A Pointer can only ever interact with one camera at once, which will be the top-most camera
         * in the list should multiple cameras be positioned on-top of each other.
         *
         * @name Phaser.Input.Pointer#camera
         * @type {Phaser.Cameras.Scene2D.Camera}
         * @default null
         * @since 3.0.0
         */
        this.camera = null;

        /**
         * 0: No button or un-initialized
         * 1: Left button
         * 2: Right button
         * 4: Wheel button or middle button
         * 8: 4th button (typically the "Browser Back" button)
         * 16: 5th button (typically the "Browser Forward" button)
         * 
         * For a mouse configured for left-handed use, the button actions are reversed.
         * In this case, the values are read from right to left.
         *
         * @name Phaser.Input.Pointer#buttons
         * @type {integer}
         * @default 0
         * @since 3.0.0
         */
        this.buttons = 0;

        /**
         * The position of the Pointer in screen space.
         *
         * @name Phaser.Input.Pointer#position
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.position = new Vector2();

        /**
         * The x position of this Pointer, translated into the coordinate space of the most recent Camera it interacted with.
         *
         * @name Phaser.Input.Pointer#worldX
         * @type {number}
         * @default 0
         * @since 3.10.0
         */
        this.worldX = 0;

        /**
         * The y position of this Pointer, translated into the coordinate space of the most recent Camera it interacted with.
         *
         * @name Phaser.Input.Pointer#worldY
         * @type {number}
         * @default 0
         * @since 3.10.0
         */
        this.worldY = 0;

        /**
         * X coordinate of the Pointer when Button 1 (left button), or Touch, was pressed, used for dragging objects.
         *
         * @name Phaser.Input.Pointer#downX
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.downX = 0;

        /**
         * Y coordinate of the Pointer when Button 1 (left button), or Touch, was pressed, used for dragging objects.
         *
         * @name Phaser.Input.Pointer#downY
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.downY = 0;

        /**
         * Time when Button 1 (left button), or Touch, was pressed, used for dragging objects.
         *
         * @name Phaser.Input.Pointer#downTime
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.downTime = 0;

        /**
         * X coordinate of the Pointer when Button 1 (left button), or Touch, was released, used for dragging objects.
         *
         * @name Phaser.Input.Pointer#upX
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.upX = 0;

        /**
         * Y coordinate of the Pointer when Button 1 (left button), or Touch, was released, used for dragging objects.
         *
         * @name Phaser.Input.Pointer#upY
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.upY = 0;

        /**
         * Time when Button 1 (left button), or Touch, was released, used for dragging objects.
         *
         * @name Phaser.Input.Pointer#upTime
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.upTime = 0;

        /**
         * Is the primary button down? (usually button 0, the left mouse button)
         *
         * @name Phaser.Input.Pointer#primaryDown
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.primaryDown = false;

        /**
         * The Drag State of the Pointer:
         *
         * 0 = Not dragging anything
         * 1 = Being checked if dragging
         * 2 = Dragging something
         *
         * @name Phaser.Input.Pointer#dragState
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.dragState = 0;

        /**
         * Is _any_ button on this pointer considered as being down?
         *
         * @name Phaser.Input.Pointer#isDown
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.isDown = false;

        /**
         * A dirty flag for this Pointer, used internally by the Input Plugin.
         *
         * @name Phaser.Input.Pointer#dirty
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.dirty = false;

        /**
         * Is this Pointer considered as being "just down" or not?
         *
         * @name Phaser.Input.Pointer#justDown
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.justDown = false;

        /**
         * Is this Pointer considered as being "just up" or not?
         *
         * @name Phaser.Input.Pointer#justUp
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.justUp = false;

        /**
         * Is this Pointer considered as being "just moved" or not?
         *
         * @name Phaser.Input.Pointer#justMoved
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.justMoved = false;

        /**
         * Did the previous input event come from a Touch input (true) or Mouse? (false)
         *
         * @name Phaser.Input.Pointer#wasTouch
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.wasTouch = false;

        /**
         * If the mouse is locked, the horizontal relative movement of the Pointer in pixels since last frame.
         *
         * @name Phaser.Input.Pointer#movementX
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.movementX = 0;

        /**
         * If the mouse is locked, the vertical relative movement of the Pointer in pixels since last frame.
         *
         * @name Phaser.Input.Pointer#movementY
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.movementY = 0;

        /**
         * The identifier property of the Pointer as set by the DOM event when this Pointer is started.
         *
         * @name Phaser.Input.Pointer#identifier
         * @type {number}
         * @since 3.10.0
         */
        this.identifier = 0;

        /**
         * The pointerId property of the Pointer as set by the DOM event when this Pointer is started.
         * The browser can and will recycle this value.
         *
         * @name Phaser.Input.Pointer#pointerId
         * @type {number}
         * @since 3.10.0
         */
        this.pointerId = null;

        /**
         * An active Pointer is one that is currently pressed down on the display.
         * A Mouse is always considered as active.
         *
         * @name Phaser.Input.Pointer#active
         * @type {boolean}
         * @since 3.10.0
         */
        this.active = (id === 0) ? true : false;
    },

    /**
     * Takes a Camera and returns a Vector2 containing the translated position of this Pointer
     * within that Camera. This can be used to convert this Pointers position into camera space.
     *
     * @method Phaser.Input.Pointer#positionToCamera
     * @since 3.0.0
     *
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to use for the translation.
     * @param {(Phaser.Math.Vector2|object)} [output] - A Vector2-like object in which to store the translated position.
     *
     * @return {(Phaser.Math.Vector2|object)} A Vector2 containing the translated coordinates of this Pointer, based on the given camera.
     */
    positionToCamera: function (camera, output)
    {
        return camera.getWorldPoint(this.x, this.y, output);
    },

    /**
     * Resets the temporal properties of this Pointer.
     * Called automatically by the Input Plugin each update.
     *
     * @method Phaser.Input.Pointer#reset
     * @private
     * @since 3.0.0
     */
    reset: function ()
    {
        this.dirty = false;

        this.justDown = false;
        this.justUp = false;
        this.justMoved = false;

        this.movementX = 0;
        this.movementY = 0;
    },

    /**
     * Internal method to handle a Mouse Up Event.
     *
     * @method Phaser.Input.Pointer#up
     * @private
     * @since 3.0.0
     *
     * @param {MouseEvent} event - The Mouse Event to process.
     * @param {integer} time - The current timestamp as generated by the Request Animation Frame or SetTimeout.
     */
    up: function (event, time)
    {
        if (event.buttons)
        {
            this.buttons = event.buttons;
        }

        this.event = event;

        //  Sets the local x/y properties
        this.manager.transformPointer(this, event.pageX, event.pageY);

        //  0: Main button pressed, usually the left button or the un-initialized state
        if (event.button === 0)
        {
            this.primaryDown = false;
            this.upX = this.x;
            this.upY = this.y;
            this.upTime = time;
        }

        this.justUp = true;
        this.isDown = false;

        this.dirty = true;

        this.wasTouch = false;
    },

    /**
     * Internal method to handle a Mouse Down Event.
     *
     * @method Phaser.Input.Pointer#down
     * @private
     * @since 3.0.0
     *
     * @param {MouseEvent} event - The Mouse Event to process.
     * @param {integer} time - The current timestamp as generated by the Request Animation Frame or SetTimeout.
     */
    down: function (event, time)
    {
        if (event.buttons)
        {
            this.buttons = event.buttons;
        }

        this.event = event;

        //  Sets the local x/y properties
        this.manager.transformPointer(this, event.pageX, event.pageY);

        //  0: Main button pressed, usually the left button or the un-initialized state
        if (event.button === 0)
        {
            this.primaryDown = true;
            this.downX = this.x;
            this.downY = this.y;
            this.downTime = time;
        }

        this.justDown = true;
        this.isDown = true;

        this.dirty = true;

        this.wasTouch = false;
    },

    /**
     * Internal method to handle a Mouse Move Event.
     *
     * @method Phaser.Input.Pointer#move
     * @private
     * @since 3.0.0
     *
     * @param {MouseEvent} event - The Mouse Event to process.
     * @param {integer} time - The current timestamp as generated by the Request Animation Frame or SetTimeout.
     */
    move: function (event)
    {
        if (event.buttons)
        {
            this.buttons = event.buttons;
        }

        this.event = event;

        //  Sets the local x/y properties
        this.manager.transformPointer(this, event.pageX, event.pageY);

        if (this.manager.mouse.locked)
        {
            // Multiple DOM events may occur within one frame, but only one Phaser event will fire
            this.movementX += event.movementX || event.mozMovementX || event.webkitMovementX || 0;
            this.movementY += event.movementY || event.mozMovementY || event.webkitMovementY || 0;
        }

        this.justMoved = true;

        this.dirty = true;

        this.wasTouch = false;
    },

    /**
     * Internal method to handle a Touch Start Event.
     *
     * @method Phaser.Input.Pointer#touchstart
     * @private
     * @since 3.0.0
     *
     * @param {TouchEvent} event - The Touch Event to process.
     * @param {integer} time - The current timestamp as generated by the Request Animation Frame or SetTimeout.
     */
    touchstart: function (event, time)
    {
        if (event['pointerId'])
        {
            this.pointerId = event.pointerId;
        }

        this.identifier = event.identifier;
        this.target = event.target;
        this.active = true;

        this.buttons = 1;

        this.event = event;

        //  Sets the local x/y properties
        this.manager.transformPointer(this, event.pageX, event.pageY);

        this.primaryDown = true;
        this.downX = this.x;
        this.downY = this.y;
        this.downTime = time;

        this.justDown = true;
        this.isDown = true;

        this.dirty = true;

        this.wasTouch = true;
    },

    /**
     * Internal method to handle a Touch Move Event.
     *
     * @method Phaser.Input.Pointer#touchmove
     * @private
     * @since 3.0.0
     *
     * @param {TouchEvent} event - The Touch Event to process.
     * @param {integer} time - The current timestamp as generated by the Request Animation Frame or SetTimeout.
     */
    touchmove: function (event)
    {
        this.event = event;

        //  Sets the local x/y properties
        this.manager.transformPointer(this, event.pageX, event.pageY);

        this.justMoved = true;

        this.dirty = true;

        this.wasTouch = true;
    },

    /**
     * Internal method to handle a Touch End Event.
     *
     * @method Phaser.Input.Pointer#touchend
     * @private
     * @since 3.0.0
     *
     * @param {TouchEvent} event - The Touch Event to process.
     * @param {integer} time - The current timestamp as generated by the Request Animation Frame or SetTimeout.
     */
    touchend: function (event, time)
    {
        this.buttons = 0;

        this.event = event;

        //  Sets the local x/y properties
        this.manager.transformPointer(this, event.pageX, event.pageY);

        this.primaryDown = false;
        this.upX = this.x;
        this.upY = this.y;
        this.upTime = time;

        this.justUp = true;
        this.isDown = false;

        this.dirty = true;

        this.wasTouch = true;
        
        this.active = false;
    },

    /**
     * Checks to see if any buttons are being held down on this Pointer.
     *
     * @method Phaser.Input.Pointer#noButtonDown
     * @since 3.0.0
     *
     * @return {boolean} `true` if no buttons are being held down.
     */
    noButtonDown: function ()
    {
        return (this.buttons === 0);
    },

    /**
     * Checks to see if the left button is being held down on this Pointer.
     *
     * @method Phaser.Input.Pointer#leftButtonDown
     * @since 3.0.0
     *
     * @return {boolean} `true` if the left button is being held down.
     */
    leftButtonDown: function ()
    {
        return (this.buttons & 1);
    },

    /**
     * Checks to see if the right button is being held down on this Pointer.
     *
     * @method Phaser.Input.Pointer#rightButtonDown
     * @since 3.0.0
     *
     * @return {boolean} `true` if the right button is being held down.
     */
    rightButtonDown: function ()
    {
        return (this.buttons & 2);
    },

    /**
     * Checks to see if the middle button is being held down on this Pointer.
     *
     * @method Phaser.Input.Pointer#middleButtonDown
     * @since 3.0.0
     *
     * @return {boolean} `true` if the middle button is being held down.
     */
    middleButtonDown: function ()
    {
        return (this.buttons & 4);
    },

    /**
     * Checks to see if the back button is being held down on this Pointer.
     *
     * @method Phaser.Input.Pointer#backButtonDown
     * @since 3.0.0
     *
     * @return {boolean} `true` if the back button is being held down.
     */
    backButtonDown: function ()
    {
        return (this.buttons & 8);
    },

    /**
     * Checks to see if the forward button is being held down on this Pointer.
     *
     * @method Phaser.Input.Pointer#forwardButtonDown
     * @since 3.0.0
     *
     * @return {boolean} `true` if the forward button is being held down.
     */
    forwardButtonDown: function ()
    {
        return (this.buttons & 16);
    },

    /**
     * Destroys this Pointer instance and resets its external references.
     *
     * @method Phaser.Input.Pointer#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.camera = null;
        this.manager = null;
        this.position = null;
    },

    /**
     * The x position of this Pointer.
     * The value is in screen space.
     * See `worldX` to get a camera converted position.
     *
     * @name Phaser.Input.Pointer#x
     * @type {number}
     * @since 3.0.0
     */
    x: {

        get: function ()
        {
            return this.position.x;
        },

        set: function (value)
        {
            this.position.x = value;
        }

    },

    /**
     * The y position of this Pointer.
     * The value is in screen space.
     * See `worldY` to get a camera converted position.
     *
     * @name Phaser.Input.Pointer#y
     * @type {number}
     * @since 3.0.0
     */
    y: {

        get: function ()
        {
            return this.position.y;
        },

        set: function (value)
        {
            this.position.y = value;
        }

    }

});

module.exports = Pointer;
