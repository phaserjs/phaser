/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* @class Phaser.Image
*
* @classdesc Create a new `Image` object. An Image is a light-weight object you can use to display anything that doesn't need physics or animation.
* It can still rotate, scale, crop and receive input events. This makes it perfect for logos, backgrounds, simple buttons and other non-Sprite graphics.
*
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {number} x - The x coordinate of the Image. The coordinate is relative to any parent container this Image may be in.
* @param {number} y - The y coordinate of the Image. The coordinate is relative to any parent container this Image may be in.
* @param {string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture} key - The texture used by the Image during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture, BitmapData or PIXI.Texture.
* @param {string|number} frame - If this Image is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
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
    * @property {boolean} exists - If exists = false then the Image isn't updated by the core game loop.
    * @default
    */
    this.exists = true;

    /**
    * @property {string} name - The user defined name given to this Image.
    * @default
    */
    this.name = '';

    /**
    * @property {number} type - The const type of this object.
    * @readonly
    */
    this.type = Phaser.IMAGE;

    /**
    * @property {number} z - The z-depth value of this object within its Group (remember the World is a Group as well). No two objects in a Group can have the same z value.
    */
    this.z = 0;

    /**
    * @property {Phaser.Events} events - The Events you can subscribe to that are dispatched when certain things happen on this Image or its components.
    */
    this.events = new Phaser.Events(this);

    /**
    *  @property {string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture} key - This is the image or texture used by the Image during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture, BitmapData or PIXI.Texture.
    */
    this.key = key;

    PIXI.Sprite.call(this, PIXI.TextureCache['__default']);

    this.position.set(x, y);

    /**
    * @property {Phaser.Point} world - The world coordinates of this Image. This differs from the x/y coordinates which are relative to the Images container.
    */
    this.world = new Phaser.Point(x, y);

    /**
    * Should this Image be automatically culled if out of range of the camera?
    * A culled sprite has its renderable property set to 'false'.
    * Be advised this is quite an expensive operation, as it has to calculate the bounds of the object every frame, so only enable it if you really need it.
    *
    * @property {boolean} autoCull - A flag indicating if the Image should be automatically camera culled or not.
    * @default
    */
    this.autoCull = false;

    /**
    * @property {Phaser.InputHandler|null} input - The Input Handler for this object. Needs to be enabled with image.inputEnabled = true before you can use it.
    */
    this.input = null;

    /**
    * @property {Phaser.Point} cameraOffset - If this object is fixedToCamera then this stores the x/y offset that its drawn at, from the top-left of the camera view.
    */
    this.cameraOffset = new Phaser.Point();

    /**
    * @property {Phaser.Rectangle} cropRect - The Rectangle used to crop the texture. Set this via Sprite.crop. Any time you modify this property directly you must call Sprite.updateCrop.
    * @default
    */
    this.cropRect = null;

    /**
    * A small internal cache:
    * 
    * 0 = previous position.x
    * 1 = previous position.y
    * 2 = previous rotation
    * 3 = renderID
    * 4 = fresh? (0 = no, 1 = yes)
    * 5 = outOfBoundsFired (0 = no, 1 = yes)
    * 6 = exists (0 = no, 1 = yes)
    * 7 = fixed to camera (0 = no, 1 = yes)
    * 8 = destroy phase? (0 = no, 1 = yes)
    * 9 = texture x
    * 10 = texture y
    * 11 = texture width
    * 12 = texture height
    * 13 = texture spriteSourceSizeX
    * 14 = texture spriteSourceSizeY
    * 15 = trim x
    * 16 = trim y
    * @property {Array} _cache
    * @private
    */
    this._cache = [ 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];

    /**
    * @property {Phaser.Rectangle} _bounds - Internal cache var.
    * @private
    */
    this._bounds = new Phaser.Rectangle();

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

    this.loadTexture(key, frame);

};

Phaser.Image.prototype = Object.create(PIXI.Sprite.prototype);
Phaser.Image.prototype.constructor = Phaser.Image;

/**
* Automatically called by World.preUpdate.
*
* @method Phaser.Image#preUpdate
* @memberof Phaser.Image
*/
Phaser.Image.prototype.preUpdate = function() {

    this._cache[0] = this.world.x;
    this._cache[1] = this.world.y;
    this._cache[2] = this.rotation;

    if (!this.exists || !this.parent.exists)
    {
        this._cache[3] = -1;
        return false;
    }

    if (this.autoCull)
    {
        //  Won't get rendered but will still get its transform updated
        this.renderable = this.game.world.camera.screenView.intersects(this.getBounds());
    }

    this.world.setTo(this.game.camera.x + this.worldTransform[2], this.game.camera.y + this.worldTransform[5]);

    if (this.visible)
    {
        this._cache[3] = this.game.stage.currentRenderOrderID++;
    }

    //  Update any Children
    for (var i = 0, len = this.children.length; i < len; i++)
    {
        this.children[i].preUpdate();
    }

    return true;

};

/**
* Override and use this function in your own custom objects to handle any update requirements you may have.
*
* @method Phaser.Image#update
* @memberof Phaser.Image
*/
Phaser.Image.prototype.update = function() {

};

/**
* Internal function called by the World postUpdate cycle.
*
* @method Phaser.Image#postUpdate
* @memberof Phaser.Image
*/
Phaser.Image.prototype.postUpdate = function() {

    if (this.key instanceof Phaser.BitmapData)
    {
        this.key.render();
    }

    //  Fixed to Camera?
    if (this._cache[7] === 1)
    {
        this.position.x = (this.game.camera.view.x + this.cameraOffset.x) / this.game.camera.scale.x;
        this.position.y = (this.game.camera.view.y + this.cameraOffset.y) / this.game.camera.scale.y;
    }

    //  Update any Children
    for (var i = 0, len = this.children.length; i < len; i++)
    {
        this.children[i].postUpdate();
    }

};

/**
* Changes the Texture the Image is using entirely. The old texture is removed and the new one is referenced or fetched from the Cache.
* This causes a WebGL texture update, so use sparingly or in low-intensity portions of your game.
*
* @method Phaser.Image#loadTexture
* @memberof Phaser.Image
* @param {string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture} key - This is the image or texture used by the Image during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture, BitmapData or PIXI.Texture.
* @param {string|number} frame - If this Image is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
*/
Phaser.Image.prototype.loadTexture = function (key, frame) {

    frame = frame || 0;
    
    this.key = key;

    this._frame = 0;
    this._frameName = '';

    if (key instanceof Phaser.RenderTexture)
    {
        this.key = key.key;
        this.setTexture(key);
    }
    else if (key instanceof Phaser.BitmapData)
    {
        this.setTexture(key.texture);
    }
    else if (key instanceof PIXI.Texture)
    {
        this.setTexture(key);
    }
    else
    {
        if (key === null || typeof key === 'undefined')
        {
            this.key = '__default';
            this.setTexture(PIXI.TextureCache[this.key]);
        }
        else if (typeof key === 'string' && !this.game.cache.checkImageKey(key))
        {
            this.key = '__missing';
            this.setTexture(PIXI.TextureCache[this.key]);
        }
        else
        {
            this.setTexture(new PIXI.Texture(PIXI.BaseTextureCache[this.key]));

            var frameData = this.game.cache.getFrameData(this.key);

            if (frameData)
            {
                if (typeof frame === 'string')
                {
                    this._frameName = frame;
                    this.setFrame(frameData.getFrameByName(frame));
                }
                else
                {
                    this._frame = frame;
                    this.setFrame(frameData.getFrame(frame));
                }
            }
        }
    }

};

/**
* Resets the Texture frame dimensions that the Image uses for rendering.
*
* @method Phaser.Image#resetFrame
* @memberof Phaser.Image
*/
Phaser.Image.prototype.resetFrame = function() {

    this.texture.frame.x = this._cache[9];
    this.texture.frame.y = this._cache[10];
    this.texture.frame.width = this._cache[11];
    this.texture.frame.height = this._cache[12];

    if (this.texture.trim)
    {
        this.texture.trim.x = this._cache[13];
        this.texture.trim.y = this._cache[14];
        this.texture.trim.width = this.texture.frame.width;
        this.texture.trim.height = this.texture.frame.height;
    }

    if (this.game.renderType === Phaser.WEBGL)
    {
        PIXI.WebGLRenderer.updateTextureFrame(this.texture);
    }

};

/**
* Sets the Texture frame the Image uses for rendering.
* This is primarily an internal method used by Image.loadTexture, although you may call it directly.
*
* @method Phaser.Image#setFrame
* @memberof Phaser.Image
* @param {Phaser.Frame} frame - The Frame to be used by the Image texture.
*/
Phaser.Image.prototype.setFrame = function(frame) {

    this._cache[9] = frame.x;
    this._cache[10] = frame.y;
    this._cache[11] = frame.width;
    this._cache[12] = frame.height;
    this._cache[13] = frame.spriteSourceSizeX;
    this._cache[14] = frame.spriteSourceSizeY;

    this.texture.frame.x = frame.x;
    this.texture.frame.y = frame.y;
    this.texture.frame.width = frame.width;
    this.texture.frame.height = frame.height;

    if (frame.trimmed)
    {
        this.texture.trim = { x: frame.spriteSourceSizeX, y: frame.spriteSourceSizeY, width: frame.width, height: frame.height };
    }

    if (this.game.renderType === Phaser.WEBGL)
    {
        PIXI.WebGLRenderer.updateTextureFrame(this.texture);
    }

    if (this.cropRect)
    {
        this.updateCrop();
    }

};

/**
* If you have set a crop rectangle on this Image via Image.crop and since modified the Image.cropRect property (or the rectangle it references)
* then you need to update the crop frame by calling this method.
*
* @method Phaser.Image#updateCrop
* @memberof Phaser.Image
*/
Phaser.Image.prototype.updateCrop = function() {

    if (!this.cropRect)
    {
        return;
    }

    if (this.texture.trim)
    {
        this._cache[15] = this._cache[9] + this.cropRect.x - this._cache[13];

        if (this._cache[15] < this._cache[9])
        {
            this._cache[15] = this._cache[9];
        }

        this._cache[16] = this._cache[10] + this.cropRect.y - this._cache[14];

        if (this._cache[16] < this._cache[10])
        {
            this._cache[16] = this._cache[10];
        }

        this.texture.frame.x = this._cache[15];
        this.texture.frame.y = this._cache[16];

        this._cache[15] = 0;
        this._cache[16] = 0;

        if (this.cropRect.x === 0)
        {
            this._cache[15] = this._cache[13];
        }

        if (this.cropRect.y === 0)
        {
            this._cache[16] = this._cache[14];
        }

        this.texture.frame.width = this.cropRect.width - this._cache[15];
        this.texture.frame.height = this.cropRect.height - this._cache[16];

        this.texture.trim.x = this._cache[15];
        this.texture.trim.y = this._cache[16];
        this.texture.trim.width = this.cropRect.width;
        this.texture.trim.height = this.cropRect.height;
    }
    else
    {
        this.texture.frame.x = this._cache[9] + this.cropRect.x;
        this.texture.frame.y = this._cache[10] + this.cropRect.y;
        this.texture.frame.width = this.cropRect.width;
        this.texture.frame.height = this.cropRect.height;
    }

    if (this.game.renderType === Phaser.WEBGL)
    {
        PIXI.WebGLRenderer.updateTextureFrame(this.texture);
    }

};

/**
* Crop allows you to crop the texture used to display this Image.
* This modifies the core Image texture frame, so the Image width/height properties will adjust accordingly.
* 
* Cropping takes place from the top-left of the Image and can be modified in real-time by either providing an updated rectangle object to Image.crop,
* or by modifying Image.cropRect (or a reference to it) and then calling Image.updateCrop.
* 
* The rectangle object given to this method can be either a Phaser.Rectangle or any object so long as it has public x, y, width and height properties.
* A reference to the rectangle is stored in Image.cropRect unless the `copy` parameter is `true` in which case the values are duplicated to a local object.
*
* @method Phaser.Image#crop
* @memberof Phaser.Image
* @param {Phaser.Rectangle} rect - The Rectangle used during cropping. Pass null or no parameters to clear a previously set crop rectangle.
* @param {boolean} [copy=false] - If false Image.cropRect will be a reference to the given rect. If true it will copy the rect values into a local Image.cropRect object.
*/
Phaser.Image.prototype.crop = function(rect, copy) {

    if (typeof copy === 'undefined') { copy = false; }

    if (rect)
    {
        if (copy && this.cropRect !== null)
        {
            this.cropRect.setTo(rect.x, rect.y, rect.width, rect.height);
        }
        else if (copy && this.cropRect === null)
        {
            this.cropRect = new Phaser.Rectangle(rect.x, rect.y, rect.width, rect.height);
        }
        else
        {
            this.cropRect = rect;
        }

        this.updateCrop();
    }
    else
    {
        this.cropRect = null;
        this.resetFrame();
    }

};

/**
* Brings a 'dead' Image back to life, optionally giving it the health value specified.
* A resurrected Image has its alive, exists and visible properties all set to true.
* It will dispatch the onRevived event, you can listen to Image.events.onRevived for the signal.
*
* @method Phaser.Image#revive
* @memberof Phaser.Image
* @return {Phaser.Image} This instance.
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
* Kills a Image. A killed Image has its alive, exists and visible properties all set to false.
* It will dispatch the onKilled event, you can listen to Image.events.onKilled for the signal.
* Note that killing a Image is a way for you to quickly recycle it in a Image pool, it doesn't free it up from memory.
* If you don't need this Image any more you should call Image.destroy instead.
*
* @method Phaser.Image#kill
* @memberof Phaser.Image
* @return {Phaser.Image} This instance.
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
* Destroys the Image. This removes it from its parent group, destroys the input, event and animation handlers if present
* and nulls its reference to game, freeing it up for garbage collection.
*
* @method Phaser.Image#destroy
* @memberof Phaser.Image
* @param {boolean} [destroyChildren=true] - Should every child of this object have its destroy method called?
*/
Phaser.Image.prototype.destroy = function(destroyChildren) {

    if (this.game === null || this.destroyPhase) { return; }

    if (typeof destroyChildren === 'undefined') { destroyChildren = true; }

    this._cache[8] = 1;

    if (this.parent)
    {
        if (this.parent instanceof Phaser.Group)
        {
            this.parent.remove(this);
        }
        else
        {
            this.parent.removeChild(this);
        }
    }

    if (this.events)
    {
        this.events.destroy();
    }

    if (this.input)
    {
        this.input.destroy();
    }

    var i = this.children.length;

    if (destroyChildren)
    {
        while (i--)
        {
            this.children[i].destroy(destroyChildren);
        }
    }
    else
    {
        while (i--)
        {
            this.removeChild(this.children[i]);
        }
    }

    this.alive = false;
    this.exists = false;
    this.visible = false;

    this.filters = null;
    this.mask = null;
    this.game = null;

    this._cache[8] = 0;

};

/**
* Resets the Image. This places the Image at the given x/y world coordinates and then sets alive, exists, visible and renderable all to true.
*
* @method Phaser.Image#reset
* @memberof Phaser.Image
* @param {number} x - The x coordinate (in world space) to position the Image at.
* @param {number} y - The y coordinate (in world space) to position the Image at.
* @return {Phaser.Image} This instance.
*/
Phaser.Image.prototype.reset = function(x, y) {

    this.world.setTo(x, y);
    this.position.x = x;
    this.position.y = y;
    this.alive = true;
    this.exists = true;
    this.visible = true;
    this.renderable = true;

    return this;

};

/**
* Brings the Image to the top of the display list it is a child of. Images that are members of a Phaser.Group are only
* bought to the top of that Group, not the entire display list.
*
* @method Phaser.Image#bringToTop
* @memberof Phaser.Image
* @return {Phaser.Image} This instance.
*/
Phaser.Image.prototype.bringToTop = function() {

    if (this.parent)
    {
        this.parent.bringToTop(this);
    }

    return this;

};

/**
* Indicates the rotation of the Image, in degrees, from its original orientation. Values from 0 to 180 represent clockwise rotation; values from 0 to -180 represent counterclockwise rotation.
* Values outside this range are added to or subtracted from 360 to obtain a value within the range. For example, the statement player.angle = 450 is the same as player.angle = 90.
* If you wish to work in radians instead of degrees use the property Image.rotation instead. Working in radians is also a little faster as it doesn't have to convert the angle.
*
* @name Phaser.Image#angle
* @property {number} angle - The angle of this Image in degrees.
*/
Object.defineProperty(Phaser.Image.prototype, "angle", {

    get: function() {

        return Phaser.Math.wrapAngle(Phaser.Math.radToDeg(this.rotation));

    },

    set: function(value) {

        this.rotation = Phaser.Math.degToRad(Phaser.Math.wrapAngle(value));

    }

});

/**
* Returns the delta x value. The difference between world.x now and in the previous step.
*
* @name Phaser.Image#deltaX
* @property {number} deltaX - The delta value. Positive if the motion was to the right, negative if to the left.
* @readonly
*/
Object.defineProperty(Phaser.Image.prototype, "deltaX", {

    get: function() {

        return this.world.x - this._cache[0];

    }

});

/**
* Returns the delta y value. The difference between world.y now and in the previous step.
*
* @name Phaser.Image#deltaY
* @property {number} deltaY - The delta value. Positive if the motion was downwards, negative if upwards.
* @readonly
*/
Object.defineProperty(Phaser.Image.prototype, "deltaY", {

    get: function() {

        return this.world.y - this._cache[1];

    }

});

/**
* Returns the delta z value. The difference between rotation now and in the previous step.
*
* @name Phaser.Image#deltaZ
* @property {number} deltaZ - The delta value.
* @readonly
*/
Object.defineProperty(Phaser.Image.prototype, "deltaZ", {

    get: function() {

        return this.rotation - this._cache[2];

    }

});

/**
* Checks if the Image bounds are within the game world, otherwise false if fully outside of it.
*
* @name Phaser.Image#inWorld
* @property {boolean} inWorld - True if the Image bounds is within the game world, even if only partially. Otherwise false if fully outside of it.
* @readonly
*/
Object.defineProperty(Phaser.Image.prototype, "inWorld", {

    get: function() {

        return this.game.world.bounds.intersects(this.getBounds());

    }

});

/**
* Checks if the Image bounds are within the game camera, otherwise false if fully outside of it.
*
* @name Phaser.Image#inCamera
* @property {boolean} inCamera - True if the Image bounds is within the game camera, even if only partially. Otherwise false if fully outside of it.
* @readonly
*/
Object.defineProperty(Phaser.Image.prototype, "inCamera", {

    get: function() {

        return this.game.world.camera.screenView.intersects(this.getBounds());

    }

});

/**
* @name Phaser.Image#frame
* @property {number} frame - Gets or sets the current frame index and updates the Texture for display.
*/
Object.defineProperty(Phaser.Image.prototype, "frame", {

    get: function() {

        return this._frame;

    },

    set: function(value) {

        if (value !== this.frame && this.game.cache.isSpriteSheet(this.key))
        {
            var frameData = this.game.cache.getFrameData(this.key);

            if (frameData && value < frameData.total && frameData.getFrame(value))
            {
                this._frame = value;
                this.setFrame(frameData.getFrame(value));
            }
        }

    }

});

/**
* @name Phaser.Image#frameName
* @property {string} frameName - Gets or sets the current frame by name and updates the Texture for display.
*/
Object.defineProperty(Phaser.Image.prototype, "frameName", {

    get: function() {

        return this._frameName;

    },

    set: function(value) {

        if (value !== this.frameName && this.game.cache.isSpriteSheet(this.key))
        {
            var frameData = this.game.cache.getFrameData(this.key);

            if (frameData && frameData.getFrameByName(value))
            {
                this._frameName = value;
                this.setFrame(frameData.getFrameByName(value));
            }
        }

    }

});

/**
* @name Phaser.Image#renderOrderID
* @property {number} renderOrderID - The render order ID, reset every frame.
* @readonly
*/
Object.defineProperty(Phaser.Image.prototype, "renderOrderID", {

    get: function() {

        return this._cache[3];

    }

});

/**
* By default an Image won't process any input events at all. By setting inputEnabled to true the Phaser.InputHandler is
* activated for this object and it will then start to process click/touch events and more.
*
* @name Phaser.Image#inputEnabled
* @property {boolean} inputEnabled - Set to true to allow this object to receive input events.
*/
Object.defineProperty(Phaser.Image.prototype, "inputEnabled", {

    get: function () {

        return (this.input && this.input.enabled);

    },

    set: function (value) {

        if (value)
        {
            if (this.input === null)
            {
                this.input = new Phaser.InputHandler(this);
                this.input.start();
            }
            else if (this.input && !this.input.enabled)
            {
                this.input.start();
            }
        }
        else
        {
            if (this.input && this.input.enabled)
            {
                this.input.stop();
            }
        }
    }

});

/**
* An Image that is fixed to the camera uses its x/y coordinates as offsets from the top left of the camera. These are stored in Image.cameraOffset.
* Note that the cameraOffset values are in addition to any parent in the display list.
* So if this Image was in a Group that has x: 200, then this will be added to the cameraOffset.x
*
* @name Phaser.Image#fixedToCamera
* @property {boolean} fixedToCamera - Set to true to fix this Image to the Camera at its current world coordinates.
*/
Object.defineProperty(Phaser.Image.prototype, "fixedToCamera", {

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

/**
* Enable or disable texture smoothing for this Image. Only works for bitmap/image textures. Smoothing is enabled by default.
*
* @name Phaser.Image#smoothed
* @property {boolean} smoothed - Set to true to smooth the texture of this Image, or false to disable smoothing (great for pixel art)
*/
Object.defineProperty(Phaser.Image.prototype, "smoothed", {

    get: function () {

        return !this.texture.baseTexture.scaleMode;

    },

    set: function (value) {

        if (value)
        {
            if (this.texture)
            {
                this.texture.baseTexture.scaleMode = 0;
            }
        }
        else
        {
            if (this.texture)
            {
                this.texture.baseTexture.scaleMode = 1;
            }
        }
    }

});

/**
* @name Phaser.Image#destroyPhase
* @property {boolean} destroyPhase - True if this object is currently being destroyed.
*/
Object.defineProperty(Phaser.Image.prototype, "destroyPhase", {

    get: function () {

        return !!this._cache[8];

    }

});
