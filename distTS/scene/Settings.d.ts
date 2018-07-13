/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
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
declare var GetValue: any;
declare var Merge: any;
declare var InjectionMap: {
    game: string;
    anims: string;
    cache: string;
    plugins: string;
    registry: string;
    sound: string;
    textures: string;
    events: string;
    cameras: string;
    cameras3d: string;
    add: string;
    make: string;
    scenePlugin: string;
    displayList: string;
    lights: string;
    data: string;
    input: string;
    load: string;
    time: string;
    tweens: string;
    arcadePhysics: string;
    impactPhysics: string;
    matterPhysics: string;
};
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
declare var Settings: {
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
    create: (config: any) => {
        status: any;
        key: any;
        active: any;
        visible: any;
        isBooted: boolean;
        isTransition: boolean;
        transitionFrom: any;
        transitionDuration: number;
        transitionAllowInput: boolean;
        data: {};
        pack: any;
        cameras: any;
        map: any;
        physics: any;
        loader: any;
        plugins: any;
        input: any;
    };
};
