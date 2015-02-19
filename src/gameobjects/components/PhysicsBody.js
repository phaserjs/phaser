Phaser.Component.PhysicsBody = function () {};

Phaser.Component.PhysicsBody.preUpdate = function () {

    if (this.fresh && this.exists)
    {
        this.world.setTo(this.parent.position.x + this.position.x, this.parent.position.y + this.position.y);
        this.worldTransform.tx = this.world.x;
        this.worldTransform.ty = this.world.y;

        this.previousPosition.set(this.world.x, this.world.y);
        this.previousRotation = this.rotation;

        if (this.body)
        {
            this.body.preUpdate();
        }

        this.fresh = false;

        return false;
    }

    this.previousPosition.set(this.world.x, this.world.y);
    this.previousRotation = this.rotation;

    if (!this._exists || !this.parent.exists)
    {
        this.renderOrderID = -1;
        return false;
    }

};

Phaser.Component.PhysicsBody.postUpdate = function () {

    if (this.exists && this.body)
    {
        this.body.postUpdate();
    }

};

Phaser.Component.PhysicsBody.prototype = {

    /**
    * By default Sprites won't add themselves to any physics system and their physics body will be `null`.
    * To enable them for physics you need to call `game.physics.enable(sprite, system)` where `sprite` is this object
    * and `system` is the Physics system you want to use to manage this body. Once enabled you can access all physics related properties via `Sprite.body`.
    *
    * Important: Enabling a Sprite for P2 or Ninja physics will automatically set `Sprite.anchor` to 0.5 so the physics body is centered on the Sprite.
    * If you need a different result then adjust or re-create the Body shape offsets manually, and/or reset the anchor after enabling physics.
    *
    * @property {Phaser.Physics.Arcade.Body|Phaser.Physics.P2.Body|Phaser.Physics.Ninja.Body|null} body
    * @default
    */
    body: null,

    /**
    * @property {boolean} _exists - Internal cache var.
    * @private
    */
    _exists: false,

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
                //  exists = true
                this._exists = true;

                if (this.body && this.body.type === Phaser.Physics.P2JS)
                {
                    this.body.addToWorld();
                }

                this.visible = true;
            }
            else
            {
                //  exists = false
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
    * The position of the Sprite on the x axis relative to the local coordinates of the parent.
    *
    * @name Phaser.Sprite#x
    * @property {number} x - The position of the Sprite on the x axis relative to the local coordinates of the parent.
    */
    x: {

        get: function () {

            return this.position.x;

        },

        set: function (value) {

            this.position.x = value;

            if (this.body && !this.body.dirty)
            {
                this.body._reset = true;
            }

        }

    },

    /**
    * The position of the Sprite on the y axis relative to the local coordinates of the parent.
    *
    * @name Phaser.Sprite#y
    * @property {number} y - The position of the Sprite on the y axis relative to the local coordinates of the parent.
    */
    y: {

        get: function () {

            return this.position.y;

        },

        set: function (value) {

            this.position.y = value;

            if (this.body && !this.body.dirty)
            {
                this.body._reset = true;
            }

        }

    }

};
