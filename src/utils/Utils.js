/* jshint supernew: true */

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* @class Phaser.Utils
* @static
*/
Phaser.Utils = {

    /**
     * Gets an objects property by string.
     *
     * @method Phaser.Utils.getProperty
     * @param {object} obj - The object to traverse.
     * @param {string} prop - The property whose value will be returned.
     * @return {*} the value of the property or null if property isn't found .
     */
    getProperty: function(obj, prop) {

        var parts = prop.split('.'),
            last = parts.pop(),
            l = parts.length,
            i = 1,
            current = parts[0];

        while (i < l && (obj = obj[current]))
        {
            current = parts[i];
            i++;
        }

        if (obj)
        {
            return obj[last];
        }
        else
        {
            return null;
        }

    },

    /**
     * Sets an objects property by string.
     *
     * @method Phaser.Utils.setProperty
     * @param {object} obj - The object to traverse
     * @param {string} prop - The property whose value will be changed
     * @return {object} The object on which the property was set.
     */
    setProperty: function(obj, prop, value) {

        var parts = prop.split('.'),
            last = parts.pop(),
            l = parts.length,
            i = 1,
            current = parts[0];

        while (i < l && (obj = obj[current]))
        {
            current = parts[i];
            i++;
        }

        if (obj)
        {
            obj[last] = value;
        }

        return obj;

    },

    /**
     * Transposes the elements of the given Array.
     *
     * @method Phaser.Utils.transposeArray
     * @param {array} array - The array to transpose.
     * @return {array} The transposed array.
     */
    transposeArray: function (array) {

        var result = new Array(array[0].length);

        for (var i = 0; i < array[0].length; i++)
        {
            result[i] = new Array(array.length - 1);

            for (var j = array.length - 1; j > -1; j--)
            {
                result[i][j] = array[j][i];
            }
        }

        return result;

    },

    /**
     * Rotates the given array.
     * Based on the routine from http://jsfiddle.net/MrPolywhirl/NH42z/
     *
     * @method Phaser.Utils.rotateArray
     * @param {array} matrix - The array to rotate.
     * @param {number|string} direction - The amount to rotate. Either a number: 90, -90, 270, -270, 180 or a string: 'rotateLeft', 'rotateRight' or 'rotate180'
     * @return {array} The rotated array
     */
    rotateArray: function (matrix, direction) {

        if (typeof direction !== 'string')
        {
            direction = ((direction % 360) + 360) % 360;
        }

        if (direction === 90 || direction === -270 || direction === 'rotateLeft')
        {
            matrix = Phaser.Utils.transposeArray(matrix);
            matrix = matrix.reverse();
        }
        else if (direction === -90 || direction === 270 || direction === 'rotateRight')
        {
            matrix = matrix.reverse();
            matrix = Phaser.Utils.transposeArray(matrix);
        }
        else if (Math.abs(direction) === 180 || direction === 'rotate180')
        {
            for (var i = 0; i < matrix.length; i++)
            {
                matrix[i].reverse();
            }

            matrix = matrix.reverse();
        }

        return matrix;

    },

    /**
    * Get a unit dimension from a string.
    *
    * @method Phaser.Utils.parseDimension
    * @param {string|number} size - The size to parse.
    * @param {number} dimension - The window dimension to check.
    * @return {number} The parsed dimension.
    */
    parseDimension: function (size, dimension) {

        var f = 0;
        var px = 0;

        if (typeof size === 'string')
        {
            //  %?
            if (size.substr(-1) === '%')
            {
                f = parseInt(size, 10) / 100;

                if (dimension === 0)
                {
                    px = window.innerWidth * f;
                }
                else
                {
                    px = window.innerHeight * f;
                }
            }
            else
            {
                px = parseInt(size, 10);
            }
        }
        else
        {
            px = size;
        }

        return px;

    },

    /**
    * A standard Fisher-Yates Array shuffle implementation.
    * @method Phaser.Utils.shuffle
    * @param {array} array - The array to shuffle.
    * @return {array} The shuffled array.
    */
    shuffle: function (array) {

        for (var i = array.length - 1; i > 0; i--)
        {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }

        return array;

    },

    /**
    * Javascript string pad http://www.webtoolkit.info/.
    * pad = the string to pad it out with (defaults to a space)
    * dir = 1 (left), 2 (right), 3 (both)
    * @method Phaser.Utils.pad
    * @param {string} str - The target string.
    * @param {number} len - The number of characters to be added.
    * @param {number} pad - The string to pad it out with (defaults to a space).
    * @param {number} [dir=3] The direction dir = 1 (left), 2 (right), 3 (both).
    * @return {string} The padded string
    */
    pad: function (str, len, pad, dir) {

        if (typeof(len) === "undefined") { var len = 0; }
        if (typeof(pad) === "undefined") { var pad = ' '; }
        if (typeof(dir) === "undefined") { var dir = 3; }

        var padlen = 0;

        if (len + 1 >= str.length)
        {
            switch (dir)
            {
                case 1:
                    str = new Array(len + 1 - str.length).join(pad) + str;
                    break;

                case 3:
                    var right = Math.ceil((padlen = len - str.length) / 2);
                    var left = padlen - right;
                    str = new Array(left+1).join(pad) + str + new Array(right+1).join(pad);
                    break;

                default:
                    str = str + new Array(len + 1 - str.length).join(pad);
                    break;
            }
        }

        return str;

    },

    /**
    * This is a slightly modified version of jQuery.isPlainObject. A plain object is an object whose internal class property is [object Object].
    * @method Phaser.Utils.isPlainObject
    * @param {object} obj - The object to inspect.
    * @return {boolean} - true if the object is plain, otherwise false.
    */
    isPlainObject: function (obj) {

        // Not plain objects:
        // - Any object or value whose internal [[Class]] property is not "[object Object]"
        // - DOM nodes
        // - window
        if (typeof(obj) !== "object" || obj.nodeType || obj === obj.window)
        {
            return false;
        }

        // Support: Firefox <20
        // The try/catch suppresses exceptions thrown when attempting to access
        // the "constructor" property of certain host objects, ie. |window.location|
        // https://bugzilla.mozilla.org/show_bug.cgi?id=814622
        try {
            if (obj.constructor && !({}).hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf"))
            {
                return false;
            }
        } catch (e) {
            return false;
        }

        // If the function hasn't returned already, we're confident that
        // |obj| is a plain object, created by {} or constructed with new Object
        return true;
    },

    /**
    * This is a slightly modified version of http://api.jquery.com/jQuery.extend/
    * @method Phaser.Utils.extend
    * @param {boolean} deep - Perform a deep copy?
    * @param {object} target - The target object to copy to.
    * @return {object} The extended object.
    */
    extend: function () {

        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        // Handle a deep copy situation
        if (typeof target === "boolean")
        {
            deep = target;
            target = arguments[1] || {};
            // skip the boolean and the target
            i = 2;
        }

        // extend Phaser if only one argument is passed
        if (length === i)
        {
            target = this;
            --i;
        }

        for (; i < length; i++)
        {
            // Only deal with non-null/undefined values
            if ((options = arguments[i]) != null)
            {
                // Extend the base object
                for (name in options)
                {
                    src = target[name];
                    copy = options[name];

                    // Prevent never-ending loop
                    if (target === copy)
                    {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if (deep && copy && (Phaser.Utils.isPlainObject(copy) || (copyIsArray = Array.isArray(copy))))
                    {
                        if (copyIsArray)
                        {
                            copyIsArray = false;
                            clone = src && Array.isArray(src) ? src : [];
                        }
                        else
                        {
                            clone = src && Phaser.Utils.isPlainObject(src) ? src : {};
                        }

                        // Never move original objects, clone them
                        target[name] = Phaser.Utils.extend(deep, clone, copy);

                    // Don't bring in undefined values
                    }
                    else if (copy !== undefined)
                    {
                        target[name] = copy;
                    }
                }
            }
        }

        // Return the modified object
        return target;

    },

    /**
    * Mixes the source object into the destination object, returning the newly modified destination object.
    * Based on original code by @mudcube
    *
    * @method Phaser.Utils.mixin
    * @param {object} from - The object to copy (the source object).
    * @param {object} to - The object to copy to (the destination object).
    * @return {object} The modified destination object.
    */
    mixin: function (from, to) {

        if (!from || typeof (from) !== "object")
        {
            return to;
        }

        for (var key in from)
        {
            var o = from[key];

            if (o.childNodes || o.cloneNode)
            {
                continue;
            }

            var type = typeof (from[key]);

            if (!from[key] || type !== "object")
            {
                to[key] = from[key];
            }
            else
            {
                //  Clone sub-object
                if (typeof (to[key]) === type)
                {
                    to[key] = Phaser.Utils.mixin(from[key], to[key]);
                }
                else
                {
                    to[key] = Phaser.Utils.mixin(from[key], new o.constructor());
                }
            }
        }

        return to;

    }

};

/**
* A polyfill for Function.prototype.bind
*/
if (typeof Function.prototype.bind !== 'function') {

    /* jshint freeze: false */
    Function.prototype.bind = (function () {

        var slice = Array.prototype.slice;

        return function (thisArg) {

            var target = this, boundArgs = slice.call(arguments, 1);

            if (typeof target !== 'function')
            {
                throw new TypeError();
            }

            function bound() {
                var args = boundArgs.concat(slice.call(arguments));
                target.apply(this instanceof bound ? this : thisArg, args);
            }

            bound.prototype = (function F(proto) {
                if (proto)
                {
                    F.prototype = proto;
                }

                if (!(this instanceof F))
                {
                    return new F;
                }
            })(target.prototype);

            return bound;
        };
    })();
}

/**
* A polyfill for Array.isArray
*/
if (!Array.isArray)
{
    Array.isArray = function (arg)
    {
        return Object.prototype.toString.call(arg) == '[object Array]';
    };
}

/**
* A polyfill for Array.forEach
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
*/
if (!Array.prototype.forEach)
{
    Array.prototype.forEach = function(fun /*, thisArg */)
    {
        "use strict";

        if (this === void 0 || this === null)
        {
            throw new TypeError();
        }

        var t = Object(this);
        var len = t.length >>> 0;

        if (typeof fun !== "function")
        {
            throw new TypeError();
        }

        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;

        for (var i = 0; i < len; i++)
        {
            if (i in t)
            {
                fun.call(thisArg, t[i], i, t);
            }
        }
    };
}

/**
* Low-budget Float32Array knock-off, suitable for use with P2.js in IE9
* Source: http://www.html5gamedevs.com/topic/5988-phaser-12-ie9/
* Cameron Foale (http://www.kibibu.com)
*/
if (typeof window.Uint32Array !== "function" && typeof window.Uint32Array !== "object")
{
    var CheapArray = function(type)
    {
        var proto = new Array(); // jshint ignore:line

        window[type] = function(arg) {

            if (typeof(arg) === "number")
            {
                Array.call(this, arg);
                this.length = arg;

                for (var i = 0; i < this.length; i++)
                {
                    this[i] = 0;
                }
            }
            else
            {
                Array.call(this, arg.length);

                this.length = arg.length;

                for (var i = 0; i < this.length; i++)
                {
                    this[i] = arg[i];
                }
            }
        };

        window[type].prototype = proto;
        window[type].constructor = window[type];
    };

    CheapArray('Uint32Array'); // jshint ignore:line
    CheapArray('Int16Array');  // jshint ignore:line
}

/**
 * Also fix for the absent console in IE9
 */
if (!window.console)
{
    window.console = {};
    window.console.log = window.console.assert = function(){};
    window.console.warn = window.console.assert = function(){};
}
