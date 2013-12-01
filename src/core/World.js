/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* "This world is but a canvas to our imagination." - Henry David Thoreau
*
* A game has only one world. The world is an abstract place in which all game objects live. It is not bound
* by stage limits and can be any size. You look into the world via cameras. All game objects live within
* the world at world-based coordinates. By default a world is created the same size as your Stage.
*
* @class Phaser.World
* @constructor
* @param {Phaser.Game} game - Reference to the current game instance.
*/
Phaser.World = function (game) {

    Phaser.Group.call(this, game, null, '__world', false);

    /**
    * @property {Phaser.Point} scale - Replaces the PIXI.Point with a slightly more flexible one.
    */
    this.scale = new Phaser.Point(1, 1);

    /**
    * The World has no fixed size, but it does have a bounds outside of which objects are no longer considered as being "in world" and you should use this to clean-up the display list and purge dead objects.
    * By default we set the Bounds to be from 0,0 to Game.width,Game.height. I.e. it will match the size given to the game constructor with 0,0 representing the top-left of the display.
    * However 0,0 is actually the center of the world, and if you rotate or scale the world all of that will happen from 0,0.
    * So if you want to make a game in which the world itself will rotate you should adjust the bounds so that 0,0 is the center point, i.e. set them to -1000,-1000,2000,2000 for a 2000x2000 sized world centered around 0,0.
    * @property {Phaser.Rectangle} bounds - Bound of this world that objects can not escape from.
    */
    this.bounds = new Phaser.Rectangle(0, 0, game.width, game.height);

    /**
    * @property {Phaser.Camera} camera - Camera instance.
    */
    this.camera = null;

    /**
    * @property {number} currentRenderOrderID - Reset each frame, keeps a count of the total number of objects updated.
    */
    this.currentRenderOrderID = 0;
    
};

Phaser.World.prototype = Object.create(Phaser.Group.prototype);
Phaser.World.prototype.constructor = Phaser.World;

/**
* Initialises the game world.
*
* @method Phaser.World#boot
* @protected
*/
Phaser.World.prototype.boot = function () {

    this.camera = new Phaser.Camera(this.game, 0, 0, 0, this.game.width, this.game.height);

    this.camera.displayObject = this._container;

    this.game.camera = this.camera;

}

/**
* This is called automatically every frame, and is where main logic happens.
* 
* @method Phaser.World#update
*/
Phaser.World.prototype.update = function () {

    this.currentRenderOrderID = 0;
    
    if (this.game.stage._stage.first._iNext)
    {
        var currentNode = this.game.stage._stage.first._iNext;
        var skipChildren;
        
        do
        {
            skipChildren = false;

            if (currentNode['preUpdate'])
            {
                skipChildren = (currentNode.preUpdate() === false);
            }

            if (currentNode['update'])
            {
                skipChildren = (currentNode.update() === false) || skipChildren;
            }
            
            if (skipChildren)
            {
                currentNode = currentNode.last._iNext;
            }
            else
            {
                currentNode = currentNode._iNext;
            }
            
        }
        while (currentNode != this.game.stage._stage.last._iNext)
    }

}

/**
* This is called automatically every frame, and is where main logic happens.
* @method Phaser.World#postUpdate
*/
Phaser.World.prototype.postUpdate = function () {

    this.camera.update();

    if (this.game.stage._stage.first._iNext)
    {
        var currentNode = this.game.stage._stage.first._iNext;
        
        do
        {
            if (currentNode['postUpdate'])
            {
                currentNode.postUpdate();
            }
            
            currentNode = currentNode._iNext;
        }
        while (currentNode != this.game.stage._stage.last._iNext)
    }
}

/**
* Updates the size of this world. Note that this doesn't modify the world x/y coordinates, just the width and height.
* If you need to adjust the bounds of the world
* @method Phaser.World#setBounds
* @param {number} x - Top left most corner of the world.
* @param {number} y - Top left most corner of the world.
* @param {number} width - New width of the world.
* @param {number} height - New height of the world.
*/
Phaser.World.prototype.setBounds = function (x, y, width, height) {

    this.bounds.setTo(x, y, width, height);

    if (this.camera.bounds)
    {
        this.camera.bounds.setTo(x, y, width, height);
    }

}

/**
* Destroyer of worlds.
* @method Phaser.World#destroy
*/
Phaser.World.prototype.destroy = function () {

    this.camera.x = 0;
    this.camera.y = 0;

    this.game.input.reset(true);

    this.removeAll();

}

/**
* @name Phaser.World#width
* @property {number} width - Gets or sets the current width of the game world.
*/
Object.defineProperty(Phaser.World.prototype, "width", {

    get: function () {
        return this.bounds.width;
    },

    set: function (value) {
        this.bounds.width = value;
    }

});

/**
* @name Phaser.World#height
* @property {number} height - Gets or sets the current height of the game world.
*/
Object.defineProperty(Phaser.World.prototype, "height", {

    get: function () {
        return this.bounds.height;
    },

    set: function (value) {
        this.bounds.height = value;
    }

});

/**
* @name Phaser.World#centerX
* @property {number} centerX - Gets the X position corresponding to the center point of the world.
* @readonly
*/
Object.defineProperty(Phaser.World.prototype, "centerX", {

    get: function () {
        return this.bounds.halfWidth;
    }

});

/**
* @name Phaser.World#centerY
* @property {number} centerY - Gets the Y position corresponding to the center point of the world.
* @readonly
*/
Object.defineProperty(Phaser.World.prototype, "centerY", {

    get: function () {
        return this.bounds.halfHeight;
    }

});

/**
* @name Phaser.World#randomX
* @property {number} randomX - Gets a random integer which is lesser than or equal to the current width of the game world.
* @readonly
*/
Object.defineProperty(Phaser.World.prototype, "randomX", {

    get: function () {

        if (this.bounds.x < 0)
        {
            return this.game.rnd.integerInRange(this.bounds.x, (this.bounds.width - Math.abs(this.bounds.x)));
        }
        else
        {
            return this.game.rnd.integerInRange(this.bounds.x, this.bounds.width);
        }

    }

});

/**
* @name Phaser.World#randomY
* @property {number} randomY - Gets a random integer which is lesser than or equal to the current height of the game world.
* @readonly
*/
Object.defineProperty(Phaser.World.prototype, "randomY", {

    get: function () {

        if (this.bounds.y < 0)
        {
            return this.game.rnd.integerInRange(this.bounds.y, (this.bounds.height - Math.abs(this.bounds.y)));
        }
        else
        {
            return this.game.rnd.integerInRange(this.bounds.y, this.bounds.height);
        }

    }

});

/**
* @name Phaser.World#visible
* @property {boolean} visible - Gets or sets the visible state of the World.
*/
Object.defineProperty(Phaser.World.prototype, "visible", {

    get: function () {
        return this._container.visible;
    },

    set: function (value) {
        this._container.visible = value;
    }

});
