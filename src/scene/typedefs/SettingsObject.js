/**
 * @typedef {object} Phaser.Types.Scenes.SettingsObject
 * @since 3.0.0
 *
 * @property {number} status - The current status of the Scene. Maps to the Scene constants.
 * @property {string} key - The unique key of this Scene. Unique within the entire Game instance.
 * @property {boolean} active - The active state of this Scene. An active Scene updates each step.
 * @property {boolean} visible - The visible state of this Scene. A visible Scene renders each step.
 * @property {boolean} isBooted - Has the Scene finished booting?
 * @property {boolean} isTransition - Is the Scene in a state of transition?
 * @property {?Phaser.Scene} transitionFrom - The Scene this Scene is transitioning from, if set.
 * @property {number} transitionDuration - The duration of the transition, if set.
 * @property {boolean} transitionAllowInput - Is this Scene allowed to receive input during transitions?
 * @property {object} data - a data bundle passed to this Scene from the Scene Manager.
 * @property {(false|Phaser.Types.Loader.FileTypes.PackFileSection)} pack - Files to be loaded before the Scene begins.
 * @property {?(Phaser.Types.Cameras.Scene2D.JSONCamera|Phaser.Types.Cameras.Scene2D.JSONCamera[])} cameras - The Camera configuration object.
 * @property {Object.<string, string>} map - The Scene's Injection Map.
 * @property {Phaser.Types.Core.PhysicsConfig} physics - The physics configuration object for the Scene.
 * @property {Phaser.Types.Core.LoaderConfig} loader - The loader configuration object for the Scene.
 * @property {(false|*)} plugins - The plugin configuration object for the Scene.
 */
