/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var Vector2 = require('../math/Vector2');

// DOM event button value:
// A number representing a given button:
// 0: Main button pressed, usually the left button or the un-initialized state
// 1: Auxiliary button pressed, usually the wheel button or the middle button (if present)
// 2: Secondary button pressed, usually the right button
// 3: Fourth button, typically the Browser Back button
// 4: Fifth button, typically the Browser Forward button
// For a mouse configured for left-handed use, the button actions are reversed. In this case, the values are read from right to left.

/**
 * @classdesc
 * [description]
 *
 * @class Pointer
 * @memberOf Phaser.Input
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Input.InputManager} manager - [description]
 * @param {integer} id - [description]
 */
var Pointer = new Class({

    initialize:

    function Pointer (manager, id)
    {
        /**
         * [description]
         *
         * @name Phaser.Input.Pointer#manager
         * @type {Phaser.Input.InputManager}
         * @since 3.0.0
         */
        this.manager = manager;

        /**
         * [description]
         *
         * @name Phaser.Input.Pointer#id
         * @type {integer}
         * @since 3.0.0
         */
        this.id = id;

        /**
         * [description]
         *
         * @name Phaser.Input.Pointer#event
         * @type {null}
         * @since 3.0.0
         */
        this.event;

        /**
         * The camera the Pointer interacted with during its last update.
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
         * @name Phaser.Input.Pointer#buttons
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.buttons = 0;

        /**
         * [description]
         *
         * @name Phaser.Input.Pointer#position
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.position = new Vector2();

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
         * [description]
         *
         * @name Phaser.Input.Pointer#dirty
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.dirty = false;

        /**
         * [description]
         *
         * @name Phaser.Input.Pointer#justDown
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.justDown = false;

        /**
         * [description]
         *
         * @name Phaser.Input.Pointer#justUp
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.justUp = false;

        /**
         * [description]
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
    },

    /**
     * [description]
     *
     * @method Phaser.Input.Pointer#positionToCamera
     * @since 3.0.0
     *
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     * @param {(Phaser.Math.Vector2|object)} output - [description]
     *
     * @return {(Phaser.Math.Vector2|object)} [description]
     */
    positionToCamera: function (camera, output)
    {
        return camera.getWorldPoint(this.x, this.y, output);
    },

    /**
     * [description]
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
     * [description]
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

    },

    /**
     * [description]
     *
     * @method Phaser.Input.Pointer#reset
     * @since 3.0.0
     */
    reset: function ()
    {
        // this.buttons = 0;

        this.dirty = false;

        this.justDown = false;
        this.justUp = false;
        this.justMoved = false;

        this.movementX = 0;
        this.movementY = 0;
    },

    /**
     * [description]
     *
     * @method Phaser.Input.Pointer#touchmove
     * @since 3.0.0
     *
     * @param {TouchEvent} event - [description]
     * @param {integer} time - The current timestamp as generated by the Request Animation Frame or SetTimeout.
     */
    touchmove: function (event)
    {
        this.event = event;

        this.x = this.manager.transformX(event.changedTouches[0].pageX);
        this.y = this.manager.transformY(event.changedTouches[0].pageY);

        this.justMoved = true;

        this.dirty = true;

        this.wasTouch = true;
    },

    /**
     * [description]
     *
     * @method Phaser.Input.Pointer#move
     * @since 3.0.0
     *
     * @param {MouseEvent} event - [description]
     * @param {integer} time - The current timestamp as generated by the Request Animation Frame or SetTimeout.
     */
    move: function (event)
    {
        if (event.buttons)
        {
            this.buttons = event.buttons;
        }

        this.event = event;

        this.x = this.manager.transformX(event.pageX);
        this.y = this.manager.transformY(event.pageY);

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
     * [description]
     *
     * @method Phaser.Input.Pointer#down
     * @since 3.0.0
     *
     * @param {MouseEvent} event - [description]
     * @param {integer} time - The current timestamp as generated by the Request Animation Frame or SetTimeout.
     */
    down: function (event, time)
    {
        if (event.buttons)
        {
            this.buttons = event.buttons;
        }

        this.event = event;

        this.x = this.manager.transformX(event.pageX);
        this.y = this.manager.transformY(event.pageY);

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
     * [description]
     *
     * @method Phaser.Input.Pointer#touchstart
     * @since 3.0.0
     *
     * @param {TouchEvent} event - [description]
     * @param {integer} time - The current timestamp as generated by the Request Animation Frame or SetTimeout.
     */
    touchstart: function (event, time)
    {
        this.buttons = 1;

        this.event = event;

        this.x = this.manager.transformX(event.changedTouches[0].pageX);
        this.y = this.manager.transformY(event.changedTouches[0].pageY);

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
     * [description]
     *
     * @method Phaser.Input.Pointer#up
     * @since 3.0.0
     *
     * @param {MouseEvent} event - [description]
     * @param {integer} time - The current timestamp as generated by the Request Animation Frame or SetTimeout.
     */
    up: function (event, time)
    {
        if (event.buttons)
        {
            this.buttons = event.buttons;
        }

        this.event = event;

        this.x = this.manager.transformX(event.pageX);
        this.y = this.manager.transformY(event.pageY);

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
     * [description]
     *
     * @method Phaser.Input.Pointer#touchend
     * @since 3.0.0
     *
     * @param {TouchEvent} event - [description]
     * @param {integer} time - The current timestamp as generated by the Request Animation Frame or SetTimeout.
     */
    touchend: function (event, time)
    {
        this.buttons = 0;

        this.event = event;

        this.x = this.manager.transformX(event.changedTouches[0].pageX);
        this.y = this.manager.transformY(event.changedTouches[0].pageY);

        this.primaryDown = false;
        this.upX = this.x;
        this.upY = this.y;
        this.upTime = time;

        this.justUp = true;
        this.isDown = false;

        this.dirty = true;

        this.wasTouch = true;
    },

    /**
     * [description]
     *
     * @method Phaser.Input.Pointer#noButtonDown
     * @since 3.0.0
     *
     * @return {boolean} [description]
     */
    noButtonDown: function ()
    {
        return (this.buttons === 0);
    },

    /**
     * [description]
     *
     * @method Phaser.Input.Pointer#leftButtonDown
     * @since 3.0.0
     *
     * @return {boolean} [description]
     */
    leftButtonDown: function ()
    {
        return (this.buttons & 1);
    },

    /**
     * [description]
     *
     * @method Phaser.Input.Pointer#rightButtonDown
     * @since 3.0.0
     *
     * @return {boolean} [description]
     */
    rightButtonDown: function ()
    {
        return (this.buttons & 2);
    },

    /**
     * [description]
     *
     * @method Phaser.Input.Pointer#middleButtonDown
     * @since 3.0.0
     *
     * @return {boolean} [description]
     */
    middleButtonDown: function ()
    {
        return (this.buttons & 4);
    },

    /**
     * [description]
     *
     * @method Phaser.Input.Pointer#backButtonDown
     * @since 3.0.0
     *
     * @return {boolean} [description]
     */
    backButtonDown: function ()
    {
        return (this.buttons & 8);
    },

    /**
     * [description]
     *
     * @method Phaser.Input.Pointer#forwardButtonDown
     * @since 3.0.0
     *
     * @return {boolean} [description]
     */
    forwardButtonDown: function ()
    {
        return (this.buttons & 16);
    },

    /**
     * [description]
     *
     * @method Phaser.Input.Pointer#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.camera = null;
        this.manager = null;
        this.position = null;
    }

});

module.exports = Pointer;
