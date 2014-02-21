/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A TileSprite is a Sprite that has a repeating texture. The texture can be scrolled and scaled and will automatically wrap on the edges as it does so.
* Please note that TileSprites have no input handler or physics bodies.
*
* @class Phaser.TileSprite
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {number} x - The x coordinate (in world space) to position the TileSprite at.
* @param {number} y - The y coordinate (in world space) to position the TileSprite at.
* @param {number} width - The width of the TileSprite.
* @param {number} height - The height of the TileSprite.
* @param {string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture} key - This is the image or texture used by the TileSprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture or PIXI.Texture.
* @param {string|number} frame - If this TileSprite is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
*/
Phaser.TileSprite = function (game, x, y, width, height, key, frame) {

    x = x || 0;
    y = y || 0;
    width = width || 256;
    height = height || 256;
    key = key || null;
    frame = frame || null;

    /**
    * @property {Phaser.Game} game - A reference to the currently running Game.
    */
    this.game = game;

    /**
    * @property {string} name - The user defined name given to this Sprite.
    * @default
    */
    this.name = '';

    /**
    * @property {number} type - The const type of this object.
    * @readonly
    */
    this.type = Phaser.TILESPRITE;

    /**
    * @property {Phaser.Events} events - The Events you can subscribe to that are dispatched when certain things happen on this Sprite or its components.
    */
    this.events = new Phaser.Events(this);

    /**
    * @property {Phaser.AnimationManager} animations - This manages animations of the sprite. You can modify animations through it (see Phaser.AnimationManager)
    */
    this.animations = new Phaser.AnimationManager(this);

    /**
    *  @property {string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture} key - This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture, BitmapData or PIXI.Texture.
    */
    this.key = key;

    /**
    * @property {number} _frame - Internal cache var.
    * @private
    */
    this._frame = 0;

    /**
    * @property {string} _frameName - Internal cache var.
    * @private
    */
    this._frameName = '';

    /**
    * @property {Phaser.Point} _scroll - Internal cache var.
    * @private
    */
    this._scroll = new Phaser.Point();

    PIXI.TilingSprite.call(this, PIXI.TextureCache['__default'], width, height);

    this.loadTexture(key, frame);

    this.position.set(x, y);

    /**
    * @property {Phaser.Point} world - The world coordinates of this Sprite. This differs from the x/y coordinates which are relative to the Sprites container.
    */
    this.world = new Phaser.Point(x, y);

    /**
    * @property {Phaser.Point} cameraOffset - If this object is fixedToCamera then this stores the x/y offset that its drawn at, from the top-left of the camera view.
    */
    this.cameraOffset = new Phaser.Point();

    /**
    * A small internal cache:
    * 0 = previous position.x
    * 1 = previous position.y
    * 2 = previous rotation
    * 3 = renderID
    * 4 = fresh? (0 = no, 1 = yes)
    * 5 = outOfBoundsFired (0 = no, 1 = yes)
    * 6 = exists (0 = no, 1 = yes)
    * 7 = fixed to camera (0 = no, 1 = yes)
    * @property {Int16Array} _cache
    * @private
    */
    this._cache = new Int16Array([0, 0, 0, 0, 1, 0, 1, 0]);

};

Phaser.TileSprite.prototype = Object.create(PIXI.TilingSprite.prototype);
Phaser.TileSprite.prototype.constructor = Phaser.TileSprite;

/**
* Automatically called by World.preUpdate.
*
* @method Phaser.TileSprite#preUpdate
* @memberof Phaser.TileSprite
*/
Phaser.TileSprite.prototype.preUpdate = function() {

    this.world.setTo(this.game.camera.x + this.worldTransform[2], this.game.camera.y + this.worldTransform[5]);

    this.animations.update();

    if (this._scroll.x !== 0)
    {
        this.tilePosition.x += this._scroll.x * this.game.time.physicsElapsed;
    }

    if (this._scroll.y !== 0)
    {
        this.tilePosition.y += this._scroll.y * this.game.time.physicsElapsed;
    }

    return true;

}

/**
* Override and use this function in your own custom objects to handle any update requirements you may have.
*
* @method Phaser.TileSprite#update
* @memberof Phaser.TileSprite
*/
Phaser.TileSprite.prototype.update = function() {

}

/**
* Internal function called by the World postUpdate cycle.
*
* @method Phaser.TileSprite#postUpdate
* @memberof Phaser.TileSprite
*/
Phaser.TileSprite.prototype.postUpdate = function() {

    //  Fixed to Camera?
    if (this._cache[7] === 1)
    {
        this.position.x = this.game.camera.view.x + this.cameraOffset.x;
        this.position.y = this.game.camera.view.y + this.cameraOffset.y;
    }

}

/**
* Sets this TileSprite to automatically scroll in the given direction until stopped via TileSprite.stopScroll().
* The scroll speed is specified in pixels per second.
* A negative x value will scroll to the left. A positive x value will scroll to the right.
* A negative y value will scroll up. A positive y value will scroll down.
*
* @method Phaser.TileSprite#autoScroll
* @memberof Phaser.TileSprite
*/
Phaser.TileSprite.prototype.autoScroll = function(x, y) {

    this._scroll.set(x, y);

}

/**
* Stops an automatically scrolling TileSprite.
*
* @method Phaser.TileSprite#stopScroll
* @memberof Phaser.TileSprite
*/
Phaser.TileSprite.prototype.stopScroll = function() {

    this._scroll.set(0, 0);

}

/**
* Changes the Texture the TileSprite is using entirely. The old texture is removed and the new one is referenced or fetched from the Cache.
* This causes a WebGL texture update, so use sparingly or in low-intensity portions of your game.
*
* @method Phaser.TileSprite#loadTexture
* @memberof Phaser.TileSprite
* @param {string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture} key - This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture, BitmapData or PIXI.Texture.
* @param {string|number} frame - If this Sprite is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
*/
Phaser.TileSprite.prototype.loadTexture = function (key, frame) {

    frame = frame || 0;

    if (key instanceof Phaser.RenderTexture)
    {
        this.key = key.key;
        this.setTexture(key);
        return;
    }
    else if (key instanceof Phaser.BitmapData)
    {
        this.key = key.key;
        this.setTexture(key.texture);
        return;
    }
    else if (key instanceof PIXI.Texture)
    {
        this.key = key;
        this.setTexture(key);
        return;
    }
    else
    {
        if (key === null || typeof key === 'undefined')
        {
            this.key = '__default';
            this.setTexture(PIXI.TextureCache[this.key]);
            return;
        }
        else if (typeof key === 'string' && !this.game.cache.checkImageKey(key))
        {
            this.key = '__missing';
            this.setTexture(PIXI.TextureCache[this.key]);
            return;
        }

        if (this.game.cache.isSpriteSheet(key))
        {
            this.key = key;

            // var frameData = this.game.cache.getFrameData(key);
            this.animations.loadFrameData(this.game.cache.getFrameData(key));

            if (typeof frame === 'string')
            {
                this.frameName = frame;
            }
            else
            {
                this.frame = frame;
            }
        }
        else
        {
            this.key = key;
            this.setTexture(PIXI.TextureCache[key]);
            return;
        }
    }

}

/**
* Destroys the TileSprite. This removes it from its parent group, destroys the event and animation handlers if present
* and nulls its reference to game, freeing it up for garbage collection.
* 
* @method Phaser.TileSprite#destroy
* @memberof Phaser.TileSprite
*/
Phaser.TileSprite.prototype.destroy = function() {

    if (this.filters)
    {
        this.filters = null;
    }

    if (this.parent)
    {
        this.parent.remove(this);
    }

    this.animations.destroy();

    this.events.destroy();

    var i = this.children.length;

    while (i--)
    {
        this.removeChild(this.children[i]);
    }

    this.exists = false;
    this.visible = false;

    this.filters = null;
    this.mask = null;
    this.game = null;

}

/**
* Play an animation based on the given key. The animation should previously have been added via sprite.animations.add()
* If the requested animation is already playing this request will be ignored. If you need to reset an already running animation do so directly on the Animation object itself.
* 
* @method Phaser.TileSprite#play
* @memberof Phaser.TileSprite
* @param {string} name - The name of the animation to be played, e.g. "fire", "walk", "jump".
* @param {number} [frameRate=null] - The framerate to play the animation at. The speed is given in frames per second. If not provided the previously set frameRate of the Animation is used.
* @param {boolean} [loop=false] - Should the animation be looped after playback. If not provided the previously set loop value of the Animation is used.
* @param {boolean} [killOnComplete=false] - If set to true when the animation completes (only happens if loop=false) the parent Sprite will be killed.
* @return {Phaser.Animation} A reference to playing Animation instance.
*/
Phaser.TileSprite.prototype.play = function (name, frameRate, loop, killOnComplete) {

    return this.animations.play(name, frameRate, loop, killOnComplete);

}

/**
* Indicates the rotation of the Sprite, in degrees, from its original orientation. Values from 0 to 180 represent clockwise rotation; values from 0 to -180 represent counterclockwise rotation.
* Values outside this range are added to or subtracted from 360 to obtain a value within the range. For example, the statement player.angle = 450 is the same as player.angle = 90.
* If you wish to work in radians instead of degrees use the property Sprite.rotation instead. Working in radians is also a little faster as it doesn't have to convert the angle.
* 
* @name Phaser.TileSprite#angle
* @property {number} angle - The angle of this Sprite in degrees.
*/
Object.defineProperty(Phaser.TileSprite.prototype, "angle", {

    get: function() {

        return Phaser.Math.wrapAngle(Phaser.Math.radToDeg(this.rotation));

    },

    set: function(value) {

        this.rotation = Phaser.Math.degToRad(Phaser.Math.wrapAngle(value));

    }

});

/**
* @name Phaser.TileSprite#frame
* @property {number} frame - Gets or sets the current frame index and updates the Texture Cache for display.
*/
Object.defineProperty(Phaser.TileSprite.prototype, "frame", {

    get: function () {
        return this.animations.frame;
    },

    set: function (value) {

        if (value !== this.animations.frame)
        {
            this.animations.frame = value;
        }

    }

});

/**
* @name Phaser.TileSprite#frameName
* @property {string} frameName - Gets or sets the current frame name and updates the Texture Cache for display.
*/
Object.defineProperty(Phaser.TileSprite.prototype, "frameName", {

    get: function () {
        return this.animations.frameName;
    },

    set: function (value) {

        if (value !== this.animations.frameName)
        {
            this.animations.frameName = value;
        }

    }

});

/**
* An TileSprite that is fixed to the camera uses its x/y coordinates as offsets from the top left of the camera. These are stored in TileSprite.cameraOffset.
* Note that the cameraOffset values are in addition to any parent in the display list.
* So if this TileSprite was in a Group that has x: 200, then this will be added to the cameraOffset.x
*
* @name Phaser.TileSprite#fixedToCamera
* @property {boolean} fixedToCamera - Set to true to fix this TileSprite to the Camera at its current world coordinates.
*/
Object.defineProperty(Phaser.TileSprite.prototype, "fixedToCamera", {
    
    get: function () {

        return !!this._cache[7];

    },

    set: function (value) {

        if (value)
        {
            this._cache[7] = 1;
            this.cameraOffset.set(this.x, this.y);
        }
        else
        {
            this._cache[7] = 0;
        }
    }

});
