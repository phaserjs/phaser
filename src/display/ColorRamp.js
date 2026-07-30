/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Linear = require('../math/Linear');
var Utils = require('../renderer/webgl/Utils');
var Class = require('../utils/Class');
var UUID = require('../utils/string/UUID');
var ColorBand = require('./ColorBand');

var getTint = Utils.getTintFromFloats;

/**
 * @classdesc
 * The ColorRamp class represents a series of color transitions.
 * It is intended for use in a {@see Phaser.GameObjects.Gradient}.
 *
 * You should make sure that your bands are arranged end-to-end,
 * with no gaps. The Gradient shader assumes this is so.
 * You may leave gaps at the start and end.
 * Overlaps and gaps may not act as expected.
 *
 * By default, ColorRamp stores its data for use on the GPU
 * in a data texture. This is updated automatically on creation
 * and when you run `setBands()`, but if you edit the bands manually,
 * you should run `encode()` to rebuild the texture.
 * We don't update it automatically because we don't want to waste cycles
 * on rebuilds that you're about to overwrite.
 *
 * @class ColorRamp
 * @memberof Phaser.Display
 * @since 4.0.0
 * @constructor
 *
 * @param {Phaser.Scene} scene - The current scene.
 * @param {Phaser.Types.Display.ColorBandConfig | Phaser.Display.ColorBand | Array<Phaser.Types.Display.ColorBandConfig | Phaser.Display.ColorBand>} bands - The bands which make up this ramp. This can be one entry or an array, and can be configs or existing instances. A band count over 1048576 may be unsafe.
 * @param {boolean} [gpuEncode=true] - Whether to create a data texture to use this ramp in shaders.
 */
var ColorRamp = new Class({
    initialize: function ColorRamp (scene, bands, gpuEncode)
    {
        if (gpuEncode === undefined) { gpuEncode = true; }

        /**
         * The scene where the ColorRamp was created.
         *
         * @name Phaser.Display.ColorRamp#scene
         * @type {Phaser.Scene}
         * @since 4.0.0
         * @readonly
         */
        this.scene = scene;

        /**
         * The color bands that make up this ramp.
         *
         * @name Phaser.Display.ColorRamp#bands
         * @type {Phaser.Display.ColorBand[]}
         * @since 4.0.0
         */
        this.bands = [];

        /**
         * Whether to encode the ramp for shaders to use on the GPU.
         * An encoded ramp is stored as a texture.
         *
         * @name Phaser.Display.ColorRamp#gpuEncode
         * @type {boolean}
         * @since 4.0.0
         * @default true
         */
        this.gpuEncode = gpuEncode;

        /**
         * The Phaser Texture wrapping the GPU data texture for this ramp.
         * This is registered with the Scene's Texture Manager under a unique key
         * so it can be referenced elsewhere. It is not intended for display.
         *
         * @name Phaser.Display.ColorRamp#dataTexture
         * @type {?Phaser.Textures.Texture}
         * @since 4.0.0
         * @readonly
         */
        this.dataTexture = null;

        /**
         * The texture containing the ramp encoded for the GPU.
         * This is used internally by effects such as the Gradient game object
         * to read complex ramp data.
         *
         * @name Phaser.Display.ColorRamp#glTexture
         * @type {?Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper}
         * @since 4.0.0
         * @readonly
         */
        this.glTexture = null;

        /**
         * The texel index which contains the first band data
         * in `glTexture` if it has been encoded.
         * This is used internally.
         *
         * @name Phaser.Display.ColorRamp#dataTextureFirstBand
         * @type {number}
         * @since 4.0.0
         * @readonly
         */
        this.dataTextureFirstBand = 0;

        /**
         * The number of levels in the band tree.
         * This is used internally to decode the data texture.
         *
         * @name Phaser.Display.ColorRamp#bandTreeDepth
         * @type {number}
         * @since 4.0.0
         * @readonly
         */
        this.bandTreeDepth = 0;

        /**
         * The resolution of the data texture, if it has been encoded.
         * This is used internally.
         *
         * @name Phaser.Display.ColorRamp#dataTextureResolution
         * @type {number[]}
         * @since 4.0.0
         * @readonly
         */
        this.dataTextureResolution = [ 0, 0 ];

        this.setBands(bands);
    },

    /**
     * Set or replace the color bands in this ramp.
     * Use this after creation to update the bands.
     *
     * This will re-encode the data texture if `gpuEncode` is set
     * and `encode` is not `false`.
     *
     * @method Phaser.Display.ColorRamp#setBands
     * @since 4.0.0
     *
     * @param {Phaser.Types.Display.ColorBandConfig | Phaser.Display.ColorBand | Array<Phaser.Types.Display.ColorBandConfig | Phaser.Display.ColorBand>} bands - The bands to make up this ramp. This can be one entry or an array, and can be configs or existing instances.
     * @param {boolean} [encode=true] - Whether to encode the new ramp data to a data texture for use in shaders.
     *
     * @return {this} - This ColorRamp instance.
     */
    setBands: function (bands, encode)
    {
        this.bands.length = 0;

        if (!Array.isArray(bands))
        {
            bands = [ bands ];
        }

        var lastEnd = 0;

        for (var i = 0; i < bands.length; i++)
        {
            var band = bands[i];
            if (band.isColorBand)
            {
                this.bands.push(band);
                lastEnd = band.end;
                continue;
            }

            // `band` must be a config object.
            if (band.start === undefined)
            {
                band = Object.assign({ start: lastEnd }, band);
            }
            var newBand = new ColorBand(band);
            this.bands.push(newBand);
            lastEnd = newBand.end;
        }

        if ((encode !== false) && this.gpuEncode)
        {
            this.encode();
        }

        return this;
    },

    /**
     * Encode a data texture from the color ramp bands.
     *
     * This process runs automatically when `gpuEncode` is enabled
     * and the bands are set or updated with `setBands`.
     * If you modify the bands directly, you must call `encode` yourself.
     *
     * The data is encoded in texels as follows:
     *
     * Numbers are encoded in "RG.BA" form.
     * The number equals R * 255 + G + B / 255 + A / 255 / 255.
     *
     * - First 2 texels: start and end.
     *   - Start is the start of the first band.
     *   - End is the end of the last band.
     * - Next block of texels: binary symmetrical tree of band ranges,
     *   represented as the end value of the midpoint band.
     * - Final block of texels, starting at `dataTextureFirstBand`:
     *   the band data, in blocks of 3:
     *   - colorStart
     *   - colorEnd
     *   - colorSpace * 255 + interpolation + (middle / 2)
     *
     * The binary symmetrical tree breaks the bands list in half
     * with every node. It is intended to quickly find the band corresponding
     * to a given progress along the ramp.
     * For example, a ramp with 10 bands would store the ends in this order:
     *
     * `[ 7, 3, 11, 1, 5, 9, 13, 0, 2, 4, 6, 8, 10, 12, 14 ]`
     *
     * But because it doesn't have bands from index 10 and up, it's actually:
     *
     * `[ 7, 3, 9, 1, 5, 9, 9, 0, 2, 4, 6, 8, 9, 9, 9 ]`
     *
     * Note that, if you change the number of bands in the ramp,
     * `dataTexture` may no longer have the correct resolution.
     * It is not intended for display.
     *
     * @method Phaser.Display.ColorRamp#encode
     * @since 4.0.0
     */
    encode: function ()
    {
        var bandCount = this.bands.length;
        var bandTreeDepth = Math.ceil(Math.log2(bandCount));
        this.bandTreeDepth = bandTreeDepth;

        // Binary tree nodes necessary to hold all bands symmetrically
        var bandTreeSize = Math.pow(2, bandTreeDepth) - 1;
        var BYTES_FOR_START_END = 8; // Start, end
        var BYTES_PER_BRANCH = 4; // Split point
        var BYTES_PER_BAND = 12; // Color start, color end, interpolation mode + color mode + middle

        var dataSize =
            BYTES_FOR_START_END +
            BYTES_PER_BRANCH * bandTreeSize +
            BYTES_PER_BAND * bandCount;

        var width = dataSize / 4;
        var height = 1;
        if (width > 4096)
        {
            height = Math.ceil(width / 4096);
            width = 4096;
        }
        this.dataTextureResolution[0] = width;
        this.dataTextureResolution[1] = height;

        var data = new ArrayBuffer(width * height * 4);
        var u32 = new Uint32Array(data);
        var u8 = new Uint8Array(data);
        var index32 = 0;
        var FLOAT_FACTOR = 256 * 256; // Encode floating point numbers as integers.

        // Encode start and end as RG.BA
        u32[index32++] = Math.round(this.bands[0].start * FLOAT_FACTOR);
        u32[index32++] = Math.round(this.bands[this.bands.length - 1].end * FLOAT_FACTOR);

        // Encode tree nodes.
        // Each tree node is a split point in RG.BA form.
        for (var depth = 0; depth <= bandTreeDepth; depth++)
        {
            var maxBreadth = Math.pow(2, depth);
            for (var breadth = 1; breadth < maxBreadth; breadth += 2)
            {
                var bandIndex = Math.floor(bandTreeSize * breadth / maxBreadth);
                var band = this.bands[Math.min(bandIndex, bandCount - 1)];
                u32[index32++] = Math.round(band.end * FLOAT_FACTOR);
            }
        }

        // We are beginning the band encoding region.
        this.dataTextureFirstBand = index32;

        // Each band is encoded as colorStart, colorEnd,
        // and a composite value of colorMode, interpolationMode, middle.
        for (var i = 0; i < bandCount; i++)
        {
            band = this.bands[i];

            // Encode colors so they'll appear correct in the texture.
            var a = band.colorStart;
            var b = band.colorEnd;
            u32[index32++] = getTint(a.blueGL, a.greenGL, a.redGL, a.alphaGL);
            u32[index32++] = getTint(b.blueGL, b.greenGL, b.redGL, b.alphaGL);

            // Encode other data as a composite in RG.BA form.
            var colorSpace = band.colorSpace * 255;
            var interpolation = band.interpolation;
            var middle = band.middle / 2;
            u32[index32++] = FLOAT_FACTOR * (colorSpace + interpolation + middle);
        }

        if (!this.glTexture)
        {
            var textureWrapper = this.scene.renderer.createUint8ArrayTexture(u8, width, height, false, false);
            this.glTexture = textureWrapper;

            var textureKey = UUID();
            while (this.scene.textures.exists(textureKey))
            {
                textureKey = UUID();
            }

            this.dataTexture = this.scene.textures.addGLTexture(textureKey, textureWrapper);
        }
        else
        {
            var d = this.glTexture;
            d.update(u8, width, height, d.flipY, d.wrapS, d.wrapT, d.minFilter, d.magFilter, d.format);
        }
    },

    /**
     * Fix the fit of bands within this ColorRamp.
     *
     * This sets the start of each band to the end of the previous band,
     * ensuring that there are no gaps.
     *
     * Optionally, you can define start and end values to stretch the ramp
     * to some specific range, e.g. 0-1.
     *
     * By default, any band that is now 0 length will be removed.
     *
     * @method Phaser.Display.ColorRamp#fixFit
     * @since 4.0.0
     * @param {number} start - Override the start of the first band.
     * @param {number} end - Override the end of the last band.
     * @param {boolean} purgeZeroLength - Whether to discard bands that now have 0 size.
     * @param {boolean} encode - Whether to reencode the data texture.
     * @return {this} - This ColorRamp instance.
     */
    fixFit: function (start, end, purgeZeroLength, encode)
    {
        var bands = this.bands;
        if (bands.length === 0) { return this; }

        if (purgeZeroLength === undefined) { purgeZeroLength = true; }
        if (encode === undefined) { encode = true; }

        if (start !== undefined)
        {
            bands[0].start = start;
        }
        if (end !== undefined)
        {
            bands[bands.length - 1].end = end;
        }

        for (var i = 0; i < bands.length - 1; i++)
        {
            var band = bands[i];
            var bandNext = bands[i + 1];
            bandNext.start = band.end;
            if (bandNext.start > bandNext.end)
            {
                bandNext.end = bandNext.start;
            }
        }

        if (purgeZeroLength)
        {
            this.bands = bands.filter(function (band)
            {
                return band.start < band.end;
            });
        }

        if (encode)
        {
            this.encode();
        }

        return this;
    },

    /**
     * Split a band from this ramp into several bands, and insert them into the ramp.
     *
     * You can choose whether to "quantize" the bands, where each of them has
     * a flat color.
     *
     * @method Phaser.Display.ColorRamp#splitBand
     * @since 4.0.0
     * @param {number | Phaser.Display.ColorBand} band - The band to split, either an index on this ramp or the band instance. The band must be on this ramp.
     * @param {number} steps - The number of bands to create.
     * @param {boolean} [quantize=false] - Whether to quantize the bands to a single color.
     * @param {boolean} [encode=true] - Whether to rebuild the data texture.
     * @return {this} This ColorRamp instance.
     */
    splitBand: function (band, steps, quantize, encode)
    {
        if (steps === 0) { return this; }
        if (steps === undefined) { steps = 2; }
        if (encode === undefined) { encode = true; }
        var index = 0;
        if (typeof band === 'number')
        {
            index = band;
            band = this.bands[band];
        }
        else
        {
            index = this.bands.indexOf(band);
            if (index === -1) { return this; }
        }
        if (!band) { return this; }

        this.bands.splice(index, 1);

        for (var i = 0; i < steps; i++)
        {
            var low = i / steps;
            var high = (i + 1) / steps;
            if (quantize)
            {
                low = i / (steps - 1);
                high = (i + 1) / (steps - 1);
            }

            var newColorStart = band.getColor(low);
            var newColorEnd = band.getColor(high);
            if (quantize) { newColorEnd = newColorStart; }

            var newBand = new ColorBand({
                colorStart: [
                    newColorStart.r / 255,
                    newColorStart.g / 255,
                    newColorStart.b / 255,
                    newColorStart.a / 255
                ],
                colorEnd: [
                    newColorEnd.r / 255,
                    newColorEnd.g / 255,
                    newColorEnd.b / 255,
                    newColorEnd.a / 255
                ],
                start: Linear(band.start, band.end, low),
                end: Linear(band.start, band.end, high),
                middle: band.middle,
                interpolation: band.interpolation,
                colorSpace: band.colorSpace
            });
            this.bands.splice(index++, 0, newBand);
        }

        if (encode) { this.encode(); }

        return this;
    },

    /**
     * Get the color value at the given index within this ramp.
     *
     * If there is no band at that location, the color is transparent.
     *
     * @method Phaser.Display.ColorRamp#getColor
     * @param {number} index - Index of the color to get, from 0 (start) to 1 (end).
     * @return {Phaser.Types.Display.ColorObject} The color at that index.
     */
    getColor: function (index)
    {
        var band;
        for (var i = 0; i < this.bands.length; i++)
        {
            var b = this.bands[i];
            if (b.start <= index && b.end >= index)
            {
                band = b;
                break;
            }
        }
        if (!band)
        {
            return {
                r: 0,
                g: 0,
                b: 0,
                a: 0,
                color: 0x000000
            };
        }
        index = (index - band.start) / (band.end - band.start);
        return band.getColor(index);
    },

    /**
     * Destroy this ColorRamp.
     * If it has a data texture, destroy it.
     *
     * @method Phaser.Display.ColorRamp#destroy
     * @since 4.0.0
     */
    destroy: function ()
    {
        this.scene = null;
        if (this.dataTexture)
        {
            this.dataTexture.destroy();
        }
    }
});

module.exports = ColorRamp;
