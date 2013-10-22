/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Tween constructor
* Create a new <code>Tween</code>.
*
* @class Phaser.Tween
* @constructor
* @param {object} object - Target object will be affected by this tween.
* @param {Phaser.Game} game - Current game instance.
*/
Phaser.Tween = function (object, game) {

	/**
	* Reference to the target object.
	* @property {object} _object
	* @private
	*/
	this._object = object;

	/**
	* @property {Phaser.Game} game - A reference to the currently running Game.
	*/
	this.game = game;

	/**
	* @property {object} _manager - Description.
	* @private
	*/
	this._manager = this.game.tweens;

	/**
	* @property {object} _valuesStart - Description.
	* @private
	*/
	this._valuesStart = {};

	/**
	* @property {object} _valuesEnd - Description.
	* @private
	*/
	this._valuesEnd = {};

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
	this._repeat = 0;

	/**
	* @property {boolean} _yoyo - Description.
	* @private
	* @default
	*/
	this._yoyo = false;

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
	this._delayTime = 0;

	/**
	* @property {Description} _startTime - Description.
	* @private
	* @default null
	*/
	this._startTime = null;

	/**
	* @property {Description} _easingFunction - Description.
	* @private
	*/
	this._easingFunction = Phaser.Easing.Linear.None;

	/**
	* @property {Description} _interpolationFunction - Description.
	* @private
	*/
	this._interpolationFunction = Phaser.Math.linearInterpolation;

	/**
	* @property {Description} _chainedTweens - Description.
	* @private
	*/
	this._chainedTweens = [];

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
	* @property {boolean} pendingDelete - If this tween is ready to be deleted by the TweenManager.
	* @default
	*/
	this.pendingDelete = false;

	// Set all starting values present on the target object TODO revamp this
	for ( var field in object ) {
		this._valuesStart[ field ] = parseFloat(object[field], 10);
	}
	
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

	this._time = 0;

};

Phaser.Tween.prototype = {

	/**
	* Configure the Tween
	*
	* @method Phaser.Tween#to
	* @param {object} properties - Properties you want to tween.
	* @param {number} duration - Duration of this tween.
	* @param {function} ease - Easing function.
	* @param {boolean} autoStart - Whether this tween will start automatically or not.
	* @param {number} delay - Delay before this tween will start, defaults to 0 (no delay).
	* @param {number} repeat - How many time should the tween repeat itself. Infinity can be used for infinite repetition.
	* @param {Phaser.Tween} yoyo - Description.
	* @return {Phaser.Tween} Itself.
	*/
	to: function ( properties, duration, ease, autoStart, delay, repeat, yoyo ) {

		duration = duration || 1000;
		ease = ease || null;
		autoStart = autoStart || false;
		delay = delay || 0;
		repeat = repeat || 0;
		yoyo = yoyo || false;

		var self;
		if (this._parent)
		{
			self = this._manager.create(this._object);
			this._lastChild.chain(self);
			this._lastChild = self;
		}
		else
		{
			self = this;
			this._parent = this;
			this._lastChild = this;
		}

		self._repeat = repeat;
		self._duration = duration;
		self._valuesEnd = properties;

		if (ease !== null)
		{
			self._easingFunction = ease;
		}

		if (delay > 0)
		{
			self._delayTime = delay;
		}

		self._yoyo = yoyo;

		if (autoStart) {
			return this.start();
		} else {
			return this;
		}

	},

	/**
	* Starts the tween running. Can also be called by the autoStart parameter of Tween.to.
	*
	* @method Phaser.Tween#start
	* @param {number} time - Description.
	* @return {Phaser.Tween} Itself.
	*/
	start: function ( time ) {

		if (this.game === null || this._object === null) {
			return;
		}

		this._manager.add(this);

		this.onStart.dispatch(this._object);

		this.isRunning = true;

		this._onStartCallbackFired = false;

		this._startTime = this.game.time.now + this._delayTime;

		return this;

	},

	/**
	* Stops the tween if running and removes it from the TweenManager. If there are any onComplete callbacks or events they are not dispatched.
	*
	* @method Phaser.Tween#stop
	* @return {Phaser.Tween} Itself.
	*/
	stop: function () {

		this._manager.remove(this);
		this.isRunning = false;

		return this;

	},

	/**
	* Sets a delay time before this tween will start.
	*
	* @method Phaser.Tween#delay
	* @param {number} amount - The amount of the delay in ms.
	* @return {Phaser.Tween} Itself.
	*/
	delay: function ( amount ) {

		this._delayTime = amount;
		return this;

	},

	/**
	* Sets the number of times this tween will repeat.
	*
	* @method Phaser.Tween#repeat
	* @param {number} times - How many times to repeat.
	* @return {Phaser.Tween} Itself.
	*/
	repeat: function ( times ) {

		this._repeat = times;
		return this;

	},

	/**
	* A tween that has yoyo set to true will run through from start to finish, then reverse from finish to start.
	* Used in combination with repeat you can create endless loops.
	*
	* @method Phaser.Tween#yoyo
	* @param {boolean} yoyo - Set to true to yoyo this tween.
	* @return {Phaser.Tween} Itself.
	*/
	yoyo: function( yoyo ) {

		this._yoyo = yoyo;
		return this;

	},

	/**
	* Set easing function this tween will use, i.e. Phaser.Easing.Linear.None. 
	*
	* @method Phaser.Tween#easing
	* @param {function} easing - The easing function this tween will use, i.e. Phaser.Easing.Linear.None.
	* @return {Phaser.Tween} Itself.
	*/
	easing: function ( easing ) {

		this._easingFunction = easing;
		return this;

	},

	/**
	* Set interpolation function the tween will use, by default it uses Phaser.Math.linearInterpolation.
	*
	* @method Phaser.Tween#interpolation
	* @param {function} interpolation - The interpolation function to use (Phaser.Math.linearInterpolation by default)
	* @return {Phaser.Tween} Itself.
	*/
	interpolation: function ( interpolation ) {

		this._interpolationFunction = interpolation;
		return this;

	},

	/**
	* You can chain tweens together by passing a reference to the chain function. This enables one tween to call another on completion.
	* You can pass as many tweens as you like to this function, they will each be chained in sequence.
	*
	* @method Phaser.Tween#chain
	* @return {Phaser.Tween} Itself.
	*/
	chain: function () {

		this._chainedTweens = arguments;
		return this;

	},

	/**
	* Sets a callback to be fired when the tween starts. Note: callback will be called in the context of the global scope.
	*
	* @method Phaser.Tween#onStartCallback
	* @param {function} callback - The callback to invoke on start.
	* @return {Phaser.Tween} Itself.
	*/
	onStartCallback: function ( callback ) {

		this._onStartCallback = callback;
		return this;

	},

	/**
	* Sets a callback to be fired each time this tween updates. Note: callback will be called in the context of the global scope.
	*
	* @method Phaser.Tween#onUpdateCallback
	* @param {function} callback - The callback to invoke each time this tween is updated.
	* @return {Phaser.Tween} Itself.
	*/
	onUpdateCallback: function ( callback ) {

		this._onUpdateCallback = callback;
		return this;

	},

	/**
	* Sets a callback to be fired when the tween completes. Note: callback will be called in the context of the global scope.
	*
	* @method Phaser.Tween#onCompleteCallback
	* @param {function} callback - The callback to invoke on completion.
	* @return {Phaser.Tween} Itself.
	*/
	onCompleteCallback: function ( callback ) {

		this._onCompleteCallback = callback;
		return this;

	},

	/**
	* Pauses the tween. 
	*
	* @method Phaser.Tween#pause
	*/
	pause: function () {
		this._paused = true;
		this._pausedTime = this.game.time.now;
	},

	/**
	* Resumes a paused tween.
	*
	* @method Phaser.Tween#resume
	*/
	resume: function () {
		this._paused = false;
		this._startTime += (this.game.time.now - this._pausedTime);
	},

	/**
	* Core tween update function called by the TweenManager. Does not need to be invoked directly.
	*
	* @method Phaser.Tween#update
	* @param {number} time - A timestamp passed in by the TweenManager.
	* @return {boolean} false if the tween has completed and should be deleted from the manager, otherwise true (still active).
	*/
	update: function ( time ) {

		if (this.pendingDelete)
		{
			return false;
		}

		var property;

		var reversed = this._time > time ? true : false;

		this._time = time;

		if ( this._onStartCallbackFired === false ) {

			if ( this._onStartCallback !== null ) {

				this._onStartCallback.call( this._object );

			}

			this._onStartCallbackFired = true;

			for ( var property in this._valuesEnd ) {

				// check if an Array was provided as property value
				if ( this._valuesEnd[ property ] instanceof Array ) {

					if ( this._valuesEnd[ property ].length === 0 ) {

						continue;

					}

					// create a local copy of the Array with the start value at the front
					this._valuesEnd[ property ] = [ this._object[ property ] ].concat( this._valuesEnd[ property ] );

				}

				this._valuesStart[ property ] = this._object[ property ];

				if ( ( this._valuesStart[ property ] instanceof Array ) === false ) {
					this._valuesStart[ property ] *= 1.0; // Ensures we're using numbers, not strings
				}

			}

		}

		var elapsed = time / this._duration;

		if (elapsed > 1) elapsed = 1;
		if (elapsed < 0) elapsed = 0;

		var value = this._easingFunction( elapsed );

		for ( property in this._valuesEnd ) {

			var start = this._valuesStart[ property ] || 0;
			var end = this._valuesEnd[ property ];

			if ( end instanceof Array ) {

				this._object[ property ] = this._interpolationFunction( end, value );

			} else {

				// Parses relative end values with start as base (e.g.: +10, -3)
				if ( typeof(end) === "string" ) {
					end = start + parseFloat(end, 10);
				}

				// protect against non numeric properties.
				if ( typeof(end) === "number" ) {
					this._object[ property ] = start + ( end - start ) * value;
				}

			}

		}

		if ( this._onUpdateCallback !== null ) {

			this._onUpdateCallback.call( this._object, value );

		}

		if ( ( ( elapsed == 1 ) && !reversed ) || ( ( elapsed == 1) && reversed ) ) {

			this.onComplete.dispatch(this._object);

			if ( this._onCompleteCallback !== null ) {
				this._onCompleteCallback.call( this._object );
			}

			if ( this._repeat > 0 ) {

				if ( isFinite( this._repeat ) ) {
					this._repeat--;
				}

				if (this._yoyo) {
					this._reversed = !this._reversed;
				}

				this._startTime = this.game.time.now + this._delayTime;

				return true;

			} else {

				if ( reversed ) {
					this._time = this._duration;
				} else {
					this._time = 0;
				}

				for ( var i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i ++ ) {

					this._chainedTweens[ i ].start( time );

				}

				return false;

			}

		}

		return true;

	}
	
};
