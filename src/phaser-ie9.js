/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

require('./polyfills');

var CONST = require('./const');
var Extend = require('./utils/object/Extend');

/**
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
    Create: require('./create'),
    Curves: require('./curves'),
    Data: require('./data'),
    Display: require('./display'),
    DOM: require('./dom'),
    Events: require('./events'),
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
    Tweens: require('./tweens'),
    Utils: require('./utils')

};

//  Merge in the optional plugins and WebGL only features

if (typeof FEATURE_SOUND)
{
    Phaser.Sound = require('./sound');
}

if (typeof PLUGIN_CAMERA3D)
{
    Phaser.Cameras.Sprite3D = require('../plugins/camera3d/src');
    Phaser.GameObjects.Sprite3D = require('../plugins/camera3d/src/sprite3d/Sprite3D');
    Phaser.GameObjects.Factories.Sprite3D = require('../plugins/camera3d/src/sprite3d/Sprite3DFactory');
    Phaser.GameObjects.Creators.Sprite3D = require('../plugins/camera3d/src/sprite3d/Sprite3DCreator');
}

if (typeof PLUGIN_FBINSTANT)
{
    Phaser.FacebookInstantGamesPlugin = require('../plugins/fbinstant/src/FacebookInstantGamesPlugin');
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
