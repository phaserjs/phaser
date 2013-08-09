/// <reference path="../_definitions.ts" />
/**
* Phaser - ColorUtils
*
* A collection of methods useful for manipulating color values.
*/
var Phaser;
(function (Phaser) {
    var ColorUtils = (function () {
        function ColorUtils() {
        }
        ColorUtils.getColor32 = /**
        * Given an alpha and 3 color values this will return an integer representation of it
        *
        * @param alpha {number} The Alpha value (between 0 and 255)
        * @param red   {number} The Red channel value (between 0 and 255)
        * @param green {number} The Green channel value (between 0 and 255)
        * @param blue  {number} The Blue channel value (between 0 and 255)
        *
        * @return  A native color value integer (format: 0xAARRGGBB)
        */
        function (alpha, red, green, blue) {
            return alpha << 24 | red << 16 | green << 8 | blue;
        };

        ColorUtils.getColor = /**
        * Given 3 color values this will return an integer representation of it
        *
        * @param red   {number} The Red channel value (between 0 and 255)
        * @param green {number} The Green channel value (between 0 and 255)
        * @param blue  {number} The Blue channel value (between 0 and 255)
        *
        * @return  A native color value integer (format: 0xRRGGBB)
        */
        function (red, green, blue) {
            return red << 16 | green << 8 | blue;
        };

        ColorUtils.getHSVColorWheel = /**
        * Get HSV color wheel values in an array which will be 360 elements in size
        *
        * @param	alpha	Alpha value for each color of the color wheel, between 0 (transparent) and 255 (opaque)
        *
        * @return	Array
        */
        function (alpha) {
            if (typeof alpha === "undefined") { alpha = 255; }
            var colors = [];

            for (var c = 0; c <= 359; c++) {
                colors[c] = Phaser.ColorUtils.getWebRGB(Phaser.ColorUtils.HSVtoRGB(c, 1.0, 1.0, alpha));
            }

            return colors;
        };

        ColorUtils.getComplementHarmony = /**
        * Returns a Complementary Color Harmony for the given color.
        * <p>A complementary hue is one directly opposite the color given on the color wheel</p>
        * <p>Value returned in 0xAARRGGBB format with Alpha set to 255.</p>
        *
        * @param	color The color to base the harmony on
        *
        * @return 0xAARRGGBB format color value
        */
        function (color) {
            var hsv = Phaser.ColorUtils.RGBtoHSV(color);

            var opposite = Phaser.ColorUtils.game.math.wrapValue(hsv.hue, 180, 359);

            return Phaser.ColorUtils.HSVtoRGB(opposite, 1.0, 1.0);
        };

        ColorUtils.getAnalogousHarmony = /**
        * Returns an Analogous Color Harmony for the given color.
        * <p>An Analogous harmony are hues adjacent to each other on the color wheel</p>
        * <p>Values returned in 0xAARRGGBB format with Alpha set to 255.</p>
        *
        * @param	color The color to base the harmony on
        * @param	threshold Control how adjacent the colors will be (default +- 30 degrees)
        *
        * @return 	Object containing 3 properties: color1 (the original color), color2 (the warmer analogous color) and color3 (the colder analogous color)
        */
        function (color, threshold) {
            if (typeof threshold === "undefined") { threshold = 30; }
            var hsv = Phaser.ColorUtils.RGBtoHSV(color);

            if (threshold > 359 || threshold < 0) {
                throw Error("Color Warning: Invalid threshold given to getAnalogousHarmony()");
            }

            var warmer = Phaser.ColorUtils.game.math.wrapValue(hsv.hue, 359 - threshold, 359);
            var colder = Phaser.ColorUtils.game.math.wrapValue(hsv.hue, threshold, 359);

            return { color1: color, color2: Phaser.ColorUtils.HSVtoRGB(warmer, 1.0, 1.0), color3: Phaser.ColorUtils.HSVtoRGB(colder, 1.0, 1.0), hue1: hsv.hue, hue2: warmer, hue3: colder };
        };

        ColorUtils.getSplitComplementHarmony = /**
        * Returns an Split Complement Color Harmony for the given color.
        * <p>A Split Complement harmony are the two hues on either side of the color's Complement</p>
        * <p>Values returned in 0xAARRGGBB format with Alpha set to 255.</p>
        *
        * @param	color The color to base the harmony on
        * @param	threshold Control how adjacent the colors will be to the Complement (default +- 30 degrees)
        *
        * @return 	Object containing 3 properties: color1 (the original color), color2 (the warmer analogous color) and color3 (the colder analogous color)
        */
        function (color, threshold) {
            if (typeof threshold === "undefined") { threshold = 30; }
            var hsv = Phaser.ColorUtils.RGBtoHSV(color);

            if (threshold >= 359 || threshold <= 0) {
                throw Error("Phaser.ColorUtils Warning: Invalid threshold given to getSplitComplementHarmony()");
            }

            var opposite = Phaser.ColorUtils.game.math.wrapValue(hsv.hue, 180, 359);

            var warmer = Phaser.ColorUtils.game.math.wrapValue(hsv.hue, opposite - threshold, 359);
            var colder = Phaser.ColorUtils.game.math.wrapValue(hsv.hue, opposite + threshold, 359);

            return { color1: color, color2: Phaser.ColorUtils.HSVtoRGB(warmer, hsv.saturation, hsv.value), color3: Phaser.ColorUtils.HSVtoRGB(colder, hsv.saturation, hsv.value), hue1: hsv.hue, hue2: warmer, hue3: colder };
        };

        ColorUtils.getTriadicHarmony = /**
        * Returns a Triadic Color Harmony for the given color.
        * <p>A Triadic harmony are 3 hues equidistant from each other on the color wheel</p>
        * <p>Values returned in 0xAARRGGBB format with Alpha set to 255.</p>
        *
        * @param	color The color to base the harmony on
        *
        * @return 	Object containing 3 properties: color1 (the original color), color2 and color3 (the equidistant colors)
        */
        function (color) {
            var hsv = Phaser.ColorUtils.RGBtoHSV(color);

            var triadic1 = Phaser.ColorUtils.game.math.wrapValue(hsv.hue, 120, 359);
            var triadic2 = Phaser.ColorUtils.game.math.wrapValue(triadic1, 120, 359);

            return { color1: color, color2: Phaser.ColorUtils.HSVtoRGB(triadic1, 1.0, 1.0), color3: Phaser.ColorUtils.HSVtoRGB(triadic2, 1.0, 1.0) };
        };

        ColorUtils.getColorInfo = /**
        * Returns a string containing handy information about the given color including string hex value,
        * RGB format information and HSL information. Each section starts on a newline, 3 lines in total.
        *
        * @param	color A color value in the format 0xAARRGGBB
        *
        * @return	string containing the 3 lines of information
        */
        function (color) {
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
        * @param	color The color to get the string representation for
        *
        * @return	A string of length 10 characters in the format 0xAARRGGBB
        */
        function (color) {
            var argb = Phaser.ColorUtils.getRGB(color);

            return "0x" + Phaser.ColorUtils.colorToHexstring(argb.alpha) + Phaser.ColorUtils.colorToHexstring(argb.red) + Phaser.ColorUtils.colorToHexstring(argb.green) + Phaser.ColorUtils.colorToHexstring(argb.blue);
        };

        ColorUtils.RGBtoWebstring = /**
        * Return a string representation of the color in the format #RRGGBB
        *
        * @param	color The color to get the string representation for
        *
        * @return	A string of length 10 characters in the format 0xAARRGGBB
        */
        function (color) {
            var argb = Phaser.ColorUtils.getRGB(color);

            return "#" + Phaser.ColorUtils.colorToHexstring(argb.red) + Phaser.ColorUtils.colorToHexstring(argb.green) + Phaser.ColorUtils.colorToHexstring(argb.blue);
        };

        ColorUtils.colorToHexstring = /**
        * Return a string containing a hex representation of the given color
        *
        * @param	color The color channel to get the hex value for, must be a value between 0 and 255)
        *
        * @return	A string of length 2 characters, i.e. 255 = FF, 0 = 00
        */
        function (color) {
            var digits = "0123456789ABCDEF";

            var lsd = color % 16;
            var msd = (color - lsd) / 16;

            var hexified = digits.charAt(msd) + digits.charAt(lsd);

            return hexified;
        };

        ColorUtils.HSVtoRGB = /**
        * Convert a HSV (hue, saturation, lightness) color space value to an RGB color
        *
        * @param	h 		Hue degree, between 0 and 359
        * @param	s 		Saturation, between 0.0 (grey) and 1.0
        * @param	v 		Value, between 0.0 (black) and 1.0
        * @param	alpha	Alpha value to set per color (between 0 and 255)
        *
        * @return 32-bit ARGB color value (0xAARRGGBB)
        */
        function (h, s, v, alpha) {
            if (typeof alpha === "undefined") { alpha = 255; }
            var result;

            if (s == 0.0) {
                result = Phaser.ColorUtils.getColor32(alpha, v * 255, v * 255, v * 255);
            } else {
                h = h / 60.0;
                var f = h - Math.floor(h);
                var p = v * (1.0 - s);
                var q = v * (1.0 - s * f);
                var t = v * (1.0 - s * (1.0 - f));

                switch (Math.floor(h)) {
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
        * @param	color In format 0xRRGGBB
        *
        * @return 	Object with the properties hue (from 0 to 360), saturation (from 0 to 1.0) and lightness (from 0 to 1.0, also available under .value)
        */
        function (color) {
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

            if (delta == 0) {
                hue = 0;
                saturation = 0;
            } else {
                if (lightness < 0.5) {
                    saturation = delta / (max + min);
                } else {
                    saturation = delta / (2 - max - min);
                }

                var delta_r = (((max - red) / 6) + (delta / 2)) / delta;
                var delta_g = (((max - green) / 6) + (delta / 2)) / delta;
                var delta_b = (((max - blue) / 6) + (delta / 2)) / delta;

                if (red == max) {
                    hue = delta_b - delta_g;
                } else if (green == max) {
                    hue = (1 / 3) + delta_r - delta_b;
                } else if (blue == max) {
                    hue = (2 / 3) + delta_g - delta_r;
                }

                if (hue < 0) {
                    hue += 1;
                }

                if (hue > 1) {
                    hue -= 1;
                }
            }

            //	Keep the value with 0 to 359
            hue *= 360;
            hue = Math.round(hue);

            return { hue: hue, saturation: saturation, lightness: lightness, value: lightness };
        };

        ColorUtils.interpolateColor = /**
        *
        * @method interpolateColor
        * @param {Number} color1
        * @param {Number} color2
        * @param {Number} steps
        * @param {Number} currentStep
        * @param {Number} alpha
        * @return {Number}
        * @static
        */
        function (color1, color2, steps, currentStep, alpha) {
            if (typeof alpha === "undefined") { alpha = 255; }
            var src1 = Phaser.ColorUtils.getRGB(color1);
            var src2 = Phaser.ColorUtils.getRGB(color2);

            var r = (((src2.red - src1.red) * currentStep) / steps) + src1.red;
            var g = (((src2.green - src1.green) * currentStep) / steps) + src1.green;
            var b = (((src2.blue - src1.blue) * currentStep) / steps) + src1.blue;

            return Phaser.ColorUtils.getColor32(alpha, r, g, b);
        };

        ColorUtils.interpolateColorWithRGB = /**
        *
        * @method interpolateColorWithRGB
        * @param {Number} color
        * @param {Number} r2
        * @param {Number} g2
        * @param {Number} b2
        * @param {Number} steps
        * @param {Number} currentStep
        * @return {Number}
        * @static
        */
        function (color, r2, g2, b2, steps, currentStep) {
            var src = Phaser.ColorUtils.getRGB(color);

            var r = (((r2 - src.red) * currentStep) / steps) + src.red;
            var g = (((g2 - src.green) * currentStep) / steps) + src.green;
            var b = (((b2 - src.blue) * currentStep) / steps) + src.blue;

            return Phaser.ColorUtils.getColor(r, g, b);
        };

        ColorUtils.interpolateRGB = /**
        *
        * @method interpolateRGB
        * @param {Number} r1
        * @param {Number} g1
        * @param {Number} b1
        * @param {Number} r2
        * @param {Number} g2
        * @param {Number} b2
        * @param {Number} steps
        * @param {Number} currentStep
        * @return {Number}
        * @static
        */
        function (r1, g1, b1, r2, g2, b2, steps, currentStep) {
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
        * @param	min		The lowest value to use for the color
        * @param	max 	The highest value to use for the color
        * @param	alpha	The alpha value of the returning color (default 255 = fully opaque)
        *
        * @return 32-bit color value with alpha
        */
        function (min, max, alpha) {
            if (typeof min === "undefined") { min = 0; }
            if (typeof max === "undefined") { max = 255; }
            if (typeof alpha === "undefined") { alpha = 255; }
            if (max > 255) {
                return Phaser.ColorUtils.getColor(255, 255, 255);
            }

            if (min > max) {
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
        * @param	color in RGB (0xRRGGBB) or ARGB format (0xAARRGGBB)
        *
        * @return Object with properties: alpha, red, green, blue
        */
        function (color) {
            return { alpha: color >>> 24, red: color >> 16 & 0xFF, green: color >> 8 & 0xFF, blue: color & 0xFF };
        };

        ColorUtils.getWebRGB = /**
        *
        * @method getWebRGB
        * @param {Number} color
        * @return {Any}
        */
        function (color) {
            var alpha = (color >>> 24) / 255;
            var red = color >> 16 & 0xFF;
            var green = color >> 8 & 0xFF;
            var blue = color & 0xFF;

            return 'rgba(' + red.toString() + ',' + green.toString() + ',' + blue.toString() + ',' + alpha.toString() + ')';
        };

        ColorUtils.getAlpha = /**
        * Given a native color value (in the format 0xAARRGGBB) this will return the Alpha component, as a value between 0 and 255
        *
        * @param	color	In the format 0xAARRGGBB
        *
        * @return	The Alpha component of the color, will be between 0 and 255 (0 being no Alpha, 255 full Alpha)
        */
        function (color) {
            return color >>> 24;
        };

        ColorUtils.getAlphaFloat = /**
        * Given a native color value (in the format 0xAARRGGBB) this will return the Alpha component as a value between 0 and 1
        *
        * @param	color	In the format 0xAARRGGBB
        *
        * @return	The Alpha component of the color, will be between 0 and 1 (0 being no Alpha (opaque), 1 full Alpha (transparent))
        */
        function (color) {
            return (color >>> 24) / 255;
        };

        ColorUtils.getRed = /**
        * Given a native color value (in the format 0xAARRGGBB) this will return the Red component, as a value between 0 and 255
        *
        * @param	color	In the format 0xAARRGGBB
        *
        * @return	The Red component of the color, will be between 0 and 255 (0 being no color, 255 full Red)
        */
        function (color) {
            return color >> 16 & 0xFF;
        };

        ColorUtils.getGreen = /**
        * Given a native color value (in the format 0xAARRGGBB) this will return the Green component, as a value between 0 and 255
        *
        * @param	color	In the format 0xAARRGGBB
        *
        * @return	The Green component of the color, will be between 0 and 255 (0 being no color, 255 full Green)
        */
        function (color) {
            return color >> 8 & 0xFF;
        };

        ColorUtils.getBlue = /**
        * Given a native color value (in the format 0xAARRGGBB) this will return the Blue component, as a value between 0 and 255
        *
        * @param	color	In the format 0xAARRGGBB
        *
        * @return	The Blue component of the color, will be between 0 and 255 (0 being no color, 255 full Blue)
        */
        function (color) {
            return color & 0xFF;
        };
        return ColorUtils;
    })();
    Phaser.ColorUtils = ColorUtils;
})(Phaser || (Phaser = {}));
