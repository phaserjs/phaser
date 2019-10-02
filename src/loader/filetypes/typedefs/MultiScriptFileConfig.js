/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.MultiScriptFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within the Loader.
 * @property {string[]} [url] - An array of absolute or relative URLs to load the script files from. They are processed in the order given in the array.
 * @property {string} [extension='js'] - The default file extension to use if no url is provided.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for these files.
 */
