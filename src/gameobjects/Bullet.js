/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Warning: Bullet is an experimental object that we don't advise using for now.
*
* A Bullet is like a stripped-down Sprite, useful for when you just need to get something moving around the screen quickly with little of the extra
* features that a Sprite supports.
* Bullet is MISSING the following:
*
* animation, all input events, crop support, health/damage, loadTexture
*
* @class Phaser.Bullet
* @constructor
* @param {Phaser.Game} game - Current game instance.
* @param {number} x - X position of the new bullet.
* @param {number} y - Y position of the new bullet.
* @param {string|Phaser.RenderTexture|PIXI.Texture} key - This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture or PIXI.Texture.
* @param {string|number} frame - If this Sprite is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
*/
Phaser.Bullet = function (game, x, y, key, frame) {

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
    * @property {Description} group - Description.
   	* @default
   	*/
    this.group = null;

    /**
     * @property {string} name - The user defined name given to this Sprite.
     * @default
     */
    this.name = '';

    /**
	* @property {Description} type - Description.
	*/
    this.type = Phaser.BULLET;

    /**
	* @property {number} renderOrderID - Description.
	* @default
	*/
    this.renderOrderID = -1;

    /**
    * If you would like the Sprite to have a lifespan once 'born' you can set this to a positive value. Handy for particles, bullets, etc.
	* The lifespan is decremented by game.time.elapsed each update, once it reaches zero the kill() function is called.
	* @property {number} lifespan
	* @default
	*/    
    this.lifespan = 0;

    /**
    * @property {Events} events - The Signals you can subscribe to that are dispatched when certain things happen on this Sprite or its components
    */
    this.events = new Phaser.Events(this);

    /**
    *  @property {Description} key - Description.
    */
    this.key = key;

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
        }

        PIXI.Sprite.call(this, PIXI.TextureCache[key]);

        if (this.game.cache.isSpriteSheet(key))
        {
        	/*
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
            */
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
    * @property {Phaser.Point} anchor
    */
    this.anchor = new Phaser.Point();

    /**
    * @property {number} x - Description.
    */
    this.x = x;
    
    /**
    * @property {number} y - Description.
    */
    this.y = y;

    /**
    * @property {Description} position - Description.
    */
	this.position.x = x;
	this.position.y = y;

    /**
    * Should this Sprite be automatically culled if out of range of the camera?
    * A culled sprite has its visible property set to 'false'.
    * Note that this check doesn't look at this Sprites children, which may still be in camera range.
    * So you should set autoCull to false if the Sprite will have children likely to still be in camera range.
    *
    * @property {boolean} autoCull
    * @default
    */
    this.autoCull = false;

    /**
    * @property {Phaser.Point} scale - Replaces the PIXI.Point with a slightly more flexible one.
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

        boundsX: 0, boundsY: 0,

        //  If this sprite visible to the camera (regardless of being set to visible or not)
        cameraVisible: true

    };
  
    /**
    * @property {Phaser.Point} offset - Corner point defaults.
    */    
    this.offset = new Phaser.Point;
    
    /**
    * @property {Phaser.Point} center - Description.
    */
    this.center = new Phaser.Point(x + Math.floor(this._cache.width / 2), y + Math.floor(this._cache.height / 2));
   
    /**
    * @property {Phaser.Point} topLeft - Description.
    */
    this.topLeft = new Phaser.Point(x, y);
    
    /**
    * @property {Phaser.Point} topRight - Description.
    */
    this.topRight = new Phaser.Point(x + this._cache.width, y);
    
    /**
    * @property {Phaser.Point} bottomRight - Description.
    */
    this.bottomRight = new Phaser.Point(x + this._cache.width, y + this._cache.height);
    
    /**
    * @property {Phaser.Point} bottomLeft - Description.
    */
    this.bottomLeft = new Phaser.Point(x, y + this._cache.height);
    
    /**
    * @property {Phaser.Rectangle} bounds - Description.
    */
    this.bounds = new Phaser.Rectangle(x, y, this._cache.width, this._cache.height);

    /**
    * @property {Phaser.Physics.Arcade.Body} body - Set-up the physics body.
    */
    this.body = new Phaser.Physics.Arcade.Body(this);

    /**
    * @property {Description} inWorld - World bounds check.
    */
    this.inWorld = Phaser.Rectangle.intersects(this.bounds, this.game.world.bounds);
    
    /**
    * @property {number} inWorldThreshold - World bounds check.
    * @default
    */
    this.inWorldThreshold = 0;

    /**
    * @property {boolean} outOfBoundsKill - Kills this sprite as soon as it goes outside of the World bounds.
    * @default
    */
    this.outOfBoundsKill = false;
    
    /**
    * @property {boolean} _outOfBoundsFired - Description.
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

};

Phaser.Bullet.prototype = Object.create(PIXI.Sprite.prototype);
Phaser.Bullet.prototype.constructor = Phaser.Bullet;

/**
* Automatically called by World.preUpdate. You can create your own update in Objects that extend Phaser.Sprite.
* @method Phaser.Sprite.prototype.preUpdate
*/
Phaser.Bullet.prototype.preUpdate = function() {

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

    this.prevX = this.x;
    this.prevY = this.y;

    //  |a c tx|
    //  |b d ty|
    //  |0 0  1|

    if (this.worldTransform[1] != this._cache.i01 || this.worldTransform[3] != this._cache.i10)
    {
        this._cache.a00 = this.worldTransform[0];  //  scaleX         a
        this._cache.a01 = this.worldTransform[1];  //  skewY          c
        this._cache.a10 = this.worldTransform[3];  //  skewX          b
        this._cache.a11 = this.worldTransform[4];  //  scaleY         d

        this._cache.i01 = this.worldTransform[1];  //  skewY          c (remains non-modified for input checks)
        this._cache.i10 = this.worldTransform[3];  //  skewX          b (remains non-modified for input checks)

        this._cache.scaleX = Math.sqrt((this._cache.a00 * this._cache.a00) + (this._cache.a01 * this._cache.a01)); // round this off a bit?
        this._cache.scaleY = Math.sqrt((this._cache.a10 * this._cache.a10) + (this._cache.a11 * this._cache.a11)); // round this off a bit?

        this._cache.a01 *= -1;
        this._cache.a10 *= -1;

        this._cache.dirty = true;
    }

    if (this.worldTransform[2] != this._cache.a02 || this.worldTransform[5] != this._cache.a12)
    {
        this._cache.a02 = this.worldTransform[2];  //  translateX     tx
        this._cache.a12 = this.worldTransform[5];  //  translateY     ty
        this._cache.dirty = true;
    }

    //  Re-run the camera visibility check
    if (this._cache.dirty)
    {
        this._cache.cameraVisible = Phaser.Rectangle.intersects(this.game.world.camera.screenView, this.bounds, 0);

        if (this.autoCull == true)
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

    if (this.body)
    {
        this.body.preUpdate();
    }

}

Phaser.Bullet.prototype.postUpdate = function() {

    if (this.exists)
    {
        //  The sprite is positioned in this call, after taking into consideration motion updates and collision
        if (this.body)
        {
            this.body.postUpdate();
        }

        if (this.fixedToCamera)
        {
            this._cache.x = this.game.camera.view.x + this.x;
            this._cache.y = this.game.camera.view.y + this.y;
        }
        else
        {
            this._cache.x = this.x;
            this._cache.y = this.y;
        }

        if (this.position.x != this._cache.x || this.position.y != this._cache.y)
        {
            this.position.x = this._cache.x;
            this.position.y = this._cache.y;
        }
    }

}

Phaser.Bullet.prototype.deltaAbsX = function () {
    return (this.deltaX() > 0 ? this.deltaX() : -this.deltaX());
}

Phaser.Bullet.prototype.deltaAbsY = function () {
    return (this.deltaY() > 0 ? this.deltaY() : -this.deltaY());
}

Phaser.Bullet.prototype.deltaX = function () {
    return this.x - this.prevX;
}

Phaser.Bullet.prototype.deltaY = function () {
    return this.y - this.prevY;
}

/**
* Description.
* 
* @method Phaser.Bullet.prototype.revive
*/
Phaser.Bullet.prototype.revive = function(health) {

    if (typeof health === 'undefined') { health = 1; }

    this.alive = true;
    this.exists = true;
    this.visible = true;
    this.health = health;

    this.events.onRevived.dispatch(this);

}

/**
* Description.
* 
* @method Phaser.Bullet.prototype.kill
*/
Phaser.Bullet.prototype.kill = function() {

    this.alive = false;
    this.exists = false;
    this.visible = false;
    this.events.onKilled.dispatch(this);

}

/**
* Description.
* 
* @method Phaser.Bullet.prototype.destroy
*/
Phaser.Bullet.prototype.destroy = function() {

    if (this.group)
    {
        this.group.remove(this);
    }

    this.events.destroy();

    this.alive = false;
    this.exists = false;
    this.visible = false;

    this.game = null;

}

/**
* Description.
* 
* @method Phaser.Sprite.prototype.reset
*/
Phaser.Bullet.prototype.reset = function(x, y) {

    this.x = x;
    this.y = y;
    this.position.x = this.x;
    this.position.y = this.y;
    this.alive = true;
    this.exists = true;
    this.visible = true;
    this.renderable = true;
    this._outOfBoundsFired = false;

    if (this.body)
    {
        this.body.reset();
    }
    
}

/**
* Description.
*   
* @method Phaser.Sprite.prototype.updateBounds
*/
Phaser.Bullet.prototype.updateBounds = function() {

    //  Update the edge points

    this.offset.setTo(this._cache.a02 - (this.anchor.x * this._cache.width), this._cache.a12 - (this.anchor.y * this._cache.height));

    this.getLocalPosition(this.center, this.offset.x + this._cache.halfWidth, this.offset.y + this._cache.halfHeight);
    this.getLocalPosition(this.topLeft, this.offset.x, this.offset.y);
    this.getLocalPosition(this.topRight, this.offset.x + this._cache.width, this.offset.y);
    this.getLocalPosition(this.bottomLeft, this.offset.x, this.offset.y + this._cache.height);
    this.getLocalPosition(this.bottomRight, this.offset.x + this._cache.width, this.offset.y + this._cache.height);

    this._cache.left = Phaser.Math.min(this.topLeft.x, this.topRight.x, this.bottomLeft.x, this.bottomRight.x);
    this._cache.right = Phaser.Math.max(this.topLeft.x, this.topRight.x, this.bottomLeft.x, this.bottomRight.x);
    this._cache.top = Phaser.Math.min(this.topLeft.y, this.topRight.y, this.bottomLeft.y, this.bottomRight.y);
    this._cache.bottom = Phaser.Math.max(this.topLeft.y, this.topRight.y, this.bottomLeft.y, this.bottomRight.y);

    this.bounds.setTo(this._cache.left, this._cache.top, this._cache.right - this._cache.left, this._cache.bottom - this._cache.top);

    //  This is the coordinate the Bullet was at when the last bounds was created
    this._cache.boundsX = this._cache.x;
    this._cache.boundsY = this._cache.y;

    if (this.inWorld == false)
    {
        //  Bullet WAS out of the screen, is it still?
        this.inWorld = Phaser.Rectangle.intersects(this.bounds, this.game.world.bounds, this.inWorldThreshold);

        if (this.inWorld)
        {
            //  It's back again, reset the OOB check
            this._outOfBoundsFired = false;
        }
    }
    else
    {
        //   Bullet WAS in the screen, has it now left?
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

}

/**
* Description.
* 
* @method Phaser.Bullet.prototype.getLocalPosition
* @param {Description} p - Description.
* @param {number} x - Description.
* @param {number} y - Description.
* @return {Description} Description.
*/
Phaser.Bullet.prototype.getLocalPosition = function(p, x, y) {

    p.x = ((this._cache.a11 * this._cache.id * x + -this._cache.a01 * this._cache.id * y + (this._cache.a12 * this._cache.a01 - this._cache.a02 * this._cache.a11) * this._cache.id) * this._cache.scaleX) + this._cache.a02;
    p.y = ((this._cache.a00 * this._cache.id * y + -this._cache.a10 * this._cache.id * x + (-this._cache.a12 * this._cache.a00 + this._cache.a02 * this._cache.a10) * this._cache.id) * this._cache.scaleY) + this._cache.a12;

    return p;

}

/**
* Description.
* 
* @method Phaser.Bullet.prototype.bringToTop
*/
Phaser.Bullet.prototype.bringToTop = function() {

    if (this.group)
    {
        this.group.bringToTop(this);
    }
    else
    {
        this.game.world.bringToTop(this);
    }

}

/**
* Indicates the rotation of the Bullet, in degrees, from its original orientation. Values from 0 to 180 represent clockwise rotation; values from 0 to -180 represent counterclockwise rotation.
* Values outside this range are added to or subtracted from 360 to obtain a value within the range. For example, the statement player.angle = 450 is the same as player.angle = 90.
* If you wish to work in radians instead of degrees use the property Bullet.rotation instead.
* @name Phaser.Bullet#angle
* @property {number} angle - Gets or sets the Bullets angle of rotation in degrees.
*/
Object.defineProperty(Phaser.Bullet.prototype, 'angle', {

    get: function() {
        return Phaser.Math.wrapAngle(Phaser.Math.radToDeg(this.rotation));
    },

    set: function(value) {
        this.rotation = Phaser.Math.degToRad(Phaser.Math.wrapAngle(value));
    }

});

/**
* Is this sprite visible to the camera or not?
* @returns {boolean}
*/
Object.defineProperty(Phaser.Bullet.prototype, "inCamera", {
    
    get: function () {
        return this._cache.cameraVisible;
    }

});
