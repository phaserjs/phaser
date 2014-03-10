/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

Phaser.Physics.Box2D.Utils = {
    /**
    * Convert p2 physics value (meters) to pixel scale.
    * 
    * @method Phaser.Physics.P2.Body#p2px
    * @param {number} v - The value to convert.
    * @return {number} The scaled value.
    */
    b2px: function (v) {

        return v *= 30;

    },

    /**
    * Convert pixel value to p2 physics scale (meters).
    * 
    * @method Phaser.Physics.P2.Body#px2p
    * @param {number} v - The value to convert.
    * @return {number} The scaled value.
    */
    px2b: function (v) {

        return v * 0.0333;

    },

    /**
    * Convert p2 physics value (meters) to pixel scale and inverses it.
    * 
    * @method Phaser.Physics.P2.Body#p2pxi
    * @param {number} v - The value to convert.
    * @return {number} The scaled value.
    */
    b2pxi: function (v) {

        return v *= -30;

    },

    /**
    * Convert pixel value to p2 physics scale (meters) and inverses it.
    * 
    * @method Phaser.Physics.P2.Body#px2pi
    * @param {number} v - The value to convert.
    * @return {number} The scaled value.
    */
    px2bi: function (v) {

        return v * -0.0333;

    },
    
    rgbToHex: function(r, g, b) {
        return this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    },

    /**
    * Component to hex conversion.
    *
    * @method Phaser.Physics.P2.BodyDebug#componentToHex
    */
    componentToHex: function(c) {

        var hex;
        hex = c.toString(16);

        if (hex.len === 2)
        {
            return hex;
        }
        else
        {
            return hex + '0';
        }

    }
}