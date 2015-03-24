/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2015 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Delta component provides access to delta values between the Game Objects current and previous position.
*
* @class
*/
Phaser.Component.Delta = function () {};

Phaser.Component.Delta.prototype = {

    /**
    * Returns the delta x value. The difference between world.x now and in the previous frame.
    * 
    * The value will be positive if the Game Object has moved to the right or negative if to the left.
    *
    * @property {number} deltaX
    * @readonly
    */
    deltaX: {

        get: function() {

            return this.world.x - this.previousPosition.x;

        }

    },

    /**
    * Returns the delta y value. The difference between world.y now and in the previous frame.
    * 
    * The value will be positive if the Game Object has moved down or negative if up.
    *
    * @property {number} deltaY
    * @readonly
    */
    deltaY: {

        get: function() {

            return this.world.y - this.previousPosition.y;

        }

    },

    /**
    * Returns the delta z value. The difference between rotation now and in the previous frame.
    *
    * @property {number} deltaZ - The delta value.
    * @readonly
    */
    deltaZ: {

        get: function() {

            return this.rotation - this.previousRotation;

        }

    }

};
