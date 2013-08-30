/**
* Phaser - RequestAnimationFrame
*
* Abstracts away the use of RAF or setTimeOut for the core game update loop.
*/
Phaser.RequestAnimationFrame = function(game) {
	
	this.game = game;

	this._isSetTimeOut = false;
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
	* @method RAFUpdate
	**/
	updateRAF: function (time) {

		this.game.update(time);

		window.requestAnimationFrame(this._onLoop);

	},

	/**
	* The update method for the setTimeout
	* @method SetTimeoutUpdate
	**/
	updateSetTimeout: function () {

		this.game.update(Date.now());

		this._timeOutID = window.setTimeout(this._onLoop, this.game.time.timeToCall);

	},

	/**
	* Stops the requestAnimationFrame from running
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
	* @return bool
	**/
	isSetTimeOut: function () {
		return this._isSetTimeOut;
	},

	/**
	* Is the browser using requestAnimationFrame?
	* @method isRAF
	* @return bool
	**/
	isRAF: function () {
		return (this._isSetTimeOut === false);
	}

};