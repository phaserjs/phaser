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
	* Starts the requestAnimatioFrame running or setTimeout if unavailable in browser
	* @method start
	**/
	start: function () {

		this.isRunning = true;

		if (!window.requestAnimationFrame)
		{
			this._isSetTimeOut = true;
			this._timeOutID = window.setTimeout(Phaser.GAMES[this.game.id].raf.updateSetTimeout, 0);
		}
		else
		{
			this._isSetTimeOut = false;
			window.requestAnimationFrame(Phaser.GAMES[this.game.id].raf.updateRAF);
		}

	},

	/**
	* The update method for the requestAnimationFrame
	* @method RAFUpdate
	**/
	updateRAF: function (time) {

		this.game.update(time);

		window.requestAnimationFrame(Phaser.GAMES[this.game.id].raf.updateRAF);

	},

	/**
	* The update method for the setTimeout
	* @method SetTimeoutUpdate
	**/
	updateSetTimeout: function () {

		this.game.update(Date.now());

		this._timeOutID = window.setTimeout(Phaser.GAMES[this.game.id].raf.updateSetTimeout, this.game.time.timeToCall);

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