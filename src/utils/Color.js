/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Phaser.Color class is a set of static methods that assist in color manipulation and conversion.
*
* @class Phaser.Color
*/
Phaser.Color = {

    /**
    * Packs the r, g, b, a components into a single integer, for use with Int32Array.
    * If device is little endian then ABGR order is used. Otherwise RGBA order is used.
    *
    * @author Matt DesLauriers (@mattdesl)
    * @method Phaser.Color.packPixel
    * @static
    * @param {number} r - The red color component, in the range 0 - 255.
    * @param {number} g - The green color component, in the range 0 - 255.
    * @param {number} b - The blue color component, in the range 0 - 255.
    * @param {number} a - The alpha color component, in the range 0 - 255.
    * @return {number} The packed color as uint32
    */
    packPixel: function (r, g, b, a) {

        if (Phaser.Device.LITTLE_ENDIAN)
        {
            return ( (a << 24) | (b << 16) | (g <<  8) | r ) >>> 0;
        }
        else
        {
            return ( (r << 24) | (g << 16) | (b <<  8) | a ) >>> 0;
        }

    },

    /**
    * Unpacks the r, g, b, a components into the specified color object, or a new
    * object, for use with Int32Array. If little endian, then ABGR order is used when
    * unpacking, otherwise, RGBA order is used. The resulting color object has the
    * `r, g, b, a` properties which are unrelated to endianness.
    *
    * Note that the integer is assumed to be packed in the correct endianness. On little-endian
    * the format is 0xAABBGGRR and on big-endian the format is 0xRRGGBBAA. If you want a
    * endian-independent method, use fromRGBA(rgba) and toRGBA(r, g, b, a).
    *
    * @author Matt DesLauriers (@mattdesl)
    * @method Phaser.Color.unpackPixel
    * @static
    * @param {number} rgba - The integer, packed in endian order by packPixel.
    * @param {object} [out] - An object into which 3 properties will be created: r, g and b. If not provided a new object will be created.
    * @param {boolean} [hsl=false] - Also convert the rgb values into hsl?
    * @param {boolean} [hsv=false] - Also convert the rgb values into hsv?
    * @return {object} An object with the red, green and blue values set in the r, g and b properties.
    */
    unpackPixel: function (rgba, out, hsl, hsv) {

        if (typeof out === 'undefined' || out === null) { out = Phaser.Color.createColor(); }
        if (typeof hsl === 'undefined' || hsl === null) { hsl = false; }
        if (typeof hsv === 'undefined' || hsv === null) { hsv = false; }

        if (Phaser.Device.LITTLE_ENDIAN)
        {
            out.a = ((rgba & 0xff000000) >>> 24);
            out.b = ((rgba & 0x00ff0000) >>> 16);
            out.g = ((rgba & 0x0000ff00) >>> 8);
            out.r = ((rgba & 0x000000ff));
        }
        else
        {
            out.r = ((rgba & 0xff000000) >>> 24);
            out.g = ((rgba & 0x00ff0000) >>> 16);
            out.b = ((rgba & 0x0000ff00) >>> 8);
            out.a = ((rgba & 0x000000ff));
        }

        out.color = rgba;
        out.rgba = 'rgba(' + out.r + ',' + out.g + ',' + out.b + ',' + (out.a / 255) + ')';

        if (hsl)
        {
            Phaser.Color.RGBtoHSL(out.r, out.g, out.b, out);
        }

        if (hsv)
        {
            Phaser.Color.RGBtoHSV(out.r, out.g, out.b, out);
        }

        return out;

    },

    /**
    * A utility to convert an integer in 0xRRGGBBAA format to a color object.
    * This does not rely on endianness.
    *
    * @author Matt DesLauriers (@mattdesl)
    * @method Phaser.Color.fromRGBA
    * @static
    * @param {number} rgba - An RGBA hex
    * @param {object} [out] - The object to use, optional.
    * @return {object} A color object.
    */
    fromRGBA: function (rgba, out) {

        if (!out)
        {
            out = Phaser.Color.createColor();
        }

        out.r = ((rgba & 0xff000000) >>> 24);
        out.g = ((rgba & 0x00ff0000) >>> 16);
        out.b = ((rgba & 0x0000ff00) >>> 8);
        out.a = ((rgba & 0x000000ff));

        out.rgba = 'rgba(' + out.r + ',' + out.g + ',' + out.b + ',' + out.a + ')';

        return out;

    },

    /**
    * A utility to convert RGBA components to a 32 bit integer in RRGGBBAA format.
    *
    * @author Matt DesLauriers (@mattdesl)
    * @method Phaser.Color.toRGBA
    * @static
    * @param {number} r - The red color component, in the range 0 - 255.
    * @param {number} g - The green color component, in the range 0 - 255.
    * @param {number} b - The blue color component, in the range 0 - 255.
    * @param {number} a - The alpha color component, in the range 0 - 255.
    * @return {number} A RGBA-packed 32 bit integer
    */
    toRGBA: function (r, g, b, a) {

        return (r << 24) | (g << 16) | (b <<  8) | a;

    },

    /**
    * Converts an RGB color value to HSL (hue, saturation and lightness).
    * Conversion forumla from http://en.wikipedia.org/wiki/HSL_color_space.
    * Assumes RGB values are contained in the set [0, 255] and returns h, s and l in the set [0, 1].
    * Based on code by Michael Jackson (https://github.com/mjijackson)
    *
    * @method Phaser.Color.RGBtoHSL
    * @static
    * @param {number} r - The red color component, in the range 0 - 255.
    * @param {number} g - The green color component, in the range 0 - 255.
    * @param {number} b - The blue color component, in the range 0 - 255.
    * @param {object} [out] - An object into which 3 properties will be created, h, s and l. If not provided a new object will be created.
    * @return {object} An object with the hue, saturation and lightness values set in the h, s and l properties.
    */
    RGBtoHSL: function (r, g, b, out) {

        if (!out)
        {
            out = Phaser.Color.createColor(r, g, b, 1);
        }

        r /= 255;
        g /= 255;
        b /= 255;

        var min = Math.min(r, g, b);
        var max = Math.max(r, g, b);

        // achromatic by default
        out.h = 0;
        out.s = 0;
        out.l = (max + min) / 2;

        if (max !== min)
        {
            var d = max - min;

            out.s = out.l > 0.5 ? d / (2 - max - min) : d / (max + min);

            if (max === r)
            {
                out.h = (g - b) / d + (g < b ? 6 : 0);
            }
            else if (max === g)
            {
                out.h = (b - r) / d + 2;
            }
            else if (max === b)
            {
                out.h = (r - g) / d + 4;
            }

            out.h /= 6;
        }

        return out;

    },

    /**
    * Converts an HSL (hue, saturation and lightness) color value to RGB.
    * Conversion forumla from http://en.wikipedia.org/wiki/HSL_color_space.
    * Assumes HSL values are contained in the set [0, 1] and returns r, g and b values in the set [0, 255].
    * Based on code by Michael Jackson (https://github.com/mjijackson)
    *
    * @method Phaser.Color.HSLtoRGB
    * @static
    * @param {number} h - The hue, in the range 0 - 1.
    * @param {number} s - The saturation, in the range 0 - 1.
    * @param {number} l - The lightness, in the range 0 - 1.
    * @param {object} [out] - An object into which 3 properties will be created: r, g and b. If not provided a new object will be created.
    * @return {object} An object with the red, green and blue values set in the r, g and b properties.
    */
    HSLtoRGB: function (h, s, l, out) {

        if (!out)
        {
            out = Phaser.Color.createColor(l, l, l);
        }
        else
        {
            // achromatic by default
            out.r = l;
            out.g = l;
            out.b = l;
        }

        if (s !== 0)
        {
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            out.r = Phaser.Color.hueToColor(p, q, h + 1 / 3);
            out.g = Phaser.Color.hueToColor(p, q, h);
            out.b = Phaser.Color.hueToColor(p, q, h - 1 / 3);
        }

        // out.r = (out.r * 255 | 0);
        // out.g = (out.g * 255 | 0);
        // out.b = (out.b * 255 | 0);

        out.r = Math.floor((out.r * 255 | 0));
        out.g = Math.floor((out.g * 255 | 0));
        out.b = Math.floor((out.b * 255 | 0));

        Phaser.Color.updateColor(out);

        return out;

    },

    /**
    * Converts an RGB color value to HSV (hue, saturation and value).
    * Conversion forumla from http://en.wikipedia.org/wiki/HSL_color_space.
    * Assumes RGB values are contained in the set [0, 255] and returns h, s and v in the set [0, 1].
    * Based on code by Michael Jackson (https://github.com/mjijackson)
    *
    * @method Phaser.Color.RGBtoHSV
    * @static
    * @param {number} r - The red color component, in the range 0 - 255.
    * @param {number} g - The green color component, in the range 0 - 255.
    * @param {number} b - The blue color component, in the range 0 - 255.
    * @param {object} [out] - An object into which 3 properties will be created, h, s and v. If not provided a new object will be created.
    * @return {object} An object with the hue, saturation and value set in the h, s and v properties.
    */
    RGBtoHSV: function (r, g, b, out) {

        if (!out)
        {
            out = Phaser.Color.createColor(r, g, b, 255);
        }

        r /= 255;
        g /= 255;
        b /= 255;

        var min = Math.min(r, g, b);
        var max = Math.max(r, g, b);
        var d = max - min;

        // achromatic by default
        out.h = 0;
        out.s = max === 0 ? 0 : d / max;
        out.v = max;

        if (max !== min)
        {
            if (max === r)
            {
                out.h = (g - b) / d + (g < b ? 6 : 0);
            }
            else if (max === g)
            {
                out.h = (b - r) / d + 2;
            }
            else if (max === b)
            {
                out.h = (r - g) / d + 4;
            }

            out.h /= 6;
        }

        return out;

    },

    /**
    * Converts an HSV (hue, saturation and value) color value to RGB.
    * Conversion forumla from http://en.wikipedia.org/wiki/HSL_color_space.
    * Assumes HSV values are contained in the set [0, 1] and returns r, g and b values in the set [0, 255].
    * Based on code by Michael Jackson (https://github.com/mjijackson)
    *
    * @method Phaser.Color.HSVtoRGB
    * @static
    * @param {number} h - The hue, in the range 0 - 1.
    * @param {number} s - The saturation, in the range 0 - 1.
    * @param {number} v - The value, in the range 0 - 1.
    * @param {object} [out] - An object into which 3 properties will be created: r, g and b. If not provided a new object will be created.
    * @return {object} An object with the red, green and blue values set in the r, g and b properties.
    */
    HSVtoRGB: function (h, s, v, out) {

        if (typeof out === 'undefined') { out = Phaser.Color.createColor(0, 0, 0, 1, h, s, 0, v); }

        var r, g, b;
        var i = Math.floor(h * 6);
        var f = h * 6 - i;
        var p = v * (1 - s);
        var q = v * (1 - f * s);
        var t = v * (1 - (1 - f) * s);

        switch (i % 6)
        {
            case 0:
                r = v;
                g = t;
                b = p;
                break;
            case 1:
                r = q;
                g = v;
                b = p;
                break;
            case 2:
                r = p;
                g = v;
                b = t;
                break;
            case 3:
                r = p;
                g = q;
                b = v;
                break;
            case 4:
                r = t;
                g = p;
                b = v;
                break;
            case 5:
                r = v;
                g = p;
                b = q;
                break;
        }

        out.r = Math.floor(r * 255);
        out.g = Math.floor(g * 255);
        out.b = Math.floor(b * 255);

        Phaser.Color.updateColor(out);

        return out;

    },

    /**
    * Converts a hue to an RGB color.
    * Based on code by Michael Jackson (https://github.com/mjijackson)
    *
    * @method Phaser.Color.hueToColor
    * @static
    * @param {number} p
    * @param {number} q
    * @param {number} t
    * @return {number} The color component value.
    */
    hueToColor: function (p, q, t) {

        if (t < 0)
        {
            t += 1;
        }

        if (t > 1)
        {
            t -= 1;
        }

        if (t < 1 / 6)
        {
            return p + (q - p) * 6 * t;
        }

        if (t < 1 / 2)
        {
            return q;
        }

        if (t < 2 / 3)
        {
            return p + (q - p) * (2 / 3 - t) * 6;
        }

        return p;

    },

    /**
    * A utility function to create a lightweight 'color' object with the default components.
    * Any components that are not specified will default to zero.
    *
    * This is useful when you want to use a shared color object for the getPixel and getPixelAt methods.
    *
    * @author Matt DesLauriers (@mattdesl)
    * @method Phaser.Color.createColor
    * @static
    * @param {number} [r=0] - The red color component, in the range 0 - 255.
    * @param {number} [g=0] - The green color component, in the range 0 - 255.
    * @param {number} [b=0] - The blue color component, in the range 0 - 255.
    * @param {number} [a=1] - The alpha color component, in the range 0 - 1.
    * @param {number} [h=0] - The hue, in the range 0 - 1.
    * @param {number} [s=0] - The saturation, in the range 0 - 1.
    * @param {number} [l=0] - The lightness, in the range 0 - 1.
    * @param {number} [v=0] - The value, in the range 0 - 1.
    * @return {object} The resulting object with r, g, b, a properties and h, s, l and v.
    */
    createColor: function (r, g, b, a, h, s, l, v) {

        var out = { r: r || 0, g: g || 0, b: b || 0, a: a || 1, h: h || 0, s: s || 0, l: l || 0, v: v || 0, color: 0 };

        out.rgba = 'rgba(' + out.r + ',' + out.g + ',' + out.b + ',' + out.a + ')';

        return out;

    },

    /**
    * Takes a color object and updates the rgba property.
    *
    * @method Phaser.Color.updateColor
    * @static
    * @param {object} out - The color object to update.
    * @returns {number} A native color value integer (format: 0xAARRGGBB).
    */
    updateColor: function (out) {

        out.rgba = 'rgba(' + out.r + ',' + out.g + ',' + out.b + ',' + out.a + ')';

        return out;

    },

    /**
    * Given an alpha and 3 color values this will return an integer representation of it.
    *
    * @method Phaser.Color.getColor32
    * @static
    * @param {number} a - The alpha color component, in the range 0 - 255.
    * @param {number} r - The red color component, in the range 0 - 255.
    * @param {number} g - The green color component, in the range 0 - 255.
    * @param {number} b - The blue color component, in the range 0 - 255.
    * @returns {number} A native color value integer (format: 0xAARRGGBB).
    */
    getColor32: function (a, r, g, b) {

        return a << 24 | r << 16 | g << 8 | b;

    },

    /**
    * Given 3 color values this will return an integer representation of it.
    *
    * @method Phaser.Color.getColor
    * @static
    * @param {number} r - The red color component, in the range 0 - 255.
    * @param {number} g - The green color component, in the range 0 - 255.
    * @param {number} b - The blue color component, in the range 0 - 255.
    * @returns {number} A native color value integer (format: 0xRRGGBB).
    */
    getColor: function (r, g, b) {

        return r << 16 | g << 8 | b;

    },

    /**
    * Converts the given color values into a string.
    * If prefix was '#' it will be in the format `#RRGGBB` otherwise `0xAARRGGBB`.
    *
    * @method Phaser.Color.RGBtoString
    * @static
    * @param {number} r - The red color component, in the range 0 - 255.
    * @param {number} g - The green color component, in the range 0 - 255.
    * @param {number} b - The blue color component, in the range 0 - 255.
    * @param {number} [a=255] - The alpha color component, in the range 0 - 255.
    * @param {string} [prefix='#'] - The prefix used in the return string. If '#' it will return `#RRGGBB`, else `0xAARRGGBB`.
    * @return {string} A string containing the color values. If prefix was '#' it will be in the format `#RRGGBB` otherwise `0xAARRGGBB`.
    */
    RGBtoString: function (r, g, b, a, prefix) {

        if (typeof a === 'undefined') { a = 255; }
        if (typeof prefix === 'undefined') { prefix = '#'; }

        if (prefix === '#')
        {
            return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        }
        else
        {
            return '0x' + Phaser.Color.componentToHex(a) + Phaser.Color.componentToHex(r) + Phaser.Color.componentToHex(g) + Phaser.Color.componentToHex(b);
        }

    },

    /**
    * Converts a hex string into an integer color value.
    *
    * @method Phaser.Color.hexToRGB
    * @static
    * @param {string} hex - The hex string to convert. Can be in the short-hand format `#03f` or `#0033ff`.
    * @return {number} The rgb color value in the format 0xAARRGGBB.
    */
    hexToRGB: function (hex) {

        var rgb = Phaser.Color.hexToColor(hex);

        if (rgb)
        {
            return Phaser.Color.getColor32(rgb.a, rgb.r, rgb.g, rgb.b);
        }

    },

    /**
    * Converts a hex string into a Phaser Color object.
    *
    * @method Phaser.Color.hexToColor
    * @static
    * @param {string} hex - The hex string to convert. Can be in the short-hand format `#03f` or `#0033ff`.
    * @param {object} [out] - An object into which 3 properties will be created: r, g and b. If not provided a new object will be created.
    * @return {object} An object with the red, green and blue values set in the r, g and b properties.
    */
    hexToColor: function (hex, out) {

        if (!out)
        {
            out = Phaser.Color.createColor();
        }

        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        if (result)
        {
            out.r = parseInt(result[1], 16);
            out.g = parseInt(result[2], 16);
            out.b = parseInt(result[3], 16);
        }

        return out;

    },

    /**
    * Return a string containing a hex representation of the given color component.
    *
    * @method Phaser.Color.componentToHex
    * @static
    * @param {number} color - The color channel to get the hex value for, must be a value between 0 and 255.
    * @returns {string} A string of length 2 characters, i.e. 255 = ff, 100 = 64.
    */
    componentToHex: function (color) {

        var hex = color.toString(16);
        return hex.length == 1 ? "0" + hex : hex;

    },

    /**
    * Get HSV color wheel values in an array which will be 360 elements in size.
    *
    * @method Phaser.Color.HSVColorWheel
    * @static
    * @param {number} [s=1] - The saturation, in the range 0 - 1.
    * @param {number} [v=1] - The value, in the range 0 - 1.
    * @return {array} An array containing 360 elements corresponding to the HSV color wheel.
    */
    HSVColorWheel: function (s, v) {

        if (typeof s === 'undefined') { s = 1.0; }
        if (typeof v === 'undefined') { v = 1.0; }

        var colors = [];

        for (var c = 0; c <= 359; c++)
        {
            colors.push(Phaser.Color.HSVtoRGB(c / 359, s, v));
        }

        return colors;

    },

    /**
    * Get HSL color wheel values in an array which will be 360 elements in size.
    *
    * @method Phaser.Color.HSLColorWheel
    * @static
    * @param {number} [s=0.5] - The saturation, in the range 0 - 1.
    * @param {number} [l=0.5] - The lightness, in the range 0 - 1.
    * @return {array} An array containing 360 elements corresponding to the HSL color wheel.
    */
    HSLColorWheel: function (s, l) {

        if (typeof s === 'undefined') { s = 0.5; }
        if (typeof l === 'undefined') { l = 0.5; }

        var colors = [];

        for (var c = 0; c <= 359; c++)
        {
            colors.push(Phaser.Color.HSLtoRGB(c / 359, s, l));
        }

        return colors;

    },

    /**
    * Interpolates the two given colours based on the supplied step and currentStep properties.
    *
    * @method Phaser.Color.interpolateColor
    * @static
    * @param {number} color1 - The first color value.
    * @param {number} color2 - The second color value.
    * @param {number} steps - The number of steps to run the interpolation over.
    * @param {number} currentStep - The currentStep value. If the interpolation will take 100 steps, a currentStep value of 50 would be half-way between the two.
    * @param {number} alpha - The alpha of the returned color.
    * @returns {number} The interpolated color value.
    */
    interpolateColor: function (color1, color2, steps, currentStep, alpha) {

        if (typeof alpha === "undefined") { alpha = 255; }

        var src1 = Phaser.Color.getRGB(color1);
        var src2 = Phaser.Color.getRGB(color2);
        var r = (((src2.red - src1.red) * currentStep) / steps) + src1.red;
        var g = (((src2.green - src1.green) * currentStep) / steps) + src1.green;
        var b = (((src2.blue - src1.blue) * currentStep) / steps) + src1.blue;

        return Phaser.Color.getColor32(alpha, r, g, b);

    },

    /**
    * Interpolates the two given colours based on the supplied step and currentStep properties.
    *
    * @method Phaser.Color.interpolateColorWithRGB
    * @static
    * @param {number} color - The first color value.
    * @param {number} r - The red color value, between 0 and 0xFF (255).
    * @param {number} g - The green color value, between 0 and 0xFF (255).
    * @param {number} b - The blue color value, between 0 and 0xFF (255).
    * @param {number} steps - The number of steps to run the interpolation over.
    * @param {number} currentStep - The currentStep value. If the interpolation will take 100 steps, a currentStep value of 50 would be half-way between the two.
    * @returns {number} The interpolated color value.
    */
    interpolateColorWithRGB: function (color, r, g, b, steps, currentStep) {

        var src = Phaser.Color.getRGB(color);
        var or = (((r - src.red) * currentStep) / steps) + src.red;
        var og = (((g - src.green) * currentStep) / steps) + src.green;
        var ob = (((b - src.blue) * currentStep) / steps) + src.blue;

        return Phaser.Color.getColor(or, og, ob);

    },

    /**
    * Interpolates the two given colours based on the supplied step and currentStep properties.
    * @method Phaser.Color.interpolateRGB
    * @static
    * @param {number} r1 - The red color value, between 0 and 0xFF (255).
    * @param {number} g1 - The green color value, between 0 and 0xFF (255).
    * @param {number} b1 - The blue color value, between 0 and 0xFF (255).
    * @param {number} r2 - The red color value, between 0 and 0xFF (255).
    * @param {number} g2 - The green color value, between 0 and 0xFF (255).
    * @param {number} b2 - The blue color value, between 0 and 0xFF (255).
    * @param {number} steps - The number of steps to run the interpolation over.
    * @param {number} currentStep - The currentStep value. If the interpolation will take 100 steps, a currentStep value of 50 would be half-way between the two.
    * @returns {number} The interpolated color value.
    */
    interpolateRGB: function (r1, g1, b1, r2, g2, b2, steps, currentStep) {

        var r = (((r2 - r1) * currentStep) / steps) + r1;
        var g = (((g2 - g1) * currentStep) / steps) + g1;
        var b = (((b2 - b1) * currentStep) / steps) + b1;

        return Phaser.Color.getColor(r, g, b);

    },

    /**
    * Returns a random color value between black and white
    * Set the min value to start each channel from the given offset.
    * Set the max value to restrict the maximum color used per channel.
    *
    * @method Phaser.Color.getRandomColor
    * @static
    * @param {number} min - The lowest value to use for the color.
    * @param {number} max - The highest value to use for the color.
    * @param {number} alpha - The alpha value of the returning color (default 255 = fully opaque).
    * @returns {number} 32-bit color value with alpha.
    */
    getRandomColor: function (min, max, alpha) {

        if (typeof min === "undefined") { min = 0; }
        if (typeof max === "undefined") { max = 255; }
        if (typeof alpha === "undefined") { alpha = 255; }

        //  Sanity checks
        if (max > 255 || min > max)
        {
            return Phaser.Color.getColor(255, 255, 255);
        }

        var red = min + Math.round(Math.random() * (max - min));
        var green = min + Math.round(Math.random() * (max - min));
        var blue = min + Math.round(Math.random() * (max - min));

        return Phaser.Color.getColor32(alpha, red, green, blue);

    },

    /**
    * Return the component parts of a color as an Object with the properties alpha, red, green, blue.
    *
    * Alpha will only be set if it exist in the given color (0xAARRGGBB)
    *
    * @method Phaser.Color.getRGB
    * @static
    * @param {number} color - Color in RGB (0xRRGGBB) or ARGB format (0xAARRGGBB).
    * @returns {object} An Object with properties: alpha, red, green, blue (also r, g, b and a). Alpha will only be present if a color value > 16777215 was given.
    */
    getRGB: function (color) {

        if (color > 16777215)
        {
            //  The color value has an alpha component
            return {
                alpha: color >>> 24,
                red: color >> 16 & 0xFF,
                green: color >> 8 & 0xFF,
                blue: color & 0xFF,
                a: color >>> 24,
                r: color >> 16 & 0xFF,
                g: color >> 8 & 0xFF,
                b: color & 0xFF
            };
        }
        else
        {
            return {
                alpha: 255,
                red: color >> 16 & 0xFF,
                green: color >> 8 & 0xFF,
                blue: color & 0xFF,
                a: 255,
                r: color >> 16 & 0xFF,
                g: color >> 8 & 0xFF,
                b: color & 0xFF
            };
        }

    },

    /**
    * Returns a CSS friendly string value from the given color.
    *
    * @method Phaser.Color.getWebRGB
    * @static
    * @param {number|Object} color - Color in RGB (0xRRGGBB), ARGB format (0xAARRGGBB) or an Object with r, g, b, a properties.
    * @returns {string} A string in the format: 'rgba(r,g,b,a)'
    */
    getWebRGB: function (color) {

        if (typeof color === 'object')
        {
            return 'rgba(' + color.r.toString() + ',' + color.g.toString() + ',' + color.b.toString() + ',' + (color.a / 255).toString() + ')';
        }
        else
        {
            var rgb = Phaser.Color.getRGB(color);
            return 'rgba(' + rgb.r.toString() + ',' + rgb.g.toString() + ',' + rgb.b.toString() + ',' + (rgb.a / 255).toString() + ')';
        }

    },

    /**
    * Given a native color value (in the format 0xAARRGGBB) this will return the Alpha component, as a value between 0 and 255.
    *
    * @method Phaser.Color.getAlpha
    * @static
    * @param {number} color - In the format 0xAARRGGBB.
    * @returns {number} The Alpha component of the color, will be between 0 and 1 (0 being no Alpha (opaque), 1 full Alpha (transparent)).
    */
    getAlpha: function (color) {
        return color >>> 24;
    },

    /**
    * Given a native color value (in the format 0xAARRGGBB) this will return the Alpha component as a value between 0 and 1.
    *
    * @method Phaser.Color.getAlphaFloat
    * @static
    * @param {number} color - In the format 0xAARRGGBB.
    * @returns {number} The Alpha component of the color, will be between 0 and 1 (0 being no Alpha (opaque), 1 full Alpha (transparent)).
    */
    getAlphaFloat: function (color) {
        return (color >>> 24) / 255;
    },

    /**
    * Given a native color value (in the format 0xAARRGGBB) this will return the Red component, as a value between 0 and 255.
    *
    * @method Phaser.Color.getRed
    * @static
    * @param {number} color In the format 0xAARRGGBB.
    * @returns {number} The Red component of the color, will be between 0 and 255 (0 being no color, 255 full Red).
    */
    getRed: function (color) {
        return color >> 16 & 0xFF;
    },

    /**
    * Given a native color value (in the format 0xAARRGGBB) this will return the Green component, as a value between 0 and 255.
    *
    * @method Phaser.Color.getGreen
    * @static
    * @param {number} color - In the format 0xAARRGGBB.
    * @returns {number} The Green component of the color, will be between 0 and 255 (0 being no color, 255 full Green).
    */
    getGreen: function (color) {
        return color >> 8 & 0xFF;
    },

    /**
    * Given a native color value (in the format 0xAARRGGBB) this will return the Blue component, as a value between 0 and 255.
    *
    * @method Phaser.Color.getBlue
    * @static
    * @param {number} color - In the format 0xAARRGGBB.
    * @returns {number} The Blue component of the color, will be between 0 and 255 (0 being no color, 255 full Blue).
    */
    getBlue: function (color) {
        return color & 0xFF;
    },

    //   The following are all DEPRECATED

    /**
    * DEPRECATED: This method will be removed in Phaser 2.1.
    * Returns a string containing handy information about the given color including string hex value,
    * RGB format information. Each section starts on a newline, 3 lines in total.
    *
    * @method Phaser.Color.getColorInfo
    * @static
    * @param {number} color - A color value in the format 0xAARRGGBB.
    * @returns {string} String containing the 3 lines of information.
    */
    getColorInfo: function (color) {

        var argb = Phaser.Color.getRGB(color);

        //  Hex format
        var result = Phaser.Color.RGBtoHexstring(color) + "\n";

        //  RGB format
        result = result.concat("Alpha: " + argb.alpha + " Red: " + argb.red + " Green: " + argb.green + " Blue: " + argb.blue) + "\n";

        return result;

    },

    /**
    * DEPRECATED: This method will be removed in Phaser 2.1. Please use Phaser.Color.RGBtoString instead.
    * Return a string representation of the color in the format 0xAARRGGBB.
    *
    * @method Phaser.Color.RGBtoHexstring
    * @static
    * @param {number} color - The color to get the string representation for
    * @returns {string} A string of length 10 characters in the format 0xAARRGGBB
    */
    RGBtoHexstring: function (color) {

        var argb = Phaser.Color.getRGB(color);

        return "0x" + Phaser.Color.colorToHexstring(argb.alpha) + Phaser.Color.colorToHexstring(argb.red) + Phaser.Color.colorToHexstring(argb.green) + Phaser.Color.colorToHexstring(argb.blue);

    },

    /**
    * DEPRECATED: This method will be removed in Phaser 2.1. Please use Phaser.Color.RGBtoString instead.
    * Return a string representation of the color in the format #RRGGBB.
    *
    * @method Phaser.Color.RGBtoWebstring
    * @static
    * @param {number} color - The color to get the string representation for.
    * @returns {string} A string of length 10 characters in the format 0xAARRGGBB.
    */
    RGBtoWebstring: function (color) {

        var argb = Phaser.Color.getRGB(color);

        return "#" + Phaser.Color.colorToHexstring(argb.red) + Phaser.Color.colorToHexstring(argb.green) + Phaser.Color.colorToHexstring(argb.blue);

    },

    /**
    * DEPRECATED: This method will be removed in Phaser 2.1. Please use Phaser.Color.componentToHex instead.
    * Return a string containing a hex representation of the given color.
    *
    * @method Phaser.Color.colorToHexstring
    * @static
    * @param {number} color - The color channel to get the hex value for, must be a value between 0 and 255).
    * @returns {string} A string of length 2 characters, i.e. 255 = FF, 0 = 00.
    */
    colorToHexstring: function (color) {

        var digits = "0123456789ABCDEF";
        var lsd = color % 16;
        var msd = (color - lsd) / 16;
        var hexified = digits.charAt(msd) + digits.charAt(lsd);
        return hexified;

    }

};
