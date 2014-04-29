/* jshint camelcase:false */
/**
* A collection of methods useful for manipulating and comparing colors.
*
* @class        ColorHarmony
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
* @module       Phaser
*/

Phaser.Plugins.ColorHarmony.prototype = {

    /**
    * Returns a Complementary Color Harmony for the given color.
    * <p>A complementary hue is one directly opposite the color given on the color wheel</p>
    * <p>Value returned in 0xAARRGGBB format with Alpha set to 255.</p>
    *
    * @method getComplementHarmony
    * @param {Number} color The color to base the harmony on.
    * @return {Number} 0xAARRGGBB format color value.
    */
    getComplementHarmony: function (color) {

        var hsv = Phaser.Color.RGBtoHSV(color);
        var opposite = Phaser.Color.game.math.wrapValue(hsv.hue, 180, 359);
        return Phaser.Color.HSVtoRGB(opposite, 1.0, 1.0);

    },

    /**
    * Returns an Analogous Color Harmony for the given color.
    * <p>An Analogous harmony are hues adjacent to each other on the color wheel</p>
    * <p>Values returned in 0xAARRGGBB format with Alpha set to 255.</p>
    *
    * @method getAnalogousHarmony
    * @param {Number} color The color to base the harmony on.
    * @param {Number} threshold Control how adjacent the colors will be (default +- 30 degrees)
    * @return {Object} Object containing 3 properties: color1 (the original color), color2 (the warmer analogous color) and color3 (the colder analogous color)
    */
    getAnalogousHarmony: function (color, threshold) {
        if (typeof threshold === "undefined") { threshold = 30; }
        var hsv = Phaser.Color.RGBtoHSV(color);
        if(threshold > 359 || threshold < 0) {
            throw new Error("Color Warning: Invalid threshold given to getAnalogousHarmony()");
        }
        var warmer = Phaser.Color.game.math.wrapValue(hsv.hue, 359 - threshold, 359);
        var colder = Phaser.Color.game.math.wrapValue(hsv.hue, threshold, 359);
        return {
            color1: color,
            color2: Phaser.Color.HSVtoRGB(warmer, 1.0, 1.0),
            color3: Phaser.Color.HSVtoRGB(colder, 1.0, 1.0),
            hue1: hsv.hue,
            hue2: warmer,
            hue3: colder
        };
    },

    /**
    * Returns an Split Complement Color Harmony for the given color.
    * <p>A Split Complement harmony are the two hues on either side of the color's Complement</p>
    * <p>Values returned in 0xAARRGGBB format with Alpha set to 255.</p>
    *
    * @method getSplitComplementHarmony
    * @param {Number} color The color to base the harmony on
    * @param {Number} threshold Control how adjacent the colors will be to the Complement (default +- 30 degrees)
    * @return {Object} An object containing 3 properties: color1 (the original color), color2 (the warmer analogous color) and color3 (the colder analogous color)
    */
    getSplitComplementHarmony: function (color, threshold) {
        if (typeof threshold === "undefined") { threshold = 30; }
        var hsv = Phaser.Color.RGBtoHSV(color);
        if(threshold >= 359 || threshold <= 0) {
            throw new Error("Phaser.Color Warning: Invalid threshold given to getSplitComplementHarmony()");
        }
        var opposite = Phaser.Color.game.math.wrapValue(hsv.hue, 180, 359);
        var warmer = Phaser.Color.game.math.wrapValue(hsv.hue, opposite - threshold, 359);
        var colder = Phaser.Color.game.math.wrapValue(hsv.hue, opposite + threshold, 359);
        return {
            color1: color,
            color2: Phaser.Color.HSVtoRGB(warmer, hsv.saturation, hsv.value),
            color3: Phaser.Color.HSVtoRGB(colder, hsv.saturation, hsv.value),
            hue1: hsv.hue,
            hue2: warmer,
            hue3: colder
        };
    },

    /**
    * Returns a Triadic Color Harmony for the given color.
    * <p>A Triadic harmony are 3 hues equidistant from each other on the color wheel</p>
    * <p>Values returned in 0xAARRGGBB format with Alpha set to 255.</p>
    *
    * @method getTriadicHarmony
    * @param {Number} color The color to base the harmony on.
    * @return {Object} An Object containing 3 properties: color1 (the original color), color2 and color3 (the equidistant colors)
    */
    getTriadicHarmony: function (color) {
        var hsv = Phaser.Color.RGBtoHSV(color);
        var triadic1 = Phaser.Color.game.math.wrapValue(hsv.hue, 120, 359);
        var triadic2 = Phaser.Color.game.math.wrapValue(triadic1, 120, 359);
        return {
            color1: color,
            color2: Phaser.Color.HSVtoRGB(triadic1, 1.0, 1.0),
            color3: Phaser.Color.HSVtoRGB(triadic2, 1.0, 1.0)
        };
    }

};
