/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.ImageFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within both the Loader and the Texture Manager.
 * @property {string} [url] - The absolute or relative URL to load the file from.
 * @property {string} [extension='png'] - The default file extension to use if no url is provided.
 * @property {string} [normalMap] - The filename of an associated normal map. It uses the same path and url to load as the image.
 * @property {Phaser.Types.Loader.FileTypes.ImageFrameConfig} [frameConfig] - The frame configuration object. Only provided for, and used by, Sprite Sheets.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */
