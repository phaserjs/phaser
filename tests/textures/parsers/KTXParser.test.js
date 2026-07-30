var KTXParser = require('../../../src/textures/parsers/KTXParser');

// KTX file identifier: 12 magic bytes
var KTX_IDENTIFIER = [ 0xab, 0x4b, 0x54, 0x58, 0x20, 0x31, 0x31, 0xbb, 0x0d, 0x0a, 0x1a, 0x0a ];

// Build a valid KTX ArrayBuffer for testing.
// Header layout (offsets are absolute in the buffer):
//   0-11:  file identifier
//  12-15:  endianness marker (0x04030201 = little-endian)
//  16-19:  glType        (must be 0 for compressed)
//  20-23:  glTypeSize
//  24-27:  glFormat
//  28-31:  internalFormat (head offset 16 = 4 * size)
//  32-35:  glBaseInternalFormat
//  36-39:  pixelWidth     (head offset 24 = 6 * size)
//  40-43:  pixelHeight    (head offset 28 = 7 * size)
//  44-47:  pixelDepth
//  48-51:  numberOfArrayElements
//  52-55:  numberOfFaces
//  56-59:  numberOfMipmapLevels (head offset 44 = 11 * size)
//  60-63:  bytesOfKeyValueData  (head offset 48 = 12 * size)
//  64+:    key-value data, then mipmap blocks
function buildKTXBuffer(options)
{
    var width = options.width !== undefined ? options.width : 4;
    var height = options.height !== undefined ? options.height : 4;
    var internalFormat = options.internalFormat !== undefined ? options.internalFormat : 0x83F0;
    var mipmapLevels = options.mipmapLevels !== undefined ? options.mipmapLevels : 1;
    var bytesOfKeyValueData = options.bytesOfKeyValueData !== undefined ? options.bytesOfKeyValueData : 0;
    var glType = options.glType !== undefined ? options.glType : 0;
    var littleEndian = options.littleEndian !== undefined ? options.littleEndian : true;
    var badIdentifier = options.badIdentifier || false;

    // Calculate level sizes (use width*height as a simple proxy for compressed data size).
    // Always generate at least 1 level of data so that a header value of 0 (which the
    // parser clamps to 1 via Math.max) still finds readable bytes in the buffer.
    var levelSizes = [];
    var lw = width;
    var lh = height;
    var i;
    var levelsToWrite = Math.max(1, mipmapLevels);

    for (i = 0; i < levelsToWrite; i++)
    {
        // Use at least 4 bytes so Int32Array alignment is satisfied
        var levelDataSize = Math.max(4, lw * lh);
        levelSizes.push(levelDataSize);
        lw = Math.max(1, lw >> 1);
        lh = Math.max(1, lh >> 1);
    }

    var mipmapByteTotal = 0;

    for (i = 0; i < levelSizes.length; i++)
    {
        mipmapByteTotal += 4 + levelSizes[i]; // 4-byte size field + data
    }

    var totalSize = 64 + bytesOfKeyValueData + mipmapByteTotal;
    var buffer = new ArrayBuffer(totalSize);
    var view = new DataView(buffer);
    var bytes = new Uint8Array(buffer);

    // Write identifier
    for (i = 0; i < 12; i++)
    {
        bytes[i] = badIdentifier ? 0x00 : KTX_IDENTIFIER[i];
    }

    // Write header fields using DataView at absolute offsets.
    // The endianness marker is always the value 0x04030201 stored in the file's
    // own byte order.  The parser reads it as little-endian and checks whether the
    // result equals 0x04030201: if the file is big-endian the bytes are reversed,
    // so the LE read returns 0x01020304 → parser correctly sets littleEndian=false.
    view.setUint32(12, 0x04030201, littleEndian);
    view.setUint32(16, glType, littleEndian);        // glType
    view.setUint32(20, 1, littleEndian);             // glTypeSize
    view.setUint32(24, 0, littleEndian);             // glFormat
    view.setUint32(28, internalFormat, littleEndian);// internalFormat
    view.setUint32(32, 0, littleEndian);             // glBaseInternalFormat
    view.setUint32(36, width, littleEndian);         // pixelWidth
    view.setUint32(40, height, littleEndian);        // pixelHeight
    view.setUint32(44, 0, littleEndian);             // pixelDepth
    view.setUint32(48, 0, littleEndian);             // numberOfArrayElements
    view.setUint32(52, 1, littleEndian);             // numberOfFaces
    view.setUint32(56, mipmapLevels, littleEndian);  // numberOfMipmapLevels
    view.setUint32(60, bytesOfKeyValueData, littleEndian); // bytesOfKeyValueData

    // Write mipmap blocks (key-value data is left as zeroes)
    var offset = 64 + bytesOfKeyValueData;

    for (i = 0; i < levelSizes.length; i++)
    {
        // The KTX parser reads levelSize via native Int32Array (always little-endian
        // on x86), so we must always write the size field in little-endian regardless
        // of the KTX endianness flag stored in the header.
        view.setInt32(offset, levelSizes[i], true);
        offset += 4;

        // Fill level data with a recognisable byte pattern
        for (var b = 0; b < levelSizes[i]; b++)
        {
            bytes[offset + b] = (i + 1) & 0xff;
        }

        offset += levelSizes[i];
    }

    return buffer;
}

describe('Phaser.Textures.Parsers.KTXParser', function ()
{
    beforeEach(function ()
    {
        vi.spyOn(console, 'warn').mockImplementation(function () {});
    });

    afterEach(function ()
    {
        vi.restoreAllMocks();
    });

    // -------------------------------------------------------------------------
    // File identifier validation
    // -------------------------------------------------------------------------

    it('should return undefined when the file identifier is invalid', function ()
    {
        var buffer = buildKTXBuffer({ badIdentifier: true });
        var result = KTXParser(buffer);

        expect(result).toBeUndefined();
    });

    it('should warn when the file identifier is invalid', function ()
    {
        var buffer = buildKTXBuffer({ badIdentifier: true });
        KTXParser(buffer);

        expect(console.warn).toHaveBeenCalledWith('KTXParser - Invalid file format');
    });

    it('should return undefined when only the first identifier byte is wrong', function ()
    {
        var buffer = buildKTXBuffer({});
        var bytes = new Uint8Array(buffer);
        bytes[0] = 0x00;
        var result = KTXParser(buffer);

        expect(result).toBeUndefined();
    });

    it('should return undefined when only the last identifier byte is wrong', function ()
    {
        var buffer = buildKTXBuffer({});
        var bytes = new Uint8Array(buffer);
        bytes[11] = 0x00;
        var result = KTXParser(buffer);

        expect(result).toBeUndefined();
    });

    // -------------------------------------------------------------------------
    // Compressed-only validation
    // -------------------------------------------------------------------------

    it('should return undefined when glType is non-zero (uncompressed format)', function ()
    {
        var buffer = buildKTXBuffer({ glType: 1 });
        var result = KTXParser(buffer);

        expect(result).toBeUndefined();
    });

    it('should warn when glType is non-zero', function ()
    {
        var buffer = buildKTXBuffer({ glType: 5 });
        KTXParser(buffer);

        expect(console.warn).toHaveBeenCalledWith('KTXParser - Only compressed formats supported');
    });

    // -------------------------------------------------------------------------
    // Successful parse — return structure
    // -------------------------------------------------------------------------

    it('should return an object with the expected shape for a valid KTX buffer', function ()
    {
        var buffer = buildKTXBuffer({ width: 4, height: 4 });
        var result = KTXParser(buffer);

        expect(result).toBeDefined();
        expect(typeof result).toBe('object');
        expect(Array.isArray(result.mipmaps)).toBe(true);
        expect(typeof result.width).toBe('number');
        expect(typeof result.height).toBe('number');
        expect(typeof result.internalFormat).toBe('number');
        expect(typeof result.compressed).toBe('boolean');
        expect(typeof result.generateMipmap).toBe('boolean');
    });

    it('should set compressed to true', function ()
    {
        var buffer = buildKTXBuffer({ width: 4, height: 4 });
        var result = KTXParser(buffer);

        expect(result.compressed).toBe(true);
    });

    it('should set generateMipmap to false', function ()
    {
        var buffer = buildKTXBuffer({ width: 4, height: 4 });
        var result = KTXParser(buffer);

        expect(result.generateMipmap).toBe(false);
    });

    // -------------------------------------------------------------------------
    // Dimensions
    // -------------------------------------------------------------------------

    it('should parse width and height correctly', function ()
    {
        var buffer = buildKTXBuffer({ width: 128, height: 64 });
        var result = KTXParser(buffer);

        expect(result.width).toBe(128);
        expect(result.height).toBe(64);
    });

    it('should parse a 1x1 texture correctly', function ()
    {
        var buffer = buildKTXBuffer({ width: 1, height: 1 });
        var result = KTXParser(buffer);

        expect(result.width).toBe(1);
        expect(result.height).toBe(1);
    });

    it('should parse a non-square texture correctly', function ()
    {
        var buffer = buildKTXBuffer({ width: 256, height: 512 });
        var result = KTXParser(buffer);

        expect(result.width).toBe(256);
        expect(result.height).toBe(512);
    });

    // -------------------------------------------------------------------------
    // Internal format
    // -------------------------------------------------------------------------

    it('should parse internalFormat correctly', function ()
    {
        var buffer = buildKTXBuffer({ internalFormat: 0x83F0 });
        var result = KTXParser(buffer);

        expect(result.internalFormat).toBe(0x83F0);
    });

    it('should parse a different internalFormat value correctly', function ()
    {
        var buffer = buildKTXBuffer({ internalFormat: 0x9274 });
        var result = KTXParser(buffer);

        expect(result.internalFormat).toBe(0x9274);
    });

    // -------------------------------------------------------------------------
    // Mipmap levels
    // -------------------------------------------------------------------------

    it('should return a single mipmap when mipmapLevels is 1', function ()
    {
        var buffer = buildKTXBuffer({ width: 4, height: 4, mipmapLevels: 1 });
        var result = KTXParser(buffer);

        expect(result.mipmaps.length).toBe(1);
    });

    it('should return multiple mipmaps when mipmapLevels is greater than 1', function ()
    {
        var buffer = buildKTXBuffer({ width: 8, height: 8, mipmapLevels: 4 });
        var result = KTXParser(buffer);

        expect(result.mipmaps.length).toBe(4);
    });

    it('should clamp mipmapLevels to at least 1 when header value is 0', function ()
    {
        var buffer = buildKTXBuffer({ width: 4, height: 4, mipmapLevels: 0 });
        // buildKTXBuffer writes 0 for the level count; parser does Math.max(1, ...)
        var result = KTXParser(buffer);

        expect(result.mipmaps.length).toBe(1);
    });

    it('should give each mipmap a data property that is a Uint8Array', function ()
    {
        var buffer = buildKTXBuffer({ width: 4, height: 4, mipmapLevels: 3 });
        var result = KTXParser(buffer);

        for (var i = 0; i < result.mipmaps.length; i++)
        {
            expect(result.mipmaps[i].data).toBeInstanceOf(Uint8Array);
        }
    });

    it('should give the first mipmap the full image dimensions', function ()
    {
        var buffer = buildKTXBuffer({ width: 8, height: 8, mipmapLevels: 4 });
        var result = KTXParser(buffer);

        expect(result.mipmaps[0].width).toBe(8);
        expect(result.mipmaps[0].height).toBe(8);
    });

    it('should halve mipmap dimensions at each level', function ()
    {
        var buffer = buildKTXBuffer({ width: 8, height: 8, mipmapLevels: 4 });
        var result = KTXParser(buffer);

        expect(result.mipmaps[0].width).toBe(8);
        expect(result.mipmaps[0].height).toBe(8);
        expect(result.mipmaps[1].width).toBe(4);
        expect(result.mipmaps[1].height).toBe(4);
        expect(result.mipmaps[2].width).toBe(2);
        expect(result.mipmaps[2].height).toBe(2);
        expect(result.mipmaps[3].width).toBe(1);
        expect(result.mipmaps[3].height).toBe(1);
    });

    it('should not let mipmap dimensions fall below 1', function ()
    {
        // 1x1 with 3 declared mipmap levels — dimensions must stay at 1
        var buffer = buildKTXBuffer({ width: 1, height: 1, mipmapLevels: 3 });
        var result = KTXParser(buffer);

        for (var i = 0; i < result.mipmaps.length; i++)
        {
            expect(result.mipmaps[i].width).toBeGreaterThanOrEqual(1);
            expect(result.mipmaps[i].height).toBeGreaterThanOrEqual(1);
        }
    });

    it('should not let mipmap dimensions fall below 1 for asymmetric textures', function ()
    {
        var buffer = buildKTXBuffer({ width: 2, height: 4, mipmapLevels: 3 });
        var result = KTXParser(buffer);

        expect(result.mipmaps[2].width).toBe(1);
        expect(result.mipmaps[2].height).toBe(1);
    });

    // -------------------------------------------------------------------------
    // Endianness
    // -------------------------------------------------------------------------

    it('should parse a big-endian KTX file correctly', function ()
    {
        var buffer = buildKTXBuffer({ width: 4, height: 4, littleEndian: false, internalFormat: 0x8C00 });
        var result = KTXParser(buffer);

        expect(result.width).toBe(4);
        expect(result.height).toBe(4);
        expect(result.internalFormat).toBe(0x8C00);
    });

    // -------------------------------------------------------------------------
    // bytesOfKeyValueData offset handling
    // -------------------------------------------------------------------------

    it('should correctly skip key-value data before reading mipmaps', function ()
    {
        // 8 bytes of extra key-value data (must be a multiple of 4 for alignment)
        var buffer = buildKTXBuffer({ width: 4, height: 4, bytesOfKeyValueData: 8 });
        var result = KTXParser(buffer);

        expect(result).toBeDefined();
        expect(result.mipmaps.length).toBe(1);
        expect(result.mipmaps[0].data).toBeInstanceOf(Uint8Array);
    });

    // -------------------------------------------------------------------------
    // Mipmap data content
    // -------------------------------------------------------------------------

    it('should expose mipmap data that reads back from the original buffer', function ()
    {
        var buffer = buildKTXBuffer({ width: 4, height: 4, mipmapLevels: 1 });
        var result = KTXParser(buffer);

        // buildKTXBuffer fills level data with (levelIndex + 1) & 0xff = 1
        expect(result.mipmaps[0].data[0]).toBe(1);
    });

    it('should expose distinct mipmap data for each level', function ()
    {
        var buffer = buildKTXBuffer({ width: 8, height: 8, mipmapLevels: 2 });
        var result = KTXParser(buffer);

        // Level 0 bytes are filled with 1, level 1 bytes with 2
        expect(result.mipmaps[0].data[0]).toBe(1);
        expect(result.mipmaps[1].data[0]).toBe(2);
    });
});
