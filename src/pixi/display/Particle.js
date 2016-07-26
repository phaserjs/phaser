/**
* @author       Richard Davey <rich@photonstorm.com>
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A base class for the most simple display object possible.
* Supports position, scale, rotation, pivots, and transform updates from parents.
* Does not support having children of its own, filters, masks, or the ability to generate cached textures from itself.
*
* @class PIXI.Particle
* @constructor
*/
PIXI.Particle = function (parent, texture) {

    /**
    * The parent that this Particle is a child of.
    * All Particles must belong to a parent in order to be rendered.
    * The root parent is the Stage object. This property is set automatically when the
    * Particle is added to, or removed from, a DisplayObjectContainer.
    * 
    * @property {PIXI.ParticleContainer} parent
    */
    this.parent = null;

    /**
     * The texture that the sprite is using
     *
     * @property texture
     * @type Texture
     */
    this.texture = texture || PIXI.Texture.emptyTexture;

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
    * Controls if this Sprite is processed by the core Phaser game loops and Group loops.
    *
    * @property exists
    * @type Boolean
    * @default true
    */
    this.exists = true;

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
    * The coordinates, in pixels, of this Particle, relative to its parent container.
    * 
    * The value of this property does not reflect any positioning happening further up the display list.
    * To obtain that value please see the `worldPosition` property.
    * 
    * @property {PIXI.Point} position
    * @default
    */
    this.position = new PIXI.Point(0, 0);

    /**
    * The scale of this Particle. A scale of 1:1 represents the Particle
    * at its default size. A value of 0.5 would scale this Particle by half, and so on.
    * 
    * The value of this property does not reflect any scaling happening further up the display list.
    * To obtain that value please see the `worldScale` property.
    * 
    * @property {PIXI.Point} scale
    * @default
    */
    this.scale = new PIXI.Point(1, 1);

    /**
    * The pivot point of this Particle that it rotates around. The values are expressed
    * in pixel values.
    * @property {PIXI.Point} pivot
    * @default
    */
    this.pivot = new PIXI.Point(0, 0);

    /**
    * The rotation of this Particle. The value is given, and expressed, in radians, and is based on
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
    * The alpha value of this Particle. A value of 1 is fully opaque. A value of 0 is transparent.
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
    * The visibility of this Particle. A value of `false` makes the object invisible.
    * A value of `true` makes it visible. Please note that an object with a visible value of
    * `false` is skipped during the render pass. Equally a Particle with visible false will
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
    * Should this Particle be rendered by the renderer? An object with a renderable value of
    * `false` is skipped during the render pass.
    * 
    * @property {boolean} renderable
    * @default
    */
    this.renderable = false;

    /**
    * The multiplied alpha value of this Particle. A value of 1 is fully opaque. A value of 0 is transparent.
    * This value is the calculated total, based on the alpha values of all parents of this Particles 
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
    * The current transform of this Particle.
    * 
    * This property contains the calculated total, based on the transforms of all parents of this 
    * Particle in the display list.
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
    * The coordinates, in pixels, of this Particle within the world.
    * 
    * This property contains the calculated total, based on the positions of all parents of this 
    * Particle in the display list.
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
    * The global scale of this Particle.
    * 
    * This property contains the calculated total, based on the scales of all parents of this 
    * Particle in the display list.
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
    * The rotation, in radians, of this Particle.
    * 
    * This property contains the calculated total, based on the rotations of all parents of this 
    * Particle in the display list.
    *
    * Note: This property is only updated at the end of the `updateTransform` call, once per render. Until 
    * that happens this property will contain values based on the previous frame. Be mindful of this if
    * accessing this property outside of the normal game flow, i.e. from an asynchronous event callback.
    * 
    * @property {number} worldRotation
    * @readOnly
    */
    this.worldRotation = 0;

    this._width = 0;
    this._height = 0;
    this._rotation = 0;
    this._sr = 0;
    this._cr = 0;

};

PIXI.Particle.prototype.constructor = PIXI.Particle;

PIXI.Particle.prototype = {

    /*
    * Updates the transform matrix this Particle uses for rendering.
    *
    * If the object has no parent, and no parent parameter is provided, it will default to 
    * Phaser.Game.World as the parent transform to use. If that is unavailable the transform fails to take place.
    *
    * The `parent` parameter has priority over the actual parent. Use it as a parent override.
    * Setting it does **not** change the actual parent of this Particle.
    *
    * Calling this method updates the `worldTransform`, `worldAlpha`, `worldPosition`, `worldScale` 
    * and `worldRotation` properties.
    *
    * @method PIXI.Particle#updateTransform
    * @param {PIXI.ParticleContainer} [parent] - Optional parent to calculate this Particles transform from.
    * @return {PIXI.Particle} - A reference to this Particle.
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
            if (this.rotation !== this._rotation)
            {
                this._rotation = this.rotation;
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

        return this;

    },

    /**
    * To be overridden by classes that require it.
    *
    * @method PIXI.Particle#preUpdate
    */
    preUpdate: function () {

    },

    /**
    * Renders the object using the Canvas renderer
    *
    * @method _renderCanvas
    * @param renderSession {RenderSession}
    * @private
    */
    _renderCanvas: function (renderSession) {

        // If the sprite is not visible or the alpha is 0 then no need to render this element
        if (!this.visible || this.alpha === 0 || !this.renderable || !this.texture.valid || this.texture.crop.width <= 0 || this.texture.crop.height <= 0)
        {
            return;
        }

        var wt = this.worldTransform;

        if (this.blendMode !== renderSession.currentBlendMode)
        {
            renderSession.currentBlendMode = this.blendMode;
            renderSession.context.globalCompositeOperation = PIXI.blendModesCanvas[renderSession.currentBlendMode];
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

        //  Allow for pixel rounding
        if (renderSession.roundPixels)
        {
            tx |= 0;
            ty |= 0;
            dx |= 0;
            dy |= 0;
        }
        
        renderSession.context.setTransform(wt.a, wt.b, wt.c, wt.d, tx, ty);

        var cw = this.texture.crop.width;
        var ch = this.texture.crop.height;

        var cx = this.texture.crop.x;
        var cy = this.texture.crop.y;

        dx /= resolution;
        dy /= resolution;

        renderSession.context.drawImage(this.texture.baseTexture.source, cx, cy, cw, ch, dx, dy, cw / resolution, ch / resolution);

    },

    /**
    * Destroy this Particle.
    *
    * Removes any cached sprites, sets renderable flag to false, and nulls filters, bounds and mask.
    *
    * Also iteratively calls `destroy` on any children.
    *
    * @method PIXI.Particle#destroy
    */
    destroy: function () {

        this.parent = null;

        this.worldTransform = null;
        this.renderable = false;

    }

};

Object.defineProperties(PIXI.Particle.prototype, {

    /**
    * The horizontal position of the Particle, in pixels, relative to its parent.
    * If you need the world position of the Particle, use `Particle.worldPosition` instead.
    * @name PIXI.Particle#x
    * @property {number} x - The horizontal position of the Particle, in pixels, relative to its parent.
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
    * The vertical position of the Particle, in pixels, relative to its parent.
    * If you need the world position of the Particle, use `Particle.worldPosition` instead.
    * @name PIXI.Particle#y
    * @property {number} y - The vertical position of the Particle, in pixels, relative to its parent.
    */
    'y': {

        get: function () {

            return this.position.y;

        },

        set: function (value) {

            this.position.y = value;

        }

    },

    'width': {

        get: function () {

            return this.scale.x * this.texture.frame.width;

        },

        set: function (value) {

            this.scale.x = value / this.texture.frame.width;
            this._width = value;

        }

    },

    'height': {

        get: function () {

            return this.scale.y * this.texture.frame.height;

        },

        set: function (value) {

            this.scale.y = value / this.texture.frame.height;
            this._height = value;

        }

    },

    /**
    * Indicates if this Particle is visible, based on it, and all of its parents, `visible` property values.
    * @name PIXI.Particle#worldVisible
    * @property {boolean} worldVisible - Indicates if this Particle is visible, based on it, and all of its parents, `visible` property values.
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

    }

});
