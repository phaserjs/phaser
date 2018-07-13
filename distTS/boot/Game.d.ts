/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var AddToDOM: any;
declare var AnimationManager: any;
declare var CacheManager: any;
declare var CanvasPool: any;
declare var Class: any;
declare var Config: any;
declare var CreateRenderer: (game: any) => void;
declare var DataManager: any;
declare var DebugHeader: (game: any) => void;
declare var Device: any;
declare var DOMContentLoaded: any;
declare var EventEmitter: any;
declare var InputManager: any;
declare var PluginManager: any;
declare var SceneManager: any;
declare var SoundManagerCreator: any;
declare var TextureManager: any;
declare var TimeStep: any;
declare var VisibilityHandler: any;
/**
 * @classdesc
 * The Phaser.Game instance is the main controller for the entire Phaser game. It is responsible
 * for handling the boot process, parsing the configuration values, creating the renderer,
 * and setting-up all of the global Phaser systems, such as sound and input.
 * Once that is complete it will start the Scene Manager and then begin the main game loop.
 *
 * You should generally avoid accessing any of the systems created by Game, and instead use those
 * made available to you via the Phaser.Scene Systems class instead.
 *
 * @class Game
 * @memberOf Phaser
 * @constructor
 * @since 3.0.0
 *
 * @param {GameConfig} [GameConfig] - The configuration object for your Phaser Game instance.
 */
declare var Game: any;
