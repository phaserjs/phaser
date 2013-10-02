/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Phaser.RandomDataGenerator constructor.
* 
* @class Phaser.RandomDataGenerator
* @classdesc An extremely useful repeatable random data generator. Access it via Phaser.Game.rnd
* Based on Nonsense by Josh Faul https://github.com/jocafa/Nonsense.
* Random number generator from http://baagoe.org/en/wiki/Better_random_numbers_for_javascript
* 
* @constructor
* @param {array} seeds
*/
Phaser.RandomDataGenerator = function (seeds) {
	
	if (typeof seeds === "undefined") { seeds = []; }

	this.sow(seeds);

};

Phaser.RandomDataGenerator.prototype = {

	/**
	* @property {number} c
	* @private
	*/
	c: 1,

	/**
	* @property {number} s0
	* @private
	*/
	s0: 0,

	/**
	* @property {number} s1
	* @private
	*/
	s1: 0,

	/**
	* @property {number} s2
	* @private
	*/
	s2: 0,

	/**
	* Private random helper.
	* @method Phaser.RandomDataGenerator#rnd
	* @private
	* @return {number} Description.
	*/
	rnd: function () {

		var t = 2091639 * this.s0 + this.c * 2.3283064365386963e-10; // 2^-32

		this.c = t | 0;
		this.s0 = this.s1;
		this.s1 = this.s2;
		this.s2 = t - this.c;

		return this.s2;
	},

	/**
	* Reset the seed of the random data generator.
	* 
	* @method Phaser.RandomDataGenerator#sow
	* @param {array} seeds
	*/
	sow: function (seeds) {

		if (typeof seeds === "undefined") { seeds = []; }

		this.s0 = this.hash(' ');
		this.s1 = this.hash(this.s0);
		this.s2 = this.hash(this.s1);

		var seed;

		for (var i = 0; seed = seeds[i++]; ) {
			this.s0 -= this.hash(seed);
			this.s0 += ~~(this.s0 < 0);
			this.s1 -= this.hash(seed);
			this.s1 += ~~(this.s1 < 0);
			this.s2 -= this.hash(seed);
			this.s2 += ~~(this.s2 < 0);
		}
		
	},

	/**
	* Description.
	* @method Phaser.RandomDataGenerator#hash
	* @param {Any} data
	* @private
	* @return {number} Description.
	*/
	hash: function (data) {

		var h, i, n;
		n = 0xefc8249d;
		data = data.toString();

		for (i = 0; i < data.length; i++) {
			n += data.charCodeAt(i);
			h = 0.02519603282416938 * n;
			n = h >>> 0;
			h -= n;
			h *= n;
			n = h >>> 0;
			h -= n;
			n += h * 0x100000000;// 2^32
		}

		return (n >>> 0) * 2.3283064365386963e-10;// 2^-32

	},

	/**
	* Returns a random integer between 0 and 2^32.
	* @method Phaser.RandomDataGenerator#integer
	* @return {number}
	*/
	integer: function() {
		return this.rnd.apply(this) * 0x100000000;// 2^32
	},

	/**
	* Returns a random real number between 0 and 1.
	* @method Phaser.RandomDataGenerator#frac
	* @return {number}
	*/	
	frac: function() {
		return this.rnd.apply(this) + (this.rnd.apply(this) * 0x200000 | 0) * 1.1102230246251565e-16;// 2^-53
	},

	/**
	* Returns a random real number between 0 and 2^32.
	* @method Phaser.RandomDataGenerator#real
	* @return {number}
	*/
	real: function() {
		return this.integer() + this.frac();
	},

	/**
	* Returns a random integer between min and max.
	* @method Phaser.RandomDataGenerator#integerInRange
	* @param {number} min
	* @param {number} max
	* @return {number}
	*/
	integerInRange: function (min, max) {
		return Math.floor(this.realInRange(min, max));
	},

	/**
	* Returns a random real number between min and max.
	* @method Phaser.RandomDataGenerator#realInRange
	* @param {number} min
	* @param {number} max
	* @return {number}
	*/
	realInRange: function (min, max) {

		min = min || 0;
		max = max || 0;

		return this.frac() * (max - min) + min;

	},

	/**
	* Returns a random real number between -1 and 1.
	* @method Phaser.RandomDataGenerator#normal
	* @return {number}
	*/
	normal: function () {
		return 1 - 2 * this.frac();
	},

	/**
	* Returns a valid RFC4122 version4 ID hex string from https://gist.github.com/1308368
	* @method Phaser.RandomDataGenerator#uuid
	* @return {string}
	*/
	uuid: function () {

		var a, b;

		for (
			b=a='';
			a++<36;
			b+=~a%5|a*3&4?(a^15?8^this.frac()*(a^20?16:4):4).toString(16):'-'
		);

		return b;

	},

	/**
	* Returns a random member of `array`.
	* @method Phaser.RandomDataGenerator#pick
	* @param {Any} ary
	* @return {number}
	*/
	pick: function (ary) {
		return ary[this.integerInRange(0, ary.length)];
	},

	/**
	* Returns a random member of `array`, favoring the earlier entries.
	* @method Phaser.RandomDataGenerator#weightedPick
	* @param {Any} ary
	* @return {number}
	*/
	weightedPick: function (ary) {
		return ary[~~(Math.pow(this.frac(), 2) * ary.length)];
	},

	/**
	* Returns a random timestamp between min and max, or between the beginning of 2000 and the end of 2020 if min and max aren't specified.
	* @method Phaser.RandomDataGenerator#timestamp
	* @param {number} min
	* @param {number} max
	* @return {number}
	*/
	timestamp: function (a, b) {
		return this.realInRange(a || 946684800000, b || 1577862000000);
	},

	/**
	* Returns a random angle between -180 and 180.
	* @method Phaser.RandomDataGenerator#angle
	* @return {number}
	*/
	angle: function() {
		return this.integerInRange(-180, 180);
	}

};
