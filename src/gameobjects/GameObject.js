/**
* A "Game Object" is an interface/mixin type that provides common features found in Sprite-like objects.
*
* All game objects are expected to inherit from PIXI.DisplayObject or otherwise
* implementation the methods and properties it defines.
*
* A mixin is used to avoid altering the prototype inheritance while providing maximum
* feature compatibility between existing types.
*
* - GameObject (ordering, exists/renderable, culling/OOB, etc)
* - TexturedGameObject (frame, crop, animation, key)
* - InputGameObject (input, alive)
*
* @name Phaser.GameObject
* @interface
*/
Phaser.GameObject = function () {
};

/**
* Adds default/required properties to teh game object.
* This should generally be called from the implementing constructor before the base constructor is called.
*/
Phaser.GameObject.createProperties = function (object) {

    /**
    * An game object is only visible / update if it exists.
    * @property {boolean} Phaser.GameObject#exists
    * @default
    */
    object.exists = true;

    /**
    * The user defined name given to this game object; useful for debugging, perhaps.
    * @property {string} Phaser.GameObject#name 
    * @default
    */
    object.name = '';

    /**
    * The z-depth value of this object within its Group (the World is a Group as well).
    * No two objects in a Group can have the same z value.
    * @property {number} Phaser.GameObject#z
    */
    object.z = 0;

    /**
    * The world coordinates of this sprite.
    *
    * This differs from the local x/y coordinates which are relative to the parent.
    *
    * @property {Phaser.Point} world
    */
    this.world = new Phaser.Point();

    /**
    * If this object is `fixedToCamera` then this stores the x/y offset that its drawn at, from the top-left of the camera view.
    * @property {Phaser.Point} cameraOffset
    */
    this.cameraOffset = new Phaser.Point();

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
    // Not used Graphics
    this.autoCull = false;

    /**
    * If true the Sprite checks if it is still within the world each frame, when it leaves the world it dispatches Sprite.events.onOutOfBounds
    * and optionally kills the sprite (if Sprite.outOfBoundsKill is true). By default this is disabled because the Sprite has to calculate its
    * bounds every frame to support it, and not all games need it. Enable it by setting the value to true.
    * @property {boolean} checkWorldBounds
    * @default
    */
    // Not used by Graphics
    this.checkWorldBounds = false;

    /**
    * @property {boolean} outOfBoundsKill - If true Sprite.kill is called as soon as Sprite.inWorld returns false, as long as Sprite.checkWorldBounds is true.
    * @default
    */
    // Only used by things with kill()
    this.outOfBoundsKill = false;

    /**
    * The Input Handler for this object. Must be enabled with `inputEnabled` before use.
    * @property {Phaser.InputHandler|null} input - 
    */
    // Not used Graphics
    this.input = null;

    /**
    * @property {Phaser.Events} events - The Events you can subscribe to that are dispatched when certain things happen on this Image or its components.
    */
    // Not used Graphics
    this.events = new Phaser.Events(this);

    /**
    * This is the image or texture used by the Image during rendering.
    * It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture, BitmapData or PIXI.Texture.
    * @property {string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture} key
    * @readonly
    */
    // Only used with textures
    this.key = key;

    /**
    * @property {Phaser.AnimationManager} animations - This manages animations of the sprite. You can modify animations through it (see Phaser.AnimationManager)
    */
    // Not used Graphics
    this.animations = new Phaser.AnimationManager(this);

    /**
    * The Rectangle used to crop the texture.
    * Set this via {@link Phaser.GameObject#crop crop} and use {@link Phaser.GameObject#updateCrop updateCrop} as required.
    * @property {Phaser.Rectangle} cropRect
    * @default
    * @readonly
    */
    // Not used Graphics
    this.cropRect = null;

    /**
    * @property {boolean} debug - Handy flag to use with Game.enableStep
    * @default
    */
    this.debug = false;

    /**
    * A small internal cache:
    * 0 = previous position.x
    * 1 = previous position.y
    * 2 = previous rotation
    * 3 = renderID
    * 4 = fresh - first update? (0 = no, 1 = yes)
    * 5 = is currently outOfBounds? (0 = no, 1 = yes)
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

};

/**
* Generic preUpdate logic that can be re-used between various game objects.
* Uses property guards.
*/
Phaser.GameObject.prototype.preUpdate = function() {

    var rendering = this.preUpdateCommon();

    if (this.exists && this.body)
    {
        this.body.preUpdate();
    }

    if (!rendering)
    {
        return false;
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
* Generic postUpdate logic that can be re-used between various game objects.
* Uses property guards.
*/
Phaser.GameObject.prototype.postUpdate = function() {

    if (this.exists && this.body)
    {
        this.body.postUpdate();
    }

    this.postUpdateCommon();
    
    //  Update any Children
    for (var i = 0, len = this.children.length; i < len; i++)
    {
        this.children[i].postUpdate();
    }

};

/**
* Generic/common preUpdate logic.
*
* This takes care of basic world transforms, cache updates, and culling.
*
* This does not call `body.preUpdate`, as required by Physics, and it does not automatically
* update the children.
*
* @method Phaser.Sprite#preUpdate
* @memberof Phaser.Sprite
* @return {boolean} True if the game object should be rendered, otherwise false.
* @protected
*/
Phaser.Sprite.prototype.preUpdateCommon = function() {

    if (this._cache[4] === 1 && this.exists)
    {
        this.world.setTo(this.parent.position.x + this.position.x, this.parent.position.y + this.position.y);
        this.worldTransform.tx = this.world.x;
        this.worldTransform.ty = this.world.y;
        this._cache[0] = this.world.x;
        this._cache[1] = this.world.y;
        this._cache[2] = this.rotation;
        this._cache[3] = -1;
        this._cache[4] = 0;

        return false;
    }

    this._cache[0] = this.world.x;
    this._cache[1] = this.world.y;
    this._cache[2] = this.rotation;
    this._cache[3] = -1;

    if (!this.exists || !this.parent.exists)
    {
        return false;
    }

    if (this.autoCull || this.checkWorldBounds)
    {
        this._bounds.copyFrom(this.getBounds());
        this._bounds.x += this.game.camera.view.x;
        this._bounds.y += this.game.camera.view.y;

        if (this.autoCull)
        {
            //  Won't get rendered but will still get its transform updated
            if (this.game.world.camera.view.intersects(this._bounds))
            {
                this.renderable = true;
                this.game.world.camera.totalInView++;
            }
            else
            {
                this.renderable = false;
            }
        }

        if (this.checkWorldBounds)
        {
            var worldBoundIntersect = this.game.world.bounds.intersects(this._bounds);
            //  The Sprite is already out of the world bounds, so let's check to see if it has come back again
            if (this._cache[5] === 1 && worldBoundIntersect)
            {
                this._cache[5] = 0;
                this.events.onEnterBounds.dispatch(this);
            }
            else if (this._cache[5] === 0 && !worldBoundIntersect)
            {
                //  The display object WAS in the screen, but has now left.
                this._cache[5] = 1;
                this.events.onOutOfBounds.dispatch(this);

                if (this.outOfBoundsKill)
                {
                    this.kill();
                    return false;
                }
            }
        }
    }

    // Update the world position
    this.world.setTo(this.game.camera.x + this.worldTransform.tx, this.game.camera.y + this.worldTransform.ty);

    if (this.animations)
    {
        this.animations.update();
    }

    if (this.visible && this.renderable)
    {
        this._cache[3] = this.game.stage.currentRenderOrderID++;
        return true;
    }
    else
    {
        return false;
    }

};

/**
* Generic/common preUpdate logic.
*
* This takes care of basic pinning the object to the camera and special texture/key rendering.
*
* This does not peform physics post-updates or invoking postUpdate on children.
*
* @method Phaser.Sprite#postUpdate
* @memberof Phaser.Sprite
* @protected
*/
Phaser.GameObject.prototype.postUpdateCommon = function() {

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
* @method Phaser.GameObject#loadTexture
* @param {string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture} key - This is the image or texture used by the Image during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture, BitmapData or PIXI.Texture.
* @param {string|number} frame - If this Image is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
*/
// Required: key, setTexture, smoothed, animations, texture, _frame
Phaser.GameObject.prototype.loadTexture = function (key, frame) {

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
* @method Phaser.GameObject#setFrame
* @param {Phaser.Frame} frame - The Frame to be used by the texture.
*/
// Required: _frame, texture, updateCrop()
Phaser.GameObject.prototype.setFrame = function(frame) {

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
* @method Phaser.GameObject#resetFrame
* @memberof Phaser.Image
*/
// Requires: setFrame
Phaser.GameObject.prototype.resetFrame = function() {

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
* @method Phaser.GameObject#crop
* @memberof Phaser.Image
* @param {?Phaser.Rectangle} rect - The Rectangle used during cropping. Pass null or no parameters to clear a previously set crop rectangle.
* @param {boolean} [copy=false] - If false Sprite.cropRect will be a reference to the given rect. If true it will copy the rect values into a local Sprite.cropRect object.
*/
Phaser.GameObject.prototype.crop = function(rect, copy) {

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
* @method Phaser.GameObject#updateCrop
* @memberof Phaser.Image
*/
// Required: cropRect, _crop, texture
Phaser.GameObject.prototype.updateCrop = function() {

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
* Brings the gmae object to the top of the display list (ie. Group) it is a child of.
*
* @method Phaser.GameObject#bringToTop
* @return {Phaser.Image} This instance.
*/
// Required: {{bringToTop: function}} parent
Phaser.GameObject.prototype.bringToTop = function() {

    if (this.parent)
    {
        this.parent.bringToTop(this);
    }

    return this;

};

/**
* Adjust scaling limits, if set, to this Image.
*
* @method Phaser.GameObject#checkTransform
* @private
* @param {PIXI.Matrix} wt - The updated worldTransform matrix.
*/
// Required: {number} scaleMin, {number} scaleMax
Phaser.GameObject.prototype.checkTransform = function (wt) {

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
* @method Phaser.GameObject#setScaleMinMax
* @param {number|null} minX - The minimum horizontal scale value this Image can scale down to.
* @param {number|null} minY - The minimum vertical scale value this Image can scale down to.
* @param {number|null} maxX - The maximum horizontal scale value this Image can scale up to.
* @param {number|null} maxY - The maximum vertical scale value this Image can scale up to.
*/
// Required: {number} scaleMin, {number} scaleMax
Phaser.GameObject.prototype.setScaleMinMax = function (minX, minY, maxX, maxY) {

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
* Destroys the game object.
*
* This removes it from its parent group, destroys the event and animation handlers if present
* and nulls its reference to game, freeing it up for garbage collection.
*
* @method Phaser.Rope#destroy
* @memberof Phaser.Rope
* @param {boolean} [destroyChildren=true] - Should every child of this object have its destroy method called?
*/
Phaser.Rope.prototype.destroy = function(destroyChildren) {

    if (this.game === null || this.destroyPhase) { return; }

    if (typeof destroyChildren === 'undefined') { destroyChildren = true; }

    this._cache[8] = 1;

    if (this.events)
    {
        this.events.onDestroy.dispatch(this);
    }

    if (this.filters)
    {
        this.filters = null;
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

    if (this.animations)
    {
        this.animations.destroy();
    }

    if (this.events)
    {
        this.events.destroy();
    }

    if (this.children && this.children.length)
    {
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
    }

    this.exists = false;
    this.visible = false;

    this.filters = null;
    this.mask = null;
    this.game = null;

    this._cache[8] = 0;

};

/**
* Controls if the core game loop and physics update this game object.
*
* When you set Rope.exists to false it will remove its Body from the physics world (if it has one) and also set Rope.visible to false.
* Setting Rope.exists to true will re-add the Body to the physics world (if it has a body) and set Rope.visible to true.
*
* @name Phaser.Rope#exists
* @property {boolean} exists - If the Rope is processed by the core game update and physics.
*/
Object.defineProperty(Phaser.Rope.prototype, "exists", {

    get: function () {

        return !!this._cache[6];

    },

    set: function (value) {

        if (value)
        {
            //  exists = true
            this._cache[6] = 1;

            if (this.body && this.body.type === Phaser.Physics.P2JS)
            {
                this.body.addToWorld();
            }

            this.visible = true;
        }
        else
        {
            //  exists = false
            this._cache[6] = 0;

            if (this.body && this.body.type === Phaser.Physics.P2JS)
            {
                this.body.safeRemove = true;
            }

            this.visible = false;

        }
    }

});

/**
* The position of the Rope on the x axis relative to the local coordinates of the parent.
*
* @name Phaser.Rope#x
* @property {number} x - The position of the Rope on the x axis relative to the local coordinates of the parent.
*/
Object.defineProperty(Phaser.Rope.prototype, "x", {

    get: function () {

        return this.position.x;

    },

    set: function (value) {

        this.position.x = value;

        if (this.body && this.body.type === Phaser.Physics.ARCADE && this.body.phase === 2)
        {
            this.body._reset = 1;
        }

    }

});

/**
* The position of the Rope on the y axis relative to the local coordinates of the parent.
*
* @name Phaser.Rope#y
* @property {number} y - The position of the Rope on the y axis relative to the local coordinates of the parent.
*/
Object.defineProperty(Phaser.Rope.prototype, "y", {

    get: function () {

        return this.position.y;

    },

    set: function (value) {

        this.position.y = value;

        if (this.body && this.body.type === Phaser.Physics.ARCADE && this.body.phase === 2)
        {
            this.body._reset = 1;
        }

    }

});

/**
* Enable or disable texture smoothing for this game object; does not affect children.
* 
* Set to true to smooth the texture, or false to disable smoothing (great for pixel art).
*
* Smoothing only works for bitmap/image textures.
*
* @name Phaser.GameObject#smoothed
* @property {boolean}
* @default true
*/
// Required: {PIXI.Texture} texture
Phaser.GameObject.prototype.prop_smoothed = {

    get: function () {

        if (!this.texture)
        {
            return false;
        }

        return this.texture.baseTexture.scaleMode === PIXI.scaleModes.LINEAR;

    },

    set: function (value) {

        if (!this.texture)
        {
            return;
        }

        if (value)
        {
            this.texture.baseTexture.scaleMode = PIXI.scaleModes.LINEAR;
        }
        else
        {
            this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
        }

    }

};

/**
* The rotation of the game object, in degrees, from its original orientation.
* 
* Values from 0 to 180 represent clockwise rotation; values from 0 to -180 represent counterclockwise rotation.
* Values outside this range are added to or subtracted from 360 to obtain a value within the range. For example, the statement player.angle = 450 is the same as player.angle = 90.
*
* If you wish to work in radians instead of degrees use the `rotation` property instead. Working in radians is also a little faster as it doesn't have to convert the angle.
*
* @name Phaser.GameObject#angle
* @property {number} angle
*/
// Required: {number} rotation
Phaser.GameObject.prototype.prop_angle = {

    get: function() {

        return Phaser.Math.wrapAngle(Phaser.Math.radToDeg(this.rotation));

    },

    set: function(value) {

        this.rotation = Phaser.Math.degToRad(Phaser.Math.wrapAngle(value));

    }

};

/**
* Gets or sets the current frame index and updates the Texture for display.
*
* @name Phaser.GameObject#frame
* @property {number} frame
*/
Object.defineProperty(Phaser.GameObject.prototype, "frame", {

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
* @name Phaser.GameObject#frameName
* @property {string} frameName
*/
Object.defineProperty(Phaser.GameObject.prototype, "frameName", {

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
* The delta x value: the difference between world.x now and in the previous step.
*
* Positive if the motion was to the right, negative if to the left.
*
* @name Phaser.GameObject#deltaX
* @property {number} deltaX - The delta value. 
* @readonly
*/
Object.defineProperty(Phaser.GameObject.prototype, "deltaX", {

    get: function() {

        return this.world.x - this._cache[0];

    }

});

/**
* The delta y value: the difference between world.y now and in the previous step.
*
* Positive if the motion was downwards, negative if upwards.
*
* @name Phaser.GameObject#deltaY
* @property {number} deltaY - The delta value. 
* @readonly
*/
Object.defineProperty(Phaser.GameObject.prototype, "deltaY", {

    get: function() {

        return this.world.y - this._cache[1];

    }

});

/**
* The delta z value: the difference between rotation now and in the previous step.
*
* @name Phaser.GameObject#deltaZ
* @property {number} deltaZ
* @readonly
* @todo Check name / operation.
*/
Object.defineProperty(Phaser.GameObject.prototype, "deltaZ", {

    get: function() {

        return this.rotation - this._cache[2];

    }

});

/**
* True if any part of the Image bounds are within the game world, otherwise false.
*
* @name Phaser.GameObject#inWorld
* @property {boolean} inWorld
* @readonly
*/
Object.defineProperty(Phaser.GameObject.prototype, "inWorld", {

    get: function() {

        return this.game.world.bounds.intersects(this.getBounds());

    }

});

/**
* True if any part of the Image bounds are within the game camera view, otherwise false.
*
* @name Phaser.GameObject#inCamera
* @property {boolean} inCamera
* @readonly
*/
Object.defineProperty(Phaser.GameObject.prototype, "inCamera", {

    get: function() {

        return this.game.world.camera.screenView.intersects(this.getBounds());

    }

});

/**
* The render order ID, reset every frame.
* @name Phaser.GameObject#renderOrderID
* @property {number} renderOrderID
* @readonly
* @protected
*/
Object.defineProperty(Phaser.GameObject.prototype, "renderOrderID", {

    get: function() {

        return this._cache[3];

    }

});

/**
* By default a sprite won't process any input events at all. By setting inputEnabled to true the Phaser.InputHandler is
* activated for this object and it will then start to process click/touch events and more.
*
* @name Phaser.GameObject#inputEnabled
* @property {boolean} inputEnabled
*/
Object.defineProperty(Phaser.GameObject.prototype, "inputEnabled", {

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
* @name Phaser.GameObject#fixedToCamera
* @property {boolean} fixedToCamera
*/
Object.defineProperty(Phaser.GameObject.prototype, "fixedToCamera", {

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
* @memberof Phaser.Image
* @propterty Phaser.GameObject#destroyPhase
* @borrows Phaser.Sprite#destroyPhase as destroyPhase
*/
Object.defineProperty(Phaser.GameObject.prototype, "destroyPhase", {

    get: function () {

        return !!this._cache[8];

    }

});
