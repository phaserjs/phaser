/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/
/**
* Parse a Sprite Sheet and extracts the frame data from it.
*
* @class Phaser.TextureParser.SpriteSheet
* @static
* @param {Phaser.Texture} texture - The parent Texture.
* @param {string} key - The key of the Frame within the Texture that the Sprite Sheet is stored in.
* @param {number} frameWidth - The fixed width of each frame.
* @param {number} frameHeight - The fixed height of each frame.
* @param {number} [startFrame=0] - Skip a number of frames. Useful when there are multiple sprite sheets in one Texture.
* @param {number} [endFrame=-1] - The total number of frames to extract from the Sprite Sheet. The default value of -1 means "extract all frames".
* @param {number} [margin=0] - If the frames have been drawn with a margin, specify the amount here.
* @param {number} [spacing=0] - If the frames have been drawn with spacing between them, specify the amount here.
* @return {Phaser.FrameData} A FrameData object containing the parsed frames.
*/
export default function (texture: any, sourceIndex: any, x: any, y: any, width: any, height: any, frameWidth: any, frameHeight: any, startFrame: any, endFrame: any, margin: any, spacing: any): any;
