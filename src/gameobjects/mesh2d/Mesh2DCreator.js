/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BuildGameObject = require('../BuildGameObject');
var GameObjectCreator = require('../GameObjectCreator');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var Mesh2D = require('./Mesh2D');

/**
 * Creates a new Mesh2D Game Object and returns it.
 *
 * Note: This method will only be available if the Mesh2D Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#mesh2d
 * @since 4.2.0
 *
 * @param {Phaser.Types.GameObjects.GameObjectConfig} config - The configuration object this Game Object will use to create itself.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.Mesh2D} The Game Object that was created.
 */
GameObjectCreator.register('mesh2d', function (config, addToScene)
{
    if (config === undefined) { config = {}; }

    var key = GetAdvancedValue(config, 'key', null);
    var vertices = GetAdvancedValue(config, 'vertices', []);
    var indices = GetAdvancedValue(config, 'indices', []);
    var flipV = GetAdvancedValue(config, 'flipV', false);

    var mesh2d = new Mesh2D(this.scene, 0, 0, key, vertices, indices, flipV);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    BuildGameObject(this.scene, mesh2d, config);

    return mesh2d;
});

//  When registering a factory function 'this' refers to the GameObjectCreator context.
