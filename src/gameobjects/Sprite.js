Phaser.Sprite = function (game, x, y, key, frame) {

    if (typeof x === "undefined") { x = 0; }
    if (typeof y === "undefined") { y = 0; }

    //	if null we ought to set to the phaser logo or something :)
    if (typeof key === "undefined") { key = null; }
    if (typeof frame === "undefined") { frame = null; }

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
	this.anchor = new PIXI.Point();

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

	/**
	 * The width of the sprite (this is initially set by the texture)
	 *
	 * @property _width
	 * @type Number
	 * @private
	 */
	this._width = 0;

	/**
	 * The height of the sprite (this is initially set by the texture)
	 *
	 * @property _height
	 * @type Number
	 * @private
	 */
	this._height = 0;

	// if (texture.baseTexture.hasLoaded)
	// {
		this.updateFrame = true;
	// }

	this.renderable = true;

	this.position.x = x;
	this.position.y = y;

};

Phaser.Sprite.prototype = Object.create(PIXI.Sprite.prototype);
Phaser.Sprite.prototype.constructor = Phaser.Sprite;

/**
 * Automatically called after update() by the game loop for all 'alive' objects.
 */
Phaser.Sprite.prototype.update = function() {

    this.animations.update();
    // this.checkBounds();

}

Object.defineProperty(Phaser.Sprite.prototype, 'x', {

    get: function() {
        return this.position.x;
    },

    set: function(value) {
    	this.position.x = value;
    }

});

Object.defineProperty(Phaser.Sprite.prototype, 'y', {

    get: function() {
        return this.position.y;
    },

    set: function(value) {
    	this.position.y = value;
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

