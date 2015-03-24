/* global Phaser:true */
/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2015 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* @namespace Phaser
*/
var Phaser = Phaser || {

	VERSION: '2.3.0-RC1',
	GAMES: [],

    AUTO: 0,
    CANVAS: 1,
    WEBGL: 2,
    HEADLESS: 3,

    NONE: 0,
    LEFT: 1,
    RIGHT: 2,
    UP: 3,
    DOWN: 4,

    SPRITE: 0,
    BUTTON: 1,
    IMAGE: 2,
    GRAPHICS: 3,
    TEXT: 4,
    TILESPRITE: 5,
    BITMAPTEXT: 6,
    GROUP: 7,
    RENDERTEXTURE: 8,
    TILEMAP: 9,
    TILEMAPLAYER: 10,
    EMITTER: 11,
    POLYGON: 12,
    BITMAPDATA: 13,
    CANVAS_FILTER: 14,
    WEBGL_FILTER: 15,
    ELLIPSE: 16,
    SPRITEBATCH: 17,
    RETROFONT: 18,
    POINTER: 19,
    ROPE: 20,
    CIRCLE: 21,
    RECTANGLE: 22,
    LINE: 23,
    MATRIX: 24,
    POINT: 25,
    ROUNDEDRECTANGLE: 26,

    /**
     * Various blend modes supported by pixi. IMPORTANT - The WebGL renderer only supports the NORMAL, ADD, MULTIPLY and SCREEN blend modes.
     * 
     * @property {Object} blendModes
     * @property {Number} blendModes.NORMAL
     * @property {Number} blendModes.ADD
     * @property {Number} blendModes.MULTIPLY
     * @property {Number} blendModes.SCREEN
     * @property {Number} blendModes.OVERLAY
     * @property {Number} blendModes.DARKEN
     * @property {Number} blendModes.LIGHTEN
     * @property {Number} blendModes.COLOR_DODGE
     * @property {Number} blendModes.COLOR_BURN
     * @property {Number} blendModes.HARD_LIGHT
     * @property {Number} blendModes.SOFT_LIGHT
     * @property {Number} blendModes.DIFFERENCE
     * @property {Number} blendModes.EXCLUSION
     * @property {Number} blendModes.HUE
     * @property {Number} blendModes.SATURATION
     * @property {Number} blendModes.COLOR
     * @property {Number} blendModes.LUMINOSITY
     * @static
     */
    blendModes: {
        NORMAL:0,
        ADD:1,
        MULTIPLY:2,
        SCREEN:3,
        OVERLAY:4,
        DARKEN:5,
        LIGHTEN:6,
        COLOR_DODGE:7,
        COLOR_BURN:8,
        HARD_LIGHT:9,
        SOFT_LIGHT:10,
        DIFFERENCE:11,
        EXCLUSION:12,
        HUE:13,
        SATURATION:14,
        COLOR:15,
        LUMINOSITY:16
    },

    /**
     * The scale modes that are supported by pixi.
     *
     * The DEFAULT scale mode affects the default scaling mode of future operations.
     * It can be re-assigned to either LINEAR or NEAREST, depending upon suitability.
     *
     * @property {Object} scaleModes
     * @property {Number} scaleModes.DEFAULT=LINEAR
     * @property {Number} scaleModes.LINEAR Smooth scaling
     * @property {Number} scaleModes.NEAREST Pixelating scaling
     * @static
     */
    scaleModes: {
        DEFAULT:0,
        LINEAR:0,
        NEAREST:1
    }

};
