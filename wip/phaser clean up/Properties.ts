/**
* Phaser - Components - Properties
*
* 
*/

module Phaser.Components {

    export class Properties {

        /**
         * Handy for storing health percentage or armor points or whatever.
         * @type {number}
         */
        public health: number;

        /**
        * Reduces the "health" variable of this sprite by the amount specified in Damage.
        * Calls kill() if health drops to or below zero.
        *
        * @param Damage {number} How much health to take away (use a negative number to give a health bonus).
        */
        public hurt(damage: number) {

            this.health = this.health - damage;

            if (this.health <= 0)
            {
                //this.kill();
            }

        }

    }

}