/**
 * @module Phaser
 */
var Phaser = Phaser || { 

	VERSION: '1.0.0', 
	GAMES: [], 
	AUTO: 0,
	CANVAS: 1,
	WEBGL: 2

 };

PIXI.InteractionManager = function (dummy) {
	//	We don't need this in Pixi, so we've removed it to save space
	//	however the Stage object expects a reference to it, so here is a dummy entry.
};