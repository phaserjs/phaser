/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var CONST = require('../const');
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
 * @typedef {object} FPSConfig
 *
 * @property {integer} [min=10] - [description]
 * @property {integer} [target=60] - [description]
 * @property {boolean} [forceSetTimeOut=false] - [description]
 * @property {integer} [deltaHistory=10] - [description]
 * @property {integer} [panicMax=120] - [description]
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
 * @property {(boolean|object)} [input] - [description]
 * @property {boolean} [input.keyboard=true] - [description]
 * @property {*} [input.keyboard.target=window] - [description]
 * @property {(boolean|object)} [input.mouse=true] - [description]
 * @property {*} [input.mouse.target=null] - [description]
 * @property {boolean} [input.touch=true] - [description]
 * @property {*} [input.touch.target=null] - [description]
 * @property {boolean} [input.touch.capture=true] - [description]
 * @property {(boolean|object)} [input.gamepad=false] - [description]
 * @property {boolean} [disableContextMenu=false] - [description]
 * @property {(boolean|object)} [banner=false] - [description]
 * @property {boolean} [banner.hidePhaser=false] - [description]
 * @property {string} [banner.text='#ffffff'] - [description]
 * @property {string[]} [banner.background] - [description]
 * @property {FPSConfig} [fps] - [description]
 * @property {boolean} [render.antialias=true] - [description]
 * @property {boolean} [render.pixelArt=false] - [description]
 * @property {boolean} [render.autoResize=false] - [description]
 * @property {boolean} [render.roundPixels=false] - [description]
 * @property {boolean} [render.transparent=false] - [description]
 * @property {boolean} [render.clearBeforeRender=true] - [description]
 * @property {boolean} [render.premultipliedAlpha=true] - [description]
 * @property {boolean} [render.preserveDrawingBuffer=false] - [description]
 * @property {boolean} [render.failIfMajorPerformanceCaveat=false] - [description]
 * @property {string} [render.powerPreference='default'] - "high-performance", "low-power" or "default"
 * @property {(string|number)} [backgroundColor=0x000000] - [description]
 * @property {object} [callbacks] - [description]
 * @property {BootCallback} [callbacks.preBoot=NOOP] - [description]
 * @property {BootCallback} [callbacks.postBoot=NOOP] - [description]
 * @property {LoaderConfig} [loader] - [description]
 * @property {object} [images] - [description]
 * @property {string} [images.default] - [description]
 * @property {string} [images.missing] - [description]
 * @property {object} [physics] - [description]
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
         * @const {number} Phaser.Boot.Config#renderType - [description]
         */
        this.renderType = GetValue(config, 'type', CONST.AUTO);

        /**
         * @const {?*} Phaser.Boot.Config#parent - [description]
         */
        this.parent = GetValue(config, 'parent', null);

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
        this.inputTouch = GetValue(config, 'input.touch', true);

        /**
         * @const {?*} Phaser.Boot.Config#inputTouchEventTarget - [description]
         */
        this.inputTouchEventTarget = GetValue(config, 'input.touch.target', null);

        /**
         * @const {boolean} Phaser.Boot.Config#inputTouchCapture - [description]
         */
        this.inputTouchCapture = GetValue(config, 'input.touch.capture', true);

        /**
         * @const {boolean} Phaser.Boot.Config#inputGamepad - [description]
         */
        this.inputGamepad = GetValue(config, 'input.gamepad', false);

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
         * @const {boolean} Phaser.Boot.Config#antialias - [description]
         */
        this.antialias = GetValue(renderConfig, 'antialias', true);

        /**
         * @const {boolean} Phaser.Boot.Config#pixelArt - [description]
         */
        this.pixelArt = GetValue(renderConfig, 'pixelArt', false);

        /**
         * @const {boolean} Phaser.Boot.Config#autoResize - [description]
         */
        this.autoResize = GetValue(renderConfig, 'autoResize', false);

        /**
         * @const {boolean} Phaser.Boot.Config#roundPixels - [description]
         */
        this.roundPixels = GetValue(renderConfig, 'roundPixels', false);

        /**
         * @const {boolean} Phaser.Boot.Config#transparent - [description]
         */
        this.transparent = GetValue(renderConfig, 'transparent', false);

        /**
         * @const {boolean} Phaser.Boot.Config#zoclearBeforeRenderom - [description]
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
         *        { key: 'TestPlugin', plugin: TestPlugin, start: true },
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
    }

});

module.exports = Config;
