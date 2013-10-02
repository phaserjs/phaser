/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
* @module       Phaser.Events
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