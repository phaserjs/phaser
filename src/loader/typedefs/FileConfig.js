/**
 * @typedef {object} Phaser.Types.Loader.FileConfig
 * @since 3.0.0
 *
 * @property {string} type - The name of the Loader method that loads this file, e.g., 'image', 'json', 'spritesheet'.
 * @property {string} key - Unique cache key (unique within its file type)
 * @property {object|string} [url] - The URL of the file, not including baseURL.
 * @property {string} [path] - The path of the file, not including the baseURL.
 * @property {string} [extension] - The default extension this file uses.
 * @property {XMLHttpRequestResponseType} [responseType] - The responseType to be used by the XHR request.
 * @property {(Phaser.Types.Loader.XHRSettingsObject|false)} [xhrSettings=false] - Custom XHR Settings specific to this file and merged with the Loader defaults.
 * @property {any} [config] - A config object that can be used by file types to store transitional data.
 * @property {string} [textureURL] - The absolute or relative URL to load the texture image file from.
 * @property {string} [textureExtension='png'] - The default file extension to use for the image texture if no url is provided.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [textureXhrSettings] - Extra XHR Settings specifically for the texture image file.
 * @property {object|string} [atlasURL] - The absolute or relative URL to load the atlas json file from. Or, a well formed JSON object to use instead.
 * @property {string} [atlasExtension='json'] - The default file extension to use for the atlas json if no url is provided.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [atlasXhrSettings] - Extra XHR Settings specifically for the atlas json file.
 * @property {string} [normalMap] - The filename of an associated normal map. It uses the same path and url to load as the texture image.
 * @property {AudioContext} [context] - The optional AudioContext this file will use to process itself (only used by Sound objects).
 * @property {string} [jsonURL] - The absolute or relative URL to load the json file from. Or a well formed JSON object to use instead.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [jsonXhrSettings] - Extra XHR Settings specifically for the json file.
 * @property {{(string|string[])}} [audioURL] - The absolute or relative URL to load the audio file from.
 * @property {any} [audioConfig] - The audio configuration options.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [audioXhrSettings] - Extra XHR Settings specifically for the audio file.
 * @property {any} [dataType] - Optional type to cast the binary file to once loaded. For example, `Uint8Array`.
 * @property {string} [fontDataURL] - The absolute or relative URL to load the font data xml file from.
 * @property {string} [fontDataExtension='xml'] - The default file extension to use for the font data xml if no url is provided.
 * @property {Phaser.Types.Loader.XHRSettingsObject} [fontDataXhrSettings] - Extra XHR Settings specifically for the font data xml file.
 * @property {(Phaser.Types.Loader.FileTypes.CompressedTextureFileEntry | string)} [ETC] - The string, or file entry object, for an ETC format texture.
 * @property {(Phaser.Types.Loader.FileTypes.CompressedTextureFileEntry | string)} [ETC1] - The string, or file entry object, for an ETC1 format texture.
 * @property {(Phaser.Types.Loader.FileTypes.CompressedTextureFileEntry | string)} [ATC] - The string, or file entry object, for an ATC format texture.
 * @property {(Phaser.Types.Loader.FileTypes.CompressedTextureFileEntry | string)} [ASTC] - The string, or file entry object, for an ASTC format texture.
 * @property {(Phaser.Types.Loader.FileTypes.CompressedTextureFileEntry | string)} [BPTC] - The string, or file entry object, for an BPTC format texture.
 * @property {(Phaser.Types.Loader.FileTypes.CompressedTextureFileEntry | string)} [RGTC] - The string, or file entry object, for an RGTC format texture.
 * @property {(Phaser.Types.Loader.FileTypes.CompressedTextureFileEntry | string)} [PVRTC] - The string, or file entry object, for an PVRTC format texture.
 * @property {(Phaser.Types.Loader.FileTypes.CompressedTextureFileEntry | string)} [S3TC] - The string, or file entry object, for an S3TC format texture.
 * @property {(Phaser.Types.Loader.FileTypes.CompressedTextureFileEntry | string)} [S3TCRGB] - The string, or file entry object, for an S3TCRGB format texture.
 * @property {(Phaser.Types.Loader.FileTypes.CompressedTextureFileEntry | string)} [IMG] - The string, or file entry object, for the fallback image file.
 * @property {string} [shaderType='fragment'] - The type of shader. Either `fragment` for a fragment shader, or `vertex` for a vertex shader. This is ignored if you load a shader bundle.
 * @property {number} [width=512] - The width of the texture the HTML will be rendered to.
 * @property {number} [height=512] - The height of the texture the HTML will be rendered to.
 * @property {Phaser.Types.Loader.FileTypes.ImageFrameConfig} [frameConfig] - The frame configuration object. Only provided for, and used by, Sprite Sheets.
 * @property {string} [dataKey] - If specified instead of the whole JSON file being parsed and added to the Cache, only the section corresponding to this property key will be added. If the property you want to extract is nested, use periods to divide it.
 * @property {string} [baseURL] - Optional Base URL to use when loading the textures defined in the atlas data.
 * @property {boolean} [flipUV] - Flip the UV coordinates stored in the model data?
 * @property {string} [matURL] - An optional absolute or relative URL to the object material file from. If undefined or `null`, no material file will be loaded.
 * @property {string} [matExtension='mat'] - The default material file extension to use if no url is provided.
 * @property {boolean} [start=false] - Automatically start the plugin after loading?
 * @property {string} [mapping] - If this plugin is to be injected into the Scene, this is the property key used.
 * @property {string} [systemKey] - If this plugin is to be added to Scene.Systems, this is the property key for it.
 * @property {string} [sceneKey] - If this plugin is to be added to the Scene, this is the property key for it.
 * @property {Phaser.Types.Loader.FileTypes.SVGSizeConfig} [svgConfig] - The svg size configuration object.
 */
