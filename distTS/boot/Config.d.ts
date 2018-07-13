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
declare var GetFastValue: any;
declare var GetValue: any;
declare var IsPlainObject: any;
declare var MATH: any;
declare var NOOP: any;
declare var DefaultPlugins: any;
declare var ValueToColor: any;
/**
 * This callback type is completely empty, a no-operation.
 *
 * @callback NOOP
 */
/**
 * @callback BootCallback
 *
 * @param {Phaser.Game} game - [description]
 */
/**
 * @typedef {object} FPSConfig
 *
 * @property {integer} [min=10] - [description]
 * @property {integer} [target=60] - [description]
 * @property {boolean} [forceSetTimeOut=false] - [description]
 * @property {integer} [deltaHistory=10] - [description]
 * @property {integer} [panicMax=120] - [description]
 */
/**
 * @typedef {object} LoaderConfig
 *
 * @property {string} [baseURL] - [description]
 * @property {string} [path] - [description]
 * @property {integer} [maxParallelDownloads=32] - [description]
 * @property {(string|undefined)} [crossOrigin=undefined] - [description]
 * @property {string} [responseType] - [description]
 * @property {boolean} [async=true] - [description]
 * @property {string} [user] - [description]
 * @property {string} [password] - [description]
 * @property {integer} [timeout=0] - [description]
 */
/**
 * @typedef {object} GameConfig
 *
 * @property {(integer|string)} [width=1024] - [description]
 * @property {(integer|string)} [height=768] - [description]
 * @property {number} [zoom=1] - [description]
 * @property {number} [resolution=1] - [description]
 * @property {number} [type=CONST.AUTO] - [description]
 * @property {*} [parent=null] - [description]
 * @property {HTMLCanvasElement} [canvas=null] - Provide your own Canvas element for Phaser to use instead of creating one.
 * @property {string} [canvasStyle=null] - [description]
 * @property {CanvasRenderingContext2D} [context] - Provide your own Canvas Context for Phaser to use, instead of creating one.
 * @property {object} [scene=null] - [description]
 * @property {string[]} [seed] - [description]
 * @property {string} [title=''] - [description]
 * @property {string} [url='http://phaser.io'] - [description]
 * @property {string} [version=''] - [description]
 * @property {boolean} [autoFocus=true] - Automatically call window.focus() when the game boots.
 * @property {(boolean|object)} [input] - [description]
 * @property {boolean} [input.keyboard=true] - [description]
 * @property {*} [input.keyboard.target=window] - [description]
 * @property {(boolean|object)} [input.mouse=true] - [description]
 * @property {*} [input.mouse.target=null] - [description]
 * @property {boolean} [input.touch=true] - [description]
 * @property {integer} [input.activePointers=1] - [description]
 * @property {*} [input.touch.target=null] - [description]
 * @property {boolean} [input.touch.capture=true] - [description]
 * @property {(boolean|object)} [input.gamepad=false] - [description]
 * @property {boolean} [disableContextMenu=false] - [description]
 * @property {(boolean|object)} [banner=false] - [description]
 * @property {boolean} [banner.hidePhaser=false] - [description]
 * @property {string} [banner.text='#ffffff'] - [description]
 * @property {string[]} [banner.background] - [description]
 * @property {FPSConfig} [fps] - [description]
 * @property {boolean} [render.antialias=true] - [description]
 * @property {boolean} [render.pixelArt=false] - [description]
 * @property {boolean} [render.autoResize=false] - [description]
 * @property {boolean} [render.roundPixels=false] - [description]
 * @property {boolean} [render.transparent=false] - [description]
 * @property {boolean} [render.clearBeforeRender=true] - [description]
 * @property {boolean} [render.premultipliedAlpha=true] - [description]
 * @property {boolean} [render.preserveDrawingBuffer=false] - [description]
 * @property {boolean} [render.failIfMajorPerformanceCaveat=false] - [description]
 * @property {string} [render.powerPreference='default'] - "high-performance", "low-power" or "default"
 * @property {integer} [render.batchSize=2000] - The default WebGL batch size.
 * @property {(string|number)} [backgroundColor=0x000000] - [description]
 * @property {object} [callbacks] - [description]
 * @property {BootCallback} [callbacks.preBoot=NOOP] - [description]
 * @property {BootCallback} [callbacks.postBoot=NOOP] - [description]
 * @property {LoaderConfig} [loader] - [description]
 * @property {object} [images] - [description]
 * @property {string} [images.default] - [description]
 * @property {string} [images.missing] - [description]
 * @property {object} [physics] - [description]
 */
/**
 * @classdesc
 * [description]
 *
 * @class Config
 * @memberOf Phaser.Boot
 * @constructor
 * @since 3.0.0
 *
 * @param {GameConfig} [GameConfig] - The configuration object for your Phaser Game instance.
 */
declare var Config: any;
