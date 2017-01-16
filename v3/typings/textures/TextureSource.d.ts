/**
*
* @class Phaser.TextureSource
* @constructor
* @param {object} source
* @param {number} scaleMode
*/
export default class TextureSource {
    texture: any;
    compressionAlgorithm: any;
    resolution: number;
    readonly width: number;
    readonly height: number;
    image: any;
    scaleMode: any;
    premultipliedAlpha: boolean;
    mipmap: boolean;
    renderable: boolean;
    isPowerOf2: boolean;
    glTexture: any;
    glTextureIndex: number;
    glLastUsed: number;
    glDirty: boolean;
    constructor(texture: any, source: any);
}
