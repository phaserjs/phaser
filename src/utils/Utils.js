/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
* @module       Phaser.Utils
*/

/**
* 
* @class Utils
* @static
*/
Phaser.Utils = {
	
	/**
	*  Javascript string pad ({@link http://www.webtoolkit.info/})
	* pad = the string to pad it out with (defaults to a space)<br>
	* dir = 1 (left), 2 (right), 3 (both)
	* @method pad
	* @param {string} str - The target string. 
	* @param {number} len - Description.
	* @param {number} pad - the string to pad it out with (defaults to a space).
	* @param {number} [dir=3] the direction dir = 1 (left), 2 (right), 3 (both).
	* @return {string}
	**/
	pad: function (str, len, pad, dir) {

	    if (typeof(len) == "undefined") { var len = 0; }
	    if (typeof(pad) == "undefined") { var pad = ' '; }
	    if (typeof(dir) == "undefined") { var dir = 3; }

	    if (len + 1 >= str.length)
	    {
	        switch (dir)
	        {
	            case 1:
	                str = Array(len + 1 - str.length).join(pad) + str;
		            break;

	            case 3:
	                var right = Math.ceil((padlen = len - str.length) / 2);
	                var left = padlen - right;
	                str = Array(left+1).join(pad) + str + Array(right+1).join(pad);
		            break;

	            default:
	                str = str + Array(len + 1 - str.length).join(pad);
		            break;
	        }
	    }

	    return str;

	},

    /**
    * This is a slightly modified version of jQuery.isPlainObject.
    * @method isPlainObject
    * @param {object} obj - Description.
    * @return {boolean} - Description.
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
			if (obj.constructor && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf"))
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


	//	deep, target, objects to copy to the target object
	//	This is a slightly modified version of {@link http://api.jquery.com/jQuery.extend/|jQuery.extend}
	//	deep (boolean)
	//	target (object to add to)
	//	objects ... (objects to recurse and copy from)

    /**
    * This is a slightly modified version of {@link http://api.jquery.com/jQuery.extend/|jQuery.extend}
    * @method extend
    * @return {Description} Description.
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

		for ( ; i < length; i++ )
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

//	Global functions that PIXI needs

 /**
 * Converts a hex color number to an [R, G, B] array
 *
 * @method HEXtoRGB
 * @param {number} hex 
 * @return {array}
 */
function HEXtoRGB(hex) {
	return [(hex >> 16 & 0xFF) / 255, ( hex >> 8 & 0xFF) / 255, (hex & 0xFF)/ 255];
}

 /**
 * A polyfill for Function.prototype.bind
 *
 * @method bind
 */
if (typeof Function.prototype.bind != 'function') {
  Function.prototype.bind = (function () {
    var slice = Array.prototype.slice;
    return function (thisArg) {
      var target = this, boundArgs = slice.call(arguments, 1);
 
      if (typeof target != 'function') throw new TypeError();
 
      function bound() {
	var args = boundArgs.concat(slice.call(arguments));
	target.apply(this instanceof bound ? this : thisArg, args);
      }
 
      bound.prototype = (function F(proto) {
          proto && (F.prototype = proto);
          if (!(this instanceof F)) return new F;          
	})(target.prototype);
 
      return bound;
    };
  })();
}

