/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BuildGameObject = require('../BuildGameObject');
var Stencil = require('./Stencil');
var GameObjectCreator = require('../GameObjectCreator');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var GetFastValue = require('../../utils/object/GetFastValue');

/**
 * Creates a new Stencil Game Object and returns it.
 *
 * Note: This method will only be available if the Stencil Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#stencil
 * @since 4.NEXT
 *
 * @param {Phaser.Types.GameObjects.Stencil.StencilConfig} config - The configuration object this Game Object will use to create itself.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.Stencil} The Game Object that was created.
 */
GameObjectCreator.register('stencil', function (config, addToScene)
{
    if (config === undefined) { config = {}; }

    var x = GetAdvancedValue(config, 'x', 0);
    var y = GetAdvancedValue(config, 'y', 0);
    var children = GetFastValue(config, 'children', null);
    var options = GetAdvancedValue(config, 'options', {});

    var stencil = new Stencil(this.scene, x, y, children, options);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    BuildGameObject(this.scene, stencil, config);

    return stencil;
});
