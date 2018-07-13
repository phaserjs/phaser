/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Class: any;
declare var CONST: {
    VERSION: string;
    BlendModes: any;
    ScaleModes: any;
    AUTO: number;
    CANVAS: number;
    WEBGL: number;
    HEADLESS: number;
    FOREVER: number;
    NONE: number;
    UP: number;
    DOWN: number;
    LEFT: number;
    RIGHT: number;
};
declare var DefaultPlugins: any;
declare var GetPhysicsPlugins: (sys: any) => any[];
declare var GetScenePlugins: (sys: any) => any;
declare var NOOP: any;
declare var Settings: {
    create: (config: any) => {
        status: any; /**
         * [description]
         *
         * @name Phaser.Scenes.Systems#cache
         * @type {Phaser.Cache.CacheManager}
         * @since 3.0.0
         */
        key: any;
        active: any;
        visible: any;
        isBooted: boolean;
        /**
         * [description]
         *
         * @name Phaser.Scenes.Systems#plugins
         * @type {Phaser.Plugins.PluginManager}
         * @since 3.0.0
         */
        isTransition: boolean;
        transitionFrom: any;
        transitionDuration: number;
        transitionAllowInput: boolean;
        data: {}; /**
         * [description]
         *
         * @name Phaser.Scenes.Systems#registry
         * @type {Phaser.Data.DataManager}
         * @since 3.0.0
         */
        pack: any;
        cameras: any;
        map: any;
        physics: any;
        loader: any;
        plugins: any;
        input: any;
    };
};
/**
 * @classdesc
 * The Scene Systems class.
 *
 * This class is available from within a Scene under the property `sys`.
 * It is responsible for managing all of the plugins a Scene has running, including the display list, and
 * handling the update step and renderer. It also contains references to global systems belonging to Game.
 *
 * @class Systems
 * @memberOf Phaser.Scenes
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - The Scene that owns this Systems instance.
 * @param {(string|Phaser.Scenes.Settings.Config)} config - Scene specific configuration settings.
 */
declare var Systems: any;
