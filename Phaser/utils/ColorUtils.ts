/// <reference path="../Game.ts" />
/// <reference path="../geom/Point.ts" />
/// <reference path="../geom/Rectangle.ts" />
/// <reference path="../geom/Circle.ts" />

/**
* Phaser - ColorUtils
*
* A collection of methods useful for manipulating color values.
*/

module Phaser {

    export class ColorUtils {

        static game: Game;

        /**
         * Given an alpha and 3 color values this will return an integer representation of it
         *
         * @param alpha {number} The Alpha value (between 0 and 255)
         * @param red   {number} The Red channel value (between 0 and 255)
         * @param green {number} The Green channel value (between 0 and 255)
         * @param blue  {number} The Blue channel value (between 0 and 255)
         *
         * @return  A native color value integer (format: 0xAARRGGBB)
         */
        static getColor32(alpha: number, red: number, green: number, blue: number): number {
            return alpha << 24 | red << 16 | green << 8 | blue;
        }

        /**
         * Given 3 color values this will return an integer representation of it
         *
         * @param red   {number} The Red channel value (between 0 and 255)
         * @param green {number} The Green channel value (between 0 and 255)
         * @param blue  {number} The Blue channel value (between 0 and 255)
         *
         * @return  A native color value integer (format: 0xRRGGBB)
         */
        static getColor(red: number, green: number, blue: number): number {
            return red << 16 | green << 8 | blue;
        }

        /**
		 * Get HSV color wheel values in an array which will be 360 elements in size
		 * 
		 * @param	alpha	Alpha value for each color of the color wheel, between 0 (transparent) and 255 (opaque)
		 * 
		 * @return	Array
		 */
        static public getHSVColorWheel(alpha: number = 255) {

            var colors = [];

            for (var c: number = 0; c <= 359; c++)
            {
                //colors[c] = HSVtoRGB(c, 1.0, 1.0, alpha);
                colors[c] = getWebRGB(HSVtoRGB(c, 1.0, 1.0, alpha));
            }

            return colors;

        }

        /**
		 * Returns a Complementary Color Harmony for the given color.
		 * <p>A complementary hue is one directly opposite the color given on the color wheel</p>
		 * <p>Value returned in 0xAARRGGBB format with Alpha set to 255.</p>
		 * 
		 * @param	color The color to base the harmony on
		 * 
		 * @return 0xAARRGGBB format color value
		 */
        static public getComplementHarmony(color: number): number {

            var hsv: any = RGBtoHSV(color);

            var opposite: number = ColorUtils.game.math.wrapValue(hsv.hue, 180, 359);

            return HSVtoRGB(opposite, 1.0, 1.0);

        }

        /**
		 * Returns an Analogous Color Harmony for the given color.
		 * <p>An Analogous harmony are hues adjacent to each other on the color wheel</p>
		 * <p>Values returned in 0xAARRGGBB format with Alpha set to 255.</p>
		 * 
		 * @param	color The color to base the harmony on
		 * @param	threshold Control how adjacent the colors will be (default +- 30 degrees)
		 * 
		 * @return 	Object containing 3 properties: color1 (the original color), color2 (the warmer analogous color) and color3 (the colder analogous color)
		 */
        static public getAnalogousHarmony(color: number, threshold: number = 30) {

            var hsv: any = RGBtoHSV(color);

            if (threshold > 359 || threshold < 0)
            {
                throw Error("Color Warning: Invalid threshold given to getAnalogousHarmony()");
            }

            var warmer: number = ColorUtils.game.math.wrapValue(hsv.hue, 359 - threshold, 359);
            var colder: number = ColorUtils.game.math.wrapValue(hsv.hue, threshold, 359);

            return { color1: color, color2: HSVtoRGB(warmer, 1.0, 1.0), color3: HSVtoRGB(colder, 1.0, 1.0), hue1: hsv.hue, hue2: warmer, hue3: colder }

        }

        /**
		 * Returns an Split Complement Color Harmony for the given color.
		 * <p>A Split Complement harmony are the two hues on either side of the color's Complement</p>
		 * <p>Values returned in 0xAARRGGBB format with Alpha set to 255.</p>
		 * 
		 * @param	color The color to base the harmony on
		 * @param	threshold Control how adjacent the colors will be to the Complement (default +- 30 degrees)
		 * 
		 * @return 	Object containing 3 properties: color1 (the original color), color2 (the warmer analogous color) and color3 (the colder analogous color)
		 */
        static public getSplitComplementHarmony(color: number, threshold: number = 30): any {

            var hsv: any = RGBtoHSV(color);

            if (threshold >= 359 || threshold <= 0)
            {
                throw Error("FlxColor Warning: Invalid threshold given to getSplitComplementHarmony()");
            }

            var opposite: number = ColorUtils.game.math.wrapValue(hsv.hue, 180, 359);

            var warmer: number = ColorUtils.game.math.wrapValue(hsv.hue, opposite - threshold, 359);
            var colder: number = ColorUtils.game.math.wrapValue(hsv.hue, opposite + threshold, 359);

            return { color1: color, color2: HSVtoRGB(warmer, hsv.saturation, hsv.value), color3: HSVtoRGB(colder, hsv.saturation, hsv.value), hue1: hsv.hue, hue2: warmer, hue3: colder }
        }

        /**
		 * Returns a Triadic Color Harmony for the given color.
		 * <p>A Triadic harmony are 3 hues equidistant from each other on the color wheel</p>
		 * <p>Values returned in 0xAARRGGBB format with Alpha set to 255.</p>
		 * 
		 * @param	color The color to base the harmony on
		 * 
		 * @return 	Object containing 3 properties: color1 (the original color), color2 and color3 (the equidistant colors)
		 */
        static public getTriadicHarmony(color: number): any {

            var hsv: any = RGBtoHSV(color);

            var triadic1: number = ColorUtils.game.math.wrapValue(hsv.hue, 120, 359);
            var triadic2: number = ColorUtils.game.math.wrapValue(triadic1, 120, 359);

            return { color1: color, color2: HSVtoRGB(triadic1, 1.0, 1.0), color3: HSVtoRGB(triadic2, 1.0, 1.0) }

        }

        /**
		 * Returns a string containing handy information about the given color including string hex value,
		 * RGB format information and HSL information. Each section starts on a newline, 3 lines in total.
		 * 
		 * @param	color A color value in the format 0xAARRGGBB
		 * 
		 * @return	string containing the 3 lines of information
		 */
        static public getColorInfo(color: number): string {

            var argb: any = getRGB(color);
            var hsl: any = RGBtoHSV(color);

            //	Hex format
            var result: string = RGBtoHexstring(color) + "\n";

            //	RGB format
            result = result.concat("Alpha: " + argb.alpha + " Red: " + argb.red + " Green: " + argb.green + " Blue: " + argb.blue) + "\n";

            //	HSL info
            result = result.concat("Hue: " + hsl.hue + " Saturation: " + hsl.saturation + " Lightnes: " + hsl.lightness);

            return result;

        }

        /**
		 * Return a string representation of the color in the format 0xAARRGGBB
		 * 
		 * @param	color The color to get the string representation for
		 * 
		 * @return	A string of length 10 characters in the format 0xAARRGGBB
		 */
        static public RGBtoHexstring(color: number): string {

            var argb: any = getRGB(color);

            return "0x" + colorToHexstring(argb.alpha) + colorToHexstring(argb.red) + colorToHexstring(argb.green) + colorToHexstring(argb.blue);

        }

        /**
		 * Return a string representation of the color in the format #RRGGBB
		 * 
		 * @param	color The color to get the string representation for
		 * 
		 * @return	A string of length 10 characters in the format 0xAARRGGBB
		 */
        static public RGBtoWebstring(color: number): string {

            var argb: any = getRGB(color);

            return "#" + colorToHexstring(argb.red) + colorToHexstring(argb.green) + colorToHexstring(argb.blue);

        }

        /**
		 * Return a string containing a hex representation of the given color
		 * 
		 * @param	color The color channel to get the hex value for, must be a value between 0 and 255)
		 * 
		 * @return	A string of length 2 characters, i.e. 255 = FF, 0 = 00
		 */
        static public colorToHexstring(color: number): string {

            var digits: string = "0123456789ABCDEF";

            var lsd: number = color % 16;
            var msd: number = (color - lsd) / 16;

            var hexified: string = digits.charAt(msd) + digits.charAt(lsd);

            return hexified;

        }

        /**
		 * Convert a HSV (hue, saturation, lightness) color space value to an RGB color
		 * 
		 * @param	h 		Hue degree, between 0 and 359
		 * @param	s 		Saturation, between 0.0 (grey) and 1.0
		 * @param	v 		Value, between 0.0 (black) and 1.0
		 * @param	alpha	Alpha value to set per color (between 0 and 255)
		 * 
		 * @return 32-bit ARGB color value (0xAARRGGBB)
		 */
        static HSVtoRGB(h: number, s: number, v: number, alpha: number = 255): number {
            
            var result: number;

            if (s == 0.0)
            {
                result = ColorUtils.getColor32(alpha, v * 255, v * 255, v * 255);
            }
            else
            {
                h = h / 60.0;
                var f: number = h - Math.floor(h);
                var p: number = v * (1.0 - s);
                var q: number = v * (1.0 - s * f);
                var t: number = v * (1.0 - s * (1.0 - f));

                switch (Math.floor(h))
                {
                    case 0:
                        result = ColorUtils.getColor32(alpha, v * 255, t * 255, p * 255);
                        break;

                    case 1:
                        result = ColorUtils.getColor32(alpha, q * 255, v * 255, p * 255);
                        break;

                    case 2:
                        result = ColorUtils.getColor32(alpha, p * 255, v * 255, t * 255);
                        break;

                    case 3:
                        result = ColorUtils.getColor32(alpha, p * 255, q * 255, v * 255);
                        break;

                    case 4:
                        result = ColorUtils.getColor32(alpha, t * 255, p * 255, v * 255);
                        break;

                    case 5:
                        result = ColorUtils.getColor32(alpha, v * 255, p * 255, q * 255);
                        break;

                    default:
                        throw new Error("ColorUtils.HSVtoRGB : Unknown color");
                }
            }

            return result;

        }

        /**
		 * Convert an RGB color value to an object containing the HSV color space values: Hue, Saturation and Lightness
		 * 
		 * @param	color In format 0xRRGGBB
		 * 
		 * @return 	Object with the properties hue (from 0 to 360), saturation (from 0 to 1.0) and lightness (from 0 to 1.0, also available under .value)
		 */
        static public RGBtoHSV(color: number): any {

            var rgb: any = ColorUtils.getRGB(color);

            var red: number = rgb.red / 255;
            var green: number = rgb.green / 255;
            var blue: number = rgb.blue / 255;

            var min: number = Math.min(red, green, blue);
            var max: number = Math.max(red, green, blue);
            var delta: number = max - min;
            var lightness: number = (max + min) / 2;
            var hue: number;
            var saturation: number;

            //  Grey color, no chroma
            if (delta == 0)
            {
                hue = 0;
                saturation = 0;
            }
            else
            {
                if (lightness < 0.5)
                {
                    saturation = delta / (max + min);
                }
                else
                {
                    saturation = delta / (2 - max - min);
                }

                var delta_r: number = (((max - red) / 6) + (delta / 2)) / delta;
                var delta_g: number = (((max - green) / 6) + (delta / 2)) / delta;
                var delta_b: number = (((max - blue) / 6) + (delta / 2)) / delta;

                if (red == max)
                {
                    hue = delta_b - delta_g;
                }
                else if (green == max)
                {
                    hue = (1 / 3) + delta_r - delta_b;
                }
                else if (blue == max)
                {
                    hue = (2 / 3) + delta_g - delta_r;
                }

                if (hue < 0)
                {
                    hue += 1;
                }

                if (hue > 1)
                {
                    hue -= 1;
                }
            }

            //	Keep the value with 0 to 359
            hue *= 360;
            hue = Math.round(hue);

            return { hue: hue, saturation: saturation, lightness: lightness, value: lightness };

        }

        /**
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
        static public interpolateColor(color1: number, color2: number, steps: number, currentStep: number, alpha: number = 255): number {

            var src1: any = ColorUtils.getRGB(color1);
            var src2: any = ColorUtils.getRGB(color2);

            var r: number = (((src2.red - src1.red) * currentStep) / steps) + src1.red;
            var g: number = (((src2.green - src1.green) * currentStep) / steps) + src1.green;
            var b: number = (((src2.blue - src1.blue) * currentStep) / steps) + src1.blue;

            return ColorUtils.getColor32(alpha, r, g, b);

        }

        /**
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
        static public interpolateColorWithRGB(color: number, r2: number, g2: number, b2: number, steps: number, currentStep: number): number {
            
            var src: any = ColorUtils.getRGB(color);

            var r: number = (((r2 - src.red) * currentStep) / steps) + src.red;
            var g: number = (((g2 - src.green) * currentStep) / steps) + src.green;
            var b: number = (((b2 - src.blue) * currentStep) / steps) + src.blue;

            return ColorUtils.getColor(r, g, b);

        }

        /**
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
        static public interpolateRGB(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number, steps: number, currentStep: number): number {

            var r: number = (((r2 - r1) * currentStep) / steps) + r1;
            var g: number = (((g2 - g1) * currentStep) / steps) + g1;
            var b: number = (((b2 - b1) * currentStep) / steps) + b1;

            return ColorUtils.getColor(r, g, b);

        }

        /**
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
        static public getRandomColor(min: number = 0, max: number = 255, alpha: number = 255): number {

            //	Sanity checks
            if (max > 255)
            {
                return ColorUtils.getColor(255, 255, 255);
            }

            if (min > max)
            {
                return ColorUtils.getColor(255, 255, 255);
            }

            var red: number = min + Math.round(Math.random() * (max - min));
            var green: number = min + Math.round(Math.random() * (max - min));
            var blue: number = min + Math.round(Math.random() * (max - min));

            return ColorUtils.getColor32(alpha, red, green, blue);

        }

        /**
		 * Return the component parts of a color as an Object with the properties alpha, red, green, blue
		 * 
		 * <p>Alpha will only be set if it exist in the given color (0xAARRGGBB)</p>
		 * 
		 * @param	color in RGB (0xRRGGBB) or ARGB format (0xAARRGGBB)
		 * 
		 * @return Object with properties: alpha, red, green, blue
		 */
        static public getRGB(color: number): any {
            return { alpha: color >>> 24, red: color >> 16 & 0xFF, green: color >> 8 & 0xFF, blue: color & 0xFF };
        }

        /**
        * 
        * @method getWebRGB
        * @param {Number} color
        * @return {Any}
        */
        static public getWebRGB(color: number): any {

            var alpha: number = (color >>> 24) / 255;
            var red: number = color >> 16 & 0xFF;
            var green: number = color >> 8 & 0xFF;
            var blue: number = color & 0xFF;

            return 'rgba(' + red.toString() + ',' + green.toString() + ',' + blue.toString() + ',' + alpha.toString() + ')';

        }

        /**
		 * Given a native color value (in the format 0xAARRGGBB) this will return the Alpha component, as a value between 0 and 255
		 * 
		 * @param	color	In the format 0xAARRGGBB
		 * 
		 * @return	The Alpha component of the color, will be between 0 and 255 (0 being no Alpha, 255 full Alpha)
		 */
        static public getAlpha(color: number): number {
            return color >>> 24;
        }

        /**
		 * Given a native color value (in the format 0xAARRGGBB) this will return the Alpha component as a value between 0 and 1
		 * 
		 * @param	color	In the format 0xAARRGGBB
		 * 
		 * @return	The Alpha component of the color, will be between 0 and 1 (0 being no Alpha (opaque), 1 full Alpha (transparent))
		 */
        static public getAlphaFloat(color: number): number {
            return (color >>> 24) / 255;
        }

        /**
		 * Given a native color value (in the format 0xAARRGGBB) this will return the Red component, as a value between 0 and 255
		 * 
		 * @param	color	In the format 0xAARRGGBB
		 * 
		 * @return	The Red component of the color, will be between 0 and 255 (0 being no color, 255 full Red)
		 */
        static public getRed(color: number): number {
            return color >> 16 & 0xFF;
        }

        /**
		 * Given a native color value (in the format 0xAARRGGBB) this will return the Green component, as a value between 0 and 255
		 * 
		 * @param	color	In the format 0xAARRGGBB
		 * 
		 * @return	The Green component of the color, will be between 0 and 255 (0 being no color, 255 full Green)
		 */
        static public getGreen(color: number): number {
            return color >> 8 & 0xFF;
        }

        /**
		 * Given a native color value (in the format 0xAARRGGBB) this will return the Blue component, as a value between 0 and 255
		 * 
		 * @param	color	In the format 0xAARRGGBB
		 * 
		 * @return	The Blue component of the color, will be between 0 and 255 (0 being no color, 255 full Blue)
		 */
        static public getBlue(color: number): number {
            return color & 0xFF;
        }

    }

}