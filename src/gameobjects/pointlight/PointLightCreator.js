/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BuildGameObject = require('../BuildGameObject');
var GameObjectCreator = require('../GameObjectCreator');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var PointLight = require('./PointLight');

/**
 * Creates a new Point Light Game Object and returns it.
 *
 * Note: This method will only be available if the Point Light Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#pointlight
 * @since 3.50.0
 *
 * @param {object} config - The configuration object this Game Object will use to create itself.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.PointLight} The Game Object that was created.
 */
GameObjectCreator.register('pointlight', function (config, addToScene)
{
    if (config === undefined) { config = {}; }

    var color = GetAdvancedValue(config, 'color', 0xffffff);
    var radius = GetAdvancedValue(config, 'radius', 128);
    var intensity = GetAdvancedValue(config, 'intensity', 1);
    var attenuation = GetAdvancedValue(config, 'attenuation', 0.1);

    var layer = new PointLight(this.scene, 0, 0, color, radius, intensity, attenuation);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    BuildGameObject(this.scene, layer, config);

    return layer;
});
