Phaser.Sprite = function (game, x, y, key, frame) {

    x = x || 0;
    y = y || 0;
    //  if null we ought to set to the phaser logo or something :)
    key = key || null;
    frame = frame || null;

	this.game = game;

    this.exists = true;
    this.active = true;
    this.visible = true;
    this.alive = true;

    this.group = null;

    this.name = '';

    if (key)
    {
        PIXI.Sprite.call(this, PIXI.TextureCache[key]);
    }
    else
    {
        //  No texture yet
        console.log('no texture yet');
        PIXI.Sprite.call(this);
    }

    // this.events = new Phaser.Components.Events(this);

    /**
     * This manages animations of the sprite. You can modify animations through it. (see AnimationManager)
     * @type AnimationManager
     */
    this.animations = new Phaser.AnimationManager(this);

	// PIXI.DisplayObjectContainer.call(this);

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

	/**
	 * The texture that the sprite is using
	 *
	 * @property texture
	 * @type Texture
	 */
	// this.texture = PIXI.TextureCache[key];

    if (this.game.cache.isSpriteSheet(key))
    {
        this.animations.loadFrameData(this.game.cache.getFrameData(key));
    }

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

        //  Bounds check
        left: null, right: null, top: null, bottom: null, 

        //  The previous calculated position inc. camera x/y and scrollFactor
        x: -1, y: -1,

        //  The actual scale values based on the worldTransform
        scaleX: 1, scaleY: 1,

        //  The width/height of the image, based on the un-modified frame size multiplied by the final calculated scale size
        width: 0, height: 0,

        //  The current frame index, used to check for bounds updates
        frameWidth: 0, frameHeight: 0,

        boundsX: 0, boundsY: 0,

        //  If this sprite visible to the camera (regardless of being set to visible or not)
        cameraVisible: true

    };

    //  Corner points
    this.offset = new Phaser.Point();
    this.topLeft = new Phaser.Point();
    this.topRight = new Phaser.Point();
    this.bottomRight = new Phaser.Point();
    this.bottomLeft = new Phaser.Point();
    this.bounds = new Phaser.Rectangle(x, y, this.width, this.height);

    this.getLocalPosition(this.topLeft, this.offset.x, this.offset.y);
    this.getLocalPosition(this.topRight, this.offset.x + this.width, this.offset.y);
    this.getLocalPosition(this.bottomLeft, this.offset.x, this.offset.y + this.height);
    this.getLocalPosition(this.bottomRight, this.offset.x + this.width, this.offset.y + this.height);

};

//  Needed to keep the PIXI.Sprite constructor in the prototype chain (as the core pixi renderer uses an instanceof check sadly)
Phaser.Sprite.prototype = Object.create(PIXI.Sprite.prototype);
Phaser.Sprite.prototype.constructor = Phaser.Sprite;

/**
 * Automatically called by the game loop.
 */
Phaser.Sprite.prototype.update = function() {

    this._cache.dirty = false;

    this.animations.update();

    this._cache.x = this.x - (this.game.world.camera.x * this.scrollFactor.x);
    this._cache.y = this.y - (this.game.world.camera.y * this.scrollFactor.y);

    //  If this sprite or the camera have moved then let's update everything
    //  It may have rotated though ...
    if (this.position.x != this._cache.x || this.position.y != this._cache.y)
    {
        this.position.x = this._cache.x;
        this.position.y = this._cache.y;
        this._cache.dirty = true;
    }

    if (this.visible)
    {
        //  |a c tx|
        //  |b d ty|
        //  |0 0  1|

        //  Only update the values we need
        if (this.worldTransform[0] != this._cache.a00 || this.worldTransform[1] != this._cache.a01)
        {
            this._cache.a00 = this.worldTransform[0];  //  scaleX         a
            this._cache.a01 = this.worldTransform[1];  //  skewY          c
            this._cache.scaleX = Math.sqrt((this._cache.a00 * this._cache.a00) + (this._cache.a01 * this._cache.a01));
            this._cache.a01 *= -1;
            this._cache.dirty = true;
        }

        //  Need to test, but probably highly unlikely that a scaleX would happen without effecting the Y skew
        if (this.worldTransform[3] != this._cache.a10 || this.worldTransform[4] != this._cache.a11)
        {
            this._cache.a10 = this.worldTransform[3];  //  skewX          b
            this._cache.a11 = this.worldTransform[4];  //  scaleY         d
            this._cache.scaleY = Math.sqrt((this._cache.a10 * this._cache.a10) + (this._cache.a11 * this._cache.a11));
            this._cache.a10 *= -1;
            this._cache.dirty = true;
        }

        if (this.worldTransform[2] != this._cache.a02 || this.worldTransform[5] != this._cache.a12)
        {
            this._cache.a02 = this.worldTransform[2];  //  translateX     tx
            this._cache.a12 = this.worldTransform[5];  //  translateY     ty
            this._cache.dirty = true;
        }

        if (this._cache.dirty || this.texture.frame.width != this._cache.frameWidth || this.texture.frame.height != this._cache.frameHeight)
        {
            this._cache.frameWidth = this.texture.frame.width;
            this._cache.frameHeight = this.texture.frame.height;

            this._cache.width = this.texture.frame.width * this._cache.scaleX;
            this._cache.height = this.texture.frame.height * this._cache.scaleY;

            this._cache.dirty = true;
        }

        if (this._cache.dirty)
        {
            this._cache.id = 1 / (this._cache.a00 * this._cache.a11 + this._cache.a01 * -this._cache.a10);
            this.updateBounds();
        }
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
    if (this._cache.dirty)
    {
        this._cache.cameraVisible = Phaser.Rectangle.intersects(this.game.world.camera.screenView, this.bounds, 0);

        if (this.autoCull == true)
        {
            this.visible = this._cache.cameraVisible;
        }
    }

    //  Check our bounds

}

Phaser.Sprite.prototype.updateBounds = function() {

    //  Update the edge points

    this.offset.setTo(this._cache.a02 - (this.anchor.x * this._cache.width), this._cache.a12 - (this.anchor.y * this._cache.height));

    this.getLocalPosition(this.topLeft, this.offset.x, this.offset.y);
    this.getLocalPosition(this.topRight, this.offset.x + this._cache.width, this.offset.y);
    this.getLocalPosition(this.bottomLeft, this.offset.x, this.offset.y + this._cache.height);
    this.getLocalPosition(this.bottomRight, this.offset.x + this._cache.width, this.offset.y + this._cache.height);

    this._cache.left = Phaser.Math.min(this.topLeft.x, this.topRight.x, this.bottomLeft.x, this.bottomRight.x);
    this._cache.right = Phaser.Math.max(this.topLeft.x, this.topRight.x, this.bottomLeft.x, this.bottomRight.x);
    this._cache.top = Phaser.Math.min(this.topLeft.y, this.topRight.y, this.bottomLeft.y, this.bottomRight.y);
    this._cache.bottom = Phaser.Math.max(this.topLeft.y, this.topRight.y, this.bottomLeft.y, this.bottomRight.y);

    this.bounds.setTo(this._cache.left, this._cache.top, this._cache.right - this._cache.left, this._cache.bottom - this._cache.top);

    //  This is the coordinate the Sprite was at when the last bounds was created
    this._cache.boundsX = this._cache.x;
    this._cache.boundsY = this._cache.y;

}

Phaser.Sprite.prototype.getLocalPosition = function(p, x, y) {

    p.x = ((this._cache.a11 * this._cache.id * x + -this._cache.a01 * this._cache.id * y + (this._cache.a12 * this._cache.a01 - this._cache.a02 * this._cache.a11) * this._cache.id) * this._cache.scaleX) + this._cache.a02;
    p.y = ((this._cache.a00 * this._cache.id * y + -this._cache.a10 * this._cache.id * x + (-this._cache.a12 * this._cache.a00 + this._cache.a02 * this._cache.a10) * this._cache.id) * this._cache.scaleY) + this._cache.a12;

    return p;

}

Phaser.Sprite.prototype.getBounds = function(rect) {

    rect = rect || new Phaser.Rectangle;

    var left = Phaser.Math.min(this.topLeft.x, this.topRight.x, this.bottomLeft.x, this.bottomRight.x);
    var right = Phaser.Math.max(this.topLeft.x, this.topRight.x, this.bottomLeft.x, this.bottomRight.x);
    var top = Phaser.Math.min(this.topLeft.y, this.topRight.y, this.bottomLeft.y, this.bottomRight.y);
    var bottom = Phaser.Math.max(this.topLeft.y, this.topRight.y, this.bottomLeft.y, this.bottomRight.y);

    rect.x = left;
    rect.y = top;
    rect.width = right - left;
    rect.height = bottom - top;
    
    return rect;

}

Object.defineProperty(Phaser.Sprite.prototype, 'angle', {

    get: function() {
        return Phaser.Math.radToDeg(this.rotation);
    },

    set: function(value) {
        this.rotation = Phaser.Math.degToRad(value);
    }

});

Object.defineProperty(Phaser.Sprite.prototype, "frame", {
    
	/**
    * Get the animation frame number.
    */
    get: function () {
        return this.animations.frame;
    },

	/**
    * Set the animation frame by frame number.
    */
    set: function (value) {
        this.animations.frame = value;
    }

});

Object.defineProperty(Phaser.Sprite.prototype, "frameName", {
    
	/**
    * Get the animation frame name.
    */
    get: function () {
        return this.animations.frameName;
    },

	/**
    * Set the animation frame by frame name.
    */
    set: function (value) {
        this.animations.frameName = value;
    }

});

Object.defineProperty(Phaser.Sprite.prototype, "inCamera", {
    
    /**
    * Is this sprite visible to the camera or not?
    */
    get: function () {
        return this._cache.cameraVisible;
    }

});
