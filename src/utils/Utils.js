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

        if (typeof(len) == "undefined") { var len = 0; }
        if (typeof(pad) == "undefined") { var pad = ' '; }
        if (typeof(dir) == "undefined") { var dir = 3; }

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


    //  deep, target, objects to copy to the target object
    //  This is a slightly modified version of {@link http://api.jquery.com/jQuery.extend/|jQuery.extend}
    //  deep (boolean)
    //  target (object to add to)
    //  objects ... (objects to recurse and copy from)

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
    }

};

/**
* A polyfill for Function.prototype.bind
*/
if (typeof Function.prototype.bind != 'function') {

    /* jshint freeze: false */
    Function.prototype.bind = (function () {

        var slice = Array.prototype.slice;

        return function (thisArg) {

            var target = this, boundArgs = slice.call(arguments, 1);

            if (typeof target != 'function')
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
