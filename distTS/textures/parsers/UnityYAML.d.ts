/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var imageHeight: number;
/**
 * @function addFrame
 * @private
 * @since 3.0.0
 */
declare var addFrame: (texture: any, sourceIndex: any, name: any, frame: any) => void;
/**
 * Parses a Unity YAML File and creates Frames in the Texture.
 * For more details about Sprite Meta Data see https://docs.unity3d.com/ScriptReference/SpriteMetaData.html
 *
 * @function Phaser.Textures.Parsers.UnityYAML
 * @memberOf Phaser.Textures.Parsers
 * @private
 * @since 3.0.0
 *
 * @param {Phaser.Textures.Texture} texture - The Texture to add the Frames to.
 * @param {integer} sourceIndex - The index of the TextureSource.
 * @param {object} yaml - The YAML data.
 *
 * @return {Phaser.Textures.Texture} The Texture modified by this parser.
 */
declare var UnityYAML: (texture: any, sourceIndex: any, yaml: any) => any;
