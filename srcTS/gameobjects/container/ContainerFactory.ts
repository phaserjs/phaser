/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Felipe Alfonso <@bitnenfer>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Container = require('./Container');
var GameObjectFactory = require('../GameObjectFactory');

/**
 * Creates a new Container Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the Container Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#container
 * @since 3.4.0
 *
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[]} [children] - An optional array of Game Objects to add to this Container.
 *
 * @return {Phaser.GameObjects.Container} The Game Object that was created.
 */
GameObjectFactory.register('container', function (x, y, children)
{
    return this.displayList.add(new Container(this.scene, x, y, children));
});
