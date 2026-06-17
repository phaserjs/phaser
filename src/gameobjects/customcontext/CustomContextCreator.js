/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BuildGameObject = require('../BuildGameObject');
var GameObjectCreator = require('../GameObjectCreator');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var CustomContext = require('./CustomContext');

/**
 * Creates a new CustomContext Game Object and returns it.
 *
 * Note: This method will only be available if the CustomContext Game Object and WebGL support have been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#customContext
 * @since 4.NEXT
 *
 * @param {Phaser.Types.GameObjects.CustomContext.CustomContextConfig} config - The configuration object this Game Object will use to create itself.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.CustomContext} The Game Object that was created.
 */
GameObjectCreator.register('customContext', function (config, addToScene)
{
    if (config === undefined) { config = {}; }

    var x = GetAdvancedValue(config, 'x', 0);
    var y = GetAdvancedValue(config, 'y', 0);
    var children = GetAdvancedValue(config, 'children', null);
    var customContextCallback = GetAdvancedValue(config, 'customContextCallback', undefined);

    var customContext = new CustomContext(this.scene, x, y, children, customContextCallback);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    BuildGameObject(this.scene, customContext, config);

    return customContext;
});

//  When registering a factory function 'this' refers to the GameObjectCreator context.
