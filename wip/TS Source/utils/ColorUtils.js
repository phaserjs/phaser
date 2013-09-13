/// <reference path="../_definitions.ts" />
/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
* @module       Phaser
*/
var Phaser;
(function (Phaser) {
    /**
    * A collection of methods useful for manipulating and comparing colors.
    *
    * @class ColorUtils
    */
    var ColorUtils = (function () {
        function ColorUtils() { }
        ColorUtils.getColor32 = /**
        * Given an alpha and 3 color values this will return an integer representation of it
        *
        * @method getColor32
        * @param {Number} alpha The Alpha value (between 0 and 255)
        * @param {Number} red The Red channel value (between 0 and 255)
        * @param {Number} green The Green channel value (between 0 and 255)
        * @param {Number} blue The Blue channel value (between 0 and 255)
        * @return {Number} A native color value integer (format: 0xAARRGGBB)
        */
        function getColor32(alpha, red, green, blue) {
            return alpha << 24 | red << 16 | green << 8 | blue;
        };
        ColorUtils.getColor = /**
        * Given 3 color values this will return an integer representation of it.
        *
        * @method getColor
        * @param {Number} red The Red channel value (between 0 and 255)
        * @param {Number} green The Green channel value (between 0 and 255)
        * @param {Number} blue The Blue channel value (between 0 and 255)
        * @return {Number} A native color value integer (format: 0xRRGGBB)
        */
        function getColor(red, green, blue) {
            return red << 16 | green << 8 | blue;
        };
        ColorUtils.getHSVColorWheel = /**
        * Get HSV color wheel values in an array which will be 360 elements in size.
        *
        * @method getHSVColorWheel
        * @param {Number} alpha	Alpha value for each color of the color wheel, between 0 (transparent) and 255 (opaque)
        * @return {Array} An array containing 360 elements corresponding to the HSV color wheel.
        */
        function getHSVColorWheel(alpha) {
            if (typeof alpha === "undefined") { alpha = 255; }
            var colors = [];
            for(var c = 0; c <= 359; c++) {
                colors[c] = Phaser.ColorUtils.getWebRGB(Phaser.ColorUtils.HSVtoRGB(c, 1.0, 1.0, alpha));
            }
            return colors;
        };
        ColorUtils.hexToRGB = /**
        * Converts the given hex string into an object containing the RGB values.
        *
        * @method hexToRGB
        * @param {String} The string hex color to convert.
        * @return {Object} An object with 3 properties: r,g and b.
        */
        function hexToRGB(h) {
            var hex16 = (h.charAt(0) == "#") ? h.substring(1, 7) : h;
            var r = parseInt(hex16.substring(0, 2), 16);
            var g = parseInt(hex16.substring(2, 4), 16);
            var b = parseInt(hex16.substring(4, 6), 16);
            return {
                r: r,
                g: g,
                b: b
            };
        };
        ColorUtils.getComplementHarmony = /**
        * Returns a Complementary Color Harmony for the given color.
        * <p>A complementary hue is one directly opposite the color given on the color wheel</p>
        * <p>Value returned in 0xAARRGGBB format with Alpha set to 255.</p>
        *
        * @method getComplementHarmony
        * @param {Number} color The color to base the harmony on.
        * @return {Number} 0xAARRGGBB format color value.
        */
        function getComplementHarmony(color) {
            var hsv = Phaser.ColorUtils.RGBtoHSV(color);
            var opposite = Phaser.ColorUtils.game.math.wrapValue(hsv.hue, 180, 359);
            return Phaser.ColorUtils.HSVtoRGB(opposite, 1.0, 1.0);
        };
        ColorUtils.getAnalogousHarmony = /**
        * Returns an Analogous Color Harmony for the given color.
        * <p>An Analogous harmony are hues adjacent to each other on the color wheel</p>
        * <p>Values returned in 0xAARRGGBB format with Alpha set to 255.</p>
        *
        * @method getAnalogousHarmony
        * @param {Number} color The color to base the harmony on.
        * @param {Number} threshold Control how adjacent the colors will be (default +- 30 degrees)
        * @return {Object} Object containing 3 properties: color1 (the original color), color2 (the warmer analogous color) and color3 (the colder analogous color)
        */
        function getAnalogousHarmony(color, threshold) {
            if (typeof threshold === "undefined") { threshold = 30; }
            var hsv = Phaser.ColorUtils.RGBtoHSV(color);
            if(threshold > 359 || threshold < 0) {
                throw Error("Color Warning: Invalid threshold given to getAnalogousHarmony()");
            }
            var warmer = Phaser.ColorUtils.game.math.wrapValue(hsv.hue, 359 - threshold, 359);
            var colder = Phaser.ColorUtils.game.math.wrapValue(hsv.hue, threshold, 359);
            return {
                color1: color,
                color2: Phaser.ColorUtils.HSVtoRGB(warmer, 1.0, 1.0),
                color3: Phaser.ColorUtils.HSVtoRGB(colder, 1.0, 1.0),
                hue1: hsv.hue,
                hue2: warmer,
                hue3: colder
            };
        };
        ColorUtils.getSplitComplementHarmony = /**
        * Returns an Split Complement Color Harmony for the given color.
        * <p>A Split Complement harmony are the two hues on either side of the color's Complement</p>
        * <p>Values returned in 0xAARRGGBB format with Alpha set to 255.</p>
        *
        * @method getSplitComplementHarmony
        * @param {Number} color The color to base the harmony on
        * @param {Number} threshold Control how adjacent the colors will be to the Complement (default +- 30 degrees)
        * @return {Object} An object containing 3 properties: color1 (the original color), color2 (the warmer analogous color) and color3 (the colder analogous color)
        */
        function getSplitComplementHarmony(color, threshold) {
            if (typeof threshold === "undefined") { threshold = 30; }
            var hsv = Phaser.ColorUtils.RGBtoHSV(color);
            if(threshold >= 359 || threshold <= 0) {
                throw Error("Phaser.ColorUtils Warning: Invalid threshold given to getSplitComplementHarmony()");
            }
            var opposite = Phaser.ColorUtils.game.math.wrapValue(hsv.hue, 180, 359);
            var warmer = Phaser.ColorUtils.game.math.wrapValue(hsv.hue, opposite - threshold, 359);
            var colder = Phaser.ColorUtils.game.math.wrapValue(hsv.hue, opposite + threshold, 359);
            return {
                color1: color,
                color2: Phaser.ColorUtils.HSVtoRGB(warmer, hsv.saturation, hsv.value),
                color3: Phaser.ColorUtils.HSVtoRGB(colder, hsv.saturation, hsv.value),
                hue1: hsv.hue,
                hue2: warmer,
                hue3: colder
            };
        };
        ColorUtils.getTriadicHarmony = /**
        * Returns a Triadic Color Harmony for the given color.
        * <p>A Triadic harmony are 3 hues equidistant from each other on the color wheel</p>
        * <p>Values returned in 0xAARRGGBB format with Alpha set to 255.</p>
        *
        * @method getTriadicHarmony
        * @param {Number} color The color to base the harmony on.
        * @return {Object} An Object containing 3 properties: color1 (the original color), color2 and color3 (the equidistant colors)
        */
        function getTriadicHarmony(color) {
            var hsv = Phaser.ColorUtils.RGBtoHSV(color);
            var triadic1 = Phaser.ColorUtils.game.math.wrapValue(hsv.hue, 120, 359);
            var triadic2 = Phaser.ColorUtils.game.math.wrapValue(triadic1, 120, 359);
            return {
                color1: color,
                color2: Phaser.ColorUtils.HSVtoRGB(triadic1, 1.0, 1.0),
                color3: Phaser.ColorUtils.HSVtoRGB(triadic2, 1.0, 1.0)
            };
        };
        ColorUtils.getColorInfo = /**
        * Returns a string containing handy information about the given color including string hex value,
        * RGB format information and HSL information. Each section starts on a newline, 3 lines in total.
        *
        * @method getColorInfo
        * @param {Number} color A color value in the format 0xAARRGGBB
        * @return {String} string containing the 3 lines of information
        */
        function getColorInfo(color) {
            var argb = Phaser.ColorUtils.getRGB(color);
            var hsl = Phaser.ColorUtils.RGBtoHSV(color);
            //	Hex format
            var result = Phaser.ColorUtils.RGBtoHexstring(color) + "\n";
            //	RGB format
            result = result.concat("Alpha: " + argb.alpha + " Red: " + argb.red + " Green: " + argb.green + " Blue: " + argb.blue) + "\n";
            //	HSL info
            result = result.concat("Hue: " + hsl.hue + " Saturation: " + hsl.saturation + " Lightnes: " + hsl.lightness);
            return result;
        };
        ColorUtils.RGBtoHexstring = /**
        * Return a string representation of the color in the format 0xAARRGGBB
        *
        * @method RGBtoHexstring
        * @param {Number} color The color to get the string representation for
        * @return {String A string of length 10 characters in the format 0xAARRGGBB
        */
        function RGBtoHexstring(color) {
            var argb = Phaser.ColorUtils.getRGB(color);
            return "0x" + Phaser.ColorUtils.colorToHexstring(argb.alpha) + Phaser.ColorUtils.colorToHexstring(argb.red) + Phaser.ColorUtils.colorToHexstring(argb.green) + Phaser.ColorUtils.colorToHexstring(argb.blue);
        };
        ColorUtils.RGBtoWebstring = /**
        * Return a string representation of the color in the format #RRGGBB
        *
        * @method RGBtoWebstring
        * @param {Number} color The color to get the string representation for
        * @return {String} A string of length 10 characters in the format 0xAARRGGBB
        */
        function RGBtoWebstring(color) {
            var argb = Phaser.ColorUtils.getRGB(color);
            return "#" + Phaser.ColorUtils.colorToHexstring(argb.red) + Phaser.ColorUtils.colorToHexstring(argb.green) + Phaser.ColorUtils.colorToHexstring(argb.blue);
        };
        ColorUtils.colorToHexstring = /**
        * Return a string containing a hex representation of the given color
        *
        * @method colorToHexstring
        * @param {Number} color The color channel to get the hex value for, must be a value between 0 and 255)
        * @return {String} A string of length 2 characters, i.e. 255 = FF, 0 = 00
        */
        function colorToHexstring(color) {
            var digits = "0123456789ABCDEF";
            var lsd = color % 16;
            var msd = (color - lsd) / 16;
            var hexified = digits.charAt(msd) + digits.charAt(lsd);
            return hexified;
        };
        ColorUtils.HSVtoRGB = /**
        * Convert a HSV (hue, saturation, lightness) color space value to an RGB color
        *
        * @method HSVtoRGB
        * @param {Number} h Hue degree, between 0 and 359
        * @param {Number} s Saturation, between 0.0 (grey) and 1.0
        * @param {Number} v Value, between 0.0 (black) and 1.0
        * @param {Number} alpha Alpha value to set per color (between 0 and 255)
        * @return {Number} 32-bit ARGB color value (0xAARRGGBB)
        */
        function HSVtoRGB(h, s, v, alpha) {
            if (typeof alpha === "undefined") { alpha = 255; }
            var result;
            if(s == 0.0) {
                result = Phaser.ColorUtils.getColor32(alpha, v * 255, v * 255, v * 255);
            } else {
                h = h / 60.0;
                var f = h - Math.floor(h);
                var p = v * (1.0 - s);
                var q = v * (1.0 - s * f);
                var t = v * (1.0 - s * (1.0 - f));
                switch(Math.floor(h)) {
                    case 0:
                        result = Phaser.ColorUtils.getColor32(alpha, v * 255, t * 255, p * 255);
                        break;
                    case 1:
                        result = Phaser.ColorUtils.getColor32(alpha, q * 255, v * 255, p * 255);
                        break;
                    case 2:
                        result = Phaser.ColorUtils.getColor32(alpha, p * 255, v * 255, t * 255);
                        break;
                    case 3:
                        result = Phaser.ColorUtils.getColor32(alpha, p * 255, q * 255, v * 255);
                        break;
                    case 4:
                        result = Phaser.ColorUtils.getColor32(alpha, t * 255, p * 255, v * 255);
                        break;
                    case 5:
                        result = Phaser.ColorUtils.getColor32(alpha, v * 255, p * 255, q * 255);
                        break;
                    default:
                        throw new Error("Phaser.ColorUtils.HSVtoRGB : Unknown color");
                }
            }
            return result;
        };
        ColorUtils.RGBtoHSV = /**
        * Convert an RGB color value to an object containing the HSV color space values: Hue, Saturation and Lightness
        *
        * @method RGBtoHSV
        * @param {Number} color In format 0xRRGGBB
        * @return {Object} An Object with the properties hue (from 0 to 360), saturation (from 0 to 1.0) and lightness (from 0 to 1.0, also available under .value)
        */
        function RGBtoHSV(color) {
            var rgb = Phaser.ColorUtils.getRGB(color);
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
            if(delta == 0) {
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
            //	Keep the value with 0 to 359
            hue *= 360;
            hue = Math.round(hue);
            return {
                hue: hue,
                saturation: saturation,
                lightness: lightness,
                value: lightness
            };
        };
        ColorUtils.interpolateColor = /**
        * Interpolates the two given colours based on the supplied step and currentStep properties.
        * @method interpolateColor
        * @param {Number} color1
        * @param {Number} color2
        * @param {Number} steps
        * @param {Number} currentStep
        * @param {Number} alpha
        * @return {Number} The interpolated color value.
        */
        function interpolateColor(color1, color2, steps, currentStep, alpha) {
            if (typeof alpha === "undefined") { alpha = 255; }
            var src1 = Phaser.ColorUtils.getRGB(color1);
            var src2 = Phaser.ColorUtils.getRGB(color2);
            var r = (((src2.red - src1.red) * currentStep) / steps) + src1.red;
            var g = (((src2.green - src1.green) * currentStep) / steps) + src1.green;
            var b = (((src2.blue - src1.blue) * currentStep) / steps) + src1.blue;
            return Phaser.ColorUtils.getColor32(alpha, r, g, b);
        };
        ColorUtils.interpolateColorWithRGB = /**
        * Interpolates the two given colours based on the supplied step and currentStep properties.
        * @method interpolateColorWithRGB
        * @param {Number} color
        * @param {Number} r
        * @param {Number} g
        * @param {Number} b
        * @param {Number} steps
        * @param {Number} currentStep
        * @return {Number} The interpolated color value.
        */
        function interpolateColorWithRGB(color, r, g, b, steps, currentStep) {
            var src = Phaser.ColorUtils.getRGB(color);
            var or = (((r - src.red) * currentStep) / steps) + src.red;
            var og = (((g - src.green) * currentStep) / steps) + src.green;
            var ob = (((b - src.blue) * currentStep) / steps) + src.blue;
            return Phaser.ColorUtils.getColor(or, og, ob);
        };
        ColorUtils.interpolateRGB = /**
        * Interpolates the two given colours based on the supplied step and currentStep properties.
        * @method interpolateRGB
        * @param {Number} r1
        * @param {Number} g1
        * @param {Number} b1
        * @param {Number} r2
        * @param {Number} g2
        * @param {Number} b2
        * @param {Number} steps
        * @param {Number} currentStep
        * @return {Number} The interpolated color value.
        */
        function interpolateRGB(r1, g1, b1, r2, g2, b2, steps, currentStep) {
            var r = (((r2 - r1) * currentStep) / steps) + r1;
            var g = (((g2 - g1) * currentStep) / steps) + g1;
            var b = (((b2 - b1) * currentStep) / steps) + b1;
            return Phaser.ColorUtils.getColor(r, g, b);
        };
        ColorUtils.getRandomColor = /**
        * Returns a random color value between black and white
        * <p>Set the min value to start each channel from the given offset.</p>
        * <p>Set the max value to restrict the maximum color used per channel</p>
        *
        * @method getRandomColor
        * @param {Number} min The lowest value to use for the color
        * @param {Number} max The highest value to use for the color
        * @param {Number} alpha The alpha value of the returning color (default 255 = fully opaque)
        * @return {Number} 32-bit color value with alpha
        */
        function getRandomColor(min, max, alpha) {
            if (typeof min === "undefined") { min = 0; }
            if (typeof max === "undefined") { max = 255; }
            if (typeof alpha === "undefined") { alpha = 255; }
            //	Sanity checks
            if(max > 255) {
                return Phaser.ColorUtils.getColor(255, 255, 255);
            }
            if(min > max) {
                return Phaser.ColorUtils.getColor(255, 255, 255);
            }
            var red = min + Math.round(Math.random() * (max - min));
            var green = min + Math.round(Math.random() * (max - min));
            var blue = min + Math.round(Math.random() * (max - min));
            return Phaser.ColorUtils.getColor32(alpha, red, green, blue);
        };
        ColorUtils.getRGB = /**
        * Return the component parts of a color as an Object with the properties alpha, red, green, blue
        *
        * <p>Alpha will only be set if it exist in the given color (0xAARRGGBB)</p>
        *
        * @method getRGB
        * @param {Number} color in RGB (0xRRGGBB) or ARGB format (0xAARRGGBB)
        * @return {Object} An Object with properties: alpha, red, green, blue
        */
        function getRGB(color) {
            return {
                alpha: color >>> 24,
                red: color >> 16 & 0xFF,
                green: color >> 8 & 0xFF,
                blue: color & 0xFF
            };
        };
        ColorUtils.getWebRGB = /**
        * Returns a CSS friendly string value from the given color.
        * @method getWebRGB
        * @param {Number} color
        * @return {String} A string in the format: 'rgba(r,g,b,a)'
        */
        function getWebRGB(color) {
            var alpha = (color >>> 24) / 255;
            var red = color >> 16 & 0xFF;
            var green = color >> 8 & 0xFF;
            var blue = color & 0xFF;
            return 'rgba(' + red.toString() + ',' + green.toString() + ',' + blue.toString() + ',' + alpha.toString() + ')';
        };
        ColorUtils.getAlpha = /**
        * Given a native color value (in the format 0xAARRGGBB) this will return the Alpha component, as a value between 0 and 255
        *
        * @method getAlpha
        * @param {Number} color In the format 0xAARRGGBB
        * @return {Number} The Alpha component of the color, will be between 0 and 1 (0 being no Alpha (opaque), 1 full Alpha (transparent))
        */
        function getAlpha(color) {
            return color >>> 24;
        };
        ColorUtils.getAlphaFloat = /**
        * Given a native color value (in the format 0xAARRGGBB) this will return the Alpha component as a value between 0 and 1
        *
        * @method getAlphaFloat
        * @param {Number} color In the format 0xAARRGGBB
        * @return {Number} The Alpha component of the color, will be between 0 and 1 (0 being no Alpha (opaque), 1 full Alpha (transparent))
        */
        function getAlphaFloat(color) {
            return (color >>> 24) / 255;
        };
        ColorUtils.getRed = /**
        * Given a native color value (in the format 0xAARRGGBB) this will return the Red component, as a value between 0 and 255
        *
        * @method getRed
        * @param {Number} color In the format 0xAARRGGBB
        * @return {Number} The Red component of the color, will be between 0 and 255 (0 being no color, 255 full Red)
        */
        function getRed(color) {
            return color >> 16 & 0xFF;
        };
        ColorUtils.getGreen = /**
        * Given a native color value (in the format 0xAARRGGBB) this will return the Green component, as a value between 0 and 255
        *
        * @method getGreen
        * @param {Number} color In the format 0xAARRGGBB
        * @return {Number} The Green component of the color, will be between 0 and 255 (0 being no color, 255 full Green)
        */
        function getGreen(color) {
            return color >> 8 & 0xFF;
        };
        ColorUtils.getBlue = /**
        * Given a native color value (in the format 0xAARRGGBB) this will return the Blue component, as a value between 0 and 255
        *
        * @method getBlue
        * @param {Number} color In the format 0xAARRGGBB
        * @return {Number} The Blue component of the color, will be between 0 and 255 (0 being no color, 255 full Blue)
        */
        function getBlue(color) {
            return color & 0xFF;
        };
        return ColorUtils;
    })();
    Phaser.ColorUtils = ColorUtils;    
})(Phaser || (Phaser = {}));
