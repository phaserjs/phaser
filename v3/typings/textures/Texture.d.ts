/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/
import Frame from './Frame';
import TextureSource from './TextureSource';
import TextureManager from './TextureManager';
/**
* A Texture consists of a source, usually an Image from the Cache, or a Canvas, and a collection
* of Frames. The Frames represent the different areas of the Texture. For example a texture atlas
* may have many Frames, one for each element within the atlas. Where-as a single image would have
* just one frame, that encompasses the whole image.
*
* Textures are managed by the global TextureManager. This is a singleton class that is
* responsible for creating and delivering Textures and their corresponding Frames to Game Objects.
*
* Sprites and other Game Objects get the texture data they need from the TextureManager.
*
* @class Phaser.Texture
* @constructor
* @param {object} source
* @param {number} scaleMode
*/
export default class Texture {
    manager: any;
    source: TextureSource[];
    frames: any;
    frameTotal: any;
    key: any;
    constructor(manager: TextureManager, key: any, source: any);
    add(name: any, sourceIndex: any, x: any, y: any, width: any, height: any): Frame;
    get(name: any): any;
    setTextureIndex(index: any): any;
    /**
    * Destroys this base texture
    *
    * @method destroy
    */
    destroy(): void;
}
