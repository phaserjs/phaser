/**
* Phaser - http://www.phaser.io
*
* v1.0.1 - Built at: Sun, 15 Sep 2013 02:56:00 +0000
*
* @author Richard Davey http://www.photonstorm.com @photonstorm
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
 * @module Phaser
 */
var Phaser = Phaser || { 

	VERSION: '1.0.1', 
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
	EMITTER: 11

 };

PIXI.InteractionManager = function (dummy) {
	//	We don't need this in Pixi, so we've removed it to save space
	//	however the Stage object expects a reference to it, so here is a dummy entry.
};

Phaser.Utils = {
	
	/**
	*  Javascript string pad
	*  http://www.webtoolkit.info/
	* pad = the string to pad it out with (defaults to a space)
	* dir = 1 (left), 2 (right), 3 (both)
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

	//	This is a slightly modified version of jQuery.isPlainObject
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
	//	This is a slightly modified version of jQuery.extend (http://api.jquery.com/jQuery.extend/)
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
						target[name] = extend(deep, clone, copy);

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
 * @param hex {Number}
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
 * @param x {Number} position of the point
 * @param y {Number} position of the point
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
 * @param x {Number} The X coord of the upper-left corner of the rectangle
 * @param y {Number} The Y coord of the upper-left corner of the rectangle
 * @param width {Number} The overall wisth of this rectangle
 * @param height {Number} The overall height of this rectangle
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
 * @param x {Number} The X coord of the point to test
 * @param y {Number} The Y coord of the point to test
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
 * @param index {Number} The index to place the child in
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
 * @param index {Number} The index to get the child from
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
 * @param backgroundColor {Number} the background color of the stage, easiest way to pass this in is in hex format
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
 * @param backgroundColor {Number} the color of the background, easiest way to pass this in is in hex format
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
 * @param width {Number}  the width of the tiling sprite
 * @param height {Number} the height of the tiling sprite
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
 * @param lineWidth {Number} width of the line to draw, will update the object's stored style
 * @param color {Number} color of the line to draw, will update the object's stored style
 * @param alpha {Number} alpha of the line to draw, will update the object's stored style
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
 * @param x {Number} the X coord to move to
 * @param y {Number} the Y coord to move to
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
 * @param x {Number} the X coord to draw to
 * @param y {Number} the Y coord to draw to
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
 * @param alpha {Number} the alpha
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
 * @param x {Number} The X coord of the top-left of the rectangle
 * @param y {Number} The Y coord of the top-left of the rectangle
 * @param width {Number} The width of the rectangle
 * @param height {Number} The height of the rectangle
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
 * @param x {Number} The X coord of the center of the circle
 * @param y {Number} The Y coord of the center of the circle
 * @param radius {Number} The radius of the circle
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
 * @param x {Number}
 * @param y {Number}
 * @param width {Number}
 * @param height {Number}
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
 * @param width=0 {Number} the width of the canvas view
 * @param height=0 {Number} the height of the canvas view
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
 * @param width {Number} the new width of the canvas view
 * @param height {Number} the new height of the canvas view
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
 * @param width=0 {Number} the width of the canvas view
 * @param height=0 {Number} the height of the canvas view
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
 * @param width {Number} the new width of the webGL view
 * @param height {Number} the new height of the webGL view
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

    this.width = pos.x * scale;
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
 * @param [style.strokeThickness=0] {Number} A number that represents the thickness of the stroke. Default is 0 (no stroke)
 * @param [style.wordWrap=false] {Boolean} Indicates if word wrap should be used
 * @param [style.wordWrapWidth=100] {Number} The width at which text will wrap
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
 * @param [style.strokeThickness=0] {Number} A number that represents the thickness of the stroke. Default is 0 (no stroke)
 * @param [style.wordWrap=false] {Boolean} Indicates if word wrap should be used
 * @param [style.wordWrapWidth=100] {Number} The width at which text will wrap
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
 @param width {Number} The width of the render texture
 @param height {Number} The height of the render texture
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
* Phaser - Camera
*
* A Camera is your view into the game world. It has a position and size and renders only those objects within its field of view.
* The game automatically creates a single Stage sized camera on boot. Move the camera around the world with Phaser.Camera.x/y
*/

Phaser.Camera = function (game, id, x, y, width, height) {

	this.game = game;
	this.world = game.world;
	this.id = 0; // reserved for future multiple camera set-ups
	
	//  The view into the world we wish to render (by default the game dimensions)
	//  The x/y values are in world coordinates, not screen coordinates, the width/height is how many pixels to render
	//	Objects outside of this view are not rendered (unless set to ignore the Camera, i.e. UI?)

    /**
    * Camera view.
    * @type {Rectangle}
    */
    this.view = new Phaser.Rectangle(x, y, width, height);

    /**
    * Used by Sprites to work out Camera culling.
    * @type {Rectangle}
    */
	this.screenView = new Phaser.Rectangle(x, y, width, height);

    /**
    * Sprite moving inside this Rectangle will not cause camera moving.
    * @type {Rectangle}
    */
    this.deadzone = null;

    /**
    * Whether this camera is visible or not. (default is true)
    * @type {bool}
    */
    this.visible = true;

    /**
    * Whether this camera is flush with the World Bounds or not.
    * @type {bool}
    */
    this.atLimit = { x: false, y: false };

    /**
    * If the camera is tracking a Sprite, this is a reference to it, otherwise null
    * @type {Sprite}
    */
    this.target = null;

    this._edge = 0;
	
};

//	Consts
Phaser.Camera.FOLLOW_LOCKON = 0;
Phaser.Camera.FOLLOW_PLATFORMER = 1;
Phaser.Camera.FOLLOW_TOPDOWN = 2;
Phaser.Camera.FOLLOW_TOPDOWN_TIGHT = 3;

Phaser.Camera.prototype = {

	/**
    * Tells this camera which sprite to follow.
    * @param target {Sprite} The object you want the camera to track. Set to null to not follow anything.
    * @param [style] {number} Leverage one of the existing "deadzone" presets. If you use a custom deadzone, ignore this parameter and manually specify the deadzone after calling follow().
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
    * Move the camera focus to this location instantly.
    * @param x {number} X position.
    * @param y {number} Y position.
    */
    focusOnXY: function (x, y) {

        this.view.x = Math.round(x - this.view.halfWidth);
        this.view.y = Math.round(y - this.view.halfHeight);

    },

	/**
    * Update focusing and scrolling.
    */
    update: function () {

        //  Add dirty flag

        if (this.target !== null)
        {
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
        }

        this.checkWorldBounds();

    },

    checkWorldBounds: function () {

        this.atLimit.x = false;
        this.atLimit.y = false;

        //  Make sure we didn't go outside the cameras worldBounds
        if (this.view.x < this.world.bounds.left)
        {
            this.atLimit.x = true;
            this.view.x = this.world.bounds.left;
        }

        if (this.view.x > this.world.bounds.right - this.width)
        {
            this.atLimit.x = true;
            this.view.x = (this.world.bounds.right - this.width) + 1;
        }

        if (this.view.y < this.world.bounds.top)
        {
            this.atLimit.y = true;
            this.view.y = this.world.bounds.top;
        }

        if (this.view.y > this.world.bounds.bottom - this.height)
        {
            this.atLimit.y = true;
            this.view.y = (this.world.bounds.bottom - this.height) + 1;
        }

        this.view.floor();

    },

    setPosition: function (x, y) {

        this.view.x = x;
        this.view.y = y;
        this.checkWorldBounds();

    },

    setSize: function (width, height) {

        this.view.width = width;
        this.view.height = height;

    }

};

Object.defineProperty(Phaser.Camera.prototype, "x", {

    get: function () {
        return this.view.x;
    },

    set: function (value) {
        this.view.x = value;
        this.checkWorldBounds();
    }

});

Object.defineProperty(Phaser.Camera.prototype, "y", {

    get: function () {
        return this.view.y;
    },

    set: function (value) {
        this.view.y = value;
        this.checkWorldBounds();
    }

});

Object.defineProperty(Phaser.Camera.prototype, "width", {

    get: function () {
        return this.view.width;
    },

    set: function (value) {
        this.view.width = value;
    }

});

Object.defineProperty(Phaser.Camera.prototype, "height", {

    get: function () {
        return this.view.height;
    },

    set: function (value) {
        this.view.height = value;
    }

});

/**
* State
*
* This is a base State class which can be extended if you are creating your own game.
* It provides quick access to common functions such as the camera, cache, input, match, sound and more.
*
* @package    Phaser.State
* @author     Richard Davey <rich@photonstorm.com>
* @copyright  2013 Photon Storm Ltd.
* @license    https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
*/

Phaser.State = function () {

    this.game = null;
    this.add = null;
    this.camera = null;
    this.cache = null;
    this.input = null;
    this.load = null;
    this.math = null;
    this.sound = null;
    this.stage = null;
    this.time = null;
    this.tweens = null;
    this.world = null;
    this.particles = null;
    this.physics = null;

};

Phaser.State.prototype = {

    link: function (game) {

        this.game = game;
        this.add = game.add;
        this.camera = game.camera;
        this.cache = game.cache;
        this.input = game.input;
        this.load = game.load;
        this.math = game.math;
        this.sound = game.sound;
        this.stage = game.stage;
        this.time = game.time;
        this.tweens = game.tweens;
        this.world = game.world;
        this.particles = game.particles;
        this.physics = game.physics;

    },

    /**
    * Override this method to add some load operations.
    * If you need to use the loader, you may need to use them here.
    */
    preload: function () {
    },

    /**
    * This method is called after the game engine successfully switches states.
    * Feel free to add any setup code here.(Do not load anything here, override init() instead)
    */
    create: function () {
    },

    /**
    * Put update logic here.
    */
    update: function () {
    },

    /**
    * Put render operations here.
    */
    render: function () {
    },

    /**
    * This method will be called when game paused.
    */
    paused: function () {
    },

    /**
    * This method will be called when the state is destroyed
    */
    destroy: function () {
    }

};

Phaser.StateManager = function (game, pendingState) {

	this.game = game;

	this.states = {};

	if (pendingState !== null)
	{
		this._pendingState = pendingState;
	}

};

Phaser.StateManager.prototype = {
	
	/**
	* @type {Phaser.Game}
	*/
	game: null,

	/**
	* The state to be switched to in the next frame.
	* @type {State}
	*/
	_pendingState: null,

	/**
	* Flag that sets if the State has been created or not.
	* @type {Boolean}
	*/
	_created: false,

	/**
	* The state to be switched to in the next frame.
	* @type {Object}
	*/
	states: {},

	/**
	* The current active State object (defaults to null)
	* @type {String}
	*/
	current: '',
	
	/**
	* This will be called when the state is started (i.e. set as the current active state)
	* @type {function}
	*/
	onInitCallback: null,

	/**
	* This will be called when init states. (loading assets...)
	* @type {function}
	*/
	onPreloadCallback: null,
	
	/**
	* This will be called when create states. (setup states...)
	* @type {function}
	*/
	onCreateCallback: null,

	/**
	* This will be called when State is updated, this doesn't happen during load (see onLoadUpdateCallback)
	* @type {function}
	*/
	onUpdateCallback: null,

	/**
	* This will be called when the State is rendered, this doesn't happen during load (see onLoadRenderCallback)
	* @type {function}
	*/
	onRenderCallback: null,

	/**
	* This will be called before the State is rendered and before the stage is cleared
	* @type {function}
	*/
	onPreRenderCallback: null,

	/**
	* This will be called when the State is updated but only during the load process
	* @type {function}
	*/
	onLoadUpdateCallback: null,

	/**
	* This will be called when the State is rendered but only during the load process
	* @type {function}
	*/
	onLoadRenderCallback: null,

	/**
	* This will be called when states paused.
	* @type {function}
	*/
	onPausedCallback: null,

	/**
	* This will be called when the state is shut down (i.e. swapped to another state)
	* @type {function}
	*/
	onShutDownCallback: null,

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
    * @param key {String} A unique key you use to reference this state, i.e. "MainMenu", "Level1".
    * @param state {State} The state you want to switch to.
    * @param autoStart {Boolean} Start the state immediately after creating it? (default true)
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
    		newState.link(this.game);
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
    * @param key {String} The key of the state you want to start.
    * @param [clearWorld] {bool} clear everything in the world? (Default to true)
    * @param [clearCache] {bool} clear asset cache? (Default to false and ONLY available when clearWorld=true)
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
				this.onShutDownCallback.call(this.callbackContext);
			}

	        if (clearWorld) {

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
            this.onPreloadCallback.call(this.callbackContext);

            //  Is the loader empty?
            if (this.game.load.queueSize == 0)
            {
		    	// console.log('Loader queue empty');
                this.game.loadComplete();

                if (this.onCreateCallback)
                {
                    this.onCreateCallback.call(this.callbackContext);
                }

				this._created = true;
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
            if (this.onCreateCallback)
            {
				// console.log('Create callback found');
                this.onCreateCallback.call(this.callbackContext);
            }

			this._created = true;

            this.game.loadComplete();
        }

    },

	//	Used by onInit and onShutdown when those functions don't exist on the state
    dummy: function () {
    },

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

	setCurrentState: function (key) {

        this.callbackContext = this.states[key];

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

		this.onInitCallback.call(this.callbackContext);

	},

    loadComplete: function () {

		// console.log('Phaser.StateManager.loadComplete');

        if (this._created == false && this.onCreateCallback)
        {
			// console.log('Create callback found');
            this.onCreateCallback.call(this.callbackContext);
            this._created = true;
        }

    },

    update: function () {

    	if (this._created && this.onUpdateCallback)
    	{
			this.onUpdateCallback.call(this.callbackContext);
    	}
    	else
    	{
		    if (this.onLoadUpdateCallback)
		    {
		    	this.onLoadUpdateCallback.call(this.callbackContext);
			}
		}

    },

    preRender: function () {

	    if (this.onPreRenderCallback)
	    {
	    	this.onPreRenderCallback.call(this.callbackContext);
		}

    },

    render: function () {

    	if (this._created && this.onRenderCallback)
    	{
			this.onRenderCallback.call(this.callbackContext);
    	}
    	else
    	{
		    if (this.onLoadRenderCallback)
		    {
		    	this.onLoadRenderCallback.call(this.callbackContext);
			}
		}

    },

	/**
    * Nuke the entire game from orbit
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
Phaser.LinkedList = function () {

    this.next = null;
    this.prev = null;
    this.first = null;
    this.last = null;
    this.total = 0;

};

Phaser.LinkedList.prototype = {


    add: function (child) {

    	//	If the list is empty
    	if (this.total == 0 && this.first == null && this.last == null)
    	{
    		this.first = child;
    		this.last = child;
	    	this.next = child;
	    	child.prev = this;
	    	this.total++;
    		return;
    	}

    	//	Get gets appended to the end of the list, regardless of anything, and it won't have any children of its own (non-nested list)
    	this.last.next = child;

    	child.prev = this.last;

    	this.last = child;

		this.total++;

		return child;

    },

    remove: function (child) {

    	//	If the list is empty
    	if (this.first == null && this.last == null)
    	{
    		return;
    	}

		this.total--;

    	//	The only node?
    	if (this.first == child && this.last == child)
    	{
    		this.first = null;
    		this.last = null;
    		this.next = null;
    		child.next = null;
    		child.prev = null;
    		return;
    	}

		var childPrev = child.prev;

    	//	Tail node?
    	if (child.next)
    	{
			//	Has another node after it?
	    	child.next.prev = child.prev;
    	}

    	childPrev.next = child.next;

    },

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

    },

	dump: function () {

		var spacing = 20;

		var output = "\n" + Phaser.Utils.pad('Node', spacing) + "|" + Phaser.Utils.pad('Next', spacing) + "|" + Phaser.Utils.pad('Previous', spacing) + "|" + Phaser.Utils.pad('First', spacing) + "|" + Phaser.Utils.pad('Last', spacing);
		console.log(output);

		var output = Phaser.Utils.pad('----------', spacing) + "|" + Phaser.Utils.pad('----------', spacing) + "|" + Phaser.Utils.pad('----------', spacing) + "|" + Phaser.Utils.pad('----------', spacing) + "|" + Phaser.Utils.pad('----------', spacing);
		console.log(output);

		var entity = this;

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
* Phaser.Signal
*
* A Signal is used for object communication via a custom broadcaster instead of Events.
* 
* @author Miller Medeiros http://millermedeiros.github.com/js-signals/
* @constructor
*/
Phaser.Signal = function () {

	/**
	 * @type Array.<Phaser.SignalBinding>
	 * @private
	 */
	this._bindings = [];
	this._prevParams = null;

	// enforce dispatch to aways work on same context (#47)
	var self = this;

	this.dispatch = function(){
		Phaser.Signal.prototype.dispatch.apply(self, arguments);
	};

};

Phaser.Signal.prototype = {

	/**
	 * If Signal should keep record of previously dispatched parameters and
	 * automatically execute listener during `add()`/`addOnce()` if Signal was
	 * already dispatched before.
	 * @type boolean
	 */
	memorize: false,

	/**
	 * @type boolean
	 * @private
	 */
	_shouldPropagate: true,

	/**
	 * If Signal is active and should broadcast events.
	 * <p><strong>IMPORTANT:</strong> Setting this property during a dispatch will only affect the next dispatch, if you want to stop the propagation of a signal use `halt()` instead.</p>
	 * @type boolean
	 */
	active: true,

	validateListener: function (listener, fnName) {
		if (typeof listener !== 'function') {
			throw new Error( 'listener is a required param of {fn}() and should be a Function.'.replace('{fn}', fnName) );
		}
	},

	/**
	 * @param {Function} listener
	 * @param {boolean} isOnce
	 * @param {Object} [listenerContext]
	 * @param {Number} [priority]
	 * @return {Phaser.SignalBinding}
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
	 * @param {Phaser.SignalBinding} binding
	 * @private
	 */
	_addBinding: function (binding) {
		//simplified insertion sort
		var n = this._bindings.length;
		do { --n; } while (this._bindings[n] && binding._priority <= this._bindings[n]._priority);
		this._bindings.splice(n + 1, 0, binding);
	},

	/**
	 * @param {Function} listener
	 * @return {number}
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
	 * @param {Function} listener
	 * @param {Object} [context]
	 * @return {boolean} if Signal has the specified listener.
	 */
	has: function (listener, context) {
		return this._indexOfListener(listener, context) !== -1;
	},

	/**
	 * Add a listener to the signal.
	 * @param {Function} listener Signal handler function.
	 * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
	 * @param {Number} [priority] The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)
	 * @return {Phaser.SignalBinding} An Object representing the binding between the Signal and listener.
	 */
	add: function (listener, listenerContext, priority) {
		this.validateListener(listener, 'add');
		return this._registerListener(listener, false, listenerContext, priority);
	},

	/**
	 * Add listener to the signal that should be removed after first execution (will be executed only once).
	 * @param {Function} listener Signal handler function.
	 * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
	 * @param {Number} [priority] The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)
	 * @return {Phaser.SignalBinding} An Object representing the binding between the Signal and listener.
	 */
	addOnce: function (listener, listenerContext, priority) {
		this.validateListener(listener, 'addOnce');
		return this._registerListener(listener, true, listenerContext, priority);
	},

	/**
	 * Remove a single listener from the dispatch queue.
	 * @param {Function} listener Handler function that should be removed.
	 * @param {Object} [context] Execution context (since you can add the same handler multiple times if executing in a different context).
	 * @return {Function} Listener handler function.
	 */
	remove: function (listener, context) {
		this.validateListener(listener, 'remove');

		var i = this._indexOfListener(listener, context);
		if (i !== -1) {
			this._bindings[i]._destroy(); //no reason to a Phaser.SignalBinding exist if it isn't attached to a signal
			this._bindings.splice(i, 1);
		}
		return listener;
	},

	/**
	 * Remove all listeners from the Signal.
	 */
	removeAll: function () {
		var n = this._bindings.length;
		while (n--) {
			this._bindings[n]._destroy();
		}
		this._bindings.length = 0;
	},

	/**
	 * @return {number} Number of listeners attached to the Signal.
	 */
	getNumListeners: function () {
		return this._bindings.length;
	},

	/**
	 * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
	 * <p><strong>IMPORTANT:</strong> should be called only during signal dispatch, calling it before/after dispatch won't affect signal broadcast.</p>
	 * @see Signal.prototype.disable
	 */
	halt: function () {
		this._shouldPropagate = false;
	},

	/**
	 * Dispatch/Broadcast Signal to all listeners added to the queue.
	 * @param {...*} [params] Parameters that should be passed to each handler.
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
	 */
	forget: function(){
		this._prevParams = null;
	},

	/**
	 * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
	 * <p><strong>IMPORTANT:</strong> calling any method on the signal instance after calling dispose will throw errors.</p>
	 */
	dispose: function () {
		this.removeAll();
		delete this._bindings;
		delete this._prevParams;
	},

	/**
	 * @return {string} String representation of the object.
	 */
	toString: function () {
		return '[Phaser.Signal active:'+ this.active +' numListeners:'+ this.getNumListeners() +']';
	}

};

/**
* Phaser.SignalBinding
*
* Object that represents a binding between a Signal and a listener function.
* <br />- <strong>This is an internal constructor and shouldn't be called by regular users.</strong>
* <br />- inspired by Joa Ebert AS3 SignalBinding and Robert Penner's Slot classes.
*
* @author Miller Medeiros http://millermedeiros.github.com/js-signals/
* @constructor
* @internal
* @name SignalBinding
* @param {Signal} signal Reference to Signal object that listener is currently bound to.
* @param {Function} listener Handler function bound to the signal.
* @param {boolean} isOnce If binding should be executed just once.
* @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
* @param {Number} [priority] The priority level of the event listener. (default = 0).
*/
Phaser.SignalBinding = function (signal, listener, isOnce, listenerContext, priority) {

    /**
     * Handler function bound to the signal.
     * @type Function
     * @private
     */
    this._listener = listener;

    /**
     * If binding should be executed just once.
     * @type boolean
     * @private
     */
    this._isOnce = isOnce;

    /**
     * Context on which listener will be executed (object that should represent the `this` variable inside listener function).
     * @memberOf SignalBinding.prototype
     * @name context
     * @type Object|undefined|null
     */
    this.context = listenerContext;

    /**
     * Reference to Signal object that listener is currently bound to.
     * @type Signal
     * @private
     */
    this._signal = signal;

    /**
     * Listener priority
     * @type Number
     * @private
     */
    this._priority = priority || 0;

};

Phaser.SignalBinding.prototype = {

    /**
     * If binding is active and should be executed.
     * @type boolean
     */
    active: true,

    /**
     * Default parameters passed to listener during `Signal.dispatch` and `SignalBinding.execute`. (curried parameters)
     * @type Array|null
     */
    params: null,

    /**
     * Call listener passing arbitrary parameters.
     * <p>If binding was added using `Signal.addOnce()` it will be automatically removed from signal dispatch queue, this method is used internally for the signal dispatch.</p>
     * @param {Array} [paramsArr] Array of parameters that should be passed to the listener
     * @return {*} Value returned by the listener.
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
     * - alias to: mySignal.remove(myBinding.getListener());
     * @return {Function|null} Handler function bound to the signal or `null` if binding was previously detached.
     */
    detach: function () {
        return this.isBound() ? this._signal.remove(this._listener, this.context) : null;
    },

    /**
     * @return {Boolean} `true` if binding is still bound to the signal and have a listener.
     */
    isBound: function () {
        return (!!this._signal && !!this._listener);
    },

    /**
     * @return {boolean} If SignalBinding will only be executed once.
     */
    isOnce: function () {
        return this._isOnce;
    },

    /**
     * @return {Function} Handler function bound to the signal.
     */
    getListener: function () {
        return this._listener;
    },

    /**
     * @return {Signal} Signal that listener is currently bound to.
     */
    getSignal: function () {
        return this._signal;
    },

    /**
     * Delete instance properties
     * @private
     */
    _destroy: function () {
        delete this._signal;
        delete this._listener;
        delete this.context;
    },

    /**
     * @return {string} String representation of the object.
     */
    toString: function () {
        return '[Phaser.SignalBinding isOnce:' + this._isOnce +', isBound:'+ this.isBound() +', active:' + this.active + ']';
    }

};

/**
* Phaser - Plugin
*
* This is a base Plugin template to use for any Phaser plugin development
*/
Phaser.Plugin = function (game, parent) {

    this.game = game;
    this.parent = parent;
    
    this.active = false;
    this.visible = false;
    
    this.hasPreUpdate = false;
    this.hasUpdate = false;
    this.hasRender = false;
    this.hasPostRender = false;

};

Phaser.Plugin.prototype = {

    /**
    * Pre-update is called at the start of the update cycle, before any other updates have taken place (including Physics).
    * It is only called if active is set to true.
    */
    preUpdate: function () {
    },

    /**
    * Update is called after all the core subsystems (Input, Tweens, Sound, etc) and the State have updated, but before the render.
    * It is only called if active is set to true.
    */
    update: function () {
    },

    /**
    * Render is called right after the Game Renderer completes, but before the State.render.
    * It is only called if visible is set to true.
    */
    render: function () {
    },

    /**
    * Post-render is called after the Game Renderer and State.render have run.
    * It is only called if visible is set to true.
    */
    postRender: function () {
    },

    /**
    * Clear down this Plugin and null out references
    */
    destroy: function () {

        this.game = null;
        this.parent = null;
        this.active = false;
        this.visible = false;
        
    }

};

/**
* Phaser - PluginManager
*
* TODO: We can optimise this a lot by using separate hashes per function (update, render, etc)
*/

Phaser.PluginManager = function(game, parent) {

    this.game = game;
    this._parent = parent;
    this.plugins = [];
    this._pluginsLength = 0;

};

Phaser.PluginManager.prototype = {

    /**
    * Add a new Plugin to the PluginManager.
    * The plugins game and parent reference are set to this game and pluginmanager parent.
    * @type {Phaser.Plugin}
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
            return plugin;
        }
        else
        {
            return null;
        }
    },

    remove: function (plugin) {

        //  TODO
        this._pluginsLength--;

    },

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

    destroy: function () {

        this.plugins.length = 0;
        this._pluginsLength = 0;
        this.game = null;
        this._parent = null;

    }

};

/**
 * Stage
 *
 * The Stage controls the canvas on which everything is displayed. It handles display within the browser,
 * focus handling, game resizing, scaling and the pause, boot and orientation screens.
 *
 * @package    Phaser.Stage
 * @author     Richard Davey <rich@photonstorm.com>
 * @copyright  2013 Photon Storm Ltd.
 * @license    https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
 */
Phaser.Stage = function (game, width, height) {
	
	this.game = game;

    /**
    * Background color of the stage (defaults to black). Set via the public backgroundColor property.
    * @type {string}
    */
    this._backgroundColor = 'rgb(0,0,0)';

	//	Get the offset values (for input and other things)
	this.offset = new Phaser.Point;

    this.canvas = Phaser.Canvas.create(width, height);    
    this.canvas.style['-webkit-full-screen'] = 'width: 100%; height: 100%';

    //  The Pixi Stage which is hooked to the renderer
    this._stage = new PIXI.Stage(0x000000, false);
    this._stage.name = '_stage_root';
    
    this.scaleMode = Phaser.StageScaleMode.NO_SCALE;
    this.scale = new Phaser.StageScaleMode(this.game, width, height);
    this.aspectRatio = width / height;

};

Phaser.Stage.prototype = {

    boot: function () {

        Phaser.Canvas.getOffset(this.canvas, this.offset);

        this.bounds = new Phaser.Rectangle(this.offset.x, this.offset.y, this.game.width, this.game.height);

        var _this = this;

        this._onChange = function (event) {
            return _this.visibilityChange(event);
        }

        document.addEventListener('visibilitychange', this._onChange, false);
        document.addEventListener('webkitvisibilitychange', this._onChange, false);
        document.addEventListener('pagehide', this._onChange, false);
        document.addEventListener('pageshow', this._onChange, false);

        window.onblur = this._onChange;
        window.onfocus = this._onChange;

    },

	/**
    * This method is called when the document visibility is changed.
    */
    visibilityChange: function (event) {

        if (this.disableVisibilityChange)
        {
            return;
        }

        if (event.type == 'pagehide' || event.type == 'blur' || document['hidden'] == true || document['webkitHidden'] == true)
        {
	        // console.log('visibilityChange - hidden', event);
	        this.game.paused = true;
        }
        else
        {
	        // console.log('visibilityChange - shown', event);
	        this.game.paused = false;
        }

    },

};

Object.defineProperty(Phaser.Stage.prototype, "backgroundColor", {

    get: function () {
        return this._backgroundColor;
    },

    set: function (color) {

        this._backgroundColor = color;

        if (typeof color === 'string')
        {
            color = Phaser.Color.hexToRGB(color);
        }

        this._stage.setBackgroundColor(color);

    }

});

Phaser.Group = function (game, parent, name, useStage) {

	parent = parent || null;

	if (typeof useStage == 'undefined')
	{
		useStage = false;
	}

	this.game = game;
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
			}
			else
			{
				parent.addChild(this._container);
			}
		}
		else
		{
			this.game.stage._stage.addChild(this._container);
		}
	}

	this.type = Phaser.GROUP;

	this.exists = true;

    /**
    * Helper for sort.
    */
    this._sortIndex = 'y';
	
};

Phaser.Group.prototype = {

	add: function (child) {

		if (child.group !== this)
		{
			child.group = this;

			if (child.events)
			{
				child.events.onAddedToGroup.dispatch(child, this);
			}

			this._container.addChild(child);
		}

		return child;

	},

	addAt: function (child, index) {

		if (child.group !== this)
		{
			child.group = this;

			if (child.events)
			{
				child.events.onAddedToGroup.dispatch(child, this);
			}

			this._container.addChildAt(child, index);
		}

		return child;

	},

	getAt: function (index) {

		return this._container.getChildAt(index);

	},

	create: function (x, y, key, frame, exists) {

		if (typeof exists == 'undefined') { exists = true; }

		var child = new Phaser.Sprite(this.game, x, y, key, frame);

		child.group = this;
		child.exists = exists;

		if (child.events)
		{
			child.events.onAddedToGroup.dispatch(child, this);
		}

		this._container.addChild(child);

		return child;

	},

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

	bringToTop: function (child) {

		if (child.group === this)
		{
			this.remove(child);
			this.add(child);
		}

		return child;

	},

	getIndex: function (child) {

		return this._container.children.indexOf(child);

	},

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
		}

	},

	/**
    * Call this function to sort the group according to a particular value and order.
    * For example, to sort game objects for Zelda-style overlaps you might call
    * <code>myGroup.sort("y",Group.ASCENDING)</code> at the bottom of your
    * <code>State.update()</code> override.  To sort all existing objects after
    * a big explosion or bomb attack, you might call <code>myGroup.sort("exists",Group.DESCENDING)</code>.
    *
    * @param {string} index The <code>string</code> name of the member variable you want to sort on.  Default value is "z".
    * @param {number} order A <code>Group</code> constant that defines the sort order.  Possible values are <code>Group.ASCENDING</code> and <code>Group.DESCENDING</code>.  Default value is <code>Group.ASCENDING</code>.
    */

	//	http://www.chiark.greenend.org.uk/~sgtatham/algorithms/listsort.c

    sort: function (index, order) {
        // if (typeof index === "undefined") { index = 'z'; }
        // if (typeof order === "undefined") { order = Phaser.Types.SORT_ASCENDING; }
        // var _this = this;
        // this._sortIndex = index;
        // this._sortOrder = order;
        // this.members.sort(function (a, b) {
        //     return _this.sortHandler(a, b);
        // });
    },

	/**
    * Helper function for the sort process.
    *
    * @param {Basic} Obj1 The first object being sorted.
    * @param {Basic} Obj2 The second object being sorted.
    *
    * @return {number} An integer value: -1 (Obj1 before Obj2), 0 (same), or 1 (Obj1 after Obj2).
    */
    sortHandler: function (obj1, obj2) {

    	/*
        if (!obj1 || !obj2) {
            //console.log('null objects in sort', obj1, obj2);
            return 0;
        }
        if (obj1[this._sortIndex] < obj2[this._sortIndex]) {
            return this._sortOrder;
        } else if (obj1[this._sortIndex] > obj2[this._sortIndex]) {
            return -this._sortOrder;
        }
        return 0;
        */
    },

	//	key is an ARRAY of values.
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

		if (key.length == 1)
		{
			if (operation == 0) { child[key[0]] = value; }
			else if (operation == 1) { child[key[0]] += value; }
			else if (operation == 2) { child[key[0]] -= value; }
			else if (operation == 3) { child[key[0]] *= value; }
			else if (operation == 4) { child[key[0]] /= value; }
		}
		else if (key.length == 2)
		{
			if (operation == 0) { child[key[0]][key[1]] = value; }
			else if (operation == 1) { child[key[0]][key[1]] += value; }
			else if (operation == 2) { child[key[0]][key[1]] -= value; }
			else if (operation == 3) { child[key[0]][key[1]] *= value; }
			else if (operation == 4) { child[key[0]][key[1]] /= value; }
		}
		else if (key.length == 3)
		{
			if (operation == 0) { child[key[0]][key[1]][key[2]] = value; }
			else if (operation == 1) { child[key[0]][key[1]][key[2]] += value; }
			else if (operation == 2) { child[key[0]][key[1]][key[2]] -= value; }
			else if (operation == 3) { child[key[0]][key[1]][key[2]] *= value; }
			else if (operation == 4) { child[key[0]][key[1]][key[2]] /= value; }
		}
		else if (key.length == 4)
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

	setAll: function (key, value, checkAlive, checkVisible, operation) {

		key = key.split('.');
		checkAlive = checkAlive || false;
		checkVisible = checkVisible || false;
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

	addAll: function (key, value, checkAlive, checkVisible) {

		this.setAll(key, value, checkAlive, checkVisible, 1);

	},

	subAll: function (key, value, checkAlive, checkVisible) {

		this.setAll(key, value, checkAlive, checkVisible, 2);

	},

	multiplyAll: function (key, value, checkAlive, checkVisible) {

		this.setAll(key, value, checkAlive, checkVisible, 3);

	},

	divideAll: function (key, value, checkAlive, checkVisible) {

		this.setAll(key, value, checkAlive, checkVisible, 4);

	},

	/**
    * Calls a function on all of the active children (children with exists=true).
    * You must pass the context in which the callback is applied.
    * After the context you can add as many parameters as you like, which will all be passed to the child.
    */
	callAll: function (callback, callbackContext) {

		var args = Array.prototype.splice.call(arguments, 2);

		if (this._container.children.length > 0 && this._container.first._iNext)
		{
			var currentNode = this._container.first._iNext;
				
			do	
			{
				if (currentNode.exists && currentNode[callback])
				{
					currentNode[callback].apply(currentNode, args);
				}

				currentNode = currentNode._iNext;
			}
			while (currentNode != this._container.last._iNext)

		}

	},

	forEach: function (callback, callbackContext, checkExists) {

		if (typeof checkExists == 'undefined') { checkExists = false; }

		if (this._container.children.length > 0 && this._container.first._iNext)
		{
			var currentNode = this._container.first._iNext;
				
			do	
			{
				if (checkExists == false || (checkExists && currentNode.exists))
				{
					callback.call(callbackContext, currentNode);
				}

				currentNode = currentNode._iNext;
			}
			while (currentNode != this._container.last._iNext);

		}

	},

	forEachAlive: function (callback, callbackContext) {

		if (this._container.children.length > 0 && this._container.first._iNext)
		{
			var currentNode = this._container.first._iNext;
				
			do	
			{
				if (currentNode.alive)
				{
					callback.call(callbackContext, currentNode);
				}

				currentNode = currentNode._iNext;
			}
			while (currentNode != this._container.last._iNext);

		}

	},

	forEachDead: function (callback, callbackContext) {

		if (this._container.children.length > 0 && this._container.first._iNext)
		{
			var currentNode = this._container.first._iNext;
				
			do	
			{
				if (currentNode.alive == false)
				{
					callback.call(callbackContext, currentNode);
				}

				currentNode = currentNode._iNext;
			}
			while (currentNode != this._container.last._iNext);

		}
	},

	/**
    * Call this function to retrieve the first object with exists == (the given state) in the group.
    *
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
    * This is handy for checking if everything's wiped out, or choosing a squad leader, etc.
    *
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
    * This is handy for checking if everything's wiped out, or choosing a squad leader, etc.
    *
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
    * @return {number} The number of children flagged as alive. Returns -1 if Group is empty.
    */
	countLiving: function () {

		var total = -1;

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

		return total;

	},

	/**
    * Call this function to find out how many members of the group are dead.
    *
    * @return {number} The number of children flagged as dead. Returns -1 if Group is empty.
    */
	countDead: function () {

		var total = -1;

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

		return total;

	},

	/**
    * Returns a member at random from the group.
    *
    * @param {number} startIndex Optional offset off the front of the array. Default value is 0, or the beginning of the array.
    * @param {number} length Optional restriction on the number of values you want to randomly select from.
    *
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

	remove: function (child) {

		child.events.onRemovedFromGroup.dispatch(child, this);
		this._container.removeChild(child);
		child.group = null;

	},

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

	},

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
		}

	},

	destroy: function () {

		this.removeAll();

		this._container.parent.removeChild(this._container);

		this._container = null;

		this.game = null;

		this.exists = false;

	},

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

Object.defineProperty(Phaser.Group.prototype, "x", {

    get: function () {
        return this._container.position.x;
    },

    set: function (value) {
        this._container.position.x = value;
    }

});

Object.defineProperty(Phaser.Group.prototype, "y", {

    get: function () {
        return this._container.position.y;
    },

    set: function (value) {
        this._container.position.y = value;
    }

});

Object.defineProperty(Phaser.Group.prototype, "angle", {

    get: function() {
        return Phaser.Math.radToDeg(this._container.rotation);
    },

    set: function(value) {
        this._container.rotation = Phaser.Math.degToRad(value);
    }

});

Object.defineProperty(Phaser.Group.prototype, "rotation", {

    get: function () {
        return this._container.rotation;
    },

    set: function (value) {
        this._container.rotation = value;
    }

});

Object.defineProperty(Phaser.Group.prototype, "visible", {

    get: function () {
        return this._container.visible;
    },

    set: function (value) {
        this._container.visible = value;
    }

});

/**
 * World
 *
 * "This world is but a canvas to our imagination." - Henry David Thoreau
 *
 * A game has only one world. The world is an abstract place in which all game objects live. It is not bound
 * by stage limits and can be any size. You look into the world via cameras. All game objects live within
 * the world at world-based coordinates. By default a world is created the same size as your Stage.
 *
 * @package    Phaser.World
 * @author     Richard Davey <rich@photonstorm.com>
 * @copyright  2013 Photon Storm Ltd.
 * @license    https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
 */
Phaser.World = function (game) {

    /**
     * Local reference to Game.
     */
	this.game = game;

    /**
     * Bound of this world that objects can not escape from.
     * @type {Rectangle}
     */
	this.bounds = new Phaser.Rectangle(0, 0, game.width, game.height);

    /**
     * Camera instance.
     * @type {Camera}
     */
	this.camera = null;

    /**
     * Reset each frame, keeps a count of the total number of objects updated.
     * @type {Number}
     */
	this.currentRenderOrderID = 0;

    /**
     * Object container stores every object created with `create*` methods.
     * @type {Group}
     */
    this.group = null;
	
};

Phaser.World.prototype = {

	boot: function () {

		this.camera = new Phaser.Camera(this.game, 0, 0, 0, this.game.width, this.game.height);

		this.game.camera = this.camera;

		this.group = new Phaser.Group(this.game, null, '__world', true);

	},

    /**
     * This is called automatically every frame, and is where main logic happens.
     */
	update: function () {

		this.camera.update();

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

	},

	/**
	* Updates the size of this world.
	*
	* @param width {number} New width of the world.
	* @param height {number} New height of the world.
	*/
	setSize: function (width, height) {

		if (width >= this.game.width)
        {
            this.bounds.width = width;
        }

        if (height >= this.game.height)
        {
            this.bounds.height = height;
        }

	},

    /**
    * Destroyer of worlds.
    */
    destroy: function () {

        this.camera.x = 0;
        this.camera.y = 0;

        this.game.input.reset(true);

        this.group.removeAll();

    }
	
};

//	Getters / Setters

Object.defineProperty(Phaser.World.prototype, "width", {

    get: function () {
        return this.bounds.width;
    },

    set: function (value) {
        this.bounds.width = value;
    }

});

Object.defineProperty(Phaser.World.prototype, "height", {

    get: function () {
        return this.bounds.height;
    },

    set: function (value) {
        this.bounds.height = value;
    }

});

Object.defineProperty(Phaser.World.prototype, "centerX", {

    get: function () {
        return this.bounds.halfWidth;
    }

});

Object.defineProperty(Phaser.World.prototype, "centerY", {

    get: function () {
        return this.bounds.halfHeight;
    }

});

Object.defineProperty(Phaser.World.prototype, "randomX", {

    get: function () {
        return Math.round(Math.random() * this.bounds.width);
    }

});

Object.defineProperty(Phaser.World.prototype, "randomY", {

    get: function () {
        return Math.round(Math.random() * this.bounds.height);
    }

});

/**
* Phaser.Game
*
* This is where the magic happens. The Game object is the heart of your game,
* providing quick access to common functions and handling the boot process.
*
* "Hell, there are no rules here - we're trying to accomplish something."
*                                                       Thomas A. Edison
*
* @package    Phaser.Game
* @author     Richard Davey <rich@photonstorm.com>
* @copyright  2013 Photon Storm Ltd.
* @license    https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
*/

/**
* Game constructor
*
* Instantiate a new <code>Phaser.Game</code> object.
*
* @constructor
* @param width {number} The width of your game in game pixels.
* @param height {number} The height of your game in game pixels.
* @param renderer {number} Which renderer to use (canvas or webgl)
* @param parent {string} ID of its parent DOM element.
*/
Phaser.Game = function (width, height, renderer, parent, state, transparent, antialias) {

	width = width || 800;
	height = height || 600;
	renderer = renderer || Phaser.AUTO;
	parent = parent || '';
	state = state || null;
	transparent = transparent || false;
	antialias = antialias || true;

	/**
	* Phaser Game ID (for when Pixi supports multiple instances)
	* @type {number}
	*/
	this.id = Phaser.GAMES.push(this) - 1;

	/**
	* The Games DOM parent.
	* @type {HTMLElement}
	*/
	this.parent = parent;

	//	Do some more intelligent size parsing here, so they can set "100%" for example, maybe pass the scale mode in here too?

	/**
	* The Game width (in pixels).
	* @type {number}
	*/
	this.width = width;

	/**
	* The Game height (in pixels).
	* @type {number}
	*/
	this.height = height;

	/**
	* Use a transparent canvas background or not.
	* @type {boolean}
	*/
	this.transparent = transparent;

	/**
	* Anti-alias graphics (in WebGL this helps with edges, in Canvas2D it retains pixel-art quality)
	* @type {boolean}
	*/
	this.antialias = antialias;

	/**
	* The Pixi Renderer
	* @type {number}
	*/
	this.renderer = null;

    /**
     * The StateManager.
     * @type {Phaser.StateManager}
     */
	this.state = new Phaser.StateManager(this, state);

	/**
	* Is game paused?
	* @type {bool}
	*/
	this._paused = false;

	/**
	* The Renderer this Phaser.Game will use. Either Phaser.RENDERER_AUTO, Phaser.RENDERER_CANVAS or Phaser.RENDERER_WEBGL
	* @type {number}
	*/
	this.renderType = renderer;

	/**
	* Whether load complete loading or not.
	* @type {bool}
	*/
	this._loadComplete = false;

	/**
	* Whether the game engine is booted, aka available.
	* @type {bool}
	*/
	this.isBooted = false;

	/**
	* Is game running or paused?
	* @type {bool}
	*/
	this.isRunning = false;

	/**
	* Automatically handles the core game loop via requestAnimationFrame or setTimeout
     * @type {Phaser.RequestAnimationFrame}
	*/
	this.raf = null;

    /**
     * Reference to the GameObject Factory.
     * @type {Phaser.GameObjectFactory}
     */
    this.add = null;

    /**
     * Reference to the assets cache.
     * @type {Phaser.Cache}
     */
    this.cache = null;

    /**
     * Reference to the input manager
     * @type {Phaser.Input}
     */
    this.input = null;

    /**
     * Reference to the assets loader.
     * @type {Phaser.Loader}
     */
    this.load = null;

    /**
     * Reference to the math helper.
     * @type {Phaser.GameMath}
     */
    this.math = null;

    /**
     * Reference to the network class.
     * @type {Phaser.Net}
     */
    this.net = null;

    /**
     * Reference to the sound manager.
     * @type {Phaser.SoundManager}
     */
    this.sound = null;

    /**
     * Reference to the stage.
     * @type {Phaser.Stage}
     */
    this.stage = null;

    /**
     * Reference to game clock.
     * @type {Phaser.TimeManager}
     */
    this.time = null;

    /**
     * Reference to the tween manager.
     * @type {Phaser.TweenManager}
     */
    this.tweens = null;

    /**
     * Reference to the world.
     * @type {Phaser.World}
     */
    this.world = null;

    /**
     * Reference to the physics manager.
     * @type {Phaser.Physics.PhysicsManager}
     */
    this.physics = null;

    /**
     * Instance of repeatable random data generator helper.
     * @type {Phaser.RandomDataGenerator}
     */
    this.rnd = null;

    /**
     * Contains device information and capabilities.
     * @type {Phaser.Device}
     */
    this.device = null;

	/**
	* A handy reference to world.camera
	* @type {Phaser.Camera}
	*/
	this.camera = null;

	/**
	* A handy reference to renderer.view
	* @type {HTMLCanvasElement}
	*/
	this.canvas = null;

	/**
	* A handy reference to renderer.context (only set for CANVAS games)
	* @type {Context}
	*/
	this.context = null;

	/**
	* A set of useful debug utilities
	* @type {Phaser.Utils.Debug}
	*/
	this.debug = null;

	/**
	* The Particle Manager
	* @type {Phaser.Particles}
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
	* @param parent {string} ID of parent Dom element.
	* @param width {number} Width of the game screen.
	* @param height {number} Height of the game screen.
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

			this.load.onLoadComplete.add(this.loadComplete, this);

			this.stage.boot();
			this.world.boot();
			this.input.boot();
			this.sound.boot();
			this.state.boot();

			if (this.renderType == Phaser.CANVAS)
			{
				console.log('%cPhaser ' + Phaser.VERSION + ' initialized. Rendering to Canvas', 'color: #ffff33; background: #000000');
			}
			else
			{
				console.log('%cPhaser ' + Phaser.VERSION + ' initialized. Rendering to WebGL', 'color: #ffff33; background: #000000');
			}

	        this.isRunning = true;
            this._loadComplete = false;

			this.raf = new Phaser.RequestAnimationFrame(this);
			this.raf.start();

		}

	},

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
    */
    loadComplete: function () {

        this._loadComplete = true;

        this.state.loadComplete();

    },

	update: function (time) {

		this.time.update(time);

		if (!this._paused)
		{
	        this.plugins.preUpdate();
	        this.physics.preUpdate();

	        this.input.update();
	        this.tweens.update();
	        this.sound.update();
			this.world.update();
			this.particles.update();
			this.state.update();
	        this.plugins.update();

			this.renderer.render(this.stage._stage);
			this.plugins.render();
			this.state.render();

			this.plugins.postRender();
		}

	},

	/**
    * Nuke the entire game from orbit
    */
    destroy: function () {

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
* Phaser.Input
*
* A game specific Input manager that looks after the mouse, keyboard and touch objects.
* This is updated by the core game loop.
*/
Phaser.Input = function (game) {

	this.game = game;

    this.hitCanvas = null;
    this.hitContext = null;
	
};

Phaser.Input.MOUSE_OVERRIDES_TOUCH = 0;
Phaser.Input.TOUCH_OVERRIDES_MOUSE = 1;
Phaser.Input.MOUSE_TOUCH_COMBINE = 2;

Phaser.Input.prototype = {

    game: null,

    /**
    * How often should the input pointers be checked for updates?
    * A value of 0 means every single frame (60fps), a value of 1 means every other frame (30fps) and so on.
    * @type {number}
    */
    pollRate: 0,
    _pollCounter: 0,

    /**
    * A vector object representing the previous position of the Pointer.
    * @property vector
    * @type {Vec2}
    **/
    _oldPosition: null,

    /**
    * X coordinate of the most recent Pointer event
    * @type {Number}
    * @private
    */
    _x: 0,

    /**
    * X coordinate of the most recent Pointer event
    * @type {Number}
    * @private
    */
    _y: 0,

    /**
    * You can disable all Input by setting Input.disabled: true. While set all new input related events will be ignored.
    * If you need to disable just one type of input, for example mouse, use Input.mouse.disabled: true instead
    * @type {bool}
    */
    disabled: false,

    /**
    * Controls the expected behaviour when using a mouse and touch together on a multi-input device
    */
    multiInputOverride: Phaser.Input.MOUSE_TOUCH_COMBINE,

    /**
    * A vector object representing the current position of the Pointer.
    * @property vector
    * @type {Vec2}
    **/
    position: null,

    /**
    * A vector object representing the speed of the Pointer. Only really useful in single Pointer games,
    * otherwise see the Pointer objects directly.
    * @property vector
    * @type {Vec2}
    **/
    speed: null,

    /**
    * A Circle object centered on the x/y screen coordinates of the Input.
    * Default size of 44px (Apples recommended "finger tip" size) but can be changed to anything
    * @property circle
    * @type {Circle}
    **/
    circle: null,

    /**
    * The scale by which all input coordinates are multiplied, calculated by the StageScaleMode.
    * In an un-scaled game the values will be x: 1 and y: 1.
    * @type {Vec2}
    */
    scale: null,

    /**
    * The maximum number of Pointers allowed to be active at any one time.
    * For lots of games it's useful to set this to 1
    * @type {Number}
    */
    maxPointers: 10,

    /**
    * The current number of active Pointers.
    * @type {Number}
    */
    currentPointers: 0,

    /**
    * The number of milliseconds that the Pointer has to be pressed down and then released to be considered a tap or click
    * @property tapRate
    * @type {Number}
    **/
    tapRate: 200,

    /**
    * The number of milliseconds between taps of the same Pointer for it to be considered a double tap / click
    * @property doubleTapRate
    * @type {Number}
    **/
    doubleTapRate: 300,

    /**
    * The number of milliseconds that the Pointer has to be pressed down for it to fire a onHold event
    * @property holdRate
    * @type {Number}
    **/
    holdRate: 2000,

    /**
    * The number of milliseconds below which the Pointer is considered justPressed
    * @property justPressedRate
    * @type {Number}
    **/
    justPressedRate: 200,

    /**
    * The number of milliseconds below which the Pointer is considered justReleased
    * @property justReleasedRate
    * @type {Number}
    **/
    justReleasedRate: 200,

    /**
    * Sets if the Pointer objects should record a history of x/y coordinates they have passed through.
    * The history is cleared each time the Pointer is pressed down.
    * The history is updated at the rate specified in Input.pollRate
    * @property recordPointerHistory
    * @type {bool}
    **/
    recordPointerHistory: false,

    /**
    * The rate in milliseconds at which the Pointer objects should update their tracking history
    * @property recordRate
    * @type {Number}
    */
    recordRate: 100,

    /**
    * The total number of entries that can be recorded into the Pointer objects tracking history.
    * If the Pointer is tracking one event every 100ms, then a trackLimit of 100 would store the last 10 seconds worth of history.
    * @property recordLimit
    * @type {Number}
    */
    recordLimit: 100,

    /**
    * A Pointer object
    * @property pointer1
    * @type {Pointer}
    **/
    pointer1: null,

    /**
    * A Pointer object
    * @property pointer2
    * @type {Pointer}
    **/
    pointer2: null,

    /**
    * A Pointer object
    * @property pointer3
    * @type {Pointer}
    **/
    pointer3: null,

    /**
    * A Pointer object
    * @property pointer4
    * @type {Pointer}
    **/
    pointer4: null,

    /**
    * A Pointer object
    * @property pointer5
    * @type {Pointer}
    **/
    pointer5: null,

    /**
    * A Pointer object
    * @property pointer6
    * @type {Pointer}
    **/
    pointer6: null,

    /**
    * A Pointer object
    * @property pointer7
    * @type {Pointer}
    **/
    pointer7: null,

    /**
    * A Pointer object
    * @property pointer8
    * @type {Pointer}
    **/
    pointer8: null,

    /**
    * A Pointer object
    * @property pointer9
    * @type {Pointer}
    **/
    pointer9: null,

    /**
    * A Pointer object
    * @property pointer10
    * @type {Pointer}
    **/
    pointer10: null,

    /**
    * The most recently active Pointer object.
    * When you've limited max pointers to 1 this will accurately be either the first finger touched or mouse.
    * @property activePointer
    * @type {Pointer}
    **/
    activePointer: null,

    mousePointer: null,
    mouse: null,
    keyboard: null,
    touch: null,
    mspointer: null,

    onDown: null,
    onUp: null,
    onTap: null,
    onHold: null,

    //  A linked list of interactive objects, the InputHandler components (belong to Sprites) register themselves with this
    interactiveItems: new Phaser.LinkedList(),

	/**
    * Starts the Input Manager running
    * @method start
    **/
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
    * Add a new Pointer object to the Input Manager. By default Input creates 2 pointer objects for you. If you need more
    * use this to create a new one, up to a maximum of 10.
    * @method addPointer
    * @return {Pointer} A reference to the new Pointer object
    **/
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
    * @method update
    **/
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
    * @method reset
    * @param hard {bool} A soft reset (hard = false) won't reset any signals that might be bound. A hard reset will.
    **/
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

    resetSpeed: function (x, y) {

        this._oldPosition.setTo(x, y);
        this.speed.setTo(0, 0);

    },

	/**
    * Find the first free Pointer object and start it, passing in the event data.
    * @method startPointer
    * @param {Any} event The event data from the Touch event
    * @return {Pointer} The Pointer object that was started or null if no Pointer object is available
    **/
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
    * Updates the matching Pointer object, passing in the event data.
    * @method updatePointer
    * @param {Any} event The event data from the Touch event
    * @return {Pointer} The Pointer object that was updated or null if no Pointer object is available
    **/
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
    * @method stopPointer
    * @param {Any} event The event data from the Touch event
    * @return {Pointer} The Pointer object that was stopped or null if no Pointer object is available
    **/
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
    * @method getPointer
    * @param {bool} state The state the Pointer should be in (false for inactive, true for active)
    * @return {Pointer} A Pointer object or null if no Pointer object matches the requested state.
    **/
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
    * Get the Pointer object whos identified property matches the given identifier value
    * @method getPointerFromIdentifier
    * @param {Number} identifier The Pointer.identifier value to search for
    * @return {Pointer} A Pointer object or null if no Pointer object matches the requested identifier.
    **/
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

    },

	/**
    * Get the distance between two Pointer objects
    * @method getDistance
    * @param {Pointer} pointer1
    * @param {Pointer} pointer2
    **/
    getDistance: function (pointer1, pointer2) {
        // return Phaser.Vec2Utils.distance(pointer1.position, pointer2.position);
    },

	/**
    * Get the angle between two Pointer objects
    * @method getAngle
    * @param {Pointer} pointer1
    * @param {Pointer} pointer2
    **/
    getAngle: function (pointer1, pointer2) {
        // return Phaser.Vec2Utils.angle(pointer1.position, pointer2.position);
    }

};

//	Getters / Setters

Object.defineProperty(Phaser.Input.prototype, "x", {

	/**
    * The X coordinate of the most recently active pointer.
    * This value takes game scaling into account automatically. See Pointer.screenX/clientX for source values.
    * @property x
    * @type {Number}
    **/
    get: function () {
        return this._x;
    },

    set: function (value) {
        this._x = Math.floor(value);
    }

});

Object.defineProperty(Phaser.Input.prototype, "y", {
    
	/**
    * The Y coordinate of the most recently active pointer.
    * This value takes game scaling into account automatically. See Pointer.screenY/clientY for source values.
    * @property y
    * @type {Number}
    **/
    get: function () {
        return this._y;
    },

    set: function (value) {
        this._y = Math.floor(value);
    }

});

Object.defineProperty(Phaser.Input.prototype, "pollLocked", {

    get: function () {
        return (this.pollRate > 0 && this._pollCounter < this.pollRate);
    }

});

Object.defineProperty(Phaser.Input.prototype, "totalInactivePointers", {

	/**
    * Get the total number of inactive Pointers
    * @method totalInactivePointers
    * @return {Number} The number of Pointers currently inactive
    **/
    get: function () {
        return 10 - this.currentPointers;
    }

});

Object.defineProperty(Phaser.Input.prototype, "totalActivePointers", {
    
	/**
    * Recalculates the total number of active Pointers
    * @method totalActivePointers
    * @return {Number} The number of Pointers currently active
    **/
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

Object.defineProperty(Phaser.Input.prototype, "worldX", {

    get: function () {
		return this.game.camera.view.x + this.x;
    }

});

Object.defineProperty(Phaser.Input.prototype, "worldY", {

    get: function () {
		return this.game.camera.view.y + this.y;
    }

});

Phaser.Keyboard = function (game) {

	this.game = game;
    this._keys = {};
    this._capture = {};
	
};

Phaser.Keyboard.prototype = {

	game: null,

    /**
    * You can disable all Input by setting disabled = true. While set all new input related events will be ignored.
    * @type {bool}
    */
	disabled: false,

	_onKeyDown: null,
	_onKeyUp: null,

    start: function () {

        var _this = this;

        this._onKeyDown = function (event) {
            return _this.onKeyDown(event);
        };

        this._onKeyUp = function (event) {
            return _this.onKeyUp(event);
        };

        document.body.addEventListener('keydown', this._onKeyDown, false);
        document.body.addEventListener('keyup', this._onKeyUp, false);

    },

    stop: function () {

        document.body.removeEventListener('keydown', this._onKeyDown);
        document.body.removeEventListener('keyup', this._onKeyUp);

    },

	/**
    * By default when a key is pressed Phaser will not stop the event from propagating up to the browser.
    * There are some keys this can be annoying for, like the arrow keys or space bar, which make the browser window scroll.
    * You can use addKeyCapture to consume the keyboard event for specific keys so it doesn't bubble up to the the browser.
    * Pass in either a single keycode or an array/hash of keycodes.
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
    * @param {Number} keycode
    */
    removeKeyCapture: function (keycode) {

        delete this._capture[keycode];

    },

    clearCaptures: function () {

        this._capture = {};

    },

	/**
    * @param {KeyboardEvent} event
    */    
    onKeyDown: function (event) {

        if (this.game.input.disabled || this.disabled)
        {
            return;
        }

        if (this._capture[event.keyCode])
        {
            event.preventDefault();
        }

        if (!this._keys[event.keyCode])
        {
            this._keys[event.keyCode] = {
                isDown: true,
                timeDown: this.game.time.now,
                timeUp: 0
            };
        }
        else
        {
            this._keys[event.keyCode].isDown = true;
            this._keys[event.keyCode].timeDown = this.game.time.now;
        }

    },

	/**
    * @param {KeyboardEvent} event
    */
    onKeyUp: function (event) {

        if (this.game.input.disabled || this.disabled)
        {
            return;
        }

        if (this._capture[event.keyCode])
        {
            event.preventDefault();
        }

        if (!this._keys[event.keyCode])
        {
            this._keys[event.keyCode] = {
                isDown: false,
                timeDown: 0,
                timeUp: this.game.time.now
            };
        }
        else
        {
            this._keys[event.keyCode].isDown = false;
            this._keys[event.keyCode].timeUp = this.game.time.now;
        }

    },

    reset: function () {

        for (var key in this._keys)
        {
            this._keys[key].isDown = false;
        }

    },

	/**
    * @param {Number} keycode
    * @param {Number} [duration]
    * @return {bool}
    */
    justPressed: function (keycode, duration) {

        if (typeof duration === "undefined") { duration = 250; }

        if (this._keys[keycode] && this._keys[keycode].isDown === true && (this.game.time.now - this._keys[keycode].timeDown < duration))
        {
            return true;
        }

        return false;

    },

	/**
    * @param {Number} keycode
    * @param {Number} [duration]
    * @return {bool}
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
    * @param {Number} keycode
    * @return {bool}
    */
    isDown: function (keycode) {

        if (this._keys[keycode])
        {
            return this._keys[keycode].isDown;
        }

		return false;

    }

};

//	Statics

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

Phaser.Mouse = function (game) {

	this.game = game;
	this.callbackContext = this.game;

	this.mouseDownCallback = null;
	this.mouseMoveCallback = null;
	this.mouseUpCallback = null;

};

Phaser.Mouse.LEFT_BUTTON = 0;
Phaser.Mouse.MIDDLE_BUTTON = 1;
Phaser.Mouse.RIGHT_BUTTON = 2;

Phaser.Mouse.prototype = {

	game: null,

    /**
    * You can disable all Input by setting disabled = true. While set all new input related events will be ignored.
    * @type {bool}
    */
	disabled: false,

    /**
    * If the mouse has been Pointer Locked successfully this will be set to true.
    * @type {bool}
    */
    locked: false,

	/**
    * Starts the event listeners running
    * @method start
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
    * @param {MouseEvent} event
    */
    onMouseDown: function (event) {

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
    * @param {MouseEvent} event
    */
    onMouseMove: function (event) {

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
    * @param {MouseEvent} event
    */
    onMouseUp: function (event) {

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

    releasePointerLock: function () {

        document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;

        document.exitPointerLock();

        document.removeEventListener('pointerlockchange', this._pointerLockChange);
        document.removeEventListener('mozpointerlockchange', this._pointerLockChange);
        document.removeEventListener('webkitpointerlockchange', this._pointerLockChange);

    },

	/**
    * Stop the event listeners
    * @method stop
    */
    stop: function () {

        this.game.stage.canvas.removeEventListener('mousedown', this._onMouseDown);
        this.game.stage.canvas.removeEventListener('mousemove', this._onMouseMove);
        this.game.stage.canvas.removeEventListener('mouseup', this._onMouseUp);

    }

};
/**
* Phaser.MSPointer
*
* The MSPointer class handles touch interactions with the game and the resulting Pointer objects.
* It will work only in Internet Explorer 10 and Windows Store or Windows Phone 8 apps using JavaScript.
* http://msdn.microsoft.com/en-us/library/ie/hh673557(v=vs.85).aspx
*/
Phaser.MSPointer = function (game) {

	this.game = game;
	this.callbackContext = this.game;

	this.mouseDownCallback = null;
	this.mouseMoveCallback = null;
	this.mouseUpCallback = null;

};

Phaser.MSPointer.prototype = {

	game: null,

    /**
    * You can disable all Input by setting disabled = true. While set all new input related events will be ignored.
    * @type {bool}
    */
	disabled: false,

    _onMSPointerDown: null,
    _onMSPointerMove: null,
    _onMSPointerUp: null,

	/**
    * Starts the event listeners running
    * @method start
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
    * @method onPointerDown
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
    * @method onPointerMove
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
    * @method onPointerUp
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
    * Stop the event listeners
    * @method stop
    */
    stop: function () {

        this.game.stage.canvas.removeEventListener('MSPointerDown', this._onMSPointerDown);
        this.game.stage.canvas.removeEventListener('MSPointerMove', this._onMSPointerMove);
        this.game.stage.canvas.removeEventListener('MSPointerUp', this._onMSPointerUp);

    }

};
/**
* Phaser - Pointer
*
* A Pointer object is used by the Mouse, Touch and MSPoint managers and represents a single finger on the touch screen.
*/
Phaser.Pointer = function (game, id) {

    /**
    * Local private variable to store the status of dispatching a hold event
    * @property _holdSent
    * @type {bool}
    * @private
    */
    this._holdSent = false;

    /**
    * Local private variable storing the short-term history of pointer movements
    * @property _history
    * @type {Array}
    * @private
    */
    this._history = [];

    /**
    * Local private variable storing the time at which the next history drop should occur
    * @property _lastDrop
    * @type {Number}
    * @private
    */
    this._nextDrop = 0;

    //  Monitor events outside of a state reset loop
    this._stateReset = false;

    /**
    * A Vector object containing the initial position when the Pointer was engaged with the screen.
    * @property positionDown
    * @type {Vec2}
    **/
    this.positionDown = null;

    /**
    * A Vector object containing the current position of the Pointer on the screen.
    * @property position
    * @type {Vec2}
    **/
    this.position = null;

    /**
    * A Circle object centered on the x/y screen coordinates of the Pointer.
    * Default size of 44px (Apple's recommended "finger tip" size)
    * @property circle
    * @type {Circle}
    **/
    this.circle = null;

    /**
    *
    * @property withinGame
    * @type {bool}
    */
    this.withinGame = false;

    /**
    * The horizontal coordinate of point relative to the viewport in pixels, excluding any scroll offset
    * @property clientX
    * @type {Number}
    */
    this.clientX = -1;

    /**
    * The vertical coordinate of point relative to the viewport in pixels, excluding any scroll offset
    * @property clientY
    * @type {Number}
    */
    this.clientY = -1;

    /**
    * The horizontal coordinate of point relative to the viewport in pixels, including any scroll offset
    * @property pageX
    * @type {Number}
    */
    this.pageX = -1;

    /**
    * The vertical coordinate of point relative to the viewport in pixels, including any scroll offset
    * @property pageY
    * @type {Number}
    */
    this.pageY = -1;

    /**
    * The horizontal coordinate of point relative to the screen in pixels
    * @property screenX
    * @type {Number}
    */
    this.screenX = -1;

    /**
    * The vertical coordinate of point relative to the screen in pixels
    * @property screenY
    * @type {Number}
    */
    this.screenY = -1;

    /**
    * The horizontal coordinate of point relative to the game element. This value is automatically scaled based on game size.
    * @property x
    * @type {Number}
    */
    this.x = -1;

    /**
    * The vertical coordinate of point relative to the game element. This value is automatically scaled based on game size.
    * @property y
    * @type {Number}
    */
    this.y = -1;

    /**
    * If the Pointer is a mouse this is true, otherwise false
    * @property isMouse
    * @type {bool}
    **/
    this.isMouse = false;

    /**
    * If the Pointer is touching the touchscreen, or the mouse button is held down, isDown is set to true
    * @property isDown
    * @type {bool}
    **/
    this.isDown = false;

    /**
    * If the Pointer is not touching the touchscreen, or the mouse button is up, isUp is set to true
    * @property isUp
    * @type {bool}
    **/
    this.isUp = true;

    /**
    * A timestamp representing when the Pointer first touched the touchscreen.
    * @property timeDown
    * @type {Number}
    **/
    this.timeDown = 0;

    /**
    * A timestamp representing when the Pointer left the touchscreen.
    * @property timeUp
    * @type {Number}
    **/
    this.timeUp = 0;

    /**
    * A timestamp representing when the Pointer was last tapped or clicked
    * @property previousTapTime
    * @type {Number}
    **/
    this.previousTapTime = 0;

    /**
    * The total number of times this Pointer has been touched to the touchscreen
    * @property totalTouches
    * @type {Number}
    **/
    this.totalTouches = 0;

    /**
    * The number of miliseconds since the last click
    * @property msSinceLastClick
    * @type {Number}
    **/
    this.msSinceLastClick = Number.MAX_VALUE;

    /**
    * The Game Object this Pointer is currently over / touching / dragging.
    * @property targetObject
    * @type {Any}
    **/
    this.targetObject = null;

	this.game = game;
    this.id = id;

    this.active = false;

    this.position = new Phaser.Point();
    this.positionDown = new Phaser.Point();

    this.circle = new Phaser.Circle(0, 0, 44);

    if (id == 0)
    {
        this.isMouse = true;
    }

};

Phaser.Pointer.prototype = {

	/**
    * Called when the Pointer is pressed onto the touchscreen
    * @method start
    * @param {Any} event
    */
    start: function (event) {

        this.identifier = event.identifier;
        this.target = event.target;

        if (event.button)
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
            this.game.input.x = this.x * this.game.input.scale.x;
            this.game.input.y = this.y * this.game.input.scale.y;
            this.game.input.position.setTo(this.x, this.y);
            this.game.input.onDown.dispatch(this);
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
    * @method move
    * @param {Any} event
    */
    move: function (event) {

        if (this.game.input.pollLocked)
        {
            return;
        }

        if (event.button)
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
                //  If the object has a higher InputManager.PriorityID OR if the priority ID is the same as the current highest AND it has a higher renderOrderID, then set it to the top
                if (currentNode.priorityID > this._highestInputPriorityID || (currentNode.priorityID == this._highestInputPriorityID && currentNode.sprite.renderOrderID > this._highestRenderOrderID))
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
            // console.log("HRO null");

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
    * Called when the Pointer leaves the target area
    * @method leave
    * @param {Any} event
    */
    leave: function (event) {

        this.withinGame = false;
        this.move(event);

    },

	/**
    * Called when the Pointer leaves the touchscreen
    * @method stop
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
            this.game.input.onUp.dispatch(this);

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
    * The Pointer is considered justPressed if the time it was pressed onto the touchscreen or clicked is less than justPressedRate
    * @method justPressed
    * @param {Number} [duration].
    * @return {bool}
    */
    justPressed: function (duration) {

        duration = duration || this.game.input.justPressedRate;

        return (this.isDown === true && (this.timeDown + duration) > this.game.time.now);

    },

	/**
    * The Pointer is considered justReleased if the time it left the touchscreen is less than justReleasedRate
    * @method justReleased
    * @param {Number} [duration].
    * @return {bool}
    */
    justReleased: function (duration) {

        duration = duration || this.game.input.justReleasedRate;

        return (this.isUp === true && (this.timeUp + duration) > this.game.time.now);

    },

	/**
    * Resets the Pointer properties. Called by InputManager.reset when you perform a State change.
    * @method reset
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
    * @method toString
    * @return {String} a string representation of the instance.
    **/
    toString: function () {
        return "[{Pointer (id=" + this.id + " identifer=" + this.identifier + " active=" + this.active + " duration=" + this.duration + " withinGame=" + this.withinGame + " x=" + this.x + " y=" + this.y + " clientX=" + this.clientX + " clientY=" + this.clientY + " screenX=" + this.screenX + " screenY=" + this.screenY + " pageX=" + this.pageX + " pageY=" + this.pageY + ")}]";
    }

};

Object.defineProperty(Phaser.Pointer.prototype, "duration", {

	/**
    * How long the Pointer has been depressed on the touchscreen. If not currently down it returns -1.
    * @property duration
    * @type {Number}
    **/
    get: function () {

        if (this.isUp)
        {
            return -1;
        }

        return this.game.time.now - this.timeDown;

    }

});

Object.defineProperty(Phaser.Pointer.prototype, "worldX", {

	/**
    * Gets the X value of this Pointer in world coordinates based on the given camera.
    * @param {Camera} [camera]
    */
    get: function () {

		return this.game.world.camera.x + this.x;

    }

});

Object.defineProperty(Phaser.Pointer.prototype, "worldY", {

	/**
    * Gets the Y value of this Pointer in world coordinates based on the given camera.
    * @param {Camera} [camera]
    */
    get: function () {

		return this.game.world.camera.y + this.y;

    }

});

/**
* Phaser - Touch
*
* The Touch class handles touch interactions with the game and the resulting Pointer objects.
* http://www.w3.org/TR/touch-events/
* https://developer.mozilla.org/en-US/docs/DOM/TouchList
* http://www.html5rocks.com/en/mobile/touchandmouse/
* Note: Android 2.x only supports 1 touch event at once, no multi-touch
*/
Phaser.Touch = function (game) {

	this.game = game;
    this.callbackContext = this.game;

    this.touchStartCallback = null;
    this.touchMoveCallback = null;
    this.touchEndCallback = null;
    this.touchEnterCallback = null;
    this.touchLeaveCallback = null;
    this.touchCancelCallback = null;

    this.preventDefault = true;

};

Phaser.Touch.prototype = {

	game: null,

    /**
    * You can disable all Input by setting disabled = true. While set all new input related events will be ignored.
    * @type {bool}
    */
	disabled: false,

	_onTouchStart: null,
	_onTouchMove: null,
	_onTouchEnd: null,
	_onTouchEnter: null,
	_onTouchLeave: null,
	_onTouchCancel: null,
	_onTouchMove: null,

	/**
    * Starts the event listeners running
    * @method start
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
    * Consumes all touchmove events on the document (only enable this if you know you need it!)
    * @method consumeTouchMove
    * @param {Any} event
    **/
    consumeDocumentTouches: function () {

        this._documentTouchMove = function (event) {
            event.preventDefault();
        };

        document.addEventListener('touchmove', this._documentTouchMove, false);

    },

	/**
    *
    * @method onTouchStart
    * @param {Any} event
    **/
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
    * Touch cancel - touches that were disrupted (perhaps by moving into a plugin or browser chrome)
    * Occurs for example on iOS when you put down 4 fingers and the app selector UI appears
    * @method onTouchCancel
    * @param {Any} event
    **/
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
    * For touch enter and leave its a list of the touch points that have entered or left the target
    * Doesn't appear to be supported by most browsers on a canvas element yet
    * @method onTouchEnter
    * @param {Any} event
    **/
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
    * For touch enter and leave its a list of the touch points that have entered or left the target
    * Doesn't appear to be supported by most browsers on a canvas element yet
    * @method onTouchLeave
    * @param {Any} event
    **/    
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
    *
    * @method onTouchMove
    * @param {Any} event
    **/
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
    *
    * @method onTouchEnd
    * @param {Any} event
    **/
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
    * Stop the event listeners
    * @method stop
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
Phaser.InputHandler = function (sprite) {

    this.game = sprite.game;
	this.sprite = sprite;

    this.enabled = false;

    //	Linked list references
    this.parent = null;
    this.next = null;
    this.prev = null;
	this.last = this;
	this.first = this;

    /**
    * The PriorityID controls which Sprite receives an Input event first if they should overlap.
    */
    this.priorityID = 0;
    this.useHandCursor = false;
	
    this.isDragged = false;
    this.allowHorizontalDrag = true;
    this.allowVerticalDrag = true;
    this.bringToTop = false;

    this.snapOffset = null;
    this.snapOnDrag = false;
    this.snapOnRelease = false;
    this.snapX = 0;
    this.snapY = 0;

    /**
    * Should we use pixel perfect hit detection? Warning: expensive. Only enable if you really need it!
    * @default false
    */
    this.pixelPerfect = false;

    /**
    * The alpha tolerance threshold. If the alpha value of the pixel matches or is above this value, it's considered a hit.
    * @default 255
    */
    this.pixelPerfectAlpha = 255;

    /**
    * Is this sprite allowed to be dragged by the mouse? true = yes, false = no
    * @default false
    */
    this.draggable = false;

    /**
    * A region of the game world within which the sprite is restricted during drag
    * @default null
    */
    this.boundsRect = null;

    /**
    * An Sprite the bounds of which this sprite is restricted during drag
    * @default null
    */
    this.boundsSprite = null;

    /**
    * If this object is set to consume the pointer event then it will stop all propogation from this object on.
    * For example if you had a stack of 6 sprites with the same priority IDs and one consumed the event, none of the others would receive it.
    * @type {bool}
    */
    this.consumePointerEvent = false;

    this._tempPoint = new Phaser.Point;

};

Phaser.InputHandler.prototype = {

	start: function (priority, useHandCursor) {

		priority = priority || 0;
		useHandCursor = useHandCursor || false;

        //  Turning on
        if (this.enabled == false)
        {
            //  Register, etc
			this.game.input.interactiveItems.add(this);
            this.useHandCursor = useHandCursor;
            this.priorityID = priority;
            this._pointerData = [];

            for (var i = 0; i < 10; i++)
            {
                this._pointerData.push({
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
                });
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
    */
    destroy: function () {

        if (this.enabled)
        {
        	this.stop();
        	//	Null everything
        	this.sprite = null;
        	//	etc
        }
    },

	/**
    * The x coordinate of the Input pointer, relative to the top-left of the parent Sprite.
    * This value is only set when the pointer is over this Sprite.
    * @type {number}
    */    
    pointerX: function (pointer) {

    	pointer = pointer || 0;

        return this._pointerData[pointer].x;

    },

	/**
    * The y coordinate of the Input pointer, relative to the top-left of the parent Sprite
    * This value is only set when the pointer is over this Sprite.
    * @type {number}
    */
    pointerY: function (pointer) {

    	pointer = pointer || 0;

        return this._pointerData[pointer].y;

    },

	/**
    * If the Pointer is touching the touchscreen, or the mouse button is held down, isDown is set to true
    * @property isDown
    * @type {bool}
    **/
    pointerDown: function (pointer) {

    	pointer = pointer || 0;

        return this._pointerData[pointer].isDown;

    },

	/**
    * If the Pointer is not touching the touchscreen, or the mouse button is up, isUp is set to true
    * @property isUp
    * @type {bool}
    **/
    pointerUp: function (pointer) {

    	pointer = pointer || 0;

        return this._pointerData[pointer].isUp;

    },

	/**
    * A timestamp representing when the Pointer first touched the touchscreen.
    * @property timeDown
    * @type {Number}
    **/
    pointerTimeDown: function (pointer) {

    	pointer = pointer || 0;

        return this._pointerData[pointer].timeDown;

    },

	/**
    * A timestamp representing when the Pointer left the touchscreen.
    * @property timeUp
    * @type {Number}
    **/
    pointerTimeUp: function (pointer) {

    	pointer = pointer || 0;

        return this._pointerData[pointer].timeUp;

    },

	/**
    * Is the Pointer over this Sprite
    * @property isOver
    * @type {bool}
    **/
    pointerOver: function (pointer) {

    	pointer = pointer || 0;

        return this._pointerData[pointer].isOver;

    },

	/**
    * Is the Pointer outside of this Sprite
    * @property isOut
    * @type {bool}
    **/
    pointerOut: function (pointer) {

    	pointer = pointer || 0;

        return this._pointerData[pointer].isOut;

    },

	/**
    * A timestamp representing when the Pointer first touched the touchscreen.
    * @property timeDown
    * @type {Number}
    **/
    pointerTimeOver: function (pointer) {

    	pointer = pointer || 0;

        return this._pointerData[pointer].timeOver;

    },

	/**
    * A timestamp representing when the Pointer left the touchscreen.
    * @property timeUp
    * @type {Number}
    **/
    pointerTimeOut: function (pointer) {

    	pointer = pointer || 0;

        return this._pointerData[pointer].timeOut;

    },

	/**
    * Is this sprite being dragged by the mouse or not?
    * @default false
    */
    pointerDragged: function (pointer) {

    	pointer = pointer || 0;

        return this._pointerData[pointer].isDragged;

    },

	/**
    * Checks if the given pointer is over this Sprite.
    */
    checkPointerOver: function (pointer) {

        if (this.enabled && this.sprite.visible)
        {
            this.sprite.getLocalUnmodifiedPosition(this._tempPoint, pointer.x, pointer.y);

            //  Check against bounds first (move these to private vars)
            var x1 = -(this.sprite.texture.frame.width) * this.sprite.anchor.x;
            var y1;
            
            if (this._tempPoint.x > x1 && this._tempPoint.x < x1 + this.sprite.texture.frame.width)
            {
                y1 = -(this.sprite.texture.frame.height) * this.sprite.anchor.y;
            
                if (this._tempPoint.y > y1 && this._tempPoint.y < y1 + this.sprite.texture.frame.height)
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
        }
        else
        {
            return false;
        }

    },

    checkPixel: function (x, y) {

        x += (this.sprite.texture.frame.width * this.sprite.anchor.x);
        y += (this.sprite.texture.frame.height * this.sprite.anchor.y);

        //  Grab a pixel from our image into the hitCanvas and then test it

        if (this.sprite.texture.baseTexture.source)
        {
            this.game.input.hitContext.clearRect(0, 0, 1, 1);
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
    * Update
    */
    update: function (pointer) {

        if (this.enabled == false || this.sprite.visible == false)
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

    _pointerOutHandler: function (pointer) {

        this._pointerData[pointer.id].isOver = false;
        this._pointerData[pointer.id].isOut = true;
        this._pointerData[pointer.id].timeOut = this.game.time.now;

        if (this.useHandCursor && this._pointerData[pointer.id].isDragged == false)
        {
            this.game.stage.canvas.style.cursor = "default";
        }

        this.sprite.events.onInputOut.dispatch(this.sprite, pointer);

    },

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
            this.sprite.x = Math.floor(this.sprite.x / this.snapX) * this.snapX;
            this.sprite.y = Math.floor(this.sprite.y / this.snapY) * this.snapY;
        }

        return true;

    },

	/**
    * Returns true if the pointer has entered the Sprite within the specified delay time (defaults to 500ms, half a second)
    * @param delay The time below which the pointer is considered as just over.
    * @returns {bool}
    */
    justOver: function (pointer, delay) {

    	pointer = pointer || 0;
    	delay = delay || 500;

        return (this._pointerData[pointer].isOver && this.overDuration(pointer) < delay);

    },

	/**
    * Returns true if the pointer has left the Sprite within the specified delay time (defaults to 500ms, half a second)
    * @param delay The time below which the pointer is considered as just out.
    * @returns {bool}
    */
    justOut: function (pointer, delay) {

    	pointer = pointer || 0;
    	delay = delay || 500;

        return (this._pointerData[pointer].isOut && (this.game.time.now - this._pointerData[pointer].timeOut < delay));

    },

	/**
    * Returns true if the pointer has entered the Sprite within the specified delay time (defaults to 500ms, half a second)
    * @param delay The time below which the pointer is considered as just over.
    * @returns {bool}
    */
    justPressed: function (pointer, delay) {

    	pointer = pointer || 0;
    	delay = delay || 500;

        return (this._pointerData[pointer].isDown && this.downDuration(pointer) < delay);

    },

	/**
    * Returns true if the pointer has left the Sprite within the specified delay time (defaults to 500ms, half a second)
    * @param delay The time below which the pointer is considered as just out.
    * @returns {bool}
    */
    justReleased: function (pointer, delay) {

    	pointer = pointer || 0;
    	delay = delay || 500;

        return (this._pointerData[pointer].isUp && (this.game.time.now - this._pointerData[pointer].timeUp < delay));

    },

	/**
    * If the pointer is currently over this Sprite this returns how long it has been there for in milliseconds.
    * @returns {number} The number of milliseconds the pointer has been over the Sprite, or -1 if not over.
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
    * @returns {number} The number of milliseconds the pointer has been pressed down on the Sprite, or -1 if not over.
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
    *
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
    */
    stopDrag: function (pointer) {

        this.isDragged = false;
        this._draggedPointerID = -1;
        this._pointerData[pointer.id].isDragged = false;
        
        if (this.snapOnRelease)
        {
            this.sprite.x = Math.floor(this.sprite.x / this.snapX) * this.snapX;
            this.sprite.y = Math.floor(this.sprite.y / this.snapY) * this.snapY;
        }

        this.sprite.events.onDragStop.dispatch(this.sprite, pointer);
        this.sprite.events.onInputUp.dispatch(this.sprite, pointer);

    },

	/**
    * Restricts this sprite to drag movement only on the given axis. Note: If both are set to false the sprite will never move!
    *
    * @param	allowHorizontal		To enable the sprite to be dragged horizontally set to true, otherwise false
    * @param	allowVertical		To enable the sprite to be dragged vertically set to true, otherwise false
    */
    setDragLock: function (allowHorizontal, allowVertical) {

    	allowHorizontal = allowHorizontal || true;
    	allowVertical = allowVertical || true;

        this.allowHorizontalDrag = allowHorizontal;
        this.allowVerticalDrag = allowVertical;

    },

	/**
    * Make this Sprite snap to the given grid either during drag or when it's released.
    * For example 16x16 as the snapX and snapY would make the sprite snap to every 16 pixels.
    *
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
    */
    disableSnap: function () {

        this.snapOnDrag = false;
        this.snapOnRelease = false;

    },

	/**
    * Bounds Rect check for the sprite drag
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
    * Parent Sprite Bounds check for the sprite drag
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
* @license      https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
* @module       Phaser.Canvas
*/

Phaser.Canvas = {

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
    * @method getAspectRatio
    * @param {HTMLCanvasElement} canvas The canvas to get the aspect ratio from.
    * @return {Number} Returns true on success
    */        
    getAspectRatio: function (canvas) {
        return canvas.width / canvas.height;
    },

    /**
    * Sets the background color behind the canvas. This changes the canvas style property.
    *
    * @method setBackgroundColor
    * @param {HTMLCanvasElement} canvas The canvas to set the background color on.
    * @param {String} color The color to set. Can be in the format 'rgb(r,g,b)', or '#RRGGBB' or any valid CSS color.
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
    * @method setTouchAction
    * @param {HTMLCanvasElement} canvas The canvas to set the touch action on.
    * @param {String} value The touch action to set. Defaults to 'none'.
    * @return {HTMLCanvasElement} Returns the source canvas.
    */
    setTouchAction: function (canvas, value) {

        value = value || 'none';

        canvas.style.msTouchAction = value;
        canvas.style['ms-touch-action'] = value;
        canvas.style['touch-action'] = value;

        return canvas;

    },

    /**
    * Adds the given canvas element to the DOM. The canvas will be added as a child of the given parent.
    * If no parent is given it will be added as a child of the document.body.
    *
    * @method addToDOM
    * @param {HTMLCanvasElement} canvas The canvas to set the touch action on.
    * @param {String} parent The DOM element to add the canvas to. Defaults to ''.
    * @param {bool} overflowHidden If set to true it will add the overflow='hidden' style to the parent DOM element.
    * @return {HTMLCanvasElement} Returns the source canvas.
    */
    addToDOM: function (canvas, parent, overflowHidden) {

        parent = parent || '';
        overflowHidden = overflowHidden || true;

        if (parent !== '')
        {
            if (document.getElementById(parent))
            {
                document.getElementById(parent).appendChild(canvas);
            }
            else
            {
                document.body.appendChild(canvas);
            }

            if (overflowHidden)
            {
                document.getElementById(parent).style.overflow = 'hidden';
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
    * @method setTransform
    * @param {CanvasRenderingContext2D} context The context to set the transform on.
    * @param {Number} translateX The value to translate horizontally by.
    * @param {Number} translateY The value to translate vertically by.
    * @param {Number} scaleX The value to scale horizontally by.
    * @param {Number} scaleY The value to scale vertically by.
    * @param {Number} skewX The value to skew horizontaly by.
    * @param {Number} skewY The value to skew vertically by.
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
    * @method setSmoothingEnabled
    * @param {CanvasRenderingContext2D} context The context to enable or disable the image smoothing on.
    * @param {bool} value If set to true it will enable image smoothing, false will disable it.
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
    * @method setImageRenderingCrisp
    * @param {HTMLCanvasElement} canvas The canvas to set image-rendering crisp on.
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
    * @method setImageRenderingBicubic
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
* The Events component is a collection of events fired by the parent game object and its components.
* @param parent The game object using this Input component
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
Phaser.GameObjectFactory = function (game) {

	this.game = game;
	this.world = this.game.world;

};

Phaser.GameObjectFactory.prototype = {

	game: null,
    world: null,

    existing: function (object) {

        return this.world.group.add(object);

    },

	/**
    * Create a new Sprite with specific position and sprite sheet key.
    *
    * @param x {number} X position of the new sprite.
    * @param y {number} Y position of the new sprite.
    * @param [key] {string|RenderTexture} The image key as defined in the Game.Cache to use as the texture for this sprite OR a RenderTexture
    * @param [frame] {string|number} If the sprite uses an image from a texture atlas or sprite sheet you can pass the frame here. Either a number for a frame ID or a string for a frame name.
    * @returns {Sprite} The newly created sprite object.
    */
    sprite: function (x, y, key, frame) {

        return this.world.group.add(new Phaser.Sprite(this.game, x, y, key, frame));

    },

    /**
    * Create a new Sprite with specific position and sprite sheet key that will automatically be added as a child of the given parent.
    *
    * @param x {number} X position of the new sprite.
    * @param y {number} Y position of the new sprite.
    * @param [key] {string|RenderTexture} The image key as defined in the Game.Cache to use as the texture for this sprite OR a RenderTexture
    * @param [frame] {string|number} If the sprite uses an image from a texture atlas or sprite sheet you can pass the frame here. Either a number for a frame ID or a string for a frame name.
    * @returns {Sprite} The newly created sprite object.
    */
    child: function (parent, x, y, key, frame) {

        var child = this.world.group.add(new Phaser.Sprite(this.game, x, y, key, frame));
        parent.addChild(child);
        return child;

    },

    /**
    * Create a tween object for a specific object. The object can be any JavaScript object or Phaser object such as Sprite.
    *
    * @param obj {object} Object the tween will be run on.
    * @return {Phaser.Tween} The newly created tween object.
    */
    tween: function (obj) {

        return this.game.tweens.create(obj);

    },

    group: function (parent, name) {

        return new Phaser.Group(this.game, parent, name);

    },

    audio: function (key, volume, loop) {

        return this.game.sound.add(key, volume, loop);
        
    },

    tileSprite: function (x, y, width, height, key, frame) {

        return this.world.group.add(new Phaser.TileSprite(this.game, x, y, width, height, key, frame));

    },

    text: function (x, y, text, style) {

        return this.world.group.add(new Phaser.Text(this.game, x, y, text, style));

    },

    button: function (x, y, key, callback, callbackContext, overFrame, outFrame, downFrame) {

        return this.world.group.add(new Phaser.Button(this.game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame));

    },

    graphics: function (x, y) {

        return this.world.group.add(new Phaser.Graphics(this.game, x, y));

    },

    emitter: function (x, y, maxParticles) {

        return this.game.particles.add(new Phaser.Particles.Arcade.Emitter(this.game, x, y, maxParticles));

    },

    bitmapText: function (x, y, text, style) {

        return this.world.group.add(new Phaser.BitmapText(this.game, x, y, text, style));

    },

    tilemap: function (x, y, key, resizeWorld, tileWidth, tileHeight) {

        return this.world.group.add(new Phaser.Tilemap(this.game, key, x, y, resizeWorld, tileWidth, tileHeight));

    },

    renderTexture: function (key, width, height) {

        var texture = new Phaser.RenderTexture(this.game, key, width, height);

        this.game.cache.addRenderTexture(key, texture);

        return texture;

    },

};
Phaser.Sprite = function (game, x, y, key, frame) {

    x = x || 0;
    y = y || 0;
    key = key || null;
    frame = frame || null;

	this.game = game;

    //  If exists = false then the Sprite isn't updated by the core game loop or physics subsystem at all
    this.exists = true;

    //  This is a handy little var your game can use to determine if a sprite is alive or not, it doesn't effect rendering
    this.alive = true;

    this.group = null;

    this.name = '';

    this.type = Phaser.SPRITE;

    this.renderOrderID = -1;

    //  If you would like the Sprite to have a lifespan once 'born' you can set this to a positive value. Handy for particles, bullets, etc.
    //  The lifespan is decremented by game.time.elapsed each update, once it reaches zero the kill() function is called.
    this.lifespan = 0;

    /**
     * The Signals you can subscribe to that are dispatched when certain things happen on this Sprite or its components
     * @type Events
     */
    this.events = new Phaser.Events(this);

    /**
     * This manages animations of the sprite. You can modify animations through it. (see AnimationManager)
     * @type AnimationManager
     */
    this.animations = new Phaser.AnimationManager(this);

    /**
     * The Input Handler Component
     * @type InputHandler
     */
    this.input = new Phaser.InputHandler(this);

    this.key = key;

    if (key instanceof Phaser.RenderTexture)
    {
        PIXI.Sprite.call(this, key);

        this.currentFrame = this.game.cache.getTextureFrame(key.name);
    }
    else
    {
        if (key == null || this.game.cache.checkImageKey(key) == false)
        {
            key = '__default';
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
     * The anchor sets the origin point of the texture.
     * The default is 0,0 this means the textures origin is the top left 
     * Setting than anchor to 0.5,0.5 means the textures origin is centered
     * Setting the anchor to 1,1 would mean the textures origin points will be the bottom right
     *
     * @property anchor
     * @type Point
     */
    this.anchor = new Phaser.Point();

    this._cropUUID = null;
    this._cropRect = null;

    this.x = x;
    this.y = y;

	this.position.x = x;
	this.position.y = y;

    /**
     * Should this Sprite be automatically culled if out of range of the camera?
     * A culled sprite has its visible property set to 'false'.
     * Note that this check doesn't look at this Sprites children, which may still be in camera range.
     * So you should set autoCull to false if the Sprite will have children likely to still be in camera range.
     *
     * @property autoCull
     * @type Boolean
     */
    this.autoCull = false;

    //  Replaces the PIXI.Point with a slightly more flexible one
    this.scale = new Phaser.Point(1, 1);

    //  Influence of camera movement upon the position
    this.scrollFactor = new Phaser.Point(1, 1);

    //  A mini cache for storing all of the calculated values
    this._cache = { 

        dirty: false,

        //  Transform cache
        a00: 1, a01: 0, a02: x, a10: 0, a11: 1, a12: y, id: 1, 

        //  Input specific transform cache
        i01: 0, i10: 0, idi: 1,

        //  Bounds check
        left: null, right: null, top: null, bottom: null, 

        //  The previous calculated position inc. camera x/y and scrollFactor
        x: -1, y: -1,

        //  The actual scale values based on the worldTransform
        scaleX: 1, scaleY: 1,

        //  The width/height of the image, based on the un-modified frame size multiplied by the final calculated scale size
        width: this.currentFrame.sourceSizeW, height: this.currentFrame.sourceSizeH,

        //  The actual width/height of the image if from a trimmed atlas, multiplied by the final calculated scale size
        halfWidth: Math.floor(this.currentFrame.sourceSizeW / 2), halfHeight: Math.floor(this.currentFrame.sourceSizeH / 2),

        //  The current frame details
        frameID: this.currentFrame.uuid, frameWidth: this.currentFrame.width, frameHeight: this.currentFrame.height,

        boundsX: 0, boundsY: 0,

        //  If this sprite visible to the camera (regardless of being set to visible or not)
        cameraVisible: true

    };

    //  Corner point defaults
    this.offset = new Phaser.Point;
    this.center = new Phaser.Point(x + Math.floor(this._cache.width / 2), y + Math.floor(this._cache.height / 2));
    this.topLeft = new Phaser.Point(x, y);
    this.topRight = new Phaser.Point(x + this._cache.width, y);
    this.bottomRight = new Phaser.Point(x + this._cache.width, y + this._cache.height);
    this.bottomLeft = new Phaser.Point(x, y + this._cache.height);
    this.bounds = new Phaser.Rectangle(x, y, this._cache.width, this._cache.height);

    //  Set-up the physics body
    this.body = new Phaser.Physics.Arcade.Body(this);

    this.velocity = this.body.velocity;
    this.acceleration = this.body.acceleration;

    //  World bounds check
    this.inWorld = Phaser.Rectangle.intersects(this.bounds, this.game.world.bounds);
    this.inWorldThreshold = 0;
    this._outOfBoundsFired = false;

};

//  Needed to keep the PIXI.Sprite constructor in the prototype chain (as the core pixi renderer uses an instanceof check sadly)
Phaser.Sprite.prototype = Object.create(PIXI.Sprite.prototype);
Phaser.Sprite.prototype.constructor = Phaser.Sprite;

/**
 * Automatically called by World.update. You can create your own update in Objects that extend Phaser.Sprite.
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

    if (this.animations.update())
    {
        this._cache.dirty = true;
    }

    this._cache.x = this.x - (this.game.world.camera.x * this.scrollFactor.x);
    this._cache.y = this.y - (this.game.world.camera.y * this.scrollFactor.y);

    //  If this sprite or the camera have moved then let's update everything
    if (this.position.x != this._cache.x || this.position.y != this._cache.y)
    {
        this.position.x = this._cache.x;
        this.position.y = this._cache.y;
        this._cache.dirty = true;
    }

    if (this.visible)
    {
        this.renderOrderID = this.game.world.currentRenderOrderID++;

        //  |a c tx|
        //  |b d ty|
        //  |0 0  1|

        //  Only update the values we need
        if (this.worldTransform[0] != this._cache.a00 || this.worldTransform[1] != this._cache.a01)
        {
            this._cache.a00 = this.worldTransform[0];  //  scaleX         a
            this._cache.a01 = this.worldTransform[1];  //  skewY          c
            this._cache.i01 = this.worldTransform[1];  //  skewY          c
            this._cache.scaleX = Math.sqrt((this._cache.a00 * this._cache.a00) + (this._cache.a01 * this._cache.a01)); // round this off a bit?
            this._cache.a01 *= -1;
            this._cache.dirty = true;
        }

        //  Need to test, but probably highly unlikely that a scaleX would happen without effecting the Y skew
        if (this.worldTransform[3] != this._cache.a10 || this.worldTransform[4] != this._cache.a11)
        {
            this._cache.a10 = this.worldTransform[3];  //  skewX          b
            this._cache.i10 = this.worldTransform[3];  //  skewX          b
            this._cache.a11 = this.worldTransform[4];  //  scaleY         d
            this._cache.scaleY = Math.sqrt((this._cache.a10 * this._cache.a10) + (this._cache.a11 * this._cache.a11)); // round this off a bit?
            this._cache.a10 *= -1;
            this._cache.dirty = true;
        }

        if (this.worldTransform[2] != this._cache.a02 || this.worldTransform[5] != this._cache.a12)
        {
            this._cache.a02 = this.worldTransform[2];  //  translateX     tx
            this._cache.a12 = this.worldTransform[5];  //  translateY     ty
            this._cache.dirty = true;
        }

        //  Frame updated?
        if (this.currentFrame.uuid != this._cache.frameID)
        {
            this._cache.frameWidth = this.texture.frame.width;
            this._cache.frameHeight = this.texture.frame.height;
            this._cache.frameID = this.currentFrame.uuid;
            this._cache.dirty = true;
        }

        if (this._cache.dirty)
        {
            this._cache.width = Math.floor(this.currentFrame.sourceSizeW * this._cache.scaleX);
            this._cache.height = Math.floor(this.currentFrame.sourceSizeH * this._cache.scaleY);
            this._cache.halfWidth = Math.floor(this._cache.width / 2);
            this._cache.halfHeight = Math.floor(this._cache.height / 2);

            this._cache.id = 1 / (this._cache.a00 * this._cache.a11 + this._cache.a01 * -this._cache.a10);
            this._cache.idi = 1 / (this._cache.a00 * this._cache.a11 + this._cache.i01 * -this._cache.i10);

            this.updateBounds();
        }
    }
    else
    {
        //  We still need to work out the bounds in case the camera has moved
        //  but we can't use the local or worldTransform to do it, as Pixi resets that if a Sprite is invisible.
        //  So we'll compare against the cached state + new position.
        if (this._cache.dirty && this.visible == false)
        {
            this.bounds.x -= this._cache.boundsX - this._cache.x;
            this._cache.boundsX = this._cache.x;

            this.bounds.y -= this._cache.boundsy - this._cache.y;
            this._cache.boundsY = this._cache.y;
        }
    }

    //  Re-run the camera visibility check
    if (this._cache.dirty)
    {
        this._cache.cameraVisible = Phaser.Rectangle.intersects(this.game.world.camera.screenView, this.bounds, 0);

        if (this.autoCull == true)
        {
            this.visible = this._cache.cameraVisible;
        }

        //  Update our physics bounds
        this.body.updateBounds(this.center.x, this.center.y, this._cache.scaleX, this._cache.scaleY);
    }

    this.body.update();

}

/**
 * Moves the sprite so its center is located on the given x and y coordinates.
 * Doesn't change the origin of the sprite.
 */
Phaser.Sprite.prototype.centerOn = function(x, y) {

    this.x = x + (this.x - this.center.x);
    this.y = y + (this.y - this.center.y);

}

Phaser.Sprite.prototype.revive = function() {

    this.alive = true;
    this.exists = true;
    this.visible = true;
    this.events.onRevived.dispatch(this);

}

Phaser.Sprite.prototype.kill = function() {

    this.alive = false;
    this.exists = false;
    this.visible = false;
    this.events.onKilled.dispatch(this);

}

Phaser.Sprite.prototype.reset = function(x, y) {

    this.x = x;
    this.y = y;
    this.position.x = x;
    this.position.y = y;
    this.alive = true;
    this.exists = true;
    this.visible = true;
    this._outOfBoundsFired = false;
    this.body.reset();
    
}

Phaser.Sprite.prototype.updateBounds = function() {

    //  Update the edge points

    this.offset.setTo(this._cache.a02 - (this.anchor.x * this._cache.width), this._cache.a12 - (this.anchor.y * this._cache.height));

    this.getLocalPosition(this.center, this.offset.x + this._cache.halfWidth, this.offset.y + this._cache.halfHeight);
    this.getLocalPosition(this.topLeft, this.offset.x, this.offset.y);
    this.getLocalPosition(this.topRight, this.offset.x + this._cache.width, this.offset.y);
    this.getLocalPosition(this.bottomLeft, this.offset.x, this.offset.y + this._cache.height);
    this.getLocalPosition(this.bottomRight, this.offset.x + this._cache.width, this.offset.y + this._cache.height);

    this._cache.left = Phaser.Math.min(this.topLeft.x, this.topRight.x, this.bottomLeft.x, this.bottomRight.x);
    this._cache.right = Phaser.Math.max(this.topLeft.x, this.topRight.x, this.bottomLeft.x, this.bottomRight.x);
    this._cache.top = Phaser.Math.min(this.topLeft.y, this.topRight.y, this.bottomLeft.y, this.bottomRight.y);
    this._cache.bottom = Phaser.Math.max(this.topLeft.y, this.topRight.y, this.bottomLeft.y, this.bottomRight.y);

    this.bounds.setTo(this._cache.left, this._cache.top, this._cache.right - this._cache.left, this._cache.bottom - this._cache.top);

    //  This is the coordinate the Sprite was at when the last bounds was created
    this._cache.boundsX = this._cache.x;
    this._cache.boundsY = this._cache.y;

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
        }
    }

}

Phaser.Sprite.prototype.getLocalPosition = function(p, x, y) {

    p.x = ((this._cache.a11 * this._cache.id * x + -this._cache.a01 * this._cache.id * y + (this._cache.a12 * this._cache.a01 - this._cache.a02 * this._cache.a11) * this._cache.id) * this._cache.scaleX) + this._cache.a02;
    p.y = ((this._cache.a00 * this._cache.id * y + -this._cache.a10 * this._cache.id * x + (-this._cache.a12 * this._cache.a00 + this._cache.a02 * this._cache.a10) * this._cache.id) * this._cache.scaleY) + this._cache.a12;

    return p;

}

Phaser.Sprite.prototype.getLocalUnmodifiedPosition = function(p, x, y) {

    p.x = this._cache.a11 * this._cache.idi * x + -this._cache.i01 * this._cache.idi * y + (this._cache.a12 * this._cache.i01 - this._cache.a02 * this._cache.a11) * this._cache.idi;
    p.y = this._cache.a00 * this._cache.idi * y + -this._cache.i10 * this._cache.idi * x + (-this._cache.a12 * this._cache.a00 + this._cache.a02 * this._cache.i10) * this._cache.idi;

    return p;

}

Phaser.Sprite.prototype.bringToTop = function() {

    if (this.group)
    {
        this.group.bringToTop(this);
    }
    else
    {
        this.game.world.bringToTop(this);
    }

}

Phaser.Sprite.prototype.getBounds = function(rect) {

    rect = rect || new Phaser.Rectangle;

    var left = Phaser.Math.min(this.topLeft.x, this.topRight.x, this.bottomLeft.x, this.bottomRight.x);
    var right = Phaser.Math.max(this.topLeft.x, this.topRight.x, this.bottomLeft.x, this.bottomRight.x);
    var top = Phaser.Math.min(this.topLeft.y, this.topRight.y, this.bottomLeft.y, this.bottomRight.y);
    var bottom = Phaser.Math.max(this.topLeft.y, this.topRight.y, this.bottomLeft.y, this.bottomRight.y);

    rect.x = left;
    rect.y = top;
    rect.width = right - left;
    rect.height = bottom - top;
    
    return rect;

}

Object.defineProperty(Phaser.Sprite.prototype, 'angle', {

    get: function() {
        return Phaser.Math.radToDeg(this.rotation);
    },

    set: function(value) {
        this.rotation = Phaser.Math.degToRad(value);
    }

});

Object.defineProperty(Phaser.Sprite.prototype, "frame", {
    
	/**
    * Get the animation frame number.
    */
    get: function () {
        return this.animations.frame;
    },

	/**
    * Set the animation frame by frame number.
    */
    set: function (value) {
        this.animations.frame = value;
    }

});

Object.defineProperty(Phaser.Sprite.prototype, "frameName", {
    
	/**
    * Get the animation frame name.
    */
    get: function () {
        return this.animations.frameName;
    },

	/**
    * Set the animation frame by frame name.
    */
    set: function (value) {
        this.animations.frameName = value;
    }

});

Object.defineProperty(Phaser.Sprite.prototype, "inCamera", {
    
    /**
    * Is this sprite visible to the camera or not?
    */
    get: function () {
        return this._cache.cameraVisible;
    }

});

Object.defineProperty(Phaser.Sprite.prototype, "crop", {

    /**
    * Get the input enabled state of this Sprite.
    */
    get: function () {

        return this._cropRect;

    },

    /**
    * Set the ability for this sprite to receive input events.
    */
    set: function (value) {

        if (value instanceof Phaser.Rectangle)
        {
            if (this._cropUUID == null)
            {
                this._cropUUID = this.game.rnd.uuid();

                PIXI.TextureCache[this._cropUUID] = new PIXI.Texture(PIXI.BaseTextureCache[this.key], {
                    x: value.x,
                    y: value.y,
                    width: value.width,
                    height: value.height
                });
            }
            else
            {
                PIXI.TextureCache[this._cropUUID].frame = value;
            }

            this._cropRect = value;
            this.setTexture(PIXI.TextureCache[this._cropUUID]);
        }

    }

});

Object.defineProperty(Phaser.Sprite.prototype, "inputEnabled", {
    
    /**
    * Get the input enabled state of this Sprite.
    */
    get: function () {

        return (this.input.enabled);

    },

    /**
    * Set the ability for this sprite to receive input events.
    */
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

Phaser.TileSprite = function (game, x, y, width, height, key, frame) {

    x = x || 0;
    y = y || 0;
    width = width || 256;
    height = height || 256;
    key = key || null;
    frame = frame || null;

	Phaser.Sprite.call(this, game, x, y, key, frame);

    this.texture = PIXI.TextureCache[key];

	PIXI.TilingSprite.call(this, this.texture, width, height);

	this.type = Phaser.TILESPRITE;

	/**
	 * The scaling of the image that is being tiled
	 *
	 * @property tileScale
	 * @type Point
	 */	
	this.tileScale = new Phaser.Point(1, 1);

	/**
	 * The offset position of the image that is being tiled
	 *
	 * @property tilePosition
	 * @type Point
	 */	
	this.tilePosition = new Phaser.Point(0, 0);

};

Phaser.TileSprite.prototype = Phaser.Utils.extend(true, PIXI.TilingSprite.prototype, Phaser.Sprite.prototype);
Phaser.TileSprite.prototype.constructor = Phaser.TileSprite;

//  Add our own custom methods

Phaser.Text = function (game, x, y, text, style) {

    x = x || 0;
    y = y || 0;
    text = text || '';
    style = style || '';

    PIXI.Text.call(this, text, style);

    /*
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");

	var canvasID = game.rnd.uuid();

	PIXI.TextureCache[canvasID] = new PIXI.Texture(new PIXI.BaseTexture(this.canvas));

	Phaser.Sprite.call(this, game, x, y, canvasID);

    this.type = Phaser.TEXT;

    this.setText(text);
    this.setStyle(style);
    
    this.updateText();
    this.dirty = false;
    */

};

// Phaser.Text.prototype = Phaser.Utils.extend(true, Phaser.Sprite.prototype, PIXI.Text.prototype);
Phaser.Text.prototype = Phaser.Utils.extend(true, PIXI.Text.prototype);
Phaser.Text.prototype.constructor = Phaser.Text;

//  Add our own custom methods

/**
* Create a new <code>Button</code> object.
*
* @param game {Phaser.Game} Current game instance.
* @param [x] {number} X position of the button.
* @param [y] {number} Y position of the button.
* @param [key] {string} The image key as defined in the Game.Cache to use as the texture for this button.
* @param [callback] {function} The function to call when this button is pressed
* @param [callbackContext] {object} The context in which the callback will be called (usually 'this')
* @param [overFrame] {string|number} This is the frame or frameName that will be set when this button is in an over state. Give either a number to use a frame ID or a string for a frame name.
* @param [outFrame] {string|number} This is the frame or frameName that will be set when this button is in an out state. Give either a number to use a frame ID or a string for a frame name.
* @param [downFrame] {string|number} This is the frame or frameName that will be set when this button is in a down state. Give either a number to use a frame ID or a string for a frame name.
*/
Phaser.Button = function (game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame) {

    x = x || 0;
    y = y || 0;
    key = key || null;
    callback = callback || null;
    callbackContext = callbackContext || this;

	Phaser.Sprite.call(this, game, x, y, key, outFrame);

    this.type = Phaser.BUTTON;

    this._onOverFrameName = null;
    this._onOutFrameName = null;
    this._onDownFrameName = null;
    this._onUpFrameName = null;
    this._onOverFrameID = null;
    this._onOutFrameID = null;
    this._onDownFrameID = null;
    this._onUpFrameID = null;

    //  These are the signals the game will subscribe to
    this.onInputOver = new Phaser.Signal;
    this.onInputOut = new Phaser.Signal;
    this.onInputDown = new Phaser.Signal;
    this.onInputUp = new Phaser.Signal;

    this.setFrames(overFrame, outFrame, downFrame);

    if (callback !== null)
    {
        this.onInputUp.add(callback, callbackContext);
    }

    this.input.start(0, false, true);

    //  Redirect the input events to here so we can handle animation updates, etc
    this.events.onInputOver.add(this.onInputOverHandler, this);
    this.events.onInputOut.add(this.onInputOutHandler, this);
    this.events.onInputDown.add(this.onInputDownHandler, this);
    this.events.onInputUp.add(this.onInputUpHandler, this);

};

Phaser.Button.prototype = Phaser.Utils.extend(true, Phaser.Sprite.prototype, PIXI.Sprite.prototype);
Phaser.Button.prototype.constructor = Phaser.Button;

//  Add our own custom methods

Phaser.Button.prototype.setFrames = function (overFrame, outFrame, downFrame) {

    if (overFrame !== null)
    {
        if (typeof overFrame === 'string')
        {
            this._onOverFrameName = overFrame;
        }
        else
        {
            this._onOverFrameID = overFrame;
        }
    }

    if (outFrame !== null)
    {
        if (typeof outFrame === 'string')
        {
            this._onOutFrameName = outFrame;
            this._onUpFrameName = outFrame;
        }
        else
        {
            this._onOutFrameID = outFrame;
            this._onUpFrameID = outFrame;
        }
    }

    if (downFrame !== null)
    {
        if (typeof downFrame === 'string')
        {
            this._onDownFrameName = downFrame;
        }
        else
        {
            this._onDownFrameID = downFrame;
        }
    }

};

Phaser.Button.prototype.onInputOverHandler = function (pointer) {

    if (this._onOverFrameName != null)
    {
        this.frameName = this._onOverFrameName;
    }
    else if (this._onOverFrameID != null)
    {
        this.frame = this._onOverFrameID;
    }

    if (this.onInputOver)
    {
        this.onInputOver.dispatch(this, pointer);
    }
};

Phaser.Button.prototype.onInputOutHandler = function (pointer) {

    if (this._onOutFrameName != null)
    {
        this.frameName = this._onOutFrameName;
    }
    else if (this._onOutFrameID != null)
    {
        this.frame = this._onOutFrameID;
    }

    if (this.onInputOut)
    {
        this.onInputOut.dispatch(this, pointer);
    }
};

Phaser.Button.prototype.onInputDownHandler = function (pointer) {

    if (this._onDownFrameName != null)
    {
        this.frameName = this._onDownFrameName;
    }
    else if (this._onDownFrameID != null)
    {
        this.frame = this._onDownFrameID;
    }

    if (this.onInputDown)
    {
        this.onInputDown.dispatch(this, pointer);
    }
};

Phaser.Button.prototype.onInputUpHandler = function (pointer) {

    if (this._onUpFrameName != null)
    {
        this.frameName = this._onUpFrameName;
    }
    else if (this._onUpFrameID != null)
    {
        this.frame = this._onUpFrameID;
    }

    if (this.onInputUp)
    {
        this.onInputUp.dispatch(this, pointer);
    }
};

Phaser.Graphics = function (game, x, y) {

    //  If exists = false then the Sprite isn't updated by the core game loop or physics subsystem at all
    this.exists = true;

    //  This is a handy little var your game can use to determine if a sprite is alive or not, it doesn't effect rendering
    this.alive = true;

    this.group = null;

    this.name = '';

	this.game = game;

	PIXI.DisplayObjectContainer.call(this);

    this.type = Phaser.GRAPHICS;

	this.position.x = x;
	this.position.y = y;

    //  Replaces the PIXI.Point with a slightly more flexible one
    this.scale = new Phaser.Point(1, 1);

    //  Influence of camera movement upon the position
    this.scrollFactor = new Phaser.Point(1, 1);

    //  A mini cache for storing all of the calculated values
    this._cache = { 

        dirty: false,

        //  Transform cache
        a00: 1, a01: 0, a02: x, a10: 0, a11: 1, a12: y, id: 1, 

        //  The previous calculated position inc. camera x/y and scrollFactor
        x: -1, y: -1,

        //  The actual scale values based on the worldTransform
        scaleX: 1, scaleY: 1

    };

    this._cache.x = this.x - (this.game.world.camera.x * this.scrollFactor.x);
    this._cache.y = this.y - (this.game.world.camera.y * this.scrollFactor.y);

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

};

Phaser.Graphics.prototype = Phaser.Utils.extend(true, PIXI.Graphics.prototype, PIXI.DisplayObjectContainer.prototype, Phaser.Sprite.prototype);
Phaser.Graphics.prototype.constructor = Phaser.Graphics;

//  Add our own custom methods

/**
 * Automatically called by World.update
 */
Phaser.Graphics.prototype.update = function() {

    if (!this.exists)
    {
        return;
    }

    this._cache.dirty = false;

    this._cache.x = this.x - (this.game.world.camera.x * this.scrollFactor.x);
    this._cache.y = this.y - (this.game.world.camera.y * this.scrollFactor.y);

    if (this.position.x != this._cache.x || this.position.y != this._cache.y)
    {
        this.position.x = this._cache.x;
        this.position.y = this._cache.y;
        this._cache.dirty = true;
    }

}

Object.defineProperty(Phaser.Graphics.prototype, 'angle', {

    get: function() {
        return Phaser.Math.radToDeg(this.rotation);
    },

    set: function(value) {
        this.rotation = Phaser.Math.degToRad(value);
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

Phaser.RenderTexture = function (game, key, width, height) {

	this.game = game;

    this.name = key;

	PIXI.EventTarget.call( this );

	this.width = width || 100;
	this.height = height || 100;

	this.indetityMatrix = PIXI.mat3.create();

	this.frame = new PIXI.Rectangle(0, 0, this.width, this.height);	

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

Phaser.BitmapText = function (game, x, y, text, style) {

    x = x || 0;
    y = y || 0;
    text = text || '';
    style = style || '';

    //  If exists = false then the Sprite isn't updated by the core game loop or physics subsystem at all
    this.exists = true;

    //  This is a handy little var your game can use to determine if a sprite is alive or not, it doesn't effect rendering
    this.alive = true;

    this.group = null;

    this.name = '';

    this.game = game;

    PIXI.BitmapText.call(this, text, style);

    this.position.x = x;
    this.position.y = y;

    //  Replaces the PIXI.Point with a slightly more flexible one
    this.scale = new Phaser.Point(1, 1);

    //  Influence of camera movement upon the position
    this.scrollFactor = new Phaser.Point(1, 1);

    //  A mini cache for storing all of the calculated values
    this._cache = { 

        dirty: false,

        //  Transform cache
        a00: 1, a01: 0, a02: x, a10: 0, a11: 1, a12: y, id: 1, 

        //  The previous calculated position inc. camera x/y and scrollFactor
        x: -1, y: -1,

        //  The actual scale values based on the worldTransform
        scaleX: 1, scaleY: 1

    };

    this._cache.x = this.x - (this.game.world.camera.x * this.scrollFactor.x);
    this._cache.y = this.y - (this.game.world.camera.y * this.scrollFactor.y);

    this.renderable = true;

};

Phaser.BitmapText.prototype = Phaser.Utils.extend(true, PIXI.BitmapText.prototype);
Phaser.BitmapText.prototype.constructor = Phaser.BitmapText;

//  Add our own custom methods

/**
 * Automatically called by World.update
 */
Phaser.BitmapText.prototype.update = function() {

    if (!this.exists)
    {
        return;
    }

    this._cache.dirty = false;

    this._cache.x = this.x - (this.game.world.camera.x * this.scrollFactor.x);
    this._cache.y = this.y - (this.game.world.camera.y * this.scrollFactor.y);

    if (this.position.x != this._cache.x || this.position.y != this._cache.y)
    {
        this.position.x = this._cache.x;
        this.position.y = this._cache.y;
        this._cache.dirty = true;
    }

}

Object.defineProperty(Phaser.BitmapText.prototype, 'angle', {

    get: function() {
        return Phaser.Math.radToDeg(this.rotation);
    },

    set: function(value) {
        this.rotation = Phaser.Math.degToRad(value);
    }

});

Object.defineProperty(Phaser.BitmapText.prototype, 'x', {

    get: function() {
        return this.position.x;
    },

    set: function(value) {
        this.position.x = value;
    }

});

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
* @license      https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
* @module       Phaser.Canvas
*/

Phaser.Canvas = {

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
    * @method getAspectRatio
    * @param {HTMLCanvasElement} canvas The canvas to get the aspect ratio from.
    * @return {Number} Returns true on success
    */        
    getAspectRatio: function (canvas) {
        return canvas.width / canvas.height;
    },

    /**
    * Sets the background color behind the canvas. This changes the canvas style property.
    *
    * @method setBackgroundColor
    * @param {HTMLCanvasElement} canvas The canvas to set the background color on.
    * @param {String} color The color to set. Can be in the format 'rgb(r,g,b)', or '#RRGGBB' or any valid CSS color.
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
    * @method setTouchAction
    * @param {HTMLCanvasElement} canvas The canvas to set the touch action on.
    * @param {String} value The touch action to set. Defaults to 'none'.
    * @return {HTMLCanvasElement} Returns the source canvas.
    */
    setTouchAction: function (canvas, value) {

        value = value || 'none';

        canvas.style.msTouchAction = value;
        canvas.style['ms-touch-action'] = value;
        canvas.style['touch-action'] = value;

        return canvas;

    },

    /**
    * Adds the given canvas element to the DOM. The canvas will be added as a child of the given parent.
    * If no parent is given it will be added as a child of the document.body.
    *
    * @method addToDOM
    * @param {HTMLCanvasElement} canvas The canvas to set the touch action on.
    * @param {String} parent The DOM element to add the canvas to. Defaults to ''.
    * @param {bool} overflowHidden If set to true it will add the overflow='hidden' style to the parent DOM element.
    * @return {HTMLCanvasElement} Returns the source canvas.
    */
    addToDOM: function (canvas, parent, overflowHidden) {

        parent = parent || '';
        overflowHidden = overflowHidden || true;

        if (parent !== '')
        {
            if (document.getElementById(parent))
            {
                document.getElementById(parent).appendChild(canvas);
            }
            else
            {
                document.body.appendChild(canvas);
            }

            if (overflowHidden)
            {
                document.getElementById(parent).style.overflow = 'hidden';
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
    * @method setTransform
    * @param {CanvasRenderingContext2D} context The context to set the transform on.
    * @param {Number} translateX The value to translate horizontally by.
    * @param {Number} translateY The value to translate vertically by.
    * @param {Number} scaleX The value to scale horizontally by.
    * @param {Number} scaleY The value to scale vertically by.
    * @param {Number} skewX The value to skew horizontaly by.
    * @param {Number} skewY The value to skew vertically by.
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
    * @method setSmoothingEnabled
    * @param {CanvasRenderingContext2D} context The context to enable or disable the image smoothing on.
    * @param {bool} value If set to true it will enable image smoothing, false will disable it.
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
    * @method setImageRenderingCrisp
    * @param {HTMLCanvasElement} canvas The canvas to set image-rendering crisp on.
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
    * @method setImageRenderingBicubic
    * @param {HTMLCanvasElement} canvas The canvas to set image-rendering bicubic on.
    * @return {HTMLCanvasElement} Returns the source canvas.
    */
    setImageRenderingBicubic: function (canvas) {

        canvas.style['image-rendering'] = 'auto';
        canvas.style.msInterpolationMode = 'bicubic';

        return canvas;

    }

};

Phaser.StageScaleMode = function (game, width, height) {

    /**
    * Stage height when start the game.
    * @type {number}
    */
    this._startHeight = 0;

    /**
    * If the game should be forced to use Landscape mode, this is set to true by Game.Stage
    * @type {bool}
    */
    this.forceLandscape = false;

    /**
    * If the game should be forced to use Portrait mode, this is set to true by Game.Stage
    * @type {bool}
    */
    this.forcePortrait = false;

    /**
    * If the game should be forced to use a specific orientation and the device currently isn't in that orientation this is set to true.
    * @type {bool}
    */
    this.incorrectOrientation = false;

    /**
    * If you wish to align your game in the middle of the page then you can set this value to true.
    * It will place a re-calculated margin-left pixel value onto the canvas element which is updated on orientation/resizing.
    * It doesn't care about any other DOM element that may be on the page, it literally just sets the margin.
    * @type {bool}
    */
    this.pageAlignHorizontally = false;

    /**
    * If you wish to align your game in the middle of the page then you can set this value to true.
    * It will place a re-calculated margin-left pixel value onto the canvas element which is updated on orientation/resizing.
    * It doesn't care about any other DOM element that may be on the page, it literally just sets the margin.
    * @type {bool}
    */
    this.pageAlignVeritcally = false;

    /**
    * Minimum width the canvas should be scaled to (in pixels)
    * @type {number}
    */
    this.minWidth = null;

    /**
    * Maximum width the canvas should be scaled to (in pixels).
    * If null it will scale to whatever width the browser can handle.
    * @type {number}
    */
    this.maxWidth = null;

    /**
    * Minimum height the canvas should be scaled to (in pixels)
    * @type {number}
    */
    this.minHeight = null;

    /**
    * Maximum height the canvas should be scaled to (in pixels).
    * If null it will scale to whatever height the browser can handle.
    * @type {number}
    */
    this.maxHeight = null;

    /**
    * Width of the stage after calculation.
    * @type {number}
    */
    this.width = 0;

    /**
    * Height of the stage after calculation.
    * @type {number}
    */
    this.height = 0;

    /**
    * The maximum number of times it will try to resize the canvas to fill the browser (default is 5)
    * @type {number}
    */
    this.maxIterations = 5;
    this.game = game;

    this.enterLandscape = new Phaser.Signal();
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

    this.scaleFactor = new Phaser.Point(1, 1);
    this.aspectRatio = 0;

    var _this = this;

    window.addEventListener('orientationchange', function (event) {
        return _this.checkOrientation(event);
    }, false);

    window.addEventListener('resize', function (event) {
        return _this.checkResize(event);
    }, false);
	
};

Phaser.StageScaleMode.EXACT_FIT = 0;
Phaser.StageScaleMode.NO_SCALE = 1;
Phaser.StageScaleMode.SHOW_ALL = 2;

Phaser.StageScaleMode.prototype = {

    startFullScreen: function () {

        if (this.isFullScreen)
        {
            return;
        }

        var element = this.game.canvas;
        
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

        this.game.stage.canvas.style['width'] = '100%';
        this.game.stage.canvas.style['height'] = '100%';

    },

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

        if (this.pageAlignVeritcally)
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

    setMaximum: function () {

        this.width = window.innerWidth;
        this.height = window.innerHeight;

    },

    setShowAll: function () {

        var multiplier = Math.min((window.innerHeight / this.game.height), (window.innerWidth / this.game.width));

        this.width = Math.round(this.game.width * multiplier);
        this.height = Math.round(this.game.height * multiplier);

    },

    setExactFit: function () {

        var availableWidth = window.innerWidth - 0;
        var availableHeight = window.innerHeight - 5;

        console.log('available', availableWidth, availableHeight);

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

        console.log('setExactFit', this.width, this.height, this.game.stage.offset);

    }

};

Object.defineProperty(Phaser.StageScaleMode.prototype, "isFullScreen", {

    get: function () {

        if (document['fullscreenElement'] === null || document['mozFullScreenElement'] === null || document['webkitFullscreenElement'] === null)
        {
            return false;
        }

        return true;

    }

});

Object.defineProperty(Phaser.StageScaleMode.prototype, "isPortrait", {

    get: function () {
        return this.orientation == 0 || this.orientation == 180;
    }

});

Object.defineProperty(Phaser.StageScaleMode.prototype, "isLandscape", {

    get: function () {
        return this.orientation === 90 || this.orientation === -90;
    }

});


/**
* Phaser - Device
*
* Detects device support capabilities. Using some elements from System.js by MrDoob and Modernizr
* https://github.com/Modernizr/Modernizr/blob/master/feature-detects/audio.js
*/

Phaser.Device = function () {

    /**
    * An optional 'fix' for the horrendous Android stock browser bug
    * https://code.google.com/p/android/issues/detail?id=39247
    * @type {boolean}
    */
    this.patchAndroidClearRectBug = false;

    //  Operating System

    /**
    * Is running desktop?
    * @type {boolean}
    */
    this.desktop = false;

    /**
    * Is running on iOS?
    * @type {boolean}
    */
    this.iOS = false;

    /**
    * Is running on android?
    * @type {boolean}
    */
    this.android = false;

    /**
    * Is running on chromeOS?
    * @type {boolean}
    */
    this.chromeOS = false;

    /**
    * Is running on linux?
    * @type {boolean}
    */
    this.linux = false;

    /**
    * Is running on maxOS?
    * @type {boolean}
    */
    this.macOS = false;

    /**
    * Is running on windows?
    * @type {boolean}
    */
    this.windows = false;

    //  Features

    /**
    * Is canvas available?
    * @type {boolean}
    */
    this.canvas = false;

    /**
    * Is file available?
    * @type {boolean}
    */
    this.file = false;

    /**
    * Is fileSystem available?
    * @type {boolean}
    */
    this.fileSystem = false;

    /**
    * Is localStorage available?
    * @type {boolean}
    */
    this.localStorage = false;

    /**
    * Is webGL available?
    * @type {boolean}
    */
    this.webGL = false;

    /**
    * Is worker available?
    * @type {boolean}
    */
    this.worker = false;

    /**
    * Is touch available?
    * @type {boolean}
    */
    this.touch = false;

    /**
    * Is mspointer available?
    * @type {boolean}
    */
    this.mspointer = false;

    /**
    * Is css3D available?
    * @type {boolean}
    */
    this.css3D = false;

    /**
    * Is Pointer Lock available?
    * @type {boolean}
    */
    this.pointerLock = false;

    //  Browser

    /**
    * Is running in arora?
    * @type {boolean}
    */
    this.arora = false;

    /**
    * Is running in chrome?
    * @type {boolean}
    */
    this.chrome = false;

    /**
    * Is running in epiphany?
    * @type {boolean}
    */
    this.epiphany = false;

    /**
    * Is running in firefox?
    * @type {boolean}
    */
    this.firefox = false;

    /**
    * Is running in ie?
    * @type {boolean}
    */
    this.ie = false;

    /**
    * Version of ie?
    * @type Number
    */
    this.ieVersion = 0;

    /**
    * Is running in mobileSafari?
    * @type {boolean}
    */
    this.mobileSafari = false;

    /**
    * Is running in midori?
    * @type {boolean}
    */
    this.midori = false;

    /**
    * Is running in opera?
    * @type {boolean}
    */
    this.opera = false;

    /**
    * Is running in safari?
    * @type {boolean}
    */
    this.safari = false;
    this.webApp = false;

    //  Audio

    /**
    * Are Audio tags available?
    * @type {boolean}
    */
    this.audioData = false;

    /**
    * Is the WebAudio API available?
    * @type {boolean}
    */
    this.webAudio = false;

    /**
    * Can this device play ogg files?
    * @type {boolean}
    */
    this.ogg = false;

    /**
    * Can this device play opus files?
    * @type {boolean}
    */
    this.opus = false;

    /**
    * Can this device play mp3 files?
    * @type {boolean}
    */
    this.mp3 = false;

    /**
    * Can this device play wav files?
    * @type {boolean}
    */
    this.wav = false;
    /**
    * Can this device play m4a files?
    * @type {boolean}
    */
    this.m4a = false;

    /**
    * Can this device play webm files?
    * @type {boolean}
    */
    this.webm = false;

    //  Device

    /**
    * Is running on iPhone?
    * @type {boolean}
    */
    this.iPhone = false;

    /**
    * Is running on iPhone4?
    * @type {boolean}
    */
    this.iPhone4 = false;

    /**
    * Is running on iPad?
    * @type {boolean}
    */
    this.iPad = false;

    /**
    * PixelRatio of the host device?
    * @type Number
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
        this.webGL = ( function () { try { return !! window.WebGLRenderingContext && !! document.createElement( 'canvas' ).getContext( 'experimental-webgl' ); } catch( e ) { return false; } } )();
        // this.webGL = !!window['WebGLRenderingContext'];
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

    canPlayAudio: function (type) {

        if (type == 'mp3' && this.mp3) {
            return true;
        } else if (type == 'ogg' && (this.ogg || this.opus)) {
            return true;
        } else if (type == 'm4a' && this.m4a) {
            return true;
        } else if (type == 'wav' && this.wav) {
            return true;
        } else if (type == 'webm' && this.webm) {
            return true;
        }

        return false;

    },

    isConsoleOpen: function () {

        if (window.console && window.console['firebug']) {
            return true;
        }

        if (window.console) {
            console.profile();
            console.profileEnd();

            if (console.clear) {
                console.clear();
            }

            return console['profiles'].length > 0;
        }

        return false;

    }

};

/**
* Phaser - RequestAnimationFrame
*
* Abstracts away the use of RAF or setTimeOut for the core game update loop.
*/
Phaser.RequestAnimationFrame = function(game) {
	
	this.game = game;

	this._isSetTimeOut = false;
	this.isRunning = false;

	var vendors = [
		'ms', 
		'moz', 
		'webkit', 
		'o'
	];

	for (var x = 0; x < vendors.length && !window.requestAnimationFrame; x++) {
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'];
	}

};

Phaser.RequestAnimationFrame.prototype = {

	/**
	* The function called by the update
	* @private
	**/
	_onLoop: null,

	/**
	* Starts the requestAnimatioFrame running or setTimeout if unavailable in browser
	* @method start
	**/
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
	* @method RAFUpdate
	**/
	updateRAF: function (time) {

		this.game.update(time);

		window.requestAnimationFrame(this._onLoop);

	},

	/**
	* The update method for the setTimeout
	* @method SetTimeoutUpdate
	**/
	updateSetTimeout: function () {

		this.game.update(Date.now());

		this._timeOutID = window.setTimeout(this._onLoop, this.game.time.timeToCall);

	},

	/**
	* Stops the requestAnimationFrame from running
	* @method stop
	**/
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
	* @method isSetTimeOut
	* @return bool
	**/
	isSetTimeOut: function () {
		return this._isSetTimeOut;
	},

	/**
	* Is the browser using requestAnimationFrame?
	* @method isRAF
	* @return bool
	**/
	isRAF: function () {
		return (this._isSetTimeOut === false);
	}

};
/**
* Phaser.RandomDataGenerator
*
* An extremely useful repeatable random data generator. Access it via Phaser.Game.rnd
* Based on Nonsense by Josh Faul https://github.com/jocafa/Nonsense
* Random number generator from http://baagoe.org/en/wiki/Better_random_numbers_for_javascript
*/
Phaser.RandomDataGenerator = function (seeds) {
	
	if (typeof seeds === "undefined") { seeds = []; }

	this.sow(seeds);

};

Phaser.RandomDataGenerator.prototype = {

	/**
	* @property c
	* @type Number
	* @private
	*/
	c: 1,

	/**
	* @property s0
	* @type Number
	* @private
	*/
	s0: 0,

	/**
	* @property s1
	* @type Number
	* @private
	*/
	s1: 0,

	/**
	* @property s2
	* @type Number
	* @private
	*/
	s2: 0,

	/**
	* Private random helper
	* @method rnd
	* @private
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
	* Reset the seed of the random data generator
	* @method sow
	* @param {Array} seeds
	*/
	sow: function (seeds) {

		if (typeof seeds === "undefined") { seeds = []; }

		this.s0 = this.hash(' ');
		this.s1 = this.hash(this.s0);
		this.s2 = this.hash(this.s1);

		var seed;

		for (var i = 0; seed = seeds[i++]; ) {
			this.s0 -= this.hash(seed);
			this.s0 += ~~(this.s0 < 0);
			this.s1 -= this.hash(seed);
			this.s1 += ~~(this.s1 < 0);
			this.s2 -= this.hash(seed);
			this.s2 += ~~(this.s2 < 0);
		}
		
	},

	/**
	* @method hash
	* @param {Any} data
	* @private
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
	* Returns a random integer between 0 and 2^32
	* @method integer
	* @return {Number}
	*/
	integer: function() {
		return this.rnd.apply(this) * 0x100000000;// 2^32
	},

	/**
	* Returns a random real number between 0 and 1
	* @method frac
	* @return {Number}
	*/	
	frac: function() {
		return this.rnd.apply(this) + (this.rnd.apply(this) * 0x200000 | 0) * 1.1102230246251565e-16;// 2^-53
	},

	/**
	* Returns a random real number between 0 and 2^32
	* @method real
	* @return {Number}
	*/
	real: function() {
		return this.integer() + this.frac();
	},

	/**
	* Returns a random integer between min and max
	* @method integerInRange
	* @param {Number} min
	* @param {Number} max
	* @return {Number}
	*/
	integerInRange: function (min, max) {
		return Math.floor(this.realInRange(min, max));
	},

	/**
	* Returns a random real number between min and max
	* @method realInRange
	* @param {Number} min
	* @param {Number} max
	* @return {Number}
	*/
	realInRange: function (min, max) {

		min = min || 0;
		max = max || 0;

		return this.frac() * (max - min) + min;

	},

	/**
	* Returns a random real number between -1 and 1
	* @method normal
	* @return {Number}
	*/
	normal: function () {
		return 1 - 2 * this.frac();
	},

	/**
	* Returns a valid RFC4122 version4 ID hex string (from https://gist.github.com/1308368)
	* @method uuid
	* @return {String}
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
	* Returns a random member of `array`
	* @method pick
	* @param {Any} array
	*/
	pick: function (ary) {
		return ary[this.integerInRange(0, ary.length)];
	},

	/**
	* Returns a random member of `array`, favoring the earlier entries
	* @method weightedPick
	* @param {Any} array
	*/
	weightedPick: function (ary) {
		return ary[~~(Math.pow(this.frac(), 2) * ary.length)];
	},

	/**
	* Returns a random timestamp between min and max, or between the beginning of 2000 and the end of 2020 if min and max aren't specified
	* @method timestamp
	* @param {Number} min
	* @param {Number} max
	*/
	timestamp: function (a, b) {
		return this.realInRange(a || 946684800000, b || 1577862000000);
	},

	/**
	* Returns a random angle between -180 and 180
	* @method angle
	*/
	angle: function() {
		return this.integerInRange(-180, 180);
	}

};

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

        var rd = (radians) ? GameMath.PI : 180;
        return this.wrap(angle, rd, -rd);
        
    },

	/**
	* closest angle between two angles from a1 to a2
	* absolute value the return for exact angle
	*/
    nearestAngleBetween: function (a1, a2, radians) {

        if (typeof radians === "undefined") { radians = true; }

        var rd = (radians) ? GameMath.PI : 180;
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

/*
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
 
/*
 Copyright © 2012 Timo Hausmann

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/*
* QuadTree Constructor
* @param Integer maxObjects		(optional) max objects a node can hold before splitting into 4 subnodes (default: 10)
* @param Integer maxLevels		(optional) total max levels inside root QuadTree (default: 4) 
* @param Integer level		(optional) deepth level, required for subnodes  
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
	 * @param Object pRect		bounds of the object to be added, with x, y, width, height
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
	 * Determine which node the object belongs to
	 * @param Object pRect		bounds of the area to be checked, with x, y, width, height
	 * @return Integer		index of the subnode (0-3), or -1 if pRect cannot completely fit within a subnode and is part of the parent node
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
	 * Return all objects that could collide with the given object
	 * @param Object pRect		bounds of the object to be checked, with x, y, width, height
	 * @Return Array		array with all detected objects
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
	 * Clear the quadtree
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
* Phaser - Circle
*
* Creates a new Circle object with the center coordinate specified by the x and y parameters and the diameter specified by the diameter parameter. If you call this function without parameters, a circle with x, y, diameter and radius properties set to 0 is created.
* @class Circle
* @constructor
* @param {Number} [x] The x coordinate of the center of the circle.
* @param {Number} [y] The y coordinate of the center of the circle.
* @param {Number} [diameter] The diameter of the circle.
* @return {Circle} This circle object
**/
Phaser.Circle = function (x, y, diameter) {

    x = x || 0;
    y = y || 0;
    diameter = diameter || 0;

    /**
    * The x coordinate of the center of the circle
    * @property x
    * @type Number
    **/
    this.x = x;

    /**
    * The y coordinate of the center of the circle
    * @property y
    * @type Number
    **/
    this.y = y;

    this._diameter = diameter;

    if (diameter > 0)
    {
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
    * @method circumference
    * @return {Number}
    **/
    circumference: function () {
        return 2 * (Math.PI * this._radius);
    },

    /**
    * Sets the members of Circle to the specified values.
    * @method setTo
    * @param {Number} x The x coordinate of the center of the circle.
    * @param {Number} y The y coordinate of the center of the circle.
    * @param {Number} diameter The diameter of the circle in pixels.
    * @return {Circle} This circle object
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
    * @method copyFrom
    * @param {any} source - The object to copy from.
    * @return {Circle} This Circle object.
    **/
    copyFrom: function (source) {
        return this.setTo(source.x, source.y, source.diameter);
    },

    /**
    * Copies the x, y and diameter properties from this Circle to any given object.
    * @method copyTo
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
    * @method distance
    * @param {object} dest The target object. Must have visible x and y properties that represent the center of the object.
    * @param {bool} [optional] round Round the distance to the nearest integer (default false)
    * @return {Number} The distance between this Point object and the destination Point object.
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
    * @method clone
    * @param {Phaser.Circle} out Optional Circle object. If given the values will be set into the object, otherwise a brand new Circle object will be created and returned.
    * @return {Phaser.Circle} The cloned Circle object.
    */
    clone: function(out) {

        if (typeof out === "undefined") { out = new Phaser.Circle(); }

        return out.setTo(a.x, a.y, a.diameter);

    },

    /**
    * Return true if the given x/y coordinates are within this Circle object.
    * @method contains
    * @param {Number} x The X value of the coordinate to test.
    * @param {Number} y The Y value of the coordinate to test.
    * @return {bool} True if the coordinates are within this circle, otherwise false.
    */
    contains: function (x, y) {
        return Phaser.Circle.contains(this, x, y);
    },

    /**
    * Returns a Point object containing the coordinates of a point on the circumference of the Circle based on the given angle.
    * @method circumferencePoint
    * @param {Number} angle The angle in radians (unless asDegrees is true) to return the point from.
    * @param {bool} asDegrees Is the given angle in radians (false) or degrees (true)?
    * @param {Phaser.Point} [optional] output An optional Point object to put the result in to. If none specified a new Point object will be created.
    * @return {Phaser.Point} The Point object holding the result.
    */
    circumferencePoint: function (angle, asDegrees, out) {
        return Phaser.Circle.circumferencePoint(this, angle, asDegrees, out);
    },

    /**
    * Adjusts the location of the Circle object, as determined by its center coordinate, by the specified amounts.
    * @method offset
    * @param {Number} dx Moves the x value of the Circle object by this amount.
    * @param {Number} dy Moves the y value of the Circle object by this amount.
    * @return {Circle} This Circle object.
    **/
    offset: function (dx, dy) {
        this.x += dx;
        this.y += dy;
        return this;
    },

    /**
    * Adjusts the location of the Circle object using a Point object as a parameter. This method is similar to the Circle.offset() method, except that it takes a Point object as a parameter.
    * @method offsetPoint
    * @param {Point} point A Point object to use to offset this Circle object (or any valid object with exposed x and y properties).
    * @return {Circle} This Circle object.
    **/
    offsetPoint: function (point) {
        return this.offset(point.x, point.y);
    },

    /**
    * Returns a string representation of this object.
    * @method toString
    * @return {string} a string representation of the instance.
    **/
    toString: function () {
        return "[{Phaser.Circle (x=" + this.x + " y=" + this.y + " diameter=" + this.diameter + " radius=" + this.radius + ")}]";
    }

};

//  Getters / Setters

Object.defineProperty(Phaser.Circle.prototype, "diameter", {

    /**
    * The diameter of the circle. The largest distance between any two points on the circle. The same as the radius * 2.
    * @method diameter
    * @return {Number}
    **/
    get: function () {
        return this._diameter;
    },

    /**
    * The diameter of the circle. The largest distance between any two points on the circle. The same as the radius * 2.
    * @method diameter
    * @param {Number} The diameter of the circle.
    **/
    set: function (value) {
        if (value > 0) {
            this._diameter = value;
            this._radius = value * 0.5;
        }
    }

});

Object.defineProperty(Phaser.Circle.prototype, "radius", {
    
    /**
    * The radius of the circle. The length of a line extending from the center of the circle to any point on the circle itself. The same as half the diameter.
    * @method radius
    * @return {Number}
    **/
    get: function () {
        return this._radius;
    },

    /**
    * The radius of the circle. The length of a line extending from the center of the circle to any point on the circle itself. The same as half the diameter.
    * @method radius
    * @param {Number} The radius of the circle.
    **/
    set: function (value) {
        if (value > 0) {
            this._radius = value;
            this._diameter = value * 2;
        }
    }

});

Object.defineProperty(Phaser.Circle.prototype, "left", {
    
    /**
    * The x coordinate of the leftmost point of the circle. Changing the left property of a Circle object has no effect on the x and y properties. However it does affect the diameter, whereas changing the x value does not affect the diameter property.
    * @method left
    * @return {Number} The x coordinate of the leftmost point of the circle.
    **/
    get: function () {
        return this.x - this._radius;
    },

    /**
    * The x coordinate of the leftmost point of the circle. Changing the left property of a Circle object has no effect on the x and y properties. However it does affect the diameter, whereas changing the x value does not affect the diameter property.
    * @method left
    * @param {Number} The value to adjust the position of the leftmost point of the circle by.
    **/
    set: function (value) {
        if (value > this.x) {
            this._radius = 0;
            this._diameter = 0;
        } else {
            this.radius = this.x - value;
        }
    }

});

Object.defineProperty(Phaser.Circle.prototype, "right", {

    /**
    * The x coordinate of the rightmost point of the circle. Changing the right property of a Circle object has no effect on the x and y properties. However it does affect the diameter, whereas changing the x value does not affect the diameter property.
    * @method right
    * @return {Number}
    **/
    get: function () {
        return this.x + this._radius;
    },

    /**
    * The x coordinate of the rightmost point of the circle. Changing the right property of a Circle object has no effect on the x and y properties. However it does affect the diameter, whereas changing the x value does not affect the diameter property.
    * @method right
    * @param {Number} The amount to adjust the diameter of the circle by.
    **/
    set: function (value) {
        if (value < this.x) {
            this._radius = 0;
            this._diameter = 0;
        } else {
            this.radius = value - this.x;
        }
    }

});

Object.defineProperty(Phaser.Circle.prototype, "top", {

    /**
    * The sum of the y minus the radius property. Changing the top property of a Circle object has no effect on the x and y properties, but does change the diameter.
    * @method bottom
    * @return {Number}
    **/
    get: function () {
        return this.y - this._radius;
    },
    
    /**
    * The sum of the y minus the radius property. Changing the top property of a Circle object has no effect on the x and y properties, but does change the diameter.
    * @method bottom
    * @param {Number} The amount to adjust the height of the circle by.
    **/
    set: function (value) {
        if (value > this.y) {
            this._radius = 0;
            this._diameter = 0;
        } else {
            this.radius = this.y - value;
        }
    }

});

Object.defineProperty(Phaser.Circle.prototype, "bottom", {

    /**
    * The sum of the y and radius properties. Changing the bottom property of a Circle object has no effect on the x and y properties, but does change the diameter.
    * @method bottom
    * @return {Number}
    **/
    get: function () {
        return this.y + this._radius;
    },

    /**
    * The sum of the y and radius properties. Changing the bottom property of a Circle object has no effect on the x and y properties, but does change the diameter.
    * @method bottom
    * @param {Number} The value to adjust the height of the circle by.
    **/
    set: function (value) {

        if (value < this.y) {
            this._radius = 0;
            this._diameter = 0;
        } else {
            this.radius = value - this.y;
        }
    }

});

Object.defineProperty(Phaser.Circle.prototype, "area", {

    /**
    * Gets the area of this Circle.
    * @method area
    * @return {Number} This area of this circle.
    **/
    get: function () {
        if (this._radius > 0) {
            return Math.PI * this._radius * this._radius;
        } else {
            return 0;
        }
    }

});

Object.defineProperty(Phaser.Circle.prototype, "empty", {

    /**
    * Determines whether or not this Circle object is empty.
    * @method empty
    * @return {bool} A value of true if the Circle objects diameter is less than or equal to 0; otherwise false.
    **/
    get: function () {
        return (this._diameter == 0);
    },

    /**
    * Sets all of the Circle objects properties to 0. A Circle object is empty if its diameter is less than or equal to 0.
    * @method setEmpty
    * @return {Circle} This Circle object
    **/
    set: function (value) {
        this.setTo(0, 0, 0);
    }

});

//  Statics

/**
* Return true if the given x/y coordinates are within the Circle object.
* @method contains
* @param {Phaser.Circle} a The Circle to be checked.
* @param {Number} x The X value of the coordinate to test.
* @param {Number} y The Y value of the coordinate to test.
* @return {bool} True if the coordinates are within this circle, otherwise false.
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
* @method equals
* @param {Phaser.Circle} a The first Circle object.
* @param {Phaser.Circle} b The second Circle object.
* @return {bool} A value of true if the object has exactly the same values for the x, y and diameter properties as this Circle object; otherwise false.
*/
Phaser.Circle.equals = function (a, b) {
    return (a.x == b.x && a.y == b.y && a.diameter == b.diameter);
};

/**
* Determines whether the two Circle objects intersect.
* This method checks the radius distances between the two Circle objects to see if they intersect.
* @method intersects
* @param {Phaser.Circle} a The first Circle object.
* @param {Phaser.Circle} b The second Circle object.
* @return {bool} A value of true if the specified object intersects with this Circle object; otherwise false.
*/
Phaser.Circle.intersects = function (a, b) {
    return (Phaser.Math.distance(a.x, a.y, b.x, b.y) <= (a.radius + b.radius));
};

/**
* Returns a Point object containing the coordinates of a point on the circumference of the Circle based on the given angle.
* @method circumferencePoint
* @param {Phaser.Circle} a The first Circle object.
* @param {Number} angle The angle in radians (unless asDegrees is true) to return the point from.
* @param {bool} asDegrees Is the given angle in radians (false) or degrees (true)?
* @param {Phaser.Point} [optional] output An optional Point object to put the result in to. If none specified a new Point object will be created.
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
* @method intersectsRectangle
* @param {Phaser.Circle} c The Circle object to test.
* @param {Phaser.Rectangle} r The Rectangle object to test.
* @return {bool} True if the two objects intersect, otherwise false.
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
* Phaser - Point
*
* The Point object represents a location in a two-dimensional coordinate system, where x represents the horizontal axis and y represents the vertical axis.
*
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
* @module       Phaser
*/

/**
* Creates a new Point. If you pass no parameters a Point is created set to (0,0).
* @class Point
* @constructor
* @param {Number} x The horizontal position of this Point (default 0)
* @param {Number} y The vertical position of this Point (default 0)
**/
Phaser.Point = function (x, y) {

    x = x || 0;
    y = y || 0;

    this.x = x;
    this.y = y;

};

Phaser.Point.prototype = {

    /**
    * Copies the x and y properties from any given object to this Point.
    * @method copyFrom
    * @param {any} source - The object to copy from.
    * @return {Point} This Point object.
    **/
    copyFrom: function (source) {
        return this.setTo(source.x, source.y);
    },

    /**
    * Inverts the x and y values of this Point
    * @method invert
    * @return {Point} This Point object.
    **/
    invert: function () {
        return this.setTo(this.y, this.x);
    },

    /**
    * Sets the x and y values of this Point object to the given coordinates.
    * @method setTo
    * @param {Number} x - The horizontal position of this point.
    * @param {Number} y - The vertical position of this point.
    * @return {Point} This Point object. Useful for chaining method calls.
    **/        
    setTo: function (x, y) {
        this.x = x;
        this.y = y;
        return this;
    },

    add: function (x, y) {

        this.x += x;
        this.y += y;
        return this;

    },

    subtract: function (x, y) {

        this.x -= x;
        this.y -= y;
        return this;

    },

    multiply: function (x, y) {

        this.x *= x;
        this.y *= y;
        return this;

    },

    divide: function (x, y) {

        this.x /= x;
        this.y /= y;
        return this;

    },

    /**
    * Clamps the x value of this Point to be between the given min and max
    * @method clampX
    * @param {Number} min The minimum value to clamp this Point to
    * @param {Number} max The maximum value to clamp this Point to
    * @return {Phaser.Point} This Point object.
    */
    clampX: function (min, max) {

        this.x = Phaser.Math.clamp(this.x, min, max);
        return this;
        
    },

    /**
    * Clamps the y value of this Point to be between the given min and max
    * @method clampY
    * @param {Number} min The minimum value to clamp this Point to
    * @param {Number} max The maximum value to clamp this Point to
    * @return {Phaser.Point} This Point object.
    */
    clampY: function (min, max) {

        this.y = Phaser.Math.clamp(this.y, min, max);
        return this;
        
    },

    /**
    * Clamps this Point object values to be between the given min and max
    * @method clamp
    * @param {Number} min The minimum value to clamp this Point to
    * @param {Number} max The maximum value to clamp this Point to
    * @return {Phaser.Point} This Point object.
    */
    clamp: function (min, max) {

        this.x = Phaser.Math.clamp(this.x, min, max);
        this.y = Phaser.Math.clamp(this.y, min, max);
        return this;

    },

    /**
    * Creates a copy of the given Point.
    * @method clone
    * @param {Phaser.Point} output Optional Point object. If given the values will be set into this object, otherwise a brand new Point object will be created and returned.
    * @return {Phaser.Point} The new Point object.
    */
    clone: function (output) {

        if (typeof output === "undefined") { output = new Phaser.Point; }

        return output.setTo(this.x, this.y);

    },

    /**
    * Copies the x and y properties from any given object to this Point.
    * @method copyFrom
    * @param {any} source - The object to copy from.
    * @return {Point} This Point object.
    **/
    copyFrom: function (source) {
        return this.setTo(source.x, source.y);
    },

    /**
    * Copies the x and y properties from this Point to any given object.
    * @method copyTo
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
    * @method distance
    * @param {object} dest The target object. Must have visible x and y properties that represent the center of the object.
    * @param {bool} [optional] round Round the distance to the nearest integer (default false)
    * @return {Number} The distance between this Point object and the destination Point object.
    */
    distance: function (dest, round) {

        return Phaser.Point.distance(this, dest, round);
        
    },

    /**
    * Determines whether the given objects x/y values are equal to this Point object.
    * @method equals
    * @param {Phaser.Point} a The first object to compare.
    * @return {bool} A value of true if the Points are equal, otherwise false.
    */
    equals: function (a) {
        return (a.x == this.x && a.y == this.y);
    },

    /**
    * Rotates this Point around the x/y coordinates given to the desired angle.
    * @method rotate
    * @param {Number} x The x coordinate of the anchor point
    * @param {Number} y The y coordinate of the anchor point
    * @param {Number} angle The angle in radians (unless asDegrees is true) to rotate the Point to.
    * @param {bool} asDegrees Is the given rotation in radians (false) or degrees (true)?
    * @param {Number} distance An optional distance constraint between the Point and the anchor.
    * @return {Phaser.Point} The modified point object
    */
    rotate: function (x, y, angle, asDegrees, distance) {
        return Phaser.Point.rotate(this, x, y, angle, asDegrees, distance);
    },

    /**
    * Returns a string representation of this object.
    * @method toString
    * @return {string} a string representation of the instance.
    **/
    toString: function () {
        return '[{Point (x=' + this.x + ' y=' + this.y + ')}]';
    }

};

//  Statics

/**
* Adds the coordinates of two points together to create a new point.
* @method add
* @param {Phaser.Point} a The first Point object.
* @param {Phaser.Point} b The second Point object.
* @param {Phaser.Point} out Optional Point to store the value in, if not supplied a new Point object will be created.
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
* @method subtract
* @param {Phaser.Point} a The first Point object.
* @param {Phaser.Point} b The second Point object.
* @param {Phaser.Point} out Optional Point to store the value in, if not supplied a new Point object will be created.
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
* @method subtract
* @param {Phaser.Point} a The first Point object.
* @param {Phaser.Point} b The second Point object.
* @param {Phaser.Point} out Optional Point to store the value in, if not supplied a new Point object will be created.
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
* @method subtract
* @param {Phaser.Point} a The first Point object.
* @param {Phaser.Point} b The second Point object.
* @param {Phaser.Point} out Optional Point to store the value in, if not supplied a new Point object will be created.
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
* @method equals
* @param {Phaser.Point} a The first Point object.
* @param {Phaser.Point} b The second Point object.
* @return {bool} A value of true if the Points are equal, otherwise false.
*/
Phaser.Point.equals = function (a, b) {
    return (a.x == b.x && a.y == b.y);
};

/**
* Returns the distance of this Point object to the given object (can be a Circle, Point or anything with x/y properties)
* @method distance
* @param {object} a The target object. Must have visible x and y properties that represent the center of the object.
* @param {object} b The target object. Must have visible x and y properties that represent the center of the object.
* @param {bool} [optional] round Round the distance to the nearest integer (default false)
* @return {Number} The distance between this Point object and the destination Point object.
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
* @method rotate
* @param {Phaser.Point} a The Point object to rotate.
* @param {Number} x The x coordinate of the anchor point
* @param {Number} y The y coordinate of the anchor point
* @param {Number} angle The angle in radians (unless asDegrees is true) to rotate the Point to.
* @param {bool} asDegrees Is the given rotation in radians (false) or degrees (true)?
* @param {Number} distance An optional distance constraint between the Point and the anchor.
* @return {Phaser.Point} The modified point object
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
* Creates a new Rectangle object with the top-left corner specified by the x and y parameters and with the specified width and height parameters. If you call this function without parameters, a Rectangle with x, y, width, and height properties set to 0 is created.
*
* @class Rectangle
* @constructor
* @param {Number} x The x coordinate of the top-left corner of the Rectangle.
* @param {Number} y The y coordinate of the top-left corner of the Rectangle.
* @param {Number} width The width of the Rectangle in pixels.
* @param {Number} height The height of the Rectangle in pixels.
* @return {Rectangle} This Rectangle object
**/
Phaser.Rectangle = function (x, y, width, height) {

    x = x || 0;
    y = y || 0;
    width = width || 0;
    height = height || 0;

    /**
     * @property x
     * @type Number
     * @default 0
     */
    this.x = x;
    
    /**
     * @property y
     * @type Number
     * @default 0
     */
    this.y = y;
    
    /**
     * @property width
     * @type Number
     * @default 0
     */
    this.width = width;
    
    /**
     * @property height
     * @type Number
     * @default 0
     */
    this.height = height;

};

Phaser.Rectangle.prototype = {

    /**
    * Adjusts the location of the Rectangle object, as determined by its top-left corner, by the specified amounts.
    * @method offset
    * @param {Number} dx Moves the x value of the Rectangle object by this amount.
    * @param {Number} dy Moves the y value of the Rectangle object by this amount.
    * @return {Rectangle} This Rectangle object.
    **/
    offset: function (dx, dy) {

        this.x += dx;
        this.y += dy;

        return this;

    },
 
    /**
    * Adjusts the location of the Rectangle object using a Point object as a parameter. This method is similar to the Rectangle.offset() method, except that it takes a Point object as a parameter.
    * @method offsetPoint
    * @param {Point} point A Point object to use to offset this Rectangle object.
    * @return {Rectangle} This Rectangle object.
    **/
    offsetPoint: function (point) {
        return this.offset(point.x, point.y);
    },
 
    /**
    * Sets the members of Rectangle to the specified values.
    * @method setTo
    * @param {Number} x The x coordinate of the top-left corner of the Rectangle.
    * @param {Number} y The y coordinate of the top-left corner of the Rectangle.
    * @param {Number} width The width of the Rectangle in pixels.
    * @param {Number} height The height of the Rectangle in pixels.
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
    * @method floor
    **/
    floor: function () {

        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);

    },
 
    /**
    * Copies the x, y, width and height properties from any given object to this Rectangle.
    * @method copyFrom
    * @param {any} source - The object to copy from.
    * @return {Rectangle} This Rectangle object.
    **/
    copyFrom: function (source) {
        return this.setTo(source.x, source.y, source.width, source.height);
    },

    /**
    * Copies the x, y, width and height properties from this Rectangle to any given object.
    * @method copyTo
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
    * @method inflate
    * @param {Number} dx The amount to be added to the left side of the Rectangle.
    * @param {Number} dy The amount to be added to the bottom side of the Rectangle.
    * @return {Phaser.Rectangle} This Rectangle object.
    */
    inflate: function (dx, dy) {
        return Phaser.Rectangle.inflate(this, dx, dy);
    },

    /**
    * The size of the Rectangle object, expressed as a Point object with the values of the width and height properties.
    * @method size
    * @param {Phaser.Point} output Optional Point object. If given the values will be set into the object, otherwise a brand new Point object will be created and returned.
    * @return {Phaser.Point} The size of the Rectangle object
    */
    size: function (output) {
        return Phaser.Rectangle.size(this, output);
    },

    /**
    * Returns a new Rectangle object with the same values for the x, y, width, and height properties as the original Rectangle object.
    * @method clone
    * @param {Phaser.Rectangle} output Optional Rectangle object. If given the values will be set into the object, otherwise a brand new Rectangle object will be created and returned.
    * @return {Phaser.Rectangle}
    */
    clone: function (output) {
        return Phaser.Rectangle.clone(this, output);
    },

    /**
    * Determines whether the specified coordinates are contained within the region defined by this Rectangle object.
    * @method contains
    * @param {Number} x The x coordinate of the point to test.
    * @param {Number} y The y coordinate of the point to test.
    * @return {bool} A value of true if the Rectangle object contains the specified point; otherwise false.
    */
    contains: function (x, y) {
        return Phaser.Rectangle.contains(this, x, y);
    },

    /**
    * Determines whether the first Rectangle object is fully contained within the second Rectangle object.
    * A Rectangle object is said to contain another if the second Rectangle object falls entirely within the boundaries of the first.
    * @method containsRect
    * @param {Phaser.Rectangle} b The second Rectangle object.
    * @return {bool} A value of true if the Rectangle object contains the specified point; otherwise false.
    */
    containsRect: function (b) {
        return Phaser.Rectangle.containsRect(this, b);
    },

    /**
    * Determines whether the two Rectangles are equal.
    * This method compares the x, y, width and height properties of each Rectangle.
    * @method equals
    * @param {Phaser.Rectangle} b The second Rectangle object.
    * @return {bool} A value of true if the two Rectangles have exactly the same values for the x, y, width and height properties; otherwise false.
    */
    equals: function (b) {
        return Phaser.Rectangle.equals(this, b);
    },

    /**
    * If the Rectangle object specified in the toIntersect parameter intersects with this Rectangle object, returns the area of intersection as a Rectangle object. If the Rectangles do not intersect, this method returns an empty Rectangle object with its properties set to 0.
    * @method intersection
    * @param {Phaser.Rectangle} b The second Rectangle object.
    * @param {Phaser.Rectangle} output Optional Rectangle object. If given the intersection values will be set into this object, otherwise a brand new Rectangle object will be created and returned.
    * @return {Phaser.Rectangle} A Rectangle object that equals the area of intersection. If the Rectangles do not intersect, this method returns an empty Rectangle object; that is, a Rectangle with its x, y, width, and height properties set to 0.
    */
    intersection: function (b, out) {
        return Phaser.Rectangle.intersection(this, b, output);
    },

    /**
    * Determines whether the two Rectangles intersect with each other.
    * This method checks the x, y, width, and height properties of the Rectangles.
    * @method intersects
    * @param {Phaser.Rectangle} b The second Rectangle object.
    * @param {Number} tolerance A tolerance value to allow for an intersection test with padding, default to 0
    * @return {bool} A value of true if the specified object intersects with this Rectangle object; otherwise false.
    */
    intersects: function (b, tolerance) {
        return Phaser.Rectangle.intersects(this, b, tolerance);
    },

    /**
    * Determines whether the object specified intersects (overlaps) with the given values.
    * @method intersectsRaw
    * @param {Number} left
    * @param {Number} right
    * @param {Number} top
    * @param {Number} bottomt
    * @param {Number} tolerance A tolerance value to allow for an intersection test with padding, default to 0
    * @return {bool} A value of true if the specified object intersects with the Rectangle; otherwise false.
    */
    intersectsRaw: function (left, right, top, bottom, tolerance) {
        return Phaser.Rectangle.intersectsRaw(this, left, right, top, bottom, tolerance);
    },

    /**
    * Adds two Rectangles together to create a new Rectangle object, by filling in the horizontal and vertical space between the two Rectangles.
    * @method union
    * @param {Phaser.Rectangle} b The second Rectangle object.
    * @param {Phaser.Rectangle} output Optional Rectangle object. If given the new values will be set into this object, otherwise a brand new Rectangle object will be created and returned.
    * @return {Phaser.Rectangle} A Rectangle object that is the union of the two Rectangles.
    */
    union: function (b, out) {
        return Phaser.Rectangle.union(this, b, out);
    },

    /**
    * Returns a string representation of this object.
    * @method toString
    * @return {string} a string representation of the instance.
    **/
    toString: function () {
        return "[{Rectangle (x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + " empty=" + this.empty + ")}]";
    }

};

//  Getters / Setters

Object.defineProperty(Phaser.Rectangle.prototype, "halfWidth", {

    /**
    * Half of the width of the Rectangle
    * @property halfWidth
    * @type Number
    **/
    get: function () {
        return Math.round(this.width / 2);
    }

});

Object.defineProperty(Phaser.Rectangle.prototype, "halfHeight", {

    /**
    * Half of the height of the Rectangle
    * @property halfHeight
    * @type Number
    **/
    get: function () {
        return Math.round(this.height / 2);
    }

});

Object.defineProperty(Phaser.Rectangle.prototype, "bottom", {
    
    /**
    * The sum of the y and height properties. Changing the bottom property of a Rectangle object has no effect on the x, y and width properties, but does change the height property.
    * @method bottom
    * @return {Number}
    **/
    get: function () {
        return this.y + this.height;
    },

    /**
    * The sum of the y and height properties. Changing the bottom property of a Rectangle object has no effect on the x, y and width properties, but does change the height property.
    * @method bottom
    * @param {Number} value
    **/    
    set: function (value) {
        if (value <= this.y) {
            this.height = 0;
        } else {
            this.height = (this.y - value);
        }
    }

});

Object.defineProperty(Phaser.Rectangle.prototype, "bottomRight", {
    
    /**
    * Get the location of the Rectangles bottom right corner as a Point object.
    * @return {Phaser.Point} The new Point object.
    */
    get: function () {
        return new Phaser.Point(this.right, this.bottom);
    },

    /**
    * Sets the bottom-right corner of the Rectangle, determined by the values of the given Point object.
    * @method bottomRight
    * @param {Point} value
    **/
    set: function (value) {
        this.right = value.x;
        this.bottom = value.y;
    }

});

Object.defineProperty(Phaser.Rectangle.prototype, "left", {

    /**
    * The x coordinate of the left of the Rectangle. Changing the left property of a Rectangle object has no effect on the y and height properties. However it does affect the width property, whereas changing the x value does not affect the width property.
    * @method left
    * @ return {number}
    **/    
    get: function () {
        return this.x;
    },

    /**
    * The x coordinate of the left of the Rectangle. Changing the left property of a Rectangle object has no effect on the y and height properties.
    * However it does affect the width, whereas changing the x value does not affect the width property.
    * @method left
    * @param {Number} value
    **/
    set: function (value) {
        if (value >= this.right) {
            this.width = 0;
        } else {
            this.width = this.right - value;
        }
        this.x = value;
    }

});

Object.defineProperty(Phaser.Rectangle.prototype, "right", {
    
    /**
    * The sum of the x and width properties. Changing the right property of a Rectangle object has no effect on the x, y and height properties.
    * However it does affect the width property.
    * @method right
    * @return {Number}
    **/    
    get: function () {
        return this.x + this.width;
    },

    /**
    * The sum of the x and width properties. Changing the right property of a Rectangle object has no effect on the x, y and height properties.
    * However it does affect the width property.
    * @method right
    * @param {Number} value
    **/
    set: function (value) {
        if (value <= this.x) {
            this.width = 0;
        } else {
            this.width = this.x + value;
        }
    }

});

Object.defineProperty(Phaser.Rectangle.prototype, "volume", {

    /**
    * The volume of the Rectangle derived from width * height
    * @method volume
    * @return {Number}
    **/    
    get: function () {
        return this.width * this.height;
    }

});

Object.defineProperty(Phaser.Rectangle.prototype, "perimeter", {
    
    /**
    * The perimeter size of the Rectangle. This is the sum of all 4 sides.
    * @method perimeter
    * @return {Number}
    **/
    get: function () {
        return (this.width * 2) + (this.height * 2);
    }

});

Object.defineProperty(Phaser.Rectangle.prototype, "centerX", {
    
    /**
    * The x coordinate of the center of the Rectangle.
    * @method centerX
    * @return {Number}
    **/
    get: function () {
        return this.x + this.halfWidth;
    },

    /**
    * The x coordinate of the center of the Rectangle.
    * @method centerX
    * @param {Number} value
    **/
    set: function (value) {
        this.x = value - this.halfWidth;
    }

});

Object.defineProperty(Phaser.Rectangle.prototype, "centerY", {
    
    /**
    * The y coordinate of the center of the Rectangle.
    * @method centerY
    * @return {Number}
    **/
    get: function () {
        return this.y + this.halfHeight;
    },

    /**
    * The y coordinate of the center of the Rectangle.
    * @method centerY
    * @param {Number} value
    **/
    set: function (value) {
        this.y = value - this.halfHeight;
    }

});

Object.defineProperty(Phaser.Rectangle.prototype, "top", {
    
    /**
    * The y coordinate of the top of the Rectangle. Changing the top property of a Rectangle object has no effect on the x and width properties.
    * However it does affect the height property, whereas changing the y value does not affect the height property.
    * @method top
    * @return {Number}
    **/
    get: function () {
        return this.y;
    },

    /**
    * The y coordinate of the top of the Rectangle. Changing the top property of a Rectangle object has no effect on the x and width properties.
    * However it does affect the height property, whereas changing the y value does not affect the height property.
    * @method top
    * @param {Number} value
    **/
    set: function (value) {
        if (value >= this.bottom) {
            this.height = 0;
            this.y = value;
        } else {
            this.height = (this.bottom - value);
        }
    }

});

Object.defineProperty(Phaser.Rectangle.prototype, "topLeft", {

    /**
    * Get the location of the Rectangles top left corner as a Point object.
    * @return {Phaser.Point} The new Point object.
    */
    get: function () {
        return new Phaser.Point(this.x, this.y);
    },

    /**
    * The location of the Rectangles top-left corner, determined by the x and y coordinates of the Point.
    * @method topLeft
    * @param {Point} value
    **/    
    set: function (value) {
        this.x = value.x;
        this.y = value.y;
    }

});

Object.defineProperty(Phaser.Rectangle.prototype, "empty", {
    
    /**
    * Determines whether or not this Rectangle object is empty.
    * @method isEmpty
    * @return {bool} A value of true if the Rectangle objects width or height is less than or equal to 0; otherwise false.
    **/
    get: function () {
        return (!this.width || !this.height);
    },

    /**
    * Sets all of the Rectangle object's properties to 0. A Rectangle object is empty if its width or height is less than or equal to 0.
    * @method setEmpty
    * @return {Rectangle} This Rectangle object
    **/
    set: function (value) {
        this.setTo(0, 0, 0, 0);
    }

});

//  Statics

/**
* Increases the size of the Rectangle object by the specified amounts. The center point of the Rectangle object stays the same, and its size increases to the left and right by the dx value, and to the top and the bottom by the dy value.
* @method inflate
* @param {Phaser.Rectangle} a The Rectangle object.
* @param {Number} dx The amount to be added to the left side of the Rectangle.
* @param {Number} dy The amount to be added to the bottom side of the Rectangle.
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
* @method inflatePoint
* @param {Phaser.Rectangle} a The Rectangle object.
* @param {Phaser.Point} point The x property of this Point object is used to increase the horizontal dimension of the Rectangle object. The y property is used to increase the vertical dimension of the Rectangle object.
* @return {Phaser.Rectangle} The Rectangle object.
*/
Phaser.Rectangle.inflatePoint = function (a, point) {
    return Phaser.Phaser.Rectangle.inflate(a, point.x, point.y);
};

/**
* The size of the Rectangle object, expressed as a Point object with the values of the width and height properties.
* @method size
* @param {Phaser.Rectangle} a The Rectangle object.
* @param {Phaser.Point} output Optional Point object. If given the values will be set into the object, otherwise a brand new Point object will be created and returned.
* @return {Phaser.Point} The size of the Rectangle object
*/
Phaser.Rectangle.size = function (a, output) {
    if (typeof output === "undefined") { output = new Phaser.Point(); }
    return output.setTo(a.width, a.height);
};

/**
* Returns a new Rectangle object with the same values for the x, y, width, and height properties as the original Rectangle object.
* @method clone
* @param {Phaser.Rectangle} a The Rectangle object.
* @param {Phaser.Rectangle} output Optional Rectangle object. If given the values will be set into the object, otherwise a brand new Rectangle object will be created and returned.
* @return {Phaser.Rectangle}
*/
Phaser.Rectangle.clone = function (a, output) {
    if (typeof output === "undefined") { output = new Phaser.Rectangle(); }
    return output.setTo(a.x, a.y, a.width, a.height);
};

/**
* Determines whether the specified coordinates are contained within the region defined by this Rectangle object.
* @method contains
* @param {Phaser.Rectangle} a The Rectangle object.
* @param {Number} x The x coordinate of the point to test.
* @param {Number} y The y coordinate of the point to test.
* @return {bool} A value of true if the Rectangle object contains the specified point; otherwise false.
*/
Phaser.Rectangle.contains = function (a, x, y) {
    return (x >= a.x && x <= a.right && y >= a.y && y <= a.bottom);
};

/**
* Determines whether the specified point is contained within the rectangular region defined by this Rectangle object. This method is similar to the Rectangle.contains() method, except that it takes a Point object as a parameter.
* @method containsPoint
* @param {Phaser.Rectangle} a The Rectangle object.
* @param {Phaser.Point} point The point object being checked. Can be Point or any object with .x and .y values.
* @return {bool} A value of true if the Rectangle object contains the specified point; otherwise false.
*/
Phaser.Rectangle.containsPoint = function (a, point) {
    return Phaser.Phaser.Rectangle.contains(a, point.x, point.y);
};

/**
* Determines whether the first Rectangle object is fully contained within the second Rectangle object.
* A Rectangle object is said to contain another if the second Rectangle object falls entirely within the boundaries of the first.
* @method containsRect
* @param {Phaser.Rectangle} a The first Rectangle object.
* @param {Phaser.Rectangle} b The second Rectangle object.
* @return {bool} A value of true if the Rectangle object contains the specified point; otherwise false.
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
* @method equals
* @param {Phaser.Rectangle} a The first Rectangle object.
* @param {Phaser.Rectangle} b The second Rectangle object.
* @return {bool} A value of true if the two Rectangles have exactly the same values for the x, y, width and height properties; otherwise false.
*/
Phaser.Rectangle.equals = function (a, b) {
    return (a.x == b.x && a.y == b.y && a.width == b.width && a.height == b.height);
};

/**
* If the Rectangle object specified in the toIntersect parameter intersects with this Rectangle object, returns the area of intersection as a Rectangle object. If the Rectangles do not intersect, this method returns an empty Rectangle object with its properties set to 0.
* @method intersection
* @param {Phaser.Rectangle} a The first Rectangle object.
* @param {Phaser.Rectangle} b The second Rectangle object.
* @param {Phaser.Rectangle} output Optional Rectangle object. If given the intersection values will be set into this object, otherwise a brand new Rectangle object will be created and returned.
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
* @method intersects
* @param {Phaser.Rectangle} a The first Rectangle object.
* @param {Phaser.Rectangle} b The second Rectangle object.
* @param {Number} tolerance A tolerance value to allow for an intersection test with padding, default to 0
* @return {bool} A value of true if the specified object intersects with this Rectangle object; otherwise false.
*/
Phaser.Rectangle.intersects = function (a, b, tolerance) {

    tolerance = tolerance || 0;

    return !(a.left > b.right + tolerance || a.right < b.left - tolerance || a.top > b.bottom + tolerance || a.bottom < b.top - tolerance);

};

/**
* Determines whether the object specified intersects (overlaps) with the given values.
* @method intersectsRaw
* @param {Number} left
* @param {Number} right
* @param {Number} top
* @param {Number} bottomt
* @param {Number} tolerance A tolerance value to allow for an intersection test with padding, default to 0
* @return {bool} A value of true if the specified object intersects with the Rectangle; otherwise false.
*/
Phaser.Rectangle.intersectsRaw = function (a, left, right, top, bottom, tolerance) {

    if (typeof tolerance === "undefined") { tolerance = 0; }

    return !(left > a.right + tolerance || right < a.left - tolerance || top > a.bottom + tolerance || bottom < a.top - tolerance);

};

/**
* Adds two Rectangles together to create a new Rectangle object, by filling in the horizontal and vertical space between the two Rectangles.
* @method union
* @param {Phaser.Rectangle} a The first Rectangle object.
* @param {Phaser.Rectangle} b The second Rectangle object.
* @param {Phaser.Rectangle} output Optional Rectangle object. If given the new values will be set into this object, otherwise a brand new Rectangle object will be created and returned.
* @return {Phaser.Rectangle} A Rectangle object that is the union of the two Rectangles.
*/
Phaser.Rectangle.union = function (a, b, out) {

    if (typeof out === "undefined") { out = new Phaser.Rectangle(); }

    return out.setTo(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.max(a.right, b.right), Math.max(a.bottom, b.bottom));
    
};

Phaser.Net = function (game) {
	
	this.game = game;

};

Phaser.Net.prototype = {

	/**
	* Returns the hostname given by the browser.
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
	*/        
	checkDomainName: function (domain) {
		return window.location.hostname.indexOf(domain) !== -1;
	},

	/**
	* Updates a value on the Query String and returns it in full.
	* If the value doesn't already exist it is set.
	* If the value exists it is replaced with the new value given. If you don't provide a new value it is removed from the query string.
	* Optionally you can redirect to the new url, or just return it as a string.
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

	decodeURI: function (value) {
		return decodeURIComponent(value.replace(/\+/g, " "));
	}

};


/**
* Phaser - TweenManager
*
* Phaser.Game has a single instance of the TweenManager through which all Tween objects are created and updated.
* Tweens are hooked into the game clock and pause system, adjusting based on the game state.
*
* TweenManager is based heavily on tween.js by sole (http://soledadpenades.com).
* The difference being that tweens belong to a games instance of TweenManager, rather than to a global TWEEN object.
* It also has callbacks swapped for Signals and a few issues patched with regard to properties and completion errors.
* Please see https://github.com/sole/tween.js for a full list of contributors.
*/
Phaser.TweenManager = function (game) {

	this.game = game;
	this._tweens = [];

	this.game.onPause.add(this.pauseAll, this);
	this.game.onResume.add(this.resumeAll, this);

};

Phaser.TweenManager.prototype = {

	REVISION: '11dev',

	/**
	* Get all the tween objects in an array.
	* @return {Phaser.Tween[]} Array with all tween objects.
	*/
	getAll: function () {

		return this._tweens;

	},

	/**
	* Remove all tween objects.
	*/
	removeAll: function () {

		this._tweens = [];

	},

	/**
	* Add a new tween into the TweenManager.
	*
	* @param tween {Phaser.Tween} The tween object you want to add.
	* @return {Phaser.Tween} The tween object you added to the manager.
	*/
	add: function ( tween ) {

		this._tweens.push( tween );

	},

	/**
    * Create a tween object for a specific object. The object can be any JavaScript object or Phaser object such as Sprite.
    *
    * @param obj {object} Object the tween will be run on.
    * @return {Phaser.Tween} The newly created tween object.
    */
    create: function (object) {

        return new Phaser.Tween(object, this.game);

    },

	/**
	* Remove a tween from this manager.
	*
	* @param tween {Phaser.Tween} The tween object you want to remove.
	*/
	remove: function ( tween ) {

		var i = this._tweens.indexOf( tween );

		if ( i !== -1 ) {

			this._tweens.splice( i, 1 );

		}

	},

	/**
	* Update all the tween objects you added to this manager.
	*
	* @return {bool} Return false if there's no tween to update, otherwise return true.
	*/
	update: function () {

		if ( this._tweens.length === 0 ) return false;

		var i = 0, numTweens = this._tweens.length;

		while ( i < numTweens ) {

			if ( this._tweens[ i ].update( this.game.time.now ) ) {

				i++;

			} else {

				this._tweens.splice( i, 1 );

				numTweens--;

			}

		}

		return true;

	},

	/**
	* Pauses all currently running tweens.
	*/
    pauseAll: function () {

    	for (var i = this._tweens.length - 1; i >= 0; i--) {
    		this._tweens[i].pause();
    	};

    },

	/**
	* Pauses all currently paused tweens.
	*/
    resumeAll: function () {

    	for (var i = this._tweens.length - 1; i >= 0; i--) {
    		this._tweens[i].resume();
    	};

    }

};
/**
* Tween constructor
* Create a new <code>Tween</code>.
*
* @param object {object} Target object will be affected by this tween.
* @param game {Phaser.Game} Current game instance.
*/

Phaser.Tween = function (object, game) {

    /**
    * Reference to the target object.
    * @type {object}
    */
	this._object = object;

    this.game = game;
    this._manager = this.game.tweens;

	this._valuesStart = {};
	this._valuesEnd = {};
	this._valuesStartRepeat = {};
	this._duration = 1000;
	this._repeat = 0;
	this._yoyo = false;
	this._reversed = false;
	this._delayTime = 0;
	this._startTime = null;
	this._easingFunction = Phaser.Easing.Linear.None;
	this._interpolationFunction = Phaser.Math.linearInterpolation;
	this._chainedTweens = [];
	this._onStartCallback = null;
	this._onStartCallbackFired = false;
	this._onUpdateCallback = null;
	this._onCompleteCallback = null;

    this._pausedTime = 0;

	// Set all starting values present on the target object
	for ( var field in object ) {
		this._valuesStart[ field ] = parseFloat(object[field], 10);
	}

    this.onStart = new Phaser.Signal();
    this.onComplete = new Phaser.Signal();

    this.isRunning = false;

};

Phaser.Tween.prototype = {

	/**
	* Configure the Tween
	* @param properties {object} Propertis you want to tween.
	* @param [duration] {number} duration of this tween.
	* @param [ease] {any} Easing function.
	* @param [autoStart] {bool} Whether this tween will start automatically or not.
	* @param [delay] {number} delay before this tween will start, defaults to 0 (no delay)
	* @param [loop] {bool} Should the tween automatically restart once complete? (ignores any chained tweens)
	* @return {Tween} Itself.
	*/
	to: function ( properties, duration, ease, autoStart, delay, repeat, yoyo ) {

		duration = duration || 1000;
		ease = ease || null;
		autoStart = autoStart || false;
		delay = delay || 0;
		repeat = repeat || 0;
		yoyo = yoyo || false;

		this._repeat = repeat;
        this._duration = duration;
		this._valuesEnd = properties;

        if (ease !== null)
        {
            this._easingFunction = ease;
        }

        if (delay > 0)
        {
            this._delayTime = delay;
        }

        this._yoyo = yoyo;

        if (autoStart) {
            return this.start();
        } else {
            return this;
        }

	},

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

	stop: function () {

		this._manager.remove(this);
        this.isRunning = false;

		return this;

	},

	delay: function ( amount ) {

		this._delayTime = amount;
		return this;

	},

	repeat: function ( times ) {

		this._repeat = times;
		return this;

	},

	yoyo: function( yoyo ) {

		this._yoyo = yoyo;
		return this;

	},

	easing: function ( easing ) {

		this._easingFunction = easing;
		return this;

	},

	interpolation: function ( interpolation ) {

		this._interpolationFunction = interpolation;
		return this;

	},

	chain: function () {

		this._chainedTweens = arguments;
		return this;

	},

	onStart: function ( callback ) {

		this._onStartCallback = callback;
		return this;

	},

	onUpdate: function ( callback ) {

		this._onUpdateCallback = callback;
		return this;

	},

	onComplete: function ( callback ) {

		this._onCompleteCallback = callback;
		return this;

	},

    pause: function () {
        this._paused = true;
    },

    resume: function () {
        this._paused = false;
        this._startTime += this.game.time.pauseDuration;
    },

	update: function ( time ) {

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


Phaser.Easing = {

	Linear: {

		None: function ( k ) {

			return k;

		}

	},

	Quadratic: {

		In: function ( k ) {

			return k * k;

		},

		Out: function ( k ) {

			return k * ( 2 - k );

		},

		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1 ) return 0.5 * k * k;
			return - 0.5 * ( --k * ( k - 2 ) - 1 );

		}

	},

	Cubic: {

		In: function ( k ) {

			return k * k * k;

		},

		Out: function ( k ) {

			return --k * k * k + 1;

		},

		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k;
			return 0.5 * ( ( k -= 2 ) * k * k + 2 );

		}

	},

	Quartic: {

		In: function ( k ) {

			return k * k * k * k;

		},

		Out: function ( k ) {

			return 1 - ( --k * k * k * k );

		},

		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1) return 0.5 * k * k * k * k;
			return - 0.5 * ( ( k -= 2 ) * k * k * k - 2 );

		}

	},

	Quintic: {

		In: function ( k ) {

			return k * k * k * k * k;

		},

		Out: function ( k ) {

			return --k * k * k * k * k + 1;

		},

		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k * k * k;
			return 0.5 * ( ( k -= 2 ) * k * k * k * k + 2 );

		}

	},

	Sinusoidal: {

		In: function ( k ) {

			return 1 - Math.cos( k * Math.PI / 2 );

		},

		Out: function ( k ) {

			return Math.sin( k * Math.PI / 2 );

		},

		InOut: function ( k ) {

			return 0.5 * ( 1 - Math.cos( Math.PI * k ) );

		}

	},

	Exponential: {

		In: function ( k ) {

			return k === 0 ? 0 : Math.pow( 1024, k - 1 );

		},

		Out: function ( k ) {

			return k === 1 ? 1 : 1 - Math.pow( 2, - 10 * k );

		},

		InOut: function ( k ) {

			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( ( k *= 2 ) < 1 ) return 0.5 * Math.pow( 1024, k - 1 );
			return 0.5 * ( - Math.pow( 2, - 10 * ( k - 1 ) ) + 2 );

		}

	},

	Circular: {

		In: function ( k ) {

			return 1 - Math.sqrt( 1 - k * k );

		},

		Out: function ( k ) {

			return Math.sqrt( 1 - ( --k * k ) );

		},

		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1) return - 0.5 * ( Math.sqrt( 1 - k * k) - 1);
			return 0.5 * ( Math.sqrt( 1 - ( k -= 2) * k) + 1);

		}

	},

	Elastic: {

		In: function ( k ) {

			var s, a = 0.1, p = 0.4;
			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( !a || a < 1 ) { a = 1; s = p / 4; }
			else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
			return - ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );

		},

		Out: function ( k ) {

			var s, a = 0.1, p = 0.4;
			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( !a || a < 1 ) { a = 1; s = p / 4; }
			else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
			return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 );

		},

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

	Back: {

		In: function ( k ) {

			var s = 1.70158;
			return k * k * ( ( s + 1 ) * k - s );

		},

		Out: function ( k ) {

			var s = 1.70158;
			return --k * k * ( ( s + 1 ) * k + s ) + 1;

		},

		InOut: function ( k ) {

			var s = 1.70158 * 1.525;
			if ( ( k *= 2 ) < 1 ) return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) );
			return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 );

		}

	},

	Bounce: {

		In: function ( k ) {

			return 1 - TWEEN.Easing.Bounce.Out( 1 - k );

		},

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

		InOut: function ( k ) {

			if ( k < 0.5 ) return TWEEN.Easing.Bounce.In( k * 2 ) * 0.5;
			return TWEEN.Easing.Bounce.Out( k * 2 - 1 ) * 0.5 + 0.5;

		}

	}

};

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
* @module       Phaser.Time
*/

/**
* This is the core internal game clock. It manages the elapsed time and calculation of elapsed values,
* used for game object motion and tweens.
*
* @class Time
* @constructor
* @param {Phaser.Game} game A reference to the currently running game.
*/
Phaser.Time = function (game) {

	/**
	* A reference to the currently running Game.
	* @property game
	* @type {Phaser.Game}
	*/
	this.game = game;

	/**
	* The time at which the Game instance started.
	* @property _started
	* @private
	* @type {Number}
	*/
	this._started = 0;

	/**
	* The time (in ms) that the last second counter ticked over.
	* @property _timeLastSecond
	* @private
	* @type {Number}
	*/
	this._timeLastSecond = 0;

	/**
	* The time the game started being paused.
	* @property _pauseStarted
	* @private
	* @type {Number}
	*/
	this._pauseStarted = 0;

	/**
	* The elapsed time calculated for the physics motion updates.
	* @property physicsElapsed
	* @public
	* @type {Number}
	*/
	this.physicsElapsed = 0;

	/**
	* Game time counter.
	* @property time
	* @public
	* @type {Number}
	*/
	this.time = 0;

	/**
	* Records how long the game has been paused for. Is reset each time the game pauses.
	* @property pausedTime
	* @public
	* @type {Number}
	*/
	this.pausedTime = 0;

	/**
	* The time right now.
	* @property now
	* @public
	* @type {Number}
	*/
	this.now = 0;

	/**
	* Elapsed time since the last frame.
	* @property elapsed
	* @public
	* @type {Number}
	*/
	this.elapsed = 0;

	/**
	* Frames per second.
	* @property fps
	* @public
	* @type {Number}
	*/
	this.fps = 0;

	/**
	* The lowest rate the fps has dropped to.
	* @property fpsMin
	* @public
	* @type {Number}
	*/
	this.fpsMin = 1000;

	/**
	* The highest rate the fps has reached (usually no higher than 60fps).
	* @property fpsMax
	* @public
	* @type {Number}
	*/
	this.fpsMax = 0;

	/**
	* The minimum amount of time the game has taken between two frames.
	* @property msMin
	* @public
	* @type {Number}
	*/
	this.msMin = 1000;

	/**
	* The maximum amount of time the game has taken between two frames.
	* @property msMax
	* @public
	* @type {Number}
	*/
	this.msMax = 0;

	/**
	* The number of frames record in the last second.
	* @property frames
	* @public
	* @type {Number}
	*/
	this.frames = 0;

	/**
	* Records how long the game was paused for in miliseconds.
	* @property pauseDuration
	* @public
	* @type {Number}
	*/
	this.pauseDuration = 0;

	/**
	* The value that setTimeout needs to work out when to next update
	* @property timeToCall
	* @public
	* @type {Number}
	*/
	this.timeToCall = 0;

	/**
	* Internal value used by timeToCall as part of the setTimeout loop
	* @property lastTime
	* @public
	* @type {Number}
	*/
	this.lastTime = 0;

	//	Listen for game pause/resume events
	this.game.onPause.add(this.gamePaused, this);
	this.game.onResume.add(this.gameResumed, this);

	this._justResumed = false;

};

Phaser.Time.prototype = {

	/**
	* The number of seconds that have elapsed since the game was started.
	* @method totalElapsedSeconds
	* @return {Number}
	*/
	totalElapsedSeconds: function() {
		return (this.now - this._started) * 0.001;
	},

	/**
	* Updates the game clock and calculate the fps.
	* This is called automatically by Phaser.Game
	* @method update
	* @param {Number} time The current timestamp, either performance.now or Date.now depending on the browser
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

		//  Paused?
		if (this.game.paused)
		{
			this.pausedTime = this.now - this._pauseStarted;
		}

	},

	/**
	* Called when the game enters a paused state.
	* @method gamePaused
	* @private
	*/
	gamePaused: function () {
		
		this._pauseStarted = this.now;

	},

	/**
	* Called when the game resumes from a paused state.
	* @method gameResumed
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
	* @method elapsedSince
	* @param {Number} since The time you want to measure against.
	* @return {Number} The difference between the given time and now.
	*/
	elapsedSince: function (since) {
		return this.now - since;
	},

	/**
	* How long has passed since the given time (in seconds).
	* @method elapsedSecondsSince
	* @param {Number} since The time you want to measure (in seconds).
	* @return {Number} Duration between given time and now (in seconds).
	*/
	elapsedSecondsSince: function (since) {
		return (this.now - since) * 0.001;
	},

	/**
	* Resets the private _started value to now.
	* @method reset
	*/
	reset: function () {
		this._started = this.now;
	}

};
/**
* AnimationManager
*
* Any Game Object that supports animation contains a single AnimationManager instance. It is used to add,
* play and update Phaser.Animation objects.
*
* @package    Phaser.Components.AnimationManager
* @author     Richard Davey <rich@photonstorm.com>
* @copyright  2013 Photon Storm Ltd.
* @license    https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
*/
Phaser.AnimationManager = function (sprite) {

	/**
	* Data contains animation frames.
	* @type {FrameData}
	*/
	this._frameData = null;

	/**
	* Keeps track of the current frame of the animation.
	*/
	this.currentFrame = null;

	this.sprite = sprite;

	this.game = sprite.game;

	this._anims = {};

	this.updateIfVisible = true;

};

Phaser.AnimationManager.prototype = {


	/**
	* Load animation frame data.
	* @param frameData Data to be loaded.
	*/
	loadFrameData: function (frameData) {

		this._frameData = frameData;
		this.frame = 0;

	},

	/**
	* Add a new animation.
	* @param name {string} What this animation should be called (e.g. "run").
	* @param frames {any[]} An array of numbers/strings indicating what frames to play in what order (e.g. [1, 2, 3] or ['run0', 'run1', run2]).
	* @param frameRate {number} The speed in frames per second that the animation should play at (e.g. 60 fps).
	* @param loop {bool} Whether or not the animation is looped or just plays once.
	* @param useNumericIndex {bool} Use number indexes instead of string indexes?
	* @return {Animation} The Animation that was created
	*/
	add: function (name, frames, frameRate, loop, useNumericIndex) {

		frames = frames || null;
		frameRate = frameRate || 60;
		loop = loop || false;
		useNumericIndex = useNumericIndex || true;

		if (this._frameData == null)
		{
			console.warn('No frameData available for Phaser.Animation ' + name);
			return;
		}

		//  Create the signals the AnimationManager will emit
		if (this.sprite.events.onAnimationStart == null)
		{
			this.sprite.events.onAnimationStart = new Phaser.Signal();
			this.sprite.events.onAnimationComplete = new Phaser.Signal();
			this.sprite.events.onAnimationLoop = new Phaser.Signal();
		}

		if (frames == null)
		{
			frames = this._frameData.getFrameIndexes();
		}
		else
		{
			if (this.validateFrames(frames, useNumericIndex) == false)
			{
				console.warn('Invalid frames given to Phaser.Animation ' + name);
				return;
			}
		}

		if (useNumericIndex == false)
		{
			frames = this._frameData.getFrameIndexesByName(frames);
		}

		this._anims[name] = new Phaser.Animation(this.game, this.sprite, this._frameData, name, frames, frameRate, loop);
		this.currentAnim = this._anims[name];
		this.currentFrame = this.currentAnim.currentFrame;
		this.sprite.setTexture(PIXI.TextureCache[this.currentFrame.uuid]);

		return this._anims[name];

	},

	/**
	* Check whether the frames is valid.
	* @param frames {any[]} Frames to be validated.
	* @param useNumericIndex {bool} Does these frames use number indexes or string indexes?
	* @return {bool} True if they're valid, otherwise return false.
	*/
	validateFrames: function (frames, useNumericIndex) {

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
	* Play animation with specific name.
	* @param name {string} The string name of the animation you want to play.
	* @param frameRate {number} FrameRate you want to specify instead of using default.
	* @param loop {bool} Whether or not the animation is looped or just plays once.
	*/
	play: function (name, frameRate, loop) {

		frameRate = frameRate || null;
		loop = loop || null;
		
		if (this._anims[name])
		{
			if (this.currentAnim == this._anims[name])
			{
				if (this.currentAnim.isPlaying == false)
				{
					return this.currentAnim.play(frameRate, loop);
				}
			}
			else
			{
				this.currentAnim = this._anims[name];
				return this.currentAnim.play(frameRate, loop);
			}
		}

	},

	/**
	* Stop animation. If a name is given that specific animation is stopped, otherwise the current one is stopped.
	* Current animation will be automatically set to the stopped one.
	*/
	stop: function (name) {

		if (typeof name == 'string')
		{
			if (this._anims[name])
			{
				this.currentAnim = this._anims[name];
				this.currentAnim.stop();
			}
		}
		else
		{
			if (this.currentAnim)
			{
				this.currentAnim.stop();
			}
		}

	},

	/**
	* Update animation and parent sprite's bounds.
	* Returns true if a new frame has been set, otherwise false.
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
    * Removes all related references
    */
    destroy: function () {

        this._anims = {};
        this._frameData = null;
        this._frameIndex = 0;
        this.currentAnim = null;
        this.currentFrame = null;

    }

};

Object.defineProperty(Phaser.AnimationManager.prototype, "frameData", {

    get: function () {
        return this._frameData;
    }

});

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

Object.defineProperty(Phaser.AnimationManager.prototype, "frame", {

    get: function () {

    	if (this.currentFrame)
    	{
	        return this._frameIndex;
	    }
	    
    },

	/**
    *
    * @param value
    */
    set: function (value) {

        if (this._frameData && this._frameData.getFrame(value) !== null)
        {
            this.currentFrame = this._frameData.getFrame(value);
            this._frameIndex = value;
            this.sprite.currentFrame = this.currentFrame;
			this.sprite.setTexture(PIXI.TextureCache[this.currentFrame.uuid]);
        }

    }

});

Object.defineProperty(Phaser.AnimationManager.prototype, "frameName", {

    get: function () {

    	if (this.currentFrame)
    	{
	        return this.currentFrame.name;
    	}

    },

    set: function (value) {

        if (this._frameData && this._frameData.getFrameByName(value))
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
* Animation
*
* An Animation instance contains a single animation and the controls to play it.
* It is created by the AnimationManager and belongs to Game Objects such as Sprite.
*
* @package    Phaser.Animation
* @author     Richard Davey <rich@photonstorm.com>
* @copyright  2013 Photon Storm Ltd.
* @license    https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
*
* @param parent {Sprite} Owner sprite of this animation.
* @param frameData {FrameData} The FrameData object contains animation data.
* @param name {string} Unique name of this animation.
* @param frames {number[]/string[]} An array of numbers or strings indicating what frames to play in what order.
* @param delay {number} Time between frames in ms.
* @param looped {bool} Whether or not the animation is looped or just plays once.
*/
Phaser.Animation = function (game, parent, frameData, name, frames, delay, looped) {

	this.game = game;
	this._parent = parent;
	this._frames = frames;
	this._frameData = frameData;
	this.name = name;
	this.delay = 1000 / delay;
	this.looped = looped;
	this.isFinished = false;
	this.isPlaying = false;
	this._frameIndex = 0;
	this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);
	
};

Phaser.Animation.prototype = {

	/**
    * Play this animation.
    * @param frameRate {number} FrameRate you want to specify instead of using default.
    * @param loop {bool} Whether or not the animation is looped or just plays once.
    */
    play: function (frameRate, loop) {

        frameRate = frameRate || null;
        loop = loop || null;

        if (frameRate !== null)
        {
            this.delay = 1000 / frameRate;
        }

        if (loop !== null)
        {
            //  If they set a new loop value then use it, otherwise use the default set on creation
            this.looped = loop;
        }

        this.isPlaying = true;
        this.isFinished = false;

        this._timeLastFrame = this.game.time.now;
        this._timeNextFrame = this.game.time.now + this.delay;

        this._frameIndex = 0;

        this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);
		this._parent.setTexture(PIXI.TextureCache[this.currentFrame.uuid]);
        this._parent.events.onAnimationStart.dispatch(this._parent, this);

        return this;

    },

	/**
    * Play this animation from the first frame.
    */
    restart: function () {

        this.isPlaying = true;
        this.isFinished = false;

        this._timeLastFrame = this.game.time.now;
        this._timeNextFrame = this.game.time.now + this.delay;

        this._frameIndex = 0;

        this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);

    },

	/**
    * Stop playing animation and set it finished.
    */
    stop: function () {

        this.isPlaying = false;
        this.isFinished = true;

    },

	/**
    * Update animation frames.
    */
    update: function () {

        if (this.isPlaying == true && this.game.time.now >= this._timeNextFrame)
        {
            this._frameIndex++;

            if (this._frameIndex == this._frames.length)
            {
                if (this.looped)
                {
                    this._frameIndex = 0;
                    this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);
                    this._parent.setTexture(PIXI.TextureCache[this.currentFrame.uuid]);
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

            this._timeLastFrame = this.game.time.now;
            this._timeNextFrame = this.game.time.now + this.delay;

            return true;
        }

        return false;

    },

	/**
    * Clean up animation memory.
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
    * Animation complete callback method.
    */
    onComplete: function () {

        this.isPlaying = false;
        this.isFinished = true;
        this._parent.events.onAnimationComplete.dispatch(this._parent, this);

    }

};

Object.defineProperty(Phaser.Animation.prototype, "frameTotal", {

    get: function () {
        return this._frames.length;
    }

});

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
* Frame
*
* A Frame is a single frame of an animation and is part of a FrameData collection.
*
* @package    Phaser.Animation.Frame
* @author     Richard Davey <rich@photonstorm.com>
* @copyright  2013 Photon Storm Ltd.
* @license    https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
*/
Phaser.Animation.Frame = function (x, y, width, height, name, uuid) {

	/**
	 * X position within the image to cut from.
	 * @type {number}
	 */
	this.x = x;

	/**
	 * Y position within the image to cut from.
	 * @type {number}
	 */
	this.y = y;

	/**
	 * Width of the frame.
	 * @type {number}
	 */
	this.width = width;

	/**
	 * Height of the frame.
	 * @type {number}
	 */
	this.height = height;

	/**
	 * center X position within the image to cut from.
	 * @type {number}
	 */
    this.centerX = Math.floor(width / 2);

	/**
	 * center Y position within the image to cut from.
	 * @type {number}
	 */
    this.centerY = Math.floor(height / 2);

	/**
	 * Useful for Sprite Sheets.
	 * @type {number}
	 */
	this.index = 0;

	/**
	 * Useful for Texture Atlas files. (is set to the filename value)
	 */
	this.name = name;

	/**
	 * A link to the PIXI.TextureCache entry
	 */
	this.uuid = uuid;

	/**
	 * The distance from the top left to the bottom-right of this Frame.
	 * @type {number}
	 */
	this.distance = Phaser.Math.distance(0, 0, width, height);

	/**
	 * Rotated? (not yet implemented)
	 */
	this.rotated = false;

	/**
	 * Either cw or ccw, rotation is always 90 degrees.
	 */
	this.rotationDirection = 'cw';

	/**
	 * Was it trimmed when packed?
	 * @type {bool}
	 */
	this.trimmed = false;

	/**
	 * Width of the original sprite.
	 * @type {number}
	 */
    this.sourceSizeW = width;

	/**
	 * Height of the original sprite.
	 * @type {number}
	 */
    this.sourceSizeH = height;

	/**
	 * X position of the trimmed sprite inside original sprite.
	 * @type {number}
	 */
	this.spriteSourceSizeX = 0;

	/**
	 * Y position of the trimmed sprite inside original sprite.
	 * @type {number}
	 */
	this.spriteSourceSizeY = 0;

	/**
	 * Width of the trimmed sprite.
	 * @type {number}
	 */
	this.spriteSourceSizeW = 0;

	/**
	 * Height of the trimmed sprite.
	 * @type {number}
	 */
	this.spriteSourceSizeH = 0;

};

Phaser.Animation.Frame.prototype = {

	/**
	* Set trim of the frame.
	* @param trimmed {bool} Whether this frame trimmed or not.
	* @param actualWidth {number} Actual width of this frame.
	* @param actualHeight {number} Actual height of this frame.
	* @param destX {number} Destination x position.
	* @param destY {number} Destination y position.
	* @param destWidth {number} Destination draw width.
	* @param destHeight {number} Destination draw height.
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
* FrameData
*
* FrameData is a container for Frame objects, which are the internal representation of animation data in Phaser.
*
* @package    Phaser.Animation.FrameData
* @author     Richard Davey <rich@photonstorm.com>
* @copyright  2013 Photon Storm Ltd.
* @license    https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
*/
Phaser.Animation.FrameData = function () {

    /**
     * Local frame container.
     * @type {Phaser.Frame[]}
     * @private
     */
    this._frames = [];

    /**
     * Local frameName<->index container.
     * @private
     */
    this._frameNames = [];

};

Phaser.Animation.FrameData.prototype = {

	/**
	* Add a new frame.
	* @param frame {Frame} The frame you want to add.
	* @return {Frame} The frame you just added.
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
	* Get a frame by its index.
	* @param index {number} Index of the frame you want to get.
	* @return {Frame} The frame you want.
	*/
    getFrame: function (index) {

        if (this._frames[index])
        {
            return this._frames[index];
        }

        return null;

    },

	/**
	* Get a frame by its name.
	* @param name {string} Name of the frame you want to get.
	* @return {Frame} The frame you want.
	*/    
    getFrameByName: function (name) {

        if (this._frameNames[name] !== '')
        {
            return this._frames[this._frameNames[name]];
        }

        return null;

    },

	/**
	* Check whether there's a frame with given name.
	* @param name {string} Name of the frame you want to check.
	* @return {bool} True if frame with given name found, otherwise return false.
	*/
    checkFrameName: function (name) {

        if (this._frameNames[name] == null)
        {
            return false;
        }

        return true;
        
    },

	/**
	* Get ranges of frames in an array.
	* @param start {number} Start index of frames you want.
	* @param end {number} End index of frames you want.
	* @param [output] {Frame[]} result will be added into this array.
	* @return {Frame[]} Ranges of specific frames in an array.
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
	* Get all indexes of frames by giving their name.
	* @param [output] {number[]} result will be added into this array.
	* @return {number[]} Indexes of specific frames in an array.
	*/
    getFrameIndexes: function (output) {

        if (typeof output === "undefined") { output = []; }

        for (var i = 0; i < this._frames.length; i++)
        {
            output.push(i);
        }

        return output;

    },

	/**
	* Get the frame indexes by giving the frame names.
	* @param [output] {number[]} result will be added into this array.
	* @return {number[]} Names of specific frames in an array.
	*/
    getFrameIndexesByName: function (input) {

        var output = [];

        for (var i = 0; i < input.length; i++)
        {
            if (this.getFrameByName(input[i]))
            {
                output.push(this.getFrameByName(input[i]).index);
            }
        }

        return output;

    },

	/**
	* Get all frames in this frame data.
	* @return {Frame[]} All the frames in an array.
	*/
    getAllFrames: function () {
        return this._frames;
    },

	/**
	* Get All frames with specific ranges.
	* @param range {number[]} Ranges in an array.
	* @return {Frame[]} All frames in an array.
	*/
    getFrames: function (range) {

        var output = [];

        for (var i = 0; i < range.length; i++)
        {
            output.push(this._frames[i]);
        }

        return output;
    }

};

Object.defineProperty(Phaser.Animation.FrameData.prototype, "total", {

    get: function () {
        return this._frames.length;
    }

});


/**
* Animation Parser
*
* Responsible for parsing sprite sheet and JSON data into the internal FrameData format that Phaser uses for animations.
*
* @package    Phaser.Animation.Parser
* @author     Richard Davey <rich@photonstorm.com>
* @copyright  2013 Photon Storm Ltd.
* @license    https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
*/
Phaser.Animation.Parser = {

	/**
	* Parse a sprite sheet from asset data.
	* @param key {string} Asset key for the sprite sheet data.
	* @param frameWidth {number} Width of animation frame.
	* @param frameHeight {number} Height of animation frame.
	* @param frameMax {number} Number of animation frames.
	* @return {FrameData} Generated FrameData object.
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
            console.warn("Phaser.Animation.Parser.spriteSheet: width/height zero or width/height < given frameWidth/frameHeight");
            return null;
        }

        //  Let's create some frames then
        var data = new Phaser.Animation.FrameData();
        var x = 0;
        var y = 0;

        for (var i = 0; i < total; i++)
        {
            var uuid = game.rnd.uuid();

            data.addFrame(new Phaser.Animation.Frame(x, y, frameWidth, frameHeight, '', uuid));

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
    * Parse frame data from json texture atlas in Array format.
    * @param json {object} Json data you want to parse.
    * @return {FrameData} Generated FrameData object.
    */
    JSONData: function (game, json, cacheKey) {

        //  Malformed?
        if (!json['frames'])
        {
            console.warn("Phaser.Animation.Parser.JSONData: Invalid Texture Atlas JSON given, missing 'frames' array");
            console.log(json);
            return;
        }

        //  Let's create some frames then
        var data = new Phaser.Animation.FrameData();
        
        //  By this stage frames is a fully parsed array
        var frames = json['frames'];
        var newFrame;
        
        for (var i = 0; i < frames.length; i++)
        {
            var uuid = game.rnd.uuid();

            newFrame = data.addFrame(new Phaser.Animation.Frame(
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

                PIXI.TextureCache[uuid].realSize = frames[i].spriteSourceSize;
                PIXI.TextureCache[uuid].trim.x = 0;
            }
        }

        return data;

    },

    /**
    * Parse frame data from json texture atlas in Hash format.
    * @param json {object} Json data you want to parse.
    * @return {FrameData} Generated FrameData object.
    */
    JSONDataHash: function (game, json, cacheKey) {

        //  Malformed?
        if (!json['frames'])
        {
            console.warn("Phaser.Animation.Parser.JSONDataHash: Invalid Texture Atlas JSON given, missing 'frames' object");
            console.log(json);
            return;
        }
            
        //  Let's create some frames then
        var data = new Phaser.Animation.FrameData();

        //  By this stage frames is a fully parsed array
        var frames = json['frames'];
        var newFrame;
        
        for (var key in frames)
        {
            var uuid = game.rnd.uuid();

            newFrame = data.addFrame(new Phaser.Animation.Frame(
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

                PIXI.TextureCache[uuid].realSize = frames[key].spriteSourceSize;
                PIXI.TextureCache[uuid].trim.x = 0;
            }
        }

        return data;

    },

    /**
    * Parse frame data from an XML file.
    * @param xml {object} XML data you want to parse.
    * @return {FrameData} Generated FrameData object.
    */
    XMLData: function (game, xml, cacheKey) {

        //  Malformed?
        if (!xml.getElementsByTagName('TextureAtlas'))
        {
            console.warn("Phaser.Animation.Parser.XMLData: Invalid Texture Atlas XML given, missing <TextureAtlas> tag");
            return;
        }

        //  Let's create some frames then
        var data = new Phaser.Animation.FrameData();
        var frames = xml.getElementsByTagName('SubTexture');
        var newFrame;
        
        for (var i = 0; i < frames.length; i++)
        {
            var uuid = game.rnd.uuid();

            var frame = frames[i].attributes;

            newFrame = data.addFrame(new Phaser.Animation.Frame(
            	frame.x.nodeValue, 
            	frame.y.nodeValue, 
            	frame.width.nodeValue, 
            	frame.height.nodeValue, 
            	frame.name.nodeValue,
                uuid
            ));

            PIXI.TextureCache[uuid] = new PIXI.Texture(PIXI.BaseTextureCache[cacheKey], {
                x: frame.x.nodeValue,
                y: frame.y.nodeValue,
                width: frame.width.nodeValue,
                height: frame.height.nodeValue
            });

            //  Trimmed?
            if (frame.frameX.nodeValue != '-0' || frame.frameY.nodeValue != '-0') {
                newFrame.setTrim(
                	true, 
                	frame.width.nodeValue, 
                	frame.height.nodeValue, 
                	Math.abs(frame.frameX.nodeValue), 
                	Math.abs(frame.frameY.nodeValue), 
                	frame.frameWidth.nodeValue, 
                	frame.frameHeight.nodeValue
                );

                PIXI.TextureCache[uuid].realSize = {
                    x: Math.abs(frame.frameX.nodeValue),
                    y: Math.abs(frame.frameY.nodeValue),
                    w: frame.frameWidth.nodeValue,
                    h: frame.frameHeight.nodeValue
                };

                PIXI.TextureCache[uuid].trim.x = 0;

            }
        }

        return data;

    }

};

/**
* Cache
*
* A game only has one instance of a Cache and it is used to store all externally loaded assets such
* as images, sounds and data files as a result of Loader calls. Cache items use string based keys for look-up.
*
* @package    Phaser.Cache
* @author     Richard Davey <rich@photonstorm.com>
* @copyright  2013 Photon Storm Ltd.
* @license    https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
*/
Phaser.Cache = function (game) {

    /**
     * Local reference to Game.
     */
	this.game = game;

    /**
     * Canvas key-value container.
     * @type {object}
     * @private
     */
    this._canvases = {};

    /**
     * Image key-value container.
     * @type {object}
     */
    this._images = {};

    /**
     * RenderTexture key-value container.
     * @type {object}
     */
    this._textures = {};

    /**
     * Sound key-value container.
     * @type {object}
     */
    this._sounds = {};

    /**
     * Text key-value container.
     * @type {object}
     */
    this._text = {};

    /**
     * Tilemap key-value container.
     * @type {object}
     */
    this._tilemaps = {};

    this.addDefaultImage();

    this.onSoundUnlock = new Phaser.Signal;

};

Phaser.Cache.prototype = {

    /**
     * Add a new canvas.
     * @param key {string} Asset key for this canvas.
     * @param canvas {HTMLCanvasElement} Canvas DOM element.
     * @param context {CanvasRenderingContext2D} Render context of this canvas.
     */
    addCanvas: function (key, canvas, context) {

        this._canvases[key] = { canvas: canvas, context: context };

    },

    /**
     * Add a new canvas.
     * @param key {string} Asset key for this canvas.
     * @param canvas {RenderTexture} A RenderTexture.
     */
    addRenderTexture: function (key, texture) {

        var frame = new Phaser.Animation.Frame(0, 0, texture.width, texture.height, '', '');

        this._textures[key] = { texture: texture, frame: frame };

    },

    /**
     * Add a new sprite sheet.
     * @param key {string} Asset key for the sprite sheet.
     * @param url {string} URL of this sprite sheet file.
     * @param data {object} Extra sprite sheet data.
     * @param frameWidth {number} Width of the sprite sheet.
     * @param frameHeight {number} Height of the sprite sheet.
     * @param frameMax {number} How many frames stored in the sprite sheet.
     */
    addSpriteSheet: function (key, url, data, frameWidth, frameHeight, frameMax) {

        this._images[key] = { url: url, data: data, spriteSheet: true, frameWidth: frameWidth, frameHeight: frameHeight };

        PIXI.BaseTextureCache[key] = new PIXI.BaseTexture(data);
        PIXI.TextureCache[key] = new PIXI.Texture(PIXI.BaseTextureCache[key]);

        this._images[key].frameData = Phaser.Animation.Parser.spriteSheet(this.game, key, frameWidth, frameHeight, frameMax);

    },

    /**
     * Add a new tilemap.
     * @param key  {string} Asset key for the texture atlas.
     * @param url  {string} URL of this texture atlas file.
     * @param data {object} Extra texture atlas data.
     * @param atlasData {object} Texture atlas frames data.
     */
    addTilemap: function (key, url, data, mapData, format) {

        this._tilemaps[key] = { url: url, data: data, spriteSheet: true, mapData: mapData, format: format };

        PIXI.BaseTextureCache[key] = new PIXI.BaseTexture(data);
        PIXI.TextureCache[key] = new PIXI.Texture(PIXI.BaseTextureCache[key]);

    },

    /**
     * Add a new texture atlas.
     * @param key  {string} Asset key for the texture atlas.
     * @param url  {string} URL of this texture atlas file.
     * @param data {object} Extra texture atlas data.
     * @param atlasData {object} Texture atlas frames data.
     */
    addTextureAtlas: function (key, url, data, atlasData, format) {

        this._images[key] = { url: url, data: data, spriteSheet: true };

        PIXI.BaseTextureCache[key] = new PIXI.BaseTexture(data);
        PIXI.TextureCache[key] = new PIXI.Texture(PIXI.BaseTextureCache[key]);

        if (format == Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY)
        {
            this._images[key].frameData = Phaser.Animation.Parser.JSONData(this.game, atlasData, key);
        }
        else if (format == Phaser.Loader.TEXTURE_ATLAS_JSON_HASH)
        {
            this._images[key].frameData = Phaser.Animation.Parser.JSONDataHash(this.game, atlasData, key);
        }
        else if (format == Phaser.Loader.TEXTURE_ATLAS_XML_STARLING)
        {
            this._images[key].frameData = Phaser.Animation.Parser.XMLData(this.game, atlasData, key);
        }

    },

    /**
     * Add a new Bitmap Font.
     * @param key  {string} Asset key for the font texture.
     * @param url  {string} URL of this font xml file.
     * @param data {object} Extra font data.
     * @param xmlData {object} Texture atlas frames data.
     */
    addBitmapFont: function (key, url, data, xmlData) {

        this._images[key] = { url: url, data: data, spriteSheet: true };

        PIXI.BaseTextureCache[key] = new PIXI.BaseTexture(data);
        PIXI.TextureCache[key] = new PIXI.Texture(PIXI.BaseTextureCache[key]);

        Phaser.Loader.Parser.bitmapFont(this.game, xmlData, key);
        // this._images[key].frameData = Phaser.Animation.Parser.XMLData(this.game, xmlData, key);

    },

    /**
     * Adds a default image to be used when a key is wrong / missing.
     * Is mapped to the key __default
     */
    addDefaultImage: function () {

        this._images['__default'] = { url: null, data: null, spriteSheet: false };
        this._images['__default'].frame = new Phaser.Animation.Frame(0, 0, 32, 32, '', '');

        var base = new PIXI.BaseTexture();
        base.width = 32;
        base.height = 32;
        base.hasLoaded = true; // avoids a hanging event listener

        PIXI.BaseTextureCache['__default'] = base;
        PIXI.TextureCache['__default'] = new PIXI.Texture(base);

    },

    /**
     * Add a new image.
     * @param key {string} Asset key for the image.
     * @param url {string} URL of this image file.
     * @param data {object} Extra image data.
     */
    addImage: function (key, url, data) {

        this._images[key] = { url: url, data: data, spriteSheet: false };
        this._images[key].frame = new Phaser.Animation.Frame(0, 0, data.width, data.height, '', '');

        PIXI.BaseTextureCache[key] = new PIXI.BaseTexture(data);
        PIXI.TextureCache[key] = new PIXI.Texture(PIXI.BaseTextureCache[key]);

    },

    /**
     * Add a new sound.
     * @param key {string} Asset key for the sound.
     * @param url {string} URL of this sound file.
     * @param data {object} Extra sound data.
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

    reloadSoundComplete: function (key) {

        if (this._sounds[key])
        {
            this._sounds[key].locked = false;
            this.onSoundUnlock.dispatch(key);
        }

    },

    updateSound: function (key, property, value) {
        
        if (this._sounds[key])
        {
            this._sounds[key][property] = value;
        }

    },

	/**
	* Add a new decoded sound.
	* @param key {string} Asset key for the sound.
	* @param data {object} Extra sound data.
	*/
    decodedSound: function (key, data) {

        this._sounds[key].data = data;
        this._sounds[key].decoded = true;
        this._sounds[key].isDecoding = false;

    },

	/**
	* Add a new text data.
	* @param key {string} Asset key for the text data.
	* @param url {string} URL of this text data file.
	* @param data {object} Extra text data.
	*/    
    addText: function (key, url, data) {

        this._text[key] = {
            url: url,
            data: data
        };

    },

	/**
	* Get canvas by key.
	* @param key Asset key of the canvas you want.
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
    * @param key Asset key of the image you want.
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
	* @param key Asset key of the image you want.
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
    * Get tilemap data by key.
    * @param key Asset key of the tilemap you want.
    * @return {object} The tilemap data. The tileset image is in the data property, the map data in mapData.
    */
    getTilemap: function (key) {

        if (this._tilemaps[key])
        {
            return this._tilemaps[key];
        }

        return null;
    },

	/**
	* Get frame data by key.
	* @param key Asset key of the frame data you want.
	* @return {object} The frame data you want.
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
    * @param key Asset key of the frame data you want.
    * @return {object} The frame data you want.
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
    * @param key Asset key of the frame data you want.
    * @return {object} The frame data you want.
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
    * @param key Asset key of the frame data you want.
    * @return {object} The frame data you want.
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
    * @param key Asset key of the frame data you want.
    * @return {object} The frame data you want.
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
    * @param key Asset key of the RenderTexture you want.
    * @return {object} The RenderTexture you want.
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
	* @param key Asset key of the sound you want.
	* @return {object} The sound you want.
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
	* @param key Asset key of the sound you want.
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
	* Check whether an asset is decoded sound.
	* @param key Asset key of the sound you want.
	* @return {object} The sound data you want.
	*/
    isSoundDecoded: function (key) {

        if (this._sounds[key])
        {
            return this._sounds[key].decoded;
        }

    },

	/**
	* Check whether an asset is decoded sound.
	* @param key Asset key of the sound you want.
	* @return {object} The sound data you want.
	*/
    isSoundReady: function (key) {

        return (this._sounds[key] && this._sounds[key].decoded && this.game.sound.touchLocked == false);

    },

	/**
	* Check whether an asset is sprite sheet.
	* @param key Asset key of the sprite sheet you want.
	* @return {object} The sprite sheet data you want.
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
	* @param key Asset key of the text data you want.
	* @return {object} The text data you want.
	*/
    getText: function (key) {

        if (this._text[key])
        {
            return this._text[key].data;
        }

        return null;
        
    },

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
	* @return {Array} The string based keys in the Cache.
	*/
    getImageKeys: function () {
    	return this.getKeys(this._images);
    },

	/**
	* Returns an array containing all of the keys of Sounds in the Cache.
	* @return {Array} The string based keys in the Cache.
	*/
    getSoundKeys: function () {
    	return this.getKeys(this._sounds);
    },

	/**
	* Returns an array containing all of the keys of Text Files in the Cache.
	* @return {Array} The string based keys in the Cache.
	*/
    getTextKeys: function () {
    	return this.getKeys(this._text);
    },

    removeCanvas: function (key) {
        delete this._canvases[key];
    },

    removeImage: function (key) {
        delete this._images[key];
    },

    removeSound: function (key) {
        delete this._sounds[key];
    },

    removeText: function (key) {
        delete this._text[key];
    },

	/**
	* Clean up cache memory.
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
* Phaser.Loader
*
* The Loader handles loading all external content such as Images, Sounds, Texture Atlases and data files.
* It uses a combination of Image() loading and xhr and provides progress and completion callbacks.
*/
Phaser.Loader = function (game) {

	/**
	* Local reference to Game.
	*/
	this.game = game;

	/**
	* Array stores assets keys. So you can get that asset by its unique key.
	*/
	this._keys = [];

	/**
	* Contains all the assets file infos.
	*/
	this._fileList = {};

	/**
	* Indicates assets loading progress. (from 0 to 100)
	* @type {number}
	*/
	this._progressChunk = 0;

	/**
	* An XMLHttpRequest object used for loading text and audio data
	* @type {XMLHttpRequest}
	*/
	this._xhr = new XMLHttpRequest();

	/**
	* Length of assets queue.
	* @type {number}
	*/
	this.queueSize = 0;

	/**
	* True if the Loader is in the process of loading the queue.
	* @type {bool}
	*/
	this.isLoading = false;

	/**
	* True if all assets in the queue have finished loading.
	* @type {bool}
	*/
	this.hasLoaded = false;

	/**
	* The Load progress percentage value (from 0 to 100)
	* @type {number}
	*/
	this.progress = 0;

	/**
	* The crossOrigin value applied to loaded images
	* @type {string}
	*/
	this.crossOrigin = '';

	/**
	* If you want to append a URL before the path of any asset you can set this here.
	* Useful if you need to allow an asset url to be configured outside of the game code.
	* MUST have / on the end of it!
	* @type {string}
	*/
	this.baseURL = '';

	/**
	 * Event Signals
	 */
	this.onFileComplete = new Phaser.Signal;
	this.onFileError = new Phaser.Signal;
	this.onLoadStart = new Phaser.Signal;
	this.onLoadComplete = new Phaser.Signal;

};

/**
 * TextureAtlas data format constants
 */
Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY = 0;
Phaser.Loader.TEXTURE_ATLAS_JSON_HASH = 1;
Phaser.Loader.TEXTURE_ATLAS_XML_STARLING = 2;

Phaser.Loader.prototype = {

	/**
	* Check whether asset exists with a specific key.
	* @param key {string} Key of the asset you want to check.
	* @return {bool} Return true if exists, otherwise return false.
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
	 */
	reset: function () {

		this.queueSize = 0;
		this.isLoading = false;

	},

	/**
	* Internal function that adds a new entry to the file list.
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
	* @param key {string} Unique asset key of this image file.
	* @param url {string} URL of image file.
	* @param overwrite {boolean} If an entry with a matching key already exists this will over-write it
	*/
	image: function (key, url, overwrite) {

		if (typeof overwrite === "undefined") { overwrite = false; }

		if (overwrite || this.checkKeyExists(key) == false)
		{
			this.addToFileList('image', key, url);
		}

	},

	/**
	* Add a text file to the Loader.
	* @param key {string} Unique asset key of the text file.
	* @param url {string} URL of the text file.
	*/
	text: function (key, url, overwrite) {

		if (typeof overwrite === "undefined") { overwrite = false; }

		if (overwrite || this.checkKeyExists(key) == false)
		{
			this.addToFileList('text', key, url);
		}

	},

	/**
	* Add a new sprite sheet loading request.
	* @param key {string} Unique asset key of the sheet file.
	* @param url {string} URL of sheet file.
	* @param frameWidth {number} Width of each single frame.
	* @param frameHeight {number} Height of each single frame.
	* @param frameMax {number} How many frames in this sprite sheet.
	*/
	spritesheet: function (key, url, frameWidth, frameHeight, frameMax) {

		if (typeof frameMax === "undefined") { frameMax = -1; }

		if (this.checkKeyExists(key) === false)
		{
			this.addToFileList('spritesheet', key, url, { frameWidth: frameWidth, frameHeight: frameHeight, frameMax: frameMax });
		}

	},

	/**
	* Add a new audio file loading request.
	* @param key {string} Unique asset key of the audio file.
	* @param urls {Array} An array containing the URLs of the audio files, i.e.: [ 'jump.mp3', 'jump.ogg', 'jump.m4a' ]
	* @param autoDecode {bool} When using Web Audio the audio files can either be decoded at load time or run-time. They can't be played until they are decoded, but this let's you control when that happens. Decoding is a non-blocking async process.
	*/
	audio: function (key, urls, autoDecode) {

		if (typeof autoDecode === "undefined") { autoDecode = true; }

		if (this.checkKeyExists(key) === false)
		{
			this.addToFileList('audio', key, urls, { buffer: null, autoDecode: autoDecode });
		}

	},

	/**
	* Add a new tilemap loading request.
	* @param key {string} Unique asset key of the tilemap data.
	* @param tilesetURL {string} The url of the tile set image file.
	* @param [mapDataURL] {string} The url of the map data file (csv/json)
	* @param [mapData] {object} An optional JSON data object (can be given in place of a URL).
	* @param [format] {string} The format of the map data.
	*/
	tilemap: function (key, tilesetURL, mapDataURL, mapData, format) {

		if (typeof mapDataURL === "undefined") { mapDataURL = null; }
		if (typeof mapData === "undefined") { mapData = null; }
		if (typeof format === "undefined") { format = Phaser.Tilemap.CSV; }

		if (this.checkKeyExists(key) === false)
		{
			//  A URL to a json/csv file has been given
			if (mapDataURL)
			{
				this.addToFileList('tilemap', key, tilesetURL, { mapDataURL: mapDataURL, format: format });
			}
			else
			{
				switch (format)
				{
					//  A csv string or object has been given
					case Phaser.Tilemap.CSV:
						break;

					//  An xml string or object has been given
					case Phaser.Tilemap.JSON:

						if (typeof mapData === 'string')
						{
							mapData = JSON.parse(mapData);
						}
						break;
				}

				this.addToFileList('tilemap', key, tilesetURL, { mapDataURL: null, mapData: mapData, format: format });

			}
		}

	},

	/**
	* Add a new bitmap font loading request.
	* @param key {string} Unique asset key of the bitmap font.
	* @param textureURL {string} The url of the font image file.
	* @param [xmlURL] {string} The url of the font data file (xml/fnt)
	* @param [xmlData] {object} An optional XML data object.
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

	},

	atlasJSONArray: function (key, textureURL, atlasURL, atlasData) {

		this.atlas(key, textureURL, atlasURL, atlasData, Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);

	},

	atlasJSONHash: function (key, textureURL, atlasURL, atlasData) {

		this.atlas(key, textureURL, atlasURL, atlasData, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);

	},

	atlasXML: function (key, textureURL, atlasURL, atlasData) {

		this.atlas(key, textureURL, atlasURL, atlasData, Phaser.Loader.TEXTURE_ATLAS_XML_STARLING);

	},

	/**
	* Add a new texture atlas loading request.
	* @param key {string} Unique asset key of the texture atlas file.
	* @param textureURL {string} The url of the texture atlas image file.
	* @param [atlasURL] {string} The url of the texture atlas data file (json/xml)
	* @param [atlasData] {object} A JSON or XML data object.
	* @param [format] {number} A value describing the format of the data.
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

	},

	/**
	 * Remove loading request of a file.
	 * @param key {string} Key of the file you want to remove.
	 */
	removeFile: function (key) {

		delete this._fileList[key];

	},

	/**
	 * Remove all file loading requests.
	 */
	removeAll: function () {

		this._fileList = {};

	},

	/**
	 * Load assets.
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
			case 'tilemap':
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
	 * @param key {string} Key of the error loading file.
	 */
	fileError: function (key) {

		this._fileList[key].loaded = true;
		this._fileList[key].error = true;

		this.onFileError.dispatch(key);

		console.warn("Phaser.Loader error loading file: " + key);

		this.nextFile(key, false);

	},

	/**
	 * Called when a file is successfully loaded.
	 * @param key {string} Key of the successfully loaded file.
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

			case 'tilemap':

				if (file.mapDataURL == null)
				{
					this.game.cache.addTilemap(file.key, file.url, file.data, file.mapData, file.format);
				}
				else
				{
					//  Load the JSON or CSV before carrying on with the next file
					loadNext = false;
					this._xhr.open("GET", this.baseURL + file.mapDataURL, true);
					this._xhr.responseType = "text";

					if (file.format == Phaser.Tilemap.JSON)
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
				}
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
				file.data = this._xhr.response;
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
	 * @param key {string} Key of the loaded JSON file.
	 */
	jsonLoadComplete: function (key) {

		var data = JSON.parse(this._xhr.response);
		var file = this._fileList[key];

		if (file.type == 'tilemap')
		{
			this.game.cache.addTilemap(file.key, file.url, file.data, data, file.format);
		}
		else
		{
			this.game.cache.addTextureAtlas(file.key, file.url, file.data, data, file.format);
		}

		this.nextFile(key, true);

	},

	/**
	 * Successfully loaded a CSV file.
	 * @param key {string} Key of the loaded CSV file.
	 */
	csvLoadComplete: function (key) {

		var data = this._xhr.response;
		var file = this._fileList[key];

		this.game.cache.addTilemap(file.key, file.url, file.data, data, file.format);

		this.nextFile(key, true);

	},

	/**
	 * Error occured when load a JSON.
	 * @param key {string} Key of the error loading JSON file.
	 */
	dataLoadError: function (key) {

		var file = this._fileList[key];

		file.error = true;

		console.warn("Phaser.Loader dataLoadError: " + key);

		this.nextFile(key, true);

	},

	xmlLoadComplete: function (key) {

		var data = this._xhr.response;
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
	 * @param previousKey {string} Key of previous loaded asset.
	 * @param success {bool} Whether the previous asset loaded successfully or not.
	 */
	nextFile: function (previousKey, success) {

		this.progress = Math.round(this.progress + this._progressChunk);

		if (this.progress > 100)
		{
			this.progress = 100;
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
Phaser.Loader.Parser = {
	
    /**
    * Parse frame data from an XML file.
    * @param xml {object} XML data you want to parse.
    * @return {FrameData} Generated FrameData object.
    */
	bitmapFont: function (game, xml, cacheKey) {

        //  Malformed?
        if (!xml.getElementsByTagName('font'))
        {
            console.warn("Phaser.Loader.Parser.bitmapFont: Invalid XML given, missing <font> tag");
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
Phaser.Sound = function (game, key, volume, loop) {
	
	volume = volume || 1;
	loop = loop || false;

    this.game = game;
    this.name = '';
    this.key = key;
    this.loop = loop;
    this._volume = volume;
    this.markers = {};

    /**
    * Reference to AudioContext instance.
    */
    this.context = null;

    /**
    * Decoded data buffer / Audio tag.
    */
    this._buffer = null;

    this._muted = false;

    this.autoplay = false;
    this.totalDuration = 0;
    this.startTime = 0;
    this.currentTime = 0;
    this.duration = 0;
    this.stopTime = 0;
    this.paused = false;
    this.isPlaying = false;
    this.currentMarker = '';
    this.pendingPlayback = false;
    this.override = false;

    this.usingWebAudio = this.game.sound.usingWebAudio;
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

    this.onDecoded = new Phaser.Signal;
    this.onPlay = new Phaser.Signal;
    this.onPause = new Phaser.Signal;
    this.onResume = new Phaser.Signal;
    this.onLoop = new Phaser.Signal;
    this.onStop = new Phaser.Signal;
    this.onMute = new Phaser.Signal;
    this.onMarkerComplete = new Phaser.Signal;

};

Phaser.Sound.prototype = {

    soundHasUnlocked: function (key) {

        if (key == this.key)
        {
            this._sound = this.game.cache.getSoundData(this.key);
            this.totalDuration = this._sound.duration;
            console.log('sound has unlocked' + this._sound);
	    }

	},

    addMarker: function (name, start, stop, volume, loop) {

    	volume = volume || 1;
    	loop = loop || false;

        this.markers[name] = {
            name: name,
            start: start,
            stop: stop,
            volume: volume,
            duration: stop - start,
            loop: loop
        };

    },

    removeMarker: function (name) {

        delete this.markers[name];

    },

    update: function () {

        if (this.pendingPlayback && this.game.cache.isSoundReady(this.key))
        {
            this.pendingPlayback = false;
            this.play(this._tempMarker, this._tempPosition, this._tempVolume, this._tempLoop);
        }

        if (this.isPlaying)
        {
            this.currentTime = this.game.time.now - this.startTime;

            if (this.currentTime >= this.duration)
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
    * @param marker {string} Assets key of the sound you want to play.
    * @param [volume] {number} volume of the sound you want to play.
    * @param [loop] {bool} loop when it finished playing? (Default to false)
    * @return {Sound} The playing sound object.
    */
    play: function (marker, position, volume, loop, forceRestart) {

    	marker = marker || '';
    	position = position || 0;
    	volume = volume || 1;
    	loop = loop || false;
    	forceRestart = forceRestart || false;

        // console.log('play ' + marker + ' position ' + position + ' volume ' + volume + ' loop ' + loop);

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

        if (marker !== '' && this.markers[marker])
        {
            this.position = this.markers[marker].start;
            this.volume = this.markers[marker].volume;
            this.loop = this.markers[marker].loop;
            this.duration = this.markers[marker].duration * 1000;

            // console.log('marker info loaded', this.loop, this.duration);
            this._tempMarker = marker;
            this._tempPosition = this.position;
            this._tempVolume = this.volume;
            this._tempLoop = this.loop;
        }
        else
        {
            this.position = position;
            this.volume = volume;
            this.loop = loop;
            this.duration = 0;

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
                    this.duration = this.totalDuration * 1000;
                }

                if (this.loop && marker == '')
                {
                    this._sound.loop = true;
                }

                //  Useful to cache this somewhere perhaps?
                if (typeof this._sound.start === 'undefined')
                {
                    this._sound.noteGrainOn(0, this.position, this.duration / 1000);
                    //this._sound.noteOn(0); // the zero is vitally important, crashes iOS6 without it
				}
				else
				{
                    this._sound.start(0, this.position, this.duration / 1000);
                }

                this.isPlaying = true;
                this.startTime = this.game.time.now;
                this.currentTime = 0;
                this.stopTime = this.startTime + this.duration;
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
                        this.duration = this.totalDuration * 1000;
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
                    this.stopTime = this.startTime + this.duration;
                    this.onPlay.dispatch(this);
                }
                else
                {
                    this.pendingPlayback = true;
                }
            }
        }
    },

    restart: function (marker, position, volume, loop) {

    	marker = marker || '';
    	position = position || 0;
    	volume = volume || 1;
    	loop = loop || false;

        this.play(marker, position, volume, loop, true);

    },

    pause: function () {

        if (this.isPlaying && this._sound)
        {
            this.stop();
            this.isPlaying = false;
            this.paused = true;
            this.onPause.dispatch(this);
        }

    },

    resume: function () {

        if (this.paused && this._sound)
        {
            if (this.usingWebAudio)
            {
                if (typeof this._sound.start === 'undefined')
                {
                    this._sound.noteGrainOn(0, this.position, this.duration);
                    //this._sound.noteOn(0); // the zero is vitally important, crashes iOS6 without it
				}
				else
				{
                    this._sound.start(0, this.position, this.duration);
                }
            }
            else
            {
                this._sound.play();
            }

            this.isPlaying = true;
            this.paused = false;
            this.onResume.dispatch(this);
        }

    },

	/**
    * Stop playing this sound.
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

Object.defineProperty(Phaser.Sound.prototype, "isDecoding", {

    get: function () {
        return this.game.cache.getSound(this.key).isDecoding;
    }

});

Object.defineProperty(Phaser.Sound.prototype, "isDecoded", {

    get: function () {
        return this.game.cache.isSoundDecoded(this.key);
    }

});

Object.defineProperty(Phaser.Sound.prototype, "mute", {

	/**
    * Mute sounds.
    */
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
* Phaser - SoundManager
*
*/
Phaser.SoundManager = function (game) {

	this.game = game;

	this.onSoundDecode = new Phaser.Signal;

    this._muted = false;
    this._unlockSource = null;
    this._volume = 1;
    this._muted = false;
    this._sounds = [];

    this.context = null;
    this.usingWebAudio = true;
    this.usingAudioTag = false;
    this.noAudio = false;

    this.touchLocked = false;

    this.channels = 32;
	
};

Phaser.SoundManager.prototype = {

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

    stopAll: function () {

        for (var i = 0; i < this._sounds.length; i++)
        {
            if (this._sounds[i])
            {
                this._sounds[i].stop();
            }
        }

    },

    pauseAll: function () {

        for (var i = 0; i < this._sounds.length; i++)
        {
            if (this._sounds[i])
            {
                this._sounds[i].pause();
            }
        }

    },

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
    * Decode a sound with its assets key.
    * @param key {string} Assets key of the sound to be decoded.
    * @param [sound] {Sound} its bufer will be set to decoded data.
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

    add: function (key, volume, loop) {

    	volume = volume || 1;
    	loop = loop || false;

        var sound = new Phaser.Sound(this.game, key, volume, loop);

        this._sounds.push(sound);

        return sound;

    }

};

Object.defineProperty(Phaser.SoundManager.prototype, "mute", {

	/**
    * A global audio mute toggle.
    */
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
    },

    enumerable: true,
    configurable: true
});

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

	/**
    * The global audio volume. A value between 0 (silence) and 1 (full volume)
    */
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
* @license      https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
* @module       Phaser
*/

/**
* A collection of methods for displaying debug information about game objects.
*
* @class DebugUtils
*/
Phaser.Utils.Debug = function (game) {

    this.game = game;
    this.context = game.context;

    this.font = '14px Courier';
    this.lineHeight = 16;
    this.renderShadow = true;
    this.currentX = 0;
    this.currentY = 0;
    this.currentAlpha = 1;

};

Phaser.Utils.Debug.prototype = {


    /**
    * Internal method that resets the debug output values.
    * @method start
    * @param {Number} x The X value the debug info will start from.
    * @param {Number} y The Y value the debug info will start from.
    * @param {String} color The color the debug info will drawn in.
    */
    start: function (x, y, color) {

        if (this.context == null)
        {
            return;
        }

        x = x || null;
        y = y || null;
        color = color || 'rgb(255,255,255)';

        if (x && y)
        {
            this.currentX = x;
            this.currentY = y;
            this.currentColor = color;
        }

        this.currentAlpha = this.context.globalAlpha;

        this.context.save();
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.fillStyle = color;
        this.context.font = this.font;
        this.context.globalAlpha = 1;

    },

    stop: function () {

        this.context.restore();
        this.context.globalAlpha = this.currentAlpha;

    },

    /**
    * Internal method that outputs a single line of text.
    * @method line
    * @param {String} text The line of text to draw.
    * @param {Number} x The X value the debug info will start from.
    * @param {Number} y The Y value the debug info will start from.
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

    renderQuadTree: function (quadtree, color) {

        color = color || 'rgba(255,0,0,0.3)';

        this.start();

        var bounds = quadtree.bounds;

        if (quadtree.nodes.length === 0)
        {
            this.context.strokeStyle = color;
            this.context.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
            this.renderText(quadtree.ID + ' / ' + quadtree.objects.length, bounds.x + 4, bounds.y + 16, 'rgb(0,200,0)', '12px Courier');
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

    renderSpriteCorners: function (sprite, showText, showBounds, color) {

        if (this.context == null)
        {
            return;
        }

        showText = showText || false;
        showBounds = showBounds || false;
        color = color || 'rgb(255,0,255)';

        this.start(0, 0, color);

        if (showBounds)
        {
            this.context.strokeStyle = 'rgba(255,0,255,0.5)';
            this.context.strokeRect(sprite.bounds.x, sprite.bounds.y, sprite.bounds.width, sprite.bounds.height);
            this.context.stroke();
        }

        this.context.beginPath();
        this.context.moveTo(sprite.topLeft.x, sprite.topLeft.y);
        this.context.lineTo(sprite.topRight.x, sprite.topRight.y);
        this.context.lineTo(sprite.bottomRight.x, sprite.bottomRight.y);
        this.context.lineTo(sprite.bottomLeft.x, sprite.bottomLeft.y);
        this.context.closePath();
        this.context.strokeStyle = 'rgba(0,0,255,0.8)';
        this.context.stroke();

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
    * Render debug infos. (including id, position, rotation, scrolling factor, worldBounds and some other properties)
    * @param x {number} X position of the debug info to be rendered.
    * @param y {number} Y position of the debug info to be rendered.
    * @param [color] {number} color of the debug info to be rendered. (format is css color string)
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
    * Render debug infos. (including id, position, rotation, scrolling factor, worldBounds and some other properties)
    * @param x {number} X position of the debug info to be rendered.
    * @param y {number} Y position of the debug info to be rendered.
    * @param [color] {number} color of the debug info to be rendered. (format is css color string)
    */
    renderCameraInfo: function (camera, x, y, color) {

        if (this.context == null)
        {
            return;
        }

        color = color || 'rgb(255,255,0)';

        this.start(x, y, color);
        this.line('Camera (' + camera.width + ' x ' + camera.height + ')');
        this.line('X: ' + camera.x + ' Y: ' + camera.y);
        this.stop();
        
    },

    /**
    * Renders the Pointer.circle object onto the stage in green if down or red if up.
    * @method renderDebug
    */
    renderPointer: function (pointer, hideIfUp, downColor, upColor, color) {

        if (this.context == null || pointer == null)
        {
            return;
        }

        hideIfUp = hideIfUp || false;
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
    * Render Sprite Input Debug information
    * @param x {number} X position of the debug info to be rendered.
    * @param y {number} Y position of the debug info to be rendered.
    * @param [color] {number} color of the debug info to be rendered. (format is css color string)
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
    * @param x {number} X position of the debug info to be rendered.
    * @param y {number} Y position of the debug info to be rendered.
    * @param [color] {number} color of the debug info to be rendered. (format is css color string)
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
    * Render debug infos. (including name, bounds info, position and some other properties)
    * @param x {number} X position of the debug info to be rendered.
    * @param y {number} Y position of the debug info to be rendered.
    * @param [color] {number} color of the debug info to be rendered. (format is css color string)
    */
    renderSpriteInfo: function (sprite, x, y, color) {

        if (this.context == null)
        {
            return;
        }

        color = color || 'rgb(255, 255, 255)';

        this.start(x, y, color);

        this.line('Sprite: ' + ' (' + sprite.width + ' x ' + sprite.height + ') anchor: ' + sprite.anchor.x + ' x ' + sprite.anchor.y);
        this.line('x: ' + sprite.x.toFixed(1) + ' y: ' + sprite.y.toFixed(1) + ' rotation: ' + sprite.rotation.toFixed(1));
        this.line('visible: ' + sprite.visible);
        this.line('in camera: ' + sprite.inCamera);

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

        // this.line('inCamera: ' + this.game.renderer.spriteRenderer.inCamera(this.game.camera, sprite));

    },

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

    },

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
        this.line('sX:     ' + sprite._sx);
        this.line('sY:     ' + sprite._sy);

    },

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

    renderSpriteBounds: function (sprite, color) {

        if (this.context == null)
        {
            return;
        }

        color = color || 'rgba(0, 255, 0, 0.2)';

        this.start();
        this.context.fillStyle = color;
        this.context.fillRect(sprite.worldView.x, sprite.worldView.y, sprite.worldView.width, sprite.worldView.height);
        this.stop();

    },

    renderPixel: function (x, y, fillStyle) {

        if (this.context == null)
        {
            return;
        }

        fillStyle = fillStyle || 'rgba(0,255,0,1)';

        this.start();
        this.context.fillStyle = fillStyle;
        this.context.fillRect(x, y, 2, 2);
        this.stop();

    },

    renderPoint: function (point, fillStyle) {

        if (this.context == null)
        {
            return;
        }

        fillStyle = fillStyle || 'rgba(0,255,0,1)';

        this.start();
        this.context.fillStyle = fillStyle;
        this.context.fillRect(point.x, point.y, 4, 4);
        this.stop();

    },

    renderRectangle: function (rect, fillStyle) {

        if (this.context == null)
        {
            return;
        }

        fillStyle = fillStyle || 'rgba(0,255,0,0.3)';

        this.start();
        this.context.fillStyle = fillStyle;
        this.context.fillRect(rect.x, rect.y, rect.width, rect.height);
        this.stop();
        
    },

    renderCircle: function (circle, fillStyle) {

        if (this.context == null)
        {
            return;
        }

        fillStyle = fillStyle || 'rgba(0,255,0,0.3)';

        this.start();
        this.context.beginPath();
        this.context.fillStyle = fillStyle;
        this.context.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, false);
        this.context.fill();
        this.context.closePath();
        this.stop();

    },

    /**
    * Render text
    * @param x {number} X position of the debug info to be rendered.
    * @param y {number} Y position of the debug info to be rendered.
    * @param [color] {number} color of the debug info to be rendered. (format is css color string)
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

    }

};

/**
* A collection of methods useful for manipulating and comparing colors.
*
* @class 		Color
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
* @module       Phaser
*/

Phaser.Color = {

	/**
    * Given an alpha and 3 color values this will return an integer representation of it
    *
    * @method getColor32
    * @param {Number} alpha The Alpha value (between 0 and 255)
    * @param {Number} red The Red channel value (between 0 and 255)
    * @param {Number} green The Green channel value (between 0 and 255)
    * @param {Number} blue The Blue channel value (between 0 and 255)
    * @return {Number} A native color value integer (format: 0xAARRGGBB)
    */
    getColor32: function (alpha, red, green, blue) {
        return alpha << 24 | red << 16 | green << 8 | blue;
    },

	/**
    * Given 3 color values this will return an integer representation of it.
    *
    * @method getColor
    * @param {Number} red The Red channel value (between 0 and 255)
    * @param {Number} green The Green channel value (between 0 and 255)
    * @param {Number} blue The Blue channel value (between 0 and 255)
    * @return {Number} A native color value integer (format: 0xRRGGBB)
    */
    getColor: function (red, green, blue) {
        return red << 16 | green << 8 | blue;
    },

	/**
    * Converts the given hex string into an object containing the RGB values.
    *
    * @method hexToRGB
    * @param {String} The string hex color to convert.
    * @return {Object} An object with 3 properties: r,g and b.
    */
    hexToRGB: function (h) {

        var hex16 = (h.charAt(0) == "#") ? h.substring(1, 7) : h;
        var red = parseInt(hex16.substring(0, 2), 16);
        var green = parseInt(hex16.substring(2, 4), 16);
        var blue = parseInt(hex16.substring(4, 6), 16);

        return red << 16 | green << 8 | blue;
        
    },

	/**
    * Returns a string containing handy information about the given color including string hex value,
    * RGB format information and HSL information. Each section starts on a newline, 3 lines in total.
    *
    * @method getColorInfo
    * @param {Number} color A color value in the format 0xAARRGGBB
    * @return {String} string containing the 3 lines of information
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
    * Return a string representation of the color in the format 0xAARRGGBB
    *
    * @method RGBtoHexstring
    * @param {Number} color The color to get the string representation for
    * @return {String A string of length 10 characters in the format 0xAARRGGBB
    */
    RGBtoHexstring: function (color) {
        var argb = Phaser.Color.getRGB(color);
        return "0x" + Phaser.Color.colorToHexstring(argb.alpha) + Phaser.Color.colorToHexstring(argb.red) + Phaser.Color.colorToHexstring(argb.green) + Phaser.Color.colorToHexstring(argb.blue);
    },

	/**
    * Return a string representation of the color in the format #RRGGBB
    *
    * @method RGBtoWebstring
    * @param {Number} color The color to get the string representation for
    * @return {String} A string of length 10 characters in the format 0xAARRGGBB
    */
    RGBtoWebstring: function (color) {
        var argb = Phaser.Color.getRGB(color);
        return "#" + Phaser.Color.colorToHexstring(argb.red) + Phaser.Color.colorToHexstring(argb.green) + Phaser.Color.colorToHexstring(argb.blue);
    },

	/**
    * Return a string containing a hex representation of the given color
    *
    * @method colorToHexstring
    * @param {Number} color The color channel to get the hex value for, must be a value between 0 and 255)
    * @return {String} A string of length 2 characters, i.e. 255 = FF, 0 = 00
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
    * @method interpolateColor
    * @param {Number} color1
    * @param {Number} color2
    * @param {Number} steps
    * @param {Number} currentStep
    * @param {Number} alpha
    * @return {Number} The interpolated color value.
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
    * @method interpolateColorWithRGB
    * @param {Number} color
    * @param {Number} r
    * @param {Number} g
    * @param {Number} b
    * @param {Number} steps
    * @param {Number} currentStep
    * @return {Number} The interpolated color value.
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
    * @method interpolateRGB
    * @param {Number} r1
    * @param {Number} g1
    * @param {Number} b1
    * @param {Number} r2
    * @param {Number} g2
    * @param {Number} b2
    * @param {Number} steps
    * @param {Number} currentStep
    * @return {Number} The interpolated color value.
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
    * @method getRandomColor
    * @param {Number} min The lowest value to use for the color
    * @param {Number} max The highest value to use for the color
    * @param {Number} alpha The alpha value of the returning color (default 255 = fully opaque)
    * @return {Number} 32-bit color value with alpha
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
    * @method getRGB
    * @param {Number} color in RGB (0xRRGGBB) or ARGB format (0xAARRGGBB)
    * @return {Object} An Object with properties: alpha, red, green, blue
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
    * @method getWebRGB
    * @param {Number} color
    * @return {String} A string in the format: 'rgba(r,g,b,a)'
    */
    getWebRGB: function (color) {
        var alpha = (color >>> 24) / 255;
        var red = color >> 16 & 0xFF;
        var green = color >> 8 & 0xFF;
        var blue = color & 0xFF;
        return 'rgba(' + red.toString() + ',' + green.toString() + ',' + blue.toString() + ',' + alpha.toString() + ')';
    },

	/**
    * Given a native color value (in the format 0xAARRGGBB) this will return the Alpha component, as a value between 0 and 255
    *
    * @method getAlpha
    * @param {Number} color In the format 0xAARRGGBB
    * @return {Number} The Alpha component of the color, will be between 0 and 1 (0 being no Alpha (opaque), 1 full Alpha (transparent))
    */
    getAlpha: function (color) {
        return color >>> 24;
    },

	/**
    * Given a native color value (in the format 0xAARRGGBB) this will return the Alpha component as a value between 0 and 1
    *
    * @method getAlphaFloat
    * @param {Number} color In the format 0xAARRGGBB
    * @return {Number} The Alpha component of the color, will be between 0 and 1 (0 being no Alpha (opaque), 1 full Alpha (transparent))
    */
    getAlphaFloat: function (color) {
        return (color >>> 24) / 255;
    },

	/**
    * Given a native color value (in the format 0xAARRGGBB) this will return the Red component, as a value between 0 and 255
    *
    * @method getRed
    * @param {Number} color In the format 0xAARRGGBB
    * @return {Number} The Red component of the color, will be between 0 and 255 (0 being no color, 255 full Red)
    */
    getRed: function (color) {
        return color >> 16 & 0xFF;
    },

	/**
    * Given a native color value (in the format 0xAARRGGBB) this will return the Green component, as a value between 0 and 255
    *
    * @method getGreen
    * @param {Number} color In the format 0xAARRGGBB
    * @return {Number} The Green component of the color, will be between 0 and 255 (0 being no color, 255 full Green)
    */
    getGreen: function (color) {
        return color >> 8 & 0xFF;
    },

	/**
    * Given a native color value (in the format 0xAARRGGBB) this will return the Blue component, as a value between 0 and 255
    *
    * @method getBlue
    * @param {Number} color In the format 0xAARRGGBB
    * @return {Number} The Blue component of the color, will be between 0 and 255 (0 being no color, 255 full Blue)
    */
    getBlue: function (color) {
        return color & 0xFF;
    }
	
};

Phaser.Physics = {};

Phaser.Physics.Arcade = function (game) {
	
	this.game = game;

	this.gravity = new Phaser.Point;
	this.bounds = new Phaser.Rectangle(0, 0, game.world.width, game.world.height);

	/**
	* Used by the QuadTree to set the maximum number of objects
	* @type {number}
	*/
	this.maxObjects = 10;

	/**
	* Used by the QuadTree to set the maximum number of levels
	* @type {number}
	*/
	this.maxLevels = 4;

	this.OVERLAP_BIAS = 4;
	this.TILE_OVERLAP = false;

    this.quadTree = new Phaser.QuadTree(this, this.game.world.bounds.x, this.game.world.bounds.y, this.game.world.bounds.width, this.game.world.bounds.height, this.maxObjects, this.maxLevels);
	this.quadTreeID = 0;

	//	Avoid gc spikes by caching these values for re-use
	this._bounds1 = new Phaser.Rectangle;
	this._bounds2 = new Phaser.Rectangle;
	this._overlap = 0;
	this._maxOverlap = 0;
	this._velocity1 = 0;
	this._velocity2 = 0;
	this._newVelocity1 = 0;
	this._newVelocity2 = 0;
	this._average = 0;
    this._mapData = [];
    this._result = false;
    this._total = 0;

};

Phaser.Physics.Arcade.prototype = {

    updateMotion: function (body) {

    	//	Rotation
        this._velocityDelta = (this.computeVelocity(0, false, body.angularVelocity, body.angularAcceleration, body.angularDrag, body.maxAngular) - body.angularVelocity) / 2;
        body.angularVelocity += this._velocityDelta;
        body.rotation += body.angularVelocity * this.game.time.physicsElapsed;

    	//	Horizontal
        this._velocityDelta = (this.computeVelocity(1, body, body.velocity.x, body.acceleration.x, body.drag.x) - body.velocity.x) / 2;
        body.velocity.x += this._velocityDelta;
	    this._delta = body.velocity.x * this.game.time.physicsElapsed;
        body.x += this._delta;

    	//	Vertical
        this._velocityDelta = (this.computeVelocity(2, body, body.velocity.y, body.acceleration.y, body.drag.y) - body.velocity.y) / 2;
        body.velocity.y += this._velocityDelta;
        this._delta = body.velocity.y * this.game.time.physicsElapsed;
        body.y += this._delta;

    },

	/**
    * A tween-like function that takes a starting velocity and some other factors and returns an altered velocity.
    *
    * @param {number} Velocity Any component of velocity (e.g. 20).
    * @param {number} Acceleration Rate at which the velocity is changing.
    * @param {number} Drag Really kind of a deceleration, this is how much the velocity changes if Acceleration is not set.
    * @param {number} Max An absolute value cap for the velocity.
    *
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
                velocity = velocity - this._drag;
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

        if (velocity != 0)
        {
            if (velocity > max)
            {
                velocity = max;
            }
            else if (velocity < -max)
            {
                velocity = -max;
            }
        }

        return velocity;

    },

    preUpdate: function () {

        //  Clear the tree
        this.quadTree.clear();

    	//	Create our tree which all of the Physics bodies will add themselves to
        this.quadTreeID = 0;
    	this.quadTree = new Phaser.QuadTree(this, this.game.world.bounds.x, this.game.world.bounds.y, this.game.world.bounds.width, this.game.world.bounds.height, this.maxObjects, this.maxLevels);

    },

    postUpdate: function () {

    	//	Clear the tree ready for the next update
    	this.quadTree.clear();

    },

    /**
    * Checks for collision between two game objects. The objects can be Sprites, Groups, Emitters or Tilemaps.
    * You can perform Sprite vs. Sprite, Sprite vs. Group, Group vs. Group, Sprite vs. Tilemap or Group vs. Tilemap collisions.
    *
    * @param object1 The first object to check. Can be an instance of Phaser.Sprite, Phaser.Group, Phaser.Particles.Emitter, or Phaser.Tilemap
    * @param object2 The second object to check. Can be an instance of Phaser.Sprite, Phaser.Group, Phaser.Particles.Emitter or Phaser.Tilemap
    * @param collideCallback An optional callback function that is called if the objects overlap. The two objects will be passed to this function in the same order in which you passed them to Collision.overlap.
    * @param processCallback A callback function that lets you perform additional checks against the two objects if they overlap. If this is set then collideCallback will only be called if processCallback returns true.
    * @param callbackContext The context in which to run the callbacks.
    * @returns {boolean} true if any collisions were detected, otherwise false.
    **/
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
                else if (object2.type == Phaser.TILEMAP)
                {
                    this.collideSpriteVsTilemap(object1, object2, collideCallback, processCallback, callbackContext);
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
                else if (object2.type == Phaser.TILEMAP)
                {
                    this.collideGroupVsTilemap(object1, object2, collideCallback, processCallback, callbackContext);
                }
            }
            //  TILEMAPS
            else if (object1.type == Phaser.TILEMAP)
            {
                if (object2.type == Phaser.SPRITE)
                {
                    this.collideSpriteVsTilemap(object2, object1, collideCallback, processCallback, callbackContext);
                }
                else if (object2.type == Phaser.GROUP || object2.type == Phaser.EMITTER)
                {
                    this.collideGroupVsTilemap(object2, object1, collideCallback, processCallback, callbackContext);
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
                else if (object2.type == Phaser.TILEMAP)
                {
                    this.collideGroupVsTilemap(object1, object2, collideCallback, processCallback, callbackContext);
                }
            }
        }

        return (this._total > 0);

    },

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

    collideGroupVsTilemap: function (group, tilemap, collideCallback, processCallback, callbackContext) {

        if (group._container.first._iNext)
        {
            var currentNode = group._container.first._iNext;
                
            do  
            {
                if (currentNode.exists)
                {
                    this.collideSpriteVsTilemap(currentNode, tilemap, collideCallback, processCallback, callbackContext);
                }
                currentNode = currentNode._iNext;
            }
            while (currentNode != group._container.last._iNext);
        }

    },

    collideSpriteVsTilemap: function (sprite, tilemap, collideCallback, processCallback, callbackContext) {

        this._mapData = tilemap.collisionLayer.getTileOverlaps(sprite);

        //  If the sprite actually collided with the tilemap then _mapData contains an array of the tiles it collided with
        var i = this._mapData.length;

        while (i--)
        {
            if (processCallback)
            {
                //  We've got a custom process callback to hit first
                if (processCallback.call(callbackContext, sprite, this._mapData[i].tile))
                {
                    this._total++;

                    if (collideCallback)
                    {
                        collideCallback.call(callbackContext, sprite, this._mapData[i].tile);
                    }
                }
            }
            else
            {
                this._total++;

                if (collideCallback)
                {
                    collideCallback.call(callbackContext, sprite, this._mapData[i].tile);
                }
            }
        }

    },

    collideSpriteVsGroup: function (sprite, group, collideCallback, processCallback, callbackContext) {

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

    collideGroupVsGroup: function (group1, group2, collideCallback, processCallback, callbackContext) {

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
     * @param body1 The first Sprite.Body to separate
     * @param body2 The second Sprite.Body to separate
     * @returns {boolean} Returns true if the bodies were separated, otherwise false.
     */
    separate: function (body1, body2) {

        this._result = (this.separateX(body1, body2) || this.separateY(body1, body2));

        if (this._result)
        {
            body1.postUpdate();
            body2.postUpdate();
        }

    },

    /**
     * Separates the two physics bodies on their X axis
     * @param body1 The first Sprite.Body to separate
     * @param body2 The second Sprite.Body to separate
     * @returns {boolean} Whether the objects in fact touched and were separated along the X axis.
     */
    separateX: function (body1, body2) {

        //  Can't separate two immovable or non-existing bodys
        if (body1.immovable && body2.immovable)
        {
            return false;
        }

        //  First, get the two body deltas
        this._overlap = 0;

        if (body1.deltaX() != body2.deltaX())
        {
            //  Check if the X hulls actually overlap

            this._bounds1.setTo(body1.x - ((body1.deltaX() > 0) ? body1.deltaX() : 0), body1.lastY, body1.width + ((body1.deltaX() > 0) ? body1.deltaX() : -body1.deltaX()), body1.height);
            this._bounds2.setTo(body2.x - ((body2.deltaX() > 0) ? body2.deltaX() : 0), body2.lastY, body2.width + ((body2.deltaX() > 0) ? body2.deltaX() : -body2.deltaX()), body2.height);

            if ((this._bounds1.right > this._bounds2.x) && (this._bounds1.x < this._bounds2.right) && (this._bounds1.bottom > this._bounds2.y) && (this._bounds1.y < this._bounds2.bottom))
            {
                this._maxOverlap = body1.deltaAbsX() + body2.deltaAbsX() + this.OVERLAP_BIAS;

                //  If they did overlap (and can), figure out by how much and flip the corresponding flags
                if (body1.deltaX() > body2.deltaX())
                {
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
        else
        {
            return false;
        }

    },

    /**
     * Separates the two physics bodies on their Y axis
     * @param body1 The first Sprite.Body to separate
     * @param body2 The second Sprite.Body to separate
     * @returns {boolean} Whether the bodys in fact touched and were separated along the Y axis.
     */
    separateY: function (body1, body2) {

        //  Can't separate two immovable or non-existing bodys
        if (body1.immovable && body2.immovable)
        {
            return false;
        }

        //  First, get the two body deltas
        this._overlap = 0;

        if (body1.deltaY() != body2.deltaY())
        {
            //  Check if the Y hulls actually overlap
            this._bounds1.setTo(body1.x, body1.y - ((body1.deltaY() > 0) ? body1.deltaY() : 0), body1.width, body1.height + body1.deltaAbsY());
            this._bounds2.setTo(body2.x, body2.y - ((body2.deltaY() > 0) ? body2.deltaY() : 0), body2.width, body2.height + body2.deltaAbsY());

            if ((this._bounds1.right > this._bounds2.x) && (this._bounds1.x < this._bounds2.right) && (this._bounds1.bottom > this._bounds2.y) && (this._bounds1.y < this._bounds2.bottom))
            {
                this._maxOverlap = body1.deltaAbsY() + body2.deltaAbsY() + this.OVERLAP_BIAS;

                //  If they did overlap (and can), figure out by how much and flip the corresponding flags
                if (body1.deltaY() > body2.deltaY())
                {
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
        else
        {
            return false;
        }
    },

     /**
     * The core Collision separation function used by Collision.overlap.
     * @param object1 The first GameObject to separate
     * @param object2 The second GameObject to separate
     * @returns {boolean} Returns true if the objects were separated, otherwise false.
     */
    separateTile: function (object, x, y, width, height, mass, collideLeft, collideRight, collideUp, collideDown, separateX, separateY) {

        var separatedY = this.separateTileY(object.body, x, y, width, height, mass, collideUp, collideDown, separateY);
        var separatedX = this.separateTileX(object.body, x, y, width, height, mass, collideLeft, collideRight, separateX);

        if (separatedX || separatedY)
        {
            object.body.postUpdate();
            return true;
        }

        return false;

    },

    /**
     * Separates the two objects on their x axis
     * @param object The GameObject to separate
     * @param tile The Tile to separate
     * @returns {boolean} Whether the objects in fact touched and were separated along the X axis.
     */
    separateTileX: function (object, x, y, width, height, mass, collideLeft, collideRight, separate) {

        //  Can't separate two immovable objects (tiles are always immovable)
        if (object.immovable)
        {
            return false;
        }

        //  First, get the object delta
        this._overlap = 0;

        // console.log('separatedX', x, y, object.deltaX());

        if (object.deltaX() != 0)
        {
            this._bounds1.setTo(object.x, object.y, object.width, object.height);

            if ((this._bounds1.right > x) && (this._bounds1.x < x + width) && (this._bounds1.bottom > y) && (this._bounds1.y < y + height))
            {
                //  The hulls overlap, let's process it
                this._maxOverlap = object.deltaAbsX() + this.OVERLAP_BIAS;

                //  TODO - We need to check if we're already inside of the tile, i.e. jumping through an n-way tile
                //  in which case we didn't ought to separate because it'll look like tunneling

                if (object.deltaX() > 0)
                {
                    //  Going right ...
                    this._overlap = object.x + object.width - x;

                    if ((this._overlap > this._maxOverlap) || !object.allowCollision.right || !collideLeft)
                    {
                        this._overlap = 0;
                    }
                    else
                    {
                        object.touching.right = true;
                    }
                }
                else if (object.deltaX() < 0)
                {
                    //  Going left ...
                    this._overlap = object.x - width - x;

                    if ((-this._overlap > this._maxOverlap) || !object.allowCollision.left || !collideRight)
                    {
                        this._overlap = 0;
                    }
                    else
                    {
                        object.touching.left = true;
                    }
                }
            }
        }

        //  Then adjust their positions and velocities accordingly (if there was any overlap)
        if (this._overlap != 0)
        {
            if (separate)
            {
                object.x = object.x - this._overlap;

                if (object.bounce.x == 0)
                {
                    object.velocity.x = 0;
                }
                else
                {
                    object.velocity.x = -object.velocity.x * object.bounce.x;
                }
            }
            return true;
        }
        else
        {
            return false;
        }

    },

    /**
     * Separates the two objects on their x axis
     * @param object The GameObject to separate
     * @param tile The Tile to separate
     * @returns {boolean} Whether the objects in fact touched and were separated along the X axis.
     */
    separateTileY: function (object, x, y, width, height, mass, collideUp, collideDown, separate) {

        //  Can't separate two immovable objects (tiles are always immovable)
        if (object.immovable)
        {
            return false;
        }

        //  First, get the object delta
        this._overlap = 0;

        if (object.deltaY() != 0)
        {
            this._bounds1.setTo(object.x, object.y, object.width, object.height);

            if ((this._bounds1.right > x) && (this._bounds1.x < x + width) && (this._bounds1.bottom > y) && (this._bounds1.y < y + height))
            {
                //  The hulls overlap, let's process it

                //  Not currently used, may need it so keep for now
                this._maxOverlap = object.deltaAbsY() + this.OVERLAP_BIAS;

                //  TODO - We need to check if we're already inside of the tile, i.e. jumping through an n-way tile
                //  in which case we didn't ought to separate because it'll look like tunneling

                if (object.deltaY() > 0)
                {
                    //  Going down ...
                    this._overlap = object.bottom - y;

                    // if (object.allowCollision.down && collideDown && this._overlap < this._maxOverlap)
                    if ((this._overlap > this._maxOverlap) || !object.allowCollision.down || !collideDown)
                    {
                        this._overlap = 0;
                    }
                    else
                    {
                        object.touching.down = true;
                    }
                }
                else
                {
                    //  Going up ...
                    this._overlap = object.y - height - y;

                    if ((-this._overlap > this._maxOverlap) || !object.allowCollision.up || !collideUp)
                    {
                        this._overlap = 0;
                    }
                    else
                    {
                        object.touching.up = true;
                    }
                }
            }
        }

        //  Then adjust their positions and velocities accordingly (if there was any overlap)
        if (this._overlap != 0)
        {
            if (separate)
            {
                object.y = object.y - this._overlap;

                if (object.bounce.y == 0)
                {
                    object.velocity.y = 0;
                }
                else
                {
                    object.velocity.y = -object.velocity.y * object.bounce.y;
                }
            }
            return true;
        }
        else
        {
            return false;
        }

    },

    /**
    * Given the angle and speed calculate the velocity and return it as a Point
    * 
    * @param    angle   The angle (in degrees) calculated in clockwise positive direction (down = 90 degrees positive, right = 0 degrees positive, up = 90 degrees negative)
    * @param    speed   The speed it will move, in pixels per second sq
    * 
    * @return   A Point where Point.x contains the velocity x value and Point.y contains the velocity y value
    */
    velocityFromAngle: function (angle, speed, point) {

        speed = speed || 0;
        point = point || new Phaser.Point;

        var a = this.game.math.degToRad(angle);

        return point.setTo((Math.cos(a) * speed), (Math.sin(a) * speed));

    },

    /**
     * Sets the source Sprite x/y velocity so it will move directly towards the destination Sprite at the speed given (in pixels per second)<br>
     * If you specify a maxTime then it will adjust the speed (over-writing what you set) so it arrives at the destination in that number of seconds.<br>
     * Timings are approximate due to the way Flash timers work, and irrespective of SWF frame rate. Allow for a variance of +- 50ms.<br>
     * The source object doesn't stop moving automatically should it ever reach the destination coordinates.<br>
     * If you need the object to accelerate, see accelerateTowardsObject() instead
     * Note: Doesn't take into account acceleration, maxVelocity or drag (if you set drag or acceleration too high this object may not move at all)
     * 
     * @param   source      The Sprite on which the velocity will be set
     * @param   dest        The Sprite where the source object will move to
     * @param   speed       The speed it will move, in pixels per second (default is 60 pixels/sec)
     * @param   maxTime     Time given in milliseconds (1000 = 1 sec). If set the speed is adjusted so the source will arrive at destination in the given number of ms
     */
    moveTowardsObject: function (source, dest, speed, maxTime) {

        speed = speed || 60;
        maxTime = maxTime || 0;

        var a = this.angleBetween(source, dest);
        
        if (maxTime > 0)
        {
            var d = this.distanceBetween(source, dest);
            
            //  We know how many pixels we need to move, but how fast?
            speed = d / (maxTime / 1000);
        }
        
        source.body.velocity.x = Math.cos(a) * speed;
        source.body.velocity.y = Math.sin(a) * speed;

    },

    /**
     * Sets the x/y acceleration on the source Sprite so it will move towards the destination Sprite at the speed given (in pixels per second)<br>
     * You must give a maximum speed value, beyond which the Sprite won't go any faster.<br>
     * If you don't need acceleration look at moveTowardsObject() instead.
     * 
     * @param   source          The Sprite on which the acceleration will be set
     * @param   dest            The Sprite where the source object will move towards
     * @param   speed           The speed it will accelerate in pixels per second
     * @param   xSpeedMax       The maximum speed in pixels per second in which the sprite can move horizontally
     * @param   ySpeedMax       The maximum speed in pixels per second in which the sprite can move vertically
     */
    accelerateTowardsObject: function (source, dest, speed, xSpeedMax, ySpeedMax) {

        xSpeedMax = xSpeedMax || 1000;
        ySpeedMax = ySpeedMax || 1000;

        var a = this.angleBetween(source, dest);
        
        source.body.velocity.x = 0;
        source.body.velocity.y = 0;
        
        source.body.acceleration.x = Math.cos(a) * speed;
        source.body.acceleration.y = Math.sin(a) * speed;
        
        source.body.maxVelocity.x = xSpeedMax;
        source.body.maxVelocity.y = ySpeedMax;

    },

    /**
     * Move the given Sprite towards the mouse pointer coordinates at a steady velocity
     * If you specify a maxTime then it will adjust the speed (over-writing what you set) so it arrives at the destination in that number of seconds.<br>
     * Timings are approximate due to the way Flash timers work, and irrespective of SWF frame rate. Allow for a variance of +- 50ms.<br>
     * The source object doesn't stop moving automatically should it ever reach the destination coordinates.<br>
     * 
     * @param   source      The Sprite to move
     * @param   speed       The speed it will move, in pixels per second (default is 60 pixels/sec)
     * @param   maxTime     Time given in milliseconds (1000 = 1 sec). If set the speed is adjusted so the source will arrive at destination in the given number of ms
     */
    moveTowardsMouse: function (source, speed, maxTime) {

        speed = speed || 60;
        maxTime = maxTime || 0;

        var a = this.angleBetweenMouse(source);
        
        if (maxTime > 0)
        {
            var d = this.distanceToMouse(source);
            
            //  We know how many pixels we need to move, but how fast?
            speed = d / (maxTime / 1000);
        }
        
        source.body.velocity.x = Math.cos(a) * speed;
        source.body.velocity.y = Math.sin(a) * speed;

    },

    /**
     * Sets the x/y acceleration on the source Sprite so it will move towards the mouse coordinates at the speed given (in pixels per second)<br>
     * You must give a maximum speed value, beyond which the Sprite won't go any faster.<br>
     * If you don't need acceleration look at moveTowardsMouse() instead.
     * 
     * @param   source          The Sprite on which the acceleration will be set
     * @param   speed           The speed it will accelerate in pixels per second
     * @param   xSpeedMax       The maximum speed in pixels per second in which the sprite can move horizontally
     * @param   ySpeedMax       The maximum speed in pixels per second in which the sprite can move vertically
     */
    accelerateTowardsMouse: function (source, speed, xSpeedMax, ySpeedMax) {

        xSpeedMax = xSpeedMax || 1000;
        ySpeedMax = ySpeedMax || 1000;

        var a = this.angleBetweenMouse(source);
        
        source.body.velocity.x = 0;
        source.body.velocity.y = 0;
        
        source.body.acceleration.x = Math.cos(a) * speed;
        source.body.acceleration.y = Math.sin(a) * speed;
        
        source.body.maxVelocity.x = xSpeedMax;
        source.body.maxVelocity.y = ySpeedMax;

    },

    /**
     * Sets the x/y velocity on the source Sprite so it will move towards the target coordinates at the speed given (in pixels per second)<br>
     * If you specify a maxTime then it will adjust the speed (over-writing what you set) so it arrives at the destination in that number of seconds.<br>
     * Timings are approximate due to the way Flash timers work, and irrespective of SWF frame rate. Allow for a variance of +- 50ms.<br>
     * The source object doesn't stop moving automatically should it ever reach the destination coordinates.<br>
     * 
     * @param   source      The Sprite to move
     * @param   target      The Point coordinates to move the source Sprite towards
     * @param   speed       The speed it will move, in pixels per second (default is 60 pixels/sec)
     * @param   maxTime     Time given in milliseconds (1000 = 1 sec). If set the speed is adjusted so the source will arrive at destination in the given number of ms
     */
    moveTowardsPoint: function (source, target, speed, maxTime) {

        speed = speed || 60;
        maxTime = maxTime || 0;

        var a = this.angleBetweenPoint(source, target);
        
        if (maxTime > 0)
        {
            var d = this.distanceToPoint(source, target);
            
            //  We know how many pixels we need to move, but how fast?
            speed = d / (maxTime / 1000);
        }
        
        source.body.velocity.x = Math.cos(a) * speed;
        source.body.velocity.y = Math.sin(a) * speed;

    },

    /**
     * Sets the x/y acceleration on the source Sprite so it will move towards the target coordinates at the speed given (in pixels per second)<br>
     * You must give a maximum speed value, beyond which the Sprite won't go any faster.<br>
     * If you don't need acceleration look at moveTowardsPoint() instead.
     * 
     * @param   source          The Sprite on which the acceleration will be set
     * @param   target          The Point coordinates to move the source Sprite towards
     * @param   speed           The speed it will accelerate in pixels per second
     * @param   xSpeedMax       The maximum speed in pixels per second in which the sprite can move horizontally
     * @param   ySpeedMax       The maximum speed in pixels per second in which the sprite can move vertically
     */
    accelerateTowardsPoint: function (source, target, speed, xSpeedMax, ySpeedMax) {

        xSpeedMax = xSpeedMax || 1000;
        ySpeedMax = ySpeedMax || 1000;

        var a = this.angleBetweenPoint(source, target);
        
        source.body.velocity.x = 0;
        source.body.velocity.y = 0;
        
        source.body.acceleration.x = Math.cos(a) * speed;
        source.body.acceleration.y = Math.sin(a) * speed;
        
        source.body.maxVelocity.x = xSpeedMax;
        source.body.maxVelocity.y = ySpeedMax;

    },

    /**
     * Find the distance (in pixels, rounded) between two Sprites, taking their origin into account
     * 
     * @param   a   The first Sprite
     * @param   b   The second Sprite
     * @return  int Distance (in pixels)
     */
    distanceBetween: function (a, b) {

        var dx = a.center.x - b.center.x;
        var dy = a.center.y - b.center.y;
        
        return Math.sqrt(dx * dx + dy * dy);

    },

    /**
     * Find the distance (in pixels, rounded) from an Sprite to the given Point, taking the source origin into account
     * 
     * @param   a       The Sprite
     * @param   target  The Point
     * @return  int     Distance (in pixels)
     */
    distanceToPoint: function (a, target) {

        var dx = a.center.x - target.x;
        var dy = a.center.y - target.y;
        
        return Math.sqrt(dx * dx + dy * dy);

    },

    /**
     * Find the distance (in pixels, rounded) from the object x/y and the mouse x/y
     * 
     * @param   a   The Sprite to test against
     * @return  int The distance between the given sprite and the mouse coordinates
     */
    distanceToMouse: function (a) {

        var dx = a.center.x - this.game.input.x;
        var dy = a.center.y - this.game.input.y;
        
        return Math.sqrt(dx * dx + dy * dy);

    },

    /**
     * Find the angle (in radians) between an Sprite and an Point. The source sprite takes its x/y and origin into account.
     * The angle is calculated in clockwise positive direction (down = 90 degrees positive, right = 0 degrees positive, up = 90 degrees negative)
     * 
     * @param   a           The Sprite to test from
     * @param   target      The Point to angle the Sprite towards
     * @param   asDegrees   If you need the value in degrees instead of radians, set to true
     * 
     * @return  Number The angle (in radians unless asDegrees is true)
     */
    angleBetweenPoint: function (a, target, asDegrees) {

        asDegrees = asDegrees || false;

        var dx = target.x - a.center.x;
        var dy = target.y - a.center.y;
        
        if (asDegrees)
        {
            return this.game.math.radToDeg(Math.atan2(dy, dx));
        }
        else
        {
            return Math.atan2(dy, dx);
        }

    },

    /**
     * Find the angle (in radians) between the two Sprite, taking their x/y and origin into account.
     * The angle is calculated in clockwise positive direction (down = 90 degrees positive, right = 0 degrees positive, up = 90 degrees negative)
     * 
     * @param   a           The Sprite to test from
     * @param   b           The Sprite to test to
     * @param   asDegrees   If you need the value in degrees instead of radians, set to true
     * 
     * @return  Number The angle (in radians unless asDegrees is true)
     */
    angleBetween: function (a, b, asDegrees) {

        asDegrees = asDegrees || false;

        var dx = b.center.x - a.center.x;
        var dy = b.center.y - a.center.y;
        
        if (asDegrees)
        {
            return this.game.math.radToDeg(Math.atan2(dy, dx));
        }
        else
        {
            return Math.atan2(dy, dx);
        }

    },

    /**
     * Given the GameObject and speed calculate the velocity and return it as an Point based on the direction the sprite is facing
     * 
     * @param   parent  The Sprite to get the facing value from
     * @param   speed   The speed it will move, in pixels per second sq
     * 
     * @return  An Point where Point.x contains the velocity x value and Point.y contains the velocity y value
     */
    velocityFromFacing: function (parent, speed) {

        /*
        var a;
        
        if (parent.facing == Collision.LEFT)
        {
            a = this._game.math.degreesToRadians(180);
        }
        else if (parent.facing == Collision.RIGHT)
        {
            a = this._game.math.degreesToRadians(0);
        }
        else if (parent.facing == Collision.UP)
        {
            a = this._game.math.degreesToRadians(-90);
        }
        else if (parent.facing == Collision.DOWN)
        {
            a = this._game.math.degreesToRadians(90);
        }
        
        return new Point(Math.cos(a) * speed, Math.sin(a) * speed);
        */

    },
    
    /**
     * Find the angle (in radians) between an Sprite and the mouse, taking their x/y and origin into account.
     * The angle is calculated in clockwise positive direction (down = 90 degrees positive, right = 0 degrees positive, up = 90 degrees negative)
     * 
     * @param   a           The Object to test from
     * @param   asDegrees   If you need the value in degrees instead of radians, set to true
     * 
     * @return  Number The angle (in radians unless asDegrees is true)
     */
    angleBetweenMouse: function (a, asDegrees) {

        asDegrees = asDegrees || false;

        var dx = this.game.input.x - a.bounds.x;
        var dy = this.game.input.y - a.bounds.y;
        
        if (asDegrees)
        {
            return this.game.math.radToDeg(Math.atan2(dy, dx));
        }
        else
        {
            return Math.atan2(dy, dx);
        }
    }

};

Phaser.Physics.Arcade.Body = function (sprite) {

	this.sprite = sprite;
	this.game = sprite.game;

	this.offset = new Phaser.Point;

	this.x = sprite.x;
	this.y = sprite.y;

	//	un-scaled original size
	this.sourceWidth = sprite.currentFrame.sourceSizeW;
	this.sourceHeight = sprite.currentFrame.sourceSizeH;

	//	calculated (scaled) size
	this.width = sprite.currentFrame.sourceSizeW;
	this.height = sprite.currentFrame.sourceSizeH;
	this.halfWidth = Math.floor(sprite.currentFrame.sourceSizeW / 2);
	this.halfHeight = Math.floor(sprite.currentFrame.sourceSizeH / 2);

	//	Scale value cache
	this._sx = sprite.scale.x;
	this._sy = sprite.scale.y;

    this.velocity = new Phaser.Point;
    this.acceleration = new Phaser.Point;
    this.drag = new Phaser.Point;
    this.gravity = new Phaser.Point;
    this.bounce = new Phaser.Point;
    this.maxVelocity = new Phaser.Point(10000, 10000);

    this.angularVelocity = 0;
    this.angularAcceleration = 0;
    this.angularDrag = 0;
    this.maxAngular = 1000;
    this.mass = 1;

    this.quadTreeIDs = [];
    this.quadTreeIndex = -1;

    //	Allow collision
    this.allowCollision = { none: false, any: true, up: true, down: true, left: true, right: true };
    this.touching = { none: true, up: false, down: false, left: false, right: false };
    this.wasTouching = { none: true, up: false, down: false, left: false, right: false };

    this.immovable = false;
    this.moves = true;
    this.rotation = 0;
    this.allowRotation = true;
    this.allowGravity = true;

    //	These two flags allow you to disable the custom separation that takes place
    //	Used in combination with your own collision processHandler you can create whatever
    //	type of collision response you need.
    this.customSeparateX = false;
    this.customSeparateY = false;

    //	When this body collides with another the amount of overlap is stored in here
    //	These values are useful if you want to provide your own custom separation logic.
    this.overlapX = 0;
    this.overlapY = 0;

    this.collideWorldBounds = false;

	this.lastX = sprite.x;
	this.lastY = sprite.y;

};

Phaser.Physics.Arcade.Body.prototype = {

	updateBounds: function (centerX, centerY, scaleX, scaleY) {

		if (scaleX != this._sx || scaleY != this._sy)
		{
			this.width = this.sourceWidth * scaleX;
			this.height = this.sourceHeight * scaleY;
			this.halfWidth = Math.floor(this.width / 2);
			this.halfHeight = Math.floor(this.height / 2);
			this._sx = scaleX;
			this._sy = scaleY;
		}

	},

	update: function () {

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

		this.lastX = this.x;
		this.lastY = this.y;
		this.rotation = this.sprite.angle;

		this.x = (this.sprite.x - (this.sprite.anchor.x * this.width)) + this.offset.x;
		this.y = (this.sprite.y - (this.sprite.anchor.y * this.height)) + this.offset.y;

		if (this.moves)
		{
			this.game.physics.updateMotion(this);
		}

		if (this.collideWorldBounds)
		{
			this.checkWorldBounds();
		}

		if (this.allowCollision.none == false && this.sprite.visible && this.sprite.alive)
		{
		    this.quadTreeIDs = [];
		    this.quadTreeIndex = -1;
			this.game.physics.quadTree.insert(this);
		}

		//	Adjust the sprite based on all of the above, so the x/y coords will be correct going into the State update
		this.sprite.x = this.x - this.offset.x + (this.sprite.anchor.x * this.width);
		this.sprite.y = this.y - this.offset.y + (this.sprite.anchor.y * this.height);

		if (this.allowRotation)
		{
			this.sprite.angle = this.rotation;
		}

	},

	postUpdate: function () {

		this.sprite.x = this.x - this.offset.x + (this.sprite.anchor.x * this.width);
		this.sprite.y = this.y - this.offset.y + (this.sprite.anchor.y * this.height);

		if (this.allowRotation)
		{
			this.sprite.angle = this.rotation;
		}

	},

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

	},

	reset: function () {

		this.velocity.setTo(0, 0);
		this.acceleration.setTo(0, 0);

	    this.angularVelocity = 0;
	    this.angularAcceleration = 0;

		this.x = (this.sprite.x - (this.sprite.anchor.x * this.width)) + this.offset.x;
		this.y = (this.sprite.y - (this.sprite.anchor.y * this.height)) + this.offset.y;
		this.lastX = this.x;
		this.lastY = this.y;

	},

    deltaAbsX: function () {
        return (this.deltaX() > 0 ? this.deltaX() : -this.deltaX());
    },

    deltaAbsY: function () {
        return (this.deltaY() > 0 ? this.deltaY() : -this.deltaY());
    },

    deltaX: function () {
        return this.x - this.lastX;
    },

    deltaY: function () {
        return this.y - this.lastY;
    }

};

Object.defineProperty(Phaser.Physics.Arcade.Body.prototype, "bottom", {
    
    /**
    * The sum of the y and height properties. Changing the bottom property of a Rectangle object has no effect on the x, y and width properties, but does change the height property.
    * @method bottom
    * @return {Number}
    **/
    get: function () {
        return this.y + this.height;
    },

    /**
    * The sum of the y and height properties. Changing the bottom property of a Rectangle object has no effect on the x, y and width properties, but does change the height property.
    * @method bottom
    * @param {Number} value
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

Object.defineProperty(Phaser.Physics.Arcade.Body.prototype, "right", {
    
    /**
    * The sum of the x and width properties. Changing the right property of a Rectangle object has no effect on the x, y and height properties.
    * However it does affect the width property.
    * @method right
    * @return {Number}
    **/    
    get: function () {
        return this.x + this.width;
    },

    /**
    * The sum of the x and width properties. Changing the right property of a Rectangle object has no effect on the x, y and height properties.
    * However it does affect the width property.
    * @method right
    * @param {Number} value
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

Phaser.Particles = function (game) {

	this.emitters = {};

	this.ID = 0;

};

Phaser.Particles.prototype = {

	emitters: null,

	add: function (emitter) {

		this.emitters[emitter.name] = emitter;

		return emitter;

	},

	remove: function (emitter) {

		delete this.emitters[emitter.name];

	},

	update: function () {

		for (var key in this.emitters)
		{
			if (this.emitters[key].exists)
			{
				this.emitters[key].update();
			}
		}

	},

};
Phaser.Particles.Arcade = {}
/**
* Phaser - ArcadeEmitter
*
* Emitter is a lightweight particle emitter. It can be used for one-time explosions or for
* continuous effects like rain and fire. All it really does is launch Particle objects out
* at set intervals, and fixes their positions and velocities accorindgly.
*/

Phaser.Particles.Arcade.Emitter = function (game, x, y, maxParticles) {

	maxParticles = maxParticles || 50;

	Phaser.Group.call(this, game);

    this.name = 'emitter' + this.game.particles.ID++;

    this.type = Phaser.EMITTER;

    /**
     * The X position of the top left corner of the emitter in world space.
     */
    this.x = 0;

    /**
     * The Y position of the top left corner of emitter in world space.
     */
    this.y = 0;

    /**
     * The width of the emitter.  Particles can be randomly generated from anywhere within this box.
     */
    this.width = 1;

    /**
     * The height of the emitter.  Particles can be randomly generated from anywhere within this box.
     */
    this.height = 1;

    /**
     * The minimum possible velocity of a particle.
     * The default value is (-100,-100).
     */
    this.minParticleSpeed = new Phaser.Point(-100, -100);

    /**
     * The maximum possible velocity of a particle.
     * The default value is (100,100).
     */
    this.maxParticleSpeed = new Phaser.Point(100, 100);

    /**
     * The minimum possible scale of a particle.
     * The default value is 1.
     */
    this.minParticleScale = 1;

    /**
     * The maximum possible scale of a particle.
     * The default value is 1.
     */
    this.maxParticleScale = 1;

    /**
     * The minimum possible angular velocity of a particle.  The default value is -360.
     */
    this.minRotation = -360;

    /**
     * The maximum possible angular velocity of a particle.  The default value is 360.
     */
    this.maxRotation = 360;

    /**
     * Sets the <code>gravity.y</code> of each particle to this value on launch.
     */
    this.gravity = 2;

    /**
     * Set your own particle class type here.
     * Default is <code>Particle</code>.
     */
    this.particleClass = null;

    /**
     * The X and Y drag component of particles launched from the emitter.
     */
    this.particleDrag = new Phaser.Point();

    /**
     * How often a particle is emitted in ms (if emitter is started with Explode == false).
     */
    this.frequency = 100;

    /**
     * The total number of particles in this emitter.
     */
    this.maxParticles = maxParticles;

    /**
     * How long each particle lives once it is emitted in ms. Default is 2 seconds.
     * Set lifespan to 'zero' for particles to live forever.
     */
    this.lifespan = 2000;

    /**
     * How much each particle should bounce.  1 = full bounce, 0 = no bounce.
     */
    this.bounce = 0;

    /**
     * Internal helper for deciding how many particles to launch.
     */
    this._quantity = 0;

   /**
     * Internal helper for deciding when to launch particles or kill them.
     */
    this._timer = 0;

    /**
     * Internal counter for figuring out how many particles to launch.
     */
    this._counter = 0;

    /**
     * Internal helper for the style of particle emission (all at once, or one at a time).
     */
    this._explode = true;

    /**
     * Determines whether the emitter is currently emitting particles.
     * It is totally safe to directly toggle this.
     */
    this.on = false;

    /**
     * Determines whether the emitter is being updated by the core game loop.
     */
    this.exists = true;

    /**
     * The point the particles are emitted from.
     * Emitter.x and Emitter.y control the containers location, which updates all current particles
     * Emitter.emitX and Emitter.emitY control the emission location relative to the x/y position.
     */
    this.emitX = x;
    this.emitY = y;
	
};

Phaser.Particles.Arcade.Emitter.prototype = Object.create(Phaser.Group.prototype);
Phaser.Particles.Arcade.Emitter.prototype.constructor = Phaser.Particles.Arcade.Emitter;

/**
 * Called automatically by the game loop, decides when to launch particles and when to "die".
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
 * @param graphics If you opted to not pre-configure an array of Sprite objects, you can simply pass in a particle image or sprite sheet.
 * @param quantity {number} The number of particles to generate when using the "create from image" option.
 * @param multiple {boolean} Whether the image in the Graphics param is a single particle or a bunch of particles (if it's a bunch, they need to be square!).
 * @param collide {number}  Whether the particles should be flagged as not 'dead' (non-colliding particles are higher performance).  0 means no collisions, 0-1 controls scale of particle's bounding box.
 *
 * @return  This Emitter instance (nice for chaining stuff together, if you're into that).
 */
Phaser.Particles.Arcade.Emitter.prototype.makeParticles = function (keys, frames, quantity, collide) {

    if (typeof frames == 'undefined')
    {
        frames = 0;
    }

	quantity = quantity || this.maxParticles;
	collide = collide || 0;

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
 */
Phaser.Particles.Arcade.Emitter.prototype.kill = function () {

    this.on = false;
    this.alive = false;
    this.exists = false;

}

/**
 * Handy for bringing game objects "back to life". Just sets alive and exists back to true.
 * In practice, this is most often called by <code>Object.reset()</code>.
 */
Phaser.Particles.Arcade.Emitter.prototype.revive = function () {

    this.alive = true;
    this.exists = true;

}

/**
 * Call this function to start emitting particles.
 *
 * @param explode {boolean} Whether the particles should all burst out at once.
 * @param lifespan {number} How long each particle lives once emitted. 0 = forever.
 * @param frequency {number} Ignored if Explode is set to true. Frequency is how often to emit a particle in ms.
 * @param quantity {number} How many particles to launch. 0 = "all of the particles".
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
	this._quantity += quantity;

    this._counter = 0;
    this._timer = this.game.time.now + frequency;

}

/**
 * This function can be used both internally and externally to emit the next particle.
 */
Phaser.Particles.Arcade.Emitter.prototype.emitParticle = function () {

    var particle = this.getFirstExists(false);

    if (particle == null)
    {
    	return;
    }

    if (this.width > 1 || this.height > 1)
    {
    	particle.reset(this.emiteX - this.game.rnd.integerInRange(this.left, this.right), this.emiteY - this.game.rnd.integerInRange(this.top, this.bottom));
    }
    else
    {
    	particle.reset(this.emitX, this.emitY);
    }

    particle.lifespan = this.lifespan;

    particle.body.bounce.setTo(this.bounce, this.bounce);

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

}

/**
 * A more compact way of setting the width and height of the emitter.
 *
 * @param width {number} The desired width of the emitter (particles are spawned randomly within these dimensions).
 * @param height {number} The desired height of the emitter.
 */
Phaser.Particles.Arcade.Emitter.prototype.setSize = function (width, height) {

    this.width = width;
    this.height = height;

}

/**
 * A more compact way of setting the X velocity range of the emitter.
 *
 * @param Min {number} The minimum value for this range.
 * @param Max {number} The maximum value for this range.
 */
Phaser.Particles.Arcade.Emitter.prototype.setXSpeed = function (min, max) {

	min = min || 0;
	max = max || 0;

    this.minParticleSpeed.x = min;
    this.maxParticleSpeed.x = max;

}

/**
 * A more compact way of setting the Y velocity range of the emitter.
 *
 * @param Min {number} The minimum value for this range.
 * @param Max {number} The maximum value for this range.
 */
Phaser.Particles.Arcade.Emitter.prototype.setYSpeed = function (min, max) {

	min = min || 0;
	max = max || 0;

    this.minParticleSpeed.y = min;
    this.maxParticleSpeed.y = max;

}

/**
 * A more compact way of setting the angular velocity constraints of the emitter.
 *
 * @param Min {number} The minimum value for this range.
 * @param Max {number} The maximum value for this range.
 */
Phaser.Particles.Arcade.Emitter.prototype.setRotation = function (min, max) {

	min = min || 0;
	max = max || 0;

    this.minRotation = min;
    this.maxRotation = max;

}

/**
 * Change the emitter's midpoint to match the midpoint of a <code>Object</code>.
 *
 * @param Object {object} The <code>Object</code> that you want to sync up with.
 */
Phaser.Particles.Arcade.Emitter.prototype.at = function (object) {

    this.emitX = object.center.x;
    this.emitY = object.center.y;

}

Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype, "alpha", {
    
    /**
    * Get the emitter alpha.
    */
    get: function () {
        return this._container.alpha;
    },

    /**
    * Set the emiter alpha value.
    */
    set: function (value) {
        this._container.alpha = value;
    }

});

Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype, "visible", {
    
    /**
    * Get the emitter visible state.
    */
    get: function () {
        return this._container.visible;
    },

    /**
    * Set the emitter visible state.
    */
    set: function (value) {
        this._container.visible = value;
    }

});

Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype, "x", {

    get: function () {
        return this.emitX;
    },

    set: function (value) {
        this.emitX = value;
    }

});

Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype, "y", {

    get: function () {
        return this.emitY;
    },

    set: function (value) {
        this.emitY = value;
    }

});

Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype, "left", {
    
    get: function () {
        return Math.floor(this.x - (this.width / 2));
    }

});

Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype, "right", {
    
    get: function () {
        return Math.floor(this.x + (this.width / 2));
    }

});

Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype, "top", {
    
    get: function () {
        return Math.floor(this.y - (this.height / 2));
    }

});

Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype, "bottom", {
    
    get: function () {
        return Math.floor(this.y + (this.height / 2));
    }

});

/**
* Phaser - Tilemap
*
* This GameObject allows for the display of a tilemap within the game world. Tile maps consist of an image, tile data and a size.
* Internally it creates a TilemapLayer for each layer in the tilemap.
*/

/**
* Tilemap constructor
* Create a new <code>Tilemap</code>.
*
* @param game {Phaser.Game} Current game instance.
* @param key {string} Asset key for this map.
* @param mapData {string} Data of this map. (a big 2d array, normally in csv)
* @param format {number} Format of this map data, available: Tilemap.CSV or Tilemap.JSON.
* @param resizeWorld {bool} Resize the world bound automatically based on this tilemap?
* @param tileWidth {number} Width of tiles in this map (used for CSV maps).
* @param tileHeight {number} Height of tiles in this map (used for CSV maps).
*/
Phaser.Tilemap = function (game, key, x, y, resizeWorld, tileWidth, tileHeight) {

    if (typeof resizeWorld === "undefined") { resizeWorld = true; }
    if (typeof tileWidth === "undefined") { tileWidth = 0; }
    if (typeof tileHeight === "undefined") { tileHeight = 0; }

    this.game = game;
    this.group = null;
    this.name = '';
    this.key = key;

    /**
    * Render iteration counter
    */
    this.renderOrderID = 0;

    /**
    * Tilemap collision callback.
    * @type {function}
    */
    this.collisionCallback = null;

    this.exists = true;
    this.visible = true;

    this.tiles = [];
    this.layers = [];

    var map = this.game.cache.getTilemap(key);

    PIXI.DisplayObjectContainer.call(this);
    this.position.x = x;
    this.position.y = y;

    this.type = Phaser.TILEMAP;

    this.renderer = new Phaser.TilemapRenderer(this.game);

    this.mapFormat = map.format;

    switch (this.mapFormat)
    {
        case Phaser.Tilemap.CSV:
            this.parseCSV(map.mapData, key, tileWidth, tileHeight);
            break;

        case Phaser.Tilemap.JSON:
            this.parseTiledJSON(map.mapData, key);
            break;
    }

    if (this.currentLayer && resizeWorld)
    {
        this.game.world.setSize(this.currentLayer.widthInPixels, this.currentLayer.heightInPixels, true);
    }
	
};

//  Needed to keep the PIXI.Sprite constructor in the prototype chain (as the core pixi renderer uses an instanceof check sadly)
Phaser.Tilemap.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
Phaser.Tilemap.prototype.constructor = Phaser.Tilemap;

Phaser.Tilemap.CSV = 0;
Phaser.Tilemap.JSON = 1;

/**
* Parset csv map data and generate tiles.
* @param data {string} CSV map data.
* @param key {string} Asset key for tileset image.
* @param tileWidth {number} Width of its tile.
* @param tileHeight {number} Height of its tile.
*/
Phaser.Tilemap.prototype.parseCSV = function (data, key, tileWidth, tileHeight) {

    var layer = new Phaser.TilemapLayer(this, 0, key, Phaser.Tilemap.CSV, 'TileLayerCSV' + this.layers.length.toString(), tileWidth, tileHeight);

    //  Trim any rogue whitespace from the data
    data = data.trim();

    var rows = data.split("\n");

    for (var i = 0; i < rows.length; i++)
    {
        var column = rows[i].split(",");

        if (column.length > 0)
        {
            layer.addColumn(column);
        }
    }

    layer.updateBounds();
    layer.createCanvas();

    var tileQuantity = layer.parseTileOffsets();

    this.currentLayer = layer;
    this.collisionLayer = layer;
    this.layers.push(layer);

    this.generateTiles(tileQuantity);

};

/**
* Parse JSON map data and generate tiles.
* @param data {string} JSON map data.
* @param key {string} Asset key for tileset image.
*/
Phaser.Tilemap.prototype.parseTiledJSON = function (json, key) {

    for (var i = 0; i < json.layers.length; i++)
    {
        var layer = new Phaser.TilemapLayer(this, i, key, Phaser.Tilemap.JSON, json.layers[i].name, json.tilewidth, json.tileheight);

        //  Check it's a data layer
        if (!json.layers[i].data)
        {
            continue;
        }

        layer.alpha = json.layers[i].opacity;
        layer.visible = json.layers[i].visible;
        layer.tileMargin = json.tilesets[0].margin;
        layer.tileSpacing = json.tilesets[0].spacing;

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
                layer.addColumn(row);
                c = 0;
            }
        }

        layer.updateBounds();
        layer.createCanvas();
        
        var tileQuantity = layer.parseTileOffsets();
        
        this.currentLayer = layer;
        this.collisionLayer = layer;
        this.layers.push(layer);
    }

    this.generateTiles(tileQuantity);

};

/**
* Create tiles of given quantity.
* @param qty {number} Quentity of tiles to be generated.
*/
Phaser.Tilemap.prototype.generateTiles = function (qty) {

    for (var i = 0; i < qty; i++)
    {
        this.tiles.push(new Phaser.Tile(this.game, this, i, this.currentLayer.tileWidth, this.currentLayer.tileHeight));
    }

};

/**
* Set callback to be called when this tilemap collides.
* @param context {object} Callback will be called with this context.
* @param callback {function} Callback function.
*/
Phaser.Tilemap.prototype.setCollisionCallback = function (context, callback) {

    this.collisionCallbackContext = context;
    this.collisionCallback = callback;

};

/**
* Set collision configs of tiles in a range index.
* @param start {number} First index of tiles.
* @param end {number} Last index of tiles.
* @param collision {number} Bit field of flags. (see Tile.allowCollision)
* @param resetCollisions {bool} Reset collision flags before set.
* @param separateX {bool} Enable seprate at x-axis.
* @param separateY {bool} Enable seprate at y-axis.
*/
Phaser.Tilemap.prototype.setCollisionRange = function (start, end, left, right, up, down, resetCollisions, separateX, separateY) {

    if (typeof resetCollisions === "undefined") { resetCollisions = false; }
    if (typeof separateX === "undefined") { separateX = true; }
    if (typeof separateY === "undefined") { separateY = true; }

    for (var i = start; i < end; i++)
    {
        this.tiles[i].setCollision(left, right, up, down, resetCollisions, separateX, separateY);
    }

};

/**
* Set collision configs of tiles with given index.
* @param values {number[]} Index array which contains all tile indexes. The tiles with those indexes will be setup with rest parameters.
* @param collision {number} Bit field of flags. (see Tile.allowCollision)
* @param resetCollisions {bool} Reset collision flags before set.
* @param separateX {bool} Enable seprate at x-axis.
* @param separateY {bool} Enable seprate at y-axis.
*/
Phaser.Tilemap.prototype.setCollisionByIndex = function (values, left, right, up, down, resetCollisions, separateX, separateY) {

    if (typeof resetCollisions === "undefined") { resetCollisions = false; }
    if (typeof separateX === "undefined") { separateX = true; }
    if (typeof separateY === "undefined") { separateY = true; }

    for (var i = 0; i < values.length; i++)
    {
        this.tiles[values[i]].setCollision(left, right, up, down, resetCollisions, separateX, separateY);
    }

};

//  Tile Management

/**
* Get the tile by its index.
* @param value {number} Index of the tile you want to get.
* @return {Tile} The tile with given index.
*/
Phaser.Tilemap.prototype.getTileByIndex = function (value) {

    if (this.tiles[value])
    {
        return this.tiles[value];
    }

    return null;

};

/**
* Get the tile located at specific position and layer.
* @param x {number} X position of this tile located.
* @param y {number} Y position of this tile located.
* @param [layer] {number} layer of this tile located.
* @return {Tile} The tile with specific properties.
*/
Phaser.Tilemap.prototype.getTile = function (x, y, layer) {

    if (typeof layer === "undefined") { layer = this.currentLayer.ID; }

    return this.tiles[this.layers[layer].getTileIndex(x, y)];

};

/**
* Get the tile located at specific position (in world coordinate) and layer. (thus you give a position of a point which is within the tile)
* @param x {number} X position of the point in target tile.
* @param x {number} Y position of the point in target tile.
* @param [layer] {number} layer of this tile located.
* @return {Tile} The tile with specific properties.
*/
Phaser.Tilemap.prototype.getTileFromWorldXY = function (x, y, layer) {

    if (typeof layer === "undefined") { layer = this.currentLayer.ID; }

    return this.tiles[this.layers[layer].getTileFromWorldXY(x, y)];

};

/**
* Gets the tile underneath the Input.x/y position
* @param layer The layer to check, defaults to 0
* @returns {Tile}
*/
Phaser.Tilemap.prototype.getTileFromInputXY = function (layer) {

    if (typeof layer === "undefined") { layer = this.currentLayer.ID; }

    return this.tiles[this.layers[layer].getTileFromWorldXY(this.game.input.worldX, this.game.input.worldY)];

};

/**
* Get tiles overlaps the given object.
* @param object {GameObject} Tiles you want to get that overlaps this.
* @return {array} Array with tiles information. (Each contains x, y and the tile.)
*/
Phaser.Tilemap.prototype.getTileOverlaps = function (object) {

    return this.currentLayer.getTileOverlaps(object);

};

//  COLLIDE

/**
* Check whether this tilemap collides with the given game object or group of objects.
* @param objectOrGroup {function} Target object of group you want to check.
* @param callback {function} This is called if objectOrGroup collides the tilemap.
* @param context {object} Callback will be called with this context.
* @return {bool} Return true if this collides with given object, otherwise return false.
*/
Phaser.Tilemap.prototype.collide = function (objectOrGroup, callback, context) {

    objectOrGroup = objectOrGroup || this.game.world.group;
    callback = callback || null;
    context = context || null;

    if (callback && context)
    {
        this.collisionCallback = callback;
        this.collisionCallbackContext = context;
    }

    if (objectOrGroup instanceof Phaser.Group)
    {
        objectOrGroup.forEachAlive(this.collideGameObject, this);
    }
    else
    {
        this.collideGameObject(objectOrGroup);
    }

};

/**
* Check whether this tilemap collides with the given game object.
* @param object {GameObject} Target object you want to check.
* @return {bool} Return true if this collides with given object, otherwise return false.
*/
Phaser.Tilemap.prototype.collideGameObject = function (object) {

    if (object instanceof Phaser.Group || object instanceof Phaser.Tilemap)
    {
        return false;
    }

    if (object.exists && object.body.allowCollision.none == false)
    {
        this._tempCollisionData = this.collisionLayer.getTileOverlaps(object);

        if (this.collisionCallback && this._tempCollisionData.length > 0)
        {
            this.collisionCallback.call(this.collisionCallbackContext, object, this._tempCollisionData);
        }

        return true;
    }
    else
    {
        return false;
    }

};

/**
* Set a tile to a specific layer.
* @param x {number} X position of this tile.
* @param y {number} Y position of this tile.
* @param index {number} The index of this tile type in the core map data.
* @param [layer] {number} which layer you want to set the tile to.
*/
Phaser.Tilemap.prototype.putTile = function (x, y, index, layer) {

    if (typeof layer === "undefined") { layer = this.currentLayer.ID; }
    
    this.layers[layer].putTile(x, y, index);

};

/**
* Calls the renderer
*/
Phaser.Tilemap.prototype.update = function () {

    this.renderer.render(this);

};

Phaser.Tilemap.prototype.destroy = function () {

    this.tiles.length = 0;
    this.layers.length = 0;

};

Object.defineProperty(Phaser.Tilemap.prototype, "widthInPixels", {

    get: function () {
        return this.currentLayer.widthInPixels;
    }

});

Object.defineProperty(Phaser.Tilemap.prototype, "heightInPixels", {

    get: function () {
        return this.currentLayer.heightInPixels;
    }

});

/**
* Phaser - TilemapLayer
*
* A Tilemap Layer. Tiled format maps can have multiple overlapping layers.
*/

/**
* TilemapLayer constructor
* Create a new <code>TilemapLayer</code>.
*
* @param parent {Tilemap} The tilemap that contains this layer.
* @param id {number} The ID of this layer within the Tilemap array.
* @param key {string} Asset key for this map.
* @param mapFormat {number} Format of this map data, available: Tilemap.CSV or Tilemap.JSON.
* @param name {string} Name of this layer, so you can get this layer by its name.
* @param tileWidth {number} Width of tiles in this map.
* @param tileHeight {number} Height of tiles in this map.
*/
Phaser.TilemapLayer = function (parent, id, key, mapFormat, name, tileWidth, tileHeight) {

    /**
    * Controls whether update() and draw() are automatically called.
    * @type {bool}
    */
    this.exists = true;

    /**
    * Controls whether draw() are automatically called.
    * @type {bool}
    */
    this.visible = true;

    /**
    * How many tiles in each row.
    * Read-only variable, do NOT recommend changing after the map is loaded!
    * @type {number}
    */
    this.widthInTiles = 0;

    /**
    * How many tiles in each column.
    * Read-only variable, do NOT recommend changing after the map is loaded!
    * @type {number}
    */
    this.heightInTiles = 0;

    /**
    * Read-only variable, do NOT recommend changing after the map is loaded!
    * @type {number}
    */
    this.widthInPixels = 0;

    /**
    * Read-only variable, do NOT recommend changing after the map is loaded!
    * @type {number}
    */
    this.heightInPixels = 0;

    /**
    * Distance between REAL tiles to the tileset texture bound.
    * @type {number}
    */
    this.tileMargin = 0;

    /**
    * Distance between every 2 neighbor tile in the tileset texture.
    * @type {number}
    */
    this.tileSpacing = 0;

    this.parent = parent;
    this.game = parent.game;
    this.ID = id;
    this.name = name;
    this.key = key;
    this.type = Phaser.TILEMAPLAYER;

    this.mapFormat = mapFormat;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;

    this.boundsInTiles = new Phaser.Rectangle();

    var map = this.game.cache.getTilemap(key);

    this.tileset = map.data;

    this._alpha = 1;

    this.canvas = null;
    this.context = null;
    this.baseTexture = null;
    this.texture = null;
    this.sprite = null;

    this.mapData = [];
    this._tempTileBlock = [];
    this._tempBlockResults = [];

};

Phaser.TilemapLayer.prototype = {

	/**
    * Set a specific tile with its x and y in tiles.
    * @param x {number} X position of this tile in world coordinates.
    * @param y {number} Y position of this tile in world coordinates.
    * @param index {number} The index of this tile type in the core map data.
    */
    putTileWorldXY: function (x, y, index) {

        x = this.game.math.snapToFloor(x, this.tileWidth) / this.tileWidth;
        y = this.game.math.snapToFloor(y, this.tileHeight) / this.tileHeight;

        if (y >= 0 && y < this.mapData.length)
        {
            if (x >= 0 && x < this.mapData[y].length)
            {
                this.mapData[y][x] = index;
            }
        }

    },

	/**
    * Set a specific tile with its x and y in tiles.
    * @param x {number} X position of this tile.
    * @param y {number} Y position of this tile.
    * @param index {number} The index of this tile type in the core map data.
    */
    putTile: function (x, y, index) {

        if (y >= 0 && y < this.mapData.length)
        {
            if (x >= 0 && x < this.mapData[y].length)
            {
                this.mapData[y][x] = index;
            }
        }

    },

	/**
    * Swap tiles with 2 kinds of indexes.
    * @param tileA {number} First tile index.
    * @param tileB {number} Second tile index.
    * @param [x] {number} specify a Rectangle of tiles to operate. The x position in tiles of Rectangle's left-top corner.
    * @param [y] {number} specify a Rectangle of tiles to operate. The y position in tiles of Rectangle's left-top corner.
    * @param [width] {number} specify a Rectangle of tiles to operate. The width in tiles.
    * @param [height] {number} specify a Rectangle of tiles to operate. The height in tiles.
    */
    swapTile: function (tileA, tileB, x, y, width, height) {

        x = x || 0;
        y = y || 0;
        width = width || this.widthInTiles;
        height = height || this.heightInTiles;
        
        this.getTempBlock(x, y, width, height);

        for (var r = 0; r < this._tempTileBlock.length; r++)
        {
            //  First sweep marking tileA as needing a new index
            if (this._tempTileBlock[r].tile.index == tileA)
            {
                this._tempTileBlock[r].newIndex = true;
            }

            //  In the same pass we can swap tileB to tileA
            if (this._tempTileBlock[r].tile.index == tileB)
            {
                this.mapData[this._tempTileBlock[r].y][this._tempTileBlock[r].x] = tileA;
            }
        }

        for (var r = 0; r < this._tempTileBlock.length; r++)
        {
            //  And now swap our newIndex tiles for tileB
            if (this._tempTileBlock[r].newIndex == true)
            {
                this.mapData[this._tempTileBlock[r].y][this._tempTileBlock[r].x] = tileB;
            }
        }

    },

	/**
    * Fill a tile block with a specific tile index.
    * @param index {number} Index of tiles you want to fill with.
    * @param [x] {number} x position (in tiles) of block's left-top corner.
    * @param [y] {number} y position (in tiles) of block's left-top corner.
    * @param [width] {number} width of block.
    * @param [height] {number} height of block.
    */
    fillTile: function (index, x, y, width, height) {

        x = x || 0;
        y = y || 0;
        width = width || this.widthInTiles;
        height = height || this.heightInTiles;

        this.getTempBlock(x, y, width, height);

        for (var r = 0; r < this._tempTileBlock.length; r++)
        {
            this.mapData[this._tempTileBlock[r].y][this._tempTileBlock[r].x] = index;
        }

    },

	/**
    * Set random tiles to a specific tile block.
    * @param tiles {number[]} Tiles with indexes in this array will be randomly set to the given block.
    * @param [x] {number} x position (in tiles) of block's left-top corner.
    * @param [y] {number} y position (in tiles) of block's left-top corner.
    * @param [width] {number} width of block.
    * @param [height] {number} height of block.
    */
    randomiseTiles: function (tiles, x, y, width, height) {

        x = x || 0;
        y = y || 0;
        width = width || this.widthInTiles;
        height = height || this.heightInTiles;

        this.getTempBlock(x, y, width, height);

        for (var r = 0; r < this._tempTileBlock.length; r++)
        {
            this.mapData[this._tempTileBlock[r].y][this._tempTileBlock[r].x] = this.game.math.getRandom(tiles);
        }

    },

	/**
    * Replace one kind of tiles to another kind.
    * @param tileA {number} Index of tiles you want to replace.
    * @param tileB {number} Index of tiles you want to set.
    * @param [x] {number} x position (in tiles) of block's left-top corner.
    * @param [y] {number} y position (in tiles) of block's left-top corner.
    * @param [width] {number} width of block.
    * @param [height] {number} height of block.
    */
    replaceTile: function (tileA, tileB, x, y, width, height) {

        x = x || 0;
        y = y || 0;
        width = width || this.widthInTiles;
        height = height || this.heightInTiles;

        this.getTempBlock(x, y, width, height);

        for (var r = 0; r < this._tempTileBlock.length; r++)
        {
            if (this._tempTileBlock[r].tile.index == tileA)
            {
                this.mapData[this._tempTileBlock[r].y][this._tempTileBlock[r].x] = tileB;
            }
        }

    },

	/**
    * Get a tile block with specific position and size.(both are in tiles)
    * @param x {number} X position of block's left-top corner.
    * @param y {number} Y position of block's left-top corner.
    * @param width {number} Width of block.
    * @param height {number} Height of block.
    */
    getTileBlock: function (x, y, width, height) {

        var output = [];

        this.getTempBlock(x, y, width, height);

        for (var r = 0; r < this._tempTileBlock.length; r++)
        {
            output.push({
                x: this._tempTileBlock[r].x,
                y: this._tempTileBlock[r].y,
                tile: this._tempTileBlock[r].tile
            });
        }

        return output;

    },

	/**
    * Get a tile with specific position (in world coordinate). (thus you give a position of a point which is within the tile)
    * @param x {number} X position of the point in target tile.
    * @param x {number} Y position of the point in target tile.
    */
    getTileFromWorldXY: function (x, y) {

        x = Phaser.Math.snapToFloor(x, this.tileWidth) / this.tileWidth;
        y = Phaser.Math.snapToFloor(y, this.tileHeight) / this.tileHeight;

        return this.getTileIndex(x, y);

    },

	/**
    * Get tiles overlaps the given object.
    * @param object {GameObject} Tiles you want to get that overlaps this.
    * @return {array} Array with tiles informations. (Each contains x, y and the tile.)
    */
    getTileOverlaps: function (object) {

        this._tempBlockResults.length = 0;

        //  If the object is outside of the world coordinates then abort the check (tilemap has to exist within world bounds)
        if (object.body.x < 0 || object.body.x > this.widthInPixels || object.body.y < 0 || object.body.bottom > this.heightInPixels)
        {
            return this._tempBlockResults;
        }

        //  What tiles do we need to check against?
        this._tempTileX = this.game.math.snapToFloor(object.body.x, this.tileWidth) / this.tileWidth;
        this._tempTileY = this.game.math.snapToFloor(object.body.y, this.tileHeight) / this.tileHeight;
        this._tempTileW = (this.game.math.snapToCeil(object.body.width, this.tileWidth) + this.tileWidth) / this.tileWidth;
        this._tempTileH = (this.game.math.snapToCeil(object.body.height, this.tileHeight) + this.tileHeight) / this.tileHeight;

        //  Loop through the tiles we've got and check overlaps accordingly (the results are stored in this._tempTileBlock)
        this.getTempBlock(this._tempTileX, this._tempTileY, this._tempTileW, this._tempTileH, true);

        for (var r = 0; r < this._tempTileBlock.length; r++)
        {
            //  separateTile: function (object, x, y, width, height, mass, collideLeft, collideRight, collideUp, collideDown, separateX, separateY)            
            if (this.game.physics.separateTile(object, this._tempTileBlock[r].x * this.tileWidth, this._tempTileBlock[r].y * this.tileHeight, this.tileWidth, this.tileHeight, this._tempTileBlock[r].tile.mass, this._tempTileBlock[r].tile.collideLeft, this._tempTileBlock[r].tile.collideRight, this._tempTileBlock[r].tile.collideUp, this._tempTileBlock[r].tile.collideDown, this._tempTileBlock[r].tile.separateX, this._tempTileBlock[r].tile.separateY))
            {
                this._tempBlockResults.push({ x: this._tempTileBlock[r].x, y: this._tempTileBlock[r].y, tile: this._tempTileBlock[r].tile });
            }
        }

        return this._tempBlockResults;

    },

	/**
    * Get a tile block with its position and size. (This method does not return, it'll set result to _tempTileBlock)
    * @param x {number} X position of block's left-top corner.
    * @param y {number} Y position of block's left-top corner.
    * @param width {number} Width of block.
    * @param height {number} Height of block.
    * @param collisionOnly {bool} Whethor or not ONLY return tiles which will collide (its allowCollisions value is not Collision.NONE).
    */
    getTempBlock: function (x, y, width, height, collisionOnly) {

        if (typeof collisionOnly === "undefined") { collisionOnly = false; }

        if (x < 0)
        {
            x = 0;
        }

        if (y < 0)
        {
            y = 0;
        }

        if (width > this.widthInTiles)
        {
            width = this.widthInTiles;
        }

        if (height > this.heightInTiles)
        {
            height = this.heightInTiles;
        }

        this._tempTileBlock = [];

        for (var ty = y; ty < y + height; ty++)
        {
            for (var tx = x; tx < x + width; tx++)
            {
                if (collisionOnly)
                {
                    //  We only want to consider the tile for checking if you can actually collide with it
                    if (this.mapData[ty] && this.mapData[ty][tx] && this.parent.tiles[this.mapData[ty][tx]].collideNone == false)
                    {
                        this._tempTileBlock.push({
                            x: tx,
                            y: ty,
                            tile: this.parent.tiles[this.mapData[ty][tx]]
                        });
                    }
                }
                else
                {
                    if (this.mapData[ty] && this.mapData[ty][tx])
                    {
                        this._tempTileBlock.push({
                            x: tx,
                            y: ty,
                            tile: this.parent.tiles[this.mapData[ty][tx]]
                        });
                    }
                }
            }
        }
    },

	/**
    * Get the tile index of specific position (in tiles).
    * @param x {number} X position of the tile.
    * @param y {number} Y position of the tile.
    * @return {number} Index of the tile at that position. Return null if there isn't a tile there.
    */
    getTileIndex: function (x, y) {

        if (y >= 0 && y < this.mapData.length)
        {
            if (x >= 0 && x < this.mapData[y].length)
            {
                return this.mapData[y][x];
            }
        }

        return null;

    },

	/**
    * Add a column of tiles into the layer.
    * @param column {string[]/number[]} An array of tile indexes to be added.
    */
    addColumn: function (column) {

        var data = [];

        for (var c = 0; c < column.length; c++)
        {
            data[c] = parseInt(column[c]);
        }

        if (this.widthInTiles == 0)
        {
            this.widthInTiles = data.length;
            this.widthInPixels = this.widthInTiles * this.tileWidth;
        }

        this.mapData.push(data);

        this.heightInTiles++;
        this.heightInPixels += this.tileHeight;

    },

    createCanvas: function () {

        var width = this.game.width;
        var height = this.game.height;

        if (this.widthInPixels < width)
        {
            width = this.widthInPixels;
        }

        if (this.heightInPixels < height)
        {
            height = this.heightInPixels;
        }

        this.canvas = Phaser.Canvas.create(width, height);
        this.context = this.canvas.getContext('2d');

        this.baseTexture = new PIXI.BaseTexture(this.canvas);
        this.texture = new PIXI.Texture(this.baseTexture);
        this.sprite = new PIXI.Sprite(this.texture);

        this.parent.addChild(this.sprite);

    },

	/**
    * Update boundsInTiles with widthInTiles and heightInTiles.
    */
    updateBounds: function () {

        this.boundsInTiles.setTo(0, 0, this.widthInTiles, this.heightInTiles);

    },

	/**
    * Parse tile offsets from map data.
    * Basically this creates a large array of objects that contain the x/y coordinates to grab each tile from
    * for the entire map. Yes we could calculate this at run-time by using the tile index and some math, but we're
    * trading a quite small bit of memory here to not have to process that in our main render loop.
    * @return {number} length of tileOffsets array.
    */
    parseTileOffsets: function () {

        this.tileOffsets = [];

        var i = 0;

        if (this.mapFormat == Phaser.Tilemap.JSON)
        {
            //  For some reason Tiled counts from 1 not 0
            this.tileOffsets[0] = null;
            i = 1;
        }

        for (var ty = this.tileMargin; ty < this.tileset.height; ty += (this.tileHeight + this.tileSpacing))
        {
            for (var tx = this.tileMargin; tx < this.tileset.width; tx += (this.tileWidth + this.tileSpacing))
            {
                this.tileOffsets[i] = {
                    x: tx,
                    y: ty
                };
                i++;
            }
        }

        return this.tileOffsets.length;

    }

};

Object.defineProperty(Phaser.TilemapLayer.prototype, 'alpha', {

    get: function() {
        return this._alpha;
    },

    set: function(value) {

        if (this.sprite)
        {
            this.sprite.alpha = value;
        }
        
        this._alpha = value;
    }

});

/**
* Phaser - Tile
*
* A Tile is a single representation of a tile within a Tilemap
*/

/**
* Tile constructor
* Create a new <code>Tile</code>.
*
* @param tilemap {Tilemap} the tilemap this tile belongs to.
* @param index {number} The index of this tile type in the core map data.
* @param width {number} Width of the tile.
* @param height number} Height of the tile.
*/
Phaser.Tile = function (game, tilemap, index, width, height) {

    /**
    * The virtual mass of the tile.
    * @type {number}
    */
    this.mass = 1.0;

    /**
    * Indicating this Tile doesn't collide at all.
    * @type {bool}
    */
    this.collideNone = true;

    /**
    * Indicating collide with any object on the left.
    * @type {bool}
    */
    this.collideLeft = false;

    /**
    * Indicating collide with any object on the right.
    * @type {bool}
    */
    this.collideRight = false;

    /**
    * Indicating collide with any object on the top.
    * @type {bool}
    */
    this.collideUp = false;

    /**
    * Indicating collide with any object on the bottom.
    * @type {bool}
    */
    this.collideDown = false;

    /**
    * Enable separation at x-axis.
    * @type {bool}
    */
    this.separateX = true;

    /**
    * Enable separation at y-axis.
    * @type {bool}
    */
    this.separateY = true;

    this.game = game;
    this.tilemap = tilemap;
    this.index = index;
    this.width = width;
    this.height = height;

};

Phaser.Tile.prototype = {

	/**
    * Clean up memory.
    */
    destroy: function () {
        this.tilemap = null;
    },

	/**
    * Set collision configs.
    * @param collision {number} Bit field of flags. (see Tile.allowCollision)
    * @param resetCollisions {bool} Reset collision flags before set.
    * @param separateX {bool} Enable seprate at x-axis.
    * @param separateY {bool} Enable seprate at y-axis.
    */
    setCollision: function (left, right, up, down, reset, separateX, separateY) {

        if (reset)
        {
            this.resetCollision();
        }

        this.separateX = separateX;
        this.separateY = separateY;

        this.collideNone = true;
        this.collideLeft = left;
        this.collideRight = right;
        this.collideUp = up;
        this.collideDown = down;

        if (left || right || up || down)
        {
            this.collideNone = false;
        }

    },

	/**
    * Reset collision status flags.
    */
    resetCollision: function () {

        this.collideNone = true;
        this.collideLeft = false;
        this.collideRight = false;
        this.collideUp = false;
        this.collideDown = false;

    },

	/**
    * Returns a string representation of this object.
    * @method toString
    * @return {string} a string representation of the object.
    **/
    toString: function () {

        // return "[{Tile (index=" + this.index + " collisions=" + this.allowCollisions + " width=" + this.width + " height=" + this.height + ")}]";
        return '';

    }

};
Phaser.TilemapRenderer = function (game) {

    this.game = game;

    //  Local rendering related temp vars to help avoid gc spikes through constant var creation
    this._ga = 1;
    this._dx = 0;
    this._dy = 0;
    this._dw = 0;
    this._dh = 0;
    this._tx = 0;
    this._ty = 0;
    this._tl = 0;
    this._maxX = 0;
    this._maxY = 0;
    this._startX = 0;
    this._startY = 0;
	
};

Phaser.TilemapRenderer.prototype = {

    /**
     * Render a tilemap to a canvas.
     * @param tilemap {Tilemap} The tilemap data to render.
     */
    render: function (tilemap) {

        //  Loop through the layers
        this._tl = tilemap.layers.length;

        for (var i = 0; i < this._tl; i++)
        {
            if (tilemap.layers[i].visible == false || tilemap.layers[i].alpha < 0.1)
            {
                continue;
            }

            var layer = tilemap.layers[i];

            //  Work out how many tiles we can fit into our canvas and round it up for the edges
            this._maxX = this.game.math.ceil(layer.canvas.width / layer.tileWidth) + 1;
            this._maxY = this.game.math.ceil(layer.canvas.height / layer.tileHeight) + 1;

            //  And now work out where in the tilemap the camera actually is
            this._startX = this.game.math.floor(this.game.camera.x / layer.tileWidth);
            this._startY = this.game.math.floor(this.game.camera.y / layer.tileHeight);

            //  Tilemap bounds check
            if (this._startX < 0)
            {
                this._startX = 0;
            }

            if (this._startY < 0)
            {
                this._startY = 0;
            }

            if (this._maxX > layer.widthInTiles)
            {
                this._maxX = layer.widthInTiles;
            }

            if (this._maxY > layer.heightInTiles)
            {
                this._maxY = layer.heightInTiles;
            }

            if (this._startX + this._maxX > layer.widthInTiles)
            {
                this._startX = layer.widthInTiles - this._maxX;
            }

            if (this._startY + this._maxY > layer.heightInTiles)
            {
                this._startY = layer.heightInTiles - this._maxY;
            }

            //  Finally get the offset to avoid the blocky movement
            this._dx = -(this.game.camera.x - (this._startX * layer.tileWidth));
            this._dy = -(this.game.camera.y - (this._startY * layer.tileHeight));

            this._tx = this._dx;
            this._ty = this._dy;

            //  Alpha
            if (layer.alpha !== 1)
            {
                this._ga = layer.context.globalAlpha;
                layer.context.globalAlpha = layer.alpha;
            }

            layer.context.clearRect(0, 0, layer.canvas.width, layer.canvas.height);

            for (var row = this._startY; row < this._startY + this._maxY; row++)
            {
                this._columnData = layer.mapData[row];

                for (var tile = this._startX; tile < this._startX + this._maxX; tile++)
                {
                    if (layer.tileOffsets[this._columnData[tile]])
                    {
                        layer.context.drawImage(
                            layer.tileset,
                            layer.tileOffsets[this._columnData[tile]].x,
                            layer.tileOffsets[this._columnData[tile]].y,
                            layer.tileWidth,
                            layer.tileHeight,
                            this._tx,
                            this._ty,
                            layer.tileWidth,
                            layer.tileHeight
                            );
                    }

                    this._tx += layer.tileWidth;

                }

                this._tx = this._dx;
                this._ty += layer.tileHeight;

            }

            if (this._ga > -1)
            {
                layer.context.globalAlpha = this._ga;
            }

	        //  Only needed if running in WebGL, otherwise this array will never get cleared down I don't think!
	        if (this.game.renderType == Phaser.WEBGL)
	        {
		        PIXI.texturesToUpdate.push(layer.baseTexture);
	        }

        }

        return true;

    }

};
