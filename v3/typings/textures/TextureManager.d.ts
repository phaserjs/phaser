import Texture from './Texture';
/**
* Textures are managed by the global TextureManager. This is a singleton class that is
* responsible for creating and delivering Textures and their corresponding Frames to Game Objects.
*
* Sprites and other Game Objects get the texture data they need from the TextureManager.
*
* Access it via `state.textures`.
*
* @class Phaser.TextureManager
* @constructor
*/
export default class TextureManager {
    list: any;
    constructor();
    addImage(key: any, source: any): Texture;
    addCanvas(key: any, source: any): Texture;
    addAtlas(key: any, source: any, data: any): Texture;
    addAtlasJSONArray(key: any, source: any, data: any): Texture;
    addAtlasJSONHash(key: any, source: any, data: any): Texture;
    addSpriteSheet(key: any, source: any, frameWidth: any, frameHeight: any, startFrame: any, endFrame: any, margin: any, spacing: any): Texture;
    addSpriteSheetFromAtlas(key: any, atlasKey: any, atlasFrame: any, frameWidth: any, frameHeight: any, startFrame: any, endFrame: any, margin: any, spacing: any): Texture;
    addAtlasStarlingXML(key: any, source: any, data: any): Texture;
    addAtlasPyxel(key: any, source: any, data: any): Texture;
    create(key: any, source: any): Texture;
    exists(key: any): any;
    get(key: any): any;
    cloneFrame(key: any, frame: any): any;
    getFrame(key: any, frame: any): any;
    setTexture(gameObject: any, key: any, frame: any): any;
    /**
    * Passes all Textures to the given callback.
    *
    * @method each
    * @param {function} callback - The function to call.
    * @param {object} [thisArg] - Value to use as `this` when executing callback.
    * @param {...*} [arguments] - Additional arguments that will be passed to the callback, after the child.
    */
    each(callback: any, thisArg: any): void;
}
