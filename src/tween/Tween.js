/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
* @module       Phaser.Tween
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
    * @property {object} _valuesStartRepeat - Description.
    * @private
    */
    this._valuesStartRepeat = {};

    /**
    * @property {number} _duration - Description.
    * @default
    */
    this._duration = 1000;

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
    * @property {number} _pausedTime - Description.
    * @private
    * @default
    */
    this._pausedTime = 0;

    /**
    * @property {boolean} pendingDelete - Description.
    * @default
    */
    this.pendingDelete = false;

    // Set all starting values present on the target object
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

};

Phaser.Tween.prototype = {

	/**
	* Configure the Tween
	*
	* @method to
	* @param {object} properties - Properties you want to tween.
	* @param {number} duration - Duration of this tween.
	* @param {function} ease - Easing function.
	* @param {boolean} autoStart - Whether this tween will start automatically or not.
	* @param {number} delay - Delay before this tween will start, defaults to 0 (no delay).
	* @param {boolean} repeat - Should the tween automatically restart once complete? (ignores any chained tweens).
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
			self._parent = this._parent;
			this.chain(self);
		}
		else
		{
			self = this;
			self._parent = self;
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
            return self.start();
        } else {
            return self;
        }

	},

	/**
	* Description. 
	*
	* @method start
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

			this._valuesStartRepeat[ property ] = this._valuesStart[ property ] || 0;

		}

		return this;

	},

	/**
	* Description. 
	*
	* @method stop
	* @return {Phaser.Tween} Itself.
	*/
	stop: function () {

		this._manager.remove(this);
        this.isRunning = false;

		return this;

	},

	/**
	* Description. 
	*
	* @method delay
	* @param {number} amount - Description.
	* @return {Phaser.Tween} Itself.
	*/
	delay: function ( amount ) {

		this._delayTime = amount;
		return this;

	},

	/**
	* Description. 
	*
	* @method repeat
	* @param {number} times - How many times to repeat.
	* @return {Phaser.Tween} Itself.
	*/
	repeat: function ( times ) {

		this._repeat = times;
		return this;

	},

	/**
	* Description. 
	*
	* @method yoyo
	* @param {Phaser.Tween} yoyo - Description.
	* @return {Phaser.Tween} Itself.
	*/
	yoyo: function( yoyo ) {

		this._yoyo = yoyo;
		return this;

	},

	/**
	* Set easing function. 
	*
	* @method easing
	* @param {function} easing - Description.
	* @return {Phaser.Tween} Itself.
	*/
	easing: function ( easing ) {

		this._easingFunction = easing;
		return this;

	},

	/**
	* Set interpolation function. 
	*
	* @method interpolation
	* @param {function} interpolation - Description.
	* @return {Phaser.Tween} Itself.
	*/
	interpolation: function ( interpolation ) {

		this._interpolationFunction = interpolation;
		return this;

	},

	/**
	* Description. 
	*
	* @method chain
	* @return {Phaser.Tween} Itself.
	*/
	chain: function () {

		this._chainedTweens = arguments;
		return this;

	},

	/**
	* Loop a chain of tweens
	* 
	* Usage:
	* game.add.tween(p).to({ x: 700 }, 1000, Phaser.Easing.Linear.None, true)
	* .to({ y: 300 }, 1000, Phaser.Easing.Linear.None)
	* .to({ x: 0 }, 1000, Phaser.Easing.Linear.None)
	* .to({ y: 0 }, 1000, Phaser.Easing.Linear.None)
	* .loop();
	* @method loop
	* @return {Tween} Itself.
	*/
	loop: function() {
		if (this._parent) this.chain(this._parent);
		return this;
	},

	/**
	* Description. 
	*
	* @method onStartCallback
	* @param {object} callback - Description.
	* @return {Phaser.Tween} Itself.
	*/
	onStartCallback: function ( callback ) {

		this._onStartCallback = callback;
		return this;

	},

	/**
	* Description. 
	*
	* @method onUpdateCallback
	* @param {object} callback - Description.
	* @return {Phaser.Tween} Itself.
	*/
	onUpdateCallback: function ( callback ) {

		this._onUpdateCallback = callback;
		return this;

	},

	/**
	* Description. 
	*
	* @method onCompleteCallback
	* @param {object} callback - Description.
	* @return {Phaser.Tween} Itself.
	*/
	onCompleteCallback: function ( callback ) {

		this._onCompleteCallback = callback;
		return this;

	},

	/**
	* Pause. 
	*
	* @method pause
	*/
        pause: function () {
            this._paused = true;
        },

	/**
	* Resume.
	*
	* @method resume
	*/
        resume: function () {
            this._paused = false;
            this._startTime += this.game.time.pauseDuration;
        },

	/**
	* Description.
	*
	* @method update
	* @param {number} time - Description.
	* @return {boolean} Description.
	*/
	update: function ( time ) {

		if (this.pendingDelete)
		{
			return false;
		}

        if (this._paused || time < this._startTime) {

            return true;

        }

		var property;

		if ( time < this._startTime ) {

			return true;

		}

		if ( this._onStartCallbackFired === false ) {

			if ( this._onStartCallback !== null ) {

				this._onStartCallback.call( this._object );

			}

			this._onStartCallbackFired = true;

		}

		var elapsed = ( time - this._startTime ) / this._duration;
		elapsed = elapsed > 1 ? 1 : elapsed;

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

		if ( elapsed == 1 ) {

			if ( this._repeat > 0 ) {

				if ( isFinite( this._repeat ) ) {
					this._repeat--;
				}

				// reassign starting values, restart by making startTime = now
				for ( property in this._valuesStartRepeat ) {

					if ( typeof( this._valuesEnd[ property ] ) === "string" ) {
						this._valuesStartRepeat[ property ] = this._valuesStartRepeat[ property ] + parseFloat(this._valuesEnd[ property ], 10);
					}

					if (this._yoyo) {
						var tmp = this._valuesStartRepeat[ property ];
						this._valuesStartRepeat[ property ] = this._valuesEnd[ property ];
						this._valuesEnd[ property ] = tmp;
						this._reversed = !this._reversed;
					}
					this._valuesStart[ property ] = this._valuesStartRepeat[ property ];

				}

				this._startTime = time + this._delayTime;

				this.onComplete.dispatch(this._object);

				if ( this._onCompleteCallback !== null ) {
					this._onCompleteCallback.call( this._object );
				}

				return true;

			} else {

				this.onComplete.dispatch(this._object);

				if ( this._onCompleteCallback !== null ) {
					this._onCompleteCallback.call( this._object );
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

