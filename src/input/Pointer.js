/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Angle = require('../math/angle/Between');
var Class = require('../utils/Class');
var Distance = require('../math/distance/DistanceBetween');
var FuzzyEqual = require('../math/fuzzy/Equal');
var SmoothStepInterpolation = require('../math/interpolation/SmoothStepInterpolation');
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
 * @memberof Phaser.Input
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
         * @readonly
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
         * The DOM element the Pointer was pressed down on, taken from the DOM event.
         *
         * @name Phaser.Input.Pointer#downElement
         * @type {any}
         * @readonly
         * @since 3.16.0
         */
        this.downElement;

        /**
         * The DOM element the Pointer was released on, taken from the DOM event.
         *
         * @name Phaser.Input.Pointer#upElement
         * @type {any}
         * @readonly
         * @since 3.16.0
         */
        this.upElement;

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
         * @readonly
         * @since 3.0.0
         */
        this.position = new Vector2();

        /**
         * The previous position of the Pointer in screen space.
         * 
         * The old x and y values are stored in here during the InputManager.transformPointer call.
         * 
         * Use the properties `velocity`, `angle` and `distance` to create your own gesture recognition.
         *
         * @name Phaser.Input.Pointer#prevPosition
         * @type {Phaser.Math.Vector2}
         * @readonly
         * @since 3.11.0
         */
        this.prevPosition = new Vector2();

        /**
         * An internal vector used for calculations of the pointer speed and angle.
         *
         * @name Phaser.Input.Pointer#midPoint
         * @type {Phaser.Math.Vector2}
         * @private
         * @since 3.16.0
         */
        this.midPoint = new Vector2(-1, -1);

        /**
         * The current velocity of the Pointer, based on its current and previous positions.
         * 
         * This value is smoothed out each frame, according to the `motionFactor` property.
         * 
         * This property is updated whenever the Pointer moves, regardless of any button states. In other words,
         * it changes based on movement alone - a button doesn't have to be pressed first.
         *
         * @name Phaser.Input.Pointer#velocity
         * @type {Phaser.Math.Vector2}
         * @readonly
         * @since 3.16.0
         */
        this.velocity = new Vector2();

        /**
         * The current angle the Pointer is moving, in radians, based on its previous and current position.
         * 
         * The angle is based on the old position facing to the current position.
         * 
         * This property is updated whenever the Pointer moves, regardless of any button states. In other words,
         * it changes based on movement alone - a button doesn't have to be pressed first.
         *
         * @name Phaser.Input.Pointer#angle
         * @type {number}
         * @readonly
         * @since 3.16.0
         */
        this.angle = 0;

        /**
         * The distance the Pointer has moved, based on its previous and current position.
         * 
         * This value is smoothed out each frame, according to the `motionFactor` property.
         * 
         * This property is updated whenever the Pointer moves, regardless of any button states. In other words,
         * it changes based on movement alone - a button doesn't have to be pressed first.
         * 
         * If you need the total distance travelled since the primary buttons was pressed down,
         * then use the `Pointer.getDistance` method.
         *
         * @name Phaser.Input.Pointer#distance
         * @type {number}
         * @readonly
         * @since 3.16.0
         */
        this.distance = 0;

        /**
         * The smoothing factor to apply to the Pointer position.
         * 
         * Due to their nature, pointer positions are inherently noisy. While this is fine for lots of games, if you need cleaner positions
         * then you can set this value to apply an automatic smoothing to the positions as they are recorded.
         * 
         * The default value of zero means 'no smoothing'.
         * Set to a small value, such as 0.2, to apply an average level of smoothing between positions. You can do this by changing this
         * value directly, or by setting the `input.smoothFactor` property in the Game Config.
         * 
         * Positions are only smoothed when the pointer moves. If the primary button on this Pointer enters an Up or Down state, then the position
         * is always precise, and not smoothed.
         *
         * @name Phaser.Input.Pointer#smoothFactor
         * @type {number}
         * @default 0
         * @since 3.16.0
         */
        this.smoothFactor = 0;

        /**
         * The factor applied to the motion smoothing each frame.
         * 
         * This value is passed to the Smooth Step Interpolation that is used to calculate the velocity,
         * angle and distance of the Pointer. It's applied every frame, until the midPoint reaches the current
         * position of the Pointer. 0.2 provides a good average but can be increased if you need a
         * quicker update and are working in a high performance environment. Never set this value to
         * zero.
         *
         * @name Phaser.Input.Pointer#motionFactor
         * @type {number}
         * @default 0.2
         * @since 3.16.0
         */
        this.motionFactor = 0.2;

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
         * Time when this Pointer was most recently moved (regardless of the state of its buttons, if any)
         *
         * @name Phaser.Input.Pointer#moveTime
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.moveTime = 0;

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
         * Did this Pointer get canceled by a touchcancel event?
         * 
         * Note: "canceled" is the American-English spelling of "cancelled". Please don't submit PRs correcting it!
         *
         * @name Phaser.Input.Pointer#wasCanceled
         * @type {boolean}
         * @default false
         * @since 3.15.0
         */
        this.wasCanceled = false;

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

        /**
         * Time when this Pointer was most recently updated by the Game step.
         *
         * @name Phaser.Input.Pointer#time
         * @type {number}
         * @since 3.16.0
         */
        this.time = 0;
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
     * This method is called automatically each frame by the Input Manager.
     *
     * @method Phaser.Input.Pointer#reset
     * @private
     * @since 3.0.0
     */
    reset: function (time)
    {
        this.dirty = false;

        this.justDown = false;
        this.justUp = false;
        this.justMoved = false;

        this.time = time;

        this.movementX = 0;
        this.movementY = 0;
    },

    /**
     * Calculates the motion of this Pointer, including its velocity and angle of movement.
     * This method is called automatically each frame by the Input Manager.
     *
     * @method Phaser.Input.Pointer#updateMotion
     * @private
     * @since 3.16.0
     */
    updateMotion: function ()
    {
        var cx = this.position.x;
        var cy = this.position.y;

        var mx = this.midPoint.x;
        var my = this.midPoint.y;

        if (cx === mx && cy === my)
        {
            //  Nothing to do here
            return;
        }

        //  Moving towards our goal ...
        var vx = SmoothStepInterpolation(this.motionFactor, mx, cx);
        var vy = SmoothStepInterpolation(this.motionFactor, my, cy);

        if (FuzzyEqual(vx, cx, 0.1))
        {
            vx = cx;
        }

        if (FuzzyEqual(vy, cy, 0.1))
        {
            vy = cy;
        }

        this.midPoint.set(vx, vy);

        var dx = cx - vx;
        var dy = cy - vy;

        this.velocity.set(dx, dy);

        this.angle = Angle(vx, vy, cx, cy);

        this.distance = Math.sqrt(dx * dx + dy * dy);
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
        if ('buttons' in event)
        {
            this.buttons = event.buttons;
        }

        this.event = event;

        this.upElement = event.target;

        //  Sets the local x/y properties
        this.manager.transformPointer(this, event.pageX, event.pageY, false);

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
        if ('buttons' in event)
        {
            this.buttons = event.buttons;
        }

        this.event = event;

        this.downElement = event.target;

        //  Sets the local x/y properties
        this.manager.transformPointer(this, event.pageX, event.pageY, false);

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
    move: function (event, time)
    {
        if ('buttons' in event)
        {
            this.buttons = event.buttons;
        }

        this.event = event;

        //  Sets the local x/y properties
        this.manager.transformPointer(this, event.pageX, event.pageY, true);

        if (this.manager.mouse.locked)
        {
            // Multiple DOM events may occur within one frame, but only one Phaser event will fire
            this.movementX += event.movementX || event.mozMovementX || event.webkitMovementX || 0;
            this.movementY += event.movementY || event.mozMovementY || event.webkitMovementY || 0;
        }

        this.justMoved = true;

        this.moveTime = time;

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

        this.downElement = event.target;

        //  Sets the local x/y properties
        this.manager.transformPointer(this, event.pageX, event.pageY, false);

        this.primaryDown = true;
        this.downX = this.x;
        this.downY = this.y;
        this.downTime = time;

        this.justDown = true;
        this.isDown = true;

        this.dirty = true;

        this.wasTouch = true;
        this.wasCanceled = false;
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
    touchmove: function (event, time)
    {
        this.event = event;

        //  Sets the local x/y properties
        this.manager.transformPointer(this, event.pageX, event.pageY, true);

        this.justMoved = true;

        this.moveTime = time;

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

        this.upElement = event.target;

        //  Sets the local x/y properties
        this.manager.transformPointer(this, event.pageX, event.pageY, false);

        this.primaryDown = false;
        this.upX = this.x;
        this.upY = this.y;
        this.upTime = time;

        this.justUp = true;
        this.isDown = false;

        this.dirty = true;

        this.wasTouch = true;
        this.wasCanceled = false;
        
        this.active = false;
    },

    /**
     * Internal method to handle a Touch Cancel Event.
     *
     * @method Phaser.Input.Pointer#touchcancel
     * @private
     * @since 3.15.0
     *
     * @param {TouchEvent} event - The Touch Event to process.
     */
    touchcancel: function (event)
    {
        this.buttons = 0;

        this.event = event;

        this.primaryDown = false;

        this.justUp = false;
        this.isDown = false;

        this.dirty = true;

        this.wasTouch = true;
        this.wasCanceled = true;
        
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
        return (this.buttons & 1) ? true : false;
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
        return (this.buttons & 2) ? true : false;
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
        return (this.buttons & 4) ? true : false;
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
        return (this.buttons & 8) ? true : false;
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
        return (this.buttons & 16) ? true : false;
    },

    /**
     * If the Pointer has a button pressed down at the time this method is called, it will return the
     * distance between the Pointer's `downX` and `downY` values and the current position.
     * 
     * If no button is held down, it will return the last recorded distance, based on where
     * the Pointer was when the button was released.
     * 
     * If you wish to get the distance being travelled currently, based on the velocity of the Pointer,
     * then see the `Pointer.distance` property.
     *
     * @method Phaser.Input.Pointer#getDistance
     * @since 3.13.0
     *
     * @return {number} The distance the Pointer moved.
     */
    getDistance: function ()
    {
        if (this.isDown)
        {
            return Distance(this.downX, this.downY, this.x, this.y);
        }
        else
        {
            return Distance(this.downX, this.downY, this.upX, this.upY);
        }
    },

    /**
     * If the Pointer has a button pressed down at the time this method is called, it will return the
     * horizontal distance between the Pointer's `downX` and `downY` values and the current position.
     * 
     * If no button is held down, it will return the last recorded horizontal distance, based on where
     * the Pointer was when the button was released.
     *
     * @method Phaser.Input.Pointer#getDistanceX
     * @since 3.16.0
     *
     * @return {number} The horizontal distance the Pointer moved.
     */
    getDistanceX: function ()
    {
        if (this.isDown)
        {
            return Math.abs(this.downX - this.x);
        }
        else
        {
            return Math.abs(this.downX - this.upX);
        }
    },

    /**
     * If the Pointer has a button pressed down at the time this method is called, it will return the
     * vertical distance between the Pointer's `downX` and `downY` values and the current position.
     * 
     * If no button is held down, it will return the last recorded vertical distance, based on where
     * the Pointer was when the button was released.
     *
     * @method Phaser.Input.Pointer#getDistanceY
     * @since 3.16.0
     *
     * @return {number} The vertical distance the Pointer moved.
     */
    getDistanceY: function ()
    {
        if (this.isDown)
        {
            return Math.abs(this.downY - this.y);
        }
        else
        {
            return Math.abs(this.downY - this.upY);
        }
    },

    /**
     * If the Pointer has a button pressed down at the time this method is called, it will return the
     * duration since the button was pressed down.
     * 
     * If no button is held down, it will return the last recorded duration, based on the time
     * the Pointer button was released.
     *
     * @method Phaser.Input.Pointer#getDuration
     * @since 3.16.0
     *
     * @return {number} The duration the Pointer was held down for in milliseconds.
     */
    getDuration: function ()
    {
        if (this.isDown)
        {
            return (this.time - this.downTime);
        }
        else
        {
            return (this.upTime - this.downTime);
        }
    },

    /**
     * If the Pointer has a button pressed down at the time this method is called, it will return the
     * angle between the Pointer's `downX` and `downY` values and the current position.
     * 
     * If no button is held down, it will return the last recorded angle, based on where
     * the Pointer was when the button was released.
     * 
     * The angle is based on the old position facing to the current position.
     * 
     * If you wish to get the current angle, based on the velocity of the Pointer, then
     * see the `Pointer.angle` property.
     *
     * @method Phaser.Input.Pointer#getAngle
     * @since 3.16.0
     *
     * @return {number} The angle between the Pointer's coordinates in radians.
     */
    getAngle: function ()
    {
        if (this.isDown)
        {
            return Angle(this.downX, this.downY, this.x, this.y);
        }
        else
        {
            return Angle(this.downX, this.downY, this.upX, this.upY);
        }
    },

    /**
     * Takes the previous and current Pointer positions and then generates an array of interpolated values between
     * the two. The array will be populated up to the size of the `steps` argument.
     * 
     * ```javaScript
     * var points = pointer.getInterpolatedPosition(4);
     * 
     * // points[0] = { x: 0, y: 0 }
     * // points[1] = { x: 2, y: 1 }
     * // points[2] = { x: 3, y: 2 }
     * // points[3] = { x: 6, y: 3 }
     * ```
     * 
     * Use this if you need to get smoothed values between the previous and current pointer positions. DOM pointer
     * events can often fire faster than the main browser loop, and this will help you avoid janky movement
     * especially if you have an object following a Pointer.
     * 
     * Note that if you provide an output array it will only be populated up to the number of steps provided.
     * It will not clear any previous data that may have existed beyond the range of the steps count.
     * 
     * Internally it uses the Smooth Step interpolation calculation.
     *
     * @method Phaser.Input.Pointer#getInterpolatedPosition
     * @since 3.11.0
     * 
     * @param {integer} [steps=10] - The number of interpolation steps to use.
     * @param {array} [out] - An array to store the results in. If not provided a new one will be created.
     * 
     * @return {array} An array of interpolated values.
     */
    getInterpolatedPosition: function (steps, out)
    {
        if (steps === undefined) { steps = 10; }
        if (out === undefined) { out = []; }

        var prevX = this.prevPosition.x;
        var prevY = this.prevPosition.y;

        var curX = this.position.x;
        var curY = this.position.y;

        for (var i = 0; i < steps; i++)
        {
            var t = (1 / steps) * i;

            out[i] = { x: SmoothStepInterpolation(t, prevX, curX), y: SmoothStepInterpolation(t, prevY, curY) };
        }

        return out;
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
