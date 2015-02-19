Phaser.Component.Angle = function () {};

Phaser.Component.Angle.prototype = {

    /**
    * Indicates the rotation of the Sprite, in degrees, from its original orientation. Values from 0 to 180 represent clockwise rotation; values from 0 to -180 represent counterclockwise rotation.
    * Values outside this range are added to or subtracted from 360 to obtain a value within the range. For example, the statement player.angle = 450 is the same as player.angle = 90.
    * If you wish to work in radians instead of degrees use the property Sprite.rotation instead. Working in radians is also a little faster as it doesn't have to convert the angle.
    *
    * @name Phaser.Sprite#angle
    * @property {number} angle - The angle of this Sprite in degrees.
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
