/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var LightLayer = require('./LightLayer');
var GameObjectFactory = require('../GameObjectFactory');

/**
 * Creates a new Light Layer Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the Light Layer Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#lightlayer
 * @since 3.50.0
 *
 * @param {Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[]} [children] - An optional array of Game Objects to add to this Layer.
 *
 * @return {Phaser.GameObjects.LightLayer} The Game Object that was created.
 */
GameObjectFactory.register('lightlayer', function (children)
{
    return this.displayList.add(new LightLayer(this.scene, children));
});
