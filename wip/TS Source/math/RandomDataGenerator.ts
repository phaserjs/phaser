/// <reference path="../_definitions.ts" />

/**
* Phaser - RandomDataGenerator
*
* An extremely useful repeatable random data generator. Access it via Game.rnd
* Based on Nonsense by Josh Faul https://github.com/jocafa/Nonsense
* Random number generator from http://baagoe.org/en/wiki/Better_random_numbers_for_javascript
*/

module Phaser {

    export class RandomDataGenerator {

        /**
        * @constructor
        * @param {Array} seeds
        * @return {Phaser.RandomDataGenerator}
        */
        constructor(seeds: string[]= []) {

            this.sow(seeds);

        }

        /**
        * @property s0
        * @type Any
        * @private
        */
        private s0;

        /**
        * @property s1
        * @type Any
        * @private
        */
        private s1;

        /**
        * @property s2
        * @type Any
        * @private
        */
        private s2;

        /**
        * @property c
        * @type Number
        * @private
        */
        private c: number = 1;

        /**
        * @method uint32
        * @private
        */
        private uint32(): number {

            return this.rnd.apply(this) * 0x100000000; // 2^32

        }

        /**
        * @method fract32
        * @private
        */
        private fract32(): number {

            return this.rnd.apply(this) + (this.rnd.apply(this) * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53

        }

        // private random helper
        /**
        * @method rnd
        * @private
        */
        private rnd(): number {

            var t = 2091639 * this.s0 + this.c * 2.3283064365386963e-10; // 2^-32

            this.c = t | 0;
            this.s0 = this.s1;
            this.s1 = this.s2;
            this.s2 = t - this.c;

            return this.s2;
        }

        /**
        * @method hash
        * @param {Any} data
        * @private
        */
        private hash(data) {

            var h, i, n;

            n = 0xefc8249d;

            data = data.toString();

            for (i = 0; i < data.length; i++)
            {
                n += data.charCodeAt(i);
                h = 0.02519603282416938 * n;
                n = h >>> 0;
                h -= n;
                h *= n;
                n = h >>> 0;
                h -= n;
                n += h * 0x100000000; // 2^32
            }

            return (n >>> 0) * 2.3283064365386963e-10; // 2^-32

        }

        /**
        * Reset the seed of the random data generator
        * @method sow
        * @param {Array} seeds
        */
        public sow(seeds: string[]= []) {

            this.s0 = this.hash(' ');
            this.s1 = this.hash(this.s0);
            this.s2 = this.hash(this.s1);

            var seed;

            for (var i = 0; seed = seeds[i++];)
            {
                this.s0 -= this.hash(seed);
                this.s0 += ~~(this.s0 < 0);

                this.s1 -= this.hash(seed);
                this.s1 += ~~(this.s1 < 0);

                this.s2 -= this.hash(seed);
                this.s2 += ~~(this.s2 < 0);
            }

        }

        /**
        * Returns a random integer between 0 and 2^32
        * @method integer
        * @return {Number}
        */
        public get integer(): number {

            return this.uint32();

        }

        /**
        * Returns a random real number between 0 and 1
        * @method frac
        * @return {Number}
        */
        public get frac(): number {

            return this.fract32();

        }

        /**
        * Returns a random real number between 0 and 2^32
        * @method real
        * @return {Number}
        */
        public get real(): number {

            return this.uint32() + this.fract32();

        }

        /**
        * Returns a random integer between min and max
        * @method integerInRange
        * @param {Number} min
        * @param {Number} max
        * @return {Number}
        */
        public integerInRange(min: number, max: number): number {

            return Math.floor(this.realInRange(min, max));

        }

        /**
        * Returns a random real number between min and max
        * @method realInRange
        * @param {Number} min
        * @param {Number} max
        * @return {Number}
        */
        public realInRange(min: number, max: number): number {

            min = min || 0;
            max = max || 0;

            return this.frac * (max - min) + min;

        }

        /**
        * Returns a random real number between -1 and 1
        * @method normal
        * @return {Number}
        */
        public get normal(): number {

            return 1 - 2 * this.frac;

        }

        /**
        * Returns a valid v4 UUID hex string (from https://gist.github.com/1308368)
        * @method uuid
        * @return {String}
        */
        public get uuid(): string {

            var a, b;

            for (
                b = a = '';
                a++ < 36;
                b += ~a % 5 | a * 3 & 4 ? (a ^ 15 ? 8 ^ this.frac * (a ^ 20 ? 16 : 4) : 4).toString(16) : '-'
                );

            return b;
        }

        /**
        * Returns a random member of `array`
        * @method pick
        * @param {Any} array
        */
        public pick(array) {

            return array[this.integerInRange(0, array.length)];

        }

        /**
        * Returns a random member of `array`, favoring the earlier entries
        * @method weightedPick
        * @param {Any} array
        */
        public weightedPick(array) {

            return array[~~(Math.pow(this.frac, 2) * array.length)];

        }

        /**
        * Returns a random timestamp between min and max, or between the beginning of 2000 and the end of 2020 if min and max aren't specified
        * @method timestamp
        * @param {Number} min
        * @param {Number} max
        */
        public timestamp(min: number = 946684800000, max: number = 1577862000000): number {

            return this.realInRange(min, max);

        }

        /**
        * Returns a random angle between -180 and 180
        * @method angle
        */
        public get angle(): number {

            return this.integerInRange(-180, 180);

        }

    }

}