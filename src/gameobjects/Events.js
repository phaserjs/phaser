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