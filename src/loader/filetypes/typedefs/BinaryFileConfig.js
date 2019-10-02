/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.BinaryFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within both the Loader and the Binary Cache.
 * @property {string} [url] - The absolute or relative URL to load the file from.
 * @property {string} [extension='bin'] - The default file extension to use if no url is provided.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 * @property {any} [dataType] - Optional type to cast the binary file to once loaded. For example, `Uint8Array`.
 */
