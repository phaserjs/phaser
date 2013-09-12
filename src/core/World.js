/**
 * World
 *
 * "This world is but a canvas to our imagination." - Henry David Thoreau
 *
 * A game has only one world. The world is an abstract place in which all game objects live. It is not bound
 * by stage limits and can be any size. You look into the world via cameras. All game objects live within
 * the world at world-based coordinates. By default a world is created the same size as your Stage.
 *
 * @package    Phaser.World
 * @author     Richard Davey <rich@photonstorm.com>
 * @copyright  2013 Photon Storm Ltd.
 * @license    https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
 */
Phaser.World = function (game) {

    /**
     * Local reference to Game.
     */
	this.game = game;

    /**
     * Bound of this world that objects can not escape from.
     * @type {Rectangle}
     */
	this.bounds = new Phaser.Rectangle(0, 0, game.width, game.height);

    /**
     * Camera instance.
     * @type {Camera}
     */
	this.camera = null;

    /**
     * Reset each frame, keeps a count of the total number of objects updated.
     * @type {Number}
     */
	this.currentRenderOrderID = 0;

    /**
     * Object container stores every object created with `create*` methods.
     * @type {Group}
     */
    this.group = null;
	
};

Phaser.World.prototype = {

	boot: function () {

		this.camera = new Phaser.Camera(this.game, 0, 0, 0, this.game.width, this.game.height);

		this.game.camera = this.camera;

		this.group = new Phaser.Group(this.game, null, '__world', true);

	},

    /**
     * This is called automatically every frame, and is where main logic happens.
     */
	update: function () {

		this.camera.update();

		this.currentRenderOrderID = 0;

		if (this.game.stage._stage.first._iNext)
		{
			var currentNode = this.game.stage._stage.first._iNext;
			
			do	
			{
				if (currentNode['preUpdate'])
				{
					currentNode.preUpdate();
				}

				if (currentNode['update'])
				{
					currentNode.update();
				}
				
				currentNode = currentNode._iNext;
			}
			while (currentNode != this.game.stage._stage.last._iNext)
		}

	},

	/**
	* Updates the size of this world.
	*
	* @param width {number} New width of the world.
	* @param height {number} New height of the world.
	*/
	setSize: function (width, height) {

		if (width >= this.game.width)
        {
            this.bounds.width = width;
        }

        if (height >= this.game.height)
        {
            this.bounds.height = height;
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
    }

});

Object.defineProperty(Phaser.World.prototype, "height", {

    get: function () {
        return this.bounds.height;
    },

    set: function (value) {
        this.bounds.height = value;
    }

});

Object.defineProperty(Phaser.World.prototype, "centerX", {

    get: function () {
        return this.bounds.halfWidth;
    }

});

Object.defineProperty(Phaser.World.prototype, "centerY", {

    get: function () {
        return this.bounds.halfHeight;
    }

});

Object.defineProperty(Phaser.World.prototype, "randomX", {

    get: function () {
        return Math.round(Math.random() * this.bounds.width);
    }

});

Object.defineProperty(Phaser.World.prototype, "randomY", {

    get: function () {
        return Math.round(Math.random() * this.bounds.height);
    }

});
