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

var Settings = {

    /**
     * Takes a Scene configuration object and returns a fully formed System Settings object.
     *
     * @function Phaser.Scenes.Settings.create
     * @since 3.0.0
     *
     * @param {(string|Phaser.Scenes.Types.SettingsConfig)} config - The Scene configuration object used to create this Scene Settings.
     *
     * @return {Phaser.Scenes.Types.SettingsObject} The Scene Settings object created as a result of the config and default settings.
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
