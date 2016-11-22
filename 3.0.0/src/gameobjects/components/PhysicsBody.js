/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The PhysicsBody component manages the Game Objects physics body and physics enabling.
* It also overrides the x and y properties, ensuring that any manual adjustment of them is reflected in the physics body itself.
*
* @class
*/
Phaser.Component.PhysicsBody = function () {};

/**
 * The PhysicsBody component preUpdate handler.
 * Called automatically by the Game Object.
 *
 * @method
 */
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

    return true;

};

/**
 * The PhysicsBody component postUpdate handler.
 * Called automatically by the Game Object.
 *
 * @method
 */
Phaser.Component.PhysicsBody.postUpdate = function () {

    if (this.exists && this.body)
    {
        this.body.postUpdate();
    }

};

Phaser.Component.PhysicsBody.prototype = {

    /**
    * `body` is the Game Objects physics body. Once a Game Object is enabled for physics you access all associated 
    * properties and methods via it.
    * 
    * By default Game Objects won't add themselves to any physics system and their `body` property will be `null`.
    * 
    * To enable this Game Object for physics you need to call `game.physics.enable(object, system)` where `object` is this object
    * and `system` is the Physics system you are using. If none is given it defaults to `Phaser.Physics.Arcade`.
    * 
    * You can alternatively call `game.physics.arcade.enable(object)`, or add this Game Object to a physics enabled Group.
    *
    * Important: Enabling a Game Object for P2 or Ninja physics will automatically set its `anchor` property to 0.5, 
    * so the physics body is centered on the Game Object.
    * 
    * If you need a different result then adjust or re-create the Body shape offsets manually or reset the anchor after enabling physics.
    *
    * @property {Phaser.Physics.Arcade.Body|Phaser.Physics.P2.Body|Phaser.Physics.Ninja.Body|null} body
    * @default
    */
    body: null,

    /**
    * The position of the Game Object on the x axis relative to the local coordinates of the parent.
    *
    * @property {number} x
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
    * The position of the Game Object on the y axis relative to the local coordinates of the parent.
    *
    * @property {number} y
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
