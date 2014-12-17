/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A collection of useful mathematical functions.
*
* These are normally accessed through `game.math`.
*
* @class Phaser.Math
* @static
* @see {@link Phaser.Utils}
* @see {@link Phaser.ArrayUtils}
*/
Phaser.Math = {

    /**
    * Twice PI.
    * @property {number} Phaser.Math#PI2
    * @default ~6.283
    * @deprecated 2.2.0 - Not used internally. Use `2 * Math.PI` instead.
    */
    PI2: Math.PI * 2,

    /**
    * Two number are fuzzyEqual if their difference is less than epsilon.
    *
    * @method Phaser.Math#fuzzyEqual
    * @param {number} a
    * @param {number} b
    * @param {number} [epsilon=(small value)]
    * @return {boolean} True if |a-b|<epsilon
    */
    fuzzyEqual: function (a, b, epsilon) {
        if (typeof epsilon === 'undefined') { epsilon = 0.0001; }
        return Math.abs(a - b) < epsilon;
    },

    /**
    * `a` is fuzzyLessThan `b` if it is less than b + epsilon.
    *
    * @method Phaser.Math#fuzzyLessThan
    * @param {number} a
    * @param {number} b
    * @param {number} [epsilon=(small value)]
    * @return {boolean} True if a<b+epsilon
    */
    fuzzyLessThan: function (a, b, epsilon) {
        if (typeof epsilon === 'undefined') { epsilon = 0.0001; }
        return a < b + epsilon;
    },

    /**
    * `a` is fuzzyGreaterThan `b` if it is more than b - epsilon.
    *
    * @method Phaser.Math#fuzzyGreaterThan
    * @param {number} a
    * @param {number} b
    * @param {number} [epsilon=(small value)]
    * @return {boolean} True if a>b+epsilon
    */
    fuzzyGreaterThan: function (a, b, epsilon) {
        if (typeof epsilon === 'undefined') { epsilon = 0.0001; }
        return a > b - epsilon;
    },

    /**
    * @method Phaser.Math#fuzzyCeil
    *
    * @param {number} val
    * @param {number} [epsilon=(small value)]
    * @return {boolean} ceiling(val-epsilon)
    */
    fuzzyCeil: function (val, epsilon) {
        if (typeof epsilon === 'undefined') { epsilon = 0.0001; }
        return Math.ceil(val - epsilon);
    },

    /**
    * @method Phaser.Math#fuzzyFloor
    *
    * @param {number} val
    * @param {number} [epsilon=(small value)]
    * @return {boolean} floor(val-epsilon)
    */
    fuzzyFloor: function (val, epsilon) {
        if (typeof epsilon === 'undefined') { epsilon = 0.0001; }
        return Math.floor(val + epsilon);
    },

    /**
    * Averages all values passed to the function and returns the result.
    *
    * @method Phaser.Math#average
    * @params {...number} The numbers to average
    * @return {number} The average of all given values.
    */
    average: function () {

        var sum = 0;

        for (var i = 0; i < arguments.length; i++) {
            sum += (+arguments[i]);
        }

        return sum / arguments.length;

    },

    /**
    * @method Phaser.Math#truncate
    * @param {number} n
    * @return {integer}
    * @deprecated 2.2.0 - Use `Math.trunc` (now with polyfill)
    */
    truncate: function (n) {
        return Math.trunc(n);
    },

    /**
    * @method Phaser.Math#shear
    * @param {number} n
    * @return {number} n mod 1
    */
    shear: function (n) {
        return n % 1;
    },

    /**
    * Snap a value to nearest grid slice, using rounding.
    *
    * Example: if you have an interval gap of 5 and a position of 12... you will snap to 10 whereas 14 will snap to 15.
    *
    * @method Phaser.Math#snapTo
    * @param {number} input - The value to snap.
    * @param {number} gap - The interval gap of the grid.
    * @param {number} [start] - Optional starting offset for gap.
    * @return {number}
    */
    snapTo: function (input, gap, start) {

        if (typeof start === 'undefined') { start = 0; }

        if (gap === 0) {
            return input;
        }

        input -= start;
        input = gap * Math.round(input / gap);

        return start + input;

    },

    /**
    * Snap a value to nearest grid slice, using floor.
    *
    * Example: if you have an interval gap of 5 and a position of 12... you will snap to 10. As will 14 snap to 10... but 16 will snap to 15
    *
    * @method Phaser.Math#snapToFloor
    * @param {number} input - The value to snap.
    * @param {number} gap - The interval gap of the grid.
    * @param {number} [start] - Optional starting offset for gap.
    * @return {number}
    */
    snapToFloor: function (input, gap, start) {

        if (typeof start === 'undefined') { start = 0; }

        if (gap === 0) {
            return input;
        }

        input -= start;
        input = gap * Math.floor(input / gap);

        return start + input;

    },

    /**
    * Snap a value to nearest grid slice, using ceil.
    *
    * Example: if you have an interval gap of 5 and a position of 12... you will snap to 15. As will 14 will snap to 15... but 16 will snap to 20.
    *
    * @method Phaser.Math#snapToCeil
    * @param {number} input - The value to snap.
    * @param {number} gap - The interval gap of the grid.
    * @param {number} [start] - Optional starting offset for gap.
    * @return {number}
    */
    snapToCeil: function (input, gap, start) {

        if (typeof start === 'undefined') { start = 0; }

        if (gap === 0) {
            return input;
        }

        input -= start;
        input = gap * Math.ceil(input / gap);

        return start + input;

    },

    /**
    * Snaps a value to the nearest value in an array.
    *
    * @method Phaser.Math#snapToInArray
    * @param {number} input
    * @param {number[]} arr
    * @param {boolean} sort - True if the array needs to be sorted.
    * @return {number}
    * @deprecated 2.2.0 - See {@link Phaser.ArrayUtils.findClosest} for an alternative.
    */
    snapToInArray: function (input, arr, sort) {

        if (typeof sort === 'undefined') { sort = true; }

        if (sort) {
            arr.sort();
        }

        return Phaser.ArrayUtils.findClosest(input, arr);

    },

    /**
    * Round to some place comparative to a `base`, default is 10 for decimal place.
    * The `place` is represented by the power applied to `base` to get that place.
    *
    *     e.g. 2000/7 ~= 285.714285714285714285714 ~= (bin)100011101.1011011011011011
    *
    *     roundTo(2000/7,3) === 0
    *     roundTo(2000/7,2) == 300
    *     roundTo(2000/7,1) == 290
    *     roundTo(2000/7,0) == 286
    *     roundTo(2000/7,-1) == 285.7
    *     roundTo(2000/7,-2) == 285.71
    *     roundTo(2000/7,-3) == 285.714
    *     roundTo(2000/7,-4) == 285.7143
    *     roundTo(2000/7,-5) == 285.71429
    *
    *     roundTo(2000/7,3,2)  == 288       -- 100100000
    *     roundTo(2000/7,2,2)  == 284       -- 100011100
    *     roundTo(2000/7,1,2)  == 286       -- 100011110
    *     roundTo(2000/7,0,2)  == 286       -- 100011110
    *     roundTo(2000/7,-1,2) == 285.5     -- 100011101.1
    *     roundTo(2000/7,-2,2) == 285.75    -- 100011101.11
    *     roundTo(2000/7,-3,2) == 285.75    -- 100011101.11
    *     roundTo(2000/7,-4,2) == 285.6875  -- 100011101.1011
    *     roundTo(2000/7,-5,2) == 285.71875 -- 100011101.10111
    *
    * Note what occurs when we round to the 3rd space (8ths place), 100100000, this is to be assumed
    * because we are rounding 100011.1011011011011011 which rounds up.
    *
    * @method Phaser.Math#roundTo
    * @param {number} value - The value to round.
    * @param {number} place - The place to round to.
    * @param {number} base - The base to round in... default is 10 for decimal.
    * @return {number}
    */
    roundTo: function (value, place, base) {

        if (typeof place === 'undefined') { place = 0; }
        if (typeof base === 'undefined') { base = 10; }

        var p = Math.pow(base, -place);

        return Math.round(value * p) / p;

    },

    /**
    * @method Phaser.Math#floorTo
    * @param {number} value - The value to round.
    * @param {number} place - The place to round to.
    * @param {number} base - The base to round in... default is 10 for decimal.
    * @return {number}
    */
    floorTo: function (value, place, base) {

        if (typeof place === 'undefined') { place = 0; }
        if (typeof base === 'undefined') { base = 10; }

        var p = Math.pow(base, -place);

        return Math.floor(value * p) / p;

    },

    /**
    * @method Phaser.Math#ceilTo
    * @param {number} value - The value to round.
    * @param {number} place - The place to round to.
    * @param {number} base - The base to round in... default is 10 for decimal.
    * @return {number}
    */
    ceilTo: function (value, place, base) {

        if (typeof place === 'undefined') { place = 0; }
        if (typeof base === 'undefined') { base = 10; }

        var p = Math.pow(base, -place);

        return Math.ceil(value * p) / p;

    },

    /**
    * A one dimensional linear interpolation of a value.
    * @method Phaser.Math#interpolateFloat
    * @param {number} a
    * @param {number} b
    * @param {number} weight
    * @return {number}
    * @deprecated 2.2.0 - See {@link Phaser.Math#linear}
    */
    interpolateFloat: function (a, b, weight) {
        return (b - a) * weight + a;
    },

    /**
    * Find the angle of a segment from (x1, y1) -> (x2, y2).
    * @method Phaser.Math#angleBetween
    * @param {number} x1
    * @param {number} y1
    * @param {number} x2
    * @param {number} y2
    * @return {number} The angle, in radians.
    */
    angleBetween: function (x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    },

    /**
    * Find the angle of a segment from (x1, y1) -> (x2, y2).
    * Note that the difference between this method and Math.angleBetween is that this assumes the y coordinate travels
    * down the screen.
    * 
    * @method Phaser.Math#angleBetweenY
    * @param {number} x1
    * @param {number} y1
    * @param {number} x2
    * @param {number} y2
    * @return {number} The angle, in radians.
    */
    angleBetweenY: function (x1, y1, x2, y2) {
        return Math.atan2(x2 - x1, y2 - y1);
    },

    /**
    * Find the angle of a segment from (point1.x, point1.y) -> (point2.x, point2.y).
    * @method Phaser.Math#angleBetweenPoints
    * @param {Phaser.Point} point1
    * @param {Phaser.Point} point2
    * @return {number} The angle, in radians.
    */
    angleBetweenPoints: function (point1, point2) {
        return Math.atan2(point2.y - point1.y, point2.x - point1.x);
    },

    /**
    * Find the angle of a segment from (point1.x, point1.y) -> (point2.x, point2.y).
    * @method Phaser.Math#angleBetweenPointsY
    * @param {Phaser.Point} point1
    * @param {Phaser.Point} point2
    * @return {number} The angle, in radians.
    */
    angleBetweenPointsY: function (point1, point2) {
        return Math.atan2(point2.x - point1.x, point2.y - point1.y);
    },

    /**
    * Reverses an angle.
    * @method Phaser.Math#reverseAngle
    * @param {number} angleRad - The angle to reverse, in radians.
    * @return {number} Returns the reverse angle, in radians.
    */
    reverseAngle: function (angleRad) {
        return this.normalizeAngle(angleRad + Math.PI, true);
    },

    /**
    * Normalizes an angle to the [0,2pi) range.
    * @method Phaser.Math#normalizeAngle
    * @param {number} angleRad - The angle to normalize, in radians.
    * @return {number} Returns the angle, fit within the [0,2pi] range, in radians.
    */
    normalizeAngle: function (angleRad) {

        angleRad = angleRad % (2 * Math.PI);
        return angleRad >= 0 ? angleRad : angleRad + 2 * Math.PI;

    },

    /**
    * Normalizes a latitude to the [-90,90] range. Latitudes above 90 or below -90 are capped, not wrapped.
    * @method Phaser.Math#normalizeLatitude
    * @param {number} lat - The latitude to normalize, in degrees.
    * @return {number} Returns the latitude, fit within the [-90,90] range.
    * @deprecated 2.2.0 - Use {@link Phaser.Math#clamp}.
    */
    normalizeLatitude: function (lat) {
        return Phaser.Math.clamp(lat, -90, 90);
    },

    /**
    * Normalizes a longitude to the [-180,180] range. Longitudes above 180 or below -180 are wrapped.
    * @method Phaser.Math#normalizeLongitude
    * @param {number} lng - The longitude to normalize, in degrees.
    * @return {number} Returns the longitude, fit within the [-180,180] range.
    * @deprecated 2.2.0 - Use {@link Phaser.Math#wrap}.
    */
    normalizeLongitude: function (lng) {
        return Phaser.Math.wrap(lng, -180, 180);
    },

    /**
    * Generate a random bool result based on the chance value.
    *
    * Returns true or false based on the chance value (default 50%). For example if you wanted a player to have a 30% chance
    * of getting a bonus, call chanceRoll(30) - true means the chance passed, false means it failed.
    *
    * @method Phaser.Math#chanceRoll
    * @param {number} chance - The chance of receiving the value. A number between 0 and 100 (effectively 0% to 100%).
    * @return {boolean} True if the roll passed, or false otherwise.
    * @deprecated 2.2.0 - Use {@link Phaser.Utils.chanceRoll}
    */
    chanceRoll: function (chance) {
        return Phaser.Utils.chanceRoll(chance);
    },

    /**
    * Create an array representing the inclusive range of numbers (usually integers) in `[start, end]`.
    *
    * @method Phaser.Math#numberArray
    * @param {number} start - The minimum value the array starts with.
    * @param {number} end - The maximum value the array contains.
    * @return {number[]} The array of number values.
    * @deprecated 2.2.0 - See {@link Phaser.ArrayUtils.numberArray}
    */
    numberArray: function (start, end) {
        return Phaser.ArrayUtils.numberArray(start, end);
    },

    /**
    * Create an array of numbers (positive and/or negative) progressing from `start`
    * up to but not including `end` by advancing by `step`.
    *
    * If `start` is less than `stop` a zero-length range is created unless a negative `step` is specified.
    *
    * Certain values for `start` and `end` (eg. NaN/undefined/null) are coerced to 0;
    * for forward compatibility make sure to pass in actual numbers.
    *
    * @method Phaser.Math#numberArrayStep
    * @param {number} start - The start of the range.
    * @param {number} end - The end of the range.
    * @param {number} [step=1] - The value to increment or decrement by.
    * @returns {Array} Returns the new array of numbers.
    * @deprecated 2.2.0 - See {@link Phaser.ArrayUtils.numberArrayStep}
    */
    numberArrayStep: function(start, end, step) {
        return Phaser.ArrayUtils.numberArrayStep(start, end, step);
    },

    /**
    * Adds the given amount to the value, but never lets the value go over the specified maximum.
    *
    * @method Phaser.Math#maxAdd
    * @param {number} value - The value to add the amount to.
    * @param {number} amount - The amount to add to the value.
    * @param {number} max - The maximum the value is allowed to be.
    * @return {number}
    */
    maxAdd: function (value, amount, max) {
        return Math.min(value + amount, max);
    },

    /**
    * Subtracts the given amount from the value, but never lets the value go below the specified minimum.
    *
    * @method Phaser.Math#minSub
    * @param {number} value - The base value.
    * @param {number} amount - The amount to subtract from the base value.
    * @param {number} min - The minimum the value is allowed to be.
    * @return {number} The new value.
    */
    minSub: function (value, amount, min) {
        return Math.max(value - amount, min);
    },

    /**
    * Ensures that the value always stays between min and max, by wrapping the value around.
    *
    * If `max` is not larger than `min` the result is 0.
    *
    * @method Phaser.Math#wrap
    * @param {number} value - The value to wrap.
    * @param {number} min - The minimum the value is allowed to be.
    * @param {number} max - The maximum the value is allowed to be, should be larger than `min`.
    * @return {number} The wrapped value.
    */
    wrap: function (value, min, max) {

        var range = max - min;

        if (range <= 0)
        {
            return 0;
        }

        var result = (value - min) % range;

        if (result < 0)
        {
            result += range;
        }

        return result + min;

    },

    /**
    * Adds value to amount and ensures that the result always stays between 0 and max, by wrapping the value around.
    *
    * Values _must_ be positive integers, and are passed through Math.abs. See {@link Phaser.Math#wrap} for an alternative.
    *
    * @method Phaser.Math#wrapValue
    * @param {number} value - The value to add the amount to.
    * @param {number} amount - The amount to add to the value.
    * @param {number} max - The maximum the value is allowed to be.
    * @return {number} The wrapped value.
    */
    wrapValue: function (value, amount, max) {

        var diff;
        value = Math.abs(value);
        amount = Math.abs(amount);
        max = Math.abs(max);
        diff = (value + amount) % max;

        return diff;

    },

    /**
    * Ensures the given value is between min and max inclusive.
    *
    * @method Phaser.Math#limitValue
    * @param {number} value - The value to limit.
    * @param {number} min - The minimum the value can be.
    * @param {number} max - The maximum the value can be.
    * @return {number} The limited value.
    * @deprecated 2.2.0 - Use {@link Phaser.Math#clamp}
    */
    limitValue: function(value, min, max) {
        return Phaser.Math.clamp(value, min, max);
    },

    /**
    * Randomly returns either a 1 or -1.
    *
    * @method Phaser.Math#randomSign
    * @return {number} Either 1 or -1
    * @deprecated 2.2.0 - Use {@link Phaser.Utils.randomChoice} or other
    */
    randomSign: function () {
        return Phaser.Utils.randomChoice(-1, 1);
    },

    /**
    * Returns true if the number given is odd.
    *
    * @method Phaser.Math#isOdd
    * @param {integer} n - The number to check.
    * @return {boolean} True if the given number is odd. False if the given number is even.    
    */
    isOdd: function (n) {
        // Does not work with extremely large values
        return (n & 1);
    },

    /**
    * Returns true if the number given is even.
    *
    * @method Phaser.Math#isEven
    * @param {integer} n - The number to check.
    * @return {boolean} True if the given number is even. False if the given number is odd.
    */
    isEven: function (n) {
        // Does not work with extremely large values
        return !(n & 1);
    },

    /**
    * Variation of Math.min that can be passed either an array of numbers or the numbers as parameters.    
    *
    * Prefer the standard `Math.min` function when appropriate.
    *
    * @method Phaser.Math#min
    * @return {number} The lowest value from those given.
    * @see {@link http://jsperf.com/math-s-min-max-vs-homemade}
    */
    min: function () {
 
        if (arguments.length === 1 && typeof arguments[0] === 'object')
        {
            var data = arguments[0];
        }
        else
        {
            var data = arguments;
        }
 
        for (var i = 1, min = 0, len = data.length; i < len; i++)
        {
            if (data[i] < data[min])
            {
                min = i;
            }
        }

        return data[min];

    },

    /**
    * Variation of Math.max that can be passed either an array of numbers or the numbers as parameters.
    *
    * Prefer the standard `Math.max` function when appropriate.
    *
    * @method Phaser.Math#max
    * @return {number} The largest value from those given.
    * @see {@link http://jsperf.com/math-s-min-max-vs-homemade}
    */
    max: function () {
 
        if (arguments.length === 1 && typeof arguments[0] === 'object')
        {
            var data = arguments[0];
        }
        else
        {
            var data = arguments;
        }
 
        for (var i = 1, max = 0, len = data.length; i < len; i++)
        {
            if (data[i] > data[max])
            {
                max = i;
            }
        }

        return data[max];

    },

    /**
    * Variation of Math.min that can be passed a property and either an array of objects or the objects as parameters.
    * It will find the lowest matching property value from the given objects.
    *
    * @method Phaser.Math#minProperty
    * @return {number} The lowest value from those given.
    */
    minProperty: function (property) {

        if (arguments.length === 2 && typeof arguments[1] === 'object')
        {
            var data = arguments[1];
        }
        else
        {
            var data = arguments.slice(1);
        }

        for (var i = 1, min = 0, len = data.length; i < len; i++)
        {
            if (data[i][property] < data[min][property])
            {
                min = i;
            }
        }

        return data[min][property];

    },

    /**
    * Variation of Math.max that can be passed a property and either an array of objects or the objects as parameters.
    * It will find the largest matching property value from the given objects.
    *
    * @method Phaser.Math#maxProperty
    * @return {number} The largest value from those given.
    */
    maxProperty: function (property) {

        if (arguments.length === 2 && typeof arguments[1] === 'object')
        {
            var data = arguments[1];
        }
        else
        {
            var data = arguments.slice(1);
        }

        for (var i = 1, max = 0, len = data.length; i < len; i++)
        {
            if (data[i][property] > data[max][property])
            {
                max = i;
            }
        }

        return data[max][property];

    },

    /**
    * Keeps an angle value between -180 and +180; or -PI and PI if radians.
    *
    * @method Phaser.Math#wrapAngle
    * @param {number} angle - The angle value to wrap
    * @param {boolean} [radians=false] - Set to `true` if the angle is given in radians, otherwise degrees is expected.
    * @return {number} The new angle value; will be the same as the input angle if it was within bounds.
    */
    wrapAngle: function (angle, radians) {

        return radians ? this.wrap(angle, -Math.PI, Math.PI) : this.wrap(angle, -180, 180);

    },

    /**
    * Keeps an angle value between the given min and max values.
    *
    * @method Phaser.Math#angleLimit
    * @param {number} angle - The angle value to check. Must be between -180 and +180.
    * @param {number} min - The minimum angle that is allowed (must be -180 or greater).
    * @param {number} max - The maximum angle that is allowed (must be 180 or less).
    * @return {number} The new angle value, returns the same as the input angle if it was within bounds
    * @deprecated 2.2.0 - Use {@link Phaser.Math#clamp} instead
    */
    angleLimit: function (angle, min, max) {

        var result = angle;

        if (angle > max)
        {
            result = max;
        }
        else if (angle < min)
        {
            result = min;
        }

        return result;

    },

    /**
    * A Linear Interpolation Method, mostly used by Phaser.Tween.
    * @method Phaser.Math#linearInterpolation
    * @param {Array} v
    * @param {number} k
    * @return {number}
    */
    linearInterpolation: function (v, k) {

        var m = v.length - 1;
        var f = m * k;
        var i = Math.floor(f);

        if (k < 0)
        {
            return this.linear(v[0], v[1], f);
        }

        if (k > 1)
        {
            return this.linear(v[m], v[m - 1], m - f);
        }

        return this.linear(v[i], v[i + 1 > m ? m : i + 1], f - i);

    },

    /**
    * A Bezier Interpolation Method, mostly used by Phaser.Tween.
    * @method Phaser.Math#bezierInterpolation
    * @param {Array} v
    * @param {number} k
    * @return {number}
    */
    bezierInterpolation: function (v, k) {

        var b = 0;
        var n = v.length - 1;

        for (var i = 0; i <= n; i++)
        {
            b += Math.pow(1 - k, n - i) * Math.pow(k, i) * v[i] * this.bernstein(n, i);
        }

        return b;

    },

    /**
    * A Catmull Rom Interpolation Method, mostly used by Phaser.Tween.
    * @method Phaser.Math#catmullRomInterpolation
    * @param {Array} v
    * @param {number} k
    * @return {number}
    */
    catmullRomInterpolation: function (v, k) {

        var m = v.length - 1;
        var f = m * k;
        var i = Math.floor(f);

        if (v[0] === v[m])
        {
            if (k < 0)
            {
                i = Math.floor(f = m * (1 + k));
            }

            return this.catmullRom(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);

        }
        else
        {
            if (k < 0)
            {
                return v[0] - (this.catmullRom(v[0], v[0], v[1], v[1], -f) - v[0]);
            }

            if (k > 1)
            {
                return v[m] - (this.catmullRom(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);
            }

            return this.catmullRom(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);
        }

    },

    /**
    * Calculates a linear (interpolation) value over t.
    * 
    * @method Phaser.Math#linear
    * @param {number} p0
    * @param {number} p1
    * @param {number} t
    * @return {number}
    */
    linear: function (p0, p1, t) {
        return (p1 - p0) * t + p0;
    },

    /**
    * @method Phaser.Math#bernstein
    * @protected
    * @param {number} n
    * @param {number} i
    * @return {number}
    */
    bernstein: function (n, i) {
        return this.factorial(n) / this.factorial(i) / this.factorial(n - i);
    },

    /**
    * @method Phaser.Math#factorial
    * @param {number} value - the number you want to evaluate
    * @return {number}
    */
    factorial : function( value ){

        if(value === 0)
        {
            return 1;
        }

        var res = value;

        while( --value )
        {
            res *= value;
        }

        return res;

    },

    /**
    * Calculates a callmum rom value.
    * 
    * @method Phaser.Math#catmullRom
    * @protected
    * @param {number} p0
    * @param {number} p1
    * @param {number} p2
    * @param {number} p3
    * @param {number} t
    * @return {number}
    */
    catmullRom: function (p0, p1, p2, p3, t) {

        var v0 = (p2 - p0) * 0.5, v1 = (p3 - p1) * 0.5, t2 = t * t, t3 = t * t2;

        return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;

    },

    /**
    * The (absolute) difference between two values.
    *
    * @method Phaser.Math#difference
    * @param {number} a
    * @param {number} b
    * @return {number}
    */
    difference: function (a, b) {
        return Math.abs(a - b);
    },

    /**
    * Fetch a random entry from the given array.
    *
    * Will return null if there are no array items that fall within the specified range
    * or if there is no item for the randomly choosen index.
    *
    * @method Phaser.Math#getRandom
    * @param {any[]} objects - An array of objects.
    * @param {integer} startIndex - Optional offset off the front of the array. Default value is 0, or the beginning of the array.
    * @param {integer} length - Optional restriction on the number of values you want to randomly select from.
    * @return {object} The random object that was selected.    
    * @deprecated 2.2.0 - Use {@link Phaser.ArrayUtils.getRandomItem}
    */
    getRandom: function (objects, startIndex, length) {
        return Phaser.ArrayUtils.getRandomItem(objects, startIndex, length);
    },

    /**
    * Removes a random object from the given array and returns it.
    *
    * Will return null if there are no array items that fall within the specified range
    * or if there is no item for the randomly choosen index.
    *
    * @method Phaser.Math#removeRandom
    * @param {any[]} objects - An array of objects.
    * @param {integer} startIndex - Optional offset off the front of the array. Default value is 0, or the beginning of the array.
    * @param {integer} length - Optional restriction on the number of values you want to randomly select from.
    * @return {object} The random object that was removed.
    * @deprecated 2.2.0 - Use {@link Phaser.ArrayUtils.removeRandomItem}
    */
    removeRandom: function (objects, startIndex, length) {
        return Phaser.ArrayUtils.removeRandomItem(objects, startIndex, length);
    },

    /**
    * _Do not use this function._
    *
    * Round to the next whole number _towards_ zero.
    *
    * E.g. `floor(1.7) == 1`, and `floor(-2.7) == -2`.
    *
    * @method Phaser.Math#floor
    * @param {number} value - Any number.
    * @return {integer} The rounded value of that number.
    * @deprecated 2.2.0 - Use {@link Phaser.Math#truncate} or `Math.trunc` instead.
    */
    floor: function (value) {
        return Math.trunc(value);
    },

    /**
    * _Do not use this function._
    *
    * Round to the next whole number _away_ from zero.
    *
    * E.g. `ceil(1.3) == 2`, and `ceil(-2.3) == -3`.
    *
    * @method Phaser.Math#ceil
    * @param {number} value - Any number.
    * @return {integer} The rounded value of that number.
    * @deprecated 2.2.0 - Use {@link Phaser.Math#roundAwayFromZero} instead.
    */
    ceil: function (value) {
        return Phaser.Math.roundAwayFromZero(value);
    },

    /**
    * Round to the next whole number _away_ from zero.
    *
    * @method Phaser.Math#roundAwayFromZero
    * @param {number} value - Any number.
    * @return {integer} The rounded value of that number.
    */
    roundAwayFromZero: function (value) {
        // "Opposite" of truncate.
        return (value > 0) ? Math.ceil(value) : Math.floor(value);
    },

    /**
    * Generate a sine and cosine table simultaneously and extremely quickly. Based on research by Franky of scene.at
    *
    * The parameters allow you to specify the length, amplitude and frequency of the wave. Once you have called this function
    * you should get the results via getSinTable() and getCosTable(). This generator is fast enough to be used in real-time.
    *
    * @method Phaser.Math#sinCosGenerator
    * @param {number} length - The length of the wave
    * @param {number} sinAmplitude - The amplitude to apply to the sine table (default 1.0) if you need values between say -+ 125 then give 125 as the value
    * @param {number} cosAmplitude - The amplitude to apply to the cosine table (default 1.0) if you need values between say -+ 125 then give 125 as the value
    * @param {number} frequency  - The frequency of the sine and cosine table data
    * @return {{sin:number[], cos:number[]}} Returns the table data.
    */
    sinCosGenerator: function (length, sinAmplitude, cosAmplitude, frequency) {

        if (typeof sinAmplitude === 'undefined') { sinAmplitude = 1.0; }
        if (typeof cosAmplitude === 'undefined') { cosAmplitude = 1.0; }
        if (typeof frequency === 'undefined') { frequency = 1.0; }

        var sin = sinAmplitude;
        var cos = cosAmplitude;
        var frq = frequency * Math.PI / length;

        var cosTable = [];
        var sinTable = [];

        for (var c = 0; c < length; c++) {

            cos -= sin * frq;
            sin += cos * frq;

            cosTable[c] = cos;
            sinTable[c] = sin;

        }

        return { sin: sinTable, cos: cosTable, length: length };

    },

    /**
    * Moves the element from the start of the array to the end, shifting all items in the process.
    *
    * @method Phaser.Math#shift
    * @param {any[]} array - The array to shift/rotate. The array is modified.
    * @return {any} The shifted value.
    * @deprecated 2.2.0 - Use {@link Phaser.ArrayUtils.rotate} instead
    */
    shift: function (array) {

        var s = array.shift();
        array.push(s);

        return s;

    },

    /**
    * Shuffles the data in the given array into a new order.
    * @method Phaser.Math#shuffleArray
    * @param {any[]} array - The array to shuffle
    * @return {any[]} The array
    * @deprecated 2.2.0 - Use {@link Phaser.ArrayUtils.shuffle}
    */
    shuffleArray: function (array) {
        return Phaser.ArrayUtils.shuffle(array);
    },

    /**
    * Returns the distance between the two given set of coordinates.
    *
    * @method Phaser.Math#distance
    * @param {number} x1
    * @param {number} y1
    * @param {number} x2
    * @param {number} y2
    * @return {number} The distance between the two sets of coordinates.
    */
    distance: function (x1, y1, x2, y2) {

        var dx = x1 - x2;
        var dy = y1 - y2;

        return Math.sqrt(dx * dx + dy * dy);

    },

    /**
    * Returns the distance between the two given set of coordinates at the power given.
    *
    * @method Phaser.Math#distancePow
    * @param {number} x1
    * @param {number} y1
    * @param {number} x2
    * @param {number} y2
    * @param {number} [pow=2]
    * @return {number} The distance between the two sets of coordinates.
    */
    distancePow: function (x1, y1, x2, y2, pow) {

        if (typeof pow === 'undefined') { pow = 2; }

        return Math.sqrt(Math.pow(x2 - x1, pow) + Math.pow(y2 - y1, pow));

    },

    /**
    * Returns the rounded distance between the two given set of coordinates.
    *
    * @method Phaser.Math#distanceRounded
    * @param {number} x1
    * @param {number} y1
    * @param {number} x2
    * @param {number} y2
    * @return {number} The distance between this Point object and the destination Point object.
    * @deprecated 2.2.0 - Do the rounding locally.
    */
    distanceRounded: function (x1, y1, x2, y2) {
        return Math.round(Phaser.Math.distance(x1, y1, x2, y2));
    },

    /**
    * Force a value within the boundaries by clamping `x` to the range `[a, b]`.
    *
    * @method Phaser.Math#clamp
    * @param {number} x
    * @param {number} a
    * @param {number} b
    * @return {number}
    */
    clamp: function (x, a, b) {
        return ( x < a ) ? a : ( ( x > b ) ? b : x );
    },

    /**
    * Clamp `x` to the range `[a, Infinity)`.
    * Roughly the same as `Math.max(x, a)`, except for NaN handling.
    *
    * @method Phaser.Math#clampBottom
    * @param {number} x
    * @param {number} a
    * @return {number}
    */
    clampBottom: function (x, a) {
        return x < a ? a : x;
    },

    /**
    * Checks if two values are within the given tolerance of each other.
    *
    * @method Phaser.Math#within
    * @param {number} a - The first number to check
    * @param {number} b - The second number to check
    * @param {number} tolerance - The tolerance. Anything equal to or less than this is considered within the range.
    * @return {boolean} True if a is <= tolerance of b.
    * @see {@link Phaser.Math.fuzzyEqual}
    */
    within: function (a, b, tolerance) {
        return (Math.abs(a - b) <= tolerance);
    },

    /**
    * Linear mapping from range <a1, a2> to range <b1, b2>
    *
    * @method Phaser.Math#mapLinear
    * @param {number} x the value to map
    * @param {number} a1 first endpoint of the range <a1, a2>
    * @param {number} a2 final endpoint of the range <a1, a2>
    * @param {number} b1 first endpoint of the range <b1, b2>
    * @param {number} b2 final endpoint of the range  <b1, b2>
    * @return {number}
    */
    mapLinear: function (x, a1, a2, b1, b2) {
        return b1 + ( x - a1 ) * ( b2 - b1 ) / ( a2 - a1 );
    },

    /**
    * Smoothstep function as detailed at http://en.wikipedia.org/wiki/Smoothstep
    *
    * @method Phaser.Math#smoothstep
    * @param {number} x
    * @param {number} min
    * @param {number} max
    * @return {number}
    */
    smoothstep: function (x, min, max) {
        x = Math.max(0, Math.min(1, (x - min) / (max - min)));
        return x * x * (3 - 2 * x);
    },

    /**
    * Smootherstep function as detailed at http://en.wikipedia.org/wiki/Smoothstep
    *
    * @method Phaser.Math#smootherstep
    * @param {number} x
    * @param {number} min
    * @param {number} max
    * @return {number}
    */
    smootherstep: function (x, min, max) {
        x = Math.max(0, Math.min(1, (x - min) / (max - min)));
        return x * x * x * (x * (x * 6 - 15) + 10);
    },

    /**
    * A value representing the sign of the value: -1 for negative, +1 for positive, 0 if value is 0.
    *
    * This works differently from `Math.sign` for values of NaN and -0, etc.
    *
    * @method Phaser.Math#sign
    * @param {number} x
    * @return {integer} An integer in {-1, 0, 1}
    */
    sign: function (x) {
        return ( x < 0 ) ? -1 : ( ( x > 0 ) ? 1 : 0 );
    },

    /**
    * Work out what percentage value `a` is of value `b` using the given base.
    *
    * @method Phaser.Math#percent
    * @param {number} a - The value to work out the percentage for.
    * @param {number} b - The value you wish to get the percentage of.
    * @param {number} [base=0] - The base value.
    * @return {number} The percentage a is of b, between 0 and 1.
    */
    percent: function (a, b, base) {

        if (typeof base === 'undefined') { base = 0; }

        if (a > b || base > b)
        {
            return 1;
        }
        else if (a < base || base > a)
        {
            return 0;
        }
        else
        {
            return (a - base) / b;
        }

    }

};

var degreeToRadiansFactor = Math.PI / 180;
var radianToDegreesFactor = 180 / Math.PI;

/**
* Convert degrees to radians.
*
* @method Phaser.Math#degToRad
* @param {number} degrees - Angle in degrees.
* @return {number} Angle in radians.
*/
Phaser.Math.degToRad = function degToRad (degrees) {
    return degrees * degreeToRadiansFactor;
};

/**
* Convert degrees to radians.
*
* @method Phaser.Math#radToDeg
* @param {number} radians - Angle in radians.
* @return {number} Angle in degrees
*/
Phaser.Math.radToDeg = function radToDeg (radians) {
    return radians * radianToDegreesFactor;
};
