/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Clone: (source: any) => any;
/**
 * Parses a Texture Atlas JSON Hash and adds the Frames to the Texture.
 * JSON format expected to match that defined by Texture Packer, with the frames property containing an object of Frames.
 *
 * @function Phaser.Textures.Parsers.JSONHash
 * @memberOf Phaser.Textures.Parsers
 * @private
 * @since 3.0.0
 *
 * @param {Phaser.Textures.Texture} texture - The Texture to add the Frames to.
 * @param {integer} sourceIndex - The index of the TextureSource.
 * @param {object} json - The JSON data.
 *
 * @return {Phaser.Textures.Texture} The Texture modified by this parser.
 */
declare var JSONHash: (texture: any, sourceIndex: any, json: any) => any;
