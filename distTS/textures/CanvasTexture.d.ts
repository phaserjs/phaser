/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Class: any;
declare var IsSizePowerOfTwo: (width: any, height: any) => boolean;
declare var Texture: {
    texture: any;
    frame: any;
    isCropped: boolean;
    setTexture: (key: any, frame: any) => any;
    setFrame: (frame: any, updateSize: any, updateOrigin: any) => any;
};
/**
 * @classdesc
 * A Canvas Texture is a special kind of Texture that is backed by an HTML Canvas Element as its source.
 *
 * You can use the properties of this texture to draw to the canvas element directly, using all of the standard
 * canvas operations available in the browser. Any Game Object can be given this texture and will render with it.
 *
 * Note: When running under WebGL the Canvas Texture needs to re-generate its base WebGLTexture and reupload it to
 * the GPU every time you modify it, otherwise the changes you make to this texture will not be visible. To do this
 * you should call `CanvasTexture.refresh()` once you are finished with your changes to the canvas. Try and keep
 * this to a minimum, especially on large canvas sizes, or you may inadvertently thrash the GPU by constantly uploading
 * texture data to it. This restriction does not apply if using the Canvas Renderer.
 *
 * It starts with only one frame that covers the whole of the canvas. You can add further frames, that specify
 * sections of the canvas using the `add` method.
 *
 * Should you need to resize the canvas use the `setSize` method so that it accurately updates all of the underlying
 * texture data as well. Forgetting to do this (i.e. by changing the canvas size directly from your code) could cause
 * graphical errors.
 *
 * @class CanvasTexture
 * @extends Phaser.Textures.Texture
 * @memberOf Phaser.Textures
 * @constructor
 * @since 3.7.0
 *
 * @param {Phaser.Textures.TextureManager} manager - A reference to the Texture Manager this Texture belongs to.
 * @param {string} key - The unique string-based key of this Texture.
 * @param {HTMLCanvasElement} source - The canvas element that is used as the base of this texture.
 * @param {integer} width - The width of the canvas.
 * @param {integer} height - The height of the canvas.
 */
declare var CanvasTexture: any;
