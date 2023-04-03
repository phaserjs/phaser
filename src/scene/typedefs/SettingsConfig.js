/**
 * @typedef {object} Phaser.Types.Scenes.SettingsConfig
 * @since 3.0.0
 *
 * @property {string} [key] - The unique key of this Scene. Must be unique within the entire Game instance.
 * @property {boolean} [active=false] - Does the Scene start as active or not? An active Scene updates each step.
 * @property {boolean} [visible=true] - Does the Scene start as visible or not? A visible Scene renders each step.
 * @property {(false|Phaser.Types.Loader.FileTypes.PackFileSection)} [pack=false] - Files to be loaded before the Scene begins.
 * @property {?(Phaser.Types.Cameras.Scene2D.CameraConfig|Phaser.Types.Cameras.Scene2D.CameraConfig[])} [cameras=null] - An optional Camera configuration object.
 * @property {Object.<string, string>} [map] - Overwrites the default injection map for a scene.
 * @property {Object.<string, string>} [mapAdd] - Extends the injection map for a scene.
 * @property {Phaser.Types.Core.PhysicsConfig} [physics={}] - The physics configuration object for the Scene.
 * @property {Phaser.Types.Core.LoaderConfig} [loader={}] - The loader configuration object for the Scene.
 * @property {(false|*)} [plugins=false] - The plugin configuration object for the Scene.
 */
