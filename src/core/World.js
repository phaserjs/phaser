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

	swapChildren: function (stage, node1, node2) {

		if (node1 === node2 || !node1.parent || !node2.parent)
		{
			console.warn('You cannot swap a node with itself or swap un-parented nodes');
			return;
		}

		//	Cache the node values
		var node1Prev = node1._iPrev;
		var node1Next = node1._iNext;
		var node2Prev = node2._iPrev;
		var node2Next = node2._iNext;

		var endNode = stage.last._iNext;
		var currentNode = stage.first;
			
		do	
		{
			if (currentNode !== node1 && currentNode !== node2)
			{
				if (currentNode.first === node1)
				{
					currentNode.first = node2;
				}
				else if (currentNode.first === node2)
				{
					currentNode.first = node1;
				}

				if (currentNode.last === node1)
				{
					currentNode.last = node2;
				}
				else if (currentNode.last === node2)
				{
					currentNode.last = node1;
				}
			}

			currentNode = currentNode._iNext;
		}
		while (currentNode != endNode)

		if (node1._iNext == node2)
		{
			//	This is an A-B neighbour swap
			node1._iNext = node2Next;
			node1._iPrev = node2;
			node2._iNext = node1;
			node2._iPrev = node1Prev;

			if (node1Prev) { node1Prev._iNext = node2; }
			if (node2Next) { node2Next._iPrev = node1; }
		}
		else if (node2._iNext == node1)
		{
			//	This is a B-A neighbour swap
			node1._iNext = node2;
			node1._iPrev = node2Prev;
			node2._iNext = node1Next;
			node2._iPrev = node1;

			if (node2Prev) { node2Prev._iNext = node1; }
			if (node1Next) { node2Next._iPrev = node2; }
		}
		else
		{
			//	Nodes are far apart
			node1._iNext = node2Next;
			node1._iPrev = node2Prev;
			node2._iNext = node1Next;
			node2._iPrev = node1Prev;

			if (node1Prev) { node1Prev._iNext = node2; }
			if (node1Next) { node1Next._iPrev = node2; }
			if (node2Prev) { node2Prev._iNext = node1; }
			if (node2Next) { node2Next._iPrev = node1; }
		}
	}

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
