/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Layer = require('./Layer');
var GameObjectFactory = require('../GameObjectFactory');

/**
 * Creates a new Layer Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the Layer Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#layer
 * @since 3.50.0
 *
 * @param {Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[]} [children] - An optional array of Game Objects to add to this Layer.
 *
 * @return {Phaser.GameObjects.Layer} The Game Object that was created.
 */
GameObjectFactory.register('layer', function (children)
{
    return this.displayList.add(new Layer(this.scene, children));
});
