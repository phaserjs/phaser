Phaser.World = function (game) {

	this.game = game;

	this._stage = new PIXI.Stage(0x000000);

	this._container = new PIXI.DisplayObjectContainer();

	this._stage.addChild(this._container);

	this.bounds = new Phaser.Rectangle(0, 0, game.width, game.height);
	
};

Phaser.World.prototype = {

	_stage: null,
	_container: null,
	_length: 0,

	bounds: null,

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

		for (var child in this._container.children)
		{
			this._container.children[child].update();
		}

	},

	/**
	* Updates the size of this world.
	*
	* @param width {number} New width of the world.
	* @param height {number} New height of the world.
	* @param [updateCameraBounds] {bool} Update camera bounds automatically or not. Default to true.
	*/
	setSize: function (width, height, updateCameraBounds) {

		if (typeof updateCameraBounds === "undefined") { updateCameraBounds = true; }

		this.bounds.width = width;
		this.bounds.height = height;

		if (updateCameraBounds == true)
		{
			// this.game.camera.setBounds(0, 0, width, height);
		}

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
