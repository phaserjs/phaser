/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Phaser - Mouse constructor.
*
* @class Phaser.Mouse
* @classdesc The Mouse class
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
*/
Phaser.Mouse = function (game) {

	/**
	* @property {Phaser.Game} game - Local reference to game.
	*/
	this.game = game;
	
	/**
	* @property {Object} callbackContext - Description.
	*/
	this.callbackContext = this.game;

	/**
	* @property {function} mouseDownCallback - Description.
	* @default
	*/
	this.mouseDownCallback = null;
	
	/**
	* @property {function} mouseMoveCallback - Description.
	* @default
	*/
	this.mouseMoveCallback = null;
	
	/**
	* @property {function} mouseUpCallback - Description.
	* @default
	*/
	this.mouseUpCallback = null;

    /**
    * @property {boolean} capture - If true the DOM mouse events will have event.preventDefault applied to them, if false they will propogate fully.
    */
    this.capture = true;

	/**
	* @property {number} button- The type of click, either: Phaser.Mouse.NO_BUTTON, Phaser.Mouse.LEFT_BUTTON, Phaser.Mouse.MIDDLE_BUTTON or Phaser.Mouse.RIGHT_BUTTON.
	* @default
	*/
	this.button = -1;

    /**
    * You can disable all Input by setting disabled = true. While set all new input related events will be ignored.
    * @property {boolean} disabled
    * @default
    */
    this.disabled = false;

    /**
    * If the mouse has been Pointer Locked successfully this will be set to true.
    * @property {boolean} locked
    * @default
    */
    this.locked = false;

    /**
    * This event is dispatched when the browser enters or leaves pointer lock state.
    * @property {Phaser.Signal} pointerLock
    * @default
    */
    this.pointerLock = new Phaser.Signal;

    /**
    * The browser mouse event.
    * @property {MouseEvent} event
    */
    this.event;

    /**
    * @property {function} _onMouseDown
    * @private
    */
    this._onMouseDown;

    /**
    * @property {function} _onMouseMove
    * @private
    */
    this._onMouseMove;

    /**
    * @property {function} _onMouseUp
    * @private
    */
    this._onMouseUp;

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

Phaser.Mouse.prototype = {

	/**
    * Starts the event listeners running.
    * @method Phaser.Mouse#start
    */
    start: function () {

        var _this = this;

        if (this.game.device.android && this.game.device.chrome == false)
        {
            //  Android stock browser fires mouse events even if you preventDefault on the touchStart, so ...
            return;
        }

        this._onMouseDown = function (event) {
            return _this.onMouseDown(event);
        };

        this._onMouseMove = function (event) {
            return _this.onMouseMove(event);
        };

        this._onMouseUp = function (event) {
            return _this.onMouseUp(event);
        };

        // this.game.renderer.view.addEventListener('mousedown', this._onMouseDown, true);
        // this.game.renderer.view.addEventListener('mousemove', this._onMouseMove, true);
        // this.game.renderer.view.addEventListener('mouseup', this._onMouseUp, true);

        document.addEventListener('mousedown', this._onMouseDown, true);
        document.addEventListener('mousemove', this._onMouseMove, true);
        document.addEventListener('mouseup', this._onMouseUp, true);

    },

	/**
	* The internal method that handles the mouse down event from the browser.
	* @method Phaser.Mouse#onMouseDown
    * @param {MouseEvent} event
    */
    onMouseDown: function (event) {

        this.event = event;

        if (this.capture)
        {
            event.preventDefault();
        }

        this.button = event.which;

        if (this.mouseDownCallback)
        {
            this.mouseDownCallback.call(this.callbackContext, event);
        }

        if (this.game.input.disabled || this.disabled)
        {
            return;
        }

        event['identifier'] = 0;

        this.game.input.mousePointer.start(event);

    },

	/**
    * The internal method that handles the mouse move event from the browser.
	* @method Phaser.Mouse#onMouseMove
    * @param {MouseEvent} event
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

        if (this.game.input.disabled || this.disabled)
        {
            return;
        }

        event['identifier'] = 0;

        this.game.input.mousePointer.move(event);

    },

	/**
    * The internal method that handles the mouse up event from the browser.
	* @method Phaser.Mouse#onMouseUp
    * @param {MouseEvent} event
    */
    onMouseUp: function (event) {

        this.event = event;

        if (this.capture)
        {
            event.preventDefault();
        }

    	this.button = Phaser.Mouse.NO_BUTTON;

        if (this.mouseUpCallback)
        {
            this.mouseUpCallback.call(this.callbackContext, event);
        }

        if (this.game.input.disabled || this.disabled)
        {
            return;
        }

        event['identifier'] = 0;

        this.game.input.mousePointer.stop(event);

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
            var element = this.game.stage.canvas;

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
	* @method Phaser.Mouse#pointerLockChange
    * @param {MouseEvent} event
    */
    pointerLockChange: function (event) {

        var element = this.game.stage.canvas;

        if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element)
        {
            //  Pointer was successfully locked
            this.locked = true;
            this.pointerLock.dispatch(true);
        }
        else
        {
            //  Pointer was unlocked
            this.locked = false;
            this.pointerLock.dispatch(false);
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

        // this.game.stage.canvas.removeEventListener('mousedown', this._onMouseDown, true);
        // this.game.stage.canvas.removeEventListener('mousemove', this._onMouseMove, true);
        // this.game.stage.canvas.removeEventListener('mouseup', this._onMouseUp, true);

        document.removeEventListener('mousedown', this._onMouseDown, true);
        document.removeEventListener('mousemove', this._onMouseMove, true);
        document.removeEventListener('mouseup', this._onMouseUp, true);

    }

};
