var Camera3DPlugin =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 74);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

//  Taken from klasse by mattdesl https://github.com/mattdesl/klasse

function hasGetterOrSetter (def)
{
    return (!!def.get && typeof def.get === 'function') || (!!def.set && typeof def.set === 'function');
}

function getProperty (definition, k, isClassDescriptor)
{
    //  This may be a lightweight object, OR it might be a property that was defined previously.

    //  For simple class descriptors we can just assume its NOT previously defined.
    var def = (isClassDescriptor) ? definition[k] : Object.getOwnPropertyDescriptor(definition, k);

    if (!isClassDescriptor && def.value && typeof def.value === 'object')
    {
        def = def.value;
    }

    //  This might be a regular property, or it may be a getter/setter the user defined in a class.
    if (def && hasGetterOrSetter(def))
    {
        if (typeof def.enumerable === 'undefined')
        {
            def.enumerable = true;
        }

        if (typeof def.configurable === 'undefined')
        {
            def.configurable = true;
        }

        return def;
    }
    else
    {
        return false;
    }
}

function hasNonConfigurable (obj, k)
{
    var prop = Object.getOwnPropertyDescriptor(obj, k);

    if (!prop)
    {
        return false;
    }

    if (prop.value && typeof prop.value === 'object')
    {
        prop = prop.value;
    }

    if (prop.configurable === false)
    {
        return true;
    }

    return false;
}

function extend (ctor, definition, isClassDescriptor, extend)
{
    for (var k in definition)
    {
        if (!definition.hasOwnProperty(k))
        {
            continue;
        }

        var def = getProperty(definition, k, isClassDescriptor);

        if (def !== false)
        {
            //  If Extends is used, we will check its prototype to see if the final variable exists.

            var parent = extend || ctor;

            if (hasNonConfigurable(parent.prototype, k))
            {
                //  Just skip the final property
                if (Class.ignoreFinals)
                {
                    continue;
                }

                //  We cannot re-define a property that is configurable=false.
                //  So we will consider them final and throw an error. This is by
                //  default so it is clear to the developer what is happening.
                //  You can set ignoreFinals to true if you need to extend a class
                //  which has configurable=false; it will simply not re-define final properties.
                throw new Error('cannot override final property \'' + k + '\', set Class.ignoreFinals = true to skip');
            }

            Object.defineProperty(ctor.prototype, k, def);
        }
        else
        {
            ctor.prototype[k] = definition[k];
        }
    }
}

function mixin (myClass, mixins)
{
    if (!mixins)
    {
        return;
    }

    if (!Array.isArray(mixins))
    {
        mixins = [ mixins ];
    }

    for (var i = 0; i < mixins.length; i++)
    {
        extend(myClass, mixins[i].prototype || mixins[i]);
    }
}

/**
 * Creates a new class with the given descriptor.
 * The constructor, defined by the name `initialize`,
 * is an optional function. If unspecified, an anonymous
 * function will be used which calls the parent class (if
 * one exists).
 *
 * You can also use `Extends` and `Mixins` to provide subclassing
 * and inheritance.
 *
 * @class  Class
 * @constructor
 * @param {Object} definition a dictionary of functions for the class
 * @example
 *
 *      var MyClass = new Phaser.Class({
 *
 *          initialize: function() {
 *              this.foo = 2.0;
 *          },
 *
 *          bar: function() {
 *              return this.foo + 5;
 *          }
 *      });
 */
function Class (definition)
{
    if (!definition)
    {
        definition = {};
    }

    //  The variable name here dictates what we see in Chrome debugger
    var initialize;
    var Extends;

    if (definition.initialize)
    {
        if (typeof definition.initialize !== 'function')
        {
            throw new Error('initialize must be a function');
        }

        initialize = definition.initialize;

        //  Usually we should avoid 'delete' in V8 at all costs.
        //  However, its unlikely to make any performance difference
        //  here since we only call this on class creation (i.e. not object creation).
        delete definition.initialize;
    }
    else if (definition.Extends)
    {
        var base = definition.Extends;

        initialize = function ()
        {
            base.apply(this, arguments);
        };
    }
    else
    {
        initialize = function () {};
    }

    if (definition.Extends)
    {
        initialize.prototype = Object.create(definition.Extends.prototype);
        initialize.prototype.constructor = initialize;

        //  For getOwnPropertyDescriptor to work, we need to act directly on the Extends (or Mixin)

        Extends = definition.Extends;

        delete definition.Extends;
    }
    else
    {
        initialize.prototype.constructor = initialize;
    }

    //  Grab the mixins, if they are specified...
    var mixins = null;

    if (definition.Mixins)
    {
        mixins = definition.Mixins;
        delete definition.Mixins;
    }

    //  First, mixin if we can.
    mixin(initialize, mixins);

    //  Now we grab the actual definition which defines the overrides.
    extend(initialize, definition, true, Extends);

    return initialize;
}

Class.extend = extend;
Class.mixin = mixin;
Class.ignoreFinals = false;

module.exports = Class;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = __webpack_require__(0);

/**
 * @classdesc
 * Defines a Point in 2D space, with an x and y component.
 *
 * @class Point
 * @memberOf Phaser.Geom
 * @constructor
 * @since 3.0.0
 *
 * @param {number} [x=0] - The x coordinate of this Point.
 * @param {number} [y=x] - The y coordinate of this Point.
 */
var Point = new Class({

    initialize:

    function Point (x, y)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = x; }

        /**
         * The x coordinate of this Point.
         *
         * @name Phaser.Geom.Point#x
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.x = x;

        /**
         * The y coordinate of this Point.
         *
         * @name Phaser.Geom.Point#y
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.y = y;
    },

    /**
     * Set the x and y coordinates of the point to the given values.
     *
     * @method Phaser.Geom.Point#setTo
     * @since 3.0.0
     *
     * @param {number} [x=0] - The x coordinate of this Point.
     * @param {number} [y=x] - The y coordinate of this Point.
     *
     * @return {Phaser.Geom.Point} This Point object.
     */
    setTo: function (x, y)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = x; }

        this.x = x;
        this.y = y;

        return this;
    }

});

module.exports = Point;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

//  Adapted from [gl-matrix](https://github.com/toji/gl-matrix) by toji
//  and [vecmath](https://github.com/mattdesl/vecmath) by mattdesl

var Class = __webpack_require__(0);

/**
 * @classdesc
 * A representation of a vector in 3D space.
 *
 * A three-component vector.
 *
 * @class Vector3
 * @memberOf Phaser.Math
 * @constructor
 * @since 3.0.0
 *
 * @param {number} [x] - The x component.
 * @param {number} [y] - The y component.
 * @param {number} [z] - The z component.
 */
var Vector3 = new Class({

    initialize:

    function Vector3 (x, y, z)
    {
        /**
         * The x component of this Vector.
         *
         * @name Phaser.Math.Vector3#x
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.x = 0;

        /**
         * The y component of this Vector.
         *
         * @name Phaser.Math.Vector3#y
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.y = 0;

        /**
         * The z component of this Vector.
         *
         * @name Phaser.Math.Vector3#z
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.z = 0;

        if (typeof x === 'object')
        {
            this.x = x.x || 0;
            this.y = x.y || 0;
            this.z = x.z || 0;
        }
        else
        {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
        }
    },

    /**
     * Set this Vector to point up.
     *
     * Sets the y component of the vector to 1, and the others to 0.
     *
     * @method Phaser.Math.Vector3#up
     * @since 3.0.0
     *
     * @return {Phaser.Math.Vector3} This Vector3.
     */
    up: function ()
    {
        this.x = 0;
        this.y = 1;
        this.z = 0;

        return this;
    },

    /**
     * Make a clone of this Vector3.
     *
     * @method Phaser.Math.Vector3#clone
     * @since 3.0.0
     *
     * @return {Phaser.Math.Vector3} A new Vector3 object containing this Vectors values.
     */
    clone: function ()
    {
        return new Vector3(this.x, this.y, this.z);
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Vector3#crossVectors
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector3} a - [description]
     * @param {Phaser.Math.Vector3} b - [description]
     *
     * @return {Phaser.Math.Vector3} This Vector3.
     */
    crossVectors: function (a, b)
    {
        var ax = a.x;
        var ay = a.y;
        var az = a.z;
        var bx = b.x;
        var by = b.y;
        var bz = b.z;

        this.x = ay * bz - az * by;
        this.y = az * bx - ax * bz;
        this.z = ax * by - ay * bx;

        return this;
    },

    /**
     * Check whether this Vector is equal to a given Vector.
     *
     * Performs a strict equality check against each Vector's components.
     *
     * @method Phaser.Math.Vector3#equals
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector3} v - The Vector3 to compare against.
     *
     * @return {boolean} True if the two vectors strictly match, otherwise false.
     */
    equals: function (v)
    {
        return ((this.x === v.x) && (this.y === v.y) && (this.z === v.z));
    },

    /**
     * Copy the components of a given Vector into this Vector.
     *
     * @method Phaser.Math.Vector3#copy
     * @since 3.0.0
     *
     * @param {(Phaser.Math.Vector2|Phaser.Math.Vector3)} src - The Vector to copy the components from.
     *
     * @return {Phaser.Math.Vector3} This Vector3.
     */
    copy: function (src)
    {
        this.x = src.x;
        this.y = src.y;
        this.z = src.z || 0;

        return this;
    },

    /**
     * Set the `x`, `y`, and `z` components of this Vector to the given `x`, `y`, and `z` values.
     *
     * @method Phaser.Math.Vector3#set
     * @since 3.0.0
     *
     * @param {(number|object)} x - The x value to set for this Vector, or an object containing x, y and z components.
     * @param {number} [y] - The y value to set for this Vector.
     * @param {number} [z] - The z value to set for this Vector.
     *
     * @return {Phaser.Math.Vector3} This Vector3.
     */
    set: function (x, y, z)
    {
        if (typeof x === 'object')
        {
            this.x = x.x || 0;
            this.y = x.y || 0;
            this.z = x.z || 0;
        }
        else
        {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
        }

        return this;
    },

    /**
     * Add a given Vector to this Vector. Addition is component-wise.
     *
     * @method Phaser.Math.Vector3#add
     * @since 3.0.0
     *
     * @param {(Phaser.Math.Vector2|Phaser.Math.Vector3)} v - The Vector to add to this Vector.
     *
     * @return {Phaser.Math.Vector3} This Vector3.
     */
    add: function (v)
    {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z || 0;

        return this;
    },

    /**
     * Subtract the given Vector from this Vector. Subtraction is component-wise.
     *
     * @method Phaser.Math.Vector3#subtract
     * @since 3.0.0
     *
     * @param {(Phaser.Math.Vector2|Phaser.Math.Vector3)} v - The Vector to subtract from this Vector.
     *
     * @return {Phaser.Math.Vector3} This Vector3.
     */
    subtract: function (v)
    {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z || 0;

        return this;
    },

    /**
     * Perform a component-wise multiplication between this Vector and the given Vector.
     *
     * Multiplies this Vector by the given Vector.
     *
     * @method Phaser.Math.Vector3#multiply
     * @since 3.0.0
     *
     * @param {(Phaser.Math.Vector2|Phaser.Math.Vector3)} v - The Vector to multiply this Vector by.
     *
     * @return {Phaser.Math.Vector3} This Vector3.
     */
    multiply: function (v)
    {
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z || 1;

        return this;
    },

    /**
     * Scale this Vector by the given value.
     *
     * @method Phaser.Math.Vector3#scale
     * @since 3.0.0
     *
     * @param {number} scale - The value to scale this Vector by.
     *
     * @return {Phaser.Math.Vector3} This Vector3.
     */
    scale: function (scale)
    {
        if (isFinite(scale))
        {
            this.x *= scale;
            this.y *= scale;
            this.z *= scale;
        }
        else
        {
            this.x = 0;
            this.y = 0;
            this.z = 0;
        }

        return this;
    },

    /**
     * Perform a component-wise division between this Vector and the given Vector.
     *
     * Divides this Vector by the given Vector.
     *
     * @method Phaser.Math.Vector3#divide
     * @since 3.0.0
     *
     * @param {(Phaser.Math.Vector2|Phaser.Math.Vector3)} v - The Vector to divide this Vector by.
     *
     * @return {Phaser.Math.Vector3} This Vector3.
     */
    divide: function (v)
    {
        this.x /= v.x;
        this.y /= v.y;
        this.z /= v.z || 1;

        return this;
    },

    /**
     * Negate the `x`, `y` and `z` components of this Vector.
     *
     * @method Phaser.Math.Vector3#negate
     * @since 3.0.0
     *
     * @return {Phaser.Math.Vector3} This Vector3.
     */
    negate: function ()
    {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;

        return this;
    },

    /**
     * Calculate the distance between this Vector and the given Vector.
     *
     * @method Phaser.Math.Vector3#distance
     * @since 3.0.0
     *
     * @param {(Phaser.Math.Vector2|Phaser.Math.Vector3)} v - The Vector to calculate the distance to.
     *
     * @return {number} The distance from this Vector to the given Vector.
     */
    distance: function (v)
    {
        var dx = v.x - this.x;
        var dy = v.y - this.y;
        var dz = v.z - this.z || 0;

        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    },

    /**
     * Calculate the distance between this Vector and the given Vector, squared.
     *
     * @method Phaser.Math.Vector3#distanceSq
     * @since 3.0.0
     *
     * @param {(Phaser.Math.Vector2|Phaser.Math.Vector3)} v - The Vector to calculate the distance to.
     *
     * @return {number} The distance from this Vector to the given Vector, squared.
     */
    distanceSq: function (v)
    {
        var dx = v.x - this.x;
        var dy = v.y - this.y;
        var dz = v.z - this.z || 0;

        return dx * dx + dy * dy + dz * dz;
    },

    /**
     * Calculate the length (or magnitude) of this Vector.
     *
     * @method Phaser.Math.Vector3#length
     * @since 3.0.0
     *
     * @return {number} The length of this Vector.
     */
    length: function ()
    {
        var x = this.x;
        var y = this.y;
        var z = this.z;

        return Math.sqrt(x * x + y * y + z * z);
    },

    /**
     * Calculate the length of this Vector squared.
     *
     * @method Phaser.Math.Vector3#lengthSq
     * @since 3.0.0
     *
     * @return {number} The length of this Vector, squared.
     */
    lengthSq: function ()
    {
        var x = this.x;
        var y = this.y;
        var z = this.z;

        return x * x + y * y + z * z;
    },

    /**
     * Normalize this Vector.
     *
     * Makes the vector a unit length vector (magnitude of 1) in the same direction.
     *
     * @method Phaser.Math.Vector3#normalize
     * @since 3.0.0
     *
     * @return {Phaser.Math.Vector3} This Vector3.
     */
    normalize: function ()
    {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var len = x * x + y * y + z * z;

        if (len > 0)
        {
            len = 1 / Math.sqrt(len);

            this.x = x * len;
            this.y = y * len;
            this.z = z * len;
        }

        return this;
    },

    /**
     * Calculate the dot product of this Vector and the given Vector.
     *
     * @method Phaser.Math.Vector3#dot
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector3} v - The Vector3 to dot product with this Vector3.
     *
     * @return {number} [description]
     */
    dot: function (v)
    {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Vector3#cross
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector3} v - [description]
     *
     * @return {Phaser.Math.Vector3} This Vector3.
     */
    cross: function (v)
    {
        var ax = this.x;
        var ay = this.y;
        var az = this.z;
        var bx = v.x;
        var by = v.y;
        var bz = v.z;

        this.x = ay * bz - az * by;
        this.y = az * bx - ax * bz;
        this.z = ax * by - ay * bx;

        return this;
    },

    /**
     * Linearly interpolate between this Vector and the given Vector.
     *
     * Interpolates this Vector towards the given Vector.
     *
     * @method Phaser.Math.Vector3#lerp
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector3} v - The Vector3 to interpolate towards.
     * @param {number} [t=0] - The interpolation percentage, between 0 and 1.
     *
     * @return {Phaser.Math.Vector3} This Vector3.
     */
    lerp: function (v, t)
    {
        if (t === undefined) { t = 0; }

        var ax = this.x;
        var ay = this.y;
        var az = this.z;

        this.x = ax + t * (v.x - ax);
        this.y = ay + t * (v.y - ay);
        this.z = az + t * (v.z - az);

        return this;
    },

    /**
     * Transform this Vector with the given Matrix.
     *
     * @method Phaser.Math.Vector3#transformMat3
     * @since 3.0.0
     *
     * @param {Phaser.Math.Matrix3} mat - The Matrix3 to transform this Vector3 with.
     *
     * @return {Phaser.Math.Vector3} This Vector3.
     */
    transformMat3: function (mat)
    {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var m = mat.val;

        this.x = x * m[0] + y * m[3] + z * m[6];
        this.y = x * m[1] + y * m[4] + z * m[7];
        this.z = x * m[2] + y * m[5] + z * m[8];

        return this;
    },

    /**
     * Transform this Vector with the given Matrix.
     *
     * @method Phaser.Math.Vector3#transformMat4
     * @since 3.0.0
     *
     * @param {Phaser.Math.Matrix4} mat - The Matrix4 to transform this Vector3 with.
     *
     * @return {Phaser.Math.Vector3} This Vector3.
     */
    transformMat4: function (mat)
    {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var m = mat.val;

        this.x = m[0] * x + m[4] * y + m[8] * z + m[12];
        this.y = m[1] * x + m[5] * y + m[9] * z + m[13];
        this.z = m[2] * x + m[6] * y + m[10] * z + m[14];

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Vector3#transformCoordinates
     * @since 3.0.0
     *
     * @param {Phaser.Math.Matrix4} mat - The Matrix4 to transform this Vector3 with.
     *
     * @return {Phaser.Math.Vector3} This Vector3.
     */
    transformCoordinates: function (mat)
    {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var m = mat.val;

        var tx = (x * m[0]) + (y * m[4]) + (z * m[8]) + m[12];
        var ty = (x * m[1]) + (y * m[5]) + (z * m[9]) + m[13];
        var tz = (x * m[2]) + (y * m[6]) + (z * m[10]) + m[14];
        var tw = (x * m[3]) + (y * m[7]) + (z * m[11]) + m[15];

        this.x = tx / tw;
        this.y = ty / tw;
        this.z = tz / tw;

        return this;
    },

    /**
     * Transform this Vector with the given Quaternion.
     *
     * @method Phaser.Math.Vector3#transformQuat
     * @since 3.0.0
     *
     * @param {Phaser.Math.Quaternion} q - The Quaternion to transform this Vector with.
     *
     * @return {Phaser.Math.Vector3} This Vector3.
     */
    transformQuat: function (q)
    {
        // benchmarks: http://jsperf.com/quaternion-transform-vec3-implementations
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var qx = q.x;
        var qy = q.y;
        var qz = q.z;
        var qw = q.w;

        // calculate quat * vec
        var ix = qw * x + qy * z - qz * y;
        var iy = qw * y + qz * x - qx * z;
        var iz = qw * z + qx * y - qy * x;
        var iw = -qx * x - qy * y - qz * z;

        // calculate result * inverse quat
        this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
        this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
        this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

        return this;
    },

    /**
     * Multiplies this Vector3 by the specified matrix, applying a W divide. This is useful for projection,
     * e.g. unprojecting a 2D point into 3D space.
     *
     * @method Phaser.Math.Vector3#project
     * @since 3.0.0
     *
     * @param {Phaser.Math.Matrix4} mat - The Matrix4 to multiply this Vector3 with.
     *
     * @return {Phaser.Math.Vector3} This Vector3.
     */
    project: function (mat)
    {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var m = mat.val;

        var a00 = m[0];
        var a01 = m[1];
        var a02 = m[2];
        var a03 = m[3];
        var a10 = m[4];
        var a11 = m[5];
        var a12 = m[6];
        var a13 = m[7];
        var a20 = m[8];
        var a21 = m[9];
        var a22 = m[10];
        var a23 = m[11];
        var a30 = m[12];
        var a31 = m[13];
        var a32 = m[14];
        var a33 = m[15];

        var lw = 1 / (x * a03 + y * a13 + z * a23 + a33);

        this.x = (x * a00 + y * a10 + z * a20 + a30) * lw;
        this.y = (x * a01 + y * a11 + z * a21 + a31) * lw;
        this.z = (x * a02 + y * a12 + z * a22 + a32) * lw;

        return this;
    },

    /**
     * Unproject this point from 2D space to 3D space.
     * The point should have its x and y properties set to
     * 2D screen space, and the z either at 0 (near plane)
     * or 1 (far plane). The provided matrix is assumed to already
     * be combined, i.e. projection * view * model.
     *
     * After this operation, this vector's (x, y, z) components will
     * represent the unprojected 3D coordinate.
     *
     * @method Phaser.Math.Vector3#unproject
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector4} viewport - Screen x, y, width and height in pixels.
     * @param {Phaser.Math.Matrix4} invProjectionView - Combined projection and view matrix.
     *
     * @return {Phaser.Math.Vector3} This Vector3.
     */
    unproject: function (viewport, invProjectionView)
    {
        var viewX = viewport.x;
        var viewY = viewport.y;
        var viewWidth = viewport.z;
        var viewHeight = viewport.w;

        var x = this.x - viewX;
        var y = (viewHeight - this.y - 1) - viewY;
        var z = this.z;

        this.x = (2 * x) / viewWidth - 1;
        this.y = (2 * y) / viewHeight - 1;
        this.z = 2 * z - 1;

        return this.project(invProjectionView);
    },

    /**
     * Make this Vector the zero vector (0, 0, 0).
     *
     * @method Phaser.Math.Vector3#reset
     * @since 3.0.0
     *
     * @return {Phaser.Math.Vector3} This Vector3.
     */
    reset: function ()
    {
        this.x = 0;
        this.y = 0;
        this.z = 0;

        return this;
    }

});

/*
Vector3.Zero = function ()
{
    return new Vector3(0, 0, 0);
};

Vector3.Up = function ()
{
    return new Vector3(0, 1.0, 0);
};

Vector3.Copy = function (source)
{
    return new Vector3(source.x, source.y, source.z);
};

Vector3.TransformCoordinates = function (vector, transformation)
{
    var x = (vector.x * transformation.m[0]) + (vector.y * transformation.m[4]) + (vector.z * transformation.m[8]) + transformation.m[12];
    var y = (vector.x * transformation.m[1]) + (vector.y * transformation.m[5]) + (vector.z * transformation.m[9]) + transformation.m[13];
    var z = (vector.x * transformation.m[2]) + (vector.y * transformation.m[6]) + (vector.z * transformation.m[10]) + transformation.m[14];
    var w = (vector.x * transformation.m[3]) + (vector.y * transformation.m[7]) + (vector.z * transformation.m[11]) + transformation.m[15];

    return new Vector3(x / w, y / w, z / w);
};

Vector3.TransformNormal = function (vector, transformation)
{
    var x = (vector.x * transformation.m[0]) + (vector.y * transformation.m[4]) + (vector.z * transformation.m[8]);
    var y = (vector.x * transformation.m[1]) + (vector.y * transformation.m[5]) + (vector.z * transformation.m[9]);
    var z = (vector.x * transformation.m[2]) + (vector.y * transformation.m[6]) + (vector.z * transformation.m[10]);

    return new Vector3(x, y, z);
};

Vector3.Dot = function (left, right)
{
    return (left.x * right.x + left.y * right.y + left.z * right.z);
};

Vector3.Cross = function (left, right)
{
    var x = left.y * right.z - left.z * right.y;
    var y = left.z * right.x - left.x * right.z;
    var z = left.x * right.y - left.y * right.x;

    return new Vector3(x, y, z);
};

Vector3.Normalize = function (vector)
{
    var newVector = Vector3.Copy(vector);
    newVector.normalize();

    return newVector;
};

Vector3.Distance = function (value1, value2)
{
    return Math.sqrt(Vector3.DistanceSquared(value1, value2));
};

Vector3.DistanceSquared = function (value1, value2)
{
    var x = value1.x - value2.x;
    var y = value1.y - value2.y;
    var z = value1.z - value2.z;

    return (x * x) + (y * y) + (z * z);
};
*/

module.exports = Vector3;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

//  Adapted from [gl-matrix](https://github.com/toji/gl-matrix) by toji
//  and [vecmath](https://github.com/mattdesl/vecmath) by mattdesl

var Class = __webpack_require__(0);

/**
 * @typedef {object} Vector2Like
 *
 * @property {number} x - The x component.
 * @property {number} y - The y component.
 */

/**
 * @classdesc
 * A representation of a vector in 2D space.
 *
 * A two-component vector.
 *
 * @class Vector2
 * @memberOf Phaser.Math
 * @constructor
 * @since 3.0.0
 *
 * @param {number|Vector2Like} [x] - The x component, or an object with `x` and `y` properties.
 * @param {number} [y] - The y component.
 */
var Vector2 = new Class({

    initialize:

    function Vector2 (x, y)
    {
        /**
         * The x component of this Vector.
         *
         * @name Phaser.Math.Vector2#x
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.x = 0;

        /**
         * The y component of this Vector.
         *
         * @name Phaser.Math.Vector2#y
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.y = 0;

        if (typeof x === 'object')
        {
            this.x = x.x || 0;
            this.y = x.y || 0;
        }
        else
        {
            if (y === undefined) { y = x; }

            this.x = x || 0;
            this.y = y || 0;
        }
    },

    /**
     * Make a clone of this Vector2.
     *
     * @method Phaser.Math.Vector2#clone
     * @since 3.0.0
     *
     * @return {Phaser.Math.Vector2} A clone of this Vector2.
     */
    clone: function ()
    {
        return new Vector2(this.x, this.y);
    },

    /**
     * Copy the components of a given Vector into this Vector.
     *
     * @method Phaser.Math.Vector2#copy
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector2} src - The Vector to copy the components from.
     *
     * @return {Phaser.Math.Vector2} This Vector2.
     */
    copy: function (src)
    {
        this.x = src.x || 0;
        this.y = src.y || 0;

        return this;
    },

    /**
     * Set the component values of this Vector from a given Vector2Like object.
     *
     * @method Phaser.Math.Vector2#setFromObject
     * @since 3.0.0
     *
     * @param {Vector2Like} obj - The object containing the component values to set for this Vector.
     *
     * @return {Phaser.Math.Vector2} This Vector2.
     */
    setFromObject: function (obj)
    {
        this.x = obj.x || 0;
        this.y = obj.y || 0;

        return this;
    },

    /**
     * Set the `x` and `y` components of the this Vector to the given `x` and `y` values.
     *
     * @method Phaser.Math.Vector2#set
     * @since 3.0.0
     *
     * @param {number} x - The x value to set for this Vector.
     * @param {number} [y=x] - The y value to set for this Vector.
     *
     * @return {Phaser.Math.Vector2} This Vector2.
     */
    set: function (x, y)
    {
        if (y === undefined) { y = x; }

        this.x = x;
        this.y = y;

        return this;
    },

    /**
     * This method is an alias for `Vector2.set`.
     *
     * @method Phaser.Math.Vector2#setTo
     * @since 3.4.0
     *
     * @param {number} x - The x value to set for this Vector.
     * @param {number} [y=x] - The y value to set for this Vector.
     *
     * @return {Phaser.Math.Vector2} This Vector2.
     */
    setTo: function (x, y)
    {
        return this.set(x, y);
    },

    /**
     * Sets the `x` and `y` values of this object from a given polar coordinate.
     *
     * @method Phaser.Math.Vector2#setToPolar
     * @since 3.0.0
     *
     * @param {number} azimuth - The angular coordinate, in radians.
     * @param {number} [radius=1] - The radial coordinate (length).
     *
     * @return {Phaser.Math.Vector2} This Vector2.
     */
    setToPolar: function (azimuth, radius)
    {
        if (radius == null) { radius = 1; }

        this.x = Math.cos(azimuth) * radius;
        this.y = Math.sin(azimuth) * radius;

        return this;
    },

    /**
     * Check whether this Vector is equal to a given Vector.
     *
     * Performs a strict equality check against each Vector's components.
     *
     * @method Phaser.Math.Vector2#equals
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector2} v - The vector to compare with this Vector.
     *
     * @return {boolean} Whether the given Vector is equal to this Vector.
     */
    equals: function (v)
    {
        return ((this.x === v.x) && (this.y === v.y));
    },

    /**
     * Calculate the angle between this Vector and the positive x-axis, in radians.
     *
     * @method Phaser.Math.Vector2#angle
     * @since 3.0.0
     *
     * @return {number} The angle between this Vector, and the positive x-axis, given in radians.
     */
    angle: function ()
    {
        // computes the angle in radians with respect to the positive x-axis

        var angle = Math.atan2(this.y, this.x);

        if (angle < 0)
        {
            angle += 2 * Math.PI;
        }

        return angle;
    },

    /**
     * Add a given Vector to this Vector. Addition is component-wise.
     *
     * @method Phaser.Math.Vector2#add
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector2} src - The Vector to add to this Vector.
     *
     * @return {Phaser.Math.Vector2} This Vector2.
     */
    add: function (src)
    {
        this.x += src.x;
        this.y += src.y;

        return this;
    },

    /**
     * Subtract the given Vector from this Vector. Subtraction is component-wise.
     *
     * @method Phaser.Math.Vector2#subtract
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector2} src - The Vector to subtract from this Vector.
     *
     * @return {Phaser.Math.Vector2} This Vector2.
     */
    subtract: function (src)
    {
        this.x -= src.x;
        this.y -= src.y;

        return this;
    },

    /**
     * Perform a component-wise multiplication between this Vector and the given Vector.
     *
     * Multiplies this Vector by the given Vector.
     *
     * @method Phaser.Math.Vector2#multiply
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector2} src - The Vector to multiply this Vector by.
     *
     * @return {Phaser.Math.Vector2} This Vector2.
     */
    multiply: function (src)
    {
        this.x *= src.x;
        this.y *= src.y;

        return this;
    },

    /**
     * Scale this Vector by the given value.
     *
     * @method Phaser.Math.Vector2#scale
     * @since 3.0.0
     *
     * @param {number} value - The value to scale this Vector by.
     *
     * @return {Phaser.Math.Vector2} This Vector2.
     */
    scale: function (value)
    {
        if (isFinite(value))
        {
            this.x *= value;
            this.y *= value;
        }
        else
        {
            this.x = 0;
            this.y = 0;
        }

        return this;
    },

    /**
     * Perform a component-wise division between this Vector and the given Vector.
     *
     * Divides this Vector by the given Vector.
     *
     * @method Phaser.Math.Vector2#divide
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector2} src - The Vector to divide this Vector by.
     *
     * @return {Phaser.Math.Vector2} This Vector2.
     */
    divide: function (src)
    {
        this.x /= src.x;
        this.y /= src.y;

        return this;
    },

    /**
     * Negate the `x` and `y` components of this Vector.
     *
     * @method Phaser.Math.Vector2#negate
     * @since 3.0.0
     *
     * @return {Phaser.Math.Vector2} This Vector2.
     */
    negate: function ()
    {
        this.x = -this.x;
        this.y = -this.y;

        return this;
    },

    /**
     * Calculate the distance between this Vector and the given Vector.
     *
     * @method Phaser.Math.Vector2#distance
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector2} src - The Vector to calculate the distance to.
     *
     * @return {number} The distance from this Vector to the given Vector.
     */
    distance: function (src)
    {
        var dx = src.x - this.x;
        var dy = src.y - this.y;

        return Math.sqrt(dx * dx + dy * dy);
    },

    /**
     * Calculate the distance between this Vector and the given Vector, squared.
     *
     * @method Phaser.Math.Vector2#distanceSq
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector2} src - The Vector to calculate the distance to.
     *
     * @return {number} The distance from this Vector to the given Vector, squared.
     */
    distanceSq: function (src)
    {
        var dx = src.x - this.x;
        var dy = src.y - this.y;

        return dx * dx + dy * dy;
    },

    /**
     * Calculate the length (or magnitude) of this Vector.
     *
     * @method Phaser.Math.Vector2#length
     * @since 3.0.0
     *
     * @return {number} The length of this Vector.
     */
    length: function ()
    {
        var x = this.x;
        var y = this.y;

        return Math.sqrt(x * x + y * y);
    },

    /**
     * Calculate the length of this Vector squared.
     *
     * @method Phaser.Math.Vector2#lengthSq
     * @since 3.0.0
     *
     * @return {number} The length of this Vector, squared.
     */
    lengthSq: function ()
    {
        var x = this.x;
        var y = this.y;

        return x * x + y * y;
    },

    /**
     * Normalize this Vector.
     *
     * Makes the vector a unit length vector (magnitude of 1) in the same direction.
     *
     * @method Phaser.Math.Vector2#normalize
     * @since 3.0.0
     *
     * @return {Phaser.Math.Vector2} This Vector2.
     */
    normalize: function ()
    {
        var x = this.x;
        var y = this.y;
        var len = x * x + y * y;

        if (len > 0)
        {
            len = 1 / Math.sqrt(len);

            this.x = x * len;
            this.y = y * len;
        }

        return this;
    },

    /**
     * Right-hand normalize (make unit length) this Vector.
     *
     * @method Phaser.Math.Vector2#normalizeRightHand
     * @since 3.0.0
     *
     * @return {Phaser.Math.Vector2} This Vector2.
     */
    normalizeRightHand: function ()
    {
        var x = this.x;

        this.x = this.y * -1;
        this.y = x;

        return this;
    },

    /**
     * Calculate the dot product of this Vector and the given Vector.
     *
     * @method Phaser.Math.Vector2#dot
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector2} src - The Vector2 to dot product with this Vector2.
     *
     * @return {number} The dot product of this Vector and the given Vector.
     */
    dot: function (src)
    {
        return this.x * src.x + this.y * src.y;
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Vector2#cross
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector2} src - [description]
     *
     * @return {number} [description]
     */
    cross: function (src)
    {
        return this.x * src.y - this.y * src.x;
    },

    /**
     * Linearly interpolate between this Vector and the given Vector.
     *
     * Interpolates this Vector towards the given Vector.
     *
     * @method Phaser.Math.Vector2#lerp
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector2} src - The Vector2 to interpolate towards.
     * @param {number} [t=0] - The interpolation percentage, between 0 and 1.
     *
     * @return {Phaser.Math.Vector2} This Vector2.
     */
    lerp: function (src, t)
    {
        if (t === undefined) { t = 0; }

        var ax = this.x;
        var ay = this.y;

        this.x = ax + t * (src.x - ax);
        this.y = ay + t * (src.y - ay);

        return this;
    },

    /**
     * Transform this Vector with the given Matrix.
     *
     * @method Phaser.Math.Vector2#transformMat3
     * @since 3.0.0
     *
     * @param {Phaser.Math.Matrix3} mat - The Matrix3 to transform this Vector2 with.
     *
     * @return {Phaser.Math.Vector2} This Vector2.
     */
    transformMat3: function (mat)
    {
        var x = this.x;
        var y = this.y;
        var m = mat.val;

        this.x = m[0] * x + m[3] * y + m[6];
        this.y = m[1] * x + m[4] * y + m[7];

        return this;
    },

    /**
     * Transform this Vector with the given Matrix.
     *
     * @method Phaser.Math.Vector2#transformMat4
     * @since 3.0.0
     *
     * @param {Phaser.Math.Matrix4} mat - The Matrix4 to transform this Vector2 with.
     *
     * @return {Phaser.Math.Vector2} This Vector2.
     */
    transformMat4: function (mat)
    {
        var x = this.x;
        var y = this.y;
        var m = mat.val;

        this.x = m[0] * x + m[4] * y + m[12];
        this.y = m[1] * x + m[5] * y + m[13];

        return this;
    },

    /**
     * Make this Vector the zero vector (0, 0).
     *
     * @method Phaser.Math.Vector2#reset
     * @since 3.0.0
     *
     * @return {Phaser.Math.Vector2} This Vector2.
     */
    reset: function ()
    {
        this.x = 0;
        this.y = 0;

        return this;
    }

});

/**
 * A static zero Vector2 for use by reference.
 *
 * @constant
 * @name Phaser.Math.Vector2.ZERO
 * @type {Vector2}
 * @since 3.1.0
 */
Vector2.ZERO = new Vector2();

module.exports = Vector2;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var MATH = __webpack_require__(17);
var GetValue = __webpack_require__(71);

//  Allowed types:

//  Implicit
//  {
//      x: 4
//  }
//
//  From function
//  {
//      x: function ()
//  }
//
//  Randomly pick one element from the array
//  {
//      x: [a, b, c, d, e, f]
//  }
//
//  Random integer between min and max:
//  {
//      x: { randInt: [min, max] }
//  }
//
//  Random float between min and max:
//  {
//      x: { randFloat: [min, max] }
//  }

/**
 * [description]
 *
 * @function Phaser.Utils.Objects.GetAdvancedValue
 * @since 3.0.0
 *
 * @param {object} source - [description]
 * @param {string} key - [description]
 * @param {*} defaultValue - [description]
 *
 * @return {*} [description]
 */
var GetAdvancedValue = function (source, key, defaultValue)
{
    var value = GetValue(source, key, null);

    if (value === null)
    {
        return defaultValue;
    }
    else if (Array.isArray(value))
    {
        return MATH.RND.pick(value);
    }
    else if (typeof value === 'object')
    {
        if (value.hasOwnProperty('randInt'))
        {
            return MATH.RND.integerInRange(value.randInt[0], value.randInt[1]);
        }
        else if (value.hasOwnProperty('randFloat'))
        {
            return MATH.RND.realInRange(value.randFloat[0], value.randFloat[1]);
        }
    }
    else if (typeof value === 'function')
    {
        return value(key);
    }

    return value;
};

module.exports = GetAdvancedValue;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

//  Adapted from [gl-matrix](https://github.com/toji/gl-matrix) by toji
//  and [vecmath](https://github.com/mattdesl/vecmath) by mattdesl

var Class = __webpack_require__(0);

/**
 * @classdesc
 * A representation of a vector in 4D space.
 *
 * A four-component vector.
 *
 * @class Vector4
 * @memberOf Phaser.Math
 * @constructor
 * @since 3.0.0
 *
 * @param {number} [x] - The x component.
 * @param {number} [y] - The y component.
 * @param {number} [z] - The z component.
 * @param {number} [w] - The w component.
 */
var Vector4 = new Class({

    initialize:

    function Vector4 (x, y, z, w)
    {
        /**
         * The x component of this Vector.
         *
         * @name Phaser.Math.Vector4#x
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.x = 0;

        /**
         * The y component of this Vector.
         *
         * @name Phaser.Math.Vector4#y
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.y = 0;

        /**
         * The z component of this Vector.
         *
         * @name Phaser.Math.Vector4#z
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.z = 0;

        /**
         * The w component of this Vector.
         *
         * @name Phaser.Math.Vector4#w
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.w = 0;

        if (typeof x === 'object')
        {
            this.x = x.x || 0;
            this.y = x.y || 0;
            this.z = x.z || 0;
            this.w = x.w || 0;
        }
        else
        {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
            this.w = w || 0;
        }
    },

    /**
     * Make a clone of this Vector4.
     *
     * @method Phaser.Math.Vector4#clone
     * @since 3.0.0
     *
     * @return {Phaser.Math.Vector4} A clone of this Vector4.
     */
    clone: function ()
    {
        return new Vector4(this.x, this.y, this.z, this.w);
    },

    /**
     * Copy the components of a given Vector into this Vector.
     *
     * @method Phaser.Math.Vector4#copy
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector4} src - The Vector to copy the components from.
     *
     * @return {Phaser.Math.Vector4} This Vector4.
     */
    copy: function (src)
    {
        this.x = src.x;
        this.y = src.y;
        this.z = src.z || 0;
        this.w = src.w || 0;

        return this;
    },

    /**
     * Check whether this Vector is equal to a given Vector.
     *
     * Performs a strict quality check against each Vector's components.
     *
     * @method Phaser.Math.Vector4#equals
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector4} v - [description]
     *
     * @return {boolean} [description]
     */
    equals: function (v)
    {
        return ((this.x === v.x) && (this.y === v.y) && (this.z === v.z) && (this.w === v.w));
    },

    /**
     * Set the `x`, `y`, `z` and `w` components of the this Vector to the given `x`, `y`, `z` and `w` values.
     *
     * @method Phaser.Math.Vector4#set
     * @since 3.0.0
     *
     * @param {(number|object)} x - The x value to set for this Vector, or an object containing x, y, z and w components.
     * @param {number} y - The y value to set for this Vector.
     * @param {number} z - The z value to set for this Vector.
     * @param {number} w - The z value to set for this Vector.
     *
     * @return {Phaser.Math.Vector4} This Vector4.
     */
    set: function (x, y, z, w)
    {
        if (typeof x === 'object')
        {
            this.x = x.x || 0;
            this.y = x.y || 0;
            this.z = x.z || 0;
            this.w = x.w || 0;
        }
        else
        {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
            this.w = w || 0;
        }

        return this;
    },

    /**
     * Add a given Vector to this Vector. Addition is component-wise.
     *
     * @method Phaser.Math.Vector4#add
     * @since 3.0.0
     *
     * @param {(Phaser.Math.Vector2|Phaser.Math.Vector3|Phaser.Math.Vector4)} v - The Vector to add to this Vector.
     *
     * @return {Phaser.Math.Vector4} This Vector4.
     */
    add: function (v)
    {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z || 0;
        this.w += v.w || 0;

        return this;
    },

    /**
     * Subtract the given Vector from this Vector. Subtraction is component-wise.
     *
     * @method Phaser.Math.Vector4#subtract
     * @since 3.0.0
     *
     * @param {(Phaser.Math.Vector2|Phaser.Math.Vector3|Phaser.Math.Vector4)} v - The Vector to subtract from this Vector.
     *
     * @return {Phaser.Math.Vector4} This Vector4.
     */
    subtract: function (v)
    {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z || 0;
        this.w -= v.w || 0;

        return this;
    },

    /**
     * Scale this Vector by the given value.
     *
     * @method Phaser.Math.Vector4#scale
     * @since 3.0.0
     *
     * @param {number} scale - The value to scale this Vector by.
     *
     * @return {Phaser.Math.Vector4} This Vector4.
     */
    scale: function (scale)
    {
        this.x *= scale;
        this.y *= scale;
        this.z *= scale;
        this.w *= scale;

        return this;
    },

    /**
     * Calculate the length (or magnitude) of this Vector.
     *
     * @method Phaser.Math.Vector4#length
     * @since 3.0.0
     *
     * @return {number} The length of this Vector.
     */
    length: function ()
    {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var w = this.w;

        return Math.sqrt(x * x + y * y + z * z + w * w);
    },

    /**
     * Calculate the length of this Vector squared.
     *
     * @method Phaser.Math.Vector4#lengthSq
     * @since 3.0.0
     *
     * @return {number} The length of this Vector, squared.
     */
    lengthSq: function ()
    {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var w = this.w;

        return x * x + y * y + z * z + w * w;
    },

    /**
     * Normalize this Vector.
     *
     * Makes the vector a unit length vector (magnitude of 1) in the same direction.
     *
     * @method Phaser.Math.Vector4#normalize
     * @since 3.0.0
     *
     * @return {Phaser.Math.Vector4} This Vector4.
     */
    normalize: function ()
    {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var w = this.w;
        var len = x * x + y * y + z * z + w * w;

        if (len > 0)
        {
            len = 1 / Math.sqrt(len);

            this.x = x * len;
            this.y = y * len;
            this.z = z * len;
            this.w = w * len;
        }

        return this;
    },

    /**
     * Calculate the dot product of this Vector and the given Vector.
     *
     * @method Phaser.Math.Vector4#dot
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector4} v - The Vector4 to dot product with this Vector4.
     *
     * @return {number} The dot product of this Vector and the given Vector.
     */
    dot: function (v)
    {
        return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
    },

    /**
     * Linearly interpolate between this Vector and the given Vector.
     *
     * Interpolates this Vector towards the given Vector.
     *
     * @method Phaser.Math.Vector4#lerp
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector4} v - The Vector4 to interpolate towards.
     * @param {number} [t=0] - The interpolation percentage, between 0 and 1.
     *
     * @return {Phaser.Math.Vector4} This Vector4.
     */
    lerp: function (v, t)
    {
        if (t === undefined) { t = 0; }

        var ax = this.x;
        var ay = this.y;
        var az = this.z;
        var aw = this.w;

        this.x = ax + t * (v.x - ax);
        this.y = ay + t * (v.y - ay);
        this.z = az + t * (v.z - az);
        this.w = aw + t * (v.w - aw);

        return this;
    },

    /**
     * Perform a component-wise multiplication between this Vector and the given Vector.
     *
     * Multiplies this Vector by the given Vector.
     *
     * @method Phaser.Math.Vector4#multiply
     * @since 3.0.0
     *
     * @param {(Phaser.Math.Vector2|Phaser.Math.Vector3|Phaser.Math.Vector4)} v - The Vector to multiply this Vector by.
     *
     * @return {Phaser.Math.Vector4} This Vector4.
     */
    multiply: function (v)
    {
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z || 1;
        this.w *= v.w || 1;

        return this;
    },

    /**
     * Perform a component-wise division between this Vector and the given Vector.
     *
     * Divides this Vector by the given Vector.
     *
     * @method Phaser.Math.Vector4#divide
     * @since 3.0.0
     *
     * @param {(Phaser.Math.Vector2|Phaser.Math.Vector3|Phaser.Math.Vector4)} v - The Vector to divide this Vector by.
     *
     * @return {Phaser.Math.Vector4} This Vector4.
     */
    divide: function (v)
    {
        this.x /= v.x;
        this.y /= v.y;
        this.z /= v.z || 1;
        this.w /= v.w || 1;

        return this;
    },

    /**
     * Calculate the distance between this Vector and the given Vector.
     *
     * @method Phaser.Math.Vector4#distance
     * @since 3.0.0
     *
     * @param {(Phaser.Math.Vector2|Phaser.Math.Vector3|Phaser.Math.Vector4)} v - [description]
     *
     * @return {number} The distance from this Vector to the given Vector.
     */
    distance: function (v)
    {
        var dx = v.x - this.x;
        var dy = v.y - this.y;
        var dz = v.z - this.z || 0;
        var dw = v.w - this.w || 0;

        return Math.sqrt(dx * dx + dy * dy + dz * dz + dw * dw);
    },

    /**
     * Calculate the distance between this Vector and the given Vector, squared.
     *
     * @method Phaser.Math.Vector4#distanceSq
     * @since 3.0.0
     *
     * @param {(Phaser.Math.Vector2|Phaser.Math.Vector3|Phaser.Math.Vector4)} v - The Vector to calculate the distance to.
     *
     * @return {number} The distance from this Vector to the given Vector, squared.
     */
    distanceSq: function (v)
    {
        var dx = v.x - this.x;
        var dy = v.y - this.y;
        var dz = v.z - this.z || 0;
        var dw = v.w - this.w || 0;

        return dx * dx + dy * dy + dz * dz + dw * dw;
    },

    /**
     * Negate the `x`, `y`, `z` and `w` components of this Vector.
     *
     * @method Phaser.Math.Vector4#negate
     * @since 3.0.0
     *
     * @return {Phaser.Math.Vector4} This Vector4.
     */
    negate: function ()
    {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        this.w = -this.w;

        return this;
    },

    /**
     * Transform this Vector with the given Matrix.
     *
     * @method Phaser.Math.Vector4#transformMat4
     * @since 3.0.0
     *
     * @param {Phaser.Math.Matrix4} mat - The Matrix4 to transform this Vector4 with.
     *
     * @return {Phaser.Math.Vector4} This Vector4.
     */
    transformMat4: function (mat)
    {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var w = this.w;
        var m = mat.val;

        this.x = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
        this.y = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
        this.z = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
        this.w = m[3] * x + m[7] * y + m[11] * z + m[15] * w;

        return this;
    },

    /**
     * Transform this Vector with the given Quaternion.
     *
     * @method Phaser.Math.Vector4#transformQuat
     * @since 3.0.0
     *
     * @param {Phaser.Math.Quaternion} q - The Quaternion to transform this Vector with.
     *
     * @return {Phaser.Math.Vector4} This Vector4.
     */
    transformQuat: function (q)
    {
        // TODO: is this really the same as Vector3?
        // Also, what about this: http://molecularmusings.wordpress.com/2013/05/24/a-faster-quaternion-vector-multiplication/
        // benchmarks: http://jsperf.com/quaternion-transform-vec3-implementations
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var qx = q.x;
        var qy = q.y;
        var qz = q.z;
        var qw = q.w;

        // calculate quat * vec
        var ix = qw * x + qy * z - qz * y;
        var iy = qw * y + qz * x - qx * z;
        var iz = qw * z + qx * y - qy * x;
        var iw = -qx * x - qy * y - qz * z;

        // calculate result * inverse quat
        this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
        this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
        this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

        return this;
    },

    /**
     * Make this Vector the zero vector (0, 0, 0, 0).
     *
     * @method Phaser.Math.Vector4#reset
     * @since 3.0.0
     *
     * @return {Phaser.Math.Vector4} This Vector4.
     */
    reset: function ()
    {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w = 0;

        return this;
    }

});

//  TODO: Check if these are required internally, if not, remove.
Vector4.prototype.sub = Vector4.prototype.subtract;
Vector4.prototype.mul = Vector4.prototype.multiply;
Vector4.prototype.div = Vector4.prototype.divide;
Vector4.prototype.dist = Vector4.prototype.distance;
Vector4.prototype.distSq = Vector4.prototype.distanceSq;
Vector4.prototype.len = Vector4.prototype.length;
Vector4.prototype.lenSq = Vector4.prototype.lengthSq;

module.exports = Vector4;


/***/ }),
/* 6 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * A NOOP (No Operation) callback function.
 *
 * Used internally by Phaser when it's more expensive to determine if a callback exists
 * than it is to just invoke an empty function.
 *
 * @function Phaser.Utils.NOOP
 * @since 3.0.0
 */
var NOOP = function ()
{
    //  NOOP
};

module.exports = NOOP;


/***/ }),
/* 7 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Wrap the given `value` between `min` and `max.
 *
 * @function Phaser.Math.Wrap
 * @since 3.0.0
 *
 * @param {number} value - The value to wrap.
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 *
 * @return {number} The wrapped value.
 */
var Wrap = function (value, min, max)
{
    var range = max - min;

    return (min + ((((value - min) % range) + range) % range));
};

module.exports = Wrap;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = __webpack_require__(0);

/**
 * @classdesc
 * A Matrix used for display transformations for rendering.
 *
 * It is represented like so:
 *
 * ```
 * | a | c | tx |
 * | b | d | ty |
 * | 0 | 0 | 1  |
 * ```
 *
 * @class TransformMatrix
 * @memberOf Phaser.GameObjects.Components
 * @constructor
 * @since 3.0.0
 *
 * @param {number} [a=1] - The Scale X value.
 * @param {number} [b=0] - The Shear Y value.
 * @param {number} [c=0] - The Shear X value.
 * @param {number} [d=1] - The Scale Y value.
 * @param {number} [tx=0] - The Translate X value.
 * @param {number} [ty=0] - The Translate Y value.
 */
var TransformMatrix = new Class({

    initialize:

    function TransformMatrix (a, b, c, d, tx, ty)
    {
        if (a === undefined) { a = 1; }
        if (b === undefined) { b = 0; }
        if (c === undefined) { c = 0; }
        if (d === undefined) { d = 1; }
        if (tx === undefined) { tx = 0; }
        if (ty === undefined) { ty = 0; }

        /**
         * The matrix values.
         *
         * @name Phaser.GameObjects.Components.TransformMatrix#matrix
         * @type {Float32Array}
         * @since 3.0.0
         */
        this.matrix = new Float32Array([ a, b, c, d, tx, ty, 0, 0, 1 ]);

        /**
         * The decomposed matrix.
         *
         * @name Phaser.GameObjects.Components.TransformMatrix#decomposedMatrix
         * @type {object}
         * @since 3.0.0
         */
        this.decomposedMatrix = {
            translateX: 0,
            translateY: 0,
            scaleX: 1,
            scaleY: 1,
            rotation: 0
        };
    },

    /**
     * The Scale X value.
     *
     * @name Phaser.GameObjects.Components.TransformMatrix#a
     * @type {number}
     * @since 3.4.0
     */
    a: {

        get: function ()
        {
            return this.matrix[0];
        },

        set: function (value)
        {
            this.matrix[0] = value;
        }

    },

    /**
     * The Shear Y value.
     *
     * @name Phaser.GameObjects.Components.TransformMatrix#b
     * @type {number}
     * @since 3.4.0
     */
    b: {

        get: function ()
        {
            return this.matrix[1];
        },

        set: function (value)
        {
            this.matrix[1] = value;
        }

    },

    /**
     * The Shear X value.
     *
     * @name Phaser.GameObjects.Components.TransformMatrix#c
     * @type {number}
     * @since 3.4.0
     */
    c: {

        get: function ()
        {
            return this.matrix[2];
        },

        set: function (value)
        {
            this.matrix[2] = value;
        }

    },

    /**
     * The Scale Y value.
     *
     * @name Phaser.GameObjects.Components.TransformMatrix#d
     * @type {number}
     * @since 3.4.0
     */
    d: {

        get: function ()
        {
            return this.matrix[3];
        },

        set: function (value)
        {
            this.matrix[3] = value;
        }

    },

    /**
     * The Translate X value.
     *
     * @name Phaser.GameObjects.Components.TransformMatrix#e
     * @type {number}
     * @since 3.11.0
     */
    e: {

        get: function ()
        {
            return this.matrix[4];
        },

        set: function (value)
        {
            this.matrix[4] = value;
        }

    },

    /**
     * The Translate Y value.
     *
     * @name Phaser.GameObjects.Components.TransformMatrix#f
     * @type {number}
     * @since 3.11.0
     */
    f: {

        get: function ()
        {
            return this.matrix[5];
        },

        set: function (value)
        {
            this.matrix[5] = value;
        }

    },

    /**
     * The Translate X value.
     *
     * @name Phaser.GameObjects.Components.TransformMatrix#tx
     * @type {number}
     * @since 3.4.0
     */
    tx: {

        get: function ()
        {
            return this.matrix[4];
        },

        set: function (value)
        {
            this.matrix[4] = value;
        }

    },

    /**
     * The Translate Y value.
     *
     * @name Phaser.GameObjects.Components.TransformMatrix#ty
     * @type {number}
     * @since 3.4.0
     */
    ty: {

        get: function ()
        {
            return this.matrix[5];
        },

        set: function (value)
        {
            this.matrix[5] = value;
        }

    },

    /**
     * The rotation of the Matrix.
     *
     * @name Phaser.GameObjects.Components.TransformMatrix#rotation
     * @type {number}
     * @readOnly
     * @since 3.4.0
     */
    rotation: {

        get: function ()
        {
            return Math.acos(this.a / this.scaleX) * (Math.atan(-this.c / this.a) < 0 ? -1 : 1);
        }

    },

    /**
     * The horizontal scale of the Matrix.
     *
     * @name Phaser.GameObjects.Components.TransformMatrix#scaleX
     * @type {number}
     * @readOnly
     * @since 3.4.0
     */
    scaleX: {

        get: function ()
        {
            return Math.sqrt((this.a * this.a) + (this.c * this.c));
        }

    },

    /**
     * The vertical scale of the Matrix.
     *
     * @name Phaser.GameObjects.Components.TransformMatrix#scaleY
     * @type {number}
     * @readOnly
     * @since 3.4.0
     */
    scaleY: {

        get: function ()
        {
            return Math.sqrt((this.b * this.b) + (this.d * this.d));
        }

    },

    /**
     * Reset the Matrix to an identity matrix.
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#loadIdentity
     * @since 3.0.0
     *
     * @return {this} This TransformMatrix.
     */
    loadIdentity: function ()
    {
        var matrix = this.matrix;

        matrix[0] = 1;
        matrix[1] = 0;
        matrix[2] = 0;
        matrix[3] = 1;
        matrix[4] = 0;
        matrix[5] = 0;

        return this;
    },

    /**
     * Translate the Matrix.
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#translate
     * @since 3.0.0
     *
     * @param {number} x - The horizontal translation value.
     * @param {number} y - The vertical translation value.
     *
     * @return {this} This TransformMatrix.
     */
    translate: function (x, y)
    {
        var matrix = this.matrix;

        matrix[4] = matrix[0] * x + matrix[2] * y + matrix[4];
        matrix[5] = matrix[1] * x + matrix[3] * y + matrix[5];

        return this;
    },

    /**
     * Scale the Matrix.
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#scale
     * @since 3.0.0
     *
     * @param {number} x - The horizontal scale value.
     * @param {number} y - The vertical scale value.
     *
     * @return {this} This TransformMatrix.
     */
    scale: function (x, y)
    {
        var matrix = this.matrix;

        matrix[0] *= x;
        matrix[1] *= x;
        matrix[2] *= y;
        matrix[3] *= y;

        return this;
    },

    /**
     * Rotate the Matrix.
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#rotate
     * @since 3.0.0
     *
     * @param {number} angle - The angle of rotation in radians.
     *
     * @return {this} This TransformMatrix.
     */
    rotate: function (angle)
    {
        var sin = Math.sin(angle);
        var cos = Math.cos(angle);

        var matrix = this.matrix;

        var a = matrix[0];
        var b = matrix[1];
        var c = matrix[2];
        var d = matrix[3];

        matrix[0] = a * cos + c * sin;
        matrix[1] = b * cos + d * sin;
        matrix[2] = a * -sin + c * cos;
        matrix[3] = b * -sin + d * cos;

        return this;
    },

    /**
     * Multiply this Matrix by the given Matrix.
     * 
     * If an `out` Matrix is given then the results will be stored in it.
     * If it is not given, this matrix will be updated in place instead.
     * Use an `out` Matrix if you do not wish to mutate this matrix.
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#multiply
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Components.TransformMatrix} rhs - The Matrix to multiply by.
     * @param {Phaser.GameObjects.Components.TransformMatrix} [out] - An optional Matrix to store the results in.
     *
     * @return {Phaser.GameObjects.Components.TransformMatrix} Either this TransformMatrix, or the `out` Matrix, if given in the arguments.
     */
    multiply: function (rhs, out)
    {
        var matrix = this.matrix;
        var source = rhs.matrix;

        var localA = matrix[0];
        var localB = matrix[1];
        var localC = matrix[2];
        var localD = matrix[3];
        var localE = matrix[4];
        var localF = matrix[5];

        var sourceA = source[0];
        var sourceB = source[1];
        var sourceC = source[2];
        var sourceD = source[3];
        var sourceE = source[4];
        var sourceF = source[5];

        var destinationMatrix = (out === undefined) ? this : out;

        destinationMatrix.a = sourceA * localA + sourceB * localC;
        destinationMatrix.b = sourceA * localB + sourceB * localD;
        destinationMatrix.c = sourceC * localA + sourceD * localC;
        destinationMatrix.d = sourceC * localB + sourceD * localD;
        destinationMatrix.e = sourceE * localA + sourceF * localC + localE;
        destinationMatrix.f = sourceE * localB + sourceF * localD + localF;

        return destinationMatrix;
    },

    /**
     * Multiply this Matrix by the matrix given, including the offset.
     * 
     * The offsetX is added to the tx value: `offsetX * a + offsetY * c + tx`.
     * The offsetY is added to the ty value: `offsetY * b + offsetY * d + ty`.
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#multiplyWithOffset
     * @since 3.11.0
     *
     * @param {Phaser.GameObjects.Components.TransformMatrix} src - The source Matrix to copy from.
     * @param {number} offsetX - Horizontal offset to factor in to the multiplication.
     * @param {number} offsetY - Vertical offset to factor in to the multiplication.
     *
     * @return {this} This TransformMatrix.
     */
    multiplyWithOffset: function (src, offsetX, offsetY)
    {
        var matrix = this.matrix;
        var otherMatrix = src.matrix;

        var a0 = matrix[0];
        var b0 = matrix[1];
        var c0 = matrix[2];
        var d0 = matrix[3];
        var tx0 = matrix[4];
        var ty0 = matrix[5];

        var pse = offsetX * a0 + offsetY * c0 + tx0;
        var psf = offsetX * b0 + offsetY * d0 + ty0;

        var a1 = otherMatrix[0];
        var b1 = otherMatrix[1];
        var c1 = otherMatrix[2];
        var d1 = otherMatrix[3];
        var tx1 = otherMatrix[4];
        var ty1 = otherMatrix[5];

        matrix[0] = a1 * a0 + b1 * c0;
        matrix[1] = a1 * b0 + b1 * d0;
        matrix[2] = c1 * a0 + d1 * c0;
        matrix[3] = c1 * b0 + d1 * d0;
        matrix[4] = tx1 * a0 + ty1 * c0 + pse;
        matrix[5] = tx1 * b0 + ty1 * d0 + psf;

        return this;
    },

    /**
     * Transform the Matrix.
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#transform
     * @since 3.0.0
     *
     * @param {number} a - The Scale X value.
     * @param {number} b - The Shear Y value.
     * @param {number} c - The Shear X value.
     * @param {number} d - The Scale Y value.
     * @param {number} tx - The Translate X value.
     * @param {number} ty - The Translate Y value.
     *
     * @return {this} This TransformMatrix.
     */
    transform: function (a, b, c, d, tx, ty)
    {
        var matrix = this.matrix;

        var a0 = matrix[0];
        var b0 = matrix[1];
        var c0 = matrix[2];
        var d0 = matrix[3];
        var tx0 = matrix[4];
        var ty0 = matrix[5];

        matrix[0] = a * a0 + b * c0;
        matrix[1] = a * b0 + b * d0;
        matrix[2] = c * a0 + d * c0;
        matrix[3] = c * b0 + d * d0;
        matrix[4] = tx * a0 + ty * c0 + tx0;
        matrix[5] = tx * b0 + ty * d0 + ty0;

        return this;
    },

    /**
     * Transform a point using this Matrix.
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#transformPoint
     * @since 3.0.0
     *
     * @param {number} x - The x coordinate of the point to transform.
     * @param {number} y - The y coordinate of the point to transform.
     * @param {(Phaser.Geom.Point|Phaser.Math.Vector2|object)} point - The Point object to store the transformed coordinates.
     *
     * @return {(Phaser.Geom.Point|Phaser.Math.Vector2|object)} The Point containing the transformed coordinates.
     */
    transformPoint: function (x, y, point)
    {
        if (point === undefined) { point = { x: 0, y: 0 }; }

        var matrix = this.matrix;

        var a = matrix[0];
        var b = matrix[1];
        var c = matrix[2];
        var d = matrix[3];
        var tx = matrix[4];
        var ty = matrix[5];

        point.x = x * a + y * c + tx;
        point.y = x * b + y * d + ty;

        return point;
    },

    /**
     * Invert the Matrix.
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#invert
     * @since 3.0.0
     *
     * @return {this} This TransformMatrix.
     */
    invert: function ()
    {
        var matrix = this.matrix;

        var a = matrix[0];
        var b = matrix[1];
        var c = matrix[2];
        var d = matrix[3];
        var tx = matrix[4];
        var ty = matrix[5];

        var n = a * d - b * c;

        matrix[0] = d / n;
        matrix[1] = -b / n;
        matrix[2] = -c / n;
        matrix[3] = a / n;
        matrix[4] = (c * ty - d * tx) / n;
        matrix[5] = -(a * ty - b * tx) / n;

        return this;
    },

    /**
     * Set the values of this Matrix to copy those of the matrix given.
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#copyFrom
     * @since 3.11.0
     *
     * @param {Phaser.GameObjects.Components.TransformMatrix} src - The source Matrix to copy from.
     *
     * @return {this} This TransformMatrix.
     */
    copyFrom: function (src)
    {
        var matrix = this.matrix;

        matrix[0] = src.a;
        matrix[1] = src.b;
        matrix[2] = src.c;
        matrix[3] = src.d;
        matrix[4] = src.e;
        matrix[5] = src.f;

        return this;
    },

    /**
     * Set the values of this Matrix to copy those of the array given.
     * Where array indexes 0, 1, 2, 3, 4 and 5 are mapped to a, b, c, d, e and f.
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#copyFromArray
     * @since 3.11.0
     *
     * @param {array} src - The array of values to set into this matrix.
     *
     * @return {this} This TransformMatrix.
     */
    copyFromArray: function (src)
    {
        var matrix = this.matrix;

        matrix[0] = src[0];
        matrix[1] = src[1];
        matrix[2] = src[2];
        matrix[3] = src[3];
        matrix[4] = src[4];
        matrix[5] = src[5];

        return this;
    },

    /**
     * Copy the values from this Matrix to the given Canvas Rendering Context.
     * This will use the Context.transform method.
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#copyToContext
     * @since 3.12.0
     *
     * @param {CanvasRenderingContext2D} ctx - The Canvas Rendering Context to copy the matrix values to.
     *
     * @return {CanvasRenderingContext2D} The Canvas Rendering Context.
     */
    copyToContext: function (ctx)
    {
        var matrix = this.matrix;

        ctx.transform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);

        return ctx;
    },

    /**
     * Copy the values from this Matrix to the given Canvas Rendering Context.
     * This will use the Context.setTransform method.
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#setToContext
     * @since 3.12.0
     *
     * @param {CanvasRenderingContext2D} ctx - The Canvas Rendering Context to copy the matrix values to.
     *
     * @return {CanvasRenderingContext2D} The Canvas Rendering Context.
     */
    setToContext: function (ctx)
    {
        var matrix = this.matrix;

        ctx.setTransform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);

        return ctx;
    },

    /**
     * Copy the values in this Matrix to the array given.
     * 
     * Where array indexes 0, 1, 2, 3, 4 and 5 are mapped to a, b, c, d, e and f.
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#copyToArray
     * @since 3.12.0
     *
     * @param {array} [out] - The array to copy the matrix values in to.
     *
     * @return {array} An array where elements 0 to 5 contain the values from this matrix.
     */
    copyToArray: function (out)
    {
        var matrix = this.matrix;

        if (out === undefined)
        {
            out = [ matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5] ];
        }
        else
        {
            out[0] = matrix[0];
            out[1] = matrix[1];
            out[2] = matrix[2];
            out[3] = matrix[3];
            out[4] = matrix[4];
            out[5] = matrix[5];
        }

        return out;
    },

    /**
     * Set the values of this Matrix.
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#setTransform
     * @since 3.0.0
     *
     * @param {number} a - The Scale X value.
     * @param {number} b - The Shear Y value.
     * @param {number} c - The Shear X value.
     * @param {number} d - The Scale Y value.
     * @param {number} tx - The Translate X value.
     * @param {number} ty - The Translate Y value.
     *
     * @return {this} This TransformMatrix.
     */
    setTransform: function (a, b, c, d, tx, ty)
    {
        var matrix = this.matrix;

        matrix[0] = a;
        matrix[1] = b;
        matrix[2] = c;
        matrix[3] = d;
        matrix[4] = tx;
        matrix[5] = ty;

        return this;
    },

    /**
     * Decompose this Matrix into its translation, scale and rotation values.
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#decomposeMatrix
     * @since 3.0.0
     *
     * @return {object} The decomposed Matrix.
     */
    decomposeMatrix: function ()
    {
        var decomposedMatrix = this.decomposedMatrix;

        var matrix = this.matrix;

        //  a = scale X (1)
        //  b = shear Y (0)
        //  c = shear X (0)
        //  d = scale Y (1)

        var a = matrix[0];
        var b = matrix[1];
        var c = matrix[2];
        var d = matrix[3];

        var a2 = a * a;
        var b2 = b * b;
        var c2 = c * c;
        var d2 = d * d;

        var sx = Math.sqrt(a2 + c2);
        var sy = Math.sqrt(b2 + d2);

        decomposedMatrix.translateX = matrix[4];
        decomposedMatrix.translateY = matrix[5];

        decomposedMatrix.scaleX = sx;
        decomposedMatrix.scaleY = sy;

        decomposedMatrix.rotation = Math.acos(a / sx) * (Math.atan(-c / a) < 0 ? -1 : 1);

        return decomposedMatrix;
    },

    /**
     * Apply the identity, translate, rotate and scale operations on the Matrix.
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#applyITRS
     * @since 3.0.0
     *
     * @param {number} x - The horizontal translation.
     * @param {number} y - The vertical translation.
     * @param {number} rotation - The angle of rotation in radians.
     * @param {number} scaleX - The horizontal scale.
     * @param {number} scaleY - The vertical scale.
     *
     * @return {this} This TransformMatrix.
     */
    applyITRS: function (x, y, rotation, scaleX, scaleY)
    {
        var matrix = this.matrix;

        var radianSin = Math.sin(rotation);
        var radianCos = Math.cos(rotation);

        // Translate
        matrix[4] = x;
        matrix[5] = y;

        // Rotate and Scale
        matrix[0] = radianCos * scaleX;
        matrix[1] = radianSin * scaleX;
        matrix[2] = -radianSin * scaleY;
        matrix[3] = radianCos * scaleY;

        return this;
    },

    /**
     * Returns the X component of this matrix multiplied by the given values.
     * This is the same as `x * a + y * c + e`.
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#getX
     * @since 3.12.0
     * 
     * @param {number} x - The x value.
     * @param {number} y - The y value.
     *
     * @return {number} The calculated x value.
     */
    getX: function (x, y)
    {
        return x * this.a + y * this.c + this.e;
    },

    /**
     * Returns the Y component of this matrix multiplied by the given values.
     * This is the same as `x * b + y * d + f`.
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#getY
     * @since 3.12.0
     * 
     * @param {number} x - The x value.
     * @param {number} y - The y value.
     *
     * @return {number} The calculated y value.
     */
    getY: function (x, y)
    {
        return x * this.b + y * this.d + this.f;
    },

    /**
     * Returns a string that can be used in a CSS Transform call as a `matrix` property.
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#getCSSMatrix
     * @since 3.12.0
     *
     * @return {string} A string containing the CSS Transform matrix values.
     */
    getCSSMatrix: function ()
    {
        var m = this.matrix;

        return 'matrix(' + m[0] + ',' + m[1] + ',' + m[2] + ',' + m[3] + ',' + m[4] + ',' + m[5] + ')';
    },

    /**
     * Destroys this Transform Matrix.
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#destroy
     * @since 3.4.0
     */
    destroy: function ()
    {
        this.matrix = null;
        this.decomposedMatrix = null;
    }

});

module.exports = TransformMatrix;


/***/ }),
/* 9 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Geom.Rectangle.Perimeter
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} rect - [description]
 *
 * @return {number} [description]
 */
var Perimeter = function (rect)
{
    return 2 * (rect.width + rect.height);
};

module.exports = Perimeter;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Perimeter = __webpack_require__(9);
var Point = __webpack_require__(1);

/**
 * Position is a value between 0 and 1 where 0 = the top-left of the rectangle and 0.5 = the bottom right.
 *
 * @function Phaser.Geom.Rectangle.GetPoint
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [out,$return]
 *
 * @param {Phaser.Geom.Rectangle} rectangle - [description]
 * @param {number} position - [description]
 * @param {(Phaser.Geom.Point|object)} [out] - [description]
 *
 * @return {Phaser.Geom.Point} [description]
 */
var GetPoint = function (rectangle, position, out)
{
    if (out === undefined) { out = new Point(); }

    if (position <= 0 || position >= 1)
    {
        out.x = rectangle.x;
        out.y = rectangle.y;

        return out;
    }

    var p = Perimeter(rectangle) * position;

    if (position > 0.5)
    {
        p -= (rectangle.width + rectangle.height);

        if (p <= rectangle.width)
        {
            //  Face 3
            out.x = rectangle.right - p;
            out.y = rectangle.bottom;
        }
        else
        {
            //  Face 4
            out.x = rectangle.x;
            out.y = rectangle.bottom - (p - rectangle.width);
        }
    }
    else if (p <= rectangle.width)
    {
        //  Face 1
        out.x = rectangle.x + p;
        out.y = rectangle.y;
    }
    else
    {
        //  Face 2
        out.x = rectangle.right;
        out.y = rectangle.y + (p - rectangle.width);
    }

    return out;
};

module.exports = GetPoint;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * @namespace Phaser.GameObjects.Components
 */

module.exports = {

    Alpha: __webpack_require__(62),
    Animation: __webpack_require__(60),
    BlendMode: __webpack_require__(59),
    ComputedSize: __webpack_require__(58),
    Crop: __webpack_require__(57),
    Depth: __webpack_require__(56),
    Flip: __webpack_require__(55),
    GetBounds: __webpack_require__(54),
    Mask: __webpack_require__(43),
    Origin: __webpack_require__(40),
    Pipeline: __webpack_require__(39),
    ScaleMode: __webpack_require__(38),
    ScrollFactor: __webpack_require__(37),
    Size: __webpack_require__(36),
    Texture: __webpack_require__(35),
    TextureCrop: __webpack_require__(34),
    Tint: __webpack_require__(33),
    ToJSON: __webpack_require__(32),
    Transform: __webpack_require__(31),
    TransformMatrix: __webpack_require__(8),
    Visible: __webpack_require__(28)

};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = __webpack_require__(0);
var Components = __webpack_require__(11);
var DataManager = __webpack_require__(27);
var EventEmitter = __webpack_require__(26);

/**
 * @classdesc
 * The base class that all Game Objects extend.
 * You don't create GameObjects directly and they cannot be added to the display list.
 * Instead, use them as the base for your own custom classes.
 *
 * @class GameObject
 * @memberOf Phaser.GameObjects
 * @extends Phaser.Events.EventEmitter
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs.
 * @param {string} type - A textual representation of the type of Game Object, i.e. `sprite`.
 */
var GameObject = new Class({

    Extends: EventEmitter,

    initialize:

    function GameObject (scene, type)
    {
        EventEmitter.call(this);

        /**
         * The Scene to which this Game Object belongs.
         * Game Objects can only belong to one Scene.
         *
         * @name Phaser.GameObjects.GameObject#scene
         * @type {Phaser.Scene}
         * @protected
         * @since 3.0.0
         */
        this.scene = scene;

        /**
         * A textual representation of this Game Object, i.e. `sprite`.
         * Used internally by Phaser but is available for your own custom classes to populate.
         *
         * @name Phaser.GameObjects.GameObject#type
         * @type {string}
         * @since 3.0.0
         */
        this.type = type;

        /**
         * The parent Container of this Game Object, if it has one.
         *
         * @name Phaser.GameObjects.GameObject#parentContainer
         * @type {Phaser.GameObjects.Container}
         * @since 3.4.0
         */
        this.parentContainer = null;

        /**
         * The name of this Game Object.
         * Empty by default and never populated by Phaser, this is left for developers to use.
         *
         * @name Phaser.GameObjects.GameObject#name
         * @type {string}
         * @default ''
         * @since 3.0.0
         */
        this.name = '';

        /**
         * The active state of this Game Object.
         * A Game Object with an active state of `true` is processed by the Scenes UpdateList, if added to it.
         * An active object is one which is having its logic and internal systems updated.
         *
         * @name Phaser.GameObjects.GameObject#active
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.active = true;

        /**
         * The Tab Index of the Game Object.
         * Reserved for future use by plugins and the Input Manager.
         *
         * @name Phaser.GameObjects.GameObject#tabIndex
         * @type {integer}
         * @default -1
         * @since 3.0.0
         */
        this.tabIndex = -1;

        /**
         * A Data Manager.
         * It allows you to store, query and get key/value paired information specific to this Game Object.
         * `null` by default. Automatically created if you use `getData` or `setData` or `setDataEnabled`.
         *
         * @name Phaser.GameObjects.GameObject#data
         * @type {Phaser.Data.DataManager}
         * @default null
         * @since 3.0.0
         */
        this.data = null;

        /**
         * The flags that are compared against `RENDER_MASK` to determine if this Game Object will render or not.
         * The bits are 0001 | 0010 | 0100 | 1000 set by the components Visible, Alpha, Transform and Texture respectively.
         * If those components are not used by your custom class then you can use this bitmask as you wish.
         *
         * @name Phaser.GameObjects.GameObject#renderFlags
         * @type {integer}
         * @default 15
         * @since 3.0.0
         */
        this.renderFlags = 15;

        /**
         * A bitmask that controls if this Game Object is drawn by a Camera or not.
         * Not usually set directly, instead call `Camera.ignore`, however you can
         * set this property directly using the Camera.id property:
         *
         * @example
         * this.cameraFilter |= camera.id
         *
         * @name Phaser.GameObjects.GameObject#cameraFilter
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.cameraFilter = 0;

        /**
         * If this Game Object is enabled for input then this property will contain an InteractiveObject instance.
         * Not usually set directly. Instead call `GameObject.setInteractive()`.
         *
         * @name Phaser.GameObjects.GameObject#input
         * @type {?Phaser.Input.InteractiveObject}
         * @default null
         * @since 3.0.0
         */
        this.input = null;

        /**
         * If this Game Object is enabled for physics then this property will contain a reference to a Physics Body.
         *
         * @name Phaser.GameObjects.GameObject#body
         * @type {?(object|Phaser.Physics.Arcade.Body|Phaser.Physics.Impact.Body)}
         * @default null
         * @since 3.0.0
         */
        this.body = null;

        /**
         * This Game Object will ignore all calls made to its destroy method if this flag is set to `true`.
         * This includes calls that may come from a Group, Container or the Scene itself.
         * While it allows you to persist a Game Object across Scenes, please understand you are entirely
         * responsible for managing references to and from this Game Object.
         *
         * @name Phaser.GameObjects.GameObject#ignoreDestroy
         * @type {boolean}
         * @default false
         * @since 3.5.0
         */
        this.ignoreDestroy = false;

        //  Tell the Scene to re-sort the children
        scene.sys.queueDepthSort();

        scene.sys.events.once('shutdown', this.destroy, this);
    },

    /**
     * Sets the `active` property of this Game Object and returns this Game Object for further chaining.
     * A Game Object with its `active` property set to `true` will be updated by the Scenes UpdateList.
     *
     * @method Phaser.GameObjects.GameObject#setActive
     * @since 3.0.0
     *
     * @param {boolean} value - True if this Game Object should be set as active, false if not.
     *
     * @return {this} This GameObject.
     */
    setActive: function (value)
    {
        this.active = value;

        return this;
    },

    /**
     * Sets the `name` property of this Game Object and returns this Game Object for further chaining.
     * The `name` property is not populated by Phaser and is presented for your own use.
     *
     * @method Phaser.GameObjects.GameObject#setName
     * @since 3.0.0
     *
     * @param {string} value - The name to be given to this Game Object.
     *
     * @return {this} This GameObject.
     */
    setName: function (value)
    {
        this.name = value;

        return this;
    },

    /**
     * Adds a Data Manager component to this Game Object.
     *
     * @method Phaser.GameObjects.GameObject#setDataEnabled
     * @since 3.0.0
     * @see Phaser.Data.DataManager
     *
     * @return {this} This GameObject.
     */
    setDataEnabled: function ()
    {
        if (!this.data)
        {
            this.data = new DataManager(this);
        }

        return this;
    },

    /**
     * Allows you to store a key value pair within this Game Objects Data Manager.
     *
     * If the Game Object has not been enabled for data (via `setDataEnabled`) then it will be enabled
     * before setting the value.
     *
     * If the key doesn't already exist in the Data Manager then it is created.
     *
     * ```javascript
     * sprite.setData('name', 'Red Gem Stone');
     * ```
     *
     * You can also pass in an object of key value pairs as the first argument:
     *
     * ```javascript
     * sprite.setData({ name: 'Red Gem Stone', level: 2, owner: 'Link', gold: 50 });
     * ```
     *
     * To get a value back again you can call `getData`:
     *
     * ```javascript
     * sprite.getData('gold');
     * ```
     *
     * Or you can access the value directly via the `values` property, where it works like any other variable:
     *
     * ```javascript
     * sprite.data.values.gold += 50;
     * ```
     *
     * When the value is first set, a `setdata` event is emitted from this Game Object.
     *
     * If the key already exists, a `changedata` event is emitted instead, along an event named after the key.
     * For example, if you updated an existing key called `PlayerLives` then it would emit the event `changedata_PlayerLives`.
     * These events will be emitted regardless if you use this method to set the value, or the direct `values` setter.
     *
     * Please note that the data keys are case-sensitive and must be valid JavaScript Object property strings.
     * This means the keys `gold` and `Gold` are treated as two unique values within the Data Manager.
     *
     * @method Phaser.GameObjects.GameObject#setData
     * @since 3.0.0
     *
     * @param {(string|object)} key - The key to set the value for. Or an object or key value pairs. If an object the `data` argument is ignored.
     * @param {*} data - The value to set for the given key. If an object is provided as the key this argument is ignored.
     *
     * @return {this} This GameObject.
     */
    setData: function (key, value)
    {
        if (!this.data)
        {
            this.data = new DataManager(this);
        }

        this.data.set(key, value);

        return this;
    },

    /**
     * Retrieves the value for the given key in this Game Objects Data Manager, or undefined if it doesn't exist.
     *
     * You can also access values via the `values` object. For example, if you had a key called `gold` you can do either:
     *
     * ```javascript
     * sprite.getData('gold');
     * ```
     *
     * Or access the value directly:
     *
     * ```javascript
     * sprite.data.values.gold;
     * ```
     *
     * You can also pass in an array of keys, in which case an array of values will be returned:
     *
     * ```javascript
     * sprite.getData([ 'gold', 'armor', 'health' ]);
     * ```
     *
     * This approach is useful for destructuring arrays in ES6.
     *
     * @method Phaser.GameObjects.GameObject#getData
     * @since 3.0.0
     *
     * @param {(string|string[])} key - The key of the value to retrieve, or an array of keys.
     *
     * @return {*} The value belonging to the given key, or an array of values, the order of which will match the input array.
     */
    getData: function (key)
    {
        if (!this.data)
        {
            this.data = new DataManager(this);
        }

        return this.data.get(key);
    },

    /**
     * Pass this Game Object to the Input Manager to enable it for Input.
     *
     * Input works by using hit areas, these are nearly always geometric shapes, such as rectangles or circles, that act as the hit area
     * for the Game Object. However, you can provide your own hit area shape and callback, should you wish to handle some more advanced
     * input detection.
     *
     * If no arguments are provided it will try and create a rectangle hit area based on the texture frame the Game Object is using. If
     * this isn't a texture-bound object, such as a Graphics or BitmapText object, this will fail, and you'll need to provide a specific
     * shape for it to use.
     *
     * You can also provide an Input Configuration Object as the only argument to this method.
     *
     * @method Phaser.GameObjects.GameObject#setInteractive
     * @since 3.0.0
     *
     * @param {(Phaser.Input.InputConfiguration|any)} [shape] - Either an input configuration object, or a geometric shape that defines the hit area for the Game Object. If not specified a Rectangle will be used.
     * @param {HitAreaCallback} [callback] - A callback to be invoked when the Game Object is interacted with. If you provide a shape you must also provide a callback.
     * @param {boolean} [dropZone=false] - Should this Game Object be treated as a drop zone target?
     *
     * @return {this} This GameObject.
     */
    setInteractive: function (shape, callback, dropZone)
    {
        this.scene.sys.input.enable(this, shape, callback, dropZone);

        return this;
    },

    /**
     * If this Game Object has previously been enabled for input, this will disable it.
     *
     * An object that is disabled for input stops processing or being considered for
     * input events, but can be turned back on again at any time by simply calling
     * `setInteractive()` with no arguments provided.
     *
     * If want to completely remove interaction from this Game Object then use `removeInteractive` instead.
     *
     * @method Phaser.GameObjects.GameObject#disableInteractive
     * @since 3.7.0
     *
     * @return {this} This GameObject.
     */
    disableInteractive: function ()
    {
        if (this.input)
        {
            this.input.enabled = false;
        }

        return this;
    },

    /**
     * If this Game Object has previously been enabled for input, this will queue it
     * for removal, causing it to no longer be interactive. The removal happens on
     * the next game step, it is not immediate.
     *
     * The Interactive Object that was assigned to this Game Object will be destroyed,
     * removed from the Input Manager and cleared from this Game Object.
     *
     * If you wish to re-enable this Game Object at a later date you will need to
     * re-create its InteractiveObject by calling `setInteractive` again.
     *
     * If you wish to only temporarily stop an object from receiving input then use
     * `disableInteractive` instead, as that toggles the interactive state, where-as
     * this erases it completely.
     * 
     * If you wish to resize a hit area, don't remove and then set it as being
     * interactive. Instead, access the hitarea object directly and resize the shape
     * being used. I.e.: `sprite.input.hitArea.setSize(width, height)` (assuming the
     * shape is a Rectangle, which it is by default.)
     *
     * @method Phaser.GameObjects.GameObject#removeInteractive
     * @since 3.7.0
     *
     * @return {this} This GameObject.
     */
    removeInteractive: function ()
    {
        this.scene.sys.input.clear(this);

        this.input = undefined;

        return this;
    },

    /**
     * To be overridden by custom GameObjects. Allows base objects to be used in a Pool.
     *
     * @method Phaser.GameObjects.GameObject#update
     * @since 3.0.0
     *
     * @param {...*} [args] - args
     */
    update: function ()
    {
    },

    /**
     * Returns a JSON representation of the Game Object.
     *
     * @method Phaser.GameObjects.GameObject#toJSON
     * @since 3.0.0
     *
     * @return {JSONGameObject} A JSON representation of the Game Object.
     */
    toJSON: function ()
    {
        return Components.ToJSON(this);
    },

    /**
     * Compares the renderMask with the renderFlags to see if this Game Object will render or not.
     * Also checks the Game Object against the given Cameras exclusion list.
     *
     * @method Phaser.GameObjects.GameObject#willRender
     * @since 3.0.0
     *
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to check against this Game Object.
     *
     * @return {boolean} True if the Game Object should be rendered, otherwise false.
     */
    willRender: function (camera)
    {
        return !(GameObject.RENDER_MASK !== this.renderFlags || (this.cameraFilter > 0 && (this.cameraFilter & camera.id)));
    },

    /**
     * Returns an array containing the display list index of either this Game Object, or if it has one,
     * its parent Container. It then iterates up through all of the parent containers until it hits the
     * root of the display list (which is index 0 in the returned array).
     *
     * Used internally by the InputPlugin but also useful if you wish to find out the display depth of
     * this Game Object and all of its ancestors.
     *
     * @method Phaser.GameObjects.GameObject#getIndexList
     * @since 3.4.0
     *
     * @return {integer[]} An array of display list position indexes.
     */
    getIndexList: function ()
    {
        // eslint-disable-next-line consistent-this
        var child = this;
        var parent = this.parentContainer;

        var indexes = [];

        while (parent)
        {
            // indexes.unshift([parent.getIndex(child), parent.name]);
            indexes.unshift(parent.getIndex(child));

            child = parent;

            if (!parent.parentContainer)
            {
                break;
            }
            else
            {
                parent = parent.parentContainer;
            }
        }

        // indexes.unshift([this.scene.sys.displayList.getIndex(child), 'root']);
        indexes.unshift(this.scene.sys.displayList.getIndex(child));

        return indexes;
    },

    /**
     * Destroys this Game Object removing it from the Display List and Update List and
     * severing all ties to parent resources.
     *
     * Also removes itself from the Input Manager and Physics Manager if previously enabled.
     *
     * Use this to remove a Game Object from your game if you don't ever plan to use it again.
     * As long as no reference to it exists within your own code it should become free for
     * garbage collection by the browser.
     *
     * If you just want to temporarily disable an object then look at using the
     * Game Object Pool instead of destroying it, as destroyed objects cannot be resurrected.
     *
     * @method Phaser.GameObjects.GameObject#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        //  This Game Object had already been destroyed
        if (!this.scene || this.ignoreDestroy)
        {
            return;
        }

        if (this.preDestroy)
        {
            this.preDestroy.call(this);
        }

        this.emit('destroy', this);

        var sys = this.scene.sys;

        sys.displayList.remove(this);
        sys.updateList.remove(this);

        if (this.input)
        {
            sys.input.clear(this);
            this.input = undefined;
        }

        if (this.data)
        {
            this.data.destroy();

            this.data = undefined;
        }

        if (this.body)
        {
            this.body.destroy();
            this.body = undefined;
        }

        //  Tell the Scene to re-sort the children
        sys.queueDepthSort();

        this.active = false;
        this.visible = false;

        this.scene = undefined;

        this.parentContainer = undefined;

        this.removeAllListeners();
    }

});

/**
 * The bitmask that `GameObject.renderFlags` is compared against to determine if the Game Object will render or not.
 *
 * @constant {integer} RENDER_MASK
 * @memberOf Phaser.GameObjects.GameObject
 * @default
 */
GameObject.RENDER_MASK = 15;

module.exports = GameObject;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = __webpack_require__(0);
var GameObject = __webpack_require__(12);
var Sprite = __webpack_require__(25);
var Vector2 = __webpack_require__(3);
var Vector4 = __webpack_require__(5);

/**
 * @classdesc
 * A Sprite 3D Game Object.
 *
 * The Sprite 3D object is an encapsulation of a standard Sprite object, with additional methods to allow
 * it to be rendered by a 3D Camera. The Sprite can be positioned anywhere within 3D space.
 *
 * @class Sprite3D
 * @extends Phaser.GameObjects.GameObject
 * @memberOf Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} x - The x position of this Game Object.
 * @param {number} y - The y position of this Game Object.
 * @param {number} z - The z position of this Game Object.
 * @param {string} texture - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {(string|integer)} [frame] - An optional frame from the Texture this Game Object is rendering with.
 */
var Sprite3D = new Class({

    Extends: GameObject,

    initialize:

    function Sprite3D (scene, x, y, z, texture, frame)
    {
        GameObject.call(this, scene, 'Sprite3D');

        /**
         * The encapsulated Sprite.
         *
         * @name Phaser.GameObjects.Sprite3D#gameObject
         * @type {Phaser.GameObjects.GameObject}
         * @since 3.0.0
         */
        this.gameObject = new Sprite(scene, 0, 0, texture, frame);

        /**
         * The position of the Sprite.
         *
         * @name Phaser.GameObjects.Sprite3D#position
         * @type {Phaser.Math.Vector4}
         * @since 3.0.0
         */
        this.position = new Vector4(x, y, z);

        /**
         * The 2D size of the Sprite.
         *
         * @name Phaser.GameObjects.Sprite3D#size
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.size = new Vector2(this.gameObject.width, this.gameObject.height);

        /**
         * The 2D scale of the Sprite.
         *
         * @name Phaser.GameObjects.Sprite3D#scale
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.scale = new Vector2(1, 1);

        /**
         * Whether to automatically set the horizontal scale of the encapsulated Sprite.
         *
         * @name Phaser.GameObjects.Sprite3D#adjustScaleX
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.adjustScaleX = true;

        /**
         * Whether to automatically set the vertical scale of the encapsulated Sprite.
         *
         * @name Phaser.GameObjects.Sprite3D#adjustScaleY
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.adjustScaleY = true;

        /**
         * The visible state of the Game Object.
         *
         * @name Phaser.GameObjects.Sprite3D#_visible
         * @type {boolean}
         * @default true
         * @private
         * @since 3.0.0
         */
        this._visible = true;
    },

    /**
     * Project this Sprite onto the given 3D Camera.
     *
     * @method Phaser.GameObjects.Sprite3D#project
     * @since 3.0.0
     *
     * @param {Phaser.Cameras.Sprite3D.Camera} camera - The 3D Camera onto which to project this Sprite.
     */
    project: function (camera)
    {
        var pos = this.position;

        var gameObject = this.gameObject;

        camera.project(pos, gameObject);

        camera.getPointSize(pos, this.size, this.scale);

        if (this.scale.x <= 0 || this.scale.y <= 0)
        {
            gameObject.setVisible(false);
        }
        else
        {
            if (!gameObject.visible)
            {
                gameObject.setVisible(true);
            }

            if (this.adjustScaleX)
            {
                gameObject.scaleX = this.scale.x;
            }

            if (this.adjustScaleY)
            {
                gameObject.scaleY = this.scale.y;
            }

            gameObject.setDepth(gameObject.z * -1);
        }
    },

    /**
     * Set the visible state of the Game Object.
     *
     * @method Phaser.GameObjects.Sprite3D#setVisible
     * @since 3.0.0
     *
     * @param {boolean} value - The visible state of the Game Object.
     *
     * @return {Phaser.GameObjects.Sprite3D} This Sprite3D Object.
     */
    setVisible: function (value)
    {
        this.visible = value;

        return this;
    },

    /**
     * The visible state of the Game Object.
     *
     * An invisible Game Object will skip rendering, but will still process update logic.
     *
     * @name Phaser.GameObjects.Sprite3D#visible
     * @type {boolean}
     * @since 3.0.0
     */
    visible: {

        get: function ()
        {
            return this._visible;
        },

        set: function (value)
        {
            this._visible = value;
            this.gameObject.visible = value;
        }

    },

    /**
     * The x position of this Game Object.
     *
     * @name Phaser.GameObjects.Sprite3D#x
     * @type {number}
     * @since 3.0.0
     */
    x: {

        get: function ()
        {
            return this.position.x;
        },

        set: function (value)
        {
            this.position.x = value;
        }

    },

    /**
     * The y position of this Game Object.
     *
     * @name Phaser.GameObjects.Sprite3D#y
     * @type {number}
     * @since 3.0.0
     */
    y: {

        get: function ()
        {
            return this.position.y;
        },

        set: function (value)
        {
            this.position.y = value;
        }

    },

    /**
     * The z position of this Game Object.
     *
     * @name Phaser.GameObjects.Sprite3D#z
     * @type {number}
     * @since 3.0.0
     */
    z: {

        get: function ()
        {
            return this.position.z;
        },

        set: function (value)
        {
            this.position.z = value;
        }

    }

});

module.exports = Sprite3D;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

//  Adapted from [gl-matrix](https://github.com/toji/gl-matrix) by toji
//  and [vecmath](https://github.com/mattdesl/vecmath) by mattdesl

var Class = __webpack_require__(0);

var EPSILON = 0.000001;

/**
 * @classdesc
 * A four-dimensional matrix.
 *
 * @class Matrix4
 * @memberOf Phaser.Math
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Math.Matrix4} [m] - Optional Matrix4 to copy values from.
 */
var Matrix4 = new Class({

    initialize:

    function Matrix4 (m)
    {
        /**
         * The matrix values.
         *
         * @name Phaser.Math.Matrix4#val
         * @type {Float32Array}
         * @since 3.0.0
         */
        this.val = new Float32Array(16);

        if (m)
        {
            //  Assume Matrix4 with val:
            this.copy(m);
        }
        else
        {
            //  Default to identity
            this.identity();
        }
    },

    /**
     * Make a clone of this Matrix4.
     *
     * @method Phaser.Math.Matrix4#clone
     * @since 3.0.0
     *
     * @return {Phaser.Math.Matrix4} A clone of this Matrix4.
     */
    clone: function ()
    {
        return new Matrix4(this);
    },

    //  TODO - Should work with basic values

    /**
     * This method is an alias for `Matrix4.copy`.
     *
     * @method Phaser.Math.Matrix4#set
     * @since 3.0.0
     *
     * @param {Phaser.Math.Matrix4} src - The Matrix to set the values of this Matrix's from.
     *
     * @return {Phaser.Math.Matrix4} This Matrix4.
     */
    set: function (src)
    {
        return this.copy(src);
    },

    /**
     * Copy the values of a given Matrix into this Matrix.
     *
     * @method Phaser.Math.Matrix4#copy
     * @since 3.0.0
     *
     * @param {Phaser.Math.Matrix4} src - The Matrix to copy the values from.
     *
     * @return {Phaser.Math.Matrix4} This Matrix4.
     */
    copy: function (src)
    {
        var out = this.val;
        var a = src.val;

        out[0] = a[0];
        out[1] = a[1];
        out[2] = a[2];
        out[3] = a[3];
        out[4] = a[4];
        out[5] = a[5];
        out[6] = a[6];
        out[7] = a[7];
        out[8] = a[8];
        out[9] = a[9];
        out[10] = a[10];
        out[11] = a[11];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];

        return this;
    },

    /**
     * Set the values of this Matrix from the given array.
     *
     * @method Phaser.Math.Matrix4#fromArray
     * @since 3.0.0
     *
     * @param {array} a - The array to copy the values from.
     *
     * @return {Phaser.Math.Matrix4} This Matrix4.
     */
    fromArray: function (a)
    {
        var out = this.val;

        out[0] = a[0];
        out[1] = a[1];
        out[2] = a[2];
        out[3] = a[3];
        out[4] = a[4];
        out[5] = a[5];
        out[6] = a[6];
        out[7] = a[7];
        out[8] = a[8];
        out[9] = a[9];
        out[10] = a[10];
        out[11] = a[11];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];

        return this;
    },

    /**
     * Reset this Matrix.
     *
     * Sets all values to `0`.
     *
     * @method Phaser.Math.Matrix4#zero
     * @since 3.0.0
     *
     * @return {Phaser.Math.Matrix4} This Matrix4.
     */
    zero: function ()
    {
        var out = this.val;

        out[0] = 0;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = 0;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[10] = 0;
        out[11] = 0;
        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
        out[15] = 0;

        return this;
    },

    /**
     * Set the `x`, `y` and `z` values of this Matrix.
     *
     * @method Phaser.Math.Matrix4#xyz
     * @since 3.0.0
     *
     * @param {number} x - The x value.
     * @param {number} y - The y value.
     * @param {number} z - The z value.
     *
     * @return {Phaser.Math.Matrix4} This Matrix4.
     */
    xyz: function (x, y, z)
    {
        this.identity();

        var out = this.val;

        out[12] = x;
        out[13] = y;
        out[14] = z;

        return this;
    },

    /**
     * Set the scaling values of this Matrix.
     *
     * @method Phaser.Math.Matrix4#scaling
     * @since 3.0.0
     *
     * @param {number} x - The x scaling value.
     * @param {number} y - The y scaling value.
     * @param {number} z - The z scaling value.
     *
     * @return {Phaser.Math.Matrix4} This Matrix4.
     */
    scaling: function (x, y, z)
    {
        this.zero();

        var out = this.val;

        out[0] = x;
        out[5] = y;
        out[10] = z;
        out[15] = 1;

        return this;
    },

    /**
     * Reset this Matrix to an identity (default) matrix.
     *
     * @method Phaser.Math.Matrix4#identity
     * @since 3.0.0
     *
     * @return {Phaser.Math.Matrix4} This Matrix4.
     */
    identity: function ()
    {
        var out = this.val;

        out[0] = 1;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = 1;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[10] = 1;
        out[11] = 0;
        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
        out[15] = 1;

        return this;
    },

    /**
     * Transpose this Matrix.
     *
     * @method Phaser.Math.Matrix4#transpose
     * @since 3.0.0
     *
     * @return {Phaser.Math.Matrix4} This Matrix4.
     */
    transpose: function ()
    {
        var a = this.val;

        var a01 = a[1];
        var a02 = a[2];
        var a03 = a[3];
        var a12 = a[6];
        var a13 = a[7];
        var a23 = a[11];

        a[1] = a[4];
        a[2] = a[8];
        a[3] = a[12];
        a[4] = a01;
        a[6] = a[9];
        a[7] = a[13];
        a[8] = a02;
        a[9] = a12;
        a[11] = a[14];
        a[12] = a03;
        a[13] = a13;
        a[14] = a23;

        return this;
    },

    /**
     * Invert this Matrix.
     *
     * @method Phaser.Math.Matrix4#invert
     * @since 3.0.0
     *
     * @return {Phaser.Math.Matrix4} This Matrix4.
     */
    invert: function ()
    {
        var a = this.val;

        var a00 = a[0];
        var a01 = a[1];
        var a02 = a[2];
        var a03 = a[3];

        var a10 = a[4];
        var a11 = a[5];
        var a12 = a[6];
        var a13 = a[7];

        var a20 = a[8];
        var a21 = a[9];
        var a22 = a[10];
        var a23 = a[11];

        var a30 = a[12];
        var a31 = a[13];
        var a32 = a[14];
        var a33 = a[15];

        var b00 = a00 * a11 - a01 * a10;
        var b01 = a00 * a12 - a02 * a10;
        var b02 = a00 * a13 - a03 * a10;
        var b03 = a01 * a12 - a02 * a11;

        var b04 = a01 * a13 - a03 * a11;
        var b05 = a02 * a13 - a03 * a12;
        var b06 = a20 * a31 - a21 * a30;
        var b07 = a20 * a32 - a22 * a30;

        var b08 = a20 * a33 - a23 * a30;
        var b09 = a21 * a32 - a22 * a31;
        var b10 = a21 * a33 - a23 * a31;
        var b11 = a22 * a33 - a23 * a32;

        // Calculate the determinant
        var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

        if (!det)
        {
            return null;
        }

        det = 1 / det;

        a[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        a[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        a[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        a[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
        a[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        a[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        a[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        a[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
        a[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        a[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        a[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        a[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
        a[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
        a[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
        a[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
        a[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

        return this;
    },

    /**
     * Calculate the adjoint, or adjugate, of this Matrix.
     *
     * @method Phaser.Math.Matrix4#adjoint
     * @since 3.0.0
     *
     * @return {Phaser.Math.Matrix4} This Matrix4.
     */
    adjoint: function ()
    {
        var a = this.val;

        var a00 = a[0];
        var a01 = a[1];
        var a02 = a[2];
        var a03 = a[3];

        var a10 = a[4];
        var a11 = a[5];
        var a12 = a[6];
        var a13 = a[7];

        var a20 = a[8];
        var a21 = a[9];
        var a22 = a[10];
        var a23 = a[11];

        var a30 = a[12];
        var a31 = a[13];
        var a32 = a[14];
        var a33 = a[15];

        a[0] = (a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22));
        a[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
        a[2] = (a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12));
        a[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
        a[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
        a[5] = (a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22));
        a[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
        a[7] = (a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12));
        a[8] = (a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21));
        a[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
        a[10] = (a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11));
        a[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
        a[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
        a[13] = (a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21));
        a[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
        a[15] = (a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11));

        return this;
    },

    /**
     * Calculate the determinant of this Matrix.
     *
     * @method Phaser.Math.Matrix4#determinant
     * @since 3.0.0
     *
     * @return {number} The determinant of this Matrix.
     */
    determinant: function ()
    {
        var a = this.val;

        var a00 = a[0];
        var a01 = a[1];
        var a02 = a[2];
        var a03 = a[3];

        var a10 = a[4];
        var a11 = a[5];
        var a12 = a[6];
        var a13 = a[7];

        var a20 = a[8];
        var a21 = a[9];
        var a22 = a[10];
        var a23 = a[11];

        var a30 = a[12];
        var a31 = a[13];
        var a32 = a[14];
        var a33 = a[15];

        var b00 = a00 * a11 - a01 * a10;
        var b01 = a00 * a12 - a02 * a10;
        var b02 = a00 * a13 - a03 * a10;
        var b03 = a01 * a12 - a02 * a11;
        var b04 = a01 * a13 - a03 * a11;
        var b05 = a02 * a13 - a03 * a12;
        var b06 = a20 * a31 - a21 * a30;
        var b07 = a20 * a32 - a22 * a30;
        var b08 = a20 * a33 - a23 * a30;
        var b09 = a21 * a32 - a22 * a31;
        var b10 = a21 * a33 - a23 * a31;
        var b11 = a22 * a33 - a23 * a32;

        // Calculate the determinant
        return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    },

    /**
     * Multiply this Matrix by the given Matrix.
     *
     * @method Phaser.Math.Matrix4#multiply
     * @since 3.0.0
     *
     * @param {Phaser.Math.Matrix4} src - The Matrix to multiply this Matrix by.
     *
     * @return {Phaser.Math.Matrix4} This Matrix4.
     */
    multiply: function (src)
    {
        var a = this.val;

        var a00 = a[0];
        var a01 = a[1];
        var a02 = a[2];
        var a03 = a[3];

        var a10 = a[4];
        var a11 = a[5];
        var a12 = a[6];
        var a13 = a[7];

        var a20 = a[8];
        var a21 = a[9];
        var a22 = a[10];
        var a23 = a[11];

        var a30 = a[12];
        var a31 = a[13];
        var a32 = a[14];
        var a33 = a[15];

        var b = src.val;

        // Cache only the current line of the second matrix
        var b0 = b[0];
        var b1 = b[1];
        var b2 = b[2];
        var b3 = b[3];

        a[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        a[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        a[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        a[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        b0 = b[4];
        b1 = b[5];
        b2 = b[6];
        b3 = b[7];

        a[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        a[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        a[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        a[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        b0 = b[8];
        b1 = b[9];
        b2 = b[10];
        b3 = b[11];

        a[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        a[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        a[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        a[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        b0 = b[12];
        b1 = b[13];
        b2 = b[14];
        b3 = b[15];

        a[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        a[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        a[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        a[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Matrix4#multiplyLocal
     * @since 3.0.0
     *
     * @param {Phaser.Math.Matrix4} src - [description]
     *
     * @return {Phaser.Math.Matrix4} This Matrix4.
     */
    multiplyLocal: function (src)
    {
        var a = [];
        var m1 = this.val;
        var m2 = src.val;

        a[0] = m1[0] * m2[0] + m1[1] * m2[4] + m1[2] * m2[8] + m1[3] * m2[12];
        a[1] = m1[0] * m2[1] + m1[1] * m2[5] + m1[2] * m2[9] + m1[3] * m2[13];
        a[2] = m1[0] * m2[2] + m1[1] * m2[6] + m1[2] * m2[10] + m1[3] * m2[14];
        a[3] = m1[0] * m2[3] + m1[1] * m2[7] + m1[2] * m2[11] + m1[3] * m2[15];

        a[4] = m1[4] * m2[0] + m1[5] * m2[4] + m1[6] * m2[8] + m1[7] * m2[12];
        a[5] = m1[4] * m2[1] + m1[5] * m2[5] + m1[6] * m2[9] + m1[7] * m2[13];
        a[6] = m1[4] * m2[2] + m1[5] * m2[6] + m1[6] * m2[10] + m1[7] * m2[14];
        a[7] = m1[4] * m2[3] + m1[5] * m2[7] + m1[6] * m2[11] + m1[7] * m2[15];

        a[8] = m1[8] * m2[0] + m1[9] * m2[4] + m1[10] * m2[8] + m1[11] * m2[12];
        a[9] = m1[8] * m2[1] + m1[9] * m2[5] + m1[10] * m2[9] + m1[11] * m2[13];
        a[10] = m1[8] * m2[2] + m1[9] * m2[6] + m1[10] * m2[10] + m1[11] * m2[14];
        a[11] = m1[8] * m2[3] + m1[9] * m2[7] + m1[10] * m2[11] + m1[11] * m2[15];

        a[12] = m1[12] * m2[0] + m1[13] * m2[4] + m1[14] * m2[8] + m1[15] * m2[12];
        a[13] = m1[12] * m2[1] + m1[13] * m2[5] + m1[14] * m2[9] + m1[15] * m2[13];
        a[14] = m1[12] * m2[2] + m1[13] * m2[6] + m1[14] * m2[10] + m1[15] * m2[14];
        a[15] = m1[12] * m2[3] + m1[13] * m2[7] + m1[14] * m2[11] + m1[15] * m2[15];

        return this.fromArray(a);
    },

    /**
     * Translate this Matrix using the given Vector.
     *
     * @method Phaser.Math.Matrix4#translate
     * @since 3.0.0
     *
     * @param {(Phaser.Math.Vector3|Phaser.Math.Vector4)} v - The Vector to translate this Matrix with.
     *
     * @return {Phaser.Math.Matrix4} This Matrix4.
     */
    translate: function (v)
    {
        var x = v.x;
        var y = v.y;
        var z = v.z;
        var a = this.val;

        a[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
        a[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
        a[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
        a[15] = a[3] * x + a[7] * y + a[11] * z + a[15];

        return this;
    },

    /**
     * Apply a scale transformation to this Matrix.
     *
     * Uses the `x`, `y` and `z` components of the given Vector to scale the Matrix.
     *
     * @method Phaser.Math.Matrix4#scale
     * @since 3.0.0
     *
     * @param {(Phaser.Math.Vector3|Phaser.Math.Vector4)} v - The Vector to scale this Matrix with.
     *
     * @return {Phaser.Math.Matrix4} This Matrix4.
     */
    scale: function (v)
    {
        var x = v.x;
        var y = v.y;
        var z = v.z;
        var a = this.val;

        a[0] = a[0] * x;
        a[1] = a[1] * x;
        a[2] = a[2] * x;
        a[3] = a[3] * x;

        a[4] = a[4] * y;
        a[5] = a[5] * y;
        a[6] = a[6] * y;
        a[7] = a[7] * y;

        a[8] = a[8] * z;
        a[9] = a[9] * z;
        a[10] = a[10] * z;
        a[11] = a[11] * z;

        return this;
    },

    /**
     * Derive a rotation matrix around the given axis.
     *
     * @method Phaser.Math.Matrix4#makeRotationAxis
     * @since 3.0.0
     *
     * @param {(Phaser.Math.Vector3|Phaser.Math.Vector4)} axis - The rotation axis.
     * @param {number} angle - The rotation angle in radians.
     *
     * @return {Phaser.Math.Matrix4} This Matrix4.
     */
    makeRotationAxis: function (axis, angle)
    {
        // Based on http://www.gamedev.net/reference/articles/article1199.asp

        var c = Math.cos(angle);
        var s = Math.sin(angle);
        var t = 1 - c;
        var x = axis.x;
        var y = axis.y;
        var z = axis.z;
        var tx = t * x;
        var ty = t * y;

        this.fromArray([
            tx * x + c, tx * y - s * z, tx * z + s * y, 0,
            tx * y + s * z, ty * y + c, ty * z - s * x, 0,
            tx * z - s * y, ty * z + s * x, t * z * z + c, 0,
            0, 0, 0, 1
        ]);

        return this;
    },

    /**
     * Apply a rotation transformation to this Matrix.
     *
     * @method Phaser.Math.Matrix4#rotate
     * @since 3.0.0
     *
     * @param {number} rad - The angle in radians to rotate by.
     * @param {Phaser.Math.Vector3} axis - The axis to rotate upon.
     *
     * @return {Phaser.Math.Matrix4} This Matrix4.
     */
    rotate: function (rad, axis)
    {
        var a = this.val;
        var x = axis.x;
        var y = axis.y;
        var z = axis.z;
        var len = Math.sqrt(x * x + y * y + z * z);

        if (Math.abs(len) < EPSILON)
        {
            return null;
        }

        len = 1 / len;
        x *= len;
        y *= len;
        z *= len;

        var s = Math.sin(rad);
        var c = Math.cos(rad);
        var t = 1 - c;

        var a00 = a[0];
        var a01 = a[1];
        var a02 = a[2];
        var a03 = a[3];

        var a10 = a[4];
        var a11 = a[5];
        var a12 = a[6];
        var a13 = a[7];

        var a20 = a[8];
        var a21 = a[9];
        var a22 = a[10];
        var a23 = a[11];

        // Construct the elements of the rotation matrix
        var b00 = x * x * t + c;
        var b01 = y * x * t + z * s;
        var b02 = z * x * t - y * s;

        var b10 = x * y * t - z * s;
        var b11 = y * y * t + c;
        var b12 = z * y * t + x * s;

        var b20 = x * z * t + y * s;
        var b21 = y * z * t - x * s;
        var b22 = z * z * t + c;

        // Perform rotation-specific matrix multiplication
        a[0] = a00 * b00 + a10 * b01 + a20 * b02;
        a[1] = a01 * b00 + a11 * b01 + a21 * b02;
        a[2] = a02 * b00 + a12 * b01 + a22 * b02;
        a[3] = a03 * b00 + a13 * b01 + a23 * b02;
        a[4] = a00 * b10 + a10 * b11 + a20 * b12;
        a[5] = a01 * b10 + a11 * b11 + a21 * b12;
        a[6] = a02 * b10 + a12 * b11 + a22 * b12;
        a[7] = a03 * b10 + a13 * b11 + a23 * b12;
        a[8] = a00 * b20 + a10 * b21 + a20 * b22;
        a[9] = a01 * b20 + a11 * b21 + a21 * b22;
        a[10] = a02 * b20 + a12 * b21 + a22 * b22;
        a[11] = a03 * b20 + a13 * b21 + a23 * b22;

        return this;
    },

    /**
     * Rotate this matrix on its X axis.
     *
     * @method Phaser.Math.Matrix4#rotateX
     * @since 3.0.0
     *
     * @param {number} rad - The angle in radians to rotate by.
     *
     * @return {Phaser.Math.Matrix4} This Matrix4.
     */
    rotateX: function (rad)
    {
        var a = this.val;
        var s = Math.sin(rad);
        var c = Math.cos(rad);

        var a10 = a[4];
        var a11 = a[5];
        var a12 = a[6];
        var a13 = a[7];

        var a20 = a[8];
        var a21 = a[9];
        var a22 = a[10];
        var a23 = a[11];

        // Perform axis-specific matrix multiplication
        a[4] = a10 * c + a20 * s;
        a[5] = a11 * c + a21 * s;
        a[6] = a12 * c + a22 * s;
        a[7] = a13 * c + a23 * s;
        a[8] = a20 * c - a10 * s;
        a[9] = a21 * c - a11 * s;
        a[10] = a22 * c - a12 * s;
        a[11] = a23 * c - a13 * s;

        return this;
    },

    /**
     * Rotate this matrix on its Y axis.
     *
     * @method Phaser.Math.Matrix4#rotateY
     * @since 3.0.0
     *
     * @param {number} rad - The angle to rotate by, in radians.
     *
     * @return {Phaser.Math.Matrix4} This Matrix4.
     */
    rotateY: function (rad)
    {
        var a = this.val;
        var s = Math.sin(rad);
        var c = Math.cos(rad);

        var a00 = a[0];
        var a01 = a[1];
        var a02 = a[2];
        var a03 = a[3];

        var a20 = a[8];
        var a21 = a[9];
        var a22 = a[10];
        var a23 = a[11];

        // Perform axis-specific matrix multiplication
        a[0] = a00 * c - a20 * s;
        a[1] = a01 * c - a21 * s;
        a[2] = a02 * c - a22 * s;
        a[3] = a03 * c - a23 * s;
        a[8] = a00 * s + a20 * c;
        a[9] = a01 * s + a21 * c;
        a[10] = a02 * s + a22 * c;
        a[11] = a03 * s + a23 * c;

        return this;
    },

    /**
     * Rotate this matrix on its Z axis.
     *
     * @method Phaser.Math.Matrix4#rotateZ
     * @since 3.0.0
     *
     * @param {number} rad - The angle to rotate by, in radians.
     *
     * @return {Phaser.Math.Matrix4} This Matrix4.
     */
    rotateZ: function (rad)
    {
        var a = this.val;
        var s = Math.sin(rad);
        var c = Math.cos(rad);

        var a00 = a[0];
        var a01 = a[1];
        var a02 = a[2];
        var a03 = a[3];

        var a10 = a[4];
        var a11 = a[5];
        var a12 = a[6];
        var a13 = a[7];

        // Perform axis-specific matrix multiplication
        a[0] = a00 * c + a10 * s;
        a[1] = a01 * c + a11 * s;
        a[2] = a02 * c + a12 * s;
        a[3] = a03 * c + a13 * s;
        a[4] = a10 * c - a00 * s;
        a[5] = a11 * c - a01 * s;
        a[6] = a12 * c - a02 * s;
        a[7] = a13 * c - a03 * s;

        return this;
    },

    /**
     * Set the values of this Matrix from the given rotation Quaternion and translation Vector.
     *
     * @method Phaser.Math.Matrix4#fromRotationTranslation
     * @since 3.0.0
     *
     * @param {Phaser.Math.Quaternion} q - The Quaternion to set rotation from.
     * @param {Phaser.Math.Vector3} v - The Vector to set translation from.
     *
     * @return {Phaser.Math.Matrix4} This Matrix4.
     */
    fromRotationTranslation: function (q, v)
    {
        // Quaternion math
        var out = this.val;

        var x = q.x;
        var y = q.y;
        var z = q.z;
        var w = q.w;

        var x2 = x + x;
        var y2 = y + y;
        var z2 = z + z;

        var xx = x * x2;
        var xy = x * y2;
        var xz = x * z2;

        var yy = y * y2;
        var yz = y * z2;
        var zz = z * z2;

        var wx = w * x2;
        var wy = w * y2;
        var wz = w * z2;

        out[0] = 1 - (yy + zz);
        out[1] = xy + wz;
        out[2] = xz - wy;
        out[3] = 0;

        out[4] = xy - wz;
        out[5] = 1 - (xx + zz);
        out[6] = yz + wx;
        out[7] = 0;

        out[8] = xz + wy;
        out[9] = yz - wx;
        out[10] = 1 - (xx + yy);
        out[11] = 0;

        out[12] = v.x;
        out[13] = v.y;
        out[14] = v.z;
        out[15] = 1;

        return this;
    },

    /**
     * Set the values of this Matrix from the given Quaternion.
     *
     * @method Phaser.Math.Matrix4#fromQuat
     * @since 3.0.0
     *
     * @param {Phaser.Math.Quaternion} q - The Quaternion to set the values of this Matrix from.
     *
     * @return {Phaser.Math.Matrix4} This Matrix4.
     */
    fromQuat: function (q)
    {
        var out = this.val;

        var x = q.x;
        var y = q.y;
        var z = q.z;
        var w = q.w;

        var x2 = x + x;
        var y2 = y + y;
        var z2 = z + z;

        var xx = x * x2;
        var xy = x * y2;
        var xz = x * z2;

        var yy = y * y2;
        var yz = y * z2;
        var zz = z * z2;

        var wx = w * x2;
        var wy = w * y2;
        var wz = w * z2;

        out[0] = 1 - (yy + zz);
        out[1] = xy + wz;
        out[2] = xz - wy;
        out[3] = 0;

        out[4] = xy - wz;
        out[5] = 1 - (xx + zz);
        out[6] = yz + wx;
        out[7] = 0;

        out[8] = xz + wy;
        out[9] = yz - wx;
        out[10] = 1 - (xx + yy);
        out[11] = 0;

        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
        out[15] = 1;

        return this;
    },

    /**
     * Generate a frustum matrix with the given bounds.
     *
     * @method Phaser.Math.Matrix4#frustum
     * @since 3.0.0
     *
     * @param {number} left - The left bound of the frustum.
     * @param {number} right - The right bound of the frustum.
     * @param {number} bottom - The bottom bound of the frustum.
     * @param {number} top - The top bound of the frustum.
     * @param {number} near - The near bound of the frustum.
     * @param {number} far - The far bound of the frustum.
     *
     * @return {Phaser.Math.Matrix4} This Matrix4.
     */
    frustum: function (left, right, bottom, top, near, far)
    {
        var out = this.val;

        var rl = 1 / (right - left);
        var tb = 1 / (top - bottom);
        var nf = 1 / (near - far);

        out[0] = (near * 2) * rl;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;

        out[4] = 0;
        out[5] = (near * 2) * tb;
        out[6] = 0;
        out[7] = 0;

        out[8] = (right + left) * rl;
        out[9] = (top + bottom) * tb;
        out[10] = (far + near) * nf;
        out[11] = -1;

        out[12] = 0;
        out[13] = 0;
        out[14] = (far * near * 2) * nf;
        out[15] = 0;

        return this;
    },

    /**
     * Generate a perspective projection matrix with the given bounds.
     *
     * @method Phaser.Math.Matrix4#perspective
     * @since 3.0.0
     *
     * @param {number} fovy - Vertical field of view in radians
     * @param {number} aspect - Aspect ratio. Typically viewport width  /height.
     * @param {number} near - Near bound of the frustum.
     * @param {number} far - Far bound of the frustum.
     *
     * @return {Phaser.Math.Matrix4} This Matrix4.
     */
    perspective: function (fovy, aspect, near, far)
    {
        var out = this.val;
        var f = 1.0 / Math.tan(fovy / 2);
        var nf = 1 / (near - far);

        out[0] = f / aspect;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;

        out[4] = 0;
        out[5] = f;
        out[6] = 0;
        out[7] = 0;

        out[8] = 0;
        out[9] = 0;
        out[10] = (far + near) * nf;
        out[11] = -1;

        out[12] = 0;
        out[13] = 0;
        out[14] = (2 * far * near) * nf;
        out[15] = 0;

        return this;
    },

    /**
     * Generate a perspective projection matrix with the given bounds.
     *
     * @method Phaser.Math.Matrix4#perspectiveLH
     * @since 3.0.0
     *
     * @param {number} width - The width of the frustum.
     * @param {number} height - The height of the frustum.
     * @param {number} near - Near bound of the frustum.
     * @param {number} far - Far bound of the frustum.
     *
     * @return {Phaser.Math.Matrix4} This Matrix4.
     */
    perspectiveLH: function (width, height, near, far)
    {
        var out = this.val;

        out[0] = (2 * near) / width;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;

        out[4] = 0;
        out[5] = (2 * near) / height;
        out[6] = 0;
        out[7] = 0;

        out[8] = 0;
        out[9] = 0;
        out[10] = -far / (near - far);
        out[11] = 1;

        out[12] = 0;
        out[13] = 0;
        out[14] = (near * far) / (near - far);
        out[15] = 0;

        return this;
    },

    /**
     * Generate an orthogonal projection matrix with the given bounds.
     *
     * @method Phaser.Math.Matrix4#ortho
     * @since 3.0.0
     *
     * @param {number} left - The left bound of the frustum.
     * @param {number} right - The right bound of the frustum.
     * @param {number} bottom - The bottom bound of the frustum.
     * @param {number} top - The top bound of the frustum.
     * @param {number} near - The near bound of the frustum.
     * @param {number} far - The far bound of the frustum.
     *
     * @return {Phaser.Math.Matrix4} This Matrix4.
     */
    ortho: function (left, right, bottom, top, near, far)
    {
        var out = this.val;
        var lr = left - right;
        var bt = bottom - top;
        var nf = near - far;

        //  Avoid division by zero
        lr = (lr === 0) ? lr : 1 / lr;
        bt = (bt === 0) ? bt : 1 / bt;
        nf = (nf === 0) ? nf : 1 / nf;

        out[0] = -2 * lr;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;

        out[4] = 0;
        out[5] = -2 * bt;
        out[6] = 0;
        out[7] = 0;

        out[8] = 0;
        out[9] = 0;
        out[10] = 2 * nf;
        out[11] = 0;

        out[12] = (left + right) * lr;
        out[13] = (top + bottom) * bt;
        out[14] = (far + near) * nf;
        out[15] = 1;

        return this;
    },

    /**
     * Generate a look-at matrix with the given eye position, focal point, and up axis.
     *
     * @method Phaser.Math.Matrix4#lookAt
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector3} eye - Position of the viewer
     * @param {Phaser.Math.Vector3} center - Point the viewer is looking at
     * @param {Phaser.Math.Vector3} up - vec3 pointing up.
     *
     * @return {Phaser.Math.Matrix4} This Matrix4.
     */
    lookAt: function (eye, center, up)
    {
        var out = this.val;

        var eyex = eye.x;
        var eyey = eye.y;
        var eyez = eye.z;

        var upx = up.x;
        var upy = up.y;
        var upz = up.z;

        var centerx = center.x;
        var centery = center.y;
        var centerz = center.z;

        if (Math.abs(eyex - centerx) < EPSILON &&
            Math.abs(eyey - centery) < EPSILON &&
            Math.abs(eyez - centerz) < EPSILON)
        {
            return this.identity();
        }

        var z0 = eyex - centerx;
        var z1 = eyey - centery;
        var z2 = eyez - centerz;

        var len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);

        z0 *= len;
        z1 *= len;
        z2 *= len;

        var x0 = upy * z2 - upz * z1;
        var x1 = upz * z0 - upx * z2;
        var x2 = upx * z1 - upy * z0;

        len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);

        if (!len)
        {
            x0 = 0;
            x1 = 0;
            x2 = 0;
        }
        else
        {
            len = 1 / len;
            x0 *= len;
            x1 *= len;
            x2 *= len;
        }

        var y0 = z1 * x2 - z2 * x1;
        var y1 = z2 * x0 - z0 * x2;
        var y2 = z0 * x1 - z1 * x0;

        len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);

        if (!len)
        {
            y0 = 0;
            y1 = 0;
            y2 = 0;
        }
        else
        {
            len = 1 / len;
            y0 *= len;
            y1 *= len;
            y2 *= len;
        }

        out[0] = x0;
        out[1] = y0;
        out[2] = z0;
        out[3] = 0;

        out[4] = x1;
        out[5] = y1;
        out[6] = z1;
        out[7] = 0;

        out[8] = x2;
        out[9] = y2;
        out[10] = z2;
        out[11] = 0;

        out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
        out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
        out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
        out[15] = 1;

        return this;
    },

    /**
     * Set the values of this matrix from the given `yaw`, `pitch` and `roll` values.
     *
     * @method Phaser.Math.Matrix4#yawPitchRoll
     * @since 3.0.0
     *
     * @param {number} yaw - [description]
     * @param {number} pitch - [description]
     * @param {number} roll - [description]
     *
     * @return {Phaser.Math.Matrix4} This Matrix4.
     */
    yawPitchRoll: function (yaw, pitch, roll)
    {
        this.zero();
        _tempMat1.zero();
        _tempMat2.zero();

        var m0 = this.val;
        var m1 = _tempMat1.val;
        var m2 = _tempMat2.val;

        //  Rotate Z
        var s = Math.sin(roll);
        var c = Math.cos(roll);

        m0[10] = 1;
        m0[15] = 1;
        m0[0] = c;
        m0[1] = s;
        m0[4] = -s;
        m0[5] = c;

        //  Rotate X
        s = Math.sin(pitch);
        c = Math.cos(pitch);

        m1[0] = 1;
        m1[15] = 1;
        m1[5] = c;
        m1[10] = c;
        m1[9] = -s;
        m1[6] = s;

        //  Rotate Y
        s = Math.sin(yaw);
        c = Math.cos(yaw);

        m2[5] = 1;
        m2[15] = 1;
        m2[0] = c;
        m2[2] = -s;
        m2[8] = s;
        m2[10] = c;

        this.multiplyLocal(_tempMat1);
        this.multiplyLocal(_tempMat2);

        return this;
    },

    /**
     * Generate a world matrix from the given rotation, position, scale, view matrix and projection matrix.
     *
     * @method Phaser.Math.Matrix4#setWorldMatrix
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector3} rotation - The rotation of the world matrix.
     * @param {Phaser.Math.Vector3} position - The position of the world matrix.
     * @param {Phaser.Math.Vector3} scale - The scale of the world matrix.
     * @param {Phaser.Math.Matrix4} [viewMatrix] - The view matrix.
     * @param {Phaser.Math.Matrix4} [projectionMatrix] - The projection matrix.
     *
     * @return {Phaser.Math.Matrix4} This Matrix4.
     */
    setWorldMatrix: function (rotation, position, scale, viewMatrix, projectionMatrix)
    {
        this.yawPitchRoll(rotation.y, rotation.x, rotation.z);

        _tempMat1.scaling(scale.x, scale.y, scale.z);
        _tempMat2.xyz(position.x, position.y, position.z);

        this.multiplyLocal(_tempMat1);
        this.multiplyLocal(_tempMat2);

        if (viewMatrix !== undefined)
        {
            this.multiplyLocal(viewMatrix);
        }

        if (projectionMatrix !== undefined)
        {
            this.multiplyLocal(projectionMatrix);
        }

        return this;
    }

});

var _tempMat1 = new Matrix4();
var _tempMat2 = new Matrix4();

module.exports = Matrix4;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = __webpack_require__(0);
var Matrix4 = __webpack_require__(14);
var RandomXYZ = __webpack_require__(68);
var RandomXYZW = __webpack_require__(67);
var RotateVec3 = __webpack_require__(66);
var Set = __webpack_require__(63);
var Sprite3D = __webpack_require__(13);
var Vector2 = __webpack_require__(3);
var Vector3 = __webpack_require__(2);
var Vector4 = __webpack_require__(5);

//  Local cache vars
var tmpVec3 = new Vector3();
var tmpVec4 = new Vector4();
var dirvec = new Vector3();
var rightvec = new Vector3();
var billboardMatrix = new Matrix4();

//  @author attribute https://github.com/mattdesl/cam3d/wiki

/**
 * @typedef {object} RayDef
 *
 * @property {Phaser.Math.Vector3} origin - [description]
 * @property {Phaser.Math.Vector3} direction - [description]
 */

/**
 * @classdesc
 * [description]
 *
 * @class Camera
 * @memberOf Phaser.Cameras.Sprite3D
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - [description]
 */
var Camera = new Class({

    initialize:

    function Camera (scene)
    {
        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D#scene
         * @type {Phaser.Scene}
         * @since 3.0.0
         */
        this.scene = scene;

        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D#displayList
         * @type {Phaser.GameObjects.DisplayList}
         * @since 3.0.0
         */
        this.displayList = scene.sys.displayList;

        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D#updateList
         * @type {Phaser.GameObjects.UpdateList}
         * @since 3.0.0
         */
        this.updateList = scene.sys.updateList;

        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D#name
         * @type {string}
         * @default ''
         * @since 3.0.0
         */
        this.name = '';

        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D#direction
         * @type {Phaser.Math.Vector3}
         * @since 3.0.0
         */
        this.direction = new Vector3(0, 0, -1);

        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D#up
         * @type {Phaser.Math.Vector3}
         * @since 3.0.0
         */
        this.up = new Vector3(0, 1, 0);

        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D#position
         * @type {Phaser.Math.Vector3}
         * @since 3.0.0
         */
        this.position = new Vector3();

        //  The mapping from 3D size units to pixels.
        //  In the default case 1 3D unit = 128 pixels. So a sprite that is
        //  256 x 128 px in size will be 2 x 1 units.
        //  Change to whatever best fits your game assets.

        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D#pixelScale
         * @type {number}
         * @since 3.0.0
         */
        this.pixelScale = 128;

        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D#projection
         * @type {Phaser.Math.Matrix4}
         * @since 3.0.0
         */
        this.projection = new Matrix4();

        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D#view
         * @type {Phaser.Math.Matrix4}
         * @since 3.0.0
         */
        this.view = new Matrix4();

        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D#combined
         * @type {Phaser.Math.Matrix4}
         * @since 3.0.0
         */
        this.combined = new Matrix4();

        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D#invProjectionView
         * @type {Phaser.Math.Matrix4}
         * @since 3.0.0
         */
        this.invProjectionView = new Matrix4();

        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D#near
         * @type {number}
         * @default 1
         * @since 3.0.0
         */
        this.near = 1;

        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D#far
         * @type {number}
         * @since 3.0.0
         */
        this.far = 100;

        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D#ray
         * @type {RayDef}
         * @since 3.0.0
         */
        this.ray = {
            origin: new Vector3(),
            direction: new Vector3()
        };

        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D#viewportWidth
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.viewportWidth = 0;

        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D#viewportHeight
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.viewportHeight = 0;

        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D#billboardMatrixDirty
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.billboardMatrixDirty = true;

        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D#children
         * @type {Phaser.Structs.Set.<Phaser.GameObjects.GameObject>}
         * @since 3.0.0
         */
        this.children = new Set();
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#setPosition
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     * @param {number} z - [description]
     *
     * @return {Phaser.Cameras.Sprite3D.Camera} This Camera object.
     */
    setPosition: function (x, y, z)
    {
        this.position.set(x, y, z);

        return this.update();
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#setScene
     * @since 3.0.0
     *
     * @param {Phaser.Scene} scene - [description]
     *
     * @return {Phaser.Cameras.Sprite3D.Camera} This Camera object.
     */
    setScene: function (scene)
    {
        this.scene = scene;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#setPixelScale
     * @since 3.0.0
     *
     * @param {number} value - [description]
     *
     * @return {Phaser.Cameras.Sprite3D.Camera} This Camera object.
     */
    setPixelScale: function (value)
    {
        this.pixelScale = value;

        return this.update();
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#add
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Sprite3D} sprite3D - [description]
     *
     * @return {Phaser.GameObjects.Sprite3D} [description]
     */
    add: function (sprite3D)
    {
        this.children.set(sprite3D);

        this.displayList.add(sprite3D.gameObject);
        this.updateList.add(sprite3D.gameObject);

        this.updateChildren();

        return sprite3D;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#remove
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} child - [description]
     *
     * @return {Phaser.Cameras.Sprite3D.Camera} This Camera object.
     */
    remove: function (child)
    {
        this.displayList.remove(child.gameObject);
        this.updateList.remove(child.gameObject);

        this.children.delete(child);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#clear
     * @since 3.0.0
     *
     * @return {Phaser.Cameras.Sprite3D.Camera} This Camera object.
     */
    clear: function ()
    {
        var children = this.getChildren();

        for (var i = 0; i < children.length; i++)
        {
            this.remove(children[i]);
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#getChildren
     * @since 3.0.0
     *
     * @return {array} [description]
     */
    getChildren: function ()
    {
        return this.children.entries;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#create
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     * @param {number} z - [description]
     * @param {string} key - [description]
     * @param {(string|number)} frame - [description]
     * @param {boolean} [visible=true] - [description]
     *
     * @return {Phaser.GameObjects.Sprite3D} [description]
     */
    create: function (x, y, z, key, frame, visible)
    {
        if (visible === undefined) { visible = true; }

        var child = new Sprite3D(this.scene, x, y, z, key, frame);

        this.displayList.add(child.gameObject);
        this.updateList.add(child.gameObject);

        child.visible = visible;

        this.children.set(child);

        this.updateChildren();

        return child;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#createMultiple
     * @since 3.0.0
     *
     * @param {number} quantity - [description]
     * @param {string} key - [description]
     * @param {(string|number)} frame - [description]
     * @param {boolean} [visible=true] - [description]
     *
     * @return {Phaser.GameObjects.Sprite3D[]} [description]
     */
    createMultiple: function (quantity, key, frame, visible)
    {
        if (visible === undefined) { visible = true; }

        var output = [];

        for (var i = 0; i < quantity; i++)
        {
            var child = new Sprite3D(this.scene, 0, 0, 0, key, frame);

            this.displayList.add(child.gameObject);
            this.updateList.add(child.gameObject);

            child.visible = visible;

            this.children.set(child);

            output.push(child);
        }

        return output;
    },

    //  Create a bunch of Sprite3D objects in a rectangle
    //  size and spacing are Vec3s (or if integers are converted to vec3s)
    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#createRect
     * @since 3.0.0
     *
     * @param {(number|{x:number,y:number})} size - [description]
     * @param {(number|{x:number,y:number,z:number})} spacing - [description]
     * @param {string} key - [description]
     * @param {(string|number)} [frame] - [description]
     *
     * @return {Phaser.GameObjects.Sprite3D[]} [description]
     */
    createRect: function (size, spacing, key, frame)
    {
        if (typeof size === 'number') { size = { x: size, y: size, z: size }; }
        if (typeof spacing === 'number') { spacing = { x: spacing, y: spacing, z: spacing }; }

        var quantity = size.x * size.y * size.z;

        var sprites = this.createMultiple(quantity, key, frame);

        var i = 0;

        for (var z = 0.5 - (size.z / 2); z < (size.z / 2); z++)
        {
            for (var y = 0.5 - (size.y / 2); y < (size.y / 2); y++)
            {
                for (var x = 0.5 - (size.x / 2); x < (size.x / 2); x++)
                {
                    var bx = (x * spacing.x);
                    var by = (y * spacing.y);
                    var bz = (z * spacing.z);

                    sprites[i].position.set(bx, by, bz);

                    i++;
                }
            }
        }

        this.update();

        return sprites;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#randomSphere
     * @since 3.0.0
     *
     * @param {number} [radius=1] - [description]
     * @param {Phaser.GameObjects.Sprite3D[]} [sprites] - [description]
     *
     * @return {Phaser.Cameras.Sprite3D.Camera} This Camera object.
     */
    randomSphere: function (radius, sprites)
    {
        if (sprites === undefined) { sprites = this.getChildren(); }

        for (var i = 0; i < sprites.length; i++)
        {
            RandomXYZ(sprites[i].position, radius);
        }

        return this.update();
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#randomCube
     * @since 3.0.0
     *
     * @param {number} [scale=1] - [description]
     * @param {Phaser.GameObjects.Sprite3D[]} [sprites] - [description]
     *
     * @return {Phaser.Cameras.Sprite3D.Camera} This Camera object.
     */
    randomCube: function (scale, sprites)
    {
        if (sprites === undefined) { sprites = this.getChildren(); }

        for (var i = 0; i < sprites.length; i++)
        {
            RandomXYZW(sprites[i].position, scale);
        }

        return this.update();
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#translateChildren
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector3} vec3 - [description]
     * @param {Phaser.GameObjects.Sprite3D[]} sprites - [description]
     *
     * @return {Phaser.Cameras.Sprite3D.Camera} This Camera object.
     */
    translateChildren: function (vec3, sprites)
    {
        if (sprites === undefined) { sprites = this.getChildren(); }

        for (var i = 0; i < sprites.length; i++)
        {
            sprites[i].position.add(vec3);
        }

        return this.update();
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#transformChildren
     * @since 3.0.0
     *
     * @param {Phaser.Math.Matrix4} mat4 - [description]
     * @param {Phaser.GameObjects.Sprite3D[]} sprites - [description]
     *
     * @return {Phaser.Cameras.Sprite3D.Camera} This Camera object.
     */
    transformChildren: function (mat4, sprites)
    {
        if (sprites === undefined) { sprites = this.getChildren(); }

        for (var i = 0; i < sprites.length; i++)
        {
            sprites[i].position.transformMat4(mat4);
        }

        return this.update();
    },

    /**
     * Sets the width and height of the viewport. Does not update any matrices.
     *
     * @method Phaser.Cameras.Sprite3D.Camera#setViewport
     * @since 3.0.0
     *
     * @param {number} width - [description]
     * @param {number} height - [description]
     *
     * @return {Phaser.Cameras.Sprite3D.Camera} This Camera object.
     */
    setViewport: function (width, height)
    {
        this.viewportWidth = width;
        this.viewportHeight = height;

        return this.update();
    },

    /**
     * Translates this camera by a specified Vector3 object
     * or x, y, z parameters. Any undefined x y z values will
     * default to zero, leaving that component unaffected.
     * If you wish to set the camera position directly call setPosition instead.
     *
     * @method Phaser.Cameras.Sprite3D.Camera#translate
     * @since 3.0.0
     *
     * @param {(number|object)} x - [description]
     * @param {number} [y] - [description]
     * @param {number} [z] - [description]
     *
     * @return {Phaser.Cameras.Sprite3D.Camera} This Camera object.
     */
    translate: function (x, y, z)
    {
        if (typeof x === 'object')
        {
            this.position.x += x.x || 0;
            this.position.y += x.y || 0;
            this.position.z += x.z || 0;
        }
        else
        {
            this.position.x += x || 0;
            this.position.y += y || 0;
            this.position.z += z || 0;
        }

        return this.update();
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#lookAt
     * @since 3.0.0
     *
     * @param {(number|object)} x - [description]
     * @param {number} [y] - [description]
     * @param {number} [z] - [description]
     *
     * @return {Phaser.Cameras.Sprite3D.Camera} This Camera object.
     */
    lookAt: function (x, y, z)
    {
        var dir = this.direction;
        var up = this.up;

        if (typeof x === 'object')
        {
            dir.copy(x);
        }
        else
        {
            dir.set(x, y, z);
        }

        dir.subtract(this.position).normalize();

        //  Calculate right vector
        tmpVec3.copy(dir).cross(up).normalize();

        //  Calculate up vector
        up.copy(tmpVec3).cross(dir).normalize();

        return this.update();
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#rotate
     * @since 3.0.0
     *
     * @param {number} radians - [description]
     * @param {Phaser.Math.Vector3} axis - [description]
     *
     * @return {Phaser.Cameras.Sprite3D.Camera} This Camera object.
     */
    rotate: function (radians, axis)
    {
        RotateVec3(this.direction, axis, radians);
        RotateVec3(this.up, axis, radians);

        return this.update();
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#rotateAround
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector3} point - [description]
     * @param {number} radians - [description]
     * @param {Phaser.Math.Vector3} axis - [description]
     *
     * @return {Phaser.Cameras.Sprite3D.Camera} This Camera object.
     */
    rotateAround: function (point, radians, axis)
    {
        tmpVec3.copy(point).subtract(this.position);

        this.translate(tmpVec3);
        this.rotate(radians, axis);
        this.translate(tmpVec3.negate());

        return this.update();
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#project
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector3} vec - [description]
     * @param {Phaser.Math.Vector4} out - [description]
     *
     * @return {Phaser.Math.Vector4} [description]
     */
    project: function (vec, out)
    {
        if (out === undefined) { out = new Vector4(); }

        //  TODO: support viewport XY
        var viewportWidth = this.viewportWidth;
        var viewportHeight = this.viewportHeight;
        var n = Camera.NEAR_RANGE;
        var f = Camera.FAR_RANGE;

        //  For useful Z and W values we should do the usual steps: clip space -> NDC -> window coords

        //  Implicit 1.0 for w component
        tmpVec4.set(vec.x, vec.y, vec.z, 1.0);

        //  Transform into clip space
        tmpVec4.transformMat4(this.combined);

        //  Avoid divide by zero when 0x0x0 camera projects to a 0x0x0 vec3
        if (tmpVec4.w === 0)
        {
            tmpVec4.w = 1;
        }

        //  Now into NDC
        tmpVec4.x = tmpVec4.x / tmpVec4.w;
        tmpVec4.y = tmpVec4.y / tmpVec4.w;
        tmpVec4.z = tmpVec4.z / tmpVec4.w;

        //  And finally into window coordinates
        out.x = viewportWidth / 2 * tmpVec4.x + (0 + viewportWidth / 2);
        out.y = viewportHeight / 2 * tmpVec4.y + (0 + viewportHeight / 2);
        out.z = (f - n) / 2 * tmpVec4.z + (f + n) / 2;

        //  If the out vector has a fourth component, we also store (1/clip.w), same idea as gl_FragCoord.w
        if (out.w === 0 || out.w)
        {
            out.w = 1 / tmpVec4.w;
        }

        return out;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#unproject
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector4} vec - [description]
     * @param {Phaser.Math.Vector3} out - [description]
     *
     * @return {Phaser.Math.Vector3} [description]
     */
    unproject: function (vec, out)
    {
        if (out === undefined) { out = new Vector3(); }

        var viewport = tmpVec4.set(0, 0, this.viewportWidth, this.viewportHeight);

        return out.copy(vec).unproject(viewport, this.invProjectionView);
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#getPickRay
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} [y] - [description]
     *
     * @return {RayDef} [description]
     */
    getPickRay: function (x, y)
    {
        var origin = this.ray.origin.set(x, y, 0);
        var direction = this.ray.direction.set(x, y, 1);
        var viewport = tmpVec4.set(0, 0, this.viewportWidth, this.viewportHeight);
        var mtx = this.invProjectionView;

        origin.unproject(viewport, mtx);

        direction.unproject(viewport, mtx);

        direction.subtract(origin).normalize();

        return this.ray;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#updateChildren
     * @since 3.0.0
     *
     * @return {Phaser.Cameras.Sprite3D.Camera} This Camera object.
     */
    updateChildren: function ()
    {
        var children = this.children.entries;

        for (var i = 0; i < children.length; i++)
        {
            children[i].project(this);
        }

        return this;
    },

    //  Overriden by subclasses
    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#update
     * @since 3.0.0
     *
     * @return {Phaser.Cameras.Sprite3D.Camera} This Camera object.
     */
    update: function ()
    {
        return this.updateChildren();
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#updateBillboardMatrix
     * @since 3.0.0
     */
    updateBillboardMatrix: function ()
    {
        var dir = dirvec.set(this.direction).negate();

        // Better view-aligned billboards might use this:
        // var dir = tmp.set(camera.position).subtract(p).normalize();

        var right = rightvec.set(this.up).cross(dir).normalize();
        var up = tmpVec3.set(dir).cross(right).normalize();

        var out = billboardMatrix.val;

        out[0] = right.x;
        out[1] = right.y;
        out[2] = right.z;
        out[3] = 0;

        out[4] = up.x;
        out[5] = up.y;
        out[6] = up.z;
        out[7] = 0;

        out[8] = dir.x;
        out[9] = dir.y;
        out[10] = dir.z;
        out[11] = 0;

        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
        out[15] = 1;

        this.billboardMatrixDirty = false;
    },

    /**
     * This is a utility function for canvas 3D rendering,
     * which determines the "point size" of a camera-facing
     * sprite billboard given its 3D world position
     * (origin at center of sprite) and its world width
     * and height in x/y.
     *
     * We place into the output Vector2 the scaled width
     * and height. If no `out` is specified, a new Vector2
     * will be created for convenience (this should be avoided
     * in tight loops).
     *
     * @method Phaser.Cameras.Sprite3D.Camera#getPointSize
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector2} vec - The position of the 3D Sprite.
     * @param {Phaser.Math.Vector2} size - The x and y dimensions.
     * @param {Phaser.Math.Vector2} out - The result, scaled x and y dimensions.
     *
     * @return {Phaser.Math.Vector2} [description]
     */
    getPointSize: function (vec, size, out)
    {
        if (out === undefined) { out = new Vector2(); }

        // TODO: optimize this with a simple distance calculation:
        // https://developer.valvesoftware.com/wiki/Field_of_View

        if (this.billboardMatrixDirty)
        {
            this.updateBillboardMatrix();
        }

        var tmp = tmpVec3;

        var dx = (size.x / this.pixelScale) / 2;
        var dy = (size.y / this.pixelScale) / 2;

        tmp.set(-dx, -dy, 0).transformMat4(billboardMatrix).add(vec);

        this.project(tmp, tmp);

        var tlx = tmp.x;
        var tly = tmp.y;

        tmp.set(dx, dy, 0).transformMat4(billboardMatrix).add(vec);

        this.project(tmp, tmp);

        var brx = tmp.x;
        var bry = tmp.y;

        // var w = Math.abs(brx - tlx);
        // var h = Math.abs(bry - tly);

        //  Allow the projection to get negative ...
        var w = brx - tlx;
        var h = bry - tly;

        return out.set(w, h);
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.children.clear();

        this.scene = undefined;
        this.children = undefined;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#setX
     * @since 3.0.0
     *
     * @param {number} value - [description]
     *
     * @return {Phaser.Cameras.Sprite3D.Camera} This Camera object.
     */
    setX: function (value)
    {
        this.position.x = value;

        return this.update();
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#setY
     * @since 3.0.0
     *
     * @param {number} value - [description]
     *
     * @return {Phaser.Cameras.Sprite3D.Camera} This Camera object.
     */
    setY: function (value)
    {
        this.position.y = value;

        return this.update();
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#setZ
     * @since 3.0.0
     *
     * @param {number} value - [description]
     *
     * @return {Phaser.Cameras.Sprite3D.Camera} This Camera object.
     */
    setZ: function (value)
    {
        this.position.z = value;

        return this.update();
    },

    /**
     * [description]
     *
     * @name Phaser.Cameras.Sprite3D.Camera#x
     * @type {number}
     * @since 3.0.0
     */
    x: {
        get: function ()
        {
            return this.position.x;
        },

        set: function (value)
        {
            this.position.x = value;
            this.update();
        }
    },

    /**
     * [description]
     *
     * @name Phaser.Cameras.Sprite3D.Camera#y
     * @type {number}
     * @since 3.0.0
     */
    y: {
        get: function ()
        {
            return this.position.y;
        },

        set: function (value)
        {
            this.position.y = value;
            this.update();
        }
    },

    /**
     * [description]
     *
     * @name Phaser.Cameras.Sprite3D.Camera#z
     * @type {number}
     * @since 3.0.0
     */
    z: {
        get: function ()
        {
            return this.position.z;
        },

        set: function (value)
        {
            this.position.z = value;
            this.update();
        }
    }

});

Camera.FAR_RANGE = 1.0;
Camera.NEAR_RANGE = 0.0;

module.exports = Camera;


/***/ }),
/* 16 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Phaser Scale Modes.
 * 
 * @name Phaser.ScaleModes
 * @enum {integer}
 * @memberOf Phaser
 * @readOnly
 * @since 3.0.0
 */

module.exports = {

    /**
     * Default Scale Mode (Linear).
     * 
     * @name Phaser.ScaleModes.DEFAULT
     */
    DEFAULT: 0,

    /**
     * Linear Scale Mode.
     * 
     * @name Phaser.ScaleModes.LINEAR
     */
    LINEAR: 0,

    /**
     * Nearest Scale Mode.
     * 
     * @name Phaser.ScaleModes.NEAREST
     */
    NEAREST: 1

};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var RND = __webpack_require__(72);

var MATH_CONST = {

    /**
     * The value of PI * 2.
     * 
     * @name Phaser.Math.PI2
     * @type {number}
     * @since 3.0.0
     */
    PI2: Math.PI * 2,

    /**
     * The value of PI * 0.5.
     * 
     * @name Phaser.Math.TAU
     * @type {number}
     * @since 3.0.0
     */
    TAU: Math.PI * 0.5,

    /**
     * An epsilon value (1.0e-6)
     * 
     * @name Phaser.Math.EPSILON
     * @type {number}
     * @since 3.0.0
     */
    EPSILON: 1.0e-6,

    /**
     * For converting degrees to radians (PI / 180)
     * 
     * @name Phaser.Math.DEG_TO_RAD
     * @type {number}
     * @since 3.0.0
     */
    DEG_TO_RAD: Math.PI / 180,

    /**
     * For converting radians to degrees (180 / PI)
     * 
     * @name Phaser.Math.RAD_TO_DEG
     * @type {number}
     * @since 3.0.0
     */
    RAD_TO_DEG: 180 / Math.PI,

    /**
     * An instance of the Random Number Generator.
     * 
     * @name Phaser.Math.RND
     * @type {Phaser.Math.RandomDataGenerator}
     * @since 3.0.0
     */
    RND: new RND()

};

module.exports = MATH_CONST;


/***/ }),
/* 18 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Phaser Blend Modes.
 * 
 * @name Phaser.BlendModes
 * @enum {integer}
 * @memberOf Phaser
 * @readOnly
 * @since 3.0.0
 */

module.exports = {

    /**
     * Skips the Blend Mode check in the renderer.
     * 
     * @name Phaser.BlendModes.SKIP_CHECK
     */
    SKIP_CHECK: -1,

    /**
     * Normal blend mode.
     * 
     * @name Phaser.BlendModes.NORMAL
     */
    NORMAL: 0,

    /**
     * Add blend mode.
     * 
     * @name Phaser.BlendModes.ADD
     */
    ADD: 1,

    /**
     * Multiply blend mode.
     * 
     * @name Phaser.BlendModes.MULTIPLY
     */
    MULTIPLY: 2,

    /**
     * Screen blend mode.
     * 
     * @name Phaser.BlendModes.SCREEN
     */
    SCREEN: 3,

    /**
     * Overlay blend mode.
     * 
     * @name Phaser.BlendModes.OVERLAY
     */
    OVERLAY: 4,

    /**
     * Darken blend mode.
     * 
     * @name Phaser.BlendModes.DARKEN
     */
    DARKEN: 5,

    /**
     * Lighten blend mode.
     * 
     * @name Phaser.BlendModes.LIGHTEN
     */
    LIGHTEN: 6,

    /**
     * Color Dodge blend mode.
     * 
     * @name Phaser.BlendModes.COLOR_DODGE
     */
    COLOR_DODGE: 7,

    /**
     * Color Burn blend mode.
     * 
     * @name Phaser.BlendModes.COLOR_BURN
     */
    COLOR_BURN: 8,

    /**
     * Hard Light blend mode.
     * 
     * @name Phaser.BlendModes.HARD_LIGHT
     */
    HARD_LIGHT: 9,

    /**
     * Soft Light blend mode.
     * 
     * @name Phaser.BlendModes.SOFT_LIGHT
     */
    SOFT_LIGHT: 10,

    /**
     * Difference blend mode.
     * 
     * @name Phaser.BlendModes.DIFFERENCE
     */
    DIFFERENCE: 11,

    /**
     * Exclusion blend mode.
     * 
     * @name Phaser.BlendModes.EXCLUSION
     */
    EXCLUSION: 12,

    /**
     * Hue blend mode.
     * 
     * @name Phaser.BlendModes.HUE
     */
    HUE: 13,

    /**
     * Saturation blend mode.
     * 
     * @name Phaser.BlendModes.SATURATION
     */
    SATURATION: 14,

    /**
     * Color blend mode.
     * 
     * @name Phaser.BlendModes.COLOR
     */
    COLOR: 15,

    /**
     * Luminosity blend mode.
     * 
     * @name Phaser.BlendModes.LUMINOSITY
     */
    LUMINOSITY: 16

};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2018 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser3-plugin-template/blob/master/LICENSE|MIT License}
*/

var Class = __webpack_require__(0);

/**
 * @classdesc
 * A Global Plugin is installed just once into the Game owned Plugin Manager.
 * It can listen for Game events and respond to them.
 *
 * @class BasePlugin
 * @memberOf Phaser.Plugins
 * @constructor
 * @since 3.8.0
 *
 * @param {Phaser.Plugins.PluginManager} pluginManager - A reference to the Plugin Manager.
 */
var BasePlugin = new Class({

    initialize:

    function BasePlugin (pluginManager)
    {
        /**
         * A handy reference to the Plugin Manager that is responsible for this plugin.
         * Can be used as a route to gain access to game systems and  events.
         *
         * @name Phaser.Plugins.BasePlugin#pluginManager
         * @type {Phaser.Plugins.PluginManager}
         * @protected
         * @since 3.8.0
         */
        this.pluginManager = pluginManager;

        /**
         * A reference to the Game instance this plugin is running under.
         *
         * @name Phaser.Plugins.BasePlugin#game
         * @type {Phaser.Game}
         * @protected
         * @since 3.8.0
         */
        this.game = pluginManager.game;

        /**
         * A reference to the Scene that has installed this plugin.
         * Only set if it's a Scene Plugin, otherwise `null`.
         * This property is only set when the plugin is instantiated and added to the Scene, not before.
         * You cannot use it during the `init` method, but you can during the `boot` method.
         *
         * @name Phaser.Plugins.BasePlugin#scene
         * @type {?Phaser.Scene}
         * @protected
         * @since 3.8.0
         */
        this.scene;

        /**
         * A reference to the Scene Systems of the Scene that has installed this plugin.
         * Only set if it's a Scene Plugin, otherwise `null`.
         * This property is only set when the plugin is instantiated and added to the Scene, not before.
         * You cannot use it during the `init` method, but you can during the `boot` method.
         *
         * @name Phaser.Plugins.BasePlugin#systems
         * @type {?Phaser.Scenes.Systems}
         * @protected
         * @since 3.8.0
         */
        this.systems;
    },

    /**
     * Called by the PluginManager when this plugin is first instantiated.
     * It will never be called again on this instance.
     * In here you can set-up whatever you need for this plugin to run.
     * If a plugin is set to automatically start then `BasePlugin.start` will be called immediately after this.
     *
     * @method Phaser.Plugins.BasePlugin#init
     * @since 3.8.0
     *
     * @param {?any} [data] - A value specified by the user, if any, from the `data` property of the plugin's configuration object (if started at game boot) or passed in the PluginManager's `install` method (if started manually).
     */
    init: function ()
    {
    },

    /**
     * Called by the PluginManager when this plugin is started.
     * If a plugin is stopped, and then started again, this will get called again.
     * Typically called immediately after `BasePlugin.init`.
     *
     * @method Phaser.Plugins.BasePlugin#start
     * @since 3.8.0
     */
    start: function ()
    {
        //  Here are the game-level events you can listen to.
        //  At the very least you should offer a destroy handler for when the game closes down.

        // var eventEmitter = this.game.events;

        // eventEmitter.once('destroy', this.gameDestroy, this);
        // eventEmitter.on('pause', this.gamePause, this);
        // eventEmitter.on('resume', this.gameResume, this);
        // eventEmitter.on('resize', this.gameResize, this);
        // eventEmitter.on('prestep', this.gamePreStep, this);
        // eventEmitter.on('step', this.gameStep, this);
        // eventEmitter.on('poststep', this.gamePostStep, this);
        // eventEmitter.on('prerender', this.gamePreRender, this);
        // eventEmitter.on('postrender', this.gamePostRender, this);
    },

    /**
     * Called by the PluginManager when this plugin is stopped.
     * The game code has requested that your plugin stop doing whatever it does.
     * It is now considered as 'inactive' by the PluginManager.
     * Handle that process here (i.e. stop listening for events, etc)
     * If the plugin is started again then `BasePlugin.start` will be called again.
     *
     * @method Phaser.Plugins.BasePlugin#stop
     * @since 3.8.0
     */
    stop: function ()
    {
    },

    /**
     * If this is a Scene Plugin (i.e. installed into a Scene) then this method is called when the Scene boots.
     * By this point the plugin properties `scene` and `systems` will have already been set.
     * In here you can listen for Scene events and set-up whatever you need for this plugin to run.
     *
     * @method Phaser.Plugins.BasePlugin#boot
     * @since 3.8.0
     */
    boot: function ()
    {
        //  Here are the Scene events you can listen to.
        //  At the very least you should offer a destroy handler for when the Scene closes down.

        // var eventEmitter = this.systems.events;

        // eventEmitter.once('destroy', this.sceneDestroy, this);
        // eventEmitter.on('start', this.sceneStart, this);
        // eventEmitter.on('preupdate', this.scenePreUpdate, this);
        // eventEmitter.on('update', this.sceneUpdate, this);
        // eventEmitter.on('postupdate', this.scenePostUpdate, this);
        // eventEmitter.on('pause', this.scenePause, this);
        // eventEmitter.on('resume', this.sceneResume, this);
        // eventEmitter.on('sleep', this.sceneSleep, this);
        // eventEmitter.on('wake', this.sceneWake, this);
        // eventEmitter.on('shutdown', this.sceneShutdown, this);
        // eventEmitter.on('destroy', this.sceneDestroy, this);
    },

    /**
     * Game instance has been destroyed.
     * You must release everything in here, all references, all objects, free it all up.
     *
     * @method Phaser.Plugins.BasePlugin#destroy
     * @since 3.8.0
     */
    destroy: function ()
    {
        this.pluginManager = null;
        this.game = null;
        this.scene = null;
        this.systems = null;
    }

});

module.exports = BasePlugin;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2018 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser3-plugin-template/blob/master/LICENSE|MIT License}
*/

var BasePlugin = __webpack_require__(19);
var Class = __webpack_require__(0);

/**
 * @classdesc
 * A Scene Level Plugin is installed into every Scene and belongs to that Scene.
 * It can listen for Scene events and respond to them.
 * It can map itself to a Scene property, or into the Scene Systems, or both.
 *
 * @class ScenePlugin
 * @memberOf Phaser.Plugins
 * @extends Phaser.Plugins.BasePlugin
 * @constructor
 * @since 3.8.0
 *
 * @param {Phaser.Scene} scene - A reference to the Scene that has installed this plugin.
 * @param {Phaser.Plugins.PluginManager} pluginManager - A reference to the Plugin Manager.
 */
var ScenePlugin = new Class({

    Extends: BasePlugin,

    initialize:

    function ScenePlugin (scene, pluginManager)
    {
        BasePlugin.call(this, pluginManager);

        this.scene = scene;
        this.systems = scene.sys;

        scene.sys.events.once('boot', this.boot, this);
    },

    /**
     * This method is called when the Scene boots. It is only ever called once.
     * 
     * By this point the plugin properties `scene` and `systems` will have already been set.
     * 
     * In here you can listen for Scene events and set-up whatever you need for this plugin to run.
     * Here are the Scene events you can listen to:
     * 
     * start
     * ready
     * preupdate
     * update
     * postupdate
     * resize
     * pause
     * resume
     * sleep
     * wake
     * transitioninit
     * transitionstart
     * transitioncomplete
     * transitionout
     * shutdown
     * destroy
     * 
     * At the very least you should offer a destroy handler for when the Scene closes down, i.e:
     *
     * ```javascript
     * var eventEmitter = this.systems.events;
     * eventEmitter.once('destroy', this.sceneDestroy, this);
     * ```
     *
     * @method Phaser.Plugins.ScenePlugin#boot
     * @since 3.8.0
     */
    boot: function ()
    {
    }

});

module.exports = ScenePlugin;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Camera = __webpack_require__(15);
var Class = __webpack_require__(0);
var Vector3 = __webpack_require__(2);

//  Local cache vars
var tmpVec3 = new Vector3();

/**
 * @classdesc
 * [description]
 *
 * @class PerspectiveCamera
 * @extends Phaser.Cameras.Sprite3D.Camera
 * @memberOf Phaser.Cameras.Sprite3D
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - [description]
 * @param {integer} [fieldOfView=80] - [description]
 * @param {integer} [viewportWidth=0] - [description]
 * @param {integer} [viewportHeight=0] - [description]
 */
var PerspectiveCamera = new Class({

    Extends: Camera,

    //  FOV is converted to radians automatically
    initialize:

    function PerspectiveCamera (scene, fieldOfView, viewportWidth, viewportHeight)
    {
        if (fieldOfView === undefined) { fieldOfView = 80; }
        if (viewportWidth === undefined) { viewportWidth = 0; }
        if (viewportHeight === undefined) { viewportHeight = 0; }

        Camera.call(this, scene);

        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D.PerspectiveCamera#viewportWidth
         * @type {integer}
         * @default 0
         * @since 3.0.0
         */
        this.viewportWidth = viewportWidth;

        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D.PerspectiveCamera#viewportHeight
         * @type {integer}
         * @default 0
         * @since 3.0.0
         */
        this.viewportHeight = viewportHeight;

        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D.PerspectiveCamera#fieldOfView
         * @type {integer}
         * @default 80
         * @since 3.0.0
         */
        this.fieldOfView = fieldOfView * Math.PI / 180;

        this.update();
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.PerspectiveCamera#setFOV
     * @since 3.0.0
     *
     * @param {number} value - [description]
     *
     * @return {Phaser.Cameras.Sprite3D.PerspectiveCamera} [description]
     */
    setFOV: function (value)
    {
        this.fieldOfView = value * Math.PI / 180;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.PerspectiveCamera#update
     * @since 3.0.0
     *
     * @return {Phaser.Cameras.Sprite3D.PerspectiveCamera} [description]
     */
    update: function ()
    {
        var aspect = this.viewportWidth / this.viewportHeight;

        //  Create a perspective matrix for our camera
        this.projection.perspective(
            this.fieldOfView,
            aspect,
            Math.abs(this.near),
            Math.abs(this.far)
        );

        //  Build the view matrix
        tmpVec3.copy(this.position).add(this.direction);

        this.view.lookAt(this.position, tmpVec3, this.up);

        //  Projection * view matrix
        this.combined.copy(this.projection).multiply(this.view);

        //  Invert combined matrix, used for unproject
        this.invProjectionView.copy(this.combined).invert();

        this.billboardMatrixDirty = true;

        this.updateChildren();

        return this;
    }

});

module.exports = PerspectiveCamera;


/***/ }),
/* 22 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Renders this Game Object with the Canvas Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.Sprite#renderCanvas
 * @since 3.0.0
 * @private
 *
 * @param {Phaser.Renderer.Canvas.CanvasRenderer} renderer - A reference to the current active Canvas renderer.
 * @param {Phaser.GameObjects.Sprite} src - The Game Object being rendered in this call.
 * @param {number} interpolationPercentage - Reserved for future use and custom pipelines.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var SpriteCanvasRenderer = function (renderer, src, interpolationPercentage, camera, parentMatrix)
{
    renderer.batchSprite(src, src.frame, camera, parentMatrix);
};

module.exports = SpriteCanvasRenderer;


/***/ }),
/* 23 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Renders this Game Object with the WebGL Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.Sprite#renderWebGL
 * @since 3.0.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {Phaser.GameObjects.Sprite} src - The Game Object being rendered in this call.
 * @param {number} interpolationPercentage - Reserved for future use and custom pipelines.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var SpriteWebGLRenderer = function (renderer, src, interpolationPercentage, camera, parentMatrix)
{
    this.pipeline.batchSprite(src, camera, parentMatrix);
};

module.exports = SpriteWebGLRenderer;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var renderWebGL = __webpack_require__(6);
var renderCanvas = __webpack_require__(6);

if (typeof WEBGL_RENDERER)
{
    renderWebGL = __webpack_require__(23);
}

if (typeof CANVAS_RENDERER)
{
    renderCanvas = __webpack_require__(22);
}

module.exports = {

    renderWebGL: renderWebGL,
    renderCanvas: renderCanvas

};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = __webpack_require__(0);
var Components = __webpack_require__(11);
var GameObject = __webpack_require__(12);
var SpriteRender = __webpack_require__(24);

/**
 * @classdesc
 * A Sprite Game Object.
 *
 * A Sprite Game Object is used for the display of both static and animated images in your game.
 * Sprites can have input events and physics bodies. They can also be tweened, tinted, scrolled
 * and animated.
 *
 * The main difference between a Sprite and an Image Game Object is that you cannot animate Images.
 * As such, Sprites take a fraction longer to process and have a larger API footprint due to the Animation
 * Component. If you do not require animation then you can safely use Images to replace Sprites in all cases.
 *
 * @class Sprite
 * @extends Phaser.GameObjects.GameObject
 * @memberOf Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 *
 * @extends Phaser.GameObjects.Components.Alpha
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Flip
 * @extends Phaser.GameObjects.Components.GetBounds
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.Pipeline
 * @extends Phaser.GameObjects.Components.ScaleMode
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Size
 * @extends Phaser.GameObjects.Components.TextureCrop
 * @extends Phaser.GameObjects.Components.Tint
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {string} texture - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {(string|integer)} [frame] - An optional frame from the Texture this Game Object is rendering with.
 */
var Sprite = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.Depth,
        Components.Flip,
        Components.GetBounds,
        Components.Mask,
        Components.Origin,
        Components.Pipeline,
        Components.ScaleMode,
        Components.ScrollFactor,
        Components.Size,
        Components.TextureCrop,
        Components.Tint,
        Components.Transform,
        Components.Visible,
        SpriteRender
    ],

    initialize:

    function Sprite (scene, x, y, texture, frame)
    {
        GameObject.call(this, scene, 'Sprite');

        /**
         * The internal crop data object, as used by `setCrop` and passed to the `Frame.setCropUVs` method.
         *
         * @name Phaser.GameObjects.Sprite#_crop
         * @type {object}
         * @private
         * @since 3.11.0
         */
        this._crop = this.resetCropObject();

        /**
         * The Animation Controller of this Sprite.
         *
         * @name Phaser.GameObjects.Sprite#anims
         * @type {Phaser.GameObjects.Components.Animation}
         * @since 3.0.0
         */
        this.anims = new Components.Animation(this);

        this.setTexture(texture, frame);
        this.setPosition(x, y);
        this.setSizeToFrame();
        this.setOriginFromFrame();
        this.initPipeline('TextureTintPipeline');
    },

    /**
     * Update this Sprite's animations.
     *
     * @method Phaser.GameObjects.Sprite#preUpdate
     * @protected
     * @since 3.0.0
     *
     * @param {number} time - The current timestamp.
     * @param {number} delta - The delta time, in ms, elapsed since the last frame.
     */
    preUpdate: function (time, delta)
    {
        this.anims.update(time, delta);
    },

    /**
     * Start playing the given animation.
     *
     * @method Phaser.GameObjects.Sprite#play
     * @since 3.0.0
     *
     * @param {string} key - The string-based key of the animation to play.
     * @param {boolean} [ignoreIfPlaying=false] - If an animation is already playing then ignore this call.
     * @param {integer} [startFrame=0] - Optionally start the animation playing from this frame index.
     *
     * @return {Phaser.GameObjects.Sprite} This Game Object.
     */
    play: function (key, ignoreIfPlaying, startFrame)
    {
        this.anims.play(key, ignoreIfPlaying, startFrame);

        return this;
    },

    /**
     * Build a JSON representation of this Sprite.
     *
     * @method Phaser.GameObjects.Sprite#toJSON
     * @since 3.0.0
     *
     * @return {JSONGameObject} A JSON representation of the Game Object.
     */
    toJSON: function ()
    {
        var data = Components.ToJSON(this);

        //  Extra Sprite data is added here

        return data;
    }

});

module.exports = Sprite;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */
function addListener(emitter, event, fn, context, once) {
  if (typeof fn !== 'function') {
    throw new TypeError('The listener must be a function');
  }

  var listener = new EE(fn, context || emitter, once)
    , evt = prefix ? prefix + event : event;

  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
  else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
  else emitter._events[evt] = [emitter._events[evt], listener];

  return emitter;
}

/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */
function clearEvent(emitter, evt) {
  if (--emitter._eventsCount === 0) emitter._events = new Events();
  else delete emitter._events[evt];
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @public
 */
EventEmitter.prototype.listeners = function listeners(event) {
  var evt = prefix ? prefix + event : event
    , handlers = this._events[evt];

  if (!handlers) return [];
  if (handlers.fn) return [handlers.fn];

  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
    ee[i] = handlers[i].fn;
  }

  return ee;
};

/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @public
 */
EventEmitter.prototype.listenerCount = function listenerCount(event) {
  var evt = prefix ? prefix + event : event
    , listeners = this._events[evt];

  if (!listeners) return 0;
  if (listeners.fn) return 1;
  return listeners.length;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  return addListener(this, event, fn, context, false);
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  return addListener(this, event, fn, context, true);
};

/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    clearEvent(this, evt);
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
      listeners.fn === fn &&
      (!once || listeners.once) &&
      (!context || listeners.context === context)
    ) {
      clearEvent(this, evt);
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
        listeners[i].fn !== fn ||
        (once && !listeners[i].once) ||
        (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else clearEvent(this, evt);
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) clearEvent(this, evt);
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
if (true) {
  module.exports = EventEmitter;
}


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = __webpack_require__(0);

/**
 * @callback DataEachCallback
 *
 * @param {*} parent - The parent object of the DataManager.
 * @param {string} key - The key of the value.
 * @param {*} value - The value.
 * @param {...*} [args] - Additional arguments that will be passed to the callback, after the game object, key, and data.
 */

/**
 * @classdesc
 * The Data Component features a means to store pieces of data specific to a Game Object, System or Plugin.
 * You can then search, query it, and retrieve the data. The parent must either extend EventEmitter,
 * or have a property called `events` that is an instance of it.
 *
 * @class DataManager
 * @memberOf Phaser.Data
 * @constructor
 * @since 3.0.0
 *
 * @param {object} parent - The object that this DataManager belongs to.
 * @param {Phaser.Events.EventEmitter} eventEmitter - The DataManager's event emitter.
 */
var DataManager = new Class({

    initialize:

    function DataManager (parent, eventEmitter)
    {
        /**
         * The object that this DataManager belongs to.
         *
         * @name Phaser.Data.DataManager#parent
         * @type {*}
         * @since 3.0.0
         */
        this.parent = parent;

        /**
         * The DataManager's event emitter.
         *
         * @name Phaser.Data.DataManager#events
         * @type {Phaser.Events.EventEmitter}
         * @since 3.0.0
         */
        this.events = eventEmitter;

        if (!eventEmitter)
        {
            this.events = (parent.events) ? parent.events : parent;
        }

        /**
         * The data list.
         *
         * @name Phaser.Data.DataManager#list
         * @type {Object.<string, *>}
         * @default {}
         * @since 3.0.0
         */
        this.list = {};

        /**
         * The public values list. You can use this to access anything you have stored
         * in this Data Manager. For example, if you set a value called `gold` you can
         * access it via:
         *
         * ```javascript
         * this.data.values.gold;
         * ```
         *
         * You can also modify it directly:
         * 
         * ```javascript
         * this.data.values.gold += 1000;
         * ```
         *
         * Doing so will emit a `setdata` event from the parent of this Data Manager.
         *
         * @name Phaser.Data.DataManager#values
         * @type {Object.<string, *>}
         * @default {}
         * @since 3.10.0
         */
        this.values = {};

        /**
         * Whether setting data is frozen for this DataManager.
         *
         * @name Phaser.Data.DataManager#_frozen
         * @type {boolean}
         * @private
         * @default false
         * @since 3.0.0
         */
        this._frozen = false;

        if (!parent.hasOwnProperty('sys') && this.events)
        {
            this.events.once('destroy', this.destroy, this);
        }
    },

    /**
     * Retrieves the value for the given key, or undefined if it doesn't exist.
     *
     * You can also access values via the `values` object. For example, if you had a key called `gold` you can do either:
     * 
     * ```javascript
     * this.data.get('gold');
     * ```
     *
     * Or access the value directly:
     * 
     * ```javascript
     * this.data.values.gold;
     * ```
     *
     * You can also pass in an array of keys, in which case an array of values will be returned:
     * 
     * ```javascript
     * this.data.get([ 'gold', 'armor', 'health' ]);
     * ```
     *
     * This approach is useful for destructuring arrays in ES6.
     *
     * @method Phaser.Data.DataManager#get
     * @since 3.0.0
     *
     * @param {(string|string[])} key - The key of the value to retrieve, or an array of keys.
     *
     * @return {*} The value belonging to the given key, or an array of values, the order of which will match the input array.
     */
    get: function (key)
    {
        var list = this.list;

        if (Array.isArray(key))
        {
            var output = [];

            for (var i = 0; i < key.length; i++)
            {
                output.push(list[key[i]]);
            }

            return output;
        }
        else
        {
            return list[key];
        }
    },

    /**
     * Retrieves all data values in a new object.
     *
     * @method Phaser.Data.DataManager#getAll
     * @since 3.0.0
     *
     * @return {Object.<string, *>} All data values.
     */
    getAll: function ()
    {
        var results = {};

        for (var key in this.list)
        {
            if (this.list.hasOwnProperty(key))
            {
                results[key] = this.list[key];
            }
        }

        return results;
    },

    /**
     * Queries the DataManager for the values of keys matching the given regular expression.
     *
     * @method Phaser.Data.DataManager#query
     * @since 3.0.0
     *
     * @param {RegExp} search - A regular expression object. If a non-RegExp object obj is passed, it is implicitly converted to a RegExp by using new RegExp(obj).
     *
     * @return {Object.<string, *>} The values of the keys matching the search string.
     */
    query: function (search)
    {
        var results = {};

        for (var key in this.list)
        {
            if (this.list.hasOwnProperty(key) && key.match(search))
            {
                results[key] = this.list[key];
            }
        }

        return results;
    },

    /**
     * Sets a value for the given key. If the key doesn't already exist in the Data Manager then it is created.
     * 
     * ```javascript
     * data.set('name', 'Red Gem Stone');
     * ```
     *
     * You can also pass in an object of key value pairs as the first argument:
     *
     * ```javascript
     * data.set({ name: 'Red Gem Stone', level: 2, owner: 'Link', gold: 50 });
     * ```
     *
     * To get a value back again you can call `get`:
     * 
     * ```javascript
     * data.get('gold');
     * ```
     * 
     * Or you can access the value directly via the `values` property, where it works like any other variable:
     * 
     * ```javascript
     * data.values.gold += 50;
     * ```
     *
     * When the value is first set, a `setdata` event is emitted.
     *
     * If the key already exists, a `changedata` event is emitted instead, along an event named after the key.
     * For example, if you updated an existing key called `PlayerLives` then it would emit the event `changedata_PlayerLives`.
     * These events will be emitted regardless if you use this method to set the value, or the direct `values` setter.
     *
     * Please note that the data keys are case-sensitive and must be valid JavaScript Object property strings.
     * This means the keys `gold` and `Gold` are treated as two unique values within the Data Manager.
     *
     * @method Phaser.Data.DataManager#set
     * @since 3.0.0
     *
     * @param {(string|object)} key - The key to set the value for. Or an object or key value pairs. If an object the `data` argument is ignored.
     * @param {*} data - The value to set for the given key. If an object is provided as the key this argument is ignored.
     *
     * @return {Phaser.Data.DataManager} This DataManager object.
     */
    set: function (key, data)
    {
        if (this._frozen)
        {
            return this;
        }

        if (typeof key === 'string')
        {
            return this.setValue(key, data);
        }
        else
        {
            for (var entry in key)
            {
                this.setValue(entry, key[entry]);
            }
        }

        return this;
    },

    /**
     * Internal value setter, called automatically by the `set` method.
     *
     * @method Phaser.Data.DataManager#setValue
     * @private
     * @since 3.10.0
     *
     * @param {string} key - The key to set the value for.
     * @param {*} data - The value to set.
     *
     * @return {Phaser.Data.DataManager} This DataManager object.
     */
    setValue: function (key, data)
    {
        if (this._frozen)
        {
            return this;
        }

        if (this.has(key))
        {
            //  Hit the key getter, which will in turn emit the events.
            this.values[key] = data;
        }
        else
        {
            var _this = this;
            var list = this.list;
            var events = this.events;
            var parent = this.parent;

            Object.defineProperty(this.values, key, {

                enumerable: true,
                
                configurable: true,

                get: function ()
                {
                    return list[key];
                },

                set: function (value)
                {
                    if (!_this._frozen)
                    {
                        var previousValue = list[key];
                        list[key] = value;

                        events.emit('changedata', parent, key, value, previousValue);
                        events.emit('changedata_' + key, parent, value, previousValue);
                    }
                }

            });

            list[key] = data;

            events.emit('setdata', parent, key, data);
        }

        return this;
    },

    /**
     * Passes all data entries to the given callback.
     *
     * @method Phaser.Data.DataManager#each
     * @since 3.0.0
     *
     * @param {DataEachCallback} callback - The function to call.
     * @param {*} [context] - Value to use as `this` when executing callback.
     * @param {...*} [args] - Additional arguments that will be passed to the callback, after the game object, key, and data.
     *
     * @return {Phaser.Data.DataManager} This DataManager object.
     */
    each: function (callback, context)
    {
        var args = [ this.parent, null, undefined ];

        for (var i = 1; i < arguments.length; i++)
        {
            args.push(arguments[i]);
        }

        for (var key in this.list)
        {
            args[1] = key;
            args[2] = this.list[key];

            callback.apply(context, args);
        }

        return this;
    },

    /**
     * Merge the given object of key value pairs into this DataManager.
     *
     * Any newly created values will emit a `setdata` event. Any updated values (see the `overwrite` argument)
     * will emit a `changedata` event.
     *
     * @method Phaser.Data.DataManager#merge
     * @since 3.0.0
     *
     * @param {Object.<string, *>} data - The data to merge.
     * @param {boolean} [overwrite=true] - Whether to overwrite existing data. Defaults to true.
     *
     * @return {Phaser.Data.DataManager} This DataManager object.
     */
    merge: function (data, overwrite)
    {
        if (overwrite === undefined) { overwrite = true; }

        //  Merge data from another component into this one
        for (var key in data)
        {
            if (data.hasOwnProperty(key) && (overwrite || (!overwrite && !this.has(key))))
            {
                this.setValue(key, data[key]);
            }
        }

        return this;
    },

    /**
     * Remove the value for the given key.
     *
     * If the key is found in this Data Manager it is removed from the internal lists and a
     * `removedata` event is emitted.
     * 
     * You can also pass in an array of keys, in which case all keys in the array will be removed:
     * 
     * ```javascript
     * this.data.remove([ 'gold', 'armor', 'health' ]);
     * ```
     *
     * @method Phaser.Data.DataManager#remove
     * @since 3.0.0
     *
     * @param {(string|string[])} key - The key to remove, or an array of keys to remove.
     *
     * @return {Phaser.Data.DataManager} This DataManager object.
     */
    remove: function (key)
    {
        if (this._frozen)
        {
            return this;
        }

        if (Array.isArray(key))
        {
            for (var i = 0; i < key.length; i++)
            {
                this.removeValue(key[i]);
            }
        }
        else
        {
            return this.removeValue(key);
        }

        return this;
    },

    /**
     * Internal value remover, called automatically by the `remove` method.
     *
     * @method Phaser.Data.DataManager#removeValue
     * @private
     * @since 3.10.0
     *
     * @param {string} key - The key to set the value for.
     *
     * @return {Phaser.Data.DataManager} This DataManager object.
     */
    removeValue: function (key)
    {
        if (this.has(key))
        {
            var data = this.list[key];

            delete this.list[key];
            delete this.values[key];

            this.events.emit('removedata', this.parent, key, data);
        }

        return this;
    },

    /**
     * Retrieves the data associated with the given 'key', deletes it from this Data Manager, then returns it.
     *
     * @method Phaser.Data.DataManager#pop
     * @since 3.0.0
     *
     * @param {string} key - The key of the value to retrieve and delete.
     *
     * @return {*} The value of the given key.
     */
    pop: function (key)
    {
        var data = undefined;

        if (!this._frozen && this.has(key))
        {
            data = this.list[key];

            delete this.list[key];
            delete this.values[key];

            this.events.emit('removedata', this, key, data);
        }

        return data;
    },

    /**
     * Determines whether the given key is set in this Data Manager.
     * 
     * Please note that the keys are case-sensitive and must be valid JavaScript Object property strings.
     * This means the keys `gold` and `Gold` are treated as two unique values within the Data Manager.
     *
     * @method Phaser.Data.DataManager#has
     * @since 3.0.0
     *
     * @param {string} key - The key to check.
     *
     * @return {boolean} Returns `true` if the key exists, otherwise `false`.
     */
    has: function (key)
    {
        return this.list.hasOwnProperty(key);
    },

    /**
     * Freeze or unfreeze this Data Manager. A frozen Data Manager will block all attempts
     * to create new values or update existing ones.
     *
     * @method Phaser.Data.DataManager#setFreeze
     * @since 3.0.0
     *
     * @param {boolean} value - Whether to freeze or unfreeze the Data Manager.
     *
     * @return {Phaser.Data.DataManager} This DataManager object.
     */
    setFreeze: function (value)
    {
        this._frozen = value;

        return this;
    },

    /**
     * Delete all data in this Data Manager and unfreeze it.
     *
     * @method Phaser.Data.DataManager#reset
     * @since 3.0.0
     *
     * @return {Phaser.Data.DataManager} This DataManager object.
     */
    reset: function ()
    {
        for (var key in this.list)
        {
            delete this.list[key];
            delete this.values[key];
        }

        this._frozen = false;

        return this;
    },

    /**
     * Destroy this data manager.
     *
     * @method Phaser.Data.DataManager#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.reset();

        this.events.off('changedata');
        this.events.off('setdata');
        this.events.off('removedata');

        this.parent = null;
    },

    /**
     * Gets or sets the frozen state of this Data Manager.
     * A frozen Data Manager will block all attempts to create new values or update existing ones.
     *
     * @name Phaser.Data.DataManager#freeze
     * @type {boolean}
     * @since 3.0.0
     */
    freeze: {

        get: function ()
        {
            return this._frozen;
        },

        set: function (value)
        {
            this._frozen = (value) ? true : false;
        }

    },

    /**
     * Return the total number of entries in this Data Manager.
     *
     * @name Phaser.Data.DataManager#count
     * @type {integer}
     * @since 3.0.0
     */
    count: {

        get: function ()
        {
            var i = 0;

            for (var key in this.list)
            {
                if (this.list[key] !== undefined)
                {
                    i++;
                }
            }

            return i;
        }

    }

});

module.exports = DataManager;


/***/ }),
/* 28 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

//  bitmask flag for GameObject.renderMask
var _FLAG = 1; // 0001

/**
 * Provides methods used for setting the visibility of a Game Object.
 * Should be applied as a mixin and not used directly.
 * 
 * @name Phaser.GameObjects.Components.Visible
 * @since 3.0.0
 */

var Visible = {

    /**
     * Private internal value. Holds the visible value.
     * 
     * @name Phaser.GameObjects.Components.Visible#_visible
     * @type {boolean}
     * @private
     * @default true
     * @since 3.0.0
     */
    _visible: true,

    /**
     * The visible state of the Game Object.
     * 
     * An invisible Game Object will skip rendering, but will still process update logic.
     * 
     * @name Phaser.GameObjects.Components.Visible#visible
     * @type {boolean}
     * @since 3.0.0
     */
    visible: {

        get: function ()
        {
            return this._visible;
        },

        set: function (value)
        {
            if (value)
            {
                this._visible = true;
                this.renderFlags |= _FLAG;
            }
            else
            {
                this._visible = false;
                this.renderFlags &= ~_FLAG;
            }
        }

    },

    /**
     * Sets the visibility of this Game Object.
     * 
     * An invisible Game Object will skip rendering, but will still process update logic.
     *
     * @method Phaser.GameObjects.Components.Visible#setVisible
     * @since 3.0.0
     *
     * @param {boolean} value - The visible state of the Game Object.
     * 
     * @return {this} This Game Object instance.
     */
    setVisible: function (value)
    {
        this.visible = value;

        return this;
    }
};

module.exports = Visible;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Wrap = __webpack_require__(7);

/**
 * Wrap an angle in degrees.
 *
 * Wraps the angle to a value in the range of -180 to 180.
 *
 * @function Phaser.Math.Angle.WrapDegrees
 * @since 3.0.0
 *
 * @param {number} angle - The angle to wrap, in degrees.
 *
 * @return {number} The wrapped angle, in degrees.
 */
var WrapDegrees = function (angle)
{
    return Wrap(angle, -180, 180);
};

module.exports = WrapDegrees;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var MathWrap = __webpack_require__(7);

/**
 * Wrap an angle.
 *
 * Wraps the angle to a value in the range of -PI to PI.
 *
 * @function Phaser.Math.Angle.Wrap
 * @since 3.0.0
 *
 * @param {number} angle - The angle to wrap, in radians.
 *
 * @return {number} The wrapped angle, in radians.
 */
var Wrap = function (angle)
{
    return MathWrap(angle, -Math.PI, Math.PI);
};

module.exports = Wrap;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var MATH_CONST = __webpack_require__(17);
var TransformMatrix = __webpack_require__(8);
var WrapAngle = __webpack_require__(30);
var WrapAngleDegrees = __webpack_require__(29);

//  global bitmask flag for GameObject.renderMask (used by Scale)
var _FLAG = 4; // 0100

/**
 * Provides methods used for getting and setting the position, scale and rotation of a Game Object.
 *
 * @name Phaser.GameObjects.Components.Transform
 * @since 3.0.0
 */

var Transform = {

    /**
     * Private internal value. Holds the horizontal scale value.
     * 
     * @name Phaser.GameObjects.Components.Transform#_scaleX
     * @type {number}
     * @private
     * @default 1
     * @since 3.0.0
     */
    _scaleX: 1,

    /**
     * Private internal value. Holds the vertical scale value.
     * 
     * @name Phaser.GameObjects.Components.Transform#_scaleY
     * @type {number}
     * @private
     * @default 1
     * @since 3.0.0
     */
    _scaleY: 1,

    /**
     * Private internal value. Holds the rotation value in radians.
     * 
     * @name Phaser.GameObjects.Components.Transform#_rotation
     * @type {number}
     * @private
     * @default 0
     * @since 3.0.0
     */
    _rotation: 0,

    /**
     * The x position of this Game Object.
     *
     * @name Phaser.GameObjects.Components.Transform#x
     * @type {number}
     * @default 0
     * @since 3.0.0
     */
    x: 0,

    /**
     * The y position of this Game Object.
     *
     * @name Phaser.GameObjects.Components.Transform#y
     * @type {number}
     * @default 0
     * @since 3.0.0
     */
    y: 0,

    /**
     * The z position of this Game Object.
     * Note: Do not use this value to set the z-index, instead see the `depth` property.
     *
     * @name Phaser.GameObjects.Components.Transform#z
     * @type {number}
     * @default 0
     * @since 3.0.0
     */
    z: 0,

    /**
     * The w position of this Game Object.
     *
     * @name Phaser.GameObjects.Components.Transform#w
     * @type {number}
     * @default 0
     * @since 3.0.0
     */
    w: 0,

    /**
     * The horizontal scale of this Game Object.
     *
     * @name Phaser.GameObjects.Components.Transform#scaleX
     * @type {number}
     * @default 1
     * @since 3.0.0
     */
    scaleX: {

        get: function ()
        {
            return this._scaleX;
        },

        set: function (value)
        {
            this._scaleX = value;

            if (this._scaleX === 0)
            {
                this.renderFlags &= ~_FLAG;
            }
            else
            {
                this.renderFlags |= _FLAG;
            }
        }

    },

    /**
     * The vertical scale of this Game Object.
     *
     * @name Phaser.GameObjects.Components.Transform#scaleY
     * @type {number}
     * @default 1
     * @since 3.0.0
     */
    scaleY: {

        get: function ()
        {
            return this._scaleY;
        },

        set: function (value)
        {
            this._scaleY = value;

            if (this._scaleY === 0)
            {
                this.renderFlags &= ~_FLAG;
            }
            else
            {
                this.renderFlags |= _FLAG;
            }
        }

    },

    /**
     * The angle of this Game Object as expressed in degrees.
     *
     * Where 0 is to the right, 90 is down, 180 is left.
     *
     * If you prefer to work in radians, see the `rotation` property instead.
     *
     * @name Phaser.GameObjects.Components.Transform#angle
     * @type {integer}
     * @default 0
     * @since 3.0.0
     */
    angle: {

        get: function ()
        {
            return WrapAngleDegrees(this._rotation * MATH_CONST.RAD_TO_DEG);
        },

        set: function (value)
        {
            //  value is in degrees
            this.rotation = WrapAngleDegrees(value) * MATH_CONST.DEG_TO_RAD;
        }
    },

    /**
     * The angle of this Game Object in radians.
     *
     * If you prefer to work in degrees, see the `angle` property instead.
     *
     * @name Phaser.GameObjects.Components.Transform#rotation
     * @type {number}
     * @default 1
     * @since 3.0.0
     */
    rotation: {

        get: function ()
        {
            return this._rotation;
        },

        set: function (value)
        {
            //  value is in radians
            this._rotation = WrapAngle(value);
        }
    },

    /**
     * Sets the position of this Game Object.
     *
     * @method Phaser.GameObjects.Components.Transform#setPosition
     * @since 3.0.0
     *
     * @param {number} [x=0] - The x position of this Game Object.
     * @param {number} [y=x] - The y position of this Game Object. If not set it will use the `x` value.
     * @param {number} [z=0] - The z position of this Game Object.
     * @param {number} [w=0] - The w position of this Game Object.
     *
     * @return {this} This Game Object instance.
     */
    setPosition: function (x, y, z, w)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = x; }
        if (z === undefined) { z = 0; }
        if (w === undefined) { w = 0; }

        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;

        return this;
    },

    /**
     * Sets the position of this Game Object to be a random position within the confines of
     * the given area.
     * 
     * If no area is specified a random position between 0 x 0 and the game width x height is used instead.
     *
     * The position does not factor in the size of this Game Object, meaning that only the origin is
     * guaranteed to be within the area.
     *
     * @method Phaser.GameObjects.Components.Transform#setRandomPosition
     * @since 3.8.0
     *
     * @param {number} [x=0] - The x position of the top-left of the random area.
     * @param {number} [y=0] - The y position of the top-left of the random area.
     * @param {number} [width] - The width of the random area.
     * @param {number} [height] - The height of the random area.
     *
     * @return {this} This Game Object instance.
     */
    setRandomPosition: function (x, y, width, height)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (width === undefined) { width = this.scene.sys.game.config.width; }
        if (height === undefined) { height = this.scene.sys.game.config.height; }

        this.x = x + (Math.random() * width);
        this.y = y + (Math.random() * height);

        return this;
    },

    /**
     * Sets the rotation of this Game Object.
     *
     * @method Phaser.GameObjects.Components.Transform#setRotation
     * @since 3.0.0
     *
     * @param {number} [radians=0] - The rotation of this Game Object, in radians.
     *
     * @return {this} This Game Object instance.
     */
    setRotation: function (radians)
    {
        if (radians === undefined) { radians = 0; }

        this.rotation = radians;

        return this;
    },

    /**
     * Sets the angle of this Game Object.
     *
     * @method Phaser.GameObjects.Components.Transform#setAngle
     * @since 3.0.0
     *
     * @param {number} [degrees=0] - The rotation of this Game Object, in degrees.
     *
     * @return {this} This Game Object instance.
     */
    setAngle: function (degrees)
    {
        if (degrees === undefined) { degrees = 0; }

        this.angle = degrees;

        return this;
    },

    /**
     * Sets the scale of this Game Object.
     *
     * @method Phaser.GameObjects.Components.Transform#setScale
     * @since 3.0.0
     *
     * @param {number} x - The horizontal scale of this Game Object.
     * @param {number} [y=x] - The vertical scale of this Game Object. If not set it will use the `x` value.
     *
     * @return {this} This Game Object instance.
     */
    setScale: function (x, y)
    {
        if (x === undefined) { x = 1; }
        if (y === undefined) { y = x; }

        this.scaleX = x;
        this.scaleY = y;

        return this;
    },

    /**
     * Sets the x position of this Game Object.
     *
     * @method Phaser.GameObjects.Components.Transform#setX
     * @since 3.0.0
     *
     * @param {number} [value=0] - The x position of this Game Object.
     *
     * @return {this} This Game Object instance.
     */
    setX: function (value)
    {
        if (value === undefined) { value = 0; }

        this.x = value;

        return this;
    },

    /**
     * Sets the y position of this Game Object.
     *
     * @method Phaser.GameObjects.Components.Transform#setY
     * @since 3.0.0
     *
     * @param {number} [value=0] - The y position of this Game Object.
     *
     * @return {this} This Game Object instance.
     */
    setY: function (value)
    {
        if (value === undefined) { value = 0; }

        this.y = value;

        return this;
    },

    /**
     * Sets the z position of this Game Object.
     *
     * @method Phaser.GameObjects.Components.Transform#setZ
     * @since 3.0.0
     *
     * @param {number} [value=0] - The z position of this Game Object.
     *
     * @return {this} This Game Object instance.
     */
    setZ: function (value)
    {
        if (value === undefined) { value = 0; }

        this.z = value;

        return this;
    },

    /**
     * Sets the w position of this Game Object.
     *
     * @method Phaser.GameObjects.Components.Transform#setW
     * @since 3.0.0
     *
     * @param {number} [value=0] - The w position of this Game Object.
     *
     * @return {this} This Game Object instance.
     */
    setW: function (value)
    {
        if (value === undefined) { value = 0; }

        this.w = value;

        return this;
    },

    /**
     * Gets the local transform matrix for this Game Object.
     *
     * @method Phaser.GameObjects.Components.Transform#getLocalTransformMatrix
     * @since 3.4.0
     *
     * @param {Phaser.GameObjects.Components.TransformMatrix} [tempMatrix] - The matrix to populate with the values from this Game Object.
     *
     * @return {Phaser.GameObjects.Components.TransformMatrix} The populated Transform Matrix.
     */
    getLocalTransformMatrix: function (tempMatrix)
    {
        if (tempMatrix === undefined) { tempMatrix = new TransformMatrix(); }

        return tempMatrix.applyITRS(this.x, this.y, this._rotation, this._scaleX, this._scaleY);
    },

    /**
     * Gets the world transform matrix for this Game Object, factoring in any parent Containers.
     *
     * @method Phaser.GameObjects.Components.Transform#getWorldTransformMatrix
     * @since 3.4.0
     *
     * @param {Phaser.GameObjects.Components.TransformMatrix} [tempMatrix] - The matrix to populate with the values from this Game Object.
     *
     * @return {Phaser.GameObjects.Components.TransformMatrix} The populated Transform Matrix.
     */
    getWorldTransformMatrix: function (tempMatrix)
    {
        if (tempMatrix === undefined) { tempMatrix = new TransformMatrix(); }

        var parent = this.parentContainer;

        if (!parent)
        {
            return this.getLocalTransformMatrix(tempMatrix);
        }

        var parents = [];
        
        while (parent)
        {
            parents.unshift(parent);
            parent = parent.parentContainer;
        }

        tempMatrix.loadIdentity();

        var length = parents.length;
        
        for (var i = 0; i < length; ++i)
        {
            parent = parents[i];

            tempMatrix.translate(parent.x, parent.y);
            tempMatrix.rotate(parent.rotation);
            tempMatrix.scale(parent.scaleX, parent.scaleY);
        }

        tempMatrix.translate(this.x, this.y);
        tempMatrix.rotate(this._rotation);
        tempMatrix.scale(this._scaleX, this._scaleY);

        return tempMatrix;
    }

};

module.exports = Transform;


/***/ }),
/* 32 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * @typedef {object} JSONGameObject
 *
 * @property {string} name - The name of this Game Object.
 * @property {string} type - A textual representation of this Game Object, i.e. `sprite`.
 * @property {number} x - The x position of this Game Object.
 * @property {number} y - The y position of this Game Object.
 * @property {object} scale - The scale of this Game Object
 * @property {number} scale.x - The horizontal scale of this Game Object.
 * @property {number} scale.y - The vertical scale of this Game Object.
 * @property {object} origin - The origin of this Game Object.
 * @property {number} origin.x - The horizontal origin of this Game Object.
 * @property {number} origin.y - The vertical origin of this Game Object.
 * @property {boolean} flipX - The horizontally flipped state of the Game Object.
 * @property {boolean} flipY - The vertically flipped state of the Game Object.
 * @property {number} rotation - The angle of this Game Object in radians.
 * @property {number} alpha - The alpha value of the Game Object.
 * @property {boolean} visible - The visible state of the Game Object.
 * @property {integer} scaleMode - The Scale Mode being used by this Game Object.
 * @property {(integer|string)} blendMode - Sets the Blend Mode being used by this Game Object.
 * @property {string} textureKey - The texture key of this Game Object.
 * @property {string} frameKey - The frame key of this Game Object.
 * @property {object} data - The data of this Game Object.
 */

/**
 * Build a JSON representation of the given Game Object.
 *
 * This is typically extended further by Game Object specific implementations.
 *
 * @method Phaser.GameObjects.Components.ToJSON
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object to export as JSON.
 *
 * @return {JSONGameObject} A JSON representation of the Game Object.
 */
var ToJSON = function (gameObject)
{
    var out = {
        name: gameObject.name,
        type: gameObject.type,
        x: gameObject.x,
        y: gameObject.y,
        depth: gameObject.depth,
        scale: {
            x: gameObject.scaleX,
            y: gameObject.scaleY
        },
        origin: {
            x: gameObject.originX,
            y: gameObject.originY
        },
        flipX: gameObject.flipX,
        flipY: gameObject.flipY,
        rotation: gameObject.rotation,
        alpha: gameObject.alpha,
        visible: gameObject.visible,
        scaleMode: gameObject.scaleMode,
        blendMode: gameObject.blendMode,
        textureKey: '',
        frameKey: '',
        data: {}
    };

    if (gameObject.texture)
    {
        out.textureKey = gameObject.texture.key;
        out.frameKey = gameObject.frame.name;
    }

    return out;
};

module.exports = ToJSON;


/***/ }),
/* 33 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * @function GetColor
 * @since 3.0.0
 * @private
 */
var GetColor = function (value)
{
    return (value >> 16) + (value & 0xff00) + ((value & 0xff) << 16);
};

/**
 * Provides methods used for setting the tint of a Game Object.
 * Should be applied as a mixin and not used directly.
 * 
 * @name Phaser.GameObjects.Components.Tint
 * @webglOnly
 * @since 3.0.0
 */

var Tint = {

    /**
     * Private internal value. Holds the top-left tint value.
     * 
     * @name Phaser.GameObjects.Components.Tint#_tintTL
     * @type {number}
     * @private
     * @default 16777215
     * @since 3.0.0
     */
    _tintTL: 16777215,

    /**
     * Private internal value. Holds the top-right tint value.
     * 
     * @name Phaser.GameObjects.Components.Tint#_tintTR
     * @type {number}
     * @private
     * @default 16777215
     * @since 3.0.0
     */
    _tintTR: 16777215,

    /**
     * Private internal value. Holds the bottom-left tint value.
     * 
     * @name Phaser.GameObjects.Components.Tint#_tintBL
     * @type {number}
     * @private
     * @default 16777215
     * @since 3.0.0
     */
    _tintBL: 16777215,

    /**
     * Private internal value. Holds the bottom-right tint value.
     * 
     * @name Phaser.GameObjects.Components.Tint#_tintBR
     * @type {number}
     * @private
     * @default 16777215
     * @since 3.0.0
     */
    _tintBR: 16777215,

    /**
     * Private internal value. Holds if the Game Object is tinted or not.
     * 
     * @name Phaser.GameObjects.Components.Tint#_isTinted
     * @type {boolean}
     * @private
     * @default false
     * @since 3.11.0
     */
    _isTinted: false,

    /**
     * Fill or additive?
     * 
     * @name Phaser.GameObjects.Components.Tint#tintFill
     * @type {boolean}
     * @default false
     * @since 3.11.0
     */
    tintFill: false,

    /**
     * Clears all tint values associated with this Game Object.
     * 
     * Immediately sets the color values back to 0xffffff and the tint type to 'additive',
     * which results in no visible change to the texture.
     *
     * @method Phaser.GameObjects.Components.Tint#clearTint
     * @webglOnly
     * @since 3.0.0
     * 
     * @return {this} This Game Object instance.
     */
    clearTint: function ()
    {
        this.setTint(0xffffff);

        this._isTinted = false;

        return this;
    },

    /**
     * Sets an additive tint on this Game Object.
     * 
     * The tint works by taking the pixel color values from the Game Objects texture, and then
     * multiplying it by the color value of the tint. You can provide either one color value,
     * in which case the whole Game Object will be tinted in that color. Or you can provide a color
     * per corner. The colors are blended together across the extent of the Game Object.
     * 
     * To modify the tint color once set, either call this method again with new values or use the
     * `tint` property to set all colors at once. Or, use the properties `tintTopLeft`, `tintTopRight,
     * `tintBottomLeft` and `tintBottomRight` to set the corner color values independently.
     * 
     * To remove a tint call `clearTint`.
     * 
     * To swap this from being an additive tint to a fill based tint set the property `tintFill` to `true`.
     *
     * @method Phaser.GameObjects.Components.Tint#setTint
     * @webglOnly
     * @since 3.0.0
     *
     * @param {integer} [topLeft=0xffffff] - The tint being applied to the top-left of the Game Object. If no other values are given this value is applied evenly, tinting the whole Game Object.
     * @param {integer} [topRight] - The tint being applied to the top-right of the Game Object.
     * @param {integer} [bottomLeft] - The tint being applied to the bottom-left of the Game Object.
     * @param {integer} [bottomRight] - The tint being applied to the bottom-right of the Game Object.
     * 
     * @return {this} This Game Object instance.
     */
    setTint: function (topLeft, topRight, bottomLeft, bottomRight)
    {
        if (topLeft === undefined) { topLeft = 0xffffff; }

        if (topRight === undefined)
        {
            topRight = topLeft;
            bottomLeft = topLeft;
            bottomRight = topLeft;
        }

        this._tintTL = GetColor(topLeft);
        this._tintTR = GetColor(topRight);
        this._tintBL = GetColor(bottomLeft);
        this._tintBR = GetColor(bottomRight);

        this._isTinted = true;

        this.tintFill = false;

        return this;
    },

    /**
     * Sets a fill-based tint on this Game Object.
     * 
     * Unlike an additive tint, a fill-tint literally replaces the pixel colors from the texture
     * with those in the tint. You can use this for effects such as making a player flash 'white'
     * if hit by something. You can provide either one color value, in which case the whole
     * Game Object will be rendered in that color. Or you can provide a color per corner. The colors
     * are blended together across the extent of the Game Object.
     * 
     * To modify the tint color once set, either call this method again with new values or use the
     * `tint` property to set all colors at once. Or, use the properties `tintTopLeft`, `tintTopRight,
     * `tintBottomLeft` and `tintBottomRight` to set the corner color values independently.
     * 
     * To remove a tint call `clearTint`.
     * 
     * To swap this from being a fill-tint to an additive tint set the property `tintFill` to `false`.
     *
     * @method Phaser.GameObjects.Components.Tint#setTintFill
     * @webglOnly
     * @since 3.11.0
     *
     * @param {integer} [topLeft=0xffffff] - The tint being applied to the top-left of the Game Object. If not other values are given this value is applied evenly, tinting the whole Game Object.
     * @param {integer} [topRight] - The tint being applied to the top-right of the Game Object.
     * @param {integer} [bottomLeft] - The tint being applied to the bottom-left of the Game Object.
     * @param {integer} [bottomRight] - The tint being applied to the bottom-right of the Game Object.
     * 
     * @return {this} This Game Object instance.
     */
    setTintFill: function (topLeft, topRight, bottomLeft, bottomRight)
    {
        this.setTint(topLeft, topRight, bottomLeft, bottomRight);

        this.tintFill = true;

        return this;
    },

    /**
     * The tint value being applied to the top-left of the Game Object.
     * This value is interpolated from the corner to the center of the Game Object.
     * 
     * @name Phaser.GameObjects.Components.Tint#tintTopLeft
     * @type {integer}
     * @webglOnly
     * @since 3.0.0
     */
    tintTopLeft: {

        get: function ()
        {
            return this._tintTL;
        },

        set: function (value)
        {
            this._tintTL = GetColor(value);
            this._isTinted = true;
        }

    },

    /**
     * The tint value being applied to the top-right of the Game Object.
     * This value is interpolated from the corner to the center of the Game Object.
     * 
     * @name Phaser.GameObjects.Components.Tint#tintTopRight
     * @type {integer}
     * @webglOnly
     * @since 3.0.0
     */
    tintTopRight: {

        get: function ()
        {
            return this._tintTR;
        },

        set: function (value)
        {
            this._tintTR = GetColor(value);
            this._isTinted = true;
        }

    },

    /**
     * The tint value being applied to the bottom-left of the Game Object.
     * This value is interpolated from the corner to the center of the Game Object.
     * 
     * @name Phaser.GameObjects.Components.Tint#tintBottomLeft
     * @type {integer}
     * @webglOnly
     * @since 3.0.0
     */
    tintBottomLeft: {

        get: function ()
        {
            return this._tintBL;
        },

        set: function (value)
        {
            this._tintBL = GetColor(value);
            this._isTinted = true;
        }

    },

    /**
     * The tint value being applied to the bottom-right of the Game Object.
     * This value is interpolated from the corner to the center of the Game Object.
     * 
     * @name Phaser.GameObjects.Components.Tint#tintBottomRight
     * @type {integer}
     * @webglOnly
     * @since 3.0.0
     */
    tintBottomRight: {

        get: function ()
        {
            return this._tintBR;
        },

        set: function (value)
        {
            this._tintBR = GetColor(value);
            this._isTinted = true;
        }

    },

    /**
     * The tint value being applied to the whole of the Game Object.
     * 
     * @name Phaser.GameObjects.Components.Tint#tint
     * @type {integer}
     * @webglOnly
     * @since 3.0.0
     */
    tint: {

        set: function (value)
        {
            this.setTint(value, value, value, value);
        }
    },

    /**
     * Does this Game Object have a tint applied to it or not?
     * 
     * @name Phaser.GameObjects.Components.Tint#isTinted
     * @type {boolean}
     * @webglOnly
     * @readOnly
     * @since 3.11.0
     */
    isTinted: {

        get: function ()
        {
            return this._isTinted;
        }

    }

};

module.exports = Tint;


/***/ }),
/* 34 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

//  bitmask flag for GameObject.renderMask
var _FLAG = 8; // 1000

/**
 * Provides methods used for getting and setting the texture of a Game Object.
 *
 * @name Phaser.GameObjects.Components.TextureCrop
 * @since 3.0.0
 */

var TextureCrop = {

    /**
     * The Texture this Game Object is using to render with.
     *
     * @name Phaser.GameObjects.Components.TextureCrop#texture
     * @type {Phaser.Textures.Texture|Phaser.Textures.CanvasTexture}
     * @since 3.0.0
     */
    texture: null,

    /**
     * The Texture Frame this Game Object is using to render with.
     *
     * @name Phaser.GameObjects.Components.TextureCrop#frame
     * @type {Phaser.Textures.Frame}
     * @since 3.0.0
     */
    frame: null,

    /**
     * A boolean flag indicating if this Game Object is being cropped or not.
     * You can toggle this at any time after `setCrop` has been called, to turn cropping on or off.
     * Equally, calling `setCrop` with no arguments will reset the crop and disable it.
     *
     * @name Phaser.GameObjects.Components.TextureCrop#isCropped
     * @type {boolean}
     * @since 3.11.0
     */
    isCropped: false,

    /**
     * Applies a crop to a texture based Game Object, such as a Sprite or Image.
     * 
     * The crop is a rectangle that limits the area of the texture frame that is visible during rendering.
     * 
     * Cropping a Game Object does not change its size, dimensions, physics body or hit area, it just
     * changes what is shown when rendered.
     * 
     * The crop coordinates are relative to the texture frame, not the Game Object, meaning 0 x 0 is the top-left.
     * 
     * Therefore, if you had a Game Object that had an 800x600 sized texture, and you wanted to show only the left
     * half of it, you could call `setCrop(0, 0, 400, 600)`.
     * 
     * It is also scaled to match the Game Object scale automatically. Therefore a crop rect of 100x50 would crop
     * an area of 200x100 when applied to a Game Object that had a scale factor of 2.
     * 
     * You can either pass in numeric values directly, or you can provide a single Rectangle object as the first argument.
     * 
     * Call this method with no arguments at all to reset the crop, or toggle the property `isCropped` to `false`.
     * 
     * You should do this if the crop rectangle becomes the same size as the frame itself, as it will allow
     * the renderer to skip several internal calculations.
     *
     * @method Phaser.GameObjects.Components.TextureCrop#setCrop
     * @since 3.11.0
     *
     * @param {(number|Phaser.Geom.Rectangle)} [x] - The x coordinate to start the crop from. Or a Phaser.Geom.Rectangle object, in which case the rest of the arguments are ignored.
     * @param {number} [y] - The y coordinate to start the crop from.
     * @param {number} [width] - The width of the crop rectangle in pixels.
     * @param {number} [height] - The height of the crop rectangle in pixels.
     *
     * @return {this} This Game Object instance.
     */
    setCrop: function (x, y, width, height)
    {
        if (x === undefined)
        {
            this.isCropped = false;
        }
        else if (this.frame)
        {
            if (typeof x === 'number')
            {
                this.frame.setCropUVs(this._crop, x, y, width, height, this.flipX, this.flipY);
            }
            else
            {
                var rect = x;

                this.frame.setCropUVs(this._crop, rect.x, rect.y, rect.width, rect.height, this.flipX, this.flipY);
            }

            this.isCropped = true;
        }

        return this;
    },

    /**
     * Sets the texture and frame this Game Object will use to render with.
     *
     * Textures are referenced by their string-based keys, as stored in the Texture Manager.
     *
     * @method Phaser.GameObjects.Components.TextureCrop#setTexture
     * @since 3.0.0
     *
     * @param {string} key - The key of the texture to be used, as stored in the Texture Manager.
     * @param {(string|integer)} [frame] - The name or index of the frame within the Texture.
     *
     * @return {this} This Game Object instance.
     */
    setTexture: function (key, frame)
    {
        this.texture = this.scene.sys.textures.get(key);

        return this.setFrame(frame);
    },

    /**
     * Sets the frame this Game Object will use to render with.
     *
     * The Frame has to belong to the current Texture being used.
     *
     * It can be either a string or an index.
     *
     * Calling `setFrame` will modify the `width` and `height` properties of your Game Object.
     * It will also change the `origin` if the Frame has a custom pivot point, as exported from packages like Texture Packer.
     *
     * @method Phaser.GameObjects.Components.TextureCrop#setFrame
     * @since 3.0.0
     *
     * @param {(string|integer)} frame - The name or index of the frame within the Texture.
     * @param {boolean} [updateSize=true] - Should this call adjust the size of the Game Object?
     * @param {boolean} [updateOrigin=true] - Should this call adjust the origin of the Game Object?
     *
     * @return {this} This Game Object instance.
     */
    setFrame: function (frame, updateSize, updateOrigin)
    {
        if (updateSize === undefined) { updateSize = true; }
        if (updateOrigin === undefined) { updateOrigin = true; }

        this.frame = this.texture.get(frame);

        if (!this.frame.cutWidth || !this.frame.cutHeight)
        {
            this.renderFlags &= ~_FLAG;
        }
        else
        {
            this.renderFlags |= _FLAG;
        }

        if (this._sizeComponent && updateSize)
        {
            this.setSizeToFrame();
        }

        if (this._originComponent && updateOrigin)
        {
            if (this.frame.customPivot)
            {
                this.setOrigin(this.frame.pivotX, this.frame.pivotY);
            }
            else
            {
                this.updateDisplayOrigin();
            }
        }

        if (this.isCropped)
        {
            this.frame.updateCropUVs(this._crop, this.flipX, this.flipY);
        }

        return this;
    },

    /**
     * Internal method that returns a blank, well-formed crop object for use by a Game Object.
     *
     * @method Phaser.GameObjects.Components.TextureCrop#resetCropObject
     * @private
     * @since 3.12.0
     * 
     * @return {object} The crop object.
     */
    resetCropObject: function ()
    {
        return { u0: 0, v0: 0, u1: 0, v1: 0, width: 0, height: 0, x: 0, y: 0, flipX: false, flipY: false, cx: 0, cy: 0, cw: 0, ch: 0 };
    }

};

module.exports = TextureCrop;


/***/ }),
/* 35 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

//  bitmask flag for GameObject.renderMask
var _FLAG = 8; // 1000

/**
 * Provides methods used for getting and setting the texture of a Game Object.
 *
 * @name Phaser.GameObjects.Components.Texture
 * @since 3.0.0
 */

var Texture = {

    /**
     * The Texture this Game Object is using to render with.
     *
     * @name Phaser.GameObjects.Components.Texture#texture
     * @type {Phaser.Textures.Texture|Phaser.Textures.CanvasTexture}
     * @since 3.0.0
     */
    texture: null,

    /**
     * The Texture Frame this Game Object is using to render with.
     *
     * @name Phaser.GameObjects.Components.Texture#frame
     * @type {Phaser.Textures.Frame}
     * @since 3.0.0
     */
    frame: null,

    /**
     * Internal flag. Not to be set by this Game Object.
     *
     * @name Phaser.GameObjects.Components.Texture#isCropped
     * @type {boolean}
     * @private
     * @since 3.11.0
     */
    isCropped: false,

    /**
     * Sets the texture and frame this Game Object will use to render with.
     *
     * Textures are referenced by their string-based keys, as stored in the Texture Manager.
     *
     * @method Phaser.GameObjects.Components.Texture#setTexture
     * @since 3.0.0
     *
     * @param {string} key - The key of the texture to be used, as stored in the Texture Manager.
     * @param {(string|integer)} [frame] - The name or index of the frame within the Texture.
     *
     * @return {this} This Game Object instance.
     */
    setTexture: function (key, frame)
    {
        this.texture = this.scene.sys.textures.get(key);

        return this.setFrame(frame);
    },

    /**
     * Sets the frame this Game Object will use to render with.
     *
     * The Frame has to belong to the current Texture being used.
     *
     * It can be either a string or an index.
     *
     * Calling `setFrame` will modify the `width` and `height` properties of your Game Object.
     * It will also change the `origin` if the Frame has a custom pivot point, as exported from packages like Texture Packer.
     *
     * @method Phaser.GameObjects.Components.Texture#setFrame
     * @since 3.0.0
     *
     * @param {(string|integer)} frame - The name or index of the frame within the Texture.
     * @param {boolean} [updateSize=true] - Should this call adjust the size of the Game Object?
     * @param {boolean} [updateOrigin=true] - Should this call adjust the origin of the Game Object?
     *
     * @return {this} This Game Object instance.
     */
    setFrame: function (frame, updateSize, updateOrigin)
    {
        if (updateSize === undefined) { updateSize = true; }
        if (updateOrigin === undefined) { updateOrigin = true; }

        this.frame = this.texture.get(frame);

        if (!this.frame.cutWidth || !this.frame.cutHeight)
        {
            this.renderFlags &= ~_FLAG;
        }
        else
        {
            this.renderFlags |= _FLAG;
        }

        if (this._sizeComponent && updateSize)
        {
            this.setSizeToFrame();
        }

        if (this._originComponent && updateOrigin)
        {
            if (this.frame.customPivot)
            {
                this.setOrigin(this.frame.pivotX, this.frame.pivotY);
            }
            else
            {
                this.updateDisplayOrigin();
            }
        }

        return this;
    }

};

module.exports = Texture;


/***/ }),
/* 36 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Provides methods used for getting and setting the size of a Game Object.
 * 
 * @name Phaser.GameObjects.Components.Size
 * @since 3.0.0
 */

var Size = {

    /**
     * A property indicating that a Game Object has this component.
     * 
     * @name Phaser.GameObjects.Components.Size#_sizeComponent
     * @type {boolean}
     * @private
     * @default true
     * @since 3.2.0
     */
    _sizeComponent: true,

    /**
     * The native (un-scaled) width of this Game Object.
     * 
     * Changing this value will not change the size that the Game Object is rendered in-game.
     * For that you need to either set the scale of the Game Object (`setScale`) or use
     * the `displayWidth` property.
     * 
     * @name Phaser.GameObjects.Components.Size#width
     * @type {number}
     * @since 3.0.0
     */
    width: 0,

    /**
     * The native (un-scaled) height of this Game Object.
     * 
     * Changing this value will not change the size that the Game Object is rendered in-game.
     * For that you need to either set the scale of the Game Object (`setScale`) or use
     * the `displayHeight` property.
     * 
     * @name Phaser.GameObjects.Components.Size#height
     * @type {number}
     * @since 3.0.0
     */
    height: 0,

    /**
     * The displayed width of this Game Object.
     * 
     * This value takes into account the scale factor.
     * 
     * Setting this value will adjust the Game Object's scale property.
     * 
     * @name Phaser.GameObjects.Components.Size#displayWidth
     * @type {number}
     * @since 3.0.0
     */
    displayWidth: {

        get: function ()
        {
            return this.scaleX * this.frame.realWidth;
        },

        set: function (value)
        {
            this.scaleX = value / this.frame.realWidth;
        }

    },

    /**
     * The displayed height of this Game Object.
     * 
     * This value takes into account the scale factor.
     * 
     * Setting this value will adjust the Game Object's scale property.
     * 
     * @name Phaser.GameObjects.Components.Size#displayHeight
     * @type {number}
     * @since 3.0.0
     */
    displayHeight: {

        get: function ()
        {
            return this.scaleY * this.frame.realHeight;
        },

        set: function (value)
        {
            this.scaleY = value / this.frame.realHeight;
        }

    },

    /**
     * Sets the size of this Game Object to be that of the given Frame.
     * 
     * This will not change the size that the Game Object is rendered in-game.
     * For that you need to either set the scale of the Game Object (`setScale`) or call the
     * `setDisplaySize` method, which is the same thing as changing the scale but allows you
     * to do so by giving pixel values.
     * 
     * If you have enabled this Game Object for input, changing the size will _not_ change the
     * size of the hit area. To do this you should adjust the `input.hitArea` object directly.
     * 
     * @method Phaser.GameObjects.Components.Size#setSizeToFrame
     * @since 3.0.0
     *
     * @param {Phaser.Textures.Frame} frame - The frame to base the size of this Game Object on.
     * 
     * @return {this} This Game Object instance.
     */
    setSizeToFrame: function (frame)
    {
        if (frame === undefined) { frame = this.frame; }

        this.width = frame.realWidth;
        this.height = frame.realHeight;

        return this;
    },

    /**
     * Sets the internal size of this Game Object, as used for frame or physics body creation.
     * 
     * This will not change the size that the Game Object is rendered in-game.
     * For that you need to either set the scale of the Game Object (`setScale`) or call the
     * `setDisplaySize` method, which is the same thing as changing the scale but allows you
     * to do so by giving pixel values.
     * 
     * If you have enabled this Game Object for input, changing the size will _not_ change the
     * size of the hit area. To do this you should adjust the `input.hitArea` object directly.
     * 
     * @method Phaser.GameObjects.Components.Size#setSize
     * @since 3.0.0
     *
     * @param {number} width - The width of this Game Object.
     * @param {number} height - The height of this Game Object.
     * 
     * @return {this} This Game Object instance.
     */
    setSize: function (width, height)
    {
        this.width = width;
        this.height = height;

        return this;
    },

    /**
     * Sets the display size of this Game Object.
     * 
     * Calling this will adjust the scale.
     * 
     * @method Phaser.GameObjects.Components.Size#setDisplaySize
     * @since 3.0.0
     *
     * @param {number} width - The width of this Game Object.
     * @param {number} height - The height of this Game Object.
     * 
     * @return {this} This Game Object instance.
     */
    setDisplaySize: function (width, height)
    {
        this.displayWidth = width;
        this.displayHeight = height;

        return this;
    }

};

module.exports = Size;


/***/ }),
/* 37 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Provides methods used for getting and setting the Scroll Factor of a Game Object.
 *
 * @name Phaser.GameObjects.Components.ScrollFactor
 * @since 3.0.0
 */

var ScrollFactor = {

    /**
     * The horizontal scroll factor of this Game Object.
     *
     * The scroll factor controls the influence of the movement of a Camera upon this Game Object.
     *
     * When a camera scrolls it will change the location at which this Game Object is rendered on-screen.
     * It does not change the Game Objects actual position values.
     *
     * A value of 1 means it will move exactly in sync with a camera.
     * A value of 0 means it will not move at all, even if the camera moves.
     * Other values control the degree to which the camera movement is mapped to this Game Object.
     * 
     * Please be aware that scroll factor values other than 1 are not taken in to consideration when
     * calculating physics collisions. Bodies always collide based on their world position, but changing
     * the scroll factor is a visual adjustment to where the textures are rendered, which can offset
     * them from physics bodies if not accounted for in your code.
     *
     * @name Phaser.GameObjects.Components.ScrollFactor#scrollFactorX
     * @type {number}
     * @default 1
     * @since 3.0.0
     */
    scrollFactorX: 1,

    /**
     * The vertical scroll factor of this Game Object.
     *
     * The scroll factor controls the influence of the movement of a Camera upon this Game Object.
     *
     * When a camera scrolls it will change the location at which this Game Object is rendered on-screen.
     * It does not change the Game Objects actual position values.
     *
     * A value of 1 means it will move exactly in sync with a camera.
     * A value of 0 means it will not move at all, even if the camera moves.
     * Other values control the degree to which the camera movement is mapped to this Game Object.
     * 
     * Please be aware that scroll factor values other than 1 are not taken in to consideration when
     * calculating physics collisions. Bodies always collide based on their world position, but changing
     * the scroll factor is a visual adjustment to where the textures are rendered, which can offset
     * them from physics bodies if not accounted for in your code.
     *
     * @name Phaser.GameObjects.Components.ScrollFactor#scrollFactorY
     * @type {number}
     * @default 1
     * @since 3.0.0
     */
    scrollFactorY: 1,

    /**
     * Sets the scroll factor of this Game Object.
     *
     * The scroll factor controls the influence of the movement of a Camera upon this Game Object.
     *
     * When a camera scrolls it will change the location at which this Game Object is rendered on-screen.
     * It does not change the Game Objects actual position values.
     *
     * A value of 1 means it will move exactly in sync with a camera.
     * A value of 0 means it will not move at all, even if the camera moves.
     * Other values control the degree to which the camera movement is mapped to this Game Object.
     * 
     * Please be aware that scroll factor values other than 1 are not taken in to consideration when
     * calculating physics collisions. Bodies always collide based on their world position, but changing
     * the scroll factor is a visual adjustment to where the textures are rendered, which can offset
     * them from physics bodies if not accounted for in your code.
     *
     * @method Phaser.GameObjects.Components.ScrollFactor#setScrollFactor
     * @since 3.0.0
     *
     * @param {number} x - The horizontal scroll factor of this Game Object.
     * @param {number} [y=x] - The vertical scroll factor of this Game Object. If not set it will use the `x` value.
     *
     * @return {this} This Game Object instance.
     */
    setScrollFactor: function (x, y)
    {
        if (y === undefined) { y = x; }

        this.scrollFactorX = x;
        this.scrollFactorY = y;

        return this;
    }

};

module.exports = ScrollFactor;


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var ScaleModes = __webpack_require__(16);

/**
 * Provides methods used for getting and setting the scale of a Game Object.
 *
 * @name Phaser.GameObjects.Components.ScaleMode
 * @since 3.0.0
 */

var ScaleMode = {

    _scaleMode: ScaleModes.DEFAULT,

    /**
     * The Scale Mode being used by this Game Object.
     * Can be either `ScaleModes.LINEAR` or `ScaleModes.NEAREST`.
     *
     * @name Phaser.GameObjects.Components.ScaleMode#scaleMode
     * @type {Phaser.ScaleModes}
     * @since 3.0.0
     */
    scaleMode: {

        get: function ()
        {
            return this._scaleMode;
        },

        set: function (value)
        {
            if (value === ScaleModes.LINEAR || value === ScaleModes.NEAREST)
            {
                this._scaleMode = value;
            }
        }

    },

    /**
     * Sets the Scale Mode being used by this Game Object.
     * Can be either `ScaleModes.LINEAR` or `ScaleModes.NEAREST`.
     *
     * @method Phaser.GameObjects.Components.ScaleMode#setScaleMode
     * @since 3.0.0
     *
     * @param {Phaser.ScaleModes} value - The Scale Mode to be used by this Game Object.
     *
     * @return {this} This Game Object instance.
     */
    setScaleMode: function (value)
    {
        this.scaleMode = value;

        return this;
    }

};

module.exports = ScaleMode;


/***/ }),
/* 39 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Provides methods used for setting the WebGL rendering pipeline of a Game Object.
 *
 * @name Phaser.GameObjects.Components.Pipeline
 * @webglOnly
 * @since 3.0.0
 */

var Pipeline = {

    /**
     * The initial WebGL pipeline of this Game Object.
     *
     * @name Phaser.GameObjects.Components.Pipeline#defaultPipeline
     * @type {Phaser.Renderer.WebGL.WebGLPipeline}
     * @default null
     * @webglOnly
     * @since 3.0.0
     */
    defaultPipeline: null,

    /**
     * The current WebGL pipeline of this Game Object.
     *
     * @name Phaser.GameObjects.Components.Pipeline#pipeline
     * @type {Phaser.Renderer.WebGL.WebGLPipeline}
     * @default null
     * @webglOnly
     * @since 3.0.0
     */
    pipeline: null,

    /**
     * Sets the initial WebGL Pipeline of this Game Object.
     * This should only be called during the instantiation of the Game Object.
     *
     * @method Phaser.GameObjects.Components.Pipeline#initPipeline
     * @webglOnly
     * @since 3.0.0
     *
     * @param {string} pipelineName - The name of the pipeline to set on this Game Object.
     *
     * @return {boolean} `true` if the pipeline was set successfully, otherwise `false`.
     */
    initPipeline: function (pipelineName)
    {
        var renderer = this.scene.sys.game.renderer;

        if (renderer && renderer.gl && renderer.hasPipeline(pipelineName))
        {
            this.defaultPipeline = renderer.getPipeline(pipelineName);
            this.pipeline = this.defaultPipeline;

            return true;
        }

        return false;
    },

    /**
     * Sets the active WebGL Pipeline of this Game Object.
     *
     * @method Phaser.GameObjects.Components.Pipeline#setPipeline
     * @webglOnly
     * @since 3.0.0
     *
     * @param {string} pipelineName - The name of the pipeline to set on this Game Object.
     *
     * @return {this} This Game Object instance.
     */
    setPipeline: function (pipelineName)
    {
        var renderer = this.scene.sys.game.renderer;

        if (renderer && renderer.gl && renderer.hasPipeline(pipelineName))
        {
            this.pipeline = renderer.getPipeline(pipelineName);
        }

        return this;
    },

    /**
     * Resets the WebGL Pipeline of this Game Object back to the default it was created with.
     *
     * @method Phaser.GameObjects.Components.Pipeline#resetPipeline
     * @webglOnly
     * @since 3.0.0
     *
     * @return {boolean} `true` if the pipeline was set successfully, otherwise `false`.
     */
    resetPipeline: function ()
    {
        this.pipeline = this.defaultPipeline;

        return (this.pipeline !== null);
    },

    /**
     * Gets the name of the WebGL Pipeline this Game Object is currently using.
     *
     * @method Phaser.GameObjects.Components.Pipeline#getPipelineName
     * @webglOnly
     * @since 3.0.0
     *
     * @return {string} The string-based name of the pipeline being used by this Game Object.
     */
    getPipelineName: function ()
    {
        return this.pipeline.name;
    }

};

module.exports = Pipeline;


/***/ }),
/* 40 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Provides methods used for getting and setting the origin of a Game Object.
 * Values are normalized, given in the range 0 to 1.
 * Display values contain the calculated pixel values.
 * Should be applied as a mixin and not used directly.
 *
 * @name Phaser.GameObjects.Components.Origin
 * @since 3.0.0
 */

var Origin = {

    /**
     * A property indicating that a Game Object has this component.
     *
     * @name Phaser.GameObjects.Components.Origin#_originComponent
     * @type {boolean}
     * @private
     * @default true
     * @since 3.2.0
     */
    _originComponent: true,

    /**
     * The horizontal origin of this Game Object.
     * The origin maps the relationship between the size and position of the Game Object.
     * The default value is 0.5, meaning all Game Objects are positioned based on their center.
     * Setting the value to 0 means the position now relates to the left of the Game Object.
     *
     * @name Phaser.GameObjects.Components.Origin#originX
     * @type {number}
     * @default 0.5
     * @since 3.0.0
     */
    originX: 0.5,

    /**
     * The vertical origin of this Game Object.
     * The origin maps the relationship between the size and position of the Game Object.
     * The default value is 0.5, meaning all Game Objects are positioned based on their center.
     * Setting the value to 0 means the position now relates to the top of the Game Object.
     *
     * @name Phaser.GameObjects.Components.Origin#originY
     * @type {number}
     * @default 0.5
     * @since 3.0.0
     */
    originY: 0.5,

    //  private + read only
    _displayOriginX: 0,
    _displayOriginY: 0,

    /**
     * The horizontal display origin of this Game Object.
     * The origin is a normalized value between 0 and 1.
     * The displayOrigin is a pixel value, based on the size of the Game Object combined with the origin.
     *
     * @name Phaser.GameObjects.Components.Origin#displayOriginX
     * @type {number}
     * @since 3.0.0
     */
    displayOriginX: {

        get: function ()
        {
            return this._displayOriginX;
        },

        set: function (value)
        {
            this._displayOriginX = value;
            this.originX = value / this.width;
        }

    },

    /**
     * The vertical display origin of this Game Object.
     * The origin is a normalized value between 0 and 1.
     * The displayOrigin is a pixel value, based on the size of the Game Object combined with the origin.
     *
     * @name Phaser.GameObjects.Components.Origin#displayOriginY
     * @type {number}
     * @since 3.0.0
     */
    displayOriginY: {

        get: function ()
        {
            return this._displayOriginY;
        },

        set: function (value)
        {
            this._displayOriginY = value;
            this.originY = value / this.height;
        }

    },

    /**
     * Sets the origin of this Game Object.
     *
     * The values are given in the range 0 to 1.
     *
     * @method Phaser.GameObjects.Components.Origin#setOrigin
     * @since 3.0.0
     *
     * @param {number} [x=0.5] - The horizontal origin value.
     * @param {number} [y=x] - The vertical origin value. If not defined it will be set to the value of `x`.
     *
     * @return {this} This Game Object instance.
     */
    setOrigin: function (x, y)
    {
        if (x === undefined) { x = 0.5; }
        if (y === undefined) { y = x; }

        this.originX = x;
        this.originY = y;

        return this.updateDisplayOrigin();
    },

    /**
     * Sets the origin of this Game Object based on the Pivot values in its Frame.
     *
     * @method Phaser.GameObjects.Components.Origin#setOriginFromFrame
     * @since 3.0.0
     *
     * @return {this} This Game Object instance.
     */
    setOriginFromFrame: function ()
    {
        if (!this.frame || !this.frame.customPivot)
        {
            return this.setOrigin();
        }
        else
        {
            this.originX = this.frame.pivotX;
            this.originY = this.frame.pivotY;
        }

        return this.updateDisplayOrigin();
    },

    /**
     * Sets the display origin of this Game Object.
     * The difference between this and setting the origin is that you can use pixel values for setting the display origin.
     *
     * @method Phaser.GameObjects.Components.Origin#setDisplayOrigin
     * @since 3.0.0
     *
     * @param {number} [x=0] - The horizontal display origin value.
     * @param {number} [y=x] - The vertical display origin value. If not defined it will be set to the value of `x`.
     *
     * @return {this} This Game Object instance.
     */
    setDisplayOrigin: function (x, y)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = x; }

        this.displayOriginX = x;
        this.displayOriginY = y;

        return this;
    },

    /**
     * Updates the Display Origin cached values internally stored on this Game Object.
     * You don't usually call this directly, but it is exposed for edge-cases where you may.
     *
     * @method Phaser.GameObjects.Components.Origin#updateDisplayOrigin
     * @since 3.0.0
     *
     * @return {this} This Game Object instance.
     */
    updateDisplayOrigin: function ()
    {
        this._displayOriginX = Math.round(this.originX * this.width);
        this._displayOriginY = Math.round(this.originY * this.height);

        return this;
    }

};

module.exports = Origin;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = __webpack_require__(0);

/**
 * @classdesc
 * [description]
 *
 * @class GeometryMask
 * @memberOf Phaser.Display.Masks
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - [description]
 * @param {Phaser.GameObjects.Graphics} graphicsGeometry - [description]
 */
var GeometryMask = new Class({

    initialize:

    function GeometryMask (scene, graphicsGeometry)
    {
        /**
         * [description]
         *
         * @name Phaser.Display.Masks.GeometryMask#geometryMask
         * @type {Phaser.GameObjects.Graphics}
         * @since 3.0.0
         */
        this.geometryMask = graphicsGeometry;
    },

    /**
     * [description]
     *
     * @method Phaser.Display.Masks.GeometryMask#setShape
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Graphics} graphicsGeometry - [description]
     */
    setShape: function (graphicsGeometry)
    {
        this.geometryMask = graphicsGeometry;
    },

    /**
     * [description]
     *
     * @method Phaser.Display.Masks.GeometryMask#preRenderWebGL
     * @since 3.0.0
     *
     * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - [description]
     * @param {Phaser.GameObjects.GameObject} mask - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     */
    preRenderWebGL: function (renderer, mask, camera)
    {
        var gl = renderer.gl;
        var geometryMask = this.geometryMask;

        // Force flushing before drawing to stencil buffer
        renderer.flush();

        // Enable and setup GL state to write to stencil buffer
        gl.enable(gl.STENCIL_TEST);
        gl.clear(gl.STENCIL_BUFFER_BIT);
        gl.colorMask(false, false, false, false);
        gl.stencilFunc(gl.NOTEQUAL, 1, 1);
        gl.stencilOp(gl.REPLACE, gl.REPLACE, gl.REPLACE);

        // Write stencil buffer
        geometryMask.renderWebGL(renderer, geometryMask, 0.0, camera);
        renderer.flush();

        // Use stencil buffer to affect next rendering object
        gl.colorMask(true, true, true, true);
        gl.stencilFunc(gl.EQUAL, 1, 1);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
    },

    /**
     * [description]
     *
     * @method Phaser.Display.Masks.GeometryMask#postRenderWebGL
     * @since 3.0.0
     *
     * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - [description]
     */
    postRenderWebGL: function (renderer)
    {
        var gl = renderer.gl;

        // Force flush before disabling stencil test
        renderer.flush();
        gl.disable(gl.STENCIL_TEST);
    },

    /**
     * [description]
     *
     * @method Phaser.Display.Masks.GeometryMask#preRenderCanvas
     * @since 3.0.0
     *
     * @param {Phaser.Renderer.Canvas.CanvasRenderer} renderer - [description]
     * @param {Phaser.GameObjects.GameObject} mask - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     */
    preRenderCanvas: function (renderer, mask, camera)
    {
        var geometryMask = this.geometryMask;

        renderer.currentContext.save();

        geometryMask.renderCanvas(renderer, geometryMask, 0, camera, null, null, true);

        renderer.currentContext.clip();
    },

    /**
     * [description]
     *
     * @method Phaser.Display.Masks.GeometryMask#postRenderCanvas
     * @since 3.0.0
     *
     * @param {Phaser.Renderer.Canvas.CanvasRenderer} renderer - [description]
     */
    postRenderCanvas: function (renderer)
    {
        renderer.currentContext.restore();
    },

    /**
     * Destroys this GeometryMask and nulls any references it holds.
     * 
     * Note that if a Game Object is currently using this mask it will _not_ automatically detect you have destroyed it,
     * so be sure to call `clearMask` on any Game Object using it, before destroying it.
     *
     * @method Phaser.Display.Masks.GeometryMask#destroy
     * @since 3.7.0
     */
    destroy: function ()
    {
        this.geometryMask = null;
    }

});

module.exports = GeometryMask;


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = __webpack_require__(0);

/**
 * @classdesc
 * [description]
 *
 * @class BitmapMask
 * @memberOf Phaser.Display.Masks
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - [description]
 * @param {Phaser.GameObjects.GameObject} renderable - A renderable Game Object that uses a texture, such as a Sprite.
 */
var BitmapMask = new Class({

    initialize:

    function BitmapMask (scene, renderable)
    {
        var renderer = scene.sys.game.renderer;

        /**
         * A reference to either the Canvas or WebGL Renderer that this Mask is using.
         *
         * @name Phaser.Display.Masks.BitmapMask#renderer
         * @type {(Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer)}
         * @since 3.11.0
         */
        this.renderer = renderer;

        /**
         * A renderable Game Object that uses a texture, such as a Sprite.
         *
         * @name Phaser.Display.Masks.BitmapMask#bitmapMask
         * @type {Phaser.GameObjects.GameObject}
         * @since 3.0.0
         */
        this.bitmapMask = renderable;

        /**
         * [description]
         *
         * @name Phaser.Display.Masks.BitmapMask#maskTexture
         * @type {WebGLTexture}
         * @default null
         * @since 3.0.0
         */
        this.maskTexture = null;

        /**
         * [description]
         *
         * @name Phaser.Display.Masks.BitmapMask#mainTexture
         * @type {WebGLTexture}
         * @default null
         * @since 3.0.0
         */
        this.mainTexture = null;

        /**
         * [description]
         *
         * @name Phaser.Display.Masks.BitmapMask#dirty
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.dirty = true;

        /**
         * [description]
         *
         * @name Phaser.Display.Masks.BitmapMask#mainFramebuffer
         * @type {WebGLFramebuffer}
         * @since 3.0.0
         */
        this.mainFramebuffer = null;

        /**
         * [description]
         *
         * @name Phaser.Display.Masks.BitmapMask#maskFramebuffer
         * @type {WebGLFramebuffer}
         * @since 3.0.0
         */
        this.maskFramebuffer = null;

        /**
         * [description]
         *
         * @name Phaser.Display.Masks.BitmapMask#invertAlpha
         * @type {boolean}
         * @since 3.1.2
         */
        this.invertAlpha = false;

        if (renderer && renderer.gl)
        {
            var width = renderer.width;
            var height = renderer.height;
            var pot = ((width & (width - 1)) === 0 && (height & (height - 1)) === 0);
            var gl = renderer.gl;
            var wrap = pot ? gl.REPEAT : gl.CLAMP_TO_EDGE;
            var filter = gl.LINEAR;

            this.mainTexture = renderer.createTexture2D(0, filter, filter, wrap, wrap, gl.RGBA, null, width, height);
            this.maskTexture = renderer.createTexture2D(0, filter, filter, wrap, wrap, gl.RGBA, null, width, height);
            this.mainFramebuffer = renderer.createFramebuffer(width, height, this.mainTexture, false);
            this.maskFramebuffer = renderer.createFramebuffer(width, height, this.maskTexture, false);

            renderer.onContextRestored(function (renderer)
            {
                var width = renderer.width;
                var height = renderer.height;
                var pot = ((width & (width - 1)) === 0 && (height & (height - 1)) === 0);
                var gl = renderer.gl;
                var wrap = pot ? gl.REPEAT : gl.CLAMP_TO_EDGE;
                var filter = gl.LINEAR;

                this.mainTexture = renderer.createTexture2D(0, filter, filter, wrap, wrap, gl.RGBA, null, width, height);
                this.maskTexture = renderer.createTexture2D(0, filter, filter, wrap, wrap, gl.RGBA, null, width, height);
                this.mainFramebuffer = renderer.createFramebuffer(width, height, this.mainTexture, false);
                this.maskFramebuffer = renderer.createFramebuffer(width, height, this.maskTexture, false);

            }, this);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Display.Masks.BitmapMask#setBitmap
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} renderable - A renderable Game Object that uses a texture, such as a Sprite.
     */
    setBitmap: function (renderable)
    {
        this.bitmapMask = renderable;
    },

    /**
     * [description]
     *
     * @method Phaser.Display.Masks.BitmapMask#preRenderWebGL
     * @since 3.0.0
     *
     * @param {(Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer)} renderer - [description]
     * @param {Phaser.GameObjects.GameObject} maskedObject - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to render to.
     */
    preRenderWebGL: function (renderer, maskedObject, camera)
    {
        renderer.pipelines.BitmapMaskPipeline.beginMask(this, maskedObject, camera);
    },

    /**
     * [description]
     *
     * @method Phaser.Display.Masks.BitmapMask#postRenderWebGL
     * @since 3.0.0
     *
     * @param {(Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer)} renderer - [description]
     */
    postRenderWebGL: function (renderer)
    {
        renderer.pipelines.BitmapMaskPipeline.endMask(this);
    },

    /**
     * [description]
     *
     * @method Phaser.Display.Masks.BitmapMask#preRenderCanvas
     * @since 3.0.0
     *
     * @param {(Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer)} renderer - [description]
     * @param {Phaser.GameObjects.GameObject} mask - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to render to.
     */
    preRenderCanvas: function ()
    {
        // NOOP
    },

    /**
     * [description]
     *
     * @method Phaser.Display.Masks.BitmapMask#postRenderCanvas
     * @since 3.0.0
     *
     * @param {(Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer)} renderer - [description]
     */
    postRenderCanvas: function ()
    {
        // NOOP
    },

    /**
     * Destroys this BitmapMask and nulls any references it holds.
     * 
     * Note that if a Game Object is currently using this mask it will _not_ automatically detect you have destroyed it,
     * so be sure to call `clearMask` on any Game Object using it, before destroying it.
     *
     * @method Phaser.Display.Masks.BitmapMask#destroy
     * @since 3.7.0
     */
    destroy: function ()
    {
        this.bitmapMask = null;

        var renderer = this.renderer;

        if (renderer && renderer.gl)
        {
            renderer.deleteTexture(this.mainTexture);
            renderer.deleteTexture(this.maskTexture);
            renderer.deleteFramebuffer(this.mainFramebuffer);
            renderer.deleteFramebuffer(this.maskFramebuffer);
        }

        this.mainTexture = null;
        this.maskTexture = null;
        this.mainFramebuffer = null;
        this.maskFramebuffer = null;
        this.renderer = null;
    }

});

module.exports = BitmapMask;


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var BitmapMask = __webpack_require__(42);
var GeometryMask = __webpack_require__(41);

/**
 * Provides methods used for getting and setting the mask of a Game Object.
 *
 * @name Phaser.GameObjects.Components.Mask
 * @since 3.0.0
 */

var Mask = {

    /**
     * The Mask this Game Object is using during render.
     *
     * @name Phaser.GameObjects.Components.Mask#mask
     * @type {Phaser.Display.Masks.BitmapMask|Phaser.Display.Masks.GeometryMask}
     * @since 3.0.0
     */
    mask: null,

    /**
     * Sets the mask that this Game Object will use to render with.
     *
     * The mask must have been previously created and can be either a GeometryMask or a BitmapMask.
     * Note: Bitmap Masks only work on WebGL. Geometry Masks work on both WebGL and Canvas.
     *
     * If a mask is already set on this Game Object it will be immediately replaced.
     * 
     * Masks are positioned in global space and are not relative to the Game Object to which they
     * are applied. The reason for this is that multiple Game Objects can all share the same mask.
     * 
     * Masks have no impact on physics or input detection. They are purely a rendering component
     * that allows you to limit what is visible during the render pass.
     *
     * @method Phaser.GameObjects.Components.Mask#setMask
     * @since 3.6.2
     *
     * @param {Phaser.Display.Masks.BitmapMask|Phaser.Display.Masks.GeometryMask} mask - The mask this Game Object will use when rendering.
     *
     * @return {this} This Game Object instance.
     */
    setMask: function (mask)
    {
        this.mask = mask;

        return this;
    },

    /**
     * Clears the mask that this Game Object was using.
     *
     * @method Phaser.GameObjects.Components.Mask#clearMask
     * @since 3.6.2
     *
     * @param {boolean} [destroyMask=false] - Destroy the mask before clearing it?
     *
     * @return {this} This Game Object instance.
     */
    clearMask: function (destroyMask)
    {
        if (destroyMask === undefined) { destroyMask = false; }

        if (destroyMask && this.mask)
        {
            this.mask.destroy();
        }

        this.mask = null;

        return this;
    },

    /**
     * Creates and returns a Bitmap Mask. This mask can be used by any Game Object,
     * including this one.
     *
     * To create the mask you need to pass in a reference to a renderable Game Object.
     * A renderable Game Object is one that uses a texture to render with, such as an
     * Image, Sprite, Render Texture or BitmapText.
     *
     * If you do not provide a renderable object, and this Game Object has a texture,
     * it will use itself as the object. This means you can call this method to create
     * a Bitmap Mask from any renderable Game Object.
     *
     * @method Phaser.GameObjects.Components.Mask#createBitmapMask
     * @since 3.6.2
     * 
     * @param {Phaser.GameObjects.GameObject} [renderable] - A renderable Game Object that uses a texture, such as a Sprite.
     *
     * @return {Phaser.Display.Masks.BitmapMask} This Bitmap Mask that was created.
     */
    createBitmapMask: function (renderable)
    {
        if (renderable === undefined && this.texture)
        {
            // eslint-disable-next-line consistent-this
            renderable = this;
        }

        return new BitmapMask(this.scene, renderable);
    },

    /**
     * Creates and returns a Geometry Mask. This mask can be used by any Game Object,
     * including this one.
     *
     * To create the mask you need to pass in a reference to a Graphics Game Object.
     *
     * If you do not provide a graphics object, and this Game Object is an instance
     * of a Graphics object, then it will use itself to create the mask.
     * 
     * This means you can call this method to create a Geometry Mask from any Graphics Game Object.
     *
     * @method Phaser.GameObjects.Components.Mask#createGeometryMask
     * @since 3.6.2
     * 
     * @param {Phaser.GameObjects.Graphics} [graphics] - A Graphics Game Object. The geometry within it will be used as the mask.
     *
     * @return {Phaser.Display.Masks.GeometryMask} This Geometry Mask that was created.
     */
    createGeometryMask: function (graphics)
    {
        if (graphics === undefined && this.type === 'Graphics')
        {
            // eslint-disable-next-line consistent-this
            graphics = this;
        }

        return new GeometryMask(this.scene, graphics);
    }

};

module.exports = Mask;


/***/ }),
/* 44 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Rotate a `point` around `x` and `y` by the given `angle`.
 *
 * @function Phaser.Math.RotateAround
 * @since 3.0.0
 *
 * @param {(Phaser.Geom.Point|object)} point - The point to be rotated.
 * @param {number} x - The horizontal coordinate to rotate around.
 * @param {number} y - The vertical coordinate to rotate around.
 * @param {number} angle - The angle of rotation in radians.
 *
 * @return {Phaser.Geom.Point} The given point, rotated by the given angle around the given coordinates.
 */
var RotateAround = function (point, x, y, angle)
{
    var c = Math.cos(angle);
    var s = Math.sin(angle);

    var tx = point.x - x;
    var ty = point.y - y;

    point.x = tx * c - ty * s + x;
    point.y = tx * s + ty * c + y;

    return point;
};

module.exports = RotateAround;


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Point = __webpack_require__(1);

/**
 * [description]
 *
 * @function Phaser.Geom.Rectangle.Random
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [out,$return]
 *
 * @param {Phaser.Geom.Rectangle} rect - [description]
 * @param {Phaser.Geom.Point} out - [description]
 *
 * @return {Phaser.Geom.Point} [description]
 */
var Random = function (rect, out)
{
    if (out === undefined) { out = new Point(); }

    out.x = rect.x + (Math.random() * rect.width);
    out.y = rect.y + (Math.random() * rect.height);

    return out;
};

module.exports = Random;


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Point = __webpack_require__(1);

/**
 * Returns a random point on a given Line.
 *
 * @function Phaser.Geom.Line.Random
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [out,$return]
 *
 * @param {Phaser.Geom.Line} line - The Line to calculate the random Point on.
 * @param {(Phaser.Geom.Point|object)} [out] - An instance of a Point to be modified.
 *
 * @return {(Phaser.Geom.Point|object)} A random Point on the Line.
 */
var Random = function (line, out)
{
    if (out === undefined) { out = new Point(); }

    var t = Math.random();

    out.x = line.x1 + t * (line.x2 - line.x1);
    out.y = line.y1 + t * (line.y2 - line.y1);

    return out;
};

module.exports = Random;


/***/ }),
/* 47 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Calculate the length of the given line.
 *
 * @function Phaser.Geom.Line.Length
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} line - The line to calculate the length of.
 *
 * @return {number} The length of the line.
 */
var Length = function (line)
{
    return Math.sqrt((line.x2 - line.x1) * (line.x2 - line.x1) + (line.y2 - line.y1) * (line.y2 - line.y1));
};

module.exports = Length;


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Length = __webpack_require__(47);
var Point = __webpack_require__(1);

/**
 * Get a number of points along a line's length.
 *
 * Provide a `quantity` to get an exact number of points along the line.
 *
 * Provide a `stepRate` to ensure a specific distance between each point on the line. Set `quantity` to `0` when
 * providing a `stepRate`.
 *
 * @function Phaser.Geom.Line.GetPoints
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point[]} O - [out,$return]
 *
 * @param {Phaser.Geom.Line} line - The line.
 * @param {integer} quantity - The number of points to place on the line. Set to `0` to use `stepRate` instead.
 * @param {number} [stepRate] - The distance between each point on the line. When set, `quantity` is implied and should be set to `0`.
 * @param {(array|Phaser.Geom.Point[])} [out] - An optional array of Points, or point-like objects, to store the coordinates of the points on the line.
 *
 * @return {(array|Phaser.Geom.Point[])} An array of Points, or point-like objects, containing the coordinates of the points on the line.
 */
var GetPoints = function (line, quantity, stepRate, out)
{
    if (out === undefined) { out = []; }

    //  If quantity is a falsey value (false, null, 0, undefined, etc) then we calculate it based on the stepRate instead.
    if (!quantity)
    {
        quantity = Length(line) / stepRate;
    }

    var x1 = line.x1;
    var y1 = line.y1;

    var x2 = line.x2;
    var y2 = line.y2;

    for (var i = 0; i < quantity; i++)
    {
        var position = i / quantity;

        var x = x1 + (x2 - x1) * position;
        var y = y1 + (y2 - y1) * position;

        out.push(new Point(x, y));
    }

    return out;
};

module.exports = GetPoints;


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Point = __webpack_require__(1);

/**
 * Get a point on a line that's a given percentage along its length.
 *
 * @function Phaser.Geom.Line.GetPoint
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [out,$return]
 *
 * @param {Phaser.Geom.Line} line - The line.
 * @param {number} position - A value between 0 and 1, where 0 is the start, 0.5 is the middle and 1 is the end of the line.
 * @param {(Phaser.Geom.Point|object)} [out] - An optional point, or point-like object, to store the coordinates of the point on the line.
 *
 * @return {(Phaser.Geom.Point|object)} The point on the line.
 */
var GetPoint = function (line, position, out)
{
    if (out === undefined) { out = new Point(); }

    out.x = line.x1 + (line.x2 - line.x1) * position;
    out.y = line.y1 + (line.y2 - line.y1) * position;

    return out;
};

module.exports = GetPoint;


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = __webpack_require__(0);
var GetPoint = __webpack_require__(49);
var GetPoints = __webpack_require__(48);
var Random = __webpack_require__(46);
var Vector2 = __webpack_require__(3);

/**
 * @classdesc
 * Defines a Line segment, a part of a line between two endpoints.
 *
 * @class Line
 * @memberOf Phaser.Geom
 * @constructor
 * @since 3.0.0
 *
 * @param {number} [x1=0] - The x coordinate of the lines starting point.
 * @param {number} [y1=0] - The y coordinate of the lines starting point.
 * @param {number} [x2=0] - The x coordinate of the lines ending point.
 * @param {number} [y2=0] - The y coordinate of the lines ending point.
 */
var Line = new Class({

    initialize:

    function Line (x1, y1, x2, y2)
    {
        if (x1 === undefined) { x1 = 0; }
        if (y1 === undefined) { y1 = 0; }
        if (x2 === undefined) { x2 = 0; }
        if (y2 === undefined) { y2 = 0; }

        /**
         * The x coordinate of the lines starting point.
         *
         * @name Phaser.Geom.Line#x1
         * @type {number}
         * @since 3.0.0
         */
        this.x1 = x1;

        /**
         * The y coordinate of the lines starting point.
         *
         * @name Phaser.Geom.Line#y1
         * @type {number}
         * @since 3.0.0
         */
        this.y1 = y1;

        /**
         * The x coordinate of the lines ending point.
         *
         * @name Phaser.Geom.Line#x2
         * @type {number}
         * @since 3.0.0
         */
        this.x2 = x2;

        /**
         * The y coordinate of the lines ending point.
         *
         * @name Phaser.Geom.Line#y2
         * @type {number}
         * @since 3.0.0
         */
        this.y2 = y2;
    },

    /**
     * Get a point on a line that's a given percentage along its length.
     *
     * @method Phaser.Geom.Line#getPoint
     * @since 3.0.0
     *
     * @generic {Phaser.Geom.Point} O - [output,$return]
     *
     * @param {number} position - A value between 0 and 1, where 0 is the start, 0.5 is the middle and 1 is the end of the line.
     * @param {(Phaser.Geom.Point|object)} [output] - An optional point, or point-like object, to store the coordinates of the point on the line.
     *
     * @return {(Phaser.Geom.Point|object)} A Point, or point-like object, containing the coordinates of the point on the line.
     */
    getPoint: function (position, output)
    {
        return GetPoint(this, position, output);
    },

    /**
     * Get a number of points along a line's length.
     *
     * Provide a `quantity` to get an exact number of points along the line.
     *
     * Provide a `stepRate` to ensure a specific distance between each point on the line. Set `quantity` to `0` when
     * providing a `stepRate`.
     *
     * @method Phaser.Geom.Line#getPoints
     * @since 3.0.0
     *
     * @generic {Phaser.Geom.Point} O - [output,$return]
     *
     * @param {integer} quantity - The number of points to place on the line. Set to `0` to use `stepRate` instead.
     * @param {integer} [stepRate] - The distance between each point on the line. When set, `quantity` is implied and should be set to `0`.
     * @param {(array|Phaser.Geom.Point[])} [output] - An optional array of Points, or point-like objects, to store the coordinates of the points on the line.
     *
     * @return {(array|Phaser.Geom.Point[])} An array of Points, or point-like objects, containing the coordinates of the points on the line.
     */
    getPoints: function (quantity, stepRate, output)
    {
        return GetPoints(this, quantity, stepRate, output);
    },

    /**
     * Get a random Point on the Line.
     *
     * @method Phaser.Geom.Line#getRandomPoint
     * @since 3.0.0
     *
     * @generic {Phaser.Geom.Point} O - [point,$return]
     *
     * @param {(Phaser.Geom.Point|object)} [point] - An instance of a Point to be modified.
     *
     * @return {Phaser.Geom.Point} A random Point on the Line.
     */
    getRandomPoint: function (point)
    {
        return Random(this, point);
    },

    /**
     * Set new coordinates for the line endpoints.
     *
     * @method Phaser.Geom.Line#setTo
     * @since 3.0.0
     *
     * @param {number} [x1=0] - The x coordinate of the lines starting point.
     * @param {number} [y1=0] - The y coordinate of the lines starting point.
     * @param {number} [x2=0] - The x coordinate of the lines ending point.
     * @param {number} [y2=0] - The y coordinate of the lines ending point.
     *
     * @return {Phaser.Geom.Line} This Line object.
     */
    setTo: function (x1, y1, x2, y2)
    {
        if (x1 === undefined) { x1 = 0; }
        if (y1 === undefined) { y1 = 0; }
        if (x2 === undefined) { x2 = 0; }
        if (y2 === undefined) { y2 = 0; }

        this.x1 = x1;
        this.y1 = y1;

        this.x2 = x2;
        this.y2 = y2;

        return this;
    },

    /**
     * Returns a Vector2 object that corresponds to the start of this Line.
     *
     * @method Phaser.Geom.Line#getPointA
     * @since 3.0.0
     *
     * @generic {Phaser.Math.Vector2} O - [vec2,$return]
     *
     * @param {Phaser.Math.Vector2} [vec2] - A Vector2 object to set the results in. If `undefined` a new Vector2 will be created.
     *
     * @return {Phaser.Math.Vector2} A Vector2 object that corresponds to the start of this Line.
     */
    getPointA: function (vec2)
    {
        if (vec2 === undefined) { vec2 = new Vector2(); }

        vec2.set(this.x1, this.y1);

        return vec2;
    },

    /**
     * Returns a Vector2 object that corresponds to the end of this Line.
     *
     * @method Phaser.Geom.Line#getPointB
     * @since 3.0.0
     *
     * @generic {Phaser.Math.Vector2} O - [vec2,$return]
     *
     * @param {Phaser.Math.Vector2} [vec2] - A Vector2 object to set the results in. If `undefined` a new Vector2 will be created.
     *
     * @return {Phaser.Math.Vector2} A Vector2 object that corresponds to the end of this Line.
     */
    getPointB: function (vec2)
    {
        if (vec2 === undefined) { vec2 = new Vector2(); }

        vec2.set(this.x2, this.y2);

        return vec2;
    },

    /**
     * The left position of the Line.
     *
     * @name Phaser.Geom.Line#left
     * @type {number}
     * @since 3.0.0
     */
    left: {

        get: function ()
        {
            return Math.min(this.x1, this.x2);
        },

        set: function (value)
        {
            if (this.x1 <= this.x2)
            {
                this.x1 = value;
            }
            else
            {
                this.x2 = value;
            }
        }

    },

    /**
     * The right position of the Line.
     *
     * @name Phaser.Geom.Line#right
     * @type {number}
     * @since 3.0.0
     */
    right: {

        get: function ()
        {
            return Math.max(this.x1, this.x2);
        },

        set: function (value)
        {
            if (this.x1 > this.x2)
            {
                this.x1 = value;
            }
            else
            {
                this.x2 = value;
            }
        }

    },

    /**
     * The top position of the Line.
     *
     * @name Phaser.Geom.Line#top
     * @type {number}
     * @since 3.0.0
     */
    top: {

        get: function ()
        {
            return Math.min(this.y1, this.y2);
        },

        set: function (value)
        {
            if (this.y1 <= this.y2)
            {
                this.y1 = value;
            }
            else
            {
                this.y2 = value;
            }
        }

    },

    /**
     * The bottom position of the Line.
     *
     * @name Phaser.Geom.Line#bottom
     * @type {number}
     * @since 3.0.0
     */
    bottom: {

        get: function ()
        {
            return Math.max(this.y1, this.y2);
        },

        set: function (value)
        {
            if (this.y1 > this.y2)
            {
                this.y1 = value;
            }
            else
            {
                this.y2 = value;
            }
        }

    }

});

module.exports = Line;


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GetPoint = __webpack_require__(10);
var Perimeter = __webpack_require__(9);

//  Return an array of points from the perimeter of the rectangle
//  each spaced out based on the quantity or step required

/**
 * [description]
 *
 * @function Phaser.Geom.Rectangle.GetPoints
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point[]} O - [out,$return]
 *
 * @param {Phaser.Geom.Rectangle} rectangle - [description]
 * @param {number} step - [description]
 * @param {integer} quantity - [description]
 * @param {(array|Phaser.Geom.Point[])} [out] - [description]
 *
 * @return {(array|Phaser.Geom.Point[])} [description]
 */
var GetPoints = function (rectangle, quantity, stepRate, out)
{
    if (out === undefined) { out = []; }

    //  If quantity is a falsey value (false, null, 0, undefined, etc) then we calculate it based on the stepRate instead.
    if (!quantity)
    {
        quantity = Perimeter(rectangle) / stepRate;
    }

    for (var i = 0; i < quantity; i++)
    {
        var position = i / quantity;

        out.push(GetPoint(rectangle, position));
    }

    return out;
};

module.exports = GetPoints;


/***/ }),
/* 52 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Geom.Rectangle.Contains
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} rect - [description]
 * @param {number} x - [description]
 * @param {number} y - [description]
 *
 * @return {boolean} [description]
 */
var Contains = function (rect, x, y)
{
    if (rect.width <= 0 || rect.height <= 0)
    {
        return false;
    }

    return (rect.x <= x && rect.x + rect.width >= x && rect.y <= y && rect.y + rect.height >= y);
};

module.exports = Contains;


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = __webpack_require__(0);
var Contains = __webpack_require__(52);
var GetPoint = __webpack_require__(10);
var GetPoints = __webpack_require__(51);
var Line = __webpack_require__(50);
var Random = __webpack_require__(45);

/**
 * @classdesc
 * Encapsulates a 2D rectangle defined by its corner point in the top-left and its extends in x (width) and y (height)
 *
 * @class Rectangle
 * @memberOf Phaser.Geom
 * @constructor
 * @since 3.0.0
 *
 * @param {number} [x=0] - [description]
 * @param {number} [y=0] - [description]
 * @param {number} [width=0] - [description]
 * @param {number} [height=0] - [description]
 */
var Rectangle = new Class({

    initialize:

    function Rectangle (x, y, width, height)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (width === undefined) { width = 0; }
        if (height === undefined) { height = 0; }

        /**
         * [description]
         *
         * @name Phaser.Geom.Rectangle#x
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.x = x;

        /**
         * [description]
         *
         * @name Phaser.Geom.Rectangle#y
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.y = y;

        /**
         * [description]
         *
         * @name Phaser.Geom.Rectangle#width
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.width = width;

        /**
         * [description]
         *
         * @name Phaser.Geom.Rectangle#height
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.height = height;
    },

    /**
     * [description]
     *
     * @method Phaser.Geom.Rectangle#contains
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     *
     * @return {boolean} [description]
     */
    contains: function (x, y)
    {
        return Contains(this, x, y);
    },

    /**
     * [description]
     *
     * @method Phaser.Geom.Rectangle#getPoint
     * @since 3.0.0
     *
     * @generic {Phaser.Geom.Point} O - [output,$return]
     *
     * @param {number} position - [description]
     * @param {(Phaser.Geom.Point|object)} [output] - [description]
     *
     * @return {(Phaser.Geom.Point|object)} [description]
     */
    getPoint: function (position, output)
    {
        return GetPoint(this, position, output);
    },

    /**
     * [description]
     *
     * @method Phaser.Geom.Rectangle#getPoints
     * @since 3.0.0
     *
     * @generic {Phaser.Geom.Point[]} O - [output,$return]
     *
     * @param {integer} quantity - [description]
     * @param {number} [stepRate] - [description]
     * @param {(array|Phaser.Geom.Point[])} [output] - [description]
     *
     * @return {(array|Phaser.Geom.Point[])} [description]
     */
    getPoints: function (quantity, stepRate, output)
    {
        return GetPoints(this, quantity, stepRate, output);
    },

    /**
     * [description]
     *
     * @method Phaser.Geom.Rectangle#getRandomPoint
     * @since 3.0.0
     *
     * @generic {Phaser.Geom.Point} O - [point,$return]
     *
     * @param {Phaser.Geom.Point} [point] - [description]
     *
     * @return {Phaser.Geom.Point} [description]
     */
    getRandomPoint: function (point)
    {
        return Random(this, point);
    },

    /**
     * [description]
     *
     * @method Phaser.Geom.Rectangle#setTo
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     * @param {number} width - [description]
     * @param {number} height - [description]
     *
     * @return {Phaser.Geom.Rectangle} This Rectangle object.
     */
    setTo: function (x, y, width, height)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Geom.Rectangle#setEmpty
     * @since 3.0.0
     *
     * @return {Phaser.Geom.Rectangle} This Rectangle object.
     */
    setEmpty: function ()
    {
        return this.setTo(0, 0, 0, 0);
    },

    /**
     * [description]
     *
     * @method Phaser.Geom.Rectangle#setPosition
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} [y=x] - [description]
     *
     * @return {Phaser.Geom.Rectangle} This Rectangle object.
     */
    setPosition: function (x, y)
    {
        if (y === undefined) { y = x; }

        this.x = x;
        this.y = y;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Geom.Rectangle#setSize
     * @since 3.0.0
     *
     * @param {number} width - [description]
     * @param {number} [height=width] - [description]
     *
     * @return {Phaser.Geom.Rectangle} This Rectangle object.
     */
    setSize: function (width, height)
    {
        if (height === undefined) { height = width; }

        this.width = width;
        this.height = height;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Geom.Rectangle#isEmpty
     * @since 3.0.0
     *
     * @return {boolean} [description]
     */
    isEmpty: function ()
    {
        return (this.width <= 0 || this.height <= 0);
    },

    /**
     * Returns a Line object that corresponds to the top of this Rectangle.
     *
     * @method Phaser.Geom.Rectangle#getLineA
     * @since 3.0.0
     *
     * @generic {Phaser.Geom.Line} O - [line,$return]
     *
     * @param {Phaser.Geom.Line} [line] - A Line object to set the results in. If `undefined` a new Line will be created.
     *
     * @return {Phaser.Geom.Line} A Line object that corresponds to the top of this Rectangle.
     */
    getLineA: function (line)
    {
        if (line === undefined) { line = new Line(); }

        line.setTo(this.x, this.y, this.right, this.y);

        return line;
    },

    /**
     * Returns a Line object that corresponds to the right of this Rectangle.
     *
     * @method Phaser.Geom.Rectangle#getLineB
     * @since 3.0.0
     *
     * @generic {Phaser.Geom.Line} O - [line,$return]
     *
     * @param {Phaser.Geom.Line} [line] - A Line object to set the results in. If `undefined` a new Line will be created.
     *
     * @return {Phaser.Geom.Line} A Line object that corresponds to the right of this Rectangle.
     */
    getLineB: function (line)
    {
        if (line === undefined) { line = new Line(); }

        line.setTo(this.right, this.y, this.right, this.bottom);

        return line;
    },

    /**
     * Returns a Line object that corresponds to the bottom of this Rectangle.
     *
     * @method Phaser.Geom.Rectangle#getLineC
     * @since 3.0.0
     *
     * @generic {Phaser.Geom.Line} O - [line,$return]
     *
     * @param {Phaser.Geom.Line} [line] - A Line object to set the results in. If `undefined` a new Line will be created.
     *
     * @return {Phaser.Geom.Line} A Line object that corresponds to the bottom of this Rectangle.
     */
    getLineC: function (line)
    {
        if (line === undefined) { line = new Line(); }

        line.setTo(this.right, this.bottom, this.x, this.bottom);

        return line;
    },

    /**
     * Returns a Line object that corresponds to the left of this Rectangle.
     *
     * @method Phaser.Geom.Rectangle#getLineD
     * @since 3.0.0
     *
     * @generic {Phaser.Geom.Line} O - [line,$return]
     *
     * @param {Phaser.Geom.Line} [line] - A Line object to set the results in. If `undefined` a new Line will be created.
     *
     * @return {Phaser.Geom.Line} A Line object that corresponds to the left of this Rectangle.
     */
    getLineD: function (line)
    {
        if (line === undefined) { line = new Line(); }

        line.setTo(this.x, this.bottom, this.x, this.y);

        return line;
    },

    /**
     * [description]
     *
     * @name Phaser.Geom.Rectangle#left
     * @type {number}
     * @since 3.0.0
     */
    left: {

        get: function ()
        {
            return this.x;
        },

        set: function (value)
        {
            if (value >= this.right)
            {
                this.width = 0;
            }
            else
            {
                this.width = this.right - value;
            }

            this.x = value;
        }

    },

    /**
     * [description]
     *
     * @name Phaser.Geom.Rectangle#right
     * @type {number}
     * @since 3.0.0
     */
    right: {

        get: function ()
        {
            return this.x + this.width;
        },

        set: function (value)
        {
            if (value <= this.x)
            {
                this.width = 0;
            }
            else
            {
                this.width = value - this.x;
            }
        }

    },

    /**
     * [description]
     *
     * @name Phaser.Geom.Rectangle#top
     * @type {number}
     * @since 3.0.0
     */
    top: {

        get: function ()
        {
            return this.y;
        },

        set: function (value)
        {
            if (value >= this.bottom)
            {
                this.height = 0;
            }
            else
            {
                this.height = (this.bottom - value);
            }

            this.y = value;
        }

    },

    /**
     * [description]
     *
     * @name Phaser.Geom.Rectangle#bottom
     * @type {number}
     * @since 3.0.0
     */
    bottom: {

        get: function ()
        {
            return this.y + this.height;
        },

        set: function (value)
        {
            if (value <= this.y)
            {
                this.height = 0;
            }
            else
            {
                this.height = value - this.y;
            }
        }

    },

    /**
     * [description]
     *
     * @name Phaser.Geom.Rectangle#centerX
     * @type {number}
     * @since 3.0.0
     */
    centerX: {

        get: function ()
        {
            return this.x + (this.width / 2);
        },

        set: function (value)
        {
            this.x = value - (this.width / 2);
        }

    },

    /**
     * [description]
     *
     * @name Phaser.Geom.Rectangle#centerY
     * @type {number}
     * @since 3.0.0
     */
    centerY: {

        get: function ()
        {
            return this.y + (this.height / 2);
        },

        set: function (value)
        {
            this.y = value - (this.height / 2);
        }

    }

});

module.exports = Rectangle;


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Rectangle = __webpack_require__(53);
var RotateAround = __webpack_require__(44);
var Vector2 = __webpack_require__(3);

/**
 * Provides methods used for obtaining the bounds of a Game Object.
 * Should be applied as a mixin and not used directly.
 *
 * @name Phaser.GameObjects.Components.GetBounds
 * @since 3.0.0
 */

var GetBounds = {

    /**
     * Gets the center coordinate of this Game Object, regardless of origin.
     * The returned point is calculated in local space and does not factor in any parent containers
     *
     * @method Phaser.GameObjects.Components.GetBounds#getCenter
     * @since 3.0.0
     *
     * @generic {Phaser.Math.Vector2} O - [output,$return]
     *
     * @param {(Phaser.Math.Vector2|object)} [output] - An object to store the values in. If not provided a new Vector2 will be created.
     *
     * @return {(Phaser.Math.Vector2|object)} The values stored in the output object.
     */
    getCenter: function (output)
    {
        if (output === undefined) { output = new Vector2(); }

        output.x = this.x - (this.displayWidth * this.originX) + (this.displayWidth / 2);
        output.y = this.y - (this.displayHeight * this.originY) + (this.displayHeight / 2);

        return output;
    },

    /**
     * Gets the top-left corner coordinate of this Game Object, regardless of origin.
     * The returned point is calculated in local space and does not factor in any parent containers
     *
     * @method Phaser.GameObjects.Components.GetBounds#getTopLeft
     * @since 3.0.0
     *
     * @generic {Phaser.Math.Vector2} O - [output,$return]
     *
     * @param {(Phaser.Math.Vector2|object)} [output] - An object to store the values in. If not provided a new Vector2 will be created.
     * @param {boolean} [includeParent=false] - If this Game Object has a parent Container, include it (and all other ancestors) in the resulting vector?
     *
     * @return {(Phaser.Math.Vector2|object)} The values stored in the output object.
     */
    getTopLeft: function (output, includeParent)
    {
        if (!output) { output = new Vector2(); }
        if (includeParent === undefined) { includeParent = false; }

        output.x = this.x - (this.displayWidth * this.originX);
        output.y = this.y - (this.displayHeight * this.originY);

        if (this.rotation !== 0)
        {
            RotateAround(output, this.x, this.y, this.rotation);
        }

        if (includeParent && this.parentContainer)
        {
            var parentMatrix = this.parentContainer.getBoundsTransformMatrix();

            parentMatrix.transformPoint(output.x, output.y, output);
        }

        return output;
    },

    /**
     * Gets the top-right corner coordinate of this Game Object, regardless of origin.
     * The returned point is calculated in local space and does not factor in any parent containers
     *
     * @method Phaser.GameObjects.Components.GetBounds#getTopRight
     * @since 3.0.0
     *
     * @generic {Phaser.Math.Vector2} O - [output,$return]
     *
     * @param {(Phaser.Math.Vector2|object)} [output] - An object to store the values in. If not provided a new Vector2 will be created.
     * @param {boolean} [includeParent=false] - If this Game Object has a parent Container, include it (and all other ancestors) in the resulting vector?
     *
     * @return {(Phaser.Math.Vector2|object)} The values stored in the output object.
     */
    getTopRight: function (output, includeParent)
    {
        if (!output) { output = new Vector2(); }
        if (includeParent === undefined) { includeParent = false; }

        output.x = (this.x - (this.displayWidth * this.originX)) + this.displayWidth;
        output.y = this.y - (this.displayHeight * this.originY);

        if (this.rotation !== 0)
        {
            RotateAround(output, this.x, this.y, this.rotation);
        }

        if (includeParent && this.parentContainer)
        {
            var parentMatrix = this.parentContainer.getBoundsTransformMatrix();

            parentMatrix.transformPoint(output.x, output.y, output);
        }

        return output;
    },

    /**
     * Gets the bottom-left corner coordinate of this Game Object, regardless of origin.
     * The returned point is calculated in local space and does not factor in any parent containers
     *
     * @method Phaser.GameObjects.Components.GetBounds#getBottomLeft
     * @since 3.0.0
     *
     * @generic {Phaser.Math.Vector2} O - [output,$return]
     *
     * @param {(Phaser.Math.Vector2|object)} [output] - An object to store the values in. If not provided a new Vector2 will be created.
     * @param {boolean} [includeParent=false] - If this Game Object has a parent Container, include it (and all other ancestors) in the resulting vector?
     *
     * @return {(Phaser.Math.Vector2|object)} The values stored in the output object.
     */
    getBottomLeft: function (output, includeParent)
    {
        if (!output) { output = new Vector2(); }
        if (includeParent === undefined) { includeParent = false; }

        output.x = this.x - (this.displayWidth * this.originX);
        output.y = (this.y - (this.displayHeight * this.originY)) + this.displayHeight;

        if (this.rotation !== 0)
        {
            RotateAround(output, this.x, this.y, this.rotation);
        }

        if (includeParent && this.parentContainer)
        {
            var parentMatrix = this.parentContainer.getBoundsTransformMatrix();

            parentMatrix.transformPoint(output.x, output.y, output);
        }

        return output;
    },

    /**
     * Gets the bottom-right corner coordinate of this Game Object, regardless of origin.
     * The returned point is calculated in local space and does not factor in any parent containers
     *
     * @method Phaser.GameObjects.Components.GetBounds#getBottomRight
     * @since 3.0.0
     *
     * @generic {Phaser.Math.Vector2} O - [output,$return]
     *
     * @param {(Phaser.Math.Vector2|object)} [output] - An object to store the values in. If not provided a new Vector2 will be created.
     * @param {boolean} [includeParent=false] - If this Game Object has a parent Container, include it (and all other ancestors) in the resulting vector?
     *
     * @return {(Phaser.Math.Vector2|object)} The values stored in the output object.
     */
    getBottomRight: function (output, includeParent)
    {
        if (!output) { output = new Vector2(); }
        if (includeParent === undefined) { includeParent = false; }

        output.x = (this.x - (this.displayWidth * this.originX)) + this.displayWidth;
        output.y = (this.y - (this.displayHeight * this.originY)) + this.displayHeight;

        if (this.rotation !== 0)
        {
            RotateAround(output, this.x, this.y, this.rotation);
        }

        if (includeParent && this.parentContainer)
        {
            var parentMatrix = this.parentContainer.getBoundsTransformMatrix();

            parentMatrix.transformPoint(output.x, output.y, output);
        }

        return output;
    },

    /**
     * Gets the bounds of this Game Object, regardless of origin.
     * The values are stored and returned in a Rectangle, or Rectangle-like, object.
     *
     * @method Phaser.GameObjects.Components.GetBounds#getBounds
     * @since 3.0.0
     *
     * @generic {Phaser.Geom.Rectangle} O - [output,$return]
     *
     * @param {(Phaser.Geom.Rectangle|object)} [output] - An object to store the values in. If not provided a new Rectangle will be created.
     *
     * @return {(Phaser.Geom.Rectangle|object)} The values stored in the output object.
     */
    getBounds: function (output)
    {
        if (output === undefined) { output = new Rectangle(); }

        //  We can use the output object to temporarily store the x/y coords in:

        var TLx, TLy, TRx, TRy, BLx, BLy, BRx, BRy;

        // Instead of doing a check if parent container is 
        // defined per corner we only do it once.
        if (this.parentContainer)
        {
            var parentMatrix = this.parentContainer.getBoundsTransformMatrix();

            this.getTopLeft(output);
            parentMatrix.transformPoint(output.x, output.y, output);

            TLx = output.x;
            TLy = output.y;

            this.getTopRight(output);
            parentMatrix.transformPoint(output.x, output.y, output);

            TRx = output.x;
            TRy = output.y;

            this.getBottomLeft(output);
            parentMatrix.transformPoint(output.x, output.y, output);

            BLx = output.x;
            BLy = output.y;

            this.getBottomRight(output);
            parentMatrix.transformPoint(output.x, output.y, output);

            BRx = output.x;
            BRy = output.y;
        }
        else
        {
            this.getTopLeft(output);

            TLx = output.x;
            TLy = output.y;

            this.getTopRight(output);

            TRx = output.x;
            TRy = output.y;

            this.getBottomLeft(output);

            BLx = output.x;
            BLy = output.y;

            this.getBottomRight(output);

            BRx = output.x;
            BRy = output.y;
        }

        output.x = Math.min(TLx, TRx, BLx, BRx);
        output.y = Math.min(TLy, TRy, BLy, BRy);
        output.width = Math.max(TLx, TRx, BLx, BRx) - output.x;
        output.height = Math.max(TLy, TRy, BLy, BRy) - output.y;

        return output;
    }

};

module.exports = GetBounds;


/***/ }),
/* 55 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Provides methods used for visually flipping a Game Object.
 * Should be applied as a mixin and not used directly.
 * 
 * @name Phaser.GameObjects.Components.Flip
 * @since 3.0.0
 */

var Flip = {

    /**
     * The horizontally flipped state of the Game Object.
     * A Game Object that is flipped horizontally will render inversed on the horizontal axis.
     * Flipping always takes place from the middle of the texture and does not impact the scale value.
     * 
     * @name Phaser.GameObjects.Components.Flip#flipX
     * @type {boolean}
     * @default false
     * @since 3.0.0
     */
    flipX: false,

    /**
     * The vertically flipped state of the Game Object.
     * A Game Object that is flipped vertically will render inversed on the vertical axis (i.e. upside down)
     * Flipping always takes place from the middle of the texture and does not impact the scale value.
     * 
     * @name Phaser.GameObjects.Components.Flip#flipY
     * @type {boolean}
     * @default false
     * @since 3.0.0
     */
    flipY: false,

    /**
     * Toggles the horizontal flipped state of this Game Object.
     * 
     * @method Phaser.GameObjects.Components.Flip#toggleFlipX
     * @since 3.0.0
     * 
     * @return {this} This Game Object instance.
     */
    toggleFlipX: function ()
    {
        this.flipX = !this.flipX;

        return this;
    },

    /**
     * Toggles the vertical flipped state of this Game Object.
     * 
     * @method Phaser.GameObjects.Components.Flip#toggleFlipY
     * @since 3.0.0
     * 
     * @return {this} This Game Object instance.
     */
    toggleFlipY: function ()
    {
        this.flipY = !this.flipY;

        return this;
    },

    /**
     * Sets the horizontal flipped state of this Game Object.
     * 
     * @method Phaser.GameObjects.Components.Flip#setFlipX
     * @since 3.0.0
     *
     * @param {boolean} value - The flipped state. `false` for no flip, or `true` to be flipped.
     * 
     * @return {this} This Game Object instance.
     */
    setFlipX: function (value)
    {
        this.flipX = value;

        return this;
    },

    /**
     * Sets the vertical flipped state of this Game Object.
     * 
     * @method Phaser.GameObjects.Components.Flip#setFlipY
     * @since 3.0.0
     *
     * @param {boolean} value - The flipped state. `false` for no flip, or `true` to be flipped.
     * 
     * @return {this} This Game Object instance.
     */
    setFlipY: function (value)
    {
        this.flipY = value;

        return this;
    },

    /**
     * Sets the horizontal and vertical flipped state of this Game Object.
     * 
     * @method Phaser.GameObjects.Components.Flip#setFlip
     * @since 3.0.0
     *
     * @param {boolean} x - The horizontal flipped state. `false` for no flip, or `true` to be flipped.
     * @param {boolean} y - The horizontal flipped state. `false` for no flip, or `true` to be flipped.
     * 
     * @return {this} This Game Object instance.
     */
    setFlip: function (x, y)
    {
        this.flipX = x;
        this.flipY = y;

        return this;
    },

    /**
     * Resets the horizontal and vertical flipped state of this Game Object back to their default un-flipped state.
     * 
     * @method Phaser.GameObjects.Components.Flip#resetFlip
     * @since 3.0.0
     *
     * @return {this} This Game Object instance.
     */
    resetFlip: function ()
    {
        this.flipX = false;
        this.flipY = false;

        return this;
    }

};

module.exports = Flip;


/***/ }),
/* 56 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Provides methods used for setting the depth of a Game Object.
 * Should be applied as a mixin and not used directly.
 * 
 * @name Phaser.GameObjects.Components.Depth
 * @since 3.0.0
 */

var Depth = {

    /**
     * Private internal value. Holds the depth of the Game Object.
     * 
     * @name Phaser.GameObjects.Components.Depth#_depth
     * @type {integer}
     * @private
     * @default 0
     * @since 3.0.0
     */
    _depth: 0,

    /**
     * The depth of this Game Object within the Scene.
     * 
     * The depth is also known as the 'z-index' in some environments, and allows you to change the rendering order
     * of Game Objects, without actually moving their position in the display list.
     *
     * The depth starts from zero (the default value) and increases from that point. A Game Object with a higher depth
     * value will always render in front of one with a lower value.
     *
     * Setting the depth will queue a depth sort event within the Scene.
     * 
     * @name Phaser.GameObjects.Components.Depth#depth
     * @type {number}
     * @since 3.0.0
     */
    depth: {

        get: function ()
        {
            return this._depth;
        },

        set: function (value)
        {
            this.scene.sys.queueDepthSort();
            this._depth = value;
        }

    },

    /**
     * The depth of this Game Object within the Scene.
     * 
     * The depth is also known as the 'z-index' in some environments, and allows you to change the rendering order
     * of Game Objects, without actually moving their position in the display list.
     *
     * The depth starts from zero (the default value) and increases from that point. A Game Object with a higher depth
     * value will always render in front of one with a lower value.
     *
     * Setting the depth will queue a depth sort event within the Scene.
     * 
     * @method Phaser.GameObjects.Components.Depth#setDepth
     * @since 3.0.0
     *
     * @param {integer} value - The depth of this Game Object.
     * 
     * @return {this} This Game Object instance.
     */
    setDepth: function (value)
    {
        if (value === undefined) { value = 0; }

        this.depth = value;

        return this;
    }

};

module.exports = Depth;


/***/ }),
/* 57 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Provides methods used for getting and setting the texture of a Game Object.
 *
 * @name Phaser.GameObjects.Components.Crop
 * @since 3.12.0
 */

var Crop = {

    /**
     * The Texture this Game Object is using to render with.
     *
     * @name Phaser.GameObjects.Components.Crop#texture
     * @type {Phaser.Textures.Texture|Phaser.Textures.CanvasTexture}
     * @since 3.0.0
     */
    texture: null,

    /**
     * The Texture Frame this Game Object is using to render with.
     *
     * @name Phaser.GameObjects.Components.Crop#frame
     * @type {Phaser.Textures.Frame}
     * @since 3.0.0
     */
    frame: null,

    /**
     * A boolean flag indicating if this Game Object is being cropped or not.
     * You can toggle this at any time after `setCrop` has been called, to turn cropping on or off.
     * Equally, calling `setCrop` with no arguments will reset the crop and disable it.
     *
     * @name Phaser.GameObjects.Components.Crop#isCropped
     * @type {boolean}
     * @since 3.11.0
     */
    isCropped: false,

    /**
     * Applies a crop to a texture based Game Object, such as a Sprite or Image.
     * 
     * The crop is a rectangle that limits the area of the texture frame that is visible during rendering.
     * 
     * Cropping a Game Object does not change its size, dimensions, physics body or hit area, it just
     * changes what is shown when rendered.
     * 
     * The crop coordinates are relative to the texture frame, not the Game Object, meaning 0 x 0 is the top-left.
     * 
     * Therefore, if you had a Game Object that had an 800x600 sized texture, and you wanted to show only the left
     * half of it, you could call `setCrop(0, 0, 400, 600)`.
     * 
     * It is also scaled to match the Game Object scale automatically. Therefore a crop rect of 100x50 would crop
     * an area of 200x100 when applied to a Game Object that had a scale factor of 2.
     * 
     * You can either pass in numeric values directly, or you can provide a single Rectangle object as the first argument.
     * 
     * Call this method with no arguments at all to reset the crop, or toggle the property `isCropped` to `false`.
     * 
     * You should do this if the crop rectangle becomes the same size as the frame itself, as it will allow
     * the renderer to skip several internal calculations.
     *
     * @method Phaser.GameObjects.Components.Crop#setCrop
     * @since 3.11.0
     *
     * @param {(number|Phaser.Geom.Rectangle)} [x] - The x coordinate to start the crop from. Or a Phaser.Geom.Rectangle object, in which case the rest of the arguments are ignored.
     * @param {number} [y] - The y coordinate to start the crop from.
     * @param {number} [width] - The width of the crop rectangle in pixels.
     * @param {number} [height] - The height of the crop rectangle in pixels.
     *
     * @return {this} This Game Object instance.
     */
    setCrop: function (x, y, width, height)
    {
        if (x === undefined)
        {
            this.isCropped = false;
        }
        else if (this.frame)
        {
            if (typeof x === 'number')
            {
                this.frame.setCropUVs(this._crop, x, y, width, height, this.flipX, this.flipY);
            }
            else
            {
                var rect = x;

                this.frame.setCropUVs(this._crop, rect.x, rect.y, rect.width, rect.height, this.flipX, this.flipY);
            }

            this.isCropped = true;
        }

        return this;
    },

    /**
     * Internal method that returns a blank, well-formed crop object for use by a Game Object.
     *
     * @method Phaser.GameObjects.Components.Crop#resetCropObject
     * @private
     * @since 3.12.0
     * 
     * @return {object} The crop object.
     */
    resetCropObject: function ()
    {
        return { u0: 0, v0: 0, u1: 0, v1: 0, width: 0, height: 0, x: 0, y: 0, flipX: false, flipY: false, cx: 0, cy: 0, cw: 0, ch: 0 };
    }

};

module.exports = Crop;


/***/ }),
/* 58 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Provides methods used for calculating and setting the size of a non-Frame based Game Object.
 * Should be applied as a mixin and not used directly.
 * 
 * @name Phaser.GameObjects.Components.ComputedSize
 * @since 3.0.0
 */

var ComputedSize = {

    /**
     * The native (un-scaled) width of this Game Object.
     * 
     * Changing this value will not change the size that the Game Object is rendered in-game.
     * For that you need to either set the scale of the Game Object (`setScale`) or use
     * the `displayWidth` property.
     * 
     * @name Phaser.GameObjects.Components.ComputedSize#width
     * @type {number}
     * @since 3.0.0
     */
    width: 0,

    /**
     * The native (un-scaled) height of this Game Object.
     * 
     * Changing this value will not change the size that the Game Object is rendered in-game.
     * For that you need to either set the scale of the Game Object (`setScale`) or use
     * the `displayHeight` property.
     * 
     * @name Phaser.GameObjects.Components.ComputedSize#height
     * @type {number}
     * @since 3.0.0
     */
    height: 0,

    /**
     * The displayed width of this Game Object.
     * 
     * This value takes into account the scale factor.
     * 
     * Setting this value will adjust the Game Object's scale property.
     * 
     * @name Phaser.GameObjects.Components.ComputedSize#displayWidth
     * @type {number}
     * @since 3.0.0
     */
    displayWidth: {

        get: function ()
        {
            return this.scaleX * this.width;
        },

        set: function (value)
        {
            this.scaleX = value / this.width;
        }

    },

    /**
     * The displayed height of this Game Object.
     * 
     * This value takes into account the scale factor.
     * 
     * Setting this value will adjust the Game Object's scale property.
     * 
     * @name Phaser.GameObjects.Components.ComputedSize#displayHeight
     * @type {number}
     * @since 3.0.0
     */
    displayHeight: {

        get: function ()
        {
            return this.scaleY * this.height;
        },

        set: function (value)
        {
            this.scaleY = value / this.height;
        }

    },

    /**
     * Sets the internal size of this Game Object, as used for frame or physics body creation.
     * 
     * This will not change the size that the Game Object is rendered in-game.
     * For that you need to either set the scale of the Game Object (`setScale`) or call the
     * `setDisplaySize` method, which is the same thing as changing the scale but allows you
     * to do so by giving pixel values.
     * 
     * If you have enabled this Game Object for input, changing the size will _not_ change the
     * size of the hit area. To do this you should adjust the `input.hitArea` object directly.
     * 
     * @method Phaser.GameObjects.Components.ComputedSize#setSize
     * @since 3.4.0
     *
     * @param {number} width - The width of this Game Object.
     * @param {number} height - The height of this Game Object.
     * 
     * @return {this} This Game Object instance.
     */
    setSize: function (width, height)
    {
        this.width = width;
        this.height = height;

        return this;
    },

    /**
     * Sets the display size of this Game Object.
     * 
     * Calling this will adjust the scale.
     * 
     * @method Phaser.GameObjects.Components.ComputedSize#setDisplaySize
     * @since 3.4.0
     *
     * @param {number} width - The width of this Game Object.
     * @param {number} height - The height of this Game Object.
     * 
     * @return {this} This Game Object instance.
     */
    setDisplaySize: function (width, height)
    {
        this.displayWidth = width;
        this.displayHeight = height;

        return this;
    }

};

module.exports = ComputedSize;


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var BlendModes = __webpack_require__(18);

/**
 * Provides methods used for setting the blend mode of a Game Object.
 * Should be applied as a mixin and not used directly.
 *
 * @name Phaser.GameObjects.Components.BlendMode
 * @since 3.0.0
 */

var BlendMode = {

    /**
     * Private internal value. Holds the current blend mode.
     * 
     * @name Phaser.GameObjects.Components.BlendMode#_blendMode
     * @type {integer}
     * @private
     * @default 0
     * @since 3.0.0
     */
    _blendMode: BlendModes.NORMAL,

    /**
     * Sets the Blend Mode being used by this Game Object.
     *
     * This can be a const, such as `Phaser.BlendModes.SCREEN`, or an integer, such as 4 (for Overlay)
     *
     * Under WebGL only the following Blend Modes are available:
     *
     * * ADD
     * * MULTIPLY
     * * SCREEN
     *
     * Canvas has more available depending on browser support.
     *
     * You can also create your own custom Blend Modes in WebGL.
     *
     * Blend modes have different effects under Canvas and WebGL, and from browser to browser, depending
     * on support. Blend Modes also cause a WebGL batch flush should it encounter a new blend mode. For these
     * reasons try to be careful about the construction of your Scene and the frequency of which blend modes
     * are used.
     *
     * @name Phaser.GameObjects.Components.BlendMode#blendMode
     * @type {(Phaser.BlendModes|string)}
     * @since 3.0.0
     */
    blendMode: {

        get: function ()
        {
            return this._blendMode;
        },

        set: function (value)
        {
            if (typeof value === 'string')
            {
                value = BlendModes[value];
            }

            value |= 0;

            if (value >= -1)
            {
                this._blendMode = value;
            }
        }

    },

    /**
     * Sets the Blend Mode being used by this Game Object.
     *
     * This can be a const, such as `Phaser.BlendModes.SCREEN`, or an integer, such as 4 (for Overlay)
     *
     * Under WebGL only the following Blend Modes are available:
     *
     * * ADD
     * * MULTIPLY
     * * SCREEN
     *
     * Canvas has more available depending on browser support.
     *
     * You can also create your own custom Blend Modes in WebGL.
     *
     * Blend modes have different effects under Canvas and WebGL, and from browser to browser, depending
     * on support. Blend Modes also cause a WebGL batch flush should it encounter a new blend mode. For these
     * reasons try to be careful about the construction of your Scene and the frequency of which blend modes
     * are used.
     *
     * @method Phaser.GameObjects.Components.BlendMode#setBlendMode
     * @since 3.0.0
     *
     * @param {(string|Phaser.BlendModes)} value - The BlendMode value. Either a string or a CONST.
     *
     * @return {this} This Game Object instance.
     */
    setBlendMode: function (value)
    {
        this.blendMode = value;

        return this;
    }

};

module.exports = BlendMode;


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = __webpack_require__(0);

/**
 * This event is dispatched when an animation starts playing.
 *
 * @event Phaser.GameObjects.Components.Animation#onStartEvent
 * @param {Phaser.Animations.Animation} animation - Reference to the currently playing animation.
 * @param {Phaser.Animations.AnimationFrame} frame - Reference to the current Animation Frame.
 */

/**
 * This event is dispatched when an animation repeats.
 *
 * @event Phaser.GameObjects.Components.Animation#onRepeatEvent
 * @param {Phaser.Animations.Animation} animation - Reference to the currently playing animation.
 * @param {Phaser.Animations.AnimationFrame} frame - Reference to the current Animation Frame.
 * @param {integer} repeatCount - The number of times this animation has repeated.
 */

/**
 * This event is dispatched when an animation updates. This happens when the animation frame changes,
 * based on the animation frame rate and other factors like timeScale and delay.
 *
 * @event Phaser.GameObjects.Components.Animation#onUpdateEvent
 * @param {Phaser.Animations.Animation} animation - Reference to the currently playing animation.
 * @param {Phaser.Animations.AnimationFrame} frame - Reference to the current Animation Frame.
 */

/**
 * This event is dispatched when an animation completes playing, either naturally or via Animation.stop.
 *
 * @event Phaser.GameObjects.Components.Animation#onCompleteEvent
 * @param {Phaser.Animations.Animation} animation - Reference to the currently playing animation.
 * @param {Phaser.Animations.AnimationFrame} frame - Reference to the current Animation Frame.
 */

/**
 * @classdesc
 * A Game Object Animation Controller.
 *
 * This controller lives as an instance within a Game Object, accessible as `sprite.anims`.
 *
 * @class Animation
 * @memberOf Phaser.GameObjects.Components
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject} parent - The Game Object to which this animation controller belongs.
 */
var Animation = new Class({

    initialize:

    function Animation (parent)
    {
        /**
         * The Game Object to which this animation controller belongs.
         *
         * @name Phaser.GameObjects.Components.Animation#parent
         * @type {Phaser.GameObjects.GameObject}
         * @since 3.0.0
         */
        this.parent = parent;

        /**
         * A reference to the global Animation Manager.
         *
         * @name Phaser.GameObjects.Components.Animation#animationManager
         * @type {Phaser.Animations.AnimationManager}
         * @since 3.0.0
         */
        this.animationManager = parent.scene.sys.anims;

        this.animationManager.once('remove', this.remove, this);

        /**
         * Is an animation currently playing or not?
         *
         * @name Phaser.GameObjects.Components.Animation#isPlaying
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.isPlaying = false;

        /**
         * The current Animation loaded into this Animation Controller.
         *
         * @name Phaser.GameObjects.Components.Animation#currentAnim
         * @type {?Phaser.Animations.Animation}
         * @default null
         * @since 3.0.0
         */
        this.currentAnim = null;

        /**
         * The current AnimationFrame being displayed by this Animation Controller.
         *
         * @name Phaser.GameObjects.Components.Animation#currentFrame
         * @type {?Phaser.Animations.AnimationFrame}
         * @default null
         * @since 3.0.0
         */
        this.currentFrame = null;

        /**
         * Time scale factor.
         *
         * @name Phaser.GameObjects.Components.Animation#_timeScale
         * @type {number}
         * @private
         * @default 1
         * @since 3.0.0
         */
        this._timeScale = 1;

        /**
         * The frame rate of playback in frames per second.
         * The default is 24 if the `duration` property is `null`.
         *
         * @name Phaser.GameObjects.Components.Animation#frameRate
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.frameRate = 0;

        /**
         * How long the animation should play for, in milliseconds.
         * If the `frameRate` property has been set then it overrides this value,
         * otherwise the `frameRate` is derived from `duration`.
         *
         * @name Phaser.GameObjects.Components.Animation#duration
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.duration = 0;

        /**
         * ms per frame, not including frame specific modifiers that may be present in the Animation data.
         *
         * @name Phaser.GameObjects.Components.Animation#msPerFrame
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.msPerFrame = 0;

        /**
         * Skip frames if the time lags, or always advanced anyway?
         *
         * @name Phaser.GameObjects.Components.Animation#skipMissedFrames
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.skipMissedFrames = true;

        /**
         * A delay before starting playback, in milliseconds.
         *
         * @name Phaser.GameObjects.Components.Animation#_delay
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._delay = 0;

        /**
         * Number of times to repeat the animation (-1 for infinity)
         *
         * @name Phaser.GameObjects.Components.Animation#_repeat
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._repeat = 0;

        /**
         * Delay before the repeat starts, in milliseconds.
         *
         * @name Phaser.GameObjects.Components.Animation#_repeatDelay
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._repeatDelay = 0;

        /**
         * Should the animation yoyo? (reverse back down to the start) before repeating?
         *
         * @name Phaser.GameObjects.Components.Animation#_yoyo
         * @type {boolean}
         * @private
         * @default false
         * @since 3.0.0
         */
        this._yoyo = false;

        /**
         * Will the playhead move forwards (`true`) or in reverse (`false`).
         *
         * @name Phaser.GameObjects.Components.Animation#forward
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.forward = true;

        /**
         * An Internal trigger that's play the animation in reverse mode ('true') or not ('false'),
         * needed because forward can be changed by yoyo feature.
         *
         * @name Phaser.GameObjects.Components.Animation#forward
         * @type {boolean}
         * @default false
         * @since 3.12.0
         */
        this._reverse = false;

        /**
         * Internal time overflow accumulator.
         *
         * @name Phaser.GameObjects.Components.Animation#accumulator
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.accumulator = 0;

        /**
         * The time point at which the next animation frame will change.
         *
         * @name Phaser.GameObjects.Components.Animation#nextTick
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.nextTick = 0;

        /**
         * An internal counter keeping track of how many repeats are left to play.
         *
         * @name Phaser.GameObjects.Components.Animation#repeatCounter
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.repeatCounter = 0;

        /**
         * An internal flag keeping track of pending repeats.
         *
         * @name Phaser.GameObjects.Components.Animation#pendingRepeat
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.pendingRepeat = false;

        /**
         * Is the Animation paused?
         *
         * @name Phaser.GameObjects.Components.Animation#_paused
         * @type {boolean}
         * @private
         * @default false
         * @since 3.0.0
         */
        this._paused = false;

        /**
         * Was the animation previously playing before being paused?
         *
         * @name Phaser.GameObjects.Components.Animation#_wasPlaying
         * @type {boolean}
         * @private
         * @default false
         * @since 3.0.0
         */
        this._wasPlaying = false;

        /**
         * Internal property tracking if this Animation is waiting to stop.
         *
         * 0 = No
         * 1 = Waiting for ms to pass
         * 2 = Waiting for repeat
         * 3 = Waiting for specific frame
         *
         * @name Phaser.GameObjects.Components.Animation#_pendingStop
         * @type {integer}
         * @private
         * @since 3.4.0
         */
        this._pendingStop = 0;

        /**
         * Internal property used by _pendingStop.
         *
         * @name Phaser.GameObjects.Components.Animation#_pendingStopValue
         * @type {any}
         * @private
         * @since 3.4.0
         */
        this._pendingStopValue;
    },

    /**
     * Sets the amount of time, in milliseconds, that the animation will be delayed before starting playback.
     *
     * @method Phaser.GameObjects.Components.Animation#setDelay
     * @since 3.4.0
     *
     * @param {integer} [value=0] - The amount of time, in milliseconds, to wait before starting playback.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    setDelay: function (value)
    {
        if (value === undefined) { value = 0; }

        this._delay = value;

        return this.parent;
    },

    /**
     * Gets the amount of time, in milliseconds that the animation will be delayed before starting playback.
     *
     * @method Phaser.GameObjects.Components.Animation#getDelay
     * @since 3.4.0
     *
     * @return {integer} The amount of time, in milliseconds, the Animation will wait before starting playback.
     */
    getDelay: function ()
    {
        return this._delay;
    },

    /**
     * Waits for the specified delay, in milliseconds, then starts playback of the requested animation.
     *
     * @method Phaser.GameObjects.Components.Animation#delayedPlay
     * @since 3.0.0
     *
     * @param {integer} delay - The delay, in milliseconds, to wait before starting the animation playing.
     * @param {string} key - The key of the animation to play.
     * @param {integer} [startFrame=0] - The frame of the animation to start from.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    delayedPlay: function (delay, key, startFrame)
    {
        this.play(key, true, startFrame);

        this.nextTick += delay;

        return this.parent;
    },

    /**
     * Returns the key of the animation currently loaded into this component.
     *
     * @method Phaser.GameObjects.Components.Animation#getCurrentKey
     * @since 3.0.0
     *
     * @return {string} The key of the Animation loaded into this component.
     */
    getCurrentKey: function ()
    {
        if (this.currentAnim)
        {
            return this.currentAnim.key;
        }
    },

    /**
     * Internal method used to load an animation into this component.
     *
     * @method Phaser.GameObjects.Components.Animation#load
     * @protected
     * @since 3.0.0
     *
     * @param {string} key - The key of the animation to load.
     * @param {integer} [startFrame=0] - The start frame of the animation to load.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    load: function (key, startFrame)
    {
        if (startFrame === undefined) { startFrame = 0; }

        if (this.isPlaying)
        {
            this.stop();
        }

        //  Load the new animation in
        this.animationManager.load(this, key, startFrame);

        return this.parent;
    },

    /**
     * Pause the current animation and set the `isPlaying` property to `false`.
     * You can optionally pause it at a specific frame.
     *
     * @method Phaser.GameObjects.Components.Animation#pause
     * @since 3.0.0
     *
     * @param {Phaser.Animations.AnimationFrame} [atFrame] - An optional frame to set after pausing the animation.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    pause: function (atFrame)
    {
        if (!this._paused)
        {
            this._paused = true;
            this._wasPlaying = this.isPlaying;
            this.isPlaying = false;
        }

        if (atFrame !== undefined)
        {
            this.updateFrame(atFrame);
        }

        return this.parent;
    },

    /**
     * Resumes playback of a paused animation and sets the `isPlaying` property to `true`.
     * You can optionally tell it to start playback from a specific frame.
     *
     * @method Phaser.GameObjects.Components.Animation#resume
     * @since 3.0.0
     *
     * @param {Phaser.Animations.AnimationFrame} [fromFrame] - An optional frame to set before restarting playback.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    resume: function (fromFrame)
    {
        if (this._paused)
        {
            this._paused = false;
            this.isPlaying = this._wasPlaying;
        }

        if (fromFrame !== undefined)
        {
            this.updateFrame(fromFrame);
        }

        return this.parent;
    },

    /**
     * `true` if the current animation is paused, otherwise `false`.
     *
     * @name Phaser.GameObjects.Components.Animation#isPaused
     * @readOnly
     * @type {boolean}
     * @since 3.4.0
     */
    isPaused: {

        get: function ()
        {
            return this._paused;
        }

    },

    /**
     * Plays an Animation on the Game Object that owns this Animation Component.
     *
     * @method Phaser.GameObjects.Components.Animation#play
     * @fires Phaser.GameObjects.Components.Animation#onStartEvent
     * @since 3.0.0
     *
     * @param {string} key - The string-based key of the animation to play, as defined previously in the Animation Manager.
     * @param {boolean} [ignoreIfPlaying=false] - If an animation is already playing then ignore this call.
     * @param {integer} [startFrame=0] - Optionally start the animation playing from this frame index.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    play: function (key, ignoreIfPlaying, startFrame)
    {
        if (ignoreIfPlaying === undefined) { ignoreIfPlaying = false; }
        if (startFrame === undefined) { startFrame = 0; }

        if (ignoreIfPlaying && this.isPlaying && this.currentAnim.key === key)
        {
            return this.parent;
        }

        this.forward = true;
        this._reverse = false;
        return this._startAnimation(key, startFrame);
    },

    /**
     * Plays an Animation (in reverse mode) on the Game Object that owns this Animation Component.
     *
     * @method Phaser.GameObjects.Components.Animation#playReverse
     * @fires Phaser.GameObjects.Components.Animation#onStartEvent
     * @since 3.12.0
     *
     * @param {string} key - The string-based key of the animation to play, as defined previously in the Animation Manager.
     * @param {boolean} [ignoreIfPlaying=false] - If an animation is already playing then ignore this call.
     * @param {integer} [startFrame=0] - Optionally start the animation playing from this frame index.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    playReverse: function (key, ignoreIfPlaying, startFrame)
    {
        if (ignoreIfPlaying === undefined) { ignoreIfPlaying = false; }
        if (startFrame === undefined) { startFrame = 0; }

        if (ignoreIfPlaying && this.isPlaying && this.currentAnim.key === key)
        {
            return this.parent;
        }

        this.forward = false;
        this._reverse = true;
        return this._startAnimation(key, startFrame);
    },

    /**
     * Load an Animation and fires 'onStartEvent' event,
     * extracted from 'play' method
     *
     * @method Phaser.GameObjects.Components.Animation#_startAnimation
     * @fires Phaser.GameObjects.Components.Animation#onStartEvent
     * @since 3.12.0
     *
     * @param {string} key - The string-based key of the animation to play, as defined previously in the Animation Manager.
     * @param {integer} [startFrame=0] - Optionally start the animation playing from this frame index.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    _startAnimation: function (key, startFrame)
    {
        this.load(key, startFrame);

        var anim = this.currentAnim;
        var gameObject = this.parent;

        //  Should give us 9,007,199,254,740,991 safe repeats
        this.repeatCounter = (this._repeat === -1) ? Number.MAX_VALUE : this._repeat;

        anim.getFirstTick(this);

        this.isPlaying = true;
        this.pendingRepeat = false;

        if (anim.showOnStart)
        {
            gameObject.visible = true;
        }

        gameObject.emit('animationstart', this.currentAnim, this.currentFrame);

        return gameObject;
    },

    /**
     * Reverse an Animation that is already playing on the Game Object.
     *
     * @method Phaser.GameObjects.Components.Animation#reverse
     * @since 3.12.0
     *
     * @param {string} key - The string-based key of the animation to play, as defined previously in the Animation Manager.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    reverse: function (key)
    {
        if (!this.isPlaying || this.currentAnim.key !== key) { return this.parent; }
        this._reverse = !this._reverse;
        this.forward = !this.forward;

        return this.parent;
    },

    /**
     * Returns a value between 0 and 1 indicating how far this animation is through, ignoring repeats and yoyos.
     * If the animation has a non-zero repeat defined, `getProgress` and `getTotalProgress` will be different
     * because `getProgress` doesn't include any repeats or repeat delays, whereas `getTotalProgress` does.
     *
     * @method Phaser.GameObjects.Components.Animation#getProgress
     * @since 3.4.0
     *
     * @return {number} The progress of the current animation, between 0 and 1.
     */
    getProgress: function ()
    {
        var p = this.currentFrame.progress;

        if (!this.forward)
        {
            p = 1 - p;
        }

        return p;
    },

    /**
     * Takes a value between 0 and 1 and uses it to set how far this animation is through playback.
     * Does not factor in repeats or yoyos, but does handle playing forwards or backwards.
     *
     * @method Phaser.GameObjects.Components.Animation#setProgress
     * @since 3.4.0
     *
     * @param {number} [value=0] - The progress value, between 0 and 1.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    setProgress: function (value)
    {
        if (!this.forward)
        {
            value = 1 - value;
        }

        this.setCurrentFrame(this.currentAnim.getFrameByProgress(value));

        return this.parent;
    },

    /**
     * Handle the removal of an animation from the Animation Manager.
     *
     * @method Phaser.GameObjects.Components.Animation#remove
     * @since 3.0.0
     *
     * @param {string} [key] - The key of the removed Animation.
     * @param {Phaser.Animations.Animation} [animation] - The removed Animation.
     */
    remove: function (key, animation)
    {
        if (animation === undefined) { animation = this.currentAnim; }

        if (this.isPlaying && animation.key === this.currentAnim.key)
        {
            this.stop();

            this.setCurrentFrame(this.currentAnim.frames[0]);
        }
    },

    /**
     * Gets the number of times that the animation will repeat
     * after its first iteration. For example, if returns 1, the animation will
     * play a total of twice (the initial play plus 1 repeat).
     * A value of -1 means the animation will repeat indefinitely.
     *
     * @method Phaser.GameObjects.Components.Animation#getRepeat
     * @since 3.4.0
     *
     * @return {integer} The number of times that the animation will repeat.
     */
    getRepeat: function ()
    {
        return this._repeat;
    },

    /**
     * Sets the number of times that the animation should repeat
     * after its first iteration. For example, if repeat is 1, the animation will
     * play a total of twice (the initial play plus 1 repeat).
     * To repeat indefinitely, use -1. repeat should always be an integer.
     *
     * @method Phaser.GameObjects.Components.Animation#setRepeat
     * @since 3.4.0
     *
     * @param {integer} value - The number of times that the animation should repeat.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    setRepeat: function (value)
    {
        this._repeat = value;

        this.repeatCounter = 0;

        return this.parent;
    },

    /**
     * Gets the amount of delay between repeats, if any.
     *
     * @method Phaser.GameObjects.Components.Animation#getRepeatDelay
     * @since 3.4.0
     *
     * @return {number} The delay between repeats.
     */
    getRepeatDelay: function ()
    {
        return this._repeatDelay;
    },

    /**
     * Sets the amount of time in seconds between repeats.
     * For example, if `repeat` is 2 and `repeatDelay` is 10, the animation will play initially,
     * then wait for 10 seconds before repeating, then play again, then wait another 10 seconds
     * before doing its final repeat.
     *
     * @method Phaser.GameObjects.Components.Animation#setRepeatDelay
     * @since 3.4.0
     *
     * @param {number} value - The delay to wait between repeats, in seconds.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    setRepeatDelay: function (value)
    {
        this._repeatDelay = value;

        return this.parent;
    },

    /**
     * Restarts the current animation from its beginning, optionally including its delay value.
     *
     * @method Phaser.GameObjects.Components.Animation#restart
     * @since 3.0.0
     *
     * @param {boolean} [includeDelay=false] - Whether to include the delay value of the animation when restarting.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    restart: function (includeDelay)
    {
        if (includeDelay === undefined) { includeDelay = false; }

        this.currentAnim.getFirstTick(this, includeDelay);

        this.forward = true;
        this.isPlaying = true;
        this.pendingRepeat = false;
        this._paused = false;

        //  Set frame
        this.updateFrame(this.currentAnim.frames[0]);

        return this.parent;
    },

    /**
     * Immediately stops the current animation from playing and dispatches the `animationcomplete` event.
     *
     * @method Phaser.GameObjects.Components.Animation#stop
     * @fires Phaser.GameObjects.Components.Animation#onCompleteEvent
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    stop: function ()
    {
        this._pendingStop = 0;

        this.isPlaying = false;

        var gameObject = this.parent;

        gameObject.emit('animationcomplete', this.currentAnim, this.currentFrame);

        return gameObject;
    },

    /**
     * Stops the current animation from playing after the specified time delay, given in milliseconds.
     *
     * @method Phaser.GameObjects.Components.Animation#stopAfterDelay
     * @fires Phaser.GameObjects.Components.Animation#onCompleteEvent
     * @since 3.4.0
     *
     * @param {integer} delay - The number of milliseconds to wait before stopping this animation.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    stopAfterDelay: function (delay)
    {
        this._pendingStop = 1;
        this._pendingStopValue = delay;

        return this.parent;
    },

    /**
     * Stops the current animation from playing when it next repeats.
     *
     * @method Phaser.GameObjects.Components.Animation#stopOnRepeat
     * @fires Phaser.GameObjects.Components.Animation#onCompleteEvent
     * @since 3.4.0
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    stopOnRepeat: function ()
    {
        this._pendingStop = 2;

        return this.parent;
    },

    /**
     * Stops the current animation from playing when it next sets the given frame.
     * If this frame doesn't exist within the animation it will not stop it from playing.
     *
     * @method Phaser.GameObjects.Components.Animation#stopOnFrame
     * @fires Phaser.GameObjects.Components.Animation#onCompleteEvent
     * @since 3.4.0
     *
     * @param {Phaser.Animations.AnimationFrame} delay - The frame to check before stopping this animation.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    stopOnFrame: function (frame)
    {
        this._pendingStop = 3;
        this._pendingStopValue = frame;

        return this.parent;
    },

    /**
     * Sets the Time Scale factor, allowing you to make the animation go go faster or slower than default.
     * Where 1 = normal speed (the default), 0.5 = half speed, 2 = double speed, etc.
     *
     * @method Phaser.GameObjects.Components.Animation#setTimeScale
     * @since 3.4.0
     *
     * @param {number} [value=1] - The time scale factor, where 1 is no change, 0.5 is half speed, etc.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    setTimeScale: function (value)
    {
        if (value === undefined) { value = 1; }

        this._timeScale = value;

        return this.parent;
    },

    /**
     * Gets the Time Scale factor.
     *
     * @method Phaser.GameObjects.Components.Animation#getTimeScale
     * @since 3.4.0
     *
     * @return {number} The Time Scale value.
     */
    getTimeScale: function ()
    {
        return this._timeScale;
    },

    /**
     * Returns the total number of frames in this animation.
     *
     * @method Phaser.GameObjects.Components.Animation#getTotalFrames
     * @since 3.4.0
     *
     * @return {integer} The total number of frames in this animation.
     */
    getTotalFrames: function ()
    {
        return this.currentAnim.frames.length;
    },

    /**
     * The internal update loop for the Animation Component.
     *
     * @method Phaser.GameObjects.Components.Animation#update
     * @since 3.0.0
     *
     * @param {number} time - The current timestamp.
     * @param {number} delta - The delta time, in ms, elapsed since the last frame.
     */
    update: function (time, delta)
    {
        if (!this.currentAnim || !this.isPlaying || this.currentAnim.paused)
        {
            return;
        }

        this.accumulator += delta * this._timeScale;

        if (this._pendingStop === 1)
        {
            this._pendingStopValue -= delta;

            if (this._pendingStopValue <= 0)
            {
                return this.currentAnim.completeAnimation(this);
            }
        }

        if (this.accumulator >= this.nextTick)
        {
            this.currentAnim.setFrame(this);
        }
    },

    /**
     * Sets the given Animation Frame as being the current frame
     * and applies it to the parent Game Object, adjusting its size and origin as needed.
     *
     * @method Phaser.GameObjects.Components.Animation#setCurrentFrame
     * @since 3.4.0
     *
     * @param {Phaser.Animations.AnimationFrame} animationFrame - The Animation Frame to set as being current.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object this Animation Component belongs to.
     */
    setCurrentFrame: function (animationFrame)
    {
        var gameObject = this.parent;

        this.currentFrame = animationFrame;

        gameObject.texture = animationFrame.frame.texture;
        gameObject.frame = animationFrame.frame;

        gameObject.setSizeToFrame();

        if (animationFrame.frame.customPivot)
        {
            gameObject.setOrigin(animationFrame.frame.pivotX, animationFrame.frame.pivotY);
        }
        else
        {
            gameObject.updateDisplayOrigin();
        }

        return gameObject;
    },

    /**
     * Internal frame change handler.
     *
     * @method Phaser.GameObjects.Components.Animation#updateFrame
     * @fires Phaser.GameObjects.Components.Animation#onUpdateEvent
     * @private
     * @since 3.0.0
     *
     * @param {Phaser.Animations.AnimationFrame} animationFrame - The animation frame to change to.
     */
    updateFrame: function (animationFrame)
    {
        var gameObject = this.setCurrentFrame(animationFrame);

        if (this.isPlaying)
        {
            if (animationFrame.setAlpha)
            {
                gameObject.alpha = animationFrame.alpha;
            }

            var anim = this.currentAnim;

            gameObject.emit('animationupdate', anim, animationFrame);

            if (this._pendingStop === 3 && this._pendingStopValue === animationFrame)
            {
                this.currentAnim.completeAnimation(this);
            }
        }
    },

    /**
     * Sets if the current Animation will yoyo when it reaches the end.
     * A yoyo'ing animation will play through consecutively, and then reverse-play back to the start again.
     *
     * @method Phaser.GameObjects.Components.Animation#setYoyo
     * @since 3.4.0
     *
     * @param {boolean} [value=false] - `true` if the animation should yoyo, `false` to not.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object this Animation Component belongs to.
     */
    setYoyo: function (value)
    {
        if (value === undefined) { value = false; }

        this._yoyo = value;

        return this.parent;
    },

    /**
     * Gets if the current Animation will yoyo when it reaches the end.
     * A yoyo'ing animation will play through consecutively, and then reverse-play back to the start again.
     *
     * @method Phaser.GameObjects.Components.Animation#getYoyo
     * @since 3.4.0
     *
     * @return {boolean} `true` if the animation is set to yoyo, `false` if not.
     */
    getYoyo: function ()
    {
        return this._yoyo;
    },

    /**
     * Destroy this Animation component.
     *
     * Unregisters event listeners and cleans up its references.
     *
     * @method Phaser.GameObjects.Components.Animation#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.animationManager.off('remove', this.remove, this);

        this.animationManager = null;
        this.parent = null;

        this.currentAnim = null;
        this.currentFrame = null;
    }

});

module.exports = Animation;


/***/ }),
/* 61 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Force a value within the boundaries by clamping it to the range `min`, `max`.
 *
 * @function Phaser.Math.Clamp
 * @since 3.0.0
 *
 * @param {number} value - The value to be clamped.
 * @param {number} min - The minimum bounds.
 * @param {number} max - The maximum bounds.
 *
 * @return {number} The clamped value.
 */
var Clamp = function (value, min, max)
{
    return Math.max(min, Math.min(max, value));
};

module.exports = Clamp;


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Clamp = __webpack_require__(61);

//  bitmask flag for GameObject.renderMask
var _FLAG = 2; // 0010

/**
 * Provides methods used for setting the alpha properties of a Game Object.
 * Should be applied as a mixin and not used directly.
 *
 * @name Phaser.GameObjects.Components.Alpha
 * @since 3.0.0
 */

var Alpha = {

    /**
     * Private internal value. Holds the global alpha value.
     *
     * @name Phaser.GameObjects.Components.Alpha#_alpha
     * @type {number}
     * @private
     * @default 1
     * @since 3.0.0
     */
    _alpha: 1,

    /**
     * Private internal value. Holds the top-left alpha value.
     *
     * @name Phaser.GameObjects.Components.Alpha#_alphaTL
     * @type {number}
     * @private
     * @default 1
     * @since 3.0.0
     */
    _alphaTL: 1,

    /**
     * Private internal value. Holds the top-right alpha value.
     *
     * @name Phaser.GameObjects.Components.Alpha#_alphaTR
     * @type {number}
     * @private
     * @default 1
     * @since 3.0.0
     */
    _alphaTR: 1,

    /**
     * Private internal value. Holds the bottom-left alpha value.
     *
     * @name Phaser.GameObjects.Components.Alpha#_alphaBL
     * @type {number}
     * @private
     * @default 1
     * @since 3.0.0
     */
    _alphaBL: 1,

    /**
     * Private internal value. Holds the bottom-right alpha value.
     *
     * @name Phaser.GameObjects.Components.Alpha#_alphaBR
     * @type {number}
     * @private
     * @default 1
     * @since 3.0.0
     */
    _alphaBR: 1,

    /**
     * Clears all alpha values associated with this Game Object.
     *
     * Immediately sets the alpha levels back to 1 (fully opaque).
     *
     * @method Phaser.GameObjects.Components.Alpha#clearAlpha
     * @since 3.0.0
     *
     * @return {this} This Game Object instance.
     */
    clearAlpha: function ()
    {
        return this.setAlpha(1);
    },

    /**
     * Set the Alpha level of this Game Object. The alpha controls the opacity of the Game Object as it renders.
     * Alpha values are provided as a float between 0, fully transparent, and 1, fully opaque.
     *
     * If your game is running under WebGL you can optionally specify four different alpha values, each of which
     * correspond to the four corners of the Game Object. Under Canvas only the `topLeft` value given is used.
     *
     * @method Phaser.GameObjects.Components.Alpha#setAlpha
     * @since 3.0.0
     *
     * @param {number} [topLeft=1] - The alpha value used for the top-left of the Game Object. If this is the only value given it's applied across the whole Game Object.
     * @param {number} [topRight] - The alpha value used for the top-right of the Game Object. WebGL only.
     * @param {number} [bottomLeft] - The alpha value used for the bottom-left of the Game Object. WebGL only.
     * @param {number} [bottomRight] - The alpha value used for the bottom-right of the Game Object. WebGL only.
     *
     * @return {this} This Game Object instance.
     */
    setAlpha: function (topLeft, topRight, bottomLeft, bottomRight)
    {
        if (topLeft === undefined) { topLeft = 1; }

        //  Treat as if there is only one alpha value for the whole Game Object
        if (topRight === undefined)
        {
            this.alpha = topLeft;
        }
        else
        {
            this._alphaTL = Clamp(topLeft, 0, 1);
            this._alphaTR = Clamp(topRight, 0, 1);
            this._alphaBL = Clamp(bottomLeft, 0, 1);
            this._alphaBR = Clamp(bottomRight, 0, 1);
        }

        return this;
    },

    /**
     * The alpha value of the Game Object.
     *
     * This is a global value, impacting the entire Game Object, not just a region of it.
     *
     * @name Phaser.GameObjects.Components.Alpha#alpha
     * @type {number}
     * @since 3.0.0
     */
    alpha: {

        get: function ()
        {
            return this._alpha;
        },

        set: function (value)
        {
            var v = Clamp(value, 0, 1);

            this._alpha = v;
            this._alphaTL = v;
            this._alphaTR = v;
            this._alphaBL = v;
            this._alphaBR = v;

            if (v === 0)
            {
                this.renderFlags &= ~_FLAG;
            }
            else
            {
                this.renderFlags |= _FLAG;
            }
        }

    },

    /**
     * The alpha value starting from the top-left of the Game Object.
     * This value is interpolated from the corner to the center of the Game Object.
     *
     * @name Phaser.GameObjects.Components.Alpha#alphaTopLeft
     * @type {number}
     * @webglOnly
     * @since 3.0.0
     */
    alphaTopLeft: {

        get: function ()
        {
            return this._alphaTL;
        },

        set: function (value)
        {
            var v = Clamp(value, 0, 1);

            this._alphaTL = v;

            if (v !== 0)
            {
                this.renderFlags |= _FLAG;
            }
        }

    },

    /**
     * The alpha value starting from the top-right of the Game Object.
     * This value is interpolated from the corner to the center of the Game Object.
     *
     * @name Phaser.GameObjects.Components.Alpha#alphaTopRight
     * @type {number}
     * @webglOnly
     * @since 3.0.0
     */
    alphaTopRight: {

        get: function ()
        {
            return this._alphaTR;
        },

        set: function (value)
        {
            var v = Clamp(value, 0, 1);

            this._alphaTR = v;

            if (v !== 0)
            {
                this.renderFlags |= _FLAG;
            }
        }

    },

    /**
     * The alpha value starting from the bottom-left of the Game Object.
     * This value is interpolated from the corner to the center of the Game Object.
     *
     * @name Phaser.GameObjects.Components.Alpha#alphaBottomLeft
     * @type {number}
     * @webglOnly
     * @since 3.0.0
     */
    alphaBottomLeft: {

        get: function ()
        {
            return this._alphaBL;
        },

        set: function (value)
        {
            var v = Clamp(value, 0, 1);

            this._alphaBL = v;

            if (v !== 0)
            {
                this.renderFlags |= _FLAG;
            }
        }

    },

    /**
     * The alpha value starting from the bottom-right of the Game Object.
     * This value is interpolated from the corner to the center of the Game Object.
     *
     * @name Phaser.GameObjects.Components.Alpha#alphaBottomRight
     * @type {number}
     * @webglOnly
     * @since 3.0.0
     */
    alphaBottomRight: {

        get: function ()
        {
            return this._alphaBR;
        },

        set: function (value)
        {
            var v = Clamp(value, 0, 1);

            this._alphaBR = v;

            if (v !== 0)
            {
                this.renderFlags |= _FLAG;
            }
        }

    }

};

module.exports = Alpha;


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = __webpack_require__(0);

/**
 * @callback EachSetCallback
 * @generic E - [entry]
 *
 * @param {*} entry - [description]
 * @param {number} index - [description]
 *
 * @return {?boolean} [description]
 */

/**
 * @classdesc
 * A Set is a collection of unique elements.
 *
 * @class Set
 * @memberOf Phaser.Structs
 * @constructor
 * @since 3.0.0
 *
 * @generic T
 * @genericUse {T[]} - [elements]
 *
 * @param {Array.<*>} [elements] - [description]
 */
var Set = new Class({

    initialize:

    function Set (elements)
    {
        /**
         * [description]
         *
         * @genericUse {T[]} - [$type]
         *
         * @name Phaser.Structs.Set#entries
         * @type {Array.<*>}
         * @default []
         * @since 3.0.0
         */
        this.entries = [];

        if (Array.isArray(elements))
        {
            for (var i = 0; i < elements.length; i++)
            {
                this.set(elements[i]);
            }
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.Set#set
     * @since 3.0.0
     *
     * @genericUse {T} - [value]
     * @genericUse {Phaser.Structs.Set.<T>} - [$return]
     *
     * @param {*} value - [description]
     *
     * @return {Phaser.Structs.Set} This Set object.
     */
    set: function (value)
    {
        if (this.entries.indexOf(value) === -1)
        {
            this.entries.push(value);
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.Set#get
     * @since 3.0.0
     *
     * @genericUse {T} - [value,$return]
     *
     * @param {string} property - [description]
     * @param {*} value - [description]
     *
     * @return {*} [description]
     */
    get: function (property, value)
    {
        for (var i = 0; i < this.entries.length; i++)
        {
            var entry = this.entries[i];

            if (entry[property] === value)
            {
                return entry;
            }
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.Set#getArray
     * @since 3.0.0
     *
     * @genericUse {T[]} - [$return]
     *
     * @return {Array.<*>} [description]
     */
    getArray: function ()
    {
        return this.entries.slice(0);
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.Set#delete
     * @since 3.0.0
     *
     * @genericUse {T} - [value]
     * @genericUse {Phaser.Structs.Set.<T>} - [$return]
     *
     * @param {*} value - [description]
     *
     * @return {Phaser.Structs.Set} This Set object.
     */
    delete: function (value)
    {
        var index = this.entries.indexOf(value);

        if (index > -1)
        {
            this.entries.splice(index, 1);
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.Set#dump
     * @since 3.0.0
     */
    dump: function ()
    {
        // eslint-disable-next-line no-console
        console.group('Set');

        for (var i = 0; i < this.entries.length; i++)
        {
            var entry = this.entries[i];
            console.log(entry);
        }

        // eslint-disable-next-line no-console
        console.groupEnd();
    },

    /**
     * For when you know this Set will be modified during the iteration.
     *
     * @method Phaser.Structs.Set#each
     * @since 3.0.0
     *
     * @genericUse {EachSetCallback.<T>} - [callback]
     * @genericUse {Phaser.Structs.Set.<T>} - [$return]
     *
     * @param {EachSetCallback} callback - [description]
     * @param {*} callbackScope - [description]
     *
     * @return {Phaser.Structs.Set} This Set object.
     */
    each: function (callback, callbackScope)
    {
        var i;
        var temp = this.entries.slice();
        var len = temp.length;

        if (callbackScope)
        {
            for (i = 0; i < len; i++)
            {
                if (callback.call(callbackScope, temp[i], i) === false)
                {
                    break;
                }
            }
        }
        else
        {
            for (i = 0; i < len; i++)
            {
                if (callback(temp[i], i) === false)
                {
                    break;
                }
            }
        }

        return this;
    },

    /**
     * For when you absolutely know this Set won't be modified during the iteration.
     *
     * @method Phaser.Structs.Set#iterate
     * @since 3.0.0
     *
     * @genericUse {EachSetCallback.<T>} - [callback]
     * @genericUse {Phaser.Structs.Set.<T>} - [$return]
     *
     * @param {EachSetCallback} callback - [description]
     * @param {*} [callbackScope] - [description]
     *
     * @return {Phaser.Structs.Set} This Set object.
     */
    iterate: function (callback, callbackScope)
    {
        var i;
        var len = this.entries.length;

        if (callbackScope)
        {
            for (i = 0; i < len; i++)
            {
                if (callback.call(callbackScope, this.entries[i], i) === false)
                {
                    break;
                }
            }
        }
        else
        {
            for (i = 0; i < len; i++)
            {
                if (callback(this.entries[i], i) === false)
                {
                    break;
                }
            }
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.Set#iterateLocal
     * @since 3.0.0
     *
     * @genericUse {Phaser.Structs.Set.<T>} - [$return]
     *
     * @param {string} callbackKey - [description]
     * @param {...*} [args] - Additional arguments that will be passed to the callback, after the child.
     *
     * @return {Phaser.Structs.Set} This Set object.
     */
    iterateLocal: function (callbackKey)
    {
        var i;
        var args = [];

        for (i = 1; i < arguments.length; i++)
        {
            args.push(arguments[i]);
        }

        var len = this.entries.length;

        for (i = 0; i < len; i++)
        {
            var entry = this.entries[i];

            entry[callbackKey].apply(entry, args);
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.Set#clear
     * @since 3.0.0
     *
     * @genericUse {Phaser.Structs.Set.<T>} - [$return]
     *
     * @return {Phaser.Structs.Set} This Set object.
     */
    clear: function ()
    {
        this.entries.length = 0;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.Set#contains
     * @since 3.0.0
     *
     * @genericUse {T} - [value]
     *
     * @param {*} value - [description]
     *
     * @return {boolean} [description]
     */
    contains: function (value)
    {
        return (this.entries.indexOf(value) > -1);
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.Set#union
     * @since 3.0.0
     *
     * @genericUse {Phaser.Structs.Set.<T>} - [set,$return]
     *
     * @param {Phaser.Structs.Set} set - [description]
     *
     * @return {Phaser.Structs.Set} [description]
     */
    union: function (set)
    {
        var newSet = new Set();

        set.entries.forEach(function (value)
        {
            newSet.set(value);
        });

        this.entries.forEach(function (value)
        {
            newSet.set(value);
        });

        return newSet;
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.Set#intersect
     * @since 3.0.0
     *
     * @genericUse {Phaser.Structs.Set.<T>} - [set,$return]
     *
     * @param {Phaser.Structs.Set} set - [description]
     *
     * @return {Phaser.Structs.Set} [description]
     */
    intersect: function (set)
    {
        var newSet = new Set();

        this.entries.forEach(function (value)
        {
            if (set.contains(value))
            {
                newSet.set(value);
            }
        });

        return newSet;
    },

    /**
     * [description]
     *
     * @method Phaser.Structs.Set#difference
     * @since 3.0.0
     *
     * @genericUse {Phaser.Structs.Set.<T>} - [set,$return]
     *
     * @param {Phaser.Structs.Set} set - [description]
     *
     * @return {Phaser.Structs.Set} [description]
     */
    difference: function (set)
    {
        var newSet = new Set();

        this.entries.forEach(function (value)
        {
            if (!set.contains(value))
            {
                newSet.set(value);
            }
        });

        return newSet;
    },

    /**
     * [description]
     *
     * @name Phaser.Structs.Set#size
     * @type {integer}
     * @since 3.0.0
     */
    size: {

        get: function ()
        {
            return this.entries.length;
        },

        set: function (value)
        {
            return this.entries.length = value;
        }

    }

});

module.exports = Set;


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

//  Adapted from [gl-matrix](https://github.com/toji/gl-matrix) by toji
//  and [vecmath](https://github.com/mattdesl/vecmath) by mattdesl

var Class = __webpack_require__(0);

/**
 * @classdesc
 * A three-dimensional matrix.
 *
 * Defaults to the identity matrix when instantiated.
 *
 * @class Matrix3
 * @memberOf Phaser.Math
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Math.Matrix3} [m] - Optional Matrix3 to copy values from.
 */
var Matrix3 = new Class({

    initialize:

    function Matrix3 (m)
    {
        /**
         * The matrix values.
         *
         * @name Phaser.Math.Matrix3#val
         * @type {Float32Array}
         * @since 3.0.0
         */
        this.val = new Float32Array(9);

        if (m)
        {
            //  Assume Matrix3 with val:
            this.copy(m);
        }
        else
        {
            //  Default to identity
            this.identity();
        }
    },

    /**
     * Make a clone of this Matrix3.
     *
     * @method Phaser.Math.Matrix3#clone
     * @since 3.0.0
     *
     * @return {Phaser.Math.Matrix3} A clone of this Matrix3.
     */
    clone: function ()
    {
        return new Matrix3(this);
    },

    /**
     * This method is an alias for `Matrix3.copy`.
     *
     * @method Phaser.Math.Matrix3#set
     * @since 3.0.0
     *
     * @param {Phaser.Math.Matrix3} src - The Matrix to set the values of this Matrix's from.
     *
     * @return {Phaser.Math.Matrix3} This Matrix3.
     */
    set: function (src)
    {
        return this.copy(src);
    },

    /**
     * Copy the values of a given Matrix into this Matrix.
     *
     * @method Phaser.Math.Matrix3#copy
     * @since 3.0.0
     *
     * @param {Phaser.Math.Matrix3} src - The Matrix to copy the values from.
     *
     * @return {Phaser.Math.Matrix3} This Matrix3.
     */
    copy: function (src)
    {
        var out = this.val;
        var a = src.val;

        out[0] = a[0];
        out[1] = a[1];
        out[2] = a[2];
        out[3] = a[3];
        out[4] = a[4];
        out[5] = a[5];
        out[6] = a[6];
        out[7] = a[7];
        out[8] = a[8];

        return this;
    },

    /**
     * Copy the values of a given Matrix4 into this Matrix3.
     *
     * @method Phaser.Math.Matrix3#fromMat4
     * @since 3.0.0
     *
     * @param {Phaser.Math.Matrix4} m - The Matrix4 to copy the values from.
     *
     * @return {Phaser.Math.Matrix3} This Matrix3.
     */
    fromMat4: function (m)
    {
        var a = m.val;
        var out = this.val;

        out[0] = a[0];
        out[1] = a[1];
        out[2] = a[2];
        out[3] = a[4];
        out[4] = a[5];
        out[5] = a[6];
        out[6] = a[8];
        out[7] = a[9];
        out[8] = a[10];

        return this;
    },

    /**
     * Set the values of this Matrix from the given array.
     *
     * @method Phaser.Math.Matrix3#fromArray
     * @since 3.0.0
     *
     * @param {array} a - The array to copy the values from.
     *
     * @return {Phaser.Math.Matrix3} This Matrix3.
     */
    fromArray: function (a)
    {
        var out = this.val;

        out[0] = a[0];
        out[1] = a[1];
        out[2] = a[2];
        out[3] = a[3];
        out[4] = a[4];
        out[5] = a[5];
        out[6] = a[6];
        out[7] = a[7];
        out[8] = a[8];

        return this;
    },

    /**
     * Reset this Matrix to an identity (default) matrix.
     *
     * @method Phaser.Math.Matrix3#identity
     * @since 3.0.0
     *
     * @return {Phaser.Math.Matrix3} This Matrix3.
     */
    identity: function ()
    {
        var out = this.val;

        out[0] = 1;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 1;
        out[5] = 0;
        out[6] = 0;
        out[7] = 0;
        out[8] = 1;

        return this;
    },

    /**
     * Transpose this Matrix.
     *
     * @method Phaser.Math.Matrix3#transpose
     * @since 3.0.0
     *
     * @return {Phaser.Math.Matrix3} This Matrix3.
     */
    transpose: function ()
    {
        var a = this.val;
        var a01 = a[1];
        var a02 = a[2];
        var a12 = a[5];

        a[1] = a[3];
        a[2] = a[6];
        a[3] = a01;
        a[5] = a[7];
        a[6] = a02;
        a[7] = a12;

        return this;
    },

    /**
     * Invert this Matrix.
     *
     * @method Phaser.Math.Matrix3#invert
     * @since 3.0.0
     *
     * @return {Phaser.Math.Matrix3} This Matrix3.
     */
    invert: function ()
    {
        var a = this.val;

        var a00 = a[0];
        var a01 = a[1];
        var a02 = a[2];
        var a10 = a[3];
        var a11 = a[4];
        var a12 = a[5];
        var a20 = a[6];
        var a21 = a[7];
        var a22 = a[8];

        var b01 = a22 * a11 - a12 * a21;
        var b11 = -a22 * a10 + a12 * a20;
        var b21 = a21 * a10 - a11 * a20;

        // Calculate the determinant
        var det = a00 * b01 + a01 * b11 + a02 * b21;

        if (!det)
        {
            return null;
        }

        det = 1 / det;

        a[0] = b01 * det;
        a[1] = (-a22 * a01 + a02 * a21) * det;
        a[2] = (a12 * a01 - a02 * a11) * det;
        a[3] = b11 * det;
        a[4] = (a22 * a00 - a02 * a20) * det;
        a[5] = (-a12 * a00 + a02 * a10) * det;
        a[6] = b21 * det;
        a[7] = (-a21 * a00 + a01 * a20) * det;
        a[8] = (a11 * a00 - a01 * a10) * det;

        return this;
    },

    /**
     * Calculate the adjoint, or adjugate, of this Matrix.
     *
     * @method Phaser.Math.Matrix3#adjoint
     * @since 3.0.0
     *
     * @return {Phaser.Math.Matrix3} This Matrix3.
     */
    adjoint: function ()
    {
        var a = this.val;

        var a00 = a[0];
        var a01 = a[1];
        var a02 = a[2];
        var a10 = a[3];
        var a11 = a[4];
        var a12 = a[5];
        var a20 = a[6];
        var a21 = a[7];
        var a22 = a[8];

        a[0] = (a11 * a22 - a12 * a21);
        a[1] = (a02 * a21 - a01 * a22);
        a[2] = (a01 * a12 - a02 * a11);
        a[3] = (a12 * a20 - a10 * a22);
        a[4] = (a00 * a22 - a02 * a20);
        a[5] = (a02 * a10 - a00 * a12);
        a[6] = (a10 * a21 - a11 * a20);
        a[7] = (a01 * a20 - a00 * a21);
        a[8] = (a00 * a11 - a01 * a10);

        return this;
    },

    /**
     * Calculate the determinant of this Matrix.
     *
     * @method Phaser.Math.Matrix3#determinant
     * @since 3.0.0
     *
     * @return {number} The determinant of this Matrix.
     */
    determinant: function ()
    {
        var a = this.val;

        var a00 = a[0];
        var a01 = a[1];
        var a02 = a[2];
        var a10 = a[3];
        var a11 = a[4];
        var a12 = a[5];
        var a20 = a[6];
        var a21 = a[7];
        var a22 = a[8];

        return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
    },

    /**
     * Multiply this Matrix by the given Matrix.
     *
     * @method Phaser.Math.Matrix3#multiply
     * @since 3.0.0
     *
     * @param {Phaser.Math.Matrix3} src - The Matrix to multiply this Matrix by.
     *
     * @return {Phaser.Math.Matrix3} This Matrix3.
     */
    multiply: function (src)
    {
        var a = this.val;

        var a00 = a[0];
        var a01 = a[1];
        var a02 = a[2];
        var a10 = a[3];
        var a11 = a[4];
        var a12 = a[5];
        var a20 = a[6];
        var a21 = a[7];
        var a22 = a[8];

        var b = src.val;

        var b00 = b[0];
        var b01 = b[1];
        var b02 = b[2];
        var b10 = b[3];
        var b11 = b[4];
        var b12 = b[5];
        var b20 = b[6];
        var b21 = b[7];
        var b22 = b[8];

        a[0] = b00 * a00 + b01 * a10 + b02 * a20;
        a[1] = b00 * a01 + b01 * a11 + b02 * a21;
        a[2] = b00 * a02 + b01 * a12 + b02 * a22;

        a[3] = b10 * a00 + b11 * a10 + b12 * a20;
        a[4] = b10 * a01 + b11 * a11 + b12 * a21;
        a[5] = b10 * a02 + b11 * a12 + b12 * a22;

        a[6] = b20 * a00 + b21 * a10 + b22 * a20;
        a[7] = b20 * a01 + b21 * a11 + b22 * a21;
        a[8] = b20 * a02 + b21 * a12 + b22 * a22;

        return this;
    },

    /**
     * Translate this Matrix using the given Vector.
     *
     * @method Phaser.Math.Matrix3#translate
     * @since 3.0.0
     *
     * @param {(Phaser.Math.Vector2|Phaser.Math.Vector3|Phaser.Math.Vector4)} v - The Vector to translate this Matrix with.
     *
     * @return {Phaser.Math.Matrix3} This Matrix3.
     */
    translate: function (v)
    {
        var a = this.val;
        var x = v.x;
        var y = v.y;

        a[6] = x * a[0] + y * a[3] + a[6];
        a[7] = x * a[1] + y * a[4] + a[7];
        a[8] = x * a[2] + y * a[5] + a[8];

        return this;
    },

    /**
     * Apply a rotation transformation to this Matrix.
     *
     * @method Phaser.Math.Matrix3#rotate
     * @since 3.0.0
     *
     * @param {number} rad - The angle in radians to rotate by.
     *
     * @return {Phaser.Math.Matrix3} This Matrix3.
     */
    rotate: function (rad)
    {
        var a = this.val;

        var a00 = a[0];
        var a01 = a[1];
        var a02 = a[2];
        var a10 = a[3];
        var a11 = a[4];
        var a12 = a[5];

        var s = Math.sin(rad);
        var c = Math.cos(rad);

        a[0] = c * a00 + s * a10;
        a[1] = c * a01 + s * a11;
        a[2] = c * a02 + s * a12;

        a[3] = c * a10 - s * a00;
        a[4] = c * a11 - s * a01;
        a[5] = c * a12 - s * a02;

        return this;
    },

    /**
     * Apply a scale transformation to this Matrix.
     *
     * Uses the `x` and `y` components of the given Vector to scale the Matrix.
     *
     * @method Phaser.Math.Matrix3#scale
     * @since 3.0.0
     *
     * @param {(Phaser.Math.Vector2|Phaser.Math.Vector3|Phaser.Math.Vector4)} v - The Vector to scale this Matrix with.
     *
     * @return {Phaser.Math.Matrix3} This Matrix3.
     */
    scale: function (v)
    {
        var a = this.val;
        var x = v.x;
        var y = v.y;

        a[0] = x * a[0];
        a[1] = x * a[1];
        a[2] = x * a[2];

        a[3] = y * a[3];
        a[4] = y * a[4];
        a[5] = y * a[5];

        return this;
    },

    /**
     * Set the values of this Matrix from the given Quaternion.
     *
     * @method Phaser.Math.Matrix3#fromQuat
     * @since 3.0.0
     *
     * @param {Phaser.Math.Quaternion} q - The Quaternion to set the values of this Matrix from.
     *
     * @return {Phaser.Math.Matrix3} This Matrix3.
     */
    fromQuat: function (q)
    {
        var x = q.x;
        var y = q.y;
        var z = q.z;
        var w = q.w;

        var x2 = x + x;
        var y2 = y + y;
        var z2 = z + z;

        var xx = x * x2;
        var xy = x * y2;
        var xz = x * z2;

        var yy = y * y2;
        var yz = y * z2;
        var zz = z * z2;

        var wx = w * x2;
        var wy = w * y2;
        var wz = w * z2;

        var out = this.val;

        out[0] = 1 - (yy + zz);
        out[3] = xy + wz;
        out[6] = xz - wy;

        out[1] = xy - wz;
        out[4] = 1 - (xx + zz);
        out[7] = yz + wx;

        out[2] = xz + wy;
        out[5] = yz - wx;
        out[8] = 1 - (xx + yy);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Matrix3#normalFromMat4
     * @since 3.0.0
     *
     * @param {Phaser.Math.Matrix4} m - [description]
     *
     * @return {Phaser.Math.Matrix3} This Matrix3.
     */
    normalFromMat4: function (m)
    {
        var a = m.val;
        var out = this.val;

        var a00 = a[0];
        var a01 = a[1];
        var a02 = a[2];
        var a03 = a[3];

        var a10 = a[4];
        var a11 = a[5];
        var a12 = a[6];
        var a13 = a[7];

        var a20 = a[8];
        var a21 = a[9];
        var a22 = a[10];
        var a23 = a[11];

        var a30 = a[12];
        var a31 = a[13];
        var a32 = a[14];
        var a33 = a[15];

        var b00 = a00 * a11 - a01 * a10;
        var b01 = a00 * a12 - a02 * a10;
        var b02 = a00 * a13 - a03 * a10;
        var b03 = a01 * a12 - a02 * a11;

        var b04 = a01 * a13 - a03 * a11;
        var b05 = a02 * a13 - a03 * a12;
        var b06 = a20 * a31 - a21 * a30;
        var b07 = a20 * a32 - a22 * a30;

        var b08 = a20 * a33 - a23 * a30;
        var b09 = a21 * a32 - a22 * a31;
        var b10 = a21 * a33 - a23 * a31;
        var b11 = a22 * a33 - a23 * a32;

        // Calculate the determinant
        var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

        if (!det)
        {
            return null;
        }

        det = 1 / det;

        out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;

        out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;

        out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;

        return this;
    }

});

module.exports = Matrix3;


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

//  Adapted from [gl-matrix](https://github.com/toji/gl-matrix) by toji
//  and [vecmath](https://github.com/mattdesl/vecmath) by mattdesl

var Class = __webpack_require__(0);
var Vector3 = __webpack_require__(2);
var Matrix3 = __webpack_require__(64);

var EPSILON = 0.000001;

//  Some shared 'private' arrays
var siNext = new Int8Array([ 1, 2, 0 ]);
var tmp = new Float32Array([ 0, 0, 0 ]);

var xUnitVec3 = new Vector3(1, 0, 0);
var yUnitVec3 = new Vector3(0, 1, 0);

var tmpvec = new Vector3();
var tmpMat3 = new Matrix3();

/**
 * @classdesc
 * A quaternion.
 *
 * @class Quaternion
 * @memberOf Phaser.Math
 * @constructor
 * @since 3.0.0
 *
 * @param {number} [x] - The x component.
 * @param {number} [y] - The y component.
 * @param {number} [z] - The z component.
 * @param {number} [w] - The w component.
 */
var Quaternion = new Class({

    initialize:

    function Quaternion (x, y, z, w)
    {
        /**
         * The x component of this Quaternion.
         *
         * @name Phaser.Math.Quaternion#x
         * @type {number}
         * @default 0
         * @since 3.0.0
         */

        /**
         * The y component of this Quaternion.
         *
         * @name Phaser.Math.Quaternion#y
         * @type {number}
         * @default 0
         * @since 3.0.0
         */

        /**
         * The z component of this Quaternion.
         *
         * @name Phaser.Math.Quaternion#z
         * @type {number}
         * @default 0
         * @since 3.0.0
         */

        /**
         * The w component of this Quaternion.
         *
         * @name Phaser.Math.Quaternion#w
         * @type {number}
         * @default 0
         * @since 3.0.0
         */

        if (typeof x === 'object')
        {
            this.x = x.x || 0;
            this.y = x.y || 0;
            this.z = x.z || 0;
            this.w = x.w || 0;
        }
        else
        {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
            this.w = w || 0;
        }
    },

    /**
     * Copy the components of a given Quaternion or Vector into this Quaternion.
     *
     * @method Phaser.Math.Quaternion#copy
     * @since 3.0.0
     *
     * @param {(Phaser.Math.Quaternion|Phaser.Math.Vector4)} src - The Quaternion or Vector to copy the components from.
     *
     * @return {Phaser.Math.Quaternion} This Quaternion.
     */
    copy: function (src)
    {
        this.x = src.x;
        this.y = src.y;
        this.z = src.z;
        this.w = src.w;

        return this;
    },

    /**
     * Set the components of this Quaternion.
     *
     * @method Phaser.Math.Quaternion#set
     * @since 3.0.0
     *
     * @param {(number|object)} [x=0] - The x component, or an object containing x, y, z, and w components.
     * @param {number} [y=0] - The y component.
     * @param {number} [z=0] - The z component.
     * @param {number} [w=0] - The w component.
     *
     * @return {Phaser.Math.Quaternion} This Quaternion.
     */
    set: function (x, y, z, w)
    {
        if (typeof x === 'object')
        {
            this.x = x.x || 0;
            this.y = x.y || 0;
            this.z = x.z || 0;
            this.w = x.w || 0;
        }
        else
        {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
            this.w = w || 0;
        }

        return this;
    },

    /**
     * Add a given Quaternion or Vector to this Quaternion. Addition is component-wise.
     *
     * @method Phaser.Math.Quaternion#add
     * @since 3.0.0
     *
     * @param {(Phaser.Math.Quaternion|Phaser.Math.Vector4)} v - The Quaternion or Vector to add to this Quaternion.
     *
     * @return {Phaser.Math.Quaternion} This Quaternion.
     */
    add: function (v)
    {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        this.w += v.w;

        return this;
    },

    /**
     * Subtract a given Quaternion or Vector from this Quaternion. Subtraction is component-wise.
     *
     * @method Phaser.Math.Quaternion#subtract
     * @since 3.0.0
     *
     * @param {(Phaser.Math.Quaternion|Phaser.Math.Vector4)} v - The Quaternion or Vector to subtract from this Quaternion.
     *
     * @return {Phaser.Math.Quaternion} This Quaternion.
     */
    subtract: function (v)
    {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        this.w -= v.w;

        return this;
    },

    /**
     * Scale this Quaternion by the given value.
     *
     * @method Phaser.Math.Quaternion#scale
     * @since 3.0.0
     *
     * @param {number} scale - The value to scale this Quaternion by.
     *
     * @return {Phaser.Math.Quaternion} This Quaternion.
     */
    scale: function (scale)
    {
        this.x *= scale;
        this.y *= scale;
        this.z *= scale;
        this.w *= scale;

        return this;
    },

    /**
     * Calculate the length of this Quaternion.
     *
     * @method Phaser.Math.Quaternion#length
     * @since 3.0.0
     *
     * @return {number} The length of this Quaternion.
     */
    length: function ()
    {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var w = this.w;

        return Math.sqrt(x * x + y * y + z * z + w * w);
    },

    /**
     * Calculate the length of this Quaternion squared.
     *
     * @method Phaser.Math.Quaternion#lengthSq
     * @since 3.0.0
     *
     * @return {number} The length of this Quaternion, squared.
     */
    lengthSq: function ()
    {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var w = this.w;

        return x * x + y * y + z * z + w * w;
    },

    /**
     * Normalize this Quaternion.
     *
     * @method Phaser.Math.Quaternion#normalize
     * @since 3.0.0
     *
     * @return {Phaser.Math.Quaternion} This Quaternion.
     */
    normalize: function ()
    {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var w = this.w;
        var len = x * x + y * y + z * z + w * w;

        if (len > 0)
        {
            len = 1 / Math.sqrt(len);

            this.x = x * len;
            this.y = y * len;
            this.z = z * len;
            this.w = w * len;
        }

        return this;
    },

    /**
     * Calculate the dot product of this Quaternion and the given Quaternion or Vector.
     *
     * @method Phaser.Math.Quaternion#dot
     * @since 3.0.0
     *
     * @param {(Phaser.Math.Quaternion|Phaser.Math.Vector4)} v - The Quaternion or Vector to dot product with this Quaternion.
     *
     * @return {number} The dot product of this Quaternion and the given Quaternion or Vector.
     */
    dot: function (v)
    {
        return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
    },

    /**
     * Linearly interpolate this Quaternion towards the given Quaternion or Vector.
     *
     * @method Phaser.Math.Quaternion#lerp
     * @since 3.0.0
     *
     * @param {(Phaser.Math.Quaternion|Phaser.Math.Vector4)} v - The Quaternion or Vector to interpolate towards.
     * @param {number} [t=0] - The percentage of interpolation.
     *
     * @return {Phaser.Math.Quaternion} This Quaternion.
     */
    lerp: function (v, t)
    {
        if (t === undefined) { t = 0; }

        var ax = this.x;
        var ay = this.y;
        var az = this.z;
        var aw = this.w;

        this.x = ax + t * (v.x - ax);
        this.y = ay + t * (v.y - ay);
        this.z = az + t * (v.z - az);
        this.w = aw + t * (v.w - aw);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Quaternion#rotationTo
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector3} a - [description]
     * @param {Phaser.Math.Vector3} b - [description]
     *
     * @return {Phaser.Math.Quaternion} This Quaternion.
     */
    rotationTo: function (a, b)
    {
        var dot = a.x * b.x + a.y * b.y + a.z * b.z;

        if (dot < -0.999999)
        {
            if (tmpvec.copy(xUnitVec3).cross(a).length() < EPSILON)
            {
                tmpvec.copy(yUnitVec3).cross(a);
            }

            tmpvec.normalize();

            return this.setAxisAngle(tmpvec, Math.PI);

        }
        else if (dot > 0.999999)
        {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.w = 1;

            return this;
        }
        else
        {
            tmpvec.copy(a).cross(b);

            this.x = tmpvec.x;
            this.y = tmpvec.y;
            this.z = tmpvec.z;
            this.w = 1 + dot;

            return this.normalize();
        }
    },

    /**
     * Set the axes of this Quaternion.
     *
     * @method Phaser.Math.Quaternion#setAxes
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector3} view - The view axis.
     * @param {Phaser.Math.Vector3} right - The right axis.
     * @param {Phaser.Math.Vector3} up - The upwards axis.
     *
     * @return {Phaser.Math.Quaternion} This Quaternion.
     */
    setAxes: function (view, right, up)
    {
        var m = tmpMat3.val;

        m[0] = right.x;
        m[3] = right.y;
        m[6] = right.z;

        m[1] = up.x;
        m[4] = up.y;
        m[7] = up.z;

        m[2] = -view.x;
        m[5] = -view.y;
        m[8] = -view.z;

        return this.fromMat3(tmpMat3).normalize();
    },

    /**
     * Reset this Matrix to an identity (default) Quaternion.
     *
     * @method Phaser.Math.Quaternion#identity
     * @since 3.0.0
     *
     * @return {Phaser.Math.Quaternion} This Quaternion.
     */
    identity: function ()
    {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w = 1;

        return this;
    },

    /**
     * Set the axis angle of this Quaternion.
     *
     * @method Phaser.Math.Quaternion#setAxisAngle
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector3} axis - The axis.
     * @param {number} rad - The angle in radians.
     *
     * @return {Phaser.Math.Quaternion} This Quaternion.
     */
    setAxisAngle: function (axis, rad)
    {
        rad = rad * 0.5;

        var s = Math.sin(rad);

        this.x = s * axis.x;
        this.y = s * axis.y;
        this.z = s * axis.z;
        this.w = Math.cos(rad);

        return this;
    },

    /**
     * Multiply this Quaternion by the given Quaternion or Vector.
     *
     * @method Phaser.Math.Quaternion#multiply
     * @since 3.0.0
     *
     * @param {(Phaser.Math.Quaternion|Phaser.Math.Vector4)} b - The Quaternion or Vector to multiply this Quaternion by.
     *
     * @return {Phaser.Math.Quaternion} This Quaternion.
     */
    multiply: function (b)
    {
        var ax = this.x;
        var ay = this.y;
        var az = this.z;
        var aw = this.w;

        var bx = b.x;
        var by = b.y;
        var bz = b.z;
        var bw = b.w;

        this.x = ax * bw + aw * bx + ay * bz - az * by;
        this.y = ay * bw + aw * by + az * bx - ax * bz;
        this.z = az * bw + aw * bz + ax * by - ay * bx;
        this.w = aw * bw - ax * bx - ay * by - az * bz;

        return this;
    },

    /**
     * Smoothly linearly interpolate this Quaternion towards the given Quaternion or Vector.
     *
     * @method Phaser.Math.Quaternion#slerp
     * @since 3.0.0
     *
     * @param {(Phaser.Math.Quaternion|Phaser.Math.Vector4)} b - The Quaternion or Vector to interpolate towards.
     * @param {number} t - The percentage of interpolation.
     *
     * @return {Phaser.Math.Quaternion} This Quaternion.
     */
    slerp: function (b, t)
    {
        // benchmarks: http://jsperf.com/quaternion-slerp-implementations

        var ax = this.x;
        var ay = this.y;
        var az = this.z;
        var aw = this.w;

        var bx = b.x;
        var by = b.y;
        var bz = b.z;
        var bw = b.w;

        // calc cosine
        var cosom = ax * bx + ay * by + az * bz + aw * bw;

        // adjust signs (if necessary)
        if (cosom < 0)
        {
            cosom = -cosom;
            bx = - bx;
            by = - by;
            bz = - bz;
            bw = - bw;
        }

        // "from" and "to" quaternions are very close
        //  ... so we can do a linear interpolation
        var scale0 = 1 - t;
        var scale1 = t;

        // calculate coefficients
        if ((1 - cosom) > EPSILON)
        {
            // standard case (slerp)
            var omega = Math.acos(cosom);
            var sinom = Math.sin(omega);

            scale0 = Math.sin((1.0 - t) * omega) / sinom;
            scale1 = Math.sin(t * omega) / sinom;
        }

        // calculate final values
        this.x = scale0 * ax + scale1 * bx;
        this.y = scale0 * ay + scale1 * by;
        this.z = scale0 * az + scale1 * bz;
        this.w = scale0 * aw + scale1 * bw;

        return this;
    },

    /**
     * Invert this Quaternion.
     *
     * @method Phaser.Math.Quaternion#invert
     * @since 3.0.0
     *
     * @return {Phaser.Math.Quaternion} This Quaternion.
     */
    invert: function ()
    {
        var a0 = this.x;
        var a1 = this.y;
        var a2 = this.z;
        var a3 = this.w;

        var dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
        var invDot = (dot) ? 1 / dot : 0;

        // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

        this.x = -a0 * invDot;
        this.y = -a1 * invDot;
        this.z = -a2 * invDot;
        this.w = a3 * invDot;

        return this;
    },

    /**
     * Convert this Quaternion into its conjugate.
     *
     * Sets the x, y and z components.
     *
     * @method Phaser.Math.Quaternion#conjugate
     * @since 3.0.0
     *
     * @return {Phaser.Math.Quaternion} This Quaternion.
     */
    conjugate: function ()
    {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;

        return this;
    },

    /**
     * Rotate this Quaternion on the X axis.
     *
     * @method Phaser.Math.Quaternion#rotateX
     * @since 3.0.0
     *
     * @param {number} rad - The rotation angle in radians.
     *
     * @return {Phaser.Math.Quaternion} This Quaternion.
     */
    rotateX: function (rad)
    {
        rad *= 0.5;

        var ax = this.x;
        var ay = this.y;
        var az = this.z;
        var aw = this.w;

        var bx = Math.sin(rad);
        var bw = Math.cos(rad);

        this.x = ax * bw + aw * bx;
        this.y = ay * bw + az * bx;
        this.z = az * bw - ay * bx;
        this.w = aw * bw - ax * bx;

        return this;
    },

    /**
     * Rotate this Quaternion on the Y axis.
     *
     * @method Phaser.Math.Quaternion#rotateY
     * @since 3.0.0
     *
     * @param {number} rad - The rotation angle in radians.
     *
     * @return {Phaser.Math.Quaternion} This Quaternion.
     */
    rotateY: function (rad)
    {
        rad *= 0.5;

        var ax = this.x;
        var ay = this.y;
        var az = this.z;
        var aw = this.w;

        var by = Math.sin(rad);
        var bw = Math.cos(rad);

        this.x = ax * bw - az * by;
        this.y = ay * bw + aw * by;
        this.z = az * bw + ax * by;
        this.w = aw * bw - ay * by;

        return this;
    },

    /**
     * Rotate this Quaternion on the Z axis.
     *
     * @method Phaser.Math.Quaternion#rotateZ
     * @since 3.0.0
     *
     * @param {number} rad - The rotation angle in radians.
     *
     * @return {Phaser.Math.Quaternion} This Quaternion.
     */
    rotateZ: function (rad)
    {
        rad *= 0.5;

        var ax = this.x;
        var ay = this.y;
        var az = this.z;
        var aw = this.w;

        var bz = Math.sin(rad);
        var bw = Math.cos(rad);

        this.x = ax * bw + ay * bz;
        this.y = ay * bw - ax * bz;
        this.z = az * bw + aw * bz;
        this.w = aw * bw - az * bz;

        return this;
    },

    /**
     * Create a unit (or rotation) Quaternion from its x, y, and z components.
     *
     * Sets the w component.
     *
     * @method Phaser.Math.Quaternion#calculateW
     * @since 3.0.0
     *
     * @return {Phaser.Math.Quaternion} This Quaternion.
     */
    calculateW: function ()
    {
        var x = this.x;
        var y = this.y;
        var z = this.z;

        this.w = -Math.sqrt(1.0 - x * x - y * y - z * z);

        return this;
    },

    /**
     * Convert the given Matrix into this Quaternion.
     *
     * @method Phaser.Math.Quaternion#fromMat3
     * @since 3.0.0
     *
     * @param {Phaser.Math.Matrix3} mat - The Matrix to convert from.
     *
     * @return {Phaser.Math.Quaternion} This Quaternion.
     */
    fromMat3: function (mat)
    {
        // benchmarks:
        //    http://jsperf.com/typed-array-access-speed
        //    http://jsperf.com/conversion-of-3x3-matrix-to-quaternion

        // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
        // article "Quaternion Calculus and Fast Animation".
        var m = mat.val;
        var fTrace = m[0] + m[4] + m[8];
        var fRoot;

        if (fTrace > 0)
        {
            // |w| > 1/2, may as well choose w > 1/2
            fRoot = Math.sqrt(fTrace + 1.0); // 2w

            this.w = 0.5 * fRoot;

            fRoot = 0.5 / fRoot; // 1/(4w)

            this.x = (m[7] - m[5]) * fRoot;
            this.y = (m[2] - m[6]) * fRoot;
            this.z = (m[3] - m[1]) * fRoot;
        }
        else
        {
            // |w| <= 1/2
            var i = 0;

            if (m[4] > m[0])
            {
                i = 1;
            }

            if (m[8] > m[i * 3 + i])
            {
                i = 2;
            }

            var j = siNext[i];
            var k = siNext[j];

            //  This isn't quite as clean without array access
            fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1);
            tmp[i] = 0.5 * fRoot;

            fRoot = 0.5 / fRoot;

            tmp[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
            tmp[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;

            this.x = tmp[0];
            this.y = tmp[1];
            this.z = tmp[2];
            this.w = (m[k * 3 + j] - m[j * 3 + k]) * fRoot;
        }

        return this;
    }

});

module.exports = Quaternion;


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Vector3 = __webpack_require__(2);
var Matrix4 = __webpack_require__(14);
var Quaternion = __webpack_require__(65);

var tmpMat4 = new Matrix4();
var tmpQuat = new Quaternion();
var tmpVec3 = new Vector3();

/**
 * Rotates a vector in place by axis angle.
 *
 * This is the same as transforming a point by an
 * axis-angle quaternion, but it has higher precision.
 *
 * @function Phaser.Math.RotateVec3
 * @since 3.0.0
 *
 * @param {Phaser.Math.Vector3} vec - The vector to be rotated.
 * @param {Phaser.Math.Vector3} axis - The axis to rotate around.
 * @param {number} radians - The angle of rotation in radians.
 *
 * @return {Phaser.Math.Vector3} The given vector.
 */
var RotateVec3 = function (vec, axis, radians)
{
    //  Set the quaternion to our axis angle
    tmpQuat.setAxisAngle(axis, radians);

    //  Create a rotation matrix from the axis angle
    tmpMat4.fromRotationTranslation(tmpQuat, tmpVec3.set(0, 0, 0));

    //  Multiply our vector by the rotation matrix
    return vec.transformMat4(tmpMat4);
};

module.exports = RotateVec3;


/***/ }),
/* 67 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Compute a random four-dimensional vector.
 *
 * @function Phaser.Math.RandomXYZW
 * @since 3.0.0
 *
 * @param {Phaser.Math.Vector4} vec4 - The Vector to compute random values for.
 * @param {number} [scale=1] - The scale of the random values.
 *
 * @return {Phaser.Math.Vector4} The given Vector.
 */
var RandomXYZW = function (vec4, scale)
{
    if (scale === undefined) { scale = 1; }

    // TODO: Not spherical; should fix this for more uniform distribution
    vec4.x = (Math.random() * 2 - 1) * scale;
    vec4.y = (Math.random() * 2 - 1) * scale;
    vec4.z = (Math.random() * 2 - 1) * scale;
    vec4.w = (Math.random() * 2 - 1) * scale;

    return vec4;
};

module.exports = RandomXYZW;


/***/ }),
/* 68 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Compute a random position vector in a spherical area, optionally defined by the given radius.
 *
 * @function Phaser.Math.RandomXYZ
 * @since 3.0.0
 *
 * @param {Phaser.Math.Vector3} vec3 - The Vector to compute random values for.
 * @param {number} [radius=1] - The radius.
 *
 * @return {Phaser.Math.Vector3} The given Vector.
 */
var RandomXYZ = function (vec3, radius)
{
    if (radius === undefined) { radius = 1; }

    var r = Math.random() * 2 * Math.PI;
    var z = (Math.random() * 2) - 1;
    var zScale = Math.sqrt(1 - z * z) * radius;

    vec3.x = Math.cos(r) * zScale;
    vec3.y = Math.sin(r) * zScale;
    vec3.z = z * radius;

    return vec3;
};

module.exports = RandomXYZ;


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Camera = __webpack_require__(15);
var Class = __webpack_require__(0);
var Vector3 = __webpack_require__(2);

//  Local cache vars
var tmpVec3 = new Vector3();

/**
 * @classdesc
 * [description]
 *
 * @class OrthographicCamera
 * @extends Phaser.Cameras.Sprite3D.Camera
 * @memberOf Phaser.Cameras.Sprite3D
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - [description]
 * @param {integer} [viewportWidth=0] - [description]
 * @param {integer} [viewportHeight=0] - [description]
 */
var OrthographicCamera = new Class({

    Extends: Camera,

    initialize:

    function OrthographicCamera (scene, viewportWidth, viewportHeight)
    {
        if (viewportWidth === undefined) { viewportWidth = 0; }
        if (viewportHeight === undefined) { viewportHeight = 0; }

        Camera.call(this, scene);

        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D.OrthographicCamera#viewportWidth
         * @type {integer}
         * @since 3.0.0
         */
        this.viewportWidth = viewportWidth;

        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D.OrthographicCamera#viewportHeight
         * @type {integer}
         * @since 3.0.0
         */
        this.viewportHeight = viewportHeight;

        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D.OrthographicCamera#_zoom
         * @type {number}
         * @private
         * @since 3.0.0
         */
        this._zoom = 1.0;

        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D.OrthographicCamera#near
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.near = 0;

        this.update();
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.OrthographicCamera#setToOrtho
     * @since 3.0.0
     *
     * @param {number} yDown - [description]
     * @param {number} [viewportWidth] - [description]
     * @param {number} [viewportHeight] - [description]
     *
     * @return {Phaser.Cameras.Sprite3D.OrthographicCamera} [description]
     */
    setToOrtho: function (yDown, viewportWidth, viewportHeight)
    {
        if (viewportWidth === undefined) { viewportWidth = this.viewportWidth; }
        if (viewportHeight === undefined) { viewportHeight = this.viewportHeight; }

        var zoom = this.zoom;

        this.up.set(0, (yDown) ? -1 : 1, 0);
        this.direction.set(0, 0, (yDown) ? 1 : -1);
        this.position.set(zoom * viewportWidth / 2, zoom * viewportHeight / 2, 0);

        this.viewportWidth = viewportWidth;
        this.viewportHeight = viewportHeight;

        return this.update();
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.OrthographicCamera#update
     * @since 3.0.0
     *
     * @return {Phaser.Cameras.Sprite3D.OrthographicCamera} [description]
     */
    update: function ()
    {
        var w = this.viewportWidth;
        var h = this.viewportHeight;
        var near = Math.abs(this.near);
        var far = Math.abs(this.far);
        var zoom = this.zoom;

        if (w === 0 || h === 0)
        {
            //  What to do here... hmm?
            return this;
        }

        this.projection.ortho(
            zoom * -w / 2, zoom * w / 2,
            zoom * -h / 2, zoom * h / 2,
            near,
            far
        );

        //  Build the view matrix
        tmpVec3.copy(this.position).add(this.direction);

        this.view.lookAt(this.position, tmpVec3, this.up);

        //  Projection * view matrix
        this.combined.copy(this.projection).multiply(this.view);

        //  Invert combined matrix, used for unproject
        this.invProjectionView.copy(this.combined).invert();

        this.billboardMatrixDirty = true;

        this.updateChildren();

        return this;
    },

    /**
     * [description]
     *
     * @name Phaser.Cameras.Sprite3D.OrthographicCamera#zoom
     * @type {number}
     * @since 3.0.0
     */
    zoom: {

        get: function ()
        {
            return this._zoom;
        },

        set: function (value)
        {
            this._zoom = value;
            this.update();
        }
    }

});

module.exports = OrthographicCamera;


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GetAdvancedValue = __webpack_require__(4);

/**
 * Adds an Animation component to a Sprite and populates it based on the given config.
 *
 * @function Phaser.GameObjects.BuildGameObjectAnimation
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.Sprite} sprite - The sprite to add an Animation component to.
 * @param {object} config - The animation config.
 *
 * @return {Phaser.GameObjects.Sprite} The updated Sprite.
 */
var BuildGameObjectAnimation = function (sprite, config)
{
    var animConfig = GetAdvancedValue(config, 'anims', null);

    if (animConfig === null)
    {
        return sprite;
    }

    if (typeof animConfig === 'string')
    {
        //  { anims: 'key' }
        sprite.anims.play(animConfig);
    }
    else if (typeof animConfig === 'object')
    {
        //  { anims: {
        //              key: string
        //              startFrame: [string|integer]
        //              delay: [float]
        //              repeat: [integer]
        //              repeatDelay: [float]
        //              yoyo: [boolean]
        //              play: [boolean]
        //              delayedPlay: [boolean]
        //           }
        //  }

        var anims = sprite.anims;

        var key = GetAdvancedValue(animConfig, 'key', undefined);
        var startFrame = GetAdvancedValue(animConfig, 'startFrame', undefined);

        var delay = GetAdvancedValue(animConfig, 'delay', 0);
        var repeat = GetAdvancedValue(animConfig, 'repeat', 0);
        var repeatDelay = GetAdvancedValue(animConfig, 'repeatDelay', 0);
        var yoyo = GetAdvancedValue(animConfig, 'yoyo', false);

        var play = GetAdvancedValue(animConfig, 'play', false);
        var delayedPlay = GetAdvancedValue(animConfig, 'delayedPlay', 0);

        anims.setDelay(delay);
        anims.setRepeat(repeat);
        anims.setRepeatDelay(repeatDelay);
        anims.setYoyo(yoyo);

        if (play)
        {
            anims.play(key, startFrame);
        }
        else if (delayedPlay > 0)
        {
            anims.delayedPlay(delayedPlay, key, startFrame);
        }
        else
        {
            anims.load(key);
        }
    }

    return sprite;
};

module.exports = BuildGameObjectAnimation;


/***/ }),
/* 71 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

//  Source object
//  The key as a string, or an array of keys, i.e. 'banner', or 'banner.hideBanner'
//  The default value to use if the key doesn't exist

/**
 * [description]
 *
 * @function Phaser.Utils.Objects.GetValue
 * @since 3.0.0
 *
 * @param {object} source - [description]
 * @param {string} key - [description]
 * @param {*} defaultValue - [description]
 *
 * @return {*} [description]
 */
var GetValue = function (source, key, defaultValue)
{
    if (!source || typeof source === 'number')
    {
        return defaultValue;
    }
    else if (source.hasOwnProperty(key))
    {
        return source[key];
    }
    else if (key.indexOf('.'))
    {
        var keys = key.split('.');
        var parent = source;
        var value = defaultValue;

        //  Use for loop here so we can break early
        for (var i = 0; i < keys.length; i++)
        {
            if (parent.hasOwnProperty(keys[i]))
            {
                //  Yes it has a key property, let's carry on down
                value = parent[keys[i]];

                parent = parent[keys[i]];
            }
            else
            {
                //  Can't go any further, so reset to default
                value = defaultValue;
                break;
            }
        }

        return value;
    }
    else
    {
        return defaultValue;
    }
};

module.exports = GetValue;


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = __webpack_require__(0);

/**
 * @classdesc
 * A seeded Random Data Generator.
 * 
 * Access via `Phaser.Math.RND` which is an instance of this class pre-defined
 * by Phaser. Or, create your own instance to use as you require.
 * 
 * The `Math.RND` generator is seeded by the Game Config property value `seed`.
 * If no such config property exists, a random number is used.
 * 
 * If you create your own instance of this class you should provide a seed for it.
 * If no seed is given it will use a 'random' one based on Date.now.
 *
 * @class RandomDataGenerator
 * @memberOf Phaser.Math
 * @constructor
 * @since 3.0.0
 *
 * @param {(string|string[])} [seeds] - The seeds to use for the random number generator.
 */
var RandomDataGenerator = new Class({

    initialize:

    function RandomDataGenerator (seeds)
    {
        if (seeds === undefined) { seeds = [ (Date.now() * Math.random()).toString() ]; }

        /**
         * Internal var.
         *
         * @name Phaser.Math.RandomDataGenerator#c
         * @type {number}
         * @default 1
         * @private
         * @since 3.0.0
         */
        this.c = 1;

        /**
         * Internal var.
         *
         * @name Phaser.Math.RandomDataGenerator#s0
         * @type {number}
         * @default 0
         * @private
         * @since 3.0.0
         */
        this.s0 = 0;

        /**
         * Internal var.
         *
         * @name Phaser.Math.RandomDataGenerator#s1
         * @type {number}
         * @default 0
         * @private
         * @since 3.0.0
         */
        this.s1 = 0;

        /**
         * Internal var.
         *
         * @name Phaser.Math.RandomDataGenerator#s2
         * @type {number}
         * @default 0
         * @private
         * @since 3.0.0
         */
        this.s2 = 0;

        /**
         * Internal var.
         *
         * @name Phaser.Math.RandomDataGenerator#n
         * @type {number}
         * @default 0
         * @private
         * @since 3.2.0
         */
        this.n = 0;

        /**
         * Signs to choose from.
         *
         * @name Phaser.Math.RandomDataGenerator#signs
         * @type {number[]}
         * @since 3.0.0
         */
        this.signs = [ -1, 1 ];

        if (seeds)
        {
            this.init(seeds);
        }
    },

    /**
     * Private random helper.
     *
     * @method Phaser.Math.RandomDataGenerator#rnd
     * @since 3.0.0
     * @private
     *
     * @return {number} A random number.
     */
    rnd: function ()
    {
        var t = 2091639 * this.s0 + this.c * 2.3283064365386963e-10; // 2^-32

        this.c = t | 0;
        this.s0 = this.s1;
        this.s1 = this.s2;
        this.s2 = t - this.c;

        return this.s2;
    },

    /**
     * Internal method that creates a seed hash.
     *
     * @method Phaser.Math.RandomDataGenerator#hash
     * @since 3.0.0
     * @private
     *
     * @param {string} data - The value to hash.
     *
     * @return {number} The hashed value.
     */
    hash: function (data)
    {
        var h;
        var n = this.n;

        data = data.toString();

        for (var i = 0; i < data.length; i++)
        {
            n += data.charCodeAt(i);
            h = 0.02519603282416938 * n;
            n = h >>> 0;
            h -= n;
            h *= n;
            n = h >>> 0;
            h -= n;
            n += h * 0x100000000;// 2^32
        }

        this.n = n;

        return (n >>> 0) * 2.3283064365386963e-10;// 2^-32
    },

    /**
     * Initialize the state of the random data generator.
     *
     * @method Phaser.Math.RandomDataGenerator#init
     * @since 3.0.0
     *
     * @param {(string|string[])} seeds - The seeds to initialize the random data generator with.
     */
    init: function (seeds)
    {
        if (typeof seeds === 'string')
        {
            this.state(seeds);
        }
        else
        {
            this.sow(seeds);
        }
    },

    /**
     * Reset the seed of the random data generator.
     *
     * _Note_: the seed array is only processed up to the first `undefined` (or `null`) value, should such be present.
     *
     * @method Phaser.Math.RandomDataGenerator#sow
     * @since 3.0.0
     *
     * @param {string[]} seeds - The array of seeds: the `toString()` of each value is used.
     */
    sow: function (seeds)
    {
        // Always reset to default seed
        this.n = 0xefc8249d;
        this.s0 = this.hash(' ');
        this.s1 = this.hash(' ');
        this.s2 = this.hash(' ');
        this.c = 1;

        if (!seeds)
        {
            return;
        }

        // Apply any seeds
        for (var i = 0; i < seeds.length && (seeds[i] != null); i++)
        {
            var seed = seeds[i];

            this.s0 -= this.hash(seed);
            this.s0 += ~~(this.s0 < 0);
            this.s1 -= this.hash(seed);
            this.s1 += ~~(this.s1 < 0);
            this.s2 -= this.hash(seed);
            this.s2 += ~~(this.s2 < 0);
        }
    },

    /**
     * Returns a random integer between 0 and 2^32.
     *
     * @method Phaser.Math.RandomDataGenerator#integer
     * @since 3.0.0
     *
     * @return {number} A random integer between 0 and 2^32.
     */
    integer: function ()
    {
        // 2^32
        return this.rnd() * 0x100000000;
    },

    /**
     * Returns a random real number between 0 and 1.
     *
     * @method Phaser.Math.RandomDataGenerator#frac
     * @since 3.0.0
     *
     * @return {number} A random real number between 0 and 1.
     */
    frac: function ()
    {
        // 2^-53
        return this.rnd() + (this.rnd() * 0x200000 | 0) * 1.1102230246251565e-16;
    },

    /**
     * Returns a random real number between 0 and 2^32.
     *
     * @method Phaser.Math.RandomDataGenerator#real
     * @since 3.0.0
     *
     * @return {number} A random real number between 0 and 2^32.
     */
    real: function ()
    {
        return this.integer() + this.frac();
    },

    /**
     * Returns a random integer between and including min and max.
     *
     * @method Phaser.Math.RandomDataGenerator#integerInRange
     * @since 3.0.0
     *
     * @param {number} min - The minimum value in the range.
     * @param {number} max - The maximum value in the range.
     *
     * @return {number} A random number between min and max.
     */
    integerInRange: function (min, max)
    {
        return Math.floor(this.realInRange(0, max - min + 1) + min);
    },

    /**
     * Returns a random integer between and including min and max.
     * This method is an alias for RandomDataGenerator.integerInRange.
     *
     * @method Phaser.Math.RandomDataGenerator#between
     * @since 3.0.0
     *
     * @param {number} min - The minimum value in the range.
     * @param {number} max - The maximum value in the range.
     *
     * @return {number} A random number between min and max.
     */
    between: function (min, max)
    {
        return Math.floor(this.realInRange(0, max - min + 1) + min);
    },

    /**
     * Returns a random real number between min and max.
     *
     * @method Phaser.Math.RandomDataGenerator#realInRange
     * @since 3.0.0
     *
     * @param {number} min - The minimum value in the range.
     * @param {number} max - The maximum value in the range.
     *
     * @return {number} A random number between min and max.
     */
    realInRange: function (min, max)
    {
        return this.frac() * (max - min) + min;
    },

    /**
     * Returns a random real number between -1 and 1.
     *
     * @method Phaser.Math.RandomDataGenerator#normal
     * @since 3.0.0
     *
     * @return {number} A random real number between -1 and 1.
     */
    normal: function ()
    {
        return 1 - (2 * this.frac());
    },

    /**
     * Returns a valid RFC4122 version4 ID hex string from https://gist.github.com/1308368
     *
     * @method Phaser.Math.RandomDataGenerator#uuid
     * @since 3.0.0
     *
     * @return {string} A valid RFC4122 version4 ID hex string
     */
    uuid: function ()
    {
        var a = '';
        var b = '';

        for (b = a = ''; a++ < 36; b += ~a % 5 | a * 3 & 4 ? (a ^ 15 ? 8 ^ this.frac() * (a ^ 20 ? 16 : 4) : 4).toString(16) : '-')
        {
            // eslint-disable-next-line no-empty
        }

        return b;
    },

    /**
     * Returns a random element from within the given array.
     *
     * @method Phaser.Math.RandomDataGenerator#pick
     * @since 3.0.0
     *
     * @param {array} array - The array to pick a random element from.
     *
     * @return {*} A random member of the array.
     */
    pick: function (array)
    {
        return array[this.integerInRange(0, array.length - 1)];
    },

    /**
     * Returns a sign to be used with multiplication operator.
     *
     * @method Phaser.Math.RandomDataGenerator#sign
     * @since 3.0.0
     *
     * @return {number} -1 or +1.
     */
    sign: function ()
    {
        return this.pick(this.signs);
    },

    /**
     * Returns a random element from within the given array, favoring the earlier entries.
     *
     * @method Phaser.Math.RandomDataGenerator#weightedPick
     * @since 3.0.0
     *
     * @param {array} array - The array to pick a random element from.
     *
     * @return {*} A random member of the array.
     */
    weightedPick: function (array)
    {
        return array[~~(Math.pow(this.frac(), 2) * (array.length - 1) + 0.5)];
    },

    /**
     * Returns a random timestamp between min and max, or between the beginning of 2000 and the end of 2020 if min and max aren't specified.
     *
     * @method Phaser.Math.RandomDataGenerator#timestamp
     * @since 3.0.0
     *
     * @param {number} min - The minimum value in the range.
     * @param {number} max - The maximum value in the range.
     *
     * @return {number} A random timestamp between min and max.
     */
    timestamp: function (min, max)
    {
        return this.realInRange(min || 946684800000, max || 1577862000000);
    },

    /**
     * Returns a random angle between -180 and 180.
     *
     * @method Phaser.Math.RandomDataGenerator#angle
     * @since 3.0.0
     *
     * @return {number} A random number between -180 and 180.
     */
    angle: function ()
    {
        return this.integerInRange(-180, 180);
    },

    /**
     * Returns a random rotation in radians, between -3.141 and 3.141
     *
     * @method Phaser.Math.RandomDataGenerator#rotation
     * @since 3.0.0
     *
     * @return {number} A random number between -3.141 and 3.141
     */
    rotation: function ()
    {
        return this.realInRange(-3.1415926, 3.1415926);
    },

    /**
     * Gets or Sets the state of the generator. This allows you to retain the values
     * that the generator is using between games, i.e. in a game save file.
     *
     * To seed this generator with a previously saved state you can pass it as the
     * `seed` value in your game config, or call this method directly after Phaser has booted.
     *
     * Call this method with no parameters to return the current state.
     *
     * If providing a state it should match the same format that this method
     * returns, which is a string with a header `!rnd` followed by the `c`,
     * `s0`, `s1` and `s2` values respectively, each comma-delimited.
     *
     * @method Phaser.Math.RandomDataGenerator#state
     * @since 3.0.0
     *
     * @param {string} [state] - Generator state to be set.
     *
     * @return {string} The current state of the generator.
     */
    state: function (state)
    {
        if (typeof state === 'string' && state.match(/^!rnd/))
        {
            state = state.split(',');

            this.c = parseFloat(state[1]);
            this.s0 = parseFloat(state[2]);
            this.s1 = parseFloat(state[3]);
            this.s2 = parseFloat(state[4]);
        }

        return [ '!rnd', this.c, this.s0, this.s1, this.s2 ].join(',');
    },

    /**
     * Shuffles the given array, using the current seed.
     *
     * @method Phaser.Math.RandomDataGenerator#shuffle
     * @since 3.7.0
     *
     * @param {array} [array] - The array to be shuffled.
     *
     * @return {array} The shuffled array.
     */
    shuffle: function (array)
    {
        var len = array.length - 1;

        for (var i = len; i > 0; i--)
        {
            var randomIndex = Math.floor(this.frac() * (len + 1));
            var itemAtIndex = array[randomIndex];

            array[randomIndex] = array[i];
            array[i] = itemAtIndex;
        }

        return array;
    }

});

module.exports = RandomDataGenerator;


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var BlendModes = __webpack_require__(18);
var GetAdvancedValue = __webpack_require__(4);
var ScaleModes = __webpack_require__(16);

/**
 * @typedef {object} GameObjectConfig
 *
 * @property {number} [x=0] - The x position of the Game Object.
 * @property {number} [y=0] - The y position of the Game Object.
 * @property {number} [depth=0] - The depth of the GameObject.
 * @property {boolean} [flipX=false] - The horizontally flipped state of the Game Object.
 * @property {boolean} [flipY=false] - The vertically flipped state of the Game Object.
 * @property {?(number|object)} [scale=null] - The scale of the GameObject.
 * @property {?(number|object)} [scrollFactor=null] - The scroll factor of the GameObject.
 * @property {number} [rotation=0] - The rotation angle of the Game Object, in radians.
 * @property {?number} [angle=null] - The rotation angle of the Game Object, in degrees.
 * @property {number} [alpha=1] - The alpha (opacity) of the Game Object.
 * @property {?(number|object)} [origin=null] - The origin of the Game Object.
 * @property {number} [scaleMode=ScaleModes.DEFAULT] - The scale mode of the GameObject.
 * @property {number} [blendMode=BlendModes.DEFAULT] - The blend mode of the GameObject.
 * @property {boolean} [visible=true] - The visible state of the Game Object.
 * @property {boolean} [add=true] - Add the GameObject to the scene.
 */

/**
 * Builds a Game Object using the provided configuration object.
 *
 * @function Phaser.GameObjects.BuildGameObject
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - A reference to the Scene.
 * @param {Phaser.GameObjects.GameObject} gameObject - The initial GameObject.
 * @param {GameObjectConfig} config - The config to build the GameObject with.
 *
 * @return {Phaser.GameObjects.GameObject} The built Game Object.
 */
var BuildGameObject = function (scene, gameObject, config)
{
    //  Position

    gameObject.x = GetAdvancedValue(config, 'x', 0);
    gameObject.y = GetAdvancedValue(config, 'y', 0);
    gameObject.depth = GetAdvancedValue(config, 'depth', 0);

    //  Flip

    gameObject.flipX = GetAdvancedValue(config, 'flipX', false);
    gameObject.flipY = GetAdvancedValue(config, 'flipY', false);

    //  Scale
    //  Either: { scale: 2 } or { scale: { x: 2, y: 2 }}

    var scale = GetAdvancedValue(config, 'scale', null);

    if (typeof scale === 'number')
    {
        gameObject.setScale(scale);
    }
    else if (scale !== null)
    {
        gameObject.scaleX = GetAdvancedValue(scale, 'x', 1);
        gameObject.scaleY = GetAdvancedValue(scale, 'y', 1);
    }

    //  ScrollFactor
    //  Either: { scrollFactor: 2 } or { scrollFactor: { x: 2, y: 2 }}

    var scrollFactor = GetAdvancedValue(config, 'scrollFactor', null);

    if (typeof scrollFactor === 'number')
    {
        gameObject.setScrollFactor(scrollFactor);
    }
    else if (scrollFactor !== null)
    {
        gameObject.scrollFactorX = GetAdvancedValue(scrollFactor, 'x', 1);
        gameObject.scrollFactorY = GetAdvancedValue(scrollFactor, 'y', 1);
    }

    //  Rotation

    gameObject.rotation = GetAdvancedValue(config, 'rotation', 0);

    var angle = GetAdvancedValue(config, 'angle', null);

    if (angle !== null)
    {
        gameObject.angle = angle;
    }

    //  Alpha

    gameObject.alpha = GetAdvancedValue(config, 'alpha', 1);

    //  Origin
    //  Either: { origin: 0.5 } or { origin: { x: 0.5, y: 0.5 }}

    var origin = GetAdvancedValue(config, 'origin', null);

    if (typeof origin === 'number')
    {
        gameObject.setOrigin(origin);
    }
    else if (origin !== null)
    {
        var ox = GetAdvancedValue(origin, 'x', 0.5);
        var oy = GetAdvancedValue(origin, 'y', 0.5);

        gameObject.setOrigin(ox, oy);
    }

    //  ScaleMode

    gameObject.scaleMode = GetAdvancedValue(config, 'scaleMode', ScaleModes.DEFAULT);

    //  BlendMode

    gameObject.blendMode = GetAdvancedValue(config, 'blendMode', BlendModes.NORMAL);

    //  Visible

    gameObject.visible = GetAdvancedValue(config, 'visible', true);

    //  Add to Scene

    var add = GetAdvancedValue(config, 'add', true);

    if (add)
    {
        scene.sys.displayList.add(gameObject);
    }

    if (gameObject.preUpdate)
    {
        scene.sys.updateList.add(gameObject);
    }

    return gameObject;
};

module.exports = BuildGameObject;


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var BuildGameObject = __webpack_require__(73);
var BuildGameObjectAnimation = __webpack_require__(70);
var Class = __webpack_require__(0);
var GetAdvancedValue = __webpack_require__(4);
var OrthographicCamera = __webpack_require__(69);
var PerspectiveCamera = __webpack_require__(21);
var ScenePlugin = __webpack_require__(20);
var Sprite3D = __webpack_require__(13);

/**
 * @classdesc
 * The Camera 3D Plugin adds a new Camera type to Phaser that allows for movement and rendering
 * in 3D space. It displays a special type of Sprite called a Sprite3D that is a billboard sprite,
 * with a z-axis allowing for perspective depth.
 *
 * This is an external plugin which you can include in your game by preloading it:
 *
 * ```javascript
 * this.load.scenePlugin({
 *   key: 'Camera3DPlugin',
 *   url: 'plugins/camera3d.min.js',
 *   sceneKey: 'cameras3d'
 * });
 * ```
 *
 * Once loaded you can create a 3D Camera using the `camera3d` property of a Scene:
 *
 * `var camera = this.cameras3d.add(85).setZ(500).setPixelScale(128);`
 *
 * See the examples for more information.
 *
 * @class Camera3DPlugin
 * @constructor
 *
 * @param {Phaser.Scene} scene - The Scene to which this plugin is being installed.
 * @param {Phaser.Plugins.PluginManager} pluginManager - A reference to the Phaser Plugin Manager.
 */
var Camera3DPlugin = new Class({

    Extends: ScenePlugin,

    initialize:

    function Camera3DPlugin (scene, pluginManager)
    {
        ScenePlugin.call(this, scene, pluginManager);

        /**
         * An Array of the Camera objects being managed by this Camera Manager.
         *
         * @name Camera3DPlugin#cameras
         * @type {Phaser.Cameras.Sprite3D.Camera[]}
         * @since 3.0.0
         */
        this.cameras = [];

        //  Register the Sprite3D Game Object
        pluginManager.registerGameObject('sprite3D', this.sprite3DFactory, this.sprite3DCreator);
    },

    /**
     * Creates a new Sprite3D Game Object and adds it to the Scene.
     *
     * @method Phaser.GameObjects.GameObjectFactory#sprite3D
     * @since 3.0.0
     * 
     * @param {number} x - The horizontal position of this Game Object.
     * @param {number} y - The vertical position of this Game Object.
     * @param {number} z - The z position of this Game Object.
     * @param {string} texture - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager.
     * @param {(string|integer)} [frame] - An optional frame from the Texture this Game Object is rendering with.
     *
     * @return {Phaser.GameObjects.Sprite3D} The Game Object that was created.
     */
    sprite3DFactory: function (x, y, z, key, frame)
    {
        var sprite = new Sprite3D(this.scene, x, y, z, key, frame);

        this.displayList.add(sprite.gameObject);
        this.updateList.add(sprite.gameObject);

        return sprite;
    },

    /**
     * Creates a new Sprite3D Game Object and returns it.
     *
     * @method Phaser.GameObjects.GameObjectCreator#sprite3D
     * @since 3.0.0
     * 
     * @param {object} config - The configuration object this Game Object will use to create itself.
     * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this argument overrides the `add` property in the config object.
     *
     * @return {Phaser.GameObjects.Sprite3D} The Game Object that was created.
     */
    sprite3DCreator: function (config, addToScene)
    {
        if (config === undefined) { config = {}; }

        var key = GetAdvancedValue(config, 'key', null);
        var frame = GetAdvancedValue(config, 'frame', null);
    
        var sprite = new Sprite3D(this.scene, 0, 0, key, frame);
    
        if (addToScene !== undefined)
        {
            config.add = addToScene;
        }
    
        BuildGameObject(this.scene, sprite, config);
    
        //  Sprite specific config options:
    
        BuildGameObjectAnimation(sprite, config);
    
        return sprite;
    },

    /**
     * This method is called automatically, only once, when the Scene is first created.
     * Do not invoke it directly.
     *
     * @method Phaser.Cameras.Scene3D.CameraManager#boot
     * @private
     * @since 3.5.1
     */
    boot: function ()
    {
        this.systems.events.once('destroy', this.destroy, this);
    },

    /**
     * This method is called automatically by the Scene when it is starting up.
     * It is responsible for creating local systems, properties and listening for Scene events.
     * Do not invoke it directly.
     *
     * @method Camera3DPlugin#start
     * @private
     * @since 3.5.0
     */
    start: function ()
    {
        var eventEmitter = this.systems.events;

        eventEmitter.on('update', this.update, this);
        eventEmitter.once('shutdown', this.shutdown, this);
    },

    /**
     * [description]
     *
     * @method Camera3DPlugin#add
     * @since 3.0.0
     *
     * @param {number} [fieldOfView=80] - [description]
     * @param {number} [width] - [description]
     * @param {number} [height] - [description]
     *
     * @return {Phaser.Cameras.Sprite3D.PerspectiveCamera} [description]
     */
    add: function (fieldOfView, width, height)
    {
        return this.addPerspectiveCamera(fieldOfView, width, height);
    },

    /**
     * [description]
     *
     * @method Camera3DPlugin#addOrthographicCamera
     * @since 3.0.0
     *
     * @param {number} width - [description]
     * @param {number} height - [description]
     *
     * @return {Phaser.Cameras.Sprite3D.OrthographicCamera} [description]
     */
    addOrthographicCamera: function (width, height)
    {
        var config = this.scene.sys.game.config;

        if (width === undefined) { width = config.width; }
        if (height === undefined) { height = config.height; }

        var camera = new OrthographicCamera(this.scene, width, height);

        this.cameras.push(camera);

        return camera;
    },

    /**
     * [description]
     *
     * @method Camera3DPlugin#addPerspectiveCamera
     * @since 3.0.0
     *
     * @param {number} [fieldOfView=80] - [description]
     * @param {number} [width] - [description]
     * @param {number} [height] - [description]
     *
     * @return {Phaser.Cameras.Sprite3D.PerspectiveCamera} [description]
     */
    addPerspectiveCamera: function (fieldOfView, width, height)
    {
        var config = this.scene.sys.game.config;

        if (fieldOfView === undefined) { fieldOfView = 80; }
        if (width === undefined) { width = config.width; }
        if (height === undefined) { height = config.height; }

        var camera = new PerspectiveCamera(this.scene, fieldOfView, width, height);

        this.cameras.push(camera);

        return camera;
    },

    /**
     * [description]
     *
     * @method Camera3DPlugin#getCamera
     * @since 3.0.0
     *
     * @param {string} name - [description]
     *
     * @return {(Phaser.Cameras.Sprite3D.OrthographicCamera|Phaser.Cameras.Sprite3D.PerspectiveCamera)} [description]
     */
    getCamera: function (name)
    {
        for (var i = 0; i < this.cameras.length; i++)
        {
            if (this.cameras[i].name === name)
            {
                return this.cameras[i];
            }
        }

        return null;
    },

    /**
     * [description]
     *
     * @method Camera3DPlugin#removeCamera
     * @since 3.0.0
     *
     * @param {(Phaser.Cameras.Sprite3D.OrthographicCamera|Phaser.Cameras.Sprite3D.PerspectiveCamera)} camera - [description]
     */
    removeCamera: function (camera)
    {
        var cameraIndex = this.cameras.indexOf(camera);

        if (cameraIndex !== -1)
        {
            this.cameras.splice(cameraIndex, 1);
        }
    },

    /**
     * [description]
     *
     * @method Camera3DPlugin#removeAll
     * @since 3.0.0
     *
     * @return {(Phaser.Cameras.Sprite3D.OrthographicCamera|Phaser.Cameras.Sprite3D.PerspectiveCamera)} [description]
     */
    removeAll: function ()
    {
        while (this.cameras.length > 0)
        {
            var camera = this.cameras.pop();

            camera.destroy();
        }

        return this.main;
    },

    /**
     * [description]
     *
     * @method Camera3DPlugin#update
     * @since 3.0.0
     *
     * @param {number} timestep - [description]
     * @param {number} delta - [description]
     */
    update: function (timestep, delta)
    {
        for (var i = 0, l = this.cameras.length; i < l; ++i)
        {
            this.cameras[i].update(timestep, delta);
        }
    },

    /**
     * The Scene that owns this plugin is shutting down.
     * We need to kill and reset all internal properties as well as stop listening to Scene events.
     *
     * @method Camera3DPlugin#shutdown
     * @private
     * @since 3.0.0
     */
    shutdown: function ()
    {
        var eventEmitter = this.systems.events;

        eventEmitter.off('update', this.update, this);
        eventEmitter.off('shutdown', this.shutdown, this);

        this.removeAll();
    },

    /**
     * The Scene that owns this plugin is being destroyed.
     * We need to shutdown and then kill off all external references.
     *
     * @method Camera3DPlugin#destroy
     * @private
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.shutdown();

        this.pluginManager = null;
        this.game = null;
        this.scene = null;
        this.systems = null;
    }

});

module.exports = Camera3DPlugin;


/***/ })
/******/ ]);