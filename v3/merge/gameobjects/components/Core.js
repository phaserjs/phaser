/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Core Component Features.
*
* @class
*/
Phaser.Component.Core = function () {};

/**
* Installs / registers mixin components.
*
* The `this` context should be that of the applicable object instance or prototype.
*
* @method
* @protected
*/
Phaser.Component.Core.install = function (components) {

    // Always install 'Core' first
    Phaser.Utils.mixinPrototype(this, Phaser.Component.Core.prototype);

    this.components = {};

    for (var i = 0; i < components.length; i++)
    {
        var id = components[i];
        var replace = false;

        if (id === 'Destroy')
        {
            replace = true;
        }

        Phaser.Utils.mixinPrototype(this, Phaser.Component[id].prototype, replace);

        this.components[id] = true;
    }

};

/**
* Initializes the mixin components.
*
* The `this` context should be an instance of the component mixin target.
*
* @method
* @protected
*/
Phaser.Component.Core.init = function (game, x, y, key, frame)
{
    this.game = game;

    this.key = key;

    this.data = {};

    this.texture = game.textures.get(key);

    this.frame = (this.texture) ? this.texture.get(frame) : null;

    this.position.set(x, y);
    this.world = new Phaser.Point(x, y);
    this.previousPosition = new Phaser.Point(x, y);

    this.events = new Phaser.Events(this);

    this._bounds = new Phaser.Rectangle();

    if (this.components.PhysicsBody)
    {
        // Enable-body checks for hasOwnProperty; makes sure to lift property from prototype.
        this.body = this.body;
    }

    if (this.components.Animation)
    {
        this.animations = new Phaser.AnimationManager(this);
    }

    if (this.components.FixedToCamera)
    {
        this.cameraOffset = new Phaser.Point(x, y);
    }

};

Phaser.Component.Core.preUpdate = function () {

    if (this.pendingDestroy)
    {
        this.destroy();
        return;
    }

    this.previousPosition.set(this.world.x, this.world.y);
    this.previousRotation = this.rotation;

    if (!this.exists || !this.parent.exists)
    {
        this.renderOrderID = -1;
        return false;
    }

    this.world.setTo(this.game.camera.x + this.worldTransform.tx, this.game.camera.y + this.worldTransform.ty);

    if (this.visible)
    {
        this.renderOrderID = this.game.stage.currentRenderOrderID++;
    }

    if (this.animations)
    {
        this.animations.update();
    }

    if (this.body)
    {
        this.body.preUpdate();
    }

    for (var i = 0; i < this.children.length; i++)
    {
        this.children[i].preUpdate();
    }

    return true;

};

Phaser.Component.Core.prototype = {

    /**
    * A reference to the currently running Game.
    * @property {Phaser.Game} game
    */
    game: null,

    /**
    * A user defined name given to this Game Object.
    * This value isn't ever used internally by Phaser, it is meant as a game level property.
    * @property {string} name
    * @default
    */
    name: '',

    /**
    * An empty Object that belongs to this Game Object.
    * This value isn't ever used internally by Phaser, but may be used by your own code, or
    * by Phaser Plugins, to store data that needs to be associated with the Game Object,
    * without polluting the Game Object directly.
    * @property {Object} data
    * @default
    */
    data: {},

    /**
    * The components this Game Object has installed.
    * @property {object} components
    * @protected
    */
    components: {},

    /**
    * The z depth of this Game Object within its parent Group.
    * No two objects in a Group can have the same z value.
    * This value is adjusted automatically whenever the Group hierarchy changes.
    * If you wish to re-order the layering of a Game Object then see methods like Group.moveUp or Group.bringToTop.
    * @property {number} z
    * @readOnly
    */
    z: 0,

    /**
    * All Phaser Game Objects have an Events class which contains all of the events that are dispatched when certain things happen to this
    * Game Object, or any of its components.
    * @see Phaser.Events
    * @property {Phaser.Events} events
    */
    events: undefined,

    /**
    * If the Game Object is enabled for animation (such as a Phaser.Sprite) this is a reference to its AnimationManager instance.
    * Through it you can create, play, pause and stop animations.
    * @see Phaser.AnimationManager
    * @property {Phaser.AnimationManager} animations
    */
    animations: undefined,

    /**
    * The key of the image or texture used by this Game Object during rendering.
    * If it is a string it's the string used to retrieve the texture from the Phaser Image Cache.
    * It can also be an instance of a RenderTexture, BitmapData, Video or PIXI.Texture.
    * If a Game Object is created without a key it is automatically assigned the key `__default` which is a 32x32 transparent PNG stored within the Cache.
    * If a Game Object is given a key which doesn't exist in the Image Cache it is re-assigned the key `__missing` which is a 32x32 PNG of a green box with a line through it.
    * @property {string|Phaser.RenderTexture|Phaser.BitmapData|Phaser.Video|PIXI.Texture} key
    */
    key: '',

    /**
    * The world coordinates of this Game Object in pixels.
    * Depending on where in the display list this Game Object is placed this value can differ from `position`, 
    * which contains the x/y coordinates relative to the Game Objects parent.
    * @property {Phaser.Point} world
    */
    world: null,

    /**
    * A debug flag designed for use with `Game.enableStep`.
    * @property {boolean} debug
    * @default
    */
    debug: false,

    /**
    * The position the Game Object was located in the previous frame.
    * @property {Phaser.Point} previousPosition
    * @readOnly
    */
    previousPosition: null,

    /**
    * The rotation the Game Object was in set to in the previous frame. Value is in radians.
    * @property {number} previousRotation
    * @readOnly
    */
    previousRotation: 0,

    /**
    * The render order ID is used internally by the renderer and Input Manager and should not be modified.
    * This property is mostly used internally by the renderers, but is exposed for the use of plugins.
    * @property {number} renderOrderID
    * @readOnly
    */
    renderOrderID: 0,

    /**
    * A Game Object is considered `fresh` if it has just been created or reset and is yet to receive a renderer transform update.
    * This property is mostly used internally by the physics systems, but is exposed for the use of plugins.
    * @property {boolean} fresh
    * @readOnly
    */
    fresh: true,

    /**
    * A Game Object is that is pendingDestroy is flagged to have its destroy method called on the next logic update.
    * You can set it directly to allow you to flag an object to be destroyed on its next update.
    * 
    * This is extremely useful if you wish to destroy an object from within one of its own callbacks 
    * such as with Buttons or other Input events.
    * 
    * @property {boolean} pendingDestroy
    */
    pendingDestroy: false,

    /**
    * @property {Phaser.Rectangle} _bounds - Internal cache var.
    * @private
    */
    _bounds: null,

    /**
    * @property {boolean} _exists - Internal cache var.
    * @private
    */
    _exists: true,

    /**
    * Controls if this Game Object is processed by the core game loop.
    * If this Game Object has a physics body it also controls if its physics body is updated or not.
    * When `exists` is set to `false` it will remove its physics body from the physics world if it has one.
    * It also toggles the `visible` property to false as well.
    *
    * Setting `exists` to true will add its physics body back in to the physics world, if it has one.
    * It will also set the `visible` property to `true`.
    *
    * @property {boolean} exists
    */
    exists: {

        get: function () {

            return this._exists;

        },

        set: function (value) {

            if (value)
            {
                this._exists = true;

                if (this.body && this.body.type === Phaser.Physics.P2JS)
                {
                    this.body.addToWorld();
                }

                this.visible = true;
            }
            else
            {
                this._exists = false;

                if (this.body && this.body.type === Phaser.Physics.P2JS)
                {
                    this.body.removeFromWorld();
                }

                this.visible = false;
            }

        }

    },

    /**
    * Override this method in your own custom objects to handle any update requirements.
    * It is called immediately after `preUpdate` and before `postUpdate`.
    * Remember if this Game Object has any children you should call update on those too.
    *
    * @method
    */
    update: function() {

    },

    /**
    * Internal method called by the World postUpdate cycle.
    *
    * @method
    * @protected
    */
    postUpdate: function() {

        if (this.customRender)
        {
            this.key.render();
        }

        if (this.components.PhysicsBody)
        {
            Phaser.Component.PhysicsBody.postUpdate.call(this);
        }

        if (this.components.FixedToCamera)
        {
            Phaser.Component.FixedToCamera.postUpdate.call(this);
        }

        for (var i = 0; i < this.children.length; i++)
        {
            this.children[i].postUpdate();
        }

    }

};
