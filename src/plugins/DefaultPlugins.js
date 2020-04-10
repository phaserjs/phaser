/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @typedef {object} Phaser.Plugins.DefaultPlugins
 * 
 * @property {array} Global - These are the Global Managers that are created by the Phaser.Game instance.
 * @property {array} CoreScene - These are the core plugins that are installed into every Scene.Systems instance, no matter what.
 * @property {array} DefaultScene - These plugins are created in Scene.Systems in addition to the CoreScenePlugins.
 */

var DefaultPlugins = {

    /**
     * These are the Global Managers that are created by the Phaser.Game instance.
     * They are referenced from Scene.Systems so that plugins can use them.
     * 
     * @name Phaser.Plugins.Global
     * @type {array}
     * @since 3.0.0
     */
    Global: [

        'game',
        'anims',
        'cache',
        'plugins',
        'registry',
        'scale',
        'sound',
        'textures'

    ],

    /**
     * These are the core plugins that are installed into every Scene.Systems instance, no matter what.
     * They are optionally exposed in the Scene as well (see the InjectionMap for details)
     * 
     * They are created in the order in which they appear in this array and EventEmitter is always first.
     * 
     * @name Phaser.Plugins.CoreScene
     * @type {array}
     * @since 3.0.0
     */
    CoreScene: [

        'EventEmitter',

        'CameraManager',
        'GameObjectCreator',
        'GameObjectFactory',
        'ScenePlugin',
        'DisplayList',
        'UpdateList'

    ],

    /**
     * These plugins are created in Scene.Systems in addition to the CoreScenePlugins.
     * 
     * You can elect not to have these plugins by either creating a DefaultPlugins object as part
     * of the Game Config, by creating a Plugins object as part of a Scene Config, or by modifying this array
     * and building your own bundle.
     * 
     * They are optionally exposed in the Scene as well (see the InjectionMap for details)
     * 
     * They are always created in the order in which they appear in the array.
     * 
     * @name Phaser.Plugins.DefaultScene
     * @type {array}
     * @since 3.0.0
     */
    DefaultScene: [

        'Clock',
        'DataManagerPlugin',
        'InputPlugin',
        'Loader',
        'TweenManager',
        'LightsPlugin'

    ]

};

if (typeof PLUGIN_CAMERA3D)
{
    DefaultPlugins.DefaultScene.push('CameraManager3D');
}

if (typeof PLUGIN_FBINSTANT)
{
    DefaultPlugins.Global.push('facebook');
}

module.exports = DefaultPlugins;
