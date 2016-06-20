/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Health component provides the ability for Game Objects to have a `health` property 
* that can be damaged and reset through game code.
* Requires the LifeSpan component.
*
* @class
*/
Phaser.Component.Health = function () {};

Phaser.Component.Health.prototype = {

    /**
    * The Game Objects health value. This is a handy property for setting and manipulating health on a Game Object.
    * 
    * It can be used in combination with the `damage` method or modified directly.
    * 
    * @property {number} health
    * @default
    */
    health: 1,

    /**
    * The Game Objects maximum health value. This works in combination with the `heal` method to ensure
    * the health value never exceeds the maximum.
    * 
    * @property {number} maxHealth
    * @default
    */
    maxHealth: 100,

    /**
    * Damages the Game Object. This removes the given amount of health from the `health` property.
    * 
    * If health is taken below or is equal to zero then the `kill` method is called.
    *
    * @member
    * @param {number} amount - The amount to subtract from the current `health` value.
    * @return {Phaser.Sprite} This instance.
    */
    damage: function (amount) {

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
    * Sets the health property of the Game Object to the given amount.
    * Will never exceed the `maxHealth` value.
    *
    * @member
    * @param {number} amount - The amount to set the `health` value to. The total will never exceed `maxHealth`.
    * @return {Phaser.Sprite} This instance.
    */
    setHealth: function (amount) {

        this.health = amount;

        if (this.health > this.maxHealth)
        {
            this.health = this.maxHealth;
        }

        return this;

    },

    /**
    * Heal the Game Object. This adds the given amount of health to the `health` property.
    *
    * @member
    * @param {number} amount - The amount to add to the current `health` value. The total will never exceed `maxHealth`.
    * @return {Phaser.Sprite} This instance.
    */
    heal: function (amount) {

        if (this.alive)
        {
            this.health += amount;

            if (this.health > this.maxHealth)
            {
                this.health = this.maxHealth;
            }
        }

        return this;

    }

};
