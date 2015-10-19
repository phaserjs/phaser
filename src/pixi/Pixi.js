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

/**
 * A reference to the Phaser Game instance that owns this Pixi renderer.
 * @property {Phaser.Game} game
 * @static 
 */
PIXI.game = null;

/**
 * @property {Number} WEBGL_RENDERER
 * @protected
 * @static 
 */
PIXI.WEBGL_RENDERER = 0;

/**
 * @property {Number} CANVAS_RENDERER
 * @protected
 * @static
 */
PIXI.CANVAS_RENDERER = 1;

/**
 * Version of pixi that is loaded.
 * @property {String} VERSION
 * @static 
 */
PIXI.VERSION = "v2.2.9";

// used to create uids for various pixi objects.
PIXI._UID = 0;

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

/**
 * @property {Number} PI_2
 * @static
 */
PIXI.PI_2 = Math.PI * 2;

/**
 * @property {Number} RAD_TO_DEG
 * @static
 */
PIXI.RAD_TO_DEG = 180 / Math.PI;

/**
 * @property {Number} DEG_TO_RAD
 * @static
 */
PIXI.DEG_TO_RAD = Math.PI / 180;

/**
 * @property {String} RETINA_PREFIX
 * @protected
 * @static
 */
PIXI.RETINA_PREFIX = "@2x";

/**
 * The default render options if none are supplied to
 * {{#crossLink "WebGLRenderer"}}{{/crossLink}} or {{#crossLink "CanvasRenderer"}}{{/crossLink}}.
 *
 * @property {Object} defaultRenderOptions
 * @property {Object} defaultRenderOptions.view=null
 * @property {Boolean} defaultRenderOptions.transparent=false
 * @property {Boolean} defaultRenderOptions.antialias=false
 * @property {Boolean} defaultRenderOptions.preserveDrawingBuffer=false
 * @property {Number} defaultRenderOptions.resolution=1
 * @property {Boolean} defaultRenderOptions.clearBeforeRender=true
 * @property {Boolean} defaultRenderOptions.autoResize=false
 * @static
PIXI.defaultRenderOptions = {
    view: null,
    transparent: false,
    antialias: false, 
    preserveDrawingBuffer: false,
    resolution: 1,
    clearBeforeRender: true,
    autoResize: false
};
 */
