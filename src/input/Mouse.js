/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Mouse class is responsible for handling all aspects of mouse interaction with the browser.
*
* It captures and processes mouse events that happen on the game canvas object.
* It also adds a single `mouseup` listener to `window` which is used to capture the mouse being released
* when not over the game.
*
* You should not normally access this class directly, but instead use a Phaser.Pointer object
* which normalises all game input for you, including accurate button handling.
*
* @class Phaser.Mouse
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
*/
Phaser.Mouse = function (game) {

    /**
    * @property {Phaser.Game} game - A reference to the currently running game.
    */
    this.game = game;

    /**
    * @property {Phaser.Input} input - A reference to the Phaser Input Manager.
    * @protected
    */
    this.input = game.input;

    /**
    * @property {object} callbackContext - The context under which callbacks are called.
    */
    this.callbackContext = this.game;

    /**
    * @property {function} mouseDownCallback - A callback that can be fired when the mouse is pressed down.
    */
    this.mouseDownCallback = null;

    /**
    * @property {function} mouseUpCallback - A callback that can be fired when the mouse is released from a pressed down state.
    */
    this.mouseUpCallback = null;

    /**
    * @property {function} mouseOutCallback - A callback that can be fired when the mouse is no longer over the game canvas.
    */
    this.mouseOutCallback = null;

    /**
    * @property {function} mouseOverCallback - A callback that can be fired when the mouse enters the game canvas (usually after a mouseout).
    */
    this.mouseOverCallback = null;

    /**
     * @property {function} mouseWheelCallback - A callback that can be fired when the mousewheel is used.
     */
    this.mouseWheelCallback = null;

    /**
    * @property {boolean} capture - If true the DOM mouse events will have event.preventDefault applied to them, if false they will propagate fully.
    */
    this.capture = false;

    /**
    * This property was removed in Phaser 2.4 and should no longer be used.
    * Instead please see the Pointer button properties such as `Pointer.leftButton`, `Pointer.rightButton` and so on.
    * Or Pointer.button holds the DOM event button value if you require that.
    * @property {number} button
    * @default
    */
    this.button = -1;

    /**
     * The direction of the _last_ mousewheel usage 1 for up -1 for down.
     * @property {number} wheelDelta
     */
    this.wheelDelta = 0;

    /**
    * Mouse input will only be processed if enabled.
    * @property {boolean} enabled
    * @default
    */
    this.enabled = true;

    /**
    * @property {boolean} locked - If the mouse has been Pointer Locked successfully this will be set to true.
    * @default
    */
    this.locked = false;

    /**
    * @property {boolean} stopOnGameOut - If true Pointer.stop will be called if the mouse leaves the game canvas.
    * @default
    */
    this.stopOnGameOut = false;

    /**
    * @property {Phaser.Signal} pointerLock - This event is dispatched when the browser enters or leaves pointer lock state.
    * @default
    */
    this.pointerLock = new Phaser.Signal();

    /**
    * The browser mouse DOM event. Will be null if no mouse event has ever been received.
    * Access this property only inside a Mouse event handler and do not keep references to it.
    * @property {MouseEvent|null} event
    * @default
    */
    this.event = null;

    /**
    * @property {function} _onMouseDown - Internal event handler reference.
    * @private
    */
    this._onMouseDown = null;

    /**
    * @property {function} _onMouseMove - Internal event handler reference.
    * @private
    */
    this._onMouseMove = null;

    /**
    * @property {function} _onMouseUp - Internal event handler reference.
    * @private
    */
    this._onMouseUp = null;

    /**
    * @property {function} _onMouseOut - Internal event handler reference.
    * @private
    */
    this._onMouseOut = null;

    /**
    * @property {function} _onMouseOver - Internal event handler reference.
    * @private
    */
    this._onMouseOver = null;

    /**
    * @property {function} _onMouseWheel - Internal event handler reference.
    * @private
    */
    this._onMouseWheel = null;

    /**
    * Wheel proxy event object, if required. Shared for all wheel events for this mouse.
    * @property {Phaser.Mouse~WheelEventProxy} _wheelEvent
    * @private
    */
    this._wheelEvent = null;

};

/**
* @constant
* @type {number}
*/
Phaser.Mouse.NO_BUTTON = -1;

/**
* @constant
* @type {number}
*/
Phaser.Mouse.LEFT_BUTTON = 0;

/**
* @constant
* @type {number}
*/
Phaser.Mouse.MIDDLE_BUTTON = 1;

/**
* @constant
* @type {number}
*/
Phaser.Mouse.RIGHT_BUTTON = 2;

/**
* @constant
* @type {number}
*/
Phaser.Mouse.BACK_BUTTON = 3;

/**
* @constant
* @type {number}
*/
Phaser.Mouse.FORWARD_BUTTON = 4;

/**
 * @constant
 * @type {number}
 */
Phaser.Mouse.WHEEL_UP = 1;

/**
 * @constant
 * @type {number}
 */
Phaser.Mouse.WHEEL_DOWN = -1;

Phaser.Mouse.prototype = {

    /**
    * Starts the event listeners running.
    * @method Phaser.Mouse#start
    */
    start: function () {

        if (this.game.device.android && this.game.device.chrome === false)
        {
            //  Android stock browser fires mouse events even if you preventDefault on the touchStart, so ...
            return;
        }

        if (this._onMouseDown !== null)
        {
            //  Avoid setting multiple listeners
            return;
        }

        var _this = this;

        this._onMouseDown = function (event) {
            return _this.onMouseDown(event);
        };

        this._onMouseMove = function (event) {
            return _this.onMouseMove(event);
        };

        this._onMouseUp = function (event) {
            return _this.onMouseUp(event);
        };

        this._onMouseUpGlobal = function (event) {
            return _this.onMouseUpGlobal(event);
        };

        this._onMouseOutGlobal = function (event) {
            return _this.onMouseOutGlobal(event);
        };

        this._onMouseOut = function (event) {
            return _this.onMouseOut(event);
        };

        this._onMouseOver = function (event) {
            return _this.onMouseOver(event);
        };

        this._onMouseWheel = function (event) {
            return _this.onMouseWheel(event);
        };

        var canvas = this.game.canvas;

        canvas.addEventListener('mousedown', this._onMouseDown, true);
        canvas.addEventListener('mousemove', this._onMouseMove, true);
        canvas.addEventListener('mouseup', this._onMouseUp, true);

        if (!this.game.device.cocoonJS)
        {
            window.addEventListener('mouseup', this._onMouseUpGlobal, true);
            window.addEventListener('mouseout', this._onMouseOutGlobal, true);
            canvas.addEventListener('mouseover', this._onMouseOver, true);
            canvas.addEventListener('mouseout', this._onMouseOut, true);
        }

        var wheelEvent = this.game.device.wheelEvent;

        if (wheelEvent)
        {
            canvas.addEventListener(wheelEvent, this._onMouseWheel, true);

            if (wheelEvent === 'mousewheel')
            {
                this._wheelEvent = new WheelEventProxy(-1/40, 1);
            }
            else if (wheelEvent === 'DOMMouseScroll')
            {
                this._wheelEvent = new WheelEventProxy(1, 1);
            }
        }

    },

    /**
    * The internal method that handles the mouse down event from the browser.
    * @method Phaser.Mouse#onMouseDown
    * @param {MouseEvent} event - The native event from the browser. This gets stored in Mouse.event.
    */
    onMouseDown: function (event) {

        this.event = event;

        if (this.capture)
        {
            event.preventDefault();
        }

        if (this.mouseDownCallback)
        {
            this.mouseDownCallback.call(this.callbackContext, event);
        }

        if (!this.input.enabled || !this.enabled)
        {
            return;
        }

        event['identifier'] = 0;

        this.input.mousePointer.start(event);

    },

    /**
    * The internal method that handles the mouse move event from the browser.
    * @method Phaser.Mouse#onMouseMove
    * @param {MouseEvent} event - The native event from the browser. This gets stored in Mouse.event.
    */
    onMouseMove: function (event) {

        this.event = event;

        if (this.capture)
        {
            event.preventDefault();
        }

        if (this.mouseMoveCallback)
        {
            this.mouseMoveCallback.call(this.callbackContext, event);
        }

        if (!this.input.enabled || !this.enabled)
        {
            return;
        }

        event['identifier'] = 0;

        this.input.mousePointer.move(event);

    },

    /**
    * The internal method that handles the mouse up event from the browser.
    * @method Phaser.Mouse#onMouseUp
    * @param {MouseEvent} event - The native event from the browser. This gets stored in Mouse.event.
    */
    onMouseUp: function (event) {

        this.event = event;

        if (this.capture)
        {
            event.preventDefault();
        }

        if (this.mouseUpCallback)
        {
            this.mouseUpCallback.call(this.callbackContext, event);
        }

        if (!this.input.enabled || !this.enabled)
        {
            return;
        }

        event['identifier'] = 0;

        this.input.mousePointer.stop(event);

    },

    /**
    * The internal method that handles the mouse up event from the window.
    *
    * @method Phaser.Mouse#onMouseUpGlobal
    * @param {MouseEvent} event - The native event from the browser. This gets stored in Mouse.event.
    */
    onMouseUpGlobal: function (event) {

        if (!this.input.mousePointer.withinGame)
        {
            if (this.mouseUpCallback)
            {
                this.mouseUpCallback.call(this.callbackContext, event);
            }

            event['identifier'] = 0;

            this.input.mousePointer.stop(event);
        }

    },

    /**
    * The internal method that handles the mouse out event from the window.
    *
    * @method Phaser.Mouse#onMouseOutGlobal
    * @param {MouseEvent} event - The native event from the browser. This gets stored in Mouse.event.
    */
    onMouseOutGlobal: function (event) {

        this.event = event;

        if (this.capture)
        {
            event.preventDefault();
        }

        this.input.mousePointer.withinGame = false;

        if (!this.input.enabled || !this.enabled)
        {
            return;
        }

        //  If we get a mouseout event from the window then basically
        //  something serious has gone down, usually along the lines of
        //  the browser opening a context-menu or similar.
        //  On OS X Chrome especially this is bad news, as it blocks
        //  us then getting a mouseup event, so we need to force that through.
        //
        //  No matter what, we must cancel the left and right buttons

        this.input.mousePointer.stop(event);
        this.input.mousePointer.leftButton.stop(event);
        this.input.mousePointer.rightButton.stop(event);

    },

    /**
    * The internal method that handles the mouse out event from the browser.
    *
    * @method Phaser.Mouse#onMouseOut
    * @param {MouseEvent} event - The native event from the browser. This gets stored in Mouse.event.
    */
    onMouseOut: function (event) {

        this.event = event;

        if (this.capture)
        {
            event.preventDefault();
        }

        this.input.mousePointer.withinGame = false;

        if (this.mouseOutCallback)
        {
            this.mouseOutCallback.call(this.callbackContext, event);
        }

        if (!this.input.enabled || !this.enabled)
        {
            return;
        }

        if (this.stopOnGameOut)
        {
            event['identifier'] = 0;

            this.input.mousePointer.stop(event);
        }

    },

    /**
    * The internal method that handles the mouse over event from the browser.
    *
    * @method Phaser.Mouse#onMouseOver
    * @param {MouseEvent} event - The native event from the browser. This gets stored in Mouse.event.
    */
    onMouseOver: function (event) {

        this.event = event;

        if (this.capture)
        {
            event.preventDefault();
        }

        this.input.mousePointer.withinGame = true;

        if (this.mouseOverCallback)
        {
            this.mouseOverCallback.call(this.callbackContext, event);
        }

    },

    /**
     * The internal method that handles the mouse wheel event from the browser.
     *
     * @method Phaser.Mouse#onMouseWheel
     * @param {MouseEvent} event - The native event from the browser.
     */
    onMouseWheel: function (event) {

        if (this._wheelEvent) {
            event = this._wheelEvent.bindEvent(event);
        }

        this.event = event;

        if (this.capture)
        {
            event.preventDefault();
        }

        // reverse detail for firefox
        this.wheelDelta = Phaser.Math.clamp(-event.deltaY, -1, 1);

        if (this.mouseWheelCallback)
        {
            this.mouseWheelCallback.call(this.callbackContext, event);
        }

    },

    /**
    * If the browser supports it you can request that the pointer be locked to the browser window.
    * This is classically known as 'FPS controls', where the pointer can't leave the browser until the user presses an exit key.
    * If the browser successfully enters a locked state the event Phaser.Mouse.pointerLock will be dispatched and the first parameter will be 'true'.
    * @method Phaser.Mouse#requestPointerLock
    */
    requestPointerLock: function () {

        if (this.game.device.pointerLock)
        {
            var element = this.game.canvas;

            element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

            element.requestPointerLock();

            var _this = this;

            this._pointerLockChange = function (event) {
                return _this.pointerLockChange(event);
            };

            document.addEventListener('pointerlockchange', this._pointerLockChange, true);
            document.addEventListener('mozpointerlockchange', this._pointerLockChange, true);
            document.addEventListener('webkitpointerlockchange', this._pointerLockChange, true);
        }

    },

    /**
    * Internal pointerLockChange handler.
    *
    * @method Phaser.Mouse#pointerLockChange
    * @param {Event} event - The native event from the browser. This gets stored in Mouse.event.
    */
    pointerLockChange: function (event) {

        var element = this.game.canvas;

        if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element)
        {
            //  Pointer was successfully locked
            this.locked = true;
            this.pointerLock.dispatch(true, event);
        }
        else
        {
            //  Pointer was unlocked
            this.locked = false;
            this.pointerLock.dispatch(false, event);
        }

    },

    /**
    * Internal release pointer lock handler.
    * @method Phaser.Mouse#releasePointerLock
    */
    releasePointerLock: function () {

        document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;

        document.exitPointerLock();

        document.removeEventListener('pointerlockchange', this._pointerLockChange, true);
        document.removeEventListener('mozpointerlockchange', this._pointerLockChange, true);
        document.removeEventListener('webkitpointerlockchange', this._pointerLockChange, true);

    },

    /**
    * Stop the event listeners.
    * @method Phaser.Mouse#stop
    */
    stop: function () {

        var canvas = this.game.canvas;

        canvas.removeEventListener('mousedown', this._onMouseDown, true);
        canvas.removeEventListener('mousemove', this._onMouseMove, true);
        canvas.removeEventListener('mouseup', this._onMouseUp, true);
        canvas.removeEventListener('mouseover', this._onMouseOver, true);
        canvas.removeEventListener('mouseout', this._onMouseOut, true);

        var wheelEvent = this.game.device.wheelEvent;

        if (wheelEvent)
        {
            canvas.removeEventListener(wheelEvent, this._onMouseWheel, true);
        }

        window.removeEventListener('mouseup', this._onMouseUpGlobal, true);
        window.removeEventListener('mouseout', this._onMouseOutGlobal, true);

        document.removeEventListener('pointerlockchange', this._pointerLockChange, true);
        document.removeEventListener('mozpointerlockchange', this._pointerLockChange, true);
        document.removeEventListener('webkitpointerlockchange', this._pointerLockChange, true);

    }

};

Phaser.Mouse.prototype.constructor = Phaser.Mouse;

/* jshint latedef:nofunc */
/**
* A purely internal event support class to proxy 'wheelscroll' and 'DOMMouseWheel'
* events to 'wheel'-like events.
*
* See https://developer.mozilla.org/en-US/docs/Web/Events/mousewheel for choosing a scale and delta mode.
*
* @method Phaser.Mouse#WheelEventProxy
* @private
* @param {number} scaleFactor - Scale factor as applied to wheelDelta/wheelDeltaX or details.
* @param {integer} deltaMode - The reported delta mode.
*/
function WheelEventProxy (scaleFactor, deltaMode) {

    /**
    * @property {number} _scaleFactor - Scale factor as applied to wheelDelta/wheelDeltaX or details.
    * @private
    */
    this._scaleFactor = scaleFactor;

    /**
    * @property {number} _deltaMode - The reported delta mode.
    * @private
    */
    this._deltaMode = deltaMode;

    /**
    * @property {any} originalEvent - The original event _currently_ being proxied; the getters will follow suit.
    * @private
    */
    this.originalEvent = null;

}

WheelEventProxy.prototype = {};
WheelEventProxy.prototype.constructor = WheelEventProxy;

WheelEventProxy.prototype.bindEvent = function (event) {

    // Generate stubs automatically
    if (!WheelEventProxy._stubsGenerated && event)
    {
        var makeBinder = function (name) {

            return function () {
                var v = this.originalEvent[name];
                return typeof v !== 'function' ? v : v.bind(this.originalEvent);
            };

        };

        for (var prop in event)
        {
            if (!(prop in WheelEventProxy.prototype))
            {
                Object.defineProperty(WheelEventProxy.prototype, prop, {
                    get: makeBinder(prop)
                });
            }
        }
        WheelEventProxy._stubsGenerated = true;
    }

    this.originalEvent = event;
    return this;

};

Object.defineProperties(WheelEventProxy.prototype, {
    "type": { value: "wheel" },
    "deltaMode": { get: function () { return this._deltaMode; } },
    "deltaY": {
        get: function () {
            return (this._scaleFactor * (this.originalEvent.wheelDelta || this.originalEvent.detail)) || 0;
        }
    },
    "deltaX": {
        get: function () {
            return (this._scaleFactor * this.originalEvent.wheelDeltaX) || 0;
        }
    },
    "deltaZ": { value: 0 }
});
