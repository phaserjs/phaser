/// <reference path="../Game.ts" />

/**
* Phaser - GameMath
*
* Adds a set of extra Math functions used through-out Phaser.
* Includes methods written by Dylan Engelman and Adam Saltsman.
*/

module Phaser {

    export class GameMath {

        constructor(game: Game) {
            this.game = game;
        }

        public game: Game;

        static PI: number = 3.141592653589793; //number pi
        static PI_2: number = 1.5707963267948965; //PI / 2 OR 90 deg
        static PI_4: number = 0.7853981633974483; //PI / 4 OR 45 deg
        static PI_8: number = 0.39269908169872413; //PI / 8 OR 22.5 deg
        static PI_16: number = 0.19634954084936206; //PI / 16 OR 11.25 deg
        static TWO_PI: number = 6.283185307179586; //2 * PI OR 180 deg
        static THREE_PI_2: number = 4.7123889803846895; //3 * PI_2 OR 270 deg
        static E: number = 2.71828182845905; //number e
        static LN10: number = 2.302585092994046; //ln(10)
        static LN2: number = 0.6931471805599453; //ln(2)
        static LOG10E: number = 0.4342944819032518; //logB10(e)
        static LOG2E: number = 1.442695040888963387; //logB2(e)
        static SQRT1_2: number = 0.7071067811865476; //sqrt( 1 / 2 )
        static SQRT2: number = 1.4142135623730951; //sqrt( 2 )
        static DEG_TO_RAD: number = 0.017453292519943294444444444444444; //PI / 180;
        static RAD_TO_DEG: number = 57.295779513082325225835265587527; // 180.0 / PI;

        static B_16: number = 65536;//2^16
        static B_31: number = 2147483648;//2^31
        static B_32: number = 4294967296;//2^32
        static B_48: number = 281474976710656;//2^48
        static B_53: number = 9007199254740992;//2^53 !!NOTE!! largest accurate double floating point whole value
        static B_64: number = 18446744073709551616;//2^64 !!NOTE!! Not accurate see B_53

        static ONE_THIRD: number = 0.333333333333333333333333333333333; // 1.0/3.0;
        static TWO_THIRDS: number = 0.666666666666666666666666666666666; // 2.0/3.0;
        static ONE_SIXTH: number = 0.166666666666666666666666666666666; // 1.0/6.0;

        static COS_PI_3: number = 0.86602540378443864676372317075294;//COS( PI / 3 )
        static SIN_2PI_3: number = 0.03654595;// SIN( 2*PI/3 )

        static CIRCLE_ALPHA: number = 0.5522847498307933984022516322796; //4*(Math.sqrt(2)-1)/3.0;

        static ON: bool = true;
        static OFF: bool = false;

        static SHORT_EPSILON: number = 0.1;//round integer epsilon
        static PERC_EPSILON: number = 0.001;//percentage epsilon
        static EPSILON: number = 0.0001;//single float average epsilon
        static LONG_EPSILON: number = 0.00000001;//arbitrary 8 digit epsilon

        public cosTable = [];
        public sinTable = [];

        public fuzzyEqual(a: number, b: number, epsilon: number = 0.0001): bool {
            return Math.abs(a - b) < epsilon;
        }

        public fuzzyLessThan(a: number, b: number, epsilon: number = 0.0001): bool {
            return a < b + epsilon;
        }

        public fuzzyGreaterThan(a: number, b: number, epsilon: number = 0.0001): bool {
            return a > b - epsilon;
        }

        public fuzzyCeil(val: number, epsilon: number = 0.0001): number {
            return Math.ceil(val - epsilon);
        }

        public fuzzyFloor(val: number, epsilon: number = 0.0001): number {
            return Math.floor(val + epsilon);
        }

        public average(...args: any[]): number {
            var avg: number = 0;

            for (var i = 0; i < args.length; i++)
            {
                avg += args[i];
            }

            return avg / args.length;
        }

        public slam(value: number, target: number, epsilon: number = 0.0001): number {
            return (Math.abs(value - target) < epsilon) ? target : value;
        }

        /**
         * ratio of value to a range
         */
        public percentageMinMax(val: number, max: number, min: number = 0): number {
            val -= min;
            max -= min;

            if (!max) return 0;
            else return val / max;
        }

        /**
         * a value representing the sign of the value.
         * -1 for negative, +1 for positive, 0 if value is 0
         */
        public sign(n: number): number {
            if (n) return n / Math.abs(n);
            else return 0;
        }

        public truncate(n: number): number {
            return (n > 0) ? Math.floor(n) : Math.ceil(n);
        }

        public shear(n: number): number {
            return n % 1;
        }

        /**
         * wrap a value around a range, similar to modulus with a floating minimum
         */
        public wrap(val: number, max: number, min: number = 0): number {
            val -= min;
            max -= min;
            if (max == 0) return min;
            val %= max;
            val += min;
            while (val < min)
                val += max;

            return val;
        }

        /**
         * arithmetic version of wrap... need to decide which is more efficient
         */
        public arithWrap(value: number, max: number, min: number = 0): number {
            max -= min;
            if (max == 0) return min;
            return value - max * Math.floor((value - min) / max);
        }

        /**
         * force a value within the boundaries of two values
         *
         * if max < min, min is returned
         */
        public clamp(input: number, max: number, min: number = 0): number {
            return Math.max(min, Math.min(max, input));
        }

        /**
         * Snap a value to nearest grid slice, using rounding.
         *
         * example if you have an interval gap of 5 and a position of 12... you will snap to 10. Where as 14 will snap to 15
         *
         * @param input - the value to snap
         * @param gap - the interval gap of the grid
         * @param [start] - optional starting offset for gap
         */
        public snapTo(input: number, gap: number, start: number = 0): number {
            if (gap == 0) return input;

            input -= start;
            input = gap * Math.round(input / gap);
            return start + input;
        }

        /**
         * Snap a value to nearest grid slice, using floor.
         *
         * example if you have an interval gap of 5 and a position of 12... you will snap to 10. As will 14 snap to 10... but 16 will snap to 15
         *
         * @param input - the value to snap
         * @param gap - the interval gap of the grid
         * @param [start] - optional starting offset for gap
         */
        public snapToFloor(input: number, gap: number, start: number = 0): number {
            if (gap == 0) return input;

            input -= start;
            input = gap * Math.floor(input / gap);
            return start + input;
        }

        /**
         * Snap a value to nearest grid slice, using ceil.
         *
         * example if you have an interval gap of 5 and a position of 12... you will snap to 15. As will 14 will snap to 15... but 16 will snap to 20
         *
         * @param input - the value to snap
         * @param gap - the interval gap of the grid
         * @param [start] - optional starting offset for gap
         */
        public snapToCeil(input: number, gap: number, start: number = 0): number {
            if (gap == 0) return input;

            input -= start;
            input = gap * Math.ceil(input / gap);
            return start + input;
        }

        /**
         * Snaps a value to the nearest value in an array.
         */
        public snapToInArray(input: number, arr: number[], sort?: bool = true): number {

            if (sort) arr.sort();
            if (input < arr[0]) return arr[0];

            var i: number = 1;

            while (arr[i] < input)
                i++;

            var low: number = arr[i - 1];
            var high: number = (i < arr.length) ? arr[i] : Number.POSITIVE_INFINITY;

            return ((high - input) <= (input - low)) ? high : low;
        }

        /**
         * roundTo some place comparative to a 'base', default is 10 for decimal place
         *
         * 'place' is represented by the power applied to 'base' to get that place
         *
         * @param value - the value to round
         * @param place - the place to round to
         * @param base - the base to round in... default is 10 for decimal
         *
         * e.g.
         *
         * 2000/7 ~= 285.714285714285714285714 ~= (bin)100011101.1011011011011011
         *
         * roundTo(2000/7,3) == 0
         * roundTo(2000/7,2) == 300
         * roundTo(2000/7,1) == 290
         * roundTo(2000/7,0) == 286
         * roundTo(2000/7,-1) == 285.7
         * roundTo(2000/7,-2) == 285.71
         * roundTo(2000/7,-3) == 285.714
         * roundTo(2000/7,-4) == 285.7143
         * roundTo(2000/7,-5) == 285.71429
         *
         * roundTo(2000/7,3,2)  == 288       -- 100100000
         * roundTo(2000/7,2,2)  == 284       -- 100011100
         * roundTo(2000/7,1,2)  == 286       -- 100011110
         * roundTo(2000/7,0,2)  == 286       -- 100011110
         * roundTo(2000/7,-1,2) == 285.5     -- 100011101.1
         * roundTo(2000/7,-2,2) == 285.75    -- 100011101.11
         * roundTo(2000/7,-3,2) == 285.75    -- 100011101.11
         * roundTo(2000/7,-4,2) == 285.6875  -- 100011101.1011
         * roundTo(2000/7,-5,2) == 285.71875 -- 100011101.10111
         *
         * note what occurs when we round to the 3rd space (8ths place), 100100000, this is to be assumed
         * because we are rounding 100011.1011011011011011 which rounds up.
         */
        public roundTo(value: number, place: number = 0, base: number = 10): number {
            var p: number = Math.pow(base, -place);
            return Math.round(value * p) / p;
        }

        public floorTo(value: number, place: number = 0, base: number = 10): number {
            var p: number = Math.pow(base, -place);
            return Math.floor(value * p) / p;
        }

        public ceilTo(value: number, place: number = 0, base: number = 10): number {
            var p: number = Math.pow(base, -place);
            return Math.ceil(value * p) / p;
        }

        /**
         * a one dimensional linear interpolation of a value.
         */
        public interpolateFloat(a: number, b: number, weight: number): number {
            return (b - a) * weight + a;
        }

        /**
         * convert radians to degrees
         */
        public radiansToDegrees(angle: number): number {
            return angle * GameMath.RAD_TO_DEG;
        }

        /**
         * convert degrees to radians
         */
        public degreesToRadians(angle: number): number {
            return angle * GameMath.DEG_TO_RAD;
        }

        /**
         * Find the angle of a segment from (x1, y1) -> (x2, y2 )
         */
        public angleBetween(x1: number, y1: number, x2: number, y2: number): number {
            return Math.atan2(y2 - y1, x2 - x1);
        }


        /**
         * set an angle within the bounds of -PI to PI
         */
        public normalizeAngle(angle: number, radians: bool = true): number {
            var rd: number = (radians) ? GameMath.PI : 180;
            return this.wrap(angle, rd, -rd);
        }

        /**
         * closest angle between two angles from a1 to a2
         * absolute value the return for exact angle
         */
        public nearestAngleBetween(a1: number, a2: number, radians: bool = true): number {

            var rd: number = (radians) ? GameMath.PI : 180;

            a1 = this.normalizeAngle(a1, radians);
            a2 = this.normalizeAngle(a2, radians);

            if (a1 < -rd / 2 && a2 > rd / 2) a1 += rd * 2;
            if (a2 < -rd / 2 && a1 > rd / 2) a2 += rd * 2;

            return a2 - a1;
        }

        /**
         * normalizes independent and then sets dep to the nearest value respective to independent
         *
         * for instance if dep=-170 and ind=170 then 190 will be returned as an alternative to -170
         */
        public normalizeAngleToAnother(dep: number, ind: number, radians: bool = true): number {
            return ind + this.nearestAngleBetween(ind, dep, radians);
        }

        /**
         * normalize independent and dependent and then set dependent to an angle relative to 'after/clockwise' independent
         *
         * for instance dep=-170 and ind=170, then 190 will be reutrned as alternative to -170
         */
        public normalizeAngleAfterAnother(dep: number, ind: number, radians: bool = true): number {

            dep = this.normalizeAngle(dep - ind, radians);
            return ind + dep;
        }

        /**
         * normalizes indendent and dependent and then sets dependent to an angle relative to 'before/counterclockwise' independent
         *
         * for instance dep = 190 and ind = 170, then -170 will be returned as an alternative to 190
         */
        public normalizeAngleBeforeAnother(dep: number, ind: number, radians: bool = true): number {

            dep = this.normalizeAngle(ind - dep, radians);
            return ind - dep;
        }

        /**
         * interpolate across the shortest arc between two angles
         */
        public interpolateAngles(a1: number, a2: number, weight: number, radians: bool = true, ease = null): number {

            a1 = this.normalizeAngle(a1, radians);
            a2 = this.normalizeAngleToAnother(a2, a1, radians);

            return (typeof ease === 'function') ? ease(weight, a1, a2 - a1, 1) : this.interpolateFloat(a1, a2, weight);
        }

        /**
         * Compute the logarithm of any value of any base
         *
         * a logarithm is the exponent that some constant (base) would have to be raised to
         * to be equal to value.
         *
         * i.e.
         * 4 ^ x = 16
         * can be rewritten as to solve for x
         * logB4(16) = x
         * which with this function would be
         * LoDMath.logBaseOf(16,4)
         *
         * which would return 2, because 4^2 = 16
         */
        public logBaseOf(value: number, base: number): number {
            return Math.log(value) / Math.log(base);
        }

        /**
         * Greatest Common Denominator using Euclid's algorithm
         */
        public GCD(m: number, n: number): number {
            var r: number;

            //make sure positive, GCD is always positive
            m = Math.abs(m);
            n = Math.abs(n);

            //m must be >= n
            if (m < n)
            {
                r = m;
                m = n;
                n = r;
            }

            //now start loop
            while (true)
            {
                r = m % n;
                if (!r) return n;
                m = n;
                n = r;
            }

            return 1;
        }

        /**
         * Lowest Common Multiple
         */
        public LCM(m: number, n: number): number {
            return (m * n) / this.GCD(m, n);
        }

        /**
         * Factorial - N!
         *
         * simple product series
         *
         * by definition:
         * 0! == 1
         */
        public factorial(value: number): number {
            if (value == 0) return 1;

            var res: number = value;

            while (--value)
            {
                res *= value;
            }

            return res;
        }

        /**
         * gamma function
         *
         * defined: gamma(N) == (N - 1)!
         */
        public gammaFunction(value: number): number {
            return this.factorial(value - 1);
        }

        /**
         * falling factorial
         *
         * defined: (N)! / (N - x)!
         *
         * written subscript: (N)x OR (base)exp
         */
        public fallingFactorial(base: number, exp: number): number {
            return this.factorial(base) / this.factorial(base - exp);
        }

        /**
         * rising factorial
         *
         * defined: (N + x - 1)! / (N - 1)!
         *
         * written superscript N^(x) OR base^(exp)
         */
        public risingFactorial(base: number, exp: number): number {
            //expanded from gammaFunction for speed
            return this.factorial(base + exp - 1) / this.factorial(base - 1);
        }

        /**
         * binomial coefficient
         *
         * defined: N! / (k!(N-k)!)
         * reduced: N! / (N-k)! == (N)k (fallingfactorial)
         * reduced: (N)k / k!
         */
        public binCoef(n: number, k: number): number {
            return this.fallingFactorial(n, k) / this.factorial(k);
        }

        /**
         * rising binomial coefficient
         *
         * as one can notice in the analysis of binCoef(...) that
         * binCoef is the (N)k divided by k!. Similarly rising binCoef
         * is merely N^(k) / k!
         */
        public risingBinCoef(n: number, k: number): number {
            return this.risingFactorial(n, k) / this.factorial(k);
        }

        /**
         * Generate a random boolean result based on the chance value
         * <p>
         * Returns true or false based on the chance value (default 50%). For example if you wanted a player to have a 30% chance
         * of getting a bonus, call chanceRoll(30) - true means the chance passed, false means it failed.
         * </p>
         * @param chance The chance of receiving the value. A number between 0 and 100 (effectively 0% to 100%)
         * @return true if the roll passed, or false
         */
        public chanceRoll(chance: number = 50): bool {

            if (chance <= 0)
            {
                return false;
            }
            else if (chance >= 100)
            {
                return true;
            }
            else
            {
                if (Math.random() * 100 >= chance)
                {
                    return false;
                }
                else
                {
                    return true;
                }
            }

        }

        /**
         * Adds the given amount to the value, but never lets the value go over the specified maximum
         *
         * @param value The value to add the amount to
         * @param amount The amount to add to the value
         * @param max The maximum the value is allowed to be
         * @return The new value
         */
        public maxAdd(value: number, amount: number, max: number): number {

            value += amount;

            if (value > max)
            {
                value = max;
            }

            return value;

        }

        /**
         * Subtracts the given amount from the value, but never lets the value go below the specified minimum
         *
         * @param value The base value
         * @param amount The amount to subtract from the base value
         * @param min The minimum the value is allowed to be
         * @return The new value
         */
        public minSub(value: number, amount: number, min: number): number {

            value -= amount;

            if (value < min)
            {
                value = min;
            }

            return value;
        }

        /**
         * Adds value to amount and ensures that the result always stays between 0 and max, by wrapping the value around.
         * <p>Values must be positive integers, and are passed through Math.abs</p>
         *
         * @param value The value to add the amount to
         * @param amount The amount to add to the value
         * @param max The maximum the value is allowed to be
         * @return The wrapped value
         */
        public wrapValue(value: number, amount: number, max: number): number {

            var diff: number;

            value = Math.abs(value);
            amount = Math.abs(amount);
            max = Math.abs(max);

            diff = (value + amount) % max;

            return diff;

        }

        /**
         * Randomly returns either a 1 or -1
         *
         * @return	1 or -1
         */
        public randomSign(): number {
            return (Math.random() > 0.5) ? 1 : -1;
        }

        /**
         * Returns true if the number given is odd.
         *
         * @param	n	The number to check
         *
         * @return	True if the given number is odd. False if the given number is even.
         */
        public isOdd(n: number): bool {

            if (n & 1)
            {
                return true;
            }
            else
            {
                return false;
            }

        }

        /**
         * Returns true if the number given is even.
         *
         * @param	n	The number to check
         *
         * @return	True if the given number is even. False if the given number is odd.
         */
        public isEven(n: number): bool {

            if (n & 1)
            {
                return false;
            }
            else
            {
                return true;
            }

        }

        /**
         * Keeps an angle value between -180 and +180<br>
         * Should be called whenever the angle is updated on the Sprite to stop it from going insane.
         *
         * @param	angle	The angle value to check
         *
         * @return	The new angle value, returns the same as the input angle if it was within bounds
         */
        public wrapAngle(angle: number): number {

            var result: number = angle;

            //  Nothing needs to change
            if (angle >= -180 && angle <= 180)
            {
                return angle;
            }

            //  Else normalise it to -180, 180
            result = (angle + 180) % 360;

            if (result < 0)
            {
                result += 360;
            }

            return result - 180;

        }

        /**
         * Keeps an angle value between the given min and max values
         *
         * @param	angle	The angle value to check. Must be between -180 and +180
         * @param	min		The minimum angle that is allowed (must be -180 or greater)
         * @param	max		The maximum angle that is allowed (must be 180 or less)
         *
         * @return	The new angle value, returns the same as the input angle if it was within bounds
         */
        public angleLimit(angle: number, min: number, max: number): number {

            var result: number = angle;

            if (angle > max)
            {
                result = max;
            }
            else if (angle < min)
            {
                result = min;
            }

            return result;
        }

        /**
        * @method linear
        * @param {Any} v
        * @param {Any} k
        * @public
        */
        public linearInterpolation(v, k) {

            var m = v.length - 1;
            var f = m * k;
            var i = Math.floor(f);

            if (k < 0) return this.linear(v[0], v[1], f);
            if (k > 1) return this.linear(v[m], v[m - 1], m - f);

            return this.linear(v[i], v[i + 1 > m ? m : i + 1], f - i);

        }

        /**
        * @method Bezier
        * @param {Any} v
        * @param {Any} k
        * @public
        */
        public bezierInterpolation(v, k) {

            var b = 0;
            var n = v.length - 1;

            for (var i = 0; i <= n; i++)
            {
                b += Math.pow(1 - k, n - i) * Math.pow(k, i) * v[i] * this.bernstein(n, i);
            }

            return b;

        }

        /**
        * @method CatmullRom
        * @param {Any} v
        * @param {Any} k
        * @public
        */
        public catmullRomInterpolation(v, k) {

            var m = v.length - 1;
            var f = m * k;
            var i = Math.floor(f);

            if (v[0] === v[m])
            {
                if (k < 0) i = Math.floor(f = m * (1 + k));

                return this.catmullRom(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);

            }
            else
            {
                if (k < 0) return v[0] - (this.catmullRom(v[0], v[0], v[1], v[1], -f) - v[0]);

                if (k > 1) return v[m] - (this.catmullRom(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);

                return this.catmullRom(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);
            }

        }

        /**
        * @method Linear
        * @param {Any} p0
        * @param {Any} p1
        * @param {Any} t
        * @public
        */
        public linear(p0, p1, t) {

            return (p1 - p0) * t + p0;

        }

        /**
        * @method Bernstein
        * @param {Any} n
        * @param {Any} i
        * @public
        */
        public bernstein(n, i) {

            return this.factorial(n) / this.factorial(i) / this.factorial(n - i);

        }

        /**
        * @method CatmullRom
        * @param {Any} p0
        * @param {Any} p1
        * @param {Any} p2
        * @param {Any} p3
        * @param {Any} t
        * @public
        */
        public catmullRom(p0, p1, p2, p3, t) {

            var v0 = (p2 - p0) * 0.5, v1 = (p3 - p1) * 0.5, t2 = t * t, t3 = t * t2;
            return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;

        }

        public difference(a: number, b: number): number {

            return Math.abs(a - b);

        }

        /**
        * The global random number generator seed (for deterministic behavior in recordings and saves).
        */
        public globalSeed: number = Math.random();

        /**
        * Generates a random number.  Deterministic, meaning safe
        * to use if you want to record replays in random environments.
        *
        * @return	A <code>Number</code> between 0 and 1.
        */
        public random(): number {
            return this.globalSeed = this.srand(this.globalSeed);
        }

        /**
        * Generates a random number based on the seed provided.
        *
        * @param	Seed	A number between 0 and 1, used to generate a predictable random number (very optional).
        *
        * @return	A <code>Number</code> between 0 and 1.
        */
        public srand(Seed: number): number {

            return ((69621 * (Seed * 0x7FFFFFFF)) % 0x7FFFFFFF) / 0x7FFFFFFF;

        }

        /**
        * Fetch a random entry from the given array.
        * Will return null if random selection is missing, or array has no entries.
        *
        * @param	objects		An array of objects.
        * @param	startIndex	Optional offset off the front of the array. Default value is 0, or the beginning of the array.
        * @param	length		Optional restriction on the number of values you want to randomly select from.
        *
        * @return	The random object that was selected.
        */
        public getRandom(objects, startIndex: number = 0, length: number = 0) {

            if (objects != null)
            {
                var l: number = length;

                if ((l == 0) || (l > objects.length - startIndex))
                {
                    l = objects.length - startIndex;
                }

                if (l > 0)
                {
                    return objects[startIndex + Math.floor(Math.random() * l)];
                }
            }

            return null;

        }

        /**
         * Round down to the next whole number. E.g. floor(1.7) == 1, and floor(-2.7) == -2.
         *
         * @param	Value	Any number.
         *
         * @return	The rounded value of that number.
         */
        public floor(Value: number): number {
            var n: number = Value | 0;
            return (Value > 0) ? (n) : ((n != Value) ? (n - 1) : (n));
        }

        /**
         * Round up to the next whole number.  E.g. ceil(1.3) == 2, and ceil(-2.3) == -3.
         *
         * @param	Value	Any number.
         *
         * @return	The rounded value of that number.
         */
        public ceil(Value: number): number {
            var n: number = Value | 0;
            return (Value > 0) ? ((n != Value) ? (n + 1) : (n)) : (n);
        }

        /**
         * Generate a sine and cosine table simultaneously and extremely quickly. Based on research by Franky of scene.at
         * <p>
         * The parameters allow you to specify the length, amplitude and frequency of the wave. Once you have called this function
         * you should get the results via getSinTable() and getCosTable(). This generator is fast enough to be used in real-time.
         * </p>
         * @param length 		The length of the wave
         * @param sinAmplitude 	The amplitude to apply to the sine table (default 1.0) if you need values between say -+ 125 then give 125 as the value
         * @param cosAmplitude 	The amplitude to apply to the cosine table (default 1.0) if you need values between say -+ 125 then give 125 as the value
         * @param frequency 	The frequency of the sine and cosine table data
         * @return	Returns the sine table
         * @see getSinTable
         * @see getCosTable
         */
        public sinCosGenerator(length: number, sinAmplitude?: number = 1.0, cosAmplitude?: number = 1.0, frequency?: number = 1.0) {

            var sin: number = sinAmplitude;
            var cos: number = cosAmplitude;
            var frq: number = frequency * Math.PI / length;

            this.cosTable = [];
            this.sinTable = [];

            for (var c: number = 0; c < length; c++)
            {
                cos -= sin * frq;
                sin += cos * frq;

                this.cosTable[c] = cos;
                this.sinTable[c] = sin;
            }

            return this.sinTable;

        }

        /**
        * Shifts through the sin table data by one value and returns it.
        * This effectively moves the position of the data from the start to the end of the table.
        * @return	The sin value.
        */
        public shiftSinTable(): number {

            if (this.sinTable)
            {
                var s = this.sinTable.shift();
                this.sinTable.push(s);
                return s;
            }

        }

        /**
        * Shifts through the cos table data by one value and returns it.
        * This effectively moves the position of the data from the start to the end of the table.
        * @return	The cos value.
        */
        public shiftCosTable(): number {

            if (this.cosTable)
            {
                var s = this.cosTable.shift();
                this.cosTable.push(s);
                return s;
            }

        }

        /**
        * Shuffles the data in the given array into a new order
	    * @param array The array to shuffle
        * @return The array
        */
        public shuffleArray(array) {

            for (var i = array.length - 1; i > 0; i--)
            {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }

            return array;

        }

        /**
         * Returns the distance from this Point object to the given Point object.
         * @method distanceFrom
         * @param {Point} target - The destination Point object.
         * @param {Boolean} round - Round the distance to the nearest integer (default false)
         * @return {Number} The distance between this Point object and the destination Point object.
         **/
        public distanceBetween(x1: number, y1: number, x2: number, y2: number): number {

            var dx = x1 - x2;
            var dy = y1 - y2;

            return Math.sqrt(dx * dx + dy * dy);

        }

        /**
		 * Finds the length of the given vector
		 * 
		 * @param	dx
		 * @param	dy
		 * 
		 * @return
		 */
        public vectorLength(dx:number, dy:number):number
        {
            return Math.sqrt(dx * dx + dy * dy);
        }

        /**
        * Rotates the point around the x/y coordinates given to the desired rotation and distance
	    * @param point {Object} Any object with exposed x and y properties
	    * @param x {number} The x coordinate of the anchor point
	    * @param y {number} The y coordinate of the anchor point
        * @param {Number} rotation The rotation in radians (unless asDegrees is true) to return the point from.
	    * @param {Boolean} asDegrees Is the given rotation in radians (false) or degrees (true)?
        * @param {Number} distance An optional distance constraint between the point and the anchor
        * @return The modified point object
        */
        public rotatePoint(point, x1: number, y1: number, rotation: number, asDegrees: bool = false, distance?:number = null) {

            if (asDegrees)
            {
                rotation = rotation * GameMath.DEG_TO_RAD;
            }

            //  Get distance from origin to the point
            if (distance === null)
            {
                distance = Math.sqrt(((x1 - point.x) * (x1 - point.x)) + ((y1 - point.y) * (y1 - point.y)));
            }

            point.x = x1 + distance * Math.cos(rotation);
            point.y = y1 + distance * Math.sin(rotation);

            return point;

        }

    }

}