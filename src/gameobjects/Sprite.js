Phaser.Sprite = function (game, x, y, key, frame) {

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

    this.type = Phaser.SPRITE;

    this.renderOrderID = -1;

    //  If you would like the Sprite to have a lifespan once 'born' you can set this to a positive value. Handy for particles, bullets, etc.
    //  The lifespan is decremented by game.time.elapsed each update, once it reaches zero the kill() function is called.
    this.lifespan = 0;

    /**
     * The Signals you can subscribe to that are dispatched when certain things happen on this Sprite or its components
     * @type Events
     */
    this.events = new Phaser.Events(this);

    /**
     * This manages animations of the sprite. You can modify animations through it. (see AnimationManager)
     * @type AnimationManager
     */
    this.animations = new Phaser.AnimationManager(this);

    /**
     * The Input Handler Component
     * @type InputHandler
     */
    this.input = new Phaser.InputHandler(this);

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
     * @property anchor
     * @type Point
     */
    this.anchor = new Phaser.Point();

    this._cropUUID = null;
    this._cropRect = null;

    this.x = x;
    this.y = y;

    this.prevX = x;
    this.prevY = y;

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

    //  Corner point defaults
    this.offset = new Phaser.Point;
    this.center = new Phaser.Point(x + Math.floor(this._cache.width / 2), y + Math.floor(this._cache.height / 2));
    this.topLeft = new Phaser.Point(x, y);
    this.topRight = new Phaser.Point(x + this._cache.width, y);
    this.bottomRight = new Phaser.Point(x + this._cache.width, y + this._cache.height);
    this.bottomLeft = new Phaser.Point(x, y + this._cache.height);
    this.bounds = new Phaser.Rectangle(x, y, this._cache.width, this._cache.height);

    //  Set-up the physics body
    this.body = new Phaser.Physics.Arcade.Body(this);

    this.velocity = this.body.velocity;
    this.acceleration = this.body.acceleration;

    //  World bounds check
    this.inWorld = Phaser.Rectangle.intersects(this.bounds, this.game.world.bounds);
    this.inWorldThreshold = 0;
    this._outOfBoundsFired = false;

};

//  Needed to keep the PIXI.Sprite constructor in the prototype chain (as the core pixi renderer uses an instanceof check sadly)
Phaser.Sprite.prototype = Object.create(PIXI.Sprite.prototype);
Phaser.Sprite.prototype.constructor = Phaser.Sprite;

/**
 * Automatically called by World.update. You can create your own update in Objects that extend Phaser.Sprite.
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

    if (this.animations.update())
    {
        this._cache.dirty = true;
    }

    if (this.visible)
    {
        this.renderOrderID = this.game.world.currentRenderOrderID++;
    }

    this.prevX = this.x;
    this.prevY = this.y;

    //  |a c tx|
    //  |b d ty|
    //  |0 0  1|

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

    //  Frame updated?
    if (this.currentFrame && this.currentFrame.uuid != this._cache.frameID)
    {
        this._cache.frameWidth = this.texture.frame.width;
        this._cache.frameHeight = this.texture.frame.height;
        this._cache.frameID = this.currentFrame.uuid;
        this._cache.dirty = true;
    }

    if (this._cache.dirty && this.currentFrame)
    {
        this._cache.width = Math.floor(this.currentFrame.sourceSizeW * this._cache.scaleX);
        this._cache.height = Math.floor(this.currentFrame.sourceSizeH * this._cache.scaleY);
        this._cache.halfWidth = Math.floor(this._cache.width / 2);
        this._cache.halfHeight = Math.floor(this._cache.height / 2);

        this._cache.id = 1 / (this._cache.a00 * this._cache.a11 + this._cache.a01 * -this._cache.a10);
        this._cache.idi = 1 / (this._cache.a00 * this._cache.a11 + this._cache.i01 * -this._cache.i10);

        this.updateBounds();
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
        this.body.updateBounds(this.center.x, this.center.y, this._cache.scaleX, this._cache.scaleY);
    }

    this.body.preUpdate();

}

Phaser.Sprite.prototype.postUpdate = function() {

    if (this.exists)
    {
        //  The sprite is positioned in this call, after taking into consideration motion updates and collision
        this.body.postUpdate();

        this._cache.x = this.x - (this.game.world.camera.x * this.scrollFactor.x);
        this._cache.y = this.y - (this.game.world.camera.y * this.scrollFactor.y);

        if (this.position.x != this._cache.x || this.position.y != this._cache.y)
        {
            this.position.x = this._cache.x;
            this.position.y = this._cache.y;
        }
    }

}

Phaser.Sprite.prototype.deltaAbsX = function () {
    return (this.deltaX() > 0 ? this.deltaX() : -this.deltaX());
}

Phaser.Sprite.prototype.deltaAbsY = function () {
    return (this.deltaY() > 0 ? this.deltaY() : -this.deltaY());
}

Phaser.Sprite.prototype.deltaX = function () {
    return this.x - this.prevX;
}

Phaser.Sprite.prototype.deltaY = function () {
    return this.y - this.prevY;
}

/**
 * Moves the sprite so its center is located on the given x and y coordinates.
 * Doesn't change the origin of the sprite.
 */
Phaser.Sprite.prototype.centerOn = function(x, y) {

    this.x = x + (this.x - this.center.x);
    this.y = y + (this.y - this.center.y);

}

Phaser.Sprite.prototype.revive = function() {

    this.alive = true;
    this.exists = true;
    this.visible = true;
    this.events.onRevived.dispatch(this);

}

Phaser.Sprite.prototype.kill = function() {

    this.alive = false;
    this.exists = false;
    this.visible = false;
    this.events.onKilled.dispatch(this);

}

Phaser.Sprite.prototype.reset = function(x, y) {

    this.x = x;
    this.y = y;
    this.position.x = this.x - (this.game.world.camera.x * this.scrollFactor.x);
    this.position.y = this.y - (this.game.world.camera.y * this.scrollFactor.y);
    this.alive = true;
    this.exists = true;
    this.visible = true;
    this._outOfBoundsFired = false;
    this.body.reset();
    
}

Phaser.Sprite.prototype.updateBounds = function() {

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

    //  This is the coordinate the Sprite was at when the last bounds was created
    this._cache.boundsX = this._cache.x;
    this._cache.boundsY = this._cache.y;

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

Phaser.Sprite.prototype.getLocalPosition = function(p, x, y) {

    p.x = ((this._cache.a11 * this._cache.id * x + -this._cache.a01 * this._cache.id * y + (this._cache.a12 * this._cache.a01 - this._cache.a02 * this._cache.a11) * this._cache.id) * this._cache.scaleX) + this._cache.a02;
    p.y = ((this._cache.a00 * this._cache.id * y + -this._cache.a10 * this._cache.id * x + (-this._cache.a12 * this._cache.a00 + this._cache.a02 * this._cache.a10) * this._cache.id) * this._cache.scaleY) + this._cache.a12;

    return p;

}

Phaser.Sprite.prototype.getLocalUnmodifiedPosition = function(p, x, y) {

    p.x = this._cache.a11 * this._cache.idi * x + -this._cache.i01 * this._cache.idi * y + (this._cache.a12 * this._cache.i01 - this._cache.a02 * this._cache.a11) * this._cache.idi;
    p.y = this._cache.a00 * this._cache.idi * y + -this._cache.i10 * this._cache.idi * x + (-this._cache.a12 * this._cache.a00 + this._cache.a02 * this._cache.i10) * this._cache.idi;

    return p;

}

Phaser.Sprite.prototype.bringToTop = function() {

    if (this.group)
    {
        this.group.bringToTop(this);
    }
    else
    {
        this.game.world.bringToTop(this);
    }

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

/**
* Play an animation based on the given key. The animation should previously have been added via sprite.animations.add()
* If the requested animation is already playing this request will be ignored. If you need to reset an already running animation do so directly on the Animation object itself.
* 
* @method play
* @param {String} name The name of the animation to be played, e.g. "fire", "walk", "jump".
* @param {Number} [frameRate=null] The framerate to play the animation at. The speed is given in frames per second. If not provided the previously set frameRate of the Animation is used.
* @param {Boolean} [loop=null] Should the animation be looped after playback. If not provided the previously set loop value of the Animation is used.
* @return {Phaser.Animation} A reference to playing Animation instance.
*/
Phaser.Sprite.prototype.play = function (name, frameRate, loop) {

    if (this.animations)
    {
        this.animations.play(name, frameRate, loop);
    }

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

Object.defineProperty(Phaser.Sprite.prototype, "crop", {

    /**
    * Get the input enabled state of this Sprite.
    */
    get: function () {

        return this._cropRect;

    },

    /**
    * Set the ability for this sprite to receive input events.
    */
    set: function (value) {

        if (value instanceof Phaser.Rectangle)
        {
            if (this._cropUUID == null)
            {
                this._cropUUID = this.game.rnd.uuid();

                PIXI.TextureCache[this._cropUUID] = new PIXI.Texture(PIXI.BaseTextureCache[this.key], {
                    x: value.x,
                    y: value.y,
                    width: value.width,
                    height: value.height
                });
            }
            else
            {
                PIXI.TextureCache[this._cropUUID].frame = value;
            }

            this._cropRect = value;
            this.setTexture(PIXI.TextureCache[this._cropUUID]);
        }

    }

});

Object.defineProperty(Phaser.Sprite.prototype, "inputEnabled", {
    
    /**
    * Get the input enabled state of this Sprite.
    */
    get: function () {

        return (this.input.enabled);

    },

    /**
    * Set the ability for this sprite to receive input events.
    */
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
