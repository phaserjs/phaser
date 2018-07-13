/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Felipe Alfonso <@bitnenfer>
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
declare var IsSizePowerOfTwo: (width: any, height: any) => boolean;
declare var SpliceOne: any;
declare var Utils: any;
declare var WebGLSnapshot: (sourceCanvas: any, type: any, encoderOptions: any) => HTMLImageElement;
declare var BitmapMaskPipeline: any;
declare var FlatTintPipeline: any;
declare var ForwardDiffuseLightPipeline: any;
declare var TextureTintPipeline: any;
/**
 * @callback WebGLContextCallback
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - [description]
 */
/**
 * @typedef {object} SnapshotState
 *
 * @property {SnapshotCallback} callback - [description]
 * @property {string} type - [description]
 * @property {number} encoder - [description]
 */
/**
 * @classdesc
 * WebGLRenderer is a class that contains the needed functionality to keep the
 * WebGLRenderingContext state clean. The main idea of the WebGLRenderer is to keep track of
 * any context change that happens for WebGL rendering inside of Phaser. This means
 * if raw webgl functions are called outside the WebGLRenderer of the Phaser WebGL
 * rendering ecosystem they might pollute the current WebGLRenderingContext state producing
 * unexpected behavior. It's recommended that WebGL interaction is done through
 * WebGLRenderer and/or WebGLPipeline.
 *
 * @class WebGLRenderer
 * @memberOf Phaser.Renderer.WebGL
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Game} game - [description]
 */
declare var WebGLRenderer: any;
