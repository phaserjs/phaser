/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
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
    * @property {array<Phaser.Tween>} _tweens - All of the currently running tweens.
    * @private
    */
    this._tweens = [];

    /**
    * @property {array<Phaser.Tween>} _add - All of the tweens queued to be added in the next update.
    * @private
    */
    this._add = [];

    this.game.onPause.add(this._pauseAll, this);
    this.game.onResume.add(this._resumeAll, this);

};

Phaser.TweenManager.prototype = {

    /**
    * Get all the tween objects in an array.
    * @method Phaser.TweenManager#getAll
    * @returns {Phaser.Tween[]} Array with all tween objects.
    */
    getAll: function () {

        return this._tweens;

    },

    /**
    * Remove all tweens running and in the queue. Doesn't call any of the tween onComplete events.
    * @method Phaser.TweenManager#removeAll
    */
    removeAll: function () {

        for (var i = 0; i < this._tweens.length; i++)
        {
            this._tweens[i].pendingDelete = true;
        }

        this._add = [];

    },

    /**
    * Add a new tween into the TweenManager.
    *
    * @method Phaser.TweenManager#add
    * @param {Phaser.Tween} tween - The tween object you want to add.
    * @returns {Phaser.Tween} The tween object you added to the manager.
    */
    add: function (tween) {

        tween._manager = this;
        this._add.push(tween);

    },

    /**
    * Create a tween object for a specific object. The object can be any JavaScript object or Phaser object such as Sprite.
    *
    * @method Phaser.TweenManager#create
    * @param {Object} object - Object the tween will be run on.
    * @returns {Phaser.Tween} The newly created tween object.
    */
    create: function (object) {

        return new Phaser.Tween(object, this.game, this);

    },

    /**
    * Remove a tween from this manager.
    *
    * @method Phaser.TweenManager#remove
    * @param {Phaser.Tween} tween - The tween object you want to remove.
    */
    remove: function (tween) {

        var i = this._tweens.indexOf(tween);

        if (i !== -1)
        {
            this._tweens[i].pendingDelete = true;
        }
        else
        {
            i = this._add.indexOf(tween);

            if (i !== -1)
            {
                this._add[i].pendingDelete = true;
            }
        }

    },

    /**
    * Update all the tween objects you added to this manager.
    *
    * @method Phaser.TweenManager#update
    * @returns {boolean} Return false if there's no tween to update, otherwise return true.
    */
    update: function () {

        var addTweens = this._add.length;
        var numTweens = this._tweens.length;

        if (numTweens === 0 && addTweens === 0)
        {
            return false;
        }

        var i = 0;

        while (i < numTweens)
        {
            if (this._tweens[i].update(this.game.time.now))
            {
                i++;
            }
            else
            {
                this._tweens.splice(i, 1);

                numTweens--;
            }
        }

        //  If there are any new tweens to be added, do so now - otherwise they can be spliced out of the array before ever running
        if (addTweens > 0)
        {
            this._tweens = this._tweens.concat(this._add);
            this._add.length = 0;
        }

        return true;

    },

    /**
    * Checks to see if a particular Sprite is currently being tweened.
    *
    * @method Phaser.TweenManager#isTweening
    * @param {object} object - The object to check for tweens against.
    * @returns {boolean} Returns true if the object is currently being tweened, false if not.
    */
    isTweening: function(object) {

        return this._tweens.some(function(tween) {
            return tween._object === object;
        });

    },

    /**
    * Private. Called by game focus loss. Pauses all currently running tweens.
    *
    * @method Phaser.TweenManager#_pauseAll
    * @private
    */
    _pauseAll: function () {

        for (var i = this._tweens.length - 1; i >= 0; i--)
        {
            this._tweens[i]._pause();
        }

    },

    /**
    * Private. Called by game focus loss. Resumes all currently paused tweens.
    *
    * @method Phaser.TweenManager#_resumeAll
    * @private
    */
    _resumeAll: function () {

        for (var i = this._tweens.length - 1; i >= 0; i--)
        {
            this._tweens[i]._resume();
        }

    },

    /**
    * Pauses all currently running tweens.
    *
    * @method Phaser.TweenManager#pauseAll
    */
    pauseAll: function () {

        for (var i = this._tweens.length - 1; i >= 0; i--)
        {
            this._tweens[i].pause();
        }

    },

    /**
    * Resumes all currently paused tweens.
    *
    * @method Phaser.TweenManager#resumeAll
    */
    resumeAll: function () {

        for (var i = this._tweens.length - 1; i >= 0; i--)
        {
            this._tweens[i].resume(true);
        }

    }

};

Phaser.TweenManager.prototype.constructor = Phaser.TweenManager;
