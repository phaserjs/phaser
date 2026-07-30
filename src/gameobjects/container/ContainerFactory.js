/**
 * @author       Richard Davey <rich@phaser.io>
 * @author       Felipe Alfonso <@bitnenfer>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Container = require('./Container');
var GameObjectFactory = require('../GameObjectFactory');

/**
 * Creates a new Container Game Object and adds it to the Scene.
 *
 * A Container is a special type of Game Object that can hold other Game Objects as children.
 * You can use a Container to group related Game Objects together, then move, rotate, scale,
 * or set the alpha of the Container to affect all of its children at once. Children are
 * rendered relative to the Container's position and transform, making Containers useful for
 * building composite objects, UI panels, or any group of Game Objects that should move together.
 *
 * Note: This method will only be available if the Container Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#container
 * @since 3.4.0
 *
 * @param {number} [x=0] - The horizontal position of this Game Object in the world.
 * @param {number} [y=0] - The vertical position of this Game Object in the world.
 * @param {Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[]} [children] - An optional Game Object, or array of Game Objects, to add to this Container.
 *
 * @return {Phaser.GameObjects.Container} The Game Object that was created.
 */
GameObjectFactory.register('container', function (x, y, children)
{
    return this.displayList.add(new Container(this.scene, x, y, children));
});
