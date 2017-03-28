/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

var MATH = require('../math');
var CONST = require('../const');
var NOOP = require('../utils/NOOP');
var GetObjectValue = require('../utils/object/GetObjectValue');
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

    this.width = GetObjectValue(config, 'width', 1024);
    this.height = GetObjectValue(config, 'height', 768);
    this.zoom = GetObjectValue(config, 'zoom', 1);

    this.resolution = GetObjectValue(config, 'resolution', 1);

    this.renderType = GetObjectValue(config, 'type', CONST.AUTO);

    this.parent = GetObjectValue(config, 'parent', null);
    this.canvas = GetObjectValue(config, 'canvas', null);
    this.canvasStyle = GetObjectValue(config, 'canvasStyle', null);

    this.stateConfig = GetObjectValue(config, 'state', null);

    this.seed = GetObjectValue(config, 'seed', [ (Date.now() * Math.random()).toString() ]);

    MATH.RND.init(this.seed);

    this.gameTitle = GetObjectValue(config, 'title', '');
    this.gameURL = GetObjectValue(config, 'url', 'http://phaser.io');
    this.gameVersion = GetObjectValue(config, 'version', '');

    //  Input
    this.inputKeyboard = GetObjectValue(config, 'input.keyboard', true);
    this.inputKeyboardEventTarget = GetObjectValue(config, 'input.keyboard.target', window);

    //  If you do: { banner: false } it won't display any banner at all
    this.hideBanner = (GetObjectValue(config, 'banner', null) === false);

    this.hidePhaser = GetObjectValue(config, 'banner.hidePhaser', false);
    this.bannerTextColor = GetObjectValue(config, 'banner.text', defaultBannerTextColor);
    this.bannerBackgroundColor = GetObjectValue(config, 'banner.background', defaultBannerColor);
   
    this.fps = GetObjectValue(config, 'fps', 60);
    this.forceSetTimeOut = GetObjectValue(config, 'forceSetTimeOut', false);

    this.pixelArt = GetObjectValue(config, 'pixelArt', false);
    this.transparent = GetObjectValue(config, 'transparent', false);
    this.clearBeforeRender = GetObjectValue(config, 'clearBeforeRender', true);
    this.backgroundColor = ValueToColor(GetObjectValue(config, 'backgroundColor', 0));
    this.preserveDrawingBuffer = ValueToColor(GetObjectValue(config, 'preserveDrawingBuffer', false));

    //  Callbacks
    this.preBoot = GetObjectValue(config, 'callbacks.preBoot', NOOP);
    this.postBoot = GetObjectValue(config, 'callbacks.postBoot', NOOP);

    //  Default / Missing Images
    var pngPrefix = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAg';

    this.defaultImage = GetObjectValue(config, 'images.default', pngPrefix + 'AQMAAABJtOi3AAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAABVJREFUeF7NwIEAAAAAgKD9qdeocAMAoAABm3DkcAAAAABJRU5ErkJggg==');
    this.missingImage = GetObjectValue(config, 'images.missing', pngPrefix + 'CAIAAAD8GO2jAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAJ9JREFUeNq01ssOwyAMRFG46v//Mt1ESmgh+DFmE2GPOBARKb2NVjo+17PXLD8a1+pl5+A+wSgFygymWYHBb0FtsKhJDdZlncG2IzJ4ayoMDv20wTmSMzClEgbWYNTAkQ0Z+OJ+A/eWnAaR9+oxCF4Os0H8htsMUp+pwcgBBiMNnAwF8GqIgL2hAzaGFFgZauDPKABmowZ4GL369/0rwACp2yA/ttmvsQAAAABJRU5ErkJggg==');
};

Config.prototype.constructor = Config;

module.exports = Config;
