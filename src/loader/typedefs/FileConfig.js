/**
 * @typedef {object} Phaser.Types.Loader.FileConfig
 * @since 3.0.0
 *
 * @property {string} type - The file type string (image, json, etc) for sorting within the Loader.
 * @property {string} key - Unique cache key (unique within its file type)
 * @property {string} [url] - The URL of the file, not including baseURL.
 * @property {string} [path] - The path of the file, not including the baseURL.
 * @property {string} [extension] - The default extension this file uses.
 * @property {XMLHttpRequestResponseType} [responseType] - The responseType to be used by the XHR request.
 * @property {(Phaser.Types.Loader.XHRSettingsObject|false)} [xhrSettings=false] - Custom XHR Settings specific to this file and merged with the Loader defaults.
 * @property {any} [config] - A config object that can be used by file types to store transitional data.
 */
