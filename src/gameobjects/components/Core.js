Phaser.Component.Core = function () {};

Phaser.Component.Core.install = function (components) {

    this.components = {};

    for (var i = 0; i < components.length; i++)
    {
        var id = components[i];

        Phaser.Utils.mixinPrototype(this, Phaser.Component[id].prototype);

        this.components[id] = true;
    }

};

Phaser.Component.Core.init = function (game, x, y, key, frame) {

    this.game = game;

    this.key = key;

    this.position.set(x, y);
    this.world = new Phaser.Point(x, y);
    this.previousPosition = new Phaser.Point(x, y);

    this.events = new Phaser.Events(this);

    this._bounds = new Phaser.Rectangle();

    if (this.components.Animation)
    {
        this.animations = new Phaser.AnimationManager(this);
    }

    if (this.components.LoadTexture && key !== null)
    {
        this.loadTexture(key, frame);
    }

};

Phaser.Component.Core.preUpdate = function () {

    this.previousPosition.set(this.world.x, this.world.y);
    this.previousRotation = this.rotation;

    if (!this.exists || !this.parent.exists)
    {
        this.renderOrderID = -1;
        return false;
    }

    console.log(this.world.y, this.worldTransform.ty);
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
    * @property {Phaser.Game} game - A reference to the currently running Game.
    */
    game: null,

    /**
    * @property {string} name - The user defined name given to this Sprite.
    * @default
    */
    name: '',

    /**
    * @property {object} components - The components this GameObject has.
    * @protected
    */
    components: {},

    /**
    * @property {number} z - The z-depth value of this object within its Group (remember the World is a Group as well). No two objects in a Group can have the same z value.
    */
    z: 0,

    /**
    * @property {Phaser.Events} events - The Events you can subscribe to that are dispatched when certain things happen on this Sprite or its components.
    */
    events: undefined,

    /**
    * @property {Phaser.AnimationManager} animations - This manages animations of the sprite. You can modify animations through it (see Phaser.AnimationManager)
    */
    animations: undefined,

    /**
    *  @property {string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture} key - This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture, BitmapData or PIXI.Texture.
    */
    key: '',

    /**
    * @property {Phaser.Point} world - The world coordinates of this Sprite. This differs from the x/y coordinates which are relative to the Sprites container.
    */
    world: null,

    /**
    * @property {boolean} debug - Handy flag to use with Game.enableStep
    * @default
    */
    debug: false,

    /**
    * @property {Phaser.Point} previousPosition - The position the Sprite was in at the last update.
    * @readOnly
    */
    previousPosition: null,

    /**
    * @property {number} previousRotation - The rotation angle the Sprite was in at the last update (in radians)
    * @readOnly
    */
    previousRotation: 0,

    /**
    * @property {number} renderOrderID - The render order ID. This is used internally by the renderer and input manager and should not be modified.
    * @readOnly
    */
    renderOrderID: 0,

    /**
    * @property {boolean} fresh - A fresh Sprite is one that has just been created or reset and is yet to receive a world level transform update.
    * @readOnly
    */
    fresh: true,

    /**
    * @property {Phaser.Rectangle} _bounds - Internal cache var.
    * @private
    */
    _bounds: null,

    /**
    * @property {boolean} _exists - Internal cache var.
    * @private
    */
    _exists: false,

    /**
    * Override and use this function in your own custom objects to handle any update requirements you may have.
    * Remember if this Sprite has any children you should call update on them too.
    *
    * @method Phaser.Sprite#update
    * @memberof Phaser.Sprite
    */
    update: function() {

    },

    /**
    * Internal function called by the World postUpdate cycle.
    *
    * @method Phaser.Sprite#postUpdate
    * @memberof Phaser.Sprite
    */
    postUpdate: function() {

        if (this.key instanceof Phaser.BitmapData)
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

    },

    /**
    * Sprite.exists controls if the core game loop and physics update this Sprite or not.
    * When you set Sprite.exists to false it will remove its Body from the physics world (if it has one) and also set Sprite.visible to false.
    * Setting Sprite.exists to true will re-add the Body to the physics world (if it has a body) and set Sprite.visible to true.
    *
    * @name Phaser.Sprite#exists
    * @property {boolean} exists - If the Sprite is processed by the core game update and physics.
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

    }

};
