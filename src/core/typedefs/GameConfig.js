/**
 * @typedef {object} Phaser.Types.Core.GameConfig
 * @since 3.0.0
 *
 * @property {(integer|string)} [width=1024] - The width of the game, in game pixels.
 * @property {(integer|string)} [height=768] - The height of the game, in game pixels.
 * @property {number} [zoom=1] - Simple scale applied to the game canvas. 2 is double size, 0.5 is half size, etc.
 * @property {number} [resolution=1] - The size of each game pixel, in canvas pixels. Values larger than 1 are "high" resolution.
 * @property {number} [type=CONST.AUTO] - Which renderer to use. Phaser.AUTO, Phaser.CANVAS, Phaser.HEADLESS, or Phaser.WEBGL. AUTO picks WEBGL if available, otherwise CANVAS.
 * @property {(HTMLElement|string)} [parent=null] - The DOM element that will contain the game canvas, or its `id`. If undefined or if the named element doesn't exist, the game canvas is inserted directly into the document body. If `null` no parent will be used and you are responsible for adding the canvas to your environment.
 * @property {HTMLCanvasElement} [canvas=null] - Provide your own Canvas element for Phaser to use instead of creating one.
 * @property {string} [canvasStyle=null] - CSS styles to apply to the game canvas instead of Phasers default styles.
 * @property {boolean}[customEnvironment=false] - Is Phaser running under a custom (non-native web) environment? If so, set this to `true` to skip internal Feature detection. If `true` the `renderType` cannot be left as `AUTO`.
 * @property {CanvasRenderingContext2D} [context] - Provide your own Canvas Context for Phaser to use, instead of creating one.
 * @property {(Phaser.Scene|Phaser.Scene[]|Phaser.Types.Scenes.SettingsConfig|Phaser.Types.Scenes.SettingsConfig[]|Phaser.Types.Scenes.CreateSceneFromObjectConfig|Phaser.Types.Scenes.CreateSceneFromObjectConfig[]|function|function[])} [scene=null] - A scene or scenes to add to the game. If several are given, the first is started; the remainder are started only if they have `{ active: true }`. See the `sceneConfig` argument in `Phaser.Scenes.SceneManager#add`.
 * @property {string[]} [seed] - Seed for the random number generator.
 * @property {string} [title=''] - The title of the game. Shown in the browser console.
 * @property {string} [url='http://phaser.io'] - The URL of the game. Shown in the browser console.
 * @property {string} [version=''] - The version of the game. Shown in the browser console.
 * @property {boolean} [autoFocus=true] - Automatically call window.focus() when the game boots. Usually necessary to capture input events if the game is in a separate frame.
 * @property {(boolean|Phaser.Types.Core.InputConfig)} [input] - Input configuration, or `false` to disable all game input.
 * @property {boolean} [disableContextMenu=false] - Disable the browser's default 'contextmenu' event (usually triggered by a right-button mouse click).
 * @property {boolean} [transparent=false] - Whether the game canvas will have a transparent background.
 * @property {(boolean|Phaser.Types.Core.BannerConfig)} [banner=false] - Configuration for the banner printed in the browser console when the game starts.
 * @property {Phaser.Types.Core.DOMContainerConfig} [dom] - The DOM Container configuration object.
 * @property {Phaser.Types.Core.FPSConfig} [fps] - Game loop configuration.
 * @property {Phaser.Types.Core.RenderConfig} [render] - Game renderer configuration.
 * @property {(string|number)} [backgroundColor=0x000000] - The background color of the game canvas. The default is black.
 * @property {Phaser.Types.Core.CallbacksConfig} [callbacks] - Optional callbacks to run before or after game boot.
 * @property {Phaser.Types.Core.LoaderConfig} [loader] - Loader configuration.
 * @property {Phaser.Types.Core.ImagesConfig} [images] - Images configuration.
 * @property {Phaser.Types.Core.PhysicsConfig} [physics] - Physics configuration.
 * @property {Phaser.Types.Core.PluginObject|Phaser.Types.Core.PluginObjectItem[]} [plugins] - Plugins to install.
 * @property {Phaser.Types.Core.ScaleConfig} [scale] - The Scale Manager configuration.
 * @property {Phaser.Types.Core.AudioConfig} [audio] - The Audio Configuration object.
 */
