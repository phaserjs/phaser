Phaser.Math = {

	PI2: Math.PI * 2,

    fuzzyEqual: function (a, b, epsilon) {
        if (typeof epsilon === "undefined") { epsilon = 0.0001; }
        return Math.abs(a - b) < epsilon;
    },

    fuzzyLessThan: function (a, b, epsilon) {
        if (typeof epsilon === "undefined") { epsilon = 0.0001; }
        return a < b + epsilon;
    },

    fuzzyGreaterThan: function (a, b, epsilon) {
        if (typeof epsilon === "undefined") { epsilon = 0.0001; }
        return a > b - epsilon;
    },

    fuzzyCeil: function (val, epsilon) {
        if (typeof epsilon === "undefined") { epsilon = 0.0001; }
        return Math.ceil(val - epsilon);
    },

    fuzzyFloor: function (val, epsilon) {
        if (typeof epsilon === "undefined") { epsilon = 0.0001; }
        return Math.floor(val + epsilon);
    },

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

    truncate: function (n) {
        return (n > 0) ? Math.floor(n) : Math.ceil(n);
    },

    shear: function (n) {
        return n % 1;
    },

	/**
	* Snap a value to nearest grid slice, using rounding.
	*
	* example if you have an interval gap of 5 and a position of 12... you will snap to 10. Where as 14 will snap to 15
	*
	* @param input - the value to snap
	* @param gap - the interval gap of the grid
	* @param [start] - optional starting offset for gap
	*/
    snapTo: function (input, gap, start) {

        if (typeof start === "undefined") { start = 0; }

        if (gap == 0) {
            return input;
        }

        input -= start;
        input = gap * Math.round(input / gap);

        return start + input;

    },

	/**
    * Snap a value to nearest grid slice, using floor.
    *
    * example if you have an interval gap of 5 and a position of 12... you will snap to 10. As will 14 snap to 10... but 16 will snap to 15
    *
    * @param input - the value to snap
    * @param gap - the interval gap of the grid
    * @param [start] - optional starting offset for gap
    */
    snapToFloor: function (input, gap, start) {

        if (typeof start === "undefined") { start = 0; }

        if (gap == 0) {
            return input;
        }

        input -= start;
        input = gap * Math.floor(input / gap);

        return start + input;

    },

	/**
	* Snap a value to nearest grid slice, using ceil.
	*
	* example if you have an interval gap of 5 and a position of 12... you will snap to 15. As will 14 will snap to 15... but 16 will snap to 20
	*
	* @param input - the value to snap
	* @param gap - the interval gap of the grid
	* @param [start] - optional starting offset for gap
	*/
    snapToCeil: function (input, gap, start) {

        if (typeof start === "undefined") { start = 0; }

        if (gap == 0) {
            return input;
        }

        input -= start;
        input = gap * Math.ceil(input / gap);

        return start + input;

    },


	/**
	* Snaps a value to the nearest value in an array.
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
    roundTo: function (value, place, base) {

        if (typeof place === "undefined") { place = 0; }
        if (typeof base === "undefined") { base = 10; }
        
        var p = Math.pow(base, -place);
        
        return Math.round(value * p) / p;

    },

    floorTo: function (value, place, base) {

        if (typeof place === "undefined") { place = 0; }
        if (typeof base === "undefined") { base = 10; }

        var p = Math.pow(base, -place);

        return Math.floor(value * p) / p;

    },

    ceilTo: function (value, place, base) {

        if (typeof place === "undefined") { place = 0; }
        if (typeof base === "undefined") { base = 10; }

        var p = Math.pow(base, -place);

        return Math.ceil(value * p) / p;

    },

	/**
	* a one dimensional linear interpolation of a value.
	*/
    interpolateFloat: function (a, b, weight) {
        return (b - a) * weight + a;
    },

	/**
	* Find the angle of a segment from (x1, y1) -> (x2, y2 )
	*/
    angleBetween: function (x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    },

	/**
	* set an angle within the bounds of -PI to PI
	*/
    normalizeAngle: function (angle, radians) {

        if (typeof radians === "undefined") { radians = true; }

        var rd = (radians) ? Math.PI : 180;
        return this.wrap(angle, -rd, rd);
        
    },

	/**
	* closest angle between two angles from a1 to a2
	* absolute value the return for exact angle
	*/
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

	/**
	* interpolate across the shortest arc between two angles
	*/
    interpolateAngles: function (a1, a2, weight, radians, ease) {

        if (typeof radians === "undefined") { radians = true; }
        if (typeof ease === "undefined") { ease = null; }

        a1 = this.normalizeAngle(a1, radians);
        a2 = this.normalizeAngleToAnother(a2, a1, radians);

        return (typeof ease === 'function') ? ease(weight, a1, a2 - a1, 1) : this.interpolateFloat(a1, a2, weight);

    },

	/**
	* Generate a random bool result based on the chance value
	* <p>
	* Returns true or false based on the chance value (default 50%). For example if you wanted a player to have a 30% chance
	* of getting a bonus, call chanceRoll(30) - true means the chance passed, false means it failed.
	* </p>
	* @param chance The chance of receiving the value. A number between 0 and 100 (effectively 0% to 100%)
	* @return true if the roll passed, or false
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
    * Returns an Array containing the numbers from min to max (inclusive)
    *
    * @param min The minimum value the array starts with
    * @param max The maximum value the array contains
    * @return The array of number values
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
	* Adds the given amount to the value, but never lets the value go over the specified maximum
	*
	* @param value The value to add the amount to
	* @param amount The amount to add to the value
	* @param max The maximum the value is allowed to be
	* @return The new value
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
	* Subtracts the given amount from the value, but never lets the value go below the specified minimum
	*
	* @param value The base value
	* @param amount The amount to subtract from the base value
	* @param min The minimum the value is allowed to be
	* @return The new value
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
    * <p>max should be larger than min, or the function will return 0</p>
    *
    * @param value The value to wrap
    * @param min The minimum the value is allowed to be
    * @param max The maximum the value is allowed to be
    * @return The wrapped value
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
    * <p>Values must be positive integers, and are passed through Math.abs</p>
    *
    * @param value The value to add the amount to
    * @param amount The amount to add to the value
    * @param max The maximum the value is allowed to be
    * @return The wrapped value
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
	* Randomly returns either a 1 or -1
	*
	* @return	1 or -1
	*/
    randomSign: function () {
        return (Math.random() > 0.5) ? 1 : -1;
    },

	/**
	* Returns true if the number given is odd.
	*
	* @param	n	The number to check
	*
	* @return	True if the given number is odd. False if the given number is even.
	*/
    isOdd: function (n) {

        return (n & 1);

    },

	/**
	* Returns true if the number given is even.
	*
	* @param	n	The number to check
	*
	* @return	True if the given number is even. False if the given number is odd.
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
    * Significantly faster version of Math.max
    * See http://jsperf.com/math-s-min-max-vs-homemade/5
    *
    * @return   The highest value from those given.
    */
    max: function () {

        for (var i = 1, max = 0, len = arguments.length; i < len; i++)
        {
            if (arguments[max] < arguments[i])
            {
                max = i;
            }
        }
        
        return arguments[max];

    },

    /**
    * Significantly faster version of Math.min
    * See http://jsperf.com/math-s-min-max-vs-homemade/5
    *
    * @return   The lowest value from those given.
    */
    min: function () {

        for (var i =1 , min = 0, len = arguments.length; i < len; i++)
        {
            if (arguments[i] < arguments[min])
            {
                min = i;
            }
        }

        return arguments[min];

    },

	/**
	* Keeps an angle value between -180 and +180<br>
	* Should be called whenever the angle is updated on the Sprite to stop it from going insane.
	*
	* @param	angle	The angle value to check
	*
	* @return	The new angle value, returns the same as the input angle if it was within bounds
	*/
    wrapAngle: function (angle) {

        var result = angle;

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

    },

	/**
	* Keeps an angle value between the given min and max values
	*
	* @param	angle	The angle value to check. Must be between -180 and +180
	* @param	min		The minimum angle that is allowed (must be -180 or greater)
	* @param	max		The maximum angle that is allowed (must be 180 or less)
	*
	* @return	The new angle value, returns the same as the input angle if it was within bounds
	*/
    angleLimit: function (angle, min, max) {
        var result = angle;
        if (angle > max) {
            result = max;
        } else if (angle < min) {
            result = min;
        }
        return result;
    },

	/**
	* @method linearInterpolation
	* @param {Any} v
	* @param {Any} k
	* @public
	*/
    linearInterpolation: function (v, k) {
        var m = v.length - 1;
        var f = m * k;
        var i = Math.floor(f);
        if (k < 0) {
            return this.linear(v[0], v[1], f);
        }
        if (k > 1) {
            return this.linear(v[m], v[m - 1], m - f);
        }
        return this.linear(v[i], v[i + 1 > m ? m : i + 1], f - i);
    },

	/**
	* @method bezierInterpolation
	* @param {Any} v
	* @param {Any} k
	* @public
	*/
    bezierInterpolation: function (v, k) {
        var b = 0;
        var n = v.length - 1;
        for (var i = 0; i <= n; i++) {
            b += Math.pow(1 - k, n - i) * Math.pow(k, i) * v[i] * this.bernstein(n, i);
        }
        return b;
    },

	/**
	* @method catmullRomInterpolation
	* @param {Any} v
	* @param {Any} k
	* @public
	*/
    catmullRomInterpolation: function (v, k) {

        var m = v.length - 1;
        var f = m * k;
        var i = Math.floor(f);

        if (v[0] === v[m]) {
            if (k < 0) {
                i = Math.floor(f = m * (1 + k));
            }
            return this.catmullRom(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);
        } else {
            if (k < 0) {
                return v[0] - (this.catmullRom(v[0], v[0], v[1], v[1], -f) - v[0]);
            }
            if (k > 1) {
                return v[m] - (this.catmullRom(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);
            }
            return this.catmullRom(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);
        }
    },

	/**
	* @method Linear
	* @param {Any} p0
	* @param {Any} p1
	* @param {Any} t
	* @public
	*/
    linear: function (p0, p1, t) {
        return (p1 - p0) * t + p0;
    },

	/**
	* @method bernstein
	* @param {Any} n
	* @param {Any} i
	* @public
	*/
    bernstein: function (n, i) {
        return this.factorial(n) / this.factorial(i) / this.factorial(n - i);
    },

	/**
	* @method catmullRom
	* @param {Any} p0
	* @param {Any} p1
	* @param {Any} p2
	* @param {Any} p3
	* @param {Any} t
	* @public
	*/
    catmullRom: function (p0, p1, p2, p3, t) {
        var v0 = (p2 - p0) * 0.5, v1 = (p3 - p1) * 0.5, t2 = t * t, t3 = t * t2;
        return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
    },

    difference: function (a, b) {
        return Math.abs(a - b);
    },

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
    getRandom: function (objects, startIndex, length) {

        if (typeof startIndex === "undefined") { startIndex = 0; }
        if (typeof length === "undefined") { length = 0; }
        
        if (objects != null) {

            var l = length;

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

    },

	/**
	* Round down to the next whole number. E.g. floor(1.7) == 1, and floor(-2.7) == -2.
	*
	* @param	Value	Any number.
	*
	* @return	The rounded value of that number.
	*/
    floor: function (value) {

        var n = value | 0;

        return (value > 0) ? (n) : ((n != value) ? (n - 1) : (n));

    },

	/**
	* Round up to the next whole number.  E.g. ceil(1.3) == 2, and ceil(-2.3) == -3.
	*
	* @param	Value	Any number.
	*
	* @return	The rounded value of that number.
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
    * @param length 		The length of the wave
    * @param sinAmplitude 	The amplitude to apply to the sine table (default 1.0) if you need values between say -+ 125 then give 125 as the value
    * @param cosAmplitude 	The amplitude to apply to the cosine table (default 1.0) if you need values between say -+ 125 then give 125 as the value
    * @param frequency 	The frequency of the sine and cosine table data
    * @return	Returns the sine table
    * @see getSinTable
    * @see getCosTable
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

        return { sin: sinTable, cos: cosTable };

    },

	/**
	* Removes the top element from the stack and re-inserts it onto the bottom, then returns it.
	* The original stack is modified in the process.
    * This effectively moves the position of the data from the start to the end of the table.
    * @return	The value.
    */
    shift: function (stack) {

    	var s = stack.shift();
    	stack.push(s);

    	return s;

    },

	/**
    * Shuffles the data in the given array into a new order
    * @param array The array to shuffle
    * @return The array
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
    * @method distance
    * @param {Number} x1
    * @param {Number} y1
    * @param {Number} x2
    * @param {Number} y2
    * @return {Number} The distance between this Point object and the destination Point object.
    **/
    distance: function (x1, y1, x2, y2) {

        var dx = x1 - x2;
        var dy = y1 - y2;

        return Math.sqrt(dx * dx + dy * dy);

    },

    distanceRounded: function (x1, y1, x2, y2) {

    	return Math.round(Phaser.Math.distance(x1, y1, x2, y2));

    },

	/**
	* force a value within the boundaries of two values
	*
	* Clamp value to range <a, b>
	*/
	clamp: function ( x, a, b ) {

		return ( x < a ) ? a : ( ( x > b ) ? b : x );

	},

	// Clamp value to range <a, inf)

	clampBottom: function ( x, a ) {

		return x < a ? a : x;

	},

	// Linear mapping from range <a1, a2> to range <b1, b2>

	mapLinear: function ( x, a1, a2, b1, b2 ) {

		return b1 + ( x - a1 ) * ( b2 - b1 ) / ( a2 - a1 );

	},

	// http://en.wikipedia.org/wiki/Smoothstep

	smoothstep: function ( x, min, max ) {

		if ( x <= min ) return 0;
		if ( x >= max ) return 1;

		x = ( x - min )/( max - min );

		return x*x*(3 - 2*x);

	},

	smootherstep: function ( x, min, max ) {

		if ( x <= min ) return 0;
		if ( x >= max ) return 1;

		x = ( x - min )/( max - min );

		return x*x*x*(x*(x*6 - 15) + 10);

	},

	/**
	* a value representing the sign of the value.
	* -1 for negative, +1 for positive, 0 if value is 0
	*/
	sign: function ( x ) {

		return ( x < 0 ) ? -1 : ( ( x > 0 ) ? 1 : 0 );

	},

	degToRad: function() {

		var degreeToRadiansFactor = Math.PI / 180;

		return function ( degrees ) {

			return degrees * degreeToRadiansFactor;

		};

	}(),

	radToDeg: function() {

		var radianToDegreesFactor = 180 / Math.PI;

		return function ( radians ) {

			return radians * radianToDegreesFactor;

		};

	}()

};
