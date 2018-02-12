/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var CONST = require('../const');
var GetValue = require('../utils/object/GetValue');
var MATH = require('../math/const');
var NOOP = require('../utils/NOOP');
var Plugins = require('../plugins');
var ValueToColor = require('../display/color/ValueToColor');

/**
 * This callback type is completely empty, a no-operation.
 *
 * @callback NOOP
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
 * @property {boolean} [enableParallel=true] - [description]
 * @property {integer} [maxParallelDownloads=4] - [description]
 * @property {string|undefined} [crossOrigin=undefined] - [description]
 * @property {string} [responseType] - [description]
 * @property {boolean} [async=true] - [description]
 * @property {string} [user] - [description]
 * @property {string} [password] - [description]
 * @property {integer} [timeout=0] - [description]
 */

/**
 * @typedef {object} GameConfig
 *
 * @property {integer|string} [width=1024] - [description]
 * @property {integer|string} [height=768] - [description]
 * @property {number} [zoom=1] - [description]
 * @property {number} [resolution=1] - [description]
 * @property {number} [type=CONST.AUTO] - [description]
 * @property {object} [?parent=null] - [description]
 * @property {HTMLCanvasElement} [?canvas=null] - [description]
 * @property {string} [?canvasStyle=null] - [description]
 * @property {object} [?scene=null] - [description]
 * @property {array} [seed] - [description]
 * @property {string} [title=''] - [description]
 * @property {string} [url='http://phaser.io'] - [description]
 * @property {string} [version=''] - [description]
 * @property {object} [input] - [description]
 * @property {boolean} [input.keyboard=true] - [description]
 * @property {object} [input.keyboard.target=window] - [description]
 * @property {boolean} [input.mouse=true] - [description]
 * @property {object} [?input.mouse.target=null] - [description]
 * @property {boolean} [input.touch=true] - [description]
 * @property {object} [?input.touch.target=null] - [description]
 * @property {object} [?input.touch.capture=true] - [description]
 * @property {boolean} [input.gamepad=false] - [description]
 * @property {boolean} [disableContextMenu=false] - [description]
 * @property {boolean} [banner=false] - [description]
 * @property {boolean} [banner.hidePhaser=false] - [description]
 * @property {string} [banner.text='#ffffff'] - [description]
 * @property {array} [banner.background] - [description]
 * @property {FPSConfig} [?fps] - [description]
 * @property {boolean} [pixelArt=false] - [description]
 * @property {boolean} [transparent=false] - [description]
 * @property {boolean} [clearBeforeRender=true] - [description]
 * @property {string|number} [backgroundColor=0x000000] - [description]
 * @property {object} [?callbacks] - [description]
 * @property {function} [callbacks.preBoot=NOOP] - [description]
 * @property {function} [callbacks.postBoot=NOOP] - [description]
 * @property {LoaderConfig} [?loader] - [description]
 * @property {object} [?images] - [description]
 * @property {string} [images.default] - [description]
 * @property {string} [images.missing] - [description]
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
 * @param {object} [GameConfig] - The configuration object for your Phaser Game instance.
 *
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

        this.width = GetValue(config, 'width', 1024);
        this.height = GetValue(config, 'height', 768);
        this.zoom = GetValue(config, 'zoom', 1);

        this.resolution = GetValue(config, 'resolution', 1);

        this.renderType = GetValue(config, 'type', CONST.AUTO);

        this.parent = GetValue(config, 'parent', null);
        this.canvas = GetValue(config, 'canvas', null);
        this.canvasStyle = GetValue(config, 'canvasStyle', null);

        this.sceneConfig = GetValue(config, 'scene', null);

        this.seed = GetValue(config, 'seed', [ (Date.now() * Math.random()).toString() ]);

        MATH.RND.init(this.seed);

        this.gameTitle = GetValue(config, 'title', '');
        this.gameURL = GetValue(config, 'url', 'https://phaser.io');
        this.gameVersion = GetValue(config, 'version', '');

        //  Input
        this.inputKeyboard = GetValue(config, 'input.keyboard', true);
        this.inputKeyboardEventTarget = GetValue(config, 'input.keyboard.target', window);

        this.inputMouse = GetValue(config, 'input.mouse', true);
        this.inputMouseEventTarget = GetValue(config, 'input.mouse.target', null);
        this.inputMouseCapture = GetValue(config, 'input.mouse.capture', true);

        this.inputTouch = GetValue(config, 'input.touch', true);
        this.inputTouchEventTarget = GetValue(config, 'input.touch.target', null);
        this.inputTouchCapture = GetValue(config, 'input.touch.capture', true);

        this.inputGamepad = GetValue(config, 'input.gamepad', false);

        this.disableContextMenu = GetValue(config, 'disableContextMenu', false);

        this.audio = GetValue(config, 'audio');

        //  If you do: { banner: false } it won't display any banner at all
        this.hideBanner = (GetValue(config, 'banner', null) === false);

        this.hidePhaser = GetValue(config, 'banner.hidePhaser', false);
        this.bannerTextColor = GetValue(config, 'banner.text', defaultBannerTextColor);
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

        this.fps = GetValue(config, 'fps', null);

        this.pixelArt = GetValue(config, 'pixelArt', false);
        this.transparent = GetValue(config, 'transparent', false);
        this.clearBeforeRender = GetValue(config, 'clearBeforeRender', true);
        this.backgroundColor = ValueToColor(GetValue(config, 'backgroundColor', 0));

        //  Callbacks
        this.preBoot = GetValue(config, 'callbacks.preBoot', NOOP);
        this.postBoot = GetValue(config, 'callbacks.postBoot', NOOP);

        //  Physics
        //  physics: {
        //      system: 'impact',
        //      setBounds: true,
        //      gravity: 0,
        //      cellSize: 64
        //  }
        this.physics = GetValue(config, 'physics', {});
        this.defaultPhysicsSystem = GetValue(this.physics, 'default', false);

        //  Loader Defaults
        this.loaderBaseURL = GetValue(config, 'loader.baseURL', '');
        this.loaderPath = GetValue(config, 'loader.path', '');
        this.loaderEnableParallel = GetValue(config, 'loader.enableParallel', true);
        this.loaderMaxParallelDownloads = GetValue(config, 'loader.maxParallelDownloads', 4);
        this.loaderCrossOrigin = GetValue(config, 'loader.crossOrigin', undefined);
        this.loaderResponseType = GetValue(config, 'loader.responseType', '');
        this.loaderAsync = GetValue(config, 'loader.async', true);
        this.loaderUser = GetValue(config, 'loader.user', '');
        this.loaderPassword = GetValue(config, 'loader.password', '');
        this.loaderTimeout = GetValue(config, 'loader.timeout', 0);

        //  Scene Plugins
        this.defaultPlugins = GetValue(config, 'plugins', Plugins.DefaultScene);

        //  Default / Missing Images
        var pngPrefix = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAg';

        this.defaultImage = GetValue(config, 'images.default', pngPrefix + 'AQMAAABJtOi3AAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAABVJREFUeF7NwIEAAAAAgKD9qdeocAMAoAABm3DkcAAAAABJRU5ErkJggg==');
        this.missingImage = GetValue(config, 'images.missing', pngPrefix + 'CAIAAAD8GO2jAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAJ9JREFUeNq01ssOwyAMRFG46v//Mt1ESmgh+DFmE2GPOBARKb2NVjo+17PXLD8a1+pl5+A+wSgFygymWYHBb0FtsKhJDdZlncG2IzJ4ayoMDv20wTmSMzClEgbWYNTAkQ0Z+OJ+A/eWnAaR9+oxCF4Os0H8htsMUp+pwcgBBiMNnAwF8GqIgL2hAzaGFFgZauDPKABmowZ4GL369/0rwACp2yA/ttmvsQAAAABJRU5ErkJggg==');
    }

});

module.exports = Config;
