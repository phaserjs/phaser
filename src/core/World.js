/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
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
* @extends Phaser.Group
* @constructor
* @param {Phaser.Game} game - Reference to the current game instance.
*/
Phaser.World = function (game) {

    Phaser.Group.call(this, game, null, '__world', false);

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

    this.camera.displayObject = this;

    this.game.camera = this.camera;

    this.game.stage._stage.addChild(this);

}

/**
* This is called automatically after the plugins preUpdate and before the State.update.
* Most objects have preUpdate methods and it's where initial movement, drawing and calculations are done.
* 
* @method Phaser.World#preUpdate
*/
Phaser.World.prototype.preUpdate = function () {
    
    for (var i = 0, len = this.children.length; i < len; i++)
    {
        if (this.children[i]['preUpdate'])
        {
            this.children[i].preUpdate();
        }
    }

}

/**
* This is called automatically after the State.update, but before particles or plugins update.
* Most objects won't have an update method set unless explicitly given one.
* 
* @method Phaser.World#update
*/
Phaser.World.prototype.update = function () {

    for (var i = 0, len = this.children.length; i < len; i++)
    {
        if (this.children[i]['update'])
        {
            this.children[i].update();
        }
    }

}

/**
* This is called automatically before the renderer runs and after the plugins have updated.
* In postUpdate this is where all the final physics calculatations and object positioning happens.
* The objects are processed in the order of the display list.
* The only exception to this is if the camera is following an object, in which case that is updated first.
* 
* @method Phaser.World#postUpdate
*/
Phaser.World.prototype.postUpdate = function () {

    if (this.camera.target && this.camera.target['postUpdate'])
    {
        this.camera.target.postUpdate();

        this.camera.update();

        for (var i = 0, len = this.children.length; i < len; i++)
        {
            if (this.children[i]['postUpdate'])
            {
                this.children[i].postUpdate();
            }
        }
    }
    else
    {
        this.camera.update();

        for (var i = 0, len = this.children.length; i < len; i++)
        {
            if (this.children[i]['postUpdate'])
            {
                this.children[i].postUpdate();
            }
        }
    }

}

/**
* Updates the size of this world. Note that this doesn't modify the world x/y coordinates, just the width and height.
*
* @method Phaser.World#setBounds
* @param {number} x - Top left most corner of the world.
* @param {number} y - Top left most corner of the world.
* @param {number} width - New width of the world. Can never be smaller than the Game.width.
* @param {number} height - New height of the world. Can never be smaller than the Game.height.
*/
Phaser.World.prototype.setBounds = function (x, y, width, height) {

    if (width < this.game.width)
    {
        width = this.game.width;
    }

    if (height < this.game.height)
    {
        height = this.game.height;
    }

    this.bounds.setTo(x, y, width, height);

    if (this.camera.bounds)
    {
        //  The Camera can never be smaller than the game size
        this.camera.bounds.setTo(x, y, width, height);
    }

    this.game.physics.setBoundsToWorld();

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

