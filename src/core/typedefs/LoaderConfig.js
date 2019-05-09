/**
 * @typedef {object} Phaser.Types.Core.LoaderConfig
 * @since 3.0.0
 *
 * @property {string} [baseURL] - A URL used to resolve paths given to the loader. Example: 'http://labs.phaser.io/assets/'.
 * @property {string} [path] - A URL path used to resolve relative paths given to the loader. Example: 'images/sprites/'.
 * @property {integer} [maxParallelDownloads=32] - The maximum number of resources the loader will start loading at once.
 * @property {(string|undefined)} [crossOrigin=undefined] - 'anonymous', 'use-credentials', or `undefined`. If you're not making cross-origin requests, leave this as `undefined`. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes}.
 * @property {string} [responseType] - The response type of the XHR request, e.g. `blob`, `text`, etc.
 * @property {boolean} [async=true] - Should the XHR request use async or not?
 * @property {string} [user] - Optional username for all XHR requests.
 * @property {string} [password] - Optional password for all XHR requests.
 * @property {integer} [timeout=0] - Optional XHR timeout value, in ms.
 */
