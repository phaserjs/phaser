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

    // this.events = new Phaser.Components.Events(this);

    /**
     * This manages animations of the sprite. You can modify animations through it. (see AnimationManager)
     * @type AnimationManager
     */
    this.animations = new Phaser.AnimationManager(this);

	PIXI.DisplayObjectContainer.call(this);

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
     * The width of the sprite (this is initially set by the texture)
     *
     * @property _width
     * @type Number
     * @private
     */
    // this._width = 0;

    /**
     * The height of the sprite (this is initially set by the texture)
     *
     * @property _height
     * @type Number
     * @private
     */
    // this._height = 0;

	/**
	 * The texture that the sprite is using
	 *
	 * @property texture
	 * @type Texture
	 */
	this.texture = PIXI.TextureCache[key];

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

	/**
	 * The blend mode of sprite.
	 * currently supports PIXI.blendModes.NORMAL and PIXI.blendModes.SCREEN
	 *
	 * @property blendMode
	 * @type Number
	 */
	this.blendMode = PIXI.blendModes.NORMAL;

    this._x = x;
    this._y = y;

    this.updateFrame = true;
	this.renderable = true;

	this.position.x = x;
	this.position.y = y;

    //  Replaces the PIXI.Point with a slightly more flexible one
    this.scale = new Phaser.Point(1, 1);

    this.scrollFactor = new Phaser.Point(1, 1);

    // this.worldView = new Phaser.Rectangle(x, y, this.width, this.height);

    //  Edge points
    this.offset = new Phaser.Point();
    this.topLeft = new Phaser.Point();
    this.topRight = new Phaser.Point();
    this.bottomRight = new Phaser.Point();
    this.bottomLeft = new Phaser.Point();

    this.getLocalPosition(this.topLeft, this.offset.x, this.offset.y);
    this.getLocalPosition(this.topRight, this.offset.x + this.width, this.offset.y);
    this.getLocalPosition(this.bottomLeft, this.offset.x, this.offset.y + this.height);
    this.getLocalPosition(this.bottomRight, this.offset.x + this.width, this.offset.y + this.height);

    this.bounds = new Phaser.Rectangle(x, y, this.width, this.height);

    this._dirty = false;

    //  transform cache
    this._a00 = 0;
    this._a01 = 0;
    this._a02 = 0;
    this._a10 = 0;
    this._a11 = 0;
    this._a12 = 0;
    this._id = 0;
    this._left = null;
    this._right = null;
    this._top = null;
    this._bottom = null;

    //  The actual scale X value based on the worldTransform
    this._sx = 0;
    //  The actual scale Y value based on the worldTransform
    this._sy = 0;
    //  The width of the image, based on the un-modified frame size multiplied by the final calculated scale size
    this._sw = 0;
    //  The height of the image, based on the un-modified frame size multiplied by the final calculated scale size
    this._sh = 0;

};

Phaser.Sprite.prototype = Object.create(PIXI.Sprite.prototype);
Phaser.Sprite.prototype.constructor = Phaser.Sprite;

/**
 * Automatically called by the game loop.
 */
Phaser.Sprite.prototype.update = function() {

    this._dirty = false;

    this.animations.update();

    //  |a c tx|
    //  |b d ty|
    //  |0 0  1|

        this.position.x = this._x - (this.game.world.camera.x * this.scrollFactor.x);
        this.position.y = this._y - (this.game.world.camera.y * this.scrollFactor.y);


    //  Cache our transform values
    // if (this.worldTransform[0] != this._a00 || this.worldTransform[1] != this._a01)
    // {
        this._a00 = this.worldTransform[0];  //  scaleX         a
        this._a01 = this.worldTransform[1];  //  skewY          c
        this._sx = Math.sqrt((this._a00 * this._a00) + (this._a01 * this._a01));
        this._a01 *= -1;
        this._dirty = true;
    // }

    // if (this.worldTransform[3] != this._a10 || this.worldTransform[4] != this._a11)
    // {
        this._a10 = this.worldTransform[3];  //  skewX          b
        this._a11 = this.worldTransform[4];  //  scaleY         d
        this._sy = Math.sqrt((this._a10 * this._a10) + (this._a11 * this._a11));
        this._a10 *= -1;
        this._dirty = true;
    // }

   // if (this.worldTransform[2] != this._a02 || this.worldTransform[5] != this._a12)
   // {
        this._a02 = this.worldTransform[2];  //  translateX     tx
        this._a12 = this.worldTransform[5];  //  translateY     ty
        // this._a02 -= (this.game.world.camera.x * this.scrollFactor.x);
        // this._a12 -= (this.game.world.camera.y * this.scrollFactor.y);
//        this._dirty = true;
//    }

    //  If the frame has changed we ought to set _dirty
    this._sw = this.texture.frame.width * this._sx;
    this._sh = this.texture.frame.height * this._sy;

    //if (this._dirty)
    //{
        this._id = 1 / (this._a00 * this._a11 + this._a01 * -this._a10);

        //  Update our bounds
        this.updateBounds();

        this.visible = this.inCamera(this.game.world.camera.screenView);
    //}

    //  Check our bounds

}

Phaser.Sprite.prototype.updateBounds = function() {

    //  Update the edge points
    this.offset.setTo(this._a02 - (this.anchor.x * this._sw), this._a12 - (this.anchor.y * this._sh));

    this.getLocalPosition(this.topLeft, this.offset.x, this.offset.y);
    this.getLocalPosition(this.topRight, this.offset.x + this._sw, this.offset.y);
    this.getLocalPosition(this.bottomLeft, this.offset.x, this.offset.y + this._sh);
    this.getLocalPosition(this.bottomRight, this.offset.x + this._sw, this.offset.y + this._sh);

    this._left = Phaser.Math.min(this.topLeft.x, this.topRight.x, this.bottomLeft.x, this.bottomRight.x);
    this._right = Phaser.Math.max(this.topLeft.x, this.topRight.x, this.bottomLeft.x, this.bottomRight.x);
    this._top = Phaser.Math.min(this.topLeft.y, this.topRight.y, this.bottomLeft.y, this.bottomRight.y);
    this._bottom = Phaser.Math.max(this.topLeft.y, this.topRight.y, this.bottomLeft.y, this.bottomRight.y);

    this.bounds.setTo(this._left, this._top, this._right - this._left, this._bottom - this._top);

}

Phaser.Sprite.prototype.inCamera = function(cameraRect) {

    return Phaser.Rectangle.intersects(cameraRect, this.bounds, 0);

}

Phaser.Sprite.prototype.getLocalPosition = function(p, x, y) {

    p.x = ((this._a11 * this._id * x + -this._a01 * this._id * y + (this._a12 * this._a01 - this._a02 * this._a11) * this._id) * this._sx) + this._a02;
    p.y = ((this._a00 * this._id * y + -this._a10 * this._id * x + (-this._a12 * this._a00 + this._a02 * this._a10) * this._id) * this._sy) + this._a12;

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

Object.defineProperty(Phaser.Sprite.prototype, 'x', {

    get: function() {
        return this._x;
    },

    set: function(value) {
        // this.worldView.x = value;
    	this._x = value;
    }

});

Object.defineProperty(Phaser.Sprite.prototype, 'y', {

    get: function() {
        return this._y;
    },

    set: function(value) {
        // this.worldView.y = value;
    	this._y = value;
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

