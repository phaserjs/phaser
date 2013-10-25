/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Phaser - MSPointer constructor.
*
* @class Phaser.MSPointer
* @classdesc The MSPointer class handles touch interactions with the game and the resulting Pointer objects.
* It will work only in Internet Explorer 10 and Windows Store or Windows Phone 8 apps using JavaScript.
* http://msdn.microsoft.com/en-us/library/ie/hh673557(v=vs.85).aspx
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
*/
Phaser.MSPointer = function (game) {

	/**
	* @property {Phaser.Game} game - Local reference to game.
	*/
	this.game = game;
	
	/**
	* @property {Phaser.Game} callbackContext - Description.
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
    * You can disable all Input by setting disabled = true. While set all new input related events will be ignored.
    * @property {boolean} disabled
    */
    this.disabled = false;

    /**
    * Description.
    * @property {Description} _onMSPointerDown
    * @private
    * @default
    */
    this._onMSPointerDown = null;
    
    /**
    * Description.
    * @property {Description} _onMSPointerMove
    * @private
    * @default
    */
    this._onMSPointerMove = null;
    
    /**
    * Description.
    * @property {Description} _onMSPointerUp
    * @private
    * @default
    */
    this._onMSPointerUp = null;

};

Phaser.MSPointer.prototype = {

	/**
    * Starts the event listeners running.
    * @method Phaser.MSPointer#start
    */
    start: function () {

        var _this = this;

        if (this.game.device.mspointer == true)
        {
            this._onMSPointerDown = function (event) {
                return _this.onPointerDown(event);
            };

            this._onMSPointerMove = function (event) {
                return _this.onPointerMove(event);
            };

            this._onMSPointerUp = function (event) {
                return _this.onPointerUp(event);
            };

            this.game.renderer.view.addEventListener('MSPointerDown', this._onMSPointerDown, false);
            this.game.renderer.view.addEventListener('MSPointerMove', this._onMSPointerMove, false);
            this.game.renderer.view.addEventListener('MSPointerUp', this._onMSPointerUp, false);

            this.game.renderer.view.style['-ms-content-zooming'] = 'none';
            this.game.renderer.view.style['-ms-touch-action'] = 'none';

        }

    },

    /**
    * Description.
    * @method Phaser.MSPointer#onPointerDown
    * @param {Any} event
    **/
    onPointerDown: function (event) {

        if (this.game.input.disabled || this.disabled)
        {
            return;
        }

        event.preventDefault();
        event.identifier = event.pointerId;

        this.game.input.startPointer(event);

    },

    /**
    * Description.
    * @method Phaser.MSPointer#onPointerMove
    * @param {Any} event
    **/
    onPointerMove: function (event) {

        if (this.game.input.disabled || this.disabled)
        {
            return;
        }

        event.preventDefault();
        event.identifier = event.pointerId;

        this.game.input.updatePointer(event);

    },

    /**
    * Description.
    * @method Phaser.MSPointer#onPointerUp
    * @param {Any} event
    **/
    onPointerUp: function (event) {

        if (this.game.input.disabled || this.disabled)
        {
            return;
        }

        event.preventDefault();
        event.identifier = event.pointerId;

        this.game.input.stopPointer(event);

    },

	/**
    * Stop the event listeners.
    * @method Phaser.MSPointer#stop
    */
    stop: function () {

        this.game.stage.canvas.removeEventListener('MSPointerDown', this._onMSPointerDown);
        this.game.stage.canvas.removeEventListener('MSPointerMove', this._onMSPointerMove);
        this.game.stage.canvas.removeEventListener('MSPointerUp', this._onMSPointerUp);

    }

};