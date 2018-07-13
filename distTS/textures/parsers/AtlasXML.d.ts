/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
/**
 * Parses an XML Texture Atlas object and adds all the Frames into a Texture.
 *
 * @function Phaser.Textures.Parsers.AtlasXML
 * @memberOf Phaser.Textures.Parsers
 * @private
 * @since 3.7.0
 *
 * @param {Phaser.Textures.Texture} texture - The Texture to add the Frames to.
 * @param {integer} sourceIndex - The index of the TextureSource.
 * @param {*} xml - The XML data.
 *
 * @return {Phaser.Textures.Texture} The Texture modified by this parser.
 */
declare var AtlasXML: (texture: any, sourceIndex: any, xml: any) => any;
