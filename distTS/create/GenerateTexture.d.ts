/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Arne16: any;
declare var CanvasPool: any;
declare var GetValue: any;
/**
 * @callback GenerateTextureRendererCallback
 *
 * @param {HTMLCanvasElement} canvas - [description]
 * @param {CanvasRenderingContext2D} context - [description]
 */
/**
 * @typedef {object} GenerateTextureConfig
 *
 * @property {array} [data=[]] - [description]
 * @property {HTMLCanvasElement} [canvas=null] - [description]
 * @property {Palette} [palette=Arne16] - [description]
 * @property {number} [pixelWidth=1] - [description]
 * @property {number} [pixelHeight=1] - [description]
 * @property {boolean} [resizeCanvas=true] - [description]
 * @property {boolean} [clearCanvas=true] - [description]
 * @property {GenerateTextureRendererCallback} [preRender] - [description]
 * @property {GenerateTextureRendererCallback} [postRender] - [description]
 */
/**
 * [description]
 *
 * @function Phaser.Create.GenerateTexture
 * @since 3.0.0
 *
 * @param {GenerateTextureConfig} config - [description]
 *
 * @return {HTMLCanvasElement} [description]
 */
declare var GenerateTexture: (config: any) => any;
