/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2015 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
*
* TODO: Gradient generator
* TODO: Look at sfxr for audio gen
* TODO: Dither support
*
* @class Phaser.Create
* @constructor
* @param {Phaser.Game} game - Game reference to the currently running game.
 */
Phaser.Create = function (game) {

    /**
    * @property {Phaser.Game} game - A reference to the currently running Game.
    */
    this.game = game;

    this.bmd = game.make.bitmapData();

    this.canvas = this.bmd.canvas;
    this.ctx = this.bmd.context;

    // http://androidarts.com/palette/16pal.htm

    // { 0: '#000', 1: '#', 2: '#', 3: '#', 4: '#', 5: '#', 6: '#', 7: '#', 8: '#', 9: '#', A: '#', B: '#', C: '#', D: '#', E: '#', F: '#' }

    this.palettes = [
        { 0: '#000', 1: '#9D9D9D', 2: '#FFF', 3: '#BE2633', 4: '#E06F8B', 5: '#493C2B', 6: '#A46422', 7: '#EB8931', 8: '#F7E26B', 9: '#2F484E', A: '#44891A', B: '#A3CE27', C: '#1B2632', D: '#005784', E: '#31A2F2', F: '#B2DCEF' },
        { 0: '#000', 1: '#191028', 2: '#46af45', 3: '#a1d685', 4: '#453e78', 5: '#7664fe', 6: '#833129', 7: '#9ec2e8', 8: '#dc534b', 9: '#e18d79', A: '#d6b97b', B: '#e9d8a1', C: '#216c4b', D: '#d365c8', E: '#afaab9', F: '#f5f4eb' },
        { 0: '#000', 1: '#2234d1', 2: '#0c7e45', 3: '#44aacc', 4: '#8a3622', 5: '#5c2e78', 6: '#aa5c3d', 7: '#b5b5b5', 8: '#5e606e', 9: '#4c81fb', A: '#6cd947', B: '#7be2f9', C: '#eb8a60', D: '#e23d69', E: '#ffd93f', F: '#fff' },
        { 0: '#000', 1: '#fff', 2: '#8b4131', 3: '#7bbdc5', 4: '#8b41ac', 5: '#6aac41', 6: '#3931a4', 7: '#d5de73', 8: '#945a20', 9: '#5a4100', A: '#bd736a', B: '#525252', C: '#838383', D: '#acee8b', E: '#7b73de', F: '#acacac' },
        { 0: '#000', 1: '#191028', 2: '#46af45', 3: '#a1d685', 4: '#453e78', 5: '#7664fe', 6: '#833129', 7: '#9ec2e8', 8: '#dc534b', 9: '#e18d79', A: '#d6b97b', B: '#e9d8a1', C: '#216c4b', D: '#d365c8', E: '#afaab9', F: '#fff' }
    ];

};

Phaser.Create.PALETTE_ARNE = 0;
Phaser.Create.PALETTE_JMP = 1;
Phaser.Create.PALETTE_CGA = 2;
Phaser.Create.PALETTE_C64 = 3;
Phaser.Create.PALETTE_JAPANESE_MACHINE = 4;

Phaser.Create.prototype = {

    texture: function (key, data, pixelWidth, pixelHeight, palette) {

        if (typeof pixelWidth === 'undefined') { pixelWidth = 8; }
        if (typeof pixelHeight === 'undefined') { pixelHeight = pixelWidth; }
        if (typeof palette === 'undefined') { palette = 0; }

        var w = data[0].length * pixelWidth;
        var h = data.length * pixelHeight;

        this.bmd.resize(w, h);

        //  Draw it
        for (var y = 0; y < data.length; y++)
        {
            var row = data[y];

            for (var x = 0; x < row.length; x++)
            {
                var d = row[x];

                if (d !== '.' && d !== ' ')
                {
                    this.ctx.fillStyle = this.palettes[palette][d];
                    this.ctx.fillRect(x * pixelWidth, y * pixelHeight, pixelWidth, pixelHeight);
                }
            }
        }

        return this.bmd.generateTexture(key);

    },

    grid: function (key, width, height, cellWidth, cellHeight, color) {

        this.bmd.resize(width, height);

        this.ctx.fillStyle = color;

        for (var y = 0; y < height; y += cellHeight)
        {
            this.ctx.fillRect(0, y, width, 1);
        }

        for (var x = 0; x < width; x += cellWidth)
        {
            this.ctx.fillRect(x, 0, 1, height);
        }

        return this.bmd.generateTexture(key);

    }

};

Phaser.Create.prototype.constructor = Phaser.Create;

/* 
 * RIFFWAVE.js v0.03 - Audio encoder for HTML5 <audio> elements.
 * Copyleft 2011 by Pedro Ladaria <pedro.ladaria at Gmail dot com>
 *
 * Public Domain
 *
 * Changelog:
 *
 * 0.01 - First release
 * 0.02 - New faster base64 encoding
 * 0.03 - Support for 16bit samples
 *
 * Notes:
 *
 * 8 bit data is unsigned: 0..255
 * 16 bit data is signed: âˆ’32,768..32,767
 *
 */

/*
var FastBase64 = {

    chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encLookup: [],

    Init: function() {
        for (var i=0; i<4096; i++) {
            this.encLookup[i] = this.chars[i >> 6] + this.chars[i & 0x3F];
        }
    },

    Encode: function(src) {
        var len = src.length;
        var dst = '';
        var i = 0;
        while (len > 2) {
            n = (src[i] << 16) | (src[i+1]<<8) | src[i+2];
            dst+= this.encLookup[n >> 12] + this.encLookup[n & 0xFFF];
            len-= 3;
            i+= 3;
        }
        if (len > 0) {
            var n1= (src[i] & 0xFC) >> 2;
            var n2= (src[i] & 0x03) << 4;
            if (len > 1) n2 |= (src[++i] & 0xF0) >> 4;
            dst+= this.chars[n1];
            dst+= this.chars[n2];
            if (len == 2) {
                var n3= (src[i++] & 0x0F) << 2;
                n3 |= (src[i] & 0xC0) >> 6;
                dst+= this.chars[n3];
            }
            if (len == 1) dst+= '=';
            dst+= '=';
        }
        return dst;
    } // end Encode

}

FastBase64.Init();

var RIFFWAVE = function(data) {

    this.data = [];        // Array containing audio samples
    this.wav = [];         // Array containing the generated wave file
    this.dataURI = '';     // http://en.wikipedia.org/wiki/Data_URI_scheme

    this.header = {                         // OFFS SIZE NOTES
        chunkId      : [0x52,0x49,0x46,0x46], // 0    4    "RIFF" = 0x52494646
        chunkSize    : 0,                     // 4    4    36+SubChunk2Size = 4+(8+SubChunk1Size)+(8+SubChunk2Size)
        format       : [0x57,0x41,0x56,0x45], // 8    4    "WAVE" = 0x57415645
        subChunk1Id  : [0x66,0x6d,0x74,0x20], // 12   4    "fmt " = 0x666d7420
        subChunk1Size: 16,                    // 16   4    16 for PCM
        audioFormat  : 1,                     // 20   2    PCM = 1
        numChannels  : 1,                     // 22   2    Mono = 1, Stereo = 2...
        sampleRate   : 8000,                  // 24   4    8000, 44100...
        byteRate     : 0,                     // 28   4    SampleRate*NumChannels*BitsPerSample/8
        blockAlign   : 0,                     // 32   2    NumChannels*BitsPerSample/8
        bitsPerSample: 8,                     // 34   2    8 bits = 8, 16 bits = 16
        subChunk2Id  : [0x64,0x61,0x74,0x61], // 36   4    "data" = 0x64617461
        subChunk2Size: 0                      // 40   4    data size = NumSamples*NumChannels*BitsPerSample/8
    };

    function u32ToArray(i) {
        return [i&0xFF, (i>>8)&0xFF, (i>>16)&0xFF, (i>>24)&0xFF];
    }

    function u16ToArray(i) {
        return [i&0xFF, (i>>8)&0xFF];
    }

    function split16bitArray(data) {
        var r = [];
        var j = 0;
        var len = data.length;
        for (var i=0; i<len; i++) {
            r[j++] = data[i] & 0xFF;
            r[j++] = (data[i]>>8) & 0xFF;
        }
        return r;
    }

    this.Make = function(data) {
        if (data instanceof Array) this.data = data;
        this.header.blockAlign = (this.header.numChannels * this.header.bitsPerSample) >> 3;
        this.header.byteRate = this.header.blockAlign * this.sampleRate;
        this.header.subChunk2Size = this.data.length * (this.header.bitsPerSample >> 3);
        this.header.chunkSize = 36 + this.header.subChunk2Size;

        this.wav = this.header.chunkId.concat(
            u32ToArray(this.header.chunkSize),
            this.header.format,
            this.header.subChunk1Id,
            u32ToArray(this.header.subChunk1Size),
            u16ToArray(this.header.audioFormat),
            u16ToArray(this.header.numChannels),
            u32ToArray(this.header.sampleRate),
            u32ToArray(this.header.byteRate),
            u16ToArray(this.header.blockAlign),
            u16ToArray(this.header.bitsPerSample),    
            this.header.subChunk2Id,
            u32ToArray(this.header.subChunk2Size),
            (this.header.bitsPerSample == 16) ? split16bitArray(this.data) : this.data
        );
        this.dataURI = 'data:audio/wav;base64,'+FastBase64.Encode(this.wav);
    };

    if (data instanceof Array) this.Make(data);

}; // end RIFFWAVE
*/
