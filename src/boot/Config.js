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
var MATH = require('../math/const');
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
 * @typedef {object} InputConfig
 *
 * @property {(boolean|KeyboardInputConfig)} [keyboard=true] - Keyboard input configuration. `true` uses the default configuration and `false` disables keyboard input.
 * @property {(boolean|MouseInputConfig)} [mouse=true] - Mouse input configuration. `true` uses the default configuration and `false` disables mouse input.
 * @property {(boolean|TouchInputConfig)} [touch=true] - Touch input configuration. `true` uses the default configuration and `false` disables touch input.
 * @property {(boolean|GamepadInputConfig)} [gamepad=false] - Gamepad input configuration. `true` enables gamepad input.
 * @property {integer} [activePointers=1] - The maximum number of touch pointers. See {@link Phaser.Input.InputManager#pointers}.
 */

/**
 * @typedef {object} MouseInputConfig
 *
 * @property {*} [target=null] - Where the Mouse Manager listens for mouse input events. The default is the game canvas.
 * @property {boolean} [capture=true] - Whether mouse input events have preventDefault() called on them.
 */

/**
 * @typedef {object} KeyboardInputConfig
 *
 * @property {*} [target=window] - Where the Keyboard Manager listens for keyboard input events.
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
 * @property {integer} [min=10] - The minimum acceptable rendering rate, in frames per second.
 * @property {integer} [target=60] - The optimum rendering rate, in frames per second.
 * @property {boolean} [forceSetTimeOut=false] - Use setTimeout instead of requestAnimationFrame to run the game loop.
 * @property {integer} [deltaHistory=10] - Calculate the average frame delta from this many consecutive frame intervals.
 * @property {integer} [panicMax=120] - [description]
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
 * @property {boolean} [preserveDrawingBuffer=false] - In WebGL mode, the drawing buffer won't be cleared automatically each frame.
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
 * @property {string} [baseURL] - An URL used to resolve paths given to the loader. Example: 'http://labs.phaser.io/assets/'.
 * @property {string} [path] - An URL path used to resolve relative paths given to the loader. Example: 'images/sprites/'.
 * @property {integer} [maxParallelDownloads=32] - The maximum number of resources the loader will start loading at once.
 * @property {(string|undefined)} [crossOrigin=undefined] - 'anonymous', 'use-credentials', or `undefined`. If you're not making cross-origin requests, leave this as `undefined`. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes}.
 * @property {string} [responseType] - The response type of the XHR request, e.g. `blob`, `text`, etc.
 * @property {boolean} [async=true] - Should the XHR request use async or not?
 * @property {string} [user] - Optional username for the XHR request.
 * @property {string} [password] - Optional password for the XHR request.
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
         * @const {(integer|string)} Phaser.Boot.Config#width - [description]
         */
        this.width = GetValue(config, 'width', 1024);

        /**
         * @const {(integer|string)} Phaser.Boot.Config#height - [description]
         */
        this.height = GetValue(config, 'height', 768);

        /**
         * @const {number} Phaser.Boot.Config#zoom - [description]
         */
        this.zoom = GetValue(config, 'zoom', 1);

        /**
         * @const {number} Phaser.Boot.Config#resolution - [description]
         */
        this.resolution = GetValue(config, 'resolution', 1);

        /**
         * @const {?*} Phaser.Boot.Config#parent - [description]
         */
        this.parent = GetValue(config, 'parent', null);

        /**
         * @const {integer} Phaser.Boot.Config#scaleMode - [description]
         */
        this.scaleMode = GetValue(config, 'scaleMode', 0);

        /**
         * @const {boolean} Phaser.Boot.Config#expandParent - [description]
         */
        this.expandParent = GetValue(config, 'expandParent', false);

        /**
         * @const {integer} Phaser.Boot.Config#minWidth - [description]
         */
        this.minWidth = GetValue(config, 'minWidth', 0);

        /**
         * @const {integer} Phaser.Boot.Config#maxWidth - [description]
         */
        this.maxWidth = GetValue(config, 'maxWidth', 0);

        /**
         * @const {integer} Phaser.Boot.Config#minHeight - [description]
         */
        this.minHeight = GetValue(config, 'minHeight', 0);

        /**
         * @const {integer} Phaser.Boot.Config#maxHeight - [description]
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
         * @const {?string} Phaser.Boot.Config#canvasStyle - [description]
         */
        this.canvasStyle = GetValue(config, 'canvasStyle', null);

        /**
         * @const {?object} Phaser.Boot.Config#sceneConfig - [description]
         */
        this.sceneConfig = GetValue(config, 'scene', null);

        /**
         * @const {string[]} Phaser.Boot.Config#seed - [description]
         */
        this.seed = GetValue(config, 'seed', [ (Date.now() * Math.random()).toString() ]);

        MATH.RND.init(this.seed);

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
         * @const {boolean} Phaser.Boot.Config#autoFocus - [description]
         */
        this.autoFocus = GetValue(config, 'autoFocus', true);

        //  DOM Element Container

        /**
         * @const {?boolean} Phaser.Boot.Config#domCreateContainer - [description]
         */
        this.domCreateContainer = GetValue(config, 'dom.createContainer', false);

        /**
         * @const {?boolean} Phaser.Boot.Config#domBehindCanvas - [description]
         */
        this.domBehindCanvas = GetValue(config, 'dom.behindCanvas', false);

        //  Input

        /**
         * @const {boolean} Phaser.Boot.Config#inputKeyboard - [description]
         */
        this.inputKeyboard = GetValue(config, 'input.keyboard', true);

        /**
         * @const {*} Phaser.Boot.Config#inputKeyboardEventTarget - [description]
         */
        this.inputKeyboardEventTarget = GetValue(config, 'input.keyboard.target', window);

        /**
         * @const {(boolean|object)} Phaser.Boot.Config#inputMouse - [description]
         */
        this.inputMouse = GetValue(config, 'input.mouse', true);

        /**
         * @const {?*} Phaser.Boot.Config#inputMouseEventTarget - [description]
         */
        this.inputMouseEventTarget = GetValue(config, 'input.mouse.target', null);

        /**
         * @const {boolean} Phaser.Boot.Config#inputMouseCapture - [description]
         */
        this.inputMouseCapture = GetValue(config, 'input.mouse.capture', true);

        /**
         * @const {boolean} Phaser.Boot.Config#inputTouch - [description]
         */
        this.inputTouch = GetValue(config, 'input.touch', Device.input.touch);

        /**
         * @const {?*} Phaser.Boot.Config#inputTouchEventTarget - [description]
         */
        this.inputTouchEventTarget = GetValue(config, 'input.touch.target', null);

        /**
         * @const {boolean} Phaser.Boot.Config#inputTouchCapture - [description]
         */
        this.inputTouchCapture = GetValue(config, 'input.touch.capture', true);

        /**
         * @const {integer} Phaser.Boot.Config#inputActivePointers - [description]
         */
        this.inputActivePointers = GetValue(config, 'input.activePointers', 1);

        /**
         * @const {boolean} Phaser.Boot.Config#inputGamepad - [description]
         */
        this.inputGamepad = GetValue(config, 'input.gamepad', false);

        /**
         * @const {*} Phaser.Boot.Config#inputGamepadEventTarget - [description]
         */
        this.inputGamepadEventTarget = GetValue(config, 'input.gamepad.target', window);

        /**
         * @const {boolean} Phaser.Boot.Config#disableContextMenu - Set to `true` to disable context menu. Default value is `false`.
         */
        this.disableContextMenu = GetValue(config, 'disableContextMenu', false);

        /**
         * @const {any} Phaser.Boot.Config#audio - [description]
         */
        this.audio = GetValue(config, 'audio');

        //  If you do: { banner: false } it won't display any banner at all

        /**
         * @const {boolean} Phaser.Boot.Config#hideBanner - [description]
         */
        this.hideBanner = (GetValue(config, 'banner', null) === false);

        /**
         * @const {boolean} Phaser.Boot.Config#hidePhaser - [description]
         */
        this.hidePhaser = GetValue(config, 'banner.hidePhaser', false);

        /**
         * @const {string} Phaser.Boot.Config#bannerTextColor - [description]
         */
        this.bannerTextColor = GetValue(config, 'banner.text', defaultBannerTextColor);

        /**
         * @const {string[]} Phaser.Boot.Config#bannerBackgroundColor - [description]
         */
        this.bannerBackgroundColor = GetValue(config, 'banner.background', defaultBannerColor);

        if (this.gameTitle === '' && this.hidePhaser)
        {
            this.hideBanner = true;
        }

        //  Frame Rate config
        //      fps: {
        //          min: 10,
        //          target: 60,
        //          forceSetTimeOut: false,
        //          deltaHistory: 10
        //     }

        /**
         * @const {?FPSConfig} Phaser.Boot.Config#fps - [description]
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
         * @const {boolean} Phaser.Boot.Config#antialias - [description]
         */
        this.antialias = GetValue(renderConfig, 'antialias', true);

        /**
         * @const {boolean} Phaser.Boot.Config#roundPixels - [description]
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
         * @const {boolean} Phaser.Boot.Config#transparent - [description]
         */
        this.transparent = GetValue(renderConfig, 'transparent', false);

        /**
         * @const {boolean} Phaser.Boot.Config#clearBeforeRender - [description]
         */
        this.clearBeforeRender = GetValue(renderConfig, 'clearBeforeRender', true);

        /**
         * @const {boolean} Phaser.Boot.Config#premultipliedAlpha - [description]
         */
        this.premultipliedAlpha = GetValue(renderConfig, 'premultipliedAlpha', true);

        /**
         * @const {boolean} Phaser.Boot.Config#preserveDrawingBuffer - [description]
         */
        this.preserveDrawingBuffer = GetValue(renderConfig, 'preserveDrawingBuffer', false);

        /**
         * @const {boolean} Phaser.Boot.Config#failIfMajorPerformanceCaveat - [description]
         */
        this.failIfMajorPerformanceCaveat = GetValue(renderConfig, 'failIfMajorPerformanceCaveat', false);

        /**
         * @const {string} Phaser.Boot.Config#powerPreference - [description]
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
         * @const {Phaser.Display.Color} Phaser.Boot.Config#backgroundColor - [description]
         */
        this.backgroundColor = ValueToColor(bgc);

        if (bgc === 0 && this.transparent)
        {
            this.backgroundColor.alpha = 0;
        }

        //  Callbacks

        /**
         * @const {BootCallback} Phaser.Boot.Config#preBoot - [description]
         */
        this.preBoot = GetValue(config, 'callbacks.preBoot', NOOP);

        /**
         * @const {BootCallback} Phaser.Boot.Config#postBoot - [description]
         */
        this.postBoot = GetValue(config, 'callbacks.postBoot', NOOP);

        //  Physics
        //  physics: {
        //      system: 'impact',
        //      setBounds: true,
        //      gravity: 0,
        //      cellSize: 64
        //  }

        /**
         * @const {object} Phaser.Boot.Config#physics - [description]
         */
        this.physics = GetValue(config, 'physics', {});

        /**
         * @const {boolean} Phaser.Boot.Config#defaultPhysicsSystem - [description]
         */
        this.defaultPhysicsSystem = GetValue(this.physics, 'default', false);

        //  Loader Defaults

        /**
         * @const {string} Phaser.Boot.Config#loaderBaseURL - [description]
         */
        this.loaderBaseURL = GetValue(config, 'loader.baseURL', '');

        /**
         * @const {string} Phaser.Boot.Config#loaderPath - [description]
         */
        this.loaderPath = GetValue(config, 'loader.path', '');

        /**
         * @const {integer} Phaser.Boot.Config#loaderMaxParallelDownloads - Maximum parallel downloads allowed for resources (Default to 32).
         */
        this.loaderMaxParallelDownloads = GetValue(config, 'loader.maxParallelDownloads', 32);

        /**
         * @const {(string|undefined)} Phaser.Boot.Config#loaderCrossOrigin - [description]
         */
        this.loaderCrossOrigin = GetValue(config, 'loader.crossOrigin', undefined);

        /**
         * @const {string} Phaser.Boot.Config#loaderResponseType - [description]
         */
        this.loaderResponseType = GetValue(config, 'loader.responseType', '');

        /**
         * @const {boolean} Phaser.Boot.Config#loaderAsync - [description]
         */
        this.loaderAsync = GetValue(config, 'loader.async', true);

        /**
         * @const {string} Phaser.Boot.Config#loaderUser - [description]
         */
        this.loaderUser = GetValue(config, 'loader.user', '');

        /**
         * @const {string} Phaser.Boot.Config#loaderPassword - [description]
         */
        this.loaderPassword = GetValue(config, 'loader.password', '');

        /**
         * @const {integer} Phaser.Boot.Config#loaderTimeout - [description]
         */
        this.loaderTimeout = GetValue(config, 'loader.timeout', 0);

        //  Plugins

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
         * @const {any} Phaser.Boot.Config#installGlobalPlugins - [description]
         */
        this.installGlobalPlugins = [];

        /**
         * @const {any} Phaser.Boot.Config#installScenePlugins - [description]
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
         * @const {string} Phaser.Boot.Config#defaultImage - [description]
         */
        this.defaultImage = GetValue(config, 'images.default', pngPrefix + 'AQMAAABJtOi3AAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAABVJREFUeF7NwIEAAAAAgKD9qdeocAMAoAABm3DkcAAAAABJRU5ErkJggg==');

        /**
         * @const {string} Phaser.Boot.Config#missingImage - [description]
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
