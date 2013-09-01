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

    this.worldView = new Phaser.Rectangle(x, y, this.width, this.height);

    //  Edge points
    this.topLeft = new Phaser.Point(x, y);
    this.topRight = new Phaser.Point(x + this.width, y);
    this.bottomRight = new Phaser.Point(x + this.width, y + this.height);
    this.bottomLeft = new Phaser.Point(x, y + this.height);

    this.offset = new Phaser.Point();

    //  help avoid gc spikes by using temp. vars
    this._a00 = 0;
    this._a01 = 0;
    this._a02 = 0;
    this._a10 = 0;
    this._a11 = 0;
    this._a12 = 0;
    this._id = 0;

};

Phaser.Sprite.prototype = Object.create(PIXI.Sprite.prototype);
Phaser.Sprite.prototype.constructor = Phaser.Sprite;

/**
 * Automatically called after update() by the game loop for all 'alive' objects.
 */
Phaser.Sprite.prototype.update = function() {

    this.animations.update();

    this.worldView.setTo(this._x, this._y, this.width, this.height);

    this.position.x = this._x - (this.game.world.camera.x * this.scrollFactor.x);
    this.position.y = this._y - (this.game.world.camera.y * this.scrollFactor.y);

    //  Update the edge points (sx, sy)
    this.offset.setTo(this.x - (this.anchor.x * this.width), this.y - (this.anchor.y * this.height));

    // var sx = s.x - offsetX;
    // var sy = s.y - offsetY;

    //  top left
    this.getLocalPosition(this.topLeft, this.offset.x, this.offset.y);
    // var p1 = getLocalPosition(sx, sy, s);

    //  top right
    this.getLocalPosition(this.topRight, this.offset.x + this.width, this.offset.y);
    // var p2 = getLocalPosition(sx + s.width, sy, s);

    //  bottom left
    this.getLocalPosition(this.bottomLeft, this.offset.x, this.offset.y + this.height);
    // var p3 = getLocalPosition(sx, sy + s.height, s);

    //  bottom right
    this.getLocalPosition(this.bottomRight, this.offset.x + this.width, this.offset.y + this.height);
    // var p4 = getLocalPosition(sx + s.width, sy + s.height, s);

    // p1.add(s.x, s.y);
    // p2.add(s.x, s.y);
    // p3.add(s.x, s.y);
    // p4.add(s.x, s.y);

    // this.checkBounds();

}

Phaser.Sprite.prototype.getLocalPosition = function(p, x, y) {

    this._a00 = this.worldTransform[0];  //  scaleX
    this._a01 = this.worldTransform[1];  //  skewY
    this._a02 = this.worldTransform[2];  //  translateX
    this._a10 = this.worldTransform[3];  //  skewX
    this._a11 = this.worldTransform[4];  //  scaleY
    this._a12 = this.worldTransform[5];  //  translateY

    this._a01 *= -1;
    this._a10 *= -1;

    this._id = 1 / (this._a00 * this._a11 + this._a01 * -this._a10);

    p.x = (this._a11 * this._id * x + -this._a01 * this._id * y + (this._a12 * this._a01 - this._a02 * this._a11) * this._id) * this.scale.x;
    p.y = (this._a00 * this._id * y + -this._a10 * this._id * x + (-this._a12 * this._a00 + this._a02 * this._a10) * this._id) * this.scale.y;
    p.add(this.x, this.y);

    return p;

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
        this.worldView.x = value;
    	this._x = value;
    }

});

Object.defineProperty(Phaser.Sprite.prototype, 'y', {

    get: function() {
        return this._y;
    },

    set: function(value) {
        this.worldView.y = value;
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

