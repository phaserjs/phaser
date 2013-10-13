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
* @param {boolean} autoStart - Whether this group will start automatically or not. Default false.
*/
Phaser.TweenGroup = function (game, autoStart) {

	autoStart = autoStart || false;

	/**
	* @property {Phaser.Game} game - A reference to the currently running Game.
	*/
	this.game = game;

	this._time = 0;
	this._duration = 0;

	this._paused = false;

	this._loop = false;

	this._first = null;
	this._last = null;

	if (autoStart) {
		this.start();
	}
};

Phaser.TweenGroup.prototype = {

	add: function ( tween ) {

		var delay = tween._delayTime; //save delay before it is changed
		tween._delayTime += this._duration;

		var prevTween = this._last;

		if ( prevTween ) {
			tween._next = prevTween._next;
			prevTween._next = tween;
		} else {
			tween._next = this._first;
			this._first = tween;
		}

		if (tween._next) {
			tween._next._prev = tween;
		} else {
			this._last = tween;
		}

		tween._prev = prevTween;

		this._duration += (tween._duration + delay);

		return this;
	},

	remove: function ( tween ) {

		if ( tween._prev ) {
			tween._prev._next = tween._next;
		} else if ( tween === this._first ) {
			this._first = tween._next;
		}

		if ( tween._next ) {
			tween._next._prev = tween._prev;
		} else if ( tween === this._last) {
			this._last = tween._prev;
		}

		this._duration -= tween._duration;

		return this;

	},

	start: function () {

		this.game.tweens.add(this);
		return this;

	},

	stop: function () {

		this.game.tweens.remove(this);
		return this;

	},

	pause: function () {

		this._paused = true;
		return this;

	},

	resume: function () {

		this._paused = false;
		return this;

	},

	update: function ( time ) {

		if ( this._paused ) {
			return true;
		}

		var next, tween;

		tween = this._last;

		this._time += time;

		while ( tween ) {
			next = tween._prev;

			if ( this._time > this._duration ) {

				if ( this._loop ) {
					tween._time = 0;
					tween._finished = false;
					tween._needReset = true;
				} else {
					return false;
				}
			}
			else
			{
				tween.update(time);
			}

			tween = next;
		}

		if ( this._loop && (this._time > this._duration) ) {
			this._time = 0;
		}

		return true;

	},

	to: function ( object, properties, duration, ease, autoStart, delay, repeat, yoyo ) {

		var tween = new Phaser.Tween(object, this.game);
		tween.to(properties, duration, ease, autoStart, delay, repeat, yoyo);

		this.add(tween);

		return this;

	},

	loop: function (loop) {
		this._loop = loop || true;
		return this;
	}
};