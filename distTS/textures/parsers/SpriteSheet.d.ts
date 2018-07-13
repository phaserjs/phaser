/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var GetFastValue: any;
/**
 * Parses a Sprite Sheet and adds the Frames to the Texture.
 *
 * In Phaser terminology a Sprite Sheet is a texture containing different frames, but each frame is the exact
 * same size and cannot be trimmed or rotated.
 *
 * @function Phaser.Textures.Parsers.SpriteSheet
 * @memberOf Phaser.Textures.Parsers
 * @private
 * @since 3.0.0
 *
 * @param {Phaser.Textures.Texture} texture - The Texture to add the Frames to.
 * @param {integer} sourceIndex - The index of the TextureSource.
 * @param {integer} x - [description]
 * @param {integer} y - [description]
 * @param {integer} width - [description]
 * @param {integer} height - [description]
 * @param {object} config - An object describing how to parse the Sprite Sheet.
 * @param {number} config.frameWidth - Width in pixels of a single frame in the sprite sheet.
 * @param {number} [config.frameHeight] - Height in pixels of a single frame in the sprite sheet. Defaults to frameWidth if not provided.
 * @param {number} [config.startFrame=0] - [description]
 * @param {number} [config.endFrame=-1] - [description]
 * @param {number} [config.margin=0] - If the frames have been drawn with a margin, specify the amount here.
 * @param {number} [config.spacing=0] - If the frames have been drawn with spacing between them, specify the amount here.
 *
 * @return {Phaser.Textures.Texture} The Texture modified by this parser.
 */
declare var SpriteSheet: (texture: any, sourceIndex: any, x: any, y: any, width: any, height: any, config: any) => any;
