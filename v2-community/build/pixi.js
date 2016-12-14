/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*
* @overview
*
* Phaser - http://phaser.io
*
* v2.7.2 "2016-12-06" - Built: Tue Dec 06 2016 23:48:40
*
* By Richard Davey http://www.photonstorm.com @photonstorm
*
* Phaser is a fun, free and fast 2D game framework for making HTML5 games
* for desktop and mobile web browsers, supporting Canvas and WebGL rendering.
*
* Phaser uses Pixi.js for rendering, created by Mat Groves http://matgroves.com @Doormat23
* Phaser uses p2.js for full-body physics, created by Stefan Hedman https://github.com/schteppe/p2.js @schteppe
* Phaser contains a port of N+ Physics, converted by Richard Davey, original by http://www.metanetsoftware.com
*
* Many thanks to Adam Saltsman (@ADAMATOMIC) for releasing Flixel, from which both Phaser and my love of framework development originate.
*
* Follow development at http://phaser.io and on our forum
*
* "If you want your children to be intelligent,  read them fairy tales."
* "If you want them to be more intelligent, read them more fairy tales."
*                                                     -- Albert Einstein
*/

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

(function(){

    var root = this;

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * The [pixi.js](http://www.pixijs.com/) module/namespace.
 *
 * @module PIXI
 */
 
/**
 * Namespace-class for [pixi.js](http://www.pixijs.com/).
 *
 * Contains assorted static properties and enumerations.
 *
 * @class PIXI
 * @static
 */
var PIXI = PIXI || {};

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
* @class DisplayObject
* @constructor
*/
PIXI.DisplayObject = function () {

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
    this._bounds = new PIXI.Rectangle(0, 0, 0, 0);

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
    * Removes any cached sprites, sets renderable flag to false, and nulls filters, bounds and mask.
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
    * @param {PIXI.DisplayObjectContainer} [parent] - Optional parent to calculate this DisplayObjects transform from.
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
        if (this.rotation % Phaser.Math.PI2)
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
    * @return {Phaser.RenderTexture} - A RenderTexture containing an image of this DisplayObject at the time it was invoked.
    */
    generateTexture: function (resolution, scaleMode, renderer) {

        var bounds = this.getLocalBounds();

        var renderTexture = new Phaser.RenderTexture(bounds.width | 0, bounds.height | 0, renderer, scaleMode, resolution);
        
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
            var textureUnit = 0;
            if (this.texture && this.texture.baseTexture && PIXI._enableMultiTextureToggle)
                textureUnit = this.texture.baseTexture.textureIndex;
            var renderTexture = new Phaser.RenderTexture(bounds.width, bounds.height, null, null, null, textureUnit);
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

                if (!item)
                {
                    return this.visible;
                }
                else
                {
                    do
                    {
                        if (!item.visible)
                        {
                            return false;
                        }

                        item = item.parent;
                    }
                    while (item);

                }

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
    * @property {Array} filters - An Array of Phaser.Filter objects, or objects that extend them.
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

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * A DisplayObjectContainer represents a collection of display objects.
 * It is the base class of all display objects that act as a container for other objects.
 *
 * @class DisplayObjectContainer
 * @extends DisplayObject
 * @constructor
 */
PIXI.DisplayObjectContainer = function () {

    PIXI.DisplayObject.call(this);

    /**
     * [read-only] The array of children of this container.
     *
     * @property children
     * @type Array(DisplayObject)
     * @readOnly
     */
    this.children = [];

    /**
    * If `ignoreChildInput`  is `false` it will allow this objects _children_ to be considered as valid for Input events.
    * 
    * If this property is `true` then the children will _not_ be considered as valid for Input events.
    * 
    * Note that this property isn't recursive: only immediate children are influenced, it doesn't scan further down.
    * @property {boolean} ignoreChildInput
    * @default
    */
    this.ignoreChildInput = false;
    
};

PIXI.DisplayObjectContainer.prototype = Object.create( PIXI.DisplayObject.prototype );
PIXI.DisplayObjectContainer.prototype.constructor = PIXI.DisplayObjectContainer;

/**
 * Adds a child to the container.
 *
 * @method addChild
 * @param child {DisplayObject} The DisplayObject to add to the container
 * @return {DisplayObject} The child that was added.
 */
PIXI.DisplayObjectContainer.prototype.addChild = function (child) {

    return this.addChildAt(child, this.children.length);

};

/**
 * Adds a child to the container at a specified index. If the index is out of bounds an error will be thrown
 *
 * @method addChildAt
 * @param child {DisplayObject} The child to add
 * @param index {Number} The index to place the child in
 * @return {DisplayObject} The child that was added.
 */
PIXI.DisplayObjectContainer.prototype.addChildAt = function (child, index) {

    if (index >= 0 && index <= this.children.length)
    {
        if (child.parent)
        {
            child.parent.removeChild(child);
        }

        child.parent = this;

        this.children.splice(index, 0, child);

        return child;
    }
    else
    {
        throw new Error(child + 'addChildAt: The index '+ index +' supplied is out of bounds ' + this.children.length);
    }

};

/**
 * Swaps the position of 2 Display Objects within this container.
 *
 * @method swapChildren
 * @param child {DisplayObject}
 * @param child2 {DisplayObject}
 */
PIXI.DisplayObjectContainer.prototype.swapChildren = function (child, child2) {

    if (child === child2)
    {
        return;
    }

    var index1 = this.getChildIndex(child);
    var index2 = this.getChildIndex(child2);

    if (index1 < 0 || index2 < 0)
    {
        throw new Error('swapChildren: Both the supplied DisplayObjects must be a child of the caller.');
    }

    this.children[index1] = child2;
    this.children[index2] = child;

};

/**
 * Returns the index position of a child DisplayObject instance
 *
 * @method getChildIndex
 * @param child {DisplayObject} The DisplayObject instance to identify
 * @return {Number} The index position of the child display object to identify
 */
PIXI.DisplayObjectContainer.prototype.getChildIndex = function (child) {

    var index = this.children.indexOf(child);

    if (index === -1)
    {
        throw new Error('The supplied DisplayObject must be a child of the caller');
    }

    return index;

};

/**
 * Changes the position of an existing child in the display object container
 *
 * @method setChildIndex
 * @param child {DisplayObject} The child DisplayObject instance for which you want to change the index number
 * @param index {Number} The resulting index number for the child display object
 */
PIXI.DisplayObjectContainer.prototype.setChildIndex = function (child, index) {

    if (index < 0 || index >= this.children.length)
    {
        throw new Error('The supplied index is out of bounds');
    }

    var currentIndex = this.getChildIndex(child);

    this.children.splice(currentIndex, 1); //remove from old position
    this.children.splice(index, 0, child); //add at new position

};

/**
 * Returns the child at the specified index
 *
 * @method getChildAt
 * @param index {Number} The index to get the child from
 * @return {DisplayObject} The child at the given index, if any.
 */
PIXI.DisplayObjectContainer.prototype.getChildAt = function (index) {

    if (index < 0 || index >= this.children.length)
    {
        throw new Error('getChildAt: Supplied index '+ index +' does not exist in the child list, or the supplied DisplayObject must be a child of the caller');
    }

    return this.children[index];
    
};

/**
 * Removes a child from the container.
 *
 * @method removeChild
 * @param child {DisplayObject} The DisplayObject to remove
 * @return {DisplayObject} The child that was removed.
 */
PIXI.DisplayObjectContainer.prototype.removeChild = function (child) {

    var index = this.children.indexOf(child);

    if (index === -1)
    {
        return;
    }
    
    return this.removeChildAt(index);

};

/**
 * Removes a child from the specified index position.
 *
 * @method removeChildAt
 * @param index {Number} The index to get the child from
 * @return {DisplayObject} The child that was removed.
 */
PIXI.DisplayObjectContainer.prototype.removeChildAt = function (index) {

    var child = this.getChildAt(index);

    if (child)
    {
        child.parent = undefined;

        this.children.splice(index, 1);
    }

    return child;

};

/**
* Removes all children from this container that are within the begin and end indexes.
*
* @method removeChildren
* @param beginIndex {Number} The beginning position. Default value is 0.
* @param endIndex {Number} The ending position. Default value is size of the container.
*/
PIXI.DisplayObjectContainer.prototype.removeChildren = function (beginIndex, endIndex) {

    if (beginIndex === undefined) { beginIndex = 0; }
    if (endIndex === undefined) { endIndex = this.children.length; }

    var range = endIndex - beginIndex;

    if (range > 0 && range <= endIndex)
    {
        var removed = this.children.splice(beginIndex, range);

        for (var i = 0; i < removed.length; i++)
        {
            var child = removed[i];
            child.parent = undefined;
        }

        return removed;
    }
    else if (range === 0 && this.children.length === 0)
    {
        return [];
    }
    else
    {
        throw new Error( 'removeChildren: Range Error, numeric values are outside the acceptable range' );
    }

};

/*
 * Updates the transform on all children of this container for rendering
 *
 * @method updateTransform
 * @private
 */
PIXI.DisplayObjectContainer.prototype.updateTransform = function () {

    if (!this.visible)
    {
        return;
    }

    this.displayObjectUpdateTransform();

    if (this._cacheAsBitmap)
    {
        return;
    }

    for (var i = 0; i < this.children.length; i++)
    {
        this.children[i].updateTransform();
    }

};

// performance increase to avoid using call.. (10x faster)
PIXI.DisplayObjectContainer.prototype.displayObjectContainerUpdateTransform = PIXI.DisplayObjectContainer.prototype.updateTransform;

/**
 * Retrieves the global bounds of the displayObjectContainer as a rectangle. The bounds calculation takes all visible children into consideration.
 *
 * @method getBounds
 * @param {PIXI.DisplayObject|PIXI.Matrix} [targetCoordinateSpace] Returns a rectangle that defines the area of the display object relative to the coordinate system of the targetCoordinateSpace object.
 * @return {Rectangle} The rectangular bounding area
 */
PIXI.DisplayObjectContainer.prototype.getBounds = function (targetCoordinateSpace) {

    var isTargetCoordinateSpaceDisplayObject = (targetCoordinateSpace && targetCoordinateSpace instanceof PIXI.DisplayObject);
    var isTargetCoordinateSpaceThisOrParent = true;

    if (!isTargetCoordinateSpaceDisplayObject) 
	{
        targetCoordinateSpace = this;
    } 
	else if (targetCoordinateSpace instanceof PIXI.DisplayObjectContainer) 
	{
        isTargetCoordinateSpaceThisOrParent = targetCoordinateSpace.contains(this);
    } 
	else 
	{
        isTargetCoordinateSpaceThisOrParent = false;
    }

    var i;

    if (isTargetCoordinateSpaceDisplayObject)
    {
        var matrixCache = targetCoordinateSpace.worldTransform;

        targetCoordinateSpace.worldTransform = PIXI.identityMatrix;

        for (i = 0; i < targetCoordinateSpace.children.length; i++) 
		{
            targetCoordinateSpace.children[i].updateTransform();
        }
    }

    var minX = Infinity;
    var minY = Infinity;

    var maxX = -Infinity;
    var maxY = -Infinity;

    var childBounds;
    var childMaxX;
    var childMaxY;

    var childVisible = false;

    for (i = 0; i < this.children.length; i++)
    {
        var child = this.children[i];

        if (!child.visible)
        {
            continue;
        }

        childVisible = true;

        childBounds = this.children[i].getBounds();

        minX = (minX < childBounds.x) ? minX : childBounds.x;
        minY = (minY < childBounds.y) ? minY : childBounds.y;

        childMaxX = childBounds.width + childBounds.x;
        childMaxY = childBounds.height + childBounds.y;

        maxX = (maxX > childMaxX) ? maxX : childMaxX;
        maxY = (maxY > childMaxY) ? maxY : childMaxY;
    }

    var bounds = this._bounds;

    if (!childVisible) 
	{
        bounds = new PIXI.Rectangle();

        var w0 = bounds.x;
        var w1 = bounds.width + bounds.x;

        var h0 = bounds.y;
        var h1 = bounds.height + bounds.y;

        var worldTransform = this.worldTransform;

        var a = worldTransform.a;
        var b = worldTransform.b;
        var c = worldTransform.c;
        var d = worldTransform.d;
        var tx = worldTransform.tx;
        var ty = worldTransform.ty;

        var x1 = a * w1 + c * h1 + tx;
        var y1 = d * h1 + b * w1 + ty;

        var x2 = a * w0 + c * h1 + tx;
        var y2 = d * h1 + b * w0 + ty;

        var x3 = a * w0 + c * h0 + tx;
        var y3 = d * h0 + b * w0 + ty;

        var x4 = a * w1 + c * h0 + tx;
        var y4 = d * h0 + b * w1 + ty;

        maxX = x1;
        maxY = y1;

        minX = x1;
        minY = y1;

        minX = x2 < minX ? x2 : minX;
        minX = x3 < minX ? x3 : minX;
        minX = x4 < minX ? x4 : minX;

        minY = y2 < minY ? y2 : minY;
        minY = y3 < minY ? y3 : minY;
        minY = y4 < minY ? y4 : minY;

        maxX = x2 > maxX ? x2 : maxX;
        maxX = x3 > maxX ? x3 : maxX;
        maxX = x4 > maxX ? x4 : maxX;

        maxY = y2 > maxY ? y2 : maxY;
        maxY = y3 > maxY ? y3 : maxY;
        maxY = y4 > maxY ? y4 : maxY;
    }

    bounds.x = minX;
    bounds.y = minY;
    bounds.width = maxX - minX;
    bounds.height = maxY - minY;

    if (isTargetCoordinateSpaceDisplayObject) 
	{
        targetCoordinateSpace.worldTransform = matrixCache;

        for (i = 0; i < targetCoordinateSpace.children.length; i++) 
		{
            targetCoordinateSpace.children[i].updateTransform();
        }
    }

    if (!isTargetCoordinateSpaceThisOrParent) 
	{
        var targetCoordinateSpaceBounds = targetCoordinateSpace.getBounds();

        bounds.x -= targetCoordinateSpaceBounds.x;
        bounds.y -= targetCoordinateSpaceBounds.y;
    }

    return bounds;

};

/**
 * Retrieves the non-global local bounds of the displayObjectContainer as a rectangle without any transformations. The calculation takes all visible children into consideration.
 *
 * @method getLocalBounds
 * @return {Rectangle} The rectangular bounding area
 */
PIXI.DisplayObjectContainer.prototype.getLocalBounds = function () {

    return this.getBounds(this);

};

/**
* Determines whether the specified display object is a child of the DisplayObjectContainer instance or the instance itself.
*
* @method contains
* @param {DisplayObject} child
* @returns {boolean}
*/
PIXI.DisplayObjectContainer.prototype.contains = function (child) {

    if (!child)
    {
        return false;
    }
    else if (child === this) 
	{
        return true;
    }
    else 
	{
        return this.contains(child.parent);
    }
};

/**
* Renders the object using the WebGL renderer
*
* @method _renderWebGL
* @param renderSession {RenderSession} 
* @private
*/
PIXI.DisplayObjectContainer.prototype._renderWebGL = function (renderSession) {

    if (!this.visible || this.alpha <= 0)
    {
        return;
    }
    
    if (this._cacheAsBitmap)
    {
        this._renderCachedSprite(renderSession);
        return;
    }
    
    var i;

    if (this._mask || this._filters)
    {
        // push filter first as we need to ensure the stencil buffer is correct for any masking
        if (this._filters)
        {
            renderSession.spriteBatch.flush();
            renderSession.filterManager.pushFilter(this._filterBlock);
        }

        if (this._mask)
        {
            renderSession.spriteBatch.stop();
            renderSession.maskManager.pushMask(this.mask, renderSession);
            renderSession.spriteBatch.start();
        }

        // simple render children!
        for (i = 0; i < this.children.length; i++)
        {
            this.children[i]._renderWebGL(renderSession);
        }

        renderSession.spriteBatch.stop();

        if (this._mask) renderSession.maskManager.popMask(this._mask, renderSession);
        if (this._filters) renderSession.filterManager.popFilter();
        
        renderSession.spriteBatch.start();
    }
    else
    {
        // simple render children!
        for (i = 0; i < this.children.length; i++)
        {
            this.children[i]._renderWebGL(renderSession);
        }
    }

};

/**
* Renders the object using the Canvas renderer
*
* @method _renderCanvas
* @param renderSession {RenderSession} 
* @private
*/
PIXI.DisplayObjectContainer.prototype._renderCanvas = function (renderSession) {

    if (this.visible === false || this.alpha === 0)
    {
        return;
    }

    if (this._cacheAsBitmap)
    {
        this._renderCachedSprite(renderSession);
        return;
    }

    if (this._mask)
    {
        renderSession.maskManager.pushMask(this._mask, renderSession);
    }

    for (var i = 0; i < this.children.length; i++)
    {
        this.children[i]._renderCanvas(renderSession);
    }

    if (this._mask)
    {
        renderSession.maskManager.popMask(renderSession);
    }

};

/**
 * The width of the displayObjectContainer, setting this will actually modify the scale to achieve the value set
 *
 * @property width
 * @type Number
 */
Object.defineProperty(PIXI.DisplayObjectContainer.prototype, 'width', {

    get: function() {
        return this.getLocalBounds().width * this.scale.x;
    },

    set: function(value) {
        
        var width = this.getLocalBounds().width;

        if (width !== 0)
        {
            this.scale.x = value / width;
        }
        else
        {
            this.scale.x = 1;
        }
        
        this._width = value;
    }
});

/**
 * The height of the displayObjectContainer, setting this will actually modify the scale to achieve the value set
 *
 * @property height
 * @type Number
 */
Object.defineProperty(PIXI.DisplayObjectContainer.prototype, 'height', {

    get: function() {
        return this.getLocalBounds().height * this.scale.y;
    },

    set: function(value) {

        var height = this.getLocalBounds().height;

        if (height !== 0)
        {
            this.scale.y = value / height;
        }
        else
        {
            this.scale.y = 1;
        }

        this._height = value;
    }

});


/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * The Sprite object is the base for all textured objects that are rendered to the screen
 *
 * @class Sprite
 * @extends DisplayObjectContainer
 * @constructor
 * @param texture {Texture} The texture for this sprite
 */
PIXI.Sprite = function (texture) {

    PIXI.DisplayObjectContainer.call(this);

    /**
     * The anchor sets the origin point of the texture.
     * The default is 0,0 this means the texture's origin is the top left
     * Setting than anchor to 0.5,0.5 means the textures origin is centered
     * Setting the anchor to 1,1 would mean the textures origin points will be the bottom right corner
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
    this.texture = texture || PIXI.Texture.emptyTexture;

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

    /**
     * The tint applied to the sprite. This is a hex value. A value of 0xFFFFFF will remove any tint effect.
     *
     * @property tint
     * @type Number
     * @default 0xFFFFFF
     */
    this.tint = 0xFFFFFF;

    /**
     * The tint applied to the sprite. This is a hex value. A value of 0xFFFFFF will remove any tint effect.
     *
     * @property cachedTint
     * @private
     * @type Number
     * @default -1
     */
    this.cachedTint = -1;

    /**
     * A canvas that contains the tinted version of the Sprite (in Canvas mode, WebGL doesn't populate this)
     *
     * @property tintedTexture
     * @type Canvas
     * @default null
     */
    this.tintedTexture = null;

    /**
     * The blend mode to be applied to the sprite. Set to PIXI.blendModes.NORMAL to remove any blend mode.
     *
     * Warning: You cannot have a blend mode and a filter active on the same Sprite. Doing so will render the sprite invisible.
     *
     * @property blendMode
     * @type Number
     * @default PIXI.blendModes.NORMAL;
     */
    this.blendMode = PIXI.blendModes.NORMAL;

    /**
     * The shader that will be used to render this Sprite.
     * Set to null to remove a current shader.
     *
     * @property shader
     * @type Phaser.Filter
     * @default null
     */
    this.shader = null;

    /**
    * Controls if this Sprite is processed by the core Phaser game loops and Group loops.
    *
    * @property exists
    * @type Boolean
    * @default true
    */
    this.exists = true;

    if (this.texture.baseTexture.hasLoaded)
    {
        this.onTextureUpdate();
    }

    this.renderable = true;

};

// constructor
PIXI.Sprite.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
PIXI.Sprite.prototype.constructor = PIXI.Sprite;

/**
 * The width of the sprite, setting this will actually modify the scale to achieve the value set
 *
 * @property width
 * @type Number
 */
Object.defineProperty(PIXI.Sprite.prototype, 'width', {

    get: function() {
        return this.scale.x * this.texture.frame.width;
    },

    set: function(value) {
        this.scale.x = value / this.texture.frame.width;
        this._width = value;
    }

});

/**
 * The height of the sprite, setting this will actually modify the scale to achieve the value set
 *
 * @property height
 * @type Number
 */
Object.defineProperty(PIXI.Sprite.prototype, 'height', {

    get: function() {
        return  this.scale.y * this.texture.frame.height;
    },

    set: function(value) {
        this.scale.y = value / this.texture.frame.height;
        this._height = value;
    }

});

/**
 * Sets the texture of the sprite. Be warned that this doesn't remove or destroy the previous
 * texture this Sprite was using.
 *
 * @method setTexture
 * @param texture {Texture} The PIXI texture that is displayed by the sprite
 * @param [destroy=false] {boolean} Call Texture.destroy on the current texture before replacing it with the new one?
 */
PIXI.Sprite.prototype.setTexture = function(texture, destroyBase)
{
    if (destroyBase !== undefined)
    {
        this.texture.baseTexture.destroy();
    }

    //  Over-ridden by loadTexture as needed
    this.texture.baseTexture.skipRender = false;
    this.texture = texture;
    this.texture.valid = true;
    this.cachedTint = -1;
};

/**
 * When the texture is updated, this event will fire to update the scale and frame
 *
 * @method onTextureUpdate
 * @param event
 * @private
 */
PIXI.Sprite.prototype.onTextureUpdate = function()
{
    // so if _width is 0 then width was not set..
    if (this._width) this.scale.x = this._width / this.texture.frame.width;
    if (this._height) this.scale.y = this._height / this.texture.frame.height;
};

/**
* Returns the bounds of the Sprite as a rectangle.
* The bounds calculation takes the worldTransform into account.
*
* It is important to note that the transform is not updated when you call this method.
* So if this Sprite is the child of a Display Object which has had its transform
* updated since the last render pass, those changes will not yet have been applied
* to this Sprites worldTransform. If you need to ensure that all parent transforms
* are factored into this getBounds operation then you should call `updateTransform`
* on the root most object in this Sprites display list first.
*
* @method getBounds
* @param matrix {Matrix} the transformation matrix of the sprite
* @return {Rectangle} the framing rectangle
*/
PIXI.Sprite.prototype.getBounds = function(matrix)
{
    var width = this.texture.frame.width;
    var height = this.texture.frame.height;

    var w0 = width * (1-this.anchor.x);
    var w1 = width * -this.anchor.x;

    var h0 = height * (1-this.anchor.y);
    var h1 = height * -this.anchor.y;

    var worldTransform = matrix || this.worldTransform;

    var a = worldTransform.a;
    var b = worldTransform.b;
    var c = worldTransform.c;
    var d = worldTransform.d;
    var tx = worldTransform.tx;
    var ty = worldTransform.ty;

    var maxX = -Infinity;
    var maxY = -Infinity;

    var minX = Infinity;
    var minY = Infinity;

    if (b === 0 && c === 0)
    {
        // scale may be negative!
        if (a < 0)
        {
            a *= -1;
            var temp = w0;
            w0 = -w1;
            w1 = -temp; 
        }

        if (d < 0)
        {
            d *= -1;
            var temp = h0;
            h0 = -h1;
            h1 = -temp; 
        }

        // this means there is no rotation going on right? RIGHT?
        // if thats the case then we can avoid checking the bound values! yay         
        minX = a * w1 + tx;
        maxX = a * w0 + tx;
        minY = d * h1 + ty;
        maxY = d * h0 + ty;
    }
    else
    {
        var x1 = a * w1 + c * h1 + tx;
        var y1 = d * h1 + b * w1 + ty;

        var x2 = a * w0 + c * h1 + tx;
        var y2 = d * h1 + b * w0 + ty;

        var x3 = a * w0 + c * h0 + tx;
        var y3 = d * h0 + b * w0 + ty;

        var x4 =  a * w1 + c * h0 + tx;
        var y4 =  d * h0 + b * w1 + ty;

        minX = x1 < minX ? x1 : minX;
        minX = x2 < minX ? x2 : minX;
        minX = x3 < minX ? x3 : minX;
        minX = x4 < minX ? x4 : minX;

        minY = y1 < minY ? y1 : minY;
        minY = y2 < minY ? y2 : minY;
        minY = y3 < minY ? y3 : minY;
        minY = y4 < minY ? y4 : minY;

        maxX = x1 > maxX ? x1 : maxX;
        maxX = x2 > maxX ? x2 : maxX;
        maxX = x3 > maxX ? x3 : maxX;
        maxX = x4 > maxX ? x4 : maxX;

        maxY = y1 > maxY ? y1 : maxY;
        maxY = y2 > maxY ? y2 : maxY;
        maxY = y3 > maxY ? y3 : maxY;
        maxY = y4 > maxY ? y4 : maxY;
    }

    var bounds = this._bounds;

    bounds.x = minX;
    bounds.width = maxX - minX;

    bounds.y = minY;
    bounds.height = maxY - minY;

    // store a reference so that if this function gets called again in the render cycle we do not have to recalculate
    this._currentBounds = bounds;

    return bounds;
};

/**
 * Retrieves the non-global local bounds of the Sprite as a rectangle. The calculation takes all visible children into consideration.
 *
 * @method getLocalBounds
 * @return {Rectangle} The rectangular bounding area
 */
PIXI.Sprite.prototype.getLocalBounds = function () {

    var matrixCache = this.worldTransform;

    this.worldTransform = PIXI.identityMatrix;

    for (var i = 0; i < this.children.length; i++)
    {
        this.children[i].updateTransform();
    }

    var bounds = this.getBounds();

    this.worldTransform = matrixCache;

    for (i = 0; i < this.children.length; i++)
    {
        this.children[i].updateTransform();
    }

    return bounds;

};

/**
* Renders the object using the WebGL renderer
*
* @method _renderWebGL
* @param renderSession {RenderSession}
* @param {Matrix} [matrix] - Optional matrix. If provided the Display Object will be rendered using this matrix, otherwise it will use its worldTransform.
* @private
*/
PIXI.Sprite.prototype._renderWebGL = function(renderSession, matrix)
{
    // if the sprite is not visible or the alpha is 0 then no need to render this element
    if (!this.visible || this.alpha <= 0 || !this.renderable) return;

    //  They provided an alternative rendering matrix, so use it
    var wt = this.worldTransform;

    if (matrix)
    {
        wt = matrix;
    }

    //  A quick check to see if this element has a mask or a filter.
    if (this._mask || this._filters)
    {
        var spriteBatch = renderSession.spriteBatch;

        // push filter first as we need to ensure the stencil buffer is correct for any masking
        if (this._filters)
        {
            spriteBatch.flush();
            renderSession.filterManager.pushFilter(this._filterBlock);
        }

        if (this._mask)
        {
            spriteBatch.stop();
            renderSession.maskManager.pushMask(this.mask, renderSession);
            spriteBatch.start();
        }

        // add this sprite to the batch
        spriteBatch.render(this);

        // now loop through the children and make sure they get rendered
        for (var i = 0; i < this.children.length; i++)
        {
            this.children[i]._renderWebGL(renderSession);
        }

        // time to stop the sprite batch as either a mask element or a filter draw will happen next
        spriteBatch.stop();

        if (this._mask) renderSession.maskManager.popMask(this._mask, renderSession);
        if (this._filters) renderSession.filterManager.popFilter();

        spriteBatch.start();
    }
    else
    {
        renderSession.spriteBatch.render(this);

        //  Render children!
        for (var i = 0; i < this.children.length; i++)
        {
            this.children[i]._renderWebGL(renderSession, wt);
        }

    }
};

/**
* Renders the object using the Canvas renderer
*
* @method _renderCanvas
* @param renderSession {RenderSession}
* @param {Matrix} [matrix] - Optional matrix. If provided the Display Object will be rendered using this matrix, otherwise it will use its worldTransform.
* @private
*/
PIXI.Sprite.prototype._renderCanvas = function(renderSession, matrix)
{
    // If the sprite is not visible or the alpha is 0 then no need to render this element
    if (!this.visible || this.alpha === 0 || !this.renderable || this.texture.crop.width <= 0 || this.texture.crop.height <= 0)
    {
        return;
    }

    var wt = this.worldTransform;

    //  If they provided an alternative rendering matrix then use it
    if (matrix)
    {
        wt = matrix;
    }

    if (this.blendMode !== renderSession.currentBlendMode)
    {
        renderSession.currentBlendMode = this.blendMode;
        renderSession.context.globalCompositeOperation = PIXI.blendModesCanvas[renderSession.currentBlendMode];
    }

    if (this._mask)
    {
        renderSession.maskManager.pushMask(this._mask, renderSession);
    }

    //  Ignore null sources
    if (!this.texture.valid)
    {
        //  Update the children and leave
        for (var i = 0; i < this.children.length; i++)
        {
            this.children[i]._renderCanvas(renderSession);
        }

        if (this._mask)
        {
            renderSession.maskManager.popMask(renderSession);
        }

        return;
    }

    var resolution = this.texture.baseTexture.resolution / renderSession.resolution;

    renderSession.context.globalAlpha = this.worldAlpha;

    //  If smoothingEnabled is supported and we need to change the smoothing property for this texture
    if (renderSession.smoothProperty && renderSession.scaleMode !== this.texture.baseTexture.scaleMode)
    {
        renderSession.scaleMode = this.texture.baseTexture.scaleMode;
        renderSession.context[renderSession.smoothProperty] = (renderSession.scaleMode === PIXI.scaleModes.LINEAR);
    }

    //  If the texture is trimmed we offset by the trim x/y, otherwise we use the frame dimensions
    var dx = (this.texture.trim) ? this.texture.trim.x - this.anchor.x * this.texture.trim.width : this.anchor.x * -this.texture.frame.width;
    var dy = (this.texture.trim) ? this.texture.trim.y - this.anchor.y * this.texture.trim.height : this.anchor.y * -this.texture.frame.height;

    var tx = (wt.tx * renderSession.resolution) + renderSession.shakeX;
    var ty = (wt.ty * renderSession.resolution) + renderSession.shakeY;

    var cw = this.texture.crop.width;
    var ch = this.texture.crop.height;

    if (this.texture.rotated)
    {
        var a = wt.a;
        var b = wt.b;
        var c = wt.c;
        var d = wt.d;
        var e = cw;
        
        // Offset before rotating
        tx = wt.c * ch + tx;
        ty = wt.d * ch + ty;
        
        // Rotate matrix by 90 degrees
        // We use precalculated values for sine and cosine of rad(90)
        wt.a = a * 6.123233995736766e-17 + -c;
        wt.b = b * 6.123233995736766e-17 + -d;
        wt.c = a + c * 6.123233995736766e-17;
        wt.d = b + d * 6.123233995736766e-17;

        // Update cropping dimensions.
        cw = ch;
        ch = e;
    }

    //  Allow for pixel rounding
    if (renderSession.roundPixels)
    {
        renderSession.context.setTransform(wt.a, wt.b, wt.c, wt.d, tx | 0, ty | 0);
        dx |= 0;
        dy |= 0;
    }
    else
    {
        renderSession.context.setTransform(wt.a, wt.b, wt.c, wt.d, tx, ty);
    }

    dx /= resolution;
    dy /= resolution;

    if (this.tint !== 0xFFFFFF)
    {
        if (this.texture.requiresReTint || this.cachedTint !== this.tint)
        {
            this.tintedTexture = PIXI.CanvasTinter.getTintedTexture(this, this.tint);

            this.cachedTint = this.tint;
            this.texture.requiresReTint = false;
        }

        renderSession.context.drawImage(this.tintedTexture, 0, 0, cw, ch, dx, dy, cw / resolution, ch / resolution);
    }
    else
    {
        var cx = this.texture.crop.x;
        var cy = this.texture.crop.y;

        renderSession.context.drawImage(this.texture.baseTexture.source, cx, cy, cw, ch, dx, dy, cw / resolution, ch / resolution);
    }

    for (var i = 0; i < this.children.length; i++)
    {
        this.children[i]._renderCanvas(renderSession);
    }

    if (this._mask)
    {
        renderSession.maskManager.popMask(renderSession);
    }

};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
* @method initDefaultShaders
* @static
* @private
*/
PIXI.initDefaultShaders = function()
{
};

/**
* @method CompileVertexShader
* @static
* @param gl {WebGLContext} the current WebGL drawing context
* @param shaderSrc {Array}
* @return {Any}
*/
PIXI.CompileVertexShader = function(gl, shaderSrc)
{
    return PIXI._CompileShader(gl, shaderSrc, gl.VERTEX_SHADER);
};

/**
* @method CompileFragmentShader
* @static
* @param gl {WebGLContext} the current WebGL drawing context
* @param shaderSrc {Array}
* @return {Any}
*/
PIXI.CompileFragmentShader = function(gl, shaderSrc)
{
    return PIXI._CompileShader(gl, shaderSrc, gl.FRAGMENT_SHADER);
};

/**
* @method _CompileShader
* @static
* @private
* @param gl {WebGLContext} the current WebGL drawing context
* @param shaderSrc {Array}
* @param shaderType {Number}
* @return {Any}
*/
PIXI._CompileShader = function(gl, shaderSrc, shaderType)
{
    var src = shaderSrc;

    if (Array.isArray(shaderSrc))
    {
        src = shaderSrc.join("\n");
    }

    var shader = gl.createShader(shaderType);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    {
        window.console.log(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
};

/**
* @method compileProgram
* @static
* @param gl {WebGLContext} the current WebGL drawing context
* @param vertexSrc {Array}
* @param fragmentSrc {Array}
* @return {Any}
*/
PIXI.compileProgram = function(gl, vertexSrc, fragmentSrc)
{
    var fragmentShader = PIXI.CompileFragmentShader(gl, fragmentSrc);
    var vertexShader = PIXI.CompileVertexShader(gl, vertexSrc);

    var shaderProgram = gl.createProgram();

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
    {
        window.console.log(gl.getProgramInfoLog(shaderProgram));
        window.console.log("Could not initialise shaders");
    }

    return shaderProgram;
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 * @author Richard Davey http://www.photonstorm.com @photonstorm
 */

/**
* @class PixiShader
* @constructor
* @param gl {WebGLContext} the current WebGL drawing context
*/
PIXI.PixiShader = function(gl)
{
    /**
     * @property _UID
     * @type Number
     * @private
     */
    this._UID = Phaser._UID++;

    /**
     * @property gl
     * @type WebGLContext
     */
    this.gl = gl;

    /**
     * The WebGL program.
     * @property program
     * @type Any
     */
    this.program = null;

    /**
     * The fragment shader.
     * @property fragmentSrc
     * @type Array
     */
    this.fragmentSrc = null;

    /**
     * A local texture counter for multi-texture shaders.
     * @property textureCount
     * @type Number
     */
    this.textureCount = 0;

    /**
     * A local flag
     * @property firstRun
     * @type Boolean
     * @private
     */
    this.firstRun = true;

    /**
     * A dirty flag
     * @property dirty
     * @type Boolean
     */
    this.dirty = true;

    /**
     * Uniform attributes cache.
     * @property attributes
     * @type Array
     * @private
     */
    this.attributes = [];

    this.init();
};

PIXI.PixiShader.prototype.constructor = PIXI.PixiShader;

PIXI.PixiShader.prototype.initMultitexShader = function () {
    var gl = this.gl;
    this.MAX_TEXTURES = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
    var dynamicIfs = '\tif (vTextureIndex == 0.0) gl_FragColor = texture2D(uSamplerArray[0], vTextureCoord) * vColor;\n'
    for (var index = 1; index < this.MAX_TEXTURES; ++index)
    {
        dynamicIfs += '\telse if (vTextureIndex == ' + 
                    index + '.0) gl_FragColor = texture2D(uSamplerArray[' + 
                    index + '], vTextureCoord) * vColor;\n'
    }
    this.fragmentSrc = [
        '// PixiShader Fragment Shader.',
        'precision lowp float;',
        'varying vec2 vTextureCoord;',
        'varying vec4 vColor;',
        'varying float vTextureIndex;',
        'uniform sampler2D uSamplerArray[' + this.MAX_TEXTURES + '];',
        'const vec4 PINK = vec4(1.0, 0.0, 1.0, 1.0);',
        'const vec4 GREEN = vec4(0.0, 1.0, 0.0, 1.0);',
        'void main(void) {',
        dynamicIfs,
        'else gl_FragColor = PINK;',
        '}'
    ];

    var program = PIXI.compileProgram(gl, this.vertexSrc || PIXI.PixiShader.defaultVertexSrc, this.fragmentSrc);

    gl.useProgram(program);

    // get and store the uniforms for the shader
    //this.uSampler = gl.getUniformLocation(program, 'uSampler');
    this.uSamplerArray = gl.getUniformLocation(program, 'uSamplerArray[0]');
    this.projectionVector = gl.getUniformLocation(program, 'projectionVector');
    this.offsetVector = gl.getUniformLocation(program, 'offsetVector');
    this.dimensions = gl.getUniformLocation(program, 'dimensions');

    // get and store the attributes
    this.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
    this.aTextureCoord = gl.getAttribLocation(program, 'aTextureCoord');
    this.colorAttribute = gl.getAttribLocation(program, 'aColor');
    this.aTextureIndex = gl.getAttribLocation(program, 'aTextureIndex');

    var indices = [];
    // HACK: we bind an empty texture to avoid WebGL warning spam.
    var tempTexture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tempTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, null);
    for (var i = 0; i < this.MAX_TEXTURES; ++i) {
        gl.activeTexture(gl.TEXTURE0 + i);
        gl.bindTexture(gl.TEXTURE_2D, tempTexture);
        indices.push(i);
    }
    gl.activeTexture(gl.TEXTURE0);
    gl.uniform1iv(this.uSamplerArray, indices);

    // Begin worst hack eva //

    // WHY??? ONLY on my chrome pixel the line above returns -1 when using filters?
    // maybe its something to do with the current state of the gl context.
    // I'm convinced this is a bug in the chrome browser as there is NO reason why this should be returning -1 especially as it only manifests on my chrome pixel
    // If theres any webGL people that know why could happen please help :)
    if(this.colorAttribute === -1)
    {
        this.colorAttribute = 2;
    }

    this.attributes = [this.aVertexPosition, this.aTextureCoord, this.colorAttribute, this.aTextureIndex];

    // End worst hack eva //

    // add those custom shaders!
    for (var key in this.uniforms)
    {
        // get the uniform locations..
        this.uniforms[key].uniformLocation = gl.getUniformLocation(program, key);
    }

    this.initUniforms();

    this.program = program;
};

PIXI.PixiShader.prototype.initDefaultShader = function () {

    if (this.fragmentSrc === null) {
        this.fragmentSrc = [
            'precision lowp float;',
            'varying vec2 vTextureCoord;',
            'varying vec4 vColor;',
            'varying float vTextureIndex;',
            'uniform sampler2D uSampler;',
            'void main(void) {',
            '   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor ;',
            '}'
        ];
    }

    var gl = this.gl;

    var program = PIXI.compileProgram(gl, this.vertexSrc || PIXI.PixiShader.defaultVertexSrc, this.fragmentSrc);

    gl.useProgram(program);

    // get and store the uniforms for the shader
    this.uSampler = gl.getUniformLocation(program, 'uSampler');
    this.projectionVector = gl.getUniformLocation(program, 'projectionVector');
    this.offsetVector = gl.getUniformLocation(program, 'offsetVector');
    this.dimensions = gl.getUniformLocation(program, 'dimensions');

    // get and store the attributes
    this.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
    this.aTextureCoord = gl.getAttribLocation(program, 'aTextureCoord');
    this.colorAttribute = gl.getAttribLocation(program, 'aColor');
    this.aTextureIndex = gl.getAttribLocation(program, 'aTextureIndex');


    // Begin worst hack eva //

    // WHY??? ONLY on my chrome pixel the line above returns -1 when using filters?
    // maybe its something to do with the current state of the gl context.
    // I'm convinced this is a bug in the chrome browser as there is NO reason why this should be returning -1 especially as it only manifests on my chrome pixel
    // If theres any webGL people that know why could happen please help :)
    if(this.colorAttribute === -1)
    {
        this.colorAttribute = 2;
    }

    this.attributes = [this.aVertexPosition, this.aTextureCoord, this.colorAttribute, this.aTextureIndex];

    // End worst hack eva //

    // add those custom shaders!
    for (var key in this.uniforms)
    {
        // get the uniform locations..
        this.uniforms[key].uniformLocation = gl.getUniformLocation(program, key);
    }

    this.initUniforms();

    this.program = program;
};
/**
* Initialises the shader.
*
* @method init
*/
PIXI.PixiShader.prototype.init = function(usingFilter)
{
    if (PIXI._enableMultiTextureToggle && !usingFilter) {
        this.initMultitexShader();
    } else {
        this.initDefaultShader();
    }  
};

/**
* Initialises the shader uniform values.
*
* Uniforms are specified in the GLSL_ES Specification: http://www.khronos.org/registry/webgl/specs/latest/1.0/
* http://www.khronos.org/registry/gles/specs/2.0/GLSL_ES_Specification_1.0.17.pdf
*
* @method initUniforms
*/
PIXI.PixiShader.prototype.initUniforms = function()
{
    this.textureCount = 1;
    var gl = this.gl;
    var uniform;

    for (var key in this.uniforms)
    {
        uniform = this.uniforms[key];

        var type = uniform.type;

        if (type === 'sampler2D')
        {
            uniform._init = false;

            if (uniform.value !== null)
            {
                this.initSampler2D(uniform);
            }
        }
        else if (type === 'mat2' || type === 'mat3' || type === 'mat4')
        {
            //  These require special handling
            uniform.glMatrix = true;
            uniform.glValueLength = 1;

            if (type === 'mat2')
            {
                uniform.glFunc = gl.uniformMatrix2fv;
            }
            else if (type === 'mat3')
            {
                uniform.glFunc = gl.uniformMatrix3fv;
            }
            else if (type === 'mat4')
            {
                uniform.glFunc = gl.uniformMatrix4fv;
            }
        }
        else
        {
            //  GL function reference
            uniform.glFunc = gl['uniform' + type];

            if (type === '2f' || type === '2i')
            {
                uniform.glValueLength = 2;
            }
            else if (type === '3f' || type === '3i')
            {
                uniform.glValueLength = 3;
            }
            else if (type === '4f' || type === '4i')
            {
                uniform.glValueLength = 4;
            }
            else
            {
                uniform.glValueLength = 1;
            }
        }
    }

};

/**
* Initialises a Sampler2D uniform (which may only be available later on after initUniforms once the texture has loaded)
*
* @method initSampler2D
*/
PIXI.PixiShader.prototype.initSampler2D = function(uniform)
{
    if (!uniform.value || !uniform.value.baseTexture || !uniform.value.baseTexture.hasLoaded)
    {
        return;
    }

    var gl = this.gl;

    // No need to do string manipulation for this.
    gl.activeTexture(gl.TEXTURE0 + this.textureCount);
    gl.bindTexture(gl.TEXTURE_2D, uniform.value.baseTexture._glTextures[gl.id]);

    //  Extended texture data
    if (uniform.textureData)
    {
        var data = uniform.textureData;

        // GLTexture = mag linear, min linear_mipmap_linear, wrap repeat + gl.generateMipmap(gl.TEXTURE_2D);
        // GLTextureLinear = mag/min linear, wrap clamp
        // GLTextureNearestRepeat = mag/min NEAREST, wrap repeat
        // GLTextureNearest = mag/min nearest, wrap clamp
        // AudioTexture = whatever + luminance + width 512, height 2, border 0
        // KeyTexture = whatever + luminance + width 256, height 2, border 0

        //  magFilter can be: gl.LINEAR, gl.LINEAR_MIPMAP_LINEAR or gl.NEAREST
        //  wrapS/T can be: gl.CLAMP_TO_EDGE or gl.REPEAT

        var magFilter = (data.magFilter) ? data.magFilter : gl.LINEAR;
        var minFilter = (data.minFilter) ? data.minFilter : gl.LINEAR;
        var wrapS = (data.wrapS) ? data.wrapS : gl.CLAMP_TO_EDGE;
        var wrapT = (data.wrapT) ? data.wrapT : gl.CLAMP_TO_EDGE;
        var format = (data.luminance) ? gl.LUMINANCE : gl.RGBA;

        if (data.repeat)
        {
            wrapS = gl.REPEAT;
            wrapT = gl.REPEAT;
        }

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, !!data.flipY);

        if (data.width)
        {
            var width = (data.width) ? data.width : 512;
            var height = (data.height) ? data.height : 2;
            var border = (data.border) ? data.border : 0;

            // void texImage2D(GLenum target, GLint level, GLenum internalformat, GLsizei width, GLsizei height, GLint border, GLenum format, GLenum type, ArrayBufferView? pixels);
            gl.texImage2D(gl.TEXTURE_2D, 0, format, width, height, border, format, gl.UNSIGNED_BYTE, null);
        }
        else
        {
            //  void texImage2D(GLenum target, GLint level, GLenum internalformat, GLenum format, GLenum type, ImageData? pixels);
            gl.texImage2D(gl.TEXTURE_2D, 0, format, gl.RGBA, gl.UNSIGNED_BYTE, uniform.value.baseTexture.source);
        }

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
    }

    gl.uniform1i(uniform.uniformLocation, this.textureCount);

    uniform._init = true;

    this.textureCount++;

};

/**
* Updates the shader uniform values.
*
* @method syncUniforms
*/
PIXI.PixiShader.prototype.syncUniforms = function()
{
    this.textureCount = 1;
    var uniform;
    var gl = this.gl;

    //  This would probably be faster in an array and it would guarantee key order
    for (var key in this.uniforms)
    {
        uniform = this.uniforms[key];
        if (uniform.glValueLength === 1)
        {
            if (uniform.glMatrix === true)
            {
                uniform.glFunc.call(gl, uniform.uniformLocation, uniform.transpose, uniform.value);
            }
            else
            {
                uniform.glFunc.call(gl, uniform.uniformLocation, uniform.value);
            }
        }
        else if (uniform.glValueLength === 2)
        {
            uniform.glFunc.call(gl, uniform.uniformLocation, uniform.value.x, uniform.value.y);
        }
        else if (uniform.glValueLength === 3)
        {
            uniform.glFunc.call(gl, uniform.uniformLocation, uniform.value.x, uniform.value.y, uniform.value.z);
        }
        else if (uniform.glValueLength === 4)
        {
            uniform.glFunc.call(gl, uniform.uniformLocation, uniform.value.x, uniform.value.y, uniform.value.z, uniform.value.w);
        }
        else if (uniform.type === 'sampler2D')
        {
            if (uniform._init)
            {
                gl.activeTexture(gl['TEXTURE' + this.textureCount]);

                if(uniform.value.baseTexture._dirty[gl.id])
                {
                    PIXI.instances[gl.id].updateTexture(uniform.value.baseTexture);
                }
                else
                {
                    // bind the current texture
                    gl.bindTexture(gl.TEXTURE_2D, uniform.value.baseTexture._glTextures[gl.id]);
                }

                //  gl.bindTexture(gl.TEXTURE_2D, uniform.value.baseTexture._glTextures[gl.id] || PIXI.createWebGLTexture( uniform.value.baseTexture, gl));
                gl.uniform1i(uniform.uniformLocation, this.textureCount);
                this.textureCount++;
            }
            else
            {
                this.initSampler2D(uniform);
            }
        }
    }

};

/**
* Destroys the shader.
*
* @method destroy
*/
PIXI.PixiShader.prototype.destroy = function()
{
    this.gl.deleteProgram( this.program );
    this.uniforms = null;
    this.gl = null;

    this.attributes = null;
};

/**
* The Default Vertex shader source.
*
* @property defaultVertexSrc
* @type String
*/
PIXI.PixiShader.defaultVertexSrc = [
    '// PixiShader Vertex Shader',
    '// With multi-texture rendering',
    'attribute vec2 aVertexPosition;',
    'attribute vec2 aTextureCoord;',
    'attribute vec4 aColor;',
    'attribute float aTextureIndex;',

    'uniform vec2 projectionVector;',
    'uniform vec2 offsetVector;',

    'varying vec2 vTextureCoord;',
    'varying vec4 vColor;',
    'varying float vTextureIndex;',

    'const vec2 center = vec2(-1.0, 1.0);',

    'void main(void) {',
    '   if (aTextureIndex > 0.0) gl_Position = vec4(0.0);',
    '   gl_Position = vec4( ((aVertexPosition + offsetVector) / projectionVector) + center , 0.0, 1.0);',
    '   vTextureCoord = aTextureCoord;',
    '   vColor = vec4(aColor.rgb * aColor.a, aColor.a);',
    '   vTextureIndex = aTextureIndex;',
    '}'
];
/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * @class PixiFastShader
 * @constructor
 * @param gl {WebGLContext} the current WebGL drawing context
 */
PIXI.PixiFastShader = function (gl) {
    /**
     * @property _UID
     * @type Number
     * @private
     */
    this._UID = Phaser._UID++;

    /**
     * @property gl
     * @type WebGLContext
     */
    this.gl = gl;

    /**
     * The WebGL program.
     * @property program
     * @type Any
     */
    this.program = null;

    if (PIXI._enableMultiTextureToggle) {
        var gl = this.gl;
        this.MAX_TEXTURES = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
        var dynamicIfs = '\tif (vTextureIndex == 0.0) gl_FragColor = texture2D(uSamplerArray[0], vTextureCoord) * vColor;\n'
        for (var index = 1; index < this.MAX_TEXTURES; ++index)
        {
            dynamicIfs += '\telse if (vTextureIndex == ' + 
                        index + '.0) gl_FragColor = texture2D(uSamplerArray[' + 
                        index + '], vTextureCoord) * vColor;\n'
        }

        /**
         * The fragment shader.
         * @property fragmentSrc
         * @type Array
         */
        this.fragmentSrc = [
            '// PixiFastShader Fragment Shader.',
            'precision lowp float;',
            'varying vec2 vTextureCoord;',
            'varying float vColor;',
            'varying float vTextureIndex;',
            'uniform sampler2D uSamplerArray[' + this.MAX_TEXTURES + '];',
            'const vec4 PINK = vec4(1.0, 0.0, 1.0, 1.0);',
            'const vec4 GREEN = vec4(0.0, 1.0, 0.0, 1.0);',
            'void main(void) {',
            dynamicIfs,
            'else gl_FragColor = PINK;',        
            '}'
        ];
    } else {
        this.fragmentSrc = [
            '// PixiFastShader Fragment Shader.',
            'precision lowp float;',
            'varying vec2 vTextureCoord;',
            'varying float vColor;',
            'varying float vTextureIndex;',
            'uniform sampler2D uSampler;',
            'void main(void) {',
            '   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor;',
            '}'
        ];
    }    

    /**
     * The vertex shader.
     * @property vertexSrc
     * @type Array
     */
    this.vertexSrc = [
        '// PixiFastShader Vertex Shader.',
        'attribute vec2 aVertexPosition;',
        'attribute vec2 aPositionCoord;',
        'attribute vec2 aScale;',
        'attribute float aRotation;',
        'attribute vec2 aTextureCoord;',
        'attribute float aColor;',
        'attribute float aTextureIndex;',

        'uniform vec2 projectionVector;',
        'uniform vec2 offsetVector;',
        'uniform mat3 uMatrix;',

        'varying vec2 vTextureCoord;',
        'varying float vColor;',
        'varying float vTextureIndex;',

        'const vec2 center = vec2(-1.0, 1.0);',

        'void main(void) {',
        '   vec2 v;',
        '   vec2 sv = aVertexPosition * aScale;',
        '   v.x = (sv.x) * cos(aRotation) - (sv.y) * sin(aRotation);',
        '   v.y = (sv.x) * sin(aRotation) + (sv.y) * cos(aRotation);',
        '   v = ( uMatrix * vec3(v + aPositionCoord , 1.0) ).xy ;',
        '   gl_Position = vec4( ( v / projectionVector) + center , 0.0, 1.0);',
        '   vTextureCoord = aTextureCoord;',
        '   vTextureIndex = aTextureIndex;',
        //  '   vec3 color = mod(vec3(aColor.y/65536.0, aColor.y/256.0, aColor.y), 256.0) / 256.0;',
        '   vColor = aColor;',
        '}'
    ];

    /**
     * A local texture counter for multi-texture shaders.
     * @property textureCount
     * @type Number
     */
    this.textureCount = 0;

    this.init();
};

PIXI.PixiFastShader.prototype.constructor = PIXI.PixiFastShader;

/**
 * Initialises the shader.
 * 
 * @method init
 */
PIXI.PixiFastShader.prototype.init = function () {

    var gl = this.gl;
    var program = PIXI.compileProgram(gl, this.vertexSrc, this.fragmentSrc);

    gl.useProgram(program);

    // get and store the uniforms for the shader
    this.uSampler = PIXI._enableMultiTextureToggle ?
                         gl.getUniformLocation(program, 'uSamplerArray[0]') :
                         gl.getUniformLocation(program, 'uSampler');

    if (PIXI._enableMultiTextureToggle) {
        var indices = [];
        // HACK: we bind an empty texture to avoid WebGL warning spam.
        var tempTexture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tempTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, null);
        for (var i = 0; i < this.MAX_TEXTURES; ++i) {
            gl.activeTexture(gl.TEXTURE0 + i);
            gl.bindTexture(gl.TEXTURE_2D, tempTexture);
            indices.push(i);
        }
        gl.activeTexture(gl.TEXTURE0);
        gl.uniform1iv(this.uSampler, indices);
    }
    
    this.projectionVector = gl.getUniformLocation(program, 'projectionVector');
    this.offsetVector = gl.getUniformLocation(program, 'offsetVector');
    this.dimensions = gl.getUniformLocation(program, 'dimensions');
    this.uMatrix = gl.getUniformLocation(program, 'uMatrix');

    // get and store the attributes
    this.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
    this.aPositionCoord = gl.getAttribLocation(program, 'aPositionCoord');

    this.aScale = gl.getAttribLocation(program, 'aScale');
    this.aRotation = gl.getAttribLocation(program, 'aRotation');

    this.aTextureCoord = gl.getAttribLocation(program, 'aTextureCoord');
    this.colorAttribute = gl.getAttribLocation(program, 'aColor');

    this.aTextureIndex = gl.getAttribLocation(program, 'aTextureIndex');

    // Begin worst hack eva //

    // WHY??? ONLY on my chrome pixel the line above returns -1 when using filters?
    // maybe its somthing to do with the current state of the gl context.
    // Im convinced this is a bug in the chrome browser as there is NO reason why this should be returning -1 especially as it only manifests on my chrome pixel
    // If theres any webGL people that know why could happen please help :)
    if (this.colorAttribute === -1) {
        this.colorAttribute = 2;
    }

    this.attributes = [
        this.aVertexPosition,
        this.aPositionCoord,
        this.aScale,
        this.aRotation,
        this.aTextureCoord,
        this.colorAttribute,
        this.aTextureIndex
    ];

    // End worst hack eva //

    this.program = program;
};

/**
 * Destroys the shader.
 * 
 * @method destroy
 */
PIXI.PixiFastShader.prototype.destroy = function () {
    this.gl.deleteProgram(this.program);
    this.uniforms = null;
    this.gl = null;

    this.attributes = null;
};
/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
* @class StripShader
* @constructor
* @param gl {WebGLContext} the current WebGL drawing context
*/
PIXI.StripShader = function(gl)
{
    /**
     * @property _UID
     * @type Number
     * @private
     */
    this._UID = Phaser._UID++;
    
    /**
     * @property gl
     * @type WebGLContext
     */
    this.gl = gl;

    /**
     * The WebGL program.
     * @property program
     * @type Any
     */
    this.program = null;

    if (PIXI._enableMultiTextureToggle) {
        var gl = this.gl;
        this.MAX_TEXTURES = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
        var dynamicIfs = '\tif (vTextureIndex == 0.0) gl_FragColor = texture2D(uSamplerArray[0], vTextureCoord);\n'
        for (var index = 1; index < this.MAX_TEXTURES; ++index)
        {
            dynamicIfs += '\telse if (vTextureIndex == ' + 
                        index + '.0) gl_FragColor = texture2D(uSamplerArray[' + 
                        index + '], vTextureCoord) ;\n'
        }


        /**
         * The fragment shader.
         * @property fragmentSrc
         * @type Array
         */
        this.fragmentSrc = [
            '//StripShader Fragment Shader.',
            'precision mediump float;',
            'varying vec2 vTextureCoord;',
            'varying float vTextureIndex;',
         //   'varying float vColor;',
            'uniform float alpha;',
            'uniform sampler2D uSamplerArray[' + this.MAX_TEXTURES + '];',
            'const vec4 PINK = vec4(1.0, 0.0, 1.0, 1.0);',
            'const vec4 GREEN = vec4(0.0, 1.0, 0.0, 1.0);',
            'void main(void) {',
            dynamicIfs,
            'else gl_FragColor = PINK;',
            '}'
        ];    
    } else {
        /**
         * The fragment shader.
         * @property fragmentSrc
         * @type Array
         */
        this.fragmentSrc = [
            '//StripShader Fragment Shader.',
            'precision mediump float;',
            'varying vec2 vTextureCoord;',
            'varying float vTextureIndex;',
         //   'varying float vColor;',
            'uniform float alpha;',
            'uniform sampler2D uSampler;',
            'void main(void) {',
            '   gl_FragColor = texture2D(uSampler, vTextureCoord);',
            '}'
        ]; 
    }

    /**
     * The vertex shader.
     * @property vertexSrc
     * @type Array
     */
    this.vertexSrc  = [
        '//StripShader Vertex Shader.',
        'attribute vec2 aVertexPosition;',
        'attribute vec2 aTextureCoord;',
        'attribute float aTextureIndex;',
        'uniform mat3 translationMatrix;',
        'uniform vec2 projectionVector;',
        'uniform vec2 offsetVector;',
      //  'uniform float alpha;',
       // 'uniform vec3 tint;',
        'varying vec2 vTextureCoord;',
        'varying float vTextureIndex;',
      //  'varying vec4 vColor;',

        'void main(void) {',
        '   vec3 v = translationMatrix * vec3(aVertexPosition , 1.0);',
        '   v -= offsetVector.xyx;',
        '   gl_Position = vec4( v.x / projectionVector.x -1.0, v.y / -projectionVector.y + 1.0 , 0.0, 1.0);',
        '   vTextureCoord = aTextureCoord;',
        '   vTextureIndex = aTextureIndex;',
       // '   vColor = aColor * vec4(tint * alpha, alpha);',
        '}'
    ];

    this.init();
};

PIXI.StripShader.prototype.constructor = PIXI.StripShader;

/**
* Initialises the shader.
* 
* @method init
*/
PIXI.StripShader.prototype.init = function()
{
    var gl = this.gl;
    var program = PIXI.compileProgram(gl, this.vertexSrc, this.fragmentSrc);
    gl.useProgram(program);

    // get and store the uniforms for the shader
    this.uSampler = PIXI._enableMultiTextureToggle ?
                         gl.getUniformLocation(program, 'uSamplerArray[0]') : 
                         gl.getUniformLocation(program, 'uSampler');


    if (PIXI._enableMultiTextureToggle) {
        var indices = [];
        // HACK: we bind an empty texture to avoid WebGL warning spam.
        var tempTexture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tempTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, null);
        for (var i = 0; i < this.MAX_TEXTURES; ++i) {
            gl.activeTexture(gl.TEXTURE0 + i);
            gl.bindTexture(gl.TEXTURE_2D, tempTexture);
            indices.push(i);
        }
        gl.activeTexture(gl.TEXTURE0);
        gl.uniform1iv(this.uSampler, indices); 
    }                         
   
    this.projectionVector = gl.getUniformLocation(program, 'projectionVector');
    this.offsetVector = gl.getUniformLocation(program, 'offsetVector');
    this.colorAttribute = gl.getAttribLocation(program, 'aColor');
    this.aTextureIndex = gl.getAttribLocation(program, 'aTextureIndex');
    //this.dimensions = gl.getUniformLocation(this.program, 'dimensions');

    // get and store the attributes
    this.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
    this.aTextureCoord = gl.getAttribLocation(program, 'aTextureCoord');

    this.attributes = [this.aVertexPosition, this.aTextureCoord, this.aTextureIndex];

    this.translationMatrix = gl.getUniformLocation(program, 'translationMatrix');
    this.alpha = gl.getUniformLocation(program, 'alpha');

    this.program = program;
};

/**
* Destroys the shader.
* 
* @method destroy
*/
PIXI.StripShader.prototype.destroy = function()
{
    this.gl.deleteProgram( this.program );
    this.uniforms = null;
    this.gl = null;

    this.attribute = null;
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
* @class PrimitiveShader
* @constructor
* @param gl {WebGLContext} the current WebGL drawing context
*/
PIXI.PrimitiveShader = function(gl)
{
    /**
     * @property _UID
     * @type Number
     * @private
     */
    this._UID = Phaser._UID++;
 
    /**
     * @property gl
     * @type WebGLContext
     */
    this.gl = gl;

    /**
     * The WebGL program.
     * @property program
     * @type Any
     */
    this.program = null;

    /**
     * The fragment shader.
     * @property fragmentSrc
     * @type Array
     */
    this.fragmentSrc = [
        'precision mediump float;',
        'varying vec4 vColor;',

        'void main(void) {',
        '   gl_FragColor = vColor;',
        '}'
    ];

    /**
     * The vertex shader.
     * @property vertexSrc
     * @type Array
     */
    this.vertexSrc  = [
        'attribute vec2 aVertexPosition;',
        'attribute vec4 aColor;',
        'uniform mat3 translationMatrix;',
        'uniform vec2 projectionVector;',
        'uniform vec2 offsetVector;',
        'uniform float alpha;',
        'uniform float flipY;',
        'uniform vec3 tint;',
        'varying vec4 vColor;',

        'void main(void) {',
        '   vec3 v = translationMatrix * vec3(aVertexPosition , 1.0);',
        '   v -= offsetVector.xyx;',
        '   gl_Position = vec4( v.x / projectionVector.x -1.0, (v.y / projectionVector.y * -flipY) + flipY , 0.0, 1.0);',
        '   vColor = aColor * vec4(tint * alpha, alpha);',
        '}'
    ];

    this.init();
};

PIXI.PrimitiveShader.prototype.constructor = PIXI.PrimitiveShader;

/**
* Initialises the shader.
* 
* @method init
*/
PIXI.PrimitiveShader.prototype.init = function()
{
    var gl = this.gl;

    var program = PIXI.compileProgram(gl, this.vertexSrc, this.fragmentSrc);
    gl.useProgram(program);

    // get and store the uniforms for the shader
    this.projectionVector = gl.getUniformLocation(program, 'projectionVector');
    this.offsetVector = gl.getUniformLocation(program, 'offsetVector');
    this.tintColor = gl.getUniformLocation(program, 'tint');
    this.flipY = gl.getUniformLocation(program, 'flipY');

    // get and store the attributes
    this.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
    this.colorAttribute = gl.getAttribLocation(program, 'aColor');

    this.attributes = [this.aVertexPosition, this.colorAttribute];

    this.translationMatrix = gl.getUniformLocation(program, 'translationMatrix');
    this.alpha = gl.getUniformLocation(program, 'alpha');

    this.program = program;
};

/**
* Destroys the shader.
* 
* @method destroy
*/
PIXI.PrimitiveShader.prototype.destroy = function()
{
    this.gl.deleteProgram( this.program );
    this.uniforms = null;
    this.gl = null;

    this.attributes = null;
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
* @class ComplexPrimitiveShader
* @constructor
* @param gl {WebGLContext} the current WebGL drawing context
*/
PIXI.ComplexPrimitiveShader = function(gl)
{
    /**
     * @property _UID
     * @type Number
     * @private
     */
    this._UID = Phaser._UID++;

    /**
     * @property gl
     * @type WebGLContext
     */
    this.gl = gl;

    /**
     * The WebGL program.
     * @property program
     * @type Any
     */
    this.program = null;

    /**
     * The fragment shader.
     * @property fragmentSrc
     * @type Array
     */
    this.fragmentSrc = [

        'precision mediump float;',

        'varying vec4 vColor;',

        'void main(void) {',
        '   gl_FragColor = vColor;',
        '}'
    ];

    /**
     * The vertex shader.
     * @property vertexSrc
     * @type Array
     */
    this.vertexSrc  = [
        'attribute vec2 aVertexPosition;',
        //'attribute vec4 aColor;',
        'uniform mat3 translationMatrix;',
        'uniform vec2 projectionVector;',
        'uniform vec2 offsetVector;',
        
        'uniform vec3 tint;',
        'uniform float alpha;',
        'uniform vec3 color;',
        'uniform float flipY;',
        'varying vec4 vColor;',

        'void main(void) {',
        '   vec3 v = translationMatrix * vec3(aVertexPosition , 1.0);',
        '   v -= offsetVector.xyx;',
        '   gl_Position = vec4( v.x / projectionVector.x -1.0, (v.y / projectionVector.y * -flipY) + flipY , 0.0, 1.0);',
        '   vColor = vec4(color * alpha * tint, alpha);',//" * vec4(tint * alpha, alpha);',
        '}'
    ];

    this.init();
};

PIXI.ComplexPrimitiveShader.prototype.constructor = PIXI.ComplexPrimitiveShader;

/**
* Initialises the shader.
* 
* @method init
*/
PIXI.ComplexPrimitiveShader.prototype.init = function()
{
    var gl = this.gl;

    var program = PIXI.compileProgram(gl, this.vertexSrc, this.fragmentSrc);
    gl.useProgram(program);

    // get and store the uniforms for the shader
    this.projectionVector = gl.getUniformLocation(program, 'projectionVector');
    this.offsetVector = gl.getUniformLocation(program, 'offsetVector');
    this.tintColor = gl.getUniformLocation(program, 'tint');
    this.color = gl.getUniformLocation(program, 'color');
    this.flipY = gl.getUniformLocation(program, 'flipY');

    // get and store the attributes
    this.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
   // this.colorAttribute = gl.getAttribLocation(program, 'aColor');

    this.attributes = [this.aVertexPosition, this.colorAttribute];

    this.translationMatrix = gl.getUniformLocation(program, 'translationMatrix');
    this.alpha = gl.getUniformLocation(program, 'alpha');

    this.program = program;
};

/**
* Destroys the shader.
* 
* @method destroy
*/
PIXI.ComplexPrimitiveShader.prototype.destroy = function()
{
    this.gl.deleteProgram( this.program );
    this.uniforms = null;
    this.gl = null;

    this.attribute = null;
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

PIXI.glContexts = []; // this is where we store the webGL contexts for easy access.
PIXI.instances = [];
PIXI._enableMultiTextureToggle = false;

/**
 * The WebGLRenderer draws the stage and all its content onto a webGL enabled canvas. This renderer
 * should be used for browsers that support webGL. This Render works by automatically managing webGLBatchs.
 * So no need for Sprite Batches or Sprite Clouds.
 * Don't forget to add the view to your DOM or you will not see anything :)
 *
 * @class WebGLRenderer
 * @constructor
 * @param game {Phaser.Game} A reference to the Phaser Game instance
 */
PIXI.WebGLRenderer = function(game) {

    /**
    * @property {Phaser.Game} game - A reference to the Phaser Game instance.
    */
    this.game = game;

    if (!PIXI.defaultRenderer)
    {
        PIXI.defaultRenderer = this;
    }

    this.extensions = {};

    /**
     * @property type
     * @type Number
     */
    this.type = Phaser.WEBGL;

    /**
     * The resolution of the renderer
     *
     * @property resolution
     * @type Number
     * @default 1
     */
    this.resolution = game.resolution;

    /**
     * Whether the render view is transparent
     *
     * @property transparent
     * @type Boolean
     */
    this.transparent = game.transparent;

    /**
     * Whether the render view should be resized automatically
     *
     * @property autoResize
     * @type Boolean
     */
    this.autoResize = false;

    /**
     * The value of the preserveDrawingBuffer flag affects whether or not the contents of the stencil buffer is retained after rendering.
     *
     * @property preserveDrawingBuffer
     * @type Boolean
     */
    this.preserveDrawingBuffer = game.preserveDrawingBuffer;

    /**
     * This sets if the WebGLRenderer will clear the context texture or not before the new render pass. If true:
     * If the Stage is NOT transparent, Pixi will clear to alpha (0, 0, 0, 0).
     * If the Stage is transparent, Pixi will clear to the target Stage's background color.
     * Disable this by setting this to false. For example: if your game has a canvas filling background image, you often don't need this set.
     *
     * @property clearBeforeRender
     * @type Boolean
     * @default
     */
    this.clearBeforeRender = game.clearBeforeRender;

    /**
     * The width of the canvas view
     *
     * @property width
     * @type Number
     */
    this.width = game.width;

    /**
     * The height of the canvas view
     *
     * @property height
     * @type Number
     */
    this.height = game.height;

    /**
     * The canvas element that everything is drawn to
     *
     * @property view
     * @type HTMLCanvasElement
     */
    this.view = game.canvas;

    /**
     * @property _contextOptions
     * @type Object
     * @private
     */
    this._contextOptions = {
        alpha: this.transparent,
        antialias: game.antialias,
        premultipliedAlpha: this.transparent && this.transparent !== 'notMultiplied',
        stencil: true,
        preserveDrawingBuffer: this.preserveDrawingBuffer
    };

    /**
     * @property projection
     * @type Point
     */
    this.projection = new PIXI.Point();

    /**
     * @property offset
     * @type Point
     */
    this.offset = new PIXI.Point();

    // time to create the render managers! each one focuses on managing a state in webGL

    /**
     * Deals with managing the shader programs and their attribs
     * @property shaderManager
     * @type WebGLShaderManager
     */
    this.shaderManager = new PIXI.WebGLShaderManager();

    /**
     * Manages the rendering of sprites
     * @property spriteBatch
     * @type WebGLSpriteBatch
     */
    this.spriteBatch = new PIXI.WebGLSpriteBatch(game);

    /**
     * Manages the masks using the stencil buffer
     * @property maskManager
     * @type WebGLMaskManager
     */
    this.maskManager = new PIXI.WebGLMaskManager();

    /**
     * Manages the filters
     * @property filterManager
     * @type WebGLFilterManager
     */
    this.filterManager = new PIXI.WebGLFilterManager();

    /**
     * Manages the stencil buffer
     * @property stencilManager
     * @type WebGLStencilManager
     */
    this.stencilManager = new PIXI.WebGLStencilManager();

    /**
     * Manages the blendModes
     * @property blendModeManager
     * @type WebGLBlendModeManager
     */
    this.blendModeManager = new PIXI.WebGLBlendModeManager();

    /**
     * @property renderSession
     * @type Object
     */
    this.renderSession = {};

    /**
     * @property currentBatchedTextures
     * @type Array
     */
    this.currentBatchedTextures = [];

    //  Needed?
    this.renderSession.game = this.game;
    this.renderSession.gl = this.gl;
    this.renderSession.drawCount = 0;
    this.renderSession.shaderManager = this.shaderManager;
    this.renderSession.maskManager = this.maskManager;
    this.renderSession.filterManager = this.filterManager;
    this.renderSession.blendModeManager = this.blendModeManager;
    this.renderSession.spriteBatch = this.spriteBatch;
    this.renderSession.stencilManager = this.stencilManager;
    this.renderSession.renderer = this;
    this.renderSession.resolution = this.resolution;

    // time init the context..
    this.initContext();

    // map some webGL blend modes..
    this.mapBlendModes();

};

// constructor
PIXI.WebGLRenderer.prototype.constructor = PIXI.WebGLRenderer;

/**
* @method initContext
*/
PIXI.WebGLRenderer.prototype.initContext = function()
{
    var gl = this.view.getContext('webgl', this._contextOptions) || this.view.getContext('experimental-webgl', this._contextOptions);

    this.gl = gl;

    if (!gl) {
        // fail, not able to get a context
        throw new Error('This browser does not support webGL. Try using the canvas renderer');
    }

    this.maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);

    this.glContextId = gl.id = PIXI.WebGLRenderer.glContextId++;

    PIXI.glContexts[this.glContextId] = gl;

    PIXI.instances[this.glContextId] = this;

    // set up the default pixi settings..
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    gl.enable(gl.BLEND);

    // need to set the context for all the managers...
    this.shaderManager.setContext(gl);
    this.spriteBatch.setContext(gl);
    this.maskManager.setContext(gl);
    this.filterManager.setContext(gl);
    this.blendModeManager.setContext(gl);
    this.stencilManager.setContext(gl);

    this.renderSession.gl = this.gl;

    // now resize and we are good to go!
    this.resize(this.width, this.height);

    // Load WebGL extension
    this.extensions.compression = {};

    etc1 = gl.getExtension('WEBGL_compressed_texture_etc1') || gl.getExtension('WEBKIT_WEBGL_compressed_texture_etc1');
    pvrtc = gl.getExtension('WEBGL_compressed_texture_pvrtc') || gl.getExtension('WEBKIT_WEBGL_compressed_texture_pvrtc');
    s3tc = gl.getExtension('WEBGL_compressed_texture_s3tc') || gl.getExtension('WEBKIT_WEBGL_compressed_texture_s3tc');

    if (etc1) this.extensions.compression.ETC1 = etc1;
    if (pvrtc) this.extensions.compression.PVRTC = pvrtc;
    if (s3tc) this.extensions.compression.S3TC = s3tc;
};

/**
* If Multi Texture support has been enabled, then calling this method will enable batching on the given
* textures. The texture collection is an array of keys, that map to Phaser.Cache image entries.
*
* The number of textures that can be batched is dependent on hardware. If you provide more textures
* than can be batched by the GPU, then only those at the start of the array will be used. Generally
* you shouldn't provide more than 16 textures to this method. You can check the hardware limit via the
* `maxTextures` property.
*
* You can also check the property `currentBatchedTextures` at any time, to see which textures are currently
* being batched.
*
* To stop all textures from being batched, call this method again with an empty array.
*
* To change the textures being batched, call this method with a new array of image keys. The old ones
* will all be purged out and no-longer batched, and the new ones enabled.
* 
* Note: Throws a warning if you haven't enabled Multiple Texture batching support in the Phaser Game config.
* 
* @method setTexturePriority
* @param textureNameCollection {Array} An Array of Texture Cache keys to use for multi-texture batching.
* @return {Array} An array containing the texture keys that were enabled for batching.
*/
PIXI.WebGLRenderer.prototype.setTexturePriority = function (textureNameCollection) {

    if (!PIXI._enableMultiTextureToggle)
    {
        console.warn('setTexturePriority error: Multi Texture support hasn\'t been enabled in the Phaser Game Config.');
        return;
    }

    var maxTextures = this.maxTextures;
    var imageCache = this.game.cache._cache.image;
    var imageName = null;
    var gl = this.gl;

    //  Clear out all previously batched textures and reset their flags.
    //  If the array has been modified, then the developer will have to
    //  deal with that in their own way.
    for (var i = 0; i < this.currentBatchedTextures.length; i++)
    {
        imageName = textureNameCollection[index];

        if (!(imageName in imageCache))
        {
            continue;
        }
        
        imageCache[imageName].base.textureIndex = 0;
    }

    this.currentBatchedTextures.length = 0;

    // We start from 1 because framebuffer texture uses unit 0.
    for (var index = 0; index < textureNameCollection.length; ++index)
    {
        imageName = textureNameCollection[index];

        if (!(imageName in imageCache))
        {
            continue;
        }

        if (index + 1 < maxTextures)
        {
            imageCache[imageName].base.textureIndex = index + 1;
        }
        else
        {
            imageCache[imageName].base.textureIndex = maxTextures - 1;
        }

        this.currentBatchedTextures.push(imageName);
    }

    return this.currentBatchedTextures;

};

/**
 * Renders the stage to its webGL view
 *
 * @method render
 * @param stage {Stage} the Stage element to be rendered
 */
PIXI.WebGLRenderer.prototype.render = function(stage)
{
    // no point rendering if our context has been blown up!
    if (this.contextLost)
    {
        return;
    }

    var gl = this.gl;

    // -- Does this need to be set every frame? -- //
    gl.viewport(0, 0, this.width, this.height);

    // make sure we are bound to the main frame buffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    if (this.game.clearBeforeRender)
    {
        gl.clearColor(stage._bgColor.r, stage._bgColor.g, stage._bgColor.b, stage._bgColor.a);

        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    this.offset.x = this.game.camera._shake.x;
    this.offset.y = this.game.camera._shake.y;

    this.renderDisplayObject(stage, this.projection);
};

/**
 * Renders a Display Object.
 *
 * @method renderDisplayObject
 * @param displayObject {DisplayObject} The DisplayObject to render
 * @param projection {Point} The projection
 * @param buffer {Array} a standard WebGL buffer
 */
PIXI.WebGLRenderer.prototype.renderDisplayObject = function(displayObject, projection, buffer, matrix)
{
    this.renderSession.blendModeManager.setBlendMode(PIXI.blendModes.NORMAL);

    // reset the render session data..
    this.renderSession.drawCount = 0;

    // make sure to flip the Y if using a render texture..
    this.renderSession.flipY = buffer ? -1 : 1;

    // set the default projection
    this.renderSession.projection = projection;

    //set the default offset
    this.renderSession.offset = this.offset;

    // start the sprite batch
    this.spriteBatch.begin(this.renderSession);

    // start the filter manager
    this.filterManager.begin(this.renderSession, buffer);

    // render the scene!
    displayObject._renderWebGL(this.renderSession, matrix);

    // finish the sprite batch
    this.spriteBatch.end();
};

/**
 * Resizes the webGL view to the specified width and height.
 *
 * @method resize
 * @param width {Number} the new width of the webGL view
 * @param height {Number} the new height of the webGL view
 */
PIXI.WebGLRenderer.prototype.resize = function(width, height)
{
    this.width = width * this.resolution;
    this.height = height * this.resolution;

    this.view.width = this.width;
    this.view.height = this.height;

    if (this.autoResize) {
        this.view.style.width = this.width / this.resolution + 'px';
        this.view.style.height = this.height / this.resolution + 'px';
    }

    this.gl.viewport(0, 0, this.width, this.height);

    this.projection.x =  this.width / 2 / this.resolution;
    this.projection.y =  -this.height / 2 / this.resolution;
};

/**
 * Updates and creates a WebGL compressed texture for the renderers context.
 *
 * @method updateCompressedTexture
 * @param texture {Texture} the texture to update
 * @return {boolean} True if the texture was successfully bound, otherwise false.
 */
PIXI.WebGLRenderer.prototype.updateCompressedTexture = function (texture) {
    if (!texture.hasLoaded)
    {
        return false;
    }
    var gl = this.gl;
    var textureMetaData = texture.source;

    if (!texture._glTextures[gl.id])
    {
        texture._glTextures[gl.id] = gl.createTexture();
    }
    gl.activeTexture(gl.TEXTURE0 + texture.textureIndex);

    gl.bindTexture(gl.TEXTURE_2D, texture._glTextures[gl.id]);

    gl.compressedTexImage2D(
        gl.TEXTURE_2D, 
        0, 
        textureMetaData.glExtensionFormat, 
        textureMetaData.width, 
        textureMetaData.height, 
        0, 
        textureMetaData.textureData
    );

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, texture.scaleMode === PIXI.scaleModes.LINEAR ? gl.LINEAR : gl.NEAREST);

    if (texture.mipmap && Phaser.Math.isPowerOfTwo(texture.width, texture.height))
    {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, texture.scaleMode === PIXI.scaleModes.LINEAR ? gl.LINEAR_MIPMAP_LINEAR : gl.NEAREST_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);
    }
    else
    {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, texture.scaleMode === PIXI.scaleModes.LINEAR ? gl.LINEAR : gl.NEAREST);
    }

    if (!texture._powerOf2)
    {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }
    else
    {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    }
    texture._dirty[gl.id] = false;
    return true;
};

/**
 * Updates and Creates a WebGL texture for the renderers context.
 *
 * @method updateTexture
 * @param texture {Texture} the texture to update
 * @return {boolean} True if the texture was successfully bound, otherwise false.
 */
PIXI.WebGLRenderer.prototype.updateTexture = function(texture)
{
    if (!texture.hasLoaded)
    {
        return false;
    }
    if (texture.source.compressionAlgorithm) {
        return this.updateCompressedTexture(texture);
    }

    var gl = this.gl;

    if (!texture._glTextures[gl.id])
    {
        texture._glTextures[gl.id] = gl.createTexture();
    }
    gl.activeTexture(gl.TEXTURE0 + texture.textureIndex);

    gl.bindTexture(gl.TEXTURE_2D, texture._glTextures[gl.id]);

    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, texture.premultipliedAlpha);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.source);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, texture.scaleMode === PIXI.scaleModes.LINEAR ? gl.LINEAR : gl.NEAREST);

    if (texture.mipmap && Phaser.Math.isPowerOfTwo(texture.width, texture.height))
    {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, texture.scaleMode === PIXI.scaleModes.LINEAR ? gl.LINEAR_MIPMAP_LINEAR : gl.NEAREST_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);
    }
    else
    {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, texture.scaleMode === PIXI.scaleModes.LINEAR ? gl.LINEAR : gl.NEAREST);
    }

    if (!texture._powerOf2)
    {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }
    else
    {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    }

    texture._dirty[gl.id] = false;

    // return texture._glTextures[gl.id];
    return true;

};

/**
 * Removes everything from the renderer (event listeners, spritebatch, etc...)
 *
 * @method destroy
 */
PIXI.WebGLRenderer.prototype.destroy = function()
{
    PIXI.glContexts[this.glContextId] = null;

    this.projection = null;
    this.offset = null;

    this.shaderManager.destroy();
    this.spriteBatch.destroy();
    this.maskManager.destroy();
    this.filterManager.destroy();

    this.shaderManager = null;
    this.spriteBatch = null;
    this.maskManager = null;
    this.filterManager = null;

    this.gl = null;
    this.renderSession = null;

    Phaser.CanvasPool.remove(this);

    PIXI.instances[this.glContextId] = null;

    PIXI.WebGLRenderer.glContextId--;
};

/**
 * Maps Pixi blend modes to WebGL blend modes.
 *
 * @method mapBlendModes
 */
PIXI.WebGLRenderer.prototype.mapBlendModes = function()
{
    var gl = this.gl;

    if (!PIXI.blendModesWebGL)
    {
        var b = [];
        var modes = PIXI.blendModes;

        b[modes.NORMAL]        = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        b[modes.ADD]           = [gl.SRC_ALPHA, gl.DST_ALPHA];
        b[modes.MULTIPLY]      = [gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA];
        b[modes.SCREEN]        = [gl.SRC_ALPHA, gl.ONE];
        b[modes.OVERLAY]       = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        b[modes.DARKEN]        = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        b[modes.LIGHTEN]       = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        b[modes.COLOR_DODGE]   = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        b[modes.COLOR_BURN]    = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        b[modes.HARD_LIGHT]    = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        b[modes.SOFT_LIGHT]    = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        b[modes.DIFFERENCE]    = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        b[modes.EXCLUSION]     = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        b[modes.HUE]           = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        b[modes.SATURATION]    = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        b[modes.COLOR]         = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        b[modes.LUMINOSITY]    = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];

        PIXI.blendModesWebGL = b;
    }
};

PIXI.WebGLRenderer.prototype.getMaxTextureUnit = function() {
    var gl = this.gl;
    return gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
};

PIXI.enableMultiTexture = function() {
    PIXI._enableMultiTextureToggle = true;
};

PIXI.WebGLRenderer.glContextId = 0;
PIXI.WebGLRenderer.textureArray = [];
/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
* @class WebGLBlendModeManager
* @constructor
* @param gl {WebGLContext} the current WebGL drawing context
*/
PIXI.WebGLBlendModeManager = function()
{
    /**
     * @property currentBlendMode
     * @type Number
     */
    this.currentBlendMode = 99999;
};

PIXI.WebGLBlendModeManager.prototype.constructor = PIXI.WebGLBlendModeManager;

/**
 * Sets the WebGL Context.
 *
 * @method setContext
 * @param gl {WebGLContext} the current WebGL drawing context
 */
PIXI.WebGLBlendModeManager.prototype.setContext = function(gl)
{
    this.gl = gl;
};

/**
* Sets-up the given blendMode from WebGL's point of view.
* 
* @method setBlendMode 
* @param blendMode {Number} the blendMode, should be a Pixi const, such as PIXI.BlendModes.ADD
*/
PIXI.WebGLBlendModeManager.prototype.setBlendMode = function(blendMode)
{
    if(this.currentBlendMode === blendMode)return false;

    this.currentBlendMode = blendMode;
    
    var blendModeWebGL = PIXI.blendModesWebGL[this.currentBlendMode];

    if (blendModeWebGL)
    {
        this.gl.blendFunc(blendModeWebGL[0], blendModeWebGL[1]);
    }
    
    return true;
};

/**
* Destroys this object.
* 
* @method destroy
*/
PIXI.WebGLBlendModeManager.prototype.destroy = function()
{
    this.gl = null;
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
* @class WebGLMaskManager
* @constructor
* @private
*/
PIXI.WebGLMaskManager = function()
{
};

PIXI.WebGLMaskManager.prototype.constructor = PIXI.WebGLMaskManager;

/**
* Sets the drawing context to the one given in parameter.
* 
* @method setContext 
* @param gl {WebGLContext} the current WebGL drawing context
*/
PIXI.WebGLMaskManager.prototype.setContext = function(gl)
{
    this.gl = gl;
};

/**
* Applies the Mask and adds it to the current filter stack.
* 
* @method pushMask
* @param maskData {Array}
* @param renderSession {Object}
*/
PIXI.WebGLMaskManager.prototype.pushMask = function(maskData, renderSession)
{
    var gl = renderSession.gl;

    if (maskData.dirty)
    {
        PIXI.WebGLGraphics.updateGraphics(maskData, gl);
    }

    if (maskData._webGL[gl.id] === undefined || maskData._webGL[gl.id].data === undefined || maskData._webGL[gl.id].data.length === 0)
    {
        return;
    }

    renderSession.stencilManager.pushStencil(maskData, maskData._webGL[gl.id].data[0], renderSession);
};

/**
* Removes the last filter from the filter stack and doesn't return it.
* 
* @method popMask
* @param maskData {Array}
* @param renderSession {Object} an object containing all the useful parameters
*/
PIXI.WebGLMaskManager.prototype.popMask = function(maskData, renderSession)
{
    var gl = this.gl;

    if (maskData._webGL[gl.id] === undefined || maskData._webGL[gl.id].data === undefined || maskData._webGL[gl.id].data.length === 0)
    {
        return;
    }

    renderSession.stencilManager.popStencil(maskData, maskData._webGL[gl.id].data[0], renderSession);

};

/**
* Destroys the mask stack.
* 
* @method destroy
*/
PIXI.WebGLMaskManager.prototype.destroy = function()
{
    this.gl = null;
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
* @class WebGLStencilManager
* @constructor
* @private
*/
PIXI.WebGLStencilManager = function()
{
    this.stencilStack = [];
    this.reverse = true;
    this.count = 0;
};

/**
* Sets the drawing context to the one given in parameter.
* 
* @method setContext 
* @param gl {WebGLContext} the current WebGL drawing context
*/
PIXI.WebGLStencilManager.prototype.setContext = function(gl)
{
    this.gl = gl;
};

/**
* Applies the Mask and adds it to the current filter stack.
* 
* @method pushMask
* @param graphics {Graphics}
* @param webGLData {Array}
* @param renderSession {Object}
*/
PIXI.WebGLStencilManager.prototype.pushStencil = function(graphics, webGLData, renderSession)
{
    var gl = this.gl;
    this.bindGraphics(graphics, webGLData, renderSession);

    if(this.stencilStack.length === 0)
    {
        gl.enable(gl.STENCIL_TEST);
        gl.clear(gl.STENCIL_BUFFER_BIT);
        this.reverse = true;
        this.count = 0;
    }

    this.stencilStack.push(webGLData);

    var level = this.count;

    gl.colorMask(false, false, false, false);

    gl.stencilFunc(gl.ALWAYS,0,0xFF);
    gl.stencilOp(gl.KEEP,gl.KEEP,gl.INVERT);

    // draw the triangle strip!

    if(webGLData.mode === 1)
    {
        gl.drawElements(gl.TRIANGLE_FAN,  webGLData.indices.length - 4, gl.UNSIGNED_SHORT, 0 );
       
        if(this.reverse)
        {
            gl.stencilFunc(gl.EQUAL, 0xFF - level, 0xFF);
            gl.stencilOp(gl.KEEP,gl.KEEP,gl.DECR);
        }
        else
        {
            gl.stencilFunc(gl.EQUAL,level, 0xFF);
            gl.stencilOp(gl.KEEP,gl.KEEP,gl.INCR);
        }

        // draw a quad to increment..
        gl.drawElements(gl.TRIANGLE_FAN, 4, gl.UNSIGNED_SHORT, ( webGLData.indices.length - 4 ) * 2 );
               
        if(this.reverse)
        {
            gl.stencilFunc(gl.EQUAL,0xFF-(level+1), 0xFF);
        }
        else
        {
            gl.stencilFunc(gl.EQUAL,level+1, 0xFF);
        }

        this.reverse = !this.reverse;
    }
    else
    {
        if(!this.reverse)
        {
            gl.stencilFunc(gl.EQUAL, 0xFF - level, 0xFF);
            gl.stencilOp(gl.KEEP,gl.KEEP,gl.DECR);
        }
        else
        {
            gl.stencilFunc(gl.EQUAL,level, 0xFF);
            gl.stencilOp(gl.KEEP,gl.KEEP,gl.INCR);
        }

        gl.drawElements(gl.TRIANGLE_STRIP,  webGLData.indices.length, gl.UNSIGNED_SHORT, 0 );

        if(!this.reverse)
        {
            gl.stencilFunc(gl.EQUAL,0xFF-(level+1), 0xFF);
        }
        else
        {
            gl.stencilFunc(gl.EQUAL,level+1, 0xFF);
        }
    }

    gl.colorMask(true, true, true, true);
    gl.stencilOp(gl.KEEP,gl.KEEP,gl.KEEP);

    this.count++;
};

/**
 * TODO this does not belong here!
 * 
 * @method bindGraphics
 * @param graphics {Graphics}
 * @param webGLData {Array}
 * @param renderSession {Object}
 */
PIXI.WebGLStencilManager.prototype.bindGraphics = function(graphics, webGLData, renderSession)
{
    //if(this._currentGraphics === graphics)return;
    this._currentGraphics = graphics;

    var gl = this.gl;

     // bind the graphics object..
    var projection = renderSession.projection,
        offset = renderSession.offset,
        shader;// = renderSession.shaderManager.primitiveShader;

    if(webGLData.mode === 1)
    {
        shader = renderSession.shaderManager.complexPrimitiveShader;

        renderSession.shaderManager.setShader( shader );

        gl.uniform1f(shader.flipY, renderSession.flipY);
       
        gl.uniformMatrix3fv(shader.translationMatrix, false, graphics.worldTransform.toArray(true));

        gl.uniform2f(shader.projectionVector, projection.x, -projection.y);
        gl.uniform2f(shader.offsetVector, -offset.x, -offset.y);

        gl.uniform3fv(shader.tintColor, Phaser.Color.hexToRGBArray(graphics.tint));
        gl.uniform3fv(shader.color, webGLData.color);

        gl.uniform1f(shader.alpha, graphics.worldAlpha * webGLData.alpha);

        gl.bindBuffer(gl.ARRAY_BUFFER, webGLData.buffer);

        gl.vertexAttribPointer(shader.aVertexPosition, 2, gl.FLOAT, false, 4 * 2, 0);


        // now do the rest..
        // set the index buffer!
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webGLData.indexBuffer);
    }
    else
    {
        //renderSession.shaderManager.activatePrimitiveShader();
        shader = renderSession.shaderManager.primitiveShader;
        renderSession.shaderManager.setShader( shader );

        gl.uniformMatrix3fv(shader.translationMatrix, false, graphics.worldTransform.toArray(true));

        gl.uniform1f(shader.flipY, renderSession.flipY);
        gl.uniform2f(shader.projectionVector, projection.x, -projection.y);
        gl.uniform2f(shader.offsetVector, -offset.x, -offset.y);

        gl.uniform3fv(shader.tintColor, Phaser.Color.hexToRGBArray(graphics.tint));

        gl.uniform1f(shader.alpha, graphics.worldAlpha);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, webGLData.buffer);

        gl.vertexAttribPointer(shader.aVertexPosition, 2, gl.FLOAT, false, 4 * 6, 0);
        gl.vertexAttribPointer(shader.colorAttribute, 4, gl.FLOAT, false,4 * 6, 2 * 4);

        // set the index buffer!
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webGLData.indexBuffer);
    }
};

/**
 * @method popStencil
 * @param graphics {Graphics}
 * @param webGLData {Array}
 * @param renderSession {Object}
 */
PIXI.WebGLStencilManager.prototype.popStencil = function(graphics, webGLData, renderSession)
{
	var gl = this.gl;
    this.stencilStack.pop();
   
    this.count--;

    if(this.stencilStack.length === 0)
    {
        // the stack is empty!
        gl.disable(gl.STENCIL_TEST);

    }
    else
    {

        var level = this.count;

        this.bindGraphics(graphics, webGLData, renderSession);

        gl.colorMask(false, false, false, false);
    
        if(webGLData.mode === 1)
        {
            this.reverse = !this.reverse;

            if(this.reverse)
            {
                gl.stencilFunc(gl.EQUAL, 0xFF - (level+1), 0xFF);
                gl.stencilOp(gl.KEEP,gl.KEEP,gl.INCR);
            }
            else
            {
                gl.stencilFunc(gl.EQUAL,level+1, 0xFF);
                gl.stencilOp(gl.KEEP,gl.KEEP,gl.DECR);
            }

            // draw a quad to increment..
            gl.drawElements(gl.TRIANGLE_FAN, 4, gl.UNSIGNED_SHORT, ( webGLData.indices.length - 4 ) * 2 );
            
            gl.stencilFunc(gl.ALWAYS,0,0xFF);
            gl.stencilOp(gl.KEEP,gl.KEEP,gl.INVERT);

            // draw the triangle strip!
            gl.drawElements(gl.TRIANGLE_FAN,  webGLData.indices.length - 4, gl.UNSIGNED_SHORT, 0 );
           
            if(!this.reverse)
            {
                gl.stencilFunc(gl.EQUAL,0xFF-(level), 0xFF);
            }
            else
            {
                gl.stencilFunc(gl.EQUAL,level, 0xFF);
            }

        }
        else
        {
          //  console.log("<<>>")
            if(!this.reverse)
            {
                gl.stencilFunc(gl.EQUAL, 0xFF - (level+1), 0xFF);
                gl.stencilOp(gl.KEEP,gl.KEEP,gl.INCR);
            }
            else
            {
                gl.stencilFunc(gl.EQUAL,level+1, 0xFF);
                gl.stencilOp(gl.KEEP,gl.KEEP,gl.DECR);
            }

            gl.drawElements(gl.TRIANGLE_STRIP,  webGLData.indices.length, gl.UNSIGNED_SHORT, 0 );

            if(!this.reverse)
            {
                gl.stencilFunc(gl.EQUAL,0xFF-(level), 0xFF);
            }
            else
            {
                gl.stencilFunc(gl.EQUAL,level, 0xFF);
            }
        }

        gl.colorMask(true, true, true, true);
        gl.stencilOp(gl.KEEP,gl.KEEP,gl.KEEP);


    }
};

/**
* Destroys the mask stack.
* 
* @method destroy
*/
PIXI.WebGLStencilManager.prototype.destroy = function()
{
    this.stencilStack = null;
    this.gl = null;
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
* @class WebGLShaderManager
* @constructor
* @private
*/
PIXI.WebGLShaderManager = function()
{
    /**
     * @property maxAttibs
     * @type Number
     */
    this.maxAttibs = 10;

    /**
     * @property attribState
     * @type Array
     */
    this.attribState = [];

    /**
     * @property tempAttribState
     * @type Array
     */
    this.tempAttribState = [];

    for (var i = 0; i < this.maxAttibs; i++)
    {
        this.attribState[i] = false;
    }

    /**
     * @property stack
     * @type Array
     */
    this.stack = [];

};

PIXI.WebGLShaderManager.prototype.constructor = PIXI.WebGLShaderManager;

/**
* Initialises the context and the properties.
* 
* @method setContext 
* @param gl {WebGLContext} the current WebGL drawing context
*/
PIXI.WebGLShaderManager.prototype.setContext = function(gl)
{
    this.gl = gl;
    
    // the next one is used for rendering primitives
    this.primitiveShader = new PIXI.PrimitiveShader(gl);

    // the next one is used for rendering triangle strips
    this.complexPrimitiveShader = new PIXI.ComplexPrimitiveShader(gl);

    // this shader is used for the default sprite rendering
    this.defaultShader = new PIXI.PixiShader(gl);

    // this shader is used for the fast sprite rendering
    this.fastShader = new PIXI.PixiFastShader(gl);

    // the next one is used for rendering triangle strips
    this.stripShader = new PIXI.StripShader(gl);

    this.setShader(this.defaultShader);
};

/**
* Takes the attributes given in parameters.
* 
* @method setAttribs
* @param attribs {Array} attribs 
*/
PIXI.WebGLShaderManager.prototype.setAttribs = function(attribs)
{
    // reset temp state
    var i;

    for (i = 0; i < this.tempAttribState.length; i++)
    {
        this.tempAttribState[i] = false;
    }

    // set the new attribs
    for (i = 0; i < attribs.length; i++)
    {
        var attribId = attribs[i];
        this.tempAttribState[attribId] = true;
    }

    var gl = this.gl;

    for (i = 0; i < this.attribState.length; i++)
    {
        if(this.attribState[i] !== this.tempAttribState[i])
        {
            this.attribState[i] = this.tempAttribState[i];

            if(this.tempAttribState[i])
            {
                gl.enableVertexAttribArray(i);
            }
            else
            {
                gl.disableVertexAttribArray(i);
            }
        }
    }
};

/**
* Sets the current shader.
* 
* @method setShader
* @param shader {Any}
*/
PIXI.WebGLShaderManager.prototype.setShader = function(shader)
{
    if(this._currentId === shader._UID)return false;
    
    this._currentId = shader._UID;

    this.currentShader = shader;

    this.gl.useProgram(shader.program);
    this.setAttribs(shader.attributes);

    return true;
};

/**
* Destroys this object.
* 
* @method destroy
*/
PIXI.WebGLShaderManager.prototype.destroy = function()
{
    this.attribState = null;

    this.tempAttribState = null;

    this.primitiveShader.destroy();

    this.complexPrimitiveShader.destroy();

    this.defaultShader.destroy();

    this.fastShader.destroy();

    this.stripShader.destroy();

    this.gl = null;
};

/**
 * @author Mat Groves
 * 
 * Big thanks to the very clever Matt DesLauriers <mattdesl> https://github.com/mattdesl/
 * for creating the original pixi version!
 * Also a thanks to https://github.com/bchevalier for tweaking the tint and alpha so that they now share 4 bytes on the vertex buffer
 * 
 * Heavily inspired by LibGDX's WebGLSpriteBatch:
 * https://github.com/libgdx/libgdx/blob/master/gdx/src/com/badlogic/gdx/graphics/g2d/WebGLSpriteBatch.java
 */

/**
 *
 * @class WebGLSpriteBatch
 * @private
 * @constructor
 */
PIXI.WebGLSpriteBatch = function (game) {

    /**
    * @property {Phaser.Game} game - A reference to the currently running game.
    */
    this.game = game;

    /**
     * @property vertSize
     * @type Number
     */
    this.vertSize = 5;

    /**
     * The number of images in the SpriteBatch before it flushes
     * @property size
     * @type Number
     */
    this.size = 2000; //Math.pow(2, 16) /  this.vertSize;

    //the total number of bytes in our batch
    // Including texture index:
    // position + uv + color + textureIndex
    // vec2 + vec2 + (char * 4) + float
    this.vertexSize = (4 * 2) + (4 * 2) + (4) + (4);
    var numVerts = this.vertexSize * this.size * 4;
    //this.size * 4 * 4 * this.vertSize;
    //the total number of indices in our batch
    var numIndices = this.size * 6;

    /**
     * Holds the vertices
     *
     * @property vertices
     * @type ArrayBuffer
     */
    this.vertices = new ArrayBuffer(numVerts);

    /**
     * View on the vertices as a Float32Array
     *
     * @property positions
     * @type Float32Array
     */
    this.positions = new Float32Array(this.vertices);

    /**
     * View on the vertices as a Uint32Array
     *
     * @property colors
     * @type Uint32Array
     */
    this.colors = new Uint32Array(this.vertices);

    /**
     * Holds the indices
     *
     * @property indices
     * @type Uint16Array
     */
    this.indices = new Uint16Array(numIndices);

    /**
     * @property lastIndexCount
     * @type Number
     */
    this.lastIndexCount = 0;

    for (var i = 0, j = 0; i < numIndices; i += 6, j += 4) {
        this.indices[i + 0] = j + 0;
        this.indices[i + 1] = j + 1;
        this.indices[i + 2] = j + 2;
        this.indices[i + 3] = j + 0;
        this.indices[i + 4] = j + 2;
        this.indices[i + 5] = j + 3;
    }

    /**
     * @property drawing
     * @type Boolean
     */
    this.drawing = false;

    /**
     * @property currentBatchSize
     * @type Number
     */
    this.currentBatchSize = 0;

    /**
     * @property currentBaseTexture
     * @type BaseTexture
     */
    this.currentBaseTexture = null;

    /**
     * @property dirty
     * @type Boolean
     */
    this.dirty = true;

    /**
     * @property textures
     * @type Array
     */
    this.textures = [];

    /**
     * @property blendModes
     * @type Array
     */
    this.blendModes = [];

    /**
     * @property shaders
     * @type Array
     */
    this.shaders = [];

    /**
     * @property sprites
     * @type Array
     */
    this.sprites = [];

    /**
     * @property defaultShader
     * @type Phaser.Filter
     */
    this.defaultShader = null;
};

/**
 * @method setContext
 * @param gl {WebGLContext} the current WebGL drawing context
 */
PIXI.WebGLSpriteBatch.prototype.setContext = function (gl) {
    this.MAX_TEXTURES = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
    this.gl = gl;
    if (PIXI._enableMultiTextureToggle) {
        var dynamicIfs = '\tif (vTextureIndex == 0.0) gl_FragColor = texture2D(uSamplerArray[0], vTextureCoord) * vColor;\n'
        for (var index = 1; index < this.MAX_TEXTURES; ++index) {
            dynamicIfs += '\telse if (vTextureIndex == ' +
                index + '.0) gl_FragColor = texture2D(uSamplerArray[' +
                index + '], vTextureCoord) * vColor;\n'
        }
        this.defaultShader = new Phaser.Filter(
            this.game,
            undefined,
            [
                '//WebGLSpriteBatch Fragment Shader.',
                'precision lowp float;',
                'varying vec2 vTextureCoord;',
                'varying vec4 vColor;',
                'varying float vTextureIndex;',
                'uniform sampler2D uSamplerArray[' + this.MAX_TEXTURES + '];',
                'void main(void) {',
                    dynamicIfs,
                    '\telse gl_FragColor = texture2D(uSamplerArray[0], vTextureCoord) * vColor;',
                '}'
            ]);
    }
    else
    {
        this.defaultShader = new Phaser.Filter(
            this.game,
            undefined,
            [
                '//WebGLSpriteBatch Fragment Shader.',
                'precision lowp float;',
                'varying vec2 vTextureCoord;',
                'varying vec4 vColor;',
                'varying float vTextureIndex;',
                'uniform sampler2D uSampler;',
                'void main(void) {',
                '   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor;',
                '}'
            ]);
    }

    // create a couple of buffers
    this.vertexBuffer = gl.createBuffer();
    this.indexBuffer = gl.createBuffer();

    // 65535 is max index, so 65535 / 6 = 10922.

    //upload the index data
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);

    this.currentBlendMode = 99999;

    var shader = new PIXI.PixiShader(gl);

    shader.fragmentSrc = this.defaultShader.fragmentSrc;
    shader.uniforms = {};
    shader.init();

    this.defaultShader.shaders[gl.id] = shader;
};

/**
 * @method begin
 * @param renderSession {Object} The RenderSession object
 */
PIXI.WebGLSpriteBatch.prototype.begin = function (renderSession) {
    this.renderSession = renderSession;
    this.shader = this.renderSession.shaderManager.defaultShader;

    this.start();
};

/**
 * @method end
 */
PIXI.WebGLSpriteBatch.prototype.end = function () {
    this.flush();
};

/**
 * @method render
 * @param sprite {Sprite} the sprite to render when using this spritebatch
 * @param {Matrix} [matrix] - Optional matrix. If provided the Display Object will be rendered using this matrix, otherwise it will use its worldTransform.
 */
PIXI.WebGLSpriteBatch.prototype.render = function (sprite, matrix) {
    var texture = sprite.texture;
    var baseTexture = texture.baseTexture;
    var gl = this.gl;
    if (PIXI.WebGLRenderer.textureArray[baseTexture.textureIndex] != baseTexture) {
        this.flush();
        gl.activeTexture(gl.TEXTURE0 + baseTexture.textureIndex);
        gl.bindTexture(gl.TEXTURE_2D, baseTexture._glTextures[gl.id]);
        PIXI.WebGLRenderer.textureArray[baseTexture.textureIndex] = baseTexture;
    }

    //  They provided an alternative rendering matrix, so use it
    var wt = sprite.worldTransform;

    if (matrix) {
        wt = matrix;
    }

    // check texture..
    if (this.currentBatchSize >= this.size) {
        this.flush();
        this.currentBaseTexture = texture.baseTexture;
    }

    // get the uvs for the texture
    var uvs = texture._uvs;

    // if the uvs have not updated then no point rendering just yet!
    if (!uvs) {
        return;
    }

    var aX = sprite.anchor.x;
    var aY = sprite.anchor.y;

    var w0, w1, h0, h1;

    if (texture.trim) {
        // if the sprite is trimmed then we need to add the extra space before transforming the sprite coords.
        var trim = texture.trim;

        w1 = trim.x - aX * trim.width;
        w0 = w1 + texture.crop.width;

        h1 = trim.y - aY * trim.height;
        h0 = h1 + texture.crop.height;
    } else {
        w0 = (texture.frame.width) * (1 - aX);
        w1 = (texture.frame.width) * -aX;

        h0 = texture.frame.height * (1 - aY);
        h1 = texture.frame.height * -aY;
    }

    var i = this.currentBatchSize * this.vertexSize; //4 * this.vertSize;
    var tiOffset = this.currentBatchSize * 4;
    var resolution = texture.baseTexture.resolution;
    var textureIndex = texture.baseTexture.textureIndex;

    var a = wt.a / resolution;
    var b = wt.b / resolution;
    var c = wt.c / resolution;
    var d = wt.d / resolution;
    var tx = wt.tx;
    var ty = wt.ty;

    var cw = texture.crop.width;
    var ch = texture.crop.height;

    if (texture.rotated)
    {
        var a0 = wt.a;
        var b0 = wt.b;
        var c0 = wt.c;
        var d0 = wt.d;
        var _w1 = w1;
        var _w0 = w0;

        // Offset before rotating
        tx = wt.c * ch + tx;
        ty = wt.d * ch + ty;
        
        // Rotate matrix by 90 degrees
        // We use precalculated values for sine and cosine of rad(90)
        a = a0 * 6.123233995736766e-17 + -c0;
        b = b0 * 6.123233995736766e-17 + -d0;
        c = a0 + c0 * 6.123233995736766e-17;
        d = b0 + d0 * 6.123233995736766e-17;

        // Update UV coordinates
        texture._updateUvsInverted();

        // Rotate dimensions
        w0 = h0;
        w1 = h1;
        h0 = _w0;
        h1 = _w1;   
    }

    var colors = this.colors;
    var positions = this.positions;
    var tint = sprite.tint;
    var color = (tint >> 16) + (tint & 0xff00) + ((tint & 0xff) << 16) + (sprite.worldAlpha * 255 << 24);

    if (this.renderSession.roundPixels) {
        positions[i++] = a * w1 + c * h1 + tx | 0;
        positions[i++] = d * h1 + b * w1 + ty | 0;
        positions[i++] = uvs.x0;
        positions[i++] = uvs.y0;
        colors[i++] = color;
        positions[i++] = textureIndex;

        positions[i++] = a * w0 + c * h1 + tx | 0;
        positions[i++] = d * h1 + b * w0 + ty | 0;
        positions[i++] = uvs.x1;
        positions[i++] = uvs.y1;
        colors[i++] = color;
        positions[i++] = textureIndex;

        positions[i++] = a * w0 + c * h0 + tx | 0;
        positions[i++] = d * h0 + b * w0 + ty | 0;
        positions[i++] = uvs.x2;
        positions[i++] = uvs.y2;
        colors[i++] = color;
        positions[i++] = textureIndex;

        positions[i++] = a * w1 + c * h0 + tx | 0;
        positions[i++] = d * h0 + b * w1 + ty | 0;
        positions[i++] = uvs.x3;
        positions[i++] = uvs.y3;
        colors[i++] = color;
        positions[i++] = textureIndex;
    } else {
        positions[i++] = a * w1 + c * h1 + tx;
        positions[i++] = d * h1 + b * w1 + ty;
        positions[i++] = uvs.x0;
        positions[i++] = uvs.y0;
        colors[i++] = color;
        positions[i++] = textureIndex;

        positions[i++] = a * w0 + c * h1 + tx;
        positions[i++] = d * h1 + b * w0 + ty;
        positions[i++] = uvs.x1;
        positions[i++] = uvs.y1;
        colors[i++] = color;
        positions[i++] = textureIndex;

        positions[i++] = a * w0 + c * h0 + tx;
        positions[i++] = d * h0 + b * w0 + ty;
        positions[i++] = uvs.x2;
        positions[i++] = uvs.y2;
        colors[i++] = color;
        positions[i++] = textureIndex;

        positions[i++] = a * w1 + c * h0 + tx;
        positions[i++] = d * h0 + b * w1 + ty;
        positions[i++] = uvs.x3;
        positions[i++] = uvs.y3;
        colors[i++] = color;
        positions[i++] = textureIndex;
    }
    // increment the batchsize
    this.sprites[this.currentBatchSize++] = sprite;
};

/**
 * Renders a TilingSprite using the spriteBatch.
 * 
 * @method renderTilingSprite
 * @param sprite {TilingSprite} the sprite to render
 */
PIXI.WebGLSpriteBatch.prototype.renderTilingSprite = function (sprite) {
    var texture = sprite.tilingTexture;
    var baseTexture = texture.baseTexture;
    var gl = this.gl;
    var textureIndex = sprite.texture.baseTexture.textureIndex;
    if (PIXI.WebGLRenderer.textureArray[textureIndex] != baseTexture) {
        this.flush();
        gl.activeTexture(gl.TEXTURE0 + textureIndex);
        gl.bindTexture(gl.TEXTURE_2D, baseTexture._glTextures[gl.id]);
        PIXI.WebGLRenderer.textureArray[textureIndex] = baseTexture;
    }

    // check texture..
    if (this.currentBatchSize >= this.size) {
        this.flush();
        this.currentBaseTexture = texture.baseTexture;
    }

    // set the textures uvs temporarily
    if (!sprite._uvs) {
        sprite._uvs = new PIXI.TextureUvs();
    }

    var uvs = sprite._uvs;

    var w = texture.baseTexture.width;
    var h = texture.baseTexture.height;

    // var w = sprite._frame.sourceSizeW;
    // var h = sprite._frame.sourceSizeH;

    // w = 16;
    // h = 16;

    sprite.tilePosition.x %= w * sprite.tileScaleOffset.x;
    sprite.tilePosition.y %= h * sprite.tileScaleOffset.y;

    var offsetX = sprite.tilePosition.x / (w * sprite.tileScaleOffset.x);
    var offsetY = sprite.tilePosition.y / (h * sprite.tileScaleOffset.y);

    var scaleX = (sprite.width / w) / (sprite.tileScale.x * sprite.tileScaleOffset.x);
    var scaleY = (sprite.height / h) / (sprite.tileScale.y * sprite.tileScaleOffset.y);

    uvs.x0 = 0 - offsetX;
    uvs.y0 = 0 - offsetY;

    uvs.x1 = (1 * scaleX) - offsetX;
    uvs.y1 = 0 - offsetY;

    uvs.x2 = (1 * scaleX) - offsetX;
    uvs.y2 = (1 * scaleY) - offsetY;

    uvs.x3 = 0 - offsetX;
    uvs.y3 = (1 * scaleY) - offsetY;

    //  Get the sprites current alpha and tint and combine them into a single color
    var tint = sprite.tint;
    var color = (tint >> 16) + (tint & 0xff00) + ((tint & 0xff) << 16) + (sprite.worldAlpha * 255 << 24);

    var positions = this.positions;
    var colors = this.colors;

    var width = sprite.width;
    var height = sprite.height;

    // TODO trim??
    var aX = sprite.anchor.x;
    var aY = sprite.anchor.y;
    var w0 = width * (1 - aX);
    var w1 = width * -aX;

    var h0 = height * (1 - aY);
    var h1 = height * -aY;

    var i = this.currentBatchSize * this.vertexSize; //4 * this.vertSize;

    var resolution = texture.baseTexture.resolution;

    var wt = sprite.worldTransform;

    var a = wt.a / resolution;
    var b = wt.b / resolution;
    var c = wt.c / resolution;
    var d = wt.d / resolution;
    var tx = wt.tx;
    var ty = wt.ty;
    // xy
    positions[i++] = a * w1 + c * h1 + tx;
    positions[i++] = d * h1 + b * w1 + ty;
    // uv
    positions[i++] = uvs.x0;
    positions[i++] = uvs.y0;
    // color
    colors[i++] = color;
    // texture index
    positions[i++] = textureIndex;

    // xy
    positions[i++] = (a * w0 + c * h1 + tx);
    positions[i++] = d * h1 + b * w0 + ty;
    // uv
    positions[i++] = uvs.x1;
    positions[i++] = uvs.y1;
    // color
    colors[i++] = color;
    // texture index
    positions[i++] = textureIndex;

    // xy
    positions[i++] = a * w0 + c * h0 + tx;
    positions[i++] = d * h0 + b * w0 + ty;
    // uv
    positions[i++] = uvs.x2;
    positions[i++] = uvs.y2;
    // color
    colors[i++] = color;
    // texture index
    positions[i++] = textureIndex;

    // xy
    positions[i++] = a * w1 + c * h0 + tx;
    positions[i++] = d * h0 + b * w1 + ty;
    // uv
    positions[i++] = uvs.x3;
    positions[i++] = uvs.y3;
    // color
    colors[i++] = color;
    // texture index
    positions[i++] = textureIndex;

    // increment the batchsize
    this.sprites[this.currentBatchSize++] = sprite;
};

/**
 * Renders the content and empties the current batch.
 *
 * @method flush
 */
PIXI.WebGLSpriteBatch.prototype.flush = function () {
    // If the batch is length 0 then return as there is nothing to draw
    if (this.currentBatchSize === 0) {
        return;
    }

    var gl = this.gl;
    var shader;

    if (this.dirty) {
        this.dirty = false;

        shader = this.defaultShader.shaders[gl.id];

        // bind the main texture
        gl.activeTexture(gl.TEXTURE0);

        // bind the buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        // this is the same for each shader?
        var stride = this.vertexSize; //this.vertSize * 4;
        gl.vertexAttribPointer(shader.aVertexPosition, 2, gl.FLOAT, false, stride, 0);
        gl.vertexAttribPointer(shader.aTextureCoord, 2, gl.FLOAT, false, stride, 8);

        // color attributes will be interpreted as unsigned bytes and normalized
        gl.vertexAttribPointer(shader.colorAttribute, 4, gl.UNSIGNED_BYTE, true, stride, 16);

        // Texture index
        gl.vertexAttribPointer(shader.aTextureIndex, 1, gl.FLOAT, false, stride, 20);
    }

    // upload the verts to the buffer  
    if (this.currentBatchSize > (this.size * 0.5)) {
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertices);
    } else {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        var view = this.positions.subarray(0, this.currentBatchSize * this.vertexSize);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, view);
    }

    var nextTexture, nextBlendMode, nextShader;
    var batchSize = 0;
    var start = 0;

    var currentBaseTexture = null;
    var currentBlendMode = this.renderSession.blendModeManager.currentBlendMode;
    var currentShader = null;

    var blendSwap = false;
    var shaderSwap = false;
    var sprite;
    var textureIndex = 0;

    for (var i = 0, j = this.currentBatchSize; i < j; i++) {

        sprite = this.sprites[i];

        if (sprite.tilingTexture) {
            nextTexture = sprite.tilingTexture.baseTexture;
        } else {
            nextTexture = sprite.texture.baseTexture;
        }

        nextBlendMode = sprite.blendMode;
        nextShader = sprite.shader || this.defaultShader;

        blendSwap = currentBlendMode !== nextBlendMode;
        shaderSwap = currentShader !== nextShader; // should I use _UIDS???

        var skip = nextTexture.skipRender;

        if (skip && sprite.children.length > 0) {
            skip = false;
        }
        //
        if (/*(currentBaseTexture != nextTexture && !skip) ||*/
            blendSwap ||
            shaderSwap) {
            this.renderBatch(currentBaseTexture, batchSize, start);

            start = i;
            batchSize = 0;
            currentBaseTexture = nextTexture;

            if (blendSwap) {
                currentBlendMode = nextBlendMode;
                this.renderSession.blendModeManager.setBlendMode(currentBlendMode);
            }

            if (shaderSwap) {
                currentShader = nextShader;

                shader = currentShader.shaders[gl.id];

                if (!shader) {
                    shader = new PIXI.PixiShader(gl);

                    shader.fragmentSrc = currentShader.fragmentSrc;
                    shader.uniforms = currentShader.uniforms;
                    shader.init();

                    currentShader.shaders[gl.id] = shader;
                }

                // set shader function???
                this.renderSession.shaderManager.setShader(shader);

                if (shader.dirty) {
                    shader.syncUniforms();
                }

                // both these only need to be set if they are changing..
                // set the projection
                var projection = this.renderSession.projection;
                gl.uniform2f(shader.projectionVector, projection.x, projection.y);

                // TODO - this is temporary!
                var offsetVector = this.renderSession.offset;
                gl.uniform2f(shader.offsetVector, offsetVector.x, offsetVector.y);

                // set the pointers
            }
        }

        batchSize++;
    }

    this.renderBatch(currentBaseTexture, batchSize, start);

    // then reset the batch!
    this.currentBatchSize = 0;
};

/**
 * @method renderBatch
 * @param texture {Texture}
 * @param size {Number}
 * @param startIndex {Number}
 */
PIXI.WebGLSpriteBatch.prototype.renderBatch = function (texture, size, startIndex) {
    if (size === 0) {
        return;
    }

    var gl = this.gl;

    // check if a texture is dirty..
    if (texture._dirty[gl.id]) {
        if (!this.renderSession.renderer.updateTexture(texture)) {
            //  If updateTexture returns false then we cannot render it, so bail out now
            return;
        }
    }
    gl.drawElements(gl.TRIANGLES, size * 6, gl.UNSIGNED_SHORT, startIndex * 6 * 2);
    // increment the draw count
    this.renderSession.drawCount++;
};

/**
 * @method stop
 */
PIXI.WebGLSpriteBatch.prototype.stop = function () {
    this.flush();
    this.dirty = true;
};

/**
 * @method start
 */
PIXI.WebGLSpriteBatch.prototype.start = function () {
    this.dirty = true;
};

/**
 * Destroys the SpriteBatch.
 * 
 * @method destroy
 */
PIXI.WebGLSpriteBatch.prototype.destroy = function () {
    this.vertices = null;
    this.indices = null;

    this.gl.deleteBuffer(this.vertexBuffer);
    this.gl.deleteBuffer(this.indexBuffer);

    this.currentBaseTexture = null;

    this.gl = null;
};
/**
 * @author Mat Groves
 * 
 * Big thanks to the very clever Matt DesLauriers <mattdesl> https://github.com/mattdesl/
 * for creating the original pixi version!
 *
 * Heavily inspired by LibGDX's WebGLSpriteBatch:
 * https://github.com/libgdx/libgdx/blob/master/gdx/src/com/badlogic/gdx/graphics/g2d/WebGLSpriteBatch.java
 */

/**
* @class WebGLFastSpriteBatch
* @constructor
*/
PIXI.WebGLFastSpriteBatch = function(gl)
{

    /**
     * @property vertSize
     * @type Number
     */
    this.vertSize = 11;

    /**
     * @property maxSize
     * @type Number
     */
    this.maxSize = 6000;//Math.pow(2, 16) /  this.vertSize;

    /**
     * @property size
     * @type Number
     */
    this.size = this.maxSize;

    //the total number of floats in our batch
    var numVerts = this.size * 4 *  this.vertSize;

    //the total number of indices in our batch
    var numIndices = this.maxSize * 6;

    /**
     * Vertex data
     * @property vertices
     * @type Float32Array
     */
    this.vertices = new Float32Array(numVerts);

    /**
     * Index data
     * @property indices
     * @type Uint16Array
     */
    this.indices = new Uint16Array(numIndices);
    
    /**
     * @property vertexBuffer
     * @type Object
     */
    this.vertexBuffer = null;

    /**
     * @property indexBuffer
     * @type Object
     */
    this.indexBuffer = null;

    /**
     * @property lastIndexCount
     * @type Number
     */
    this.lastIndexCount = 0;

    for (var i=0, j=0; i < numIndices; i += 6, j += 4)
    {
        this.indices[i + 0] = j + 0;
        this.indices[i + 1] = j + 1;
        this.indices[i + 2] = j + 2;
        this.indices[i + 3] = j + 0;
        this.indices[i + 4] = j + 2;
        this.indices[i + 5] = j + 3;
    }

    /**
     * @property drawing
     * @type Boolean
     */
    this.drawing = false;

    /**
     * @property currentBatchSize
     * @type Number
     */
    this.currentBatchSize = 0;

    /**
     * @property currentBaseTexture
     * @type BaseTexture
     */
    this.currentBaseTexture = null;
   
    /**
     * @property currentBlendMode
     * @type Number
     */
    this.currentBlendMode = 0;

    /**
     * @property renderSession
     * @type Object
     */
    this.renderSession = null;
    
    /**
     * @property shader
     * @type Object
     */
    this.shader = null;

    /**
     * @property matrix
     * @type Matrix
     */
    this.matrix = null;

    this.setContext(gl);
};

PIXI.WebGLFastSpriteBatch.prototype.constructor = PIXI.WebGLFastSpriteBatch;

/**
 * Sets the WebGL Context.
 *
 * @method setContext
 * @param gl {WebGLContext} the current WebGL drawing context
 */
PIXI.WebGLFastSpriteBatch.prototype.setContext = function(gl)
{
    this.gl = gl;

    // create a couple of buffers
    this.vertexBuffer = gl.createBuffer();
    this.indexBuffer = gl.createBuffer();

    // 65535 is max index, so 65535 / 6 = 10922.

    //upload the index data
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
};

/**
 * @method begin
 * @param spriteBatch {WebGLSpriteBatch}
 * @param renderSession {Object}
 */
PIXI.WebGLFastSpriteBatch.prototype.begin = function(spriteBatch, renderSession)
{
    this.renderSession = renderSession;
    this.shader = this.renderSession.shaderManager.fastShader;

    this.matrix = spriteBatch.worldTransform.toArray(true);

    this.start();
};

/**
 * @method end
 */
PIXI.WebGLFastSpriteBatch.prototype.end = function()
{
    this.flush();
};

/**
 * @method render
 * @param spriteBatch {WebGLSpriteBatch}
 */
PIXI.WebGLFastSpriteBatch.prototype.render = function (spriteBatch)
{
    var children = spriteBatch.children;
    var sprite = children[0];

    // if the uvs have not updated then no point rendering just yet!
    
    // check texture.
    if(!sprite.texture._uvs)return;
   
    this.currentBaseTexture = sprite.texture.baseTexture;

    // check blend mode
    if(sprite.blendMode !== this.renderSession.blendModeManager.currentBlendMode)
    {
        this.flush();
        this.renderSession.blendModeManager.setBlendMode(sprite.blendMode);
    }
    
    for(var i=0,j= children.length; i<j; i++)
    {
        this.renderSprite(children[i]);
    }

    this.flush();
};

/**
 * @method renderSprite
 * @param sprite {Sprite}
 */
PIXI.WebGLFastSpriteBatch.prototype.renderSprite = function(sprite)
{
    var texture = sprite.texture;
    var baseTexture = texture.baseTexture;
    var gl = this.gl;
    var textureIndex = sprite.texture.baseTexture.textureIndex;
    
    if (PIXI.WebGLRenderer.textureArray[textureIndex] != baseTexture &&
        baseTexture._glTextures[gl.id] && !sprite.texture.baseTexture.skipRender) {
        this.flush();
        gl.activeTexture(gl.TEXTURE0 + textureIndex);
        gl.bindTexture(gl.TEXTURE_2D, baseTexture._glTextures[gl.id]);
        PIXI.WebGLRenderer.textureArray[textureIndex] = baseTexture;
        if(!sprite.texture._uvs)return;

    }
    //sprite = children[i];
    if(!sprite.visible)return;
    
    var uvs, vertices = this.vertices, width, height, w0, w1, h0, h1, index;

    uvs = sprite.texture._uvs;

    width = sprite.texture.frame.width;
    height = sprite.texture.frame.height;

    if (sprite.texture.trim)
    {
        // if the sprite is trimmed then we need to add the extra space before transforming the sprite coords..
        var trim = sprite.texture.trim;

        w1 = trim.x - sprite.anchor.x * trim.width;
        w0 = w1 + sprite.texture.crop.width;

        h1 = trim.y - sprite.anchor.y * trim.height;
        h0 = h1 + sprite.texture.crop.height;
    }
    else
    {
        w0 = (sprite.texture.frame.width ) * (1-sprite.anchor.x);
        w1 = (sprite.texture.frame.width ) * -sprite.anchor.x;

        h0 = sprite.texture.frame.height * (1-sprite.anchor.y);
        h1 = sprite.texture.frame.height * -sprite.anchor.y;
    }

    index = this.currentBatchSize * 4 * this.vertSize;
    // xy
    vertices[index++] = w1;
    vertices[index++] = h1;

    vertices[index++] = sprite.position.x;
    vertices[index++] = sprite.position.y;

    //scale
    vertices[index++] = sprite.scale.x;
    vertices[index++] = sprite.scale.y;

    //rotation
    vertices[index++] = sprite.rotation;

    // uv
    vertices[index++] = uvs.x0;
    vertices[index++] = uvs.y1;
    // color
    vertices[index++] = sprite.alpha;
    // texture Index
    vertices[index++] = textureIndex;
 

    // xy
    vertices[index++] = w0;
    vertices[index++] = h1;

    vertices[index++] = sprite.position.x;
    vertices[index++] = sprite.position.y;

    //scale
    vertices[index++] = sprite.scale.x;
    vertices[index++] = sprite.scale.y;

     //rotation
    vertices[index++] = sprite.rotation;

    // uv
    vertices[index++] = uvs.x1;
    vertices[index++] = uvs.y1;
    // color
    vertices[index++] = sprite.alpha;
    // texture Index
    vertices[index++] = textureIndex;

    // xy
    vertices[index++] = w0;
    vertices[index++] = h0;

    vertices[index++] = sprite.position.x;
    vertices[index++] = sprite.position.y;

    //scale
    vertices[index++] = sprite.scale.x;
    vertices[index++] = sprite.scale.y;

     //rotation
    vertices[index++] = sprite.rotation;

    // uv
    vertices[index++] = uvs.x2;
    vertices[index++] = uvs.y2;
    // color
    vertices[index++] = sprite.alpha;
    // texture Index
    vertices[index++] = textureIndex;



    // xy
    vertices[index++] = w1;
    vertices[index++] = h0;

    vertices[index++] = sprite.position.x;
    vertices[index++] = sprite.position.y;

    //scale
    vertices[index++] = sprite.scale.x;
    vertices[index++] = sprite.scale.y;

     //rotation
    vertices[index++] = sprite.rotation;

    // uv
    vertices[index++] = uvs.x3;
    vertices[index++] = uvs.y3;
    // color
    vertices[index++] = sprite.alpha;
    // texture Index
    vertices[index++] = textureIndex;

    // increment the batchs
    this.currentBatchSize++;

    if(this.currentBatchSize >= this.size)
    {
        this.flush();
    }
};

/**
 * @method flush
 */
PIXI.WebGLFastSpriteBatch.prototype.flush = function()
{
    // If the batch is length 0 then return as there is nothing to draw
    if (this.currentBatchSize===0)return;

    var gl = this.gl;
    
    // bind the current texture

    if(!this.currentBaseTexture._glTextures[gl.id]) {
        this.renderSession.renderer.updateTexture(this.currentBaseTexture, gl);
        return;
    }

    //gl.bindTexture(gl.TEXTURE_2D, this.currentBaseTexture._glTextures[gl.id]);

    // upload the verts to the buffer
   
    if(this.currentBatchSize > ( this.size * 0.5 ) )
    {
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertices);
    }
    else
    {
        var view = this.vertices.subarray(0, this.currentBatchSize * 4 * this.vertSize);

        gl.bufferSubData(gl.ARRAY_BUFFER, 0, view);
    }
    
    // now draw those suckas!
    gl.drawElements(gl.TRIANGLES, this.currentBatchSize * 6, gl.UNSIGNED_SHORT, 0);
   
    // then reset the batch!
    this.currentBatchSize = 0;

    // increment the draw count
    this.renderSession.drawCount++;
};


/**
 * @method stop
 */
PIXI.WebGLFastSpriteBatch.prototype.stop = function()
{
    this.flush();
};

/**
 * @method start
 */
PIXI.WebGLFastSpriteBatch.prototype.start = function()
{
    var gl = this.gl;

    // bind the main texture
    gl.activeTexture(gl.TEXTURE0);

    // bind the buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

    // set the projection
    var projection = this.renderSession.projection;
    gl.uniform2f(this.shader.projectionVector, projection.x, projection.y);

    // set the matrix
    gl.uniformMatrix3fv(this.shader.uMatrix, false, this.matrix);

    // set the pointers
    var stride =  this.vertSize * 4;

    gl.vertexAttribPointer(this.shader.aVertexPosition, 2, gl.FLOAT, false, stride, 0);
    gl.vertexAttribPointer(this.shader.aPositionCoord, 2, gl.FLOAT, false, stride, 2 * 4);
    gl.vertexAttribPointer(this.shader.aScale, 2, gl.FLOAT, false, stride, 4 * 4);
    gl.vertexAttribPointer(this.shader.aRotation, 1, gl.FLOAT, false, stride, 6 * 4);
    gl.vertexAttribPointer(this.shader.aTextureCoord, 2, gl.FLOAT, false, stride, 7 * 4);
    gl.vertexAttribPointer(this.shader.colorAttribute, 1, gl.FLOAT, false, stride, 9 * 4);
    gl.vertexAttribPointer(this.shader.aTextureIndex, 1, gl.FLOAT, false, stride, 10 * 4);
    
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
* @class WebGLFilterManager
* @constructor
*/
PIXI.WebGLFilterManager = function()
{
    /**
     * @property filterStack
     * @type Array
     */
    this.filterStack = [];
    
    /**
     * @property offsetX
     * @type Number
     */
    this.offsetX = 0;

    /**
     * @property offsetY
     * @type Number
     */
    this.offsetY = 0;
};

PIXI.WebGLFilterManager.prototype.constructor = PIXI.WebGLFilterManager;

/**
* Initialises the context and the properties.
* 
* @method setContext 
* @param gl {WebGLContext} the current WebGL drawing context
*/
PIXI.WebGLFilterManager.prototype.setContext = function(gl)
{
    this.gl = gl;
    this.texturePool = [];

    this.initShaderBuffers();
};

/**
* @method begin
* @param renderSession {RenderSession} 
* @param buffer {ArrayBuffer} 
*/
PIXI.WebGLFilterManager.prototype.begin = function(renderSession, buffer)
{
    this.renderSession = renderSession;
    this.defaultShader = renderSession.shaderManager.defaultShader;

    var projection = this.renderSession.projection;
    this.width = projection.x * 2;
    this.height = -projection.y * 2;
    this.buffer = buffer;
};

/**
* Applies the filter and adds it to the current filter stack.
* 
* @method pushFilter
* @param filterBlock {Object} the filter that will be pushed to the current filter stack
*/
PIXI.WebGLFilterManager.prototype.pushFilter = function(filterBlock)
{
    var gl = this.gl;

    var projection = this.renderSession.projection;
    var offset = this.renderSession.offset;

    filterBlock._filterArea = filterBlock.target.filterArea || filterBlock.target.getBounds();
    
    // >>> modify by nextht
    filterBlock._previous_stencil_mgr = this.renderSession.stencilManager;
    this.renderSession.stencilManager = new PIXI.WebGLStencilManager();
    this.renderSession.stencilManager.setContext(gl);
    gl.disable(gl.STENCIL_TEST);
    // <<<  modify by nextht 
   
    // filter program
    // OPTIMISATION - the first filter is free if its a simple color change?
    this.filterStack.push(filterBlock);

    var filter = filterBlock.filterPasses[0];

    this.offsetX += filterBlock._filterArea.x;
    this.offsetY += filterBlock._filterArea.y;

    var texture = this.texturePool.pop();
    if(!texture)
    {
        texture = new PIXI.FilterTexture(this.gl, this.width * this.renderSession.resolution, this.height * this.renderSession.resolution);
    }
    else
    {
        texture.resize(this.width * this.renderSession.resolution, this.height * this.renderSession.resolution);
    }

    gl.bindTexture(gl.TEXTURE_2D,  texture.texture);

    var filterArea = filterBlock._filterArea;// filterBlock.target.getBounds();///filterBlock.target.filterArea;

    var padding = filter.padding;
    filterArea.x -= padding;
    filterArea.y -= padding;
    filterArea.width += padding * 2;
    filterArea.height += padding * 2;

    // cap filter to screen size..
    if(filterArea.x < 0)filterArea.x = 0;
    if(filterArea.width > this.width)filterArea.width = this.width;
    if(filterArea.y < 0)filterArea.y = 0;
    if(filterArea.height > this.height)filterArea.height = this.height;

    //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,  filterArea.width, filterArea.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, texture.frameBuffer);

    // set view port
    gl.viewport(0, 0, filterArea.width * this.renderSession.resolution, filterArea.height * this.renderSession.resolution);

    projection.x = filterArea.width/2;
    projection.y = -filterArea.height/2;

    offset.x = -filterArea.x;
    offset.y = -filterArea.y;

    // update projection
    // now restore the regular shader..
    // this.renderSession.shaderManager.setShader(this.defaultShader);
    //gl.uniform2f(this.defaultShader.projectionVector, filterArea.width/2, -filterArea.height/2);
    //gl.uniform2f(this.defaultShader.offsetVector, -filterArea.x, -filterArea.y);

    gl.colorMask(true, true, true, true);
    gl.clearColor(0,0,0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    filterBlock._glFilterTexture = texture;

};

/**
* Removes the last filter from the filter stack and doesn't return it.
* 
* @method popFilter
*/
PIXI.WebGLFilterManager.prototype.popFilter = function()
{
    var gl = this.gl;
    var filterBlock = this.filterStack.pop();
    var filterArea = filterBlock._filterArea;
    var texture = filterBlock._glFilterTexture;
    var projection = this.renderSession.projection;
    var offset = this.renderSession.offset;

    if(filterBlock.filterPasses.length > 1)
    {
        gl.viewport(0, 0, filterArea.width * this.renderSession.resolution, filterArea.height * this.renderSession.resolution);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

        this.vertexArray[0] = 0;
        this.vertexArray[1] = filterArea.height;

        this.vertexArray[2] = filterArea.width;
        this.vertexArray[3] = filterArea.height;

        this.vertexArray[4] = 0;
        this.vertexArray[5] = 0;

        this.vertexArray[6] = filterArea.width;
        this.vertexArray[7] = 0;

        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertexArray);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
        // now set the uvs..
        this.uvArray[2] = filterArea.width/this.width;
        this.uvArray[5] = filterArea.height/this.height;
        this.uvArray[6] = filterArea.width/this.width;
        this.uvArray[7] = filterArea.height/this.height;

        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.uvArray);

        var inputTexture = texture;
        var outputTexture = this.texturePool.pop();
        if(!outputTexture)outputTexture = new PIXI.FilterTexture(this.gl, this.width * this.renderSession.resolution, this.height * this.renderSession.resolution);
        outputTexture.resize(this.width * this.renderSession.resolution, this.height * this.renderSession.resolution);

        // need to clear this FBO as it may have some left over elements from a previous filter.
        gl.bindFramebuffer(gl.FRAMEBUFFER, outputTexture.frameBuffer );
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.disable(gl.BLEND);

        for (var i = 0; i < filterBlock.filterPasses.length-1; i++)
        {
            var filterPass = filterBlock.filterPasses[i];

            gl.bindFramebuffer(gl.FRAMEBUFFER, outputTexture.frameBuffer );

            // set texture
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, inputTexture.texture);

            // draw texture..
            //filterPass.applyFilterPass(filterArea.width, filterArea.height);
            this.applyFilterPass(filterPass, filterArea, filterArea.width, filterArea.height);

            // swap the textures..
            var temp = inputTexture;
            inputTexture = outputTexture;
            outputTexture = temp;
        }

        gl.enable(gl.BLEND);

        texture = inputTexture;
        this.texturePool.push(outputTexture);
    }

    var filter = filterBlock.filterPasses[filterBlock.filterPasses.length-1];

    this.offsetX -= filterArea.x;
    this.offsetY -= filterArea.y;

    var sizeX = this.width;
    var sizeY = this.height;

    var offsetX = 0;
    var offsetY = 0;

    var buffer = this.buffer;

    // time to render the filters texture to the previous scene
    if(this.filterStack.length === 0)
    {
        gl.colorMask(true, true, true, true);//this.transparent);
    }
    else
    {
        var currentFilter = this.filterStack[this.filterStack.length-1];
        filterArea = currentFilter._filterArea;

        sizeX = filterArea.width;
        sizeY = filterArea.height;

        offsetX = filterArea.x;
        offsetY = filterArea.y;

        buffer =  currentFilter._glFilterTexture.frameBuffer;
    }

    // TODO need to remove these global elements..
    projection.x = sizeX/2;
    projection.y = -sizeY/2;

    offset.x = offsetX;
    offset.y = offsetY;

    filterArea = filterBlock._filterArea;

    var x = filterArea.x-offsetX;
    var y = filterArea.y-offsetY;

    // update the buffers..
    // make sure to flip the y!
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

    this.vertexArray[0] = x;
    this.vertexArray[1] = y + filterArea.height;

    this.vertexArray[2] = x + filterArea.width;
    this.vertexArray[3] = y + filterArea.height;

    this.vertexArray[4] = x;
    this.vertexArray[5] = y;

    this.vertexArray[6] = x + filterArea.width;
    this.vertexArray[7] = y;

    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertexArray);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);

    this.uvArray[2] = filterArea.width/this.width;
    this.uvArray[5] = filterArea.height/this.height;
    this.uvArray[6] = filterArea.width/this.width;
    this.uvArray[7] = filterArea.height/this.height;

    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.uvArray);

    gl.viewport(0, 0, sizeX * this.renderSession.resolution, sizeY * this.renderSession.resolution);

    // bind the buffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, buffer );

    // set the blend mode! 
    //gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

    // set texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture.texture);

    // >>> modify by nextht
    if (this.renderSession.stencilManager) {
        this.renderSession.stencilManager.destroy();
    }
    this.renderSession.stencilManager = filterBlock._previous_stencil_mgr;
    filterBlock._previous_stencil_mgr = null;
    if (this.renderSession.stencilManager.count > 0) {
        gl.enable(gl.STENCIL_TEST);
    }
    else {
        gl.disable(gl.STENCIL_TEST);
    }    
    // <<< modify by nextht

    // apply!
    this.applyFilterPass(filter, filterArea, sizeX, sizeY);

    // now restore the regular shader.. should happen automatically now..
    // this.renderSession.shaderManager.setShader(this.defaultShader);
    // gl.uniform2f(this.defaultShader.projectionVector, sizeX/2, -sizeY/2);
    // gl.uniform2f(this.defaultShader.offsetVector, -offsetX, -offsetY);

    // return the texture to the pool
    this.texturePool.push(texture);
    filterBlock._glFilterTexture = null;
};


/**
* Applies the filter to the specified area.
* 
* @method applyFilterPass
* @param filter {Phaser.Filter} the filter that needs to be applied
* @param filterArea {Texture} TODO - might need an update
* @param width {Number} the horizontal range of the filter
* @param height {Number} the vertical range of the filter
*/
PIXI.WebGLFilterManager.prototype.applyFilterPass = function(filter, filterArea, width, height)
{
    // use program
    var gl = this.gl;
    var shader = filter.shaders[gl.id];

    if(!shader)
    {
        shader = new PIXI.PixiShader(gl);

        shader.fragmentSrc = filter.fragmentSrc;
        shader.uniforms = filter.uniforms;
        shader.init(true);

        filter.shaders[gl.id] = shader;
    }

    // set the shader
    this.renderSession.shaderManager.setShader(shader);

//    gl.useProgram(shader.program);

    gl.uniform2f(shader.projectionVector, width/2, -height/2);
    gl.uniform2f(shader.offsetVector, 0,0);

    if(filter.uniforms.dimensions)
    {
        filter.uniforms.dimensions.value[0] = this.width;//width;
        filter.uniforms.dimensions.value[1] = this.height;//height;
        filter.uniforms.dimensions.value[2] = this.vertexArray[0];
        filter.uniforms.dimensions.value[3] = this.vertexArray[5];//filterArea.height;
    }

    shader.syncUniforms();

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(shader.aVertexPosition, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
    gl.vertexAttribPointer(shader.aTextureCoord, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.vertexAttribPointer(shader.colorAttribute, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

    // draw the filter...
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );

    this.renderSession.drawCount++;
};

/**
* Initialises the shader buffers.
* 
* @method initShaderBuffers
*/
PIXI.WebGLFilterManager.prototype.initShaderBuffers = function()
{
    var gl = this.gl;

    // create some buffers
    this.vertexBuffer = gl.createBuffer();
    this.uvBuffer = gl.createBuffer();
    this.colorBuffer = gl.createBuffer();
    this.indexBuffer = gl.createBuffer();

    // bind and upload the vertexs..
    // keep a reference to the vertexFloatData..
    this.vertexArray = new Float32Array([0.0, 0.0,
                                         1.0, 0.0,
                                         0.0, 1.0,
                                         1.0, 1.0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertexArray, gl.STATIC_DRAW);

    // bind and upload the uv buffer
    this.uvArray = new Float32Array([0.0, 0.0,
                                     1.0, 0.0,
                                     0.0, 1.0,
                                     1.0, 1.0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.uvArray, gl.STATIC_DRAW);

    this.colorArray = new Float32Array([1.0, 0xFFFFFF,
                                        1.0, 0xFFFFFF,
                                        1.0, 0xFFFFFF,
                                        1.0, 0xFFFFFF]);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.colorArray, gl.STATIC_DRAW);

    // bind and upload the index
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 1, 3, 2]), gl.STATIC_DRAW);

};

/**
* Destroys the filter and removes it from the filter stack.
* 
* @method destroy
*/
PIXI.WebGLFilterManager.prototype.destroy = function()
{
    var gl = this.gl;

    this.filterStack = null;
    
    this.offsetX = 0;
    this.offsetY = 0;

    // destroy textures
    for (var i = 0; i < this.texturePool.length; i++) {
        this.texturePool[i].destroy();
    }
    
    this.texturePool = null;

    //destroy buffers..
    gl.deleteBuffer(this.vertexBuffer);
    gl.deleteBuffer(this.uvBuffer);
    gl.deleteBuffer(this.colorBuffer);
    gl.deleteBuffer(this.indexBuffer);
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

function _CreateEmptyTexture(gl, width, height, scaleMode) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, scaleMode === PIXI.scaleModes.LINEAR ? gl.LINEAR : gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, scaleMode === PIXI.scaleModes.LINEAR ? gl.LINEAR : gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    return texture;
}

var _fbErrors = {
    36054: 'Incomplete attachment',
    36055: 'Missing attachment',
    36057: 'Incomplete dimensions',
    36061: 'Framebuffer unsupported'
};

function _CreateFramebuffer(gl, width, height, scaleMode, textureUnit) {
    var framebuffer = gl.createFramebuffer();
    var depthStencilBuffer = gl.createRenderbuffer();
    var colorBuffer = null;   
    var fbStatus = 0;
    
    gl.activeTexture(gl.TEXTURE0 + textureUnit);
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthStencilBuffer);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, this.renderBuffer);
    colorBuffer = _CreateEmptyTexture(gl, width, height, scaleMode);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, colorBuffer, 0);        
    fbStatus = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if(fbStatus !== gl.FRAMEBUFFER_COMPLETE) {
        console.error('Incomplete GL framebuffer. ', _fbErrors[fbStatus]);
    }
    framebuffer.width = width;
    framebuffer.height = height;
    framebuffer.targetTexture = colorBuffer;
    framebuffer.renderBuffer = depthStencilBuffer;
    return framebuffer;
}

/**
* @class FilterTexture
* @constructor
* @param gl {WebGLContext} the current WebGL drawing context
* @param width {Number} the horizontal range of the filter
* @param height {Number} the vertical range of the filter
* @param scaleMode {Number} See {{#crossLink "PIXI/scaleModes:property"}}PIXI.scaleModes{{/crossLink}} for possible values
*/
PIXI.FilterTexture = function(gl, width, height, scaleMode, textureUnit)
{
    textureUnit = typeof textureUnit === 'number' ? textureUnit : 0;
    /**
     * @property gl
     * @type WebGLContext
     */
    this.gl = gl;
    // next time to create a frame buffer and texture

    /**
     * @property frameBuffer
     * @type Any
     */
     this.frameBuffer = _CreateFramebuffer(gl, width, height, scaleMode || PIXI.scaleModes.DEFAULT, textureUnit);
    /**
     * @property texture
     * @type Any
     */
     this.texture = this.frameBuffer.targetTexture;
     this.width = width;
     this.height = height;
     this.renderBuffer = this.frameBuffer.renderBuffer;
};

PIXI.FilterTexture.prototype.constructor = PIXI.FilterTexture;

/**
* Clears the filter texture.
* 
* @method clear
*/
PIXI.FilterTexture.prototype.clear = function()
{
    var gl = this.gl;
    
    gl.clearColor(0,0,0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
};

/**
 * Resizes the texture to the specified width and height
 *
 * @method resize
 * @param width {Number} the new width of the texture
 * @param height {Number} the new height of the texture
 */
PIXI.FilterTexture.prototype.resize = function(width, height)
{
    if(this.width === width && this.height === height) return;

    this.width = width;
    this.height = height;

    var gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D,  this.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,  width , height , 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    // update the stencil buffer width and height
    gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, width , height );
};

/**
* Destroys the filter texture.
* 
* @method destroy
*/
PIXI.FilterTexture.prototype.destroy = function()
{
    var gl = this.gl;
    gl.deleteFramebuffer( this.frameBuffer );
    gl.deleteTexture( this.texture );

    this.frameBuffer = null;
    this.texture = null;
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * Creates a Canvas element of the given size.
 *
 * @class CanvasBuffer
 * @constructor
 * @param width {Number} the width for the newly created canvas
 * @param height {Number} the height for the newly created canvas
 */
PIXI.CanvasBuffer = function(width, height)
{
    /**
     * The width of the Canvas in pixels.
     *
     * @property width
     * @type Number
     */
    this.width = width;

    /**
     * The height of the Canvas in pixels.
     *
     * @property height
     * @type Number
     */
    this.height = height;

    /**
     * The Canvas object that belongs to this CanvasBuffer.
     *
     * @property canvas
     * @type HTMLCanvasElement
     */
    this.canvas = Phaser.CanvasPool.create(this, this.width, this.height);

    /**
     * A CanvasRenderingContext2D object representing a two-dimensional rendering context.
     *
     * @property context
     * @type CanvasRenderingContext2D
     */
    this.context = this.canvas.getContext("2d");

    this.canvas.width = width;
    this.canvas.height = height;
};

PIXI.CanvasBuffer.prototype.constructor = PIXI.CanvasBuffer;

/**
 * Clears the canvas that was created by the CanvasBuffer class.
 *
 * @method clear
 * @private
 */
PIXI.CanvasBuffer.prototype.clear = function()
{
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.clearRect(0,0, this.width, this.height);
};

/**
 * Resizes the canvas to the specified width and height.
 *
 * @method resize
 * @param width {Number} the new width of the canvas
 * @param height {Number} the new height of the canvas
 */
PIXI.CanvasBuffer.prototype.resize = function(width, height)
{
    this.width = this.canvas.width = width;
    this.height = this.canvas.height = height;
};

/**
 * Frees the canvas up for use again.
 *
 * @method destroy
 */
PIXI.CanvasBuffer.prototype.destroy = function()
{
    Phaser.CanvasPool.remove(this);
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * A set of functions used to handle masking.
 *
 * @class CanvasMaskManager
 * @constructor
 */
PIXI.CanvasMaskManager = function()
{
};

PIXI.CanvasMaskManager.prototype.constructor = PIXI.CanvasMaskManager;

/**
 * This method adds it to the current stack of masks.
 *
 * @method pushMask
 * @param maskData {Object} the maskData that will be pushed
 * @param renderSession {Object} The renderSession whose context will be used for this mask manager.
 */
PIXI.CanvasMaskManager.prototype.pushMask = function(maskData, renderSession) {

	var context = renderSession.context;

    context.save();
    
    var cacheAlpha = maskData.alpha;
    var transform = maskData.worldTransform;

    var resolution = renderSession.resolution;

    context.setTransform(transform.a * resolution,
                         transform.b * resolution,
                         transform.c * resolution,
                         transform.d * resolution,
                         transform.tx * resolution,
                         transform.ty * resolution);

    PIXI.CanvasGraphics.renderGraphicsMask(maskData, context);

    context.clip();

    maskData.worldAlpha = cacheAlpha;
};

/**
 * Restores the current drawing context to the state it was before the mask was applied.
 *
 * @method popMask
 * @param renderSession {Object} The renderSession whose context will be used for this mask manager.
 */
PIXI.CanvasMaskManager.prototype.popMask = function(renderSession)
{
    renderSession.context.restore();
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * Utility methods for Sprite/Texture tinting.
 *
 * @class CanvasTinter
 * @static
 */
PIXI.CanvasTinter = function() {};

/**
 * Basically this method just needs a sprite and a color and tints the sprite with the given color.
 * 
 * @method getTintedTexture 
 * @static
 * @param sprite {Sprite} the sprite to tint
 * @param color {Number} the color to use to tint the sprite with
 * @return {HTMLCanvasElement} The tinted canvas
 */
PIXI.CanvasTinter.getTintedTexture = function(sprite, color)
{
    var canvas = sprite.tintedTexture || Phaser.CanvasPool.create(this);
    
    PIXI.CanvasTinter.tintMethod(sprite.texture, color, canvas);

    return canvas;
};

/**
 * Tint a texture using the "multiply" operation.
 * 
 * @method tintWithMultiply
 * @static
 * @param texture {Texture} the texture to tint
 * @param color {Number} the color to use to tint the sprite with
 * @param canvas {HTMLCanvasElement} the current canvas
 */
PIXI.CanvasTinter.tintWithMultiply = function(texture, color, canvas)
{
    var context = canvas.getContext("2d");

    var crop = texture.crop;
    var w = crop.width;
    var h = crop.height;

    if (texture.rotated)
    {
        w = h;
        h = crop.width;
    }

    if (canvas.width !== w || canvas.height !== h)
    {
        canvas.width = w;
        canvas.height = h;
    }

    context.clearRect(0, 0, w, h);

    context.fillStyle = "#" + ("00000" + (color | 0).toString(16)).substr(-6);
    context.fillRect(0, 0, w, h);

    context.globalCompositeOperation = "multiply";
    context.drawImage(texture.baseTexture.source, crop.x, crop.y, w, h, 0, 0, w, h);

    context.globalCompositeOperation = "destination-atop";
    context.drawImage(texture.baseTexture.source, crop.x, crop.y, w, h, 0, 0, w, h);

};

/**
 * Tint a texture pixel per pixel.
 * 
 * @method tintPerPixel
 * @static
 * @param texture {Texture} the texture to tint
 * @param color {Number} the color to use to tint the sprite with
 * @param canvas {HTMLCanvasElement} the current canvas
 */ 
PIXI.CanvasTinter.tintWithPerPixel = function(texture, color, canvas)
{
    var context = canvas.getContext("2d");

    var crop = texture.crop;
    var w = crop.width;
    var h = crop.height;

    if (texture.rotated)
    {
        w = h;
        h = crop.width;
    }

    if (canvas.width !== w || canvas.height !== h)
    {
        canvas.width = w;
        canvas.height = h;
    }
  
    context.globalCompositeOperation = "copy";

    context.drawImage(texture.baseTexture.source, crop.x, crop.y, w, h, 0, 0, w, h);

    var rgbValues = Phaser.Color.hexToRGBArray(color);
    var r = rgbValues[0], g = rgbValues[1], b = rgbValues[2];

    var pixelData = context.getImageData(0, 0, w, h);

    var pixels = pixelData.data;

    for (var i = 0; i < pixels.length; i += 4)
    {
        pixels[i + 0] *= r;
        pixels[i + 1] *= g;
        pixels[i + 2] *= b;

        if (!PIXI.CanvasTinter.canHandleAlpha)
        {
            var alpha = pixels[i + 3];

            pixels[i + 0] /= 255 / alpha;
            pixels[i + 1] /= 255 / alpha;
            pixels[i + 2] /= 255 / alpha;
        }
    }

    context.putImageData(pixelData, 0, 0);
};


/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * The CanvasRenderer draws the Stage and all its content onto a 2d canvas. This renderer should be used for browsers that do not support webGL.
 * Don't forget to add the CanvasRenderer.view to your DOM or you will not see anything :)
 *
 * @class CanvasRenderer
 * @constructor
 * @param game {Phaser.Game} A reference to the Phaser Game instance
 */
PIXI.CanvasRenderer = function (game) {

    /**
    * @property {Phaser.Game} game - A reference to the Phaser Game instance.
    */
    this.game = game;

    if (!PIXI.defaultRenderer)
    {
        PIXI.defaultRenderer = this;
    }

    /**
     * The renderer type.
     *
     * @property type
     * @type Number
     */
    this.type = Phaser.CANVAS;

    /**
     * The resolution of the canvas.
     *
     * @property resolution
     * @type Number
     */
    this.resolution = game.resolution;

    /**
     * This sets if the CanvasRenderer will clear the canvas or not before the new render pass.
     * If the Stage is NOT transparent Pixi will use a canvas sized fillRect operation every frame to set the canvas background color.
     * If the Stage is transparent Pixi will use clearRect to clear the canvas every frame.
     * Disable this by setting this to false. For example if your game has a canvas filling background image you often don't need this set.
     *
     * @property clearBeforeRender
     * @type Boolean
     * @default
     */
    this.clearBeforeRender = game.clearBeforeRender;

    /**
     * Whether the render view is transparent
     *
     * @property transparent
     * @type Boolean
     */
    this.transparent = game.transparent;

    /**
     * Whether the render view should be resized automatically
     *
     * @property autoResize
     * @type Boolean
     */
    this.autoResize = false;

    /**
     * The width of the canvas view
     *
     * @property width
     * @type Number
     * @default 800
     */
    this.width = game.width * this.resolution;

    /**
     * The height of the canvas view
     *
     * @property height
     * @type Number
     * @default 600
     */
    this.height = game.height * this.resolution;

    /**
     * The canvas element that everything is drawn to.
     *
     * @property view
     * @type HTMLCanvasElement
     */
    this.view = game.canvas;

    /**
     * The canvas 2d context that everything is drawn with
     * @property context
     * @type CanvasRenderingContext2D
     */
    this.context = this.view.getContext("2d", { alpha: this.transparent } );

    /**
     * Boolean flag controlling canvas refresh.
     *
     * @property refresh
     * @type Boolean
     */
    this.refresh = true;

    /**
     * Internal var.
     *
     * @property count
     * @type Number
     */
    this.count = 0;

    /**
     * Instance of a PIXI.CanvasMaskManager, handles masking when using the canvas renderer
     * @property CanvasMaskManager
     * @type CanvasMaskManager
     */
    this.maskManager = new PIXI.CanvasMaskManager();

    /**
     * The render session is just a bunch of parameter used for rendering
     * @property renderSession
     * @type Object
     */
    this.renderSession = {
        context: this.context,
        maskManager: this.maskManager,
        scaleMode: null,
        smoothProperty: Phaser.Canvas.getSmoothingPrefix(this.context),

        /**
         * If true Pixi will Math.floor() x/y values when rendering, stopping pixel interpolation.
         * Handy for crisp pixel art and speed on legacy devices.
         */
        roundPixels: false
    };

    this.mapBlendModes();
    
    this.resize(this.width, this.height);

};

// constructor
PIXI.CanvasRenderer.prototype.constructor = PIXI.CanvasRenderer;

/**
 * Renders the DisplayObjectContainer, usually the Phaser.Stage, to this canvas view.
 *
 * @method render
 * @param root {Phaser.Stage|PIXI.DisplayObjectContainer} The root element to be rendered.
 */
PIXI.CanvasRenderer.prototype.render = function (root) {

    this.context.setTransform(1, 0, 0, 1, 0, 0);

    this.context.globalAlpha = 1;

    this.renderSession.currentBlendMode = 0;
    this.renderSession.shakeX = this.game.camera._shake.x;
    this.renderSession.shakeY = this.game.camera._shake.y;

    this.context.globalCompositeOperation = 'source-over';

    if (navigator.isCocoonJS && this.view.screencanvas)
    {
        this.context.fillStyle = "black";
        this.context.clear();
    }
    
    if (this.clearBeforeRender)
    {
        if (this.transparent)
        {
            this.context.clearRect(0, 0, this.width, this.height);
        }
        else if (root._bgColor)
        {
            this.context.fillStyle = root._bgColor.rgba;
            this.context.fillRect(0, 0, this.width , this.height);
        }
    }
    
    this.renderDisplayObject(root);

};

PIXI.CanvasRenderer.prototype.setTexturePriority = function (textureNameCollection) {

    //  Does nothing on Canvas, but here to allow you to simply set
    //  `game.renderer.setTexturePriority()` without having to worry about
    //  running in WebGL or not.

};

/**
 * Removes everything from the renderer and optionally removes the Canvas DOM element.
 *
 * @method destroy
 * @param [removeView=true] {boolean} Removes the Canvas element from the DOM.
 */
PIXI.CanvasRenderer.prototype.destroy = function (removeView) {

    if (removeView === undefined) { removeView = true; }

    if (removeView && this.view.parent)
    {
        this.view.parent.removeChild(this.view);
    }

    this.view = null;
    this.context = null;
    this.maskManager = null;
    this.renderSession = null;

};

/**
 * Resizes the canvas view to the specified width and height
 *
 * @method resize
 * @param width {Number} the new width of the canvas view
 * @param height {Number} the new height of the canvas view
 */
PIXI.CanvasRenderer.prototype.resize = function (width, height) {

    this.width = width * this.resolution;
    this.height = height * this.resolution;

    this.view.width = this.width;
    this.view.height = this.height;

    if (this.autoResize)
    {
        this.view.style.width = this.width / this.resolution + "px";
        this.view.style.height = this.height / this.resolution + "px";
    }

    if (this.renderSession.smoothProperty)
    {
        this.context[this.renderSession.smoothProperty] = (this.renderSession.scaleMode === PIXI.scaleModes.LINEAR);
    }

};

/**
 * Renders a display object
 *
 * @method renderDisplayObject
 * @param displayObject {DisplayObject} The displayObject to render
 * @param context {CanvasRenderingContext2D} the context 2d method of the canvas
 * @param [matrix] {Matrix} Optional matrix to apply to the display object before rendering.
 * @private
 */
PIXI.CanvasRenderer.prototype.renderDisplayObject = function (displayObject, context, matrix) {

    this.renderSession.context = context || this.context;
    this.renderSession.resolution = this.resolution;
    displayObject._renderCanvas(this.renderSession, matrix);

};

/**
 * Maps Pixi blend modes to canvas blend modes.
 *
 * @method mapBlendModes
 * @private
 */
PIXI.CanvasRenderer.prototype.mapBlendModes = function () {

    if (!PIXI.blendModesCanvas)
    {
        var b = [];
        var modes = PIXI.blendModes;
        var useNew = this.game.device.canUseMultiply;

        b[modes.NORMAL] = 'source-over';
        b[modes.ADD] = 'lighter';
        b[modes.MULTIPLY] = (useNew) ? 'multiply' : 'source-over';
        b[modes.SCREEN] = (useNew) ? 'screen' : 'source-over';
        b[modes.OVERLAY] = (useNew) ? 'overlay' : 'source-over';
        b[modes.DARKEN] = (useNew) ? 'darken' : 'source-over';
        b[modes.LIGHTEN] = (useNew) ? 'lighten' : 'source-over';
        b[modes.COLOR_DODGE] = (useNew) ? 'color-dodge' : 'source-over';
        b[modes.COLOR_BURN] = (useNew) ? 'color-burn' : 'source-over';
        b[modes.HARD_LIGHT] = (useNew) ? 'hard-light' : 'source-over';
        b[modes.SOFT_LIGHT] = (useNew) ? 'soft-light' : 'source-over';
        b[modes.DIFFERENCE] = (useNew) ? 'difference' : 'source-over';
        b[modes.EXCLUSION] = (useNew) ? 'exclusion' : 'source-over';
        b[modes.HUE] = (useNew) ? 'hue' : 'source-over';
        b[modes.SATURATION] = (useNew) ? 'saturation' : 'source-over';
        b[modes.COLOR] = (useNew) ? 'color' : 'source-over';
        b[modes.LUMINOSITY] = (useNew) ? 'luminosity' : 'source-over';

        PIXI.blendModesCanvas = b;
    }

};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * A texture stores the information that represents an image. All textures have a base texture.
 *
 * @class BaseTexture
 * @constructor
 * @param source {String|Canvas} the source object (image or canvas)
 * @param scaleMode {Number} See {{#crossLink "PIXI/scaleModes:property"}}PIXI.scaleModes{{/crossLink}} for possible values
 * @param [resolution] {Number} the resolution of the texture (for HiDPI displays)
 */
PIXI.BaseTexture = function(source, scaleMode, resolution)
{
    /**
     * The Resolution of the texture. 
     *
     * @property resolution
     * @type Number
     */
    this.resolution = resolution || 1;
    
    /**
     * [read-only] The width of the base texture set when the image has loaded
     *
     * @property width
     * @type Number
     * @readOnly
     */
    this.width = 100;

    /**
     * [read-only] The height of the base texture set when the image has loaded
     *
     * @property height
     * @type Number
     * @readOnly
     */
    this.height = 100;

    /**
     * The scale mode to apply when scaling this texture
     * 
     * @property scaleMode
     * @type {Number}
     * @default PIXI.scaleModes.LINEAR
     */
    this.scaleMode = scaleMode || PIXI.scaleModes.DEFAULT;

    /**
     * [read-only] Set to true once the base texture has loaded
     *
     * @property hasLoaded
     * @type Boolean
     * @readOnly
     */
    this.hasLoaded = false;

    /**
     * The image source that is used to create the texture.
     *
     * @property source
     * @type Image
     */
    this.source = source;

    /**
     * Controls if RGB channels should be pre-multiplied by Alpha  (WebGL only)
     *
     * @property premultipliedAlpha
     * @type Boolean
     * @default true
     */
    this.premultipliedAlpha = true;

    // used for webGL

    /**
     * @property _glTextures
     * @type Array
     * @private
     */
    this._glTextures = [];

    /**
     * Set this to true if a mipmap of this texture needs to be generated. This value needs to be set before the texture is used
     * Also the texture must be a power of two size to work
     * 
     * @property mipmap
     * @type {Boolean}
     */
    this.mipmap = false;

     /**
     * The multi texture batching index number.
     * @property textureIndex
     * @type Number
     */
    this.textureIndex = 0;

    /**
     * @property _dirty
     * @type Array
     * @private
     */
    this._dirty = [true, true, true, true];

    if (!source)
    {
        return;
    }

    if ((this.source.complete || this.source.getContext) && this.source.width && this.source.height)
    {
        this.hasLoaded = true;
        this.width = this.source.naturalWidth || this.source.width;
        this.height = this.source.naturalHeight || this.source.height;
        this.dirty();
    }

    /**
     * A BaseTexture can be set to skip the rendering phase in the WebGL Sprite Batch.
     * 
     * You may want to do this if you have a parent Sprite with no visible texture (i.e. uses the internal `__default` texture)
     * that has children that you do want to render, without causing a batch flush in the process.
     * 
     * @property skipRender
     * @type Boolean
     */
    this.skipRender = false;

    /**
     * @property _powerOf2
     * @type Boolean
     * @private
     */
    this._powerOf2 = false;

};

PIXI.BaseTexture.prototype.constructor = PIXI.BaseTexture;

/**
 * Forces this BaseTexture to be set as loaded, with the given width and height.
 * Then calls BaseTexture.dirty.
 * Important for when you don't want to modify the source object by forcing in `complete` or dimension properties it may not have.
 *
 * @method forceLoaded
 * @param {number} width - The new width to force the BaseTexture to be.
 * @param {number} height - The new height to force the BaseTexture to be.
 */
PIXI.BaseTexture.prototype.forceLoaded = function(width, height)
{
    this.hasLoaded = true;
    this.width = width;
    this.height = height;
    this.dirty();
};

/**
 * Destroys this base texture
 *
 * @method destroy
 */
PIXI.BaseTexture.prototype.destroy = function()
{
    if (this.source)
    {
        Phaser.CanvasPool.removeByCanvas(this.source);
    }

    this.source = null;

    this.unloadFromGPU();
};

/**
 * Changes the source image of the texture
 *
 * @method updateSourceImage
 * @param newSrc {String} the path of the image
 * @deprecated This method is deprecated. Please use Phaser.Sprite.loadTexture instead.
 */
PIXI.BaseTexture.prototype.updateSourceImage = function(newSrc)
{
    console.warn("PIXI.BaseTexture.updateSourceImage is deprecated. Use Phaser.Sprite.loadTexture instead.");
};

/**
 * Sets all glTextures to be dirty.
 *
 * @method dirty
 */
PIXI.BaseTexture.prototype.dirty = function()
{
    for (var i = 0; i < this._glTextures.length; i++)
    {
        this._dirty[i] = true;
    }
};

/**
 * Removes the base texture from the GPU, useful for managing resources on the GPU.
 * Atexture is still 100% usable and will simply be reuploaded if there is a sprite on screen that is using it.
 *
 * @method unloadFromGPU
 */
PIXI.BaseTexture.prototype.unloadFromGPU = function()
{
    this.dirty();

    // delete the webGL textures if any.
    for (var i = this._glTextures.length - 1; i >= 0; i--)
    {
        var glTexture = this._glTextures[i];
        var gl = PIXI.glContexts[i];

        if(gl && glTexture)
        {
            gl.deleteTexture(glTexture);
        }
        
    }

    this._glTextures.length = 0;

    this.dirty();
};

/**
 * Helper function that creates a base texture from the given canvas element.
 *
 * @static
 * @method fromCanvas
 * @param canvas {Canvas} The canvas element source of the texture
 * @param scaleMode {Number} See {{#crossLink "PIXI/scaleModes:property"}}PIXI.scaleModes{{/crossLink}} for possible values
 * @param [resolution] {Number} the resolution of the texture (for HiDPI displays)
 * @return {BaseTexture}
 */
PIXI.BaseTexture.fromCanvas = function(canvas, scaleMode, resolution)
{
    if (canvas.width === 0)
    {
        canvas.width = 1;
    }

    if (canvas.height === 0)
    {
        canvas.height = 1;
    }

    resolution = resolution || 1;

    return new PIXI.BaseTexture(canvas, scaleMode, resolution);
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * TextureSilentFail is a boolean that defaults to `false`. 
 * If `true` then `PIXI.Texture.setFrame` will no longer throw an error if the texture dimensions are incorrect. 
 * Instead `Texture.valid` will be set to `false` (#1556)
 *
 * @type {boolean}
 */
PIXI.TextureSilentFail = false;

/**
 * A texture stores the information that represents an image or part of an image. It cannot be added
 * to the display list directly. Instead use it as the texture for a PIXI.Sprite. If no frame is provided then the whole image is used.
 *
 * @class Texture
 * @constructor
 * @param baseTexture {BaseTexture} The base texture source to create the texture from
 * @param frame {Rectangle} The rectangle frame of the texture to show
 * @param [crop] {Rectangle} The area of original texture 
 * @param [trim] {Rectangle} Trimmed texture rectangle
 */
PIXI.Texture = function(baseTexture, frame, crop, trim)
{
    /**
     * Does this Texture have any frame data assigned to it?
     *
     * @property noFrame
     * @type Boolean
     */
    this.noFrame = false;

    if (!frame)
    {
        this.noFrame = true;
        frame = new PIXI.Rectangle(0,0,1,1);
    }

    if (baseTexture instanceof PIXI.Texture)
    {
        baseTexture = baseTexture.baseTexture;
    }

    /**
     * The base texture that this texture uses.
     *
     * @property baseTexture
     * @type BaseTexture
     */
    this.baseTexture = baseTexture;

    /**
     * The frame specifies the region of the base texture that this texture uses
     *
     * @property frame
     * @type Rectangle
     */
    this.frame = frame;

    /**
     * The texture trim data.
     *
     * @property trim
     * @type Rectangle
     */
    this.trim = trim;

    /**
     * This will let the renderer know if the texture is valid. If it's not then it cannot be rendered.
     *
     * @property valid
     * @type Boolean
     */
    this.valid = false;

    /**
     * Is this a tiling texture? As used by the likes of a TilingSprite.
     *
     * @property isTiling
     * @type Boolean
     */
    this.isTiling = false;

    /**
     * This will let a renderer know that a texture has been updated (used mainly for webGL uv updates)
     *
     * @property requiresUpdate
     * @type Boolean
     */
    this.requiresUpdate = false;

    /**
     * This will let a renderer know that a tinted parent has updated its texture.
     *
     * @property requiresReTint
     * @type Boolean
     */
    this.requiresReTint = false;

    /**
     * The WebGL UV data cache.
     *
     * @property _uvs
     * @type Object
     * @private
     */
    this._uvs = null;

    /**
     * The width of the Texture in pixels.
     *
     * @property width
     * @type Number
     */
    this.width = 0;

    /**
     * The height of the Texture in pixels.
     *
     * @property height
     * @type Number
     */
    this.height = 0;

    /**
     * This is the area of the BaseTexture image to actually copy to the Canvas / WebGL when rendering,
     * irrespective of the actual frame size or placement (which can be influenced by trimmed texture atlases)
     *
     * @property crop
     * @type Rectangle
     */
    this.crop = crop || new PIXI.Rectangle(0, 0, 1, 1);

    /**
     * A flag that controls if this frame is rotated or not.
     * Rotation allows you to use rotated frames in texture atlas packing, it has nothing to do with
     * Sprite rotation.
     *
     * @property rotated
     * @type Boolean
     */
    this.rotated = false;

    if (baseTexture.hasLoaded)
    {
        if (this.noFrame) frame = new PIXI.Rectangle(0, 0, baseTexture.width, baseTexture.height);
        this.setFrame(frame);
    }

};

PIXI.Texture.prototype.constructor = PIXI.Texture;

/**
 * Called when the base texture is loaded
 *
 * @method onBaseTextureLoaded
 * @private
 */
PIXI.Texture.prototype.onBaseTextureLoaded = function()
{
    var baseTexture = this.baseTexture;

    if (this.noFrame)
    {
        this.frame = new PIXI.Rectangle(0, 0, baseTexture.width, baseTexture.height);
    }

    this.setFrame(this.frame);
};

/**
 * Destroys this texture
 *
 * @method destroy
 * @param destroyBase {Boolean} Whether to destroy the base texture as well
 */
PIXI.Texture.prototype.destroy = function(destroyBase)
{
    if (destroyBase) this.baseTexture.destroy();

    this.valid = false;
};

/**
 * Specifies the region of the baseTexture that this texture will use.
 *
 * @method setFrame
 * @param frame {Rectangle} The frame of the texture to set it to
 */
PIXI.Texture.prototype.setFrame = function(frame)
{
    this.noFrame = false;

    this.frame = frame;
    this.width = frame.width;
    this.height = frame.height;

    this.crop.x = frame.x;
    this.crop.y = frame.y;
    this.crop.width = frame.width;
    this.crop.height = frame.height;

    if (!this.trim && (frame.x + frame.width > this.baseTexture.width || frame.y + frame.height > this.baseTexture.height))
    {
        if (!PIXI.TextureSilentFail)
        {
            throw new Error('Texture Error: frame does not fit inside the base Texture dimensions ' + this);
        }

        this.valid = false;
        return;
    }

    this.valid = frame && frame.width && frame.height && this.baseTexture.source && this.baseTexture.hasLoaded;

    if (this.trim)
    {
        this.width = this.trim.width;
        this.height = this.trim.height;
        this.frame.width = this.trim.width;
        this.frame.height = this.trim.height;
    }
    
    if (this.valid) this._updateUvs();

};

/**
 * Updates the internal WebGL UV cache.
 *
 * @method _updateUvs
 * @private
 */
PIXI.Texture.prototype._updateUvs = function()
{
    if(!this._uvs)this._uvs = new PIXI.TextureUvs();

    var frame = this.crop;
    var tw = this.baseTexture.width;
    var th = this.baseTexture.height;
    
    this._uvs.x0 = frame.x / tw;
    this._uvs.y0 = frame.y / th;

    this._uvs.x1 = (frame.x + frame.width) / tw;
    this._uvs.y1 = frame.y / th;

    this._uvs.x2 = (frame.x + frame.width) / tw;
    this._uvs.y2 = (frame.y + frame.height) / th;

    this._uvs.x3 = frame.x / tw;
    this._uvs.y3 = (frame.y + frame.height) / th;
};

/**
 * Updates the internal WebGL UV cache.
 *
 * @method _updateUvsInverted
 * @private
 */
PIXI.Texture.prototype._updateUvsInverted = function () {

    if (!this._uvs) { this._uvs = new PIXI.TextureUvs(); }

    var frame = this.crop;
    var tw = this.baseTexture.width;
    var th = this.baseTexture.height;
    
    this._uvs.x0 = frame.x / tw;
    this._uvs.y0 = frame.y / th;

    this._uvs.x1 = (frame.x + frame.height) / tw;
    this._uvs.y1 = frame.y / th;

    this._uvs.x2 = (frame.x + frame.height) / tw;
    this._uvs.y2 = (frame.y + frame.width) / th;

    this._uvs.x3 = frame.x / tw;
    this._uvs.y3 = (frame.y + frame.width) / th;

};

/**
 * Helper function that creates a new a Texture based on the given canvas element.
 *
 * @static
 * @method fromCanvas
 * @param canvas {Canvas} The canvas element source of the texture
 * @param scaleMode {Number} See {{#crossLink "PIXI/scaleModes:property"}}PIXI.scaleModes{{/crossLink}} for possible values
 * @return {Texture}
 */
PIXI.Texture.fromCanvas = function(canvas, scaleMode)
{
    var baseTexture = PIXI.BaseTexture.fromCanvas(canvas, scaleMode);

    return new PIXI.Texture(baseTexture);
};

PIXI.TextureUvs = function()
{
    this.x0 = 0;
    this.y0 = 0;

    this.x1 = 0;
    this.y1 = 0;

    this.x2 = 0;
    this.y2 = 0;

    this.x3 = 0;
    this.y3 = 0;
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = PIXI;
        }
        exports.PIXI = PIXI;
    } else if (typeof define !== 'undefined' && define.amd) {
        define('PIXI', (function() { return root.PIXI = PIXI; })() );
    } else {
        root.PIXI = PIXI;
    }

    return PIXI;
}).call(this);