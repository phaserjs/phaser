/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A collection of mathematical methods.
*
* @class Phaser.Math
*/
Phaser.Math = {

    /**
    * = 2 &pi;
    * @method Phaser.Math#PI2
    */
    PI2: Math.PI * 2,

    /**
    * Two number are fuzzyEqual if their difference is less than &epsilon;.
    * @method Phaser.Math#fuzzyEqual
    * @param {number} a
    * @param {number} b
    * @param {number} epsilon
    * @return {boolean} True if |a-b|<&epsilon;
    */
    fuzzyEqual: function (a, b, epsilon) {
        if (typeof epsilon === "undefined") { epsilon = 0.0001; }
        return Math.abs(a - b) < epsilon;
    },

    /**
    * a is fuzzyLessThan b if it is less than b + &epsilon;.
    * @method Phaser.Math#fuzzyLessThan
    * @param {number} a
    * @param {number} b
    * @param {number} epsilon
    * @return {boolean} True if a<b+&epsilon;
    */
    fuzzyLessThan: function (a, b, epsilon) {
        if (typeof epsilon === "undefined") { epsilon = 0.0001; }
        return a < b + epsilon;
    },

    /**
    * a is fuzzyGreaterThan b if it is more than b - &epsilon;.
    * @method Phaser.Math#fuzzyGreaterThan
    * @param {number} a
    * @param {number} b
    * @param {number} epsilon
    * @return {boolean} True if a>b+&epsilon;
    */
    fuzzyGreaterThan: function (a, b, epsilon) {
        if (typeof epsilon === "undefined") { epsilon = 0.0001; }
        return a > b - epsilon;
    },

    /**
    * @method Phaser.Math#fuzzyCeil
    * @param {number} val
    * @param {number} epsilon
    * @return {boolean} ceiling(val-&epsilon;)
    */
    fuzzyCeil: function (val, epsilon) {
        if (typeof epsilon === "undefined") { epsilon = 0.0001; }
        return Math.ceil(val - epsilon);
    },

    /**
    * @method Phaser.Math#fuzzyFloor
    * @param {number} val
    * @param {number} epsilon
    * @return {boolean} floor(val-&epsilon;)
    */
    fuzzyFloor: function (val, epsilon) {
        if (typeof epsilon === "undefined") { epsilon = 0.0001; }
        return Math.floor(val + epsilon);
    },

    /**
    * Averages all values passed to the function and returns the result. You can pass as many parameters as you like.
    * @method Phaser.Math#average
    * @return {number} The average of all given values.
    */
    average: function () {

        var args = [];

        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            args[_i] = arguments[_i + 0];
        }

        var avg = 0;

        for (var i = 0; i < args.length; i++) {
            avg += args[i];
        }

        return avg / args.length;

    },

    /**
    * @method Phaser.Math#truncate
    * @param {number} n
    * @return {number}
    */
    truncate: function (n) {
        return (n > 0) ? Math.floor(n) : Math.ceil(n);
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

        if (typeof start === "undefined") { start = 0; }

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

        if (typeof start === "undefined") { start = 0; }

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

        if (typeof start === "undefined") { start = 0; }

        if (gap === 0) {
            return input;
        }

        input -= start;
        input = gap * Math.ceil(input / gap);

        return start + input;

    },


    /**
    * Snaps a value to the nearest value in an array.
    * @method Phaser.Math#snapToInArray
    * @param {number} input
    * @param {array} arr
    * @param {boolean} sort - True if the array needs to be sorted.
    * @return {number}
    */
    snapToInArray: function (input, arr, sort) {

        if (typeof sort === "undefined") { sort = true; }

        if (sort) {
            arr.sort();
        }

        if (input < arr[0]) {
            return arr[0];
        }

        var i = 1;

        while (arr[i] < input) {
            i++;
        }

        var low = arr[i - 1];
        var high = (i < arr.length) ? arr[i] : Number.POSITIVE_INFINITY;

        return ((high - input) <= (input - low)) ? high : low;

    },

    /**
    * Round to some place comparative to a 'base', default is 10 for decimal place.
    *
    * 'place' is represented by the power applied to 'base' to get that place
    * e.g.
    * 2000/7 ~= 285.714285714285714285714 ~= (bin)100011101.1011011011011011
    *
    * roundTo(2000/7,3) === 0
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

        if (typeof place === "undefined") { place = 0; }
        if (typeof base === "undefined") { base = 10; }

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

        if (typeof place === "undefined") { place = 0; }
        if (typeof base === "undefined") { base = 10; }

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

        if (typeof place === "undefined") { place = 0; }
        if (typeof base === "undefined") { base = 10; }

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
    * @return {number}
    */
    angleBetween: function (x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    },

    /**
    * Find the angle of a segment from (point1.x, point1.y) -> (point2.x, point2.y).
    * @method Phaser.Math#angleBetweenPoints
    * @param {Phaser.Point} point1
    * @param {Phaser.Point} point2
    * @return {number}
    */
    angleBetweenPoints: function (point1, point2) {
        return Math.atan2(point2.y - point1.y, point2.x - point1.x);
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
    */
    normalizeLatitude: function (lat) {
        return Math.max(-90, Math.min(90, lat));
    },

    /**
    * Normalizes a longitude to the [-180,180] range. Longitudes above 180 or below -180 are wrapped.
    * @method Phaser.Math#normalizeLongitude
    * @param {number} lng - The longitude to normalize, in degrees.
    * @return {number} Returns the longitude, fit within the [-180,180] range.
    */
    normalizeLongitude: function (lng) {

        if (lng % 360 == 180)
        {
            return 180;
        }

        lng = lng % 360;
        return lng < -180 ? lng + 360 : lng > 180 ? lng - 360 : lng;

    },

    /**
    * Closest angle between two angles from a1 to a2 absolute value the return for exact angle
    * @method Phaser.Math#nearestAngleBetween
    * @param {number} a1
    * @param {number} a2
    * @param {boolean} radians - True if angle sizes are expressed in radians.
    * @return {number}
    nearestAngleBetween: function (a1, a2, radians) {

        if (typeof radians === "undefined") { radians = true; }

        var rd = (radians) ? Math.PI : 180;
        a1 = this.normalizeAngle(a1, radians);
        a2 = this.normalizeAngle(a2, radians);

        if (a1 < -rd / 2 && a2 > rd / 2)
        {
            a1 += rd * 2;
        }

        if (a2 < -rd / 2 && a1 > rd / 2)
        {
            a2 += rd * 2;
        }

        return a2 - a1;

    },
    */

    /**
    * Interpolate across the shortest arc between two angles.
    * @method Phaser.Math#interpolateAngles
    * @param {number} a1 - Description.
    * @param {number} a2 - Description.
    * @param {number} weight - Description.
    * @param {boolean} radians - True if angle sizes are expressed in radians.
    * @param {Description} ease - Description.
    * @return {number}
    interpolateAngles: function (a1, a2, weight, radians, ease) {

        if (typeof radians === "undefined") { radians = true; }
        if (typeof ease === "undefined") { ease = null; }

        a1 = this.normalizeAngle(a1, radians);
        a2 = this.normalizeAngleToAnother(a2, a1, radians);

        return (typeof ease === 'function') ? ease(weight, a1, a2 - a1, 1) : this.interpolateFloat(a1, a2, weight);

    },
    */

    /**
    * Generate a random bool result based on the chance value.
    * <p>
    * Returns true or false based on the chance value (default 50%). For example if you wanted a player to have a 30% chance
    * of getting a bonus, call chanceRoll(30) - true means the chance passed, false means it failed.
    * </p>
    * @method Phaser.Math#chanceRoll
    * @param {number} chance - The chance of receiving the value. A number between 0 and 100 (effectively 0% to 100%).
    * @return {boolean} True if the roll passed, or false otherwise.
    */
    chanceRoll: function (chance) {

        if (typeof chance === "undefined") { chance = 50; }

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

    },

    /**
    * Returns an Array containing the numbers from min to max (inclusive).
    *
    * @method Phaser.Math#numberArray
    * @param {number} min - The minimum value the array starts with.
    * @param {number} max - The maximum value the array contains.
    * @return {array} The array of number values.
    */
    numberArray: function (min, max) {

        var result = [];

        for (var i = min; i <= max; i++)
        {
            result.push(i);
        }

        return result;

    },

    /**
    * Adds the given amount to the value, but never lets the value go over the specified maximum.
    *
    * @method Phaser.Math#maxAdd
    * @param {number} value - The value to add the amount to.
    * @param {number} amount - The amount to add to the value.
    * @param {number} max- The maximum the value is allowed to be.
    * @return {number}
    */
    maxAdd: function (value, amount, max) {

        value += amount;

        if (value > max)
        {
            value = max;
        }

        return value;

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

        value -= amount;

        if (value < min)
        {
            value = min;
        }

        return value;

    },

    /**
    * Ensures that the value always stays between min and max, by wrapping the value around.
    * max should be larger than min, or the function will return 0.
    *
    * @method Phaser.Math#wrap
    * @param {number} value - The value to wrap.
    * @param {number} min - The minimum the value is allowed to be.
    * @param {number} max - The maximum the value is allowed to be.
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
    * Values must be positive integers, and are passed through Math.abs.
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
    */
    limitValue: function(value, min, max) {

        return value < min ? min : value > max ? max : value;

    },

    /**
    * Randomly returns either a 1 or -1.
    *
    * @method Phaser.Math#randomSign
    * @return {number}  1 or -1
    */
    randomSign: function () {

        return (Math.random() > 0.5) ? 1 : -1;

    },

    /**
    * Returns true if the number given is odd.
    *
    * @method Phaser.Math#isOdd
    * @param {number} n - The number to check.
    * @return {boolean} True if the given number is odd. False if the given number is even.
    */
    isOdd: function (n) {

        return (n & 1);

    },

    /**
    * Returns true if the number given is even.
    *
    * @method Phaser.Math#isEven
    * @param {number} n - The number to check.
    * @return {boolean} True if the given number is even. False if the given number is odd.
    */
    isEven: function (n) {

        if (n & 1)
        {
            return false;
        }
        else
        {
            return true;
        }

    },

    /**
    * Updated version of Math.min that can be passed either an array of numbers or the numbers as parameters.
    * See http://jsperf.com/math-s-min-max-vs-homemade/5
    *
    * @method Phaser.Math#min
    * @return {number} The lowest value from those given.
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
    * Updated version of Math.max that can be passed either an array of numbers or the numbers as parameters.
    *
    * @method Phaser.Math#max
    * @return {number} The largest value from those given.
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
    * Updated version of Math.min that can be passed a property and either an array of objects or the objects as parameters.
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
    * Updated version of Math.max that can be passed a property and either an array of objects or the objects as parameters.
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
    * Keeps an angle value between -180 and +180.
    *
    * @method Phaser.Math#wrapAngle
    * @param {number} angle - The angle value to check
    * @param {boolean} radians - True if angle is given in radians.
    * @return {number} The new angle value, returns the same as the input angle if it was within bounds.
    */
    wrapAngle: function (angle, radians) {

        var radianFactor = (radians) ? Math.PI / 180 : 1;
        return this.wrap(angle, -180 * radianFactor, 180 * radianFactor);

    },

    /**
    * Keeps an angle value between the given min and max values.
    *
    * @method Phaser.Math#angleLimit
    * @param {number} angle - The angle value to check. Must be between -180 and +180.
    * @param {number} min - The minimum angle that is allowed (must be -180 or greater).
    * @param {number} max - The maximum angle that is allowed (must be 180 or less).
    * @return {number} The new angle value, returns the same as the input angle if it was within bounds
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
    * @param {number} v
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
    * @param {number} v
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
    * @param {number} v
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
    * Description.
    * @method Phaser.Math#Linear
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
    * @param {number} n
    * @param {number} i
    * @return {number}
    */
    bernstein: function (n, i) {
        return this.factorial(n) / this.factorial(i) / this.factorial(n - i);
    },

    /**
    * Description.
    * @method Phaser.Math#catmullRom
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
    * Will return null if random selection is missing, or array has no entries.
    *
    * @method Phaser.Math#getRandom
    * @param {array} objects - An array of objects.
    * @param {number} startIndex - Optional offset off the front of the array. Default value is 0, or the beginning of the array.
    * @param {number} length - Optional restriction on the number of values you want to randomly select from.
    * @return {object} The random object that was selected.
    */
    getRandom: function (objects, startIndex, length) {

        if (typeof startIndex === "undefined") { startIndex = 0; }
        if (typeof length === "undefined") { length = 0; }

        if (objects != null) {

            var l = length;

            if ((l === 0) || (l > objects.length - startIndex))
            {
                l = objects.length - startIndex;
            }

            if (l > 0)
            {
                return objects[startIndex + Math.floor(Math.random() * l)];
            }
        }

        return null;

    },

    /**
    * Removes a random object from the given array and returns it.
    * Will return null if random selection is missing, or array has no entries.
    *
    * @method Phaser.Math#removeRandom
    * @param {array} objects - An array of objects.
    * @param {number} startIndex - Optional offset off the front of the array. Default value is 0, or the beginning of the array.
    * @param {number} length - Optional restriction on the number of values you want to randomly select from.
    * @return {object} The random object that was removed.
    */
    removeRandom: function (objects, startIndex, length) {

        if (typeof startIndex === "undefined") { startIndex = 0; }
        if (typeof length === "undefined") { length = 0; }

        if (objects != null) {

            var l = length;

            if ((l === 0) || (l > objects.length - startIndex))
            {
                l = objects.length - startIndex;
            }

            if (l > 0)
            {
                var idx = startIndex + Math.floor(Math.random() * l);
                var removed = objects.splice(idx, 1);
                return removed[0];
            }
        }

        return null;

    },

    /**
    * Round down to the next whole number. E.g. floor(1.7) == 1, and floor(-2.7) == -2.
    *
    * @method Phaser.Math#floor
    * @param {number} Value Any number.
    * @return {number} The rounded value of that number.
    */
    floor: function (value) {

        var n = value | 0;

        return (value > 0) ? (n) : ((n != value) ? (n - 1) : (n));

    },

    /**
    * Round up to the next whole number.  E.g. ceil(1.3) == 2, and ceil(-2.3) == -3.
    *
    * @method Phaser.Math#ceil
    * @param {number} value - Any number.
    * @return {number} The rounded value of that number.
    */
    ceil: function (value) {
        var n = value | 0;
        return (value > 0) ? ((n != value) ? (n + 1) : (n)) : (n);
    },

    /**
    * Generate a sine and cosine table simultaneously and extremely quickly. Based on research by Franky of scene.at
    * <p>
    * The parameters allow you to specify the length, amplitude and frequency of the wave. Once you have called this function
    * you should get the results via getSinTable() and getCosTable(). This generator is fast enough to be used in real-time.
    * </p>
    * @method Phaser.Math#sinCosGenerator
    * @param {number} length - The length of the wave
    * @param {number} sinAmplitude - The amplitude to apply to the sine table (default 1.0) if you need values between say -+ 125 then give 125 as the value
    * @param {number} cosAmplitude - The amplitude to apply to the cosine table (default 1.0) if you need values between say -+ 125 then give 125 as the value
    * @param {number} frequency  - The frequency of the sine and cosine table data
    * @return {Array} Returns the sine table
    */
    sinCosGenerator: function (length, sinAmplitude, cosAmplitude, frequency) {

        if (typeof sinAmplitude === "undefined") { sinAmplitude = 1.0; }
        if (typeof cosAmplitude === "undefined") { cosAmplitude = 1.0; }
        if (typeof frequency === "undefined") { frequency = 1.0; }

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
    * Removes the top element from the stack and re-inserts it onto the bottom, then returns it.
    * The original stack is modified in the process. This effectively moves the position of the data from the start to the end of the table.
    *
    * @method Phaser.Math#shift
    * @param {array} stack - The array to shift.
    * @return {any} The shifted value.
    */
    shift: function (stack) {

        var s = stack.shift();
        stack.push(s);

        return s;

    },

    /**
    * Shuffles the data in the given array into a new order
    * @method Phaser.Math#shuffleArray
    * @param {array} array - The array to shuffle
    * @return {array} The array
    */
    shuffleArray: function (array) {

        for (var i = array.length - 1; i > 0; i--) {

            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }

        return array;

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
    */
    distanceRounded: function (x1, y1, x2, y2) {

        return Math.round(Phaser.Math.distance(x1, y1, x2, y2));

    },

    /**
    * Force a value within the boundaries of two values.
    * Clamp value to range <a, b>
    *
    * @method Phaser.Math#clamp
    * @param {number} x
    * @param {number} a
    * @param {number} b
    * @return {number}
    */
    clamp: function ( x, a, b ) {

        return ( x < a ) ? a : ( ( x > b ) ? b : x );

    },

    /**
    * Clamp value to range <a, inf).
    *
    * @method Phaser.Math#clampBottom
    * @param {number} x
    * @param {number} a
    * @return {number}
    */
    clampBottom: function ( x, a ) {

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
    */
    within: function ( a, b, tolerance ) {

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
    mapLinear: function ( x, a1, a2, b1, b2 ) {

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
    smoothstep: function ( x, min, max ) {

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
    smootherstep: function ( x, min, max ) {

        x = Math.max(0, Math.min(1, (x - min) / (max - min)));
        return x * x * x * (x * (x * 6 - 15) + 10);

    },

    /**
    * A value representing the sign of the value.
    * -1 for negative, +1 for positive, 0 if value is 0
    *
    * @method Phaser.Math#sign
    * @param {number} x
    * @return {number}
    */
    sign: function ( x ) {

        return ( x < 0 ) ? -1 : ( ( x > 0 ) ? 1 : 0 );

    },

    /**
    * Work out what percentage value a is of value b using the given base.
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

    },

    /**
    * Convert degrees to radians.
    *
    * @method Phaser.Math#degToRad
    * @return {function}
    */
    degToRad: (function() {

        var degreeToRadiansFactor = Math.PI / 180;

        return function ( degrees ) {

            return degrees * degreeToRadiansFactor;

        };

    }()),

    /**
    * Convert degrees to radians.
    *
    * @method Phaser.Math#radToDeg
    * @return {function}
    */
    radToDeg: (function() {

        var radianToDegreesFactor = 180 / Math.PI;

        return function ( radians ) {

            return radians * radianToDegreesFactor;

        };

    }())

};
