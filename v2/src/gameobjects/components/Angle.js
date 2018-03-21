/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Angle Component provides access to an `angle` property; the rotation of a Game Object in degrees.
*
* @class
*/
Phaser.Component.Angle = function () {};

Phaser.Component.Angle.prototype = {

    /**
    * The angle property is the rotation of the Game Object in *degrees* from its original orientation.
    * 
    * Values from 0 to 180 represent clockwise rotation; values from 0 to -180 represent counterclockwise rotation.
    * 
    * Values outside this range are added to or subtracted from 360 to obtain a value within the range. 
    * For example, the statement player.angle = 450 is the same as player.angle = 90.
    * 
    * If you wish to work in radians instead of degrees you can use the property `rotation` instead. 
    * Working in radians is slightly faster as it doesn't have to perform any calculations.
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

    }

};
