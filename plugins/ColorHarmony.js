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
    },

    /**
    * Get HSV color wheel values in an array which will be 360 elements in size.
    *
    * @method getHSVColorWheel
    * @param {Number} alpha    Alpha value for each color of the color wheel, between 0 (transparent) and 255 (opaque)
    * @return {Array} An array containing 360 elements corresponding to the HSV color wheel.
    */
    getHSVColorWheel: function (alpha) {

        alpha = alpha || 255;

        var colors = [];

        for (var c = 0; c <= 359; c++)
        {
            colors[c] = Phaser.Color.getWebRGB(Phaser.Color.HSVtoRGB(c, 1.0, 1.0, alpha));
        }

        return colors;
    },

    /**
    * Convert a HSV (hue, saturation, lightness) color space value to an RGB color
    *
    * @method HSVtoRGB
    * @param {Number} h Hue degree, between 0 and 359
    * @param {Number} s Saturation, between 0.0 (grey) and 1.0
    * @param {Number} v Value, between 0.0 (black) and 1.0
    * @param {Number} alpha Alpha value to set per color (between 0 and 255)
    * @return {Number} 32-bit ARGB color value (0xAARRGGBB)
    */
    HSVtoRGB: function (h, s, v, alpha) {
        if (typeof alpha === "undefined") { alpha = 255; }
        var result;
        if(s === 0.0) {
            result = Phaser.Color.getColor32(alpha, v * 255, v * 255, v * 255);
        } else {
            h = h / 60.0;
            var f = h - Math.floor(h);
            var p = v * (1.0 - s);
            var q = v * (1.0 - s * f);
            var t = v * (1.0 - s * (1.0 - f));
            switch(Math.floor(h)) {
                case 0:
                    result = Phaser.Color.getColor32(alpha, v * 255, t * 255, p * 255);
                    break;
                case 1:
                    result = Phaser.Color.getColor32(alpha, q * 255, v * 255, p * 255);
                    break;
                case 2:
                    result = Phaser.Color.getColor32(alpha, p * 255, v * 255, t * 255);
                    break;
                case 3:
                    result = Phaser.Color.getColor32(alpha, p * 255, q * 255, v * 255);
                    break;
                case 4:
                    result = Phaser.Color.getColor32(alpha, t * 255, p * 255, v * 255);
                    break;
                case 5:
                    result = Phaser.Color.getColor32(alpha, v * 255, p * 255, q * 255);
                    break;
                default:
                    throw new Error("Phaser.Color.HSVtoRGB : Unknown color");
            }
        }
        return result;
    },

    /**
    * Convert an RGB color value to an object containing the HSV color space values: Hue, Saturation and Lightness
    *
    * @method RGBtoHSV
    * @param {Number} color In format 0xRRGGBB
    * @return {Object} An Object with the properties hue (from 0 to 360), saturation (from 0 to 1.0) and lightness (from 0 to 1.0, also available under .value)
    */
    RGBtoHSV: function (color) {
        var rgb = Phaser.Color.getRGB(color);
        var red = rgb.red / 255;
        var green = rgb.green / 255;
        var blue = rgb.blue / 255;
        var min = Math.min(red, green, blue);
        var max = Math.max(red, green, blue);
        var delta = max - min;
        var lightness = (max + min) / 2;
        var hue;
        var saturation;
        //  Grey color, no chroma
        if(delta === 0) {
            hue = 0;
            saturation = 0;
        } else {
            if(lightness < 0.5) {
                saturation = delta / (max + min);
            } else {
                saturation = delta / (2 - max - min);
            }
            var delta_r = (((max - red) / 6) + (delta / 2)) / delta;
            var delta_g = (((max - green) / 6) + (delta / 2)) / delta;
            var delta_b = (((max - blue) / 6) + (delta / 2)) / delta;
            if(red == max) {
                hue = delta_b - delta_g;
            } else if(green == max) {
                hue = (1 / 3) + delta_r - delta_b;
            } else if(blue == max) {
                hue = (2 / 3) + delta_g - delta_r;
            }
            if(hue < 0) {
                hue += 1;
            }
            if(hue > 1) {
                hue -= 1;
            }
        }
        //    Keep the value with 0 to 359
        hue *= 360;
        hue = Math.round(hue);
        return {
            hue: hue,
            saturation: saturation,
            lightness: lightness,
            value: lightness
        };
    }

};
