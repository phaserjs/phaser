/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.JSONFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within both the Loader and the JSON Cache.
 * @property {string|any} [url] - The absolute or relative URL to load the file from. Or can be a ready formed JSON object, in which case it will be directly added to the Cache.
 * @property {string} [extension='json'] - The default file extension to use if no url is provided.
 * @property {string} [dataKey] - If specified instead of the whole JSON file being parsed and added to the Cache, only the section corresponding to this property key will be added. If the property you want to extract is nested, use periods to divide it.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */
