/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BuildGameObject = require('../BuildGameObject');
var Layer = require('./Layer');
var GameObjectCreator = require('../GameObjectCreator');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');

/**
 * Creates a new Layer Game Object and returns it.
 *
 * Note: This method will only be available if the Layer Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#layer
 * @since 3.50.0
 *
 * @param {Phaser.Types.GameObjects.Sprite.SpriteConfig} config - The configuration object this Game Object will use to create itself.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.Layer} The Game Object that was created.
 */
GameObjectCreator.register('layer', function (config, addToScene)
{
    if (config === undefined) { config = {}; }

    var children = GetAdvancedValue(config, 'children', null);

    var layer = new Layer(this.scene, children);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    BuildGameObject(this.scene, layer, config);

    return layer;
});
