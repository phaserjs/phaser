/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
* @module       Phaser.Easing
*/


/**
* A collection of easing methods defining ease-in ease-out curves.
*
* @class Phaser.Easing
*/
Phaser.Easing = {

        /**
        * Linear easing.
        *
        * @namespace Linear
        */
	Linear: {

		/**
		* Ease-in.
        	*
		* @method In 
		* @param {number} k - Description. 
		* @memberof Linear
		* @returns {number} k^2.
        	*/
		None: function ( k ) {

			return k;

		}

	},

        /**
        * Quadratic easing.
        *
        * @namespace Quadratic
        */
	Quadratic: {

		/**
		* Ease-in.
        	*
		* @method In 
		* @param {number} k - Description. 
		* @memberof Quadratic
		* @returns {number} k^2.
        	*/
		In: function ( k ) {

			return k * k;

		},

		/**
		* Ease-out.
        	*
		* @method Out 
		* @param {number} k - Description. 
		* @memberof Quadratic
		* @returns {number} k* (2-k).
        	*/
		Out: function ( k ) {

			return k * ( 2 - k );

		},

		/**
		* Ease-in/out.
        	*
		* @method InOut
		* @param {number} k - Description. 
		* @memberof Quadratic
		* @returns {number} Description.
        	*/
		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1 ) return 0.5 * k * k;
			return - 0.5 * ( --k * ( k - 2 ) - 1 );

		}

	},

        /**
        * Cubic easing.
        *
        * @namespace Cubic
        */
	Cubic: {

		/**
		* Cubic ease-in.
        	*
		* @method In 
		* @param {number} k - Description. 
		* @memberof Cubic
		* @returns {number} Description.
        	*/
		In: function ( k ) {

			return k * k * k;

		},

		/**
		* Cubic ease-out.
        	*
		* @method Out
		* @param {number} k - Description. 
		* @memberof Cubic
		* @returns {number} Description.
        	*/
		Out: function ( k ) {

			return --k * k * k + 1;

		},

		/**
		* Cubic ease-in/out.
        	*
		* @method InOut
		* @param {number} k - Description. 
		* @memberof Cubic
		* @returns {number} Description.
        	*/
		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k;
			return 0.5 * ( ( k -= 2 ) * k * k + 2 );

		}

	},

        /**
        * Quartic easing.
        *
        * @namespace Quartic
        */
	Quartic: {

		/**
		* Quartic ease-in.
        	*
		* @method In 
		* @param {number} k - Description. 
		* @memberof Quartic
		* @returns {number} Description.
        	*/
		In: function ( k ) {

			return k * k * k * k;

		},

		/**
		* Quartic ease-out.
        	*
		* @method Out
		* @param {number} k - Description. 
		* @memberof Quartic
		* @returns {number} Description.
        	*/
		Out: function ( k ) {

			return 1 - ( --k * k * k * k );

		},

		/**
		* Quartic ease-in/out.
        	*
		* @method InOut
		* @param {number} k - Description. 
		* @returns {number} Description.
		* @memberof Quartic
        	*/
		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1) return 0.5 * k * k * k * k;
			return - 0.5 * ( ( k -= 2 ) * k * k * k - 2 );

		}

	},

        /**
        * Quintic easing.
        *
        * @namespace Quintic
        */
	Quintic: {

		/**
		* Quintic ease-in.
        	*
		* @method In 
		* @param {number} k - Description. 
		* @memberof Quintic
		* @returns {number} Description.
        	*/
		In: function ( k ) {

			return k * k * k * k * k;

		},

		/**
		* Quintic ease-out.
        	*
		* @method Out
		* @param {number} k - Description. 
		* @memberof Quintic
		* @returns {number} Description.
        	*/
		Out: function ( k ) {

			return --k * k * k * k * k + 1;

		},

		/**
		* Quintic ease-in/out.
        	*
		* @method InOut
		* @param {number} k - Description. 
		* @memberof Quintic
		* @returns {number} Description.
        	*/
		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k * k * k;
			return 0.5 * ( ( k -= 2 ) * k * k * k * k + 2 );

		}

	},

        /**
        * Sinusoidal easing.
        *
        * @namespace Sinusoidal
        */
	Sinusoidal: {

		/**
		* Sinusoidal ease-in.
        	*
		* @method In 
		* @param {number} k - Description. 
		* @memberof Sinusoidal
		* @returns {number} Description.
        	*/
		In: function ( k ) {

			return 1 - Math.cos( k * Math.PI / 2 );

		},

		/**
		* Sinusoidal ease-out.
        	*
		* @method Out
		* @param {number} k - Description. 
		* @memberof Sinusoidal
		* @returns {number} Description.
        	*/
		Out: function ( k ) {

			return Math.sin( k * Math.PI / 2 );

		},

		/**
		* Sinusoidal ease-in/out.
        	*
		* @method InOut
		* @param {number} k - Description. 
		* @memberof Sinusoidal
		* @returns {number} Description.
        	*/
		InOut: function ( k ) {

			return 0.5 * ( 1 - Math.cos( Math.PI * k ) );

		}

	},

        /**
        * Exponential easing.
        *
        * @namespace Exponential
        */
	Exponential: {

		/**
		* Exponential ease-in.
        	*
		* @method In 
		* @param {number} k - Description. 
		* @memberof Exponential
		* @returns {number} Description.
        	*/
		In: function ( k ) {

			return k === 0 ? 0 : Math.pow( 1024, k - 1 );

		},

		/**
		* Exponential ease-out.
        	*
		* @method Out
		* @param {number} k - Description. 
		* @memberof Exponential
		* @returns {number} Description.
        	*/
		Out: function ( k ) {

			return k === 1 ? 1 : 1 - Math.pow( 2, - 10 * k );

		},

		/**
		* Exponential ease-in/out.
        	*
		* @method InOut
		* @param {number} k - Description. 
		* @memberof Exponential
		* @returns {number} Description.
        	*/
		InOut: function ( k ) {

			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( ( k *= 2 ) < 1 ) return 0.5 * Math.pow( 1024, k - 1 );
			return 0.5 * ( - Math.pow( 2, - 10 * ( k - 1 ) ) + 2 );

		}

	},

        /**
        * Circular easing.
        *
        * @namespace Circular
        */
	Circular: {

		/**
		* Circular ease-in.
        	*
		* @method In 
		* @param {number} k - Description. 
		* @memberof Circular
		* @returns {number} Description.
        	*/
		In: function ( k ) {

			return 1 - Math.sqrt( 1 - k * k );

		},

		/**
		* Circular ease-out.
        	*
		* @method Out
		* @param {number} k - Description. 
		* @memberof Circular
		* @returns {number} Description.
        	*/
		Out: function ( k ) {

			return Math.sqrt( 1 - ( --k * k ) );

		},

		/**
		* Circular ease-in/out.
        	*
		* @method InOut
		* @param {number} k - Description. 
		* @memberof Circular
		* @returns {number} Description.
        	*/
		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1) return - 0.5 * ( Math.sqrt( 1 - k * k) - 1);
			return 0.5 * ( Math.sqrt( 1 - ( k -= 2) * k) + 1);

		}

	},

        /**
        * Elastic easing.
        *
        * @namespace Elastic
        */
	Elastic: {

		/**
		* Elastic ease-in.
        	*
		* @method In 
		* @param {number} k - Description. 
		* @memberof Elastic
		* @returns {number} Description.
        	*/
		In: function ( k ) {

			var s, a = 0.1, p = 0.4;
			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( !a || a < 1 ) { a = 1; s = p / 4; }
			else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
			return - ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );

		},

		/**
		* Elastic ease-out.
        	*
		* @method Out
		* @param {number} k - Description. 
		* @memberof Elastic
		* @returns {number} Description.
        	*/
		Out: function ( k ) {

			var s, a = 0.1, p = 0.4;
			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( !a || a < 1 ) { a = 1; s = p / 4; }
			else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
			return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 );

		},

		/**
		* Elastic ease-in/out.
        	*
		* @method InOut
		* @param {number} k - Description. 
		* @memberof Elastic
		* @returns {number} Description.
        	*/
		InOut: function ( k ) {

			var s, a = 0.1, p = 0.4;
			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( !a || a < 1 ) { a = 1; s = p / 4; }
			else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
			if ( ( k *= 2 ) < 1 ) return - 0.5 * ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
			return a * Math.pow( 2, -10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) * 0.5 + 1;

		}

	},

        /**
        * Back easing.
        *
        * @namespace Back
        */
	Back: {

		/**
		* Back ease-in.
        	*
		* @method In 
		* @param {number} k - Description. 
		* @memberof Back
		* @returns {number} Description.
        	*/
		In: function ( k ) {

			var s = 1.70158;
			return k * k * ( ( s + 1 ) * k - s );

		},

		/**
		* Back ease-out.
        	*
		* @method Out
		* @param {number} k - Description. 
		* @memberof Back
		* @returns {number} Description.
        	*/
		Out: function ( k ) {

			var s = 1.70158;
			return --k * k * ( ( s + 1 ) * k + s ) + 1;

		},

		/**
		* Back ease-in/out.
        	*
		* @method InOut
		* @param {number} k - Description. 
		* @memberof Back
		* @returns {number} Description.
        	*/
		InOut: function ( k ) {

			var s = 1.70158 * 1.525;
			if ( ( k *= 2 ) < 1 ) return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) );
			return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 );

		}

	},

        /**
        * Bounce easing.
        *
        * @namespace Bounce
        */
	Bounce: {

		/**
		* Bounce ease-in.
        	*
		* @method In 
		* @param {number} k - Description. 
		* @memberof Bounce
		* @returns {number} Description.
        	*/
		In: function ( k ) {

			return 1 - Phaser.Easing.Bounce.Out( 1 - k );

		},

		/**
		* Bounce ease-out.
        	*
		* @method Out
		* @param {number} k - Description. 
		* @memberof Bounce
		* @returns {number} Description.
        	*/
		Out: function ( k ) {

			if ( k < ( 1 / 2.75 ) ) {

				return 7.5625 * k * k;

			} else if ( k < ( 2 / 2.75 ) ) {

				return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;

			} else if ( k < ( 2.5 / 2.75 ) ) {

				return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;

			} else {

				return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;

			}

		},

		/**
		* Bounce ease-in/out.
        	*
		* @method InOut
		* @param {number} k - Description. 
		* @memberof Bounce
		* @returns {number} Description.
        	*/
		InOut: function ( k ) {

			if ( k < 0.5 ) return Phaser.Easing.Bounce.In( k * 2 ) * 0.5;
			return Phaser.Easing.Bounce.Out( k * 2 - 1 ) * 0.5 + 0.5;

		}

	}

};
