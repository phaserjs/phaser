/**
* @class Phaser.GameObject
*/
Phaser.GameObject = {};

Phaser.GameObject.CULLING = 1 << 1;
Phaser.GameObject.TEXTURE = 1 << 2;
Phaser.GameObject.INPUT = 1 << 3;
Phaser.GameObject.EVENTS = 1 << 4;
Phaser.GameObject.PHYSICS = 1 << 5;
Phaser.GameObject.LIFE = 1 << 6;

/**
* Supports core, culling, and input - no physics or textures and they are expected to be provided by the implementation.
*/
Phaser.GameObject.GRAPHICS_LIKE = Phaser.GameObject.CULLING | Phaser.GameObject.INPUT;

/**
* A sprite is a "full" game object.
*/
Phaser.GameObject.SPRITE_LIKE = Phaser.GameObject.CULLING | Phaser.GameObject.TEXTURE | Phaser.GameObject.INPUT | Phaser.GameObject.PHYSICS | Phaser.GameObject.LIFE;

/**
* There isn't much difference between an Image (basis of Button) and a Sprite (bases of Particle),
* but one difference is that an Image doesn't technically support Physics.
*
* The Life mixin for compatibility with existing code.
*/
Phaser.GameObject.IMAGE_LIKE = Phaser.GameObject.CULLING | Phaser.GameObject.TEXTURE | Phaser.GameObject.INPUT | Phaser.GameObject.LIFE;

/**
* Mixes in mixin with target.
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
* GameObjectMixin, and the associated mixins, are types that provides common features found in Sprite-like objects.
*
* A mixin approach is used to avoid altering the prototype inheritance while providing maximum
* feature compatibility and code/documentation sharing between existing types.
*
* This approach has been design/optimizied for maximum code-resue and consistency with minimal performance
* impact; the shared functions may even improve overall performance, even if they are not specialized.
* Judicial guards are used around features and care is taken to not introduce extra work.
*
* Google Closure Compiler should support @interface/@extends and @interface/@implements.
* JSDoc-dev currently supports @interface/@extends and should support @interface/@implements by 3.3.0-final.
* Even though no MI is used, multiple @extends JSDoc doclets result in usable/relevant output that shows the
* mixin member with the type and links to the inherited base.
*
* The following core mixins are available:
*
* - GameObjectCoreMixin (name, debug, _bounds, z, exists, ?events, _cached, update logic, world, cameraBounds, fixedToCamera)
*   This must be included if any other mixin is used, and should likely be included for all types deriving
*   from PIXI.DisplayObject.
* - GameObjectCullingMixin (autoCull, checkWorldBounds, fixedToCamera)
* - GameObjectTextureMixin (frame, crop, animation, key, _frame, _crop)
* - GameObjectPhysicsMixin (body)
* - GameObjectLifeMixin (alive, revive, kill, outOfBoundsKill)
* - GameObjectInputMixin (input, enableInput)
*
* All game objects are expected to inherit from PIXI.DisplayObject or otherwise 
* implementation the methods and properties it defines.
*
* @name Phaser.GameObject.CoreMixin
* @interface
* @protected
*/

/**
* Mixes Phaser.GameObject.CoreMixin into the target.
*
* @method Phaser.GameObject.CoreMixin.mix
* @param {object} target - The target prototype/instance.
* @param {integer} mixinMask - The game object mixins to apply.
* @protected
*/
Phaser.GameObject.mix = function (target, mixinMask) {

    Phaser.GameObject.mixPrototype(target, Phaser.GameObject.CoreMixin.prototype);

    if (mixinMask & (Phaser.GameObject.INPUT | Phaser.GameObject.CULLING))
    {
        mixinMask |= Phaser.GameObject.EVENTS;
    }

    if (mixinMask & Phaser.GameObject.CULLING)
    {
        Phaser.GameObject.mixPrototype(target, Phaser.GameObject.CullingMixin.prototype);
    }
    
    if (mixinMask & Phaser.GameObject.TEXTURE)
    {
        Phaser.GameObject.mixPrototype(target, Phaser.GameObject.TextureMixin.prototype);
    }

    if (mixinMask & Phaser.GameObject.INPUT)
    {
        Phaser.GameObject.mixPrototype(target, Phaser.GameObject.InputMixin.prototype);
    }

    if (mixinMask & Phaser.GameObject.EVENTS)
    {
        Phaser.GameObject.mixPrototype(target, Phaser.GameObject.EventsMixin.prototype);
    }

    if (mixinMask & Phaser.GameObject.PHYSICS)
    {
        Phaser.GameObject.mixPrototype(target, Phaser.GameObject.PhysicsMixin.prototype);
    }

    if (mixinMask & Phaser.GameObject.LIFE)
    {
        Phaser.GameObject.mixPrototype(target, Phaser.GameObject.LifeMixin.prototype);
    }

};

/**
* Initializes the mixin: call in the constructor, with the "this context", after calling the base constructor.
*
* @method Phaser.GameObject.CoreMixin.omot
* @param {integer} mixinMask - The game object mixins to apply.
* @protected
*/
Phaser.GameObject.init = function (mixinMask) {

    if (mixinMask & (Phaser.GameObject.INPUT | Phaser.GameObject.CULLING))
    {
        mixinMask |= Phaser.GameObject.EVENTS;
    }

    // Cache used by `exists` - and maybe others
    this._cache = [ 0, 0, 0, 0, 1, 0, 1, 0, 0 ];

    // Defaults in prototype
    // this.name = '';
    // this.debug = false;

    this.exists = true;

    this.z = 0;

    this.world = new Phaser.Point();

    this.cameraOffset = new Phaser.Point();

    // Defaults in prototype, but promote to instance
    this.autoCull = this.autoCull;
    this.checkWorldBounds = this.checkWorldBounds;
    //this.outOfBoundsKill = false;

    // Added with `enableInput`
    this.input = null;

    if (mixinMask & Phaser.GameObject.EVENTS)
    {
        this.events = new Phaser.Events(this);
    }

    if (mixinMask & Phaser.GameObject.TEXTURE)
    {
        // `key` not available, should be set externally
        // this.key = key;
        this.animations = new Phaser.AnimationManager(this);
        // Defaults in prototype
        // this.cropRect = null;
        // this._crop = null;
        // this._frame = null;
    }

    if (mixinMask & Phaser.GameObject.PHYSICS)
    {
        // Physics is a special-case and `body` is expected to be a hasOwnProperty
        this.body = null;
    }

    if (mixinMask & Phaser.GameObject.LIFE)
    {
        this.alive = true;
    }

    this._bounds = new Phaser.Rectangle();

};

/**
* The core game object mixin.
* @namespace Phaser.GameObject
* @class Phaser.GameObject.CoreMixin
*/
Phaser.GameObject.CoreMixin = function () {
};

Phaser.GameObject.CoreMixin.prototype = /* @lends Phaser.GameObject.CoreMixin */ {

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
    * An game object is only visible / update if it exists.
    *
    * @property {boolean} exists
    * @default
    */
    // Implemented as property

    /**
    * The z-depth value of this object within its Group (the World is a Group as well).
    * No two objects in a Group can have the same z value.
    *
    * @property {integer} z
    */
    z: 0,

    /**
    * The world coordinates of this sprite.
    *
    * This differs from the local x/y coordinates which are relative to the parent.
    *
    * @property {Phaser.Point} world
    */
    world: null,

    /**
    * If this object is `fixedToCamera` then this stores the x/y offset that its drawn at, from the top-left of the camera view.
    *
    * @property {Phaser.Point} cameraOffset
    */
    cameraOffset: null,

    /**
    * Set the minimum scale this Sprite will scale down to. Prevents a parent from scaling this Sprite lower than the given value. Set to `null` to remove.
    *
    * @property {Phaser.Point} scaleMin
    */
    scaleMin: null,

    /**
    * Set the maximum scale this Sprite will scale up to. Prevents a parent from scaling this Sprite higher than the given value. Set to `null` to remove.
    *
    * @property {Phaser.Point} scaleMax
    */
    scaleMax: null,

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
    * @property {Array} _bounds
    * @private
    */
    _bounds: null,

    /**
    * Override and this method for custom update logic.
    *
    * If this game object has any children you should call update on them too.
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

            if (this.exists && this.body)
            {
                this.body.preUpdate();
            }

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
                    if (this.events)
                    {
                        this.events.onEnterBounds.dispatch(this);
                    }
                }
                else if (this._cache[5] === 0 && !worldBoundIntersect)
                {
                    //  The display object WAS in the screen, but has now left.
                    this._cache[5] = 1;
                    if (this.events)
                    {
                        this.events.onOutOfBounds.dispatch(this);
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

        this.preUpdateCustom();

        if (!this.exists)
        {
            // May no longer exist after preUpdateCustom
            return false;
        }

        if (this.animations)
        {
            this.animations.update();
        }

        if (this.exists && this.body)
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

        //  Update any Children
        if (this.children && this.children.length)
        {
            for (var i = 0, len = this.children.length; i < len; i++)
            {
                this.children[i].preUpdate();
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

        this.postUpdateCustom();

        if (this.exists && this.body)
        {
            this.body.postUpdate();
        }

        //  Update any Children
        if (this.children && this.children.length)
        {
            for (var i = 0, len = this.children.length; i < len; i++)
            {
                this.children[i].postUpdate();
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
    preUpdateCustom: function() {
    },

    /**
    * Called from the default `postUpdate`.
    *
    * This is called after any internal rendering cleanup and after the
    * position has been adjusted if fixedToCamera.
    *
    * @method Phaser.GameObject.CoreMixin#update
    * @protected
    */
    postUpdateCustom: function() {
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

        if ('alive' in this)
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
            this.events.onDestroy.dispatch(this);
        }

        this.destroyCustom();

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
    * @method Phaser.GameObject.CoreMixin#destroyCustom
    * @protected
    */
    destroyCustom: function () {
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

    },

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
* The game object culling mixin.
* @class Phaser.GameObject.CullingMixin
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
    checkWorldBounds: false

};

/**
* The game object texture mixin.
* @class Phaser.GameObject.TextureMixin
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
    */
    frame: {

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

    },

    /**
    * Gets or sets the current frame by name and updates the Texture for display.
    *
    * @property {string} frameName
    */
    frameName: {

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

    }

};

/**
* The game object input mixin.
* @class Phaser.GameObject.InputMixin
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
* The game object input mixin.
* @class Phaser.GameObject.EventsMixin
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
* The game object physics mixin.
* @class Phaser.GameObject.PhysicsMixin
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
* The game object life mixin.
* @class Phaser.GameObject.LifeMixin
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
    * If true Sprite.kill is called as soon as Sprite.inWorld returns false, as long as Sprite.checkWorldBounds is true.
    *
    * @property {boolean} outOfBoundsKill
    * @default
    */
    outOfBoundsKill: false,

    /**
    * Brings a 'dead' sprite back to life.
    *
    * A resurrected Image has its `alive`, `exists`, and `visible` properties set to true
    * and the `onRevived` event will be dispatched.
    *
    * @method Phaser.GameObject.LifeMixin#revive
    * @return {object} This game object instance.
    */
    revive: function() {

        this.alive = true;
        this.exists = true;
        this.visible = true;

        if (this.events)
        {
            this.events.onRevived.dispatch(this);
        }

        return this;

    },

    /**
    * Kills the game object.
    *
    * A killed game object has its `alive`, `exists`, and `visible` properties all set to false
    * and the `onKilled` event will be dispatched.
    *
    * Killing a game object is a way to recycle it a parent Group/pool, but it doesn't free it from memory.
    * Use {@link Phaser.GameObject.CoreMixin#destroy destrop} if the sprite is no longer needed.
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
            this.events.onKilled.dispatch(this);
        }

        return this;

    }

};
