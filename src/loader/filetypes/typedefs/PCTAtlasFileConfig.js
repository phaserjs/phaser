/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.PCTAtlasFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within both the Loader and the Texture Manager.
 * @property {string} [atlasURL] - The absolute or relative URL to load the PCT atlas data file from.
 * @property {string} [url] - An alias for 'atlasURL'. If given, it overrides anything set in 'atlasURL'.
 * @property {string} [atlasExtension='pct'] - The default file extension to use for the atlas data if no url is provided.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [atlasXhrSettings] - Extra XHR Settings specifically for the atlas json file.
 * @property {string} [path] - Optional path to use when loading the textures defined in the atlas data.
 * @property {string} [baseURL] - Optional Base URL to use when loading the textures defined in the atlas data.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [textureXhrSettings] - Extra XHR Settings specifically for the texture files.
 */
