/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var CONST = require('../const');
var Device = require('../device');
var GetFastValue = require('../utils/object/GetFastValue');
var GetValue = require('../utils/object/GetValue');
var IsPlainObject = require('../utils/object/IsPlainObject');
var PhaserMath = require('../math/');
var NOOP = require('../utils/NOOP');
var DefaultPlugins = require('../plugins/DefaultPlugins');
var ValueToColor = require('../display/color/ValueToColor');

/**
 * This callback type is completely empty, a no-operation.
 *
 * @callback NOOP
 */

/**
 * @callback BootCallback
 *
 * @param {Phaser.Game} game - The game.
 */

/**
 * Config object containing various sound settings.
 *
 * @typedef {object} AudioConfig
 *
 * @property {boolean} [disableWebAudio=false] - Use HTML5 Audio instead of Web Audio.
 * @property {AudioContext} [context] - An existing Web Audio context.
 * @property {boolean} [noAudio=false] - Disable all audio output.
 *
 * @see Phaser.Sound.SoundManagerCreator
 */

/**
 * @typedef {object} InputConfig
 *
 * @property {(boolean|KeyboardInputConfig)} [keyboard=true] - Keyboard input configuration. `true` uses the default configuration and `false` disables keyboard input.
 * @property {(boolean|MouseInputConfig)} [mouse=true] - Mouse input configuration. `true` uses the default configuration and `false` disables mouse input.
 * @property {(boolean|TouchInputConfig)} [touch=true] - Touch input configuration. `true` uses the default configuration and `false` disables touch input.
 * @property {(boolean|GamepadInputConfig)} [gamepad=false] - Gamepad input configuration. `true` enables gamepad input.
 * @property {integer} [activePointers=1] - The maximum number of touch pointers. See {@link Phaser.Input.InputManager#pointers}.
 * @property {number} [smoothFactor=0] - The smoothing factor to apply during Pointer movement. See {@link Phaser.Input.Pointer#smoothFactor}.
 */

/**
 * @typedef {object} MouseInputConfig
 *
 * @property {*} [target=null] - Where the Mouse Manager listens for mouse input events. The default is the game canvas.
 * @property {boolean} [capture=true] - Whether mouse input events have `preventDefault` called on them.
 */

/**
 * @typedef {object} KeyboardInputConfig
 *
 * @property {*} [target=window] - Where the Keyboard Manager listens for keyboard input events.
 * @property {?integer} [capture] - `preventDefault` will be called on every non-modified key which has a key code in this array. By default it is empty.
 */

/**
 * @typedef {object} TouchInputConfig
 *
 * @property {*} [target=null] - Where the Touch Manager listens for touch input events. The default is the game canvas.
 * @property {boolean} [capture=true] - Whether touch input events have preventDefault() called on them.
 */

/**
 * @typedef {object} GamepadInputConfig
 *
 * @property {*} [target=window] - Where the Gamepad Manager listens for gamepad input events.
 */

/**
 * @typedef {object} BannerConfig
 *
 * @property {boolean} [hidePhaser=false] - Omit Phaser's name and version from the banner.
 * @property {string} [text='#ffffff'] - The color of the banner text.
 * @property {string[]} [background] - The background colors of the banner.
 */

/**
 * @typedef {object} FPSConfig
 *
 * @property {integer} [min=5] - The minimum acceptable rendering rate, in frames per second.
 * @property {integer} [target=60] - The optimum rendering rate, in frames per second.
 * @property {boolean} [forceSetTimeOut=false] - Use setTimeout instead of requestAnimationFrame to run the game loop.
 * @property {integer} [deltaHistory=10] - Calculate the average frame delta from this many consecutive frame intervals.
 * @property {integer} [panicMax=120] - The amount of frames the time step counts before we trust the delta values again.
 */

/**
 * @typedef {object} RenderConfig
 *
 * @property {boolean} [antialias=true] - When set to `true`, WebGL uses linear interpolation to draw scaled or rotated textures, giving a smooth appearance. When set to `false`, WebGL uses nearest-neighbor interpolation, giving a crisper appearance. `false` also disables antialiasing of the game canvas itself, if the browser supports it, when the game canvas is scaled.
 * @property {boolean} [pixelArt=false] - Sets `antialias` and `roundPixels` to true. This is the best setting for pixel-art games.
 * @property {boolean} [autoResize=true] - Automatically resize the Game Canvas if you resize the renderer.
 * @property {boolean} [roundPixels=false] - Draw texture-based Game Objects at only whole-integer positions. Game Objects without textures, like Graphics, ignore this property.
 * @property {boolean} [transparent=false] - Whether the game canvas will be transparent.
 * @property {boolean} [clearBeforeRender=true] - Whether the game canvas will be cleared between each rendering frame.
 * @property {boolean} [premultipliedAlpha=true] - In WebGL mode, the drawing buffer contains colors with pre-multiplied alpha.
 * @property {boolean} [failIfMajorPerformanceCaveat=false] - Let the browser abort creating a WebGL context if it judges performance would be unacceptable.
 * @property {string} [powerPreference='default'] - "high-performance", "low-power" or "default". A hint to the browser on how much device power the game might use.
 * @property {integer} [batchSize=2000] - The default WebGL batch size.
 * @property {integer} [maxLights=10] - The maximum number of lights allowed to be visible within range of a single Camera in the LightManager.
 */

/**
 * @typedef {object} ScaleConfig
 *
 * @property {(integer|string)} [width=1024] - The base width of your game.
 * @property {(integer|string)} [height=768] - The base height of your game.
 * @property {integer} [zoom=1] - The zoom value of the game canvas.
 * @property {number} [resolution=1] - The rendering resolution of the canvas.
 * @property {(HTMLElement|string)} [parent] - The DOM element that will contain the game canvas, or its `id`. If null (the default) or if the named element doesn't exist, the game canvas is inserted directly into the document body.
 * @property {integer} [mode=0] - The scale mode to apply to the canvas. SHOW_ALL, EXACT_FIT, USER_SCALE, or RESIZE.
 * @property {integer} [minWidth] - The minimum width the canvas can be scaled down to.
 * @property {integer} [minHeight] - The minimum height the canvas can be scaled down to.
 * @property {integer} [maxWidth] - The maximum width the canvas can be scaled up to.
 * @property {integer} [maxHeight] - The maximum height the canvas can be scaled up to.
 */

/**
 * @typedef {object} CallbacksConfig
 *
 * @property {BootCallback} [preBoot=NOOP] - A function to run at the start of the boot sequence.
 * @property {BootCallback} [postBoot=NOOP] - A function to run at the end of the boot sequence. At this point, all the game systems have started and plugins have been loaded.
 */

/**
 * @typedef {object} LoaderConfig
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

/**
 * @typedef {object} DOMContainerConfig
 *
 * @property {boolean} [createContainer=false] - Create a div element in which DOM Elements will be contained. You must also provide a parent.
 * @property {boolean} [behindCanvas=false] - Place the DOM Container behind the Phaser Canvas. The default is to place it over the Canvas.
 */

/**
 * @typedef {object} ImagesConfig
 *
 * @property {string} [default] - URL to use for the 'default' texture.
 * @property {string} [missing] - URL to use for the 'missing' texture.
 */

/**
  * @typedef {object} PhysicsConfig
  *
  * @property {string} [default] - The default physics system. It will be started for each scene. Phaser provides 'arcade', 'impact', and 'matter'.
  * @property {ArcadeWorldConfig} [arcade] - Arcade Physics configuration.
  * @property {Phaser.Physics.Impact.WorldConfig} [impact] - Impact Physics configuration.
  * @property {object} [matter] - Matter Physics configuration.
  */

/**
 * @typedef {object} PluginObjectItem
 *
 * @property {string} [key] - A key to identify the plugin in the Plugin Manager.
 * @property {*} [plugin] - The plugin itself. Usually a class/constructor.
 * @property {boolean} [start] - Whether the plugin should be started automatically.
 * @property {string} [systemKey] - For a scene plugin, add the plugin to the scene's systems object under this key (`this.sys.KEY`, from the scene).
 * @property {string} [sceneKey] - For a scene plugin, add the plugin to the scene object under this key (`this.KEY`, from the scene).
 * @property {string} [mapping] - If this plugin is to be injected into the Scene Systems, this is the property key map used.
 * @property {*} [data] - Arbitrary data passed to the plugin's init() method.
 *
 * @example
 * // Global plugin
 * { key: 'BankPlugin', plugin: BankPluginV3, start: true, data: { gold: 5000 } }
 * @example
 * // Scene plugin
 * { key: 'WireFramePlugin', plugin: WireFramePlugin, systemKey: 'wireFramePlugin', sceneKey: 'wireframe' }
 */

/**
 * @typedef {object} PluginObject
 *
 * @property {?PluginObjectItem[]} [global] - Global plugins to install.
 * @property {?PluginObjectItem[]} [scene] - Scene plugins to install.
 * @property {string[]} [default] - The default set of scene plugins (names).
 * @property {string[]} [defaultMerge] - Plugins to *add* to the default set of scene plugins.
 */

/**
 * @typedef {object} GameConfig
 *
 * @property {(integer|string)} [width=1024] - The width of the game, in game pixels.
 * @property {(integer|string)} [height=768] - The height of the game, in game pixels.
 * @property {number} [zoom=1] - Simple scale applied to the game canvas. 2 is double size, 0.5 is half size, etc.
 * @property {number} [resolution=1] - The size of each game pixel, in canvas pixels. Values larger than 1 are "high" resolution.
 * @property {number} [type=CONST.AUTO] - Which renderer to use. Phaser.AUTO, Phaser.CANVAS, Phaser.HEADLESS, or Phaser.WEBGL. AUTO picks WEBGL if available, otherwise CANVAS.
 * @property {(HTMLElement|string)} [parent=null] - The DOM element that will contain the game canvas, or its `id`. If null (the default) or if the named element doesn't exist, the game canvas is inserted directly into the document body.
 * @property {HTMLCanvasElement} [canvas=null] - Provide your own Canvas element for Phaser to use instead of creating one.
 * @property {string} [canvasStyle=null] - CSS styles to apply to the game canvas instead of Phaser's default styles.
 * @property {CanvasRenderingContext2D} [context] - Provide your own Canvas Context for Phaser to use, instead of creating one.
 * @property {object} [scene=null] - A scene or scenes to add to the game. If several are given, the first is started; the remainder are started only if they have { active: true }.
 * @property {string[]} [seed] - Seed for the random number generator.
 * @property {string} [title=''] - The title of the game. Shown in the browser console.
 * @property {string} [url='http://phaser.io'] - The URL of the game. Shown in the browser console.
 * @property {string} [version=''] - The version of the game. Shown in the browser console.
 * @property {boolean} [autoFocus=true] - Automatically call window.focus() when the game boots. Usually necessary to capture input events if the game is in a separate frame.
 * @property {(boolean|InputConfig)} [input] - Input configuration, or `false` to disable all game input.
 * @property {boolean} [disableContextMenu=false] - Disable the browser's default 'contextmenu' event (usually triggered by a right-button mouse click).
 * @property {(boolean|BannerConfig)} [banner=false] - Configuration for the banner printed in the browser console when the game starts.
 * @property {DOMContainerConfig} [dom] - The DOM Container configuration object.
 * @property {FPSConfig} [fps] - Game loop configuration.
 * @property {RenderConfig} [render] - Game renderer configuration.
 * @property {(string|number)} [backgroundColor=0x000000] - The background color of the game canvas. The default is black.
 * @property {CallbacksConfig} [callbacks] - Optional callbacks to run before or after game boot.
 * @property {LoaderConfig} [loader] - Loader configuration.
 * @property {ImagesConfig} [images] - Images configuration.
 * @property {object} [physics] - Physics configuration.
 * @property {PluginObject|PluginObjectItem[]} [plugins] - Plugins to install.
 */

/**
 * @classdesc
 * The active game configuration settings, parsed from a {@link GameConfig} object.
 *
 * @class Config
 * @memberof Phaser.Boot
 * @constructor
 * @since 3.0.0
 *
 * @param {GameConfig} [GameConfig] - The configuration object for your Phaser Game instance.
 *
 * @see Phaser.Game#config
 */
var Config = new Class({

    initialize:

    function Config (config)
    {
        if (config === undefined) { config = {}; }

        var defaultBannerColor = [
            '#ff0000',
            '#ffff00',
            '#00ff00',
            '#00ffff',
            '#000000'
        ];

        var defaultBannerTextColor = '#ffffff';

        /**
         * @const {(integer|string)} Phaser.Boot.Config#width - The width of the underlying canvas, in pixels.
         */
        this.width = GetValue(config, 'width', 1024);

        /**
         * @const {(integer|string)} Phaser.Boot.Config#height - The height of the underlying canvas, in pixels.
         */
        this.height = GetValue(config, 'height', 768);

        /**
         * @const {number} Phaser.Boot.Config#zoom - The zoom factor, as used by the Scale Manager.
         */
        this.zoom = GetValue(config, 'zoom', 1);

        /**
         * @const {number} Phaser.Boot.Config#resolution - The canvas device pixel resolution.
         */
        this.resolution = GetValue(config, 'resolution', 1);

        /**
         * @const {?*} Phaser.Boot.Config#parent - A parent DOM element into which the canvas created by the renderer will be injected.
         */
        this.parent = GetValue(config, 'parent', null);

        /**
         * @const {integer} Phaser.Boot.Config#scaleMode - The scale mode as used by the Scale Manager. The default is zero, which is no scaling.
         */
        this.scaleMode = GetValue(config, 'scaleMode', 0);

        /**
         * @const {boolean} Phaser.Boot.Config#expandParent - Is the Scale Manager allowed to adjust the size of the parent container?
         */
        this.expandParent = GetValue(config, 'expandParent', false);

        /**
         * @const {integer} Phaser.Boot.Config#minWidth - The minimum width, in pixels, the canvas will scale down to. A value of zero means no minimum.
         */
        this.minWidth = GetValue(config, 'minWidth', 0);

        /**
         * @const {integer} Phaser.Boot.Config#maxWidth - The maximum width, in pixels, the canvas will scale up to. A value of zero means no maximum.
         */
        this.maxWidth = GetValue(config, 'maxWidth', 0);

        /**
         * @const {integer} Phaser.Boot.Config#minHeight - The minimum height, in pixels, the canvas will scale down to. A value of zero means no minimum.
         */
        this.minHeight = GetValue(config, 'minHeight', 0);

        /**
         * @const {integer} Phaser.Boot.Config#maxHeight - The maximum height, in pixels, the canvas will scale up to. A value of zero means no maximum.
         */
        this.maxHeight = GetValue(config, 'maxHeight', 0);

        //  Scale Manager - Anything set in here over-rides anything set above

        var scaleConfig = GetValue(config, 'scale', null);

        if (scaleConfig)
        {
            this.width = GetValue(scaleConfig, 'width', this.width);
            this.height = GetValue(scaleConfig, 'height', this.height);
            this.zoom = GetValue(scaleConfig, 'zoom', this.zoom);
            this.resolution = GetValue(scaleConfig, 'resolution', this.resolution);
            this.parent = GetValue(scaleConfig, 'parent', this.parent);
            this.scaleMode = GetValue(scaleConfig, 'mode', this.scaleMode);
            this.expandParent = GetValue(scaleConfig, 'mode', this.expandParent);
            this.minWidth = GetValue(scaleConfig, 'min.width', this.minWidth);
            this.maxWidth = GetValue(scaleConfig, 'max.width', this.maxWidth);
            this.minHeight = GetValue(scaleConfig, 'min.height', this.minHeight);
            this.maxHeight = GetValue(scaleConfig, 'max.height', this.maxHeight);
        }

        /**
         * @const {number} Phaser.Boot.Config#renderType - Force Phaser to use a specific renderer. Can be `CONST.CANVAS`, `CONST.WEBGL`, `CONST.HEADLESS` or `CONST.AUTO` (default)
         */
        this.renderType = GetValue(config, 'type', CONST.AUTO);

        /**
         * @const {?HTMLCanvasElement} Phaser.Boot.Config#canvas - Force Phaser to use your own Canvas element instead of creating one.
         */
        this.canvas = GetValue(config, 'canvas', null);

        /**
         * @const {?(CanvasRenderingContext2D|WebGLRenderingContext)} Phaser.Boot.Config#context - Force Phaser to use your own Canvas context instead of creating one.
         */
        this.context = GetValue(config, 'context', null);

        /**
         * @const {?string} Phaser.Boot.Config#canvasStyle - Optional CSS attributes to be set on the canvas object created by the renderer.
         */
        this.canvasStyle = GetValue(config, 'canvasStyle', null);

        /**
         * @const {boolean} Phaser.Boot.Config#customEnvironment - Is Phaser running under a custom (non-native web) environment? If so, set this to `true` to skip internal Feature detection. If `true` the `renderType` cannot be left as `AUTO`.
         */
        this.customEnvironment = GetValue(config, 'customEnvironment', false);

        /**
         * @const {?object} Phaser.Boot.Config#sceneConfig - The default Scene configuration object.
         */
        this.sceneConfig = GetValue(config, 'scene', null);

        /**
         * @const {string[]} Phaser.Boot.Config#seed - A seed which the Random Data Generator will use. If not given, a dynamic seed based on the time is used.
         */
        this.seed = GetValue(config, 'seed', [ (Date.now() * Math.random()).toString() ]);

        PhaserMath.RND = new PhaserMath.RandomDataGenerator(this.seed);

        /**
         * @const {string} Phaser.Boot.Config#gameTitle - The title of the game.
         */
        this.gameTitle = GetValue(config, 'title', '');

        /**
         * @const {string} Phaser.Boot.Config#gameURL - The URL of the game.
         */
        this.gameURL = GetValue(config, 'url', 'https://phaser.io');

        /**
         * @const {string} Phaser.Boot.Config#gameVersion - The version of the game.
         */
        this.gameVersion = GetValue(config, 'version', '');

        /**
         * @const {boolean} Phaser.Boot.Config#autoFocus - If `true` the window will automatically be given focus immediately and on any future mousedown event.
         */
        this.autoFocus = GetValue(config, 'autoFocus', true);

        //  DOM Element Container

        /**
         * @const {?boolean} Phaser.Boot.Config#domCreateContainer - EXPERIMENTAL: Do not currently use.
         */
        this.domCreateContainer = GetValue(config, 'dom.createContainer', false);

        /**
         * @const {?boolean} Phaser.Boot.Config#domBehindCanvas - EXPERIMENTAL: Do not currently use.
         */
        this.domBehindCanvas = GetValue(config, 'dom.behindCanvas', false);

        //  Input

        /**
         * @const {boolean} Phaser.Boot.Config#inputKeyboard - Enable the Keyboard Plugin. This can be disabled in games that don't need keyboard input.
         */
        this.inputKeyboard = GetValue(config, 'input.keyboard', true);

        /**
         * @const {*} Phaser.Boot.Config#inputKeyboardEventTarget - The DOM Target to listen for keyboard events on. Defaults to `window` if not specified.
         */
        this.inputKeyboardEventTarget = GetValue(config, 'input.keyboard.target', window);

        /**
         * @const {?integer[]} Phaser.Boot.Config#inputKeyboardCapture - `preventDefault` will be called on every non-modified key which has a key code in this array. By default, it is empty.
         */
        this.inputKeyboardCapture = GetValue(config, 'input.keyboard.capture', []);

        /**
         * @const {(boolean|object)} Phaser.Boot.Config#inputMouse - Enable the Mouse Plugin. This can be disabled in games that don't need mouse input.
         */
        this.inputMouse = GetValue(config, 'input.mouse', true);

        /**
         * @const {?*} Phaser.Boot.Config#inputMouseEventTarget - The DOM Target to listen for mouse events on. Defaults to the game canvas if not specified.
         */
        this.inputMouseEventTarget = GetValue(config, 'input.mouse.target', null);

        /**
         * @const {boolean} Phaser.Boot.Config#inputMouseCapture - Should mouse events be captured? I.e. have prevent default called on them.
         */
        this.inputMouseCapture = GetValue(config, 'input.mouse.capture', true);

        /**
         * @const {boolean} Phaser.Boot.Config#inputTouch - Enable the Touch Plugin. This can be disabled in games that don't need touch input.
         */
        this.inputTouch = GetValue(config, 'input.touch', Device.input.touch);

        /**
         * @const {?*} Phaser.Boot.Config#inputTouchEventTarget - The DOM Target to listen for touch events on. Defaults to the game canvas if not specified.
         */
        this.inputTouchEventTarget = GetValue(config, 'input.touch.target', null);

        /**
         * @const {boolean} Phaser.Boot.Config#inputTouchCapture - Should touch events be captured? I.e. have prevent default called on them.
         */
        this.inputTouchCapture = GetValue(config, 'input.touch.capture', true);

        /**
         * @const {integer} Phaser.Boot.Config#inputActivePointers - The number of Pointer objects created by default. In a mouse-only, or non-multi touch game, you can leave this as 1.
         */
        this.inputActivePointers = GetValue(config, 'input.activePointers', 1);

        /**
         * @const {integer} Phaser.Boot.Config#inputSmoothFactor - The smoothing factor to apply during Pointer movement. See {@link Phaser.Input.Pointer#smoothFactor}.
         */
        this.inputSmoothFactor = GetValue(config, 'input.smoothFactor', 0);

        /**
         * @const {boolean} Phaser.Boot.Config#inputGamepad - Enable the Gamepad Plugin. This can be disabled in games that don't need gamepad input.
         */
        this.inputGamepad = GetValue(config, 'input.gamepad', false);

        /**
         * @const {*} Phaser.Boot.Config#inputGamepadEventTarget - The DOM Target to listen for gamepad events on. Defaults to `window` if not specified.
         */
        this.inputGamepadEventTarget = GetValue(config, 'input.gamepad.target', window);

        /**
         * @const {boolean} Phaser.Boot.Config#disableContextMenu - Set to `true` to disable the right-click context menu.
         */
        this.disableContextMenu = GetValue(config, 'disableContextMenu', false);

        /**
         * @const {AudioConfig} Phaser.Boot.Config#audio - The Audio Configuration object.
         */
        this.audio = GetValue(config, 'audio');

        //  If you do: { banner: false } it won't display any banner at all

        /**
         * @const {boolean} Phaser.Boot.Config#hideBanner - Don't write the banner line to the console.log.
         */
        this.hideBanner = (GetValue(config, 'banner', null) === false);

        /**
         * @const {boolean} Phaser.Boot.Config#hidePhaser - Omit Phaser's name and version from the banner.
         */
        this.hidePhaser = GetValue(config, 'banner.hidePhaser', false);

        /**
         * @const {string} Phaser.Boot.Config#bannerTextColor - The color of the banner text.
         */
        this.bannerTextColor = GetValue(config, 'banner.text', defaultBannerTextColor);

        /**
         * @const {string[]} Phaser.Boot.Config#bannerBackgroundColor - The background colors of the banner.
         */
        this.bannerBackgroundColor = GetValue(config, 'banner.background', defaultBannerColor);

        if (this.gameTitle === '' && this.hidePhaser)
        {
            this.hideBanner = true;
        }

        /**
         * @const {?FPSConfig} Phaser.Boot.Config#fps - The Frame Rate Configuration object, as parsed by the Timestep class.
         */
        this.fps = GetValue(config, 'fps', null);

        //  Renderer Settings
        //  These can either be in a `render` object within the Config, or specified on their own

        var renderConfig = GetValue(config, 'render', config);

        /**
         * @const {boolean} Phaser.Boot.Config#autoResize - Automatically resize the Game Canvas if you resize the renderer.
         */
        this.autoResize = GetValue(renderConfig, 'autoResize', true);

        /**
         * @const {boolean} Phaser.Boot.Config#antialias - When set to `true`, WebGL uses linear interpolation to draw scaled or rotated textures, giving a smooth appearance. When set to `false`, WebGL uses nearest-neighbor interpolation, giving a crisper appearance. `false` also disables antialiasing of the game canvas itself, if the browser supports it, when the game canvas is scaled.
         */
        this.antialias = GetValue(renderConfig, 'antialias', true);

        /**
         * @const {boolean} Phaser.Boot.Config#roundPixels - Draw texture-based Game Objects at only whole-integer positions. Game Objects without textures, like Graphics, ignore this property.
         */
        this.roundPixels = GetValue(renderConfig, 'roundPixels', false);

        /**
         * @const {boolean} Phaser.Boot.Config#pixelArt - Prevent pixel art from becoming blurred when scaled. It will remain crisp (tells the WebGL renderer to automatically create textures using a linear filter mode).
         */
        this.pixelArt = GetValue(renderConfig, 'pixelArt', false);

        if (this.pixelArt)
        {
            this.antialias = false;
            this.roundPixels = true;
        }

        /**
         * @const {boolean} Phaser.Boot.Config#transparent - Whether the game canvas will have a transparent background.
         */
        this.transparent = GetValue(renderConfig, 'transparent', false);

        /**
         * @const {boolean} Phaser.Boot.Config#clearBeforeRender - Whether the game canvas will be cleared between each rendering frame. You can disable this if you have a full-screen background image or game object.
         */
        this.clearBeforeRender = GetValue(renderConfig, 'clearBeforeRender', true);

        /**
         * @const {boolean} Phaser.Boot.Config#premultipliedAlpha - In WebGL mode, sets the drawing buffer to contain colors with pre-multiplied alpha.
         */
        this.premultipliedAlpha = GetValue(renderConfig, 'premultipliedAlpha', true);

        /**
         * @const {boolean} Phaser.Boot.Config#failIfMajorPerformanceCaveat - Let the browser abort creating a WebGL context if it judges performance would be unacceptable.
         */
        this.failIfMajorPerformanceCaveat = GetValue(renderConfig, 'failIfMajorPerformanceCaveat', false);

        /**
         * @const {string} Phaser.Boot.Config#powerPreference - "high-performance", "low-power" or "default". A hint to the browser on how much device power the game might use.
         */
        this.powerPreference = GetValue(renderConfig, 'powerPreference', 'default');

        /**
         * @const {integer} Phaser.Boot.Config#batchSize - The default WebGL Batch size.
         */
        this.batchSize = GetValue(renderConfig, 'batchSize', 2000);

        /**
         * @const {integer} Phaser.Boot.Config#maxLights - The maximum number of lights allowed to be visible within range of a single Camera in the LightManager.
         */
        this.maxLights = GetValue(renderConfig, 'maxLights', 10);

        var bgc = GetValue(config, 'backgroundColor', 0);

        /**
         * @const {Phaser.Display.Color} Phaser.Boot.Config#backgroundColor - The background color of the game canvas. The default is black. This value is ignored if `transparent` is set to `true`.
         */
        this.backgroundColor = ValueToColor(bgc);

        if (bgc === 0 && this.transparent)
        {
            this.backgroundColor.alpha = 0;
        }

        /**
         * @const {BootCallback} Phaser.Boot.Config#preBoot - Called before Phaser boots. Useful for initializing anything not related to Phaser that Phaser may require while booting.
         */
        this.preBoot = GetValue(config, 'callbacks.preBoot', NOOP);

        /**
         * @const {BootCallback} Phaser.Boot.Config#postBoot - A function to run at the end of the boot sequence. At this point, all the game systems have started and plugins have been loaded.
         */
        this.postBoot = GetValue(config, 'callbacks.postBoot', NOOP);

        /**
         * @const {PhysicsConfig} Phaser.Boot.Config#physics - The Physics Configuration object.
         */
        this.physics = GetValue(config, 'physics', {});

        /**
         * @const {(boolean|string)} Phaser.Boot.Config#defaultPhysicsSystem - The default physics system. It will be started for each scene. Either 'arcade', 'impact' or 'matter'.
         */
        this.defaultPhysicsSystem = GetValue(this.physics, 'default', false);

        /**
         * @const {string} Phaser.Boot.Config#loaderBaseURL - A URL used to resolve paths given to the loader. Example: 'http://labs.phaser.io/assets/'.
         */
        this.loaderBaseURL = GetValue(config, 'loader.baseURL', '');

        /**
         * @const {string} Phaser.Boot.Config#loaderPath - A URL path used to resolve relative paths given to the loader. Example: 'images/sprites/'.
         */
        this.loaderPath = GetValue(config, 'loader.path', '');

        /**
         * @const {integer} Phaser.Boot.Config#loaderMaxParallelDownloads - Maximum parallel downloads allowed for resources (Default to 32).
         */
        this.loaderMaxParallelDownloads = GetValue(config, 'loader.maxParallelDownloads', 32);

        /**
         * @const {(string|undefined)} Phaser.Boot.Config#loaderCrossOrigin - 'anonymous', 'use-credentials', or `undefined`. If you're not making cross-origin requests, leave this as `undefined`. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes}.
         */
        this.loaderCrossOrigin = GetValue(config, 'loader.crossOrigin', undefined);

        /**
         * @const {string} Phaser.Boot.Config#loaderResponseType - The response type of the XHR request, e.g. `blob`, `text`, etc.
         */
        this.loaderResponseType = GetValue(config, 'loader.responseType', '');

        /**
         * @const {boolean} Phaser.Boot.Config#loaderAsync - Should the XHR request use async or not?
         */
        this.loaderAsync = GetValue(config, 'loader.async', true);

        /**
         * @const {string} Phaser.Boot.Config#loaderUser - Optional username for all XHR requests.
         */
        this.loaderUser = GetValue(config, 'loader.user', '');

        /**
         * @const {string} Phaser.Boot.Config#loaderPassword - Optional password for all XHR requests.
         */
        this.loaderPassword = GetValue(config, 'loader.password', '');

        /**
         * @const {integer} Phaser.Boot.Config#loaderTimeout - Optional XHR timeout value, in ms.
         */
        this.loaderTimeout = GetValue(config, 'loader.timeout', 0);

        /*
         * Allows `plugins` property to either be an array, in which case it just replaces
         * the default plugins like previously, or a config object.
         *
         * plugins: {
         *    global: [
         *        { key: 'TestPlugin', plugin: TestPlugin, start: true, data: { msg: 'The plugin is alive' } },
         *    ],
         *    scene: [
         *        { key: 'WireFramePlugin', plugin: WireFramePlugin, systemKey: 'wireFramePlugin', sceneKey: 'wireframe' }
         *    ],
         *    default: [], OR
         *    defaultMerge: [
         *        'ModPlayer'
         *    ]
         * }
         */

        /**
         * @const {any} Phaser.Boot.Config#installGlobalPlugins - An array of global plugins to be installed.
         */
        this.installGlobalPlugins = [];

        /**
         * @const {any} Phaser.Boot.Config#installScenePlugins - An array of Scene level plugins to be installed.
         */
        this.installScenePlugins = [];

        var plugins = GetValue(config, 'plugins', null);
        var defaultPlugins = DefaultPlugins.DefaultScene;

        if (plugins)
        {
            //  Old 3.7 array format?
            if (Array.isArray(plugins))
            {
                this.defaultPlugins = plugins;
            }
            else if (IsPlainObject(plugins))
            {
                this.installGlobalPlugins = GetFastValue(plugins, 'global', []);
                this.installScenePlugins = GetFastValue(plugins, 'scene', []);

                if (Array.isArray(plugins.default))
                {
                    defaultPlugins = plugins.default;
                }
                else if (Array.isArray(plugins.defaultMerge))
                {
                    defaultPlugins = defaultPlugins.concat(plugins.defaultMerge);
                }
            }
        }

        /**
         * @const {any} Phaser.Boot.Config#defaultPlugins - The plugins installed into every Scene (in addition to CoreScene and Global).
         */
        this.defaultPlugins = defaultPlugins;

        //  Default / Missing Images
        var pngPrefix = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAg';

        /**
         * @const {string} Phaser.Boot.Config#defaultImage - A base64 encoded PNG that will be used as the default blank texture.
         */
        this.defaultImage = GetValue(config, 'images.default', pngPrefix + 'AQMAAABJtOi3AAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAABVJREFUeF7NwIEAAAAAgKD9qdeocAMAoAABm3DkcAAAAABJRU5ErkJggg==');

        /**
         * @const {string} Phaser.Boot.Config#missingImage - A base64 encoded PNG that will be used as the default texture when a texture is assigned that is missing or not loaded.
         */
        this.missingImage = GetValue(config, 'images.missing', pngPrefix + 'CAIAAAD8GO2jAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAJ9JREFUeNq01ssOwyAMRFG46v//Mt1ESmgh+DFmE2GPOBARKb2NVjo+17PXLD8a1+pl5+A+wSgFygymWYHBb0FtsKhJDdZlncG2IzJ4ayoMDv20wTmSMzClEgbWYNTAkQ0Z+OJ+A/eWnAaR9+oxCF4Os0H8htsMUp+pwcgBBiMNnAwF8GqIgL2hAzaGFFgZauDPKABmowZ4GL369/0rwACp2yA/ttmvsQAAAABJRU5ErkJggg==');

        if (window)
        {
            if (window.FORCE_WEBGL)
            {
                this.renderType = CONST.WEBGL;
            }
            else if (window.FORCE_CANVAS)
            {
                this.renderType = CONST.CANVAS;
            }
        }
    }

});

module.exports = Config;
