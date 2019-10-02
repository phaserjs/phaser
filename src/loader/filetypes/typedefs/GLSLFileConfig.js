/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.GLSLFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within both the Loader and the Text Cache.
 * @property {string} [url] - The absolute or relative URL to load the file from.
 * @property {string} [shaderType='fragment'] - The type of shader. Either `fragment` for a fragment shader, or `vertex` for a vertex shader. This is ignored if you load a shader bundle.
 * @property {string} [extension='glsl'] - The default file extension to use if no url is provided.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */
