/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BuildGameObject = require('../BuildGameObject');
var GameObjectCreator = require('../GameObjectCreator');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var RenderFilters = require('./RenderFilters');

/**
 * Creates a new RenderFilters Game Object and returns it.
 *
 * Note: This method will only be available if the RenderFilters Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#renderFilters
 * @since 3.0.0
 *
 * @param {Phaser.Types.GameObjects.RenderFilters.RenderFiltersConfig} config - The configuration object this Game Object will use to create itself.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.RenderFilters} The Game Object that was created.
 */
GameObjectCreator.register('renderFilters', function (config, addToScene)
{
    if (config === undefined) { config = {}; }

    var child = GetAdvancedValue(config, 'child', null);

    var renderFilters = new RenderFilters(this.scene, child, 0, 0);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    BuildGameObject(this.scene, renderFilters, config);

    return renderFilters;
});

//  When registering a factory function 'this' refers to the GameObjectCreator context.
