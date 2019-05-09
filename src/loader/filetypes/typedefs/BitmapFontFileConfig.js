/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.BitmapFontFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within both the Loader and the Texture Manager.
 * @property {string} [textureURL] - The absolute or relative URL to load the texture image file from.
 * @property {string} [textureExtension='png'] - The default file extension to use for the image texture if no url is provided.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [textureXhrSettings] - Extra XHR Settings specifically for the texture image file.
 * @property {string} [normalMap] - The filename of an associated normal map. It uses the same path and url to load as the texture image.
 * @property {string} [fontDataURL] - The absolute or relative URL to load the font data xml file from.
 * @property {string} [fontDataExtension='xml'] - The default file extension to use for the font data xml if no url is provided.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [fontDataXhrSettings] - Extra XHR Settings specifically for the font data xml file.
 */
