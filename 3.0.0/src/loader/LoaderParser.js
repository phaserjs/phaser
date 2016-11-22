/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Phaser.LoaderParser parses data objects from Phaser.Loader that need more preparation before they can be inserted into the Cache.
*
* @class Phaser.LoaderParser
*/
Phaser.LoaderParser = {

    /**
    * Alias for xmlBitmapFont, for backwards compatibility.
    * 
    * @method Phaser.LoaderParser.bitmapFont
    * @param {object} xml - XML data you want to parse.
    * @param {PIXI.BaseTexture} baseTexture - The BaseTexture this font uses.
    * @param {number} [xSpacing=0] - Additional horizontal spacing between the characters.
    * @param {number} [ySpacing=0] - Additional vertical spacing between the characters.
    * @return {object} The parsed Bitmap Font data.
    */
    bitmapFont: function (xml, baseTexture, xSpacing, ySpacing) {

        return this.xmlBitmapFont(xml, baseTexture, xSpacing, ySpacing);

    },

    /**
    * Parse a Bitmap Font from an XML file.
    *
    * @method Phaser.LoaderParser.xmlBitmapFont
    * @param {object} xml - XML data you want to parse.
    * @param {PIXI.BaseTexture} baseTexture - The BaseTexture this font uses.
    * @param {number} [xSpacing=0] - Additional horizontal spacing between the characters.
    * @param {number} [ySpacing=0] - Additional vertical spacing between the characters.
    * @param {Phaser.Frame} [frame] - Optional Frame, if this font is embedded in a texture atlas.
    * @return {object} The parsed Bitmap Font data.
    */
    xmlBitmapFont: function (xml, baseTexture, xSpacing, ySpacing, frame) {

        var data = {};
        var info = xml.getElementsByTagName('info')[0];
        var common = xml.getElementsByTagName('common')[0];

        data.font = info.getAttribute('face');
        data.size = parseInt(info.getAttribute('size'), 10);
        data.lineHeight = parseInt(common.getAttribute('lineHeight'), 10) + ySpacing;
        data.chars = {};

        var letters = xml.getElementsByTagName('char');

        var x = (frame) ? frame.x : 0;
        var y = (frame) ? frame.y : 0;

        for (var i = 0; i < letters.length; i++)
        {
            var charCode = parseInt(letters[i].getAttribute('id'), 10);

            data.chars[charCode] = {
                x: x + parseInt(letters[i].getAttribute('x'), 10),
                y: y + parseInt(letters[i].getAttribute('y'), 10),
                width: parseInt(letters[i].getAttribute('width'), 10),
                height: parseInt(letters[i].getAttribute('height'), 10),
                xOffset: parseInt(letters[i].getAttribute('xoffset'), 10),
                yOffset: parseInt(letters[i].getAttribute('yoffset'), 10),
                xAdvance: parseInt(letters[i].getAttribute('xadvance'), 10) + xSpacing,
                kerning: {}
            };
        }

        var kernings = xml.getElementsByTagName('kerning');

        for (i = 0; i < kernings.length; i++)
        {
            var first = parseInt(kernings[i].getAttribute('first'), 10);
            var second = parseInt(kernings[i].getAttribute('second'), 10);
            var amount = parseInt(kernings[i].getAttribute('amount'), 10);

            data.chars[second].kerning[first] = amount;
        }

        return this.finalizeBitmapFont(baseTexture, data);

    },

    /**
    * Parse a Bitmap Font from a JSON file.
    *
    * @method Phaser.LoaderParser.jsonBitmapFont
    * @param {object} json - JSON data you want to parse.
    * @param {PIXI.BaseTexture} baseTexture - The BaseTexture this font uses.
    * @param {number} [xSpacing=0] - Additional horizontal spacing between the characters.
    * @param {number} [ySpacing=0] - Additional vertical spacing between the characters.
    * @param {Phaser.Frame} [frame] - Optional Frame, if this font is embedded in a texture atlas.
    * @return {object} The parsed Bitmap Font data.
    */
    jsonBitmapFont: function (json, baseTexture, xSpacing, ySpacing, frame) {

        var data = {
            font: json.font.info._face,
            size: parseInt(json.font.info._size, 10),
            lineHeight: parseInt(json.font.common._lineHeight, 10) + ySpacing,
            chars: {}
        };

        var x = (frame) ? frame.x : 0;
        var y = (frame) ? frame.y : 0;

        json.font.chars["char"].forEach(

            function parseChar(letter) {

                var charCode = parseInt(letter._id, 10);

                data.chars[charCode] = {
                    x: x + parseInt(letter._x, 10),
                    y: y + parseInt(letter._y, 10),
                    width: parseInt(letter._width, 10),
                    height: parseInt(letter._height, 10),
                    xOffset: parseInt(letter._xoffset, 10),
                    yOffset: parseInt(letter._yoffset, 10),
                    xAdvance: parseInt(letter._xadvance, 10) + xSpacing,
                    kerning: {}
                };
            }

        );

        if (json.font.kernings && json.font.kernings.kerning)
        {
            json.font.kernings.kerning.forEach(

                function parseKerning(kerning) {

                    data.chars[kerning._second].kerning[kerning._first] = parseInt(kerning._amount, 10);

                }

            );
        }

        return this.finalizeBitmapFont(baseTexture, data);

    },

    /**
    * Finalize Bitmap Font parsing.
    *
    * @method Phaser.LoaderParser.finalizeBitmapFont
    * @private
    * @param {PIXI.BaseTexture} baseTexture - The BaseTexture this font uses.
    * @param {object} bitmapFontData - Pre-parsed bitmap font data.
    * @return {object} The parsed Bitmap Font data.
    */
    finalizeBitmapFont: function (baseTexture, bitmapFontData) {

        Object.keys(bitmapFontData.chars).forEach(

            function addTexture(charCode) {

                var letter = bitmapFontData.chars[charCode];

                letter.texture = new PIXI.Texture(baseTexture, new Phaser.Rectangle(letter.x, letter.y, letter.width, letter.height));

            }

        );

        return bitmapFontData;

    },

    /**
    * Extract PVR header from loaded binary
    *
    * @method Phaser.LoaderParser.pvr
    * @param {ArrayBuffer} arrayBuffer
    * @return {object} The parsed PVR file including texture data.
    */
    pvr: function (arrayBuffer) {

        // Reference: http://cdn.imgtec.com/sdk-documentation/PVR+File+Format.Specification.pdf
        // PVR 3 header structure
        // ---------------------------------------
        // address: 0, size: 4 bytes version
        // address: 4, size: 4 bytes flags
        // address: 8, size: 8 bytes pixel format
        // address: 16, size: 4 bytes color space
        // address: 20, size: 4 bytes channel type
        // address: 24, size: 4 bytes height
        // address: 28, size: 4 bytes width
        // address: 32, size: 4 bytes depth
        // address: 36, size: 4 bytes number of surfaces
        // address: 40, size: 4 bytes number of faces
        // address: 44, size: 4 bytes number of mipmaps
        // address: 48, size: 4 bytes meta data size
        // ---------------------------------------
        var uintArray = new Uint32Array(arrayBuffer.slice(0, 52)),
            byteArray = new Uint8Array(arrayBuffer),
            pvrHeader = null,
            pixelFormat = (uintArray[3] << 32 | uintArray[2]),
            compressionAlgorithm,
            glExtensionFormat = 0;

        if (uintArray[0] === 0x03525650 &&
            [ // Validate WebGL Pixel Format
                0, 1, 2, 3,
                6, 7, 9, 11
            ].indexOf(pixelFormat) >= 0
        ) {
            if (pixelFormat >= 0 && pixelFormat <= 3) {
                compressionAlgorithm = 'PVRTC';
            } else if (pixelFormat >= 7 && pixelFormat <= 11) {
                compressionAlgorithm = 'S3TC';
            } else if (pixelFormat === 6) {
                compressionAlgorithm = 'ETC1';
            }

            switch (pixelFormat) {
                case 0:
                    glExtensionFormat = 0x8C01;
                    break;
                case 1:
                    glExtensionFormat = 0x8C03;
                    break;
                case 2:
                    glExtensionFormat = 0x8C00;
                    break;
                case 3:
                    glExtensionFormat = 0x8C02;
                    break;
                case 6:
                    glExtensionFormat = 0x8D64;
                    break;
                case 7:
                    glExtensionFormat = 0x83F1;
                    break;
                case 9:
                    glExtensionFormat = 0x83F2;
                    break;
                case 11:
                    glExtensionFormat = 0x83F3;
                    break;
                default:
                    glExtensionFormat = -1;
            }

            pvrHeader = {
                complete: true,
                fileFormat: 'PVR',
                compressionAlgorithm: compressionAlgorithm,
                flags: uintArray[1],
                pixelFormat: pixelFormat,
                colorSpace: uintArray[4],
                channelType: uintArray[5],
                height: uintArray[6],
                width: uintArray[7],
                depth: uintArray[8],
                numberOfSurfaces: uintArray[9],
                numberOfFaces: uintArray[10],
                numberOfMipmaps: uintArray[11],
                metaDataSize: uintArray[12],
                textureData: byteArray.subarray(52 + uintArray[12], byteArray.byteLength),
                glExtensionFormat: glExtensionFormat
            };
        }

        return pvrHeader;

    },

    /**
    * Extract DDS header from loaded binary
    *
    * @method Phaser.LoaderParser.dds
    * @param {ArrayBuffer} arrayBuffer
    * @return {object} The parsed DDS file including texture data.
    */
    dds: function (arrayBuffer) {

        // Reference at: https://msdn.microsoft.com/en-us/library/windows/desktop/bb943982(v=vs.85).aspx
        // DDS header structure
        // ---------------------------------------
        // address: 0, size: 4 bytes Identifier 'DDS '
        // address: 4, size: 4 bytes size
        // address: 8, size: 4 bytes flags
        // address: 12, size: 4 bytes height
        // address: 16, size: 4 bytes width
        // address: 20, size: 4 bytes pitch or linear size
        // address: 24, size: 4 bytes depth
        // address: 28, size: 4 bytes mipmap count
        // address: 32, size: 44 bytes reserved space 1
        // address: 76, size: 4 pixel format size
        // address: 80, size: 4 pixel format flag
        // address: 84, size: 4 pixel format four CC
        // address: 88, size: 4 pixel format bit count
        // address: 92, size: 4 pixel format R bit mask
        // address: 96, size: 4 pixel format G bit mask
        // address: 100, size: 4 pixel format B bit mask
        // address: 104, size: 4 pixel format A bit mask
        // address: 108, size: 4 caps 1
        // address: 112, size: 4 caps 2
        // address: 116, size: 4 caps 3
        // address: 120, size: 4 caps 4
        // address: 124, size: 4 reserved 2
        // -- DXT10 extension
        // address: 130, size: 4 DXGI Format
        // address: 134, size: 4 resource dimension
        // address: 138, size: 4 misc flag
        // address: 142, size: 4 array size
        // address: 146, size: 4 misc flag 2
        // ---------------------------------------
        var byteArray = new Uint8Array(arrayBuffer),
            uintArray = new Uint32Array(arrayBuffer),
            ddsHeader = null;

        if (byteArray[0] === 0x44 &&
            byteArray[1] === 0x44 &&
            byteArray[2] === 0x53 &&
            byteArray[3] === 0x20) {
            ddsHeader = {
                complete: true,
                fileFormat: 'DDS',
                compressionAlgorithm: 'S3TC',
                size: uintArray[1],
                flags: uintArray[2],
                height: uintArray[3],
                width: uintArray[4],
                pitch: uintArray[5],
                depth: uintArray[6],
                mipmapCount: uintArray[7],
                formatSize: uintArray[19],
                formatFlag: uintArray[19],
                formatFourCC: [
                    String.fromCharCode(byteArray[84]),
                    String.fromCharCode(byteArray[85]),
                    String.fromCharCode(byteArray[86]),
                    String.fromCharCode(byteArray[87])
                ].join(''),
                formatBitCount: uintArray[21],
                formatRBitMask: uintArray[22],
                formatGBitMask: uintArray[23],
                formatBBitMask: uintArray[24],
                formatABitMask: uintArray[25],
                caps1: uintArray[26],
                caps2: uintArray[27],
                caps3: uintArray[28],
                caps4: uintArray[29],
                reserved2: uintArray[30],
                DXGIFormat: null,
                resourceDimension: null,
                miscFlag: null,
                arraySize: null,
                textureData: byteArray.subarray(uintArray[1] + 4, byteArray.byteLength)
            };
            if (ddsHeader.formatFourCC === 'DX10') {
                ddsHeader.DXGIFormat = uintArray[31];
                ddsHeader.resourceDimension = uintArray[32];
                ddsHeader.miscFlag = uintArray[33];
                ddsHeader.arraySize = uintArray[34];
                ddsHeader.miscFlag = uintArray[35];
            }
        }

        return ddsHeader;

    },

    /**
    * Extract KTX header from loaded binary
    *
    * @method Phaser.LoaderParser.ktx
    * @param {ArrayBuffer} arrayBuffer
    * @return {object} The parsed KTX file including texture data.
    */
    ktx: function (arrayBuffer) {

        // Reference: https://www.khronos.org/opengles/sdk/tools/KTX/file_format_spec/
        // KTX header structure
        // ---------------------------------------
        // address: 0, size 12 bytes: Identifier '«KTX 11»\r\n\x1A\n'
        // address: 12, size 4 bytes: endianness
        // address: 16, size 4 bytes: GL type
        // address: 20, size 4 bytes: GL type size
        // address: 24, size 4 bytes: GL format
        // address: 28, size 4 bytes: GL internal format
        // address: 32, size 4 bytes: GL base internal format
        // address: 36, size 4 bytes: pixel width
        // address: 40, size 4 bytes: pixel height
        // address: 44, size 4 bytes: pixel depth
        // address: 48, size 4 bytes: number of array elements
        // address: 52, size 4 bytes: number of faces
        // address: 56, size 4 bytes: number of mipmap levels
        // address: 60, size 4 bytes: bytes of key value data
        // address: 64, size 4 bytes: key and value bytes size
        // address: X, size 1 byte : key and value
        // address: X, size 1 byte : value padding
        // address: X, size 4 byte : image size
        // ---------------------------------------
        var byteArray = new Uint8Array(arrayBuffer),
            uintArray = new Uint32Array(arrayBuffer),
            ktxHeader = null,
            imageSizeOffset = 16 + (uintArray[15] / 4) | 0,
            imageSize = uintArray[imageSizeOffset],
            glInternalFormat = uintArray[7],
            compressionAlgorithm = 0;

        if (byteArray[0] === 0xAB && byteArray[1] === 0x4B &&
            byteArray[2] === 0x54 && byteArray[3] === 0x58 &&
            byteArray[4] === 0x20 && byteArray[5] === 0x31 &&
            byteArray[6] === 0x31 && byteArray[7] === 0xBB &&
            byteArray[8] === 0x0D && byteArray[9] === 0x0A &&
            byteArray[10] === 0x1A && byteArray[11] === 0x0A &&
            //Check if internal GL format is supported by WebGL
            [
                // ETC1
                0x8D64,
                // PVRTC 
                0x8C00, 0x8C01, 0x8C02, 0x8C03, 
                // DXTC | S3TC
                0x83F0, 0x83F1, 0x83F2, 0x83F3
            ].indexOf(glInternalFormat) >= 0) {
            switch (glInternalFormat) {
                case 0x8D64:
                    compressionAlgorithm = 'ETC1';
                    break;
                case 0x8C00:
                case 0x8C01:
                case 0x8C02:
                case 0x8C03:
                    compressionAlgorithm = 'PVRTC';
                    break;
                case 0x83F0:
                case 0x83F1:
                case 0x83F2:
                case 0x83F3:
                    compressionAlgorithm = 'S3TC';
                    break;
            }

            ktxHeader = {
                complete: true,
                fileFormat: 'KTX',
                compressionAlgorithm: compressionAlgorithm,
                endianness: uintArray[3],
                glType: uintArray[4],
                glTypeSize: uintArray[5],
                glFormat: uintArray[6],
                glInternalFormat: uintArray[7],
                glBaseInternalFormat: uintArray[8],
                width: uintArray[9],
                height: uintArray[10],
                pixelDepth: uintArray[11],
                numberOfArrayElements: uintArray[12],
                numberOfFaces: uintArray[13],
                numberOfMipmapLevels: uintArray[14],
                bytesOfKeyValueData: uintArray[15],
                keyAndValueByteSize: uintArray[16],
                imageSize: imageSize,
                textureData: byteArray.subarray((imageSizeOffset + 1) * 4, imageSize + 100)
            };
        }

        return ktxHeader;

    },

    /**
    * Extract PKM header from loaded binary
    *
    * @method Phaser.LoaderParser.pkm
    * @param {ArrayBuffer} arrayBuffer
    * @return {object} The parsed PKM file including texture data.
    */
    pkm: function (arrayBuffer) {

        // PKM header structure
        // ---------------------------------------
        // address: 0, size 4 bytes: for 'PKM '
        // address: 4, size 2 bytes: for version
        // address: 6, size 2 bytes: for type
        // address: 8, size 2 bytes: for extended width
        // address: 10, size 2 bytes: for extended height
        // address: 12, size 2 bytes: for original width
        // address: 14, size 2 bytes: for original height
        // address: 16, texture data
        // ---------------------------------------
        var byteArray = new Uint8Array(arrayBuffer),
            pkmHeader = null;

        if (byteArray[0] === 0x50 &&
            byteArray[1] === 0x4B &&
            byteArray[2] === 0x4D &&
            byteArray[3] === 0x20) {

            pkmHeader = {
                complete: true,
                fileFormat: 'PKM',
                compressionAlgorithm: 'ETC1',
                format: ((byteArray[6] << 8 | byteArray[7])) & 0xFFFF,
                width: ((byteArray[8] << 8 | byteArray[9])) & 0xFFFF,
                height: ((byteArray[10] << 8 | byteArray[11])) & 0xFFFF,
                originalWidth: ((byteArray[12] << 8 | byteArray[13])) & 0xFFFF,
                originalHeight: ((byteArray[14] << 8 | byteArray[15])) & 0xFFFF,
                textureData: byteArray.subarray(16, byteArray.length)
            };
        }

        return pkmHeader;

    }

};
