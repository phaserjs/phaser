import Texture from './Texture';
/**
* A Frame is a section of a Texture.
*
* Called TextureFrame during integration, will rename to Frame later.
*
* @class Phaser.TextureFrame
* @constructor
* @param {Phaser.Texture} texture - The Texture this Frame belongs to.
* @param {string} name - The unique (within the Texture) name of this Frame.
* @param {number} x - X position of the frame within the Texture.
* @param {number} y - Y position of the frame within the Texture.
* @param {number} width - Width of the frame within the Texture.
* @param {number} height - Height of the frame within the Texture.
*/
export default class Frame {
    texture: Texture;
    name: string;
    source: any;
    sourceIndex: any;
    cutX: any;
    cutY: any;
    cutWidth: any;
    cutHeight: any;
    x: any;
    y: any;
    width: any;
    height: any;
    rotated: any;
    isTiling: any;
    requiresReTint: any;
    autoRound: any;
    private data;
    constructor(texture: Texture, name: string, sourceIndex: any, x?: any, y?: any, width?: any, height?: any);
    /**
    * If the frame was trimmed when added to the Texture Atlas, this records the trim and source data.
    *
    * @method Phaser.TextureFrame#setTrim
    * @param {number} actualWidth - The width of the frame before being trimmed.
    * @param {number} actualHeight - The height of the frame before being trimmed.
    * @param {number} destX - The destination X position of the trimmed frame for display.
    * @param {number} destY - The destination Y position of the trimmed frame for display.
    * @param {number} destWidth - The destination width of the trimmed frame for display.
    * @param {number} destHeight - The destination height of the trimmed frame for display.
    */
    setTrim(actualWidth: any, actualHeight: any, destX: any, destY: any, destWidth: any, destHeight: any): this;
    /**
    * Updates the internal WebGL UV cache.
    *
    * @method updateUVs
    * @private
    */
    private updateUVs();
    /**
    * Updates the internal WebGL UV cache.
    *
    * @method updateUVsInverted
    * @private
    */
    private updateUVsInverted();
    clone(): Frame;
    destroy(): void;
    /**
    * The width of the Frame in its un-trimmed, un-padded state, as prepared in the art package,
    * before being packed.
    *
    * @name Phaser.TextureFrame#realWidth
    * @property {any} realWidth
    */
    readonly realWidth: any;
    /**
   * The height of the Frame in its un-trimmed, un-padded state, as prepared in the art package,
   * before being packed.
   *
   * @name Phaser.TextureFrame#realHeight
   * @property {any} realHeight
   */
    readonly realHeight: any;
    /**
    * UVs
    *
    * @name Phaser.TextureFrame#uvs
    * @property {Object} uvs
    */
    readonly uvs: any;
}
