/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Felipe Alfonso <@bitnenfer>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var ArrayUtils: any;
declare var Class: any;
declare var Components: any;
declare var GameObject: any;
declare var Rectangle: any;
declare var Render: any;
declare var Union: any;
declare var Vector2: any;
/**
 * @classdesc
 * A Container Game Object.
 *
 * A Container, as the name implies, can 'contain' other types of Game Object.
 * When a Game Object is added to a Container, the Container becomes responsible for the rendering of it.
 * By default it will be removed from the Display List and instead added to the Containers own internal list.
 *
 * The position of the Game Object automatically becomes relative to the position of the Container.
 *
 * When the Container is rendered, all of its children are rendered as well, in the order in which they exist
 * within the Container. Container children can be repositioned using methods such as `MoveUp`, `MoveDown` and `SendToBack`.
 *
 * If you modify a transform property of the Container, such as `Container.x` or `Container.rotation` then it will
 * automatically influence all children as well.
 *
 * Containers can include other Containers for deeply nested transforms.
 *
 * Containers can have masks set on them and can be used as a mask too. However, Container children cannot be masked.
 * The masks do not 'stack up'. Only a Container on the root of the display list will use its mask.
 *
 * Containers can be enabled for input. Because they do not have a texture you need to provide a shape for them
 * to use as their hit area. Container children can also be enabled for input, independent of the Container.
 *
 * Containers can be given a physics body for either Arcade Physics, Impact Physics or Matter Physics. However,
 * if Container _children_ are enabled for physics you may get unexpected results, such as offset bodies,
 * if the Container itself, or any of its ancestors, is positioned anywhere other than at 0 x 0. Container children
 * with physics do not factor in the Container due to the excessive extra calculations needed. Please structure
 * your game to work around this.
 *
 * It's important to understand the impact of using Containers. They add additional processing overhead into
 * every one of their children. The deeper you nest them, the more the cost escalates. This is especially true
 * for input events. You also loose the ability to set the display depth of Container children in the same
 * flexible manner as those not within them. In short, don't use them for the sake of it. You pay a small cost
 * every time you create one, try to structure your game around avoiding that where possible.
 *
 * @class Container
 * @extends Phaser.GameObjects.GameObject
 * @memberOf Phaser.GameObjects
 * @constructor
 * @since 3.4.0
 *
 * @extends Phaser.GameObjects.Components.Alpha
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.ComputedSize
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} [x=0] - The horizontal position of this Game Object in the world.
 * @param {number} [y=0] - The vertical position of this Game Object in the world.
 * @param {Phaser.GameObjects.GameObject[]} [children] - An optional array of Game Objects to add to this Container.
 */
declare var Container: any;
