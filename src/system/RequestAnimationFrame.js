/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
* @module       Phaser.RequestAnimationFrame
*/


/**
* Abstracts away the use of RAF or setTimeOut for the core game update loop.
*
* @class Phaser.RequestAnimationFrame 
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
*/
Phaser.RequestAnimationFrame = function(game) {
	
     /**
     * @property {Phaser.Game} game - The currently running game.
     */
	this.game = game;

     /**
     * @property {bool} _isSetTimeOut  - Description.
     * @private
     */
	this._isSetTimeOut = false;
     
     /**
     * @property {bool} isRunning - Description.
     * @default
     */
	this.isRunning = false;

	var vendors = [
		'ms', 
		'moz', 
		'webkit', 
		'o'
	];

	for (var x = 0; x < vendors.length && !window.requestAnimationFrame; x++) {
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'];
	}

};

Phaser.RequestAnimationFrame.prototype = {

	/**
	* The function called by the update
	* @property _onLoop
	* @private
	**/
	_onLoop: null,

	/**
	* Starts the requestAnimatioFrame running or setTimeout if unavailable in browser
	* @method start
	**/
	start: function () {

		this.isRunning = true;

		var _this = this;

		if (!window.requestAnimationFrame)
		{
			this._isSetTimeOut = true;

            this._onLoop = function () {
                return _this.updateSetTimeout();
            };

			this._timeOutID = window.setTimeout(this._onLoop, 0);
		}
		else
		{
			this._isSetTimeOut = false;

            this._onLoop = function (time) {
                return _this.updateRAF(time);
            };

			window.requestAnimationFrame(this._onLoop);
		}

	},

	/**
	* The update method for the requestAnimationFrame
	* @method updateRAF	
	* @param {number} time - Description.
	**/
	updateRAF: function (time) {

		this.game.update(time);

		window.requestAnimationFrame(this._onLoop);

	},

	/**
	* The update method for the setTimeout.
	* @method updateSetTimeout
	**/
	updateSetTimeout: function () {

		this.game.update(Date.now());

		this._timeOutID = window.setTimeout(this._onLoop, this.game.time.timeToCall);

	},

	/**
	* Stops the requestAnimationFrame from running.
	* @method stop
	**/
	stop: function () {

		if (this._isSetTimeOut)
		{
			clearTimeout(this._timeOutID);
		}
		else
		{
			window.cancelAnimationFrame;
		}

		this.isRunning = false;

	},

	/**
	* Is the browser using setTimeout?
	* @method isSetTimeOut
	* @return {bool}
	**/
	isSetTimeOut: function () {
		return this._isSetTimeOut;
	},

	/**
	* Is the browser using requestAnimationFrame?
	* @method isRAF
	* @return {bool}
	**/
	isRAF: function () {
		return (this._isSetTimeOut === false);
	}

};