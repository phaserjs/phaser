/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.FontFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within the Loader.
 * @property {string} [url] - The absolute or relative URL to load the file from.
 * @property {string} [extension='ttf'] - The default file extension to use if no url is provided.
 * @property {string} [format='truetype'] - The font type. Should be a string, like 'truetype' or 'opentype'.
 * @property {object} [descriptors] - An optional object containing font descriptors for the Font Face.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */
