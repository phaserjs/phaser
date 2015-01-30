/**
* @classdesc
* Game objects are {@link PIXI.DisplayObject display objects} with additional Phaser features.
*
* Because there is not a single prototype hierarchy a "GameObject" mixin system is used to 
* consistently add the appropriate game object features to different Phaser types.
*
* All game objects are expected to inherit from PIXI.DisplayObject or otherwise 
* implementation the methods and properties it defines.
*
* ---
*
* A mixin approach is used to avoid altering the prototype inheritance while providing maximum
* feature compatibility and code/documentation sharing between existing types.
*
* This approach has been designed for maximum code-resue and consistency with no/minimal performance
* impact; the shared functions and easy of applying general optimizations may even improve overall performance,
* even if the functions themselves are not specialized.
*
* Judicial guards - lifted into a prototype or instance as appropriate - are used to handle
* varied features and care is taken to not introduce extra work.
* (Support for various Traits can be triggered after an object is created by adding properties.)
*
* The following game object mixins are available:
*
* - {@link Phaser.GameObject.CoreMixin} - Included in every game object.
* - {@link Phaser.GameObject.CullingMixin}
* - {@link Phaser.GameObject.TextureMixin}
* - {@link Phaser.GameObject.InputMixin}
* - {@link Phaser.GameObject.EventsMixin}
* - {@link Phaser.GameObject.PhysicsMixin}
* - {@link Phaser.GameObject.LifeMixin}
*
* Using separate types also allows documentation generation and inheritance tracing. In JSDoc this
* is handled with the use of multuple @extends doclets.
*
* - Even though no MI is used, multiple @extends JSDoc doclets result in correct output that shows the
*   mixin member with the type and links to the inherited base.
*   (JSDoc 3.3 should include @interface/@implements and better @mixin support.)
* - Google Closure Compiler may currently support @interface/@implements.
*
* @class Phaser.GameObject
* @protected
*/
Phaser.GameObject = {};

/**
* Various traits that a game object can have.
*
* The property values represent bitmask flag;
* supply the relevant trait mask to {@link Phaser.GameObject.mix mix}.
*
* @member
* @property {number} CULLING - Supports camera/world culling.
*     There is currently no per-type performance impact for supporting CULLING.
* @property {number} TEXTURE - Supports textures, but not necessarily frames.
* @protpert {number} TEXTURE_FRAMES - Supports keyed texture frames, implies TEXTURE.
* @property {number} INPUT - Supports input.
* @property {number} EVENTS - Supports events (implied by INPUT and LIFE).
* @property {number} LIFE - Supports 'alive'.
* @property {number} PHYSICS - Supports a physics body.
* @property {number} GRAPHICS_LIKE -
*     Supports CULLING and INPUT - no physics or textures as they are expected to be provided by the implementation.
* @property {number} SPRITE_LIKE -
*     A sprite is a "full" game object and supports every individual Trait.
* @property {number} IMAGE_LIKE -
*     There isn't much difference between an Image and a Sprite except an Image _"doesn't"_ support PHYSICS.
*     Also includes LIFE for compatibility with existing code.
* @protected
*/
Phaser.GameObject.Traits = {
    CULLING: 1 << 1,
    TEXTURE: 1 << 2,
    TEXTURE_FRAMES: 1 << 3,
    INPUT: 1 << 4,
    EVENTS: 1 << 5,
    LIFE: 1 << 6,
    PHYSICS: 1 << 7
};

var Traits = Phaser.GameObject.Traits;

Traits.GRAPHICS_LIKE = Traits.CULLING | Traits.INPUT;
Traits.SPRITE_LIKE = Traits.CULLING | Traits.TEXTURE_FRAMES | Traits.INPUT | Traits.LIFE | Traits.PHYSICS;
Traits.IMAGE_LIKE = Traits.CULLING | Traits.TEXTURE_FRAMES | Traits.INPUT | Traits.LIFE;

/**
* Mixes in a mixin object with the target.
*
* Prototype values with that have either `get` or `set` functions are created as properties
* via defineProperty.
*
* @method Phaser.GameObject.mixPrototype
* @private
*/
Phaser.GameObject.mixPrototype = function (target, mixin) {
    
    var mixinKeys = Object.keys(mixin);
    for (var i = 0; i < mixinKeys.length; i++)
    {
        var key = mixinKeys[i];
        var value = mixin[key];

        if (value && (typeof value.get === 'function' || typeof value.set === 'function'))
        {
            Object.defineProperty(target, key, value);
        }
        else
        {
            target[key] = value;
        }
    }
};

/**
* Mixes the selected game object features/traits into the target.
*
* @param {object} target - The target prototype/instance.
* @param {integer} traits - The bitmask of game object Traits to apply.
* @protected
*/
Phaser.GameObject.mix = function (target, traits) {

    if (traits & (Traits.INPUT | Traits.CULLING))
    {
        traits |= Traits.EVENTS;
    }
    if (traits & Traits.TEXTURE_FRAMES)
    {
        traits |= Traits.TEXTURE;
    }

    // Remember the applied traits
    target.gameObjectTraits = traits;

    Phaser.GameObject.mixPrototype(target, Phaser.GameObject.CoreMixin.prototype);

    if (traits & Traits.CULLING)
    {
        Phaser.GameObject.mixPrototype(target, Phaser.GameObject.CullingMixin.prototype);
    }
    
    if (traits & Traits.TEXTURE)
    {
        Phaser.GameObject.mixPrototype(target, Phaser.GameObject.TextureMixin.prototype);
    }

    if (traits & Traits.INPUT)
    {
        Phaser.GameObject.mixPrototype(target, Phaser.GameObject.InputMixin.prototype);
    }

    if (traits & Traits.EVENTS)
    {
        Phaser.GameObject.mixPrototype(target, Phaser.GameObject.EventsMixin.prototype);
    }

    if (traits & Traits.PHYSICS)
    {
        Phaser.GameObject.mixPrototype(target, Phaser.GameObject.PhysicsMixin.prototype);
    }

    if (traits & Traits.LIFE)
    {
        Phaser.GameObject.mixPrototype(target, Phaser.GameObject.LifeMixin.prototype);
    }

    // Pull up children into the target
    if (!('children' in target))
    {
        target.children = undefined;
    }

};

/**
* Initializes the game object mixins.
*
* Call in the constructor, with the "this context".
*
* @method Phaser.GameObject.init
* @param {Phaser.Game} [game=(don't set)] - The current game and/or context object.
* @param {integer} [traits=(from `mix`)] - The bitmask of game object Traits to apply.
*     If not specified this uses the mask established with {@link Phaser.GameObject.mix mix}.
* @protected
*/
Phaser.GameObject.init = function (game, traits) {

    if (typeof traits === 'undefined') { traits = this.gameObjectTraits; }

    if (traits & (Traits.INPUT | Traits.CULLING))
    {
        traits |= Traits.EVENTS;
    }
    if (traits & Traits.TEXTURE_FRAMES)
    {
        traits |= Traits.TEXTURE;
    }

    if (typeof game !== 'undefined')
    {
        this.game = game;
    }

    // Cache used by `exists` - and maybe others
    this._cache = [ 0, 0, 0, 0, 1, 0, 1, 0, 0 ];

    // Defaults in prototype + low use paths
    // this.name = '';
    // this.debug = false;

    this.z = 0;

    this.world = new Phaser.Point();

    this.cameraOffset = new Phaser.Point();

    // Defaults in prototype, but promote to instance
    // (This will promote `undefined` without CULLING)
    this.autoCull = this.autoCull;
    this.checkWorldBounds = this.checkWorldBounds;
    
    // Defaults in prototype + low use path
    //this.outOfBoundsKill = false;

    // Controlled by setMinMax, etc
    this.transformCallback = null;
    this.transformCallbackContext = this;

    // Added with `enableInput`
    this.input = null;

    if (traits & Traits.EVENTS)
    {
        this.events = new Phaser.Events(this);
    }

    if (traits & Traits.TEXTURE_FRAMES)
    {
        // Defaults in prototype
        // `key` not available: should be set by `loadTexture` which also applies others
        //this.key = this.key;
        //this.cropRect = this.cropRect;
        //this._crop = this._crop;
        //this._frame = this._frame;

        this.animations = new Phaser.AnimationManager(this);
    }

    // Defaults in prototype, but promote to instance
    // (This will promote `undefined` without PHYSICS)
    this.body = this.body;

    if (traits & Traits.LIFE)
    {
        this.alive = true;
    }

    this._bounds = new Phaser.Rectangle();

    this.exists = true;

};

/**
* @classdesc
* The Core game object mixin - this is always included in all game objects.
*
* Provides a wide variety of common properties and methods.
* 
* Some common properties are floated even though not requested by other mixins;
* this is for guard-check performance and hidden class generation.
*
* @class Phaser.GameObject.CoreMixin
* @protected
*/
Phaser.GameObject.CoreMixin = function () {
};

Phaser.GameObject.CoreMixin.prototype = /* @lends Phaser.GameObject.CoreMixin */ {

    /**
    * A reference to the currently running Game.
    * @property {Phaser.Game} game
    * @protected
    * @readonly
    */
    game: null,

    /**
    * The mask of the game object Traits established with `mix`.
    * @property {integer} gameObjectTraits
    * @protected
    */
    // Property assigned in `mix`, before prototypes applied

    /**
    * The user defined name given to this game object; useful for debugging, perhaps.
    *
    * @property {string} name
    * @default
    */
    name: '',

    /**
    * Handy flag to use with Game.enableStep
    *
    * @property {boolean} debug
    * @default
    */
    debug: false,

    /**
    * The z-depth value of this object within its Group (the World is a Group as well).
    *
    * No two objects in a Group can have the same z value; this is updated internally
    * when a display object is moved within a Group.
    *
    * @property {integer} z
    * @readonly
    */
    z: 0,

    /**
    * The world coordinates of this sprite; this differs from x/y and position which
    * are relative to the parent.
    *
    * _Warning_: this is updated in the `preUpdate` logic and may not always be a current representation.
    *
    * @property {Phaser.Point} world
    */
    world: null,

    /**    
    * If this object is {@link Phaser.GameObject.CoreMixin#fixedToCamera} then this stores the x/y offset that its drawn at, from the top-left of the camera view.
    *
    * _Warning_: in the future this may be either null or a dummy Point object if not previously fixed to the camera.
    *
    * @property {Phaser.Point} cameraOffset
    */
    cameraOffset: null,

    // See scaleMin
    _scaleMin: null,

    // See scaleMax
    _scaleMax: null,

    // Physics is a special-case and `body` must be null to be considered in-play;
    // here it is promoted to the prototype as undefined and applied to non-PHYSICS
    body: undefined,

    // For objects with the LIFE trait; promoted to prototype
    lifetime: undefined,

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
    *
    * @property {Array} _cache
    * @private
    */
    _cache: null,

    /**
    * Internal cache var.
    *
    * @property {object} _bounds
    * @private
    */
    _bounds: null,

    /**
    * Override and this method for custom update logic.
    *
    * If this game object has any children that need updating, you should call update on them too.
    * (Children are not updated by default.)
    *
    * @method Phaser.GameObject.CoreMixin#update
    * @protected
    */
    update: function() {
    },

    /**
    * Generic preUpdate logic that can be re-used between various game objects.
    * Uses property guards.
    *
    * @method Phaser.GameObject.CoreMixin#preUpdate
    * @return {boolean} True if the game object should be rendered, otherwise false.
    * @protected
    */
    preUpdate: function() {

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

            if (this._cache[6] === 1 /* exists */ && this.body)
            {
                this.body.preUpdate();
            }

            return false;
        }

        this._cache[0] = this.world.x;
        this._cache[1] = this.world.y;
        this._cache[2] = this.rotation;
        this._cache[3] = -1;

        if (this._cache[6] === 0 /* !exists */ || !this.parent.exists)
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
                    if (this.events)
                    {
                        this.events.onEnterBounds$dispatch(this);
                    }
                }
                else if (this._cache[5] === 0 && !worldBoundIntersect)
                {
                    //  The display object WAS in the screen, but has now left.
                    this._cache[5] = 1;
                    if (this.events)
                    {
                        this.events.onOutOfBounds$dispatch(this);
                    }

                    if (this.outOfBoundsKill)
                    {
                        this.kill();
                    }
                }
            }
        }

        // Update the world position
        this.world.setTo(this.game.camera.x + this.worldTransform.tx, this.game.camera.y + this.worldTransform.ty);

        if (this.lifespan)
        {
            this.lifespan -= this.game.time.physicsElapsedMS;

            if (this.lifespan <= 0)
            {
                this.lifespan = 0;
                this.kill();
            }
        }

        this.preUpdateImpl();

        if (this._cache[6] === 0 /* !exists */)
        {
            // May no longer exist after preUpdateImpl
            return false;
        }

        if (this.animations)
        {
            this.animations.update();
        }

        if (this.body)
        {
            this.body.preUpdate();
        }

        if (this.visible && this.renderable)
        {
            this._cache[3] = this.game.stage.currentRenderOrderID++;
        }
        else
        {
            return false;
        }

        //  preUpdate any Children - guard for non-Phaser game objects
        if (this.children && this.children.length)
        {
            for (var i = 0, len = this.children.length; i < len; i++)
            {
                var child = this.children[i];
                if (child.preUpdate)
                {
                    child.preUpdate();
                }
            }
        }

        return true;

    },

    /**
    * Generic postUpdate logic that can be re-used between various game objects.
    * Uses property guards.
    *
    * @method Phaser.GameObject.CoreMixin#postUpdate
    * @protected
    */
    postUpdate: function() {

        if (this.key instanceof Phaser.BitmapData)
        {
            this.key.render();
        }

        //  Fixed to Camera?
        if (this._cache[7] === 1)
        {
            var camera = this.game.camera;
            this.position.x = (camera.view.x + this.cameraOffset.x) / camera.scale.x;
            this.position.y = (camera.view.y + this.cameraOffset.y) / camera.scale.y;
        }

        this.postUpdateImpl();

        if (this.exists && this.body)
        {
            this.body.postUpdate();
        }

        //  postUpdate any Children - guard for non-Phaser game objects
        if (this.children && this.children.length)
        {
            for (var i = 0, len = this.children.length; i < len; i++)
            {
                var child = this.children[i];
                if (child.postUpdate)
                {
                    child.postUpdate();
                }
            }
        }

    },

    /**
    * Called from the default `preUpdate`.
    *
    * It is called after the `world` has been updated but before animations (if applicable),
    * physics (if applicable), and children (if applicable) are updates.
    *
    * It is called only when the game object is not marked as "fresh",
    * and the game object exists. (The game object may have been killed by culling.)
    *
    * @method Phaser.GameObject.CoreMixin#update
    * @protected
    */
    preUpdateImpl: function() {
    },

    /**
    * Called from the default `postUpdate`.
    *
    * This is called after any internal rendering cleanup and after the
    * position has been adjusted if {@link Phaser.GameObject.CoreMixin#fixedToCamera}.
    *
    * @method Phaser.GameObject.CoreMixin#update
    * @protected
    */
    postUpdateImpl: function() {
    },

    /**
    * Brings the gmae object to the top of the display list (ie. Group or another Sprite) it is a child of.
    *
    * @method Phaser.GameObject.CoreMixin#bringToTop
    * @return {Phaser.Image} This instance.
    */
    bringToTop: function() {

        if (this.parent)
        {
            this.parent.bringToTop(this);
        }

        return this;

    },

    /**
    * Adjust scaling limits, if set, to this Image.
    *
    * @method Phaser.GameObject.CoreMixin#checkTransform
    * @private
    * @param {PIXI.Matrix} wt - The updated worldTransform matrix.
    */
    checkTransform: function (wt) {

        if (this._scaleMin)
        {
            if (wt.a < this._scaleMin.x)
            {
                wt.a = this._scaleMin.x;
            }

            if (wt.d < this._scaleMin.y)
            {
                wt.d = this._scaleMin.y;
            }
        }

        if (this._scaleMax)
        {
            if (wt.a > this._scaleMax.x)
            {
                wt.a = this._scaleMax.x;
            }

            if (wt.d > this._scaleMax.y)
            {
                wt.d = this._scaleMax.y;
            }
        }

    },

    /**
    * Set the minimum scale this Sprite will scale down to. Prevents a parent from scaling this Sprite lower than the given value. Set to `null` to remove.
    *
    * @property {Phaser.Point} scaleMin
    */
    scaleMin: {

        get: function () {
            return this._scaleMin;
        },

        set: function (value) {
            this._scaleMin = value;
            this.transformCallback = (this._scaleMin || this._scaleMax) ? this.checkTransform : null;
            return value;
        }

    },

    /**
    * Set the maximum scale this Sprite will scale up to. Prevents a parent from scaling this Sprite higher than the given value. Set to `null` to remove.
    *
    * @property {Phaser.Point} scaleMax
    */
    scaleMax: {

        get: function () {
            return this._scaleMax;
        },

        set: function (value) {
            this._scaleMax = value;
            this.transformCallback = (this._scaleMin || this._scaleMax) ? this.checkTransform : null;
            return value;
        }

    },

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
    * @method Phaser.GameObject.CoreMixin#setScaleMinMax
    * @param {number|null} minX - The minimum horizontal scale value this Image can scale down to.
    * @param {number|null} minY - The minimum vertical scale value this Image can scale down to.
    * @param {number|null} maxX - The maximum horizontal scale value this Image can scale up to.
    * @param {number|null} maxY - The maximum vertical scale value this Image can scale up to.
    */
    setScaleMinMax: function (minX, minY, maxX, maxY) {

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

    },

    /**
    * Kills the game object.
    *
    * A killed game object has its `exists`, and `visible` set to false
    * and will dispatch the `onKilled` event
    *
    * Killing a game object is a way to recycle it a parent Group/pool, but it doesn't free it from memory.
    * Use {@link Phaser.GameObject.CoreMixin#destroy destroy} if the sprite is no longer needed.
    *
    * @method Phaser.GameObject.CoreMixin#kill
    * @return {object} This game object instance.
    */
    kill: function() {

        if (typeof this.alive === 'boolean')
        {
            this.alive = false;
        }
        this.exists = false;
        this.visible = false;

        if (this.events)
        {
            this.events.onKilled$dispatch(this);
        }

        return this;

    },

    /**
    * Resets the game object.
    *
    * This places the game object at the given x/y world coordinates and then
    * sets `alive` (if supported), `exists`, `visible`, and `renderable` to true.
    *
    * @method Phaser.GameObject.CoreMixin#reset
    * @param {number} x - The x coordinate (in world space) to position the Image at.
    * @param {number} y - The y coordinate (in world space) to position the Image at.
    * @return {object} This game object instance.
    */
    reset: function(x, y) {

        this.world.setTo(x, y);
        this.position.x = x;
        this.position.y = y;

        if (typeof this.alive === 'boolean')
        {
            this.alive = true;
        }
        this.exists = true;
        this.visible = true;
        this.renderable = true;

        if (this.body)
        {
            this.body.reset(x, y, false, false);
        }

        // "is fresh"
        this._cache[4] = 1;

        return this;

    },

    /**
    * Destroys the game object.
    *
    * This removes it from its parent group, destroys the event and animation handlers if present
    * and nulls its reference to game, freeing it up for garbage collection.
    *
    * @method Phaser.GameObject.CoreMixin#destroy
    * @param {boolean} [destroyChildren=true] - Should every child of this object have its destroy method called?
    */
    destroy: function(destroyChildren) {

        if (this.game === null || this.destroyPhase) { return; }

        if (typeof destroyChildren === 'undefined') { destroyChildren = true; }

        this._cache[8] = 1;

        if (this.events)
        {
            this.events.onDestroy$dispatch(this);
        }

        this.destroyImpl();

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

        if (this._crop)
        {
            this._crop = null;
        }

        if (this._frame)
        {
            this._frame = null;
        }

        this.exists = false;
        this.visible = false;
        if ('alive' in this)
        {
            this.alive = false;
        }

        this.filters = null;
        this.mask = null;
        this.game = null;

        this._cache[8] = 0;

    },

    /**
    * This is called by `destroy`.
    *
    * It is a suitable place for custom cleanup.
    *
    * @method Phaser.GameObject.CoreMixin#destroyImpl
    * @protected
    */
    destroyImpl: function () {
    },

    /**
    * Control if the core game loop and physics (if applicable) update this game object or not.
    *
    * The game objects visible property will be set to false (or true) if exists is set to false (or true).
    *
    * If the game object has a physics body then it will cleared (or re-added) as exists is set to false (or true).
    *
    * @property {boolean} exists
    */
    exists: {

        get: function () {

            return this._cache[6] === 1;

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

    },

    /**
    * The coordinate of the object relative to the local coordinates of the parent.
    *
    * Consider usin the `x` and `y` properties of the game object instead (as they may work better
    * with physics..)
    *
    * @property {PIXI.Point} position
    * @internal
    */
    // PIXI doc override (attempt)

    /**
    * The position of the game object on the x axis relative to the local coordinates of the parent.
    *
    * @property {number} x
    */
    x: {

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

    },

    /**
    * The position of the game object on the y axis relative to the local coordinates of the parent.
    *
    * @property {number} y
    */
    y: {

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

    },

    /**
    * The rotation of the game object, in degrees, from its original orientation.
    * 
    * Values from 0 to 180 represent clockwise rotation; values from 0 to -180 represent counterclockwise rotation.
    * Values outside this range are added to or subtracted from 360 to obtain a value within the range. For example, the statement player.angle = 450 is the same as player.angle = 90.
    *
    * If you wish to work in radians instead of degrees use the `rotation` property instead. Working in radians is also a little faster as it doesn't have to convert the angle.
    *
    * @property {number} angle
    */
    angle: {

        get: function() {

            return Phaser.Math.wrapAngle(Phaser.Math.radToDeg(this.rotation));

        },

        set: function(value) {

            this.rotation = Phaser.Math.degToRad(Phaser.Math.wrapAngle(value));

        }

    },

    /**
    * The delta x value: the difference between world.x now and in the previous step.
    *
    * Positive if the motion was to the right, negative if to the left.
    *
    * @property {number} deltaX
    * @readonly
    */
    deltaX: {

        get: function() {

            return this.world.x - this._cache[0];

        }

    },

    /**
    * The delta y value: the difference between world.y now and in the previous step.
    *
    * Positive if the motion was downwards, negative if upwards.
    *
    * @property {number} deltaY
    * @readonly
    */
    deltaY: {

        get: function() {

            return this.world.y - this._cache[1];

        }

    },

    /**
    * The delta z value: the difference between rotation now and in the previous step.
    *
    * @property {number} deltaZ
    * @readonly
    * @todo Check name / operation.
    */
    deltaZ: {

        get: function() {

            return this.rotation - this._cache[2];

        }

    },

    /**
    * True if any part of the Image bounds are within the game world, otherwise false.
    *
    * @property {boolean} inWorld
    * @readonly
    */
    inWorld: {

        get: function() {

            return this.game.world.bounds.intersects(this.getBounds());

        }

    },

    /**
    * True if any part of the Image bounds are within the game camera view, otherwise false.
    *
    * @property {boolean} inCamera
    * @readonly
    */
    inCamera: {

        get: function() {

            return this.game.world.camera.screenView.intersects(this.getBounds());

        }

    },

    /**
    * The render order ID, reset every frame.
    *
    * @property {integer} renderOrderID
    * @readonly
    * @protected
    */
    renderOrderID: {

        get: function() {

            return this._cache[3];

        }

    },

    /**
    * An sprite that is fixed to the camera uses its x/y coordinates as offsets from the top left of the camera; these are stored in Image.cameraOffset.
    *
    * Note that the cameraOffset values are in addition to any parent in the display list.
    * So if this Image was in a Group that has x: 200, then this will be added to the cameraOffset.x
    *
    * @property {boolean} fixedToCamera
    */
    fixedToCamera: {

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

    },

    /**
    * Is this game object currently being destroyed?
    *
    * @property {boolean} destroyPhase
    * @readonly
    * @protected
    */
    destroyPhase: {

        get: function () {

            return !!this._cache[8];

        }

    }

};

/**
* @classdesc
* The Culling mixin.
*
* This provide properties for camera/world culling.
*
* @class Phaser.GameObject.CullingMixin
* @protected
*/
Phaser.GameObject.CullingMixin = function () {
};

Phaser.GameObject.CullingMixin.prototype = /* @lends Phaser.GameObject.CullingMixin */ {

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
    autoCull: false,

    /**
    * If true the Sprite checks if it is still within the world each frame, when it leaves the world it dispatches Sprite.events.onOutOfBounds
    * and optionally kills the sprite (if Sprite.outOfBoundsKill is true). By default this is disabled because the Sprite has to calculate its
    * bounds every frame to support it, and not all games need it. Enable it by setting the value to true.
    *
    * @property {boolean} checkWorldBounds
    * @default
    */
    checkWorldBounds: false,

    /**
    * If true {@link Phaser.GameObject.CoreMixin kill} is called when {@link Phaser.GameObject.CoreMixin inWorld} returns false.
    * This check is done in the update when as long as {@link checkWorldBounds} is true.
    *
    * @property {boolean} outOfBoundsKill
    * @default
    */
    outOfBoundsKill: false

};

/**
* @classdesc
* The Texture mixin.
*
* This provides support for loading textures and specifying texture crops and framing.
* This also includes an animation manager.
*
* @class Phaser.GameObject.TextureMixin
* @protected
*/
Phaser.GameObject.TextureMixin = function () {
};

Phaser.GameObject.TextureMixin.prototype = /* @lends Phaser.GameObject.TextureMixin */ {

    /**
    * This is the image or texture used by the Image during rendering.
    *
    * It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture, BitmapData or PIXI.Texture.
    *
    * @property {string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture} key
    * @readonly
    */
    key: null,

    /**
    * This manages animations of the sprite. You can modify animations through it (see Phaser.AnimationManager)
    *
    * @property {Phaser.AnimationManager} animations
    */
    animations: null,

    /**
    * The Rectangle used to crop the texture.
    *
    * Set this via {@link Phaser.GameObject.TextureMixin#crop crop} and use {@link Phaser.GameObject.TextureMixin#updateCrop updateCrop} as required.
    *
    * @property {Phaser.Rectangle} cropRect
    * @default
    * @readonly
    */
    cropRect: null,

    /**
    * Internal cache var for texture crop.
    *
    * @property {Phaser.Rectangle} _crop
    * @private
    */
    _crop: null,

    /**
    * Internal cache var for texture frame.
    *
    * @property {Phaser.Rectangle} _frame
    * @private
    */
    _frame: null,

    /**
    * Changes the underlying Texture.
    *
    * This causes a WebGL texture update, so use sparingly or in low-intensity portions of your game.
    *
    * @method Phaser.GameObject.TextureMixin#loadTexture
    * @param {string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture} key - This is the image or texture used by the Image during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture, BitmapData or PIXI.Texture.
    * @param {string|number} frame - If this Image is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
    */
    // Required: key, setTexture, smoothed, animations, texture, _frame
    loadTexture: function (key, frame) {

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

    },

    /**
    * Sets the displayed Texture frame bounds.
    *
    * This is primarily an internal method used by Image.loadTexture.
    *
    * @method Phaser.GameObject.TextureMixin#setFrame
    * @param {Phaser.Frame} frame - The Frame to be used by the texture.
    */
    setFrame: function(frame) {

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

    },

    /**
    * Resets the Texture frame bounds that are used for rendering.
    *
    * @method Phaser.GameObject.TextureMixin#resetFrame
    */
    resetFrame: function() {

        if (this._frame)
        {
            this.setFrame(this._frame);
        }

    },

    /**
    * Crops the texture used for display. Cropping takes place from the top-left of the sprite.
    *
    * This method does not create a copy of `rect` by default: the rectangle can shared between
    * multiple sprite and updated in real-time. In this case, `updateCrop` must be called after any modifications
    * to the shared/non-copied rectangle before the crop will be updated.
    *
    * The rectangle object can be a Phaser.Rectangle or any object so long as it has public x, y, width and height properties.
    *
    * @method Phaser.GameObject.TextureMixin#crop
    * @param {?Phaser.Rectangle} rect - The Rectangle used during cropping. Pass null or no parameters to clear a previously set crop rectangle.
    * @param {boolean} [copy=false] - If false Sprite.cropRect will be a reference to the given rect. If true it will copy the rect values into a local Sprite.cropRect object.
    */
    crop: function(rect, copy) {

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

    },

    /**
    * Update the texture crop.
    *
    * If the rectangle supplied to `crop` has been modified (and was not copied),
    * then this method needs to be called to update the internal crop/frame data.
    *
    * @method Phaser.GameObject.TextureMixin#updateCrop
    */
    updateCrop: function () {

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

    },

    /**
    * Enable or disable texture smoothing for this game object; does not affect children.
    * 
    * Set to true to smooth the texture, or false to disable smoothing (great for pixel art).
    *
    * Smoothing only works for bitmap/image textures.
    *
    * @property {boolean} smoothed
    * @default true
    */
    smoothed: {

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

    },

    /**
    * Gets or sets the current frame index and updates the Texture for display.
    *
    * @property {number} frame
    * @deprecated 
    */
    frame: {

        get: function() {

            return this.animations.frame;

        },

        set: function(value) {

            this.animations.frame = value;

        }

    },

    /**
    * Gets or sets the current frame by name and updates the Texture for display.
    *
    * @property {string} frameName
    */
    frameName: {

        get: function() {

            return this.animations.frameName;

        },

        set: function(value) {

            this.animations.frameName = value;

        }

    }

};

/**
* @classdesc
* The Input mixin.
*
* This provides support for enabling and handling input.
*
* @class Phaser.GameObject.InputMixin
* @protected
*/
Phaser.GameObject.InputMixin = function () {
};

Phaser.GameObject.InputMixin.prototype = /* @lends Phaser.GameObject.InputMixin */ {

    /**
    * The Input Handler for this object. Must be enabled with `inputEnabled` before use.
    *
    * @property {Phaser.InputHandler|null} input
    */
    input: null,

    /**
    * By default a sprite won't process any input events at all. By setting inputEnabled to true the Phaser.InputHandler is
    * activated for this object and it will then start to process click/touch events and more.
    *
    * @property {boolean} inputEnabled
    */
    inputEnabled: {

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

    }

};

/**
* @classdesc
* The Events mixin.
*
* This provides support for the standard events object.
*
* @class Phaser.GameObject.EventsMixin
* @protected
*/
Phaser.GameObject.EventsMixin = function () {
};

Phaser.GameObject.EventsMixin.prototype = /* @lends Phaser.GameObject.EventsMixin */ {

    /**
    * The Events you can subscribe to that are dispatched when certain things happen on this Image or its components.   
    *
    * @property {?Phaser.Events} events
    */
    events: null

};

/**
* @classdesc
* The Physics mixin.
*
* This provides support for a physics body.
*
* @class Phaser.GameObject.PhysicsMixin
* @protected
*/
Phaser.GameObject.PhysicsMixin = function () {
};

Phaser.GameObject.PhysicsMixin.prototype = /* @lends Phaser.GameObject.PhysicsMixin */ {

    /**
    * By default game objects are not part of any physics system and body will be `null`.
    *
    * To enable them for physics you need to call `game.physics.enable(sprite, system)` where `sprite` is this object
    * and `system` is the Physics system you want to use to manage this body. Once enabled you can access all physics related properties via `Sprite.body`.
    *
    * _Important:_ Enabling a Sprite for P2 or Ninja physics will automatically set `Sprite.anchor` to 0.5 so the physics body is centered on the Sprite.
    * If you need a different result then adjust or re-create the Body shape offsets manually, and/or reset the anchor after enabling physics.
    *
    * @property {Phaser.Physics.Arcade.Body|Phaser.Physics.P2.Body|Phaser.Physics.Ninja.Body|null} body
    * @default
    */
    body: null

};

/**
* @classdesc
* The Life mixin.
*
* This provides support for 'alive' as well as killing and reviving;
* does not support health, which is a specialization.
*
* @class Phaser.GameObject.LifeMixin
* @protected
*/
Phaser.GameObject.LifeMixin = function () {
};

Phaser.GameObject.LifeMixin.prototype = /* @lends Phaser.GameObject.LifeMixin */ {

    /**
    * Is this game object 'alive'?
    *
    * This use useful for game logic, but does not affect the rendering/visibility directly.
    *
    * @property {boolean} alive
    * @default
    */
    alive: false,

    /**
    * @property {number} health - Health value.
    *     Used in combination with {@link damage} to allow for quick killing of game objects.
    */
    health: 1,

    /**
    * The object lifetime, in physics milliseconds.
    *
    * Once 'born' you can set this to a positive value that will decay; once it reaches zero the object is killed.
    * Handy for particles, bullets, etc.
    *
    * The lifespan is decremented by number of elapsed physics milliseconds each logic update
    * and {@link kill} is called once the lifespan reaches 0.  
    * Manually resetting this value to zero will not automatically kill the object.
    *
    * @property {number} lifespan
    * @default
    */
    lifespan: 0,

    /**
    * Brings a 'dead' sprite back to life.
    *
    * A resurrected object has its `alive`, `exists`, and `visible` properties set to true
    * and the `onRevived` event will be dispatched.
    *
    * @param {number} [health=1] - The health to give.
    * @return {object} This game object instance.
    */
    revive: function (health) {

        if (typeof health === 'undefined') { health = 1; }

        this.health = health;

        this.alive = true;
        this.exists = true;
        this.visible = true;

        if (this.events)
        {
            this.events.onRevived$dispatch(this);
        }

        return this;

    },

    /**
    * Damages the object by removing the given amount of health.
    *
    * The {@link kill} method is called if {@link health} falls to 0 or below.
    *
    * @param {number} amount - The amount to subtract from the Sprite.health value.
    * @return {Phaser.Sprite} This instance.
    */
    damage: function(amount) {

        if (this.alive)
        {
            this.health -= amount;

            if (this.health <= 0)
            {
                this.kill();
            }
        }

        return this;

    },

    /**
    * Kills the game object.
    *
    * A killed game object has its `alive`, `exists`, and `visible` properties all set to false
    * and the `onKilled` event will be dispatched.
    *
    * The {@link health} property is unaffected.
    *
    * Killing a game object is a way to recycle it a parent Group/pool, but it doesn't free it from memory.
    * Use {@link Phaser.GameObject.CoreMixin#destroy destroy} if the sprite is no longer needed.
    *
    * @method Phaser.GameObject.LifeMixin#kill
    * @return {object} This game object instance.
    */
    kill: function() {

        this.alive = false;
        this.exists = false;
        this.visible = false;

        if (this.events)
        {
            this.events.onKilled$dispatch(this);
        }

        return this;

    }

};
