Phaser.InputHandler = function (sprite) {

    this.game = sprite.game;
	this.sprite = sprite;

    this.enabled = false;

    //	Linked list references
	this.last = this;
	this.first = this;

    /**
    * The PriorityID controls which Sprite receives an Input event first if they should overlap.
    */
    this.priorityID = 0;
	
    this.isDragged = false;
    this.dragPixelPerfect = false;
    this.allowHorizontalDrag = true;
    this.allowVerticalDrag = true;
    this.bringToTop = false;
    this.snapOnDrag = false;
    this.snapOnRelease = false;
    this.snapX = 0;
    this.snapY = 0;

    /**
    * Is this sprite allowed to be dragged by the mouse? true = yes, false = no
    * @default false
    */
    this.draggable = false;

    /**
    * A region of the game world within which the sprite is restricted during drag
    * @default null
    */
    this.boundsRect = null;

    /**
    * An Sprite the bounds of which this sprite is restricted during drag
    * @default null
    */
    this.boundsSprite = null;

    /**
    * If this object is set to consume the pointer event then it will stop all propogation from this object on.
    * For example if you had a stack of 6 sprites with the same priority IDs and one consumed the event, none of the others would receive it.
    * @type {bool}
    */
    this.consumePointerEvent = false;

};

Phaser.InputHandler.prototype = {

	game: null,
	sprite: null,

	//	Linked list references
	parent: null,
	_iNext: null,
	_iPrev: null,
	first: null,
	last: null,

	enable: function () {
	},

};