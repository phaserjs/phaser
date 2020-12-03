/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GameObjectFactory = require('../GameObjectFactory');
var PointLight = require('./PointLight');

/**
 * Creates a new Point Light Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the Point Light Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#pointlight
 * @since 3.50.0
 *
 *
 * @return {Phaser.GameObjects.PointLight} The Game Object that was created.
 */
GameObjectFactory.register('pointlight', function (x, y, color, radius, intensity, attenuation)
{
    return this.displayList.add(new PointLight(this.scene, x, y, color, radius, intensity, attenuation));
});
