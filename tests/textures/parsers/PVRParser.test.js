var PVRParser = require('../../../src/textures/parsers/PVRParser');

//  Header layout (Uint32Array, 13 elements = 52 bytes):
//  [0]  version (0x03525650 = v3)
//  [1]  flags
//  [2]  pixel format low (v3 uses this when version matches)
//  [3]  pixel format high (v2 uses this when version does not match)
//  [4]  colour space (0=linear, 1=sRGB)
//  [5]  channel type
//  [6]  height
//  [7]  width
//  [8]  depth
//  [9]  num surfaces
//  [10] num faces
//  [11] mipmap count
//  [12] metadata size

var V3_VERSION = 0x03525650;
var HEADER_SIZE = 52;

//  Mirror the size functions from the source to compute required buffer sizes

function calcPVRTC2bppSize (w, h)
{
    return Math.max(w, 16) * Math.max(h, 8) / 4;
}

function calcPVRTC4bppSize (w, h)
{
    return Math.max(w, 8) * Math.max(h, 8) / 2;
}

function calcBPTCSize (w, h)
{
    return Math.ceil(w / 4) * Math.ceil(h / 4) * 16;
}

function calcDXTEtcSmallSize (w, h)
{
    return Math.floor((w + 3) / 4) * Math.floor((h + 3) / 4) * 8;
}

function calcDXTEtcAstcBigSize (w, h)
{
    return Math.floor((w + 3) / 4) * Math.floor((h + 3) / 4) * 16;
}

function calcASTCSize (bw, bh, w, h)
{
    return Math.floor((w + bw - 1) / bw) * Math.floor((h + bh - 1) / bh) * 16;
}

var SIZE_FUNCS = {
    0: calcPVRTC2bppSize,
    1: calcPVRTC2bppSize,
    2: calcPVRTC4bppSize,
    3: calcPVRTC4bppSize,
    6: calcDXTEtcSmallSize,
    7: calcDXTEtcSmallSize,
    8: calcDXTEtcAstcBigSize,
    9: calcDXTEtcAstcBigSize,
    11: calcDXTEtcAstcBigSize,
    14: calcBPTCSize,
    15: calcBPTCSize,
    22: calcDXTEtcSmallSize,
    23: calcDXTEtcAstcBigSize,
    24: calcDXTEtcSmallSize,
    25: calcDXTEtcSmallSize,
    26: calcDXTEtcAstcBigSize,
    27: calcDXTEtcAstcBigSize,
    28: function (w, h) { return calcASTCSize(5, 4, w, h); },
    29: function (w, h) { return calcASTCSize(5, 5, w, h); },
    30: function (w, h) { return calcASTCSize(6, 5, w, h); },
    31: function (w, h) { return calcASTCSize(6, 6, w, h); },
    32: function (w, h) { return calcASTCSize(8, 5, w, h); },
    33: function (w, h) { return calcASTCSize(8, 6, w, h); },
    34: function (w, h) { return calcASTCSize(8, 8, w, h); },
    35: function (w, h) { return calcASTCSize(10, 5, w, h); },
    36: function (w, h) { return calcASTCSize(10, 6, w, h); },
    37: function (w, h) { return calcASTCSize(10, 8, w, h); },
    38: function (w, h) { return calcASTCSize(10, 10, w, h); },
    39: function (w, h) { return calcASTCSize(12, 10, w, h); },
    40: function (w, h) { return calcASTCSize(12, 12, w, h); }
};

function calcTotalDataSize (pvrFormat, width, height, mipmapLevels)
{
    var sizeFunc = SIZE_FUNCS[pvrFormat];
    var total = 0;
    var lw = width;
    var lh = height;

    for (var i = 0; i < mipmapLevels; i++)
    {
        total += sizeFunc(lw, lh);
        lw = Math.max(1, lw >> 1);
        lh = Math.max(1, lh >> 1);
    }

    return total;
}

function createPVRBuffer (version, pvrFormat, colorSpace, width, height, mipmapLevels, metadataSize)
{
    metadataSize = metadataSize || 0;

    var dataSize = calcTotalDataSize(pvrFormat, width, height, mipmapLevels);
    var bufferSize = HEADER_SIZE + metadataSize + dataSize;

    var buffer = new ArrayBuffer(bufferSize);
    var header = new Uint32Array(buffer, 0, 13);

    header[0] = version;

    if (version === V3_VERSION)
    {
        header[2] = pvrFormat;
        header[3] = 0;
    }
    else
    {
        header[2] = 0;
        header[3] = pvrFormat;
    }

    header[4] = colorSpace;
    header[6] = height;
    header[7] = width;
    header[11] = mipmapLevels;
    header[12] = metadataSize;

    return buffer;
}

describe('Phaser.Textures.Parsers.PVRParser', function ()
{
    describe('return value structure', function ()
    {
        it('should return an object with mipmaps, width, height, internalFormat, compressed, generateMipmap', function ()
        {
            var buffer = createPVRBuffer(V3_VERSION, 2, 0, 8, 8, 1, 0);
            var result = PVRParser(buffer);

            expect(result).toHaveProperty('mipmaps');
            expect(result).toHaveProperty('width');
            expect(result).toHaveProperty('height');
            expect(result).toHaveProperty('internalFormat');
            expect(result).toHaveProperty('compressed');
            expect(result).toHaveProperty('generateMipmap');
        });

        it('should set compressed to true', function ()
        {
            var buffer = createPVRBuffer(V3_VERSION, 2, 0, 8, 8, 1, 0);
            var result = PVRParser(buffer);

            expect(result.compressed).toBe(true);
        });

        it('should set generateMipmap to false', function ()
        {
            var buffer = createPVRBuffer(V3_VERSION, 2, 0, 8, 8, 1, 0);
            var result = PVRParser(buffer);

            expect(result.generateMipmap).toBe(false);
        });
    });

    describe('width and height parsing', function ()
    {
        it('should correctly extract width from header[7]', function ()
        {
            var buffer = createPVRBuffer(V3_VERSION, 6, 0, 64, 32, 1, 0);
            var result = PVRParser(buffer);

            expect(result.width).toBe(64);
        });

        it('should correctly extract height from header[6]', function ()
        {
            var buffer = createPVRBuffer(V3_VERSION, 6, 0, 64, 32, 1, 0);
            var result = PVRParser(buffer);

            expect(result.height).toBe(32);
        });

        it('should handle a square texture', function ()
        {
            var buffer = createPVRBuffer(V3_VERSION, 6, 0, 32, 32, 1, 0);
            var result = PVRParser(buffer);

            expect(result.width).toBe(32);
            expect(result.height).toBe(32);
        });

        it('should return width and height independent of mipmap count', function ()
        {
            var buffer = createPVRBuffer(V3_VERSION, 6, 0, 8, 8, 3, 0);
            var result = PVRParser(buffer);

            expect(result.width).toBe(8);
            expect(result.height).toBe(8);
        });
    });

    describe('version handling', function ()
    {
        it('should use header[2] for pvrFormat when version matches 0x03525650 (v3)', function ()
        {
            //  Format 2 (PVRTC4bpp RGB) -> glFormat[0] = 0x8C00
            var buffer = createPVRBuffer(V3_VERSION, 2, 0, 8, 8, 1, 0);
            var result = PVRParser(buffer);

            expect(result.internalFormat).toBe(0x8C00);
        });

        it('should use header[3] for pvrFormat when version does not match (v2)', function ()
        {
            //  v2 file: header[2]=0, header[3]=2 -> format 2 -> glFormat[0] = 0x8C00
            var buffer = createPVRBuffer(0x00000000, 2, 0, 8, 8, 1, 0);
            var result = PVRParser(buffer);

            expect(result.internalFormat).toBe(0x8C00);
        });

        it('should produce different internalFormats for format 2 vs format 3 in v3 mode', function ()
        {
            //  Format 2 -> 0x8C00, Format 3 -> 0x8C02
            var buffer2 = createPVRBuffer(V3_VERSION, 2, 0, 8, 8, 1, 0);
            var buffer3 = createPVRBuffer(V3_VERSION, 3, 0, 8, 8, 1, 0);

            var result2 = PVRParser(buffer2);
            var result3 = PVRParser(buffer3);

            expect(result2.internalFormat).not.toBe(result3.internalFormat);
        });
    });

    describe('internalFormat selection', function ()
    {
        it('should select glFormat[0] when colorSpace is 0 (linear)', function ()
        {
            //  Format 7 glFormat = [0x83F0, 0x8C4C]
            var buffer = createPVRBuffer(V3_VERSION, 7, 0, 4, 4, 1, 0);
            var result = PVRParser(buffer);

            expect(result.internalFormat).toBe(0x83F0);
        });

        it('should select glFormat[1] when colorSpace is 1 (sRGB)', function ()
        {
            //  Format 7 glFormat = [0x83F0, 0x8C4C]
            var buffer = createPVRBuffer(V3_VERSION, 7, 1, 4, 4, 1, 0);
            var result = PVRParser(buffer);

            expect(result.internalFormat).toBe(0x8C4C);
        });

        it('should return correct internalFormat for PVRTC 2bpp RGB (format 0)', function ()
        {
            //  Format 0 glFormat = [0x8C01]
            var buffer = createPVRBuffer(V3_VERSION, 0, 0, 16, 8, 1, 0);
            var result = PVRParser(buffer);

            expect(result.internalFormat).toBe(0x8C01);
        });

        it('should return correct internalFormat for PVRTC 2bpp RGBA (format 1)', function ()
        {
            //  Format 1 glFormat = [0x8C03]
            var buffer = createPVRBuffer(V3_VERSION, 1, 0, 16, 8, 1, 0);
            var result = PVRParser(buffer);

            expect(result.internalFormat).toBe(0x8C03);
        });

        it('should return correct internalFormat for PVRTC 4bpp RGB (format 2)', function ()
        {
            //  Format 2 glFormat = [0x8C00]
            var buffer = createPVRBuffer(V3_VERSION, 2, 0, 8, 8, 1, 0);
            var result = PVRParser(buffer);

            expect(result.internalFormat).toBe(0x8C00);
        });

        it('should return correct internalFormat for PVRTC 4bpp RGBA (format 3)', function ()
        {
            //  Format 3 glFormat = [0x8C02]
            var buffer = createPVRBuffer(V3_VERSION, 3, 0, 8, 8, 1, 0);
            var result = PVRParser(buffer);

            expect(result.internalFormat).toBe(0x8C02);
        });

        it('should return correct internalFormat for ETC1 RGB (format 6)', function ()
        {
            //  Format 6 glFormat = [0x8D64]
            var buffer = createPVRBuffer(V3_VERSION, 6, 0, 4, 4, 1, 0);
            var result = PVRParser(buffer);

            expect(result.internalFormat).toBe(0x8D64);
        });

        it('should return correct internalFormat for DXT1 linear (format 7, colorSpace 0)', function ()
        {
            //  Format 7 glFormat = [0x83F0, 0x8C4C]
            var buffer = createPVRBuffer(V3_VERSION, 7, 0, 4, 4, 1, 0);
            var result = PVRParser(buffer);

            expect(result.internalFormat).toBe(0x83F0);
        });

        it('should return correct internalFormat for BPTC float (format 14, colorSpace 0)', function ()
        {
            //  Format 14 glFormat = [0x8E8E, 0x8E8F]
            var buffer = createPVRBuffer(V3_VERSION, 14, 0, 4, 4, 1, 0);
            var result = PVRParser(buffer);

            expect(result.internalFormat).toBe(0x8E8E);
        });

        it('should return correct internalFormat for BPTC float (format 14, colorSpace 1)', function ()
        {
            //  Format 14 glFormat = [0x8E8E, 0x8E8F]
            var buffer = createPVRBuffer(V3_VERSION, 14, 1, 4, 4, 1, 0);
            var result = PVRParser(buffer);

            expect(result.internalFormat).toBe(0x8E8F);
        });

        it('should return correct internalFormat for ASTC 4x4 linear (format 27, colorSpace 0)', function ()
        {
            //  Format 27 glFormat = [0x93B0, 0x93D0]
            var buffer = createPVRBuffer(V3_VERSION, 27, 0, 4, 4, 1, 0);
            var result = PVRParser(buffer);

            expect(result.internalFormat).toBe(0x93B0);
        });

        it('should return correct internalFormat for ASTC 4x4 sRGB (format 27, colorSpace 1)', function ()
        {
            //  Format 27 glFormat = [0x93B0, 0x93D0]
            var buffer = createPVRBuffer(V3_VERSION, 27, 1, 4, 4, 1, 0);
            var result = PVRParser(buffer);

            expect(result.internalFormat).toBe(0x93D0);
        });

        it('should return correct internalFormat for ASTC 8x8 (format 34)', function ()
        {
            //  Format 34 glFormat = [0x93B7, 0x93D7]
            var buffer = createPVRBuffer(V3_VERSION, 34, 0, 8, 8, 1, 0);
            var result = PVRParser(buffer);

            expect(result.internalFormat).toBe(0x93B7);
        });
    });

    describe('mipmap levels', function ()
    {
        it('should return mipmaps array with length 1 for a single mipmap level', function ()
        {
            var buffer = createPVRBuffer(V3_VERSION, 6, 0, 8, 8, 1, 0);
            var result = PVRParser(buffer);

            expect(result.mipmaps.length).toBe(1);
        });

        it('should return mipmaps array with length 3 for three mipmap levels', function ()
        {
            var buffer = createPVRBuffer(V3_VERSION, 6, 0, 8, 8, 3, 0);
            var result = PVRParser(buffer);

            expect(result.mipmaps.length).toBe(3);
        });

        it('each mipmap should have data, width, and height properties', function ()
        {
            var buffer = createPVRBuffer(V3_VERSION, 6, 0, 8, 8, 2, 0);
            var result = PVRParser(buffer);

            expect(result.mipmaps[0]).toHaveProperty('data');
            expect(result.mipmaps[0]).toHaveProperty('width');
            expect(result.mipmaps[0]).toHaveProperty('height');
            expect(result.mipmaps[1]).toHaveProperty('data');
            expect(result.mipmaps[1]).toHaveProperty('width');
            expect(result.mipmaps[1]).toHaveProperty('height');
        });

        it('mipmap[0] should have base width and height', function ()
        {
            var buffer = createPVRBuffer(V3_VERSION, 6, 0, 16, 8, 2, 0);
            var result = PVRParser(buffer);

            expect(result.mipmaps[0].width).toBe(16);
            expect(result.mipmaps[0].height).toBe(8);
        });

        it('mipmap dimensions should halve at each level', function ()
        {
            var buffer = createPVRBuffer(V3_VERSION, 6, 0, 8, 8, 3, 0);
            var result = PVRParser(buffer);

            expect(result.mipmaps[0].width).toBe(8);
            expect(result.mipmaps[0].height).toBe(8);
            expect(result.mipmaps[1].width).toBe(4);
            expect(result.mipmaps[1].height).toBe(4);
            expect(result.mipmaps[2].width).toBe(2);
            expect(result.mipmaps[2].height).toBe(2);
        });

        it('mipmap dimensions should not go below 1', function ()
        {
            var buffer = createPVRBuffer(V3_VERSION, 6, 0, 4, 4, 3, 0);
            var result = PVRParser(buffer);

            expect(result.mipmaps[0].width).toBe(4);
            expect(result.mipmaps[0].height).toBe(4);
            expect(result.mipmaps[1].width).toBe(2);
            expect(result.mipmaps[1].height).toBe(2);
            expect(result.mipmaps[2].width).toBe(1);
            expect(result.mipmaps[2].height).toBe(1);
        });

        it('mipmap data should be a Uint8Array', function ()
        {
            var buffer = createPVRBuffer(V3_VERSION, 6, 0, 4, 4, 1, 0);
            var result = PVRParser(buffer);

            expect(result.mipmaps[0].data).toBeInstanceOf(Uint8Array);
        });

        it('mipmap data length should equal the computed compressed size for format 6', function ()
        {
            //  DXTEtcSmallSize(4, 4) = floor(7/4)*floor(7/4)*8 = 1*1*8 = 8
            var buffer = createPVRBuffer(V3_VERSION, 6, 0, 4, 4, 1, 0);
            var result = PVRParser(buffer);

            expect(result.mipmaps[0].data.length).toBe(8);
        });

        it('mipmap data length should equal the computed compressed size for format 2', function ()
        {
            //  PVRTC4bppSize(8, 8) = max(8,8)*max(8,8)/2 = 32
            var buffer = createPVRBuffer(V3_VERSION, 2, 0, 8, 8, 1, 0);
            var result = PVRParser(buffer);

            expect(result.mipmaps[0].data.length).toBe(32);
        });

        it('consecutive mipmap data views should not overlap', function ()
        {
            var buffer = createPVRBuffer(V3_VERSION, 6, 0, 8, 8, 2, 0);
            var result = PVRParser(buffer);

            var m0 = result.mipmaps[0].data;
            var m1 = result.mipmaps[1].data;

            var end0 = m0.byteOffset + m0.byteLength;
            var start1 = m1.byteOffset;

            expect(end0).toBeLessThanOrEqual(start1);
        });
    });

    describe('data offset with metadata', function ()
    {
        it('should account for metadata size when computing data start offset', function ()
        {
            //  The byteOffset of mipmaps[0].data should differ by the metadata size
            var bufferNoMeta = createPVRBuffer(V3_VERSION, 6, 0, 4, 4, 1, 0);
            var bufferWithMeta = createPVRBuffer(V3_VERSION, 6, 0, 4, 4, 1, 16);

            var resultNoMeta = PVRParser(bufferNoMeta);
            var resultWithMeta = PVRParser(bufferWithMeta);

            var diff = resultWithMeta.mipmaps[0].data.byteOffset - resultNoMeta.mipmaps[0].data.byteOffset;

            expect(diff).toBe(16);
        });

        it('should handle zero metadata size', function ()
        {
            var buffer = createPVRBuffer(V3_VERSION, 6, 0, 4, 4, 1, 0);
            var result = PVRParser(buffer);

            //  dataOffset = 52 + 0 = 52
            expect(result.mipmaps[0].data.byteOffset).toBe(52);
        });
    });
});
