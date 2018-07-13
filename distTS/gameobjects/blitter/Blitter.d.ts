/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var BlitterRender: any;
declare var Bob: any;
declare var Class: any;
declare var Components: any;
declare var Frame: any;
declare var GameObject: any;
declare var List: any;
/**
 * @callback Phaser.GameObjects.Blitter.CreateCallback
 *
 * @param {Phaser.GameObjects.Blitter.Bob} bob - The Bob that was created by the Blitter.
 * @param {integer} index - The position of the Bob within the Blitter display list.
 */
/**
 * @classdesc
 * A Blitter Game Object.
 *
 * The Blitter Game Object is a special kind of container that creates, updates and manages Bob objects.
 * Bobs are designed for rendering speed rather than flexibility. They consist of a texture, or frame from a texture,
 * a position and an alpha value. You cannot scale or rotate them. They use a batched drawing method for speed
 * during rendering.
 *
 * A Blitter Game Object has one texture bound to it. Bobs created by the Blitter can use any Frame from this
 * Texture to render with, but they cannot use any other Texture. It is this single texture-bind that allows
 * them their speed.
 *
 * If you have a need to blast a large volume of frames around the screen then Blitter objects are well worth
 * investigating. They are especially useful for using as a base for your own special effects systems.
 *
 * @class Blitter
 * @extends Phaser.GameObjects.GameObject
 * @memberOf Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 *
 * @extends Phaser.GameObjects.Components.Alpha
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.Pipeline
 * @extends Phaser.GameObjects.Components.ScaleMode
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Size
 * @extends Phaser.GameObjects.Components.Texture
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. It can only belong to one Scene at any given time.
 * @param {number} [x=0] - The x coordinate of this Game Object in world space.
 * @param {number} [y=0] - The y coordinate of this Game Object in world space.
 * @param {string} [texture='__DEFAULT'] - The key of the texture this Game Object will use for rendering. The Texture must already exist in the Texture Manager.
 * @param {(string|integer)} [frame=0] - The Frame of the Texture that this Game Object will use. Only set if the Texture has multiple frames, such as a Texture Atlas or Sprite Sheet.
 */
declare var Blitter: any;
