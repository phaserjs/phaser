/**
* Health Component Features.
*
* @class
*/
Phaser.Component.Health = function () {};

Phaser.Component.Health.prototype = {

    /**
    * @property {number} health - Health value. Used in combination with damage() to allow for quick killing of Sprites.
    */
    health: 1,

    /**
    * Damages the Sprite, this removes the given amount from the Sprites health property.
    * If health is then taken below or is equal to zero `Sprite.kill` is called.
    *
    * @member
    * @param {number} amount - The amount to subtract from the Sprite.health value.
    * @return (Phaser.Sprite) This instance.
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

    }

};
