/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Defines the three lists of plugins that Phaser loads automatically when a game starts.
 *
 * `Global` plugins are instantiated once by the `Phaser.Game` instance and are shared across
 * all Scenes (e.g. the Animation Manager, Cache, Texture Manager, and Renderer).
 *
 * `CoreScene` plugins are installed into every `Scene.Systems` instance unconditionally and
 * provide essential per-Scene functionality such as the Camera Manager, Game Object Factory,
 * Display List, and Update List.
 *
 * `DefaultScene` plugins are also installed into every Scene but can be omitted by providing
 * a custom `plugins` configuration in the Game Config or Scene Config. They include optional
 * but commonly used systems such as the Input Plugin, Tween Manager, and Loader.
 *
 * You can customise which default plugins are loaded by modifying these arrays or by supplying
 * a `DefaultPlugins` object in your Game Config before the game starts.
 *
 * @namespace Phaser.Plugins.DefaultPlugins
 * @memberof Phaser.Plugins
 * @since 3.0.0
 */

var DefaultPlugins = {

    /**
     * These are the Global Managers that are created by the Phaser.Game instance.
     * They are referenced from Scene.Systems so that plugins can use them.
     *
     * @name Phaser.Plugins.DefaultPlugins.Global
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
        'textures',
        'renderer'

    ],

    /**
     * These are the core plugins that are installed into every Scene.Systems instance, no matter what.
     * They are optionally exposed in the Scene as well (see the InjectionMap for details)
     *
     * They are created in the order in which they appear in this array and EventEmitter is always first.
     *
     * @name Phaser.Plugins.DefaultPlugins.CoreScene
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
     * @name Phaser.Plugins.DefaultPlugins.DefaultScene
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
