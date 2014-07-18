/* global Phaser:true */
/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* @namespace Phaser
*/
var Phaser = Phaser || {

	VERSION: '2.0.7',
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

    // The various blend modes supported by pixi / phaser
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

    // The scale modes
    scaleModes: {
        DEFAULT:0,
        LINEAR:0,
        NEAREST:1
    }

};

// We don't need this in Pixi, so we've removed it to save space
// however the Stage object expects a reference to it, so here is a dummy entry.
// Ensure that an existing PIXI.InteractionManager is not overriden - in case you're using your own PIXI library.
PIXI.InteractionManager = PIXI.InteractionManager || function () {};

//  Equally we're going to supress the Pixi console log, with their agreement.
PIXI.dontSayHello = true;