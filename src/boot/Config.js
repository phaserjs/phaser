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
 * @param {Phaser.Game} game - [description]
 */

/**
 * @typedef {object} InputConfig
 *
 * @property {(boolean|KeyboardInputConfig)} [keyboard=true] - [description]
 * @property {(boolean|MouseInputConfig)} [mouse=true] - [description]
 * @property {(boolean|TouchInputConfig)} [touch=true] - [description]
 * @property {(boolean|GamepadInputConfig)} [gamepad=false] - [description]
 * @property {integer} [activePointers=1] - [description]
 */

/**
 * @typedef {object} MouseInputConfig
 *
 * @property {*} [target=null] - [description]
 * @property {boolean} [capture=true] - [description]
 */

/**
 * @typedef {object} KeyboardInputConfig
 *
 * @property {*} [target=window] - [description]
 */

/**
 * @typedef {object} TouchInputConfig
 *
 * @property {*} [target=null] - [description]
 * @property {boolean} [capture=true] - [description]
 */

/**
 * @typedef {object} GamepadInputConfig
 *
 * @property {*} [target=window] - [description]
 */

/**
 * @typedef {object} BannerConfig
 *
 * @property {boolean} [hidePhaser=false] - [description]
 * @property {string} [text='#ffffff'] - [description]
 * @property {string[]} [background] - [description]
 */

/**
 * @typedef {object} FPSConfig
 *
 * @property {integer} [min=10] - [description]
 * @property {integer} [target=60] - [description]
 * @property {boolean} [forceSetTimeOut=false] - [description]
 * @property {integer} [deltaHistory=10] - [description]
 * @property {integer} [panicMax=120] - [description]
 */

/**
 * @typedef {object} RenderConfig
 *
 * @property {boolean} [antialias=true] - [description]
 * @property {boolean} [pixelArt=false] - [description]
 * @property {boolean} [autoResize=true] - Automatically resize the Game Canvas if you resize the renderer.
 * @property {boolean} [roundPixels=false] - [description]
 * @property {boolean} [transparent=false] - [description]
 * @property {boolean} [clearBeforeRender=true] - [description]
 * @property {boolean} [premultipliedAlpha=true] - [description]
 * @property {boolean} [preserveDrawingBuffer=false] - [description]
 * @property {boolean} [failIfMajorPerformanceCaveat=false] - [description]
 * @property {string} [powerPreference='default'] - "high-performance", "low-power" or "default"
 * @property {integer} [batchSize=2000] - The default WebGL batch size.
 */

/**
 * @typedef {object} ScaleConfig
 *
 * @property {(integer|string)} [width=1024] - The base width of your game.
 * @property {(integer|string)} [height=768] - The base height of your game.
 * @property {integer} [zoom=1] - The zoom value of the game canvas.
 * @property {number} [resolution=1] - The rendering resolution of the canvas.
 * @property {any} [parent] - The parent DOM element.
 * @property {integer} [mode=0] - The scale mode to apply to the canvas.
 * @property {integer} [minWidth] - The minimum width the canvas can be scaled down to.
 * @property {integer} [minHeight] - The minimum height the canvas can be scaled down to.
 * @property {integer} [maxWidth] - The maximum width the canvas can be scaled up to.
 * @property {integer} [maxHeight] - The maximum height the canvas can be scaled up to.
 */

/**
 * @typedef {object} CallbacksConfig
 *
 * @property {BootCallback} [preBoot=NOOP] - [description]
 * @property {BootCallback} [postBoot=NOOP] - [description]
 */

/**
 * @typedef {object} LoaderConfig
 *
 * @property {string} [baseURL] - [description]
 * @property {string} [path] - [description]
 * @property {integer} [maxParallelDownloads=32] - [description]
 * @property {(string|undefined)} [crossOrigin=undefined] - [description]
 * @property {string} [responseType] - [description]
 * @property {boolean} [async=true] - [description]
 * @property {string} [user] - [description]
 * @property {string} [password] - [description]
 * @property {integer} [timeout=0] - [description]
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
 * @property {string} [default] - [description]
 * @property {string} [missing] - [description]
 */

/**
 * @typedef {object} PluginObjectItem
 *
 * @property {string} [key] - [description]
 * @property {*} [plugin] - [description]
 * @property {boolean} [start] - [description]
 * @property {string} [systemKey] - [description]
 * @property {string} [sceneKey] - [description]
 * @property {*} [data] - [description]
 */

/**
 * @typedef {object} PluginObject
 *
 * @property {?PluginObjectItem[]} [global] - [description]
 * @property {?PluginObjectItem[]} [scene] - [description]
 * @property {string[]} [default] - [description]
 * @property {*} [defaultMerge] - [description]
 */

/**
 * @typedef {object} GameConfig
 *
 * @property {(integer|string)} [width=1024] - [description]
 * @property {(integer|string)} [height=768] - [description]
 * @property {number} [zoom=1] - [description]
 * @property {number} [resolution=1] - [description]
 * @property {number} [type=CONST.AUTO] - [description]
 * @property {*} [parent=null] - [description]
 * @property {HTMLCanvasElement} [canvas=null] - Provide your own Canvas element for Phaser to use instead of creating one.
 * @property {string} [canvasStyle=null] - [description]
 * @property {CanvasRenderingContext2D} [context] - Provide your own Canvas Context for Phaser to use, instead of creating one.
 * @property {object} [scene=null] - [description]
 * @property {string[]} [seed] - [description]
 * @property {string} [title=''] - [description]
 * @property {string} [url='http://phaser.io'] - [description]
 * @property {string} [version=''] - [description]
 * @property {boolean} [autoFocus=true] - Automatically call window.focus() when the game boots.
 * @property {(boolean|InputConfig)} [input] - [description]
 * @property {boolean} [disableContextMenu=false] - [description]
 * @property {(boolean|BannerConfig)} [banner=false] - [description]
 * @property {DOMContainerConfig} [dom] - The DOM Container configuration object.
 * @property {FPSConfig} [fps] - [description]
 * @property {RenderConfig} [render] - [description]
 * @property {(string|number)} [backgroundColor=0x000000] - [description]
 * @property {CallbacksConfig} [callbacks] - [description]
 * @property {LoaderConfig} [loader] - [description]
 * @property {ImagesConfig} [images] - [description]
 * @property {object} [physics] - [description]
 * @property {PluginObject|PluginObjectItem[]} [plugins] - [description]
 */

/**
 * @classdesc
 * [description]
 *
 * @class Config
 * @memberOf Phaser.Boot
 * @constructor
 * @since 3.0.0
 *
 * @param {GameConfig} [GameConfig] - The configuration object for your Phaser Game instance.
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
         * @const {?*} Phaser.Boot.Config#scaleMode - [description]
         */
        this.scaleMode = GetValue(config, 'scaleMode', 0);

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

            //  TODO: Add in min / max sizes
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
         * @const {string} Phaser.Boot.Config#gameTitle - [description]
         */
        this.gameTitle = GetValue(config, 'title', '');

        /**
         * @const {string} Phaser.Boot.Config#gameURL - [description]
         */
        this.gameURL = GetValue(config, 'url', 'https://phaser.io');

        /**
         * @const {string} Phaser.Boot.Config#gameVersion - [description]
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
         * @const {boolean} Phaser.Boot.Config#disableContextMenu - [description]
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
         * @const {boolean} Phaser.Boot.Config#pixelArt - [description]
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
         * @const {integer} Phaser.Boot.Config#loaderMaxParallelDownloads - [description]
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
         *    defaultMerge: {
         *        'ModPlayer'
         *    }
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
