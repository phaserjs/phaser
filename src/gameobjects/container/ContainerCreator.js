/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Felipe Alfonso <@bitnenfer>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BuildGameObject = require('../BuildGameObject');
var Container = require('./Container');
var GameObjectCreator = require('../GameObjectCreator');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');

/**
 * Creates a new Container Game Object and returns it.
 *
 * Note: This method will only be available if the Container Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#container
 * @since 3.4.0
 *
 * @param {object} config - The configuration object this Game Object will use to create itself.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.Container} The Game Object that was created.
 */
GameObjectCreator.register('container', function (config, addToScene)
{
    if (config === undefined) { config = {}; }

    var x = GetAdvancedValue(config, 'x', 0);
    var y = GetAdvancedValue(config, 'y', 0);
    var children = GetAdvancedValue(config, 'children', null);

    var container = new Container(this.scene, x, y, children);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    BuildGameObject(this.scene, container, config);

    return container;
});
