/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var CONST = require('../const');
var DefaultPlugins = require('../plugins/DefaultPlugins');
var Device = require('../device');
var GetFastValue = require('../utils/object/GetFastValue');
var GetValue = require('../utils/object/GetValue');
var IsPlainObject = require('../utils/object/IsPlainObject');
var NOOP = require('../utils/NOOP');
var PhaserMath = require('../math/');
var PIPELINE_CONST = require('../renderer/webgl/pipelines/const');
var ValueToColor = require('../display/color/ValueToColor');

/**
 * @classdesc
 * The active game configuration settings, parsed from a {@link Phaser.Types.Core.GameConfig} object.
 *
 * @class Config
 * @memberof Phaser.Core
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Types.Core.GameConfig} [GameConfig] - The configuration object for your Phaser Game instance.
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

        //  Scale Manager - Anything set in here over-rides anything set in the core game config

        var scaleConfig = GetValue(config, 'scale', null);

        /**
         * @const {(number|string)} Phaser.Core.Config#width - The width of the underlying canvas, in pixels.
         */
        this.width = GetValue(scaleConfig, 'width', 1024, config);

        /**
         * @const {(number|string)} Phaser.Core.Config#height - The height of the underlying canvas, in pixels.
         */
        this.height = GetValue(scaleConfig, 'height', 768, config);

        /**
         * @const {(Phaser.Scale.ZoomType|number)} Phaser.Core.Config#zoom - The zoom factor, as used by the Scale Manager.
         */
        this.zoom = GetValue(scaleConfig, 'zoom', 1, config);

        /**
         * @const {?*} Phaser.Core.Config#parent - A parent DOM element into which the canvas created by the renderer will be injected.
         */
        this.parent = GetValue(scaleConfig, 'parent', undefined, config);

        /**
         * @const {Phaser.Scale.ScaleModeType} Phaser.Core.Config#scaleMode - The scale mode as used by the Scale Manager. The default is zero, which is no scaling.
         */
        this.scaleMode = GetValue(scaleConfig, (scaleConfig) ? 'mode' : 'scaleMode', 0, config);

        /**
         * @const {boolean} Phaser.Core.Config#expandParent - Is the Scale Manager allowed to adjust the CSS height property of the parent to be 100%?
         */
        this.expandParent = GetValue(scaleConfig, 'expandParent', true, config);

        /**
         * @const {boolean} Phaser.Core.Config#autoRound - Automatically round the display and style sizes of the canvas. This can help with performance in lower-powered devices.
         */
        this.autoRound = GetValue(scaleConfig, 'autoRound', false, config);

        /**
         * @const {Phaser.Scale.CenterType} Phaser.Core.Config#autoCenter - Automatically center the canvas within the parent?
         */
        this.autoCenter = GetValue(scaleConfig, 'autoCenter', 0, config);

        /**
         * @const {number} Phaser.Core.Config#resizeInterval - How many ms should elapse before checking if the browser size has changed?
         */
        this.resizeInterval = GetValue(scaleConfig, 'resizeInterval', 500, config);

        /**
         * @const {?(HTMLElement|string)} Phaser.Core.Config#fullscreenTarget - The DOM element that will be sent into full screen mode, or its `id`. If undefined Phaser will create its own div and insert the canvas into it when entering fullscreen mode.
         */
        this.fullscreenTarget = GetValue(scaleConfig, 'fullscreenTarget', null, config);

        /**
         * @const {number} Phaser.Core.Config#minWidth - The minimum width, in pixels, the canvas will scale down to. A value of zero means no minimum.
         */
        this.minWidth = GetValue(scaleConfig, 'minWidth', 0, config);

        /**
         * @const {number} Phaser.Core.Config#maxWidth - The maximum width, in pixels, the canvas will scale up to. A value of zero means no maximum.
         */
        this.maxWidth = GetValue(scaleConfig, 'maxWidth', 0, config);

        /**
         * @const {number} Phaser.Core.Config#minHeight - The minimum height, in pixels, the canvas will scale down to. A value of zero means no minimum.
         */
        this.minHeight = GetValue(scaleConfig, 'minHeight', 0, config);

        /**
         * @const {number} Phaser.Core.Config#maxHeight - The maximum height, in pixels, the canvas will scale up to. A value of zero means no maximum.
         */
        this.maxHeight = GetValue(scaleConfig, 'maxHeight', 0, config);

        /**
         * @const {number} Phaser.Core.Config#renderType - Force Phaser to use a specific renderer. Can be `CONST.CANVAS`, `CONST.WEBGL`, `CONST.HEADLESS` or `CONST.AUTO` (default)
         */
        this.renderType = GetValue(config, 'type', CONST.AUTO);

        /**
         * @const {?HTMLCanvasElement} Phaser.Core.Config#canvas - Force Phaser to use your own Canvas element instead of creating one.
         */
        this.canvas = GetValue(config, 'canvas', null);

        /**
         * @const {?(CanvasRenderingContext2D|WebGLRenderingContext)} Phaser.Core.Config#context - Force Phaser to use your own Canvas context instead of creating one.
         */
        this.context = GetValue(config, 'context', null);

        /**
         * @const {?string} Phaser.Core.Config#canvasStyle - Optional CSS attributes to be set on the canvas object created by the renderer.
         */
        this.canvasStyle = GetValue(config, 'canvasStyle', null);

        /**
         * @const {boolean} Phaser.Core.Config#customEnvironment - Is Phaser running under a custom (non-native web) environment? If so, set this to `true` to skip internal Feature detection. If `true` the `renderType` cannot be left as `AUTO`.
         */
        this.customEnvironment = GetValue(config, 'customEnvironment', false);

        /**
         * @const {?object} Phaser.Core.Config#sceneConfig - The default Scene configuration object.
         */
        this.sceneConfig = GetValue(config, 'scene', null);

        /**
         * @const {string[]} Phaser.Core.Config#seed - A seed which the Random Data Generator will use. If not given, a dynamic seed based on the time is used.
         */
        this.seed = GetValue(config, 'seed', [ (Date.now() * Math.random()).toString() ]);

        PhaserMath.RND = new PhaserMath.RandomDataGenerator(this.seed);

        /**
         * @const {string} Phaser.Core.Config#gameTitle - The title of the game.
         */
        this.gameTitle = GetValue(config, 'title', '');

        /**
         * @const {string} Phaser.Core.Config#gameURL - The URL of the game.
         */
        this.gameURL = GetValue(config, 'url', 'https://phaser.io');

        /**
         * @const {string} Phaser.Core.Config#gameVersion - The version of the game.
         */
        this.gameVersion = GetValue(config, 'version', '');

        /**
         * @const {boolean} Phaser.Core.Config#autoFocus - If `true` the window will automatically be given focus immediately and on any future mousedown event.
         */
        this.autoFocus = GetValue(config, 'autoFocus', true);

        /**
         * @const {(number|boolean)} Phaser.Core.Config#stableSort - `false` or `0` = Use the built-in StableSort (needed for older browsers), `true` or `1` = Rely on ES2019 Array.sort being stable (modern browsers only), or `-1` = Try and determine this automatically based on browser inspection (not guaranteed to work, errs on side of caution).
         */
        this.stableSort = GetValue(config, 'stableSort', -1);

        if (this.stableSort === -1)
        {
            this.stableSort = (Device.browser.es2019) ? 1 : 0;
        }

        Device.features.stableSort = this.stableSort;

        //  DOM Element Container

        /**
         * @const {?boolean} Phaser.Core.Config#domCreateContainer - Should the game create a div element to act as a DOM Container? Only enable if you're using DOM Element objects. You must provide a parent object if you use this feature.
         */
        this.domCreateContainer = GetValue(config, 'dom.createContainer', false);

        /**
         * @const {?string} Phaser.Core.Config#domPointerEvents - The default `pointerEvents` attribute set on the DOM Container.
         */
        this.domPointerEvents = GetValue(config, 'dom.pointerEvents', 'none');

        //  Input

        /**
         * @const {boolean} Phaser.Core.Config#inputKeyboard - Enable the Keyboard Plugin. This can be disabled in games that don't need keyboard input.
         */
        this.inputKeyboard = GetValue(config, 'input.keyboard', true);

        /**
         * @const {*} Phaser.Core.Config#inputKeyboardEventTarget - The DOM Target to listen for keyboard events on. Defaults to `window` if not specified.
         */
        this.inputKeyboardEventTarget = GetValue(config, 'input.keyboard.target', window);

        /**
         * @const {?number[]} Phaser.Core.Config#inputKeyboardCapture - `preventDefault` will be called on every non-modified key which has a key code in this array. By default, it is empty.
         */
        this.inputKeyboardCapture = GetValue(config, 'input.keyboard.capture', []);

        /**
         * @const {(boolean|object)} Phaser.Core.Config#inputMouse - Enable the Mouse Plugin. This can be disabled in games that don't need mouse input.
         */
        this.inputMouse = GetValue(config, 'input.mouse', true);

        /**
         * @const {?*} Phaser.Core.Config#inputMouseEventTarget - The DOM Target to listen for mouse events on. Defaults to the game canvas if not specified.
         */
        this.inputMouseEventTarget = GetValue(config, 'input.mouse.target', null);

        /**
         * @const {boolean} Phaser.Core.Config#inputMousePreventDefaultDown - Should `mousedown` DOM events have `preventDefault` called on them?
         */
        this.inputMousePreventDefaultDown = GetValue(config, 'input.mouse.preventDefaultDown', true);

        /**
         * @const {boolean} Phaser.Core.Config#inputMousePreventDefaultUp - Should `mouseup` DOM events have `preventDefault` called on them?
         */
        this.inputMousePreventDefaultUp = GetValue(config, 'input.mouse.preventDefaultUp', true);

        /**
         * @const {boolean} Phaser.Core.Config#inputMousePreventDefaultMove - Should `mousemove` DOM events have `preventDefault` called on them?
         */
        this.inputMousePreventDefaultMove = GetValue(config, 'input.mouse.preventDefaultMove', true);

        /**
         * @const {boolean} Phaser.Core.Config#inputMousePreventDefaultWheel - Should `wheel` DOM events have `preventDefault` called on them?
         */
        this.inputMousePreventDefaultWheel = GetValue(config, 'input.mouse.preventDefaultWheel', true);

        /**
         * @const {boolean} Phaser.Core.Config#inputTouch - Enable the Touch Plugin. This can be disabled in games that don't need touch input.
         */
        this.inputTouch = GetValue(config, 'input.touch', Device.input.touch);

        /**
         * @const {?*} Phaser.Core.Config#inputTouchEventTarget - The DOM Target to listen for touch events on. Defaults to the game canvas if not specified.
         */
        this.inputTouchEventTarget = GetValue(config, 'input.touch.target', null);

        /**
         * @const {boolean} Phaser.Core.Config#inputTouchCapture - Should touch events be captured? I.e. have prevent default called on them.
         */
        this.inputTouchCapture = GetValue(config, 'input.touch.capture', true);

        /**
         * @const {number} Phaser.Core.Config#inputActivePointers - The number of Pointer objects created by default. In a mouse-only, or non-multi touch game, you can leave this as 1.
         */
        this.inputActivePointers = GetValue(config, 'input.activePointers', 1);

        /**
         * @const {number} Phaser.Core.Config#inputSmoothFactor - The smoothing factor to apply during Pointer movement. See {@link Phaser.Input.Pointer#smoothFactor}.
         */
        this.inputSmoothFactor = GetValue(config, 'input.smoothFactor', 0);

        /**
         * @const {boolean} Phaser.Core.Config#inputWindowEvents - Should Phaser listen for input events on the Window? If you disable this, events like 'POINTER_UP_OUTSIDE' will no longer fire.
         */
        this.inputWindowEvents = GetValue(config, 'input.windowEvents', true);

        /**
         * @const {boolean} Phaser.Core.Config#inputGamepad - Enable the Gamepad Plugin. This can be disabled in games that don't need gamepad input.
         */
        this.inputGamepad = GetValue(config, 'input.gamepad', false);

        /**
         * @const {*} Phaser.Core.Config#inputGamepadEventTarget - The DOM Target to listen for gamepad events on. Defaults to `window` if not specified.
         */
        this.inputGamepadEventTarget = GetValue(config, 'input.gamepad.target', window);

        /**
         * @const {boolean} Phaser.Core.Config#disableContextMenu - Set to `true` to disable the right-click context menu.
         */
        this.disableContextMenu = GetValue(config, 'disableContextMenu', false);

        /**
         * @const {Phaser.Types.Core.AudioConfig} Phaser.Core.Config#audio - The Audio Configuration object.
         */
        this.audio = GetValue(config, 'audio', {});

        //  If you do: { banner: false } it won't display any banner at all

        /**
         * @const {boolean} Phaser.Core.Config#hideBanner - Don't write the banner line to the console.log.
         */
        this.hideBanner = (GetValue(config, 'banner', null) === false);

        /**
         * @const {boolean} Phaser.Core.Config#hidePhaser - Omit Phaser's name and version from the banner.
         */
        this.hidePhaser = GetValue(config, 'banner.hidePhaser', false);

        /**
         * @const {string} Phaser.Core.Config#bannerTextColor - The color of the banner text.
         */
        this.bannerTextColor = GetValue(config, 'banner.text', defaultBannerTextColor);

        /**
         * @const {string[]} Phaser.Core.Config#bannerBackgroundColor - The background colors of the banner.
         */
        this.bannerBackgroundColor = GetValue(config, 'banner.background', defaultBannerColor);

        if (this.gameTitle === '' && this.hidePhaser)
        {
            this.hideBanner = true;
        }

        /**
         * @const {Phaser.Types.Core.FPSConfig} Phaser.Core.Config#fps - The Frame Rate Configuration object, as parsed by the Timestep class.
         */
        this.fps = GetValue(config, 'fps', null);

        //  Render Settings - Anything set in here over-rides anything set in the core game config

        var renderConfig = GetValue(config, 'render', null);

        /**
         * @const {Phaser.Types.Core.PipelineConfig} Phaser.Core.Config#pipeline - An object mapping WebGL names to WebGLPipeline classes. These should be class constructors, not instances.
         */
        this.pipeline = GetValue(renderConfig, 'pipeline', null, config);

        /**
         * @const {boolean} Phaser.Core.Config#autoMobilePipeline - Automatically enable the Mobile Pipeline if iOS or Android detected?
         */
        this.autoMobilePipeline = GetValue(renderConfig, 'autoMobilePipeline', true, config);

        /**
         * @const {string} Phaser.Core.Config#defaultPipeline - The WebGL Pipeline that Game Objects will use by default. Set to 'MultiPipeline' as standard. See also 'autoMobilePipeline'.
         */
        this.defaultPipeline = GetValue(renderConfig, 'defaultPipeline', PIPELINE_CONST.MULTI_PIPELINE, config);

        /**
         * @const {boolean} Phaser.Core.Config#antialias - When set to `true`, WebGL uses linear interpolation to draw scaled or rotated textures, giving a smooth appearance. When set to `false`, WebGL uses nearest-neighbor interpolation, giving a crisper appearance. `false` also disables antialiasing of the game canvas itself, if the browser supports it, when the game canvas is scaled.
         */
        this.antialias = GetValue(renderConfig, 'antialias', true, config);

        /**
         * @const {boolean} Phaser.Core.Config#antialiasGL - Sets the `antialias` property when the WebGL context is created. Setting this value does not impact any subsequent textures that are created, or the canvas style attributes.
         */
        this.antialiasGL = GetValue(renderConfig, 'antialiasGL', true, config);

        /**
         * @const {string} Phaser.Core.Config#mipmapFilter - Sets the `mipmapFilter` property when the WebGL renderer is created.
         */
        this.mipmapFilter = GetValue(renderConfig, 'mipmapFilter', '', config);

        /**
         * @const {boolean} Phaser.Core.Config#desynchronized - When set to `true` it will create a desynchronized context for both 2D and WebGL. See https://developers.google.com/web/updates/2019/05/desynchronized for details.
         */
        this.desynchronized = GetValue(renderConfig, 'desynchronized', false, config);

        /**
         * @const {boolean} Phaser.Core.Config#roundPixels - Draw texture-based Game Objects at only whole-integer positions. Game Objects without textures, like Graphics, ignore this property.
         */
        this.roundPixels = GetValue(renderConfig, 'roundPixels', false, config);

        /**
         * @const {boolean} Phaser.Core.Config#pixelArt - Prevent pixel art from becoming blurred when scaled. It will remain crisp (tells the WebGL renderer to automatically create textures using a linear filter mode).
         */
        this.pixelArt = GetValue(renderConfig, 'pixelArt', this.zoom !== 1, config);

        if (this.pixelArt)
        {
            this.antialias = false;
            this.antialiasGL = false;
            this.roundPixels = true;
        }

        /**
         * @const {boolean} Phaser.Core.Config#transparent - Whether the game canvas will have a transparent background.
         */
        this.transparent = GetValue(renderConfig, 'transparent', false, config);

        /**
         * @const {boolean} Phaser.Core.Config#clearBeforeRender - Whether the game canvas will be cleared between each rendering frame. You can disable this if you have a full-screen background image or game object.
         */
        this.clearBeforeRender = GetValue(renderConfig, 'clearBeforeRender', true, config);

        /**
         * @const {boolean} Phaser.Core.Config#preserveDrawingBuffer - If the value is true the WebGL buffers will not be cleared and will preserve their values until cleared or overwritten by the author.
         */
        this.preserveDrawingBuffer = GetValue(renderConfig, 'preserveDrawingBuffer', false, config);

        /**
         * @const {boolean} Phaser.Core.Config#premultipliedAlpha - In WebGL mode, sets the drawing buffer to contain colors with pre-multiplied alpha.
         */
        this.premultipliedAlpha = GetValue(renderConfig, 'premultipliedAlpha', true, config);

        /**
         * @const {boolean} Phaser.Core.Config#failIfMajorPerformanceCaveat - Let the browser abort creating a WebGL context if it judges performance would be unacceptable.
         */
        this.failIfMajorPerformanceCaveat = GetValue(renderConfig, 'failIfMajorPerformanceCaveat', false, config);

        /**
         * @const {string} Phaser.Core.Config#powerPreference - "high-performance", "low-power" or "default". A hint to the browser on how much device power the game might use.
         */
        this.powerPreference = GetValue(renderConfig, 'powerPreference', 'default', config);

        /**
         * @const {number} Phaser.Core.Config#batchSize - The default WebGL Batch size. Represents the number of _quads_ that can be added to a single batch.
         */
        this.batchSize = GetValue(renderConfig, 'batchSize', 4096, config);

        /**
         * @const {number} Phaser.Core.Config#maxTextures - When in WebGL mode, this sets the maximum number of GPU Textures to use. The default, -1, will use all available units. The WebGL1 spec says all browsers should provide a minimum of 8.
         */
        this.maxTextures = GetValue(renderConfig, 'maxTextures', -1, config);

        /**
         * @const {number} Phaser.Core.Config#maxLights - The maximum number of lights allowed to be visible within range of a single Camera in the LightManager.
         */
        this.maxLights = GetValue(renderConfig, 'maxLights', 10, config);

        var bgc = GetValue(config, 'backgroundColor', 0);

        /**
         * @const {Phaser.Display.Color} Phaser.Core.Config#backgroundColor - The background color of the game canvas. The default is black. This value is ignored if `transparent` is set to `true`.
         */
        this.backgroundColor = ValueToColor(bgc);

        if (this.transparent)
        {
            this.backgroundColor = ValueToColor(0x000000);
            this.backgroundColor.alpha = 0;
        }

        /**
         * @const {Phaser.Types.Core.BootCallback} Phaser.Core.Config#preBoot - Called before Phaser boots. Useful for initializing anything not related to Phaser that Phaser may require while booting.
         */
        this.preBoot = GetValue(config, 'callbacks.preBoot', NOOP);

        /**
         * @const {Phaser.Types.Core.BootCallback} Phaser.Core.Config#postBoot - A function to run at the end of the boot sequence. At this point, all the game systems have started and plugins have been loaded.
         */
        this.postBoot = GetValue(config, 'callbacks.postBoot', NOOP);

        /**
         * @const {Phaser.Types.Core.PhysicsConfig} Phaser.Core.Config#physics - The Physics Configuration object.
         */
        this.physics = GetValue(config, 'physics', {});

        /**
         * @const {(boolean|string)} Phaser.Core.Config#defaultPhysicsSystem - The default physics system. It will be started for each scene. Either 'arcade', 'impact' or 'matter'.
         */
        this.defaultPhysicsSystem = GetValue(this.physics, 'default', false);

        /**
         * @const {string} Phaser.Core.Config#loaderBaseURL - A URL used to resolve paths given to the loader. Example: 'http://labs.phaser.io/assets/'.
         */
        this.loaderBaseURL = GetValue(config, 'loader.baseURL', '');

        /**
         * @const {string} Phaser.Core.Config#loaderPath - A URL path used to resolve relative paths given to the loader. Example: 'images/sprites/'.
         */
        this.loaderPath = GetValue(config, 'loader.path', '');

        /**
         * @const {number} Phaser.Core.Config#loaderMaxParallelDownloads - Maximum parallel downloads allowed for resources (Default to 32).
         */
        this.loaderMaxParallelDownloads = GetValue(config, 'loader.maxParallelDownloads', (Device.os.android) ? 6 : 32);

        /**
         * @const {(string|undefined)} Phaser.Core.Config#loaderCrossOrigin - 'anonymous', 'use-credentials', or `undefined`. If you're not making cross-origin requests, leave this as `undefined`. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes}.
         */
        this.loaderCrossOrigin = GetValue(config, 'loader.crossOrigin', undefined);

        /**
         * @const {string} Phaser.Core.Config#loaderResponseType - The response type of the XHR request, e.g. `blob`, `text`, etc.
         */
        this.loaderResponseType = GetValue(config, 'loader.responseType', '');

        /**
         * @const {boolean} Phaser.Core.Config#loaderAsync - Should the XHR request use async or not?
         */
        this.loaderAsync = GetValue(config, 'loader.async', true);

        /**
         * @const {string} Phaser.Core.Config#loaderUser - Optional username for all XHR requests.
         */
        this.loaderUser = GetValue(config, 'loader.user', '');

        /**
         * @const {string} Phaser.Core.Config#loaderPassword - Optional password for all XHR requests.
         */
        this.loaderPassword = GetValue(config, 'loader.password', '');

        /**
         * @const {number} Phaser.Core.Config#loaderTimeout - Optional XHR timeout value, in ms.
         */
        this.loaderTimeout = GetValue(config, 'loader.timeout', 0);

        /**
         * @const {boolean} Phaser.Core.Config#loaderWithCredentials - Optional XHR withCredentials value.
         */
        this.loaderWithCredentials = GetValue(config, 'loader.withCredentials', false);

        /**
         * @const {string} Phaser.Core.Config#loaderImageLoadType - Optional load type for image, `XHR` is default, or `HTMLImageElement` for a lightweight way.
         */
        this.loaderImageLoadType = GetValue(config, 'loader.imageLoadType', 'XHR');

        // On iOS, Capacitor often runs on a capacitor:// protocol, meaning local files are served from capacitor:// rather than file://
        // See: https://github.com/photonstorm/phaser/issues/5685

        /**
         * @const {string[]} Phaser.Core.Config#loaderLocalScheme - An array of schemes that the Loader considers as being 'local' files. Defaults to: `[ 'file://', 'capacitor://' ]`.
         */
        this.loaderLocalScheme = GetValue(config, 'loader.localScheme', [ 'file://', 'capacitor://' ]);

        /**
         * @const {number} Phaser.Core.Config#glowFXQuality - The quality of the Glow FX (defaults to 0.1)
         */
        this.glowFXQuality = GetValue(config, 'fx.glow.quality', 0.1);

        /**
         * @const {number} Phaser.Core.Config#glowFXDistance - The distance of the Glow FX (defaults to 10)
         */
        this.glowFXDistance = GetValue(config, 'fx.glow.distance', 10);

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
         * @const {any} Phaser.Core.Config#installGlobalPlugins - An array of global plugins to be installed.
         */
        this.installGlobalPlugins = [];

        /**
         * @const {any} Phaser.Core.Config#installScenePlugins - An array of Scene level plugins to be installed.
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
         * @const {any} Phaser.Core.Config#defaultPlugins - The plugins installed into every Scene (in addition to CoreScene and Global).
         */
        this.defaultPlugins = defaultPlugins;

        //  Default / Missing Images
        var pngPrefix = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAg';

        /**
         * @const {string} Phaser.Core.Config#defaultImage - A base64 encoded PNG that will be used as the default blank texture.
         */
        this.defaultImage = GetValue(config, 'images.default', pngPrefix + 'AQMAAABJtOi3AAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAABVJREFUeF7NwIEAAAAAgKD9qdeocAMAoAABm3DkcAAAAABJRU5ErkJggg==');

        /**
         * @const {string} Phaser.Core.Config#missingImage - A base64 encoded PNG that will be used as the default texture when a texture is assigned that is missing or not loaded.
         */
        this.missingImage = GetValue(config, 'images.missing', pngPrefix + 'CAIAAAD8GO2jAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAJ9JREFUeNq01ssOwyAMRFG46v//Mt1ESmgh+DFmE2GPOBARKb2NVjo+17PXLD8a1+pl5+A+wSgFygymWYHBb0FtsKhJDdZlncG2IzJ4ayoMDv20wTmSMzClEgbWYNTAkQ0Z+OJ+A/eWnAaR9+oxCF4Os0H8htsMUp+pwcgBBiMNnAwF8GqIgL2hAzaGFFgZauDPKABmowZ4GL369/0rwACp2yA/ttmvsQAAAABJRU5ErkJggg==');

        /**
         * @const {string} Phaser.Core.Config#whiteImage - A base64 encoded PNG that will be used as the default texture when a texture is assigned that is white or not loaded.
         */
        this.whiteImage = GetValue(config, 'images.white', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABdJREFUeNpi/P//PwMMMDEgAdwcgAADAJZuAwXJYZOzAAAAAElFTkSuQmCC');

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
