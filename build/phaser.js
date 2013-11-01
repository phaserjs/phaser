!function(root, factory) {
  if (typeof define === "function" && define.amd) {
    define(factory);
  } else if (typeof exports === "object") {
      module.exports = factory();
  } else {
    root.Phaser = factory();
  }
}(this, function() {
/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* @overview
*
* Phaser - http://www.phaser.io
*
* v1.1.2 - Built at: Fri Nov 01 2013 18:12:54
*
* By Richard Davey http://www.photonstorm.com @photonstorm
*
* A feature-packed 2D HTML5 game framework born from the smouldering pits of Flixel and
* constructed via plenty of blood, sweat, tears and coffee by Richard Davey (@photonstorm).
*
* Phaser uses Pixi.js for rendering, created by Mat Groves http://matgroves.com/ @Doormat23.
*
* Follow Phaser development progress at http://www.photonstorm.com
*
* Many thanks to Adam Saltsman (@ADAMATOMIC) for releasing Flixel, from both which Phaser
* and my love of game development originate.
*
* "If you want your children to be intelligent,  read them fairy tales."
* "If you want them to be more intelligent, read them more fairy tales."
*                                                     -- Albert Einstein
*/

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * @module PIXI
 */
var PIXI = PIXI || {};

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* @namespace Phaser
*/
var Phaser = Phaser || {

	VERSION: '1.1.2',
	DEV_VERSION: '1.1.2',
	GAMES: [],
	AUTO: 0,
	CANVAS: 1,
	WEBGL: 2,

	SPRITE: 0,
	BUTTON: 1,
	BULLET: 2,
	GRAPHICS: 3,
	TEXT: 4,
	TILESPRITE: 5,
	BITMAPTEXT: 6,
	GROUP: 7,
	RENDERTEXTURE: 8,
	TILEMAP: 9,
	TILEMAPLAYER: 10,
	EMITTER: 11,

	NONE: 0,
	LEFT: 1,
	RIGHT: 2,
	UP: 3,
	DOWN: 4

 };

PIXI.InteractionManager = function (dummy) {
	//	We don't need this in Pixi, so we've removed it to save space
	//	however the Stage object expects a reference to it, so here is a dummy entry.
};

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* @class Phaser.Utils
* @static
*/
Phaser.Utils = {
	
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
	* pad = the string to pad it out with (defaults to a space)<br>
	* dir = 1 (left), 2 (right), 3 (both)
	* @method Phaser.Utils.pad
	* @param {string} str - The target string. 
	* @param {number} len - Description.
	* @param {number} pad - the string to pad it out with (defaults to a space).
	* @param {number} [dir=3] the direction dir = 1 (left), 2 (right), 3 (both).
	* @return {string}
	*/
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
 * @param {number} hex 
 * @return {array}
 */
function HEXtoRGB(hex) {
	return [(hex >> 16 & 0xFF) / 255, ( hex >> 8 & 0xFF) / 255, (hex & 0xFF)/ 255];
}

 /**
 * A polyfill for Function.prototype.bind
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




/*
 * A lighter version of the rad gl-matrix created by Brandon Jones, Colin MacKenzie IV
 * you both rock!
 */

function determineMatrixArrayType() {
    PIXI.Matrix = (typeof Float32Array !== 'undefined') ? Float32Array : Array;
    return PIXI.Matrix;
}

determineMatrixArrayType();

PIXI.mat3 = {};

PIXI.mat3.create = function()
{
	var matrix = new PIXI.Matrix(9);

	matrix[0] = 1;
	matrix[1] = 0;
	matrix[2] = 0;
	matrix[3] = 0;
	matrix[4] = 1;
	matrix[5] = 0;
	matrix[6] = 0;
	matrix[7] = 0;
	matrix[8] = 1;
	
	return matrix;
}


PIXI.mat3.identity = function(matrix)
{
	matrix[0] = 1;
	matrix[1] = 0;
	matrix[2] = 0;
	matrix[3] = 0;
	matrix[4] = 1;
	matrix[5] = 0;
	matrix[6] = 0;
	matrix[7] = 0;
	matrix[8] = 1;
	
	return matrix;
}


PIXI.mat4 = {};

PIXI.mat4.create = function()
{
	var matrix = new PIXI.Matrix(16);

	matrix[0] = 1;
	matrix[1] = 0;
	matrix[2] = 0;
	matrix[3] = 0;
	matrix[4] = 0;
	matrix[5] = 1;
	matrix[6] = 0;
	matrix[7] = 0;
	matrix[8] = 0;
	matrix[9] = 0;
	matrix[10] = 1;
	matrix[11] = 0;
	matrix[12] = 0;
	matrix[13] = 0;
	matrix[14] = 0;
	matrix[15] = 1;
	
	return matrix;
}

PIXI.mat3.multiply = function (mat, mat2, dest) 
{
	if (!dest) { dest = mat; }
	
	// Cache the matrix values (makes for huge speed increases!)
	var a00 = mat[0], a01 = mat[1], a02 = mat[2],
	    a10 = mat[3], a11 = mat[4], a12 = mat[5],
	    a20 = mat[6], a21 = mat[7], a22 = mat[8],
	
	    b00 = mat2[0], b01 = mat2[1], b02 = mat2[2],
	    b10 = mat2[3], b11 = mat2[4], b12 = mat2[5],
	    b20 = mat2[6], b21 = mat2[7], b22 = mat2[8];
	
	dest[0] = b00 * a00 + b01 * a10 + b02 * a20;
	dest[1] = b00 * a01 + b01 * a11 + b02 * a21;
	dest[2] = b00 * a02 + b01 * a12 + b02 * a22;
	
	dest[3] = b10 * a00 + b11 * a10 + b12 * a20;
	dest[4] = b10 * a01 + b11 * a11 + b12 * a21;
	dest[5] = b10 * a02 + b11 * a12 + b12 * a22;
	
	dest[6] = b20 * a00 + b21 * a10 + b22 * a20;
	dest[7] = b20 * a01 + b21 * a11 + b22 * a21;
	dest[8] = b20 * a02 + b21 * a12 + b22 * a22;
	
	return dest;
}

PIXI.mat3.clone = function(mat)
{
	var matrix = new PIXI.Matrix(9);

	matrix[0] = mat[0];
	matrix[1] = mat[1];
	matrix[2] = mat[2];
	matrix[3] = mat[3];
	matrix[4] = mat[4];
	matrix[5] = mat[5];
	matrix[6] = mat[6];
	matrix[7] = mat[7];
	matrix[8] = mat[8];
	
	return matrix;
}

PIXI.mat3.transpose = function (mat, dest) 
{
 	// If we are transposing ourselves we can skip a few steps but have to cache some values
    if (!dest || mat === dest) {
        var a01 = mat[1], a02 = mat[2],
            a12 = mat[5];

        mat[1] = mat[3];
        mat[2] = mat[6];
        mat[3] = a01;
        mat[5] = mat[7];
        mat[6] = a02;
        mat[7] = a12;
        return mat;
    }

    dest[0] = mat[0];
    dest[1] = mat[3];
    dest[2] = mat[6];
    dest[3] = mat[1];
    dest[4] = mat[4];
    dest[5] = mat[7];
    dest[6] = mat[2];
    dest[7] = mat[5];
    dest[8] = mat[8];
    return dest;
}

PIXI.mat3.toMat4 = function (mat, dest) 
{
	if (!dest) { dest = PIXI.mat4.create(); }
	
	dest[15] = 1;
	dest[14] = 0;
	dest[13] = 0;
	dest[12] = 0;
	
	dest[11] = 0;
	dest[10] = mat[8];
	dest[9] = mat[7];
	dest[8] = mat[6];
	
	dest[7] = 0;
	dest[6] = mat[5];
	dest[5] = mat[4];
	dest[4] = mat[3];
	
	dest[3] = 0;
	dest[2] = mat[2];
	dest[1] = mat[1];
	dest[0] = mat[0];
	
	return dest;
}


/////


PIXI.mat4.create = function()
{
	var matrix = new PIXI.Matrix(16);

	matrix[0] = 1;
	matrix[1] = 0;
	matrix[2] = 0;
	matrix[3] = 0;
	matrix[4] = 0;
	matrix[5] = 1;
	matrix[6] = 0;
	matrix[7] = 0;
	matrix[8] = 0;
	matrix[9] = 0;
	matrix[10] = 1;
	matrix[11] = 0;
	matrix[12] = 0;
	matrix[13] = 0;
	matrix[14] = 0;
	matrix[15] = 1;
	
	return matrix;
}

PIXI.mat4.transpose = function (mat, dest) 
{
	// If we are transposing ourselves we can skip a few steps but have to cache some values
	if (!dest || mat === dest) 
	{
	    var a01 = mat[1], a02 = mat[2], a03 = mat[3],
	        a12 = mat[6], a13 = mat[7],
	        a23 = mat[11];
	
	    mat[1] = mat[4];
	    mat[2] = mat[8];
	    mat[3] = mat[12];
	    mat[4] = a01;
	    mat[6] = mat[9];
	    mat[7] = mat[13];
	    mat[8] = a02;
	    mat[9] = a12;
	    mat[11] = mat[14];
	    mat[12] = a03;
	    mat[13] = a13;
	    mat[14] = a23;
	    return mat;
	}
	
	dest[0] = mat[0];
	dest[1] = mat[4];
	dest[2] = mat[8];
	dest[3] = mat[12];
	dest[4] = mat[1];
	dest[5] = mat[5];
	dest[6] = mat[9];
	dest[7] = mat[13];
	dest[8] = mat[2];
	dest[9] = mat[6];
	dest[10] = mat[10];
	dest[11] = mat[14];
	dest[12] = mat[3];
	dest[13] = mat[7];
	dest[14] = mat[11];
	dest[15] = mat[15];
	return dest;
}

PIXI.mat4.multiply = function (mat, mat2, dest) 
{
	if (!dest) { dest = mat; }
	
	// Cache the matrix values (makes for huge speed increases!)
	var a00 = mat[ 0], a01 = mat[ 1], a02 = mat[ 2], a03 = mat[3];
	var a10 = mat[ 4], a11 = mat[ 5], a12 = mat[ 6], a13 = mat[7];
	var a20 = mat[ 8], a21 = mat[ 9], a22 = mat[10], a23 = mat[11];
	var a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15];
	
	// Cache only the current line of the second matrix
    var b0  = mat2[0], b1 = mat2[1], b2 = mat2[2], b3 = mat2[3];  
    dest[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    dest[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    dest[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    dest[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = mat2[4];
    b1 = mat2[5];
    b2 = mat2[6];
    b3 = mat2[7];
    dest[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    dest[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    dest[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    dest[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = mat2[8];
    b1 = mat2[9];
    b2 = mat2[10];
    b3 = mat2[11];
    dest[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    dest[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    dest[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    dest[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = mat2[12];
    b1 = mat2[13];
    b2 = mat2[14];
    b3 = mat2[15];
    dest[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    dest[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    dest[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    dest[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    return dest;
}

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * The Point object represents a location in a two-dimensional coordinate system, where x represents the horizontal axis and y represents the vertical axis.
 *
 * @class Point
 * @constructor 
 * @param x {number} position of the point
 * @param y {number} position of the point
 */
PIXI.Point = function(x, y)
{
	/**
	 * @property x 
	 * @type Number
	 * @default 0
	 */
	this.x = x || 0;
	
	/**
	 * @property y
	 * @type Number
	 * @default 0
	 */
	this.y = y || 0;
}

/**
 * Creates a clone of this point
 *
 * @method clone
 * @return {Point} a copy of the point
 */
PIXI.Point.prototype.clone = function()
{
	return new PIXI.Point(this.x, this.y);
}

// constructor
PIXI.Point.prototype.constructor = PIXI.Point;


/**
 * @author Mat Groves http://matgroves.com/
 */

/**
 * the Rectangle object is an area defined by its position, as indicated by its top-left corner point (x, y) and by its width and its height.
 *
 * @class Rectangle
 * @constructor 
 * @param x {number} The X coord of the upper-left corner of the rectangle
 * @param y {number} The Y coord of the upper-left corner of the rectangle
 * @param width {number} The overall wisth of this rectangle
 * @param height {number} The overall height of this rectangle
 */
PIXI.Rectangle = function(x, y, width, height)
{
	/**
	 * @property x
	 * @type Number
	 * @default 0
	 */
	this.x = x || 0;
	
	/**
	 * @property y
	 * @type Number
	 * @default 0
	 */
	this.y = y || 0;
	
	/**
	 * @property width
	 * @type Number
	 * @default 0
	 */
	this.width = width || 0;
	
	/**
	 * @property height
	 * @type Number
	 * @default 0
	 */
	this.height = height || 0;
}

/**
 * Creates a clone of this Rectangle
 *
 * @method clone
 * @return {Rectangle} a copy of the rectangle
 */
PIXI.Rectangle.prototype.clone = function()
{
	return new PIXI.Rectangle(this.x, this.y, this.width, this.height);
}

/**
 * Checks if the x, and y coords passed to this function are contained within this Rectangle
 *
 * @method contains
 * @param x {number} The X coord of the point to test
 * @param y {number} The Y coord of the point to test
 * @return {Boolean} if the x/y coords are within this Rectangle
 */
PIXI.Rectangle.prototype.contains = function(x, y)
{
    if(this.width <= 0 || this.height <= 0)
        return false;

	var x1 = this.x;
	if(x >= x1 && x <= x1 + this.width)
	{
		var y1 = this.y;
		
		if(y >= y1 && y <= y1 + this.height)
		{
			return true;
		}
	}

	return false;
}

// constructor
PIXI.Rectangle.prototype.constructor = PIXI.Rectangle;


/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * The base class for all objects that are rendered on the screen.
 *
 * @class DisplayObject
 * @constructor
 */
PIXI.DisplayObject = function()
{
	this.last = this;
	this.first = this;

	/**
	 * The coordinate of the object relative to the local coordinates of the parent.
	 *
	 * @property position
	 * @type Point
	 */
	this.position = new PIXI.Point();

	/**
	 * The scale factor of the object.
	 *
	 * @property scale
	 * @type Point
	 */
	this.scale = new PIXI.Point(1,1);//{x:1, y:1};

	/**
	 * The pivot point of the displayObject that it rotates around
	 *
	 * @property pivot
	 * @type Point
	 */
	this.pivot = new PIXI.Point(0,0);

	/**
	 * The rotation of the object in radians.
	 *
	 * @property rotation
	 * @type Number
	 */
	this.rotation = 0;

	/**
	 * The opacity of the object.
	 *
	 * @property alpha
	 * @type Number
	 */	
	this.alpha = 1;

	/**
	 * The visibility of the object.
	 *
	 * @property visible
	 * @type Boolean
	 */	
	this.visible = true;

	/**
	 * This is the defined area that will pick up mouse / touch events. It is null by default.
	 * Setting it is a neat way of optimising the hitTest function that the interactionManager will use (as it will not need to hit test all the children)
	 *
	 * @property hitArea
	 * @type Rectangle|Circle|Ellipse|Polygon
	 */	
	this.hitArea = null;

	/**
	 * This is used to indicate if the displayObject should display a mouse hand cursor on rollover
	 *
	 * @property buttonMode
	 * @type Boolean
	 */
	this.buttonMode = false;

	/**
	 * Can this object be rendered
	 *
	 * @property renderable
	 * @type Boolean
	 */
	this.renderable = false;

	/**
	 * [read-only] The display object container that contains this display object.
	 *
	 * @property parent
	 * @type DisplayObjectContainer
	 * @readOnly
	 */	
	this.parent = null;

	/**
	 * [read-only] The stage the display object is connected to, or undefined if it is not connected to the stage.
	 *
	 * @property stage
	 * @type Stage
	 * @readOnly
	 */	
	this.stage = null;

	/**
	 * [read-only] The multiplied alpha of the displayobject
	 *
	 * @property worldAlpha
	 * @type Number
	 * @readOnly
	 */
	this.worldAlpha = 1;

	/**
	 * [read-only] Whether or not the object is interactive, do not toggle directly! use the `interactive` property
	 *
	 * @property _interactive
	 * @type Boolean
	 * @readOnly
	 * @private
	 */
	this._interactive = false;

	/**
	 * [read-only] Current transform of the object based on world (parent) factors
	 *
	 * @property worldTransform
	 * @type Mat3
	 * @readOnly
	 * @private
	 */
	this.worldTransform = PIXI.mat3.create()//mat3.identity();

	/**
	 * [read-only] Current transform of the object locally
	 *
	 * @property localTransform
	 * @type Mat3
	 * @readOnly
	 * @private
	 */
	this.localTransform = PIXI.mat3.create()//mat3.identity();

	/**
	 * [NYI] Unkown
	 *
	 * @property color
	 * @type Array<>
	 * @private
	 */
	this.color = [];

	/**
	 * [NYI] Holds whether or not this object is dynamic, for rendering optimization
	 *
	 * @property dynamic
	 * @type Boolean
	 * @private
	 */
	this.dynamic = true;

	// chach that puppy!
	this._sr = 0;
	this._cr = 1;

	/*
	 * MOUSE Callbacks
	 */

	/**
	 * A callback that is used when the users clicks on the displayObject with their mouse
	 * @method click
	 * @param interactionData {InteractionData}
	 */

	/**
	 * A callback that is used when the user clicks the mouse down over the sprite
	 * @method mousedown
	 * @param interactionData {InteractionData}
	 */

	/**
	 * A callback that is used when the user releases the mouse that was over the displayObject
	 * for this callback to be fired the mouse must have been pressed down over the displayObject
	 * @method mouseup
	 * @param interactionData {InteractionData}
	 */

	/**
	 * A callback that is used when the user releases the mouse that was over the displayObject but is no longer over the displayObject
	 * for this callback to be fired, The touch must have started over the displayObject
	 * @method mouseupoutside
	 * @param interactionData {InteractionData}
	 */

	/**
	 * A callback that is used when the users mouse rolls over the displayObject
	 * @method mouseover
	 * @param interactionData {InteractionData}
	 */

	/**
	 * A callback that is used when the users mouse leaves the displayObject
	 * @method mouseout
	 * @param interactionData {InteractionData}
	 */


	/*
	 * TOUCH Callbacks
	 */

	/**
	 * A callback that is used when the users taps on the sprite with their finger
	 * basically a touch version of click
	 * @method tap
	 * @param interactionData {InteractionData}
	 */

	/**
	 * A callback that is used when the user touch's over the displayObject
	 * @method touchstart
	 * @param interactionData {InteractionData}
	 */

	/**
	 * A callback that is used when the user releases a touch over the displayObject
	 * @method touchend
	 * @param interactionData {InteractionData}
	 */

	/**
	 * A callback that is used when the user releases the touch that was over the displayObject
	 * for this callback to be fired, The touch must have started over the sprite
	 * @method touchendoutside
	 * @param interactionData {InteractionData}
	 */
}

// constructor
PIXI.DisplayObject.prototype.constructor = PIXI.DisplayObject;

/**
 * [Deprecated] Indicates if the sprite will have touch and mouse interactivity. It is false by default
 * Instead of using this function you can now simply set the interactive property to true or false
 *
 * @method setInteractive
 * @param interactive {Boolean}
 * @deprecated Simply set the `interactive` property directly
 */
PIXI.DisplayObject.prototype.setInteractive = function(interactive)
{
	this.interactive = interactive;
}

/**
 * Indicates if the sprite will have touch and mouse interactivity. It is false by default
 *
 * @property interactive
 * @type Boolean
 * @default false
 */
Object.defineProperty(PIXI.DisplayObject.prototype, 'interactive', {
    get: function() {
        return this._interactive;
    },
    set: function(value) {
    	this._interactive = value;
    	
    	// TODO more to be done here..
		// need to sort out a re-crawl!
		if(this.stage)this.stage.dirty = true;
    }
});

/**
 * Sets a mask for the displayObject. A mask is an object that limits the visibility of an object to the shape of the mask applied to it.
 * In PIXI a regular mask must be a PIXI.Ggraphics object. This allows for much faster masking in canvas as it utilises shape clipping.
 * To remove a mask, set this property to null.
 *
 * @property mask
 * @type Graphics
 */
Object.defineProperty(PIXI.DisplayObject.prototype, 'mask', {
    get: function() {
        return this._mask;
    },
    set: function(value) {
    	
        this._mask = value;
        
        if(value)
        {
	        this.addFilter(value)
        }
        else
        {
        	 this.removeFilter();
        }
    }
});

/*
 * Adds a filter to this displayObject
 *
 * @method addFilter
 * @param mask {Graphics} the graphics object to use as a filter
 * @private
 */
PIXI.DisplayObject.prototype.addFilter = function(mask)
{
	if(this.filter)return;
	this.filter = true;
	
	// insert a filter block..
	var start = new PIXI.FilterBlock();
	var end = new PIXI.FilterBlock();
	
	start.mask = mask;
	end.mask = mask;
	
	start.first = start.last =  this;
	end.first = end.last = this;
	
	start.open = true;
	
	/*
	 * insert start
	 */
	
	var childFirst = start
	var childLast = start
	var nextObject;
	var previousObject;
		
	previousObject = this.first._iPrev;
	
	if(previousObject)
	{
		nextObject = previousObject._iNext;
		childFirst._iPrev = previousObject;
		previousObject._iNext = childFirst;		
	}
	else
	{
		nextObject = this;
	}	
	
	if(nextObject)
	{
		nextObject._iPrev = childLast;
		childLast._iNext = nextObject;
	}
	
	
	// now insert the end filter block..
	
	/*
	 * insert end filter
	 */
	var childFirst = end
	var childLast = end
	var nextObject = null;
	var previousObject = null;
		
	previousObject = this.last;
	nextObject = previousObject._iNext;
	
	if(nextObject)
	{
		nextObject._iPrev = childLast;
		childLast._iNext = nextObject;
	}
	
	childFirst._iPrev = previousObject;
	previousObject._iNext = childFirst;	
	
	var updateLast = this;
	
	var prevLast = this.last;
	while(updateLast)
	{
		if(updateLast.last == prevLast)
		{
			updateLast.last = end;
		}
		updateLast = updateLast.parent;
	}
	
	this.first = start;
	
	// if webGL...
	if(this.__renderGroup)
	{
		this.__renderGroup.addFilterBlocks(start, end);
	}
	
	mask.renderable = false;
	
}

/*
 * Removes the filter to this displayObject
 *
 * @method removeFilter
 * @private
 */
PIXI.DisplayObject.prototype.removeFilter = function()
{
	if(!this.filter)return;
	this.filter = false;
	
	// modify the list..
	var startBlock = this.first;
	
	var nextObject = startBlock._iNext;
	var previousObject = startBlock._iPrev;
		
	if(nextObject)nextObject._iPrev = previousObject;
	if(previousObject)previousObject._iNext = nextObject;		
	
	this.first = startBlock._iNext;
	
	
	// remove the end filter
	var lastBlock = this.last;
	
	var nextObject = lastBlock._iNext;
	var previousObject = lastBlock._iPrev;
		
	if(nextObject)nextObject._iPrev = previousObject;
	previousObject._iNext = nextObject;		
	
	// this is always true too!
	var tempLast =  lastBlock._iPrev;	
	// need to make sure the parents last is updated too
	var updateLast = this;
	while(updateLast.last == lastBlock)
	{
		updateLast.last = tempLast;
		updateLast = updateLast.parent;
		if(!updateLast)break;
	}
	
	var mask = startBlock.mask
	mask.renderable = true;
	
	// if webGL...
	if(this.__renderGroup)
	{
		this.__renderGroup.removeFilterBlocks(startBlock, lastBlock);
	}
}

/*
 * Updates the object transform for rendering
 *
 * @method updateTransform
 * @private
 */
PIXI.DisplayObject.prototype.updateTransform = function()
{
	// TODO OPTIMIZE THIS!! with dirty
	if(this.rotation !== this.rotationCache)
	{
		this.rotationCache = this.rotation;
		this._sr =  Math.sin(this.rotation);
		this._cr =  Math.cos(this.rotation);
	}	
	
	var localTransform = this.localTransform;
	var parentTransform = this.parent.worldTransform;
	var worldTransform = this.worldTransform;
	//console.log(localTransform)
	localTransform[0] = this._cr * this.scale.x;
	localTransform[1] = -this._sr * this.scale.y
	localTransform[3] = this._sr * this.scale.x;
	localTransform[4] = this._cr * this.scale.y;
	
	// TODO --> do we even need a local matrix???
	
	var px = this.pivot.x;
	var py = this.pivot.y;
   	
    // Cache the matrix values (makes for huge speed increases!)
    var a00 = localTransform[0], a01 = localTransform[1], a02 = this.position.x - localTransform[0] * px - py * localTransform[1],
        a10 = localTransform[3], a11 = localTransform[4], a12 = this.position.y - localTransform[4] * py - px * localTransform[3],

        b00 = parentTransform[0], b01 = parentTransform[1], b02 = parentTransform[2],
        b10 = parentTransform[3], b11 = parentTransform[4], b12 = parentTransform[5];

	localTransform[2] = a02
	localTransform[5] = a12
	
    worldTransform[0] = b00 * a00 + b01 * a10;
    worldTransform[1] = b00 * a01 + b01 * a11;
    worldTransform[2] = b00 * a02 + b01 * a12 + b02;

    worldTransform[3] = b10 * a00 + b11 * a10;
    worldTransform[4] = b10 * a01 + b11 * a11;
    worldTransform[5] = b10 * a02 + b11 * a12 + b12;

	// because we are using affine transformation, we can optimise the matrix concatenation process.. wooo!
	// mat3.multiply(this.localTransform, this.parent.worldTransform, this.worldTransform);
	this.worldAlpha = this.alpha * this.parent.worldAlpha;
	
	this.vcount = PIXI.visibleCount;

}

PIXI.visibleCount = 0;
/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */


/**
 * A DisplayObjectContainer represents a collection of display objects.
 * It is the base class of all display objects that act as a container for other objects.
 *
 * @class DisplayObjectContainer 
 * @extends DisplayObject
 * @constructor
 */
PIXI.DisplayObjectContainer = function()
{
	PIXI.DisplayObject.call( this );
	
	/**
	 * [read-only] The of children of this container.
	 *
	 * @property children
	 * @type Array<DisplayObject>
	 * @readOnly
	 */	
	this.children = [];
}

// constructor
PIXI.DisplayObjectContainer.prototype = Object.create( PIXI.DisplayObject.prototype );
PIXI.DisplayObjectContainer.prototype.constructor = PIXI.DisplayObjectContainer;

//TODO make visible a getter setter
/*
Object.defineProperty(PIXI.DisplayObjectContainer.prototype, 'visible', {
    get: function() {
        return this._visible;
    },
    set: function(value) {
        this._visible = value;
        
    }
});*/

/**
 * Adds a child to the container.
 *
 * @method addChild
 * @param child {DisplayObject} The DisplayObject to add to the container
 */
PIXI.DisplayObjectContainer.prototype.addChild = function(child)
{
	if(child.parent != undefined)
	{
		
		//// COULD BE THIS???
		child.parent.removeChild(child);
	//	return;
	}

	child.parent = this;
	
	this.children.push(child);	
	
	// update the stage refference..
	
	if(this.stage)
	{
		var tmpChild = child;
		do
		{
			if(tmpChild.interactive)this.stage.dirty = true;
			tmpChild.stage = this.stage;
			tmpChild = tmpChild._iNext;
		}	
		while(tmpChild)
	}
	
	// LINKED LIST //
	
	// modify the list..
	var childFirst = child.first
	var childLast = child.last;
	var nextObject;
	var previousObject;
	
	// this could be wrong if there is a filter??
	if(this.filter)
	{
		previousObject =  this.last._iPrev;
	}
	else
	{
		previousObject = this.last;
	}

	nextObject = previousObject._iNext;
	
	// always true in this case
	// need to make sure the parents last is updated too
	var updateLast = this;
	var prevLast = previousObject;
	
	while(updateLast)
	{
		if(updateLast.last == prevLast)
		{
			updateLast.last = child.last;
		}
		updateLast = updateLast.parent;
	}
	
	if(nextObject)
	{
		nextObject._iPrev = childLast;
		childLast._iNext = nextObject;
	}
	
	childFirst._iPrev = previousObject;
	previousObject._iNext = childFirst;		

	// need to remove any render groups..
	if(this.__renderGroup)
	{
		// being used by a renderTexture.. if it exists then it must be from a render texture;
		if(child.__renderGroup)child.__renderGroup.removeDisplayObjectAndChildren(child);
		// add them to the new render group..
		this.__renderGroup.addDisplayObjectAndChildren(child);
	}
	
}

/**
 * Adds a child to the container at a specified index. If the index is out of bounds an error will be thrown
 *
 * @method addChildAt
 * @param child {DisplayObject} The child to add
 * @param index {number} The index to place the child in
 */
PIXI.DisplayObjectContainer.prototype.addChildAt = function(child, index)
{
	if(index >= 0 && index <= this.children.length)
	{
		if(child.parent != undefined)
		{
			child.parent.removeChild(child);
		}
		child.parent = this;
		
		if(this.stage)
		{
			var tmpChild = child;
			do
			{
				if(tmpChild.interactive)this.stage.dirty = true;
				tmpChild.stage = this.stage;
				tmpChild = tmpChild._iNext;
			}
			while(tmpChild)
		}
		
		// modify the list..
		var childFirst = child.first;
		var childLast = child.last;
		var nextObject;
		var previousObject;
		
		if(index == this.children.length)
		{
			previousObject =  this.last;
			var updateLast = this;
			var prevLast = this.last;
			while(updateLast)
			{
				if(updateLast.last == prevLast)
				{
					updateLast.last = child.last;
				}
				updateLast = updateLast.parent;
			}
		}
		else if(index == 0)
		{
			previousObject = this;
		}
		else
		{
			previousObject = this.children[index-1].last;
		}
		
		nextObject = previousObject._iNext;
		
		// always true in this case
		if(nextObject)
		{
			nextObject._iPrev = childLast;
			childLast._iNext = nextObject;
		}
		
		childFirst._iPrev = previousObject;
		previousObject._iNext = childFirst;		

		this.children.splice(index, 0, child);
		// need to remove any render groups..
		if(this.__renderGroup)
		{
			// being used by a renderTexture.. if it exists then it must be from a render texture;
			if(child.__renderGroup)child.__renderGroup.removeDisplayObjectAndChildren(child);
			// add them to the new render group..
			this.__renderGroup.addDisplayObjectAndChildren(child);
		}
		
	}
	else
	{
		throw new Error(child + " The index "+ index +" supplied is out of bounds " + this.children.length);
	}
}

/**
 * [NYI] Swaps the depth of 2 displayObjects
 *
 * @method swapChildren
 * @param child {DisplayObject}
 * @param child2 {DisplayObject}
 * @private
 */
PIXI.DisplayObjectContainer.prototype.swapChildren = function(child, child2)
{
	/*
	 * this funtion needs to be recoded.. 
	 * can be done a lot faster..
	 */
	return;
	
	// need to fix this function :/
	/*
	// TODO I already know this??
	var index = this.children.indexOf( child );
	var index2 = this.children.indexOf( child2 );
	
	if ( index !== -1 && index2 !== -1 ) 
	{
		// cool
		
		/*
		if(this.stage)
		{
			// this is to satisfy the webGL batching..
			// TODO sure there is a nicer way to achieve this!
			this.stage.__removeChild(child);
			this.stage.__removeChild(child2);
			
			this.stage.__addChild(child);
			this.stage.__addChild(child2);
		}
		
		// swap the positions..
		this.children[index] = child2;
		this.children[index2] = child;
		
	}
	else
	{
		throw new Error(child + " Both the supplied DisplayObjects must be a child of the caller " + this);
	}*/
}

/**
 * Returns the Child at the specified index
 *
 * @method getChildAt
 * @param index {number} The index to get the child from
 */
PIXI.DisplayObjectContainer.prototype.getChildAt = function(index)
{
	if(index >= 0 && index < this.children.length)
	{
		return this.children[index];
	}
	else
	{
		throw new Error(child + " Both the supplied DisplayObjects must be a child of the caller " + this);
	}
}

/**
 * Removes a child from the container.
 *
 * @method removeChild
 * @param child {DisplayObject} The DisplayObject to remove
 */
PIXI.DisplayObjectContainer.prototype.removeChild = function(child)
{
	var index = this.children.indexOf( child );
	if ( index !== -1 ) 
	{
		// unlink //
		// modify the list..
		var childFirst = child.first;
		var childLast = child.last;
		
		var nextObject = childLast._iNext;
		var previousObject = childFirst._iPrev;
			
		if(nextObject)nextObject._iPrev = previousObject;
		previousObject._iNext = nextObject;		
		
		if(this.last == childLast)
		{
			var tempLast =  childFirst._iPrev;	
			// need to make sure the parents last is updated too
			var updateLast = this;
			while(updateLast.last == childLast.last)
			{
				updateLast.last = tempLast;
				updateLast = updateLast.parent;
				if(!updateLast)break;
			}
		}
		
		childLast._iNext = null;
		childFirst._iPrev = null;
		 
		// update the stage reference..
		if(this.stage)
		{
			var tmpChild = child;
			do
			{
				if(tmpChild.interactive)this.stage.dirty = true;
				tmpChild.stage = null;
				tmpChild = tmpChild._iNext;
			}	
			while(tmpChild)
		}
	
		// webGL trim
		if(child.__renderGroup)
		{
			child.__renderGroup.removeDisplayObjectAndChildren(child);
		}
		
		child.parent = undefined;
		this.children.splice( index, 1 );
	}
	else
	{
		throw new Error(child + " The supplied DisplayObject must be a child of the caller " + this);
	}
}

/*
 * Updates the container's children's transform for rendering
 *
 * @method updateTransform
 * @private
 */
PIXI.DisplayObjectContainer.prototype.updateTransform = function()
{
	if(!this.visible)return;
	
	PIXI.DisplayObject.prototype.updateTransform.call( this );
	
	for(var i=0,j=this.children.length; i<j; i++)
	{
		this.children[i].updateTransform();	
	}
}

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

PIXI.blendModes = {};
PIXI.blendModes.NORMAL = 0;
PIXI.blendModes.SCREEN = 1;


/**
 * The SPrite object is the base for all textured objects that are rendered to the screen
 *
 * @class Sprite
 * @extends DisplayObjectContainer
 * @constructor
 * @param texture {Texture} The texture for this sprite
 * @type String
 */
PIXI.Sprite = function(texture)
{
	PIXI.DisplayObjectContainer.call( this );

	/**
	 * The anchor sets the origin point of the texture.
	 * The default is 0,0 this means the textures origin is the top left 
	 * Setting than anchor to 0.5,0.5 means the textures origin is centered
	 * Setting the anchor to 1,1 would mean the textures origin points will be the bottom right
	 *
     * @property anchor
     * @type Point
     */
	this.anchor = new PIXI.Point();

	/**
	 * The texture that the sprite is using
	 *
	 * @property texture
	 * @type Texture
	 */
	this.texture = texture;

	/**
	 * The blend mode of sprite.
	 * currently supports PIXI.blendModes.NORMAL and PIXI.blendModes.SCREEN
	 *
	 * @property blendMode
	 * @type Number
	 */
	this.blendMode = PIXI.blendModes.NORMAL;

	/**
	 * The width of the sprite (this is initially set by the texture)
	 *
	 * @property _width
	 * @type Number
	 * @private
	 */
	this._width = 0;

	/**
	 * The height of the sprite (this is initially set by the texture)
	 *
	 * @property _height
	 * @type Number
	 * @private
	 */
	this._height = 0;

	if(texture.baseTexture.hasLoaded)
	{
		this.updateFrame = true;
	}
	else
	{
		this.onTextureUpdateBind = this.onTextureUpdate.bind(this);
		this.texture.addEventListener( 'update', this.onTextureUpdateBind );
	}

	this.renderable = true;
}

// constructor
PIXI.Sprite.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );
PIXI.Sprite.prototype.constructor = PIXI.Sprite;

/**
 * The width of the sprite, setting this will actually modify the scale to acheive the value set
 *
 * @property width
 * @type Number
 */
Object.defineProperty(PIXI.Sprite.prototype, 'width', {
    get: function() {
        return this.scale.x * this.texture.frame.width;
    },
    set: function(value) {
    	this.scale.x = value / this.texture.frame.width
        this._width = value;
    }
});

/**
 * The height of the sprite, setting this will actually modify the scale to acheive the value set
 *
 * @property height
 * @type Number
 */
Object.defineProperty(PIXI.Sprite.prototype, 'height', {
    get: function() {
        return  this.scale.y * this.texture.frame.height;
    },
    set: function(value) {
    	this.scale.y = value / this.texture.frame.height
        this._height = value;
    }
});

/**
 * Sets the texture of the sprite
 *
 * @method setTexture
 * @param texture {Texture} The PIXI texture that is displayed by the sprite
 */
PIXI.Sprite.prototype.setTexture = function(texture)
{
	// stop current texture;
	if(this.texture.baseTexture != texture.baseTexture)
	{
		this.textureChange = true;	
		this.texture = texture;
		
		if(this.__renderGroup)
		{
			this.__renderGroup.updateTexture(this);
		}
	}
	else
	{
		this.texture = texture;
	}
	
	this.updateFrame = true;
}

/**
 * When the texture is updated, this event will fire to update the scale and frame
 *
 * @method onTextureUpdate
 * @param event
 * @private
 */
PIXI.Sprite.prototype.onTextureUpdate = function(event)
{
	//this.texture.removeEventListener( 'update', this.onTextureUpdateBind );

	// so if _width is 0 then width was not set..
	if(this._width)this.scale.x = this._width / this.texture.frame.width;
	if(this._height)this.scale.y = this._height / this.texture.frame.height;
	
	this.updateFrame = true;
}

// some helper functions..

/**
 * 
 * Helper function that creates a sprite that will contain a texture from the TextureCache based on the frameId
 * The frame ids are created when a Texture packer file has been loaded
 *
 * @method fromFrame
 * @static
 * @param frameId {String} The frame Id of the texture in the cache
 * @return {Sprite} A new Sprite using a texture from the texture cache matching the frameId
 */
PIXI.Sprite.fromFrame = function(frameId)
{
	var texture = PIXI.TextureCache[frameId];
	if(!texture)throw new Error("The frameId '"+ frameId +"' does not exist in the texture cache" + this);
	return new PIXI.Sprite(texture);
}

/**
 * 
 * Helper function that creates a sprite that will contain a texture based on an image url
 * If the image is not in the texture cache it will be loaded
 *
 * @method fromImage
 * @static
 * @param imageId {String} The image url of the texture
 * @return {Sprite} A new Sprite using a texture from the texture cache matching the image id
 */
PIXI.Sprite.fromImage = function(imageId)
{
	var texture = PIXI.Texture.fromImage(imageId);
	return new PIXI.Sprite(texture);
}


/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * A Stage represents the root of the display tree. Everything connected to the stage is rendered
 *
 * @class Stage
 * @extends DisplayObjectContainer
 * @constructor
 * @param backgroundColor {number} the background color of the stage, easiest way to pass this in is in hex format
 *		like: 0xFFFFFF for white
 * @param interactive {Boolean} enable / disable interaction (default is false)
 */
PIXI.Stage = function(backgroundColor, interactive)
{
	PIXI.DisplayObjectContainer.call( this );

	/**
	 * [read-only] Current transform of the object based on world (parent) factors
	 *
	 * @property worldTransform
	 * @type Mat3
	 * @readOnly
	 * @private
	 */
	this.worldTransform = PIXI.mat3.create();

	/**
	 * Whether or not the stage is interactive
	 *
	 * @property interactive
	 * @type Boolean
	 */
	this.interactive = interactive;

	/**
	 * The interaction manage for this stage, manages all interactive activity on the stage
	 *
	 * @property interactive
	 * @type InteractionManager
	 */
	this.interactionManager = new PIXI.InteractionManager(this);

	/**
	 * Whether the stage is dirty and needs to have interactions updated
	 *
	 * @property dirty
	 * @type Boolean
	 * @private
	 */
	this.dirty = true;

	this.__childrenAdded = [];
	this.__childrenRemoved = [];

	//the stage is it's own stage
	this.stage = this;

	//optimize hit detection a bit
	this.stage.hitArea = new PIXI.Rectangle(0,0,100000, 100000);

	this.setBackgroundColor(backgroundColor);
	this.worldVisible = true;
}

// constructor
PIXI.Stage.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );
PIXI.Stage.prototype.constructor = PIXI.Stage;

/*
 * Updates the object transform for rendering
 *
 * @method updateTransform
 * @private
 */
PIXI.Stage.prototype.updateTransform = function()
{
	this.worldAlpha = 1;		
	this.vcount = PIXI.visibleCount;
	
	for(var i=0,j=this.children.length; i<j; i++)
	{
		this.children[i].updateTransform();	
	}
	
	if(this.dirty)
	{
		this.dirty = false;
		// update interactive!
		this.interactionManager.dirty = true;
	}
	
	
	if(this.interactive)this.interactionManager.update();
}

/**
 * Sets the background color for the stage
 *
 * @method setBackgroundColor
 * @param backgroundColor {number} the color of the background, easiest way to pass this in is in hex format
 *		like: 0xFFFFFF for white
 */
PIXI.Stage.prototype.setBackgroundColor = function(backgroundColor)
{
	this.backgroundColor = backgroundColor || 0x000000;
	this.backgroundColorSplit = HEXtoRGB(this.backgroundColor);
	var hex = this.backgroundColor.toString(16);
	hex = "000000".substr(0, 6 - hex.length) + hex;
	this.backgroundColorString = "#" + hex;
}

/**
 * This will return the point containing global coords of the mouse.
 *
 * @method getMousePosition
 * @return {Point} The point containing the coords of the global InteractionData position.
 */
PIXI.Stage.prototype.getMousePosition = function()
{
	return this.interactionManager.mouse.global;
}

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */


/**
 * This object is one that will allow you to specify custom rendering functions based on render type
 *
 * @class CustomRenderable 
 * @extends DisplayObject
 * @constructor
 */
PIXI.CustomRenderable = function()
{
	PIXI.DisplayObject.call( this );
	
}

// constructor
PIXI.CustomRenderable.prototype = Object.create( PIXI.DisplayObject.prototype );
PIXI.CustomRenderable.prototype.constructor = PIXI.CustomRenderable;

/**
 * If this object is being rendered by a CanvasRenderer it will call this callback
 *
 * @method renderCanvas
 * @param renderer {CanvasRenderer} The renderer instance
 */
PIXI.CustomRenderable.prototype.renderCanvas = function(renderer)
{
	// override!
}

/**
 * If this object is being rendered by a WebGLRenderer it will call this callback to initialize
 *
 * @method initWebGL
 * @param renderer {WebGLRenderer} The renderer instance
 */
PIXI.CustomRenderable.prototype.initWebGL = function(renderer)
{
	// override!
}

/**
 * If this object is being rendered by a WebGLRenderer it will call this callback
 *
 * @method renderWebGL
 * @param renderer {WebGLRenderer} The renderer instance
 */
PIXI.CustomRenderable.prototype.renderWebGL = function(renderGroup, projectionMatrix)
{
	// not sure if both needed? but ya have for now!
	// override!
}


/**
 * @author Mat Groves http://matgroves.com/
 */

PIXI.Strip = function(texture, width, height)
{
	PIXI.DisplayObjectContainer.call( this );
	this.texture = texture;
	this.blendMode = PIXI.blendModes.NORMAL;
	
	try
	{
		this.uvs = new Float32Array([0, 1,
				1, 1,
				1, 0, 0,1]);
	
		this.verticies = new Float32Array([0, 0,
						  0,0,
						  0,0, 0,
						  0, 0]);
						  
		this.colors = new Float32Array([1, 1, 1, 1]);
		
		this.indices = new Uint16Array([0, 1, 2, 3]);
	}
	catch(error)
	{
		this.uvs = [0, 1,
				1, 1,
				1, 0, 0,1];
	
		this.verticies = [0, 0,
						  0,0,
						  0,0, 0,
						  0, 0];
						  
		this.colors = [1, 1, 1, 1];
		
		this.indices = [0, 1, 2, 3];
	}
	
	
	/*
	this.uvs = new Float32Array()
	this.verticies = new Float32Array()
	this.colors = new Float32Array()
	this.indices = new Uint16Array()
*/
	this.width = width;
	this.height = height;
	
	// load the texture!
	if(texture.baseTexture.hasLoaded)
	{
		this.width   = this.texture.frame.width;
		this.height  = this.texture.frame.height;
		this.updateFrame = true;
	}
	else
	{
		this.onTextureUpdateBind = this.onTextureUpdate.bind(this);
		this.texture.addEventListener( 'update', this.onTextureUpdateBind );
	}
	
	this.renderable = true;
}

// constructor
PIXI.Strip.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );
PIXI.Strip.prototype.constructor = PIXI.Strip;

PIXI.Strip.prototype.setTexture = function(texture)
{
	//TODO SET THE TEXTURES
	//TODO VISIBILITY
	
	// stop current texture 
	this.texture = texture;
	this.width   = texture.frame.width;
	this.height  = texture.frame.height;
	this.updateFrame = true;
}

PIXI.Strip.prototype.onTextureUpdate = function(event)
{
	this.updateFrame = true;
}
// some helper functions..


/**
 * @author Mat Groves http://matgroves.com/
 */


PIXI.Rope = function(texture, points)
{
	PIXI.Strip.call( this, texture );
	this.points = points;
	
	try
	{
		this.verticies = new Float32Array( points.length * 4);
		this.uvs = new Float32Array( points.length * 4);
		this.colors = new Float32Array(  points.length * 2);
		this.indices = new Uint16Array( points.length * 2);
	}
	catch(error)
	{
		this.verticies = verticies
		
		this.uvs = uvs
		this.colors = colors
		this.indices = indices
	}
	
	this.refresh();
}


// constructor
PIXI.Rope.prototype = Object.create( PIXI.Strip.prototype );
PIXI.Rope.prototype.constructor = PIXI.Rope;

PIXI.Rope.prototype.refresh = function()
{
	var points = this.points;
	if(points.length < 1)return;
	
	var uvs = this.uvs
	var indices = this.indices;
	var colors = this.colors;
	
	var lastPoint = points[0];
	var nextPoint;
	var perp = {x:0, y:0};
	var point = points[0];
	
	this.count-=0.2;
	
	
	uvs[0] = 0
	uvs[1] = 1
	uvs[2] = 0
	uvs[3] = 1
	
	colors[0] = 1;
	colors[1] = 1;
	
	indices[0] = 0;
	indices[1] = 1;
	
	var total = points.length;
		
	for (var i =  1; i < total; i++) 
	{
		
		var point = points[i];
		var index = i * 4;
		// time to do some smart drawing!
		var amount = i/(total-1)
		
		if(i%2)
		{
			uvs[index] = amount;
			uvs[index+1] = 0;
			
			uvs[index+2] = amount
			uvs[index+3] = 1
		
		}
		else
		{
			uvs[index] = amount
			uvs[index+1] = 0
			
			uvs[index+2] = amount
			uvs[index+3] = 1
		}
		
		index = i * 2;
		colors[index] = 1;
		colors[index+1] = 1;
		
		index = i * 2;
		indices[index] = index;
		indices[index + 1] = index + 1;
		
		lastPoint = point;
	}
}

PIXI.Rope.prototype.updateTransform = function()
{
	
	var points = this.points;
	if(points.length < 1)return;
	
	var verticies = this.verticies 
	
	var lastPoint = points[0];
	var nextPoint;
	var perp = {x:0, y:0};
	var point = points[0];
	
	this.count-=0.2;
	
	verticies[0] = point.x + perp.x 
	verticies[1] = point.y + perp.y //+ 200
	verticies[2] = point.x - perp.x 
	verticies[3] = point.y - perp.y//+200
	// time to do some smart drawing!
	
	var total = points.length;
		
	for (var i =  1; i < total; i++) 
	{
		
		var point = points[i];
		var index = i * 4;
		
		if(i < points.length-1)
		{
			nextPoint = points[i+1];
		}
		else
		{
			nextPoint = point
		}
		
		perp.y = -(nextPoint.x - lastPoint.x);
		perp.x = nextPoint.y - lastPoint.y;
		
		var ratio = (1 - (i / (total-1))) * 10;
				if(ratio > 1)ratio = 1;
				
		var perpLength = Math.sqrt(perp.x * perp.x + perp.y * perp.y);
		var num = this.texture.height/2//(20 + Math.abs(Math.sin((i + this.count) * 0.3) * 50) )* ratio;
		perp.x /= perpLength;
		perp.y /= perpLength;
	
		perp.x *= num;
		perp.y *= num;
		
		verticies[index] = point.x + perp.x 
		verticies[index+1] = point.y + perp.y
		verticies[index+2] = point.x - perp.x 
		verticies[index+3] = point.y - perp.y

		lastPoint = point;
	}
	
	PIXI.DisplayObjectContainer.prototype.updateTransform.call( this );
}

PIXI.Rope.prototype.setTexture = function(texture)
{
	// stop current texture 
	this.texture = texture;
	this.updateFrame = true;
}





/**
 * @author Mat Groves http://matgroves.com/
 */

/**
 * A tiling sprite is a fast way of rendering a tiling image
 *
 * @class TilingSprite
 * @extends DisplayObjectContainer
 * @constructor
 * @param texture {Texture} the texture of the tiling sprite
 * @param width {number}  the width of the tiling sprite
 * @param height {number} the height of the tiling sprite
 */
PIXI.TilingSprite = function(texture, width, height)
{
	PIXI.DisplayObjectContainer.call( this );

	/**
	 * The texture that the sprite is using
	 *
	 * @property texture
	 * @type Texture
	 */
	this.texture = texture;

	/**
	 * The width of the tiling sprite
	 *
	 * @property width
	 * @type Number
	 */
	this.width = width;

	/**
	 * The height of the tiling sprite
	 *
	 * @property height
	 * @type Number
	 */
	this.height = height;

	/**
	 * The scaling of the image that is being tiled
	 *
	 * @property tileScale
	 * @type Point
	 */	
	this.tileScale = new PIXI.Point(1,1);

	/**
	 * The offset position of the image that is being tiled
	 *
	 * @property tilePosition
	 * @type Point
	 */	
	this.tilePosition = new PIXI.Point(0,0);

	this.renderable = true;
	
	this.blendMode = PIXI.blendModes.NORMAL
}

// constructor
PIXI.TilingSprite.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );
PIXI.TilingSprite.prototype.constructor = PIXI.TilingSprite;

/**
 * Sets the texture of the tiling sprite
 *
 * @method setTexture
 * @param texture {Texture} The PIXI texture that is displayed by the sprite
 */
PIXI.TilingSprite.prototype.setTexture = function(texture)
{
	//TODO SET THE TEXTURES
	//TODO VISIBILITY
	
	// stop current texture 
	this.texture = texture;
	this.updateFrame = true;
}

/**
 * When the texture is updated, this event will fire to update the frame
 *
 * @method onTextureUpdate
 * @param event
 * @private
 */
PIXI.TilingSprite.prototype.onTextureUpdate = function(event)
{
	this.updateFrame = true;
}


/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */



PIXI.FilterBlock = function(mask)
{
	this.graphics = mask
	this.visible = true;
	this.renderable = true;
}


/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */



PIXI.MaskFilter = function(graphics)
{
	// the graphics data that will be used for filtering
	this.graphics;
}


/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */


/**
 * The Graphics class contains a set of methods that you can use to create primitive shapes and lines. 
 * It is important to know that with the webGL renderer only simple polys can be filled at this stage
 * Complex polys will not be filled. Heres an example of a complex poly: http://www.goodboydigital.com/wp-content/uploads/2013/06/complexPolygon.png
 *
 * @class Graphics 
 * @extends DisplayObjectContainer
 * @constructor
 */
PIXI.Graphics = function()
{
	PIXI.DisplayObjectContainer.call( this );
	
	this.renderable = true;

    /**
     * The alpha of the fill of this graphics object
     *
     * @property fillAlpha
     * @type Number
     */
	this.fillAlpha = 1;

    /**
     * The width of any lines drawn
     *
     * @property lineWidth
     * @type Number
     */
	this.lineWidth = 0;

    /**
     * The color of any lines drawn
     *
     * @property lineColor
     * @type String
     */
	this.lineColor = "black";

    /**
     * Graphics data
     *
     * @property graphicsData
     * @type Array
     * @private
     */
	this.graphicsData = [];

    /**
     * Current path
     *
     * @property currentPath
     * @type Object
     * @private
     */
	this.currentPath = {points:[]};
}

// constructor
PIXI.Graphics.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );
PIXI.Graphics.prototype.constructor = PIXI.Graphics;

/**
 * Specifies a line style used for subsequent calls to Graphics methods such as the lineTo() method or the drawCircle() method.
 *
 * @method lineStyle
 * @param lineWidth {number} width of the line to draw, will update the object's stored style
 * @param color {number} color of the line to draw, will update the object's stored style
 * @param alpha {number} alpha of the line to draw, will update the object's stored style
 */
PIXI.Graphics.prototype.lineStyle = function(lineWidth, color, alpha)
{
	if(this.currentPath.points.length == 0)this.graphicsData.pop();
	
	this.lineWidth = lineWidth || 0;
	this.lineColor = color || 0;
	this.lineAlpha = (alpha == undefined) ? 1 : alpha;
	
	this.currentPath = {lineWidth:this.lineWidth, lineColor:this.lineColor, lineAlpha:this.lineAlpha, 
						fillColor:this.fillColor, fillAlpha:this.fillAlpha, fill:this.filling, points:[], type:PIXI.Graphics.POLY};
	
	this.graphicsData.push(this.currentPath);
}

/**
 * Moves the current drawing position to (x, y).
 *
 * @method moveTo
 * @param x {number} the X coord to move to
 * @param y {number} the Y coord to move to
 */
PIXI.Graphics.prototype.moveTo = function(x, y)
{
	if(this.currentPath.points.length == 0)this.graphicsData.pop();
	
	this.currentPath = this.currentPath = {lineWidth:this.lineWidth, lineColor:this.lineColor, lineAlpha:this.lineAlpha, 
						fillColor:this.fillColor, fillAlpha:this.fillAlpha, fill:this.filling, points:[], type:PIXI.Graphics.POLY};
	
	this.currentPath.points.push(x, y);
	
	this.graphicsData.push(this.currentPath);
}

/**
 * Draws a line using the current line style from the current drawing position to (x, y);
 * the current drawing position is then set to (x, y).
 *
 * @method lineTo
 * @param x {number} the X coord to draw to
 * @param y {number} the Y coord to draw to
 */
PIXI.Graphics.prototype.lineTo = function(x, y)
{
	this.currentPath.points.push(x, y);
	this.dirty = true;
}

/**
 * Specifies a simple one-color fill that subsequent calls to other Graphics methods
 * (such as lineTo() or drawCircle()) use when drawing.
 *
 * @method beginFill
 * @param color {uint} the color of the fill
 * @param alpha {number} the alpha
 */
PIXI.Graphics.prototype.beginFill = function(color, alpha)
{
	this.filling = true;
	this.fillColor = color || 0;
	this.fillAlpha = (alpha == undefined) ? 1 : alpha;
}

/**
 * Applies a fill to the lines and shapes that were added since the last call to the beginFill() method.
 *
 * @method endFill
 */
PIXI.Graphics.prototype.endFill = function()
{
	this.filling = false;
	this.fillColor = null;
	this.fillAlpha = 1;
}

/**
 * @method drawRect
 *
 * @param x {number} The X coord of the top-left of the rectangle
 * @param y {number} The Y coord of the top-left of the rectangle
 * @param width {number} The width of the rectangle
 * @param height {number} The height of the rectangle
 */
PIXI.Graphics.prototype.drawRect = function( x, y, width, height )
{
	if(this.currentPath.points.length == 0)this.graphicsData.pop();
	
	this.currentPath = {lineWidth:this.lineWidth, lineColor:this.lineColor, lineAlpha:this.lineAlpha, 
						fillColor:this.fillColor, fillAlpha:this.fillAlpha, fill:this.filling, 
						points:[x, y, width, height], type:PIXI.Graphics.RECT};
						
	this.graphicsData.push(this.currentPath);
	this.dirty = true;
}

/**
 * Draws a circle.
 *
 * @method drawCircle
 * @param x {number} The X coord of the center of the circle
 * @param y {number} The Y coord of the center of the circle
 * @param radius {number} The radius of the circle
 */
PIXI.Graphics.prototype.drawCircle = function( x, y, radius)
{
	if(this.currentPath.points.length == 0)this.graphicsData.pop();
	
	this.currentPath = {lineWidth:this.lineWidth, lineColor:this.lineColor, lineAlpha:this.lineAlpha, 
						fillColor:this.fillColor, fillAlpha:this.fillAlpha, fill:this.filling, 
						points:[x, y, radius, radius], type:PIXI.Graphics.CIRC};
						
	this.graphicsData.push(this.currentPath);
	this.dirty = true;
}

/**
 * Draws an elipse.
 *
 * @method drawElipse
 * @param x {number}
 * @param y {number}
 * @param width {number}
 * @param height {number}
 */
PIXI.Graphics.prototype.drawElipse = function( x, y, width, height)
{
	if(this.currentPath.points.length == 0)this.graphicsData.pop();
	
	this.currentPath = {lineWidth:this.lineWidth, lineColor:this.lineColor, lineAlpha:this.lineAlpha, 
						fillColor:this.fillColor, fillAlpha:this.fillAlpha, fill:this.filling, 
						points:[x, y, width, height], type:PIXI.Graphics.ELIP};
						
	this.graphicsData.push(this.currentPath);
	this.dirty = true;
}

/**
 * Clears the graphics that were drawn to this Graphics object, and resets fill and line style settings.
 *
 * @method clear
 */
PIXI.Graphics.prototype.clear = function()
{
	this.lineWidth = 0;
	this.filling = false;
	
	this.dirty = true;
	this.clearDirty = true;
	this.graphicsData = [];
}

// SOME TYPES:
PIXI.Graphics.POLY = 0;
PIXI.Graphics.RECT = 1;
PIXI.Graphics.CIRC = 2;
PIXI.Graphics.ELIP = 3;

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */


/**
 * A set of functions used by the canvas renderer to draw the primitive graphics data
 *
 * @class CanvasGraphics
 */
PIXI.CanvasGraphics = function()
{
	
}


/*
 * Renders the graphics object
 *
 * @static
 * @private
 * @method renderGraphics
 * @param graphics {Graphics}
 * @param context {Context2D}
 */
PIXI.CanvasGraphics.renderGraphics = function(graphics, context)
{
	var worldAlpha = graphics.worldAlpha;
	
	for (var i=0; i < graphics.graphicsData.length; i++) 
	{
		var data = graphics.graphicsData[i];
		var points = data.points;
		
		context.strokeStyle = color = '#' + ('00000' + ( data.lineColor | 0).toString(16)).substr(-6);

		context.lineWidth = data.lineWidth;
		
		if(data.type == PIXI.Graphics.POLY)
		{
			context.beginPath();
			
			context.moveTo(points[0], points[1]);
			
			for (var j=1; j < points.length/2; j++)
			{
				context.lineTo(points[j * 2], points[j * 2 + 1]);
			} 
	      	
	      	// if the first and last point are the same close the path - much neater :)
	      	if(points[0] == points[points.length-2] && points[1] == points[points.length-1])
	      	{
	      		context.closePath();
	      	}
			
			if(data.fill)
			{
				context.globalAlpha = data.fillAlpha * worldAlpha;
				context.fillStyle = color = '#' + ('00000' + ( data.fillColor | 0).toString(16)).substr(-6);
      			context.fill();
			}
			if(data.lineWidth)
			{
				context.globalAlpha = data.lineAlpha * worldAlpha;
      			context.stroke();
			}
		}
		else if(data.type == PIXI.Graphics.RECT)
		{
				
			// TODO - need to be Undefined!
			if(data.fillColor)
			{
				context.globalAlpha = data.fillAlpha * worldAlpha;
				context.fillStyle = color = '#' + ('00000' + ( data.fillColor | 0).toString(16)).substr(-6);
				context.fillRect(points[0], points[1], points[2], points[3]);
				
			}
			if(data.lineWidth)
			{
				context.globalAlpha = data.lineAlpha * worldAlpha;
				context.strokeRect(points[0], points[1], points[2], points[3]);
			}
			
		}
		else if(data.type == PIXI.Graphics.CIRC)
		{
			// TODO - need to be Undefined!
      		context.beginPath();
			context.arc(points[0], points[1], points[2],0,2*Math.PI);
			context.closePath();
			
			if(data.fill)
			{
				context.globalAlpha = data.fillAlpha * worldAlpha;
				context.fillStyle = color = '#' + ('00000' + ( data.fillColor | 0).toString(16)).substr(-6);
      			context.fill();
			}
			if(data.lineWidth)
			{
				context.globalAlpha = data.lineAlpha * worldAlpha;
      			context.stroke();
			}
		}
		else if(data.type == PIXI.Graphics.ELIP)
		{
			
			// elipse code taken from: http://stackoverflow.com/questions/2172798/how-to-draw-an-oval-in-html5-canvas
			
			var elipseData =  data.points;
			
			var w = elipseData[2] * 2;
			var h = elipseData[3] * 2;
	
			var x = elipseData[0] - w/2;
			var y = elipseData[1] - h/2;
			
      		context.beginPath();
			
			var kappa = .5522848,
			ox = (w / 2) * kappa, // control point offset horizontal
			oy = (h / 2) * kappa, // control point offset vertical
			xe = x + w,           // x-end
			ye = y + h,           // y-end
			xm = x + w / 2,       // x-middle
			ym = y + h / 2;       // y-middle
			
			context.moveTo(x, ym);
			context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
			context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
			context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
			context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
  
			context.closePath();
			
			if(data.fill)
			{
				context.globalAlpha = data.fillAlpha * worldAlpha;
				context.fillStyle = color = '#' + ('00000' + ( data.fillColor | 0).toString(16)).substr(-6);
      			context.fill();
			}
			if(data.lineWidth)
			{
				context.globalAlpha = data.lineAlpha * worldAlpha;
      			context.stroke();
			}
		}
      	
	};
}

/*
 * Renders a graphics mask
 *
 * @static
 * @private
 * @method renderGraphicsMask
 * @param graphics {Graphics}
 * @param context {Context2D}
 */
PIXI.CanvasGraphics.renderGraphicsMask = function(graphics, context)
{
	var worldAlpha = graphics.worldAlpha;
	
	var len = graphics.graphicsData.length;
	if(len > 1)
	{
		len = 1;
		console.log("Pixi.js warning: masks in canvas can only mask using the first path in the graphics object")
	}
	
	for (var i=0; i < 1; i++) 
	{
		var data = graphics.graphicsData[i];
		var points = data.points;
		
		if(data.type == PIXI.Graphics.POLY)
		{
			context.beginPath();
			context.moveTo(points[0], points[1]);
			
			for (var j=1; j < points.length/2; j++)
			{
				context.lineTo(points[j * 2], points[j * 2 + 1]);
			} 
	      	
	      	// if the first and last point are the same close the path - much neater :)
	      	if(points[0] == points[points.length-2] && points[1] == points[points.length-1])
	      	{
	      		context.closePath();
	      	}
			
		}
		else if(data.type == PIXI.Graphics.RECT)
		{
			context.beginPath();
			context.rect(points[0], points[1], points[2], points[3]);
			context.closePath();
		}
		else if(data.type == PIXI.Graphics.CIRC)
		{
			// TODO - need to be Undefined!
      		context.beginPath();
			context.arc(points[0], points[1], points[2],0,2*Math.PI);
			context.closePath();
		}
		else if(data.type == PIXI.Graphics.ELIP)
		{
			
			// elipse code taken from: http://stackoverflow.com/questions/2172798/how-to-draw-an-oval-in-html5-canvas
			var elipseData =  data.points;
			
			var w = elipseData[2] * 2;
			var h = elipseData[3] * 2;
	
			var x = elipseData[0] - w/2;
			var y = elipseData[1] - h/2;
			
      		context.beginPath();
			
			var kappa = .5522848,
			ox = (w / 2) * kappa, // control point offset horizontal
			oy = (h / 2) * kappa, // control point offset vertical
			xe = x + w,           // x-end
			ye = y + h,           // y-end
			xm = x + w / 2,       // x-middle
			ym = y + h / 2;       // y-middle
			
			context.moveTo(x, ym);
			context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
			context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
			context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
			context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
			context.closePath();
		}
      	
	   
	};
}

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */


/**
 * the CanvasRenderer draws the stage and all its content onto a 2d canvas. This renderer should be used for browsers that do not support webGL.
 * Dont forget to add the view to your DOM or you will not see anything :)
 *
 * @class CanvasRenderer
 * @constructor
 * @param width=0 {number} the width of the canvas view
 * @param height=0 {number} the height of the canvas view
 * @param view {Canvas} the canvas to use as a view, optional
 * @param transparent=false {Boolean} the transparency of the render view, default false
 */
PIXI.CanvasRenderer = function(width, height, view, transparent)
{
	this.transparent = transparent;

	/**
	 * The width of the canvas view
	 *
	 * @property width
	 * @type Number
	 * @default 800
	 */
	this.width = width || 800;

	/**
	 * The height of the canvas view
	 *
	 * @property height
	 * @type Number
	 * @default 600
	 */
	this.height = height || 600;

	/**
	 * The canvas element that the everything is drawn to
	 *
	 * @property view
	 * @type Canvas
	 */
	this.view = view || document.createElement( 'canvas' );

	/**
	 * The canvas context that the everything is drawn to
	 * @property context
	 * @type Canvas 2d Context
	 */
	this.context = this.view.getContext("2d");

	this.refresh = true;
	// hack to enable some hardware acceleration!
	//this.view.style["transform"] = "translatez(0)";
	
    this.view.width = this.width;
	this.view.height = this.height;  
	this.count = 0;
}

// constructor
PIXI.CanvasRenderer.prototype.constructor = PIXI.CanvasRenderer;

/**
 * Renders the stage to its canvas view
 *
 * @method render
 * @param stage {Stage} the Stage element to be rendered
 */
PIXI.CanvasRenderer.prototype.render = function(stage)
{
	
	//stage.__childrenAdded = [];
	//stage.__childrenRemoved = [];
	
	// update textures if need be
	PIXI.texturesToUpdate = [];
	PIXI.texturesToDestroy = [];
	
	PIXI.visibleCount++;
	stage.updateTransform();
	
	// update the background color
	if(this.view.style.backgroundColor!=stage.backgroundColorString && !this.transparent)this.view.style.backgroundColor = stage.backgroundColorString;

	this.context.setTransform(1,0,0,1,0,0); 
	this.context.clearRect(0, 0, this.width, this.height)
    this.renderDisplayObject(stage);
    //as
   
    // run interaction!
	if(stage.interactive)
	{
		//need to add some events!
		if(!stage._interactiveEventsAdded)
		{
			stage._interactiveEventsAdded = true;
			stage.interactionManager.setTarget(this);
		}
	}
	
	// remove frame updates..
	if(PIXI.Texture.frameUpdates.length > 0)
	{
		PIXI.Texture.frameUpdates = [];
	}
	
	
}

/**
 * resizes the canvas view to the specified width and height
 *
 * @method resize
 * @param width {number} the new width of the canvas view
 * @param height {number} the new height of the canvas view
 */
PIXI.CanvasRenderer.prototype.resize = function(width, height)
{
	this.width = width;
	this.height = height;
	
	this.view.width = width;
	this.view.height = height;
}

/**
 * Renders a display object
 *
 * @method renderDisplayObject
 * @param displayObject {DisplayObject} The displayObject to render
 * @private
 */
PIXI.CanvasRenderer.prototype.renderDisplayObject = function(displayObject)
{
	// no loger recurrsive!
	var transform;
	var context = this.context;
	
	context.globalCompositeOperation = 'source-over';
	
	// one the display object hits this. we can break the loop	
	var testObject = displayObject.last._iNext;
	displayObject = displayObject.first;
	
	do	
	{
		transform = displayObject.worldTransform;
		
		if(!displayObject.visible)
		{
			displayObject = displayObject.last._iNext;
			continue;
		}
		
		if(!displayObject.renderable)
		{
			displayObject = displayObject._iNext;
			continue;
		}
		
		if(displayObject instanceof PIXI.Sprite)
		{
			var frame = displayObject.texture.frame;
			
			if(frame)
			{
				context.globalAlpha = displayObject.worldAlpha;
				
				context.setTransform(transform[0], transform[3], transform[1], transform[4], transform[2], transform[5]);
					
				context.drawImage(displayObject.texture.baseTexture.source, 
								   frame.x,
								   frame.y,
								   frame.width,
								   frame.height,
								   (displayObject.anchor.x) * -frame.width, 
								   (displayObject.anchor.y) * -frame.height,
								   frame.width,
								   frame.height);
			}					   
	   	}
	   	else if(displayObject instanceof PIXI.Strip)
		{
			context.setTransform(transform[0], transform[3], transform[1], transform[4], transform[2], transform[5])
			this.renderStrip(displayObject);
		}
		else if(displayObject instanceof PIXI.TilingSprite)
		{
			context.setTransform(transform[0], transform[3], transform[1], transform[4], transform[2], transform[5])
			this.renderTilingSprite(displayObject);
		}
		else if(displayObject instanceof PIXI.CustomRenderable)
		{
			displayObject.renderCanvas(this);
		}
		else if(displayObject instanceof PIXI.Graphics)
		{
			context.setTransform(transform[0], transform[3], transform[1], transform[4], transform[2], transform[5])
			PIXI.CanvasGraphics.renderGraphics(displayObject, context);
		}
		else if(displayObject instanceof PIXI.FilterBlock)
		{
			if(displayObject.open)
			{
				context.save();
				
				var cacheAlpha = displayObject.mask.alpha;
				var maskTransform = displayObject.mask.worldTransform;
				
				context.setTransform(maskTransform[0], maskTransform[3], maskTransform[1], maskTransform[4], maskTransform[2], maskTransform[5])
				
				displayObject.mask.worldAlpha = 0.5;
				
				context.worldAlpha = 0;
				
				PIXI.CanvasGraphics.renderGraphicsMask(displayObject.mask, context);
				context.clip();
				
				displayObject.mask.worldAlpha = cacheAlpha;
			}
			else
			{
				context.restore();
			}
		}
	//	count++
		displayObject = displayObject._iNext;
		
		
	}
	while(displayObject != testObject)

	
}

/**
 * Renders a flat strip
 *
 * @method renderStripFlat
 * @param strip {Strip} The Strip to render
 * @private
 */
PIXI.CanvasRenderer.prototype.renderStripFlat = function(strip)
{
	var context = this.context;
	var verticies = strip.verticies;
	var uvs = strip.uvs;
	
	var length = verticies.length/2;
	this.count++;
	
	context.beginPath();
	for (var i=1; i < length-2; i++) 
	{
		
		// draw some triangles!
		var index = i*2;
		
		 var x0 = verticies[index],   x1 = verticies[index+2], x2 = verticies[index+4];
 		 var y0 = verticies[index+1], y1 = verticies[index+3], y2 = verticies[index+5];
 		 
		context.moveTo(x0, y0);
		context.lineTo(x1, y1);
		context.lineTo(x2, y2);
		
	};	
	
	context.fillStyle = "#FF0000";
	context.fill();
	context.closePath();
}

/**
 * Renders a tiling sprite
 *
 * @method renderTilingSprite
 * @param sprite {TilingSprite} The tilingsprite to render
 * @private
 */
PIXI.CanvasRenderer.prototype.renderTilingSprite = function(sprite)
{
	var context = this.context;
	
	context.globalAlpha = sprite.worldAlpha;
	
 	if(!sprite.__tilePattern) sprite.__tilePattern = context.createPattern(sprite.texture.baseTexture.source, "repeat");
 	
	context.beginPath();
	
	var tilePosition = sprite.tilePosition;
	var tileScale = sprite.tileScale;
	
    // offset
    context.scale(tileScale.x,tileScale.y);
    context.translate(tilePosition.x, tilePosition.y);
 	
	context.fillStyle = sprite.__tilePattern;
	context.fillRect(-tilePosition.x,-tilePosition.y,sprite.width / tileScale.x, sprite.height / tileScale.y);
	
	context.scale(1/tileScale.x, 1/tileScale.y);
    context.translate(-tilePosition.x, -tilePosition.y);
    
    context.closePath();
}

/**
 * Renders a strip
 *
 * @method renderStrip
 * @param strip {Strip} The Strip to render
 * @private
 */
PIXI.CanvasRenderer.prototype.renderStrip = function(strip)
{
	var context = this.context;

	// draw triangles!!
	var verticies = strip.verticies;
	var uvs = strip.uvs;
	
	var length = verticies.length/2;
	this.count++;
	for (var i=1; i < length-2; i++) 
	{
		
		// draw some triangles!
		var index = i*2;
		
		 var x0 = verticies[index],   x1 = verticies[index+2], x2 = verticies[index+4];
 		 var y0 = verticies[index+1], y1 = verticies[index+3], y2 = verticies[index+5];
 		 
  		 var u0 = uvs[index] * strip.texture.width,   u1 = uvs[index+2] * strip.texture.width, u2 = uvs[index+4]* strip.texture.width;
   		 var v0 = uvs[index+1]* strip.texture.height, v1 = uvs[index+3] * strip.texture.height, v2 = uvs[index+5]* strip.texture.height;


		context.save();
		context.beginPath();
		context.moveTo(x0, y0);
		context.lineTo(x1, y1);
		context.lineTo(x2, y2);
		context.closePath();
		
		context.clip();
		
		
        // Compute matrix transform
        var delta = u0*v1 + v0*u2 + u1*v2 - v1*u2 - v0*u1 - u0*v2;
        var delta_a = x0*v1 + v0*x2 + x1*v2 - v1*x2 - v0*x1 - x0*v2;
        var delta_b = u0*x1 + x0*u2 + u1*x2 - x1*u2 - x0*u1 - u0*x2;
        var delta_c = u0*v1*x2 + v0*x1*u2 + x0*u1*v2 - x0*v1*u2 - v0*u1*x2 - u0*x1*v2;
        var delta_d = y0*v1 + v0*y2 + y1*v2 - v1*y2 - v0*y1 - y0*v2;
        var delta_e = u0*y1 + y0*u2 + u1*y2 - y1*u2 - y0*u1 - u0*y2;
        var delta_f = u0*v1*y2 + v0*y1*u2 + y0*u1*v2 - y0*v1*u2 - v0*u1*y2 - u0*y1*v2;
		
		
		
		    
        context.transform(delta_a/delta, delta_d/delta,
                      delta_b/delta, delta_e/delta,
                      delta_c/delta, delta_f/delta);
                 
		context.drawImage(strip.texture.baseTexture.source, 0, 0);
	  	context.restore();
	};
	
}

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

PIXI._batchs = [];

/**
 * @private
 */
PIXI._getBatch = function(gl)
{
	if(PIXI._batchs.length == 0)
	{
		return new PIXI.WebGLBatch(gl);
	}
	else
	{
		return PIXI._batchs.pop();
	}
}

/**
 * @private
 */
PIXI._returnBatch = function(batch)
{
	batch.clean();	
	PIXI._batchs.push(batch);
}

/**
 * @private
 */
PIXI._restoreBatchs = function(gl)
{
	for (var i=0; i < PIXI._batchs.length; i++) 
	{
	  PIXI._batchs[i].restoreLostContext(gl);
	};
}

/**
 * A WebGLBatch Enables a group of sprites to be drawn using the same settings.
 * if a group of sprites all have the same baseTexture and blendMode then they can be grouped into a batch.
 * All the sprites in a batch can then be drawn in one go by the GPU which is hugely efficient. ALL sprites
 * in the webGL renderer are added to a batch even if the batch only contains one sprite. Batching is handled
 * automatically by the webGL renderer. A good tip is: the smaller the number of batchs there are, the faster
 * the webGL renderer will run.
 *
 * @class WebGLBatch
 * @constructor
 * @param gl {WebGLContext} an instance of the webGL context
 */
PIXI.WebGLBatch = function(gl)
{
	this.gl = gl;
	
	this.size = 0;

	this.vertexBuffer =  gl.createBuffer();
	this.indexBuffer =  gl.createBuffer();
	this.uvBuffer =  gl.createBuffer();
	this.colorBuffer =  gl.createBuffer();
	this.blendMode = PIXI.blendModes.NORMAL;
	this.dynamicSize = 1;
}

// constructor
PIXI.WebGLBatch.prototype.constructor = PIXI.WebGLBatch;

/**
 * Cleans the batch so that is can be returned to an object pool and reused
 *
 * @method clean
 */
PIXI.WebGLBatch.prototype.clean = function()
{
	this.verticies = [];
	this.uvs = [];
	this.indices = [];
	this.colors = [];
	this.dynamicSize = 1;
	this.texture = null;
	this.last = null;
	this.size = 0;
	this.head;
	this.tail;
}

/**
 * Recreates the buffers in the event of a context loss
 *
 * @method restoreLostContext
 * @param gl {WebGLContext}
 */
PIXI.WebGLBatch.prototype.restoreLostContext = function(gl)
{
	this.gl = gl;
	this.vertexBuffer =  gl.createBuffer();
	this.indexBuffer =  gl.createBuffer();
	this.uvBuffer =  gl.createBuffer();
	this.colorBuffer =  gl.createBuffer();
}

/**
 * inits the batch's texture and blend mode based if the supplied sprite
 *
 * @method init
 * @param sprite {Sprite} the first sprite to be added to the batch. Only sprites with
 *		the same base texture and blend mode will be allowed to be added to this batch
 */	
PIXI.WebGLBatch.prototype.init = function(sprite)
{
	sprite.batch = this;
	this.dirty = true;
	this.blendMode = sprite.blendMode;
	this.texture = sprite.texture.baseTexture;
	this.head = sprite;
	this.tail = sprite;
	this.size = 1;

	this.growBatch();
}

/**
 * inserts a sprite before the specified sprite
 *
 * @method insertBefore
 * @param sprite {Sprite} the sprite to be added
 * @param nextSprite {nextSprite} the first sprite will be inserted before this sprite
 */	
PIXI.WebGLBatch.prototype.insertBefore = function(sprite, nextSprite)
{
	this.size++;

	sprite.batch = this;
	this.dirty = true;
	var tempPrev = nextSprite.__prev;
	nextSprite.__prev = sprite;
	sprite.__next = nextSprite;

	if(tempPrev)
	{
		sprite.__prev = tempPrev;
		tempPrev.__next = sprite;
	}
	else
	{
		this.head = sprite;
	}
}

/**
 * inserts a sprite after the specified sprite
 *
 * @method insertAfter
 * @param sprite {Sprite} the sprite to be added
 * @param  previousSprite {Sprite} the first sprite will be inserted after this sprite
 */	
PIXI.WebGLBatch.prototype.insertAfter = function(sprite, previousSprite)
{
	this.size++;

	sprite.batch = this;
	this.dirty = true;

	var tempNext = previousSprite.__next;
	previousSprite.__next = sprite;
	sprite.__prev = previousSprite;

	if(tempNext)
	{
		sprite.__next = tempNext;
		tempNext.__prev = sprite;
	}
	else
	{
		this.tail = sprite
	}
}

/**
 * removes a sprite from the batch
 *
 * @method remove
 * @param sprite {Sprite} the sprite to be removed
 */	
PIXI.WebGLBatch.prototype.remove = function(sprite)
{
	this.size--;

	if(this.size == 0)
	{
		sprite.batch = null;
		sprite.__prev = null;
		sprite.__next = null;
		return;
	}

	if(sprite.__prev)
	{
		sprite.__prev.__next = sprite.__next;
	}
	else
	{
		this.head = sprite.__next;
		this.head.__prev = null;
	}

	if(sprite.__next)
	{
		sprite.__next.__prev = sprite.__prev;
	}
	else
	{
		this.tail = sprite.__prev;
		this.tail.__next = null
	}

	sprite.batch = null;
	sprite.__next = null;
	sprite.__prev = null;
	this.dirty = true;
}

/**
 * Splits the batch into two with the specified sprite being the start of the new batch.
 *
 * @method split
 * @param sprite {Sprite} the sprite that indicates where the batch should be split
 * @return {WebGLBatch} the new batch
 */
PIXI.WebGLBatch.prototype.split = function(sprite)
{
	this.dirty = true;

	var batch = new PIXI.WebGLBatch(this.gl);
	batch.init(sprite);
	batch.texture = this.texture;
	batch.tail = this.tail;

	this.tail = sprite.__prev;
	this.tail.__next = null;

	sprite.__prev = null;
	// return a splite batch!

	// TODO this size is wrong!
	// need to recalculate :/ problem with a linked list!
	// unless it gets calculated in the "clean"?

	// need to loop through items as there is no way to know the length on a linked list :/
	var tempSize = 0;
	while(sprite)
	{
		tempSize++;
		sprite.batch = batch;
		sprite = sprite.__next;
	}

	batch.size = tempSize;
	this.size -= tempSize;

	return batch;
}

/**
 * Merges two batchs together
 *
 * @method merge
 * @param batch {WebGLBatch} the batch that will be merged 
 */
PIXI.WebGLBatch.prototype.merge = function(batch)
{
	this.dirty = true;

	this.tail.__next = batch.head;
	batch.head.__prev = this.tail;

	this.size += batch.size;

	this.tail = batch.tail;

	var sprite = batch.head;
	while(sprite)
	{
		sprite.batch = this;
		sprite = sprite.__next;
	}
}

/**
 * Grows the size of the batch. As the elements in the batch cannot have a dynamic size this
 * function is used to increase the size of the batch. It also creates a little extra room so
 * that the batch does not need to be resized every time a sprite is added
 *
 * @method growBatch
 */
PIXI.WebGLBatch.prototype.growBatch = function()
{
	var gl = this.gl;
	if( this.size == 1)
	{
		this.dynamicSize = 1;
	}
	else
	{
		this.dynamicSize = this.size * 1.5
	}
	// grow verts
	this.verticies = new Float32Array(this.dynamicSize * 8);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER,this.verticies , gl.DYNAMIC_DRAW);

	this.uvs  = new Float32Array( this.dynamicSize * 8 );
	gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, this.uvs , gl.DYNAMIC_DRAW);

	this.dirtyUVS = true;

	this.colors  = new Float32Array( this.dynamicSize * 4 );
	gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, this.colors , gl.DYNAMIC_DRAW);

	this.dirtyColors = true;

	this.indices = new Uint16Array(this.dynamicSize * 6); 
	var length = this.indices.length/6;

	for (var i=0; i < length; i++) 
	{
	    var index2 = i * 6;
	    var index3 = i * 4;
		this.indices[index2 + 0] = index3 + 0;
		this.indices[index2 + 1] = index3 + 1;
		this.indices[index2 + 2] = index3 + 2;
		this.indices[index2 + 3] = index3 + 0;
		this.indices[index2 + 4] = index3 + 2;
		this.indices[index2 + 5] = index3 + 3;
	};

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
}

/**
 * Refresh's all the data in the batch and sync's it with the webGL buffers
 *
 * @method refresh
 */
PIXI.WebGLBatch.prototype.refresh = function()
{
	var gl = this.gl;

	if (this.dynamicSize < this.size)
	{
		this.growBatch();
	}

	var indexRun = 0;
	var worldTransform, width, height, aX, aY, w0, w1, h0, h1, index;
	var a, b, c, d, tx, ty;

	var displayObject = this.head;

	while(displayObject)
	{
		index = indexRun * 8;

		var texture = displayObject.texture;

		var frame = texture.frame;
		var tw = texture.baseTexture.width;
		var th = texture.baseTexture.height;

		this.uvs[index + 0] = frame.x / tw;
		this.uvs[index +1] = frame.y / th;

		this.uvs[index +2] = (frame.x + frame.width) / tw;
		this.uvs[index +3] = frame.y / th;

		this.uvs[index +4] = (frame.x + frame.width) / tw;
		this.uvs[index +5] = (frame.y + frame.height) / th; 

		this.uvs[index +6] = frame.x / tw;
		this.uvs[index +7] = (frame.y + frame.height) / th;

		displayObject.updateFrame = false;

		colorIndex = indexRun * 4;
		this.colors[colorIndex] = this.colors[colorIndex + 1] = this.colors[colorIndex + 2] = this.colors[colorIndex + 3] = displayObject.worldAlpha;

		displayObject = displayObject.__next;

		indexRun ++;
	}

	this.dirtyUVS = true;
	this.dirtyColors = true;
}

/**
 * Updates all the relevant geometry and uploads the data to the GPU
 *
 * @method update
 */
PIXI.WebGLBatch.prototype.update = function()
{
	var gl = this.gl;
	var worldTransform, width, height, aX, aY, w0, w1, h0, h1, index, index2, index3

	var a, b, c, d, tx, ty;

	var indexRun = 0;

	var displayObject = this.head;

	while(displayObject)
	{
		if(displayObject.vcount === PIXI.visibleCount)
		{
			width = displayObject.texture.frame.width;
			height = displayObject.texture.frame.height;

			// TODO trim??
			aX = displayObject.anchor.x;// - displayObject.texture.trim.x
			aY = displayObject.anchor.y; //- displayObject.texture.trim.y
			w0 = width * (1-aX);
			w1 = width * -aX;

			h0 = height * (1-aY);
			h1 = height * -aY;

			index = indexRun * 8;

			worldTransform = displayObject.worldTransform;

			a = worldTransform[0];
			b = worldTransform[3];
			c = worldTransform[1];
			d = worldTransform[4];
			tx = worldTransform[2];
			ty = worldTransform[5];

			this.verticies[index + 0 ] = a * w1 + c * h1 + tx; 
			this.verticies[index + 1 ] = d * h1 + b * w1 + ty;

			this.verticies[index + 2 ] = a * w0 + c * h1 + tx; 
			this.verticies[index + 3 ] = d * h1 + b * w0 + ty; 

			this.verticies[index + 4 ] = a * w0 + c * h0 + tx; 
			this.verticies[index + 5 ] = d * h0 + b * w0 + ty; 

			this.verticies[index + 6] =  a * w1 + c * h0 + tx; 
			this.verticies[index + 7] =  d * h0 + b * w1 + ty; 

			if(displayObject.updateFrame || displayObject.texture.updateFrame)
			{
				this.dirtyUVS = true;

				var texture = displayObject.texture;

				var frame = texture.frame;
				var tw = texture.baseTexture.width;
				var th = texture.baseTexture.height;

				this.uvs[index + 0] = frame.x / tw;
				this.uvs[index +1] = frame.y / th;

				this.uvs[index +2] = (frame.x + frame.width) / tw;
				this.uvs[index +3] = frame.y / th;

				this.uvs[index +4] = (frame.x + frame.width) / tw;
				this.uvs[index +5] = (frame.y + frame.height) / th; 

				this.uvs[index +6] = frame.x / tw;
				this.uvs[index +7] = (frame.y + frame.height) / th;

				displayObject.updateFrame = false;
			}

			// TODO this probably could do with some optimisation....
			if(displayObject.cacheAlpha != displayObject.worldAlpha)
			{
				displayObject.cacheAlpha = displayObject.worldAlpha;

				var colorIndex = indexRun * 4;
				this.colors[colorIndex] = this.colors[colorIndex + 1] = this.colors[colorIndex + 2] = this.colors[colorIndex + 3] = displayObject.worldAlpha;
				this.dirtyColors = true;
			}
		}
		else
		{
			index = indexRun * 8;

			this.verticies[index + 0 ] = 0;
			this.verticies[index + 1 ] = 0;

			this.verticies[index + 2 ] = 0;
			this.verticies[index + 3 ] = 0;

			this.verticies[index + 4 ] = 0;
			this.verticies[index + 5 ] = 0;

			this.verticies[index + 6] = 0;
			this.verticies[index + 7] = 0;
		}

		indexRun++;
		displayObject = displayObject.__next;
   }
}

/**
 * Draws the batch to the frame buffer
 *
 * @method render
 */
PIXI.WebGLBatch.prototype.render = function(start, end)
{
	start = start || 0;

	if(end == undefined)end = this.size;
	
	if(this.dirty)
	{
		this.refresh();
		this.dirty = false;
	}

	if (this.size == 0)return;

	this.update();
	var gl = this.gl;

	//TODO optimize this!

	var shaderProgram = PIXI.shaderProgram;
	gl.useProgram(shaderProgram);

	// update the verts..
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	// ok..
	gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.verticies)
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);
	// update the uvs
   	gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);

    if(this.dirtyUVS)
    {
    	this.dirtyUVS = false;
    	gl.bufferSubData(gl.ARRAY_BUFFER,  0, this.uvs);
    }

    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture._glTexture);

	// update color!
	gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);

	if(this.dirtyColors)
    {
    	this.dirtyColors = false;
    	gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.colors);
	}

    gl.vertexAttribPointer(shaderProgram.colorAttribute, 1, gl.FLOAT, false, 0, 0);

	// dont need to upload!
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

	var len = end - start;

    // DRAW THAT this!
    gl.drawElements(gl.TRIANGLES, len * 6, gl.UNSIGNED_SHORT, start * 2 * 6 );
}

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * A set of functions used by the webGL renderer to draw the primitive graphics data
 *
 * @class CanvasGraphics
 */
PIXI.WebGLGraphics = function()
{
	
}

/**
 * Renders the graphics object
 *
 * @static
 * @private
 * @method renderGraphics
 * @param graphics {Graphics}
 * @param projection {Object}
 */
PIXI.WebGLGraphics.renderGraphics = function(graphics, projection)
{
	var gl = PIXI.gl;
	
	if(!graphics._webGL)graphics._webGL = {points:[], indices:[], lastIndex:0, 
										   buffer:gl.createBuffer(),
										   indexBuffer:gl.createBuffer()};
	
	if(graphics.dirty)
	{
		graphics.dirty = false;
		
		if(graphics.clearDirty)
		{
			graphics.clearDirty = false;
			
			graphics._webGL.lastIndex = 0;
			graphics._webGL.points = [];
			graphics._webGL.indices = [];
			
		}
		
		PIXI.WebGLGraphics.updateGraphics(graphics);
	}
	
	
	PIXI.activatePrimitiveShader();
	
	// This  could be speeded up fo sure!
	var m = PIXI.mat3.clone(graphics.worldTransform);
	
	PIXI.mat3.transpose(m);
	
	// set the matrix transform for the 
 	gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
 	
 	gl.uniformMatrix3fv(PIXI.primitiveProgram.translationMatrix, false, m);
 	
	gl.uniform2f(PIXI.primitiveProgram.projectionVector, projection.x, projection.y);
	
	gl.uniform1f(PIXI.primitiveProgram.alpha, graphics.worldAlpha);

	gl.bindBuffer(gl.ARRAY_BUFFER, graphics._webGL.buffer);
	
	// WHY DOES THIS LINE NEED TO BE THERE???
	gl.vertexAttribPointer(PIXI.shaderProgram.vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);
	// its not even used.. but need to be set or it breaks?
	// only on pc though..
	
	gl.vertexAttribPointer(PIXI.primitiveProgram.vertexPositionAttribute, 2, gl.FLOAT, false, 4 * 6, 0);
	gl.vertexAttribPointer(PIXI.primitiveProgram.colorAttribute, 4, gl.FLOAT, false,4 * 6, 2 * 4);
	
	// set the index buffer!
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, graphics._webGL.indexBuffer);
	
	gl.drawElements(gl.TRIANGLE_STRIP,  graphics._webGL.indices.length, gl.UNSIGNED_SHORT, 0 );
	
	// return to default shader...
	PIXI.activateDefaultShader();
}

/**
 * Updates the graphics object
 *
 * @static
 * @private
 * @method updateGraphics
 * @param graphics {Graphics}
 */
PIXI.WebGLGraphics.updateGraphics = function(graphics)
{
	for (var i=graphics._webGL.lastIndex; i < graphics.graphicsData.length; i++) 
	{
		var data = graphics.graphicsData[i];
		
		if(data.type == PIXI.Graphics.POLY)
		{
			if(data.fill)
			{
				if(data.points.length>3) 
				PIXI.WebGLGraphics.buildPoly(data, graphics._webGL);
			}
			
			if(data.lineWidth > 0)
			{
				PIXI.WebGLGraphics.buildLine(data, graphics._webGL);
			}
		}
		else if(data.type == PIXI.Graphics.RECT)
		{
			PIXI.WebGLGraphics.buildRectangle(data, graphics._webGL);
		}
		else if(data.type == PIXI.Graphics.CIRC || data.type == PIXI.Graphics.ELIP)
		{
			PIXI.WebGLGraphics.buildCircle(data, graphics._webGL);
		}
	};
	
	graphics._webGL.lastIndex = graphics.graphicsData.length;
	
	var gl = PIXI.gl;

	graphics._webGL.glPoints = new Float32Array(graphics._webGL.points);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, graphics._webGL.buffer);
	gl.bufferData(gl.ARRAY_BUFFER, graphics._webGL.glPoints, gl.STATIC_DRAW);
	
	graphics._webGL.glIndicies = new Uint16Array(graphics._webGL.indices);
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, graphics._webGL.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, graphics._webGL.glIndicies, gl.STATIC_DRAW);
}

/**
 * Builds a rectangle to draw
 *
 * @static
 * @private
 * @method buildRectangle
 * @param graphics {Graphics}
 * @param webGLData {Object}
 */
PIXI.WebGLGraphics.buildRectangle = function(graphicsData, webGLData)
{
	// --- //
	// need to convert points to a nice regular data
	// 
	var rectData = graphicsData.points;
	var x = rectData[0];
	var y = rectData[1];
	var width = rectData[2];
	var height = rectData[3];
	
	
	if(graphicsData.fill)
	{
		var color = HEXtoRGB(graphicsData.fillColor);
		var alpha = graphicsData.fillAlpha;
		
		var r = color[0] * alpha;
		var g = color[1] * alpha;
		var b = color[2] * alpha;
	
		var verts = webGLData.points;
		var indices = webGLData.indices;
	
		var vertPos = verts.length/6;
		
		// start
		verts.push(x, y);
		verts.push(r, g, b, alpha);
		
		verts.push(x + width, y);
		verts.push(r, g, b, alpha);
		
		verts.push(x , y + height);
		verts.push(r, g, b, alpha);
		
		verts.push(x + width, y + height);
		verts.push(r, g, b, alpha);
		
		// insert 2 dead triangles..
		indices.push(vertPos, vertPos, vertPos+1, vertPos+2, vertPos+3, vertPos+3)
	}
	
	if(graphicsData.lineWidth)
	{
		graphicsData.points = [x, y,
				  x + width, y,
				  x + width, y + height,
				  x, y + height,
				  x, y];
	
		PIXI.WebGLGraphics.buildLine(graphicsData, webGLData);
	}
	
}

/**
 * Builds a circle to draw
 *
 * @static
 * @private
 * @method buildCircle
 * @param graphics {Graphics}
 * @param webGLData {Object}
 */
PIXI.WebGLGraphics.buildCircle = function(graphicsData, webGLData)
{
	// --- //
	// need to convert points to a nice regular data
	// 
	var rectData = graphicsData.points;
	var x = rectData[0];
	var y = rectData[1];
	var width = rectData[2];
	var height = rectData[3];
	
	var totalSegs = 40;
	var seg = (Math.PI * 2) / totalSegs ;
		
	if(graphicsData.fill)
	{
		var color = HEXtoRGB(graphicsData.fillColor);
		var alpha = graphicsData.fillAlpha;

		var r = color[0] * alpha;
		var g = color[1] * alpha;
		var b = color[2] * alpha;
	
		var verts = webGLData.points;
		var indices = webGLData.indices;
	
		var vecPos = verts.length/6;
		
		indices.push(vecPos);
		
		for (var i=0; i < totalSegs + 1 ; i++) 
		{
			verts.push(x,y, r, g, b, alpha);
			
			verts.push(x + Math.sin(seg * i) * width,
					   y + Math.cos(seg * i) * height,
					   r, g, b, alpha);
		
			indices.push(vecPos++, vecPos++);
		};
		
		indices.push(vecPos-1);
	}
	
	if(graphicsData.lineWidth)
	{
		graphicsData.points = [];
		
		for (var i=0; i < totalSegs + 1; i++) 
		{
			graphicsData.points.push(x + Math.sin(seg * i) * width,
									 y + Math.cos(seg * i) * height)
		};
		
		PIXI.WebGLGraphics.buildLine(graphicsData, webGLData);
	}
	
}

/**
 * Builds a line to draw
 *
 * @static
 * @private
 * @method buildLine
 * @param graphics {Graphics}
 * @param webGLData {Object}
 */
PIXI.WebGLGraphics.buildLine = function(graphicsData, webGLData)
{
	// TODO OPTIMISE!
	
	var wrap = true;
	var points = graphicsData.points;
	if(points.length == 0)return;
	
	// get first and last point.. figure out the middle!
	var firstPoint = new PIXI.Point( points[0], points[1] );
	var lastPoint = new PIXI.Point( points[points.length - 2], points[points.length - 1] );
	
	// if the first point is the last point - goona have issues :)
	if(firstPoint.x == lastPoint.x && firstPoint.y == lastPoint.y)
	{
		points.pop();
		points.pop();
		
		lastPoint = new PIXI.Point( points[points.length - 2], points[points.length - 1] );
		
		var midPointX = lastPoint.x + (firstPoint.x - lastPoint.x) *0.5;
		var midPointY = lastPoint.y + (firstPoint.y - lastPoint.y) *0.5;
		
		points.unshift(midPointX, midPointY);
		points.push(midPointX, midPointY)
	}
	
	var verts = webGLData.points;
	var indices = webGLData.indices;
	var length = points.length / 2;
	var indexCount = points.length;
	var indexStart = verts.length/6;
	
	// DRAW the Line
	var width = graphicsData.lineWidth / 2;
	
	// sort color
	var color = HEXtoRGB(graphicsData.lineColor);
	var alpha = graphicsData.lineAlpha;
	var r = color[0] * alpha;
	var g = color[1] * alpha;
	var b = color[2] * alpha;
	
	var p1x, p1y, p2x, p2y, p3x, p3y;
	var perpx, perpy, perp2x, perp2y, perp3x, perp3y;
	var ipx, ipy;
	var a1, b1, c1, a2, b2, c2;
	var denom, pdist, dist;
	
	p1x = points[0];
	p1y = points[1];
	
	p2x = points[2];
	p2y = points[3];
	
	perpx = -(p1y - p2y);
	perpy =  p1x - p2x;
	
	dist = Math.sqrt(perpx*perpx + perpy*perpy);
	
	perpx /= dist;
	perpy /= dist;
	perpx *= width;
	perpy *= width;
	
	// start
	verts.push(p1x - perpx , p1y - perpy,
				r, g, b, alpha);
	
	verts.push(p1x + perpx , p1y + perpy,
				r, g, b, alpha);
	
	for (var i = 1; i < length-1; i++) 
	{
		p1x = points[(i-1)*2];
		p1y = points[(i-1)*2 + 1];
		
		p2x = points[(i)*2]
		p2y = points[(i)*2 + 1]
		
		p3x = points[(i+1)*2];
		p3y = points[(i+1)*2 + 1];
		
		perpx = -(p1y - p2y);
		perpy = p1x - p2x;
		
		dist = Math.sqrt(perpx*perpx + perpy*perpy);
		perpx /= dist;
		perpy /= dist;
		perpx *= width;
		perpy *= width;

		perp2x = -(p2y - p3y);
		perp2y = p2x - p3x;
		
		dist = Math.sqrt(perp2x*perp2x + perp2y*perp2y);
		perp2x /= dist;
		perp2y /= dist;
		perp2x *= width;
		perp2y *= width;
		
		a1 = (-perpy + p1y) - (-perpy + p2y);
	    b1 = (-perpx + p2x) - (-perpx + p1x);
	    c1 = (-perpx + p1x) * (-perpy + p2y) - (-perpx + p2x) * (-perpy + p1y);
	    a2 = (-perp2y + p3y) - (-perp2y + p2y);
	    b2 = (-perp2x + p2x) - (-perp2x + p3x);
	    c2 = (-perp2x + p3x) * (-perp2y + p2y) - (-perp2x + p2x) * (-perp2y + p3y);
	 
	    denom = a1*b2 - a2*b1;
	    
	    if (denom == 0) {
	    	denom+=1;
	    }
	    
	    px = (b1*c2 - b2*c1)/denom;
	    py = (a2*c1 - a1*c2)/denom;
		
		pdist = (px -p2x) * (px -p2x) + (py -p2y) + (py -p2y);
		
		if(pdist > 140 * 140)
		{
			perp3x = perpx - perp2x;
			perp3y = perpy - perp2y;
			
			dist = Math.sqrt(perp3x*perp3x + perp3y*perp3y);
			perp3x /= dist;
			perp3y /= dist;
			perp3x *= width;
			perp3y *= width;
			
			verts.push(p2x - perp3x, p2y -perp3y);
			verts.push(r, g, b, alpha);
			
			verts.push(p2x + perp3x, p2y +perp3y);
			verts.push(r, g, b, alpha);
			
			verts.push(p2x - perp3x, p2y -perp3y);
			verts.push(r, g, b, alpha);
			
			indexCount++;
		}
		else
		{
			verts.push(px , py);
			verts.push(r, g, b, alpha);
			
			verts.push(p2x - (px-p2x), p2y - (py - p2y));
			verts.push(r, g, b, alpha);
		}
	}
	
	p1x = points[(length-2)*2]
	p1y = points[(length-2)*2 + 1] 
	
	p2x = points[(length-1)*2]
	p2y = points[(length-1)*2 + 1]
	
	perpx = -(p1y - p2y)
	perpy = p1x - p2x;
	
	dist = Math.sqrt(perpx*perpx + perpy*perpy);
	perpx /= dist;
	perpy /= dist;
	perpx *= width;
	perpy *= width;
	
	verts.push(p2x - perpx , p2y - perpy)
	verts.push(r, g, b, alpha);
	
	verts.push(p2x + perpx , p2y + perpy)
	verts.push(r, g, b, alpha);
	
	indices.push(indexStart);
	
	for (var i=0; i < indexCount; i++) 
	{
		indices.push(indexStart++);
	};
	
	indices.push(indexStart-1);
}

/**
 * Builds a polygon to draw
 *
 * @static
 * @private
 * @method buildPoly
 * @param graphics {Graphics}
 * @param webGLData {Object}
 */
PIXI.WebGLGraphics.buildPoly = function(graphicsData, webGLData)
{
	var points = graphicsData.points;
	if(points.length < 6)return;
	
	// get first and last point.. figure out the middle!
	var verts = webGLData.points;
	var indices = webGLData.indices;
	
	var length = points.length / 2;
	
	// sort color
	var color = HEXtoRGB(graphicsData.fillColor);
	var alpha = graphicsData.fillAlpha;
	var r = color[0] * alpha;
	var g = color[1] * alpha;
	var b = color[2] * alpha;
	
	var triangles = PIXI.PolyK.Triangulate(points);
	
	var vertPos = verts.length / 6;
	
	for (var i=0; i < triangles.length; i+=3) 
	{
		indices.push(triangles[i] + vertPos);
		indices.push(triangles[i] + vertPos);
		indices.push(triangles[i+1] + vertPos);
		indices.push(triangles[i+2] +vertPos);
		indices.push(triangles[i+2] + vertPos);
	};
	
	for (var i = 0; i < length; i++) 
	{
		verts.push(points[i * 2], points[i * 2 + 1],
				   r, g, b, alpha);
	};
}

function HEXtoRGB(hex) {
	return [(hex >> 16 & 0xFF) / 255, ( hex >> 8 & 0xFF) / 255, (hex & 0xFF)/ 255];
}





/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

PIXI._defaultFrame = new PIXI.Rectangle(0,0,1,1);

// an instance of the gl context..
// only one at the moment :/
PIXI.gl;

/**
 * the WebGLRenderer is draws the stage and all its content onto a webGL enabled canvas. This renderer
 * should be used for browsers support webGL. This Render works by automatically managing webGLBatchs.
 * So no need for Sprite Batch's or Sprite Cloud's
 * Dont forget to add the view to your DOM or you will not see anything :)
 *
 * @class WebGLRenderer
 * @constructor
 * @param width=0 {number} the width of the canvas view
 * @param height=0 {number} the height of the canvas view
 * @param view {Canvas} the canvas to use as a view, optional
 * @param transparent=false {Boolean} the transparency of the render view, default false
 * @param antialias=false {Boolean} sets antialias (only applicable in chrome at the moment)
 * 
 */
PIXI.WebGLRenderer = function(width, height, view, transparent, antialias)
{
	// do a catch.. only 1 webGL renderer..

	this.transparent = !!transparent;

	this.width = width || 800;
	this.height = height || 600;

	this.view = view || document.createElement( 'canvas' ); 
    this.view.width = this.width;
	this.view.height = this.height;

	// deal with losing context..	
    var scope = this;
	this.view.addEventListener('webglcontextlost', function(event) { scope.handleContextLost(event); }, false)
	this.view.addEventListener('webglcontextrestored', function(event) { scope.handleContextRestored(event); }, false)

	this.batchs = [];

	try 
 	{
        PIXI.gl = this.gl = this.view.getContext("experimental-webgl",  {  	
    		 alpha: this.transparent,
    		 antialias:!!antialias, // SPEED UP??
    		 premultipliedAlpha:false,
    		 stencil:true
        });
    } 
    catch (e) 
    {
    	throw new Error(" This browser does not support webGL. Try using the canvas renderer" + this);
    }

    PIXI.initPrimitiveShader();
    PIXI.initDefaultShader();
    PIXI.initDefaultStripShader();

    PIXI.activateDefaultShader();

    var gl = this.gl;
    PIXI.WebGLRenderer.gl = gl;

    this.batch = new PIXI.WebGLBatch(gl);
   	gl.disable(gl.DEPTH_TEST);
   	gl.disable(gl.CULL_FACE);

    gl.enable(gl.BLEND);
    gl.colorMask(true, true, true, this.transparent); 

    PIXI.projection = new PIXI.Point(400, 300);

    this.resize(this.width, this.height);
    this.contextLost = false;

    this.stageRenderGroup = new PIXI.WebGLRenderGroup(this.gl);
}

// constructor
PIXI.WebGLRenderer.prototype.constructor = PIXI.WebGLRenderer;

/**
 * Gets a new WebGLBatch from the pool
 *
 * @static
 * @method getBatch
 * @return {WebGLBatch}
 * @private 
 */
PIXI.WebGLRenderer.getBatch = function()
{
	if(PIXI._batchs.length == 0)
	{
		return new PIXI.WebGLBatch(PIXI.WebGLRenderer.gl);
	}
	else
	{
		return PIXI._batchs.pop();
	}
}

/**
 * Puts a batch back into the pool
 *
 * @static
 * @method returnBatch
 * @param batch {WebGLBatch} The batch to return
 * @private
 */
PIXI.WebGLRenderer.returnBatch = function(batch)
{
	batch.clean();	
	PIXI._batchs.push(batch);
}

/**
 * Renders the stage to its webGL view
 *
 * @method render
 * @param stage {Stage} the Stage element to be rendered
 */
PIXI.WebGLRenderer.prototype.render = function(stage)
{
	if(this.contextLost)return;
	
	
	// if rendering a new stage clear the batchs..
	if(this.__stage !== stage)
	{
		// TODO make this work
		// dont think this is needed any more?
		this.__stage = stage;
		this.stageRenderGroup.setRenderable(stage);
	}
	
	// TODO not needed now... 
	// update children if need be
	// best to remove first!
	/*for (var i=0; i < stage.__childrenRemoved.length; i++)
	{
		var group = stage.__childrenRemoved[i].__renderGroup
		if(group)group.removeDisplayObject(stage.__childrenRemoved[i]);
	}*/

	// update any textures	
	PIXI.WebGLRenderer.updateTextures();
		
	// update the scene graph	
	PIXI.visibleCount++;
	stage.updateTransform();
	
	var gl = this.gl;
	
	// -- Does this need to be set every frame? -- //
	gl.colorMask(true, true, true, this.transparent); 
	gl.viewport(0, 0, this.width, this.height);	
	
   	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		
	gl.clearColor(stage.backgroundColorSplit[0],stage.backgroundColorSplit[1],stage.backgroundColorSplit[2], !this.transparent);     
	gl.clear(gl.COLOR_BUFFER_BIT);

	// HACK TO TEST
	
	this.stageRenderGroup.backgroundColor = stage.backgroundColorSplit;
	this.stageRenderGroup.render(PIXI.projection);
	
	// interaction
	// run interaction!
	if(stage.interactive)
	{
		//need to add some events!
		if(!stage._interactiveEventsAdded)
		{
			stage._interactiveEventsAdded = true;
			stage.interactionManager.setTarget(this);
		}
	}
	
	// after rendering lets confirm all frames that have been uodated..
	if(PIXI.Texture.frameUpdates.length > 0)
	{
		for (var i=0; i < PIXI.Texture.frameUpdates.length; i++) 
		{
		  	PIXI.Texture.frameUpdates[i].updateFrame = false;
		};
		
		PIXI.Texture.frameUpdates = [];
	}
}

/**
 * Updates the textures loaded into this webgl renderer
 *
 * @static
 * @method updateTextures
 * @private
 */
PIXI.WebGLRenderer.updateTextures = function()
{
	//TODO break this out into a texture manager...
	for (var i=0; i < PIXI.texturesToUpdate.length; i++) PIXI.WebGLRenderer.updateTexture(PIXI.texturesToUpdate[i]);
	for (var i=0; i < PIXI.texturesToDestroy.length; i++) PIXI.WebGLRenderer.destroyTexture(PIXI.texturesToDestroy[i]);
	PIXI.texturesToUpdate = [];
	PIXI.texturesToDestroy = [];
}

/**
 * Updates a loaded webgl texture
 *
 * @static
 * @method updateTexture
 * @param texture {Texture} The texture to update
 * @private
 */
PIXI.WebGLRenderer.updateTexture = function(texture)
{
	//TODO break this out into a texture manager...
	var gl = PIXI.gl;
	
	if(!texture._glTexture)
	{
		texture._glTexture = gl.createTexture();
	}

	if(texture.hasLoaded)
	{
		gl.bindTexture(gl.TEXTURE_2D, texture._glTexture);
	 	gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.source);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

		// reguler...

		if(!texture._powerOf2)
		{
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		}
		else
		{
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		}

		gl.bindTexture(gl.TEXTURE_2D, null);
	}
}

/**
 * Destroys a loaded webgl texture
 *
 * @method destroyTexture
 * @param texture {Texture} The texture to update
 * @private
 */
PIXI.WebGLRenderer.destroyTexture = function(texture)
{
	//TODO break this out into a texture manager...
	var gl = PIXI.gl;

	if(texture._glTexture)
	{
		texture._glTexture = gl.createTexture();
		gl.deleteTexture(gl.TEXTURE_2D, texture._glTexture);
	}
}

/**
 * resizes the webGL view to the specified width and height
 *
 * @method resize
 * @param width {number} the new width of the webGL view
 * @param height {number} the new height of the webGL view
 */
PIXI.WebGLRenderer.prototype.resize = function(width, height)
{
	this.width = width;
	this.height = height;

	this.view.width = width;
	this.view.height = height;

	this.gl.viewport(0, 0, this.width, this.height);	

	//var projectionMatrix = this.projectionMatrix;

	PIXI.projection.x =  this.width/2;
	PIXI.projection.y =  this.height/2;

//	projectionMatrix[0] = 2/this.width;
//	projectionMatrix[5] = -2/this.height;
//	projectionMatrix[12] = -1;
//	projectionMatrix[13] = 1;
}

/**
 * Handles a lost webgl context
 *
 * @method handleContextLost
 * @param event {Event}
 * @private
 */
PIXI.WebGLRenderer.prototype.handleContextLost = function(event)
{
	event.preventDefault();
	this.contextLost = true;
}

/**
 * Handles a restored webgl context
 *
 * @method handleContextRestored
 * @param event {Event}
 * @private
 */
PIXI.WebGLRenderer.prototype.handleContextRestored = function(event)
{
	this.gl = this.view.getContext("experimental-webgl",  {  	
		alpha: true
    });

	this.initShaders();	

	for(var key in PIXI.TextureCache) 
	{
        	var texture = PIXI.TextureCache[key].baseTexture;
        	texture._glTexture = null;
        	PIXI.WebGLRenderer.updateTexture(texture);
	};

	for (var i=0; i <  this.batchs.length; i++) 
	{
		this.batchs[i].restoreLostContext(this.gl)//
		this.batchs[i].dirty = true;
	};

	PIXI._restoreBatchs(this.gl);

	this.contextLost = false;
}

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * A WebGLBatch Enables a group of sprites to be drawn using the same settings.
 * if a group of sprites all have the same baseTexture and blendMode then they can be
 * grouped into a batch. All the sprites in a batch can then be drawn in one go by the
 * GPU which is hugely efficient. ALL sprites in the webGL renderer are added to a batch
 * even if the batch only contains one sprite. Batching is handled automatically by the
 * webGL renderer. A good tip is: the smaller the number of batchs there are, the faster
 * the webGL renderer will run.
 *
 * @class WebGLBatch
 * @contructor
 * @param gl {WebGLContext} An instance of the webGL context
 */
PIXI.WebGLRenderGroup = function(gl)
{
	this.gl = gl;
	this.root;
	
	this.backgroundColor;
	this.batchs = [];
	this.toRemove = [];
}

// constructor
PIXI.WebGLRenderGroup.prototype.constructor = PIXI.WebGLRenderGroup;

/**
 * Add a display object to the webgl renderer
 *
 * @method setRenderable
 * @param displayObject {DisplayObject}
 * @private 
 */
PIXI.WebGLRenderGroup.prototype.setRenderable = function(displayObject)
{
	// has this changed??
	if(this.root)this.removeDisplayObjectAndChildren(this.root);
	
	displayObject.worldVisible = displayObject.visible;
	
	// soooooo //
	// to check if any batchs exist already??
	
	// TODO what if its already has an object? should remove it
	this.root = displayObject;
	this.addDisplayObjectAndChildren(displayObject);
}

/**
 * Renders the stage to its webgl view
 *
 * @method render
 * @param projection {Object}
 */
PIXI.WebGLRenderGroup.prototype.render = function(projection)
{
	PIXI.WebGLRenderer.updateTextures();
	
	var gl = this.gl;

	
	gl.uniform2f(PIXI.shaderProgram.projectionVector, projection.x, projection.y);
	gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
	
	// will render all the elements in the group
	var renderable;
	
	for (var i=0; i < this.batchs.length; i++) 
	{
		
		renderable = this.batchs[i];
		if(renderable instanceof PIXI.WebGLBatch)
		{
			this.batchs[i].render();
			continue;
		}
		
		// non sprite batch..
		var worldVisible = renderable.vcount === PIXI.visibleCount;

		if(renderable instanceof PIXI.TilingSprite)
		{
			if(worldVisible)this.renderTilingSprite(renderable, projection);
		}
		else if(renderable instanceof PIXI.Strip)
		{
			if(worldVisible)this.renderStrip(renderable, projection);
		}
		else if(renderable instanceof PIXI.Graphics)
		{
			if(worldVisible && renderable.renderable) PIXI.WebGLGraphics.renderGraphics(renderable, projection);//, projectionMatrix);
		}
		else if(renderable instanceof PIXI.FilterBlock)
		{
			/*
			 * for now only masks are supported..
			 */
			if(renderable.open)
			{
    			gl.enable(gl.STENCIL_TEST);
					
				gl.colorMask(false, false, false, false);
				gl.stencilFunc(gl.ALWAYS,1,0xff);
				gl.stencilOp(gl.KEEP,gl.KEEP,gl.REPLACE);
  
				PIXI.WebGLGraphics.renderGraphics(renderable.mask, projection);
  					
				gl.colorMask(true, true, true, false);
				gl.stencilFunc(gl.NOTEQUAL,0,0xff);
				gl.stencilOp(gl.KEEP,gl.KEEP,gl.KEEP);
			}
			else
			{
				gl.disable(gl.STENCIL_TEST);
			}
		}
	}
	
}

/**
 * Renders the stage to its webgl view
 *
 * @method handleFilter
 * @param filter {FilterBlock}
 * @private
 */
PIXI.WebGLRenderGroup.prototype.handleFilter = function(filter, projection)
{
	
}

/**
 * Renders a specific displayObject
 *
 * @method renderSpecific
 * @param displayObject {DisplayObject}
 * @param projection {Object}
 * @private
 */
PIXI.WebGLRenderGroup.prototype.renderSpecific = function(displayObject, projection)
{
	PIXI.WebGLRenderer.updateTextures();
	
	var gl = this.gl;

	gl.uniform2f(PIXI.shaderProgram.projectionVector, projection.x, projection.y);

	// to do!
	// render part of the scene...
	
	var startIndex;
	var startBatchIndex;
	
	var endIndex;
	var endBatchIndex;
	
	/*
	 *  LOOK FOR THE NEXT SPRITE
	 *  This part looks for the closest next sprite that can go into a batch
	 *  it keeps looking until it finds a sprite or gets to the end of the display
	 *  scene graph
	 */
	var nextRenderable = displayObject.first;
	while(nextRenderable._iNext)
	{
		nextRenderable = nextRenderable._iNext;
		if(nextRenderable.renderable && nextRenderable.__renderGroup)break;
	}
	var startBatch = nextRenderable.batch;
	
	if(nextRenderable instanceof PIXI.Sprite)
	{
		startBatch = nextRenderable.batch;
		
		var head = startBatch.head;
		var next = head;
		
		// ok now we have the batch.. need to find the start index!
		if(head == nextRenderable)
		{
			startIndex = 0;
		}
		else
		{
			startIndex = 1;
			
			while(head.__next != nextRenderable)
			{
				startIndex++;
				head = head.__next;
			}
		}
	}
	else
	{
		startBatch = nextRenderable;
	}
	
	// Get the LAST renderable object
	var lastRenderable = displayObject;
	var endBatch;
	var lastItem = displayObject;
	while(lastItem.children.length > 0)
	{
		lastItem = lastItem.children[lastItem.children.length-1];
		if(lastItem.renderable)lastRenderable = lastItem;
	}
	
	if(lastRenderable instanceof PIXI.Sprite)
	{
		endBatch = lastRenderable.batch;
		
		var head = endBatch.head;
		
		if(head == lastRenderable)
		{
			endIndex = 0;
		}
		else
		{
			endIndex = 1;
			
			while(head.__next != lastRenderable)
			{
				endIndex++;
				head = head.__next;
			}
		}
	}
	else
	{
		endBatch = lastRenderable;
	}
	
	// TODO - need to fold this up a bit!
	
	if(startBatch == endBatch)
	{
		if(startBatch instanceof PIXI.WebGLBatch)
		{
			startBatch.render(startIndex, endIndex+1);
		}
		else
		{
			this.renderSpecial(startBatch, projection);
		}
		return;
	}
	
	// now we have first and last!
	startBatchIndex = this.batchs.indexOf(startBatch);
	endBatchIndex = this.batchs.indexOf(endBatch);
	
	// DO the first batch
	if(startBatch instanceof PIXI.WebGLBatch)
	{
		startBatch.render(startIndex);
	}
	else
	{
		this.renderSpecial(startBatch, projection);
	}
	
	// DO the middle batchs..
	for (var i=startBatchIndex+1; i < endBatchIndex; i++) 
	{
		renderable = this.batchs[i];
	
		if(renderable instanceof PIXI.WebGLBatch)
		{
			this.batchs[i].render();
		}
		else
		{
			this.renderSpecial(renderable, projection);
		}
	}
	
	// DO the last batch..
	if(endBatch instanceof PIXI.WebGLBatch)
	{
		endBatch.render(0, endIndex+1);
	}
	else
	{
		this.renderSpecial(endBatch, projection);
	}
}

/**
 * Renders a specific renderable
 *
 * @method renderSpecial
 * @param renderable {DisplayObject}
 * @param projection {Object}
 * @private
 */
PIXI.WebGLRenderGroup.prototype.renderSpecial = function(renderable, projection)
{
	var worldVisible = renderable.vcount === PIXI.visibleCount

	if(renderable instanceof PIXI.TilingSprite)
	{
		if(worldVisible)this.renderTilingSprite(renderable, projection);
	}
	else if(renderable instanceof PIXI.Strip)
	{
		if(worldVisible)this.renderStrip(renderable, projection);
	}
	else if(renderable instanceof PIXI.CustomRenderable)
	{
		if(worldVisible) renderable.renderWebGL(this, projection);
	}
	else if(renderable instanceof PIXI.Graphics)
	{
		if(worldVisible && renderable.renderable) PIXI.WebGLGraphics.renderGraphics(renderable, projection);
	}
	else if(renderable instanceof PIXI.FilterBlock)
	{
		/*
		 * for now only masks are supported..
		 */

		var gl = PIXI.gl;

		if(renderable.open)
		{
			gl.enable(gl.STENCIL_TEST);
				
			gl.colorMask(false, false, false, false);
			gl.stencilFunc(gl.ALWAYS,1,0xff);
			gl.stencilOp(gl.KEEP,gl.KEEP,gl.REPLACE);
  
			PIXI.WebGLGraphics.renderGraphics(renderable.mask, projection);
			
			// we know this is a render texture so enable alpha too..
			gl.colorMask(true, true, true, true);
			gl.stencilFunc(gl.NOTEQUAL,0,0xff);
			gl.stencilOp(gl.KEEP,gl.KEEP,gl.KEEP);
		}
		else
		{
			gl.disable(gl.STENCIL_TEST);
		}
	}
}

/**
 * Updates a webgl texture
 *
 * @method updateTexture
 * @param displayObject {DisplayObject}
 * @private
 */
PIXI.WebGLRenderGroup.prototype.updateTexture = function(displayObject)
{
	
	// TODO definitely can optimse this function..
	
	this.removeObject(displayObject);
	
	/*
	 *  LOOK FOR THE PREVIOUS RENDERABLE
	 *  This part looks for the closest previous sprite that can go into a batch
	 *  It keeps going back until it finds a sprite or the stage
	 */
	var previousRenderable = displayObject.first;
	while(previousRenderable != this.root)
	{
		previousRenderable = previousRenderable._iPrev;
		if(previousRenderable.renderable && previousRenderable.__renderGroup)break;
	}
	
	/*
	 *  LOOK FOR THE NEXT SPRITE
	 *  This part looks for the closest next sprite that can go into a batch
	 *  it keeps looking until it finds a sprite or gets to the end of the display
	 *  scene graph
	 */
	var nextRenderable = displayObject.last;
	while(nextRenderable._iNext)
	{
		nextRenderable = nextRenderable._iNext;
		if(nextRenderable.renderable && nextRenderable.__renderGroup)break;
	}
	
	this.insertObject(displayObject, previousRenderable, nextRenderable);
}

/**
 * Adds filter blocks
 *
 * @method addFilterBlocks
 * @param start {FilterBlock}
 * @param end {FilterBlock}
 * @private
 */
PIXI.WebGLRenderGroup.prototype.addFilterBlocks = function(start, end)
{
	start.__renderGroup = this;
	end.__renderGroup = this;
	/*
	 *  LOOK FOR THE PREVIOUS RENDERABLE
	 *  This part looks for the closest previous sprite that can go into a batch
	 *  It keeps going back until it finds a sprite or the stage
	 */
	var previousRenderable = start;
	while(previousRenderable != this.root)
	{
		previousRenderable = previousRenderable._iPrev;
		if(previousRenderable.renderable && previousRenderable.__renderGroup)break;
	}
	this.insertAfter(start, previousRenderable);
		
	/*
	 *  LOOK FOR THE NEXT SPRITE
	 *  This part looks for the closest next sprite that can go into a batch
	 *  it keeps looking until it finds a sprite or gets to the end of the display
	 *  scene graph
	 */
	var previousRenderable2 = end;
	while(previousRenderable2 != this.root)
	{
		previousRenderable2 = previousRenderable2._iPrev;
		if(previousRenderable2.renderable && previousRenderable2.__renderGroup)break;
	}
	this.insertAfter(end, previousRenderable2);
}

/**
 * Remove filter blocks
 *
 * @method removeFilterBlocks
 * @param start {FilterBlock}
 * @param end {FilterBlock}
 * @private
 */
PIXI.WebGLRenderGroup.prototype.removeFilterBlocks = function(start, end)
{
	this.removeObject(start);
	this.removeObject(end);
}

/**
 * Adds a display object and children to the webgl context
 *
 * @method addDisplayObjectAndChildren
 * @param displayObject {DisplayObject}
 * @private
 */
PIXI.WebGLRenderGroup.prototype.addDisplayObjectAndChildren = function(displayObject)
{
	if(displayObject.__renderGroup)displayObject.__renderGroup.removeDisplayObjectAndChildren(displayObject);
	
	/*
	 *  LOOK FOR THE PREVIOUS RENDERABLE
	 *  This part looks for the closest previous sprite that can go into a batch
	 *  It keeps going back until it finds a sprite or the stage
	 */
	
	var previousRenderable = displayObject.first;
	while(previousRenderable != this.root.first)
	{
		previousRenderable = previousRenderable._iPrev;
		if(previousRenderable.renderable && previousRenderable.__renderGroup)break;
	}
	
	/*
	 *  LOOK FOR THE NEXT SPRITE
	 *  This part looks for the closest next sprite that can go into a batch
	 *  it keeps looking until it finds a sprite or gets to the end of the display
	 *  scene graph
	 */
	var nextRenderable = displayObject.last;
	while(nextRenderable._iNext)
	{
		nextRenderable = nextRenderable._iNext;
		if(nextRenderable.renderable && nextRenderable.__renderGroup)break;
	}
	
	// one the display object hits this. we can break the loop	
	
	var tempObject = displayObject.first;
	var testObject = displayObject.last._iNext;
	do	
	{
		tempObject.__renderGroup = this;
		
		if(tempObject.renderable)
		{
		
			this.insertObject(tempObject, previousRenderable, nextRenderable);
			previousRenderable = tempObject;
		}
		
		tempObject = tempObject._iNext;
	}
	while(tempObject != testObject)
}

/**
 * Removes a display object and children to the webgl context
 *
 * @method removeDisplayObjectAndChildren
 * @param displayObject {DisplayObject}
 * @private
 */
PIXI.WebGLRenderGroup.prototype.removeDisplayObjectAndChildren = function(displayObject)
{
	if(displayObject.__renderGroup != this)return;
	
//	var displayObject = displayObject.first;
	var lastObject = displayObject.last;
	do	
	{
		displayObject.__renderGroup = null;
		if(displayObject.renderable)this.removeObject(displayObject);
		displayObject = displayObject._iNext;
	}
	while(displayObject)
}

/**
 * Inserts a displayObject into the linked list
 *
 * @method insertObject
 * @param displayObject {DisplayObject}
 * @param previousObject {DisplayObject}
 * @param nextObject {DisplayObject}
 * @private
 */
PIXI.WebGLRenderGroup.prototype.insertObject = function(displayObject, previousObject, nextObject)
{
	// while looping below THE OBJECT MAY NOT HAVE BEEN ADDED
	var previousSprite = previousObject;
	var nextSprite = nextObject;
	
	/*
	 * so now we have the next renderable and the previous renderable
	 * 
	 */
	if(displayObject instanceof PIXI.Sprite)
	{
		var previousBatch
		var nextBatch
		
		if(previousSprite instanceof PIXI.Sprite)
		{
			previousBatch = previousSprite.batch;
			if(previousBatch)
			{
				if(previousBatch.texture == displayObject.texture.baseTexture && previousBatch.blendMode == displayObject.blendMode)
				{
					previousBatch.insertAfter(displayObject, previousSprite);
					return;
				}
			}
		}
		else
		{
			// TODO reword!
			previousBatch = previousSprite;
		}
	
		if(nextSprite)
		{
			if(nextSprite instanceof PIXI.Sprite)
			{
				nextBatch = nextSprite.batch;
			
				//batch may not exist if item was added to the display list but not to the webGL
				if(nextBatch)
				{
					if(nextBatch.texture == displayObject.texture.baseTexture && nextBatch.blendMode == displayObject.blendMode)
					{
						nextBatch.insertBefore(displayObject, nextSprite);
						return;
					}
					else
					{
						if(nextBatch == previousBatch)
						{
							// THERE IS A SPLIT IN THIS BATCH! //
							var splitBatch = previousBatch.split(nextSprite);
							// COOL!
							// add it back into the array	
							/*
							 * OOPS!
							 * seems the new sprite is in the middle of a batch
							 * lets split it.. 
							 */
							var batch = PIXI.WebGLRenderer.getBatch();

							var index = this.batchs.indexOf( previousBatch );
							batch.init(displayObject);
							this.batchs.splice(index+1, 0, batch, splitBatch);
							
							return;
						}
					}
				}
			}
			else
			{
				// TODO re-word!
				
				nextBatch = nextSprite;
			}
		}
		
		/*
		 * looks like it does not belong to any batch!
		 * but is also not intersecting one..
		 * time to create anew one!
		 */
		
		var batch =  PIXI.WebGLRenderer.getBatch();
		batch.init(displayObject);

		if(previousBatch) // if this is invalid it means 
		{
			var index = this.batchs.indexOf( previousBatch );
			this.batchs.splice(index+1, 0, batch);
		}
		else
		{
			this.batchs.push(batch);
		}
		
		return;
	}
	else if(displayObject instanceof PIXI.TilingSprite)
	{
		
		// add to a batch!!
		this.initTilingSprite(displayObject);
	//	this.batchs.push(displayObject);
		
	}
	else if(displayObject instanceof PIXI.Strip)
	{
		// add to a batch!!
		this.initStrip(displayObject);
	//	this.batchs.push(displayObject);
	}
	else if(displayObject)// instanceof PIXI.Graphics)
	{
		//displayObject.initWebGL(this);
		
		// add to a batch!!
		//this.initStrip(displayObject);
		//this.batchs.push(displayObject);
	}
	
	this.insertAfter(displayObject, previousSprite);
			
	// insert and SPLIT!

}

/**
 * Inserts a displayObject into the linked list
 *
 * @method insertAfter
 * @param item {DisplayObject}
 * @param displayObject {DisplayObject} The object to insert
 * @private
 */
PIXI.WebGLRenderGroup.prototype.insertAfter = function(item, displayObject)
{
	if(displayObject instanceof PIXI.Sprite)
	{
		var previousBatch = displayObject.batch;
		
		if(previousBatch)
		{
			// so this object is in a batch!
			
			// is it not? need to split the batch
			if(previousBatch.tail == displayObject)
			{
				// is it tail? insert in to batchs	
				var index = this.batchs.indexOf( previousBatch );
				this.batchs.splice(index+1, 0, item);
			}
			else
			{
				// TODO MODIFY ADD / REMOVE CHILD TO ACCOUNT FOR FILTERS (also get prev and next) //
				
				// THERE IS A SPLIT IN THIS BATCH! //
				var splitBatch = previousBatch.split(displayObject.__next);
				
				// COOL!
				// add it back into the array	
				/*
				 * OOPS!
				 * seems the new sprite is in the middle of a batch
				 * lets split it.. 
				 */
				var index = this.batchs.indexOf( previousBatch );
				this.batchs.splice(index+1, 0, item, splitBatch);
			}
		}
		else
		{
			this.batchs.push(item);
		}
	}
	else
	{
		var index = this.batchs.indexOf( displayObject );
		this.batchs.splice(index+1, 0, item);
	}
}

/**
 * Removes a displayObject from the linked list
 *
 * @method removeObject
 * @param displayObject {DisplayObject} The object to remove
 * @private
 */
PIXI.WebGLRenderGroup.prototype.removeObject = function(displayObject)
{
	// loop through children..
	// display object //
	
	// add a child from the render group..
	// remove it and all its children!
	//displayObject.cacheVisible = false;//displayObject.visible;

	/*
	 * removing is a lot quicker..
	 * 
	 */
	var batchToRemove;
	
	if(displayObject instanceof PIXI.Sprite)
	{
		// should always have a batch!
		var batch = displayObject.batch;
		if(!batch)return; // this means the display list has been altered befre rendering
		
		batch.remove(displayObject);
		
		if(batch.size==0)
		{
			batchToRemove = batch;
		}
	}
	else
	{
		batchToRemove = displayObject;
	}
	
	/*
	 * Looks like there is somthing that needs removing!
	 */
	if(batchToRemove)	
	{
		var index = this.batchs.indexOf( batchToRemove );
		if(index == -1)return;// this means it was added then removed before rendered
		
		// ok so.. check to see if you adjacent batchs should be joined.
		// TODO may optimise?
		if(index == 0 || index == this.batchs.length-1)
		{
			// wha - eva! just get of the empty batch!
			this.batchs.splice(index, 1);
			if(batchToRemove instanceof PIXI.WebGLBatch)PIXI.WebGLRenderer.returnBatch(batchToRemove);
		
			return;
		}
		
		if(this.batchs[index-1] instanceof PIXI.WebGLBatch && this.batchs[index+1] instanceof PIXI.WebGLBatch)
		{
			if(this.batchs[index-1].texture == this.batchs[index+1].texture && this.batchs[index-1].blendMode == this.batchs[index+1].blendMode)
			{
				//console.log("MERGE")
				this.batchs[index-1].merge(this.batchs[index+1]);
				
				if(batchToRemove instanceof PIXI.WebGLBatch)PIXI.WebGLRenderer.returnBatch(batchToRemove);
				PIXI.WebGLRenderer.returnBatch(this.batchs[index+1]);
				this.batchs.splice(index, 2);
				return;
			}
		}
		
		this.batchs.splice(index, 1);
		if(batchToRemove instanceof PIXI.WebGLBatch)PIXI.WebGLRenderer.returnBatch(batchToRemove);
	}
}

/**
 * Initializes a tiling sprite
 *
 * @method initTilingSprite
 * @param sprite {TilingSprite} The tiling sprite to initialize
 * @private
 */
PIXI.WebGLRenderGroup.prototype.initTilingSprite = function(sprite)
{
	var gl = this.gl;

	// make the texture tilable..
			
	sprite.verticies = new Float32Array([0, 0,
										  sprite.width, 0,
										  sprite.width,  sprite.height,
										 0,  sprite.height]);
					
	sprite.uvs = new Float32Array([0, 0,
									1, 0,
									1, 1,
									0, 1]);
				
	sprite.colors = new Float32Array([1,1,1,1]);
	
	sprite.indices =  new Uint16Array([0, 1, 3,2])//, 2]);
	
	sprite._vertexBuffer = gl.createBuffer();
	sprite._indexBuffer = gl.createBuffer();
	sprite._uvBuffer = gl.createBuffer();
	sprite._colorBuffer = gl.createBuffer();
						
	gl.bindBuffer(gl.ARRAY_BUFFER, sprite._vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, sprite.verticies, gl.STATIC_DRAW);

	gl.bindBuffer(gl.ARRAY_BUFFER, sprite._uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,  sprite.uvs, gl.DYNAMIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, sprite._colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, sprite.colors, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sprite._indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, sprite.indices, gl.STATIC_DRAW);
    
//    return ( (x > 0) && ((x & (x - 1)) == 0) );

	if(sprite.texture.baseTexture._glTexture)
	{
    	gl.bindTexture(gl.TEXTURE_2D, sprite.texture.baseTexture._glTexture);
    	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		sprite.texture.baseTexture._powerOf2 = true;
	}
	else
	{
		sprite.texture.baseTexture._powerOf2 = true;
	}
}

/**
 * Renders a Strip
 *
 * @method renderStrip
 * @param strip {Strip} The strip to render
 * @param projection {Object}
 * @private
 */
PIXI.WebGLRenderGroup.prototype.renderStrip = function(strip, projection)
{
	var gl = this.gl;
	var shaderProgram = PIXI.shaderProgram;
//	mat
	//var mat4Real = PIXI.mat3.toMat4(strip.worldTransform);
	//PIXI.mat4.transpose(mat4Real);
	//PIXI.mat4.multiply(projectionMatrix, mat4Real, mat4Real )

	
	gl.useProgram(PIXI.stripShaderProgram);

	var m = PIXI.mat3.clone(strip.worldTransform);
	
	PIXI.mat3.transpose(m);
	
	// set the matrix transform for the 
 	gl.uniformMatrix3fv(PIXI.stripShaderProgram.translationMatrix, false, m);
	gl.uniform2f(PIXI.stripShaderProgram.projectionVector, projection.x, projection.y);
	gl.uniform1f(PIXI.stripShaderProgram.alpha, strip.worldAlpha);

/*
	if(strip.blendMode == PIXI.blendModes.NORMAL)
	{
		gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
	}
	else
	{
		gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_COLOR);
	}
	*/
	
	
	if(!strip.dirty)
	{
		
		gl.bindBuffer(gl.ARRAY_BUFFER, strip._vertexBuffer);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, strip.verticies)
	    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);
		
		// update the uvs
	   	gl.bindBuffer(gl.ARRAY_BUFFER, strip._uvBuffer);
	    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
			
	    gl.activeTexture(gl.TEXTURE0);
	    gl.bindTexture(gl.TEXTURE_2D, strip.texture.baseTexture._glTexture);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, strip._colorBuffer);
	    gl.vertexAttribPointer(shaderProgram.colorAttribute, 1, gl.FLOAT, false, 0, 0);
		
		// dont need to upload!
	    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, strip._indexBuffer);
	}
	else
	{
		strip.dirty = false;
		gl.bindBuffer(gl.ARRAY_BUFFER, strip._vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, strip.verticies, gl.STATIC_DRAW)
	    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);
		
		// update the uvs
	   	gl.bindBuffer(gl.ARRAY_BUFFER, strip._uvBuffer);
	   	gl.bufferData(gl.ARRAY_BUFFER, strip.uvs, gl.STATIC_DRAW)
	    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
			
	    gl.activeTexture(gl.TEXTURE0);
	    gl.bindTexture(gl.TEXTURE_2D, strip.texture.baseTexture._glTexture);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, strip._colorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, strip.colors, gl.STATIC_DRAW)
	    gl.vertexAttribPointer(shaderProgram.colorAttribute, 1, gl.FLOAT, false, 0, 0);
		
		// dont need to upload!
	    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, strip._indexBuffer);
	    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, strip.indices, gl.STATIC_DRAW);
	    
	}
	//console.log(gl.TRIANGLE_STRIP);
	
	gl.drawElements(gl.TRIANGLE_STRIP, strip.indices.length, gl.UNSIGNED_SHORT, 0);
    
  	gl.useProgram(PIXI.shaderProgram);
}

/**
 * Renders a TilingSprite
 *
 * @method renderTilingSprite
 * @param sprite {TilingSprite} The tiling sprite to render
 * @param projectionMatrix {Object}
 * @private
 */
PIXI.WebGLRenderGroup.prototype.renderTilingSprite = function(sprite, projectionMatrix)
{
	var gl = this.gl;
	var shaderProgram = PIXI.shaderProgram;
	
	var tilePosition = sprite.tilePosition;
	var tileScale = sprite.tileScale;
	
	var offsetX =  tilePosition.x/sprite.texture.baseTexture.width;
	var offsetY =  tilePosition.y/sprite.texture.baseTexture.height;
	
	var scaleX =  (sprite.width / sprite.texture.baseTexture.width)  / tileScale.x;
	var scaleY =  (sprite.height / sprite.texture.baseTexture.height) / tileScale.y;

	sprite.uvs[0] = 0 - offsetX;
	sprite.uvs[1] = 0 - offsetY;
	
	sprite.uvs[2] = (1 * scaleX)  -offsetX;
	sprite.uvs[3] = 0 - offsetY;
	
	sprite.uvs[4] = (1 *scaleX) - offsetX;
	sprite.uvs[5] = (1 *scaleY) - offsetY;
	
	sprite.uvs[6] = 0 - offsetX;
	sprite.uvs[7] = (1 *scaleY) - offsetY;
	
	gl.bindBuffer(gl.ARRAY_BUFFER, sprite._uvBuffer);
	gl.bufferSubData(gl.ARRAY_BUFFER, 0, sprite.uvs)
	
	this.renderStrip(sprite, projectionMatrix);
}

/**
 * Initializes a strip to be rendered
 *
 * @method initStrip
 * @param strip {Strip} The strip to initialize
 * @private
 */
PIXI.WebGLRenderGroup.prototype.initStrip = function(strip)
{
	// build the strip!
	var gl = this.gl;
	var shaderProgram = this.shaderProgram;
	
	strip._vertexBuffer = gl.createBuffer();
	strip._indexBuffer = gl.createBuffer();
	strip._uvBuffer = gl.createBuffer();
	strip._colorBuffer = gl.createBuffer();
	
	gl.bindBuffer(gl.ARRAY_BUFFER, strip._vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, strip.verticies, gl.DYNAMIC_DRAW);

	gl.bindBuffer(gl.ARRAY_BUFFER, strip._uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,  strip.uvs, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, strip._colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, strip.colors, gl.STATIC_DRAW);

	
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, strip._indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, strip.indices, gl.STATIC_DRAW);
}


/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */


/*
 * the default suoer fast shader!
 */

PIXI.shaderFragmentSrc = [
  "precision mediump float;",
  "varying vec2 vTextureCoord;",
  "varying float vColor;",
  "uniform sampler2D uSampler;",
  "void main(void) {",
    "gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y));",
    "gl_FragColor = gl_FragColor * vColor;",
  "}"
];

PIXI.shaderVertexSrc = [
  "attribute vec2 aVertexPosition;",
  "attribute vec2 aTextureCoord;",
  "attribute float aColor;",
  //"uniform mat4 uMVMatrix;",
  
  "uniform vec2 projectionVector;",
  "varying vec2 vTextureCoord;",
  "varying float vColor;",
  "void main(void) {",
   // "gl_Position = uMVMatrix * vec4(aVertexPosition, 1.0, 1.0);",
    "gl_Position = vec4( aVertexPosition.x / projectionVector.x -1.0, aVertexPosition.y / -projectionVector.y + 1.0 , 0.0, 1.0);",
    "vTextureCoord = aTextureCoord;",
    "vColor = aColor;",
  "}"
];

/*
 * the triangle strip shader..
 */

PIXI.stripShaderFragmentSrc = [
  "precision mediump float;",
  "varying vec2 vTextureCoord;",
  "varying float vColor;",
  "uniform float alpha;",
  "uniform sampler2D uSampler;",
  "void main(void) {",
    "gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y));",
    "gl_FragColor = gl_FragColor * alpha;",
  "}"
];


PIXI.stripShaderVertexSrc = [
  "attribute vec2 aVertexPosition;",
  "attribute vec2 aTextureCoord;",
  "attribute float aColor;",
  "uniform mat3 translationMatrix;",
  "uniform vec2 projectionVector;",
  "varying vec2 vTextureCoord;",
  "varying float vColor;",
  "void main(void) {",
	"vec3 v = translationMatrix * vec3(aVertexPosition, 1.0);",
    "gl_Position = vec4( v.x / projectionVector.x -1.0, v.y / -projectionVector.y + 1.0 , 0.0, 1.0);",
    "vTextureCoord = aTextureCoord;",
    "vColor = aColor;",
  "}"
];


/*
 * primitive shader..
 */

PIXI.primitiveShaderFragmentSrc = [
  "precision mediump float;",
  "varying vec4 vColor;",
  "void main(void) {",
    "gl_FragColor = vColor;",
  "}"
];

PIXI.primitiveShaderVertexSrc = [
  "attribute vec2 aVertexPosition;",
  "attribute vec4 aColor;",
  "uniform mat3 translationMatrix;",
  "uniform vec2 projectionVector;",
  "uniform float alpha;",
  "varying vec4 vColor;",
  "void main(void) {",
  	"vec3 v = translationMatrix * vec3(aVertexPosition, 1.0);",
    "gl_Position = vec4( v.x / projectionVector.x -1.0, v.y / -projectionVector.y + 1.0 , 0.0, 1.0);",
    "vColor = aColor  * alpha;",
  "}"
];

PIXI.initPrimitiveShader = function() 
{
	var gl = PIXI.gl;

	var shaderProgram = PIXI.compileProgram(PIXI.primitiveShaderVertexSrc, PIXI.primitiveShaderFragmentSrc)
	
    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    shaderProgram.colorAttribute = gl.getAttribLocation(shaderProgram, "aColor");
    
    shaderProgram.projectionVector = gl.getUniformLocation(shaderProgram, "projectionVector");
    shaderProgram.translationMatrix = gl.getUniformLocation(shaderProgram, "translationMatrix");
    
	shaderProgram.alpha = gl.getUniformLocation(shaderProgram, "alpha");

	PIXI.primitiveProgram = shaderProgram;
}

PIXI.initDefaultShader = function() 
{
	var gl = this.gl;
	var shaderProgram = PIXI.compileProgram(PIXI.shaderVertexSrc, PIXI.shaderFragmentSrc)
	
    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    shaderProgram.projectionVector = gl.getUniformLocation(shaderProgram, "projectionVector");
    shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
	shaderProgram.colorAttribute = gl.getAttribLocation(shaderProgram, "aColor");

   // shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
    
	PIXI.shaderProgram = shaderProgram;
}

PIXI.initDefaultStripShader = function() 
{
	var gl = this.gl;
	var shaderProgram = PIXI.compileProgram(PIXI.stripShaderVertexSrc, PIXI.stripShaderFragmentSrc)
	
    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    shaderProgram.projectionVector = gl.getUniformLocation(shaderProgram, "projectionVector");
    shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
	shaderProgram.translationMatrix = gl.getUniformLocation(shaderProgram, "translationMatrix");
	shaderProgram.alpha = gl.getUniformLocation(shaderProgram, "alpha");

	shaderProgram.colorAttribute = gl.getAttribLocation(shaderProgram, "aColor");

    shaderProgram.projectionVector = gl.getUniformLocation(shaderProgram, "projectionVector");
    
    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
    
	PIXI.stripShaderProgram = shaderProgram;
}

PIXI.CompileVertexShader = function(gl, shaderSrc)
{
  return PIXI._CompileShader(gl, shaderSrc, gl.VERTEX_SHADER);
}

PIXI.CompileFragmentShader = function(gl, shaderSrc)
{
  return PIXI._CompileShader(gl, shaderSrc, gl.FRAGMENT_SHADER);
}

PIXI._CompileShader = function(gl, shaderSrc, shaderType)
{
  var src = shaderSrc.join("\n");
  var shader = gl.createShader(shaderType);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}


PIXI.compileProgram = function(vertexSrc, fragmentSrc)
{
	var gl = PIXI.gl;
	var fragmentShader = PIXI.CompileFragmentShader(gl, fragmentSrc);
	var vertexShader = PIXI.CompileVertexShader(gl, vertexSrc);
	
	var shaderProgram = gl.createProgram();
	
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

	return shaderProgram;
} 


PIXI.activateDefaultShader = function()
{
	var gl = PIXI.gl;
	var shaderProgram = PIXI.shaderProgram;
	
	gl.useProgram(shaderProgram);
	
	
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
    gl.enableVertexAttribArray(shaderProgram.colorAttribute);
}

	

PIXI.activatePrimitiveShader = function()
{
	var gl = PIXI.gl;
	
	gl.disableVertexAttribArray(PIXI.shaderProgram.textureCoordAttribute);
    gl.disableVertexAttribArray(PIXI.shaderProgram.colorAttribute);
    
	gl.useProgram(PIXI.primitiveProgram);
	
	gl.enableVertexAttribArray(PIXI.primitiveProgram.vertexPositionAttribute);
	gl.enableVertexAttribArray(PIXI.primitiveProgram.colorAttribute);
} 


/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * A Text Object will create a line(s) of text using bitmap font. To split a line you can use "\n", "\r" or "\r\n"
 * You can generate the fnt files using 
 * http://www.angelcode.com/products/bmfont/ for windows or
 * http://www.bmglyph.com/ for mac.
 *
 * @class BitmapText
 * @extends DisplayObjectContainer
 * @constructor
 * @param text {String} The copy that you would like the text to display
 * @param style {Object} The style parameters
 * @param style.font {String} The size (optional) and bitmap font id (required) eq "Arial" or "20px Arial" (must have loaded previously)
 * @param [style.align="left"] {String} An alignment of the multiline text ("left", "center" or "right")
 */
PIXI.BitmapText = function(text, style)
{
    PIXI.DisplayObjectContainer.call(this);

    this.setText(text);
    this.setStyle(style);
    this.updateText();
    this.dirty = false

};

// constructor
PIXI.BitmapText.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
PIXI.BitmapText.prototype.constructor = PIXI.BitmapText;

/**
 * Set the copy for the text object
 *
 * @method setText
 * @param text {String} The copy that you would like the text to display
 */
PIXI.BitmapText.prototype.setText = function(text)
{
    this.text = text || " ";
    this.dirty = true;
};

/**
 * Set the style of the text
 *
 * @method setStyle
 * @param style {Object} The style parameters
 * @param style.font {String} The size (optional) and bitmap font id (required) eq "Arial" or "20px Arial" (must have loaded previously)
 * @param [style.align="left"] {String} An alignment of the multiline text ("left", "center" or "right")
 */
PIXI.BitmapText.prototype.setStyle = function(style)
{
    style = style || {};
    style.align = style.align || "left";
    this.style = style;

    var font = style.font.split(" ");
    this.fontName = font[font.length - 1];
    this.fontSize = font.length >= 2 ? parseInt(font[font.length - 2], 10) : PIXI.BitmapText.fonts[this.fontName].size;

    this.dirty = true;
};

/**
 * Renders text
 *
 * @method updateText
 * @private
 */
PIXI.BitmapText.prototype.updateText = function()
{
    var data = PIXI.BitmapText.fonts[this.fontName];
    var pos = new PIXI.Point();
    var prevCharCode = null;
    var chars = [];
    var maxLineWidth = 0;
    var lineWidths = [];
    var line = 0;
    var scale = this.fontSize / data.size;
    for(var i = 0; i < this.text.length; i++)
    {
        var charCode = this.text.charCodeAt(i);
        if(/(?:\r\n|\r|\n)/.test(this.text.charAt(i)))
        {
            lineWidths.push(pos.x);
            maxLineWidth = Math.max(maxLineWidth, pos.x);
            line++;

            pos.x = 0;
            pos.y += data.lineHeight;
            prevCharCode = null;
            continue;
        }
        
        var charData = data.chars[charCode];
        if(!charData) continue;

        if(prevCharCode && charData[prevCharCode])
        {
           pos.x += charData.kerning[prevCharCode];
        }
        chars.push({texture:charData.texture, line: line, charCode: charCode, position: new PIXI.Point(pos.x + charData.xOffset, pos.y + charData.yOffset)});
        pos.x += charData.xAdvance;

        prevCharCode = charCode;
    }

    lineWidths.push(pos.x);
    maxLineWidth = Math.max(maxLineWidth, pos.x);

    var lineAlignOffsets = [];
    for(i = 0; i <= line; i++)
    {
        var alignOffset = 0;
        if(this.style.align == "right")
        {
            alignOffset = maxLineWidth - lineWidths[i];
        }
        else if(this.style.align == "center")
        {
            alignOffset = (maxLineWidth - lineWidths[i]) / 2;
        }
        lineAlignOffsets.push(alignOffset);
    }

    for(i = 0; i < chars.length; i++)
    {
        var c = new PIXI.Sprite(chars[i].texture)//PIXI.Sprite.fromFrame(chars[i].charCode);
        c.position.x = (chars[i].position.x + lineAlignOffsets[chars[i].line]) * scale;
        c.position.y = chars[i].position.y * scale;
        c.scale.x = c.scale.y = scale;
        this.addChild(c);
    }

    this.width = maxLineWidth * scale;
    this.height = (pos.y + data.lineHeight) * scale;
};

/**
 * Updates the transfor of this object
 *
 * @method updateTransform
 * @private
 */
PIXI.BitmapText.prototype.updateTransform = function()
{
	if(this.dirty)
	{
        while(this.children.length > 0)
        {
            this.removeChild(this.getChildAt(0));
        }
        this.updateText();

        this.dirty = false;
	}
	
	PIXI.DisplayObjectContainer.prototype.updateTransform.call(this);
};

PIXI.BitmapText.fonts = {};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * A Text Object will create a line(s) of text to split a line you can use "\n"
 *
 * @class Text
 * @extends Sprite
 * @constructor
 * @param text {String} The copy that you would like the text to display
 * @param [style] {Object} The style parameters
 * @param [style.font] {String} default "bold 20pt Arial" The style and size of the font
 * @param [style.fill="black"] {Object} A canvas fillstyle that will be used on the text eg "red", "#00FF00"
 * @param [style.align="left"] {String} An alignment of the multiline text ("left", "center" or "right")
 * @param [style.stroke] {String} A canvas fillstyle that will be used on the text stroke eg "blue", "#FCFF00"
 * @param [style.strokeThickness=0] {number} A number that represents the thickness of the stroke. Default is 0 (no stroke)
 * @param [style.wordWrap=false] {Boolean} Indicates if word wrap should be used
 * @param [style.wordWrapWidth=100] {number} The width at which text will wrap
 */
PIXI.Text = function(text, style)
{
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");
    PIXI.Sprite.call(this, PIXI.Texture.fromCanvas(this.canvas));

    this.setText(text);
    this.setStyle(style);
    
    this.updateText();
    this.dirty = false;
};

// constructor
PIXI.Text.prototype = Object.create(PIXI.Sprite.prototype);
PIXI.Text.prototype.constructor = PIXI.Text;

/**
 * Set the style of the text
 *
 * @method setStyle
 * @param [style] {Object} The style parameters
 * @param [style.font="bold 20pt Arial"] {String} The style and size of the font
 * @param [style.fill="black"] {Object} A canvas fillstyle that will be used on the text eg "red", "#00FF00"
 * @param [style.align="left"] {String} An alignment of the multiline text ("left", "center" or "right")
 * @param [style.stroke="black"] {String} A canvas fillstyle that will be used on the text stroke eg "blue", "#FCFF00"
 * @param [style.strokeThickness=0] {number} A number that represents the thickness of the stroke. Default is 0 (no stroke)
 * @param [style.wordWrap=false] {Boolean} Indicates if word wrap should be used
 * @param [style.wordWrapWidth=100] {number} The width at which text will wrap
 */
PIXI.Text.prototype.setStyle = function(style)
{
    style = style || {};
    style.font = style.font || "bold 20pt Arial";
    style.fill = style.fill || "black";
    style.align = style.align || "left";
    style.stroke = style.stroke || "black"; //provide a default, see: https://github.com/GoodBoyDigital/pixi.js/issues/136
    style.strokeThickness = style.strokeThickness || 0;
    style.wordWrap = style.wordWrap || false;
    style.wordWrapWidth = style.wordWrapWidth || 100;
    this.style = style;
    this.dirty = true;
};

/**
 * Set the copy for the text object. To split a line you can use "\n"
 *
 * @methos setText
 * @param {String} text The copy that you would like the text to display
 */
PIXI.Sprite.prototype.setText = function(text)
{
    this.text = text.toString() || " ";
    this.dirty = true;
};

/**
 * Renders text
 *
 * @method updateText
 * @private
 */
PIXI.Text.prototype.updateText = function()
{
	this.context.font = this.style.font;
	
	var outputText = this.text;
	
	// word wrap
	// preserve original text
	if(this.style.wordWrap)outputText = this.wordWrap(this.text);

	//split text into lines
	var lines = outputText.split(/(?:\r\n|\r|\n)/);

	//calculate text width
	var lineWidths = [];
	var maxLineWidth = 0;
	for (var i = 0; i < lines.length; i++)
	{
		var lineWidth = this.context.measureText(lines[i]).width;
		lineWidths[i] = lineWidth;
		maxLineWidth = Math.max(maxLineWidth, lineWidth);
	}
	this.canvas.width = maxLineWidth + this.style.strokeThickness;
	
	//calculate text height
	var lineHeight = this.determineFontHeight("font: " + this.style.font  + ";") + this.style.strokeThickness;
	this.canvas.height = lineHeight * lines.length;

	//set canvas text styles
	this.context.fillStyle = this.style.fill;
	this.context.font = this.style.font;
	
	this.context.strokeStyle = this.style.stroke;
	this.context.lineWidth = this.style.strokeThickness;

	this.context.textBaseline = "top";

	//draw lines line by line
	for (i = 0; i < lines.length; i++)
	{
		var linePosition = new PIXI.Point(this.style.strokeThickness / 2, this.style.strokeThickness / 2 + i * lineHeight);
	
		if(this.style.align == "right")
		{
			linePosition.x += maxLineWidth - lineWidths[i];
		}
		else if(this.style.align == "center")
		{
			linePosition.x += (maxLineWidth - lineWidths[i]) / 2;
		}

		if(this.style.stroke && this.style.strokeThickness)
		{
			this.context.strokeText(lines[i], linePosition.x, linePosition.y);
		}

		if(this.style.fill)
		{
			this.context.fillText(lines[i], linePosition.x, linePosition.y);
		}
	}
	
    this.updateTexture();
};

/**
 * Updates texture size based on canvas size
 *
 * @method updateTexture
 * @private
 */
PIXI.Text.prototype.updateTexture = function()
{
    this.texture.baseTexture.width = this.canvas.width;
    this.texture.baseTexture.height = this.canvas.height;
    this.texture.frame.width = this.canvas.width;
    this.texture.frame.height = this.canvas.height;
    
  	this._width = this.canvas.width;
    this._height = this.canvas.height;
	
    PIXI.texturesToUpdate.push(this.texture.baseTexture);
};

/**
 * Updates the transfor of this object
 *
 * @method updateTransform
 * @private
 */
PIXI.Text.prototype.updateTransform = function()
{
	if(this.dirty)
	{
		this.updateText();	
		this.dirty = false;
	}
	
	PIXI.Sprite.prototype.updateTransform.call(this);
};

/*
 * http://stackoverflow.com/users/34441/ellisbben
 * great solution to the problem!
 *
 * @method determineFontHeight
 * @param fontStyle {Object}
 * @private
 */
PIXI.Text.prototype.determineFontHeight = function(fontStyle) 
{
	// build a little reference dictionary so if the font style has been used return a
	// cached version...
	var result = PIXI.Text.heightCache[fontStyle];
	
	if(!result)
	{
		var body = document.getElementsByTagName("body")[0];
		var dummy = document.createElement("div");
		var dummyText = document.createTextNode("M");
		dummy.appendChild(dummyText);
		dummy.setAttribute("style", fontStyle + ';position:absolute;top:0;left:0');
		body.appendChild(dummy);
		
		result = dummy.offsetHeight;
		PIXI.Text.heightCache[fontStyle] = result;
		
		body.removeChild(dummy);
	}
	
	return result;
};

/**
 * A Text Object will apply wordwrap
 *
 * @method wordWrap
 * @param text {String}
 * @private
 */
PIXI.Text.prototype.wordWrap = function(text)
{
	// search good wrap position
	var searchWrapPos = function(ctx, text, start, end, wrapWidth)
	{
		var p = Math.floor((end-start) / 2) + start;
		if(p == start) {
			return 1;
		}
		
		if(ctx.measureText(text.substring(0,p)).width <= wrapWidth)
		{
			if(ctx.measureText(text.substring(0,p+1)).width > wrapWidth)
			{
				return p;
			}
			else
			{
				return arguments.callee(ctx, text, p, end, wrapWidth);
			}
		}
		else
		{
			return arguments.callee(ctx, text, start, p, wrapWidth);
		}
	};
	 
	var lineWrap = function(ctx, text, wrapWidth)
	{
		if(ctx.measureText(text).width <= wrapWidth || text.length < 1)
		{
			return text;
		}
		var pos = searchWrapPos(ctx, text, 0, text.length, wrapWidth);
		return text.substring(0, pos) + "\n" + arguments.callee(ctx, text.substring(pos), wrapWidth);
	};
	
	var result = "";
	var lines = text.split("\n");
	for (var i = 0; i < lines.length; i++)
	{
		result += lineWrap(this.context, lines[i], this.style.wordWrapWidth) + "\n";
	}
	
	return result;
};

/**
 * Destroys this text object
 *
 * @method destroy
 * @param destroyTexture {Boolean}
 */
PIXI.Text.prototype.destroy = function(destroyTexture)
{
	if(destroyTexture)
	{
		this.texture.destroy();
	}
		
};

PIXI.Text.heightCache = {};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

PIXI.BaseTextureCache = {};
PIXI.texturesToUpdate = [];
PIXI.texturesToDestroy = [];

/**
 * A texture stores the information that represents an image. All textures have a base texture
 *
 * @class BaseTexture
 * @uses EventTarget
 * @constructor
 * @param source {String} the source object (image or canvas)
 */
PIXI.BaseTexture = function(source)
{
	PIXI.EventTarget.call( this );

	/**
	 * [read-only] The width of the base texture set when the image has loaded
	 *
	 * @property width
	 * @type Number
	 * @readOnly
	 */
	this.width = 100;

	/**
	 * [read-only] The height of the base texture set when the image has loaded
	 *
	 * @property height
	 * @type Number
	 * @readOnly
	 */
	this.height = 100;

	/**
	 * [read-only] Describes if the base texture has loaded or not
	 *
	 * @property hasLoaded
	 * @type Boolean
	 * @readOnly
	 */
	this.hasLoaded = false;

	/**
	 * The source that is loaded to create the texture
	 *
	 * @property source
	 * @type Image
	 */
	this.source = source;

	if(!source)return;

	if(this.source instanceof Image || this.source instanceof HTMLImageElement)
	{
		if(this.source.complete)
		{
			this.hasLoaded = true;
			this.width = this.source.width;
			this.height = this.source.height;
			
			PIXI.texturesToUpdate.push(this);
		}
		else
		{
			
			var scope = this;
			this.source.onload = function(){
				
				scope.hasLoaded = true;
				scope.width = scope.source.width;
				scope.height = scope.source.height;
			
				// add it to somewhere...
				PIXI.texturesToUpdate.push(scope);
				scope.dispatchEvent( { type: 'loaded', content: scope } );
			}
			//	this.image.src = imageUrl;
		}
	}
	else
	{
		this.hasLoaded = true;
		this.width = this.source.width;
		this.height = this.source.height;
			
		PIXI.texturesToUpdate.push(this);
	}

	this._powerOf2 = false;
}

PIXI.BaseTexture.prototype.constructor = PIXI.BaseTexture;

/**
 * Destroys this base texture
 *
 * @method destroy
 */
PIXI.BaseTexture.prototype.destroy = function()
{
	if(this.source instanceof Image)
	{
		this.source.src = null;
	}
	this.source = null;
	PIXI.texturesToDestroy.push(this);
}

/**
 * Helper function that returns a base texture based on an image url
 * If the image is not in the base texture cache it will be  created and loaded
 *
 * @static
 * @method fromImage
 * @param imageUrl {String} The image url of the texture
 * @return BaseTexture
 */
PIXI.BaseTexture.fromImage = function(imageUrl, crossorigin)
{
	var baseTexture = PIXI.BaseTextureCache[imageUrl];
	if(!baseTexture)
	{
		// new Image() breaks tex loading in some versions of Chrome.
		// See https://code.google.com/p/chromium/issues/detail?id=238071
		var image = new Image();//document.createElement('img'); 
		if (crossorigin)
		{
			image.crossOrigin = '';
		}
		image.src = imageUrl;
		baseTexture = new PIXI.BaseTexture(image);
		PIXI.BaseTextureCache[imageUrl] = baseTexture;
	}

	return baseTexture;
}

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

PIXI.TextureCache = {};
PIXI.FrameCache = {};

/**
 * A texture stores the information that represents an image or part of an image. It cannot be added
 * to the display list directly. To do this use PIXI.Sprite. If no frame is provided then the whole image is used
 *
 * @class Texture
 * @uses EventTarget
 * @constructor
 * @param baseTexture {BaseTexture} The base texture source to create the texture from
 * @param frmae {Rectangle} The rectangle frame of the texture to show
 */
PIXI.Texture = function(baseTexture, frame)
{
	PIXI.EventTarget.call( this );

	if(!frame)
	{
		this.noFrame = true;
		frame = new PIXI.Rectangle(0,0,1,1);
	}

	if(baseTexture instanceof PIXI.Texture)
		baseTexture = baseTexture.baseTexture;

	/**
	 * The base texture of this texture
	 *
	 * @property baseTexture
	 * @type BaseTexture
	 */
	this.baseTexture = baseTexture;

	/**
	 * The frame specifies the region of the base texture that this texture uses
	 *
	 * @property frame
	 * @type Rectangle
	 */
	this.frame = frame;

	/**
	 * The trim point
	 *
	 * @property trim
	 * @type Point
	 */
	this.trim = new PIXI.Point();

	this.scope = this;

	if(baseTexture.hasLoaded)
	{
		if(this.noFrame)frame = new PIXI.Rectangle(0,0, baseTexture.width, baseTexture.height);
		//console.log(frame)
		
		this.setFrame(frame);
	}
	else
	{
		var scope = this;
		baseTexture.addEventListener( 'loaded', function(){ scope.onBaseTextureLoaded()} );
	}
}

PIXI.Texture.prototype.constructor = PIXI.Texture;

/**
 * Called when the base texture is loaded
 *
 * @method onBaseTextureLoaded
 * @param event
 * @private
 */
PIXI.Texture.prototype.onBaseTextureLoaded = function(event)
{
	var baseTexture = this.baseTexture;
	baseTexture.removeEventListener( 'loaded', this.onLoaded );

	if(this.noFrame)this.frame = new PIXI.Rectangle(0,0, baseTexture.width, baseTexture.height);
	this.noFrame = false;
	this.width = this.frame.width;
	this.height = this.frame.height;

	this.scope.dispatchEvent( { type: 'update', content: this } );
}

/**
 * Destroys this texture
 *
 * @method destroy
 * @param destroyBase {Boolean} Whether to destroy the base texture as well
 */
PIXI.Texture.prototype.destroy = function(destroyBase)
{
	if(destroyBase)this.baseTexture.destroy();
}

/**
 * Specifies the rectangle region of the baseTexture
 *
 * @method setFrame
 * @param frame {Rectangle} The frame of the texture to set it to
 */
PIXI.Texture.prototype.setFrame = function(frame)
{
	this.frame = frame;
	this.width = frame.width;
	this.height = frame.height;

	if(frame.x + frame.width > this.baseTexture.width || frame.y + frame.height > this.baseTexture.height)
	{
		throw new Error("Texture Error: frame does not fit inside the base Texture dimensions " + this);
	}

	this.updateFrame = true;

	PIXI.Texture.frameUpdates.push(this);
	//this.dispatchEvent( { type: 'update', content: this } );
}

/**
 * Helper function that returns a texture based on an image url
 * If the image is not in the texture cache it will be  created and loaded
 *
 * @static
 * @method fromImage
 * @param imageUrl {String} The image url of the texture
 * @param crossorigin {Boolean} Whether requests should be treated as crossorigin
 * @return Texture
 */
PIXI.Texture.fromImage = function(imageUrl, crossorigin)
{
	var texture = PIXI.TextureCache[imageUrl];
	
	if(!texture)
	{
		texture = new PIXI.Texture(PIXI.BaseTexture.fromImage(imageUrl, crossorigin));
		PIXI.TextureCache[imageUrl] = texture;
	}
	
	return texture;
}

/**
 * Helper function that returns a texture based on a frame id
 * If the frame id is not in the texture cache an error will be thrown
 *
 * @static
 * @method fromFrame
 * @param frameId {String} The frame id of the texture
 * @return Texture
 */
PIXI.Texture.fromFrame = function(frameId)
{
	var texture = PIXI.TextureCache[frameId];
	if(!texture)throw new Error("The frameId '"+ frameId +"' does not exist in the texture cache " + this);
	return texture;
}

/**
 * Helper function that returns a texture based on a canvas element
 * If the canvas is not in the texture cache it will be  created and loaded
 *
 * @static
 * @method fromCanvas
 * @param canvas {Canvas} The canvas element source of the texture
 * @return Texture
 */
PIXI.Texture.fromCanvas = function(canvas)
{
	var	baseTexture = new PIXI.BaseTexture(canvas);
	return new PIXI.Texture(baseTexture);
}


/**
 * Adds a texture to the textureCache.
 *
 * @static
 * @method addTextureToCache
 * @param texture {Texture}
 * @param id {String} the id that the texture will be stored against.
 */
PIXI.Texture.addTextureToCache = function(texture, id)
{
	PIXI.TextureCache[id] = texture;
}

/**
 * Remove a texture from the textureCache. 
 *
 * @static
 * @method removeTextureFromCache
 * @param id {String} the id of the texture to be removed
 * @return {Texture} the texture that was removed
 */
PIXI.Texture.removeTextureFromCache = function(id)
{
	var texture = PIXI.TextureCache[id]
	PIXI.TextureCache[id] = null;
	return texture;
}

// this is more for webGL.. it contains updated frames..
PIXI.Texture.frameUpdates = [];


/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 A RenderTexture is a special texture that allows any pixi displayObject to be rendered to it.

 __Hint__: All DisplayObjects (exmpl. Sprites) that renders on RenderTexture should be preloaded. 
 Otherwise black rectangles will be drawn instead.  
 
 RenderTexture takes snapshot of DisplayObject passed to render method. If DisplayObject is passed to render method, position and rotation of it will be ignored. For example:
 
	var renderTexture = new PIXI.RenderTexture(800, 600);
	var sprite = PIXI.Sprite.fromImage("spinObj_01.png");
	sprite.position.x = 800/2;
	sprite.position.y = 600/2;
	sprite.anchor.x = 0.5;
	sprite.anchor.y = 0.5;
	renderTexture.render(sprite);

 Sprite in this case will be rendered to 0,0 position. To render this sprite at center DisplayObjectContainer should be used:

	var doc = new PIXI.DisplayObjectContainer();
	doc.addChild(sprite);
	renderTexture.render(doc);  // Renders to center of renderTexture

 @class RenderTexture
 @extends Texture
 @constructor
 @param width {number} The width of the render texture
 @param height {number} The height of the render texture
 */
PIXI.RenderTexture = function(width, height)
{
	PIXI.EventTarget.call( this );

	this.width = width || 100;
	this.height = height || 100;

	this.indetityMatrix = PIXI.mat3.create();

	this.frame = new PIXI.Rectangle(0, 0, this.width, this.height);	

	if(PIXI.gl)
	{
		this.initWebGL();
	}
	else
	{
		this.initCanvas();
	}
}

PIXI.RenderTexture.prototype = Object.create( PIXI.Texture.prototype );
PIXI.RenderTexture.prototype.constructor = PIXI.RenderTexture;

/**
 * Initializes the webgl data for this texture
 *
 * @method initWebGL
 * @private
 */
PIXI.RenderTexture.prototype.initWebGL = function()
{
	var gl = PIXI.gl;
	this.glFramebuffer = gl.createFramebuffer();

   	gl.bindFramebuffer(gl.FRAMEBUFFER, this.glFramebuffer );

    this.glFramebuffer.width = this.width;
    this.glFramebuffer.height = this.height;	

	this.baseTexture = new PIXI.BaseTexture();

	this.baseTexture.width = this.width;
	this.baseTexture.height = this.height;

    this.baseTexture._glTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.baseTexture._glTexture);

	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,  this.width,  this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

	this.baseTexture.isRender = true;

	gl.bindFramebuffer(gl.FRAMEBUFFER, this.glFramebuffer );
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.baseTexture._glTexture, 0);

	// create a projection matrix..
	this.projection = new PIXI.Point(this.width/2 , this.height/2);

	// set the correct render function..
	this.render = this.renderWebGL;

	
}


PIXI.RenderTexture.prototype.resize = function(width, height)
{

	this.width = width;
	this.height = height;
	
	if(PIXI.gl)
	{
		this.projection.x = this.width/2
		this.projection.y = this.height/2;
	
		var gl = PIXI.gl;
		gl.bindTexture(gl.TEXTURE_2D, this.baseTexture._glTexture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,  this.width,  this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	}
	else
	{
		
		this.frame.width = this.width
		this.frame.height = this.height;
		this.renderer.resize(this.width, this.height);
	}
}

/**
 * Initializes the canvas data for this texture
 *
 * @method initCanvas
 * @private
 */
PIXI.RenderTexture.prototype.initCanvas = function()
{
	this.renderer = new PIXI.CanvasRenderer(this.width, this.height, null, 0);

	this.baseTexture = new PIXI.BaseTexture(this.renderer.view);
	this.frame = new PIXI.Rectangle(0, 0, this.width, this.height);

	this.render = this.renderCanvas;
}

/**
 * This function will draw the display object to the texture.
 *
 * @method renderWebGL
 * @param displayObject {DisplayObject} The display object to render this texture on
 * @param clear {Boolean} If true the texture will be cleared before the displayObject is drawn
 * @private
 */
PIXI.RenderTexture.prototype.renderWebGL = function(displayObject, position, clear)
{
	var gl = PIXI.gl;

	// enable the alpha color mask..
	gl.colorMask(true, true, true, true); 

	gl.viewport(0, 0, this.width, this.height);	

	gl.bindFramebuffer(gl.FRAMEBUFFER, this.glFramebuffer );

	if(clear)
	{
		gl.clearColor(0,0,0, 0);     
		gl.clear(gl.COLOR_BUFFER_BIT);
	}

	// THIS WILL MESS WITH HIT TESTING!
	var children = displayObject.children;

	//TODO -? create a new one??? dont think so!
	var originalWorldTransform = displayObject.worldTransform;
	displayObject.worldTransform = PIXI.mat3.create();//sthis.indetityMatrix;
	// modify to flip...
	displayObject.worldTransform[4] = -1;
	displayObject.worldTransform[5] = this.projection.y * 2;

	
	if(position)
	{
		displayObject.worldTransform[2] = position.x;
		displayObject.worldTransform[5] -= position.y;
	}
	
	PIXI.visibleCount++;
	displayObject.vcount = PIXI.visibleCount;
	
	for(var i=0,j=children.length; i<j; i++)
	{
		children[i].updateTransform();	
	}

	var renderGroup = displayObject.__renderGroup;

	if(renderGroup)
	{
		if(displayObject == renderGroup.root)
		{
			renderGroup.render(this.projection);
		}
		else
		{
			renderGroup.renderSpecific(displayObject, this.projection);
		}
	}
	else
	{
		if(!this.renderGroup)this.renderGroup = new PIXI.WebGLRenderGroup(gl);
		this.renderGroup.setRenderable(displayObject);
		this.renderGroup.render(this.projection);
	}

	displayObject.worldTransform = originalWorldTransform;
}


/**
 * This function will draw the display object to the texture.
 *
 * @method renderCanvas
 * @param displayObject {DisplayObject} The display object to render this texture on
 * @param clear {Boolean} If true the texture will be cleared before the displayObject is drawn
 * @private
 */
PIXI.RenderTexture.prototype.renderCanvas = function(displayObject, position, clear)
{
	var children = displayObject.children;

	displayObject.worldTransform = PIXI.mat3.create();
	
	if(position)
	{
		displayObject.worldTransform[2] = position.x;
		displayObject.worldTransform[5] = position.y;
	}
	

	for(var i=0,j=children.length; i<j; i++)
	{
		children[i].updateTransform();	
	}

	if(clear)this.renderer.context.clearRect(0,0, this.width, this.height);
	
    this.renderer.renderDisplayObject(displayObject);
    
    this.renderer.context.setTransform(1,0,0,1,0,0); 
    

  //  PIXI.texturesToUpdate.push(this.baseTexture);
}


/**
 * https://github.com/mrdoob/eventtarget.js/
 * THankS mr DOob!
 */

/**
 * Adds event emitter functionality to a class
 *
 * @class EventTarget
 * @example
 *		function MyEmitter() {
 *			PIXI.EventTarget.call(this); //mixes in event target stuff
 *		}
 *
 *		var em = new MyEmitter();
 *		em.emit({ type: 'eventName', data: 'some data' });
 */
PIXI.EventTarget = function () {

	var listeners = {};
	
	this.addEventListener = this.on = function ( type, listener ) {
		
		
		if ( listeners[ type ] === undefined ) {

			listeners[ type ] = [];
			
		}

		if ( listeners[ type ].indexOf( listener ) === - 1 ) {

			listeners[ type ].push( listener );
		}

	};

	this.dispatchEvent = this.emit = function ( event ) {
		
		for ( var listener in listeners[ event.type ] ) {

			listeners[ event.type ][ listener ]( event );
			
		}

	};

	this.removeEventListener = this.off = function ( type, listener ) {

		var index = listeners[ type ].indexOf( listener );

		if ( index !== - 1 ) {

			listeners[ type ].splice( index, 1 );

		}

	};

};

/*
	PolyK library
	url: http://polyk.ivank.net
	Released under MIT licence.
	
	Copyright (c) 2012 Ivan Kuckir

	Permission is hereby granted, free of charge, to any person
	obtaining a copy of this software and associated documentation
	files (the "Software"), to deal in the Software without
	restriction, including without limitation the rights to use,
	copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the
	Software is furnished to do so, subject to the following
	conditions:

	The above copyright notice and this permission notice shall be
	included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	OTHER DEALINGS IN THE SOFTWARE.

	This is an amazing lib! 
	
	slightly modified by mat groves (matgroves.com);
*/

PIXI.PolyK = {};

/**
 * Triangulates shapes for webGL graphic fills
 *
 * @method Triangulate
 * @namespace PolyK
 * @constructor
 */
PIXI.PolyK.Triangulate = function(p)
{
	var sign = true;
	
	var n = p.length>>1;
	if(n<3) return [];
	var tgs = [];
	var avl = [];
	for(var i=0; i<n; i++) avl.push(i);
	
	var i = 0;
	var al = n;
	while(al > 3)
	{
		var i0 = avl[(i+0)%al];
		var i1 = avl[(i+1)%al];
		var i2 = avl[(i+2)%al];
		
		var ax = p[2*i0],  ay = p[2*i0+1];
		var bx = p[2*i1],  by = p[2*i1+1];
		var cx = p[2*i2],  cy = p[2*i2+1];
		
		var earFound = false;
		if(PIXI.PolyK._convex(ax, ay, bx, by, cx, cy, sign))
		{
			earFound = true;
			for(var j=0; j<al; j++)
			{
				var vi = avl[j];
				if(vi==i0 || vi==i1 || vi==i2) continue;
				if(PIXI.PolyK._PointInTriangle(p[2*vi], p[2*vi+1], ax, ay, bx, by, cx, cy)) {earFound = false; break;}
			}
		}
		if(earFound)
		{
			tgs.push(i0, i1, i2);
			avl.splice((i+1)%al, 1);
			al--;
			i = 0;
		}
		else if(i++ > 3*al) 
		{
			// need to flip flip reverse it!
			// reset!
			if(sign)
			{
				var tgs = [];
				avl = [];
				for(var i=0; i<n; i++) avl.push(i);
				
				i = 0;
				al = n;
				
				sign = false;
			}
			else
			{
				console.log("PIXI Warning: shape too complex to fill")
				return [];
			}				
		}
	}
	tgs.push(avl[0], avl[1], avl[2]);
	return tgs;
}

/**
 * Checks if a point is within a triangle
 *
 * @class _PointInTriangle
 * @namespace PolyK
 * @private
 */
PIXI.PolyK._PointInTriangle = function(px, py, ax, ay, bx, by, cx, cy)
{
	var v0x = cx-ax;
	var v0y = cy-ay;
	var v1x = bx-ax;
	var v1y = by-ay;
	var v2x = px-ax;
	var v2y = py-ay;
	
	var dot00 = v0x*v0x+v0y*v0y;
	var dot01 = v0x*v1x+v0y*v1y;
	var dot02 = v0x*v2x+v0y*v2y;
	var dot11 = v1x*v1x+v1y*v1y;
	var dot12 = v1x*v2x+v1y*v2y;
	
	var invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
	var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
	var v = (dot00 * dot12 - dot01 * dot02) * invDenom;

	// Check if point is in triangle
	return (u >= 0) && (v >= 0) && (u + v < 1);
}

/**
 * Checks if a shape is convex
 *
 * @class _convex
 * @namespace PolyK
 * @private
 */
PIXI.PolyK._convex = function(ax, ay, bx, by, cx, cy, sign)
{
	return ((ay-by)*(cx-bx) + (bx-ax)*(cy-by) >= 0) == sign;
}

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A Camera is your view into the game world. It has a position and size and renders only those objects within its field of view.
* The game automatically creates a single Stage sized camera on boot. Move the camera around the world with Phaser.Camera.x/y
*
* @class Phaser.Camera
* @constructor
* @param {Phaser.Game} game - Game reference to the currently running game.
* @param {number} id - Not being used at the moment, will be when Phaser supports multiple camera
* @param {number} x - Position of the camera on the X axis
* @param {number} y - Position of the camera on the Y axis
* @param {number} width - The width of the view rectangle
* @param {number} height - The height of the view rectangle
*/
Phaser.Camera = function (game, id, x, y, width, height) {
    
	/**
	* @property {Phaser.Game} game - A reference to the currently running Game.
	*/
	this.game = game;

	/**
	* @property {Phaser.World} world - A reference to the game world.
	*/
	this.world = game.world;

	/**
	* @property {number} id - Reserved for future multiple camera set-ups.
	* @default
	*/
	this.id = 0; 

	/**
	* Camera view. 
	* The view into the world we wish to render (by default the game dimensions).
    * The x/y values are in world coordinates, not screen coordinates, the width/height is how many pixels to render.
    * Objects outside of this view are not rendered (unless set to ignore the Camera, i.e. UI?).
	* @property {Phaser.Rectangle} view
	*/
    this.view = new Phaser.Rectangle(x, y, width, height);

    /**
	* @property {Phaser.Rectangle} screenView - Used by Sprites to work out Camera culling.
	*/
	this.screenView = new Phaser.Rectangle(x, y, width, height);

    /**
    * The Camera is bound to this Rectangle and cannot move outside of it. By default it is enabled and set to the size of the World.
    * The Rectangle can be located anywhere in the world and updated as often as you like. If you don't wish the Camera to be bound
    * at all then set this to null. The values can be anything and are in World coordinates, with 0,0 being the center of the world.
    * @property {Phaser.Rectangle} bounds - The Rectangle in which the Camera is bounded. Set to null to allow for movement anywhere.
    */
    this.bounds = new Phaser.Rectangle(x, y, width, height);

    /**
	* @property {Phaser.Rectangle} deadzone - Moving inside this Rectangle will not cause camera moving.
	*/
    this.deadzone = null;

	/**
	* @property {boolean} visible - Whether this camera is visible or not.
	* @default
	*/
    this.visible = true;

	/**
	* @property {boolean} atLimit - Whether this camera is flush with the World Bounds or not.
    */
    this.atLimit = { x: false, y: false };

	/**
	* @property {Phaser.Sprite} target - If the camera is tracking a Sprite, this is a reference to it, otherwise null.
    * @default
    */
    this.target = null;

	/**
	* @property {number} edge - Edge property.
    * @private
    * @default
    */
    this._edge = 0;

    this.displayObject = null;
	
};

/**
* @constant
* @type {number}
*/
Phaser.Camera.FOLLOW_LOCKON = 0;

/**
* @constant
* @type {number}
*/
Phaser.Camera.FOLLOW_PLATFORMER = 1;

/**
* @constant
* @type {number}
*/
Phaser.Camera.FOLLOW_TOPDOWN = 2;

/**
* @constant
* @type {number}
*/
Phaser.Camera.FOLLOW_TOPDOWN_TIGHT = 3;

Phaser.Camera.prototype = {

	/**
    * Tells this camera which sprite to follow.
    * @method Phaser.Camera#follow
    * @param {Phaser.Sprite} target - The object you want the camera to track. Set to null to not follow anything.
    * @param {number} [style] Leverage one of the existing "deadzone" presets. If you use a custom deadzone, ignore this parameter and manually specify the deadzone after calling follow().
    */
    follow: function (target, style) {

        if (typeof style === "undefined") { style = Phaser.Camera.FOLLOW_LOCKON; }

        this.target = target;

        var helper;

        switch (style) {

            case Phaser.Camera.FOLLOW_PLATFORMER:
                var w = this.width / 8;
                var h = this.height / 3;
                this.deadzone = new Phaser.Rectangle((this.width - w) / 2, (this.height - h) / 2 - h * 0.25, w, h);
                break;

            case Phaser.Camera.FOLLOW_TOPDOWN:
                helper = Math.max(this.width, this.height) / 4;
                this.deadzone = new Phaser.Rectangle((this.width - helper) / 2, (this.height - helper) / 2, helper, helper);
                break;

            case Phaser.Camera.FOLLOW_TOPDOWN_TIGHT:
                helper = Math.max(this.width, this.height) / 8;
                this.deadzone = new Phaser.Rectangle((this.width - helper) / 2, (this.height - helper) / 2, helper, helper);
                break;

            case Phaser.Camera.FOLLOW_LOCKON:
            default:
                this.deadzone = null;
                break;
        }

    },

    /**
    * Move the camera focus on a display object instantly.
    * @method Phaser.Camera#focusOn
    * @param {any} displayObject - The display object to focus the camera on. Must have visible x/y properties.
    */
    focusOn: function (displayObject) {

        this.setPosition(Math.round(displayObject.x - this.view.halfWidth), Math.round(displayObject.y - this.view.halfHeight));

    },

	/**
    * Move the camera focus on a location instantly.
    * @method Phaser.Camera#focusOnXY
    * @param {number} x - X position.
    * @param {number} y - Y position.
    */
    focusOnXY: function (x, y) {

        this.setPosition(Math.round(x - this.view.halfWidth), Math.round(y - this.view.halfHeight));

    },

	/**
    * Update focusing and scrolling.
    * @method Phaser.Camera#update
    */
    update: function () {

        if (this.target)
        {
            this.updateTarget();
        }

        if (this.bounds)
        {
            this.checkBounds();
        }

        this.displayObject.position.x = -this.view.x;
        this.displayObject.position.y = -this.view.y;

    },

    updateTarget: function () {

        if (this.deadzone)
        {
            this._edge = this.target.x - this.deadzone.x;

            if (this.view.x > this._edge)
            {
                this.view.x = this._edge;
            }

            this._edge = this.target.x + this.target.width - this.deadzone.x - this.deadzone.width;

            if (this.view.x < this._edge)
            {
                this.view.x = this._edge;
            }

            this._edge = this.target.y - this.deadzone.y;

            if (this.view.y > this._edge)
            {
                this.view.y = this._edge;
            }

            this._edge = this.target.y + this.target.height - this.deadzone.y - this.deadzone.height;

            if (this.view.y < this._edge)
            {
                this.view.y = this._edge;
            }
        }
        else
        {
            this.focusOnXY(this.target.x, this.target.y);
        }

    },

    setBoundsToWorld: function () {

        this.bounds.setTo(this.game.world.x, this.game.world.y, this.game.world.width, this.game.world.height);

    },

    /**
    * Method called to ensure the camera doesn't venture outside of the game world.
    * @method Phaser.Camera#checkWorldBounds
    */
    checkBounds: function () {

        this.atLimit.x = false;
        this.atLimit.y = false;

        //  Make sure we didn't go outside the cameras bounds
        if (this.view.x < this.bounds.x)
        {
            this.atLimit.x = true;
            this.view.x = this.bounds.x;
        }

        if (this.view.x > this.bounds.right - this.width)
        {
            this.atLimit.x = true;
            this.view.x = (this.bounds.right - this.width) + 1;
        }

        if (this.view.y < this.bounds.top)
        {
            this.atLimit.y = true;
            this.view.y = this.bounds.top;
        }

        if (this.view.y > this.bounds.bottom - this.height)
        {
            this.atLimit.y = true;
            this.view.y = (this.bounds.bottom - this.height) + 1;
        }

        this.view.floor();

    },

    /**
    * A helper function to set both the X and Y properties of the camera at once
    * without having to use game.camera.x and game.camera.y.
    * 
    * @method Phaser.Camera#setPosition
    * @param {number} x - X position.
    * @param {number} y - Y position.
    */
    setPosition: function (x, y) {

        this.view.x = x;
        this.view.y = y;

        if (this.bounds)
        {
            this.checkBounds();
        }

    },

    /**
    * Sets the size of the view rectangle given the width and height in parameters.
    * 
    * @method Phaser.Camera#setSize
    * @param {number} width - The desired width.
    * @param {number} height - The desired height.
    */
    setSize: function (width, height) {

        this.view.width = width;
        this.view.height = height;

    }

};

/**
* The Cameras x coordinate. This value is automatically clamped if it falls outside of the World bounds.
* @name Phaser.Camera#x
* @property {number} x - Gets or sets the cameras x position.
*/
Object.defineProperty(Phaser.Camera.prototype, "x", {

    get: function () {
        return this.view.x;
    },
 
    set: function (value) {

        this.view.x = value;

        if (this.bounds)
        {
            this.checkBounds();
        }
    }

});

/**
* The Cameras y coordinate. This value is automatically clamped if it falls outside of the World bounds.
* @name Phaser.Camera#y
* @property {number} y - Gets or sets the cameras y position.
*/
Object.defineProperty(Phaser.Camera.prototype, "y", {
	
    get: function () {
        return this.view.y;
    },

    set: function (value) {

        this.view.y = value;

        if (this.bounds)
        {
            this.checkBounds();
        }
    }

});

/**
* The Cameras width. By default this is the same as the Game size and should not be adjusted for now.
* @name Phaser.Camera#width
* @property {number} width - Gets or sets the cameras width.
*/
Object.defineProperty(Phaser.Camera.prototype, "width", {

    get: function () {
        return this.view.width;
    },

    set: function (value) {
        this.view.width = value;
    }

});

/**
* The Cameras height. By default this is the same as the Game size and should not be adjusted for now.
* @name Phaser.Camera#height
* @property {number} height - Gets or sets the cameras height.
*/
Object.defineProperty(Phaser.Camera.prototype, "height", {

    get: function () {
        return this.view.height;
    },

    set: function (value) {
        this.view.height = value;
    }

});

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* This is a base State class which can be extended if you are creating your own game.
* It provides quick access to common functions such as the camera, cache, input, match, sound and more.
*
* @class Phaser.State
* @constructor
*/

Phaser.State = function () {

    /**
	* @property {Phaser.Game} game - A reference to the currently running Game.
	*/
    this.game = null;
    
	/**
	* @property {Phaser.GameObjectFactory} add - Reference to the GameObjectFactory.
	* @default
	*/
    this.add = null;
    
    /**
	* @property {Phaser.Physics.PhysicsManager} camera - A handy reference to world.camera.
	* @default
	*/
    this.camera = null;
    
    /**
	* @property {Phaser.Cache} cache - Reference to the assets cache.
	* @default
	*/
    this.cache = null;
    
    /**
	* @property {Phaser.Input} input - Reference to the input manager
	* @default
	*/
    this.input = null;
    
    /**
	* @property {Phaser.Loader} load - Reference to the assets loader.
	* @default
	*/
    this.load = null;
    
    /**
	* @property {Phaser.GameMath} math - Reference to the math helper.
	* @default
	*/
    this.math = null;
    
    /**
	* @property {Phaser.SoundManager} sound - Reference to the sound manager.
	* @default
	*/
    this.sound = null;
    
    /**
	* @property {Phaser.Stage} stage - Reference to the stage.
	* @default
	*/
    this.stage = null;
    
    /**
	* @property {Phaser.TimeManager} time - Reference to game clock.
	* @default
	*/
    this.time = null;
    
    /**
	* @property {Phaser.TweenManager} tweens - Reference to the tween manager.
	* @default
	*/
    this.tweens = null;
    
    /**
	* @property {Phaser.World} world - Reference to the world.
	* @default
	*/
    this.world = null;
    
	/**
	* @property {Description} add - Description.
	* @default
	*/
    this.particles = null;
    
    /**
	* @property {Phaser.Physics.PhysicsManager} physics - Reference to the physics manager.
	* @default
	*/
    this.physics = null;

};

Phaser.State.prototype = {

    /**
    * Override this method to add some load operations.
    * If you need to use the loader, you may need to use them here.
    * 
    * @method Phaser.State#preload
    */
    preload: function () {
    },

    /**
    * Put update logic here.
    * 
    * @method Phaser.State#loadUpdate
    */
    loadUpdate: function () {
    },

    /**
    * Put render operations here.
    * 
    * @method Phaser.State#loadRender
    */
    loadRender: function () {
    },

    /**
    * This method is called after the game engine successfully switches states.
    * Feel free to add any setup code here (do not load anything here, override preload() instead).
    * 
    * @method Phaser.State#create
    */
    create: function () {
    },

    /**
    * Put update logic here.
    * 
    * @method Phaser.State#update
    */
    update: function () {
    },

    /**
    * Put render operations here.
    * 
    * @method Phaser.State#render
    */
    render: function () {
    },

    /**
    * This method will be called when game paused.
    * 
    * @method Phaser.State#paused
    */
    paused: function () {
    },

    /**
    * This method will be called when the state is destroyed.
    * @method Phaser.State#destroy
    */
    destroy: function () {
    }

};

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The State Manager is responsible for loading, setting up and switching game states.
* 
* @class Phaser.StateManager
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {Phaser.State|Object} [pendingState=null] - A State object to seed the manager with.
*/
Phaser.StateManager = function (game, pendingState) {

	/**
	* A reference to the currently running game.
	* @property {Phaser.Game} game.
	*/
	this.game = game;

	/**
	* Description.
	* @property {Description} states.
	*/
	this.states = {};

	if (pendingState !== null)
	{
		this._pendingState = pendingState;
	}

};

Phaser.StateManager.prototype = {
	
	/**
	* A reference to the currently running game.
	* @property {Phaser.Game} game.
	*/
	game: null,

	/**
	* The state to be switched to in the next frame.
	* @property {State} _pendingState 
	* @private
	*/
	_pendingState: null,

	/**
	* Flag that sets if the State has been created or not.
	* @property {boolean}_created
	* @private
	*/
	_created: false,

	/**
	* The state to be switched to in the next frame.
	* @property {Description} states
	*/
	states: {},

	/**
	* The current active State object (defaults to null).
	* @property {string} current
	*/
	current: '',
	
	/**
	* This will be called when the state is started (i.e. set as the current active state).
	* @property {function} onInitCallback
	*/
	onInitCallback: null,

	/**
	* This will be called when init states (loading assets...).
	* @property {function} onPreloadCallback
	*/
	onPreloadCallback: null,
	
	/**
	* This will be called when create states (setup states...).
	* @property {function} onCreateCallback
	*/
	onCreateCallback: null,

	/**
	* This will be called when State is updated, this doesn't happen during load (@see onLoadUpdateCallback).
	* @property {function} onUpdateCallback
	*/
	onUpdateCallback: null,

	/**
	* This will be called when the State is rendered, this doesn't happen during load (see onLoadRenderCallback).
	* @property {function} onRenderCallback
	*/
	onRenderCallback: null,

	/**
	* This will be called before the State is rendered and before the stage is cleared.
	* @property {function} onPreRenderCallback
	*/
	onPreRenderCallback: null,

	/**
	* This will be called when the State is updated but only during the load process.
	* @property {function} onLoadUpdateCallback
	*/
	onLoadUpdateCallback: null,

	/**
	* This will be called when the State is rendered but only during the load process.
	* @property {function} onLoadRenderCallback
	*/
	onLoadRenderCallback: null,

	/**
	* This will be called when states paused.
	* @property {function} onPausedCallback
	*/
	onPausedCallback: null,

	/**
	* This will be called when the state is shut down (i.e. swapped to another state).
	* @property {function} onShutDownCallback
	*/
	onShutDownCallback: null,

	/**
	* Description.
	* @method Phaser.StateManager#boot
	* @private
	*/
	boot: function () {

		// console.log('Phaser.StateManager.boot');

		if (this._pendingState !== null)
		{
			// console.log('_pendingState found');
			// console.log(typeof this._pendingState);

			if (typeof this._pendingState === 'string')
			{
				//	State was already added, so just start it
				this.start(this._pendingState, false, false);
			}
			else
			{
				this.add('default', this._pendingState, true);
			}

		}

	},

	/**
    * Add a new State.
    * @method Phaser.StateManager#add
    * @param key {string} - A unique key you use to reference this state, i.e. "MainMenu", "Level1".
    * @param state {State} - The state you want to switch to.
    * @param autoStart {boolean} - Start the state immediately after creating it? (default true)
    */
    add: function (key, state, autoStart) {

        if (typeof autoStart === "undefined") { autoStart = false; }

		// console.log('Phaser.StateManager.addState', key);
		// console.log(typeof state);
		// console.log('autoStart?', autoStart);

		var newState;

		if (state instanceof Phaser.State)
		{
			// console.log('Phaser.StateManager.addState: Phaser.State given');
			newState = state;
		}
		else if (typeof state === 'object')
		{
			// console.log('Phaser.StateManager.addState: Object given');
			newState = state;
			newState.game = this.game;
		}
		else if (typeof state === 'function')
		{
			// console.log('Phaser.StateManager.addState: Function given');
			newState = new state(this.game);
		}

		this.states[key] = newState;

		if (autoStart)
		{
			if (this.game.isBooted)
			{
				// console.log('Game is booted, so we can start the state now');
				this.start(key);
			}
			else
			{
				// console.log('Game is NOT booted, so set the current state as pending');
				this._pendingState = key;
			}
		}

		return newState;

    },

	/**
     * Delete the given state.
     * @method Phaser.StateManager#remove
     * @param {string} key - A unique key you use to reference this state, i.e. "MainMenu", "Level1".
     */
    remove: function (key) {

    	if (this.current == key)
    	{
	        this.callbackContext = null;

	        this.onInitCallback = null;
	        this.onShutDownCallback = null;

	        this.onPreloadCallback = null;
	        this.onLoadRenderCallback = null;
	        this.onLoadUpdateCallback = null;
	        this.onCreateCallback = null;
	        this.onUpdateCallback = null;
	        this.onRenderCallback = null;
	        this.onPausedCallback = null;
	        this.onDestroyCallback = null;
    	}

    	delete this.states[key];

    },

	/**
    * Start the given state
    * @method Phaser.StateManager#start
    * @param {string} key - The key of the state you want to start.
    * @param {boolean} [clearWorld] - clear everything in the world? (Default to true)
    * @param {boolean} [clearCache] - clear asset cache? (Default to false and ONLY available when clearWorld=true)
    */
    start: function (key, clearWorld, clearCache) {

    	// console.log('Phaser.StateManager.start', key);
    	// console.log(this);
    	// console.log(this.callbackContext);

        if (typeof clearWorld === "undefined") { clearWorld = true; }
        if (typeof clearCache === "undefined") { clearCache = false; }

        if (this.game.isBooted == false)
        {
			// console.log('Game is NOT booted, so set the requested state as pending');
			this._pendingState = key;
			return;
        }

		if (this.checkState(key) == false)
		{
			return;
		}
		else
		{
			//	Already got a state running?
			if (this.current)
			{
				this.onShutDownCallback.call(this.callbackContext, this.game);
			}

	        if (clearWorld)
	        {
				this.game.tweens.removeAll();

	            this.game.world.destroy();

	            if (clearCache == true)
	            {
	                this.game.cache.destroy();
	            }
	        }

			this.setCurrentState(key);
		}

        if (this.onPreloadCallback)
        {
	    	// console.log('Preload Callback found');
            this.game.load.reset();
            this.onPreloadCallback.call(this.callbackContext, this.game);

            //  Is the loader empty?
            if (this.game.load.queueSize == 0)
            {
		    	// console.log('Loader queue empty');
                this.game.loadComplete();
            }
            else
            {
		    	// console.log('Loader started');
                //  Start the loader going as we have something in the queue
                this.game.load.start();
            }
        }
        else
        {
			// console.log('Preload callback not found');
            //  No init? Then there was nothing to load either
            this.game.loadComplete();
        }

    },
	
	/**
	* Used by onInit and onShutdown when those functions don't exist on the state
    * @method Phaser.StateManager#dummy
    * @private
    */
    dummy: function () {
    },

	/**
    * Description.
    * @method Phaser.StateManager#checkState
    * @param {string} key - The key of the state you want to check.
    * @return {boolean} Description.
    */
    checkState: function (key) {

		if (this.states[key])
		{
			var valid = false;

			if (this.states[key]['preload']) { valid = true; }

			if (valid == false && this.states[key]['loadRender']) { valid = true; }
			if (valid == false && this.states[key]['loadUpdate']) { valid = true; }
			if (valid == false && this.states[key]['create']) { valid = true; }
			if (valid == false && this.states[key]['update']) { valid = true; }
			if (valid == false && this.states[key]['preRender']) { valid = true; }
			if (valid == false && this.states[key]['render']) { valid = true; }
			if (valid == false && this.states[key]['paused']) { valid = true; }

        	if (valid == false)
        	{
	            console.warn("Invalid Phaser State object given. Must contain at least a one of the required functions.");
	            return false;
	        }

			return true;
		}
		else
		{
			console.warn("Phaser.StateManager - No state found with the key: " + key);
			return false;
		}

    },

	/**
    * Links game properties to the State given by the key.
    * @method Phaser.StateManager#link
    * @param {string} key - State key.
    * @protected
    */
    link: function (key) {

		// console.log('linked');
        this.states[key].game = this.game;
        this.states[key].add = this.game.add;
        this.states[key].camera = this.game.camera;
        this.states[key].cache = this.game.cache;
        this.states[key].input = this.game.input;
        this.states[key].load = this.game.load;
        this.states[key].math = this.game.math;
        this.states[key].sound = this.game.sound;
        this.states[key].stage = this.game.stage;
        this.states[key].time = this.game.time;
        this.states[key].tweens = this.game.tweens;
        this.states[key].world = this.game.world;
        this.states[key].particles = this.game.particles;
        this.states[key].physics = this.game.physics;
        this.states[key].rnd = this.game.rnd;

    },

	/**
    * Sets the current State. Should not be called directly (use StateManager.start)
    * @method Phaser.StateManager#setCurrentState
    * @param {string} key - State key.
    * @protected
    */
	setCurrentState: function (key) {

        this.callbackContext = this.states[key];

        this.link(key);

        //	Used when the state is set as being the current active state
        this.onInitCallback = this.states[key]['init'] || this.dummy;

        this.onPreloadCallback = this.states[key]['preload'] || null;
        this.onLoadRenderCallback = this.states[key]['loadRender'] || null;
        this.onLoadUpdateCallback = this.states[key]['loadUpdate'] || null;
        this.onCreateCallback = this.states[key]['create'] || null;
        this.onUpdateCallback = this.states[key]['update'] || null;
        this.onPreRenderCallback = this.states[key]['preRender'] || null;
        this.onRenderCallback = this.states[key]['render'] || null;
        this.onPausedCallback = this.states[key]['paused'] || null;

        //	Used when the state is no longer the current active state
        this.onShutDownCallback = this.states[key]['shutdown'] || this.dummy;

		this.current = key;
		this._created = false;

		this.onInitCallback.call(this.callbackContext, this.game);

	},

	/**
	* @method Phaser.StateManager#loadComplete
    * @protected
	*/
    loadComplete: function () {

		// console.log('Phaser.StateManager.loadComplete');

        if (this._created == false && this.onCreateCallback)
        {
			// console.log('Create callback found');
	        this._created = true;
            this.onCreateCallback.call(this.callbackContext, this.game);
        }
        else
        {
	        this._created = true;
        }

    },

	/**
	* @method Phaser.StateManager#update
    * @protected
	*/
    update: function () {

    	if (this._created && this.onUpdateCallback)
    	{
			this.onUpdateCallback.call(this.callbackContext, this.game);
    	}
    	else
    	{
		    if (this.onLoadUpdateCallback)
		    {
		    	this.onLoadUpdateCallback.call(this.callbackContext, this.game);
			}
		}

    },

	/**
	* @method Phaser.StateManager#preRender
    * @protected
	*/
    preRender: function () {

	    if (this.onPreRenderCallback)
	    {
	    	this.onPreRenderCallback.call(this.callbackContext, this.game);
		}

    },

	/**
	* @method Phaser.StateManager#render
    * @protected
	*/
    render: function () {

    	if (this._created && this.onRenderCallback)
    	{
			this.onRenderCallback.call(this.callbackContext, this.game);
    	}
    	else
    	{
		    if (this.onLoadRenderCallback)
		    {
		    	this.onLoadRenderCallback.call(this.callbackContext, this.game);
			}
		}

    },

	/**
    * Nuke the entire game from orbit
    * @method Phaser.StateManager#destroy
    */
    destroy: function () {

        this.callbackContext = null;

        this.onInitCallback = null;
        this.onShutDownCallback = null;

        this.onPreloadCallback = null;
        this.onLoadRenderCallback = null;
        this.onLoadUpdateCallback = null;
        this.onCreateCallback = null;
        this.onUpdateCallback = null;
        this.onRenderCallback = null;
        this.onPausedCallback = null;
        this.onDestroyCallback = null;

        this.game = null;
        this.states = {};
        this._pendingState = null;

    }

};

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A basic linked list data structure.
*
* @class Phaser.LinkedList
* @constructor
*/
Phaser.LinkedList = function () {

    /**
	* @property {object} next - Next element in the list.
	* @default
	*/
    this.next = null;

    /**
	* @property {object} prev - Previous element in the list.
	* @default
	*/
    this.prev = null;

    /**
	* @property {object} first - First element in the list.
	* @default
	*/
    this.first = null;

    /**
	* @property {object} last - Last element in the list.
	* @default
	*/
    this.last = null;
    
    /**
	* @property {object} game - Number of elements in the list.
	* @default
	*/
    this.total = 0;

};

Phaser.LinkedList.prototype = {

	/**
    * Adds a new element to this linked list.
	* 
	* @method Phaser.LinkedList#add
	* @param {object} child - The element to add to this list. Can be a Phaser.Sprite or any other object you need to quickly iterate through.
	* @return {object} The child that was added.
    */
    add: function (child) {

    	//	If the list is empty
    	if (this.total == 0 && this.first == null && this.last == null)
    	{
    		this.first = child;
    		this.last = child;
	    	this.next = child;
	    	child.prev = this;
	    	this.total++;
    		return child;
    	}

    	//	Get gets appended to the end of the list, regardless of anything, and it won't have any children of its own (non-nested list)
    	this.last.next = child;

    	child.prev = this.last;

    	this.last = child;

		this.total++;

		return child;

    },

	/**
    * Removes the given element from this linked list if it exists.
 	* 
 	* @method Phaser.LinkedList#remove
 	* @param {object} child - The child to be removed from the list.
    */
    remove: function (child) {

    	if (child == this.first)
    	{
			// It was 'first', make 'first' point to first.next
    		this.first = this.first.next;
    	}      
		else if (child == this.last)
		{
			// It was 'last', make 'last' point to last.prev
			this.last = this.last.prev;
		} 

		if (child.prev)
		{
			// make child.prev.next point to childs.next instead of child
			child.prev.next = child.next; 
		} 

		if (child.next)
		{
			// make child.next.prev point to child.prev instead of child
			child.next.prev = child.prev;
		}

		child.next = child.prev = null;

		if (this.first == null )
		{
			this.last = null;
		}

		this.total--;

    },

	/**
    * Calls a function on all members of this list, using the member as the context for the callback.
    * The function must exist on the member.
  	* 
  	* @method Phaser.LinkedList#callAll
  	* @param {function} callback - The function to call.
    */
    callAll: function (callback) {

    	if (!this.first || !this.last)
    	{
    		return;
    	}

		var entity = this.first;
		
		do	
		{
			if (entity && entity[callback])
			{
				entity[callback].call(entity);
			}

			entity = entity.next;

		}
		while(entity != this.last.next)			

    }

};
/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* @class Phaser.Signal
* @classdesc A Signal is used for object communication via a custom broadcaster instead of Events.
* @author Miller Medeiros http://millermedeiros.github.com/js-signals/
* @constructor
*/
Phaser.Signal = function () {

	/**
	* @property {Array.<Phaser.SignalBinding>} _bindings - Description.
	* @private
	*/
	this._bindings = [];
	
	/**
	* @property {Description} _prevParams - Description.
	* @private
	*/
	this._prevParams = null;

	// enforce dispatch to aways work on same context (#47)
	var self = this;

	/**
	* @property {Description} dispatch - Description.
	*/
	this.dispatch = function(){
		Phaser.Signal.prototype.dispatch.apply(self, arguments);
	};

};

Phaser.Signal.prototype = {

	/**
    * If Signal should keep record of previously dispatched parameters and
	* automatically execute listener during `add()`/`addOnce()` if Signal was
	* already dispatched before.
	* @property {boolean} memorize
	*/
	memorize: false,

	/**
	* @property {boolean} _shouldPropagate 
	* @private
	*/
	_shouldPropagate: true,

	/**
	* If Signal is active and should broadcast events.
	* <p><strong>IMPORTANT:</strong> Setting this property during a dispatch will only affect the next dispatch, if you want to stop the propagation of a signal use `halt()` instead.</p>
	* @property {boolean} active
    * @default
    */
	active: true,

	/**
	* @method Phaser.Signal#validateListener
	* @param {function} listener - Signal handler function.
	* @param {Description} fnName - Description.
	* @private
    */
	validateListener: function (listener, fnName) {
		if (typeof listener !== 'function') {
			throw new Error( 'listener is a required param of {fn}() and should be a Function.'.replace('{fn}', fnName) );
		}
	},

	/**
	 * @method Phaser.Signal#_registerListener
	 * @param {function} listener - Signal handler function.
	 * @param {boolean} isOnce - Description.
	 * @param {object} [listenerContext] - Description.
	 * @param {number} [priority] - The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0).
	 * @return {Phaser.SignalBinding} An Object representing the binding between the Signal and listener.
	 * @private
	 */
	_registerListener: function (listener, isOnce, listenerContext, priority) {

		var prevIndex = this._indexOfListener(listener, listenerContext),
			binding;

		if (prevIndex !== -1) {
			binding = this._bindings[prevIndex];
			if (binding.isOnce() !== isOnce) {
				throw new Error('You cannot add'+ (isOnce? '' : 'Once') +'() then add'+ (!isOnce? '' : 'Once') +'() the same listener without removing the relationship first.');
			}
		} else {
			binding = new Phaser.SignalBinding(this, listener, isOnce, listenerContext, priority);
			this._addBinding(binding);
		}

		if (this.memorize && this._prevParams){
			binding.execute(this._prevParams);
		}

		return binding;
	},

	/**
	 * @method Phaser.Signal#_addBinding 
	 * @param {Phaser.SignalBinding} binding - An Object representing the binding between the Signal and listener.
	 * @private
	 */
	_addBinding: function (binding) {
		//simplified insertion sort
		var n = this._bindings.length;
		do { --n; } while (this._bindings[n] && binding._priority <= this._bindings[n]._priority);
		this._bindings.splice(n + 1, 0, binding);
	},

	/**
	 * @method Phaser.Signal#_indexOfListener
	 * @param {function} listener - Signal handler function.
	 * @return {number} Description.
	 * @private
	 */
	_indexOfListener: function (listener, context) {
		var n = this._bindings.length,
			cur;
		while (n--) {
			cur = this._bindings[n];
			if (cur._listener === listener && cur.context === context) {
				return n;
			}
		}
		return -1;
	},

	/**
	 * Check if listener was attached to Signal.
	 * 
	 * @method Phaser.Signal#has
	 * @param {Function} listener - Signal handler function.
	 * @param {Object} [context] - Context on which listener will be executed (object that should represent the `this` variable inside listener function).
	 * @return {boolean} If Signal has the specified listener.
	 */
	has: function (listener, context) {
		return this._indexOfListener(listener, context) !== -1;
	},

	/**
	 * Add a listener to the signal.
	 * 
	 * @method Phaser.Signal#add
	 * @param {function} listener - Signal handler function.
	 * @param {object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
	 * @param {number} [priority] The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0).
	 * @return {Phaser.SignalBinding} An Object representing the binding between the Signal and listener.
	 */
	add: function (listener, listenerContext, priority) {
		this.validateListener(listener, 'add');
		return this._registerListener(listener, false, listenerContext, priority);
	},

	/**
	* Add listener to the signal that should be removed after first execution (will be executed only once).
	*
	* @method Phaser.Signal#addOnce
	* @param {function} listener Signal handler function.
	* @param {object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
	* @param {number} [priority] The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)
	* @return {Phaser.SignalBinding} An Object representing the binding between the Signal and listener.
	*/
	addOnce: function (listener, listenerContext, priority) {
		this.validateListener(listener, 'addOnce');
		return this._registerListener(listener, true, listenerContext, priority);
	},

	/**
	* Remove a single listener from the dispatch queue.
	*
	* @method Phaser.Signal#remove
	* @param {function} listener Handler function that should be removed.
	* @param {object} [context] Execution context (since you can add the same handler multiple times if executing in a different context).
	* @return {function} Listener handler function.
	*/
	remove: function (listener, context) {

		this.validateListener(listener, 'remove');

		var i = this._indexOfListener(listener, context);

		if (i !== -1)
		{
			this._bindings[i]._destroy(); //no reason to a Phaser.SignalBinding exist if it isn't attached to a signal
			this._bindings.splice(i, 1);
		}

		return listener;

	},

	/**
	* Remove all listeners from the Signal.
	*
	* @method Phaser.Signal#removeAll
	*/
	removeAll: function () {
		var n = this._bindings.length;
		while (n--) {
			this._bindings[n]._destroy();
		}
		this._bindings.length = 0;
	},

	/**
	* Gets the total number of listeneres attached to ths Signal.
	*
	* @method Phaser.Signal#getNumListeners
	* @return {number} Number of listeners attached to the Signal.
	*/
	getNumListeners: function () {
		return this._bindings.length;
	},

	/**
	* Stop propagation of the event, blocking the dispatch to next listeners on the queue.
	* <p><strong>IMPORTANT:</strong> should be called only during signal dispatch, calling it before/after dispatch won't affect signal broadcast.</p>
	* @see Signal.prototype.disable
	*
	* @method Phaser.Signal#halt
	*/
	halt: function () {
		this._shouldPropagate = false;
	},

	/**
	* Dispatch/Broadcast Signal to all listeners added to the queue.
	*
	* @method Phaser.Signal#dispatch
	* @param {any} [params] - Parameters that should be passed to each handler.
	*/
	dispatch: function (params) {
		if (! this.active) {
			return;
		}

		var paramsArr = Array.prototype.slice.call(arguments),
			n = this._bindings.length,
			bindings;

		if (this.memorize) {
			this._prevParams = paramsArr;
		}

		if (! n) {
			//should come after memorize
			return;
		}

		bindings = this._bindings.slice(); //clone array in case add/remove items during dispatch
		this._shouldPropagate = true; //in case `halt` was called before dispatch or during the previous dispatch.

		//execute all callbacks until end of the list or until a callback returns `false` or stops propagation
		//reverse loop since listeners with higher priority will be added at the end of the list
		do { n--; } while (bindings[n] && this._shouldPropagate && bindings[n].execute(paramsArr) !== false);
	},

	/**
	* Forget memorized arguments.
	* @see Signal.memorize
	*
	* @method Phaser.Signal#forget
 	*/
	forget: function(){
		this._prevParams = null;
	},

	/**
	* Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
	* <p><strong>IMPORTANT:</strong> calling any method on the signal instance after calling dispose will throw errors.</p>
	*
	* @method Phaser.Signal#dispose
	*/
	dispose: function () {
		this.removeAll();
		delete this._bindings;
		delete this._prevParams;
	},

	/**
	*
	* @method Phaser.Signal#toString
	* @return {string} String representation of the object.
	*/
	toString: function () {
		return '[Phaser.Signal active:'+ this.active +' numListeners:'+ this.getNumListeners() +']';
	}

};

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Phaser.SignalBinding
*
* Object that represents a binding between a Signal and a listener function.
* <br />- <strong>This is an internal constructor and shouldn't be called by regular users.</strong>
* <br />- inspired by Joa Ebert AS3 SignalBinding and Robert Penner's Slot classes.
*
* @class Phaser.SignalBinding
* @name SignalBinding
* @author Miller Medeiros http://millermedeiros.github.com/js-signals/
* @constructor
* @inner
* @param {Signal} signal - Reference to Signal object that listener is currently bound to.
* @param {function} listener - Handler function bound to the signal.
* @param {boolean} isOnce - If binding should be executed just once.
* @param {object} [listenerContext] - Context on which listener will be executed (object that should represent the `this` variable inside listener function).
* @param {number} [priority] - The priority level of the event listener. (default = 0).
*/
Phaser.SignalBinding = function (signal, listener, isOnce, listenerContext, priority) {

    /**
	* @property {Phaser.Game} _listener - Handler function bound to the signal.
	* @private
	*/
    this._listener = listener;

    /**
	* @property {boolean} _isOnce - If binding should be executed just once.
	* @private
	*/
    this._isOnce = isOnce;

    /**
	* @property {object|undefined|null} context - Context on which listener will be executed (object that should represent the `this` variable inside listener function).
	* @memberof SignalBinding.prototype
	*/
    this.context = listenerContext;

    /**
	* @property {Signal} _signal - Reference to Signal object that listener is currently bound to.
	* @private
	*/
    this._signal = signal;

    /**
	* @property {number} _priority - Listener priority.
	* @private
	*/
    this._priority = priority || 0;

};

Phaser.SignalBinding.prototype = {

    /**
    * If binding is active and should be executed.
    * @property {boolean} active
    * @default
    */ 
    active: true,

    /**
    * Default parameters passed to listener during `Signal.dispatch` and `SignalBinding.execute` (curried parameters).
    * @property {array|null} params 
    * @default 
    */
    params: null,

    /**
    * Call listener passing arbitrary parameters.
    * <p>If binding was added using `Signal.addOnce()` it will be automatically removed from signal dispatch queue, this method is used internally for the signal dispatch.</p>
    * @method Phaser.SignalBinding#execute
    * @param {array} [paramsArr] - Array of parameters that should be passed to the listener.
    * @return {Description} Value returned by the listener.
    */
    execute: function (paramsArr) {

        var handlerReturn, params;

        if (this.active && !!this._listener)
        {
            params = this.params? this.params.concat(paramsArr) : paramsArr;
            handlerReturn = this._listener.apply(this.context, params);

            if (this._isOnce)
            {
                this.detach();
            }
        }

        return handlerReturn;

    },

    /**
    * Detach binding from signal.
    * <p>alias to: @see mySignal.remove(myBinding.getListener());
    * @method Phaser.SignalBinding#detach
    * @return {function|null} Handler function bound to the signal or `null` if binding was previously detached.
    */
    detach: function () {
        return this.isBound() ? this._signal.remove(this._listener, this.context) : null;
    },

    /**
    * @method Phaser.SignalBinding#isBound
    * @return {boolean} True if binding is still bound to the signal and has a listener.
    */
    isBound: function () {
        return (!!this._signal && !!this._listener);
    },

    /**
    * @method Phaser.SignalBinding#isOnce
    * @return {boolean} If SignalBinding will only be executed once.
    */
    isOnce: function () {
        return this._isOnce;
    },

    /**
    * @method Phaser.SignalBinding#getListener
    * @return {Function} Handler function bound to the signal.
    */
    getListener: function () {
        return this._listener;
    },

    /**
    * @method Phaser.SignalBinding#getSignal
    * @return {Signal} Signal that listener is currently bound to.
    */
    getSignal: function () {
        return this._signal;
    },

    /**
    * @method Phaser.SignalBinding#_destroy
    * Delete instance properties
    * @private
    */
    _destroy: function () {
        delete this._signal;
        delete this._listener;
        delete this.context;
    },

    /**
    * @method Phaser.SignalBinding#toString
    * @return {string} String representation of the object.
    */
    toString: function () {
        return '[Phaser.SignalBinding isOnce:' + this._isOnce +', isBound:'+ this.isBound() +', active:' + this.active + ']';
    }

};

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/** 
* This is a base Plugin template to use for any Phaser plugin development.
* 
* @class Phaser.Plugin
* @classdesc Phaser - Plugin
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {Any} parent - The object that owns this plugin, usually Phaser.PluginManager.
*/
Phaser.Plugin = function (game, parent) {

    if (typeof parent === 'undefined') { parent = null; }

	/**
	* @property {Phaser.Game} game - A reference to the currently running game.
	*/
    this.game = game;
    
    /**
	* @property {Any} parent - The parent of this plugin. If added to the PluginManager the parent will be set to that, otherwise it will be null.
	*/
    this.parent = parent;
    
    /**
	* @property {boolean} active - A Plugin with active=true has its preUpdate and update methods called by the parent, otherwise they are skipped.
	* @default
	*/
    this.active = false;
    
    /**
	* @property {boolean} visible - A Plugin with visible=true has its render and postRender methods called by the parent, otherwise they are skipped.
	* @default
	*/
    this.visible = false;
    
    /**
	* @property {boolean} hasPreUpdate - A flag to indicate if this plugin has a preUpdate method.
	* @default
	*/
    this.hasPreUpdate = false;
    
    /**
	* @property {boolean} hasUpdate - A flag to indicate if this plugin has an update method.
	* @default
	*/
    this.hasUpdate = false;
    
    /**
	* @property {boolean} hasRender - A flag to indicate if this plugin has a render method.
	* @default
	*/
    this.hasRender = false;
    
    /**
	* @property {boolean} hasPostRender - A flag to indicate if this plugin has a postRender method.
	* @default
	*/
    this.hasPostRender = false;

};

Phaser.Plugin.prototype = {

    /**
    * Pre-update is called at the very start of the update cycle, before any other subsystems have been updated (including Physics).
    * It is only called if active is set to true.
    * @method Phaser.Plugin#preUpdate
    */
    preUpdate: function () {
    },

    /**
    * Update is called after all the core subsystems (Input, Tweens, Sound, etc) and the State have updated, but before the render.
    * It is only called if active is set to true.
    * @method Phaser.Plugin#update
    */
    update: function () {
    },

    /**
    * Render is called right after the Game Renderer completes, but before the State.render.
    * It is only called if visible is set to true.
    * @method Phaser.Plugin#render
    */
    render: function () {
    },

    /**
    * Post-render is called after the Game Renderer and State.render have run.
    * It is only called if visible is set to true.
    * @method Phaser.Plugin#postRender
    */
    postRender: function () {
    },

    /**
    * Clear down this Plugin and null out references
    * @method Phaser.Plugin#destroy
    */
    destroy: function () {

        this.game = null;
        this.parent = null;
        this.active = false;
        this.visible = false;
        
    }

};

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/** 
* Description.
* 
* @class Phaser.PluginManager
* @classdesc Phaser - PluginManager
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {Description} parent - Description.
*/
Phaser.PluginManager = function(game, parent) {

	/**
	* @property {Phaser.Game} game - A reference to the currently running game.
	*/
    this.game = game;
    
    /**
	* @property {Description} _parent - Description.
	* @private
	*/
    this._parent = parent;
    
    /**
	* @property {array} plugins - Description.
	*/
    this.plugins = [];
    
    /**
	* @property {array} _pluginsLength - Description.
	* @private
	* @default
	*/
    this._pluginsLength = 0;

};

Phaser.PluginManager.prototype = {

    /**
    * Add a new Plugin to the PluginManager.
    * The plugin's game and parent reference are set to this game and pluginmanager parent.
    * @method Phaser.PluginManager#add
    * @param {Phaser.Plugin} plugin - Description.
    * @return {Phaser.Plugin} Description.
    */
    add: function (plugin) {

        var result = false;

        //  Prototype?
        if (typeof plugin === 'function')
        {
            plugin = new plugin(this.game, this._parent);
        }
        else
        {
            plugin.game = this.game;
            plugin.parent = this._parent;
        }

        //  Check for methods now to avoid having to do this every loop
        if (typeof plugin['preUpdate'] === 'function')
        {
            plugin.hasPreUpdate = true;
            result = true;
        }

        if (typeof plugin['update'] === 'function')
        {
            plugin.hasUpdate = true;
            result = true;
        }

        if (typeof plugin['render'] === 'function')
        {
            plugin.hasRender = true;
            result = true;
        }

        if (typeof plugin['postRender'] === 'function')
        {
            plugin.hasPostRender = true;
            result = true;
        }

        //  The plugin must have at least one of the above functions to be added to the PluginManager.
        if (result)
        {
            if (plugin.hasPreUpdate || plugin.hasUpdate)
            {
                plugin.active = true;
            }

            if (plugin.hasRender || plugin.hasPostRender)
            {
                plugin.visible = true;
            }

            this._pluginsLength = this.plugins.push(plugin);

            // Allows plugins to run potentially destructive code outside of the constructor, and only if being added to the PluginManager
            if (typeof plugin['init'] === 'function')
            {
                plugin.init();
            }

            return plugin;
        }
        else
        {
            return null;
        }
    },

    /**
     * Remove a Plugin from the PluginManager.
     * @method Phaser.PluginManager#remove
     * @param {Phaser.Plugin} plugin - The plugin to be removed.
     */
    remove: function (plugin) {

        //  TODO
        this._pluginsLength--;

    },

    /**
    * Pre-update is called at the very start of the update cycle, before any other subsystems have been updated (including Physics).
    * It only calls plugins who have active=true.
    * 
    * @method Phaser.PluginManager#preUpdate
    */
    preUpdate: function () {

        if (this._pluginsLength == 0)
        {
            return;
        }

        for (this._p = 0; this._p < this._pluginsLength; this._p++)
        {
            if (this.plugins[this._p].active && this.plugins[this._p].hasPreUpdate)
            {
                this.plugins[this._p].preUpdate();
            }
        }

    },

    /**
    * Update is called after all the core subsystems (Input, Tweens, Sound, etc) and the State have updated, but before the render.
    * It only calls plugins who have active=true.
    * 
    * @method Phaser.PluginManager#update
    */
    update: function () {
        
        if (this._pluginsLength == 0)
        {
            return;
        }

        for (this._p = 0; this._p < this._pluginsLength; this._p++)
        {
            if (this.plugins[this._p].active && this.plugins[this._p].hasUpdate)
            {
                this.plugins[this._p].update();
            }
        }

    },

    /**
    * Render is called right after the Game Renderer completes, but before the State.render.
    * It only calls plugins who have visible=true.
    * 
    * @method Phaser.PluginManager#render
    */
    render: function () {

        if (this._pluginsLength == 0)
        {
            return;
        }

        for (this._p = 0; this._p < this._pluginsLength; this._p++)
        {
            if (this.plugins[this._p].visible && this.plugins[this._p].hasRender)
            {
                this.plugins[this._p].render();
            }
        }

    },

    /**
    * Post-render is called after the Game Renderer and State.render have run.
    * It only calls plugins who have visible=true.
    * 
    * @method Phaser.PluginManager#postRender
    */
    postRender: function () {

        if (this._pluginsLength == 0)
        {
            return;
        }

        for (this._p = 0; this._p < this._pluginsLength; this._p++)
        {
            if (this.plugins[this._p].visible && this.plugins[this._p].hasPostRender)
            {
                this.plugins[this._p].postRender();
            }
        }

    },

    /**
    * Clear down this PluginManager and null out references
    * 
    * @method Phaser.PluginManager#destroy
    */
    destroy: function () {

        this.plugins.length = 0;
        this._pluginsLength = 0;
        this.game = null;
        this._parent = null;

    }

};

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Stage controls the canvas on which everything is displayed. It handles display within the browser,
* focus handling, game resizing, scaling and the pause, boot and orientation screens.
*
* @class Phaser.Stage
* @constructor
* @param {Phaser.Game} game - Game reference to the currently running game.
* @param {number} width - Width of the canvas element.
* @param {number} height - Height of the canvas element.
 */
Phaser.Stage = function (game, width, height) {

    /**
	* @property {Phaser.Game} game - A reference to the currently running Game.
	*/
	this.game = game;

    /**
	* @property {string} game - Background color of the stage (defaults to black). Set via the public backgroundColor property.
	* @private
	* @default 'rgb(0,0,0)'
	*/
    this._backgroundColor = 'rgb(0,0,0)';

    /**
	* @property {Phaser.Point} offset - Get the offset values (for input and other things).
	*/
	this.offset = new Phaser.Point;
    
    /**
    * @property {HTMLCanvasElement} canvas - Reference to the newly created &lt;canvas&gt; element.
    */
    this.canvas = Phaser.Canvas.create(width, height); 
    this.canvas.style['-webkit-full-screen'] = 'width: 100%; height: 100%';
    
    /**
    * @property {PIXI.Stage} _stage - The Pixi Stage which is hooked to the renderer.
    * @private
    */
    this._stage = new PIXI.Stage(0x000000, false);
    this._stage.name = '_stage_root';

    /**
    * @property {number} scaleMode - The current scaleMode.
    */    
    this.scaleMode = Phaser.StageScaleMode.NO_SCALE;

    /**
    * @property {Phaser.StageScaleMode} scale - The scale of the current running game.
    */
    this.scale = new Phaser.StageScaleMode(this.game, width, height);

    /**
     * @property {number} aspectRatio - Aspect ratio.
     */
    this.aspectRatio = width / height;

    /**
    * @property {number} _nextOffsetCheck - The time to run the next offset check.
    * @private
    */
    this._nextOffsetCheck = 0;

    /**
    * @property {number|false} checkOffsetInterval - The time (in ms) between which the stage should check to see if it has moved.
    * @default
    */
    this.checkOffsetInterval = 2500;

};

Phaser.Stage.prototype = {

    /**
    * Initialises the stage and adds the event listeners.
    * @method Phaser.Stage#boot
    * @private
    */
    boot: function () {

        Phaser.Canvas.getOffset(this.canvas, this.offset);

        this.bounds = new Phaser.Rectangle(this.offset.x, this.offset.y, this.game.width, this.game.height);

        var _this = this;

        this._onChange = function (event) {
            return _this.visibilityChange(event);
        }

        Phaser.Canvas.setUserSelect(this.canvas, 'none');
        Phaser.Canvas.setTouchAction(this.canvas, 'none');

        document.addEventListener('visibilitychange', this._onChange, false);
        document.addEventListener('webkitvisibilitychange', this._onChange, false);
        document.addEventListener('pagehide', this._onChange, false);
        document.addEventListener('pageshow', this._onChange, false);

        window.onblur = this._onChange;
        window.onfocus = this._onChange;

    },

    /**
    * Runs Stage processes that need periodic updates, such as the offset checks.
    * @method Phaser.Stage#update
    */
    update: function () {

        if (this.checkOffsetInterval !== false)
        {
            if (this.game.time.now > this._nextOffsetCheck)
            {
                Phaser.Canvas.getOffset(this.canvas, this.offset);
                this._nextOffsetCheck = this.game.time.now + this.checkOffsetInterval;
            }

        }

    },

	/**
    * This method is called when the document visibility is changed.
    * @method Phaser.Stage#visibilityChange
    * @param {Event} event - Its type will be used to decide whether the game should be paused or not.
    */
    visibilityChange: function (event) {

        if (this.disableVisibilityChange)
        {
            return;
        }

        if (event.type == 'pagehide' || event.type == 'blur' || document['hidden'] == true || document['webkitHidden'] == true)
        {
	        this.game.paused = true;
        }
        else
        {
	        this.game.paused = false;
        }

    },

};

/**
* @name Phaser.Stage#backgroundColor
* @property {number|string} backgroundColor - Gets and sets the background color of the stage. The color can be given as a number: 0xff0000 or a hex string: '#ff0000'
*/
Object.defineProperty(Phaser.Stage.prototype, "backgroundColor", {

    get: function () {
        return this._backgroundColor;
    },

    set: function (color) {

        this._backgroundColor = color;

        if (this.game.renderType == Phaser.CANVAS)
        {
            //  Set it directly, this allows us to use rgb alpha values in Canvas mode.
            this._stage.backgroundColorString = color;
        }
        else
        {
            if (typeof color === 'string')
            {
                color = Phaser.Color.hexToRGB(color);
            }

            this._stage.setBackgroundColor(color);
        }

    }

});

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Phaser Group constructor.
* @class Phaser.Group
* @classdesc A Group is a container for display objects that allows for fast pooling, recycling and collision checks.
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {*} parent - The parent Group or DisplayObjectContainer that will hold this group, if any.
* @param {string} [name=group] - A name for this Group. Not used internally but useful for debugging.
* @param {boolean} [useStage=false] - Should the DisplayObjectContainer this Group creates be added to the World (default, false) or direct to the Stage (true).
*/
Phaser.Group = function (game, parent, name, useStage) {

	if (typeof parent === 'undefined')
	{
		parent = game.world;
	}

	if (typeof useStage === 'undefined')
	{
		useStage = false;
	}

    /**
	* @property {Phaser.Game} game - A reference to the currently running Game.
	*/
	this.game = game;
	
    /**
	* @property {string} name - A name for this Group. Not used internally but useful for debugging.
	*/
	this.name = name || 'group';

	if (useStage)
	{
		this._container = this.game.stage._stage;
	}
	else
	{
		this._container = new PIXI.DisplayObjectContainer();
		this._container.name = this.name;

		if (parent)
		{
			if (parent instanceof Phaser.Group)
			{
				parent._container.addChild(this._container);
				parent._container.updateTransform();
			}
			else
			{
				parent.addChild(this._container);
				parent.updateTransform();
			}
		}
		else
		{
			this.game.stage._stage.addChild(this._container);
			this.game.stage._stage.updateTransform();
		}
	}

	/**
	* @property {number} type - Internal Phaser Type value.
	* @protected
	*/
	this.type = Phaser.GROUP;

	/**
	* @property {boolean} exists - If exists is true the the Group is updated, otherwise it is skipped.
	* @default
	*/
	this.exists = true;

    /**
    * @property {Phaser.Point} scale - Replaces the PIXI.Point with a slightly more flexible one.
    */ 
    this.scale = new Phaser.Point(1, 1);

    /**
    * The cursor is a simple way to iterate through the objects in a Group using the Group.next and Group.previous functions.
    * The cursor is set to the first child added to the Group and doesn't change unless you call next, previous or set it directly with Group.cursor.
    * @property {any} cursor - The current display object that the Group cursor is pointing to.
    */ 
    this.cursor = null;

};

Phaser.Group.prototype = {

    /**
    * Adds an existing object to this Group. The object can be an instance of Phaser.Sprite, Phaser.Button or any other display object.
    * The child is automatically added to the top of the Group, so renders on-top of everything else within the Group. If you need to control
    * that then see the addAt method.
    *
    * @see Phaser.Group#create
    * @see Phaser.Group#addAt
    * @method Phaser.Group#add
	* @param {*} child - An instance of Phaser.Sprite, Phaser.Button or any other display object..
	* @return {*} The child that was added to the Group.
    */
	add: function (child) {

		if (child.group !== this)
		{
			child.group = this;

			if (child.events)
			{
				child.events.onAddedToGroup.dispatch(child, this);
			}

			this._container.addChild(child);

			child.updateTransform();

			if (this.cursor === null)
			{
				this.cursor = child;
			}
		}

		return child;

	},

    /**
    * Adds an existing object to this Group. The object can be an instance of Phaser.Sprite, Phaser.Button or any other display object.
    * The child is added to the Group at the location specified by the index value, this allows you to control child ordering.
	*
    * @method Phaser.Group#addAt
	* @param {*} child - An instance of Phaser.Sprite, Phaser.Button or any other display object..
	* @param {number} index - The index within the Group to insert the child to.
	* @return {*} The child that was added to the Group.
	*/
	addAt: function (child, index) {

		if (child.group !== this)
		{
			child.group = this;

			if (child.events)
			{
				child.events.onAddedToGroup.dispatch(child, this);
			}

			this._container.addChildAt(child, index);

			child.updateTransform();

			if (this.cursor === null)
			{
				this.cursor = child;
			}
		}

		return child;

	},

    /**
	* Returns the child found at the given index within this Group.
	*
    * @method Phaser.Group#getAt
    * @memberof Phaser.Group
	* @param {number} index - The index to return the child from.
	* @return {*} The child that was found at the given index.
	*/
	getAt: function (index) {

		return this._container.getChildAt(index);

	},

    /**
	* Automatically creates a new Phaser.Sprite object and adds it to the top of this Group.
	* Useful if you don't need to create the Sprite instances before-hand.
	*
    * @method Phaser.Group#create
	* @param {number} x - The x coordinate to display the newly created Sprite at. The value is in relation to the Group.x point.
	* @param {number} y - The y coordinate to display the newly created Sprite at. The value is in relation to the Group.y point.
	* @param {string} key - The Game.cache key of the image that this Sprite will use.
	* @param {number|string} [frame] - If the Sprite image contains multiple frames you can specify which one to use here.
	* @param {boolean} [exists=true] - The default exists state of the Sprite.
	* @return {Phaser.Sprite} The child that was created.
	*/
	create: function (x, y, key, frame, exists) {

		if (typeof exists == 'undefined') { exists = true; }

		var child = new Phaser.Sprite(this.game, x, y, key, frame);

		child.group = this;
		child.exists = exists;
		child.visible = exists;
		child.alive = exists;

		if (child.events)
		{
			child.events.onAddedToGroup.dispatch(child, this);
		}

		this._container.addChild(child);
			
		child.updateTransform();

		if (this.cursor === null)
		{
			this.cursor = child;
		}

		return child;

	},

    /**
	* Automatically creates multiple Phaser.Sprite objects and adds them to the top of this Group.
	* Useful if you need to quickly generate a pool of identical sprites, such as bullets. By default the sprites will be set to not exist
	* and will be positioned at 0, 0 (relative to the Group.x/y)
	*
    * @method Phaser.Group#createMultiple
	* @param {number} quantity - The number of Sprites to create.
	* @param {string} key - The Game.cache key of the image that this Sprite will use.
	* @param {number|string} [frame] - If the Sprite image contains multiple frames you can specify which one to use here.
	* @param {boolean} [exists=false] - The default exists state of the Sprite.
	*/
	createMultiple: function (quantity, key, frame, exists) {

		if (typeof exists == 'undefined') { exists = false; }

		for (var i = 0; i < quantity; i++)
		{
			var child = new Phaser.Sprite(this.game, 0, 0, key, frame);

			child.group = this;
			child.exists = exists;
			child.visible = exists;
			child.alive = exists;

			if (child.events)
			{
				child.events.onAddedToGroup.dispatch(child, this);
			}

			this._container.addChild(child);
			child.updateTransform();

			if (this.cursor === null)
			{
				this.cursor = child;
			}

		}

	},

    /**
	* Advances the Group cursor to the next object in the Group. If it's at the end of the Group it wraps around to the first object.
	*
    * @method Phaser.Group#next
	*/
	next: function () {

		if (this.cursor)
		{
			//	Wrap the cursor?
			if (this.cursor == this._container.last)
			{
				this.cursor = this._container._iNext;
			}
			else
			{
				this.cursor = this.cursor._iNext;
			}
		}

	},

    /**
	* Moves the Group cursor to the previous object in the Group. If it's at the start of the Group it wraps around to the last object.
	*
    * @method Phaser.Group#previous
	*/
	previous: function () {

		if (this.cursor)
		{
			//	Wrap the cursor?
			if (this.cursor == this._container._iNext)
			{
				this.cursor = this._container.last;
			}
			else
			{
				this.cursor = this.cursor._iPrev;
			}
		}

	},

	/**
	* Swaps the position of two children in this Group.
	*
    * @method Phaser.Group#swap
	* @param {*} child1 - The first child to swap.
	* @param {*} child2 - The second child to swap.
    * @return {boolean} True if the swap was successful, otherwise false.
	*/
	swap: function (child1, child2) {

		if (child1 === child2 || !child1.parent || !child2.parent)
		{
			console.warn('You cannot swap a child with itself or swap un-parented children');
			return false;
		}

		//	Cache the values
		var child1Prev = child1._iPrev;
		var child1Next = child1._iNext;
		var child2Prev = child2._iPrev;
		var child2Next = child2._iNext;

		var endNode = this._container.last._iNext;
		var currentNode = this.game.stage._stage;
			
		do
		{
			if (currentNode !== child1 && currentNode !== child2)
			{
				if (currentNode.first === child1)
				{
					currentNode.first = child2;
				}
				else if (currentNode.first === child2)
				{
					currentNode.first = child1;
				}

				if (currentNode.last === child1)
				{
					currentNode.last = child2;
				}
				else if (currentNode.last === child2)
				{
					currentNode.last = child1;
				}
			}

			currentNode = currentNode._iNext;
		}
		while (currentNode != endNode)

		if (child1._iNext == child2)
		{
			//	This is a downward (A to B) neighbour swap
			child1._iNext = child2Next;
			child1._iPrev = child2;
			child2._iNext = child1;
			child2._iPrev = child1Prev;

			if (child1Prev) { child1Prev._iNext = child2; }
			if (child2Next) { child2Next._iPrev = child1; }

			if (child1.__renderGroup)
			{
				child1.__renderGroup.updateTexture(child1);
			}

			if (child2.__renderGroup)
			{
				child2.__renderGroup.updateTexture(child2);
			}

			return true;
		}
		else if (child2._iNext == child1)
		{
			//	This is an upward (B to A) neighbour swap
			child1._iNext = child2;
			child1._iPrev = child2Prev;
			child2._iNext = child1Next;
			child2._iPrev = child1;

			if (child2Prev) { child2Prev._iNext = child1; }
			if (child1Next) { child2Next._iPrev = child2; }

			if (child1.__renderGroup)
			{
				child1.__renderGroup.updateTexture(child1);
			}

			if (child2.__renderGroup)
			{
				child2.__renderGroup.updateTexture(child2);
			}

			return true;
		}
		else
		{
			//	Children are far apart
			child1._iNext = child2Next;
			child1._iPrev = child2Prev;
			child2._iNext = child1Next;
			child2._iPrev = child1Prev;

			if (child1Prev) { child1Prev._iNext = child2; }
			if (child1Next) { child1Next._iPrev = child2; }
			if (child2Prev) { child2Prev._iNext = child1; }
			if (child2Next) { child2Next._iPrev = child1; }

			if (child1.__renderGroup)
			{
				child1.__renderGroup.updateTexture(child1);
			}

			if (child2.__renderGroup)
			{
				child2.__renderGroup.updateTexture(child2);
			}

			return true;
		}

		return false;
		
	},

	/**
	* Brings the given child to the top of this Group so it renders above all other children.
	*
    * @method Phaser.Group#bringToTop
	* @param {*} child - The child to bring to the top of this Group.
    * @return {*} The child that was moved.
	*/
	bringToTop: function (child) {

		if (child.group === this)
		{
			this.remove(child);
			this.add(child);
		}

		return child;

	},

	/**
	* Get the index position of the given child in this Group.
	*
    * @method Phaser.Group#getIndex
	* @param {*} child - The child to get the index for.
    * @return {number} The index of the child or -1 if it's not a member of this Group.
	*/
	getIndex: function (child) {

		return this._container.children.indexOf(child);

	},

	/**
	* Replaces a child of this Group with the given newChild. The newChild cannot be a member of this Group.
	*
    * @method Phaser.Group#replace
	* @param {*} oldChild - The child in this Group that will be replaced.
	* @param {*} newChild - The child to be inserted into this group.
	*/
	replace: function (oldChild, newChild) {

		if (!this._container.first._iNext)
		{
			return;
		}

		var index = this.getIndex(oldChild);
		
		if (index != -1)
		{
			if (newChild.parent != undefined)
			{
				newChild.events.onRemovedFromGroup.dispatch(newChild, this);
				newChild.parent.removeChild(newChild);
			}

			this._container.removeChild(oldChild);
			this._container.addChildAt(newChild, index);

			newChild.events.onAddedToGroup.dispatch(newChild, this);
			newChild.updateTransform();

			if (this.cursor == oldChild)
			{
				this.cursor = this._container._iNext;
			}
		}

	},

	/**
     * Sets the given property to the given value on the child. The operation controls the assignment of the value.
     *
     * @method Phaser.Group#setProperty
     * @param {*} child - The child to set the property value on.
     * @param {array} key - An array of strings that make up the property that will be set.
     * @param {*} value - The value that will be set.
     * @param {number} [operation=0] - Controls how the value is assigned. A value of 0 replaces the value with the new one. A value of 1 adds it, 2 subtracts it, 3 multiplies it and 4 divides it.
     */
	setProperty: function (child, key, value, operation) {

		operation = operation || 0;

		//	As ugly as this approach looks, and although it's limited to a depth of only 4, it's extremely fast.
		//	Much faster than a for loop or object iteration. There are no checks, so if the key isn't valid then it'll fail
		//	but as you are likely to call this from inner loops that have to perform well, I'll take that trade off.

		//	0 = Equals
		//	1 = Add
		//	2 = Subtract
		//	3 = Multiply
		//	4 = Divide

		var len = key.length;

		if (len == 1)
		{
			if (operation == 0) { child[key[0]] = value; }
			else if (operation == 1) { child[key[0]] += value; }
			else if (operation == 2) { child[key[0]] -= value; }
			else if (operation == 3) { child[key[0]] *= value; }
			else if (operation == 4) { child[key[0]] /= value; }
		}
		else if (len == 2)
		{
			if (operation == 0) { child[key[0]][key[1]] = value; }
			else if (operation == 1) { child[key[0]][key[1]] += value; }
			else if (operation == 2) { child[key[0]][key[1]] -= value; }
			else if (operation == 3) { child[key[0]][key[1]] *= value; }
			else if (operation == 4) { child[key[0]][key[1]] /= value; }
		}
		else if (len == 3)
		{
			if (operation == 0) { child[key[0]][key[1]][key[2]] = value; }
			else if (operation == 1) { child[key[0]][key[1]][key[2]] += value; }
			else if (operation == 2) { child[key[0]][key[1]][key[2]] -= value; }
			else if (operation == 3) { child[key[0]][key[1]][key[2]] *= value; }
			else if (operation == 4) { child[key[0]][key[1]][key[2]] /= value; }
		}
		else if (len == 4)
		{
			if (operation == 0) { child[key[0]][key[1]][key[2]][key[3]] = value; }
			else if (operation == 1) { child[key[0]][key[1]][key[2]][key[3]] += value; }
			else if (operation == 2) { child[key[0]][key[1]][key[2]][key[3]] -= value; }
			else if (operation == 3) { child[key[0]][key[1]][key[2]][key[3]] *= value; }
			else if (operation == 4) { child[key[0]][key[1]][key[2]][key[3]] /= value; }
		}
		else
		{
			//	TODO - Deep property scane
		}

	},

	/**
     * This function allows you to quickly set the same property across all children of this Group to a new value.
     * The operation parameter controls how the new value is assigned to the property, from simple replacement to addition and multiplication.
     *
     * @method Phaser.Group#setAll
     * @param {string} key - The property, as a string, to be set. For example: 'body.velocity.x'
     * @param {*} value - The value that will be set.
     * @param {boolean} [checkAlive=false] - If set then only children with alive=true will be updated.
     * @param {boolean} [checkVisible=false] - If set then only children with visible=true will be updated.
     * @param {number} [operation=0] - Controls how the value is assigned. A value of 0 replaces the value with the new one. A value of 1 adds it, 2 subtracts it, 3 multiplies it and 4 divides it.
     */
	setAll: function (key, value, checkAlive, checkVisible, operation) {

		key = key.split('.');

		if (typeof checkAlive === 'undefined') { checkAlive = false; }
		if (typeof checkVisible === 'undefined') { checkVisible = false; }

		operation = operation || 0;

		if (this._container.children.length > 0 && this._container.first._iNext)
		{
			var currentNode = this._container.first._iNext;
				
			do	
			{
				if ((checkAlive == false || (checkAlive && currentNode.alive)) && (checkVisible == false || (checkVisible && currentNode.visible)))
				{
					this.setProperty(currentNode, key, value, operation);
				}

				currentNode = currentNode._iNext;
			}
			while (currentNode != this._container.last._iNext)
		}

	},

	/**
     * Adds the amount to the given property on all children in this Group.
     * Group.addAll('x', 10) will add 10 to the child.x value.
     *
     * @method Phaser.Group#addAll
     * @param {string} property - The property to increment, for example 'body.velocity.x' or 'angle'.
     * @param {number} amount - The amount to increment the property by. If child.x = 10 then addAll('x', 40) would make child.x = 50.
     * @param {boolean} checkAlive - If true the property will only be changed if the child is alive.
     * @param {boolean} checkVisible - If true the property will only be changed if the child is visible.
     */
	addAll: function (property, amount, checkAlive, checkVisible) {

		this.setAll(property, amount, checkAlive, checkVisible, 1);

	},

	/**
     * Subtracts the amount from the given property on all children in this Group.
     * Group.subAll('x', 10) will minus 10 from the child.x value.
     *
     * @method Phaser.Group#subAll
     * @param {string} property - The property to decrement, for example 'body.velocity.x' or 'angle'.
     * @param {number} amount - The amount to subtract from the property. If child.x = 50 then subAll('x', 40) would make child.x = 10.
     * @param {boolean} checkAlive - If true the property will only be changed if the child is alive.
     * @param {boolean} checkVisible - If true the property will only be changed if the child is visible.
     */
	subAll: function (property, amount, checkAlive, checkVisible) {

		this.setAll(property, amount, checkAlive, checkVisible, 2);

	},

	/**
     * Multiplies the given property by the amount on all children in this Group.
     * Group.multiplyAll('x', 2) will x2 the child.x value.
     *
     * @method Phaser.Group#multiplyAll
     * @param {string} property - The property to multiply, for example 'body.velocity.x' or 'angle'.
     * @param {number} amount - The amount to multiply the property by. If child.x = 10 then multiplyAll('x', 2) would make child.x = 20.
     * @param {boolean} checkAlive - If true the property will only be changed if the child is alive.
     * @param {boolean} checkVisible - If true the property will only be changed if the child is visible.
     */
	multiplyAll: function (property, amount, checkAlive, checkVisible) {

		this.setAll(property, amount, checkAlive, checkVisible, 3);

	},

	/**
     * Divides the given property by the amount on all children in this Group.
     * Group.divideAll('x', 2) will half the child.x value.
     *
     * @method Phaser.Group#divideAll
     * @param {string} property - The property to divide, for example 'body.velocity.x' or 'angle'.
     * @param {number} amount - The amount to divide the property by. If child.x = 100 then divideAll('x', 2) would make child.x = 50.
     * @param {boolean} checkAlive - If true the property will only be changed if the child is alive.
     * @param {boolean} checkVisible - If true the property will only be changed if the child is visible.
     */
	divideAll: function (property, amount, checkAlive, checkVisible) {

		this.setAll(property, amount, checkAlive, checkVisible, 4);

	},

	/**
    * Calls a function on all of the children that have exists=true in this Group.
    * After the existsValue parameter you can add as many parameters as you like, which will all be passed to the child callback.
    * 
    * @method Phaser.Group#callAllExists
    * @param {function} callback - The function that exists on the children that will be called.
    * @param {boolean} existsValue - Only children with exists=existsValue will be called.
    * @param {...*} parameter - Additional parameters that will be passed to the callback.
    */
	callAllExists: function (callback, existsValue) {

		var args = Array.prototype.splice.call(arguments, 2);

		if (this._container.children.length > 0 && this._container.first._iNext)
		{
			var currentNode = this._container.first._iNext;
				
			do	
			{
				if (currentNode.exists == existsValue && currentNode[callback])
				{
					currentNode[callback].apply(currentNode, args);
				}

				currentNode = currentNode._iNext;
			}
			while (currentNode != this._container.last._iNext)

		}

	},

	/**
    * Calls a function on all of the children that have exists=true in this Group.
    * 
    * @method Phaser.Group#callbackFromArray
    * @param {object} child - The object to inspect.
    * @param {array} callback - The array of function names.
    * @param {number} length - The size of the array (pre-calculated in callAll).
    * @protected
    */
	callbackFromArray: function (child, callback, length) {

		//	Kinda looks like a Christmas tree

		if (length == 1)
		{
			if (child[callback[0]])
			{
				return child[callback[0]];
			}
		}
		else if (length == 2)
		{
			if (child[callback[0]][callback[1]])
			{
				return child[callback[0]][callback[1]];
			}
		}
		else if (length == 3)
		{
			if (child[callback[0]][callback[1]][callback[2]])
			{
				return child[callback[0]][callback[1]][callback[2]];
			}
		}
		else if (length == 4)
		{
			if (child[callback[0]][callback[1]][callback[2]][callback[3]])
			{
				return child[callback[0]][callback[1]][callback[2]][callback[3]];
			}
		}
		else
		{
			if (child[callback])
			{
				return child[callback];
			}
		}

		return false;

	},

	/**
    * Calls a function on all of the children regardless if they are dead or alive (see callAllExists if you need control over that)
    * After the method parameter you can add as many extra parameters as you like, which will all be passed to the child.
    * 
    * @method Phaser.Group#callAll
    * @param {string} method - A string containing the name of the function that will be called. The function must exist on the child.
    * @param {string} [context=''] - A string containing the context under which the method will be executed. Leave to '' to default to the child.
    * @param {...*} parameter - Additional parameters that will be passed to the method.
    */
	callAll: function (method, context) {

		if (typeof method === 'undefined')
		{
			return;
		}

		//	Extract the method into an array
		method = method.split('.');

		var methodLength = method.length;

		if (typeof context === 'undefined')
		{
			context = null;
		}
		else
		{
			//	Extract the context into an array
			if (typeof context === 'string')
			{
				context = context.split('.');
				var contextLength = context.length;
			}
		}

		var args = Array.prototype.splice.call(arguments, 2);
		var callback = null;

		if (this._container.children.length > 0 && this._container.first._iNext)
		{
			var child = this._container.first._iNext;
				
			do	
			{
				callback = this.callbackFromArray(child, method, methodLength);

				if (context && callback)
				{
					callbackContext = this.callbackFromArray(child, context, contextLength);
	
					if (callback)
					{
						callback.apply(callbackContext, args);
					}
				}
				else if (callback)
				{
					callback.apply(child, args);
				}

				child = child._iNext;
			}
			while (child != this._container.last._iNext)

		}

	},

	/**
	* Allows you to call your own function on each member of this Group. You must pass the callback and context in which it will run.
   	* After the checkExists parameter you can add as many parameters as you like, which will all be passed to the callback along with the child.
   	* For example: Group.forEach(awardBonusGold, this, true, 100, 500)
	* 
	* @method Phaser.Group#forEach
	* @param {function} callback - The function that will be called. Each child of the Group will be passed to it as its first parameter.
    * @param {Object} callbackContext - The context in which the function should be called (usually 'this').
    * @param {boolean} checkExists - If set only children with exists=true will be passed to the callback, otherwise all children will be passed.
	*/
	forEach: function (callback, callbackContext, checkExists) {

		if (typeof checkExists === 'undefined')
		{
			checkExists = false;
		}

		var args = Array.prototype.splice.call(arguments, 3);
		args.unshift(null);

		if (this._container.children.length > 0 && this._container.first._iNext)
		{
			var currentNode = this._container.first._iNext;
				
			do	
			{
				if (checkExists == false || (checkExists && currentNode.exists))
				{
					args[0] = currentNode;
					callback.apply(callbackContext, args);
				}

				currentNode = currentNode._iNext;
			}
			while (currentNode != this._container.last._iNext);

		}

	},

	/**
	* Allows you to call your own function on each alive member of this Group (where child.alive=true). You must pass the callback and context in which it will run.
   	* You can add as many parameters as you like, which will all be passed to the callback along with the child.
   	* For example: Group.forEachAlive(causeDamage, this, 500)
	* 
	* @method Phaser.Group#forEachAlive
	* @param {function} callback - The function that will be called. Each child of the Group will be passed to it as its first parameter.
    * @param {Object} callbackContext - The context in which the function should be called (usually 'this').
	*/
	forEachAlive: function (callback, callbackContext) {

		var args = Array.prototype.splice.call(arguments, 2);
		args.unshift(null);

		if (this._container.children.length > 0 && this._container.first._iNext)
		{
			var currentNode = this._container.first._iNext;
				
			do	
			{
				if (currentNode.alive)
				{
					args[0] = currentNode;
					callback.apply(callbackContext, args);
				}

				currentNode = currentNode._iNext;
			}
			while (currentNode != this._container.last._iNext);

		}

	},

	/**
	* Allows you to call your own function on each dead member of this Group (where alive=false). You must pass the callback and context in which it will run.
   	* You can add as many parameters as you like, which will all be passed to the callback along with the child.
   	* For example: Group.forEachDead(bringToLife, this)
	* 
	* @method Phaser.Group#forEachDead
	* @param {function} callback - The function that will be called. Each child of the Group will be passed to it as its first parameter.
    * @param {Object} callbackContext - The context in which the function should be called (usually 'this').
	*/
	forEachDead: function (callback, callbackContext) {

		var args = Array.prototype.splice.call(arguments, 2);
		args.unshift(null);

		if (this._container.children.length > 0 && this._container.first._iNext)
		{
			var currentNode = this._container.first._iNext;
				
			do	
			{
				if (currentNode.alive == false)
				{
					args[0] = currentNode;
					callback.apply(callbackContext, args);
				}

				currentNode = currentNode._iNext;
			}
			while (currentNode != this._container.last._iNext);

		}
	},

	/**
    * Call this function to retrieve the first object with exists == (the given state) in the Group.
    *
    * @method Phaser.Group#getFirstExists
    * @param {boolean} state - True or false.
    * @return {Any} The first child, or null if none found.
    */
	getFirstExists: function (state) {

		if (typeof state !== 'boolean')
		{
			state = true;
		}

		if (this._container.children.length > 0 && this._container.first._iNext)
		{
			var currentNode = this._container.first._iNext;
				
			do	
			{
				if (currentNode.exists === state)
				{
					return currentNode;
				}

				currentNode = currentNode._iNext;
			}
			while (currentNode != this._container.last._iNext);
		}

		return null;

	},

	/**
    * Call this function to retrieve the first object with alive == true in the group.
    * This is handy for checking if everything has been wiped out, or choosing a squad leader, etc.
    *
    * @method Phaser.Group#getFirstAlive
    * @return {Any} The first alive child, or null if none found.
    */
	getFirstAlive: function () {

		if (this._container.children.length > 0 && this._container.first._iNext)
		{
			var currentNode = this._container.first._iNext;
				
			do	
			{
				if (currentNode.alive)
				{
					return currentNode;
				}

				currentNode = currentNode._iNext;
			}
			while (currentNode != this._container.last._iNext);
		}

		return null;

	},

	/**
    * Call this function to retrieve the first object with alive == false in the group.
    * This is handy for checking if everything has been wiped out, or choosing a squad leader, etc.
    *
    * @method Phaser.Group#getFirstDead
    * @return {Any} The first dead child, or null if none found.
    */
	getFirstDead: function () {

		if (this._container.children.length > 0 && this._container.first._iNext)
		{
			var currentNode = this._container.first._iNext;
				
			do	
			{
				if (!currentNode.alive)
				{
					return currentNode;
				}

				currentNode = currentNode._iNext;
			}
			while (currentNode != this._container.last._iNext);
		}

		return null;

	},

	/**
    * Call this function to find out how many members of the group are alive.
    *
    * @method Phaser.Group#countLiving
    * @return {number} The number of children flagged as alive. Returns -1 if Group is empty.
    */
	countLiving: function () {

		var total = 0;

		if (this._container.children.length > 0 && this._container.first._iNext)
		{
			var currentNode = this._container.first._iNext;
				
			do	
			{
				if (currentNode.alive)
				{
					total++;
				}

				currentNode = currentNode._iNext;
			}
			while (currentNode != this._container.last._iNext);
		}
		else
		{
			total = -1;
		}

		return total;

	},

	/**
    * Call this function to find out how many members of the group are dead.
    *
    * @method Phaser.Group#countDead
    * @return {number} The number of children flagged as dead. Returns -1 if Group is empty.
    */
	countDead: function () {

		var total = 0;

		if (this._container.children.length > 0 && this._container.first._iNext)
		{
			var currentNode = this._container.first._iNext;
				
			do	
			{
				if (!currentNode.alive)
				{
					total++;
				}

				currentNode = currentNode._iNext;
			}
			while (currentNode != this._container.last._iNext);
		}
		else
		{
			total = -1;
		}

		return total;

	},

	/**
    * Returns a member at random from the group.
    *
    * @method Phaser.Group#getRandom
    * @param {number} startIndex - Optional offset off the front of the array. Default value is 0, or the beginning of the array.
    * @param {number} length - Optional restriction on the number of values you want to randomly select from.
    * @return {Any} A random child of this Group.
    */
	getRandom: function (startIndex, length) {

		if (this._container.children.length == 0)
		{
			return null;
		}

		startIndex = startIndex || 0;
		length = length || this._container.children.length;

        return this.game.math.getRandom(this._container.children, startIndex, length);

	},

	/**
	* Removes the given child from this Group and sets its group property to null.
	*
	* @method Phaser.Group#remove
	* @param {Any} child - The child to remove.
	*/
	remove: function (child) {

		if (child.events)
		{
			child.events.onRemovedFromGroup.dispatch(child, this);
		}

		this._container.removeChild(child);

		if (this.cursor == child)
		{
			if (this._container._iNext)
			{
				this.cursor = this._container._iNext;
			}
			else
			{
				this.cursor = null;
			}
		}

		child.group = null;

	},

	/**
	* Removes all children from this Group, setting all group properties to null.
	* The Group container remains on the display list.
	*
	* @method Phaser.Group#removeAll
	*/
	removeAll: function () {

		if (this._container.children.length == 0)
		{
			return;
		}

		do
		{
			if (this._container.children[0].events)
			{
				this._container.children[0].events.onRemovedFromGroup.dispatch(this._container.children[0], this);
			}
			this._container.removeChild(this._container.children[0]);
		}
		while (this._container.children.length > 0);

		this.cursor = null;

	},

	/**
	* Removes all children from this Group whos index falls beteen the given startIndex and endIndex values.
	*
	* @method Phaser.Group#removeBetween
	* @param {number} startIndex - The index to start removing children from.
	* @param {number} endIndex - The index to stop removing children from. Must be higher than startIndex and less than the length of the Group.
	*/	
	removeBetween: function (startIndex, endIndex) {

		if (this._container.children.length == 0)
		{
			return;
		}

		if (startIndex > endIndex || startIndex < 0 || endIndex > this._container.children.length)
		{
			return false;
		}

		for (var i = startIndex; i < endIndex; i++)
		{
			var child = this._container.children[i];
			child.events.onRemovedFromGroup.dispatch(child, this);
			this._container.removeChild(child);
	
			if (this.cursor == child)
			{
				if (this._container._iNext)
				{
					this.cursor = this._container._iNext;
				}
				else
				{
					this.cursor = null;
				}
			}
		}

	},

	/**
	* Destroys this Group. Removes all children, then removes the container from the display list and nulls references.
	*
	* @method Phaser.Group#destroy
	*/
	destroy: function () {

		this.removeAll();

		this._container.parent.removeChild(this._container);

		this._container = null;

		this.game = null;

		this.exists = false;

		this.cursor = null;

	},

	/**
	* Dumps out a list of Group children and their index positions to the browser console. Useful for group debugging.
	*
	* @method Phaser.Group#dump
	* @param {boolean} [full=false] - If full the dump will include the entire display list, start from the Stage. Otherwise it will only include this container.
	*/
	dump: function (full) {

		if (typeof full == 'undefined')
		{
			full = false;
		}

		var spacing = 20;
		var output = "\n" + Phaser.Utils.pad('Node', spacing) + "|" + Phaser.Utils.pad('Next', spacing) + "|" + Phaser.Utils.pad('Previous', spacing) + "|" + Phaser.Utils.pad('First', spacing) + "|" + Phaser.Utils.pad('Last', spacing);

		console.log(output);

		var output = Phaser.Utils.pad('----------', spacing) + "|" + Phaser.Utils.pad('----------', spacing) + "|" + Phaser.Utils.pad('----------', spacing) + "|" + Phaser.Utils.pad('----------', spacing) + "|" + Phaser.Utils.pad('----------', spacing);
		console.log(output);

		if (full)
		{
			var testObject = this.game.stage._stage.last._iNext;
			var displayObject = this.game.stage._stage;
		}
		else
		{
			var testObject = this._container.last._iNext;
			var displayObject = this._container;
		}
		
		do	
		{
			var name = displayObject.name || '*';

			if (this.cursor == displayObject)
			{
				var name = '> ' + name;
			}

			var nameNext = '-';
			var namePrev = '-';
			var nameFirst = '-';
			var nameLast = '-';

			if (displayObject._iNext)
			{
				nameNext = displayObject._iNext.name;
			}

			if (displayObject._iPrev)
			{
				namePrev = displayObject._iPrev.name;
			}

			if (displayObject.first)
			{
				nameFirst = displayObject.first.name;
			}

			if (displayObject.last)
			{
				nameLast = displayObject.last.name;
			}

			if (typeof nameNext === 'undefined')
			{
				nameNext = '-';
			}

			if (typeof namePrev === 'undefined')
			{
				namePrev = '-';
			}

			if (typeof nameFirst === 'undefined')
			{
				nameFirst = '-';
			}

			if (typeof nameLast === 'undefined')
			{
				nameLast = '-';
			}

			var output = Phaser.Utils.pad(name, spacing) + "|" + Phaser.Utils.pad(nameNext, spacing) + "|" + Phaser.Utils.pad(namePrev, spacing) + "|" + Phaser.Utils.pad(nameFirst, spacing) + "|" + Phaser.Utils.pad(nameLast, spacing);
			console.log(output);

			displayObject = displayObject._iNext;

		}
		while(displayObject != testObject)

	}

};

/**
* @name Phaser.Group#total
* @property {number} total - The total number of children in this Group, regardless of their alive state.
* @readonly
*/
Object.defineProperty(Phaser.Group.prototype, "total", {

    get: function () {
        return this._container.children.length;
    }

});

/**
* @name Phaser.Group#length
* @property {number} length - The number of children in this Group.
* @readonly
*/
Object.defineProperty(Phaser.Group.prototype, "length", {

    get: function () {
        return this._container.children.length;
    }

});

/**
* The x coordinate of the Group container. You can adjust the Group container itself by modifying its coordinates.
* This will have no impact on the x/y coordinates of its children, but it will update their worldTransform and on-screen position.
* @name Phaser.Group#x
* @property {number} x - The x coordinate of the Group container.
*/
Object.defineProperty(Phaser.Group.prototype, "x", {

    get: function () {
        return this._container.position.x;
    },

    set: function (value) {
        this._container.position.x = value;
    }

});

/**
* The y coordinate of the Group container. You can adjust the Group container itself by modifying its coordinates.
* This will have no impact on the x/y coordinates of its children, but it will update their worldTransform and on-screen position.
* @name Phaser.Group#y
* @property {number} y - The y coordinate of the Group container.
*/
Object.defineProperty(Phaser.Group.prototype, "y", {

    get: function () {
        return this._container.position.y;
    },

    set: function (value) {
        this._container.position.y = value;
    }

});

/**
* The angle of rotation of the Group container. This will adjust the Group container itself by modifying its rotation.
* This will have no impact on the rotation value of its children, but it will update their worldTransform and on-screen position.
* @name Phaser.Group#angle
* @property {number} angle - The angle of rotation given in degrees, where 0 degrees = to the right.
*/
Object.defineProperty(Phaser.Group.prototype, "angle", {

    get: function() {
        return Phaser.Math.radToDeg(this._container.rotation);
    },

    set: function(value) {
        this._container.rotation = Phaser.Math.degToRad(value);
    }

});

/**
* The angle of rotation of the Group container. This will adjust the Group container itself by modifying its rotation.
* This will have no impact on the rotation value of its children, but it will update their worldTransform and on-screen position.
* @name Phaser.Group#rotation
* @property {number} rotation - The angle of rotation given in radians.
*/
Object.defineProperty(Phaser.Group.prototype, "rotation", {

    get: function () {
        return this._container.rotation;
    },

    set: function (value) {
        this._container.rotation = value;
    }

});

/**
* @name Phaser.Group#visible
* @property {boolean} visible - The visible state of the Group. Non-visible Groups and all of their children are not rendered.
*/
Object.defineProperty(Phaser.Group.prototype, "visible", {

    get: function () {
        return this._container.visible;
    },

    set: function (value) {
        this._container.visible = value;
    }

});

/**
* @name Phaser.Group#alpha
* @property {number} alpha - The alpha value of the Group container.
*/
Object.defineProperty(Phaser.Group.prototype, "alpha", {

    get: function () {
        return this._container.alpha;
    },

    set: function (value) {
        this._container.alpha = value;
    }

});

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* "This world is but a canvas to our imagination." - Henry David Thoreau
*
* A game has only one world. The world is an abstract place in which all game objects live. It is not bound
* by stage limits and can be any size. You look into the world via cameras. All game objects live within
* the world at world-based coordinates. By default a world is created the same size as your Stage.
*
* @class Phaser.World
* @constructor
* @param {Phaser.Game} game - Reference to the current game instance.
*/
Phaser.World = function (game) {

    Phaser.Group.call(this, game, null, '__world', false);

    /**
    * @property {Phaser.Point} scale - Replaces the PIXI.Point with a slightly more flexible one.
    */ 
    this.scale = new Phaser.Point(1, 1);

    /**
    * The World has no fixed size, but it does have a bounds outside of which objects are no longer considered as being "in world" and you should use this to clean-up the display list and purge dead objects.
    * By default we set the Bounds to be from 0,0 to Game.width,Game.height. I.e. it will match the size given to the game constructor with 0,0 representing the top-left of the display.
    * However 0,0 is actually the center of the world, and if you rotate or scale the world all of that will happen from 0,0.
    * So if you want to make a game in which the world itself will rotate you should adjust the bounds so that 0,0 is the center point, i.e. set them to -1000,-1000,2000,2000 for a 2000x2000 sized world centered around 0,0.
	* @property {Phaser.Rectangle} bounds - Bound of this world that objects can not escape from.
	*/
	this.bounds = new Phaser.Rectangle(0, 0, game.width, game.height);

    /**
	* @property {Phaser.Camera} camera - Camera instance.
	*/
	this.camera = null;

    /**
	* @property {number} currentRenderOrderID - Reset each frame, keeps a count of the total number of objects updated.
	*/
	this.currentRenderOrderID = 0;
	
};

Phaser.World.prototype = Object.create(Phaser.Group.prototype);
Phaser.World.prototype.constructor = Phaser.World;

/**
* Initialises the game world.
*
* @method Phaser.World#boot
* @protected
*/
Phaser.World.prototype.boot = function () {

    this.camera = new Phaser.Camera(this.game, 0, 0, 0, this.game.width, this.game.height);

    this.camera.displayObject = this._container;

    this.game.camera = this.camera;

}

/**
* This is called automatically every frame, and is where main logic happens.
* 
* @method Phaser.World#update
*/
Phaser.World.prototype.update = function () {

	this.currentRenderOrderID = 0;

	if (this.game.stage._stage.first._iNext)
	{
		var currentNode = this.game.stage._stage.first._iNext;
		
		do
		{
			if (currentNode['preUpdate'])
			{
				currentNode.preUpdate();
			}

			if (currentNode['update'])
			{
				currentNode.update();
			}
			
			currentNode = currentNode._iNext;
		}
		while (currentNode != this.game.stage._stage.last._iNext)
	}

}

/**
* This is called automatically every frame, and is where main logic happens.
* @method Phaser.World#postUpdate
*/
Phaser.World.prototype.postUpdate = function () {

    this.camera.update();

    if (this.game.stage._stage.first._iNext)
    {
        var currentNode = this.game.stage._stage.first._iNext;
        
        do  
        {
            if (currentNode['postUpdate'])
            {
                currentNode.postUpdate();
            }
            
            currentNode = currentNode._iNext;
        }
        while (currentNode != this.game.stage._stage.last._iNext)
    }

}

/**
* Updates the size of this world. Note that this doesn't modify the world x/y coordinates, just the width and height.
* If you need to adjust the bounds of the world
* @method Phaser.World#setBounds
* @param {number} x - Top left most corner of the world.
* @param {number} y - Top left most corner of the world.
* @param {number} width - New width of the world.
* @param {number} height - New height of the world.
*/
Phaser.World.prototype.setBounds = function (x, y, width, height) {

    this.bounds.setTo(x, y, width, height);

    if (this.camera.bounds)
    {
        this.camera.bounds.setTo(x, y, width, height);
    }

}

/**
* Destroyer of worlds.
* @method Phaser.World#destroy
*/
Phaser.World.prototype.destroy = function () {

    this.camera.x = 0;
    this.camera.y = 0;

    this.game.input.reset(true);

    this.removeAll();

}

/**
* @name Phaser.World#width
* @property {number} width - Gets or sets the current width of the game world.
*/
Object.defineProperty(Phaser.World.prototype, "width", {

    get: function () {
        return this.bounds.width;
    },

    set: function (value) {
        this.bounds.width = value;
    }

});

/**
* @name Phaser.World#height
* @property {number} height - Gets or sets the current height of the game world.
*/
Object.defineProperty(Phaser.World.prototype, "height", {

    get: function () {
        return this.bounds.height;
    },

    set: function (value) {
        this.bounds.height = value;
    }

});

/**
* @name Phaser.World#centerX
* @property {number} centerX - Gets the X position corresponding to the center point of the world.
* @readonly
*/
Object.defineProperty(Phaser.World.prototype, "centerX", {

    get: function () {
        return this.bounds.halfWidth;
    }

});

/**
* @name Phaser.World#centerY
* @property {number} centerY - Gets the Y position corresponding to the center point of the world.
* @readonly
*/
Object.defineProperty(Phaser.World.prototype, "centerY", {

    get: function () {
        return this.bounds.halfHeight;
    }

});

/**
* @name Phaser.World#randomX
* @property {number} randomX - Gets a random integer which is lesser than or equal to the current width of the game world.
* @readonly
*/
Object.defineProperty(Phaser.World.prototype, "randomX", {

    get: function () {

        if (this.bounds.x < 0)
        {
            return this.game.rnd.integerInRange(this.bounds.x, (this.bounds.width - Math.abs(this.bounds.x)));
        }
        else
        {
            return this.game.rnd.integerInRange(this.bounds.x, this.bounds.width);
        }

    }

});

/**
* @name Phaser.World#randomY
* @property {number} randomY - Gets a random integer which is lesser than or equal to the current height of the game world.
* @readonly
*/
Object.defineProperty(Phaser.World.prototype, "randomY", {

    get: function () {

        if (this.bounds.y < 0)
        {
            return this.game.rnd.integerInRange(this.bounds.y, (this.bounds.height - Math.abs(this.bounds.y)));
        }
        else
        {
            return this.game.rnd.integerInRange(this.bounds.y, this.bounds.height);
        }

    }

});

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Game constructor
*
* Instantiate a new <code>Phaser.Game</code> object.
* @class Phaser.Game
* @classdesc This is where the magic happens. The Game object is the heart of your game,
* providing quick access to common functions and handling the boot process.
* "Hell, there are no rules here - we're trying to accomplish something."
*                                                       Thomas A. Edison
* @constructor
* @param {number} [width=800] - The width of your game in game pixels.
* @param {number} [height=600] - The height of your game in game pixels.
* @param {number} [renderer=Phaser.AUTO] - Which renderer to use (canvas or webgl)
* @param {HTMLElement} [parent=''] - The Games DOM parent.
* @param {any} [state=null] - Description.
* @param {boolean} [transparent=false] - Use a transparent canvas background or not.
* @param  {boolean} [antialias=true] - Anti-alias graphics.
*/
Phaser.Game = function (width, height, renderer, parent, state, transparent, antialias) {

	width = width || 800;
	height = height || 600;
	renderer = renderer || Phaser.AUTO;
	parent = parent || '';
	state = state || null;

	if (typeof transparent == 'undefined') { transparent = false; }
	if (typeof antialias == 'undefined') { antialias = true; }

	/**
	* @property {number} id - Phaser Game ID (for when Pixi supports multiple instances).
	*/
	this.id = Phaser.GAMES.push(this) - 1;

	/**
	* @property {HTMLElement} parent - The Games DOM parent.
	*/
	this.parent = parent;

	//	Do some more intelligent size parsing here, so they can set "100%" for example, maybe pass the scale mode in here too?

	/**
	* @property {number} width - The Game width (in pixels).
	*/
	this.width = width;

	/**
	* @property {number} height - The Game height (in pixels).
	*/
	this.height = height;

	/**
	* @property {boolean} transparent - Use a transparent canvas background or not.
	*/
	this.transparent = transparent;

	/**
	* @property {boolean} antialias - Anti-alias graphics (in WebGL this helps with edges, in Canvas2D it retains pixel-art quality).
	*/
	this.antialias = antialias;

	/**
	* @property {number} renderer - The Pixi Renderer
	* @default
	*/
	this.renderer = null;

	/**
	* @property {number} state - The StateManager.
	*/
	this.state = new Phaser.StateManager(this, state);

	/**
	* @property {boolean} _paused - Is game paused?
	* @private
	* @default
	*/
	this._paused = false;

	/**
	* @property {number} renderType - The Renderer this Phaser.Game will use. Either Phaser.RENDERER_AUTO, Phaser.RENDERER_CANVAS or Phaser.RENDERER_WEBGL.
	*/
	this.renderType = renderer;

	/**
	* @property {boolean} _loadComplete - Whether load complete loading or not.
	* @private
	* @default
	*/
	this._loadComplete = false;

	/**
	* @property {boolean} isBooted - Whether the game engine is booted, aka available.
	* @default
	*/
	this.isBooted = false;

	/**
	* @property {boolean} id -Is game running or paused?
	* @default
	*/
	this.isRunning = false;

	/**
	* @property {Phaser.RequestAnimationFrame} raf - Automatically handles the core game loop via requestAnimationFrame or setTimeout
	* @default
	*/
	this.raf = null;

	/**
	* @property {Phaser.GameObjectFactory} add - Reference to the GameObject Factory.
	* @default
	*/
    this.add = null;

    /**
	* @property {Phaser.Cache} cache - Reference to the assets cache.
	* @default
	*/
    this.cache = null;

    /**
	* @property {Phaser.Input} input - Reference to the input manager
	* @default
	*/
    this.input = null;

    /**
	* @property {Phaser.Loader} load - Reference to the assets loader.
	* @default
	*/
    this.load = null;

    /**
	* @property {Phaser.GameMath} math - Reference to the math helper.
	* @default
	*/
    this.math = null;

    /**
	* @property {Phaser.Net} net - Reference to the network class.
	* @default
	*/
    this.net = null;

    /**
	* @property {Phaser.SoundManager} sound - Reference to the sound manager.
	* @default
	*/
    this.sound = null;

    /**
	* @property {Phaser.Stage} stage - Reference to the stage.
	* @default
	*/
    this.stage = null;

    /**
	* @property {Phaser.TimeManager} time - Reference to game clock.
	* @default
	*/
    this.time = null;

    /**
	* @property {Phaser.TweenManager} tweens - Reference to the tween manager.
	* @default
	*/
    this.tweens = null;

    /**
	* @property {Phaser.World} world - Reference to the world.
	* @default
	*/
    this.world = null;

    /**
	* @property {Phaser.Physics.PhysicsManager} physics - Reference to the physics manager.
	* @default
	*/
    this.physics = null;

    /**
	* @property {Phaser.RandomDataGenerator} rnd - Instance of repeatable random data generator helper.
	* @default
	*/
    this.rnd = null;

    /**
	* @property {Phaser.Device} device - Contains device information and capabilities.
	* @default
	*/
    this.device = null;

    /**
	* @property {Phaser.Physics.PhysicsManager} camera - A handy reference to world.camera.
	* @default
	*/
	this.camera = null;

	   /**
	* @property {HTMLCanvasElement} canvas - A handy reference to renderer.view.
	* @default
	*/
	this.canvas = null;

	/**
	* @property {Context} context - A handy reference to renderer.context (only set for CANVAS games)
	* @default
	*/
	this.context = null;

    /**
	* @property {Phaser.Utils.Debug} debug - A set of useful debug utilitie.
	* @default
	*/
	this.debug = null;

	/**
	* @property {Phaser.Particles} particles - The Particle Manager.
	* @default
	*/
	this.particles = null;

	var _this = this;

    this._onBoot = function () {
        return _this.boot();
    }

	if (document.readyState === 'complete' || document.readyState === 'interactive')
	{
		window.setTimeout(this._onBoot, 0);
	}
	else
	{
		document.addEventListener('DOMContentLoaded', this._onBoot, false);
		window.addEventListener('load', this._onBoot, false);
	}

	return this;

};

Phaser.Game.prototype = {

	/**
	* Initialize engine sub modules and start the game.
	*
	* @method Phaser.Game#boot
	* @protected
	*/
	boot: function () {

		if (this.isBooted)
		{
			return;
		}

		if (!document.body)
		{
			window.setTimeout(this._onBoot, 20);
		}
		else
		{
			document.removeEventListener('DOMContentLoaded', this._onBoot);
			window.removeEventListener('load', this._onBoot);

			this.onPause = new Phaser.Signal;
			this.onResume = new Phaser.Signal;

			this.isBooted = true;

			this.device = new Phaser.Device();
			this.math = Phaser.Math;
			this.rnd = new Phaser.RandomDataGenerator([(Date.now() * Math.random()).toString()]);

			this.stage = new Phaser.Stage(this, this.width, this.height);

			this.setUpRenderer();

			this.world = new Phaser.World(this);
			this.add = new Phaser.GameObjectFactory(this);
			this.cache = new Phaser.Cache(this);
			this.load = new Phaser.Loader(this);
			this.time = new Phaser.Time(this);
			this.tweens = new Phaser.TweenManager(this);
			this.input = new Phaser.Input(this);
			this.sound = new Phaser.SoundManager(this);
			this.physics = new Phaser.Physics.Arcade(this);
			this.particles = new Phaser.Particles(this);
			this.plugins = new Phaser.PluginManager(this, this);
			this.net = new Phaser.Net(this);
			this.debug = new Phaser.Utils.Debug(this);

			this.stage.boot();
			this.world.boot();
			this.input.boot();
			this.sound.boot();
			this.state.boot();

			this.load.onLoadComplete.add(this.loadComplete, this);

			this.showDebugHeader();

	        this.isRunning = true;
            this._loadComplete = false;

			this.raf = new Phaser.RequestAnimationFrame(this);
			this.raf.start();

		}

	},

	/**
    * Displays a Phaser version debug header in the console.
    *
    * @method Phaser.Game#showDebugHeader
    * @protected
    */
	showDebugHeader: function () {

		var v = Phaser.DEV_VERSION;
		var r = 'Canvas';
		var a = 'HTML Audio';

		if (this.renderType == Phaser.WEBGL)
		{
			r = 'WebGL';
		}

		if (this.device.webAudio)
		{
			a = 'WebAudio';
		}

		if (this.device.chrome)
		{
			var args = [ 
				'%c %c %c  Phaser v' + v + ' - Renderer: ' + r + ' - Audio: ' + a + '  %c %c ',
				'background: #00bff3',
				'background: #0072bc',
				'color: #ffffff; background: #003471',
				'background: #0072bc',
				'background: #00bff3'
			];

			console.log.apply(console, args);
		}
		else
		{
			console.log('Phaser v' + v + ' - Renderer: ' + r + ' - Audio: ' + a);
		}

	},

	/**
	* Checks if the device is capable of using the requested renderer and sets it up or an alternative if not.
	*
	* @method Phaser.Game#setUpRenderer
	* @protected
	*/
	setUpRenderer: function () {

		if (this.renderType === Phaser.CANVAS || (this.renderType === Phaser.AUTO && this.device.webGL == false))
		{
			if (this.device.canvas)
			{
				this.renderType = Phaser.CANVAS;
				this.renderer = new PIXI.CanvasRenderer(this.width, this.height, this.stage.canvas, this.transparent);
				Phaser.Canvas.setSmoothingEnabled(this.renderer.context, this.antialias);
				this.canvas = this.renderer.view;
				this.context = this.renderer.context;
			}
			else
			{
				throw new Error('Phaser.Game - cannot create Canvas or WebGL context, aborting.');
			}
		}
		else
		{
			//	They requested WebGL, and their browser supports it
			this.renderType = Phaser.WEBGL;
			this.renderer = new PIXI.WebGLRenderer(this.width, this.height, this.stage.canvas, this.transparent, this.antialias);
			this.canvas = this.renderer.view;
			this.context = null;
		}

        Phaser.Canvas.addToDOM(this.renderer.view, this.parent, true);
        Phaser.Canvas.setTouchAction(this.renderer.view);

	},

	/**
    * Called when the load has finished, after preload was run.
    *
    * @method Phaser.Game#loadComplete
    * @protected
    */
    loadComplete: function () {

        this._loadComplete = true;

        this.state.loadComplete();

    },

	/**
    * The core game loop.
    *
    * @method Phaser.Game#update
    * @protected
	* @param {number} time - The current time as provided by RequestAnimationFrame.
    */
	update: function (time) {

		this.time.update(time);

		if (!this._paused)
		{
	        this.plugins.preUpdate();
	        this.physics.preUpdate();

	        this.stage.update();
	        this.input.update();
	        this.tweens.update();
	        this.sound.update();
			this.world.update();
			this.particles.update();
			this.state.update();
	        this.plugins.update();

			this.world.postUpdate();

			this.renderer.render(this.stage._stage);
			this.plugins.render();
			this.state.render();

			this.plugins.postRender();
		}

	},

	/**
    * Nuke the entire game from orbit
    *
    * @method Phaser.Game#destroy
    */
    destroy: function () {

		this.raf.stop();

    	this.input.destroy();

    	this.state.destroy();

        this.state = null;
        this.cache = null;
        this.input = null;
        this.load = null;
        this.sound = null;
        this.stage = null;
        this.time = null;
        this.world = null;
        this.isBooted = false;

    }

};

/**
* The paused state of the Game. A paused game doesn't update any of its subsystems.
* When a game is paused the onPause event is dispatched. When it is resumed the onResume event is dispatched.
* @name Phaser.Game#paused
* @property {boolean} paused - Gets and sets the paused state of the Game.
*/
Object.defineProperty(Phaser.Game.prototype, "paused", {

    get: function () {
        return this._paused;
    },

    set: function (value) {

    	if (value === true)
    	{
    		if (this._paused == false)
    		{
	    		this._paused = true;
	    		this.onPause.dispatch(this);
    		}
    	}
    	else
    	{
    		if (this._paused)
    		{
	    		this._paused = false;
	    		this.onResume.dispatch(this);
    		}
    	}

    }

});

/**
* "Deleted code is debugged code." - Jeff Sickel
*/

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Constructor for Phaser Input.
* @class Phaser.Input
* @classdesc A game specific Input manager that looks after the mouse, keyboard and touch objects.
* This is updated by the core game loop.
* @constructor
* @param {Phaser.Game} game - Current game instance.
*/
Phaser.Input = function (game) {

	/**
	* @property {Phaser.Game} game - A reference to the currently running game. 
	*/
	this.game = game;

	/**
    * @property {Description} hitCanvas - Description. 
    * @default
	*/
    this.hitCanvas = null;
    
	/**
     * @property {Description} hitContext - Description. 
     * @default
 	*/
    this.hitContext = null;
	
};

/**
* @constant
* @type {number}
*/
Phaser.Input.MOUSE_OVERRIDES_TOUCH = 0;

/**
* @constant
* @type {number}
*/
Phaser.Input.TOUCH_OVERRIDES_MOUSE = 1;

/**
* @constant
* @type {number}
*/
Phaser.Input.MOUSE_TOUCH_COMBINE = 2;

Phaser.Input.prototype = {

    /** 
    * @property {Phaser.Game} game
    */	
    game: null,

    /**
    * How often should the input pointers be checked for updates?
    * A value of 0 means every single frame (60fps), a value of 1 means every other frame (30fps) and so on.
    * @property {number} pollRate 
    * @default
    */
    pollRate: 0,
    
    /**
     * @property {number} _pollCounter - Description.
     * @private
     * @default
     */
    _pollCounter: 0,

    /**
    * A vector object representing the previous position of the Pointer.
    * @property {Vec2} vector
    * @private
    * @default 
    */
    _oldPosition: null,

    /**
    * X coordinate of the most recent Pointer event
    * @property {number} _x
    * @private
    * @default
    */
    _x: 0,

    /**
    * Y coordinate of the most recent Pointer event
    * @property {number} _y
    * @private
    * @default
    */
    _y: 0,

    /**
    * You can disable all Input by setting Input.disabled: true. While set all new input related events will be ignored.
    * If you need to disable just one type of input, for example mouse, use Input.mouse.disabled: true instead
    * @property {boolean} disabled
    * @default
    */
    disabled: false,

    /**
    * Controls the expected behaviour when using a mouse and touch together on a multi-input device.
    * @property {Description} multiInputOverride
    */
    multiInputOverride: Phaser.Input.MOUSE_TOUCH_COMBINE,

    /**
    * A vector object representing the current position of the Pointer.
    * @property {Phaser.Point} position
    * @default 
    */
    position: null,

    /**
    * A vector object representing the speed of the Pointer. Only really useful in single Pointer games,
    * otherwise see the Pointer objects directly.
    * @property {Phaser.Point} speed
    * @default 
    */
    speed: null,

    /**
    * A Circle object centered on the x/y screen coordinates of the Input.
    * Default size of 44px (Apples recommended "finger tip" size) but can be changed to anything.
    * @property {Phaser.Circle} circle
    * @default
    */
    circle: null,

    /**
    * The scale by which all input coordinates are multiplied, calculated by the StageScaleMode.
    * In an un-scaled game the values will be x: 1 and y: 1.
    * @property {Phaser.Point} scale
    * @default
    */
    scale: null,

    /**
    * The maximum number of Pointers allowed to be active at any one time.
    * For lots of games it's useful to set this to 1.
    * @property {number} maxPointers
    * @default
    */
    maxPointers: 10,

    /**
    * The current number of active Pointers.
    * @property {number} currentPointers
    * @default
    */
    currentPointers: 0,

    /**
    * The number of milliseconds that the Pointer has to be pressed down and then released to be considered a tap or clicke
    * @property {number} tapRate
    * @default
    */
    tapRate: 200,

    /**
    * The number of milliseconds between taps of the same Pointer for it to be considered a double tap / click
    * @property {number} doubleTapRate
    * @default
    */
    doubleTapRate: 300,

    /**
    * The number of milliseconds that the Pointer has to be pressed down for it to fire a onHold event
    * @property {number} holdRate
    * @default
    */
    holdRate: 2000,

    /**
    * The number of milliseconds below which the Pointer is considered justPressed
    * @property {number} justPressedRate
    * @default
    */
    justPressedRate: 200,

    /**
    * The number of milliseconds below which the Pointer is considered justReleased 
    * @property {number} justReleasedRate
    * @default
    */
    justReleasedRate: 200,

    /**
    * Sets if the Pointer objects should record a history of x/y coordinates they have passed through.
    * The history is cleared each time the Pointer is pressed down.
    * The history is updated at the rate specified in Input.pollRate
    * @property {boolean} recordPointerHistory
    * @default
    */
    recordPointerHistory: false,

    /**
    * The rate in milliseconds at which the Pointer objects should update their tracking history
    * @property {number} recordRate
    * @default
    */
    recordRate: 100,

    /**
    * The total number of entries that can be recorded into the Pointer objects tracking history.
    * If the Pointer is tracking one event every 100ms, then a trackLimit of 100 would store the last 10 seconds worth of history.
    * @property {number} recordLimit
    * @default
    */
    recordLimit: 100,

    /**
    * A Pointer object
    * @property {Phaser.Pointer} pointer1
    */
    pointer1: null,

    /**
    * A Pointer object
    * @property {Phaser.Pointer} pointer2
    */
    pointer2: null,

    /**
    * A Pointer object  
    * @property {Phaser.Pointer} pointer3
    */
    pointer3: null,

    /**
    * A Pointer object
    * @property {Phaser.Pointer} pointer4
    */
    pointer4: null,

    /**
    * A Pointer object
    * @property {Phaser.Pointer} pointer5
    */
    pointer5: null,

    /**
    * A Pointer object
    * @property {Phaser.Pointer} pointer6
    */
    pointer6: null,

    /**
    * A Pointer object  
    * @property {Phaser.Pointer} pointer7
    */
    pointer7: null,

    /**
    * A Pointer object
    * @property {Phaser.Pointer} pointer8
    */
    pointer8: null,

    /**
    * A Pointer object
    * @property {Phaser.Pointer} pointer9
    */ 
    pointer9: null,

    /**
    * A Pointer object.
    * @property {Phaser.Pointer} pointer10
    */
    pointer10: null,

    /**
    * The most recently active Pointer object.
    * When you've limited max pointers to 1 this will accurately be either the first finger touched or mouse.
    * @property {Phaser.Pointer} activePointer
    * @default
    */
    activePointer: null,

    /**
    * The mouse has its own unique Phaser.Pointer object which you can use if making a desktop specific game.
    * @property {Pointer} mousePointer
    * @default
    */
    mousePointer: null,
    
    /**
    * The Mouse Input manager.
    * @property {Phaser.Mouse} mouse - The Mouse Input manager.
    * @default
    */
    mouse: null,
    
    /**
    * The Keyboard Input manager.
    * @property {Phaser.Keyboard} keyboard - The Keyboard Input manager.
    * @default
    */
    keyboard: null,
    
    /**
    * The Touch Input manager.
    * @property {Phaser.Touch} touch - the Touch Input manager.
    * @default
    */
    touch: null,
    
    /**
    * The MSPointer Input manager.
    * @property {Phaser.MSPointer} mspointer - The MSPointer Input manager.
    * @default
    */
    mspointer: null,

    /**
    * A Signal that is dispatched each time a pointer is pressed down.
    * @property {Phaser.Signal} onDown
    * @default
    */
    onDown: null,
    
    /**
    * A Signal that is dispatched each time a pointer is released.
    * @property {Phaser.Signal} onUp
    * @default
    */
    onUp: null,
    
    /**
    * A Signal that is dispatched each time a pointer is tapped.
    * @property {Phaser.Signal} onTap
    * @default
    */
    onTap: null,
    
    /**
    * A Signal that is dispatched each time a pointer is held down.
    * @property {Phaser.Signal} onHold
    * @default
    */
    onHold: null,

    /**
    * A linked list of interactive objects, the InputHandler components (belonging to Sprites) register themselves with this.
    * @property {Phaser.LinkedList} interactiveItems
    */
    interactiveItems: new Phaser.LinkedList(),

	/**
    * Starts the Input Manager running.
    * @method Phaser.Input#boot
    * @protected
    */
    boot: function () {

	    this.mousePointer = new Phaser.Pointer(this.game, 0);
	    this.pointer1 = new Phaser.Pointer(this.game, 1);
	    this.pointer2 = new Phaser.Pointer(this.game, 2);

	    this.mouse = new Phaser.Mouse(this.game);
	    this.keyboard = new Phaser.Keyboard(this.game);
	    this.touch = new Phaser.Touch(this.game);
	    this.mspointer = new Phaser.MSPointer(this.game);

	    this.onDown = new Phaser.Signal();
	    this.onUp = new Phaser.Signal();
	    this.onTap = new Phaser.Signal();
	    this.onHold = new Phaser.Signal();

	    this.scale = new Phaser.Point(1, 1);
	    this.speed = new Phaser.Point();
	    this.position = new Phaser.Point();
	    this._oldPosition = new Phaser.Point();

	    this.circle = new Phaser.Circle(0, 0, 44);

	    this.activePointer = this.mousePointer;
	    this.currentPointers = 0;

	    this.hitCanvas = document.createElement('canvas');
	    this.hitCanvas.width = 1;
	    this.hitCanvas.height = 1;
        this.hitContext = this.hitCanvas.getContext('2d');

        this.mouse.start();
        this.keyboard.start();
        this.touch.start();
        this.mspointer.start();
        this.mousePointer.active = true;

    },

    /**
    * Stops all of the Input Managers from running.
    * @method Phaser.Input#destroy
    */
    destroy: function () {

        this.mouse.stop();
        this.keyboard.stop();
        this.touch.stop();
        this.mspointer.stop();

    },

	/**
    * Add a new Pointer object to the Input Manager. By default Input creates 3 pointer objects: mousePointer, pointer1 and pointer2.
    * If you need more then use this to create a new one, up to a maximum of 10.
    * @method Phaser.Input#addPointer
    * @return {Phaser.Pointer} A reference to the new Pointer object that was created.
    */
    addPointer: function () {

        var next = 0;

        for (var i = 10; i > 0; i--)
        {
            if (this['pointer' + i] === null)
            {
                next = i;
            }
        }

        if (next == 0)
        {
            console.warn("You can only have 10 Pointer objects");
            return null;
        }
        else
        {
            this['pointer' + next] = new Phaser.Pointer(this.game, next);
            return this['pointer' + next];
        }

    },

	/**
    * Updates the Input Manager. Called by the core Game loop.
    * @method Phaser.Input#update
    * @protected
    */
    update: function () {

        if (this.pollRate > 0 && this._pollCounter < this.pollRate)
        {
            this._pollCounter++;
            return;
        }

        this.speed.x = this.position.x - this._oldPosition.x;
        this.speed.y = this.position.y - this._oldPosition.y;

        this._oldPosition.copyFrom(this.position);
        this.mousePointer.update();

        this.pointer1.update();
        this.pointer2.update();

        if (this.pointer3) { this.pointer3.update(); }
        if (this.pointer4) { this.pointer4.update(); }
        if (this.pointer5) { this.pointer5.update(); }
        if (this.pointer6) { this.pointer6.update(); }
        if (this.pointer7) { this.pointer7.update(); }
        if (this.pointer8) { this.pointer8.update(); }
        if (this.pointer9) { this.pointer9.update(); }
        if (this.pointer10) { this.pointer10.update(); }

        this._pollCounter = 0;
    },

	/**
    * Reset all of the Pointers and Input states
    * @method Phaser.Input#reset
    * @param {boolean} hard - A soft reset (hard = false) won't reset any Signals that might be bound. A hard reset will.
    */
    reset: function (hard) {

        if (this.game.isBooted == false)
        {
            return;
        }

        if (typeof hard == 'undefined') { hard = false; }

        this.keyboard.reset();
        this.mousePointer.reset();

        for (var i = 1; i <= 10; i++)
        {
            if (this['pointer' + i])
            {
                this['pointer' + i].reset();
            }
        }

        this.currentPointers = 0;
        this.game.stage.canvas.style.cursor = "default";

        if (hard == true)
        {
            this.onDown.dispose();
            this.onUp.dispose();
            this.onTap.dispose();
            this.onHold.dispose();
            this.onDown = new Phaser.Signal();
            this.onUp = new Phaser.Signal();
            this.onTap = new Phaser.Signal();
            this.onHold = new Phaser.Signal();

            this.interactiveItems.callAll('reset');
        }

        this._pollCounter = 0;

    },

    /**
    * Resets the speed and old position properties.
    * @method Phaser.Input#resetSpeed
    * @param {number} x - Sets the oldPosition.x value.
    * @param {number} y - Sets the oldPosition.y value.
    */
    resetSpeed: function (x, y) {

        this._oldPosition.setTo(x, y);
        this.speed.setTo(0, 0);

    },

	/**
    * Find the first free Pointer object and start it, passing in the event data. This is called automatically by Phaser.Touch and Phaser.MSPointer.
    * @method Phaser.Input#startPointer
    * @param {Any} event - The event data from the Touch event.
    * @return {Phaser.Pointer} The Pointer object that was started or null if no Pointer object is available.
    */
    startPointer: function (event) {

        if (this.maxPointers < 10 && this.totalActivePointers == this.maxPointers)
        {
            return null;
        }

        if (this.pointer1.active == false)
        {
            return this.pointer1.start(event);
        }
        else if (this.pointer2.active == false)
        {
            return this.pointer2.start(event);
        }
        else
        {
            for (var i = 3; i <= 10; i++)
            {
                if (this['pointer' + i] && this['pointer' + i].active == false)
                {
                    return this['pointer' + i].start(event);
                }
            }
        }

        return null;

    },

	/**
    * Updates the matching Pointer object, passing in the event data. This is called automatically and should not normally need to be invoked.
    * @method Phaser.Input#updatePointer
    * @param {Any} event - The event data from the Touch event.
    * @return {Phaser.Pointer} The Pointer object that was updated or null if no Pointer object is available.
    */
    updatePointer: function (event) {

        if (this.pointer1.active && this.pointer1.identifier == event.identifier)
        {
            return this.pointer1.move(event);
        }
        else if (this.pointer2.active && this.pointer2.identifier == event.identifier)
        {
            return this.pointer2.move(event);
        }
        else
        {
            for (var i = 3; i <= 10; i++)
            {
                if (this['pointer' + i] && this['pointer' + i].active && this['pointer' + i].identifier == event.identifier)
                {
                    return this['pointer' + i].move(event);
                }
            }
        }

        return null;

    },

	/**
    * Stops the matching Pointer object, passing in the event data.
    * @method Phaser.Input#stopPointer
    * @param {Any} event - The event data from the Touch event.
    * @return {Phaser.Pointer} The Pointer object that was stopped or null if no Pointer object is available.
    */
    stopPointer: function (event) {

        if (this.pointer1.active && this.pointer1.identifier == event.identifier)
        {
            return this.pointer1.stop(event);
        }
        else if (this.pointer2.active && this.pointer2.identifier == event.identifier)
        {
            return this.pointer2.stop(event);
        }
        else
        {
            for (var i = 3; i <= 10; i++)
            {
                if (this['pointer' + i] && this['pointer' + i].active && this['pointer' + i].identifier == event.identifier)
                {
                    return this['pointer' + i].stop(event);
                }
            }
        }

        return null;

    },

	/**
    * Get the next Pointer object whos active property matches the given state
    * @method Phaser.Input#getPointer
    * @param {boolean} state - The state the Pointer should be in (false for inactive, true for active).
    * @return {Phaser.Pointer} A Pointer object or null if no Pointer object matches the requested state.
    */
    getPointer: function (state) {

        state = state || false;

        if (this.pointer1.active == state)
        {
            return this.pointer1;
        }
        else if (this.pointer2.active == state)
        {
            return this.pointer2;
        }
        else
        {
            for (var i = 3; i <= 10; i++)
            {
                if (this['pointer' + i] && this['pointer' + i].active == state)
                {
                    return this['pointer' + i];
                }
            }
        }

        return null;

    },

	/**
    * Get the Pointer object whos identified property matches the given identifier value.
    * @method Phaser.Input#getPointerFromIdentifier
    * @param {number} identifier - The Pointer.identifier value to search for.
    * @return {Phaser.Pointer} A Pointer object or null if no Pointer object matches the requested identifier.
    */
    getPointerFromIdentifier: function (identifier) {

        if (this.pointer1.identifier == identifier)
        {
            return this.pointer1;
        }
        else if (this.pointer2.identifier == identifier)
        {
            return this.pointer2;
        }
        else
        {
            for (var i = 3; i <= 10; i++)
            {
                if (this['pointer' + i] && this['pointer' + i].identifier == identifier)
                {
                    return this['pointer' + i];
                }
            }
        }

        return null;

    }

};

/**
* The X coordinate of the most recently active pointer. This value takes game scaling into account automatically. See Pointer.screenX/clientX for source values.
* @name Phaser.Input#x
* @property {number} x - The X coordinate of the most recently active pointer.
*/
Object.defineProperty(Phaser.Input.prototype, "x", {

    get: function () {
        return this._x;
    },

    set: function (value) {
        this._x = Math.floor(value);
    }

});

/**
* The Y coordinate of the most recently active pointer. This value takes game scaling into account automatically. See Pointer.screenY/clientY for source values.
* @name Phaser.Input#y
* @property {number} y - The Y coordinate of the most recently active pointer.
*/
Object.defineProperty(Phaser.Input.prototype, "y", {
    
    get: function () {
        return this._y;
    },

    set: function (value) {
        this._y = Math.floor(value);
    }

});

/**
* @name Phaser.Input#pollLocked
* @property {boolean} pollLocked - True if the Input is currently poll rate locked.
* @readonly
*/
Object.defineProperty(Phaser.Input.prototype, "pollLocked", {

    get: function () {
        return (this.pollRate > 0 && this._pollCounter < this.pollRate);
    }

});

/**
* The total number of inactive Pointers
* @name Phaser.Input#totalInactivePointers
* @property {number} totalInactivePointers - The total number of inactive Pointers.
* @readonly
*/
Object.defineProperty(Phaser.Input.prototype, "totalInactivePointers", {

    get: function () {
        return 10 - this.currentPointers;
    }

});

/**
* The total number of active Pointers
* @name Phaser.Input#totalActivePointers
* @property {number} totalActivePointers - The total number of active Pointers.
* @readonly
*/
Object.defineProperty(Phaser.Input.prototype, "totalActivePointers", {
    
    get: function () {

        this.currentPointers = 0;

        for (var i = 1; i <= 10; i++)
        {
            if (this['pointer' + i] && this['pointer' + i].active)
            {
                this.currentPointers++;
            }
        }

        return this.currentPointers;

    }

});

/**
* The world X coordinate of the most recently active pointer.
* @name Phaser.Input#worldX
* @property {number} worldX - The world X coordinate of the most recently active pointer.
*/
Object.defineProperty(Phaser.Input.prototype, "worldX", {

    get: function () {
		return this.game.camera.view.x + this.x;
    }

});

/**
* The world Y coordinate of the most recently active pointer.
* @name Phaser.Input#worldY
* @property {number} worldY - The world Y coordinate of the most recently active pointer.
*/
Object.defineProperty(Phaser.Input.prototype, "worldY", {

    get: function () {
		return this.game.camera.view.y + this.y;
    }

});

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* @class Phaser.Key
* @classdesc If you need more fine-grained control over the handling of specific keys you can create and use Phaser.Key objects.
* @constructor
* @param {Phaser.Game} game - Current game instance.
* @param {number} keycode - The key code this Key is responsible for.
*/
Phaser.Key = function (game, keycode) {

	/**
	* @property {Phaser.Game} game - A reference to the currently running game. 
	*/
	this.game = game;

	/**
	* @property {boolean} isDown - The "down" state of the key.
	* @default
	*/
	this.isDown = false;

	/**
	* @property {boolean} isUp - The "up" state of the key.
	* @default
	*/
	this.isUp = false;

	/**
	* @property {boolean} altKey - The down state of the ALT key, if pressed at the same time as this key.
	* @default
	*/
	this.altKey = false;

	/**
	* @property {boolean} ctrlKey - The down state of the CTRL key, if pressed at the same time as this key.
	* @default
	*/
	this.ctrlKey = false;

	/**
	* @property {boolean} shiftKey - The down state of the SHIFT key, if pressed at the same time as this key.
	* @default
	*/
	this.shiftKey = false;

	/**
	* @property {number} timeDown - The timestamp when the key was last pressed down.
	* @default
	*/
	this.timeDown = 0;

	/**
	* If the key is down this value holds the duration of that key press and is constantly updated.
	* If the key is up it holds the duration of the previous down session.
	* @property {number} duration - The number of milliseconds this key has been held down for.
	* @default
	*/
	this.duration = 0;

	/**
	* @property {number} timeUp - The timestamp when the key was last released.
	* @default
	*/
	this.timeUp = 0;

	/**
	* @property {number} repeats - If a key is held down this holds down the number of times the key has 'repeated'.
	* @default
	*/
	this.repeats = 0;

	/**
	* @property {number} keyCode - The keycode of this key.
	*/
	this.keyCode = keycode;

	/**
	* @property {Phaser.Signal} onDown - This Signal is dispatched every time this Key is pressed down. It is only dispatched once (until the key is released again).
	*/
    this.onDown = new Phaser.Signal();

	/**
	* @property {Phaser.Signal} onUp - This Signal is dispatched every time this Key is pressed down. It is only dispatched once (until the key is released again).
	*/
    this.onUp = new Phaser.Signal();
	
};

Phaser.Key.prototype = {

	/**
    * Called automatically by Phaser.Keyboard.
    * @method Phaser.Key#processKeyDown
    * @param {KeyboardEvent} event.
    * @protected
    */
    processKeyDown: function (event) {

        this.altKey = event.altKey;
        this.ctrlKey = event.ctrlKey;
        this.shiftKey = event.shiftKey;

        if (this.isDown)
        {
            //  Key was already held down, this must be a repeat rate based event
            this.duration = event.timeStamp - this.timeDown;
            this.repeats++;
        }
        else
        {
            this.isDown = true;
            this.isUp = false;
            this.timeDown = event.timeStamp;
            this.duration = 0;
            this.repeats = 0;

            this.onDown.dispatch(this);
        }

    },

	/**
    * Called automatically by Phaser.Keyboard.
    * @method Phaser.Key#processKeyUp
    * @param {KeyboardEvent} event.
    * @protected
    */
    processKeyUp: function (event) {

        this.isDown = false;
        this.isUp = true;
        this.timeUp = event.timeStamp;

        this.onUp.dispatch(this);

    },

	/**
	* Returns the "just pressed" state of the Key. Just pressed is considered true if the key was pressed down within the duration given (default 250ms)
    * @method Phaser.Key#justPressed
    * @param {number} [duration=250] - The duration below which the key is considered as being just pressed.
    * @return {boolean} True if the key is just pressed otherwise false.
    */
    justPressed: function (duration) {

        if (typeof duration === "undefined") { duration = 250; }

        return (this.isDown && this.duration < duration);

    },

	/**
	* Returns the "just released" state of the Key. Just released is considered as being true if the key was released within the duration given (default 250ms)
    * @method Phaser.Key#justPressed
    * @param {number} [duration=250] - The duration below which the key is considered as being just released.
    * @return {boolean} True if the key is just released otherwise false.
    */
    justReleased: function (duration) {

        if (typeof duration === "undefined") { duration = 250; }

        return (this.isDown == false && (this.game.time.now - this.timeUp < duration));

    }

};

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Phaser - Keyboard constructor.
*
* @class Phaser.Keyboard
* @classdesc A Keyboard object Description.
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
*/
Phaser.Keyboard = function (game) {

	/**
	* @property {Phaser.Game} game - Local reference to game.
	*/
	this.game = game;
	
	/**
	* @property {Description} _keys - Description.
	* @private
	*/
    this._keys = {};
    
    /**
    * @property {Description} _hotkeys - Description.
    * @private
    */
    this._hotkeys = {};

	/**
	* @property {Description} _capture - Description.
	* @private
	*/
    this._capture = {};

    /**
    * You can disable all Keyboard Input by setting disabled to true. While true all new input related events will be ignored.
    * @property {boolean} disabled - The disabled state of the Keyboard.
    * @default
    */
    this.disabled = false;

    /**
    * @property {function} _onKeyDown
    * @private
    * @default
    */
    this._onKeyDown = null;
    
    /**
    * @property {function} _onKeyUp
    * @private
    * @default
    */
    this._onKeyUp = null;

    /**
    * @property {Object} callbackContext - The context under which the callbacks are run.
    */
    this.callbackContext = this;

    /**
    * @property {function} onDownCallback - This callback is invoked every time a key is pressed down.
    */
    this.onDownCallback = null;

    /**
    * @property {function} onUpCallback - This callback is invoked every time a key is released.
    */
    this.onUpCallback = null;
	
};

Phaser.Keyboard.prototype = {

    /**
    * Add callbacks to the Keyboard handler so that each time a key is pressed down or releases the callbacks are activated.
    * @method Phaser.Keyboard#addCallbacks
    * @param {Object} context - The context under which the callbacks are run.
    * @param {function} onDown - This callback is invoked every time a key is pressed down.
    * @param {function} [onUp=null] - This callback is invoked every time a key is released.
    */
    addCallbacks: function (context, onDown, onUp) {

        this.callbackContext = context;
        this.onDownCallback = onDown;

        if (typeof onUp !== 'undefined')
        {
            this.onUpCallback = onUp;
        }

    },

    /**
    * If you need more fine-grained control over a Key you can create a new Phaser.Key object via this method.
    * The Key object can then be polled, have events attached to it, etc.
    *
    * @method Phaser.Keyboard#addKey
    * @param {number} keycode - The keycode of the key, i.e. Phaser.Keyboard.UP or Phaser.Keyboard.SPACE_BAR
    * @return {Phaser.Key} The Key object which you can store locally and reference directly.
    */
    addKey: function (keycode) {

        this._hotkeys[keycode] = new Phaser.Key(this.game, keycode);

        this.addKeyCapture(keycode);

        return this._hotkeys[keycode];

    },

    /**
    * Removes a Key object from the Keyboard manager.
    *
    * @method Phaser.Keyboard#removeKey
    * @param {number} keycode - The keycode of the key to remove, i.e. Phaser.Keyboard.UP or Phaser.Keyboard.SPACE_BAR
    */
    removeKey: function (keycode) {

        delete (this._hotkeys[keycode]);

    },

    /**
    * Creates and returns an object containing 4 hotkeys for Up, Down, Left and Right.
    *
    * @method Phaser.Keyboard#createCursorKeys
    * @return {object} An object containing properties: up, down, left and right. Which can be polled like any other Phaser.Key object.
    */
    createCursorKeys: function () {

        return { 
            up: this.addKey(Phaser.Keyboard.UP), 
            down: this.addKey(Phaser.Keyboard.DOWN), 
            left: this.addKey(Phaser.Keyboard.LEFT), 
            right: this.addKey(Phaser.Keyboard.RIGHT)
        }

    },

    /**
    * Starts the Keyboard event listeners running (keydown and keyup). They are attached to the document.body.
    * This is called automatically by Phaser.Input and should not normally be invoked directly.
    *
    * @method Phaser.Keyboard#start
    */
    start: function () {

        var _this = this;

        this._onKeyDown = function (event) {
            return _this.processKeyDown(event);
        };

        this._onKeyUp = function (event) {
            return _this.processKeyUp(event);
        };

        document.body.addEventListener('keydown', this._onKeyDown, false);
        document.body.addEventListener('keyup', this._onKeyUp, false);

    },

    /**
    * Stops the Keyboard event listeners from running (keydown and keyup). They are removed from the document.body.
    *
    * @method Phaser.Keyboard#stop
    */
    stop: function () {

        document.body.removeEventListener('keydown', this._onKeyDown);
        document.body.removeEventListener('keyup', this._onKeyUp);

    },

	/**
    * By default when a key is pressed Phaser will not stop the event from propagating up to the browser.
    * There are some keys this can be annoying for, like the arrow keys or space bar, which make the browser window scroll.
    * You can use addKeyCapture to consume the keyboard event for specific keys so it doesn't bubble up to the the browser.
    * Pass in either a single keycode or an array/hash of keycodes.
    * @method Phaser.Keyboard#addKeyCapture
    * @param {Any} keycode
    */
    addKeyCapture: function (keycode) {

        if (typeof keycode === 'object')
        {
            for (var key in keycode)
            {
                this._capture[keycode[key]] = true;
            }
        }
        else
        {
            this._capture[keycode] = true;
        }
    },

	/**
	* Removes an existing key capture.
	* @method Phaser.Keyboard#removeKeyCapture
    * @param {number} keycode
    */
    removeKeyCapture: function (keycode) {

        delete this._capture[keycode];

    },

	/**
	* Clear all set key captures.
	* @method Phaser.Keyboard#clearCaptures
    */
    clearCaptures: function () {

        this._capture = {};

    },

	/**
	* Process the keydown event.
	* @method Phaser.Keyboard#processKeyDown
    * @param {KeyboardEvent} event
    * @protected
    */    
    processKeyDown: function (event) {

        if (this.game.input.disabled || this.disabled)
        {
            return;
        }

        if (this._capture[event.keyCode])
        {
            event.preventDefault();
        }

        if (this.onDownCallback)
        {
            this.onDownCallback.call(this.callbackContext, event);
        }

        if (this._keys[event.keyCode] && this._keys[event.keyCode].isDown)
        {
            //  Key already down and still down, so update
            this._keys[event.keyCode].duration = this.game.time.now - this._keys[event.keyCode].timeDown;
        }
        else
        {
            if (!this._keys[event.keyCode])
            {
                //  Not used this key before, so register it
                this._keys[event.keyCode] = {
                    isDown: true,
                    timeDown: this.game.time.now,
                    timeUp: 0,
                    duration: 0
                };
            }
            else
            {
                //  Key used before but freshly down
                this._keys[event.keyCode].isDown = true;
                this._keys[event.keyCode].timeDown = this.game.time.now;
                this._keys[event.keyCode].duration = 0;
            }
        }

        if (this._hotkeys[event.keyCode])
        {
            this._hotkeys[event.keyCode].processKeyDown(event);
        }

    },

	/**
	* Process the keyup event.
	* @method Phaser.Keyboard#processKeyUp
    * @param {KeyboardEvent} event
    * @protected
    */
    processKeyUp: function (event) {

        if (this.game.input.disabled || this.disabled)
        {
            return;
        }

        if (this._capture[event.keyCode])
        {
            event.preventDefault();
        }

        if (this.onUpCallback)
        {
            this.onUpCallback.call(this.callbackContext, event);
        }

        if (this._hotkeys[event.keyCode])
        {
            this._hotkeys[event.keyCode].processKeyUp(event);
        }

        if (this._keys[event.keyCode])
        {
            this._keys[event.keyCode].isDown = false;
            this._keys[event.keyCode].timeUp = this.game.time.now;
        }
        else
        {
            //  Not used this key before, so register it
            this._keys[event.keyCode] = {
                isDown: false,
                timeDown: this.game.time.now,
                timeUp: this.game.time.now,
                duration: 0
            };
        }

    },

	/**
	* Reset the "isDown" state of all keys.
	* @method Phaser.Keyboard#reset
    */
    reset: function () {

        for (var key in this._keys)
        {
            this._keys[key].isDown = false;
        }

    },

    /**
    * Returns the "just pressed" state of the key. Just pressed is considered true if the key was pressed down within the duration given (default 250ms)
    * @method Phaser.Keyboard#justPressed
    * @param {number} keycode - The keycode of the key to remove, i.e. Phaser.Keyboard.UP or Phaser.Keyboard.SPACE_BAR
    * @param {number} [duration=250] - The duration below which the key is considered as being just pressed.
    * @return {boolean} True if the key is just pressed otherwise false.
    */
    justPressed: function (keycode, duration) {

        if (typeof duration === "undefined") { duration = 250; }

        if (this._keys[keycode] && this._keys[keycode].isDown && this._keys[keycode].duration < duration)
        {
            return true;
        }

        return false;

    },

    /**
    * Returns the "just released" state of the Key. Just released is considered as being true if the key was released within the duration given (default 250ms)
    * @method Phaser.Keyboard#justPressed
    * @param {number} keycode - The keycode of the key to remove, i.e. Phaser.Keyboard.UP or Phaser.Keyboard.SPACE_BAR
    * @param {number} [duration=250] - The duration below which the key is considered as being just released.
    * @return {boolean} True if the key is just released otherwise false.
    */
    justReleased: function (keycode, duration) {

        if (typeof duration === "undefined") { duration = 250; }

        if (this._keys[keycode] && this._keys[keycode].isDown === false && (this.game.time.now - this._keys[keycode].timeUp < duration))
        {
            return true;
        }

        return false;

    },

    /**
    * Returns true of the key is currently pressed down. Note that it can only detect key presses on the web browser.
    * @method Phaser.Keyboard#isDown
    * @param {number} keycode - The keycode of the key to remove, i.e. Phaser.Keyboard.UP or Phaser.Keyboard.SPACE_BAR
    * @return {boolean} True if the key is currently down.
    */
    isDown: function (keycode) {

        if (this._keys[keycode])
        {
            return this._keys[keycode].isDown;
        }

		return false;

    }

};

Phaser.Keyboard.A = "A".charCodeAt(0);
Phaser.Keyboard.B = "B".charCodeAt(0);
Phaser.Keyboard.C = "C".charCodeAt(0);
Phaser.Keyboard.D = "D".charCodeAt(0);
Phaser.Keyboard.E = "E".charCodeAt(0);
Phaser.Keyboard.F = "F".charCodeAt(0);
Phaser.Keyboard.G = "G".charCodeAt(0);
Phaser.Keyboard.H = "H".charCodeAt(0);
Phaser.Keyboard.I = "I".charCodeAt(0);
Phaser.Keyboard.J = "J".charCodeAt(0);
Phaser.Keyboard.K = "K".charCodeAt(0);
Phaser.Keyboard.L = "L".charCodeAt(0);
Phaser.Keyboard.M = "M".charCodeAt(0);
Phaser.Keyboard.N = "N".charCodeAt(0);
Phaser.Keyboard.O = "O".charCodeAt(0);
Phaser.Keyboard.P = "P".charCodeAt(0);
Phaser.Keyboard.Q = "Q".charCodeAt(0);
Phaser.Keyboard.R = "R".charCodeAt(0);
Phaser.Keyboard.S = "S".charCodeAt(0);
Phaser.Keyboard.T = "T".charCodeAt(0);
Phaser.Keyboard.U = "U".charCodeAt(0);
Phaser.Keyboard.V = "V".charCodeAt(0);
Phaser.Keyboard.W = "W".charCodeAt(0);
Phaser.Keyboard.X = "X".charCodeAt(0);
Phaser.Keyboard.Y = "Y".charCodeAt(0);
Phaser.Keyboard.Z = "Z".charCodeAt(0);
Phaser.Keyboard.ZERO = "0".charCodeAt(0);
Phaser.Keyboard.ONE = "1".charCodeAt(0);
Phaser.Keyboard.TWO = "2".charCodeAt(0);
Phaser.Keyboard.THREE = "3".charCodeAt(0);
Phaser.Keyboard.FOUR = "4".charCodeAt(0);
Phaser.Keyboard.FIVE = "5".charCodeAt(0);
Phaser.Keyboard.SIX = "6".charCodeAt(0);
Phaser.Keyboard.SEVEN = "7".charCodeAt(0);
Phaser.Keyboard.EIGHT = "8".charCodeAt(0);
Phaser.Keyboard.NINE = "9".charCodeAt(0);
Phaser.Keyboard.NUMPAD_0 = 96;
Phaser.Keyboard.NUMPAD_1 = 97;
Phaser.Keyboard.NUMPAD_2 = 98;
Phaser.Keyboard.NUMPAD_3 = 99;
Phaser.Keyboard.NUMPAD_4 = 100;
Phaser.Keyboard.NUMPAD_5 = 101;
Phaser.Keyboard.NUMPAD_6 = 102;
Phaser.Keyboard.NUMPAD_7 = 103;
Phaser.Keyboard.NUMPAD_8 = 104;
Phaser.Keyboard.NUMPAD_9 = 105;
Phaser.Keyboard.NUMPAD_MULTIPLY = 106;
Phaser.Keyboard.NUMPAD_ADD = 107;
Phaser.Keyboard.NUMPAD_ENTER = 108;
Phaser.Keyboard.NUMPAD_SUBTRACT = 109;
Phaser.Keyboard.NUMPAD_DECIMAL = 110;
Phaser.Keyboard.NUMPAD_DIVIDE = 111;
Phaser.Keyboard.F1 = 112;
Phaser.Keyboard.F2 = 113;
Phaser.Keyboard.F3 = 114;
Phaser.Keyboard.F4 = 115;
Phaser.Keyboard.F5 = 116;
Phaser.Keyboard.F6 = 117;
Phaser.Keyboard.F7 = 118;
Phaser.Keyboard.F8 = 119;
Phaser.Keyboard.F9 = 120;
Phaser.Keyboard.F10 = 121;
Phaser.Keyboard.F11 = 122;
Phaser.Keyboard.F12 = 123;
Phaser.Keyboard.F13 = 124;
Phaser.Keyboard.F14 = 125;
Phaser.Keyboard.F15 = 126;
Phaser.Keyboard.COLON = 186;
Phaser.Keyboard.EQUALS = 187;
Phaser.Keyboard.UNDERSCORE = 189;
Phaser.Keyboard.QUESTION_MARK = 191;
Phaser.Keyboard.TILDE = 192;
Phaser.Keyboard.OPEN_BRACKET = 219;
Phaser.Keyboard.BACKWARD_SLASH = 220;
Phaser.Keyboard.CLOSED_BRACKET = 221;
Phaser.Keyboard.QUOTES = 222;
Phaser.Keyboard.BACKSPACE = 8;
Phaser.Keyboard.TAB = 9;
Phaser.Keyboard.CLEAR = 12;
Phaser.Keyboard.ENTER = 13;
Phaser.Keyboard.SHIFT = 16;
Phaser.Keyboard.CONTROL = 17;
Phaser.Keyboard.ALT = 18;
Phaser.Keyboard.CAPS_LOCK = 20;
Phaser.Keyboard.ESC = 27;
Phaser.Keyboard.SPACEBAR = 32;
Phaser.Keyboard.PAGE_UP = 33;
Phaser.Keyboard.PAGE_DOWN = 34;
Phaser.Keyboard.END = 35;
Phaser.Keyboard.HOME = 36;
Phaser.Keyboard.LEFT = 37;
Phaser.Keyboard.UP = 38;
Phaser.Keyboard.RIGHT = 39;
Phaser.Keyboard.DOWN = 40;
Phaser.Keyboard.INSERT = 45;
Phaser.Keyboard.DELETE = 46;
Phaser.Keyboard.HELP = 47;
Phaser.Keyboard.NUM_LOCK = 144;

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Phaser - Mouse constructor.
*
* @class Phaser.Mouse
* @classdesc The Mouse class
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
*/
Phaser.Mouse = function (game) {

	/**
	* @property {Phaser.Game} game - Local reference to game.
	*/
	this.game = game;
	
	/**
	* @property {Object} callbackContext - Description.
	*/
	this.callbackContext = this.game;

	/**
	* @property {Description} mouseDownCallback - Description.
	* @default
	*/
	this.mouseDownCallback = null;
	
	/**
	* @property {Description} mouseMoveCallback - Description.
	* @default
	*/
	this.mouseMoveCallback = null;
	
	/**
	* @property {Description} mouseUpCallback - Description.
	* @default
	*/
	this.mouseUpCallback = null;

    /**
    * You can disable all Input by setting disabled = true. While set all new input related events will be ignored.
    * @property {boolean} disabled
    * @default
    */
    this.disabled = false;

    /**
    * If the mouse has been Pointer Locked successfully this will be set to true.
    * @property {boolean} locked
    * @default
    */
    this.locked = false;

};

/**
* @constant
* @type {number}
*/
Phaser.Mouse.LEFT_BUTTON = 0;

/**
* @constant
* @type {number}
*/
Phaser.Mouse.MIDDLE_BUTTON = 1;

/**
* @constant
* @type {number}
*/
Phaser.Mouse.RIGHT_BUTTON = 2;

Phaser.Mouse.prototype = {

	/**
    * Starts the event listeners running.
    * @method Phaser.Mouse#start
    */
    start: function () {

        var _this = this;

        if (this.game.device.android && this.game.device.chrome == false)
        {
            //  Android stock browser fires mouse events even if you preventDefault on the touchStart, so ...
            return;
        }

        this._onMouseDown = function (event) {
            return _this.onMouseDown(event);
        };

        this._onMouseMove = function (event) {
            return _this.onMouseMove(event);
        };

        this._onMouseUp = function (event) {
            return _this.onMouseUp(event);
        };

        this.game.renderer.view.addEventListener('mousedown', this._onMouseDown, true);
        this.game.renderer.view.addEventListener('mousemove', this._onMouseMove, true);
        this.game.renderer.view.addEventListener('mouseup', this._onMouseUp, true);

    },

	/**
	* Description.
	* @method Phaser.Mouse#onMouseDown
    * @param {MouseEvent} event
    */
    onMouseDown: function (event) {

        event.preventDefault();

        if (this.mouseDownCallback)
        {
            this.mouseDownCallback.call(this.callbackContext, event);
        }

        if (this.game.input.disabled || this.disabled)
        {
            return;
        }

        event['identifier'] = 0;

        this.game.input.mousePointer.start(event);

    },

	/**
	* Description
	* @method Phaser.Mouse#onMouseMove
    * @param {MouseEvent} event
    */
    onMouseMove: function (event) {

        event.preventDefault();

        if (this.mouseMoveCallback)
        {
            this.mouseMoveCallback.call(this.callbackContext, event);
        }

        if (this.game.input.disabled || this.disabled)
        {
            return;
        }

        event['identifier'] = 0;

        this.game.input.mousePointer.move(event);

    },

	/**
	* Description.
	* @method Phaser.Mouse#onMouseUp
    * @param {MouseEvent} event
    */
    onMouseUp: function (event) {

        event.preventDefault();

        if (this.mouseUpCallback)
        {
            this.mouseUpCallback.call(this.callbackContext, event);
        }

        if (this.game.input.disabled || this.disabled)
        {
            return;
        }

        event['identifier'] = 0;

        this.game.input.mousePointer.stop(event);

    },

    /**
    * Description.
	* @method Phaser.Mouse#requestPointerLock
    */
    requestPointerLock: function () {

        if (this.game.device.pointerLock)
        {
            var element = this.game.stage.canvas;

            element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

            element.requestPointerLock();

            var _this = this;

            this._pointerLockChange = function (event) {
                return _this.pointerLockChange(event);
            };

            document.addEventListener('pointerlockchange', this._pointerLockChange, false);
            document.addEventListener('mozpointerlockchange', this._pointerLockChange, false);
            document.addEventListener('webkitpointerlockchange', this._pointerLockChange, false);
        }

    },

	/**
	* Description.
	* @method Phaser.Mouse#pointerLockChange
    * @param {MouseEvent} event
    */
    pointerLockChange: function (event) {

        var element = this.game.stage.canvas;

        if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element)
        {
            //  Pointer was successfully locked
            this.locked = true;
        }
        else
        {
            //  Pointer was unlocked
            this.locked = false;
        }

    },

	/**
	* Description.
	* @method Phaser.Mouse#releasePointerLock
    */
    releasePointerLock: function () {

        document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;

        document.exitPointerLock();

        document.removeEventListener('pointerlockchange', this._pointerLockChange);
        document.removeEventListener('mozpointerlockchange', this._pointerLockChange);
        document.removeEventListener('webkitpointerlockchange', this._pointerLockChange);

    },

	/**
    * Stop the event listeners.
    * @method Phaser.Mouse#stop
    */
    stop: function () {

        this.game.stage.canvas.removeEventListener('mousedown', this._onMouseDown);
        this.game.stage.canvas.removeEventListener('mousemove', this._onMouseMove);
        this.game.stage.canvas.removeEventListener('mouseup', this._onMouseUp);

    }

};
/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Phaser - MSPointer constructor.
*
* @class Phaser.MSPointer
* @classdesc The MSPointer class handles touch interactions with the game and the resulting Pointer objects.
* It will work only in Internet Explorer 10 and Windows Store or Windows Phone 8 apps using JavaScript.
* http://msdn.microsoft.com/en-us/library/ie/hh673557(v=vs.85).aspx
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
*/
Phaser.MSPointer = function (game) {

	/**
	* @property {Phaser.Game} game - Local reference to game.
	*/
	this.game = game;
	
	/**
	* @property {Phaser.Game} callbackContext - Description.
	*/
	this.callbackContext = this.game;

	/**
	* @property {Description} mouseDownCallback - Description.
	* @default
	*/
	this.mouseDownCallback = null;
	
	/**
	* @property {Description} mouseMoveCallback - Description.
	* @default
	*/
	this.mouseMoveCallback = null;
	
	/**
	* @property {Description} mouseUpCallback - Description.
	* @default
	*/
	this.mouseUpCallback = null;

    /**
    * You can disable all Input by setting disabled = true. While set all new input related events will be ignored.
    * @property {boolean} disabled
    */
    this.disabled = false;

    /**
    * Description.
    * @property {Description} _onMSPointerDown
    * @private
    * @default
    */
    this._onMSPointerDown = null;
    
    /**
    * Description.
    * @property {Description} _onMSPointerMove
    * @private
    * @default
    */
    this._onMSPointerMove = null;
    
    /**
    * Description.
    * @property {Description} _onMSPointerUp
    * @private
    * @default
    */
    this._onMSPointerUp = null;

};

Phaser.MSPointer.prototype = {

	/**
    * Starts the event listeners running.
    * @method Phaser.MSPointer#start
    */
    start: function () {

        var _this = this;

        if (this.game.device.mspointer == true)
        {
            this._onMSPointerDown = function (event) {
                return _this.onPointerDown(event);
            };

            this._onMSPointerMove = function (event) {
                return _this.onPointerMove(event);
            };

            this._onMSPointerUp = function (event) {
                return _this.onPointerUp(event);
            };

            this.game.renderer.view.addEventListener('MSPointerDown', this._onMSPointerDown, false);
            this.game.renderer.view.addEventListener('MSPointerMove', this._onMSPointerMove, false);
            this.game.renderer.view.addEventListener('MSPointerUp', this._onMSPointerUp, false);

            this.game.renderer.view.style['-ms-content-zooming'] = 'none';
            this.game.renderer.view.style['-ms-touch-action'] = 'none';

        }

    },

    /**
    * Description.
    * @method Phaser.MSPointer#onPointerDown
    * @param {Any} event
    **/
    onPointerDown: function (event) {

        if (this.game.input.disabled || this.disabled)
        {
            return;
        }

        event.preventDefault();
        event.identifier = event.pointerId;

        this.game.input.startPointer(event);

    },

    /**
    * Description.
    * @method Phaser.MSPointer#onPointerMove
    * @param {Any} event
    **/
    onPointerMove: function (event) {

        if (this.game.input.disabled || this.disabled)
        {
            return;
        }

        event.preventDefault();
        event.identifier = event.pointerId;

        this.game.input.updatePointer(event);

    },

    /**
    * Description.
    * @method Phaser.MSPointer#onPointerUp
    * @param {Any} event
    **/
    onPointerUp: function (event) {

        if (this.game.input.disabled || this.disabled)
        {
            return;
        }

        event.preventDefault();
        event.identifier = event.pointerId;

        this.game.input.stopPointer(event);

    },

	/**
    * Stop the event listeners.
    * @method Phaser.MSPointer#stop
    */
    stop: function () {

        this.game.stage.canvas.removeEventListener('MSPointerDown', this._onMSPointerDown);
        this.game.stage.canvas.removeEventListener('MSPointerMove', this._onMSPointerMove);
        this.game.stage.canvas.removeEventListener('MSPointerUp', this._onMSPointerUp);

    }

};
/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Phaser - Pointer constructor.
*
* @class Phaser.Pointer
* @classdesc A Pointer object is used by the Mouse, Touch and MSPoint managers and represents a single finger on the touch screen.
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {Description} id - Description.
*/
Phaser.Pointer = function (game, id) {

    /**
    * @property {Phaser.Game} game - Local reference to game.
    */
    this.game = game;

    /**
    * @property {Description} id - Description.
    */
    this.id = id;

    /**
    * Local private variable to store the status of dispatching a hold event.
    * @property {boolean} _holdSent
    * @private
    * @default
    */
    this._holdSent = false;

    /**
    * Local private variable storing the short-term history of pointer movements.
    * @property {array} _history
    * @private
    */
    this._history = [];

    /**
    * Local private variable storing the time at which the next history drop should occur
    * @property {number} _lastDrop
    * @private
    * @default
    */
    this._nextDrop = 0;

    /**
     * Monitor events outside of a state reset loop.
     * @property {boolean} _stateReset
     * @private
     * @default
     */
    this._stateReset = false;

    /**
    * A Vector object containing the initial position when the Pointer was engaged with the screen.
    * @property {Vec2} positionDown
    * @default 
    **/
    this.positionDown = null;

    /**
    * A Vector object containing the current position of the Pointer on the screen.
    * @property {Vec2} position
    * @default
    **/
    this.position = null;

    /**
    * A Circle object centered on the x/y screen coordinates of the Pointer.
    * Default size of 44px (Apple's recommended "finger tip" size).
    * @property {Circle} circle
    * @default
    **/
    this.circle = null;

    /**
    * Description.
    * @property {boolean} withinGame
    */
    this.withinGame = false;

    /**
    * The horizontal coordinate of point relative to the viewport in pixels, excluding any scroll offset.
    * @property {number} clientX
    * @default
    */
    this.clientX = -1;

    /**
    * The vertical coordinate of point relative to the viewport in pixels, excluding any scroll offset.
    * @property {number} clientY
    * @default
    */
    this.clientY = -1;

    /**
    * The horizontal coordinate of point relative to the viewport in pixels, including any scroll offset.
    * @property {number} pageX
    * @default
    */
    this.pageX = -1;

    /**
    * The vertical coordinate of point relative to the viewport in pixels, including any scroll offset.
    * @property {number} pageY
    * @default
    */
    this.pageY = -1;

    /**
    * The horizontal coordinate of point relative to the screen in pixels.
    * @property {number} screenX
    * @default
    */
    this.screenX = -1;

    /**
    * The vertical coordinate of point relative to the screen in pixels.
    * @property {number} screenY
    * @default
    */
    this.screenY = -1;

    /**
    * The horizontal coordinate of point relative to the game element. This value is automatically scaled based on game size.
    * @property {number} x
    * @default
    */
    this.x = -1;

    /**
    * The vertical coordinate of point relative to the game element. This value is automatically scaled based on game size.
    * @property {number} y
    * @default
    */
    this.y = -1;

    /**
    * If the Pointer is a mouse this is true, otherwise false.
    * @property {boolean} isMouse
    * @type {boolean}
    */
    this.isMouse = false;

    /**
    * If the Pointer is touching the touchscreen, or the mouse button is held down, isDown is set to true.
    * @property {boolean} isDown
    * @default
    */
    this.isDown = false;

    /**
    * If the Pointer is not touching the touchscreen, or the mouse button is up, isUp is set to true.
    * @property {boolean} isUp
    * @default
    */
    this.isUp = true;

    /**
    * A timestamp representing when the Pointer first touched the touchscreen.
    * @property {number} timeDown
    * @default
    */
    this.timeDown = 0;

    /**
    * A timestamp representing when the Pointer left the touchscreen.
    * @property {number} timeUp
    * @default
    */
    this.timeUp = 0;

    /**
    * A timestamp representing when the Pointer was last tapped or clicked.
    * @property {number} previousTapTime
    * @default
    */
    this.previousTapTime = 0;

    /**
    * The total number of times this Pointer has been touched to the touchscreen.
    * @property {number} totalTouches
    * @default
    */
    this.totalTouches = 0;

    /**
    * The number of miliseconds since the last click.
    * @property {number} msSinceLastClick
    * @default
    */
    this.msSinceLastClick = Number.MAX_VALUE;

    /**
    * The Game Object this Pointer is currently over / touching / dragging.
    * @property {Any} targetObject
    * @default
    */
    this.targetObject = null;

    /**
    * Description.
    * @property {boolean} isDown - Description.
    * @default
    */
    this.active = false;

    /**
    * Description
    * @property {Phaser.Point} position
    */
    this.position = new Phaser.Point();
    
    /**
    * Description
    * @property {Phaser.Point} positionDown
    */
    this.positionDown = new Phaser.Point();

    /**
    * Description
    * @property {Phaser.Circle} circle
    */
    this.circle = new Phaser.Circle(0, 0, 44);

    if (id == 0)
    {
        this.isMouse = true;
    }

};

Phaser.Pointer.prototype = {

	/**
    * Called when the Pointer is pressed onto the touchscreen.
    * @method Phaser.Pointer#start
    * @param {Any} event
    */
    start: function (event) {

        this.identifier = event.identifier;
        this.target = event.target;

        if (typeof event.button !== 'undefined')
        {
            this.button = event.button;
        }

        //  Fix to stop rogue browser plugins from blocking the visibility state event
        if (this.game.paused == true && this.game.stage.scale.incorrectOrientation == false)
        {
            this.game.paused = false;
            return this;
        }

        this._history.length = 0;
        this.active = true;
        this.withinGame = true;
        this.isDown = true;
        this.isUp = false;

        //  Work out how long it has been since the last click
        this.msSinceLastClick = this.game.time.now - this.timeDown;
        this.timeDown = this.game.time.now;
        this._holdSent = false;

        //  This sets the x/y and other local values
        this.move(event);

        // x and y are the old values here?
        this.positionDown.setTo(this.x, this.y);

        if (this.game.input.multiInputOverride == Phaser.Input.MOUSE_OVERRIDES_TOUCH || this.game.input.multiInputOverride == Phaser.Input.MOUSE_TOUCH_COMBINE || (this.game.input.multiInputOverride == Phaser.Input.TOUCH_OVERRIDES_MOUSE && this.game.input.currentPointers == 0))
        {
            this.game.input.x = this.x;
            this.game.input.y = this.y;
            this.game.input.position.setTo(this.x, this.y);
            this.game.input.onDown.dispatch(this, event);
            this.game.input.resetSpeed(this.x, this.y);
        }

        this._stateReset = false;
        this.totalTouches++;

        if (this.isMouse == false)
        {
            this.game.input.currentPointers++;
        }

        if (this.targetObject !== null)
        {
            this.targetObject._touchedHandler(this);
        }

        return this;

    },

	/**
    * Description.
    * @method Phaser.Pointer#update
    */
    update: function () {

        if (this.active)
        {
            if (this._holdSent == false && this.duration >= this.game.input.holdRate)
            {
                if (this.game.input.multiInputOverride == Phaser.Input.MOUSE_OVERRIDES_TOUCH || this.game.input.multiInputOverride == Phaser.Input.MOUSE_TOUCH_COMBINE || (this.game.input.multiInputOverride == Phaser.Input.TOUCH_OVERRIDES_MOUSE && this.game.input.currentPointers == 0))
                {
                    this.game.input.onHold.dispatch(this);
                }

                this._holdSent = true;
            }

            //  Update the droppings history
            if (this.game.input.recordPointerHistory && this.game.time.now >= this._nextDrop)
            {
                this._nextDrop = this.game.time.now + this.game.input.recordRate;

                this._history.push({
                    x: this.position.x,
                    y: this.position.y
                });
            
                if (this._history.length > this.game.input.recordLimit)
                {
                    this._history.shift();
                }
            }
        }

    },

	/**
    * Called when the Pointer is moved
    * @method Phaser.Pointer#move
    * @param {Any} event
    */
    move: function (event) {

        if (this.game.input.pollLocked)
        {
            return;
        }

        if (typeof event.button !== 'undefined')
        {
            this.button = event.button;
        }

        this.clientX = event.clientX;
        this.clientY = event.clientY;

        this.pageX = event.pageX;
        this.pageY = event.pageY;

        this.screenX = event.screenX;
        this.screenY = event.screenY;

        this.x = (this.pageX - this.game.stage.offset.x) * this.game.input.scale.x;
        this.y = (this.pageY - this.game.stage.offset.y) * this.game.input.scale.y;

        this.position.setTo(this.x, this.y);
        this.circle.x = this.x;
        this.circle.y = this.y;

        if (this.game.input.multiInputOverride == Phaser.Input.MOUSE_OVERRIDES_TOUCH || this.game.input.multiInputOverride == Phaser.Input.MOUSE_TOUCH_COMBINE || (this.game.input.multiInputOverride == Phaser.Input.TOUCH_OVERRIDES_MOUSE && this.game.input.currentPointers == 0))
        {
            this.game.input.activePointer = this;
            this.game.input.x = this.x;
            this.game.input.y = this.y;
            this.game.input.position.setTo(this.game.input.x, this.game.input.y);
            this.game.input.circle.x = this.game.input.x;
            this.game.input.circle.y = this.game.input.y;
        }

        //  If the game is paused we don't process any target objects
        if (this.game.paused)
        {
            return this;
        }

        //  Easy out if we're dragging something and it still exists
        if (this.targetObject !== null && this.targetObject.isDragged == true)
        {
            if (this.targetObject.update(this) == false)
            {
                this.targetObject = null;
            }

            return this;

        }

        //  Work out which object is on the top
        this._highestRenderOrderID = -1;
        this._highestRenderObject = null;
        this._highestInputPriorityID = -1;

        //  Just run through the linked list
        if (this.game.input.interactiveItems.total > 0)
        {
            var currentNode = this.game.input.interactiveItems.next;

            do  
            {
                //  If the object is using pixelPerfect checks, or has a higher InputManager.PriorityID OR if the priority ID is the same as the current highest AND it has a higher renderOrderID, then set it to the top
                if (currentNode.pixelPerfect || currentNode.priorityID > this._highestInputPriorityID || (currentNode.priorityID == this._highestInputPriorityID && currentNode.sprite.renderOrderID > this._highestRenderOrderID))
                {
                    if (currentNode.checkPointerOver(this))
                    {
                        // console.log('HRO set', currentNode.sprite.name);
                        this._highestRenderOrderID = currentNode.sprite.renderOrderID;
                        this._highestInputPriorityID = currentNode.priorityID;
                        this._highestRenderObject = currentNode;
                    }
                }
                currentNode = currentNode.next;
            }
            while (currentNode != null)
        }

        if (this._highestRenderObject == null)
        {
            //  The pointer isn't currently over anything, check if we've got a lingering previous target
            if (this.targetObject)
            {
                // console.log("The pointer isn't currently over anything, check if we've got a lingering previous target");
                this.targetObject._pointerOutHandler(this);
                this.targetObject = null;
            }
        }
        else
        {
            if (this.targetObject == null)
            {
                //  And now set the new one
                // console.log('And now set the new one');
                this.targetObject = this._highestRenderObject;
                this._highestRenderObject._pointerOverHandler(this);
            }
            else
            {
                //  We've got a target from the last update
                // console.log("We've got a target from the last update");
                if (this.targetObject == this._highestRenderObject)
                {
                    //  Same target as before, so update it
                    // console.log("Same target as before, so update it");
                    if (this._highestRenderObject.update(this) == false)
                    {
                        this.targetObject = null;
                    }
                }
                else
                {
                    //  The target has changed, so tell the old one we've left it
                    // console.log("The target has changed, so tell the old one we've left it");
                    this.targetObject._pointerOutHandler(this);

                    //  And now set the new one
                    this.targetObject = this._highestRenderObject;
                    this.targetObject._pointerOverHandler(this);
                }
            }
        }

        return this;

    },

	/**
    * Called when the Pointer leaves the target area.
    * @method Phaser.Pointer#leave
    * @param {Any} event
    */
    leave: function (event) {

        this.withinGame = false;
        this.move(event);

    },

	/**
    * Called when the Pointer leaves the touchscreen.
    * @method Phaser.Pointer#stop
    * @param {Any} event
    */
    stop: function (event) {

        if (this._stateReset)
        {
            event.preventDefault();
            return;
        }

        this.timeUp = this.game.time.now;

        if (this.game.input.multiInputOverride == Phaser.Input.MOUSE_OVERRIDES_TOUCH || this.game.input.multiInputOverride == Phaser.Input.MOUSE_TOUCH_COMBINE || (this.game.input.multiInputOverride == Phaser.Input.TOUCH_OVERRIDES_MOUSE && this.game.input.currentPointers == 0))
        {
            this.game.input.onUp.dispatch(this, event);

            //  Was it a tap?
            if (this.duration >= 0 && this.duration <= this.game.input.tapRate)
            {
                //  Was it a double-tap?
                if (this.timeUp - this.previousTapTime < this.game.input.doubleTapRate)
                {
                    //  Yes, let's dispatch the signal then with the 2nd parameter set to true
                    this.game.input.onTap.dispatch(this, true);
                }
                else
                {
                    //  Wasn't a double-tap, so dispatch a single tap signal
                    this.game.input.onTap.dispatch(this, false);
                }

                this.previousTapTime = this.timeUp;
            }
        }

        //  Mouse is always active
        if (this.id > 0)
        {
            this.active = false;
        }

        this.withinGame = false;
        this.isDown = false;
        this.isUp = true;

        if (this.isMouse == false)
        {
            this.game.input.currentPointers--;
        }

        if (this.game.input.interactiveItems.total > 0)
        {
            var currentNode = this.game.input.interactiveItems.next;
            
            do  
            {
                if (currentNode)
                {
                    currentNode._releasedHandler(this);
                }
                
                currentNode = currentNode.next;
            }
            while (currentNode != null)
        }

        if (this.targetObject)
        {
            this.targetObject._releasedHandler(this);
        }

        this.targetObject = null;
        return this;

    },

	/**
    * The Pointer is considered justPressed if the time it was pressed onto the touchscreen or clicked is less than justPressedRate.
    * @method Phaser.Pointer#justPressed
    * @param {number} [duration]
    * @return {boolean}
    */
    justPressed: function (duration) {

        duration = duration || this.game.input.justPressedRate;

        return (this.isDown === true && (this.timeDown + duration) > this.game.time.now);

    },

	/**
    * The Pointer is considered justReleased if the time it left the touchscreen is less than justReleasedRate.
    * @method Phaser.Pointer#justReleased
    * @param {number} [duration]
    * @return {boolean}
    */
    justReleased: function (duration) {

        duration = duration || this.game.input.justReleasedRate;

        return (this.isUp === true && (this.timeUp + duration) > this.game.time.now);

    },

	/**
    * Resets the Pointer properties. Called by InputManager.reset when you perform a State change.
    * @method Phaser.Pointer#reset
    */
    reset: function () {

        if (this.isMouse == false)
        {
            this.active = false;
        }

        this.identifier = null;
        this.isDown = false;
        this.isUp = true;
        this.totalTouches = 0;
        this._holdSent = false;
        this._history.length = 0;
        this._stateReset = true;

        if (this.targetObject)
        {
            this.targetObject._releasedHandler(this);
        }

        this.targetObject = null;

    },

	/**
    * Returns a string representation of this object.
    * @method Phaser.Pointer#toString
    * @return {string} A string representation of the instance.
    **/
    toString: function () {
        return "[{Pointer (id=" + this.id + " identifer=" + this.identifier + " active=" + this.active + " duration=" + this.duration + " withinGame=" + this.withinGame + " x=" + this.x + " y=" + this.y + " clientX=" + this.clientX + " clientY=" + this.clientY + " screenX=" + this.screenX + " screenY=" + this.screenY + " pageX=" + this.pageX + " pageY=" + this.pageY + ")}]";
    }

};

/**
* How long the Pointer has been depressed on the touchscreen. If not currently down it returns -1.
* @name Phaser.Pointer#duration
* @property {number} duration - How long the Pointer has been depressed on the touchscreen. If not currently down it returns -1.
* @readonly
*/
Object.defineProperty(Phaser.Pointer.prototype, "duration", {

    get: function () {

        if (this.isUp)
        {
            return -1;
        }

        return this.game.time.now - this.timeDown;

    }

});

/**
* Gets the X value of this Pointer in world coordinates based on the world camera.
* @name Phaser.Pointer#worldX
* @property {number} duration - The X value of this Pointer in world coordinates based on the world camera.
* @readonly
*/
Object.defineProperty(Phaser.Pointer.prototype, "worldX", {

    get: function () {

		return this.game.world.camera.x + this.x;

    }

});

/**
* Gets the Y value of this Pointer in world coordinates based on the world camera.
* @name Phaser.Pointer#worldY
* @property {number} duration - The Y value of this Pointer in world coordinates based on the world camera.
* @readonly
*/
Object.defineProperty(Phaser.Pointer.prototype, "worldY", {

    get: function () {

		return this.game.world.camera.y + this.y;

    }

});

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Phaser.Touch handles touch events with your game. Note: Android 2.x only supports 1 touch event at once, no multi-touch.
*
* @class Phaser.Touch
* @classdesc The Touch class handles touch interactions with the game and the resulting Pointer objects.
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
*/
Phaser.Touch = function (game) {

    /**
    * @property {Phaser.Game} game - Local reference to game.
    */
    this.game = game;
    
    /**
    * You can disable all Input by setting disabled = true. While set all new input related events will be ignored.
    * @method Phaser.Touch#disabled
    * @return {boolean}
    */
    this.disabled = false;

    /**
    * @property {Phaser.Game} callbackContext - Description.
    */
    this.callbackContext = this.game;

    /**
    * @property {Phaser.Game} touchStartCallback - Description.
    * @default
    */
    this.touchStartCallback = null;
    
    /**
    * @property {Phaser.Game} touchMoveCallback - Description.
    * @default
    */
    this.touchMoveCallback = null;
    
    /**
    * @property {Phaser.Game} touchEndCallback - Description.
    * @default
    */
    this.touchEndCallback = null;
    
    /**
    * @property {Phaser.Game} touchEnterCallback - Description.
    * @default
    */
    this.touchEnterCallback = null;
    
    /**
    * @property {Phaser.Game} touchLeaveCallback - Description.
    * @default
    */
    this.touchLeaveCallback = null;
    
    /**
    * @property {Description} touchCancelCallback - Description.
    * @default
    */
    this.touchCancelCallback = null;
    
    /**
    * @property {boolean} preventDefault - Description.
    * @default
    */
    this.preventDefault = true;

    this._onTouchStart = null;
    this._onTouchMove = null;
    this._onTouchEnd = null;
    this._onTouchEnter = null;
    this._onTouchLeave = null;
    this._onTouchCancel = null;
    this._onTouchMove = null;

};

Phaser.Touch.prototype = {

    /**
    * Starts the event listeners running.
    * @method Phaser.Touch#start
    */
    start: function () {

        var _this = this;

        if (this.game.device.touch)
        {
            this._onTouchStart = function (event) {
                return _this.onTouchStart(event);
            };

            this._onTouchMove = function (event) {
                return _this.onTouchMove(event);
            };

            this._onTouchEnd = function (event) {
                return _this.onTouchEnd(event);
            };

            this._onTouchEnter = function (event) {
                return _this.onTouchEnter(event);
            };

            this._onTouchLeave = function (event) {
                return _this.onTouchLeave(event);
            };

            this._onTouchCancel = function (event) {
                return _this.onTouchCancel(event);
            };

            this.game.renderer.view.addEventListener('touchstart', this._onTouchStart, false);
            this.game.renderer.view.addEventListener('touchmove', this._onTouchMove, false);
            this.game.renderer.view.addEventListener('touchend', this._onTouchEnd, false);
            this.game.renderer.view.addEventListener('touchenter', this._onTouchEnter, false);
            this.game.renderer.view.addEventListener('touchleave', this._onTouchLeave, false);
            this.game.renderer.view.addEventListener('touchcancel', this._onTouchCancel, false);
        }

    },

    /**
    * Consumes all touchmove events on the document (only enable this if you know you need it!).
    * @method Phaser.Touch#consumeTouchMove
    */
    consumeDocumentTouches: function () {

        this._documentTouchMove = function (event) {
            event.preventDefault();
        };

        document.addEventListener('touchmove', this._documentTouchMove, false);

    },

    /**
    * Description.
    * @method Phaser.Touch#onTouchStart
    * @param {Any} event
    */
    onTouchStart: function (event) {

        if (this.touchStartCallback)
        {
            this.touchStartCallback.call(this.callbackContext, event);
        }

        if (this.game.input.disabled || this.disabled)
        {
            return;
        }

        if (this.preventDefault)
        {
            event.preventDefault();
        }

        //  event.targetTouches = list of all touches on the TARGET ELEMENT (i.e. game dom element)
        //  event.touches = list of all touches on the ENTIRE DOCUMENT, not just the target element
        //  event.changedTouches = the touches that CHANGED in this event, not the total number of them
        for (var i = 0; i < event.changedTouches.length; i++)
        {
            this.game.input.startPointer(event.changedTouches[i]);
        }

    },

    /**
    * Touch cancel - touches that were disrupted (perhaps by moving into a plugin or browser chrome).
    * Occurs for example on iOS when you put down 4 fingers and the app selector UI appears.
    * @method Phaser.Touch#onTouchCancel
    * @param {Any} event
    */
    onTouchCancel: function (event) {

        if (this.touchCancelCallback)
        {
            this.touchCancelCallback.call(this.callbackContext, event);
        }

        if (this.game.input.disabled || this.disabled)
        {
            return;
        }

        if (this.preventDefault)
        {
            event.preventDefault();
        }

        //  Touch cancel - touches that were disrupted (perhaps by moving into a plugin or browser chrome)
        //  http://www.w3.org/TR/touch-events/#dfn-touchcancel
        for (var i = 0; i < event.changedTouches.length; i++)
        {
            this.game.input.stopPointer(event.changedTouches[i]);
        }

    },

    /**
    * For touch enter and leave its a list of the touch points that have entered or left the target.
    * Doesn't appear to be supported by most browsers on a canvas element yet.
    * @method Phaser.Touch#onTouchEnter
    * @param {Any} event
    */
    onTouchEnter: function (event) {

        if (this.touchEnterCallback)
        {
            this.touchEnterCallback.call(this.callbackContext, event);
        }

        if (this.game.input.disabled || this.disabled)
        {
            return;
        }

        if (this.preventDefault)
        {
            event.preventDefault();
        }

        for (var i = 0; i < event.changedTouches.length; i++)
        {
            //console.log('touch enter');
        }

    },

    /**
    * For touch enter and leave its a list of the touch points that have entered or left the target.
    * Doesn't appear to be supported by most browsers on a canvas element yet.
    * @method Phaser.Touch#onTouchLeave
    * @param {Any} event
    */    
    onTouchLeave: function (event) {

        if (this.touchLeaveCallback)
        {
            this.touchLeaveCallback.call(this.callbackContext, event);
        }

        if (this.preventDefault)
        {
            event.preventDefault();
        }

        for (var i = 0; i < event.changedTouches.length; i++)
        {
            //console.log('touch leave');
        }

    },

    /**
    * Description.
    * @method Phaser.Touch#onTouchMove
    * @param {Any} event
    */
    onTouchMove: function (event) {

        if (this.touchMoveCallback)
        {
            this.touchMoveCallback.call(this.callbackContext, event);
        }

        if (this.preventDefault)
        {
            event.preventDefault();
        }

        for (var i = 0; i < event.changedTouches.length; i++)
        {
            this.game.input.updatePointer(event.changedTouches[i]);
        }

    },

    /**
    * Description.
    * @method Phaser.Touch#onTouchEnd
    * @param {Any} event
    */
    onTouchEnd: function (event) {

        if (this.touchEndCallback)
        {
            this.touchEndCallback.call(this.callbackContext, event);
        }

        if (this.preventDefault)
        {
            event.preventDefault();
        }

        //  For touch end its a list of the touch points that have been removed from the surface
        //  https://developer.mozilla.org/en-US/docs/DOM/TouchList
        //  event.changedTouches = the touches that CHANGED in this event, not the total number of them
        for (var i = 0; i < event.changedTouches.length; i++)
        {
            this.game.input.stopPointer(event.changedTouches[i]);
        }

    },

    /**
    * Stop the event listeners.
    * @method Phaser.Touch#stop
    */
    stop: function () {

        if (this.game.device.touch)
        {
            this.game.stage.canvas.removeEventListener('touchstart', this._onTouchStart);
            this.game.stage.canvas.removeEventListener('touchmove', this._onTouchMove);
            this.game.stage.canvas.removeEventListener('touchend', this._onTouchEnd);
            this.game.stage.canvas.removeEventListener('touchenter', this._onTouchEnter);
            this.game.stage.canvas.removeEventListener('touchleave', this._onTouchLeave);
            this.game.stage.canvas.removeEventListener('touchcancel', this._onTouchCancel);
        }

    }

};
/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Constructor for Phaser InputHandler.
* @class Phaser.InputHandler
* @classdesc Description.
* @constructor
* @param {Phaser.Sprite} game - Description.
*/
Phaser.InputHandler = function (sprite) {

	/**
	* @property {Phaser.Sprite} sprite - Description. 
	*/
	this.sprite = sprite;

    /**
    * @property {Phaser.Game} game - A reference to the currently running game. 
    */
    this.game = sprite.game;

	/**
	* @property {boolean} enabled - Description. 
	* @default
	*/
    this.enabled = false;

    //	Linked list references
	/**
	* @property {Description} parent - Description. 
	* @default
	*/
    this.parent = null;
    
	/**
	* @property {Description} next - Description. 
	* @default
	*/
    this.next = null;
    
	/**
	* @property {Description} prev - Description. 
	* @default
	*/
    this.prev = null;
    
	/**
	* @property {Description} last - Description. 
	* @default
	*/
	this.last = this;
	
	/**
	* @property {Description} first - Description. 
	* @default
	*/
	this.first = this;

	/**
	* @property {number} priorityID - The PriorityID controls which Sprite receives an Input event first if they should overlap.
	* @default
	*/
    this.priorityID = 0;
    
	/**
	* @property {boolean} useHandCursor - Description. 
	* @default
	*/
    this.useHandCursor = false;
	
	/**
	* @property {boolean} isDragged - Description. 
	* @default
	*/
    this.isDragged = false;
    
	/**
	* @property {boolean} allowHorizontalDrag - Description. 
	* @default
	*/
    this.allowHorizontalDrag = true;
    
	/**
	* @property {boolean} allowVerticalDrag - Description. 
	* @default
	*/
    this.allowVerticalDrag = true;
    
	/**
	* @property {boolean} bringToTop - Description. 
	* @default
	*/
    this.bringToTop = false;

	/**
	* @property {Description} snapOffset - Description. 
	* @default
	*/
    this.snapOffset = null;
    
	/**
	* @property {boolean} snapOnDrag - Description. 
	* @default
	*/
    this.snapOnDrag = false;
    
	/**
	* @property {boolean} snapOnRelease - Description. 
	* @default
	*/
    this.snapOnRelease = false;
    
	/**
	* @property {number} snapX - Description. 
	* @default
	*/
    this.snapX = 0;
    
	/**
	* @property {number} snapY - Description. 
	* @default
	*/
    this.snapY = 0;

	/**
	* @property {number} pixelPerfect - Should we use pixel perfect hit detection? Warning: expensive. Only enable if you really need it!
	* @default
	*/
    this.pixelPerfect = false;

    /**
    * @property {number} pixelPerfectAlpha - The alpha tolerance threshold. If the alpha value of the pixel matches or is above this value, it's considered a hit.
    * @default
    */
    this.pixelPerfectAlpha = 255;

    /**
    * @property {boolean} draggable - Is this sprite allowed to be dragged by the mouse? true = yes, false = no
    * @default 
    */
    this.draggable = false;

    /**
    * @property {Description} boundsRect - A region of the game world within which the sprite is restricted during drag.
    * @default 
    */
    this.boundsRect = null;

    /**
    * @property {Description} boundsSprite - A Sprite the bounds of which this sprite is restricted during drag.
    * @default
    */
    this.boundsSprite = null;

    /**
    * If this object is set to consume the pointer event then it will stop all propogation from this object on.
    * For example if you had a stack of 6 sprites with the same priority IDs and one consumed the event, none of the others would receive it.
    * @property {boolean} consumePointerEvent
    * @default
    */
    this.consumePointerEvent = false;

    /**
    * @property {Phaser.Point} _tempPoint - Description.
    * @private
    */
    this._tempPoint = new Phaser.Point;

    this._pointerData = [];

    this._pointerData.push({
        id: 0,
        x: 0,
        y: 0,
        isDown: false,
        isUp: false,
        isOver: false,
        isOut: false,
        timeOver: 0,
        timeOut: 0,
        timeDown: 0,
        timeUp: 0,
        downDuration: 0,
        isDragged: false
    });

};

Phaser.InputHandler.prototype = {

	/**
	* Description.
	* @method Phaser.InputHandler#start
	* @param {number} priority - Description.
	* @param {boolean} useHandCursor - Description.
	* @return {Phaser.Sprite} Description.
	*/
	start: function (priority, useHandCursor) {

		priority = priority || 0;
		if (typeof useHandCursor == 'undefined') { useHandCursor = false; }

        //  Turning on
        if (this.enabled == false)
        {
            //  Register, etc
			this.game.input.interactiveItems.add(this);
            this.useHandCursor = useHandCursor;
            this.priorityID = priority;

            for (var i = 0; i < 10; i++)
            {
                this._pointerData[i] = {
                    id: i,
                    x: 0,
                    y: 0,
                    isDown: false,
                    isUp: false,
                    isOver: false,
                    isOut: false,
                    timeOver: 0,
                    timeOut: 0,
                    timeDown: 0,
                    timeUp: 0,
                    downDuration: 0,
                    isDragged: false
                };
            }

            this.snapOffset = new Phaser.Point;
            this.enabled = true;

            //  Create the signals the Input component will emit
            if (this.sprite.events && this.sprite.events.onInputOver == null)
            {
                this.sprite.events.onInputOver = new Phaser.Signal;
                this.sprite.events.onInputOut = new Phaser.Signal;
                this.sprite.events.onInputDown = new Phaser.Signal;
                this.sprite.events.onInputUp = new Phaser.Signal;
                this.sprite.events.onDragStart = new Phaser.Signal;
                this.sprite.events.onDragStop = new Phaser.Signal;
            }
        }

        return this.sprite;

	},

	/**
	* Description.
	* @method Phaser.InputHandler#reset
	*/
    reset: function () {

        this.enabled = false;

        for (var i = 0; i < 10; i++)
        {
            this._pointerData[i] = {
                id: i,
                x: 0,
                y: 0,
                isDown: false,
                isUp: false,
                isOver: false,
                isOut: false,
                timeOver: 0,
                timeOut: 0,
                timeDown: 0,
                timeUp: 0,
                downDuration: 0,
                isDragged: false
            };
        }
    },

	/**
	* Description.
	* @method Phaser.InputHandler#stop
	*/
	stop: function () {

        //  Turning off
        if (this.enabled == false)
        {
            return;
        }
        else
        {
            //  De-register, etc
            this.enabled = false;
			this.game.input.interactiveItems.remove(this);
        }

	},

	/**
	* Clean up memory.
	* @method Phaser.InputHandler#destroy
	*/
    destroy: function () {

        if (this.enabled)
        {
            this.enabled = false;

            this.game.input.interactiveItems.remove(this);

        	this.stop();

        	this.sprite = null;
        }
    },

	/**
    * The x coordinate of the Input pointer, relative to the top-left of the parent Sprite.
    * This value is only set when the pointer is over this Sprite.
    * @method Phaser.InputHandler#pointerX
    * @param {Pointer} pointer
    * @return {number} The x coordinate of the Input pointer.
    */    
    pointerX: function (pointer) {

    	pointer = pointer || 0;

        return this._pointerData[pointer].x;

    },

	/**
    * The y coordinate of the Input pointer, relative to the top-left of the parent Sprite
    * This value is only set when the pointer is over this Sprite.
    * @method Phaser.InputHandler#pointerY
    * @param {Pointer} pointer
    * @return {number} The y coordinate of the Input pointer.
    */
    pointerY: function (pointer) {

    	pointer = pointer || 0;

        return this._pointerData[pointer].y;

    },

	/**
    * If the Pointer is touching the touchscreen, or the mouse button is held down, isDown is set to true.
    * @method Phaser.InputHandler#pointerDown
    * @param {Pointer} pointer
    * @return {boolean}
    */
    pointerDown: function (pointer) {

    	pointer = pointer || 0;

        return this._pointerData[pointer].isDown;

    },

	/**
    * If the Pointer is not touching the touchscreen, or the mouse button is up, isUp is set to true
    * @method Phaser.InputHandler#pointerUp
    * @param {Pointer} pointer
    * @return {boolean}
    */
    pointerUp: function (pointer) {

    	pointer = pointer || 0;

        return this._pointerData[pointer].isUp;

    },

	/**
    * A timestamp representing when the Pointer first touched the touchscreen.
    * @method Phaser.InputHandler#pointerTimeDown
    * @param {Pointer} pointer
    * @return {number}
    */
    pointerTimeDown: function (pointer) {

    	pointer = pointer || 0;

        return this._pointerData[pointer].timeDown;

    },

	/**
    * A timestamp representing when the Pointer left the touchscreen.
    * @method Phaser.InputHandler#pointerTimeUp
    * @param {Pointer} pointer
    * @return {number}
    */
    pointerTimeUp: function (pointer) {

    	pointer = pointer || 0;

        return this._pointerData[pointer].timeUp;

    },

	/**
    * Is the Pointer over this Sprite?
    * @method Phaser.InputHandler#pointerOver
    * @param {Pointer} pointer
    * @return {bool
    */
    pointerOver: function (pointer) {

    	pointer = pointer || 0;

        return this._pointerData[pointer].isOver;

    },

	/**
    * Is the Pointer outside of this Sprite?
    * @method Phaser.InputHandler#pointerOut
    * @param {Pointer} pointer
    * @return {boolean}
    */
    pointerOut: function (pointer) {

    	pointer = pointer || 0;

        return this._pointerData[pointer].isOut;

    },

	/**
    * A timestamp representing when the Pointer first touched the touchscreen.
    * @method Phaser.InputHandler#pointerTimeOver
    * @param {Pointer} pointer
    * @return {number}
    */
    pointerTimeOver: function (pointer) {

    	pointer = pointer || 0;

        return this._pointerData[pointer].timeOver;

    },

	/**
    * A timestamp representing when the Pointer left the touchscreen.
    * @method Phaser.InputHandler#pointerTimeOut
    * @param {Pointer} pointer
    * @return {number}
    */
    pointerTimeOut: function (pointer) {

    	pointer = pointer || 0;

        return this._pointerData[pointer].timeOut;

    },

	/**
    * Is this sprite being dragged by the mouse or not?
    * @method Phaser.InputHandler#pointerTimeOut
    * @param {Pointer} pointer
    * @return {number}
    */
    pointerDragged: function (pointer) {

    	pointer = pointer || 0;

        return this._pointerData[pointer].isDragged;

    },

	/**
    * Checks if the given pointer is over this Sprite.
    * @method Phaser.InputHandler#checkPointerOver
    * @param {Pointer} pointer
    * @return {boolean}
    */
    checkPointerOver: function (pointer) {

        if (this.enabled && this.sprite.visible)
        {
            this.sprite.getLocalUnmodifiedPosition(this._tempPoint, pointer.x, pointer.y);

            if (this._tempPoint.x >= 0 && this._tempPoint.x <= this.sprite.currentFrame.width && this._tempPoint.y >= 0 && this._tempPoint.y <= this.sprite.currentFrame.height)
            {
                if (this.pixelPerfect)
                {
                    return this.checkPixel(this._tempPoint.x, this._tempPoint.y);
                }
                else
                {
                    return true;
                }
            }
        }

        return false;

    },

	/**
     * Description.
     * @method Phaser.InputHandler#checkPixel
     * @param {Description} x - Description.
     * @param {Description} y - Description.
     * @return {boolean}
     */
    checkPixel: function (x, y) {

        //  Grab a pixel from our image into the hitCanvas and then test it
        if (this.sprite.texture.baseTexture.source)
        {
            this.game.input.hitContext.clearRect(0, 0, 1, 1);

            //  This will fail if the image is part of a texture atlas - need to modify the x/y values here

            x += this.sprite.texture.frame.x;
            y += this.sprite.texture.frame.y;

            this.game.input.hitContext.drawImage(this.sprite.texture.baseTexture.source, x, y, 1, 1, 0, 0, 1, 1);
            
            var rgb = this.game.input.hitContext.getImageData(0, 0, 1, 1);

            if (rgb.data[3] >= this.pixelPerfectAlpha)
            {
                return true;
            }
        }

        return false;

    },

	/**
    * Update.
    * @method Phaser.InputHandler#update
    * @param {Pointer} pointer
    */
    update: function (pointer) {

        if (this.enabled == false || this.sprite.visible == false || (this.sprite.group && this.sprite.group.visible == false))
        {
            this._pointerOutHandler(pointer);
            return false;
        }

        if (this.draggable && this._draggedPointerID == pointer.id)
        {
            return this.updateDrag(pointer);
        }
        else if (this._pointerData[pointer.id].isOver == true)
        {
            if (this.checkPointerOver(pointer))
            {
                this._pointerData[pointer.id].x = pointer.x - this.sprite.x;
                this._pointerData[pointer.id].y = pointer.y - this.sprite.y;
                return true;
            }
            else
            {
                this._pointerOutHandler(pointer);
                return false;
            }
        }
    },

	/**
     * Description.
     * @method Phaser.InputHandler#_pointerOverHandler
     * @private
     * @param {Pointer} pointer
     */
    _pointerOverHandler: function (pointer) {

        if (this._pointerData[pointer.id].isOver == false)
        {
            this._pointerData[pointer.id].isOver = true;
            this._pointerData[pointer.id].isOut = false;
            this._pointerData[pointer.id].timeOver = this.game.time.now;
            this._pointerData[pointer.id].x = pointer.x - this.sprite.x;
            this._pointerData[pointer.id].y = pointer.y - this.sprite.y;

            if (this.useHandCursor && this._pointerData[pointer.id].isDragged == false)
            {
                this.game.stage.canvas.style.cursor = "pointer";
            }

            this.sprite.events.onInputOver.dispatch(this.sprite, pointer);
        }
    },

	/**
     * Description.
     * @method Phaser.InputHandler#_pointerOutHandler
     * @private
     * @param {Pointer} pointer
     */
    _pointerOutHandler: function (pointer) {

        this._pointerData[pointer.id].isOver = false;
        this._pointerData[pointer.id].isOut = true;
        this._pointerData[pointer.id].timeOut = this.game.time.now;

        if (this.useHandCursor && this._pointerData[pointer.id].isDragged == false)
        {
            this.game.stage.canvas.style.cursor = "default";
        }

        if (this.sprite && this.sprite.events)
        {
            this.sprite.events.onInputOut.dispatch(this.sprite, pointer);
        }

    },

	/**
     * Description.
     * @method Phaser.InputHandler#_touchedHandler
     * @private
     * @param {Pointer} pointer
     */
    _touchedHandler: function (pointer) {

        if (this._pointerData[pointer.id].isDown == false && this._pointerData[pointer.id].isOver == true)
        {
            this._pointerData[pointer.id].isDown = true;
            this._pointerData[pointer.id].isUp = false;
            this._pointerData[pointer.id].timeDown = this.game.time.now;
            this.sprite.events.onInputDown.dispatch(this.sprite, pointer);

            //  Start drag
            if (this.draggable && this.isDragged == false)
            {
                this.startDrag(pointer);
            }

            if (this.bringToTop)
            {
                this.sprite.bringToTop();
			}
        }

        //  Consume the event?
        return this.consumePointerEvent;

    },

	/**
     * Description.
     * @method Phaser.InputHandler#_releasedHandler
     * @private
     * @param {Pointer} pointer
     */
    _releasedHandler: function (pointer) {

        //  If was previously touched by this Pointer, check if still is AND still over this item
        if (this._pointerData[pointer.id].isDown && pointer.isUp)
        {
            this._pointerData[pointer.id].isDown = false;
            this._pointerData[pointer.id].isUp = true;
            this._pointerData[pointer.id].timeUp = this.game.time.now;
            this._pointerData[pointer.id].downDuration = this._pointerData[pointer.id].timeUp - this._pointerData[pointer.id].timeDown;

            //  Only release the InputUp signal if the pointer is still over this sprite
            if (this.checkPointerOver(pointer))
            {
                //console.log('releasedHandler: ' + Date.now());
                this.sprite.events.onInputUp.dispatch(this.sprite, pointer);
            }
            else
            {
                //  Pointer outside the sprite? Reset the cursor
                if (this.useHandCursor)
                {
                    this.game.stage.canvas.style.cursor = "default";
                }
            }

            //  Stop drag
            if (this.draggable && this.isDragged && this._draggedPointerID == pointer.id)
            {
                this.stopDrag(pointer);
            }
        }

    },

	/**
    * Updates the Pointer drag on this Sprite.
    * @method Phaser.InputHandler#updateDrag
    * @param {Pointer} pointer
    * @return {boolean}
    */
    updateDrag: function (pointer) {

        if (pointer.isUp)
        {
            this.stopDrag(pointer);
            return false;
        }

        if (this.allowHorizontalDrag)
        {
            this.sprite.x = pointer.x + this._dragPoint.x + this.dragOffset.x;
        }

        if (this.allowVerticalDrag)
        {
            this.sprite.y = pointer.y + this._dragPoint.y + this.dragOffset.y;
        }

        if (this.boundsRect)
        {
            this.checkBoundsRect();
        }

        if (this.boundsSprite)
        {
            this.checkBoundsSprite();
        }

        if (this.snapOnDrag)
        {
            this.sprite.x = Math.round(this.sprite.x / this.snapX) * this.snapX;
            this.sprite.y = Math.round(this.sprite.y / this.snapY) * this.snapY;
        }

        return true;

    },

	/**
    * Returns true if the pointer has entered the Sprite within the specified delay time (defaults to 500ms, half a second)
    * @method Phaser.InputHandler#justOver
    * @param {Pointer} pointer
    * @param {number} delay - The time below which the pointer is considered as just over.
    * @return {boolean}
    */
    justOver: function (pointer, delay) {

    	pointer = pointer || 0;
    	delay = delay || 500;

        return (this._pointerData[pointer].isOver && this.overDuration(pointer) < delay);

    },

	/**
    * Returns true if the pointer has left the Sprite within the specified delay time (defaults to 500ms, half a second)
    * @method Phaser.InputHandler#justOut
    * @param {Pointer} pointer
    * @param {number} delay - The time below which the pointer is considered as just out.
    * @return {boolean}
    */
    justOut: function (pointer, delay) {

    	pointer = pointer || 0;
    	delay = delay || 500;

        return (this._pointerData[pointer].isOut && (this.game.time.now - this._pointerData[pointer].timeOut < delay));

    },

	/**
    * Returns true if the pointer has entered the Sprite within the specified delay time (defaults to 500ms, half a second)
    * @method Phaser.InputHandler#justPressed
    * @param {Pointer} pointer
    * @param {number} delay - The time below which the pointer is considered as just over.
    * @return {boolean}
    */
    justPressed: function (pointer, delay) {

    	pointer = pointer || 0;
    	delay = delay || 500;

        return (this._pointerData[pointer].isDown && this.downDuration(pointer) < delay);

    },

	/**
    * Returns true if the pointer has left the Sprite within the specified delay time (defaults to 500ms, half a second)
    * @method Phaser.InputHandler#justReleased
    * @param {Pointer} pointer
    * @param {number} delay - The time below which the pointer is considered as just out.
    * @return {boolean}
    */
    justReleased: function (pointer, delay) {

    	pointer = pointer || 0;
    	delay = delay || 500;

        return (this._pointerData[pointer].isUp && (this.game.time.now - this._pointerData[pointer].timeUp < delay));

    },

	/**
    * If the pointer is currently over this Sprite this returns how long it has been there for in milliseconds.
    * @method Phaser.InputHandler#overDuration
    * @param {Pointer} pointer
    * @return {number} The number of milliseconds the pointer has been over the Sprite, or -1 if not over.
    */
    overDuration: function (pointer) {

    	pointer = pointer || 0;

        if (this._pointerData[pointer].isOver)
        {
            return this.game.time.now - this._pointerData[pointer].timeOver;
        }

        return -1;

    },

	/**
    * If the pointer is currently over this Sprite this returns how long it has been there for in milliseconds.
    * @method Phaser.InputHandler#downDuration
    * @param {Pointer} pointer
    * @return {number} The number of milliseconds the pointer has been pressed down on the Sprite, or -1 if not over.
    */
    downDuration: function (pointer) {

    	pointer = pointer || 0;

        if (this._pointerData[pointer].isDown)
        {
            return this.game.time.now - this._pointerData[pointer].timeDown;
        }

        return -1;

    },

	/**
    * Make this Sprite draggable by the mouse. You can also optionally set mouseStartDragCallback and mouseStopDragCallback
    * @method Phaser.InputHandler#enableDrag
    * @param	lockCenter			If false the Sprite will drag from where you click it minus the dragOffset. If true it will center itself to the tip of the mouse pointer.
    * @param	bringToTop			If true the Sprite will be bought to the top of the rendering list in its current Group.
    * @param	pixelPerfect		If true it will use a pixel perfect test to see if you clicked the Sprite. False uses the bounding box.
    * @param	alphaThreshold		If using pixel perfect collision this specifies the alpha level from 0 to 255 above which a collision is processed (default 255)
    * @param	boundsRect			If you want to restrict the drag of this sprite to a specific FlxRect, pass the FlxRect here, otherwise it's free to drag anywhere
    * @param	boundsSprite		If you want to restrict the drag of this sprite to within the bounding box of another sprite, pass it here
    */
    enableDrag: function (lockCenter, bringToTop, pixelPerfect, alphaThreshold, boundsRect, boundsSprite) {

        if (typeof lockCenter == 'undefined') { lockCenter = false; }
        if (typeof bringToTop == 'undefined') { bringToTop = false; }
        if (typeof pixelPerfect == 'undefined') { pixelPerfect = false; }

        alphaThreshold = alphaThreshold || 255;
        boundsRect = boundsRect || null;
        boundsSprite = boundsSprite || null;

        this._dragPoint = new Phaser.Point();
        this.draggable = true;
        this.bringToTop = bringToTop;
        this.dragOffset = new Phaser.Point();
        this.dragFromCenter = lockCenter;

        this.pixelPerfect = pixelPerfect;
        this.pixelPerfectAlpha = alphaThreshold;

        if (boundsRect)
        {
            this.boundsRect = boundsRect;
        }

        if (boundsSprite)
        {
            this.boundsSprite = boundsSprite;
        }

    },

	/**
    * Stops this sprite from being able to be dragged. If it is currently the target of an active drag it will be stopped immediately. Also disables any set callbacks.
    * @method Phaser.InputHandler#disableDrag
    */
    disableDrag: function () {

        if (this._pointerData)
        {
            for (var i = 0; i < 10; i++)
            {
                this._pointerData[i].isDragged = false;
            }
        }

        this.draggable = false;
        this.isDragged = false;
        this._draggedPointerID = -1;

    },

	/**
    * Called by Pointer when drag starts on this Sprite. Should not usually be called directly.
    * @method Phaser.InputHandler#startDrag
    */
    startDrag: function (pointer) {

        this.isDragged = true;
        this._draggedPointerID = pointer.id;
        this._pointerData[pointer.id].isDragged = true;

        if (this.dragFromCenter)
        {
            this.sprite.centerOn(pointer.x, pointer.y);
            this._dragPoint.setTo(this.sprite.x - pointer.x, this.sprite.y - pointer.y);
        }
        else
        {
            this._dragPoint.setTo(this.sprite.x - pointer.x, this.sprite.y - pointer.y);
        }

        this.updateDrag(pointer);
        
        if (this.bringToTop)
        {
            this.sprite.bringToTop();
        }

        this.sprite.events.onDragStart.dispatch(this.sprite, pointer);

    },

	/**
    * Called by Pointer when drag is stopped on this Sprite. Should not usually be called directly.
    * @method Phaser.InputHandler#stopDrag
    */
    stopDrag: function (pointer) {

        this.isDragged = false;
        this._draggedPointerID = -1;
        this._pointerData[pointer.id].isDragged = false;
        
        if (this.snapOnRelease)
        {
            this.sprite.x = Math.round(this.sprite.x / this.snapX) * this.snapX;
            this.sprite.y = Math.round(this.sprite.y / this.snapY) * this.snapY;
        }

        this.sprite.events.onDragStop.dispatch(this.sprite, pointer);
        this.sprite.events.onInputUp.dispatch(this.sprite, pointer);

        if (this.checkPointerOver(pointer) == false)
        {
            this._pointerOutHandler(pointer);
        }

    },

	/**
    * Restricts this sprite to drag movement only on the given axis. Note: If both are set to false the sprite will never move!
    * @method Phaser.InputHandler#setDragLock
    * @param	allowHorizontal		To enable the sprite to be dragged horizontally set to true, otherwise false
    * @param	allowVertical		To enable the sprite to be dragged vertically set to true, otherwise false
    */
    setDragLock: function (allowHorizontal, allowVertical) {

        if (typeof allowHorizontal == 'undefined') { allowHorizontal = true; }
    	if (typeof allowVertical == 'undefined') { allowVertical = true; }

        this.allowHorizontalDrag = allowHorizontal;
        this.allowVerticalDrag = allowVertical;

    },

	/**
    * Make this Sprite snap to the given grid either during drag or when it's released.
    * For example 16x16 as the snapX and snapY would make the sprite snap to every 16 pixels.
    * @method Phaser.InputHandler#enableSnap
    * @param	snapX		The width of the grid cell in pixels
    * @param	snapY		The height of the grid cell in pixels
    * @param	onDrag		If true the sprite will snap to the grid while being dragged
    * @param	onRelease	If true the sprite will snap to the grid when released
    */
    enableSnap: function (snapX, snapY, onDrag, onRelease) {

        if (typeof onDrag == 'undefined') { onDrag = true; }
        if (typeof onRelease == 'undefined') { onRelease = false; }

        this.snapX = snapX;
        this.snapY = snapY;
        this.snapOnDrag = onDrag;
        this.snapOnRelease = onRelease;

    },

	/**
    * Stops the sprite from snapping to a grid during drag or release.
    * @method Phaser.InputHandler#disableSnap
    */
    disableSnap: function () {

        this.snapOnDrag = false;
        this.snapOnRelease = false;

    },

	/**
    * Bounds Rect check for the sprite drag
    * @method Phaser.InputHandler#checkBoundsRect
    */
    checkBoundsRect: function () {

        if (this.sprite.x < this.boundsRect.left)
        {
            this.sprite.x = this.boundsRect.x;
        }
        else if ((this.sprite.x + this.sprite.width) > this.boundsRect.right)
        {
            this.sprite.x = this.boundsRect.right - this.sprite.width;
        }

        if (this.sprite.y < this.boundsRect.top)
        {
            this.sprite.y = this.boundsRect.top;
        }
        else if ((this.sprite.y + this.sprite.height) > this.boundsRect.bottom)
        {
            this.sprite.y = this.boundsRect.bottom - this.sprite.height;
        }

    },

	/**
    * Parent Sprite Bounds check for the sprite drag.
    * @method Phaser.InputHandler#checkBoundsSprite
    */
    checkBoundsSprite: function () {

        if (this.sprite.x < this.boundsSprite.x)
        {
            this.sprite.x = this.boundsSprite.x;
        }
        else if ((this.sprite.x + this.sprite.width) > (this.boundsSprite.x + this.boundsSprite.width))
        {
            this.sprite.x = (this.boundsSprite.x + this.boundsSprite.width) - this.sprite.width;
        }

        if (this.sprite.y < this.boundsSprite.y)
        {
            this.sprite.y = this.boundsSprite.y;
        }
        else if ((this.sprite.y + this.sprite.height) > (this.boundsSprite.y + this.boundsSprite.height))
        {
            this.sprite.y = (this.boundsSprite.y + this.boundsSprite.height) - this.sprite.height;
        }

    }

};
/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/


/**
* The Events component is a collection of events fired by the parent game object and its components.
* 
* @class Phaser.Events
* @constructor
*
* @param {Phaser.Sprite} sprite - A reference to Description.
*/
Phaser.Events = function (sprite) {
	
	this.parent = sprite;
	this.onAddedToGroup = new Phaser.Signal;
	this.onRemovedFromGroup = new Phaser.Signal;
	this.onKilled = new Phaser.Signal;
	this.onRevived = new Phaser.Signal;
	this.onOutOfBounds = new Phaser.Signal;

    this.onInputOver = null;
    this.onInputOut = null;
    this.onInputDown = null;
    this.onInputUp = null;
    this.onDragStart = null;
    this.onDragStop = null;

	this.onAnimationStart = null;
	this.onAnimationComplete = null;
	this.onAnimationLoop = null;

};

Phaser.Events.prototype = {

	destroy: function () {

		this.parent = null;
		this.onAddedToGroup.dispose();
		this.onRemovedFromGroup.dispose();
		this.onKilled.dispose();
		this.onRevived.dispose();
		this.onOutOfBounds.dispose();

		if (this.onInputOver)
		{
		    this.onInputOver.dispose();
		    this.onInputOut.dispose();
		    this.onInputDown.dispose();
		    this.onInputUp.dispose();
		    this.onDragStart.dispose();
		    this.onDragStop.dispose();
		}

		if (this.onAnimationStart)
		{
			this.onAnimationStart.dispose();
			this.onAnimationComplete.dispose();
			this.onAnimationLoop.dispose();
		}

	}

};
/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Game Object Factory is a quick way to create all of the different sorts of core objects that Phaser uses.
*
* @class Phaser.GameObjectFactory
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
*/
Phaser.GameObjectFactory = function (game) {

    /**
	* @property {Phaser.Game} game - A reference to the currently running Game.
	*/
	this.game = game;
	
    /**
	* @property {Phaser.World} world - A reference to the game world.
	*/
	this.world = this.game.world;

};

Phaser.GameObjectFactory.prototype = {

    /**
    * Adds an existing object to the game world.
    * @method Phaser.GameObjectFactory#existing
    * @param {*} object - An instance of Phaser.Sprite, Phaser.Button or any other display object..
    * @return {*} The child that was added to the Group.
    */
    existing: function (object) {

        return this.world.add(object);

    },

	/**
    * Create a new Sprite with specific position and sprite sheet key.
    *
    * @method Phaser.GameObjectFactory#sprite
    * @param {number} x - X position of the new sprite.
    * @param {number} y - Y position of the new sprite.
    * @param {string|Phaser.RenderTexture|PIXI.Texture} key - This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture or PIXI.Texture.
    * @param {string|number} [frame] - If the sprite uses an image from a texture atlas or sprite sheet you can pass the frame here. Either a number for a frame ID or a string for a frame name.
    * @returns {Phaser.Sprite} the newly created sprite object.
    */
    sprite: function (x, y, key, frame) {

        return this.world.create(x, y, key, frame);

    },

    /**
    * Create a new Sprite with specific position and sprite sheet key that will automatically be added as a child of the given parent.
    *
    * @method Phaser.GameObjectFactory#child
    * @param {Phaser.Group} group - The Group to add this child to.
    * @param {number} x - X position of the new sprite.
    * @param {number} y - Y position of the new sprite.
    * @param {string|RenderTexture} [key] - The image key as defined in the Game.Cache to use as the texture for this sprite OR a RenderTexture.
    * @param  {string|number} [frame] - If the sprite uses an image from a texture atlas or sprite sheet you can pass the frame here. Either a number for a frame ID or a string for a frame name.
    * @returns {Phaser.Sprite} the newly created sprite object.
    */
    child: function (group, x, y, key, frame) {

        return group.create(x, y, key, frame);

    },

    /**
    * Create a tween object for a specific object. The object can be any JavaScript object or Phaser object such as Sprite.
    *
    * @method Phaser.GameObjectFactory#tween
    * @param {object} obj - Object the tween will be run on.
    * @return {Phaser.Tween} Description.
    */
    tween: function (obj) {

        return this.game.tweens.create(obj);

    },

    /**
    * A Group is a container for display objects that allows for fast pooling, recycling and collision checks.
    *
    * @method Phaser.GameObjectFactory#group
    * @param {*} parent - The parent Group or DisplayObjectContainer that will hold this group, if any.
    * @param {string} [name=group] - A name for this Group. Not used internally but useful for debugging.
    * @return {Phaser.Group} The newly created group.
    */
    group: function (parent, name) {

        return new Phaser.Group(this.game, parent, name);

    },

    /**
     * Creates a new instance of the Sound class.
     *
    * @method Phaser.GameObjectFactory#audio
     * @param {string} key - The Game.cache key of the sound that this object will use.
     * @param {number} volume - The volume at which the sound will be played.
     * @param {boolean} loop - Whether or not the sound will loop.
     * @return {Phaser.Sound} The newly created text object.
     */
    audio: function (key, volume, loop) {

        return this.game.sound.add(key, volume, loop);
        
    },

    /**
     * Creates a new <code>TileSprite</code>.
     *
    * @method Phaser.GameObjectFactory#tileSprite
     * @param {number} x - X position of the new tileSprite.
     * @param {number} y - Y position of the new tileSprite.
     * @param {number} width - the width of the tilesprite.
     * @param {number} height - the height of the tilesprite.
     * @param {string|Phaser.RenderTexture|PIXI.Texture} key - This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture or PIXI.Texture.
     * @param {string|number} frame - If this Sprite is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
     * @return {Phaser.TileSprite} The newly created tileSprite object.
     */
    tileSprite: function (x, y, width, height, key, frame) {

        return this.world.add(new Phaser.TileSprite(this.game, x, y, width, height, key, frame));

    },

    /**
     * Creates a new <code>Text</code>.
     *
    * @method Phaser.GameObjectFactory#text
     * @param {number} x - X position of the new text object.
     * @param {number} y - Y position of the new text object.
     * @param {string} text - The actual text that will be written.
     * @param {object} style - The style object containing style attributes like font, font size , etc.
     * @return {Phaser.Text} The newly created text object.
     */
    text: function (x, y, text, style) {

        return this.world.add(new Phaser.Text(this.game, x, y, text, style));

    },

    /**
    * Creates a new <code>Button</code> object.
    *
    * @method Phaser.GameObjectFactory#button
    * @param {number} [x] X position of the new button object.
    * @param {number} [y] Y position of the new button object.
    * @param {string} [key] The image key as defined in the Game.Cache to use as the texture for this button.
    * @param {function} [callback] The function to call when this button is pressed
    * @param {object} [callbackContext] The context in which the callback will be called (usually 'this')
    * @param {string|number} [overFrame] This is the frame or frameName that will be set when this button is in an over state. Give either a number to use a frame ID or a string for a frame name.
    * @param {string|number} [outFrame] This is the frame or frameName that will be set when this button is in an out state. Give either a number to use a frame ID or a string for a frame name.
    * @param {string|number} [downFrame] This is the frame or frameName that will be set when this button is in a down state. Give either a number to use a frame ID or a string for a frame name.
    * @return {Phaser.Button} The newly created button object.
    */
    button: function (x, y, key, callback, callbackContext, overFrame, outFrame, downFrame) {

        return this.world.add(new Phaser.Button(this.game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame));

    },

    /**
     * Creates a new <code>Graphics</code> object.
     *
    * @method Phaser.GameObjectFactory#graphics
     * @param {number} x - X position of the new graphics object.
     * @param {number} y - Y position of the new graphics object.
     * @return {Phaser.Graphics} The newly created graphics object.
     */
    graphics: function (x, y) {

        return this.world.add(new Phaser.Graphics(this.game, x, y));

    },

    /**
    * Emitter is a lightweight particle emitter. It can be used for one-time explosions or for
    * continuous effects like rain and fire. All it really does is launch Particle objects out
    * at set intervals, and fixes their positions and velocities accorindgly.
    *
    * @method Phaser.GameObjectFactory#emitter
    * @param {number} [x=0] - The x coordinate within the Emitter that the particles are emitted from.
    * @param {number} [y=0] - The y coordinate within the Emitter that the particles are emitted from.
    * @param {number} [maxParticles=50] - The total number of particles in this emitter.
    * @return {Phaser.Emitter} The newly created emitter object.
    */
    emitter: function (x, y, maxParticles) {

        return this.game.particles.add(new Phaser.Particles.Arcade.Emitter(this.game, x, y, maxParticles));

    },

    /**
    * * Create a new <code>BitmapText</code>.
    *
    * @method Phaser.GameObjectFactory#bitmapText
    * @param {number} x - X position of the new bitmapText object.
    * @param {number} y - Y position of the new bitmapText object.
    * @param {string} text - The actual text that will be written.
    * @param {object} style - The style object containing style attributes like font, font size , etc.
    * @return {Phaser.BitmapText} The newly created bitmapText object.
    */
    bitmapText: function (x, y, text, style) {

        return this.world.add(new Phaser.BitmapText(this.game, x, y, text, style));

    },

    /**
    * Creates a new Tilemap object.
    *
    * @method Phaser.GameObjectFactory#tilemap
    * @param {string} key - Asset key for the JSON file.
    * @return {Phaser.Tilemap} The newly created tilemap object.
    */
    tilemap: function (key) {

        return new Phaser.Tilemap(this.game, key);

    },

    /**
    * Creates a new Tileset object.
    *
    * @method Phaser.GameObjectFactory#tileset
    * @param {string} key - The image key as defined in the Game.Cache to use as the tileset.
    * @return {Phaser.Tileset} The newly created tileset object.
    */
    tileset: function (key) {

        return this.game.cache.getTileset(key);

    },

    /**
    * Creates a new Tilemap Layer object.
    *
    * @method Phaser.GameObjectFactory#tilemapLayer
    * @param {number} x - X position of the new tilemapLayer.
    * @param {number} y - Y position of the new tilemapLayer.
    * @param {number} width - the width of the tilemapLayer.
    * @param {number} height - the height of the tilemapLayer.
    * @return {Phaser.TilemapLayer} The newly created tilemaplayer object.
    */
    tilemapLayer: function (x, y, width, height, tileset, tilemap, layer) {

        return this.world.add(new Phaser.TilemapLayer(this.game, x, y, width, height, tileset, tilemap, layer));

    },

    /**
    * A dynamic initially blank canvas to which images can be drawn.
    *
    * @method Phaser.GameObjectFactory#renderTexture
    * @param {string} key - Asset key for the render texture.
    * @param {number} width - the width of the render texture.
    * @param {number} height - the height of the render texture.
    * @return {Phaser.RenderTexture} The newly created renderTexture object.
    */
    renderTexture: function (key, width, height) {

        var texture = new Phaser.RenderTexture(this.game, key, width, height);

        this.game.cache.addRenderTexture(key, texture);

        return texture;

    }

};
/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Create a new `Sprite` object. Sprites are the lifeblood of your game, used for nearly everything visual.
* At its most basic a Sprite consists of a set of coordinates and a texture that is rendered to the canvas.
* They also contain additional properties allowing for physics motion (via Sprite.body), input handling (via Sprite.input),
* events (via Sprite.events), animation (via Sprite.animations), camera culling and more. Please see the Examples for use cases.
*
* @class Phaser.Sprite
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {number} x - The x coordinate (in world space) to position the Sprite at.
* @param {number} y - The y coordinate (in world space) to position the Sprite at.
* @param {string|Phaser.RenderTexture|PIXI.Texture} key - This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture or PIXI.Texture.
* @param {string|number} frame - If this Sprite is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
*/
Phaser.Sprite = function (game, x, y, key, frame) {

    x = x || 0;
    y = y || 0;
    key = key || null;
    frame = frame || null;
    
    /**
	* @property {Phaser.Game} game - A reference to the currently running Game.
	*/
	this.game = game;
 
	/**
	* @property {boolean} exists - If exists = false then the Sprite isn't updated by the core game loop or physics subsystem at all.
	* @default
	*/
    this.exists = true;

	/**
    * @property {boolean} alive - This is a handy little var your game can use to determine if a sprite is alive or not, it doesn't effect rendering.
   	* @default
   	*/
    this.alive = true;

	/**
    * @property {Phaser.Group} group - The parent Group of this Sprite. This is usually set after Sprite instantiation by the parent.
   	*/
    this.group = null;

    /**
     * @property {string} name - The user defined name given to this Sprite.
     * @default
     */
    this.name = '';

    /**
	* @property {number} type - The const type of this object.
    * @default
	*/
    this.type = Phaser.SPRITE;

    /**
	* @property {number} renderOrderID - Used by the Renderer and Input Manager to control picking order.
	* @default
	*/
    this.renderOrderID = -1;

    /**
    * If you would like the Sprite to have a lifespan once 'born' you can set this to a positive value. Handy for particles, bullets, etc.
	* The lifespan is decremented by game.time.elapsed each update, once it reaches zero the kill() function is called.
	* @property {number} lifespan - The lifespan of the Sprite (in ms) before it will be killed.
	* @default
	*/    
    this.lifespan = 0;

    /**
    * @property {Events} events - The Events you can subscribe to that are dispatched when certain things happen on this Sprite or its components.
    */
    this.events = new Phaser.Events(this);

    /**
    * @property {Phaser.AnimationManager} animations - This manages animations of the sprite. You can modify animations through it (see Phaser.AnimationManager)
    */
    this.animations = new Phaser.AnimationManager(this);

    /**
    * @property {InputHandler} input - The Input Handler Component.
    */
    this.input = new Phaser.InputHandler(this);

    /**
    *  @property {string|Phaser.RenderTexture|PIXI.Texture} key - This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture or PIXI.Texture.
    */
    this.key = key;

    /**
    *  @property {Phaser.Frame} currentFrame - A reference to the currently displayed frame.
    */
    this.currentFrame = null;

    if (key instanceof Phaser.RenderTexture)
    {
        PIXI.Sprite.call(this, key);

        this.currentFrame = this.game.cache.getTextureFrame(key.name);
    }
    else if (key instanceof PIXI.Texture)
    {
        PIXI.Sprite.call(this, key);

        this.currentFrame = frame;
    }
    else
    {
        if (key == null || this.game.cache.checkImageKey(key) == false)
        {
            key = '__default';
            this.key = key;
        }

        PIXI.Sprite.call(this, PIXI.TextureCache[key]);

        if (this.game.cache.isSpriteSheet(key))
        {
            this.animations.loadFrameData(this.game.cache.getFrameData(key));

            if (frame !== null)
            {
                if (typeof frame === 'string')
                {
                    this.frameName = frame;
                }
                else
                {
                    this.frame = frame;
                }
            }
        }
        else
        {
            this.currentFrame = this.game.cache.getFrame(key);
        }
    }

    /**
    * The rectangular area from the texture that will be rendered.
    * @property {Phaser.Rectangle} textureRegion
    */
    this.textureRegion = new Phaser.Rectangle(this.texture.frame.x, this.texture.frame.y, this.texture.frame.width, this.texture.frame.height);

    /**
    * The anchor sets the origin point of the texture.
    * The default is 0,0 this means the textures origin is the top left 
    * Setting than anchor to 0.5,0.5 means the textures origin is centered
    * Setting the anchor to 1,1 would mean the textures origin points will be the bottom right
    *
    * @property {Phaser.Point} anchor - The anchor around with Sprite rotation and scaling takes place.
    */
    this.anchor = new Phaser.Point();

    /**
    * @property {number} x - The x coordinate (in world space) of this Sprite.
    */
    this.x = x;
    
    /**
    * @property {number} y - The y coordinate (in world space) of this Sprite.
    */
    this.y = y;

	this.position.x = x;
	this.position.y = y;

    /**
    * @property {Phaser.Point} world - The world coordinates of this Sprite. This differs from the x/y coordinates which are relative to the Sprites container.
    */
    this.world = new Phaser.Point(x, y);

    /**
    * Should this Sprite be automatically culled if out of range of the camera?
    * A culled sprite has its renderable property set to 'false'.
    *
    * @property {boolean} autoCull - A flag indicating if the Sprite should be automatically camera culled or not.
    * @default
    */
    this.autoCull = false;

    /**
    * @property {Phaser.Point} scale - The scale of the Sprite when rendered. By default it's set to 1 (no scale). You can modify it via scale.x or scale.y or scale.setTo(x, y). A value of 1 means no change to the scale, 0.5 means "half the size", 2 means "twice the size", etc.
    */ 
    this.scale = new Phaser.Point(1, 1);

    /**
    * @property {Phaser.Point} _cache - A mini cache for storing all of the calculated values.
    * @private
    */
    this._cache = { 

        dirty: false,

        //  Transform cache
        a00: -1, a01: -1, a02: -1, a10: -1, a11: -1, a12: -1, id: -1, 

        //  Input specific transform cache
        i01: -1, i10: -1, idi: -1,

        //  Bounds check
        left: null, right: null, top: null, bottom: null, 

        //  delta cache
        prevX: x, prevY: y,

        //  The previous calculated position
        x: -1, y: -1,

        //  The actual scale values based on the worldTransform
        scaleX: 1, scaleY: 1,

        //  The width/height of the image, based on the un-modified frame size multiplied by the final calculated scale size
        width: this.currentFrame.sourceSizeW, height: this.currentFrame.sourceSizeH,

        //  The actual width/height of the image if from a trimmed atlas, multiplied by the final calculated scale size
        halfWidth: Math.floor(this.currentFrame.sourceSizeW / 2), halfHeight: Math.floor(this.currentFrame.sourceSizeH / 2),

        //  The width/height of the image, based on the un-modified frame size multiplied by the final calculated scale size
        calcWidth: -1, calcHeight: -1,

        //  The current frame details
        // frameID: this.currentFrame.uuid, frameWidth: this.currentFrame.width, frameHeight: this.currentFrame.height,
        frameID: -1, frameWidth: this.currentFrame.width, frameHeight: this.currentFrame.height,

        //  If this sprite visible to the camera (regardless of being set to visible or not)
        cameraVisible: true,

        //  Crop cache
        cropX: 0, cropY: 0, cropWidth: this.currentFrame.sourceSizeW, cropHeight: this.currentFrame.sourceSizeH

    };
  
    /**
    * @property {Phaser.Point} offset - Corner point defaults. Should not typically be modified.
    */    
    this.offset = new Phaser.Point;
    
    /**
    * @property {Phaser.Point} center - A Point containing the center coordinate of the Sprite. Takes rotation and scale into account.
    */
    this.center = new Phaser.Point(x + Math.floor(this._cache.width / 2), y + Math.floor(this._cache.height / 2));
   
    /**
    * @property {Phaser.Point} topLeft - A Point containing the top left coordinate of the Sprite. Takes rotation and scale into account.
    */
    this.topLeft = new Phaser.Point(x, y);
    
    /**
    * @property {Phaser.Point} topRight - A Point containing the top right coordinate of the Sprite. Takes rotation and scale into account.
    */
    this.topRight = new Phaser.Point(x + this._cache.width, y);
    
    /**
    * @property {Phaser.Point} bottomRight - A Point containing the bottom right coordinate of the Sprite. Takes rotation and scale into account.
    */
    this.bottomRight = new Phaser.Point(x + this._cache.width, y + this._cache.height);
    
    /**
    * @property {Phaser.Point} bottomLeft - A Point containing the bottom left coordinate of the Sprite. Takes rotation and scale into account.
    */
    this.bottomLeft = new Phaser.Point(x, y + this._cache.height);
    
    /**
    * This Rectangle object fully encompasses the Sprite and is updated in real-time.
    * The bounds is the full bounding area after rotation and scale have been taken into account. It should not be modified directly.
    * It's used for Camera culling and physics body alignment.
    * @property {Phaser.Rectangle} bounds
    */
    this.bounds = new Phaser.Rectangle(x, y, this._cache.width, this._cache.height);
    
    /**
    * @property {Phaser.Physics.Arcade.Body} body - By default Sprites have a Phaser.Physics Body attached to them. You can operate physics actions via this property, or null it to skip all physics updates.
    */
    this.body = new Phaser.Physics.Arcade.Body(this);

    /**
    * @property {number} health - Health value. Used in combination with damage() to allow for quick killing of Sprites.
    */    
    this.health = 1;

    /**
    * @property {boolean} inWorld - This value is set to true if the Sprite is positioned within the World, otherwise false.
    */
    this.inWorld = Phaser.Rectangle.intersects(this.bounds, this.game.world.bounds);
    
    /**
    * @property {number} inWorldThreshold - A threshold value applied to the inWorld check. If you don't want a Sprite to be considered "out of the world" until at least 100px away for example then set it to 100.
    * @default
    */
    this.inWorldThreshold = 0;

    /**
    * @property {boolean} outOfBoundsKill - If true the Sprite is killed as soon as Sprite.inWorld is false.
    * @default
    */
    this.outOfBoundsKill = false;
    
    /**
    * @property {boolean} _outOfBoundsFired - Internal flag.
    * @private
    * @default
    */
    this._outOfBoundsFired = false;

    /**
    * A Sprite that is fixed to the camera ignores the position of any ancestors in the display list and uses its x/y coordinates as offsets from the top left of the camera.
    * @property {boolean} fixedToCamera - Fixes this Sprite to the Camera.
    * @default
    */
    this.fixedToCamera = false;

    /**
    * @property {Phaser.Point} cameraOffset - If this Sprite is fixed to the camera then use this Point to specify how far away from the Camera x/y it's rendered.
    */
    this.cameraOffset = new Phaser.Point;

    /**
    * You can crop the Sprites texture by modifying the crop properties. For example crop.width = 50 would set the Sprite to only render 50px wide.
    * The crop is only applied if you have set Sprite.cropEnabled to true.
    * @property {Phaser.Rectangle} crop - The crop Rectangle applied to the Sprite texture before rendering.
    * @default
    */
    this.crop = new Phaser.Rectangle(0, 0, this._cache.width, this._cache.height);

    /**
    * @property {boolean} cropEnabled - If true the Sprite.crop property is used to crop the texture before render. Set to false to disable.
    * @default
    */
    this.cropEnabled = false;

    this.updateCache();
    this.updateBounds();

};

//  Needed to keep the PIXI.Sprite constructor in the prototype chain (as the core pixi renderer uses an instanceof check sadly)
Phaser.Sprite.prototype = Object.create(PIXI.Sprite.prototype);
Phaser.Sprite.prototype.constructor = Phaser.Sprite;

/**
* Automatically called by World.preUpdate. Handles cache updates, lifespan checks, animation updates and physics updates.
*
* @method Phaser.Sprite#preUpdate
* @memberof Phaser.Sprite
*/
Phaser.Sprite.prototype.preUpdate = function() {

    if (!this.exists)
    {
        this.renderOrderID = -1;
        return;
    }

    if (this.lifespan > 0)
    {
        this.lifespan -= this.game.time.elapsed;

        if (this.lifespan <= 0)
        {
            this.kill();
            return;
        }
    }

    this._cache.dirty = false;

    if (this.visible)
    {
        this.renderOrderID = this.game.world.currentRenderOrderID++;
    }

    this.updateCache();

    this.updateAnimation();

    this.updateCrop();

    //  Re-run the camera visibility check
    if (this._cache.dirty || this.world.x !== this._cache.prevX || this.world.y !== this._cache.prevY)
    {
        this.updateBounds();
    }

    if (this.body)
    {
        this.body.preUpdate();
    }

};

/**
* Internal function called by preUpdate.
*
* @method Phaser.Sprite#updateCache
* @memberof Phaser.Sprite
*/
Phaser.Sprite.prototype.updateCache = function() {

    this._cache.prevX = this.world.x;
    this._cache.prevY = this.world.y;

    if (this.fixedToCamera)
    {
        this.x = this.game.camera.view.x + this.cameraOffset.x;
        this.y = this.game.camera.view.y + this.cameraOffset.y;
    }

    this.world.setTo(this.game.camera.x + this.worldTransform[2], this.game.camera.y + this.worldTransform[5]);

    if (this.worldTransform[1] != this._cache.i01 || this.worldTransform[3] != this._cache.i10 || this.worldTransform[0] != this._cache.a00 || this.worldTransform[41] != this._cache.a11)
    {
        this._cache.a00 = this.worldTransform[0];  //  scaleX         a     |a c tx|
        this._cache.a01 = this.worldTransform[1];  //  skewY          c     |b d ty|
        this._cache.a10 = this.worldTransform[3];  //  skewX          b     |0 0  1|
        this._cache.a11 = this.worldTransform[4];  //  scaleY         d

        this._cache.i01 = this.worldTransform[1];  //  skewY          c (remains non-modified for input checks)
        this._cache.i10 = this.worldTransform[3];  //  skewX          b (remains non-modified for input checks)

        this._cache.scaleX = Math.sqrt((this._cache.a00 * this._cache.a00) + (this._cache.a01 * this._cache.a01)); // round this off a bit?
        this._cache.scaleY = Math.sqrt((this._cache.a10 * this._cache.a10) + (this._cache.a11 * this._cache.a11)); // round this off a bit?

        this._cache.a01 *= -1;
        this._cache.a10 *= -1;

        this._cache.id = 1 / (this._cache.a00 * this._cache.a11 + this._cache.a01 * -this._cache.a10);
        this._cache.idi = 1 / (this._cache.a00 * this._cache.a11 + this._cache.i01 * -this._cache.i10);

        this._cache.dirty = true;
    }

    this._cache.a02 = this.worldTransform[2];  //  translateX     tx
    this._cache.a12 = this.worldTransform[5];  //  translateY     ty

};

/**
* Internal function called by preUpdate.
*
* @method Phaser.Sprite#updateAnimation
* @memberof Phaser.Sprite
*/
Phaser.Sprite.prototype.updateAnimation = function() {

    if (this.animations.update() || (this.currentFrame && this.currentFrame.uuid != this._cache.frameID))
    {
        this._cache.frameID = this.currentFrame.uuid;

        this._cache.frameWidth = this.texture.frame.width;
        this._cache.frameHeight = this.texture.frame.height;

        this._cache.width = this.currentFrame.width;
        this._cache.height = this.currentFrame.height;

        this._cache.halfWidth = Math.floor(this._cache.width / 2);
        this._cache.halfHeight = Math.floor(this._cache.height / 2);

        this._cache.dirty = true;

    }

};

/**
* Internal function called by preUpdate.
*
* @method Phaser.Sprite#updateCrop
* @memberof Phaser.Sprite
*/
Phaser.Sprite.prototype.updateCrop = function() {

    //  This only runs if crop is enabled
    if (this.cropEnabled && (this.crop.width != this._cache.cropWidth || this.crop.height != this._cache.cropHeight || this.crop.x != this._cache.cropX || this.crop.y != this._cache.cropY))
    {
        this.crop.floorAll();

        this._cache.cropX = this.crop.x;
        this._cache.cropY = this.crop.y;
        this._cache.cropWidth = this.crop.width;
        this._cache.cropHeight = this.crop.height;

        this.texture.frame = this.crop;
        this.texture.width = this.crop.width;
        this.texture.height = this.crop.height;

        this.texture.updateFrame = true;

        PIXI.Texture.frameUpdates.push(this.texture);
    }

};

/**
* Internal function called by preUpdate.
*
* @method Phaser.Sprite#updateBounds
* @memberof Phaser.Sprite
*/
Phaser.Sprite.prototype.updateBounds = function() {

    this.offset.setTo(this._cache.a02 - (this.anchor.x * this.width), this._cache.a12 - (this.anchor.y * this.height));

    this.getLocalPosition(this.center, this.offset.x + (this.width / 2), this.offset.y + (this.height / 2));
    this.getLocalPosition(this.topLeft, this.offset.x, this.offset.y);
    this.getLocalPosition(this.topRight, this.offset.x + this.width, this.offset.y);
    this.getLocalPosition(this.bottomLeft, this.offset.x, this.offset.y + this.height);
    this.getLocalPosition(this.bottomRight, this.offset.x + this.width, this.offset.y + this.height);

    this._cache.left = Phaser.Math.min(this.topLeft.x, this.topRight.x, this.bottomLeft.x, this.bottomRight.x);
    this._cache.right = Phaser.Math.max(this.topLeft.x, this.topRight.x, this.bottomLeft.x, this.bottomRight.x);
    this._cache.top = Phaser.Math.min(this.topLeft.y, this.topRight.y, this.bottomLeft.y, this.bottomRight.y);
    this._cache.bottom = Phaser.Math.max(this.topLeft.y, this.topRight.y, this.bottomLeft.y, this.bottomRight.y);

    this.bounds.setTo(this._cache.left, this._cache.top, this._cache.right - this._cache.left, this._cache.bottom - this._cache.top);

    this.updateFrame = true;

    if (this.inWorld == false)
    {
        //  Sprite WAS out of the screen, is it still?
        this.inWorld = Phaser.Rectangle.intersects(this.bounds, this.game.world.bounds, this.inWorldThreshold);

        if (this.inWorld)
        {
            //  It's back again, reset the OOB check
            this._outOfBoundsFired = false;
        }
    }
    else
    {
        //   Sprite WAS in the screen, has it now left?
        this.inWorld = Phaser.Rectangle.intersects(this.bounds, this.game.world.bounds, this.inWorldThreshold);

        if (this.inWorld == false)
        {
            this.events.onOutOfBounds.dispatch(this);
            this._outOfBoundsFired = true;

            if (this.outOfBoundsKill)
            {
                this.kill();
            }
        }
    }

    this._cache.cameraVisible = Phaser.Rectangle.intersects(this.game.world.camera.screenView, this.bounds, 0);

    if (this.autoCull)
    {
        //  Won't get rendered but will still get its transform updated
        this.renderable = this._cache.cameraVisible;
    }

    //  Update our physics bounds
    if (this.body)
    {
        this.body.updateBounds(this.center.x, this.center.y, this._cache.scaleX, this._cache.scaleY);
    }

};

/**
* Gets the local position of a coordinate relative to the Sprite, factoring in rotation and scale.
* Mostly only used internally.
* 
* @method Phaser.Sprite#getLocalPosition
* @memberof Phaser.Sprite
* @param {Phaser.Point} p - The Point object to store the results in.
* @param {number} x - x coordinate within the Sprite to translate.
* @param {number} y - x coordinate within the Sprite to translate.
* @param {number} sx - Scale factor to be applied.
* @param {number} sy - Scale factor to be applied.
* @return {Phaser.Point} The translated point.
*/
Phaser.Sprite.prototype.getLocalPosition = function(p, x, y) {

    p.x = ((this._cache.a11 * this._cache.id * x + -this._cache.a01 * this._cache.id * y + (this._cache.a12 * this._cache.a01 - this._cache.a02 * this._cache.a11) * this._cache.id) * this.scale.x) + this._cache.a02;
    p.y = ((this._cache.a00 * this._cache.id * y + -this._cache.a10 * this._cache.id * x + (-this._cache.a12 * this._cache.a00 + this._cache.a02 * this._cache.a10) * this._cache.id) * this.scale.y) + this._cache.a12;

    return p;

};

/**
* Gets the local unmodified position of a coordinate relative to the Sprite, factoring in rotation and scale.
* Mostly only used internally by the Input Manager, but also useful for custom hit detection.
* 
* @method Phaser.Sprite#getLocalUnmodifiedPosition
* @memberof Phaser.Sprite
* @param {Phaser.Point} p - The Point object to store the results in.
* @param {number} x - x coordinate within the Sprite to translate.
* @param {number} y - x coordinate within the Sprite to translate.
* @return {Phaser.Point} The translated point.
*/
Phaser.Sprite.prototype.getLocalUnmodifiedPosition = function(p, gx, gy) {

    p.x = (this._cache.a11 * this._cache.idi * gx + -this._cache.i01 * this._cache.idi * gy + (this._cache.a12 * this._cache.i01 - this._cache.a02 * this._cache.a11) * this._cache.idi) + (this.anchor.x * this._cache.width);
    p.y = (this._cache.a00 * this._cache.idi * gy + -this._cache.i10 * this._cache.idi * gx + (-this._cache.a12 * this._cache.a00 + this._cache.a02 * this._cache.i10) * this._cache.idi) + (this.anchor.y * this._cache.height);

    return p;

};

/**
* Resets the Sprite.crop value back to the frame dimensions.
*
* @method Phaser.Sprite#resetCrop
* @memberof Phaser.Sprite
*/
Phaser.Sprite.prototype.resetCrop = function() {

    this.crop = new Phaser.Rectangle(0, 0, this._cache.width, this._cache.height);
    this.texture.setFrame(this.crop);
    this.cropEnabled = false;

};

/**
* Internal function called by the World postUpdate cycle.
*
* @method Phaser.Sprite#postUpdate
* @memberof Phaser.Sprite
*/
Phaser.Sprite.prototype.postUpdate = function() {

    if (this.exists)
    {
        //  The sprite is positioned in this call, after taking into consideration motion updates and collision
        if (this.body)
        {
            this.body.postUpdate();
        }

        if (this.fixedToCamera)
        {
            this._cache.x = this.game.camera.view.x + this.cameraOffset.x;
            this._cache.y = this.game.camera.view.y + this.cameraOffset.y;
        }
        else
        {
            this._cache.x = this.x;
            this._cache.y = this.y;
        }

        this.world.setTo(this.game.camera.x + this.worldTransform[2], this.game.camera.y + this.worldTransform[5]);

        this.position.x = this._cache.x;
        this.position.y = this._cache.y;
    }

};

/**
* Changes the Texture the Sprite is using entirely. The old texture is removed and the new one is referenced or fetched from the Cache.
* This causes a WebGL texture update, so use sparingly or in low-intensity portions of your game.
*
* @method Phaser.Sprite#loadTexture
* @memberof Phaser.Sprite
* @param {string|Phaser.RenderTexture|PIXI.Texture} key - This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture or PIXI.Texture.
* @param {string|number} frame - If this Sprite is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
*/
Phaser.Sprite.prototype.loadTexture = function (key, frame) {

    this.key = key;

    if (key instanceof Phaser.RenderTexture)
    {
        this.currentFrame = this.game.cache.getTextureFrame(key.name);
    }
    else if (key instanceof PIXI.Texture)
    {
        this.currentFrame = frame;
    }
    else
    {
        if (typeof key === 'undefined' || this.game.cache.checkImageKey(key) === false)
        {
            key = '__default';
            this.key = key;
        }

        if (this.game.cache.isSpriteSheet(key))
        {
            this.animations.loadFrameData(this.game.cache.getFrameData(key));

            if (typeof frame !== 'undefined')
            {
                if (typeof frame === 'string')
                {
                    this.frameName = frame;
                }
                else
                {
                    this.frame = frame;
                }
            }
        }
        else
        {
            this.currentFrame = this.game.cache.getFrame(key);
            this.setTexture(PIXI.TextureCache[key]);
        }
    }

};

/**
* Moves the sprite so its center is located on the given x and y coordinates.
* Doesn't change the anchor point of the sprite.
* 
* @method Phaser.Sprite#centerOn
* @memberof Phaser.Sprite
* @param {number} x - The x coordinate (in world space) to position the Sprite at.
* @param {number} y - The y coordinate (in world space) to position the Sprite at.
* @return (Phaser.Sprite) This instance.
*/
Phaser.Sprite.prototype.centerOn = function(x, y) {

    this.x = x + (this.x - this.center.x);
    this.y = y + (this.y - this.center.y);
    return this;

};

/**
* Brings a 'dead' Sprite back to life, optionally giving it the health value specified.
* A resurrected Sprite has its alive, exists and visible properties all set to true.
* It will dispatch the onRevived event, you can listen to Sprite.events.onRevived for the signal.
* 
* @method Phaser.Sprite#revive
* @memberof Phaser.Sprite
* @param {number} [health=1] - The health to give the Sprite.
* @return (Phaser.Sprite) This instance.
*/
Phaser.Sprite.prototype.revive = function(health) {

    if (typeof health === 'undefined') { health = 1; }

    this.alive = true;
    this.exists = true;
    this.visible = true;
    this.health = health;

    if (this.events)
    {
        this.events.onRevived.dispatch(this);
    }

    return this;

};

/**
* Kills a Sprite. A killed Sprite has its alive, exists and visible properties all set to false.
* It will dispatch the onKilled event, you can listen to Sprite.events.onKilled for the signal.
* Note that killing a Sprite is a way for you to quickly recycle it in a Sprite pool, it doesn't free it up from memory.
* If you don't need this Sprite any more you should call Sprite.destroy instead.
* 
* @method Phaser.Sprite#kill
* @memberof Phaser.Sprite
* @return (Phaser.Sprite) This instance.
*/
Phaser.Sprite.prototype.kill = function() {

    this.alive = false;
    this.exists = false;
    this.visible = false;

    if (this.events)
    {
        this.events.onKilled.dispatch(this);
    }

    return this;

};

/**
* Destroys the Sprite. This removes it from its parent group, destroys the input, event and animation handlers if present
* and nulls its reference to game, freeing it up for garbage collection.
* 
* @method Phaser.Sprite#destroy
* @memberof Phaser.Sprite
*/
Phaser.Sprite.prototype.destroy = function() {

    if (this.group)
    {
        this.group.remove(this);
    }

    if (this.input)
    {
        this.input.destroy();
    }

    if (this.events)
    {
        this.events.destroy();
    }

    if (this.animations)
    {
        this.animations.destroy();
    }

    this.alive = false;
    this.exists = false;
    this.visible = false;

    this.game = null;

};

/**
* Damages the Sprite, this removes the given amount from the Sprites health property.
* If health is then taken below zero Sprite.kill is called.
* 
* @method Phaser.Sprite#damage
* @memberof Phaser.Sprite
* @param {number} amount - The amount to subtract from the Sprite.health value.
* @return (Phaser.Sprite) This instance.
*/
Phaser.Sprite.prototype.damage = function(amount) {

    if (this.alive)
    {
        this.health -= amount;

        if (this.health < 0)
        {
            this.kill();
        }
    }

    return this;

};

/**
* Resets the Sprite. This places the Sprite at the given x/y world coordinates and then
* sets alive, exists, visible and renderable all to true. Also resets the outOfBounds state and health values.
* If the Sprite has a physics body that too is reset.
* 
* @method Phaser.Sprite#reset
* @memberof Phaser.Sprite
* @param {number} x - The x coordinate (in world space) to position the Sprite at.
* @param {number} y - The y coordinate (in world space) to position the Sprite at.
* @param {number} [health=1] - The health to give the Sprite.
* @return (Phaser.Sprite) This instance.
*/
Phaser.Sprite.prototype.reset = function(x, y, health) {

    if (typeof health === 'undefined') { health = 1; }

    this.x = x;
    this.y = y;
    this.position.x = this.x;
    this.position.y = this.y;
    this.alive = true;
    this.exists = true;
    this.visible = true;
    this.renderable = true;
    this._outOfBoundsFired = false;

    this.health = health;

    if (this.body)
    {
        this.body.reset();
    }

    return this;
    
};

/**
* Brings the Sprite to the top of the display list it is a child of. Sprites that are members of a Phaser.Group are only
* bought to the top of that Group, not the entire display list.
* 
* @method Phaser.Sprite#bringToTop
* @memberof Phaser.Sprite
* @return (Phaser.Sprite) This instance.
*/
Phaser.Sprite.prototype.bringToTop = function() {

    if (this.group)
    {
        this.group.bringToTop(this);
    }
    else
    {
        this.game.world.bringToTop(this);
    }

    return this;

};

/**
* Play an animation based on the given key. The animation should previously have been added via sprite.animations.add()
* If the requested animation is already playing this request will be ignored. If you need to reset an already running animation do so directly on the Animation object itself.
* 
* @method Phaser.Sprite#play
* @memberof Phaser.Sprite
* @param {string} name - The name of the animation to be played, e.g. "fire", "walk", "jump".
* @param {number} [frameRate=null] - The framerate to play the animation at. The speed is given in frames per second. If not provided the previously set frameRate of the Animation is used.
* @param {boolean} [loop=false] - Should the animation be looped after playback. If not provided the previously set loop value of the Animation is used.
* @param {boolean} [killOnComplete=false] - If set to true when the animation completes (only happens if loop=false) the parent Sprite will be killed.
* @return {Phaser.Animation} A reference to playing Animation instance.
*/
Phaser.Sprite.prototype.play = function (name, frameRate, loop, killOnComplete) {

    if (this.animations)
    {
        return this.animations.play(name, frameRate, loop, killOnComplete);
    }

};

/**
* Indicates the rotation of the Sprite, in degrees, from its original orientation. Values from 0 to 180 represent clockwise rotation; values from 0 to -180 represent counterclockwise rotation.
* Values outside this range are added to or subtracted from 360 to obtain a value within the range. For example, the statement player.angle = 450 is the same as player.angle = 90.
* If you wish to work in radians instead of degrees use the property Sprite.rotation instead.
* @name Phaser.Sprite#angle
* @property {number} angle - Gets or sets the Sprites angle of rotation in degrees.
*/
Object.defineProperty(Phaser.Sprite.prototype, 'angle', {

    get: function() {
        return Phaser.Math.wrapAngle(Phaser.Math.radToDeg(this.rotation));
    },

    set: function(value) {
        this.rotation = Phaser.Math.degToRad(Phaser.Math.wrapAngle(value));
    }

});

/**
* @name Phaser.Sprite#frame
* @property {number} frame - Gets or sets the current frame index and updates the Texture Cache for display.
*/
Object.defineProperty(Phaser.Sprite.prototype, "frame", {
    
    get: function () {
        return this.animations.frame;
    },

    set: function (value) {
        this.animations.frame = value;
    }

});

/**
* @name Phaser.Sprite#frameName
* @property {string} frameName - Gets or sets the current frame name and updates the Texture Cache for display.
*/
Object.defineProperty(Phaser.Sprite.prototype, "frameName", {
    
    get: function () {
        return this.animations.frameName;
    },

    set: function (value) {
        this.animations.frameName = value;
    }

});

/**
* @name Phaser.Sprite#inCamera
* @property {boolean} inCamera - Is this sprite visible to the camera or not?
* @readonly
*/
Object.defineProperty(Phaser.Sprite.prototype, "inCamera", {
    
    get: function () {
        return this._cache.cameraVisible;
    }

});

/**
* The width of the sprite in pixels, setting this will actually modify the scale to acheive the value desired.
* If you wish to crop the Sprite instead see the Sprite.crop value.
*
* @name Phaser.Sprite#width
* @property {number} width - The width of the Sprite in pixels.
*/
Object.defineProperty(Phaser.Sprite.prototype, 'width', {

    get: function() {
        return this.scale.x * this.currentFrame.width;
    },

    set: function(value) {

        this.scale.x = value / this.currentFrame.width;
        this._cache.scaleX = value / this.currentFrame.width;
        this._width = value;

    }

});

/**
* The height of the sprite in pixels, setting this will actually modify the scale to acheive the value desired.
* If you wish to crop the Sprite instead see the Sprite.crop value.
*
* @name Phaser.Sprite#height
* @property {number} height - The height of the Sprite in pixels.
*/
Object.defineProperty(Phaser.Sprite.prototype, 'height', {

    get: function() {
        return this.scale.y * this.currentFrame.height;
    },

    set: function(value) {

        this.scale.y = value / this.currentFrame.height;
        this._cache.scaleY = value / this.currentFrame.height;
        this._height = value;

    }

});

/**
* By default a Sprite won't process any input events at all. By setting inputEnabled to true the Phaser.InputHandler is
* activated for this Sprite instance and it will then start to process click/touch events and more.
*
* @name Phaser.Sprite#inputEnabled
* @property {boolean} inputEnabled - Set to true to allow this Sprite to receive input events, otherwise false.
*/
Object.defineProperty(Phaser.Sprite.prototype, "inputEnabled", {
    
    get: function () {

        return (this.input.enabled);

    },

    set: function (value) {

        if (value)
        {
            if (this.input.enabled == false)
            {
                this.input.start();
            }
        }
        else
        {
            if (this.input.enabled)
            {
                this.input.stop();
            }
        }

    }

});

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Create a new <code>TileSprite</code>.
* @class Phaser.Tilemap
* @constructor
* @param {Phaser.Game} game - Current game instance.
* @param {number} x - X position of the new tileSprite.
* @param {number} y - Y position of the new tileSprite.
* @param {number} width - the width of the tilesprite.
* @param {number} height - the height of the tilesprite.
* @param {string|Phaser.RenderTexture|PIXI.Texture} key - This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture or PIXI.Texture.
* @param {string|number} frame - If this Sprite is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
*/
Phaser.TileSprite = function (game, x, y, width, height, key, frame) {

    x = x || 0;
    y = y || 0;
    width = width || 256;
    height = height || 256;
    key = key || null;
    frame = frame || null;

	Phaser.Sprite.call(this, game, x, y, key, frame);

	/**
	* @property {Description} texture - Description. 
    */
    this.texture = PIXI.TextureCache[key];

	PIXI.TilingSprite.call(this, this.texture, width, height);

	/**
	* @property {Description} type - Description. 
    */
	this.type = Phaser.TILESPRITE;

	/**
	* @property {Point} tileScale - The scaling of the image that is being tiled.
	*/	
	this.tileScale = new Phaser.Point(1, 1);

	/**
	* @property {Point} tilePosition - The offset position of the image that is being tiled.
	*/	
	this.tilePosition = new Phaser.Point(0, 0);

};

Phaser.TileSprite.prototype = Phaser.Utils.extend(true, PIXI.TilingSprite.prototype, Phaser.Sprite.prototype);
Phaser.TileSprite.prototype.constructor = Phaser.TileSprite;

//  Add our own custom methods

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Create a new <code>Text</code>.
* @class Phaser.Text
* @constructor
* @param {Phaser.Game} game - Current game instance.
* @param {number} x - X position of the new text object.
* @param {number} y - Y position of the new text object.
* @param {string} text - The actual text that will be written.
* @param {object} style - The style object containing style attributes like font, font size ,
*/
Phaser.Text = function (game, x, y, text, style) {

    x = x || 0;
    y = y || 0;
    text = text || '';
    style = style || '';

    //  If exists = false then the Sprite isn't updated by the core game loop or physics subsystem at all
	/**
	* @property {boolean} exists - Description.
	* @default
	*/
    this.exists = true;

    //  This is a handy little var your game can use to determine if a sprite is alive or not, it doesn't effect rendering
	/**
	* @property {boolean} alive - Description.
	* @default
	*/
    this.alive = true;

	/**
	* @property {Description} group - Description.
	* @default
	*/
    this.group = null;

	/**
	* @property {string} name - Description.
	* @default
	*/
    this.name = '';

    /**
    * @property {Phaser.Game} game - A reference to the currently running game. 
    */
    this.game = game;

    this._text = text;
    this._style = style;

    PIXI.Text.call(this, text, style);

    /**
     * @property {Description} type - Description. 
     */
    this.type = Phaser.TEXT;

    /**
     * @property {Description} position - Description. 
     */
    this.position.x = this.x = x;
    this.position.y = this.y = y;

    //  Replaces the PIXI.Point with a slightly more flexible one
    /**
     * @property {Phaser.Point} anchor - Description. 
     */
    this.anchor = new Phaser.Point();
    
    /**
     * @property {Phaser.Point} scale - Description. 
     */
    this.scale = new Phaser.Point(1, 1);

    //  A mini cache for storing all of the calculated values
    /**
    * @property {Description} _cache - Description. 
    * @private
    */
    this._cache = { 

        dirty: false,

        //  Transform cache
        a00: 1, a01: 0, a02: x, a10: 0, a11: 1, a12: y, id: 1, 

        //  The previous calculated position
        x: -1, y: -1,

        //  The actual scale values based on the worldTransform
        scaleX: 1, scaleY: 1

    };

    this._cache.x = this.x;
    this._cache.y = this.y;

    /**
    * @property {boolean} renderable - Description. 
    */
    this.renderable = true;

};

Phaser.Text.prototype = Object.create(PIXI.Text.prototype);
Phaser.Text.prototype.constructor = Phaser.Text;

/**
* Automatically called by World.update.
* @method Phaser.Text.prototype.update
*/
Phaser.Text.prototype.update = function() {

    if (!this.exists)
    {
        return;
    }

    this._cache.dirty = false;

    this._cache.x = this.x;
    this._cache.y = this.y;

    if (this.position.x != this._cache.x || this.position.y != this._cache.y)
    {
        this.position.x = this._cache.x;
        this.position.y = this._cache.y;
        this._cache.dirty = true;
    }

}

/**
* @method Phaser.Text.prototype.destroy
*/
Phaser.Text.prototype.destroy = function() {

    if (this.group)
    {
        this.group.remove(this);
    }

    if (this.canvas.parentNode)
    {
        this.canvas.parentNode.removeChild(this.canvas);
    }
    else
    {
        this.canvas = null;
        this.context = null;
    }

    this.exists = false;

    this.group = null;

}

/**
* Get
* @returns {Description}
*//**
* Set
* @param {Description} value - Description
*/
Object.defineProperty(Phaser.Text.prototype, 'angle', {

    get: function() {
        return Phaser.Math.radToDeg(this.rotation);
    },

    set: function(value) {
        this.rotation = Phaser.Math.degToRad(value);
    }

});

Object.defineProperty(Phaser.Text.prototype, 'content', {

    get: function() {
        return this._text;
    },

    set: function(value) {

        //  Let's not update unless needed, this way we can safely update the text in a core loop without constant re-draws
        if (value !== this._text)
        {
            this._text = value;
            this.setText(value);
        }

    }

});

Object.defineProperty(Phaser.Text.prototype, 'font', {

    get: function() {
        return this._style;
    },

    set: function(value) {

        //  Let's not update unless needed, this way we can safely update the text in a core loop without constant re-draws
        if (value !== this._style)
        {
            this._style = value;
            this.setStyle(value);
        }

    }

});

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Creates a new `BitmapText` object. BitmapText work by taking a texture file and an XML file that describes the font layout.
* On Windows you can use the free app BMFont: http://www.angelcode.com/products/bmfont/
* On OS X we recommend Glyph Designer: http://www.71squared.com/en/glyphdesigner
*
* @class Phaser.BitmapText
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {number} x - X position of the new bitmapText object.
* @param {number} y - Y position of the new bitmapText object.
* @param {string} text - The actual text that will be written.
* @param {object} style - The style object containing style attributes like font, font size , etc.
*/
Phaser.BitmapText = function (game, x, y, text, style) {

    x = x || 0;
    y = y || 0;

    text = text || '';
    style = style || '';

	/** 
	* @property {boolean} exists - If exists = false then the Sprite isn't updated by the core game loop or physics subsystem at all.
	* @default
	*/
    this.exists = true;

	/**
    * @property {boolean} alive - This is a handy little var your game can use to determine if a sprite is alive or not, it doesn't effect rendering.
	* @default
	*/
    this.alive = true;

	/**
    * @property {Description} group - Description.
 	* @default
 	*/
    this.group = null;

	/**
    * @property {string} name - Description.
  	* @default
  	*/
    this.name = '';

    /**
    * @property {Phaser.Game} game - A reference to the currently running Game.
    */
    this.game = game;

    PIXI.BitmapText.call(this, text, style);

    /**
    * @property {Description} type - Description.
    */
    this.type = Phaser.BITMAPTEXT;

	/**
	* @property {number} position.x - Description.
	*/
    this.position.x = x;
    
	/**
	* @property {number} position.y - Description.
	*/
    this.position.y = y;

    //  Replaces the PIXI.Point with a slightly more flexible one
	/**
	* @property {Phaser.Point} anchor - Description.
	*/
    this.anchor = new Phaser.Point();
    
	/**
	* @property {Phaser.Point} scale - Description.
	*/
    this.scale = new Phaser.Point(1, 1);

    //  A mini cache for storing all of the calculated values
	/**
	* @property {function} _cache - Description.
	* @private
	*/
    this._cache = { 

        dirty: false,

        //  Transform cache
        a00: 1, a01: 0, a02: x, a10: 0, a11: 1, a12: y, id: 1, 

        //  The previous calculated position
        x: -1, y: -1,

        //  The actual scale values based on the worldTransform
        scaleX: 1, scaleY: 1

    };

    this._cache.x = this.x;
    this._cache.y = this.y;

	/**
	* @property {boolean} renderable - Description.
	* @private
	*/
    this.renderable = true;

};

Phaser.BitmapText.prototype = Object.create(PIXI.BitmapText.prototype);
// Phaser.BitmapText.prototype = Phaser.Utils.extend(true, PIXI.BitmapText.prototype);
Phaser.BitmapText.prototype.constructor = Phaser.BitmapText;

/**
* Automatically called by World.update
* @method Phaser.BitmapText.prototype.update
*/
Phaser.BitmapText.prototype.update = function() {

    if (!this.exists)
    {
        return;
    }

    this._cache.dirty = false;

    this._cache.x = this.x;
    this._cache.y = this.y;

    if (this.position.x != this._cache.x || this.position.y != this._cache.y)
    {
        this.position.x = this._cache.x;
        this.position.y = this._cache.y;
        this._cache.dirty = true;
    }

    this.pivot.x = this.anchor.x*this.width;
    this.pivot.y = this.anchor.y*this.height;

}

/**
* @method Phaser.Text.prototype.destroy
*/
Phaser.BitmapText.prototype.destroy = function() {

    if (this.group)
    {
        this.group.remove(this);
    }

    if (this.canvas.parentNode)
    {
        this.canvas.parentNode.removeChild(this.canvas);
    }
    else
    {
        this.canvas = null;
        this.context = null;
    }

    this.exists = false;

    this.group = null;

}

/**
* Get
* @returns {Description}
*//**
* Set
* @param {Description} value - Description
*/
Object.defineProperty(Phaser.BitmapText.prototype, 'angle', {

    get: function() {
        return Phaser.Math.radToDeg(this.rotation);
    },

    set: function(value) {
        this.rotation = Phaser.Math.degToRad(value);
    }

});

/**
* Get
* @returns {Description}
*//**
* Set
* @param {Description} value - Description
*/
Object.defineProperty(Phaser.BitmapText.prototype, 'x', {

    get: function() {
        return this.position.x;
    },

    set: function(value) {
        this.position.x = value;
    }

});

/**
* Get
* @returns {Description}
*//**
* Set
* @param {Description} value - Description
*/
Object.defineProperty(Phaser.BitmapText.prototype, 'y', {

    get: function() {
        return this.position.y;
    },

    set: function(value) {
        this.position.y = value;
    }

});

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Create a new `Button` object. A Button is a special type of Sprite that is set-up to handle Pointer events automatically. The four states a Button responds to are:
* 'Over' - when the Pointer moves over the Button. This is also commonly known as 'hover'.
* 'Out' - when the Pointer that was previously over the Button moves out of it.
* 'Down' - when the Pointer is pressed down on the Button. I.e. touched on a touch enabled device or clicked with the mouse.
* 'Up' - when the Pointer that was pressed down on the Button is released again.
* You can set a unique texture frame and Sound for any of these states.
*
* @class Phaser.Button
* @constructor
*
* @param {Phaser.Game} game Current game instance.
* @param {number} [x] - X position of the Button.
* @param {number} [y] - Y position of the Button.
* @param {string} [key] - The image key as defined in the Game.Cache to use as the texture for this Button.
* @param {function} [callback] - The function to call when this Button is pressed.
* @param {object} [callbackContext] - The context in which the callback will be called (usually 'this').
* @param {string|number} [overFrame] - This is the frame or frameName that will be set when this button is in an over state. Give either a number to use a frame ID or a string for a frame name.
* @param {string|number} [outFrame] - This is the frame or frameName that will be set when this button is in an out state. Give either a number to use a frame ID or a string for a frame name.
* @param {string|number} [downFrame] - This is the frame or frameName that will be set when this button is in a down state. Give either a number to use a frame ID or a string for a frame name.
*/
Phaser.Button = function (game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame) {

    x = x || 0;
    y = y || 0;
    key = key || null;
    callback = callback || null;
    callbackContext = callbackContext || this;

	Phaser.Sprite.call(this, game, x, y, key, outFrame);

	/** 
	* @property {number} type - The Phaser Object Type.
	*/
    this.type = Phaser.BUTTON;

	/** 
	* @property {string} _onOverFrameName - Internal variable.
	* @private
	* @default
	*/
    this._onOverFrameName = null;
    
	/** 
	* @property {string} _onOutFrameName - Internal variable.
	* @private
	* @default
	*/
    this._onOutFrameName = null;
    
	/** 
	* @property {string} _onDownFrameName - Internal variable.
	* @private
	* @default
	*/
    this._onDownFrameName = null;
    
	/** 
	* @property {string} _onUpFrameName - Internal variable.
	* @private
	* @default
	*/
    this._onUpFrameName = null;
    
	/** 
	* @property {number} _onOverFrameID - Internal variable.
	* @private
	* @default
	*/
    this._onOverFrameID = null;
    
	/** 
	* @property {number} _onOutFrameID - Internal variable.
	* @private
	* @default
	*/
    this._onOutFrameID = null;
    
	/** 
	* @property {number} _onDownFrameID - Internal variable.
	* @private
	* @default
	*/
    this._onDownFrameID = null;
    
	/** 
	* @property {number} _onUpFrameID - Internal variable.
	* @private
	* @default
	*/
    this._onUpFrameID = null;

    /** 
    * @property {Phaser.Sound} onOverSound - The Sound to be played when this Buttons Over state is activated.
    * @default
    */
    this.onOverSound = null;

    /** 
    * @property {Phaser.Sound} onOutSound - The Sound to be played when this Buttons Out state is activated.
    * @default
    */
    this.onOutSound = null;

    /** 
    * @property {Phaser.Sound} onDownSound - The Sound to be played when this Buttons Down state is activated.
    * @default
    */
    this.onDownSound = null;

    /** 
    * @property {Phaser.Sound} onUpSound - The Sound to be played when this Buttons Up state is activated.
    * @default
    */
    this.onUpSound = null;

    /** 
    * @property {string} onOverSoundMarker - The Sound Marker used in conjunction with the onOverSound.
    * @default
    */
    this.onOverSoundMarker = '';

    /** 
    * @property {string} onOutSoundMarker - The Sound Marker used in conjunction with the onOutSound.
    * @default
    */
    this.onOutSoundMarker = '';

    /** 
    * @property {string} onDownSoundMarker - The Sound Marker used in conjunction with the onDownSound.
    * @default
    */
    this.onDownSoundMarker = '';

    /** 
    * @property {string} onUpSoundMarker - The Sound Marker used in conjunction with the onUpSound.
    * @default
    */
    this.onUpSoundMarker = '';

	/** 
	* @property {Phaser.Signal} onInputOver - The Signal (or event) dispatched when this Button is in an Over state.
	*/
    this.onInputOver = new Phaser.Signal;
    
	/** 
	* @property {Phaser.Signal} onInputOut - The Signal (or event) dispatched when this Button is in an Out state.
	*/
    this.onInputOut = new Phaser.Signal;
    
	/** 
	* @property {Phaser.Signal} onInputDown - The Signal (or event) dispatched when this Button is in an Down state.
	*/
    this.onInputDown = new Phaser.Signal;
    
	/** 
	* @property {Phaser.Signal} onInputUp - The Signal (or event) dispatched when this Button is in an Up state.
	*/
    this.onInputUp = new Phaser.Signal;

    /** 
    * @property {boolean} freezeFrames - When true the Button will cease to change texture frame on all events (over, out, up, down).
    */
    this.freezeFrames = false;

    this.setFrames(overFrame, outFrame, downFrame);

    if (callback !== null)
    {
        this.onInputUp.add(callback, callbackContext);
    }

    this.input.start(0, true);

    //  Redirect the input events to here so we can handle animation updates, etc
    this.events.onInputOver.add(this.onInputOverHandler, this);
    this.events.onInputOut.add(this.onInputOutHandler, this);
    this.events.onInputDown.add(this.onInputDownHandler, this);
    this.events.onInputUp.add(this.onInputUpHandler, this);

};

Phaser.Button.prototype = Object.create(Phaser.Sprite.prototype);
Phaser.Button.prototype = Phaser.Utils.extend(true, Phaser.Button.prototype, Phaser.Sprite.prototype, PIXI.Sprite.prototype);
Phaser.Button.prototype.constructor = Phaser.Button;

/**
* Used to manually set the frames that will be used for the different states of the button
* exactly like setting them in the constructor.
*
* @method Phaser.Button.prototype.setFrames
* @param {string|number} [overFrame] - This is the frame or frameName that will be set when this button is in an over state. Give either a number to use a frame ID or a string for a frame name.
* @param {string|number} [outFrame] - This is the frame or frameName that will be set when this button is in an out state. Give either a number to use a frame ID or a string for a frame name.
* @param {string|number} [downFrame] - This is the frame or frameName that will be set when this button is in a down state. Give either a number to use a frame ID or a string for a frame name.
*/
Phaser.Button.prototype.setFrames = function (overFrame, outFrame, downFrame) {

    if (overFrame !== null)
    {
        if (typeof overFrame === 'string')
        {
            this._onOverFrameName = overFrame;
            
            if (this.input.pointerOver())
            {
                this.frameName = overFrame;
            }
        }
        else
        {
            this._onOverFrameID = overFrame;

            if (this.input.pointerOver())
            {
                this.frame = overFrame;
            }
        }
    }

    if (outFrame !== null)
    {
        if (typeof outFrame === 'string')
        {
            this._onOutFrameName = outFrame;
            this._onUpFrameName = outFrame;

            if (this.input.pointerOver() == false)
            {
                this.frameName = outFrame;
            }
        }
        else
        {
            this._onOutFrameID = outFrame;
            this._onUpFrameID = outFrame;

            if (this.input.pointerOver() == false)
            {
                this.frame = outFrame;
            }
        }
    }

    if (downFrame !== null)
    {
        if (typeof downFrame === 'string')
        {
            this._onDownFrameName = downFrame;

            if (this.input.pointerOver())
            {
                this.frameName = downFrame;
            }
        }
        else
        {
            this._onDownFrameID = downFrame;

            if (this.input.pointerOver())
            {
                this.frame = downFrame;
            }
        }
    }

};

/**
* Sets the sounds to be played whenever this Button is interacted with. Sounds can be either full Sound objects, or markers pointing to a section of a Sound object.
* The most common forms of sounds are 'hover' effects and 'click' effects, which is why the order of the parameters is overSound then downSound.
* Call this function with no parameters at all to reset all sounds on this Button.
*
* @method Phaser.Button.prototype.setSounds
* @param {Phaser.Sound} [overSound] - Over Button Sound.
* @param {string} [overMarker] - Over Button Sound Marker.
* @param {Phaser.Sound} [downSound] - Down Button Sound.
* @param {string} [downMarker] - Down Button Sound Marker.
* @param {Phaser.Sound} [outSound] - Out Button Sound.
* @param {string} [outMarker] - Out Button Sound Marker.
* @param {Phaser.Sound} [upSound] - Up Button Sound.
* @param {string} [upMarker] - Up Button Sound Marker.
*/
Phaser.Button.prototype.setSounds = function (overSound, overMarker, downSound, downMarker, outSound, outMarker, upSound, upMarker) {

    this.setOverSound(overSound, overMarker);
    this.setOutSound(outSound, outMarker);
    this.setUpSound(upSound, upMarker);
    this.setDownSound(downSound, downMarker);

}

/**
* The Sound to be played when a Pointer moves over this Button.
*
* @method Phaser.Button.prototype.setOverSound
* @param {Phaser.Sound} sound - The Sound that will be played.
* @param {string} [marker] - A Sound Marker that will be used in the playback.
*/
Phaser.Button.prototype.setOverSound = function (sound, marker) {

    this.onOverSound = null;
    this.onOverSoundMarker = '';

    if (sound instanceof Phaser.Sound)
    {
        this.onOverSound = sound;
    }

    if (typeof marker === 'string')
    {
        this.onOverSoundMarker = marker;
    }

}

/**
* The Sound to be played when a Pointer moves out of this Button.
*
* @method Phaser.Button.prototype.setOutSound
* @param {Phaser.Sound} sound - The Sound that will be played.
* @param {string} [marker] - A Sound Marker that will be used in the playback.
*/
Phaser.Button.prototype.setOutSound = function (sound, marker) {

    this.onOutSound = null;
    this.onOutSoundMarker = '';

    if (sound instanceof Phaser.Sound)
    {
        this.onOutSound = sound;
    }

    if (typeof marker === 'string')
    {
        this.onOutSoundMarker = marker;
    }

}

/**
* The Sound to be played when a Pointer clicks on this Button.
*
* @method Phaser.Button.prototype.setUpSound
* @param {Phaser.Sound} sound - The Sound that will be played.
* @param {string} [marker] - A Sound Marker that will be used in the playback.
*/
Phaser.Button.prototype.setUpSound = function (sound, marker) {

    this.onUpSound = null;
    this.onUpSoundMarker = '';

    if (sound instanceof Phaser.Sound)
    {
        this.onUpSound = sound;
    }

    if (typeof marker === 'string')
    {
        this.onUpSoundMarker = marker;
    }

}

/**
* The Sound to be played when a Pointer clicks on this Button.
*
* @method Phaser.Button.prototype.setDownSound
* @param {Phaser.Sound} sound - The Sound that will be played.
* @param {string} [marker] - A Sound Marker that will be used in the playback.
*/
Phaser.Button.prototype.setDownSound = function (sound, marker) {

    this.onDownSound = null;
    this.onDownSoundMarker = '';

    if (sound instanceof Phaser.Sound)
    {
        this.onDownSound = sound;
    }

    if (typeof marker === 'string')
    {
        this.onDownSoundMarker = marker;
    }

}

/**
* Internal function that handles input events.
*
* @protected
* @method Phaser.Button.prototype.onInputOverHandler
* @param {Phaser.Pointer} pointer - The Pointer that activated the Button.
*/
Phaser.Button.prototype.onInputOverHandler = function (pointer) {

    if (this.freezeFrames == false)
    {
        if (this._onOverFrameName != null)
        {
            this.frameName = this._onOverFrameName;
        }
        else if (this._onOverFrameID != null)
        {
            this.frame = this._onOverFrameID;
        }
    }

    if (this.onOverSound)
    {
        this.onOverSound.play(this.onOverSoundMarker);
    }

    if (this.onInputOver)
    {
        this.onInputOver.dispatch(this, pointer);
    }
};

/**
* Internal function that handles input events.
*
* @protected
* @method Phaser.Button.prototype.onInputOverHandler
* @param {Phaser.Pointer} pointer - The Pointer that activated the Button.
*/
Phaser.Button.prototype.onInputOutHandler = function (pointer) {

    if (this.freezeFrames == false)
    {
        if (this._onOutFrameName != null)
        {
            this.frameName = this._onOutFrameName;
        }
        else if (this._onOutFrameID != null)
        {
            this.frame = this._onOutFrameID;
        }
    }

    if (this.onOutSound)
    {
        this.onOutSound.play(this.onOutSoundMarker);
    }

    if (this.onInputOut)
    {
        this.onInputOut.dispatch(this, pointer);
    }
};

/**
* Internal function that handles input events.
*
* @protected
* @method Phaser.Button.prototype.onInputOverHandler
* @param {Phaser.Pointer} pointer - The Pointer that activated the Button.
*/
Phaser.Button.prototype.onInputDownHandler = function (pointer) {

    if (this.freezeFrames == false)
    {
        if (this._onDownFrameName != null)
        {
            this.frameName = this._onDownFrameName;
        }
        else if (this._onDownFrameID != null)
        {
            this.frame = this._onDownFrameID;
        }
    }

    if (this.onDownSound)
    {
        this.onDownSound.play(this.onDownSoundMarker);
    }

    if (this.onInputDown)
    {
        this.onInputDown.dispatch(this, pointer);
    }
};

/**
* Internal function that handles input events.
*
* @protected
* @method Phaser.Button.prototype.onInputOverHandler
* @param {Phaser.Pointer} pointer - The Pointer that activated the Button.
*/
Phaser.Button.prototype.onInputUpHandler = function (pointer) {

    if (this.freezeFrames == false)
    {
        if (this._onUpFrameName != null)
        {
            this.frameName = this._onUpFrameName;
        }
        else if (this._onUpFrameID != null)
        {
            this.frame = this._onUpFrameID;
        }
    }

    if (this.onUpSound)
    {
        this.onUpSound.play(this.onUpSoundMarker);
    }

    if (this.onInputUp)
    {
        this.onInputUp.dispatch(this, pointer);
    }
};

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Creates a new <code>Graphics</code> object.
* 
* @class Phaser.Graphics
* @constructor
*
* @param {Phaser.Game} game Current game instance.
* @param {number} x - X position of the new graphics object.
* @param {number} y - Y position of the new graphics object.
*/
Phaser.Graphics = function (game, x, y) {

    this.game = game;

    PIXI.Graphics.call(this);

    /**
	* @property {Description} type - Description.
	*/
    this.type = Phaser.GRAPHICS;

};

Phaser.Graphics.prototype = Object.create(PIXI.Graphics.prototype);
Phaser.Graphics.prototype.constructor = Phaser.Graphics;

//  Add our own custom methods

/**
* Description.
* 
* @method Phaser.Sprite.prototype.destroy
*/
Phaser.Graphics.prototype.destroy = function() {

    this.clear();

    if (this.group)
    {
        this.group.remove(this);
    }

    this.game = null;

}

Object.defineProperty(Phaser.Graphics.prototype, 'angle', {

    get: function() {
        return Phaser.Math.wrapAngle(Phaser.Math.radToDeg(this.rotation));
    },

    set: function(value) {
        this.rotation = Phaser.Math.degToRad(Phaser.Math.wrapAngle(value));
    }

});

Object.defineProperty(Phaser.Graphics.prototype, 'x', {

    get: function() {
        return this.position.x;
    },

    set: function(value) {
        this.position.x = value;
    }

});

Object.defineProperty(Phaser.Graphics.prototype, 'y', {

    get: function() {
        return this.position.y;
    },

    set: function(value) {
        this.position.y = value;
    }

});

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A dynamic initially blank canvas to which images can be drawn
* @class Phaser.RenderTexture
* @constructor
* @param {Phaser.Game} game - Current game instance.
* @param {string} key - Asset key for the render texture.
* @param {number} width - the width of the render texture.
* @param {number} height - the height of the render texture.
*/
Phaser.RenderTexture = function (game, key, width, height) {

	/**
	* @property {Phaser.Game} game - A reference to the currently running game. 
	*/
	this.game = game;

	/**
    * @property {string} name - the name of the object. 
	*/
    this.name = key;

	PIXI.EventTarget.call( this );

	/**
	* @property {number} width - the width. 
    */
	this.width = width || 100;
	
	/**
	* @property {number} height - the height. 
    */
	this.height = height || 100;

	/**
	* I know this has a typo in it, but it's because the PIXI.RenderTexture does and we need to pair-up with it
	* once they update pixi to fix the typo, we'll fix it here too :)
    * @property {Description} indetityMatrix - Description. 
 	*/
	this.indetityMatrix = PIXI.mat3.create();

	/**
	* @property {Description} frame - Description. 
    */
	this.frame = new PIXI.Rectangle(0, 0, this.width, this.height);	

	/**
	* @property {Description} type - Description. 
    */
	this.type = Phaser.RENDERTEXTURE;

	if (PIXI.gl)
	{
		this.initWebGL();
	}
	else
	{
		this.initCanvas();
	}
	
};

Phaser.RenderTexture.prototype = Phaser.Utils.extend(true, PIXI.RenderTexture.prototype);
Phaser.RenderTexture.prototype.constructor = Phaser.RenderTexture;

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Canvas class handles everything related to the &lt;canvas&gt; tag as a DOM Element, like styles, offset, aspect ratio
*
* @class Phaser.Canvas
* @static
*/
Phaser.Canvas = {

    /**
    * Creates the &lt;canvas&gt; tag
    *
    * @method Phaser.Canvas.create
    * @param {number} width - The desired width.
    * @param {number} height - The desired height.
    * @return {HTMLCanvasElement} The newly created &lt;canvas&gt; tag.
    */
    create: function (width, height) {

        width = width || 256;
        height = height || 256;

        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.style.display = 'block';

        return canvas;

    },

    /**
    * Get the DOM offset values of any given element
    * @method Phaser.Canvas.getOffset
    * @param {HTMLElement} element - The targeted element that we want to retrieve the offset.
    * @param {Phaser.Point} [point] - The point we want to take the x/y values of the offset.
    * @return {Phaser.Point} - A point objet with the offsetX and Y as its properties.
    */    
    getOffset: function (element, point) {

        point = point || new Phaser.Point;

        var box = element.getBoundingClientRect();
        var clientTop = element.clientTop || document.body.clientTop || 0;
        var clientLeft = element.clientLeft || document.body.clientLeft || 0;
        var scrollTop = window.pageYOffset || element.scrollTop || document.body.scrollTop;
        var scrollLeft = window.pageXOffset || element.scrollLeft || document.body.scrollLeft;

        point.x = box.left + scrollLeft - clientLeft;
        point.y = box.top + scrollTop - clientTop;

        return point;

    },

    /**
    * Returns the aspect ratio of the given canvas.
    *
    * @method Phaser.Canvas.getAspectRatio
    * @param {HTMLCanvasElement} canvas - The canvas to get the aspect ratio from.
    * @return {number} The ratio between canvas' width and height.
    */        
    getAspectRatio: function (canvas) {
        return canvas.width / canvas.height;
    },

    /**
    * Sets the background color behind the canvas. This changes the canvas style property.
    *
    * @method Phaser.Canvas.setBackgroundColor
    * @param {HTMLCanvasElement} canvas - The canvas to set the background color on.
    * @param {string} [color] - The color to set. Can be in the format 'rgb(r,g,b)', or '#RRGGBB' or any valid CSS color.
    * @return {HTMLCanvasElement} Returns the source canvas.
    */
    setBackgroundColor: function (canvas, color) {

        color = color || 'rgb(0,0,0)';

        canvas.style.backgroundColor = color;
        
        return canvas;

    },

    /**
    * Sets the touch-action property on the canvas style. Can be used to disable default browser touch actions.
    *
    * @method Phaser.Canvas.setTouchAction
    * @param {HTMLCanvasElement} canvas - The canvas to set the touch action on.
    * @param {String} [value] - The touch action to set. Defaults to 'none'.
    * @return {HTMLCanvasElement} The source canvas.
    */
    setTouchAction: function (canvas, value) {

        value = value || 'none';

        canvas.style.msTouchAction = value;
        canvas.style['ms-touch-action'] = value;
        canvas.style['touch-action'] = value;

        return canvas;

    },

    /**
    * Sets the user-select property on the canvas style. Can be used to disable default browser selection actions.
    *
    * @method Phaser.Canvas.setUserSelect
    * @param {HTMLCanvasElement} canvas - The canvas to set the touch action on.
    * @param {String} [value] - The touch action to set. Defaults to 'none'.
    * @return {HTMLCanvasElement} The source canvas.
    */
    setUserSelect: function (canvas, value) {

        value = value || 'none';

        canvas.style['-webkit-touch-callout'] = value;
        canvas.style['-webkit-user-select'] = value;
        canvas.style['-khtml-user-select'] = value;
        canvas.style['-moz-user-select'] = value;
        canvas.style['-ms-user-select'] = value;
        canvas.style['user-select'] = value;
        canvas.style['-webkit-tap-highlight-color'] = 'rgba(0, 0, 0, 0)';

        return canvas;

    },

    /**
    * Adds the given canvas element to the DOM. The canvas will be added as a child of the given parent.
    * If no parent is given it will be added as a child of the document.body.
    *
    * @method Phaser.Canvas.addToDOM
    * @param {HTMLCanvasElement} canvas - The canvas to set the touch action on.
    * @param {string} parent - The DOM element to add the canvas to. Defaults to ''.
    * @param {boolean} overflowHidden - If set to true it will add the overflow='hidden' style to the parent DOM element.
    * @return {HTMLCanvasElement} Returns the source canvas.
    */
    addToDOM: function (canvas, parent, overflowHidden) {

        parent = parent || '';

        if (typeof overflowHidden === 'undefined') { overflowHidden = true; }

        if (parent !== '')
        {
            if (document.getElementById(parent))
            {
                document.getElementById(parent).appendChild(canvas);

                if (overflowHidden)
                {
                    document.getElementById(parent).style.overflow = 'hidden';
                }
            }
            else
            {
                document.body.appendChild(canvas);
            }
        }
        else
        {
            document.body.appendChild(canvas);
        }

        return canvas;

    },

    /**
    * Sets the transform of the given canvas to the matrix values provided.
    *
    * @method Phaser.Canvas.setTransform
    * @param {CanvasRenderingContext2D} context - The context to set the transform on.
    * @param {number} translateX - The value to translate horizontally by.
    * @param {number} translateY - The value to translate vertically by.
    * @param {number} scaleX - The value to scale horizontally by.
    * @param {number} scaleY - The value to scale vertically by.
    * @param {number} skewX - The value to skew horizontaly by.
    * @param {number} skewY - The value to skew vertically by.
    * @return {CanvasRenderingContext2D} Returns the source context.
    */
    setTransform: function (context, translateX, translateY, scaleX, scaleY, skewX, skewY) {

        context.setTransform(scaleX, skewX, skewY, scaleY, translateX, translateY);

        return context;

    },

    /**
    * Sets the Image Smoothing property on the given context. Set to false to disable image smoothing.
    * By default browsers have image smoothing enabled, which isn't always what you visually want, especially
    * when using pixel art in a game. Note that this sets the property on the context itself, so that any image
    * drawn to the context will be affected. This sets the property across all current browsers but support is
    * patchy on earlier browsers, especially on mobile.
    *
    * @method Phaser.Canvas.setSmoothingEnabled
    * @param {CanvasRenderingContext2D} context - The context to enable or disable the image smoothing on.
    * @param {boolean} value - If set to true it will enable image smoothing, false will disable it.
    * @return {CanvasRenderingContext2D} Returns the source context.
    */
    setSmoothingEnabled: function (context, value) {

        context['imageSmoothingEnabled'] = value;
        context['mozImageSmoothingEnabled'] = value;
        context['oImageSmoothingEnabled'] = value;
        context['webkitImageSmoothingEnabled'] = value;
        context['msImageSmoothingEnabled'] = value;

        return context;

    },

    /**
    * Sets the CSS image-rendering property on the given canvas to be 'crisp' (aka 'optimize contrast on webkit').
    * Note that if this doesn't given the desired result then see the setSmoothingEnabled.
    *
    * @method Phaser.Canvas.setImageRenderingCrisp
    * @param {HTMLCanvasElement} canvas - The canvas to set image-rendering crisp on.
    * @return {HTMLCanvasElement} Returns the source canvas.
    */
    setImageRenderingCrisp: function (canvas) {

        canvas.style['image-rendering'] = 'crisp-edges';
        canvas.style['image-rendering'] = '-moz-crisp-edges';
        canvas.style['image-rendering'] = '-webkit-optimize-contrast';
        canvas.style.msInterpolationMode = 'nearest-neighbor';

        return canvas;

    },

    /**
    * Sets the CSS image-rendering property on the given canvas to be 'bicubic' (aka 'auto').
    * Note that if this doesn't given the desired result then see the CanvasUtils.setSmoothingEnabled method.
    *
    * @method Phaser.Canvas.setImageRenderingBicubic
    * @param {HTMLCanvasElement} canvas The canvas to set image-rendering bicubic on.
    * @return {HTMLCanvasElement} Returns the source canvas.
    */
    setImageRenderingBicubic: function (canvas) {

        canvas.style['image-rendering'] = 'auto';
        canvas.style.msInterpolationMode = 'bicubic';

        return canvas;

    }

};

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* An Animation instance contains a single animation and the controls to play it.
* It is created by the AnimationManager, consists of Animation.Frame objects and belongs to a single Game Object such as a Sprite.
*
* @class Phaser.StageScaleMode 
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {number} width - Description.
* @param {number} height - Description.
*/
Phaser.StageScaleMode = function (game, width, height) {

    /**
    * @property {number} _startHeight - Stage height when starting the game.
    * @default
    * @private
    */
    this._startHeight = 0;

    /**
    * @property {boolean} forceLandscape - If the game should be forced to use Landscape mode, this is set to true by Game.Stage
    * @default
    */
    this.forceLandscape = false;

    /**
    * @property {boolean} forcePortrait - If the game should be forced to use Portrait mode, this is set to true by Game.Stage
    * @default
    */
     this.forcePortrait = false;

    /**
    * @property {boolean} incorrectOrientation - If the game should be forced to use a specific orientation and the device currently isn't in that orientation this is set to true.
    * @default
    */
    this.incorrectOrientation = false;

    /**
    * @property {boolean} pageAlignHorizontally - If you wish to align your game in the middle of the page then you can set this value to true.
    <ul><li>It will place a re-calculated margin-left pixel value onto the canvas element which is updated on orientation/resizing.</li>
    <li>It doesn't care about any other DOM element that may be on the page, it literally just sets the margin.</li></ul>
    * @default
    */
    this.pageAlignHorizontally = false;

    /**
    * @property {boolean} pageAlignVertically - If you wish to align your game in the middle of the page then you can set this value to true.
    <ul><li>It will place a re-calculated margin-left pixel value onto the canvas element which is updated on orientation/resizing.
    <li>It doesn't care about any other DOM element that may be on the page, it literally just sets the margin.</li></ul>
    * @default
    */
    this.pageAlignVertically = false;

    /**
    * @property {number} minWidth - Minimum width the canvas should be scaled to (in pixels).
    * @default
    */
    this.minWidth = null;

    /**
    * @property {number} maxWidth - Maximum width the canvas should be scaled to (in pixels).
    * If null it will scale to whatever width the browser can handle.
    * @default
    */
    this.maxWidth = null;

    /**
    * @property {number} minHeight - Minimum height the canvas should be scaled to (in pixels).
    * @default
    */
    this.minHeight = null;

    /**
    * @property {number} maxHeight - Maximum height the canvas should be scaled to (in pixels).
    * If null it will scale to whatever height the browser can handle.
    * @default
    */
    this.maxHeight = null;

    /**
    * @property {number} width - Width of the stage after calculation.
    */
    this.width = width;

    /**
    * @property {number} height - Height of the stage after calculation.
    */
    this.height = height;

    /**
    * @property {number} _width - Cached stage width for full screen mode.
    * @default
    * @private
    */
    this._width = 0;

    /**
    * @property {number} _height - Cached stage height for full screen mode.
    * @default
    * @private
    */
    this._height = 0;

    /**
    * @property {number} maxIterations - The maximum number of times it will try to resize the canvas to fill the browser.
    * @default
    */
    this.maxIterations = 5;
    
    /**
    * @property {Phaser.Game} game - A reference to the currently running game.
    */
    this.game = game;

    /**
    * @property {Description} enterLandscape - Description.
    */
    this.enterLandscape = new Phaser.Signal();

    /**
    * @property {Description} enterPortrait - Description.
    */
    this.enterPortrait = new Phaser.Signal();

    if (window['orientation'])
    {
        this.orientation = window['orientation'];
    }
    else
    {
        if (window.outerWidth > window.outerHeight)
        {
            this.orientation = 90;
        }
        else
        {
            this.orientation = 0;
        }
    }

    /**
    * @property {Description} scaleFactor - Description.
    */
    this.scaleFactor = new Phaser.Point(1, 1);

    /**
    * @property {number} aspectRatio - Aspect ratio.
    * @default
    */
    this.aspectRatio = 0;

    var _this = this;

    window.addEventListener('orientationchange', function (event) {
        return _this.checkOrientation(event);
    }, false);

    window.addEventListener('resize', function (event) {
        return _this.checkResize(event);
    }, false);

    document.addEventListener('webkitfullscreenchange', function (event) {
        return _this.fullScreenChange(event);
    }, false);

    document.addEventListener('mozfullscreenchange', function (event) {
        return _this.fullScreenChange(event);
    }, false);

    document.addEventListener('fullscreenchange', function (event) {
        return _this.fullScreenChange(event);
    }, false);
	
};

/**
* @constant
* @type {number}
*/
Phaser.StageScaleMode.EXACT_FIT = 0;

/**
* @constant
* @type {number}
*/
Phaser.StageScaleMode.NO_SCALE = 1;

/**
* @constant
* @type {number}
*/
Phaser.StageScaleMode.SHOW_ALL = 2;

Phaser.StageScaleMode.prototype = {

    /**
    * Tries to enter the browser into full screen mode.
    * Please note that this needs to be supported by the web browser and isn't the same thing as setting your game to fill the browser.
    * @method Phaser.StageScaleMode#startFullScreen
    * @param {boolean} antialias - You can toggle the anti-alias feature of the canvas before jumping in to full screen (false = retain pixel art, true = smooth art)
    */
    startFullScreen: function (antialias) {

        if (this.isFullScreen)
        {
            return;
        }

        if (typeof antialias !== 'undefined')
        {
            Phaser.Canvas.setSmoothingEnabled(this.game.context, antialias);
        }

        var element = this.game.canvas;
        
        this._width = this.width;
        this._height = this.height;

        console.log('startFullScreen', this._width, this._height);

        if (element['requestFullScreen'])
        {
            element['requestFullScreen']();
        }
        else if (element['mozRequestFullScreen'])
        {
            element['mozRequestFullScreen']();
        }
        else if (element['webkitRequestFullScreen'])
        {
            element['webkitRequestFullScreen'](Element.ALLOW_KEYBOARD_INPUT);
        }

    },

    /**
    * Stops full screen mode if the browser is in it.
    * @method Phaser.StageScaleMode#stopFullScreen
    */
    stopFullScreen: function () {

        if (document['cancelFullScreen'])
        {
            document['cancelFullScreen']();
        }
        else if (document['mozCancelFullScreen'])
        {
            document['mozCancelFullScreen']();
        }
        else if (document['webkitCancelFullScreen'])
        {
            document['webkitCancelFullScreen']();
        }

    },

    /**
    * Called automatically when the browser enters of leaves full screen mode.
    * @method Phaser.StageScaleMode#fullScreenChange
    * @param {Event} event - The fullscreenchange event
    * @protected
    */
    fullScreenChange: function (event) {

        if (this.isFullScreen)
        {
            this.game.stage.canvas.style['width'] = '100%';
            this.game.stage.canvas.style['height'] = '100%';

            this.setMaximum();

            this.game.input.scale.setTo(this.game.width / this.width, this.game.height / this.height);

            this.aspectRatio = this.width / this.height;
            this.scaleFactor.x = this.game.width / this.width;
            this.scaleFactor.y = this.game.height / this.height;
        }
        else
        {
            this.game.stage.canvas.style['width'] = this.game.width + 'px';
            this.game.stage.canvas.style['height'] = this.game.height + 'px';

            this.width = this._width;
            this.height = this._height;

            this.game.input.scale.setTo(this.game.width / this.width, this.game.height / this.height);

            this.aspectRatio = this.width / this.height;
            this.scaleFactor.x = this.game.width / this.width;
            this.scaleFactor.y = this.game.height / this.height;
        }

    },

    /**
    * Checks if the browser is in the correct orientation for your game (if forceLandscape or forcePortrait have been set)
    * @method Phaser.StageScaleMode#checkOrientationState
    */
    checkOrientationState: function () {

        //  They are in the wrong orientation
        if (this.incorrectOrientation)
        {
            if ((this.forceLandscape && window.innerWidth > window.innerHeight) || (this.forcePortrait && window.innerHeight > window.innerWidth))
            {
                //  Back to normal
                this.game.paused = false;
                this.incorrectOrientation = false;
                this.refresh();
            }
        }
        else
        {
            if ((this.forceLandscape && window.innerWidth < window.innerHeight) || (this.forcePortrait && window.innerHeight < window.innerWidth))
            {
                //  Show orientation screen
                this.game.paused = true;
                this.incorrectOrientation = true;
                this.refresh();
            }
        }
    },

    /**
    * Handle window.orientationchange events
    * @method Phaser.StageScaleMode#checkOrientation
    * @param {Event} event - The orientationchange event data.
    */
    checkOrientation: function (event) {

        this.orientation = window['orientation'];

        if (this.isLandscape)
        {
            this.enterLandscape.dispatch(this.orientation, true, false);
        }
        else
        {
            this.enterPortrait.dispatch(this.orientation, false, true);
        }

        if (this.game.stage.scaleMode !== Phaser.StageScaleMode.NO_SCALE)
        {
            this.refresh();
        }

    },

    /**
    * Handle window.resize events
    * @method Phaser.StageScaleMode#checkResize
    * @param {Event} event - The resize event data.
    */
    checkResize: function (event) {

        if (window.outerWidth > window.outerHeight)
        {
            this.orientation = 90;
        }
        else
        {
            this.orientation = 0;
        }

        if (this.isLandscape)
        {
            this.enterLandscape.dispatch(this.orientation, true, false);
        }
        else
        {
            this.enterPortrait.dispatch(this.orientation, false, true);
        }

        if (this.game.stage.scaleMode !== Phaser.StageScaleMode.NO_SCALE)
        {
            this.refresh();
        }
    },

    /**
    * Re-calculate scale mode and update screen size.
    * @method Phaser.StageScaleMode#refresh
    */
    refresh: function () {

        var _this = this;
        
        //  We can't do anything about the status bars in iPads, web apps or desktops
        if (this.game.device.iPad == false && this.game.device.webApp == false && this.game.device.desktop == false)
        {
            // document.documentElement['style'].minHeight = '2000px';
            // this._startHeight = window.innerHeight;

            if (this.game.device.android && this.game.device.chrome == false)
            {
                window.scrollTo(0, 1);
            }
            else
            {
                window.scrollTo(0, 0);
            }
        }

        if (this._check == null && this.maxIterations > 0)
        {
            this._iterations = this.maxIterations;
            this._check = window.setInterval(function () {
                return _this.setScreenSize();
            }, 10);
            this.setScreenSize();
        }

    },

    /**
    * Set screen size automatically based on the scaleMode.
    * @param {Description} force - If force is true it will try to resize the game regardless of the document dimensions.
    */
    setScreenSize: function (force) {

        if (typeof force == 'undefined')
        {
            force = false;
        }
        
        if (this.game.device.iPad == false && this.game.device.webApp == false && this.game.device.desktop == false) 
        {
            if (this.game.device.android && this.game.device.chrome == false)
            {
                window.scrollTo(0, 1);
            }
            else
            {
                window.scrollTo(0, 0);
            }
        }

        this._iterations--;

        if (force || window.innerHeight > this._startHeight || this._iterations < 0)
        {
            // Set minimum height of content to new window height
            document.documentElement['style'].minHeight = window.innerHeight + 'px';
        
            if (this.incorrectOrientation == true)
            {
                this.setMaximum();
            }
            else if (this.game.stage.scaleMode == Phaser.StageScaleMode.EXACT_FIT)
            {
                this.setExactFit();
            }
            else if (this.game.stage.scaleMode == Phaser.StageScaleMode.SHOW_ALL)
            {
                this.setShowAll();
            }

            this.setSize();
            clearInterval(this._check);
            this._check = null;
        }

    },

    /**
    * Sets the canvas style width and height values based on minWidth/Height and maxWidth/Height.
    * @method Phaser.StageScaleMode#setSize
    */
    setSize: function () {

        if (this.incorrectOrientation == false)
        {
            if (this.maxWidth && this.width > this.maxWidth)
            {
                this.width = this.maxWidth;
            }

            if (this.maxHeight && this.height > this.maxHeight)
            {
                this.height = this.maxHeight;
            }

            if (this.minWidth && this.width < this.minWidth)
            {
                this.width = this.minWidth;
            }

            if (this.minHeight && this.height < this.minHeight)
            {
                this.height = this.minHeight;
            }
        }

        this.game.canvas.style.width = this.width + 'px';
        this.game.canvas.style.height = this.height + 'px';
        
        this.game.input.scale.setTo(this.game.width / this.width, this.game.height / this.height);

        if (this.pageAlignHorizontally)
        {
            if (this.width < window.innerWidth && this.incorrectOrientation == false)
            {
                this.game.canvas.style.marginLeft = Math.round((window.innerWidth - this.width) / 2) + 'px';
            }
            else
            {
                this.game.canvas.style.marginLeft = '0px';
            }
        }

        if (this.pageAlignVertically)
        {
            if (this.height < window.innerHeight && this.incorrectOrientation == false)
            {
                this.game.canvas.style.marginTop = Math.round((window.innerHeight - this.height) / 2) + 'px';
            }
            else
            {
                this.game.canvas.style.marginTop = '0px';
            }
        }

        Phaser.Canvas.getOffset(this.game.canvas, this.game.stage.offset);
        
        this.aspectRatio = this.width / this.height;
        
        this.scaleFactor.x = this.game.width / this.width;
        this.scaleFactor.y = this.game.height / this.height;

    },

    /**
    * Sets this.width equal to window.innerWidth and this.height equal to window.innerHeight
    * @method Phaser.StageScaleMode#setMaximum
    */
    setMaximum: function () {

        this.width = window.innerWidth;
        this.height = window.innerHeight;

    },

    /**
    * Calculates the multiplier needed to scale the game proportionally.
    * @method Phaser.StageScaleMode#setShowAll
    */
    setShowAll: function () {

        var multiplier = Math.min((window.innerHeight / this.game.height), (window.innerWidth / this.game.width));

        this.width = Math.round(this.game.width * multiplier);
        this.height = Math.round(this.game.height * multiplier);

    },

    /**
    * Sets the width and height values of the canvas, no larger than the maxWidth/Height.
    * @method Phaser.StageScaleMode#setExactFit
    */
    setExactFit: function () {

        var availableWidth = window.innerWidth;
        var availableHeight = window.innerHeight;

        // console.log('available', availableWidth, availableHeight);

        if (this.maxWidth && availableWidth > this.maxWidth)
        {
            this.width = this.maxWidth;
        }
        else
        {
            this.width = availableWidth;
        }

        if (this.maxHeight && availableHeight > this.maxHeight)
        {
            this.height = this.maxHeight;
        }
        else
        {
            this.height = availableHeight;
        }

    }

};

/**
* @name Phaser.StageScaleMode#isFullScreen
* @property {boolean} isFullScreen - Returns true if the browser is in full screen mode, otherwise false.
* @readonly
*/
Object.defineProperty(Phaser.StageScaleMode.prototype, "isFullScreen", {

    get: function () {

        return (document['fullscreenElement'] || document['mozFullScreenElement'] || document['webkitFullscreenElement'])

    }

});

/**
* @name Phaser.StageScaleMode#isPortrait
* @property {boolean} isPortrait - Returns true if the browser dimensions match a portrait display.
* @readonly
*/
Object.defineProperty(Phaser.StageScaleMode.prototype, "isPortrait", {

    get: function () {
        return this.orientation == 0 || this.orientation == 180;
    }

});

/**
* @name Phaser.StageScaleMode#isLandscape
* @property {boolean} isLandscape - Returns true if the browser dimensions match a landscape display.
* @readonly
*/
Object.defineProperty(Phaser.StageScaleMode.prototype, "isLandscape", {

    get: function () {
        return this.orientation === 90 || this.orientation === -90;
    }

});

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Detects device support capabilities. Using some elements from System.js by MrDoob and Modernizr
*
* @class Phaser.Device
* @constructor
*/

Phaser.Device = function () {

    /**
    * An optional 'fix' for the horrendous Android stock browser bug https://code.google.com/p/android/issues/detail?id=39247
    * @property {boolean} patchAndroidClearRectBug - Description.
    * @default
    */
    this.patchAndroidClearRectBug = false;

    //  Operating System

    /**
    * @property {boolean} desktop - Is running desktop?
    * @default
    */
    this.desktop = false;

    /**
    * @property {boolean} iOS - Is running on iOS?
    * @default
    */
    this.iOS = false;

    /**
    * @property {boolean} android - Is running on android?
    * @default
    */
    this.android = false;

    /**
    * @property {boolean} chromeOS - Is running on chromeOS?
    * @default
    */
    this.chromeOS = false;

    /**
    * @property {boolean} linux - Is running on linux?
    * @default
    */
    this.linux = false;

    /**
    * @property {boolean} macOS - Is running on macOS?
    * @default
    */
    this.macOS = false;

    /**
    * @property {boolean} windows - Is running on windows?
    * @default
    */
    this.windows = false;

    //  Features

    /**
    * @property {boolean} canvas - Is canvas available?
    * @default
    */
    this.canvas = false;

    /**
    * @property {boolean} file - Is file available?
    * @default
    */
    this.file = false;

    /**
    * @property {boolean} fileSystem - Is fileSystem available?
    * @default
    */
    this.fileSystem = false;

    /**
    * @property {boolean} localStorage - Is localStorage available?
    * @default
    */
    this.localStorage = false;

    /**
    * @property {boolean} webGL - Is webGL available?
    * @default
    */
    this.webGL = false;

    /**
    * @property {boolean} worker - Is worker available?
    * @default
    */
    this.worker = false;

    /**
    * @property {boolean} touch - Is touch available?
    * @default
    */
    this.touch = false;

    /**
    * @property {boolean} mspointer - Is mspointer available?
    * @default
    */
    this.mspointer = false;

    /**
    * @property {boolean} css3D - Is css3D available?
    * @default
    */
    this.css3D = false;

    /** 
    * @property {boolean} pointerLock - Is Pointer Lock available?
    * @default
    */
    this.pointerLock = false;

    //  Browser

    /**
    * @property {boolean} arora - Is running in arora?
    * @default
    */
    this.arora = false;

    /**
    * @property {boolean} chrome - Is running in chrome?
    * @default
    */
    this.chrome = false;

    /**
    * @property {boolean} epiphany - Is running in epiphany?
    * @default
    */
    this.epiphany = false;

    /**
    * @property {boolean} firefox - Is running in firefox?
    * @default
    */
    this.firefox = false;

    /**
    * @property {boolean} ie - Is running in ie?
    * @default
    */
    this.ie = false;

    /**
    * @property {number} ieVersion - Version of ie?
    * @default
    */
    this.ieVersion = 0;

    /**
    * @property {boolean} mobileSafari - Is running in mobileSafari?
    * @default
    */
    this.mobileSafari = false;

    /**
    * @property {boolean} midori - Is running in midori?
    * @default
    */
    this.midori = false;

    /**
    * @property {boolean} opera - Is running in opera?
    * @default
    */
    this.opera = false;

    /**
    * @property {boolean} safari - Is running in safari?
    * @default
    */
    this.safari = false;
    this.webApp = false;

    //  Audio

    /**
    * @property {boolean} audioData - Are Audio tags available?
    * @default
    */
    this.audioData = false;

    /**
    * @property {boolean} webAudio - Is the WebAudio API available?
    * @default
    */
    this.webAudio = false;

    /**
    * @property {boolean} ogg - Can this device play ogg files?
    * @default
    */
    this.ogg = false;

    /**
    * @property {boolean} opus - Can this device play opus files?
    * @default
    */
    this.opus = false;

    /**
    * @property {boolean} mp3 - Can this device play mp3 files?
    * @default
    */
    this.mp3 = false;

    /**
    * @property {boolean} wav - Can this device play wav files?
    * @default
    */
    this.wav = false;
    /**
    * Can this device play m4a files?
    * @property {boolean} m4a - True if this device can play m4a files.
    * @default
    */
    this.m4a = false;

    /**
    * @property {boolean} webm - Can this device play webm files?
    * @default
    */
    this.webm = false;

    //  Device

    /**
    * @property {boolean} iPhone - Is running on iPhone?
    * @default
    */
    this.iPhone = false;

    /**
    * @property {boolean} iPhone4 - Is running on iPhone4?
    * @default
    */
    this.iPhone4 = false;

    /** 
    * @property {boolean} iPad - Is running on iPad?
    * @default
    */
    this.iPad = false;

    /**
    * @property {number} pixelRatio - PixelRatio of the host device?
    * @default
    */
    this.pixelRatio = 0;

    //  Run the checks
    this._checkAudio();
    this._checkBrowser();
    this._checkCSS3D();
    this._checkDevice();
    this._checkFeatures();
    this._checkOS();
    
};

Phaser.Device.prototype = {

    /**
    * Check which OS is game running on.
    * @method Phaser.Device#_checkOS
    * @private
    */
    _checkOS: function () {

        var ua = navigator.userAgent;

        if (/Android/.test(ua)) {
            this.android = true;
        } else if (/CrOS/.test(ua)) {
            this.chromeOS = true;
        } else if (/iP[ao]d|iPhone/i.test(ua)) {
            this.iOS = true;
        } else if (/Linux/.test(ua)) {
            this.linux = true;
        } else if (/Mac OS/.test(ua)) {
            this.macOS = true;
        } else if (/Windows/.test(ua)) {
            this.windows = true;
        }

        if (this.windows || this.macOS || this.linux) {
            this.desktop = true;
        }

    },

    /**
    * Check HTML5 features of the host environment.
    * @method Phaser.Device#_checkFeatures
    * @private
    */
    _checkFeatures: function () {

        this.canvas = !!window['CanvasRenderingContext2D'];

        try {
            this.localStorage = !!localStorage.getItem;
        } catch (error) {
            this.localStorage = false;
        }

        this.file = !!window['File'] && !!window['FileReader'] && !!window['FileList'] && !!window['Blob'];
        this.fileSystem = !!window['requestFileSystem'];
        this.webGL = ( function () { try { var canvas = document.createElement( 'canvas' ); return !! window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) ); } catch( e ) { return false; } } )();

        if (this.webGL === null || this.webGL === false)
        {
            this.webGL = false;
        }
        else
        {
            this.webGL = true;
        }

        this.worker = !!window['Worker'];
        
        if ('ontouchstart' in document.documentElement || window.navigator.msPointerEnabled) {
            this.touch = true;
        }

        if (window.navigator.msPointerEnabled) {
            this.mspointer = true;
        }
        
        this.pointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

    },

    /**
    * Check what browser is game running in.
    * @method Phaser.Device#_checkBrowser
    * @private
    */
    _checkBrowser: function () {

        var ua = navigator.userAgent;

        if (/Arora/.test(ua)) {
            this.arora = true;
        } else if (/Chrome/.test(ua)) {
            this.chrome = true;
        } else if (/Epiphany/.test(ua)) {
            this.epiphany = true;
        } else if (/Firefox/.test(ua)) {
            this.firefox = true;
        } else if (/Mobile Safari/.test(ua)) {
            this.mobileSafari = true;
        } else if (/MSIE (\d+\.\d+);/.test(ua)) {
            this.ie = true;
            this.ieVersion = parseInt(RegExp.$1);
        } else if (/Midori/.test(ua)) {
            this.midori = true;
        } else if (/Opera/.test(ua)) {
            this.opera = true;
        } else if (/Safari/.test(ua)) {
            this.safari = true;
        }

        // WebApp mode in iOS
        if (navigator['standalone']) {
            this.webApp = true;
        }

    },

    /**
    * Check audio support.
    * @method Phaser.Device#_checkAudio
    * @private
    */
    _checkAudio: function () {

        this.audioData = !!(window['Audio']);
        this.webAudio = !!(window['webkitAudioContext'] || window['AudioContext']);
        var audioElement = document.createElement('audio');
        var result = false;

        try {
            if (result = !!audioElement.canPlayType) {
                
                if (audioElement.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, '')) {
                    this.ogg = true;
                }

                if (audioElement.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, '')) {
                    this.opus = true;
                }

                if (audioElement.canPlayType('audio/mpeg;').replace(/^no$/, '')) {
                    this.mp3 = true;
                }

                // Mimetypes accepted:
                //   developer.mozilla.org/En/Media_formats_supported_by_the_audio_and_video_elements
                //   bit.ly/iphoneoscodecs
                if (audioElement.canPlayType('audio/wav; codecs="1"').replace(/^no$/, '')) {
                    this.wav = true;
                }

                if (audioElement.canPlayType('audio/x-m4a;') || audioElement.canPlayType('audio/aac;').replace(/^no$/, '')) {
                    this.m4a = true;
                }

                if (audioElement.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, '')) {
                    this.webm = true;
                }
            }
        } catch (e) {
        }

    },

    /**
    * Check PixelRatio of devices.
    * @method Phaser.Device#_checkDevice
    * @private
    */
    _checkDevice: function () {

        this.pixelRatio = window['devicePixelRatio'] || 1;
        this.iPhone = navigator.userAgent.toLowerCase().indexOf('iphone') != -1;
        this.iPhone4 = (this.pixelRatio == 2 && this.iPhone);
        this.iPad = navigator.userAgent.toLowerCase().indexOf('ipad') != -1;

    },

    /**
    * Check whether the host environment support 3D CSS.
    * @method Phaser.Device#_checkCSS3D
    * @private
    */
    _checkCSS3D: function () {

        var el = document.createElement('p');
        var has3d;
        var transforms = {
            'webkitTransform': '-webkit-transform',
            'OTransform': '-o-transform',
            'msTransform': '-ms-transform',
            'MozTransform': '-moz-transform',
            'transform': 'transform'
        };

        // Add it to the body to get the computed style.
        document.body.insertBefore(el, null);

        for (var t in transforms) {
            if (el.style[t] !== undefined) {
                el.style[t] = "translate3d(1px,1px,1px)";
                has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
            }
        }
        
        document.body.removeChild(el);
        this.css3D = (has3d !== undefined && has3d.length > 0 && has3d !== "none");

    },

    /**
    * Check whether the host environment can play audio.
    * @method Phaser.Device#canPlayAudio
    * @param {string} type - One of 'mp3, 'ogg', 'm4a', 'wav', 'webm'.
    * @return {boolean} True if the given file type is supported by the browser, otherwise false.
    */
    canPlayAudio: function (type) {

        if (type == 'mp3' && this.mp3)
        {
            return true;
        }
        else if (type == 'ogg' && (this.ogg || this.opus))
        {
            return true;
        }
        else if (type == 'm4a' && this.m4a)
        {
            return true;
        }
        else if (type == 'wav' && this.wav)
        {
            return true;
        }
        else if (type == 'webm' && this.webm)
        {
            return true;
        }

        return false;

    },

    /**
    * Check whether the console is open.
    * @method Phaser.Device#isConsoleOpen
    * @return {boolean} True if the browser dev console is open.
    */
    isConsoleOpen: function () {

        if (window.console && window.console['firebug'])
        {
            return true;
        }

        if (window.console)
        {
            console.profile();
            console.profileEnd();

            if (console.clear)
            {
                console.clear();
            }

            return console['profiles'].length > 0;
        }

        return false;

    }

};

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Abstracts away the use of RAF or setTimeOut for the core game update loop.
*
* @class Phaser.RequestAnimationFrame 
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
*/
Phaser.RequestAnimationFrame = function(game) {
	
     /**
     * @property {Phaser.Game} game - The currently running game.
     */
	this.game = game;

     /**
     * @property {boolean} _isSetTimeOut  - Description.
     * @private
     */
	this._isSetTimeOut = false;
     
     /**
     * @property {boolean} isRunning - Description.
     * @default
     */
	this.isRunning = false;

	var vendors = [
		'ms', 
		'moz', 
		'webkit', 
		'o'
	];

	for (var x = 0; x < vendors.length && !window.requestAnimationFrame; x++)
	{
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'];
	}

	/**
	* The function called by the update
	* @property _onLoop
	* @private
	*/
	this._onLoop = null;

};

Phaser.RequestAnimationFrame.prototype = {


	/**
	* Starts the requestAnimatioFrame running or setTimeout if unavailable in browser
	* @method Phaser.RequestAnimationFrame#start
	*/
	start: function () {

		this.isRunning = true;

		var _this = this;

		if (!window.requestAnimationFrame)
		{
			this._isSetTimeOut = true;

            this._onLoop = function () {
                return _this.updateSetTimeout();
            };

			this._timeOutID = window.setTimeout(this._onLoop, 0);
		}
		else
		{
			this._isSetTimeOut = false;

            this._onLoop = function (time) {
                return _this.updateRAF(time);
            };

			window.requestAnimationFrame(this._onLoop);
		}

	},

	/**
	* The update method for the requestAnimationFrame
	* @method Phaser.RequestAnimationFrame#updateRAF	
	* @param {number} time - A timestamp, either from RAF or setTimeOut
	*/
	updateRAF: function (time) {

		this.game.update(time);

		window.requestAnimationFrame(this._onLoop);

	},

	/**
	* The update method for the setTimeout.
	* @method Phaser.RequestAnimationFrame#updateSetTimeout
	*/
	updateSetTimeout: function () {

		this.game.update(Date.now());

		this._timeOutID = window.setTimeout(this._onLoop, this.game.time.timeToCall);

	},

	/**
	* Stops the requestAnimationFrame from running.
	* @method Phaser.RequestAnimationFrame#stop
	*/
	stop: function () {

		if (this._isSetTimeOut)
		{
			clearTimeout(this._timeOutID);
		}
		else
		{
			window.cancelAnimationFrame;
		}

		this.isRunning = false;

	},

	/**
	* Is the browser using setTimeout?
	* @method Phaser.RequestAnimationFrame#isSetTimeOut
	* @return {boolean}
	*/
	isSetTimeOut: function () {
		return this._isSetTimeOut;
	},

	/**
	* Is the browser using requestAnimationFrame?
	* @method Phaser.RequestAnimationFrame#isRAF
	* @return {boolean}
	*/
	isRAF: function () {
		return (this._isSetTimeOut === false);
	}

};
/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
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

	this.sow(seeds);

};

Phaser.RandomDataGenerator.prototype = {

	/**
	* @property {number} c
	* @private
	*/
	c: 1,

	/**
	* @property {number} s0
	* @private
	*/
	s0: 0,

	/**
	* @property {number} s1
	* @private
	*/
	s1: 0,

	/**
	* @property {number} s2
	* @private
	*/
	s2: 0,

	/**
	* Private random helper.
	* @method Phaser.RandomDataGenerator#rnd
	* @private
	* @return {number} Description.
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
	* Description.
	* @method Phaser.RandomDataGenerator#hash
	* @param {Any} data
	* @private
	* @return {number} Description.
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
	* @method Phaser.RandomDataGenerator#integer
	* @return {number}
	*/
	integer: function() {
		return this.rnd.apply(this) * 0x100000000;// 2^32
	},

	/**
	* Returns a random real number between 0 and 1.
	* @method Phaser.RandomDataGenerator#frac
	* @return {number}
	*/	
	frac: function() {
		return this.rnd.apply(this) + (this.rnd.apply(this) * 0x200000 | 0) * 1.1102230246251565e-16;// 2^-53
	},

	/**
	* Returns a random real number between 0 and 2^32.
	* @method Phaser.RandomDataGenerator#real
	* @return {number}
	*/
	real: function() {
		return this.integer() + this.frac();
	},

	/**
	* Returns a random integer between min and max.
	* @method Phaser.RandomDataGenerator#integerInRange
	* @param {number} min
	* @param {number} max
	* @return {number}
	*/
	integerInRange: function (min, max) {
		return Math.floor(this.realInRange(min, max));
	},

	/**
	* Returns a random real number between min and max.
	* @method Phaser.RandomDataGenerator#realInRange
	* @param {number} min
	* @param {number} max
	* @return {number}
	*/
	realInRange: function (min, max) {

		return this.frac() * (max - min) + min;

	},

	/**
	* Returns a random real number between -1 and 1.
	* @method Phaser.RandomDataGenerator#normal
	* @return {number}
	*/
	normal: function () {
		return 1 - 2 * this.frac();
	},

	/**
	* Returns a valid RFC4122 version4 ID hex string from https://gist.github.com/1308368
	* @method Phaser.RandomDataGenerator#uuid
	* @return {string}
	*/
	uuid: function () {

		var a, b;

		for (
			b=a='';
			a++<36;
			b+=~a%5|a*3&4?(a^15?8^this.frac()*(a^20?16:4):4).toString(16):'-'
		);

		return b;

	},

	/**
	* Returns a random member of `array`.
	* @method Phaser.RandomDataGenerator#pick
	* @param {Any} ary
	* @return {number}
	*/
	pick: function (ary) {
		return ary[this.integerInRange(0, ary.length)];
	},

	/**
	* Returns a random member of `array`, favoring the earlier entries.
	* @method Phaser.RandomDataGenerator#weightedPick
	* @param {Any} ary
	* @return {number}
	*/
	weightedPick: function (ary) {
		return ary[~~(Math.pow(this.frac(), 2) * ary.length)];
	},

	/**
	* Returns a random timestamp between min and max, or between the beginning of 2000 and the end of 2020 if min and max aren't specified.
	* @method Phaser.RandomDataGenerator#timestamp
	* @param {number} min
	* @param {number} max
	* @return {number}
	*/
	timestamp: function (a, b) {
		return this.realInRange(a || 946684800000, b || 1577862000000);
	},

	/**
	* Returns a random angle between -180 and 180.
	* @method Phaser.RandomDataGenerator#angle
	* @return {number}
	*/
	angle: function() {
		return this.integerInRange(-180, 180);
	}

};

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
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
	* @method Phaser.Math#fuzzyEqual
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

        if (gap == 0) {
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
	* Find the angle of a segment from (x1, y1) -> (x2, y2 ).
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
	* Set an angle  within the bounds of -&pi; to&pi;.
	* @method Phaser.Math#normalizeAngle
	* @param {number} angle
	* @param {boolean} radians - True if angle size is expressed in radians.
    * @return {number}
	*/
    normalizeAngle: function (angle, radians) {

        if (typeof radians === "undefined") { radians = true; }

        var rd = (radians) ? GameMath.PI : 180;
        return this.wrap(angle, rd, -rd);
        
    },

	/**
	* Closest angle between two angles from a1 to a2
	* absolute value the return for exact angle
	* @method Phaser.Math#nearestAngleBetween
	* @param {number} a1
	* @param {number} a2
	* @param {boolean} radians - True if angle sizes are expressed in radians.
    * @return {number}
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
	* Interpolate across the shortest arc between two angles.
	* @method Phaser.Math#interpolateAngles
	* @param {number} a1 - Description.
	* @param {number} a2 - Description.
	* @param {number} weight - Description.
	* @param {boolean} radians - True if angle sizes are expressed in radians.
	* @param {Description} ease - Description.
    * @return {number}
	*/
    interpolateAngles: function (a1, a2, weight, radians, ease) {

        if (typeof radians === "undefined") { radians = true; }
        if (typeof ease === "undefined") { ease = null; }

        a1 = this.normalizeAngle(a1, radians);
        a2 = this.normalizeAngleToAnother(a2, a1, radians);

        return (typeof ease === 'function') ? ease(weight, a1, a2 - a1, 1) : this.interpolateFloat(a1, a2, weight);

    },

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
    * <p>max should be larger than min, or the function will return 0</p>
    *
    * @method Phaser.Math#wrap
    * @param value The value to wrap
    * @param min The minimum the value is allowed to be
    * @param max The maximum the value is allowed to be
    * @return {number} The wrapped value
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
	* Randomly returns either a 1 or -1.
	*
	* @method Phaser.Math#randomSign
	* @return {number}	1 or -1
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
    * Significantly faster version of Math.max
    * See http://jsperf.com/math-s-min-max-vs-homemade/5
    *
    * @method Phaser.Math#max
    * @return {number} The highest value from those given.
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
    * @method Phaser.Math#min
    * @return {number} The lowest value from those given.
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
	* @method Phaser.Math#wrapAngle
	* @param {number} angle - The angle value to check
	* @return {number} The new angle value, returns the same as the input angle if it was within bounds.
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
	* Keeps an angle value between the given min and max values.
	*
	* @method Phaser.Math#angleLimit
	* @param {number} angle - The angle value to check. Must be between -180 and +180.
	* @param {number} min - The minimum angle that is allowed (must be -180 or greater).
	* @param {number} max - The maximum angle that is allowed (must be 180 or less).
	*
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
	* Description.
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
	* Description.
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
	* Description.
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
	* @method Phaser.Math#floor
	* @param {number} Value	Any number.
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

        return { sin: sinTable, cos: cosTable };

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
    * @return {number} The distance between this Point object and the destination Point object.
    **/
    distance: function (x1, y1, x2, y2) {

        var dx = x1 - x2;
        var dy = y1 - y2;

        return Math.sqrt(dx * dx + dy * dy);

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
    **/
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
	* @param {number} x
	* @param {number} a1
	* @param {number} a1
	* @param {number} a2
	* @param {number} b1
	* @param {number} b2
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

		if ( x <= min ) return 0;
		if ( x >= max ) return 1;

		x = ( x - min )/( max - min );

		return x*x*(3 - 2*x);

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

		if ( x <= min ) return 0;
		if ( x >= max ) return 1;

		x = ( x - min )/( max - min );

		return x*x*x*(x*(x*6 - 15) + 10);

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
	* Convert degrees to radians.
	* 
	* @method Phaser.Math#degToRad
	* @return {function}
	*/
	degToRad: function() {

		var degreeToRadiansFactor = Math.PI / 180;

		return function ( degrees ) {

			return degrees * degreeToRadiansFactor;

		};

	}(),

	/**
	* Convert degrees to radians.
	* 
	* @method Phaser.Math#radToDeg
	* @return {function}
	*/
	radToDeg: function() {

		var radianToDegreesFactor = 180 / Math.PI;

		return function ( radians ) {

			return radians * radianToDegreesFactor;

		};

	}()

};

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
 * Javascript QuadTree 
 * @version 1.0
 * @author Timo Hausmann
 *
 * @version 1.2, September 4th 2013
 * @author Richard Davey
 * The original code was a conversion of the Java code posted to GameDevTuts. However I've tweaked
 * it massively to add node indexing, removed lots of temp. var creation and significantly
 * increased performance as a result.
 *
 * Original version at https://github.com/timohausmann/quadtree-js/
 */
 
/**
* @copyright © 2012 Timo Hausmann
*
* Permission is hereby granted, free of charge, to any person obtaining
* a copy of this software and associated documentation files (the
* "Software"), to deal in the Software without restriction, including
* without limitation the rights to use, copy, modify, merge, publish,
* distribute, sublicense, and/or sell copies of the Software, and to
* permit persons to whom the Software is furnished to do so, subject to
* the following conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
* MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
* LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
* OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
* WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/**
 * QuadTree Constructor
 * 
 * @class Phaser.QuadTree
 * @classdesc A QuadTree implementation. The original code was a conversion of the Java code posted to GameDevTuts. However I've tweaked
 * it massively to add node indexing, removed lots of temp. var creation and significantly increased performance as a result. Original version at https://github.com/timohausmann/quadtree-js/
 * @constructor
 * @param {Description} physicsManager - Description.
 * @param {Description} x - Description.
 * @param {Description} y - Description.
 * @param {number} width - The width of your game in game pixels.
 * @param {number} height - The height of your game in game pixels.
 * @param {number} maxObjects - Description.
 * @param {number} maxLevels - Description.
 * @param {number} level - Description.
 */
Phaser.QuadTree = function (physicsManager, x, y, width, height, maxObjects, maxLevels, level) {
		
	this.physicsManager = physicsManager;
	this.ID = physicsManager.quadTreeID;
	physicsManager.quadTreeID++;

	this.maxObjects = maxObjects || 10;
	this.maxLevels = maxLevels || 4;
	this.level = level || 0;

	this.bounds = { 
		x: Math.round(x), 
		y: Math.round(y), 
		width: width, 
		height: height, 
		subWidth: Math.floor(width / 2),
		subHeight: Math.floor(height / 2),
		right: Math.round(x) + Math.floor(width / 2),
		bottom: Math.round(y) + Math.floor(height / 2)
	};
	
	this.objects = [];
	this.nodes = [];

};

Phaser.QuadTree.prototype = {

	/*
	* Split the node into 4 subnodes
	* 
	* @method Phaser.QuadTree#split
	*/
	split: function() {

		this.level++;
		
	 	//	top right node
		this.nodes[0] = new Phaser.QuadTree(this.physicsManager, this.bounds.right, this.bounds.y, this.bounds.subWidth, this.bounds.subHeight, this.maxObjects, this.maxLevels, this.level);
		
		//	top left node
		this.nodes[1] = new Phaser.QuadTree(this.physicsManager, this.bounds.x, this.bounds.y, this.bounds.subWidth, this.bounds.subHeight, this.maxObjects, this.maxLevels, this.level);
		
		//	bottom left node
		this.nodes[2] = new Phaser.QuadTree(this.physicsManager, this.bounds.x, this.bounds.bottom, this.bounds.subWidth, this.bounds.subHeight, this.maxObjects, this.maxLevels, this.level);
		
		//	bottom right node
		this.nodes[3] = new Phaser.QuadTree(this.physicsManager, this.bounds.right, this.bounds.bottom, this.bounds.subWidth, this.bounds.subHeight, this.maxObjects, this.maxLevels, this.level);

	},

	/*
	 * Insert the object into the node. If the node
	 * exceeds the capacity, it will split and add all
	 * objects to their corresponding subnodes.
	 * 
	 * @method Phaser.QuadTree#insert
	 * @param {object} body - Description.
	 */
	insert: function (body) {
		
		var i = 0;
		var index;
	 	
	 	//	if we have subnodes ...
		if (this.nodes[0] != null)
		{
			index = this.getIndex(body);
	 
		  	if (index !== -1)
		  	{
				this.nodes[index].insert(body);
			 	return;
			}
		}
	 
	 	this.objects.push(body);
		
		if (this.objects.length > this.maxObjects && this.level < this.maxLevels)
		{
			//	Split if we don't already have subnodes
			if (this.nodes[0] == null)
			{
				this.split();
			}
			
			//	Add objects to subnodes
			while (i < this.objects.length)
			{
				index = this.getIndex(this.objects[i]);
				
				if (index !== -1)
				{
					//	this is expensive - see what we can do about it
					this.nodes[index].insert(this.objects.splice(i, 1)[0]);
				}
				else
				{
					i++;
			 	}
		 	}
		}
	 },
	 
	/*
	 * Determine which node the object belongs to.
	 * 
	 * @method Phaser.QuadTree#getIndex
	 * @param {object} rect	- Description.
	 * @return {number} index -	Index of the subnode (0-3), or -1 if rect cannot completely fit within a subnode and is part of the parent node.
	 */
	getIndex: function (rect) {
		
		//	default is that rect doesn't fit, i.e. it straddles the internal quadrants
		var index = -1;

		if (rect.x < this.bounds.right && rect.right < this.bounds.right)
		{
			if ((rect.y < this.bounds.bottom && rect.bottom < this.bounds.bottom))
			{
				//	rect fits within the top-left quadrant of this quadtree
				index = 1;
			}
			else if ((rect.y > this.bounds.bottom))
			{
				//	rect fits within the bottom-left quadrant of this quadtree
				index = 2;
			}
		}
		else if (rect.x > this.bounds.right)
		{
			//	rect can completely fit within the right quadrants
			if ((rect.y < this.bounds.bottom && rect.bottom < this.bounds.bottom))
			{
				//	rect fits within the top-right quadrant of this quadtree
				index = 0;
			}
			else if ((rect.y > this.bounds.bottom))
			{
				//	rect fits within the bottom-right quadrant of this quadtree
				index = 3;
			}
		}
	 
		return index;

	},

	 /*
	 * Return all objects that could collide with the given object.
	 * 
	 * @method Phaser.QuadTree#retrieve
	 * @param {object} rect	- Description.
	 * @Return {array} - Array with all detected objects.
	 */
	retrieve: function (sprite) {
	 	
		var returnObjects = this.objects;

		sprite.body.quadTreeIndex = this.getIndex(sprite.body);

		//	Temp store for the node IDs this sprite is in, we can use this for fast elimination later
		sprite.body.quadTreeIDs.push(this.ID);

		if (this.nodes[0])
		{
			//	if rect fits into a subnode ..
			if (sprite.body.quadTreeIndex !== -1)
			{
				returnObjects = returnObjects.concat(this.nodes[sprite.body.quadTreeIndex].retrieve(sprite));
			}
			else
			{
				//	if rect does not fit into a subnode, check it against all subnodes (unrolled for speed)
				returnObjects = returnObjects.concat(this.nodes[0].retrieve(sprite));
				returnObjects = returnObjects.concat(this.nodes[1].retrieve(sprite));
				returnObjects = returnObjects.concat(this.nodes[2].retrieve(sprite));
				returnObjects = returnObjects.concat(this.nodes[3].retrieve(sprite));
			}
		}
	 
		return returnObjects;

	},

	/*
	 * Clear the quadtree.
	 * @method Phaser.QuadTree#clear
	 */
	clear: function () {
		
		this.objects = [];
	 
		for (var i = 0, len = this.nodes.length; i < len; i++)
		{
			// if (typeof this.nodes[i] !== 'undefined')
			if (this.nodes[i])
			{
				this.nodes[i].clear();
				delete this.nodes[i];
		  	}
		}
	}

};

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Creates a new Circle object with the center coordinate specified by the x and y parameters and the diameter specified by the diameter parameter. If you call this function without parameters, a circle with x, y, diameter and radius properties set to 0 is created.
* @class Circle
* @classdesc Phaser - Circle
* @constructor
* @param {number} [x] The x coordinate of the center of the circle.
* @param {number} [y] The y coordinate of the center of the circle.
* @param {number} [diameter] The diameter of the circle.
* @return {Phaser.Circle} This circle object
**/
Phaser.Circle = function (x, y, diameter) {

    x = x || 0;
    y = y || 0;
    diameter = diameter || 0;

    /**
    * @property {number} x - The x coordinate of the center of the circle.
    **/
    this.x = x;

    /**
    * @property {number} y - The y coordinate of the center of the circle.
    **/
    this.y = y;

    /**
    * @property {number} _diameter - The diameter of the circle.
    * @private
    **/
    this._diameter = diameter;

    if (diameter > 0)
    {
    	/**
    	* @property {number} _radius - The radius of the circle.
    	* @private
        **/
        this._radius = diameter * 0.5;
    }
    else
    {
        this._radius = 0;
    }

};

Phaser.Circle.prototype = {

    /**
    * The circumference of the circle.
    * @method Phaser.Circle#circumference
    * @return {number}
    **/
    circumference: function () {
        return 2 * (Math.PI * this._radius);
    },

    /**
    * Sets the members of Circle to the specified values.
    * @method Phaser.Circle#setTo
    * @param {number} x - The x coordinate of the center of the circle.
    * @param {number} y - The y coordinate of the center of the circle.
    * @param {number} diameter - The diameter of the circle in pixels.
    * @return {Circle} This circle object.
    **/
    setTo: function (x, y, diameter) {
        this.x = x;
        this.y = y;
        this._diameter = diameter;
        this._radius = diameter * 0.5;
        return this;
    },

    /**
    * Copies the x, y and diameter properties from any given object to this Circle.
    * @method Phaser.Circle#copyFrom
    * @param {any} source - The object to copy from.
    * @return {Circle} This Circle object.
    **/
    copyFrom: function (source) {
        return this.setTo(source.x, source.y, source.diameter);
    },

    /**
    * Copies the x, y and diameter properties from this Circle to any given object.
    * @method Phaser.Circle#copyTo
    * @param {any} dest - The object to copy to.
    * @return {Object} This dest object.
    **/
    copyTo: function(dest) {
        dest[x] = this.x;
        dest[y] = this.y;
        dest[diameter] = this._diameter;
        return dest;
    },

    /**
    * Returns the distance from the center of the Circle object to the given object
    * (can be Circle, Point or anything with x/y properties)
    * @method Phaser.Circle#distance
    * @param {object} dest - The target object. Must have visible x and y properties that represent the center of the object.
    * @param {boolean} [round] - Round the distance to the nearest integer (default false).
    * @return {number} The distance between this Point object and the destination Point object.
    */
    distance: function (dest, round) {

        if (typeof round === "undefined") { round = false }

        if (round)
        {
            return Phaser.Math.distanceRound(this.x, this.y, dest.x, dest.y);
        }
        else
        {
            return Phaser.Math.distance(this.x, this.y, dest.x, dest.y);
        }

    },

    /**
    * Returns a new Circle object with the same values for the x, y, width, and height properties as this Circle object.
    * @method Phaser.Circle#clone
    * @param {Phaser.Circle} out - Optional Circle object. If given the values will be set into the object, otherwise a brand new Circle object will be created and returned.
    * @return {Phaser.Circle} The cloned Circle object.
    */
    clone: function(out) {

        if (typeof out === "undefined") { out = new Phaser.Circle(); }

        return out.setTo(a.x, a.y, a.diameter);

    },

    /**
    * Return true if the given x/y coordinates are within this Circle object.
    * @method Phaser.Circle#contains
    * @param {number} x - The X value of the coordinate to test.
    * @param {number} y - The Y value of the coordinate to test.
    * @return {boolean} True if the coordinates are within this circle, otherwise false.
    */
    contains: function (x, y) {
        return Phaser.Circle.contains(this, x, y);
    },

    /**
    * Returns a Point object containing the coordinates of a point on the circumference of the Circle based on the given angle.
    * @method Phaser.Circle#circumferencePoint
    * @param {number} angle - The angle in radians (unless asDegrees is true) to return the point from.
    * @param {boolean} asDegrees - Is the given angle in radians (false) or degrees (true)?
    * @param {Phaser.Point} [out] - An optional Point object to put the result in to. If none specified a new Point object will be created.
    * @return {Phaser.Point} The Point object holding the result.
    */
    circumferencePoint: function (angle, asDegrees, out) {
        return Phaser.Circle.circumferencePoint(this, angle, asDegrees, out);
    },

    /**
    * Adjusts the location of the Circle object, as determined by its center coordinate, by the specified amounts.
    * @method Phaser.Circle#offset
    * @param {number} dx - Moves the x value of the Circle object by this amount.
    * @param {number} dy - Moves the y value of the Circle object by this amount.
    * @return {Circle} This Circle object.
    **/
    offset: function (dx, dy) {
        this.x += dx;
        this.y += dy;
        return this;
    },

    /**
    * Adjusts the location of the Circle object using a Point object as a parameter. This method is similar to the Circle.offset() method, except that it takes a Point object as a parameter.
    * @method Phaser.Circle#offsetPoint
    * @param {Point} point A Point object to use to offset this Circle object (or any valid object with exposed x and y properties).
    * @return {Circle} This Circle object.
    **/
    offsetPoint: function (point) {
        return this.offset(point.x, point.y);
    },

    /**
    * Returns a string representation of this object.
    * @method Phaser.Circle#toString
    * @return {string} a string representation of the instance.
    **/
    toString: function () {
        return "[{Phaser.Circle (x=" + this.x + " y=" + this.y + " diameter=" + this.diameter + " radius=" + this.radius + ")}]";
    }

};

/**
* The largest distance between any two points on the circle. The same as the radius * 2.
* @name Phaser.Circle#diameter
* @property {number} diameter - Gets or sets the diameter of the circle.
*/
Object.defineProperty(Phaser.Circle.prototype, "diameter", {

    get: function () {
        return this._diameter;
    },

    set: function (value) {
        if (value > 0) {
            this._diameter = value;
            this._radius = value * 0.5;
        }
    }

});

/**
* The length of a line extending from the center of the circle to any point on the circle itself. The same as half the diameter.
* @name Phaser.Circle#radius
* @property {number} radius - Gets or sets the radius of the circle.
*/
Object.defineProperty(Phaser.Circle.prototype, "radius", {
    
    get: function () {
        return this._radius;
    },

    set: function (value) {
        if (value > 0) {
            this._radius = value;
            this._diameter = value * 2;
        }
    }

});

/**
* The x coordinate of the leftmost point of the circle. Changing the left property of a Circle object has no effect on the x and y properties. However it does affect the diameter, whereas changing the x value does not affect the diameter property.
* @name Phaser.Circle#left
* @propety {number} left - Gets or sets the value of the leftmost point of the circle.
*/
Object.defineProperty(Phaser.Circle.prototype, "left", {
    
    get: function () {
        return this.x - this._radius;
    },

    set: function (value) {
        if (value > this.x) {
            this._radius = 0;
            this._diameter = 0;
        } else {
            this.radius = this.x - value;
        }
    }

});

/**
* The x coordinate of the rightmost point of the circle. Changing the right property of a Circle object has no effect on the x and y properties. However it does affect the diameter, whereas changing the x value does not affect the diameter property.
* @name Phaser.Circle#right
* @property {number} right - Gets or sets the value of the rightmost point of the circle.
*/
Object.defineProperty(Phaser.Circle.prototype, "right", {

    get: function () {
        return this.x + this._radius;
    },

    set: function (value) {
        if (value < this.x) {
            this._radius = 0;
            this._diameter = 0;
        } else {
            this.radius = value - this.x;
        }
    }

});

/**
* The sum of the y minus the radius property. Changing the top property of a Circle object has no effect on the x and y properties, but does change the diameter.
* @name Phaser.Circle#top
* @property {number} top - Gets or sets the top of the circle.
*/
Object.defineProperty(Phaser.Circle.prototype, "top", {

    get: function () {
        return this.y - this._radius;
    },
    
    set: function (value) {
        if (value > this.y) {
            this._radius = 0;
            this._diameter = 0;
        } else {
            this.radius = this.y - value;
        }
    }

});

/**
* The sum of the y and radius properties. Changing the bottom property of a Circle object has no effect on the x and y properties, but does change the diameter.
* @name Phaser.Circle#bottom
* @property {number} bottom - Gets or sets the bottom of the circle.
*/
Object.defineProperty(Phaser.Circle.prototype, "bottom", {

    get: function () {
        return this.y + this._radius;
    },

    set: function (value) {

        if (value < this.y) {
            this._radius = 0;
            this._diameter = 0;
        } else {
            this.radius = value - this.y;
        }
    }

});

/**
* The area of this Circle.
* @name Phaser.Circle#area
* @property {number} area - The area of this circle.
* @readonly
*/
Object.defineProperty(Phaser.Circle.prototype, "area", {

    get: function () {
        if (this._radius > 0) {
            return Math.PI * this._radius * this._radius;
        } else {
            return 0;
        }
    }

});

/**
* Determines whether or not this Circle object is empty. Will return a value of true if the Circle objects diameter is less than or equal to 0; otherwise false.
* If set to true it will reset all of the Circle objects properties to 0. A Circle object is empty if its diameter is less than or equal to 0.
* @name Phaser.Circle#empty
* @property {boolean} empty - Gets or sets the empty state of the circle.
*/
Object.defineProperty(Phaser.Circle.prototype, "empty", {

    get: function () {
        return (this._diameter == 0);
    },

    set: function (value) {
        this.setTo(0, 0, 0);
    }

});

/**
* Return true if the given x/y coordinates are within the Circle object.
* @method Phaser.Circle.contains
* @param {Phaser.Circle} a - The Circle to be checked.
* @param {number} x - The X value of the coordinate to test.
* @param {number} y - The Y value of the coordinate to test.
* @return {boolean} True if the coordinates are within this circle, otherwise false.
*/
Phaser.Circle.contains = function (a, x, y) {

    //  Check if x/y are within the bounds first
    if (x >= a.left && x <= a.right && y >= a.top && y <= a.bottom) {

        var dx = (a.x - x) * (a.x - x);
        var dy = (a.y - y) * (a.y - y);

        return (dx + dy) <= (a.radius * a.radius);

    }

    return false;

};

/**
* Determines whether the two Circle objects match. This method compares the x, y and diameter properties.
* @method Phaser.Circle.equals
* @param {Phaser.Circle} a - The first Circle object.
* @param {Phaser.Circle} b - The second Circle object.
* @return {boolean} A value of true if the object has exactly the same values for the x, y and diameter properties as this Circle object; otherwise false.
*/
Phaser.Circle.equals = function (a, b) {
    return (a.x == b.x && a.y == b.y && a.diameter == b.diameter);
};

/**
* Determines whether the two Circle objects intersect.
* This method checks the radius distances between the two Circle objects to see if they intersect.
* @method Phaser.Circle.intersects
* @param {Phaser.Circle} a - The first Circle object.
* @param {Phaser.Circle} b - The second Circle object.
* @return {boolean} A value of true if the specified object intersects with this Circle object; otherwise false.
*/
Phaser.Circle.intersects = function (a, b) {
    return (Phaser.Math.distance(a.x, a.y, b.x, b.y) <= (a.radius + b.radius));
};

/**
* Returns a Point object containing the coordinates of a point on the circumference of the Circle based on the given angle.
* @method Phaser.Circle.circumferencePoint
* @param {Phaser.Circle} a - The first Circle object.
* @param {number} angle - The angle in radians (unless asDegrees is true) to return the point from.
* @param {boolean} asDegrees - Is the given angle in radians (false) or degrees (true)?
* @param {Phaser.Point} [out] - An optional Point object to put the result in to. If none specified a new Point object will be created.
* @return {Phaser.Point} The Point object holding the result.
*/
Phaser.Circle.circumferencePoint = function (a, angle, asDegrees, out) {

    if (typeof asDegrees === "undefined") { asDegrees = false; }
    if (typeof out === "undefined") { out = new Phaser.Point(); }

    if (asDegrees === true) {
        angle = Phaser.Math.radToDeg(angle);
    }

    out.x = a.x + a.radius * Math.cos(angle);
    out.y = a.y + a.radius * Math.sin(angle);

    return out;

};

/**
* Checks if the given Circle and Rectangle objects intersect.
* @method Phaser.Circle.intersectsRectangle
* @param {Phaser.Circle} c - The Circle object to test.
* @param {Phaser.Rectangle} r - The Rectangle object to test.
* @return {boolean} True if the two objects intersect, otherwise false.
*/
Phaser.Circle.intersectsRectangle = function (c, r) {

    var cx = Math.abs(c.x - r.x - r.halfWidth);
    var xDist = r.halfWidth + c.radius;

    if (cx > xDist) {
        return false;
    }

    var cy = Math.abs(c.y - r.y - r.halfHeight);
    var yDist = r.halfHeight + c.radius;

    if (cy > yDist) {
        return false;
    }

    if (cx <= r.halfWidth || cy <= r.halfHeight) {
        return true;
    }

    var xCornerDist = cx - r.halfWidth;
    var yCornerDist = cy - r.halfHeight;
    var xCornerDistSq = xCornerDist * xCornerDist;
    var yCornerDistSq = yCornerDist * yCornerDist;
    var maxCornerDistSq = c.radius * c.radius;

    return xCornerDistSq + yCornerDistSq <= maxCornerDistSq;

};

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Creates a new Point. If you pass no parameters a Point is created set to (0,0).
* @class Phaser.Point
* @classdesc The Point object represents a location in a two-dimensional coordinate system, where x represents the horizontal axis and y represents the vertical axis.
* @constructor
* @param {number} x The horizontal position of this Point (default 0)
* @param {number} y The vertical position of this Point (default 0)
**/
Phaser.Point = function (x, y) {

    x = x || 0;
    y = y || 0;

    /**
     * @property {number} x - The x coordinate of the point.
     **/
    this.x = x;
    
    /**
     * @property {number} y - The y coordinate of the point.
     **/
    this.y = y;

};

Phaser.Point.prototype = {

    /**
    * Copies the x and y properties from any given object to this Point.
    * @method Phaser.Point#copyFrom
    * @param {any} source - The object to copy from.
    * @return {Point} This Point object.
    **/
    copyFrom: function (source) {
        return this.setTo(source.x, source.y);
    },

    /**
    * Inverts the x and y values of this Point
    * @method Phaser.Point#invert
    * @return {Point} This Point object.
    **/
    invert: function () {
        return this.setTo(this.y, this.x);
    },

    /**
    * Sets the x and y values of this Point object to the given coordinates.
    * @method Phaser.Point#setTo
    * @param {number} x - The horizontal position of this point.
    * @param {number} y - The vertical position of this point.
    * @return {Point} This Point object. Useful for chaining method calls.
    **/        
    setTo: function (x, y) {

        this.x = x;
        this.y = y;
        return this;
        
    },

    /**
    * Adds the given x and y values to this Point.
    * @method Phaser.Point#add
    * @param {number} x - The value to add to Point.x.
    * @param {number} y - The value to add to Point.y.
    * @return {Phaser.Point} This Point object. Useful for chaining method calls.
    **/        
    add: function (x, y) {

        this.x += x;
        this.y += y;
        return this;

    },

    /**
    * Subtracts the given x and y values from this Point.
    * @method Phaser.Point#subtract
    * @param {number} x - The value to subtract from Point.x.
    * @param {number} y - The value to subtract from Point.y.
    * @return {Phaser.Point} This Point object. Useful for chaining method calls.
    **/        
    subtract: function (x, y) {

        this.x -= x;
        this.y -= y;
        return this;

    },

    /**
    * Multiplies Point.x and Point.y by the given x and y values.
    * @method Phaser.Point#multiply
    * @param {number} x - The value to multiply Point.x by.
    * @param {number} y - The value to multiply Point.x by.
    * @return {Phaser.Point} This Point object. Useful for chaining method calls.
    **/        
    multiply: function (x, y) {

        this.x *= x;
        this.y *= y;
        return this;

    },

    /**
    * Divides Point.x and Point.y by the given x and y values.
    * @method Phaser.Point#divide
    * @param {number} x - The value to divide Point.x by.
    * @param {number} y - The value to divide Point.x by.
    * @return {Phaser.Point} This Point object. Useful for chaining method calls.
    **/        
    divide: function (x, y) {

        this.x /= x;
        this.y /= y;
        return this;

    },

    /**
    * Clamps the x value of this Point to be between the given min and max.
    * @method Phaser.Point#clampX
    * @param {number} min - The minimum value to clamp this Point to.
    * @param {number} max - The maximum value to clamp this Point to.
    * @return {Phaser.Point} This Point object.
    */
    clampX: function (min, max) {

        this.x = Phaser.Math.clamp(this.x, min, max);
        return this;
        
    },

    /**
    * Clamps the y value of this Point to be between the given min and max
    * @method Phaser.Point#clampY
    * @param {number} min - The minimum value to clamp this Point to.
    * @param {number} max - The maximum value to clamp this Point to.
    * @return {Phaser.Point} This Point object.
    */
    clampY: function (min, max) {

        this.y = Phaser.Math.clamp(this.y, min, max);
        return this;
        
    },

    /**
    * Clamps this Point object values to be between the given min and max.
    * @method Phaser.Point#clamp
    * @param {number} min - The minimum value to clamp this Point to.
    * @param {number} max - The maximum value to clamp this Point to.
    * @return {Phaser.Point} This Point object.
    */
    clamp: function (min, max) {

        this.x = Phaser.Math.clamp(this.x, min, max);
        this.y = Phaser.Math.clamp(this.y, min, max);
        return this;

    },

    /**
    * Creates a copy of the given Point.
    * @method Phaser.Point#clone
    * @param {Phaser.Point} [output] Optional Point object. If given the values will be set into this object, otherwise a brand new Point object will be created and returned.
    * @return {Phaser.Point} The new Point object.
    */
    clone: function (output) {

        if (typeof output === "undefined") { output = new Phaser.Point; }

        return output.setTo(this.x, this.y);

    },

    /**
    * Copies the x and y properties from any given object to this Point.
    * @method Phaser.Point#copyFrom
    * @param {any} source - The object to copy from.
    * @return {Point} This Point object.
    **/
    copyFrom: function (source) {
        return this.setTo(source.x, source.y);
    },

    /**
    * Copies the x and y properties from this Point to any given object.
    * @method Phaser.Point#copyTo
    * @param {any} dest - The object to copy to.
    * @return {Object} The dest object.
    **/
    copyTo: function(dest) {

        dest[x] = this.x;
        dest[y] = this.y;

        return dest;

    },

    /**
    * Returns the distance of this Point object to the given object (can be a Circle, Point or anything with x/y properties)
    * @method Phaser.Point#distance
    * @param {object} dest - The target object. Must have visible x and y properties that represent the center of the object.
    * @param {boolean} [round] - Round the distance to the nearest integer (default false).
    * @return {number} The distance between this Point object and the destination Point object.
    */
    distance: function (dest, round) {
        return Phaser.Point.distance(this, dest, round);
    },

    /**
    * Determines whether the given objects x/y values are equal to this Point object.
    * @method Phaser.Point#equals
    * @param {Phaser.Point} a - The first object to compare.
    * @return {boolean} A value of true if the Points are equal, otherwise false.
    */
    equals: function (a) {
        return (a.x == this.x && a.y == this.y);
    },

    /**
    * Rotates this Point around the x/y coordinates given to the desired angle.
    * @method Phaser.Point#rotate
    * @param {number} x - The x coordinate of the anchor point
    * @param {number} y - The y coordinate of the anchor point
    * @param {number} angle - The angle in radians (unless asDegrees is true) to rotate the Point to.
    * @param {boolean} asDegrees - Is the given rotation in radians (false) or degrees (true)?
    * @param {number} [distance] - An optional distance constraint between the Point and the anchor.
    * @return {Phaser.Point} The modified point object.
    */
    rotate: function (x, y, angle, asDegrees, distance) {
        return Phaser.Point.rotate(this, x, y, angle, asDegrees, distance);
    },

    /**
     * Calculates the length of the vector
     * @method Phaser.Point#getMagnitude
     * @return {number} the length of the vector
     */
    getMagnitude: function() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    },

    /**
     * Alters the length of the vector without changing the direction
     * @method Phaser.Point#getMagnitude
     * @param {number} magnitude the desired magnitude of the resulting vector
     * @return {Phaser.Point} the modified original vector
     */
    setMagnitude: function(magnitude) {
        return this.normalize().multiply(magnitude, magnitude);
    },

    /**
     * Alters the vector so that its length is 1, but it retains the same direction
     * @method Phaser.Point#normalize
     * @return {Phaser.Point} the modified original vector
     */
    normalize: function() {

        if(!this.isZero()) {
            var m = this.getMagnitude();
            this.x /= m;
            this.y /= m;
        }

        return this;

    },

    /**
     * Determine if this point is at 0,0
     * @method Phaser.Point#isZero
     * @return {boolean} True if this Point is 0,0, otherwise false
     */
    isZero: function() {
        return (this.x === 0 && this.y === 0);
    },

    /**
    * Returns a string representation of this object.
    * @method Phaser.Point#toString
    * @return {string} A string representation of the instance.
    **/
    toString: function () {
        return '[{Point (x=' + this.x + ' y=' + this.y + ')}]';
    }

};

/**
* Adds the coordinates of two points together to create a new point.
* @method Phaser.Point.add
* @param {Phaser.Point} a - The first Point object.
* @param {Phaser.Point} b - The second Point object.
* @param {Phaser.Point} [out] - Optional Point to store the value in, if not supplied a new Point object will be created.
* @return {Phaser.Point} The new Point object.
*/
Phaser.Point.add = function (a, b, out) {

    if (typeof out === "undefined") { out = new Phaser.Point(); }

    out.x = a.x + b.x;
    out.y = a.y + b.y;

    return out;

};

/**
* Subtracts the coordinates of two points to create a new point.
* @method Phaser.Point.subtract
* @param {Phaser.Point} a - The first Point object.
* @param {Phaser.Point} b - The second Point object.
* @param {Phaser.Point} [out] - Optional Point to store the value in, if not supplied a new Point object will be created.
* @return {Phaser.Point} The new Point object.
*/
Phaser.Point.subtract = function (a, b, out) {

    if (typeof out === "undefined") { out = new Phaser.Point(); }

    out.x = a.x - b.x;
    out.y = a.y - b.y;

    return out;

};

/**
* Multiplies the coordinates of two points to create a new point.
* @method Phaser.Point.multiply
* @param {Phaser.Point} a - The first Point object.
* @param {Phaser.Point} b - The second Point object.
* @param {Phaser.Point} [out] - Optional Point to store the value in, if not supplied a new Point object will be created.
* @return {Phaser.Point} The new Point object.
*/
Phaser.Point.multiply = function (a, b, out) {

    if (typeof out === "undefined") { out = new Phaser.Point(); }

    out.x = a.x * b.x;
    out.y = a.y * b.y;

    return out;

};

/**
* Divides the coordinates of two points to create a new point.
* @method Phaser.Point.divide
* @param {Phaser.Point} a - The first Point object.
* @param {Phaser.Point} b - The second Point object.
* @param {Phaser.Point} [out] - Optional Point to store the value in, if not supplied a new Point object will be created.
* @return {Phaser.Point} The new Point object.
*/
Phaser.Point.divide = function (a, b, out) {

    if (typeof out === "undefined") { out = new Phaser.Point(); }

    out.x = a.x / b.x;
    out.y = a.y / b.y;

    return out;

};

/**
* Determines whether the two given Point objects are equal. They are considered equal if they have the same x and y values.
* @method Phaser.Point.equals
* @param {Phaser.Point} a - The first Point object.
* @param {Phaser.Point} b - The second Point object.
* @return {boolean} A value of true if the Points are equal, otherwise false.
*/
Phaser.Point.equals = function (a, b) {
    return (a.x == b.x && a.y == b.y);
};

/**
* Returns the distance of this Point object to the given object (can be a Circle, Point or anything with x/y properties).
* @method Phaser.Point.distance
* @param {object} a - The target object. Must have visible x and y properties that represent the center of the object.
* @param {object} b - The target object. Must have visible x and y properties that represent the center of the object.
* @param {boolean} [round] - Round the distance to the nearest integer (default false).
* @return {number} The distance between this Point object and the destination Point object.
*/
Phaser.Point.distance = function (a, b, round) {

    if (typeof round === "undefined") { round = false }

    if (round)
    {
        return Phaser.Math.distanceRound(a.x, a.y, b.x, b.y);
    }
    else
    {
        return Phaser.Math.distance(a.x, a.y, b.x, b.y);
    }

},

/**
* Rotates a Point around the x/y coordinates given to the desired angle.
* @method Phaser.Point.rotate
* @param {Phaser.Point} a - The Point object to rotate.
* @param {number} x - The x coordinate of the anchor point
* @param {number} y - The y coordinate of the anchor point
* @param {number} angle - The angle in radians (unless asDegrees is true) to rotate the Point to.
* @param {boolean} asDegrees - Is the given rotation in radians (false) or degrees (true)?
* @param {number} distance - An optional distance constraint between the Point and the anchor.
* @return {Phaser.Point} The modified point object.
*/
Phaser.Point.rotate = function (a, x, y, angle, asDegrees, distance) {

    asDegrees = asDegrees || false;
    distance = distance || null;

    if (asDegrees)
    {
        angle = Phaser.Math.radToDeg(angle);
    }

    //  Get distance from origin (cx/cy) to this point
    if (distance === null)
    {
        distance = Math.sqrt(((x - a.x) * (x - a.x)) + ((y - a.y) * (y - a.y)));
    }

    return a.setTo(x + distance * Math.cos(angle), y + distance * Math.sin(angle));

};

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Creates a new Rectangle object with the top-left corner specified by the x and y parameters and with the specified width and height parameters. If you call this function without parameters, a Rectangle with x, y, width, and height properties set to 0 is created.
*
* @class Phaser.Rectangle
* @constructor
* @param {number} x - The x coordinate of the top-left corner of the Rectangle.
* @param {number} y - The y coordinate of the top-left corner of the Rectangle.
* @param {number} width - The width of the Rectangle in pixels.
* @param {number} height - The height of the Rectangle in pixels.
* @return {Rectangle} This Rectangle object.
**/
Phaser.Rectangle = function (x, y, width, height) {

    x = x || 0;
    y = y || 0;
    width = width || 0;
    height = height || 0;

    /**
    * @property {number} x - Description.
    */
    this.x = x;
    
    /**
    * @property {number} y - Description.
    */
    this.y = y;
    
    /**
    * @property {number} width - Description.
    */
    this.width = width;
    
    /**
    * @property {number} height - Description.
    */
    this.height = height;

};

Phaser.Rectangle.prototype = {

    /**
    * Adjusts the location of the Rectangle object, as determined by its top-left corner, by the specified amounts.
    * @method Phaser.Rectangle#offset
    * @param {number} dx - Moves the x value of the Rectangle object by this amount.
    * @param {number} dy - Moves the y value of the Rectangle object by this amount.
    * @return {Rectangle} This Rectangle object.
    **/
    offset: function (dx, dy) {

        this.x += dx;
        this.y += dy;

        return this;

    },
 
    /**
    * Adjusts the location of the Rectangle object using a Point object as a parameter. This method is similar to the Rectangle.offset() method, except that it takes a Point object as a parameter.
    * @method Phaser.Rectangle#offsetPoint
    * @param {Point} point - A Point object to use to offset this Rectangle object.
    * @return {Rectangle} This Rectangle object.
    **/
    offsetPoint: function (point) {
        return this.offset(point.x, point.y);
    },
 
    /**
    * Sets the members of Rectangle to the specified values.
    * @method Phaser.Rectangle#setTo
    * @param {number} x - The x coordinate of the top-left corner of the Rectangle.
    * @param {number} y - The y coordinate of the top-left corner of the Rectangle.
    * @param {number} width - The width of the Rectangle in pixels.
    * @param {number} height - The height of the Rectangle in pixels.
    * @return {Rectangle} This Rectangle object
    **/
    setTo: function (x, y, width, height) {

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        return this;

    },
 
    /**
    * Runs Math.floor() on both the x and y values of this Rectangle.
    * @method Phaser.Rectangle#floor
    **/
    floor: function () {

        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);

    },
 
    /**
    * Runs Math.floor() on the x, y, width and height values of this Rectangle.
    * @method Phaser.Rectangle#floorAll
    **/
    floorAll: function () {

        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        this.width = Math.floor(this.width);
        this.height = Math.floor(this.height);

    },

    /**
    * Copies the x, y, width and height properties from any given object to this Rectangle.
    * @method Phaser.Rectangle#copyFrom
    * @param {any} source - The object to copy from.
    * @return {Rectangle} This Rectangle object.
    **/
    copyFrom: function (source) {
        return this.setTo(source.x, source.y, source.width, source.height);
    },

    /**
    * Copies the x, y, width and height properties from this Rectangle to any given object.
    * @method Phaser.Rectangle#copyTo
    * @param {any} source - The object to copy to.
    * @return {object} This object.
    **/
    copyTo: function (dest) {

        dest.x = this.x;
        dest.y = this.y;
        dest.width = this.width;
        dest.height = this.height;

        return dest;

    },

    /**
    * Increases the size of the Rectangle object by the specified amounts. The center point of the Rectangle object stays the same, and its size increases to the left and right by the dx value, and to the top and the bottom by the dy value.
    * @method Phaser.Rectangle#inflate
    * @param {number} dx - The amount to be added to the left side of the Rectangle.
    * @param {number} dy - The amount to be added to the bottom side of the Rectangle.
    * @return {Phaser.Rectangle} This Rectangle object.
    */
    inflate: function (dx, dy) {
        return Phaser.Rectangle.inflate(this, dx, dy);
    },

    /**
    * The size of the Rectangle object, expressed as a Point object with the values of the width and height properties.
    * @method Phaser.Rectangle#size
    * @param {Phaser.Point} [output] - Optional Point object. If given the values will be set into the object, otherwise a brand new Point object will be created and returned.
    * @return {Phaser.Point} The size of the Rectangle object.
    */
    size: function (output) {
        return Phaser.Rectangle.size(this, output);
    },

    /**
    * Returns a new Rectangle object with the same values for the x, y, width, and height properties as the original Rectangle object.
    * @method Phaser.Rectangle#clone
    * @param {Phaser.Rectangle} [output] - Optional Rectangle object. If given the values will be set into the object, otherwise a brand new Rectangle object will be created and returned.
    * @return {Phaser.Rectangle} 
    */
    clone: function (output) {
        return Phaser.Rectangle.clone(this, output);
    },

    /**
    * Determines whether the specified coordinates are contained within the region defined by this Rectangle object.
    * @method Phaser.Rectangle#contains
    * @param {number} x - The x coordinate of the point to test.
    * @param {number} y - The y coordinate of the point to test.
    * @return {boolean} A value of true if the Rectangle object contains the specified point; otherwise false.
    */
    contains: function (x, y) {
        return Phaser.Rectangle.contains(this, x, y);
    },

    /**
    * Determines whether the first Rectangle object is fully contained within the second Rectangle object.
    * A Rectangle object is said to contain another if the second Rectangle object falls entirely within the boundaries of the first.
    * @method Phaser.Rectangle#containsRect
    * @param {Phaser.Rectangle} b - The second Rectangle object.
    * @return {boolean} A value of true if the Rectangle object contains the specified point; otherwise false.
    */
    containsRect: function (b) {
        return Phaser.Rectangle.containsRect(this, b);
    },

    /**
    * Determines whether the two Rectangles are equal.
    * This method compares the x, y, width and height properties of each Rectangle.
    * @method Phaser.Rectangle#equals
    * @param {Phaser.Rectangle} b - The second Rectangle object.
    * @return {boolean} A value of true if the two Rectangles have exactly the same values for the x, y, width and height properties; otherwise false.
    */
    equals: function (b) {
        return Phaser.Rectangle.equals(this, b);
    },

    /**
    * If the Rectangle object specified in the toIntersect parameter intersects with this Rectangle object, returns the area of intersection as a Rectangle object. If the Rectangles do not intersect, this method returns an empty Rectangle object with its properties set to 0.
    * @method Phaser.Rectangle#intersection
    * @param {Phaser.Rectangle} b - The second Rectangle object.
    * @param {Phaser.Rectangle} out - Optional Rectangle object. If given the intersection values will be set into this object, otherwise a brand new Rectangle object will be created and returned.
    * @return {Phaser.Rectangle} A Rectangle object that equals the area of intersection. If the Rectangles do not intersect, this method returns an empty Rectangle object; that is, a Rectangle with its x, y, width, and height properties set to 0.
    */
    intersection: function (b, out) {
        return Phaser.Rectangle.intersection(this, b, output);
    },

    /**
    * Determines whether the two Rectangles intersect with each other.
    * This method checks the x, y, width, and height properties of the Rectangles.
    * @method Phaser.Rectangle#intersects
    * @param {Phaser.Rectangle} b - The second Rectangle object.
    * @param {number} tolerance - A tolerance value to allow for an intersection test with padding, default to 0.
    * @return {boolean} A value of true if the specified object intersects with this Rectangle object; otherwise false.
    */
    intersects: function (b, tolerance) {
        return Phaser.Rectangle.intersects(this, b, tolerance);
    },

    /**
    * Determines whether the object specified intersects (overlaps) with the given values.
    * @method Phaser.Rectangle#intersectsRaw
    * @param {number} left - Description.
    * @param {number} right - Description.
    * @param {number} top - Description.
    * @param {number} bottomt - Description.
    * @param {number} tolerance - A tolerance value to allow for an intersection test with padding, default to 0
    * @return {boolean} A value of true if the specified object intersects with the Rectangle; otherwise false.
    */
    intersectsRaw: function (left, right, top, bottom, tolerance) {
        return Phaser.Rectangle.intersectsRaw(this, left, right, top, bottom, tolerance);
    },

    /**
    * Adds two Rectangles together to create a new Rectangle object, by filling in the horizontal and vertical space between the two Rectangles.
    * @method Phaser.Rectangle#union
    * @param {Phaser.Rectangle} b - The second Rectangle object.
    * @param {Phaser.Rectangle} [out] - Optional Rectangle object. If given the new values will be set into this object, otherwise a brand new Rectangle object will be created and returned.
    * @return {Phaser.Rectangle} A Rectangle object that is the union of the two Rectangles.
    */
    union: function (b, out) {
        return Phaser.Rectangle.union(this, b, out);
    },

    /**
    * Returns a string representation of this object.
    * @method Phaser.Rectangle#toString
    * @return {string} A string representation of the instance.
    **/
    toString: function () {
        return "[{Rectangle (x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + " empty=" + this.empty + ")}]";
    }

};

/**
* @name Phaser.Rectangle#halfWidth
* @property {number} halfWidth - Half of the width of the Rectangle.
* @readonly
*/
Object.defineProperty(Phaser.Rectangle.prototype, "halfWidth", {

    get: function () {
        return Math.round(this.width / 2);
    }

});

/**
* @name Phaser.Rectangle#halfHeight
* @property {number} halfHeight - Half of the height of the Rectangle.
* @readonly
*/
Object.defineProperty(Phaser.Rectangle.prototype, "halfHeight", {

    get: function () {
        return Math.round(this.height / 2);
    }

});

/**
* The sum of the y and height properties. Changing the bottom property of a Rectangle object has no effect on the x, y and width properties, but does change the height property.
* @name Phaser.Rectangle#bottom
* @property {number} bottom - The sum of the y and height properties.
*/
Object.defineProperty(Phaser.Rectangle.prototype, "bottom", {
    
    get: function () {
        return this.y + this.height;
    },
  
    set: function (value) {
        if (value <= this.y) {
            this.height = 0;
        } else {
            this.height = (this.y - value);
        }
    }

});

/**
* The location of the Rectangles bottom right corner as a Point object.
* @name Phaser.Rectangle#bottom
* @property {Phaser.Point} bottomRight - Gets or sets the location of the Rectangles bottom right corner as a Point object.
*/
Object.defineProperty(Phaser.Rectangle.prototype, "bottomRight", {
    
    get: function () {
        return new Phaser.Point(this.right, this.bottom);
    },

    set: function (value) {
        this.right = value.x;
        this.bottom = value.y;
    }

});

/**
* The x coordinate of the left of the Rectangle. Changing the left property of a Rectangle object has no effect on the y and height properties. However it does affect the width property, whereas changing the x value does not affect the width property.
* @name Phaser.Rectangle#left
* @property {number} left - The x coordinate of the left of the Rectangle.
*/
Object.defineProperty(Phaser.Rectangle.prototype, "left", {
   
    get: function () {
        return this.x;
    },

    set: function (value) {
        if (value >= this.right) {
            this.width = 0;
        } else {
            this.width = this.right - value;
        }
        this.x = value;
    }

});

/**
* The sum of the x and width properties. Changing the right property of a Rectangle object has no effect on the x, y and height properties, however it does affect the width property.
* @name Phaser.Rectangle#right
* @property {number} right - The sum of the x and width properties.
*/
Object.defineProperty(Phaser.Rectangle.prototype, "right", {
       
    get: function () {
        return this.x + this.width;
    },

    set: function (value) {
        if (value <= this.x) {
            this.width = 0;
        } else {
            this.width = this.x + value;
        }
    }

});

/**
* The volume of the Rectangle derived from width * height.
* @name Phaser.Rectangle#volume
* @property {number} volume - The volume of the Rectangle derived from width * height.
* @readonly
*/
Object.defineProperty(Phaser.Rectangle.prototype, "volume", {
    
    get: function () {
        return this.width * this.height;
    }

});

/**
* The perimeter size of the Rectangle. This is the sum of all 4 sides.
* @name Phaser.Rectangle#perimeter
* @property {number} perimeter - The perimeter size of the Rectangle. This is the sum of all 4 sides.
* @readonly
*/
Object.defineProperty(Phaser.Rectangle.prototype, "perimeter", {
    
    get: function () {
        return (this.width * 2) + (this.height * 2);
    }

});

/**
* The x coordinate of the center of the Rectangle.
* @name Phaser.Rectangle#centerX
* @property {number} centerX - The x coordinate of the center of the Rectangle.
*/
Object.defineProperty(Phaser.Rectangle.prototype, "centerX", {
    
    get: function () {
        return this.x + this.halfWidth;
    },

    set: function (value) {
        this.x = value - this.halfWidth;
    }

});

/**
* The y coordinate of the center of the Rectangle.
* @name Phaser.Rectangle#centerY
* @property {number} centerY - The y coordinate of the center of the Rectangle.
*/
Object.defineProperty(Phaser.Rectangle.prototype, "centerY", {
    
    get: function () {
        return this.y + this.halfHeight;
    },

    set: function (value) {
        this.y = value - this.halfHeight;
    }

});

/**
* The y coordinate of the top of the Rectangle. Changing the top property of a Rectangle object has no effect on the x and width properties.
* However it does affect the height property, whereas changing the y value does not affect the height property.
* @name Phaser.Rectangle#top
* @property {number} top - The y coordinate of the top of the Rectangle.
*/
Object.defineProperty(Phaser.Rectangle.prototype, "top", {
    
    get: function () {
        return this.y;
    },

    set: function (value) {
        if (value >= this.bottom) {
            this.height = 0;
            this.y = value;
        } else {
            this.height = (this.bottom - value);
        }
    }

});

/**
* The location of the Rectangles top left corner as a Point object.
* @name Phaser.Rectangle#topLeft
* @property {Phaser.Point} topLeft - The location of the Rectangles top left corner as a Point object.
*/
Object.defineProperty(Phaser.Rectangle.prototype, "topLeft", {

    get: function () {
        return new Phaser.Point(this.x, this.y);
    },
    
    set: function (value) {
        this.x = value.x;
        this.y = value.y;
    }

});

/**
* Determines whether or not this Rectangle object is empty. A Rectangle object is empty if its width or height is less than or equal to 0.
* If set to true then all of the Rectangle properties are set to 0. 
* @name Phaser.Rectangle#empty
* @property {boolean} empty - Gets or sets the Rectangles empty state.
*/
Object.defineProperty(Phaser.Rectangle.prototype, "empty", {
    
    get: function () {
        return (!this.width || !this.height);
    },

    set: function (value) {
        this.setTo(0, 0, 0, 0);
    }

});

/**
* Increases the size of the Rectangle object by the specified amounts. The center point of the Rectangle object stays the same, and its size increases to the left and right by the dx value, and to the top and the bottom by the dy value.
* @method Phaser.Rectangle.inflate
* @param {Phaser.Rectangle} a - The Rectangle object.
* @param {number} dx - The amount to be added to the left side of the Rectangle.
* @param {number} dy - The amount to be added to the bottom side of the Rectangle.
* @return {Phaser.Rectangle} This Rectangle object.
*/
Phaser.Rectangle.inflate = function (a, dx, dy) {
    a.x -= dx;
    a.width += 2 * dx;
    a.y -= dy;
    a.height += 2 * dy;
    return a;
};

/**
* Increases the size of the Rectangle object. This method is similar to the Rectangle.inflate() method except it takes a Point object as a parameter.
* @method Phaser.Rectangle.inflatePoint
* @param {Phaser.Rectangle} a - The Rectangle object.
* @param {Phaser.Point} point - The x property of this Point object is used to increase the horizontal dimension of the Rectangle object. The y property is used to increase the vertical dimension of the Rectangle object.
* @return {Phaser.Rectangle} The Rectangle object.
*/
Phaser.Rectangle.inflatePoint = function (a, point) {
    return Phaser.Rectangle.inflate(a, point.x, point.y);
};

/**
* The size of the Rectangle object, expressed as a Point object with the values of the width and height properties.
* @method Phaser.Rectangle.size
* @param {Phaser.Rectangle} a - The Rectangle object.
* @param {Phaser.Point} [output] - Optional Point object. If given the values will be set into the object, otherwise a brand new Point object will be created and returned.
* @return {Phaser.Point} The size of the Rectangle object
*/
Phaser.Rectangle.size = function (a, output) {
    if (typeof output === "undefined") { output = new Phaser.Point(); }
    return output.setTo(a.width, a.height);
};

/**
* Returns a new Rectangle object with the same values for the x, y, width, and height properties as the original Rectangle object.
* @method Phaser.Rectangle.clone
* @param {Phaser.Rectangle} a - The Rectangle object.
* @param {Phaser.Rectangle} [output] - Optional Rectangle object. If given the values will be set into the object, otherwise a brand new Rectangle object will be created and returned.
* @return {Phaser.Rectangle}
*/
Phaser.Rectangle.clone = function (a, output) {
    if (typeof output === "undefined") { output = new Phaser.Rectangle(); }
    return output.setTo(a.x, a.y, a.width, a.height);
};

/**
* Determines whether the specified coordinates are contained within the region defined by this Rectangle object.
* @method Phaser.Rectangle.contains
* @param {Phaser.Rectangle} a - The Rectangle object.
* @param {number} x - The x coordinate of the point to test.
* @param {number} y - The y coordinate of the point to test.
* @return {boolean} A value of true if the Rectangle object contains the specified point; otherwise false.
*/
Phaser.Rectangle.contains = function (a, x, y) {
    return (x >= a.x && x <= a.right && y >= a.y && y <= a.bottom);
};

Phaser.Rectangle.containsRaw = function (rx, ry, rw, rh, x, y) {
    return (x >= rx && x <= (rx + rw) && y >= ry && y <= (ry + rh));
};

/**
* Determines whether the specified point is contained within the rectangular region defined by this Rectangle object. This method is similar to the Rectangle.contains() method, except that it takes a Point object as a parameter.
* @method Phaser.Rectangle.containsPoint
* @param {Phaser.Rectangle} a - The Rectangle object.
* @param {Phaser.Point} point - The point object being checked. Can be Point or any object with .x and .y values.
* @return {boolean} A value of true if the Rectangle object contains the specified point; otherwise false.
*/
Phaser.Rectangle.containsPoint = function (a, point) {
    return Phaser.Rectangle.contains(a, point.x, point.y);
};

/**
* Determines whether the first Rectangle object is fully contained within the second Rectangle object.
* A Rectangle object is said to contain another if the second Rectangle object falls entirely within the boundaries of the first.
* @method Phaser.Rectangle.containsRect
* @param {Phaser.Rectangle} a - The first Rectangle object.
* @param {Phaser.Rectangle} b - The second Rectangle object.
* @return {boolean} A value of true if the Rectangle object contains the specified point; otherwise false.
*/
Phaser.Rectangle.containsRect = function (a, b) {

    //  If the given rect has a larger volume than this one then it can never contain it
    if (a.volume > b.volume)
    {
        return false;
    }

    return (a.x >= b.x && a.y >= b.y && a.right <= b.right && a.bottom <= b.bottom);

};

/**
* Determines whether the two Rectangles are equal.
* This method compares the x, y, width and height properties of each Rectangle.
* @method Phaser.Rectangle.equals
* @param {Phaser.Rectangle} a - The first Rectangle object.
* @param {Phaser.Rectangle} b - The second Rectangle object.
* @return {boolean} A value of true if the two Rectangles have exactly the same values for the x, y, width and height properties; otherwise false.
*/
Phaser.Rectangle.equals = function (a, b) {
    return (a.x == b.x && a.y == b.y && a.width == b.width && a.height == b.height);
};

/**
* If the Rectangle object specified in the toIntersect parameter intersects with this Rectangle object, returns the area of intersection as a Rectangle object. If the Rectangles do not intersect, this method returns an empty Rectangle object with its properties set to 0.
* @method Phaser.Rectangle.intersection
* @param {Phaser.Rectangle} a - The first Rectangle object.
* @param {Phaser.Rectangle} b - The second Rectangle object.
* @param {Phaser.Rectangle} [out] - Optional Rectangle object. If given the intersection values will be set into this object, otherwise a brand new Rectangle object will be created and returned.
* @return {Phaser.Rectangle} A Rectangle object that equals the area of intersection. If the Rectangles do not intersect, this method returns an empty Rectangle object; that is, a Rectangle with its x, y, width, and height properties set to 0.
*/
Phaser.Rectangle.intersection = function (a, b, out) {

    out  = out || new Phaser.Rectangle;

    if (Phaser.Rectangle.intersects(a, b))
    {
        out.x = Math.max(a.x, b.x);
        out.y = Math.max(a.y, b.y);
        out.width = Math.min(a.right, b.right) - out.x;
        out.height = Math.min(a.bottom, b.bottom) - out.y;
    }

    return out;

};

/**
* Determines whether the two Rectangles intersect with each other.
* This method checks the x, y, width, and height properties of the Rectangles.
* @method Phaser.Rectangle.intersects
* @param {Phaser.Rectangle} a - The first Rectangle object.
* @param {Phaser.Rectangle} b - The second Rectangle object.
* @return {boolean} A value of true if the specified object intersects with this Rectangle object; otherwise false.
*/
Phaser.Rectangle.intersects = function (a, b) {

    return (a.x < b.right && b.x < a.right && a.y < b.bottom && b.y < a.bottom);

    // return (a.x <= b.right && b.x <= a.right && a.y <= b.bottom && b.y <= a.bottom);

    // return (a.left <= b.right && b.left <= a.right && a.top <= b.bottom && b.top <= a.bottom);
    // return !(a.x > b.right + tolerance || a.right < b.x - tolerance || a.y > b.bottom + tolerance || a.bottom < b.y - tolerance);

};

/**
* Determines whether the object specified intersects (overlaps) with the given values.
* @method Phaser.Rectangle.intersectsRaw
* @param {number} left - Description.
* @param {number} right - Description.
* @param {number} top - Description.
* @param {number} bottom - Description.
* @param {number} tolerance - A tolerance value to allow for an intersection test with padding, default to 0
* @return {boolean} A value of true if the specified object intersects with the Rectangle; otherwise false.
*/
Phaser.Rectangle.intersectsRaw = function (a, left, right, top, bottom, tolerance) {

    if (typeof tolerance === "undefined") { tolerance = 0; }

    return !(left > a.right + tolerance || right < a.left - tolerance || top > a.bottom + tolerance || bottom < a.top - tolerance);

};

/**
* Adds two Rectangles together to create a new Rectangle object, by filling in the horizontal and vertical space between the two Rectangles.
* @method Phaser.Rectangle.union
* @param {Phaser.Rectangle} a - The first Rectangle object.
* @param {Phaser.Rectangle} b - The second Rectangle object.
* @param {Phaser.Rectangle} [out] - Optional Rectangle object. If given the new values will be set into this object, otherwise a brand new Rectangle object will be created and returned.
* @return {Phaser.Rectangle} A Rectangle object that is the union of the two Rectangles.
*/
Phaser.Rectangle.union = function (a, b, out) {

    if (typeof out === "undefined") { out = new Phaser.Rectangle(); }

    return out.setTo(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.max(a.right, b.right) - Math.min(a.left, b.left), Math.max(a.bottom, b.bottom) - Math.min(a.top, b.top));
    
};

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Description of Phaser.Net
*
* @class Phaser.Net
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
*/
Phaser.Net = function (game) {
	
	this.game = game;

};

Phaser.Net.prototype = {

	/**
	* Returns the hostname given by the browser.
	* 
	* @method Phaser.Net#getHostName
	* @return {string}
	*/        
	getHostName: function () {

		if (window.location && window.location.hostname) {
			return window.location.hostname;
		}

		return null;

	},

	/**
	* Compares the given domain name against the hostname of the browser containing the game.
	* If the domain name is found it returns true.
	* You can specify a part of a domain, for example 'google' would match 'google.com', 'google.co.uk', etc.
	* Do not include 'http://' at the start.
	* 
	* @method Phaser.Net#checkDomainName
	* @param {string} domain
	* @return {boolean}
	*/        
	checkDomainName: function (domain) {
		return window.location.hostname.indexOf(domain) !== -1;
	},

	/**
	* Updates a value on the Query String and returns it in full.
	* If the value doesn't already exist it is set.
	* If the value exists it is replaced with the new value given. If you don't provide a new value it is removed from the query string.
	* Optionally you can redirect to the new url, or just return it as a string.
	* 
	* @method Phaser.Net#updateQueryString
	* @param {string} key - The querystring key to update.
	* @param {string} value - The new value to be set. If it already exists it will be replaced.
	* @param {boolean} redirect - If true the browser will issue a redirect to the url with the new querystring.
	* @param {string} url - The URL to modify. If none is given it uses window.location.href.
	* @return {string} If redirect is false then the modified url and query string is returned.
	*/
	updateQueryString: function (key, value, redirect, url) {

		if (typeof redirect === "undefined") { redirect = false; }
		if (typeof url === "undefined") { url = ''; }

		if (url == '') {
			url = window.location.href;
		}

		var output = '';
		var re = new RegExp("([?|&])" + key + "=.*?(&|#|$)(.*)", "gi");
		
		if (re.test(url))
		{
			if (typeof value !== 'undefined' && value !== null)
			{
				output = url.replace(re, '$1' + key + "=" + value + '$2$3');
			}
			else
			{
				output = url.replace(re, '$1$3').replace(/(&|\?)$/, '');
			}
		}
		else
		{
			if (typeof value !== 'undefined' && value !== null)
			{
				var separator = url.indexOf('?') !== -1 ? '&' : '?';
				var hash = url.split('#');
				url = hash[0] + separator + key + '=' + value;

				if (hash[1]) {
					url += '#' + hash[1];
				}

				output = url;

			}
			else
			{
				output = url;
			}
		}

		if (redirect)
		{
			window.location.href = output;
		}
		else
		{
			return output;
		}

	},

	/**
	* Returns the Query String as an object.
	* If you specify a parameter it will return just the value of that parameter, should it exist.
	* 
	* @method Phaser.Net#getQueryString
	* @param {string} [parameter=''] - If specified this will return just the value for that key.
	* @return {string|object} An object containing the key value pairs found in the query string or just the value if a parameter was given.
	*/
	getQueryString: function (parameter) {

		if (typeof parameter === "undefined") { parameter = ''; }

		var output = {};
		var keyValues = location.search.substring(1).split('&');

		for (var i in keyValues) {

			var key = keyValues[i].split('=');

			if (key.length > 1)
			{
				if (parameter && parameter == this.decodeURI(key[0]))
				{
					return this.decodeURI(key[1]);
				}
				else
				{
					output[this.decodeURI(key[0])] = this.decodeURI(key[1]);
				}
			}
		}

		return output;

	},

	/**
	* Returns the Query String as an object.
	* If you specify a parameter it will return just the value of that parameter, should it exist.
	* 
	* @method Phaser.Net#decodeURI
	* @param {string} value - The URI component to be decoded.
	* @return {string} The decoded value.
	*/
	decodeURI: function (value) {
		return decodeURIComponent(value.replace(/\+/g, " "));
	}

};

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Phaser - TweenManager
* 
* @class Phaser.TweenManager
* @classdesc 
* Phaser.Game has a single instance of the TweenManager through which all Tween objects are created and updated.
* Tweens are hooked into the game clock and pause system, adjusting based on the game state.
*
* TweenManager is based heavily on tween.js by http://soledadpenades.com.
* The difference being that tweens belong to a games instance of TweenManager, rather than to a global TWEEN object.
* It also has callbacks swapped for Signals and a few issues patched with regard to properties and completion errors.
* Please see https://github.com/sole/tween.js for a full list of contributors.
* @constructor
*
* @param {Phaser.Game} game - A reference to the currently running game.
*/
Phaser.TweenManager = function (game) {

	/**
	* @property {Phaser.Game} game - Local reference to game.
	*/
	this.game = game;
	
	/**
	* @property {array} _tweens - Description.
	* @private
	*/
	this._tweens = [];
	
	/**
	* @property {array} _add - Description.
	* @private
	*/
	this._add = [];

	this.game.onPause.add(this.pauseAll, this);
	this.game.onResume.add(this.resumeAll, this);

};

Phaser.TweenManager.prototype = {

	/**
	* Version number of this library.
	* @property {string} REVISION
	* @default 
	*/	
	REVISION: '11dev',

	/**
	* Get all the tween objects in an array.
	* @method Phaser.TweenManager#getAll
	* @returns {Phaser.Tween[]} Array with all tween objects.
	*/
	getAll: function () {

		return this._tweens;

	},

	/**
	* Remove all tween objects.
	* @method Phaser.TweenManager#removeAll
	*/
	removeAll: function () {

		this._tweens = [];

	},

	/**
	* Add a new tween into the TweenManager.
	*
	* @method Phaser.TweenManager#add
	* @param {Phaser.Tween} tween - The tween object you want to add.
	* @returns {Phaser.Tween} The tween object you added to the manager.
	*/
	add: function ( tween ) {

		this._add.push( tween );

	},

	/**
	* Create a tween object for a specific object. The object can be any JavaScript object or Phaser object such as Sprite. 
	*
	* @method Phaser.TweenManager#create
	* @param {Object} object - Object the tween will be run on.
	* @returns {Phaser.Tween} The newly created tween object.
	*/
    create: function (object) {

        return new Phaser.Tween(object, this.game);

    },

	/**
	* Remove a tween from this manager.
	*
	* @method Phaser.TweenManager#remove
	* @param {Phaser.Tween} tween - The tween object you want to remove.
	*/
	remove: function ( tween ) {

		var i = this._tweens.indexOf( tween );

		if ( i !== -1 ) {

			this._tweens[i].pendingDelete = true;

		}

	},

	/**
	* Update all the tween objects you added to this manager.
	*
	* @method Phaser.TweenManager#update
	* @returns {boolean} Return false if there's no tween to update, otherwise return true.
	*/
	update: function () {

		if ( this._tweens.length === 0 && this._add.length === 0 ) return false;

		var i = 0;
		var numTweens = this._tweens.length;

		while ( i < numTweens ) {

			if ( this._tweens[ i ].update( this.game.time.now ) ) {

				i++;

			} else {

				this._tweens.splice( i, 1 );

				numTweens--;

			}

		}

		//	If there are any new tweens to be added, do so now - otherwise they can be spliced out of the array before ever running
		if (this._add.length > 0)
		{
			this._tweens = this._tweens.concat(this._add);
			this._add.length = 0;
		}

		return true;

	},

	/**
	* Checks to see if a particular Sprite is currently being tweened.
	*
	* @method Phaser.TweenManager#isTweening
	* @param {object} object - The object to check for tweens against.
	* @returns {boolean} Returns true if the object is currently being tweened, false if not.
	*/
	isTweening: function(object) {	

		return this._tweens.some(function(tween) {
			return tween._object === object;
		});

	},

	/**
	* Pauses all currently running tweens.
	*
	* @method Phaser.TweenManager#update
	*/
	pauseAll: function () {

    	for (var i = this._tweens.length - 1; i >= 0; i--) {
    		this._tweens[i].pause();
    	};

    },

	/**
	* Pauses all currently paused tweens.
	*
	* @method Phaser.TweenManager#resumeAll
	*/
   	resumeAll: function () {

    	for (var i = this._tweens.length - 1; i >= 0; i--) {
    		this._tweens[i].resume();
    	};

    }

};
/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Tween constructor
* Create a new <code>Tween</code>.
*
* @class Phaser.Tween
* @constructor
* @param {object} object - Target object will be affected by this tween.
* @param {Phaser.Game} game - Current game instance.
*/
Phaser.Tween = function (object, game) {

    /**
    * Reference to the target object.
    * @property {object} _object
    * @private
    */
	this._object = object;

    /**
    * @property {Phaser.Game} game - A reference to the currently running Game.
    */
    this.game = game;

    /**
    * @property {object} _manager - Description.
    * @private
    */
    this._manager = this.game.tweens;

    /**
    * @property {object} _valuesStart - Description.
    * @private
    */
    this._valuesStart = {};

    /**
    * @property {object} _valuesEnd - Description.
    * @private
    */
    this._valuesEnd = {};

    /**
    * @property {object} _valuesStartRepeat - Description.
    * @private
    */
    this._valuesStartRepeat = {};

    /**
    * @property {number} _duration - Description.
    * @private
    * @default
    */
    this._duration = 1000;

    /**
    * @property {number} _repeat - Description.
    * @private
    * @default
    */
    this._repeat = 0;

    /**
    * @property {boolean} _yoyo - Description.
    * @private
    * @default
    */
    this._yoyo = false;

    /**
    * @property {boolean} _reversed - Description.
    * @private
    * @default
    */
    this._reversed = false;

    /**
    * @property {number} _delayTime - Description.
    * @private
    * @default
    */
    this._delayTime = 0;

    /**
    * @property {Description} _startTime - Description.
    * @private
    * @default null
    */
    this._startTime = null;

    /**
    * @property {Description} _easingFunction - Description.
    * @private
    */
    this._easingFunction = Phaser.Easing.Linear.None;

    /**
    * @property {Description} _interpolationFunction - Description.
    * @private
    */
    this._interpolationFunction = Phaser.Math.linearInterpolation;

    /**
    * @property {Description} _chainedTweens - Description.
    * @private
    */
    this._chainedTweens = [];

    /**
    * @property {Description} _onStartCallback - Description.
    * @private
    * @default
    */
    this._onStartCallback = null;

    /**
    * @property {boolean} _onStartCallbackFired - Description.
    * @private
    * @default
    */
    this._onStartCallbackFired = false;

    /**
    * @property {Description} _onUpdateCallback - Description.
    * @private
    * @default null
    */
    this._onUpdateCallback = null;

    /**
    * @property {Description} _onCompleteCallback - Description.
    * @private
    * @default null
    */
    this._onCompleteCallback = null;
    
    /**
    * @property {number} _pausedTime - Description.
    * @private
    * @default
    */
    this._pausedTime = 0;

    /**
    * @property {boolean} pendingDelete - If this tween is ready to be deleted by the TweenManager.
    * @default
    */
    this.pendingDelete = false;

    // Set all starting values present on the target object
    for ( var field in object ) {
    	this._valuesStart[ field ] = parseFloat(object[field], 10);
    }
    
    /**
    * @property {Phaser.Signal} onStart - Description.
    */
    this.onStart = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onComplete - Description.
    */
    this.onComplete = new Phaser.Signal();

    /**
    * @property {boolean} isRunning - Description.
    * @default
    */
    this.isRunning = false;

};

Phaser.Tween.prototype = {

	/**
	* Configure the Tween
	*
	* @method Phaser.Tween#to
	* @param {object} properties - Properties you want to tween.
	* @param {number} duration - Duration of this tween.
	* @param {function} ease - Easing function.
	* @param {boolean} autoStart - Whether this tween will start automatically or not.
	* @param {number} delay - Delay before this tween will start, defaults to 0 (no delay).
	* @param {boolean} repeat - Should the tween automatically restart once complete? (ignores any chained tweens).
	* @param {Phaser.Tween} yoyo - Description.
	* @return {Phaser.Tween} Itself.
	*/
	to: function ( properties, duration, ease, autoStart, delay, repeat, yoyo ) {

		duration = duration || 1000;
		ease = ease || null;
		autoStart = autoStart || false;
		delay = delay || 0;
		repeat = repeat || 0;
		yoyo = yoyo || false;

		var self;
		if (this._parent)
		{
			self = this._manager.create(this._object);
			this._lastChild.chain(self);
			this._lastChild = self;
		}
		else
		{
			self = this;
			this._parent = this;
			this._lastChild = this;
		}

		self._repeat = repeat;
        self._duration = duration;
		self._valuesEnd = properties;

        if (ease !== null)
        {
            self._easingFunction = ease;
        }

        if (delay > 0)
        {
            self._delayTime = delay;
        }

        self._yoyo = yoyo;

        if (autoStart) {
            return this.start();
        } else {
            return this;
        }

	},

	/**
	* Starts the tween running. Can also be called by the autoStart parameter of Tween.to.
	*
	* @method Phaser.Tween#start
	* @param {number} time - Description.
	* @return {Phaser.Tween} Itself.
	*/
	start: function ( time ) {

        if (this.game === null || this._object === null) {
            return;
        }

		this._manager.add(this);

		this.onStart.dispatch(this._object);

        this.isRunning = true;

		this._onStartCallbackFired = false;

        this._startTime = this.game.time.now + this._delayTime;

		for ( var property in this._valuesEnd ) {

			// check if an Array was provided as property value
			if ( this._valuesEnd[ property ] instanceof Array ) {

				if ( this._valuesEnd[ property ].length === 0 ) {

					continue;

				}

				// create a local copy of the Array with the start value at the front
				this._valuesEnd[ property ] = [ this._object[ property ] ].concat( this._valuesEnd[ property ] );

			}

			this._valuesStart[ property ] = this._object[ property ];

			if ( ( this._valuesStart[ property ] instanceof Array ) === false ) {
				this._valuesStart[ property ] *= 1.0; // Ensures we're using numbers, not strings
			}

			this._valuesStartRepeat[ property ] = this._valuesStart[ property ] || 0;

		}

		return this;

	},

	/**
	* Stops the tween if running and removes it from the TweenManager. If there are any onComplete callbacks or events they are not dispatched.
	*
	* @method Phaser.Tween#stop
	* @return {Phaser.Tween} Itself.
	*/
	stop: function () {

        this.isRunning = false;

		this._manager.remove(this);

		return this;

	},

	/**
	* Sets a delay time before this tween will start.
	*
	* @method Phaser.Tween#delay
	* @param {number} amount - The amount of the delay in ms.
	* @return {Phaser.Tween} Itself.
	*/
	delay: function ( amount ) {

		this._delayTime = amount;
		return this;

	},

	/**
	* Sets the number of times this tween will repeat.
	*
	* @method Phaser.Tween#repeat
	* @param {number} times - How many times to repeat.
	* @return {Phaser.Tween} Itself.
	*/
	repeat: function ( times ) {

		this._repeat = times;
		return this;

	},

	/**
	* A tween that has yoyo set to true will run through from start to finish, then reverse from finish to start.
	* Used in combination with repeat you can create endless loops.
	*
	* @method Phaser.Tween#yoyo
	* @param {boolean} yoyo - Set to true to yoyo this tween.
	* @return {Phaser.Tween} Itself.
	*/
	yoyo: function( yoyo ) {

		this._yoyo = yoyo;
		return this;

	},

	/**
	* Set easing function this tween will use, i.e. Phaser.Easing.Linear.None. 
	*
	* @method Phaser.Tween#easing
	* @param {function} easing - The easing function this tween will use, i.e. Phaser.Easing.Linear.None.
	* @return {Phaser.Tween} Itself.
	*/
	easing: function ( easing ) {

		this._easingFunction = easing;
		return this;

	},

	/**
	* Set interpolation function the tween will use, by default it uses Phaser.Math.linearInterpolation.
	*
	* @method Phaser.Tween#interpolation
	* @param {function} interpolation - The interpolation function to use (Phaser.Math.linearInterpolation by default)
	* @return {Phaser.Tween} Itself.
	*/
	interpolation: function ( interpolation ) {

		this._interpolationFunction = interpolation;
		return this;

	},

	/**
	* You can chain tweens together by passing a reference to the chain function. This enables one tween to call another on completion.
	* You can pass as many tweens as you like to this function, they will each be chained in sequence.
	*
	* @method Phaser.Tween#chain
	* @return {Phaser.Tween} Itself.
	*/
	chain: function () {

		this._chainedTweens = arguments;
		return this;

	},

	/**
	* Loop a chain of tweens
	* 
	* Usage:
	* game.add.tween(p).to({ x: 700 }, 1000, Phaser.Easing.Linear.None, true)
	* .to({ y: 300 }, 1000, Phaser.Easing.Linear.None)
	* .to({ x: 0 }, 1000, Phaser.Easing.Linear.None)
	* .to({ y: 0 }, 1000, Phaser.Easing.Linear.None)
	* .loop();
	* @method Phaser.Tween#loop
	* @return {Phaser.Tween} Itself.
	*/
	loop: function() {

		this._lastChild.chain(this);
		return this;

	},

	/**
	* Sets a callback to be fired when the tween starts. Note: callback will be called in the context of the global scope.
	*
	* @method Phaser.Tween#onStartCallback
	* @param {function} callback - The callback to invoke on start.
	* @return {Phaser.Tween} Itself.
	*/
	onStartCallback: function ( callback ) {

		this._onStartCallback = callback;
		return this;

	},

	/**
	* Sets a callback to be fired each time this tween updates. Note: callback will be called in the context of the global scope.
	*
	* @method Phaser.Tween#onUpdateCallback
	* @param {function} callback - The callback to invoke each time this tween is updated.
	* @return {Phaser.Tween} Itself.
	*/
	onUpdateCallback: function ( callback ) {

		this._onUpdateCallback = callback;
		return this;

	},

	/**
	* Sets a callback to be fired when the tween completes. Note: callback will be called in the context of the global scope.
	*
	* @method Phaser.Tween#onCompleteCallback
	* @param {function} callback - The callback to invoke on completion.
	* @return {Phaser.Tween} Itself.
	*/
	onCompleteCallback: function ( callback ) {

		this._onCompleteCallback = callback;
		return this;

	},

	/**
	* Pauses the tween. 
	*
	* @method Phaser.Tween#pause
	*/
    pause: function () {
        this._paused = true;
        this._pausedTime = this.game.time.now;
    },

	/**
	* Resumes a paused tween.
	*
	* @method Phaser.Tween#resume
	*/
    resume: function () {
        this._paused = false;
        this._startTime += (this.game.time.now - this._pausedTime);
    },

	/**
	* Core tween update function called by the TweenManager. Does not need to be invoked directly.
	*
	* @method Phaser.Tween#update
	* @param {number} time - A timestamp passed in by the TweenManager.
	* @return {boolean} false if the tween has completed and should be deleted from the manager, otherwise true (still active).
	*/
	update: function ( time ) {

		if (this.pendingDelete)
		{
			return false;
		}

        if (this._paused || time < this._startTime) {

            return true;

        }

		var property;

		if ( time < this._startTime ) {

			return true;

		}

		if ( this._onStartCallbackFired === false ) {

			if ( this._onStartCallback !== null ) {

				this._onStartCallback.call( this._object );

			}

			this._onStartCallbackFired = true;

		}

		var elapsed = ( time - this._startTime ) / this._duration;
		elapsed = elapsed > 1 ? 1 : elapsed;

		var value = this._easingFunction( elapsed );

		for ( property in this._valuesEnd ) {

			var start = this._valuesStart[ property ] || 0;
			var end = this._valuesEnd[ property ];

			if ( end instanceof Array ) {

				this._object[ property ] = this._interpolationFunction( end, value );

			} else {

                // Parses relative end values with start as base (e.g.: +10, -3)
				if ( typeof(end) === "string" ) {
					end = start + parseFloat(end, 10);
				}

				// protect against non numeric properties.
                if ( typeof(end) === "number" ) {
					this._object[ property ] = start + ( end - start ) * value;
				}

			}

		}

		if ( this._onUpdateCallback !== null ) {

			this._onUpdateCallback.call( this._object, value );

		}

		if ( elapsed == 1 ) {

			if ( this._repeat > 0 ) {

				if ( isFinite( this._repeat ) ) {
					this._repeat--;
				}

				// reassign starting values, restart by making startTime = now
				for ( property in this._valuesStartRepeat ) {

					if ( typeof( this._valuesEnd[ property ] ) === "string" ) {
						this._valuesStartRepeat[ property ] = this._valuesStartRepeat[ property ] + parseFloat(this._valuesEnd[ property ], 10);
					}

					if (this._yoyo) {
						var tmp = this._valuesStartRepeat[ property ];
						this._valuesStartRepeat[ property ] = this._valuesEnd[ property ];
						this._valuesEnd[ property ] = tmp;
						this._reversed = !this._reversed;
					}
					this._valuesStart[ property ] = this._valuesStartRepeat[ property ];

				}

				this._startTime = time + this._delayTime;

				this.onComplete.dispatch(this._object);

				if ( this._onCompleteCallback !== null ) {
					this._onCompleteCallback.call( this._object );
				}

				return true;

			} else {

				this.onComplete.dispatch(this._object);

				if ( this._onCompleteCallback !== null ) {
					this._onCompleteCallback.call( this._object );
				}

				for ( var i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i ++ ) {

					this._chainedTweens[ i ].start( time );

				}

				return false;

			}

		}

		return true;

	}
	
};

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A collection of easing methods defining ease-in ease-out curves.
*
* @class Phaser.Easing
*/
Phaser.Easing = {

    /**
    * Linear easing.
    *
    * @class Phaser.Easing.Linear
    */
	Linear: {

		/**
		* Ease-in.
		*
		* @method Phaser.Easing.Linear#In 
		* @param {number} k - The value to be tweened.
		* @returns {number} k^2.
		*/
		None: function ( k ) {

			return k;

		}

	},

    /**
    * Quadratic easing.
    *
    * @class Phaser.Easing.Quadratic
    */
	Quadratic: {

		/**
		* Ease-in.
		*
		* @method Phaser.Easing.Quadratic#In 
		* @param {number} k - The value to be tweened. 
		* @returns {number} k^2.
		*/
		In: function ( k ) {

			return k * k;

		},

		/**
		* Ease-out.
		*
		* @method Phaser.Easing.Quadratic#Out 
		* @param {number} k - The value to be tweened. 
		* @returns {number} k* (2-k).
		*/
		Out: function ( k ) {

			return k * ( 2 - k );

		},

		/**
		* Ease-in/out.
		*
		* @method Phaser.Easing.Quadratic#InOut
		* @param {number} k - The value to be tweened. 
		* @returns {number} The tweened value.
		*/
		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1 ) return 0.5 * k * k;
			return - 0.5 * ( --k * ( k - 2 ) - 1 );

		}

	},

    /**
    * Cubic easing.
    *
    * @class Phaser.Easing.Cubic
    */
	Cubic: {

		/**
		* Cubic ease-in.
		*
		* @method Phaser.Easing.Cubic#In 
		* @param {number} k - The value to be tweened. 
		* @returns {number} The tweened value.
		*/
		In: function ( k ) {

			return k * k * k;

		},

		/**
		* Cubic ease-out.
		*
		* @method Phaser.Easing.Cubic#Out
		* @param {number} k - The value to be tweened. 
		* @returns {number} The tweened value.
		*/
		Out: function ( k ) {

			return --k * k * k + 1;

		},

		/**
		* Cubic ease-in/out.
		*
		* @method Phaser.Easing.Cubic#InOut
		* @param {number} k - The value to be tweened. 
		* @returns {number} The tweened value.
		*/
		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k;
			return 0.5 * ( ( k -= 2 ) * k * k + 2 );

		}

	},

    /**
    * Quartic easing.
    *
    * @class Phaser.Easing.Quartic
    */
	Quartic: {

		/**
		* Quartic ease-in.
		*
		* @method Phaser.Easing.Quartic#In 
		* @param {number} k - The value to be tweened. 
		* @returns {number} The tweened value.
		*/
		In: function ( k ) {

			return k * k * k * k;

		},

		/**
		* Quartic ease-out.
		*
		* @method Phaser.Easing.Quartic#Out
		* @param {number} k - The value to be tweened. 
		* @returns {number} The tweened value.
		*/
		Out: function ( k ) {

			return 1 - ( --k * k * k * k );

		},

		/**
		* Quartic ease-in/out.
		*
		* @method Phaser.Easing.Quartic#InOut
		* @param {number} k - The value to be tweened. 
		* @returns {number} The tweened value.
		*/
		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1) return 0.5 * k * k * k * k;
			return - 0.5 * ( ( k -= 2 ) * k * k * k - 2 );

		}

	},

    /**
    * Quintic easing.
    *
    * @class Phaser.Easing.Quintic
    */
	Quintic: {

		/**
		* Quintic ease-in.
		*
		* @method Phaser.Easing.Quintic#In 
		* @param {number} k - The value to be tweened. 
		* @returns {number} The tweened value.
		*/
		In: function ( k ) {

			return k * k * k * k * k;

		},

		/**
		* Quintic ease-out.
		*
		* @method Phaser.Easing.Quintic#Out
		* @param {number} k - The value to be tweened. 
		* @returns {number} The tweened value.
		*/
		Out: function ( k ) {

			return --k * k * k * k * k + 1;

		},

		/**
		* Quintic ease-in/out.
		*
		* @method Phaser.Easing.Quintic#InOut
		* @param {number} k - The value to be tweened. 
		* @returns {number} The tweened value.
		*/
		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k * k * k;
			return 0.5 * ( ( k -= 2 ) * k * k * k * k + 2 );

		}

	},

    /**
    * Sinusoidal easing.
    *
    * @class Phaser.Easing.Sinusoidal
    */
	Sinusoidal: {

		/**
		* Sinusoidal ease-in.
		*
		* @method Phaser.Easing.Sinusoidal#In 
		* @param {number} k - The value to be tweened. 
		* @returns {number} The tweened value.
		*/
		In: function ( k ) {

			return 1 - Math.cos( k * Math.PI / 2 );

		},

		/**
		* Sinusoidal ease-out.
		*
		* @method Phaser.Easing.Sinusoidal#Out
		* @param {number} k - The value to be tweened. 
		* @returns {number} The tweened value.
		*/
		Out: function ( k ) {

			return Math.sin( k * Math.PI / 2 );

		},

		/**
		* Sinusoidal ease-in/out.
		*
		* @method Phaser.Easing.Sinusoidal#InOut
		* @param {number} k - The value to be tweened. 
		* @returns {number} The tweened value.
		*/
		InOut: function ( k ) {

			return 0.5 * ( 1 - Math.cos( Math.PI * k ) );

		}

	},

    /**
    * Exponential easing.
    *
    * @class Phaser.Easing.Exponential
    */
	Exponential: {

		/**
		* Exponential ease-in.
		*
		* @method Phaser.Easing.Exponential#In 
		* @param {number} k - The value to be tweened. 
		* @returns {number} The tweened value.
		*/
		In: function ( k ) {

			return k === 0 ? 0 : Math.pow( 1024, k - 1 );

		},

		/**
		* Exponential ease-out.
		*
		* @method Phaser.Easing.Exponential#Out
		* @param {number} k - The value to be tweened. 
		* @returns {number} The tweened value.
		*/
		Out: function ( k ) {

			return k === 1 ? 1 : 1 - Math.pow( 2, - 10 * k );

		},

		/**
		* Exponential ease-in/out.
		*
		* @method Phaser.Easing.Exponential#InOut
		* @param {number} k - The value to be tweened. 
		* @returns {number} The tweened value.
		*/
		InOut: function ( k ) {

			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( ( k *= 2 ) < 1 ) return 0.5 * Math.pow( 1024, k - 1 );
			return 0.5 * ( - Math.pow( 2, - 10 * ( k - 1 ) ) + 2 );

		}

	},

    /**
    * Circular easing.
    *
    * @class Phaser.Easing.Circular
    */
	Circular: {

		/**
		* Circular ease-in.
		*
		* @method Phaser.Easing.Circular#In 
		* @param {number} k - The value to be tweened. 
		* @returns {number} The tweened value.
		*/
		In: function ( k ) {

			return 1 - Math.sqrt( 1 - k * k );

		},

		/**
		* Circular ease-out.
		*
		* @method Phaser.Easing.Circular#Out
		* @param {number} k - The value to be tweened. 
		* @returns {number} The tweened value.
		*/
		Out: function ( k ) {

			return Math.sqrt( 1 - ( --k * k ) );

		},

		/**
		* Circular ease-in/out.
        *
		* @method Phaser.Easing.Circular#InOut
		* @param {number} k - The value to be tweened. 
		* @returns {number} The tweened value.
        */
		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1) return - 0.5 * ( Math.sqrt( 1 - k * k) - 1);
			return 0.5 * ( Math.sqrt( 1 - ( k -= 2) * k) + 1);

		}

	},

    /**
    * Elastic easing.
    *
    * @class Phaser.Easing.Elastic
    */
	Elastic: {

		/**
		* Elastic ease-in.
        *
		* @method Phaser.Easing.Elastic#In 
		* @param {number} k - The value to be tweened. 
		* @returns {number} The tweened value.
        */
		In: function ( k ) {

			var s, a = 0.1, p = 0.4;
			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( !a || a < 1 ) { a = 1; s = p / 4; }
			else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
			return - ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );

		},

		/**
		* Elastic ease-out.
        *
		* @method Phaser.Easing.Elastic#Out
		* @param {number} k - The value to be tweened. 
		* @returns {number} The tweened value.
        */
		Out: function ( k ) {

			var s, a = 0.1, p = 0.4;
			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( !a || a < 1 ) { a = 1; s = p / 4; }
			else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
			return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 );

		},

		/**
		* Elastic ease-in/out.
        *
		* @method Phaser.Easing.Elastic#InOut
		* @param {number} k - The value to be tweened. 
		* @returns {number} The tweened value.
        */
		InOut: function ( k ) {

			var s, a = 0.1, p = 0.4;
			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( !a || a < 1 ) { a = 1; s = p / 4; }
			else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
			if ( ( k *= 2 ) < 1 ) return - 0.5 * ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
			return a * Math.pow( 2, -10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) * 0.5 + 1;

		}

	},

    /**
    * Back easing.
    *
    * @class Phaser.Easing.Back
    */
	Back: {

		/**
		* Back ease-in.
        *
		* @method Phaser.Easing.Back#In 
		* @param {number} k - The value to be tweened. 
		* @returns {number} The tweened value.
        */
		In: function ( k ) {

			var s = 1.70158;
			return k * k * ( ( s + 1 ) * k - s );

		},

		/**
		* Back ease-out.
        *
		* @method Phaser.Easing.Back#Out
		* @param {number} k - The value to be tweened. 
		* @returns {number} The tweened value.
        */
		Out: function ( k ) {

			var s = 1.70158;
			return --k * k * ( ( s + 1 ) * k + s ) + 1;

		},

		/**
		* Back ease-in/out.
        *
		* @method Phaser.Easing.Back#InOut
		* @param {number} k - The value to be tweened. 
		* @returns {number} The tweened value.
        */
		InOut: function ( k ) {

			var s = 1.70158 * 1.525;
			if ( ( k *= 2 ) < 1 ) return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) );
			return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 );

		}

	},

    /**
    * Bounce easing.
    *
    * @class Phaser.Easing.Bounce
    */
	Bounce: {

		/**
		* Bounce ease-in.
        *
		* @method Phaser.Easing.Bounce#In 
		* @param {number} k - The value to be tweened. 
		* @returns {number} The tweened value.
        */
		In: function ( k ) {

			return 1 - Phaser.Easing.Bounce.Out( 1 - k );

		},

		/**
		* Bounce ease-out.
        *
		* @method Phaser.Easing.Bounce#Out
		* @param {number} k - The value to be tweened. 
		* @returns {number} The tweened value.
        */
		Out: function ( k ) {

			if ( k < ( 1 / 2.75 ) ) {

				return 7.5625 * k * k;

			} else if ( k < ( 2 / 2.75 ) ) {

				return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;

			} else if ( k < ( 2.5 / 2.75 ) ) {

				return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;

			} else {

				return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;

			}

		},

		/**
		* Bounce ease-in/out.
        *
		* @method Phaser.Easing.Bounce#InOut
		* @param {number} k - The value to be tweened. 
		* @returns {number} The tweened value.
        */
		InOut: function ( k ) {

			if ( k < 0.5 ) return Phaser.Easing.Bounce.In( k * 2 ) * 0.5;
			return Phaser.Easing.Bounce.Out( k * 2 - 1 ) * 0.5 + 0.5;

		}

	}

};

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Time constructor.
*
* @class Phaser.Time
* @classdesc This is the core internal game clock. It manages the elapsed time and calculation of elapsed values, used for game object motion and tweens.
* @constructor
* @param {Phaser.Game} game A reference to the currently running game.
*/
Phaser.Time = function (game) {

	/**
	* @property {Phaser.Game} game - Local reference to game.
	*/
	this.game = game;

	/**
	* The time at which the Game instance started.
	* @property {number} _started
	* @private
	* @default
	*/
	this._started = 0;

	/**
	* The time (in ms) that the last second counter ticked over.
	* @property {number} _timeLastSecond
	* @private
	* @default
	*/
	this._timeLastSecond = 0;

	/**
	* The time the game started being paused.
	* @property {number} _pauseStarted
	* @private
	* @default
	*/
	this._pauseStarted = 0;

	/**
	* The elapsed time calculated for the physics motion updates.
	* @property {number} physicsElapsed
	* @default
	*/
	this.physicsElapsed = 0;

	/**
	* Game time counter.
	* @property {number} time
	* @default
	*/
	this.time = 0;

	/**
	* Records how long the game has been paused for. Is reset each time the game pauses.
	* @property {number} pausedTime
	* @default
	*/
	this.pausedTime = 0;

	/**
	* The time right now.
	* @property {number} now
    * @default
	*/
	this.now = 0;

	/**
	* Elapsed time since the last frame.
	* @property {number} elapsed
	* @default
	*/
	this.elapsed = 0;

	/**
	* Frames per second.
	* @property {number} fps
	* @default
	*/
	this.fps = 0;

	/**
	* The lowest rate the fps has dropped to.
	* @property {number} fpsMin
	* @default
	*/
	this.fpsMin = 1000;

	/**
	* The highest rate the fps has reached (usually no higher than 60fps).
	* @property {number} fpsMax
	* @default
	*/
	this.fpsMax = 0;

	/**
	* The minimum amount of time the game has taken between two frames.
	* @property {number} msMin
	* @default
	*/
	this.msMin = 1000;

	/**
	* The maximum amount of time the game has taken between two frames.
	* @property {number} msMax
	* @default
	*/
	this.msMax = 0;

	/**
	* The number of frames record in the last second.
	* @property {number} frames
	* @default
	*/
	this.frames = 0;

	/**
	* Records how long the game was paused for in miliseconds.
	* @property {number} pauseDuration
	* @default
	*/
	this.pauseDuration = 0;

	/**
	* The value that setTimeout needs to work out when to next update
	* @property {number} timeToCall
	* @default
	*/
	this.timeToCall = 0;

	/**
	* Internal value used by timeToCall as part of the setTimeout loop
	* @property {number} lastTime
	* @default
	*/
	this.lastTime = 0;

	//	Listen for game pause/resume events
	this.game.onPause.add(this.gamePaused, this);
	this.game.onResume.add(this.gameResumed, this);

	/**
	* Description.
	* @property {boolean} _justResumed
    * @default
	*/
	this._justResumed = false;

};

Phaser.Time.prototype = {

	/**
	* The number of seconds that have elapsed since the game was started.
	* @method Phaser.Time#totalElapsedSeconds
	* @return {number}
	*/
	totalElapsedSeconds: function() {
		return (this.now - this._started) * 0.001;
	},

	/**
	* Updates the game clock and calculate the fps. This is called automatically by Phaser.Game.
	* @method Phaser.Time#update
	* @param {number} time - The current timestamp, either performance.now or Date.now depending on the browser.
	*/
	update: function (time) {

		this.now = time;

		if (this._justResumed)
		{
			this.time = this.now;
			this._justResumed = false;
		}

		this.timeToCall = this.game.math.max(0, 16 - (time - this.lastTime));

		this.elapsed = this.now - this.time;

		this.msMin = this.game.math.min(this.msMin, this.elapsed);
		this.msMax = this.game.math.max(this.msMax, this.elapsed);

		this.frames++;

		if (this.now > this._timeLastSecond + 1000)
		{
			this.fps = Math.round((this.frames * 1000) / (this.now - this._timeLastSecond));
			this.fpsMin = this.game.math.min(this.fpsMin, this.fps);
			this.fpsMax = this.game.math.max(this.fpsMax, this.fps);
			this._timeLastSecond = this.now;
			this.frames = 0;
		}

		this.time = this.now;
        this.lastTime = time + this.timeToCall;
		this.physicsElapsed = 1.0 * (this.elapsed / 1000);

		//	Clamp the delta
		if (this.physicsElapsed > 1)
		{
			this.physicsElapsed = 1;
		}

		//  Paused?
		if (this.game.paused)
		{
			this.pausedTime = this.now - this._pauseStarted;
		}

	},

	/**
	* Called when the game enters a paused state.
	* @method Phaser.Time#gamePaused
	* @private
	*/
	gamePaused: function () {
		
		this._pauseStarted = this.now;

	},

	/**
	* Called when the game resumes from a paused state.
	* @method Phaser.Time#gameResumed
	* @private
	*/
	gameResumed: function () {

		//  Level out the elapsed timer to avoid spikes
		this.time = Date.now();
		this.pauseDuration = this.pausedTime;
		this._justResumed = true;

	},

	/**
	* How long has passed since the given time.
	* @method Phaser.Time#elapsedSince
	* @param {number} since - The time you want to measure against.
	* @return {number} The difference between the given time and now.
	*/
	elapsedSince: function (since) {
		return this.now - since;
	},

	/**
	* How long has passed since the given time (in seconds).
	* @method Phaser.Time#elapsedSecondsSince
	* @param {number} since - The time you want to measure (in seconds).
	* @return {number} Duration between given time and now (in seconds).
	*/
	elapsedSecondsSince: function (since) {
		return (this.now - since) * 0.001;
	},

	/**
	* Resets the private _started value to now.
	* @method Phaser.Time#reset
	*/
	reset: function () {
		this._started = this.now;
	}

};
/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Animation Manager is used to add, play and update Phaser Animations.
* Any Game Object such as Phaser.Sprite that supports animation contains a single AnimationManager instance.
*
* @class Phaser.AnimationManager
* @constructor
* @param {Phaser.Sprite} sprite - A reference to the Game Object that owns this AnimationManager.
*/
Phaser.AnimationManager = function (sprite) {

    /**
    * @property {Phaser.Sprite} sprite - A reference to the parent Sprite that owns this AnimationManager.
    */
	this.sprite = sprite;

    /**
    * @property {Phaser.Game} game - A reference to the currently running Game.
    */
	this.game = sprite.game;

	/**
	* @property {Phaser.Frame} currentFrame - The currently displayed Frame of animation, if any.
	* @default
	*/
	this.currentFrame = null;
	
	/**
	* @property {boolean} updateIfVisible - Should the animation data continue to update even if the Sprite.visible is set to false.
	* @default
	*/
	this.updateIfVisible = true;

	/**
	* @property {boolean} isLoaded - Set to true once animation data has been loaded.
	* @default
	*/
	this.isLoaded = false;

	/**
	* @property {Phaser.FrameData} _frameData - A temp. var for holding the currently playing Animations FrameData.
	* @private
	* @default
	*/
	this._frameData = null;

	/**
	* @property {object} _anims - An internal object that stores all of the Animation instances.
	* @private
	*/   
	this._anims = {};

	/**
	* @property {object} _outputFrames - An internal object to help avoid gc.
	* @private
	*/
	this._outputFrames = [];

};

Phaser.AnimationManager.prototype = {

    /**
    * Loads FrameData into the internal temporary vars and resets the frame index to zero.
    * This is called automatically when a new Sprite is created.
    *
    * @method Phaser.AnimationManager#loadFrameData
    * @private
    * @param {Phaser.FrameData} frameData - The FrameData set to load.
    */
	loadFrameData: function (frameData) {

		this._frameData = frameData;
		this.frame = 0;
		this.isLoaded = true;

	},

	/**
	* Adds a new animation under the given key. Optionally set the frames, frame rate and loop.
	* Animations added in this way are played back with the play function.
	*
    * @method Phaser.AnimationManager#add
	* @param {string} name - The unique (within this Sprite) name for the animation, i.e. "run", "fire", "walk".
	* @param {Array} [frames=null] - An array of numbers/strings that correspond to the frames to add to this animation and in which order. e.g. [1, 2, 3] or ['run0', 'run1', run2]). If null then all frames will be used.
	* @param {number} [frameRate=60] - The speed at which the animation should play. The speed is given in frames per second.
	* @param {boolean} [loop=false] - Whether or not the animation is looped or just plays once.
	* @param {boolean} [useNumericIndex=true] - Are the given frames using numeric indexes (default) or strings?
	* @return {Phaser.Animation} The Animation object that was created.
	*/
	add: function (name, frames, frameRate, loop, useNumericIndex) {

		if (this._frameData == null)
		{
			console.warn('No FrameData available for Phaser.Animation ' + name);
			return;
		}

		frameRate = frameRate || 60;

		if (typeof loop === 'undefined') { loop = false; }

		//	If they didn't set the useNumericIndex then let's at least try and guess it
		if (typeof useNumericIndex === 'undefined')
		{
			if (frames && typeof frames[0] === 'number')
			{
				useNumericIndex = true;
			}
			else
			{
				useNumericIndex = false;
			}
		}

		//  Create the signals the AnimationManager will emit
		if (this.sprite.events.onAnimationStart == null)
		{
			this.sprite.events.onAnimationStart = new Phaser.Signal();
			this.sprite.events.onAnimationComplete = new Phaser.Signal();
			this.sprite.events.onAnimationLoop = new Phaser.Signal();
		}

    	this._outputFrames.length = 0;

		this._frameData.getFrameIndexes(frames, useNumericIndex, this._outputFrames);

		this._anims[name] = new Phaser.Animation(this.game, this.sprite, name, this._frameData, this._outputFrames, frameRate, loop);
		this.currentAnim = this._anims[name];
		this.currentFrame = this.currentAnim.currentFrame;
		this.sprite.setTexture(PIXI.TextureCache[this.currentFrame.uuid]);

		return this._anims[name];

	},

	/**
	* Check whether the frames in the given array are valid and exist.
	*
    * @method Phaser.AnimationManager#validateFrames
	* @param {Array} frames - An array of frames to be validated.
	* @param {boolean} [useNumericIndex=true] - Validate the frames based on their numeric index (true) or string index (false)
	* @return {boolean} True if all given Frames are valid, otherwise false.
	*/
	validateFrames: function (frames, useNumericIndex) {

		if (typeof useNumericIndex == 'undefined') { useNumericIndex = true; }

		for (var i = 0; i < frames.length; i++)
		{
			if (useNumericIndex == true)
			{
				if (frames[i] > this._frameData.total)
				{
					return false;
				}
			}
			else
			{
				if (this._frameData.checkFrameName(frames[i]) == false)
				{
					return false;
				}
			}
		}

		return true;

	},

	/**
	* Play an animation based on the given key. The animation should previously have been added via sprite.animations.add()
	* If the requested animation is already playing this request will be ignored. If you need to reset an already running animation do so directly on the Animation object itself.
	* 
	* @method Phaser.AnimationManager#play
	* @param {string} name - The name of the animation to be played, e.g. "fire", "walk", "jump".
    * @param {number} [frameRate=null] - The framerate to play the animation at. The speed is given in frames per second. If not provided the previously set frameRate of the Animation is used.
    * @param {boolean} [loop=false] - Should the animation be looped after playback. If not provided the previously set loop value of the Animation is used.
    * @param {boolean} [killOnComplete=false] - If set to true when the animation completes (only happens if loop=false) the parent Sprite will be killed.
    * @return {Phaser.Animation} A reference to playing Animation instance.
	*/
	play: function (name, frameRate, loop, killOnComplete) {

		if (this._anims[name])
		{
			if (this.currentAnim == this._anims[name])
			{
				if (this.currentAnim.isPlaying == false)
				{
			        this.currentAnim.paused = false;
					return this.currentAnim.play(frameRate, loop, killOnComplete);
				}
			}
			else
			{
				this.currentAnim = this._anims[name];
			    this.currentAnim.paused = false;
				return this.currentAnim.play(frameRate, loop, killOnComplete);
			}
		}

	},

	/**
	* Stop playback of an animation. If a name is given that specific animation is stopped, otherwise the current animation is stopped.
	* The currentAnim property of the AnimationManager is automatically set to the animation given.
	*
	* @method Phaser.AnimationManager#stop
	* @param {string} [name=null] - The name of the animation to be stopped, e.g. "fire". If none is given the currently running animation is stopped.
	* @param {boolean} [resetFrame=false] - When the animation is stopped should the currentFrame be set to the first frame of the animation (true) or paused on the last frame displayed (false)
	*/
	stop: function (name, resetFrame) {

		if (typeof resetFrame == 'undefined') { resetFrame = false; }

		if (typeof name == 'string')
		{
			if (this._anims[name])
			{
				this.currentAnim = this._anims[name];
				this.currentAnim.stop(resetFrame);
			}
		}
		else
		{
			if (this.currentAnim)
			{
				this.currentAnim.stop(resetFrame);
			}
		}

	},

	/**
	* The main update function is called by the Sprites update loop. It's responsible for updating animation frames and firing related events.
	* 
	* @method Phaser.AnimationManager#update
	* @protected
    * @return {boolean} True if a new animation frame has been set, otherwise false.
	*/
	update: function () {

		if (this.updateIfVisible && this.sprite.visible == false)
		{
			return false;
		}

		if (this.currentAnim && this.currentAnim.update() == true)
		{
			this.currentFrame = this.currentAnim.currentFrame;
			this.sprite.currentFrame = this.currentFrame;
			return true;
		}

		return false;

	},

    /**
    * Refreshes the current frame data back to the parent Sprite and also resets the texture data.
    *
    * @method Phaser.AnimationManager#refreshFrame
    */
	refreshFrame: function () {

        this.sprite.currentFrame = this.currentFrame;
		this.sprite.setTexture(PIXI.TextureCache[this.currentFrame.uuid]);

	},

    /**
    * Destroys all references this AnimationManager contains. Sets the _anims to a new object and nulls the current animation.
    *
    * @method Phaser.AnimationManager#destroy
    */
    destroy: function () {

        this._anims = {};
        this._frameData = null;
        this._frameIndex = 0;
        this.currentAnim = null;
        this.currentFrame = null;

    }

};

/**
* @name Phaser.AnimationManager#frameData
* @property {Phaser.FrameData} frameData - The current animations FrameData.
* @readonly
*/
Object.defineProperty(Phaser.AnimationManager.prototype, "frameData", {

    get: function () {
        return this._frameData;
    }

});

/**
* @name Phaser.AnimationManager#frameTotal
* @property {number} frameTotal - The total number of frames in the currently loaded FrameData, or -1 if no FrameData is loaded.
* @readonly
*/
Object.defineProperty(Phaser.AnimationManager.prototype, "frameTotal", {
 
    get: function () {

        if (this._frameData)
        {
            return this._frameData.total;
        }
        else
        {
            return -1;
        }
    }

});

/**
* @name Phaser.AnimationManager#paused
* @property {boolean} paused - Gets and sets the paused state of the current animation.
*/
Object.defineProperty(Phaser.AnimationManager.prototype, "paused", {

    get: function () {

        return this.currentAnim.isPaused;

    },

    set: function (value) {

        this.currentAnim.paused = value;

    }

});

/**
* @name Phaser.AnimationManager#frame
* @property {number} frame - Gets or sets the current frame index and updates the Texture Cache for display.
*/
Object.defineProperty(Phaser.AnimationManager.prototype, "frame", {

    get: function () {

    	if (this.currentFrame)
    	{
	        return this._frameIndex;
	    }
	    
    },

    set: function (value) {

        if (typeof value === 'number' && this._frameData && this._frameData.getFrame(value) !== null)
        {
            this.currentFrame = this._frameData.getFrame(value);
            this._frameIndex = value;
            this.sprite.currentFrame = this.currentFrame;
			this.sprite.setTexture(PIXI.TextureCache[this.currentFrame.uuid]);
        }

    }

});

/**
* @name Phaser.AnimationManager#frameName
* @property {string} frameName - Gets or sets the current frame name and updates the Texture Cache for display.
*/
Object.defineProperty(Phaser.AnimationManager.prototype, "frameName", {

    get: function () {

    	if (this.currentFrame)
    	{
	        return this.currentFrame.name;
    	}

    },

    set: function (value) {

        if (typeof value === 'string' && this._frameData && this._frameData.getFrameByName(value) !== null)
        {
            this.currentFrame = this._frameData.getFrameByName(value);
            this._frameIndex = this.currentFrame.index;
            this.sprite.currentFrame = this.currentFrame;
			this.sprite.setTexture(PIXI.TextureCache[this.currentFrame.uuid]);
        }
        else
        {
            console.warn("Cannot set frameName: " + value);
        }
    }

});

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* An Animation instance contains a single animation and the controls to play it.
* It is created by the AnimationManager, consists of Animation.Frame objects and belongs to a single Game Object such as a Sprite.
*
* @class Phaser.Animation
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {Phaser.Sprite} parent - A reference to the owner of this Animation.
* @param {string} name - The unique name for this animation, used in playback commands.
* @param {Phaser.FrameData} frameData - The FrameData object that contains all frames used by this Animation.
* @param {(Array.<number>|Array.<string>)} frames - An array of numbers or strings indicating which frames to play in which order.
* @param {number} delay - The time between each frame of the animation, given in ms.
* @param {boolean} looped - Should this animation loop or play through once.
*/
Phaser.Animation = function (game, parent, name, frameData, frames, delay, looped) {

    /**
    * @property {Phaser.Game} game - A reference to the currently running Game.
    */
	this.game = game;

    /**
    * @property {Phaser.Sprite} _parent - A reference to the parent Sprite that owns this Animation.
    * @private
    */
	this._parent = parent;

    /**
    * @property {Phaser.FrameData} _frameData - The FrameData the Animation uses.
    * @private
    */
    this._frameData = frameData;

    /**
    * @property {string} name - The user defined name given to this Animation.
    */
    this.name = name;

    /**
    * @property {object} _frames
    * @private
    */
	this._frames = [];
    this._frames = this._frames.concat(frames);

    /**
    * @property {number} delay - The delay in ms between each frame of the Animation.
    */
	this.delay = 1000 / delay;

    /**
    * @property {boolean} looped - The loop state of the Animation.
    */
	this.looped = looped;

    /**
    * @property {boolean} looped - The loop state of the Animation.
    */
    this.killOnComplete = false;

    /**
    * @property {boolean} isFinished - The finished state of the Animation. Set to true once playback completes, false during playback.
    * @default
    */
	this.isFinished = false;

    /**
    * @property {boolean} isPlaying - The playing state of the Animation. Set to false once playback completes, true during playback.
    * @default
    */
	this.isPlaying = false;

    /**
    * @property {boolean} isPaused - The paused state of the Animation.
    * @default
    */
    this.isPaused = false;

    /**
    * @property {boolean} _pauseStartTime - The time the animation paused.
    * @private
    * @default
    */
    this._pauseStartTime = 0;

    /**
    * @property {number} _frameIndex
    * @private
    * @default
    */
	this._frameIndex = 0;

    /**
    * @property {number} _frameDiff
    * @private
    * @default
    */
    this._frameDiff = 0;

    /**
    * @property {number} _frameSkip
    * @private
    * @default
    */
    this._frameSkip = 1;

    /**
    * @property {Phaser.Frame} currentFrame - The currently displayed frame of the Animation.
    */
	this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);
	
};

Phaser.Animation.prototype = {

    /**
    * Plays this animation.
    *
    * @method Phaser.Animation#play
    * @memberof Phaser.Animation
    * @param {number} [frameRate=null] - The framerate to play the animation at. The speed is given in frames per second. If not provided the previously set frameRate of the Animation is used.
    * @param {boolean} [loop=false] - Should the animation be looped after playback. If not provided the previously set loop value of the Animation is used.
    * @param {boolean} [killOnComplete=false] - If set to true when the animation completes (only happens if loop=false) the parent Sprite will be killed.
    * @return {Phaser.Animation} - A reference to this Animation instance.
    */
    play: function (frameRate, loop, killOnComplete) {

        if (typeof frameRate === 'number')
        {
            //  If they set a new frame rate then use it, otherwise use the one set on creation
            this.delay = 1000 / frameRate;
        }

        if (typeof loop === 'boolean')
        {
            //  If they set a new loop value then use it, otherwise use the one set on creation
            this.looped = loop;
        }

        if (typeof killOnComplete !== 'undefined')
        {
            //  Remove the parent sprite once the animation has finished?
            this.killOnComplete = killOnComplete;
        }

        this.isPlaying = true;
        this.isFinished = false;
        this.paused = false;

        this._timeLastFrame = this.game.time.now;
        this._timeNextFrame = this.game.time.now + this.delay;

        this._frameIndex = 0;

        this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);
		this._parent.setTexture(PIXI.TextureCache[this.currentFrame.uuid]);

        if (this._parent.events)
        {
            this._parent.events.onAnimationStart.dispatch(this._parent, this);
        }

        return this;

    },

    /**
    * Sets this animation back to the first frame and restarts the animation.
    *
    * @method Phaser.Animation#restart
    * @memberof Phaser.Animation
    */
    restart: function () {

        this.isPlaying = true;
        this.isFinished = false;
        this.paused = false;

        this._timeLastFrame = this.game.time.now;
        this._timeNextFrame = this.game.time.now + this.delay;

        this._frameIndex = 0;

        this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);

    },

    /**
    * Stops playback of this animation and set it to a finished state. If a resetFrame is provided it will stop playback and set frame to the first in the animation.
    *
    * @method Phaser.Animation#stop
    * @memberof Phaser.Animation
    * @param {boolean} [resetFrame=false] - If true after the animation stops the currentFrame value will be set to the first frame in this animation.
    */
    stop: function (resetFrame) {

        if (typeof resetFrame === 'undefined') { resetFrame = false; }

        this.isPlaying = false;
        this.isFinished = true;
        this.paused = false;

        if (resetFrame)
        {
            this.currentFrame = this._frameData.getFrame(this._frames[0]);
        }

    },

    /**
    * Updates this animation. Called automatically by the AnimationManager.
    *
    * @method Phaser.Animation#update
    * @memberof Phaser.Animation
    */
    update: function () {

        if (this.isPaused)
        {
            return false;
        }

        if (this.isPlaying == true && this.game.time.now >= this._timeNextFrame)
        {
            this._frameSkip = 1;

            //  Lagging?
            this._frameDiff = this.game.time.now - this._timeNextFrame;

            this._timeLastFrame = this.game.time.now;

            if (this._frameDiff > this.delay)
            {
                //  We need to skip a frame, work out how many
                this._frameSkip = Math.floor(this._frameDiff / this.delay);

                this._frameDiff -= (this._frameSkip * this.delay);
            }

            //  And what's left now?
            this._timeNextFrame = this.game.time.now + (this.delay - this._frameDiff);

            this._frameIndex += this._frameSkip;

            if (this._frameIndex >= this._frames.length)
            {
                if (this.looped)
                {
                    this._frameIndex %= this._frames.length;
                    this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);

                    if (this.currentFrame)
                    {
                        this._parent.setTexture(PIXI.TextureCache[this.currentFrame.uuid]);
                    }
                    
                    this._parent.events.onAnimationLoop.dispatch(this._parent, this);
                }
                else
                {
                    this.onComplete();
                }
            }
            else
            {
                this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);
				this._parent.setTexture(PIXI.TextureCache[this.currentFrame.uuid]);
            }

            return true;
        }

        return false;

    },

    /**
    * Cleans up this animation ready for deletion. Nulls all values and references.
    *
    * @method Phaser.Animation#destroy
    * @memberof Phaser.Animation
    */
    destroy: function () {

        this.game = null;
        this._parent = null;
        this._frames = null;
        this._frameData = null;
        this.currentFrame = null;
        this.isPlaying = false;

    },

    /**
    * Called internally when the animation finishes playback. Sets the isPlaying and isFinished states and dispatches the onAnimationComplete event if it exists on the parent.
    *
    * @method Phaser.Animation#onComplete
    * @memberof Phaser.Animation
    */
    onComplete: function () {

        this.isPlaying = false;
        this.isFinished = true;
        this.paused = false;

        if (this._parent.events)
        {
            this._parent.events.onAnimationComplete.dispatch(this._parent, this);
        }

        if (this.killOnComplete)
        {
            this._parent.kill();
        }

    }

};

/**
* @name Phaser.Animation#paused
* @property {boolean} paused - Gets and sets the paused state of this Animation.
*/
Object.defineProperty(Phaser.Animation.prototype, "paused", {

    get: function () {

        return this.isPaused;

    },

    set: function (value) {

        this.isPaused = value;

        if (value)
        {
            //  Paused
            this._pauseStartTime = this.game.time.now;
        }
        else
        {
            //  Un-paused
            if (this.isPlaying)
            {
                this._timeNextFrame = this.game.time.now + this.delay;
            }
        }

    }

});

/**
* @name Phaser.Animation#frameTotal
* @property {number} frameTotal - The total number of frames in the currently loaded FrameData, or -1 if no FrameData is loaded.
* @readonly
*/
Object.defineProperty(Phaser.Animation.prototype, "frameTotal", {

    get: function () {
        return this._frames.length;
    }

});

/**
* @name Phaser.Animation#frame
* @property {number} frame - Gets or sets the current frame index and updates the Texture Cache for display.
*/
Object.defineProperty(Phaser.Animation.prototype, "frame", {

    get: function () {

        if (this.currentFrame !== null)
        {
            return this.currentFrame.index;
        }
        else
        {
            return this._frameIndex;
        }

    },

    set: function (value) {

        this.currentFrame = this._frameData.getFrame(value);

        if (this.currentFrame !== null)
        {
            this._frameIndex = value;
			this._parent.setTexture(PIXI.TextureCache[this.currentFrame.uuid]);
        }

    }

});

/**
* Really handy function for when you are creating arrays of animation data but it's using frame names and not numbers.
* For example imagine you've got 30 frames named: 'explosion_0001-large' to 'explosion_0030-large'
* You could use this function to generate those by doing: Phaser.Animation.generateFrameNames('explosion_', 1, 30, '-large', 4);
*
* @method Phaser.Animation.generateFrameNames
* @param {string} prefix - The start of the filename. If the filename was 'explosion_0001-large' the prefix would be 'explosion_'.
* @param {number} start - The number to start sequentially counting from. If your frames are named 'explosion_0001' to 'explosion_0034' the start is 1.
* @param {number} stop - The number to count to. If your frames are named 'explosion_0001' to 'explosion_0034' the stop value is 34.
* @param {string} [suffix=''] - The end of the filename. If the filename was 'explosion_0001-large' the prefix would be '-large'.
* @param {number} [zeroPad=0] - The number of zeroes to pad the min and max values with. If your frames are named 'explosion_0001' to 'explosion_0034' then the zeroPad is 4.
*/
Phaser.Animation.generateFrameNames = function (prefix, start, stop, suffix, zeroPad) {

    if (typeof suffix == 'undefined') { suffix = ''; }

    var output = [];
    var frame = '';

    if (start < stop)
    {
        for (var i = start; i <= stop; i++)
        {
            if (typeof zeroPad == 'number')
            {
                //  str, len, pad, dir
                frame = Phaser.Utils.pad(i.toString(), zeroPad, '0', 1);
            }
            else
            {
                frame = i.toString();
            }

            frame = prefix + frame + suffix;

            output.push(frame);
        }
    }
    else
    {
        for (var i = start; i >= stop; i--)
        {
            if (typeof zeroPad == 'number')
            {
                //  str, len, pad, dir
                frame = Phaser.Utils.pad(i.toString(), zeroPad, '0', 1);
            }
            else
            {
                frame = i.toString();
            }

            frame = prefix + frame + suffix;

            output.push(frame);
        }
    }

    return output;

}

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A Frame is a single frame of an animation and is part of a FrameData collection.
*
* @class Phaser.Frame
* @constructor
* @param {number} index - The index of this Frame within the FrameData set it is being added to.
* @param {number} x - X position of the frame within the texture image.
* @param {number} y - Y position of the frame within the texture image.
* @param {number} width - Width of the frame within the texture image.
* @param {number} height - Height of the frame within the texture image.
* @param {string} name - The name of the frame. In Texture Atlas data this is usually set to the filename.
* @param {string} uuid - Internal UUID key.
*/
Phaser.Frame = function (index, x, y, width, height, name, uuid) {

	/**
	* @property {number} index - The index of this Frame within the FrameData set it is being added to.
	*/
	this.index = index;
	
	/**
	* @property {number} x - X position within the image to cut from.
	*/
	this.x = x;

	/**
	* @property {number} y - Y position within the image to cut from.
	*/
	this.y = y;

	/**
	* @property {number} width - Width of the frame.
	*/
	this.width = width;

	/**
	* @property {number} height - Height of the frame.
	*/
	this.height = height;

	/**
	* @property {string} name - Useful for Texture Atlas files (is set to the filename value).
	*/
	this.name = name;

	/**
	* @property {string} uuid - A link to the PIXI.TextureCache entry.
	*/
	this.uuid = uuid;

	/**
	* @property {number} centerX - Center X position within the image to cut from.
	*/
    this.centerX = Math.floor(width / 2);

	/**
	* @property {number} centerY - Center Y position within the image to cut from.
	*/
    this.centerY = Math.floor(height / 2);

	/**
	* @property {number} distance - The distance from the top left to the bottom-right of this Frame.
	*/
	this.distance = Phaser.Math.distance(0, 0, width, height);

	/**
	* @property {boolean} rotated - Rotated? (not yet implemented)
	* @default
	*/
	this.rotated = false;

	/**
	* @property {string} rotationDirection - Either 'cw' or 'ccw', rotation is always 90 degrees.
	* @default 'cw'
	*/
	this.rotationDirection = 'cw';

	/**
	* @property {boolean} trimmed - Was it trimmed when packed?
	* @default
	*/
	this.trimmed = false;

	/**
	* @property {number} sourceSizeW - Width of the original sprite.
	*/
    this.sourceSizeW = width;

	/**
	* @property {number} sourceSizeH - Height of the original sprite.
	*/
    this.sourceSizeH = height;

	/**
	* @property {number} spriteSourceSizeX - X position of the trimmed sprite inside original sprite.
	* @default
	*/
	this.spriteSourceSizeX = 0;

	/**
	* @property {number} spriteSourceSizeY - Y position of the trimmed sprite inside original sprite.
	* @default
	*/
	this.spriteSourceSizeY = 0;

	/**
	* @property {number} spriteSourceSizeW - Width of the trimmed sprite.
	* @default
	*/
	this.spriteSourceSizeW = 0;

	/**
	* @property {number} spriteSourceSizeH - Height of the trimmed sprite.
	* @default
	*/
	this.spriteSourceSizeH = 0;

};

Phaser.Frame.prototype = {

	/**
	* If the frame was trimmed when added to the Texture Atlas this records the trim and source data.
	*
	* @method Phaser.Frame#setTrim
	* @param {boolean} trimmed - If this frame was trimmed or not.
	* @param {number} actualWidth - The width of the frame before being trimmed.
	* @param {number} actualHeight - The height of the frame before being trimmed.
	* @param {number} destX - The destination X position of the trimmed frame for display.
	* @param {number} destY - The destination Y position of the trimmed frame for display.
	* @param {number} destWidth - The destination width of the trimmed frame for display.
	* @param {number} destHeight - The destination height of the trimmed frame for display.
	*/
    setTrim: function (trimmed, actualWidth, actualHeight, destX, destY, destWidth, destHeight) {

        this.trimmed = trimmed;

        if (trimmed)
        {
            this.width = actualWidth;
            this.height = actualHeight;
            this.sourceSizeW = actualWidth;
            this.sourceSizeH = actualHeight;
		    this.centerX = Math.floor(actualWidth / 2);
		    this.centerY = Math.floor(actualHeight / 2);
            this.spriteSourceSizeX = destX;
            this.spriteSourceSizeY = destY;
            this.spriteSourceSizeW = destWidth;
            this.spriteSourceSizeH = destHeight;
        }

    }

};

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* FrameData is a container for Frame objects, which are the internal representation of animation data in Phaser.
*
* @class Phaser.FrameData
* @constructor
*/
Phaser.FrameData = function () {

	/**
	* @property {Array} _frames - Local array of frames.
	* @private
	*/
    this._frames = [];


	/**
	* @property {Array} _frameNames - Local array of frame names for name to index conversions.
	* @private
	*/
    this._frameNames = [];

};

Phaser.FrameData.prototype = {

    /**
    * Adds a new Frame to this FrameData collection. Typically called by the Animation.Parser and not directly.
    *
    * @method Phaser.FrameData#addFrame
    * @param {Phaser.Frame} frame - The frame to add to this FrameData set.
    * @return {Phaser.Frame} The frame that was just added.
    */
    addFrame: function (frame) {

        frame.index = this._frames.length;

        this._frames.push(frame);

        if (frame.name !== '')
        {
            this._frameNames[frame.name] = frame.index;
        }

        return frame;

    },

	/**
	* Get a Frame by its numerical index.
    *
    * @method Phaser.FrameData#getFrame
	* @param {number} index - The index of the frame you want to get.
	* @return {Phaser.Frame} The frame, if found.
	*/
    getFrame: function (index) {

        if (this._frames.length > index)
        {
            return this._frames[index];
        }

        return null;

    },

    /**
    * Get a Frame by its frame name.
    *
    * @method Phaser.FrameData#getFrameByName
    * @param {string} name - The name of the frame you want to get.
    * @return {Phaser.Frame} The frame, if found.
    */
    getFrameByName: function (name) {

        if (typeof this._frameNames[name] === 'number')
        {
            return this._frames[this._frameNames[name]];
        }

        return null;

    },

    /**
    * Check if there is a Frame with the given name.
    *
    * @method Phaser.FrameData#checkFrameName
    * @param {string} name - The name of the frame you want to check.
    * @return {boolean} True if the frame is found, otherwise false.
    */
    checkFrameName: function (name) {

        if (this._frameNames[name] == null)
        {
            return false;
        }

        return true;
        
    },

	/**
	* Returns a range of frames based on the given start and end frame indexes and returns them in an Array.
    *
    * @method Phaser.FrameData#getFrameRange
    * @param {number} start - The starting frame index.
	* @param {number} end - The ending frame index.
	* @param {Array} [output] - If given the results will be appended to the end of this array otherwise a new array will be created.
	* @return {Array} An array of Frames between the start and end index values, or an empty array if none were found.
	*/
    getFrameRange: function (start, end, output) {
        
        if (typeof output === "undefined") { output = []; }

        for (var i = start; i <= end; i++)
        {
            output.push(this._frames[i]);
        }

        return output;

    },

	/**
	* Returns all of the Frames in this FrameData set where the frame index is found in the input array.
    * The frames are returned in the output array, or if none is provided in a new Array object.
    *
    * @method Phaser.FrameData#getFrames
    * @param {Array} frames - An Array containing the indexes of the frames to retrieve. If the array is empty then all frames in the FrameData are returned.
    * @param {boolean} [useNumericIndex=true] - Are the given frames using numeric indexes (default) or strings? (false)
    * @param {Array} [output] - If given the results will be appended to the end of this array otherwise a new array will be created.
    * @return {Array} An array of all Frames in this FrameData set matching the given names or IDs.
	*/
    getFrames: function (frames, useNumericIndex, output) {

        if (typeof useNumericIndex === "undefined") { useNumericIndex = true; }
        if (typeof output === "undefined") { output = []; }

        if (typeof frames === "undefined" || frames.length == 0)
        {
            //  No input array, so we loop through all frames
            for (var i = 0; i < this._frames.length; i++)
            {
                //  We only need the indexes
                output.push(this._frames[i]);
            }
        }
        else
        {
            //  Input array given, loop through that instead
            for (var i = 0, len = frames.length; i < len; i++)
            {
                //  Does the input array contain names or indexes?
                if (useNumericIndex)
                {
                    //  The actual frame
                    output.push(this.getFrame(frames[i]));
                }
                else
                {
                    //  The actual frame
                    output.push(this.getFrameByName(frames[i]));
                }
            }
        }

        return output;

    },

    /**
    * Returns all of the Frame indexes in this FrameData set.
    * The frames indexes are returned in the output array, or if none is provided in a new Array object.
    *
    * @method Phaser.FrameData#getFrameIndexes
    * @param {Array} frames - An Array containing the indexes of the frames to retrieve. If the array is empty then all frames in the FrameData are returned.
    * @param {boolean} [useNumericIndex=true] - Are the given frames using numeric indexes (default) or strings? (false)
    * @param {Array} [output] - If given the results will be appended to the end of this array otherwise a new array will be created.
    * @return {Array} An array of all Frame indexes matching the given names or IDs.
    */
    getFrameIndexes: function (frames, useNumericIndex, output) {

        if (typeof useNumericIndex === "undefined") { useNumericIndex = true; }
        if (typeof output === "undefined") { output = []; }

        if (typeof frames === "undefined" || frames.length == 0)
        {
            //  No frames array, so we loop through all frames
            for (var i = 0, len = this._frames.length; i < len; i++)
            {
                output.push(this._frames[i].index);
            }
        }
        else
        {
            //  Input array given, loop through that instead
            for (var i = 0, len = frames.length; i < len; i++)
            {
                //  Does the frames array contain names or indexes?
                if (useNumericIndex)
                {
                    output.push(frames[i]);
                }
                else
                {
                    if (this.getFrameByName(frames[i]))
                    {
                        output.push(this.getFrameByName(frames[i]).index);
                    }
                }
            }
        }

        return output;

    }

};

/**
* @name Phaser.FrameData#total
* @property {number} total - The total number of frames in this FrameData set.
* @readonly
*/
Object.defineProperty(Phaser.FrameData.prototype, "total", {

    get: function () {
        return this._frames.length;
    }

});

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Responsible for parsing sprite sheet and JSON data into the internal FrameData format that Phaser uses for animations.
*
* @class Phaser.AnimationParser
*/
Phaser.AnimationParser = {

    /**
    * Parse a Sprite Sheet and extract the animation frame data from it.
    *
    * @method Phaser.AnimationParser.spriteSheet
    * @param {Phaser.Game} game - A reference to the currently running game.
    * @param {string} key - The Game.Cache asset key of the Sprite Sheet image.
    * @param {number} frameWidth - The fixed width of each frame of the animation.
    * @param {number} frameHeight - The fixed height of each frame of the animation.
    * @param {number} [frameMax=-1] - The total number of animation frames to extact from the Sprite Sheet. The default value of -1 means "extract all frames".
    * @return {Phaser.FrameData} A FrameData object containing the parsed frames.
    */
    spriteSheet: function (game, key, frameWidth, frameHeight, frameMax) {

        //  How big is our image?
        var img = game.cache.getImage(key);

        if (img == null)
        {
            return null;
        }

        var width = img.width;
        var height = img.height;

        if (frameWidth <= 0)
        {
            frameWidth = Math.floor(-width / Math.min(-1, frameWidth));
        }

        if (frameHeight <= 0)
        {
            frameHeight = Math.floor(-height / Math.min(-1, frameHeight));
        }

        var row = Math.round(width / frameWidth);
        var column = Math.round(height / frameHeight);
        var total = row * column;
        
        if (frameMax !== -1)
        {
            total = frameMax;
        }

        //  Zero or smaller than frame sizes?
        if (width == 0 || height == 0 || width < frameWidth || height < frameHeight || total === 0)
        {
            console.warn("Phaser.AnimationParser.spriteSheet: width/height zero or width/height < given frameWidth/frameHeight");
            return null;
        }

        //  Let's create some frames then
        var data = new Phaser.FrameData();
        var x = 0;
        var y = 0;

        for (var i = 0; i < total; i++)
        {
            var uuid = game.rnd.uuid();

            data.addFrame(new Phaser.Frame(i, x, y, frameWidth, frameHeight, '', uuid));

            PIXI.TextureCache[uuid] = new PIXI.Texture(PIXI.BaseTextureCache[key], {
                x: x,
                y: y,
                width: frameWidth,
                height: frameHeight
            });

            x += frameWidth;

            if (x === width)
            {
                x = 0;
                y += frameHeight;
            }
        }

        return data;

    },

    /**
    * Parse the JSON data and extract the animation frame data from it.
    *
    * @method Phaser.AnimationParser.JSONData
    * @param {Phaser.Game} game - A reference to the currently running game.
    * @param {Object} json - The JSON data from the Texture Atlas. Must be in Array format.
    * @param {string} cacheKey - The Game.Cache asset key of the texture image.
    * @return {Phaser.FrameData} A FrameData object containing the parsed frames.
    */
    JSONData: function (game, json, cacheKey) {

        //  Malformed?
        if (!json['frames'])
        {
            console.warn("Phaser.AnimationParser.JSONData: Invalid Texture Atlas JSON given, missing 'frames' array");
            console.log(json);
            return;
        }

        //  Let's create some frames then
        var data = new Phaser.FrameData();
        
        //  By this stage frames is a fully parsed array
        var frames = json['frames'];
        var newFrame;
        
        for (var i = 0; i < frames.length; i++)
        {
            var uuid = game.rnd.uuid();

            newFrame = data.addFrame(new Phaser.Frame(
                i,
            	frames[i].frame.x, 
            	frames[i].frame.y, 
            	frames[i].frame.w, 
            	frames[i].frame.h, 
            	frames[i].filename,
                uuid
			));

            PIXI.TextureCache[uuid] = new PIXI.Texture(PIXI.BaseTextureCache[cacheKey], {
                x: frames[i].frame.x,
                y: frames[i].frame.y,
                width: frames[i].frame.w,
                height: frames[i].frame.h
            });

            if (frames[i].trimmed)
            {
                newFrame.setTrim(
                    frames[i].trimmed, 
                    frames[i].sourceSize.w, 
                    frames[i].sourceSize.h, 
                    frames[i].spriteSourceSize.x, 
                    frames[i].spriteSourceSize.y, 
                    frames[i].spriteSourceSize.w, 
                    frames[i].spriteSourceSize.h
                );

                //  We had to hack Pixi to get this to work :(
                PIXI.TextureCache[uuid].trimmed = true;
                PIXI.TextureCache[uuid].trim.x = frames[i].spriteSourceSize.x;
                PIXI.TextureCache[uuid].trim.y = frames[i].spriteSourceSize.y;

            }
        }

        return data;

    },

    /**
    * Parse the JSON data and extract the animation frame data from it.
    *
    * @method Phaser.AnimationParser.JSONDataHash
    * @param {Phaser.Game} game - A reference to the currently running game.
    * @param {Object} json - The JSON data from the Texture Atlas. Must be in JSON Hash format.
    * @param {string} cacheKey - The Game.Cache asset key of the texture image.
    * @return {Phaser.FrameData} A FrameData object containing the parsed frames.
    */
    JSONDataHash: function (game, json, cacheKey) {

        //  Malformed?
        if (!json['frames'])
        {
            console.warn("Phaser.AnimationParser.JSONDataHash: Invalid Texture Atlas JSON given, missing 'frames' object");
            console.log(json);
            return;
        }
            
        //  Let's create some frames then
        var data = new Phaser.FrameData();

        //  By this stage frames is a fully parsed array
        var frames = json['frames'];
        var newFrame;
        var i = 0;
        
        for (var key in frames)
        {
            var uuid = game.rnd.uuid();

            newFrame = data.addFrame(new Phaser.Frame(
                i,
                frames[key].frame.x, 
                frames[key].frame.y, 
                frames[key].frame.w, 
                frames[key].frame.h, 
                key,
                uuid
            ));

            PIXI.TextureCache[uuid] = new PIXI.Texture(PIXI.BaseTextureCache[cacheKey], {
                x: frames[key].frame.x,
                y: frames[key].frame.y,
                width: frames[key].frame.w,
                height: frames[key].frame.h
            });

            if (frames[key].trimmed)
            {
                newFrame.setTrim(
                    frames[key].trimmed, 
                    frames[key].sourceSize.w, 
                    frames[key].sourceSize.h, 
                    frames[key].spriteSourceSize.x, 
                    frames[key].spriteSourceSize.y, 
                    frames[key].spriteSourceSize.w, 
                    frames[key].spriteSourceSize.h
                );

                //  We had to hack Pixi to get this to work :(
                PIXI.TextureCache[uuid].trimmed = true;
                PIXI.TextureCache[uuid].trim.x = frames[key].spriteSourceSize.x;
                PIXI.TextureCache[uuid].trim.y = frames[key].spriteSourceSize.y;

            }

            i++;
        }

        return data;

    },

    /**
    * Parse the XML data and extract the animation frame data from it.
    *
    * @method Phaser.AnimationParser.XMLData
    * @param {Phaser.Game} game - A reference to the currently running game.
    * @param {Object} xml - The XML data from the Texture Atlas. Must be in Starling XML format.
    * @param {string} cacheKey - The Game.Cache asset key of the texture image.
    * @return {Phaser.FrameData} A FrameData object containing the parsed frames.
    */
    XMLData: function (game, xml, cacheKey) {

        //  Malformed?
        if (!xml.getElementsByTagName('TextureAtlas'))
        {
            console.warn("Phaser.AnimationParser.XMLData: Invalid Texture Atlas XML given, missing <TextureAtlas> tag");
            return;
        }

        //  Let's create some frames then
        var data = new Phaser.FrameData();
        var frames = xml.getElementsByTagName('SubTexture');
        var newFrame;

        var uuid;
        var frame;
        var x;
        var y;
        var width;
        var height;
        var frameX;
        var frameY;
        var frameWidth;
        var frameHeight;
        
        for (var i = 0; i < frames.length; i++)
        {
            uuid = game.rnd.uuid();

            frame = frames[i].attributes;

            name = frame.name.nodeValue;
            x = parseInt(frame.x.nodeValue);
            y = parseInt(frame.y.nodeValue);
            width = parseInt(frame.width.nodeValue);
            height = parseInt(frame.height.nodeValue);

            frameX = null;
            frameY = null;

            if (frame.frameX)
            {
                frameX = Math.abs(parseInt(frame.frameX.nodeValue));
                frameY = Math.abs(parseInt(frame.frameY.nodeValue));
                frameWidth = parseInt(frame.frameWidth.nodeValue);
                frameHeight = parseInt(frame.frameHeight.nodeValue);
            }

            newFrame = data.addFrame(new Phaser.Frame(i, x, y, width, height, name, uuid));

            PIXI.TextureCache[uuid] = new PIXI.Texture(PIXI.BaseTextureCache[cacheKey], {
                x: x,
                y: y,
                width: width,
                height: height
            });

            //  Trimmed?
            if (frameX !== null || frameY !== null)
            {
                newFrame.setTrim(true, width, height, frameX, frameY, frameWidth, frameHeight);

                PIXI.TextureCache[uuid].realSize = { x: frameX, y: frameY, w: frameWidth, h: frameHeight };

                //  We had to hack Pixi to get this to work :(
                PIXI.TextureCache[uuid].trimmed = true;
                PIXI.TextureCache[uuid].trim.x = frameX;
                PIXI.TextureCache[uuid].trim.y = frameY;
            }
        }

        return data;

    }

};

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Phaser.Cache constructor.
*
* @class    Phaser.Cache
* @classdesc A game only has one instance of a Cache and it is used to store all externally loaded assets such
* as images, sounds and data files as a result of Loader calls. Cache items use string based keys for look-up.
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
*/
Phaser.Cache = function (game) {

    /**
	* @property {Phaser.Game} game - Local reference to game.
	*/
	this.game = game;

	/**
	* @property {object} game - Canvas key-value container.
	* @private
	*/
    this._canvases = {};

    /**
	* @property {object} _images - Image key-value container.
	* @private
	*/
    this._images = {};

    /**
	* @property {object} _textures - RenderTexture key-value container.
	* @private
	*/
    this._textures = {};

    /**
	* @property {object} _sounds - Sound key-value container.
	* @private
	*/
    this._sounds = {};

    /**
	* @property {object} _text - Text key-value container.
	* @private
	*/
    this._text = {};

    /**
	* @property {object} _tilemaps - Tilemap key-value container.
	* @private
	*/
    this._tilemaps = {};

    /**
    * @property {object} _tilesets - Tileset key-value container.
    * @private
    */
    this._tilesets = {};

    this.addDefaultImage();

    /**
	* @property {Phaser.Signal} onSoundUnlock - Description.
	*/
    this.onSoundUnlock = new Phaser.Signal;

};

Phaser.Cache.prototype = {

    /**
    * Add a new canvas object in to the cache.
    * @method Phaser.Cache#addCanvas
    * @param {string} key - Asset key for this canvas.
    * @param {HTMLCanvasElement} canvas - Canvas DOM element.
    * @param {CanvasRenderingContext2D} context - Render context of this canvas.
    */
    addCanvas: function (key, canvas, context) {

        this._canvases[key] = { canvas: canvas, context: context };

    },

    /**
    * Add a new Phaser.RenderTexture in to the cache.
    *
    * @method Phaser.Cache#addRenderTexture
    * @param {string} key - The unique key by which you will reference this object.
    * @param {Phaser.Texture} textue - The texture to use as the base of the RenderTexture.
    */
    addRenderTexture: function (key, texture) {

        var frame = new Phaser.Frame(0, 0, 0, texture.width, texture.height, '', '');

        this._textures[key] = { texture: texture, frame: frame };

    },

    /**
    * Add a new sprite sheet in to the cache.
    *
    * @method Phaser.Cache#addSpriteSheet
    * @param {string} key - The unique key by which you will reference this object.
    * @param {string} url - URL of this sprite sheet file.
    * @param {object} data - Extra sprite sheet data.
    * @param {number} frameWidth - Width of the sprite sheet.
    * @param {number} frameHeight - Height of the sprite sheet.
    * @param {number} frameMax - How many frames stored in the sprite sheet.
    */
    addSpriteSheet: function (key, url, data, frameWidth, frameHeight, frameMax) {

        this._images[key] = { url: url, data: data, spriteSheet: true, frameWidth: frameWidth, frameHeight: frameHeight };

        PIXI.BaseTextureCache[key] = new PIXI.BaseTexture(data);
        PIXI.TextureCache[key] = new PIXI.Texture(PIXI.BaseTextureCache[key]);

        this._images[key].frameData = Phaser.AnimationParser.spriteSheet(this.game, key, frameWidth, frameHeight, frameMax);

    },

    /**
    * Add a new tile set in to the cache.
    *
    * @method Phaser.Cache#addTileset
    * @param {string} key - The unique key by which you will reference this object.
    * @param {string} url - URL of this tile set file.
    * @param {object} data - Extra tile set data.
    * @param {number} tileWidth - Width of the sprite sheet.
    * @param {number} tileHeight - Height of the sprite sheet.
    * @param {number} tileMax - How many tiles stored in the sprite sheet.
    * @param {number} [tileMargin=0] - If the tiles have been drawn with a margin, specify the amount here.
    * @param {number} [tileSpacing=0] - If the tiles have been drawn with spacing between them, specify the amount here.
    */
    addTileset: function (key, url, data, tileWidth, tileHeight, tileMax, tileMargin, tileSpacing) {

        this._tilesets[key] = { url: url, data: data, tileWidth: tileWidth, tileHeight: tileHeight, tileMargin: tileMargin, tileSpacing: tileSpacing };

        PIXI.BaseTextureCache[key] = new PIXI.BaseTexture(data);
        PIXI.TextureCache[key] = new PIXI.Texture(PIXI.BaseTextureCache[key]);

        this._tilesets[key].tileData = Phaser.TilemapParser.tileset(this.game, key, tileWidth, tileHeight, tileMax, tileMargin, tileSpacing);

    },

    /**
    * Add a new tilemap.
    *
    * @method Phaser.Cache#addTilemap
    * @param {string} key - The unique key by which you will reference this object.
    * @param {string} url - URL of the tilemap image.
    * @param {object} mapData - The tilemap data object.
    * @param {number} format - The format of the tilemap data.
    */
    addTilemap: function (key, url, mapData, format) {

        this._tilemaps[key] = { url: url, data: mapData, format: format };

        this._tilemaps[key].layers = Phaser.TilemapParser.parse(this.game, mapData, format);

    },

    /**
    * Add a new texture atlas.
    *
    * @method Phaser.Cache#addTextureAtlas
    * @param {string} key - The unique key by which you will reference this object.
    * @param {string} url - URL of this texture atlas file.
    * @param {object} data - Extra texture atlas data.
    * @param {object} atlasData  - Texture atlas frames data.
    * @param {number} format - The format of the texture atlas.
    */
    addTextureAtlas: function (key, url, data, atlasData, format) {

        this._images[key] = { url: url, data: data, spriteSheet: true };

        PIXI.BaseTextureCache[key] = new PIXI.BaseTexture(data);
        PIXI.TextureCache[key] = new PIXI.Texture(PIXI.BaseTextureCache[key]);

        if (format == Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY)
        {
            this._images[key].frameData = Phaser.AnimationParser.JSONData(this.game, atlasData, key);
        }
        else if (format == Phaser.Loader.TEXTURE_ATLAS_JSON_HASH)
        {
            this._images[key].frameData = Phaser.AnimationParser.JSONDataHash(this.game, atlasData, key);
        }
        else if (format == Phaser.Loader.TEXTURE_ATLAS_XML_STARLING)
        {
            this._images[key].frameData = Phaser.AnimationParser.XMLData(this.game, atlasData, key);
        }

    },

    /**
    * Add a new Bitmap Font.
    *
    * @method Phaser.Cache#addBitmapFont
    * @param {string} key - The unique key by which you will reference this object.
    * @param {string} url - URL of this font xml file.
    * @param {object} data - Extra font data.
    * @param xmlData {object} Texture atlas frames data.
    */
    addBitmapFont: function (key, url, data, xmlData) {

        this._images[key] = { url: url, data: data, spriteSheet: true };

        PIXI.BaseTextureCache[key] = new PIXI.BaseTexture(data);
        PIXI.TextureCache[key] = new PIXI.Texture(PIXI.BaseTextureCache[key]);

        Phaser.LoaderParser.bitmapFont(this.game, xmlData, key);
        // this._images[key].frameData = Phaser.AnimationParser.XMLData(this.game, xmlData, key);

    },

    /**
    * Adds a default image to be used when a key is wrong / missing. Is mapped to the key __default.
    *
    * @method Phaser.Cache#addDefaultImage
    */
    addDefaultImage: function () {

        var img = new Image();
        img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAJ9JREFUeNq01ssOwyAMRFG46v//Mt1ESmgh+DFmE2GPOBARKb2NVjo+17PXLD8a1+pl5+A+wSgFygymWYHBb0FtsKhJDdZlncG2IzJ4ayoMDv20wTmSMzClEgbWYNTAkQ0Z+OJ+A/eWnAaR9+oxCF4Os0H8htsMUp+pwcgBBiMNnAwF8GqIgL2hAzaGFFgZauDPKABmowZ4GL369/0rwACp2yA/ttmvsQAAAABJRU5ErkJggg==";

        this._images['__default'] = { url: null, data: img, spriteSheet: false };
        this._images['__default'].frame = new Phaser.Frame(0, 0, 0, 32, 32, '', '');

        PIXI.BaseTextureCache['__default'] = new PIXI.BaseTexture(img);
        PIXI.TextureCache['__default'] = new PIXI.Texture(PIXI.BaseTextureCache['__default']);

    },

    /**
    * Add a new text data.
    *
    * @method Phaser.Cache#addText
    * @param {string} key - Asset key for the text data. 
    * @param {string} url - URL of this text data file.
    * @param {object} data - Extra text data.
    */    
    addText: function (key, url, data) {

        this._text[key] = {
            url: url,
            data: data
        };

    },

    /**
    * Add a new image.
    *
    * @method Phaser.Cache#addImage
    * @param {string} key - The unique key by which you will reference this object.
    * @param {string} url - URL of this image file.
    * @param {object} data - Extra image data.
    */
    addImage: function (key, url, data) {

        this._images[key] = { url: url, data: data, spriteSheet: false };

        this._images[key].frame = new Phaser.Frame(0, 0, 0, data.width, data.height, key, this.game.rnd.uuid());

        PIXI.BaseTextureCache[key] = new PIXI.BaseTexture(data);
        PIXI.TextureCache[key] = new PIXI.Texture(PIXI.BaseTextureCache[key]);

    },

    /**
    * Add a new sound.
    *
    * @method Phaser.Cache#addSound
    * @param {string} key - Asset key for the sound.
    * @param {string} url - URL of this sound file.
    * @param {object} data - Extra sound data.
    * @param {boolean} webAudio - True if the file is using web audio.
    * @param {boolean} audioTag - True if the file is using legacy HTML audio.
    */
    addSound: function (key, url, data, webAudio, audioTag) {

        webAudio = webAudio || true;
        audioTag = audioTag || false;

        var locked = this.game.sound.touchLocked;
        var decoded = false;

        if (audioTag)
        {
            decoded = true;
        }

        this._sounds[key] = { url: url, data: data, isDecoding: false, decoded: decoded, webAudio: webAudio, audioTag: audioTag };

    },

    /**
    * Reload a sound.
    * @method Phaser.Cache#reloadSound
    * @param {string} key - Asset key for the sound.
    */
    reloadSound: function (key) {

        var _this = this;

        if (this._sounds[key])
        {
            this._sounds[key].data.src = this._sounds[key].url;

            this._sounds[key].data.addEventListener('canplaythrough', function () {
                return _this.reloadSoundComplete(key);
            }, false);

            this._sounds[key].data.load();
        }
    },

    /**
    * Description.
    * @method Phaser.Cache#reloadSoundComplete
    * @param {string} key - Asset key for the sound.
    */
    reloadSoundComplete: function (key) {

        if (this._sounds[key])
        {
            this._sounds[key].locked = false;
            this.onSoundUnlock.dispatch(key);
        }

    },

    /**
    * Description.
    * @method Phaser.Cache#updateSound
    * @param {string} key - Asset key for the sound.
    */
    updateSound: function (key, property, value) {
        
        if (this._sounds[key])
        {
            this._sounds[key][property] = value;
        }

    },

	/**
	* Add a new decoded sound.
    *
    * @method Phaser.Cache#decodedSound
	* @param {string} key - Asset key for the sound.
	* @param {object} data - Extra sound data.
	*/
    decodedSound: function (key, data) {

        this._sounds[key].data = data;
        this._sounds[key].decoded = true;
        this._sounds[key].isDecoding = false;

    },

	/**
	* Get acanvas object from the cache by its key.
    *
    * @method Phaser.Cache#getCanvas
	* @param {string} key - Asset key of the canvas you want.
	* @return {object} The canvas you want.
	*/
    getCanvas: function (key) {

        if (this._canvases[key])
        {
            return this._canvases[key].canvas;
        }

        return null;
    },

    /**
    * Checks if an image key exists.
    *
    * @method Phaser.Cache#checkImageKey
    * @param {string} key - Asset key of the image you want.
    * @return {boolean} True if the key exists, otherwise false.
    */    
    checkImageKey: function (key) {

        if (this._images[key])
        {
            return true;
        }

        return false;

    },

	/**
	* Get image data by key.
    *
    * @method Phaser.Cache#getImage
	* @param {string} key - Asset key of the image you want.
	* @return {object} The image data you want.
	*/    
    getImage: function (key) {

        if (this._images[key])
        {
            return this._images[key].data;
        }

        return null;
    },

    /**
    * Get tile set image data by key.
    *
    * @method Phaser.Cache#getTileSetImage
    * @param {string} key - Asset key of the image you want.
    * @return {object} The image data you want.
    */    
    getTilesetImage: function (key) {

        if (this._tilesets[key])
        {
            return this._tilesets[key].data;
        }

        return null;

    },

    /**
    * Get tile set image data by key.
    *
    * @method Phaser.Cache#getTileset
    * @param {string} key - Asset key of the image you want.
    * @return {Phaser.Tileset} The tileset data. The tileset image is in the data property, the tile data in tileData.
    */    
    getTileset: function (key) {

        if (this._tilesets[key])
        {
            return this._tilesets[key].tileData;
        }

        return null;

    },

    /**
    * Get tilemap data by key.
    *
    * @method Phaser.Cache#getTilemap
    * @param {string} key - Asset key of the tilemap you want.
    * @return {Object} The tilemap data. The tileset image is in the data property, the map data in mapData.
    */
    getTilemapData: function (key) {

        if (this._tilemaps[key])
        {
            return this._tilemaps[key];
        }

        return null;
    },

	/**
	* Get frame data by key.
    *
    * @method Phaser.Cache#getFrameData
	* @param {string} key - Asset key of the frame data you want.
	* @return {Phaser.FrameData} The frame data you want.
	*/
    getFrameData: function (key) {

        if (this._images[key] && this._images[key].frameData)
        {
            return this._images[key].frameData;
        }

        return null;
    },

    /**
    * Get a single frame out of a frameData set by key.
    *
    * @method Phaser.Cache#getFrameByIndex
    * @param {string} key - Asset key of the frame data you want.
    * @return {Phaser.Frame} The frame data you want.
    */
    getFrameByIndex: function (key, frame) {

        if (this._images[key] && this._images[key].frameData)
        {
            return this._images[key].frameData.getFrame(frame);
        }

        return null;
    },

    /**
    * Get a single frame out of a frameData set by key.
    *
    * @method Phaser.Cache#getFrameByName
    * @param {string} key - Asset key of the frame data you want.
    * @return {Phaser.Frame} The frame data you want.
    */
    getFrameByName: function (key, frame) {

        if (this._images[key] && this._images[key].frameData)
        {
            return this._images[key].frameData.getFrameByName(frame);
        }

        return null;
    },

    /**
    * Get a single frame by key. You'd only do this to get the default Frame created for a non-atlas/spritesheet image.
    *
    * @method Phaser.Cache#getFrame
    * @param {string} key - Asset key of the frame data you want.
    * @return {Phaser.Frame} The frame data you want.
    */
    getFrame: function (key) {

        if (this._images[key] && this._images[key].spriteSheet == false)
        {
            return this._images[key].frame;
        }

        return null;
    },

    /**
    * Get a single frame by key. You'd only do this to get the default Frame created for a non-atlas/spritesheet image.
    *
    * @method Phaser.Cache#getTextureFrame
    * @param {string} key - Asset key of the frame data you want.
    * @return {Phaser.Frame} The frame data you want.
    */
    getTextureFrame: function (key) {

        if (this._textures[key])
        {
            return this._textures[key].frame;
        }

        return null;
    },

    /**
    * Get a RenderTexture by key.
    *
    * @method Phaser.Cache#getTexture
    * @param {string} key - Asset key of the RenderTexture you want.
    * @return {Phaser.RenderTexture} The RenderTexture you want.
    */
    getTexture: function (key) {

        if (this._textures[key])
        {
            return this._textures[key];
        }

        return null;

    },

	/**
	* Get sound by key.
    *
    * @method Phaser.Cache#getSound
	* @param {string} key - Asset key of the sound you want.
	* @return {Phaser.Sound} The sound you want.
	*/
    getSound: function (key) {

        if (this._sounds[key])
        {
            return this._sounds[key];
        }

        return null;

    },

	/**
	* Get sound data by key.
    *
    * @method Phaser.Cache#getSoundData
	* @param {string} key - Asset key of the sound you want.
	* @return {object} The sound data you want.
	*/
    getSoundData: function (key) {

        if (this._sounds[key])
        {
            return this._sounds[key].data;
        }

        return null;

    },

	/**
	* Check if the given sound has finished decoding.
    *
    * @method Phaser.Cache#isSoundDecoded
	* @param {string} key - Asset key of the sound you want.
	* @return {boolean} The decoded state of the Sound object.
	*/
    isSoundDecoded: function (key) {

        if (this._sounds[key])
        {
            return this._sounds[key].decoded;
        }

    },

	/**
	* Check if the given sound is ready for playback. A sound is considered ready when it has finished decoding and the device is no longer touch locked.
    *
    * @method Phaser.Cache#isSoundReady
	* @param {string} key - Asset key of the sound you want.
	* @return {boolean} True if the sound is decoded and the device is not touch locked.
	*/
    isSoundReady: function (key) {

        return (this._sounds[key] && this._sounds[key].decoded && this.game.sound.touchLocked == false);

    },

	/**
	* Check whether an image asset is sprite sheet or not.
    *
    * @method Phaser.Cache#isSpriteSheet
	* @param {string} key - Asset key of the sprite sheet you want.
	* @return {boolean} True if the image is a sprite sheet.
	*/
    isSpriteSheet: function (key) {

        if (this._images[key])
        {
            return this._images[key].spriteSheet;
        }

        return false;

    },

	/**
	* Get text data by key.
    *
    * @method Phaser.Cache#getText
	* @param {string} key - Asset key of the text data you want.
	* @return {object} The text data you want.
	*/
    getText: function (key) {

        if (this._text[key])
        {
            return this._text[key].data;
        }

        return null;
        
    },

    /**
    * Get the cache keys from a given array of objects.
    * Normally you don't call this directly but instead use getImageKeys, getSoundKeys, etc.
    *
    * @method Phaser.Cache#getKeys
    * @param {Array} array - An array of items to return the keys for.
    * @return {Array} The array of item keys.
    */
    getKeys: function (array) {

        var output = [];

        for (var item in array)
        {
            if (item !== '__default')
            {
                output.push(item);
            }
        }

        return output;

    },

	/**
	* Returns an array containing all of the keys of Images in the Cache.
    *
    * @method Phaser.Cache#getImageKeys
	* @return {Array} The string based keys in the Cache.
	*/
    getImageKeys: function () {
    	return this.getKeys(this._images);
    },

	/**
	* Returns an array containing all of the keys of Sounds in the Cache.
    *
    * @method Phaser.Cache#getSoundKeys
	* @return {Array} The string based keys in the Cache.
	*/
    getSoundKeys: function () {
    	return this.getKeys(this._sounds);
    },

	/**
	* Returns an array containing all of the keys of Text Files in the Cache.
    *
    * @method Phaser.Cache#getTextKeys
	* @return {Array} The string based keys in the Cache.
	*/
    getTextKeys: function () {
    	return this.getKeys(this._text);
    },

	/**
	* Removes a canvas from the cache.
    *
	* @method Phaser.Cache#removeCanvas
    * @param {string} key - Key of the asset you want to remove.
	*/
    removeCanvas: function (key) {
        delete this._canvases[key];
    },

    /**
    * Removes an image from the cache.
    *
    * @method Phaser.Cache#removeImage
    * @param {string} key - Key of the asset you want to remove.
    */
    removeImage: function (key) {
        delete this._images[key];
    },

    /**
    * Removes a sound from the cache.
    *
    * @method Phaser.Cache#removeSound
    * @param {string} key - Key of the asset you want to remove.
    */
    removeSound: function (key) {
        delete this._sounds[key];
    },

    /**
    * Removes a text from the cache.
    *
    * @method Phaser.Cache#removeText
    * @param {string} key - Key of the asset you want to remove.
    */
    removeText: function (key) {
        delete this._text[key];
    },

	/**
	* Clears the cache. Removes every local cache object reference.
    *
	* @method Phaser.Cache#destroy
	*/
    destroy: function () {

        for (var item in this._canvases)
        {
            delete this._canvases[item['key']];
        }

        for (var item in this._images)
        {
            delete this._images[item['key']];
        }

        for (var item in this._sounds)
        {
            delete this._sounds[item['key']];
        }

        for (var item in this._text)
        {
            delete this._text[item['key']];
        }
    }

};

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Phaser loader constructor.
* The Loader handles loading all external content such as Images, Sounds, Texture Atlases and data files.
* It uses a combination of Image() loading and xhr and provides progress and completion callbacks.
* @class Phaser.Loader
* @classdesc  The Loader handles loading all external content such as Images, Sounds, Texture Atlases and data files.
* It uses a combination of Image() loading and xhr and provides progress and completion callbacks.
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
*/
Phaser.Loader = function (game) {

	/**
    * @property {Phaser.Game} game - Local reference to game.
	*/
	this.game = game;

	/**
	* @property {array} _keys - Array stores assets keys. So you can get that asset by its unique key.
	* @private
    */
	this._keys = [];

	/**
	* @property {Description} _fileList - Contains all the assets file infos.
	* @private
    */
	this._fileList = {};

	/**
	* @property {number} _progressChunk - Indicates assets loading progress. (from 0 to 100)
	* @private
	* @default
	*/
	this._progressChunk = 0;

	/**
	* @property {XMLHttpRequest} - An XMLHttpRequest object used for loading text and audio data.
	* @private
	*/
	this._xhr = new XMLHttpRequest();

	/** 
	* @property {number} - Length of assets queue.
	* @default
	*/
	this.queueSize = 0;

	/**
	* @property {boolean} isLoading - True if the Loader is in the process of loading the queue.
	* @default
	*/
	this.isLoading = false;

	/**
	* @property {boolean} hasLoaded - True if all assets in the queue have finished loading.
	* @default
	*/
	this.hasLoaded = false;

	/**
	* @property {number} progress - The Load progress percentage value (from 0 to 100)
	* @default
	*/
	this.progress = 0;

	/**
	* You can optionally link a sprite to the preloader.
	* If you do so the Sprite's width or height will be cropped based on the percentage loaded.
	* @property {Description} preloadSprite
	* @default
	*/
	this.preloadSprite = null;

	/**
	* @property {string} crossOrigin - The crossOrigin value applied to loaded images
	*/
	this.crossOrigin = '';

	/**
	* If you want to append a URL before the path of any asset you can set this here.
	* Useful if you need to allow an asset url to be configured outside of the game code.
	* MUST have / on the end of it!
	* @property {string} baseURL
	* @default
	*/
	this.baseURL = '';

	/**
	* @property {Phaser.Signal} onFileComplete - Event signal.
	*/
	this.onFileComplete = new Phaser.Signal;
	
	/**
	* @property {Phaser.Signal} onFileError - Event signal.
	*/
	this.onFileError = new Phaser.Signal;
	
	/**
	* @property {Phaser.Signal} onLoadStart - Event signal.
	*/
	this.onLoadStart = new Phaser.Signal;
	
	/**
	* @property {Phaser.Signal} onLoadComplete - Event signal.
	*/
	this.onLoadComplete = new Phaser.Signal;

};

/**
* @constant
* @type {number}
*/
Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY = 0;

/**
* @constant
* @type {number}
*/
Phaser.Loader.TEXTURE_ATLAS_JSON_HASH = 1;

/**
* @constant
* @type {number}
*/
Phaser.Loader.TEXTURE_ATLAS_XML_STARLING = 2;

Phaser.Loader.prototype = {

	/**
	* You can set a Sprite to be a "preload" sprite by passing it to this method.
	* A "preload" sprite will have its width or height crop adjusted based on the percentage of the loader in real-time.
	* This allows you to easily make loading bars for games.
	*
	* @method Phaser.Loader#setPreloadSprite
    * @param {Phaser.Sprite} sprite - The sprite that will be cropped during the load.
    * @param {number} [direction=0] - A value of zero means the sprite width will be cropped, a value of 1 means its height will be cropped.
    */
	setPreloadSprite: function (sprite, direction) {

		direction = direction || 0;

		this.preloadSprite = { sprite: sprite, direction: direction, width: sprite.width, height: sprite.height, crop: null };

		if (direction == 0)
		{
			//	Horizontal crop
			this.preloadSprite.crop = new Phaser.Rectangle(0, 0, 1, sprite.height);
		}
		else
		{
			//	Vertical crop
			this.preloadSprite.crop = new Phaser.Rectangle(0, 0, sprite.width, 1);
		}

		sprite.crop = this.preloadSprite.crop;
		sprite.cropEnabled = true;

	},

	/**
	* Check whether asset exists with a specific key.
	*
	* @method Phaser.Loader#checkKeyExists
	* @param {string} key - Key of the asset you want to check.
	* @return {boolean} Return true if exists, otherwise return false.
	*/
	checkKeyExists: function (key) {

		if (this._fileList[key])
		{
			return true;
		}
		else
		{
			return false;
		}
		
	},

	/**
	* Reset loader, this will remove all loaded assets.
	*
	* @method Phaser.Loader#reset
	*/
	reset: function () {

		this.preloadSprite = null;
		this.queueSize = 0;
		this.isLoading = false;

	},

	/**
	* Internal function that adds a new entry to the file list. Do not call directly.
	*
	* @method Phaser.Loader#addToFileList
	* @param {Description} type - Description.
	* @param {string} key - Description.
	* @param {string} url - URL of Description.
	* @param {Description} properties - Description.
	* @protected
	*/
	addToFileList: function (type, key, url, properties) {

		var entry = {
			type: type,
			key: key,
			url: url,
			data: null,
			error: false,
			loaded: false
		};

		if (typeof properties !== "undefined")
		{
			for (var prop in properties)
			{
				entry[prop] = properties[prop];
			}
		}

		this._fileList[key] = entry;

		this._keys.push(key);

		this.queueSize++;

	},

	/**
	* Add an image to the Loader.
	*
	* @method Phaser.Loader#image
	* @param {string} key - Unique asset key of this image file.
	* @param {string} url - URL of image file.
	* @param {boolean} overwrite - If an entry with a matching key already exists this will over-write it
	*/
	image: function (key, url, overwrite) {

		if (typeof overwrite === "undefined") { overwrite = false; }

		if (overwrite || this.checkKeyExists(key) == false)
		{
			this.addToFileList('image', key, url);
		}

		return this;

	},

	/**
	* Add a text file to the Loader.
	*
	* @method Phaser.Loader#text
	* @param {string} key - Unique asset key of the text file.
	* @param {string} url - URL of the text file.
	* @param {boolean} overwrite - True if Description.
	*/
	text: function (key, url, overwrite) {

		if (typeof overwrite === "undefined") { overwrite = false; }

		if (overwrite || this.checkKeyExists(key) == false)
		{
			this.addToFileList('text', key, url);
		}

		return this;

	},

	/**
	* Add a new sprite sheet to the loader.
	*
	* @method Phaser.Loader#spritesheet
	* @param {string} key - Unique asset key of the sheet file.
	* @param {string} url - URL of the sheet file.
	* @param {number} frameWidth - Width of each single frame.
	* @param {number} frameHeight - Height of each single frame.
	* @param {number} [frameMax=-1] - How many frames in this sprite sheet. If not specified it will divide the whole image into frames.
	*/
	spritesheet: function (key, url, frameWidth, frameHeight, frameMax) {

		if (typeof frameMax === "undefined") { frameMax = -1; }

		if (this.checkKeyExists(key) === false)
		{
			this.addToFileList('spritesheet', key, url, { frameWidth: frameWidth, frameHeight: frameHeight, frameMax: frameMax });
		}

		return this;

	},

	/**
	* Add a new tile set to the loader. These are used in the rendering of tile maps.
	*
	* @method Phaser.Loader#tileset
	* @param {string} key - Unique asset key of the tileset file.
	* @param {string} url - URL of the tileset.
	* @param {number} tileWidth - Width of each single tile in pixels.
	* @param {number} tileHeight - Height of each single tile in pixels.
	* @param {number} [tileMax=-1] - How many tiles in this tileset. If not specified it will divide the whole image into tiles.
	* @param {number} [tileMargin=0] - If the tiles have been drawn with a margin, specify the amount here.
	* @param {number} [tileSpacing=0] - If the tiles have been drawn with spacing between them, specify the amount here.
	*/
	tileset: function (key, url, tileWidth, tileHeight, tileMax, tileMargin, tileSpacing) {

		if (typeof tileMax === "undefined") { tileMax = -1; }
		if (typeof tileMargin === "undefined") { tileMargin = 0; }
		if (typeof tileSpacing === "undefined") { tileSpacing = 0; }

		if (this.checkKeyExists(key) === false)
		{
			this.addToFileList('tileset', key, url, { tileWidth: tileWidth, tileHeight: tileHeight, tileMax: tileMax, tileMargin: tileMargin, tileSpacing: tileSpacing });
		}

		return this;

	},

	/**
	* Add a new audio file to the loader.
	*
	* @method Phaser.Loader#audio
	* @param {string} key - Unique asset key of the audio file.
	* @param {Array} urls - An array containing the URLs of the audio files, i.e.: [ 'jump.mp3', 'jump.ogg', 'jump.m4a' ].
	* @param {boolean} autoDecode - When using Web Audio the audio files can either be decoded at load time or run-time. They can't be played until they are decoded, but this let's you control when that happens. Decoding is a non-blocking async process.
	*/
	audio: function (key, urls, autoDecode) {

		if (typeof autoDecode === "undefined") { autoDecode = true; }

		if (this.checkKeyExists(key) === false)
		{
			this.addToFileList('audio', key, urls, { buffer: null, autoDecode: autoDecode });
		}

		return this;

	},

	/**
	* Add a new tilemap loading request.
	*
	* @method Phaser.Loader#tilemap
	* @param {string} key - Unique asset key of the tilemap data.
	* @param {string} tilesetURL - The url of the tile set image file.
	* @param {string} [mapDataURL] - The url of the map data file (csv/json)
	* @param {object} [mapData] - An optional JSON data object (can be given in place of a URL).
	* @param {string} [format] - The format of the map data.
	*/
	tilemap: function (key, mapDataURL, mapData, format) {

		if (typeof mapDataURL === "undefined") { mapDataURL = null; }
		if (typeof mapData === "undefined") { mapData = null; }
		if (typeof format === "undefined") { format = Phaser.Tilemap.CSV; }

		if (mapDataURL == null && mapData == null)
		{
			console.warn('Phaser.Loader.tilemap - Both mapDataURL and mapData are null. One must be set.');

			return this;
		}

		if (this.checkKeyExists(key) === false)
		{
			//  A URL to a json/csv file has been given
			if (mapDataURL)
			{
				this.addToFileList('tilemap', key, mapDataURL, { format: format });
			}
			else
			{
				switch (format)
				{
					//  A csv string or object has been given
					case Phaser.Tilemap.CSV:
						break;

					//  An xml string or object has been given
					case Phaser.Tilemap.TILED_JSON:

						if (typeof mapData === 'string')
						{
							mapData = JSON.parse(mapData);
						}
						break;
				}

				this.game.cache.addTilemap(key, null, mapData, format);

			}
		}

		return this;

	},

	/**
	* Add a new bitmap font loading request.
	*
	* @method Phaser.Loader#bitmapFont
	* @param {string} key - Unique asset key of the bitmap font.
	* @param {string} textureURL - The url of the font image file.
	* @param {string} [xmlURL] - The url of the font data file (xml/fnt)
	* @param {object} [xmlData] - An optional XML data object.
	*/
	bitmapFont: function (key, textureURL, xmlURL, xmlData) {

		if (typeof xmlURL === "undefined") { xmlURL = null; }
		if (typeof xmlData === "undefined") { xmlData = null; }

		if (this.checkKeyExists(key) === false)
		{
			//  A URL to a json/xml file has been given
			if (xmlURL)
			{
				this.addToFileList('bitmapfont', key, textureURL, { xmlURL: xmlURL });
			}
			else
			{
				//  An xml string or object has been given
				if (typeof xmlData === 'string')
				{
					var xml;

					try  {
						if (window['DOMParser'])
						{
							var domparser = new DOMParser();
							xml = domparser.parseFromString(xmlData, "text/xml");
						}
						else
						{
							xml = new ActiveXObject("Microsoft.XMLDOM");
							xml.async = 'false';
							xml.loadXML(xmlData);
						}
					}
					catch (e)
					{
						xml = undefined;
					}

					if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length)
					{
						throw new Error("Phaser.Loader. Invalid Bitmap Font XML given");
					}
					else
					{
						this.addToFileList('bitmapfont', key, textureURL, { xmlURL: null, xmlData: xml });
					}
				}
			}
		}

		return this;

	},

	/**
	* Add a new texture atlas to the loader. This atlas uses the JSON Array data format.
	*
	* @method Phaser.Loader#atlasJSONArray
	* @param {string} key - Unique asset key of the bitmap font.
	* @param {Description} atlasURL - The url of the Description.
	* @param {Description} atlasData - Description.
	*/
	atlasJSONArray: function (key, textureURL, atlasURL, atlasData) {

		return this.atlas(key, textureURL, atlasURL, atlasData, Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);

	},

	/**
	* Add a new texture atlas to the loader. This atlas uses the JSON Hash data format.
	*
	* @method Phaser.Loader#atlasJSONHash
	* @param {string} key - Unique asset key of the bitmap font.
	* @param {Description} atlasURL - The url of the Description.
	* @param {Description} atlasData - Description.
	*/
	atlasJSONHash: function (key, textureURL, atlasURL, atlasData) {

		return this.atlas(key, textureURL, atlasURL, atlasData, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);

	},

	/**
	* Add a new texture atlas to the loader. This atlas uses the Starling XML data format.
	*
	* @method Phaser.Loader#atlasXML
	* @param {string} key - Unique asset key of the bitmap font.
	* @param {Description} atlasURL - The url of the Description.
	* @param {Description} atlasData - Description.
	*/
	atlasXML: function (key, textureURL, atlasURL, atlasData) {

		return this.atlas(key, textureURL, atlasURL, atlasData, Phaser.Loader.TEXTURE_ATLAS_XML_STARLING);

	},

	/**
	* Add a new texture atlas to the loader.
	*
	* @method Phaser.Loader#atlas
	* @param {string} key - Unique asset key of the texture atlas file.
	* @param {string} textureURL - The url of the texture atlas image file.
	* @param {string} [atlasURL] - The url of the texture atlas data file (json/xml). You don't need this if you are passing an atlasData object instead.
	* @param {object} [atlasData] - A JSON or XML data object. You don't need this if the data is being loaded from a URL.
	* @param {number} [format] - A value describing the format of the data, the default is Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY.
	*/
	atlas: function (key, textureURL, atlasURL, atlasData, format) {

		if (typeof atlasURL === "undefined") { atlasURL = null; }
		if (typeof atlasData === "undefined") { atlasData = null; }
		if (typeof format === "undefined") { format = Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY; }

		if (this.checkKeyExists(key) === false)
		{
			//  A URL to a json/xml file has been given
			if (atlasURL)
			{
				this.addToFileList('textureatlas', key, textureURL, { atlasURL: atlasURL, format: format });
			}
			else
			{
				switch (format)
				{
					//  A json string or object has been given
					case Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY: 

						if (typeof atlasData === 'string')
						{
							atlasData = JSON.parse(atlasData);
						}
						break;

					//  An xml string or object has been given
					case Phaser.Loader.TEXTURE_ATLAS_XML_STARLING:

						if (typeof atlasData === 'string')
						{
							var xml;

							try  {
								if (window['DOMParser'])
								{
									var domparser = new DOMParser();
									xml = domparser.parseFromString(atlasData, "text/xml");
								}
								else
								{
									xml = new ActiveXObject("Microsoft.XMLDOM");
									xml.async = 'false';
									xml.loadXML(atlasData);
								}
							}
							catch (e)
							{
								xml = undefined;
							}

							if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length)
							{
								throw new Error("Phaser.Loader. Invalid Texture Atlas XML given");
							}
							else
							{
								atlasData = xml;
							}
						}
						break;
				}

				this.addToFileList('textureatlas', key, textureURL, { atlasURL: null, atlasData: atlasData, format: format });

			}

		}

		return this;

	},

	/**
	* Remove loading request of a file.
	*
	* @method Phaser.Loader#removeFile
	* @param key {string} Key of the file you want to remove.
	*/
	removeFile: function (key) {

		delete this._fileList[key];

	},

	/**
	* Remove all file loading requests.
	*
	* @method Phaser.Loader#removeAll
	*/
	removeAll: function () {

		this._fileList = {};

	},

	/**
	* Start loading the assets. Normally you don't need to call this yourself as the StateManager will do so.
	*
	* @method Phaser.Loader#start
	*/
	start: function () {

		if (this.isLoading)
		{
			return;
		}

		this.progress = 0;
		this.hasLoaded = false;
		this.isLoading = true;

		this.onLoadStart.dispatch(this.queueSize);

		if (this._keys.length > 0)
		{
			this._progressChunk = 100 / this._keys.length;
			this.loadFile();
		}
		else
		{
			this.progress = 100;
			this.hasLoaded = true;
			this.onLoadComplete.dispatch();
		}

	},

	/**
	* Load files. Private method ONLY used by loader.
	*
	* @method Phaser.Loader#loadFile
	* @private
	*/
	loadFile: function () {

		var file = this._fileList[this._keys.shift()];
		var _this = this;

		//  Image or Data?
		switch (file.type)
		{
			case 'image':
			case 'spritesheet':
			case 'textureatlas':
			case 'bitmapfont':
			case 'tileset':
				file.data = new Image();
				file.data.name = file.key;
				file.data.onload = function () {
					return _this.fileComplete(file.key);
				};
				file.data.onerror = function () {
					return _this.fileError(file.key);
				};
				file.data.crossOrigin = this.crossOrigin;
				file.data.src = this.baseURL + file.url;
				break;

			case 'audio':
				file.url = this.getAudioURL(file.url);

				if (file.url !== null)
				{
					//  WebAudio or Audio Tag?
					if (this.game.sound.usingWebAudio)
					{
						this._xhr.open("GET", this.baseURL + file.url, true);
						this._xhr.responseType = "arraybuffer";
						this._xhr.onload = function () {
							return _this.fileComplete(file.key);
						};
						this._xhr.onerror = function () {
							return _this.fileError(file.key);
						};
						this._xhr.send();
					}
					else if (this.game.sound.usingAudioTag)
					{
						if (this.game.sound.touchLocked)
						{
							//  If audio is locked we can't do this yet, so need to queue this load request. Bum.
							file.data = new Audio();
							file.data.name = file.key;
							file.data.preload = 'auto';
							file.data.src = this.baseURL + file.url;
							this.fileComplete(file.key);
						}
						else
						{
							file.data = new Audio();
							file.data.name = file.key;
							file.data.onerror = function () {
								return _this.fileError(file.key);
							};
							file.data.preload = 'auto';
							file.data.src = this.baseURL + file.url;
							file.data.addEventListener('canplaythrough', Phaser.GAMES[this.game.id].load.fileComplete(file.key), false);
							file.data.load();
						}
					}
				}
				else
				{
					this.fileError(file.key);
				}

				break;

			case 'tilemap':
				this._xhr.open("GET", this.baseURL + file.url, true);
				this._xhr.responseType = "text";

				if (file.format == Phaser.Tilemap.TILED_JSON)
				{
					this._xhr.onload = function () {
						return _this.jsonLoadComplete(file.key);
					};
				}
				else if (file.format == Phaser.Tilemap.CSV)
				{
					this._xhr.onload = function () {
						return _this.csvLoadComplete(file.key);
					};
				}

				this._xhr.onerror = function () {
					return _this.dataLoadError(file.key);
				};
				this._xhr.send();
				break;

			case 'text':
				this._xhr.open("GET", this.baseURL + file.url, true);
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

	},

	/**
	* Private method ONLY used by loader.
	* @method Phaser.Loader#getAudioURL
	* @param {Description} urls - Description.
	* @private
	*/
	getAudioURL: function (urls) {

		var extension;

		for (var i = 0; i < urls.length; i++)
		{
			extension = urls[i].toLowerCase();
			extension = extension.substr((Math.max(0, extension.lastIndexOf(".")) || Infinity) + 1);

			if (this.game.device.canPlayAudio(extension))
			{
				return urls[i];
			}

		}

		return null;

	},

	/**
	* Error occured when load a file.
	*
	* @method Phaser.Loader#fileError
	* @param {string} key - Key of the error loading file.
	*/
	fileError: function (key) {

		this._fileList[key].loaded = true;
		this._fileList[key].error = true;

		this.onFileError.dispatch(key);

		console.warn("Phaser.Loader error loading file: " + key + ' from URL ' + this._fileList[key].url);

		this.nextFile(key, false);

	},

	/**
	* Called when a file is successfully loaded.
	*
	* @method Phaser.Loader#fileComplete
	* @param {string} key - Key of the successfully loaded file.
	*/
	fileComplete: function (key) {

		if (!this._fileList[key])
		{
			console.warn('Phaser.Loader fileComplete invalid key ' + key);
			return;
		}
		
		this._fileList[key].loaded = true;

		var file = this._fileList[key];
		var loadNext = true;
		var _this = this;

		switch (file.type)
		{
			case 'image':

				this.game.cache.addImage(file.key, file.url, file.data);
				break;

			case 'spritesheet':

				this.game.cache.addSpriteSheet(file.key, file.url, file.data, file.frameWidth, file.frameHeight, file.frameMax);
				break;

			case 'tileset':

				this.game.cache.addTileset(file.key, file.url, file.data, file.tileWidth, file.tileHeight, file.tileMax, file.tileMargin, file.tileSpacing);
				break;

			case 'textureatlas':

				if (file.atlasURL == null)
				{
					this.game.cache.addTextureAtlas(file.key, file.url, file.data, file.atlasData, file.format);
				}
				else
				{
					//  Load the JSON or XML before carrying on with the next file
					loadNext = false;
					this._xhr.open("GET", this.baseURL + file.atlasURL, true);
					this._xhr.responseType = "text";

					if (file.format == Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY || file.format == Phaser.Loader.TEXTURE_ATLAS_JSON_HASH)
					{
						this._xhr.onload = function () {
							return _this.jsonLoadComplete(file.key);
						};
					}
					else if (file.format == Phaser.Loader.TEXTURE_ATLAS_XML_STARLING)
					{
						this._xhr.onload = function () {
							return _this.xmlLoadComplete(file.key);
						};
					}

					this._xhr.onerror = function () {
						return _this.dataLoadError(file.key);
					};
					this._xhr.send();
				}
				break;

			case 'bitmapfont':

				if (file.xmlURL == null)
				{
					this.game.cache.addBitmapFont(file.key, file.url, file.data, file.xmlData);
				}
				else
				{
					//  Load the XML before carrying on with the next file
					loadNext = false;
					this._xhr.open("GET", this.baseURL + file.xmlURL, true);
					this._xhr.responseType = "text";

					this._xhr.onload = function () {
						return _this.xmlLoadComplete(file.key);
					};

					this._xhr.onerror = function () {
						return _this.dataLoadError(file.key);
					};
					this._xhr.send();
				}
				break;

			case 'audio':

				if (this.game.sound.usingWebAudio)
				{
					file.data = this._xhr.response;

					this.game.cache.addSound(file.key, file.url, file.data, true, false);

					if (file.autoDecode)
					{
						this.game.cache.updateSound(key, 'isDecoding', true);

						var that = this;
						var key = file.key;

						this.game.sound.context.decodeAudioData(file.data, function (buffer) {
							if (buffer)
							{
								that.game.cache.decodedSound(key, buffer);
							}
						});
					}
				}
				else
				{
					file.data.removeEventListener('canplaythrough', Phaser.GAMES[this.game.id].load.fileComplete);
					this.game.cache.addSound(file.key, file.url, file.data, false, true);
				}
				break;

			case 'text':
				file.data = this._xhr.responseText;
				this.game.cache.addText(file.key, file.url, file.data);
				break;
		}

		if (loadNext)
		{
			this.nextFile(key, true);
		}

	},

	/**
	* Successfully loaded a JSON file.
	*
	* @method Phaser.Loader#jsonLoadComplete
	* @param {string} key - Key of the loaded JSON file.
	*/
	jsonLoadComplete: function (key) {

		var data = JSON.parse(this._xhr.responseText);
		var file = this._fileList[key];

		if (file.type == 'tilemap')
		{
			this.game.cache.addTilemap(file.key, file.url, data, file.format);
		}
		else
		{
			this.game.cache.addTextureAtlas(file.key, file.url, file.data, data, file.format);
		}

		this.nextFile(key, true);

	},

	/**
	* Successfully loaded a CSV file.
	*
	* @method Phaser.Loader#csvLoadComplete
	* @param {string} key - Key of the loaded CSV file.
	*/
	csvLoadComplete: function (key) {

		var data = this._xhr.responseText;
		var file = this._fileList[key];

		this.game.cache.addTilemap(file.key, file.url, data, file.format);

		this.nextFile(key, true);

	},

	/**
	* Error occured when load a JSON.
	*
	* @method Phaser.Loader#dataLoadError
	* @param {string} key - Key of the error loading JSON file.
	*/
	dataLoadError: function (key) {

		var file = this._fileList[key];

		file.error = true;

		console.warn("Phaser.Loader dataLoadError: " + key);

		this.nextFile(key, true);

	},

	/**
	* Successfully loaded an XML file.
	*
	* @method Phaser.Loader#xmlLoadComplete
	* @param {string} key - Key of the loaded XML file.
	*/
	xmlLoadComplete: function (key) {

		var data = this._xhr.responseText;
		var xml;

		try
		{
			if (window['DOMParser'])
			{
				var domparser = new DOMParser();
				xml = domparser.parseFromString(data, "text/xml");
			}
			else
			{
				xml = new ActiveXObject("Microsoft.XMLDOM");
				xml.async = 'false';
				xml.loadXML(data);
			}
		}
		catch (e)
		{
			xml = undefined;
		}

		if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length)
		{
			throw new Error("Phaser.Loader. Invalid XML given");
		}

		var file = this._fileList[key];

		if (file.type == 'bitmapfont')
		{
			this.game.cache.addBitmapFont(file.key, file.url, file.data, xml);
		}
		else if (file.type == 'textureatlas')
		{
			this.game.cache.addTextureAtlas(file.key, file.url, file.data, xml, file.format);
		}

		this.nextFile(key, true);

	},

	/**
	* Handle loading next file.
	*
	* @param previousKey {string} Key of previous loaded asset.
	* @param success {boolean} Whether the previous asset loaded successfully or not.
	* @private
	*/
	nextFile: function (previousKey, success) {

		this.progress = Math.round(this.progress + this._progressChunk);

		if (this.progress > 100)
		{
			this.progress = 100;
		}

		if (this.preloadSprite !== null)
		{
			if (this.preloadSprite.direction == 0)
			{
				this.preloadSprite.crop.width = Math.floor((this.preloadSprite.width / 100) * this.progress);
			}
			else
			{
				this.preloadSprite.crop.height = Math.floor((this.preloadSprite.height / 100) * this.progress);
			}

			this.preloadSprite.sprite.crop = this.preloadSprite.crop;
		}

		this.onFileComplete.dispatch(this.progress, previousKey, success, this.queueSize - this._keys.length, this.queueSize);

		if (this._keys.length > 0)
		{
			this.loadFile();
		}
		else
		{
			this.hasLoaded = true;
			this.isLoading = false;
			
			this.removeAll();

			this.onLoadComplete.dispatch();
		}

	}

};
/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Phaser.LoaderParser parses data objects from Phaser.Loader that need more preparation before they can be inserted into the Cache.
*
* @class Phaser.LoaderParser
*/
Phaser.LoaderParser = {
	
    /**
    * Parse frame data from an XML file.
    * @method Phaser.LoaderParser.bitmapFont
    * @param {object} xml - XML data you want to parse.
    * @return {FrameData} Generated FrameData object.
    */
	bitmapFont: function (game, xml, cacheKey) {

        //  Malformed?
        if (!xml.getElementsByTagName('font'))
        {
            console.warn("Phaser.LoaderParser.bitmapFont: Invalid XML given, missing <font> tag");
            return;
        }

        var texture = PIXI.TextureCache[cacheKey];

        var data = {};
        var info = xml.getElementsByTagName("info")[0];
        var common = xml.getElementsByTagName("common")[0];
        data.font = info.attributes.getNamedItem("face").nodeValue;
        data.size = parseInt(info.attributes.getNamedItem("size").nodeValue, 10);
        data.lineHeight = parseInt(common.attributes.getNamedItem("lineHeight").nodeValue, 10);
        data.chars = {};

        //parse letters
        var letters = xml.getElementsByTagName("char");

        for (var i = 0; i < letters.length; i++)
        {
            var charCode = parseInt(letters[i].attributes.getNamedItem("id").nodeValue, 10);

            var textureRect = {
                x: parseInt(letters[i].attributes.getNamedItem("x").nodeValue, 10),
                y: parseInt(letters[i].attributes.getNamedItem("y").nodeValue, 10),
                width: parseInt(letters[i].attributes.getNamedItem("width").nodeValue, 10),
                height: parseInt(letters[i].attributes.getNamedItem("height").nodeValue, 10)
            };

            //	Note: This means you can only have 1 BitmapFont loaded at once!
            //	Need to replace this with our own handler soon.
            PIXI.TextureCache[charCode] = new PIXI.Texture(texture, textureRect);

            data.chars[charCode] = {
                xOffset: parseInt(letters[i].attributes.getNamedItem("xoffset").nodeValue, 10),
                yOffset: parseInt(letters[i].attributes.getNamedItem("yoffset").nodeValue, 10),
                xAdvance: parseInt(letters[i].attributes.getNamedItem("xadvance").nodeValue, 10),
                kerning: {},
                texture:new PIXI.Texture(texture, textureRect)

            };
        }

        //parse kernings
        var kernings = xml.getElementsByTagName("kerning");

        for (i = 0; i < kernings.length; i++)
        {
           var first = parseInt(kernings[i].attributes.getNamedItem("first").nodeValue, 10);
           var second = parseInt(kernings[i].attributes.getNamedItem("second").nodeValue, 10);
           var amount = parseInt(kernings[i].attributes.getNamedItem("amount").nodeValue, 10);

            data.chars[second].kerning[first] = amount;
        }

        PIXI.BitmapText.fonts[data.font] = data;

    }

};
/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Sound class constructor.
*
* @class Phaser.Sound
* @classdesc The Sound class
* @constructor
* @param {Phaser.Game} game - Reference to the current game instance.
* @param {string} key - Asset key for the sound.
* @param {number} [volume=1] - Default value for the volume, between 0 and 1.
* @param {boolean} [loop=false] - Whether or not the sound will loop.
*/
Phaser.Sound = function (game, key, volume, loop) {
	
	volume = volume || 1;
	if (typeof loop == 'undefined') { loop = false; }

    /**
    * A reference to the currently running Game.
    * @property {Phaser.Game} game
    */
    this.game = game;

    /**
    * Name of the sound.
    * @property {string} name
    * @default
    */
    this.name = key;

    /**
    * Asset key for the sound.
    * @property {string} key
    */
    this.key = key;

    /**
    * Whether or not the sound will loop.
    * @property {boolean} loop
    */
    this.loop = loop;

    /**
    * The global audio volume. A value between 0 (silence) and 1 (full volume).
    * @property {number} _volume
    * @private
    */
    this._volume = volume;

    /**
    * The sound markers, empty by default.
    * @property {object} markers
    */
    this.markers = {};

    
    /**
    * Reference to AudioContext instance.
    * @property {AudioContext} context
    * @default
    */
    this.context = null;

    /**
    * Decoded data buffer / Audio tag.
    * @property {Description} _buffer
    * @private
    */
    this._buffer = null;

    /**
    * Boolean indicating whether the game is on "mute". 
    * @property {boolean} _muted
    * @private
    * @default
    */
    this._muted = false;

    /**
    * Boolean indicating whether the sound should start automatically.
    * @property {boolean} autoplay
    * @private
    */
    this.autoplay = false;

    /**
    * The total duration of the sound, in milliseconds
    * @property {number} totalDuration
    * @default
    */
    this.totalDuration = 0;
   
    /**
    * Description.
    * @property {number} startTime
    * @default
    */
    this.startTime = 0;
    
    /**
    * Description.
    * @property {number} currentTime
    * @default
    */
    this.currentTime = 0;
    
    /**
    * Description.
    * @property {number} duration
    * @default
    */
    this.duration = 0;
    
    /**
    * Description.
    * @property {number} stopTime
    */
    this.stopTime = 0;
    
    /**
    * Description.
    * @property {boolean} paused
    * @default
    */
    this.paused = false;
    
    /**
    * Description.
    * @property {number} pausedPosition
    */
    this.pausedPosition = 0;

    /**
    * Description.
    * @property {number} pausedTime
    */
    this.pausedTime = 0;

    /**
    * Description.
    * @property {boolean} isPlaying
    * @default
    */
    this.isPlaying = false;
    
    /**
    * Description.
    * @property {string} currentMarker
    * @default
    */
    this.currentMarker = '';
    
    /**
    * Description.
    * @property {boolean} pendingPlayback
    * @default
    */
    this.pendingPlayback = false;
    
    /**
    * Description.
    * @property {boolean} override
    * @default
    */
    this.override = false;
    
    /**
    * Description.
    * @property {boolean} usingWebAudio
    */
    this.usingWebAudio = this.game.sound.usingWebAudio;
    
    /**
    * Description.
    * @property {Description} usingAudioTag
    */
    this.usingAudioTag = this.game.sound.usingAudioTag;

    if (this.usingWebAudio)
    {
        this.context = this.game.sound.context;
        this.masterGainNode = this.game.sound.masterGain;

        if (typeof this.context.createGain === 'undefined')
        {
            this.gainNode = this.context.createGainNode();
        }
        else
        {
            this.gainNode = this.context.createGain();
        }

        this.gainNode.gain.value = volume * this.game.sound.volume;
        this.gainNode.connect(this.masterGainNode);
    }
    else
    {
        if (this.game.cache.getSound(key) && this.game.cache.isSoundReady(key))
        {
            this._sound = this.game.cache.getSoundData(key);
            this.totalDuration = 0;

            if (this._sound.duration)
            {
                this.totalDuration = this._sound.duration;
            }
        }
        else
        {
            this.game.cache.onSoundUnlock.add(this.soundHasUnlocked, this);
        }
    }

    /**
    * Description.
    * @property {Phaser.Signal} onDecoded
    */
    this.onDecoded = new Phaser.Signal;
    
    /**
    * Description.
    * @property {Phaser.Signal} onPlay
    */
    this.onPlay = new Phaser.Signal;
    
    /**
    * Description.
    * @property {Phaser.Signal} onPause
    */
    this.onPause = new Phaser.Signal;
    
    /**
    * Description.
    * @property {Phaser.Signal} onResume
    */
    this.onResume = new Phaser.Signal;
    
    /**
    * Description.
    * @property {Phaser.Signal} onLoop
    */
    this.onLoop = new Phaser.Signal;
    
    /**
    * Description.
    * @property {Phaser.Signal} onStop
    */
    this.onStop = new Phaser.Signal;
    
    /**
    * Description.
    * @property {Phaser.Signal} onMute
    */
    this.onMute = new Phaser.Signal;
    
    /**
    * Description.
    * @property {Phaser.Signal} onMarkerComplete
    */
    this.onMarkerComplete = new Phaser.Signal;

};

Phaser.Sound.prototype = {

	/**
    * Called automatically when this sound is unlocked.
	* @method Phaser.Sound#soundHasUnlocked
	* @param {string} key - Description.
    * @protected
	*/
    soundHasUnlocked: function (key) {

        if (key == this.key)
        {
            this._sound = this.game.cache.getSoundData(this.key);
            this.totalDuration = this._sound.duration;
            // console.log('sound has unlocked' + this._sound);
	    }

	},

	/**
	 * Description.
	 * @method Phaser.Sound#addMarker
	 * @param {string} name - Description.
	 * @param {Description} start - Description.
	 * @param {Description} stop - Description.
	 * @param {Description} volume - Description.
	 * @param {Description} loop - Description.
    addMarker: function (name, start, stop, volume, loop) {

    	volume = volume || 1;
    	if (typeof loop == 'undefined') { loop = false; }

        this.markers[name] = {
            name: name,
            start: start,
            stop: stop,
            volume: volume,
            duration: stop - start,
            loop: loop
        };

    },
    */

    /**
    * Adds a marker into the current Sound. A marker is represented by a unique key and a start time and duration.
    * This allows you to bundle multiple sounds together into a single audio file and use markers to jump between them for playback.
    *
    * @method Phaser.Sound#addMarker
    * @param {string} name - A unique name for this marker, i.e. 'explosion', 'gunshot', etc.
    * @param {number} start - The start point of this marker in the audio file, given in seconds. 2.5 = 2500ms, 0.5 = 500ms, etc.
    * @param {number} duration - The duration of the marker in seconds. 2.5 = 2500ms, 0.5 = 500ms, etc.
    * @param {number} [volume=1] - The volume the sound will play back at, between 0 (silent) and 1 (full volume).
    * @param {boolean} [loop=false] - Sets if the sound will loop or not.
    */
    addMarker: function (name, start, duration, volume, loop) {

        volume = volume || 1;
        if (typeof loop == 'undefined') { loop = false; }

        this.markers[name] = {
            name: name,
            start: start,
            stop: start + duration,
            volume: volume,
            duration: duration,
            durationMS: duration * 1000,
            loop: loop
        };

    },

	/**
	* Removes a marker from the sound.
	* @method Phaser.Sound#removeMarker
	* @param {string} name - The key of the marker to remove.
	*/
    removeMarker: function (name) {

        delete this.markers[name];

    },

	/**
	* Called automatically by Phaser.SoundManager.
	* @method Phaser.Sound#update
    * @protected
	*/
    update: function () {

        if (this.pendingPlayback && this.game.cache.isSoundReady(this.key))
        {
            this.pendingPlayback = false;
            this.play(this._tempMarker, this._tempPosition, this._tempVolume, this._tempLoop);
        }

        if (this.isPlaying)
        {
            this.currentTime = this.game.time.now - this.startTime;

            if (this.currentTime >= this.durationMS)
            {
                //console.log(this.currentMarker, 'has hit duration');
                if (this.usingWebAudio)
                {
                    if (this.loop)
                    {
                        //console.log('loop1');
                        //  won't work with markers, needs to reset the position
                        this.onLoop.dispatch(this);

                        if (this.currentMarker == '')
                        {
                            //console.log('loop2');
                            this.currentTime = 0;
                            this.startTime = this.game.time.now;
                        }
                        else
                        {
                            //console.log('loop3');
                            this.play(this.currentMarker, 0, this.volume, true, true);
                        }
                    }
                    else
                    {
                        //console.log('stopping, no loop for marker');
                        this.stop();
                    }
                }
                else
                {
                    if (this.loop)
                    {
                        this.onLoop.dispatch(this);
                        this.play(this.currentMarker, 0, this.volume, true, true);
                    }
                    else
                    {
                        this.stop();
                    }
                }
            }
        }
    },

	/**
    * Play this sound, or a marked section of it.
    * @method Phaser.Sound#play
    * @param {string} [marker=''] - If you want to play a marker then give the key here, otherwise leave blank to play the full sound.
    * @param {number} [position=0] - The starting position to play the sound from - this is ignored if you provide a marker.
    * @param {number} [volume=1] - Volume of the sound you want to play.
    * @param {boolean} [loop=false] - Loop when it finished playing?
    * @param {boolean} [forceRestart=true] - If the sound is already playing you can set forceRestart to restart it from the beginning.
    * @return {Sound} The playing sound object.
    */
    play: function (marker, position, volume, loop, forceRestart) {

    	marker = marker || '';
    	position = position || 0;
    	volume = volume || 1;
    	if (typeof loop == 'undefined') { loop = false; }
    	if (typeof forceRestart == 'undefined') { forceRestart = true; }

        // console.log(this.name + ' play ' + marker + ' position ' + position + ' volume ' + volume + ' loop ' + loop, 'force', forceRestart);

        if (this.isPlaying == true && forceRestart == false && this.override == false)
        {
            //  Use Restart instead
            return;
        }

        if (this.isPlaying && this.override)
        {
            // console.log('asked to play ' + marker + ' but already playing ' + this.currentMarker);
        
            if (this.usingWebAudio)
            {
                if (typeof this._sound.stop === 'undefined')
                {
                    this._sound.noteOff(0);
                }
                else
                {
                    this._sound.stop(0);
                }
            }
            else if (this.usingAudioTag)
            {
                this._sound.pause();
                this._sound.currentTime = 0;
            }
        }

        this.currentMarker = marker;

        if (marker !== '')
        {
            if (this.markers[marker])
            {
                this.position = this.markers[marker].start;
                this.volume = this.markers[marker].volume;
                this.loop = this.markers[marker].loop;
                this.duration = this.markers[marker].duration;
                this.durationMS = this.markers[marker].durationMS;

                // console.log('Marker Loaded: ', marker, 'start:', this.position, 'end: ', this.duration, 'loop', this.loop);

                this._tempMarker = marker;
                this._tempPosition = this.position;
                this._tempVolume = this.volume;
                this._tempLoop = this.loop;
            }
            else
            {
                console.warn("Phaser.Sound.play: audio marker " + marker + " doesn't exist");
                return;
            }
        }
        else
        {
            // console.log('no marker info loaded', marker);

            this.position = position;
            this.volume = volume;
            this.loop = loop;
            this.duration = 0;
            this.durationMS = 0;

            this._tempMarker = marker;
            this._tempPosition = position;
            this._tempVolume = volume;
            this._tempLoop = loop;
        }

        if (this.usingWebAudio)
        {
            //  Does the sound need decoding?
            if (this.game.cache.isSoundDecoded(this.key))
            {
                //  Do we need to do this every time we play? How about just if the buffer is empty?
                if (this._buffer == null)
                {
                    this._buffer = this.game.cache.getSoundData(this.key);
                }

                this._sound = this.context.createBufferSource();
                this._sound.buffer = this._buffer;
                this._sound.connect(this.gainNode);
                this.totalDuration = this._sound.buffer.duration;

                if (this.duration == 0)
                {
                    // console.log('duration reset');
                    this.duration = this.totalDuration;
                    this.durationMS = this.totalDuration * 1000;
                }

                if (this.loop && marker == '')
                {
                    this._sound.loop = true;
                }

                //  Useful to cache this somewhere perhaps?
                if (typeof this._sound.start === 'undefined')
                {
                    this._sound.noteGrainOn(0, this.position, this.duration);
                    // this._sound.noteGrainOn(0, this.position, this.duration / 1000);
                    //this._sound.noteOn(0); // the zero is vitally important, crashes iOS6 without it
				}
				else
				{
                    // this._sound.start(0, this.position, this.duration / 1000);
                    this._sound.start(0, this.position, this.duration);
                }

                this.isPlaying = true;
                this.startTime = this.game.time.now;
                this.currentTime = 0;
                this.stopTime = this.startTime + this.durationMS;
                this.onPlay.dispatch(this);
			}
			else
			{
                this.pendingPlayback = true;

                if (this.game.cache.getSound(this.key) && this.game.cache.getSound(this.key).isDecoding == false)
                {
                    this.game.sound.decode(this.key, this);
                }
            }
        }
        else
        {
            // console.log('Sound play Audio');
            if (this.game.cache.getSound(this.key) && this.game.cache.getSound(this.key).locked)
            {
                // console.log('tried playing locked sound, pending set, reload started');
                this.game.cache.reloadSound(this.key);
                this.pendingPlayback = true;
            }
            else
            {
                // console.log('sound not locked, state?', this._sound.readyState);
                if (this._sound && this._sound.readyState == 4)
                {
                    this._sound.play();
                    //  This doesn't become available until you call play(), wonderful ...
                    this.totalDuration = this._sound.duration;

                    if (this.duration == 0)
                    {
                        this.duration = this.totalDuration;
                        this.durationMS = this.totalDuration * 1000;
                    }

                    // console.log('playing', this._sound);
                    this._sound.currentTime = this.position;
                    this._sound.muted = this._muted;
                    
                    if (this._muted)
                    {
                        this._sound.volume = 0;
                    }
                    else
                    {
                        this._sound.volume = this._volume;
                    }

                    this.isPlaying = true;
                    this.startTime = this.game.time.now;
                    this.currentTime = 0;
                    this.stopTime = this.startTime + this.durationMS;
                    this.onPlay.dispatch(this);
                }
                else
                {
                    this.pendingPlayback = true;
                }
            }
        }
    },

    /**
    * Restart the sound, or a marked section of it.
    * @method Phaser.Sound#restart
    * @param {string} [marker=''] - If you want to play a marker then give the key here, otherwise leave blank to play the full sound.
    * @param {number} [position=0] - The starting position to play the sound from - this is ignored if you provide a marker.
    * @param {number} [volume=1] - Volume of the sound you want to play.
    * @param {boolean} [loop=false] - Loop when it finished playing?
    */
    restart: function (marker, position, volume, loop) {

    	marker = marker || '';
    	position = position || 0;
    	volume = volume || 1;
    	if (typeof loop == 'undefined') { loop = false; }

        this.play(marker, position, volume, loop, true);

    },

    /**
    * Pauses the sound
    * @method Phaser.Sound#pause
    */
    pause: function () {

        if (this.isPlaying && this._sound)
        {
            this.stop();
            this.isPlaying = false;
            this.paused = true;
            this.pausedPosition = this.currentTime;
            this.pausedTime = this.game.time.now;
            this.onPause.dispatch(this);
        }

    },

    /**
    * Resumes the sound
    * @method Phaser.Sound#resume
    */
    resume: function () {

        if (this.paused && this._sound)
        {
            if (this.usingWebAudio)
            {
                var p = this.position + (this.pausedPosition / 1000);

                this._sound = this.context.createBufferSource();
                this._sound.buffer = this._buffer;
                this._sound.connect(this.gainNode);

                if (typeof this._sound.start === 'undefined')
                {
                    this._sound.noteGrainOn(0, p, this.duration);
                    //this._sound.noteOn(0); // the zero is vitally important, crashes iOS6 without it
				}
				else
				{
                    this._sound.start(0, p, this.duration);
                }
            }
            else
            {
                this._sound.play();
            }

            this.isPlaying = true;
            this.paused = false;
            this.startTime += (this.game.time.now - this.pausedTime);
            this.onResume.dispatch(this);
        }

    },

	/**
    * Stop playing this sound.
    * @method Phaser.Sound#stop
    */
    stop: function () {

        if (this.isPlaying && this._sound)
        {
            if (this.usingWebAudio)
            {
                if (typeof this._sound.stop === 'undefined')
                {
                    this._sound.noteOff(0);
                }
                else
                {
                    this._sound.stop(0);
                }
            }
            else if (this.usingAudioTag)
            {
                this._sound.pause();
                this._sound.currentTime = 0;
            }
        }

        this.isPlaying = false;
        var prevMarker = this.currentMarker;
        
        this.currentMarker = '';
        this.onStop.dispatch(this, prevMarker);

    }

};

/**
* @name Phaser.Sound#isDecoding
* @property {boolean} isDecoding - Returns true if the sound file is still decoding.
* @readonly
*/
Object.defineProperty(Phaser.Sound.prototype, "isDecoding", {

    get: function () {
        return this.game.cache.getSound(this.key).isDecoding;
    }

});

/**
* @name Phaser.Sound#isDecoded
* @property {boolean} isDecoded - Returns true if the sound file has decoded.
* @readonly
*/
Object.defineProperty(Phaser.Sound.prototype, "isDecoded", {

    get: function () {
        return this.game.cache.isSoundDecoded(this.key);
    }

});

/**
* @name Phaser.Sound#mute
* @property {boolean} mute - Gets or sets the muted state of this sound.
*/
Object.defineProperty(Phaser.Sound.prototype, "mute", {
	
    get: function () {
        return this._muted;
    },
 
    set: function (value) {

    	value = value || null;

        if (value)
        {
            this._muted = true;

            if (this.usingWebAudio)
            {
                this._muteVolume = this.gainNode.gain.value;
                this.gainNode.gain.value = 0;
            }
            else if (this.usingAudioTag && this._sound)
            {
                this._muteVolume = this._sound.volume;
                this._sound.volume = 0;
            }
        }
        else
        {
            this._muted = false;

            if (this.usingWebAudio)
            {
                this.gainNode.gain.value = this._muteVolume;
            }
            else if (this.usingAudioTag && this._sound)
            {
                this._sound.volume = this._muteVolume;
            }
        }

        this.onMute.dispatch(this);

    }

});

/**
* @name Phaser.Sound#volume
* @property {number} volume - Gets or sets the volume of this sound, a value between 0 and 1.
* @readonly
*/
Object.defineProperty(Phaser.Sound.prototype, "volume", {

    get: function () {
        return this._volume;
    },

    set: function (value) {

        if (this.usingWebAudio)
        {
            this._volume = value;
            this.gainNode.gain.value = value;
        }
        else if (this.usingAudioTag && this._sound)
        {
            //  Causes an Index size error in Firefox if you don't clamp the value
            if (value >= 0 && value <= 1)
            {
                this._volume = value;
                this._sound.volume = value;
            }
        }
    }

});

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Sound Manager constructor.
*
* @class Phaser.SoundManager
* @classdesc Phaser Sound Manager.
* @constructor
* @param {Phaser.Game} game reference to the current game instance.
*/
Phaser.SoundManager = function (game) {

	/**
	* @property {Phaser.Game} game - Local reference to game.
	*/
	this.game = game;
	
	/**
	* @property {Phaser.Signal} onSoundDecode - Description.
	*/
	this.onSoundDecode = new Phaser.Signal;
	
	/**
	* @property {boolean} _muted - Description.
	* @private
	* @default
	*/
    this._muted = false;
   
	/**
	* @property {Description} _unlockSource - Description.
	* @private
	* @default
	*/
    this._unlockSource = null;

    /**
    * @property {number} _volume - The global audio volume. A value between 0 (silence) and 1 (full volume).
    * @private
    * @default 
    */
    this._volume = 1;

    /**
    * @property {array} _sounds - An array containing all the sounds 
    * @private
    * @default The empty array.
    */
    this._sounds = [];

    /**
    * @property {Description} context - Description. 
    * @default
    */
    this.context = null;
    
	/**
	* @property {boolean} usingWebAudio - Description.
	* @default
	*/
    this.usingWebAudio = true;
    
	/**
	* @property {boolean} usingAudioTag - Description.
	* @default
	*/
    this.usingAudioTag = false;
    
	/**
	* @property {boolean} noAudio - Description.
	* @default
	*/
    this.noAudio = false;

	/**
	* @property {boolean} touchLocked - Description.
	* @default
	*/
    this.touchLocked = false;

	/**
	* @property {number} channels - Description.
	* @default
	*/
    this.channels = 32;
	
};

Phaser.SoundManager.prototype = {

    /**
    * Initialises the sound manager.
    * @method Phaser.SoundManager#boot
    * @protected
    */
    boot: function () {

        if (this.game.device.iOS && this.game.device.webAudio == false)
        {
            this.channels = 1;
        }

        if (this.game.device.iOS || (window['PhaserGlobal'] && window['PhaserGlobal'].fakeiOSTouchLock))
        {
            this.game.input.touch.callbackContext = this;
            this.game.input.touch.touchStartCallback = this.unlock;
            this.game.input.mouse.callbackContext = this;
            this.game.input.mouse.mouseDownCallback = this.unlock;
            this.touchLocked = true;
        }
        else
        {
            //  What about iOS5?
            this.touchLocked = false;
        }

        if (window['PhaserGlobal'])
        {
            //  Check to see if all audio playback is disabled (i.e. handled by a 3rd party class)
            if (window['PhaserGlobal'].disableAudio == true)
            {
                this.usingWebAudio = false;
                this.noAudio = true;
                return;
            }

            //  Check if the Web Audio API is disabled (for testing Audio Tag playback during development)
            if (window['PhaserGlobal'].disableWebAudio == true)
            {
                this.usingWebAudio = false;
                this.usingAudioTag = true;
                this.noAudio = false;
                return;
            }
        }

        if (!!window['AudioContext'])
        {
            this.context = new window['AudioContext']();
        }
        else if (!!window['webkitAudioContext'])
        {
            this.context = new window['webkitAudioContext']();
        }
        else if (!!window['Audio'])
        {
            this.usingWebAudio = false;
            this.usingAudioTag = true;
        }
        else
        {
            this.usingWebAudio = false;
            this.noAudio = true;
        }

        if (this.context !== null)
        {
            if (typeof this.context.createGain === 'undefined')
            {
                this.masterGain = this.context.createGainNode();
            }
            else
            {
                this.masterGain = this.context.createGain();
            }

            this.masterGain.gain.value = 1;
            this.masterGain.connect(this.context.destination);
        }


    },

    /**
    * Enables the audio, usually after the first touch.
    * @method Phaser.SoundManager#unlock
    */
    unlock: function () {

        if (this.touchLocked == false)
        {
            return;
        }

        //  Global override (mostly for Audio Tag testing)
        if (this.game.device.webAudio == false || (window['PhaserGlobal'] && window['PhaserGlobal'].disableWebAudio == true))
        {
            //  Create an Audio tag?
            this.touchLocked = false;
            this._unlockSource = null;
            this.game.input.touch.callbackContext = null;
            this.game.input.touch.touchStartCallback = null;
            this.game.input.mouse.callbackContext = null;
            this.game.input.mouse.mouseDownCallback = null;
        }
        else
        {
            // Create empty buffer and play it
            var buffer = this.context.createBuffer(1, 1, 22050);
            this._unlockSource = this.context.createBufferSource();
            this._unlockSource.buffer = buffer;
            this._unlockSource.connect(this.context.destination);
            this._unlockSource.noteOn(0);
        }

    },

    /**
    * Stops all the sounds in the game.
    * @method Phaser.SoundManager#stopAll
    */
    stopAll: function () {

        for (var i = 0; i < this._sounds.length; i++)
        {
            if (this._sounds[i])
            {
                this._sounds[i].stop();
            }
        }

    },

    /**
    * Pauses all the sounds in the game.
    * @method Phaser.SoundManager#pauseAll
    */
    pauseAll: function () {

        for (var i = 0; i < this._sounds.length; i++)
        {
            if (this._sounds[i])
            {
                this._sounds[i].pause();
            }
        }

    },

    /**
    * resumes every sound in the game.
    * @method Phaser.SoundManager#resumeAll
    */
    resumeAll: function () {

        for (var i = 0; i < this._sounds.length; i++)
        {
            if (this._sounds[i])
            {
                this._sounds[i].resume();
            }
        }
   
	},

	/**
    * Decode a sound by its assets key.
    * @method Phaser.SoundManager#decode
    * @param {string} key - Assets key of the sound to be decoded.
    * @param {Phaser.Sound} [sound] - Its buffer will be set to decoded data.
    */
    decode: function (key, sound) {

        sound = sound || null;

        var soundData = this.game.cache.getSoundData(key);

        if (soundData)
        {
            if (this.game.cache.isSoundDecoded(key) === false)
            {
                this.game.cache.updateSound(key, 'isDecoding', true);

                var that = this;

                this.context.decodeAudioData(soundData, function (buffer) {
                    that.game.cache.decodedSound(key, buffer);
                    if (sound)
                    {
                        that.onSoundDecode.dispatch(sound);
                    }
                });
            }
        }

    },

    /**
    * Updates every sound in the game.
    * @method Phaser.SoundManager#update
    */
    update: function () {

        if (this.touchLocked)
        {
            if (this.game.device.webAudio && this._unlockSource !== null)
            {
                if ((this._unlockSource.playbackState === this._unlockSource.PLAYING_STATE || this._unlockSource.playbackState === this._unlockSource.FINISHED_STATE))
                {
                    this.touchLocked = false;
                    this._unlockSource = null;
                    this.game.input.touch.callbackContext = null;
                    this.game.input.touch.touchStartCallback = null;
                }
            }
        }

        for (var i = 0; i < this._sounds.length; i++)
        {
            this._sounds[i].update();
        }

    },

    /**
    * Adds a new Sound into the SoundManager.
    * @method Phaser.SoundManager#add
    * @param {string} key - Asset key for the sound.
    * @param {number} [volume=1] - Default value for the volume.
    * @param {boolean} [loop=false] - Whether or not the sound will loop.
    */
    add: function (key, volume, loop) {

    	volume = volume || 1;
    	if (typeof loop == 'undefined') { loop = false; }

        var sound = new Phaser.Sound(this.game, key, volume, loop);

        this._sounds.push(sound);

        return sound;

    }

};

/**
* @name Phaser.SoundManager#mute
* @property {boolean} mute - Gets or sets the muted state of the SoundManager. This effects all sounds in the game.
*/
Object.defineProperty(Phaser.SoundManager.prototype, "mute", {

    get: function () {

        return this._muted;

    },

    set: function (value) {

        value = value || null;

        if (value)
        {
            if (this._muted)
            {
                return;
            }

            this._muted = true;
            
            if (this.usingWebAudio)
            {
                this._muteVolume = this.masterGain.gain.value;
                this.masterGain.gain.value = 0;
            }

            //  Loop through sounds
            for (var i = 0; i < this._sounds.length; i++)
            {
                if (this._sounds[i].usingAudioTag)
                {
                    this._sounds[i].mute = true;
                }
            }
        }
        else
        {
            if (this._muted == false)
            {
                return;
            }

            this._muted = false;

            if (this.usingWebAudio)
            {
                this.masterGain.gain.value = this._muteVolume;
            }

            //  Loop through sounds
            for (var i = 0; i < this._sounds.length; i++)
            {
                if (this._sounds[i].usingAudioTag)
                {
                    this._sounds[i].mute = false;
                }
            }
        }
    }

});

/**
* @name Phaser.SoundManager#volume
* @property {number} volume - Gets or sets the global volume of the SoundManager, a value between 0 and 1.
*/
Object.defineProperty(Phaser.SoundManager.prototype, "volume", {
    
    get: function () {

        if (this.usingWebAudio)
        {
            return this.masterGain.gain.value;
        }
        else
        {
            return this._volume;
        }

    },

    set: function (value) {

        value = this.game.math.clamp(value, 1, 0);

        this._volume = value;

        if (this.usingWebAudio)
        {
            this.masterGain.gain.value = value;
        }

        //  Loop through the sound cache and change the volume of all html audio tags
        for (var i = 0; i < this._sounds.length; i++)
        {
            if (this._sounds[i].usingAudioTag)
            {
                this._sounds[i].volume = this._sounds[i].volume * value;
            }
        }
        
    }

});

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A collection of methods for displaying debug information about game objects. Phaser.Debug requires a CANVAS game type in order to render, so if you've got
* your game set to use Phaser.AUTO then swap it for Phaser.CANVAS to ensure WebGL doesn't kick in, then the Debug functions will all display.
*
* @class Phaser.Utils.Debug
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
*/
Phaser.Utils.Debug = function (game) {

    /**
	* @property {Phaser.Game} game - A reference to the currently running Game.
	*/
    this.game = game;
  
	/**
	* @property {Context} context - The canvas context on which to render the debug information.
	*/
    this.context = game.context;

	/**
	* @property {string} font - The font that the debug information is rendered in.
	* @default '14px Courier'
	*/
    this.font = '14px Courier';
   
	/**
	* @property {number} lineHeight - The line height between the debug text.
	*/
    this.lineHeight = 16;
    
	/**
	* @property {boolean} renderShadow - Should the text be rendered with a slight shadow? Makes it easier to read on different types of background.
	*/
    this.renderShadow = true;
    
	/**
	* @property {Context} currentX - The current X position the debug information will be rendered at.
	* @default
	*/
    this.currentX = 0;
    
	/**
	* @property {number} currentY - The current Y position the debug information will be rendered at.
	* @default
	*/
    this.currentY = 0;
    
	/**
	* @property {number} currentAlpha - The current alpha the debug information will be rendered at.
	* @default
	*/
    this.currentAlpha = 1;

};

Phaser.Utils.Debug.prototype = {

    /**
    * Internal method that resets and starts the debug output values.
    * @method Phaser.Utils.Debug#start
    * @param {number} x - The X value the debug info will start from.
    * @param {number} y - The Y value the debug info will start from.
    * @param {string} color - The color the debug info will drawn in.
    */
    start: function (x, y, color) {

        if (this.context == null)
        {
            return;
        }

        if (typeof x !== 'number') { x = 0; }
        if (typeof y !== 'number') { y = 0; }

        color = color || 'rgb(255,255,255)';

        this.currentX = x;
        this.currentY = y;
        this.currentColor = color;
        this.currentAlpha = this.context.globalAlpha;

        this.context.save();
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.fillStyle = color;
        this.context.font = this.font;
        this.context.globalAlpha = 1;

    },

    /**
    * Internal method that stops the debug output.
    * @method Phaser.Utils.Debug#stop
    */
    stop: function () {


        this.context.restore();
        this.context.globalAlpha = this.currentAlpha;

    },

    /**
    * Internal method that outputs a single line of text.
    * @method Phaser.Utils.Debug#line
    * @param {string} text - The line of text to draw.
    * @param {number} x - The X value the debug info will start from.
    * @param {number} y - The Y value the debug info will start from.
    */
    line: function (text, x, y) {

        if (this.context == null)
        {
            return;
        }

        x = x || null;
        y = y || null;

        if (x !== null) {
            this.currentX = x;
        }

        if (y !== null) {
            this.currentY = y;
        }

        if (this.renderShadow)
        {
            this.context.fillStyle = 'rgb(0,0,0)';
            this.context.fillText(text, this.currentX + 1, this.currentY + 1);
            this.context.fillStyle = this.currentColor;
        }

        this.context.fillText(text, this.currentX, this.currentY);
        this.currentY += this.lineHeight;

    },

    /**
    * Visually renders a QuadTree to the display.
    * @method Phaser.Utils.Debug#renderQuadTree
    * @param {Phaser.QuadTree} quadtree - The quadtree to render.
    * @param {string} color - The color of the lines in the quadtree.
    */
    renderQuadTree: function (quadtree, color) {

        color = color || 'rgba(255,0,0,0.3)';

        this.start();

        var bounds = quadtree.bounds;

        if (quadtree.nodes.length === 0)
        {
            this.context.strokeStyle = color;
            this.context.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
            this.renderText(quadtree.ID + ' / ' + quadtree.objects.length, bounds.x + 4, bounds.y + 16, 'rgb(0,200,0)', '12px Courier');

            this.context.strokeStyle = 'rgb(0,255,0)';

            // children
            for (var i = 0; i < quadtree.objects.length; i++)
            {
                this.context.strokeRect(quadtree.objects[i].x, quadtree.objects[i].y, quadtree.objects[i].width, quadtree.objects[i].height);
            }
        }
        else
        {
            for (var i = 0; i < quadtree.nodes.length; i++)
            {
                this.renderQuadTree(quadtree.nodes[i]);
            }
        }

        this.stop();

    },

    /**
     * Renders the corners and point information of the given Sprite.
     * @method Phaser.Utils.Debug#renderSpriteCorners
     * @param {Phaser.Sprite} sprite - The sprite to be rendered.
     * @param {boolean} [showText=false] - If true the x/y coordinates of each point will be rendered.
     * @param {boolean} [showBounds=false] - If true the bounds will be rendered over the top of the sprite.
     * @param {string} [color='rgb(255,0,255)'] - The color the text is rendered in.
     */
    renderSpriteCorners: function (sprite, showText, showBounds, color) {

        if (this.context == null)
        {
            return;
        }

        showText = showText || false;
        showBounds = showBounds || false;
        color = color || 'rgb(255,255,255)';

        this.start(0, 0, color);

        if (showBounds)
        {
            this.context.beginPath();
            this.context.strokeStyle = 'rgba(0, 255, 0, 0.7)';
            this.context.strokeRect(sprite.bounds.x, sprite.bounds.y, sprite.bounds.width, sprite.bounds.height);
            this.context.closePath();
            this.context.stroke();
        }

        this.context.beginPath();
        this.context.moveTo(sprite.topLeft.x, sprite.topLeft.y);
        this.context.lineTo(sprite.topRight.x, sprite.topRight.y);
        this.context.lineTo(sprite.bottomRight.x, sprite.bottomRight.y);
        this.context.lineTo(sprite.bottomLeft.x, sprite.bottomLeft.y);
        this.context.closePath();
        this.context.strokeStyle = 'rgba(255, 0, 255, 0.7)';
        this.context.stroke();

        this.renderPoint(sprite.offset);
        this.renderPoint(sprite.center);
        this.renderPoint(sprite.topLeft);
        this.renderPoint(sprite.topRight);
        this.renderPoint(sprite.bottomLeft);
        this.renderPoint(sprite.bottomRight);

        if (showText)
        {
            this.currentColor = color;
            this.line('x: ' + Math.floor(sprite.topLeft.x) + ' y: ' + Math.floor(sprite.topLeft.y), sprite.topLeft.x, sprite.topLeft.y);
            this.line('x: ' + Math.floor(sprite.topRight.x) + ' y: ' + Math.floor(sprite.topRight.y), sprite.topRight.x, sprite.topRight.y);
            this.line('x: ' + Math.floor(sprite.bottomLeft.x) + ' y: ' + Math.floor(sprite.bottomLeft.y), sprite.bottomLeft.x, sprite.bottomLeft.y);
            this.line('x: ' + Math.floor(sprite.bottomRight.x) + ' y: ' + Math.floor(sprite.bottomRight.y), sprite.bottomRight.x, sprite.bottomRight.y);
        }

        this.stop();

    },

    /**
    * Render Sound information, including decoded state, duration, volume and more.
    * @method Phaser.Utils.Debug#renderSoundInfo
    * @param {Phaser.Sound} sound - The sound object to debug.
    * @param {number} x - X position of the debug info to be rendered.
    * @param {number} y - Y position of the debug info to be rendered.
    * @param {string} [color='rgb(255,255,255)'] - color of the debug info to be rendered. (format is css color string).
    */
    renderSoundInfo: function (sound, x, y, color) {

        if (this.context == null)
        {
            return;
        }

        color = color || 'rgb(255,255,255)';

        this.start(x, y, color);
        this.line('Sound: ' + sound.key + ' Locked: ' + sound.game.sound.touchLocked);
        this.line('Is Ready?: ' + this.game.cache.isSoundReady(sound.key) + ' Pending Playback: ' + sound.pendingPlayback);
        this.line('Decoded: ' + sound.isDecoded + ' Decoding: ' + sound.isDecoding);
        this.line('Total Duration: ' + sound.totalDuration + ' Playing: ' + sound.isPlaying);
        this.line('Time: ' + sound.currentTime);
        this.line('Volume: ' + sound.volume + ' Muted: ' + sound.mute);
        this.line('WebAudio: ' + sound.usingWebAudio + ' Audio: ' + sound.usingAudioTag);

        if (sound.currentMarker !== '')
        {
            this.line('Marker: ' + sound.currentMarker + ' Duration: ' + sound.duration);
            this.line('Start: ' + sound.markers[sound.currentMarker].start + ' Stop: ' + sound.markers[sound.currentMarker].stop);
            this.line('Position: ' + sound.position);
        }

        this.stop();

    },

    /**
    * Render camera information including dimensions and location.
    * @method Phaser.Utils.Debug#renderCameraInfo
    * @param {Phaser.Camera} camera - Description.
    * @param {number} x - X position of the debug info to be rendered.
    * @param {number} y - Y position of the debug info to be rendered.
    * @param {string} [color='rgb(255,255,255)'] - color of the debug info to be rendered. (format is css color string).
    */
    renderCameraInfo: function (camera, x, y, color) {

        if (this.context == null)
        {
            return;
        }

        color = color || 'rgb(255,255,255)';

        this.start(x, y, color);
        this.line('Camera (' + camera.width + ' x ' + camera.height + ')');
        this.line('X: ' + camera.x + ' Y: ' + camera.y);
        this.line('Bounds x: ' + camera.bounds.x + ' Y: ' + camera.bounds.y + ' w: ' + camera.bounds.width + ' h: ' + camera.bounds.height);
        this.line('View x: ' + camera.view.x + ' Y: ' + camera.view.y + ' w: ' + camera.view.width + ' h: ' + camera.view.height);
        this.stop();
        
    },

    /**
    * Renders the Pointer.circle object onto the stage in green if down or red if up along with debug text.
    * @method Phaser.Utils.Debug#renderDebug
    * @param {Phaser.Pointer} pointer - Description.
    * @param {boolean} [hideIfUp=false] - Doesn't render the circle if the pointer is up.
    * @param {string} [downColor='rgba(0,255,0,0.5)'] - The color the circle is rendered in if down.
    * @param {string} [upColor='rgba(255,0,0,0.5)'] - The color the circle is rendered in if up (and hideIfUp is false).
    * @param {string} [color='rgb(255,255,255)'] - color of the debug info to be rendered. (format is css color string).
    */
    renderPointer: function (pointer, hideIfUp, downColor, upColor, color) {

        if (this.context == null || pointer == null)
        {
            return;
        }

        if (typeof hideIfUp === 'undefined') { hideIfUp = false; }
        downColor = downColor || 'rgba(0,255,0,0.5)';
        upColor = upColor || 'rgba(255,0,0,0.5)';
        color = color || 'rgb(255,255,255)';

        if (hideIfUp == true && pointer.isUp == true)
        {
            return;
        }

        this.start(pointer.x, pointer.y - 100, color);
        this.context.beginPath();
        this.context.arc(pointer.x, pointer.y, pointer.circle.radius, 0, Math.PI * 2);

        if (pointer.active)
        {
            this.context.fillStyle = downColor;
        }
        else
        {
            this.context.fillStyle = upColor;
        }

        this.context.fill();
        this.context.closePath();

        //  Render the points
        this.context.beginPath();
        this.context.moveTo(pointer.positionDown.x, pointer.positionDown.y);
        this.context.lineTo(pointer.position.x, pointer.position.y);
        this.context.lineWidth = 2;
        this.context.stroke();
        this.context.closePath();

        //  Render the text
        // this.start(pointer.x, pointer.y - 100, color);
        this.line('ID: ' + pointer.id + " Active: " + pointer.active);
        this.line('World X: ' + pointer.worldX + " World Y: " + pointer.worldY);
        this.line('Screen X: ' + pointer.x + " Screen Y: " + pointer.y);
        this.line('Duration: ' + pointer.duration + " ms");
        this.stop();

    },

    /**
    * Render Sprite Input Debug information.
    * @method Phaser.Utils.Debug#renderSpriteInputInfo
    * @param {Phaser.Sprite} sprite - The sprite to be rendered.
    * @param {number} x - X position of the debug info to be rendered.
    * @param {number} y - Y position of the debug info to be rendered.
    * @param {string} [color='rgb(255,255,255)'] - color of the debug info to be rendered. (format is css color string).
    */    
    renderSpriteInputInfo: function (sprite, x, y, color) {

        color = color || 'rgb(255,255,255)';

        this.start(x, y, color);
        this.line('Sprite Input: (' + sprite.width + ' x ' + sprite.height + ')');
        this.line('x: ' + sprite.input.pointerX().toFixed(1) + ' y: ' + sprite.input.pointerY().toFixed(1));
        this.line('over: ' + sprite.input.pointerOver() + ' duration: ' + sprite.input.overDuration().toFixed(0));
        this.line('down: ' + sprite.input.pointerDown() + ' duration: ' + sprite.input.downDuration().toFixed(0));
        this.line('just over: ' + sprite.input.justOver() + ' just out: ' + sprite.input.justOut());
        this.stop();

    },

    /**
     * Render Sprite collision.
     * @method Phaser.Utils.Debug#renderSpriteCollision
     * @param {Phaser.Sprite} sprite - The sprite to be rendered.
     * @param {number} x - X position of the debug info to be rendered.
     * @param {number} y - Y position of the debug info to be rendered.
    * @param {string} [color='rgb(255,255,255)'] - color of the debug info to be rendered. (format is css color string).
     */ 
    renderSpriteCollision: function (sprite, x, y, color) {

        color = color || 'rgb(255,255,255)';

        this.start(x, y, color);
        this.line('Sprite Collision: (' + sprite.width + ' x ' + sprite.height + ')');
        this.line('left: ' + sprite.body.touching.left);
        this.line('right: ' + sprite.body.touching.right);
        this.line('up: ' + sprite.body.touching.up);
        this.line('down: ' + sprite.body.touching.down);
        this.line('velocity.x: ' + sprite.body.velocity.x);
        this.line('velocity.y: ' + sprite.body.velocity.y);
        this.stop();

    },

    /**
    * Render debug information about the Input object.
    * @method Phaser.Utils.Debug#renderInputInfo
    * @param {number} x - X position of the debug info to be rendered.
    * @param {number} y - Y position of the debug info to be rendered.
    * @param {string} [color='rgb(255,255,255)'] - color of the debug info to be rendered. (format is css color string).
    */
    renderInputInfo: function (x, y, color) {

        if (this.context == null)
        {
            return;
        }

        color = color || 'rgb(255,255,0)';

        this.start(x, y, color);
        this.line('Input');
        this.line('X: ' + this.game.input.x + ' Y: ' + this.game.input.y);
        this.line('World X: ' + this.game.input.worldX + ' World Y: ' + this.game.input.worldY);
        this.line('Scale X: ' + this.game.input.scale.x.toFixed(1) + ' Scale Y: ' + this.game.input.scale.x.toFixed(1));
        this.line('Screen X: ' + this.game.input.activePointer.screenX + ' Screen Y: ' + this.game.input.activePointer.screenY);
        this.stop();

    },

    /**
    * Render debug infos (including name, bounds info, position and some other properties) about the Sprite.
    * @method Phaser.Utils.Debug#renderSpriteInfo
    * @param {Phaser.Sprite} sprite - Description.
    * @param {number} x - X position of the debug info to be rendered.
    * @param {number} y - Y position of the debug info to be rendered.
    * @param {string} [color='rgb(255,255,255)'] - color of the debug info to be rendered. (format is css color string).
    */
    renderSpriteInfo: function (sprite, x, y, color) {

        if (this.context == null)
        {
            return;
        }

        color = color || 'rgb(255, 255, 255)';

        this.start(x, y, color);

        this.line('Sprite: ' + ' (' + sprite.width + ' x ' + sprite.height + ') anchor: ' + sprite.anchor.x + ' x ' + sprite.anchor.y);
        this.line('x: ' + sprite.x.toFixed(1) + ' y: ' + sprite.y.toFixed(1));
        this.line('angle: ' + sprite.angle.toFixed(1) + ' rotation: ' + sprite.rotation.toFixed(1));
        this.line('visible: ' + sprite.visible + ' in camera: ' + sprite.inCamera);
        this.line('body x: ' + sprite.body.x.toFixed(1) + ' y: ' + sprite.body.y.toFixed(1));

        //  0 = scaleX
        //  1 = skewY
        //  2 = translateX
        //  3 = skewX
        //  4 = scaleY
        //  5 = translateY

        // this.line('id: ' + sprite._id);
        // this.line('scale x: ' + sprite.worldTransform[0]);
        // this.line('scale y: ' + sprite.worldTransform[4]);
        // this.line('tx: ' + sprite.worldTransform[2]);
        // this.line('ty: ' + sprite.worldTransform[5]);
        // this.line('skew x: ' + sprite.worldTransform[3]);
        // this.line('skew y: ' + sprite.worldTransform[1]);
        this.line('deltaX: ' + sprite.body.deltaX());
        this.line('deltaY: ' + sprite.body.deltaY());
        // this.line('sdx: ' + sprite.deltaX());
        // this.line('sdy: ' + sprite.deltaY());

        // this.line('inCamera: ' + this.game.renderer.spriteRenderer.inCamera(this.game.camera, sprite));
        this.stop();

    },

    /**
    * Render the World Transform information of the given Sprite.
    * @method Phaser.Utils.Debug#renderWorldTransformInfo
    * @param {Phaser.Sprite} sprite - Description.
    * @param {number} x - X position of the debug info to be rendered.
    * @param {number} y - Y position of the debug info to be rendered.
    * @param {string} [color='rgb(255,255,255)'] - color of the debug info to be rendered. (format is css color string).
    */
    renderWorldTransformInfo: function (sprite, x, y, color) {

        if (this.context == null)
        {
            return;
        }

        color = color || 'rgb(255, 255, 255)';

        this.start(x, y, color);

        this.line('World Transform');
        this.line('skewX:  ' + sprite.worldTransform[3]);
        this.line('skewY:  ' + sprite.worldTransform[1]);
        this.line('scaleX: ' + sprite.worldTransform[0]);
        this.line('scaleY: ' + sprite.worldTransform[4]);
        this.line('transX: ' + sprite.worldTransform[2]);
        this.line('transY: ' + sprite.worldTransform[5]);
        this.stop();

    },

    /**
    * Render the Local Transform information of the given Sprite.
    * @method Phaser.Utils.Debug#renderLocalTransformInfo
    * @param {Phaser.Sprite} sprite - Description.
    * @param {number} x - X position of the debug info to be rendered.
    * @param {number} y - Y position of the debug info to be rendered.
    * @param {string} [color='rgb(255,255,255)'] - color of the debug info to be rendered. (format is css color string).
    */
    renderLocalTransformInfo: function (sprite, x, y, color) {

        if (this.context == null)
        {
            return;
        }

        color = color || 'rgb(255, 255, 255)';

        this.start(x, y, color);

        this.line('Local Transform');
        this.line('skewX:  ' + sprite.localTransform[3]);
        this.line('skewY:  ' + sprite.localTransform[1]);
        this.line('scaleX: ' + sprite.localTransform[0]);
        this.line('scaleY: ' + sprite.localTransform[4]);
        this.line('transX: ' + sprite.localTransform[2]);
        this.line('transY: ' + sprite.localTransform[5]);
        this.stop();

    },

    renderSpriteCoords: function (sprite, x, y, color) {

        if (this.context == null)
        {
            return;
        }

        color = color || 'rgb(255, 255, 255)';

        this.start(x, y, color);

        if (sprite.name)
        {
            this.line(sprite.name);
        }

        this.line('x: ' + sprite.x);
        this.line('y: ' + sprite.y);
        this.line('pos x: ' + sprite.position.x);
        this.line('pos y: ' + sprite.position.y);
        this.line('local x: ' + sprite.localTransform[2]);
        this.line('local y: ' + sprite.localTransform[5]);
        this.line('t x: ' + sprite.worldTransform[2]);
        this.line('t y: ' + sprite.worldTransform[5]);
        this.line('world x: ' + sprite.world.x);
        this.line('world y: ' + sprite.world.y);

        this.stop();

    },

    renderGroupInfo: function (group, x, y, color) {

        if (this.context == null)
        {
            return;
        }

        color = color || 'rgb(255, 255, 255)';

        this.start(x, y, color);

        this.line('Group (size: ' + group.length + ')');
        this.line('x: ' + group.x);
        this.line('y: ' + group.y);

        this.stop();

    },

    /**
    * Renders Point coordinates in the given color.
    * @method Phaser.Utils.Debug#renderPointInfo
    * @param {Phaser.Point} sprite - Description.
    * @param {number} x - X position of the debug info to be rendered.
    * @param {number} y - Y position of the debug info to be rendered.
    * @param {string} [color='rgb(255,255,255)'] - color of the debug info to be rendered. (format is css color string).
    */
    renderPointInfo: function (point, x, y, color) {

        if (this.context == null)
        {
            return;
        }

        color = color || 'rgb(255, 255, 255)';

        this.start(x, y, color);
        this.line('px: ' + point.x.toFixed(1) + ' py: ' + point.y.toFixed(1));
        this.stop();

    },

    /**
    * Renders just the Sprite.body bounds.
    * @method Phaser.Utils.Debug#renderSpriteBody
    * @param {Phaser.Sprite} sprite - Description.
    * @param {string} [color] - Color of the debug info to be rendered (format is css color string).
    */
    renderSpriteBody: function (sprite, color) {

        if (this.context == null)
        {
            return;
        }

        color = color || 'rgba(255,0,255, 0.3)';

        this.start(0, 0, color);

        this.context.fillStyle = color;
        this.context.fillRect(sprite.body.screenX, sprite.body.screenY, sprite.body.width, sprite.body.height);

        this.stop();

    },

    /**
    * Renders just the full Sprite bounds.
    * @method Phaser.Utils.Debug#renderSpriteBounds
    * @param {Phaser.Sprite} sprite - Description.
    * @param {string} [color] - Color of the debug info to be rendered (format is css color string).
    * @param {boolean} [fill=false] - If false the bounds outline is rendered, if true the whole rectangle is rendered.
    */
    renderSpriteBounds: function (sprite, color, fill) {

        if (this.context == null)
        {
            return;
        }

        color = color || 'rgb(255,0,255)';

        if (typeof fill === 'undefined') { fill = false; }

        this.start(0, 0, color);

        if (fill)
        {
            this.context.fillStyle = color;
            this.context.fillRect(sprite.bounds.x, sprite.bounds.y, sprite.bounds.width, sprite.bounds.height);
        }
        else
        {
            this.context.strokeStyle = color;
            this.context.strokeRect(sprite.bounds.x, sprite.bounds.y, sprite.bounds.width, sprite.bounds.height);
            this.context.stroke();
        }

        this.stop();

    },

    /**
    * Renders a single pixel.
    * @method Phaser.Utils.Debug#renderPixel
    * @param {number} x - X position of the debug info to be rendered.
    * @param {number} y - Y position of the debug info to be rendered.
    * @param {string} [color] - Color of the debug info to be rendered (format is css color string).
    */
    renderPixel: function (x, y, color) {

        if (this.context == null)
        {
            return;
        }

        color = color || 'rgba(0,255,0,1)';

        this.start();
        this.context.fillStyle = color;
        this.context.fillRect(x, y, 2, 2);
        this.stop();

    },

    /**
    * Renders a Point object.
    * @method Phaser.Utils.Debug#renderPoint
    * @param {Phaser.Point} point - The Point to render.
    * @param {string} [color] - Color of the debug info to be rendered (format is css color string).
    */
    renderPoint: function (point, color) {

        if (this.context == null)
        {
            return;
        }

        color = color || 'rgba(0,255,0,1)';

        this.start();
        this.context.fillStyle = color;
        this.context.fillRect(point.x, point.y, 4, 4);
        this.stop();

    },

    /**
    * Renders a Rectangle.
    * @method Phaser.Utils.Debug#renderRectangle
    * @param {Phaser.Rectangle} rect - The Rectangle to render.
    * @param {string} [color] - Color of the debug info to be rendered (format is css color string).
    */
    renderRectangle: function (rect, color) {

        if (this.context == null)
        {
            return;
        }

        color = color || 'rgba(0,255,0,0.3)';

        this.start();
        this.context.fillStyle = color;
        this.context.fillRect(rect.x, rect.y, rect.width, rect.height);
        this.stop();
        
    },

    /**
    * Renders a Circle.
    * @method Phaser.Utils.Debug#renderCircle
    * @param {Phaser.Circle} circle - The Circle to render.
    * @param {string} [color] - Color of the debug info to be rendered (format is css color string).
    */
    renderCircle: function (circle, color) {

        if (this.context == null)
        {
            return;
        }

        color = color || 'rgba(0,255,0,0.3)';

        this.start();
        this.context.beginPath();
        this.context.fillStyle = color;
        this.context.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, false);
        this.context.fill();
        this.context.closePath();
        this.stop();

    },

    /**
    * Render text.
    * @method Phaser.Utils.Debug#renderText
    * @param {string} text - The line of text to draw.
    * @param {number} x - X position of the debug info to be rendered.
    * @param {number} y - Y position of the debug info to be rendered.
    * @param {string} [color] - Color of the debug info to be rendered (format is css color string).
    * @param {string} font - The font of text to draw.
    */    
    renderText: function (text, x, y, color, font) {

        if (this.context == null)
        {
            return;
        }

        color = color || 'rgb(255,255,255)';
        font = font || '16px Courier';

        this.start();
        this.context.font = font;
        this.context.fillStyle = color;
        this.context.fillText(text, x, y);
        this.stop();

    },

    /**
    * Dumps the Linked List to the console.
    * 
    * @method Phaser.Utils.Debug#Phaser.LinkedList#dump 
    * @param {Phaser.LinkedList} list - The LinkedList to dump.
    */
    dumpLinkedList: function (list) {

        var spacing = 20;

        var output = "\n" + Phaser.Utils.pad('Node', spacing) + "|" + Phaser.Utils.pad('Next', spacing) + "|" + Phaser.Utils.pad('Previous', spacing) + "|" + Phaser.Utils.pad('First', spacing) + "|" + Phaser.Utils.pad('Last', spacing);
        console.log(output);

        var output = Phaser.Utils.pad('----------', spacing) + "|" + Phaser.Utils.pad('----------', spacing) + "|" + Phaser.Utils.pad('----------', spacing) + "|" + Phaser.Utils.pad('----------', spacing) + "|" + Phaser.Utils.pad('----------', spacing);
        console.log(output);

        var entity = list;

        var testObject = entity.last.next;
        entity = entity.first;
        
        do  
        {
            var name = entity.sprite.name || '*';
            var nameNext = '-';
            var namePrev = '-';
            var nameFirst = '-';
            var nameLast = '-';

            if (entity.next)
            {
                nameNext = entity.next.sprite.name;
            }

            if (entity.prev)
            {
                namePrev = entity.prev.sprite.name;
            }

            if (entity.first)
            {
                nameFirst = entity.first.sprite.name;
            }

            if (entity.last)
            {
                nameLast = entity.last.sprite.name;
            }

            if (typeof nameNext === 'undefined')
            {
                nameNext = '-';
            }

            if (typeof namePrev === 'undefined')
            {
                namePrev = '-';
            }

            if (typeof nameFirst === 'undefined')
            {
                nameFirst = '-';
            }

            if (typeof nameLast === 'undefined')
            {
                nameLast = '-';
            }

            var output = Phaser.Utils.pad(name, spacing) + "|" + Phaser.Utils.pad(nameNext, spacing) + "|" + Phaser.Utils.pad(namePrev, spacing) + "|" + Phaser.Utils.pad(nameFirst, spacing) + "|" + Phaser.Utils.pad(nameLast, spacing);
            console.log(output);

            entity = entity.next;

        }
        while(entity != testObject)

    }


};

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A collection of methods useful for manipulating and comparing colors.
*
* @class Phaser.Color
*/
Phaser.Color = {

    /**
    * Given an alpha and 3 color values this will return an integer representation of it.
    *
    * @method Phaser.Color.getColor32
    * @param {number} alpha - The Alpha value (between 0 and 255).
    * @param {number} red - The Red channel value (between 0 and 255).
    * @param {number} green - The Green channel value (between 0 and 255).
    * @param {number} blue - The Blue channel value (between 0 and 255).
    * @returns {number} A native color value integer (format: 0xAARRGGBB).
    */
    getColor32: function (alpha, red, green, blue) {
        return alpha << 24 | red << 16 | green << 8 | blue;
    },

    /**
    * Given 3 color values this will return an integer representation of it.
    *
    * @method Phaser.Color.getColor
    * @param {number} red - The Red channel value (between 0 and 255).
    * @param {number} green - The Green channel value (between 0 and 255).
    * @param {number} blue - The Blue channel value (between 0 and 255).
    * @returns {number} A native color value integer (format: 0xRRGGBB).
    */
    getColor: function (red, green, blue) {
        return red << 16 | green << 8 | blue;
    },

    /**
    * Converts the given hex string into an object containing the RGB values.
    *
    * @method Phaser.Color.hexToRGB
    * @param {string} h - The string hex color to convert.
    * @returns {object} An object with 3 properties: r,g and b.
    */
    hexToRGB: function (h) {

        var hex16 = (h.charAt(0) == "#") ? h.substring(1, 7) : h;

        if (hex16.length==3) {
            hex16 = hex16.charAt(0) + hex16.charAt(0) + hex16.charAt(1) + hex16.charAt(1) + hex16.charAt(2) + hex16.charAt(2);
        }

        var red = parseInt(hex16.substring(0, 2), 16);
        var green = parseInt(hex16.substring(2, 4), 16);
        var blue = parseInt(hex16.substring(4, 6), 16);

        return red << 16 | green << 8 | blue;
        
    },

    /**
    * Returns a string containing handy information about the given color including string hex value,
    * RGB format information and HSL information. Each section starts on a newline, 3 lines in total.
    *
    * @method Phaser.Color.getColorInfo
    * @param {number} color - A color value in the format 0xAARRGGBB.
    * @returns {string} String containing the 3 lines of information.
    */
    getColorInfo: function (color) {

        var argb = Phaser.Color.getRGB(color);
        var hsl = Phaser.Color.RGBtoHSV(color);
        
        //	Hex format
        var result = Phaser.Color.RGBtoHexstring(color) + "\n";
        
        //	RGB format
        result = result.concat("Alpha: " + argb.alpha + " Red: " + argb.red + " Green: " + argb.green + " Blue: " + argb.blue) + "\n";
        
        //	HSL info
        result = result.concat("Hue: " + hsl.hue + " Saturation: " + hsl.saturation + " Lightnes: " + hsl.lightness);

        return result;

    },

    /**
    * Return a string representation of the color in the format 0xAARRGGBB.
    *
    * @method Phaser.Color.RGBtoHexstring
    * @param {number} color - The color to get the string representation for
    * @returns {string} A string of length 10 characters in the format 0xAARRGGBB
    */
    RGBtoHexstring: function (color) {

        var argb = Phaser.Color.getRGB(color);

        return "0x" + Phaser.Color.colorToHexstring(argb.alpha) + Phaser.Color.colorToHexstring(argb.red) + Phaser.Color.colorToHexstring(argb.green) + Phaser.Color.colorToHexstring(argb.blue);

    },

    /**
    * Return a string representation of the color in the format #RRGGBB.
    *
    * @method Phaser.Color.RGBtoWebstring
    * @param {number} color - The color to get the string representation for.
    * @returns {string} A string of length 10 characters in the format 0xAARRGGBB.
    */
    RGBtoWebstring: function (color) {

        var argb = Phaser.Color.getRGB(color);

        return "#" + Phaser.Color.colorToHexstring(argb.red) + Phaser.Color.colorToHexstring(argb.green) + Phaser.Color.colorToHexstring(argb.blue);

    },

    /**
    * Return a string containing a hex representation of the given color.
    *
    * @method Phaser.Color.colorToHexstring
    * @param {number} color - The color channel to get the hex value for, must be a value between 0 and 255).
    * @returns {string} A string of length 2 characters, i.e. 255 = FF, 0 = 00.
    */
    colorToHexstring: function (color) {

        var digits = "0123456789ABCDEF";
        var lsd = color % 16;
        var msd = (color - lsd) / 16;
        var hexified = digits.charAt(msd) + digits.charAt(lsd);
        return hexified;

    },

    /**
    * Interpolates the two given colours based on the supplied step and currentStep properties.
    * @method Phaser.Color.interpolateColor
    * @param {number} color1 - Description.
    * @param {number} color2 - Description.
    * @param {number} steps - Description.
    * @param {number} currentStep - Description.
    * @param {number} alpha - Description.
    * @returns {number} The interpolated color value.
    */
    interpolateColor: function (color1, color2, steps, currentStep, alpha) {

        if (typeof alpha === "undefined") { alpha = 255; }

        var src1 = Phaser.Color.getRGB(color1);
        var src2 = Phaser.Color.getRGB(color2);
        var r = (((src2.red - src1.red) * currentStep) / steps) + src1.red;
        var g = (((src2.green - src1.green) * currentStep) / steps) + src1.green;
        var b = (((src2.blue - src1.blue) * currentStep) / steps) + src1.blue;

        return Phaser.Color.getColor32(alpha, r, g, b);

    },

    /**
    * Interpolates the two given colours based on the supplied step and currentStep properties.
    * @method Phaser.Color.interpolateColorWithRGB
    * @param {number} color - Description.
    * @param {number} r - Description.
    * @param {number} g - Description.
    * @param {number} b - Description.
    * @param {number} steps - Description.
    * @param {number} currentStep - Description.
    * @returns {number} The interpolated color value.
    */
    interpolateColorWithRGB: function (color, r, g, b, steps, currentStep) {

        var src = Phaser.Color.getRGB(color);
        var or = (((r - src.red) * currentStep) / steps) + src.red;
        var og = (((g - src.green) * currentStep) / steps) + src.green;
        var ob = (((b - src.blue) * currentStep) / steps) + src.blue;

        return Phaser.Color.getColor(or, og, ob);

    },

    /**
    * Interpolates the two given colours based on the supplied step and currentStep properties.
    * @method Phaser.Color.interpolateRGB
    * @param {number} r1 - Description.
    * @param {number} g1 - Description.
    * @param {number} b1 - Description.
    * @param {number} r2 - Description.
    * @param {number} g2 - Description.
    * @param {number} b2 - Description.
    * @param {number} steps - Description.
    * @param {number} currentStep - Description.
    * @returns {number} The interpolated color value.
    */
    interpolateRGB: function (r1, g1, b1, r2, g2, b2, steps, currentStep) {

        var r = (((r2 - r1) * currentStep) / steps) + r1;
        var g = (((g2 - g1) * currentStep) / steps) + g1;
        var b = (((b2 - b1) * currentStep) / steps) + b1;

        return Phaser.Color.getColor(r, g, b);

    },

    /**
    * Returns a random color value between black and white
    * <p>Set the min value to start each channel from the given offset.</p>
    * <p>Set the max value to restrict the maximum color used per channel</p>
    *
    * @method Phaser.Color.getRandomColor
    * @param {number} min - The lowest value to use for the color.
    * @param {number} max - The highest value to use for the color.
    * @param {number} alpha - The alpha value of the returning color (default 255 = fully opaque).
    * @returns {number} 32-bit color value with alpha.
    */
    getRandomColor: function (min, max, alpha) {

        if (typeof min === "undefined") { min = 0; }
        if (typeof max === "undefined") { max = 255; }
        if (typeof alpha === "undefined") { alpha = 255; }

        //	Sanity checks
        if (max > 255) {
            return Phaser.Color.getColor(255, 255, 255);
        }

        if (min > max) {
            return Phaser.Color.getColor(255, 255, 255);
        }

        var red = min + Math.round(Math.random() * (max - min));
        var green = min + Math.round(Math.random() * (max - min));
        var blue = min + Math.round(Math.random() * (max - min));

        return Phaser.Color.getColor32(alpha, red, green, blue);

    },

    /**
    * Return the component parts of a color as an Object with the properties alpha, red, green, blue
    *
    * <p>Alpha will only be set if it exist in the given color (0xAARRGGBB)</p>
    *
    * @method Phaser.Color.getRGB
    * @param {number} color - Color in RGB (0xRRGGBB) or ARGB format (0xAARRGGBB).
    * @returns {object} An Object with properties: alpha, red, green, blue.
    */
    getRGB: function (color) {

        return {
            alpha: color >>> 24,
            red: color >> 16 & 0xFF,
            green: color >> 8 & 0xFF,
            blue: color & 0xFF
        };

    },

    /**
    * Returns a CSS friendly string value from the given color.
    * @method Phaser.Color.getWebRGB
    * @param {number} color
    * @returns {string}A string in the format: 'rgba(r,g,b,a)'
    */
    getWebRGB: function (color) {

        var alpha = (color >>> 24) / 255;
        var red = color >> 16 & 0xFF;
        var green = color >> 8 & 0xFF;
        var blue = color & 0xFF;

        return 'rgba(' + red.toString() + ',' + green.toString() + ',' + blue.toString() + ',' + alpha.toString() + ')';
        
    },

    /**
    * Given a native color value (in the format 0xAARRGGBB) this will return the Alpha component, as a value between 0 and 255.
    *
    * @method Phaser.Color.getAlpha
    * @param {number} color - In the format 0xAARRGGBB.
    * @returns {number} The Alpha component of the color, will be between 0 and 1 (0 being no Alpha (opaque), 1 full Alpha (transparent)).
    */
    getAlpha: function (color) {
        return color >>> 24;
    },

    /**
    * Given a native color value (in the format 0xAARRGGBB) this will return the Alpha component as a value between 0 and 1.
    *
    * @method Phaser.Color.getAlphaFloat
    * @param {number} color - In the format 0xAARRGGBB.
    * @returns {number} The Alpha component of the color, will be between 0 and 1 (0 being no Alpha (opaque), 1 full Alpha (transparent)).
    */
    getAlphaFloat: function (color) {
        return (color >>> 24) / 255;
    },

    /**
    * Given a native color value (in the format 0xAARRGGBB) this will return the Red component, as a value between 0 and 255.
    *
    * @method Phaser.Color.getRed
    * @param {number} color In the format 0xAARRGGBB.
    * @returns {number} The Red component of the color, will be between 0 and 255 (0 being no color, 255 full Red).
    */
    getRed: function (color) {
        return color >> 16 & 0xFF;
    },

    /**
    * Given a native color value (in the format 0xAARRGGBB) this will return the Green component, as a value between 0 and 255.
    *
    * @method Phaser.Color.getGreen
    * @param {number} color - In the format 0xAARRGGBB.
    * @returns {number} The Green component of the color, will be between 0 and 255 (0 being no color, 255 full Green).
    */
    getGreen: function (color) {
        return color >> 8 & 0xFF;
    },

    /**
    * Given a native color value (in the format 0xAARRGGBB) this will return the Blue component, as a value between 0 and 255.
    *
    * @method Phaser.Color.getBlue
    * @param {number} color - In the format 0xAARRGGBB.
    * @returns {number} The Blue component of the color, will be between 0 and 255 (0 being no color, 255 full Blue).
    */
    getBlue: function (color) {
        return color & 0xFF;
    }
	
};

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* @class Phaser.Physics
*/
Phaser.Physics = {};

/**
* Arcade Physics constructor.
*
* @class Phaser.Physics.Arcade
* @classdesc Arcade Physics Constructor
* @constructor
* @param {Phaser.Game} game reference to the current game instance.
*/
Phaser.Physics.Arcade = function (game) {
    
    /**
    * @property {Phaser.Game} game - Local reference to game.
    */
    this.game = game;

    /**
    * @property {Phaser.Point} gravity - The World gravity setting. Defaults to x: 0, y: 0, or no gravity.
    */
    this.gravity = new Phaser.Point;

    /**
    * @property {Phaser.Rectangle} bounds - The bounds inside of which the physics world exists. Defaults to match the world bounds.
    */
    this.bounds = new Phaser.Rectangle(0, 0, game.world.width, game.world.height);

    /**
    * @property {number} maxObjects - Used by the QuadTree to set the maximum number of objects per quad.
    */
    this.maxObjects = 10;

    /**
    * @property {number} maxLevels - Used by the QuadTree to set the maximum number of iteration levels.
    */
    this.maxLevels = 4;

    /**
    * @property {number} OVERLAP_BIAS - A value added to the delta values during collision checks.
    */
    this.OVERLAP_BIAS = 4;

    /**
    * @property {Phaser.QuadTree} quadTree - The world QuadTree.
    */
    this.quadTree = new Phaser.QuadTree(this, this.game.world.bounds.x, this.game.world.bounds.y, this.game.world.bounds.width, this.game.world.bounds.height, this.maxObjects, this.maxLevels);

    /**
    * @property {number} quadTreeID - The QuadTree ID.
    */
    this.quadTreeID = 0;

    //  Avoid gc spikes by caching these values for re-use

    /**
    * @property {Phaser.Rectangle} _bounds1 - Internal cache var.
    * @private
    */
    this._bounds1 = new Phaser.Rectangle;

    /**
    * @property {Phaser.Rectangle} _bounds2 - Internal cache var.
    * @private
    */
    this._bounds2 = new Phaser.Rectangle;

    /**
    * @property {number} _overlap - Internal cache var.
    * @private
    */
    this._overlap = 0;

    /**
    * @property {number} _maxOverlap - Internal cache var.
    * @private
    */
    this._maxOverlap = 0;

    /**
    * @property {number} _velocity1 - Internal cache var.
    * @private
    */
    this._velocity1 = 0;

    /**
    * @property {number} _velocity2 - Internal cache var.
    * @private
    */
    this._velocity2 = 0;

    /**
    * @property {number} _newVelocity1 - Internal cache var.
    * @private
    */
    this._newVelocity1 = 0;

    /**
    * @property {number} _newVelocity2 - Internal cache var.
    * @private
    */
    this._newVelocity2 = 0;

    /**
    * @property {number} _average - Internal cache var.
    * @private
    */
    this._average = 0;

    /**
    * @property {Array} _mapData - Internal cache var.
    * @private
    */
    this._mapData = [];

    /**
    * @property {number} _mapTiles - Internal cache var.
    * @private
    */
    this._mapTiles = 0;

    /**
    * @property {boolean} _result - Internal cache var.
    * @private
    */
    this._result = false;

    /**
    * @property {number} _total - Internal cache var.
    * @private
    */
    this._total = 0;

    /**
    * @property {number} _angle - Internal cache var.
    * @private
    */
    this._angle = 0;

    /**
    * @property {number} _dx - Internal cache var.
    * @private
    */
    this._dx = 0;

    /**
    * @property {number} _dy - Internal cache var.
    * @private
    */
    this._dy = 0;

};

Phaser.Physics.Arcade.prototype = {

    /**
    * Called automatically by a Physics body, it updates all motion related values on the Body.
    *
    * @method Phaser.Physics.Arcade#updateMotion
    * @param {Phaser.Physics.Arcade.Body} The Body object to be updated.
    */
    updateMotion: function (body) {

        //  If you're wondering why the velocity is halved and applied twice, read this: http://www.niksula.hut.fi/~hkankaan/Homepages/gravity.html

        //  Rotation
        this._velocityDelta = (this.computeVelocity(0, body, body.angularVelocity, body.angularAcceleration, body.angularDrag, body.maxAngular) - body.angularVelocity) / 2;
        body.angularVelocity += this._velocityDelta;
        body.rotation += (body.angularVelocity * this.game.time.physicsElapsed);
        body.angularVelocity += this._velocityDelta;

        //  Horizontal
        this._velocityDelta = (this.computeVelocity(1, body, body.velocity.x, body.acceleration.x, body.drag.x, body.maxVelocity.x) - body.velocity.x) / 2;
        body.velocity.x += this._velocityDelta;
        body.x += (body.velocity.x * this.game.time.physicsElapsed);
        body.velocity.x += this._velocityDelta;

        //  Vertical
        this._velocityDelta = (this.computeVelocity(2, body, body.velocity.y, body.acceleration.y, body.drag.y, body.maxVelocity.y) - body.velocity.y) / 2;
        body.velocity.y += this._velocityDelta;
        body.y += (body.velocity.y * this.game.time.physicsElapsed);
        body.velocity.y += this._velocityDelta;

    },

    /**
    * A tween-like function that takes a starting velocity and some other factors and returns an altered velocity.
    *
    * @method Phaser.Physics.Arcade#computeVelocity
    * @param {number} axis - 1 for horizontal, 2 for vertical.
    * @param {Phaser.Physics.Arcade.Body} body - The Body object to be updated.
    * @param {number} velocity - Any component of velocity (e.g. 20).
    * @param {number} acceleration - Rate at which the velocity is changing.
    * @param {number} drag - Really kind of a deceleration, this is how much the velocity changes if Acceleration is not set.
    * @param {number} mMax - An absolute value cap for the velocity.
    * @return {number} The altered Velocity value.
    */
    computeVelocity: function (axis, body, velocity, acceleration, drag, max) {

        max = max || 10000;

        if (axis == 1 && body.allowGravity)
        {
            velocity += this.gravity.x + body.gravity.x;
        }
        else if (axis == 2 && body.allowGravity)
        {
            velocity += this.gravity.y + body.gravity.y;
        }

        if (acceleration !== 0)
        {
            velocity += acceleration * this.game.time.physicsElapsed;
        }
        else if (drag !== 0)
        {
            this._drag = drag * this.game.time.physicsElapsed;

            if (velocity - this._drag > 0)
            {
                velocity -= this._drag;
            }
            else if (velocity + this._drag < 0)
            {
                velocity += this._drag;
            }
            else
            {
                velocity = 0;
            }
        }

        if (velocity > max)
        {
            velocity = max;
        }
        else if (velocity < -max)
        {
            velocity = -max;
        }

        return velocity;

    },

    /**
    * Called automatically by the core game loop.
    *
    * @method Phaser.Physics.Arcade#preUpdate
    * @protected
    */
    preUpdate: function () {

        //  Clear the tree
        this.quadTree.clear();

        //  Create our tree which all of the Physics bodies will add themselves to
        this.quadTreeID = 0;
        this.quadTree = new Phaser.QuadTree(this, this.game.world.bounds.x, this.game.world.bounds.y, this.game.world.bounds.width, this.game.world.bounds.height, this.maxObjects, this.maxLevels);

    },

    /**
    * Called automatically by the core game loop.
    *
    * @method Phaser.Physics.Arcade#postUpdate
    * @protected
    */
    postUpdate: function () {

        //  Clear the tree ready for the next update
        this.quadTree.clear();

    },

    /**
    * Checks if two Sprite objects overlap.
    *
    * @method Phaser.Physics.Arcade#overlap
    * @param {Phaser.Sprite} object1 - The first object to check. Can be an instance of Phaser.Sprite or anything that extends it.
    * @param {Phaser.Sprite} object2 - The second object to check. Can be an instance of Phaser.Sprite or anything that extends it.
    * @returns {boolean} true if the two objects overlap.
    */
    overlap: function (object1, object2) {

        //  Only test valid objects
        if (object1 && object2 && object1.exists && object2.exists)
        {
            return (Phaser.Rectangle.intersects(object1.body, object2.body));
        }

        return false;

    },

    /**
    * Checks for collision between two game objects. The objects can be Sprites, Groups, Emitters or Tilemaps.
    * You can perform Sprite vs. Sprite, Sprite vs. Group, Group vs. Group, Sprite vs. Tilemap or Group vs. Tilemap collisions.
    * The objects are also automatically separated.
    *
    * @method Phaser.Physics.Arcade#collide
    * @param {Phaser.Sprite|Phaser.Group|Phaser.Particles.Emitter|Phaser.Tilemap} object1 - The first object to check. Can be an instance of Phaser.Sprite, Phaser.Group, Phaser.Particles.Emitter, or Phaser.Tilemap
    * @param {Phaser.Sprite|Phaser.Group|Phaser.Particles.Emitter|Phaser.Tilemap} object2 - The second object to check. Can be an instance of Phaser.Sprite, Phaser.Group, Phaser.Particles.Emitter or Phaser.Tilemap
    * @param {function} [collideCallback=null] - An optional callback function that is called if the objects overlap. The two objects will be passed to this function in the same order in which you passed them to Collision.overlap.
    * @param {function} [processCallback=null] - A callback function that lets you perform additional checks against the two objects if they overlap. If this is set then collideCallback will only be called if processCallback returns true.
    * @param {object} [callbackContext] - The context in which to run the callbacks.
    * @returns {number} The number of collisions that were processed.
    */
    collide: function (object1, object2, collideCallback, processCallback, callbackContext) {

        collideCallback = collideCallback || null;
        processCallback = processCallback || null;
        callbackContext = callbackContext || collideCallback;

        this._result = false;
        this._total = 0;

        //  Only collide valid objects
        if (object1 && object2 && object1.exists && object2.exists)
        {
            //  Can expand to support Buttons, Text, etc at a later date. For now these are the essentials.

            //  SPRITES
            if (object1.type == Phaser.SPRITE)
            {
                if (object2.type == Phaser.SPRITE)
                {
                    this.collideSpriteVsSprite(object1, object2, collideCallback, processCallback, callbackContext);
                }
                else if (object2.type == Phaser.GROUP || object2.type == Phaser.EMITTER)
                {
                    this.collideSpriteVsGroup(object1, object2, collideCallback, processCallback, callbackContext);
                }
                else if (object2.type == Phaser.TILEMAPLAYER)
                {
                    this.collideSpriteVsTilemapLayer(object1, object2, collideCallback, processCallback, callbackContext);
                }
            }
            //  GROUPS
            else if (object1.type == Phaser.GROUP)
            {
                if (object2.type == Phaser.SPRITE)
                {
                    this.collideSpriteVsGroup(object2, object1, collideCallback, processCallback, callbackContext);
                }
                else if (object2.type == Phaser.GROUP || object2.type == Phaser.EMITTER)
                {
                    this.collideGroupVsGroup(object1, object2, collideCallback, processCallback, callbackContext);
                }
                else if (object2.type == Phaser.TILEMAPLAYER)
                {
                    this.collideGroupVsTilemapLayer(object1, object2, collideCallback, processCallback, callbackContext);
                }
            }
            //  TILEMAP LAYERS
            else if (object1.type == Phaser.TILEMAPLAYER)
            {
                if (object2.type == Phaser.SPRITE)
                {
                    this.collideSpriteVsTilemapLayer(object2, object1, collideCallback, processCallback, callbackContext);
                }
                else if (object2.type == Phaser.GROUP || object2.type == Phaser.EMITTER)
                {
                    this.collideGroupVsTilemapLayer(object2, object1, collideCallback, processCallback, callbackContext);
                }
            }
            //  EMITTER
            else if (object1.type == Phaser.EMITTER)
            {
                if (object2.type == Phaser.SPRITE)
                {
                    this.collideSpriteVsGroup(object2, object1, collideCallback, processCallback, callbackContext);
                }
                else if (object2.type == Phaser.GROUP || object2.type == Phaser.EMITTER)
                {
                    this.collideGroupVsGroup(object1, object2, collideCallback, processCallback, callbackContext);
                }
                else if (object2.type == Phaser.TILEMAPLAYER)
                {
                    this.collideGroupVsTilemapLayer(object1, object2, collideCallback, processCallback, callbackContext);
                }
            }
        }

        return (this._total > 0);

    },

    /**
    * An internal function. Use Phaser.Physics.Arcade.collide instead.
    *
    * @method Phaser.Physics.Arcade#collideSpriteVsTilemapLayer
    * @private
    */
    collideSpriteVsTilemapLayer: function (sprite, tilemapLayer, collideCallback, processCallback, callbackContext) {

        this._mapData = tilemapLayer.getTiles(sprite.body.x, sprite.body.y, sprite.body.width, sprite.body.height, true);

        if (this._mapData.length == 0)
        {
            return;
        }

        for (var i = 0; i < this._mapData.length; i++)
        {
            if (this.separateTile(sprite.body, this._mapData[i]))
            {
                //  They collided, is there a custom process callback?
                if (processCallback)
                {
                    if (processCallback.call(callbackContext, sprite, this._mapData[i]))
                    {
                        this._total++;

                        if (collideCallback)
                        {
                            collideCallback.call(callbackContext, sprite, this._mapData[i]);
                        }
                    }
                }
                else
                {
                    this._total++;

                    if (collideCallback)
                    {
                        collideCallback.call(callbackContext, sprite, this._mapData[i]);
                    }
                }
            }
        }

    },

    /**
    * An internal function. Use Phaser.Physics.Arcade.collide instead.
    *
    * @method Phaser.Physics.Arcade#collideGroupVsTilemapLayer
    * @private
    */
    collideGroupVsTilemapLayer: function (group, tilemapLayer, collideCallback, processCallback, callbackContext) {

        if (group.length == 0)
        {
            return;
        }

        if (group.length == 0)
        {
            return;
        }

        if (group._container.first._iNext)
        {
            var currentNode = group._container.first._iNext;
                
            do  
            {
                if (currentNode.exists)
                {
                    this.collideSpriteVsTilemapLayer(currentNode, tilemapLayer, collideCallback, processCallback, callbackContext);
                }
                currentNode = currentNode._iNext;
            }
            while (currentNode != group._container.last._iNext);
        }

    },

    /**
    * An internal function. Use Phaser.Physics.Arcade.collide instead.
    *
    * @method Phaser.Physics.Arcade#collideSpriteVsSprite
    * @private
    */
    collideSpriteVsSprite: function (sprite1, sprite2, collideCallback, processCallback, callbackContext) {

        this.separate(sprite1.body, sprite2.body);

        if (this._result)
        {
            //  They collided, is there a custom process callback?
            if (processCallback)
            {
                if (processCallback.call(callbackContext, sprite1, sprite2))
                {
                    this._total++;

                    if (collideCallback)
                    {
                        collideCallback.call(callbackContext, sprite1, sprite2);
                    }
                }
            }
            else
            {
                this._total++;

                if (collideCallback)
                {
                    collideCallback.call(callbackContext, sprite1, sprite2);
                }
            }
        }

    },

    /**
    * An internal function. Use Phaser.Physics.Arcade.collide instead.
    *
    * @method Phaser.Physics.Arcade#collideSpriteVsGroup
    * @private
    */
    collideSpriteVsGroup: function (sprite, group, collideCallback, processCallback, callbackContext) {

        if (group.length == 0)
        {
            return;
        }

        //  What is the sprite colliding with in the quadtree?
        this._potentials = this.quadTree.retrieve(sprite);

        for (var i = 0, len = this._potentials.length; i < len; i++)
        {
            //  We have our potential suspects, are they in this group?
            if (this._potentials[i].sprite.group == group)
            {
                this.separate(sprite.body, this._potentials[i]);

                if (this._result && processCallback)
                {
                    this._result = processCallback.call(callbackContext, sprite, this._potentials[i].sprite);
                }

                if (this._result)
                {
                    this._total++;

                    if (collideCallback)
                    {
                        collideCallback.call(callbackContext, sprite, this._potentials[i].sprite);
                    }
                }
            }
        }

    },

    /**
    * An internal function. Use Phaser.Physics.Arcade.collide instead.
    *
    * @method Phaser.Physics.Arcade#collideGroupVsGroup
    * @private
    */
    collideGroupVsGroup: function (group1, group2, collideCallback, processCallback, callbackContext) {

        if (group1.length == 0 || group2.length == 0)
        {
            return;
        }

        if (group1._container.first._iNext)
        {
            var currentNode = group1._container.first._iNext;
                
            do  
            {
                if (currentNode.exists)
                {
                    this.collideSpriteVsGroup(currentNode, group2, collideCallback, processCallback, callbackContext);
                }
                currentNode = currentNode._iNext;
            }
            while (currentNode != group1._container.last._iNext);
        }

    },

    /**
    * The core separation function to separate two physics bodies.
    * @method Phaser.Physics.Arcade#separate
    * @param {Phaser.Physics.Arcade.Body} body1 - The Body object to separate.
    * @param {Phaser.Physics.Arcade.Body} body2 - The Body object to separate.
    * @returns {boolean} Returns true if the bodies were separated, otherwise false.
    */
    separate: function (body1, body2) {

        this._result = (this.separateX(body1, body2) || this.separateY(body1, body2));

    },

    /**
    * The core separation function to separate two physics bodies on the x axis.
    * @method Phaser.Physics.Arcade#separateX
    * @param {Phaser.Physics.Arcade.Body} body1 - The Body object to separate.
    * @param {Phaser.Physics.Arcade.Body} body2 - The Body object to separate.
    * @returns {boolean} Returns true if the bodies were separated, otherwise false.
    */
    separateX: function (body1, body2) {

        //  Can't separate two immovable bodies
        if (body1.immovable && body2.immovable)
        {
            return false;
        }

        this._overlap = 0;

        //  Check if the hulls actually overlap
        if (Phaser.Rectangle.intersects(body1, body2))
        {
            this._maxOverlap = body1.deltaAbsX() + body2.deltaAbsX() + this.OVERLAP_BIAS;

            if (body1.deltaX() == 0 && body2.deltaX() == 0)
            {
                //  They overlap but neither of them are moving
                body1.embedded = true;
                body2.embedded = true;
            }
            else if (body1.deltaX() > body2.deltaX())
            {
                //  Body1 is moving right and/or Body2 is moving left
                this._overlap = body1.x + body1.width - body2.x;

                if ((this._overlap > this._maxOverlap) || body1.allowCollision.right == false || body2.allowCollision.left == false)
                {
                    this._overlap = 0;
                }
                else
                {
                    body1.touching.right = true;
                    body2.touching.left = true;
                }
            }
            else if (body1.deltaX() < body2.deltaX())
            {
                //  Body1 is moving left and/or Body2 is moving right
                this._overlap = body1.x - body2.width - body2.x;

                if ((-this._overlap > this._maxOverlap) || body1.allowCollision.left == false || body2.allowCollision.right == false)
                {
                    this._overlap = 0;
                }
                else
                {
                    body1.touching.left = true;
                    body2.touching.right = true;
                }
            }

            //  Then adjust their positions and velocities accordingly (if there was any overlap)
            if (this._overlap != 0)
            {
                body1.overlapX = this._overlap;
                body2.overlapX = this._overlap;

                if (body1.customSeparateX || body2.customSeparateX)
                {
                    return true;
                }

                this._velocity1 = body1.velocity.x;
                this._velocity2 = body2.velocity.x;

                if (!body1.immovable && !body2.immovable)
                {
                    this._overlap *= 0.5;

                    body1.x = body1.x - this._overlap;
                    body2.x += this._overlap;

                    this._newVelocity1 = Math.sqrt((this._velocity2 * this._velocity2 * body2.mass) / body1.mass) * ((this._velocity2 > 0) ? 1 : -1);
                    this._newVelocity2 = Math.sqrt((this._velocity1 * this._velocity1 * body1.mass) / body2.mass) * ((this._velocity1 > 0) ? 1 : -1);
                    this._average = (this._newVelocity1 + this._newVelocity2) * 0.5;
                    this._newVelocity1 -= this._average;
                    this._newVelocity2 -= this._average;

                    body1.velocity.x = this._average + this._newVelocity1 * body1.bounce.x;
                    body2.velocity.x = this._average + this._newVelocity2 * body2.bounce.x;
                }
                else if (!body1.immovable)
                {
                    body1.x = body1.x - this._overlap;
                    body1.velocity.x = this._velocity2 - this._velocity1 * body1.bounce.x;
                }
                else if (!body2.immovable)
                {
                    body2.x += this._overlap;
                    body2.velocity.x = this._velocity1 - this._velocity2 * body2.bounce.x;
                }

                return true;
            }
        }

        return false;

    },

    /**
    * The core separation function to separate two physics bodies on the y axis.
    * @method Phaser.Physics.Arcade#separateY
    * @param {Phaser.Physics.Arcade.Body} body1 - The Body object to separate.
    * @param {Phaser.Physics.Arcade.Body} body2 - The Body object to separate.
    * @returns {boolean} Returns true if the bodies were separated, otherwise false.
    */
    separateY: function (body1, body2) {

        //  Can't separate two immovable or non-existing bodys
        if (body1.immovable && body2.immovable)
        {
            return false;
        }

        this._overlap = 0;

        //  Check if the hulls actually overlap
        if (Phaser.Rectangle.intersects(body1, body2))
        {
            this._maxOverlap = body1.deltaAbsY() + body2.deltaAbsY() + this.OVERLAP_BIAS;

            if (body1.deltaY() == 0 && body2.deltaY() == 0)
            {
                //  They overlap but neither of them are moving
                body1.embedded = true;
                body2.embedded = true;
            }
            else if (body1.deltaY() > body2.deltaY())
            {
                //  Body1 is moving down and/or Body2 is moving up
                this._overlap = body1.y + body1.height - body2.y;

                if ((this._overlap > this._maxOverlap) || body1.allowCollision.down == false || body2.allowCollision.up == false)
                {
                    this._overlap = 0;
                }
                else
                {
                    body1.touching.down = true;
                    body2.touching.up = true;
                }
            }
            else if (body1.deltaY() < body2.deltaY())
            {
                //  Body1 is moving up and/or Body2 is moving down
                this._overlap = body1.y - body2.height - body2.y;

                if ((-this._overlap > this._maxOverlap) || body1.allowCollision.up == false || body2.allowCollision.down == false)
                {
                    this._overlap = 0;
                }
                else
                {
                    body1.touching.up = true;
                    body2.touching.down = true;
                }
            }

            //  Then adjust their positions and velocities accordingly (if there was any overlap)
            if (this._overlap != 0)
            {
                body1.overlapY = this._overlap;
                body2.overlapY = this._overlap;

                if (body1.customSeparateY || body2.customSeparateY)
                {
                    return true;
                }

                this._velocity1 = body1.velocity.y;
                this._velocity2 = body2.velocity.y;

                if (!body1.immovable && !body2.immovable)
                {
                    this._overlap *= 0.5;

                    body1.y = body1.y - this._overlap;
                    body2.y += this._overlap;

                    this._newVelocity1 = Math.sqrt((this._velocity2 * this._velocity2 * body2.mass) / body1.mass) * ((this._velocity2 > 0) ? 1 : -1);
                    this._newVelocity2 = Math.sqrt((this._velocity1 * this._velocity1 * body1.mass) / body2.mass) * ((this._velocity1 > 0) ? 1 : -1);
                    this._average = (this._newVelocity1 + this._newVelocity2) * 0.5;
                    this._newVelocity1 -= this._average;
                    this._newVelocity2 -= this._average;

                    body1.velocity.y = this._average + this._newVelocity1 * body1.bounce.y;
                    body2.velocity.y = this._average + this._newVelocity2 * body2.bounce.y;
                }
                else if (!body1.immovable)
                {
                    body1.y = body1.y - this._overlap;
                    body1.velocity.y = this._velocity2 - this._velocity1 * body1.bounce.y;

                    //  This is special case code that handles things like horizontal moving platforms you can ride
                    if (body2.active && body2.moves && (body1.deltaY() > body2.deltaY()))
                    {
                        body1.x += body2.x - body2.lastX;
                    }
                }
                else if (!body2.immovable)
                {
                    body2.y += this._overlap;
                    body2.velocity.y = this._velocity1 - this._velocity2 * body2.bounce.y;

                    //  This is special case code that handles things like horizontal moving platforms you can ride
                    if (body1.sprite.active && body1.moves && (body1.deltaY() < body2.deltaY()))
                    {
                        body2.x += body1.x - body1.lastX;
                    }
                }

                return true;
            }

        }

        return false;

    },

    /**
    * The core separation function to separate a physics body and a tile.
    * @method Phaser.Physics.Arcade#separateTile
    * @param {Phaser.Physics.Arcade.Body} body1 - The Body object to separate.
    * @param {Phaser.Tile} tile - The tile to collide against.
    * @returns {boolean} Returns true if the bodies were separated, otherwise false.
    */
    separateTile: function (body, tile) {

        this._result = (this.separateTileX(body, tile, true) || this.separateTileY(body, tile, true));

    },

    /**
    * The core separation function to separate a physics body and a tile on the x axis.
    * @method Phaser.Physics.Arcade#separateTileX
    * @param {Phaser.Physics.Arcade.Body} body1 - The Body object to separate.
    * @param {Phaser.Tile} tile - The tile to collide against.
    * @returns {boolean} Returns true if the bodies were separated, otherwise false.
    */
    separateTileX: function (body, tile, separate) {

        //  Can't separate two immovable objects (tiles are always immovable)
        if (body.immovable || body.deltaX() == 0 || Phaser.Rectangle.intersects(body.hullX, tile) == false)
        {
            return false;
        }

        this._overlap = 0;

        //  The hulls overlap, let's process it
        // this._maxOverlap = body.deltaAbsX() + this.OVERLAP_BIAS;

        if (body.deltaX() < 0)
        {
            //  Moving left
            this._overlap = tile.right - body.hullX.x;

            // if ((this._overlap > this._maxOverlap) || body.allowCollision.left == false || tile.tile.collideRight == false)
            if (body.allowCollision.left == false || tile.tile.collideRight == false)
            {
                this._overlap = 0;
            }
            else
            {
                body.touching.left = true;
            }
        }
        else
        {
            //  Moving right
            this._overlap = body.hullX.right - tile.x;

            // if ((this._overlap > this._maxOverlap) || body.allowCollision.right == false || tile.tile.collideLeft == false)
            if (body.allowCollision.right == false || tile.tile.collideLeft == false)
            {
                this._overlap = 0;
            }
            else
            {
                body.touching.right = true;
            }
        }

        //  Then adjust their positions and velocities accordingly (if there was any overlap)
        if (this._overlap != 0)
        {
            if (separate)
            {
                if (body.deltaX() < 0)
                {
                    body.x = body.x + this._overlap;
                }
                else
                {
                    body.x = body.x - this._overlap;
                }

                if (body.bounce.x == 0)
                {
                    body.velocity.x = 0;
                }
                else
                {
                    body.velocity.x = -body.velocity.x * body.bounce.x;
                }

                body.updateHulls();
            }

            return true;
        }
        else
        {
            return false;
        }

    },

    /**
    * The core separation function to separate a physics body and a tile on the x axis.
    * @method Phaser.Physics.Arcade#separateTileY
    * @param {Phaser.Physics.Arcade.Body} body1 - The Body object to separate.
    * @param {Phaser.Tile} tile - The tile to collide against.
    * @returns {boolean} Returns true if the bodies were separated, otherwise false.
    */
    separateTileY: function (body, tile, separate) {

        //  Can't separate two immovable objects (tiles are always immovable)
        if (body.immovable || body.deltaY() == 0 || Phaser.Rectangle.intersects(body.hullY, tile) == false)
        {
            return false;
        }

        this._overlap = 0;

        //  The hulls overlap, let's process it
        // this._maxOverlap = body.deltaAbsY() + this.OVERLAP_BIAS;

        if (body.deltaY() < 0)
        {
            //  Moving up
            this._overlap = tile.bottom - body.hullY.y;

            // if ((this._overlap > this._maxOverlap) || body.allowCollision.up == false || tile.tile.collideDown == false)
            if (body.allowCollision.up == false || tile.tile.collideDown == false)
            {
                this._overlap = 0;
            }
            else
            {
                body.touching.up = true;
            }
        }
        else
        {
            //  Moving down
            this._overlap = body.hullY.bottom - tile.y;

            // if ((this._overlap > this._maxOverlap) || body.allowCollision.down == false || tile.tile.collideUp == false)
            if (body.allowCollision.down == false || tile.tile.collideUp == false)
            {
                this._overlap = 0;
            }
            else
            {
                body.touching.down = true;
            }
        }

        //  Then adjust their positions and velocities accordingly (if there was any overlap)
        if (this._overlap != 0)
        {
            if (separate)
            {
                if (body.deltaY() < 0)
                {
                    body.y = body.y + this._overlap;
                }
                else
                {
                    body.y = body.y - this._overlap;
                }

                if (body.bounce.y == 0)
                {
                    body.velocity.y = 0;
                }
                else
                {
                    body.velocity.y = -body.velocity.y * body.bounce.y;
                }

                body.updateHulls();
            }
            
            return true;
        }
        else
        {
            return false;
        }

    },

    /**
    * Move the given display object towards the destination object at a steady velocity.
    * If you specify a maxTime then it will adjust the speed (over-writing what you set) so it arrives at the destination in that number of seconds.
    * Timings are approximate due to the way browser timers work. Allow for a variance of +- 50ms.
    * Note: The display object does not continuously track the target. If the target changes location during transit the display object will not modify its course.
    * Note: The display object doesn't stop moving once it reaches the destination coordinates.
    * Note: Doesn't take into account acceleration, maxVelocity or drag (if you've set drag or acceleration too high this object may not move at all)
    * 
    * @method Phaser.Physics.Arcade#moveToObject
    * @param {any} displayObject - The display object to move.
    * @param {any} destination - The display object to move towards. Can be any object but must have visible x/y properties.
    * @param {number} [speed=60] - The speed it will move, in pixels per second (default is 60 pixels/sec)
    * @param {number} [maxTime=0] - Time given in milliseconds (1000 = 1 sec). If set the speed is adjusted so the object will arrive at destination in the given number of ms.
    * @return {number} The angle (in radians) that the object should be visually set to in order to match its new velocity.
    */
    moveToObject: function (displayObject, destination, speed, maxTime) {

        if (typeof speed === 'undefined') { speed = 60; }
        if (typeof maxTime === 'undefined') { maxTime = 0; }

        this._angle = Math.atan2(destination.y - displayObject.y, destination.x - displayObject.x);
        
        if (maxTime > 0)
        {
            //  We know how many pixels we need to move, but how fast?
            speed = this.distanceBetween(displayObject, destination) / (maxTime / 1000);
        }
        
        displayObject.body.velocity.x = Math.cos(this._angle) * speed;
        displayObject.body.velocity.y = Math.sin(this._angle) * speed;

        return this._angle;

    },

    /**
    * Move the given display object towards the pointer at a steady velocity. If no pointer is given it will use Phaser.Input.activePointer.
    * If you specify a maxTime then it will adjust the speed (over-writing what you set) so it arrives at the destination in that number of seconds.
    * Timings are approximate due to the way browser timers work. Allow for a variance of +- 50ms.
    * Note: The display object does not continuously track the target. If the target changes location during transit the display object will not modify its course.
    * Note: The display object doesn't stop moving once it reaches the destination coordinates.
    * 
    * @method Phaser.Physics.Arcade#moveToPointer
    * @param {any} displayObject - The display object to move.
    * @param {number} [speed=60] - The speed it will move, in pixels per second (default is 60 pixels/sec)
    * @param {Phaser.Pointer} [pointer] - The pointer to move towards. Defaults to Phaser.Input.activePointer.
    * @param {number} [maxTime=0] - Time given in milliseconds (1000 = 1 sec). If set the speed is adjusted so the object will arrive at destination in the given number of ms.
    * @return {number} The angle (in radians) that the object should be visually set to in order to match its new velocity.
    */
    moveToPointer: function (displayObject, speed, pointer, maxTime) {

        if (typeof speed === 'undefined') { speed = 60; }
        pointer = pointer || this.game.input.activePointer;
        if (typeof maxTime === 'undefined') { maxTime = 0; }

        this._angle = this.angleToPointer(displayObject, pointer);
        
        if (maxTime > 0)
        {
            //  We know how many pixels we need to move, but how fast?
            speed = this.distanceToPointer(displayObject, pointer) / (maxTime / 1000);
        }
        
        displayObject.body.velocity.x = Math.cos(this._angle) * speed;
        displayObject.body.velocity.y = Math.sin(this._angle) * speed;

        return this._angle;

    },

    /**
    * Move the given display object towards the x/y coordinates at a steady velocity.
    * If you specify a maxTime then it will adjust the speed (over-writing what you set) so it arrives at the destination in that number of seconds.
    * Timings are approximate due to the way browser timers work. Allow for a variance of +- 50ms.
    * Note: The display object does not continuously track the target. If the target changes location during transit the display object will not modify its course.
    * Note: The display object doesn't stop moving once it reaches the destination coordinates.
    * Note: Doesn't take into account acceleration, maxVelocity or drag (if you've set drag or acceleration too high this object may not move at all)
    * 
    * @method Phaser.Physics.Arcade#moveToXY
    * @param {any} displayObject - The display object to move.
    * @param {number} x - The x coordinate to move towards.
    * @param {number} y - The y coordinate to move towards.
    * @param {number} [speed=60] - The speed it will move, in pixels per second (default is 60 pixels/sec)
    * @param {number} [maxTime=0] - Time given in milliseconds (1000 = 1 sec). If set the speed is adjusted so the object will arrive at destination in the given number of ms.
    * @return {number} The angle (in radians) that the object should be visually set to in order to match its new velocity.
    */
    moveToXY: function (displayObject, x, y, speed, maxTime) {

        if (typeof speed === 'undefined') { speed = 60; }
        if (typeof maxTime === 'undefined') { maxTime = 0; }

        this._angle = Math.atan2(y - displayObject.y, x - displayObject.x);
        
        if (maxTime > 0)
        {
            //  We know how many pixels we need to move, but how fast?
            speed = this.distanceToXY(displayObject, x, y) / (maxTime / 1000);
        }
        
        displayObject.body.velocity.x = Math.cos(this._angle) * speed;
        displayObject.body.velocity.y = Math.sin(this._angle) * speed;

        return this._angle;

    },

    /**
    * Given the angle (in degrees) and speed calculate the velocity and return it as a Point object, or set it to the given point object.
    * One way to use this is: velocityFromAngle(angle, 200, sprite.velocity) which will set the values directly to the sprites velocity and not create a new Point object.
    * 
    * @method Phaser.Physics.Arcade#velocityFromAngle
    * @param {number} angle - The angle in degrees calculated in clockwise positive direction (down = 90 degrees positive, right = 0 degrees positive, up = 90 degrees negative)
    * @param {number} [speed=60] - The speed it will move, in pixels per second sq.
    * @param {Phaser.Point|object} [point] - The Point object in which the x and y properties will be set to the calculated velocity.
    * @return {Phaser.Point} - A Point where point.x contains the velocity x value and point.y contains the velocity y value.
    */
    velocityFromAngle: function (angle, speed, point) {

        if (typeof speed === 'undefined') { speed = 60; }
        point = point || new Phaser.Point;

        return point.setTo((Math.cos(this.game.math.degToRad(angle)) * speed), (Math.sin(this.game.math.degToRad(angle)) * speed));

    },

    /**
    * Given the rotation (in radians) and speed calculate the velocity and return it as a Point object, or set it to the given point object.
    * One way to use this is: velocityFromRotation(rotation, 200, sprite.velocity) which will set the values directly to the sprites velocity and not create a new Point object.
    * 
    * @method Phaser.Physics.Arcade#velocityFromRotation
    * @param {number} rotation - The angle in radians.
    * @param {number} [speed=60] - The speed it will move, in pixels per second sq.
    * @param {Phaser.Point|object} [point] - The Point object in which the x and y properties will be set to the calculated velocity.
    * @return {Phaser.Point} - A Point where point.x contains the velocity x value and point.y contains the velocity y value.
    */
    velocityFromRotation: function (rotation, speed, point) {

        if (typeof speed === 'undefined') { speed = 60; }
        point = point || new Phaser.Point;

        return point.setTo((Math.cos(rotation) * speed), (Math.sin(rotation) * speed));

    },

    /**
    * Given the rotation (in radians) and speed calculate the acceleration and return it as a Point object, or set it to the given point object.
    * One way to use this is: velocityFromRotation(rotation, 200, sprite.velocity) which will set the values directly to the sprites velocity and not create a new Point object.
    * 
    * @method Phaser.Physics.Arcade#accelerationFromRotation
    * @param {number} rotation - The angle in radians.
    * @param {number} [speed=60] - The speed it will move, in pixels per second sq.
    * @param {Phaser.Point|object} [point] - The Point object in which the x and y properties will be set to the calculated acceleration.
    * @return {Phaser.Point} - A Point where point.x contains the acceleration x value and point.y contains the acceleration y value.
    */
    accelerationFromRotation: function (rotation, speed, point) {

        if (typeof speed === 'undefined') { speed = 60; }
        point = point || new Phaser.Point;

        return point.setTo((Math.cos(rotation) * speed), (Math.sin(rotation) * speed));

    },

    /**
    * Sets the acceleration.x/y property on the display object so it will move towards the target at the given speed (in pixels per second sq.)
    * You must give a maximum speed value, beyond which the display object won't go any faster.
    * Note: The display object does not continuously track the target. If the target changes location during transit the display object will not modify its course.
    * Note: The display object doesn't stop moving once it reaches the destination coordinates.
    * 
    * @method Phaser.Physics.Arcade#accelerateToObject
    * @param {any} displayObject - The display object to move.
    * @param {any} destination - The display object to move towards. Can be any object but must have visible x/y properties.
    * @param {number} [speed=60] - The speed it will accelerate in pixels per second.
    * @param {number} [xSpeedMax=500] - The maximum x velocity the display object can reach.
    * @param {number} [ySpeedMax=500] - The maximum y velocity the display object can reach.
    * @return {number} The angle (in radians) that the object should be visually set to in order to match its new trajectory.
    */
    accelerateToObject: function (displayObject, destination, speed, xSpeedMax, ySpeedMax) {

        if (typeof speed === 'undefined') { speed = 60; }
        if (typeof xSpeedMax === 'undefined') { xSpeedMax = 1000; }
        if (typeof ySpeedMax === 'undefined') { ySpeedMax = 1000; }

        this._angle = this.angleBetween(displayObject, destination);

        displayObject.body.acceleration.setTo(Math.cos(this._angle) * speed, Math.sin(this._angle) * speed);
        displayObject.body.maxVelocity.setTo(xSpeedMax, ySpeedMax);

        return this._angle;

    },

    /**
    * Sets the acceleration.x/y property on the display object so it will move towards the target at the given speed (in pixels per second sq.)
    * You must give a maximum speed value, beyond which the display object won't go any faster.
    * Note: The display object does not continuously track the target. If the target changes location during transit the display object will not modify its course.
    * Note: The display object doesn't stop moving once it reaches the destination coordinates.
    * 
    * @method Phaser.Physics.Arcade#accelerateToPointer
    * @param {any} displayObject - The display object to move.
    * @param {Phaser.Pointer} [pointer] - The pointer to move towards. Defaults to Phaser.Input.activePointer.
    * @param {number} [speed=60] - The speed it will accelerate in pixels per second.
    * @param {number} [xSpeedMax=500] - The maximum x velocity the display object can reach.
    * @param {number} [ySpeedMax=500] - The maximum y velocity the display object can reach.
    * @return {number} The angle (in radians) that the object should be visually set to in order to match its new trajectory.
    */
    accelerateToPointer: function (displayObject, pointer, speed, xSpeedMax, ySpeedMax) {

        if (typeof speed === 'undefined') { speed = 60; }
        if (typeof pointer === 'undefined') { pointer = this.game.input.activePointer; }
        if (typeof xSpeedMax === 'undefined') { xSpeedMax = 1000; }
        if (typeof ySpeedMax === 'undefined') { ySpeedMax = 1000; }

        this._angle = this.angleToPointer(displayObject, pointer);
        
        displayObject.body.acceleration.setTo(Math.cos(this._angle) * speed, Math.sin(this._angle) * speed);
        displayObject.body.maxVelocity.setTo(xSpeedMax, ySpeedMax);

        return this._angle;

    },

    /**
    * Sets the acceleration.x/y property on the display object so it will move towards the x/y coordinates at the given speed (in pixels per second sq.)
    * You must give a maximum speed value, beyond which the display object won't go any faster.
    * Note: The display object does not continuously track the target. If the target changes location during transit the display object will not modify its course.
    * Note: The display object doesn't stop moving once it reaches the destination coordinates.
    * 
    * @method Phaser.Physics.Arcade#accelerateToXY
    * @param {any} displayObject - The display object to move.
    * @param {number} x - The x coordinate to accelerate towards.
    * @param {number} y - The y coordinate to accelerate towards.
    * @param {number} [speed=60] - The speed it will accelerate in pixels per second.
    * @param {number} [xSpeedMax=500] - The maximum x velocity the display object can reach.
    * @param {number} [ySpeedMax=500] - The maximum y velocity the display object can reach.
    * @return {number} The angle (in radians) that the object should be visually set to in order to match its new trajectory.
    */
    accelerateToXY: function (displayObject, x, y, speed, xSpeedMax, ySpeedMax) {

        if (typeof speed === 'undefined') { speed = 60; }
        if (typeof xSpeedMax === 'undefined') { xSpeedMax = 1000; }
        if (typeof ySpeedMax === 'undefined') { ySpeedMax = 1000; }

        this._angle = this.angleToXY(displayObject, x, y);

        displayObject.body.acceleration.setTo(Math.cos(this._angle) * speed, Math.sin(this._angle) * speed);
        displayObject.body.maxVelocity.setTo(xSpeedMax, ySpeedMax);

        return this._angle;

    },

    /**
    * Find the distance between two display objects (like Sprites).
    * 
    * @method Phaser.Physics.Arcade#distanceBetween
    * @param {any} source - The Display Object to test from.
    * @param {any} target - The Display Object to test to.
    * @return {number} The distance between the source and target objects.
    */
    distanceBetween: function (source, target) {

        this._dx = source.x - target.x;
        this._dy = source.y - target.y;
        
        return Math.sqrt(this._dx * this._dx + this._dy * this._dy);

    },

    /**
    * Find the distance between a display object (like a Sprite) and the given x/y coordinates.
    * The calculation is made from the display objects x/y coordinate. This may be the top-left if its anchor hasn't been changed.
    * If you need to calculate from the center of a display object instead use the method distanceBetweenCenters()
    * 
    * @method Phaser.Physics.Arcade#distanceToXY
    * @param {any} displayObject - The Display Object to test from.
    * @param {number} x - The x coordinate to move towards.
    * @param {number} y - The y coordinate to move towards.
    * @return {number} The distance between the object and the x/y coordinates.
    */
    distanceToXY: function (displayObject, x, y) {

        this._dx = displayObject.x - x;
        this._dy = displayObject.y - y;
        
        return Math.sqrt(this._dx * this._dx + this._dy * this._dy);

    },

    /**
    * Find the distance between a display object (like a Sprite) and a Pointer. If no Pointer is given the Input.activePointer is used.
    * The calculation is made from the display objects x/y coordinate. This may be the top-left if its anchor hasn't been changed.
    * If you need to calculate from the center of a display object instead use the method distanceBetweenCenters()
    * 
    * @method Phaser.Physics.Arcade#distanceToPointer
    * @param {any} displayObject - The Display Object to test from.
    * @param {Phaser.Pointer} [pointer] - The Phaser.Pointer to test to. If none is given then Input.activePointer is used.
    * @return {number} The distance between the object and the Pointer.
    */
    distanceToPointer: function (displayObject, pointer) {

        pointer = pointer || this.game.input.activePointer;

        this._dx = displayObject.x - pointer.x;
        this._dy = displayObject.y - pointer.y;
        
        return Math.sqrt(this._dx * this._dx + this._dy * this._dy);

    },

    /**
    * Find the angle in radians between two display objects (like Sprites).
    * 
    * @method Phaser.Physics.Arcade#angleBetween
    * @param {any} source - The Display Object to test from.
    * @param {any} target - The Display Object to test to.
    * @return {number} The angle in radians between the source and target display objects.
    */
    angleBetween: function (source, target) {

        this._dx = target.x - source.x;
        this._dy = target.y - source.y;

        return Math.atan2(this._dy, this._dx);

    },

    /**
    * Find the angle in radians between a display object (like a Sprite) and the given x/y coordinate.
    * 
    * @method Phaser.Physics.Arcade#angleToXY
    * @param {any} displayObject - The Display Object to test from.
    * @param {number} x - The x coordinate to get the angle to.
    * @param {number} y - The y coordinate to get the angle to.
    * @return {number} The angle in radians between displayObject.x/y to Pointer.x/y
    */
    angleToXY: function (displayObject, x, y) {

        this._dx = x - displayObject.x;
        this._dy = y - displayObject.y;
        
        return Math.atan2(this._dy, this._dx);

    },
    
    /**
    * Find the angle in radians between a display object (like a Sprite) and a Pointer, taking their x/y and center into account.
    * 
    * @method Phaser.Physics.Arcade#angleToPointer
    * @param {any} displayObject - The Display Object to test from.
    * @param {Phaser.Pointer} [pointer] - The Phaser.Pointer to test to. If none is given then Input.activePointer is used.
    * @return {number} The angle in radians between displayObject.x/y to Pointer.x/y
    */
    angleToPointer: function (displayObject, pointer) {

        pointer = pointer || this.game.input.activePointer;

        this._dx = pointer.worldX - displayObject.x;
        this._dy = pointer.worldY - displayObject.y;
        
        return Math.atan2(this._dy, this._dx);

    }

};

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Physics Body is linked to a single Sprite. All physics operations should be performed against the body rather than
* the Sprite itself. For example you can set the velocity, acceleration, bounce values etc all on the Body.
*
* @class Phaser.Physics.Arcade.Body
* @classdesc Arcade Physics Body Constructor
* @constructor
* @param {Phaser.Sprite} sprite - The Sprite object this physics body belongs to.
*/
Phaser.Physics.Arcade.Body = function (sprite) {

    /**
    * @property {Phaser.Sprite} sprite - Reference to the parent Sprite.
    */
	this.sprite = sprite;

    /**
    * @property {Phaser.Game} game - Local reference to game.
    */
	this.game = sprite.game;

    /**
    * @property {Phaser.Point} offset - The offset of the Physics Body from the Sprite x/y position.
    */
	this.offset = new Phaser.Point;

    /**
    * @property {number} x - The x position of the physics body.
    * @readonly
    */
	this.x = sprite.x;

    /**
    * @property {number} y - The y position of the physics body.
    * @readonly
    */
	this.y = sprite.y;

    /**
    * @property {number} preX - The previous x position of the physics body.
    * @readonly
    */
	this.preX = sprite.x;

    /**
    * @property {number} preY - The previous y position of the physics body.
    * @readonly
    */
	this.preY = sprite.y;

    /**
    * @property {number} preRotation - The previous rotation of the physics body.
    * @readonly
    */
	this.preRotation = sprite.angle;

    /**
    * @property {number} screenX - The x position of the physics body translated to screen space.
    * @readonly
    */
	this.screenX = sprite.x;

    /**
    * @property {number} screenY - The y position of the physics body translated to screen space.
    * @readonly
    */
	this.screenY = sprite.y;

    /**
    * @property {number} sourceWidth - The un-scaled original size.
    * @readonly
    */
	this.sourceWidth = sprite.currentFrame.sourceSizeW;

    /**
    * @property {number} sourceHeight - The un-scaled original size.
    * @readonly
    */
	this.sourceHeight = sprite.currentFrame.sourceSizeH;

    /**
    * @property {number} width - The calculated width of the physics body.
    */
	this.width = sprite.currentFrame.sourceSizeW;

    /**
    * @property .numInternal ID cache
    */
	this.height = sprite.currentFrame.sourceSizeH;

    /**
    * @property {number} halfWidth - The calculated width / 2 of the physics body.
    */
	this.halfWidth = Math.floor(sprite.currentFrame.sourceSizeW / 2);

    /**
    * @property {number} halfHeight - The calculated height / 2 of the physics body.
    */
	this.halfHeight = Math.floor(sprite.currentFrame.sourceSizeH / 2);

    /**
    * @property {Phaser.Point} center - The center coordinate of the Physics Body.
    */
    this.center = new Phaser.Point(this.x + this.halfWidth, this.y + this.halfHeight);

    /**
    * @property {number} _sx - Internal cache var.
    * @private
    */
	this._sx = sprite.scale.x;

    /**
    * @property {number} _sy - Internal cache var.
    * @private
    */
	this._sy = sprite.scale.y;

    /**
    * @property {Phaser.Point} velocity - The velocity in pixels per second sq. of the Body.
    */
    this.velocity = new Phaser.Point;

    /**
    * @property {Phaser.Point} acceleration - The velocity in pixels per second sq. of the Body.
    */
    this.acceleration = new Phaser.Point;

    /**
    * @property {Phaser.Point} drag - The drag applied to the motion of the Body.
    */
    this.drag = new Phaser.Point;

    /**
    * @property {Phaser.Point} gravity - A private Gravity setting for the Body.
    */
    this.gravity = new Phaser.Point;

    /**
    * @property {Phaser.Point} bounce - The elasticitiy of the Body when colliding. bounce.x/y = 1 means full rebound, bounce.x/y = 0.5 means 50% rebound velocity.
    */
    this.bounce = new Phaser.Point;

    /**
    * @property {Phaser.Point} maxVelocity - The maximum velocity in pixels per second sq. that the Body can reach.
    * @default
    */
    this.maxVelocity = new Phaser.Point(10000, 10000);

    /**
    * @property {number} angularVelocity - The angular velocity in pixels per second sq. of the Body.
    * @default
    */
    this.angularVelocity = 0;

    /**
    * @property {number} angularAcceleration - The angular acceleration in pixels per second sq. of the Body.
    * @default
    */
    this.angularAcceleration = 0;

    /**
    * @property {number} angularDrag - The angular drag applied to the rotation of the Body.
    * @default
    */
    this.angularDrag = 0;

    /**
    * @property {number} maxAngular - The maximum angular velocity in pixels per second sq. that the Body can reach.
    * @default
    */
    this.maxAngular = 1000;

    /**
    * @property {number} mass - The mass of the Body.
    * @default
    */
    this.mass = 1;

    /**
    * @property {boolean} skipQuadTree - If the Body is an irregular shape you can set this to true to avoid it being added to the World quad tree.
    * @default
    */
    this.skipQuadTree = false;

    /**
    * @property {Array} quadTreeIDs - Internal ID cache.
    * @protected
    */
    this.quadTreeIDs = [];

    /**
    * @property {number} quadTreeIndex - Internal ID cache.
    * @protected
    */
    this.quadTreeIndex = -1;

    //	Allow collision

    /**
    * Set the allowCollision properties to control which directions collision is processed for this Body.
    * For example allowCollision.up = false means it won't collide when the collision happened while moving up.
    * @property {object} allowCollision - An object containing allowed collision.
    */
    this.allowCollision = { none: false, any: true, up: true, down: true, left: true, right: true };

    /**
    * This object is populated with boolean values when the Body collides with another.
    * touching.up = true means the collision happened to the top of this Body for example.
    * @property {object} touching - An object containing touching results.
    */
    this.touching = { none: true, up: false, down: false, left: false, right: false };

    /**
    * This object is populated with previous touching values from the bodies previous collision.
    * @property {object} wasTouching - An object containing previous touching results.
    */
    this.wasTouching = { none: true, up: false, down: false, left: false, right: false };

    /**
    * @property {number} facing - A const reference to the direction the Body is traveling or facing.
    * @default
    */
    this.facing = Phaser.NONE;

    /**
    * @property {boolean} immovable - An immovable Body will not receive any impacts from other bodies.
    * @default
    */
    this.immovable = false;

    /**
    * @property {boolean} moves - Set to true to allow the Physics system to move this Body, other false to move it manually.
    * @default
    */
    this.moves = true;

    /**
    * @property {number} rotation - The amount the Body is rotated.
    * @default
    */
    this.rotation = 0;

    /**
    * @property {boolean} allowRotation - Allow this Body to be rotated? (via angularVelocity, etc)
    * @default
    */
    this.allowRotation = true;

    /**
    * @property {boolean} allowGravity - Allow this Body to be influenced by the global Gravity?
    * @default
    */
    this.allowGravity = true;

    /**
    * This flag allows you to disable the custom x separation that takes place by Physics.Arcade.separate.
    * Used in combination with your own collision processHandler you can create whatever type of collision response you need.
    * @property {boolean} customSeparateX - Use a custom separation system or the built-in one?
    * @default
    */
    this.customSeparateX = false;

    /**
    * This flag allows you to disable the custom y separation that takes place by Physics.Arcade.separate.
    * Used in combination with your own collision processHandler you can create whatever type of collision response you need.
    * @property {boolean} customSeparateY - Use a custom separation system or the built-in one?
    * @default
    */
    this.customSeparateY = false;

    /**
    * When this body collides with another, the amount of overlap is stored here.
    * @property {number} overlapX - The amount of horizontal overlap during the collision.
    */
    this.overlapX = 0;

    /**
    * When this body collides with another, the amount of overlap is stored here.
    * @property {number} overlapY - The amount of vertical overlap during the collision.
    */
    this.overlapY = 0;

    /**
    * @property {Phaser.Rectangle} hullX - The dynamically calculated hull used during collision.
    */
    this.hullX = new Phaser.Rectangle();

    /**
    * @property {Phaser.Rectangle} hullY - The dynamically calculated hull used during collision.
    */
    this.hullY = new Phaser.Rectangle();

    /**
    * If a body is overlapping with another body, but neither of them are moving (maybe they spawned on-top of each other?) this is set to true.
    * @property {boolean} embedded - Body embed value.
    */
    this.embedded = false;

    /**
    * A Body can be set to collide against the World bounds automatically and rebound back into the World if this is set to true. Otherwise it will leave the World.
    * @property {boolean} collideWorldBounds - Should the Body collide with the World bounds?
    */
    this.collideWorldBounds = false;

};

Phaser.Physics.Arcade.Body.prototype = {

    /**
    * Internal method.
    *
    * @method Phaser.Physics.Arcade#updateBounds
    * @protected
    */
	updateBounds: function (centerX, centerY, scaleX, scaleY) {

		if (scaleX != this._sx || scaleY != this._sy)
		{
			this.width = this.sourceWidth * scaleX;
			this.height = this.sourceHeight * scaleY;
			this.halfWidth = Math.floor(this.width / 2);
			this.halfHeight = Math.floor(this.height / 2);
			this._sx = scaleX;
			this._sy = scaleY;
            this.center.setTo(this.x + this.halfWidth, this.y + this.halfHeight);
		}

	},

    /**
    * Internal method.
    *
    * @method Phaser.Physics.Arcade#preUpdate
    * @protected
    */
	preUpdate: function () {

		//	Store and reset collision flags
	    this.wasTouching.none = this.touching.none;
	    this.wasTouching.up = this.touching.up;
	    this.wasTouching.down = this.touching.down;
	    this.wasTouching.left = this.touching.left;
	    this.wasTouching.right = this.touching.right;

	    this.touching.none = true;
	    this.touching.up = false;
	    this.touching.down = false;
	    this.touching.left = false;
	    this.touching.right = false;

	    this.embedded = false;

		this.screenX = (this.sprite.worldTransform[2] - (this.sprite.anchor.x * this.width)) + this.offset.x;
		this.screenY = (this.sprite.worldTransform[5] - (this.sprite.anchor.y * this.height)) + this.offset.y;

        this.preX = (this.sprite.world.x - (this.sprite.anchor.x * this.width)) + this.offset.x;
        this.preY = (this.sprite.world.y - (this.sprite.anchor.y * this.height)) + this.offset.y;

		this.preRotation = this.sprite.angle;

		this.x = this.preX;
		this.y = this.preY;
		this.rotation = this.preRotation;

		if (this.moves)
		{
			this.game.physics.updateMotion(this);

			if (this.collideWorldBounds)
			{
				this.checkWorldBounds();
			}

			this.updateHulls();
        }

		if (this.skipQuadTree == false && this.allowCollision.none == false && this.sprite.visible && this.sprite.alive)
		{
		    this.quadTreeIDs = [];
		    this.quadTreeIndex = -1;
			this.game.physics.quadTree.insert(this);
		}

	},

    /**
    * Internal method.
    *
    * @method Phaser.Physics.Arcade#postUpdate
    * @protected
    */
	postUpdate: function () {

		if (this.deltaX() < 0)
		{
			this.facing = Phaser.LEFT;
		}
		else if (this.deltaX() > 0)
		{
			this.facing = Phaser.RIGHT;
		}

		if (this.deltaY() < 0)
		{
			this.facing = Phaser.UP;
		}
		else if (this.deltaY() > 0)
		{
			this.facing = Phaser.DOWN;
		}

        if (this.deltaX() !== 0 || this.deltaY() !== 0)
        {
            this.sprite.x += this.deltaX();
            this.sprite.y += this.deltaY();
            this.center.setTo(this.x + this.halfWidth, this.y + this.halfHeight);
        }

		if (this.allowRotation)
		{
			this.sprite.angle += this.deltaZ();
		}

	},

    /**
    * Internal method.
    *
    * @method Phaser.Physics.Arcade#updateHulls
    * @protected
    */
	updateHulls: function () {

		this.hullX.setTo(this.x, this.preY, this.width, this.height);
		this.hullY.setTo(this.preX, this.y, this.width, this.height);

	},

    /**
    * Internal method.
    *
    * @method Phaser.Physics.Arcade#checkWorldBounds
    * @protected
    */
	checkWorldBounds: function () {

		if (this.x < this.game.world.bounds.x)
		{
			this.x = this.game.world.bounds.x;
			this.velocity.x *= -this.bounce.x;
		}
		else if (this.right > this.game.world.bounds.right)
		{
			this.x = this.game.world.bounds.right - this.width;
			this.velocity.x *= -this.bounce.x;
		}

		if (this.y < this.game.world.bounds.y)
		{
			this.y = this.game.world.bounds.y;
			this.velocity.y *= -this.bounce.y;
		}
		else if (this.bottom > this.game.world.bounds.bottom)
		{
			this.y = this.game.world.bounds.bottom - this.height;
			this.velocity.y *= -this.bounce.y;
		}

	},

    /**
    * You can modify the size of the physics Body to be any dimension you need.
    * So it could be smaller or larger than the parent Sprite. You can also control the x and y offset, which
    * is the position of the Body relative to the top-left of the Sprite.
    *
    * @method Phaser.Physics.Arcade#setSize
    * @param {number} width - The width of the Body.
    * @param {number} height - The height of the Body.
    * @param {number} offsetX - The X offset of the Body from the Sprite position.
    * @param {number} offsetY - The Y offset of the Body from the Sprite position.
    */
	setSize: function (width, height, offsetX, offsetY) {

		offsetX = offsetX || this.offset.x;
		offsetY = offsetY || this.offset.y;

		this.sourceWidth = width;
		this.sourceHeight = height;
		this.width = this.sourceWidth * this._sx;
		this.height = this.sourceHeight * this._sy;
		this.halfWidth = Math.floor(this.width / 2);
		this.halfHeight = Math.floor(this.height / 2);
		this.offset.setTo(offsetX, offsetY);

        this.center.setTo(this.x + this.halfWidth, this.y + this.halfHeight);

	},

    /**
    * Resets all Body values (velocity, acceleration, rotation, etc)
    *
    * @method Phaser.Physics.Arcade#reset
    */
	reset: function () {

		this.velocity.setTo(0, 0);
		this.acceleration.setTo(0, 0);

	    this.angularVelocity = 0;
	    this.angularAcceleration = 0;
        this.preX = (this.sprite.world.x - (this.sprite.anchor.x * this.width)) + this.offset.x;
        this.preY = (this.sprite.world.y - (this.sprite.anchor.y * this.height)) + this.offset.y;
		this.preRotation = this.sprite.angle;

		this.x = this.preX;
		this.y = this.preY;
		this.rotation = this.preRotation;
        
        this.center.setTo(this.x + this.halfWidth, this.y + this.halfHeight);

	},

    /**
    * Returns the absolute delta x value.
    *
    * @method Phaser.Physics.Arcade.Body#deltaAbsX
    * @return {number} The absolute delta value.
    */
    deltaAbsX: function () {
        return (this.deltaX() > 0 ? this.deltaX() : -this.deltaX());
    },

    /**
    * Returns the absolute delta y value.
    *
    * @method Phaser.Physics.Arcade.Body#deltaAbsY
    * @return {number} The absolute delta value.
    */
    deltaAbsY: function () {
        return (this.deltaY() > 0 ? this.deltaY() : -this.deltaY());
    },

    /**
    * Returns the delta x value. The difference between Body.x now and in the previous step.
    *
    * @method Phaser.Physics.Arcade.Body#deltaX
    * @return {number} The delta value.
    */
    deltaX: function () {
        return this.x - this.preX;
    },

    /**
    * Returns the delta y value. The difference between Body.y now and in the previous step.
    *
    * @method Phaser.Physics.Arcade.Body#deltaY
    * @return {number} The delta value.
    */
    deltaY: function () {
        return this.y - this.preY;
    },

    deltaZ: function () {
        return this.rotation - this.preRotation;
    }

};

/**
* @name Phaser.Physics.Arcade.Body#bottom
* @property {number} bottom - The bottom value of this Body (same as Body.y + Body.height)
*/
Object.defineProperty(Phaser.Physics.Arcade.Body.prototype, "bottom", {
    
    /**
    * The sum of the y and height properties. Changing the bottom property of a Rectangle object has no effect on the x, y and width properties, but does change the height property.
    * @method bottom
    * @return {number}
    **/
    get: function () {
        return this.y + this.height;
    },

    /**
    * The sum of the y and height properties. Changing the bottom property of a Rectangle object has no effect on the x, y and width properties, but does change the height property.
    * @method bottom
    * @param {number} value
    **/    
    set: function (value) {

        if (value <= this.y)
        {
            this.height = 0;
        }
        else
        {
            this.height = (this.y - value);
        }
        
    }

});

/**
* @name Phaser.Physics.Arcade.Body#right
* @property {number} right - The right value of this Body (same as Body.x + Body.width)
*/
Object.defineProperty(Phaser.Physics.Arcade.Body.prototype, "right", {
    
    /**
    * The sum of the x and width properties. Changing the right property of a Rectangle object has no effect on the x, y and height properties.
    * However it does affect the width property.
    * @method right
    * @return {number}
    **/    
    get: function () {
        return this.x + this.width;
    },

    /**
    * The sum of the x and width properties. Changing the right property of a Rectangle object has no effect on the x, y and height properties.
    * However it does affect the width property.
    * @method right
    * @param {number} value
    **/
    set: function (value) {

        if (value <= this.x)
        {
            this.width = 0;
        }
        else
        {
            this.width = this.x + value;
        }

    }

});

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Phaser.Particles is the Particle Manager for the game. It is called during the game update loop and in turn updates any Emitters attached to it.
*
* @class Phaser.Particles
* @classdesc Phaser Particles
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
*/
Phaser.Particles = function (game) {

	/**
    * @property {Description} emitters - Description.
	*/
	this.emitters = {};

	/**
	* @property {number} ID - Description.
	* @default
	*/
	this.ID = 0;

};

Phaser.Particles.prototype = {

	/**
	* Adds a new Particle Emitter to the Particle Manager.
	* @method Phaser.Particles#add
	* @param {Phaser.Emitter} emitter - Description.
	* @return {Phaser.Emitter} The emitter that was added.
	*/
	add: function (emitter) {

		this.emitters[emitter.name] = emitter;

		return emitter;

	},

	/**
	* Removes an existing Particle Emitter from the Particle Manager.
	* @method Phaser.Particles#remove
	* @param {Phaser.Emitter} emitter - The emitter to remove.
	*/
	remove: function (emitter) {

		delete this.emitters[emitter.name];

	},

	/**
	* Called by the core game loop. Updates all Emitters who have their exists value set to true.
	* @method Phaser.Particles#update
	* @protected
	*/
	update: function () {

		for (var key in this.emitters)
		{
			if (this.emitters[key].exists)
			{
				this.emitters[key].update();
			}
		}

	}

};
Phaser.Particles.Arcade = {}
/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Phaser - ArcadeEmitter
*
* @class Phaser.Particles.Arcade.Emitter
* @classdesc Emitter is a lightweight particle emitter. It can be used for one-time explosions or for
* continuous effects like rain and fire. All it really does is launch Particle objects out
* at set intervals, and fixes their positions and velocities accorindgly.
* @constructor
* @extends Phaser.Group
* @param {Phaser.Game} game - Current game instance.
* @param {number} [x=0] - The x coordinate within the Emitter that the particles are emitted from.
* @param {number} [y=0] - The y coordinate within the Emitter that the particles are emitted from.
* @param {number} [maxParticles=50] - The total number of particles in this emitter..
*/

Phaser.Particles.Arcade.Emitter = function (game, x, y, maxParticles) {

    /**
    * The total number of particles in this emitter.
    * @property {number} maxParticles - The total number of particles in this emitter..
    * @default
    */
	this.maxParticles = maxParticles || 50;

	Phaser.Group.call(this, game);

    /**
	* @property {string} name - Description.
	*/
    this.name = 'emitter' + this.game.particles.ID++;

    /**
	* @property {Description} type - Description.
	*/
    this.type = Phaser.EMITTER;

    /**
     * @property {number} x - The X position of the top left corner of the emitter in world space.
     * @default
     */
    this.x = 0;

    /**
     * @property {number} y - The Y position of the top left corner of emitter in world space.
     * @default
     */
    this.y = 0;

    /**
     * @property {number} width - The width of the emitter.  Particles can be randomly generated from anywhere within this box.
     * @default
     */
    this.width = 1;

    /**
    * @property {number} height - The height of the emitter.  Particles can be randomly generated from anywhere within this box.
    * @default
    */
    this.height = 1;

    /**
    * The minimum possible velocity of a particle.
    * The default value is (-100,-100).
    * @property {Phaser.Point} minParticleSpeed
    */
    this.minParticleSpeed = new Phaser.Point(-100, -100);

    /**
    * The maximum possible velocity of a particle.
    * The default value is (100,100).
    * @property {Phaser.Point} maxParticleSpeed
    */
    this.maxParticleSpeed = new Phaser.Point(100, 100);

    /**
    * The minimum possible scale of a particle.
    * The default value is 1.
    * @property {number} minParticleScale
    * @default
    */
    this.minParticleScale = 1;

    /**
     * The maximum possible scale of a particle.
     * The default value is 1.
     * @property {number} maxParticleScale
     * @default
     */
    this.maxParticleScale = 1;

    /**
     * The minimum possible angular velocity of a particle.  The default value is -360.
     * @property {number} minRotation
     * @default
     */
    this.minRotation = -360;

    /**
     * The maximum possible angular velocity of a particle.  The default value is 360.
     * @property {number} maxRotation
     * @default
     */
    this.maxRotation = 360;

    /**
     * Sets the <code>gravity.y</code> of each particle to this value on launch.
     * @property {number} gravity
     * @default
     */
    this.gravity = 2;

    /**
     * Set your own particle class type here.
     * @property {Description} particleClass
     * @default
     */
    this.particleClass = null;

    /**
     * The X and Y drag component of particles launched from the emitter.
     * @property {Phaser.Point} particleDrag
     */
    this.particleDrag = new Phaser.Point();

    /**
     * The angular drag component of particles launched from the emitter if they are rotating.
     * @property {number} angularDrag
     * @default
     */
    this.angularDrag = 0;

    /**
     * How often a particle is emitted in ms (if emitter is started with Explode == false).
     * @property {boolean} frequency
     * @default
     */
    this.frequency = 100;

    /**
     * How long each particle lives once it is emitted in ms. Default is 2 seconds.
     * Set lifespan to 'zero' for particles to live forever.
     * @property {number} lifespan
     * @default
     */
    this.lifespan = 2000;

    /**
     * How much each particle should bounce on each axis.  1 = full bounce, 0 = no bounce.
     * @property {Phaser.Point} bounce
     */
    this.bounce = new Phaser.Point();

    /**
     * Internal helper for deciding how many particles to launch.
     * @property {number} _quantity
     * @private
     * @default
     */
    this._quantity = 0;

   /**
     * Internal helper for deciding when to launch particles or kill them.
     * @property {number} _timer
     * @private
     * @default
     */
    this._timer = 0;

    /**
     * Internal counter for figuring out how many particles to launch.
     * @property {number} _counter
     * @private
     * @default
     */
    this._counter = 0;

    /**
     * Internal helper for the style of particle emission (all at once, or one at a time).
     * @property {boolean} _explode
     * @private
     * @default
     */
    this._explode = true;

    /**
     * Determines whether the emitter is currently emitting particles.
     * It is totally safe to directly toggle this.
     * @property {boolean} on
     * @default
     */
    this.on = false;

    /**
     * Determines whether the emitter is being updated by the core game loop.
     * @property {boolean} exists
     * @default
     */
    this.exists = true;

    /**
     * The point the particles are emitted from.
     * Emitter.x and Emitter.y control the containers location, which updates all current particles
     * Emitter.emitX and Emitter.emitY control the emission location relative to the x/y position.
     * @property {boolean} emitX
     */
    this.emitX = x;
    
    /**
     * The point the particles are emitted from.
     * Emitter.x and Emitter.y control the containers location, which updates all current particles
     * Emitter.emitX and Emitter.emitY control the emission location relative to the x/y position.
     * @property {boolean} emitY
     */
    this.emitY = y;
	
};

Phaser.Particles.Arcade.Emitter.prototype = Object.create(Phaser.Group.prototype);
Phaser.Particles.Arcade.Emitter.prototype.constructor = Phaser.Particles.Arcade.Emitter;

/**
* Called automatically by the game loop, decides when to launch particles and when to "die".
* @method Phaser.Particles.Arcade.Emitter#update
*/
Phaser.Particles.Arcade.Emitter.prototype.update = function () {

    if (this.on)
    {
        if (this._explode)
        {
			this._counter = 0;

            do
            {
            	this.emitParticle();
            	this._counter++;
            }
            while (this._counter < this._quantity);

            this.on = false;
        }
        else
        {
        	if (this.game.time.now >= this._timer)
        	{
                this.emitParticle();
				
				this._counter++;

                if (this._quantity > 0)
                {
	                if (this._counter >= this._quantity)
	                {
	                	this.on = false;
	                }
                }

                this._timer = this.game.time.now + this.frequency;
        	}
        }
    }

}

/**
* This function generates a new array of particle sprites to attach to the emitter.
*
* @method Phaser.Particles.Arcade.Emitter#makeParticles
* @param {Description} keys - Description.
* @param {number} frames - Description.
* @param {number} quantity - The number of particles to generate when using the "create from image" option.
* @param {number} collide - Description.
* @param {boolean} collideWorldBounds - Description.
* @return This Emitter instance (nice for chaining stuff together, if you're into that).
*/
Phaser.Particles.Arcade.Emitter.prototype.makeParticles = function (keys, frames, quantity, collide, collideWorldBounds) {

    if (typeof frames == 'undefined')
    {
        frames = 0;
    }

	quantity = quantity || this.maxParticles;
    collide = collide || 0;

    if (typeof collideWorldBounds == 'undefined')
    {
        collideWorldBounds = false;
    }

    var particle;
    var i = 0;
    var rndKey = keys;
    var rndFrame = 0;

    while (i < quantity)
    {
        if (this.particleClass == null)
        {
            if (typeof keys == 'object')
            {
                rndKey = this.game.rnd.pick(keys);
            }

            if (typeof frames == 'object')
            {
                rndFrame = this.game.rnd.pick(frames);
            }

            particle = new Phaser.Sprite(this.game, 0, 0, rndKey, rndFrame);
        }
        else
        {
            // particle = new this.particleClass(this.game);
        }

        if (collide > 0)
        {
            particle.body.allowCollision.any = true;
            particle.body.allowCollision.none = false;
        }
        else
        {
            particle.body.allowCollision.none = true;
        }

        particle.body.collideWorldBounds = collideWorldBounds;

        particle.exists = false;
        particle.visible = false;

        //  Center the origin for rotation assistance
        particle.anchor.setTo(0.5, 0.5);

        this.add(particle);

        i++;
    }

    return this;
}

/**
 * Call this function to turn off all the particles and the emitter.
 * @method Phaser.Particles.Arcade.Emitter#kill
 */
Phaser.Particles.Arcade.Emitter.prototype.kill = function () {

    this.on = false;
    this.alive = false;
    this.exists = false;

}

/**
 * Handy for bringing game objects "back to life". Just sets alive and exists back to true.
 * In practice, this is most often called by <code>Object.reset()</code>.
 * @method Phaser.Particles.Arcade.Emitter#revive
 */
Phaser.Particles.Arcade.Emitter.prototype.revive = function () {

    this.alive = true;
    this.exists = true;

}

/**
 * Call this function to start emitting particles.
 * @method Phaser.Particles.Arcade.Emitter#start
 * @param {boolean} explode - Whether the particles should all burst out at once.
 * @param {number} lifespan - How long each particle lives once emitted. 0 = forever.
 * @param {number} frequency - Ignored if Explode is set to true. Frequency is how often to emit a particle in ms.
 * @param {number} quantity - How many particles to launch. 0 = "all of the particles".
 */
Phaser.Particles.Arcade.Emitter.prototype.start = function (explode, lifespan, frequency, quantity) {

	if (typeof explode !== 'boolean')
	{
		explode = true;
	}

	lifespan = lifespan || 0;

	//	How many ms between emissions?
	frequency = frequency || 250;

	//	Total number of particles to emit
	quantity = quantity || 0;

    this.revive();

    this.visible = true;
    this.on = true;

    this._explode = explode;
    this.lifespan = lifespan;
    this.frequency = frequency;

    if (explode)
    {
        this._quantity = quantity;
    }
    else
    {
        this._quantity += quantity;
    }

    this._counter = 0;
    this._timer = this.game.time.now + frequency;

}

/**
 * This function can be used both internally and externally to emit the next particle.
 * @method Phaser.Particles.Arcade.Emitter#emitParticle
 */
Phaser.Particles.Arcade.Emitter.prototype.emitParticle = function () {

    var particle = this.getFirstExists(false);

    if (particle == null)
    {
    	return;
    }

    if (this.width > 1 || this.height > 1)
    {
    	particle.reset(this.game.rnd.integerInRange(this.left, this.right), this.game.rnd.integerInRange(this.top, this.bottom));
    }
    else
    {
    	particle.reset(this.emitX, this.emitY);
    }

    particle.lifespan = this.lifespan;

    particle.body.bounce.setTo(this.bounce.x, this.bounce.y);

    if (this.minParticleSpeed.x != this.maxParticleSpeed.x)
    {
        particle.body.velocity.x = this.game.rnd.integerInRange(this.minParticleSpeed.x, this.maxParticleSpeed.x);
    }
    else
    {
        particle.body.velocity.x = this.minParticleSpeed.x;
    }

    if (this.minParticleSpeed.y != this.maxParticleSpeed.y)
    {
        particle.body.velocity.y = this.game.rnd.integerInRange(this.minParticleSpeed.y, this.maxParticleSpeed.y);
    }
    else
    {
        particle.body.velocity.y = this.minParticleSpeed.y;
    }

    particle.body.gravity.y = this.gravity;

    if (this.minRotation != this.maxRotation)
    {
        particle.body.angularVelocity = this.game.rnd.integerInRange(this.minRotation, this.maxRotation);
    }
    else
    {
        particle.body.angularVelocity = this.minRotation;
    }

    if (this.minParticleScale !== 1 || this.maxParticleScale !== 1)
    {
        var scale = this.game.rnd.realInRange(this.minParticleScale, this.maxParticleScale);
        particle.scale.setTo(scale, scale);
    }

    particle.body.drag.x = this.particleDrag.x;
    particle.body.drag.y = this.particleDrag.y;
    particle.body.angularDrag = this.angularDrag;

}

/**
* A more compact way of setting the width and height of the emitter.
* @method Phaser.Particles.Arcade.Emitter#setSize
* @param  {number} width - The desired width of the emitter (particles are spawned randomly within these dimensions).
* @param  {number} height - The desired height of the emitter.
*/
Phaser.Particles.Arcade.Emitter.prototype.setSize = function (width, height) {

    this.width = width;
    this.height = height;

}

/**
* A more compact way of setting the X velocity range of the emitter.
* @method Phaser.Particles.Arcade.Emitter#setXSpeed
* @param  {number} min - The minimum value for this range.
* @param  {number} max - The maximum value for this range.
*/
Phaser.Particles.Arcade.Emitter.prototype.setXSpeed = function (min, max) {

	min = min || 0;
	max = max || 0;

    this.minParticleSpeed.x = min;
    this.maxParticleSpeed.x = max;

}

/**
* A more compact way of setting the Y velocity range of the emitter.
* @method Phaser.Particles.Arcade.Emitter#setYSpeed
* @param  {number} min - The minimum value for this range.
* @param  {number} max - The maximum value for this range.
*/
Phaser.Particles.Arcade.Emitter.prototype.setYSpeed = function (min, max) {

	min = min || 0;
	max = max || 0;

    this.minParticleSpeed.y = min;
    this.maxParticleSpeed.y = max;

}

/**
* A more compact way of setting the angular velocity constraints of the emitter.
* @method Phaser.Particles.Arcade.Emitter#setRotation
* @param {number} min -  The minimum value for this range.
* @param {number} max -  The maximum value for this range.
*/
Phaser.Particles.Arcade.Emitter.prototype.setRotation = function (min, max) {

	min = min || 0;
	max = max || 0;

    this.minRotation = min;
    this.maxRotation = max;

}

/**
* Change the emitter's midpoint to match the midpoint of a <code>Object</code>.
* @method Phaser.Particles.Arcade.Emitter#at
* @param  {object} object - The <code>Object</code> that you want to sync up with.
*/
Phaser.Particles.Arcade.Emitter.prototype.at = function (object) {

    this.emitX = object.center.x;
    this.emitY = object.center.y;

}

/**
* The emitters alpha value.
* @name Phaser.Particles.Arcade.Emitter#alpha
* @property {number} alpha - Gets or sets the alpha value of the Emitter.
*/
Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype, "alpha", {
    
    get: function () {
        return this._container.alpha;
    },

    set: function (value) {
        this._container.alpha = value;
    }

});

/**
* The emitter visible state.
* @name Phaser.Particles.Arcade.Emitter#visible
* @property {boolean} visible - Gets or sets the Emitter visible state.
*/
Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype, "visible", {
    
    get: function () {
        return this._container.visible;
    },

    set: function (value) {
        this._container.visible = value;
    }

});

/**
* @name Phaser.Particles.Arcade.Emitter#x
* @property {number} x - Gets or sets the x position of the Emitter.
*/
Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype, "x", {

    get: function () {
        return this.emitX;
    },

    set: function (value) {
        this.emitX = value;
    }

});

/**
* @name Phaser.Particles.Arcade.Emitter#y
* @property {number} y - Gets or sets the y position of the Emitter.
*/
Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype, "y", {

    get: function () {
        return this.emitY;
    },

    set: function (value) {
        this.emitY = value;
    }

});

/**
* @name Phaser.Particles.Arcade.Emitter#left
* @property {number} left - Gets the left position of the Emitter.
* @readonly
*/
Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype, "left", {
    
    get: function () {
        return Math.floor(this.x - (this.width / 2));
    }

});

/**
* @name Phaser.Particles.Arcade.Emitter#right
* @property {number} right - Gets the right position of the Emitter.
* @readonly
*/
Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype, "right", {
    
    get: function () {
        return Math.floor(this.x + (this.width / 2));
    }

});

/**
* @name Phaser.Particles.Arcade.Emitter#top
* @property {number} top - Gets the top position of the Emitter.
* @readonly
*/
Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype, "top", {
    
    get: function () {
        return Math.floor(this.y - (this.height / 2));
    }

});

/**
* @name Phaser.Particles.Arcade.Emitter#bottom
* @property {number} bottom - Gets the bottom position of the Emitter.
* @readonly
*/
Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype, "bottom", {
    
    get: function () {
        return Math.floor(this.y + (this.height / 2));
    }

});

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
* @module       Phaser.Tile
*/


/**
* Create a new <code>Tile</code>.
*
* @class Phaser.Tile
* @classdesc A Tile is a single representation of a tile within a Tilemap.
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {Tilemap} tilemap - The tilemap this tile belongs to.
* @param {number}  index - The index of this tile type in the core map data.
* @param {number}  width - Width of the tile.
* @param {number}  height - Height of the tile.
*/
Phaser.Tile = function (tileset, index, x, y, width, height) {

    /**
    * @property {string} tileset - The tileset this tile belongs to.
    */
    this.tileset = tileset;
    
    /**
    * @property {number} index - The index of this tile within the tileset.
    */
    this.index = index;
    
    /**
    * @property {number} width - The width of the tile in pixels.
    */
    this.width = width;
    
    /**
    * @property {number} height - The height of the tile in pixels.
    */
    this.height = height;

    /**
    * @property {number} x - The top-left corner of the tile within the tileset.
    */
    this.x = x;
    
    /**
    * @property {number} y - The top-left corner of the tile within the tileset.
    */
    this.y = y;

    //  Any extra meta data info we need here

    /**
    * @property {number} mass - The virtual mass of the tile.
    * @default
    */
    this.mass = 1.0;

    /**
    * @property {boolean} collideNone - Indicating this Tile doesn't collide at all.
    * @default
    */
    this.collideNone = true;

    /**
    * @property {boolean} collideLeft - Indicating collide with any object on the left.
    * @default
    */
    this.collideLeft = false;

    /**
    * @property {boolean} collideRight - Indicating collide with any object on the right.
    * @default
    */
    this.collideRight = false;

    /**
    * @property {boolean} collideUp - Indicating collide with any object on the top.
    * @default
    */
    this.collideUp = false;

    /**
    * @property {boolean} collideDown - Indicating collide with any object on the bottom.
    * @default
    */
    this.collideDown = false;

    /**
    * @property {boolean} separateX - Enable separation at x-axis. 
    * @default
    */
    this.separateX = true;

    /**
    * @property {boolean} separateY - Enable separation at y-axis. 
    * @default
    */
    this.separateY = true;

    /**
    * @property {boolean} collisionCallback - Tilemap collision callback.
    * @default
    */
    this.collisionCallback = null;

    /**
    * @property {boolean} collisionCallback - Tilemap collision callback.
    * @default
    */
    this.collisionCallbackContext = this;

};

Phaser.Tile.prototype = {

    /**
    * Set callback to be called when this tilemap collides.
    * 
    * @method Phaser.Tilemap.prototype.setCollisionCallback
    * @param {Function} callback - Callback function.
    * @param {object} context - Callback will be called with this context.
    */
    setCollisionCallback: function (callback, context) {

        this.collisionCallbackContext = context;
        this.collisionCallback = callback;

    },

    /**
    * Clean up memory.
    * @method destroy
    */
    destroy: function () {

        this.tileset = null;
        
    },

    /**
    * Set collision configs.
    * @method setCollision
    * @param {boolean}   left - Indicating collide with any object on the left.
    * @param {boolean}   right - Indicating collide with any object on the right.
    * @param {boolean}   up - Indicating collide with any object on the top.
    * @param {boolean}   down - Indicating collide with any object on the bottom.
    * @param {boolean}   reset - Description. 
    * @param {boolean}   separateX - Separate at x-axis.
    * @param {boolean}   separateY - Separate at y-axis.
    */
    setCollision: function (left, right, up, down) {

        this.collideLeft = left;
        this.collideRight = right;
        this.collideUp = up;
        this.collideDown = down;

        if (left || right || up || down)
        {
            this.collideNone = false;
        }
        else
        {
            this.collideNone = true;
        }

    },

    /**
    * Reset collision status flags.
    * @method resetCollision
    */
    resetCollision: function () {

        this.collideNone = true;
        this.collideLeft = false;
        this.collideRight = false;
        this.collideUp = false;
        this.collideDown = false;

    }

};

Object.defineProperty(Phaser.Tile.prototype, "bottom", {
    
    /**
    * The sum of the y and height properties. Changing the bottom property of a Rectangle object has no effect on the x, y and width properties, but does change the height property.
    * @method bottom
    * @return {number}
    **/
    get: function () {
        return this.y + this.height;
    }

});

Object.defineProperty(Phaser.Tile.prototype, "right", {
    
    /**
    * The sum of the x and width properties. Changing the right property of a Rectangle object has no effect on the x, y and height properties.
    * However it does affect the width property.
    * @method right
    * @return {number}
    **/    
    get: function () {
        return this.x + this.width;
    }

});

Phaser.Tilemap = function (game, key) {

	/**
	* @property {Phaser.Game} game - Description.
	*/ 
    this.game = game;

    /**
    * @property {array} layers - Description.
    */
	this.layers;

    if (typeof key === 'string')
    {
    	this.key = key;

		this.layers = game.cache.getTilemapData(key).layers;
        this.calculateIndexes();
    }
    else
    {
	    this.layers = [];
    }

    this.currentLayer = 0;

    this.debugMap = [];

    this.dirty = false;

    this._results = [];
    this._tempA = 0;
    this._tempB = 0;

};

Phaser.Tilemap.CSV = 0;
Phaser.Tilemap.TILED_JSON = 1;

Phaser.Tilemap.prototype = {

    create: function (name, width, height) {

        var data = [];

        for (var y = 0; y < height; y++)
        {
            data[y] = [];

            for (var x = 0; x < width; x++)
            {
                data[y][x] = 0;
            }
        }

        this.currentLayer = this.layers.push({

			name: name, 
			width: width, 
			height: height, 
			alpha: 1, 
			visible: true, 
			tileMargin: 0, 
			tileSpacing: 0,
			format: Phaser.Tilemap.CSV,
			data: data,
            indexes: []

        });

        this.dirty = true;

    },

    calculateIndexes: function () {

        for (var layer = 0; layer < this.layers.length; layer++)
        {
            this.layers[layer].indexes = [];

            for (var y = 0; y < this.layers[layer].height ; y++)
            {
                for (var x = 0; x < this.layers[layer].width; x++)
                {
                    var idx = this.layers[layer].data[y][x];

                    if (this.layers[layer].indexes.indexOf(idx) === -1)
                    {
                        this.layers[layer].indexes.push(idx);
                    }
                }
            }
        }

    },

    setLayer: function (layer) {

    	if (this.layers[layer])
    	{
    		this.currentLayer = layer;
    	}

    },

    /**
    * Set a specific tile with its x and y in tiles.
    * @method putTile
    * @param {number} x - X position of this tile.
    * @param {number} y - Y position of this tile.
    * @param {number} index - The index of this tile type in the core map data.
    */
    putTile: function (index, x, y, layer) {

        if (typeof layer === "undefined") { layer = this.currentLayer; }

    	if (x >= 0 && x < this.layers[this.currentLayer].width && y >= 0 && y < this.layers[this.currentLayer].height)
    	{
    		this.layers[this.currentLayer].data[y][x] = index;
    	}

        this.dirty = true;

    },

    getTile: function (x, y, layer) {

        if (typeof layer === "undefined") { layer = this.currentLayer; }

        if (x >= 0 && x < this.layers[this.currentLayer].width && y >= 0 && y < this.layers[this.currentLayer].height)
        {
            return this.layers[this.currentLayer].data[y][x];
        }

    },

    getTileWorldXY: function (x, y, tileWidth, tileHeight, layer) {

        if (typeof layer === "undefined") { layer = this.currentLayer; }

        x = this.game.math.snapToFloor(x, tileWidth) / tileWidth;
        y = this.game.math.snapToFloor(y, tileHeight) / tileHeight;

        if (x >= 0 && x < this.layers[this.currentLayer].width && y >= 0 && y < this.layers[this.currentLayer].height)
        {
            return this.layers[this.currentLayer].data[y][x];
        }

    },

    /**
    * Set a specific tile with its x and y in tiles.
    * @method putTileWorldXY
    * @param {number} x - X position of this tile in world coordinates.
    * @param {number} y - Y position of this tile in world coordinates.
    * @param {number} index - The index of this tile type in the core map data.
    */
    putTileWorldXY: function (index, x, y, tileWidth, tileHeight, layer) {

        x = this.game.math.snapToFloor(x, tileWidth) / tileWidth;
        y = this.game.math.snapToFloor(y, tileHeight) / tileHeight;

        if (x >= 0 && x < this.layers[this.currentLayer].width && y >= 0 && y < this.layers[this.currentLayer].height)
        {
            this.layers[this.currentLayer].data[y][x] = index;
        }

        this.dirty = true;

    },

    //  Values are in TILEs, not pixels.
    copy: function (x, y, width, height, layer) {

        if (typeof layer === "undefined") { layer = this.currentLayer; }

        if (!this.layers[layer])
        {
            this._results.length = 0;
            return;
        }

        if (typeof x === "undefined") { x = 0; }
        if (typeof y === "undefined") { y = 0; }
        if (typeof width === "undefined") { width = this.layers[layer].width; }
        if (typeof height === "undefined") { height = this.layers[layer].height; }

        if (x < 0)
        {
            x = 0;
        }

        if (y < 0)
        {
            y = 0;
        }

        if (width > this.layers[layer].width)
        {
            width = this.layers[layer].width;
        }

        if (height > this.layers[layer].height)
        {
            height = this.layers[layer].height;
        }

        this._results.length = 0;

        this._results.push( { x: x, y: y, width: width, height: height, layer: layer });

        for (var ty = y; ty < y + height; ty++)
        {
            for (var tx = x; tx < x + width; tx++)
            {
                this._results.push({ x: tx, y: ty, index: this.layers[layer].data[ty][tx] });
            }
        }

        return this._results;

    },

    paste: function (x, y, tileblock, layer) {

        if (typeof x === "undefined") { x = 0; }
        if (typeof y === "undefined") { y = 0; }
        if (typeof layer === "undefined") { layer = this.currentLayer; }

        if (!tileblock || tileblock.length < 2)
        {
            return;
        }

        //  Find out the difference between tileblock[1].x/y and x/y and use it as an offset, as it's the top left of the block to paste
        var diffX = tileblock[1].x - x;
        var diffY = tileblock[1].y - y;

        for (var i = 1; i < tileblock.length; i++)
        {
            this.layers[layer].data[ diffY + tileblock[i].y ][ diffX + tileblock[i].x ] = tileblock[i].index;
        }

        this.dirty = true;

    },

    /**
    * Swap tiles with 2 kinds of indexes.
    * @method swapTile
    * @param {number} tileA - First tile index.
    * @param {number} tileB - Second tile index.
    * @param {number} [x] - specify a Rectangle of tiles to operate. The x position in tiles of Rectangle's left-top corner.
    * @param {number} [y] - specify a Rectangle of tiles to operate. The y position in tiles of Rectangle's left-top corner.
    * @param {number} [width] - specify a Rectangle of tiles to operate. The width in tiles.
    * @param {number} [height] - specify a Rectangle of tiles to operate. The height in tiles.
    */
    swap: function (tileA, tileB, x, y, width, height, layer) {

        this.copy(x, y, width, height, layer);

        if (this._results.length < 2)
        {
            return;
        }

        this._tempA = tileA;
        this._tempB = tileB;

        this._results.forEach(this.swapHandler, this);

        this.paste(x, y, this._results);

    },

    swapHandler: function (value, index, array) {

        if (value.index === this._tempA)
        {
            this._results[index].index = this._tempB;
        }
        else if (value.index === this._tempB)
        {
            this._results[index].index = this._tempA;
        }

    },

    /**
    * Swap tiles with 2 kinds of indexes.
    * @method swapTile
    * @param {number} tileA - First tile index.
    * @param {number} tileB - Second tile index.
    * @param {number} [x] - specify a Rectangle of tiles to operate. The x position in tiles of Rectangle's left-top corner.
    * @param {number} [y] - specify a Rectangle of tiles to operate. The y position in tiles of Rectangle's left-top corner.
    * @param {number} [width] - specify a Rectangle of tiles to operate. The width in tiles.
    * @param {number} [height] - specify a Rectangle of tiles to operate. The height in tiles.
    */
    forEach: function (callback, context, x, y, width, height, layer) {

        this.copy(x, y, width, height, layer);

        if (this._results.length < 2)
        {
            return;
        }

        this._results.forEach(callback, context);

        this.paste(x, y, this._results);

    },

    /**
    * Replaces one type of tile with another.
    * @method replace
    * @param {number} tileA - First tile index.
    * @param {number} tileB - Second tile index.
    * @param {number} [x] - specify a Rectangle of tiles to operate. The x position in tiles of Rectangle's left-top corner.
    * @param {number} [y] - specify a Rectangle of tiles to operate. The y position in tiles of Rectangle's left-top corner.
    * @param {number} [width] - specify a Rectangle of tiles to operate. The width in tiles.
    * @param {number} [height] - specify a Rectangle of tiles to operate. The height in tiles.
    */
    replace: function (tileA, tileB, x, y, width, height, layer) {

        this.copy(x, y, width, height, layer);

        if (this._results.length < 2)
        {
            return;
        }

        for (var i = 1; i < this._results.length; i++)
        {
            if (this._results[i].index === tileA)
            {
                this._results[i].index = tileB;
            }
        }

        this.paste(x, y, this._results);

    },

    /**
    * Randomises a set of tiles in a given area. It will only randomise the tiles in that area, so if they're all the same nothing will appear to have changed!
    * @method random
    * @param {number} tileA - First tile index.
    * @param {number} tileB - Second tile index.
    * @param {number} [x] - specify a Rectangle of tiles to operate. The x position in tiles of Rectangle's left-top corner.
    * @param {number} [y] - specify a Rectangle of tiles to operate. The y position in tiles of Rectangle's left-top corner.
    * @param {number} [width] - specify a Rectangle of tiles to operate. The width in tiles.
    * @param {number} [height] - specify a Rectangle of tiles to operate. The height in tiles.
    */
    random: function (x, y, width, height, layer) {

        if (typeof layer === "undefined") { layer = this.currentLayer; }

        this.copy(x, y, width, height, layer);

        if (this._results.length < 2)
        {
            return;
        }

        var indexes = [];

        for (var t = 1; t < this._results.length; t++)
        {
            var idx = this._results[t].index;

            if (indexes.indexOf(idx) === -1)
            {
                indexes.push(idx);
            }
        }

        for (var i = 1; i < this._results.length; i++)
        {
            this._results[i].index = this.game.rnd.pick(indexes);
        }

        this.paste(x, y, this._results);

    },

    /**
    * Randomises a set of tiles in a given area. It will only randomise the tiles in that area, so if they're all the same nothing will appear to have changed!
    * @method random
    * @param {number} tileA - First tile index.
    * @param {number} tileB - Second tile index.
    * @param {number} [x] - specify a Rectangle of tiles to operate. The x position in tiles of Rectangle's left-top corner.
    * @param {number} [y] - specify a Rectangle of tiles to operate. The y position in tiles of Rectangle's left-top corner.
    * @param {number} [width] - specify a Rectangle of tiles to operate. The width in tiles.
    * @param {number} [height] - specify a Rectangle of tiles to operate. The height in tiles.
    */
    shuffle: function (x, y, width, height, layer) {

        if (typeof layer === "undefined") { layer = this.currentLayer; }

        this.copy(x, y, width, height, layer);

        if (this._results.length < 2)
        {
            return;
        }

        var header = this._results.shift();

        Phaser.Utils.shuffle(this._results);

        this._results.unshift(header);

        this.paste(x, y, this._results);

    },

    /**
    * Fill a tile block with a specific tile index.
    * @method fill
    * @param {number} index - Index of tiles you want to fill with.
    * @param {number} [x] - X position (in tiles) of block's left-top corner.
    * @param {number} [y] - Y position (in tiles) of block's left-top corner.
    * @param {number} [width] - width of block.
    * @param {number} [height] - height of block.
    */
    fill: function (index, x, y, width, height, layer) {

        this.copy(x, y, width, height, layer);

        if (this._results.length < 2)
        {
            return;
        }

        for (var i = 1; i < this._results.length; i++)
        {
            this._results[i].index = index;
        }

        this.paste(x, y, this._results);

    },

    removeAllLayers: function () {

        this.layers.length = 0;
        this.currentLayer = 0;

    },

    dump: function () {

        var txt = '';
        var args = [''];

        for (var y = 0; y < this.layers[this.currentLayer].height; y++)
        {
            for (var x = 0; x < this.layers[this.currentLayer].width; x++)
            {
                txt += "%c  ";

                if (this.layers[this.currentLayer].data[y][x] > 1)
                {
                	if (this.debugMap[this.layers[this.currentLayer].data[y][x]])
                	{
	                    args.push("background: " + this.debugMap[this.layers[this.currentLayer].data[y][x]]);
                	}
                	else
                	{
	                    args.push("background: #ffffff");
                	}
                }
                else
                {
                    args.push("background: rgb(0, 0, 0)");
                }
            }

            txt += "\n";
        }

        args[0] = txt;
        console.log.apply(console, args);

    },

    destroy: function () {

        this.removeAllLayers();
        this.game = null;

    }

};

//  Maybe should extend Sprite?
Phaser.TilemapLayer = function (game, x, y, renderWidth, renderHeight, tileset, tilemap, layer) {

	/**
	* @property {Phaser.Game} game - Description.
	*/ 
    this.game = game;
    
	/**
	* @property {Description} canvas - Description.
	* @default
	*/
    this.canvas = Phaser.Canvas.create(renderWidth, renderHeight);
    
	/**
	* @property {Description} context - Description.
	* @default
	*/
    this.context = this.canvas.getContext('2d');
    
	/**
	* @property {Description} baseTexture - Description.
	* @default
	*/
    this.baseTexture = new PIXI.BaseTexture(this.canvas);
    
	/**
	* @property {Description} texture - Description.
	* @default
	*/
    this.texture = new PIXI.Texture(this.baseTexture);
    
    this.textureFrame = new Phaser.Frame(0, 0, 0, renderWidth, renderHeight, 'tilemaplayer', game.rnd.uuid());

    Phaser.Sprite.call(this, this.game, x, y, this.texture, this.textureFrame);

    this.type = Phaser.TILEMAPLAYER;

    this.fixedToCamera = true;

    /**
    * @property {Description} tileset - Description.
    */
    this.tileset = null;

    this.tileWidth = 0;
    this.tileHeight = 0;
    this.tileMargin = 0;
    this.tileSpacing = 0;

    /**
    * Read-only variable, do NOT recommend changing after the map is loaded!
    * @property {number} widthInPixels
    * @default
    */
    this.widthInPixels = 0;

    /**
    * Read-only variable, do NOT recommend changing after the map is loaded!
    * @property {number} heightInPixels
    * @default
    */
    this.heightInPixels = 0;


    this.renderWidth = renderWidth;
    this.renderHeight = renderHeight;

    /**
    * @property {number} _ga - Local render loop var to help avoid gc spikes.
    * @private 
    */
    this._ga = 1;
    
    /**
    * @property {number} _dx - Local render loop var to help avoid gc spikes.
    * @private 
    */
    this._dx = 0;
    
    /**
    * @property {number} _dy - Local render loop var to help avoid gc spikes.
    * @private 
    */
    this._dy = 0;
    
    /**
    * @property {number} _dw - Local render loop var to help avoid gc spikes.
    * @private 
    */
    this._dw = 0;
    
    /**
    * @property {number} _dh - Local render loop var to help avoid gc spikes.
    * @private 
    */
    this._dh = 0;
    
    /**
    * @property {number} _tx - Local render loop var to help avoid gc spikes.
    * @private 
    */
    this._tx = 0;
    
    /**
    * @property {number} _ty - Local render loop var to help avoid gc spikes.
    * @private 
    */
    this._ty = 0;

    this._results = [];

    this._tw = 0;
    this._th = 0;
    
    /**
    * @property {number} _tl - Local render loop var to help avoid gc spikes.
    * @private 
    */
    this._tl = 0;
    
    /**
    * @property {number} _maxX - Local render loop var to help avoid gc spikes.
    * @private 
    */
    this._maxX = 0;
    
    /**
    * @property {number} _maxY - Local render loop var to help avoid gc spikes.
    * @private 
    */
    this._maxY = 0;
    
    /**
    * @property {number} _startX - Local render loop var to help avoid gc spikes.
    * @private 
    */
    this._startX = 0;
    
    /**
    * @property {number} _startY - Local render loop var to help avoid gc spikes.
    * @private 
    */
    this._startY = 0;

    this.tilemap = null;
    this.layer = null;
    this.index = 0;

    this._x = 0;
    this._y = 0;
    this._prevX = 0;
    this._prevY = 0;

    this.dirty = true;

    if (tileset instanceof Phaser.Tileset || typeof tileset === 'string')
    {
        this.updateTileset(tileset);
    }

    if (tilemap instanceof Phaser.Tilemap)
    {
        this.updateMapData(tilemap, layer);
    }

};

Phaser.TilemapLayer.prototype = Object.create(Phaser.Sprite.prototype);
Phaser.TilemapLayer.prototype = Phaser.Utils.extend(true, Phaser.TilemapLayer.prototype, Phaser.Sprite.prototype, PIXI.Sprite.prototype);
Phaser.TilemapLayer.prototype.constructor = Phaser.TilemapLayer;


Phaser.TilemapLayer.prototype.update = function () {

    this.scrollX = this.game.camera.x;
    this.scrollY = this.game.camera.y;

    this.render();

}

Phaser.TilemapLayer.prototype.resizeWorld = function () {

    this.game.world.setBounds(0, 0, this.widthInPixels, this.heightInPixels);

}

Phaser.TilemapLayer.prototype.updateTileset = function (tileset) {

    if (tileset instanceof Phaser.Tileset)
    {
        this.tileset = tileset;
    }
    else if (typeof tileset === 'string')
    {
        this.tileset = this.game.cache.getTileset('tiles');
    }
    else
    {
        return;
    }

    this.tileWidth = this.tileset.tileWidth;
    this.tileHeight = this.tileset.tileHeight;
    this.tileMargin = this.tileset.tileMargin;
    this.tileSpacing = this.tileset.tileSpacing;

    this.updateMax();

}

Phaser.TilemapLayer.prototype.updateMapData = function (tilemap, layer) {

    if (typeof layer === 'undefined')
    {
        layer = 0;
    }

    if (tilemap instanceof Phaser.Tilemap)
    {
        this.tilemap = tilemap;
        this.layer = this.tilemap.layers[layer];
        this.index = layer;
        this.updateMax();
        this.tilemap.dirty = true;
    }

}

/**
* Convert a pixel value to a tile coordinate.
* @param {number} x - X position of the point in target tile.
* @param {number} [layer] - layer of this tile located.
* @return {number} The tile with specific properties.
*/
Phaser.TilemapLayer.prototype.getTileX = function (x) {

    var tileWidth = this.tileWidth * this.scale.x;

    return this.game.math.snapToFloor(x, tileWidth) / tileWidth;

}

/**
* Convert a pixel value to a tile coordinate.
* @param {number} x - X position of the point in target tile.
* @param {number} [layer] - layer of this tile located.
* @return {number} The tile with specific properties.
*/
Phaser.TilemapLayer.prototype.getTileY = function (y) {

    var tileHeight = this.tileHeight * this.scale.y;

    return this.game.math.snapToFloor(y, tileHeight) / tileHeight;

}

Phaser.TilemapLayer.prototype.getTileXY = function (x, y, point) {

    point.x = this.getTileX(x);
    point.y = this.getTileY(y);

    return point;

}

/**
* 
* @method getTileOverlaps
* @param {GameObject} object - Tiles you want to get that overlaps this.
* @return {array} Array with tiles informations (each contains x, y, and the tile).
*/
Phaser.TilemapLayer.prototype.getTiles = function (x, y, width, height, collides) {

    if (this.tilemap === null)
    {
        return;
    }

    //  Should we only get tiles that have at least one of their collision flags set? (true = yes, false = no just get them all)
    if (typeof collides === 'undefined') { collides = false; }

    //  Cap the values

    if (x < 0)
    {
        x = 0;
    }

    if (y < 0)
    {
        y = 0;
    }

    if (width > this.widthInPixels)
    {
        width = this.widthInPixels;
    }

    if (height > this.heightInPixels)
    {
        height = this.heightInPixels;
    }

    var tileWidth = this.tileWidth * this.scale.x;
    var tileHeight = this.tileHeight * this.scale.y;

    //  Convert the pixel values into tile coordinates
    this._tx = this.game.math.snapToFloor(x, tileWidth) / tileWidth;
    this._ty = this.game.math.snapToFloor(y, tileHeight) / tileHeight;
    this._tw = (this.game.math.snapToCeil(width, tileWidth) + tileWidth) / tileWidth;
    this._th = (this.game.math.snapToCeil(height, tileHeight) + tileHeight) / tileHeight;

    //  This should apply the layer x/y here

    // this._results.length = 0;
    this._results = [];

    //  pretty sure we don't use this any more?
    // this._results.push( { x: x, y: y, width: width, height: height, tx: this._tx, ty: this._ty, tw: this._tw, th: this._th });

    var _index = 0;
    var _tile = null;
    var sx = 0;
    var sy = 0;

    for (var wy = this._ty; wy < this._ty + this._th; wy++)
    {
        for (var wx = this._tx; wx < this._tx + this._tw; wx++)
        {
            if (this.layer.data[wy] && this.layer.data[wy][wx])
            {
                //  Could combine
                _index = this.layer.data[wy][wx] - 1;
                _tile = this.tileset.getTile(_index);

                sx = _tile.width * this.scale.x;
                sy = _tile.height * this.scale.y;

                if (collides == false || (collides && _tile.collideNone == false))
                {
                    this._results.push({ x: wx * sx, right: (wx * sx) + sx, y: wy * sy, bottom: (wy * sy) + sy, width: sx, height: sy, tx: wx, ty: wy, tile: _tile });
                }
            }
        }
    }

    return this._results;

}

Phaser.TilemapLayer.prototype.updateMax = function () {

    this._maxX = this.game.math.ceil(this.canvas.width / this.tileWidth) + 1;
    this._maxY = this.game.math.ceil(this.canvas.height / this.tileHeight) + 1;

    if (this.layer)
    {
        if (this._maxX > this.layer.width)
        {
            this._maxX = this.layer.width;
        }

        if (this._maxY > this.layer.height)
        {
            this._maxY = this.layer.height;
        }

        this.widthInPixels = this.layer.width * this.tileWidth;
        this.heightInPixels = this.layer.height * this.tileHeight;
    }

    this.dirty = true;

}

Phaser.TilemapLayer.prototype.render = function () {

    if (this.tilemap && this.tilemap.dirty)
    {
        this.dirty = true;
    }

    if (!this.dirty || !this.tileset || !this.tilemap || !this.visible)
    {
        return;
    }

    this._prevX = this._dx;
    this._prevY = this._dy;

    this._dx = -(this._x - (this._startX * this.tileWidth));
    this._dy = -(this._y - (this._startY * this.tileHeight));

    this._tx = this._dx;
    this._ty = this._dy;

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (var y = this._startY; y < this._startY + this._maxY; y++)
    {
        this._column = this.layer.data[y];

        for (var x = this._startX; x < this._startX + this._maxX; x++)
        {
            //  only -1 on TILED maps, not CSV
            var tile = this.tileset.tiles[this._column[x]-1];

            if (tile)
            {
                this.context.drawImage(
                    this.tileset.image,
                    tile.x,
                    tile.y,
                    this.tileWidth,
                    this.tileHeight,
                    Math.floor(this._tx),
                    Math.floor(this._ty),
                    this.tileWidth,
                    this.tileHeight
                );
            }

            this._tx += this.tileWidth;

        }

        this._tx = this._dx;
        this._ty += this.tileHeight;
    }

    //  Only needed if running in WebGL, otherwise this array will never get cleared down I don't think!
    if (this.game.renderType == Phaser.WEBGL)
    {
        PIXI.texturesToUpdate.push(this.baseTexture);
    }

    this.dirty = false;

    if (this.tilemap.dirty)
    {
        this.tilemap.dirty = false;
    }

    return true;

}

Phaser.TilemapLayer.prototype.deltaAbsX = function () {
    return (this.deltaX() > 0 ? this.deltaX() : -this.deltaX());
}

Phaser.TilemapLayer.prototype.deltaAbsY = function () {
    return (this.deltaY() > 0 ? this.deltaY() : -this.deltaY());
}

Phaser.TilemapLayer.prototype.deltaX = function () {
    return this._dx - this._prevX;
}

Phaser.TilemapLayer.prototype.deltaY = function () {
    return this._dy - this._prevY;
}

Object.defineProperty(Phaser.TilemapLayer.prototype, "scrollX", {
    
    get: function () {
        return this._x;
    },

    set: function (value) {

        if (value !== this._x && value >= 0 && this.layer)
        {
            this._x = value;

            if (this._x > (this.widthInPixels - this.renderWidth))
            {
                this._x = this.widthInPixels - this.renderWidth;
            }

            this._startX = this.game.math.floor(this._x / this.tileWidth);

            if (this._startX < 0)
            {
                this._startX = 0;
            }

            if (this._startX + this._maxX > this.layer.width)
            {
                this._startX = this.layer.width - this._maxX;
            }

            this.dirty = true;
        }

    }

});

Object.defineProperty(Phaser.TilemapLayer.prototype, "scrollY", {
    
    get: function () {
        return this._y;
    },

    set: function (value) {

        if (value !== this._y && value >= 0 && this.layer)
        {
            this._y = value;

            if (this._y > (this.heightInPixels - this.renderHeight))
            {
                this._y = this.heightInPixels - this.renderHeight;
            }

            this._startY = this.game.math.floor(this._y / this.tileHeight);

            if (this._startY < 0)
            {
                this._startY = 0;
            }

            if (this._startY + this._maxY > this.layer.height)
            {
                this._startY = this.layer.height - this._maxY;
            }

            this.dirty = true;
        }

    }

});

Phaser.TilemapParser = {

	tileset: function (game, key, tileWidth, tileHeight, tileMax, tileMargin, tileSpacing) {

	    //  How big is our image?
	    var img = game.cache.getTilesetImage(key);

	    if (img == null)
	    {
	        return null;
	    }

	    var width = img.width;
	    var height = img.height;

	    //	If no tile width/height is given, try and figure it out (won't work if the tileset has margin/spacing)
	    if (tileWidth <= 0)
	    {
	        tileWidth = Math.floor(-width / Math.min(-1, tileWidth));
	    }

	    if (tileHeight <= 0)
	    {
	        tileHeight = Math.floor(-height / Math.min(-1, tileHeight));
	    }

	    var row = Math.round(width / tileWidth);
	    var column = Math.round(height / tileHeight);
	    var total = row * column;
	    
	    if (tileMax !== -1)
	    {
	        total = tileMax;
	    }

	    //  Zero or smaller than tile sizes?
	    if (width == 0 || height == 0 || width < tileWidth || height < tileHeight || total === 0)
	    {
	        console.warn("Phaser.TilemapParser.tileSet: width/height zero or width/height < given tileWidth/tileHeight");
	        return null;
	    }

	    //  Let's create some tiles
	    var x = tileMargin;
	    var y = tileMargin;

	    var tileset = new Phaser.Tileset(img, key, tileWidth, tileHeight, tileMargin, tileSpacing);

	    for (var i = 0; i < total; i++)
	    {
	        tileset.addTile(new Phaser.Tile(tileset, i, x, y, tileWidth, tileHeight));

	        x += tileWidth + tileSpacing;

	        if (x === width)
	        {
	            x = tileMargin;
	            y += tileHeight + tileSpacing;
	        }
	    }

	    return tileset;

	},

	parse: function (game, data, format) {

		if (format === Phaser.Tilemap.CSV)
		{
			return this.parseCSV(data);
		}
		else if (format === Phaser.Tilemap.TILED_JSON)
		{
			return this.parseTiledJSON(data);
		}

	},

	/**
	* Parse csv map data and generate tiles.
	* 
	* @method Phaser.Tilemap.prototype.parseCSV
	* @param {string} data - CSV map data.
	*/
	parseCSV: function (data) {

	    //  Trim any rogue whitespace from the data
	    data = data.trim();

	    var output = [];
	    var rows = data.split("\n");
	    var height = rows.length;
	    var width = 0;

	    for (var i = 0; i < rows.length; i++)
	    {
	    	output[i] = [];

	        var column = rows[i].split(",");

	        for (var c = 0; c < column.length; c++)
	        {
	            output[i][c] = parseInt(column[c]);
	        }

            if (width == 0)
            {
            	width = column.length;
            }
	    }

	    return [{ name: 'csv', width: width, height: height, alpha: 1, visible: true, indexes: [], tileMargin: 0, tileSpacing: 0, data: output }];

	},

	/**
	* Parse JSON map data and generate tiles.
	* 
	* @method Phaser.Tilemap.prototype.parseTiledJSON
	* @param {string} data - JSON map data.
	* @param {string} key - Asset key for tileset image.
	*/
	parseTiledJSON: function (json) {

		var layers = [];

	    for (var i = 0; i < json.layers.length; i++)
	    {
	        //  Check it's a data layer
	        if (!json.layers[i].data)
	        {
	            continue;
	        }

			//	json.tilewidth
			//	json.tileheight

	        var layer = {

		        name: json.layers[i].name,
		        width: json.layers[i].width,
		        height: json.layers[i].height,
		        alpha: json.layers[i].opacity,
		        visible: json.layers[i].visible,
		        indexes: [],

		        tileMargin: json.tilesets[0].margin,
		        tileSpacing: json.tilesets[0].spacing,

	        };

	        var output = [];
	        var c = 0;
	        var row;

	        for (var t = 0; t < json.layers[i].data.length; t++)
	        {
	            if (c == 0)
	            {
	                row = [];
	            }

	            row.push(json.layers[i].data[t]);
	            c++;

	            if (c == json.layers[i].width)
	            {
	            	output.push(row);
	                c = 0;
	            }
	        }

	        layer.data = output;
	        
	        layers.push(layer);

	    }

	    return layers;

	}

}


Phaser.Tileset = function (image, key, tileWidth, tileHeight, tileMargin, tileSpacing) {

    if (typeof tileMargin === "undefined") { tileMargin = 0; }
    if (typeof tileSpacing === "undefined") { tileSpacing = 0; }

    /**
    * @property {string} key - The cache ID.
    */
    this.key = key;

    this.image = image;

    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.margin = tileMargin;
    this.spacing = tileSpacing;

    this.tiles = [];

}

Phaser.Tileset.prototype = {

    addTile: function (tile) {

        this.tiles.push(tile);

        return tile;

    },

    getTile: function (index) {

        if (this.tiles[index])
        {
            return this.tiles[index];
        }

        return null;

    },

    setSpacing: function (margin, spacing) {

        this.tileMargin = margin;
        this.tileSpacing = spacing;

    },

    canCollide: function (index) {

        if (this.tiles[index])
        {
            return this.tiles[index].collideNone;
        }

        return null;

    },

    checkTileIndex: function (index) {

    	return (this.tiles[index]);

    },

    setCollisionRange: function (start, stop, left, right, up, down) {

        if (this.tiles[start] && this.tiles[stop] && start < stop)
        {
            for (var i = start; i <= stop; i++)
            {
                this.tiles[i].setCollision(left, right, up, down);
            }
        }

    },

    setCollision: function (index, left, right, up, down) {

        if (this.tiles[index])
        {
            this.tiles[index].setCollision(left, right, up, down);
        }

    },

}

/**
* @name Phaser.Tileset#total
* @property {number} total - The total number of tiles in this Tileset.
* @readonly
*/
Object.defineProperty(Phaser.Tileset.prototype, "total", {

    get: function () {
        return this.tiles.length;
    }

});

/**
 * We're replacing a couple of Pixi's methods here to fix or add some vital functionality:
 *
 * 1) Added support for Trimmed sprite sheets
 * 2) Skip display objects with an alpha of zero
 *
 * Hopefully we can remove this once Pixi has been updated to support these things.
 */

PIXI.CanvasRenderer.prototype.renderDisplayObject = function(displayObject)
{
	// no loger recurrsive!
	var transform;
	var context = this.context;
	
	context.globalCompositeOperation = 'source-over';
	
	// one the display object hits this. we can break the loop	
	var testObject = displayObject.last._iNext;
	displayObject = displayObject.first;
	
	do	
	{
		transform = displayObject.worldTransform;
		
		if(!displayObject.visible)
		{
			displayObject = displayObject.last._iNext;
			continue;
		}
		
		if(!displayObject.renderable || displayObject.alpha == 0)
		{
			displayObject = displayObject._iNext;
			continue;
		}
		
		if(displayObject instanceof PIXI.Sprite)
		{
			var frame = displayObject.texture.frame;
			
			if(frame)
			{
				context.globalAlpha = displayObject.worldAlpha;
				
				if (displayObject.texture.trimmed)
				{
					context.setTransform(transform[0], transform[3], transform[1], transform[4], transform[2] + displayObject.texture.trim.x, transform[5] + displayObject.texture.trim.y);
				}
				else
				{
					context.setTransform(transform[0], transform[3], transform[1], transform[4], transform[2], transform[5]);
				}
					
				context.drawImage(displayObject.texture.baseTexture.source, 
								   frame.x,
								   frame.y,
								   frame.width,
								   frame.height,
								   (displayObject.anchor.x) * -frame.width, 
								   (displayObject.anchor.y) * -frame.height,
								   frame.width,
								   frame.height);
			}					   
	   	}
	   	else if(displayObject instanceof PIXI.Strip)
		{
			context.setTransform(transform[0], transform[3], transform[1], transform[4], transform[2], transform[5])
			this.renderStrip(displayObject);
		}
		else if(displayObject instanceof PIXI.TilingSprite)
		{
			context.setTransform(transform[0], transform[3], transform[1], transform[4], transform[2], transform[5])
			this.renderTilingSprite(displayObject);
		}
		else if(displayObject instanceof PIXI.CustomRenderable)
		{
			displayObject.renderCanvas(this);
		}
		else if(displayObject instanceof PIXI.Graphics)
		{
			context.setTransform(transform[0], transform[3], transform[1], transform[4], transform[2], transform[5])
			PIXI.CanvasGraphics.renderGraphics(displayObject, context);
		}
		else if(displayObject instanceof PIXI.FilterBlock)
		{
			if(displayObject.open)
			{
				context.save();
				
				var cacheAlpha = displayObject.mask.alpha;
				var maskTransform = displayObject.mask.worldTransform;
				
				context.setTransform(maskTransform[0], maskTransform[3], maskTransform[1], maskTransform[4], maskTransform[2], maskTransform[5])
				
				displayObject.mask.worldAlpha = 0.5;
				
				context.worldAlpha = 0;
				
				PIXI.CanvasGraphics.renderGraphicsMask(displayObject.mask, context);
				context.clip();
				
				displayObject.mask.worldAlpha = cacheAlpha;
			}
			else
			{
				context.restore();
			}
		}
	//	count++
		displayObject = displayObject._iNext;
		
		
	}
	while(displayObject != testObject)
	
}

PIXI.WebGLBatch.prototype.update = function()
{
	var gl = this.gl;
	var worldTransform, width, height, aX, aY, w0, w1, h0, h1, index, index2, index3

	var a, b, c, d, tx, ty;

	var indexRun = 0;

	var displayObject = this.head;

	while(displayObject)
	{
		if(displayObject.vcount === PIXI.visibleCount)
		{
			width = displayObject.texture.frame.width;
			height = displayObject.texture.frame.height;

			// TODO trim??
			aX = displayObject.anchor.x;// - displayObject.texture.trim.x
			aY = displayObject.anchor.y; //- displayObject.texture.trim.y
			w0 = width * (1-aX);
			w1 = width * -aX;

			h0 = height * (1-aY);
			h1 = height * -aY;

			index = indexRun * 8;

			worldTransform = displayObject.worldTransform;

			a = worldTransform[0];
			b = worldTransform[3];
			c = worldTransform[1];
			d = worldTransform[4];
			tx = worldTransform[2];
			ty = worldTransform[5];

			if (displayObject.texture.trimmed)
			{
				tx += displayObject.texture.trim.x;
				ty += displayObject.texture.trim.y;
			}

			this.verticies[index + 0 ] = a * w1 + c * h1 + tx; 
			this.verticies[index + 1 ] = d * h1 + b * w1 + ty;

			this.verticies[index + 2 ] = a * w0 + c * h1 + tx; 
			this.verticies[index + 3 ] = d * h1 + b * w0 + ty; 

			this.verticies[index + 4 ] = a * w0 + c * h0 + tx; 
			this.verticies[index + 5 ] = d * h0 + b * w0 + ty; 

			this.verticies[index + 6] =  a * w1 + c * h0 + tx; 
			this.verticies[index + 7] =  d * h0 + b * w1 + ty; 

			if(displayObject.updateFrame || displayObject.texture.updateFrame)
			{
				this.dirtyUVS = true;

				var texture = displayObject.texture;

				var frame = texture.frame;
				var tw = texture.baseTexture.width;
				var th = texture.baseTexture.height;

				this.uvs[index + 0] = frame.x / tw;
				this.uvs[index +1] = frame.y / th;

				this.uvs[index +2] = (frame.x + frame.width) / tw;
				this.uvs[index +3] = frame.y / th;

				this.uvs[index +4] = (frame.x + frame.width) / tw;
				this.uvs[index +5] = (frame.y + frame.height) / th; 

				this.uvs[index +6] = frame.x / tw;
				this.uvs[index +7] = (frame.y + frame.height) / th;

				displayObject.updateFrame = false;
			}

			// TODO this probably could do with some optimisation....
			if(displayObject.cacheAlpha != displayObject.worldAlpha)
			{
				displayObject.cacheAlpha = displayObject.worldAlpha;

				var colorIndex = indexRun * 4;
				this.colors[colorIndex] = this.colors[colorIndex + 1] = this.colors[colorIndex + 2] = this.colors[colorIndex + 3] = displayObject.worldAlpha;
				this.dirtyColors = true;
			}
		}
		else
		{
			index = indexRun * 8;

			this.verticies[index + 0 ] = 0;
			this.verticies[index + 1 ] = 0;

			this.verticies[index + 2 ] = 0;
			this.verticies[index + 3 ] = 0;

			this.verticies[index + 4 ] = 0;
			this.verticies[index + 5 ] = 0;

			this.verticies[index + 6] = 0;
			this.verticies[index + 7] = 0;
		}

		indexRun++;
		displayObject = displayObject.__next;
   }
}
  return Phaser;
});