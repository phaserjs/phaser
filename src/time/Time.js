/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Time constructor.
*
* @class Phaser.Time
* @classdesc This is the core internal game clock. It manages the elapsed time and calculation of elapsed values, used for game object motion and tweens.
* @constructor
* @param {Phaser.Game} game A reference to the currently running game.
*/
Phaser.Time = function (game) {

	/**
	* @property {Phaser.Game} game - Local reference to game.
	*/
	this.game = game;

	/**
	* The time at which the Game instance started.
	* @property {number} _started
	* @private
	* @default
	*/
	this._started = 0;

	/**
	* The time (in ms) that the last second counter ticked over.
	* @property {number} _timeLastSecond
	* @private
	* @default
	*/
	this._timeLastSecond = 0;

	/**
	* The time the game started being paused.
	* @property {number} _pauseStarted
	* @private
	* @default
	*/
	this._pauseStarted = 0;

	/**
	* The elapsed time calculated for the physics motion updates.
	* @property {number} physicsElapsed
	* @default
	*/
	this.physicsElapsed = 0;

	/**
	* Game time counter.
	* @property {number} time
	* @default
	*/
	this.time = 0;

	/**
	* Records how long the game has been paused for. Is reset each time the game pauses.
	* @property {number} pausedTime
	* @default
	*/
	this.pausedTime = 0;

	/**
	* The time right now.
	* @property {number} now
    * @default
	*/
	this.now = 0;

	/**
	* Elapsed time since the last frame.
	* @property {number} elapsed
	* @default
	*/
	this.elapsed = 0;

	/**
	* Frames per second.
	* @property {number} fps
	* @default
	*/
	this.fps = 0;

	/**
	* The lowest rate the fps has dropped to.
	* @property {number} fpsMin
	* @default
	*/
	this.fpsMin = 1000;

	/**
	* The highest rate the fps has reached (usually no higher than 60fps).
	* @property {number} fpsMax
	* @default
	*/
	this.fpsMax = 0;

	/**
	* The minimum amount of time the game has taken between two frames.
	* @property {number} msMin
	* @default
	*/
	this.msMin = 1000;

	/**
	* The maximum amount of time the game has taken between two frames.
	* @property {number} msMax
	* @default
	*/
	this.msMax = 0;

	/**
	* The number of frames record in the last second.
	* @property {number} frames
	* @default
	*/
	this.frames = 0;

	/**
	* Records how long the game was paused for in miliseconds.
	* @property {number} pauseDuration
	* @default
	*/
	this.pauseDuration = 0;

	/**
	* The value that setTimeout needs to work out when to next update
	* @property {number} timeToCall
	* @default
	*/
	this.timeToCall = 0;

	/**
	* Internal value used by timeToCall as part of the setTimeout loop
	* @property {number} lastTime
	* @default
	*/
	this.lastTime = 0;

	//	Listen for game pause/resume events
	this.game.onPause.add(this.gamePaused, this);
	this.game.onResume.add(this.gameResumed, this);

	/**
	* Description.
	* @property {boolean} _justResumed
    * @default
	*/
	this._justResumed = false;

};

Phaser.Time.prototype = {

	/**
	* The number of seconds that have elapsed since the game was started.
	* @method Phaser.Time#totalElapsedSeconds
	* @return {number}
	*/
	totalElapsedSeconds: function() {
		return (this.now - this._started) * 0.001;
	},

	/**
	* Updates the game clock and calculate the fps. This is called automatically by Phaser.Game.
	* @method Phaser.Time#update
	* @param {number} time - The current timestamp, either performance.now or Date.now depending on the browser.
	*/
	update: function (time) {

		this.now = time;

		if (this._justResumed)
		{
			this.time = this.now;
			this._justResumed = false;
		}

		this.timeToCall = this.game.math.max(0, 16 - (time - this.lastTime));

		this.elapsed = this.now - this.time;

		this.msMin = this.game.math.min(this.msMin, this.elapsed);
		this.msMax = this.game.math.max(this.msMax, this.elapsed);

		this.frames++;

		if (this.now > this._timeLastSecond + 1000)
		{
			this.fps = Math.round((this.frames * 1000) / (this.now - this._timeLastSecond));
			this.fpsMin = this.game.math.min(this.fpsMin, this.fps);
			this.fpsMax = this.game.math.max(this.fpsMax, this.fps);
			this._timeLastSecond = this.now;
			this.frames = 0;
		}

		this.time = this.now;
        this.lastTime = time + this.timeToCall;
		this.physicsElapsed = 1.0 * (this.elapsed / 1000);

		//	Clamp the delta
		if (this.physicsElapsed > 1)
		{
			this.physicsElapsed = 1;
		}

		//  Paused?
		if (this.game.paused)
		{
			this.pausedTime = this.now - this._pauseStarted;
		}

	},

	/**
	* Called when the game enters a paused state.
	* @method Phaser.Time#gamePaused
	* @private
	*/
	gamePaused: function () {
		
		this._pauseStarted = this.now;

	},

	/**
	* Called when the game resumes from a paused state.
	* @method Phaser.Time#gameResumed
	* @private
	*/
	gameResumed: function () {

		//  Level out the elapsed timer to avoid spikes
		this.time = Date.now();
		this.pauseDuration = this.pausedTime;
		this._justResumed = true;

	},

	/**
	* How long has passed since the given time.
	* @method Phaser.Time#elapsedSince
	* @param {number} since - The time you want to measure against.
	* @return {number} The difference between the given time and now.
	*/
	elapsedSince: function (since) {
		return this.now - since;
	},

	/**
	* How long has passed since the given time (in seconds).
	* @method Phaser.Time#elapsedSecondsSince
	* @param {number} since - The time you want to measure (in seconds).
	* @return {number} Duration between given time and now (in seconds).
	*/
	elapsedSecondsSince: function (since) {
		return (this.now - since) * 0.001;
	},

	/**
	* Resets the private _started value to now.
	* @method Phaser.Time#reset
	*/
	reset: function () {
		this._started = this.now;
	}

};