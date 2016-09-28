/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * The [pixi.js](http://www.pixijs.com/) module/namespace.
 *
 * @module PIXI
 */
 
/**
 * Namespace-class for [pixi.js](http://www.pixijs.com/).
 *
 * Contains assorted static properties and enumerations.
 *
 * @class PIXI
 * @static
 */
var PIXI = PIXI || {};

if (typeof(Float32Array) != 'undefined')
{
    PIXI.Float32Array = Float32Array;
    PIXI.Uint16Array = Uint16Array;

    // Uint32Array and ArrayBuffer only used by WebGL renderer
    // We can suppose that if WebGL is supported then typed arrays are supported too
    // as they predate WebGL support for all browsers:
    // see typed arrays support: http://caniuse.com/#search=TypedArrays
    // see WebGL support: http://caniuse.com/#search=WebGL
    PIXI.Uint32Array = Uint32Array;
    PIXI.ArrayBuffer = ArrayBuffer;
}
else
{
    PIXI.Float32Array = Array;
    PIXI.Uint16Array = Array;
}
