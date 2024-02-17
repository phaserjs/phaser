/**
 * @author       Ben Richards <benjamindrichards@gmail.com>
 * @copyright    2024 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var IsSizePowerOfTwo = require('../../math/pow2/IsSizePowerOfTwo');

/**
 * Verify whether the given compressed texture data is valid.
 *
 * Compare the dimensions of each mip layer to the rules for that
 * specific format.
 *
 * Mip layer size is assumed to have been calculated correctly during parsing.
 *
 * @function Phaser.Textures.Parsers.verifyCompressedTexture
 * @param {Phaser.Types.Textures.CompressedTextureData} data - The compressed texture data to verify.
 * @since 3.80.0
 * @returns {boolean} Whether the compressed texture data is valid.
 */
var verifyCompressedTexture = function (data)
{
    // Check that mipmaps are power-of-two sized.
    // WebGL does not allow non-power-of-two textures for mip levels above 0.
    var mipmaps = data.mipmaps;
    for (var level = 1; level < mipmaps.length; level++)
    {
        var width = mipmaps[level].width;
        var height = mipmaps[level].height;
        if (!IsSizePowerOfTwo(width, height))
        {
            console.warn('Mip level ' + level + ' is not a power-of-two size: ' + width + 'x' + height);
            return false;
        }
    }

    // Check specific format requirements.
    var checker = formatCheckers[data.internalFormat];
    if (!checker)
    {
        console.warn('No format checker found for internal format ' + data.internalFormat + '. Assuming valid.');
        return true;
    }
    return checker(data);
};

/**
 * @ignore
 */
function check4x4 (data)
{
    var mipmaps = data.mipmaps;
    for (var level = 0; level < mipmaps.length; level++)
    {
        var width = mipmaps[level].width;
        var height = mipmaps[level].height;
        if ((width << level) % 4 !== 0 || (height << level) % 4 !== 0)
        {
            console.warn('BPTC, RGTC, and S3TC dimensions must be a multiple of 4 pixels, and each successive mip level must be half the size of the previous level, rounded down. Mip level ' + level + ' is ' + width + 'x' + height);
            return false;
        }
    }
    return true;
}

/**
 * @ignore
 */
function checkAlways ()
{
    // WEBGL_compressed_texture_astc
    // WEBGL_compressed_texture_etc
    // WEBGL_compressed_texture_etc1

    // ASTC, ETC, and ETC1
    // only require data be provided in arrays of specific size,
    // which are already set by the parser.
    return true;
}

function checkPVRTC (data)
{
    // WEBGL_compressed_texture_pvrtc

    var mipmaps = data.mipmaps;
    var baseLevel = mipmaps[0];
    if (!IsSizePowerOfTwo(baseLevel.width, baseLevel.height))
    {
        console.warn('PVRTC base dimensions must be power of two. Base level is ' + baseLevel.width + 'x' + baseLevel.height);
        return false;
    }

    // Other mip levels have already been checked for power-of-two size.
    return true;
}

/**
 * @ignore
 */
function checkS3TCSRGB (data)
{
    // WEBGL_compressed_texture_s3tc_srgb

    var mipmaps = data.mipmaps;
    var baseLevel = mipmaps[0];
    if (baseLevel.width % 4 !== 0 || baseLevel.height % 4 !== 0)
    {
        console.warn('S3TC SRGB base dimensions must be a multiple of 4 pixels. Base level is ' + baseLevel.width + 'x' + baseLevel.height + ' pixels');
        return false;
    }

    // Mip levels above 0 must be 0, 1, 2, or a multiple of 4 pixels.
    // However, as WebGL mip levels must all be power-of-two sized,
    // this is already covered by the power-of-two check.

    return true;
}

var formatCheckers = {
    // ETC internal formats:

    // COMPRESSED_R11_EAC
    0x9270: checkAlways,

    // COMPRESSED_SIGNED_R11_EAC
    0x9271: checkAlways,

    // COMPRESSED_RG11_EAC
    0x9272: checkAlways,

    // COMPRESSED_SIGNED_RG11_EAC
    0x9273: checkAlways,

    // COMPRESSED_RGB8_ETC2
    0x9274: checkAlways,

    // COMPRESSED_SRGB8_ETC2
    0x9275: checkAlways,

    // COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2
    0x9276: checkAlways,

    // COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2
    0x9277: checkAlways,

    // COMPRESSED_RGBA8_ETC2_EAC
    0x9278: checkAlways,

    // COMPRESSED_SRGB8_ALPHA8_ETC2_EAC
    0x9279: checkAlways,

    // ETC1 internal formats:

    // COMPRESSED_RGB_ETC1_WEBGL
    0x8D64: checkAlways,

    // ATC internal formats:
    // COMPRESSED_RGB_ATC_WEBGL
    // COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL
    // COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL
    // These formats are no longer supported in WebGL.
    // They have no special restrictions on size, so if they were decoded,
    // they are already valid.
    // We'll show a warning for no format checker found.

    // ASTC internal formats:

    // COMPRESSED_RGBA_ASTC_4x4_KHR
    0x93B0: checkAlways,

    // COMPRESSED_RGBA_ASTC_5x4_KHR
    0x93B1: checkAlways,

    // COMPRESSED_RGBA_ASTC_5x5_KHR
    0x93B2: checkAlways,

    // COMPRESSED_RGBA_ASTC_6x5_KHR
    0x93B3: checkAlways,

    // COMPRESSED_RGBA_ASTC_6x6_KHR
    0x93B4: checkAlways,

    // COMPRESSED_RGBA_ASTC_8x5_KHR
    0x93B5: checkAlways,

    // COMPRESSED_RGBA_ASTC_8x6_KHR
    0x93B6: checkAlways,

    // COMPRESSED_RGBA_ASTC_8x8_KHR
    0x93B7: checkAlways,

    // COMPRESSED_RGBA_ASTC_10x5_KHR
    0x93B8: checkAlways,

    // COMPRESSED_RGBA_ASTC_10x6_KHR
    0x93B9: checkAlways,

    // COMPRESSED_RGBA_ASTC_10x8_KHR
    0x93BA: checkAlways,

    // COMPRESSED_RGBA_ASTC_10x10_KHR
    0x93BB: checkAlways,

    // COMPRESSED_RGBA_ASTC_12x10_KHR
    0x93BC: checkAlways,

    // COMPRESSED_RGBA_ASTC_12x12_KHR
    0x93BD: checkAlways,

    // COMPRESSED_SRGB8_ALPHA8_ASTC_4X4_KHR
    0x93D0: checkAlways,

    // COMPRESSED_SRGB8_ALPHA8_ASTC_5X4_KHR
    0x93D1: checkAlways,

    // COMPRESSED_SRGB8_ALPHA8_ASTC_5X5_KHR
    0x93D2: checkAlways,

    // COMPRESSED_SRGB8_ALPHA8_ASTC_6X5_KHR
    0x93D3: checkAlways,

    // COMPRESSED_SRGB8_ALPHA8_ASTC_6X6_KHR
    0x93D4: checkAlways,

    // COMPRESSED_SRGB8_ALPHA8_ASTC_8X5_KHR
    0x93D5: checkAlways,

    // COMPRESSED_SRGB8_ALPHA8_ASTC_8X6_KHR
    0x93D6: checkAlways,

    // COMPRESSED_SRGB8_ALPHA8_ASTC_8X8_KHR
    0x93D7: checkAlways,

    // COMPRESSED_SRGB8_ALPHA8_ASTC_10X5_KHR
    0x93D8: checkAlways,

    // COMPRESSED_SRGB8_ALPHA8_ASTC_10X6_KHR
    0x93D9: checkAlways,

    // COMPRESSED_SRGB8_ALPHA8_ASTC_10X8_KHR
    0x93DA: checkAlways,

    // COMPRESSED_SRGB8_ALPHA8_ASTC_10X10_KHR
    0x93DB: checkAlways,

    // COMPRESSED_SRGB8_ALPHA8_ASTC_12X10_KHR
    0x93DC: checkAlways,

    // COMPRESSED_SRGB8_ALPHA8_ASTC_12X12_KHR
    0x93DD: checkAlways,

    // BPTC internal formats:

    // COMPRESSED_RGBA_BPTC_UNORM_EXT
    0x8E8C: check4x4,

    // COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT
    0x8E8D: check4x4,

    // COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT
    0x8E8E: check4x4,

    // COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT
    0x8E8F: check4x4,

    // RGTC internal formats:

    // COMPRESSED_RED_RGTC1
    0x8DBB: check4x4,

    // COMPRESSED_SIGNED_RED_RGTC1
    0x8DBC: check4x4,

    // COMPRESSED_RG_RGTC2
    0x8DBD: check4x4,

    // COMPRESSED_SIGNED_RG_RGTC2
    0x8DBE: check4x4,

    // PVRTC internal formats:

    // COMPRESSED_RGB_PVRTC_4BPPV1_IMG
    0x8C00: checkPVRTC,

    // COMPRESSED_RGB_PVRTC_2BPPV1_IMG
    0x8C01: checkPVRTC,

    // COMPRESSED_RGBA_PVRTC_4BPPV1_IMG
    0x8C02: checkPVRTC,

    // COMPRESSED_RGBA_PVRTC_2BPPV1_IMG
    0x8C03: checkPVRTC,

    // S3TC internal formats:

    // COMPRESSED_RGB_S3TC_DXT1_EXT
    0x83F0: check4x4,

    // COMPRESSED_RGBA_S3TC_DXT1_EXT
    0x83F1: check4x4,

    // COMPRESSED_RGBA_S3TC_DXT3_EXT
    0x83F2: check4x4,

    // COMPRESSED_RGBA_S3TC_DXT5_EXT
    0x83F3: check4x4,

    // S3TCSRGB internal formats:

    // COMPRESSED_SRGB_S3TC_DXT1_EXT
    0x8C4C: checkS3TCSRGB,

    // COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT
    0x8C4D: checkS3TCSRGB,

    // COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT
    0x8C4E: checkS3TCSRGB,

    // COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT
    0x8C4F: checkS3TCSRGB
};

module.exports = verifyCompressedTexture;
