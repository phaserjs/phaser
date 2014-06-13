/* jshint noempty: false */

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
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

    /**
    * @property {number} c - Internal var.
    * @private
    */
    this.c = 1;

    /**
    * @property {number} s0 - Internal var.
    * @private
    */
    this.s0 = 0;

    /**
    * @property {number} s1 - Internal var.
    * @private
    */
    this.s1 = 0;

    /**
    * @property {number} s2 - Internal var.
    * @private
    */
    this.s2 = 0;

    this.sow(seeds);

};

Phaser.RandomDataGenerator.prototype = {

    /**
    * Private random helper.
    *
    * @method Phaser.RandomDataGenerator#rnd
    * @private
    * @return {number}
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
        this.c = 1;

        var seed;

        for (var i = 0; seed = seeds[i++]; )
        {
            this.s0 -= this.hash(seed);
            this.s0 += ~~(this.s0 < 0);
            this.s1 -= this.hash(seed);
            this.s1 += ~~(this.s1 < 0);
            this.s2 -= this.hash(seed);
            this.s2 += ~~(this.s2 < 0);
        }

    },

    /**
    * Internal method that creates a seed hash.
    *
    * @method Phaser.RandomDataGenerator#hash
    * @private
    * @param {Any} data
    * @return {number} hashed value.
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
    *
    * @method Phaser.RandomDataGenerator#integer
    * @return {number} A random integer between 0 and 2^32.
    */
    integer: function() {

        return this.rnd.apply(this) * 0x100000000;// 2^32

    },

    /**
    * Returns a random real number between 0 and 1.
    *
    * @method Phaser.RandomDataGenerator#frac
    * @return {number} A random real number between 0 and 1.
    */
    frac: function() {

        return this.rnd.apply(this) + (this.rnd.apply(this) * 0x200000 | 0) * 1.1102230246251565e-16;   // 2^-53

    },

    /**
    * Returns a random real number between 0 and 2^32.
    *
    * @method Phaser.RandomDataGenerator#real
    * @return {number} A random real number between 0 and 2^32.
    */
    real: function() {

        return this.integer() + this.frac();

    },

    /**
    * Returns a random integer between and including min and max.
    *
    * @method Phaser.RandomDataGenerator#integerInRange
    * @param {number} min - The minimum value in the range.
    * @param {number} max - The maximum value in the range.
    * @return {number} A random number between min and max.
    */
    integerInRange: function (min, max) {

        return Math.floor(this.realInRange(0, max - min + 1) + min);

    },

    /**
    * Returns a random integer between and including min and max.
    * This method is an alias for RandomDataGenerator.integerInRange.
    *
    * @method Phaser.RandomDataGenerator#between
    * @param {number} min - The minimum value in the range.
    * @param {number} max - The maximum value in the range.
    * @return {number} A random number between min and max.
    */
    between: function (min, max) {

        return this.integerInRange(min, max);

    },

    /**
    * Returns a random real number between min and max.
    *
    * @method Phaser.RandomDataGenerator#realInRange
    * @param {number} min - The minimum value in the range.
    * @param {number} max - The maximum value in the range.
    * @return {number} A random number between min and max.
    */
    realInRange: function (min, max) {

        return this.frac() * (max - min) + min;

    },

    /**
    * Returns a random real number between -1 and 1.
    *
    * @method Phaser.RandomDataGenerator#normal
    * @return {number} A random real number between -1 and 1.
    */
    normal: function () {

        return 1 - 2 * this.frac();

    },

    /**
    * Returns a valid RFC4122 version4 ID hex string from https://gist.github.com/1308368
    *
    * @method Phaser.RandomDataGenerator#uuid
    * @return {string} A valid RFC4122 version4 ID hex string
    */
    uuid: function () {

        var a = '';
        var b = '';

        for (b = a = ''; a++ < 36; b +=~a % 5 | a * 3&4 ? (a^15 ? 8^this.frac() * (a^20 ? 16 : 4) : 4).toString(16) : '-')
        {
        }

        return b;

    },

    /**
    * Returns a random member of `array`.
    *
    * @method Phaser.RandomDataGenerator#pick
    * @param {Array} ary - An Array to pick a random member of.
    * @return {any} A random member of the array.
    */
    pick: function (ary) {

        return ary[this.integerInRange(0, ary.length - 1)];

    },

    /**
    * Returns a random member of `array`, favoring the earlier entries.
    *
    * @method Phaser.RandomDataGenerator#weightedPick
    * @param {Array} ary - An Array to pick a random member of.
    * @return {any} A random member of the array.
    */
    weightedPick: function (ary) {

        return ary[~~(Math.pow(this.frac(), 2) * (ary.length - 1))];

    },

    /**
    * Returns a random timestamp between min and max, or between the beginning of 2000 and the end of 2020 if min and max aren't specified.
    *
    * @method Phaser.RandomDataGenerator#timestamp
    * @param {number} min - The minimum value in the range.
    * @param {number} max - The maximum value in the range.
    * @return {number} A random timestamp between min and max.
    */
    timestamp: function (min, max) {

        return this.realInRange(min || 946684800000, max || 1577862000000);

    },

    /**
    * Returns a random angle between -180 and 180.
    *
    * @method Phaser.RandomDataGenerator#angle
    * @return {number} A random number between -180 and 180.
    */
    angle: function() {

        return this.integerInRange(-180, 180);

    }

};

Phaser.RandomDataGenerator.prototype.constructor = Phaser.RandomDataGenerator;
