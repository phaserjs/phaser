/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.ScriptFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within the Loader.
 * @property {string} [url] - The absolute or relative URL to load the file from.
 * @property {string} [extension='js'] - The default file extension to use if no url is provided.
 * @property {string} [type='script'] - The script type. Should be either 'script' for classic JavaScript, or 'module' if the file contains an exported module.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */
