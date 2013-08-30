/**
* Phaser - TweenManager
*
* Phaser.Game has a single instance of the TweenManager through which all Tween objects are created and updated.
* Tweens are hooked into the game clock and pause system, adjusting based on the game state.
*
* TweenManager is based heavily on tween.js by sole (http://soledadpenades.com).
* The difference being that tweens belong to a games instance of TweenManager, rather than to a global TWEEN object.
* It also has callbacks swapped for Signals and a few issues patched with regard to properties and completion errors.
* Please see https://github.com/sole/tween.js for a full list of contributors.
*/
Phaser.TweenManager = function (game) {

	this.game = game;
	this._tweens = [];

};

Phaser.TweenManager.prototype = {

	REVISION: '11dev',

	/**
	* Get all the tween objects in an array.
	* @return {Phaser.Tween[]} Array with all tween objects.
	*/
	getAll: function () {

		return this._tweens;

	},

	/**
	* Remove all tween objects.
	*/
	removeAll: function () {

		this._tweens = [];

	},

	/**
	* Add a new tween into the TweenManager.
	*
	* @param tween {Phaser.Tween} The tween object you want to add.
	* @return {Phaser.Tween} The tween object you added to the manager.
	*/
	add: function ( tween ) {

		this._tweens.push( tween );

	},

	/**
    * Create a tween object for a specific object. The object can be any JavaScript object or Phaser object such as Sprite.
    *
    * @param obj {object} Object the tween will be run on.
    * @param [localReference] {bool} If true the tween will be stored in the object.tween property so long as it exists. If already set it'll be over-written.
    * @return {Phaser.Tween} The newly created tween object.
    */
    create: function (object, localReference) {

        if (typeof localReference === "undefined") { localReference = false; }

        if (localReference)
        {
            object['tween'] = new Phaser.Tween(object, this.game);
            return object['tween'];
        }
        else
        {
            return new Phaser.Tween(object, this.game);
        }

    },

	/**
	* Remove a tween from this manager.
	*
	* @param tween {Phaser.Tween} The tween object you want to remove.
	*/
	remove: function ( tween ) {

		var i = this._tweens.indexOf( tween );

		if ( i !== -1 ) {

			this._tweens.splice( i, 1 );

		}

	},

	/**
	* Update all the tween objects you added to this manager.
	*
	* @return {bool} Return false if there's no tween to update, otherwise return true.
	*/
	update: function () {

		if ( this._tweens.length === 0 ) return false;

		var i = 0, numTweens = this._tweens.length;

		while ( i < numTweens ) {

			if ( this._tweens[ i ].update( this.game.time.now ) ) {

				i++;

			} else {

				this._tweens.splice( i, 1 );

				numTweens--;

			}

		}

		return true;

	},

	/**
	* Pauses all currently running tweens.
	*/
    pauseAll: function () {

    	for (var i = this._tweens.length - 1; i >= 0; i--) {
    		this._tweens[i].pause();
    	};

    },

	/**
	* Pauses all currently paused tweens.
	*/
    resumeAll: function () {

    	for (var i = this._tweens.length - 1; i >= 0; i--) {
    		this._tweens[i].resume();
    	};

    }

};