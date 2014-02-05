/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* @namespace Phaser
*/
var Phaser = Phaser || {

	VERSION: '<%= version %>',
	DEV_VERSION: '1.1.4',
	GAMES: [],

	AUTO: 0,
	CANVAS: 1,
	WEBGL: 2,
	HEADLESS: 3,

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
	POLYGON: 12,
	BITMAPDATA: 13,
	CANVAS_FILTER: 14,
	WEBGL_FILTER: 15,

	NONE: 0,
	LEFT: 1,
	RIGHT: 2,
	UP: 3,
	DOWN: 4,

	CANVAS_PX_ROUND: false,
	CANVAS_CLEAR_RECT: true

 };

PIXI.InteractionManager = function (dummy) {
	//	We don't need this in Pixi, so we've removed it to save space
	//	however the Stage object expects a reference to it, so here is a dummy entry.
};
