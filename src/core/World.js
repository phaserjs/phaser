/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
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
    * @property {boolean} _definedSize - True if the World has been given a specifically defined size (i.e. from a Tilemap or direct in code) or false if it's just matched to the Game dimensions.
    * @readonly
    */
    this._definedSize = false;

    /**
    * @property {number} width - The defined width of the World. Sometimes the bounds needs to grow larger than this (if you resize the game) but this retains the original requested dimension.
    */
    this._width = game.width;

    /**
    * @property {number} height - The defined height of the World. Sometimes the bounds needs to grow larger than this (if you resize the game) but this retains the original requested dimension.
    */
    this._height = game.height;

    this.game.state.onStateChange.add(this.stateChange, this);

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

    this.game.stage.addChild(this);

    this.camera.boot();

};

/**
* Called whenever the State changes or resets.
* 
* It resets the world.x and world.y coordinates back to zero,
* then resets the Camera.
*
* @method Phaser.World#stateChange
* @protected
*/
Phaser.World.prototype.stateChange = function () {

    this.x = 0;
    this.y = 0;

    this.camera.reset();

};

/**
* Updates the size of this world and sets World.x/y to the given values
* The Camera bounds and Physics bounds (if set) are also updated to match the new World bounds.
*
* @method Phaser.World#setBounds
* @param {number} x - Top left most corner of the world.
* @param {number} y - Top left most corner of the world.
* @param {number} width - New width of the game world in pixels.
* @param {number} height - New height of the game world in pixels.
*/
Phaser.World.prototype.setBounds = function (x, y, width, height) {

    this._definedSize = true;
    this._width = width;
    this._height = height;

    this.bounds.setTo(x, y, width, height);

    this.x = x;
    this.y = y;

    if (this.camera.bounds)
    {
        //  The Camera can never be smaller than the game size
        this.camera.bounds.setTo(x, y, Math.max(width, this.game.width), Math.max(height, this.game.height));
    }

    this.game.physics.setBoundsToWorld();

};

/**
* Updates the size of this world. Note that this doesn't modify the world x/y coordinates, just the width and height.
*
* @method Phaser.World#resize
* @param {number} width - New width of the game world in pixels.
* @param {number} height - New height of the game world in pixels.
*/
Phaser.World.prototype.resize = function (width, height) {

    //  Don't ever scale the World bounds lower than the original requested dimensions if it's a defined world size

    if (this._definedSize)
    {
        if (width < this._width)
        {
            width = this._width;
        }

        if (height < this._height)
        {
            height = this._height;
        }
    }

    this.bounds.width = width;
    this.bounds.height = height;

    this.game.camera.setBoundsToWorld();

    this.game.physics.setBoundsToWorld();

};

/**
* Destroyer of worlds.
*
* @method Phaser.World#shutdown
*/
Phaser.World.prototype.shutdown = function () {

    //  World is a Group, so run a soft destruction on this and all children.
    this.destroy(true, true);

};

/**
* This will take the given game object and check if its x/y coordinates fall outside of the world bounds.
* If they do it will reposition the object to the opposite side of the world, creating a wrap-around effect.
* If sprite has a P2 body then the body (sprite.body) should be passed as first parameter to the function.
*
* Please understand there are limitations to this method. For example if you have scaled the World
* then objects won't always be re-positioned correctly, and you'll need to employ your own wrapping function.
*
* @method Phaser.World#wrap
* @param {Phaser.Sprite|Phaser.Image|Phaser.TileSprite|Phaser.Text} sprite - The object you wish to wrap around the world bounds.
* @param {number} [padding=0] - Extra padding added equally to the sprite.x and y coordinates before checking if within the world bounds. Ignored if useBounds is true.
* @param {boolean} [useBounds=false] - If useBounds is false wrap checks the object.x/y coordinates. If true it does a more accurate bounds check, which is more expensive.
* @param {boolean} [horizontal=true] - If horizontal is false, wrap will not wrap the object.x coordinates horizontally.
* @param {boolean} [vertical=true] - If vertical is false, wrap will not wrap the object.y coordinates vertically.
*/
Phaser.World.prototype.wrap = function (sprite, padding, useBounds, horizontal, vertical) {

    if (padding === undefined) { padding = 0; }
    if (useBounds === undefined) { useBounds = false; }
    if (horizontal === undefined) { horizontal = true; }
    if (vertical === undefined) { vertical = true; }

    if (!useBounds)
    {
        if (horizontal && sprite.x + padding < this.bounds.x)
        {
            sprite.x = this.bounds.right + padding;
        }
        else if (horizontal && sprite.x - padding > this.bounds.right)
        {
            sprite.x = this.bounds.left - padding;
        }

        if (vertical && sprite.y + padding < this.bounds.top)
        {
            sprite.y = this.bounds.bottom + padding;
        }
        else if (vertical && sprite.y - padding > this.bounds.bottom)
        {
            sprite.y = this.bounds.top - padding;
        }
    }
    else
    {
        sprite.getBounds();

        if (horizontal)
        {
            if ((sprite.x + sprite._currentBounds.width) < this.bounds.x)
            {
                sprite.x = this.bounds.right;
            }
            else if (sprite.x > this.bounds.right)
            {
                sprite.x = this.bounds.left;
            }
        }

        if (vertical)
        {
            if ((sprite.y + sprite._currentBounds.height) < this.bounds.top)
            {
                sprite.y = this.bounds.bottom;
            }
            else if (sprite.y > this.bounds.bottom)
            {
                sprite.y = this.bounds.top;
            }
        }
    }

};

/**
* @name Phaser.World#width
* @property {number} width - Gets or sets the current width of the game world. The world can never be smaller than the game (canvas) dimensions.
*/
Object.defineProperty(Phaser.World.prototype, "width", {

    get: function () {
        return this.bounds.width;
    },

    set: function (value) {

        if (value < this.game.width)
        {
            value = this.game.width;
        }

        this.bounds.width = value;
        this._width = value;
        this._definedSize = true;

    }

});

/**
* @name Phaser.World#height
* @property {number} height - Gets or sets the current height of the game world. The world can never be smaller than the game (canvas) dimensions.
*/
Object.defineProperty(Phaser.World.prototype, "height", {

    get: function () {
        return this.bounds.height;
    },

    set: function (value) {

        if (value < this.game.height)
        {
            value = this.game.height;
        }

        this.bounds.height = value;
        this._height = value;
        this._definedSize = true;

    }

});

/**
* @name Phaser.World#centerX
* @property {number} centerX - Gets the X position corresponding to the center point of the world.
* @readonly
*/
Object.defineProperty(Phaser.World.prototype, "centerX", {

    get: function () {
        return this.bounds.halfWidth + this.bounds.x;
    }

});

/**
* @name Phaser.World#centerY
* @property {number} centerY - Gets the Y position corresponding to the center point of the world.
* @readonly
*/
Object.defineProperty(Phaser.World.prototype, "centerY", {

    get: function () {
        return this.bounds.halfHeight + this.bounds.y;
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
            return this.game.rnd.between(this.bounds.x, (this.bounds.width - Math.abs(this.bounds.x)));
        }
        else
        {
            return this.game.rnd.between(this.bounds.x, this.bounds.width);
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
            return this.game.rnd.between(this.bounds.y, (this.bounds.height - Math.abs(this.bounds.y)));
        }
        else
        {
            return this.game.rnd.between(this.bounds.y, this.bounds.height);
        }

    }

});
