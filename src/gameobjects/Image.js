/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* An Image is a light-weight {@link Pixi.DisplayObject Display Object} that can be used when physics and animation are not required.
*
* Like other display objects, an Image can still be rotated, scaled, cropped and receive input events.
* This makes it perfect for logos, backgrounds, simple buttons and other non-Sprite graphics.
*
* The documentation uses 'sprite' to generically talk about Images and other Phaser.Sprite objects, which share much of the same behavior.
*
* @class Phaser.Image
* @extends PIXI.Sprite
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
    * @protected
    */
    this.game = game;

    /**
    * An Image is only shown and updated if it exists.
    * @property {boolean} exists
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
    * @protected
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
    * @property {Phaser.AnimationManager} animations - This manages animations of the sprite. You can modify animations through it (see Phaser.AnimationManager)
    */
    this.animations = new Phaser.AnimationManager(this);

    /**
    *  @property {string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture} key - This is the image or texture used by the Image during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture, BitmapData or PIXI.Texture.
    */
    this.key = key;

    PIXI.Sprite.call(this, PIXI.TextureCache['__default']);

    this.transformCallback = this.checkTransform;
    this.transformCallbackContext = this;

    this.position.set(x, y);

    /**
    * The world coordinates of this sprite.
    *
    * This differs from the local x/y coordinates which are relative to the parent.
    *
    * @property {Phaser.Point} world
    */
    this.world = new Phaser.Point(x, y);

    /**
    * Should the sprite be automatically camera culled or not?
    *
    * An auto-culled sprite has its `renderable` property set to 'false' when it leaves the game camera view and 'true'
    * when it reenters the camera view.
    *
    * This is quite an expensive operation, as it has to calculate the bounds of the object every frame, so only enable it if you really need it.
    *
    * @property {boolean} autoCull
    * @default
    */
    this.autoCull = false;

    /**
    * The Input Handler for this object. Must be enabled with `inputEnabled` before use.
    * @property {Phaser.InputHandler|null} input - 
    */
    this.input = null;

    /**
    * Is the sprite 'alive'?
    *
    * This is useful for game logic, but does not affect rendering.
    *
    * @property {boolean} alive.
    * @default
    */
    this.alive = true;

    /**
    * @property {boolean} debug - Handy flag to use with Game.enableStep
    * @default
    */
    this.debug = false;

    /**
    * If this object is `fixedToCamera` then this stores the x/y offset that its drawn at, from the top-left of the camera view.
    * @property {Phaser.Point} cameraOffset
    */
    this.cameraOffset = new Phaser.Point();

    /**
    * The Rectangle used to crop the texture.
    * Set this via {@link Phaser.Image#crop crop} and use {@link Phaser.Image#updateCrop updateCrop} as required.
    * @property {Phaser.Rectangle} cropRect
    * @default
    * @readonly
    */
    this.cropRect = null;

    /**
    * A small internal cache:
    * 0 = previous position.x
    * 1 = previous position.y
    * 2 = previous rotation
    * 3 = renderID
    * 4 = fresh? (0 = no, 1 = yes)
    * 5 = outOfBoundsFired (0 = no, 1 = yes)
    * 6 = exists (0 = no, 1 = yes)
    * 7 = fixed to camera (0 = no, 1 = yes)
    * 8 = destroy phase? (0 = no, 1 = yes)
    * @property {Array} _cache
    * @private
    */
    this._cache = [ 0, 0, 0, 0, 1, 0, 1, 0, 0 ];

    /**
    * @property {Phaser.Rectangle} _crop - Internal cache var.
    * @private
    */
    this._crop = null;

    /**
    * @property {Phaser.Rectangle} _frame - Internal cache var.
    * @private
    */
    this._frame = null;

    /**
    * @property {Phaser.Rectangle} _bounds - Internal cache var.
    * @private
    */
    this._bounds = new Phaser.Rectangle();

    this.loadTexture(key, frame);

};

Phaser.Image.prototype = Object.create(PIXI.Sprite.prototype);
Phaser.Image.prototype.constructor = Phaser.Image;

/**
* Internal function called by the World preUpdate cycle.
*
* @method Phaser.Image#preUpdate
* @memberof Phaser.Image
* @protected
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
        this._bounds.copyFrom(this.getBounds());

        //  Won't get rendered but will still get its transform updated
        this.renderable = this.game.world.camera.screenView.intersects(this._bounds);
    }

    this.world.setTo(this.game.camera.x + this.worldTransform.tx, this.game.camera.y + this.worldTransform.ty);

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
* Override and this method for custom update logic.
*
* If this sprite has any children you should call update on them too.
*
* @method Phaser.Sprite#update
* @memberof Phaser.Sprite
* @protected
*/
Phaser.Image.prototype.update = function() {

};

/**
* Internal function called by the World postUpdate cycle.
*
* @method Phaser.Image#postUpdate
* @memberof Phaser.Image
* @protected
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
* Changes the underlying Texture.
*
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

    var setFrame = true;
    var smoothed = this.smoothed;

    if (key instanceof Phaser.RenderTexture)
    {
        this.key = key.key;
        this.setTexture(key);
    }
    else if (key instanceof Phaser.BitmapData)
    {
        //  This works from a reference, which probably isn't what we need here
        this.setTexture(key.texture);

        if (this.game.cache.getFrameData(key.key, Phaser.Cache.BITMAPDATA))
        {
            setFrame = !this.animations.loadFrameData(this.game.cache.getFrameData(key.key, Phaser.Cache.BITMAPDATA), frame);
        }
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
            console.warn("Texture with key '" + key + "' not found.");
            this.key = '__missing';
            this.setTexture(PIXI.TextureCache[this.key]);
        }
        else
        {
            this.setTexture(new PIXI.Texture(PIXI.BaseTextureCache[key]));

            setFrame = !this.animations.loadFrameData(this.game.cache.getFrameData(key), frame);
        }
    }
    
    this.texture.baseTexture.dirty();

    if (setFrame)
    {
        this._frame = Phaser.Rectangle.clone(this.texture.frame);
    }

    if (!smoothed)
    {
        this.smoothed = false;
    }

};

/**
* Sets the displayed Texture frame bounds.
*
* This is primarily an internal method used by Image.loadTexture.
*
* @method Phaser.Image#setFrame
* @memberof Phaser.Image
* @param {Phaser.Frame} frame - The Frame to be used by the texture.
*/
Phaser.Image.prototype.setFrame = function(frame) {

    this._frame = frame;

    this.texture.frame.x = frame.x;
    this.texture.frame.y = frame.y;
    this.texture.frame.width = frame.width;
    this.texture.frame.height = frame.height;

    this.texture.crop.x = frame.x;
    this.texture.crop.y = frame.y;
    this.texture.crop.width = frame.width;
    this.texture.crop.height = frame.height;

    if (frame.trimmed)
    {
        if (this.texture.trim)
        {
            this.texture.trim.x = frame.spriteSourceSizeX;
            this.texture.trim.y = frame.spriteSourceSizeY;
            this.texture.trim.width = frame.sourceSizeW;
            this.texture.trim.height = frame.sourceSizeH;
        }
        else
        {
            this.texture.trim = { x: frame.spriteSourceSizeX, y: frame.spriteSourceSizeY, width: frame.sourceSizeW, height: frame.sourceSizeH };
        }

        this.texture.width = frame.sourceSizeW;
        this.texture.height = frame.sourceSizeH;
        this.texture.frame.width = frame.sourceSizeW;
        this.texture.frame.height = frame.sourceSizeH;
    }
    else if (!frame.trimmed && this.texture.trim)
    {
        this.texture.trim = null;
    }

    if (this.cropRect)
    {
        this.updateCrop();
    }

    this.texture._updateUvs();

};

/**
* Resets the Texture frame bounds that are used for rendering.
*
* @method Phaser.Image#resetFrame
* @memberof Phaser.Image
*/
Phaser.Image.prototype.resetFrame = function() {

    if (this._frame)
    {
        this.setFrame(this._frame);
    }

};

/**
* Crops the texture used for display. Cropping takes place from the top-left of the sprite.
*
* This method does not create a copy of `rect` by default: the rectangle can shared between
* multiple sprite and updated in real-time. In this case, `updateCrop` must be called after any modifications
* to the shared/non-copied rectangle before the crop will be updated.
*
* The rectangle object can be a Phaser.Rectangle or any object so long as it has public x, y, width and height properties.
*
* @method Phaser.Image#crop
* @memberof Phaser.Image
* @param {?Phaser.Rectangle} rect - The Rectangle used during cropping. Pass null or no parameters to clear a previously set crop rectangle.
* @param {boolean} [copy=false] - If false Sprite.cropRect will be a reference to the given rect. If true it will copy the rect values into a local Sprite.cropRect object.
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
        this._crop = null;
        this.cropRect = null;

        this.resetFrame();
    }

};

/**
* Update the texture crop.
*
* If the rectangle supplied to `crop` has been modified (and was not copied),
* then this method needs to be called to update the internal crop/frame data.
*
* @method Phaser.Image#updateCrop
* @memberof Phaser.Image
*/
Phaser.Image.prototype.updateCrop = function() {

    if (!this.cropRect)
    {
        return;
    }

    this._crop = Phaser.Rectangle.clone(this.cropRect, this._crop);
    this._crop.x += this._frame.x;
    this._crop.y += this._frame.y;

    var cx = Math.max(this._frame.x, this._crop.x);
    var cy = Math.max(this._frame.y, this._crop.y);
    var cw = Math.min(this._frame.right, this._crop.right) - cx;
    var ch = Math.min(this._frame.bottom, this._crop.bottom) - cy;

    this.texture.crop.x = cx;
    this.texture.crop.y = cy;
    this.texture.crop.width = cw;
    this.texture.crop.height = ch;

    this.texture.frame.width = Math.min(cw, this.cropRect.width);
    this.texture.frame.height = Math.min(ch, this.cropRect.height);

    this.texture.width = this.texture.frame.width;
    this.texture.height = this.texture.frame.height;

    this.texture._updateUvs();

};

/**
* Brings a 'dead' sprite back to life.
*
* A resurrected Image has its `alive`, `exists`, and `visible` properties set to true
* and the `onRevived` event will be dispatched.
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
* Kills the sprite.
*
* A killed sprite has its `alive`, `exists`, and `visible` properties all set to false
* and the `onKilled` event will be dispatched.
*
* Killing a sprite is a way to recycle the Image (eg. in a Group/pool) but it doesn't free it from memory.
* Use {@link Phaser.Sprite#destroy} if the sprite is no longer needed.
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
* Destroys the sprite.
*
* This removes it from its parent group, destroys the input, event, and animation handlers if present
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

    if (this.events)
    {
        this.events.onDestroy.dispatch(this);
    }

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

    if (this.animations)
    {
        this.animations.destroy();
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
* Resets the sprite.
*
* This places the sprite at the given x/y world coordinates and then
* sets `alive`, `exists`, `visible`, and `renderable` all to true.
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
* Brings the sprite to the top of the display list (ie. Group) it is a child of.
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
 * Adjust scaling limits, if set, to this Image.
 *
 * @method Phaser.Image#checkTransform
 * @private
 * @param {PIXI.Matrix} wt - The updated worldTransform matrix.
 * @protected
 */
Phaser.Image.prototype.checkTransform = function (wt) {

    if (this.scaleMin)
    {
        if (wt.a < this.scaleMin.x)
        {
            wt.a = this.scaleMin.x;
        }

        if (wt.d < this.scaleMin.y)
        {
            wt.d = this.scaleMin.y;
        }
    }

    if (this.scaleMax)
    {
        if (wt.a > this.scaleMax.x)
        {
            wt.a = this.scaleMax.x;
        }

        if (wt.d > this.scaleMax.y)
        {
            wt.d = this.scaleMax.y;
        }
    }

};

/**
* Sets the scaleMin and scaleMax values.
*
* These values are used to limit how far this Image will scale (either up or down) based on its parent.
* For example if this Image has a minScale value of 1 and its parent has a scale value of 0.5, the 0.5 will be ignored and the scale value of 1 will be used.
* By using these values you can carefully control how Images deal with responsive scaling.
* 
* If only one parameter is given then that value will be used for both scaleMin and scaleMax:
* setScaleMinMax(1) = scaleMin.x, scaleMin.y, scaleMax.x and scaleMax.y all = 1
*
* If only two parameters are given the first is set as scaleMin.x and y and the second as scaleMax.x and y:
* setScaleMinMax(0.5, 2) = scaleMin.x and y = 0.5 and scaleMax.x and y = 2
*
* If you wish to set scaleMin with different values for x and y then either modify Image.scaleMin directly, or pass `null` for the maxX and maxY parameters.
* 
* Call setScaleMinMax(null) to clear both the scaleMin and scaleMax values.
*
* @method Phaser.Image#setScaleMinMax
* @memberof Phaser.Image
* @param {number|null} minX - The minimum horizontal scale value this Image can scale down to.
* @param {number|null} minY - The minimum vertical scale value this Image can scale down to.
* @param {number|null} maxX - The maximum horizontal scale value this Image can scale up to.
* @param {number|null} maxY - The maximum vertical scale value this Image can scale up to.
*/
Phaser.Image.prototype.setScaleMinMax = function (minX, minY, maxX, maxY) {

    if (typeof minY === 'undefined')
    {
        //  1 parameter, set all to it
        minY = maxX = maxY = minX;
    }
    else if (typeof maxX === 'undefined')
    {
        //  2 parameters, the first is min, the second max
        maxX = maxY = minY;
        minY = minX;
    }

    if (minX === null)
    {
        this.scaleMin = null;
    }
    else
    {
        if (this.scaleMin)
        {
            this.scaleMin.set(minX, minY);
        }
        else
        {
            this.scaleMin = new Phaser.Point(minX, minY);
        }
    }

    if (maxX === null)
    {
        this.scaleMax = null;
    }
    else
    {
        if (this.scaleMax)
        {
            this.scaleMax.set(maxX, maxY);
        }
        else
        {
            this.scaleMax = new Phaser.Point(maxX, maxY);
        }
    }

};

/**
* The rotation of the sprite, in degrees, from its original orientation.
* 
* Values from 0 to 180 represent clockwise rotation; values from 0 to -180 represent counterclockwise rotation.
* Values outside this range are added to or subtracted from 360 to obtain a value within the range. For example, the statement player.angle = 450 is the same as player.angle = 90.
*
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
* The delta x value: the difference between world.x now and in the previous step.
*
* Positive if the motion was to the right, negative if to the left.
*
* @name Phaser.Image#deltaX
* @property {number} deltaX - The delta value. 
* @readonly
*/
Object.defineProperty(Phaser.Image.prototype, "deltaX", {

    get: function() {

        return this.world.x - this._cache[0];

    }

});

/**
* The delta y value: the difference between world.y now and in the previous step.
*
* Positive if the motion was downwards, negative if upwards.
*
* @name Phaser.Image#deltaY
* @property {number} deltaY - The delta value. 
* @readonly
*/
Object.defineProperty(Phaser.Image.prototype, "deltaY", {

    get: function() {

        return this.world.y - this._cache[1];

    }

});

/**
* The delta z value: the difference between rotation now and in the previous step.
*
* @name Phaser.Image#deltaZ
* @property {number} deltaZ
* @readonly
* @todo Check name / operation.
*/
Object.defineProperty(Phaser.Image.prototype, "deltaZ", {

    get: function() {

        return this.rotation - this._cache[2];

    }

});

/**
* True if any part of the Image bounds are within the game world, otherwise false.
*
* @name Phaser.Image#inWorld
* @property {boolean} inWorld
* @readonly
*/
Object.defineProperty(Phaser.Image.prototype, "inWorld", {

    get: function() {

        return this.game.world.bounds.intersects(this.getBounds());

    }

});

/**
* True if any part of the Image bounds are within the game camera view, otherwise false.
*
* @name Phaser.Image#inCamera
* @property {boolean} inCamera
* @readonly
*/
Object.defineProperty(Phaser.Image.prototype, "inCamera", {

    get: function() {

        return this.game.world.camera.screenView.intersects(this.getBounds());

    }

});

/**
* Gets or sets the current frame index and updates the Texture for display.
*
* @name Phaser.Image#frame
* @property {number} frame
*/
Object.defineProperty(Phaser.Image.prototype, "frame", {

    get: function() {

        return this._frame;

    },

    set: function(value) {

        if (value !== this.frame)
        {
            var frameData = this.game.cache.getFrameData(this.key);

            if (frameData && value < frameData.total && frameData.getFrame(value))
            {
                this.setTexture(PIXI.TextureCache[frameData.getFrame(value).uuid]);
                this._frame = value;
            }
        }

    }

});

/**
* Gets or sets the current frame by name and updates the Texture for display.
*
* @name Phaser.Image#frameName
* @property {string} frameName
*/
Object.defineProperty(Phaser.Image.prototype, "frameName", {

    get: function() {

        return this._frameName;

    },

    set: function(value) {

        if (value !== this.frameName)
        {
            var frameData = this.game.cache.getFrameData(this.key);

            if (frameData && frameData.getFrameByName(value))
            {
                this.setTexture(PIXI.TextureCache[frameData.getFrameByName(value).uuid]);
                this._frameName = value;
            }
        }

    }

});

/**
* The render order ID, reset every frame.
* @name Phaser.Image#renderOrderID
* @property {number} renderOrderID
* @readonly
* @protected
*/
Object.defineProperty(Phaser.Image.prototype, "renderOrderID", {

    get: function() {

        return this._cache[3];

    }

});

/**
* By default a sprite won't process any input events at all. By setting inputEnabled to true the Phaser.InputHandler is
* activated for this object and it will then start to process click/touch events and more.
*
* @name Phaser.Image#inputEnabled
* @property {boolean} inputEnabled
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
* An sprite that is fixed to the camera uses its x/y coordinates as offsets from the top left of the camera; these are stored in Image.cameraOffset.
*
* Note that the cameraOffset values are in addition to any parent in the display list.
* So if this Image was in a Group that has x: 200, then this will be added to the cameraOffset.x
*
* @name Phaser.Image#fixedToCamera
* @property {boolean} fixedToCamera
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
* Enable or disable texture smoothing for this sprite (does not affect children).
* 
* Set to true to smooth the texture, or false to disable smoothing (great for pixel art).
* Smoothing only work for bitmap/image textures.
*
* @name Phaser.Image#smoothed
* @property {boolean} smoothed
* @default true
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
* True if this object is currently being destroyed.
* @name Phaser.Image#destroyPhase
* @property {boolean} destroyPhase
* @protected
*/
Object.defineProperty(Phaser.Image.prototype, "destroyPhase", {

    get: function () {

        return !!this._cache[8];

    }

});
