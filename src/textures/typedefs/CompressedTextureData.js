/**
 * An object containing the dimensions and mipmap data for a Compressed Texture.
 *
 * @typedef {object} Phaser.Types.Textures.CompressedTextureData
 * @since 3.60.0
 *
 * @property {boolean} compressed - Is this a compressed texture?
 * @property {boolean} generateMipmap - Should this texture have mipmaps generated?
 * @property {number} width - The width of the maximum size of the texture.
 * @property {number} height - The height of the maximum size of the texture.
 * @property {GLenum} internalFormat - The WebGL internal texture format.
 * @property {Phaser.Types.Textures.MipmapType[]} mipmaps - An array of MipmapType objects.
 */
