/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
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
 * @property {string} [key] - [description]
 * @property {boolean} [active=false] - [description]
 * @property {boolean} [visible=true] - [description]
 * @property {(false|Phaser.Loader.FileTypes.PackFileConfig)} [pack=false] - [description]
 * @property {?(InputJSONCameraObject|InputJSONCameraObject[])} [cameras=null] - [description]
 * @property {Object.<string, string>} [map] - Overwrites the default injection map for a scene.
 * @property {Object.<string, string>} [mapAdd] - Extends the injection map for a scene.
 * @property {object} [physics={}] - [description]
 * @property {object} [loader={}] - [description]
 * @property {(false|*)} [plugins=false] - [description]
 */

/**
 * @typedef {object} Phaser.Scenes.Settings.Object
 *
 * @property {number} status - [description]
 * @property {string} key - [description]
 * @property {boolean} active - [description]
 * @property {boolean} visible - [description]
 * @property {boolean} isBooted - [description]
 * @property {boolean} isTransition - [description]
 * @property {?Phaser.Scene} transitionFrom - [description]
 * @property {integer} transitionDuration - [description]
 * @property {boolean} transitionAllowInput - [description]
 * @property {object} data - [description]
 * @property {(false|Phaser.Loader.FileTypes.PackFileConfig)} pack - [description]
 * @property {?(InputJSONCameraObject|InputJSONCameraObject[])} cameras - [description]
 * @property {Object.<string, string>} map - [description]
 * @property {object} physics - [description]
 * @property {object} loader - [description]
 * @property {(false|*)} plugins - [description]
 */

var Settings = {

    /**
     * Takes a Scene configuration object and returns a fully formed Systems object.
     *
     * @function Phaser.Scenes.Settings.create
     * @since 3.0.0
     *
     * @param {(string|Phaser.Scenes.Settings.Config)} config - [description]
     *
     * @return {Phaser.Scenes.Settings.Object} [description]
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

            plugins: GetValue(config, 'plugins', false)

        };
    }

};

module.exports = Settings;
