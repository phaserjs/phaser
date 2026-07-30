/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

require('./polyfills/requestVideoFrame');

var CONST = require('./const');
var Extend = require('./utils/object/Extend');

/**
 * The Phaser namespace is the root namespace for the entire Phaser game framework.
 * It contains all sub-namespaces, classes, and constants that make up the framework,
 * including the Game class, Scene management, Game Objects, physics systems, input
 * handling, asset loading, cameras, tweens, tilemaps, and more.
 *
 * When Phaser is built as a bundle, this namespace is also exported to `Phaser`,
 * making it available as a browser global.
 *
 * @namespace Phaser
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
    Physics: require('./physics'),
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

/**
 * The root types namespace.
 *
 * @namespace Phaser.Types
 * @since 3.17.0
 */

//  Export it

module.exports = Phaser;

global.Phaser = Phaser;

/*
 * "Documentation is like pizza: when it is good, it is very, very good;
 * and when it is bad, it is better than nothing."
 *  -- Dick Brandon
 */
