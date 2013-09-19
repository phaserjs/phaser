/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
* @module       Phaser.World
*/

/**
 *
 * "This world is but a canvas to our imagination." - Henry David Thoreau
 *
 * A game has only one world. The world is an abstract place in which all game objects live. It is not bound
 * by stage limits and can be any size. You look into the world via cameras. All game objects live within
 * the world at world-based coordinates. By default a world is created the same size as your Stage.
 *
 * @class World
 * @constructor
 * @param {Phaser.Game} game Reference to the current game instance.
 */
Phaser.World = function (game) {

    /**
    * A reference to the currently running Game.
    * @property game
    * @public
    * @type {Phaser.Game}
    */
	this.game = game;

    /**
    * Bound of this world that objects can not escape from.
    * @property bounds
    * @public
    * @type {Phaser.Rectangle}
    */
	this.bounds = new Phaser.Rectangle(0, 0, game.width, game.height);

    /**
    * Camera instance.
    * @property camera
    * @public
    * @type {Phaser.Camera}
    */
	this.camera = null;

    /**
    * Reset each frame, keeps a count of the total number of objects updated.
    * @property currentRenderOrderID
    * @public
    * @type {Number}
    */
	this.currentRenderOrderID = 0;

    /**
    * Object container stores every object created with `create*` methods.
    * @property group
    * @public
    * @type {Phaser.Group}
    */
    this.group = null;
	
};

Phaser.World.prototype = {


    /**
    * Initialises the game world
    *
    * @method boot
    */
	boot: function () {

		this.camera = new Phaser.Camera(this.game, 0, 0, 0, this.game.width, this.game.height);

		this.game.camera = this.camera;

		this.group = new Phaser.Group(this.game, null, '__world', true);

	},

    /**
    * This is called automatically every frame, and is where main logic happens.
    * @method update
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
	* @method setSize
	* @param {number} width New width of the world.
	* @param {number} height New height of the world.
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

	},

    /**
    * Destroyer of worlds.
    * @method destroy
    */
    destroy: function () {

        this.camera.x = 0;
        this.camera.y = 0;

        this.game.input.reset(true);

        this.group.removeAll();

    }
	
};

//	Getters / Setters

Object.defineProperty(Phaser.World.prototype, "width", {

    /**
    * @method width
    * @return {Number} The current width of the game world
    */
    get: function () {
        return this.bounds.width;
    },

    /**
    * @method width
    * @return {Number} Sets the width of the game world
    */
    set: function (value) {
        this.bounds.width = value;
    }

});

Object.defineProperty(Phaser.World.prototype, "height", {

    /**
    * @method height
    * @return {Number} The current height of the game world
    */
    get: function () {
        return this.bounds.height;
    },

    /**
    * @method height
    * @return {Number} Sets the width of the game world
    */
    set: function (value) {
        this.bounds.height = value;
    }

});

Object.defineProperty(Phaser.World.prototype, "centerX", {

    /**
    * @method centerX
    * @return {Number} return the X position of the center point of the world
    */
    get: function () {
        return this.bounds.halfWidth;
    }

});

Object.defineProperty(Phaser.World.prototype, "centerY", {

     /**
    * @method centerY
    * @return {Number} return the Y position of the center point of the world
    */
    get: function () {
        return this.bounds.halfHeight;
    }

});

Object.defineProperty(Phaser.World.prototype, "randomX", {

    /**
    * @method randomX
    * @return {Number} a random integer which is lesser or equal to the current width of the game world
    */
    get: function () {
        return Math.round(Math.random() * this.bounds.width);
    }

});

Object.defineProperty(Phaser.World.prototype, "randomY", {

    /**
    * @method randomY
    * @return {Number} a random integer which is lesser or equal to the current height of the game world
    */
    get: function () {
        return Math.round(Math.random() * this.bounds.height);
    }

});
