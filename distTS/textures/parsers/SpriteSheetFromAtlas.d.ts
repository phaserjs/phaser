/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var GetFastValue: any;
/**
 * Parses a Sprite Sheet and adds the Frames to the Texture, where the Sprite Sheet is stored as a frame within an Atlas.
 *
 * In Phaser terminology a Sprite Sheet is a texture containing different frames, but each frame is the exact
 * same size and cannot be trimmed or rotated.
 *
 * @function Phaser.Textures.Parsers.SpriteSheetFromAtlas
 * @memberOf Phaser.Textures.Parsers
 * @private
 * @since 3.0.0
 *
 * @param {Phaser.Textures.Texture} texture - The Texture to add the Frames to.
 * @param {Phaser.Textures.Frame} frame - The Frame that contains the Sprite Sheet.
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
declare var SpriteSheetFromAtlas: (texture: any, frame: any, config: any) => any;
