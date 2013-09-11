Phaser.Bullet = function (game, x, y, key, frame) {

    x = x || 0;
    y = y || 0;
    key = key || null;
    frame = frame || null;

	this.game = game;

    //  If exists = false then the Sprite isn't updated by the core game loop or physics subsystem at all
    this.exists = true;

    //  This is a handy little var your game can use to determine if a sprite is alive or not, it doesn't effect rendering
    this.alive = true;

    this.group = null;

    this.name = '';

    this.renderOrderID = -1;

    //  If you would like the Sprite to have a lifespan once 'born' you can set this to a positive value. Handy for particles, bullets, etc.
    //  The lifespan is decremented by game.time.elapsed each update, once it reaches zero the kill() function is called.
    this.lifespan = 0;

    this.key = key;

    if (key instanceof Phaser.RenderTexture)
    {
        PIXI.Sprite.call(this, key);

        this.currentFrame = this.game.cache.getTextureFrame(key.name);
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
            if (frame !== null)
            {
                if (typeof frame === 'string')
                {
                    this.currentFrame = this.game.cache.getFrameByName(key, frame);
                }
                else
                {
                    this.currentFrame = this.game.cache.getFrameByIndex(key, frame);
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
     * @property anchor
     * @type Point
     */
    this.anchor = new Phaser.Point();

    this.x = x;
    this.y = y;

	this.position.x = x;
	this.position.y = y;

    /**
     * Should this Sprite be automatically culled if out of range of the camera?
     * A culled sprite has its visible property set to 'false'.
     * Note that this check doesn't look at this Sprites children, which may still be in camera range.
     * So you should set autoCull to false if the Sprite will have children likely to still be in camera range.
     *
     * @property autoCull
     * @type Boolean
     */
    this.autoCull = false;

    //  Replaces the PIXI.Point with a slightly more flexible one
    this.scale = new Phaser.Point(1, 1);

    //  Influence of camera movement upon the position
    this.scrollFactor = new Phaser.Point(1, 1);

    //  A mini cache for storing all of the calculated values
    this._cache = { 

        dirty: false,

        //  Transform cache
        a00: 1, a01: 0, a02: x, a10: 0, a11: 1, a12: y, id: 1, 

        //  Input specific transform cache
        i01: 0, i10: 0, idi: 1,

        //  Bounds check
        left: null, right: null, top: null, bottom: null, 

        //  The previous calculated position inc. camera x/y and scrollFactor
        x: -1, y: -1,

        //  The actual scale values based on the worldTransform
        scaleX: 1, scaleY: 1,

        //  The width/height of the image, based on the un-modified frame size multiplied by the final calculated scale size
        width: this.currentFrame.sourceSizeW, height: this.currentFrame.sourceSizeH,

        //  The actual width/height of the image if from a trimmed atlas, multiplied by the final calculated scale size
        halfWidth: Math.floor(this.currentFrame.sourceSizeW / 2), halfHeight: Math.floor(this.currentFrame.sourceSizeH / 2),

        //  The current frame details
        frameID: this.currentFrame.uuid, frameWidth: this.currentFrame.width, frameHeight: this.currentFrame.height,

        boundsX: 0, boundsY: 0,

        //  If this sprite visible to the camera (regardless of being set to visible or not)
        cameraVisible: true

    };

    this.bounds = new Phaser.Rectangle(x, y, this.currentFrame.sourceSizeW, this.currentFrame.sourceSizeH);

    //  Set-up the physics body
    this.body = new Phaser.Physics.Arcade.Body(this);

    //  World bounds check
    this.inWorld = Phaser.Rectangle.intersects(this.bounds, this.game.world.bounds);
    this.inWorldThreshold = 0;
    this._outOfBoundsFired = false;

};

//  Needed to keep the PIXI.Sprite constructor in the prototype chain (as the core pixi renderer uses an instanceof check sadly)
Phaser.Bullet.prototype = Object.create(PIXI.Sprite.prototype);
Phaser.Bullet.prototype.constructor = Phaser.Bullet;

/**
 * Automatically called by World.update. You can create your own update in Objects that extend Phaser.Bullet.
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

    // this._cache.dirty = false;

    this._cache.x = this.x - (this.game.world.camera.x * this.scrollFactor.x);
    this._cache.y = this.y - (this.game.world.camera.y * this.scrollFactor.y);

    //  If this sprite or the camera have moved then let's update everything
    if (this.position.x != this._cache.x || this.position.y != this._cache.y)
    {
        this.position.x = this._cache.x;
        this.position.y = this._cache.y;
        // this._cache.dirty = true;
    }

    if (this.visible)
    {
        this.renderOrderID = this.game.world.currentRenderOrderID++;

        /*

        //  Only update the values we need
        if (this.worldTransform[0] != this._cache.a00 || this.worldTransform[1] != this._cache.a01)
        {
            this._cache.a00 = this.worldTransform[0];  //  scaleX         a
            this._cache.a01 = this.worldTransform[1];  //  skewY          c
            this._cache.i01 = this.worldTransform[1];  //  skewY          c
            this._cache.scaleX = Math.sqrt((this._cache.a00 * this._cache.a00) + (this._cache.a01 * this._cache.a01)); // round this off a bit?
            this._cache.a01 *= -1;
            this._cache.dirty = true;
        }

        //  Need to test, but probably highly unlikely that a scaleX would happen without effecting the Y skew
        if (this.worldTransform[3] != this._cache.a10 || this.worldTransform[4] != this._cache.a11)
        {
            this._cache.a10 = this.worldTransform[3];  //  skewX          b
            this._cache.i10 = this.worldTransform[3];  //  skewX          b
            this._cache.a11 = this.worldTransform[4];  //  scaleY         d
            this._cache.scaleY = Math.sqrt((this._cache.a10 * this._cache.a10) + (this._cache.a11 * this._cache.a11)); // round this off a bit?
            this._cache.a10 *= -1;
            this._cache.dirty = true;
        }

        if (this.worldTransform[2] != this._cache.a02 || this.worldTransform[5] != this._cache.a12)
        {
            this._cache.a02 = this.worldTransform[2];  //  translateX     tx
            this._cache.a12 = this.worldTransform[5];  //  translateY     ty
            this._cache.dirty = true;
        }

        if (this._cache.dirty)
        {
            this._cache.width = Math.floor(this.currentFrame.sourceSizeW * this._cache.scaleX);
            this._cache.height = Math.floor(this.currentFrame.sourceSizeH * this._cache.scaleY);
            this._cache.halfWidth = Math.floor(this._cache.width / 2);
            this._cache.halfHeight = Math.floor(this._cache.height / 2);

            this._cache.id = 1 / (this._cache.a00 * this._cache.a11 + this._cache.a01 * -this._cache.a10);
            this._cache.idi = 1 / (this._cache.a00 * this._cache.a11 + this._cache.i01 * -this._cache.i10);

            this.updateBounds();
        }
        */
    }
    else
    {
        //  We still need to work out the bounds in case the camera has moved
        //  but we can't use the local or worldTransform to do it, as Pixi resets that if a Sprite is invisible.
        //  So we'll compare against the cached state + new position.
        if (this._cache.dirty && this.visible == false)
        {
            this.bounds.x -= this._cache.boundsX - this._cache.x;
            this._cache.boundsX = this._cache.x;

            this.bounds.y -= this._cache.boundsy - this._cache.y;
            this._cache.boundsY = this._cache.y;
        }
    }

    //  Re-run the camera visibility check
    // if (this._cache.dirty)
    // {
        this._cache.cameraVisible = Phaser.Rectangle.intersects(this.game.world.camera.screenView, this.bounds, 0);

        if (this.autoCull == true)
        {
            this.visible = this._cache.cameraVisible;
        }

        //  Update our physics bounds
        this.body.updateBounds(this.center.x, this.center.y, this._cache.scaleX, this._cache.scaleY);
    // }

    this.body.update();

}

Phaser.Bullet.prototype.revive = function() {

    this.alive = true;
    this.exists = true;
    this.visible = true;
    // this.events.onRevived.dispatch(this);

}

Phaser.Bullet.prototype.kill = function() {

    this.alive = false;
    this.exists = false;
    this.visible = false;
    // this.events.onKilled.dispatch(this);

}

Phaser.Bullet.prototype.reset = function(x, y) {

    this.x = x;
    this.y = y;
    this.position.x = x;
    this.position.y = y;
    this.alive = true;
    this.exists = true;
    this.visible = true;
    this._outOfBoundsFired = false;
    this.body.reset();
    
}

Phaser.Bullet.prototype.updateBounds = function() {

    //  Update the edge points

    // this.bounds.setTo(this._cache.left, this._cache.top, this._cache.right - this._cache.left, this._cache.bottom - this._cache.top);

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
        }
    }

}

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

Object.defineProperty(Phaser.Bullet.prototype, 'angle', {

    get: function() {
        return Phaser.Math.radToDeg(this.rotation);
    },

    set: function(value) {
        this.rotation = Phaser.Math.degToRad(value);
    }

});

Object.defineProperty(Phaser.Bullet.prototype, "inCamera", {
    
    /**
    * Is this sprite visible to the camera or not?
    */
    get: function () {
        return this._cache.cameraVisible;
    }

});

