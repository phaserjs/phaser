/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var CONST = require('./const');
var GetValue = require('../utils/object/GetValue');
var Merge = require('../utils/object/Merge');
var InjectionMap = require('./InjectionMap');

/**
 * @namespace Phaser.Scenes.Settings
 */

/**
 * @typedef {object} Phaser.Scenes.Settings.Config
 *
 * @property {string} [key] - The unique key of this Scene. Must be unique within the entire Game instance.
 * @property {boolean} [active=false] - Does the Scene start as active or not? An active Scene updates each step.
 * @property {boolean} [visible=true] - Does the Scene start as visible or not? A visible Scene renders each step.
 * @property {(false|Phaser.Loader.FileTypes.PackFileConfig)} [pack=false] - An optional Loader Packfile to be loaded before the Scene begins.
 * @property {?(InputJSONCameraObject|InputJSONCameraObject[])} [cameras=null] - An optional Camera configuration object.
 * @property {Object.<string, string>} [map] - Overwrites the default injection map for a scene.
 * @property {Object.<string, string>} [mapAdd] - Extends the injection map for a scene.
 * @property {object} [physics={}] - The physics configuration object for the Scene.
 * @property {object} [loader={}] - The loader configuration object for the Scene.
 * @property {(false|*)} [plugins=false] - The plugin configuration object for the Scene.
 */

/**
 * @typedef {object} Phaser.Scenes.Settings.Object
 *
 * @property {number} status - The current status of the Scene. Maps to the Scene constants.
 * @property {string} key - The unique key of this Scene. Unique within the entire Game instance.
 * @property {boolean} active - The active state of this Scene. An active Scene updates each step.
 * @property {boolean} visible - The visible state of this Scene. A visible Scene renders each step.
 * @property {boolean} isBooted - Has the Scene finished booting?
 * @property {boolean} isTransition - Is the Scene in a state of transition?
 * @property {?Phaser.Scene} transitionFrom - The Scene this Scene is transitioning from, if set.
 * @property {integer} transitionDuration - The duration of the transition, if set.
 * @property {boolean} transitionAllowInput - Is this Scene allowed to receive input during transitions?
 * @property {object} data - a data bundle passed to this Scene from the Scene Manager.
 * @property {(false|Phaser.Loader.FileTypes.PackFileConfig)} pack - The Loader Packfile to be loaded before the Scene begins.
 * @property {?(InputJSONCameraObject|InputJSONCameraObject[])} cameras - The Camera configuration object.
 * @property {Object.<string, string>} map - The Scene's Injection Map.
 * @property {object} physics - The physics configuration object for the Scene.
 * @property {object} loader - The loader configuration object for the Scene.
 * @property {(false|*)} plugins - The plugin configuration object for the Scene.
 */

var Settings = {

    /**
     * Takes a Scene configuration object and returns a fully formed System Settings object.
     *
     * @function Phaser.Scenes.Settings.create
     * @since 3.0.0
     *
     * @param {(string|Phaser.Scenes.Settings.Config)} config - The Scene configuration object used to create this Scene Settings.
     *
     * @return {Phaser.Scenes.Settings.Object} The Scene Settings object created as a result of the config and default settings.
     */
    create: function (config)
    {
        if (typeof config === 'string')
        {
            config = { key: config };
        }
        else if (config === undefined)
        {
            //  Pass the 'hasOwnProperty' checks
            config = {};
        }

        return {

            status: CONST.PENDING,

            key: GetValue(config, 'key', ''),
            active: GetValue(config, 'active', false),
            visible: GetValue(config, 'visible', true),

            isBooted: false,

            isTransition: false,
            transitionFrom: null,
            transitionDuration: 0,
            transitionAllowInput: true,

            //  Loader payload array

            data: {},

            pack: GetValue(config, 'pack', false),

            //  Cameras

            cameras: GetValue(config, 'cameras', null),

            //  Scene Property Injection Map

            map: GetValue(config, 'map', Merge(InjectionMap, GetValue(config, 'mapAdd', {}))),

            //  Physics

            physics: GetValue(config, 'physics', {}),

            //  Loader

            loader: GetValue(config, 'loader', {}),

            //  Plugins

            plugins: GetValue(config, 'plugins', false),

            //  Input

            input: GetValue(config, 'input', {})

        };
    }

};

module.exports = Settings;
