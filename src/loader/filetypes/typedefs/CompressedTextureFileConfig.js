/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.CompressedTextureFileEntry
 *
 * @property {string} [format] - The texture compression base format that the browser must support in order to load this file. Can be any of: 'ETC', 'ETC1', 'ATC', 'ASTC', 'BPTC', 'RGTC', 'PVRTC', 'S3TC', 'S3TCSRGB' or the fallback format of 'IMG'.
 * @property {string} [type] - The container format, either PVR or KTX. If not given it will try to extract it from the textureURL extension.
 * @property {string} [textureURL] - The URL of the compressed texture file to load.
 * @property {string} [atlasURL] - Optional URL of a texture atlas JSON data file. If not given, the texture will be loaded as a single image.
 * @property {string} [multiAtlasURL] - Optional URL of a multi-texture atlas JSON data file as created by Texture Packer Pro.
 * @property {string} [multiPath] - Optional path to use when loading the textures defined in the multi atlas data.
 * @property {string} [multiBaseURL] - Optional Base URL to use when loading the textures defined in the multi atlas data.
 */

/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.CompressedTextureFileConfig
 *
 * @property {(Phaser.Types.Loader.FileTypes.CompressedTextureFileEntry | string)} [ETC] - The string, or file entry object, for an ETC format texture.
 * @property {(Phaser.Types.Loader.FileTypes.CompressedTextureFileEntry | string)} [ETC1] - The string, or file entry object, for an ETC1 format texture.
 * @property {(Phaser.Types.Loader.FileTypes.CompressedTextureFileEntry | string)} [ATC] - The string, or file entry object, for an ATC format texture.
 * @property {(Phaser.Types.Loader.FileTypes.CompressedTextureFileEntry | string)} [ASTC] - The string, or file entry object, for an ASTC format texture.
 * @property {(Phaser.Types.Loader.FileTypes.CompressedTextureFileEntry | string)} [BPTC] - The string, or file entry object, for an BPTC format texture.
 * @property {(Phaser.Types.Loader.FileTypes.CompressedTextureFileEntry | string)} [RGTC] - The string, or file entry object, for an RGTC format texture.
 * @property {(Phaser.Types.Loader.FileTypes.CompressedTextureFileEntry | string)} [PVRTC] - The string, or file entry object, for an PVRTC format texture.
 * @property {(Phaser.Types.Loader.FileTypes.CompressedTextureFileEntry | string)} [S3TC] - The string, or file entry object, for an S3TC format texture.
 * @property {(Phaser.Types.Loader.FileTypes.CompressedTextureFileEntry | string)} [S3TCSRGB] - The string, or file entry object, for an S3TCSRGB format texture.
 * @property {(Phaser.Types.Loader.FileTypes.CompressedTextureFileEntry | string)} [IMG] - The string, or file entry object, for the fallback image file.
 */
