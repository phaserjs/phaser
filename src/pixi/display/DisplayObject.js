/**
* @author       Mat Groves http://matgroves.com @Doormat23
* @author       Richard Davey <rich@photonstorm.com>
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The base class for all objects that are rendered. Contains properties for position, scaling,
* rotation, masks and cache handling.
* 
* This is an abstract class and should not be used on its own, rather it should be extended.
*
* It is used internally by the likes of PIXI.Sprite.
*
* @class PIXI.DisplayObject
* @constructor
*/
PIXI.DisplayObject = function() {

    /**
    * The coordinates, in pixels, of this DisplayObject, relative to its parent container.
    * 
    * The value of this property does not reflect any positioning happening further up the display list.
    * To obtain that value please see the `worldPosition` property.
    * 
    * @property {PIXI.Point} position
    * @default
    */
    this.position = new PIXI.Point(0, 0);

    /**
    * The scale of this DisplayObject. A scale of 1:1 represents the DisplayObject
    * at its default size. A value of 0.5 would scale this DisplayObject by half, and so on.
    * 
    * The value of this property does not reflect any scaling happening further up the display list.
    * To obtain that value please see the `worldScale` property.
    * 
    * @property {PIXI.Point} scale
    * @default
    */
    this.scale = new PIXI.Point(1, 1);

    /**
    * The pivot point of this DisplayObject that it rotates around. The values are expressed
    * in pixel values.
    * @property {PIXI.Point} pivot
    * @default
    */
    this.pivot = new PIXI.Point(0, 0);

    /**
    * The rotation of this DisplayObject. The value is given, and expressed, in radians, and is based on
    * a right-handed orientation.
    * 
    * The value of this property does not reflect any rotation happening further up the display list.
    * To obtain that value please see the `worldRotation` property.
    * 
    * @property {number} rotation
    * @default
    */
    this.rotation = 0;

    /**
    * The alpha value of this DisplayObject. A value of 1 is fully opaque. A value of 0 is transparent.
    * Please note that an object with an alpha value of 0 is skipped during the render pass.
    * 
    * The value of this property does not reflect any alpha values set further up the display list.
    * To obtain that value please see the `worldAlpha` property.
    * 
    * @property {number} alpha
    * @default
    */
    this.alpha = 1;

    /**
    * The visibility of this DisplayObject. A value of `false` makes the object invisible.
    * A value of `true` makes it visible. Please note that an object with a visible value of
    * `false` is skipped during the render pass. Equally a DisplayObject with visible false will
    * not render any of its children.
    * 
    * The value of this property does not reflect any visible values set further up the display list.
    * To obtain that value please see the `worldVisible` property.
    * 
    * @property {boolean} visible
    * @default
    */
    this.visible = true;

    /**
     * This is the defined area that will pick up mouse / touch events. It is null by default.
     * Setting it is a neat way of optimising the hitTest function that the interactionManager will use (as it will not need to hit test all the children)
     *
     * @property hitArea
     * @type Rectangle|Circle|Ellipse|Polygon
     */
    this.hitArea = null;

    /**
    * Should this DisplayObject be rendered by the renderer? An object with a renderable value of
    * `false` is skipped during the render pass.
    * 
    * @property {boolean} renderable
    * @default
    */
    this.renderable = false;

    /**
    * The parent DisplayObjectContainer that this DisplayObject is a child of.
    * All DisplayObjects must belong to a parent in order to be rendered.
    * The root parent is the Stage object. This property is set automatically when the
    * DisplayObject is added to, or removed from, a DisplayObjectContainer.
    * 
    * @property {PIXI.DisplayObjectContainer} parent
    * @default
    * @readOnly
    */
    this.parent = null;

    /**
    * The stage that this DisplayObject is connected to.
    * 
    * @property {PIXI.Stage} stage
    * @default
    * @readOnly
    */
    this.stage = null;

    /**
    * The multiplied alpha value of this DisplayObject. A value of 1 is fully opaque. A value of 0 is transparent.
    * This value is the calculated total, based on the alpha values of all parents of this DisplayObjects 
    * in the display list.
    * 
    * To obtain, and set, the local alpha value, see the `alpha` property.
    *
    * Note: This property is only updated at the end of the `updateTransform` call, once per render. Until 
    * that happens this property will contain values based on the previous frame. Be mindful of this if
    * accessing this property outside of the normal game flow, i.e. from an asynchronous event callback.
    * 
    * @property {number} worldAlpha
    * @readOnly
    */
    this.worldAlpha = 1;

    /**
    * The current transform of this DisplayObject.
    * 
    * This property contains the calculated total, based on the transforms of all parents of this 
    * DisplayObject in the display list.
    *
    * Note: This property is only updated at the end of the `updateTransform` call, once per render. Until 
    * that happens this property will contain values based on the previous frame. Be mindful of this if
    * accessing this property outside of the normal game flow, i.e. from an asynchronous event callback.
    *
    * @property {PIXI.Matrix} worldTransform
    * @readOnly
    */
    this.worldTransform = new PIXI.Matrix();

    /**
    * The coordinates, in pixels, of this DisplayObject within the world.
    * 
    * This property contains the calculated total, based on the positions of all parents of this 
    * DisplayObject in the display list.
    *
    * Note: This property is only updated at the end of the `updateTransform` call, once per render. Until 
    * that happens this property will contain values based on the previous frame. Be mindful of this if
    * accessing this property outside of the normal game flow, i.e. from an asynchronous event callback.
    * 
    * @property {PIXI.Point} worldPosition
    * @readOnly
    */
    this.worldPosition = new PIXI.Point(0, 0);

    /**
    * The global scale of this DisplayObject.
    * 
    * This property contains the calculated total, based on the scales of all parents of this 
    * DisplayObject in the display list.
    *
    * Note: This property is only updated at the end of the `updateTransform` call, once per render. Until 
    * that happens this property will contain values based on the previous frame. Be mindful of this if
    * accessing this property outside of the normal game flow, i.e. from an asynchronous event callback.
    * 
    * @property {PIXI.Point} worldScale
    * @readOnly
    */
    this.worldScale = new PIXI.Point(1, 1);

    /**
    * The rotation, in radians, of this DisplayObject.
    * 
    * This property contains the calculated total, based on the rotations of all parents of this 
    * DisplayObject in the display list.
    *
    * Note: This property is only updated at the end of the `updateTransform` call, once per render. Until 
    * that happens this property will contain values based on the previous frame. Be mindful of this if
    * accessing this property outside of the normal game flow, i.e. from an asynchronous event callback.
    * 
    * @property {number} worldRotation
    * @readOnly
    */
    this.worldRotation = 0;

    /**
    * The rectangular area used by filters when rendering a shader for this DisplayObject.
    *
    * @property {PIXI.Rectangle} filterArea
    * @type Rectangle
    * @default
    */
    this.filterArea = null;

    /**
    * @property {number} _sr - Cached rotation value.
    * @private
    */
    this._sr = 0;

    /**
    * @property {number} _cr - Cached rotation value.
    * @private
    */
    this._cr = 1;

    /**
    * @property {PIXI.Rectangle} _bounds - The cached bounds of this object.
    * @private
    */
    this._bounds = new PIXI.Rectangle(0, 0, 1, 1);

    /**
    * @property {PIXI.Rectangle} _currentBounds - The most recently calculated bounds of this object.
    * @private
    */
    this._currentBounds = null;

    /**
    * @property {PIXI.Rectangle} _mask - The cached mask of this object.
    * @private
    */
    this._mask = null;

    /**
    * @property {boolean} _cacheAsBitmap - Internal cache as bitmap flag.
    * @private
    */
    this._cacheAsBitmap = false;

    /**
    * @property {boolean} _cacheIsDirty - Internal dirty cache flag.
    * @private
    */
    this._cacheIsDirty = false;

};

PIXI.DisplayObject.prototype.constructor = PIXI.DisplayObject;

PIXI.DisplayObject.prototype = {

    /**
    * Destroy this DisplayObject.
    *
    * Removes any cached sprites, sets renderable flag to false, and nulls references to the Stage, filters,
    * bounds and mask.
    *
    * Also iteratively calls `destroy` on any children.
    *
    * @method PIXI.DisplayObject#destroy
    */
    destroy: function () {

        if (this.children)
        {
            var i = this.children.length;

            while (i--)
            {
                this.children[i].destroy();
            }

            this.children = [];
        }

        this.hitArea = null;
        this.parent = null;
        this.stage = null;
        this.worldTransform = null;
        this.filterArea = null;
        this.renderable = false;

        this._bounds = null;
        this._currentBounds = null;
        this._mask = null;

        this._destroyCachedSprite();

    },

    /*
    * Updates the transform matrix this DisplayObject uses for rendering.
    *
    * If the object has no parent, and no parent parameter is provided, it will default to 
    * Phaser.Game.World as the parent transform to use. If that is unavailable the transform fails to take place.
    *
    * The `parent` parameter has priority over the actual parent. Use it as a parent override.
    * Setting it does **not** change the actual parent of this DisplayObject.
    *
    * Calling this method updates the `worldTransform`, `worldAlpha`, `worldPosition`, `worldScale` 
    * and `worldRotation` properties.
    *
    * If a `transformCallback` has been specified, it is called at the end of this method, and is passed
    * the new, updated, worldTransform property, along with the parent transform used.
    *
    * @method PIXI.DisplayObject#updateTransform
    * @param {PIXI.DisplayObject} [parent] - Optional parent to calculate this DisplayObjects transform from.
    * @return {PIXI.DisplayObject} - A reference to this DisplayObject.
    */
    updateTransform: function (parent) {

        if (!parent && !this.parent && !this.game)
        {
            return this;
        }

        var p = this.parent;

        if (parent)
        {
            p = parent;
        }
        else if (!this.parent)
        {
            p = this.game.world;
        }

        // create some matrix refs for easy access
        var pt = p.worldTransform;
        var wt = this.worldTransform;

        // temporary matrix variables
        var a, b, c, d, tx, ty;

        // so if rotation is between 0 then we can simplify the multiplication process..
        if (this.rotation % PIXI.PI_2)
        {
            // check to see if the rotation is the same as the previous render. This means we only need to use sin and cos when rotation actually changes
            if (this.rotation !== this.rotationCache)
            {
                this.rotationCache = this.rotation;
                this._sr = Math.sin(this.rotation);
                this._cr = Math.cos(this.rotation);
            }

            // get the matrix values of the displayobject based on its transform properties..
            a  =  this._cr * this.scale.x;
            b  =  this._sr * this.scale.x;
            c  = -this._sr * this.scale.y;
            d  =  this._cr * this.scale.y;
            tx =  this.position.x;
            ty =  this.position.y;
            
            // check for pivot.. not often used so geared towards that fact!
            if (this.pivot.x || this.pivot.y)
            {
                tx -= this.pivot.x * a + this.pivot.y * c;
                ty -= this.pivot.x * b + this.pivot.y * d;
            }

            // concat the parent matrix with the objects transform.
            wt.a  = a  * pt.a + b  * pt.c;
            wt.b  = a  * pt.b + b  * pt.d;
            wt.c  = c  * pt.a + d  * pt.c;
            wt.d  = c  * pt.b + d  * pt.d;
            wt.tx = tx * pt.a + ty * pt.c + pt.tx;
            wt.ty = tx * pt.b + ty * pt.d + pt.ty;
        }
        else
        {
            // lets do the fast version as we know there is no rotation..
            a  = this.scale.x;
            d  = this.scale.y;

            tx = this.position.x - this.pivot.x * a;
            ty = this.position.y - this.pivot.y * d;

            wt.a  = a  * pt.a;
            wt.b  = a  * pt.b;
            wt.c  = d  * pt.c;
            wt.d  = d  * pt.d;
            wt.tx = tx * pt.a + ty * pt.c + pt.tx;
            wt.ty = tx * pt.b + ty * pt.d + pt.ty;
        }

        //  Set the World values
        this.worldAlpha = this.alpha * p.worldAlpha;
        this.worldPosition.set(wt.tx, wt.ty);
        this.worldScale.set(this.scale.x * Math.sqrt(wt.a * wt.a + wt.c * wt.c), this.scale.y * Math.sqrt(wt.b * wt.b + wt.d * wt.d));
        this.worldRotation = Math.atan2(-wt.c, wt.d);

        // reset the bounds each time this is called!
        this._currentBounds = null;

        //  Custom callback?
        if (this.transformCallback)
        {
            this.transformCallback.call(this.transformCallbackContext, wt, pt);
        }

        return this;

    },

    /**
    * Sets the root Stage object that this DisplayObject is connected to.
    *
    * @method PIXI.DisplayObject#setStageReference
    * @param {Phaser.Stage} stage - The stage that the object will have as its current stage reference
    * @return {PIXI.DisplayObject} - A reference to this DisplayObject.
    */
    setStageReference: function (stage)
    {
        this.stage = stage;

        return this;

    },

    /**
    * To be overridden by classes that require it.
    *
    * @method PIXI.DisplayObject#preUpdate
    */
    preUpdate: function () {

    },

    /**
    * Generates a RenderTexture based on this DisplayObject, which can they be used to texture other Sprites.
    * This can be useful if your DisplayObject is static, or complicated, and needs to be reused multiple times.
    *
    * Please note that no garbage collection takes place on old textures. It is up to you to destroy old textures,
    * and references to them, so they don't linger in memory.
    *
    * @method PIXI.DisplayObject#generateTexture
    * @param {number} [resolution=1] - The resolution of the texture being generated.
    * @param {number} [scaleMode=PIXI.scaleModes.DEFAULT] - See {{#crossLink "PIXI/scaleModes:property"}}PIXI.scaleModes{{/crossLink}} for possible values.
    * @param {PIXI.CanvasRenderer|PIXI.WebGLRenderer} renderer - The renderer used to generate the texture.
    * @return {PIXI.RenderTexture} - A RenderTexture containing an image of this DisplayObject at the time it was invoked.
    */
    generateTexture: function (resolution, scaleMode, renderer) {

        var bounds = this.getLocalBounds();

        var renderTexture = new PIXI.RenderTexture(bounds.width | 0, bounds.height | 0, renderer, scaleMode, resolution);
        
        PIXI.DisplayObject._tempMatrix.tx = -bounds.x;
        PIXI.DisplayObject._tempMatrix.ty = -bounds.y;
        
        renderTexture.render(this, PIXI.DisplayObject._tempMatrix);

        return renderTexture;

    },

    /**
    * If this DisplayObject has a cached Sprite, this method generates and updates it.
    *
    * @method PIXI.DisplayObject#updateCache
    * @return {PIXI.DisplayObject} - A reference to this DisplayObject.
    */
    updateCache: function () {

        this._generateCachedSprite();

        return this;

    },

    /**
    * Calculates the global position of this DisplayObject, based on the position given.
    *
    * @method PIXI.DisplayObject#toGlobal
    * @param {PIXI.Point} position - The global position to calculate from.
    * @return {PIXI.Point} - A point object representing the position of this DisplayObject based on the global position given.
    */
    toGlobal: function (position) {

        this.updateTransform();

        return this.worldTransform.apply(position);

    },

    /**
    * Calculates the local position of this DisplayObject, relative to another point.
    *
    * @method PIXI.DisplayObject#toLocal
    * @param {PIXI.Point} position - The world origin to calculate from.
    * @param {PIXI.DisplayObject} [from] - An optional DisplayObject to calculate the global position from.
    * @return {PIXI.Point} - A point object representing the position of this DisplayObject based on the global position given.
    */
    toLocal: function (position, from) {

        if (from)
        {
            position = from.toGlobal(position);
        }

        this.updateTransform();

        return this.worldTransform.applyInverse(position);

    },

    /**
    * Internal method.
    *
    * @method PIXI.DisplayObject#_renderCachedSprite
    * @private
    * @param {Object} renderSession - The render session
    */
    _renderCachedSprite: function (renderSession) {

        this._cachedSprite.worldAlpha = this.worldAlpha;

        if (renderSession.gl)
        {
            PIXI.Sprite.prototype._renderWebGL.call(this._cachedSprite, renderSession);
        }
        else
        {
            PIXI.Sprite.prototype._renderCanvas.call(this._cachedSprite, renderSession);
        }

    },

    /**
    * Internal method.
    *
    * @method PIXI.DisplayObject#_generateCachedSprite
    * @private
    */
    _generateCachedSprite: function () {

        this._cacheAsBitmap = false;

        var bounds = this.getLocalBounds();

        //  Round it off and force non-zero dimensions
        bounds.width = Math.max(1, Math.ceil(bounds.width));
        bounds.height = Math.max(1, Math.ceil(bounds.height));

        this.updateTransform();

        if (!this._cachedSprite)
        {
            var renderTexture = new PIXI.RenderTexture(bounds.width, bounds.height);
            this._cachedSprite = new PIXI.Sprite(renderTexture);
            this._cachedSprite.worldTransform = this.worldTransform;
        }
        else
        {
            this._cachedSprite.texture.resize(bounds.width, bounds.height);
        }

        //  Remove filters
        var tempFilters = this._filters;

        this._filters = null;
        this._cachedSprite.filters = tempFilters;

        PIXI.DisplayObject._tempMatrix.tx = -bounds.x;
        PIXI.DisplayObject._tempMatrix.ty = -bounds.y;

        this._cachedSprite.texture.render(this, PIXI.DisplayObject._tempMatrix, true);
        this._cachedSprite.anchor.x = -(bounds.x / bounds.width);
        this._cachedSprite.anchor.y = -(bounds.y / bounds.height);

        this._filters = tempFilters;

        this._cacheAsBitmap = true;

    },

    /**
    * Destroys a cached Sprite.
    *
    * @method PIXI.DisplayObject#_destroyCachedSprite
    * @private
    */
    _destroyCachedSprite: function () {

        if (!this._cachedSprite)
        {
            return;
        }

        this._cachedSprite.texture.destroy(true);

        this._cachedSprite = null;

    }

};

//  Alias for updateTransform. As used in DisplayObject container, etc.
PIXI.DisplayObject.prototype.displayObjectUpdateTransform = PIXI.DisplayObject.prototype.updateTransform;

Object.defineProperties(PIXI.DisplayObject.prototype, {

    /**
    * The horizontal position of the DisplayObject, in pixels, relative to its parent.
    * If you need the world position of the DisplayObject, use `DisplayObject.worldPosition` instead.
    * @name PIXI.DisplayObject#x
    * @property {number} x - The horizontal position of the DisplayObject, in pixels, relative to its parent.
    */
    'x': {

        get: function () {

            return this.position.x;

        },

        set: function (value) {

            this.position.x = value;

        }

    },

    /**
    * The vertical position of the DisplayObject, in pixels, relative to its parent.
    * If you need the world position of the DisplayObject, use `DisplayObject.worldPosition` instead.
    * @name PIXI.DisplayObject#y
    * @property {number} y - The vertical position of the DisplayObject, in pixels, relative to its parent.
    */
    'y': {

        get: function () {

            return this.position.y;

        },

        set: function (value) {

            this.position.y = value;

        }

    },

    /**
    * Indicates if this DisplayObject is visible, based on it, and all of its parents, `visible` property values.
    * @name PIXI.DisplayObject#worldVisible
    * @property {boolean} worldVisible - Indicates if this DisplayObject is visible, based on it, and all of its parents, `visible` property values.
    */
    'worldVisible': {

        get: function () {

            if (!this.visible)
            {
                return false;
            }
            else
            {
                var item = this.parent;

                do
                {
                    if (!item.visible)
                    {
                        return false;
                    }

                    item = item.parent;
                }
                while (item);

                return true;
            }

        }

    },

    /**
    * Sets a mask for this DisplayObject. A mask is an instance of a Graphics object.
    * When applied it limits the visible area of this DisplayObject to the shape of the mask.
    * Under a Canvas renderer it uses shape clipping. Under a WebGL renderer it uses a Stencil Buffer.
    * To remove a mask, set this property to `null`.
    * 
    * @name PIXI.DisplayObject#mask
    * @property {PIXI.Graphics} mask - The mask applied to this DisplayObject. Set to `null` to remove an existing mask.
    */
    'mask': {

        get: function () {

            return this._mask;

        },

        set: function (value) {

            if (this._mask)
            {
                this._mask.isMask = false;
            }

            this._mask = value;

            if (value)
            {
                this._mask.isMask = true;
            }

        }

    },

    /**
    * Sets the filters for this DisplayObject. This is a WebGL only feature, and is ignored by the Canvas
    * Renderer. A filter is a shader applied to this DisplayObject. You can modify the placement of the filter
    * using `DisplayObject.filterArea`.
    * 
    * To remove filters, set this property to `null`.
    *
    * Note: You cannot have a filter set, and a MULTIPLY Blend Mode active, at the same time. Setting a 
    * filter will reset this DisplayObjects blend mode to NORMAL.
    * 
    * @name PIXI.DisplayObject#filters
    * @property {Array} filters - An Array of PIXI.AbstractFilter objects, or objects that extend them.
    */
    'filters': {

        get: function () {

            return this._filters;

        },

        set: function (value) {

            if (Array.isArray(value))
            {
                //  Put all the passes in one place.
                var passes = [];

                for (var i = 0; i < value.length; i++)
                {
                    var filterPasses = value[i].passes;

                    for (var j = 0; j < filterPasses.length; j++)
                    {
                        passes.push(filterPasses[j]);
                    }
                }

                //  Needed any more?
                this._filterBlock = { target: this, filterPasses: passes };
            }

            this._filters = value;

            if (this.blendMode && this.blendMode === PIXI.blendModes.MULTIPLY)
            {
                this.blendMode = PIXI.blendModes.NORMAL;
            }

        }

    },

    /**
    * Sets if this DisplayObject should be cached as a bitmap.
    *
    * When invoked it will take a snapshot of the DisplayObject, as it is at that moment, and store it 
    * in a RenderTexture. This is then used whenever this DisplayObject is rendered. It can provide a
    * performance benefit for complex, but static, DisplayObjects. I.e. those with lots of children.
    *
    * Cached Bitmaps do not track their parents. If you update a property of this DisplayObject, it will not
    * re-generate the cached bitmap automatically. To do that you need to call `DisplayObject.updateCache`.
    * 
    * To remove a cached bitmap, set this property to `null`.
    * 
    * @name PIXI.DisplayObject#cacheAsBitmap
    * @property {boolean} cacheAsBitmap - Cache this DisplayObject as a Bitmap. Set to `null` to remove an existing cached bitmap.
    */
    'cacheAsBitmap': {

        get: function () {

            return this._cacheAsBitmap;

        },

        set: function (value) {

            if (this._cacheAsBitmap === value)
            {
                return;
            }

            if (value)
            {
                this._generateCachedSprite();
            }
            else
            {
                this._destroyCachedSprite();
            }

            this._cacheAsBitmap = value;

        }

    }

});
