/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* @class Phaser.Image
*
* @classdesc Create a new `Image` object.
*
* At its most basic a Sprite consists of a set of coordinates and a texture that is rendered to the canvas.
*
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {number} x - The x coordinate (in world space) to position the Sprite at.
* @param {number} y - The y coordinate (in world space) to position the Sprite at.
* @param {string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture} key - This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture or PIXI.Texture.
* @param {string|number} frame - If this Sprite is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
*/
Phaser.Image = function (game, x, y, key, frame) {

    x = x || 0;
    y = y || 0;
    key = key || null;
    frame = frame || null;
    
    /**
    * @property {Phaser.Game} game - A reference to the currently running Game.
    */
    this.game = game;
 
    /**
    * @property {boolean} exists - If exists = false then the Sprite isn't updated by the core game loop or physics subsystem at all.
    * @default
    */
    this.exists = true;

    /**
    * @property {string} name - The user defined name given to this Sprite.
    * @default
    */
    this.name = '';

    /**
    * @property {number} type - The const type of this object.
    * @readonly
    */
    this.type = Phaser.IMAGE;

    /**
    * @property {Phaser.Events} events - The Events you can subscribe to that are dispatched when certain things happen on this Sprite or its components.
    */
    this.events = new Phaser.Events(this);

    /**
    *  @property {string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture} key - This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture, BitmapData or PIXI.Texture.
    */
    this.key = key;

    this.currentFrame = new Phaser.Rectangle();

    if (key instanceof Phaser.RenderTexture)
    {
        PIXI.Sprite.call(this, key);

        this.currentFrame = this.game.cache.getTextureFrame(key.name);
    }
    else if (key instanceof Phaser.BitmapData)
    {
        PIXI.Sprite.call(this, key.texture, key.textureFrame);

        this.currentFrame = key.textureFrame;
    }
    else if (key instanceof PIXI.Texture)
    {
        PIXI.Sprite.call(this, key);

        this.currentFrame = frame;
    }
    else
    {
        if (key === null || typeof key === 'undefined')
        {
            key = '__default';
            this.key = key;
        }
        else if (typeof key === 'string' && this.game.cache.checkImageKey(key) === false)
        {
            key = '__missing';
            this.key = key;
        }

        PIXI.Sprite.call(this, PIXI.TextureCache[key]);

        if (this.game.cache.isSpriteSheet(key))
        {
            this.animations.loadFrameData(this.game.cache.getFrameData(key));

            if (frame !== null)
            {
                if (typeof frame === 'string')
                {
                    this.frameName = frame;
                }
                else
                {
                    this.frame = frame;
                }
            }
        }
        else
        {
            this.currentFrame = this.game.cache.getFrame(key);
        }
    }

    // this.loadTexture(key, frame);

    /**
    * The rectangular area from the texture that will be rendered.
    * @property {Phaser.Rectangle} textureRegion
    */
    // this.textureRegion = new Phaser.Rectangle(this.texture.frame.x, this.texture.frame.y, this.texture.frame.width, this.texture.frame.height);

    this.position.x = x;
    this.position.y = y;

    /**
    * @property {Phaser.Point} world - The world coordinates of this Sprite. This differs from the x/y coordinates which are relative to the Sprites container.
    */
    this.world = new Phaser.Point(x, y);

    /**
    * Should this Sprite be automatically culled if out of range of the camera?
    * A culled sprite has its renderable property set to 'false'.
    * Be advised this is quite an expensive operation, as it has to calculate the bounds of the object every frame, so only enable it if you really need it.
    *
    * @property {boolean} autoCull - A flag indicating if the Sprite should be automatically camera culled or not.
    * @default
    */
    this.autoCull = false;

    /**
    * A Sprite that is fixed to the camera ignores the position of any ancestors in the display list and uses its x/y coordinates as offsets from the top left of the camera.
    * @property {boolean} fixedToCamera - Fixes this Sprite to the Camera.
    * @default
    */
    this.fixedToCamera = false;

    /**
    * @property {Phaser.Point} cameraOffset - If this Sprite is fixed to the camera then use this Point to specify how far away from the Camera x/y it's rendered.
    */
    // this.cameraOffset = new Phaser.Point(x, y);

};

Phaser.Image.prototype = Object.create(PIXI.Sprite.prototype);
Phaser.Image.prototype.constructor = Phaser.Image;

/**
* Automatically called by World.preUpdate. Handles cache updates, lifespan checks, animation updates and physics updates.
*
* @method Phaser.Image#preUpdate
* @memberof Phaser.Image
*/
Phaser.Image.prototype.preUpdate = function() {

    if (!this.exists || !this.parent.exists)
    {
        return false;
    }

    if (this.autoCull)
    {
        //  Won't get rendered but will still get its transform updated
        this.renderable = this.game.world.camera.screenView.intersects(this.getBounds());
    }

    return true;

};

/**
* Checks if the Image bounds are within the game world, otherwise false if fully outside of it.
*
* @method Phaser.Image#inWorld
* @memberof Phaser.Image
* @return {boolean} True if the Image bounds is within the game world, otherwise false if fully outside of it.
*/
Phaser.Image.prototype.inWorld = function() {

    return this.game.world.bounds.intersects(this.getBounds());

};

/**
* Resets the Sprite.crop value back to the frame dimensions.
*
* @method Phaser.Image#resetCrop
* @memberof Phaser.Image
Phaser.Image.prototype.resetCrop = function() {

    this.crop = new Phaser.Rectangle(0, 0, this._cache.width, this._cache.height);
    this.texture.setFrame(this.crop);
    this.cropEnabled = false;

};
*/

/**
* Internal function called by the World postUpdate cycle.
*
* @method Phaser.Image#postUpdate
* @memberof Phaser.Image
*/
Phaser.Image.prototype.postUpdate = function() {

    if (this.key instanceof Phaser.BitmapData && this.key._dirty)
    {
        this.key.render();
    }

    if (this.exists)
    {
        // if (this.body)
        // {
        //     this.body.postUpdate();
        // }

        if (this.fixedToCamera)
        {
            this.position.x = this.game.camera.view.x + this.cameraOffset.x;
            this.position.y = this.game.camera.view.y + this.cameraOffset.y;
        }

    }

};

/**
* Changes the Texture the Sprite is using entirely. The old texture is removed and the new one is referenced or fetched from the Cache.
* This causes a WebGL texture update, so use sparingly or in low-intensity portions of your game.
*
* @method Phaser.Image#loadTexture
* @memberof Phaser.Image
* @param {string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture} key - This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture, BitmapData or PIXI.Texture.
* @param {string|number} frame - If this Sprite is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
*/
Phaser.Image.prototype.loadTexture = function (key, frame) {

    console.log('loadTexture');

    this.key = key;

    if (key instanceof Phaser.RenderTexture)
    {
        this.game.cache.getTextureFrame(key.name).clone(this.currentFrame);
    }
    else if (key instanceof Phaser.BitmapData)
    {
        this.setTexture(key.texture);
        this.currentFrame = key.textureFrame;
    }
    else if (key instanceof PIXI.Texture)
    {
        // this.currentFrame = frame;
        frame.clone(this.currentFrame);
        console.log('loadTexture 2');
    }
    else
    {
        if (typeof key === 'undefined' || this.game.cache.checkImageKey(key) === false)
        {
            key = '__default';
            this.key = key;
        }

        if (this.game.cache.isSpriteSheet(key))
        {
            // this.animations.loadFrameData(this.game.cache.getFrameData(key));

            // if (typeof frame !== 'undefined')
            // {
            //     if (typeof frame === 'string')
            //     {
            //         this.frameName = frame;
            //     }
            //     else
            //     {
            //         this.frame = frame;
            //     }
            // }
        }
        else
        {
            console.log('loadTexture 1', this.game.cache.getFrame(key));

            this.game.cache.getFrame(key).getRect(this.currentFrame);

            console.log('loadTexture 1', this.currentFrame);

            this.setTexture(PIXI.TextureCache[key]);
        }
    }

};

/**
* Moves the sprite so its center is located on the given x and y coordinates.
* Doesn't change the anchor point of the sprite.
* 
* @method Phaser.Image#centerOn
* @memberof Phaser.Image
* @param {number} x - The x coordinate (in world space) to position the Sprite at.
* @param {number} y - The y coordinate (in world space) to position the Sprite at.
* @return (Phaser.Image) This instance.
Phaser.Image.prototype.centerOn = function(x, y) {

    if (this.fixedToCamera)
    {
        this.cameraOffset.x = x + (this.cameraOffset.x - this.center.x);
        this.cameraOffset.y = y + (this.cameraOffset.y - this.center.y);
    }
    else
    {
        this.x = x + (this.x - this.center.x);
        this.y = y + (this.y - this.center.y);
    }

    return this;

};
*/

/**
* Brings a 'dead' Sprite back to life, optionally giving it the health value specified.
* A resurrected Sprite has its alive, exists and visible properties all set to true.
* It will dispatch the onRevived event, you can listen to Sprite.events.onRevived for the signal.
* 
* @method Phaser.Image#revive
* @memberof Phaser.Image
* @return (Phaser.Image) This instance.
*/
Phaser.Image.prototype.revive = function() {

    this.alive = true;
    this.exists = true;
    this.visible = true;

    if (this.events)
    {
        this.events.onRevived.dispatch(this);
    }

    return this;

};

/**
* Kills a Sprite. A killed Sprite has its alive, exists and visible properties all set to false.
* It will dispatch the onKilled event, you can listen to Sprite.events.onKilled for the signal.
* Note that killing a Sprite is a way for you to quickly recycle it in a Sprite pool, it doesn't free it up from memory.
* If you don't need this Sprite any more you should call Sprite.destroy instead.
* 
* @method Phaser.Image#kill
* @memberof Phaser.Image
* @return (Phaser.Image) This instance.
*/
Phaser.Image.prototype.kill = function() {

    this.alive = false;
    this.exists = false;
    this.visible = false;

    if (this.events)
    {
        this.events.onKilled.dispatch(this);
    }

    return this;

};

/**
* Destroys the Sprite. This removes it from its parent group, destroys the input, event and animation handlers if present
* and nulls its reference to game, freeing it up for garbage collection.
* 
* @method Phaser.Image#destroy
* @memberof Phaser.Image
*/
Phaser.Image.prototype.destroy = function() {

    if (this.filters)
    {
        this.filters = null;
    }

    if (this.parent)
    {
        this.parent.remove(this);
    }

    if (this.events)
    {
        this.events.destroy();
    }

    this.alive = false;
    this.exists = false;
    this.visible = false;

    this.game = null;

};

/**
* Resets the Sprite. This places the Sprite at the given x/y world coordinates and then
* sets alive, exists, visible and renderable all to true. Also resets the outOfBounds state and health values.
* If the Sprite has a physics body that too is reset.
* 
* @method Phaser.Image#reset
* @memberof Phaser.Image
* @param {number} x - The x coordinate (in world space) to position the Sprite at.
* @param {number} y - The y coordinate (in world space) to position the Sprite at.
* @return (Phaser.Image) This instance.
*/
Phaser.Image.prototype.reset = function(x, y) {

    this.world.setTo(x, y);
    this.position.x = x;
    this.position.y = y;
    this.alive = true;
    this.exists = true;
    this.visible = true;
    this.renderable = true;
    this._outOfBoundsFired = false;

    return this;
    
};

/**
* Brings the Sprite to the top of the display list it is a child of. Sprites that are members of a Phaser.Group are only
* bought to the top of that Group, not the entire display list.
* 
* @method Phaser.Image#bringToTop
* @memberof Phaser.Image
* @return (Phaser.Image) This instance.
*/
Phaser.Image.prototype.bringToTop = function(child) {

    if (typeof child === 'undefined')
    {
        if (this.parent)
        {
            this.parent.bringToTop(this);
        }
    }
    else
    {

    }

    return this;

};

/**
* Indicates the rotation of the Sprite, in degrees, from its original orientation. Values from 0 to 180 represent clockwise rotation; values from 0 to -180 represent counterclockwise rotation.
* Values outside this range are added to or subtracted from 360 to obtain a value within the range. For example, the statement player.angle = 450 is the same as player.angle = 90.
* If you wish to work in radians instead of degrees use the property Sprite.rotation instead.
* @name Phaser.Image#angle
* @property {number} angle - Gets or sets the Sprites angle of rotation in degrees.
*/
Object.defineProperty(Phaser.Image.prototype, 'angle', {

    get: function() {
        return Phaser.Math.wrapAngle(Phaser.Math.radToDeg(this.rotation));
    },

    set: function(value) {
        this.rotation = Phaser.Math.degToRad(Phaser.Math.wrapAngle(value));
    }

});

/**
* @name Phaser.Image#inCamera
* @property {boolean} inCamera - Is this sprite visible to the camera or not?
* @readonly
*/
Object.defineProperty(Phaser.Image.prototype, "inCamera", {
    
    get: function () {
        return this._cache.cameraVisible;
    }

});

