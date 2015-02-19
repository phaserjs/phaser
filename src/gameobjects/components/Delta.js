Phaser.Component.Delta = function () {};

Phaser.Component.Delta.prototype = {

    /**
    * Returns the delta x value. The difference between world.x now and in the previous step.
    *
    * @name Phaser.Sprite#deltaX
    * @property {number} deltaX - The delta value. Positive if the motion was to the right, negative if to the left.
    * @readonly
    */
    deltaX: {

        get: function() {

            return this.world.x - this.previousPosition.x;

        }

    },

    /**
    * Returns the delta y value. The difference between world.y now and in the previous step.
    *
    * @name Phaser.Sprite#deltaY
    * @property {number} deltaY - The delta value. Positive if the motion was downwards, negative if upwards.
    * @readonly
    */
    deltaY: {

        get: function() {

            return this.world.y - this.previousPosition.y;

        }

    },

    /**
    * Returns the delta z value. The difference between rotation now and in the previous step.
    *
    * @name Phaser.Sprite#deltaZ
    * @property {number} deltaZ - The delta value.
    * @readonly
    */
    deltaZ: {

        get: function() {

            return this.rotation - this.previousRotation;

        }

    }

};
