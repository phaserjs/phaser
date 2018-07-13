/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var BlendModes: any;
declare var Circle: any;
declare var CircleContains: any;
declare var Class: any;
declare var Components: any;
declare var GameObject: any;
declare var Rectangle: any;
declare var RectangleContains: any;
/**
 * @classdesc
 * A Zone Game Object.
 *
 * A Zone is a non-rendering rectangular Game Object that has a position and size.
 * It has no texture and never displays, but does live on the display list and
 * can be moved, scaled and rotated like any other Game Object.
 *
 * Its primary use is for creating Drop Zones and Input Hit Areas and it has a couple of helper methods
 * specifically for this. It is also useful for object overlap checks, or as a base for your own
 * non-displaying Game Objects.

 * The default origin is 0.5, the center of the Zone, the same as with Game Objects.
 *
 * @class Zone
 * @extends Phaser.GameObjects.GameObject
 * @memberOf Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 *
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.GetBounds
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.ScaleMode
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {number} [width=1] - The width of the Game Object.
 * @param {number} [height=1] - The height of the Game Object.
 */
declare var Zone: any;
