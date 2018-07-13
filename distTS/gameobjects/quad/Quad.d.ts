/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Class: any;
declare var Mesh: any;
/**
 * @classdesc
 * A Quad Game Object.
 *
 * A Quad is a Mesh Game Object pre-configured with two triangles arranged into a rectangle, with a single
 * texture spread across them.
 *
 * You can manipulate the corner points of the quad via the getters and setters such as `topLeftX`, and also
 * change their alpha and color values. The quad itself can be moved by adjusting the `x` and `y` properties.
 *
 * @class Quad
 * @extends Phaser.GameObjects.Mesh
 * @memberOf Phaser.GameObjects
 * @constructor
 * @webglOnly
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this Quad belongs.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {string} texture - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {(string|integer)} [frame] - An optional frame from the Texture this Game Object is rendering with.
 */
declare var Quad: any;
