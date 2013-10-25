/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
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
     * @property {boolean} _isSetTimeOut  - Description.
     * @private
     */
	this._isSetTimeOut = false;
     
     /**
     * @property {boolean} isRunning - Description.
     * @default
     */
	this.isRunning = false;

	var vendors = [
		'ms', 
		'moz', 
		'webkit', 
		'o'
	];

	for (var x = 0; x < vendors.length && !window.requestAnimationFrame; x++)
	{
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'];
	}

	/**
	* The function called by the update
	* @property _onLoop
	* @private
	*/
	this._onLoop = null;

};

Phaser.RequestAnimationFrame.prototype = {


	/**
	* Starts the requestAnimatioFrame running or setTimeout if unavailable in browser
	* @method Phaser.RequestAnimationFrame#start
	*/
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
	* @method Phaser.RequestAnimationFrame#updateRAF	
	* @param {number} time - A timestamp, either from RAF or setTimeOut
	*/
	updateRAF: function (time) {

		this.game.update(time);

		window.requestAnimationFrame(this._onLoop);

	},

	/**
	* The update method for the setTimeout.
	* @method Phaser.RequestAnimationFrame#updateSetTimeout
	*/
	updateSetTimeout: function () {

		this.game.update(Date.now());

		this._timeOutID = window.setTimeout(this._onLoop, this.game.time.timeToCall);

	},

	/**
	* Stops the requestAnimationFrame from running.
	* @method Phaser.RequestAnimationFrame#stop
	*/
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
	* @method Phaser.RequestAnimationFrame#isSetTimeOut
	* @return {boolean}
	*/
	isSetTimeOut: function () {
		return this._isSetTimeOut;
	},

	/**
	* Is the browser using requestAnimationFrame?
	* @method Phaser.RequestAnimationFrame#isRAF
	* @return {boolean}
	*/
	isRAF: function () {
		return (this._isSetTimeOut === false);
	}

};