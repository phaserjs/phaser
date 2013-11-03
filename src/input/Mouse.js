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
	* @property {Description} mouseDownCallback - Description.
	* @default
	*/
	this.mouseDownCallback = null;
	
	/**
	* @property {Description} mouseMoveCallback - Description.
	* @default
	*/
	this.mouseMoveCallback = null;
	
	/**
	* @property {Description} mouseUpCallback - Description.
	* @default
	*/
	this.mouseUpCallback = null;
	/**
	* @property {Description} mouseTypeDown - The type of click. -1 for not clicking
	* @default
	*/
	this.mouseTypeDown = -1;

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

        this.game.renderer.view.addEventListener('mousedown', this._onMouseDown, true);
        this.game.renderer.view.addEventListener('mousemove', this._onMouseMove, true);
        this.game.renderer.view.addEventListener('mouseup', this._onMouseUp, true);

    },

	/**
	* Description.
	* @method Phaser.Mouse#onMouseDown
    * @param {MouseEvent} event
    */
    onMouseDown: function (event) {

        event.preventDefault();

        if (event.which === 1) this.mouseTypeDown = Phaser.Mouse.LEFT_BUTTON;
        else if (event.which === 2) this.mouseTypeDown = Phaser.Mouse.MIDDLE_BUTTON;
        else if (event.which === 3) this.mouseTypeDown = Phaser.Mouse.RIGHT_BUTTON;

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
	* Description
	* @method Phaser.Mouse#onMouseMove
    * @param {MouseEvent} event
    */
    onMouseMove: function (event) {

        event.preventDefault();

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
	* Description.
	* @method Phaser.Mouse#onMouseUp
    * @param {MouseEvent} event
    */
    onMouseUp: function (event) {

        event.preventDefault();

	this.mouseTypeDown = Phaser.Mouse.NO_BUTTON;

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
    * Description.
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

            document.addEventListener('pointerlockchange', this._pointerLockChange, false);
            document.addEventListener('mozpointerlockchange', this._pointerLockChange, false);
            document.addEventListener('webkitpointerlockchange', this._pointerLockChange, false);
        }

    },

	/**
	* Description.
	* @method Phaser.Mouse#pointerLockChange
    * @param {MouseEvent} event
    */
    pointerLockChange: function (event) {

        var element = this.game.stage.canvas;

        if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element)
        {
            //  Pointer was successfully locked
            this.locked = true;
        }
        else
        {
            //  Pointer was unlocked
            this.locked = false;
        }

    },

	/**
	* Description.
	* @method Phaser.Mouse#releasePointerLock
    */
    releasePointerLock: function () {

        document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;

        document.exitPointerLock();

        document.removeEventListener('pointerlockchange', this._pointerLockChange);
        document.removeEventListener('mozpointerlockchange', this._pointerLockChange);
        document.removeEventListener('webkitpointerlockchange', this._pointerLockChange);

    },

	/**
    * Stop the event listeners.
    * @method Phaser.Mouse#stop
    */
    stop: function () {

        this.game.stage.canvas.removeEventListener('mousedown', this._onMouseDown);
        this.game.stage.canvas.removeEventListener('mousemove', this._onMouseMove);
        this.game.stage.canvas.removeEventListener('mouseup', this._onMouseUp);

    }

};
