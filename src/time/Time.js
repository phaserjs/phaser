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
	* @property {number} _started - The time at which the Game instance started.
	* @private
	*/
	this._started = 0;

	/**
	* @property {number} _timeLastSecond - The time (in ms) that the last second counter ticked over.
	* @private
	*/
	this._timeLastSecond = 0;

	/**
	* @property {number} _pauseStarted - The time the game started being paused.
	* @private
	*/
	this._pauseStarted = 0;

	/**
	* @property {number} physicsElapsed - The elapsed time calculated for the physics motion updates.
	*/
	this.physicsElapsed = 0;

	/**
	* @property {number} time - Game time counter.
	*/
	this.time = 0;

	/**
	* @property {number} pausedTime - Records how long the game has been paused for. Is reset each time the game pauses.
	*/
	this.pausedTime = 0;

	/**
	* @property {number} now - The time right now.
	*/
	this.now = 0;

	/**
	* @property {number} elapsed - Elapsed time since the last frame (in ms).
	*/
	this.elapsed = 0;

	/**
	* @property {number} fps - Frames per second.
	*/
	this.fps = 0;

	/**
	* @property {number} fpsMin - The lowest rate the fps has dropped to.
	*/
	this.fpsMin = 1000;

	/**
	* @property {number} fpsMax - The highest rate the fps has reached (usually no higher than 60fps).
	*/
	this.fpsMax = 0;

	/**
	* @property {number} msMin - The minimum amount of time the game has taken between two frames.
	* @default
	*/
	this.msMin = 1000;

	/**
	* @property {number} msMax - The maximum amount of time the game has taken between two frames.
	*/
	this.msMax = 0;

	/**
	* @property {number} frames - The number of frames record in the last second.
	*/
	this.frames = 0;

	/**
	* @property {number} pauseDuration - Records how long the game was paused for in miliseconds.
	*/
	this.pauseDuration = 0;

	/**
	* @property {number} timeToCall - The value that setTimeout needs to work out when to next update
	*/
	this.timeToCall = 0;

	/**
	* @property {number} lastTime - Internal value used by timeToCall as part of the setTimeout loop
	*/
	this.lastTime = 0;

	this._timer = new Phaser.Timer(this.game, 1, false);

	//	Listen for game pause/resume events
	this.game.onPause.add(this.gamePaused, this);
	this.game.onResume.add(this.gameResumed, this);

	/**
	* @property {boolean} _justResumed - Internal value used to recover from the game pause state.
    * @private
	*/
	this._justResumed = false;

	/**
	* @property {array} _timers - Internal store of Phaser.Timer objects.
    * @private
	*/
	this._timers = [];

};

Phaser.Time.prototype = {



    /**
    * Creates a new stand-alone Phaser.Timer object.
    * @method Phaser.Time#create
	* @param {number} [timeUnit=1000] - The number of ms that represent 1 unit of time. For example a timer that ticks every second would have a timeUnit value of 1000.
	* @param {boolean} [autoDestroy=true] - A Timer that is set to automatically destroy itself will do so after all of its events have been dispatched (assuming no looping events).
	* @return {Phaser.Timer} The Timer object that was created.
    */
	create: function (timeUnit, autoDestroy) {

		if (typeof autoDestroy === 'undefined') { autoDestroy = true; }

		var timer = new Phaser.Timer(this.game, timeUnit, autoDestroy);

		if (typeof delay !== 'undefined')
		{
			timer.add(delay);
		}

		this._timers.push(timer);

		return timer;

	},

    /**
    * Remove all Timer objects, regardless of their state.
    * @method Phaser.Time#removeAll
    */
    removeAll: function () {

    	for (var i = 0; i < this._timers.length; i++)
    	{
    		this._timers[i].destroy();
    	}

		this._timers = [];

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

        var i = 0;
        var len = this._timers.length;

        while (i < len)
        {
            if (this._timers[i].update(this.now))
            {
                i++;
            }
            else
            {
                this._timers.splice(i, 1);

                len--;
            }
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
	* The number of seconds that have elapsed since the game was started.
	* @method Phaser.Time#totalElapsedSeconds
	* @return {number}
	*/
	totalElapsedSeconds: function() {
		return (this.now - this._started) * 0.001;
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

Phaser.Time.prototype.constructor = Phaser.Time;
