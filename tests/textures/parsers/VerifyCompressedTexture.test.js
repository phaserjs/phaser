var verifyCompressedTexture = require('../../../src/textures/parsers/VerifyCompressedTexture');

describe('Phaser.Textures.Parsers.verifyCompressedTexture', function ()
{
    // Internal format constants
    var COMPRESSED_RGB8_ETC2 = 0x9274;        // checkAlways
    var COMPRESSED_RGBA_ASTC_4x4_KHR = 0x93B0; // checkAlways
    var COMPRESSED_RGB_ETC1_WEBGL = 0x8D64;   // checkAlways
    var COMPRESSED_RGBA_BPTC_UNORM_EXT = 0x8E8C; // check4x4
    var COMPRESSED_RED_RGTC1 = 0x8DBB;        // check4x4
    var COMPRESSED_RGB_S3TC_DXT1_EXT = 0x83F0; // check4x4
    var COMPRESSED_RGB_PVRTC_4BPPV1_IMG = 0x8C00; // checkPVRTC
    var COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 0x8C03; // checkPVRTC
    var COMPRESSED_SRGB_S3TC_DXT1_EXT = 0x8C4C;   // checkS3TCSRGB
    var COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT = 0x8C4F; // checkS3TCSRGB
    var UNKNOWN_FORMAT = 0x1234;

    beforeEach(function ()
    {
        vi.spyOn(console, 'warn').mockImplementation(function () {});
    });

    afterEach(function ()
    {
        vi.restoreAllMocks();
    });

    // -------------------------------------------------------------------------
    // Basic importability and return type
    // -------------------------------------------------------------------------

    it('should be importable', function ()
    {
        expect(verifyCompressedTexture).toBeDefined();
        expect(typeof verifyCompressedTexture).toBe('function');
    });

    it('should return a boolean', function ()
    {
        var data = { mipmaps: [{ width: 4, height: 4 }], internalFormat: COMPRESSED_RGB8_ETC2 };
        var result = verifyCompressedTexture(data);
        expect(typeof result).toBe('boolean');
    });

    // -------------------------------------------------------------------------
    // Unknown / missing format checker
    // -------------------------------------------------------------------------

    it('should return true and warn when no format checker exists for the given internalFormat', function ()
    {
        var data = { mipmaps: [{ width: 64, height: 64 }], internalFormat: UNKNOWN_FORMAT };
        var result = verifyCompressedTexture(data);
        expect(result).toBe(true);
        expect(console.warn).toHaveBeenCalled();
    });

    // -------------------------------------------------------------------------
    // Mip level power-of-two checks (levels 1+)
    // -------------------------------------------------------------------------

    it('should return true when there is only one mip level (level 0, no mip check needed)', function ()
    {
        var data = { mipmaps: [{ width: 64, height: 64 }], internalFormat: COMPRESSED_RGB8_ETC2 };
        expect(verifyCompressedTexture(data)).toBe(true);
    });

    it('should return true when all mip levels above 0 are power-of-two sized', function ()
    {
        var data = {
            mipmaps: [
                { width: 64, height: 64 },
                { width: 32, height: 32 },
                { width: 16, height: 16 }
            ],
            internalFormat: COMPRESSED_RGB8_ETC2
        };
        expect(verifyCompressedTexture(data)).toBe(true);
    });

    it('should return false and warn when mip level 1 width is not power-of-two', function ()
    {
        var data = {
            mipmaps: [
                { width: 64, height: 64 },
                { width: 30, height: 32 }
            ],
            internalFormat: COMPRESSED_RGB8_ETC2
        };
        expect(verifyCompressedTexture(data)).toBe(false);
        expect(console.warn).toHaveBeenCalled();
    });

    it('should return false and warn when mip level 1 height is not power-of-two', function ()
    {
        var data = {
            mipmaps: [
                { width: 64, height: 64 },
                { width: 32, height: 30 }
            ],
            internalFormat: COMPRESSED_RGB8_ETC2
        };
        expect(verifyCompressedTexture(data)).toBe(false);
        expect(console.warn).toHaveBeenCalled();
    });

    it('should return false when a deeper mip level is not power-of-two sized', function ()
    {
        var data = {
            mipmaps: [
                { width: 64, height: 64 },
                { width: 32, height: 32 },
                { width: 15, height: 16 }
            ],
            internalFormat: COMPRESSED_RGB8_ETC2
        };
        expect(verifyCompressedTexture(data)).toBe(false);
    });

    it('should not check mip level 0 dimensions for power-of-two (only levels 1+)', function ()
    {
        // Level 0 can be non-power-of-two; only levels 1+ are checked
        var data = {
            mipmaps: [
                { width: 100, height: 100 },
                { width: 64, height: 64 }
            ],
            internalFormat: COMPRESSED_RGB8_ETC2
        };
        expect(verifyCompressedTexture(data)).toBe(true);
    });

    // -------------------------------------------------------------------------
    // checkAlways formats (ETC, ETC1, ASTC)
    // -------------------------------------------------------------------------

    it('should return true for ETC2 format with valid single mip', function ()
    {
        var data = { mipmaps: [{ width: 64, height: 64 }], internalFormat: COMPRESSED_RGB8_ETC2 };
        expect(verifyCompressedTexture(data)).toBe(true);
    });

    it('should return true for ASTC format regardless of base dimensions', function ()
    {
        var data = { mipmaps: [{ width: 100, height: 100 }], internalFormat: COMPRESSED_RGBA_ASTC_4x4_KHR };
        expect(verifyCompressedTexture(data)).toBe(true);
    });

    it('should return true for ETC1 format with non-power-of-two base level', function ()
    {
        var data = { mipmaps: [{ width: 100, height: 60 }], internalFormat: COMPRESSED_RGB_ETC1_WEBGL };
        expect(verifyCompressedTexture(data)).toBe(true);
    });

    it('should return true for ASTC format with multiple valid mip levels', function ()
    {
        var data = {
            mipmaps: [
                { width: 64, height: 64 },
                { width: 32, height: 32 },
                { width: 16, height: 16 }
            ],
            internalFormat: COMPRESSED_RGBA_ASTC_4x4_KHR
        };
        expect(verifyCompressedTexture(data)).toBe(true);
    });

    it('should return false for ASTC format when mip level above 0 is not power-of-two', function ()
    {
        var data = {
            mipmaps: [
                { width: 64, height: 64 },
                { width: 30, height: 32 }
            ],
            internalFormat: COMPRESSED_RGBA_ASTC_4x4_KHR
        };
        expect(verifyCompressedTexture(data)).toBe(false);
    });

    // -------------------------------------------------------------------------
    // check4x4 formats (BPTC, RGTC, S3TC)
    // -------------------------------------------------------------------------

    it('should return true for BPTC format when base dimensions are multiples of 4', function ()
    {
        var data = { mipmaps: [{ width: 64, height: 64 }], internalFormat: COMPRESSED_RGBA_BPTC_UNORM_EXT };
        expect(verifyCompressedTexture(data)).toBe(true);
    });

    it('should return false and warn for BPTC format when base width is not a multiple of 4', function ()
    {
        var data = { mipmaps: [{ width: 62, height: 64 }], internalFormat: COMPRESSED_RGBA_BPTC_UNORM_EXT };
        expect(verifyCompressedTexture(data)).toBe(false);
        expect(console.warn).toHaveBeenCalled();
    });

    it('should return false for BPTC format when base height is not a multiple of 4', function ()
    {
        var data = { mipmaps: [{ width: 64, height: 62 }], internalFormat: COMPRESSED_RGBA_BPTC_UNORM_EXT };
        expect(verifyCompressedTexture(data)).toBe(false);
    });

    it('should return true for RGTC format with valid dimensions', function ()
    {
        var data = { mipmaps: [{ width: 128, height: 64 }], internalFormat: COMPRESSED_RED_RGTC1 };
        expect(verifyCompressedTexture(data)).toBe(true);
    });

    it('should return true for S3TC format with multiple valid mip levels where each level halves dimensions', function ()
    {
        // Level 0: 64x64, level 1: 32x32, level 2: 16x16
        // check4x4: (width << level) % 4 === 0
        // level 0: (64 << 0) = 64, 64 % 4 = 0 ok
        // level 1: (32 << 1) = 64, 64 % 4 = 0 ok
        // level 2: (16 << 2) = 64, 64 % 4 = 0 ok
        var data = {
            mipmaps: [
                { width: 64, height: 64 },
                { width: 32, height: 32 },
                { width: 16, height: 16 }
            ],
            internalFormat: COMPRESSED_RGB_S3TC_DXT1_EXT
        };
        expect(verifyCompressedTexture(data)).toBe(true);
    });

    it('should return false for S3TC when mip level 1 is not power-of-two (caught before check4x4)', function ()
    {
        var data = {
            mipmaps: [
                { width: 64, height: 64 },
                { width: 30, height: 32 }
            ],
            internalFormat: COMPRESSED_RGB_S3TC_DXT1_EXT
        };
        expect(verifyCompressedTexture(data)).toBe(false);
    });

    it('should return false for BPTC with 1x1 base dimensions (not a multiple of 4)', function ()
    {
        var data = { mipmaps: [{ width: 1, height: 1 }], internalFormat: COMPRESSED_RGBA_BPTC_UNORM_EXT };
        expect(verifyCompressedTexture(data)).toBe(false);
    });

    it('should return true for RGTC with 4x4 base dimensions', function ()
    {
        var data = { mipmaps: [{ width: 4, height: 4 }], internalFormat: COMPRESSED_RED_RGTC1 };
        expect(verifyCompressedTexture(data)).toBe(true);
    });

    // -------------------------------------------------------------------------
    // checkPVRTC formats
    // -------------------------------------------------------------------------

    it('should return true for PVRTC when base level is power-of-two', function ()
    {
        var data = { mipmaps: [{ width: 64, height: 64 }], internalFormat: COMPRESSED_RGB_PVRTC_4BPPV1_IMG };
        expect(verifyCompressedTexture(data)).toBe(true);
    });

    it('should return false and warn for PVRTC when base level width is not power-of-two', function ()
    {
        var data = { mipmaps: [{ width: 60, height: 64 }], internalFormat: COMPRESSED_RGB_PVRTC_4BPPV1_IMG };
        expect(verifyCompressedTexture(data)).toBe(false);
        expect(console.warn).toHaveBeenCalled();
    });

    it('should return false for PVRTC when base level height is not power-of-two', function ()
    {
        var data = { mipmaps: [{ width: 64, height: 60 }], internalFormat: COMPRESSED_RGB_PVRTC_4BPPV1_IMG };
        expect(verifyCompressedTexture(data)).toBe(false);
    });

    it('should return true for PVRTC with power-of-two base and multiple mip levels', function ()
    {
        var data = {
            mipmaps: [
                { width: 64, height: 64 },
                { width: 32, height: 32 },
                { width: 16, height: 16 }
            ],
            internalFormat: COMPRESSED_RGBA_PVRTC_2BPPV1_IMG
        };
        expect(verifyCompressedTexture(data)).toBe(true);
    });

    it('should return false for PVRTC when a higher mip level is not power-of-two', function ()
    {
        var data = {
            mipmaps: [
                { width: 64, height: 64 },
                { width: 30, height: 32 }
            ],
            internalFormat: COMPRESSED_RGB_PVRTC_4BPPV1_IMG
        };
        expect(verifyCompressedTexture(data)).toBe(false);
    });

    // -------------------------------------------------------------------------
    // checkS3TCSRGB formats
    // -------------------------------------------------------------------------

    it('should return true for S3TC SRGB when base dimensions are multiples of 4', function ()
    {
        var data = { mipmaps: [{ width: 64, height: 64 }], internalFormat: COMPRESSED_SRGB_S3TC_DXT1_EXT };
        expect(verifyCompressedTexture(data)).toBe(true);
    });

    it('should return false and warn for S3TC SRGB when base width is not a multiple of 4', function ()
    {
        var data = { mipmaps: [{ width: 62, height: 64 }], internalFormat: COMPRESSED_SRGB_S3TC_DXT1_EXT };
        expect(verifyCompressedTexture(data)).toBe(false);
        expect(console.warn).toHaveBeenCalled();
    });

    it('should return false for S3TC SRGB when base height is not a multiple of 4', function ()
    {
        var data = { mipmaps: [{ width: 64, height: 62 }], internalFormat: COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT };
        expect(verifyCompressedTexture(data)).toBe(false);
    });

    it('should return true for S3TC SRGB with valid base and multiple power-of-two mip levels', function ()
    {
        var data = {
            mipmaps: [
                { width: 64, height: 64 },
                { width: 32, height: 32 },
                { width: 16, height: 16 }
            ],
            internalFormat: COMPRESSED_SRGB_S3TC_DXT1_EXT
        };
        expect(verifyCompressedTexture(data)).toBe(true);
    });

    it('should return false for S3TC SRGB when a mip level above 0 is not power-of-two', function ()
    {
        var data = {
            mipmaps: [
                { width: 64, height: 64 },
                { width: 30, height: 32 }
            ],
            internalFormat: COMPRESSED_SRGB_S3TC_DXT1_EXT
        };
        expect(verifyCompressedTexture(data)).toBe(false);
    });

    // -------------------------------------------------------------------------
    // Edge cases
    // -------------------------------------------------------------------------

    it('should return true with an empty mipmaps array for a checkAlways format', function ()
    {
        var data = { mipmaps: [], internalFormat: COMPRESSED_RGB8_ETC2 };
        expect(verifyCompressedTexture(data)).toBe(true);
    });

    it('should return true with an empty mipmaps array for unknown format (warns)', function ()
    {
        var data = { mipmaps: [], internalFormat: UNKNOWN_FORMAT };
        expect(verifyCompressedTexture(data)).toBe(true);
    });

    it('should return true for 1x1 power-of-two mip level 1 with a checkAlways format', function ()
    {
        var data = {
            mipmaps: [
                { width: 2, height: 2 },
                { width: 1, height: 1 }
            ],
            internalFormat: COMPRESSED_RGB8_ETC2
        };
        expect(verifyCompressedTexture(data)).toBe(true);
    });

    it('should return false immediately on first invalid mip level without checking further levels', function ()
    {
        var data = {
            mipmaps: [
                { width: 64, height: 64 },
                { width: 30, height: 32 },
                { width: 15, height: 16 }
            ],
            internalFormat: COMPRESSED_RGB8_ETC2
        };
        var result = verifyCompressedTexture(data);
        expect(result).toBe(false);
        // Only one warning for the first failing level
        expect(console.warn).toHaveBeenCalledTimes(1);
    });
});
