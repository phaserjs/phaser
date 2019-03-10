/**
 * @typedef {object} Phaser.Scenes.Types.SettingsConfig
 * @since 3.0.0
 *
 * @property {string} [key] - The unique key of this Scene. Must be unique within the entire Game instance.
 * @property {boolean} [active=false] - Does the Scene start as active or not? An active Scene updates each step.
 * @property {boolean} [visible=true] - Does the Scene start as visible or not? A visible Scene renders each step.
 * @property {(false|Phaser.Loader.FileTypes.PackFileConfig)} [pack=false] - An optional Loader Packfile to be loaded before the Scene begins.
 * @property {?(InputJSONCameraObject|InputJSONCameraObject[])} [cameras=null] - An optional Camera configuration object.
 * @property {Object.<string, string>} [map] - Overwrites the default injection map for a scene.
 * @property {Object.<string, string>} [mapAdd] - Extends the injection map for a scene.
 * @property {object} [physics={}] - The physics configuration object for the Scene.
 * @property {object} [loader={}] - The loader configuration object for the Scene.
 * @property {(false|*)} [plugins=false] - The plugin configuration object for the Scene.
 */
