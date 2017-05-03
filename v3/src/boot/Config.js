/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

var MATH = require('../math');
var CONST = require('../const');
var NOOP = require('../utils/NOOP');
var GetValue = require('../utils/object/GetValue');
var ValueToColor = require('../graphics/color/ValueToColor');

var defaultBannerColor = [
    '#ff0000',
    '#ffff00',
    '#00ff00',
    '#00ffff',
    '#000000'
];

var defaultBannerTextColor = '#ffffff';

var Config = function (config)
{
    if (config === undefined) { config = {}; }

    this.width = GetValue(config, 'width', 1024);
    this.height = GetValue(config, 'height', 768);
    this.zoom = GetValue(config, 'zoom', 1);

    this.resolution = GetValue(config, 'resolution', 1);

    this.renderType = GetValue(config, 'type', CONST.AUTO);

    this.parent = GetValue(config, 'parent', null);
    this.canvas = GetValue(config, 'canvas', null);
    this.canvasStyle = GetValue(config, 'canvasStyle', null);

    this.stateConfig = GetValue(config, 'state', null);

    this.seed = GetValue(config, 'seed', [ (Date.now() * Math.random()).toString() ]);

    MATH.RND.init(this.seed);

    this.gameTitle = GetValue(config, 'title', '');
    this.gameURL = GetValue(config, 'url', 'http://phaser.io');
    this.gameVersion = GetValue(config, 'version', '');

    //  Input
    this.inputKeyboard = GetValue(config, 'input.keyboard', true);
    this.inputKeyboardEventTarget = GetValue(config, 'input.keyboard.target', window);

    //  If you do: { banner: false } it won't display any banner at all
    this.hideBanner = (GetValue(config, 'banner', null) === false);

    this.hidePhaser = GetValue(config, 'banner.hidePhaser', false);
    this.bannerTextColor = GetValue(config, 'banner.text', defaultBannerTextColor);
    this.bannerBackgroundColor = GetValue(config, 'banner.background', defaultBannerColor);
   
    //  Frame Rate config
    //      fps: {
    //          min: 10,
    //          target: 60,
    //          max: 120
    //          forceSetTimeOut: false,
    //          deltaHistory: 10
    //     }

    this.fps = GetValue(config, 'fps', null);

    this.pixelArt = GetValue(config, 'pixelArt', false);
    this.transparent = GetValue(config, 'transparent', false);
    this.clearBeforeRender = GetValue(config, 'clearBeforeRender', true);
    this.backgroundColor = ValueToColor(GetValue(config, 'backgroundColor', 0));
    this.preserveDrawingBuffer = ValueToColor(GetValue(config, 'preserveDrawingBuffer', false));

    //  Callbacks
    this.preBoot = GetValue(config, 'callbacks.preBoot', NOOP);
    this.postBoot = GetValue(config, 'callbacks.postBoot', NOOP);

    this.useTicker = GetValue(config, 'useTicker', false);

    //  Default / Missing Images
    var pngPrefix = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAg';

    this.defaultImage = GetValue(config, 'images.default', pngPrefix + 'AQMAAABJtOi3AAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAABVJREFUeF7NwIEAAAAAgKD9qdeocAMAoAABm3DkcAAAAABJRU5ErkJggg==');
    this.missingImage = GetValue(config, 'images.missing', pngPrefix + 'CAIAAAD8GO2jAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAJ9JREFUeNq01ssOwyAMRFG46v//Mt1ESmgh+DFmE2GPOBARKb2NVjo+17PXLD8a1+pl5+A+wSgFygymWYHBb0FtsKhJDdZlncG2IzJ4ayoMDv20wTmSMzClEgbWYNTAkQ0Z+OJ+A/eWnAaR9+oxCF4Os0H8htsMUp+pwcgBBiMNnAwF8GqIgL2hAzaGFFgZauDPKABmowZ4GL369/0rwACp2yA/ttmvsQAAAABJRU5ErkJggg==');
};

Config.prototype.constructor = Config;

module.exports = Config;
