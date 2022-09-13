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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/ 	return __webpack_require__(__webpack_require__.s = 42);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
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

/**
 * Extends the given `myClass` object's prototype with the properties of `definition`.
 *
 * @function extend
 * @param {Object} ctor The constructor object to mix into.
 * @param {Object} definition A dictionary of functions for the class.
 * @param {boolean} isClassDescriptor Is the definition a class descriptor?
 * @param {Object} [extend] The parent constructor object.
 */
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

/**
 * Applies the given `mixins` to the prototype of `myClass`.
 *
 * @function mixin
 * @param {Object} myClass The constructor object to mix into.
 * @param {Object|Array<Object>} mixins The mixins to apply to the constructor.
 */
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
 * @class Phaser.Class
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
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

//  Adapted from [gl-matrix](https://github.com/toji/gl-matrix) by toji
//  and [vecmath](https://github.com/mattdesl/vecmath) by mattdesl

var Class = __webpack_require__(0);
var FuzzyEqual = __webpack_require__(18);

/**
 * @classdesc
 * A representation of a vector in 2D space.
 *
 * A two-component vector.
 *
 * @class Vector2
 * @memberof Phaser.Math
 * @constructor
 * @since 3.0.0
 *
 * @param {number|Phaser.Types.Math.Vector2Like} [x] - The x component, or an object with `x` and `y` properties.
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
     * @param {Phaser.Types.Math.Vector2Like} obj - The object containing the component values to set for this Vector.
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
     * Check whether this Vector is approximately equal to a given Vector.
     *
     * @method Phaser.Math.Vector2#fuzzyEquals
     * @since 3.23.0
     *
     * @param {Phaser.Math.Vector2} v - The vector to compare with this Vector.
     * @param {number} [epsilon=0.0001] - The tolerance value.
     *
     * @return {boolean} Whether both absolute differences of the x and y components are smaller than `epsilon`.
     */
    fuzzyEquals: function (v, epsilon)
    {
        return (FuzzyEqual(this.x, v.x, epsilon) && FuzzyEqual(this.y, v.y, epsilon));
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
     * Set the angle of this Vector.
     *
     * @method Phaser.Math.Vector2#setAngle
     * @since 3.23.0
     *
     * @param {number} angle - The angle, in radians.
     *
     * @return {Phaser.Math.Vector2} This Vector2.
     */
    setAngle: function (angle)
    {
        return this.setToPolar(angle, this.length());
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
     * Set the length (or magnitude) of this Vector.
     *
     * @method Phaser.Math.Vector2#setLength
     * @since 3.23.0
     *
     * @param {number} length
     *
     * @return {Phaser.Math.Vector2} This Vector2.
     */
    setLength: function (length)
    {
        return this.normalize().scale(length);
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
     * Rotate this Vector to its perpendicular, in the positive direction.
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
     * Rotate this Vector to its perpendicular, in the negative direction.
     *
     * @method Phaser.Math.Vector2#normalizeLeftHand
     * @since 3.23.0
     *
     * @return {Phaser.Math.Vector2} This Vector2.
     */
    normalizeLeftHand: function ()
    {
        var x = this.x;

        this.x = this.y;
        this.y = x * -1;

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
     * Calculate the cross product of this Vector and the given Vector.
     *
     * @method Phaser.Math.Vector2#cross
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector2} src - The Vector2 to cross with this Vector2.
     *
     * @return {number} The cross product of this Vector and the given Vector.
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
    },

    /**
     * Limit the length (or magnitude) of this Vector.
     *
     * @method Phaser.Math.Vector2#limit
     * @since 3.23.0
     *
     * @param {number} max - The maximum length.
     *
     * @return {Phaser.Math.Vector2} This Vector2.
     */
    limit: function (max)
    {
        var len = this.length();

        if (len && len > max)
        {
            this.scale(max / len);
        }

        return this;
    },

    /**
     * Reflect this Vector off a line defined by a normal.
     *
     * @method Phaser.Math.Vector2#reflect
     * @since 3.23.0
     *
     * @param {Phaser.Math.Vector2} normal - A vector perpendicular to the line.
     *
     * @return {Phaser.Math.Vector2} This Vector2.
     */
    reflect: function (normal)
    {
        normal = normal.clone().normalize();

        return this.subtract(normal.scale(2 * this.dot(normal)));
    },

    /**
     * Reflect this Vector across another.
     *
     * @method Phaser.Math.Vector2#mirror
     * @since 3.23.0
     *
     * @param {Phaser.Math.Vector2} axis - A vector to reflect across.
     *
     * @return {Phaser.Math.Vector2} This Vector2.
     */
    mirror: function (axis)
    {
        return this.reflect(axis).negate();
    },

    /**
     * Rotate this Vector by an angle amount.
     *
     * @method Phaser.Math.Vector2#rotate
     * @since 3.23.0
     *
     * @param {number} delta - The angle to rotate by, in radians.
     *
     * @return {Phaser.Math.Vector2} This Vector2.
     */
    rotate: function (delta)
    {
        var cos = Math.cos(delta);
        var sin = Math.sin(delta);

        return this.set(cos * this.x - sin * this.y, sin * this.x + cos * this.y);
    }

});

/**
 * A static zero Vector2 for use by reference.
 *
 * This constant is meant for comparison operations and should not be modified directly.
 *
 * @constant
 * @name Phaser.Math.Vector2.ZERO
 * @type {Phaser.Math.Vector2}
 * @since 3.1.0
 */
Vector2.ZERO = new Vector2();

/**
 * A static right Vector2 for use by reference.
 *
 * This constant is meant for comparison operations and should not be modified directly.
 *
 * @constant
 * @name Phaser.Math.Vector2.RIGHT
 * @type {Phaser.Math.Vector2}
 * @since 3.16.0
 */
Vector2.RIGHT = new Vector2(1, 0);

/**
 * A static left Vector2 for use by reference.
 *
 * This constant is meant for comparison operations and should not be modified directly.
 *
 * @constant
 * @name Phaser.Math.Vector2.LEFT
 * @type {Phaser.Math.Vector2}
 * @since 3.16.0
 */
Vector2.LEFT = new Vector2(-1, 0);

/**
 * A static up Vector2 for use by reference.
 *
 * This constant is meant for comparison operations and should not be modified directly.
 *
 * @constant
 * @name Phaser.Math.Vector2.UP
 * @type {Phaser.Math.Vector2}
 * @since 3.16.0
 */
Vector2.UP = new Vector2(0, -1);

/**
 * A static down Vector2 for use by reference.
 *
 * This constant is meant for comparison operations and should not be modified directly.
 *
 * @constant
 * @name Phaser.Math.Vector2.DOWN
 * @type {Phaser.Math.Vector2}
 * @since 3.16.0
 */
Vector2.DOWN = new Vector2(0, 1);

/**
 * A static one Vector2 for use by reference.
 *
 * This constant is meant for comparison operations and should not be modified directly.
 *
 * @constant
 * @name Phaser.Math.Vector2.ONE
 * @type {Phaser.Math.Vector2}
 * @since 3.16.0
 */
Vector2.ONE = new Vector2(1, 1);

module.exports = Vector2;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

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
     * This is not set until the Game boots.
     * 
     * @name Phaser.Math.RND
     * @type {Phaser.Math.RandomDataGenerator}
     * @since 3.0.0
     */
    RND: null,

    /**
     * The minimum safe integer this browser supports.
     * We use a const for backward compatibility with Internet Explorer.
     * 
     * @name Phaser.Math.MIN_SAFE_INTEGER
     * @type {number}
     * @since 3.21.0
     */
    MIN_SAFE_INTEGER: Number.MIN_SAFE_INTEGER || -9007199254740991,

    /**
     * The maximum safe integer this browser supports.
     * We use a const for backward compatibility with Internet Explorer.
     * 
     * @name Phaser.Math.MAX_SAFE_INTEGER
     * @type {number}
     * @since 3.21.0
     */
    MAX_SAFE_INTEGER: Number.MAX_SAFE_INTEGER || 9007199254740991

};

module.exports = MATH_CONST;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
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
 * @memberof Phaser.Math
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
     * Sets the components of this Vector to be the `Math.min` result from the given vector.
     *
     * @method Phaser.Math.Vector3#min
     * @since 3.50.0
     *
     * @param {Phaser.Math.Vector3} v - The Vector3 to check the minimum values against.
     *
     * @return {Phaser.Math.Vector3} This Vector3.
     */
    min: function (v)
    {
        this.x = Math.min(this.x, v.x);
        this.y = Math.min(this.y, v.y);
        this.z = Math.min(this.z, v.z);

        return this;
    },

    /**
     * Sets the components of this Vector to be the `Math.max` result from the given vector.
     *
     * @method Phaser.Math.Vector3#max
     * @since 3.50.0
     *
     * @param {Phaser.Math.Vector3} v - The Vector3 to check the maximum values against.
     *
     * @return {Phaser.Math.Vector3} This Vector3.
     */
    max: function (v)
    {
        this.x = Math.max(this.x, v.x);
        this.y = Math.max(this.y, v.y);
        this.z = Math.max(this.z, v.z);

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
     * Adds the two given Vector3s and sets the results into this Vector3.
     *
     * @method Phaser.Math.Vector3#addVectors
     * @since 3.50.0
     *
     * @param {Phaser.Math.Vector3} a - The first Vector to add.
     * @param {Phaser.Math.Vector3} b - The second Vector to add.
     *
     * @return {Phaser.Math.Vector3} This Vector3.
     */
    addVectors: function (a, b)
    {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;

        return this;
    },

    /**
     * Calculate the cross (vector) product of two given Vectors.
     *
     * @method Phaser.Math.Vector3#crossVectors
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector3} a - The first Vector to multiply.
     * @param {Phaser.Math.Vector3} b - The second Vector to multiply.
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
     * Sets the components of this Vector3 from the position of the given Matrix4.
     *
     * @method Phaser.Math.Vector3#setFromMatrixPosition
     * @since 3.50.0
     *
     * @param {Phaser.Math.Matrix4} mat4 - The Matrix4 to get the position from.
     *
     * @return {Phaser.Math.Vector3} This Vector3.
     */
    setFromMatrixPosition: function (m)
    {
        return this.fromArray(m.val, 12);
    },

    /**
     * Sets the components of this Vector3 from the Matrix4 column specified.
     *
     * @method Phaser.Math.Vector3#setFromMatrixColumn
     * @since 3.50.0
     *
     * @param {Phaser.Math.Matrix4} mat4 - The Matrix4 to get the column from.
     * @param {number} index - The column index.
     *
     * @return {Phaser.Math.Vector3} This Vector3.
     */
    setFromMatrixColumn: function (mat4, index)
    {
        return this.fromArray(mat4.val, index * 4);
    },

    /**
     * Sets the components of this Vector3 from the given array, based on the offset.
     *
     * Vector3.x = array[offset]
     * Vector3.y = array[offset + 1]
     * Vector3.z = array[offset + 2]
     *
     * @method Phaser.Math.Vector3#fromArray
     * @since 3.50.0
     *
     * @param {number[]} array - The array of values to get this Vector from.
     * @param {number} [offset=0] - The offset index into the array.
     *
     * @return {Phaser.Math.Vector3} This Vector3.
     */
    fromArray: function (array, offset)
    {
        if (offset === undefined) { offset = 0; }

        this.x = array[offset];
        this.y = array[offset + 1];
        this.z = array[offset + 2];

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
     * Add the given value to each component of this Vector.
     *
     * @method Phaser.Math.Vector3#addScalar
     * @since 3.50.0
     *
     * @param {number} s - The amount to add to this Vector.
     *
     * @return {Phaser.Math.Vector3} This Vector3.
     */
    addScalar: function (s)
    {
        this.x += s;
        this.y += s;
        this.z += s;

        return this;
    },

    /**
     * Add and scale a given Vector to this Vector. Addition is component-wise.
     *
     * @method Phaser.Math.Vector3#addScale
     * @since 3.50.0
     *
     * @param {(Phaser.Math.Vector2|Phaser.Math.Vector3)} v - The Vector to add to this Vector.
     * @param {number} scale - The amount to scale `v` by.
     *
     * @return {Phaser.Math.Vector3} This Vector3.
     */
    addScale: function (v, scale)
    {
        this.x += v.x * scale;
        this.y += v.y * scale;
        this.z += v.z * scale || 0;

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
     * @return {number} The dot product of this Vector and `v`.
     */
    dot: function (v)
    {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    },

    /**
     * Calculate the cross (vector) product of this Vector (which will be modified) and the given Vector.
     *
     * @method Phaser.Math.Vector3#cross
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector3} v - The Vector to cross product with.
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
     * Takes a Matrix3 and applies it to this Vector3.
     *
     * @method Phaser.Math.Vector3#applyMatrix3
     * @since 3.50.0
     *
     * @param {Phaser.Math.Matrix3} mat3 - The Matrix3 to apply to this Vector3.
     *
     * @return {Phaser.Math.Vector3} This Vector3.
     */
    applyMatrix3: function (mat3)
    {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var m = mat3.val;

        this.x = m[0] * x + m[3] * y + m[6] * z;
        this.y = m[1] * x + m[4] * y + m[7] * z;
        this.z = m[2] * x + m[5] * y + m[8] * z;

        return this;
    },

    /**
     * Takes a Matrix4 and applies it to this Vector3.
     *
     * @method Phaser.Math.Vector3#applyMatrix4
     * @since 3.50.0
     *
     * @param {Phaser.Math.Matrix4} mat4 - The Matrix4 to apply to this Vector3.
     *
     * @return {Phaser.Math.Vector3} This Vector3.
     */
    applyMatrix4: function (mat4)
    {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var m = mat4.val;

        var w = 1 / (m[3] * x + m[7] * y + m[11] * z + m[15]);

        this.x = (m[0] * x + m[4] * y + m[8] * z + m[12]) * w;
        this.y = (m[1] * x + m[5] * y + m[9] * z + m[13]) * w;
        this.z = (m[2] * x + m[6] * y + m[10] * z + m[14]) * w;

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
     * Transform this Vector with the given Matrix4.
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
     * Transforms the coordinates of this Vector3 with the given Matrix4.
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
     * Multiplies this Vector3 by the given view and projection matrices.
     *
     * @method Phaser.Math.Vector3#projectViewMatrix
     * @since 3.50.0
     *
     * @param {Phaser.Math.Matrix4} viewMatrix - A View Matrix.
     * @param {Phaser.Math.Matrix4} projectionMatrix - A Projection Matrix.
     *
     * @return {Phaser.Math.Vector3} This Vector3.
     */
    projectViewMatrix: function (viewMatrix, projectionMatrix)
    {
        return this.applyMatrix4(viewMatrix).applyMatrix4(projectionMatrix);
    },

    /**
     * Multiplies this Vector3 by the given inversed projection matrix and world matrix.
     *
     * @method Phaser.Math.Vector3#unprojectViewMatrix
     * @since 3.50.0
     *
     * @param {Phaser.Math.Matrix4} projectionMatrix - An inversed Projection Matrix.
     * @param {Phaser.Math.Matrix4} worldMatrix - A World View Matrix.
     *
     * @return {Phaser.Math.Vector3} This Vector3.
     */
    unprojectViewMatrix: function (projectionMatrix, worldMatrix)
    {
        return this.applyMatrix4(projectionMatrix).applyMatrix4(worldMatrix);
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

/**
 * A static zero Vector3 for use by reference.
 *
 * This constant is meant for comparison operations and should not be modified directly.
 *
 * @constant
 * @name Phaser.Math.Vector3.ZERO
 * @type {Phaser.Math.Vector3}
 * @since 3.16.0
 */
Vector3.ZERO = new Vector3();

/**
 * A static right Vector3 for use by reference.
 *
 * This constant is meant for comparison operations and should not be modified directly.
 *
 * @constant
 * @name Phaser.Math.Vector3.RIGHT
 * @type {Phaser.Math.Vector3}
 * @since 3.16.0
 */
Vector3.RIGHT = new Vector3(1, 0, 0);

/**
 * A static left Vector3 for use by reference.
 *
 * This constant is meant for comparison operations and should not be modified directly.
 *
 * @constant
 * @name Phaser.Math.Vector3.LEFT
 * @type {Phaser.Math.Vector3}
 * @since 3.16.0
 */
Vector3.LEFT = new Vector3(-1, 0, 0);

/**
 * A static up Vector3 for use by reference.
 *
 * This constant is meant for comparison operations and should not be modified directly.
 *
 * @constant
 * @name Phaser.Math.Vector3.UP
 * @type {Phaser.Math.Vector3}
 * @since 3.16.0
 */
Vector3.UP = new Vector3(0, -1, 0);

/**
 * A static down Vector3 for use by reference.
 *
 * This constant is meant for comparison operations and should not be modified directly.
 *
 * @constant
 * @name Phaser.Math.Vector3.DOWN
 * @type {Phaser.Math.Vector3}
 * @since 3.16.0
 */
Vector3.DOWN = new Vector3(0, 1, 0);

/**
 * A static forward Vector3 for use by reference.
 *
 * This constant is meant for comparison operations and should not be modified directly.
 *
 * @constant
 * @name Phaser.Math.Vector3.FORWARD
 * @type {Phaser.Math.Vector3}
 * @since 3.16.0
 */
Vector3.FORWARD = new Vector3(0, 0, 1);

/**
 * A static back Vector3 for use by reference.
 *
 * This constant is meant for comparison operations and should not be modified directly.
 *
 * @constant
 * @name Phaser.Math.Vector3.BACK
 * @type {Phaser.Math.Vector3}
 * @since 3.16.0
 */
Vector3.BACK = new Vector3(0, 0, -1);

/**
 * A static one Vector3 for use by reference.
 *
 * This constant is meant for comparison operations and should not be modified directly.
 *
 * @constant
 * @name Phaser.Math.Vector3.ONE
 * @type {Phaser.Math.Vector3}
 * @since 3.16.0
 */
Vector3.ONE = new Vector3(1, 1, 1);

module.exports = Vector3;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = __webpack_require__(0);
var GEOM_CONST = __webpack_require__(13);

/**
 * @classdesc
 * Defines a Point in 2D space, with an x and y component.
 *
 * @class Point
 * @memberof Phaser.Geom
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
         * The geometry constant type of this object: `GEOM_CONST.POINT`.
         * Used for fast type comparisons.
         *
         * @name Phaser.Geom.Point#type
         * @type {integer}
         * @readonly
         * @since 3.19.0
         */
        this.type = GEOM_CONST.POINT;

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
     * @return {this} This Point object.
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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = __webpack_require__(0);
var Vector3 = __webpack_require__(3);

/**
 * @ignore
 */
var EPSILON = 0.000001;

/**
 * @classdesc
 * A four-dimensional matrix.
 *
 * Adapted from [gl-matrix](https://github.com/toji/gl-matrix) by toji
 * and [vecmath](https://github.com/mattdesl/vecmath) by mattdesl
 *
 * @class Matrix4
 * @memberof Phaser.Math
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

    /**
     * This method is an alias for `Matrix4.copy`.
     *
     * @method Phaser.Math.Matrix4#set
     * @since 3.0.0
     *
     * @param {Phaser.Math.Matrix4} src - The Matrix to set the values of this Matrix's from.
     *
     * @return {this} This Matrix4.
     */
    set: function (src)
    {
        return this.copy(src);
    },

    /**
     * Sets all values of this Matrix4.
     *
     * @method Phaser.Math.Matrix4#setValues
     * @since 3.50.0
     *
     * @param {number} m00 - The m00 value.
     * @param {number} m01 - The m01 value.
     * @param {number} m02 - The m02 value.
     * @param {number} m03 - The m03 value.
     * @param {number} m10 - The m10 value.
     * @param {number} m11 - The m11 value.
     * @param {number} m12 - The m12 value.
     * @param {number} m13 - The m13 value.
     * @param {number} m20 - The m20 value.
     * @param {number} m21 - The m21 value.
     * @param {number} m22 - The m22 value.
     * @param {number} m23 - The m23 value.
     * @param {number} m30 - The m30 value.
     * @param {number} m31 - The m31 value.
     * @param {number} m32 - The m32 value.
     * @param {number} m33 - The m33 value.
     *
     * @return {this} This Matrix4 instance.
     */
    setValues: function (m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33)
    {
        var out = this.val;

        out[0] = m00;
        out[1] = m01;
        out[2] = m02;
        out[3] = m03;
        out[4] = m10;
        out[5] = m11;
        out[6] = m12;
        out[7] = m13;
        out[8] = m20;
        out[9] = m21;
        out[10] = m22;
        out[11] = m23;
        out[12] = m30;
        out[13] = m31;
        out[14] = m32;
        out[15] = m33;

        return this;
    },

    /**
     * Copy the values of a given Matrix into this Matrix.
     *
     * @method Phaser.Math.Matrix4#copy
     * @since 3.0.0
     *
     * @param {Phaser.Math.Matrix4} src - The Matrix to copy the values from.
     *
     * @return {this} This Matrix4.
     */
    copy: function (src)
    {
        var a = src.val;

        return this.setValues(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10], a[11], a[12], a[13], a[14], a[15]);
    },

    /**
     * Set the values of this Matrix from the given array.
     *
     * @method Phaser.Math.Matrix4#fromArray
     * @since 3.0.0
     *
     * @param {number[]} a - The array to copy the values from. Must have at least 16 elements.
     *
     * @return {this} This Matrix4.
     */
    fromArray: function (a)
    {
        return this.setValues(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10], a[11], a[12], a[13], a[14], a[15]);
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
        return this.setValues(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    },

    /**
     * Generates a transform matrix based on the given position, scale and rotation.
     *
     * @method Phaser.Math.Matrix4#transform
     * @since 3.50.0
     *
     * @param {Phaser.Math.Vector3} position - The position vector.
     * @param {Phaser.Math.Vector3} scale - The scale vector.
     * @param {Phaser.Math.Quaternion} rotation - The rotation quaternion.
     *
     * @return {this} This Matrix4.
     */
    transform: function (position, scale, rotation)
    {
        var rotMatrix = _tempMat1.fromQuat(rotation);

        var rm = rotMatrix.val;

        var sx = scale.x;
        var sy = scale.y;
        var sz = scale.z;

        return this.setValues(
            rm[0] * sx,
            rm[1] * sx,
            rm[2] * sx,
            0,

            rm[4] * sy,
            rm[5] * sy,
            rm[6] * sy,
            0,

            rm[8] * sz,
            rm[9] * sz,
            rm[10] * sz,
            0,

            position.x,
            position.y,
            position.z,
            1
        );
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
     * @return {this} This Matrix4.
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
     * @return {this} This Matrix4.
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
     * @return {this} This Matrix4.
     */
    identity: function ()
    {
        return this.setValues(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    },

    /**
     * Transpose this Matrix.
     *
     * @method Phaser.Math.Matrix4#transpose
     * @since 3.0.0
     *
     * @return {this} This Matrix4.
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
     * Copies the given Matrix4 into this Matrix and then inverses it.
     *
     * @method Phaser.Math.Matrix4#getInverse
     * @since 3.50.0
     *
     * @param {Phaser.Math.Matrix4} m - The Matrix4 to invert into this Matrix4.
     *
     * @return {this} This Matrix4.
     */
    getInverse: function (m)
    {
        this.copy(m);

        return this.invert();
    },

    /**
     * Invert this Matrix.
     *
     * @method Phaser.Math.Matrix4#invert
     * @since 3.0.0
     *
     * @return {this} This Matrix4.
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

        //  Calculate the determinant
        var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

        if (!det)
        {
            return this;
        }

        det = 1 / det;

        return this.setValues(
            (a11 * b11 - a12 * b10 + a13 * b09) * det,
            (a02 * b10 - a01 * b11 - a03 * b09) * det,
            (a31 * b05 - a32 * b04 + a33 * b03) * det,
            (a22 * b04 - a21 * b05 - a23 * b03) * det,
            (a12 * b08 - a10 * b11 - a13 * b07) * det,
            (a00 * b11 - a02 * b08 + a03 * b07) * det,
            (a32 * b02 - a30 * b05 - a33 * b01) * det,
            (a20 * b05 - a22 * b02 + a23 * b01) * det,
            (a10 * b10 - a11 * b08 + a13 * b06) * det,
            (a01 * b08 - a00 * b10 - a03 * b06) * det,
            (a30 * b04 - a31 * b02 + a33 * b00) * det,
            (a21 * b02 - a20 * b04 - a23 * b00) * det,
            (a11 * b07 - a10 * b09 - a12 * b06) * det,
            (a00 * b09 - a01 * b07 + a02 * b06) * det,
            (a31 * b01 - a30 * b03 - a32 * b00) * det,
            (a20 * b03 - a21 * b01 + a22 * b00) * det
        );
    },

    /**
     * Calculate the adjoint, or adjugate, of this Matrix.
     *
     * @method Phaser.Math.Matrix4#adjoint
     * @since 3.0.0
     *
     * @return {this} This Matrix4.
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

        return this.setValues(
            (a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22)),
            -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22)),
            (a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12)),
            -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12)),
            -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22)),
            (a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22)),
            -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12)),
            (a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12)),
            (a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21)),
            -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21)),
            (a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11)),
            -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11)),
            -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21)),
            (a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21)),
            -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11)),
            (a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11))
        );
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
     * @return {this} This Matrix4.
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
     * Multiply the values of this Matrix4 by those given in the `src` argument.
     *
     * @method Phaser.Math.Matrix4#multiplyLocal
     * @since 3.0.0
     *
     * @param {Phaser.Math.Matrix4} src - The source Matrix4 that this Matrix4 is multiplied by.
     *
     * @return {this} This Matrix4.
     */
    multiplyLocal: function (src)
    {
        var a = this.val;
        var b = src.val;

        return this.setValues(
            a[0] * b[0] + a[1] * b[4] + a[2] * b[8] + a[3] * b[12],
            a[0] * b[1] + a[1] * b[5] + a[2] * b[9] + a[3] * b[13],
            a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + a[3] * b[14],
            a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + a[3] * b[15],

            a[4] * b[0] + a[5] * b[4] + a[6] * b[8] + a[7] * b[12],
            a[4] * b[1] + a[5] * b[5] + a[6] * b[9] + a[7] * b[13],
            a[4] * b[2] + a[5] * b[6] + a[6] * b[10] + a[7] * b[14],
            a[4] * b[3] + a[5] * b[7] + a[6] * b[11] + a[7] * b[15],

            a[8] * b[0] + a[9] * b[4] + a[10] * b[8] + a[11] * b[12],
            a[8] * b[1] + a[9] * b[5] + a[10] * b[9] + a[11] * b[13],
            a[8] * b[2] + a[9] * b[6] + a[10] * b[10] + a[11] * b[14],
            a[8] * b[3] + a[9] * b[7] + a[10] * b[11] + a[11] * b[15],

            a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + a[15] * b[12],
            a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + a[15] * b[13],
            a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + a[15] * b[14],
            a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + a[15] * b[15]
        );
    },

    /**
     * Multiplies the given Matrix4 object with this Matrix.
     *
     * This is the same as calling `multiplyMatrices(m, this)`.
     *
     * @method Phaser.Math.Matrix4#premultiply
     * @since 3.50.0
     *
     * @param {Phaser.Math.Matrix4} m - The Matrix4 to multiply with this one.
     *
     * @return {this} This Matrix4.
     */
    premultiply: function (m)
    {
        return this.multiplyMatrices(m, this);
    },

    /**
     * Multiplies the two given Matrix4 objects and stores the results in this Matrix.
     *
     * @method Phaser.Math.Matrix4#multiplyMatrices
     * @since 3.50.0
     *
     * @param {Phaser.Math.Matrix4} a - The first Matrix4 to multiply.
     * @param {Phaser.Math.Matrix4} b - The second Matrix4 to multiply.
     *
     * @return {this} This Matrix4.
     */
    multiplyMatrices: function (a, b)
    {
        var am = a.val;
        var bm = b.val;

        var a11 = am[0];
        var a12 = am[4];
        var a13 = am[8];
        var a14 = am[12];
        var a21 = am[1];
        var a22 = am[5];
        var a23 = am[9];
        var a24 = am[13];
        var a31 = am[2];
        var a32 = am[6];
        var a33 = am[10];
        var a34 = am[14];
        var a41 = am[3];
        var a42 = am[7];
        var a43 = am[11];
        var a44 = am[15];

        var b11 = bm[0];
        var b12 = bm[4];
        var b13 = bm[8];
        var b14 = bm[12];
        var b21 = bm[1];
        var b22 = bm[5];
        var b23 = bm[9];
        var b24 = bm[13];
        var b31 = bm[2];
        var b32 = bm[6];
        var b33 = bm[10];
        var b34 = bm[14];
        var b41 = bm[3];
        var b42 = bm[7];
        var b43 = bm[11];
        var b44 = bm[15];

        return this.setValues(
            a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41,
            a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41,
            a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41,
            a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41,
            a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42,
            a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42,
            a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42,
            a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42,
            a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43,
            a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43,
            a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43,
            a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43,
            a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44,
            a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44,
            a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44,
            a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44
        );
    },

    /**
     * Translate this Matrix using the given Vector.
     *
     * @method Phaser.Math.Matrix4#translate
     * @since 3.0.0
     *
     * @param {(Phaser.Math.Vector3|Phaser.Math.Vector4)} v - The Vector to translate this Matrix with.
     *
     * @return {this} This Matrix4.
     */
    translate: function (v)
    {
        return this.translateXYZ(v.x, v.y, v.z);
    },

    /**
     * Translate this Matrix using the given values.
     *
     * @method Phaser.Math.Matrix4#translateXYZ
     * @since 3.16.0
     *
     * @param {number} x - The x component.
     * @param {number} y - The y component.
     * @param {number} z - The z component.
     *
     * @return {this} This Matrix4.
     */
    translateXYZ: function (x, y, z)
    {
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
     * @return {this} This Matrix4.
     */
    scale: function (v)
    {
        return this.scaleXYZ(v.x, v.y, v.z);
    },

    /**
     * Apply a scale transformation to this Matrix.
     *
     * @method Phaser.Math.Matrix4#scaleXYZ
     * @since 3.16.0
     *
     * @param {number} x - The x component.
     * @param {number} y - The y component.
     * @param {number} z - The z component.
     *
     * @return {this} This Matrix4.
     */
    scaleXYZ: function (x, y, z)
    {
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
     * @return {this} This Matrix4.
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

        return this.setValues(
            tx * x + c, tx * y - s * z, tx * z + s * y, 0,
            tx * y + s * z, ty * y + c, ty * z - s * x, 0,
            tx * z - s * y, ty * z + s * x, t * z * z + c, 0,
            0, 0, 0, 1
        );
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
     * @return {this} This Matrix4.
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
            return this;
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

        var a30 = a[12];
        var a31 = a[13];
        var a32 = a[14];
        var a33 = a[15];

        //  Construct the elements of the rotation matrix
        var b00 = x * x * t + c;
        var b01 = y * x * t + z * s;
        var b02 = z * x * t - y * s;

        var b10 = x * y * t - z * s;
        var b11 = y * y * t + c;
        var b12 = z * y * t + x * s;

        var b20 = x * z * t + y * s;
        var b21 = y * z * t - x * s;
        var b22 = z * z * t + c;

        //  Perform rotation-specific matrix multiplication
        return this.setValues(
            a00 * b00 + a10 * b01 + a20 * b02,
            a01 * b00 + a11 * b01 + a21 * b02,
            a02 * b00 + a12 * b01 + a22 * b02,
            a03 * b00 + a13 * b01 + a23 * b02,
            a00 * b10 + a10 * b11 + a20 * b12,
            a01 * b10 + a11 * b11 + a21 * b12,
            a02 * b10 + a12 * b11 + a22 * b12,
            a03 * b10 + a13 * b11 + a23 * b12,
            a00 * b20 + a10 * b21 + a20 * b22,
            a01 * b20 + a11 * b21 + a21 * b22,
            a02 * b20 + a12 * b21 + a22 * b22,
            a03 * b20 + a13 * b21 + a23 * b22,
            a30, a31, a32, a33
        );
    },

    /**
     * Rotate this matrix on its X axis.
     *
     * @method Phaser.Math.Matrix4#rotateX
     * @since 3.0.0
     *
     * @param {number} rad - The angle in radians to rotate by.
     *
     * @return {this} This Matrix4.
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

        //  Perform axis-specific matrix multiplication
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
     * @return {this} This Matrix4.
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

        //  Perform axis-specific matrix multiplication
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
     * @return {this} This Matrix4.
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

        //  Perform axis-specific matrix multiplication
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
     * @return {this} This Matrix4.
     */
    fromRotationTranslation: function (q, v)
    {
        //  Quaternion math
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

        return this.setValues(
            1 - (yy + zz),
            xy + wz,
            xz - wy,
            0,

            xy - wz,
            1 - (xx + zz),
            yz + wx,
            0,

            xz + wy,
            yz - wx,
            1 - (xx + yy),
            0,

            v.x,
            v.y,
            v.z,
            1
        );
    },

    /**
     * Set the values of this Matrix from the given Quaternion.
     *
     * @method Phaser.Math.Matrix4#fromQuat
     * @since 3.0.0
     *
     * @param {Phaser.Math.Quaternion} q - The Quaternion to set the values of this Matrix from.
     *
     * @return {this} This Matrix4.
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

        return this.setValues(
            1 - (yy + zz),
            xy + wz,
            xz - wy,
            0,

            xy - wz,
            1 - (xx + zz),
            yz + wx,
            0,

            xz + wy,
            yz - wx,
            1 - (xx + yy),
            0,

            0,
            0,
            0,
            1
        );
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
     * @return {this} This Matrix4.
     */
    frustum: function (left, right, bottom, top, near, far)
    {
        var rl = 1 / (right - left);
        var tb = 1 / (top - bottom);
        var nf = 1 / (near - far);

        return this.setValues(
            (near * 2) * rl,
            0,
            0,
            0,

            0,
            (near * 2) * tb,
            0,
            0,

            (right + left) * rl,
            (top + bottom) * tb,
            (far + near) * nf,
            -1,

            0,
            0,
            (far * near * 2) * nf,
            0
        );
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
     * @return {this} This Matrix4.
     */
    perspective: function (fovy, aspect, near, far)
    {
        var f = 1.0 / Math.tan(fovy / 2);
        var nf = 1 / (near - far);

        return this.setValues(
            f / aspect,
            0,
            0,
            0,

            0,
            f,
            0,
            0,

            0,
            0,
            (far + near) * nf,
            -1,

            0,
            0,
            (2 * far * near) * nf,
            0
        );
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
     * @return {this} This Matrix4.
     */
    perspectiveLH: function (width, height, near, far)
    {
        return this.setValues(
            (2 * near) / width,
            0,
            0,
            0,

            0,
            (2 * near) / height,
            0,
            0,

            0,
            0,
            -far / (near - far),
            1,

            0,
            0,
            (near * far) / (near - far),
            0
        );
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
     * @return {this} This Matrix4.
     */
    ortho: function (left, right, bottom, top, near, far)
    {
        var lr = left - right;
        var bt = bottom - top;
        var nf = near - far;

        //  Avoid division by zero
        lr = (lr === 0) ? lr : 1 / lr;
        bt = (bt === 0) ? bt : 1 / bt;
        nf = (nf === 0) ? nf : 1 / nf;

        return this.setValues(
            -2 * lr,
            0,
            0,
            0,

            0,
            -2 * bt,
            0,
            0,

            0,
            0,
            2 * nf,
            0,

            (left + right) * lr,
            (top + bottom) * bt,
            (far + near) * nf,
            1
        );
    },

    /**
     * Generate a right-handed look-at matrix with the given eye position, target and up axis.
     *
     * @method Phaser.Math.Matrix4#lookAtRH
     * @since 3.50.0
     *
     * @param {Phaser.Math.Vector3} eye - Position of the viewer.
     * @param {Phaser.Math.Vector3} target - Point the viewer is looking at.
     * @param {Phaser.Math.Vector3} up - vec3 pointing up.
     *
     * @return {this} This Matrix4.
     */
    lookAtRH: function (eye, target, up)
    {
        var m = this.val;

        _z.subVectors(eye, target);

        if (_z.getLengthSquared() === 0)
        {
            // eye and target are in the same position
            _z.z = 1;
        }

        _z.normalize();
        _x.crossVectors(up, _z);

        if (_x.getLengthSquared() === 0)
        {
            // up and z are parallel

            if (Math.abs(up.z) === 1)
            {
                _z.x += 0.0001;
            }
            else
            {
                _z.z += 0.0001;
            }

            _z.normalize();
            _x.crossVectors(up, _z);
        }

        _x.normalize();
        _y.crossVectors(_z, _x);

        m[0] = _x.x;
        m[1] = _x.y;
        m[2] = _x.z;
        m[4] = _y.x;
        m[5] = _y.y;
        m[6] = _y.z;
        m[8] = _z.x;
        m[9] = _z.y;
        m[10] = _z.z;

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
     * @return {this} This Matrix4.
     */
    lookAt: function (eye, center, up)
    {
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

        return this.setValues(
            x0,
            y0,
            z0,
            0,

            x1,
            y1,
            z1,
            0,

            x2,
            y2,
            z2,
            0,

            -(x0 * eyex + x1 * eyey + x2 * eyez),
            -(y0 * eyex + y1 * eyey + y2 * eyez),
            -(z0 * eyex + z1 * eyey + z2 * eyez),
            1
        );
    },

    /**
     * Set the values of this matrix from the given `yaw`, `pitch` and `roll` values.
     *
     * @method Phaser.Math.Matrix4#yawPitchRoll
     * @since 3.0.0
     *
     * @param {number} yaw - The yaw value.
     * @param {number} pitch - The pitch value.
     * @param {number} roll - The roll value.
     *
     * @return {this} This Matrix4.
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
     * @return {this} This Matrix4.
     */
    setWorldMatrix: function (rotation, position, scale, viewMatrix, projectionMatrix)
    {
        this.yawPitchRoll(rotation.y, rotation.x, rotation.z);

        _tempMat1.scaling(scale.x, scale.y, scale.z);
        _tempMat2.xyz(position.x, position.y, position.z);

        this.multiplyLocal(_tempMat1);
        this.multiplyLocal(_tempMat2);

        if (viewMatrix)
        {
            this.multiplyLocal(viewMatrix);
        }

        if (projectionMatrix)
        {
            this.multiplyLocal(projectionMatrix);
        }

        return this;
    },

    /**
     * Multiplies this Matrix4 by the given `src` Matrix4 and stores the results in the `out` Matrix4.
     *
     * @method Phaser.Math.Matrix4#multiplyToMat4
     * @since 3.50.0
     *
     * @param {Phaser.Math.Matrix4} src - The Matrix4 to multiply with this one.
     * @param {Phaser.Math.Matrix4} out - The receiving Matrix.
     *
     * @return {Phaser.Math.Matrix4} This `out` Matrix4.
     */
    multiplyToMat4: function (src, out)
    {
        var a = this.val;
        var b = src.val;

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

        var b00 = b[0];
        var b01 = b[1];
        var b02 = b[2];
        var b03 = b[3];
        var b10 = b[4];
        var b11 = b[5];
        var b12 = b[6];
        var b13 = b[7];
        var b20 = b[8];
        var b21 = b[9];
        var b22 = b[10];
        var b23 = b[11];
        var b30 = b[12];
        var b31 = b[13];
        var b32 = b[14];
        var b33 = b[15];

        return out.setValues(
            b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
            b01 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
            b02 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
            b03 * a03 + b01 * a13 + b02 * a23 + b03 * a33,

            b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
            b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
            b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
            b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,

            b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
            b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
            b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
            b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,

            b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
            b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
            b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
            b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33
        );
    },

    /**
     * Takes the rotation and position vectors and builds this Matrix4 from them.
     *
     * @method Phaser.Math.Matrix4#fromRotationXYTranslation
     * @since 3.50.0
     *
     * @param {Phaser.Math.Vector3} rotation - The rotation vector.
     * @param {Phaser.Math.Vector3} position - The position vector.
     * @param {boolean} translateFirst - Should the operation translate then rotate (`true`), or rotate then translate? (`false`)
     *
     * @return {this} This Matrix4.
     */
    fromRotationXYTranslation: function (rotation, position, translateFirst)
    {
        var x = position.x;
        var y = position.y;
        var z = position.z;

        var sx = Math.sin(rotation.x);
        var cx = Math.cos(rotation.x);

        var sy = Math.sin(rotation.y);
        var cy = Math.cos(rotation.y);

        var a30 = x;
        var a31 = y;
        var a32 = z;

        //  Rotate X

        var b21 = -sx;

        //  Rotate Y

        var c01 = 0 - b21 * sy;

        var c02 = 0 - cx * sy;

        var c21 = b21 * cy;

        var c22 = cx * cy;

        //  Translate
        if (!translateFirst)
        {
            // a30 = cy * x + 0 * y + sy * z;
            a30 = cy * x + sy * z;
            a31 = c01 * x + cx * y + c21 * z;
            a32 = c02 * x + sx * y + c22 * z;
        }

        return this.setValues(
            cy,
            c01,
            c02,
            0,
            0,
            cx,
            sx,
            0,
            sy,
            c21,
            c22,
            0,
            a30,
            a31,
            a32,
            1
        );
    },

    /**
     * Returns the maximum axis scale from this Matrix4.
     *
     * @method Phaser.Math.Matrix4#getMaxScaleOnAxis
     * @since 3.50.0
     *
     * @return {number} The maximum axis scale.
     */
    getMaxScaleOnAxis: function ()
    {
        var m = this.val;

        var scaleXSq = m[0] * m[0] + m[1] * m[1] + m[2] * m[2];
        var scaleYSq = m[4] * m[4] + m[5] * m[5] + m[6] * m[6];
        var scaleZSq = m[8] * m[8] + m[9] * m[9] + m[10] * m[10];

        return Math.sqrt(Math.max(scaleXSq, scaleYSq, scaleZSq));
    }

});

/**
 * @ignore
 */
var _tempMat1 = new Matrix4();

/**
 * @ignore
 */
var _tempMat2 = new Matrix4();

/**
 * @ignore
 */
var _x = new Vector3();

/**
 * @ignore
 */
var _y = new Vector3();

/**
 * @ignore
 */
var _z = new Vector3();

module.exports = Matrix4;


/***/ }),
/* 7 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
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
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var MATH = __webpack_require__(44);
var GetValue = __webpack_require__(12);

/**
 * Retrieves a value from an object. Allows for more advanced selection options, including:
 *
 * Allowed types:
 * 
 * Implicit
 * {
 *     x: 4
 * }
 *
 * From function
 * {
 *     x: function ()
 * }
 *
 * Randomly pick one element from the array
 * {
 *     x: [a, b, c, d, e, f]
 * }
 *
 * Random integer between min and max:
 * {
 *     x: { randInt: [min, max] }
 * }
 *
 * Random float between min and max:
 * {
 *     x: { randFloat: [min, max] }
 * }
 * 
 *
 * @function Phaser.Utils.Objects.GetAdvancedValue
 * @since 3.0.0
 *
 * @param {object} source - The object to retrieve the value from.
 * @param {string} key - The name of the property to retrieve from the object. If a property is nested, the names of its preceding properties should be separated by a dot (`.`) - `banner.hideBanner` would return the value of the `hideBanner` property from the object stored in the `banner` property of the `source` object.
 * @param {*} defaultValue - The value to return if the `key` isn't found in the `source` object.
 *
 * @return {*} The value of the requested key.
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
/* 9 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Generate a random floating point number between the two given bounds, minimum inclusive, maximum exclusive.
 *
 * @function Phaser.Math.FloatBetween
 * @since 3.0.0
 *
 * @param {number} min - The lower bound for the float, inclusive.
 * @param {number} max - The upper bound for the float exclusive.
 *
 * @return {number} A random float within the given range.
 */
var FloatBetween = function (min, max)
{
    return Math.random() * (max - min) + min;
};

module.exports = FloatBetween;


/***/ }),
/* 10 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
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
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
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
 * @memberof Phaser.Math
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
     * @param {Phaser.Math.Vector4} v - The vector to check equality with.
     *
     * @return {boolean} A boolean indicating whether the two Vectors are equal or not.
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
     * @param {(Phaser.Math.Vector2|Phaser.Math.Vector3|Phaser.Math.Vector4)} v - The Vector to calculate the distance to.
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
/* 12 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

//  Source object
//  The key as a string, or an array of keys, i.e. 'banner', or 'banner.hideBanner'
//  The default value to use if the key doesn't exist

/**
 * Retrieves a value from an object.
 *
 * @function Phaser.Utils.Objects.GetValue
 * @since 3.0.0
 *
 * @param {object} source - The object to retrieve the value from.
 * @param {string} key - The name of the property to retrieve from the object. If a property is nested, the names of its preceding properties should be separated by a dot (`.`) - `banner.hideBanner` would return the value of the `hideBanner` property from the object stored in the `banner` property of the `source` object.
 * @param {*} defaultValue - The value to return if the `key` isn't found in the `source` object.
 *
 * @return {*} The value of the requested key.
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
    else if (key.indexOf('.') !== -1)
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
/* 13 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GEOM_CONST = {

    /**
     * A Circle Geometry object type.
     * 
     * @name Phaser.Geom.CIRCLE
     * @type {integer}
     * @since 3.19.0
     */
    CIRCLE: 0,

    /**
     * An Ellipse Geometry object type.
     * 
     * @name Phaser.Geom.ELLIPSE
     * @type {integer}
     * @since 3.19.0
     */
    ELLIPSE: 1,

    /**
     * A Line Geometry object type.
     * 
     * @name Phaser.Geom.LINE
     * @type {integer}
     * @since 3.19.0
     */
    LINE: 2,

    /**
     * A Point Geometry object type.
     * 
     * @name Phaser.Geom.POINT
     * @type {integer}
     * @since 3.19.0
     */
    POINT: 3,

    /**
     * A Polygon Geometry object type.
     * 
     * @name Phaser.Geom.POLYGON
     * @type {integer}
     * @since 3.19.0
     */
    POLYGON: 4,

    /**
     * A Rectangle Geometry object type.
     * 
     * @name Phaser.Geom.RECTANGLE
     * @type {integer}
     * @since 3.19.0
     */
    RECTANGLE: 5,

    /**
     * A Triangle Geometry object type.
     * 
     * @name Phaser.Geom.TRIANGLE
     * @type {integer}
     * @since 3.19.0
     */
    TRIANGLE: 6

};

module.exports = GEOM_CONST;


/***/ }),
/* 14 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Phaser Blend Modes.
 * 
 * @namespace Phaser.BlendModes
 * @since 3.0.0
 */

module.exports = {

    /**
     * Skips the Blend Mode check in the renderer.
     * 
     * @name Phaser.BlendModes.SKIP_CHECK
     * @type {integer}
     * @const
     * @since 3.0.0
     */
    SKIP_CHECK: -1,

    /**
     * Normal blend mode. For Canvas and WebGL.
     * This is the default setting and draws new shapes on top of the existing canvas content.
     * 
     * @name Phaser.BlendModes.NORMAL
     * @type {integer}
     * @const
     * @since 3.0.0
     */
    NORMAL: 0,

    /**
     * Add blend mode. For Canvas and WebGL.
     * Where both shapes overlap the color is determined by adding color values.
     * 
     * @name Phaser.BlendModes.ADD
     * @type {integer}
     * @const
     * @since 3.0.0
     */
    ADD: 1,

    /**
     * Multiply blend mode. For Canvas and WebGL.
     * The pixels are of the top layer are multiplied with the corresponding pixel of the bottom layer. A darker picture is the result.
     * 
     * @name Phaser.BlendModes.MULTIPLY
     * @type {integer}
     * @const
     * @since 3.0.0
     */
    MULTIPLY: 2,

    /**
     * Screen blend mode. For Canvas and WebGL.
     * The pixels are inverted, multiplied, and inverted again. A lighter picture is the result (opposite of multiply)
     * 
     * @name Phaser.BlendModes.SCREEN
     * @type {integer}
     * @const
     * @since 3.0.0
     */
    SCREEN: 3,

    /**
     * Overlay blend mode. For Canvas only.
     * A combination of multiply and screen. Dark parts on the base layer become darker, and light parts become lighter.
     * 
     * @name Phaser.BlendModes.OVERLAY
     * @type {integer}
     * @const
     * @since 3.0.0
     */
    OVERLAY: 4,

    /**
     * Darken blend mode. For Canvas only.
     * Retains the darkest pixels of both layers.
     * 
     * @name Phaser.BlendModes.DARKEN
     * @type {integer}
     * @const
     * @since 3.0.0
     */
    DARKEN: 5,

    /**
     * Lighten blend mode. For Canvas only.
     * Retains the lightest pixels of both layers.
     * 
     * @name Phaser.BlendModes.LIGHTEN
     * @type {integer}
     * @const
     * @since 3.0.0
     */
    LIGHTEN: 6,

    /**
     * Color Dodge blend mode. For Canvas only.
     * Divides the bottom layer by the inverted top layer.
     * 
     * @name Phaser.BlendModes.COLOR_DODGE
     * @type {integer}
     * @const
     * @since 3.0.0
     */
    COLOR_DODGE: 7,

    /**
     * Color Burn blend mode. For Canvas only.
     * Divides the inverted bottom layer by the top layer, and then inverts the result.
     * 
     * @name Phaser.BlendModes.COLOR_BURN
     * @type {integer}
     * @const
     * @since 3.0.0
     */
    COLOR_BURN: 8,

    /**
     * Hard Light blend mode. For Canvas only.
     * A combination of multiply and screen like overlay, but with top and bottom layer swapped.
     * 
     * @name Phaser.BlendModes.HARD_LIGHT
     * @type {integer}
     * @const
     * @since 3.0.0
     */
    HARD_LIGHT: 9,

    /**
     * Soft Light blend mode. For Canvas only.
     * A softer version of hard-light. Pure black or white does not result in pure black or white.
     * 
     * @name Phaser.BlendModes.SOFT_LIGHT
     * @type {integer}
     * @const
     * @since 3.0.0
     */
    SOFT_LIGHT: 10,

    /**
     * Difference blend mode. For Canvas only.
     * Subtracts the bottom layer from the top layer or the other way round to always get a positive value.
     * 
     * @name Phaser.BlendModes.DIFFERENCE
     * @type {integer}
     * @const
     * @since 3.0.0
     */
    DIFFERENCE: 11,

    /**
     * Exclusion blend mode. For Canvas only.
     * Like difference, but with lower contrast.
     * 
     * @name Phaser.BlendModes.EXCLUSION
     * @type {integer}
     * @const
     * @since 3.0.0
     */
    EXCLUSION: 12,

    /**
     * Hue blend mode. For Canvas only.
     * Preserves the luma and chroma of the bottom layer, while adopting the hue of the top layer.
     * 
     * @name Phaser.BlendModes.HUE
     * @type {integer}
     * @const
     * @since 3.0.0
     */
    HUE: 13,

    /**
     * Saturation blend mode. For Canvas only.
     * Preserves the luma and hue of the bottom layer, while adopting the chroma of the top layer.
     * 
     * @name Phaser.BlendModes.SATURATION
     * @type {integer}
     * @const
     * @since 3.0.0
     */
    SATURATION: 14,

    /**
     * Color blend mode. For Canvas only.
     * Preserves the luma of the bottom layer, while adopting the hue and chroma of the top layer.
     * 
     * @name Phaser.BlendModes.COLOR
     * @type {integer}
     * @const
     * @since 3.0.0
     */
    COLOR: 15,

    /**
     * Luminosity blend mode. For Canvas only.
     * Preserves the hue and chroma of the bottom layer, while adopting the luma of the top layer.
     * 
     * @name Phaser.BlendModes.LUMINOSITY
     * @type {integer}
     * @const
     * @since 3.0.0
     */
    LUMINOSITY: 16,

    /**
     * Alpha erase blend mode. For Canvas and WebGL.
     * 
     * @name Phaser.BlendModes.ERASE
     * @type {integer}
     * @const
     * @since 3.0.0
     */
    ERASE: 17,

    /**
     * Source-in blend mode. For Canvas only.
     * The new shape is drawn only where both the new shape and the destination canvas overlap. Everything else is made transparent.
     * 
     * @name Phaser.BlendModes.SOURCE_IN
     * @type {integer}
     * @const
     * @since 3.0.0
     */
    SOURCE_IN: 18,

    /**
     * Source-out blend mode. For Canvas only.
     * The new shape is drawn where it doesn't overlap the existing canvas content.
     * 
     * @name Phaser.BlendModes.SOURCE_OUT
     * @type {integer}
     * @const
     * @since 3.0.0
     */
    SOURCE_OUT: 19,

    /**
     * Source-out blend mode. For Canvas only.
     * The new shape is only drawn where it overlaps the existing canvas content.
     * 
     * @name Phaser.BlendModes.SOURCE_ATOP
     * @type {integer}
     * @const
     * @since 3.0.0
     */
    SOURCE_ATOP: 20,

    /**
     * Destination-over blend mode. For Canvas only.
     * New shapes are drawn behind the existing canvas content.
     * 
     * @name Phaser.BlendModes.DESTINATION_OVER
     * @type {integer}
     * @const
     * @since 3.0.0
     */
    DESTINATION_OVER: 21,

    /**
     * Destination-in blend mode. For Canvas only.
     * The existing canvas content is kept where both the new shape and existing canvas content overlap. Everything else is made transparent.
     * 
     * @name Phaser.BlendModes.DESTINATION_IN
     * @type {integer}
     * @const
     * @since 3.0.0
     */
    DESTINATION_IN: 22,

    /**
     * Destination-out blend mode. For Canvas only.
     * The existing content is kept where it doesn't overlap the new shape.
     * 
     * @name Phaser.BlendModes.DESTINATION_OUT
     * @type {integer}
     * @const
     * @since 3.0.0
     */
    DESTINATION_OUT: 23,

    /**
     * Destination-out blend mode. For Canvas only.
     * The existing canvas is only kept where it overlaps the new shape. The new shape is drawn behind the canvas content.
     * 
     * @name Phaser.BlendModes.DESTINATION_ATOP
     * @type {integer}
     * @const
     * @since 3.0.0
     */
    DESTINATION_ATOP: 24,

    /**
     * Lighten blend mode. For Canvas only.
     * Where both shapes overlap the color is determined by adding color values.
     * 
     * @name Phaser.BlendModes.LIGHTER
     * @type {integer}
     * @const
     * @since 3.0.0
     */
    LIGHTER: 25,

    /**
     * Copy blend mode. For Canvas only.
     * Only the new shape is shown.
     * 
     * @name Phaser.BlendModes.COPY
     * @type {integer}
     * @const
     * @since 3.0.0
     */
    COPY: 26,

    /**
     * Xor blend mode. For Canvas only.
     * Shapes are made transparent where both overlap and drawn normal everywhere else.
     * 
     * @name Phaser.BlendModes.XOR
     * @type {integer}
     * @const
     * @since 3.0.0
     */
    XOR: 27

};


/***/ }),
/* 15 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Normalize an angle to the [0, 2pi] range.
 *
 * @function Phaser.Math.Angle.Normalize
 * @since 3.0.0
 *
 * @param {number} angle - The angle to normalize, in radians.
 *
 * @return {number} The normalized angle, in radians.
 */
var Normalize = function (angle)
{
    angle = angle % (2 * Math.PI);

    if (angle >= 0)
    {
        return angle;
    }
    else
    {
        return angle + 2 * Math.PI;
    }
};

module.exports = Normalize;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var MathWrap = __webpack_require__(10);

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
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Wrap = __webpack_require__(10);

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
/* 18 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Check whether the given values are fuzzily equal.
 *
 * Two numbers are fuzzily equal if their difference is less than `epsilon`.
 *
 * @function Phaser.Math.Fuzzy.Equal
 * @since 3.0.0
 *
 * @param {number} a - The first value.
 * @param {number} b - The second value.
 * @param {number} [epsilon=0.0001] - The epsilon.
 *
 * @return {boolean} `true` if the values are fuzzily equal, otherwise `false`.
 */
var Equal = function (a, b, epsilon)
{
    if (epsilon === undefined) { epsilon = 0.0001; }

    return Math.abs(a - b) < epsilon;
};

module.exports = Equal;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Factorial = __webpack_require__(20);

/**
 * Calculates the Bernstein basis from the three factorial coefficients.
 *
 * @function Phaser.Math.Bernstein
 * @since 3.0.0
 *
 * @param {number} n - The first value.
 * @param {number} i - The second value.
 *
 * @return {number} The Bernstein basis of Factorial(n) / Factorial(i) / Factorial(n - i)
 */
var Bernstein = function (n, i)
{
    return Factorial(n) / Factorial(i) / Factorial(n - i);
};

module.exports = Bernstein;


/***/ }),
/* 20 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculates the factorial of a given number for integer values greater than 0.
 *
 * @function Phaser.Math.Factorial
 * @since 3.0.0
 *
 * @param {number} value - A positive integer to calculate the factorial of.
 *
 * @return {number} The factorial of the given number.
 */
var Factorial = function (value)
{
    if (value === 0)
    {
        return 1;
    }

    var res = value;

    while (--value)
    {
        res *= value;
    }

    return res;
};

module.exports = Factorial;


/***/ }),
/* 21 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculates a Catmull-Rom value from the given points, based on an alpha of 0.5.
 *
 * @function Phaser.Math.CatmullRom
 * @since 3.0.0
 *
 * @param {number} t - The amount to interpolate by.
 * @param {number} p0 - The first control point.
 * @param {number} p1 - The second control point.
 * @param {number} p2 - The third control point.
 * @param {number} p3 - The fourth control point.
 *
 * @return {number} The Catmull-Rom value.
 */
var CatmullRom = function (t, p0, p1, p2, p3)
{
    var v0 = (p2 - p0) * 0.5;
    var v1 = (p3 - p1) * 0.5;
    var t2 = t * t;
    var t3 = t * t2;

    return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
};

module.exports = CatmullRom;


/***/ }),
/* 22 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculates a linear (interpolation) value over t.
 *
 * @function Phaser.Math.Linear
 * @since 3.0.0
 *
 * @param {number} p0 - The first point.
 * @param {number} p1 - The second point.
 * @param {number} t - The percentage between p0 and p1 to return, represented as a number between 0 and 1.
 *
 * @return {number} The step t% of the way between p0 and p1.
 */
var Linear = function (p0, p1, t)
{
    return (p1 - p0) * t + p0;
};

module.exports = Linear;


/***/ }),
/* 23 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculate a smooth interpolation percentage of `x` between `min` and `max`.
 *
 * The function receives the number `x` as an argument and returns 0 if `x` is less than or equal to the left edge,
 * 1 if `x` is greater than or equal to the right edge, and smoothly interpolates, using a Hermite polynomial,
 * between 0 and 1 otherwise.
 *
 * @function Phaser.Math.SmoothStep
 * @since 3.0.0
 * @see {@link https://en.wikipedia.org/wiki/Smoothstep}
 *
 * @param {number} x - The input value.
 * @param {number} min - The minimum value, also known as the 'left edge', assumed smaller than the 'right edge'.
 * @param {number} max - The maximum value, also known as the 'right edge', assumed greater than the 'left edge'.
 *
 * @return {number} The percentage of interpolation, between 0 and 1.
 */
var SmoothStep = function (x, min, max)
{
    if (x <= min)
    {
        return 0;
    }

    if (x >= max)
    {
        return 1;
    }

    x = (x - min) / (max - min);

    return x * x * (3 - 2 * x);
};

module.exports = SmoothStep;


/***/ }),
/* 24 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculate a smoother interpolation percentage of `x` between `min` and `max`.
 *
 * The function receives the number `x` as an argument and returns 0 if `x` is less than or equal to the left edge,
 * 1 if `x` is greater than or equal to the right edge, and smoothly interpolates, using a Hermite polynomial,
 * between 0 and 1 otherwise.
 *
 * Produces an even smoother interpolation than {@link Phaser.Math.SmoothStep}.
 *
 * @function Phaser.Math.SmootherStep
 * @since 3.0.0
 * @see {@link https://en.wikipedia.org/wiki/Smoothstep#Variations}
 *
 * @param {number} x - The input value.
 * @param {number} min - The minimum value, also known as the 'left edge', assumed smaller than the 'right edge'.
 * @param {number} max - The maximum value, also known as the 'right edge', assumed greater than the 'left edge'.
 *
 * @return {number} The percentage of interpolation, between 0 and 1.
 */
var SmootherStep = function (x, min, max)
{
    x = Math.max(0, Math.min(1, (x - min) / (max - min)));

    return x * x * x * (x * (x * 6 - 15) + 10);
};

module.exports = SmootherStep;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = __webpack_require__(2);

/**
 * Convert the given angle from degrees, to the equivalent angle in radians.
 *
 * @function Phaser.Math.DegToRad
 * @since 3.0.0
 *
 * @param {integer} degrees - The angle (in degrees) to convert to radians.
 *
 * @return {number} The given angle converted to radians.
 */
var DegToRad = function (degrees)
{
    return degrees * CONST.DEG_TO_RAD;
};

module.exports = DegToRad;


/***/ }),
/* 26 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
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
/* 27 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
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
/* 28 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Rotate a `point` around `x` and `y` to the given `angle`, at the same distance.
 *
 * In polar notation, this maps a point from (r, t) to (r, angle), vs. the origin (x, y).
 *
 * @function Phaser.Math.RotateAround
 * @since 3.0.0
 *
 * @generic {Phaser.Types.Math.Vector2Like} T - [point,$return]
 *
 * @param {(Phaser.Geom.Point|object)} point - The point to be rotated.
 * @param {number} x - The horizontal coordinate to rotate around.
 * @param {number} y - The vertical coordinate to rotate around.
 * @param {number} angle - The angle of rotation in radians.
 *
 * @return {Phaser.Types.Math.Vector2Like} The given point.
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
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Vector2 = __webpack_require__(1);

/**
 * Takes the `x` and `y` coordinates and transforms them into the same space as
 * defined by the position, rotation and scale values.
 *
 * @function Phaser.Math.TransformXY
 * @since 3.0.0
 *
 * @param {number} x - The x coordinate to be transformed.
 * @param {number} y - The y coordinate to be transformed.
 * @param {number} positionX - Horizontal position of the transform point.
 * @param {number} positionY - Vertical position of the transform point.
 * @param {number} rotation - Rotation of the transform point, in radians.
 * @param {number} scaleX - Horizontal scale of the transform point.
 * @param {number} scaleY - Vertical scale of the transform point.
 * @param {(Phaser.Math.Vector2|Phaser.Geom.Point|object)} [output] - The output vector, point or object for the translated coordinates.
 *
 * @return {(Phaser.Math.Vector2|Phaser.Geom.Point|object)} The translated point.
 */
var TransformXY = function (x, y, positionX, positionY, rotation, scaleX, scaleY, output)
{
    if (output === undefined) { output = new Vector2(); }

    var radianSin = Math.sin(rotation);
    var radianCos = Math.cos(rotation);

    // Rotate and Scale
    var a = radianCos * scaleX;
    var b = radianSin * scaleX;
    var c = -radianSin * scaleY;
    var d = radianCos * scaleY;

    //  Invert
    var id = 1 / ((a * d) + (c * -b));

    output.x = (d * id * x) + (-c * id * y) + (((positionY * c) - (positionX * d)) * id);
    output.y = (a * id * y) + (-b * id * x) + (((-positionY * a) + (positionX * b)) * id);

    return output;
};

module.exports = TransformXY;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
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
 * @memberof Phaser.Math
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
     * Set the values of this Matrix3 to be normalized from the given Matrix4.
     *
     * @method Phaser.Math.Matrix3#normalFromMat4
     * @since 3.0.0
     *
     * @param {Phaser.Math.Matrix4} m - The Matrix4 to normalize the values from.
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
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

//  Adapted from [gl-matrix](https://github.com/toji/gl-matrix) by toji
//  and [vecmath](https://github.com/mattdesl/vecmath) by mattdesl

var Class = __webpack_require__(0);
var Matrix3 = __webpack_require__(30);
var NOOP = __webpack_require__(7);
var Vector3 = __webpack_require__(3);

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
 * @memberof Phaser.Math
 * @constructor
 * @since 3.0.0
 *
 * @param {number} [x=0] - The x component.
 * @param {number} [y=0] - The y component.
 * @param {number} [z=0] - The z component.
 * @param {number} [w=1] - The w component.
 */
var Quaternion = new Class({

    initialize:

    function Quaternion (x, y, z, w)
    {
        /**
         * The x component of this Quaternion.
         *
         * @name Phaser.Math.Quaternion#_x
         * @type {number}
         * @default 0
         * @private
         * @since 3.50.0
         */

        /**
         * The y component of this Quaternion.
         *
         * @name Phaser.Math.Quaternion#_y
         * @type {number}
         * @default 0
         * @private
         * @since 3.50.0
         */

        /**
         * The z component of this Quaternion.
         *
         * @name Phaser.Math.Quaternion#_z
         * @type {number}
         * @default 0
         * @private
         * @since 3.50.0
         */

        /**
         * The w component of this Quaternion.
         *
         * @name Phaser.Math.Quaternion#_w
         * @type {number}
         * @default 0
         * @private
         * @since 3.50.0
         */

        /**
         * This callback is invoked, if set, each time a value in this quaternion is changed.
         * The callback is passed one argument, a reference to this quaternion.
         *
         * @name Phaser.Math.Quaternion#onChangeCallback
         * @type {function}
         * @since 3.50.0
         */
        this.onChangeCallback = NOOP;

        this.set(x, y, z, w);
    },

    /**
     * The x component of this Quaternion.
     *
     * @name Phaser.Math.Quaternion#x
     * @type {number}
     * @default 0
     * @since 3.0.0
     */
    x: {
        get: function ()
        {
            return this._x;
        },

        set: function (value)
        {
            this._x = value;

            this.onChangeCallback(this);
        }
    },

    /**
     * The y component of this Quaternion.
     *
     * @name Phaser.Math.Quaternion#y
     * @type {number}
     * @default 0
     * @since 3.0.0
     */
    y: {
        get: function ()
        {
            return this._y;
        },

        set: function (value)
        {
            this._y = value;

            this.onChangeCallback(this);
        }
    },

    /**
     * The z component of this Quaternion.
     *
     * @name Phaser.Math.Quaternion#z
     * @type {number}
     * @default 0
     * @since 3.0.0
     */
    z: {
        get: function ()
        {
            return this._z;
        },

        set: function (value)
        {
            this._z = value;

            this.onChangeCallback(this);
        }
    },

    /**
     * The w component of this Quaternion.
     *
     * @name Phaser.Math.Quaternion#w
     * @type {number}
     * @default 0
     * @since 3.0.0
     */
    w: {
        get: function ()
        {
            return this._w;
        },

        set: function (value)
        {
            this._w = value;

            this.onChangeCallback(this);
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
        return this.set(src);
    },

    /**
     * Set the components of this Quaternion and optionally call the `onChangeCallback`.
     *
     * @method Phaser.Math.Quaternion#set
     * @since 3.0.0
     *
     * @param {(number|object)} [x=0] - The x component, or an object containing x, y, z, and w components.
     * @param {number} [y=0] - The y component.
     * @param {number} [z=0] - The z component.
     * @param {number} [w=0] - The w component.
     * @param {boolean} [update=true] - Call the `onChangeCallback`?
     *
     * @return {Phaser.Math.Quaternion} This Quaternion.
     */
    set: function (x, y, z, w, update)
    {
        if (update === undefined) { update = true; }

        if (typeof x === 'object')
        {
            this._x = x.x || 0;
            this._y = x.y || 0;
            this._z = x.z || 0;
            this._w = x.w || 0;
        }
        else
        {
            this._x = x || 0;
            this._y = y || 0;
            this._z = z || 0;
            this._w = w || 0;
        }

        if (update)
        {
            this.onChangeCallback(this);
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
        this._x += v.x;
        this._y += v.y;
        this._z += v.z;
        this._w += v.w;

        this.onChangeCallback(this);

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
        this._x -= v.x;
        this._y -= v.y;
        this._z -= v.z;
        this._w -= v.w;

        this.onChangeCallback(this);

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
        this._x *= scale;
        this._y *= scale;
        this._z *= scale;
        this._w *= scale;

        this.onChangeCallback(this);

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

            this._x = x * len;
            this._y = y * len;
            this._z = z * len;
            this._w = w * len;
        }

        this.onChangeCallback(this);

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

        return this.set(
            ax + t * (v.x - ax),
            ay + t * (v.y - ay),
            az + t * (v.z - az),
            aw + t * (v.w - aw)
        );
    },

    /**
     * Rotates this Quaternion based on the two given vectors.
     *
     * @method Phaser.Math.Quaternion#rotationTo
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector3} a - The transform rotation vector.
     * @param {Phaser.Math.Vector3} b - The target rotation vector.
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
            return this.set(0, 0, 0, 1);
        }
        else
        {
            tmpvec.copy(a).cross(b);

            this._x = tmpvec.x;
            this._y = tmpvec.y;
            this._z = tmpvec.z;
            this._w = 1 + dot;

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
        return this.set(0, 0, 0, 1);
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

        return this.set(
            s * axis.x,
            s * axis.y,
            s * axis.z,
            Math.cos(rad)
        );
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

        return this.set(
            ax * bw + aw * bx + ay * bz - az * by,
            ay * bw + aw * by + az * bx - ax * bz,
            az * bw + aw * bz + ax * by - ay * bx,
            aw * bw - ax * bx - ay * by - az * bz
        );
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
        return this.set(
            scale0 * ax + scale1 * bx,
            scale0 * ay + scale1 * by,
            scale0 * az + scale1 * bz,
            scale0 * aw + scale1 * bw
        );
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

        return this.set(
            -a0 * invDot,
            -a1 * invDot,
            -a2 * invDot,
            a3 * invDot
        );
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
        this._x = -this.x;
        this._y = -this.y;
        this._z = -this.z;

        this.onChangeCallback(this);

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

        return this.set(
            ax * bw + aw * bx,
            ay * bw + az * bx,
            az * bw - ay * bx,
            aw * bw - ax * bx
        );
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

        return this.set(
            ax * bw - az * by,
            ay * bw + aw * by,
            az * bw + ax * by,
            aw * bw - ay * by
        );
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

        return this.set(
            ax * bw + ay * bz,
            ay * bw - ax * bz,
            az * bw + aw * bz,
            aw * bw - az * bz
        );
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
     * Set this Quaternion from the given Euler, based on Euler order.
     *
     * @method Phaser.Math.Quaternion#setFromEuler
     * @since 3.50.0
     *
     * @param {Phaser.Math.Euler} euler - The Euler to convert from.
     * @param {boolean} [update=true] - Run the `onChangeCallback`?
     *
     * @return {Phaser.Math.Quaternion} This Quaternion.
     */
    setFromEuler: function (euler, update)
    {
        var x = euler.x / 2;
        var y = euler.y / 2;
        var z = euler.z / 2;

        var c1 = Math.cos(x);
        var c2 = Math.cos(y);
        var c3 = Math.cos(z);

        var s1 = Math.sin(x);
        var s2 = Math.sin(y);
        var s3 = Math.sin(z);

        switch (euler.order)
        {
            case 'XYZ':
            {
                this.set(
                    s1 * c2 * c3 + c1 * s2 * s3,
                    c1 * s2 * c3 - s1 * c2 * s3,
                    c1 * c2 * s3 + s1 * s2 * c3,
                    c1 * c2 * c3 - s1 * s2 * s3,
                    update
                );

                break;
            }

            case 'YXZ':
            {
                this.set(
                    s1 * c2 * c3 + c1 * s2 * s3,
                    c1 * s2 * c3 - s1 * c2 * s3,
                    c1 * c2 * s3 - s1 * s2 * c3,
                    c1 * c2 * c3 + s1 * s2 * s3,
                    update
                );

                break;
            }

            case 'ZXY':
            {
                this.set(
                    s1 * c2 * c3 - c1 * s2 * s3,
                    c1 * s2 * c3 + s1 * c2 * s3,
                    c1 * c2 * s3 + s1 * s2 * c3,
                    c1 * c2 * c3 - s1 * s2 * s3,
                    update
                );

                break;
            }

            case 'ZYX':
            {
                this.set(
                    s1 * c2 * c3 - c1 * s2 * s3,
                    c1 * s2 * c3 + s1 * c2 * s3,
                    c1 * c2 * s3 - s1 * s2 * c3,
                    c1 * c2 * c3 + s1 * s2 * s3,
                    update
                );

                break;
            }

            case 'YZX':
            {
                this.set(
                    s1 * c2 * c3 + c1 * s2 * s3,
                    c1 * s2 * c3 + s1 * c2 * s3,
                    c1 * c2 * s3 - s1 * s2 * c3,
                    c1 * c2 * c3 - s1 * s2 * s3,
                    update
                );

                break;
            }

            case 'XZY':
            {
                this.set(
                    s1 * c2 * c3 - c1 * s2 * s3,
                    c1 * s2 * c3 - s1 * c2 * s3,
                    c1 * c2 * s3 + s1 * s2 * c3,
                    c1 * c2 * c3 + s1 * s2 * s3,
                    update
                );

                break;
            }
        }

        return this;
    },

    /**
     * Sets the rotation of this Quaternion from the given Matrix4.
     *
     * @method Phaser.Math.Quaternion#setFromRotationMatrix
     * @since 3.50.0
     *
     * @param {Phaser.Math.Matrix4} mat4 - The Matrix4 to set the rotation from.
     *
     * @return {Phaser.Math.Quaternion} This Quaternion.
     */
    setFromRotationMatrix: function (mat4)
    {
        var m = mat4.val;

        var m11 = m[0];
        var m12 = m[4];
        var m13 = m[8];
        var m21 = m[1];
        var m22 = m[5];
        var m23 = m[9];
        var m31 = m[2];
        var m32 = m[6];
        var m33 = m[10];

        var trace = m11 + m22 + m33;
        var s;

        if (trace > 0)
        {
            s = 0.5 / Math.sqrt(trace + 1.0);

            this.set(
                (m32 - m23) * s,
                (m13 - m31) * s,
                (m21 - m12) * s,
                0.25 / s
            );
        }
        else if (m11 > m22 && m11 > m33)
        {
            s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);

            this.set(
                0.25 * s,
                (m12 + m21) / s,
                (m13 + m31) / s,
                (m32 - m23) / s
            );
        }
        else if (m22 > m33)
        {
            s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);

            this.set(
                (m12 + m21) / s,
                0.25 * s,
                (m23 + m32) / s,
                (m13 - m31) / s
            );
        }
        else
        {
            s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);

            this.set(
                (m13 + m31) / s,
                (m23 + m32) / s,
                0.25 * s,
                (m21 - m12) / s
            );
        }

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

            this._x = (m[7] - m[5]) * fRoot;
            this._y = (m[2] - m[6]) * fRoot;
            this._z = (m[3] - m[1]) * fRoot;
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

            this._x = tmp[0];
            this._y = tmp[1];
            this._z = tmp[2];
            this._w = (m[k * 3 + j] - m[j * 3 + k]) * fRoot;
        }

        this.onChangeCallback(this);

        return this;
    }

});

module.exports = Quaternion;


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Vector3 = __webpack_require__(3);
var Matrix4 = __webpack_require__(6);
var Quaternion = __webpack_require__(31);

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
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = __webpack_require__(0);
var Matrix4 = __webpack_require__(6);
var RandomXYZ = __webpack_require__(26);
var RandomXYZW = __webpack_require__(27);
var RotateVec3 = __webpack_require__(32);
var Set = __webpack_require__(158);
var Sprite3D = __webpack_require__(34);
var Vector2 = __webpack_require__(1);
var Vector3 = __webpack_require__(3);
var Vector4 = __webpack_require__(11);

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


        /**
         *  The mapping from 3D size units to pixels.
         *  In the default case 1 3D unit = 128 pixels. So a sprite that is
         *  256 x 128 px in size will be 2 x 1 units.
         *  Change to whatever best fits your game assets.
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

    //  Overridden by subclasses
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
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = __webpack_require__(0);
var GameObject = __webpack_require__(35);
var Sprite = __webpack_require__(180);
var Vector2 = __webpack_require__(1);
var Vector4 = __webpack_require__(11);

/**
 * @classdesc
 * A Sprite 3D Game Object.
 *
 * The Sprite 3D object is an encapsulation of a standard Sprite object, with additional methods to allow
 * it to be rendered by a 3D Camera. The Sprite can be positioned anywhere within 3D space.
 *
 * @class Sprite3D
 * @extends Phaser.GameObjects.Sprite
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
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = __webpack_require__(0);
var ComponentsToJSON = __webpack_require__(36);
var DataManager = __webpack_require__(159);
var EventEmitter = __webpack_require__(166);
var Events = __webpack_require__(37);

/**
 * @classdesc
 * The base class that all Game Objects extend.
 * You don't create GameObjects directly and they cannot be added to the display list.
 * Instead, use them as the base for your own custom classes.
 *
 * @class GameObject
 * @memberof Phaser.GameObjects
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
         * A reference to the Scene to which this Game Object belongs.
         *
         * Game Objects can only belong to one Scene.
         *
         * You should consider this property as being read-only. You cannot move a
         * Game Object to another Scene by simply changing it.
         *
         * @name Phaser.GameObjects.GameObject#scene
         * @type {Phaser.Scene}
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
         * The current state of this Game Object.
         *
         * Phaser itself will never modify this value, although plugins may do so.
         *
         * Use this property to track the state of a Game Object during its lifetime. For example, it could change from
         * a state of 'moving', to 'attacking', to 'dead'. The state value should be an integer (ideally mapped to a constant
         * in your game code), or a string. These are recommended to keep it light and simple, with fast comparisons.
         * If you need to store complex data about your Game Object, look at using the Data Component instead.
         *
         * @name Phaser.GameObjects.GameObject#state
         * @type {(integer|string)}
         * @since 3.16.0
         */
        this.state = 0;

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
         * @type {?Phaser.Types.Input.InteractiveObject}
         * @default null
         * @since 3.0.0
         */
        this.input = null;

        /**
         * If this Game Object is enabled for Arcade or Matter Physics then this property will contain a reference to a Physics Body.
         *
         * @name Phaser.GameObjects.GameObject#body
         * @type {?(Phaser.Physics.Arcade.Body|Phaser.Physics.Arcade.StaticBody|MatterJS.BodyType)}
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
     * Sets the current state of this Game Object.
     *
     * Phaser itself will never modify the State of a Game Object, although plugins may do so.
     *
     * For example, a Game Object could change from a state of 'moving', to 'attacking', to 'dead'.
     * The state value should typically be an integer (ideally mapped to a constant
     * in your game code), but could also be a string. It is recommended to keep it light and simple.
     * If you need to store complex data about your Game Object, look at using the Data Component instead.
     *
     * @method Phaser.GameObjects.GameObject#setState
     * @since 3.16.0
     *
     * @param {(integer|string)} value - The state of the Game Object.
     *
     * @return {this} This GameObject.
     */
    setState: function (value)
    {
        this.state = value;

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
     * For example, if you updated an existing key called `PlayerLives` then it would emit the event `changedata-PlayerLives`.
     * These events will be emitted regardless if you use this method to set the value, or the direct `values` setter.
     *
     * Please note that the data keys are case-sensitive and must be valid JavaScript Object property strings.
     * This means the keys `gold` and `Gold` are treated as two unique values within the Data Manager.
     *
     * @method Phaser.GameObjects.GameObject#setData
     * @since 3.0.0
     *
     * @param {(string|object)} key - The key to set the value for. Or an object of key value pairs. If an object the `data` argument is ignored.
     * @param {*} [data] - The value to set for the given key. If an object is provided as the key this argument is ignored.
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
     * Increase a value for the given key within this Game Objects Data Manager. If the key doesn't already exist in the Data Manager then it is increased from 0.
     *
     * If the Game Object has not been enabled for data (via `setDataEnabled`) then it will be enabled
     * before setting the value.
     *
     * If the key doesn't already exist in the Data Manager then it is created.
     *
     * When the value is first set, a `setdata` event is emitted from this Game Object.
     *
     * @method Phaser.GameObjects.GameObject#incData
     * @since 3.23.0
     *
     * @param {(string|object)} key - The key to increase the value for.
     * @param {*} [data] - The value to increase for the given key.
     *
     * @return {this} This GameObject.
     */
    incData: function (key, value)
    {
        if (!this.data)
        {
            this.data = new DataManager(this);
        }

        this.data.inc(key, value);

        return this;
    },

    /**
     * Toggle a boolean value for the given key within this Game Objects Data Manager. If the key doesn't already exist in the Data Manager then it is toggled from false.
     *
     * If the Game Object has not been enabled for data (via `setDataEnabled`) then it will be enabled
     * before setting the value.
     *
     * If the key doesn't already exist in the Data Manager then it is created.
     *
     * When the value is first set, a `setdata` event is emitted from this Game Object.
     *
     * @method Phaser.GameObjects.GameObject#toggleData
     * @since 3.23.0
     *
     * @param {(string|object)} key - The key to toggle the value for.
     *
     * @return {this} This GameObject.
     */
    toggleData: function (key)
    {
        if (!this.data)
        {
            this.data = new DataManager(this);
        }

        this.data.toggle(key);

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
     * @example
     * sprite.setInteractive();
     *
     * @example
     * sprite.setInteractive(new Phaser.Geom.Circle(45, 46, 45), Phaser.Geom.Circle.Contains);
     *
     * @example
     * graphics.setInteractive(new Phaser.Geom.Rectangle(0, 0, 128, 128), Phaser.Geom.Rectangle.Contains);
     *
     * @method Phaser.GameObjects.GameObject#setInteractive
     * @since 3.0.0
     *
     * @param {(Phaser.Types.Input.InputConfiguration|any)} [hitArea] - Either an input configuration object, or a geometric shape that defines the hit area for the Game Object. If not given it will try to create a Rectangle based on the texture frame.
     * @param {Phaser.Types.Input.HitAreaCallback} [callback] - The callback that determines if the pointer is within the Hit Area shape or not. If you provide a shape you must also provide a callback.
     * @param {boolean} [dropZone=false] - Should this Game Object be treated as a drop zone target?
     *
     * @return {this} This GameObject.
     */
    setInteractive: function (hitArea, hitAreaCallback, dropZone)
    {
        this.scene.sys.input.enable(this, hitArea, hitAreaCallback, dropZone);

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
     * This callback is invoked when this Game Object is added to a Scene.
     *
     * Can be overriden by custom Game Objects, but be aware of some Game Objects that
     * will use this, such as Sprites, to add themselves into the Update List.
     *
     * You can also listen for the `ADDED_TO_SCENE` event from this Game Object.
     *
     * @method Phaser.GameObjects.GameObject#addedToScene
     * @since 3.50.0
     */
    addedToScene: function ()
    {
    },

    /**
     * This callback is invoked when this Game Object is removed from a Scene.
     *
     * Can be overriden by custom Game Objects, but be aware of some Game Objects that
     * will use this, such as Sprites, to removed themselves from the Update List.
     *
     * You can also listen for the `REMOVED_FROM_SCENE` event from this Game Object.
     *
     * @method Phaser.GameObjects.GameObject#removedFromScene
     * @since 3.50.0
     */
    removedFromScene: function ()
    {
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
     * @return {Phaser.Types.GameObjects.JSONGameObject} A JSON representation of the Game Object.
     */
    toJSON: function ()
    {
        return ComponentsToJSON(this);
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
        return !(GameObject.RENDER_MASK !== this.renderFlags || (this.cameraFilter !== 0 && (this.cameraFilter & camera.id)));
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
     * @fires Phaser.GameObjects.Events#DESTROY
     * @since 3.0.0
     *
     * @param {boolean} [fromScene=false] - Is this Game Object being destroyed as the result of a Scene shutdown?
     */
    destroy: function (fromScene)
    {
        if (fromScene === undefined) { fromScene = false; }

        //  This Game Object has already been destroyed
        if (!this.scene || this.ignoreDestroy)
        {
            return;
        }

        if (this.preDestroy)
        {
            this.preDestroy.call(this);
        }

        this.emit(Events.DESTROY, this);

        var sys = this.scene.sys;

        if (!fromScene)
        {
            sys.displayList.remove(this);
        }

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
        if (!fromScene)
        {
            sys.queueDepthSort();
        }

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
 * @memberof Phaser.GameObjects.GameObject
 * @default
 */
GameObject.RENDER_MASK = 15;

module.exports = GameObject;


/***/ }),
/* 36 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
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
 * @return {Phaser.Types.GameObjects.JSONGameObject} A JSON representation of the Game Object.
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
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.GameObjects.Events
 */

module.exports = {

    ADDED_TO_SCENE: __webpack_require__(167),
    DESTROY: __webpack_require__(168),
    REMOVED_FROM_SCENE: __webpack_require__(169),
    VIDEO_COMPLETE: __webpack_require__(170),
    VIDEO_CREATED: __webpack_require__(171),
    VIDEO_ERROR: __webpack_require__(172),
    VIDEO_LOOP: __webpack_require__(173),
    VIDEO_PLAY: __webpack_require__(174),
    VIDEO_SEEKED: __webpack_require__(175),
    VIDEO_SEEKING: __webpack_require__(176),
    VIDEO_STOP: __webpack_require__(177),
    VIDEO_TIMEOUT: __webpack_require__(178),
    VIDEO_UNLOCKED: __webpack_require__(179)

};


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Animations.Events
 */

module.exports = {

    ADD_ANIMATION: __webpack_require__(184),
    ANIMATION_COMPLETE: __webpack_require__(185),
    ANIMATION_COMPLETE_KEY: __webpack_require__(186),
    ANIMATION_REPEAT: __webpack_require__(187),
    ANIMATION_RESTART: __webpack_require__(188),
    ANIMATION_START: __webpack_require__(189),
    ANIMATION_STOP: __webpack_require__(190),
    ANIMATION_UPDATE: __webpack_require__(191),
    PAUSE_ALL: __webpack_require__(192),
    REMOVE_ANIMATION: __webpack_require__(193),
    RESUME_ALL: __webpack_require__(194)

};


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Perimeter = __webpack_require__(40);
var Point = __webpack_require__(5);

/**
 * Calculates the coordinates of a point at a certain `position` on the Rectangle's perimeter.
 * 
 * The `position` is a fraction between 0 and 1 which defines how far into the perimeter the point is.
 * 
 * A value of 0 or 1 returns the point at the top left corner of the rectangle, while a value of 0.5 returns the point at the bottom right corner of the rectangle. Values between 0 and 0.5 are on the top or the right side and values between 0.5 and 1 are on the bottom or the left side.
 *
 * @function Phaser.Geom.Rectangle.GetPoint
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [out,$return]
 *
 * @param {Phaser.Geom.Rectangle} rectangle - The Rectangle to get the perimeter point from.
 * @param {number} position - The normalized distance into the Rectangle's perimeter to return.
 * @param {(Phaser.Geom.Point|object)} [out] - An object to update with the `x` and `y` coordinates of the point.
 *
 * @return {Phaser.Geom.Point} The updated `output` object, or a new Point if no `output` object was given.
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
/* 40 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculates the perimeter of a Rectangle.
 *
 * @function Phaser.Geom.Rectangle.Perimeter
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} rect - The Rectangle to use.
 *
 * @return {number} The perimeter of the Rectangle, equal to `(width * 2) + (height * 2)`.
 */
var Perimeter = function (rect)
{
    return 2 * (rect.width + rect.height);
};

module.exports = Perimeter;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = __webpack_require__(0);
var MATH_CONST = __webpack_require__(2);
var Vector2 = __webpack_require__(1);

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
 * @memberof Phaser.GameObjects.Components
 * @constructor
 * @since 3.0.0
 *
 * @param {number} [a=1] - The Scale X value.
 * @param {number} [b=0] - The Skew Y value.
 * @param {number} [c=0] - The Skew X value.
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
     * The Skew Y value.
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
     * The Skew X value.
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
     * The rotation of the Matrix. Value is in radians.
     *
     * @name Phaser.GameObjects.Components.TransformMatrix#rotation
     * @type {number}
     * @readonly
     * @since 3.4.0
     */
    rotation: {

        get: function ()
        {
            return Math.acos(this.a / this.scaleX) * ((Math.atan(-this.c / this.a) < 0) ? -1 : 1);
        }

    },

    /**
     * The rotation of the Matrix, normalized to be within the Phaser right-handed
     * clockwise rotation space. Value is in radians.
     *
     * @name Phaser.GameObjects.Components.TransformMatrix#rotationNormalized
     * @type {number}
     * @readonly
     * @since 3.19.0
     */
    rotationNormalized: {

        get: function ()
        {
            var matrix = this.matrix;

            var a = matrix[0];
            var b = matrix[1];
            var c = matrix[2];
            var d = matrix[3];

            if (a || b)
            {
                // var r = Math.sqrt(a * a + b * b);
    
                return (b > 0) ? Math.acos(a / this.scaleX) : -Math.acos(a / this.scaleX);
            }
            else if (c || d)
            {
                // var s = Math.sqrt(c * c + d * d);
    
                return MATH_CONST.TAU - ((d > 0) ? Math.acos(-c / this.scaleY) : -Math.acos(c / this.scaleY));
            }
            else
            {
                return 0;
            }
        }

    },

    /**
     * The decomposed horizontal scale of the Matrix. This value is always positive.
     *
     * @name Phaser.GameObjects.Components.TransformMatrix#scaleX
     * @type {number}
     * @readonly
     * @since 3.4.0
     */
    scaleX: {

        get: function ()
        {
            return Math.sqrt((this.a * this.a) + (this.b * this.b));
        }

    },

    /**
     * The decomposed vertical scale of the Matrix. This value is always positive.
     *
     * @name Phaser.GameObjects.Components.TransformMatrix#scaleY
     * @type {number}
     * @readonly
     * @since 3.4.0
     */
    scaleY: {

        get: function ()
        {
            return Math.sqrt((this.c * this.c) + (this.d * this.d));
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
     * @return {(this|Phaser.GameObjects.Components.TransformMatrix)} Either this TransformMatrix, or the `out` Matrix, if given in the arguments.
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

        destinationMatrix.a = (sourceA * localA) + (sourceB * localC);
        destinationMatrix.b = (sourceA * localB) + (sourceB * localD);
        destinationMatrix.c = (sourceC * localA) + (sourceD * localC);
        destinationMatrix.d = (sourceC * localB) + (sourceD * localD);
        destinationMatrix.e = (sourceE * localA) + (sourceF * localC) + localE;
        destinationMatrix.f = (sourceE * localB) + (sourceF * localD) + localF;

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
     * Decompose this Matrix into its translation, scale and rotation values using QR decomposition.
     * 
     * The result must be applied in the following order to reproduce the current matrix:
     * 
     * translate -> rotate -> scale
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

        var determ = a * d - b * c;

        decomposedMatrix.translateX = matrix[4];
        decomposedMatrix.translateY = matrix[5];

        if (a || b)
        {
            var r = Math.sqrt(a * a + b * b);

            decomposedMatrix.rotation = (b > 0) ? Math.acos(a / r) : -Math.acos(a / r);
            decomposedMatrix.scaleX = r;
            decomposedMatrix.scaleY = determ / r;
        }
        else if (c || d)
        {
            var s = Math.sqrt(c * c + d * d);

            decomposedMatrix.rotation = Math.PI * 0.5 - (d > 0 ? Math.acos(-c / s) : -Math.acos(c / s));
            decomposedMatrix.scaleX = determ / s;
            decomposedMatrix.scaleY = s;
        }
        else
        {
            decomposedMatrix.rotation = 0;
            decomposedMatrix.scaleX = 0;
            decomposedMatrix.scaleY = 0;
        }

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
     * Takes the `x` and `y` values and returns a new position in the `output` vector that is the inverse of
     * the current matrix with its transformation applied.
     * 
     * Can be used to translate points from world to local space.
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#applyInverse
     * @since 3.12.0
     *
     * @param {number} x - The x position to translate.
     * @param {number} y - The y position to translate.
     * @param {Phaser.Math.Vector2} [output] - A Vector2, or point-like object, to store the results in.
     *
     * @return {Phaser.Math.Vector2} The coordinates, inverse-transformed through this matrix.
     */
    applyInverse: function (x, y, output)
    {
        if (output === undefined) { output = new Vector2(); }

        var matrix = this.matrix;

        var a = matrix[0];
        var b = matrix[1];
        var c = matrix[2];
        var d = matrix[3];
        var tx = matrix[4];
        var ty = matrix[5];

        var id = 1 / ((a * d) + (c * -b));

        output.x = (d * id * x) + (-c * id * y) + (((ty * c) - (tx * d)) * id);
        output.y = (a * id * y) + (-b * id * x) + (((-ty * a) + (tx * b)) * id);

        return output;
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
     * Returns the X component of this matrix multiplied by the given values.
     * 
     * This is the same as `x * a + y * c + e`, optionally passing via `Math.round`.
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#getXRound
     * @since 3.50.0
     * 
     * @param {number} x - The x value.
     * @param {number} y - The y value.
     * @param {boolean} [round=false] - Math.round the resulting value?
     *
     * @return {number} The calculated x value.
     */
    getXRound: function (x, y, round)
    {
        var v = this.getX(x, y);

        if (round)
        {
            v = Math.round(v);
        }

        return v;
    },

    /**
     * Returns the Y component of this matrix multiplied by the given values.
     * 
     * This is the same as `x * b + y * d + f`, optionally passing via `Math.round`.
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#getYRound
     * @since 3.50.0
     * 
     * @param {number} x - The x value.
     * @param {number} y - The y value.
     * @param {boolean} [round=false] - Math.round the resulting value?
     *
     * @return {number} The calculated y value.
     */
    getYRound: function (x, y, round)
    {
        var v = this.getY(x, y);

        if (round)
        {
            v = Math.round(v);
        }

        return v;
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
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var BuildGameObject = __webpack_require__(43);
var BuildGameObjectAnimation = __webpack_require__(156);
var Class = __webpack_require__(0);
var GetAdvancedValue = __webpack_require__(8);
var OrthographicCamera = __webpack_require__(157);
var PerspectiveCamera = __webpack_require__(253);
var ScenePlugin = __webpack_require__(254);
var Sprite3D = __webpack_require__(34);

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


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BlendModes = __webpack_require__(14);
var GetAdvancedValue = __webpack_require__(8);

/**
 * Builds a Game Object using the provided configuration object.
 *
 * @function Phaser.GameObjects.BuildGameObject
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - A reference to the Scene.
 * @param {Phaser.GameObjects.GameObject} gameObject - The initial GameObject.
 * @param {Phaser.Types.GameObjects.GameObjectConfig} config - The config to build the GameObject with.
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
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = __webpack_require__(2);
var Extend = __webpack_require__(45);

/**
 * @namespace Phaser.Math
 */

var PhaserMath = {

    //  Collections of functions
    Angle: __webpack_require__(47),
    Distance: __webpack_require__(58),
    Easing: __webpack_require__(66),
    Fuzzy: __webpack_require__(111),
    Interpolation: __webpack_require__(116),
    Pow2: __webpack_require__(124),
    Snap: __webpack_require__(128),

    //  Expose the RNG Class
    RandomDataGenerator: __webpack_require__(132),

    //  Single functions
    Average: __webpack_require__(133),
    Bernstein: __webpack_require__(19),
    Between: __webpack_require__(134),
    CatmullRom: __webpack_require__(21),
    CeilTo: __webpack_require__(135),
    Clamp: __webpack_require__(4),
    DegToRad: __webpack_require__(25),
    Difference: __webpack_require__(136),
    Euler: __webpack_require__(137),
    Factorial: __webpack_require__(20),
    FloatBetween: __webpack_require__(9),
    FloorTo: __webpack_require__(138),
    FromPercent: __webpack_require__(139),
    GetSpeed: __webpack_require__(140),
    IsEven: __webpack_require__(141),
    IsEvenStrict: __webpack_require__(142),
    Linear: __webpack_require__(22),
    MaxAdd: __webpack_require__(143),
    MinSub: __webpack_require__(144),
    Percent: __webpack_require__(145),
    RadToDeg: __webpack_require__(146),
    RandomXY: __webpack_require__(147),
    RandomXYZ: __webpack_require__(26),
    RandomXYZW: __webpack_require__(27),
    Rotate: __webpack_require__(148),
    RotateAround: __webpack_require__(28),
    RotateAroundDistance: __webpack_require__(149),
    RotateTo: __webpack_require__(150),
    RoundAwayFromZero: __webpack_require__(151),
    RoundTo: __webpack_require__(152),
    SinCosTableGenerator: __webpack_require__(153),
    SmootherStep: __webpack_require__(24),
    SmoothStep: __webpack_require__(23),
    ToXY: __webpack_require__(154),
    TransformXY: __webpack_require__(29),
    Within: __webpack_require__(155),
    Wrap: __webpack_require__(10),

    //  Vector classes
    Vector2: __webpack_require__(1),
    Vector3: __webpack_require__(3),
    Vector4: __webpack_require__(11),
    Matrix3: __webpack_require__(30),
    Matrix4: __webpack_require__(6),
    Quaternion: __webpack_require__(31),
    RotateVec3: __webpack_require__(32)

};

//   Merge in the consts

PhaserMath = Extend(false, PhaserMath, CONST);

//  Export it

module.exports = PhaserMath;


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var IsPlainObject = __webpack_require__(46);

// @param {boolean} deep - Perform a deep copy?
// @param {object} target - The target object to copy to.
// @return {object} The extended object.

/**
 * This is a slightly modified version of http://api.jquery.com/jQuery.extend/
 *
 * @function Phaser.Utils.Objects.Extend
 * @since 3.0.0
 *
 * @param {...*} [args] - The objects that will be mixed.
 *
 * @return {object} The extended object.
 */
var Extend = function ()
{
    var options, name, src, copy, copyIsArray, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;

    // Handle a deep copy situation
    if (typeof target === 'boolean')
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
                if (deep && copy && (IsPlainObject(copy) || (copyIsArray = Array.isArray(copy))))
                {
                    if (copyIsArray)
                    {
                        copyIsArray = false;
                        clone = src && Array.isArray(src) ? src : [];
                    }
                    else
                    {
                        clone = src && IsPlainObject(src) ? src : {};
                    }

                    // Never move original objects, clone them
                    target[name] = Extend(deep, clone, copy);

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
};

module.exports = Extend;


/***/ }),
/* 46 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * This is a slightly modified version of jQuery.isPlainObject.
 * A plain object is an object whose internal class property is [object Object].
 *
 * @function Phaser.Utils.Objects.IsPlainObject
 * @since 3.0.0
 *
 * @param {object} obj - The object to inspect.
 *
 * @return {boolean} `true` if the object is plain, otherwise `false`.
 */
var IsPlainObject = function (obj)
{
    // Not plain objects:
    // - Any object or value whose internal [[Class]] property is not "[object Object]"
    // - DOM nodes
    // - window
    if (typeof(obj) !== 'object' || obj.nodeType || obj === obj.window)
    {
        return false;
    }

    // Support: Firefox <20
    // The try/catch suppresses exceptions thrown when attempting to access
    // the "constructor" property of certain host objects, ie. |window.location|
    // https://bugzilla.mozilla.org/show_bug.cgi?id=814622
    try
    {
        if (obj.constructor && !({}).hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf'))
        {
            return false;
        }
    }
    catch (e)
    {
        return false;
    }

    // If the function hasn't returned already, we're confident that
    // |obj| is a plain object, created by {} or constructed with new Object
    return true;
};

module.exports = IsPlainObject;


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Math.Angle
 */

module.exports = {

    Between: __webpack_require__(48),
    BetweenPoints: __webpack_require__(49),
    BetweenPointsY: __webpack_require__(50),
    BetweenY: __webpack_require__(51),
    CounterClockwise: __webpack_require__(52),
    Normalize: __webpack_require__(15),
    Random: __webpack_require__(53),
    RandomDegrees: __webpack_require__(54),
    Reverse: __webpack_require__(55),
    RotateTo: __webpack_require__(56),
    ShortestBetween: __webpack_require__(57),
    Wrap: __webpack_require__(16),
    WrapDegrees: __webpack_require__(17)

};


/***/ }),
/* 48 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Find the angle of a segment from (x1, y1) -> (x2, y2).
 *
 * @function Phaser.Math.Angle.Between
 * @since 3.0.0
 *
 * @param {number} x1 - The x coordinate of the first point.
 * @param {number} y1 - The y coordinate of the first point.
 * @param {number} x2 - The x coordinate of the second point.
 * @param {number} y2 - The y coordinate of the second point.
 *
 * @return {number} The angle in radians.
 */
var Between = function (x1, y1, x2, y2)
{
    return Math.atan2(y2 - y1, x2 - x1);
};

module.exports = Between;


/***/ }),
/* 49 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Find the angle of a segment from (point1.x, point1.y) -> (point2.x, point2.y).
 *
 * Calculates the angle of the vector from the first point to the second point.
 *
 * @function Phaser.Math.Angle.BetweenPoints
 * @since 3.0.0
 *
 * @param {Phaser.Types.Math.Vector2Like} point1 - The first point.
 * @param {Phaser.Types.Math.Vector2Like} point2 - The second point.
 *
 * @return {number} The angle in radians.
 */
var BetweenPoints = function (point1, point2)
{
    return Math.atan2(point2.y - point1.y, point2.x - point1.x);
};

module.exports = BetweenPoints;


/***/ }),
/* 50 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Find the angle of a segment from (point1.x, point1.y) -> (point2.x, point2.y).
 *
 * The difference between this method and {@link Phaser.Math.Angle.BetweenPoints} is that this assumes the y coordinate
 * travels down the screen.
 *
 * @function Phaser.Math.Angle.BetweenPointsY
 * @since 3.0.0
 *
 * @param {Phaser.Types.Math.Vector2Like} point1 - The first point.
 * @param {Phaser.Types.Math.Vector2Like} point2 - The second point.
 *
 * @return {number} The angle in radians.
 */
var BetweenPointsY = function (point1, point2)
{
    return Math.atan2(point2.x - point1.x, point2.y - point1.y);
};

module.exports = BetweenPointsY;


/***/ }),
/* 51 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Find the angle of a segment from (x1, y1) -> (x2, y2).
 *
 * The difference between this method and {@link Phaser.Math.Angle.Between} is that this assumes the y coordinate
 * travels down the screen.
 *
 * @function Phaser.Math.Angle.BetweenY
 * @since 3.0.0
 *
 * @param {number} x1 - The x coordinate of the first point.
 * @param {number} y1 - The y coordinate of the first point.
 * @param {number} x2 - The x coordinate of the second point.
 * @param {number} y2 - The y coordinate of the second point.
 *
 * @return {number} The angle in radians.
 */
var BetweenY = function (x1, y1, x2, y2)
{
    return Math.atan2(x2 - x1, y2 - y1);
};

module.exports = BetweenY;


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = __webpack_require__(2);

/**
 * Takes an angle in Phasers default clockwise format and converts it so that
 * 0 is North, 90 is West, 180 is South and 270 is East,
 * therefore running counter-clockwise instead of clockwise.
 * 
 * You can pass in the angle from a Game Object using:
 * 
 * ```javascript
 * var converted = CounterClockwise(gameobject.rotation);
 * ```
 * 
 * All values for this function are in radians.
 *
 * @function Phaser.Math.Angle.CounterClockwise
 * @since 3.16.0
 *
 * @param {number} angle - The angle to convert, in radians.
 *
 * @return {number} The converted angle, in radians.
 */
var CounterClockwise = function (angle)
{
    if (angle > Math.PI)
    {
        angle -= CONST.PI2;
    }

    return Math.abs((((angle + CONST.TAU) % CONST.PI2) - CONST.PI2) % CONST.PI2);
};

module.exports = CounterClockwise;


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       @samme
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var FloatBetween = __webpack_require__(9);

/**
 * Returns a random angle in the range [-pi, pi].
 *
 * @function Phaser.Math.Angle.Random
 * @since 3.23.0
 *
 * @return {number} The angle, in radians.
 */
var Random = function ()
{
    return FloatBetween(-Math.PI, Math.PI);
};

module.exports = Random;


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       @samme
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var FloatBetween = __webpack_require__(9);

/**
 * Returns a random angle in the range [-180, 180].
 *
 * @function Phaser.Math.Angle.RandomDegrees
 * @since 3.23.0
 *
 * @return {number} The angle, in degrees.
 */
var RandomDegrees = function ()
{
    return FloatBetween(-180, 180);
};

module.exports = RandomDegrees;


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Normalize = __webpack_require__(15);

/**
 * Reverse the given angle.
 *
 * @function Phaser.Math.Angle.Reverse
 * @since 3.0.0
 *
 * @param {number} angle - The angle to reverse, in radians.
 *
 * @return {number} The reversed angle, in radians.
 */
var Reverse = function (angle)
{
    return Normalize(angle + Math.PI);
};

module.exports = Reverse;


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var MATH_CONST = __webpack_require__(2);

/**
 * Rotates `currentAngle` towards `targetAngle`, taking the shortest rotation distance. The `lerp` argument is the amount to rotate by in this call.
 *
 * @function Phaser.Math.Angle.RotateTo
 * @since 3.0.0
 *
 * @param {number} currentAngle - The current angle, in radians.
 * @param {number} targetAngle - The target angle to rotate to, in radians.
 * @param {number} [lerp=0.05] - The lerp value to add to the current angle.
 *
 * @return {number} The adjusted angle.
 */
var RotateTo = function (currentAngle, targetAngle, lerp)
{
    if (lerp === undefined) { lerp = 0.05; }

    if (currentAngle === targetAngle)
    {
        return currentAngle;
    }

    if (Math.abs(targetAngle - currentAngle) <= lerp || Math.abs(targetAngle - currentAngle) >= (MATH_CONST.PI2 - lerp))
    {
        currentAngle = targetAngle;
    }
    else
    {
        if (Math.abs(targetAngle - currentAngle) > Math.PI)
        {
            if (targetAngle < currentAngle)
            {
                targetAngle += MATH_CONST.PI2;
            }
            else
            {
                targetAngle -= MATH_CONST.PI2;
            }
        }

        if (targetAngle > currentAngle)
        {
            currentAngle += lerp;
        }
        else if (targetAngle < currentAngle)
        {
            currentAngle -= lerp;
        }
    }

    return currentAngle;
};

module.exports = RotateTo;


/***/ }),
/* 57 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Gets the shortest angle between `angle1` and `angle2`.
 *
 * Both angles must be in the range -180 to 180, which is the same clamped
 * range that `sprite.angle` uses, so you can pass in two sprite angles to
 * this method and get the shortest angle back between the two of them.
 *
 * The angle returned will be in the same range. If the returned angle is
 * greater than 0 then it's a counter-clockwise rotation, if < 0 then it's
 * a clockwise rotation.
 *
 * TODO: Wrap the angles in this function?
 *
 * @function Phaser.Math.Angle.ShortestBetween
 * @since 3.0.0
 *
 * @param {number} angle1 - The first angle in the range -180 to 180.
 * @param {number} angle2 - The second angle in the range -180 to 180.
 *
 * @return {number} The shortest angle, in degrees. If greater than zero it's a counter-clockwise rotation.
 */
var ShortestBetween = function (angle1, angle2)
{
    var difference = angle2 - angle1;

    if (difference === 0)
    {
        return 0;
    }

    var times = Math.floor((difference - (-180)) / 360);

    return difference - (times * 360);

};

module.exports = ShortestBetween;


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Math.Distance
 */

module.exports = {

    Between: __webpack_require__(59),
    BetweenPoints: __webpack_require__(60),
    BetweenPointsSquared: __webpack_require__(61),
    Chebyshev: __webpack_require__(62),
    Power: __webpack_require__(63),
    Snake: __webpack_require__(64),
    Squared: __webpack_require__(65)

};


/***/ }),
/* 59 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculate the distance between two sets of coordinates (points).
 *
 * @function Phaser.Math.Distance.Between
 * @since 3.0.0
 *
 * @param {number} x1 - The x coordinate of the first point.
 * @param {number} y1 - The y coordinate of the first point.
 * @param {number} x2 - The x coordinate of the second point.
 * @param {number} y2 - The y coordinate of the second point.
 *
 * @return {number} The distance between each point.
 */
var DistanceBetween = function (x1, y1, x2, y2)
{
    var dx = x1 - x2;
    var dy = y1 - y2;

    return Math.sqrt(dx * dx + dy * dy);
};

module.exports = DistanceBetween;


/***/ }),
/* 60 */
/***/ (function(module, exports) {

/**
 * @author       samme
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculate the distance between two points.
 *
 * @function Phaser.Math.Distance.BetweenPoints
 * @since 3.22.0
 *
 * @param {Phaser.Types.Math.Vector2Like} a - The first point.
 * @param {Phaser.Types.Math.Vector2Like} b - The second point.
 *
 * @return {number} The distance between the points.
 */
var DistanceBetweenPoints = function (a, b)
{
    var dx = a.x - b.x;
    var dy = a.y - b.y;

    return Math.sqrt(dx * dx + dy * dy);
};

module.exports = DistanceBetweenPoints;


/***/ }),
/* 61 */
/***/ (function(module, exports) {

/**
 * @author       samme
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculate the squared distance between two points.
 *
 * @function Phaser.Math.Distance.BetweenPointsSquared
 * @since 3.22.0
 *
 * @param {Phaser.Types.Math.Vector2Like} a - The first point.
 * @param {Phaser.Types.Math.Vector2Like} b - The second point.
 *
 * @return {number} The squared distance between the points.
 */
var DistanceBetweenPointsSquared = function (a, b)
{
    var dx = a.x - b.x;
    var dy = a.y - b.y;

    return dx * dx + dy * dy;
};

module.exports = DistanceBetweenPointsSquared;


/***/ }),
/* 62 */
/***/ (function(module, exports) {

/**
 * @author       samme
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculate the Chebyshev distance between two sets of coordinates (points).
 *
 * Chebyshev distance (or chessboard distance) is the maximum of the horizontal and vertical distances.
 * It's the effective distance when movement can be horizontal, vertical, or diagonal.
 *
 * @function Phaser.Math.Distance.Chebyshev
 * @since 3.22.0
 *
 * @param {number} x1 - The x coordinate of the first point.
 * @param {number} y1 - The y coordinate of the first point.
 * @param {number} x2 - The x coordinate of the second point.
 * @param {number} y2 - The y coordinate of the second point.
 *
 * @return {number} The distance between each point.
 */
var ChebyshevDistance = function (x1, y1, x2, y2)
{
    return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
};

module.exports = ChebyshevDistance;


/***/ }),
/* 63 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculate the distance between two sets of coordinates (points) to the power of `pow`.
 *
 * @function Phaser.Math.Distance.Power
 * @since 3.0.0
 *
 * @param {number} x1 - The x coordinate of the first point.
 * @param {number} y1 - The y coordinate of the first point.
 * @param {number} x2 - The x coordinate of the second point.
 * @param {number} y2 - The y coordinate of the second point.
 * @param {number} pow - The exponent.
 *
 * @return {number} The distance between each point.
 */
var DistancePower = function (x1, y1, x2, y2, pow)
{
    if (pow === undefined) { pow = 2; }

    return Math.sqrt(Math.pow(x2 - x1, pow) + Math.pow(y2 - y1, pow));
};

module.exports = DistancePower;


/***/ }),
/* 64 */
/***/ (function(module, exports) {

/**
 * @author       samme
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculate the snake distance between two sets of coordinates (points).
 *
 * Snake distance (rectilinear distance, Manhattan distance) is the sum of the horizontal and vertical distances.
 * It's the effective distance when movement is allowed only horizontally or vertically (but not both).
 *
 * @function Phaser.Math.Distance.Snake
 * @since 3.22.0
 *
 * @param {number} x1 - The x coordinate of the first point.
 * @param {number} y1 - The y coordinate of the first point.
 * @param {number} x2 - The x coordinate of the second point.
 * @param {number} y2 - The y coordinate of the second point.
 *
 * @return {number} The distance between each point.
 */
var SnakeDistance = function (x1, y1, x2, y2)
{
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
};

module.exports = SnakeDistance;


/***/ }),
/* 65 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculate the distance between two sets of coordinates (points), squared.
 *
 * @function Phaser.Math.Distance.Squared
 * @since 3.0.0
 *
 * @param {number} x1 - The x coordinate of the first point.
 * @param {number} y1 - The y coordinate of the first point.
 * @param {number} x2 - The x coordinate of the second point.
 * @param {number} y2 - The y coordinate of the second point.
 *
 * @return {number} The distance between each point, squared.
 */
var DistanceSquared = function (x1, y1, x2, y2)
{
    var dx = x1 - x2;
    var dy = y1 - y2;

    return dx * dx + dy * dy;
};

module.exports = DistanceSquared;


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Math.Easing
 */

module.exports = {

    Back: __webpack_require__(67),
    Bounce: __webpack_require__(71),
    Circular: __webpack_require__(75),
    Cubic: __webpack_require__(79),
    Elastic: __webpack_require__(83),
    Expo: __webpack_require__(87),
    Linear: __webpack_require__(91),
    Quadratic: __webpack_require__(93),
    Quartic: __webpack_require__(97),
    Quintic: __webpack_require__(101),
    Sine: __webpack_require__(105),
    Stepped: __webpack_require__(109)

};


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Math.Easing.Back
 */

module.exports = {

    In: __webpack_require__(68),
    Out: __webpack_require__(69),
    InOut: __webpack_require__(70)

};


/***/ }),
/* 68 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Back ease-in.
 *
 * @function Phaser.Math.Easing.Back.In
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 * @param {number} [overshoot=1.70158] - The overshoot amount.
 *
 * @return {number} The tweened value.
 */
var In = function (v, overshoot)
{
    if (overshoot === undefined) { overshoot = 1.70158; }

    return v * v * ((overshoot + 1) * v - overshoot);
};

module.exports = In;


/***/ }),
/* 69 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Back ease-out.
 *
 * @function Phaser.Math.Easing.Back.Out
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 * @param {number} [overshoot=1.70158] - The overshoot amount.
 *
 * @return {number} The tweened value.
 */
var Out = function (v, overshoot)
{
    if (overshoot === undefined) { overshoot = 1.70158; }

    return --v * v * ((overshoot + 1) * v + overshoot) + 1;
};

module.exports = Out;


/***/ }),
/* 70 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Back ease-in/out.
 *
 * @function Phaser.Math.Easing.Back.InOut
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 * @param {number} [overshoot=1.70158] - The overshoot amount.
 *
 * @return {number} The tweened value.
 */
var InOut = function (v, overshoot)
{
    if (overshoot === undefined) { overshoot = 1.70158; }

    var s = overshoot * 1.525;

    if ((v *= 2) < 1)
    {
        return 0.5 * (v * v * ((s + 1) * v - s));
    }
    else
    {
        return 0.5 * ((v -= 2) * v * ((s + 1) * v + s) + 2);
    }
};

module.exports = InOut;


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Math.Easing.Bounce
 */

module.exports = {

    In: __webpack_require__(72),
    Out: __webpack_require__(73),
    InOut: __webpack_require__(74)

};


/***/ }),
/* 72 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Bounce ease-in.
 *
 * @function Phaser.Math.Easing.Bounce.In
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 *
 * @return {number} The tweened value.
 */
var In = function (v)
{
    v = 1 - v;

    if (v < 1 / 2.75)
    {
        return 1 - (7.5625 * v * v);
    }
    else if (v < 2 / 2.75)
    {
        return 1 - (7.5625 * (v -= 1.5 / 2.75) * v + 0.75);
    }
    else if (v < 2.5 / 2.75)
    {
        return 1 - (7.5625 * (v -= 2.25 / 2.75) * v + 0.9375);
    }
    else
    {
        return 1 - (7.5625 * (v -= 2.625 / 2.75) * v + 0.984375);
    }
};

module.exports = In;


/***/ }),
/* 73 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Bounce ease-out.
 *
 * @function Phaser.Math.Easing.Bounce.Out
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 *
 * @return {number} The tweened value.
 */
var Out = function (v)
{
    if (v < 1 / 2.75)
    {
        return 7.5625 * v * v;
    }
    else if (v < 2 / 2.75)
    {
        return 7.5625 * (v -= 1.5 / 2.75) * v + 0.75;
    }
    else if (v < 2.5 / 2.75)
    {
        return 7.5625 * (v -= 2.25 / 2.75) * v + 0.9375;
    }
    else
    {
        return 7.5625 * (v -= 2.625 / 2.75) * v + 0.984375;
    }
};

module.exports = Out;


/***/ }),
/* 74 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Bounce ease-in/out.
 *
 * @function Phaser.Math.Easing.Bounce.InOut
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 *
 * @return {number} The tweened value.
 */
var InOut = function (v)
{
    var reverse = false;

    if (v < 0.5)
    {
        v = 1 - (v * 2);
        reverse = true;
    }
    else
    {
        v = (v * 2) - 1;
    }

    if (v < 1 / 2.75)
    {
        v = 7.5625 * v * v;
    }
    else if (v < 2 / 2.75)
    {
        v = 7.5625 * (v -= 1.5 / 2.75) * v + 0.75;
    }
    else if (v < 2.5 / 2.75)
    {
        v = 7.5625 * (v -= 2.25 / 2.75) * v + 0.9375;
    }
    else
    {
        v = 7.5625 * (v -= 2.625 / 2.75) * v + 0.984375;
    }

    if (reverse)
    {
        return (1 - v) * 0.5;
    }
    else
    {
        return v * 0.5 + 0.5;
    }
};

module.exports = InOut;


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Math.Easing.Circular
 */

module.exports = {

    In: __webpack_require__(76),
    Out: __webpack_require__(77),
    InOut: __webpack_require__(78)

};


/***/ }),
/* 76 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Circular ease-in.
 *
 * @function Phaser.Math.Easing.Circular.In
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 *
 * @return {number} The tweened value.
 */
var In = function (v)
{
    return 1 - Math.sqrt(1 - v * v);
};

module.exports = In;


/***/ }),
/* 77 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Circular ease-out.
 *
 * @function Phaser.Math.Easing.Circular.Out
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 *
 * @return {number} The tweened value.
 */
var Out = function (v)
{
    return Math.sqrt(1 - (--v * v));
};

module.exports = Out;


/***/ }),
/* 78 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Circular ease-in/out.
 *
 * @function Phaser.Math.Easing.Circular.InOut
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 *
 * @return {number} The tweened value.
 */
var InOut = function (v)
{
    if ((v *= 2) < 1)
    {
        return -0.5 * (Math.sqrt(1 - v * v) - 1);
    }
    else
    {
        return 0.5 * (Math.sqrt(1 - (v -= 2) * v) + 1);
    }
};

module.exports = InOut;


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Math.Easing.Cubic
 */

module.exports = {

    In: __webpack_require__(80),
    Out: __webpack_require__(81),
    InOut: __webpack_require__(82)

};


/***/ }),
/* 80 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Cubic ease-in.
 *
 * @function Phaser.Math.Easing.Cubic.In
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 *
 * @return {number} The tweened value.
 */
var In = function (v)
{
    return v * v * v;
};

module.exports = In;


/***/ }),
/* 81 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Cubic ease-out.
 *
 * @function Phaser.Math.Easing.Cubic.Out
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 *
 * @return {number} The tweened value.
 */
var Out = function (v)
{
    return --v * v * v + 1;
};

module.exports = Out;


/***/ }),
/* 82 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Cubic ease-in/out.
 *
 * @function Phaser.Math.Easing.Cubic.InOut
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 *
 * @return {number} The tweened value.
 */
var InOut = function (v)
{
    if ((v *= 2) < 1)
    {
        return 0.5 * v * v * v;
    }
    else
    {
        return 0.5 * ((v -= 2) * v * v + 2);
    }
};

module.exports = InOut;


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Math.Easing.Elastic
 */

module.exports = {

    In: __webpack_require__(84),
    Out: __webpack_require__(85),
    InOut: __webpack_require__(86)

};


/***/ }),
/* 84 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Elastic ease-in.
 *
 * @function Phaser.Math.Easing.Elastic.In
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 * @param {number} [amplitude=0.1] - The amplitude of the elastic ease.
 * @param {number} [period=0.1] - Sets how tight the sine-wave is, where smaller values are tighter waves, which result in more cycles.
 *
 * @return {number} The tweened value.
 */
var In = function (v, amplitude, period)
{
    if (amplitude === undefined) { amplitude = 0.1; }
    if (period === undefined) { period = 0.1; }

    if (v === 0)
    {
        return 0;
    }
    else if (v === 1)
    {
        return 1;
    }
    else
    {
        var s = period / 4;

        if (amplitude < 1)
        {
            amplitude = 1;
        }
        else
        {
            s = period * Math.asin(1 / amplitude) / (2 * Math.PI);
        }

        return -(amplitude * Math.pow(2, 10 * (v -= 1)) * Math.sin((v - s) * (2 * Math.PI) / period));
    }
};

module.exports = In;


/***/ }),
/* 85 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Elastic ease-out.
 *
 * @function Phaser.Math.Easing.Elastic.Out
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 * @param {number} [amplitude=0.1] - The amplitude of the elastic ease.
 * @param {number} [period=0.1] - Sets how tight the sine-wave is, where smaller values are tighter waves, which result in more cycles.
 *
 * @return {number} The tweened value.
 */
var Out = function (v, amplitude, period)
{
    if (amplitude === undefined) { amplitude = 0.1; }
    if (period === undefined) { period = 0.1; }

    if (v === 0)
    {
        return 0;
    }
    else if (v === 1)
    {
        return 1;
    }
    else
    {
        var s = period / 4;

        if (amplitude < 1)
        {
            amplitude = 1;
        }
        else
        {
            s = period * Math.asin(1 / amplitude) / (2 * Math.PI);
        }

        return (amplitude * Math.pow(2, -10 * v) * Math.sin((v - s) * (2 * Math.PI) / period) + 1);
    }
};

module.exports = Out;


/***/ }),
/* 86 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Elastic ease-in/out.
 *
 * @function Phaser.Math.Easing.Elastic.InOut
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 * @param {number} [amplitude=0.1] - The amplitude of the elastic ease.
 * @param {number} [period=0.1] - Sets how tight the sine-wave is, where smaller values are tighter waves, which result in more cycles.
 *
 * @return {number} The tweened value.
 */
var InOut = function (v, amplitude, period)
{
    if (amplitude === undefined) { amplitude = 0.1; }
    if (period === undefined) { period = 0.1; }

    if (v === 0)
    {
        return 0;
    }
    else if (v === 1)
    {
        return 1;
    }
    else
    {
        var s = period / 4;

        if (amplitude < 1)
        {
            amplitude = 1;
        }
        else
        {
            s = period * Math.asin(1 / amplitude) / (2 * Math.PI);
        }

        if ((v *= 2) < 1)
        {
            return -0.5 * (amplitude * Math.pow(2, 10 * (v -= 1)) * Math.sin((v - s) * (2 * Math.PI) / period));
        }
        else
        {
            return amplitude * Math.pow(2, -10 * (v -= 1)) * Math.sin((v - s) * (2 * Math.PI) / period) * 0.5 + 1;
        }
    }
};

module.exports = InOut;


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Math.Easing.Expo
 */

module.exports = {

    In: __webpack_require__(88),
    Out: __webpack_require__(89),
    InOut: __webpack_require__(90)

};


/***/ }),
/* 88 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Exponential ease-in.
 *
 * @function Phaser.Math.Easing.Expo.In
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 *
 * @return {number} The tweened value.
 */
var In = function (v)
{
    return Math.pow(2, 10 * (v - 1)) - 0.001;
};

module.exports = In;


/***/ }),
/* 89 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Exponential ease-out.
 *
 * @function Phaser.Math.Easing.Expo.Out
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 *
 * @return {number} The tweened value.
 */
var Out = function (v)
{
    return 1 - Math.pow(2, -10 * v);
};

module.exports = Out;


/***/ }),
/* 90 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Exponential ease-in/out.
 *
 * @function Phaser.Math.Easing.Expo.InOut
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 *
 * @return {number} The tweened value.
 */
var InOut = function (v)
{
    if ((v *= 2) < 1)
    {
        return 0.5 * Math.pow(2, 10 * (v - 1));
    }
    else
    {
        return 0.5 * (2 - Math.pow(2, -10 * (v - 1)));
    }
};

module.exports = InOut;


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

module.exports = __webpack_require__(92);


/***/ }),
/* 92 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Linear easing (no variation).
 *
 * @function Phaser.Math.Easing.Linear
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 *
 * @return {number} The tweened value.
 */
var Linear = function (v)
{
    return v;
};

module.exports = Linear;


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Math.Easing.Quadratic
 */

module.exports = {

    In: __webpack_require__(94),
    Out: __webpack_require__(95),
    InOut: __webpack_require__(96)

};


/***/ }),
/* 94 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Quadratic ease-in.
 *
 * @function Phaser.Math.Easing.Quadratic.In
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 *
 * @return {number} The tweened value.
 */
var In = function (v)
{
    return v * v;
};

module.exports = In;


/***/ }),
/* 95 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Quadratic ease-out.
 *
 * @function Phaser.Math.Easing.Quadratic.Out
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 *
 * @return {number} The tweened value.
 */
var Out = function (v)
{
    return v * (2 - v);
};

module.exports = Out;


/***/ }),
/* 96 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Quadratic ease-in/out.
 *
 * @function Phaser.Math.Easing.Quadratic.InOut
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 *
 * @return {number} The tweened value.
 */
var InOut = function (v)
{
    if ((v *= 2) < 1)
    {
        return 0.5 * v * v;
    }
    else
    {
        return -0.5 * (--v * (v - 2) - 1);
    }
};

module.exports = InOut;


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Math.Easing.Quartic
 */

module.exports = {

    In: __webpack_require__(98),
    Out: __webpack_require__(99),
    InOut: __webpack_require__(100)

};


/***/ }),
/* 98 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Quartic ease-in.
 *
 * @function Phaser.Math.Easing.Quartic.In
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 *
 * @return {number} The tweened value.
 */
var In = function (v)
{
    return v * v * v * v;
};

module.exports = In;


/***/ }),
/* 99 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Quartic ease-out.
 *
 * @function Phaser.Math.Easing.Quartic.Out
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 *
 * @return {number} The tweened value.
 */
var Out = function (v)
{
    return 1 - (--v * v * v * v);
};

module.exports = Out;


/***/ }),
/* 100 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Quartic ease-in/out.
 *
 * @function Phaser.Math.Easing.Quartic.InOut
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 *
 * @return {number} The tweened value.
 */
var InOut = function (v)
{
    if ((v *= 2) < 1)
    {
        return 0.5 * v * v * v * v;
    }
    else
    {
        return -0.5 * ((v -= 2) * v * v * v - 2);
    }
};

module.exports = InOut;


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Math.Easing.Quintic
 */

module.exports = {

    In: __webpack_require__(102),
    Out: __webpack_require__(103),
    InOut: __webpack_require__(104)

};


/***/ }),
/* 102 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Quintic ease-in.
 *
 * @function Phaser.Math.Easing.Quintic.In
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 *
 * @return {number} The tweened value.
 */
var In = function (v)
{
    return v * v * v * v * v;
};

module.exports = In;


/***/ }),
/* 103 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Quintic ease-out.
 *
 * @function Phaser.Math.Easing.Quintic.Out
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 *
 * @return {number} The tweened value.
 */
var Out = function (v)
{
    return --v * v * v * v * v + 1;
};

module.exports = Out;


/***/ }),
/* 104 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Quintic ease-in/out.
 *
 * @function Phaser.Math.Easing.Quintic.InOut
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 *
 * @return {number} The tweened value.
 */
var InOut = function (v)
{
    if ((v *= 2) < 1)
    {
        return 0.5 * v * v * v * v * v;
    }
    else
    {
        return 0.5 * ((v -= 2) * v * v * v * v + 2);
    }
};

module.exports = InOut;


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Math.Easing.Sine
 */

module.exports = {

    In: __webpack_require__(106),
    Out: __webpack_require__(107),
    InOut: __webpack_require__(108)

};


/***/ }),
/* 106 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Sinusoidal ease-in.
 *
 * @function Phaser.Math.Easing.Sine.In
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 *
 * @return {number} The tweened value.
 */
var In = function (v)
{
    if (v === 0)
    {
        return 0;
    }
    else if (v === 1)
    {
        return 1;
    }
    else
    {
        return 1 - Math.cos(v * Math.PI / 2);
    }
};

module.exports = In;


/***/ }),
/* 107 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Sinusoidal ease-out.
 *
 * @function Phaser.Math.Easing.Sine.Out
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 *
 * @return {number} The tweened value.
 */
var Out = function (v)
{
    if (v === 0)
    {
        return 0;
    }
    else if (v === 1)
    {
        return 1;
    }
    else
    {
        return Math.sin(v * Math.PI / 2);
    }
};

module.exports = Out;


/***/ }),
/* 108 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Sinusoidal ease-in/out.
 *
 * @function Phaser.Math.Easing.Sine.InOut
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 *
 * @return {number} The tweened value.
 */
var InOut = function (v)
{
    if (v === 0)
    {
        return 0;
    }
    else if (v === 1)
    {
        return 1;
    }
    else
    {
        return 0.5 * (1 - Math.cos(Math.PI * v));
    }
};

module.exports = InOut;


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Math.Easing.Stepped
 */

module.exports = __webpack_require__(110);


/***/ }),
/* 110 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Stepped easing.
 *
 * @function Phaser.Math.Easing.Stepped
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 * @param {number} [steps=1] - The number of steps in the ease.
 *
 * @return {number} The tweened value.
 */
var Stepped = function (v, steps)
{
    if (steps === undefined) { steps = 1; }

    if (v <= 0)
    {
        return 0;
    }
    else if (v >= 1)
    {
        return 1;
    }
    else
    {
        return (((steps * v) | 0) + 1) * (1 / steps);
    }
};

module.exports = Stepped;


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Math.Fuzzy
 */

module.exports = {

    Ceil: __webpack_require__(112),
    Equal: __webpack_require__(18),
    Floor: __webpack_require__(113),
    GreaterThan: __webpack_require__(114),
    LessThan: __webpack_require__(115)

};


/***/ }),
/* 112 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculate the fuzzy ceiling of the given value.
 *
 * @function Phaser.Math.Fuzzy.Ceil
 * @since 3.0.0
 *
 * @param {number} value - The value.
 * @param {number} [epsilon=0.0001] - The epsilon.
 *
 * @return {number} The fuzzy ceiling of the value.
 */
var Ceil = function (value, epsilon)
{
    if (epsilon === undefined) { epsilon = 0.0001; }

    return Math.ceil(value - epsilon);
};

module.exports = Ceil;


/***/ }),
/* 113 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculate the fuzzy floor of the given value.
 *
 * @function Phaser.Math.Fuzzy.Floor
 * @since 3.0.0
 *
 * @param {number} value - The value.
 * @param {number} [epsilon=0.0001] - The epsilon.
 *
 * @return {number} The floor of the value.
 */
var Floor = function (value, epsilon)
{
    if (epsilon === undefined) { epsilon = 0.0001; }

    return Math.floor(value + epsilon);
};

module.exports = Floor;


/***/ }),
/* 114 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Check whether `a` is fuzzily greater than `b`.
 *
 * `a` is fuzzily greater than `b` if it is more than `b - epsilon`.
 *
 * @function Phaser.Math.Fuzzy.GreaterThan
 * @since 3.0.0
 *
 * @param {number} a - The first value.
 * @param {number} b - The second value.
 * @param {number} [epsilon=0.0001] - The epsilon.
 *
 * @return {boolean} `true` if `a` is fuzzily greater than than `b`, otherwise `false`.
 */
var GreaterThan = function (a, b, epsilon)
{
    if (epsilon === undefined) { epsilon = 0.0001; }

    return a > b - epsilon;
};

module.exports = GreaterThan;


/***/ }),
/* 115 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Check whether `a` is fuzzily less than `b`.
 *
 * `a` is fuzzily less than `b` if it is less than `b + epsilon`.
 *
 * @function Phaser.Math.Fuzzy.LessThan
 * @since 3.0.0
 *
 * @param {number} a - The first value.
 * @param {number} b - The second value.
 * @param {number} [epsilon=0.0001] - The epsilon.
 *
 * @return {boolean} `true` if `a` is fuzzily less than `b`, otherwise `false`.
 */
var LessThan = function (a, b, epsilon)
{
    if (epsilon === undefined) { epsilon = 0.0001; }

    return a < b + epsilon;
};

module.exports = LessThan;


/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Math.Interpolation
 */

module.exports = {

    Bezier: __webpack_require__(117),
    CatmullRom: __webpack_require__(118),
    CubicBezier: __webpack_require__(119),
    Linear: __webpack_require__(120),
    QuadraticBezier: __webpack_require__(121),
    SmoothStep: __webpack_require__(122),
    SmootherStep: __webpack_require__(123)

};


/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Bernstein = __webpack_require__(19);

/**
 * A bezier interpolation method.
 *
 * @function Phaser.Math.Interpolation.Bezier
 * @since 3.0.0
 *
 * @param {number[]} v - The input array of values to interpolate between.
 * @param {number} k - The percentage of interpolation, between 0 and 1.
 *
 * @return {number} The interpolated value.
 */
var BezierInterpolation = function (v, k)
{
    var b = 0;
    var n = v.length - 1;

    for (var i = 0; i <= n; i++)
    {
        b += Math.pow(1 - k, n - i) * Math.pow(k, i) * v[i] * Bernstein(n, i);
    }

    return b;
};

module.exports = BezierInterpolation;


/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CatmullRom = __webpack_require__(21);

/**
 * A Catmull-Rom interpolation method.
 *
 * @function Phaser.Math.Interpolation.CatmullRom
 * @since 3.0.0
 *
 * @param {number[]} v - The input array of values to interpolate between.
 * @param {number} k - The percentage of interpolation, between 0 and 1.
 *
 * @return {number} The interpolated value.
 */
var CatmullRomInterpolation = function (v, k)
{
    var m = v.length - 1;
    var f = m * k;
    var i = Math.floor(f);

    if (v[0] === v[m])
    {
        if (k < 0)
        {
            i = Math.floor(f = m * (1 + k));
        }

        return CatmullRom(f - i, v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m]);
    }
    else
    {
        if (k < 0)
        {
            return v[0] - (CatmullRom(-f, v[0], v[0], v[1], v[1]) - v[0]);
        }

        if (k > 1)
        {
            return v[m] - (CatmullRom(f - m, v[m], v[m], v[m - 1], v[m - 1]) - v[m]);
        }

        return CatmullRom(f - i, v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2]);
    }
};

module.exports = CatmullRomInterpolation;


/***/ }),
/* 119 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @ignore
 */
function P0 (t, p)
{
    var k = 1 - t;

    return k * k * k * p;
}

/**
 * @ignore
 */
function P1 (t, p)
{
    var k = 1 - t;

    return 3 * k * k * t * p;
}

/**
 * @ignore
 */
function P2 (t, p)
{
    return 3 * (1 - t) * t * t * p;
}

/**
 * @ignore
 */
function P3 (t, p)
{
    return t * t * t * p;
}

/**
 * A cubic bezier interpolation method.
 *
 * https://medium.com/@adrian_cooney/bezier-interpolation-13b68563313a
 *
 * @function Phaser.Math.Interpolation.CubicBezier
 * @since 3.0.0
 *
 * @param {number} t - The percentage of interpolation, between 0 and 1.
 * @param {number} p0 - The start point.
 * @param {number} p1 - The first control point.
 * @param {number} p2 - The second control point.
 * @param {number} p3 - The end point.
 *
 * @return {number} The interpolated value.
 */
var CubicBezierInterpolation = function (t, p0, p1, p2, p3)
{
    return P0(t, p0) + P1(t, p1) + P2(t, p2) + P3(t, p3);
};

module.exports = CubicBezierInterpolation;


/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Linear = __webpack_require__(22);

/**
 * A linear interpolation method.
 *
 * @function Phaser.Math.Interpolation.Linear
 * @since 3.0.0
 * @see {@link https://en.wikipedia.org/wiki/Linear_interpolation}
 *
 * @param {number[]} v - The input array of values to interpolate between.
 * @param {!number} k - The percentage of interpolation, between 0 and 1.
 *
 * @return {!number} The interpolated value.
 */
var LinearInterpolation = function (v, k)
{
    var m = v.length - 1;
    var f = m * k;
    var i = Math.floor(f);

    if (k < 0)
    {
        return Linear(v[0], v[1], f);
    }
    else if (k > 1)
    {
        return Linear(v[m], v[m - 1], m - f);
    }
    else
    {
        return Linear(v[i], v[(i + 1 > m) ? m : i + 1], f - i);
    }
};

module.exports = LinearInterpolation;


/***/ }),
/* 121 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @ignore
 */
function P0 (t, p)
{
    var k = 1 - t;

    return k * k * p;
}

/**
 * @ignore
 */
function P1 (t, p)
{
    return 2 * (1 - t) * t * p;
}

/**
 * @ignore
 */
function P2 (t, p)
{
    return t * t * p;
}

// https://github.com/mrdoob/three.js/blob/master/src/extras/core/Interpolations.js

/**
 * A quadratic bezier interpolation method.
 *
 * @function Phaser.Math.Interpolation.QuadraticBezier
 * @since 3.2.0
 *
 * @param {number} t - The percentage of interpolation, between 0 and 1.
 * @param {number} p0 - The start point.
 * @param {number} p1 - The control point.
 * @param {number} p2 - The end point.
 *
 * @return {number} The interpolated value.
 */
var QuadraticBezierInterpolation = function (t, p0, p1, p2)
{
    return P0(t, p0) + P1(t, p1) + P2(t, p2);
};

module.exports = QuadraticBezierInterpolation;


/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var SmoothStep = __webpack_require__(23);

/**
 * A Smooth Step interpolation method.
 *
 * @function Phaser.Math.Interpolation.SmoothStep
 * @since 3.9.0
 * @see {@link https://en.wikipedia.org/wiki/Smoothstep}
 *
 * @param {number} t - The percentage of interpolation, between 0 and 1.
 * @param {number} min - The minimum value, also known as the 'left edge', assumed smaller than the 'right edge'.
 * @param {number} max - The maximum value, also known as the 'right edge', assumed greater than the 'left edge'.
 *
 * @return {number} The interpolated value.
 */
var SmoothStepInterpolation = function (t, min, max)
{
    return min + (max - min) * SmoothStep(t, 0, 1);
};

module.exports = SmoothStepInterpolation;


/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var SmootherStep = __webpack_require__(24);

/**
 * A Smoother Step interpolation method.
 *
 * @function Phaser.Math.Interpolation.SmootherStep
 * @since 3.9.0
 * @see {@link https://en.wikipedia.org/wiki/Smoothstep#Variations}
 *
 * @param {number} t - The percentage of interpolation, between 0 and 1.
 * @param {number} min - The minimum value, also known as the 'left edge', assumed smaller than the 'right edge'.
 * @param {number} max - The maximum value, also known as the 'right edge', assumed greater than the 'left edge'.
 *
 * @return {number} The interpolated value.
 */
var SmootherStepInterpolation = function (t, min, max)
{
    return min + (max - min) * SmootherStep(t, 0, 1);
};

module.exports = SmootherStepInterpolation;


/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Math.Pow2
 */

module.exports = {

    GetNext: __webpack_require__(125),
    IsSize: __webpack_require__(126),
    IsValue: __webpack_require__(127)

};


/***/ }),
/* 125 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Returns the nearest power of 2 to the given `value`.
 *
 * @function Phaser.Math.Pow2.GetNext
 * @since 3.0.0
 *
 * @param {number} value - The value.
 *
 * @return {integer} The nearest power of 2 to `value`.
 */
var GetPowerOfTwo = function (value)
{
    var index = Math.log(value) / 0.6931471805599453;

    return (1 << Math.ceil(index));
};

module.exports = GetPowerOfTwo;


/***/ }),
/* 126 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Checks if the given `width` and `height` are a power of two.
 * Useful for checking texture dimensions.
 *
 * @function Phaser.Math.Pow2.IsSize
 * @since 3.0.0
 *
 * @param {number} width - The width.
 * @param {number} height - The height.
 *
 * @return {boolean} `true` if `width` and `height` are a power of two, otherwise `false`.
 */
var IsSizePowerOfTwo = function (width, height)
{
    return (width > 0 && (width & (width - 1)) === 0 && height > 0 && (height & (height - 1)) === 0);
};

module.exports = IsSizePowerOfTwo;


/***/ }),
/* 127 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Tests the value and returns `true` if it is a power of two.
 *
 * @function Phaser.Math.Pow2.IsValue
 * @since 3.0.0
 *
 * @param {number} value - The value to check if it's a power of two.
 *
 * @return {boolean} Returns `true` if `value` is a power of two, otherwise `false`.
 */
var IsValuePowerOfTwo = function (value)
{
    return (value > 0 && (value & (value - 1)) === 0);
};

module.exports = IsValuePowerOfTwo;


/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Math.Snap
 */

module.exports = {

    Ceil: __webpack_require__(129),
    Floor: __webpack_require__(130),
    To: __webpack_require__(131)

};


/***/ }),
/* 129 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Snap a value to nearest grid slice, using ceil.
 *
 * Example: if you have an interval gap of `5` and a position of `12`... you will snap to `15`.
 * As will `14` snap to `15`... but `16` will snap to `20`.
 *
 * @function Phaser.Math.Snap.Ceil
 * @since 3.0.0
 *
 * @param {number} value - The value to snap.
 * @param {number} gap - The interval gap of the grid.
 * @param {number} [start=0] - Optional starting offset for gap.
 * @param {boolean} [divide=false] - If `true` it will divide the snapped value by the gap before returning.
 *
 * @return {number} The snapped value.
 */
var SnapCeil = function (value, gap, start, divide)
{
    if (start === undefined) { start = 0; }

    if (gap === 0)
    {
        return value;
    }

    value -= start;
    value = gap * Math.ceil(value / gap);

    return (divide) ? (start + value) / gap : start + value;
};

module.exports = SnapCeil;


/***/ }),
/* 130 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Snap a value to nearest grid slice, using floor.
 *
 * Example: if you have an interval gap of `5` and a position of `12`... you will snap to `10`.
 * As will `14` snap to `10`... but `16` will snap to `15`.
 *
 * @function Phaser.Math.Snap.Floor
 * @since 3.0.0
 *
 * @param {number} value - The value to snap.
 * @param {number} gap - The interval gap of the grid.
 * @param {number} [start=0] - Optional starting offset for gap.
 * @param {boolean} [divide=false] - If `true` it will divide the snapped value by the gap before returning.
 *
 * @return {number} The snapped value.
 */
var SnapFloor = function (value, gap, start, divide)
{
    if (start === undefined) { start = 0; }

    if (gap === 0)
    {
        return value;
    }

    value -= start;
    value = gap * Math.floor(value / gap);

    return (divide) ? (start + value) / gap : start + value;
};

module.exports = SnapFloor;


/***/ }),
/* 131 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Snap a value to nearest grid slice, using rounding.
 *
 * Example: if you have an interval gap of `5` and a position of `12`... you will snap to `10` whereas `14` will snap to `15`.
 *
 * @function Phaser.Math.Snap.To
 * @since 3.0.0
 *
 * @param {number} value - The value to snap.
 * @param {number} gap - The interval gap of the grid.
 * @param {number} [start=0] - Optional starting offset for gap.
 * @param {boolean} [divide=false] - If `true` it will divide the snapped value by the gap before returning.
 *
 * @return {number} The snapped value.
 */
var SnapTo = function (value, gap, start, divide)
{
    if (start === undefined) { start = 0; }

    if (gap === 0)
    {
        return value;
    }

    value -= start;
    value = gap * Math.round(value / gap);

    return (divide) ? (start + value) / gap : start + value;
};

module.exports = SnapTo;


/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
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
 * @memberof Phaser.Math
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
     * @generic T
     * @genericUse {T[]} - [array]
     * @genericUse {T} - [$return]
     *
     * @param {T[]} array - The array to pick a random element from.
     *
     * @return {T} A random member of the array.
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
     * @generic T
     * @genericUse {T[]} - [array]
     * @genericUse {T} - [$return]
     *
     * @param {T[]} array - The array to pick a random element from.
     *
     * @return {T} A random member of the array.
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
     * @generic T
     * @genericUse {T[]} - [array,$return]
     *
     * @param {T[]} [array] - The array to be shuffled.
     *
     * @return {T[]} The shuffled array.
     */
    shuffle: function (array)
    {
        var len = array.length - 1;

        for (var i = len; i > 0; i--)
        {
            var randomIndex = Math.floor(this.frac() * (i + 1));
            var itemAtIndex = array[randomIndex];

            array[randomIndex] = array[i];
            array[i] = itemAtIndex;
        }

        return array;
    }

});

module.exports = RandomDataGenerator;


/***/ }),
/* 133 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculate the mean average of the given values.
 *
 * @function Phaser.Math.Average
 * @since 3.0.0
 *
 * @param {number[]} values - The values to average.
 *
 * @return {number} The average value.
 */
var Average = function (values)
{
    var sum = 0;

    for (var i = 0; i < values.length; i++)
    {
        sum += (+values[i]);
    }

    return sum / values.length;
};

module.exports = Average;


/***/ }),
/* 134 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Compute a random integer between the `min` and `max` values, inclusive.
 *
 * @function Phaser.Math.Between
 * @since 3.0.0
 *
 * @param {integer} min - The minimum value.
 * @param {integer} max - The maximum value.
 *
 * @return {integer} The random integer.
 */
var Between = function (min, max)
{
    return Math.floor(Math.random() * (max - min + 1) + min);
};

module.exports = Between;


/***/ }),
/* 135 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Ceils to some place comparative to a `base`, default is 10 for decimal place.
 *
 * The `place` is represented by the power applied to `base` to get that place.
 *
 * @function Phaser.Math.CeilTo
 * @since 3.0.0
 *
 * @param {number} value - The value to round.
 * @param {number} [place=0] - The place to round to.
 * @param {integer} [base=10] - The base to round in. Default is 10 for decimal.
 *
 * @return {number} The rounded value.
 */
var CeilTo = function (value, place, base)
{
    if (place === undefined) { place = 0; }
    if (base === undefined) { base = 10; }

    var p = Math.pow(base, -place);

    return Math.ceil(value * p) / p;
};

module.exports = CeilTo;


/***/ }),
/* 136 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculates the positive difference of two given numbers.
 *
 * @function Phaser.Math.Difference
 * @since 3.0.0
 *
 * @param {number} a - The first number in the calculation.
 * @param {number} b - The second number in the calculation.
 *
 * @return {number} The positive difference of the two given numbers.
 */
var Difference = function (a, b)
{
    return Math.abs(a - b);
};

module.exports = Difference;


/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Clamp = __webpack_require__(4);
var Class = __webpack_require__(0);
var Matrix4 = __webpack_require__(6);
var NOOP = __webpack_require__(7);

var tempMatrix = new Matrix4();

/**
 * @classdesc
 *
 * @class Euler
 * @memberof Phaser.Math
 * @constructor
 * @since 3.50.0
 *
 * @param {number} [x] - The x component.
 * @param {number} [y] - The y component.
 * @param {number} [z] - The z component.
 */
var Euler = new Class({

    initialize:

    function Euler (x, y, z, order)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (z === undefined) { z = 0; }
        if (order === undefined) { order = Euler.DefaultOrder; }

        this._x = x;
        this._y = y;
        this._z = z;
        this._order = order;

        this.onChangeCallback = NOOP;
    },

    x: {
        get: function ()
        {
            return this._x;
        },

        set: function (value)
        {
            this._x = value;

            this.onChangeCallback(this);
        }
    },

    y: {
        get: function ()
        {
            return this._y;
        },

        set: function (value)
        {
            this._y = value;

            this.onChangeCallback(this);
        }
    },

    z: {
        get: function ()
        {
            return this._z;
        },

        set: function (value)
        {
            this._z = value;

            this.onChangeCallback(this);
        }
    },

    order: {
        get: function ()
        {
            return this._order;
        },

        set: function (value)
        {
            this._order = value;

            this.onChangeCallback(this);
        }
    },

    set: function (x, y, z, order)
    {
        if (order === undefined) { order = this._order; }

        this._x = x;
        this._y = y;
        this._z = z;
        this._order = order;

        this.onChangeCallback(this);

        return this;
    },

    copy: function (euler)
    {
        return this.set(euler.x, euler.y, euler.z, euler.order);
    },

    setFromQuaternion: function (quaternion, order, update)
    {
        if (order === undefined) { order = this._order; }
        if (update === undefined) { update = false; }

        tempMatrix.fromQuat(quaternion);

        return this.setFromRotationMatrix(tempMatrix, order, update);
    },

    setFromRotationMatrix: function (matrix, order, update)
    {
        if (order === undefined) { order = this._order; }
        if (update === undefined) { update = false; }

        var elements = matrix.val;

        //  Upper 3x3 of matrix is un-scaled rotation matrix
        var m11 = elements[0];
        var m12 = elements[4];
        var m13 = elements[8];
        var m21 = elements[1];
        var m22 = elements[5];
        var m23 = elements[9];
        var m31 = elements[2];
        var m32 = elements[6];
        var m33 = elements[10];

        var x = 0;
        var y = 0;
        var z = 0;
        var epsilon = 0.99999;

        switch (order)
        {
            case 'XYZ':
            {
                y = Math.asin(Clamp(m13, -1, 1));

                if (Math.abs(m13) < epsilon)
                {
                    x = Math.atan2(-m23, m33);
                    z = Math.atan2(-m12, m11);
                }
                else
                {
                    x = Math.atan2(m32, m22);
                }

                break;
            }

            case 'YXZ':
            {
                x = Math.asin(-Clamp(m23, -1, 1));

                if (Math.abs(m23) < epsilon)
                {
                    y = Math.atan2(m13, m33);
                    z = Math.atan2(m21, m22);
                }
                else
                {
                    y = Math.atan2(-m31, m11);
                }

                break;
            }

            case 'ZXY':
            {
                x = Math.asin(Clamp(m32, -1, 1));

                if (Math.abs(m32) < epsilon)
                {
                    y = Math.atan2(-m31, m33);
                    z = Math.atan2(-m12, m22);
                }
                else
                {
                    z = Math.atan2(m21, m11);
                }

                break;
            }

            case 'ZYX':
            {
                y = Math.asin(-Clamp(m31, -1, 1));

                if (Math.abs(m31) < epsilon)
                {
                    x = Math.atan2(m32, m33);
                    z = Math.atan2(m21, m11);
                }
                else
                {
                    z = Math.atan2(-m12, m22);
                }

                break;
            }

            case 'YZX':
            {
                z = Math.asin(Clamp(m21, -1, 1));

                if (Math.abs(m21) < epsilon)
                {
                    x = Math.atan2(-m23, m22);
                    y = Math.atan2(-m31, m11);
                }
                else
                {
                    y = Math.atan2(m13, m33);
                }

                break;
            }

            case 'XZY':
            {
                z = Math.asin(-Clamp(m12, -1, 1));

                if (Math.abs(m12) < epsilon)
                {
                    x = Math.atan2(m32, m22);
                    y = Math.atan2(m13, m11);
                }
                else
                {
                    x = Math.atan2(-m23, m33);
                }

                break;
            }
        }

        this._x = x;
        this._y = y;
        this._z = z;
        this._order = order;

        if (update)
        {
            this.onChangeCallback(this);
        }

        return this;
    }

});

Euler.RotationOrders = [ 'XYZ', 'YXZ', 'ZXY', 'ZYX', 'YZX', 'XZY' ];

Euler.DefaultOrder = 'XYZ';

module.exports = Euler;


/***/ }),
/* 138 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Floors to some place comparative to a `base`, default is 10 for decimal place.
 *
 * The `place` is represented by the power applied to `base` to get that place.
 *
 * @function Phaser.Math.FloorTo
 * @since 3.0.0
 *
 * @param {number} value - The value to round.
 * @param {integer} [place=0] - The place to round to.
 * @param {integer} [base=10] - The base to round in. Default is 10 for decimal.
 *
 * @return {number} The rounded value.
 */
var FloorTo = function (value, place, base)
{
    if (place === undefined) { place = 0; }
    if (base === undefined) { base = 10; }

    var p = Math.pow(base, -place);

    return Math.floor(value * p) / p;
};

module.exports = FloorTo;


/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Clamp = __webpack_require__(4);

/**
 * Return a value based on the range between `min` and `max` and the percentage given.
 *
 * @function Phaser.Math.FromPercent
 * @since 3.0.0
 *
 * @param {number} percent - A value between 0 and 1 representing the percentage.
 * @param {number} min - The minimum value.
 * @param {number} [max] - The maximum value.
 *
 * @return {number} The value that is `percent` percent between `min` and `max`.
 */
var FromPercent = function (percent, min, max)
{
    percent = Clamp(percent, 0, 1);

    return (max - min) * percent;
};

module.exports = FromPercent;


/***/ }),
/* 140 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculate a per-ms speed from a distance and time (given in seconds).
 *
 * @function Phaser.Math.GetSpeed
 * @since 3.0.0
 *
 * @param {number} distance - The distance.
 * @param {integer} time - The time, in seconds.
 *
 * @return {number} The speed, in distance per ms.
 *
 * @example
 * // 400px over 1 second is 0.4 px/ms
 * Phaser.Math.GetSpeed(400, 1) // -> 0.4
 */
var GetSpeed = function (distance, time)
{
    return (distance / time) / 1000;
};

module.exports = GetSpeed;


/***/ }),
/* 141 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Check if a given value is an even number.
 *
 * @function Phaser.Math.IsEven
 * @since 3.0.0
 *
 * @param {number} value - The number to perform the check with.
 *
 * @return {boolean} Whether the number is even or not.
 */
var IsEven = function (value)
{
    // Use abstract equality == for "is number" test

    // eslint-disable-next-line eqeqeq
    return (value == parseFloat(value)) ? !(value % 2) : void 0;
};

module.exports = IsEven;


/***/ }),
/* 142 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Check if a given value is an even number using a strict type check.
 *
 * @function Phaser.Math.IsEvenStrict
 * @since 3.0.0
 *
 * @param {number} value - The number to perform the check with.
 *
 * @return {boolean} Whether the number is even or not.
 */
var IsEvenStrict = function (value)
{
    // Use strict equality === for "is number" test
    return (value === parseFloat(value)) ? !(value % 2) : void 0;
};

module.exports = IsEvenStrict;


/***/ }),
/* 143 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Add an `amount` to a `value`, limiting the maximum result to `max`.
 *
 * @function Phaser.Math.MaxAdd
 * @since 3.0.0
 *
 * @param {number} value - The value to add to.
 * @param {number} amount - The amount to add.
 * @param {number} max - The maximum value to return.
 *
 * @return {number} The resulting value.
 */
var MaxAdd = function (value, amount, max)
{
    return Math.min(value + amount, max);
};

module.exports = MaxAdd;


/***/ }),
/* 144 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Subtract an `amount` from `value`, limiting the minimum result to `min`.
 *
 * @function Phaser.Math.MinSub
 * @since 3.0.0
 *
 * @param {number} value - The value to subtract from.
 * @param {number} amount - The amount to subtract.
 * @param {number} min - The minimum value to return.
 *
 * @return {number} The resulting value.
 */
var MinSub = function (value, amount, min)
{
    return Math.max(value - amount, min);
};

module.exports = MinSub;


/***/ }),
/* 145 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Work out what percentage `value` is of the range between `min` and `max`.
 * If `max` isn't given then it will return the percentage of `value` to `min`.
 *
 * You can optionally specify an `upperMax` value, which is a mid-way point in the range that represents 100%, after which the % starts to go down to zero again.
 *
 * @function Phaser.Math.Percent
 * @since 3.0.0
 *
 * @param {number} value - The value to determine the percentage of.
 * @param {number} min - The minimum value.
 * @param {number} [max] - The maximum value.
 * @param {number} [upperMax] - The mid-way point in the range that represents 100%.
 *
 * @return {number} A value between 0 and 1 representing the percentage.
 */
var Percent = function (value, min, max, upperMax)
{
    if (max === undefined) { max = min + 1; }

    var percentage = (value - min) / (max - min);

    if (percentage > 1)
    {
        if (upperMax !== undefined)
        {
            percentage = ((upperMax - value)) / (upperMax - max);

            if (percentage < 0)
            {
                percentage = 0;
            }
        }
        else
        {
            percentage = 1;
        }
    }
    else if (percentage < 0)
    {
        percentage = 0;
    }

    return percentage;
};

module.exports = Percent;


/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = __webpack_require__(2);

/**
 * Convert the given angle in radians, to the equivalent angle in degrees.
 *
 * @function Phaser.Math.RadToDeg
 * @since 3.0.0
 *
 * @param {number} radians - The angle in radians to convert ot degrees.
 *
 * @return {integer} The given angle converted to degrees.
 */
var RadToDeg = function (radians)
{
    return radians * CONST.RAD_TO_DEG;
};

module.exports = RadToDeg;


/***/ }),
/* 147 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Compute a random unit vector.
 *
 * Computes random values for the given vector between -1 and 1 that can be used to represent a direction.
 *
 * Optionally accepts a scale value to scale the resulting vector by.
 *
 * @function Phaser.Math.RandomXY
 * @since 3.0.0
 *
 * @param {Phaser.Math.Vector2} vector - The Vector to compute random values for.
 * @param {number} [scale=1] - The scale of the random values.
 *
 * @return {Phaser.Math.Vector2} The given Vector.
 */
var RandomXY = function (vector, scale)
{
    if (scale === undefined) { scale = 1; }

    var r = Math.random() * 2 * Math.PI;

    vector.x = Math.cos(r) * scale;
    vector.y = Math.sin(r) * scale;

    return vector;
};

module.exports = RandomXY;


/***/ }),
/* 148 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Rotate a given point by a given angle around the origin (0, 0), in an anti-clockwise direction.
 *
 * @function Phaser.Math.Rotate
 * @since 3.0.0
 *
 * @param {(Phaser.Geom.Point|object)} point - The point to be rotated.
 * @param {number} angle - The angle to be rotated by in an anticlockwise direction.
 *
 * @return {Phaser.Geom.Point} The given point, rotated by the given angle in an anticlockwise direction.
 */
var Rotate = function (point, angle)
{
    var x = point.x;
    var y = point.y;

    point.x = (x * Math.cos(angle)) - (y * Math.sin(angle));
    point.y = (x * Math.sin(angle)) + (y * Math.cos(angle));

    return point;
};

module.exports = Rotate;


/***/ }),
/* 149 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Rotate a `point` around `x` and `y` by the given `angle` and `distance`.
 *
 * In polar notation, this maps a point from (r, t) to (distance, t + angle), vs. the origin (x, y).
 *
 * @function Phaser.Math.RotateAroundDistance
 * @since 3.0.0
 *
 * @generic {Phaser.Types.Math.Vector2Like} T - [point,$return]
 *
 * @param {(Phaser.Geom.Point|object)} point - The point to be rotated.
 * @param {number} x - The horizontal coordinate to rotate around.
 * @param {number} y - The vertical coordinate to rotate around.
 * @param {number} angle - The angle of rotation in radians.
 * @param {number} distance - The distance from (x, y) to place the point at.
 *
 * @return {Phaser.Types.Math.Vector2Like} The given point.
 */
var RotateAroundDistance = function (point, x, y, angle, distance)
{
    var t = angle + Math.atan2(point.y - y, point.x - x);

    point.x = x + (distance * Math.cos(t));
    point.y = y + (distance * Math.sin(t));

    return point;
};

module.exports = RotateAroundDistance;


/***/ }),
/* 150 */
/***/ (function(module, exports) {

/**
 * @author       samme
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Position a `point` at the given `angle` and `distance` to (`x`, `y`).
 *
 * @function Phaser.Math.RotateTo
 * @since 3.24.0
 *
 * @generic {Phaser.Types.Math.Vector2Like} T - [point,$return]
 *
 * @param {Phaser.Types.Math.Vector2Like} point - The point to be positioned.
 * @param {number} x - The horizontal coordinate to position from.
 * @param {number} y - The vertical coordinate to position from.
 * @param {number} angle - The angle of rotation in radians.
 * @param {number} distance - The distance from (x, y) to place the point at.
 *
 * @return {Phaser.Types.Math.Vector2Like} The given point.
 */
var RotateTo = function (point, x, y, angle, distance)
{
    point.x = x + (distance * Math.cos(angle));
    point.y = y + (distance * Math.sin(angle));

    return point;
};

module.exports = RotateTo;


/***/ }),
/* 151 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Round a given number so it is further away from zero. That is, positive numbers are rounded up, and negative numbers are rounded down.
 *
 * @function Phaser.Math.RoundAwayFromZero
 * @since 3.0.0
 *
 * @param {number} value - The number to round.
 *
 * @return {number} The rounded number, rounded away from zero.
 */
var RoundAwayFromZero = function (value)
{
    // "Opposite" of truncate.
    return (value > 0) ? Math.ceil(value) : Math.floor(value);
};

module.exports = RoundAwayFromZero;


/***/ }),
/* 152 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Round a value to the given precision.
 * 
 * For example:
 * 
 * ```javascript
 * RoundTo(123.456, 0) = 123
 * RoundTo(123.456, 1) = 120
 * RoundTo(123.456, 2) = 100
 * ```
 * 
 * To round the decimal, i.e. to round to precision, pass in a negative `place`:
 * 
 * ```javascript
 * RoundTo(123.456789, 0) = 123
 * RoundTo(123.456789, -1) = 123.5
 * RoundTo(123.456789, -2) = 123.46
 * RoundTo(123.456789, -3) = 123.457
 * ```
 *
 * @function Phaser.Math.RoundTo
 * @since 3.0.0
 *
 * @param {number} value - The value to round.
 * @param {integer} [place=0] - The place to round to. Positive to round the units, negative to round the decimal.
 * @param {integer} [base=10] - The base to round in. Default is 10 for decimal.
 *
 * @return {number} The rounded value.
 */
var RoundTo = function (value, place, base)
{
    if (place === undefined) { place = 0; }
    if (base === undefined) { base = 10; }

    var p = Math.pow(base, -place);

    return Math.round(value * p) / p;
};

module.exports = RoundTo;


/***/ }),
/* 153 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Generate a series of sine and cosine values.
 *
 * @function Phaser.Math.SinCosTableGenerator
 * @since 3.0.0
 *
 * @param {number} length - The number of values to generate.
 * @param {number} [sinAmp=1] - The sine value amplitude.
 * @param {number} [cosAmp=1] - The cosine value amplitude.
 * @param {number} [frequency=1] - The frequency of the values.
 *
 * @return {Phaser.Types.Math.SinCosTable} The generated values.
 */
var SinCosTableGenerator = function (length, sinAmp, cosAmp, frequency)
{
    if (sinAmp === undefined) { sinAmp = 1; }
    if (cosAmp === undefined) { cosAmp = 1; }
    if (frequency === undefined) { frequency = 1; }

    frequency *= Math.PI / length;

    var cos = [];
    var sin = [];

    for (var c = 0; c < length; c++)
    {
        cosAmp -= sinAmp * frequency;
        sinAmp += cosAmp * frequency;

        cos[c] = cosAmp;
        sin[c] = sinAmp;
    }

    return {
        sin: sin,
        cos: cos,
        length: length
    };
};

module.exports = SinCosTableGenerator;


/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Vector2 = __webpack_require__(1);

/**
 * Returns a Vector2 containing the x and y position of the given index in a `width` x `height` sized grid.
 * 
 * For example, in a 6 x 4 grid, index 16 would equal x: 4 y: 2.
 * 
 * If the given index is out of range an empty Vector2 is returned.
 *
 * @function Phaser.Math.ToXY
 * @since 3.19.0
 *
 * @param {integer} index - The position within the grid to get the x/y value for.
 * @param {integer} width - The width of the grid.
 * @param {integer} height - The height of the grid.
 * @param {Phaser.Math.Vector2} [out] - An optional Vector2 to store the result in. If not given, a new Vector2 instance will be created.
 *
 * @return {Phaser.Math.Vector2} A Vector2 where the x and y properties contain the given grid index.
 */
var ToXY = function (index, width, height, out)
{
    if (out === undefined) { out = new Vector2(); }

    var x = 0;
    var y = 0;
    var total = width * height;

    if (index > 0 && index <= total)
    {
        if (index > width - 1)
        {
            y = Math.floor(index / width);
            x = index - (y * width);
        }
        else
        {
            x = index;
        }

        out.set(x, y);
    }

    return out;
};

module.exports = ToXY;


/***/ }),
/* 155 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Checks if the two values are within the given `tolerance` of each other.
 *
 * @function Phaser.Math.Within
 * @since 3.0.0
 *
 * @param {number} a - The first value to use in the calculation.
 * @param {number} b - The second value to use in the calculation.
 * @param {number} tolerance - The tolerance. Anything equal to or less than this value is considered as being within range.
 *
 * @return {boolean} Returns `true` if `a` is less than or equal to the tolerance of `b`.
 */
var Within = function (a, b, tolerance)
{
    return (Math.abs(a - b) <= tolerance);
};

module.exports = Within;


/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetAdvancedValue = __webpack_require__(8);

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

        if (key)
        {
            var startFrame = GetAdvancedValue(animConfig, 'startFrame', undefined);

            var delay = GetAdvancedValue(animConfig, 'delay', 0);
            var repeat = GetAdvancedValue(animConfig, 'repeat', 0);
            var repeatDelay = GetAdvancedValue(animConfig, 'repeatDelay', 0);
            var yoyo = GetAdvancedValue(animConfig, 'yoyo', false);

            var play = GetAdvancedValue(animConfig, 'play', false);
            var delayedPlay = GetAdvancedValue(animConfig, 'delayedPlay', 0);

            var playConfig = {
                key: key,
                delay: delay,
                repeat: repeat,
                repeatDelay: repeatDelay,
                yoyo: yoyo,
                startFrame: startFrame
            };

            if (play)
            {
                anims.play(playConfig);
            }
            else if (delayedPlay > 0)
            {
                anims.playAfterDelay(playConfig, delayedPlay);
            }
            else
            {
                anims.load(playConfig);
            }
        }
    }

    return sprite;
};

module.exports = BuildGameObjectAnimation;


/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Camera = __webpack_require__(33);
var Class = __webpack_require__(0);
var Vector3 = __webpack_require__(3);

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
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = __webpack_require__(0);

/**
 * @callback EachSetCallback<E>
 *
 * @param {E} entry - The Set entry.
 * @param {number} index - The index of the entry within the Set.
 *
 * @return {?boolean} The callback result.
 */

/**
 * @classdesc
 * A Set is a collection of unique elements.
 *
 * @class Set
 * @memberof Phaser.Structs
 * @constructor
 * @since 3.0.0
 *
 * @generic T
 * @genericUse {T[]} - [elements]
 *
 * @param {Array.<*>} [elements] - An optional array of elements to insert into this Set.
 */
var Set = new Class({

    initialize:

    function Set (elements)
    {
        /**
         * The entries of this Set. Stored internally as an array.
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
     * Inserts the provided value into this Set. If the value is already contained in this Set this method will have no effect.
     *
     * @method Phaser.Structs.Set#set
     * @since 3.0.0
     *
     * @genericUse {T} - [value]
     * @genericUse {Phaser.Structs.Set.<T>} - [$return]
     *
     * @param {*} value - The value to insert into this Set.
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
     * Get an element of this Set which has a property of the specified name, if that property is equal to the specified value.
     * If no elements of this Set satisfy the condition then this method will return `null`.
     *
     * @method Phaser.Structs.Set#get
     * @since 3.0.0
     *
     * @genericUse {T} - [value,$return]
     *
     * @param {string} property - The property name to check on the elements of this Set.
     * @param {*} value - The value to check for.
     *
     * @return {*} The first element of this Set that meets the required condition, or `null` if this Set contains no elements that meet the condition.
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
     * Returns an array containing all the values in this Set.
     *
     * @method Phaser.Structs.Set#getArray
     * @since 3.0.0
     *
     * @genericUse {T[]} - [$return]
     *
     * @return {Array.<*>} An array containing all the values in this Set.
     */
    getArray: function ()
    {
        return this.entries.slice(0);
    },

    /**
     * Removes the given value from this Set if this Set contains that value.
     *
     * @method Phaser.Structs.Set#delete
     * @since 3.0.0
     *
     * @genericUse {T} - [value]
     * @genericUse {Phaser.Structs.Set.<T>} - [$return]
     *
     * @param {*} value - The value to remove from the Set.
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
     * Dumps the contents of this Set to the console via `console.group`.
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
     * Passes each value in this Set to the given callback.
     * Use this function when you know this Set will be modified during the iteration, otherwise use `iterate`.
     *
     * @method Phaser.Structs.Set#each
     * @since 3.0.0
     *
     * @genericUse {EachSetCallback.<T>} - [callback]
     * @genericUse {Phaser.Structs.Set.<T>} - [$return]
     *
     * @param {EachSetCallback} callback - The callback to be invoked and passed each value this Set contains.
     * @param {*} [callbackScope] - The scope of the callback.
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
     * Passes each value in this Set to the given callback.
     * For when you absolutely know this Set won't be modified during the iteration.
     *
     * @method Phaser.Structs.Set#iterate
     * @since 3.0.0
     *
     * @genericUse {EachSetCallback.<T>} - [callback]
     * @genericUse {Phaser.Structs.Set.<T>} - [$return]
     *
     * @param {EachSetCallback} callback - The callback to be invoked and passed each value this Set contains.
     * @param {*} [callbackScope] - The scope of the callback.
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
     * Goes through each entry in this Set and invokes the given function on them, passing in the arguments.
     *
     * @method Phaser.Structs.Set#iterateLocal
     * @since 3.0.0
     *
     * @genericUse {Phaser.Structs.Set.<T>} - [$return]
     *
     * @param {string} callbackKey - The key of the function to be invoked on each Set entry.
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
     * Clears this Set so that it no longer contains any values.
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
     * Returns `true` if this Set contains the given value, otherwise returns `false`.
     *
     * @method Phaser.Structs.Set#contains
     * @since 3.0.0
     *
     * @genericUse {T} - [value]
     *
     * @param {*} value - The value to check for in this Set.
     *
     * @return {boolean} `true` if the given value was found in this Set, otherwise `false`.
     */
    contains: function (value)
    {
        return (this.entries.indexOf(value) > -1);
    },

    /**
     * Returns a new Set containing all values that are either in this Set or in the Set provided as an argument.
     *
     * @method Phaser.Structs.Set#union
     * @since 3.0.0
     *
     * @genericUse {Phaser.Structs.Set.<T>} - [set,$return]
     *
     * @param {Phaser.Structs.Set} set - The Set to perform the union with.
     *
     * @return {Phaser.Structs.Set} A new Set containing all the values in this Set and the Set provided as an argument.
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
     * Returns a new Set that contains only the values which are in this Set and that are also in the given Set.
     *
     * @method Phaser.Structs.Set#intersect
     * @since 3.0.0
     *
     * @genericUse {Phaser.Structs.Set.<T>} - [set,$return]
     *
     * @param {Phaser.Structs.Set} set - The Set to intersect this set with.
     *
     * @return {Phaser.Structs.Set} The result of the intersection, as a new Set.
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
     * Returns a new Set containing all the values in this Set which are *not* also in the given Set.
     *
     * @method Phaser.Structs.Set#difference
     * @since 3.0.0
     *
     * @genericUse {Phaser.Structs.Set.<T>} - [set,$return]
     *
     * @param {Phaser.Structs.Set} set - The Set to perform the difference with.
     *
     * @return {Phaser.Structs.Set} A new Set containing all the values in this Set that are not also in the Set provided as an argument to this method.
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
     * The size of this Set. This is the number of entries within it.
     * Changing the size will truncate the Set if the given value is smaller than the current size.
     * Increasing the size larger than the current size has no effect.
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
            if (value < this.entries.length)
            {
                return this.entries.length = value;
            }
            else
            {
                return this.entries.length;
            }
        }

    }

});

module.exports = Set;


/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = __webpack_require__(0);
var Events = __webpack_require__(160);

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
 * The Data Manager Component features a means to store pieces of data specific to a Game Object, System or Plugin.
 * You can then search, query it, and retrieve the data. The parent must either extend EventEmitter,
 * or have a property called `events` that is an instance of it.
 *
 * @class DataManager
 * @memberof Phaser.Data
 * @constructor
 * @since 3.0.0
 *
 * @param {object} parent - The object that this DataManager belongs to.
 * @param {Phaser.Events.EventEmitter} [eventEmitter] - The DataManager's event emitter.
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
         * Do not modify this object directly. Adding properties directly to this object will not
         * emit any events. Always use `DataManager.set` to create new items the first time around.
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
            this.events.once(Events.DESTROY, this.destroy, this);
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
     * For example, if you updated an existing key called `PlayerLives` then it would emit the event `changedata-PlayerLives`.
     * These events will be emitted regardless if you use this method to set the value, or the direct `values` setter.
     *
     * Please note that the data keys are case-sensitive and must be valid JavaScript Object property strings.
     * This means the keys `gold` and `Gold` are treated as two unique values within the Data Manager.
     *
     * @method Phaser.Data.DataManager#set
     * @fires Phaser.Data.Events#SET_DATA
     * @fires Phaser.Data.Events#CHANGE_DATA
     * @fires Phaser.Data.Events#CHANGE_DATA_KEY
     * @since 3.0.0
     *
     * @param {(string|object)} key - The key to set the value for. Or an object or key value pairs. If an object the `data` argument is ignored.
     * @param {*} data - The value to set for the given key. If an object is provided as the key this argument is ignored.
     *
     * @return {this} This DataManager object.
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
     * Increase a value for the given key. If the key doesn't already exist in the Data Manager then it is increased from 0.
     *
     * When the value is first set, a `setdata` event is emitted.
     *
     * @method Phaser.Data.DataManager#inc
     * @fires Phaser.Data.Events#SET_DATA
     * @fires Phaser.Data.Events#CHANGE_DATA
     * @fires Phaser.Data.Events#CHANGE_DATA_KEY
     * @since 3.23.0
     *
     * @param {(string|object)} key - The key to increase the value for.
     * @param {*} [data] - The value to increase for the given key.
     *
     * @return {Phaser.Data.DataManager} This DataManager object.
     */
    inc: function (key, data)
    {
        if (this._frozen)
        {
            return this;
        }

        if (data === undefined)
        {
            data = 1;
        }

        var value = this.get(key);
        if (value === undefined)
        {
            value = 0;
        }

        this.set(key, (value + data));

        return this;
    },

    /**
     * Toggle a boolean value for the given key. If the key doesn't already exist in the Data Manager then it is toggled from false.
     *
     * When the value is first set, a `setdata` event is emitted.
     *
     * @method Phaser.Data.DataManager#toggle
     * @fires Phaser.Data.Events#SET_DATA
     * @fires Phaser.Data.Events#CHANGE_DATA
     * @fires Phaser.Data.Events#CHANGE_DATA_KEY
     * @since 3.23.0
     *
     * @param {(string|object)} key - The key to toggle the value for.
     *
     * @return {Phaser.Data.DataManager} This DataManager object.
     */
    toggle: function (key)
    {
        if (this._frozen)
        {
            return this;
        }

        this.set(key, !this.get(key));

        return this;
    },

    /**
     * Internal value setter, called automatically by the `set` method.
     *
     * @method Phaser.Data.DataManager#setValue
     * @fires Phaser.Data.Events#SET_DATA
     * @fires Phaser.Data.Events#CHANGE_DATA
     * @fires Phaser.Data.Events#CHANGE_DATA_KEY
     * @private
     * @since 3.10.0
     *
     * @param {string} key - The key to set the value for.
     * @param {*} data - The value to set.
     *
     * @return {this} This DataManager object.
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

                        events.emit(Events.CHANGE_DATA, parent, key, value, previousValue);
                        events.emit(Events.CHANGE_DATA_KEY + key, parent, value, previousValue);
                    }
                }

            });

            list[key] = data;

            events.emit(Events.SET_DATA, parent, key, data);
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
     * @return {this} This DataManager object.
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
     * @fires Phaser.Data.Events#SET_DATA
     * @fires Phaser.Data.Events#CHANGE_DATA
     * @fires Phaser.Data.Events#CHANGE_DATA_KEY
     * @since 3.0.0
     *
     * @param {Object.<string, *>} data - The data to merge.
     * @param {boolean} [overwrite=true] - Whether to overwrite existing data. Defaults to true.
     *
     * @return {this} This DataManager object.
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
     * @fires Phaser.Data.Events#REMOVE_DATA
     * @since 3.0.0
     *
     * @param {(string|string[])} key - The key to remove, or an array of keys to remove.
     *
     * @return {this} This DataManager object.
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
     * @fires Phaser.Data.Events#REMOVE_DATA
     * @since 3.10.0
     *
     * @param {string} key - The key to set the value for.
     *
     * @return {this} This DataManager object.
     */
    removeValue: function (key)
    {
        if (this.has(key))
        {
            var data = this.list[key];

            delete this.list[key];
            delete this.values[key];

            this.events.emit(Events.REMOVE_DATA, this.parent, key, data);
        }

        return this;
    },

    /**
     * Retrieves the data associated with the given 'key', deletes it from this Data Manager, then returns it.
     *
     * @method Phaser.Data.DataManager#pop
     * @fires Phaser.Data.Events#REMOVE_DATA
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

            this.events.emit(Events.REMOVE_DATA, this.parent, key, data);
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
     * @return {this} This DataManager object.
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
     * @return {this} This DataManager object.
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

        this.events.off(Events.CHANGE_DATA);
        this.events.off(Events.SET_DATA);
        this.events.off(Events.REMOVE_DATA);

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
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Data.Events
 */

module.exports = {

    CHANGE_DATA: __webpack_require__(161),
    CHANGE_DATA_KEY: __webpack_require__(162),
    DESTROY: __webpack_require__(163),
    REMOVE_DATA: __webpack_require__(164),
    SET_DATA: __webpack_require__(165)

};


/***/ }),
/* 161 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Change Data Event.
 * 
 * This event is dispatched by a Data Manager when an item in the data store is changed.
 * 
 * Game Objects with data enabled have an instance of a Data Manager under the `data` property. So, to listen for
 * a change data event from a Game Object you would use: `sprite.data.on('changedata', listener)`.
 * 
 * This event is dispatched for all items that change in the Data Manager.
 * To listen for the change of a specific item, use the `CHANGE_DATA_KEY_EVENT` event.
 *
 * @event Phaser.Data.Events#CHANGE_DATA
 * @since 3.0.0
 * 
 * @param {any} parent - A reference to the object that the Data Manager responsible for this event belongs to.
 * @param {string} key - The unique key of the data item within the Data Manager.
 * @param {any} value - The new value of the item in the Data Manager.
 * @param {any} previousValue - The previous value of the item in the Data Manager.
 */
module.exports = 'changedata';


/***/ }),
/* 162 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Change Data Key Event.
 * 
 * This event is dispatched by a Data Manager when an item in the data store is changed.
 * 
 * Game Objects with data enabled have an instance of a Data Manager under the `data` property. So, to listen for
 * the change of a specific data item from a Game Object you would use: `sprite.data.on('changedata-key', listener)`,
 * where `key` is the unique string key of the data item. For example, if you have a data item stored called `gold`
 * then you can listen for `sprite.data.on('changedata-gold')`.
 *
 * @event Phaser.Data.Events#CHANGE_DATA_KEY
 * @since 3.16.1
 * 
 * @param {any} parent - A reference to the object that owns the instance of the Data Manager responsible for this event.
 * @param {any} value - The item that was updated in the Data Manager. This can be of any data type, i.e. a string, boolean, number, object or instance.
 * @param {any} previousValue - The previous item that was updated in the Data Manager. This can be of any data type, i.e. a string, boolean, number, object or instance.
 */
module.exports = 'changedata-';


/***/ }),
/* 163 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Data Manager Destroy Event.
 *
 * The Data Manager will listen for the destroy event from its parent, and then close itself down.
 *
 * @event Phaser.Data.Events#DESTROY
 * @since 3.50.0
 */
module.exports = 'destroy';


/***/ }),
/* 164 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Remove Data Event.
 * 
 * This event is dispatched by a Data Manager when an item is removed from it.
 * 
 * Game Objects with data enabled have an instance of a Data Manager under the `data` property. So, to listen for
 * the removal of a data item on a Game Object you would use: `sprite.data.on('removedata', listener)`.
 *
 * @event Phaser.Data.Events#REMOVE_DATA
 * @since 3.0.0
 * 
 * @param {any} parent - A reference to the object that owns the instance of the Data Manager responsible for this event.
 * @param {string} key - The unique key of the data item within the Data Manager.
 * @param {any} data - The item that was removed from the Data Manager. This can be of any data type, i.e. a string, boolean, number, object or instance.
 */
module.exports = 'removedata';


/***/ }),
/* 165 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Set Data Event.
 * 
 * This event is dispatched by a Data Manager when a new item is added to the data store.
 * 
 * Game Objects with data enabled have an instance of a Data Manager under the `data` property. So, to listen for
 * the addition of a new data item on a Game Object you would use: `sprite.data.on('setdata', listener)`.
 *
 * @event Phaser.Data.Events#SET_DATA
 * @since 3.0.0
 * 
 * @param {any} parent - A reference to the object that owns the instance of the Data Manager responsible for this event.
 * @param {string} key - The unique key of the data item within the Data Manager.
 * @param {any} data - The item that was added to the Data Manager. This can be of any data type, i.e. a string, boolean, number, object or instance.
 */
module.exports = 'setdata';


/***/ }),
/* 166 */
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
/* 167 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Game Object Added to Scene Event.
 *
 * This event is dispatched when a Game Object is added to a Scene.
 *
 * Listen for it on a Game Object instance using `GameObject.on('addedtoscene', listener)`.
 *
 * @event Phaser.GameObjects.Events#ADDED_TO_SCENE
 * @since 3.50.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object that was added to the Scene.
 * @param {Phaser.Scene} scene - The Scene to which the Game Object was added.
 */
module.exports = 'addedtoscene';


/***/ }),
/* 168 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Game Object Destroy Event.
 * 
 * This event is dispatched when a Game Object instance is being destroyed.
 * 
 * Listen for it on a Game Object instance using `GameObject.on('destroy', listener)`.
 *
 * @event Phaser.GameObjects.Events#DESTROY
 * @since 3.0.0
 * 
 * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object which is being destroyed.
 */
module.exports = 'destroy';


/***/ }),
/* 169 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Game Object Removed from Scene Event.
 *
 * This event is dispatched when a Game Object is removed from a Scene.
 *
 * Listen for it on a Game Object instance using `GameObject.on('removedfromscene', listener)`.
 *
 * @event Phaser.GameObjects.Events#REMOVED_FROM_SCENE
 * @since 3.50.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object that was removed from the Scene.
 * @param {Phaser.Scene} scene - The Scene from which the Game Object was removed.
 */
module.exports = 'removedfromscene';


/***/ }),
/* 170 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Video Game Object Complete Event.
 * 
 * This event is dispatched when a Video finishes playback by reaching the end of its duration. It
 * is also dispatched if a video marker sequence is being played and reaches the end.
 * 
 * Note that not all videos can fire this event. Live streams, for example, have no fixed duration,
 * so never technically 'complete'.
 * 
 * If a video is stopped from playback, via the `Video.stop` method, it will emit the
 * `VIDEO_STOP` event instead of this one.
 * 
 * Listen for it from a Video Game Object instance using `Video.on('complete', listener)`.
 *
 * @event Phaser.GameObjects.Events#VIDEO_COMPLETE
 * @since 3.20.0
 * 
 * @param {Phaser.GameObjects.Video} video - The Video Game Object which completed playback.
 */
module.exports = 'complete';


/***/ }),
/* 171 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Video Game Object Created Event.
 * 
 * This event is dispatched when the texture for a Video has been created. This happens
 * when enough of the video source has been loaded that the browser is able to render a
 * frame from it.
 * 
 * Listen for it from a Video Game Object instance using `Video.on('created', listener)`.
 *
 * @event Phaser.GameObjects.Events#VIDEO_CREATED
 * @since 3.20.0
 * 
 * @param {Phaser.GameObjects.Video} video - The Video Game Object which raised the event.
 * @param {integer} width - The width of the video.
 * @param {integer} height - The height of the video.
 */
module.exports = 'created';


/***/ }),
/* 172 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Video Game Object Error Event.
 * 
 * This event is dispatched when a Video tries to play a source that does not exist, or is the wrong file type.
 * 
 * Listen for it from a Video Game Object instance using `Video.on('error', listener)`.
 *
 * @event Phaser.GameObjects.Events#VIDEO_ERROR
 * @since 3.20.0
 * 
 * @param {Phaser.GameObjects.Video} video - The Video Game Object which threw the error.
 * @param {Event} event - The native DOM event the browser raised during playback.
 */
module.exports = 'error';


/***/ }),
/* 173 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Video Game Object Loop Event.
 * 
 * This event is dispatched when a Video that is currently playing has looped. This only
 * happens if the `loop` parameter was specified, or the `setLoop` method was called,
 * and if the video has a fixed duration. Video streams, for example, cannot loop, as
 * they have no duration.
 * 
 * Looping is based on the result of the Video `timeupdate` event. This event is not
 * frame-accurate, due to the way browsers work, so please do not rely on this loop
 * event to be time or frame precise.
 * 
 * Listen for it from a Video Game Object instance using `Video.on('loop', listener)`.
 *
 * @event Phaser.GameObjects.Events#VIDEO_LOOP
 * @since 3.20.0
 * 
 * @param {Phaser.GameObjects.Video} video - The Video Game Object which has looped.
 */
module.exports = 'loop';


/***/ }),
/* 174 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Video Game Object Play Event.
 * 
 * This event is dispatched when a Video begins playback. For videos that do not require
 * interaction unlocking, this is usually as soon as the `Video.play` method is called.
 * However, for videos that require unlocking, it is fired once playback begins after
 * they've been unlocked.
 * 
 * Listen for it from a Video Game Object instance using `Video.on('play', listener)`.
 *
 * @event Phaser.GameObjects.Events#VIDEO_PLAY
 * @since 3.20.0
 * 
 * @param {Phaser.GameObjects.Video} video - The Video Game Object which started playback.
 */
module.exports = 'play';


/***/ }),
/* 175 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Video Game Object Seeked Event.
 * 
 * This event is dispatched when a Video completes seeking to a new point in its timeline.
 * 
 * Listen for it from a Video Game Object instance using `Video.on('seeked', listener)`.
 *
 * @event Phaser.GameObjects.Events#VIDEO_SEEKED
 * @since 3.20.0
 * 
 * @param {Phaser.GameObjects.Video} video - The Video Game Object which completed seeking.
 */
module.exports = 'seeked';


/***/ }),
/* 176 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Video Game Object Seeking Event.
 * 
 * This event is dispatched when a Video _begins_ seeking to a new point in its timeline.
 * When the seek is complete, it will dispatch the `VIDEO_SEEKED` event to conclude.
 * 
 * Listen for it from a Video Game Object instance using `Video.on('seeking', listener)`.
 *
 * @event Phaser.GameObjects.Events#VIDEO_SEEKING
 * @since 3.20.0
 * 
 * @param {Phaser.GameObjects.Video} video - The Video Game Object which started seeking.
 */
module.exports = 'seeking';


/***/ }),
/* 177 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Video Game Object Stopped Event.
 * 
 * This event is dispatched when a Video is stopped from playback via a call to the `Video.stop` method,
 * either directly via game code, or indirectly as the result of changing a video source or destroying it.
 * 
 * Listen for it from a Video Game Object instance using `Video.on('stop', listener)`.
 *
 * @event Phaser.GameObjects.Events#VIDEO_STOP
 * @since 3.20.0
 * 
 * @param {Phaser.GameObjects.Video} video - The Video Game Object which stopped playback.
 */
module.exports = 'stop';


/***/ }),
/* 178 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Video Game Object Timeout Event.
 * 
 * This event is dispatched when a Video has exhausted its allocated time while trying to connect to a video
 * source to start playback.
 * 
 * Listen for it from a Video Game Object instance using `Video.on('timeout', listener)`.
 *
 * @event Phaser.GameObjects.Events#VIDEO_TIMEOUT
 * @since 3.20.0
 * 
 * @param {Phaser.GameObjects.Video} video - The Video Game Object which timed out.
 */
module.exports = 'timeout';


/***/ }),
/* 179 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Video Game Object Unlocked Event.
 * 
 * This event is dispatched when a Video that was prevented from playback due to the browsers
 * Media Engagement Interaction policy, is unlocked by a user gesture.
 * 
 * Listen for it from a Video Game Object instance using `Video.on('unlocked', listener)`.
 *
 * @event Phaser.GameObjects.Events#VIDEO_UNLOCKED
 * @since 3.20.0
 * 
 * @param {Phaser.GameObjects.Video} video - The Video Game Object which raised the event.
 */
module.exports = 'unlocked';


/***/ }),
/* 180 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var AnimationState = __webpack_require__(181);
var Class = __webpack_require__(0);
var Components = __webpack_require__(199);
var GameObject = __webpack_require__(35);
var GameObjectEvents = __webpack_require__(37);
var SpriteRender = __webpack_require__(250);

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
 * @memberof Phaser.GameObjects
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
 * @param {(string|Phaser.Textures.Texture)} texture - The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
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
         * The Animation State component of this Sprite.
         *
         * This component provides features to apply animations to this Sprite.
         * It is responsible for playing, loading, queuing animations for later playback,
         * mixing between animations and setting the current animation frame to this Sprite.
         *
         * @name Phaser.GameObjects.Sprite#anims
         * @type {Phaser.Animations.AnimationState}
         * @since 3.0.0
         */
        this.anims = new AnimationState(this);

        this.setTexture(texture, frame);
        this.setPosition(x, y);
        this.setSizeToFrame();
        this.setOriginFromFrame();
        this.initPipeline();

        this.on(GameObjectEvents.ADDED_TO_SCENE, this.addedToScene, this);
        this.on(GameObjectEvents.REMOVED_FROM_SCENE, this.removedFromScene, this);
    },

    //  Overrides Game Object method
    addedToScene: function ()
    {
        this.scene.sys.updateList.add(this);
    },

    //  Overrides Game Object method
    removedFromScene: function ()
    {
        this.scene.sys.updateList.remove(this);
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
     * Start playing the given animation on this Sprite.
     *
     * Animations in Phaser can either belong to the global Animation Manager, or specifically to this Sprite.
     *
     * The benefit of a global animation is that multiple Sprites can all play the same animation, without
     * having to duplicate the data. You can just create it once and then play it on any Sprite.
     *
     * The following code shows how to create a global repeating animation. The animation will be created
     * from all of the frames within the sprite sheet that was loaded with the key 'muybridge':
     *
     * ```javascript
     * var config = {
     *     key: 'run',
     *     frames: 'muybridge',
     *     frameRate: 15,
     *     repeat: -1
     * };
     *
     * //  This code should be run from within a Scene:
     * this.anims.create(config);
     * ```
     *
     * However, if you wish to create an animation that is unique to this Sprite, and this Sprite alone,
     * you can call the `Animation.create` method instead. It accepts the exact same parameters as when
     * creating a global animation, however the resulting data is kept locally in this Sprite.
     *
     * With the animation created, either globally or locally, you can now play it on this Sprite:
     *
     * ```javascript
     * this.add.sprite(x, y).play('run');
     * ```
     *
     * Alternatively, if you wish to run it at a different frame rate, for example, you can pass a config
     * object instead:
     *
     * ```javascript
     * this.add.sprite(x, y).play({ key: 'run', frameRate: 24 });
     * ```
     *
     * When playing an animation on a Sprite it will first check to see if it can find a matching key
     * locally within the Sprite. If it can, it will play the local animation. If not, it will then
     * search the global Animation Manager and look for it there.
     *
     * If you need a Sprite to be able to play both local and global animations, make sure they don't
     * have conflicting keys.
     *
     * See the documentation for the `PlayAnimationConfig` config object for more details about this.
     *
     * Also, see the documentation in the Animation Manager for further details on creating animations.
     *
     * @method Phaser.GameObjects.Sprite#play
     * @fires Phaser.Animations.Events#ANIMATION_START
     * @since 3.0.0
     *
     * @param {(string|Phaser.Animations.Animation|Phaser.Types.Animations.PlayAnimationConfig)} key - The string-based key of the animation to play, or an Animation instance, or a `PlayAnimationConfig` object.
     * @param {boolean} [ignoreIfPlaying=false] - If an animation is already playing then ignore this call.
     *
     * @return {this} This Game Object.
     */
    play: function (key, ignoreIfPlaying)
    {
        return this.anims.play(key, ignoreIfPlaying);
    },

    /**
     * Start playing the given animation on this Sprite, in reverse.
     *
     * Animations in Phaser can either belong to the global Animation Manager, or specifically to this Sprite.
     *
     * The benefit of a global animation is that multiple Sprites can all play the same animation, without
     * having to duplicate the data. You can just create it once and then play it on any Sprite.
     *
     * The following code shows how to create a global repeating animation. The animation will be created
     * from all of the frames within the sprite sheet that was loaded with the key 'muybridge':
     *
     * ```javascript
     * var config = {
     *     key: 'run',
     *     frames: 'muybridge',
     *     frameRate: 15,
     *     repeat: -1
     * };
     *
     * //  This code should be run from within a Scene:
     * this.anims.create(config);
     * ```
     *
     * However, if you wish to create an animation that is unique to this Sprite, and this Sprite alone,
     * you can call the `Animation.create` method instead. It accepts the exact same parameters as when
     * creating a global animation, however the resulting data is kept locally in this Sprite.
     *
     * With the animation created, either globally or locally, you can now play it on this Sprite:
     *
     * ```javascript
     * this.add.sprite(x, y).playReverse('run');
     * ```
     *
     * Alternatively, if you wish to run it at a different frame rate, for example, you can pass a config
     * object instead:
     *
     * ```javascript
     * this.add.sprite(x, y).playReverse({ key: 'run', frameRate: 24 });
     * ```
     *
     * When playing an animation on a Sprite it will first check to see if it can find a matching key
     * locally within the Sprite. If it can, it will play the local animation. If not, it will then
     * search the global Animation Manager and look for it there.
     *
     * If you need a Sprite to be able to play both local and global animations, make sure they don't
     * have conflicting keys.
     *
     * See the documentation for the `PlayAnimationConfig` config object for more details about this.
     *
     * Also, see the documentation in the Animation Manager for further details on creating animations.
     *
     * @method Phaser.GameObjects.Sprite#playReverse
     * @fires Phaser.Animations.Events#ANIMATION_START
     * @since 3.50.0
     *
     * @param {(string|Phaser.Animations.Animation|Phaser.Types.Animations.PlayAnimationConfig)} key - The string-based key of the animation to play, or an Animation instance, or a `PlayAnimationConfig` object.
     * @param {boolean} [ignoreIfPlaying=false] - If an animation is already playing then ignore this call.
     *
     * @return {this} This Game Object.
     */
    playReverse: function (key, ignoreIfPlaying)
    {
        return this.anims.playReverse(key, ignoreIfPlaying);
    },

    /**
     * Waits for the specified delay, in milliseconds, then starts playback of the given animation.
     *
     * If the animation _also_ has a delay value set in its config, it will be **added** to the delay given here.
     *
     * If an animation is already running and a new animation is given to this method, it will wait for
     * the given delay before starting the new animation.
     *
     * If no animation is currently running, the given one begins after the delay.
     *
     * When playing an animation on a Sprite it will first check to see if it can find a matching key
     * locally within the Sprite. If it can, it will play the local animation. If not, it will then
     * search the global Animation Manager and look for it there.
     *
     * Prior to Phaser 3.50 this method was called 'delayedPlay'.
     *
     * @method Phaser.GameObjects.Components.Animation#playAfterDelay
     * @fires Phaser.Animations.Events#ANIMATION_START
     * @since 3.50.0
     *
     * @param {(string|Phaser.Animations.Animation|Phaser.Types.Animations.PlayAnimationConfig)} key - The string-based key of the animation to play, or an Animation instance, or a `PlayAnimationConfig` object.
     * @param {integer} delay - The delay, in milliseconds, to wait before starting the animation playing.
     *
     * @return {this} This Game Object.
     */
    playAfterDelay: function (key, delay)
    {
        return this.anims.playAfterDelay(key, delay);
    },

    /**
     * Waits for the current animation to complete the `repeatCount` number of repeat cycles, then starts playback
     * of the given animation.
     *
     * You can use this to ensure there are no harsh jumps between two sets of animations, i.e. going from an
     * idle animation to a walking animation, by making them blend smoothly into each other.
     *
     * If no animation is currently running, the given one will start immediately.
     *
     * When playing an animation on a Sprite it will first check to see if it can find a matching key
     * locally within the Sprite. If it can, it will play the local animation. If not, it will then
     * search the global Animation Manager and look for it there.
     *
     * @method Phaser.GameObjects.Components.Animation#playAfterRepeat
     * @fires Phaser.Animations.Events#ANIMATION_START
     * @since 3.50.0
     *
     * @param {(string|Phaser.Animations.Animation|Phaser.Types.Animations.PlayAnimationConfig)} key - The string-based key of the animation to play, or an Animation instance, or a `PlayAnimationConfig` object.
     * @param {integer} [repeatCount=1] - How many times should the animation repeat before the next one starts?
     *
     * @return {this} This Game Object.
     */
    playAfterRepeat: function (key, repeatCount)
    {
        return this.anims.playAfterRepeat(key, repeatCount);
    },

    /**
     * Sets an animation, or an array of animations, to be played immediately after the current one completes or stops.
     *
     * The current animation must enter a 'completed' state for this to happen, i.e. finish all of its repeats, delays, etc,
     * or have the `stop` method called directly on it.
     *
     * An animation set to repeat forever will never enter a completed state.
     *
     * You can chain a new animation at any point, including before the current one starts playing, during it,
     * or when it ends (via its `animationcomplete` event).
     *
     * Chained animations are specific to a Game Object, meaning different Game Objects can have different chained
     * animations without impacting the animation they're playing.
     *
     * Call this method with no arguments to reset all currently chained animations.
     *
     * When playing an animation on a Sprite it will first check to see if it can find a matching key
     * locally within the Sprite. If it can, it will play the local animation. If not, it will then
     * search the global Animation Manager and look for it there.
     *
     * @method Phaser.GameObjects.Sprite#chain
     * @since 3.50.0
     *
     * @param {(string|Phaser.Animations.Animation|Phaser.Types.Animations.PlayAnimationConfig|string[]|Phaser.Animations.Animation[]|Phaser.Types.Animations.PlayAnimationConfig[])} key - The string-based key of the animation to play, or an Animation instance, or a `PlayAnimationConfig` object, or an array of them.
     *
     * @return {this} This Game Object.
     */
    chain: function (key)
    {
        return this.anims.chain(key);
    },

    /**
     * Immediately stops the current animation from playing and dispatches the `ANIMATION_STOP` events.
     *
     * If no animation is playing, no event will be dispatched.
     *
     * If there is another animation queued (via the `chain` method) then it will start playing immediately.
     *
     * @method Phaser.GameObjects.Sprite#stop
     * @fires Phaser.Animations.Events#ANIMATION_STOP
     * @since 3.50.0
     *
     * @return {this} This Game Object.
     */
    stop: function ()
    {
        return this.anims.stop();
    },

    /**
     * Stops the current animation from playing after the specified time delay, given in milliseconds.
     *
     * It then dispatches the `ANIMATION_STOP` event.
     *
     * If no animation is running, no events will be dispatched.
     *
     * If there is another animation in the queue (set via the `chain` method) then it will start playing,
     * when the current one stops.
     *
     * @method Phaser.GameObjects.Sprite#stopAfterDelay
     * @fires Phaser.Animations.Events#ANIMATION_STOP
     * @since 3.50.0
     *
     * @param {integer} delay - The number of milliseconds to wait before stopping this animation.
     *
     * @return {this} This Game Object.
     */
    stopAfterDelay: function (delay)
    {
        return this.anims.stopAfterDelay(delay);
    },

    /**
     * Stops the current animation from playing after the given number of repeats.
     *
     * It then dispatches the `ANIMATION_STOP` event.
     *
     * If no animation is running, no events will be dispatched.
     *
     * If there is another animation in the queue (set via the `chain` method) then it will start playing,
     * when the current one stops.
     *
     * @method Phaser.GameObjects.Sprite#stopAfterRepeat
     * @fires Phaser.Animations.Events#ANIMATION_STOP
     * @since 3.50.0
     *
     * @param {integer} [repeatCount=1] - How many times should the animation repeat before stopping?
     *
     * @return {this} This Game Object.
     */
    stopAfterRepeat: function (repeatCount)
    {
        return this.anims.stopAfterRepeat(repeatCount);
    },

    /**
     * Stops the current animation from playing when it next sets the given frame.
     * If this frame doesn't exist within the animation it will not stop it from playing.
     *
     * It then dispatches the `ANIMATION_STOP` event.
     *
     * If no animation is running, no events will be dispatched.
     *
     * If there is another animation in the queue (set via the `chain` method) then it will start playing,
     * when the current one stops.
     *
     * @method Phaser.GameObjects.Sprite#stopOnFrame
     * @fires Phaser.Animations.Events#ANIMATION_STOP
     * @since 3.50.0
     *
     * @param {Phaser.Animations.AnimationFrame} frame - The frame to check before stopping this animation.
     *
     * @return {this} This Game Object.
     */
    stopOnFrame: function (frame)
    {
        return this.anims.stopOnFrame(frame);
    },

    /**
     * Build a JSON representation of this Sprite.
     *
     * @method Phaser.GameObjects.Sprite#toJSON
     * @since 3.0.0
     *
     * @return {Phaser.Types.GameObjects.JSONGameObject} A JSON representation of the Game Object.
     */
    toJSON: function ()
    {
        return Components.ToJSON(this);
    },

    /**
     * Handles the pre-destroy step for the Sprite, which removes the Animation component.
     *
     * @method Phaser.GameObjects.Sprite#preDestroy
     * @private
     * @since 3.14.0
     */
    preDestroy: function ()
    {
        this.anims.destroy();

        this.anims = undefined;
    }

});

module.exports = Sprite;


/***/ }),
/* 181 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = __webpack_require__(0);
var CustomMap = __webpack_require__(182);
var GetFastValue = __webpack_require__(183);
var Events = __webpack_require__(38);
var Animation = __webpack_require__(195);

/**
 * @classdesc
 * The Animation State Component.
 *
 * This component provides features to apply animations to Game Objects. It is responsible for
 * loading, queuing animations for later playback, mixing between animations and setting
 * the current animation frame to the Game Object that owns this component.
 *
 * This component lives as an instance within any Game Object that has it defined, such as Sprites.
 *
 * You can access its properties and methods via the `anims` property, i.e. `Sprite.anims`.
 *
 * As well as playing animations stored in the global Animation Manager, this component
 * can also create animations that are stored locally within it. See the `create` method
 * for more details.
 *
 * Prior to Phaser 3.50 this component was called just `Animation` and lived in the
 * `Phaser.GameObjects.Components` namespace. It was renamed to `AnimationState`
 * in 3.50 to help better identify its true purpose when browsing the documentation.
 *
 * @class AnimationState
 * @memberof Phaser.Animations
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject} parent - The Game Object to which this animation component belongs.
 */
var AnimationState = new Class({

    initialize:

    function AnimationState (parent)
    {
        /**
         * The Game Object to which this animation component belongs.
         *
         * You can typically access this component from the Game Object
         * via the `this.anims` property.
         *
         * @name Phaser.Animations.AnimationState#parent
         * @type {Phaser.GameObjects.GameObject}
         * @since 3.0.0
         */
        this.parent = parent;

        /**
         * A reference to the global Animation Manager.
         *
         * @name Phaser.Animations.AnimationState#animationManager
         * @type {Phaser.Animations.AnimationManager}
         * @since 3.0.0
         */
        this.animationManager = parent.scene.sys.anims;

        this.animationManager.on(Events.REMOVE_ANIMATION, this.globalRemove, this);

        /**
         * A reference to the Texture Manager.
         *
         * @name Phaser.Animations.AnimationState#textureManager
         * @type {Phaser.Textures.TextureManager}
         * @protected
         * @since 3.50.0
         */
        this.textureManager = this.animationManager.textureManager;

        /**
         * The Animations stored locally in this Animation component.
         *
         * Do not modify the contents of this Map directly, instead use the
         * `add`, `create` and `remove` methods of this class instead.
         *
         * @name Phaser.Animations.AnimationState#anims
         * @type {Phaser.Structs.Map.<string, Phaser.Animations.Animation>}
         * @protected
         * @since 3.50.0
         */
        this.anims = null;

        /**
         * Is an animation currently playing or not?
         *
         * @name Phaser.Animations.AnimationState#isPlaying
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.isPlaying = false;

        /**
         * Has the current animation started playing, or is it waiting for a delay to expire?
         *
         * @name Phaser.Animations.AnimationState#hasStarted
         * @type {boolean}
         * @default false
         * @since 3.50.0
         */
        this.hasStarted = false;

        /**
         * The current Animation loaded into this Animation component.
         *
         * Will by `null` if no animation is yet loaded.
         *
         * @name Phaser.Animations.AnimationState#currentAnim
         * @type {?Phaser.Animations.Animation}
         * @default null
         * @since 3.0.0
         */
        this.currentAnim = null;

        /**
         * The current AnimationFrame being displayed by this Animation component.
         *
         * Will by `null` if no animation is yet loaded.
         *
         * @name Phaser.Animations.AnimationState#currentFrame
         * @type {?Phaser.Animations.AnimationFrame}
         * @default null
         * @since 3.0.0
         */
        this.currentFrame = null;

        /**
         * The key, instance, or config of the next Animation to be loaded into this Animation component
         * when the current animation completes.
         *
         * Will by `null` if no animation has been queued.
         *
         * @name Phaser.Animations.AnimationState#nextAnim
         * @type {?(string|Phaser.Animations.Animation|Phaser.Types.Animations.PlayAnimationConfig)}
         * @default null
         * @since 3.16.0
         */
        this.nextAnim = null;

        /**
         * A queue of Animations to be loaded into this Animation component when the current animation completes.
         *
         * Populate this queue via the `chain` method.
         *
         * @name Phaser.Animations.AnimationState#nextAnimsQueue
         * @type {array}
         * @since 3.24.0
         */
        this.nextAnimsQueue = [];

        /**
         * The Time Scale factor.
         *
         * You can adjust this value to modify the passage of time for the animation that is currently
         * playing. For example, setting it to 2 will make the animation play twice as fast. Or setting
         * it to 0.5 will slow the animation down.
         *
         * You can change this value at run-time, or set it via the `PlayAnimationConfig`.
         *
         * Prior to Phaser 3.50 this property was private and called `_timeScale`.
         *
         * @name Phaser.Animations.AnimationState#timeScale
         * @type {number}
         * @default 1
         * @since 3.50.0
         */
        this.timeScale = 1;

        /**
         * The frame rate of playback, of the current animation, in frames per second.
         *
         * This value is set when a new animation is loaded into this component and should
         * be treated as read-only, as changing it once playback has started will not alter
         * the animation. To change the frame rate, provide a new value in the `PlayAnimationConfig` object.
         *
         * @name Phaser.Animations.AnimationState#frameRate
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.frameRate = 0;

        /**
         * The duration of the current animation, in milliseconds.
         *
         * This value is set when a new animation is loaded into this component and should
         * be treated as read-only, as changing it once playback has started will not alter
         * the animation. To change the duration, provide a new value in the `PlayAnimationConfig` object.
         *
         * @name Phaser.Animations.AnimationState#duration
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.duration = 0;

        /**
         * The number of milliseconds per frame, not including frame specific modifiers that may be present in the
         * Animation data.
         *
         * This value is calculated when a new animation is loaded into this component and should
         * be treated as read-only. Changing it will not alter playback speed.
         *
         * @name Phaser.Animations.AnimationState#msPerFrame
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.msPerFrame = 0;

        /**
         * Skip frames if the time lags, or always advanced anyway?
         *
         * @name Phaser.Animations.AnimationState#skipMissedFrames
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.skipMissedFrames = true;

        /**
         * The delay before starting playback of the current animation, in milliseconds.
         *
         * This value is set when a new animation is loaded into this component and should
         * be treated as read-only, as changing it once playback has started will not alter
         * the animation. To change the delay, provide a new value in the `PlayAnimationConfig` object.
         *
         * Prior to Phaser 3.50 this property was private and called `_delay`.
         *
         * @name Phaser.Animations.AnimationState#delay
         * @type {number}
         * @default 0
         * @since 3.50.0
         */
        this.delay = 0;

        /**
         * The number of times to repeat playback of the current animation.
         *
         * If -1, it means the animation will repeat forever.
         *
         * This value is set when a new animation is loaded into this component and should
         * be treated as read-only, as changing it once playback has started will not alter
         * the animation. To change the number of repeats, provide a new value in the `PlayAnimationConfig` object.
         *
         * Prior to Phaser 3.50 this property was private and called `_repeat`.
         *
         * @name Phaser.Animations.AnimationState#repeat
         * @type {number}
         * @default 0
         * @since 3.50.0
         */
        this.repeat = 0;

        /**
         * The number of milliseconds to wait before starting the repeat playback of the current animation.
         *
         * This value is set when a new animation is loaded into this component, but can also be modified
         * at run-time.
         *
         * You can change the repeat delay by providing a new value in the `PlayAnimationConfig` object.
         *
         * Prior to Phaser 3.50 this property was private and called `_repeatDelay`.
         *
         * @name Phaser.Animations.AnimationState#repeatDelay
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.repeatDelay = 0;

        /**
         * Should the current animation yoyo? An animation that yoyos will play in reverse, from the end
         * to the start, before then repeating or completing. An animation that does not yoyo will just
         * play from the start to the end.
         *
         * This value is set when a new animation is loaded into this component, but can also be modified
         * at run-time.
         *
         * You can change the yoyo by providing a new value in the `PlayAnimationConfig` object.
         *
         * Prior to Phaser 3.50 this property was private and called `_yoyo`.
         *
         * @name Phaser.Animations.AnimationState#yoyo
         * @type {boolean}
         * @default false
         * @since 3.50.0
         */
        this.yoyo = false;

        /**
         * Should the GameObject's `visible` property be set to `true` when the animation starts to play?
         *
         * This will happen _after_ any delay that may have been set.
         *
         * This value is set when a new animation is loaded into this component, but can also be modified
         * at run-time, assuming the animation is currently delayed.
         *
         * @name Phaser.Animations.AnimationState#showOnStart
         * @type {boolean}
         * @since 3.50.0
         */
        this.showOnStart = false;

        /**
         * Should the GameObject's `visible` property be set to `false` when the animation completes?
         *
         * This value is set when a new animation is loaded into this component, but can also be modified
         * at run-time, assuming the animation is still actively playing.
         *
         * @name Phaser.Animations.AnimationState#hideOnComplete
         * @type {boolean}
         * @since 3.50.0
         */
        this.hideOnComplete = false;

        /**
         * Is the playhead moving forwards (`true`) or in reverse (`false`) ?
         *
         * @name Phaser.Animations.AnimationState#forward
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.forward = true;

        /**
         * An internal trigger that tells the component if it should plays the animation
         * in reverse mode ('true') or not ('false'). This is used because `forward` can
         * be changed by the `yoyo` feature.
         *
         * Prior to Phaser 3.50 this property was private and called `_reverse`.
         *
         * @name Phaser.Animations.AnimationState#inReverse
         * @type {boolean}
         * @default false
         * @since 3.50.0
         */
        this.inReverse = false;

        /**
         * Internal time overflow accumulator.
         *
         * This has the `delta` time added to it as part of the `update` step.
         *
         * @name Phaser.Animations.AnimationState#accumulator
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.accumulator = 0;

        /**
         * The time point at which the next animation frame will change.
         *
         * This value is compared against the `accumulator` as part of the `update` step.
         *
         * @name Phaser.Animations.AnimationState#nextTick
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.nextTick = 0;

        /**
         * A counter keeping track of how much delay time, in milliseconds, is left before playback begins.
         *
         * This is set via the `playAfterDelay` method, although it can be modified at run-time
         * if required, as long as the animation has not already started playing.
         *
         * @name Phaser.Animations.AnimationState#delayCounter
         * @type {number}
         * @default 0
         * @since 3.50.0
         */
        this.delayCounter = 0;

        /**
         * A counter that keeps track of how many repeats are left to run.
         *
         * This value is set when a new animation is loaded into this component, but can also be modified
         * at run-time.
         *
         * @name Phaser.Animations.AnimationState#repeatCounter
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.repeatCounter = 0;

        /**
         * An internal flag keeping track of pending repeats.
         *
         * @name Phaser.Animations.AnimationState#pendingRepeat
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.pendingRepeat = false;

        /**
         * Is the Animation paused?
         *
         * @name Phaser.Animations.AnimationState#_paused
         * @type {boolean}
         * @private
         * @default false
         * @since 3.0.0
         */
        this._paused = false;

        /**
         * Was the animation previously playing before being paused?
         *
         * @name Phaser.Animations.AnimationState#_wasPlaying
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
         * @name Phaser.Animations.AnimationState#_pendingStop
         * @type {integer}
         * @private
         * @since 3.4.0
         */
        this._pendingStop = 0;

        /**
         * Internal property used by _pendingStop.
         *
         * @name Phaser.Animations.AnimationState#_pendingStopValue
         * @type {any}
         * @private
         * @since 3.4.0
         */
        this._pendingStopValue;
    },

    /**
     * Sets an animation, or an array of animations, to be played in the future, after the current one completes or stops.
     *
     * The current animation must enter a 'completed' state for this to happen, i.e. finish all of its repeats, delays, etc,
     * or have one of the `stop` methods called.
     *
     * An animation set to repeat forever will never enter a completed state unless stopped.
     *
     * You can chain a new animation at any point, including before the current one starts playing, during it, or when it ends (via its `animationcomplete` event).
     *
     * Chained animations are specific to a Game Object, meaning different Game Objects can have different chained animations without impacting the global animation they're playing.
     *
     * Call this method with no arguments to reset all currently chained animations.
     *
     * @method Phaser.Animations.AnimationState#chain
     * @since 3.16.0
     *
     * @param {(string|Phaser.Animations.Animation|Phaser.Types.Animations.PlayAnimationConfig|string[]|Phaser.Animations.Animation[]|Phaser.Types.Animations.PlayAnimationConfig[])} key - The string-based key of the animation to play, or an Animation instance, or a `PlayAnimationConfig` object, or an array of them.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    chain: function (key)
    {
        var parent = this.parent;

        if (key === undefined)
        {
            this.nextAnimsQueue.length = 0;
            this.nextAnim = null;

            return parent;
        }

        if (!Array.isArray(key))
        {
            key = [ key ];
        }

        for (var i = 0; i < key.length; i++)
        {
            var anim = key[i];

            if (this.nextAnim === null)
            {
                this.nextAnim = anim;
            }
            else
            {
                this.nextAnimsQueue.push(anim);
            }
        }

        return this.parent;
    },

    /**
     * Returns the key of the animation currently loaded into this component.
     *
     * Prior to Phaser 3.50 this method was called `getCurrentKey`.
     *
     * @method Phaser.Animations.AnimationState#getName
     * @since 3.50.0
     *
     * @return {string} The key of the Animation currently loaded into this component, or an empty string if none loaded.
     */
    getName: function ()
    {
        return (this.currentAnim) ? this.currentAnim.key : '';
    },

    /**
     * Returns the key of the animation frame currently displayed by this component.
     *
     * @method Phaser.Animations.AnimationState#getFrameName
     * @since 3.50.0
     *
     * @return {string} The key of the Animation Frame currently displayed by this component, or an empty string if no animation has been loaded.
     */
    getFrameName: function ()
    {
        return (this.currentFrame) ? this.currentFrame.textureFrame : '';
    },

    /**
     * Internal method used to load an animation into this component.
     *
     * @method Phaser.Animations.AnimationState#load
     * @protected
     * @since 3.0.0
     *
     * @param {(string|Phaser.Types.Animations.PlayAnimationConfig)} key - The string-based key of the animation to play, or a `PlayAnimationConfig` object.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    load: function (key)
    {
        if (this.isPlaying)
        {
            this.stop();
        }

        var manager = this.animationManager;
        var animKey = (typeof key === 'string') ? key : GetFastValue(key, 'key', null);

        //  Get the animation, first from the local map and, if not found, from the Animation Manager
        var anim = (this.exists(animKey)) ? this.get(animKey) : manager.get(animKey);

        if (!anim)
        {
            console.warn('Missing animation: ' + animKey);
        }
        else
        {
            this.currentAnim = anim;

            //  And now override the animation values, if set in the config.

            var totalFrames = anim.getTotalFrames();
            var frameRate = GetFastValue(key, 'frameRate', anim.frameRate);
            var duration = GetFastValue(key, 'duration', anim.duration);

            anim.calculateDuration(this, totalFrames, duration, frameRate);

            this.delay = GetFastValue(key, 'delay', anim.delay);
            this.repeat = GetFastValue(key, 'repeat', anim.repeat);
            this.repeatDelay = GetFastValue(key, 'repeatDelay', anim.repeatDelay);
            this.yoyo = GetFastValue(key, 'yoyo', anim.yoyo);
            this.showOnStart = GetFastValue(key, 'showOnStart', anim.showOnStart);
            this.hideOnComplete = GetFastValue(key, 'hideOnComplete', anim.hideOnComplete);
            this.skipMissedFrames = GetFastValue(key, 'skipMissedFrames', anim.skipMissedFrames);

            this.timeScale = GetFastValue(key, 'timeScale', this.timeScale);

            var startFrame = GetFastValue(key, 'startFrame', 0);

            if (startFrame > anim.getTotalFrames())
            {
                startFrame = 0;
            }

            var frame = anim.frames[startFrame];

            if (startFrame === 0 && !this.forward)
            {
                frame = anim.getLastFrame();
            }

            this.currentFrame = frame;
        }

        return this.parent;
    },

    /**
     * Pause the current animation and set the `isPlaying` property to `false`.
     * You can optionally pause it at a specific frame.
     *
     * @method Phaser.Animations.AnimationState#pause
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
            this.setCurrentFrame(atFrame);
        }

        return this.parent;
    },

    /**
     * Resumes playback of a paused animation and sets the `isPlaying` property to `true`.
     * You can optionally tell it to start playback from a specific frame.
     *
     * @method Phaser.Animations.AnimationState#resume
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
            this.setCurrentFrame(fromFrame);
        }

        return this.parent;
    },

    /**
     * Waits for the specified delay, in milliseconds, then starts playback of the given animation.
     *
     * If the animation _also_ has a delay value set in its config, it will be **added** to the delay given here.
     *
     * If an animation is already running and a new animation is given to this method, it will wait for
     * the given delay before starting the new animation.
     *
     * If no animation is currently running, the given one begins after the delay.
     *
     * Prior to Phaser 3.50 this method was called 'delayedPlay' and the parameters were in the reverse order.
     *
     * @method Phaser.Animations.AnimationState#playAfterDelay
     * @fires Phaser.Animations.Events#ANIMATION_START
     * @since 3.50.0
     *
     * @param {(string|Phaser.Animations.Animation|Phaser.Types.Animations.PlayAnimationConfig)} key - The string-based key of the animation to play, or an Animation instance, or a `PlayAnimationConfig` object.
     * @param {integer} delay - The delay, in milliseconds, to wait before starting the animation playing.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    playAfterDelay: function (key, delay)
    {
        if (!this.isPlaying)
        {
            this.delayCounter = delay;

            this.play(key, true);
        }
        else
        {
            //  If we've got a nextAnim, move it to the queue
            var nextAnim = this.nextAnim;
            var queue = this.nextAnimsQueue;

            if (nextAnim)
            {
                queue.unshift(nextAnim);
            }

            this.nextAnim = key;

            this._pendingStop = 1;
            this._pendingStopValue = delay;
        }

        return this.parent;
    },

    /**
     * Waits for the current animation to complete the `repeatCount` number of repeat cycles, then starts playback
     * of the given animation.
     *
     * You can use this to ensure there are no harsh jumps between two sets of animations, i.e. going from an
     * idle animation to a walking animation, by making them blend smoothly into each other.
     *
     * If no animation is currently running, the given one will start immediately.
     *
     * @method Phaser.Animations.AnimationState#playAfterRepeat
     * @fires Phaser.Animations.Events#ANIMATION_START
     * @since 3.50.0
     *
     * @param {(string|Phaser.Animations.Animation|Phaser.Types.Animations.PlayAnimationConfig)} key - The string-based key of the animation to play, or an Animation instance, or a `PlayAnimationConfig` object.
     * @param {integer} [repeatCount=1] - How many times should the animation repeat before the next one starts?
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    playAfterRepeat: function (key, repeatCount)
    {
        if (repeatCount === undefined) { repeatCount = 1; }

        if (!this.isPlaying)
        {
            this.play(key);
        }
        else
        {
            //  If we've got a nextAnim, move it to the queue
            var nextAnim = this.nextAnim;
            var queue = this.nextAnimsQueue;

            if (nextAnim)
            {
                queue.unshift(nextAnim);
            }

            if (this.repeatCounter !== -1 && repeatCount > this.repeatCounter)
            {
                repeatCount = this.repeatCounter;
            }

            this.nextAnim = key;

            this._pendingStop = 2;
            this._pendingStopValue = repeatCount;
        }

        return this.parent;
    },

    /**
     * Start playing the given animation on this Sprite.
     *
     * Animations in Phaser can either belong to the global Animation Manager, or specifically to this Sprite.
     *
     * The benefit of a global animation is that multiple Sprites can all play the same animation, without
     * having to duplicate the data. You can just create it once and then play it on any Sprite.
     *
     * The following code shows how to create a global repeating animation. The animation will be created
     * from all of the frames within the sprite sheet that was loaded with the key 'muybridge':
     *
     * ```javascript
     * var config = {
     *     key: 'run',
     *     frames: 'muybridge',
     *     frameRate: 15,
     *     repeat: -1
     * };
     *
     * //  This code should be run from within a Scene:
     * this.anims.create(config);
     * ```
     *
     * However, if you wish to create an animation that is unique to this Sprite, and this Sprite alone,
     * you can call the `Animation.create` method instead. It accepts the exact same parameters as when
     * creating a global animation, however the resulting data is kept locally in this Sprite.
     *
     * With the animation created, either globally or locally, you can now play it on this Sprite:
     *
     * ```javascript
     * this.add.sprite(x, y).play('run');
     * ```
     *
     * Alternatively, if you wish to run it at a different frame rate, for example, you can pass a config
     * object instead:
     *
     * ```javascript
     * this.add.sprite(x, y).play({ key: 'run', frameRate: 24 });
     * ```
     *
     * When playing an animation on a Sprite it will first check to see if it can find a matching key
     * locally within the Sprite. If it can, it will play the local animation. If not, it will then
     * search the global Animation Manager and look for it there.
     *
     * If you need a Sprite to be able to play both local and global animations, make sure they don't
     * have conflicting keys.
     *
     * See the documentation for the `PlayAnimationConfig` config object for more details about this.
     *
     * Also, see the documentation in the Animation Manager for further details on creating animations.
     *
     * @method Phaser.Animations.AnimationState#play
     * @fires Phaser.Animations.Events#ANIMATION_START
     * @since 3.0.0
     *
     * @param {(string|Phaser.Animations.Animation|Phaser.Types.Animations.PlayAnimationConfig)} key - The string-based key of the animation to play, or an Animation instance, or a `PlayAnimationConfig` object.
     * @param {boolean} [ignoreIfPlaying=false] - If this animation is already playing then ignore this call.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    play: function (key, ignoreIfPlaying)
    {
        if (ignoreIfPlaying === undefined) { ignoreIfPlaying = false; }

        var currentAnim = this.currentAnim;
        var parent = this.parent;

        //  Must be either an Animation instance, or a PlayAnimationConfig object
        var animKey = (typeof key === 'string') ? key : key.key;

        if (ignoreIfPlaying && this.isPlaying && currentAnim.key === animKey)
        {
            return parent;
        }

        //  Are we mixing?
        if (currentAnim && this.isPlaying)
        {
            var mix = this.animationManager.getMix(currentAnim.key, key);

            if (mix > 0)
            {
                return this.playAfterDelay(key, mix);
            }
        }

        this.forward = true;
        this.inReverse = false;

        this._paused = false;
        this._wasPlaying = true;

        return this.startAnimation(key);
    },

    /**
     * Start playing the given animation on this Sprite, in reverse.
     *
     * Animations in Phaser can either belong to the global Animation Manager, or specifically to this Sprite.
     *
     * The benefit of a global animation is that multiple Sprites can all play the same animation, without
     * having to duplicate the data. You can just create it once and then play it on any Sprite.
     *
     * The following code shows how to create a global repeating animation. The animation will be created
     * from all of the frames within the sprite sheet that was loaded with the key 'muybridge':
     *
     * ```javascript
     * var config = {
     *     key: 'run',
     *     frames: 'muybridge',
     *     frameRate: 15,
     *     repeat: -1
     * };
     *
     * //  This code should be run from within a Scene:
     * this.anims.create(config);
     * ```
     *
     * However, if you wish to create an animation that is unique to this Sprite, and this Sprite alone,
     * you can call the `Animation.create` method instead. It accepts the exact same parameters as when
     * creating a global animation, however the resulting data is kept locally in this Sprite.
     *
     * With the animation created, either globally or locally, you can now play it on this Sprite:
     *
     * ```javascript
     * this.add.sprite(x, y).playReverse('run');
     * ```
     *
     * Alternatively, if you wish to run it at a different frame rate, for example, you can pass a config
     * object instead:
     *
     * ```javascript
     * this.add.sprite(x, y).playReverse({ key: 'run', frameRate: 24 });
     * ```
     *
     * When playing an animation on a Sprite it will first check to see if it can find a matching key
     * locally within the Sprite. If it can, it will play the local animation. If not, it will then
     * search the global Animation Manager and look for it there.
     *
     * If you need a Sprite to be able to play both local and global animations, make sure they don't
     * have conflicting keys.
     *
     * See the documentation for the `PlayAnimationConfig` config object for more details about this.
     *
     * Also, see the documentation in the Animation Manager for further details on creating animations.
     *
     * @method Phaser.Animations.AnimationState#playReverse
     * @fires Phaser.Animations.Events#ANIMATION_START
     * @since 3.12.0
     *
     * @param {(string|Phaser.Animations.Animation|Phaser.Types.Animations.PlayAnimationConfig)} key - The string-based key of the animation to play, or an Animation instance, or a `PlayAnimationConfig` object.
     * @param {boolean} [ignoreIfPlaying=false] - If an animation is already playing then ignore this call.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    playReverse: function (key, ignoreIfPlaying)
    {
        if (ignoreIfPlaying === undefined) { ignoreIfPlaying = false; }

        //  Must be either an Animation instance, or a PlayAnimationConfig object
        var animKey = (typeof key === 'string') ? key : key.key;

        if (ignoreIfPlaying && this.isPlaying && this.currentAnim.key === animKey)
        {
            return this.parent;
        }

        this.forward = false;
        this.inReverse = true;

        this._paused = false;
        this._wasPlaying = true;

        return this.startAnimation(key);
    },

    /**
     * Load the animation based on the key and set-up all of the internal values
     * needed for playback to start. If there is no delay, it will also fire the start events.
     *
     * @method Phaser.Animations.AnimationState#startAnimation
     * @fires Phaser.Animations.Events#ANIMATION_START
     * @since 3.50.0
     *
     * @param {(string|Phaser.Types.Animations.PlayAnimationConfig)} key - The string-based key of the animation to play, or a `PlayAnimationConfig` object.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    startAnimation: function (key)
    {
        this.load(key);

        var anim = this.currentAnim;
        var gameObject = this.parent;

        if (!anim)
        {
            return gameObject;
        }

        //  Should give us 9,007,199,254,740,991 safe repeats
        this.repeatCounter = (this.repeat === -1) ? Number.MAX_VALUE : this.repeat;

        anim.getFirstTick(this);

        this.isPlaying = true;
        this.pendingRepeat = false;
        this.hasStarted = false;

        this._pendingStop = 0;
        this._pendingStopValue = 0;
        this._paused = false;

        //  Add any delay the animation itself may have had as well
        this.delayCounter += this.delay;

        if (this.delayCounter === 0)
        {
            this.handleStart();
        }

        return gameObject;
    },

    /**
     * Handles the start of an animation playback.
     *
     * @method Phaser.Animations.AnimationState#handleStart
     * @private
     * @since 3.50.0
     */
    handleStart: function ()
    {
        if (this.showOnStart)
        {
            this.parent.setVisible(true);
        }

        this.setCurrentFrame(this.currentFrame);

        this.hasStarted = true;

        this.emitEvents(Events.ANIMATION_START);
    },

    /**
     * Handles the repeat of an animation.
     *
     * @method Phaser.Animations.AnimationState#handleRepeat
     * @private
     * @since 3.50.0
     */
    handleRepeat: function ()
    {
        this.pendingRepeat = false;

        this.emitEvents(Events.ANIMATION_REPEAT);
    },

    /**
     * Handles the stop of an animation playback.
     *
     * @method Phaser.Animations.AnimationState#handleStop
     * @private
     * @since 3.50.0
     */
    handleStop: function ()
    {
        this._pendingStop = 0;

        this.isPlaying = false;

        this.emitEvents(Events.ANIMATION_STOP);
    },

    /**
     * Handles the completion of an animation playback.
     *
     * @method Phaser.Animations.AnimationState#handleComplete
     * @private
     * @since 3.50.0
     */
    handleComplete: function ()
    {
        this._pendingStop = 0;

        this.isPlaying = false;

        if (this.hideOnComplete)
        {
            this.parent.setVisible(false);
        }

        this.emitEvents(Events.ANIMATION_COMPLETE, Events.ANIMATION_COMPLETE_KEY);
    },

    /**
     * Fires the given animation event.
     *
     * @method Phaser.Animations.AnimationState#emitEvents
     * @private
     * @since 3.50.0
     *
     * @param {string} event - The Animation Event to dispatch.
     */
    emitEvents: function (event, keyEvent)
    {
        var anim = this.currentAnim;
        var frame = this.currentFrame;
        var gameObject = this.parent;

        var frameKey = frame.textureFrame;

        gameObject.emit(event, anim, frame, gameObject, frameKey);

        if (keyEvent)
        {
            gameObject.emit(keyEvent + anim.key, anim, frame, gameObject, frameKey);
        }
    },

    /**
     * Reverse the Animation that is already playing on the Game Object.
     *
     * @method Phaser.Animations.AnimationState#reverse
     * @since 3.12.0
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    reverse: function ()
    {
        if (this.isPlaying)
        {
            this.inReverse = !this.inReverse;

            this.forward = !this.forward;
        }

        return this.parent;
    },

    /**
     * Returns a value between 0 and 1 indicating how far this animation is through, ignoring repeats and yoyos.
     *
     * The value is based on the current frame and how far that is in the animation, it is not based on
     * the duration of the animation.
     *
     * @method Phaser.Animations.AnimationState#getProgress
     * @since 3.4.0
     *
     * @return {number} The progress of the current animation in frames, between 0 and 1.
     */
    getProgress: function ()
    {
        var frame = this.currentFrame;

        if (!frame)
        {
            return 0;
        }

        var p = frame.progress;

        if (this.inReverse)
        {
            p *= -1;
        }

        return p;
    },

    /**
     * Takes a value between 0 and 1 and uses it to set how far this animation is through playback.
     *
     * Does not factor in repeats or yoyos, but does handle playing forwards or backwards.
     *
     * The value is based on the current frame and how far that is in the animation, it is not based on
     * the duration of the animation.
     *
     * @method Phaser.Animations.AnimationState#setProgress
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
     * Sets the number of times that the animation should repeat after its first play through.
     * For example, if repeat is 1, the animation will play a total of twice: the initial play plus 1 repeat.
     *
     * To repeat indefinitely, use -1.
     * The value should always be an integer.
     *
     * Calling this method only works if the animation is already running. Otherwise, any
     * value specified here will be overwritten when the next animation loads in. To avoid this,
     * use the `repeat` property of the `PlayAnimationConfig` object instead.
     *
     * @method Phaser.Animations.AnimationState#setRepeat
     * @since 3.4.0
     *
     * @param {integer} value - The number of times that the animation should repeat.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    setRepeat: function (value)
    {
        this.repeatCounter = (value === -1) ? Number.MAX_VALUE : value;

        return this.parent;
    },

    /**
     * Handle the removal of an animation from the Animation Manager.
     *
     * @method Phaser.Animations.AnimationState#globalRemove
     * @since 3.50.0
     *
     * @param {string} [key] - The key of the removed Animation.
     * @param {Phaser.Animations.Animation} [animation] - The removed Animation.
     */
    globalRemove: function (key, animation)
    {
        if (animation === undefined) { animation = this.currentAnim; }

        if (this.isPlaying && animation.key === this.currentAnim.key)
        {
            this.stop();

            this.setCurrentFrame(this.currentAnim.frames[0]);
        }
    },

    /**
     * Restarts the current animation from its beginning.
     *
     * You can optionally reset the delay and repeat counters as well.
     *
     * Calling this will fire the `ANIMATION_RESTART` event immediately.
     *
     * If you `includeDelay` then it will also fire the `ANIMATION_START` event once
     * the delay has expired, otherwise, playback will just begin immediately.
     *
     * @method Phaser.Animations.AnimationState#restart
     * @fires Phaser.Animations.Events#ANIMATION_RESTART
     * @since 3.0.0
     *
     * @param {boolean} [includeDelay=false] - Whether to include the delay value of the animation when restarting.
     * @param {boolean} [resetRepeats=false] - Whether to reset the repeat counter or not?
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    restart: function (includeDelay, resetRepeats)
    {
        if (includeDelay === undefined) { includeDelay = false; }
        if (resetRepeats === undefined) { resetRepeats = false; }

        var anim = this.currentAnim;
        var gameObject = this.parent;

        if (!anim)
        {
            return gameObject;
        }

        if (resetRepeats)
        {
            this.repeatCounter = (this.repeat === -1) ? Number.MAX_VALUE : this.repeat;
        }

        anim.getFirstTick(this);

        this.emitEvents(Events.ANIMATION_RESTART);

        this.isPlaying = true;
        this.pendingRepeat = false;

        //  Set this to `true` if there is no delay to include, so it skips the `hasStarted` check in `update`.
        this.hasStarted = !includeDelay;

        this._pendingStop = 0;
        this._pendingStopValue = 0;
        this._paused = false;

        this.setCurrentFrame(anim.frames[0]);

        return this.parent;
    },

    /**
     * The current animation has completed. This dispatches the `ANIMATION_COMPLETE` event.
     *
     * This method is called by the Animation instance and should not usually be invoked directly.
     *
     * If no animation is loaded, no events will be dispatched.
     *
     * If another animation has been queued for playback, it will be started after the events fire.
     *
     * @method Phaser.Animations.AnimationState#complete
     * @fires Phaser.Animations.Events#ANIMATION_COMPLETE
     * @since 3.50.0
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    complete: function ()
    {
        this._pendingStop = 0;

        this.isPlaying = false;

        if (this.currentAnim)
        {
            this.handleComplete();
        }

        if (this.nextAnim)
        {
            var key = this.nextAnim;

            this.nextAnim = (this.nextAnimsQueue.length > 0) ? this.nextAnimsQueue.shift() : null;

            this.play(key);
        }

        return this.parent;
    },

    /**
     * Immediately stops the current animation from playing and dispatches the `ANIMATION_STOP` event.
     *
     * If no animation is running, no events will be dispatched.
     *
     * If there is another animation in the queue (set via the `chain` method) then it will start playing.
     *
     * @method Phaser.Animations.AnimationState#stop
     * @fires Phaser.Animations.Events#ANIMATION_STOP
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    stop: function ()
    {
        this._pendingStop = 0;

        this.isPlaying = false;

        if (this.currentAnim)
        {
            this.handleStop();
        }

        if (this.nextAnim)
        {
            var key = this.nextAnim;

            this.nextAnim = this.nextAnimsQueue.shift();

            this.play(key);
        }

        return this.parent;
    },

    /**
     * Stops the current animation from playing after the specified time delay, given in milliseconds.
     *
     * It then dispatches the `ANIMATION_STOP` event.
     *
     * If no animation is running, no events will be dispatched.
     *
     * If there is another animation in the queue (set via the `chain` method) then it will start playing,
     * when the current one stops.
     *
     * @method Phaser.Animations.AnimationState#stopAfterDelay
     * @fires Phaser.Animations.Events#ANIMATION_STOP
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
     * It then dispatches the `ANIMATION_STOP` event.
     *
     * If no animation is running, no events will be dispatched.
     *
     * If there is another animation in the queue (set via the `chain` method) then it will start playing,
     * when the current one stops.
     *
     * Prior to Phaser 3.50 this method was called `stopOnRepeat` and had no parameters.
     *
     * @method Phaser.Animations.AnimationState#stopAfterRepeat
     * @fires Phaser.Animations.Events#ANIMATION_STOP
     * @since 3.50.0
     *
     * @param {integer} [repeatCount=1] - How many times should the animation repeat before stopping?
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that owns this Animation Component.
     */
    stopAfterRepeat: function (repeatCount)
    {
        if (repeatCount === undefined) { repeatCount = 1; }

        if (this.repeatCounter !== -1 && repeatCount > this.repeatCounter)
        {
            repeatCount = this.repeatCounter;
        }

        this._pendingStop = 2;
        this._pendingStopValue = repeatCount;

        return this.parent;
    },

    /**
     * Stops the current animation from playing when it next sets the given frame.
     * If this frame doesn't exist within the animation it will not stop it from playing.
     *
     * It then dispatches the `ANIMATION_STOP` event.
     *
     * If no animation is running, no events will be dispatched.
     *
     * If there is another animation in the queue (set via the `chain` method) then it will start playing,
     * when the current one stops.
     *
     * @method Phaser.Animations.AnimationState#stopOnFrame
     * @fires Phaser.Animations.Events#ANIMATION_STOP
     * @since 3.4.0
     *
     * @param {Phaser.Animations.AnimationFrame} frame - The frame to check before stopping this animation.
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
     * Returns the total number of frames in this animation, or returns zero if no
     * animation has been loaded.
     *
     * @method Phaser.Animations.AnimationState#getTotalFrames
     * @since 3.4.0
     *
     * @return {integer} The total number of frames in the current animation, or zero if no animation has been loaded.
     */
    getTotalFrames: function ()
    {
        return (this.currentAnim) ? this.currentAnim.getTotalFrames() : 0;
    },

    /**
     * The internal update loop for the AnimationState Component.
     *
     * This is called automatically by the `Sprite.preUpdate` method.
     *
     * @method Phaser.Animations.AnimationState#update
     * @since 3.0.0
     *
     * @param {number} time - The current timestamp.
     * @param {number} delta - The delta time, in ms, elapsed since the last frame.
     */
    update: function (time, delta)
    {
        var anim = this.currentAnim;

        if (!this.isPlaying || !anim || anim.paused)
        {
            return;
        }

        this.accumulator += delta * this.timeScale;

        if (this._pendingStop === 1)
        {
            this._pendingStopValue -= delta;

            if (this._pendingStopValue <= 0)
            {
                return this.stop();
            }
        }

        if (!this.hasStarted)
        {
            if (this.accumulator >= this.delayCounter)
            {
                this.accumulator -= this.delayCounter;

                this.handleStart();
            }
        }
        else if (this.accumulator >= this.nextTick)
        {
            //  Process one frame advance as standard

            if (this.forward)
            {
                anim.nextFrame(this);
            }
            else
            {
                anim.previousFrame(this);
            }

            //  And only do more if we're skipping frames and have time left
            if (this.isPlaying && this._pendingStop === 0 && this.skipMissedFrames && this.accumulator > this.nextTick)
            {
                var safetyNet = 0;

                do
                {
                    if (this.forward)
                    {
                        anim.nextFrame(this);
                    }
                    else
                    {
                        anim.previousFrame(this);
                    }

                    safetyNet++;

                } while (this.accumulator > this.nextTick && safetyNet < 60);
            }
        }
    },

    /**
     * Sets the given Animation Frame as being the current frame
     * and applies it to the parent Game Object, adjusting size and origin as needed.
     *
     * @method Phaser.Animations.AnimationState#setCurrentFrame
     * @fires Phaser.Animations.Events#ANIMATION_UPDATE
     * @fires Phaser.Animations.Events#ANIMATION_STOP
     * @since 3.4.0
     *
     * @param {Phaser.Animations.AnimationFrame} animationFrame - The animation frame to change to.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object this Animation Component belongs to.
     */
    setCurrentFrame: function (animationFrame)
    {
        var gameObject = this.parent;

        this.currentFrame = animationFrame;

        gameObject.texture = animationFrame.frame.texture;
        gameObject.frame = animationFrame.frame;

        if (gameObject.isCropped)
        {
            gameObject.frame.updateCropUVs(gameObject._crop, gameObject.flipX, gameObject.flipY);
        }

        if (animationFrame.setAlpha)
        {
            gameObject.alpha = animationFrame.alpha;
        }

        gameObject.setSizeToFrame();

        if (gameObject._originComponent)
        {
            if (animationFrame.frame.customPivot)
            {
                gameObject.setOrigin(animationFrame.frame.pivotX, animationFrame.frame.pivotY);
            }
            else
            {
                gameObject.updateDisplayOrigin();
            }
        }

        if (this.isPlaying && this.hasStarted)
        {
            this.emitEvents(Events.ANIMATION_UPDATE);

            if (this._pendingStop === 3 && this._pendingStopValue === animationFrame)
            {
                this.stop();
            }
        }

        return gameObject;
    },

    /**
     * Advances the animation to the next frame, regardless of the time or animation state.
     * If the animation is set to repeat, or yoyo, this will still take effect.
     *
     * Calling this does not change the direction of the animation. I.e. if it was currently
     * playing in reverse, calling this method doesn't then change the direction to forwards.
     *
     * @method Phaser.Animations.AnimationState#nextFrame
     * @since 3.16.0
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object this Animation Component belongs to.
     */
    nextFrame: function ()
    {
        if (this.currentAnim)
        {
            this.currentAnim.nextFrame(this);
        }

        return this.parent;
    },

    /**
     * Advances the animation to the previous frame, regardless of the time or animation state.
     * If the animation is set to repeat, or yoyo, this will still take effect.
     *
     * Calling this does not change the direction of the animation. I.e. if it was currently
     * playing in forwards, calling this method doesn't then change the direction to backwards.
     *
     * @method Phaser.Animations.AnimationState#previousFrame
     * @since 3.16.0
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object this Animation Component belongs to.
     */
    previousFrame: function ()
    {
        if (this.currentAnim)
        {
            this.currentAnim.previousFrame(this);
        }

        return this.parent;
    },

    /**
     * Get an Animation instance that has been created locally on this Sprite.
     *
     * See the `create` method for more details.
     *
     * @method Phaser.Animations.AnimationState#get
     * @since 3.50.0
     *
     * @param {string} key - The key of the Animation to retrieve.
     *
     * @return {Phaser.Animations.Animation} The Animation, or `null` if the key is invalid.
     */
    get: function (key)
    {
        return (this.anims) ? this.anims.get(key) : null;
    },

    /**
     * Checks to see if the given key is already used locally within the animations stored on this Sprite.
     *
     * @method Phaser.Animations.AnimationState#exists
     * @since 3.50.0
     *
     * @param {string} key - The key of the Animation to check.
     *
     * @return {boolean} `true` if the Animation exists locally, or `false` if the key is available, or there are no local animations.
     */
    exists: function (key)
    {
        return (this.anims) ? this.anims.has(key) : false;
    },

    /**
     * Creates a new Animation that is local specifically to this Sprite.
     *
     * When a Sprite owns an animation, it is kept out of the global Animation Manager, which means
     * you're free to use keys that may be already defined there. Unless you specifically need a Sprite
     * to have a unique animation, you should favor using global animations instead, as they allow for
     * the same animation to be used across multiple Sprites, saving on memory. However, if this Sprite
     * is the only one to use this animation, it's sensible to create it here.
     *
     * If an invalid key is given this method will return `false`.
     *
     * If you pass the key of an animation that already exists locally, that animation will be returned.
     *
     * A brand new animation is only created if the key is valid and not already in use by this Sprite.
     *
     * If you wish to re-use an existing key, call the `remove` method first, then this method.
     *
     * @method Phaser.Animations.AnimationState#create
     * @since 3.50.0
     *
     * @param {Phaser.Types.Animations.Animation} config - The configuration settings for the Animation.
     *
     * @return {(Phaser.Animations.Animation|false)} The Animation that was created, or `false` if the key is already in use.
     */
    create: function (config)
    {
        var key = config.key;

        var anim = false;

        if (key)
        {
            anim = this.get(key);

            if (!anim)
            {
                anim = new Animation(this, key, config);

                if (!this.anims)
                {
                    this.anims = new CustomMap();
                }

                this.anims.set(key, anim);
            }
        }

        return anim;
    },

    /**
     * Generate an array of {@link Phaser.Types.Animations.AnimationFrame} objects from a texture key and configuration object.
     *
     * Generates objects with string based frame names, as configured by the given {@link Phaser.Types.Animations.GenerateFrameNames}.
     *
     * It's a helper method, designed to make it easier for you to extract all of the frame names from texture atlases.
     * If you're working with a sprite sheet, see the `generateFrameNumbers` method instead.
     *
     * Example:
     *
     * If you have a texture atlases loaded called `gems` and it contains 6 frames called `ruby_0001`, `ruby_0002`, and so on,
     * then you can call this method using: `this.anims.generateFrameNames('gems', { prefix: 'ruby_', end: 6, zeroPad: 4 })`.
     *
     * The `end` value tells it to look for 6 frames, incrementally numbered, all starting with the prefix `ruby_`. The `zeroPad`
     * value tells it how many zeroes pad out the numbers. To create an animation using this method, you can do:
     *
     * ```javascript
     * this.anims.create({
     *   key: 'ruby',
     *   repeat: -1,
     *   frames: this.anims.generateFrameNames('gems', {
     *     prefix: 'ruby_',
     *     end: 6,
     *     zeroPad: 4
     *   })
     * });
     * ```
     *
     * Please see the animation examples for further details.
     *
     * @method Phaser.Animations.AnimationState#generateFrameNames
     * @since 3.50.0
     *
     * @param {string} key - The key for the texture containing the animation frames.
     * @param {Phaser.Types.Animations.GenerateFrameNames} [config] - The configuration object for the animation frame names.
     *
     * @return {Phaser.Types.Animations.AnimationFrame[]} The array of {@link Phaser.Types.Animations.AnimationFrame} objects.
     */
    generateFrameNames: function (key, config)
    {
        return this.animationManager.generateFrameNames(key, config);
    },

    /**
     * Generate an array of {@link Phaser.Types.Animations.AnimationFrame} objects from a texture key and configuration object.
     *
     * Generates objects with numbered frame names, as configured by the given {@link Phaser.Types.Animations.GenerateFrameNumbers}.
     *
     * If you're working with a texture atlas, see the `generateFrameNames` method instead.
     *
     * It's a helper method, designed to make it easier for you to extract frames from sprite sheets.
     * If you're working with a texture atlas, see the `generateFrameNames` method instead.
     *
     * Example:
     *
     * If you have a sprite sheet loaded called `explosion` and it contains 12 frames, then you can call this method using:
     * `this.anims.generateFrameNumbers('explosion', { start: 0, end: 12 })`.
     *
     * The `end` value tells it to stop after 12 frames. To create an animation using this method, you can do:
     *
     * ```javascript
     * this.anims.create({
     *   key: 'boom',
     *   frames: this.anims.generateFrameNames('explosion', {
     *     start: 0,
     *     end: 12
     *   })
     * });
     * ```
     *
     * Note that `start` is optional and you don't need to include it if the animation starts from frame 0.
     *
     * To specify an animation in reverse, swap the `start` and `end` values.
     *
     * If the frames are not sequential, you may pass an array of frame numbers instead, for example:
     *
     * `this.anims.generateFrameNumbers('explosion', { frames: [ 0, 1, 2, 1, 2, 3, 4, 0, 1, 2 ] })`
     *
     * Please see the animation examples and `GenerateFrameNumbers` config docs for further details.
     *
     * @method Phaser.Animations.AnimationState#generateFrameNumbers
     * @since 3.50.0
     *
     * @param {string} key - The key for the texture containing the animation frames.
     * @param {Phaser.Types.Animations.GenerateFrameNumbers} config - The configuration object for the animation frames.
     *
     * @return {Phaser.Types.Animations.AnimationFrame[]} The array of {@link Phaser.Types.Animations.AnimationFrame} objects.
     */
    generateFrameNumbers: function (key, config)
    {
        return this.animationManager.generateFrameNumbers(key, config);
    },

    /**
     * Removes a locally created Animation from this Sprite, based on the given key.
     *
     * Once an Animation has been removed, this Sprite cannot play it again without re-creating it.
     *
     * @method Phaser.Animations.AnimationState#remove
     * @since 3.50.0
     *
     * @param {string} key - The key of the animation to remove.
     *
     * @return {Phaser.Animations.Animation} The Animation instance that was removed from this Sprite, if the key was valid.
     */
    remove: function (key)
    {
        var anim = this.get(key);

        if (anim)
        {
            if (this.currentAnim === anim)
            {
                this.stop();
            }

            this.anims.delete(key);
        }

        return anim;
    },

    /**
     * Destroy this Animation component.
     *
     * Unregisters event listeners and cleans up its references.
     *
     * @method Phaser.Animations.AnimationState#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.animationManager.off(Events.REMOVE_ANIMATION, this.globalRemove, this);

        if (this.anims)
        {
            this.anims.clear();
        }

        this.animationManager = null;
        this.parent = null;
        this.nextAnim = null;
        this.nextAnimsQueue.length = 0;

        this.currentAnim = null;
        this.currentFrame = null;
    },

    /**
     * `true` if the current animation is paused, otherwise `false`.
     *
     * @name Phaser.Animations.AnimationState#isPaused
     * @readonly
     * @type {boolean}
     * @since 3.4.0
     */
    isPaused: {

        get: function ()
        {
            return this._paused;
        }

    }

});

module.exports = AnimationState;


/***/ }),
/* 182 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = __webpack_require__(0);

/**
 * @callback EachMapCallback<E>
 *
 * @param {string} key - The key of the Map entry.
 * @param {E} entry - The value of the Map entry.
 *
 * @return {?boolean} The callback result.
 */

/**
 * @classdesc
 * The keys of a Map can be arbitrary values.
 * 
 * ```javascript
 * var map = new Map([
 *    [ 1, 'one' ],
 *    [ 2, 'two' ],
 *    [ 3, 'three' ]
 * ]);
 * ```
 *
 * @class Map
 * @memberof Phaser.Structs
 * @constructor
 * @since 3.0.0
 *
 * @generic K
 * @generic V
 * @genericUse {V[]} - [elements]
 *
 * @param {Array.<*>} elements - An optional array of key-value pairs to populate this Map with.
 */
var Map = new Class({

    initialize:

    function Map (elements)
    {
        /**
         * The entries in this Map.
         *
         * @genericUse {Object.<string, V>} - [$type]
         *
         * @name Phaser.Structs.Map#entries
         * @type {Object.<string, *>}
         * @default {}
         * @since 3.0.0
         */
        this.entries = {};

        /**
         * The number of key / value pairs in this Map.
         *
         * @name Phaser.Structs.Map#size
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.size = 0;

        if (Array.isArray(elements))
        {
            for (var i = 0; i < elements.length; i++)
            {
                this.set(elements[i][0], elements[i][1]);
            }
        }
    },

    /**
     * Adds an element with a specified `key` and `value` to this Map.
     * If the `key` already exists, the value will be replaced.
     *
     * @method Phaser.Structs.Map#set
     * @since 3.0.0
     *
     * @genericUse {K} - [key]
     * @genericUse {V} - [value]
     * @genericUse {Phaser.Structs.Map.<K, V>} - [$return]
     *
     * @param {string} key - The key of the element to be added to this Map.
     * @param {*} value - The value of the element to be added to this Map.
     *
     * @return {Phaser.Structs.Map} This Map object.
     */
    set: function (key, value)
    {
        if (!this.has(key))
        {
            this.size++;
        }

        this.entries[key] = value;

        return this;
    },

    /**
     * Returns the value associated to the `key`, or `undefined` if there is none.
     *
     * @method Phaser.Structs.Map#get
     * @since 3.0.0
     *
     * @genericUse {K} - [key]
     * @genericUse {V} - [$return]
     *
     * @param {string} key - The key of the element to return from the `Map` object.
     *
     * @return {*} The element associated with the specified key or `undefined` if the key can't be found in this Map object.
     */
    get: function (key)
    {
        if (this.has(key))
        {
            return this.entries[key];
        }
    },

    /**
     * Returns an `Array` of all the values stored in this Map.
     *
     * @method Phaser.Structs.Map#getArray
     * @since 3.0.0
     *
     * @genericUse {V[]} - [$return]
     *
     * @return {Array.<*>} An array of the values stored in this Map.
     */
    getArray: function ()
    {
        var output = [];
        var entries = this.entries;

        for (var key in entries)
        {
            output.push(entries[key]);
        }

        return output;
    },

    /**
     * Returns a boolean indicating whether an element with the specified key exists or not.
     *
     * @method Phaser.Structs.Map#has
     * @since 3.0.0
     *
     * @genericUse {K} - [key]
     *
     * @param {string} key - The key of the element to test for presence of in this Map.
     *
     * @return {boolean} Returns `true` if an element with the specified key exists in this Map, otherwise `false`.
     */
    has: function (key)
    {
        return (this.entries.hasOwnProperty(key));
    },

    /**
     * Delete the specified element from this Map.
     *
     * @method Phaser.Structs.Map#delete
     * @since 3.0.0
     *
     * @genericUse {K} - [key]
     * @genericUse {Phaser.Structs.Map.<K, V>} - [$return]
     *
     * @param {string} key - The key of the element to delete from this Map.
     *
     * @return {Phaser.Structs.Map} This Map object.
     */
    delete: function (key)
    {
        if (this.has(key))
        {
            delete this.entries[key];
            this.size--;
        }

        return this;
    },

    /**
     * Delete all entries from this Map.
     *
     * @method Phaser.Structs.Map#clear
     * @since 3.0.0
     *
     * @genericUse {Phaser.Structs.Map.<K, V>} - [$return]
     *
     * @return {Phaser.Structs.Map} This Map object.
     */
    clear: function ()
    {
        Object.keys(this.entries).forEach(function (prop)
        {
            delete this.entries[prop];

        }, this);

        this.size = 0;

        return this;
    },

    /**
     * Returns all entries keys in this Map.
     *
     * @method Phaser.Structs.Map#keys
     * @since 3.0.0
     *
     * @genericUse {K[]} - [$return]
     *
     * @return {string[]} Array containing entries' keys.
     */
    keys: function ()
    {
        return Object.keys(this.entries);
    },

    /**
     * Returns an `Array` of all entries.
     *
     * @method Phaser.Structs.Map#values
     * @since 3.0.0
     *
     * @genericUse {V[]} - [$return]
     *
     * @return {Array.<*>} An `Array` of entries.
     */
    values: function ()
    {
        var output = [];
        var entries = this.entries;

        for (var key in entries)
        {
            output.push(entries[key]);
        }

        return output;
    },

    /**
     * Dumps the contents of this Map to the console via `console.group`.
     *
     * @method Phaser.Structs.Map#dump
     * @since 3.0.0
     */
    dump: function ()
    {
        var entries = this.entries;

        // eslint-disable-next-line no-console
        console.group('Map');

        for (var key in entries)
        {
            console.log(key, entries[key]);
        }

        // eslint-disable-next-line no-console
        console.groupEnd();
    },

    /**
     * Passes all entries in this Map to the given callback.
     *
     * @method Phaser.Structs.Map#each
     * @since 3.0.0
     *
     * @genericUse {EachMapCallback.<V>} - [callback]
     * @genericUse {Phaser.Structs.Map.<K, V>} - [$return]
     *
     * @param {EachMapCallback} callback - The callback which will receive the keys and entries held in this Map.
     *
     * @return {Phaser.Structs.Map} This Map object.
     */
    each: function (callback)
    {
        var entries = this.entries;

        for (var key in entries)
        {
            if (callback(key, entries[key]) === false)
            {
                break;
            }
        }

        return this;
    },

    /**
     * Returns `true` if the value exists within this Map. Otherwise, returns `false`.
     *
     * @method Phaser.Structs.Map#contains
     * @since 3.0.0
     *
     * @genericUse {V} - [value]
     *
     * @param {*} value - The value to search for.
     *
     * @return {boolean} `true` if the value is found, otherwise `false`.
     */
    contains: function (value)
    {
        var entries = this.entries;

        for (var key in entries)
        {
            if (entries[key] === value)
            {
                return true;
            }
        }

        return false;
    },

    /**
     * Merges all new keys from the given Map into this one.
     * If it encounters a key that already exists it will be skipped unless override is set to `true`.
     *
     * @method Phaser.Structs.Map#merge
     * @since 3.0.0
     *
     * @genericUse {Phaser.Structs.Map.<K, V>} - [map,$return]
     *
     * @param {Phaser.Structs.Map} map - The Map to merge in to this Map.
     * @param {boolean} [override=false] - Set to `true` to replace values in this Map with those from the source map, or `false` to skip them.
     *
     * @return {Phaser.Structs.Map} This Map object.
     */
    merge: function (map, override)
    {
        if (override === undefined) { override = false; }

        var local = this.entries;
        var source = map.entries;

        for (var key in source)
        {
            if (local.hasOwnProperty(key) && override)
            {
                local[key] = source[key];
            }
            else
            {
                this.set(key, source[key]);
            }
        }

        return this;
    }

});

module.exports = Map;


/***/ }),
/* 183 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Finds the key within the top level of the {@link source} object, or returns {@link defaultValue}
 *
 * @function Phaser.Utils.Objects.GetFastValue
 * @since 3.0.0
 *
 * @param {object} source - The object to search
 * @param {string} key - The key for the property on source. Must exist at the top level of the source object (no periods)
 * @param {*} [defaultValue] - The default value to use if the key does not exist.
 *
 * @return {*} The value if found; otherwise, defaultValue (null if none provided)
 */
var GetFastValue = function (source, key, defaultValue)
{
    var t = typeof(source);

    if (!source || t === 'number' || t === 'string')
    {
        return defaultValue;
    }
    else if (source.hasOwnProperty(key) && source[key] !== undefined)
    {
        return source[key];
    }
    else
    {
        return defaultValue;
    }
};

module.exports = GetFastValue;


/***/ }),
/* 184 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Add Animation Event.
 * 
 * This event is dispatched when a new animation is added to the global Animation Manager.
 * 
 * This can happen either as a result of an animation instance being added to the Animation Manager,
 * or the Animation Manager creating a new animation directly.
 *
 * @event Phaser.Animations.Events#ADD_ANIMATION
 * @since 3.0.0
 * 
 * @param {string} key - The key of the Animation that was added to the global Animation Manager.
 * @param {Phaser.Animations.Animation} animation - An instance of the newly created Animation.
 */
module.exports = 'add';


/***/ }),
/* 185 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Animation Complete Event.
 *
 * This event is dispatched by a Sprite when an animation playing on it completes playback.
 * This happens when the animation gets to the end of its sequence, factoring in any delays
 * or repeats it may have to process.
 *
 * An animation that is set to loop, or repeat forever, will never fire this event, because
 * it never actually completes. If you need to handle this, listen for the `ANIMATION_STOP`
 * event instead, as this is emitted when the animation is stopped directly.
 *
 * Listen for it on the Sprite using `sprite.on('animationcomplete', listener)`
 *
 * The animation event flow is as follows:
 *
 * 1. `ANIMATION_START`
 * 2. `ANIMATION_UPDATE` (repeated for however many frames the animation has)
 * 3. `ANIMATION_REPEAT` (only if the animation is set to repeat, it then emits more update events after this)
 * 4. `ANIMATION_COMPLETE` (only if there is a finite, or zero, repeat count)
 * 5. `ANIMATION_COMPLETE_KEY` (only if there is a finite, or zero, repeat count)
 *
 * If the animation is stopped directly, the `ANIMATION_STOP` event is dispatched instead of `ANIMATION_COMPLETE`.
 *
 * If the animation is restarted while it is already playing, `ANIMATION_RESTART` is emitted.
 *
 * @event Phaser.Animations.Events#ANIMATION_COMPLETE
 * @since 3.50.0
 *
 * @param {Phaser.Animations.Animation} animation - A reference to the Animation that completed.
 * @param {Phaser.Animations.AnimationFrame} frame - The current Animation Frame of the Animation.
 * @param {Phaser.GameObjects.Sprite} gameObject - A reference to the Game Object on which the animation updated.
 * @param {string} frameKey - The unique key of the Animation Frame within the Animation.
 */
module.exports = 'animationcomplete';


/***/ }),
/* 186 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Animation Complete Dynamic Key Event.
 *
 * This event is dispatched by a Sprite when an animation playing on it completes playback.
 * This happens when the animation gets to the end of its sequence, factoring in any delays
 * or repeats it may have to process.
 *
 * An animation that is set to loop, or repeat forever, will never fire this event, because
 * it never actually completes. If you need to handle this, listen for the `ANIMATION_STOP`
 * event instead, as this is emitted when the animation is stopped directly.
 *
 * The difference between this and the `ANIMATION_COMPLETE` event is that this one has a
 * dynamic event name that contains the name of the animation within it. For example,
 * if you had an animation called `explode` you could listen for the completion of that
 * specific animation by using: `sprite.on('animationcomplete-explode', listener)`. Or, if you
 * wish to use types: `sprite.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'explode', listener)`.
 *
 * The animation event flow is as follows:
 *
 * 1. `ANIMATION_START`
 * 2. `ANIMATION_UPDATE` (repeated for however many frames the animation has)
 * 3. `ANIMATION_REPEAT` (only if the animation is set to repeat, it then emits more update events after this)
 * 4. `ANIMATION_COMPLETE` (only if there is a finite, or zero, repeat count)
 * 5. `ANIMATION_COMPLETE_KEY` (only if there is a finite, or zero, repeat count)
 *
 * If the animation is stopped directly, the `ANIMATION_STOP` event is dispatched instead of `ANIMATION_COMPLETE`.
 *
 * If the animation is restarted while it is already playing, `ANIMATION_RESTART` is emitted.
 *
 * @event Phaser.Animations.Events#ANIMATION_COMPLETE_KEY
 * @since 3.50.0
 *
 * @param {Phaser.Animations.Animation} animation - A reference to the Animation that completed.
 * @param {Phaser.Animations.AnimationFrame} frame - The current Animation Frame of the Animation.
 * @param {Phaser.GameObjects.Sprite} gameObject - A reference to the Game Object on which the animation updated.
 * @param {string} frameKey - The unique key of the Animation Frame within the Animation.
 */
module.exports = 'animationcomplete-';


/***/ }),
/* 187 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Animation Repeat Event.
 *
 * This event is dispatched by a Sprite when an animation repeats playing on it.
 * This happens if the animation was created, or played, with a `repeat` value specified.
 *
 * An animation will repeat when it reaches the end of its sequence.
 *
 * Listen for it on the Sprite using `sprite.on('animationrepeat', listener)`
 *
 * The animation event flow is as follows:
 *
 * 1. `ANIMATION_START`
 * 2. `ANIMATION_UPDATE` (repeated for however many frames the animation has)
 * 3. `ANIMATION_REPEAT` (only if the animation is set to repeat, it then emits more update events after this)
 * 4. `ANIMATION_COMPLETE` (only if there is a finite, or zero, repeat count)
 * 5. `ANIMATION_COMPLETE_KEY` (only if there is a finite, or zero, repeat count)
 *
 * If the animation is stopped directly, the `ANIMATION_STOP` event is dispatched instead of `ANIMATION_COMPLETE`.
 *
 * If the animation is restarted while it is already playing, `ANIMATION_RESTART` is emitted.
 *
 * @event Phaser.Animations.Events#ANIMATION_REPEAT
 * @since 3.50.0
 *
 * @param {Phaser.Animations.Animation} animation - A reference to the Animation that has repeated.
 * @param {Phaser.Animations.AnimationFrame} frame - The current Animation Frame of the Animation.
 * @param {Phaser.GameObjects.Sprite} gameObject - A reference to the Game Object on which the animation repeated.
 * @param {string} frameKey - The unique key of the Animation Frame within the Animation.
 */
module.exports = 'animationrepeat';


/***/ }),
/* 188 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Animation Restart Event.
 *
 * This event is dispatched by a Sprite when an animation restarts playing on it.
 * This only happens when the `Sprite.anims.restart` method is called.
 *
 * Listen for it on the Sprite using `sprite.on('animationrestart', listener)`
 *
 * The animation event flow is as follows:
 *
 * 1. `ANIMATION_START`
 * 2. `ANIMATION_UPDATE` (repeated for however many frames the animation has)
 * 3. `ANIMATION_REPEAT` (only if the animation is set to repeat, it then emits more update events after this)
 * 4. `ANIMATION_COMPLETE` (only if there is a finite, or zero, repeat count)
 * 5. `ANIMATION_COMPLETE_KEY` (only if there is a finite, or zero, repeat count)
 *
 * If the animation is stopped directly, the `ANIMATION_STOP` event is dispatched instead of `ANIMATION_COMPLETE`.
 *
 * If the animation is restarted while it is already playing, `ANIMATION_RESTART` is emitted.
 *
 * @event Phaser.Animations.Events#ANIMATION_RESTART
 * @since 3.50.0
 *
 * @param {Phaser.Animations.Animation} animation - A reference to the Animation that has restarted.
 * @param {Phaser.Animations.AnimationFrame} frame - The current Animation Frame of the Animation.
 * @param {Phaser.GameObjects.Sprite} gameObject - A reference to the Game Object on which the animation restarted.
 * @param {string} frameKey - The unique key of the Animation Frame within the Animation.
 */
module.exports = 'animationrestart';


/***/ }),
/* 189 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Animation Start Event.
 *
 * This event is dispatched by a Sprite when an animation starts playing on it.
 * This happens when the animation is played, factoring in any delay that may have been specified.
 * This event happens after the delay has expired and prior to the first update event.
 *
 * Listen for it on the Sprite using `sprite.on('animationstart', listener)`
 *
 * The animation event flow is as follows:
 *
 * 1. `ANIMATION_START`
 * 2. `ANIMATION_UPDATE` (repeated for however many frames the animation has)
 * 3. `ANIMATION_REPEAT` (only if the animation is set to repeat, it then emits more update events after this)
 * 4. `ANIMATION_COMPLETE` (only if there is a finite, or zero, repeat count)
 * 5. `ANIMATION_COMPLETE_KEY` (only if there is a finite, or zero, repeat count)
 *
 * If the animation is stopped directly, the `ANIMATION_STOP` event is dispatched instead of `ANIMATION_COMPLETE`.
 *
 * If the animation is restarted while it is already playing, `ANIMATION_RESTART` is emitted.
 *
 * @event Phaser.Animations.Events#ANIMATION_START
 * @since 3.50.0
 *
 * @param {Phaser.Animations.Animation} animation - A reference to the Animation that has started.
 * @param {Phaser.Animations.AnimationFrame} frame - The current Animation Frame of the Animation.
 * @param {Phaser.GameObjects.Sprite} gameObject - A reference to the Game Object on which the animation started.
 * @param {string} frameKey - The unique key of the Animation Frame within the Animation.
 */
module.exports = 'animationstart';


/***/ }),
/* 190 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Animation Stop Event.
 *
 * This event is dispatched by a Sprite when an animation is stopped on it. An animation
 * will only be stopeed if a method such as `Sprite.stop` or `Sprite.anims.stopAfterDelay`
 * is called. It can also be emitted if a new animation is started before the current one completes.
 *
 * Listen for it on the Sprite using `sprite.on('animationstop', listener)`
 *
 * The animation event flow is as follows:
 *
 * 1. `ANIMATION_START`
 * 2. `ANIMATION_UPDATE` (repeated for however many frames the animation has)
 * 3. `ANIMATION_REPEAT` (only if the animation is set to repeat, it then emits more update events after this)
 * 4. `ANIMATION_COMPLETE` (only if there is a finite, or zero, repeat count)
 * 5. `ANIMATION_COMPLETE_KEY` (only if there is a finite, or zero, repeat count)
 *
 * If the animation is stopped directly, the `ANIMATION_STOP` event is dispatched instead of `ANIMATION_COMPLETE`.
 *
 * If the animation is restarted while it is already playing, `ANIMATION_RESTART` is emitted.
 *
 * @event Phaser.Animations.Events#ANIMATION_STOP
 * @since 3.50.0
 *
 * @param {Phaser.Animations.Animation} animation - A reference to the Animation that has stopped.
 * @param {Phaser.Animations.AnimationFrame} frame - The current Animation Frame of the Animation.
 * @param {Phaser.GameObjects.Sprite} gameObject - A reference to the Game Object on which the animation stopped.
 * @param {string} frameKey - The unique key of the Animation Frame within the Animation.
 */
module.exports = 'animationstop';


/***/ }),
/* 191 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Animation Update Event.
 *
 * This event is dispatched by a Sprite when an animation playing on it updates. This happens when the animation changes frame.
 * An animation will change frame based on the frme rate and other factors like `timeScale` and `delay`. It can also change
 * frame when stopped or restarted.
 *
 * Listen for it on the Sprite using `sprite.on('animationupdate', listener)`
 *
 * If an animation is playing faster than the game frame-rate can handle, it's entirely possible for it to emit several
 * update events in a single game frame, so please be aware of this in your code. The **final** event received that frame
 * is the one that is rendered to the game.
 *
 * The animation event flow is as follows:
 *
 * 1. `ANIMATION_START`
 * 2. `ANIMATION_UPDATE` (repeated for however many frames the animation has)
 * 3. `ANIMATION_REPEAT` (only if the animation is set to repeat, it then emits more update events after this)
 * 4. `ANIMATION_COMPLETE` (only if there is a finite, or zero, repeat count)
 * 5. `ANIMATION_COMPLETE_KEY` (only if there is a finite, or zero, repeat count)
 *
 * If the animation is stopped directly, the `ANIMATION_STOP` event is dispatched instead of `ANIMATION_COMPLETE`.
 *
 * If the animation is restarted while it is already playing, `ANIMATION_RESTART` is emitted.
 *
 * @event Phaser.Animations.Events#ANIMATION_UPDATE
 * @since 3.50.0
 *
 * @param {Phaser.Animations.Animation} animation - A reference to the Animation that has updated.
 * @param {Phaser.Animations.AnimationFrame} frame - The current Animation Frame of the Animation.
 * @param {Phaser.GameObjects.Sprite} gameObject - A reference to the Game Object on which the animation updated.
 * @param {string} frameKey - The unique key of the Animation Frame within the Animation.
 */
module.exports = 'animationupdate';


/***/ }),
/* 192 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Pause All Animations Event.
 * 
 * This event is dispatched when the global Animation Manager is told to pause.
 * 
 * When this happens all current animations will stop updating, although it doesn't necessarily mean
 * that the game has paused as well.
 *
 * @event Phaser.Animations.Events#PAUSE_ALL
 * @since 3.0.0
 */
module.exports = 'pauseall';


/***/ }),
/* 193 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Remove Animation Event.
 * 
 * This event is dispatched when an animation is removed from the global Animation Manager.
 *
 * @event Phaser.Animations.Events#REMOVE_ANIMATION
 * @since 3.0.0
 * 
 * @param {string} key - The key of the Animation that was removed from the global Animation Manager.
 * @param {Phaser.Animations.Animation} animation - An instance of the removed Animation.
 */
module.exports = 'remove';


/***/ }),
/* 194 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Resume All Animations Event.
 * 
 * This event is dispatched when the global Animation Manager resumes, having been previously paused.
 * 
 * When this happens all current animations will continue updating again.
 *
 * @event Phaser.Animations.Events#RESUME_ALL
 * @since 3.0.0
 */
module.exports = 'resumeall';


/***/ }),
/* 195 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Clamp = __webpack_require__(4);
var Class = __webpack_require__(0);
var Events = __webpack_require__(38);
var FindClosestInSorted = __webpack_require__(196);
var Frame = __webpack_require__(197);
var GetValue = __webpack_require__(12);
var SortByDigits = __webpack_require__(198);

/**
 * @classdesc
 * A Frame based Animation.
 *
 * Animations in Phaser consist of a sequence of `AnimationFrame` objects, which are managed by
 * this class, along with properties that impact playback, such as the animations frame rate
 * or delay.
 *
 * This class contains all of the properties and methods needed to handle playback of the animation
 * directly to an `AnimationState` instance, which is owned by a Sprite, or similar Game Object.
 *
 * You don't typically create an instance of this class directly, but instead go via
 * either the `AnimationManager` or the `AnimationState` and use their `create` methods,
 * depending on if you need a global animation, or local to a specific Sprite.
 *
 * @class Animation
 * @memberof Phaser.Animations
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Animations.AnimationManager} manager - A reference to the global Animation Manager
 * @param {string} key - The unique identifying string for this animation.
 * @param {Phaser.Types.Animations.Animation} config - The Animation configuration.
 */
var Animation = new Class({

    initialize:

    function Animation (manager, key, config)
    {
        /**
         * A reference to the global Animation Manager.
         *
         * @name Phaser.Animations.Animation#manager
         * @type {Phaser.Animations.AnimationManager}
         * @since 3.0.0
         */
        this.manager = manager;

        /**
         * The unique identifying string for this animation.
         *
         * @name Phaser.Animations.Animation#key
         * @type {string}
         * @since 3.0.0
         */
        this.key = key;

        /**
         * A frame based animation (as opposed to a bone based animation)
         *
         * @name Phaser.Animations.Animation#type
         * @type {string}
         * @default frame
         * @since 3.0.0
         */
        this.type = 'frame';

        /**
         * Extract all the frame data into the frames array.
         *
         * @name Phaser.Animations.Animation#frames
         * @type {Phaser.Animations.AnimationFrame[]}
         * @since 3.0.0
         */
        this.frames = this.getFrames(
            manager.textureManager,
            GetValue(config, 'frames', []),
            GetValue(config, 'defaultTextureKey', null),
            GetValue(config, 'sortFrames', true)
        );

        /**
         * The frame rate of playback in frames per second (default 24 if duration is null)
         *
         * @name Phaser.Animations.Animation#frameRate
         * @type {integer}
         * @default 24
         * @since 3.0.0
         */
        this.frameRate = GetValue(config, 'frameRate', null);

        /**
         * How long the animation should play for, in milliseconds.
         * If the `frameRate` property has been set then it overrides this value,
         * otherwise the `frameRate` is derived from `duration`.
         *
         * @name Phaser.Animations.Animation#duration
         * @type {integer}
         * @since 3.0.0
         */
        this.duration = GetValue(config, 'duration', null);

        /**
         * How many ms per frame, not including frame specific modifiers.
         *
         * @name Phaser.Animations.Animation#msPerFrame
         * @type {integer}
         * @since 3.0.0
         */
        this.msPerFrame;

        /**
         * Skip frames if the time lags, or always advanced anyway?
         *
         * @name Phaser.Animations.Animation#skipMissedFrames
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.skipMissedFrames = GetValue(config, 'skipMissedFrames', true);

        /**
         * The delay in ms before the playback will begin.
         *
         * @name Phaser.Animations.Animation#delay
         * @type {integer}
         * @default 0
         * @since 3.0.0
         */
        this.delay = GetValue(config, 'delay', 0);

        /**
         * Number of times to repeat the animation. Set to -1 to repeat forever.
         *
         * @name Phaser.Animations.Animation#repeat
         * @type {integer}
         * @default 0
         * @since 3.0.0
         */
        this.repeat = GetValue(config, 'repeat', 0);

        /**
         * The delay in ms before the a repeat play starts.
         *
         * @name Phaser.Animations.Animation#repeatDelay
         * @type {integer}
         * @default 0
         * @since 3.0.0
         */
        this.repeatDelay = GetValue(config, 'repeatDelay', 0);

        /**
         * Should the animation yoyo (reverse back down to the start) before repeating?
         *
         * @name Phaser.Animations.Animation#yoyo
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.yoyo = GetValue(config, 'yoyo', false);

        /**
         * Should the GameObject's `visible` property be set to `true` when the animation starts to play?
         *
         * @name Phaser.Animations.Animation#showOnStart
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.showOnStart = GetValue(config, 'showOnStart', false);

        /**
         * Should the GameObject's `visible` property be set to `false` when the animation finishes?
         *
         * @name Phaser.Animations.Animation#hideOnComplete
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.hideOnComplete = GetValue(config, 'hideOnComplete', false);

        /**
         * Global pause. All Game Objects using this Animation instance are impacted by this property.
         *
         * @name Phaser.Animations.Animation#paused
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.paused = false;

        this.calculateDuration(this, this.getTotalFrames(), this.duration, this.frameRate);

        if (this.manager.on)
        {
            this.manager.on(Events.PAUSE_ALL, this.pause, this);
            this.manager.on(Events.RESUME_ALL, this.resume, this);
        }
    },

    /**
     * Gets the total number of frames in this animation.
     *
     * @method Phaser.Animations.Animation#getTotalFrames
     * @since 3.50.0
     *
     * @return {number} The total number of frames in this animation.
     */
    getTotalFrames: function ()
    {
        return this.frames.length;
    },

    /**
     * Calculates the duration, frame rate and msPerFrame values.
     *
     * @method Phaser.Animations.Animation#calculateDuration
     * @since 3.50.0
     *
     * @param {(Phaser.Animations.Animation|Phaser.GameObjects.Components.Animation)} target - The target to set the values on.
     * @param {number} totalFrames - The total number of frames in the animation.
     * @param {number} duration - The duration to calculate the frame rate from.
     * @param {number} frameRate - The frame ate to calculate the duration from.
     */
    calculateDuration: function (target, totalFrames, duration, frameRate)
    {
        if (duration === null && frameRate === null)
        {
            //  No duration or frameRate given, use default frameRate of 24fps
            target.frameRate = 24;
            target.duration = (24 / totalFrames) * 1000;
        }
        else if (duration && frameRate === null)
        {
            //  Duration given but no frameRate, so set the frameRate based on duration
            //  I.e. 12 frames in the animation, duration = 4000 ms
            //  So frameRate is 12 / (4000 / 1000) = 3 fps
            target.duration = duration;
            target.frameRate = totalFrames / (duration / 1000);
        }
        else
        {
            //  frameRate given, derive duration from it (even if duration also specified)
            //  I.e. 15 frames in the animation, frameRate = 30 fps
            //  So duration is 15 / 30 = 0.5 * 1000 (half a second, or 500ms)
            target.frameRate = frameRate;
            target.duration = (totalFrames / frameRate) * 1000;
        }

        target.msPerFrame = 1000 / target.frameRate;
    },

    /**
     * Add frames to the end of the animation.
     *
     * @method Phaser.Animations.Animation#addFrame
     * @since 3.0.0
     *
     * @param {(string|Phaser.Types.Animations.AnimationFrame[])} config - Either a string, in which case it will use all frames from a texture with the matching key, or an array of Animation Frame configuration objects.
     *
     * @return {this} This Animation object.
     */
    addFrame: function (config)
    {
        return this.addFrameAt(this.frames.length, config);
    },

    /**
     * Add frame/s into the animation.
     *
     * @method Phaser.Animations.Animation#addFrameAt
     * @since 3.0.0
     *
     * @param {integer} index - The index to insert the frame at within the animation.
     * @param {(string|Phaser.Types.Animations.AnimationFrame[])} config - Either a string, in which case it will use all frames from a texture with the matching key, or an array of Animation Frame configuration objects.
     *
     * @return {this} This Animation object.
     */
    addFrameAt: function (index, config)
    {
        var newFrames = this.getFrames(this.manager.textureManager, config);

        if (newFrames.length > 0)
        {
            if (index === 0)
            {
                this.frames = newFrames.concat(this.frames);
            }
            else if (index === this.frames.length)
            {
                this.frames = this.frames.concat(newFrames);
            }
            else
            {
                var pre = this.frames.slice(0, index);
                var post = this.frames.slice(index);

                this.frames = pre.concat(newFrames, post);
            }

            this.updateFrameSequence();
        }

        return this;
    },

    /**
     * Check if the given frame index is valid.
     *
     * @method Phaser.Animations.Animation#checkFrame
     * @since 3.0.0
     *
     * @param {integer} index - The index to be checked.
     *
     * @return {boolean} `true` if the index is valid, otherwise `false`.
     */
    checkFrame: function (index)
    {
        return (index >= 0 && index < this.frames.length);
    },

    /**
     * Called internally when this Animation first starts to play.
     * Sets the accumulator and nextTick properties.
     *
     * @method Phaser.Animations.Animation#getFirstTick
     * @protected
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Components.Animation} component - The Animation Component belonging to the Game Object invoking this call.
     */
    getFirstTick: function (component)
    {
        //  When is the first update due?
        component.accumulator = 0;

        component.nextTick = component.msPerFrame + component.currentFrame.duration;
    },

    /**
     * Returns the AnimationFrame at the provided index
     *
     * @method Phaser.Animations.Animation#getFrameAt
     * @protected
     * @since 3.0.0
     *
     * @param {integer} index - The index in the AnimationFrame array
     *
     * @return {Phaser.Animations.AnimationFrame} The frame at the index provided from the animation sequence
     */
    getFrameAt: function (index)
    {
        return this.frames[index];
    },

    /**
     * Creates AnimationFrame instances based on the given frame data.
     *
     * @method Phaser.Animations.Animation#getFrames
     * @since 3.0.0
     *
     * @param {Phaser.Textures.TextureManager} textureManager - A reference to the global Texture Manager.
     * @param {(string|Phaser.Types.Animations.AnimationFrame[])} frames - Either a string, in which case it will use all frames from a texture with the matching key, or an array of Animation Frame configuration objects.
     * @param {string} [defaultTextureKey] - The key to use if no key is set in the frame configuration object.
     *
     * @return {Phaser.Animations.AnimationFrame[]} An array of newly created AnimationFrame instances.
     */
    getFrames: function (textureManager, frames, defaultTextureKey, sortFrames)
    {
        if (sortFrames === undefined) { sortFrames = true; }

        var out = [];
        var prev;
        var animationFrame;
        var index = 1;
        var i;
        var textureKey;

        //  if frames is a string, we'll get all the frames from the texture manager as if it's a sprite sheet
        if (typeof frames === 'string')
        {
            textureKey = frames;

            var texture = textureManager.get(textureKey);
            var frameKeys = texture.getFrameNames();

            if (sortFrames)
            {
                SortByDigits(frameKeys);
            }

            frames = [];

            frameKeys.forEach(function (value)
            {
                frames.push({ key: textureKey, frame: value });
            });
        }

        if (!Array.isArray(frames) || frames.length === 0)
        {
            return out;
        }

        for (i = 0; i < frames.length; i++)
        {
            var item = frames[i];

            var key = GetValue(item, 'key', defaultTextureKey);

            if (!key)
            {
                continue;
            }

            //  Could be an integer or a string
            var frame = GetValue(item, 'frame', 0);

            //  The actual texture frame
            var textureFrame = textureManager.getFrame(key, frame);

            animationFrame = new Frame(key, frame, index, textureFrame);

            animationFrame.duration = GetValue(item, 'duration', 0);

            animationFrame.isFirst = (!prev);

            //  The previously created animationFrame
            if (prev)
            {
                prev.nextFrame = animationFrame;

                animationFrame.prevFrame = prev;
            }

            out.push(animationFrame);

            prev = animationFrame;

            index++;
        }

        if (out.length > 0)
        {
            animationFrame.isLast = true;

            //  Link them end-to-end, so they loop
            animationFrame.nextFrame = out[0];

            out[0].prevFrame = animationFrame;

            //  Generate the progress data

            var slice = 1 / (out.length - 1);

            for (i = 0; i < out.length; i++)
            {
                out[i].progress = i * slice;
            }
        }

        return out;
    },

    /**
     * Called internally. Sets the accumulator and nextTick values of the current Animation.
     *
     * @method Phaser.Animations.Animation#getNextTick
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Components.Animation} component - The Animation Component belonging to the Game Object invoking this call.
     */
    getNextTick: function (component)
    {
        component.accumulator -= component.nextTick;

        component.nextTick = component.msPerFrame + component.currentFrame.duration;
    },

    /**
     * Returns the frame closest to the given progress value between 0 and 1.
     *
     * @method Phaser.Animations.Animation#getFrameByProgress
     * @since 3.4.0
     *
     * @param {number} value - A value between 0 and 1.
     *
     * @return {Phaser.Animations.AnimationFrame} The frame closest to the given progress value.
     */
    getFrameByProgress: function (value)
    {
        value = Clamp(value, 0, 1);

        return FindClosestInSorted(value, this.frames, 'progress');
    },

    /**
     * Advance the animation frame.
     *
     * @method Phaser.Animations.Animation#nextFrame
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Components.Animation} component - The Animation Component to advance.
     */
    nextFrame: function (component)
    {
        var frame = component.currentFrame;

        if (frame.isLast)
        {
            //  We're at the end of the animation

            //  Yoyo? (happens before repeat)
            if (component.yoyo)
            {
                this.handleYoyoFrame(component, false);
            }
            else if (component.repeatCounter > 0)
            {
                //  Repeat (happens before complete)

                if (component.inReverse && component.forward)
                {
                    component.forward = false;
                }
                else
                {
                    this.repeatAnimation(component);
                }
            }
            else
            {
                component.complete();
            }
        }
        else
        {
            this.updateAndGetNextTick(component, frame.nextFrame);
        }
    },

    /**
     * Handle the yoyo functionality in nextFrame and previousFrame methods.
     *
     * @method Phaser.Animations.Animation#handleYoyoFrame
     * @private
     * @since 3.12.0
     *
     * @param {Phaser.GameObjects.Components.Animation} component - The Animation Component to advance.
     * @param {boolean} isReverse - Is animation in reverse mode? (Default: false)
     */
    handleYoyoFrame: function (component, isReverse)
    {
        if (!isReverse) { isReverse = false; }

        if (component.inReverse === !isReverse && component.repeatCounter > 0)
        {
            if (component.repeatDelay === 0 || component.pendingRepeat)
            {
                component.forward = isReverse;
            }

            this.repeatAnimation(component);

            return;
        }

        if (component.inReverse !== isReverse && component.repeatCounter === 0)
        {
            component.complete();

            return;
        }

        component.forward = isReverse;

        var frame = (isReverse) ? component.currentFrame.nextFrame : component.currentFrame.prevFrame;

        this.updateAndGetNextTick(component, frame);
    },

    /**
     * Returns the animation last frame.
     *
     * @method Phaser.Animations.Animation#getLastFrame
     * @since 3.12.0
     *
     * @return {Phaser.Animations.AnimationFrame} component - The Animation Last Frame.
     */
    getLastFrame: function ()
    {
        return this.frames[this.frames.length - 1];
    },

    /**
     * Called internally when the Animation is playing backwards.
     * Sets the previous frame, causing a yoyo, repeat, complete or update, accordingly.
     *
     * @method Phaser.Animations.Animation#previousFrame
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Components.Animation} component - The Animation Component belonging to the Game Object invoking this call.
     */
    previousFrame: function (component)
    {
        var frame = component.currentFrame;

        if (frame.isFirst)
        {
            //  We're at the start of the animation
            if (component.yoyo)
            {
                this.handleYoyoFrame(component, true);
            }
            else if (component.repeatCounter > 0)
            {
                if (component.inReverse && !component.forward)
                {
                    this.repeatAnimation(component);
                }
                else
                {
                    //  Repeat (happens before complete)
                    component.forward = true;

                    this.repeatAnimation(component);
                }
            }
            else
            {
                component.complete();
            }
        }
        else
        {
            this.updateAndGetNextTick(component, frame.prevFrame);
        }
    },

    /**
     * Update Frame and Wait next tick.
     *
     * @method Phaser.Animations.Animation#updateAndGetNextTick
     * @private
     * @since 3.12.0
     *
     * @param {Phaser.Animations.AnimationFrame} frame - An Animation frame.
     */
    updateAndGetNextTick: function (component, frame)
    {
        component.setCurrentFrame(frame);

        this.getNextTick(component);
    },

    /**
     * Removes the given AnimationFrame from this Animation instance.
     * This is a global action. Any Game Object using this Animation will be impacted by this change.
     *
     * @method Phaser.Animations.Animation#removeFrame
     * @since 3.0.0
     *
     * @param {Phaser.Animations.AnimationFrame} frame - The AnimationFrame to be removed.
     *
     * @return {this} This Animation object.
     */
    removeFrame: function (frame)
    {
        var index = this.frames.indexOf(frame);

        if (index !== -1)
        {
            this.removeFrameAt(index);
        }

        return this;
    },

    /**
     * Removes a frame from the AnimationFrame array at the provided index
     * and updates the animation accordingly.
     *
     * @method Phaser.Animations.Animation#removeFrameAt
     * @since 3.0.0
     *
     * @param {integer} index - The index in the AnimationFrame array
     *
     * @return {this} This Animation object.
     */
    removeFrameAt: function (index)
    {
        this.frames.splice(index, 1);

        this.updateFrameSequence();

        return this;
    },

    /**
     * Called internally during playback. Forces the animation to repeat, providing there are enough counts left
     * in the repeat counter.
     *
     * @method Phaser.Animations.Animation#repeatAnimation
     * @fires Phaser.Animations.Events#ANIMATION_REPEAT
     * @fires Phaser.Animations.Events#SPRITE_ANIMATION_REPEAT
     * @fires Phaser.Animations.Events#SPRITE_ANIMATION_KEY_REPEAT
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Components.Animation} component - The Animation Component belonging to the Game Object invoking this call.
     */
    repeatAnimation: function (component)
    {
        if (component._pendingStop === 2)
        {
            if (component._pendingStopValue === 0)
            {
                return component.stop();
            }
            else
            {
                component._pendingStopValue--;
            }
        }

        if (component.repeatDelay > 0 && !component.pendingRepeat)
        {
            component.pendingRepeat = true;
            component.accumulator -= component.nextTick;
            component.nextTick += component.repeatDelay;
        }
        else
        {
            component.repeatCounter--;

            if (component.forward)
            {
                component.setCurrentFrame(component.currentFrame.nextFrame);
            }
            else
            {
                component.setCurrentFrame(component.currentFrame.prevFrame);
            }

            if (component.isPlaying)
            {
                this.getNextTick(component);

                component.handleRepeat();
            }
        }
    },

    /**
     * Converts the animation data to JSON.
     *
     * @method Phaser.Animations.Animation#toJSON
     * @since 3.0.0
     *
     * @return {Phaser.Types.Animations.JSONAnimation} The resulting JSONAnimation formatted object.
     */
    toJSON: function ()
    {
        var output = {
            key: this.key,
            type: this.type,
            frames: [],
            frameRate: this.frameRate,
            duration: this.duration,
            skipMissedFrames: this.skipMissedFrames,
            delay: this.delay,
            repeat: this.repeat,
            repeatDelay: this.repeatDelay,
            yoyo: this.yoyo,
            showOnStart: this.showOnStart,
            hideOnComplete: this.hideOnComplete
        };

        this.frames.forEach(function (frame)
        {
            output.frames.push(frame.toJSON());
        });

        return output;
    },

    /**
     * Called internally whenever frames are added to, or removed from, this Animation.
     *
     * @method Phaser.Animations.Animation#updateFrameSequence
     * @since 3.0.0
     *
     * @return {this} This Animation object.
     */
    updateFrameSequence: function ()
    {
        var len = this.frames.length;
        var slice = 1 / (len - 1);

        var frame;

        for (var i = 0; i < len; i++)
        {
            frame = this.frames[i];

            frame.index = i + 1;
            frame.isFirst = false;
            frame.isLast = false;
            frame.progress = i * slice;

            if (i === 0)
            {
                frame.isFirst = true;

                if (len === 1)
                {
                    frame.isLast = true;
                    frame.nextFrame = frame;
                    frame.prevFrame = frame;
                }
                else
                {
                    frame.isLast = false;
                    frame.prevFrame = this.frames[len - 1];
                    frame.nextFrame = this.frames[i + 1];
                }
            }
            else if (i === len - 1 && len > 1)
            {
                frame.isLast = true;
                frame.prevFrame = this.frames[len - 2];
                frame.nextFrame = this.frames[0];
            }
            else if (len > 1)
            {
                frame.prevFrame = this.frames[i - 1];
                frame.nextFrame = this.frames[i + 1];
            }
        }

        return this;
    },

    /**
     * Pauses playback of this Animation. The paused state is set immediately.
     *
     * @method Phaser.Animations.Animation#pause
     * @since 3.0.0
     *
     * @return {this} This Animation object.
     */
    pause: function ()
    {
        this.paused = true;

        return this;
    },

    /**
     * Resumes playback of this Animation. The paused state is reset immediately.
     *
     * @method Phaser.Animations.Animation#resume
     * @since 3.0.0
     *
     * @return {this} This Animation object.
     */
    resume: function ()
    {
        this.paused = false;

        return this;
    },

    /**
     * Destroys this Animation instance. It will remove all event listeners,
     * remove this animation and its key from the global Animation Manager,
     * and then destroy all Animation Frames in turn.
     *
     * @method Phaser.Animations.Animation#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        if (this.manager.off)
        {
            this.manager.off(Events.PAUSE_ALL, this.pause, this);
            this.manager.off(Events.RESUME_ALL, this.resume, this);
        }

        this.manager.remove(this.key);

        for (var i = 0; i < this.frames.length; i++)
        {
            this.frames[i].destroy();
        }

        this.frames = [];

        this.manager = null;
    }

});

module.exports = Animation;


/***/ }),
/* 196 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Searches a pre-sorted array for the closet value to the given number.
 *
 * If the `key` argument is given it will assume the array contains objects that all have the required `key` property name,
 * and will check for the closest value of those to the given number.
 *
 * @function Phaser.Utils.Array.FindClosestInSorted
 * @since 3.0.0
 *
 * @param {number} value - The value to search for in the array.
 * @param {array} array - The array to search, which must be sorted.
 * @param {string} [key] - An optional property key. If specified the array elements property will be checked against value.
 *
 * @return {(number|any)} The nearest value found in the array, or if a `key` was given, the nearest object with the matching property value.
 */
var FindClosestInSorted = function (value, array, key)
{
    if (!array.length)
    {
        return NaN;
    }
    else if (array.length === 1)
    {
        return array[0];
    }

    var i = 1;
    var low;
    var high;

    if (key)
    {
        if (value < array[0][key])
        {
            return array[0];
        }

        while (array[i][key] < value)
        {
            i++;
        }
    }
    else
    {
        while (array[i] < value)
        {
            i++;
        }
    }

    if (i > array.length)
    {
        i = array.length;
    }

    if (key)
    {
        low = array[i - 1][key];
        high = array[i][key];

        return ((high - value) <= (value - low)) ? array[i] : array[i - 1];
    }
    else
    {
        low = array[i - 1];
        high = array[i];

        return ((high - value) <= (value - low)) ? high : low;
    }
};

module.exports = FindClosestInSorted;


/***/ }),
/* 197 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = __webpack_require__(0);

/**
 * @classdesc
 * A single frame in an Animation sequence.
 *
 * An AnimationFrame consists of a reference to the Texture it uses for rendering, references to other
 * frames in the animation, and index data. It also has the ability to modify the animation timing.
 *
 * AnimationFrames are generated automatically by the Animation class.
 *
 * @class AnimationFrame
 * @memberof Phaser.Animations
 * @constructor
 * @since 3.0.0
 *
 * @param {string} textureKey - The key of the Texture this AnimationFrame uses.
 * @param {(string|integer)} textureFrame - The key of the Frame within the Texture that this AnimationFrame uses.
 * @param {integer} index - The index of this AnimationFrame within the Animation sequence.
 * @param {Phaser.Textures.Frame} frame - A reference to the Texture Frame this AnimationFrame uses for rendering.
 * @param {boolean} [isKeyFrame=false] - Is this Frame a Keyframe within the Animation?
 */
var AnimationFrame = new Class({

    initialize:

    function AnimationFrame (textureKey, textureFrame, index, frame, isKeyFrame)
    {
        if (isKeyFrame === undefined) { isKeyFrame = false; }

        /**
         * The key of the Texture this AnimationFrame uses.
         *
         * @name Phaser.Animations.AnimationFrame#textureKey
         * @type {string}
         * @since 3.0.0
         */
        this.textureKey = textureKey;

        /**
         * The key of the Frame within the Texture that this AnimationFrame uses.
         *
         * @name Phaser.Animations.AnimationFrame#textureFrame
         * @type {(string|integer)}
         * @since 3.0.0
         */
        this.textureFrame = textureFrame;

        /**
         * The index of this AnimationFrame within the Animation sequence.
         *
         * @name Phaser.Animations.AnimationFrame#index
         * @type {integer}
         * @since 3.0.0
         */
        this.index = index;

        /**
         * A reference to the Texture Frame this AnimationFrame uses for rendering.
         *
         * @name Phaser.Animations.AnimationFrame#frame
         * @type {Phaser.Textures.Frame}
         * @since 3.0.0
         */
        this.frame = frame;

        /**
         * Is this the first frame in an animation sequence?
         *
         * @name Phaser.Animations.AnimationFrame#isFirst
         * @type {boolean}
         * @default false
         * @readonly
         * @since 3.0.0
         */
        this.isFirst = false;

        /**
         * Is this the last frame in an animation sequence?
         *
         * @name Phaser.Animations.AnimationFrame#isLast
         * @type {boolean}
         * @default false
         * @readonly
         * @since 3.0.0
         */
        this.isLast = false;

        /**
         * A reference to the AnimationFrame that comes before this one in the animation, if any.
         *
         * @name Phaser.Animations.AnimationFrame#prevFrame
         * @type {?Phaser.Animations.AnimationFrame}
         * @default null
         * @readonly
         * @since 3.0.0
         */
        this.prevFrame = null;

        /**
         * A reference to the AnimationFrame that comes after this one in the animation, if any.
         *
         * @name Phaser.Animations.AnimationFrame#nextFrame
         * @type {?Phaser.Animations.AnimationFrame}
         * @default null
         * @readonly
         * @since 3.0.0
         */
        this.nextFrame = null;

        /**
         * Additional time (in ms) that this frame should appear for during playback.
         * The value is added onto the msPerFrame set by the animation.
         *
         * @name Phaser.Animations.AnimationFrame#duration
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.duration = 0;

        /**
         * What % through the animation does this frame come?
         * This value is generated when the animation is created and cached here.
         *
         * @name Phaser.Animations.AnimationFrame#progress
         * @type {number}
         * @default 0
         * @readonly
         * @since 3.0.0
         */
        this.progress = 0;

        /**
         * Is this Frame a KeyFrame within the Animation?
         *
         * @name Phaser.Animations.AnimationFrame#isKeyFrame
         * @type {boolean}
         * @since 3.50.0
         */
        this.isKeyFrame = isKeyFrame;
    },

    /**
     * Generates a JavaScript object suitable for converting to JSON.
     *
     * @method Phaser.Animations.AnimationFrame#toJSON
     * @since 3.0.0
     *
     * @return {Phaser.Types.Animations.JSONAnimationFrame} The AnimationFrame data.
     */
    toJSON: function ()
    {
        return {
            key: this.textureKey,
            frame: this.textureFrame,
            duration: this.duration,
            keyframe: this.isKeyFrame
        };
    },

    /**
     * Destroys this object by removing references to external resources and callbacks.
     *
     * @method Phaser.Animations.AnimationFrame#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.frame = undefined;
    }

});

module.exports = AnimationFrame;


/***/ }),
/* 198 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Takes the given array and runs a numeric sort on it, ignoring any non-digits that
 * may be in the entries.
 *
 * You should only run this on arrays containing strings.
 *
 * @function Phaser.Utils.Array.SortByDigits
 * @since 3.50.0
 *
 * @param {string[]} array - The input array of strings.
 *
 * @return {string[]} The sorted input array.
 */
var SortByDigits = function (array)
{
    var re = /\D/g;

    array.sort(function (a, b)
    {
        return (parseInt(a.replace(re, ''), 10) - parseInt(b.replace(re, ''), 10));
    });

    return array;
};

module.exports = SortByDigits;


/***/ }),
/* 199 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.GameObjects.Components
 */

module.exports = {

    Alpha: __webpack_require__(200),
    AlphaSingle: __webpack_require__(201),
    BlendMode: __webpack_require__(202),
    ComputedSize: __webpack_require__(203),
    Crop: __webpack_require__(204),
    Depth: __webpack_require__(205),
    Flip: __webpack_require__(206),
    GetBounds: __webpack_require__(207),
    Mask: __webpack_require__(217),
    Origin: __webpack_require__(237),
    PathFollower: __webpack_require__(238),
    Pipeline: __webpack_require__(241),
    ScrollFactor: __webpack_require__(243),
    Size: __webpack_require__(244),
    Texture: __webpack_require__(245),
    TextureCrop: __webpack_require__(246),
    Tint: __webpack_require__(247),
    ToJSON: __webpack_require__(36),
    Transform: __webpack_require__(248),
    TransformMatrix: __webpack_require__(41),
    Visible: __webpack_require__(249)

};


/***/ }),
/* 200 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Clamp = __webpack_require__(4);

//  bitmask flag for GameObject.renderMask
var _FLAG = 2; // 0010

/**
 * Provides methods used for setting the alpha properties of a Game Object.
 * Should be applied as a mixin and not used directly.
 *
 * @namespace Phaser.GameObjects.Components.Alpha
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
/* 201 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Clamp = __webpack_require__(4);

//  bitmask flag for GameObject.renderMask
var _FLAG = 2; // 0010

/**
 * Provides methods used for setting the alpha property of a Game Object.
 * Should be applied as a mixin and not used directly.
 *
 * @namespace Phaser.GameObjects.Components.AlphaSingle
 * @since 3.22.0
 */

var AlphaSingle = {

    /**
     * Private internal value. Holds the global alpha value.
     *
     * @name Phaser.GameObjects.Components.AlphaSingle#_alpha
     * @type {number}
     * @private
     * @default 1
     * @since 3.0.0
     */
    _alpha: 1,

    /**
     * Clears all alpha values associated with this Game Object.
     *
     * Immediately sets the alpha levels back to 1 (fully opaque).
     *
     * @method Phaser.GameObjects.Components.AlphaSingle#clearAlpha
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
     * @method Phaser.GameObjects.Components.AlphaSingle#setAlpha
     * @since 3.0.0
     *
     * @param {number} [value=1] - The alpha value applied across the whole Game Object.
     *
     * @return {this} This Game Object instance.
     */
    setAlpha: function (value)
    {
        if (value === undefined) { value = 1; }

        this.alpha = value;

        return this;
    },

    /**
     * The alpha value of the Game Object.
     *
     * This is a global value, impacting the entire Game Object, not just a region of it.
     *
     * @name Phaser.GameObjects.Components.AlphaSingle#alpha
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

            if (v === 0)
            {
                this.renderFlags &= ~_FLAG;
            }
            else
            {
                this.renderFlags |= _FLAG;
            }
        }

    }

};

module.exports = AlphaSingle;


/***/ }),
/* 202 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BlendModes = __webpack_require__(14);

/**
 * Provides methods used for setting the blend mode of a Game Object.
 * Should be applied as a mixin and not used directly.
 *
 * @namespace Phaser.GameObjects.Components.BlendMode
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
     * * ERASE
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
     * * ERASE (only works when rendering to a framebuffer, like a Render Texture)
     *
     * Canvas has more available depending on browser support.
     *
     * You can also create your own custom Blend Modes in WebGL.
     *
     * Blend modes have different effects under Canvas and WebGL, and from browser to browser, depending
     * on support. Blend Modes also cause a WebGL batch flush should it encounter a new blend mode. For these
     * reasons try to be careful about the construction of your Scene and the frequency in which blend modes
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
/* 203 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Provides methods used for calculating and setting the size of a non-Frame based Game Object.
 * Should be applied as a mixin and not used directly.
 * 
 * @namespace Phaser.GameObjects.Components.ComputedSize
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
/* 204 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Provides methods used for getting and setting the texture of a Game Object.
 *
 * @namespace Phaser.GameObjects.Components.Crop
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
/* 205 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Provides methods used for setting the depth of a Game Object.
 * Should be applied as a mixin and not used directly.
 * 
 * @namespace Phaser.GameObjects.Components.Depth
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
     * The default depth is zero. A Game Object with a higher depth
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
     * The default depth is zero. A Game Object with a higher depth
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
/* 206 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Provides methods used for visually flipping a Game Object.
 * Should be applied as a mixin and not used directly.
 * 
 * @namespace Phaser.GameObjects.Components.Flip
 * @since 3.0.0
 */

var Flip = {

    /**
     * The horizontally flipped state of the Game Object.
     * 
     * A Game Object that is flipped horizontally will render inversed on the horizontal axis.
     * Flipping always takes place from the middle of the texture and does not impact the scale value.
     * If this Game Object has a physics body, it will not change the body. This is a rendering toggle only.
     * 
     * @name Phaser.GameObjects.Components.Flip#flipX
     * @type {boolean}
     * @default false
     * @since 3.0.0
     */
    flipX: false,

    /**
     * The vertically flipped state of the Game Object.
     * 
     * A Game Object that is flipped vertically will render inversed on the vertical axis (i.e. upside down)
     * Flipping always takes place from the middle of the texture and does not impact the scale value.
     * If this Game Object has a physics body, it will not change the body. This is a rendering toggle only.
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
     * A Game Object that is flipped horizontally will render inversed on the horizontal axis.
     * Flipping always takes place from the middle of the texture and does not impact the scale value.
     * If this Game Object has a physics body, it will not change the body. This is a rendering toggle only.
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
     * A Game Object that is flipped horizontally will render inversed on the horizontal axis.
     * Flipping always takes place from the middle of the texture and does not impact the scale value.
     * If this Game Object has a physics body, it will not change the body. This is a rendering toggle only.
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
     * A Game Object that is flipped will render inversed on the flipped axis.
     * Flipping always takes place from the middle of the texture and does not impact the scale value.
     * If this Game Object has a physics body, it will not change the body. This is a rendering toggle only.
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
/* 207 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Rectangle = __webpack_require__(208);
var RotateAround = __webpack_require__(28);
var Vector2 = __webpack_require__(1);

/**
 * Provides methods used for obtaining the bounds of a Game Object.
 * Should be applied as a mixin and not used directly.
 *
 * @namespace Phaser.GameObjects.Components.GetBounds
 * @since 3.0.0
 */

var GetBounds = {

    /**
     * Processes the bounds output vector before returning it.
     *
     * @method Phaser.GameObjects.Components.GetBounds#prepareBoundsOutput
     * @private
     * @since 3.18.0
     *
     * @generic {Phaser.Math.Vector2} O - [output,$return]
     *
     * @param {(Phaser.Math.Vector2|object)} output - An object to store the values in. If not provided a new Vector2 will be created.
     * @param {boolean} [includeParent=false] - If this Game Object has a parent Container, include it (and all other ancestors) in the resulting vector?
     *
     * @return {(Phaser.Math.Vector2|object)} The values stored in the output object.
     */
    prepareBoundsOutput: function (output, includeParent)
    {
        if (includeParent === undefined) { includeParent = false; }

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

        output.x = this.x - (this.displayWidth * this.originX);
        output.y = this.y - (this.displayHeight * this.originY);

        return this.prepareBoundsOutput(output, includeParent);
    },

    /**
     * Gets the top-center coordinate of this Game Object, regardless of origin.
     * The returned point is calculated in local space and does not factor in any parent containers
     *
     * @method Phaser.GameObjects.Components.GetBounds#getTopCenter
     * @since 3.18.0
     *
     * @generic {Phaser.Math.Vector2} O - [output,$return]
     *
     * @param {(Phaser.Math.Vector2|object)} [output] - An object to store the values in. If not provided a new Vector2 will be created.
     * @param {boolean} [includeParent=false] - If this Game Object has a parent Container, include it (and all other ancestors) in the resulting vector?
     *
     * @return {(Phaser.Math.Vector2|object)} The values stored in the output object.
     */
    getTopCenter: function (output, includeParent)
    {
        if (!output) { output = new Vector2(); }

        output.x = (this.x - (this.displayWidth * this.originX)) + (this.displayWidth / 2);
        output.y = this.y - (this.displayHeight * this.originY);

        return this.prepareBoundsOutput(output, includeParent);
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

        output.x = (this.x - (this.displayWidth * this.originX)) + this.displayWidth;
        output.y = this.y - (this.displayHeight * this.originY);

        return this.prepareBoundsOutput(output, includeParent);
    },

    /**
     * Gets the left-center coordinate of this Game Object, regardless of origin.
     * The returned point is calculated in local space and does not factor in any parent containers
     *
     * @method Phaser.GameObjects.Components.GetBounds#getLeftCenter
     * @since 3.18.0
     *
     * @generic {Phaser.Math.Vector2} O - [output,$return]
     *
     * @param {(Phaser.Math.Vector2|object)} [output] - An object to store the values in. If not provided a new Vector2 will be created.
     * @param {boolean} [includeParent=false] - If this Game Object has a parent Container, include it (and all other ancestors) in the resulting vector?
     *
     * @return {(Phaser.Math.Vector2|object)} The values stored in the output object.
     */
    getLeftCenter: function (output, includeParent)
    {
        if (!output) { output = new Vector2(); }

        output.x = this.x - (this.displayWidth * this.originX);
        output.y = (this.y - (this.displayHeight * this.originY)) + (this.displayHeight / 2);

        return this.prepareBoundsOutput(output, includeParent);
    },

    /**
     * Gets the right-center coordinate of this Game Object, regardless of origin.
     * The returned point is calculated in local space and does not factor in any parent containers
     *
     * @method Phaser.GameObjects.Components.GetBounds#getRightCenter
     * @since 3.18.0
     *
     * @generic {Phaser.Math.Vector2} O - [output,$return]
     *
     * @param {(Phaser.Math.Vector2|object)} [output] - An object to store the values in. If not provided a new Vector2 will be created.
     * @param {boolean} [includeParent=false] - If this Game Object has a parent Container, include it (and all other ancestors) in the resulting vector?
     *
     * @return {(Phaser.Math.Vector2|object)} The values stored in the output object.
     */
    getRightCenter: function (output, includeParent)
    {
        if (!output) { output = new Vector2(); }

        output.x = (this.x - (this.displayWidth * this.originX)) + this.displayWidth;
        output.y = (this.y - (this.displayHeight * this.originY)) + (this.displayHeight / 2);

        return this.prepareBoundsOutput(output, includeParent);
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

        output.x = this.x - (this.displayWidth * this.originX);
        output.y = (this.y - (this.displayHeight * this.originY)) + this.displayHeight;

        return this.prepareBoundsOutput(output, includeParent);
    },

    /**
     * Gets the bottom-center coordinate of this Game Object, regardless of origin.
     * The returned point is calculated in local space and does not factor in any parent containers
     *
     * @method Phaser.GameObjects.Components.GetBounds#getBottomCenter
     * @since 3.18.0
     *
     * @generic {Phaser.Math.Vector2} O - [output,$return]
     *
     * @param {(Phaser.Math.Vector2|object)} [output] - An object to store the values in. If not provided a new Vector2 will be created.
     * @param {boolean} [includeParent=false] - If this Game Object has a parent Container, include it (and all other ancestors) in the resulting vector?
     *
     * @return {(Phaser.Math.Vector2|object)} The values stored in the output object.
     */
    getBottomCenter: function (output, includeParent)
    {
        if (!output) { output = new Vector2(); }

        output.x = (this.x - (this.displayWidth * this.originX)) + (this.displayWidth / 2);
        output.y = (this.y - (this.displayHeight * this.originY)) + this.displayHeight;

        return this.prepareBoundsOutput(output, includeParent);
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

        output.x = (this.x - (this.displayWidth * this.originX)) + this.displayWidth;
        output.y = (this.y - (this.displayHeight * this.originY)) + this.displayHeight;

        return this.prepareBoundsOutput(output, includeParent);
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
/* 208 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = __webpack_require__(0);
var Contains = __webpack_require__(209);
var GetPoint = __webpack_require__(39);
var GetPoints = __webpack_require__(210);
var GEOM_CONST = __webpack_require__(13);
var Line = __webpack_require__(211);
var Random = __webpack_require__(216);

/**
 * @classdesc
 * Encapsulates a 2D rectangle defined by its corner point in the top-left and its extends in x (width) and y (height)
 *
 * @class Rectangle
 * @memberof Phaser.Geom
 * @constructor
 * @since 3.0.0
 *
 * @param {number} [x=0] - The X coordinate of the top left corner of the Rectangle.
 * @param {number} [y=0] - The Y coordinate of the top left corner of the Rectangle.
 * @param {number} [width=0] - The width of the Rectangle.
 * @param {number} [height=0] - The height of the Rectangle.
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
         * The geometry constant type of this object: `GEOM_CONST.RECTANGLE`.
         * Used for fast type comparisons.
         *
         * @name Phaser.Geom.Rectangle#type
         * @type {integer}
         * @readonly
         * @since 3.19.0
         */
        this.type = GEOM_CONST.RECTANGLE;

        /**
         * The X coordinate of the top left corner of the Rectangle.
         *
         * @name Phaser.Geom.Rectangle#x
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.x = x;

        /**
         * The Y coordinate of the top left corner of the Rectangle.
         *
         * @name Phaser.Geom.Rectangle#y
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.y = y;

        /**
         * The width of the Rectangle, i.e. the distance between its left side (defined by `x`) and its right side.
         *
         * @name Phaser.Geom.Rectangle#width
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.width = width;

        /**
         * The height of the Rectangle, i.e. the distance between its top side (defined by `y`) and its bottom side.
         *
         * @name Phaser.Geom.Rectangle#height
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.height = height;
    },

    /**
     * Checks if the given point is inside the Rectangle's bounds.
     *
     * @method Phaser.Geom.Rectangle#contains
     * @since 3.0.0
     *
     * @param {number} x - The X coordinate of the point to check.
     * @param {number} y - The Y coordinate of the point to check.
     *
     * @return {boolean} `true` if the point is within the Rectangle's bounds, otherwise `false`.
     */
    contains: function (x, y)
    {
        return Contains(this, x, y);
    },

    /**
     * Calculates the coordinates of a point at a certain `position` on the Rectangle's perimeter.
     * 
     * The `position` is a fraction between 0 and 1 which defines how far into the perimeter the point is.
     * 
     * A value of 0 or 1 returns the point at the top left corner of the rectangle, while a value of 0.5 returns the point at the bottom right corner of the rectangle. Values between 0 and 0.5 are on the top or the right side and values between 0.5 and 1 are on the bottom or the left side.
     *
     * @method Phaser.Geom.Rectangle#getPoint
     * @since 3.0.0
     *
     * @generic {Phaser.Geom.Point} O - [output,$return]
     *
     * @param {number} position - The normalized distance into the Rectangle's perimeter to return.
     * @param {(Phaser.Geom.Point|object)} [output] - An object to update with the `x` and `y` coordinates of the point.
     *
     * @return {(Phaser.Geom.Point|object)} The updated `output` object, or a new Point if no `output` object was given.
     */
    getPoint: function (position, output)
    {
        return GetPoint(this, position, output);
    },

    /**
     * Returns an array of points from the perimeter of the Rectangle, each spaced out based on the quantity or step required.
     *
     * @method Phaser.Geom.Rectangle#getPoints
     * @since 3.0.0
     *
     * @generic {Phaser.Geom.Point[]} O - [output,$return]
     *
     * @param {integer} quantity - The number of points to return. Set to `false` or 0 to return an arbitrary number of points (`perimeter / stepRate`) evenly spaced around the Rectangle based on the `stepRate`.
     * @param {number} [stepRate] - If `quantity` is 0, determines the normalized distance between each returned point.
     * @param {(array|Phaser.Geom.Point[])} [output] - An array to which to append the points.
     *
     * @return {(array|Phaser.Geom.Point[])} The modified `output` array, or a new array if none was provided.
     */
    getPoints: function (quantity, stepRate, output)
    {
        return GetPoints(this, quantity, stepRate, output);
    },

    /**
     * Returns a random point within the Rectangle's bounds.
     *
     * @method Phaser.Geom.Rectangle#getRandomPoint
     * @since 3.0.0
     *
     * @generic {Phaser.Geom.Point} O - [point,$return]
     *
     * @param {Phaser.Geom.Point} [point] - The object in which to store the `x` and `y` coordinates of the point.
     *
     * @return {Phaser.Geom.Point} The updated `point`, or a new Point if none was provided.
     */
    getRandomPoint: function (point)
    {
        return Random(this, point);
    },

    /**
     * Sets the position, width, and height of the Rectangle.
     *
     * @method Phaser.Geom.Rectangle#setTo
     * @since 3.0.0
     *
     * @param {number} x - The X coordinate of the top left corner of the Rectangle.
     * @param {number} y - The Y coordinate of the top left corner of the Rectangle.
     * @param {number} width - The width of the Rectangle.
     * @param {number} height - The height of the Rectangle.
     *
     * @return {this} This Rectangle object.
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
     * Resets the position, width, and height of the Rectangle to 0.
     *
     * @method Phaser.Geom.Rectangle#setEmpty
     * @since 3.0.0
     *
     * @return {this} This Rectangle object.
     */
    setEmpty: function ()
    {
        return this.setTo(0, 0, 0, 0);
    },

    /**
     * Sets the position of the Rectangle.
     *
     * @method Phaser.Geom.Rectangle#setPosition
     * @since 3.0.0
     *
     * @param {number} x - The X coordinate of the top left corner of the Rectangle.
     * @param {number} [y=x] - The Y coordinate of the top left corner of the Rectangle.
     *
     * @return {this} This Rectangle object.
     */
    setPosition: function (x, y)
    {
        if (y === undefined) { y = x; }

        this.x = x;
        this.y = y;

        return this;
    },

    /**
     * Sets the width and height of the Rectangle.
     *
     * @method Phaser.Geom.Rectangle#setSize
     * @since 3.0.0
     *
     * @param {number} width - The width to set the Rectangle to.
     * @param {number} [height=width] - The height to set the Rectangle to.
     *
     * @return {this} This Rectangle object.
     */
    setSize: function (width, height)
    {
        if (height === undefined) { height = width; }

        this.width = width;
        this.height = height;

        return this;
    },

    /**
     * Determines if the Rectangle is empty. A Rectangle is empty if its width or height is less than or equal to 0.
     *
     * @method Phaser.Geom.Rectangle#isEmpty
     * @since 3.0.0
     *
     * @return {boolean} `true` if the Rectangle is empty. A Rectangle object is empty if its width or height is less than or equal to 0.
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
     * The x coordinate of the left of the Rectangle.
     * Changing the left property of a Rectangle object has no effect on the y and height properties. However it does affect the width property, whereas changing the x value does not affect the width property.
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
     * The sum of the x and width properties.
     * Changing the right property of a Rectangle object has no effect on the x, y and height properties, however it does affect the width property.
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
     * The y coordinate of the top of the Rectangle. Changing the top property of a Rectangle object has no effect on the x and width properties.
     * However it does affect the height property, whereas changing the y value does not affect the height property.
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
     * The sum of the y and height properties.
     * Changing the bottom property of a Rectangle object has no effect on the x, y and width properties, but does change the height property.
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
     * The x coordinate of the center of the Rectangle.
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
     * The y coordinate of the center of the Rectangle.
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
/* 209 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Checks if a given point is inside a Rectangle's bounds.
 *
 * @function Phaser.Geom.Rectangle.Contains
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} rect - The Rectangle to check.
 * @param {number} x - The X coordinate of the point to check.
 * @param {number} y - The Y coordinate of the point to check.
 *
 * @return {boolean} `true` if the point is within the Rectangle's bounds, otherwise `false`.
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
/* 210 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetPoint = __webpack_require__(39);
var Perimeter = __webpack_require__(40);

//  Return an array of points from the perimeter of the rectangle
//  each spaced out based on the quantity or step required

/**
 * Return an array of points from the perimeter of the rectangle, each spaced out based on the quantity or step required.
 *
 * @function Phaser.Geom.Rectangle.GetPoints
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point[]} O - [out,$return]
 *
 * @param {Phaser.Geom.Rectangle} rectangle - The Rectangle object to get the points from.
 * @param {number} step - Step between points. Used to calculate the number of points to return when quantity is falsey. Ignored if quantity is positive.
 * @param {integer} quantity - The number of evenly spaced points from the rectangles perimeter to return. If falsey, step param will be used to calculate the number of points.
 * @param {(array|Phaser.Geom.Point[])} [out] - An optional array to store the points in.
 *
 * @return {(array|Phaser.Geom.Point[])} An array of Points from the perimeter of the rectangle.
 */
var GetPoints = function (rectangle, quantity, stepRate, out)
{
    if (out === undefined) { out = []; }

    //  If quantity is a falsey value (false, null, 0, undefined, etc) then we calculate it based on the stepRate instead.
    if (!quantity && stepRate > 0)
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
/* 211 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = __webpack_require__(0);
var GetPoint = __webpack_require__(212);
var GetPoints = __webpack_require__(213);
var GEOM_CONST = __webpack_require__(13);
var Random = __webpack_require__(215);
var Vector2 = __webpack_require__(1);

/**
 * @classdesc
 * Defines a Line segment, a part of a line between two endpoints.
 *
 * @class Line
 * @memberof Phaser.Geom
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
         * The geometry constant type of this object: `GEOM_CONST.LINE`.
         * Used for fast type comparisons.
         *
         * @name Phaser.Geom.Line#type
         * @type {integer}
         * @readonly
         * @since 3.19.0
         */
        this.type = GEOM_CONST.LINE;

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
     * @generic {Phaser.Geom.Point[]} O - [output,$return]
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
     * @return {this} This Line object.
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
/* 212 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Point = __webpack_require__(5);

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
/* 213 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Length = __webpack_require__(214);
var Point = __webpack_require__(5);

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
    if (!quantity && stepRate > 0)
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
/* 214 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
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
/* 215 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Point = __webpack_require__(5);

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
/* 216 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Point = __webpack_require__(5);

/**
 * Returns a random point within a Rectangle.
 *
 * @function Phaser.Geom.Rectangle.Random
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [out,$return]
 *
 * @param {Phaser.Geom.Rectangle} rect - The Rectangle to return a point from.
 * @param {Phaser.Geom.Point} out - The object to update with the point's coordinates.
 *
 * @return {Phaser.Geom.Point} The modified `out` object, or a new Point if none was provided.
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
/* 217 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BitmapMask = __webpack_require__(218);
var GeometryMask = __webpack_require__(236);

/**
 * Provides methods used for getting and setting the mask of a Game Object.
 *
 * @namespace Phaser.GameObjects.Components.Mask
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
     * Note: Bitmap Masks only work on WebGL. Geometry Masks work on both WebGL and Canvas.
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
        if (renderable === undefined && (this.texture || this.shader))
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
/* 218 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = __webpack_require__(0);
var GameEvents = __webpack_require__(219);

/**
 * @classdesc
 * A Bitmap Mask combines the alpha (opacity) of a masked pixel with the alpha of another pixel.
 * Unlike the Geometry Mask, which is a clipping path, a Bitmap Mask behaves like an alpha mask,
 * not a clipping path. It is only available when using the WebGL Renderer.
 *
 * A Bitmap Mask can use any Game Object to determine the alpha of each pixel of the masked Game Object(s).
 * For any given point of a masked Game Object's texture, the pixel's alpha will be multiplied by the alpha
 * of the pixel at the same position in the Bitmap Mask's Game Object. The color of the pixel from the
 * Bitmap Mask doesn't matter.
 *
 * For example, if a pure blue pixel with an alpha of 0.95 is masked with a pure red pixel with an
 * alpha of 0.5, the resulting pixel will be pure blue with an alpha of 0.475. Naturally, this means
 * that a pixel in the mask with an alpha of 0 will hide the corresponding pixel in all masked Game Objects
 *  A pixel with an alpha of 1 in the masked Game Object will receive the same alpha as the
 * corresponding pixel in the mask.
 *
 * Note: You cannot combine Bitmap Masks and Blend Modes on the same Game Object. You can, however,
 * combine Geometry Masks and Blend Modes together.
 *
 * The Bitmap Mask's location matches the location of its Game Object, not the location of the
 * masked objects. Moving or transforming the underlying Game Object will change the mask
 * (and affect the visibility of any masked objects), whereas moving or transforming a masked object
 * will not affect the mask.
 *
 * The Bitmap Mask will not render its Game Object by itself. If the Game Object is not in a
 * Scene's display list, it will only be used for the mask and its full texture will not be directly
 * visible. Adding the underlying Game Object to a Scene will not cause any problems - it will
 * render as a normal Game Object and will also serve as a mask.
 *
 * @class BitmapMask
 * @memberof Phaser.Display.Masks
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - The Scene which this Bitmap Mask will be used in.
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
         * The texture used for the mask's framebuffer.
         *
         * @name Phaser.Display.Masks.BitmapMask#maskTexture
         * @type {WebGLTexture}
         * @default null
         * @since 3.0.0
         */
        this.maskTexture = null;

        /**
         * The texture used for the main framebuffer.
         *
         * @name Phaser.Display.Masks.BitmapMask#mainTexture
         * @type {WebGLTexture}
         * @default null
         * @since 3.0.0
         */
        this.mainTexture = null;

        /**
         * Whether the Bitmap Mask is dirty and needs to be updated.
         *
         * @name Phaser.Display.Masks.BitmapMask#dirty
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.dirty = true;

        /**
         * The framebuffer to which a masked Game Object is rendered.
         *
         * @name Phaser.Display.Masks.BitmapMask#mainFramebuffer
         * @type {WebGLFramebuffer}
         * @since 3.0.0
         */
        this.mainFramebuffer = null;

        /**
         * The framebuffer to which the Bitmap Mask's masking Game Object is rendered.
         *
         * @name Phaser.Display.Masks.BitmapMask#maskFramebuffer
         * @type {WebGLFramebuffer}
         * @since 3.0.0
         */
        this.maskFramebuffer = null;

        /**
         * The previous framebuffer set in the renderer before this one was enabled.
         *
         * @name Phaser.Display.Masks.BitmapMask#prevFramebuffer
         * @type {WebGLFramebuffer}
         * @since 3.17.0
         */
        this.prevFramebuffer = null;

        /**
         * Whether to invert the masks alpha.
         *
         * If `true`, the alpha of the masking pixel will be inverted before it's multiplied with the masked pixel. Essentially, this means that a masked area will be visible only if the corresponding area in the mask is invisible.
         *
         * @name Phaser.Display.Masks.BitmapMask#invertAlpha
         * @type {boolean}
         * @since 3.1.2
         */
        this.invertAlpha = false;

        /**
         * Is this mask a stencil mask?
         *
         * @name Phaser.Display.Masks.BitmapMask#isStencil
         * @type {boolean}
         * @readonly
         * @since 3.17.0
         */
        this.isStencil = false;

        this.createMask();

        scene.sys.game.events.on(GameEvents.CONTEXT_RESTORED, this.createMask, this);
    },

    /**
     * Creates the WebGL Texture2D objects and Framebuffers required for this
     * mask. If this mask has already been created, then `clearMask` is called first.
     *
     * @method Phaser.Display.Masks.BitmapMask#createMask
     * @since 3.50.0
     */
    createMask: function ()
    {
        var renderer = this.renderer;

        if (!renderer.gl)
        {
            return;
        }

        if (this.mainTexture)
        {
            this.clearMask();
        }

        var width = renderer.width;
        var height = renderer.height;
        var pot = ((width & (width - 1)) === 0 && (height & (height - 1)) === 0);
        var gl = renderer.gl;
        var wrap = pot ? gl.REPEAT : gl.CLAMP_TO_EDGE;
        var filter = gl.LINEAR;

        this.mainTexture = renderer.createTexture2D(0, filter, filter, wrap, wrap, gl.RGBA, null, width, height);
        this.maskTexture = renderer.createTexture2D(0, filter, filter, wrap, wrap, gl.RGBA, null, width, height);
        this.mainFramebuffer = renderer.createFramebuffer(width, height, this.mainTexture, true);
        this.maskFramebuffer = renderer.createFramebuffer(width, height, this.maskTexture, true);
    },

    /**
     * Deletes the `mainTexture` and `maskTexture` WebGL Textures and deletes
     * the `mainFramebuffer` and `maskFramebuffer` too, nulling all references.
     *
     * This is called when this mask is destroyed, or if you try to creat a new
     * mask from this object when one is already set.
     *
     * @method Phaser.Display.Masks.BitmapMask#clearMask
     * @since 3.50.0
     */
    clearMask: function ()
    {
        var renderer = this.renderer;

        if (!renderer.gl || !this.mainTexture)
        {
            return;
        }

        renderer.deleteTexture(this.mainTexture);
        renderer.deleteTexture(this.maskTexture);
        renderer.deleteFramebuffer(this.mainFramebuffer);
        renderer.deleteFramebuffer(this.maskFramebuffer);

        this.mainTexture = null;
        this.maskTexture = null;
        this.mainFramebuffer = null;
        this.maskFramebuffer = null;
    },

    /**
     * Sets a new masking Game Object for the Bitmap Mask.
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
     * Prepares the WebGL Renderer to render a Game Object with this mask applied.
     *
     * This renders the masking Game Object to the mask framebuffer and switches to the main framebuffer so that the masked Game Object will be rendered to it instead of being rendered directly to the frame.
     *
     * @method Phaser.Display.Masks.BitmapMask#preRenderWebGL
     * @since 3.0.0
     *
     * @param {(Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer)} renderer - The WebGL Renderer to prepare.
     * @param {Phaser.GameObjects.GameObject} maskedObject - The masked Game Object which will be drawn.
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to render to.
     */
    preRenderWebGL: function (renderer, maskedObject, camera)
    {
        renderer.pipelines.BITMAPMASK_PIPELINE.beginMask(this, maskedObject, camera);
    },

    /**
     * Finalizes rendering of a masked Game Object.
     *
     * This resets the previously bound framebuffer and switches the WebGL Renderer to the Bitmap Mask Pipeline, which uses a special fragment shader to apply the masking effect.
     *
     * @method Phaser.Display.Masks.BitmapMask#postRenderWebGL
     * @since 3.0.0
     *
     * @param {(Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer)} renderer - The WebGL Renderer to clean up.
     */
    postRenderWebGL: function (renderer, camera)
    {
        renderer.pipelines.BITMAPMASK_PIPELINE.endMask(this, camera);
    },

    /**
     * This is a NOOP method. Bitmap Masks are not supported by the Canvas Renderer.
     *
     * @method Phaser.Display.Masks.BitmapMask#preRenderCanvas
     * @since 3.0.0
     *
     * @param {(Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer)} renderer - The Canvas Renderer which would be rendered to.
     * @param {Phaser.GameObjects.GameObject} mask - The masked Game Object which would be rendered.
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to render to.
     */
    preRenderCanvas: function ()
    {
        // NOOP
    },

    /**
     * This is a NOOP method. Bitmap Masks are not supported by the Canvas Renderer.
     *
     * @method Phaser.Display.Masks.BitmapMask#postRenderCanvas
     * @since 3.0.0
     *
     * @param {(Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer)} renderer - The Canvas Renderer which would be rendered to.
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
        this.clearMask();

        this.bitmapMask = null;
        this.prevFramebuffer = null;
        this.renderer = null;
    }

});

module.exports = BitmapMask;


/***/ }),
/* 219 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Core.Events
 */

module.exports = {

    BLUR: __webpack_require__(220),
    BOOT: __webpack_require__(221),
    CONTEXT_LOST: __webpack_require__(222),
    CONTEXT_RESTORED: __webpack_require__(223),
    DESTROY: __webpack_require__(224),
    FOCUS: __webpack_require__(225),
    HIDDEN: __webpack_require__(226),
    PAUSE: __webpack_require__(227),
    POST_RENDER: __webpack_require__(228),
    POST_STEP: __webpack_require__(229),
    PRE_RENDER: __webpack_require__(230),
    PRE_STEP: __webpack_require__(231),
    READY: __webpack_require__(232),
    RESUME: __webpack_require__(233),
    STEP: __webpack_require__(234),
    VISIBLE: __webpack_require__(235)

};


/***/ }),
/* 220 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Game Blur Event.
 * 
 * This event is dispatched by the Game Visibility Handler when the window in which the Game instance is embedded
 * enters a blurred state. The blur event is raised when the window loses focus. This can happen if a user swaps
 * tab, or if they simply remove focus from the browser to another app.
 *
 * @event Phaser.Core.Events#BLUR
 * @since 3.0.0
 */
module.exports = 'blur';


/***/ }),
/* 221 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Game Boot Event.
 * 
 * This event is dispatched when the Phaser Game instance has finished booting, but before it is ready to start running.
 * The global systems use this event to know when to set themselves up, dispatching their own `ready` events as required.
 *
 * @event Phaser.Core.Events#BOOT
 * @since 3.0.0
 */
module.exports = 'boot';


/***/ }),
/* 222 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Game Context Lost Event.
 * 
 * This event is dispatched by the Game if the WebGL Renderer it is using encounters a WebGL Context Lost event from the browser.
 * 
 * The partner event is `CONTEXT_RESTORED`.
 *
 * @event Phaser.Core.Events#CONTEXT_LOST
 * @since 3.19.0
 */
module.exports = 'contextlost';


/***/ }),
/* 223 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Game Context Restored Event.
 * 
 * This event is dispatched by the Game if the WebGL Renderer it is using encounters a WebGL Context Restored event from the browser.
 * 
 * The partner event is `CONTEXT_LOST`.
 *
 * @event Phaser.Core.Events#CONTEXT_RESTORED
 * @since 3.19.0
 */
module.exports = 'contextrestored';


/***/ }),
/* 224 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Game Destroy Event.
 * 
 * This event is dispatched when the game instance has been told to destroy itself.
 * Lots of internal systems listen to this event in order to clear themselves out.
 * Custom plugins and game code should also do the same.
 *
 * @event Phaser.Core.Events#DESTROY
 * @since 3.0.0
 */
module.exports = 'destroy';


/***/ }),
/* 225 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Game Focus Event.
 * 
 * This event is dispatched by the Game Visibility Handler when the window in which the Game instance is embedded
 * enters a focused state. The focus event is raised when the window re-gains focus, having previously lost it.
 *
 * @event Phaser.Core.Events#FOCUS
 * @since 3.0.0
 */
module.exports = 'focus';


/***/ }),
/* 226 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Game Hidden Event.
 * 
 * This event is dispatched by the Game Visibility Handler when the document in which the Game instance is embedded
 * enters a hidden state. Only browsers that support the Visibility API will cause this event to be emitted.
 * 
 * In most modern browsers, when the document enters a hidden state, the Request Animation Frame and setTimeout, which
 * control the main game loop, will automatically pause. There is no way to stop this from happening. It is something
 * your game should account for in its own code, should the pause be an issue (i.e. for multiplayer games)
 *
 * @event Phaser.Core.Events#HIDDEN
 * @since 3.0.0
 */
module.exports = 'hidden';


/***/ }),
/* 227 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Game Pause Event.
 * 
 * This event is dispatched when the Game loop enters a paused state, usually as a result of the Visibility Handler.
 *
 * @event Phaser.Core.Events#PAUSE
 * @since 3.0.0
 */
module.exports = 'pause';


/***/ }),
/* 228 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Game Post-Render Event.
 * 
 * This event is dispatched right at the end of the render process.
 * 
 * Every Scene will have rendered and been drawn to the canvas by the time this event is fired.
 * Use it for any last minute post-processing before the next game step begins.
 *
 * @event Phaser.Core.Events#POST_RENDER
 * @since 3.0.0
 * 
 * @param {(Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer)} renderer - A reference to the current renderer being used by the Game instance.
 */
module.exports = 'postrender';


/***/ }),
/* 229 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Game Post-Step Event.
 * 
 * This event is dispatched after the Scene Manager has updated.
 * Hook into it from plugins or systems that need to do things before the render starts.
 *
 * @event Phaser.Core.Events#POST_STEP
 * @since 3.0.0
 * 
 * @param {number} time - The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
 * @param {number} delta - The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
 */
module.exports = 'poststep';


/***/ }),
/* 230 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Game Pre-Render Event.
 * 
 * This event is dispatched immediately before any of the Scenes have started to render.
 * 
 * The renderer will already have been initialized this frame, clearing itself and preparing to receive the Scenes for rendering, but it won't have actually drawn anything yet.
 *
 * @event Phaser.Core.Events#PRE_RENDER
 * @since 3.0.0
 * 
 * @param {(Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer)} renderer - A reference to the current renderer being used by the Game instance.
 */
module.exports = 'prerender';


/***/ }),
/* 231 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Game Pre-Step Event.
 * 
 * This event is dispatched before the main Game Step starts. By this point in the game cycle none of the Scene updates have yet happened.
 * Hook into it from plugins or systems that need to update before the Scene Manager does.
 *
 * @event Phaser.Core.Events#PRE_STEP
 * @since 3.0.0
 * 
 * @param {number} time - The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
 * @param {number} delta - The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
 */
module.exports = 'prestep';


/***/ }),
/* 232 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Game Ready Event.
 * 
 * This event is dispatched when the Phaser Game instance has finished booting, the Texture Manager is fully ready,
 * and all local systems are now able to start.
 *
 * @event Phaser.Core.Events#READY
 * @since 3.0.0
 */
module.exports = 'ready';


/***/ }),
/* 233 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Game Resume Event.
 * 
 * This event is dispatched when the game loop leaves a paused state and resumes running.
 *
 * @event Phaser.Core.Events#RESUME
 * @since 3.0.0
 */
module.exports = 'resume';


/***/ }),
/* 234 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Game Step Event.
 * 
 * This event is dispatched after the Game Pre-Step and before the Scene Manager steps.
 * Hook into it from plugins or systems that need to update before the Scene Manager does, but after the core Systems have.
 *
 * @event Phaser.Core.Events#STEP
 * @since 3.0.0
 * 
 * @param {number} time - The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
 * @param {number} delta - The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
 */
module.exports = 'step';


/***/ }),
/* 235 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Game Visible Event.
 * 
 * This event is dispatched by the Game Visibility Handler when the document in which the Game instance is embedded
 * enters a visible state, previously having been hidden.
 * 
 * Only browsers that support the Visibility API will cause this event to be emitted.
 *
 * @event Phaser.Core.Events#VISIBLE
 * @since 3.0.0
 */
module.exports = 'visible';


/***/ }),
/* 236 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = __webpack_require__(0);

/**
 * @classdesc
 * A Geometry Mask can be applied to a Game Object to hide any pixels of it which don't intersect
 * a visible pixel from the geometry mask. The mask is essentially a clipping path which can only
 * make a masked pixel fully visible or fully invisible without changing its alpha (opacity).
 *
 * A Geometry Mask uses a Graphics Game Object to determine which pixels of the masked Game Object(s)
 * should be clipped. For any given point of a masked Game Object's texture, the pixel will only be displayed
 * if the Graphics Game Object of the Geometry Mask has a visible pixel at the same position. The color and
 * alpha of the pixel from the Geometry Mask do not matter.
 *
 * The Geometry Mask's location matches the location of its Graphics object, not the location of the masked objects.
 * Moving or transforming the underlying Graphics object will change the mask (and affect the visibility
 * of any masked objects), whereas moving or transforming a masked object will not affect the mask.
 * You can think of the Geometry Mask (or rather, of its Graphics object) as an invisible curtain placed
 * in front of all masked objects which has its own visual properties and, naturally, respects the camera's
 * visual properties, but isn't affected by and doesn't follow the masked objects by itself.
 *
 * @class GeometryMask
 * @memberof Phaser.Display.Masks
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - This parameter is not used.
 * @param {Phaser.GameObjects.Graphics} graphicsGeometry - The Graphics Game Object to use for the Geometry Mask. Doesn't have to be in the Display List.
 */
var GeometryMask = new Class({

    initialize:

    function GeometryMask (scene, graphicsGeometry)
    {
        /**
         * The Graphics object which describes the Geometry Mask.
         *
         * @name Phaser.Display.Masks.GeometryMask#geometryMask
         * @type {Phaser.GameObjects.Graphics}
         * @since 3.0.0
         */
        this.geometryMask = graphicsGeometry;

        /**
         * Similar to the BitmapMasks invertAlpha setting this to true will then hide all pixels
         * drawn to the Geometry Mask.
         *
         * @name Phaser.Display.Masks.GeometryMask#invertAlpha
         * @type {boolean}
         * @since 3.16.0
         */
        this.invertAlpha = false;

        /**
         * Is this mask a stencil mask?
         *
         * @name Phaser.Display.Masks.GeometryMask#isStencil
         * @type {boolean}
         * @readonly
         * @since 3.17.0
         */
        this.isStencil = true;

        /**
         * The current stencil level.
         *
         * @name Phaser.Display.Masks.GeometryMask#level
         * @type {boolean}
         * @private
         * @since 3.17.0
         */
        this.level = 0;
    },

    /**
     * Sets a new Graphics object for the Geometry Mask.
     *
     * @method Phaser.Display.Masks.GeometryMask#setShape
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Graphics} graphicsGeometry - The Graphics object which will be used for the Geometry Mask.
     *
     * @return {this} This Geometry Mask
     */
    setShape: function (graphicsGeometry)
    {
        this.geometryMask = graphicsGeometry;

        return this;
    },

    /**
     * Sets the `invertAlpha` property of this Geometry Mask.
     * Inverting the alpha essentially flips the way the mask works.
     *
     * @method Phaser.Display.Masks.GeometryMask#setInvertAlpha
     * @since 3.17.0
     *
     * @param {boolean} [value=true] - Invert the alpha of this mask?
     *
     * @return {this} This Geometry Mask
     */
    setInvertAlpha: function (value)
    {
        if (value === undefined) { value = true; }

        this.invertAlpha = value;

        return this;
    },

    /**
     * Renders the Geometry Mask's underlying Graphics object to the OpenGL stencil buffer and enables the stencil test, which clips rendered pixels according to the mask.
     *
     * @method Phaser.Display.Masks.GeometryMask#preRenderWebGL
     * @since 3.0.0
     *
     * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The WebGL Renderer instance to draw to.
     * @param {Phaser.GameObjects.GameObject} child - The Game Object being rendered.
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera the Game Object is being rendered through.
     */
    preRenderWebGL: function (renderer, child, camera)
    {
        var gl = renderer.gl;

        //  Force flushing before drawing to stencil buffer
        renderer.flush();

        if (renderer.maskStack.length === 0)
        {
            gl.enable(gl.STENCIL_TEST);
            gl.clear(gl.STENCIL_BUFFER_BIT);

            renderer.maskCount = 0;
        }

        if (renderer.currentCameraMask.mask !== this)
        {
            renderer.currentMask.mask = this;
        }

        renderer.maskStack.push({ mask: this, camera: camera });

        this.applyStencil(renderer, camera, true);

        renderer.maskCount++;
    },

    /**
     * Applies the current stencil mask to the renderer.
     *
     * @method Phaser.Display.Masks.GeometryMask#applyStencil
     * @since 3.17.0
     *
     * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The WebGL Renderer instance to draw to.
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera the Game Object is being rendered through.
     * @param {boolean} inc - Is this an INCR stencil or a DECR stencil?
     */
    applyStencil: function (renderer, camera, inc)
    {
        var gl = renderer.gl;
        var geometryMask = this.geometryMask;
        var level = renderer.maskCount;

        gl.colorMask(false, false, false, false);

        if (inc)
        {
            gl.stencilFunc(gl.EQUAL, level, 0xFF);
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);
        }
        else
        {
            gl.stencilFunc(gl.EQUAL, level + 1, 0xFF);
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.DECR);
        }

        //  Write stencil buffer
        geometryMask.renderWebGL(renderer, geometryMask, camera);

        renderer.flush();

        gl.colorMask(true, true, true, true);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);

        if (inc)
        {
            if (this.invertAlpha)
            {
                gl.stencilFunc(gl.NOTEQUAL, level + 1, 0xFF);
            }
            else
            {
                gl.stencilFunc(gl.EQUAL, level + 1, 0xFF);
            }
        }
        else if (this.invertAlpha)
        {
            gl.stencilFunc(gl.NOTEQUAL, level, 0xFF);
        }
        else
        {
            gl.stencilFunc(gl.EQUAL, level, 0xFF);
        }
    },

    /**
     * Flushes all rendered pixels and disables the stencil test of a WebGL context, thus disabling the mask for it.
     *
     * @method Phaser.Display.Masks.GeometryMask#postRenderWebGL
     * @since 3.0.0
     *
     * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The WebGL Renderer instance to draw flush.
     */
    postRenderWebGL: function (renderer)
    {
        var gl = renderer.gl;

        renderer.maskStack.pop();

        renderer.maskCount--;

        if (renderer.maskStack.length === 0)
        {
            //  If this is the only mask in the stack, flush and disable
            renderer.flush();

            renderer.currentMask.mask = null;

            gl.disable(gl.STENCIL_TEST);
        }
        else
        {
            //  Force flush before disabling stencil test
            renderer.flush();

            var prev = renderer.maskStack[renderer.maskStack.length - 1];

            prev.mask.applyStencil(renderer, prev.camera, false);

            if (renderer.currentCameraMask.mask !== prev.mask)
            {
                renderer.currentMask.mask = prev.mask;
                renderer.currentMask.camera = prev.camera;
            }
            else
            {
                renderer.currentMask.mask = null;
            }
        }
    },

    /**
     * Sets the clipping path of a 2D canvas context to the Geometry Mask's underlying Graphics object.
     *
     * @method Phaser.Display.Masks.GeometryMask#preRenderCanvas
     * @since 3.0.0
     *
     * @param {Phaser.Renderer.Canvas.CanvasRenderer} renderer - The Canvas Renderer instance to set the clipping path on.
     * @param {Phaser.GameObjects.GameObject} mask - The Game Object being rendered.
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera the Game Object is being rendered through.
     */
    preRenderCanvas: function (renderer, mask, camera)
    {
        var geometryMask = this.geometryMask;

        renderer.currentContext.save();

        geometryMask.renderCanvas(renderer, geometryMask, camera, null, null, true);

        renderer.currentContext.clip();
    },

    /**
     * Restore the canvas context's previous clipping path, thus turning off the mask for it.
     *
     * @method Phaser.Display.Masks.GeometryMask#postRenderCanvas
     * @since 3.0.0
     *
     * @param {Phaser.Renderer.Canvas.CanvasRenderer} renderer - The Canvas Renderer instance being restored.
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
/* 237 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Provides methods used for getting and setting the origin of a Game Object.
 * Values are normalized, given in the range 0 to 1.
 * Display values contain the calculated pixel values.
 * Should be applied as a mixin and not used directly.
 *
 * @namespace Phaser.GameObjects.Components.Origin
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
        this._displayOriginX = this.originX * this.width;
        this._displayOriginY = this.originY * this.height;

        return this;
    }

};

module.exports = Origin;


/***/ }),
/* 238 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var DegToRad = __webpack_require__(25);
var GetBoolean = __webpack_require__(239);
var GetValue = __webpack_require__(12);
var TWEEN_CONST = __webpack_require__(240);
var Vector2 = __webpack_require__(1);

/**
 * Provides methods used for managing a Game Object following a Path.
 * Should be applied as a mixin and not used directly.
 *
 * @namespace Phaser.GameObjects.Components.PathFollower
 * @since 3.17.0
 */

var PathFollower = {

    /**
     * The Path this PathFollower is following. It can only follow one Path at a time.
     *
     * @name Phaser.GameObjects.Components.PathFollower#path
     * @type {Phaser.Curves.Path}
     * @since 3.0.0
     */
    path: null,

    /**
     * Should the PathFollower automatically rotate to point in the direction of the Path?
     *
     * @name Phaser.GameObjects.Components.PathFollower#rotateToPath
     * @type {boolean}
     * @default false
     * @since 3.0.0
     */
    rotateToPath: false,

    /**
     * If the PathFollower is rotating to match the Path (@see Phaser.GameObjects.PathFollower#rotateToPath)
     * this value is added to the rotation value. This allows you to rotate objects to a path but control
     * the angle of the rotation as well.
     *
     * @name Phaser.GameObjects.PathFollower#pathRotationOffset
     * @type {number}
     * @default 0
     * @since 3.0.0
     */
    pathRotationOffset: 0,

    /**
     * An additional vector to add to the PathFollowers position, allowing you to offset it from the
     * Path coordinates.
     *
     * @name Phaser.GameObjects.PathFollower#pathOffset
     * @type {Phaser.Math.Vector2}
     * @since 3.0.0
     */
    pathOffset: null,

    /**
     * A Vector2 that stores the current point of the path the follower is on.
     *
     * @name Phaser.GameObjects.PathFollower#pathVector
     * @type {Phaser.Math.Vector2}
     * @since 3.0.0
     */
    pathVector: null,

    /**
     * The distance the follower has traveled from the previous point to the current one, at the last update.
     *
     * @name Phaser.GameObjects.PathFollower#pathDelta
     * @type {Phaser.Math.Vector2}
     * @since 3.23.0
     */
    pathDelta: null,

    /**
     * The Tween used for following the Path.
     *
     * @name Phaser.GameObjects.PathFollower#pathTween
     * @type {Phaser.Tweens.Tween}
     * @since 3.0.0
     */
    pathTween: null,

    /**
     * Settings for the PathFollower.
     *
     * @name Phaser.GameObjects.PathFollower#pathConfig
     * @type {?Phaser.Types.GameObjects.PathFollower.PathConfig}
     * @default null
     * @since 3.0.0
     */
    pathConfig: null,

    /**
     * Records the direction of the follower so it can change direction.
     *
     * @name Phaser.GameObjects.PathFollower#_prevDirection
     * @type {integer}
     * @private
     * @since 3.0.0
     */
    _prevDirection: TWEEN_CONST.PLAYING_FORWARD,

    /**
     * Set the Path that this PathFollower should follow.
     *
     * Optionally accepts {@link Phaser.Types.GameObjects.PathFollower.PathConfig} settings.
     *
     * @method Phaser.GameObjects.Components.PathFollower#setPath
     * @since 3.0.0
     *
     * @param {Phaser.Curves.Path} path - The Path this PathFollower is following. It can only follow one Path at a time.
     * @param {(number|Phaser.Types.GameObjects.PathFollower.PathConfig|Phaser.Types.Tweens.NumberTweenBuilderConfig)} [config] - Settings for the PathFollower.
     *
     * @return {this} This Game Object.
     */
    setPath: function (path, config)
    {
        if (config === undefined) { config = this.pathConfig; }

        var tween = this.pathTween;

        if (tween && tween.isPlaying())
        {
            tween.stop();
        }

        this.path = path;

        if (config)
        {
            this.startFollow(config);
        }

        return this;
    },

    /**
     * Set whether the PathFollower should automatically rotate to point in the direction of the Path.
     *
     * @method Phaser.GameObjects.Components.PathFollower#setRotateToPath
     * @since 3.0.0
     *
     * @param {boolean} value - Whether the PathFollower should automatically rotate to point in the direction of the Path.
     * @param {number} [offset=0] - Rotation offset in degrees.
     *
     * @return {this} This Game Object.
     */
    setRotateToPath: function (value, offset)
    {
        if (offset === undefined) { offset = 0; }

        this.rotateToPath = value;

        this.pathRotationOffset = offset;

        return this;
    },

    /**
     * Is this PathFollower actively following a Path or not?
     *
     * To be considered as `isFollowing` it must be currently moving on a Path, and not paused.
     *
     * @method Phaser.GameObjects.Components.PathFollower#isFollowing
     * @since 3.0.0
     *
     * @return {boolean} `true` is this PathFollower is actively following a Path, otherwise `false`.
     */
    isFollowing: function ()
    {
        var tween = this.pathTween;

        return (tween && tween.isPlaying());
    },

    /**
     * Starts this PathFollower following its given Path.
     *
     * @method Phaser.GameObjects.Components.PathFollower#startFollow
     * @since 3.3.0
     *
     * @param {(number|Phaser.Types.GameObjects.PathFollower.PathConfig|Phaser.Types.Tweens.NumberTweenBuilderConfig)} [config={}] - The duration of the follow, or a PathFollower config object.
     * @param {number} [startAt=0] - Optional start position of the follow, between 0 and 1.
     *
     * @return {this} This Game Object.
     */
    startFollow: function (config, startAt)
    {
        if (config === undefined) { config = {}; }
        if (startAt === undefined) { startAt = 0; }

        var tween = this.pathTween;

        if (tween && tween.isPlaying())
        {
            tween.stop();
        }

        if (typeof config === 'number')
        {
            config = { duration: config };
        }

        //  Override in case they've been specified in the config
        config.from = GetValue(config, 'from', 0);
        config.to = GetValue(config, 'to', 1);

        var positionOnPath = GetBoolean(config, 'positionOnPath', false);

        this.rotateToPath = GetBoolean(config, 'rotateToPath', false);
        this.pathRotationOffset = GetValue(config, 'rotationOffset', 0);

        //  This works, but it's not an ideal way of doing it as the follower jumps position
        var seek = GetValue(config, 'startAt', startAt);

        if (seek)
        {
            config.onStart = function (tween)
            {
                var tweenData = tween.data[0];
                tweenData.progress = seek;
                tweenData.elapsed = tweenData.duration * seek;
                var v = tweenData.ease(tweenData.progress);
                tweenData.current = tweenData.start + ((tweenData.end - tweenData.start) * v);
                tweenData.target[tweenData.key] = tweenData.current;
            };
        }

        if (!this.pathOffset)
        {
            this.pathOffset = new Vector2(this.x, this.y);
        }

        if (!this.pathVector)
        {
            this.pathVector = new Vector2();
        }

        if (!this.pathDelta)
        {
            this.pathDelta = new Vector2();
        }

        this.pathDelta.reset();

        this.pathTween = this.scene.sys.tweens.addCounter(config);

        //  The starting point of the path, relative to this follower
        this.path.getStartPoint(this.pathOffset);

        if (positionOnPath)
        {
            this.x = this.pathOffset.x;
            this.y = this.pathOffset.y;
        }

        this.pathOffset.x = this.x - this.pathOffset.x;
        this.pathOffset.y = this.y - this.pathOffset.y;

        this._prevDirection = TWEEN_CONST.PLAYING_FORWARD;

        if (this.rotateToPath)
        {
            //  Set the rotation now (in case the tween has a delay on it, etc)
            var nextPoint = this.path.getPoint(0.1);

            this.rotation = Math.atan2(nextPoint.y - this.y, nextPoint.x - this.x) + DegToRad(this.pathRotationOffset);
        }

        this.pathConfig = config;

        return this;
    },

    /**
     * Pauses this PathFollower. It will still continue to render, but it will remain motionless at the
     * point on the Path at which you paused it.
     *
     * @method Phaser.GameObjects.Components.PathFollower#pauseFollow
     * @since 3.3.0
     *
     * @return {this} This Game Object.
     */
    pauseFollow: function ()
    {
        var tween = this.pathTween;

        if (tween && tween.isPlaying())
        {
            tween.pause();
        }

        return this;
    },

    /**
     * Resumes a previously paused PathFollower.
     *
     * If the PathFollower was not paused this has no effect.
     *
     * @method Phaser.GameObjects.Components.PathFollower#resumeFollow
     * @since 3.3.0
     *
     * @return {this} This Game Object.
     */
    resumeFollow: function ()
    {
        var tween = this.pathTween;

        if (tween && tween.isPaused())
        {
            tween.resume();
        }

        return this;
    },

    /**
     * Stops this PathFollower from following the path any longer.
     *
     * This will invoke any 'stop' conditions that may exist on the Path, or for the follower.
     *
     * @method Phaser.GameObjects.Components.PathFollower#stopFollow
     * @since 3.3.0
     *
     * @return {this} This Game Object.
     */
    stopFollow: function ()
    {
        var tween = this.pathTween;

        if (tween && tween.isPlaying())
        {
            tween.stop();
        }

        return this;
    },

    /**
     * Internal update handler that advances this PathFollower along the path.
     *
     * Called automatically by the Scene step, should not typically be called directly.
     *
     * @method Phaser.GameObjects.Components.PathFollower#pathUpdate
     * @since 3.17.0
     */
    pathUpdate: function ()
    {
        var tween = this.pathTween;

        if (tween)
        {
            var tweenData = tween.data[0];
            var pathDelta = this.pathDelta;
            var pathVector = this.pathVector;

            pathDelta.copy(pathVector).negate();

            if (tweenData.state === TWEEN_CONST.COMPLETE)
            {
                this.path.getPoint(1, pathVector);

                pathDelta.add(pathVector);
                pathVector.add(this.pathOffset);

                this.setPosition(pathVector.x, pathVector.y);

                return;
            }
            else if (tweenData.state !== TWEEN_CONST.PLAYING_FORWARD && tweenData.state !== TWEEN_CONST.PLAYING_BACKWARD)
            {
                //  If delayed, etc then bail out
                return;
            }

            this.path.getPoint(tween.getValue(), pathVector);

            pathDelta.add(pathVector);
            pathVector.add(this.pathOffset);

            var oldX = this.x;
            var oldY = this.y;

            this.setPosition(pathVector.x, pathVector.y);

            var speedX = this.x - oldX;
            var speedY = this.y - oldY;

            if (speedX === 0 && speedY === 0)
            {
                //  Bail out early
                return;
            }

            if (tweenData.state !== this._prevDirection)
            {
                //  We've changed direction, so don't do a rotate this frame
                this._prevDirection = tweenData.state;

                return;
            }

            if (this.rotateToPath)
            {
                this.rotation = Math.atan2(speedY, speedX) + DegToRad(this.pathRotationOffset);
            }
        }
    }

};

module.exports = PathFollower;


/***/ }),
/* 239 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Retrieves the value of the given key from an object.
 *
 * @function Phaser.Tweens.Builders.GetBoolean
 * @since 3.0.0
 *
 * @param {object} source - The object to retrieve the value from.
 * @param {string} key - The key to look for in the `source` object.
 * @param {*} defaultValue - The default value to return if the `key` doesn't exist or if no `source` object is provided.
 *
 * @return {*} The retrieved value.
 */
var GetBoolean = function (source, key, defaultValue)
{
    if (!source)
    {
        return defaultValue;
    }
    else if (source.hasOwnProperty(key))
    {
        return source[key];
    }
    else
    {
        return defaultValue;
    }
};

module.exports = GetBoolean;


/***/ }),
/* 240 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var TWEEN_CONST = {

    /**
     * TweenData state.
     * 
     * @name Phaser.Tweens.CREATED
     * @type {integer}
     * @since 3.0.0
     */
    CREATED: 0,

    /**
     * TweenData state.
     * 
     * @name Phaser.Tweens.INIT
     * @type {integer}
     * @since 3.0.0
     */
    INIT: 1,

    /**
     * TweenData state.
     * 
     * @name Phaser.Tweens.DELAY
     * @type {integer}
     * @since 3.0.0
     */
    DELAY: 2,

    /**
     * TweenData state.
     * 
     * @name Phaser.Tweens.OFFSET_DELAY
     * @type {integer}
     * @since 3.0.0
     */
    OFFSET_DELAY: 3,

    /**
     * TweenData state.
     * 
     * @name Phaser.Tweens.PENDING_RENDER
     * @type {integer}
     * @since 3.0.0
     */
    PENDING_RENDER: 4,

    /**
     * TweenData state.
     * 
     * @name Phaser.Tweens.PLAYING_FORWARD
     * @type {integer}
     * @since 3.0.0
     */
    PLAYING_FORWARD: 5,

    /**
     * TweenData state.
     * 
     * @name Phaser.Tweens.PLAYING_BACKWARD
     * @type {integer}
     * @since 3.0.0
     */
    PLAYING_BACKWARD: 6,

    /**
     * TweenData state.
     * 
     * @name Phaser.Tweens.HOLD_DELAY
     * @type {integer}
     * @since 3.0.0
     */
    HOLD_DELAY: 7,

    /**
     * TweenData state.
     * 
     * @name Phaser.Tweens.REPEAT_DELAY
     * @type {integer}
     * @since 3.0.0
     */
    REPEAT_DELAY: 8,

    /**
     * TweenData state.
     * 
     * @name Phaser.Tweens.COMPLETE
     * @type {integer}
     * @since 3.0.0
     */
    COMPLETE: 9,

    //  Tween specific (starts from 20 to cleanly allow extra TweenData consts in the future)

    /**
     * Tween state.
     * 
     * @name Phaser.Tweens.PENDING_ADD
     * @type {integer}
     * @since 3.0.0
     */
    PENDING_ADD: 20,

    /**
     * Tween state.
     * 
     * @name Phaser.Tweens.PAUSED
     * @type {integer}
     * @since 3.0.0
     */
    PAUSED: 21,

    /**
     * Tween state.
     * 
     * @name Phaser.Tweens.LOOP_DELAY
     * @type {integer}
     * @since 3.0.0
     */
    LOOP_DELAY: 22,

    /**
     * Tween state.
     * 
     * @name Phaser.Tweens.ACTIVE
     * @type {integer}
     * @since 3.0.0
     */
    ACTIVE: 23,

    /**
     * Tween state.
     * 
     * @name Phaser.Tweens.COMPLETE_DELAY
     * @type {integer}
     * @since 3.0.0
     */
    COMPLETE_DELAY: 24,

    /**
     * Tween state.
     * 
     * @name Phaser.Tweens.PENDING_REMOVE
     * @type {integer}
     * @since 3.0.0
     */
    PENDING_REMOVE: 25,

    /**
     * Tween state.
     * 
     * @name Phaser.Tweens.REMOVED
     * @type {integer}
     * @since 3.0.0
     */
    REMOVED: 26

};

module.exports = TWEEN_CONST;


/***/ }),
/* 241 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var PIPELINE_CONST = __webpack_require__(242);

/**
 * Provides methods used for setting the WebGL rendering pipeline of a Game Object.
 *
 * @namespace Phaser.GameObjects.Components.Pipeline
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
     *
     * This should only be called during the instantiation of the Game Object.
     *
     * @method Phaser.GameObjects.Components.Pipeline#initPipeline
     * @webglOnly
     * @since 3.0.0
     *
     * @param {string} [name=MultiPipeline] - The name of the pipeline to set on this Game Object. Defaults to the Multi Pipeline.
     *
     * @return {boolean} `true` if the pipeline was set successfully, otherwise `false`.
     */
    initPipeline: function (name)
    {
        if (name === undefined) { name = PIPELINE_CONST.MULTI_PIPELINE; }

        var renderer = this.scene.sys.game.renderer;
        var pipelines = renderer.pipelines;

        if (pipelines && pipelines.has(name))
        {
            this.defaultPipeline = pipelines.get(name);
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
     * @param {string} name - The name of the pipeline to set on this Game Object.
     *
     * @return {this} This Game Object instance.
     */
    setPipeline: function (name)
    {
        var renderer = this.scene.sys.game.renderer;
        var pipelines = renderer.pipelines;

        if (pipelines && pipelines.has(name))
        {
            this.pipeline = pipelines.get(name);
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
/* 242 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var PIPELINE_CONST = {

    /**
     * The Bitmap Mask Pipeline.
     *
     * @name Phaser.Renderer.WebGL.Pipelines.BITMAPMASK_PIPELINE
     * @type {string}
     * @const
     * @since 3.50.0
     */
    BITMAPMASK_PIPELINE: 'BitmapMaskPipeline',

    /**
     * The Light 2D Pipeline.
     *
     * @name Phaser.Renderer.WebGL.Pipelines.LIGHT_PIPELINE
     * @type {string}
     * @const
     * @since 3.50.0
     */
    LIGHT_PIPELINE: 'Light2D',

    /**
     * The Single Texture Pipeline.
     *
     * @name Phaser.Renderer.WebGL.Pipelines.SINGLE_PIPELINE
     * @type {string}
     * @const
     * @since 3.50.0
     */
    SINGLE_PIPELINE: 'SinglePipeline',

    /**
     * The Multi Texture Pipeline.
     *
     * @name Phaser.Renderer.WebGL.Pipelines.MULTI_PIPELINE
     * @type {string}
     * @const
     * @since 3.50.0
     */
    MULTI_PIPELINE: 'MultiPipeline',

    /**
     * The Rope Pipeline.
     *
     * @name Phaser.Renderer.WebGL.Pipelines.ROPE_PIPELINE
     * @type {string}
     * @const
     * @since 3.50.0
     */
    ROPE_PIPELINE: 'RopePipeline',

    /**
     * The Mesh Pipeline.
     *
     * @name Phaser.Renderer.WebGL.Pipelines.MESH_PIPELINE
     * @type {string}
     * @const
     * @since 3.50.0
     */
    MESH_PIPELINE: 'MeshPipeline'

};

module.exports = PIPELINE_CONST;


/***/ }),
/* 243 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Provides methods used for getting and setting the Scroll Factor of a Game Object.
 *
 * @namespace Phaser.GameObjects.Components.ScrollFactor
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
/* 244 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Provides methods used for getting and setting the size of a Game Object.
 * 
 * @namespace Phaser.GameObjects.Components.Size
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
            return Math.abs(this.scaleX * this.frame.realWidth);
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
            return Math.abs(this.scaleY * this.frame.realHeight);
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
/* 245 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

//  bitmask flag for GameObject.renderMask
var _FLAG = 8; // 1000

/**
 * Provides methods used for getting and setting the texture of a Game Object.
 *
 * @namespace Phaser.GameObjects.Components.Texture
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
     * @param {(string|Phaser.Textures.Texture)} key - The key of the texture to be used, as stored in the Texture Manager, or a Texture instance.
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
/* 246 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

//  bitmask flag for GameObject.renderMask
var _FLAG = 8; // 1000

/**
 * Provides methods used for getting and setting the texture of a Game Object.
 *
 * @namespace Phaser.GameObjects.Components.TextureCrop
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
/* 247 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Provides methods used for setting the tint of a Game Object.
 * Should be applied as a mixin and not used directly.
 *
 * @namespace Phaser.GameObjects.Components.Tint
 * @webglOnly
 * @since 3.0.0
 */

var Tint = {

    /**
     * The tint value being applied to the top-left vertice of the Game Object.
     * This value is interpolated from the corner to the center of the Game Object.
     * The value should be set as a hex number, i.e. 0xff0000 for red, or 0xff00ff for purple.
     *
     * @name Phaser.GameObjects.Components.Tint#tintTopLeft
     * @type {number}
     * @default 0xffffff
     * @since 3.0.0
     */
    tintTopLeft: 0xffffff,

    /**
     * The tint value being applied to the top-right vertice of the Game Object.
     * This value is interpolated from the corner to the center of the Game Object.
     * The value should be set as a hex number, i.e. 0xff0000 for red, or 0xff00ff for purple.
     *
     * @name Phaser.GameObjects.Components.Tint#tintTopRight
     * @type {number}
     * @default 0xffffff
     * @since 3.0.0
     */
    tintTopRight: 0xffffff,

    /**
     * The tint value being applied to the bottom-left vertice of the Game Object.
     * This value is interpolated from the corner to the center of the Game Object.
     * The value should be set as a hex number, i.e. 0xff0000 for red, or 0xff00ff for purple.
     *
     * @name Phaser.GameObjects.Components.Tint#tintBottomLeft
     * @type {number}
     * @default 0xffffff
     * @since 3.0.0
     */
    tintBottomLeft: 0xffffff,

    /**
     * The tint value being applied to the bottom-right vertice of the Game Object.
     * This value is interpolated from the corner to the center of the Game Object.
     * The value should be set as a hex number, i.e. 0xff0000 for red, or 0xff00ff for purple.
     *
     * @name Phaser.GameObjects.Components.Tint#tintBottomRight
     * @type {number}
     * @default 0xffffff
     * @since 3.0.0
     */
    tintBottomRight: 0xffffff,

    /**
     * The tint fill mode.
     *
     * `false` = An additive tint (the default), where vertices colors are blended with the texture.
     * `true` = A fill tint, where the vertices colors replace the texture, but respects texture alpha.
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

        this.tintTopLeft = topLeft;
        this.tintTopRight = topRight;
        this.tintBottomLeft = bottomLeft;
        this.tintBottomRight = bottomRight;

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
     * The tint value being applied to the whole of the Game Object.
     * This property is a setter-only. Use the properties `tintTopLeft` etc to read the current tint value.
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
     * Does this Game Object have a tint applied?
     *
     * It checks to see if the 4 tint properties are set to the value 0xffffff
     * and that the `tintFill` property is `false`. This indicates that a Game Object isn't tinted.
     *
     * @name Phaser.GameObjects.Components.Tint#isTinted
     * @type {boolean}
     * @webglOnly
     * @readonly
     * @since 3.11.0
     */
    isTinted: {

        get: function ()
        {
            var white = 0xffffff;

            return (
                this.tintFill ||
                this.tintTopLeft !== white ||
                this.tintTopRight !== white ||
                this.tintBottomLeft !== white ||
                this.tintBottomRight !== white
            );
        }

    }

};

module.exports = Tint;


/***/ }),
/* 248 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var MATH_CONST = __webpack_require__(2);
var TransformMatrix = __webpack_require__(41);
var TransformXY = __webpack_require__(29);
var WrapAngle = __webpack_require__(16);
var WrapAngleDegrees = __webpack_require__(17);
var Vector2 = __webpack_require__(1);

//  global bitmask flag for GameObject.renderMask (used by Scale)
var _FLAG = 4; // 0100

/**
 * Provides methods used for getting and setting the position, scale and rotation of a Game Object.
 *
 * @namespace Phaser.GameObjects.Components.Transform
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
     *
     * Note: The z position does not control the rendering order of 2D Game Objects. Use
     * {@link Phaser.GameObjects.Components.Depth#depth} instead.
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
     * This is a special setter that allows you to set both the horizontal and vertical scale of this Game Object
     * to the same value, at the same time. When reading this value the result returned is `(scaleX + scaleY) / 2`.
     *
     * Use of this property implies you wish the horizontal and vertical scales to be equal to each other. If this
     * isn't the case, use the `scaleX` or `scaleY` properties instead.
     *
     * @name Phaser.GameObjects.Components.Transform#scale
     * @type {number}
     * @default 1
     * @since 3.18.0
     */
    scale: {

        get: function ()
        {
            return (this._scaleX + this._scaleY) / 2;
        },

        set: function (value)
        {
            this._scaleX = value;
            this._scaleY = value;

            if (value === 0)
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

            if (value === 0)
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

            if (value === 0)
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
     * Phaser uses a right-hand clockwise rotation system, where 0 is right, 90 is down, 180/-180 is left
     * and -90 is up.
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
     * Phaser uses a right-hand clockwise rotation system, where 0 is right, PI/2 is down, +-PI is left
     * and -PI/2 is up.
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
     * Copies an object's coordinates to this Game Object's position.
     *
     * @method Phaser.GameObjects.Components.Transform#copyPosition
     * @since 3.50.0
     *
     * @param {(Phaser.Types.Math.Vector2Like|Phaser.Types.Math.Vector3Like|Phaser.Types.Math.Vector4Like)} source - An object with numeric 'x', 'y', 'z', or 'w' properties. Undefined values are not copied.
     *
     * @return {this} This Game Object instance.
     */
    copyPosition: function (source)
    {
        if (source.x !== undefined) { this.x = source.x; }
        if (source.y !== undefined) { this.y = source.y; }
        if (source.z !== undefined) { this.z = source.z; }
        if (source.w !== undefined) { this.w = source.w; }

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
        if (width === undefined) { width = this.scene.sys.scale.width; }
        if (height === undefined) { height = this.scene.sys.scale.height; }

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
     * Note: The z position does not control the rendering order of 2D Game Objects. Use
     * {@link Phaser.GameObjects.Components.Depth#setDepth} instead.
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
     * @param {Phaser.GameObjects.Components.TransformMatrix} [parentMatrix] - A temporary matrix to hold parent values during the calculations.
     *
     * @return {Phaser.GameObjects.Components.TransformMatrix} The populated Transform Matrix.
     */
    getWorldTransformMatrix: function (tempMatrix, parentMatrix)
    {
        if (tempMatrix === undefined) { tempMatrix = new TransformMatrix(); }
        if (parentMatrix === undefined) { parentMatrix = new TransformMatrix(); }

        var parent = this.parentContainer;

        if (!parent)
        {
            return this.getLocalTransformMatrix(tempMatrix);
        }

        tempMatrix.applyITRS(this.x, this.y, this._rotation, this._scaleX, this._scaleY);

        while (parent)
        {
            parentMatrix.applyITRS(parent.x, parent.y, parent._rotation, parent._scaleX, parent._scaleY);

            parentMatrix.multiply(tempMatrix, tempMatrix);

            parent = parent.parentContainer;
        }

        return tempMatrix;
    },

    /**
     * Takes the given `x` and `y` coordinates and converts them into local space for this
     * Game Object, taking into account parent and local transforms, and the Display Origin.
     *
     * The returned Vector2 contains the translated point in its properties.
     *
     * A Camera needs to be provided in order to handle modified scroll factors. If no
     * camera is specified, it will use the `main` camera from the Scene to which this
     * Game Object belongs.
     *
     * @method Phaser.GameObjects.Components.Transform#getLocalPoint
     * @since 3.50.0
     *
     * @param {number} x - The x position to translate.
     * @param {number} y - The y position to translate.
     * @param {Phaser.Math.Vector2} [point] - A Vector2, or point-like object, to store the results in.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera] - The Camera which is being tested against. If not given will use the Scene default camera.
     *
     * @return {Phaser.Math.Vector2} The translated point.
     */
    getLocalPoint: function (x, y, point, camera)
    {
        if (!point) { point = new Vector2(); }
        if (!camera) { camera = this.scene.sys.cameras.main; }

        var csx = camera.scrollX;
        var csy = camera.scrollY;

        var px = x + (csx * this.scrollFactorX) - csx;
        var py = y + (csy * this.scrollFactorY) - csy;

        if (this.parentContainer)
        {
            this.getWorldTransformMatrix().applyInverse(px, py, point);
        }
        else
        {
            TransformXY(px, py, this.x, this.y, this.rotation, this.scaleX, this.scaleY, point);
        }

        //  Normalize origin
        if (this._originComponent)
        {
            point.x += this._displayOriginX;
            point.y += this._displayOriginY;
        }

        return point;
    },

    /**
     * Gets the sum total rotation of all of this Game Objects parent Containers.
     *
     * The returned value is in radians and will be zero if this Game Object has no parent container.
     *
     * @method Phaser.GameObjects.Components.Transform#getParentRotation
     * @since 3.18.0
     *
     * @return {number} The sum total rotation, in radians, of all parent containers of this Game Object.
     */
    getParentRotation: function ()
    {
        var rotation = 0;

        var parent = this.parentContainer;

        while (parent)
        {
            rotation += parent.rotation;

            parent = parent.parentContainer;
        }

        return rotation;
    }

};

module.exports = Transform;


/***/ }),
/* 249 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

//  bitmask flag for GameObject.renderMask
var _FLAG = 1; // 0001

/**
 * Provides methods used for setting the visibility of a Game Object.
 * Should be applied as a mixin and not used directly.
 * 
 * @namespace Phaser.GameObjects.Components.Visible
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
/* 250 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var renderWebGL = __webpack_require__(7);
var renderCanvas = __webpack_require__(7);

if (typeof WEBGL_RENDERER)
{
    renderWebGL = __webpack_require__(251);
}

if (typeof CANVAS_RENDERER)
{
    renderCanvas = __webpack_require__(252);
}

module.exports = {

    renderWebGL: renderWebGL,
    renderCanvas: renderCanvas

};


/***/ }),
/* 251 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
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
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var SpriteWebGLRenderer = function (renderer, src, camera, parentMatrix)
{
    this.pipeline.batchSprite(src, camera, parentMatrix);
};

module.exports = SpriteWebGLRenderer;


/***/ }),
/* 252 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
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
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var SpriteCanvasRenderer = function (renderer, src, camera, parentMatrix)
{
    renderer.batchSprite(src, src.frame, camera, parentMatrix);
};

module.exports = SpriteCanvasRenderer;


/***/ }),
/* 253 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Camera = __webpack_require__(33);
var Class = __webpack_require__(0);
var Vector3 = __webpack_require__(3);

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
/* 254 */
/***/ (function(module, exports, __webpack_require__) {

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2020 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser3-plugin-template/blob/master/LICENSE|MIT License}
*/

var BasePlugin = __webpack_require__(255);
var Class = __webpack_require__(0);
var SceneEvents = __webpack_require__(256);

/**
 * @classdesc
 * A Scene Level Plugin is installed into every Scene and belongs to that Scene.
 * It can listen for Scene events and respond to them.
 * It can map itself to a Scene property, or into the Scene Systems, or both.
 *
 * @class ScenePlugin
 * @memberof Phaser.Plugins
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

        /**
         * A reference to the Scene that has installed this plugin.
         * Only set if it's a Scene Plugin, otherwise `null`.
         * This property is only set when the plugin is instantiated and added to the Scene, not before.
         * You can use it during the `boot` method.
         *
         * @name Phaser.Plugins.ScenePlugin#scene
         * @type {?Phaser.Scene}
         * @protected
         * @since 3.8.0
         */
        this.scene = scene;

        /**
         * A reference to the Scene Systems of the Scene that has installed this plugin.
         * Only set if it's a Scene Plugin, otherwise `null`.
         * This property is only set when the plugin is instantiated and added to the Scene, not before.
         * You can use it during the `boot` method.
         *
         * @name Phaser.Plugins.ScenePlugin#systems
         * @type {?Phaser.Scenes.Systems}
         * @protected
         * @since 3.8.0
         */
        this.systems = scene.sys;

        scene.sys.events.once(SceneEvents.BOOT, this.boot, this);
    },

    /**
     * This method is called when the Scene boots. It is only ever called once.
     *
     * By this point the plugin properties `scene` and `systems` will have already been set.
     *
     * In here you can listen for {@link Phaser.Scenes.Events Scene events} and set-up whatever you need for this plugin to run.
     * Here are the Scene events you can listen to:
     *
     * - start
     * - ready
     * - preupdate
     * - update
     * - postupdate
     * - resize
     * - pause
     * - resume
     * - sleep
     * - wake
     * - transitioninit
     * - transitionstart
     * - transitioncomplete
     * - transitionout
     * - shutdown
     * - destroy
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
    },

    /**
     * Game instance has been destroyed.
     * 
     * You must release everything in here, all references, all objects, free it all up.
     *
     * @method Phaser.Plugins.ScenePlugin#destroy
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

module.exports = ScenePlugin;


/***/ }),
/* 255 */
/***/ (function(module, exports, __webpack_require__) {

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2020 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser3-plugin-template/blob/master/LICENSE|MIT License}
*/

var Class = __webpack_require__(0);

/**
 * @classdesc
 * A Global Plugin is installed just once into the Game owned Plugin Manager.
 * It can listen for Game events and respond to them.
 *
 * @class BasePlugin
 * @memberof Phaser.Plugins
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
    },

    /**
     * The PluginManager calls this method on a Global Plugin when the plugin is first instantiated.
     * It will never be called again on this instance.
     * In here you can set-up whatever you need for this plugin to run.
     * If a plugin is set to automatically start then `BasePlugin.start` will be called immediately after this.
     * On a Scene Plugin, this method is never called. Use {@link Phaser.Plugins.ScenePlugin#boot} instead.
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
     * The PluginManager calls this method on a Global Plugin when the plugin is started.
     * If a plugin is stopped, and then started again, this will get called again.
     * Typically called immediately after `BasePlugin.init`.
     * On a Scene Plugin, this method is never called.
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
     * The PluginManager calls this method on a Global Plugin when the plugin is stopped.
     * The game code has requested that your plugin stop doing whatever it does.
     * It is now considered as 'inactive' by the PluginManager.
     * Handle that process here (i.e. stop listening for events, etc)
     * If the plugin is started again then `BasePlugin.start` will be called again.
     * On a Scene Plugin, this method is never called.
     *
     * @method Phaser.Plugins.BasePlugin#stop
     * @since 3.8.0
     */
    stop: function ()
    {
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
/* 256 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Scenes.Events
 */

module.exports = {

    ADDED_TO_SCENE: __webpack_require__(257),
    BOOT: __webpack_require__(258),
    CREATE: __webpack_require__(259),
    DESTROY: __webpack_require__(260),
    PAUSE: __webpack_require__(261),
    POST_UPDATE: __webpack_require__(262),
    PRE_UPDATE: __webpack_require__(263),
    READY: __webpack_require__(264),
    REMOVED_FROM_SCENE: __webpack_require__(265),
    RENDER: __webpack_require__(266),
    RESUME: __webpack_require__(267),
    SHUTDOWN: __webpack_require__(268),
    SLEEP: __webpack_require__(269),
    START: __webpack_require__(270),
    TRANSITION_COMPLETE: __webpack_require__(271),
    TRANSITION_INIT: __webpack_require__(272),
    TRANSITION_OUT: __webpack_require__(273),
    TRANSITION_START: __webpack_require__(274),
    TRANSITION_WAKE: __webpack_require__(275),
    UPDATE: __webpack_require__(276),
    WAKE: __webpack_require__(277)

};


/***/ }),
/* 257 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Game Object Added to Scene Event.
 *
 * This event is dispatched when a Game Object is added to a Scene.
 *
 * Listen for it from a Scene using `this.scene.events.on('addedtoscene', listener)`.
 *
 * @event Phaser.Scenes.Events#ADDED_TO_SCENE
 * @since 3.50.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object that was added to the Scene.
 * @param {Phaser.Scene} scene - The Scene to which the Game Object was added.
 */
module.exports = 'addedtoscene';


/***/ }),
/* 258 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Scene Systems Boot Event.
 * 
 * This event is dispatched by a Scene during the Scene Systems boot process. Primarily used by Scene Plugins.
 * 
 * Listen to it from a Scene using `this.scene.events.on('boot', listener)`.
 * 
 * @event Phaser.Scenes.Events#BOOT
 * @since 3.0.0
 * 
 * @param {Phaser.Scenes.Systems} sys - A reference to the Scene Systems class of the Scene that emitted this event.
 */
module.exports = 'boot';


/***/ }),
/* 259 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Scene Create Event.
 * 
 * This event is dispatched by a Scene after it has been created by the Scene Manager.
 * 
 * If a Scene has a `create` method then this event is emitted _after_ that has run.
 * 
 * If there is a transition, this event will be fired after the `TRANSITION_START` event.
 * 
 * Listen to it from a Scene using `this.scene.events.on('create', listener)`.
 * 
 * @event Phaser.Scenes.Events#CREATE
 * @since 3.17.0
 * 
 * @param {Phaser.Scene} scene - A reference to the Scene that emitted this event.
 */
module.exports = 'create';


/***/ }),
/* 260 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Scene Systems Destroy Event.
 * 
 * This event is dispatched by a Scene during the Scene Systems destroy process.
 * 
 * Listen to it from a Scene using `this.scene.events.on('destroy', listener)`.
 * 
 * You should destroy any resources that may be in use by your Scene in this event handler.
 * 
 * @event Phaser.Scenes.Events#DESTROY
 * @since 3.0.0
 * 
 * @param {Phaser.Scenes.Systems} sys - A reference to the Scene Systems class of the Scene that emitted this event.
 */
module.exports = 'destroy';


/***/ }),
/* 261 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Scene Systems Pause Event.
 * 
 * This event is dispatched by a Scene when it is paused, either directly via the `pause` method, or as an
 * action from another Scene.
 * 
 * Listen to it from a Scene using `this.scene.events.on('pause', listener)`.
 * 
 * @event Phaser.Scenes.Events#PAUSE
 * @since 3.0.0
 * 
 * @param {Phaser.Scenes.Systems} sys - A reference to the Scene Systems class of the Scene that emitted this event.
 * @param {any} [data] - An optional data object that was passed to this Scene when it was paused.
 */
module.exports = 'pause';


/***/ }),
/* 262 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Scene Systems Post Update Event.
 * 
 * This event is dispatched by a Scene during the main game loop step.
 * 
 * The event flow for a single step of a Scene is as follows:
 * 
 * 1. [PRE_UPDATE]{@linkcode Phaser.Scenes.Events#event:PRE_UPDATE}
 * 2. [UPDATE]{@linkcode Phaser.Scenes.Events#event:UPDATE}
 * 3. The `Scene.update` method is called, if it exists
 * 4. [POST_UPDATE]{@linkcode Phaser.Scenes.Events#event:POST_UPDATE}
 * 5. [RENDER]{@linkcode Phaser.Scenes.Events#event:RENDER}
 * 
 * Listen to it from a Scene using `this.scene.events.on('postupdate', listener)`.
 * 
 * A Scene will only run its step if it is active.
 * 
 * @event Phaser.Scenes.Events#POST_UPDATE
 * @since 3.0.0
 * 
 * @param {Phaser.Scenes.Systems} sys - A reference to the Scene Systems class of the Scene that emitted this event.
 * @param {number} time - The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
 * @param {number} delta - The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
 */
module.exports = 'postupdate';


/***/ }),
/* 263 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Scene Systems Pre Update Event.
 * 
 * This event is dispatched by a Scene during the main game loop step.
 * 
 * The event flow for a single step of a Scene is as follows:
 * 
 * 1. [PRE_UPDATE]{@linkcode Phaser.Scenes.Events#event:PRE_UPDATE}
 * 2. [UPDATE]{@linkcode Phaser.Scenes.Events#event:UPDATE}
 * 3. The `Scene.update` method is called, if it exists
 * 4. [POST_UPDATE]{@linkcode Phaser.Scenes.Events#event:POST_UPDATE}
 * 5. [RENDER]{@linkcode Phaser.Scenes.Events#event:RENDER}
 * 
 * Listen to it from a Scene using `this.scene.events.on('preupdate', listener)`.
 * 
 * A Scene will only run its step if it is active.
 * 
 * @event Phaser.Scenes.Events#PRE_UPDATE
 * @since 3.0.0
 * 
 * @param {Phaser.Scenes.Systems} sys - A reference to the Scene Systems class of the Scene that emitted this event.
 * @param {number} time - The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
 * @param {number} delta - The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
 */
module.exports = 'preupdate';


/***/ }),
/* 264 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Scene Systems Ready Event.
 * 
 * This event is dispatched by a Scene during the Scene Systems start process.
 * By this point in the process the Scene is now fully active and rendering.
 * This event is meant for your game code to use, as all plugins have responded to the earlier 'start' event.
 * 
 * Listen to it from a Scene using `this.scene.events.on('ready', listener)`.
 * 
 * @event Phaser.Scenes.Events#READY
 * @since 3.0.0
 * 
 * @param {Phaser.Scenes.Systems} sys - A reference to the Scene Systems class of the Scene that emitted this event.
 * @param {any} [data] - An optional data object that was passed to this Scene when it was started.
 */
module.exports = 'ready';


/***/ }),
/* 265 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Game Object Removed from Scene Event.
 *
 * This event is dispatched when a Game Object is removed from a Scene.
 *
 * Listen for it from a Scene using `this.scene.events.on('removedfromscene', listener)`.
 *
 * @event Phaser.Scenes.Events#REMOVED_FROM_SCENE
 * @since 3.50.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object that was removed from the Scene.
 * @param {Phaser.Scene} scene - The Scene from which the Game Object was removed.
 */
module.exports = 'removedfromscene';


/***/ }),
/* 266 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Scene Systems Render Event.
 * 
 * This event is dispatched by a Scene during the main game loop step.
 * 
 * The event flow for a single step of a Scene is as follows:
 * 
 * 1. [PRE_UPDATE]{@linkcode Phaser.Scenes.Events#event:PRE_UPDATE}
 * 2. [UPDATE]{@linkcode Phaser.Scenes.Events#event:UPDATE}
 * 3. The `Scene.update` method is called, if it exists
 * 4. [POST_UPDATE]{@linkcode Phaser.Scenes.Events#event:POST_UPDATE}
 * 5. [RENDER]{@linkcode Phaser.Scenes.Events#event:RENDER}
 * 
 * Listen to it from a Scene using `this.scene.events.on('render', listener)`.
 * 
 * A Scene will only render if it is visible and active.
 * By the time this event is dispatched, the Scene will have already been rendered.
 * 
 * @event Phaser.Scenes.Events#RENDER
 * @since 3.0.0
 * 
 * @param {(Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer)} renderer - The renderer that rendered the Scene.
 */
module.exports = 'render';


/***/ }),
/* 267 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Scene Systems Resume Event.
 * 
 * This event is dispatched by a Scene when it is resumed from a paused state, either directly via the `resume` method,
 * or as an action from another Scene.
 * 
 * Listen to it from a Scene using `this.scene.events.on('resume', listener)`.
 * 
 * @event Phaser.Scenes.Events#RESUME
 * @since 3.0.0
 * 
 * @param {Phaser.Scenes.Systems} sys - A reference to the Scene Systems class of the Scene that emitted this event.
 * @param {any} [data] - An optional data object that was passed to this Scene when it was resumed.
 */
module.exports = 'resume';


/***/ }),
/* 268 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Scene Systems Shutdown Event.
 * 
 * This event is dispatched by a Scene during the Scene Systems shutdown process.
 * 
 * Listen to it from a Scene using `this.scene.events.on('shutdown', listener)`.
 * 
 * You should free-up any resources that may be in use by your Scene in this event handler, on the understanding
 * that the Scene may, at any time, become active again. A shutdown Scene is not 'destroyed', it's simply not
 * currently active. Use the [DESTROY]{@linkcode Phaser.Scenes.Events#event:DESTROY} event to completely clear resources.
 * 
 * @event Phaser.Scenes.Events#SHUTDOWN
 * @since 3.0.0
 * 
 * @param {Phaser.Scenes.Systems} sys - A reference to the Scene Systems class of the Scene that emitted this event.
 * @param {any} [data] - An optional data object that was passed to this Scene when it was shutdown.
 */
module.exports = 'shutdown';


/***/ }),
/* 269 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Scene Systems Sleep Event.
 * 
 * This event is dispatched by a Scene when it is sent to sleep, either directly via the `sleep` method,
 * or as an action from another Scene.
 * 
 * Listen to it from a Scene using `this.scene.events.on('sleep', listener)`.
 * 
 * @event Phaser.Scenes.Events#SLEEP
 * @since 3.0.0
 * 
 * @param {Phaser.Scenes.Systems} sys - A reference to the Scene Systems class of the Scene that emitted this event.
 * @param {any} [data] - An optional data object that was passed to this Scene when it was sent to sleep.
 */
module.exports = 'sleep';


/***/ }),
/* 270 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Scene Systems Start Event.
 * 
 * This event is dispatched by a Scene during the Scene Systems start process. Primarily used by Scene Plugins.
 * 
 * Listen to it from a Scene using `this.scene.events.on('start', listener)`.
 * 
 * @event Phaser.Scenes.Events#START
 * @since 3.0.0
 * 
 * @param {Phaser.Scenes.Systems} sys - A reference to the Scene Systems class of the Scene that emitted this event.
 */
module.exports = 'start';


/***/ }),
/* 271 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Scene Transition Complete Event.
 * 
 * This event is dispatched by the Target Scene of a transition.
 * 
 * It happens when the transition process has completed. This occurs when the duration timer equals or exceeds the duration
 * of the transition.
 * 
 * Listen to it from a Scene using `this.scene.events.on('transitioncomplete', listener)`.
 * 
 * The Scene Transition event flow is as follows:
 * 
 * 1. [TRANSITION_OUT]{@linkcode Phaser.Scenes.Events#event:TRANSITION_OUT} - the Scene that started the transition will emit this event.
 * 2. [TRANSITION_INIT]{@linkcode Phaser.Scenes.Events#event:TRANSITION_INIT} - the Target Scene will emit this event if it has an `init` method.
 * 3. [TRANSITION_START]{@linkcode Phaser.Scenes.Events#event:TRANSITION_START} - the Target Scene will emit this event after its `create` method is called, OR ...
 * 4. [TRANSITION_WAKE]{@linkcode Phaser.Scenes.Events#event:TRANSITION_WAKE} - the Target Scene will emit this event if it was asleep and has been woken-up to be transitioned to.
 * 5. [TRANSITION_COMPLETE]{@linkcode Phaser.Scenes.Events#event:TRANSITION_COMPLETE} - the Target Scene will emit this event when the transition finishes.
 * 
 * @event Phaser.Scenes.Events#TRANSITION_COMPLETE
 * @since 3.5.0
 * 
 * @param {Phaser.Scene} scene -The Scene on which the transitioned completed.
 */
module.exports = 'transitioncomplete';


/***/ }),
/* 272 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Scene Transition Init Event.
 * 
 * This event is dispatched by the Target Scene of a transition.
 * 
 * It happens immediately after the `Scene.init` method is called. If the Scene does not have an `init` method,
 * this event is not dispatched.
 * 
 * Listen to it from a Scene using `this.scene.events.on('transitioninit', listener)`.
 * 
 * The Scene Transition event flow is as follows:
 * 
 * 1. [TRANSITION_OUT]{@linkcode Phaser.Scenes.Events#event:TRANSITION_OUT} - the Scene that started the transition will emit this event.
 * 2. [TRANSITION_INIT]{@linkcode Phaser.Scenes.Events#event:TRANSITION_INIT} - the Target Scene will emit this event if it has an `init` method.
 * 3. [TRANSITION_START]{@linkcode Phaser.Scenes.Events#event:TRANSITION_START} - the Target Scene will emit this event after its `create` method is called, OR ...
 * 4. [TRANSITION_WAKE]{@linkcode Phaser.Scenes.Events#event:TRANSITION_WAKE} - the Target Scene will emit this event if it was asleep and has been woken-up to be transitioned to.
 * 5. [TRANSITION_COMPLETE]{@linkcode Phaser.Scenes.Events#event:TRANSITION_COMPLETE} - the Target Scene will emit this event when the transition finishes.
 * 
 * @event Phaser.Scenes.Events#TRANSITION_INIT
 * @since 3.5.0
 * 
 * @param {Phaser.Scene} from - A reference to the Scene that is being transitioned from.
 * @param {number} duration - The duration of the transition in ms.
 */
module.exports = 'transitioninit';


/***/ }),
/* 273 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Scene Transition Out Event.
 * 
 * This event is dispatched by a Scene when it initiates a transition to another Scene.
 * 
 * Listen to it from a Scene using `this.scene.events.on('transitionout', listener)`.
 * 
 * The Scene Transition event flow is as follows:
 * 
 * 1. [TRANSITION_OUT]{@linkcode Phaser.Scenes.Events#event:TRANSITION_OUT} - the Scene that started the transition will emit this event.
 * 2. [TRANSITION_INIT]{@linkcode Phaser.Scenes.Events#event:TRANSITION_INIT} - the Target Scene will emit this event if it has an `init` method.
 * 3. [TRANSITION_START]{@linkcode Phaser.Scenes.Events#event:TRANSITION_START} - the Target Scene will emit this event after its `create` method is called, OR ...
 * 4. [TRANSITION_WAKE]{@linkcode Phaser.Scenes.Events#event:TRANSITION_WAKE} - the Target Scene will emit this event if it was asleep and has been woken-up to be transitioned to.
 * 5. [TRANSITION_COMPLETE]{@linkcode Phaser.Scenes.Events#event:TRANSITION_COMPLETE} - the Target Scene will emit this event when the transition finishes.
 * 
 * @event Phaser.Scenes.Events#TRANSITION_OUT
 * @since 3.5.0
 * 
 * @param {Phaser.Scene} target - A reference to the Scene that is being transitioned to.
 * @param {number} duration - The duration of the transition in ms.
 */
module.exports = 'transitionout';


/***/ }),
/* 274 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Scene Transition Start Event.
 * 
 * This event is dispatched by the Target Scene of a transition, only if that Scene was not asleep.
 * 
 * It happens immediately after the `Scene.create` method is called. If the Scene does not have a `create` method,
 * this event is dispatched anyway.
 * 
 * If the Target Scene was sleeping then the [TRANSITION_WAKE]{@linkcode Phaser.Scenes.Events#event:TRANSITION_WAKE} event is
 * dispatched instead of this event.
 * 
 * Listen to it from a Scene using `this.scene.events.on('transitionstart', listener)`.
 * 
 * The Scene Transition event flow is as follows:
 * 
 * 1. [TRANSITION_OUT]{@linkcode Phaser.Scenes.Events#event:TRANSITION_OUT} - the Scene that started the transition will emit this event.
 * 2. [TRANSITION_INIT]{@linkcode Phaser.Scenes.Events#event:TRANSITION_INIT} - the Target Scene will emit this event if it has an `init` method.
 * 3. [TRANSITION_START]{@linkcode Phaser.Scenes.Events#event:TRANSITION_START} - the Target Scene will emit this event after its `create` method is called, OR ...
 * 4. [TRANSITION_WAKE]{@linkcode Phaser.Scenes.Events#event:TRANSITION_WAKE} - the Target Scene will emit this event if it was asleep and has been woken-up to be transitioned to.
 * 5. [TRANSITION_COMPLETE]{@linkcode Phaser.Scenes.Events#event:TRANSITION_COMPLETE} - the Target Scene will emit this event when the transition finishes.
 * 
 * @event Phaser.Scenes.Events#TRANSITION_START
 * @since 3.5.0
 * 
 * @param {Phaser.Scene} from - A reference to the Scene that is being transitioned from.
 * @param {number} duration - The duration of the transition in ms.
 */
module.exports = 'transitionstart';


/***/ }),
/* 275 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Scene Transition Wake Event.
 * 
 * This event is dispatched by the Target Scene of a transition, only if that Scene was asleep before
 * the transition began. If the Scene was not asleep the [TRANSITION_START]{@linkcode Phaser.Scenes.Events#event:TRANSITION_START} event is dispatched instead.
 * 
 * Listen to it from a Scene using `this.scene.events.on('transitionwake', listener)`.
 * 
 * The Scene Transition event flow is as follows:
 * 
 * 1. [TRANSITION_OUT]{@linkcode Phaser.Scenes.Events#event:TRANSITION_OUT} - the Scene that started the transition will emit this event.
 * 2. [TRANSITION_INIT]{@linkcode Phaser.Scenes.Events#event:TRANSITION_INIT} - the Target Scene will emit this event if it has an `init` method.
 * 3. [TRANSITION_START]{@linkcode Phaser.Scenes.Events#event:TRANSITION_START} - the Target Scene will emit this event after its `create` method is called, OR ...
 * 4. [TRANSITION_WAKE]{@linkcode Phaser.Scenes.Events#event:TRANSITION_WAKE} - the Target Scene will emit this event if it was asleep and has been woken-up to be transitioned to.
 * 5. [TRANSITION_COMPLETE]{@linkcode Phaser.Scenes.Events#event:TRANSITION_COMPLETE} - the Target Scene will emit this event when the transition finishes.
 * 
 * @event Phaser.Scenes.Events#TRANSITION_WAKE
 * @since 3.5.0
 * 
 * @param {Phaser.Scene} from - A reference to the Scene that is being transitioned from.
 * @param {number} duration - The duration of the transition in ms.
 */
module.exports = 'transitionwake';


/***/ }),
/* 276 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Scene Systems Update Event.
 * 
 * This event is dispatched by a Scene during the main game loop step.
 * 
 * The event flow for a single step of a Scene is as follows:
 * 
 * 1. [PRE_UPDATE]{@linkcode Phaser.Scenes.Events#event:PRE_UPDATE}
 * 2. [UPDATE]{@linkcode Phaser.Scenes.Events#event:UPDATE}
 * 3. The `Scene.update` method is called, if it exists
 * 4. [POST_UPDATE]{@linkcode Phaser.Scenes.Events#event:POST_UPDATE}
 * 5. [RENDER]{@linkcode Phaser.Scenes.Events#event:RENDER}
 * 
 * Listen to it from a Scene using `this.scene.events.on('update', listener)`.
 * 
 * A Scene will only run its step if it is active.
 * 
 * @event Phaser.Scenes.Events#UPDATE
 * @since 3.0.0
 * 
 * @param {Phaser.Scenes.Systems} sys - A reference to the Scene Systems class of the Scene that emitted this event.
 * @param {number} time - The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
 * @param {number} delta - The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
 */
module.exports = 'update';


/***/ }),
/* 277 */
/***/ (function(module, exports) {

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Scene Systems Wake Event.
 * 
 * This event is dispatched by a Scene when it is woken from sleep, either directly via the `wake` method,
 * or as an action from another Scene.
 * 
 * Listen to it from a Scene using `this.scene.events.on('wake', listener)`.
 * 
 * @event Phaser.Scenes.Events#WAKE
 * @since 3.0.0
 * 
 * @param {Phaser.Scenes.Systems} sys - A reference to the Scene Systems class of the Scene that emitted this event.
 * @param {any} [data] - An optional data object that was passed to this Scene when it was woken up.
 */
module.exports = 'wake';


/***/ })
/******/ ]);