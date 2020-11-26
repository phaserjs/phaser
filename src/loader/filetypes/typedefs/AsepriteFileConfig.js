/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.AsepriteFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within both the Loader and the Texture Manager.
 * @property {string} [textureURL] - The absolute or relative URL to load the texture image file from.
 * @property {string} [textureExtension='png'] - The default file extension to use for the image texture if no url is provided.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [textureXhrSettings] - Extra XHR Settings specifically for the texture image file.
 * @property {object|string} [atlasURL] - The absolute or relative URL to load the atlas json file from. Or, a well formed JSON object to use instead.
 * @property {string} [atlasExtension='json'] - The default file extension to use for the atlas json if no url is provided.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [atlasXhrSettings] - Extra XHR Settings specifically for the atlas json file.
 */
