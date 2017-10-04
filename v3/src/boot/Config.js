var Class = require('../utils/Class');
var CONST = require('../const');
var GetValue = require('../utils/object/GetValue');
var MATH = require('../math/const');
var NOOP = require('../utils/NOOP');
var ValueToColor = require('../graphics/color/ValueToColor');

/**
 * This callback type is completely empty, a no-operation.
 *
 * @callback NOOP
 */

var Config = new Class({

    initialize:

    /**
     * [description]
     *
     * @class Config
     * @memberOf Phaser.Boot
     * @constructor
     * @since 3.0.0
     *
     * @todo Add Physics Config
     * 
     * @param {object} [config] - The configuration object for your Phaser Game instance.
     * @param {integer|string} [config.width=1024] - [description]
     * @param {integer|string} [config.height=768] - [description]
     * @param {number} [config.zoom=1] - [description]
     * @param {number} [config.resolution=1] - [description]
     * @param {number} [config.type=CONST.AUTO] - [description]
     * @param {object} [?config.parent=null] - [description]
     * @param {HTMLCanvasElement} [?config.canvas=null] - [description]
     * @param {string} [?config.canvasStyle=null] - [description]
     * @param {object} [?config.scene=null] - [description]
     * @param {array} [config.seed] - [description]
     * @param {string} [config.title=''] - [description]
     * @param {string} [config.url='http://phaser.io'] - [description]
     * @param {string} [config.version=''] - [description]
     * @param {object} [config.input] - [description]
     * @param {boolean} [config.input.keyboard=true] - [description]
     * @param {object} [config.input.keyboard.target=window] - [description]
     * @param {boolean} [config.input.mouse=true] - [description]
     * @param {object} [?config.input.mouse.target=null] - [description]
     * @param {boolean} [config.input.touch=true] - [description]
     * @param {object} [?config.input.touch.target=null] - [description]
     * @param {boolean} [config.input.gamepad=false] - [description]
     * @param {boolean} [config.disableContextMenu=false] - [description]
     * @param {boolean} [config.banner=false] - [description]
     * @param {boolean} [config.banner.hidePhaser=false] - [description]
     * @param {string} [config.banner.text='#ffffff'] - [description]
     * @param {array} [config.banner.background] - [description]
     * @param {object} [?config.fps] - [description]
     * @param {integer} [config.fps.min=10] - [description]
     * @param {integer} [config.fps.target=60] - [description]
     * @param {boolean} [config.fps.forceSetTimeOut=false] - [description]
     * @param {integer} [config.fps.deltaHistory=10] - [description]
     * @param {boolean} [config.pixelArt=false] - [description]
     * @param {boolean} [config.transparent=false] - [description]
     * @param {boolean} [config.clearBeforeRender=true] - [description]
     * @param {string|number} [config.backgroundColor=0x000000] - [description]
     * @param {boolean} [config.preserveDrawingBuffer=false] - [description]
     * @param {object} [?config.callbacks] - [description]
     * @param {function} [config.callbacks.preBoot=NOOP] - [description]
     * @param {function} [config.callbacks.postBoot=NOOP] - [description]
     * @param {boolean} [config.useTicker=false] - [description]
     * @param {object} [?config.images] - [description]
     * @param {string} [config.images.default] - [description]
     * @param {string} [config.images.missing] - [description]
     */
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
        this.gameURL = GetValue(config, 'url', 'http://phaser.io');
        this.gameVersion = GetValue(config, 'version', '');

        //  Input
        this.inputKeyboard = GetValue(config, 'input.keyboard', true);
        this.inputKeyboardEventTarget = GetValue(config, 'input.keyboard.target', window);

        this.inputMouse = GetValue(config, 'input.mouse', true);
        this.inputMouseEventTarget = GetValue(config, 'input.mouse.target', null);

        this.inputTouch = GetValue(config, 'input.touch', true);
        this.inputTouchEventTarget = GetValue(config, 'input.touch.target', null);

        this.inputGamepad = GetValue(config, 'input.gamepad', false);

        this.disableContextMenu = GetValue(config, 'disableContextMenu', false);

        //  If you do: { banner: false } it won't display any banner at all
        this.hideBanner = (GetValue(config, 'banner', null) === false);

        this.hidePhaser = GetValue(config, 'banner.hidePhaser', false);
        this.bannerTextColor = GetValue(config, 'banner.text', defaultBannerTextColor);
        this.bannerBackgroundColor = GetValue(config, 'banner.background', defaultBannerColor);
       
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
        this.preserveDrawingBuffer = GetValue(config, 'preserveDrawingBuffer', false);

        //  Callbacks
        this.preBoot = GetValue(config, 'callbacks.preBoot', NOOP);
        this.postBoot = GetValue(config, 'callbacks.postBoot', NOOP);

        this.useTicker = GetValue(config, 'useTicker', false);

        //  Physics
        //  physics: {
        //      system: 'impact',
        //      setBounds: true,
        //      gravity: 0,
        //      cellSize: 64
        //  }
        this.physics = GetValue(config, 'physics', {});
        this.defaultPhysicsSystem = GetValue(this.physics, 'default', false);

        //  Default / Missing Images
        var pngPrefix = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAg';

        this.defaultImage = GetValue(config, 'images.default', pngPrefix + 'AQMAAABJtOi3AAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAABVJREFUeF7NwIEAAAAAgKD9qdeocAMAoAABm3DkcAAAAABJRU5ErkJggg==');
        this.missingImage = GetValue(config, 'images.missing', pngPrefix + 'CAIAAAD8GO2jAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAJ9JREFUeNq01ssOwyAMRFG46v//Mt1ESmgh+DFmE2GPOBARKb2NVjo+17PXLD8a1+pl5+A+wSgFygymWYHBb0FtsKhJDdZlncG2IzJ4ayoMDv20wTmSMzClEgbWYNTAkQ0Z+OJ+A/eWnAaR9+oxCF4Os0H8htsMUp+pwcgBBiMNnAwF8GqIgL2hAzaGFFgZauDPKABmowZ4GL369/0rwACp2yA/ttmvsQAAAABJRU5ErkJggg==');
    }

});

module.exports = Config;
