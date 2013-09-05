Phaser.World = function (game) {

	this.game = game;

	this._stage = new PIXI.Stage(0x000000);

	this._container = new PIXI.DisplayObjectContainer();
	this._container.name = 'R';

	this._stage.addChild(this._container);

	this.bounds = new Phaser.Rectangle(0, 0, game.width, game.height);
	
};

Phaser.World.prototype = {

	_stage: null,
	_container: null,
	_length: 0,

	bounds: null,
	camera: null,

	boot: function () {

		this.camera = new Phaser.Camera(this.game, 0, 0, 0, this.game.width, this.game.height);
		this.game.camera = this.camera;

	},

	add: function (gameobject) {
		this._container.addChild(gameobject);
		return gameobject;
	},

	addAt: function (gameobject, index) {
		this._container.addChildAt(gameobject, index);
		return gameobject;
	},

	getAt: function (index) {
		return this._container.getChildAt(index);
	},

	remove: function (gameobject) {
		this._container.removeChild(gameobject);
		return gameobject;
	},

	update: function () {

		this.camera.update();

		var displayObject = this._stage;

		var testObject = displayObject.last._iNext;
		displayObject = displayObject.first;
		
		do	
		{
			if (displayObject['update'])
			{
				displayObject.update();
			}
			
			//	count++
			displayObject = displayObject._iNext;
		}
		while(displayObject != testObject)

	},

	postUpdate: function () {

		var displayObject = this._stage;

		var testObject = displayObject.last._iNext;
		displayObject = displayObject.first;
		
		do	
		{
			if (displayObject['postUpdate'])
			{
				displayObject.postUpdate();
			}
			
			//	count++
			displayObject = displayObject._iNext;
		}
		while(displayObject != testObject)

	},

	/**
	* Updates the size of this world.
	*
	* @param width {number} New width of the world.
	* @param height {number} New height of the world.
	*/
	setSize: function (width, height) {

		this.bounds.width = width;
		this.bounds.height = height;

	},

};

//	Getters / Setters

Object.defineProperty(Phaser.World.prototype, "width", {

    get: function () {
        return this.bounds.width;
    },

    set: function (value) {
        this.bounds.width = value;
    },

    enumerable: true,
    configurable: true
});

Object.defineProperty(Phaser.World.prototype, "height", {

    get: function () {
        return this.bounds.height;
    },

    set: function (value) {
        this.bounds.height = value;
    },

    enumerable: true,
    configurable: true
});

Object.defineProperty(Phaser.World.prototype, "centerX", {

    get: function () {
        return this.bounds.halfWidth;
    },

    enumerable: true,
    configurable: true
});

Object.defineProperty(Phaser.World.prototype, "centerY", {

    get: function () {
        return this.bounds.halfHeight;
    },

    enumerable: true,
    configurable: true
});

Object.defineProperty(Phaser.World.prototype, "randomX", {

    get: function () {
        return Math.round(Math.random() * this.bounds.width);
    },

    enumerable: true,
    configurable: true
});

Object.defineProperty(Phaser.World.prototype, "randomY", {

    get: function () {
        return Math.round(Math.random() * this.bounds.height);
    },

    enumerable: true,
    configurable: true
});
