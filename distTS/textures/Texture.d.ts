/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Class: any;
declare var Frame: any;
declare var TextureSource: any;
/**
 * @classdesc
 * A Texture consists of a source, usually an Image from the Cache, and a collection of Frames.
 * The Frames represent the different areas of the Texture. For example a texture atlas
 * may have many Frames, one for each element within the atlas. Where-as a single image would have
 * just one frame, that encompasses the whole image.
 *
 * Textures are managed by the global TextureManager. This is a singleton class that is
 * responsible for creating and delivering Textures and their corresponding Frames to Game Objects.
 *
 * Sprites and other Game Objects get the texture data they need from the TextureManager.
 *
 * @class Texture
 * @memberOf Phaser.Textures
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Textures.TextureManager} manager - A reference to the Texture Manager this Texture belongs to.
 * @param {string} key - The unique string-based key of this Texture.
 * @param {(HTMLImageElement[]|HTMLCanvasElement[])} source - An array of sources that are used to create the texture. Usually Images, but can also be a Canvas.
 * @param {number} [width] - The width of the Texture. This is optional and automatically derived from the source images.
 * @param {number} [height] - The height of the Texture. This is optional and automatically derived from the source images.
 */
declare var Texture: {
    texture: any;
    frame: any;
    isCropped: boolean;
    setTexture: (key: any, frame: any) => any; /**
     * A reference to the Texture Manager this Texture belongs to.
     *
     * @name Phaser.Textures.Texture#manager
     * @type {Phaser.Textures.TextureManager}
     * @since 3.0.0
     */
    setFrame: (frame: any, updateSize: any, updateOrigin: any) => any;
};
