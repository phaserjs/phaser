/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Phaser - TweenManager
* 
* @class Phaser.TweenManager
* @classdesc 
* Phaser.Game has a single instance of the TweenManager through which all Tween objects are created and updated.
* Tweens are hooked into the game clock and pause system, adjusting based on the game state.
*
* TweenManager is based heavily on tween.js by http://soledadpenades.com.
* The difference being that tweens belong to a games instance of TweenManager, rather than to a global TWEEN object.
* It also has callbacks swapped for Signals and a few issues patched with regard to properties and completion errors.
* Please see https://github.com/sole/tween.js for a full list of contributors.
* @constructor
*
* @param {Phaser.Game} game - A reference to the currently running game.
*/
Phaser.TweenManager = function (game) {

	/**
	* @property {Phaser.Game} game - Local reference to game.
	*/
	this.game = game;
	
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

	this.game.onPause.add(this.pauseAll, this);
	this.game.onResume.add(this.resumeAll, this);

};

Phaser.TweenManager.prototype = {

	/**
	* Version number of this library.
	* @property {string} REVISION
	* @default 
	*/	
	REVISION: '11dev',

	/**
	* Get all the tween objects in an array.
	* @method Phaser.TweenManager#getAll
	* @returns {Phaser.Tween[]} Array with all tween objects.
	*/
	getAll: function () {

		return this._tweens;

	},

	/**
	* Remove all tween objects.
	* @method Phaser.TweenManager#removeAll
	*/
	removeAll: function () {

		this._tweens = [];

	},

	/**
	* Add a new tween into the TweenManager.
	*
	* @method Phaser.TweenManager#add
	* @param {Phaser.Tween} tween - The tween object you want to add.
	* @returns {Phaser.Tween} The tween object you added to the manager.
	*/
	add: function ( tween ) {

		this._add.push( tween );

	},

	/**
	* Create a tween object for a specific object. The object can be any JavaScript object or Phaser object such as Sprite. 
	*
	* @method Phaser.TweenManager#create
	* @param {Object} object - Object the tween will be run on.
	* @returns {Phaser.Tween} The newly created tween object.
	*/
    create: function (object) {

        return new Phaser.Tween(object, this.game);

    },

	/**
	* Remove a tween from this manager.
	*
	* @method Phaser.TweenManager#remove
	* @param {Phaser.Tween} tween - The tween object you want to remove.
	*/
	remove: function ( tween ) {

		var i = this._tweens.indexOf( tween );

		if ( i !== -1 ) {

			this._tweens[i].pendingDelete = true;

		}

	},

	/**
	* Update all the tween objects you added to this manager.
	*
	* @method Phaser.TweenManager#update
	* @returns {boolean} Return false if there's no tween to update, otherwise return true.
	*/
	update: function () {

		if ( this._tweens.length === 0 && this._add.length === 0 ) return false;

		var i = 0;
		var numTweens = this._tweens.length;

		while ( i < numTweens ) {

			if ( this._tweens[ i ].update( this.game.time.now ) ) {

				i++;

			} else {

				this._tweens.splice( i, 1 );

				numTweens--;

			}

		}

		//	If there are any new tweens to be added, do so now - otherwise they can be spliced out of the array before ever running
		if (this._add.length > 0)
		{
			this._tweens = this._tweens.concat(this._add);
			this._add.length = 0;
		}

		return true;

	},

	/**
	* Pauses all currently running tweens.
	*
	* @method Phaser.TweenManager#update
	*/
	pauseAll: function () {

    	for (var i = this._tweens.length - 1; i >= 0; i--) {
    		this._tweens[i].pause();
    	};

    },

	/**
	* Pauses all currently paused tweens.
	*
	* @method Phaser.TweenManager#resumeAll
	*/
   	resumeAll: function () {

    	for (var i = this._tweens.length - 1; i >= 0; i--) {
    		this._tweens[i].resume();
    	};

    }

};