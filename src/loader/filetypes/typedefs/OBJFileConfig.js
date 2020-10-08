/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.OBJFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within both the Loader and the OBJ Cache.
 * @property {string} [url] - The absolute or relative URL to load this file from. If undefined or `null` it will be set to `<key>.obj`, i.e. if `key` was "alien" then the URL will be "alien.obj".
 * @property {string} [extension='obj'] - The default file extension to use if no url is provided.
 * @property {boolean} [flipUV] - Flip the UV coordinates stored in the model data?
 * @property {string} [matURL] - An optional absolute or relative URL to the object material file from. If undefined or `null`, no material file will be loaded.
 * @property {string} [matExtension='mat'] - The default material file extension to use if no url is provided.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */
