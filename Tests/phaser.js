/**
*  Phaser - GameMath
*
*  @desc       Adds a set of extra Math functions and extends a few commonly used ones.
*              Includes methods written by Dylan Engelman and Adam Saltsman.
*
*	@version 	1.0 - 17th March 2013
*	@author 	Richard Davey
*/
var GameMath = (function () {
    function GameMath(game) {
        /**
        * The global random number generator seed (for deterministic behavior in recordings and saves).
        */
        this.globalSeed = Math.random();
        this._game = game;
    }
    GameMath.PI = 3.141592653589793;
    GameMath.PI_2 = 1.5707963267948965;
    GameMath.PI_4 = 0.7853981633974483;
    GameMath.PI_8 = 0.39269908169872413;
    GameMath.PI_16 = 0.19634954084936206;
    GameMath.TWO_PI = 6.283185307179586;
    GameMath.THREE_PI_2 = 4.7123889803846895;
    GameMath.E = 2.71828182845905;
    GameMath.LN10 = 2.302585092994046;
    GameMath.LN2 = 0.6931471805599453;
    GameMath.LOG10E = 0.4342944819032518;
    GameMath.LOG2E = 1.442695040888963387;
    GameMath.SQRT1_2 = 0.7071067811865476;
    GameMath.SQRT2 = 1.4142135623730951;
    GameMath.DEG_TO_RAD = 0.017453292519943294444444444444444;
    GameMath.RAD_TO_DEG = 57.295779513082325225835265587527;
    GameMath.B_16 = 65536;
    GameMath.B_31 = 2147483648;
    GameMath.B_32 = 4294967296;
    GameMath.B_48 = 281474976710656;
    GameMath.B_53 = 9007199254740992;
    GameMath.B_64 = 18446744073709551616;
    GameMath.ONE_THIRD = 0.333333333333333333333333333333333;
    GameMath.TWO_THIRDS = 0.666666666666666666666666666666666;
    GameMath.ONE_SIXTH = 0.166666666666666666666666666666666;
    GameMath.COS_PI_3 = 0.86602540378443864676372317075294;
    GameMath.SIN_2PI_3 = 0.03654595;
    GameMath.CIRCLE_ALPHA = 0.5522847498307933984022516322796;
    GameMath.ON = true;
    GameMath.OFF = false;
    GameMath.SHORT_EPSILON = 0.1;
    GameMath.PERC_EPSILON = 0.001;
    GameMath.EPSILON = 0.0001;
    GameMath.LONG_EPSILON = 0.00000001;
    GameMath.prototype.computeMachineEpsilon = //arbitrary 8 digit epsilon
    function () {
        // Machine epsilon ala Eispack
        var fourThirds = 4.0 / 3.0;
        var third = fourThirds - 1.0;
        var one = third + third + third;
        return Math.abs(1.0 - one);
    };
    GameMath.prototype.fuzzyEqual = function (a, b, epsilon) {
        if (typeof epsilon === "undefined") { epsilon = 0.0001; }
        return Math.abs(a - b) < epsilon;
    };
    GameMath.prototype.fuzzyLessThan = function (a, b, epsilon) {
        if (typeof epsilon === "undefined") { epsilon = 0.0001; }
        return a < b + epsilon;
    };
    GameMath.prototype.fuzzyGreaterThan = function (a, b, epsilon) {
        if (typeof epsilon === "undefined") { epsilon = 0.0001; }
        return a > b - epsilon;
    };
    GameMath.prototype.fuzzyCeil = function (val, epsilon) {
        if (typeof epsilon === "undefined") { epsilon = 0.0001; }
        return Math.ceil(val - epsilon);
    };
    GameMath.prototype.fuzzyFloor = function (val, epsilon) {
        if (typeof epsilon === "undefined") { epsilon = 0.0001; }
        return Math.floor(val + epsilon);
    };
    GameMath.prototype.average = function () {
        var args = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            args[_i] = arguments[_i + 0];
        }
        var avg = 0;
        for(var i = 0; i < args.length; i++) {
            avg += args[i];
        }
        return avg / args.length;
    };
    GameMath.prototype.slam = function (value, target, epsilon) {
        if (typeof epsilon === "undefined") { epsilon = 0.0001; }
        return (Math.abs(value - target) < epsilon) ? target : value;
    };
    GameMath.prototype.percentageMinMax = /**
    * ratio of value to a range
    */
    function (val, max, min) {
        if (typeof min === "undefined") { min = 0; }
        val -= min;
        max -= min;
        if(!max) {
            return 0;
        } else {
            return val / max;
        }
    };
    GameMath.prototype.sign = /**
    * a value representing the sign of the value.
    * -1 for negative, +1 for positive, 0 if value is 0
    */
    function (n) {
        if(n) {
            return n / Math.abs(n);
        } else {
            return 0;
        }
    };
    GameMath.prototype.truncate = function (n) {
        return (n > 0) ? Math.floor(n) : Math.ceil(n);
    };
    GameMath.prototype.shear = function (n) {
        return n % 1;
    };
    GameMath.prototype.wrap = /**
    * wrap a value around a range, similar to modulus with a floating minimum
    */
    function (val, max, min) {
        if (typeof min === "undefined") { min = 0; }
        val -= min;
        max -= min;
        if(max == 0) {
            return min;
        }
        val %= max;
        val += min;
        while(val < min) {
            val += max;
        }
        return val;
    };
    GameMath.prototype.arithWrap = /**
    * arithmetic version of wrap... need to decide which is more efficient
    */
    function (value, max, min) {
        if (typeof min === "undefined") { min = 0; }
        max -= min;
        if(max == 0) {
            return min;
        }
        return value - max * Math.floor((value - min) / max);
    };
    GameMath.prototype.clamp = /**
    * force a value within the boundaries of two values
    *
    * if max < min, min is returned
    */
    function (input, max, min) {
        if (typeof min === "undefined") { min = 0; }
        return Math.max(min, Math.min(max, input));
    };
    GameMath.prototype.snapTo = /**
    * Snap a value to nearest grid slice, using rounding.
    *
    * example if you have an interval gap of 5 and a position of 12... you will snap to 10. Where as 14 will snap to 15
    *
    * @param input - the value to snap
    * @param gap - the interval gap of the grid
    * @param start - optional starting offset for gap
    */
    function (input, gap, start) {
        if (typeof start === "undefined") { start = 0; }
        if(gap == 0) {
            return input;
        }
        input -= start;
        input = gap * Math.round(input / gap);
        return start + input;
    };
    GameMath.prototype.snapToFloor = /**
    * Snap a value to nearest grid slice, using floor.
    *
    * example if you have an interval gap of 5 and a position of 12... you will snap to 10. As will 14 snap to 10... but 16 will snap to 15
    *
    * @param input - the value to snap
    * @param gap - the interval gap of the grid
    * @param start - optional starting offset for gap
    */
    function (input, gap, start) {
        if (typeof start === "undefined") { start = 0; }
        if(gap == 0) {
            return input;
        }
        input -= start;
        input = gap * Math.floor(input / gap);
        return start + input;
    };
    GameMath.prototype.snapToCeil = /**
    * Snap a value to nearest grid slice, using ceil.
    *
    * example if you have an interval gap of 5 and a position of 12... you will snap to 15. As will 14 will snap to 15... but 16 will snap to 20
    *
    * @param input - the value to snap
    * @param gap - the interval gap of the grid
    * @param start - optional starting offset for gap
    */
    function (input, gap, start) {
        if (typeof start === "undefined") { start = 0; }
        if(gap == 0) {
            return input;
        }
        input -= start;
        input = gap * Math.ceil(input / gap);
        return start + input;
    };
    GameMath.prototype.snapToInArray = /**
    * Snaps a value to the nearest value in an array.
    */
    function (input, arr, sort) {
        if (typeof sort === "undefined") { sort = true; }
        if(sort) {
            arr.sort();
        }
        if(input < arr[0]) {
            return arr[0];
        }
        var i = 1;
        while(arr[i] < input) {
            i++;
        }
        var low = arr[i - 1];
        var high = (i < arr.length) ? arr[i] : Number.POSITIVE_INFINITY;
        return ((high - input) <= (input - low)) ? high : low;
    };
    GameMath.prototype.roundTo = /**
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
    function (value, place, base) {
        if (typeof place === "undefined") { place = 0; }
        if (typeof base === "undefined") { base = 10; }
        var p = Math.pow(base, -place);
        return Math.round(value * p) / p;
    };
    GameMath.prototype.floorTo = function (value, place, base) {
        if (typeof place === "undefined") { place = 0; }
        if (typeof base === "undefined") { base = 10; }
        var p = Math.pow(base, -place);
        return Math.floor(value * p) / p;
    };
    GameMath.prototype.ceilTo = function (value, place, base) {
        if (typeof place === "undefined") { place = 0; }
        if (typeof base === "undefined") { base = 10; }
        var p = Math.pow(base, -place);
        return Math.ceil(value * p) / p;
    };
    GameMath.prototype.interpolateFloat = /**
    * a one dimensional linear interpolation of a value.
    */
    function (a, b, weight) {
        return (b - a) * weight + a;
    };
    GameMath.prototype.radiansToDegrees = /**
    * convert radians to degrees
    */
    function (angle) {
        return angle * GameMath.RAD_TO_DEG;
    };
    GameMath.prototype.degreesToRadians = /**
    * convert degrees to radians
    */
    function (angle) {
        return angle * GameMath.DEG_TO_RAD;
    };
    GameMath.prototype.angleBetween = /**
    * Find the angle of a segment from (x1, y1) -> (x2, y2 )
    */
    function (x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    };
    GameMath.prototype.normalizeAngle = /**
    * set an angle with in the bounds of -PI to PI
    */
    function (angle, radians) {
        if (typeof radians === "undefined") { radians = true; }
        var rd = (radians) ? GameMath.PI : 180;
        return this.wrap(angle, rd, -rd);
    };
    GameMath.prototype.nearestAngleBetween = /**
    * closest angle between two angles from a1 to a2
    * absolute value the return for exact angle
    */
    function (a1, a2, radians) {
        if (typeof radians === "undefined") { radians = true; }
        var rd = (radians) ? GameMath.PI : 180;
        a1 = this.normalizeAngle(a1, radians);
        a2 = this.normalizeAngle(a2, radians);
        if(a1 < -rd / 2 && a2 > rd / 2) {
            a1 += rd * 2;
        }
        if(a2 < -rd / 2 && a1 > rd / 2) {
            a2 += rd * 2;
        }
        return a2 - a1;
    };
    GameMath.prototype.normalizeAngleToAnother = /**
    * normalizes independent and then sets dep to the nearest value respective to independent
    *
    * for instance if dep=-170 and ind=170 then 190 will be returned as an alternative to -170
    */
    function (dep, ind, radians) {
        if (typeof radians === "undefined") { radians = true; }
        return ind + this.nearestAngleBetween(ind, dep, radians);
    };
    GameMath.prototype.normalizeAngleAfterAnother = /**
    * normalize independent and dependent and then set dependent to an angle relative to 'after/clockwise' independent
    *
    * for instance dep=-170 and ind=170, then 190 will be reutrned as alternative to -170
    */
    function (dep, ind, radians) {
        if (typeof radians === "undefined") { radians = true; }
        dep = this.normalizeAngle(dep - ind, radians);
        return ind + dep;
    };
    GameMath.prototype.normalizeAngleBeforeAnother = /**
    * normalizes indendent and dependent and then sets dependent to an angle relative to 'before/counterclockwise' independent
    *
    * for instance dep = 190 and ind = 170, then -170 will be returned as an alternative to 190
    */
    function (dep, ind, radians) {
        if (typeof radians === "undefined") { radians = true; }
        dep = this.normalizeAngle(ind - dep, radians);
        return ind - dep;
    };
    GameMath.prototype.interpolateAngles = /**
    * interpolate across the shortest arc between two angles
    */
    function (a1, a2, weight, radians, ease) {
        if (typeof radians === "undefined") { radians = true; }
        if (typeof ease === "undefined") { ease = null; }
        a1 = this.normalizeAngle(a1, radians);
        a2 = this.normalizeAngleToAnother(a2, a1, radians);
        return (typeof ease === 'function') ? ease(weight, a1, a2 - a1, 1) : this.interpolateFloat(a1, a2, weight);
    };
    GameMath.prototype.logBaseOf = /**
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
    function (value, base) {
        return Math.log(value) / Math.log(base);
    };
    GameMath.prototype.GCD = /**
    * Greatest Common Denominator using Euclid's algorithm
    */
    function (m, n) {
        var r;
        //make sure positive, GCD is always positive
        m = Math.abs(m);
        n = Math.abs(n);
        //m must be >= n
        if(m < n) {
            r = m;
            m = n;
            n = r;
        }
        //now start loop
        while(true) {
            r = m % n;
            if(!r) {
                return n;
            }
            m = n;
            n = r;
        }
        return 1;
    };
    GameMath.prototype.LCM = /**
    * Lowest Common Multiple
    */
    function (m, n) {
        return (m * n) / this.GCD(m, n);
    };
    GameMath.prototype.factorial = /**
    * Factorial - N!
    *
    * simple product series
    *
    * by definition:
    * 0! == 1
    */
    function (value) {
        if(value == 0) {
            return 1;
        }
        var res = value;
        while(--value) {
            res *= value;
        }
        return res;
    };
    GameMath.prototype.gammaFunction = /**
    * gamma function
    *
    * defined: gamma(N) == (N - 1)!
    */
    function (value) {
        return this.factorial(value - 1);
    };
    GameMath.prototype.fallingFactorial = /**
    * falling factorial
    *
    * defined: (N)! / (N - x)!
    *
    * written subscript: (N)x OR (base)exp
    */
    function (base, exp) {
        return this.factorial(base) / this.factorial(base - exp);
    };
    GameMath.prototype.risingFactorial = /**
    * rising factorial
    *
    * defined: (N + x - 1)! / (N - 1)!
    *
    * written superscript N^(x) OR base^(exp)
    */
    function (base, exp) {
        //expanded from gammaFunction for speed
        return this.factorial(base + exp - 1) / this.factorial(base - 1);
    };
    GameMath.prototype.binCoef = /**
    * binomial coefficient
    *
    * defined: N! / (k!(N-k)!)
    * reduced: N! / (N-k)! == (N)k (fallingfactorial)
    * reduced: (N)k / k!
    */
    function (n, k) {
        return this.fallingFactorial(n, k) / this.factorial(k);
    };
    GameMath.prototype.risingBinCoef = /**
    * rising binomial coefficient
    *
    * as one can notice in the analysis of binCoef(...) that
    * binCoef is the (N)k divided by k!. Similarly rising binCoef
    * is merely N^(k) / k!
    */
    function (n, k) {
        return this.risingFactorial(n, k) / this.factorial(k);
    };
    GameMath.prototype.chanceRoll = /**
    * Generate a random boolean result based on the chance value
    * <p>
    * Returns true or false based on the chance value (default 50%). For example if you wanted a player to have a 30% chance
    * of getting a bonus, call chanceRoll(30) - true means the chance passed, false means it failed.
    * </p>
    * @param chance The chance of receiving the value. A number between 0 and 100 (effectively 0% to 100%)
    * @return true if the roll passed, or false
    */
    function (chance) {
        if (typeof chance === "undefined") { chance = 50; }
        if(chance <= 0) {
            return false;
        } else if(chance >= 100) {
            return true;
        } else {
            if(Math.random() * 100 >= chance) {
                return false;
            } else {
                return true;
            }
        }
    };
    GameMath.prototype.maxAdd = /**
    * Adds the given amount to the value, but never lets the value go over the specified maximum
    *
    * @param value The value to add the amount to
    * @param amount The amount to add to the value
    * @param max The maximum the value is allowed to be
    * @return The new value
    */
    function (value, amount, max) {
        value += amount;
        if(value > max) {
            value = max;
        }
        return value;
    };
    GameMath.prototype.minSub = /**
    * Subtracts the given amount from the value, but never lets the value go below the specified minimum
    *
    * @param value The base value
    * @param amount The amount to subtract from the base value
    * @param min The minimum the value is allowed to be
    * @return The new value
    */
    function (value, amount, min) {
        value -= amount;
        if(value < min) {
            value = min;
        }
        return value;
    };
    GameMath.prototype.wrapValue = /**
    * Adds value to amount and ensures that the result always stays between 0 and max, by wrapping the value around.
    * <p>Values must be positive integers, and are passed through Math.abs</p>
    *
    * @param value The value to add the amount to
    * @param amount The amount to add to the value
    * @param max The maximum the value is allowed to be
    * @return The wrapped value
    */
    function (value, amount, max) {
        var diff;
        value = Math.abs(value);
        amount = Math.abs(amount);
        max = Math.abs(max);
        diff = (value + amount) % max;
        return diff;
    };
    GameMath.prototype.randomSign = /**
    * Randomly returns either a 1 or -1
    *
    * @return	1 or -1
    */
    function () {
        return (Math.random() > 0.5) ? 1 : -1;
    };
    GameMath.prototype.isOdd = /**
    * Returns true if the number given is odd.
    *
    * @param	n	The number to check
    *
    * @return	True if the given number is odd. False if the given number is even.
    */
    function (n) {
        if(n & 1) {
            return true;
        } else {
            return false;
        }
    };
    GameMath.prototype.isEven = /**
    * Returns true if the number given is even.
    *
    * @param	n	The number to check
    *
    * @return	True if the given number is even. False if the given number is odd.
    */
    function (n) {
        if(n & 1) {
            return false;
        } else {
            return true;
        }
    };
    GameMath.prototype.wrapAngle = /**
    * Keeps an angle value between -180 and +180<br>
    * Should be called whenever the angle is updated on the Sprite to stop it from going insane.
    *
    * @param	angle	The angle value to check
    *
    * @return	The new angle value, returns the same as the input angle if it was within bounds
    */
    function (angle) {
        var result = angle;
        //  Nothing needs to change
        if(angle >= -180 && angle <= 180) {
            return angle;
        }
        //  Else normalise it to -180, 180
        result = (angle + 180) % 360;
        if(result < 0) {
            result += 360;
        }
        return result - 180;
    };
    GameMath.prototype.angleLimit = /**
    * Keeps an angle value between the given min and max values
    *
    * @param	angle	The angle value to check. Must be between -180 and +180
    * @param	min		The minimum angle that is allowed (must be -180 or greater)
    * @param	max		The maximum angle that is allowed (must be 180 or less)
    *
    * @return	The new angle value, returns the same as the input angle if it was within bounds
    */
    function (angle, min, max) {
        var result = angle;
        if(angle > max) {
            result = max;
        } else if(angle < min) {
            result = min;
        }
        return result;
    };
    GameMath.prototype.linearInterpolation = /**
    * @method linear
    * @param {Any} v
    * @param {Any} k
    * @static
    */
    function (v, k) {
        var m = v.length - 1;
        var f = m * k;
        var i = Math.floor(f);
        if(k < 0) {
            return this.linear(v[0], v[1], f);
        }
        if(k > 1) {
            return this.linear(v[m], v[m - 1], m - f);
        }
        return this.linear(v[i], v[i + 1 > m ? m : i + 1], f - i);
    };
    GameMath.prototype.bezierInterpolation = /**
    * @method Bezier
    * @param {Any} v
    * @param {Any} k
    * @static
    */
    function (v, k) {
        var b = 0;
        var n = v.length - 1;
        for(var i = 0; i <= n; i++) {
            b += Math.pow(1 - k, n - i) * Math.pow(k, i) * v[i] * this.bernstein(n, i);
        }
        return b;
    };
    GameMath.prototype.catmullRomInterpolation = /**
    * @method CatmullRom
    * @param {Any} v
    * @param {Any} k
    * @static
    */
    function (v, k) {
        var m = v.length - 1;
        var f = m * k;
        var i = Math.floor(f);
        if(v[0] === v[m]) {
            if(k < 0) {
                i = Math.floor(f = m * (1 + k));
            }
            return this.catmullRom(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);
        } else {
            if(k < 0) {
                return v[0] - (this.catmullRom(v[0], v[0], v[1], v[1], -f) - v[0]);
            }
            if(k > 1) {
                return v[m] - (this.catmullRom(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);
            }
            return this.catmullRom(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);
        }
    };
    GameMath.prototype.linear = /**
    * @method Linear
    * @param {Any} p0
    * @param {Any} p1
    * @param {Any} t
    * @static
    */
    function (p0, p1, t) {
        return (p1 - p0) * t + p0;
    };
    GameMath.prototype.bernstein = /**
    * @method Bernstein
    * @param {Any} n
    * @param {Any} i
    * @static
    */
    function (n, i) {
        return this.factorial(n) / this.factorial(i) / this.factorial(n - i);
    };
    GameMath.prototype.catmullRom = /**
    * @method CatmullRom
    * @param {Any} p0
    * @param {Any} p1
    * @param {Any} p2
    * @param {Any} p3
    * @param {Any} t
    * @static
    */
    function (p0, p1, p2, p3, t) {
        var v0 = (p2 - p0) * 0.5, v1 = (p3 - p1) * 0.5, t2 = t * t, t3 = t * t2;
        return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
    };
    GameMath.prototype.difference = function (a, b) {
        return Math.abs(a - b);
    };
    GameMath.prototype.computeVelocity = /**
    * A tween-like function that takes a starting velocity
    * and some other factors and returns an altered velocity.
    *
    * @param	Velocity		Any component of velocity (e.g. 20).
    * @param	Acceleration	Rate at which the velocity is changing.
    * @param	Drag			Really kind of a deceleration, this is how much the velocity changes if Acceleration is not set.
    * @param	Max				An absolute value cap for the velocity.
    *
    * @return	The altered Velocity value.
    */
    function (Velocity, Acceleration, Drag, Max) {
        if (typeof Acceleration === "undefined") { Acceleration = 0; }
        if (typeof Drag === "undefined") { Drag = 0; }
        if (typeof Max === "undefined") { Max = 10000; }
        if(Acceleration !== 0) {
            Velocity += Acceleration * this._game.time.elapsed;
        } else if(Drag !== 0) {
            var drag = Drag * this._game.time.elapsed;
            if(Velocity - drag > 0) {
                Velocity = Velocity - drag;
            } else if(Velocity + drag < 0) {
                Velocity += drag;
            } else {
                Velocity = 0;
            }
        }
        if((Velocity != 0) && (Max != 10000)) {
            if(Velocity > Max) {
                Velocity = Max;
            } else if(Velocity < -Max) {
                Velocity = -Max;
            }
        }
        return Velocity;
    };
    GameMath.prototype.velocityFromAngle = /**
    * Given the angle and speed calculate the velocity and return it as a Point
    *
    * @param	angle	The angle (in degrees) calculated in clockwise positive direction (down = 90 degrees positive, right = 0 degrees positive, up = 90 degrees negative)
    * @param	speed	The speed it will move, in pixels per second sq
    *
    * @return	A Point where Point.x contains the velocity x value and Point.y contains the velocity y value
    */
    function (angle, speed) {
        var a = this.degreesToRadians(angle);
        return new Point((Math.cos(a) * speed), (Math.sin(a) * speed));
    };
    GameMath.prototype.random = /**
    * Generates a random number.  Deterministic, meaning safe
    * to use if you want to record replays in random environments.
    *
    * @return	A <code>Number</code> between 0 and 1.
    */
    function () {
        return this.globalSeed = this.srand(this.globalSeed);
    };
    GameMath.prototype.srand = /**
    * Generates a random number based on the seed provided.
    *
    * @param	Seed	A number between 0 and 1, used to generate a predictable random number (very optional).
    *
    * @return	A <code>Number</code> between 0 and 1.
    */
    function (Seed) {
        return ((69621 * (Seed * 0x7FFFFFFF)) % 0x7FFFFFFF) / 0x7FFFFFFF;
    };
    GameMath.prototype.getRandom = /**
    * Fetch a random entry from the given array.
    * Will return null if random selection is missing, or array has no entries.
    * <code>FlxG.getRandom()</code> is deterministic and safe for use with replays/recordings.
    * HOWEVER, <code>FlxU.getRandom()</code> is NOT deterministic and unsafe for use with replays/recordings.
    *
    * @param	Objects		An array of objects.
    * @param	StartIndex	Optional offset off the front of the array. Default value is 0, or the beginning of the array.
    * @param	Length		Optional restriction on the number of values you want to randomly select from.
    *
    * @return	The random object that was selected.
    */
    function (Objects, StartIndex, Length) {
        if (typeof StartIndex === "undefined") { StartIndex = 0; }
        if (typeof Length === "undefined") { Length = 0; }
        if(Objects != null) {
            var l = Length;
            if((l == 0) || (l > Objects.length - StartIndex)) {
                l = Objects.length - StartIndex;
            }
            if(l > 0) {
                return Objects[StartIndex + Math.floor(Math.random() * l)];
            }
        }
        return null;
    };
    GameMath.prototype.floor = /**
    * Round down to the next whole number. E.g. floor(1.7) == 1, and floor(-2.7) == -2.
    *
    * @param	Value	Any number.
    *
    * @return	The rounded value of that number.
    */
    function (Value) {
        var n = Value | 0;
        return (Value > 0) ? (n) : ((n != Value) ? (n - 1) : (n));
    };
    GameMath.prototype.ceil = /**
    * Round up to the next whole number.  E.g. ceil(1.3) == 2, and ceil(-2.3) == -3.
    *
    * @param	Value	Any number.
    *
    * @return	The rounded value of that number.
    */
    function (Value) {
        var n = Value | 0;
        return (Value > 0) ? ((n != Value) ? (n + 1) : (n)) : (n);
    };
    return GameMath;
})();
/**
*	Point
*
*	@desc 		The Point object represents a location in a two-dimensional coordinate system, where x represents the horizontal axis and y represents the vertical axis.
*
*	@version 	1.2 - 27th February 2013
*	@author 	Richard Davey
*  @todo       polar, interpolate
*/
var Point = (function () {
    /**
    * Creates a new point. If you pass no parameters to this method, a point is created at (0,0).
    * @class Point
    * @constructor
    * @param {Number} x One-liner. Default is ?.
    * @param {Number} y One-liner. Default is ?.
    **/
    function Point(x, y) {
        if (typeof x === "undefined") { x = 0; }
        if (typeof y === "undefined") { y = 0; }
        this.setTo(x, y);
    }
    Point.prototype.add = /**
    * Adds the coordinates of another point to the coordinates of this point to create a new point.
    * @method add
    * @param {Point} point - The point to be added.
    * @return {Point} The new Point object.
    **/
    function (toAdd, output) {
        if (typeof output === "undefined") { output = new Point(); }
        return output.setTo(this.x + toAdd.x, this.y + toAdd.y);
    };
    Point.prototype.addTo = /**
    * Adds the given values to the coordinates of this point and returns it
    * @method addTo
    * @param {Number} x - The amount to add to the x value of the point
    * @param {Number} y - The amount to add to the x value of the point
    * @return {Point} This Point object.
    **/
    function (x, y) {
        if (typeof x === "undefined") { x = 0; }
        if (typeof y === "undefined") { y = 0; }
        return this.setTo(this.x + x, this.y + y);
    };
    Point.prototype.subtractFrom = /**
    * Adds the given values to the coordinates of this point and returns it
    * @method addTo
    * @param {Number} x - The amount to add to the x value of the point
    * @param {Number} y - The amount to add to the x value of the point
    * @return {Point} This Point object.
    **/
    function (x, y) {
        if (typeof x === "undefined") { x = 0; }
        if (typeof y === "undefined") { y = 0; }
        return this.setTo(this.x - x, this.y - y);
    };
    Point.prototype.invert = /**
    * Inverts the x and y values of this point
    * @method invert
    * @return {Point} This Point object.
    **/
    function () {
        return this.setTo(this.y, this.x);
    };
    Point.prototype.clamp = /**
    * Clamps this Point object to be between the given min and max
    * @method clamp
    * @param {number} The minimum value to clamp this Point to
    * @param {number} The maximum value to clamp this Point to
    * @return {Point} This Point object.
    **/
    function (min, max) {
        this.clampX(min, max);
        this.clampY(min, max);
        return this;
    };
    Point.prototype.clampX = /**
    * Clamps the x value of this Point object to be between the given min and max
    * @method clampX
    * @param {number} The minimum value to clamp this Point to
    * @param {number} The maximum value to clamp this Point to
    * @return {Point} This Point object.
    **/
    function (min, max) {
        this.x = Math.max(Math.min(this.x, max), min);
        return this;
    };
    Point.prototype.clampY = /**
    * Clamps the y value of this Point object to be between the given min and max
    * @method clampY
    * @param {number} The minimum value to clamp this Point to
    * @param {number} The maximum value to clamp this Point to
    * @return {Point} This Point object.
    **/
    function (min, max) {
        this.x = Math.max(Math.min(this.x, max), min);
        this.y = Math.max(Math.min(this.y, max), min);
        return this;
    };
    Point.prototype.clone = /**
    * Creates a copy of this Point.
    * @method clone
    * @param {Point} output Optional Point object. If given the values will be set into this object, otherwise a brand new Point object will be created and returned.
    * @return {Point} The new Point object.
    **/
    function (output) {
        if (typeof output === "undefined") { output = new Point(); }
        return output.setTo(this.x, this.y);
    };
    Point.prototype.copyFrom = /**
    * Copies the point data from the source Point object into this Point object.
    * @method copyFrom
    * @param {Point} source - The point to copy from.
    * @return {Point} This Point object. Useful for chaining method calls.
    **/
    function (source) {
        return this.setTo(source.x, source.y);
    };
    Point.prototype.copyTo = /**
    * Copies the point data from this Point object to the given target Point object.
    * @method copyTo
    * @param {Point} target - The point to copy to.
    * @return {Point} The target Point object.
    **/
    function (target) {
        return target.setTo(this.x, this.y);
    };
    Point.prototype.distanceTo = /**
    * Returns the distance from this Point object to the given Point object.
    * @method distanceFrom
    * @param {Point} target - The destination Point object.
    * @param {Boolean} round - Round the distance to the nearest integer (default false)
    * @return {Number} The distance between this Point object and the destination Point object.
    **/
    function (target, round) {
        if (typeof round === "undefined") { round = false; }
        var dx = this.x - target.x;
        var dy = this.y - target.y;
        if(round === true) {
            return Math.round(Math.sqrt(dx * dx + dy * dy));
        } else {
            return Math.sqrt(dx * dx + dy * dy);
        }
    };
    Point.distanceBetween = /**
    * Returns the distance between the two Point objects.
    * @method distanceBetween
    * @param {Point} pointA - The first Point object.
    * @param {Point} pointB - The second Point object.
    * @param {Boolean} round - Round the distance to the nearest integer (default false)
    * @return {Number} The distance between the two Point objects.
    **/
    function distanceBetween(pointA, pointB, round) {
        if (typeof round === "undefined") { round = false; }
        var dx = pointA.x - pointB.x;
        var dy = pointA.y - pointB.y;
        if(round === true) {
            return Math.round(Math.sqrt(dx * dx + dy * dy));
        } else {
            return Math.sqrt(dx * dx + dy * dy);
        }
    };
    Point.prototype.distanceCompare = /**
    * Returns true if the distance between this point and a target point is greater than or equal a specified distance.
    * This avoids using a costly square root operation
    * @method distanceCompare
    * @param {Point} target - The Point object to use for comparison.
    * @param {Number} distance - The distance to use for comparison.
    * @return {Boolena} True if distance is >= specified distance.
    **/
    function (target, distance) {
        if(this.distanceTo(target) >= distance) {
            return true;
        } else {
            return false;
        }
    };
    Point.prototype.equals = /**
    * Determines whether this Point object and the given point object are equal. They are equal if they have the same x and y values.
    * @method equals
    * @param {Point} point - The point to compare against.
    * @return {Boolean} A value of true if the object is equal to this Point object; false if it is not equal.
    **/
    function (toCompare) {
        if(this.x === toCompare.x && this.y === toCompare.y) {
            return true;
        } else {
            return false;
        }
    };
    Point.prototype.interpolate = /**
    * Determines a point between two specified points. The parameter f determines where the new interpolated point is located relative to the two end points specified by parameters pt1 and pt2.
    * The closer the value of the parameter f is to 1.0, the closer the interpolated point is to the first point (parameter pt1). The closer the value of the parameter f is to 0, the closer the interpolated point is to the second point (parameter pt2).
    * @method interpolate
    * @param {Point} pointA - The first Point object.
    * @param {Point} pointB - The second Point object.
    * @param {Number} f - The level of interpolation between the two points. Indicates where the new point will be, along the line between pt1 and pt2. If f=1, pt1 is returned; if f=0, pt2 is returned.
    * @return {Point} The new interpolated Point object.
    **/
    function (pointA, pointB, f) {
    };
    Point.prototype.offset = /**
    * Offsets the Point object by the specified amount. The value of dx is added to the original value of x to create the new x value.
    * The value of dy is added to the original value of y to create the new y value.
    * @method offset
    * @param {Number} dx - The amount by which to offset the horizontal coordinate, x.
    * @param {Number} dy - The amount by which to offset the vertical coordinate, y.
    * @return {Point} This Point object. Useful for chaining method calls.
    **/
    function (dx, dy) {
        this.x += dx;
        this.y += dy;
        return this;
    };
    Point.prototype.polar = /**
    * Converts a pair of polar coordinates to a Cartesian point coordinate.
    * @method polar
    * @param {Number} length - The length coordinate of the polar pair.
    * @param {Number} angle - The angle, in radians, of the polar pair.
    * @return {Point} The new Cartesian Point object.
    **/
    function (length, angle) {
    };
    Point.prototype.setTo = /**
    * Sets the x and y values of this Point object to the given coordinates.
    * @method set
    * @param {Number} x - The horizontal position of this point.
    * @param {Number} y - The vertical position of this point.
    * @return {Point} This Point object. Useful for chaining method calls.
    **/
    function (x, y) {
        this.x = x;
        this.y = y;
        return this;
    };
    Point.prototype.subtract = /**
    * Subtracts the coordinates of another point from the coordinates of this point to create a new point.
    * @method subtract
    * @param {Point} point - The point to be subtracted.
    * @param {Point} output Optional Point object. If given the values will be set into this object, otherwise a brand new Point object will be created and returned.
    * @return {Point} The new Point object.
    **/
    function (point, output) {
        if (typeof output === "undefined") { output = new Point(); }
        return output.setTo(this.x - point.x, this.y - point.y);
    };
    Point.prototype.toString = /**
    * Returns a string representation of this object.
    * @method toString
    * @return {string} a string representation of the instance.
    **/
    function () {
        return '[{Point (x=' + this.x + ' y=' + this.y + ')}]';
    };
    return Point;
})();
/// <reference path="Point.ts" />
/**
*	Rectangle
*
*	@desc 		A Rectangle object is an area defined by its position, as indicated by its top-left corner (x,y) and width and height.
*
*	@version 	1.2 - 15th October 2012
*	@author 	Richard Davey
*/
var Rectangle = (function () {
    /**
    * Creates a new Rectangle object with the top-left corner specified by the x and y parameters and with the specified width and height parameters. If you call this function without parameters, a rectangle with x, y, width, and height properties set to 0 is created.
    * @class Rectangle
    * @constructor
    * @param {Number} x The x coordinate of the top-left corner of the rectangle.
    * @param {Number} y The y coordinate of the top-left corner of the rectangle.
    * @param {Number} width The width of the rectangle in pixels.
    * @param {Number} height The height of the rectangle in pixels.
    * @return {Rectangle} This rectangle object
    **/
    function Rectangle(x, y, width, height) {
        if (typeof x === "undefined") { x = 0; }
        if (typeof y === "undefined") { y = 0; }
        if (typeof width === "undefined") { width = 0; }
        if (typeof height === "undefined") { height = 0; }
        /**
        * The x coordinate of the top-left corner of the rectangle
        * @property x
        * @type Number
        **/
        this.x = 0;
        /**
        * The y coordinate of the top-left corner of the rectangle
        * @property y
        * @type Number
        **/
        this.y = 0;
        /**
        * The width of the rectangle in pixels
        * @property width
        * @type Number
        **/
        this.width = 0;
        /**
        * The height of the rectangle in pixels
        * @property height
        * @type Number
        **/
        this.height = 0;
        this.setTo(x, y, width, height);
    }
    Object.defineProperty(Rectangle.prototype, "halfWidth", {
        get: function () {
            return Math.round(this.width / 2);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "halfHeight", {
        get: function () {
            return Math.round(this.height / 2);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "bottom", {
        get: /**
        * The sum of the y and height properties. Changing the bottom property of a Rectangle object has no effect on the x, y and width properties, but does change the height property.
        * @method bottom
        * @return {Number}
        **/
        function () {
            return this.y + this.height;
        },
        set: /**
        * The sum of the y and height properties. Changing the bottom property of a Rectangle object has no effect on the x, y and width properties, but does change the height property.
        * @method bottom
        * @param {Number} value
        **/
        function (value) {
            if(value < this.y) {
                this.height = 0;
            } else {
                this.height = this.y + value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "bottomRight", {
        get: /**
        * Returns a Point containing the location of the Rectangle's bottom-right corner, determined by the values of the right and bottom properties.
        * @method bottomRight
        * @return {Point}
        **/
        function () {
            return new Point(this.right, this.bottom);
        },
        set: /**
        * Sets the bottom-right corner of this Rectangle, determined by the values of the given Point object.
        * @method bottomRight
        * @param {Point} value
        **/
        function (value) {
            this.right = value.x;
            this.bottom = value.y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "left", {
        get: /**
        * The x coordinate of the top-left corner of the rectangle. Changing the left property of a Rectangle object has no effect on the y and height properties. However it does affect the width property, whereas changing the x value does not affect the width property.
        * @method left
        * @ return {number}
        **/
        function () {
            return this.x;
        },
        set: /**
        * The x coordinate of the top-left corner of the rectangle. Changing the left property of a Rectangle object has no effect on the y and height properties. However it does affect the width property, whereas changing the x value does not affect the width property.
        * @method left
        * @param {Number} value
        **/
        function (value) {
            var diff = this.x - value;
            if(this.width + diff < 0) {
                this.width = 0;
                this.x = value;
            } else {
                this.width += diff;
                this.x = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "right", {
        get: /**
        * The sum of the x and width properties. Changing the right property of a Rectangle object has no effect on the x, y and height properties. However it does affect the width property.
        * @method right
        * @return {Number}
        **/
        function () {
            return this.x + this.width;
        },
        set: /**
        * The sum of the x and width properties. Changing the right property of a Rectangle object has no effect on the x, y and height properties. However it does affect the width property.
        * @method right
        * @param {Number} value
        **/
        function (value) {
            if(value < this.x) {
                this.width = 0;
                return this.x;
            } else {
                this.width = (value - this.x);
            }
        },
        enumerable: true,
        configurable: true
    });
    Rectangle.prototype.size = /**
    * The size of the Rectangle object, expressed as a Point object with the values of the width and height properties.
    * @method size
    * @param {Point} output Optional Point object. If given the values will be set into the object, otherwise a brand new Point object will be created and returned.
    * @return {Point} The size of the Rectangle object
    **/
    function (output) {
        if (typeof output === "undefined") { output = new Point(); }
        return output.setTo(this.width, this.height);
    };
    Object.defineProperty(Rectangle.prototype, "volume", {
        get: /**
        * The volume of the Rectangle object in pixels, derived from width * height
        * @method volume
        * @return {Number}
        **/
        function () {
            return this.width * this.height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "perimeter", {
        get: /**
        * The perimeter size of the Rectangle object in pixels. This is the sum of all 4 sides.
        * @method perimeter
        * @return {Number}
        **/
        function () {
            return (this.width * 2) + (this.height * 2);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "top", {
        get: /**
        * The y coordinate of the top-left corner of the rectangle. Changing the top property of a Rectangle object has no effect on the x and width properties. However it does affect the height property, whereas changing the y value does not affect the height property.
        * @method top
        * @return {Number}
        **/
        function () {
            return this.y;
        },
        set: /**
        * The y coordinate of the top-left corner of the rectangle. Changing the top property of a Rectangle object has no effect on the x and width properties. However it does affect the height property, whereas changing the y value does not affect the height property.
        * @method top
        * @param {Number} value
        **/
        function (value) {
            var diff = this.y - value;
            if(this.height + diff < 0) {
                this.height = 0;
                this.y = value;
            } else {
                this.height += diff;
                this.y = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "topLeft", {
        get: /**
        * The location of the Rectangle object's top-left corner, determined by the x and y coordinates of the point.
        * @method topLeft
        * @return {Point}
        **/
        function () {
            return new Point(this.x, this.y);
        },
        set: /**
        * The location of the Rectangle object's top-left corner, determined by the x and y coordinates of the point.
        * @method topLeft
        * @param {Point} value
        **/
        function (value) {
            this.x = value.x;
            this.y = value.y;
        },
        enumerable: true,
        configurable: true
    });
    Rectangle.prototype.clone = /**
    * Returns a new Rectangle object with the same values for the x, y, width, and height properties as the original Rectangle object.
    * @method clone
    * @param {Rectangle} output Optional Rectangle object. If given the values will be set into the object, otherwise a brand new Rectangle object will be created and returned.
    * @return {Rectangle}
    **/
    function (output) {
        if (typeof output === "undefined") { output = new Rectangle(); }
        return output.setTo(this.x, this.y, this.width, this.height);
    };
    Rectangle.prototype.contains = /**
    * Determines whether the specified coordinates are contained within the region defined by this Rectangle object.
    * @method contains
    * @param {Number} x The x coordinate of the point to test.
    * @param {Number} y The y coordinate of the point to test.
    * @return {Boolean} A value of true if the Rectangle object contains the specified point; otherwise false.
    **/
    function (x, y) {
        if(x >= this.x && x <= this.right && y >= this.y && y <= this.bottom) {
            return true;
        }
        return false;
    };
    Rectangle.prototype.containsPoint = /**
    * Determines whether the specified point is contained within the rectangular region defined by this Rectangle object. This method is similar to the Rectangle.contains() method, except that it takes a Point object as a parameter.
    * @method containsPoint
    * @param {Point} point The point object being checked. Can be Point or any object with .x and .y values.
    * @return {Boolean} A value of true if the Rectangle object contains the specified point; otherwise false.
    **/
    function (point) {
        return this.contains(point.x, point.y);
    };
    Rectangle.prototype.containsRect = /**
    * Determines whether the Rectangle object specified by the rect parameter is contained within this Rectangle object. A Rectangle object is said to contain another if the second Rectangle object falls entirely within the boundaries of the first.
    * @method containsRect
    * @param {Rectangle} rect The rectangle object being checked.
    * @return {Boolean} A value of true if the Rectangle object contains the specified point; otherwise false.
    **/
    function (rect) {
        //	If the given rect has a larger volume than this one then it can never contain it
        if(rect.volume > this.volume) {
            return false;
        }
        if(rect.x >= this.x && rect.y >= this.y && rect.right <= this.right && rect.bottom <= this.bottom) {
            return true;
        }
        return false;
    };
    Rectangle.prototype.copyFrom = /**
    * Copies all of rectangle data from the source Rectangle object into the calling Rectangle object.
    * @method copyFrom
    * @param {Rectangle} rect The source rectangle object to copy from
    * @return {Rectangle} This rectangle object
    **/
    function (source) {
        return this.setTo(source.x, source.y, source.width, source.height);
    };
    Rectangle.prototype.copyTo = /**
    * Copies all the rectangle data from this Rectangle object into the destination Rectangle object.
    * @method copyTo
    * @param {Rectangle} rect The destination rectangle object to copy in to
    * @return {Rectangle} The destination rectangle object
    **/
    function (target) {
        return target.copyFrom(this);
    };
    Rectangle.prototype.equals = /**
    * Determines whether the object specified in the toCompare parameter is equal to this Rectangle object. This method compares the x, y, width, and height properties of an object against the same properties of this Rectangle object.
    * @method equals
    * @param {Rectangle} toCompare The rectangle to compare to this Rectangle object.
    * @return {Boolean} A value of true if the object has exactly the same values for the x, y, width, and height properties as this Rectangle object; otherwise false.
    **/
    function (toCompare) {
        if(this.x === toCompare.x && this.y === toCompare.y && this.width === toCompare.width && this.height === toCompare.height) {
            return true;
        }
        return false;
    };
    Rectangle.prototype.inflate = /**
    * Increases the size of the Rectangle object by the specified amounts. The center point of the Rectangle object stays the same, and its size increases to the left and right by the dx value, and to the top and the bottom by the dy value.
    * @method inflate
    * @param {Number} dx The amount to be added to the left side of this Rectangle.
    * @param {Number} dy The amount to be added to the bottom side of this Rectangle.
    * @return {Rectangle} This Rectangle object.
    **/
    function (dx, dy) {
        if(!isNaN(dx) && !isNaN(dy)) {
            this.x -= dx;
            this.width += 2 * dx;
            this.y -= dy;
            this.height += 2 * dy;
        }
        return this;
    };
    Rectangle.prototype.inflatePoint = /**
    * Increases the size of the Rectangle object. This method is similar to the Rectangle.inflate() method except it takes a Point object as a parameter.
    * @method inflatePoint
    * @param {Point} point The x property of this Point object is used to increase the horizontal dimension of the Rectangle object. The y property is used to increase the vertical dimension of the Rectangle object.
    * @return {Rectangle} This Rectangle object.
    **/
    function (point) {
        return this.inflate(point.x, point.y);
    };
    Rectangle.prototype.intersection = /**
    * If the Rectangle object specified in the toIntersect parameter intersects with this Rectangle object, returns the area of intersection as a Rectangle object. If the rectangles do not intersect, this method returns an empty Rectangle object with its properties set to 0.
    * @method intersection
    * @param {Rectangle} toIntersect The Rectangle object to compare against to see if it intersects with this Rectangle object.
    * @param {Rectangle} output Optional Rectangle object. If given the intersection values will be set into this object, otherwise a brand new Rectangle object will be created and returned.
    * @return {Rectangle} A Rectangle object that equals the area of intersection. If the rectangles do not intersect, this method returns an empty Rectangle object; that is, a rectangle with its x, y, width, and height properties set to 0.
    **/
    function (toIntersect, output) {
        if (typeof output === "undefined") { output = new Rectangle(); }
        if(this.intersects(toIntersect) === true) {
            output.x = Math.max(toIntersect.x, this.x);
            output.y = Math.max(toIntersect.y, this.y);
            output.width = Math.min(toIntersect.right, this.right) - output.x;
            output.height = Math.min(toIntersect.bottom, this.bottom) - output.y;
        }
        return output;
    };
    Rectangle.prototype.intersects = /**
    * Determines whether the object specified in the toIntersect parameter intersects with this Rectangle object. This method checks the x, y, width, and height properties of the specified Rectangle object to see if it intersects with this Rectangle object.
    * @method intersects
    * @param {Rectangle} toIntersect The Rectangle object to compare against to see if it intersects with this Rectangle object.
    * @return {Boolean} A value of true if the specified object intersects with this Rectangle object; otherwise false.
    **/
    function (toIntersect) {
        if(toIntersect.x >= this.right) {
            return false;
        }
        if(toIntersect.right <= this.x) {
            return false;
        }
        if(toIntersect.bottom <= this.y) {
            return false;
        }
        if(toIntersect.y >= this.bottom) {
            return false;
        }
        return true;
    };
    Rectangle.prototype.overlap = /**
    * Checks for overlaps between this Rectangle and the given Rectangle. Returns an object with boolean values for each check.
    * @method overlap
    * @return {Boolean} true if the rectangles overlap, otherwise false
    **/
    function (rect) {
        return (rect.x + rect.width > this.x) && (rect.x < this.x + this.width) && (rect.y + rect.height > this.y) && (rect.y < this.y + this.height);
    };
    Object.defineProperty(Rectangle.prototype, "isEmpty", {
        get: /**
        * Determines whether or not this Rectangle object is empty.
        * @method isEmpty
        * @return {Boolean} A value of true if the Rectangle object's width or height is less than or equal to 0; otherwise false.
        **/
        function () {
            if(this.width < 1 || this.height < 1) {
                return true;
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Rectangle.prototype.offset = /**
    * Adjusts the location of the Rectangle object, as determined by its top-left corner, by the specified amounts.
    * @method offset
    * @param {Number} dx Moves the x value of the Rectangle object by this amount.
    * @param {Number} dy Moves the y value of the Rectangle object by this amount.
    * @return {Rectangle} This Rectangle object.
    **/
    function (dx, dy) {
        if(!isNaN(dx) && !isNaN(dy)) {
            this.x += dx;
            this.y += dy;
        }
        return this;
    };
    Rectangle.prototype.offsetPoint = /**
    * Adjusts the location of the Rectangle object using a Point object as a parameter. This method is similar to the Rectangle.offset() method, except that it takes a Point object as a parameter.
    * @method offsetPoint
    * @param {Point} point A Point object to use to offset this Rectangle object.
    * @return {Rectangle} This Rectangle object.
    **/
    function (point) {
        return this.offset(point.x, point.y);
    };
    Rectangle.prototype.setEmpty = /**
    * Sets all of the Rectangle object's properties to 0. A Rectangle object is empty if its width or height is less than or equal to 0.
    * @method setEmpty
    * @return {Rectangle} This rectangle object
    **/
    function () {
        return this.setTo(0, 0, 0, 0);
    };
    Rectangle.prototype.setTo = /**
    * Sets the members of Rectangle to the specified values.
    * @method setTo
    * @param {Number} x The x coordinate of the top-left corner of the rectangle.
    * @param {Number} y The y coordinate of the top-left corner of the rectangle.
    * @param {Number} width The width of the rectangle in pixels.
    * @param {Number} height The height of the rectangle in pixels.
    * @return {Rectangle} This rectangle object
    **/
    function (x, y, width, height) {
        if(!isNaN(x) && !isNaN(y) && !isNaN(width) && !isNaN(height)) {
            this.x = x;
            this.y = y;
            if(width > 0) {
                this.width = width;
            }
            if(height > 0) {
                this.height = height;
            }
        }
        return this;
    };
    Rectangle.prototype.union = /**
    * Adds two rectangles together to create a new Rectangle object, by filling in the horizontal and vertical space between the two rectangles.
    * @method union
    * @param {Rectangle} toUnion A Rectangle object to add to this Rectangle object.
    * @param {Rectangle} output Optional Rectangle object. If given the new values will be set into this object, otherwise a brand new Rectangle object will be created and returned.
    * @return {Rectangle} A Rectangle object that is the union of the two rectangles.
    **/
    function (toUnion, output) {
        if (typeof output === "undefined") { output = new Rectangle(); }
        return output.setTo(Math.min(toUnion.x, this.x), Math.min(toUnion.y, this.y), Math.max(toUnion.right, this.right), Math.max(toUnion.bottom, this.bottom));
    };
    Rectangle.prototype.toString = /**
    * Returns a string representation of this object.
    * @method toString
    * @return {string} a string representation of the instance.
    **/
    function () {
        return "[{Rectangle (x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + " empty=" + this.isEmpty + ")}]";
    };
    return Rectangle;
})();
/// <reference path="../Game.ts" />
/// <reference path="../GameMath.ts" />
/// <reference path="../Rectangle.ts" />
/// <reference path="../Point.ts" />
var Camera = (function () {
    /**
    * Instantiates a new camera at the specified location, with the specified size and zoom level.
    *
    * @param X			X location of the camera's display in pixels. Uses native, 1:1 resolution, ignores zoom.
    * @param Y			Y location of the camera's display in pixels. Uses native, 1:1 resolution, ignores zoom.
    * @param Width		The width of the camera display in pixels.
    * @param Height	The height of the camera display in pixels.
    * @param Zoom		The initial zoom level of the camera.  A zoom level of 2 will make all pixels display at 2x resolution.
    */
    function Camera(game, id, x, y, width, height) {
        this._clip = false;
        this._rotation = 0;
        this._target = null;
        this._sx = 0;
        this._sy = 0;
        this._fxFlashComplete = null;
        this._fxFlashDuration = 0;
        this._fxFlashAlpha = 0;
        this._fxFadeComplete = null;
        this._fxFadeDuration = 0;
        this._fxFadeAlpha = 0;
        this._fxShakeIntensity = 0;
        this._fxShakeDuration = 0;
        this._fxShakeComplete = null;
        this._fxShakeOffset = new Point(0, 0);
        this._fxShakeDirection = 0;
        this._fxShakePrevX = 0;
        this._fxShakePrevY = 0;
        this.scale = new Point(1, 1);
        this.scroll = new Point(0, 0);
        this.bounds = null;
        this.deadzone = null;
        //  Camera Border
        this.showBorder = false;
        this.borderColor = 'rgb(255,255,255)';
        //  Camera Background Color
        this.opaque = true;
        this._bgColor = 'rgb(0,0,0)';
        this._bgTextureRepeat = 'repeat';
        //  Camera Shadow
        this.showShadow = false;
        this.shadowColor = 'rgb(0,0,0)';
        this.shadowBlur = 10;
        this.shadowOffset = new Point(4, 4);
        this.visible = true;
        this.alpha = 1;
        this._game = game;
        this.ID = id;
        this._stageX = x;
        this._stageY = y;
        //  The view into the world canvas we wish to render
        this.worldView = new Rectangle(0, 0, width, height);
        this.checkClip();
    }
    Camera.STYLE_LOCKON = 0;
    Camera.STYLE_PLATFORMER = 1;
    Camera.STYLE_TOPDOWN = 2;
    Camera.STYLE_TOPDOWN_TIGHT = 3;
    Camera.SHAKE_BOTH_AXES = 0;
    Camera.SHAKE_HORIZONTAL_ONLY = 1;
    Camera.SHAKE_VERTICAL_ONLY = 2;
    Camera.prototype.flash = /**
    * The camera is filled with this color and returns to normal at the given duration.
    *
    * @param	Color		The color you want to use in 0xRRGGBB format, i.e. 0xffffff for white.
    * @param	Duration	How long it takes for the flash to fade.
    * @param	OnComplete	An optional function you want to run when the flash finishes. Set to null for no callback.
    * @param	Force		Force an already running flash effect to reset.
    */
    function (color, duration, onComplete, force) {
        if (typeof color === "undefined") { color = 0xffffff; }
        if (typeof duration === "undefined") { duration = 1; }
        if (typeof onComplete === "undefined") { onComplete = null; }
        if (typeof force === "undefined") { force = false; }
        if(force === false && this._fxFlashAlpha > 0) {
            //  You can't flash again unless you force it
            return;
        }
        if(duration <= 0) {
            duration = 1;
        }
        var red = color >> 16 & 0xFF;
        var green = color >> 8 & 0xFF;
        var blue = color & 0xFF;
        this._fxFlashColor = 'rgba(' + red + ',' + green + ',' + blue + ',';
        this._fxFlashDuration = duration;
        this._fxFlashAlpha = 1;
        this._fxFlashComplete = onComplete;
    };
    Camera.prototype.fade = /**
    * The camera is gradually filled with this color.
    *
    * @param	Color		The color you want to use in 0xRRGGBB format, i.e. 0xffffff for white.
    * @param	Duration	How long it takes for the flash to fade.
    * @param	OnComplete	An optional function you want to run when the flash finishes. Set to null for no callback.
    * @param	Force		Force an already running flash effect to reset.
    */
    function (color, duration, onComplete, force) {
        if (typeof color === "undefined") { color = 0x000000; }
        if (typeof duration === "undefined") { duration = 1; }
        if (typeof onComplete === "undefined") { onComplete = null; }
        if (typeof force === "undefined") { force = false; }
        if(force === false && this._fxFadeAlpha > 0) {
            //  You can't fade again unless you force it
            return;
        }
        if(duration <= 0) {
            duration = 1;
        }
        var red = color >> 16 & 0xFF;
        var green = color >> 8 & 0xFF;
        var blue = color & 0xFF;
        this._fxFadeColor = 'rgba(' + red + ',' + green + ',' + blue + ',';
        this._fxFadeDuration = duration;
        this._fxFadeAlpha = 0.01;
        this._fxFadeComplete = onComplete;
    };
    Camera.prototype.shake = /**
    * A simple screen-shake effect.
    *
    * @param	Intensity	Percentage of screen size representing the maximum distance that the screen can move while shaking.
    * @param	Duration	The length in seconds that the shaking effect should last.
    * @param	OnComplete	A function you want to run when the shake effect finishes.
    * @param	Force		Force the effect to reset (default = true, unlike flash() and fade()!).
    * @param	Direction	Whether to shake on both axes, just up and down, or just side to side (use class constants SHAKE_BOTH_AXES, SHAKE_VERTICAL_ONLY, or SHAKE_HORIZONTAL_ONLY).
    */
    function (intensity, duration, onComplete, force, direction) {
        if (typeof intensity === "undefined") { intensity = 0.05; }
        if (typeof duration === "undefined") { duration = 0.5; }
        if (typeof onComplete === "undefined") { onComplete = null; }
        if (typeof force === "undefined") { force = true; }
        if (typeof direction === "undefined") { direction = Camera.SHAKE_BOTH_AXES; }
        if(!force && ((this._fxShakeOffset.x != 0) || (this._fxShakeOffset.y != 0))) {
            return;
        }
        //  If a shake is not already running we need to store the offsets here
        if(this._fxShakeOffset.x == 0 && this._fxShakeOffset.y == 0) {
            this._fxShakePrevX = this._stageX;
            this._fxShakePrevY = this._stageY;
        }
        this._fxShakeIntensity = intensity;
        this._fxShakeDuration = duration;
        this._fxShakeComplete = onComplete;
        this._fxShakeDirection = direction;
        this._fxShakeOffset.setTo(0, 0);
    };
    Camera.prototype.stopFX = /**
    * Just turns off all the camera effects instantly.
    */
    function () {
        this._fxFlashAlpha = 0;
        this._fxFadeAlpha = 0;
        if(this._fxShakeDuration !== 0) {
            this._fxShakeDuration = 0;
            this._fxShakeOffset.setTo(0, 0);
            this._stageX = this._fxShakePrevX;
            this._stageY = this._fxShakePrevY;
        }
    };
    Camera.prototype.follow = function (target, style) {
        if (typeof style === "undefined") { style = Camera.STYLE_LOCKON; }
        this._target = target;
        var helper;
        switch(style) {
            case Camera.STYLE_PLATFORMER:
                var w = this.width / 8;
                var h = this.height / 3;
                this.deadzone = new Rectangle((this.width - w) / 2, (this.height - h) / 2 - h * 0.25, w, h);
                break;
            case Camera.STYLE_TOPDOWN:
                helper = Math.max(this.width, this.height) / 4;
                this.deadzone = new Rectangle((this.width - helper) / 2, (this.height - helper) / 2, helper, helper);
                break;
            case Camera.STYLE_TOPDOWN_TIGHT:
                helper = Math.max(this.width, this.height) / 8;
                this.deadzone = new Rectangle((this.width - helper) / 2, (this.height - helper) / 2, helper, helper);
                break;
            case Camera.STYLE_LOCKON:
            default:
                this.deadzone = null;
                break;
        }
    };
    Camera.prototype.focusOnXY = function (x, y) {
        x += (x > 0) ? 0.0000001 : -0.0000001;
        y += (y > 0) ? 0.0000001 : -0.0000001;
        this.scroll.x = Math.round(x - this.worldView.halfWidth);
        this.scroll.y = Math.round(y - this.worldView.halfHeight);
    };
    Camera.prototype.focusOn = function (point) {
        point.x += (point.x > 0) ? 0.0000001 : -0.0000001;
        point.y += (point.y > 0) ? 0.0000001 : -0.0000001;
        this.scroll.x = Math.round(point.x - this.worldView.halfWidth);
        this.scroll.y = Math.round(point.y - this.worldView.halfHeight);
    };
    Camera.prototype.setBounds = /**
    * Specify the boundaries of the world or where the camera is allowed to move.
    *
    * @param	X				The smallest X value of your world (usually 0).
    * @param	Y				The smallest Y value of your world (usually 0).
    * @param	Width			The largest X value of your world (usually the world width).
    * @param	Height			The largest Y value of your world (usually the world height).
    * @param	UpdateWorld		Whether the global quad-tree's dimensions should be updated to match (default: false).
    */
    function (X, Y, Width, Height, UpdateWorld) {
        if (typeof X === "undefined") { X = 0; }
        if (typeof Y === "undefined") { Y = 0; }
        if (typeof Width === "undefined") { Width = 0; }
        if (typeof Height === "undefined") { Height = 0; }
        if (typeof UpdateWorld === "undefined") { UpdateWorld = false; }
        if(this.bounds == null) {
            this.bounds = new Rectangle();
        }
        this.bounds.setTo(X, Y, Width, Height);
        //if(UpdateWorld)
        //	FlxG.worldBounds.copyFrom(bounds);
        this.update();
    };
    Camera.prototype.update = function () {
        if(this._target !== null) {
            if(this.deadzone == null) {
                this.focusOnXY(this._target.x + this._target.origin.x, this._target.y + this._target.origin.y);
            } else {
                var edge;
                var targetX = this._target.x + ((this._target.x > 0) ? 0.0000001 : -0.0000001);
                var targetY = this._target.y + ((this._target.y > 0) ? 0.0000001 : -0.0000001);
                edge = targetX - this.deadzone.x;
                if(this.scroll.x > edge) {
                    this.scroll.x = edge;
                }
                edge = targetX + this._target.width - this.deadzone.x - this.deadzone.width;
                if(this.scroll.x < edge) {
                    this.scroll.x = edge;
                }
                edge = targetY - this.deadzone.y;
                if(this.scroll.y > edge) {
                    this.scroll.y = edge;
                }
                edge = targetY + this._target.height - this.deadzone.y - this.deadzone.height;
                if(this.scroll.y < edge) {
                    this.scroll.y = edge;
                }
            }
        }
        //  Make sure we didn't go outside the camera's bounds
        if(this.bounds !== null) {
            if(this.scroll.x < this.bounds.left) {
                this.scroll.x = this.bounds.left;
            }
            if(this.scroll.x > this.bounds.right - this.width) {
                this.scroll.x = this.bounds.right - this.width;
            }
            if(this.scroll.y < this.bounds.top) {
                this.scroll.y = this.bounds.top;
            }
            if(this.scroll.y > this.bounds.bottom - this.height) {
                this.scroll.y = this.bounds.bottom - this.height;
            }
        }
        this.worldView.x = this.scroll.x;
        this.worldView.y = this.scroll.y;
        //  Update the Flash effect
        if(this._fxFlashAlpha > 0) {
            this._fxFlashAlpha -= this._game.time.elapsed / this._fxFlashDuration;
            this._fxFlashAlpha = this._game.math.roundTo(this._fxFlashAlpha, -2);
            if(this._fxFlashAlpha <= 0) {
                this._fxFlashAlpha = 0;
                if(this._fxFlashComplete !== null) {
                    this._fxFlashComplete();
                }
            }
        }
        //  Update the Fade effect
        if(this._fxFadeAlpha > 0) {
            this._fxFadeAlpha += this._game.time.elapsed / this._fxFadeDuration;
            this._fxFadeAlpha = this._game.math.roundTo(this._fxFadeAlpha, -2);
            if(this._fxFadeAlpha >= 1) {
                this._fxFadeAlpha = 1;
                if(this._fxFadeComplete !== null) {
                    this._fxFadeComplete();
                }
            }
        }
        //  Update the "shake" special effect
        if(this._fxShakeDuration > 0) {
            this._fxShakeDuration -= this._game.time.elapsed;
            this._fxShakeDuration = this._game.math.roundTo(this._fxShakeDuration, -2);
            if(this._fxShakeDuration <= 0) {
                this._fxShakeDuration = 0;
                this._fxShakeOffset.setTo(0, 0);
                this._stageX = this._fxShakePrevX;
                this._stageY = this._fxShakePrevY;
                if(this._fxShakeComplete != null) {
                    this._fxShakeComplete();
                }
            } else {
                if((this._fxShakeDirection == Camera.SHAKE_BOTH_AXES) || (this._fxShakeDirection == Camera.SHAKE_HORIZONTAL_ONLY)) {
                    //this._fxShakeOffset.x = ((this._game.math.random() * this._fxShakeIntensity * this.worldView.width * 2 - this._fxShakeIntensity * this.worldView.width) * this._zoom;
                    this._fxShakeOffset.x = (this._game.math.random() * this._fxShakeIntensity * this.worldView.width * 2 - this._fxShakeIntensity * this.worldView.width);
                }
                if((this._fxShakeDirection == Camera.SHAKE_BOTH_AXES) || (this._fxShakeDirection == Camera.SHAKE_VERTICAL_ONLY)) {
                    //this._fxShakeOffset.y = (this._game.math.random() * this._fxShakeIntensity * this.worldView.height * 2 - this._fxShakeIntensity * this.worldView.height) * this._zoom;
                    this._fxShakeOffset.y = (this._game.math.random() * this._fxShakeIntensity * this.worldView.height * 2 - this._fxShakeIntensity * this.worldView.height);
                }
            }
        }
    };
    Camera.prototype.render = function () {
        if(this.visible === false && this.alpha < 0.1) {
            return;
        }
        if((this._fxShakeOffset.x != 0) || (this._fxShakeOffset.y != 0)) {
            //this._stageX = this._fxShakePrevX + (this.worldView.halfWidth * this._zoom) + this._fxShakeOffset.x;
            //this._stageY = this._fxShakePrevY + (this.worldView.halfHeight * this._zoom) + this._fxShakeOffset.y;
            this._stageX = this._fxShakePrevX + (this.worldView.halfWidth) + this._fxShakeOffset.x;
            this._stageY = this._fxShakePrevY + (this.worldView.halfHeight) + this._fxShakeOffset.y;
            //console.log('shake', this._fxShakeDuration, this._fxShakeIntensity, this._fxShakeOffset.x, this._fxShakeOffset.y);
                    }
        //if (this._rotation !== 0 || this._clip || this.scale.x !== 1 || this.scale.y !== 1)
        //{
        //this._game.stage.context.save();
        //}
        //  It may be safe/quicker to just save the context every frame regardless
        this._game.stage.context.save();
        if(this.alpha !== 1) {
            this._game.stage.context.globalAlpha = this.alpha;
        }
        this._sx = this._stageX;
        this._sy = this._stageY;
        //  Shadow
        if(this.showShadow) {
            this._game.stage.context.shadowColor = this.shadowColor;
            this._game.stage.context.shadowBlur = this.shadowBlur;
            this._game.stage.context.shadowOffsetX = this.shadowOffset.x;
            this._game.stage.context.shadowOffsetY = this.shadowOffset.y;
        }
        //  Scale on
        if(this.scale.x !== 1 || this.scale.y !== 1) {
            this._game.stage.context.scale(this.scale.x, this.scale.y);
            this._sx = this._sx / this.scale.x;
            this._sy = this._sy / this.scale.y;
        }
        //  Rotation - translate to the mid-point of the camera
        if(this._rotation !== 0) {
            this._game.stage.context.translate(this._sx + this.worldView.halfWidth, this._sy + this.worldView.halfHeight);
            this._game.stage.context.rotate(this._rotation * (Math.PI / 180));
            // now shift back to where that should actually render
            this._game.stage.context.translate(-(this._sx + this.worldView.halfWidth), -(this._sy + this.worldView.halfHeight));
        }
        //  Background
        if(this.opaque == true) {
            if(this._bgTexture) {
                this._game.stage.context.fillStyle = this._bgTexture;
                this._game.stage.context.fillRect(this._sx, this._sy, this.worldView.width, this.worldView.height);
            } else {
                this._game.stage.context.fillStyle = this._bgColor;
                this._game.stage.context.fillRect(this._sx, this._sy, this.worldView.width, this.worldView.height);
            }
        }
        //  Shadow off
        if(this.showShadow) {
            this._game.stage.context.shadowBlur = 0;
            this._game.stage.context.shadowOffsetX = 0;
            this._game.stage.context.shadowOffsetY = 0;
        }
        //  Clip the camera so we don't get sprites appearing outside the edges
        if(this._clip) {
            this._game.stage.context.beginPath();
            this._game.stage.context.rect(this._sx, this._sy, this.worldView.width, this.worldView.height);
            this._game.stage.context.closePath();
            this._game.stage.context.clip();
        }
        //this.totalSpritesRendered = this._game.world.renderSpritesInCamera(this.worldView, sx, sy);
        //this._game.world.group.render(this.worldView, this.worldView.x, this.worldView.y, sx, sy);
        this._game.world.group.render(this, this._sx, this._sy);
        if(this.showBorder) {
            this._game.stage.context.strokeStyle = this.borderColor;
            this._game.stage.context.lineWidth = 1;
            this._game.stage.context.rect(this._sx, this._sy, this.worldView.width, this.worldView.height);
            this._game.stage.context.stroke();
        }
        //  "Flash" FX
        if(this._fxFlashAlpha > 0) {
            this._game.stage.context.fillStyle = this._fxFlashColor + this._fxFlashAlpha + ')';
            this._game.stage.context.fillRect(this._sx, this._sy, this.worldView.width, this.worldView.height);
        }
        //  "Fade" FX
        if(this._fxFadeAlpha > 0) {
            this._game.stage.context.fillStyle = this._fxFadeColor + this._fxFadeAlpha + ')';
            this._game.stage.context.fillRect(this._sx, this._sy, this.worldView.width, this.worldView.height);
        }
        //  Scale off
        if(this.scale.x !== 1 || this.scale.y !== 1) {
            this._game.stage.context.scale(1, 1);
        }
        if(this._rotation !== 0 || this._clip) {
            this._game.stage.context.translate(0, 0);
            //this._game.stage.context.restore();
                    }
        //  maybe just do this every frame regardless?
        this._game.stage.context.restore();
        if(this.alpha !== 1) {
            this._game.stage.context.globalAlpha = 1;
        }
    };
    Object.defineProperty(Camera.prototype, "backgroundColor", {
        get: function () {
            return this._bgColor;
        },
        set: function (color) {
            this._bgColor = color;
        },
        enumerable: true,
        configurable: true
    });
    Camera.prototype.setTexture = function (key, repeat) {
        if (typeof repeat === "undefined") { repeat = 'repeat'; }
        this._bgTexture = this._game.stage.context.createPattern(this._game.cache.getImage(key), repeat);
        this._bgTextureRepeat = repeat;
    };
    Camera.prototype.setPosition = function (x, y) {
        this._stageX = x;
        this._stageY = y;
        this.checkClip();
    };
    Camera.prototype.setSize = function (width, height) {
        this.worldView.width = width;
        this.worldView.height = height;
        this.checkClip();
    };
    Camera.prototype.renderDebugInfo = function (x, y, color) {
        if (typeof color === "undefined") { color = 'rgb(255,255,255)'; }
        this._game.stage.context.fillStyle = color;
        this._game.stage.context.fillText('Camera ID: ' + this.ID + ' (' + this.worldView.width + ' x ' + this.worldView.height + ')', x, y);
        this._game.stage.context.fillText('X: ' + this._stageX + ' Y: ' + this._stageY + ' Rotation: ' + this._rotation, x, y + 14);
        this._game.stage.context.fillText('World X: ' + this.scroll.x.toFixed(1) + ' World Y: ' + this.scroll.y.toFixed(1), x, y + 28);
        if(this.bounds) {
            this._game.stage.context.fillText('Bounds: ' + this.bounds.width + ' x ' + this.bounds.height, x, y + 56);
        }
    };
    Object.defineProperty(Camera.prototype, "x", {
        get: function () {
            return this._stageX;
        },
        set: function (value) {
            this._stageX = value;
            this.checkClip();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "y", {
        get: function () {
            return this._stageY;
        },
        set: function (value) {
            this._stageY = value;
            this.checkClip();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "width", {
        get: function () {
            return this.worldView.width;
        },
        set: function (value) {
            this.worldView.width = value;
            this.checkClip();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "height", {
        get: function () {
            return this.worldView.height;
        },
        set: function (value) {
            this.worldView.height = value;
            this.checkClip();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "rotation", {
        get: function () {
            return this._rotation;
        },
        set: function (value) {
            this._rotation = this._game.math.wrap(value, 360, 0);
        },
        enumerable: true,
        configurable: true
    });
    Camera.prototype.checkClip = function () {
        if(this._stageX !== 0 || this._stageY !== 0 || this.worldView.width < this._game.stage.width || this.worldView.height < this._game.stage.height) {
            this._clip = true;
        } else {
            this._clip = false;
        }
    };
    return Camera;
})();
/// <reference path="Game.ts" />
/// <reference path="GameMath.ts" />
/// <reference path="Rectangle.ts" />
/// <reference path="Point.ts" />
/// <reference path="system/Camera.ts" />
//  TODO: If the Camera is larger than the Stage size then the rotation offset isn't correct
//  TODO: Texture Repeat doesn't scroll, because it's part of the camera not the world, need to think about this more
var Cameras = (function () {
    function Cameras(game, x, y, width, height) {
        this._game = game;
        this._cameras = [];
        this.current = this.addCamera(x, y, width, height);
    }
    Cameras.prototype.getAll = function () {
        return this._cameras;
    };
    Cameras.prototype.update = function () {
        this._cameras.forEach(function (camera) {
            return camera.update();
        });
    };
    Cameras.prototype.render = function () {
        this._cameras.forEach(function (camera) {
            return camera.render();
        });
    };
    Cameras.prototype.addCamera = function (x, y, width, height) {
        var newCam = new Camera(this._game, this._cameras.length, x, y, width, height);
        this._cameras.push(newCam);
        return newCam;
    };
    Cameras.prototype.removeCamera = function (id) {
        if(this._cameras[id]) {
            if(this.current === this._cameras[id]) {
                this.current = null;
            }
            this._cameras.splice(id, 1);
            return true;
        } else {
            return false;
        }
    };
    Cameras.prototype.destroy = function () {
        this._cameras.length = 0;
        this.current = this.addCamera(0, 0, this._game.stage.width, this._game.stage.height);
    };
    return Cameras;
})();
/// <reference path="Game.ts" />
/**
* This is a useful "generic" object.
* Both <code>GameObject</code> and <code>Group</code> extend this class,
* as do the plugins.  Has no size, position or graphical data.
*
* @author	Adam Atomic
* @author	Richard Davey
*/
var Basic = (function () {
    /**
    * Instantiate the basic object.
    */
    function Basic(game) {
        /**
        * Allows you to give this object a name. Useful for debugging, but not actually used internally.
        */
        this.name = '';
        this._game = game;
        this.ID = -1;
        this.exists = true;
        this.active = true;
        this.visible = true;
        this.alive = true;
        this.isGroup = false;
        this.ignoreDrawDebug = false;
    }
    Basic.prototype.destroy = /**
    * Override this to null out iables or manually call
    * <code>destroy()</code> on class members if necessary.
    * Don't forget to call <code>super.destroy()</code>!
    */
    function () {
    };
    Basic.prototype.preUpdate = /**
    * Pre-update is called right before <code>update()</code> on each object in the game loop.
    */
    function () {
    };
    Basic.prototype.update = /**
    * Override this to update your class's position and appearance.
    * This is where most of your game rules and behavioral code will go.
    */
    function () {
    };
    Basic.prototype.postUpdate = /**
    * Post-update is called right after <code>update()</code> on each object in the game loop.
    */
    function () {
    };
    Basic.prototype.render = function (camera, cameraOffsetX, cameraOffsetY) {
    };
    Basic.prototype.kill = /**
    * Handy for "killing" game objects.
    * Default behavior is to flag them as nonexistent AND dead.
    * However, if you want the "corpse" to remain in the game,
    * like to animate an effect or whatever, you should override this,
    * setting only alive to false, and leaving exists true.
    */
    function () {
        this.alive = false;
        this.exists = false;
    };
    Basic.prototype.revive = /**
    * Handy for bringing game objects "back to life". Just sets alive and exists back to true.
    * In practice, this is most often called by <code>FlxObject.reset()</code>.
    */
    function () {
        this.alive = true;
        this.exists = true;
    };
    Basic.prototype.toString = /**
    * Convert object to readable string name.  Useful for debugging, save games, etc.
    */
    function () {
        //return FlxU.getClassName(this, true);
        return "";
    };
    return Basic;
})();
var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="Basic.ts" />
/// <reference path="Game.ts" />
/// <reference path="GameMath.ts" />
/// <reference path="Rectangle.ts" />
/// <reference path="Point.ts" />
var GameObject = (function (_super) {
    __extends(GameObject, _super);
    function GameObject(game, x, y, width, height) {
        if (typeof x === "undefined") { x = 0; }
        if (typeof y === "undefined") { y = 0; }
        if (typeof width === "undefined") { width = 16; }
        if (typeof height === "undefined") { height = 16; }
        _super.call(this, game);
        this._angle = 0;
        this.moves = true;
        this.bounds = new Rectangle(x, y, width, height);
        this.exists = true;
        this.active = true;
        this.visible = true;
        this.alive = true;
        this.isGroup = false;
        this.alpha = 1;
        this.scale = new Point(1, 1);
        this.last = new Point(x, y);
        this.origin = new Point(this.bounds.halfWidth, this.bounds.halfHeight);
        this.mass = 1.0;
        this.elasticity = 0.0;
        this.health = 1;
        this.immovable = false;
        this.moves = true;
        this.touching = GameObject.NONE;
        this.wasTouching = GameObject.NONE;
        this.allowCollisions = GameObject.ANY;
        this.velocity = new Point();
        this.acceleration = new Point();
        this.drag = new Point();
        this.maxVelocity = new Point(10000, 10000);
        this.angle = 0;
        this.angularVelocity = 0;
        this.angularAcceleration = 0;
        this.angularDrag = 0;
        this.maxAngular = 10000;
        this.scrollFactor = new Point(1.0, 1.0);
    }
    GameObject.LEFT = 0x0001;
    GameObject.RIGHT = 0x0010;
    GameObject.UP = 0x0100;
    GameObject.DOWN = 0x1000;
    GameObject.NONE = 0;
    GameObject.CEILING = GameObject.UP;
    GameObject.FLOOR = GameObject.DOWN;
    GameObject.WALL = GameObject.LEFT | GameObject.RIGHT;
    GameObject.ANY = GameObject.LEFT | GameObject.RIGHT | GameObject.UP | GameObject.DOWN;
    GameObject.OVERLAP_BIAS = 4;
    GameObject.prototype.preUpdate = function () {
        //  flicker time
        this.last.x = this.bounds.x;
        this.last.y = this.bounds.y;
    };
    GameObject.prototype.update = function () {
    };
    GameObject.prototype.postUpdate = function () {
        if(this.moves) {
            this.updateMotion();
        }
        this.wasTouching = this.touching;
        this.touching = GameObject.NONE;
    };
    GameObject.prototype.updateMotion = function () {
        var delta;
        var velocityDelta;
        velocityDelta = (this._game.math.computeVelocity(this.angularVelocity, this.angularAcceleration, this.angularDrag, this.maxAngular) - this.angularVelocity) / 2;
        this.angularVelocity += velocityDelta;
        this._angle += this.angularVelocity * this._game.time.elapsed;
        this.angularVelocity += velocityDelta;
        velocityDelta = (this._game.math.computeVelocity(this.velocity.x, this.acceleration.x, this.drag.x, this.maxVelocity.x) - this.velocity.x) / 2;
        this.velocity.x += velocityDelta;
        delta = this.velocity.x * this._game.time.elapsed;
        this.velocity.x += velocityDelta;
        this.bounds.x += delta;
        velocityDelta = (this._game.math.computeVelocity(this.velocity.y, this.acceleration.y, this.drag.y, this.maxVelocity.y) - this.velocity.y) / 2;
        this.velocity.y += velocityDelta;
        delta = this.velocity.y * this._game.time.elapsed;
        this.velocity.y += velocityDelta;
        this.bounds.y += delta;
    };
    GameObject.prototype.overlaps = /**
    * Checks to see if some <code>GameObject</code> overlaps this <code>GameObject</code> or <code>FlxGroup</code>.
    * If the group has a LOT of things in it, it might be faster to use <code>FlxG.overlaps()</code>.
    * WARNING: Currently tilemaps do NOT support screen space overlap checks!
    *
    * @param	ObjectOrGroup	The object or group being tested.
    * @param	InScreenSpace	Whether to take scroll factors numbero account when checking for overlap.  Default is false, or "only compare in world space."
    * @param	Camera			Specify which game camera you want.  If null getScreenXY() will just grab the first global camera.
    *
    * @return	Whether or not the two objects overlap.
    */
    function (ObjectOrGroup, InScreenSpace, Camera) {
        if (typeof InScreenSpace === "undefined") { InScreenSpace = false; }
        if (typeof Camera === "undefined") { Camera = null; }
        if(ObjectOrGroup.isGroup) {
            var results = false;
            var i = 0;
            var members = ObjectOrGroup.members;
            while(i < length) {
                if(this.overlaps(members[i++], InScreenSpace, Camera)) {
                    results = true;
                }
            }
            return results;
        }
        /*
        if (typeof ObjectOrGroup === 'FlxTilemap')
        {
        //Since tilemap's have to be the caller, not the target, to do proper tile-based collisions,
        // we redirect the call to the tilemap overlap here.
        return ObjectOrGroup.overlaps(this, InScreenSpace, Camera);
        }
        */
        //var object: GameObject = ObjectOrGroup;
        if(!InScreenSpace) {
            return (ObjectOrGroup.x + ObjectOrGroup.width > this.x) && (ObjectOrGroup.x < this.x + this.width) && (ObjectOrGroup.y + ObjectOrGroup.height > this.y) && (ObjectOrGroup.y < this.y + this.height);
        }
        if(Camera == null) {
            Camera = this._game.camera;
        }
        var objectScreenPos = ObjectOrGroup.getScreenXY(null, Camera);
        this.getScreenXY(this._point, Camera);
        return (objectScreenPos.x + ObjectOrGroup.width > this._point.x) && (objectScreenPos.x < this._point.x + this.width) && (objectScreenPos.y + ObjectOrGroup.height > this._point.y) && (objectScreenPos.y < this._point.y + this.height);
    };
    GameObject.prototype.overlapsAt = /**
    * Checks to see if this <code>GameObject</code> were located at the given position, would it overlap the <code>GameObject</code> or <code>FlxGroup</code>?
    * This is distinct from overlapsPoint(), which just checks that ponumber, rather than taking the object's size numbero account.
    * WARNING: Currently tilemaps do NOT support screen space overlap checks!
    *
    * @param	X				The X position you want to check.  Pretends this object (the caller, not the parameter) is located here.
    * @param	Y				The Y position you want to check.  Pretends this object (the caller, not the parameter) is located here.
    * @param	ObjectOrGroup	The object or group being tested.
    * @param	InScreenSpace	Whether to take scroll factors numbero account when checking for overlap.  Default is false, or "only compare in world space."
    * @param	Camera			Specify which game camera you want.  If null getScreenXY() will just grab the first global camera.
    *
    * @return	Whether or not the two objects overlap.
    */
    function (X, Y, ObjectOrGroup, InScreenSpace, Camera) {
        if (typeof InScreenSpace === "undefined") { InScreenSpace = false; }
        if (typeof Camera === "undefined") { Camera = null; }
        if(ObjectOrGroup.isGroup) {
            var results = false;
            var basic;
            var i = 0;
            var members = ObjectOrGroup.members;
            while(i < length) {
                if(this.overlapsAt(X, Y, members[i++], InScreenSpace, Camera)) {
                    results = true;
                }
            }
            return results;
        }
        /*
        if (typeof ObjectOrGroup === 'FlxTilemap')
        {
        //Since tilemap's have to be the caller, not the target, to do proper tile-based collisions,
        // we redirect the call to the tilemap overlap here.
        //However, since this is overlapsAt(), we also have to invent the appropriate position for the tilemap.
        //So we calculate the offset between the player and the requested position, and subtract that from the tilemap.
        var tilemap: FlxTilemap = ObjectOrGroup;
        return tilemap.overlapsAt(tilemap.x - (X - this.x), tilemap.y - (Y - this.y), this, InScreenSpace, Camera);
        }
        */
        //var object: GameObject = ObjectOrGroup;
        if(!InScreenSpace) {
            return (ObjectOrGroup.x + ObjectOrGroup.width > X) && (ObjectOrGroup.x < X + this.width) && (ObjectOrGroup.y + ObjectOrGroup.height > Y) && (ObjectOrGroup.y < Y + this.height);
        }
        if(Camera == null) {
            Camera = this._game.camera;
        }
        var objectScreenPos = ObjectOrGroup.getScreenXY(null, Camera);
        this._point.x = X - Camera.scroll.x * this.scrollFactor.x//copied from getScreenXY()
        ;
        this._point.y = Y - Camera.scroll.y * this.scrollFactor.y;
        this._point.x += (this._point.x > 0) ? 0.0000001 : -0.0000001;
        this._point.y += (this._point.y > 0) ? 0.0000001 : -0.0000001;
        return (objectScreenPos.x + ObjectOrGroup.width > this._point.x) && (objectScreenPos.x < this._point.x + this.width) && (objectScreenPos.y + ObjectOrGroup.height > this._point.y) && (objectScreenPos.y < this._point.y + this.height);
    };
    GameObject.prototype.overlapsPoint = /**
    * Checks to see if a ponumber in 2D world space overlaps this <code>GameObject</code> object.
    *
    * @param	Point			The ponumber in world space you want to check.
    * @param	InScreenSpace	Whether to take scroll factors numbero account when checking for overlap.
    * @param	Camera			Specify which game camera you want.  If null getScreenXY() will just grab the first global camera.
    *
    * @return	Whether or not the ponumber overlaps this object.
    */
    function (point, InScreenSpace, Camera) {
        if (typeof InScreenSpace === "undefined") { InScreenSpace = false; }
        if (typeof Camera === "undefined") { Camera = null; }
        if(!InScreenSpace) {
            return (point.x > this.x) && (point.x < this.x + this.width) && (point.y > this.y) && (point.y < this.y + this.height);
        }
        if(Camera == null) {
            Camera = this._game.camera;
        }
        var X = point.x - Camera.scroll.x;
        var Y = point.y - Camera.scroll.y;
        this.getScreenXY(this._point, Camera);
        return (X > this._point.x) && (X < this._point.x + this.width) && (Y > this._point.y) && (Y < this._point.y + this.height);
    };
    GameObject.prototype.onScreen = /**
    * Check and see if this object is currently on screen.
    *
    * @param	Camera		Specify which game camera you want.  If null getScreenXY() will just grab the first global camera.
    *
    * @return	Whether the object is on screen or not.
    */
    function (Camera) {
        if (typeof Camera === "undefined") { Camera = null; }
        if(Camera == null) {
            Camera = this._game.camera;
        }
        this.getScreenXY(this._point, Camera);
        return (this._point.x + this.width > 0) && (this._point.x < Camera.width) && (this._point.y + this.height > 0) && (this._point.y < Camera.height);
    };
    GameObject.prototype.getScreenXY = /**
    * Call this to figure out the on-screen position of the object.
    *
    * @param	Camera		Specify which game camera you want.  If null getScreenXY() will just grab the first global camera.
    * @param	Point		Takes a <code>Point</code> object and assigns the post-scrolled X and Y values of this object to it.
    *
    * @return	The <code>Point</code> you passed in, or a new <code>Point</code> if you didn't pass one, containing the screen X and Y position of this object.
    */
    function (point, Camera) {
        if (typeof point === "undefined") { point = null; }
        if (typeof Camera === "undefined") { Camera = null; }
        if(point == null) {
            point = new Point();
        }
        if(Camera == null) {
            Camera = this._game.camera;
        }
        point.x = this.x - Camera.scroll.x * this.scrollFactor.x;
        point.y = this.y - Camera.scroll.y * this.scrollFactor.y;
        point.x += (point.x > 0) ? 0.0000001 : -0.0000001;
        point.y += (point.y > 0) ? 0.0000001 : -0.0000001;
        return point;
    };
    Object.defineProperty(GameObject.prototype, "solid", {
        get: /**
        * Whether the object collides or not.  For more control over what directions
        * the object will collide from, use collision constants (like LEFT, FLOOR, etc)
        * to set the value of allowCollisions directly.
        */
        function () {
            return (this.allowCollisions & GameObject.ANY) > GameObject.NONE;
        },
        set: /**
        * @private
        */
        function (Solid) {
            if(Solid) {
                this.allowCollisions = GameObject.ANY;
            } else {
                this.allowCollisions = GameObject.NONE;
            }
        },
        enumerable: true,
        configurable: true
    });
    GameObject.prototype.getMidpoint = /**
    * Retrieve the midponumber of this object in world coordinates.
    *
    * @Point	Allows you to pass in an existing <code>Point</code> object if you're so inclined.  Otherwise a new one is created.
    *
    * @return	A <code>Point</code> object containing the midponumber of this object in world coordinates.
    */
    function (point) {
        if (typeof point === "undefined") { point = null; }
        if(point == null) {
            point = new Point();
        }
        point.x = this.x + this.width * 0.5;
        point.y = this.y + this.height * 0.5;
        return point;
    };
    GameObject.prototype.reset = /**
    * Handy for reviving game objects.
    * Resets their existence flags and position.
    *
    * @param	X	The new X position of this object.
    * @param	Y	The new Y position of this object.
    */
    function (X, Y) {
        this.revive();
        this.touching = GameObject.NONE;
        this.wasTouching = GameObject.NONE;
        this.x = X;
        this.y = Y;
        this.last.x = X;
        this.last.y = Y;
        this.velocity.x = 0;
        this.velocity.y = 0;
    };
    GameObject.prototype.isTouching = /**
    * Handy for checking if this object is touching a particular surface.
    * For slightly better performance you can just &amp; the value directly numbero <code>touching</code>.
    * However, this method is good for readability and accessibility.
    *
    * @param	Direction	Any of the collision flags (e.g. LEFT, FLOOR, etc).
    *
    * @return	Whether the object is touching an object in (any of) the specified direction(s) this frame.
    */
    function (Direction) {
        return (this.touching & Direction) > GameObject.NONE;
    };
    GameObject.prototype.justTouched = /**
    * Handy for checking if this object is just landed on a particular surface.
    *
    * @param	Direction	Any of the collision flags (e.g. LEFT, FLOOR, etc).
    *
    * @return	Whether the object just landed on (any of) the specified surface(s) this frame.
    */
    function (Direction) {
        return ((this.touching & Direction) > GameObject.NONE) && ((this.wasTouching & Direction) <= GameObject.NONE);
    };
    GameObject.prototype.hurt = /**
    * Reduces the "health" variable of this sprite by the amount specified in Damage.
    * Calls kill() if health drops to or below zero.
    *
    * @param	Damage		How much health to take away (use a negative number to give a health bonus).
    */
    function (Damage) {
        this.health = this.health - Damage;
        if(this.health <= 0) {
            this.kill();
        }
    };
    GameObject.prototype.destroy = function () {
    };
    Object.defineProperty(GameObject.prototype, "x", {
        get: function () {
            return this.bounds.x;
        },
        set: function (value) {
            this.bounds.x = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameObject.prototype, "y", {
        get: function () {
            return this.bounds.y;
        },
        set: function (value) {
            this.bounds.y = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameObject.prototype, "rotation", {
        get: function () {
            return this._angle;
        },
        set: function (value) {
            this._angle = this._game.math.wrap(value, 360, 0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameObject.prototype, "angle", {
        get: function () {
            return this._angle;
        },
        set: function (value) {
            this._angle = this._game.math.wrap(value, 360, 0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameObject.prototype, "width", {
        get: function () {
            return this.bounds.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameObject.prototype, "height", {
        get: function () {
            return this.bounds.height;
        },
        enumerable: true,
        configurable: true
    });
    return GameObject;
})(Basic);
/// <reference path="Animations.ts" />
/// <reference path="GameObject.ts" />
/// <reference path="Game.ts" />
/// <reference path="GameMath.ts" />
/// <reference path="Rectangle.ts" />
/// <reference path="Point.ts" />
var Sprite = (function (_super) {
    __extends(Sprite, _super);
    function Sprite(game, x, y, key) {
        if (typeof x === "undefined") { x = 0; }
        if (typeof y === "undefined") { y = 0; }
        if (typeof key === "undefined") { key = null; }
        _super.call(this, game, x, y);
        //  local rendering related temp vars to help avoid gc spikes
        this._sx = 0;
        this._sy = 0;
        this._sw = 0;
        this._sh = 0;
        this._dx = 0;
        this._dy = 0;
        this._dw = 0;
        this._dh = 0;
        this._texture = null;
        this.animations = new Animations(this._game, this);
        if(key !== null) {
            this.loadGraphic(key);
        } else {
            this.bounds.width = 16;
            this.bounds.height = 16;
        }
    }
    Sprite.prototype.loadGraphic = function (key) {
        if(this._game.cache.isSpriteSheet(key) == false) {
            this._texture = this._game.cache.getImage(key);
            this.bounds.width = this._texture.width;
            this.bounds.height = this._texture.height;
        } else {
            this._texture = this._game.cache.getImage(key);
            this.animations.loadFrameData(this._game.cache.getFrameData(key));
        }
        return this;
    };
    Sprite.prototype.makeGraphic = function (width, height, color) {
        if (typeof color === "undefined") { color = 0xffffffff; }
        this._texture = null;
        this.width = width;
        this.height = height;
        return this;
    };
    Sprite.prototype.inCamera = function (camera) {
        if(this.scrollFactor.x !== 1.0 || this.scrollFactor.y !== 1.0) {
            this._dx = this.bounds.x - (camera.x * this.scrollFactor.x);
            this._dy = this.bounds.y - (camera.y * this.scrollFactor.x);
            this._dw = this.bounds.width * this.scale.x;
            this._dh = this.bounds.height * this.scale.y;
            return (camera.right > this._dx) && (camera.x < this._dx + this._dw) && (camera.bottom > this._dy) && (camera.y < this._dy + this._dh);
        } else {
            return camera.overlap(this.bounds);
        }
    };
    Sprite.prototype.postUpdate = function () {
        this.animations.update();
        _super.prototype.postUpdate.call(this);
    };
    Object.defineProperty(Sprite.prototype, "frame", {
        get: function () {
            return this.animations.frame;
        },
        set: function (value) {
            this.animations.frame = value;
        },
        enumerable: true,
        configurable: true
    });
    Sprite.prototype.render = function (camera, cameraOffsetX, cameraOffsetY) {
        //  Render checks
        if(this.visible === false || this.scale.x == 0 || this.scale.y == 0 || this.alpha < 0.1 || this.inCamera(camera.worldView) == false) {
            return false;
        }
        //  Alpha
        if(this.alpha !== 1) {
            var globalAlpha = this._game.stage.context.globalAlpha;
            this._game.stage.context.globalAlpha = this.alpha;
        }
        //if (this.flip === true)
        //{
        //	this.context.save();
        //	this.context.translate(game.canvas.width, 0);
        //	this.context.scale(-1, 1);
        //}
        this._sx = 0;
        this._sy = 0;
        this._sw = this.bounds.width;
        this._sh = this.bounds.height;
        this._dx = cameraOffsetX + (this.bounds.x - camera.worldView.x);
        this._dy = cameraOffsetY + (this.bounds.y - camera.worldView.y);
        this._dw = this.bounds.width * this.scale.x;
        this._dh = this.bounds.height * this.scale.y;
        if(this.animations.currentFrame) {
            this._sx = this.animations.currentFrame.x;
            this._sy = this.animations.currentFrame.y;
            if(this.animations.currentFrame.trimmed) {
                this._dx += this.animations.currentFrame.spriteSourceSizeX;
                this._dy += this.animations.currentFrame.spriteSourceSizeY;
            }
        }
        //	Apply camera difference
        if(this.scrollFactor.x !== 1.0 || this.scrollFactor.y !== 1.0) {
            this._dx -= (camera.worldView.x * this.scrollFactor.x);
            this._dy -= (camera.worldView.y * this.scrollFactor.y);
        }
        //	Rotation
        if(this.angle !== 0) {
            this._game.stage.context.save();
            this._game.stage.context.translate(this._dx + (this._dw / 2), this._dy + (this._dh / 2));
            this._game.stage.context.rotate(this.angle * (Math.PI / 180));
            this._dx = -(this._dw / 2);
            this._dy = -(this._dh / 2);
        }
        this._sx = Math.round(this._sx);
        this._sy = Math.round(this._sy);
        this._sw = Math.round(this._sw);
        this._sh = Math.round(this._sh);
        this._dx = Math.round(this._dx);
        this._dy = Math.round(this._dy);
        this._dw = Math.round(this._dw);
        this._dh = Math.round(this._dh);
        //  Debug test
        //this._game.stage.context.fillStyle = 'rgba(255,0,0,0.3)';
        //this._game.stage.context.fillRect(this._dx, this._dy, this._dw, this._dh);
        if(this._texture != null) {
            this._game.stage.context.drawImage(this._texture, //	Source Image
            this._sx, //	Source X (location within the source image)
            this._sy, //	Source Y
            this._sw, //	Source Width
            this._sh, //	Source Height
            this._dx, //	Destination X (where on the canvas it'll be drawn)
            this._dy, //	Destination Y
            this._dw, //	Destination Width (always same as Source Width unless scaled)
            this._dh);
            //	Destination Height (always same as Source Height unless scaled)
                    } else {
            this._game.stage.context.fillStyle = 'rgb(255,255,255)';
            this._game.stage.context.fillRect(this._dx, this._dy, this._dw, this._dh);
        }
        //if (this.flip === true || this.rotation !== 0)
        if(this.rotation !== 0) {
            this._game.stage.context.translate(0, 0);
            this._game.stage.context.restore();
        }
        if(globalAlpha > -1) {
            this._game.stage.context.globalAlpha = globalAlpha;
        }
        return true;
    };
    Sprite.prototype.renderDebugInfo = function (x, y, color) {
        if (typeof color === "undefined") { color = 'rgb(255,255,255)'; }
        this._game.stage.context.fillStyle = color;
        this._game.stage.context.fillText('Sprite: ' + this.name + ' (' + this.bounds.width + ' x ' + this.bounds.height + ')', x, y);
        this._game.stage.context.fillText('x: ' + this.bounds.x.toFixed(1) + ' y: ' + this.bounds.y.toFixed(1) + ' rotation: ' + this.angle.toFixed(1), x, y + 14);
        this._game.stage.context.fillText('dx: ' + this._dx.toFixed(1) + ' dy: ' + this._dy.toFixed(1) + ' dw: ' + this._dw.toFixed(1) + ' dh: ' + this._dh.toFixed(1), x, y + 28);
        this._game.stage.context.fillText('sx: ' + this._sx.toFixed(1) + ' sy: ' + this._sy.toFixed(1) + ' sw: ' + this._sw.toFixed(1) + ' sh: ' + this._sh.toFixed(1), x, y + 42);
    };
    return Sprite;
})(GameObject);
/// <reference path="Basic.ts" />
/// <reference path="Sprite.ts" />
/**
* This is an organizational class that can update and render a bunch of <code>Basic</code>s.
* NOTE: Although <code>Group</code> extends <code>Basic</code>, it will not automatically
* add itself to the global collisions quad tree, it will only add its members.
*
* @author	Adam Atomic
* @author	Richard Davey
*/
var Group = (function (_super) {
    __extends(Group, _super);
    function Group(game, MaxSize) {
        if (typeof MaxSize === "undefined") { MaxSize = 0; }
        _super.call(this, game);
        this.isGroup = true;
        this.members = [];
        this.length = 0;
        this._maxSize = MaxSize;
        this._marker = 0;
        this._sortIndex = null;
    }
    Group.ASCENDING = -1;
    Group.DESCENDING = 1;
    Group.prototype.destroy = /**
    * Override this function to handle any deleting or "shutdown" type operations you might need,
    * such as removing traditional Flash children like Basic objects.
    */
    function () {
        if(this.members != null) {
            var basic;
            var i = 0;
            while(i < this.length) {
                basic = this.members[i++];
                if(basic != null) {
                    basic.destroy();
                }
            }
            this.members.length = 0;
        }
        this._sortIndex = null;
    };
    Group.prototype.update = /**
    * Automatically goes through and calls update on everything you added.
    */
    function () {
        var basic;
        var i = 0;
        while(i < this.length) {
            basic = this.members[i++];
            if((basic != null) && basic.exists && basic.active) {
                basic.preUpdate();
                basic.update();
                basic.postUpdate();
            }
        }
    };
    Group.prototype.render = /**
    * Automatically goes through and calls render on everything you added.
    */
    function (camera, cameraOffsetX, cameraOffsetY) {
        var basic;
        var i = 0;
        while(i < this.length) {
            basic = this.members[i++];
            if((basic != null) && basic.exists && basic.visible) {
                basic.render(camera, cameraOffsetX, cameraOffsetY);
            }
        }
    };
    Object.defineProperty(Group.prototype, "maxSize", {
        get: /**
        * The maximum capacity of this group.  Default is 0, meaning no max capacity, and the group can just grow.
        */
        function () {
            return this._maxSize;
        },
        set: /**
        * @private
        */
        function (Size) {
            this._maxSize = Size;
            if(this._marker >= this._maxSize) {
                this._marker = 0;
            }
            if((this._maxSize == 0) || (this.members == null) || (this._maxSize >= this.members.length)) {
                return;
            }
            //If the max size has shrunk, we need to get rid of some objects
            var basic;
            var i = this._maxSize;
            var l = this.members.length;
            while(i < l) {
                basic = this.members[i++];
                if(basic != null) {
                    basic.destroy();
                }
            }
            this.length = this.members.length = this._maxSize;
        },
        enumerable: true,
        configurable: true
    });
    Group.prototype.add = /**
    * Adds a new <code>Basic</code> subclass (Basic, FlxBasic, Enemy, etc) to the group.
    * Group will try to replace a null member of the array first.
    * Failing that, Group will add it to the end of the member array,
    * assuming there is room for it, and doubling the size of the array if necessary.
    *
    * <p>WARNING: If the group has a maxSize that has already been met,
    * the object will NOT be added to the group!</p>
    *
    * @param	Object		The object you want to add to the group.
    *
    * @return	The same <code>Basic</code> object that was passed in.
    */
    function (Object) {
        //Don't bother adding an object twice.
        if(this.members.indexOf(Object) >= 0) {
            return Object;
        }
        //First, look for a null entry where we can add the object.
        var i = 0;
        var l = this.members.length;
        while(i < l) {
            if(this.members[i] == null) {
                this.members[i] = Object;
                if(i >= this.length) {
                    this.length = i + 1;
                }
                return Object;
            }
            i++;
        }
        //Failing that, expand the array (if we can) and add the object.
        if(this._maxSize > 0) {
            if(this.members.length >= this._maxSize) {
                return Object;
            } else if(this.members.length * 2 <= this._maxSize) {
                this.members.length *= 2;
            } else {
                this.members.length = this._maxSize;
            }
        } else {
            this.members.length *= 2;
        }
        //If we made it this far, then we successfully grew the group,
        //and we can go ahead and add the object at the first open slot.
        this.members[i] = Object;
        this.length = i + 1;
        return Object;
    };
    Group.prototype.recycle = /**
    * Recycling is designed to help you reuse game objects without always re-allocating or "newing" them.
    *
    * <p>If you specified a maximum size for this group (like in Emitter),
    * then recycle will employ what we're calling "rotating" recycling.
    * Recycle() will first check to see if the group is at capacity yet.
    * If group is not yet at capacity, recycle() returns a new object.
    * If the group IS at capacity, then recycle() just returns the next object in line.</p>
    *
    * <p>If you did NOT specify a maximum size for this group,
    * then recycle() will employ what we're calling "grow-style" recycling.
    * Recycle() will return either the first object with exists == false,
    * or, finding none, add a new object to the array,
    * doubling the size of the array if necessary.</p>
    *
    * <p>WARNING: If this function needs to create a new object,
    * and no object class was provided, it will return null
    * instead of a valid object!</p>
    *
    * @param	ObjectClass		The class type you want to recycle (e.g. FlxBasic, EvilRobot, etc). Do NOT "new" the class in the parameter!
    *
    * @return	A reference to the object that was created.  Don't forget to cast it back to the Class you want (e.g. myObject = myGroup.recycle(myObjectClass) as myObjectClass;).
    */
    function (ObjectClass) {
        if (typeof ObjectClass === "undefined") { ObjectClass = null; }
        var basic;
        if(this._maxSize > 0) {
            if(this.length < this._maxSize) {
                if(ObjectClass == null) {
                    return null;
                }
                return this.add(new ObjectClass());
            } else {
                basic = this.members[this._marker++];
                if(this._marker >= this._maxSize) {
                    this._marker = 0;
                }
                return basic;
            }
        } else {
            basic = this.getFirstAvailable(ObjectClass);
            if(basic != null) {
                return basic;
            }
            if(ObjectClass == null) {
                return null;
            }
            return this.add(new ObjectClass());
        }
    };
    Group.prototype.remove = /**
    * Removes an object from the group.
    *
    * @param	Object	The <code>Basic</code> you want to remove.
    * @param	Splice	Whether the object should be cut from the array entirely or not.
    *
    * @return	The removed object.
    */
    function (Object, Splice) {
        if (typeof Splice === "undefined") { Splice = false; }
        var index = this.members.indexOf(Object);
        if((index < 0) || (index >= this.members.length)) {
            return null;
        }
        if(Splice) {
            this.members.splice(index, 1);
            this.length--;
        } else {
            this.members[index] = null;
        }
        return Object;
    };
    Group.prototype.replace = /**
    * Replaces an existing <code>Basic</code> with a new one.
    *
    * @param	OldObject	The object you want to replace.
    * @param	NewObject	The new object you want to use instead.
    *
    * @return	The new object.
    */
    function (OldObject, NewObject) {
        var index = this.members.indexOf(OldObject);
        if((index < 0) || (index >= this.members.length)) {
            return null;
        }
        this.members[index] = NewObject;
        return NewObject;
    };
    Group.prototype.sort = /**
    * Call this function to sort the group according to a particular value and order.
    * For example, to sort game objects for Zelda-style overlaps you might call
    * <code>myGroup.sort("y",Group.ASCENDING)</code> at the bottom of your
    * <code>FlxState.update()</code> override.  To sort all existing objects after
    * a big explosion or bomb attack, you might call <code>myGroup.sort("exists",Group.DESCENDING)</code>.
    *
    * @param	Index	The <code>string</code> name of the member variable you want to sort on.  Default value is "y".
    * @param	Order	A <code>Group</code> constant that defines the sort order.  Possible values are <code>Group.ASCENDING</code> and <code>Group.DESCENDING</code>.  Default value is <code>Group.ASCENDING</code>.
    */
    function (Index, Order) {
        if (typeof Index === "undefined") { Index = "y"; }
        if (typeof Order === "undefined") { Order = Group.ASCENDING; }
        this._sortIndex = Index;
        this._sortOrder = Order;
        this.members.sort(this.sortHandler);
    };
    Group.prototype.setAll = /**
    * Go through and set the specified variable to the specified value on all members of the group.
    *
    * @param	VariableName	The string representation of the variable name you want to modify, for example "visible" or "scrollFactor".
    * @param	Value			The value you want to assign to that variable.
    * @param	Recurse			Default value is true, meaning if <code>setAll()</code> encounters a member that is a group, it will call <code>setAll()</code> on that group rather than modifying its variable.
    */
    function (VariableName, Value, Recurse) {
        if (typeof Recurse === "undefined") { Recurse = true; }
        var basic;
        var i = 0;
        while(i < length) {
            basic = this.members[i++];
            if(basic != null) {
                if(Recurse && (basic.isGroup == true)) {
                    basic['setAll'](VariableName, Value, Recurse);
                } else {
                    basic[VariableName] = Value;
                }
            }
        }
    };
    Group.prototype.callAll = /**
    * Go through and call the specified function on all members of the group.
    * Currently only works on functions that have no required parameters.
    *
    * @param	FunctionName	The string representation of the function you want to call on each object, for example "kill()" or "init()".
    * @param	Recurse			Default value is true, meaning if <code>callAll()</code> encounters a member that is a group, it will call <code>callAll()</code> on that group rather than calling the group's function.
    */
    function (FunctionName, Recurse) {
        if (typeof Recurse === "undefined") { Recurse = true; }
        var basic;
        var i = 0;
        while(i < this.length) {
            basic = this.members[i++];
            if(basic != null) {
                if(Recurse && (basic.isGroup == true)) {
                    basic['callAll'](FunctionName, Recurse);
                } else {
                    basic[FunctionName]();
                }
            }
        }
    };
    Group.prototype.forEach = function (callback, Recurse) {
        if (typeof Recurse === "undefined") { Recurse = false; }
        var basic;
        var i = 0;
        while(i < this.length) {
            basic = this.members[i++];
            if(basic != null) {
                if(Recurse && (basic.isGroup == true)) {
                    basic.forEach(callback, true);
                } else {
                    callback.call(this, basic);
                }
            }
        }
    };
    Group.prototype.getFirstAvailable = /**
    * Call this function to retrieve the first object with exists == false in the group.
    * This is handy for recycling in general, e.g. respawning enemies.
    *
    * @param	ObjectClass		An optional parameter that lets you narrow the results to instances of this particular class.
    *
    * @return	A <code>Basic</code> currently flagged as not existing.
    */
    function (ObjectClass) {
        if (typeof ObjectClass === "undefined") { ObjectClass = null; }
        var basic;
        var i = 0;
        while(i < this.length) {
            basic = this.members[i++];
            if((basic != null) && !basic.exists && ((ObjectClass == null) || (typeof basic === ObjectClass))) {
                return basic;
            }
        }
        return null;
    };
    Group.prototype.getFirstNull = /**
    * Call this function to retrieve the first index set to 'null'.
    * Returns -1 if no index stores a null object.
    *
    * @return	An <code>int</code> indicating the first null slot in the group.
    */
    function () {
        var basic;
        var i = 0;
        var l = this.members.length;
        while(i < l) {
            if(this.members[i] == null) {
                return i;
            } else {
                i++;
            }
        }
        return -1;
    };
    Group.prototype.getFirstExtant = /**
    * Call this function to retrieve the first object with exists == true in the group.
    * This is handy for checking if everything's wiped out, or choosing a squad leader, etc.
    *
    * @return	A <code>Basic</code> currently flagged as existing.
    */
    function () {
        var basic;
        var i = 0;
        while(i < length) {
            basic = this.members[i++];
            if((basic != null) && basic.exists) {
                return basic;
            }
        }
        return null;
    };
    Group.prototype.getFirstAlive = /**
    * Call this function to retrieve the first object with dead == false in the group.
    * This is handy for checking if everything's wiped out, or choosing a squad leader, etc.
    *
    * @return	A <code>Basic</code> currently flagged as not dead.
    */
    function () {
        var basic;
        var i = 0;
        while(i < this.length) {
            basic = this.members[i++];
            if((basic != null) && basic.exists && basic.alive) {
                return basic;
            }
        }
        return null;
    };
    Group.prototype.getFirstDead = /**
    * Call this function to retrieve the first object with dead == true in the group.
    * This is handy for checking if everything's wiped out, or choosing a squad leader, etc.
    *
    * @return	A <code>Basic</code> currently flagged as dead.
    */
    function () {
        var basic;
        var i = 0;
        while(i < this.length) {
            basic = this.members[i++];
            if((basic != null) && !basic.alive) {
                return basic;
            }
        }
        return null;
    };
    Group.prototype.countLiving = /**
    * Call this function to find out how many members of the group are not dead.
    *
    * @return	The number of <code>Basic</code>s flagged as not dead.  Returns -1 if group is empty.
    */
    function () {
        var count = -1;
        var basic;
        var i = 0;
        while(i < this.length) {
            basic = this.members[i++];
            if(basic != null) {
                if(count < 0) {
                    count = 0;
                }
                if(basic.exists && basic.alive) {
                    count++;
                }
            }
        }
        return count;
    };
    Group.prototype.countDead = /**
    * Call this function to find out how many members of the group are dead.
    *
    * @return	The number of <code>Basic</code>s flagged as dead.  Returns -1 if group is empty.
    */
    function () {
        var count = -1;
        var basic;
        var i = 0;
        while(i < this.length) {
            basic = this.members[i++];
            if(basic != null) {
                if(count < 0) {
                    count = 0;
                }
                if(!basic.alive) {
                    count++;
                }
            }
        }
        return count;
    };
    Group.prototype.getRandom = /**
    * Returns a member at random from the group.
    *
    * @param	StartIndex	Optional offset off the front of the array. Default value is 0, or the beginning of the array.
    * @param	Length		Optional restriction on the number of values you want to randomly select from.
    *
    * @return	A <code>Basic</code> from the members list.
    */
    function (StartIndex, Length) {
        if (typeof StartIndex === "undefined") { StartIndex = 0; }
        if (typeof Length === "undefined") { Length = 0; }
        if(Length == 0) {
            Length = this.length;
        }
        return this._game.math.getRandom(this.members, StartIndex, Length);
    };
    Group.prototype.clear = /**
    * Remove all instances of <code>Basic</code> subclass (FlxBasic, FlxBlock, etc) from the list.
    * WARNING: does not destroy() or kill() any of these objects!
    */
    function () {
        this.length = this.members.length = 0;
    };
    Group.prototype.kill = /**
    * Calls kill on the group's members and then on the group itself.
    */
    function () {
        var basic;
        var i = 0;
        while(i < this.length) {
            basic = this.members[i++];
            if((basic != null) && basic.exists) {
                basic.kill();
            }
        }
    };
    Group.prototype.sortHandler = /**
    * Helper function for the sort process.
    *
    * @param 	Obj1	The first object being sorted.
    * @param	Obj2	The second object being sorted.
    *
    * @return	An integer value: -1 (Obj1 before Obj2), 0 (same), or 1 (Obj1 after Obj2).
    */
    function (Obj1, Obj2) {
        if(Obj1[this._sortIndex] < Obj2[this._sortIndex]) {
            return this._sortOrder;
        } else if(Obj1[this._sortIndex] > Obj2[this._sortIndex]) {
            return -this._sortOrder;
        }
        return 0;
    };
    return Group;
})(Basic);
/// <reference path="Sprite.ts" />
/**
* This is a simple particle class that extends the default behavior
* of <code>Sprite</code> to have slightly more specialized behavior
* common to many game scenarios.  You can override and extend this class
* just like you would <code>Sprite</code>. While <code>Emitter</code>
* used to work with just any old sprite, it now requires a
* <code>Particle</code> based class.
*
* @author Adam Atomic
* @author Richard Davey
*/
var Particle = (function (_super) {
    __extends(Particle, _super);
    /**
    * Instantiate a new particle.  Like <code>Sprite</code>, all meaningful creation
    * happens during <code>loadGraphic()</code> or <code>makeGraphic()</code> or whatever.
    */
    function Particle(game) {
        _super.call(this, game);
        this.lifespan = 0;
        this.friction = 500;
    }
    Particle.prototype.update = /**
    * The particle's main update logic.  Basically it checks to see if it should
    * be dead yet, and then has some special bounce behavior if there is some gravity on it.
    */
    function () {
        //lifespan behavior
        if(this.lifespan <= 0) {
            return;
        }
        this.lifespan -= this._game.time.elapsed;
        if(this.lifespan <= 0) {
            this.kill();
        }
        //simpler bounce/spin behavior for now
        if(this.touching) {
            if(this.angularVelocity != 0) {
                this.angularVelocity = -this.angularVelocity;
            }
        }
        if(this.acceleration.y > 0)//special behavior for particles with gravity
         {
            if(this.touching & GameObject.FLOOR) {
                this.drag.x = this.friction;
                if(!(this.wasTouching & GameObject.FLOOR)) {
                    if(this.velocity.y < -this.elasticity * 10) {
                        if(this.angularVelocity != 0) {
                            this.angularVelocity *= -this.elasticity;
                        }
                    } else {
                        this.velocity.y = 0;
                        this.angularVelocity = 0;
                    }
                }
            } else {
                this.drag.x = 0;
            }
        }
    };
    Particle.prototype.onEmit = /**
    * Triggered whenever this object is launched by a <code>Emitter</code>.
    * You can override this to add custom behavior like a sound or AI or something.
    */
    function () {
    };
    return Particle;
})(Sprite);
/// <reference path="Group.ts" />
/// <reference path="Particle.ts" />
/// <reference path="Point.ts" />
/**
* <code>Emitter</code> is a lightweight particle emitter.
* It can be used for one-time explosions or for
* continuous fx like rain and fire.  <code>Emitter</code>
* is not optimized or anything; all it does is launch
* <code>Particle</code> objects out at set intervals
* by setting their positions and velocities accordingly.
* It is easy to use and relatively efficient,
* relying on <code>Group</code>'s RECYCLE POWERS.
*
* @author	Adam Atomic
* @author	Richard Davey
*/
var Emitter = (function (_super) {
    __extends(Emitter, _super);
    /**
    * Creates a new <code>FlxEmitter</code> object at a specific position.
    * Does NOT automatically generate or attach particles!
    *
    * @param	X		The X position of the emitter.
    * @param	Y		The Y position of the emitter.
    * @param	Size	Optional, specifies a maximum capacity for this emitter.
    */
    function Emitter(game, X, Y, Size) {
        if (typeof X === "undefined") { X = 0; }
        if (typeof Y === "undefined") { Y = 0; }
        if (typeof Size === "undefined") { Size = 0; }
        _super.call(this, game, Size);
        this.x = X;
        this.y = Y;
        this.width = 0;
        this.height = 0;
        this.minParticleSpeed = new Point(-100, -100);
        this.maxParticleSpeed = new Point(100, 100);
        this.minRotation = -360;
        this.maxRotation = 360;
        this.gravity = 0;
        this.particleClass = null;
        this.particleDrag = new Point();
        this.frequency = 0.1;
        this.lifespan = 3;
        this.bounce = 0;
        this._quantity = 0;
        this._counter = 0;
        this._explode = true;
        this.on = false;
        this._point = new Point();
    }
    Emitter.prototype.destroy = /**
    * Clean up memory.
    */
    function () {
        this.minParticleSpeed = null;
        this.maxParticleSpeed = null;
        this.particleDrag = null;
        this.particleClass = null;
        this._point = null;
        _super.prototype.destroy.call(this);
    };
    Emitter.prototype.makeParticles = /**
    * This function generates a new array of particle sprites to attach to the emitter.
    *
    * @param	Graphics		If you opted to not pre-configure an array of FlxSprite objects, you can simply pass in a particle image or sprite sheet.
    * @param	Quantity		The number of particles to generate when using the "create from image" option.
    * @param	BakedRotations	How many frames of baked rotation to use (boosts performance).  Set to zero to not use baked rotations.
    * @param	Multiple		Whether the image in the Graphics param is a single particle or a bunch of particles (if it's a bunch, they need to be square!).
    * @param	Collide			Whether the particles should be flagged as not 'dead' (non-colliding particles are higher performance).  0 means no collisions, 0-1 controls scale of particle's bounding box.
    *
    * @return	This FlxEmitter instance (nice for chaining stuff together, if you're into that).
    */
    function (Graphics, Quantity, BakedRotations, Multiple, Collide) {
        if (typeof Quantity === "undefined") { Quantity = 50; }
        if (typeof BakedRotations === "undefined") { BakedRotations = 16; }
        if (typeof Multiple === "undefined") { Multiple = false; }
        if (typeof Collide === "undefined") { Collide = 0.8; }
        this.maxSize = Quantity;
        var totalFrames = 1;
        /*
        if(Multiple)
        {
        var sprite:Sprite = new Sprite(this._game);
        sprite.loadGraphic(Graphics,true);
        totalFrames = sprite.frames;
        sprite.destroy();
        }
        */
        var randomFrame;
        var particle;
        var i = 0;
        while(i < Quantity) {
            if(this.particleClass == null) {
                particle = new Particle(this._game);
            } else {
                particle = new this.particleClass(this._game);
            }
            if(Multiple) {
                /*
                randomFrame = this._game.math.random()*totalFrames;
                if(BakedRotations > 0)
                particle.loadRotatedGraphic(Graphics,BakedRotations,randomFrame);
                else
                {
                particle.loadGraphic(Graphics,true);
                particle.frame = randomFrame;
                }
                */
                            } else {
                /*
                if (BakedRotations > 0)
                particle.loadRotatedGraphic(Graphics,BakedRotations);
                else
                particle.loadGraphic(Graphics);
                */
                if(Graphics) {
                    particle.loadGraphic(Graphics);
                }
            }
            if(Collide > 0) {
                particle.width *= Collide;
                particle.height *= Collide;
                //particle.centerOffsets();
                            } else {
                particle.allowCollisions = GameObject.NONE;
            }
            particle.exists = false;
            this.add(particle);
            i++;
        }
        return this;
    };
    Emitter.prototype.update = /**
    * Called automatically by the game loop, decides when to launch particles and when to "die".
    */
    function () {
        if(this.on) {
            if(this._explode) {
                this.on = false;
                var i = 0;
                var l = this._quantity;
                if((l <= 0) || (l > this.length)) {
                    l = this.length;
                }
                while(i < l) {
                    this.emitParticle();
                    i++;
                }
                this._quantity = 0;
            } else {
                this._timer += this._game.time.elapsed;
                while((this.frequency > 0) && (this._timer > this.frequency) && this.on) {
                    this._timer -= this.frequency;
                    this.emitParticle();
                    if((this._quantity > 0) && (++this._counter >= this._quantity)) {
                        this.on = false;
                        this._quantity = 0;
                    }
                }
            }
        }
        _super.prototype.update.call(this);
    };
    Emitter.prototype.kill = /**
    * Call this function to turn off all the particles and the emitter.
    */
    function () {
        this.on = false;
        _super.prototype.kill.call(this);
    };
    Emitter.prototype.start = /**
    * Call this function to start emitting particles.
    *
    * @param	Explode		Whether the particles should all burst out at once.
    * @param	Lifespan	How long each particle lives once emitted. 0 = forever.
    * @param	Frequency	Ignored if Explode is set to true. Frequency is how often to emit a particle. 0 = never emit, 0.1 = 1 particle every 0.1 seconds, 5 = 1 particle every 5 seconds.
    * @param	Quantity	How many particles to launch. 0 = "all of the particles".
    */
    function (Explode, Lifespan, Frequency, Quantity) {
        if (typeof Explode === "undefined") { Explode = true; }
        if (typeof Lifespan === "undefined") { Lifespan = 0; }
        if (typeof Frequency === "undefined") { Frequency = 0.1; }
        if (typeof Quantity === "undefined") { Quantity = 0; }
        this.revive();
        this.visible = true;
        this.on = true;
        this._explode = Explode;
        this.lifespan = Lifespan;
        this.frequency = Frequency;
        this._quantity += Quantity;
        this._counter = 0;
        this._timer = 0;
    };
    Emitter.prototype.emitParticle = /**
    * This function can be used both internally and externally to emit the next particle.
    */
    function () {
        var particle = this.recycle(Particle);
        particle.lifespan = this.lifespan;
        particle.elasticity = this.bounce;
        particle.reset(this.x - (particle.width >> 1) + this._game.math.random() * this.width, this.y - (particle.height >> 1) + this._game.math.random() * this.height);
        particle.visible = true;
        if(this.minParticleSpeed.x != this.maxParticleSpeed.x) {
            particle.velocity.x = this.minParticleSpeed.x + this._game.math.random() * (this.maxParticleSpeed.x - this.minParticleSpeed.x);
        } else {
            particle.velocity.x = this.minParticleSpeed.x;
        }
        if(this.minParticleSpeed.y != this.maxParticleSpeed.y) {
            particle.velocity.y = this.minParticleSpeed.y + this._game.math.random() * (this.maxParticleSpeed.y - this.minParticleSpeed.y);
        } else {
            particle.velocity.y = this.minParticleSpeed.y;
        }
        particle.acceleration.y = this.gravity;
        if(this.minRotation != this.maxRotation) {
            particle.angularVelocity = this.minRotation + this._game.math.random() * (this.maxRotation - this.minRotation);
        } else {
            particle.angularVelocity = this.minRotation;
        }
        if(particle.angularVelocity != 0) {
            particle.angle = this._game.math.random() * 360 - 180;
        }
        particle.drag.x = this.particleDrag.x;
        particle.drag.y = this.particleDrag.y;
        particle.onEmit();
    };
    Emitter.prototype.setSize = /**
    * A more compact way of setting the width and height of the emitter.
    *
    * @param	Width	The desired width of the emitter (particles are spawned randomly within these dimensions).
    * @param	Height	The desired height of the emitter.
    */
    function (Width, Height) {
        this.width = Width;
        this.height = Height;
    };
    Emitter.prototype.setXSpeed = /**
    * A more compact way of setting the X velocity range of the emitter.
    *
    * @param	Min		The minimum value for this range.
    * @param	Max		The maximum value for this range.
    */
    function (Min, Max) {
        if (typeof Min === "undefined") { Min = 0; }
        if (typeof Max === "undefined") { Max = 0; }
        this.minParticleSpeed.x = Min;
        this.maxParticleSpeed.x = Max;
    };
    Emitter.prototype.setYSpeed = /**
    * A more compact way of setting the Y velocity range of the emitter.
    *
    * @param	Min		The minimum value for this range.
    * @param	Max		The maximum value for this range.
    */
    function (Min, Max) {
        if (typeof Min === "undefined") { Min = 0; }
        if (typeof Max === "undefined") { Max = 0; }
        this.minParticleSpeed.y = Min;
        this.maxParticleSpeed.y = Max;
    };
    Emitter.prototype.setRotation = /**
    * A more compact way of setting the angular velocity constraints of the emitter.
    *
    * @param	Min		The minimum value for this range.
    * @param	Max		The maximum value for this range.
    */
    function (Min, Max) {
        if (typeof Min === "undefined") { Min = 0; }
        if (typeof Max === "undefined") { Max = 0; }
        this.minRotation = Min;
        this.maxRotation = Max;
    };
    Emitter.prototype.at = /**
    * Change the emitter's midpoint to match the midpoint of a <code>FlxObject</code>.
    *
    * @param	Object		The <code>FlxObject</code> that you want to sync up with.
    */
    function (Object) {
        Object.getMidpoint(this._point);
        this.x = this._point.x - (this.width >> 1);
        this.y = this._point.y - (this.height >> 1);
    };
    return Emitter;
})(Group);
/// <reference path="Cache.ts" />
var Loader = (function () {
    function Loader(game, callback) {
        this._game = game;
        this._gameCreateComplete = callback;
        this._keys = [];
        this._fileList = {
        };
        this._xhr = new XMLHttpRequest();
    }
    Loader.prototype.checkKeyExists = function (key) {
        if(this._fileList[key]) {
            return true;
        } else {
            return false;
        }
    };
    Loader.prototype.addImageFile = function (key, url) {
        if(this.checkKeyExists(key) === false) {
            this._fileList[key] = {
                type: 'image',
                key: key,
                url: url,
                data: null,
                error: false,
                loaded: false
            };
            this._keys.push(key);
        }
    };
    Loader.prototype.addSpriteSheet = function (key, url, frameWidth, frameHeight, frameMax) {
        if (typeof frameMax === "undefined") { frameMax = -1; }
        if(this.checkKeyExists(key) === false) {
            this._fileList[key] = {
                type: 'spritesheet',
                key: key,
                url: url,
                data: null,
                frameWidth: frameWidth,
                frameHeight: frameHeight,
                frameMax: frameMax,
                error: false,
                loaded: false
            };
            this._keys.push(key);
        }
    };
    Loader.prototype.addTextureAtlas = function (key, url, jsonURL, jsonData) {
        if (typeof jsonURL === "undefined") { jsonURL = null; }
        if (typeof jsonData === "undefined") { jsonData = null; }
        //console.log('addTextureAtlas');
        //console.log(typeof jsonData);
        if(this.checkKeyExists(key) === false) {
            if(jsonURL !== null) {
                //console.log('A URL to a json file has been given');
                //  A URL to a json file has been given
                this._fileList[key] = {
                    type: 'textureatlas',
                    key: key,
                    url: url,
                    data: null,
                    jsonURL: jsonURL,
                    jsonData: null,
                    error: false,
                    loaded: false
                };
                this._keys.push(key);
            } else {
                //  A json string or object has been given
                if(typeof jsonData === 'string') {
                    //console.log('A json string has been given');
                    var data = JSON.parse(jsonData);
                    //console.log(data);
                    //  Malformed?
                    if(data['frames']) {
                        //console.log('frames array found');
                        this._fileList[key] = {
                            type: 'textureatlas',
                            key: key,
                            url: url,
                            data: null,
                            jsonURL: null,
                            jsonData: data['frames'],
                            error: false,
                            loaded: false
                        };
                        this._keys.push(key);
                    }
                } else {
                    //console.log('A json object has been given', jsonData);
                    //  Malformed?
                    if(jsonData['frames']) {
                        //console.log('frames array found');
                        this._fileList[key] = {
                            type: 'textureatlas',
                            key: key,
                            url: url,
                            data: null,
                            jsonURL: null,
                            jsonData: jsonData['frames'],
                            error: false,
                            loaded: false
                        };
                        this._keys.push(key);
                    }
                }
            }
        }
    };
    Loader.prototype.addAudioFile = function (key, url) {
        if(this.checkKeyExists(key) === false) {
            this._fileList[key] = {
                type: 'audio',
                key: key,
                url: url,
                data: null,
                buffer: null,
                error: false,
                loaded: false
            };
            this._keys.push(key);
        }
    };
    Loader.prototype.addTextFile = function (key, url) {
        if(this.checkKeyExists(key) === false) {
            this._fileList[key] = {
                type: 'text',
                key: key,
                url: url,
                data: null,
                error: false,
                loaded: false
            };
            this._keys.push(key);
        }
    };
    Loader.prototype.removeFile = function (key) {
        delete this._fileList[key];
    };
    Loader.prototype.removeAll = function () {
        this._fileList = {
        };
    };
    Loader.prototype.load = function (onFileLoadCallback, onCompleteCallback) {
        if (typeof onFileLoadCallback === "undefined") { onFileLoadCallback = null; }
        if (typeof onCompleteCallback === "undefined") { onCompleteCallback = null; }
        this.progress = 0;
        this.hasLoaded = false;
        this._onComplete = onCompleteCallback;
        if(onCompleteCallback == null) {
            this._onComplete = this._game.onCreateCallback;
        }
        this._onFileLoad = onFileLoadCallback;
        if(this._keys.length > 0) {
            this._progressChunk = 100 / this._keys.length;
            this.loadFile();
        } else {
            this.progress = 1;
            this.hasLoaded = true;
            this._gameCreateComplete.call(this._game);
            if(this._onComplete !== null) {
                this._onComplete.call(this._game.callbackContext);
            }
        }
    };
    Loader.prototype.loadFile = function () {
        var _this = this;
        var file = this._fileList[this._keys.pop()];
        //  Image or Data?
        switch(file.type) {
            case 'image':
            case 'spritesheet':
            case 'textureatlas':
                file.data = new Image();
                file.data.name = file.key;
                file.data.onload = function () {
                    return _this.fileComplete(file.key);
                };
                file.data.onerror = function () {
                    return _this.fileError(file.key);
                };
                file.data.src = file.url;
                break;
            case 'audio':
                this._xhr.open("GET", file.url, true);
                this._xhr.responseType = "arraybuffer";
                this._xhr.onload = function () {
                    return _this.fileComplete(file.key);
                };
                this._xhr.onerror = function () {
                    return _this.fileError(file.key);
                };
                this._xhr.send();
                break;
            case 'text':
                this._xhr.open("GET", file.url, true);
                this._xhr.responseType = "text";
                this._xhr.onload = function () {
                    return _this.fileComplete(file.key);
                };
                this._xhr.onerror = function () {
                    return _this.fileError(file.key);
                };
                this._xhr.send();
                break;
        }
    };
    Loader.prototype.fileError = function (key) {
        this._fileList[key].loaded = true;
        this._fileList[key].error = true;
        this.nextFile(key, false);
    };
    Loader.prototype.fileComplete = function (key) {
        var _this = this;
        this._fileList[key].loaded = true;
        var file = this._fileList[key];
        var loadNext = true;
        switch(file.type) {
            case 'image':
                this._game.cache.addImage(file.key, file.url, file.data);
                break;
            case 'spritesheet':
                this._game.cache.addSpriteSheet(file.key, file.url, file.data, file.frameWidth, file.frameHeight, file.frameMax);
                break;
            case 'textureatlas':
                //console.log('texture atlas loaded');
                if(file.jsonURL == null) {
                    this._game.cache.addTextureAtlas(file.key, file.url, file.data, file.jsonData);
                } else {
                    //  Load the JSON before carrying on with the next file
                    //console.log('Loading the JSON before carrying on with the next file');
                    loadNext = false;
                    this._xhr.open("GET", file.jsonURL, true);
                    this._xhr.responseType = "text";
                    this._xhr.onload = function () {
                        return _this.jsonLoadComplete(file.key);
                    };
                    this._xhr.onerror = function () {
                        return _this.jsonLoadError(file.key);
                    };
                    this._xhr.send();
                }
                break;
            case 'audio':
                file.data = this._xhr.response;
                this._game.cache.addSound(file.key, file.url, file.data);
                break;
            case 'text':
                file.data = this._xhr.response;
                this._game.cache.addText(file.key, file.url, file.data);
                break;
        }
        if(loadNext) {
            this.nextFile(key, true);
        }
    };
    Loader.prototype.jsonLoadComplete = function (key) {
        //console.log('json load complete');
        var data = JSON.parse(this._xhr.response);
        //console.log(data);
        //  Malformed?
        if(data['frames']) {
            var file = this._fileList[key];
            this._game.cache.addTextureAtlas(file.key, file.url, file.data, data['frames']);
        }
        this.nextFile(key, true);
    };
    Loader.prototype.jsonLoadError = function (key) {
        //console.log('json load error');
        var file = this._fileList[key];
        file.error = true;
        this.nextFile(key, true);
    };
    Loader.prototype.nextFile = function (previousKey, success) {
        this.progress = Math.round(this.progress + this._progressChunk);
        if(this._onFileLoad) {
            this._onFileLoad.call(this._game.callbackContext, this.progress, previousKey, success);
        }
        if(this._keys.length > 0) {
            this.loadFile();
        } else {
            this.hasLoaded = true;
            this.removeAll();
            this._gameCreateComplete.call(this._game);
            if(this._onComplete !== null) {
                this._onComplete.call(this._game.callbackContext);
            }
        }
    };
    return Loader;
})();
var SoundManager = (function () {
    function SoundManager(game) {
        this._context = null;
        this._game = game;
        if(!!window['AudioContext']) {
            this._context = new window['AudioContext']();
        } else if(!!window['webkitAudioContext']) {
            this._context = new window['webkitAudioContext']();
        }
        if(this._context !== null) {
            this._gainNode = this._context.createGainNode();
            this._gainNode.connect(this._context.destination);
            this._volume = 1;
        }
    }
    SoundManager.prototype.mute = function () {
        this._gainNode.gain.value = 0;
    };
    SoundManager.prototype.unmute = function () {
        this._gainNode.gain.value = this._volume;
    };
    Object.defineProperty(SoundManager.prototype, "volume", {
        get: function () {
            return this._volume;
        },
        set: function (value) {
            this._volume = value;
            this._gainNode.gain.value = this._volume;
        },
        enumerable: true,
        configurable: true
    });
    SoundManager.prototype.decode = function (key, callback, sound) {
        if (typeof callback === "undefined") { callback = null; }
        if (typeof sound === "undefined") { sound = null; }
        var soundData = this._game.cache.getSound(key);
        if(soundData) {
            if(this._game.cache.isSoundDecoded(key) === false) {
                var that = this;
                this._context.decodeAudioData(soundData, function (buffer) {
                    that._game.cache.decodedSound(key, buffer);
                    if(sound) {
                        sound.setDecodedBuffer(buffer);
                    }
                    callback();
                });
            }
        }
    };
    SoundManager.prototype.play = function (key, volume, loop) {
        if (typeof volume === "undefined") { volume = 1; }
        if (typeof loop === "undefined") { loop = false; }
        var _this = this;
        if(this._context === null) {
            return;
        }
        var soundData = this._game.cache.getSound(key);
        if(soundData) {
            //  Does the sound need decoding?
            if(this._game.cache.isSoundDecoded(key) === true) {
                return new Sound(this._context, this._gainNode, soundData, volume, loop);
            } else {
                var tempSound = new Sound(this._context, this._gainNode, null, volume, loop);
                //  this is an async process, so we can return the Sound object anyway, it just won't be playing yet
                this.decode(key, function () {
                    return _this.play(key);
                }, tempSound);
                return tempSound;
            }
        }
    };
    return SoundManager;
})();
var Sound = (function () {
    function Sound(context, gainNode, data, volume, loop) {
        if (typeof volume === "undefined") { volume = 1; }
        if (typeof loop === "undefined") { loop = false; }
        this.loop = false;
        this.isPlaying = false;
        this.isDecoding = false;
        this._context = context;
        this._gainNode = gainNode;
        this._buffer = data;
        this._volume = volume;
        this.loop = loop;
        //  Local volume control
        if(this._context !== null) {
            this._localGainNode = this._context.createGainNode();
            this._localGainNode.connect(this._gainNode);
            this._localGainNode.gain.value = this._volume;
        }
        if(this._buffer === null) {
            this.isDecoding = true;
        } else {
            this.play();
        }
    }
    Sound.prototype.setDecodedBuffer = function (data) {
        this._buffer = data;
        this.isDecoding = false;
        this.play();
    };
    Sound.prototype.play = function () {
        if(this._buffer === null || this.isDecoding === true) {
            return;
        }
        this._sound = this._context.createBufferSource();
        this._sound.buffer = this._buffer;
        this._sound.connect(this._localGainNode);
        if(this.loop) {
            this._sound.loop = true;
        }
        this._sound.noteOn(0)// the zero is vitally important, crashes iOS6 without it
        ;
        this.duration = this._sound.buffer.duration;
        this.isPlaying = true;
    };
    Sound.prototype.stop = function () {
        if(this.isPlaying === true) {
            this.isPlaying = false;
            this._sound.noteOff(0);
        }
    };
    Sound.prototype.mute = function () {
        this._localGainNode.gain.value = 0;
    };
    Sound.prototype.unmute = function () {
        this._localGainNode.gain.value = this._volume;
    };
    Object.defineProperty(Sound.prototype, "volume", {
        get: function () {
            return this._volume;
        },
        set: function (value) {
            this._volume = value;
            this._localGainNode.gain.value = this._volume;
        },
        enumerable: true,
        configurable: true
    });
    return Sound;
})();
/// <reference path="Game.ts" />
/// <reference path="Point.ts" />
/// <reference path="Rectangle.ts" />
var Stage = (function () {
    function Stage(game, parent, width, height) {
        var _this = this;
        this.clear = true;
        this._logo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAO1JREFUeNpi/P//PwM6YGRkxBQEAqBaRnQxFmwa10d6MAjrMqMofHv5L1we2SBGmAtAktg0ogOQQYHLd8ANYYFpPtTmzUAMAFmwnsEDrAdkCAvMZlIAsiFMMAEYsKvaSrQhIMCELkGsV2AAbIC8gCQYgwKIUABiNYBf9yoYH7n7n6CzN274g2IYEyFbsNmKLIaSkHpP7WSwUfbA0ASzFQRslBlxp0RcAF0TRhggA3zhAJIDpUKU5A9KyshpHDkjFZu5g2nJMFcwXVJSgqIGnBKx5bKenh4w/XzVbgbPtlIUcVgSxuoCUgHIIIAAAwArtXwJBABO6QAAAABJRU5ErkJggg==";
        this._game = game;
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        if(document.getElementById(parent)) {
            document.getElementById(parent).appendChild(this.canvas);
        } else {
            document.body.appendChild(this.canvas);
        }
        var offset = this.getOffset(this.canvas);
        this.bounds = new Rectangle(offset.x, offset.y, width, height);
        this.context = this.canvas.getContext('2d');
        //document.addEventListener('visibilitychange', (event) => this.visibilityChange(event), false);
        //document.addEventListener('webkitvisibilitychange', (event) => this.visibilityChange(event), false);
        window.onblur = function (event) {
            return _this.visibilityChange(event);
        };
        window.onfocus = function (event) {
            return _this.visibilityChange(event);
        };
    }
    Stage.prototype.update = function () {
        if(this.clear) {
            //  implement dirty rect? could take up more cpu time than it saves. needs benching.
            this.context.clearRect(0, 0, this.width, this.height);
        }
    };
    Stage.prototype.renderDebugInfo = function () {
        this.context.fillStyle = 'rgb(255,255,255)';
        this.context.fillText(Game.VERSION, 10, 20);
        this.context.fillText('Game Size: ' + this.width + ' x ' + this.height, 10, 40);
        this.context.fillText('x: ' + this.x + ' y: ' + this.y, 10, 60);
    };
    Stage.prototype.visibilityChange = function (event) {
        if(event.type == 'blur' && this._game.pause == false && this._game.isBooted == true) {
            this._game.pause = true;
            this.drawPauseScreen();
        } else if(event.type == 'focus') {
            this._game.pause = false;
        }
        //if (document['hidden'] === true || document['webkitHidden'] === true)
            };
    Stage.prototype.drawInitScreen = function () {
        this.context.fillStyle = 'rgb(40, 40, 40)';
        this.context.fillRect(0, 0, this.width, this.height);
        this.context.fillStyle = 'rgb(255,255,255)';
        this.context.font = 'bold 18px Arial';
        this.context.textBaseline = 'top';
        this.context.fillText(Game.VERSION, 54, 32);
        this.context.fillText('Game Size: ' + this.width + ' x ' + this.height, 32, 64);
        this.context.fillText('www.photonstorm.com', 32, 96);
        this.context.font = '16px Arial';
        this.context.fillText('You are seeing this screen because you didn\'t specify any default', 32, 160);
        this.context.fillText('functions in the Game constructor, or use Game.loadState()', 32, 184);
        var image = new Image();
        var that = this;
        image.onload = function () {
            that.context.drawImage(image, 32, 32);
        };
        image.src = this._logo;
    };
    Stage.prototype.drawPauseScreen = function () {
        this.context.fillStyle = 'rgba(0, 0, 0, 0.4)';
        this.context.fillRect(0, 0, this.width, this.height);
        //  Draw a 'play' arrow
        var arrowWidth = Math.round(this.width / 2);
        var arrowHeight = Math.round(this.height / 2);
        var sx = this.centerX - arrowWidth / 2;
        var sy = this.centerY - arrowHeight / 2;
        this.context.beginPath();
        this.context.moveTo(sx, sy);
        this.context.lineTo(sx, sy + arrowHeight);
        this.context.lineTo(sx + arrowWidth, this.centerY);
        this.context.closePath();
        this.context.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.context.fill();
    };
    Stage.prototype.getOffset = function (element) {
        var box = element.getBoundingClientRect();
        var clientTop = element.clientTop || document.body.clientTop || 0;
        var clientLeft = element.clientLeft || document.body.clientLeft || 0;
        var scrollTop = window.pageYOffset || element.scrollTop || document.body.scrollTop;
        var scrollLeft = window.pageXOffset || element.scrollLeft || document.body.scrollLeft;
        return new Point(box.left + scrollLeft - clientLeft, box.top + scrollTop - clientTop);
    };
    Object.defineProperty(Stage.prototype, "backgroundColor", {
        get: function () {
            return this._bgColor;
        },
        set: function (color) {
            this.canvas.style.backgroundColor = color;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stage.prototype, "x", {
        get: function () {
            return this.bounds.x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stage.prototype, "y", {
        get: function () {
            return this.bounds.y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stage.prototype, "width", {
        get: function () {
            return this.bounds.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stage.prototype, "height", {
        get: function () {
            return this.bounds.height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stage.prototype, "centerX", {
        get: function () {
            return this.bounds.halfWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stage.prototype, "centerY", {
        get: function () {
            return this.bounds.halfHeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stage.prototype, "randomX", {
        get: function () {
            return Math.round(Math.random() * this.bounds.width);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stage.prototype, "randomY", {
        get: function () {
            return Math.round(Math.random() * this.bounds.height);
        },
        enumerable: true,
        configurable: true
    });
    return Stage;
})();
var Time = (function () {
    function Time(game) {
        this.timeScale = 1.0;
        this.elapsed = 0;
        /**
        *
        * @property time
        * @type Number
        */
        this.time = 0;
        /**
        *
        * @property now
        * @type Number
        */
        this.now = 0;
        /**
        *
        * @property delta
        * @type Number
        */
        this.delta = 0;
        this.fps = 0;
        this.fpsMin = 1000;
        this.fpsMax = 0;
        this.msMin = 1000;
        this.msMax = 0;
        this.frames = 0;
        this._timeLastSecond = 0;
        this._started = Date.now();
        this._timeLastSecond = this._started;
        this.time = this._started;
    }
    Object.defineProperty(Time.prototype, "totalElapsedSeconds", {
        get: /**
        *
        * @method totalElapsedSeconds
        * @return {Number}
        */
        function () {
            return (this.now - this._started) * 0.001;
        },
        enumerable: true,
        configurable: true
    });
    Time.prototype.update = /**
    *
    * @method update
    */
    function () {
        // Can we use performance.now() ?
        this.now = Date.now()// mark
        ;
        this.delta = this.now - this.time// elapsedMS
        ;
        this.msMin = Math.min(this.msMin, this.delta);
        this.msMax = Math.max(this.msMax, this.delta);
        this.frames++;
        if(this.now > this._timeLastSecond + 1000) {
            this.fps = Math.round((this.frames * 1000) / (this.now - this._timeLastSecond));
            this.fpsMin = Math.min(this.fpsMin, this.fps);
            this.fpsMax = Math.max(this.fpsMax, this.fps);
            this._timeLastSecond = this.now;
            this.frames = 0;
        }
        this.time = this.now// _total
        ;
        ////  Lock the delta at 0.1 to minimise fps tunneling
        //if (this.delta > 0.1)
        //{
        //    this.delta = 0.1;
        //}
            };
    Time.prototype.elapsedSince = /**
    *
    * @method elapsedSince
    * @param {Number} since
    * @return {Number}
    */
    function (since) {
        return this.now - since;
    };
    Time.prototype.elapsedSecondsSince = /**
    *
    * @method elapsedSecondsSince
    * @param {Number} since
    * @return {Number}
    */
    function (since) {
        return (this.now - since) * 0.001;
    };
    Time.prototype.reset = /**
    *
    * @method reset
    */
    function () {
        this._started = this.now;
    };
    return Time;
})();
/// <reference path="../Game.ts" />
/// <reference path="../GameObject.ts" />
/// <reference path="../Tilemap.ts" />
/// <reference path="../Rectangle.ts" />
/// <reference path="Camera.ts" />
/**
* A Tilemap Buffer
*
* @author	Richard Davey
*/
var TilemapBuffer = (function () {
    function TilemapBuffer(game, camera, tilemap, texture, tileOffsets) {
        this._startX = 0;
        this._maxX = 0;
        this._startY = 0;
        this._maxY = 0;
        this._tx = 0;
        this._ty = 0;
        this._dx = 0;
        this._dy = 0;
        this._oldCameraX = 0;
        this._oldCameraY = 0;
        this._dirty = true;
        //console.log('New TilemapBuffer created for Camera ' + camera.ID);
        this._game = game;
        this.camera = camera;
        this._tilemap = tilemap;
        this._texture = texture;
        this._tileOffsets = tileOffsets;
        //this.createCanvas();
            }
    TilemapBuffer.prototype.createCanvas = function () {
        this.canvas = document.createElement('canvas');
        this.canvas.width = this._game.stage.width;
        this.canvas.height = this._game.stage.height;
        this.context = this.canvas.getContext('2d');
    };
    TilemapBuffer.prototype.update = function () {
        /*
        if (this.camera.worldView.x !== this._oldCameraX || this.camera.worldView.y !== this._oldCameraY)
        {
        this._dirty = true;
        }
        
        this._oldCameraX = this.camera.worldView.x;
        this._oldCameraY = this.camera.worldView.y;
        */
            };
    TilemapBuffer.prototype.renderDebugInfo = function (x, y, color) {
        if (typeof color === "undefined") { color = 'rgb(255,255,255)'; }
        this._game.stage.context.fillStyle = color;
        this._game.stage.context.fillText('TilemapBuffer', x, y);
        this._game.stage.context.fillText('startX: ' + this._startX + ' endX: ' + this._maxX, x, y + 14);
        this._game.stage.context.fillText('startY: ' + this._startY + ' endY: ' + this._maxY, x, y + 28);
        this._game.stage.context.fillText('dx: ' + this._dx + ' dy: ' + this._dy, x, y + 42);
        this._game.stage.context.fillText('Dirty: ' + this._dirty, x, y + 56);
    };
    TilemapBuffer.prototype.render = function (dx, dy) {
        /*
        if (this._dirty == false)
        {
        this._game.stage.context.drawImage(this.canvas, 0, 0);
        
        return true;
        }
        */
        //  Work out how many tiles we can fit into our camera and round it up for the edges
        this._maxX = this._game.math.ceil(this.camera.width / this._tilemap.tileWidth) + 1;
        this._maxY = this._game.math.ceil(this.camera.height / this._tilemap.tileHeight) + 1;
        //  And now work out where in the tilemap the camera actually is
        this._startX = this._game.math.floor(this.camera.worldView.x / this._tilemap.tileWidth);
        this._startY = this._game.math.floor(this.camera.worldView.y / this._tilemap.tileHeight);
        //  Tilemap bounds check
        if(this._startX < 0) {
            this._startX = 0;
        }
        if(this._startY < 0) {
            this._startY = 0;
        }
        if(this._startX + this._maxX > this._tilemap.widthInTiles) {
            this._startX = this._tilemap.widthInTiles - this._maxX;
        }
        if(this._startY + this._maxY > this._tilemap.heightInTiles) {
            this._startY = this._tilemap.heightInTiles - this._maxY;
        }
        //  Finally get the offset to avoid the blocky movement
        this._dx = dx;
        this._dy = dy;
        this._dx += -(this.camera.worldView.x - (this._startX * this._tilemap.tileWidth));
        this._dy += -(this.camera.worldView.y - (this._startY * this._tilemap.tileHeight));
        this._tx = this._dx;
        this._ty = this._dy;
        for(var row = this._startY; row < this._startY + this._maxY; row++) {
            this._columnData = this._tilemap.mapData[row];
            for(var tile = this._startX; tile < this._startX + this._maxX; tile++) {
                if(this._tileOffsets[this._columnData[tile]]) {
                    //this.context.drawImage(
                    this._game.stage.context.drawImage(this._texture, // Source Image
                    this._tileOffsets[this._columnData[tile]].x, // Source X (location within the source image)
                    this._tileOffsets[this._columnData[tile]].y, // Source Y
                    this._tilemap.tileWidth, //	Source Width
                    this._tilemap.tileHeight, //	Source Height
                    this._tx, //	Destination X (where on the canvas it'll be drawn)
                    this._ty, //	Destination Y
                    this._tilemap.tileWidth, //	Destination Width (always same as Source Width unless scaled)
                    this._tilemap.tileHeight);
                    //	Destination Height (always same as Source Height unless scaled)
                    this._tx += this._tilemap.tileWidth;
                }
            }
            this._tx = this._dx;
            this._ty += this._tilemap.tileHeight;
        }
        //this._game.stage.context.drawImage(this.canvas, 0, 0);
        //console.log('dirty cleaned');
        //this._dirty = false;
        return true;
    };
    return TilemapBuffer;
})();
/// <reference path="Game.ts" />
/// <reference path="GameObject.ts" />
/// <reference path="Point.ts" />
/// <reference path="Rectangle.ts" />
/// <reference path="system/TilemapBuffer.ts" />
var Tilemap = (function (_super) {
    __extends(Tilemap, _super);
    function Tilemap(game, key, mapData, format, tileWidth, tileHeight) {
        if (typeof tileWidth === "undefined") { tileWidth = 0; }
        if (typeof tileHeight === "undefined") { tileHeight = 0; }
        _super.call(this, game);
        this._dx = 0;
        this._dy = 0;
        this.widthInTiles = 0;
        this.heightInTiles = 0;
        this.widthInPixels = 0;
        this.heightInPixels = 0;
        //  How many extra tiles to draw around the edge of the screen (for fast scrolling games, or to optimise mobile performance try increasing this)
        //  The number is the amount of extra tiles PER SIDE, so a value of 10 would be (10 tiles + screen size + 10 tiles)
        this.tileBoundary = 10;
        this._texture = this._game.cache.getImage(key);
        this._tilemapBuffers = [];
        this.isGroup = false;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.boundsInTiles = new Rectangle();
        this.mapFormat = format;
        switch(format) {
            case Tilemap.FORMAT_CSV:
                this.parseCSV(game.cache.getText(mapData));
                break;
            case Tilemap.FORMAT_TILED_JSON:
                this.parseTiledJSON(game.cache.getText(mapData));
                break;
        }
        this.parseTileOffsets();
        this.createTilemapBuffers();
    }
    Tilemap.FORMAT_CSV = 0;
    Tilemap.FORMAT_TILED_JSON = 1;
    Tilemap.prototype.parseCSV = function (data) {
        //console.log('parseMapData');
        this.mapData = [];
        //  Trim any rogue whitespace from the data
        data = data.trim();
        var rows = data.split("\n");
        //console.log('rows', rows);
        for(var i = 0; i < rows.length; i++) {
            var column = rows[i].split(",");
            //console.log('column', column);
            var output = [];
            if(column.length > 0) {
                //  Set the width based on the first row
                if(this.widthInTiles == 0) {
                    //  Maybe -1?
                    this.widthInTiles = column.length;
                }
                //  We have a new row of tiles
                this.heightInTiles++;
                //  Parse it
                for(var c = 0; c < column.length; c++) {
                    output[c] = parseInt(column[c]);
                }
                this.mapData.push(output);
            }
        }
        //console.log('final map array');
        //console.log(this.mapData);
        if(this.widthInTiles > 0) {
            this.widthInPixels = this.tileWidth * this.widthInTiles;
        }
        if(this.heightInTiles > 0) {
            this.heightInPixels = this.tileHeight * this.heightInTiles;
        }
        this.boundsInTiles.setTo(0, 0, this.widthInTiles, this.heightInTiles);
    };
    Tilemap.prototype.parseTiledJSON = function (data) {
        console.log('parseTiledJSON');
        this.mapData = [];
        //  Trim any rogue whitespace from the data
        data = data.trim();
        //  We ought to change this soon, so we have layer support, but for now let's just get it working
        var json = JSON.parse(data);
        //  Right now we assume no errors at all with the parsing (safe I know)
        this.tileWidth = json.tilewidth;
        this.tileHeight = json.tileheight;
        //  Parse the first layer only
        this.widthInTiles = json.layers[0].width;
        this.heightInTiles = json.layers[0].height;
        this.widthInPixels = this.widthInTiles * this.tileWidth;
        this.heightInPixels = this.heightInTiles * this.tileHeight;
        this.boundsInTiles.setTo(0, 0, this.widthInTiles, this.heightInTiles);
        console.log('width in tiles', this.widthInTiles);
        console.log('height in tiles', this.heightInTiles);
        console.log('width in px', this.widthInPixels);
        console.log('height in px', this.heightInPixels);
        //  Now let's get the data
        var c = 0;
        var row;
        for(var i = 0; i < json.layers[0].data.length; i++) {
            if(c == 0) {
                row = [];
            }
            row.push(json.layers[0].data[i]);
            c++;
            if(c == this.widthInTiles) {
                this.mapData.push(row);
                c = 0;
            }
        }
        //console.log('mapData');
        //console.log(this.mapData);
            };
    Tilemap.prototype.getMapSegment = function (area) {
    };
    Tilemap.prototype.createTilemapBuffers = function () {
        var cams = this._game.world.getAllCameras();
        for(var i = 0; i < cams.length; i++) {
            this._tilemapBuffers[cams[i].ID] = new TilemapBuffer(this._game, cams[i], this, this._texture, this._tileOffsets);
        }
    };
    Tilemap.prototype.parseTileOffsets = function () {
        this._tileOffsets = [];
        var i = 0;
        if(this.mapFormat == Tilemap.FORMAT_TILED_JSON) {
            //  For some reason Tiled counts from 1 not 0
            this._tileOffsets[0] = null;
            i = 1;
        }
        for(var ty = 0; ty < this._texture.height; ty += this.tileHeight) {
            for(var tx = 0; tx < this._texture.width; tx += this.tileWidth) {
                this._tileOffsets[i] = {
                    x: tx,
                    y: ty
                };
                i++;
            }
        }
    };
    Tilemap.prototype.update = /*
    //  Use a Signal?
    public addTilemapBuffers(camera:Camera) {
    
    console.log('added new camera to tilemap');
    this._tilemapBuffers[camera.ID] = new TilemapBuffer(this._game, camera, this, this._texture, this._tileOffsets);
    
    }
    */
    function () {
        //  Check if any of the cameras have scrolled far enough for us to need to refresh a TilemapBuffer
        this._tilemapBuffers[0].update();
    };
    Tilemap.prototype.renderDebugInfo = function (x, y, color) {
        if (typeof color === "undefined") { color = 'rgb(255,255,255)'; }
        this._tilemapBuffers[0].renderDebugInfo(x, y, color);
    };
    Tilemap.prototype.render = function (camera, cameraOffsetX, cameraOffsetY) {
        if(this.visible === false || this.scale.x == 0 || this.scale.y == 0 || this.alpha < 0.1) {
            return false;
        }
        this._dx = cameraOffsetX + (this.bounds.x - camera.worldView.x);
        this._dy = cameraOffsetY + (this.bounds.y - camera.worldView.y);
        this._dx = Math.round(this._dx);
        this._dy = Math.round(this._dy);
        if(this._tilemapBuffers[camera.ID]) {
            //this._tilemapBuffers[camera.ID].render(this._dx, this._dy);
            this._tilemapBuffers[camera.ID].render(cameraOffsetX, cameraOffsetY);
        }
        return true;
    };
    return Tilemap;
})(GameObject);
/// <reference path="../Basic.ts" />
/**
* A miniature linked list class.
* Useful for optimizing time-critical or highly repetitive tasks!
* See <code>QuadTree</code> for how to use it, IF YOU DARE.
*/
var LinkedList = (function () {
    /**
    * Creates a new link, and sets <code>object</code> and <code>next</code> to <code>null</code>.
    */
    function LinkedList() {
        this.object = null;
        this.next = null;
    }
    LinkedList.prototype.destroy = /**
    * Clean up memory.
    */
    function () {
        this.object = null;
        if(this.next != null) {
            this.next.destroy();
        }
        this.next = null;
    };
    return LinkedList;
})();
/// <reference path="../Rectangle.ts" />
/// <reference path="../Basic.ts" />
/// <reference path="LinkedList.ts" />
/**
* A fairly generic quad tree structure for rapid overlap checks.
* QuadTree is also configured for single or dual list operation.
* You can add items either to its A list or its B list.
* When you do an overlap check, you can compare the A list to itself,
* or the A list against the B list.  Handy for different things!
*/
var QuadTree = (function (_super) {
    __extends(QuadTree, _super);
    /**
    * Instantiate a new Quad Tree node.
    *
    * @param	X			The X-coordinate of the point in space.
    * @param	Y			The Y-coordinate of the point in space.
    * @param	Width		Desired width of this node.
    * @param	Height		Desired height of this node.
    * @param	Parent		The parent branch or node.  Pass null to create a root.
    */
    function QuadTree(X, Y, Width, Height, Parent) {
        if (typeof Parent === "undefined") { Parent = null; }
        _super.call(this, X, Y, Width, Height);
        //console.log('-------- QuadTree',X,Y,Width,Height);
        this._headA = this._tailA = new LinkedList();
        this._headB = this._tailB = new LinkedList();
        //Copy the parent's children (if there are any)
        if(Parent != null) {
            //console.log('Parent not null');
            var iterator;
            var ot;
            if(Parent._headA.object != null) {
                iterator = Parent._headA;
                //console.log('iterator set to parent headA');
                while(iterator != null) {
                    if(this._tailA.object != null) {
                        ot = this._tailA;
                        this._tailA = new LinkedList();
                        ot.next = this._tailA;
                    }
                    this._tailA.object = iterator.object;
                    iterator = iterator.next;
                }
            }
            if(Parent._headB.object != null) {
                iterator = Parent._headB;
                //console.log('iterator set to parent headB');
                while(iterator != null) {
                    if(this._tailB.object != null) {
                        ot = this._tailB;
                        this._tailB = new LinkedList();
                        ot.next = this._tailB;
                    }
                    this._tailB.object = iterator.object;
                    iterator = iterator.next;
                }
            }
        } else {
            QuadTree._min = (this.width + this.height) / (2 * QuadTree.divisions);
        }
        this._canSubdivide = (this.width > QuadTree._min) || (this.height > QuadTree._min);
        //console.log('canSubdivided', this._canSubdivide);
        //Set up comparison/sort helpers
        this._northWestTree = null;
        this._northEastTree = null;
        this._southEastTree = null;
        this._southWestTree = null;
        this._leftEdge = this.x;
        this._rightEdge = this.x + this.width;
        this._halfWidth = this.width / 2;
        this._midpointX = this._leftEdge + this._halfWidth;
        this._topEdge = this.y;
        this._bottomEdge = this.y + this.height;
        this._halfHeight = this.height / 2;
        this._midpointY = this._topEdge + this._halfHeight;
    }
    QuadTree.A_LIST = 0;
    QuadTree.B_LIST = 1;
    QuadTree.prototype.destroy = /**
    * Clean up memory.
    */
    function () {
        this._tailA.destroy();
        this._tailB.destroy();
        this._headA.destroy();
        this._headB.destroy();
        this._tailA = null;
        this._tailB = null;
        this._headA = null;
        this._headB = null;
        if(this._northWestTree != null) {
            this._northWestTree.destroy();
        }
        if(this._northEastTree != null) {
            this._northEastTree.destroy();
        }
        if(this._southEastTree != null) {
            this._southEastTree.destroy();
        }
        if(this._southWestTree != null) {
            this._southWestTree.destroy();
        }
        this._northWestTree = null;
        this._northEastTree = null;
        this._southEastTree = null;
        this._southWestTree = null;
        QuadTree._object = null;
        QuadTree._processingCallback = null;
        QuadTree._notifyCallback = null;
    };
    QuadTree.prototype.load = /**
    * Load objects and/or groups into the quad tree, and register notify and processing callbacks.
    *
    * @param ObjectOrGroup1	Any object that is or extends GameObject or Group.
    * @param ObjectOrGroup2	Any object that is or extends GameObject or Group.  If null, the first parameter will be checked against itself.
    * @param NotifyCallback	A function with the form <code>myFunction(Object1:GameObject,Object2:GameObject)</code> that is called whenever two objects are found to overlap in world space, and either no ProcessCallback is specified, or the ProcessCallback returns true.
    * @param ProcessCallback	A function with the form <code>myFunction(Object1:GameObject,Object2:GameObject):bool</code> that is called whenever two objects are found to overlap in world space.  The NotifyCallback is only called if this function returns true.  See GameObject.separate().
    */
    function (ObjectOrGroup1, ObjectOrGroup2, NotifyCallback, ProcessCallback) {
        if (typeof ObjectOrGroup2 === "undefined") { ObjectOrGroup2 = null; }
        if (typeof NotifyCallback === "undefined") { NotifyCallback = null; }
        if (typeof ProcessCallback === "undefined") { ProcessCallback = null; }
        //console.log('quadtree load', QuadTree.divisions, ObjectOrGroup1, ObjectOrGroup2);
        this.add(ObjectOrGroup1, QuadTree.A_LIST);
        if(ObjectOrGroup2 != null) {
            this.add(ObjectOrGroup2, QuadTree.B_LIST);
            QuadTree._useBothLists = true;
        } else {
            QuadTree._useBothLists = false;
        }
        QuadTree._notifyCallback = NotifyCallback;
        QuadTree._processingCallback = ProcessCallback;
        //console.log('use both', QuadTree._useBothLists);
        //console.log('------------ end of load');
            };
    QuadTree.prototype.add = /**
    * Call this function to add an object to the root of the tree.
    * This function will recursively add all group members, but
    * not the groups themselves.
    *
    * @param	ObjectOrGroup	GameObjects are just added, Groups are recursed and their applicable members added accordingly.
    * @param	List			A <code>uint</code> flag indicating the list to which you want to add the objects.  Options are <code>QuadTree.A_LIST</code> and <code>QuadTree.B_LIST</code>.
    */
    function (ObjectOrGroup, List) {
        QuadTree._list = List;
        if(ObjectOrGroup.isGroup == true) {
            var i = 0;
            var basic;
            var members = ObjectOrGroup['members'];
            var l = ObjectOrGroup['length'];
            while(i < l) {
                basic = members[i++];
                if((basic != null) && basic.exists) {
                    if(basic.isGroup) {
                        this.add(basic, List);
                    } else {
                        QuadTree._object = basic;
                        if(QuadTree._object.exists && QuadTree._object.allowCollisions) {
                            QuadTree._objectLeftEdge = QuadTree._object.x;
                            QuadTree._objectTopEdge = QuadTree._object.y;
                            QuadTree._objectRightEdge = QuadTree._object.x + QuadTree._object.width;
                            QuadTree._objectBottomEdge = QuadTree._object.y + QuadTree._object.height;
                            this.addObject();
                        }
                    }
                }
            }
        } else {
            QuadTree._object = ObjectOrGroup;
            //console.log('add - not group:', ObjectOrGroup.name);
            if(QuadTree._object.exists && QuadTree._object.allowCollisions) {
                QuadTree._objectLeftEdge = QuadTree._object.x;
                QuadTree._objectTopEdge = QuadTree._object.y;
                QuadTree._objectRightEdge = QuadTree._object.x + QuadTree._object.width;
                QuadTree._objectBottomEdge = QuadTree._object.y + QuadTree._object.height;
                //console.log('object properties', QuadTree._objectLeftEdge, QuadTree._objectTopEdge, QuadTree._objectRightEdge, QuadTree._objectBottomEdge);
                this.addObject();
            }
        }
    };
    QuadTree.prototype.addObject = /**
    * Internal function for recursively navigating and creating the tree
    * while adding objects to the appropriate nodes.
    */
    function () {
        //console.log('addObject');
        //If this quad (not its children) lies entirely inside this object, add it here
        if(!this._canSubdivide || ((this._leftEdge >= QuadTree._objectLeftEdge) && (this._rightEdge <= QuadTree._objectRightEdge) && (this._topEdge >= QuadTree._objectTopEdge) && (this._bottomEdge <= QuadTree._objectBottomEdge))) {
            //console.log('add To List');
            this.addToList();
            return;
        }
        //See if the selected object fits completely inside any of the quadrants
        if((QuadTree._objectLeftEdge > this._leftEdge) && (QuadTree._objectRightEdge < this._midpointX)) {
            if((QuadTree._objectTopEdge > this._topEdge) && (QuadTree._objectBottomEdge < this._midpointY)) {
                //console.log('Adding NW tree');
                if(this._northWestTree == null) {
                    this._northWestTree = new QuadTree(this._leftEdge, this._topEdge, this._halfWidth, this._halfHeight, this);
                }
                this._northWestTree.addObject();
                return;
            }
            if((QuadTree._objectTopEdge > this._midpointY) && (QuadTree._objectBottomEdge < this._bottomEdge)) {
                //console.log('Adding SW tree');
                if(this._southWestTree == null) {
                    this._southWestTree = new QuadTree(this._leftEdge, this._midpointY, this._halfWidth, this._halfHeight, this);
                }
                this._southWestTree.addObject();
                return;
            }
        }
        if((QuadTree._objectLeftEdge > this._midpointX) && (QuadTree._objectRightEdge < this._rightEdge)) {
            if((QuadTree._objectTopEdge > this._topEdge) && (QuadTree._objectBottomEdge < this._midpointY)) {
                //console.log('Adding NE tree');
                if(this._northEastTree == null) {
                    this._northEastTree = new QuadTree(this._midpointX, this._topEdge, this._halfWidth, this._halfHeight, this);
                }
                this._northEastTree.addObject();
                return;
            }
            if((QuadTree._objectTopEdge > this._midpointY) && (QuadTree._objectBottomEdge < this._bottomEdge)) {
                //console.log('Adding SE tree');
                if(this._southEastTree == null) {
                    this._southEastTree = new QuadTree(this._midpointX, this._midpointY, this._halfWidth, this._halfHeight, this);
                }
                this._southEastTree.addObject();
                return;
            }
        }
        //If it wasn't completely contained we have to check out the partial overlaps
        if((QuadTree._objectRightEdge > this._leftEdge) && (QuadTree._objectLeftEdge < this._midpointX) && (QuadTree._objectBottomEdge > this._topEdge) && (QuadTree._objectTopEdge < this._midpointY)) {
            if(this._northWestTree == null) {
                this._northWestTree = new QuadTree(this._leftEdge, this._topEdge, this._halfWidth, this._halfHeight, this);
            }
            //console.log('added to north west partial tree');
            this._northWestTree.addObject();
        }
        if((QuadTree._objectRightEdge > this._midpointX) && (QuadTree._objectLeftEdge < this._rightEdge) && (QuadTree._objectBottomEdge > this._topEdge) && (QuadTree._objectTopEdge < this._midpointY)) {
            if(this._northEastTree == null) {
                this._northEastTree = new QuadTree(this._midpointX, this._topEdge, this._halfWidth, this._halfHeight, this);
            }
            //console.log('added to north east partial tree');
            this._northEastTree.addObject();
        }
        if((QuadTree._objectRightEdge > this._midpointX) && (QuadTree._objectLeftEdge < this._rightEdge) && (QuadTree._objectBottomEdge > this._midpointY) && (QuadTree._objectTopEdge < this._bottomEdge)) {
            if(this._southEastTree == null) {
                this._southEastTree = new QuadTree(this._midpointX, this._midpointY, this._halfWidth, this._halfHeight, this);
            }
            //console.log('added to south east partial tree');
            this._southEastTree.addObject();
        }
        if((QuadTree._objectRightEdge > this._leftEdge) && (QuadTree._objectLeftEdge < this._midpointX) && (QuadTree._objectBottomEdge > this._midpointY) && (QuadTree._objectTopEdge < this._bottomEdge)) {
            if(this._southWestTree == null) {
                this._southWestTree = new QuadTree(this._leftEdge, this._midpointY, this._halfWidth, this._halfHeight, this);
            }
            //console.log('added to south west partial tree');
            this._southWestTree.addObject();
        }
    };
    QuadTree.prototype.addToList = /**
    * Internal function for recursively adding objects to leaf lists.
    */
    function () {
        //console.log('Adding to List');
        var ot;
        if(QuadTree._list == QuadTree.A_LIST) {
            //console.log('A LIST');
            if(this._tailA.object != null) {
                ot = this._tailA;
                this._tailA = new LinkedList();
                ot.next = this._tailA;
            }
            this._tailA.object = QuadTree._object;
        } else {
            //console.log('B LIST');
            if(this._tailB.object != null) {
                ot = this._tailB;
                this._tailB = new LinkedList();
                ot.next = this._tailB;
            }
            this._tailB.object = QuadTree._object;
        }
        if(!this._canSubdivide) {
            return;
        }
        if(this._northWestTree != null) {
            this._northWestTree.addToList();
        }
        if(this._northEastTree != null) {
            this._northEastTree.addToList();
        }
        if(this._southEastTree != null) {
            this._southEastTree.addToList();
        }
        if(this._southWestTree != null) {
            this._southWestTree.addToList();
        }
    };
    QuadTree.prototype.execute = /**
    * <code>QuadTree</code>'s other main function.  Call this after adding objects
    * using <code>QuadTree.load()</code> to compare the objects that you loaded.
    *
    * @return	Whether or not any overlaps were found.
    */
    function () {
        //console.log('quadtree execute');
        var overlapProcessed = false;
        var iterator;
        if(this._headA.object != null) {
            //console.log('---------------------------------------------------');
            //console.log('headA iterator');
            iterator = this._headA;
            while(iterator != null) {
                QuadTree._object = iterator.object;
                if(QuadTree._useBothLists) {
                    QuadTree._iterator = this._headB;
                } else {
                    QuadTree._iterator = iterator.next;
                }
                if(QuadTree._object.exists && (QuadTree._object.allowCollisions > 0) && (QuadTree._iterator != null) && (QuadTree._iterator.object != null) && QuadTree._iterator.object.exists && this.overlapNode()) {
                    //console.log('headA iterator overlapped true');
                    overlapProcessed = true;
                }
                iterator = iterator.next;
            }
        }
        //Advance through the tree by calling overlap on each child
        if((this._northWestTree != null) && this._northWestTree.execute()) {
            //console.log('NW quadtree execute');
            overlapProcessed = true;
        }
        if((this._northEastTree != null) && this._northEastTree.execute()) {
            //console.log('NE quadtree execute');
            overlapProcessed = true;
        }
        if((this._southEastTree != null) && this._southEastTree.execute()) {
            //console.log('SE quadtree execute');
            overlapProcessed = true;
        }
        if((this._southWestTree != null) && this._southWestTree.execute()) {
            //console.log('SW quadtree execute');
            overlapProcessed = true;
        }
        return overlapProcessed;
    };
    QuadTree.prototype.overlapNode = /**
    * An private for comparing an object against the contents of a node.
    *
    * @return	Whether or not any overlaps were found.
    */
    function () {
        //console.log('overlapNode');
        //Walk the list and check for overlaps
        var overlapProcessed = false;
        var checkObject;
        while(QuadTree._iterator != null) {
            if(!QuadTree._object.exists || (QuadTree._object.allowCollisions <= 0)) {
                //console.log('break 1');
                break;
            }
            checkObject = QuadTree._iterator.object;
            if((QuadTree._object === checkObject) || !checkObject.exists || (checkObject.allowCollisions <= 0)) {
                //console.log('break 2');
                QuadTree._iterator = QuadTree._iterator.next;
                continue;
            }
            //calculate bulk hull for QuadTree._object
            QuadTree._objectHullX = (QuadTree._object.x < QuadTree._object.last.x) ? QuadTree._object.x : QuadTree._object.last.x;
            QuadTree._objectHullY = (QuadTree._object.y < QuadTree._object.last.y) ? QuadTree._object.y : QuadTree._object.last.y;
            QuadTree._objectHullWidth = QuadTree._object.x - QuadTree._object.last.x;
            QuadTree._objectHullWidth = QuadTree._object.width + ((QuadTree._objectHullWidth > 0) ? QuadTree._objectHullWidth : -QuadTree._objectHullWidth);
            QuadTree._objectHullHeight = QuadTree._object.y - QuadTree._object.last.y;
            QuadTree._objectHullHeight = QuadTree._object.height + ((QuadTree._objectHullHeight > 0) ? QuadTree._objectHullHeight : -QuadTree._objectHullHeight);
            //calculate bulk hull for checkObject
            QuadTree._checkObjectHullX = (checkObject.x < checkObject.last.x) ? checkObject.x : checkObject.last.x;
            QuadTree._checkObjectHullY = (checkObject.y < checkObject.last.y) ? checkObject.y : checkObject.last.y;
            QuadTree._checkObjectHullWidth = checkObject.x - checkObject.last.x;
            QuadTree._checkObjectHullWidth = checkObject.width + ((QuadTree._checkObjectHullWidth > 0) ? QuadTree._checkObjectHullWidth : -QuadTree._checkObjectHullWidth);
            QuadTree._checkObjectHullHeight = checkObject.y - checkObject.last.y;
            QuadTree._checkObjectHullHeight = checkObject.height + ((QuadTree._checkObjectHullHeight > 0) ? QuadTree._checkObjectHullHeight : -QuadTree._checkObjectHullHeight);
            //check for intersection of the two hulls
            if((QuadTree._objectHullX + QuadTree._objectHullWidth > QuadTree._checkObjectHullX) && (QuadTree._objectHullX < QuadTree._checkObjectHullX + QuadTree._checkObjectHullWidth) && (QuadTree._objectHullY + QuadTree._objectHullHeight > QuadTree._checkObjectHullY) && (QuadTree._objectHullY < QuadTree._checkObjectHullY + QuadTree._checkObjectHullHeight)) {
                //console.log('intersection!');
                //Execute callback functions if they exist
                if((QuadTree._processingCallback == null) || QuadTree._processingCallback(QuadTree._object, checkObject)) {
                    overlapProcessed = true;
                }
                if(overlapProcessed && (QuadTree._notifyCallback != null)) {
                    QuadTree._notifyCallback(QuadTree._object, checkObject);
                }
            }
            QuadTree._iterator = QuadTree._iterator.next;
        }
        return overlapProcessed;
    };
    return QuadTree;
})(Rectangle);
/// <reference path="Cameras.ts" />
/// <reference path="Game.ts" />
/// <reference path="GameMath.ts" />
/// <reference path="Group.ts" />
/// <reference path="Rectangle.ts" />
/// <reference path="Point.ts" />
/// <reference path="Sprite.ts" />
/// <reference path="Tilemap.ts" />
/// <reference path="system/Camera.ts" />
/// <reference path="system/QuadTree.ts" />
var World = (function () {
    function World(game, width, height) {
        this._game = game;
        this._cameras = new Cameras(this._game, 0, 0, width, height);
        this._game.camera = this._cameras.current;
        this.group = new Group(this._game, 0);
        this.bounds = new Rectangle(0, 0, width, height);
        this.worldDivisions = 6;
    }
    World.prototype.update = function () {
        this.group.preUpdate();
        this.group.update();
        this.group.postUpdate();
        this._cameras.update();
    };
    World.prototype.render = function () {
        //  Unlike in flixel our render process is camera driven, not group driven
        this._cameras.render();
    };
    World.prototype.destroy = function () {
        this.group.destroy();
        this._cameras.destroy();
    };
    World.prototype.setSize = //  World methods
    function (width, height) {
        this.bounds.width = width;
        this.bounds.height = height;
    };
    Object.defineProperty(World.prototype, "width", {
        get: function () {
            return this.bounds.width;
        },
        set: function (value) {
            this.bounds.width = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(World.prototype, "height", {
        get: function () {
            return this.bounds.height;
        },
        set: function (value) {
            this.bounds.height = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(World.prototype, "centerX", {
        get: function () {
            return this.bounds.halfWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(World.prototype, "centerY", {
        get: function () {
            return this.bounds.halfHeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(World.prototype, "randomX", {
        get: function () {
            return Math.round(Math.random() * this.bounds.width);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(World.prototype, "randomY", {
        get: function () {
            return Math.round(Math.random() * this.bounds.height);
        },
        enumerable: true,
        configurable: true
    });
    World.prototype.addExistingCamera = //  Cameras
    function (cam) {
        //return this._cameras.addCamera(x, y, width, height);
        return cam;
    };
    World.prototype.createCamera = function (x, y, width, height) {
        return this._cameras.addCamera(x, y, width, height);
    };
    World.prototype.removeCamera = function (id) {
        return this._cameras.removeCamera(id);
    };
    World.prototype.getAllCameras = function () {
        return this._cameras.getAll();
    };
    World.prototype.addExistingSprite = //  Sprites
    function (sprite) {
        return this.group.add(sprite);
    };
    World.prototype.createSprite = function (x, y, key) {
        if (typeof key === "undefined") { key = ''; }
        return this.group.add(new Sprite(this._game, x, y, key));
    };
    World.prototype.createGroup = function (MaxSize) {
        if (typeof MaxSize === "undefined") { MaxSize = 0; }
        return this.group.add(new Group(this._game, MaxSize));
    };
    World.prototype.createTilemap = //  Tilemaps
    function (key, mapData, format, tileWidth, tileHeight) {
        return this.group.add(new Tilemap(this._game, key, mapData, format, tileWidth, tileHeight));
    };
    World.prototype.createParticle = //  Emitters
    function () {
        return new Particle(this._game);
    };
    World.prototype.createEmitter = function (x, y, size) {
        if (typeof x === "undefined") { x = 0; }
        if (typeof y === "undefined") { y = 0; }
        if (typeof size === "undefined") { size = 0; }
        return this.group.add(new Emitter(this._game, x, y, size));
    };
    World.prototype.overlap = //  Collision
    /**
    * Call this function to see if one <code>GameObject</code> overlaps another.
    * Can be called with one object and one group, or two groups, or two objects,
    * whatever floats your boat! For maximum performance try bundling a lot of objects
    * together using a <code>FlxGroup</code> (or even bundling groups together!).
    *
    * <p>NOTE: does NOT take objects' scrollfactor into account, all overlaps are checked in world space.</p>
    *
    * @param	ObjectOrGroup1	The first object or group you want to check.
    * @param	ObjectOrGroup2	The second object or group you want to check.  If it is the same as the first, flixel knows to just do a comparison within that group.
    * @param	NotifyCallback	A function with two <code>GameObject</code> parameters - e.g. <code>myOverlapFunction(Object1:GameObject,Object2:GameObject)</code> - that is called if those two objects overlap.
    * @param	ProcessCallback	A function with two <code>GameObject</code> parameters - e.g. <code>myOverlapFunction(Object1:GameObject,Object2:GameObject)</code> - that is called if those two objects overlap.  If a ProcessCallback is provided, then NotifyCallback will only be called if ProcessCallback returns true for those objects!
    *
    * @return	Whether any overlaps were detected.
    */
    function (ObjectOrGroup1, ObjectOrGroup2, NotifyCallback, ProcessCallback) {
        if (typeof ObjectOrGroup1 === "undefined") { ObjectOrGroup1 = null; }
        if (typeof ObjectOrGroup2 === "undefined") { ObjectOrGroup2 = null; }
        if (typeof NotifyCallback === "undefined") { NotifyCallback = null; }
        if (typeof ProcessCallback === "undefined") { ProcessCallback = null; }
        if(ObjectOrGroup1 == null) {
            ObjectOrGroup1 = this.group;
        }
        if(ObjectOrGroup2 == ObjectOrGroup1) {
            ObjectOrGroup2 = null;
        }
        QuadTree.divisions = this.worldDivisions;
        var quadTree = new QuadTree(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
        quadTree.load(ObjectOrGroup1, ObjectOrGroup2, NotifyCallback, ProcessCallback);
        var result = quadTree.execute();
        quadTree.destroy();
        quadTree = null;
        return result;
    };
    World.separate = /**
    * The main collision resolution in flixel.
    *
    * @param	Object1 	Any <code>Sprite</code>.
    * @param	Object2		Any other <code>Sprite</code>.
    *
    * @return	Whether the objects in fact touched and were separated.
    */
    function separate(Object1, Object2) {
        var separatedX = World.separateX(Object1, Object2);
        var separatedY = World.separateY(Object1, Object2);
        return separatedX || separatedY;
    };
    World.separateX = /**
    * The X-axis component of the object separation process.
    *
    * @param	Object1 	Any <code>Sprite</code>.
    * @param	Object2		Any other <code>Sprite</code>.
    *
    * @return	Whether the objects in fact touched and were separated along the X axis.
    */
    function separateX(Object1, Object2) {
        //can't separate two immovable objects
        var obj1immovable = Object1.immovable;
        var obj2immovable = Object2.immovable;
        if(obj1immovable && obj2immovable) {
            return false;
        }
        //If one of the objects is a tilemap, just pass it off.
        /*
        if (typeof Object1 === 'FlxTilemap')
        {
        return Object1.overlapsWithCallback(Object2, separateX);
        }
        
        if (typeof Object2 === 'FlxTilemap')
        {
        return Object2.overlapsWithCallback(Object1, separateX, true);
        }
        */
        //First, get the two object deltas
        var overlap = 0;
        var obj1delta = Object1.x - Object1.last.x;
        var obj2delta = Object2.x - Object2.last.x;
        if(obj1delta != obj2delta) {
            //Check if the X hulls actually overlap
            var obj1deltaAbs = (obj1delta > 0) ? obj1delta : -obj1delta;
            var obj2deltaAbs = (obj2delta > 0) ? obj2delta : -obj2delta;
            var obj1rect = new Rectangle(Object1.x - ((obj1delta > 0) ? obj1delta : 0), Object1.last.y, Object1.width + ((obj1delta > 0) ? obj1delta : -obj1delta), Object1.height);
            var obj2rect = new Rectangle(Object2.x - ((obj2delta > 0) ? obj2delta : 0), Object2.last.y, Object2.width + ((obj2delta > 0) ? obj2delta : -obj2delta), Object2.height);
            if((obj1rect.x + obj1rect.width > obj2rect.x) && (obj1rect.x < obj2rect.x + obj2rect.width) && (obj1rect.y + obj1rect.height > obj2rect.y) && (obj1rect.y < obj2rect.y + obj2rect.height)) {
                var maxOverlap = obj1deltaAbs + obj2deltaAbs + GameObject.OVERLAP_BIAS;
                //If they did overlap (and can), figure out by how much and flip the corresponding flags
                if(obj1delta > obj2delta) {
                    overlap = Object1.x + Object1.width - Object2.x;
                    if((overlap > maxOverlap) || !(Object1.allowCollisions & GameObject.RIGHT) || !(Object2.allowCollisions & GameObject.LEFT)) {
                        overlap = 0;
                    } else {
                        Object1.touching |= GameObject.RIGHT;
                        Object2.touching |= GameObject.LEFT;
                    }
                } else if(obj1delta < obj2delta) {
                    overlap = Object1.x - Object2.width - Object2.x;
                    if((-overlap > maxOverlap) || !(Object1.allowCollisions & GameObject.LEFT) || !(Object2.allowCollisions & GameObject.RIGHT)) {
                        overlap = 0;
                    } else {
                        Object1.touching |= GameObject.LEFT;
                        Object2.touching |= GameObject.RIGHT;
                    }
                }
            }
        }
        //Then adjust their positions and velocities accordingly (if there was any overlap)
        if(overlap != 0) {
            var obj1v = Object1.velocity.x;
            var obj2v = Object2.velocity.x;
            if(!obj1immovable && !obj2immovable) {
                overlap *= 0.5;
                Object1.x = Object1.x - overlap;
                Object2.x += overlap;
                var obj1velocity = Math.sqrt((obj2v * obj2v * Object2.mass) / Object1.mass) * ((obj2v > 0) ? 1 : -1);
                var obj2velocity = Math.sqrt((obj1v * obj1v * Object1.mass) / Object2.mass) * ((obj1v > 0) ? 1 : -1);
                var average = (obj1velocity + obj2velocity) * 0.5;
                obj1velocity -= average;
                obj2velocity -= average;
                Object1.velocity.x = average + obj1velocity * Object1.elasticity;
                Object2.velocity.x = average + obj2velocity * Object2.elasticity;
            } else if(!obj1immovable) {
                Object1.x = Object1.x - overlap;
                Object1.velocity.x = obj2v - obj1v * Object1.elasticity;
            } else if(!obj2immovable) {
                Object2.x += overlap;
                Object2.velocity.x = obj1v - obj2v * Object2.elasticity;
            }
            return true;
        } else {
            return false;
        }
    };
    World.separateY = /**
    * The Y-axis component of the object separation process.
    *
    * @param	Object1 	Any <code>Sprite</code>.
    * @param	Object2		Any other <code>Sprite</code>.
    *
    * @return	Whether the objects in fact touched and were separated along the Y axis.
    */
    function separateY(Object1, Object2) {
        //can't separate two immovable objects
        var obj1immovable = Object1.immovable;
        var obj2immovable = Object2.immovable;
        if(obj1immovable && obj2immovable) {
            return false;
        }
        //If one of the objects is a tilemap, just pass it off.
        /*
        if (typeof Object1 === 'FlxTilemap')
        {
        return Object1.overlapsWithCallback(Object2, separateY);
        }
        
        if (typeof Object2 === 'FlxTilemap')
        {
        return Object2.overlapsWithCallback(Object1, separateY, true);
        }
        */
        //First, get the two object deltas
        var overlap = 0;
        var obj1delta = Object1.y - Object1.last.y;
        var obj2delta = Object2.y - Object2.last.y;
        if(obj1delta != obj2delta) {
            //Check if the Y hulls actually overlap
            var obj1deltaAbs = (obj1delta > 0) ? obj1delta : -obj1delta;
            var obj2deltaAbs = (obj2delta > 0) ? obj2delta : -obj2delta;
            var obj1rect = new Rectangle(Object1.x, Object1.y - ((obj1delta > 0) ? obj1delta : 0), Object1.width, Object1.height + obj1deltaAbs);
            var obj2rect = new Rectangle(Object2.x, Object2.y - ((obj2delta > 0) ? obj2delta : 0), Object2.width, Object2.height + obj2deltaAbs);
            if((obj1rect.x + obj1rect.width > obj2rect.x) && (obj1rect.x < obj2rect.x + obj2rect.width) && (obj1rect.y + obj1rect.height > obj2rect.y) && (obj1rect.y < obj2rect.y + obj2rect.height)) {
                var maxOverlap = obj1deltaAbs + obj2deltaAbs + GameObject.OVERLAP_BIAS;
                //If they did overlap (and can), figure out by how much and flip the corresponding flags
                if(obj1delta > obj2delta) {
                    overlap = Object1.y + Object1.height - Object2.y;
                    if((overlap > maxOverlap) || !(Object1.allowCollisions & GameObject.DOWN) || !(Object2.allowCollisions & GameObject.UP)) {
                        overlap = 0;
                    } else {
                        Object1.touching |= GameObject.DOWN;
                        Object2.touching |= GameObject.UP;
                    }
                } else if(obj1delta < obj2delta) {
                    overlap = Object1.y - Object2.height - Object2.y;
                    if((-overlap > maxOverlap) || !(Object1.allowCollisions & GameObject.UP) || !(Object2.allowCollisions & GameObject.DOWN)) {
                        overlap = 0;
                    } else {
                        Object1.touching |= GameObject.UP;
                        Object2.touching |= GameObject.DOWN;
                    }
                }
            }
        }
        //Then adjust their positions and velocities accordingly (if there was any overlap)
        if(overlap != 0) {
            var obj1v = Object1.velocity.y;
            var obj2v = Object2.velocity.y;
            if(!obj1immovable && !obj2immovable) {
                overlap *= 0.5;
                Object1.y = Object1.y - overlap;
                Object2.y += overlap;
                var obj1velocity = Math.sqrt((obj2v * obj2v * Object2.mass) / Object1.mass) * ((obj2v > 0) ? 1 : -1);
                var obj2velocity = Math.sqrt((obj1v * obj1v * Object1.mass) / Object2.mass) * ((obj1v > 0) ? 1 : -1);
                var average = (obj1velocity + obj2velocity) * 0.5;
                obj1velocity -= average;
                obj2velocity -= average;
                Object1.velocity.y = average + obj1velocity * Object1.elasticity;
                Object2.velocity.y = average + obj2velocity * Object2.elasticity;
            } else if(!obj1immovable) {
                Object1.y = Object1.y - overlap;
                Object1.velocity.y = obj2v - obj1v * Object1.elasticity;
                //This is special case code that handles cases like horizontal moving platforms you can ride
                if(Object2.active && Object2.moves && (obj1delta > obj2delta)) {
                    Object1.x += Object2.x - Object2.last.x;
                }
            } else if(!obj2immovable) {
                Object2.y += overlap;
                Object2.velocity.y = obj1v - obj2v * Object2.elasticity;
                //This is special case code that handles cases like horizontal moving platforms you can ride
                if(Object1.active && Object1.moves && (obj1delta < obj2delta)) {
                    Object2.x += Object1.x - Object1.last.x;
                }
            }
            return true;
        } else {
            return false;
        }
    };
    return World;
})();
/// <reference path="../../Game.ts" />
/// <reference path="Input.ts" />
var Mouse = (function () {
    function Mouse(game) {
        this._x = 0;
        this._y = 0;
        this.isDown = false;
        this.isUp = true;
        this.timeDown = 0;
        this.duration = 0;
        this.timeUp = 0;
        this._game = game;
        this.start();
    }
    Mouse.LEFT_BUTTON = 0;
    Mouse.MIDDLE_BUTTON = 1;
    Mouse.RIGHT_BUTTON = 2;
    Mouse.prototype.start = function () {
        var _this = this;
        this._game.stage.canvas.addEventListener('mousedown', function (event) {
            return _this.onMouseDown(event);
        }, true);
        this._game.stage.canvas.addEventListener('mousemove', function (event) {
            return _this.onMouseMove(event);
        }, true);
        this._game.stage.canvas.addEventListener('mouseup', function (event) {
            return _this.onMouseUp(event);
        }, true);
    };
    Mouse.prototype.reset = function () {
        this.isDown = false;
        this.isUp = true;
    };
    Mouse.prototype.onMouseDown = function (event) {
        this.button = event.button;
        this._x = event.clientX - this._game.stage.x;
        this._y = event.clientY - this._game.stage.y;
        this.isDown = true;
        this.isUp = false;
        this.timeDown = this._game.time.now;
    };
    Mouse.prototype.update = function () {
        this._game.input.x = this._x;
        this._game.input.y = this._y;
        if(this.isDown) {
            this.duration = this._game.time.now - this.timeDown;
        }
    };
    Mouse.prototype.onMouseMove = function (event) {
        this.button = event.button;
        this._x = event.clientX - this._game.stage.x;
        this._y = event.clientY - this._game.stage.y;
    };
    Mouse.prototype.onMouseUp = function (event) {
        this.button = event.button;
        this.isDown = false;
        this.isUp = true;
        this.timeUp = this._game.time.now;
        this.duration = this.timeUp - this.timeDown;
        this._x = event.clientX - this._game.stage.x;
        this._y = event.clientY - this._game.stage.y;
    };
    return Mouse;
})();
/// <reference path="../../Game.ts" />
/// <reference path="Input.ts" />
var Keyboard = (function () {
    function Keyboard(game) {
        this._keys = {
        };
        this._game = game;
        this.start();
    }
    Keyboard.prototype.start = function () {
        var _this = this;
        document.body.addEventListener('keydown', function (event) {
            return _this.onKeyDown(event);
        }, false);
        document.body.addEventListener('keyup', function (event) {
            return _this.onKeyUp(event);
        }, false);
    };
    Keyboard.prototype.onKeyDown = function (event) {
        if(!this._keys[event.keyCode]) {
            this._keys[event.keyCode] = {
                isDown: true,
                timeDown: this._game.time.now,
                timeUp: 0
            };
        } else {
            this._keys[event.keyCode].isDown = true;
            this._keys[event.keyCode].timeDown = this._game.time.now;
        }
    };
    Keyboard.prototype.onKeyUp = function (event) {
        if(!this._keys[event.keyCode]) {
            this._keys[event.keyCode] = {
                isDown: false,
                timeDown: 0,
                timeUp: this._game.time.now
            };
        } else {
            this._keys[event.keyCode].isDown = false;
            this._keys[event.keyCode].timeUp = this._game.time.now;
        }
    };
    Keyboard.prototype.reset = function () {
        for(var key in this._keys) {
            this._keys[key].isDown = false;
        }
    };
    Keyboard.prototype.justPressed = function (keycode, duration) {
        if (typeof duration === "undefined") { duration = 250; }
        if(this._keys[keycode] && this._keys[keycode].isDown === true && (this._game.time.now - this._keys[keycode].timeDown < duration)) {
            return true;
        } else {
            return false;
        }
    };
    Keyboard.prototype.justReleased = function (keycode, duration) {
        if (typeof duration === "undefined") { duration = 250; }
        if(this._keys[keycode] && this._keys[keycode].isDown === false && (this._game.time.now - this._keys[keycode].timeUp < duration)) {
            return true;
        } else {
            return false;
        }
    };
    Keyboard.prototype.isDown = function (keycode) {
        if(this._keys[keycode]) {
            return this._keys[keycode].isDown;
        } else {
            return false;
        }
    };
    Keyboard.A = "A".charCodeAt(0);
    Keyboard.B = "B".charCodeAt(0);
    Keyboard.C = "C".charCodeAt(0);
    Keyboard.D = "D".charCodeAt(0);
    Keyboard.E = "E".charCodeAt(0);
    Keyboard.F = "F".charCodeAt(0);
    Keyboard.G = "G".charCodeAt(0);
    Keyboard.H = "H".charCodeAt(0);
    Keyboard.I = "I".charCodeAt(0);
    Keyboard.J = "J".charCodeAt(0);
    Keyboard.K = "K".charCodeAt(0);
    Keyboard.L = "L".charCodeAt(0);
    Keyboard.M = "M".charCodeAt(0);
    Keyboard.N = "N".charCodeAt(0);
    Keyboard.O = "O".charCodeAt(0);
    Keyboard.P = "P".charCodeAt(0);
    Keyboard.Q = "Q".charCodeAt(0);
    Keyboard.R = "R".charCodeAt(0);
    Keyboard.S = "S".charCodeAt(0);
    Keyboard.T = "T".charCodeAt(0);
    Keyboard.U = "U".charCodeAt(0);
    Keyboard.V = "V".charCodeAt(0);
    Keyboard.W = "W".charCodeAt(0);
    Keyboard.X = "X".charCodeAt(0);
    Keyboard.Y = "Y".charCodeAt(0);
    Keyboard.Z = "Z".charCodeAt(0);
    Keyboard.ZERO = "0".charCodeAt(0);
    Keyboard.ONE = "1".charCodeAt(0);
    Keyboard.TWO = "2".charCodeAt(0);
    Keyboard.THREE = "3".charCodeAt(0);
    Keyboard.FOUR = "4".charCodeAt(0);
    Keyboard.FIVE = "5".charCodeAt(0);
    Keyboard.SIX = "6".charCodeAt(0);
    Keyboard.SEVEN = "7".charCodeAt(0);
    Keyboard.EIGHT = "8".charCodeAt(0);
    Keyboard.NINE = "9".charCodeAt(0);
    Keyboard.NUMPAD_0 = 96;
    Keyboard.NUMPAD_1 = 97;
    Keyboard.NUMPAD_2 = 98;
    Keyboard.NUMPAD_3 = 99;
    Keyboard.NUMPAD_4 = 100;
    Keyboard.NUMPAD_5 = 101;
    Keyboard.NUMPAD_6 = 102;
    Keyboard.NUMPAD_7 = 103;
    Keyboard.NUMPAD_8 = 104;
    Keyboard.NUMPAD_9 = 105;
    Keyboard.NUMPAD_MULTIPLY = 106;
    Keyboard.NUMPAD_ADD = 107;
    Keyboard.NUMPAD_ENTER = 108;
    Keyboard.NUMPAD_SUBTRACT = 109;
    Keyboard.NUMPAD_DECIMAL = 110;
    Keyboard.NUMPAD_DIVIDE = 111;
    Keyboard.F1 = 112;
    Keyboard.F2 = 113;
    Keyboard.F3 = 114;
    Keyboard.F4 = 115;
    Keyboard.F5 = 116;
    Keyboard.F6 = 117;
    Keyboard.F7 = 118;
    Keyboard.F8 = 119;
    Keyboard.F9 = 120;
    Keyboard.F10 = 121;
    Keyboard.F11 = 122;
    Keyboard.F12 = 123;
    Keyboard.F13 = 124;
    Keyboard.F14 = 125;
    Keyboard.F15 = 126;
    Keyboard.COLON = 186;
    Keyboard.EQUALS = 187;
    Keyboard.UNDERSCORE = 189;
    Keyboard.QUESTION_MARK = 191;
    Keyboard.TILDE = 192;
    Keyboard.OPEN_BRACKET = 219;
    Keyboard.BACKWARD_SLASH = 220;
    Keyboard.CLOSED_BRACKET = 221;
    Keyboard.QUOTES = 222;
    Keyboard.BACKSPACE = 8;
    Keyboard.TAB = 9;
    Keyboard.CLEAR = 12;
    Keyboard.ENTER = 13;
    Keyboard.SHIFT = 16;
    Keyboard.CONTROL = 17;
    Keyboard.ALT = 18;
    Keyboard.CAPS_LOCK = 20;
    Keyboard.ESC = 27;
    Keyboard.SPACEBAR = 32;
    Keyboard.PAGE_UP = 33;
    Keyboard.PAGE_DOWN = 34;
    Keyboard.END = 35;
    Keyboard.HOME = 36;
    Keyboard.LEFT = 37;
    Keyboard.UP = 38;
    Keyboard.RIGHT = 39;
    Keyboard.DOWN = 40;
    Keyboard.INSERT = 45;
    Keyboard.DELETE = 46;
    Keyboard.HELP = 47;
    Keyboard.NUM_LOCK = 144;
    return Keyboard;
})();
/// <reference path="../../Game.ts" />
/// <reference path="Mouse.ts" />
/// <reference path="Keyboard.ts" />
var Input = (function () {
    function Input(game) {
        this._game = game;
        this.mouse = new Mouse(this._game);
        this.keyboard = new Keyboard(this._game);
    }
    Input.prototype.update = function () {
        this.mouse.update();
    };
    Input.prototype.reset = function () {
        this.mouse.reset();
        this.keyboard.reset();
    };
    Input.prototype.getWorldX = function (camera) {
        return this.x;
    };
    Input.prototype.getWorldY = function (camera) {
        return this.y;
    };
    return Input;
})();
/**
*  RequestAnimationFrame
*
*  @desc       Abstracts away the use of RAF or setTimeOut for the core game update loop. The callback can be re-mapped on the fly.
*
*	@version 	0.3 - 15th October 2012
*	@author 	Richard Davey
*/
var RequestAnimationFrame = (function () {
    /**
    * Constructor
    * @param {Any} callback
    * @return {RequestAnimationFrame} This object.
    */
    function RequestAnimationFrame(callback, callbackContext) {
        /**
        *
        * @property _isSetTimeOut
        * @type Boolean
        * @private
        **/
        this._isSetTimeOut = false;
        /**
        *
        * @property lastTime
        * @type Number
        **/
        this.lastTime = 0;
        /**
        *
        * @property currentTime
        * @type Number
        **/
        this.currentTime = 0;
        /**
        *
        * @property isRunning
        * @type Boolean
        **/
        this.isRunning = false;
        this._callback = callback;
        this._callbackContext = callbackContext;
        var vendors = [
            'ms', 
            'moz', 
            'webkit', 
            'o'
        ];
        for(var x = 0; x < vendors.length && !window.requestAnimationFrame; x++) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'];
        }
        this.start();
    }
    RequestAnimationFrame.prototype.setCallback = /**
    *
    * @method callback
    * @param {Any} callback
    **/
    function (callback) {
        this._callback = callback;
    };
    RequestAnimationFrame.prototype.isUsingSetTimeOut = /**
    *
    * @method usingSetTimeOut
    * @return Boolean
    **/
    function () {
        return this._isSetTimeOut;
    };
    RequestAnimationFrame.prototype.isUsingRAF = /**
    *
    * @method usingRAF
    * @return Boolean
    **/
    function () {
        if(this._isSetTimeOut === true) {
            return false;
        } else {
            return true;
        }
    };
    RequestAnimationFrame.prototype.start = /**
    *
    * @method start
    * @param {Any} [callback]
    **/
    function (callback) {
        if (typeof callback === "undefined") { callback = null; }
        var _this = this;
        if(callback) {
            this._callback = callback;
        }
        if(!window.requestAnimationFrame) {
            this._isSetTimeOut = true;
            this._timeOutID = window.setTimeout(function () {
                return _this.SetTimeoutUpdate();
            }, 0);
        } else {
            this._isSetTimeOut = false;
            window.requestAnimationFrame(function () {
                return _this.RAFUpdate();
            });
        }
        this.isRunning = true;
    };
    RequestAnimationFrame.prototype.stop = /**
    *
    * @method stop
    **/
    function () {
        if(this._isSetTimeOut) {
            clearTimeout(this._timeOutID);
        } else {
            window.cancelAnimationFrame;
        }
        this.isRunning = false;
    };
    RequestAnimationFrame.prototype.RAFUpdate = function () {
        var _this = this;
        //  Not in IE8 (but neither is RAF) also doesn't use a high performance timer (window.performance.now)
        this.currentTime = Date.now();
        if(this._callback) {
            this._callback.call(this._callbackContext);
        }
        var timeToCall = Math.max(0, 16 - (this.currentTime - this.lastTime));
        window.requestAnimationFrame(function () {
            return _this.RAFUpdate();
        });
        this.lastTime = this.currentTime + timeToCall;
    };
    RequestAnimationFrame.prototype.SetTimeoutUpdate = /**
    *
    * @method SetTimeoutUpdate
    **/
    function () {
        var _this = this;
        //  Not in IE8
        this.currentTime = Date.now();
        if(this._callback) {
            this._callback.call(this._callbackContext);
        }
        var timeToCall = Math.max(0, 16 - (this.currentTime - this.lastTime));
        this._timeOutID = window.setTimeout(function () {
            return _this.SetTimeoutUpdate();
        }, timeToCall);
        this.lastTime = this.currentTime + timeToCall;
    };
    return RequestAnimationFrame;
})();
/// <reference path="Cache.ts" />
/// <reference path="Cameras.ts" />
/// <reference path="Emitter.ts" />
/// <reference path="Group.ts" />
/// <reference path="Loader.ts" />
/// <reference path="Sound.ts" />
/// <reference path="Sprite.ts" />
/// <reference path="Stage.ts" />
/// <reference path="Time.ts" />
/// <reference path="GameMath.ts" />
/// <reference path="World.ts" />
/// <reference path="system/input/Input.ts" />
/// <reference path="system/RequestAnimationFrame.ts" />
/**
*   Phaser
*
*   v0.5 - April 12th 2013
*
*   A small and feature-packed 2D canvas game framework born from the firey pits of Flixel and Kiwi.
*
*   Richard Davey (@photonstorm)
*   Adam Saltsman (@ADAMATOMIC) (original Flixel code)
*
*   "If you want your children to be intelligent,  read them fairy tales."
*   "If you want them to be more intelligent, read them more fairy tales."
*                                                       -- Albert Einstein
*/
var Game = (function () {
    function Game(callbackContext, parent, width, height, initCallback, createCallback, updateCallback, renderCallback) {
        if (typeof parent === "undefined") { parent = ''; }
        if (typeof width === "undefined") { width = 800; }
        if (typeof height === "undefined") { height = 600; }
        if (typeof initCallback === "undefined") { initCallback = null; }
        if (typeof createCallback === "undefined") { createCallback = null; }
        if (typeof updateCallback === "undefined") { updateCallback = null; }
        if (typeof renderCallback === "undefined") { renderCallback = null; }
        var _this = this;
        this._maxAccumulation = 32;
        this._accumulator = 0;
        this._step = 0;
        this._loadComplete = false;
        this._paused = false;
        this._pendingState = null;
        this.onInitCallback = null;
        this.onCreateCallback = null;
        this.onUpdateCallback = null;
        this.onRenderCallback = null;
        this.onPausedCallback = null;
        this.isBooted = false;
        this.callbackContext = callbackContext;
        this.onInitCallback = initCallback;
        this.onCreateCallback = createCallback;
        this.onUpdateCallback = updateCallback;
        this.onRenderCallback = renderCallback;
        if(document.readyState === 'complete' || document.readyState === 'interactive') {
            this.boot(parent, width, height);
        } else {
            document.addEventListener('DOMContentLoaded', function () {
                return _this.boot(parent, width, height);
            }, false);
        }
    }
    Game.VERSION = 'Phaser version 0.5';
    Game.prototype.boot = function (parent, width, height) {
        var _this = this;
        if(!document.body) {
            window.setTimeout(function () {
                return _this.boot(parent, width, height);
            }, 13);
        } else {
            this.stage = new Stage(this, parent, width, height);
            this.world = new World(this, width, height);
            this.sound = new SoundManager(this);
            this.cache = new Cache(this);
            this.loader = new Loader(this, this.loadComplete);
            this.time = new Time(this);
            this.input = new Input(this);
            this.math = new GameMath(this);
            this.framerate = 60;
            //  Display the default game screen?
            if(this.onInitCallback == null && this.onCreateCallback == null && this.onUpdateCallback == null && this.onRenderCallback == null && this._pendingState == null) {
                this.isBooted = false;
                this.stage.drawInitScreen();
            } else {
                this.isBooted = true;
                this._loadComplete = false;
                this._raf = new RequestAnimationFrame(this.loop, this);
                if(this._pendingState) {
                    this.switchState(this._pendingState, false, false);
                } else {
                    this.startState();
                }
            }
        }
    };
    Game.prototype.loadComplete = function () {
        //  Called when the loader has finished after init was run
        this._loadComplete = true;
    };
    Game.prototype.loop = function () {
        if(this._paused == true) {
            if(this.onPausedCallback !== null) {
                this.onPausedCallback.call(this.callbackContext);
            }
            return;
        }
        this.time.update();
        this.input.update();
        this.stage.update();
        this._accumulator += this.time.delta;
        if(this._accumulator > this._maxAccumulation) {
            this._accumulator = this._maxAccumulation;
        }
        while(this._accumulator >= this._step) {
            this.time.elapsed = this.time.timeScale * (this._step / 1000);
            this.world.update();
            this._accumulator = this._accumulator - this._step;
        }
        if(this._loadComplete && this.onUpdateCallback) {
            this.onUpdateCallback.call(this.callbackContext);
        }
        this.world.render();
        if(this._loadComplete && this.onRenderCallback) {
            this.onRenderCallback.call(this.callbackContext);
        }
    };
    Game.prototype.startState = function () {
        if(this.onInitCallback !== null) {
            this.onInitCallback.call(this.callbackContext);
        } else {
            //  No init? Then there was nothing to load either
            if(this.onCreateCallback !== null) {
                this.onCreateCallback.call(this.callbackContext);
            }
            this._loadComplete = true;
        }
    };
    Game.prototype.setCallbacks = function (initCallback, createCallback, updateCallback, renderCallback) {
        if (typeof initCallback === "undefined") { initCallback = null; }
        if (typeof createCallback === "undefined") { createCallback = null; }
        if (typeof updateCallback === "undefined") { updateCallback = null; }
        if (typeof renderCallback === "undefined") { renderCallback = null; }
        this.onInitCallback = initCallback;
        this.onCreateCallback = createCallback;
        this.onUpdateCallback = updateCallback;
        this.onRenderCallback = renderCallback;
    };
    Game.prototype.switchState = function (state, clearWorld, clearCache) {
        if (typeof clearWorld === "undefined") { clearWorld = true; }
        if (typeof clearCache === "undefined") { clearCache = false; }
        if(this.isBooted == false) {
            this._pendingState = state;
            return;
        }
        //  Prototype?
        if(typeof state === 'function') {
            state = new state(this);
        }
        //  Ok, have we got the right functions?
        if(state['create'] || state['update']) {
            this.callbackContext = state;
            this.onInitCallback = null;
            this.onCreateCallback = null;
            this.onUpdateCallback = null;
            this.onRenderCallback = null;
            this.onPausedCallback = null;
            //  Bingo, let's set them up
            if(state['init']) {
                this.onInitCallback = state['init'];
            }
            if(state['create']) {
                this.onCreateCallback = state['create'];
            }
            if(state['update']) {
                this.onUpdateCallback = state['update'];
            }
            if(state['render']) {
                this.onRenderCallback = state['render'];
            }
            if(state['paused']) {
                this.onPausedCallback = state['paused'];
            }
            if(clearWorld) {
                this.world.destroy();
                if(clearCache == true) {
                    this.cache.destroy();
                }
            }
            this._loadComplete = false;
            this.startState();
        } else {
            throw Error("Invalid State object given. Must contain at least a create or update function.");
            return;
        }
    };
    Game.prototype.destroy = //  Nuke the whole game from orbit
    function () {
        this.callbackContext = null;
        this.onInitCallback = null;
        this.onCreateCallback = null;
        this.onUpdateCallback = null;
        this.onRenderCallback = null;
        this.onPausedCallback = null;
        this.camera = null;
        this.cache = null;
        this.input = null;
        this.loader = null;
        this.sound = null;
        this.stage = null;
        this.time = null;
        this.math = null;
        this.world = null;
        this.isBooted = false;
    };
    Object.defineProperty(Game.prototype, "pause", {
        get: function () {
            return this._paused;
        },
        set: function (value) {
            if(value == true && this._paused == false) {
                this._paused = true;
            } else if(value == false && this._paused == true) {
                this._paused = false;
                this.time.time = Date.now();
                this.input.reset();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "framerate", {
        get: function () {
            return 1000 / this._step;
        },
        set: function (value) {
            this._step = 1000 / value;
            if(this._maxAccumulation < this._step) {
                this._maxAccumulation = this._step;
            }
        },
        enumerable: true,
        configurable: true
    });
    Game.prototype.createCamera = //  Handy Proxy methods
    function (x, y, width, height) {
        return this.world.createCamera(x, y, width, height);
    };
    Game.prototype.createSprite = function (x, y, key) {
        if (typeof key === "undefined") { key = ''; }
        return this.world.createSprite(x, y, key);
    };
    Game.prototype.createGroup = function (MaxSize) {
        if (typeof MaxSize === "undefined") { MaxSize = 0; }
        return this.world.createGroup(MaxSize);
    };
    Game.prototype.createParticle = function () {
        return this.world.createParticle();
    };
    Game.prototype.createEmitter = function (x, y, size) {
        if (typeof x === "undefined") { x = 0; }
        if (typeof y === "undefined") { y = 0; }
        if (typeof size === "undefined") { size = 0; }
        return this.world.createEmitter(x, y, size);
    };
    Game.prototype.createTilemap = function (key, mapData, format, tileWidth, tileHeight) {
        return this.world.createTilemap(key, mapData, format, tileWidth, tileHeight);
    };
    Game.prototype.collide = function (ObjectOrGroup1, ObjectOrGroup2, NotifyCallback) {
        if (typeof ObjectOrGroup1 === "undefined") { ObjectOrGroup1 = null; }
        if (typeof ObjectOrGroup2 === "undefined") { ObjectOrGroup2 = null; }
        if (typeof NotifyCallback === "undefined") { NotifyCallback = null; }
        return this.world.overlap(ObjectOrGroup1, ObjectOrGroup2, NotifyCallback, World.separate);
    };
    return Game;
})();
/// <reference path="../../Game.ts" />
/// <reference path="../../Sprite.ts" />
/// <reference path="Animation.ts" />
/// <reference path="AnimationLoader.ts" />
/// <reference path="Frame.ts" />
var FrameData = (function () {
    function FrameData() {
        this._frames = [];
    }
    Object.defineProperty(FrameData.prototype, "total", {
        get: function () {
            return this._frames.length;
        },
        enumerable: true,
        configurable: true
    });
    FrameData.prototype.addFrame = function (frame) {
        this._frames.push(frame);
        return frame;
    };
    FrameData.prototype.getFrame = function (frame) {
        if(this._frames[frame]) {
            return this._frames[frame];
        }
        return null;
    };
    FrameData.prototype.getFrameRange = function (start, end, output) {
        if (typeof output === "undefined") { output = []; }
        for(var i = start; i <= end; i++) {
            output.push(this._frames[i]);
        }
        return output;
    };
    FrameData.prototype.getFrameIndexes = function (output) {
        if (typeof output === "undefined") { output = []; }
        output.length = 0;
        for(var i = 0; i < this._frames.length; i++) {
            output.push(i);
        }
        return output;
    };
    FrameData.prototype.getAllFrames = function () {
        return this._frames;
    };
    FrameData.prototype.getFrames = function (range) {
        var output = [];
        for(var i = 0; i < range.length; i++) {
            output.push(this._frames[i]);
        }
        return output;
    };
    return FrameData;
})();
/// <reference path="../../Game.ts" />
/// <reference path="../../Sprite.ts" />
/// <reference path="Animation.ts" />
/// <reference path="AnimationLoader.ts" />
/// <reference path="FrameData.ts" />
var Frame = (function () {
    function Frame(x, y, width, height) {
        //  Rotated? (not yet implemented)
        this.rotated = false;
        //  Either cw or ccw, rotation is always 90 degrees
        this.rotationDirection = 'cw';
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.rotated = false;
        this.trimmed = false;
    }
    Frame.prototype.setRotation = function (rotated, rotationDirection) {
        //  Not yet supported
            };
    Frame.prototype.setTrim = function (trimmed, actualWidth, actualHeight, destX, destY, destWidth, destHeight) {
        this.trimmed = trimmed;
        this.sourceSizeW = actualWidth;
        this.sourceSizeH = actualHeight;
        this.spriteSourceSizeX = destX;
        this.spriteSourceSizeY = destY;
        this.spriteSourceSizeW = destWidth;
        this.spriteSourceSizeH = destHeight;
    };
    return Frame;
})();
/// <reference path="../../Game.ts" />
/// <reference path="../../Sprite.ts" />
/// <reference path="AnimationLoader.ts" />
/// <reference path="Frame.ts" />
/// <reference path="FrameData.ts" />
/**
*	Animation
*
*	@desc 		Loads Sprite Sheets and Texture Atlas formats into a unified FrameData object
*
*	@version 	1.0 - 22nd March 2013
*	@author 	Richard Davey
*/
var Animation = (function () {
    function Animation(game, parent, frameData, name, frames, delay, looped) {
        this._game = game;
        this._parent = parent;
        this._frames = frames;
        this._frameData = frameData;
        this.name = name;
        this.delay = 1000 / delay;
        this.looped = looped;
        this.isFinished = false;
        this.isPlaying = false;
    }
    Object.defineProperty(Animation.prototype, "frameTotal", {
        get: function () {
            return this._frames.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Animation.prototype, "frame", {
        get: function () {
            return this._frameIndex;
        },
        set: function (value) {
            this.currentFrame = this._frameData.getFrame(value);
            if(this.currentFrame !== null) {
                this._parent.bounds.width = this.currentFrame.width;
                this._parent.bounds.height = this.currentFrame.height;
                this._frameIndex = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Animation.prototype.play = function (frameRate, loop) {
        if (typeof frameRate === "undefined") { frameRate = null; }
        if(frameRate !== null) {
            this.delay = 1000 / frameRate;
        }
        if(loop !== undefined) {
            this.looped = loop;
        }
        this.isPlaying = true;
        this.isFinished = false;
        this._timeLastFrame = this._game.time.now;
        this._timeNextFrame = this._game.time.now + this.delay;
        this._frameIndex = 0;
        this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);
    };
    Animation.prototype.onComplete = function () {
        this.isPlaying = false;
        this.isFinished = true;
        //  callback
            };
    Animation.prototype.stop = function () {
        this.isPlaying = false;
        this.isFinished = true;
    };
    Animation.prototype.update = function () {
        if(this.isPlaying == true && this._game.time.now >= this._timeNextFrame) {
            this._frameIndex++;
            if(this._frameIndex == this._frames.length) {
                if(this.looped) {
                    this._frameIndex = 0;
                    this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);
                } else {
                    this.onComplete();
                }
            } else {
                this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);
            }
            this._timeLastFrame = this._game.time.now;
            this._timeNextFrame = this._game.time.now + this.delay;
            return true;
        }
        return false;
    };
    Animation.prototype.destroy = function () {
        this._game = null;
        this._parent = null;
        this._frames = null;
        this._frameData = null;
        this.currentFrame = null;
        this.isPlaying = false;
    };
    return Animation;
})();
/// <reference path="../../Game.ts" />
/// <reference path="../../Sprite.ts" />
/// <reference path="Animation.ts" />
/// <reference path="Frame.ts" />
/// <reference path="FrameData.ts" />
var AnimationLoader = (function () {
    function AnimationLoader() { }
    AnimationLoader.parseSpriteSheet = function parseSpriteSheet(game, key, frameWidth, frameHeight, frameMax) {
        //  How big is our image?
        var img = game.cache.getImage(key);
        if(img == null) {
            return null;
        }
        var width = img.width;
        var height = img.height;
        var row = Math.round(width / frameWidth);
        var column = Math.round(height / frameHeight);
        var total = row * column;
        if(frameMax !== -1) {
            total = frameMax;
        }
        //  Zero or smaller than frame sizes?
        if(width == 0 || height == 0 || width < frameWidth || height < frameHeight || total === 0) {
            return null;
        }
        //  Let's create some frames then
        var data = new FrameData();
        var x = 0;
        var y = 0;
        //console.log('\n\nSpriteSheet Data');
        //console.log('Image Size:', width, 'x', height);
        //console.log('Frame Size:', frameWidth, 'x', frameHeight);
        //console.log('Start X/Y:', x, 'x', y);
        //console.log('Frames (Total: ' + total + ')');
        //console.log('-------------');
        for(var i = 0; i < total; i++) {
            data.addFrame(new Frame(x, y, frameWidth, frameHeight));
            //console.log('Frame', i, '=', x, y);
            x += frameWidth;
            if(x === width) {
                x = 0;
                y += frameHeight;
            }
        }
        return data;
    };
    AnimationLoader.parseJSONData = function parseJSONData(game, json) {
        //  Let's create some frames then
        var data = new FrameData();
        //  By this stage frames is a fully parsed array
        var frames = json;
        var newFrame;
        for(var i = 0; i < frames.length; i++) {
            newFrame = data.addFrame(new Frame(frames[i].frame.x, frames[i].frame.y, frames[i].frame.w, frames[i].frame.h));
            newFrame.setTrim(frames[i].trimmed, frames[i].sourceSize.w, frames[i].sourceSize.h, frames[i].spriteSourceSize.x, frames[i].spriteSourceSize.y, frames[i].spriteSourceSize.w, frames[i].spriteSourceSize.h);
            newFrame.filename = frames[i].filename;
        }
        return data;
    };
    return AnimationLoader;
})();
/// <reference path="system/animation/AnimationLoader.ts" />
var Cache = (function () {
    function Cache(game) {
        this._game = game;
        this._canvases = {
        };
        this._images = {
        };
        this._sounds = {
        };
        this._text = {
        };
    }
    Cache.prototype.addCanvas = function (key, canvas, context) {
        this._canvases[key] = {
            canvas: canvas,
            context: context
        };
    };
    Cache.prototype.addSpriteSheet = function (key, url, data, frameWidth, frameHeight, frameMax) {
        this._images[key] = {
            url: url,
            data: data,
            spriteSheet: true,
            frameWidth: frameWidth,
            frameHeight: frameHeight
        };
        this._images[key].frameData = AnimationLoader.parseSpriteSheet(this._game, key, frameWidth, frameHeight, frameMax);
    };
    Cache.prototype.addTextureAtlas = function (key, url, data, jsonData) {
        this._images[key] = {
            url: url,
            data: data,
            spriteSheet: true
        };
        this._images[key].frameData = AnimationLoader.parseJSONData(this._game, jsonData);
    };
    Cache.prototype.addImage = function (key, url, data) {
        this._images[key] = {
            url: url,
            data: data,
            spriteSheet: false
        };
    };
    Cache.prototype.addSound = function (key, url, data) {
        this._sounds[key] = {
            url: url,
            data: data,
            decoded: false
        };
    };
    Cache.prototype.decodedSound = function (key, data) {
        this._sounds[key].data = data;
        this._sounds[key].decoded = true;
    };
    Cache.prototype.addText = function (key, url, data) {
        this._text[key] = {
            url: url,
            data: data
        };
    };
    Cache.prototype.getCanvas = function (key) {
        if(this._canvases[key]) {
            return this._canvases[key].canvas;
        }
        return null;
    };
    Cache.prototype.getImage = function (key) {
        if(this._images[key]) {
            return this._images[key].data;
        }
        return null;
    };
    Cache.prototype.getFrameData = function (key) {
        if(this._images[key] && this._images[key].spriteSheet == true) {
            return this._images[key].frameData;
        }
        return null;
    };
    Cache.prototype.getSound = function (key) {
        if(this._sounds[key]) {
            return this._sounds[key].data;
        }
        return null;
    };
    Cache.prototype.isSoundDecoded = function (key) {
        if(this._sounds[key]) {
            return this._sounds[key].decoded;
        }
    };
    Cache.prototype.isSpriteSheet = function (key) {
        if(this._images[key]) {
            return this._images[key].spriteSheet;
        }
    };
    Cache.prototype.getText = function (key) {
        if(this._text[key]) {
            return this._text[key].data;
        }
        return null;
    };
    Cache.prototype.destroy = function () {
        for(var item in this._canvases) {
            delete this._canvases[item['key']];
        }
        for(var item in this._images) {
            delete this._images[item['key']];
        }
        for(var item in this._sounds) {
            delete this._sounds[item['key']];
        }
        for(var item in this._text) {
            delete this._text[item['key']];
        }
    };
    return Cache;
})();
/// <reference path="Cache.ts" />
/// <reference path="Game.ts" />
/// <reference path="Sprite.ts" />
/// <reference path="system/animation/Animation.ts" />
/// <reference path="system/animation/AnimationLoader.ts" />
/// <reference path="system/animation/Frame.ts" />
/// <reference path="system/animation/FrameData.ts" />
var Animations = (function () {
    function Animations(game, parent) {
        this._frameData = null;
        this.currentFrame = null;
        this._game = game;
        this._parent = parent;
        this._anims = {
        };
    }
    Animations.prototype.loadFrameData = function (frameData) {
        this._frameData = frameData;
        this.frame = 0;
    };
    Animations.prototype.add = function (name, frames, frameRate, loop) {
        if (typeof frames === "undefined") { frames = null; }
        if (typeof frameRate === "undefined") { frameRate = 60; }
        if (typeof loop === "undefined") { loop = false; }
        if(this._frameData == null) {
            return;
        }
        if(frames == null) {
            frames = this._frameData.getFrameIndexes();
        } else {
            if(this.validateFrames(frames) == false) {
                return;
            }
        }
        this._anims[name] = new Animation(this._game, this._parent, this._frameData, name, frames, frameRate, loop);
        this.currentAnim = this._anims[name];
    };
    Animations.prototype.validateFrames = function (frames) {
        var result = true;
        for(var i = 0; i < frames.length; i++) {
            if(frames[i] > this._frameData.total) {
                return false;
            }
        }
    };
    Animations.prototype.play = function (name, frameRate, loop) {
        if (typeof frameRate === "undefined") { frameRate = null; }
        if(this._anims[name]) {
            this.currentAnim = this._anims[name];
            this.currentAnim.play(frameRate, loop);
        }
    };
    Animations.prototype.stop = function (name) {
        if(this._anims[name]) {
            this.currentAnim = this._anims[name];
            this.currentAnim.stop();
        }
    };
    Animations.prototype.update = function () {
        if(this.currentAnim && this.currentAnim.update() == true) {
            this.currentFrame = this.currentAnim.currentFrame;
            this._parent.bounds.width = this.currentFrame.width;
            this._parent.bounds.height = this.currentFrame.height;
        }
    };
    Object.defineProperty(Animations.prototype, "frameTotal", {
        get: function () {
            return this._frameData.total;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Animations.prototype, "frame", {
        get: function () {
            return this._frameIndex;
        },
        set: function (value) {
            this.currentFrame = this._frameData.getFrame(value);
            if(this.currentFrame !== null) {
                this._parent.bounds.width = this.currentFrame.width;
                this._parent.bounds.height = this.currentFrame.height;
                this._frameIndex = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    return Animations;
})();
/// <reference path="Game.ts" />
var State = (function () {
    function State(game) {
        this.game = game;
        this.camera = game.camera;
        this.cache = game.cache;
        this.input = game.input;
        this.loader = game.loader;
        this.sound = game.sound;
        this.stage = game.stage;
        this.time = game.time;
        this.math = game.math;
        this.world = game.world;
    }
    State.prototype.init = //  Overload these in your own States
    function () {
    };
    State.prototype.create = function () {
    };
    State.prototype.update = function () {
    };
    State.prototype.render = function () {
    };
    State.prototype.paused = function () {
    };
    State.prototype.createCamera = //  Handy Proxy methods
    function (x, y, width, height) {
        return this.game.world.createCamera(x, y, width, height);
    };
    State.prototype.createSprite = function (x, y, key) {
        if (typeof key === "undefined") { key = ''; }
        return this.game.world.createSprite(x, y, key);
    };
    State.prototype.createGroup = function (MaxSize) {
        if (typeof MaxSize === "undefined") { MaxSize = 0; }
        return this.game.world.createGroup(MaxSize);
    };
    State.prototype.createParticle = function () {
        return this.game.world.createParticle();
    };
    State.prototype.createEmitter = function (x, y, size) {
        if (typeof x === "undefined") { x = 0; }
        if (typeof y === "undefined") { y = 0; }
        if (typeof size === "undefined") { size = 0; }
        return this.game.world.createEmitter(x, y, size);
    };
    State.prototype.createTilemap = function (key, mapData, format, tileWidth, tileHeight) {
        return this.game.world.createTilemap(key, mapData, format, tileWidth, tileHeight);
    };
    State.prototype.collide = function (ObjectOrGroup1, ObjectOrGroup2, NotifyCallback) {
        if (typeof ObjectOrGroup1 === "undefined") { ObjectOrGroup1 = null; }
        if (typeof ObjectOrGroup2 === "undefined") { ObjectOrGroup2 = null; }
        if (typeof NotifyCallback === "undefined") { NotifyCallback = null; }
        return this.game.world.overlap(ObjectOrGroup1, ObjectOrGroup2, NotifyCallback, World.separate);
    };
    return State;
})();
/// <reference path="../GameObject.ts" />
/// <reference path="../Tilemap.ts" />
/**
* A simple helper object for <code>Tilemap</code> that helps expand collision opportunities and control.
* You can use <code>Tilemap.setTileProperties()</code> to alter the collision properties and
* callback functions and filters for this object to do things like one-way tiles or whatever.
*
* @author	Adam Atomic
* @author	Richard Davey
*/
var Tile = (function (_super) {
    __extends(Tile, _super);
    /**
    * Instantiate this new tile object.  This is usually called from <code>FlxTilemap.loadMap()</code>.
    *
    * @param Tilemap			A reference to the tilemap object creating the tile.
    * @param Index				The actual core map data index for this tile type.
    * @param Width				The width of the tile.
    * @param Height			The height of the tile.
    * @param Visible			Whether the tile is visible or not.
    * @param AllowCollisions	The collision flags for the object.  By default this value is ANY or NONE depending on the parameters sent to loadMap().
    */
    function Tile(game, Tilemap, Index, Width, Height, Visible, AllowCollisions) {
        _super.call(this, game, 0, 0, Width, Height);
        this.immovable = true;
        this.moves = false;
        this.callback = null;
        this.filter = null;
        this.tilemap = Tilemap;
        this.index = Index;
        this.visible = Visible;
        this.allowCollisions = AllowCollisions;
        this.mapIndex = 0;
    }
    Tile.prototype.destroy = /**
    * Clean up memory.
    */
    function () {
        _super.prototype.destroy.call(this);
        this.callback = null;
        this.tilemap = null;
    };
    return Tile;
})(GameObject);
