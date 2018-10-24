/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var SpineGameObject = require('./SpineGameObject');
var GameObjectFactory = require('../../../../src/gameobjects/GameObjectFactory');

/**
 * Creates a new Spine Game Object Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the Spine Plugin has been built or loaded into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#spine
 * @since 3.16.0
 *
 * @param {number} x - The horizontal position of this Game Object.
 * @param {number} y - The vertical position of this Game Object.
 * @param {string} texture - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {(string|integer)} [frame] - An optional frame from the Texture this Game Object is rendering with.
 *
 * @return {Phaser.GameObjects.SpineGameObject} The Game Object that was created.
 */
GameObjectFactory.register('spine', function (x, y, key, animation)
{
    var spine = new SpineGameObject(this.scene, x, y, key, animation);

    this.displayList.add(spine);
    this.updateList.add(spine);

    return spine;
});
