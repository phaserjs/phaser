/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var CanvasPool: any;
declare var CanvasTexture: any;
declare var Class: any;
declare var Color: any;
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
declare var EventEmitter: any;
declare var GenerateTexture: (config: any) => any;
declare var GetValue: any;
declare var Parser: any;
declare var Texture: {
    texture: any;
    frame: any;
    isCropped: boolean;
    setTexture: (key: any, frame: any) => any;
    setFrame: (frame: any, updateSize: any, updateOrigin: any) => any;
};
/**
 * @callback EachTextureCallback
 *
 * @param {Phaser.Textures.Texture} texture - [description]
 * @param {...*} [args] - Additional arguments that will be passed to the callback, after the child.
 */
/**
 * @classdesc
 * Textures are managed by the global TextureManager. This is a singleton class that is
 * responsible for creating and delivering Textures and their corresponding Frames to Game Objects.
 *
 * Sprites and other Game Objects get the texture data they need from the TextureManager.
 *
 * Access it via `scene.textures`.
 *
 * @class TextureManager
 * @extends Phaser.Events.EventEmitter
 * @memberOf Phaser.Textures
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Game} game - [description]
 */
declare var TextureManager: any;
