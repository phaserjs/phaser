/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Create a new `Sprite` object. Sprites are the lifeblood of your game, used for nearly everything visual.
* At its most basic a Sprite consists of a set of coordinates and a texture that is rendered to the canvas.
* They also contain additional properties allowing for physics motion (via Sprite.body), input handling (via Sprite.input),
* events (via Sprite.events), animation (via Sprite.animations), camera culling and more. Please see the Examples for use cases.
*
* @class Phaser.Sprite
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {number} x - The x coordinate (in world space) to position the Sprite at.
* @param {number} y - The y coordinate (in world space) to position the Sprite at.
* @param {string|Phaser.RenderTexture|PIXI.Texture} key - This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture or PIXI.Texture.
* @param {string|number} frame - If this Sprite is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
*/
Phaser.Sprite = function (game, x, y, key, frame) {

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
    * @property {boolean} alive - This is a handy little var your game can use to determine if a sprite is alive or not, it doesn't effect rendering.
   	* @default
   	*/
    this.alive = true;

	/**
    * @property {Phaser.Group} group - The parent Group of this Sprite. This is usually set after Sprite instantiation by the parent.
   	*/
    this.group = null;

    /**
     * @property {string} name - The user defined name given to this Sprite.
     * @default
     */
    this.name = '';

    /**
	* @property {number} type - The const type of this object.
    * @default
	*/
    this.type = Phaser.SPRITE;

    /**
	* @property {number} renderOrderID - Used by the Renderer and Input Manager to control picking order.
	* @default
	*/
    this.renderOrderID = -1;

    /**
    * If you would like the Sprite to have a lifespan once 'born' you can set this to a positive value. Handy for particles, bullets, etc.
	* The lifespan is decremented by game.time.elapsed each update, once it reaches zero the kill() function is called.
	* @property {number} lifespan - The lifespan of the Sprite (in ms) before it will be killed.
	* @default
	*/    
    this.lifespan = 0;

    /**
    * @property {Events} events - The Events you can subscribe to that are dispatched when certain things happen on this Sprite or its components.
    */
    this.events = new Phaser.Events(this);

    /**
    * @property {Phaser.AnimationManager} animations - This manages animations of the sprite. You can modify animations through it (see Phaser.AnimationManager)
    */
    this.animations = new Phaser.AnimationManager(this);

    /**
    * @property {InputHandler} input - The Input Handler Component.
    */
    this.input = new Phaser.InputHandler(this);

    /**
    *  @property {string|Phaser.RenderTexture|PIXI.Texture} key - This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture or PIXI.Texture.
    */
    this.key = key;

    /**
    *  @property {Phaser.Frame} currentFrame - A reference to the currently displayed frame.
    */
    this.currentFrame = null;

    if (key instanceof Phaser.RenderTexture)
    {
        PIXI.Sprite.call(this, key);

        this.currentFrame = this.game.cache.getTextureFrame(key.name);
    }
    else if (key instanceof PIXI.Texture)
    {
        PIXI.Sprite.call(this, key);

        this.currentFrame = frame;
    }
    else
    {
        if (key == null || this.game.cache.checkImageKey(key) == false)
        {
            key = '__default';
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

    /**
    * The anchor sets the origin point of the texture.
    * The default is 0,0 this means the textures origin is the top left 
    * Setting than anchor to 0.5,0.5 means the textures origin is centered
    * Setting the anchor to 1,1 would mean the textures origin points will be the bottom right
    *
    * @property {Phaser.Point} anchor - The anchor around with Sprite rotation and scaling takes place.
    */
    this.anchor = new Phaser.Point();

    /**
    * @property {number} x - The x coordinate (in world space) of this Sprite.
    */
    this.x = x;
    
    /**
    * @property {number} y - The y coordinate (in world space) of this Sprite.
    */
    this.y = y;

	this.position.x = x;
	this.position.y = y;

    /**
    * Should this Sprite be automatically culled if out of range of the camera?
    * A culled sprite has its renderable property set to 'false'.
    *
    * @property {boolean} autoCull - A flag indicating if the Sprite should be automatically camera culled or not.
    * @default
    */
    this.autoCull = false;

    /**
    * @property {Phaser.Point} scale - The scale of the Sprite when rendered. By default it's set to 1 (no scale). You can modify it via scale.x or scale.y or scale.setTo(x, y). A value of 1 means no change to the scale, 0.5 means "half the size", 2 means "twice the size", etc.
    */ 
    this.scale = new Phaser.Point(1, 1);

    /**
    * @property {Phaser.Point} _cache - A mini cache for storing all of the calculated values.
    * @private
    */
    this._cache = { 

        dirty: false,

        //  Transform cache
        a00: -1, a01: -1, a02: -1, a10: -1, a11: -1, a12: -1, id: -1, 

        //  Input specific transform cache
        i01: -1, i10: -1, idi: -1,

        //  Bounds check
        left: null, right: null, top: null, bottom: null, 

        //  The previous calculated position
        x: -1, y: -1,

        //  The actual scale values based on the worldTransform
        scaleX: 1, scaleY: 1,

        //  The width/height of the image, based on the un-modified frame size multiplied by the final calculated scale size
        width: this.currentFrame.sourceSizeW, height: this.currentFrame.sourceSizeH,

        //  The actual width/height of the image if from a trimmed atlas, multiplied by the final calculated scale size
        halfWidth: Math.floor(this.currentFrame.sourceSizeW / 2), halfHeight: Math.floor(this.currentFrame.sourceSizeH / 2),

        //  The width/height of the image, based on the un-modified frame size multiplied by the final calculated scale size
        calcWidth: -1, calcHeight: -1,

        //  The current frame details
        // frameID: this.currentFrame.uuid, frameWidth: this.currentFrame.width, frameHeight: this.currentFrame.height,
        frameID: -1, frameWidth: this.currentFrame.width, frameHeight: this.currentFrame.height,

        //  If this sprite visible to the camera (regardless of being set to visible or not)
        cameraVisible: true,

        //  Crop cache
        cropX: 0, cropY: 0, cropWidth: this.currentFrame.sourceSizeW, cropHeight: this.currentFrame.sourceSizeH

    };
  
    /**
    * @property {Phaser.Point} offset - Corner point defaults. Should not typically be modified.
    */    
    this.offset = new Phaser.Point;
    
    /**
    * @property {Phaser.Point} center - A Point containing the center coordinate of the Sprite. Takes rotation and scale into account.
    */
    this.center = new Phaser.Point(x + Math.floor(this._cache.width / 2), y + Math.floor(this._cache.height / 2));
   
    /**
    * @property {Phaser.Point} topLeft - A Point containing the top left coordinate of the Sprite. Takes rotation and scale into account.
    */
    this.topLeft = new Phaser.Point(x, y);
    
    /**
    * @property {Phaser.Point} topRight - A Point containing the top right coordinate of the Sprite. Takes rotation and scale into account.
    */
    this.topRight = new Phaser.Point(x + this._cache.width, y);
    
    /**
    * @property {Phaser.Point} bottomRight - A Point containing the bottom right coordinate of the Sprite. Takes rotation and scale into account.
    */
    this.bottomRight = new Phaser.Point(x + this._cache.width, y + this._cache.height);
    
    /**
    * @property {Phaser.Point} bottomLeft - A Point containing the bottom left coordinate of the Sprite. Takes rotation and scale into account.
    */
    this.bottomLeft = new Phaser.Point(x, y + this._cache.height);
    
    /**
    * This Rectangle object fully encompasses the Sprite and is updated in real-time.
    * The bounds is the full bounding area after rotation and scale have been taken into account. It should not be modified directly.
    * It's used for Camera culling and physics body alignment.
    * @property {Phaser.Rectangle} bounds
    */
    this.bounds = new Phaser.Rectangle(x, y, this._cache.width, this._cache.height);
    
    /**
    * @property {Phaser.Physics.Arcade.Body} body - By default Sprites have a Phaser.Physics Body attached to them. You can operate physics actions via this property, or null it to skip all physics updates.
    */
    this.body = new Phaser.Physics.Arcade.Body(this);

    /**
    * @property {number} health - Health value. Used in combination with damage() to allow for quick killing of Sprites.
    */    
    this.health = 1;

    /**
    * @property {boolean} inWorld - This value is set to true if the Sprite is positioned within the World, otherwise false.
    */
    this.inWorld = Phaser.Rectangle.intersects(this.bounds, this.game.world.bounds);
    
    /**
    * @property {number} inWorldThreshold - A threshold value applied to the inWorld check. If you don't want a Sprite to be considered "out of the world" until at least 100px away for example then set it to 100.
    * @default
    */
    this.inWorldThreshold = 0;

    /**
    * @property {boolean} outOfBoundsKill - If true the Sprite is killed as soon as Sprite.inWorld is false.
    * @default
    */
    this.outOfBoundsKill = false;
    
    /**
    * @property {boolean} _outOfBoundsFired - Internal flag.
    * @private
    * @default
    */
    this._outOfBoundsFired = false;

    /**
    * A Sprite that is fixed to the camera ignores the position of any ancestors in the display list and uses its x/y coordinates as offsets from the top left of the camera.
    * @property {boolean} fixedToCamera - Fixes this Sprite to the Camera.
    * @default
    */
    this.fixedToCamera = false;

    /**
    * @property {Phaser.Point} cameraOffset - If this Sprite is fixed to the camera then use this Point to specify how far away from the Camera x/y it's rendered.
    */
    this.cameraOffset = new Phaser.Point;

    /**
    * @property {Phaser.Point} world - The world coordinates of this Sprite. This differs from the x/y coordinates which are relative to the Sprites container.
    */
    this.world = new Phaser.Point;

    /**
    * You can crop the Sprites texture by modifying the crop properties. For example crop.width = 50 would set the Sprite to only render 50px wide.
    * The crop is only applied if you have set Sprite.cropEnabled to true.
    * @property {Phaser.Rectangle} crop - The crop Rectangle applied to the Sprite texture before rendering.
    * @default
    */
    this.crop = new Phaser.Rectangle(0, 0, this._cache.width, this._cache.height);

    /**
    * @property {boolean} cropEnabled - If true the Sprite.crop property is used to crop the texture before render. Set to false to disable.
    * @default
    */
    this.cropEnabled = false;

    this.updateCache();
    this.updateBounds();

};

//  Needed to keep the PIXI.Sprite constructor in the prototype chain (as the core pixi renderer uses an instanceof check sadly)
Phaser.Sprite.prototype = Object.create(PIXI.Sprite.prototype);
Phaser.Sprite.prototype.constructor = Phaser.Sprite;

/**
* Automatically called by World.preUpdate. Handles cache updates, lifespan checks, animation updates and physics updates.
*
* @method Phaser.Sprite#preUpdate
* @memberof Phaser.Sprite
*/
Phaser.Sprite.prototype.preUpdate = function() {

    if (!this.exists)
    {
        this.renderOrderID = -1;
        return;
    }

    if (this.lifespan > 0)
    {
        this.lifespan -= this.game.time.elapsed;

        if (this.lifespan <= 0)
        {
            this.kill();
            return;
        }
    }

    this._cache.dirty = false;

    if (this.visible)
    {
        this.renderOrderID = this.game.world.currentRenderOrderID++;
    }

    this.updateCache();

    this.updateAnimation();

    this.updateCrop();

    //  Re-run the camera visibility check
    if (this._cache.dirty || this.world.x !== this.prevX || this.world.y !== this.prevY)
    {
        this.updateBounds();
    }

    if (this.body)
    {
        this.body.preUpdate();
    }

}

/**
* Internal function called by preUpdate.
*
* @method Phaser.Sprite#updateCache
* @memberof Phaser.Sprite
*/
Phaser.Sprite.prototype.updateCache = function() {

    this.prevX = this.world.x;
    this.prevY = this.world.y;

    if (this.fixedToCamera)
    {
        this.x = this.game.camera.view.x + this.cameraOffset.x;
        this.y = this.game.camera.view.y + this.cameraOffset.y;
    }

    this.world.setTo(this.game.camera.x + this.worldTransform[2], this.game.camera.y + this.worldTransform[5]);

    if (this.worldTransform[1] != this._cache.i01 || this.worldTransform[3] != this._cache.i10 || this.worldTransform[0] != this._cache.a00 || this.worldTransform[41] != this._cache.a11)
    {
        this._cache.a00 = this.worldTransform[0];  //  scaleX         a     |a c tx|
        this._cache.a01 = this.worldTransform[1];  //  skewY          c     |b d ty|
        this._cache.a10 = this.worldTransform[3];  //  skewX          b     |0 0  1|
        this._cache.a11 = this.worldTransform[4];  //  scaleY         d

        this._cache.i01 = this.worldTransform[1];  //  skewY          c (remains non-modified for input checks)
        this._cache.i10 = this.worldTransform[3];  //  skewX          b (remains non-modified for input checks)

        this._cache.scaleX = Math.sqrt((this._cache.a00 * this._cache.a00) + (this._cache.a01 * this._cache.a01)); // round this off a bit?
        this._cache.scaleY = Math.sqrt((this._cache.a10 * this._cache.a10) + (this._cache.a11 * this._cache.a11)); // round this off a bit?

        this._cache.a01 *= -1;
        this._cache.a10 *= -1;

        this._cache.id = 1 / (this._cache.a00 * this._cache.a11 + this._cache.a01 * -this._cache.a10);
        this._cache.idi = 1 / (this._cache.a00 * this._cache.a11 + this._cache.i01 * -this._cache.i10);

        this._cache.dirty = true;
    }

    this._cache.a02 = this.worldTransform[2];  //  translateX     tx
    this._cache.a12 = this.worldTransform[5];  //  translateY     ty

}

/**
* Internal function called by preUpdate.
*
* @method Phaser.Sprite#updateAnimation
* @memberof Phaser.Sprite
*/
Phaser.Sprite.prototype.updateAnimation = function() {

    if (this.animations.update() || (this.currentFrame && this.currentFrame.uuid != this._cache.frameID))
    {
        this._cache.frameID = this.currentFrame.uuid;

        this._cache.frameWidth = this.texture.frame.width;
        this._cache.frameHeight = this.texture.frame.height;

        this._cache.width = this.currentFrame.width;
        this._cache.height = this.currentFrame.height;

        this._cache.halfWidth = Math.floor(this._cache.width / 2);
        this._cache.halfHeight = Math.floor(this._cache.height / 2);

        this._cache.dirty = true;

    }

}

/**
* Internal function called by preUpdate.
*
* @method Phaser.Sprite#updateCrop
* @memberof Phaser.Sprite
*/
Phaser.Sprite.prototype.updateCrop = function() {

    //  This only runs if crop is enabled
    if (this.cropEnabled && (this.crop.width != this._cache.cropWidth || this.crop.height != this._cache.cropHeight || this.crop.x != this._cache.cropX || this.crop.y != this._cache.cropY))
    {
        this.crop.floorAll();

        this._cache.cropX = this.crop.x;
        this._cache.cropY = this.crop.y;
        this._cache.cropWidth = this.crop.width;
        this._cache.cropHeight = this.crop.height;

        this.texture.frame = this.crop;
        this.texture.width = this.crop.width;
        this.texture.height = this.crop.height;

        this.texture.updateFrame = true;

        PIXI.Texture.frameUpdates.push(this.texture);
    }

}

/**
* Internal function called by preUpdate.
*
* @method Phaser.Sprite#updateBounds
* @memberof Phaser.Sprite
*/
Phaser.Sprite.prototype.updateBounds = function() {

    this.offset.setTo(this._cache.a02 - (this.anchor.x * this.width), this._cache.a12 - (this.anchor.y * this.height));

    this.getLocalPosition(this.center, this.offset.x + (this.width / 2), this.offset.y + (this.height / 2));
    this.getLocalPosition(this.topLeft, this.offset.x, this.offset.y);
    this.getLocalPosition(this.topRight, this.offset.x + this.width, this.offset.y);
    this.getLocalPosition(this.bottomLeft, this.offset.x, this.offset.y + this.height);
    this.getLocalPosition(this.bottomRight, this.offset.x + this.width, this.offset.y + this.height);

    this._cache.left = Phaser.Math.min(this.topLeft.x, this.topRight.x, this.bottomLeft.x, this.bottomRight.x);
    this._cache.right = Phaser.Math.max(this.topLeft.x, this.topRight.x, this.bottomLeft.x, this.bottomRight.x);
    this._cache.top = Phaser.Math.min(this.topLeft.y, this.topRight.y, this.bottomLeft.y, this.bottomRight.y);
    this._cache.bottom = Phaser.Math.max(this.topLeft.y, this.topRight.y, this.bottomLeft.y, this.bottomRight.y);

    this.bounds.setTo(this._cache.left, this._cache.top, this._cache.right - this._cache.left, this._cache.bottom - this._cache.top);

    this.updateFrame = true;

    if (this.inWorld == false)
    {
        //  Sprite WAS out of the screen, is it still?
        this.inWorld = Phaser.Rectangle.intersects(this.bounds, this.game.world.bounds, this.inWorldThreshold);

        if (this.inWorld)
        {
            //  It's back again, reset the OOB check
            this._outOfBoundsFired = false;
        }
    }
    else
    {
        //   Sprite WAS in the screen, has it now left?
        this.inWorld = Phaser.Rectangle.intersects(this.bounds, this.game.world.bounds, this.inWorldThreshold);

        if (this.inWorld == false)
        {
            this.events.onOutOfBounds.dispatch(this);
            this._outOfBoundsFired = true;

            if (this.outOfBoundsKill)
            {
                this.kill();
            }
        }
    }

    this._cache.cameraVisible = Phaser.Rectangle.intersects(this.game.world.camera.screenView, this.bounds, 0);

    if (this.autoCull)
    {
        //  Won't get rendered but will still get its transform updated
        this.renderable = this._cache.cameraVisible;
    }

    //  Update our physics bounds
    if (this.body)
    {
        this.body.updateBounds(this.center.x, this.center.y, this._cache.scaleX, this._cache.scaleY);
    }

}

/**
* Gets the local position of a coordinate relative to the Sprite, factoring in rotation and scale.
* Mostly only used internally.
* 
* @method Phaser.Sprite#getLocalPosition
* @memberof Phaser.Sprite
* @param {Phaser.Point} p - The Point object to store the results in.
* @param {number} x - x coordinate within the Sprite to translate.
* @param {number} y - x coordinate within the Sprite to translate.
* @param {number} sx - Scale factor to be applied.
* @param {number} sy - Scale factor to be applied.
* @return {Phaser.Point} The translated point.
*/
Phaser.Sprite.prototype.getLocalPosition = function(p, x, y) {

    p.x = ((this._cache.a11 * this._cache.id * x + -this._cache.a01 * this._cache.id * y + (this._cache.a12 * this._cache.a01 - this._cache.a02 * this._cache.a11) * this._cache.id) * this.scale.x) + this._cache.a02;
    p.y = ((this._cache.a00 * this._cache.id * y + -this._cache.a10 * this._cache.id * x + (-this._cache.a12 * this._cache.a00 + this._cache.a02 * this._cache.a10) * this._cache.id) * this.scale.y) + this._cache.a12;

    return p;

}

/**
* Gets the local unmodified position of a coordinate relative to the Sprite, factoring in rotation and scale.
* Mostly only used internally by the Input Manager, but also useful for custom hit detection.
* 
* @method Phaser.Sprite#getLocalUnmodifiedPosition
* @memberof Phaser.Sprite
* @param {Phaser.Point} p - The Point object to store the results in.
* @param {number} x - x coordinate within the Sprite to translate.
* @param {number} y - x coordinate within the Sprite to translate.
* @return {Phaser.Point} The translated point.
*/
Phaser.Sprite.prototype.getLocalUnmodifiedPosition = function(p, gx, gy) {

    p.x = (this._cache.a11 * this._cache.idi * gx + -this._cache.i01 * this._cache.idi * gy + (this._cache.a12 * this._cache.i01 - this._cache.a02 * this._cache.a11) * this._cache.idi) + (this.anchor.x * this._cache.width);
    p.y = (this._cache.a00 * this._cache.idi * gy + -this._cache.i10 * this._cache.idi * gx + (-this._cache.a12 * this._cache.a00 + this._cache.a02 * this._cache.i10) * this._cache.idi) + (this.anchor.y * this._cache.height);

    return p;

}


/**
* Resets the Sprite.crop value back to the frame dimensions.
*
* @method Phaser.Sprite#resetCrop
* @memberof Phaser.Sprite
*/
Phaser.Sprite.prototype.resetCrop = function() {

    this.crop = new Phaser.Rectangle(0, 0, this._cache.width, this._cache.height);
    this.texture.setFrame(this.crop);
    this.cropEnabled = false;

}

/**
* Internal function called by the World postUpdate cycle.
*
* @method Phaser.Sprite#postUpdate
* @memberof Phaser.Sprite
*/
Phaser.Sprite.prototype.postUpdate = function() {

    if (this.exists)
    {
        //  The sprite is positioned in this call, after taking into consideration motion updates and collision
        if (this.body)
        {
            this.body.postUpdate();
        }

        if (this.fixedToCamera)
        {
            this._cache.x = this.game.camera.view.x + this.cameraOffset.x;
            this._cache.y = this.game.camera.view.y + this.cameraOffset.y;
        }
        else
        {
            this._cache.x = this.x;
            this._cache.y = this.y;
        }

        this.world.setTo(this.game.camera.x + this.worldTransform[2], this.game.camera.y + this.worldTransform[5]);

        this.position.x = this._cache.x;
        this.position.y = this._cache.y;
    }

}

/**
* Changes the Texture the Sprite is using entirely. The old texture is removed and the new one is referenced or fetched from the Cache.
* This causes a WebGL texture update, so use sparingly or in low-intensity portions of your game.
*
* @method Phaser.Sprite#loadTexture
* @memberof Phaser.Sprite
* @param {string|Phaser.RenderTexture|PIXI.Texture} key - This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture or PIXI.Texture.
* @param {string|number} frame - If this Sprite is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
*/
Phaser.Sprite.prototype.loadTexture = function (key, frame) {

    this.key = key;

    if (key instanceof Phaser.RenderTexture)
    {
        this.currentFrame = this.game.cache.getTextureFrame(key.name);
    }
    else if (key instanceof PIXI.Texture)
    {
        this.currentFrame = frame;
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
            this.animations.loadFrameData(this.game.cache.getFrameData(key));

            if (typeof frame !== 'undefined')
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
            this.setTexture(PIXI.TextureCache[key]);
        }
    }

}

/**
* Returns the absolute delta x value.
*
* @method Phaser.Sprite#deltaAbsX
* @memberof Phaser.Sprite
* @return {number} The absolute delta value.
*/
Phaser.Sprite.prototype.deltaAbsX = function () {
    return (this.deltaX() > 0 ? this.deltaX() : -this.deltaX());
}

/**
* Returns the absolute delta y value.
*
* @method Phaser.Sprite#deltaAbsY
* @memberof Phaser.Sprite
* @return {number} The absolute delta value.
*/
Phaser.Sprite.prototype.deltaAbsY = function () {
    return (this.deltaY() > 0 ? this.deltaY() : -this.deltaY());
}

/**
* Returns the delta x value.
*
* @method Phaser.Sprite#deltaX
* @memberof Phaser.Sprite
* @return {number} The delta value.
*/
Phaser.Sprite.prototype.deltaX = function () {
    return this.x - this.prevX;
}

/**
* Returns the delta y value.
*
* @method Phaser.Sprite#deltaY
* @memberof Phaser.Sprite
* @return {number} The delta value.
*/
Phaser.Sprite.prototype.deltaY = function () {
    return this.y - this.prevY;
}

/**
* Moves the sprite so its center is located on the given x and y coordinates.
* Doesn't change the anchor point of the sprite.
* 
* @method Phaser.Sprite#centerOn
* @memberof Phaser.Sprite
* @param {number} x - The x coordinate (in world space) to position the Sprite at.
* @param {number} y - The y coordinate (in world space) to position the Sprite at.
* @return (Phaser.Sprite) This instance.
*/
Phaser.Sprite.prototype.centerOn = function(x, y) {

    this.x = x + (this.x - this.center.x);
    this.y = y + (this.y - this.center.y);
    return this;

}

/**
* Brings a 'dead' Sprite back to life, optionally giving it the health value specified.
* A resurrected Sprite has its alive, exists and visible properties all set to true.
* It will dispatch the onRevived event, you can listen to Sprite.events.onRevived for the signal.
* 
* @method Phaser.Sprite#revive
* @memberof Phaser.Sprite
* @param {number} [health=1] - The health to give the Sprite.
* @return (Phaser.Sprite) This instance.
*/
Phaser.Sprite.prototype.revive = function(health) {

    if (typeof health === 'undefined') { health = 1; }

    this.alive = true;
    this.exists = true;
    this.visible = true;
    this.health = health;

    if (this.events)
    {
        this.events.onRevived.dispatch(this);
    }

    return this;

}

/**
* Kills a Sprite. A killed Sprite has its alive, exists and visible properties all set to false.
* It will dispatch the onKilled event, you can listen to Sprite.events.onKilled for the signal.
* Note that killing a Sprite is a way for you to quickly recycle it in a Sprite pool, it doesn't free it up from memory.
* If you don't need this Sprite any more you should call Sprite.destroy instead.
* 
* @method Phaser.Sprite#kill
* @memberof Phaser.Sprite
* @return (Phaser.Sprite) This instance.
*/
Phaser.Sprite.prototype.kill = function() {

    this.alive = false;
    this.exists = false;
    this.visible = false;

    if (this.events)
    {
        this.events.onKilled.dispatch(this);
    }

    return this;

}

/**
* Destroys the Sprite. This removes it from its parent group, destroys the input, event and animation handlers if present
* and nulls its reference to game, freeing it up for garbage collection.
* 
* @method Phaser.Sprite#destroy
* @memberof Phaser.Sprite
*/
Phaser.Sprite.prototype.destroy = function() {

    if (this.group)
    {
        this.group.remove(this);
    }

    if (this.input)
    {
        this.input.destroy();
    }

    if (this.events)
    {
        this.events.destroy();
    }

    if (this.animations)
    {
        this.animations.destroy();
    }

    this.alive = false;
    this.exists = false;
    this.visible = false;

    this.game = null;

}

/**
* Damages the Sprite, this removes the given amount from the Sprites health property.
* If health is then taken below zero Sprite.kill is called.
* 
* @method Phaser.Sprite#damage
* @memberof Phaser.Sprite
* @param {number} amount - The amount to subtract from the Sprite.health value.
* @return (Phaser.Sprite) This instance.
*/
Phaser.Sprite.prototype.damage = function(amount) {

    if (this.alive)
    {
        this.health -= amount;

        if (this.health < 0)
        {
            this.kill();
        }
    }

    return this;

}

/**
* Resets the Sprite. This places the Sprite at the given x/y world coordinates and then
* sets alive, exists, visible and renderable all to true. Also resets the outOfBounds state and health values.
* If the Sprite has a physics body that too is reset.
* 
* @method Phaser.Sprite#reset
* @memberof Phaser.Sprite
* @param {number} x - The x coordinate (in world space) to position the Sprite at.
* @param {number} y - The y coordinate (in world space) to position the Sprite at.
* @param {number} [health=1] - The health to give the Sprite.
* @return (Phaser.Sprite) This instance.
*/
Phaser.Sprite.prototype.reset = function(x, y, health) {

    if (typeof health === 'undefined') { health = 1; }

    this.x = x;
    this.y = y;
    this.position.x = this.x;
    this.position.y = this.y;
    this.alive = true;
    this.exists = true;
    this.visible = true;
    this.renderable = true;
    this._outOfBoundsFired = false;

    this.health = health;

    if (this.body)
    {
        this.body.reset();
    }

    return this;
    
}

/**
* Brings the Sprite to the top of the display list it is a child of. Sprites that are members of a Phaser.Group are only
* bought to the top of that Group, not the entire display list.
* 
* @method Phaser.Sprite#bringToTop
* @memberof Phaser.Sprite
* @return (Phaser.Sprite) This instance.
*/
Phaser.Sprite.prototype.bringToTop = function() {

    if (this.group)
    {
        this.group.bringToTop(this);
    }
    else
    {
        this.game.world.bringToTop(this);
    }

    return this;

}

/**
* Play an animation based on the given key. The animation should previously have been added via sprite.animations.add()
* If the requested animation is already playing this request will be ignored. If you need to reset an already running animation do so directly on the Animation object itself.
* 
* @method Phaser.Sprite#play
* @memberof Phaser.Sprite
* @param {string} name - The name of the animation to be played, e.g. "fire", "walk", "jump".
* @param {number} [frameRate=null] - The framerate to play the animation at. The speed is given in frames per second. If not provided the previously set frameRate of the Animation is used.
* @param {boolean} [loop=false] - Should the animation be looped after playback. If not provided the previously set loop value of the Animation is used.
* @param {boolean} [killOnComplete=false] - If set to true when the animation completes (only happens if loop=false) the parent Sprite will be killed.
* @return {Phaser.Animation} A reference to playing Animation instance.
*/
Phaser.Sprite.prototype.play = function (name, frameRate, loop, killOnComplete) {

    if (this.animations)
    {
        return this.animations.play(name, frameRate, loop, killOnComplete);
    }

}

/**
* Indicates the rotation of the Sprite, in degrees, from its original orientation. Values from 0 to 180 represent clockwise rotation; values from 0 to -180 represent counterclockwise rotation.
* Values outside this range are added to or subtracted from 360 to obtain a value within the range. For example, the statement player.angle = 450 is the same as player.angle = 90.
* If you wish to work in radians instead of degrees use the property Sprite.rotation instead.
* @name Phaser.Sprite#angle
* @property {number} angle - Gets or sets the Sprites angle of rotation in degrees.
*/
Object.defineProperty(Phaser.Sprite.prototype, 'angle', {

    get: function() {
        return Phaser.Math.wrapAngle(Phaser.Math.radToDeg(this.rotation));
    },

    set: function(value) {
        this.rotation = Phaser.Math.degToRad(Phaser.Math.wrapAngle(value));
    }

});

/**
* @name Phaser.Sprite#frame
* @property {number} frame - Gets or sets the current frame index and updates the Texture Cache for display.
*/
Object.defineProperty(Phaser.Sprite.prototype, "frame", {
    
    get: function () {
        return this.animations.frame;
    },

    set: function (value) {
        this.animations.frame = value;
    }

});

/**
* @name Phaser.Sprite#frameName
* @property {string} frameName - Gets or sets the current frame name and updates the Texture Cache for display.
*/
Object.defineProperty(Phaser.Sprite.prototype, "frameName", {
    
    get: function () {
        return this.animations.frameName;
    },

    set: function (value) {
        this.animations.frameName = value;
    }

});

/**
* @name Phaser.Sprite#inCamera
* @property {boolean} inCamera - Is this sprite visible to the camera or not?
* @readonly
*/
Object.defineProperty(Phaser.Sprite.prototype, "inCamera", {
    
    get: function () {
        return this._cache.cameraVisible;
    }

});

/**
* The width of the sprite in pixels, setting this will actually modify the scale to acheive the value desired.
* If you wish to crop the Sprite instead see the Sprite.crop value.
*
* @name Phaser.Sprite#width
* @property {number} width - The width of the Sprite in pixels.
*/
Object.defineProperty(Phaser.Sprite.prototype, 'width', {

    get: function() {
        return this.scale.x * this.currentFrame.width;
    },

    set: function(value) {

        this.scale.x = value / this.currentFrame.width;
        this._cache.scaleX = value / this.currentFrame.width;
        this._width = value;

    }

});

/**
* The height of the sprite in pixels, setting this will actually modify the scale to acheive the value desired.
* If you wish to crop the Sprite instead see the Sprite.crop value.
*
* @name Phaser.Sprite#height
* @property {number} height - The height of the Sprite in pixels.
*/
Object.defineProperty(Phaser.Sprite.prototype, 'height', {

    get: function() {
        return this.scale.y * this.currentFrame.height;
    },

    set: function(value) {

        this.scale.y = value / this.currentFrame.height;
        this._cache.scaleY = value / this.currentFrame.height;
        this._height = value;

    }

});

/**
* By default a Sprite won't process any input events at all. By setting inputEnabled to true the Phaser.InputHandler is
* activated for this Sprite instance and it will then start to process click/touch events and more.
*
* @name Phaser.Sprite#inputEnabled
* @property {boolean} inputEnabled - Set to true to allow this Sprite to receive input events, otherwise false.
*/
Object.defineProperty(Phaser.Sprite.prototype, "inputEnabled", {
    
    get: function () {

        return (this.input.enabled);

    },

    set: function (value) {

        if (value)
        {
            if (this.input.enabled == false)
            {
                this.input.start();
            }
        }
        else
        {
            if (this.input.enabled)
            {
                this.input.stop();
            }
        }

    }

});
