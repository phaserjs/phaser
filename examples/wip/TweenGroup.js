/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* TweenGroup constructor
* Create a new <code>TweenGroup</code>.
*
* @class Phaser.TweenGroup
* @constructor
* @param {Phaser.Game} game - Current game instance.
* @param {number} delay - Delay before this tween will start, defaults to 0 (no delay).
* @param {number} repeat - How many time should the TweenGroup repeat itself. Infinity can be used for infinite repetition.
* @param {Phaser.Tween} yoyo - Whether this TweenGroup will reverse on completion.
* @param {boolean} autoStart - Whether this TweenGroup will start automatically or not.
*/
Phaser.TweenGroup = function (game, delay, repeat, yoyo, autoStart) {

	autoStart = autoStart || true;

	/**
	* @property {Phaser.Game} game - A reference to the currently running Game.
	*/
	this.game = game;

	/**
	* @property {number} _duration - Description.
	* @private
	* @default
	*/
	this._duration = 0;

	/**
	* @property {number} _repeat - Description.
	* @private
	* @default
	*/
	this._repeat = repeat || 0;

	/**
	* @property {boolean} _yoyo - Description.
	* @private
	* @default
	*/
	this._yoyo = yoyo || false;

	/**
	* @property {boolean} _reversed - Description.
	* @private
	* @default
	*/
	this._reversed = false;

	/**
	* @property {number} _delayTime - Description.
	* @private
	* @default
	*/
	this._delayTime = delay || 0;

	/**
	* @property {Description} _startTime - Description.
	* @private
	* @default null
	*/
	this._startTime = null;

	/**
	* @property {Description} _onStartCallback - Description.
	* @private
	* @default
	*/
	this._onStartCallback = null;

	/**
	* @property {boolean} _onStartCallbackFired - Description.
	* @private
	* @default
	*/
	this._onStartCallbackFired = false;

	/**
	* @property {Description} _onUpdateCallback - Description.
	* @private
	* @default null
	*/
	this._onUpdateCallback = null;

	/**
	* @property {Description} _onCompleteCallback - Description.
	* @private
	* @default null
	*/
	this._onCompleteCallback = null;

	/**
	* @property {boolean} _paused - Description.
	* @private
	* @default false
	*/
	this._paused = false;
	
	/**
	* @property {number} _pausedTime - Description.
	* @private
	* @default
	*/
	this._pausedTime = 0;

	/**
	* @property {boolean} pendingDelete - If this TweenGroup is ready to be deleted by the TweenManager.
	* @default
	*/
	this.pendingDelete = false;
	
	/**
	* @property {Phaser.Signal} onStart - Description.
	*/
	this.onStart = new Phaser.Signal();

	/**
	* @property {Phaser.Signal} onComplete - Description.
	*/
	this.onComplete = new Phaser.Signal();

	/**
	* @property {boolean} isRunning - Description.
	* @default
	*/
	this.isRunning = false;

	/**
	* @property {number} _time - Description.
	* @private
	*/
	this._time = 0;

	/**
	* @property {array} _tweens - Description.
	* @private
	*/
	this._tweens = [];

	/**
	* @property {array} _add - Description.
	* @private
	*/
	this._add = [];

	/**
	* @property {boolean} _dirty - Description.
	* @private
	*/
	this._dirty = false;

	if (autoStart) {
		this.start();
	}

};

Phaser.TweenGroup.prototype = {

	/**
	* Create and configure a tween that will be added to this group
	*
	* @method Phaser.TweenGroup#to
	* @param {object} object - Object to tween.
	* @param {object} properties - Properties you want to tween.
	* @param {number} duration - Duration of this tween.
	* @param {function} ease - Easing function.
	* @param {boolean} autoStart - Whether this tween will start automatically or not.
	* @param {number} delay - Delay before this tween will start, defaults to 0 (no delay).
	* @param {boolean} repeat - Should the tween automatically restart once complete? (ignores any chained tweens).
	* @param {Phaser.Tween} yoyo - Description.
	* @return {Phaser.TweenGroup} Itself.
	*/
	to: function ( object, properties, duration, ease, autoStart, delay, repeat, yoyo ) {

		var tween = new Phaser.Tween(object, this.game);
		tween.to(properties, duration, ease, autoStart, delay, repeat, yoyo);
		this.add(tween);

		return this;

	},

	/**
	* Starts the TweenGroup.
	*
	* @method Phaser.TweenGroup#start
	* @return {Phaser.TweenGroup} Itself.
	*/
	start: function () {

		this.game.tweens.add(this);

		this.onStart.dispatch();

		this.isRunning = true;

		this._onStartCallbackFired = false;

		this._startTime = this.game.time.now + this._delayTime;

		return this;

	},

	/**
	* Stops the TweenGroup if running and removes it from the TweenManager. If there are any onComplete callbacks or events they are not dispatched.
	*
	* @method Phaser.TweenGroup#stop
	* @return {Phaser.TweenGroup} Itself.
	*/
	stop: function () {

		this.game.tweens.remove(this);
		this.isRunning = false;

		return this;

	},

	/**
	* Sets a delay time before this tween will start.
	*
	* @method Phaser.TweenGroup#delay
	* @param {number} amount - The amount of the delay in ms.
	* @return {Phaser.TweenGroup} Itself.
	*/
	delay: function ( amount ) {

		this._delayTime = amount;
		return this;

	},

	/**
	* Sets the number of times this tween will repeat.
	*
	* @method Phaser.TweenGroup#repeat
	* @param {number} times - How many times to repeat.
	* @return {Phaser.TweenGroup} Itself.
	*/
	repeat: function ( times ) {

		this._repeat = times;
		return this;

	},

	/**
	* A tween that has yoyo set to true will run through from start to finish, then reverse from finish to start.
	* Used in combination with repeat you can create endless loops.
	*
	* @method Phaser.TweenGroup#yoyo
	* @param {boolean} yoyo - Set to true to yoyo this tween.
	* @return {Phaser.TweenGroup} Itself.
	*/
	yoyo: function( yoyo ) {

		this._yoyo = yoyo;
		return this;

	},

	/**
	* Sets a callback to be fired when the tween starts. Note: callback will be called in the context of the global scope.
	*
	* @method Phaser.TweenGroup#onStartCallback
	* @param {function} callback - The callback to invoke on start.
	* @return {Phaser.TweenGroup} Itself.
	*/
	onStartCallback: function ( callback ) {

		this._onStartCallback = callback;
		return this;

	},

	/**
	* Sets a callback to be fired each time this tween updates. Note: callback will be called in the context of the global scope.
	*
	* @method Phaser.TweenGroup#onUpdateCallback
	* @param {function} callback - The callback to invoke each time this tween is updated.
	* @return {Phaser.TweenGroup} Itself.
	*/
	onUpdateCallback: function ( callback ) {

		this._onUpdateCallback = callback;
		return this;

	},

	/**
	* Sets a callback to be fired when the tween completes. Note: callback will be called in the context of the global scope.
	*
	* @method Phaser.TweenGroup#onCompleteCallback
	* @param {function} callback - The callback to invoke on completion.
	* @return {Phaser.TweenGroup} Itself.
	*/
	onCompleteCallback: function ( callback ) {

		this._onCompleteCallback = callback;
		return this;

	},

	/**
	* Pauses the tween. 
	*
	* @method Phaser.TweenGroup#pause
	*/
	pause: function () {
		this._paused = true;
		this._pausedTime = this.game.time.now;
	},

	/**
	* Resumes a paused tween.
	*
	* @method Phaser.TweenGroup#resume
	*/
	resume: function () {
		this._paused = false;
		this._startTime += (this.game.time.now - this._pausedTime);
	},

	/**
	* Core tween update function called by the TweenManager. Does not need to be invoked directly.
	*
	* @method Phaser.TweenGroup#update
	* @param {number} time - A timestamp passed in by the TweenManager.
	* @return {boolean} false if the tween has completed and should be deleted from the manager, otherwise true (still active).
	*/
	update: function ( time ) {
		var i = 0,
			numTweens = this._tweens.length,
			tween = null;

		var rtime = 0;

		if ( this._onStartCallbackFired === false ) {

			if ( this._onStartCallback !== null ) {

				this._onStartCallback.call(this);

			}

			this.onStart.dispatch(this);

			this._onStartCallbackFired = true;

		}

		if ( this._dirty && numTweens > 0) {

			var max = 0;

			for (var j = numTweens - 1; j >= 0; j--) {
				tween = this._tweens[j];

				if ( max < ( tween._startTime + tween._duration ) ) {
					max = tween._startTime + tween._duration;
				}
			}

			this._duration = max;

			this._dirty = false;

		}

		while ( i < numTweens ) {

			tween = this._tweens[ i ];

			if ( ( time < tween._startTime ) || ( time > ( tween._startTime + tween._duration )) || tween._paused) {

				i++;
				continue;

			}

			rtime = time - tween._startTime;

			tween.update( rtime );

			i++;
		}

		if ( this._onUpdateCallback !== null ) {

			this._onUpdateCallback.call(this);

		}

		if ( ( ( time >= this._duration ) && !this._reversed ) || ( ( time <= 0) && this._reversed ) ) {

			this.onComplete.dispatch(this);

			if ( this._onCompleteCallback !== null ) {
				this._onCompleteCallback.call(this);
			}

			if ( this._repeat > 0 ) {

				if ( isFinite( this._repeat ) ) {
					this._repeat--;
				}

				if (this._yoyo) {
					this._reversed = !this._reversed;
				}

				this._startTime = this.game.time.now + this._delayTime;

			} else {
				return false;
			}

		}

		if (this._add.length > 0)
		{
			this._tweens = this._tweens.concat(this._add);
			this._add.length = 0;
		}

		return true;
	},

	/**
	* Add a new tween into the TweenGroup.
	*
	* @method Phaser.TweenGroup#add
	* @param {Phaser.Tween} tween - The tween object you want to add.
	* @returns {Phaser.Tween} The tween object you added to the group.
	*/
	add: function ( tween ) {

		if ( this.isRunning ) {
			this._add.push( tween );
		} else {
			this._tweens.push( tween );
		}

		tween._startTime = this._duration + tween._delayTime;

		if ( ( tween._startTime + tween._duration ) > this._duration ) {
			this._duration = tween._startTime + tween._duration;
		}

		this._dirty = true;

	},

	/**
	* Remove a tween from this TweenGroup.
	*
	* @method Phaser.TweenGroup#remove
	* @param {Phaser.Tween} tween - The tween object you want to remove.
	*/
	remove: function ( tween ) {

		var i = this._tweens.indexOf( tween );

		if ( i !== -1 ) {

			this._tweens[i].pendingDelete = true;

		}

		this._dirty = true;

	}
	
};
