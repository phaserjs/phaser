/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

require('./polyfills/requestVideoFrame');

var CONST = require('./const');
var Extend = require('./utils/object/Extend');


/**
 * Alternative Phaser entry-point for the no-physics build. Doesn't include Arcade or Matter physics.
 * See phaser.js for the JSDocs entry point.
 */

var Phaser = {

    Actions: require('./actions'),
    Animations: require('./animations'),
    BlendModes: require('./renderer/BlendModes'),
    Cache: require('./cache'),
    Cameras: require('./cameras'),
    Core: require('./core'),
    Class: require('./utils/Class'),
    Curves: require('./curves'),
    Data: require('./data'),
    Display: require('./display'),
    DOM: require('./dom'),
    Events: require('./events'),
    Filters: require('./filters'),
    Game: require('./core/Game'),
    GameObjects: require('./gameobjects'),
    Geom: require('./geom'),
    Input: require('./input'),
    Loader: require('./loader'),
    Math: require('./math'),
    Plugins: require('./plugins'),
    Renderer: require('./renderer'),
    Scale: require('./scale'),
    ScaleModes: require('./renderer/ScaleModes'),
    Scene: require('./scene/Scene'),
    Scenes: require('./scene'),
    Structs: require('./structs'),
    Textures: require('./textures'),
    Tilemaps: require('./tilemaps'),
    Time: require('./time'),
    TintModes: require('./renderer/TintModes'),
    Tweens: require('./tweens'),
    Utils: require('./utils')

};

//  Merge in the optional plugins and WebGL only features

if (typeof FEATURE_SOUND)
{
    Phaser.Sound = require('./sound');
}

//   Merge in the consts

Phaser = Extend(false, Phaser, CONST);

//  Export it

module.exports = Phaser;

global.Phaser = Phaser;
